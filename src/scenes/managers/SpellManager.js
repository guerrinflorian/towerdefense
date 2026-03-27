import { CONFIG } from "../../config/settings.js";
import { lightning as LIGHTNING_SPELL } from "../../sorts/lightning.js";
import { barrier as BARRIER_SPELL } from "../../sorts/barrier.js";
import { Barrier } from "../../objects/Barrier.js";
import { updateLightningCooldown, updateBarrierAvailable } from "../../vue/bridge.js";

// Types de tuiles qui sont des chemins (passage des ennemis)
const PATH_TILE_TYPES = new Set([1, 4, 7, 13, 14, 19, 23]);

export class SpellManager {
  constructor(scene) {
    this.scene = scene;
    this.placingSpell = null;
    this.spellPreview = null;
    this.lightningCooldown = 0;
    this.lightningOnCooldown = false;
    this.lightningSpellButton = null;

    // Barrière : 1 par vague, reset à chaque nouvelle vague
    this.barrierAvailable = true;
    this.activeBarrier = null;
  }

  // ─── LIGHTNING ───────────────────────────────────────────────

  attachLightningButton(button) {
    this.lightningSpellButton = button;
    this.updateLightningSpellButton();
  }

  startPlacingLightning() {
    if (this.lightningCooldown > 0 || this.placingSpell) return;
    this.placingSpell = LIGHTNING_SPELL;
    this._ensurePreviewGraphics();
    this.scene.input.on("pointermove", this.updateSpellPreview, this);
  }

  placeLightning(x, y) {
    if (!this.placingSpell || this.lightningOnCooldown) return;
    this.lightningOnCooldown = true;
    this.lightningCooldown = LIGHTNING_SPELL.cooldown;
    this.castLightning(x, y);
    this.cancelSpellPlacement();
  }

  // ─── BARRIÈRE ─────────────────────────────────────────────────

  startPlacingBarrier() {
    if (!this.barrierAvailable || this.placingSpell) return;
    this.placingSpell = BARRIER_SPELL;
    this._ensurePreviewGraphics();
    this.scene.input.on("pointermove", this.updateSpellPreview, this);
  }

  resetBarrierForNewWave() {
    if (this.activeBarrier?.active) {
      this.activeBarrier.destroyQuiet();
    }
    this.activeBarrier = null;
    this.barrierAvailable = true;
    updateBarrierAvailable(true);
  }

  // ─── PLACEMENT GÉNÉRIQUE ──────────────────────────────────────

  isPlacingSpell() {
    return !!this.placingSpell;
  }

  // Point d'entrée unique appelé par InputManager
  placeCurrentSpell(x, y) {
    if (!this.placingSpell) return;
    if (this.placingSpell.key === "lightning") {
      this.placeLightning(x, y);
    } else if (this.placingSpell.key === "barrier") {
      this._placeBarrier(x, y);
    }
  }

  cancelSpellPlacement() {
    this.placingSpell = null;
    if (this.spellPreview) {
      this.spellPreview.clear();
    }
    this.scene.input.off("pointermove", this.updateSpellPreview, this);
  }

  // ─── PREVIEW ──────────────────────────────────────────────────

  updateSpellPreview(pointer) {
    if (!this.placingSpell || !this.spellPreview) return;

    if (this.placingSpell.key === "lightning") {
      this._updateLightningPreview(pointer);
    } else if (this.placingSpell.key === "barrier") {
      this._updateBarrierPreview(pointer);
    }
  }

  _updateLightningPreview(pointer) {
    const radius = LIGHTNING_SPELL.radius;
    const x = pointer.worldX;
    const y = pointer.worldY;

    this.spellPreview.clear();
    this.spellPreview.lineStyle(3, 0x00ffff, 0.8);
    this.spellPreview.strokeCircle(x, y, radius);
    this.spellPreview.fillStyle(0x00ffff, 0.2);
    this.spellPreview.fillCircle(x, y, radius);
  }

  _updateBarrierPreview(pointer) {
    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;
    const tx = Math.floor((pointer.worldX - this.scene.mapStartX) / T);
    const ty = Math.floor((pointer.worldY - this.scene.mapStartY) / T);

    this.spellPreview.clear();

    if (tx < 0 || tx >= 15 || ty < 0 || ty >= 15) return;

    const map = this.scene.levelConfig?.map;
    if (!map?.[ty]?.[tx] === undefined) return;

    const tileType = map[ty][tx];
    const cx = this.scene.mapStartX + tx * T + T / 2;
    const cy = this.scene.mapStartY + ty * T + T / 2;

    if (!PATH_TILE_TYPES.has(tileType)) {
      // Tuile invalide : cercle rouge
      this.spellPreview.lineStyle(2, 0xff3333, 0.7);
      this.spellPreview.strokeCircle(cx, cy, T * 0.35);
      this.spellPreview.lineStyle(2, 0xff3333, 0.7);
      this.spellPreview.lineBetween(cx - T * 0.25, cy - T * 0.25, cx + T * 0.25, cy + T * 0.25);
      this.spellPreview.lineBetween(cx + T * 0.25, cy - T * 0.25, cx - T * 0.25, cy + T * 0.25);
      return;
    }

    const isVert = this._getBarrierIsVertical(tx, ty);
    const thick = 12 * this.scene.scaleFactor;
    const len = T * 0.88;
    const w = isVert ? thick : len;
    const h = isVert ? len : thick;

    // Preview dorée semi-transparente
    this.spellPreview.fillStyle(0xffd700, 0.45);
    this.spellPreview.fillRect(cx - w / 2, cy - h / 2, w, h);
    this.spellPreview.lineStyle(2, 0xffd700, 0.9);
    this.spellPreview.strokeRect(cx - w / 2, cy - h / 2, w, h);
  }

