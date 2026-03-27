import { CONFIG, ENEMIES } from "../../../config/settings.js";
import { showFloatingDamage } from "../../../utils/floatingDamage.js";

export class Chapter2Enemy extends Phaser.GameObjects.Container {
  constructor(scene, path, typeKey) {
    super(scene, -100, -100);

    this.scene = scene;
    this.path = path;
    this.typeKey = typeKey;

    this.stats = ENEMIES && ENEMIES[typeKey] ? ENEMIES[typeKey] : ENEMIES?.grunt || {};

    this.hp = this.stats.hp || 100;
    this.maxHp = this.hp;
    const scaleFactor = scene.scaleFactor || 1;
    const collisionScale = scene.collisionScale || scaleFactor;
    this.speed = (this.stats.speed || 50) * scaleFactor;
    this.attackDamage = this.stats.damage || 10;
    this.playerDamage = this.stats.playerDamage || 1;
    this.attackSpeed = this.stats.attackSpeed || 1000;
    this.attackRange = (this.stats.attackRange || 30) * collisionScale;
    this.isRanged = this.stats.isRanged || false;

    this.progress = 0;
    this.isMoving = false;
    this.facingRight = true;
    this.lastAttackTime = 0;
    this.targetSoldier = null;
    this.isBlocked = false;
    this.blockedBy = null;
    this.hasUsedShell = false;

    // Système de lanes amélioré - évitement sans blocage
    this.laneOffset = (Math.random() - 0.5) * 15 * collisionScale;
    this.targetLaneOffset = this.laneOffset;
    this.avoidanceRadius = 40 * collisionScale; // Distance de détection des voisins
    this.personalSpace = 25 * collisionScale; // Espace personnel minimum
    this.maxLaneWidth = 30 * collisionScale; // Largeur maximale des lanes
    
    // Vitesses de réaction plus rapides
    this.laneChangeSpeed = 0.2; // Changement de lane rapide
    this.tangentSmoothSpeed = 0.35;
    this.previousTangent = null;

    // Pas de ralentissement - juste de l'évitement latéral
    this.baseSpeedVariation = 0.95 + Math.random() * 0.1; // Petite variation naturelle

    this.isParalyzed = false;
    this.paralysisTimer = null;
    this.paralysisPosition = null;
    this.isInShell = false;
    this.isInvulnerable = false;
    this.shellThreshold = this.stats.shellThreshold || null;
    this.lastHealTime = 0;
    this.healInterval = this.stats.healInterval || null;
    this.lastSpawnTime = 0;
    this.lastDamageSource = null;
    this.lastTurretType = null; // Type de tourelle qui a infligé les derniers dégâts

    // Mécaniques spéciales des nouveaux monstres
    this.berserkerMode = this.stats.berserkerMode || false;
    this.vampireLifesteal = this.stats.vampireLifesteal || 0;
    this.screamRadius = this.stats.screamRadius || 0;
    this.screamDuration = this.stats.screamDuration || 0;
    this.screamCooldown = this.stats.screamCooldown || 0;
    this.lastScreamTime = 0;
    this.buffRadius = this.stats.buffRadius || 0;
    this.buffMultiplier = this.stats.buffMultiplier || 1;
    this.isBuffed = false;
    this.buffVisual = null;
    this.jammingRadius = this.stats.jammingRadius || 0;
    this.isJammed = false; // Statut de brouillage de la barre de vie
    
    // Berserker : gain de PV au fil du temps
    this.hpGrowthEnabled = this.stats.hpGrowthEnabled || false;
    this.hpGrowthInterval = this.stats.hpGrowthInterval || 1000;
    this.hpGrowthPercent = this.stats.hpGrowthPercent || 0.01;
    this.lastHpGainTime = 0;
    this.spawnTime = 0; // Sera initialisé lors du spawn
    
    // Vampire : récupère des PV quand un ennemi meurt à proximité
    this.vampireDeathFeast = this.stats.vampireDeathFeast || false;
    this.vampireDeathFeastRadius = this.stats.vampireDeathFeastRadius || 2;
    this.vampireDeathFeastPercent = this.stats.vampireDeathFeastPercent || 0.25;

    this.initVisuals();

    this.scene.add.existing(this);
    const unitScale = scene.unitScale || scene.scaleFactor || 1;
    const hitboxScale = scene.collisionScale || scene.scaleFactor || 1;
    this.setSize(32 * hitboxScale, 32 * hitboxScale);
    this.setScale(Phaser.Math.Clamp(unitScale, 0.45, 1.05));
    this.setInteractive();

    this.on("pointerover", () => this.showHpTooltip());
    this.on("pointerout", () => this.hideHpTooltip());
  }

  initVisuals() {
    if (!this.scene) return;
    const shadow = this.scene.add.ellipse(0, 15, 30, 10, 0x000000, 0.3);
    this.add(shadow);

    this.bodyGroup = this.scene.add.container(0, 0);
    this.add(this.bodyGroup);

    if (this.stats.onDraw) {
      this.stats.onDraw(this.scene, this.bodyGroup, this.stats.color, this);
    } else {
      const rect = this.scene.add.rectangle(0, 0, 32, 32, this.stats.color || 0xffffff);
      this.bodyGroup.add(rect);
    }
    this.drawHealthBar();
  }

