import { CONFIG, ENEMIES } from "../../config/settings.js";

export class SpawnWaveControls {
  constructor(scene) {
    this.scene = scene;
    this.icons = [];
    this.tooltip = null;
    this.isLocked = false;

    // Timer de refresh UI (important pour suivre canCallNextWave en temps réel)
    this._stateTick = null;

    // Cache simple pour éviter de recalculer 1000 fois / sec
    this._lastIsRunning = null;
    this._lastCanChain = null;
    this._lastIsLocked = null;
    this._lastBonus = null;
  }

  create() {
    this.destroy();

    const spawnTiles = this.getSpawnTiles();
    spawnTiles.forEach((spawn, index) => {
      this.icons.push(this.createIcon(spawn, index + 1));
    });

    // Refresh immédiat
    this.updateWaveRunningState(true);

    // ✅ IMPORTANT : refresh régulier pour capter le moment où canCallNextWave devient true
    this._stateTick = this.scene.time.addEvent({
      delay: 120,
      loop: true,
      callback: () => this.updateWaveRunningState(false),
    });
  }

  destroy() {
    this.hideWavePreview();

    if (this._stateTick) {
      this._stateTick.remove(false);
      this._stateTick = null;
    }

    this.icons.forEach((icon) => icon.container.destroy());
    this.icons = [];

    this._lastIsRunning = null;
    this._lastCanChain = null;
    this._lastIsLocked = null;
    this._lastBonus = null;
  }

  // -------------------------
  // Spawn points
  // -------------------------
  getSpawnTiles() {
    const paths =
      this.scene.levelConfig?.paths ||
      (this.scene.levelConfig?.path ? [this.scene.levelConfig.path] : []);

    const unique = new Map();

    paths.forEach((points) => {
      if (!points?.length) return;
      const start = points[0];
      const key = `${start.x},${start.y}`;

      if (!unique.has(key)) {
        const next = points[1] || start;
        const angle = Math.atan2(next.y - start.y, next.x - start.x);
        unique.set(key, { tileX: start.x, tileY: start.y, angle });
      }
    });

    return Array.from(unique.values());
  }

