import { ENEMIES } from "../config/settings.js";

export class Enemy extends Phaser.GameObjects.Container {
  constructor(scene, path, typeKey) {
    super(scene, -100, -100);

    this.scene = scene;
    this.path = path;
    this.typeKey = typeKey;

    this.stats = ENEMIES && ENEMIES[typeKey] ? ENEMIES[typeKey] : ENEMIES?.grunt || {};

    this.hp = this.stats.hp || 100;
    this.maxHp = this.hp;
    this.speed = this.stats.speed || 50;
    this.attackDamage = this.stats.damage || 10;
    this.playerDamage = this.stats.playerDamage || 1;
    this.attackSpeed = this.stats.attackSpeed || 1000;
    this.attackRange = this.stats.attackRange || 30;
    this.isRanged = this.stats.isRanged || false;

    this.progress = 0;
    this.isMoving = false;
    this.facingRight = true;
    this.lastAttackTime = 0;
    this.targetSoldier = null;
    this.isBlocked = false;
    this.blockedBy = null;

    // Système de lanes plus réactif - pas de collision, juste évitement visuel
    this.laneOffset = (Math.random() - 0.5) * 12;
    this.targetLaneOffset = this.laneOffset;
    this.avoidanceRadius = 32; // Distance à partir de laquelle on commence à éviter
    this.minDistance = 20; // Distance minimale souhaitée entre ennemis
    this.maxLaneWidth = 20;
    
    // Vitesses de réaction
    this.laneChangeSpeed = 0.15; // Plus rapide pour éviter les blocages
    this.tangentSmoothSpeed = 0.35;
    this.previousTangent = null;

    this.isParalyzed = false;
    this.paralysisTimer = null;
    this.paralysisPosition = null; // Position où l'ennemi a été paralysé
    this.isInShell = false;
    this.isInvulnerable = false;
    this.shellThreshold = this.stats.shellThreshold || null;
    this.lastHealTime = 0;
    this.healInterval = this.stats.healInterval || null;
    this.lastSpawnTime = 0;

    // Pour la variation de vitesse fluide
    this.speedMultiplier = 1.0;
    this.targetSpeedMultiplier = 1.0;

    this.initVisuals();

    this.scene.add.existing(this);
    this.setSize(32, 32);
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
    this.isMoving = true;
    this.progress = 0;
    if (this.path) {
      this.pathLength = this.path.getLength();
      this.previousTangent = this.calculateTangent(0);
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
    if (!this.active || !this.scene || this.isInShell || this.scene.isPaused) return;

    // Si paralysé, maintenir la position et ne rien faire d'autre
    if (this.isParalyzed) {
      if (this.paralysisPosition) {
        // Forcer l'ennemi à rester à sa position de paralysie
        this.setPosition(this.paralysisPosition.x, this.paralysisPosition.y);
      }
      return;
    }

    // Toujours calculer l'évitement, même si bloqué par un soldat
    this.calculateAvoidance(delta);

    if (this.isMoving && !this.isBlocked && this.path) {
      this.handleMovement(delta);
    }

    this.handleSpecialAbilities(time);
    this.updateCombat(time);

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

    let avoidanceLeft = 0;
    let avoidanceRight = 0;
    let slowDown = false;
    
    const neighbors = this.scene.enemies.getChildren();
    
    for (const other of neighbors) {
      if (other === this || !other.active) continue;

      const dx = this.x - other.x;
      const dy = this.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Si trop proche, on s'écarte sur les côtés
      if (dist < this.avoidanceRadius && dist > 0.1) {
        // Calculer de quel côté l'autre ennemi se trouve
        if (this.previousTangent) {
          const normalX = -this.previousTangent.y;
          const normalY = this.previousTangent.x;
          
          // Produit scalaire pour savoir si c'est à gauche ou droite
          const side = dx * normalX + dy * normalY;
          const strength = (this.avoidanceRadius - dist) / this.avoidanceRadius;
          
          if (side > 0) {
            avoidanceRight += strength;
          } else {
            avoidanceLeft += strength;
          }
        }

        // Ralentir si collision frontale imminente
        const progressDiff = other.progress - this.progress;
        if (progressDiff > 0 && progressDiff < 0.015 && dist < this.minDistance) {
          slowDown = true;
        }
      }
    }

    // Décision d'évitement : aller du côté opposé
    if (avoidanceLeft > avoidanceRight) {
      this.targetLaneOffset += avoidanceLeft * 3.0;
    } else if (avoidanceRight > avoidanceLeft) {
      this.targetLaneOffset -= avoidanceRight * 3.0;
    }

    // Retour progressif au centre si pas d'évitement nécessaire
    if (avoidanceLeft === 0 && avoidanceRight === 0) {
      this.targetLaneOffset *= 0.95;
    }

    // Ajustement de vitesse fluide pour éviter les blocages
    if (slowDown) {
      this.targetSpeedMultiplier = 0.4;
    } else {
      this.targetSpeedMultiplier = 1.0;
    }

    // Lissage de la vitesse
    this.speedMultiplier = Phaser.Math.Linear(
      this.speedMultiplier,
      this.targetSpeedMultiplier,
      0.1
    );

    // Clamp de l'offset
    this.targetLaneOffset = Phaser.Math.Clamp(
      this.targetLaneOffset,
      -this.maxLaneWidth,
      this.maxLaneWidth
    );

    // Application progressive de l'offset
    this.laneOffset = Phaser.Math.Linear(
      this.laneOffset,
      this.targetLaneOffset,
      this.laneChangeSpeed
    );
  }

  handleMovement(delta) {
    if (!this.pathLength) return;

    // Vitesse de base modulée par le multiplicateur fluide
    const effectiveSpeed = this.speed * this.speedMultiplier;
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
      if (this.scene.takeDamage) this.scene.takeDamage(this.playerDamage);
      this.destroy();
    }
  }

