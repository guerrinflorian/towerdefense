
import { CONFIG } from "../config/settings.js";

const PATH_TYPES = [1, 4, 7];

export class Hero extends Phaser.GameObjects.Container {
  constructor(scene, tileX, tileY) {
    const T = CONFIG.TILE_SIZE * scene.scaleFactor;
    const startX = scene.mapStartX + tileX * T + T / 2;
    const startY = scene.mapStartY + tileY * T + T / 2;
    super(scene, startX, startY);

    this.scene = scene;
    this.maxHp = 170;
    this.hp = this.maxHp;
    this.damage = 25;
    this.attackInterval = 1700;
    this.moveSpeed = 140 * (scene.scaleFactor || 1);
    this.isAlive = true;
    this.blockingEnemy = null;
    this.targetPath = [];
    this.currentPathIndex = 0;
    this.lastAttackTime = 0;
    this.corpseTimerEvent = null;
    this.corpseContainer = null;

    this.bodyGroup = scene.add.container(0, 0);
    this.add(this.bodyGroup);
    this.drawBody();

    this.hpBar = this.scene.add.graphics();
    this.add(this.hpBar);
    this.drawHealthBar();

    this.swordTrail = this.scene.add.graphics();
    this.swordTrail.setDepth(1);
    this.add(this.swordTrail);

    scene.add.existing(this);
    this.setDepth(40);
    this.setSize(48, 48);
    this.setScale(scene.scaleFactor || 1);
  }

  drawBody() {
    this.bodyGroup.removeAll(true);
    const g = this.scene.add.graphics();
    const s = this.scene.scaleFactor || 1;

    // Cape
    g.fillStyle(0x1a1a2e, 0.85);
    g.fillEllipse(0, 6 * s, 18 * s, 24 * s);

    // Armure
    g.fillStyle(0x454545);
    g.fillRoundedRect(-10 * s, -16 * s, 20 * s, 30 * s, 6);
    g.lineStyle(2 * s, 0x222222);
    g.strokeRoundedRect(-10 * s, -16 * s, 20 * s, 30 * s, 6);

    // Épaulières
    g.fillStyle(0x6e6e6e);
    g.fillCircle(-9 * s, -12 * s, 6 * s);
    g.fillCircle(9 * s, -12 * s, 6 * s);

    // Ceinture
    g.fillStyle(0x8b5a2b);
    g.fillRect(-10 * s, 4 * s, 20 * s, 4 * s);

    // Tête
    g.fillStyle(0xffd4a3);
    g.fillCircle(0, -22 * s, 7 * s);
    g.fillStyle(0x2d2d2d);
    g.fillRect(-8 * s, -28 * s, 16 * s, 6 * s);

    // Épée
    const sword = this.scene.add.graphics();
    sword.fillStyle(0xc0c0c0);
    sword.fillRect(14 * s, -4 * s, 18 * s, 5 * s);
    sword.fillStyle(0xf5f5f5);
    sword.fillRect(14 * s, -4 * s, 18 * s, 2 * s);
    sword.fillStyle(0x8b4513);
    sword.fillRect(10 * s, -2 * s, 6 * s, 8 * s);

    this.bodyGroup.add([g, sword]);
  }

  drawHealthBar() {
    const pct = Phaser.Math.Clamp(this.hp / this.maxHp, 0, 1);
    const width = 50 * (this.scene.scaleFactor || 1);
    const height = 6 * (this.scene.scaleFactor || 1);
    this.hpBar.clear();
    this.hpBar.fillStyle(0x000000, 0.6);
    this.hpBar.fillRoundedRect(-width / 2, -42 * (this.scene.scaleFactor || 1), width, height, 3);
    this.hpBar.fillStyle(pct < 0.3 ? 0xff3b30 : pct < 0.6 ? 0xffc107 : 0x4caf50);
    this.hpBar.fillRoundedRect(-width / 2 + 1, -42 * (this.scene.scaleFactor || 1) + 1, (width - 2) * pct, height - 2, 3);
  }

  getCurrentTile() {
    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;
    const tx = Math.floor((this.x - this.scene.mapStartX) / T);
    const ty = Math.floor((this.y - this.scene.mapStartY) / T);
    return { x: Phaser.Math.Clamp(tx, 0, 14), y: Phaser.Math.Clamp(ty, 0, 14) };
  }

  isPathTile(tx, ty) {
    const row = this.scene.levelConfig.map[ty];
    if (!row) return false;
    const tile = row[tx];
    return PATH_TYPES.includes(tile);
  }

