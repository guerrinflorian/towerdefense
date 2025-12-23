import { CONFIG } from "../config/settings.js";

const PATH_TYPES = [1, 4, 7, 13, 14];

export class Hero extends Phaser.GameObjects.Container {
  constructor(scene, tileX, tileY, stats = {}) {
    const s = scene.scaleFactor || 1;
    const T = CONFIG.TILE_SIZE * s;

    const startX = scene.mapStartX + tileX * T + T / 2;
    const startY = scene.mapStartY + tileY * T + T / 2;
    super(scene, startX, startY);

    this.scene = scene;

    // --- Stats ---
    this.maxHp = stats.max_hp ?? 230;
    this.hp = this.maxHp;
    this.damage = stats.base_damage ?? 25;
    this.attackInterval = stats.attack_interval_ms ?? 1200;
    this.moveSpeed = (stats.move_speed ?? 100) * s;
    this.heroColor = stats.color || "#2b2b2b"; // Couleur par défaut (noir)

    // --- State ---
    this.isAlive = true;
    this.blockingEnemy = null;
    this.targetPath = [];
    this.currentPathIndex = 0;
    this.lastAttackTime = 0;

    this.corpseTimerEvent = null;
    this.corpseContainer = null;
    
    // --- Régénération automatique ---
    this.lastDamageTime = scene?.time?.now || 0; // Temps du dernier dégât reçu
    this.regenTimer = null; // Timer pour la régénération
    this.regenDelay = 5000; // 5 secondes avant de commencer à régénérer
    this.regenPercent = 0.03; // 3% de la vie max
    this.regenInterval = 1000; // Toutes les 1 seconde

    // --- Visual / Layout (un peu plus gros + mieux lisible) ---
    this.baseScale = 1.05; // <- rend le héros un peu plus gros
    const portraitBoost = scene.isPortrait ? 1.35 : 1;
    this.visualScale = Math.max(0.78, Math.min(1.45, this.baseScale * s * portraitBoost));

    this.bodyGroup = scene.add.container(0, 0);
    this.add(this.bodyGroup);

    // Épée séparée pour mieux animer
    this.swordGroup = scene.add.container(0, 0);
    this.add(this.swordGroup);

    // Effets
    this.hpBar = this.scene.add.graphics();
    this.add(this.hpBar);

    this.swordTrail = this.scene.add.graphics();
    this.swordTrail.setDepth(3);
    this.add(this.swordTrail);

    this.hitSpark = this.scene.add.graphics();
    this.hitSpark.setDepth(4);
    this.add(this.hitSpark);

    // Draw
    this.drawBody();
    this.drawSword();
    this.drawHealthBar();

    scene.add.existing(this);

    // Hitbox (un chouïa plus grosse aussi)
    this.setDepth(40);
    this.setSize(56, 56);
    this.setScale(this.visualScale);
    
    // Tooltip HP - définir une zone interactive
    this.hpTooltip = null;
    this.setInteractive({ useHandCursor: false });
    this.on("pointerover", () => {
      if (this.active && this.isAlive) {
        this.showHpTooltip();
      }
    });
    this.on("pointerout", () => this.hideHpTooltip());
  }

  // -----------------------------
  // Drawing
  // -----------------------------
  hexToNumber(hex) {
    // Convertir une couleur hexadécimale (#RRGGBB) en nombre pour Phaser
    if (!hex) return 0x2b2b2b; // Couleur par défaut
    const cleanHex = hex.replace("#", "");
    return parseInt(cleanHex, 16);
  }