  // ─── PLACEMENT BARRIÈRE ────────────────────────────────────────

  _placeBarrier(worldX, worldY) {
    if (!this.barrierAvailable) return;

    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;
    const tx = Math.floor((worldX - this.scene.mapStartX) / T);
    const ty = Math.floor((worldY - this.scene.mapStartY) / T);

    if (tx < 0 || tx >= 15 || ty < 0 || ty >= 15) {
      this.cancelSpellPlacement();
      return;
    }

    const tileType = this.scene.levelConfig?.map?.[ty]?.[tx];
    if (!PATH_TILE_TYPES.has(tileType)) {
      this.cancelSpellPlacement();
      return;
    }

    const cx = this.scene.mapStartX + tx * T + T / 2;
    const cy = this.scene.mapStartY + ty * T + T / 2;
    const isVert = this._getBarrierIsVertical(tx, ty);

    const { path, pathProgress } = this._findPathAndProgress(cx, cy);

    // Détruire l'éventuelle barrière précédente sans explosion
    if (this.activeBarrier?.active) {
      this.activeBarrier.destroyQuiet();
    }

    this.activeBarrier = new Barrier(this.scene, cx, cy, path, pathProgress, isVert);
    this.barrierAvailable = false;
    updateBarrierAvailable(false);

    this.cancelSpellPlacement();
  }

  // Détermine si la barrière doit être verticale (│) ou horizontale (─)
  _getBarrierIsVertical(tileX, tileY) {
    const rawPaths = this.scene.levelConfig?.paths || [];
    for (const points of rawPaths) {
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const minX = Math.min(p1.x, p2.x);
        const maxX = Math.max(p1.x, p2.x);
        const minY = Math.min(p1.y, p2.y);
        const maxY = Math.max(p1.y, p2.y);

        if (tileX >= minX && tileX <= maxX && tileY >= minY && tileY <= maxY) {
          // Segment horizontal → barrière verticale (perpendiculaire)
          if (p1.y === p2.y) return true;
          // Segment vertical → barrière horizontale
          if (p1.x === p2.x) return false;
        }
      }
    }
    return false;
  }

  // Trouve le chemin Phaser le plus proche et la progression (0–1) sur ce chemin
  _findPathAndProgress(worldX, worldY) {
    let closestPath = this.scene.paths[0];
    let closestProgress = 0;
    let minDist = Infinity;
    const SAMPLES = 200;

    (this.scene.paths || []).forEach((path) => {
      for (let i = 0; i <= SAMPLES; i++) {
        const t = i / SAMPLES;
        const p = path.getPoint(t);
        const d = Phaser.Math.Distance.Between(p.x, p.y, worldX, worldY);
        if (d < minDist) {
          minDist = d;
          closestPath = path;
          closestProgress = t;
        }
      }
    });

    return { path: closestPath, pathProgress: closestProgress };
  }

  // ─── BLOCAGE ENNEMIS ──────────────────────────────────────────

  _updateBarrierBlocking() {
    if (!this.activeBarrier?.active) return;

    const barrier = this.activeBarrier;
    const T = CONFIG.TILE_SIZE * (this.scene.scaleFactor || 1);
    const blockRadius = T * 0.58;

    this.scene.enemies?.getChildren().forEach((enemy) => {
      if (!enemy.active || enemy.isParalyzed || enemy.isInShell) return;
      if (enemy.path !== barrier.path) return;

      // Déjà bloqué par cette barrière
      if (enemy.isBlocked && enemy.blockedBy === barrier) return;

      // Bloqué par autre chose (soldat, etc.)
      if (enemy.isBlocked) return;

      const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, barrier.x, barrier.y);
      const isApproaching = enemy.progress <= barrier.pathProgress + 0.008;

      if (dist < blockRadius && isApproaching) {
        enemy.isBlocked = true;
        enemy.blockedBy = barrier;
        enemy.isMoving = false;
        barrier.blockedEnemies.add(enemy);
      }
    });
  }

  // ─── VISUELS BOUTON LIGHTNING (PHASER TOOLBAR) ───────────────

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

  // ─── CAST LIGHTNING ───────────────────────────────────────────

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

    const flash = this.scene.add.circle(x, y, effectRadius * 1.5, 0xffffff, 1);
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

  // ─── UPDATE ───────────────────────────────────────────────────

  _ensurePreviewGraphics() {
    if (!this.spellPreview) {
      this.spellPreview = this.scene.add.graphics();
      this.spellPreview.setDepth(200);
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
      updateLightningCooldown(this.lightningCooldown, LIGHTNING_SPELL.cooldown);
    } else if (this.lightningOnCooldown) {
      this.lightningOnCooldown = false;
      this.updateLightningSpellButton();
      updateLightningCooldown(0, LIGHTNING_SPELL.cooldown);
    }

    this._updateBarrierBlocking();
  }
}
