import { CONFIG } from "../../config/settings.js";
import { LEVELS_CONFIG } from "../../config/levels/index.js";
import { airstrike as AIRSTRIKE_SPELL } from "../../sorts/airstrike.js";
import { lightning as LIGHTNING_SPELL } from "../../sorts/lightning.js";

export class SpellManager {
  constructor(scene) {
    this.scene = scene;
    this.placingSpell = null;
    this.spellPreview = null;
    this.lightningCooldown = 0;
    this.lightningOnCooldown = false;
    this.lightningSpellButton = null;
    this.airstrikeCooldown = 0;
    this.airstrikeOnCooldown = false;
    this.airstrikeSpellButton = null;
    this.airstrikeInProgress = false;
  }

  attachLightningButton(button) {
    this.lightningSpellButton = button;
    this.updateLightningSpellButton();
  }

  attachAirstrikeButton(button) {
    this.airstrikeSpellButton = button;
    this.updateAirstrikeSpellButton();
  }

  startPlacingLightning() {
    if (this.lightningCooldown > 0 || this.placingSpell) return;
    this.placingSpell = LIGHTNING_SPELL;

    if (!this.spellPreview) {
      this.spellPreview = this.scene.add.graphics();
      this.spellPreview.setDepth(200);
    }

    this.scene.input.on("pointermove", this.updateSpellPreview, this);
  }

  isPlacingSpell() {
    return !!this.placingSpell;
  }

  updateSpellPreview(pointer) {
    if (!this.placingSpell || !this.spellPreview) return;

    const radius = LIGHTNING_SPELL.radius;
    const x = pointer.worldX;
    const y = pointer.worldY;

    this.spellPreview.clear();
    this.spellPreview.lineStyle(3, 0x00ffff, 0.8);
    this.spellPreview.strokeCircle(x, y, radius);
    this.spellPreview.fillStyle(0x00ffff, 0.2);
    this.spellPreview.fillCircle(x, y, radius);
  }

  placeLightning(x, y) {
    if (!this.placingSpell || this.lightningOnCooldown) return;

    this.lightningOnCooldown = true;
    this.lightningCooldown = LIGHTNING_SPELL.cooldown;

    this.castLightning(x, y);

    this.cancelSpellPlacement();
  }

  startAirstrike() {
    if (this.airstrikeCooldown > 0 || this.airstrikeInProgress) return;
    if (!this.isChapterTwoOrLater()) return;
    this.airstrikeOnCooldown = true;
    this.airstrikeCooldown = AIRSTRIKE_SPELL.cooldown;
    this.airstrikeInProgress = true;
    this.castAirstrike();
    this.updateAirstrikeSpellButton();
  }

  cancelSpellPlacement() {
    this.placingSpell = null;
    if (this.spellPreview) {
      this.spellPreview.clear();
    }
    this.scene.input.off("pointermove", this.updateSpellPreview, this);
  }

  castLightning(x, y) {
    const effectRadius = LIGHTNING_SPELL.radius;

    const lightningBolt = this.scene.add.graphics();
    lightningBolt.setDepth(300);

    const startY = this.scene.mapStartY - 50;

    lightningBolt.lineStyle(10, 0xffffff, 1);
    lightningBolt.beginPath();
    lightningBolt.moveTo(x, startY);

    const steps = 8;
    const stepHeight = (y - startY) / steps;
    const offsets = [-8, 12, -10, 15, -12, 10, -8, 5];
    for (let i = 1; i <= steps; i++) {
      const currentY = startY + stepHeight * i;
      const offsetX = offsets[i - 1] || 0;
      lightningBolt.lineTo(x + offsetX, currentY);
    }
    lightningBolt.lineTo(x, y);
    lightningBolt.strokePath();

    lightningBolt.lineStyle(4, 0x00ffff, 1);
    lightningBolt.beginPath();
    lightningBolt.moveTo(x, startY);
    const offsets2 = [-6, 9, -7, 11, -9, 7, -6, 3];
    for (let i = 1; i <= steps; i++) {
      const currentY = startY + stepHeight * i;
      const offsetX = offsets2[i - 1] || 0;
      lightningBolt.lineTo(x + offsetX, currentY);
    }
    lightningBolt.lineTo(x, y);
    lightningBolt.strokePath();

    const branchOffsets = [
      { x: -25, y: 0.3 },
      { x: 30, y: 0.5 },
      { x: -20, y: 0.7 },
      { x: 28, y: 0.4 },
      { x: -22, y: 0.6 },
    ];
    branchOffsets.forEach((branch) => {
      const offsetY = startY + (y - startY) * branch.y;
      lightningBolt.lineStyle(3, 0xffffff, 0.8);
      lightningBolt.lineBetween(x, offsetY, x + branch.x, offsetY);
    });

    const flash = this.scene.add.circle(
      x,
      y,
      effectRadius * 1.5,
      0xffffff,
      1
    );
    flash.setDepth(301);

    this.scene.tweens.add({
      targets: flash,
      scale: 0,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        flash.destroy();
        lightningBolt.destroy();
      },
    });

