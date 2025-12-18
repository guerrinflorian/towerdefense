// On importe ENEMIES depuis settings.js car c'est là qu'on l'a regroupé
import { ENEMIES } from "../config/settings.js";

export class Enemy extends Phaser.GameObjects.Container {
  constructor(scene, path, typeKey) {
    super(scene, -100, -100);

    this.scene = scene;
    this.path = path;
    this.typeKey = typeKey;

    // --- DEBUG & INIT ---
    if (!ENEMIES) {
      console.error("ERREUR CRITIQUE : ENEMIES non chargé.");
      return;
    }
    if (!ENEMIES[typeKey]) {
      console.error(`ERREUR : Le type '${typeKey}' n'existe pas.`);
      this.stats = ENEMIES["grunt"];
    } else {
      this.stats = ENEMIES[typeKey];
    }

    // --- STATS ---
    this.hp = this.stats.hp;
    this.maxHp = this.stats.hp;
    this.speed = this.stats.speed;
    this.attackDamage = this.stats.damage || 10;
    this.attackSpeed = this.stats.attackSpeed || 1000;
    this.attackRange = this.stats.attackRange || 30;
    this.isRanged = this.stats.isRanged || false;
    this.facingRight = true;
    this.lastAttackTime = 0;
    this.targetSoldier = null;

    // --- ÉTATS SPÉCIAUX ---
    
    // Paralysie (Glace/Sorts)
    this.isParalyzed = false;
    this.paralysisTimer = null;
    this.originalSpeed = this.speed;
    this.paralysisOverlay = null;

    // Spawn (Sorcière)
    this.spawnTimer = null;
    this.lastSpawnTime = 0;

    // Tortue-Dragon : carapace
    this.isInShell = false;
    this.shellTimer = null;
    this.isInvulnerable = false;
    this.hasUsedShell = false; // Pour qu'elle ne le fasse qu'une fois
    this.shellThreshold = this.stats.shellThreshold || null;

    // Shaman Gobelin : soin
    this.lastHealTime = 0;
    this.healInterval = this.stats.healInterval || null;
    this.healAmount = this.stats.healAmount || 0;
    this.healRadius = this.stats.healRadius || 0;

    // --- LOGIQUE DE POSITIONNEMENT (Anti-Stacking) ---
    // Offset cible (là où l'ennemi veut aller sur la largeur du chemin)
    this.targetPathOffset = (Math.random() - 0.5) * 25; 
    this.currentPathOffset = this.targetPathOffset;
    this.separationRadius = 22; // Rayon de "bulle" personnelle
    this.maxPathWidth = 25; // Limite pour ne pas sortir du chemin

    // États de mouvement
    this.isBlocked = false;
    this.blockedBy = null;

    // --- 1. VISUEL ---
    // Ombre
    const shadow = scene.add.ellipse(0, 15, 30, 10, 0x000000, 0.5);
    this.add(shadow);

    // Corps
    this.bodyGroup = scene.add.container(0, 0);
    this.add(this.bodyGroup);

    // Dessin personnalisé (Settings) ou Carré par défaut
    if (this.stats.onDraw) {
      this.stats.onDraw(this.scene, this.bodyGroup, this.stats.color, this);
    } else {
      const fallback = scene.add.rectangle(0, 0, 32, 32, this.stats.color || 0xffffff);
      this.bodyGroup.add(fallback);
    }

    // --- 2. BARRE DE VIE (CORRIGÉE) ---
    this.drawHealthBar(scene);

    // Initialisation Phaser
    this.scene.add.existing(this);
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };

