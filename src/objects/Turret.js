import { TURRETS } from "../config/turrets/index.js";

export class Turret extends Phaser.GameObjects.Container {
  constructor(scene, x, y, config) {
    super(scene, x, y);
    this.scene = scene;

    // Clone de la config
    this.config = JSON.parse(
      JSON.stringify(typeof config === "string" ? TURRETS[config] : config)
    );
    const originalConfig =
      typeof config === "string" ? TURRETS[config] : config;
    this.config.onDrawBarrel = originalConfig.onDrawBarrel;
    this.config.onFire = originalConfig.onFire;

    // Valeur par défaut si maxLevel n'est pas défini dans la config
    this.config.maxLevel = this.config.maxLevel || 3;

    this.level = 1;
    this.lastFired = 0;

    // --- VISUEL ---
    this.base = scene.add.graphics();
    this.drawBase();
    this.add(this.base);

    this.barrelGroup = scene.add.container(0, 0);
    this.add(this.barrelGroup);
    this.drawBarrel();

    // Portée
    this.rangeCircle = scene.add.circle(0, 0, this.config.range);
    this.rangeCircle.setStrokeStyle(2, 0xffffff, 0.3);
    this.rangeCircle.setVisible(false);
    this.sendToBack(this.rangeCircle);
    this.add(this.rangeCircle);

    this.setSize(64, 64);
    this.setInteractive();

    this.on("pointerover", () => this.rangeCircle.setVisible(true));
    this.on("pointerout", () => this.rangeCircle.setVisible(false));

    scene.add.existing(this);
  }

  drawBase() {
    this.base.clear();
    const color = this.level > 1 ? 0x554422 : 0x333333;
    this.base.fillStyle(color);
    this.base.fillCircle(0, 0, 24);
    this.base.lineStyle(2, 0x111111);
    this.base.strokeCircle(0, 0, 24);

    if (this.level >= 2) {
      this.base.fillStyle(0xffff00);
      this.base.fillCircle(-10, -18, 3);
    }
    if (this.level >= 3) {
      this.base.fillCircle(10, -18, 3);
    }
  }

  drawBarrel() {
    this.barrelGroup.removeAll(true);
    if (this.config.onDrawBarrel) {
      this.config.onDrawBarrel(
        this.scene,
        this.barrelGroup,
        this.config.color,
        this
      );
    }
  }

  // --- LOGIQUE D'AMÉLIORATION CORRIGÉE ---

  getNextLevelStats() {
    // Si on a atteint le niveau max défini pour CETTE tourelle, pas d'upgrade
    if (this.level >= this.config.maxLevel) return null;

    // Utiliser les valeurs actuelles de la config (qui sont déjà mises à jour après upgrade)
    let nextDmg = this.config.damage || 0;
    let nextRate = this.config.rate || 0;
    let nextRange = this.config.range || 0;
    let nextAoE = this.config.aoe || 0;
    let cost = 0;

    const baseCost = TURRETS[this.config.key]?.cost || 0;

    if (this.level === 1) {
      // Niv 1 -> 2
      nextDmg = Math.round(nextDmg * 1.5);
      nextRate = Math.round(nextRate / 1.2);
      nextRange = Math.round(nextRange * 1.2);
      if (nextAoE > 0) nextAoE = Math.round(nextAoE * 1.3);
      cost = Math.floor(baseCost * 2.5);
    } else if (this.level === 2) {
      // Niv 2 -> 3
      nextDmg = Math.round(nextDmg * 1.3);
      nextRate = Math.round(nextRate / 1.5);
      nextRange = Math.round(nextRange * 1.1);
      if (nextAoE > 0) nextAoE = Math.round(nextAoE * 1.2);
      cost = Math.floor(baseCost * 2.5 * 2.2);
    }

    return {
      damage: nextDmg,
      rate: nextRate,
      range: nextRange,
      aoe: nextAoE > 0 ? nextAoE : undefined,
      cost: cost,
    };
  }

  upgrade() {
    const nextStats = this.getNextLevelStats();
    if (!nextStats) return; // Sécurité

    this.level++;
    this.config.damage = nextStats.damage;
    this.config.rate = nextStats.rate;
    this.config.range = nextStats.range;
    if (nextStats.aoe) this.config.aoe = nextStats.aoe;

    // Le coût pour le prochain niveau (informatif, sert à l'affichage si on reclique)
    // Mais getNextLevelStats gère ça dynamiquement, donc pas besoin de stocker le "prochain coût" ici.

    // Mise à jour visuelle
    this.rangeCircle.setRadius(this.config.range);
    this.drawBase();
    this.drawBarrel();

    const txt = this.scene.add
      .text(
        this.x,
        this.y - 40,
        this.level >= this.config.maxLevel ? "MAX!" : "LEVEL UP!",
        {
          fontSize: "20px",
          fontStyle: "bold",
          color: "#ffff00",
          stroke: "#000",
          strokeThickness: 3,
        }
      )
      .setOrigin(0.5)
      .setDepth(200);

    this.scene.tweens.add({
      targets: txt,
      y: this.y - 80,
      alpha: 0,
      duration: 1000,
      onComplete: () => txt.destroy(),
    });
  }

  update(time, enemies) {
    const rate = this.config.rate || 1000;
    if (time > this.lastFired) {
      const target = this.findTarget(enemies);
      if (target) {
        const angle = Phaser.Math.Angle.Between(
          this.x,
          this.y,
          target.x,
          target.y
        );
        this.barrelGroup.rotation = Phaser.Math.Angle.RotateTo(
          this.barrelGroup.rotation,
          angle,
          0.2
        );

        if (
          Math.abs(
            Phaser.Math.Angle.ShortestBetween(this.barrelGroup.rotation, angle)
          ) < 0.5
        ) {
          this.fire(target);
          this.lastFired = time + rate;
        }
      }
    }
  }

  findTarget(enemies) {
    let nearest = null;
    let minDist = this.config.range;
    enemies.children.each((e) => {
      if (e.active) {
        const d = Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y);
        if (d <= this.config.range && d < minDist) {
          minDist = d;
          nearest = e;
        }
      }
    });
    return nearest;
  }

  fire(target) {
    this.scene.tweens.add({
      targets: this.barrelGroup,
      x: -6 * Math.cos(this.barrelGroup.rotation),
      y: -6 * Math.sin(this.barrelGroup.rotation),
      duration: 60,
      yoyo: true,
      ease: "Quad.easeOut",
    });
    if (this.config.onFire) {
      this.config.onFire(this.scene, this, target);
    }
  }
}
