export class GoldCoin extends Phaser.GameObjects.Container {
  constructor(scene, x, y, amount) {
    super(scene, x, y);

    this.scene = scene;
    this.amount = amount;
    this.spawnedAt = scene?.time?.now || 0;
    this.lifetime = 15000;
    this.pickupRadius = 26 * (scene.scaleFactor || 1);
    this.isCollected = false;

    this.setDepth(55);
    this.drawCoin();
    this.playIdleAnimation();

    scene.add.existing(this);
  }

  drawCoin() {
    const s = this.scene.scaleFactor || 1;

    const shadow = this.scene.add.ellipse(0, 10 * s, 26 * s, 10 * s, 0x000000, 0.25);
    shadow.setScale(1, 0.85);
    this.add(shadow);

    const coin = this.scene.add.graphics();
    const radius = 10 * s;

    coin.fillStyle(0x8d5a15, 0.85);
    coin.fillCircle(1 * s, 1 * s, radius);
    coin.fillStyle(0xf4d35e, 1);
    coin.fillCircle(0, 0, radius - 1 * s);
    coin.lineStyle(2 * s, 0xe7b029, 1);
    coin.strokeCircle(0, 0, radius - 2 * s);

    // Relief central
    coin.fillStyle(0xe7b029, 1);
    coin.fillRoundedRect(-6 * s, -9 * s, 12 * s, 18 * s, 4 * s);
    coin.fillStyle(0xfff2a6, 0.9);
    coin.fillRoundedRect(-4 * s, -6 * s, 8 * s, 12 * s, 3 * s);

    this.add(coin);

    this.glint = this.scene.add.graphics();
    this.glint.lineStyle(2 * s, 0xffffff, 0.85);
    this.glint.strokeLineShape(new Phaser.Geom.Line(-8 * s, 0, 8 * s, 0));
    this.glint.strokeLineShape(new Phaser.Geom.Line(0, -8 * s, 0, 8 * s));
    this.glint.setAlpha(0.8);
    this.add(this.glint);
  }

  playIdleAnimation() {
    const floatY = 5 * (this.scene.scaleFactor || 1);
    this.scene.tweens.add({
      targets: this,
      y: this.y - floatY,
      duration: 750,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    if (this.glint) {
      this.scene.tweens.add({
        targets: this.glint,
        angle: 90,
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }
  }

  update() {
    if (!this.scene || this.isCollected) return;

    const now = this.scene.time?.now || 0;
    const elapsed = now - this.spawnedAt;
    if (elapsed >= this.lifetime) {
      this.fadeAway(false);
      return;
    }

    const fadeStart = this.lifetime * 0.35;
    if (elapsed > fadeStart) {
      const fadeProgress = (elapsed - fadeStart) / (this.lifetime - fadeStart);
      this.setAlpha(Phaser.Math.Clamp(1 - fadeProgress, 0, 1));
    } else {
      this.setAlpha(1);
    }
  }

  collect() {
    if (this.isCollected || !this.scene) return;
    this.isCollected = true;

    this.scene.earnMoney(this.amount);
    this.showPickupEffect();
    this.fadeAway(true);
  }

  showPickupEffect() {
    const s = this.scene.scaleFactor || 1;
    const text = this.scene.add
      .text(this.x, this.y - 12 * s, `+${this.amount} or`, {
        fontSize: `${Math.max(14, 18 * s)}px`,
        fontStyle: "bold",
        color: "#ffe066",
        stroke: "#4a2c0a",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(2000);

    this.scene.tweens.add({
      targets: text,
      y: text.y - 26 * s,
      alpha: 0,
      duration: 500,
      ease: "sine.out",
      onComplete: () => text.destroy(),
    });

    for (let i = 0; i < 6; i++) {
      const sparkle = this.scene.add.circle(this.x, this.y, 3 * s, 0xfff7c0, 0.95);
      sparkle.setDepth(1200);
      this.scene.tweens.add({
        targets: sparkle,
        x: this.x + Phaser.Math.Between(-20, 20) * s,
        y: this.y + Phaser.Math.Between(-20, -40) * s,
        alpha: 0,
        scale: 0,
        duration: 400,
        ease: "sine.out",
        onComplete: () => sparkle.destroy(),
      });
    }
  }

  fadeAway(isCollected) {
    if (!this.scene || this._isFading) return;
    this._isFading = true;

    if (this.glint) {
      this.scene.tweens.killTweensOf(this.glint);
    }
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scale: isCollected ? 1.3 : 0.8,
      duration: 260,
      ease: "sine.in",
      onComplete: () => this.destroyCoin(),
    });
  }

  destroy(fromScene) {
    if (this.glint) {
      this.scene.tweens.killTweensOf(this.glint);
    }
    this.scene?.tweens?.killTweensOf(this);
    super.destroy(fromScene);
  }

  destroyCoin() {
    if (this.scene?.coins?.contains?.(this)) {
      this.scene.coins.remove(this, false, false);
    }
    this.destroy();
  }
}