  damage(amount, metadata = {}) {
    if (this.isInvulnerable || !this.active) return;

    this.lastDamageSource = metadata?.source || null;

    this.hp -= amount;
    this.updateHealthBar();

    this.scene.tweens.add({
      targets: this.bodyGroup,
      alpha: 0.5,
      duration: 50,
      yoyo: true,
    });

    if (this.shellThreshold && !this.isInShell && (this.hp / this.maxHp) <= this.shellThreshold) {
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
        if (this.blockedBy.takeDamage) this.blockedBy.takeDamage(this.attackDamage);
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
    if (this.stats.onUpdateAnimation) return;

    if (this.healInterval && time - this.lastHealTime >= this.healInterval) {
      this.healNearbyEnemies();
      this.lastHealTime = time;
    }

    if (this.stats.spawnInterval && time - this.lastSpawnTime >= this.stats.spawnInterval) {
      this.spawnMinions();
      this.lastSpawnTime = time;
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
    this.scene.time.delayedCall(this.stats.shellDuration || 3000, () => {
      if (this.active) {
        this.isInShell = false;
        this.isInvulnerable = false;
      }
    });
  }

  spawnMinions() {
    if (!this.stats.spawnType || !this.scene?.enemies) return;
    for (let i = 0; i < (this.stats.spawnCount || 2); i++) {
      const m = new Enemy(this.scene, this.path, this.stats.spawnType);
      m.progress = Math.max(0, this.progress - 0.05);
      this.scene.enemies.add(m);
      m.spawn();
    }
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
  }

  updateHealthBar() {
    if (!this.hpFill) return;
    const pct = Phaser.Math.Clamp(this.hp / this.maxHp, 0, 1);
    this.hpFill.width = 40 * pct;
    const color = pct < 0.3 ? 0xff0000 : pct < 0.6 ? 0xffa500 : 0x00ff00;
    this.hpFill.fillColor = color;
    this.refreshHpTooltip();
  }

  die() {
    if (this.isBlocked && this.blockedBy?.releaseEnemy) {
      this.blockedBy.releaseEnemy();
    }
    if (this.stats.onDeath) this.stats.onDeath(this);
    if (this.scene.earnMoney) this.scene.earnMoney(this.stats.reward || 10);

    if (this.scene?.events) {
      this.scene.events.emit("enemy-killed", {
        source: this.lastDamageSource || null,
      });
    }

    this.explode();
    this.destroy();
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
    
    // Annuler toute paralysie précédente
    if (this.paralysisTimer) {
      this.paralysisTimer.remove();
      this.paralysisTimer = null;
    }
    
    // Sauvegarder la position actuelle où l'ennemi est paralysé
    this.paralysisPosition = { x: this.x, y: this.y };
    
    // Mettre l'ennemi en état de paralysie
    this.isParalyzed = true;
    
    // Arrêter le mouvement
    this.isMoving = false;
    
    // Si l'ennemi était bloqué par un soldat, le libérer
    if (this.isBlocked && this.blockedBy) {
      this.isBlocked = false;
      if (this.blockedBy.releaseEnemy) {
        this.blockedBy.releaseEnemy();
      }
      this.blockedBy = null;
    }
    
    // Créer un timer pour libérer l'ennemi après la durée spécifiée
    this.paralysisTimer = this.scene.time.delayedCall(duration, () => {
      if (this.active) {
        this.isParalyzed = false;
        this.paralysisPosition = null;
        this.isMoving = true; // Reprendre le mouvement
        this.paralysisTimer = null;
      }
    });
  }

  destroy(fromScene) {
    if (this.paralysisTimer) {
      this.paralysisTimer.remove();
      this.paralysisTimer = null;
    }
    this.hideHpTooltip();
    super.destroy(fromScene);
  }
}