  spawn() {
    this.isMoving = !this.stats?.isStationary;
    this.progress = 0;
    if (this.path) {
      this.pathLength = this.path.getLength();
      this.previousTangent = this.calculateTangent(0);
    }
    // Initialiser le temps de spawn pour le berserker
    if (this.hpGrowthEnabled && this.scene?.time) {
      this.spawnTime = this.scene.time.now;
      this.lastHpGainTime = this.scene.time.now;
    }
  }

  calculateTangent(t) {
    const epsilon = 0.002;
    const t1 = Math.max(0, t - epsilon);
    const t2 = Math.min(1, t + epsilon);
    
    const p1 = this.path.getPoint(t1);
    const p2 = this.path.getPoint(t2);
    
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    if (len > 0.001) {
      return { x: dx / len, y: dy / len };
    }
    return { x: 1, y: 0 };
  }

  update(time, delta) {
    if (!this.active || !this.scene || this.scene.isPaused) return;

    // Si paralysé, maintenir la position
    if (this.isParalyzed) {
      if (this.paralysisPosition) {
        this.setPosition(this.paralysisPosition.x, this.paralysisPosition.y);
      }
      if (this.stats.onUpdateAnimation) {
        this.stats.onUpdateAnimation(time, this);
      }
      return;
    }

    // Si en carapace, ne pas bouger
    if (this.isInShell) {
      if (this.stats.onUpdateAnimation) {
        this.stats.onUpdateAnimation(time, this);
      }
      return;
    }

    // Calculer l'évitement (toujours actif, même si bloqué par un soldat)
    this.calculateAvoidance(delta);

    // Mouvement : toujours actif sauf si bloqué par un soldat
    if (this.isMoving && !this.isBlocked && this.path) {
      this.handleMovement(delta);
    }

    this.handleSpecialAbilities(time);
    this.updateCombat(time);

    // Vérifier le brouillage des barres de vie (pour tous les ennemis)
    this.updateJammingStatus();

    if (this.hpTooltip && this.hpTooltip.active) {
      this.hpTooltip.setPosition(this.x, this.y - 60);
      this.refreshHpTooltip();
    }

    if (this.stats.onUpdateAnimation) {
      this.stats.onUpdateAnimation(time, this);
    }
  }

  calculateAvoidance(delta) {
    if (!this.scene?.enemies) return;

    let totalAvoidanceX = 0;
    let totalAvoidanceY = 0;
    let neighborCount = 0;
    
    const neighbors = this.scene.enemies.getChildren();
    
    for (const other of neighbors) {
      if (other === this || !other.active) continue;

      const dx = this.x - other.x;
      const dy = this.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Si dans la zone d'évitement
      if (dist < this.avoidanceRadius && dist > 0.1) {
        // Calculer la force d'évitement (plus fort quand plus proche)
        const strength = Math.pow((this.avoidanceRadius - dist) / this.avoidanceRadius, 2);
        
        // Direction pour s'éloigner de l'autre ennemi
        const avoidX = (dx / dist) * strength;
        const avoidY = (dy / dist) * strength;
        
        totalAvoidanceX += avoidX;
        totalAvoidanceY += avoidY;
        neighborCount++;
      }
    }

    // Si on a des voisins, calculer l'évitement latéral
    if (neighborCount > 0 && this.previousTangent) {
      // Moyenne de l'évitement
      totalAvoidanceX /= neighborCount;
      totalAvoidanceY /= neighborCount;
      
      // Projeter l'évitement sur la normale du chemin (mouvement latéral seulement)
      const normalX = -this.previousTangent.y;
      const normalY = this.previousTangent.x;
      
      // Composante latérale de l'évitement
      const lateralAvoidance = totalAvoidanceX * normalX + totalAvoidanceY * normalY;
      
      // Ajuster le lane offset en fonction de l'évitement
      this.targetLaneOffset += lateralAvoidance * 50; // Multiplier pour un effet plus visible
    } else {
      // Retour progressif vers le centre quand pas de voisins
      this.targetLaneOffset *= 0.92;
    }

    // Limiter l'offset
    this.targetLaneOffset = Phaser.Math.Clamp(
      this.targetLaneOffset,
      -this.maxLaneWidth,
      this.maxLaneWidth
    );

    // Application progressive et fluide de l'offset
    this.laneOffset = Phaser.Math.Linear(
      this.laneOffset,
      this.targetLaneOffset,
      this.laneChangeSpeed
    );
  }

  handleMovement(delta) {
    if (!this.pathLength) return;

    // Vitesse constante avec juste une petite variation naturelle
    const effectiveSpeed = this.speed * this.baseSpeedVariation;
    const step = (effectiveSpeed * (delta / 1000)) / this.pathLength;

    this.progress += step;

    if (this.progress >= 1) {
      this.progress = 1;
      this.reachEnd();
      return;
    }

    this.updatePositionOnPath();
    this.updateFacingDirection();
    this.setDepth(10 + Math.floor(this.y / 10));
  }

