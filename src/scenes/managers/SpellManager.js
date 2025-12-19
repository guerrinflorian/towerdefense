import { CONFIG } from "../../config/settings.js";
import { lightning as LIGHTNING_SPELL } from "../../sorts/lightning.js";

export class SpellManager {
  constructor(scene) {
    this.scene = scene;
    this.placingSpell = null;
    this.spellPreview = null;
    this.lightningCooldown = 0;
    this.lightningOnCooldown = false;
    this.lightningSpellButton = null;
  }

  attachLightningButton(button) {
    this.lightningSpellButton = button;
    this.updateLightningSpellButton();
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
            enemy.damage(LIGHTNING_SPELL.damage);

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
  }
}
