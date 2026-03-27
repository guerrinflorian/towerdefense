import { CONFIG } from "../config/settings.js";

const EXPLOSION_DAMAGE = 115;

export class Barrier extends Phaser.GameObjects.Container {
  constructor(scene, x, y, path, pathProgress, isVertical) {
    super(scene, x, y);

    this.barrierHp = 350;
    this.barrierMaxHp = 350;
    this.path = path;
    this.pathProgress = pathProgress;
    this.isVertical = isVertical;
    this.blockedEnemies = new Set();
    this._dead = false;

    scene.add.existing(this);
    this.setDepth(50);

    this._initVisuals(scene);
  }

  _initVisuals(scene) {
    const T = CONFIG.TILE_SIZE * scene.scaleFactor;
    const thick = Math.round(12 * scene.scaleFactor);
    const len = Math.round(T * 0.88);

    const w = this.isVertical ? thick : len;
    const h = this.isVertical ? len : thick;

    // Ombre
    const shadow = scene.add.rectangle(
      3 * scene.scaleFactor,
      3 * scene.scaleFactor,
      w,
      h,
      0x000000,
      0.4
    );
    this.add(shadow);

    // Corps principal (bois)
    this.barrierBody = scene.add.rectangle(0, 0, w, h, 0x8b4513);
    this.barrierBody.setStrokeStyle(2 * scene.scaleFactor, 0xffd700);
    this.add(this.barrierBody);

    // Détail planches
    const planks = scene.add.graphics();
    planks.lineStyle(Math.max(1, scene.scaleFactor), 0x5c2a00, 0.7);
    const segments = 4;
    if (this.isVertical) {
      for (let i = 1; i < segments; i++) {
        const py = -h / 2 + (h / segments) * i;
        planks.lineBetween(-w / 2 + 2, py, w / 2 - 2, py);
      }
    } else {
      for (let i = 1; i < segments; i++) {
        const px = -w / 2 + (w / segments) * i;
        planks.lineBetween(px, -h / 2 + 2, px, h / 2 - 2);
      }
    }
    this.add(planks);

    // Barre de vie
    const barW = Math.max(w + 6 * scene.scaleFactor, 40 * scene.scaleFactor);
    const barH = 5 * scene.scaleFactor;
    const barY = -(h / 2 + 10 * scene.scaleFactor);

    const hpBg = scene.add
      .rectangle(0, barY, barW, barH, 0x000000)
      .setOrigin(0.5);
    this.hpFill = scene.add
      .rectangle(-barW / 2, barY, barW, barH, 0x00ff00)
      .setOrigin(0, 0.5);
    this._hpBarWidth = barW;

    this.add([hpBg, this.hpFill]);
  }

  takeDamage(amount) {
    if (this._dead || !this.active) return;

    this.barrierHp -= amount;
    this._updateHpBar();

    // Flash
    this.scene.tweens.add({
      targets: this.barrierBody,
      alpha: 0.35,
      duration: 60,
      yoyo: true,
    });

    if (this.barrierHp <= 0) {
      this._die();
    }
  }

  _updateHpBar() {
    if (!this.hpFill || !this.active) return;
    const pct = Math.max(0, this.barrierHp / this.barrierMaxHp);
    this.hpFill.width = this._hpBarWidth * pct;
    this.hpFill.fillColor =
      pct < 0.3 ? 0xff0000 : pct < 0.6 ? 0xffa500 : 0x00ff00;
  }

  // Appelé par les ennemis qui meurent pendant qu'ils sont bloqués (signature sans arg)
  releaseEnemy() {
    // L'ennemi se détruit lui-même, rien à faire ici
  }

  releaseAll() {
    this.blockedEnemies.forEach((enemy) => {
      if (enemy.active) {
        enemy.isBlocked = false;
        enemy.blockedBy = null;
        enemy.isMoving = true;
      }
    });
    this.blockedEnemies.clear();
  }

  // Destruction silencieuse (reset de vague) — pas d'explosion
  destroyQuiet() {
    if (!this.active) return;
    this.releaseAll();
    this.destroy();
  }

  _die() {
    if (this._dead) return;
    this._dead = true;

    const x = this.x;
    const y = this.y;
    const scene = this.scene;
    const scaleFactor = scene?.scaleFactor || 1;
    const radius = CONFIG.TILE_SIZE * scaleFactor * 1.4;

    this.releaseAll();

    // Flash d'explosion
    const blast = scene.add.circle(x, y, radius, 0xff6600, 0.85);
    blast.setDepth(300);
    scene.tweens.add({
      targets: blast,
      scale: 1.6,
      alpha: 0,
      duration: 500,
      onComplete: () => blast.destroy(),
    });

    // Anneau secondaire
    const ring = scene.add.circle(x, y, radius * 0.5, 0xffdd00, 0.6);
    ring.setDepth(301);
    scene.tweens.add({
      targets: ring,
      scale: 2.2,
      alpha: 0,
      duration: 350,
      onComplete: () => ring.destroy(),
    });

    // Éclats
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const spark = scene.add.rectangle(
        x,
        y,
        6 * scaleFactor,
        6 * scaleFactor,
        0x8b4513
      );
      spark.setDepth(302);
      scene.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * radius * 0.9,
        y: y + Math.sin(angle) * radius * 0.9,
        angle: Math.random() * 360,
        alpha: 0,
        scale: 0,
        duration: 400 + Math.random() * 200,
        onComplete: () => spark.destroy(),
      });
    }

    // Dégâts aux ennemis dans le rayon
    scene.enemies?.getChildren().forEach((enemy) => {
      if (!enemy.active) return;
      const d = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
      if (d <= radius) {
        enemy.damage(EXPLOSION_DAMAGE, { source: "spell" });
      }
    });

    this.destroy();
  }
}
