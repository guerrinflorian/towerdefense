import { ENEMIES } from "../config/settings.js";

export class Enemy extends Phaser.GameObjects.Container {
  constructor(scene, path, typeKey) {
    super(scene, -100, -100);

    this.scene = scene;
    this.path = path;
    this.typeKey = typeKey;

    // --- INITIALISATION DES STATS ---
    this.stats =
      ENEMIES && ENEMIES[typeKey] ? ENEMIES[typeKey] : ENEMIES?.grunt || {};

    this.hp = this.stats.hp || 100;
    this.maxHp = this.hp;
    this.speed = this.stats.speed || 50;
    this.attackDamage = this.stats.damage || 10;
    this.attackSpeed = this.stats.attackSpeed || 1000;
    this.attackRange = this.stats.attackRange || 30;
    this.isRanged = this.stats.isRanged || false;

    // --- ÉTATS & MOUVEMENT ---
    this.progress = 0; // Remplace le follower.t du tween
    this.isMoving = false;
    this.facingRight = true;
    this.lastAttackTime = 0;
    this.targetSoldier = null;
    this.isBlocked = false;
    this.blockedBy = null;

    // --- LOGIQUE D'ESPACEMENT (LISSÉE) ---
    this.targetPathOffset = (Math.random() - 0.5) * 25;
    this.currentPathOffset = this.targetPathOffset;
    this.separationRadius = 24;
    this.maxPathWidth = 30;

    // Vecteur de direction lissé pour éviter les sauts dans les coins
    this.smoothedDir = new Phaser.Math.Vector2(1, 0);

    // --- CAPACITÉS ---
    this.isParalyzed = false;
    this.isInShell = false;
    this.isInvulnerable = false;
    this.shellThreshold = this.stats.shellThreshold || null;
    this.lastHealTime = 0;
    this.healInterval = this.stats.healInterval || null;
    this.lastSpawnTime = 0;

    // --- VISUEL ---
    this.initVisuals();

    this.scene.add.existing(this);
    this.setSize(32, 32);
    this.setInteractive();

    this.on("pointerover", () => this.showHpTooltip());
    this.on("pointerout", () => this.hideHpTooltip());
  }

  initVisuals() {
    const shadow = this.scene.add.ellipse(0, 15, 30, 10, 0x000000, 0.3);
    this.add(shadow);

    this.bodyGroup = this.scene.add.container(0, 0);
    this.add(this.bodyGroup);

    if (this.stats.onDraw) {
      this.stats.onDraw(this.scene, this.bodyGroup, this.stats.color, this);
    } else {
      const rect = this.scene.add.rectangle(
        0,
        0,
        32,
        32,
        this.stats.color || 0xffffff
      );
      this.bodyGroup.add(rect);
    }
    this.drawHealthBar();
  }

  spawn() {
    this.isMoving = true;
    this.progress = 0;
    // On calcule la longueur une fois pour l'optimisation
    this.pathLength = this.path.getLength();
  }

  update(time, delta) {
    if (!this.active || this.isParalyzed || this.isInShell) return;

    // 1. Logique de mouvement manuelle (plus fluide qu'un tween pour les chemins)
    if (this.isMoving && !this.isBlocked) {
      this.handleMovement(delta);
    }

    // 2. Capacités et combat
    this.handleSpecialAbilities(time);
    this.adjustSpacing(delta);
    this.updateCombat(time);

    if (this.stats.onUpdateAnimation) {
      this.stats.onUpdateAnimation(time, this);
    }
  }