  // -------------------------
  // UI Icon
  // -------------------------
  createIcon(spawn, index) {
    const s = this.scene.scaleFactor || 1;
    const T = CONFIG.TILE_SIZE * s;

    const px = this.scene.mapStartX + spawn.tileX * T + T / 2;
    const py = this.scene.mapStartY + spawn.tileY * T + T / 2;

    const size = Math.max(26 * s, T * 0.28);

    const container = this.scene.add.container(px, py).setDepth(2000);

    // Fond
    const bg = this.scene.add.circle(0, 0, size, 0x0b0b12, 0.9);
    bg.setStrokeStyle(2 * s, 0x00ffc2, 1);

    // Flèche
    const arrow = this.scene.add.graphics();
    this.drawArrow(arrow, 0x00ffc2, size * 0.55);
    arrow.setRotation(spawn.angle);

    // Badge
    const badge = this.scene.add.container(-size * 0.75, -size * 0.75);
    const badgeBg = this.scene.add.circle(0, 0, size * 0.35, 0x00ffc2);
    const badgeText = this.scene.add
      .text(0, 0, index, {
        fontSize: `${11 * s}px`,
        color: "#000",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    badge.add([badgeBg, badgeText]);

    // Texte principal
    const countdownText = this.scene.add
      .text(0, size + 12 * s, "", {
        fontSize: `${13 * s}px`,
        color: "#00ffc2",
        fontStyle: "bold",
        stroke: "#000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // ✅ BONUS (petit)
    const bonusText = this.scene.add
      .text(0, size + 28 * s, "", {
        fontSize: `${10 * s}px`,
        color: "#ffffff",
        fontStyle: "bold",
        stroke: "#000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);
    bonusText.setAlpha(0);

    container.add([bg, arrow, badge, countdownText, bonusText]);

    // Hit area
    const hitSize = size * 2.2;
    container.setSize(hitSize, hitSize);
    container.setInteractive();
    if (container.input) container.input.cursor = "pointer";
    container.bringToTop();

    // EVENTS
    container.on("pointerover", () => {
      if (this.isLocked) return;
      if (this.scene.isWaveRunning && !this.scene.canCallNextWave) return;

      container.setScale(1.1);
      this.drawArrow(arrow, 0xffffff, size * 0.6);
      this.showWavePreview(container);
    });

    container.on("pointerout", () => {
      container.setScale(1.0);
      this.drawArrow(arrow, 0x00ffc2, size * 0.55);
      this.hideWavePreview();
    });

    container.on("pointerdown", () => {
      if (this.isLocked) return;

      this.scene.startWave();
      this.hideWavePreview();

      container.setScale(0.9);
      this.scene.time.delayedCall(100, () => container.setScale(1.0));
    });

    return { container, bg, arrow, countdownText, bonusText, size };
  }

  drawArrow(graphics, color, sz) {
    graphics.clear();
    graphics.fillStyle(color, 1);
    const points = [
      { x: -sz * 0.4, y: -sz * 0.5 },
      { x: -sz * 0.4, y: sz * 0.5 },
      { x: sz * 0.6, y: 0 },
    ];
    graphics.fillPoints(points, true);
  }

  // -------------------------
  // Bonus coins anticipation
  // -------------------------
  getAnticipationBonusCoins() {
    // Utiliser la méthode de GameScene qui calcule le bonus
    if (this.scene.getAnticipationBonusCoins) {
      const v = this.scene.getAnticipationBonusCoins();
      if (Number.isFinite(v) && v > 0) return v;
    }
    // Fallback si la méthode n'existe pas
    try {
      if (this.scene.waveManager?.getAnticipationBonusCoins) {
        const v = this.scene.waveManager.getAnticipationBonusCoins();
        return Number.isFinite(v) ? v : 0;
      }
      if (this.scene.waveManager?.getNextWaveAnticipationReward) {
        const v = this.scene.waveManager.getNextWaveAnticipationReward();
        return Number.isFinite(v) ? v : 0;
      }
      if (this.scene.currencyManager?.getAnticipationBonusCoins) {
        const v = this.scene.currencyManager.getAnticipationBonusCoins();
        return Number.isFinite(v) ? v : 0;
      }

      // 2) Variables “directes” (très courant dans les TD)
      // adapte si tu as un nom exact : pendingReward, anticipationReward, etc.
      const direct =
        this.scene.waveManager?.anticipationBonusCoins ??
        this.scene.waveManager?.anticipationRewardCoins ??
        this.scene.anticipationBonusCoins ??
        this.scene.anticipationRewardCoins;

      if (Number.isFinite(direct)) return direct;

      // 3) Fallback config (si tu veux au moins afficher qqch)
      const cfg = CONFIG?.ANTICIPATION_BONUS_COINS;
      if (Number.isFinite(cfg)) return cfg;
    } catch (e) {
      // fail-safe
    }
    return 0;
  }

  setBonusVisible(icon, visible) {
    if (!icon?.bonusText) return;

    if (!visible) {
      icon.bonusText.setText("");
      icon.bonusText.setAlpha(0);
      return;
    }

    const bonus = this.getAnticipationBonusCoins();

    // ✅ Affiche toujours quand c’est visible (même si 0) => tu vois que c’est déclenché
    // N'afficher le bonus que s'il est supérieur à 0
    if (bonus > 0) {
      icon.bonusText.setText(`+${bonus} pièces`);
      icon.bonusText.setAlpha(1);
    } else {
      icon.bonusText.setText("");
      icon.bonusText.setAlpha(0);
    }
  }

  // -------------------------
  // Tooltip preview
  // -------------------------
  showWavePreview(anchor) {
    this.hideWavePreview();
    const summary = this.scene.waveManager?.getNextWaveSummary?.();
    if (!summary || summary.length === 0) return;

    const s = this.scene.scaleFactor || 1;
    const rowHeight = 55 * s;
    const width = 180 * s;
    const height = summary.length * rowHeight + 15 * s;

    let iconWorldX, iconWorldY;
    if (anchor.getWorldTransformMatrix) {
      const matrix = anchor.getWorldTransformMatrix();
      iconWorldX = matrix.tx;
      iconWorldY = matrix.ty;
    } else {
      iconWorldX = anchor.x;
      iconWorldY = anchor.y;
    }

    let targetY = iconWorldY - height / 2 - 50 * s;
    const minY = height / 2 + 10 * s;
    if (targetY < minY) targetY = iconWorldY + height / 2 + 50 * s;

    const maxY =
      (this.scene.gameHeight || this.scene.cameras.main.height) -
      height / 2 -
      10 * s;
    if (targetY > maxY) targetY = maxY;

    const targetX = Phaser.Math.Clamp(
      iconWorldX,
      width / 2 + 10 * s,
      (this.scene.gameWidth || this.scene.cameras.main.width) - width / 2 - 10 * s
    );

    this.tooltip = this.scene.add.container(targetX, targetY).setDepth(3000);

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x0c0c15, 0.95);
    bg.lineStyle(2 * s, 0x00ffc2, 1);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, 10);
    bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 10);
    this.tooltip.add(bg);

    summary.forEach((item, idx) => {
      const y = -height / 2 + idx * rowHeight + rowHeight / 2;

      const preview = this.createEnemyPreview(item.type);
      preview.setPosition(-width / 2 + 35 * s, y);

      const txt = this.scene.add
        .text(-width / 2 + 75 * s, y, `x${item.count}`, {
          fontSize: `${20 * s}px`,
          color: "#ffffff",
          fontStyle: "bold",
        })
        .setOrigin(0, 0.5);

      this.tooltip.add([preview, txt]);
    });
  }

  createEnemyPreview(typeKey) {
    const container = this.scene.add.container(0, 0);
    const s = this.scene.scaleFactor || 1;
    const enemyDef = ENEMIES[typeKey];

    const circle = this.scene.add
      .circle(0, 0, 22 * s, 0x1a1a2e)
      .setStrokeStyle(1, 0x00ffc2, 0.5);
    container.add(circle);

    if (enemyDef?.onDraw) {
      const iconG = this.scene.add.container(0, 0);
      enemyDef.onDraw(this.scene, iconG, enemyDef.color || 0xffffff, {
        shouldRotate: false,
      });
      iconG.setScale(0.85 * s);
      container.add(iconG);
    }

    return container;
  }

  hideWavePreview() {
    if (this.tooltip) {
      this.tooltip.destroy(true);
      this.tooltip = null;
    }
  }

  // -------------------------
  // States
  // -------------------------
  setLockedState(isLocked) {
    this.isLocked = isLocked;
    this.updateWaveRunningState(true);
  }

  updateWaveRunningState(force = false) {
    // Si un countdown est actif et qu'aucune vague n'est en cours, ne pas modifier l'affichage
    const hasActiveCountdown = this.scene.nextWaveCountdown > 0 && this.scene.nextWaveAutoTimer;
    if (hasActiveCountdown && !this.scene.isWaveRunning && !force) {
      return; // Laisser showCountdown() gérer l'affichage
    }
    
    const isRunning = !!this.scene.isWaveRunning;
    const canChain = !!this.scene.canCallNextWave;
    const bonus = this.getAnticipationBonusCoins();

    // ✅ Evite de spammer des setText/setAlpha si rien n’a changé
    if (
      !force &&
      this._lastIsRunning === isRunning &&
      this._lastCanChain === canChain &&
      this._lastIsLocked === this.isLocked &&
      this._lastBonus === bonus
    ) {
      return;
    }

    this._lastIsRunning = isRunning;
    this._lastCanChain = canChain;
    this._lastIsLocked = this.isLocked;
    this._lastBonus = bonus;

    this.icons.forEach((icon) => {
      if (this.isLocked) {
        icon.container.setAlpha(0.3);
        icon.container.disableInteractive();
        icon.countdownText.setText("");
        this.setBonusVisible(icon, false);
        return;
      }

      icon.container.setInteractive();

      if (isRunning) {
        if (canChain) {
          icon.container.setAlpha(1);
          icon.countdownText.setText("Anticiper");
          // Afficher le bonus seulement s'il y a des ennemis vivants (bonus > 0)
          this.setBonusVisible(icon, bonus > 0); // ✅ ici ça doit s’afficher
        } else {
          icon.container.setAlpha(0.6);
          icon.countdownText.setText("Anticiper");
          this.setBonusVisible(icon, false);
        }
        return;
      }

      // Hors vague
      icon.container.setAlpha(1);
      this.setBonusVisible(icon, false);

      // Si un countdown est en cours, ne pas l'effacer
      const hasCountdown = this.scene.nextWaveCountdown > 0 && this.scene.nextWaveAutoTimer;
      if (hasCountdown) {
        // Le countdown sera géré par showCountdown(), ne rien faire ici
        return;
      }

      if (canChain) {
        icon.countdownText.setText("Prêt");
      } else if (!icon.countdownText.text?.includes("s")) {
        icon.countdownText.setText("");
      }
    });
  }

  clearCountdown() {
    this.icons.forEach((icon) => {
      icon.countdownText.setText("");
      icon.countdownText.setColor("#00ffc2");
      this.setBonusVisible(icon, false);
    });
  }

  showCountdown(seconds) {
    if (this.scene.isWaveRunning) return;

    this.icons.forEach((icon) => {
      if (seconds > 0) {
        icon.countdownText.setText(`${seconds}s`);
        icon.countdownText.setColor(seconds <= 5 ? "#ff3333" : "#00ffc2");
      } else {
        icon.countdownText.setText("");
        icon.countdownText.setColor("#00ffc2");
      }
      this.setBonusVisible(icon, false);
    });
  }
}