    const burnZone = this.scene.add.graphics();
    burnZone.setDepth(5);
    burnZone.fillStyle(0x000000, 0.6);
    burnZone.fillCircle(x, y, effectRadius);
    burnZone.lineStyle(2, 0x8b4513, 1);
    burnZone.strokeCircle(x, y, effectRadius);

    this.scene.tweens.add({
      targets: burnZone,
      alpha: 0,
      duration: 5000,
      onComplete: () => burnZone.destroy(),
    });

    if (this.scene.enemies) {
      this.scene.enemies.children.each((enemy) => {
        if (enemy && enemy.active) {
          const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
          if (dist <= effectRadius) {
            enemy.damage(LIGHTNING_SPELL.damage, { source: "spell" });

            if (enemy.hp > 0 && enemy.paralyze) {
              enemy.paralyze(LIGHTNING_SPELL.paralysisDuration);
            }
          }
        }
      });
    }

    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * effectRadius;
      const px = x + Math.cos(angle) * dist;
      const py = y + Math.sin(angle) * dist;

      const particle = this.scene.add.circle(px, py, 3, 0xffff00, 1);
      particle.setDepth(302);

      this.scene.tweens.add({
        targets: particle,
        x: px + (Math.random() - 0.5) * 50,
        y: py + (Math.random() - 0.5) * 50,
        alpha: 0,
        scale: 0,
        duration: 1000 + Math.random() * 500,
        onComplete: () => particle.destroy(),
      });
    }
  }

  castAirstrike() {
    const targets = this.getAirstrikeTargets();
    if (!targets.length) {
      this.airstrikeInProgress = false;
      return;
    }

    const plane = this.createAirstrikePlane();
    plane.setDepth(320);

    const flightAltitude = CONFIG.TILE_SIZE * this.scene.scaleFactor * 0.9;
    plane.setPosition(targets[0].x, this.scene.mapStartY - flightAltitude);

    const flyToTarget = (index) => {
      if (!this.scene || !plane.active) {
        this.airstrikeInProgress = false;
        return;
      }
      if (index >= targets.length) {
        this.scene.tweens.add({
          targets: plane,
          y: this.scene.mapStartY - flightAltitude * 1.4,
          alpha: 0,
          duration: 300,
          onComplete: () => {
            plane.destroy();
            this.airstrikeInProgress = false;
          },
        });
        return;
      }

      const target = targets[index];
      const destX = target.x;
      const destY = target.y - flightAltitude;
      const distance = Phaser.Math.Distance.Between(
        plane.x,
        plane.y,
        destX,
        destY
      );
      const duration = Phaser.Math.Clamp(distance * 2.2, 80, 220);

      this.scene.tweens.add({
        targets: plane,
        x: destX,
        y: destY,
        duration,
        ease: "Sine.easeInOut",
        onComplete: () => {
          this.dropAirstrikeBomb(plane.x, plane.y, target.x, target.y);
          this.scene.time.delayedCall(60, () => flyToTarget(index + 1));
        },
      });
    };

    flyToTarget(0);
  }

  dropAirstrikeBomb(startX, startY, targetX, targetY) {
    const bomb = this.scene.add.graphics();
    bomb.setDepth(310);
    bomb.fillStyle(0x222222, 1);
    bomb.fillCircle(0, 0, 6 * this.scene.scaleFactor);
    bomb.lineStyle(2, 0xffffff, 0.8);
    bomb.strokeCircle(0, 0, 6 * this.scene.scaleFactor);
    bomb.setPosition(startX, startY);

    this.scene.tweens.add({
      targets: bomb,
      x: targetX,
      y: targetY,
      duration: 220,
      ease: "Quad.easeIn",
      onComplete: () => {
        bomb.destroy();
        this.createAirstrikeExplosion(targetX, targetY);
      },
    });
  }

  createAirstrikeExplosion(x, y) {
    const radius = this.getAirstrikeRadius();
    const flash = this.scene.add.circle(x, y, radius * 0.7, 0xffaa00, 0.9);
    flash.setDepth(305);

    const ring = this.scene.add.graphics();
    ring.setDepth(304);
    ring.lineStyle(4, 0xffdd55, 0.9);
    ring.strokeCircle(x, y, radius * 0.3);

    this.scene.tweens.add({
      targets: flash,
      scale: 1.3,
      alpha: 0,
      duration: 250,
      onComplete: () => flash.destroy(),
    });

    this.scene.tweens.add({
      targets: ring,
      alpha: 0,
      scale: 2,
      duration: 400,
      onComplete: () => ring.destroy(),
    });

    const scorch = this.scene.add.graphics();
    scorch.setDepth(3);
    scorch.fillStyle(0x3b1f00, 0.5);
    scorch.fillCircle(x, y, radius * 0.6);
    scorch.lineStyle(2, 0x1a0c00, 0.6);
    scorch.strokeCircle(x, y, radius * 0.6);
    this.scene.tweens.add({
      targets: scorch,
      alpha: 0,
      duration: 2500,
      onComplete: () => scorch.destroy(),
    });

    if (this.scene.enemies) {
      this.scene.enemies.children.each((enemy) => {
        if (enemy && enemy.active) {
          const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
          if (dist <= radius) {
            enemy.damage(AIRSTRIKE_SPELL.damage, { source: "spell" });
          }
        }
      });
    }
  }

  createAirstrikePlane() {
    const plane = this.scene.add.container(0, 0);
    const g = this.scene.add.graphics();
    const scale = this.scene.scaleFactor;

    g.fillStyle(0x2b2f3a, 1);
    g.fillRoundedRect(-28 * scale, -6 * scale, 56 * scale, 12 * scale, 6);
    g.fillStyle(0x4d5566, 1);
    g.fillRoundedRect(-10 * scale, -14 * scale, 20 * scale, 28 * scale, 8);
    g.fillStyle(0x1f232c, 1);
    g.fillRoundedRect(-18 * scale, -3 * scale, 36 * scale, 6 * scale, 3);
    g.fillStyle(0x7b8aa3, 1);
    g.fillTriangle(
      -28 * scale,
      -6 * scale,
      -42 * scale,
      -16 * scale,
      -26 * scale,
      -2 * scale
    );
    g.fillTriangle(
      28 * scale,
      -6 * scale,
      42 * scale,
      -16 * scale,
      26 * scale,
      -2 * scale
    );
    g.fillStyle(0x556177, 1);
    g.fillTriangle(
      -6 * scale,
      6 * scale,
      0,
      16 * scale,
      6 * scale,
      6 * scale
    );

    plane.add(g);
    return plane;
  }

  getAirstrikeTargets() {
    const map = this.scene.levelConfig?.map || [];
    const pathTypes = new Set([1, 4, 7, 13, 14, 19, 21, 23]);
    const targets = [];
    const seen = new Set();
    const tileSize = CONFIG.TILE_SIZE * this.scene.scaleFactor;
    const half = tileSize / 2;

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (pathTypes.has(map[y][x])) {
          const key = `${x},${y}`;
          if (!seen.has(key)) {
            seen.add(key);
            targets.push({
              x: this.scene.mapStartX + x * tileSize + half,
              y: this.scene.mapStartY + y * tileSize + half,
              tileX: x,
              tileY: y,
            });
          }
        }
      }
    }

    targets.sort((a, b) => (a.tileY - b.tileY) || (a.tileX - b.tileX));
    return targets;
  }

  getAirstrikeRadius() {
    return CONFIG.TILE_SIZE * this.scene.scaleFactor * AIRSTRIKE_SPELL.radiusFactor;
  }

  isChapterTwoOrLater() {
    if (!this.scene?.levelID) return false;
    const level = LEVELS_CONFIG.find(
      (lvl) => lvl.id === Number(this.scene.levelID)
    );
    return (level?.chapterId || 1) >= 2;
  }

  updateLightningSpellButton() {
    if (!this.lightningSpellButton) return;

    const { bg, icon, cooldownMask, cooldownText } = this.lightningSpellButton;
    const cooldownPercent = this.lightningCooldown / LIGHTNING_SPELL.cooldown;
    const remainingSeconds = Math.ceil(this.lightningCooldown / 1000);

    if (this.lightningCooldown > 0) {
      cooldownMask.setVisible(true);
      cooldownMask.clear();

      const itemSize = 80 * this.scene.scaleFactor;
      const radius = itemSize / 2;

      cooldownMask.clear();
      cooldownMask.fillStyle(0x000000, 0.7);

      if (cooldownPercent > 0) {
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + cooldownPercent * Math.PI * 2;

        cooldownMask.beginPath();
        cooldownMask.moveTo(0, 0);
        cooldownMask.arc(0, 0, radius, startAngle, endAngle, false);
        cooldownMask.closePath();
        cooldownMask.fillPath();
      }

      cooldownText.setText(`${remainingSeconds}s`);
      cooldownText.setVisible(true);

      bg.setFillStyle(0x1a1a1a, 0.6);
      bg.setStrokeStyle(3, 0x444444);
      icon.setAlpha(0.5);
      bg.disableInteractive();
    } else {
      cooldownMask.setVisible(false);
      cooldownText.setVisible(false);
      bg.setFillStyle(0x333333, 0.9);
      bg.setStrokeStyle(3, 0x666666);
      icon.setAlpha(1);
      bg.setInteractive({ useHandCursor: true });
    }
  }

  drawLightningIcon(graphics, x, y, size) {
    graphics.clear();
    graphics.fillStyle(0xffff00, 1);

    graphics.beginPath();
    graphics.moveTo(x, y - size / 2);
    graphics.lineTo(x - size / 4, y - size / 6);
    graphics.lineTo(x, y);
    graphics.lineTo(x + size / 4, y + size / 6);
    graphics.lineTo(x, y + size / 2);
    graphics.lineTo(x - size / 6, y + size / 4);
    graphics.lineTo(x, y);
    graphics.lineTo(x + size / 6, y - size / 4);
    graphics.closePath();
    graphics.fillPath();

    graphics.lineStyle(2, 0xffffff, 1);
    graphics.strokePath();
  }

  drawAirstrikeIcon(graphics, x, y, size) {
    graphics.clear();
    graphics.fillStyle(0x4d5566, 1);
    graphics.fillRoundedRect(
      x - size * 0.35,
      y - size * 0.12,
      size * 0.7,
      size * 0.24,
      size * 0.12
    );
    graphics.fillStyle(0x2b2f3a, 1);
    graphics.fillRoundedRect(
      x - size * 0.12,
      y - size * 0.32,
      size * 0.24,
      size * 0.64,
      size * 0.16
    );
    graphics.fillStyle(0x7b8aa3, 1);
    graphics.fillTriangle(
      x - size * 0.35,
      y - size * 0.12,
      x - size * 0.55,
      y - size * 0.3,
      x - size * 0.32,
      y
    );
    graphics.fillTriangle(
      x + size * 0.35,
      y - size * 0.12,
      x + size * 0.55,
      y - size * 0.3,
      x + size * 0.32,
      y
    );
    graphics.lineStyle(2, 0xffffff, 0.8);
    graphics.strokeRoundedRect(
      x - size * 0.35,
      y - size * 0.12,
      size * 0.7,
      size * 0.24,
      size * 0.12
    );
  }

  updateAirstrikeSpellButton() {
    if (!this.airstrikeSpellButton) return;
    const { bg, icon, cooldownMask, cooldownText } = this.airstrikeSpellButton;
    const cooldownPercent =
      this.airstrikeCooldown / AIRSTRIKE_SPELL.cooldown;
    const remainingSeconds = Math.ceil(this.airstrikeCooldown / 1000);
    const isAvailable = this.isChapterTwoOrLater();

    if (!isAvailable) {
      cooldownMask.setVisible(false);
      cooldownText.setVisible(false);
      bg.setFillStyle(0x1a1a1a, 0.5);
      bg.setStrokeStyle(3, 0x333333);
      icon.setAlpha(0.35);
      bg.disableInteractive();
      return;
    }

    if (this.airstrikeCooldown > 0) {
      cooldownMask.setVisible(true);
      cooldownMask.clear();

      const itemSize = 80 * this.scene.scaleFactor;
      const radius = itemSize / 2;

      cooldownMask.fillStyle(0x000000, 0.7);

      if (cooldownPercent > 0) {
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + cooldownPercent * Math.PI * 2;

        cooldownMask.beginPath();
        cooldownMask.moveTo(0, 0);
        cooldownMask.arc(0, 0, radius, startAngle, endAngle, false);
        cooldownMask.closePath();
        cooldownMask.fillPath();
      }

      cooldownText.setText(`${remainingSeconds}s`);
      cooldownText.setVisible(true);

      bg.setFillStyle(0x1a1a1a, 0.6);
      bg.setStrokeStyle(3, 0x444444);
      icon.setAlpha(0.5);
      bg.disableInteractive();
    } else {
      cooldownMask.setVisible(false);
      cooldownText.setVisible(false);
      bg.setFillStyle(0x333333, 0.9);
      bg.setStrokeStyle(3, 0x666666);
      icon.setAlpha(1);
      bg.setInteractive({ useHandCursor: true });
    }
  }

  update(time, delta) {
    if (this.lightningCooldown > 0) {
      this.lightningCooldown -= delta;
      if (this.lightningCooldown <= 0) {
        this.lightningCooldown = 0;
        this.lightningOnCooldown = false;
      }
      this.updateLightningSpellButton();
    } else if (this.lightningOnCooldown) {
      this.lightningOnCooldown = false;
      this.updateLightningSpellButton();
    }

    if (this.airstrikeCooldown > 0) {
      this.airstrikeCooldown -= delta;
      if (this.airstrikeCooldown <= 0) {
        this.airstrikeCooldown = 0;
        this.airstrikeOnCooldown = false;
      }
      this.updateAirstrikeSpellButton();
    } else if (this.airstrikeOnCooldown) {
      this.airstrikeOnCooldown = false;
      this.updateAirstrikeSpellButton();
    }
  }
}