  drawBody() {
    const s = this.scene.scaleFactor || 1;
    const k = this.baseScale; // appliqué déjà par setScale, mais utile pour proportions internes
    this.bodyGroup.removeAll(true);

    const g = this.scene.add.graphics();

    // Ombre au sol (ça donne du volume)
    g.fillStyle(0x000000, 0.18);
    g.fillEllipse(0, 18 * s * k, 26 * s * k, 10 * s * k);

    // Cape (plus stylée)
    g.fillStyle(0x151526, 0.92);
    g.fillEllipse(-2 * s * k, 8 * s * k, 22 * s * k, 30 * s * k);
    g.fillStyle(0x0d0d18, 0.35);
    g.fillEllipse(-6 * s * k, 10 * s * k, 14 * s * k, 24 * s * k);

    // Armure (corps) - utiliser la couleur personnalisée pour le plastron
    const chestplateColor = this.hexToNumber(this.heroColor);
    g.fillStyle(chestplateColor, 1);
    g.fillRoundedRect(-12 * s * k, -18 * s * k, 24 * s * k, 34 * s * k, 7 * s * k);
    g.lineStyle(2 * s * k, 0x242424, 1);
    g.strokeRoundedRect(-12 * s * k, -18 * s * k, 24 * s * k, 34 * s * k, 7 * s * k);

    // Plastron (détail) - trait vertical au milieu
    g.lineStyle(2 * s * k, 0x6a6a6a, 0.6);
    g.beginPath();
    g.moveTo(0, -16 * s * k);
    g.lineTo(0, 10 * s * k);
    g.strokePath();

    // Épaulières
    g.fillStyle(0x7a7a7a, 1);
    g.fillCircle(-11 * s * k, -12 * s * k, 7 * s * k);
    g.fillCircle(11 * s * k, -12 * s * k, 7 * s * k);
    g.lineStyle(2 * s * k, 0x2a2a2a, 0.9);
    g.strokeCircle(-11 * s * k, -12 * s * k, 7 * s * k);
    g.strokeCircle(11 * s * k, -12 * s * k, 7 * s * k);

    // Ceinture
    g.fillStyle(0x8b5a2b, 1);
    g.fillRoundedRect(-12 * s * k, 6 * s * k, 24 * s * k, 5 * s * k, 2 * s * k);
    g.fillStyle(0xd2b48c, 0.9);
    g.fillRect(-2 * s * k, 6 * s * k, 4 * s * k, 5 * s * k);

    // Tête
    g.fillStyle(0xffd4a3, 1);
    g.fillCircle(0, -24 * s * k, 8 * s * k);

    // Casque / cheveux - utiliser la couleur personnalisée
    const hatColor = this.hexToNumber(this.heroColor);
    g.fillStyle(hatColor, 1);
    g.fillRoundedRect(-10 * s * k, -33 * s * k, 20 * s * k, 8 * s * k, 3 * s * k);

    // Petit “regard” (vite fait mais ça donne de la vie)
    g.fillStyle(0x111111, 0.9);
    g.fillCircle(-3.2 * s * k, -24 * s * k, 1.1 * s * k);
    g.fillCircle(3.2 * s * k, -24 * s * k, 1.1 * s * k);

    this.bodyGroup.add(g);
  }

  drawSword() {
    const s = this.scene.scaleFactor || 1;
    const k = this.baseScale;

    this.swordGroup.removeAll(true);

    // Pivot de l’épée (pour animer comme un vrai swing)
    this.swordPivot = this.scene.add.container(12 * s * k, -4 * s * k);
    this.swordPivot.setRotation(-0.3);

    const sword = this.scene.add.graphics();

    // Lame (avec petit highlight)
    sword.fillStyle(0xd6d6d6, 1);
    sword.fillRoundedRect(0, -2 * s * k, 22 * s * k, 5 * s * k, 2 * s * k);
    sword.fillStyle(0xffffff, 0.75);
    sword.fillRoundedRect(0, -2 * s * k, 22 * s * k, 2.2 * s * k, 2 * s * k);

    // Pointe
    sword.fillStyle(0xcfcfcf, 1);
    sword.fillTriangle(22 * s * k, -2 * s * k, 28 * s * k, 0.5 * s * k, 22 * s * k, 3 * s * k);

    // Garde
    sword.fillStyle(0x6b3d18, 1);
    sword.fillRoundedRect(-4 * s * k, -4.2 * s * k, 6 * s * k, 9 * s * k, 2 * s * k);

    // Poignée
    sword.fillStyle(0x8b4513, 1);
    sword.fillRoundedRect(-8 * s * k, -2.5 * s * k, 5 * s * k, 6 * s * k, 2 * s * k);
    sword.fillStyle(0x3b2210, 0.55);
    sword.fillRect(-7.2 * s * k, -2.2 * s * k, 3.5 * s * k, 0.8 * s * k);
    sword.fillRect(-7.2 * s * k, -0.6 * s * k, 3.5 * s * k, 0.8 * s * k);
    sword.fillRect(-7.2 * s * k, 1.0 * s * k, 3.5 * s * k, 0.8 * s * k);

    // Pommeau
    sword.fillStyle(0xbdbdbd, 1);
    sword.fillCircle(-9.2 * s * k, 0.5 * s * k, 2.2 * s * k);

    this.swordPivot.add(sword);
    this.swordGroup.add(this.swordPivot);
  }