  updatePositionOnPath() {
    const currentPoint = this.path.getPoint(this.progress);
    
    // Lookahead pour anticiper les virages
    const lookAheadDist = 0.01;
    const lookAhead = Math.min(this.progress + lookAheadDist, 1);
    
    let tangent;
    if (lookAhead > this.progress) {
      const lookAheadPoint = this.path.getPoint(lookAhead);
      const dx = lookAheadPoint.x - currentPoint.x;
      const dy = lookAheadPoint.y - currentPoint.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      
      if (len > 0.001) {
        tangent = { x: dx / len, y: dy / len };
      } else {
        tangent = this.calculateTangent(this.progress);
      }
    } else {
      tangent = this.calculateTangent(this.progress);
    }

    // Lissage de la tangente
    if (this.previousTangent) {
      tangent.x = Phaser.Math.Linear(this.previousTangent.x, tangent.x, this.tangentSmoothSpeed);
      tangent.y = Phaser.Math.Linear(this.previousTangent.y, tangent.y, this.tangentSmoothSpeed);
      
      // Re-normalisation
      const len = Math.sqrt(tangent.x * tangent.x + tangent.y * tangent.y);
      if (len > 0.001) {
        tangent.x /= len;
        tangent.y /= len;
      }
    }
    
    this.previousTangent = { ...tangent };

    // Normale pour l'offset latéral
    const normalX = -tangent.y;
    const normalY = tangent.x;

    // Position finale avec offset
    const finalX = currentPoint.x + normalX * this.laneOffset;
    const finalY = currentPoint.y + normalY * this.laneOffset;
    
    this.setPosition(finalX, finalY);
  }

  updateFacingDirection() {
    if (this.stats.shouldRotate === false || !this.bodyGroup || !this.previousTangent) return;

    const threshold = 0.15;
    
    if (this.previousTangent.x > threshold && !this.facingRight) {
      this.facingRight = true;
      this.bodyGroup.setScale(1, 1);
    } else if (this.previousTangent.x < -threshold && this.facingRight) {
      this.facingRight = false;
      this.bodyGroup.setScale(-1, 1);
    }
  }

  reachEnd() {
    if (this.active && this.scene) {
      // Ne pas infliger de dégâts si le jeu est en pause, terminé, ou si les vies sont déjà à 0
      // On vérifie gameOverTriggered et isPaused, mais PAS _gameOverShown car il est mis trop tôt
      if (
        this.scene.isPaused ||
        this.scene.lives <= 0 ||
        this.scene.gameOverTriggered
      ) {
        this.destroy();
        return;
      }
      
      if (this.scene.runTracker) {
        this.scene.runTracker.onEnemyLeak({
          waveIndex: this.waveIndex ?? this.scene.activeWaveIndex,
        });
      }
      
      // Berserker : plus il perd de PV, plus il inflige de dégâts
      let finalDamage = this.playerDamage;
      if (this.berserkerMode) {
        const hpLost = this.maxHp - this.hp;
        const hpLostPercent = hpLost / this.maxHp;
        // Multiplicateur : 1x à 100% HP, jusqu'à 3x à 0% HP
        const damageMultiplier = 1 + (hpLostPercent * 2);
        finalDamage = Math.ceil(this.playerDamage * damageMultiplier);
        
        // Feedback visuel
        const txt = this.scene.add.text(this.x, this.y - 50, `RAGE! +${Math.round((damageMultiplier - 1) * 100)}%`, {
          fontSize: "14px",
          color: "#ff0000",
          fontStyle: "bold",
          backgroundColor: "rgba(0,0,0,0.7)",
          padding: { x: 6, y: 3 },
        }).setOrigin(0.5).setDepth(2500);
        this.scene.tweens.add({
          targets: txt,
          y: txt.y - 30,
          alpha: 0,
          duration: 800,
          onComplete: () => txt.destroy(),
        });
      }
      
      if (this.scene.takeDamage) this.scene.takeDamage(finalDamage);
      this.destroy();
    }
  }

  damage(amount, metadata = {}) {
    if (this.isInvulnerable || !this.active) return;

    const damageSource = metadata?.source || this.lastDamageSource || "turret";
    showFloatingDamage(this.scene, this.x, this.y, amount, damageSource); // Par défaut, tourelle si rien n'est précisé
    this.lastDamageSource = damageSource;
    
    // Si c'est une tourelle, stocker son type
    if (damageSource === "turret" && metadata?.turretType) {
      this.lastTurretType = metadata.turretType;
    } else if (damageSource !== "turret") {
      // Si ce n'est pas une tourelle, réinitialiser le type
      this.lastTurretType = null;
    }

    const potentialHp = this.hp - amount;
    // L'aura ne protège que contre les dégâts des tourelles, pas des soldats/héros
    if (potentialHp <= 0 && this.isDeathPreventedByAura(damageSource)) {
      this.hp = Math.max(1, this.hp - Math.max(0, amount));
      this.updateHealthBar();

      // Feedback visuel spécifique à l'aura de survie
      const txt = this.scene.add
        .text(this.x, this.y - 50, "Protégé!", {
          fontSize: "12px",
          color: "#ffcc66",
          backgroundColor: "rgba(0,0,0,0.6)",
          padding: { x: 4, y: 2 },
        })
        .setOrigin(0.5)
        .setDepth(2500);

      this.scene.tweens.add({
        targets: txt,
        y: txt.y - 20,
        alpha: 0,
        duration: 600,
        onComplete: () => txt.destroy(),
      });

      this.scene.tweens.add({
        targets: this,
        alpha: 0.6,
        duration: 120,
        yoyo: true,
        repeat: 1,
      });

      return;
    }

    this.hp = potentialHp;
    this.updateHealthBar();

    // Feedback visuel
    this.scene.tweens.add({
        targets: this.bodyGroup,
        alpha: 0.5,
        duration: 50,
        yoyo: true,
    });

    if (this.shellThreshold && !this.isInShell && !this.hasUsedShell && (this.hp / this.maxHp) <= this.shellThreshold) {
        this.enterShell();
    }

    if (this.hp <= 0) this.die();
  }