  handleMovement(delta) {
    // Calcul de la progression basée sur la vitesse réelle (pixels/sec)
    // Delta est en ms, donc (vitesse * (delta/1000)) / longueur_totale
    const moveStep = (this.speed * (delta / 1000)) / this.pathLength;
    this.progress += moveStep;

    if (this.progress >= 1) {
      this.progress = 1;
      this.reachEnd();
      return;
    }

    // 1. Position de base sur le chemin
    const point = this.path.getPoint(this.progress);

    // 2. Calcul du vecteur de direction (Tangent)
    // On utilise getTangent pour avoir un vecteur unitaire précis
    const tangent = this.path.getTangent(this.progress);

    // 3. Lissage de la direction (Interpolation)
    // Cela empêche le "saut" brusque de la normale dans les angles droits
    this.smoothedDir.x = Phaser.Math.Linear(
      this.smoothedDir.x,
      tangent.x,
      0.15
    );
    this.smoothedDir.y = Phaser.Math.Linear(
      this.smoothedDir.y,
      tangent.y,
      0.15
    );

    // 4. Calcul de la Normale à partir de la direction lissée
    const normX = -this.smoothedDir.y;
    const normY = this.smoothedDir.x;

    // 5. Application de la position avec l'offset latéral
    this.setPosition(
      point.x + normX * this.currentPathOffset,
      point.y + normY * this.currentPathOffset
    );

    // 6. Gestion du Flip visuel (Hystérésis)
    if (this.stats.shouldRotate !== false) {
      if (this.smoothedDir.x > 0.1 && !this.facingRight) {
        this.facingRight = true;
        this.bodyGroup.setScale(1, 1);
      } else if (this.smoothedDir.x < -0.1 && this.facingRight) {
        this.facingRight = false;
        this.bodyGroup.setScale(-1, 1);
      }
    }

    this.setDepth(10 + Math.floor(this.y / 10));
  }

  adjustSpacing(delta) {
    if (!this.scene.enemies || !this.active) return;

    let avoidanceForce = 0;
    const neighbors = this.scene.enemies.getChildren();

    for (const other of neighbors) {
      if (other === this || !other.active) continue;

      const dist = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        other.x,
        other.y
      );
      if (dist < this.separationRadius) {
        // Pousse vers l'extérieur du couloir de manière fluide
        avoidanceForce += (this.x < other.x ? -1 : 1) * 2;
      }
    }

    this.targetPathOffset += avoidanceForce * 0.1;
    this.targetPathOffset = Phaser.Math.Clamp(
      this.targetPathOffset,
      -this.maxPathWidth,
      this.maxPathWidth
    );