  findPath(start, goal) {
    if (!this.isPathTile(goal.x, goal.y)) return null;
    const queue = [start];
    const cameFrom = new Map();
    const key = (p) => `${p.x},${p.y}`;
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
        const nKey = key({ x: nx, y: ny });
        if (!cameFrom.has(nKey)) {
          cameFrom.set(nKey, current);
          queue.push({ x: nx, y: ny });
        }
      }
    }

    if (!cameFrom.has(key(goal))) return null;

    const path = [];
    let current = goal;
    while (current) {
      path.push(current);
      current = cameFrom.get(key(current));
    }
    return path.reverse();
  }

  setDestination(tileX, tileY) {
    if (!this.isAlive) return false;
    const start = this.getCurrentTile();
    const path = this.findPath(start, { x: tileX, y: tileY });
    if (!path || path.length === 0) return false;

    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;
    this.targetPath = path.map((p) => ({
      x: this.scene.mapStartX + p.x * T + T / 2,
      y: this.scene.mapStartY + p.y * T + T / 2,
    }));
    this.currentPathIndex = 0;
    return true;
  }

  update(time, delta) {
    const now = time ?? this.scene?.time?.now ?? 0;
    const dt = delta ?? this.scene?.game?.loop?.delta ?? 16;
    if (!this.isAlive || this.scene.isPaused) return;

    if (this.blockingEnemy) {
      if (!this.blockingEnemy.active || this.blockingEnemy.hp <= 0) {
        this.releaseEnemy();
      } else {
        this.tryAttack(now);
      }
      return;
    }

    this.followPath(dt);
    this.checkForEnemyEngage();
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
    const dx = Math.cos(angle) * Math.min(step, dist);
    const dy = Math.sin(angle) * Math.min(step, dist);

    this.x += dx;
    this.y += dy;
    this.setDepth(40 + Math.floor(this.y / 10));
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

    if (closest) {
      this.blockEnemy(closest);
    }
  }

  blockEnemy(enemy) {
    this.blockingEnemy = enemy;
    enemy.isBlocked = true;
    enemy.blockedBy = this;
    this.targetPath = [];
    this.currentPathIndex = 0;
    this.tryAttack(this.scene?.time?.now ?? 0);
  }

  tryAttack(time) {
    if (time - this.lastAttackTime < this.attackInterval) return;
    if (!this.blockingEnemy || !this.blockingEnemy.active) return;

    this.lastAttackTime = time;
    this.blockingEnemy.damage(this.damage);
    this.playAttackAnimation(this.blockingEnemy);
  }

  playAttackAnimation(enemy) {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
    const s = this.scene.scaleFactor || 1;

    this.swordTrail.clear();
    this.swordTrail.lineStyle(6 * s, 0xffd166, 0.9);
    this.swordTrail.beginPath();
    this.swordTrail.arc(0, 0, 26 * s, angle - 0.8, angle + 0.3);
    this.swordTrail.strokePath();

    this.scene.tweens.add({
      targets: this.swordTrail,
      alpha: 0,
      duration: 180,
      onComplete: () => this.swordTrail.clear(),
    });

    this.scene.tweens.add({
      targets: this.bodyGroup,
      rotation: 0.2 * Math.sign(Math.cos(angle)),
      duration: 120,
      yoyo: true,
    });
  }

  takeDamage(amount) {
    if (!this.isAlive) return;
    this.hp -= amount;
    this.drawHealthBar();
    this.flashDamage();
    if (this.hp <= 0) {
      this.die();
    }
  }

  flashDamage() {
    this.bodyGroup.list.forEach((child) => {
      if (child.setTint) {
        this.scene.tweens.add({
          targets: child,
          tint: 0xff0000,
          duration: 100,
          yoyo: true,
          onComplete: () => child.clearTint && child.clearTint(),
        });
      }
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
    this.releaseEnemy();
    this.targetPath = [];
    this.currentPathIndex = 0;
    this.setVisible(false);
    this.spawnCorpse();
  }

  spawnCorpse() {
    const s = this.scene.scaleFactor || 1;
    this.corpseContainer = this.scene.add.container(this.x, this.y).setDepth(45);

    const blood = this.scene.add.graphics();
    blood.fillStyle(0x8b0000, 0.8);
    blood.fillEllipse(0, 6 * s, 26 * s, 12 * s);

    const body = this.scene.add.graphics();
    body.fillStyle(0x555555);
    body.fillRoundedRect(-12 * s, -16 * s, 24 * s, 32 * s, 6);
    body.fillStyle(0x2d2d2d);
    body.fillCircle(0, -20 * s, 7 * s);

    const timerText = this.scene.add
      .text(0, -40 * s, "20", {
        fontSize: `${Math.max(14, 16 * s)}px`,
        color: "#ffdddd",
        fontStyle: "bold",
        stroke: "#000",
        strokeThickness: 3,
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
        if (remaining <= 0) {
          this.respawn();
        }
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
    this.setVisible(true);
    this.drawHealthBar();
    this.scene.tweens.add({
      targets: this,
      scale: 0,
      duration: 0,
      onComplete: () => {
        this.scene.tweens.add({
          targets: this,
          scale: this.scene.scaleFactor || 1,
          duration: 220,
          ease: "Back.easeOut",
        });
      },
    });
  }
}