  drawHealthBar() {
    const s = this.scene.scaleFactor || 1;
    const k = this.baseScale;

    const pct = Phaser.Math.Clamp(this.hp / this.maxHp, 0, 1);
    const width = 56 * s * k;
    const height = 7 * s * k;
    const y = -50 * s * k;

    this.hpBar.clear();

    // Fond
    this.hpBar.fillStyle(0x000000, 0.75);
    this.hpBar.fillRoundedRect(-width / 2, y, width, height, 3 * s * k);

    // Bord plus visible
    this.hpBar.lineStyle(2 * s * k, 0xffffff, 0.4);
    this.hpBar.strokeRoundedRect(-width / 2, y, width, height, 3 * s * k);

    // Barre
    const col = pct < 0.3 ? 0xff3b30 : pct < 0.6 ? 0xffc107 : 0x4caf50;
    this.hpBar.fillStyle(col, 1);
    this.hpBar.fillRoundedRect(
      -width / 2 + 1.2 * s * k,
      y + 1.2 * s * k,
      (width - 2.4 * s * k) * pct,
      height - 2.4 * s * k,
      3 * s * k
    );
  }
  
  showHpTooltip() {
    if (!this.active || !this.isAlive) return;

    if (this.hpTooltip) {
      this.hpTooltip.destroy();
    }

    const fontSize = Math.max(14, 16 * (this.scene.scaleFactor || 1));
    this.hpTooltip = this.scene.add.text(
      this.x,
      this.y - 70,
      this.getHpTooltipText(),
      {
        fontSize: `${fontSize}px`,
        fill: "#ffffff",
        fontStyle: "bold",
        backgroundColor: "#000000",
        padding: { x: 10, y: 6 },
      }
    ).setOrigin(0.5).setDepth(300);
    
    // Mettre à jour la position du tooltip en continu
    if (this.tooltipUpdateTimer) {
      this.tooltipUpdateTimer.remove();
    }
    this.tooltipUpdateTimer = this.scene.time.addEvent({
      delay: 50,
      callback: () => {
        if (this.hpTooltip && this.active && this.isAlive) {
          this.hpTooltip.setPosition(this.x, this.y - 70);
          this.hpTooltip.setText(this.getHpTooltipText());
        } else if (this.hpTooltip) {
          this.hideHpTooltip();
        }
      },
      loop: true
    });
  }
  
  hideHpTooltip() {
    if (this.hpTooltip) {
      this.hpTooltip.destroy();
      this.hpTooltip = null;
    }
    if (this.tooltipUpdateTimer) {
      this.tooltipUpdateTimer.remove();
      this.tooltipUpdateTimer = null;
    }
  }

  getHpTooltipText() {
    return `${Math.max(0, Math.ceil(this.hp))} / ${Math.ceil(this.maxHp)} HP`;
  }

  // -----------------------------
  // Grid / Pathfinding
  // -----------------------------
  getCurrentTile() {
    const T = CONFIG.TILE_SIZE * (this.scene.scaleFactor || 1);
    const tx = Math.floor((this.x - this.scene.mapStartX) / T);
    const ty = Math.floor((this.y - this.scene.mapStartY) / T);
    return { x: Phaser.Math.Clamp(tx, 0, 14), y: Phaser.Math.Clamp(ty, 0, 14) };
  }