  updateCombat(time) {
    if (!this.scene) return;
    if (this.isRanged) {
      this.handleRangedCombat(time);
    } else if (this.isBlocked && this.blockedBy) {
      if (time - this.lastAttackTime >= this.attackSpeed) {
        // Berserker : calculer les dégâts selon les PV perdus
        let damageDealt = this.attackDamage;
        if (this.berserkerMode) {
          const hpLost = this.maxHp - this.hp;
          const hpLostPercent = hpLost / this.maxHp;
          const damageMultiplier = 1 + (hpLostPercent * 2);
          damageDealt = Math.ceil(this.attackDamage * damageMultiplier);
        }
        
        if (this.blockedBy.takeDamage) this.blockedBy.takeDamage(damageDealt);
        
        // Vampire : se soigne de 20% des dégâts infligés
        if (this.vampireLifesteal > 0 && damageDealt > 0) {
          const healAmount = Math.ceil(damageDealt * this.vampireLifesteal);
          this.hp = Math.min(this.maxHp, this.hp + healAmount);
          this.updateHealthBar();
          
          // Feedback visuel
          if (healAmount > 0) {
            const txt = this.scene.add.text(this.x, this.y - 40, `+${healAmount} HP`, {
              fontSize: "12px",
              color: "#00ff00",
              fontStyle: "bold",
              backgroundColor: "rgba(0,0,0,0.6)",
              padding: { x: 4, y: 2 },
            }).setOrigin(0.5).setDepth(2500);
            this.scene.tweens.add({
              targets: txt,
              y: txt.y - 20,
              alpha: 0,
              duration: 600,
              onComplete: () => txt.destroy(),
            });
            
            // Effet de sang
            if (this.elements?.bloodEffect) {
              this.elements.bloodEffect.clear();
              this.elements.bloodEffect.fillStyle(0x8b0000, 0.6);
              this.elements.bloodEffect.fillCircle(0, 0, 8);
              this.elements.bloodEffect.setVisible(true);
              this.scene.tweens.add({
                targets: this.elements.bloodEffect,
                alpha: 0,
                scale: 1.5,
                duration: 400,
                onComplete: () => {
                  if (this.elements?.bloodEffect) {
                    this.elements.bloodEffect.setVisible(false);
                  }
                },
              });
            }
          }
        }
        
        this.lastAttackTime = time;
      }
    }
  }