    // Tooltip HP (Souris)
    this.hpTooltip = null;
    this.setSize(32, 32);
    this.setInteractive({ useHandCursor: false });
    this.on("pointerover", () => { if (this.active) this.showHpTooltip(); });
    this.on("pointerout", () => this.hideHpTooltip());
  }

  // =========================================================
  //                     BOUCLE PRINCIPALE
  // =========================================================

  update(time, delta) {
    if (this.isParalyzed) return;
    
    // Si dans la carapace (Tortue), on ne fait RIEN (pas de mouvement, pas d'attaque)
    if (this.isInShell) {
        // On continue juste l'animation visuelle pour l'effet de tremblement
        if (this.stats.onUpdateAnimation) this.stats.onUpdateAnimation(time, this);
        return; 
    }

    // 1. Gestion des Spawns (Sorcière)
    if (this.stats.spawnInterval && this.active) {
      const currentTime = this.scene.time.now;
      if (currentTime - this.lastSpawnTime >= this.stats.spawnInterval) {
        this.spawnMinions();
        this.lastSpawnTime = currentTime;
      }
    }

    // 2. Gestion du Soin (Shaman)
    if (this.healInterval && this.active) {
      const currentTime = this.scene.time.now;
      if (currentTime - this.lastHealTime >= this.healInterval) {
        this.healNearbyEnemies();
        this.lastHealTime = currentTime;
      }
    }
    
    // 3. Ajustement de l'espacement (Anti-Stacking)
    this.adjustSpacing(delta);

    // 4. Animation Custom (Boss, Slimes, etc.)
    if (this.active && this.stats && this.stats.onUpdateAnimation) {
      this.stats.onUpdateAnimation(time, this);
    }

    // 5. Combat
    if (this.active && !this.isBlocked) {
      this.updateCombat(time);
    }
  }

  // =========================================================
  //                  MOUVEMENT & ESPACEMENT
  // =========================================================

  spawn() {
    if (!this.path) return;

    this.isBlocked = false;
    this.blockedBy = null;
    this.facingRight = true;

    // Initialisation des timers
    if (this.stats.spawnInterval) this.lastSpawnTime = this.scene.time.now;
    if (this.healInterval) this.lastHealTime = this.scene.time.now;

    if (this.bodyGroup) {
      this.bodyGroup.setScale(1, 1);
      this.bodyGroup.rotation = 0;
    }

    const pathLength = this.path.getLength();
    const duration = (pathLength / this.speed) * 1000;

    const tween = this.scene.tweens.add({
      targets: this.follower,
      t: 1,
      duration: duration,
      onUpdate: () => {
        // Si bloqué ou caché, on arrête le calcul de position sur le chemin
        if (this.isBlocked || this.isInShell) return;

        const p = this.path.getPoint(this.follower.t, this.follower.vec);
        
        // Calculer la normale pour appliquer l'offset latéral
        const nextT = Math.min(this.follower.t + 0.01, 1);
        const nextP = this.path.getPoint(nextT);
        const dx = nextP.x - p.x;
        const dy = nextP.y - p.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        // Appliquer l'offset dynamique
        if (length > 0) {
          const perpX = -dy / length; 
          const perpY = dx / length;  
          
          const offsetX = perpX * this.currentPathOffset;
          const offsetY = perpY * this.currentPathOffset;
          
          this.setPosition(p.x + offsetX, p.y + offsetY);
        } else {
          this.setPosition(p.x, p.y);
        }
        
        // Gestion de la profondeur (Z-Index)
        const baseDepth = 10 + Math.floor(this.follower.t * 50);
        this.setDepth(baseDepth);
        
        // S'assurer que la barre de vie reste au-dessus
        if (this.hpBarContainer) {
          this.hpBarContainer.setDepth(1000); // Toujours au-dessus du corps
        }

        // Orientation (Flip) - Sauf pour les Boss qui ont shouldRotate=false
        if (this.stats.shouldRotate !== false) {
             const absDx = Math.abs(dx);
             const absDy = Math.abs(dy);
             if (absDx > absDy * 0.3) {
               const shouldFaceRight = dx > 0;
               if (shouldFaceRight !== this.facingRight) {
                 this.facingRight = shouldFaceRight;
                 this.bodyGroup.setScale(this.facingRight ? 1 : -1, 1);
               }
             }
        }
        this.bodyGroup.rotation = 0;
      },
      onComplete: () => {
        if (this.active && !this.isBlocked) {
          this.scene.takeDamage();
          this.destroy();
        }
      },
    });

    this.follower.tween = tween;
  }

  adjustSpacing(delta) {
    if (!this.scene || !this.scene.enemies || !this.active || !this.path) return;

    let pushForce = 0;
    // Vecteur direction du chemin
    const t = this.follower.t;
    const pCurrent = this.path.getPoint(t);
    const pNext = this.path.getPoint(Math.min(t + 0.01, 1));
    const dirX = pNext.x - pCurrent.x;
    const dirY = pNext.y - pCurrent.y;
    const len = Math.sqrt(dirX*dirX + dirY*dirY);
    if (len === 0) return;
    
    // Vecteur Normal (perpendiculaire)
    const normX = -dirY / len;
    const normY = dirX / len;

    this.scene.enemies.children.each((other) => {
      if (other === this || !other.active) return;

      const dist = Phaser.Math.Distance.Between(this.x, this.y, other.x, other.y);
      if (dist < this.separationRadius) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        
        // Produit scalaire pour savoir si l'autre est à gauche ou droite
        const dot = dx * normX + dy * normY;

        if (dot > 0) pushForce -= 1.5; 
        else pushForce += 1.5;
        
        if (Math.abs(dot) < 0.1 && dist < 5) pushForce += (Math.random() > 0.5 ? 2 : -2);
      }
    });

    // Appliquer et limiter
    const speed = 0.8;
    this.targetPathOffset += pushForce * speed;
    this.targetPathOffset = Phaser.Math.Clamp(this.targetPathOffset, -this.maxPathWidth, this.maxPathWidth);
    this.currentPathOffset = Phaser.Math.Linear(this.currentPathOffset, this.targetPathOffset, 0.1);
  }

  // =========================================================
  //                  COMBAT & DÉGÂTS
  // =========================================================

  damage(amount) {
    // 1. Tortue-Dragon : Invulnérable si cachée
    if (this.isInvulnerable) return;

    this.hp -= amount;
    
    // Update Visuel
    if (this.hpTooltip) this.hpTooltip.setText(`${Math.ceil(this.hp)} / ${this.maxHp} HP`);
    if (this.bodyGroup) {
      this.scene.tweens.add({ targets: this.bodyGroup, alpha: 0.5, duration: 50, yoyo: true });
    }
    this.updateHealthBar();

    // 2. Tortue-Dragon : Vérifier seuil pour entrer dans la carapace
    if (this.shellThreshold && !this.isInShell && !this.hasUsedShell) {
      const hpPercent = this.hp / this.maxHp;
      if (hpPercent <= this.shellThreshold) {
        this.enterShell();
        return; // On arrête là pour l'instant
      }
    }

    // 3. Mort
    if (this.hp <= 0) {
      // Gestion des bloquages
      if (this.isBlocked && this.blockedBy) {
        this.blockedBy.releaseEnemy();
      }
      if (this.isParalyzed) this.removeParalysis();

      // 4. Slimes / Diviseurs : Appel de la fonction onDeath définie dans settings.js
      if (this.stats.onDeath) {
        this.stats.onDeath(this);
      }

      this.hideHpTooltip();
      this.scene.earnMoney(this.stats.reward);
      this.explode();
      this.destroy();
    }
  }

  updateCombat(time) {
    if (this.isRanged) {
      this.findRangedTarget();
      if (this.targetSoldier && this.targetSoldier.active && this.targetSoldier.isAlive) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, this.targetSoldier.x, this.targetSoldier.y);
        const stopDist = 64 * (this.scene.scaleFactor || 1); // ~1 case

        if (dist <= this.attackRange) {
          if (dist <= stopDist) {
            // Pause pour tirer
            if (this.follower.tween && !this.follower.tween.isPaused()) this.follower.tween.pause();
            
            if (time - this.lastAttackTime >= this.attackSpeed) {
              this.attackSoldierRanged(this.targetSoldier);
              this.lastAttackTime = time;
            }
          } else {
            // Avancer
            if (this.follower.tween && this.follower.tween.isPaused()) this.follower.tween.resume();
          }
        } else {
          // Trop loin
          if (this.follower.tween && this.follower.tween.isPaused()) this.follower.tween.resume();
          this.targetSoldier = null;
        }
      } else {
         if (this.follower.tween && this.follower.tween.isPaused()) this.follower.tween.resume();
      }
    } else {
      // Mêlée
      if (this.isBlocked && this.blockedBy) {
        if (time - this.lastAttackTime >= this.attackSpeed) {
          this.blockedBy.takeDamage(this.attackDamage);
          this.lastAttackTime = time;
        }
      }
    }
  }

  findRangedTarget() {
    if (!this.scene || !this.scene.soldiers) return;
    const soldiers = this.scene.soldiers.getChildren();
    let closest = null;
    let minDist = this.attackRange;

    for (const soldier of soldiers) {
      if (soldier.active && soldier.isAlive) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, soldier.x, soldier.y);
        if (dist <= this.attackRange && dist < minDist) {
          minDist = dist;
          closest = soldier;
        }
      }
    }
    this.targetSoldier = closest;
  }

  attackSoldierRanged(soldier) {
    if (!soldier || !soldier.active || !soldier.isAlive) return;

    // Création projectile (Hache ou autre)
    const startX = this.x;
    const startY = this.y;
    const endX = soldier.x;
    const endY = soldier.y;

    const projectile = this.scene.add.graphics();
    projectile.fillStyle(0xffffff);
    projectile.fillCircle(0,0, 4);
    projectile.setPosition(startX, startY);
    projectile.setDepth(100);

    this.scene.tweens.add({
      targets: projectile,
      x: endX, y: endY, duration: 400,
      onComplete: () => {
        if (soldier.active && soldier.isAlive) soldier.takeDamage(this.attackDamage);
        projectile.destroy();
      }
    });
  }

  // =========================================================
  //                  CAPACITÉS SPÉCIALES
  // =========================================================

  // --- TORTUE DRAGON ---
  enterShell() {
    if (this.isInShell) return;
    this.isInShell = true;
    this.isInvulnerable = true;
    this.hasUsedShell = true;
    
    if (this.follower.tween) this.follower.tween.pause();

    // Sortir après X ms (défini dans settings ou par défaut 3000)
    const duration = this.stats.shellDuration || 3000;
    this.shellTimer = this.scene.time.delayedCall(duration, () => {
       if (this.active) this.exitShell();
    });
  }

  exitShell() {
    if (!this.isInShell) return;
    this.isInShell = false;
    this.isInvulnerable = false;
    if (this.follower.tween && !this.isBlocked) this.follower.tween.resume();
  }

  // --- SHAMAN ---
  healNearbyEnemies() {
    if (!this.scene.enemies) return;
    
    // Conversion rayon cases -> pixels
    const tileSize = 64 * (this.scene.scaleFactor || 1);
    const radiusPixel = this.healRadius * tileSize; // Pour être sûr
    
    // Visuel
    const healEffect = this.scene.add.graphics();
    healEffect.lineStyle(2, 0x00ff00, 0.5);
    healEffect.strokeCircle(this.x, this.y, radiusPixel);
    healEffect.setDepth(5);
    this.scene.tweens.add({ targets: healEffect, alpha: 0, scale: 1.2, duration: 500, onComplete: () => healEffect.destroy() });

    // Logique
    let hasHealed = false;
    this.scene.enemies.children.each((enemy) => {
      if (enemy === this || !enemy.active || enemy.hp >= enemy.maxHp) return;
      
      const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
      if (dist <= radiusPixel) {
        enemy.hp = Math.min(enemy.hp + this.healAmount, enemy.maxHp);
        enemy.updateHealthBar();
        hasHealed = true;
        
        // Texte flottant
        const txt = this.scene.add.text(enemy.x, enemy.y - 40, `+${this.healAmount}`, {
            fontSize: '16px', fill: '#00ff00', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(300);
        this.scene.tweens.add({ targets: txt, y: enemy.y - 60, alpha: 0, duration: 800, onComplete: () => txt.destroy() });
      }
    });
  }

  // --- SORCIÈRE ---
  spawnMinions() {
     if (!this.stats.spawnType) return;
     
     const spawnCount = this.stats.spawnCount || 3;
     const type = this.stats.spawnType;
     
     for(let i=0; i<spawnCount; i++) {
        const minion = new Enemy(this.scene, this.path, type);
        minion.follower.t = Math.max(0, this.follower.t - 0.05 - (i*0.02));
        const p = this.path.getPoint(minion.follower.t);
        minion.setPosition(p.x, p.y);
        minion.spawn();
        this.scene.enemies.add(minion);
     }
  }

  // =========================================================
  //                  UTILITAIRES & UI
  // =========================================================

  drawHealthBar(scene) {
    const yOffset = -50;
    const width = 40;
    const height = 6;
    
    // 1. On crée les rectangles
    this.hpBg = scene.add.rectangle(0, yOffset, width + 2, height + 2, 0x000000);
    this.hpBg.setStrokeStyle(1, 0xffffff);
    this.hpRed = scene.add.rectangle(0, yOffset, width, height, 0x330000);
    this.hpGreen = scene.add.rectangle(-width / 2, yOffset, width, height, 0x00ff00);
    this.hpGreen.setOrigin(0, 0.5);

    // 2. On les met dans un conteneur dédié à la barre de vie
    this.hpBarContainer = scene.add.container(0, 0);
    this.hpBarContainer.add([this.hpBg, this.hpRed, this.hpGreen]);
    
    // 3. On ajoute ce conteneur à l'ennemi (this)
    this.add(this.hpBarContainer);
    
    // 4. FIX : Si l'ennemi a un scale (ex: 1.3), on INVERSE le scale de la barre (ex: 0.76)
    // Cela annule l'effet de grossissement, la barre garde sa taille d'origine.
    if (this.stats.scale && this.stats.scale !== 1) {
        this.hpBarContainer.setScale(1 / this.stats.scale);
    }
  }

  updateHealthBar() {
    const pct = Phaser.Math.Clamp(this.hp / this.maxHp, 0, 1);
    let newWidth = 40 * pct;
    if (this.hp > 0 && newWidth < 2) newWidth = 2;
    this.hpGreen.width = newWidth;
    if (pct < 0.25) this.hpGreen.fillColor = 0xff0000;
    else if (pct < 0.5) this.hpGreen.fillColor = 0xffa500;
    else this.hpGreen.fillColor = 0x00ff00;
  }

  showHpTooltip() {
    if (!this.active) return;
    if (this.hpTooltip) this.hpTooltip.destroy();
    const fontSize = Math.max(12, 14 * (this.scene.scaleFactor || 1));
    this.hpTooltip = this.scene.add.text(this.x, this.y - 60, `${Math.ceil(this.hp)} / ${this.maxHp} HP`, {
        fontSize: `${fontSize}px`, fill: "#ffffff", backgroundColor: "#000000", padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(300);

    if (this.tooltipUpdateTimer) this.tooltipUpdateTimer.remove();
    this.tooltipUpdateTimer = this.scene.time.addEvent({
      delay: 50, callback: () => {
        if (this.hpTooltip && this.active) {
            this.hpTooltip.setPosition(this.x, this.y - 60);
            this.hpTooltip.setText(`${Math.ceil(this.hp)} / ${this.maxHp} HP`);
        } else if (this.hpTooltip) this.hideHpTooltip();
      }, loop: true,
    });
  }

  hideHpTooltip() {
    if (this.hpTooltip) { this.hpTooltip.destroy(); this.hpTooltip = null; }
    if (this.tooltipUpdateTimer) { this.tooltipUpdateTimer.remove(); this.tooltipUpdateTimer = null; }
  }

  paralyze(duration) {
    if (this.isParalyzed) { if (this.paralysisTimer) this.paralysisTimer.remove(); }
    this.isParalyzed = true; 
    this.originalSpeed = this.speed; 
    this.speed = 0;
    
    // Overlay visuel
    if (!this.paralysisOverlay) {
        this.paralysisOverlay = this.scene.add.graphics();
        this.paralysisOverlay.fillStyle(0x4444ff, 0.3);
        this.paralysisOverlay.fillCircle(0, 0, 25);
        this.add(this.paralysisOverlay);
    }
    if (this.follower.tween) this.follower.tween.pause();
    this.paralysisTimer = this.scene.time.delayedCall(duration, () => { if(this.active) this.removeParalysis(); });
  }

  removeParalysis() {
    if (!this.isParalyzed) return;
    this.isParalyzed = false; 
    this.speed = this.originalSpeed;
    if (this.paralysisOverlay) { this.paralysisOverlay.destroy(); this.paralysisOverlay = null; }
    if (this.follower.tween && !this.isBlocked && !this.isInShell) this.follower.tween.resume();
  }

  explode() {
    for (let i = 0; i < 6; i++) {
      const p = this.scene.add.rectangle(this.x, this.y, 8, 8, this.stats.color);
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 40 + 20;
      this.scene.tweens.add({
        targets: p, x: this.x + Math.cos(angle) * speed, y: this.y + Math.sin(angle) * speed,
        alpha: 0, scale: 0.2, duration: 400, onComplete: () => p.destroy(),
      });
    }
  }

  destroy(fromScene) {
    if (this.paralysisTimer) this.paralysisTimer.remove();
    if (this.spawnTimer) this.spawnTimer.remove();
    if (this.shellTimer) this.shellTimer.remove();
    if (this.tooltipUpdateTimer) this.tooltipUpdateTimer.remove();
    if (this.hpTooltip) this.hpTooltip.destroy();
    if (this.paralysisOverlay) this.paralysisOverlay.destroy();
    super.destroy(fromScene);
  }
}