  isPathTile(tx, ty) {
    const row = this.scene.levelConfig.map[ty];
    if (!row) return false;
    return PATH_TYPES.includes(row[tx]);
  }

  findPath(start, goal) {
    if (!this.isPathTile(goal.x, goal.y)) return null;

    const key = (p) => `${p.x},${p.y}`;
    const queue = [start];
    const cameFrom = new Map();
    cameFrom.set(key(start), null);

    const dirs = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];

    while (queue.length > 0) {
      const current = queue.shift();
      if (current.x === goal.x && current.y === goal.y) break;

      for (const d of dirs) {
        const nx = current.x + d.x;
        const ny = current.y + d.y;
        if (nx < 0 || nx > 14 || ny < 0 || ny > 14) continue;
        if (!this.isPathTile(nx, ny)) continue;

        const nk = key({ x: nx, y: ny });
        if (!cameFrom.has(nk)) {
          cameFrom.set(nk, current);
          queue.push({ x: nx, y: ny });
        }
      }
    }

    if (!cameFrom.has(key(goal))) return null;

    const path = [];
    let cur = goal;
    while (cur) {
      path.push(cur);
      cur = cameFrom.get(key(cur));
    }
    return path.reverse();
  }

  setDestination(tileX, tileY) {
    if (!this.isAlive) return false;

    const start = this.getCurrentTile();
    const path = this.findPath(start, { x: tileX, y: tileY });
    if (!path || path.length === 0) return false;

    const T = CONFIG.TILE_SIZE * (this.scene.scaleFactor || 1);

    this.targetPath = path.map((p) => ({
      x: this.scene.mapStartX + p.x * T + T / 2,
      y: this.scene.mapStartY + p.y * T + T / 2,
    }));

    this.currentPathIndex = 0;
    
    // Si on donne une nouvelle destination pendant le combat, libérer l'ennemi
    if (this.blockingEnemy) {
      this.releaseEnemy();
    }
    
    return true;
  }

  // -----------------------------
  // Update / Movement / Combat
  // -----------------------------
  update(time, delta) {
    const now = time ?? this.scene?.time?.now ?? 0;
    const dt = delta ?? this.scene?.game?.loop?.delta ?? 16;

    if (!this.isAlive || this.scene.isPaused) return;

    // Toujours permettre le déplacement, même en combat
    this.followPath(dt);

    // Gérer le combat si on a un ennemi bloqué
    if (this.blockingEnemy) {
      if (!this.blockingEnemy.active || this.blockingEnemy.hp <= 0) {
        this.releaseEnemy();
      } else {
        // Vérifier la distance avec l'ennemi - si on s'est trop éloigné, le libérer
        const dist = Phaser.Math.Distance.Between(this.x, this.y, this.blockingEnemy.x, this.blockingEnemy.y);
        if (dist > 50) {
          // Si on s'est éloigné de plus de 50 pixels, libérer l'ennemi
          this.releaseEnemy();
        } else {
          // Sinon, continuer à attaquer
        this.tryAttack(now);
      }
      }
    } else {
      // Si on n'est pas en combat, vérifier si on peut engager un ennemi
      this.checkForEnemyEngage();
    }
    
    // Gérer la régénération automatique
    this.handleRegeneration(now);
  }
  
  handleRegeneration(now) {
    if (!this.isAlive || this.hp >= this.maxHp) {
      this.stopRegeneration();
      return;
    }
    
    // Si en combat, arrêter la régénération
    if (this.blockingEnemy) {
      this.stopRegeneration();
      return;
    }
    
    // Vérifier si 5 secondes se sont écoulées depuis le dernier dégât
    const timeSinceDamage = now - this.lastDamageTime;
    
    if (timeSinceDamage >= this.regenDelay) {
      // Démarrer la régénération si elle n'est pas déjà active
      if (!this.regenTimer) {
        this.startRegeneration();
      }
    } else {
      // Pas encore assez de temps, arrêter la régénération si elle est active
      if (this.regenTimer) {
        this.stopRegeneration();
      }
    }
  }
  
  startRegeneration() {
    if (this.regenTimer || !this.scene || !this.scene.time) return;
    if (!this.isAlive || this.hp >= this.maxHp) return;
    
    this.regenTimer = this.scene.time.addEvent({
      delay: this.regenInterval,
      callback: () => {
        if (!this.isAlive || this.hp >= this.maxHp) {
          this.stopRegeneration();
          return;
        }
        
        // Vérifier si on est toujours hors combat et si assez de temps s'est écoulé
        const timeSinceDamage = this.scene.time.now - this.lastDamageTime;
        if (timeSinceDamage < this.regenDelay || this.blockingEnemy) {
          this.stopRegeneration();
      return;
    }

        // Régénérer 3% de la vie max
        const healAmount = Math.ceil(this.maxHp * this.regenPercent);
        const oldHp = this.hp;
        this.hp = Math.min(this.maxHp, this.hp + healAmount);
        
        // Mettre à jour la barre de vie et le tooltip
        this.drawHealthBar();
        if (this.hpTooltip) {
          this.hpTooltip.setText(this.getHpTooltipText());
        }
      },
      loop: true
    });
  }
  
  stopRegeneration() {
    if (this.regenTimer) {
      this.regenTimer.remove();
      this.regenTimer = null;
    }
  }

  followPath(delta) {
    if (!this.targetPath || this.currentPathIndex >= this.targetPath.length) return;

    const target = this.targetPath[this.currentPathIndex];
    const dist = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);

    if (dist < 2) {
      this.currentPathIndex++;
      return;
    }

    const step = (this.moveSpeed * delta) / 1000;
    const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);

    // Petit “bobbing” de marche (subtil)
    const s = this.scene.scaleFactor || 1;
    const k = this.baseScale;
    const bob = Math.sin((this.scene.time.now || 0) / 90) * 0.35 * s * k;
    this.bodyGroup.y = bob;
    this.swordGroup.y = bob;

    const dx = Math.cos(angle) * Math.min(step, dist);
    const dy = Math.sin(angle) * Math.min(step, dist);

    this.x += dx;
    this.y += dy;
    this.setDepth(40 + Math.floor(this.y / 10));

    // Oriente légèrement l’épée selon le mouvement (sans faire tourner tout le perso)
    if (this.swordPivot) {
      const desired = Phaser.Math.Clamp(angle, -Math.PI, Math.PI);
      const tilt = Phaser.Math.Clamp(Math.sin(desired) * 0.18, -0.25, 0.25);
      this.swordPivot.rotation = Phaser.Math.Linear(this.swordPivot.rotation, tilt - 0.25, 0.12);
    }
  }

  checkForEnemyEngage() {
    if (!this.scene?.enemies) return;
    const enemies = this.scene.enemies.getChildren();

    let closest = null;
    let minDist = 32;

    for (const enemy of enemies) {
      if (!enemy.active || enemy.isBlocked || enemy.isRanged) continue;
      const d = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
      if (d < minDist) {
        minDist = d;
        closest = enemy;
      }
    }

    if (closest) this.blockEnemy(closest);
  }

  blockEnemy(enemy) {
    this.blockingEnemy = enemy;
    enemy.isBlocked = true;
    enemy.blockedBy = this;

    // Ne pas vider le chemin automatiquement - permettre le déplacement pendant le combat
    // Le joueur peut toujours donner une nouvelle destination pour partir
    
    // Arrêter la régénération quand on entre en combat
    this.stopRegeneration();

    this.tryAttack(this.scene?.time?.now ?? 0);
  }

  tryAttack(time) {
    if (time - this.lastAttackTime < this.attackInterval) return;
    if (!this.blockingEnemy || !this.blockingEnemy.active) return;

    this.lastAttackTime = time;

    // Hit
    this.blockingEnemy.damage(this.damage, { source: "hero" });

    // Animations
    this.playAttackAnimation(this.blockingEnemy);
  }

  playAttackAnimation(enemy) {
    if (!enemy || !enemy.active) return;
    
    const s = this.scene.scaleFactor || 1;
    const k = this.baseScale;

    const angleToEnemy = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);

    // 1) Swing d'épée basé sur un pivot -> plus “propre” et punchy
    if (this.swordPivot) {
      // Pré-armement puis coup
      const pre = -0.95;
      const hit = 0.75;

      this.swordPivot.rotation = pre;

      this.scene.tweens.add({
        targets: this.swordPivot,
        rotation: hit,
        duration: 140,
        ease: "Cubic.easeOut",
        yoyo: true,
        hold: 0,
        onComplete: () => {
          // revient à une pose neutre
          this.scene.tweens.add({
            targets: this.swordPivot,
            rotation: -0.25,
            duration: 120,
            ease: "Cubic.easeOut",
          });
        },
      });
    }

    // 2) Arc trail (beaucoup plus stylé) : double arc + petit glow
    this.swordTrail.clear();

    // Arc principal
    this.swordTrail.lineStyle(8 * s * k, 0xffd166, 0.55);
    this.swordTrail.beginPath();
    this.swordTrail.arc(0, 0, 30 * s * k, angleToEnemy - 1.15, angleToEnemy + 0.55);
    this.swordTrail.strokePath();

    // Highlight
    this.swordTrail.lineStyle(4 * s * k, 0xffffff, 0.38);
    this.swordTrail.beginPath();
    this.swordTrail.arc(0, 0, 29 * s * k, angleToEnemy - 1.05, angleToEnemy + 0.45);
    this.swordTrail.strokePath();

    this.swordTrail.alpha = 1;

    this.scene.tweens.add({
      targets: this.swordTrail,
      alpha: 0,
      duration: 170,
      ease: "Quad.easeOut",
      onComplete: () => this.swordTrail.clear(),
    });

    // 3) Petit impact sparkle côté ennemi (ça fait “hit confirm”)
    this.spawnHitSpark(angleToEnemy);

    // 4) Recul du corps + petite torsion
    this.scene.tweens.add({
      targets: this.bodyGroup,
      x: -Math.cos(angleToEnemy) * 2.2 * s * k,
      y: Math.sin(angleToEnemy) * 1.2 * s * k,
      duration: 90,
      yoyo: true,
      ease: "Quad.easeOut",
      onComplete: () => {
        this.bodyGroup.x = 0;
        this.bodyGroup.y = 0;
      },
    });

    this.scene.tweens.add({
      targets: this.bodyGroup,
      rotation: 0.18 * Math.sign(Math.cos(angleToEnemy)),
      duration: 110,
      yoyo: true,
      ease: "Quad.easeOut",
      onComplete: () => (this.bodyGroup.rotation = 0),
    });
  }

  spawnHitSpark(angle) {
    const s = this.scene.scaleFactor || 1;
    const k = this.baseScale;

    // Spark à la “position” de l'impact (dans le repère local du hero)
    const r = 26 * s * k;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;

    this.hitSpark.clear();
    this.hitSpark.alpha = 1;

    // Étoile simple (traits)
    this.hitSpark.lineStyle(3.5 * s * k, 0xffffff, 0.9);
    this.hitSpark.beginPath();
    this.hitSpark.moveTo(px - 6 * s * k, py);
    this.hitSpark.lineTo(px + 6 * s * k, py);
    this.hitSpark.moveTo(px, py - 6 * s * k);
    this.hitSpark.lineTo(px, py + 6 * s * k);
    this.hitSpark.strokePath();

    // Petit halo
    this.hitSpark.fillStyle(0xffd166, 0.45);
    this.hitSpark.fillCircle(px, py, 4.5 * s * k);

    this.scene.tweens.add({
      targets: this.hitSpark,
      alpha: 0,
      duration: 120,
      ease: "Quad.easeOut",
      onComplete: () => this.hitSpark.clear(),
    });
  }

  // -----------------------------
  // Damage / Death / Respawn
  // -----------------------------
  takeDamage(amount) {
    if (!this.isAlive) return;

    this.hp -= amount;
    
    // Mettre à jour le temps du dernier dégât
    this.lastDamageTime = this.scene?.time?.now || 0;
    
    // Arrêter la régénération si elle est active
    this.stopRegeneration();
    
    this.drawHealthBar();
    
    // Mettre à jour le tooltip si visible
    if (this.hpTooltip) {
      this.hpTooltip.setText(this.getHpTooltipText());
    }
    
    this.flashDamage();

    if (this.hp <= 0) this.die();
  }

  flashDamage() {
    // Comme on dessine en Graphics, on fait un flash via alpha (simple et clean)
    this.scene.tweens.add({
      targets: [this.bodyGroup, this.swordGroup],
      alpha: 0.2,
      duration: 60,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        this.bodyGroup.alpha = 1;
        this.swordGroup.alpha = 1;
      },
    });
  }

  releaseEnemy() {
    if (this.blockingEnemy) {
      this.blockingEnemy.isBlocked = false;
      this.blockingEnemy.blockedBy = null;
    }
    this.blockingEnemy = null;
  }

  die() {
    this.isAlive = false;
    this.hp = 0;

    if (this.scene?.runTracker) {
      this.scene.runTracker.onHeroDeath();
    }

    this.hideHpTooltip();
    this.stopRegeneration();
    this.releaseEnemy();
    this.targetPath = [];
    this.currentPathIndex = 0;

    // petite “pop” avant de disparaître
    this.scene.tweens.add({
      targets: this,
      scale: this.visualScale * 1.05,
      duration: 80,
      yoyo: true,
      onComplete: () => {
        this.setVisible(false);
        this.spawnCorpse();
      },
    });
  }

  spawnCorpse() {
    const s = this.scene.scaleFactor || 1;
    const k = this.baseScale;

    this.corpseContainer = this.scene.add.container(this.x, this.y).setDepth(45);

    const blood = this.scene.add.graphics();
    blood.fillStyle(0x8b0000, 0.82);
    blood.fillEllipse(0, 10 * s * k, 30 * s * k, 13 * s * k);

    const body = this.scene.add.graphics();
    body.fillStyle(0x5a5a5a, 1);
    body.fillRoundedRect(-14 * s * k, -18 * s * k, 28 * s * k, 36 * s * k, 7 * s * k);
    body.fillStyle(0x2d2d2d, 1);
    body.fillCircle(0, -22 * s * k, 8 * s * k);

    const timerText = this.scene.add
      .text(0, -48 * s * k, "20", {
        fontSize: `${Math.max(14, 16 * s * k)}px`,
        color: "#ffdddd",
        fontStyle: "bold",
        stroke: "#000",
        strokeThickness: Math.max(2, 3 * s * k),
      })
      .setOrigin(0.5);

    this.corpseContainer.add([blood, body, timerText]);

    let remaining = 20;

    this.corpseTimerEvent = this.scene.time.addEvent({
      delay: 1000,
      repeat: 19,
      callback: () => {
        remaining -= 1;
        timerText.setText(`${remaining}`);
        if (remaining <= 0) this.respawn();
      },
    });
  }

  respawn() {
    if (this.corpseTimerEvent) {
      this.corpseTimerEvent.remove();
      this.corpseTimerEvent = null;
    }

    if (this.corpseContainer) {
      this.corpseContainer.destroy();
      this.corpseContainer = null;
    }

    this.hp = this.maxHp;
    this.isAlive = true;

    this.drawHealthBar();
    this.setVisible(true);

    // Respawn “Back” propre
    this.setScale(0);
    this.scene.tweens.add({
      targets: this,
      scale: this.visualScale,
      duration: 240,
      ease: "Back.easeOut",
      onComplete: () => {
        // reset alpha/rotations au cas où
        this.alpha = 1;
        this.bodyGroup.rotation = 0;
        if (this.swordPivot) this.swordPivot.rotation = -0.25;
      },
    });
  }
}
