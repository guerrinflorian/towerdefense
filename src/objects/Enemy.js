// On importe ENEMIES depuis settings.js car c'est là qu'on l'a regroupé
import { ENEMIES } from "../config/settings.js";

export class Enemy extends Phaser.GameObjects.Container {
  constructor(scene, path, typeKey) {
    super(scene, -100, -100);
    this.scene = scene;
    this.path = path;
    this.typeKey = typeKey;

    // --- DEBUG ---
    // Si ENEMIES est undefined, c'est un problème d'import.
    if (!ENEMIES) {
      console.error(
        "ERREUR CRITIQUE : L'objet ENEMIES n'est pas chargé. Vérifiez src/config/settings.js"
      );
      return;
    }
    // Si ENEMIES[typeKey] est undefined, c'est que la vague demande un type qui n'existe pas.
    if (!ENEMIES[typeKey]) {
      console.error(
        `ERREUR : Le type d'ennemi '${typeKey}' n'existe pas dans ENEMIES.`
      );
      // Fallback sur 'grunt' pour éviter le crash
      this.stats = ENEMIES["grunt"];
    } else {
      this.stats = ENEMIES[typeKey];
    }
    // -------------

    // Stats
    this.hp = this.stats.hp;
    this.maxHp = this.stats.hp;
    this.speed = this.stats.speed;
    this.shouldRotate = true;

    // --- 1. VISUEL ---

    // Ombre
    const shadow = scene.add.ellipse(0, 15, 30, 10, 0x000000, 0.5);
    this.add(shadow);

    // Corps de l'ennemi
    this.bodyGroup = scene.add.container(0, 0);
    this.add(this.bodyGroup);

    // Dessin modulaire
    if (this.stats.onDraw) {
      this.stats.onDraw(this.scene, this.bodyGroup, this.stats.color, this);
    } else {
      const fallback = scene.add.rectangle(
        0,
        0,
        32,
        32,
        this.stats.color || 0xffffff
      );
      this.bodyGroup.add(fallback);
    }

    // --- 2. BARRE DE VIE ---
    this.drawHealthBar(scene);

    // Initialisation Phaser
    this.scene.add.existing(this);
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
  }

  update(time, delta) {
    if (this.active && this.stats && this.stats.onUpdateAnimation) {
      this.stats.onUpdateAnimation(time, this);
    }
  }

  drawHealthBar(scene) {
    const yOffset = -50;
    const width = 40;
    const height = 6;

    // Cadre noir + bordure blanche
    this.hpBg = scene.add.rectangle(
      0,
      yOffset,
      width + 2,
      height + 2,
      0x000000
    );
    this.hpBg.setStrokeStyle(1, 0xffffff);

    // Fond rouge sombre (vie manquante)
    this.hpRed = scene.add.rectangle(0, yOffset, width, height, 0x330000);

    // Barre verte (vie actuelle) - Ancrage à gauche (0, 0.5)
    this.hpGreen = scene.add.rectangle(
      -width / 2,
      yOffset,
      width,
      height,
      0x00ff00
    );
    this.hpGreen.setOrigin(0, 0.5);

    this.add([this.hpBg, this.hpRed, this.hpGreen]);
    this.hpBg.setDepth(100);
    this.hpRed.setDepth(100);
    this.hpGreen.setDepth(100);
  }

  spawn() {
    // Sécurité si path est null
    if (!this.path) return;

    const pathLength = this.path.getLength();
    const duration = (pathLength / this.speed) * 1000;

    this.scene.tweens.add({
      targets: this.follower,
      t: 1,
      duration: duration,
      onUpdate: () => {
        const p = this.path.getPoint(this.follower.t, this.follower.vec);
        this.setPosition(p.x, p.y);

        if (this.shouldRotate) {
          const nextP = this.path.getPoint(Math.min(this.follower.t + 0.01, 1));
          const angle = Phaser.Math.Angle.Between(p.x, p.y, nextP.x, nextP.y);
          this.bodyGroup.rotation = angle;
        }
      },
      onComplete: () => {
        if (this.active) {
          this.scene.takeDamage();
          this.destroy();
        }
      },
    });
  }

  damage(amount) {
    this.hp -= amount;

    // Flash blanc
    if (this.bodyGroup) {
      this.scene.tweens.add({
        targets: this.bodyGroup,
        alpha: 0.5,
        duration: 50,
        yoyo: true,
      });
    }

    this.updateHealthBar();

    if (this.hp <= 0) {
      this.scene.earnMoney(this.stats.reward);
      this.explode();
      this.destroy();
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

  explode() {
    for (let i = 0; i < 6; i++) {
      const p = this.scene.add.rectangle(
        this.x,
        this.y,
        8,
        8,
        this.stats.color
      );
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 40 + 20;

      this.scene.tweens.add({
        targets: p,
        x: this.x + Math.cos(angle) * speed,
        y: this.y + Math.sin(angle) * speed,
        alpha: 0,
        scale: 0.2,
        duration: 400,
        onComplete: () => p.destroy(),
      });
    }
  }
}