  handleRangedCombat(time) {
    this.findRangedTarget();
    if (this.targetSoldier?.active && (this.targetSoldier.isAlive || this.targetSoldier.hp > 0)) {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, this.targetSoldier.x, this.targetSoldier.y);
      if (dist <= this.attackRange) {
        this.isMoving = false;
        if (time - this.lastAttackTime >= this.attackSpeed) {
          this.attackSoldierRanged(this.targetSoldier);
          this.lastAttackTime = time;
        }
      } else {
        this.isMoving = true;
      }
    } else {
      this.isMoving = true;
    }
  }

  attackSoldierRanged(soldier) {
    const proj = this.scene.add.circle(this.x, this.y, 4, 0xffffff).setDepth(2000);
    this.scene.tweens.add({
      targets: proj,
      x: soldier.x,
      y: soldier.y,
      duration: 300,
      onComplete: () => {
        if (soldier.active && soldier.takeDamage) soldier.takeDamage(this.attackDamage);
        proj.destroy();
      },
    });
  }

  findRangedTarget() {
    if (!this.scene?.soldiers) return;
    let closest = null;
    let minDist = this.attackRange;

    this.scene.soldiers.getChildren().forEach((s) => {
      const d = Phaser.Math.Distance.Between(this.x, this.y, s.x, s.y);
      if (s.active && (s.isAlive || s.hp > 0) && d < minDist) {
        minDist = d;
        closest = s;
      }
    });
    this.targetSoldier = closest;
  }

  handleSpecialAbilities(time) {
    if (!this.stats.onUpdateAnimation) {
      if (this.healInterval && time - this.lastHealTime >= this.healInterval) {
        this.healNearbyEnemies();
        this.lastHealTime = time;
      }
    }

    if (this.stats.spawnInterval && time - this.lastSpawnTime >= this.stats.spawnInterval) {
      this.spawnMinions();
      this.lastSpawnTime = time;
    }

    if (this.stats.curseInterval) {
      if (!this.lastCurseTime) this.lastCurseTime = 0;
      if (time - this.lastCurseTime >= this.stats.curseInterval) {
        this.triggerTurretCurse();
        this.lastCurseTime = time;
      }
    }

    if (this.stats.eggSpawnInterval) {
      if (!this.lastEggSpawn) this.lastEggSpawn = 0;
      if (time - this.lastEggSpawn >= this.stats.eggSpawnInterval) {
        this.spawnEgg();
        this.lastEggSpawn = time;
      }
    }

    if (this.stats.isEgg && !this.hatchTimer && this.scene?.time) {
      const hatchDelay = this.stats.hatchTime || 5000;
      this.hatchTimer = this.scene.time.delayedCall(hatchDelay, () => {
        this.hatchEgg();
      });
    }

    // Criard : désactive les tours à 2 cases pendant 2s
    if (this.screamRadius > 0 && this.screamCooldown > 0) {
      if (time - this.lastScreamTime >= this.screamCooldown) {
        this.screamDisableTurrets();
        this.lastScreamTime = time;
      }
    }

    // Stratège : renforce les alliés proches
    if (this.buffRadius > 0 && this.buffMultiplier > 1) {
      this.buffNearbyAllies();
    }

    // Brouilleur : cache les barres de vie (géré de manière centralisée)
    // La logique est dans update() pour être appelée pour tous les ennemis

    // Berserker : gagne 1% de PV max toutes les secondes
    if (this.hpGrowthEnabled && this.hpGrowthInterval && this.hpGrowthPercent && this.scene?.time) {
      const currentTime = this.scene.time.now;
      if (currentTime - this.lastHpGainTime >= this.hpGrowthInterval) {
        const hpGain = Math.ceil(this.maxHp * this.hpGrowthPercent);
        this.maxHp += hpGain;
        this.hp += hpGain; // Gagne aussi les PV actuels pour rester à la même proportion
        
        // Feedback visuel discret
        if (hpGain > 0) {
          const txt = this.scene.add.text(this.x, this.y - 60, `+${hpGain} HP`, {
            fontSize: "11px",
            color: "#ffaa00",
            fontStyle: "bold",
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: { x: 4, y: 2 },
          }).setOrigin(0.5).setDepth(2500);
          this.scene.tweens.add({
            targets: txt,
            y: txt.y - 20,
            alpha: 0,
            duration: 1000,
            onComplete: () => txt.destroy(),
          });
        }
        
        this.updateHealthBar();
        this.lastHpGainTime = currentTime;
      }
    }
  }

  healNearbyEnemies() {
    if (!this.scene?.enemies) return;
    const radius = this.stats.healRadiusPixels || this.stats.healRadius || 100;

    this.scene.enemies.getChildren().forEach((e) => {
      if (e !== this && e.active) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y);
        if (dist < radius) {
          e.hp = Math.min(e.hp + (this.stats.healAmount || 10), e.maxHp);
          e.updateHealthBar();
        }
      }
    });
  }

  enterShell() {
    this.isInShell = true;
    this.isInvulnerable = true;
    this.hasUsedShell = true;
    this.isMoving = false;

    this.scene.time.delayedCall(this.stats.shellDuration || 3000, () => {
        if (this.active) {
            this.isInShell = false;
            this.isInvulnerable = false;
            this.isMoving = true;
        }
    });
  }

  spawnMinions() {
    if (!this.stats.spawnType || !this.scene?.enemies) return;
    const waveIndex = this.waveIndex ?? this.scene?.activeWaveIndex ?? null;
    // Utiliser la même classe que l'ennemi actuel
    for (let i = 0; i < (this.stats.spawnCount || 2); i++) {
      const m = new Chapter2Enemy(this.scene, this.path, this.stats.spawnType);
      m.progress = Math.max(0, this.progress - 0.05);
      m.waveIndex = waveIndex;
      this.scene.enemies.add(m);
      this.scene.runTracker?.onEnemySpawn(waveIndex, this.stats.spawnType);
      m.spawn();
    }
  }

  triggerTurretCurse() {
    if (!this.scene?.turrets || this.scene.turrets.length === 0) return;

    const viableTurrets = this.scene.turrets.filter((t) => t?.active && !t.isCursed);
    if (viableTurrets.length === 0) return;

    const target = Phaser.Utils.Array.GetRandom(viableTurrets);
    if (target?.applyCurse) {
      target.applyCurse(this.stats.curseCost || 25);

      const flame = this.scene.add.graphics();
      flame.fillStyle(0x331122, 0.7);
      flame.fillCircle(0, 0, 14);
      flame.x = this.x;
      flame.y = this.y - 10;
      flame.setDepth(2400);
      this.scene.tweens.add({
        targets: flame,
        x: target.x,
        y: target.y - 20,
        alpha: 0,
        scale: 1.4,
        duration: 500,
        onComplete: () => flame.destroy(),
      });
    }
  }

  spawnEgg() {
    if (!this.stats.eggSpawnType || !this.scene?.enemies || !this.path) return;
    const waveIndex = this.waveIndex ?? this.scene?.activeWaveIndex ?? null;
    const egg = new Chapter2Enemy(this.scene, this.path, this.stats.eggSpawnType);
    egg.waveIndex = waveIndex;
    egg.spawn();
    egg.progress = Math.max(0, this.progress - 0.02);
    const point = this.path.getPoint(egg.progress);
    egg.setPosition(point.x, point.y);
    egg.previousTangent = egg.calculateTangent(egg.progress);
    egg.linkedQueen = this;
    egg.hatchDamageToQueen = this.stats.eggDamageOnDestroy || 800;
    egg.hatchSpawnType = this.stats.eggScarabType;
    egg.hatchSpawnCount = this.stats.eggScarabCount || 2;
    egg.isMoving = false;

    this.scene.enemies.add(egg);
    this.scene.runTracker?.onEnemySpawn(waveIndex, this.stats.eggSpawnType);
  }

  hatchEgg() {
    if (this.hasHatched || !this.scene || !this.stats.isEgg) return;

    this.hasHatched = true;

    const hatchCount = this.hatchSpawnCount || this.stats.hatchCount || 2;
    const spawnType = this.hatchSpawnType || this.stats.hatchSpawnType;
    const waveIndex = this.waveIndex ?? this.scene?.activeWaveIndex ?? null;

    for (let i = 0; i < hatchCount; i++) {
      if (!spawnType) continue;
      const child = new Chapter2Enemy(this.scene, this.path, spawnType);
      child.spawn();
      child.waveIndex = waveIndex;
      child.progress = this.progress;
      const point = this.path.getPoint(child.progress);
      child.setPosition(point.x, point.y);
      child.previousTangent = child.calculateTangent(child.progress);
      this.scene.enemies.add(child);
      this.scene.runTracker?.onEnemySpawn(waveIndex, spawnType);
    }

    // Effet visuel d'éclosion
    const blast = this.scene.add.circle(this.x, this.y, 16, 0xff6600, 0.4);
    this.scene.tweens.add({
      targets: blast,
      scale: 2,
      alpha: 0,
      duration: 450,
      onComplete: () => blast.destroy(),
    });

    this.destroy();
  }

  drawHealthBar() {
    const width = 40;
    const height = 5;
    if (this.hpBarContainer) this.hpBarContainer.destroy();

    this.hpBarContainer = this.scene.add.container(0, -40);
    const bg = this.scene.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0.5);
    this.hpFill = this.scene.add.rectangle(-width / 2, 0, width, height, 0x00ff00).setOrigin(0, 0.5);

    this.hpBarContainer.add([bg, this.hpFill]);
    this.add(this.hpBarContainer);
    this.hpBarContainer.setDepth(2000);
    
    // Vérifier si la barre doit être cachée (brouillage)
    if (this.isJammed) {
      this.hpBarContainer.setVisible(false);
    }
  }

  updateHealthBar() {
    if (!this.hpFill) return;
    const pct = Phaser.Math.Clamp(this.hp / this.maxHp, 0, 1);
    this.hpFill.width = 40 * pct;
    const color = pct < 0.3 ? 0xff0000 : pct < 0.6 ? 0xffa500 : 0x00ff00;
    this.hpFill.fillColor = color;
    
    // Respecter le statut de brouillage
    if (this.hpBarContainer) {
      this.hpBarContainer.setVisible(!this.isJammed);
    }
    this.refreshHpTooltip();
  }

  isDeathPreventedByAura(damageSource = "turret") {
    // L'aura ne protège que contre les dégâts des tourelles
    // Les dégâts des soldats ("soldier") et du héros ("hero") ne sont pas protégés
    if (damageSource === "soldier" || damageSource === "hero") {
      return false;
    }

    if (!this.scene?.enemies) return false;

    const tileSize = CONFIG.TILE_SIZE * (this.scene.scaleFactor || 1);
    const allies = this.scene.enemies.getChildren();

    for (const ally of allies) {
      if (
        ally !== this &&
        ally.active &&
        ally.stats?.preventDeathAura &&
        !ally.isParalyzed &&
        !ally.isInShell
      ) {
        const radiusPx = (ally.stats.survivalAuraRadius || 0) * tileSize;
        const dist = Phaser.Math.Distance.Between(this.x, this.y, ally.x, ally.y);
        if (dist <= radiusPx) {
          return true;
        }
      }
    }

    return false;
  }

  // Criard : désactive les tours à 2 cases pendant 2s
  screamDisableTurrets() {
    if (!this.scene?.turrets || this.screamRadius <= 0) return;
    
    const T = CONFIG.TILE_SIZE * (this.scene.scaleFactor || 1);
    const radiusPixels = this.screamRadius * T;
    
    // Animation des ondes sonores
    if (this.elements?.soundWaves) {
      this.elements.soundWaves.setVisible(true);
      this.elements.soundWaves.removeAll(true);
      
      for (let i = 1; i <= 3; i++) {
        const wave = this.scene.add.graphics();
        wave.lineStyle(3, 0xffff00, 0.6);
        wave.strokeCircle(0, 0, radiusPixels * (i / 3));
        this.elements.soundWaves.add(wave);
      }
      
      this.scene.tweens.add({
        targets: this.elements.soundWaves,
        scale: 1.5,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          if (this.elements?.soundWaves) {
            this.elements.soundWaves.setVisible(false);
            this.elements.soundWaves.removeAll(true);
          }
        },
      });
    }
    
    // Désactiver les tours dans le rayon
    this.scene.turrets.forEach((turret) => {
      if (!turret?.active) return;
      
      const dist = Phaser.Math.Distance.Between(this.x, this.y, turret.x, turret.y);
      if (dist <= radiusPixels) {
        // Marquer la tourelle comme désactivée
        if (!turret.disabledByScream) {
          turret.disabledByScream = true;
          
          // Ajouter une croix rouge sur la tourelle
          const cross = this.scene.add.graphics();
          cross.lineStyle(4, 0xff0000, 0.9);
          cross.lineBetween(turret.x - 20, turret.y - 20, turret.x + 20, turret.y + 20);
          cross.lineBetween(turret.x - 20, turret.y + 20, turret.x + 20, turret.y - 20);
          cross.setDepth(100);
          cross.setScrollFactor(0);
          turret.screamCross = cross;
          
          // Réactiver après la durée
          this.scene.time.delayedCall(this.screamDuration, () => {
            if (turret?.active) {
              turret.disabledByScream = false;
              if (turret.screamCross) {
                turret.screamCross.destroy();
                turret.screamCross = null;
              }
            }
          });
        }
      }
    });
  }

  // Stratège : renforce les alliés proches (+12% stats, contour vert)
  buffNearbyAllies() {
    if (!this.scene?.enemies || this.buffRadius <= 0) return;
    
    const T = CONFIG.TILE_SIZE * (this.scene.scaleFactor || 1);
    const radiusPixels = this.buffRadius * T;
    
    this.scene.enemies.getChildren().forEach((ally) => {
      if (ally === this || !ally.active) return;
      
      const dist = Phaser.Math.Distance.Between(this.x, this.y, ally.x, ally.y);
      if (dist <= radiusPixels) {
        if (!ally.isBuffed) {
          ally.isBuffed = true;
          ally.buffedBy = this;
          
          // Stocker les stats de base si pas déjà fait
          if (!ally.baseSpeed) ally.baseSpeed = ally.speed;
          if (!ally.baseAttackDamage) ally.baseAttackDamage = ally.attackDamage;
          if (!ally.baseMaxHp) ally.baseMaxHp = ally.maxHp;
          
          // Appliquer le buff (+12% stats)
          const oldHpPercent = ally.hp / ally.maxHp;
          ally.speed = Math.ceil(ally.baseSpeed * this.buffMultiplier);
          ally.attackDamage = Math.ceil(ally.baseAttackDamage * this.buffMultiplier);
          ally.maxHp = Math.ceil(ally.baseMaxHp * this.buffMultiplier);
          ally.hp = Math.ceil(ally.maxHp * oldHpPercent);
          ally.updateHealthBar();
          
          // Contour vert
          const buffOutline = this.scene.add.graphics();
          buffOutline.lineStyle(3, 0x00ff00, 0.8);
          buffOutline.strokeCircle(0, 0, 20);
          buffOutline.setDepth(ally.depth + 1);
          ally.add(buffOutline);
          ally.buffVisual = buffOutline;
          
          // Animation pulsante
          this.scene.tweens.add({
            targets: buffOutline,
            alpha: { from: 0.5, to: 1 },
            scale: { from: 0.9, to: 1.1 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
          });
        }
      } else if (dist > radiusPixels && ally.isBuffed && ally.buffedBy === this) {
        // Retirer le buff si trop loin (seulement si c'est ce Stratège qui l'a buffé)
        ally.isBuffed = false;
        ally.buffedBy = null;
        
        if (ally.baseSpeed) {
          const oldHpPercent = ally.hp / ally.maxHp;
          ally.speed = ally.baseSpeed;
          ally.attackDamage = ally.baseAttackDamage;
          ally.maxHp = ally.baseMaxHp;
          ally.hp = Math.ceil(ally.maxHp * oldHpPercent);
          ally.updateHealthBar();
        }
        
        if (ally.buffVisual) {
          ally.buffVisual.destroy();
          ally.buffVisual = null;
        }
      }
      
      // Marquer qui a buffé cet allié
      if (dist <= radiusPixels && ally.isBuffed) {
        ally.buffedBy = this;
      }
    });
  }

  // Vérifier si cet ennemi est brouillé par un brouilleur à proximité
  updateJammingStatus() {
    if (!this.scene?.enemies) {
      this.isJammed = false;
      return;
    }

    const CONFIG = { TILE_SIZE: 64 };
    const T = CONFIG.TILE_SIZE * (this.scene.scaleFactor || 1);
    let isJammed = false;

    // Parcourir tous les ennemis pour trouver les brouilleurs actifs
    this.scene.enemies.getChildren().forEach((enemy) => {
      if (!enemy || !enemy.active || enemy === this) return;
      
      // Vérifier si c'est un brouilleur avec un rayon actif
      if (enemy.jammingRadius && enemy.jammingRadius > 0) {
        const radiusPixels = enemy.jammingRadius * T;
        const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
        
        if (dist <= radiusPixels) {
          isJammed = true;
        }
      }
    });

    // Mettre à jour le statut de brouillage
    if (this.isJammed !== isJammed) {
      this.isJammed = isJammed;
      // Mettre à jour la visibilité de la barre de vie
      if (this.hpBarContainer) {
        this.hpBarContainer.setVisible(!isJammed);
      }
    } else if (this.hpBarContainer) {
      // S'assurer que la visibilité est correcte même si le statut n'a pas changé
      this.hpBarContainer.setVisible(!this.isJammed);
    }
  }

  die() {
    if (this.hatchTimer) {
      this.hatchTimer.remove();
      this.hatchTimer = null;
    }

    if (this.isBlocked && this.blockedBy?.releaseEnemy) {
      this.blockedBy.releaseEnemy();
    }
    
    // Vérifier si onDeath transforme le boss
    const isTransforming = !!this.stats.nextPhase;
    
    if (this.stats.onDeath) {
      this.stats.onDeath(this);
    }
    
    // Ne pas donner de récompense ni émettre d'événement si c'est une transformation
    if (!isTransforming) {
      if (this.scene.earnMoney) this.scene.earnMoney(this.stats.reward || 10);

      if (this.scene?.events) {
        const src = this.lastDamageSource || "other";
        this.scene.events.emit("enemy-killed", {
          source: src,
          turretType: this.lastTurretType || null, // Type de tourelle qui a tué l'ennemi
          x: this.x,
          y: this.y,
          waveIndex: this.waveIndex ?? this.scene?.activeWaveIndex ?? null,
        });
      }

      // Notifier les vampires à proximité qu'un ennemi est mort
      this.notifyVampiresOfDeath();
    }

    this.explode();
    this.destroy();
  }

  notifyVampiresOfDeath() {
    if (!this.scene?.enemies) return;
    
    // Calculer le rayon en pixels (2 cases par défaut)
    const CONFIG = { TILE_SIZE: 64 };
    const T = CONFIG.TILE_SIZE * (this.scene.scaleFactor || 1);
    const defaultRadius = 2; // 2 cases par défaut
    const radiusPixels = defaultRadius * T;
    
    // Parcourir tous les ennemis vivants
    this.scene.enemies.getChildren().forEach((enemy) => {
      if (!enemy || !enemy.active || enemy === this) return;
      
      // Vérifier si c'est un vampire avec la mécanique activée
      if (!enemy.vampireDeathFeast) return;
      
      // Utiliser le rayon du vampire (peut être différent)
      const vampireRadius = enemy.vampireDeathFeastRadius || defaultRadius;
      const vampireRadiusPixels = vampireRadius * T;
      
      // Calculer la distance
      const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
      
      if (distance <= vampireRadiusPixels) {
        // Le vampire récupère 1/4 de son maxHp actuel
        const hpGain = Math.ceil(enemy.maxHp * enemy.vampireDeathFeastPercent);
        
        // Augmenter à la fois maxHp et hp (peut dépasser le maxHp précédent)
        enemy.maxHp += hpGain;
        enemy.hp += hpGain;
        
        // Mettre à jour la barre de vie
        enemy.updateHealthBar();
        
        // Feedback visuel
        const txt = this.scene.add.text(enemy.x, enemy.y - 60, `+${hpGain} HP (Feast!)`, {
          fontSize: "12px",
          color: "#ff00ff",
          fontStyle: "bold",
          backgroundColor: "rgba(0,0,0,0.7)",
          padding: { x: 6, y: 3 },
        }).setOrigin(0.5).setDepth(2500);
        
        this.scene.tweens.add({
          targets: txt,
          y: txt.y - 30,
          alpha: 0,
          duration: 1200,
          onComplete: () => txt.destroy(),
        });
        
        // Effet visuel de sang sur le vampire
        if (enemy.elements?.bloodEffect) {
          enemy.elements.bloodEffect.setVisible(true);
          enemy.elements.bloodEffect.clear();
          enemy.elements.bloodEffect.fillStyle(0x8b0000, 0.6);
          enemy.elements.bloodEffect.fillCircle(0, 0, 30);
          enemy.elements.bloodEffect.lineStyle(2, 0xff0000, 0.8);
          enemy.elements.bloodEffect.strokeCircle(0, 0, 32);
          
          this.scene.tweens.add({
            targets: enemy.elements.bloodEffect,
            alpha: 0,
            scale: 1.3,
            duration: 800,
            onComplete: () => {
              if (enemy.elements?.bloodEffect) {
                enemy.elements.bloodEffect.setVisible(false);
              }
            },
          });
        }
      }
    });
  }

  explode() {
    const color = this.stats.color || 0xffffff;
    for (let i = 0; i < 5; i++) {
      const p = this.scene.add.rectangle(this.x, this.y, 6, 6, color);
      this.scene.tweens.add({
        targets: p,
        x: this.x + Phaser.Math.Between(-40, 40),
        y: this.y + Phaser.Math.Between(-40, 40),
        alpha: 0,
        scale: 0,
        duration: 500,
        onComplete: () => p.destroy(),
      });
    }
  }

  showHpTooltip() {
    if (this.hpTooltip || !this.scene) return;
    this.hpTooltip = this.scene.add.text(this.x, this.y - 60, this.getHpTooltipText(), {
      fontSize: "14px",
      backgroundColor: "#000",
      padding: 3,
    }).setOrigin(0.5).setDepth(3000);
  }

  hideHpTooltip() {
    if (this.hpTooltip) {
      this.hpTooltip.destroy();
      this.hpTooltip = null;
    }
  }

  getHpTooltipText() {
    return `${Math.max(0, Math.ceil(this.hp))} / ${Math.ceil(this.maxHp)} HP`;
  }

  refreshHpTooltip() {
    if (this.hpTooltip) this.hpTooltip.setText(this.getHpTooltipText());
  }

  paralyze(duration) {
    if (!this.active || !this.scene) return;
    
    if (this.paralysisTimer) {
      this.paralysisTimer.remove();
      this.paralysisTimer = null;
    }
    
    this.paralysisPosition = { x: this.x, y: this.y };
    this.isParalyzed = true;
    this.isMoving = false;
    
    if (this.isBlocked && this.blockedBy) {
      this.isBlocked = false;
      if (this.blockedBy.releaseEnemy) {
        this.blockedBy.releaseEnemy();
      }
      this.blockedBy = null;
    }
    
    this.paralysisTimer = this.scene.time.delayedCall(duration, () => {
      if (this.active) {
        this.isParalyzed = false;
        this.paralysisPosition = null;
        this.isMoving = true;
        this.paralysisTimer = null;
      }
    });
  }

  destroy(fromScene) {
    if (this.paralysisTimer) {
      this.paralysisTimer.remove();
      this.paralysisTimer = null;
    }
    if (this.hatchTimer) {
      this.hatchTimer.remove();
      this.hatchTimer = null;
    }
    this.hideHpTooltip();
    super.destroy(fromScene);
  }
}
