import { CONFIG } from "../../config/settings.js";
import { lightning as LIGHTNING_SPELL } from "../../sorts/lightning.js";
import { barrier as BARRIER_SPELL } from "../../sorts/barrier.js";
import { poison as POISON_SPELL } from "../../sorts/poison.js";
import { bear_trap as BEAR_TRAP_SPELL } from "../../sorts/bear_trap.js";
import { sanctuary as SANCTUARY_SPELL } from "../../sorts/sanctuary.js";
import { summon as SUMMON_SPELL } from "../../sorts/summon.js";
import { Barrier } from "../../objects/Barrier.js";
import { Soldier } from "../../objects/Soldier.js";
import {
  updateLightningCooldown,
  updateBarrierAvailable,
  updatePoisonCooldown,
  updateBearTrapAvailable,
  updateSanctuaryCooldown,
  updateSummonCooldown,
} from "../../vue/bridge.js";

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

    // Poison
    this.poisonCooldown = 0;
    this.activePoisonPools = []; // [{ graphics, x, y, radius, expireAt }]
    this.poisonedEnemies = new Map(); // enemy → { expireAt, tickTimer, particles }]

    // Piège à ours : 1 par vague
    this.bearTrapAvailable = true;
    this.activeBearTraps = []; // [{ graphics, x, y, radius, triggered }]

    // Sanctuaire
    this.sanctuaryCooldown = 0;
    this.activeSanctuaries = []; // [{ graphics, boostedTurrets, expireAt }]

    // Invocation
    this.summonCooldown = 0;
    this.summonedSoldiers = []; // soldiers temporaires
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
    // Ne pas détruire les sorts actifs — ils ont été placés par le joueur et doivent persister.
    // On remet juste la disponibilité à true pour que le joueur puisse en poser un nouveau.
    this.barrierAvailable = true;
    updateBarrierAvailable(true);

    this.bearTrapAvailable = true;
    updateBearTrapAvailable(true);
  }

  // ─── POISON ────────────────────────────────────────────────────

  startPlacingPoison() {
    if (this.poisonCooldown > 0 || this.placingSpell) return;
    this.placingSpell = POISON_SPELL;
    this._ensurePreviewGraphics();
    this.scene.input.on("pointermove", this.updateSpellPreview, this);
  }

  _placePoison(worldX, worldY) {
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
    const scaledRadius = POISON_SPELL.poolRadius * this.scene.scaleFactor;

    // Visual: toxic green pool
    const poolGfx = this.scene.add.graphics();
    poolGfx.setDepth(6);
    poolGfx.fillStyle(0x44ff44, 0.35);
    poolGfx.fillCircle(cx, cy, scaledRadius);
    poolGfx.lineStyle(2, 0x00cc00, 0.8);
    poolGfx.strokeCircle(cx, cy, scaledRadius);

    // Bubble particles
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const bx = cx + Math.cos(angle) * scaledRadius * 0.6;
      const by = cy + Math.sin(angle) * scaledRadius * 0.6;
      const bubble = this.scene.add.circle(bx, by, 4 * this.scene.scaleFactor, 0x00ff44, 0.8);
      bubble.setDepth(7);
      this.scene.tweens.add({
        targets: bubble,
        y: by - 12 * this.scene.scaleFactor,
        alpha: 0,
        duration: 1200 + Math.random() * 800,
        repeat: -1,
        repeatDelay: Math.random() * 1000,
        onRepeat: () => { bubble.setPosition(bx, by); bubble.setAlpha(0.8); },
      });

      const expireAt = this.scene.time.now + POISON_SPELL.poolDuration;
      this.scene.time.delayedCall(POISON_SPELL.poolDuration, () => bubble.destroy());
    }

    const poolEntry = {
      graphics: poolGfx,
      x: cx,
      y: cy,
      radius: scaledRadius,
      expireAt: this.scene.time.now + POISON_SPELL.poolDuration,
    };

    this.activePoisonPools.push(poolEntry);

    this.poisonCooldown = POISON_SPELL.cooldown;
    updatePoisonCooldown(this.poisonCooldown, POISON_SPELL.cooldown);

    this.cancelSpellPlacement();
  }

  // Appelé chaque frame : vérifie les ennemis dans la flaque et les empoisonne
  _checkPoisonPools() {
    if (!this.activePoisonPools.length) return;
    const now = this.scene.time.now;

    this.scene.enemies?.getChildren().forEach((enemy) => {
      if (!enemy?.active) return;
      for (const pool of this.activePoisonPools) {
        if (now >= pool.expireAt) continue;
        const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, pool.x, pool.y);
        if (dist <= pool.radius) {
          this._applyPoisonToEnemy(enemy);
          break;
        }
      }
    });
  }

  _applyPoisonToEnemy(enemy) {
    const now = this.scene.time.now;
    const existing = this.poisonedEnemies.get(enemy);

    if (existing) {
      // Prolonger / rafraîchir l'empoisonnement
      existing.expireAt = now + POISON_SPELL.poisonDuration;
      return;
    }

    // Nouveau poison : démarrer le DOT + les particules
    const sc = this.scene.scaleFactor;
    const entry = {
      expireAt: now + POISON_SPELL.poisonDuration,
      particles: [],
      tickTimer: null,
    };

    // Timer de tick de dégâts (toutes les secondes)
    entry.tickTimer = this.scene.time.addEvent({
      delay: POISON_SPELL.tickInterval,
      loop: true,
      callback: () => {
        if (!enemy?.active || this.scene.time.now >= entry.expireAt) {
          this._clearPoisonFromEnemy(enemy);
          return;
        }
        const dmg = Phaser.Math.Between(POISON_SPELL.minTickDamage, POISON_SPELL.maxTickDamage);
        enemy.damage(dmg, { source: "poison" });
      },
    });

    // Particules continues qui suivent l'ennemi (bulles vertes montantes)
    const particleTimer = this.scene.time.addEvent({
      delay: 220,
      loop: true,
      callback: () => {
        if (!enemy?.active || this.scene.time.now >= entry.expireAt) return;
        const ox = (Math.random() - 0.5) * 16 * sc;
        const bubble = this.scene.add.circle(
          enemy.x + ox,
          enemy.y - 4 * sc,
          Phaser.Math.Between(2, 4) * sc,
          0x33ff66,
          0.85
        ).setDepth(55);
        this.scene.tweens.add({
          targets: bubble,
          y: bubble.y - (18 + Math.random() * 14) * sc,
          alpha: 0,
          duration: 700 + Math.random() * 400,
          onComplete: () => bubble.destroy(),
        });

        // Tête de mort occasionnelle
        if (Math.random() < 0.25) {
          const skull = this.scene.add.text(
            enemy.x + (Math.random() - 0.5) * 18 * sc,
            enemy.y - 8 * sc,
            "☠",
            { fontSize: `${Math.round(10 * sc)}px` }
          ).setDepth(56).setAlpha(0.7);
          this.scene.tweens.add({
            targets: skull,
            y: skull.y - 20 * sc,
            alpha: 0,
            duration: 900,
            onComplete: () => skull.destroy(),
          });
        }
      },
    });

    entry.particleTimer = particleTimer;
    this.poisonedEnemies.set(enemy, entry);

    // Teinte verte sur l'ennemi
    if (enemy.setTint) enemy.setTint(0x88ff88);
  }

  _clearPoisonFromEnemy(enemy) {
    const entry = this.poisonedEnemies.get(enemy);
    if (!entry) return;
    entry.tickTimer?.remove();
    entry.particleTimer?.remove();
    if (enemy?.active && enemy.clearTint) enemy.clearTint();
    this.poisonedEnemies.delete(enemy);
  }

  // Nettoyage des ennemis morts ou dont le poison a expiré
  _updatePoisonedEnemies() {
    const now = this.scene.time.now;
    for (const [enemy, entry] of this.poisonedEnemies) {
      if (!enemy?.active || now >= entry.expireAt) {
        this._clearPoisonFromEnemy(enemy);
      }
    }
  }

  // ─── PIÈGE À OURS ──────────────────────────────────────────────

  startPlacingBearTrap() {
    if (!this.bearTrapAvailable || this.placingSpell) return;
    this.placingSpell = BEAR_TRAP_SPELL;
    this._ensurePreviewGraphics();
    this.scene.input.on("pointermove", this.updateSpellPreview, this);
  }

  _placeBearTrap(worldX, worldY) {
    if (!this.bearTrapAvailable) return;

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
    const scaledRadius = BEAR_TRAP_SPELL.trapRadius * this.scene.scaleFactor;

    // Visible to player only (semi-transparent)
    const trapGfx = this.scene.add.graphics();
    trapGfx.setDepth(6);
    trapGfx.fillStyle(0x8B4513, 0.4);
    trapGfx.fillCircle(cx, cy, scaledRadius);
    trapGfx.lineStyle(2, 0xaa6633, 0.7);
    trapGfx.strokeCircle(cx, cy, scaledRadius);
    // Draw X in center
    const s = scaledRadius * 0.5;
    trapGfx.lineStyle(2, 0xcc4400, 0.9);
    trapGfx.lineBetween(cx - s, cy - s, cx + s, cy + s);
    trapGfx.lineBetween(cx + s, cy - s, cx - s, cy + s);

    const trapEntry = {
      graphics: trapGfx,
      x: cx,
      y: cy,
      radius: scaledRadius,
      triggered: false,
    };

    this.activeBearTraps.push(trapEntry);
    this.bearTrapAvailable = false;
    updateBearTrapAvailable(false);

    this.cancelSpellPlacement();
  }

  _checkBearTraps() {
    for (const trap of this.activeBearTraps) {
      if (trap.triggered) continue;

      const enemies = this.scene.enemies?.getChildren() || [];
      for (const enemy of enemies) {
        if (!enemy?.active) continue;
        const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, trap.x, trap.y);
        if (dist <= trap.radius) {
          this._triggerBearTrap(trap, enemy);
          break;
        }
      }
    }
  }

  _triggerBearTrap(trap, enemy) {
    trap.triggered = true;

    // Flash effect
    trap.graphics.clear();
    const trigGfx = this.scene.add.graphics();
    trigGfx.setDepth(20);
    trigGfx.fillStyle(0xff6600, 0.8);
    trigGfx.fillCircle(trap.x, trap.y, trap.radius * 1.5);
    this.scene.tweens.add({
      targets: trigGfx,
      alpha: 0,
      scale: 2,
      duration: 500,
      onComplete: () => {
        trigGfx.destroy();
        trap.graphics.destroy();
      },
    });

    // Paralyze enemy
    if (enemy.paralyze) {
      enemy.paralyze(BEAR_TRAP_SPELL.paralyzeDuration);
    }

    // Bleed DOT
    let bleedCount = 0;
    const bleedTimer = this.scene.time.addEvent({
      delay: BEAR_TRAP_SPELL.bleedInterval,
      callback: () => {
        bleedCount++;
        if (!enemy?.active || bleedCount > BEAR_TRAP_SPELL.bleedTicks) {
          bleedTimer.remove();
          return;
        }
        enemy.damage(BEAR_TRAP_SPELL.bleedDamage, { source: "bleed" });
        // Red blood drop visual
        const drop = this.scene.add.circle(
          enemy.x + (Math.random() - 0.5) * 10,
          enemy.y + (Math.random() - 0.5) * 10,
          4 * this.scene.scaleFactor,
          0xff0000,
          0.9
        );
        drop.setDepth(50);
        this.scene.tweens.add({
          targets: drop,
          y: drop.y + 15,
          alpha: 0,
          duration: 600,
          onComplete: () => drop.destroy(),
        });
      },
      loop: true,
    });
  }

  _clearBearTraps() {
    for (const trap of this.activeBearTraps) {
      if (trap.graphics?.active) trap.graphics.destroy();
    }
    this.activeBearTraps = [];
  }

  // ─── SANCTUAIRE ────────────────────────────────────────────────

  startPlacingSanctuary() {
    if (this.sanctuaryCooldown > 0 || this.placingSpell) return;
    this.placingSpell = SANCTUARY_SPELL;
    this._ensurePreviewGraphics();
    this.scene.input.on("pointermove", this.updateSpellPreview, this);
  }

  _castSanctuary(worldX, worldY) {
    const scaledRadius = SANCTUARY_SPELL.radius * this.scene.scaleFactor;

    // Find turrets in range
    const boostedTurrets = [];
    (this.scene.turrets || []).forEach((turret) => {
      if (!turret?.active) return;
      const dist = Phaser.Math.Distance.Between(worldX, worldY, turret.x, turret.y);
      if (dist <= scaledRadius) {
        boostedTurrets.push({ turret, originalDamage: turret.config.damage });
        turret.config.damage = Math.round(turret.config.damage * (1 + SANCTUARY_SPELL.damageBoost));
      }
    });

    // Visual: golden circle with pulsing aura
    const auraGfx = this.scene.add.graphics();
    auraGfx.setDepth(5);
    auraGfx.fillStyle(0xffd700, 0.15);
    auraGfx.fillCircle(worldX, worldY, scaledRadius);
    auraGfx.lineStyle(3, 0xffd700, 0.9);
    auraGfx.strokeCircle(worldX, worldY, scaledRadius);

    // Sparkle burst
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const sx = worldX + Math.cos(angle) * scaledRadius * 0.8;
      const sy = worldY + Math.sin(angle) * scaledRadius * 0.8;
      const spark = this.scene.add.circle(sx, sy, 5 * this.scene.scaleFactor, 0xffd700, 1);
      spark.setDepth(25);
      this.scene.tweens.add({
        targets: spark,
        x: worldX + Math.cos(angle) * scaledRadius * 1.3,
        y: worldY + Math.sin(angle) * scaledRadius * 1.3,
        alpha: 0,
        scale: 0,
        duration: 800 + Math.random() * 400,
        onComplete: () => spark.destroy(),
      });
    }

    // Gold ring on each boosted turret
    boostedTurrets.forEach(({ turret }) => {
      const ring = this.scene.add.circle(turret.x, turret.y, 24 * this.scene.scaleFactor, 0xffd700, 0);
      ring.setStrokeStyle(3 * this.scene.scaleFactor, 0xffd700, 0.9);
      ring.setDepth(20);
      this.scene.tweens.add({
        targets: ring,
        scale: 1.4,
        alpha: 0,
        duration: SANCTUARY_SPELL.duration,
        onComplete: () => ring.destroy(),
      });
    });

    const expireAt = this.scene.time.now + SANCTUARY_SPELL.duration;
    const entry = { graphics: auraGfx, boostedTurrets, expireAt };
    this.activeSanctuaries.push(entry);

    // Fade out aura at end
    this.scene.tweens.add({
      targets: auraGfx,
      alpha: 0,
      duration: SANCTUARY_SPELL.duration,
      onComplete: () => {
        this._expireSanctuary(entry);
        auraGfx.destroy();
      },
    });

    this.sanctuaryCooldown = SANCTUARY_SPELL.cooldown;
    updateSanctuaryCooldown(this.sanctuaryCooldown, SANCTUARY_SPELL.cooldown);

    this.cancelSpellPlacement();
  }

  _expireSanctuary(entry) {
    for (const { turret, originalDamage } of entry.boostedTurrets) {
      if (turret?.active) {
        turret.config.damage = originalDamage;
      }
    }
    const idx = this.activeSanctuaries.indexOf(entry);
    if (idx !== -1) this.activeSanctuaries.splice(idx, 1);
  }

  // ─── INVOCATION DE SOLDATS ─────────────────────────────────────

  startPlacingSummon() {
    if (this.summonCooldown > 0 || this.placingSpell) return;
    this.placingSpell = SUMMON_SPELL;
    this._ensurePreviewGraphics();
    this.scene.input.on("pointermove", this.updateSpellPreview, this);
  }

  _castSummon(worldX, worldY) {
    const paths = this.scene.paths || [];
    if (!paths.length) return;

    // Trouver le point du chemin le plus proche du clic
    const SAMPLES = 200;
    let closestPath = paths[0];
    let closestT = 0;
    let minDist = Infinity;

    paths.forEach((path) => {
      for (let i = 0; i <= SAMPLES; i++) {
        const t = i / SAMPLES;
        const p = path.getPoint(t);
        const d = Phaser.Math.Distance.Between(p.x, p.y, worldX, worldY);
        if (d < minDist) {
          minDist = d;
          closestPath = path;
          closestT = t;
        }
      }
    });

    // 3 soldats espacés autour du point cliqué
    const spacing = 0.04; // écart en progression de chemin
    const positions = [
      { path: closestPath, t: Math.max(0.01, closestT - spacing) },
      { path: closestPath, t: Phaser.Math.Clamp(closestT, 0.01, 0.99) },
      { path: closestPath, t: Math.min(0.99, closestT + spacing) },
    ].map((p) => {
      const pt = p.path.getPoint(p.t);
      return { x: pt.x, y: pt.y, path: p.path, t: p.t };
    });

    const expireAfter = SUMMON_SPELL.duration;
    const newSoldiers = [];

    positions.forEach((pos) => {
      const fakeFaction = {
        level: 1,
        onSoldierDied: () => {
          const idx = this.summonedSoldiers.indexOf(soldier);
          if (idx !== -1) this.summonedSoldiers.splice(idx, 1);
        },
      };

      const soldier = new Soldier(this.scene, pos.x, pos.y, fakeFaction);
      soldier.maxHp = SUMMON_SPELL.soldierHp;
      soldier.hp = soldier.maxHp;
      soldier.updateHealthBar?.();
      soldier.deployToPath?.(paths);

      // Scale
      const sc = this.scene.unitScale || this.scene.scaleFactor || 1;
      soldier.setScale(0);
      this.scene.tweens.add({
        targets: soldier,
        scale: sc,
        duration: 400,
        ease: "Back.easeOut",
      });

      // Add to scene.soldiers so the enemy blocking logic picks them up
      this.scene.soldiers?.add(soldier);
      newSoldiers.push(soldier);

      // Golden tint to distinguish from barracks soldiers
      const tintCircle = this.scene.add.circle(pos.x, pos.y, 14 * sc, 0xffd700, 0.3);
      tintCircle.setDepth(14);
      this.scene.time.delayedCall(expireAfter, () => tintCircle.destroy());

      // Dissolve after duration
      this.scene.time.delayedCall(expireAfter, () => {
        if (!soldier?.active) return;
        this.scene.tweens.add({
          targets: soldier,
          alpha: 0,
          scale: 0,
          duration: 600,
          onComplete: () => {
            soldier.isAlive = false;
            soldier.destroy();
            this.scene.soldiers?.remove(soldier, true, true);
          },
        });
      });
    });

    this.summonedSoldiers.push(...newSoldiers);

    // Flash effect at each spawn
    positions.forEach((pos) => {
      const flash = this.scene.add.circle(pos.x, pos.y, 30 * this.scene.scaleFactor, 0xffd700, 0.8);
      flash.setDepth(30);
      this.scene.tweens.add({ targets: flash, scale: 2, alpha: 0, duration: 500, onComplete: () => flash.destroy() });
    });

    this.summonCooldown = SUMMON_SPELL.cooldown;
    updateSummonCooldown(this.summonCooldown, SUMMON_SPELL.cooldown);
    this.cancelSpellPlacement();
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
    } else if (this.placingSpell.key === "poison") {
      this._placePoison(x, y);
    } else if (this.placingSpell.key === "bear_trap") {
      this._placeBearTrap(x, y);
    } else if (this.placingSpell.key === "sanctuary") {
      this._castSanctuary(x, y);
    } else if (this.placingSpell.key === "summon") {
      this._castSummon(x, y);
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
    } else if (this.placingSpell.key === "poison") {
      this._updatePoisonPreview(pointer);
    } else if (this.placingSpell.key === "bear_trap") {
      this._updateBearTrapPreview(pointer);
    } else if (this.placingSpell.key === "sanctuary") {
      this._updateSanctuaryPreview(pointer);
    } else if (this.placingSpell.key === "summon") {
      this._updateSummonPreview(pointer);
    }
  }

  _updatePoisonPreview(pointer) {
    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;
    const tx = Math.floor((pointer.worldX - this.scene.mapStartX) / T);
    const ty = Math.floor((pointer.worldY - this.scene.mapStartY) / T);
    this.spellPreview.clear();
    if (tx < 0 || tx >= 15 || ty < 0 || ty >= 15) return;
    const tileType = this.scene.levelConfig?.map?.[ty]?.[tx];
    const cx = this.scene.mapStartX + tx * T + T / 2;
    const cy = this.scene.mapStartY + ty * T + T / 2;
    const r = POISON_SPELL.poolRadius * this.scene.scaleFactor;
    const valid = PATH_TILE_TYPES.has(tileType);
    const color = valid ? 0x44ff44 : 0xff3333;
    this.spellPreview.fillStyle(color, 0.25);
    this.spellPreview.fillCircle(cx, cy, r);
    this.spellPreview.lineStyle(2, color, 0.8);
    this.spellPreview.strokeCircle(cx, cy, r);
  }

  _updateBearTrapPreview(pointer) {
    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;
    const tx = Math.floor((pointer.worldX - this.scene.mapStartX) / T);
    const ty = Math.floor((pointer.worldY - this.scene.mapStartY) / T);
    this.spellPreview.clear();
    if (tx < 0 || tx >= 15 || ty < 0 || ty >= 15) return;
    const tileType = this.scene.levelConfig?.map?.[ty]?.[tx];
    const cx = this.scene.mapStartX + tx * T + T / 2;
    const cy = this.scene.mapStartY + ty * T + T / 2;
    const r = BEAR_TRAP_SPELL.trapRadius * this.scene.scaleFactor;
    const valid = PATH_TILE_TYPES.has(tileType);
    const color = valid ? 0x8B4513 : 0xff3333;
    this.spellPreview.fillStyle(color, 0.35);
    this.spellPreview.fillCircle(cx, cy, r);
    this.spellPreview.lineStyle(2, color, 0.8);
    this.spellPreview.strokeCircle(cx, cy, r);
    if (valid) {
      const s = r * 0.6;
      this.spellPreview.lineStyle(2, 0xcc4400, 0.9);
      this.spellPreview.lineBetween(cx - s, cy - s, cx + s, cy + s);
      this.spellPreview.lineBetween(cx + s, cy - s, cx - s, cy + s);
    }
  }

  _updateSanctuaryPreview(pointer) {
    const x = pointer.worldX;
    const y = pointer.worldY;
    const r = SANCTUARY_SPELL.radius * this.scene.scaleFactor;
    this.spellPreview.clear();
    this.spellPreview.fillStyle(0xffd700, 0.15);
    this.spellPreview.fillCircle(x, y, r);
    this.spellPreview.lineStyle(3, 0xffd700, 0.8);
    this.spellPreview.strokeCircle(x, y, r);
  }

  _updateSummonPreview(pointer) {
    const x = pointer.worldX;
    const y = pointer.worldY;
    const r = 36 * this.scene.scaleFactor;
    this.spellPreview.clear();
    this.spellPreview.fillStyle(0xffd700, 0.2);
    this.spellPreview.fillCircle(x, y, r);
    this.spellPreview.lineStyle(2, 0xffd700, 0.9);
    this.spellPreview.strokeCircle(x, y, r);
    // 3 petits points pour représenter les soldats
    const sc = this.scene.scaleFactor;
    this.spellPreview.fillStyle(0xffd700, 0.9);
    this.spellPreview.fillCircle(x - 12 * sc, y, 5 * sc);
    this.spellPreview.fillCircle(x, y, 5 * sc);
    this.spellPreview.fillCircle(x + 12 * sc, y, 5 * sc);
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
    const blockRadius = T * 0.78;

    this.scene.enemies?.getChildren().forEach((enemy) => {
      if (!enemy.active || enemy.isParalyzed || enemy.isInShell) return;
      if (enemy.isBlocked && enemy.blockedBy === barrier) return;
      if (enemy.isBlocked) return;

      const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, barrier.x, barrier.y);
      if (dist >= blockRadius) return;

      // Vérification de direction : l'ennemi se dirige-t-il VERS la barrière ?
      // Évite de bloquer les ennemis qui passent en sens inverse au croisement.
      if (enemy.path) {
        const ahead = Math.min(1, enemy.progress + 0.015);
        const p1 = enemy.path.getPoint(enemy.progress);
        const p2 = enemy.path.getPoint(ahead);
        if (p1 && p2) {
          const dirX = p2.x - p1.x;
          const dirY = p2.y - p1.y;
          const toBx = barrier.x - enemy.x;
          const toBy = barrier.y - enemy.y;
          // Produit scalaire : négatif = ennemi s'éloigne (déjà passé ou mauvais sens)
          const dot = dirX * toBx + dirY * toBy;
          if (dot < 0) return;
        }
      }

      // Snap-back : si l'ennemi rapide a dépassé d'un chouïa, le replacer juste avant
      if (enemy.path && enemy.progress > barrier.pathProgress + 0.002) {
        enemy.progress = Math.max(0, barrier.pathProgress - 0.002);
        const snapPos = barrier.path.getPoint(enemy.progress);
        if (snapPos) enemy.setPosition(snapPos.x, snapPos.y);
      }

      enemy.isBlocked = true;
      enemy.blockedBy = barrier;
      enemy.isMoving = false;
      barrier.blockedEnemies.add(enemy);
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

    // Poison cooldown
    if (this.poisonCooldown > 0) {
      this.poisonCooldown -= delta;
      if (this.poisonCooldown < 0) this.poisonCooldown = 0;
      updatePoisonCooldown(this.poisonCooldown, POISON_SPELL.cooldown);
    }

    // Sanctuaire cooldown
    if (this.sanctuaryCooldown > 0) {
      this.sanctuaryCooldown -= delta;
      if (this.sanctuaryCooldown < 0) this.sanctuaryCooldown = 0;
      updateSanctuaryCooldown(this.sanctuaryCooldown, SANCTUARY_SPELL.cooldown);
    }

    // Invocation cooldown
    if (this.summonCooldown > 0) {
      this.summonCooldown -= delta;
      if (this.summonCooldown < 0) this.summonCooldown = 0;
      updateSummonCooldown(this.summonCooldown, SUMMON_SPELL.cooldown);
    }

    // Expire poison pools
    const now = time;
    for (let i = this.activePoisonPools.length - 1; i >= 0; i--) {
      const pool = this.activePoisonPools[i];
      if (now >= pool.expireAt) {
        pool.tickTimer?.remove();
        if (pool.graphics?.active) {
          this.scene.tweens.add({
            targets: pool.graphics,
            alpha: 0,
            duration: 500,
            onComplete: () => pool.graphics.destroy(),
          });
        }
        this.activePoisonPools.splice(i, 1);
      }
    }

    // Poison : contact flaque → empoisonnement + nettoyage expirations
    this._checkPoisonPools();
    this._updatePoisonedEnemies();

    // Check bear traps
    this._checkBearTraps();

    this._updateBarrierBlocking();
  }
}