    // Lerp ultra fluide pour le mouvement latéral (évite les vibrations)
    this.currentPathOffset = Phaser.Math.Linear(
      this.currentPathOffset,
      this.targetPathOffset,
      0.05
    );
  }

  reachEnd() {
    if (this.active) {
      this.scene.takeDamage();
      this.destroy();
    }
  }

  // =========================================================
  //            COMBAT, HP & CAPACITÉS (NETTOYÉ)
  // =========================================================

  damage(amount) {
    if (this.isInvulnerable || !this.active) return;

    this.hp -= amount;
    this.updateHealthBar();

    this.scene.tweens.add({
      targets: this.bodyGroup,
      alpha: 0.5,
      duration: 50,
      yoyo: true,
    });

    if (
      this.shellThreshold &&
      !this.isInShell &&
      this.hp / this.maxHp <= this.shellThreshold
    ) {
      this.enterShell();
    }

    if (this.hp <= 0) this.die();
  }

  updateCombat(time) {
    if (this.isRanged) {
      this.handleRangedCombat(time);
    } else if (this.isBlocked && this.blockedBy) {
      if (time - this.lastAttackTime >= this.attackSpeed) {
        this.blockedBy.takeDamage(this.attackDamage);
        this.lastAttackTime = time;
      }
    }
  }

  handleRangedCombat(time) {
    this.findRangedTarget();
    if (this.targetSoldier?.active && this.targetSoldier?.isAlive) {
      const dist = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        this.targetSoldier.x,
        this.targetSoldier.y
      );
      if (dist <= this.attackRange) {
        this.isMoving = false; // On s'arrête pour tirer
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
    const proj = this.scene.add
      .circle(this.x, this.y, 4, 0xffffff)
      .setDepth(2000);
    this.scene.tweens.add({
      targets: proj,
      x: soldier.x,
      y: soldier.y,
      duration: 300,
      onComplete: () => {
        if (soldier.active) soldier.takeDamage(this.attackDamage);
        proj.destroy();
      },
    });
  }

  findRangedTarget() {
    if (!this.scene.soldiers) return;
    let closest = null;
    let minDist = this.attackRange;
    this.scene.soldiers.getChildren().forEach((s) => {
      const d = Phaser.Math.Distance.Between(this.x, this.y, s.x, s.y);
      if (s.active && s.isAlive && d < minDist) {
        minDist = d;
        closest = s;
      }
    });
    this.targetSoldier = closest;
  }

  handleSpecialAbilities(time) {
    // Healer
    if (this.healInterval && time - this.lastHealTime >= this.healInterval) {
      this.healNearbyEnemies();
      this.lastHealTime = time;
    }
    // Spawner
    if (
      this.stats.spawnInterval &&
      time - this.lastSpawnTime >= this.stats.spawnInterval
    ) {
      this.spawnMinions();
      this.lastSpawnTime = time;
    }
  }

  enterShell() {
    this.isInShell = true;
    this.isInvulnerable = true;
    this.scene.time.delayedCall(this.stats.shellDuration || 3000, () => {
      this.isInShell = false;
      this.isInvulnerable = false;
    });
  }

  healNearbyEnemies() {
    const radius = this.stats.healRadius || 100;
    this.scene.enemies.getChildren().forEach((e) => {
      if (
        e !== this &&
        e.active &&
        Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y) < radius
      ) {
        e.hp = Math.min(e.hp + (this.stats.healAmount || 10), e.maxHp);
        e.updateHealthBar();
      }
    });
  }

  spawnMinions() {
    if (!this.stats.spawnType) return;
    for (let i = 0; i < (this.stats.spawnCount || 2); i++) {
      const m = new Enemy(this.scene, this.path, this.stats.spawnType);
      m.progress = Math.max(0, this.progress - 0.05);
      m.spawn();
      this.scene.enemies.add(m);
    }
  }

  drawHealthBar() {
    const width = 40;
    const height = 5;
    if (this.hpBarContainer) this.hpBarContainer.destroy();

    this.hpBarContainer = this.scene.add.container(0, -40);
    const bg = this.scene.add
      .rectangle(0, 0, width, height, 0x000000)
      .setOrigin(0.5);
    this.hpFill = this.scene.add
      .rectangle(-width / 2, 0, width, height, 0x00ff00)
      .setOrigin(0, 0.5);

    this.hpBarContainer.add([bg, this.hpFill]);
    this.add(this.hpBarContainer);
    this.hpBarContainer.setDepth(2000);
  }

  updateHealthBar() {
    const pct = Phaser.Math.Clamp(this.hp / this.maxHp, 0, 1);
    this.hpFill.width = 40 * pct;
    const color = pct < 0.3 ? 0xff0000 : pct < 0.6 ? 0xffa500 : 0x00ff00;
    this.hpFill.fillColor = color;
  }

  die() {
    if (this.isBlocked && this.blockedBy) this.blockedBy.releaseEnemy();
    if (this.stats.onDeath) this.stats.onDeath(this);
    this.scene.earnMoney(this.stats.reward || 10);
    this.explode();
    this.destroy();
  }

  explode() {
    for (let i = 0; i < 5; i++) {
      const p = this.scene.add.rectangle(
        this.x,
        this.y,
        6,
        6,
        this.stats.color
      );
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
    if (this.hpTooltip) return;
    this.hpTooltip = this.scene.add
      .text(this.x, this.y - 60, `${Math.ceil(this.hp)} HP`, {
        fontSize: "14px",
        backgroundColor: "#000",
        padding: 3,
      })
      .setOrigin(0.5)
      .setDepth(3000);
  }

  hideHpTooltip() {
    if (this.hpTooltip) {
      this.hpTooltip.destroy();
      this.hpTooltip = null;
    }
  }

  destroy(fromScene) {
    this.hideHpTooltip();
    super.destroy(fromScene);
  }
}
