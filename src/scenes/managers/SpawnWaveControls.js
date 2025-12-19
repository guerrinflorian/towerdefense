import { CONFIG, ENEMIES } from "../../config/settings.js";

export class SpawnWaveControls {
  constructor(scene) {
    this.scene = scene;
    this.icons = [];
    this.tooltip = null;
    this.isLocked = false;
    this.countdownValue = null;
  }

  create() {
    this.destroy();
    const spawnTiles = this.getSpawnTiles();

    spawnTiles.forEach((spawn, index) => {
      this.icons.push(this.createIcon(spawn, index + 1));
    });
  }

  destroy() {
    if (this.tooltip) {
      this.tooltip.destroy(true);
      this.tooltip = null;
    }

    this.icons.forEach((icon) => {
      if (icon?.container?.destroy) {
        icon.container.destroy(true);
      }
    });
    this.icons = [];
  }

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

  createIcon(spawn, index) {
    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;
    const px = this.scene.mapStartX + spawn.tileX * T + T / 2;
    const py = this.scene.mapStartY + spawn.tileY * T + T / 2;
    const size = Math.max(40 * this.scene.scaleFactor, T * 0.4);
    const container = this.scene.add.container(px, py).setDepth(220);

    const hitRadius = size * 0.9;
    const hitArea = new Phaser.Geom.Circle(0, 0, hitRadius);
    container.setSize(size * 1.4, size * 1.4);
    container.setInteractive(hitArea, Phaser.Geom.Circle.Contains);
    if (container.input) {
      container.input.cursor = "pointer";
    }

    const bg = this.scene.add.circle(0, 0, size, 0x0b0b12, 0.92);
    bg.setStrokeStyle(3 * this.scene.scaleFactor, 0x00ffc2, 0.85);

    const arrow = this.scene.add.polygon(
      0,
      0,
      [size * -0.6, -size * 0.35, size * 0.2, -size * 0.35, size * 0.2, -size, size * 0.9, 0, size * 0.2, size, size * 0.2, size * 0.35, size * -0.6, size * 0.35],
      0x00ffc2,
      0.95
    );
    arrow.setRotation(spawn.angle);
    arrow.setDepth(1);

    const badge = this.scene.add.circle(
      -size * 0.75,
      -size * 0.75,
      size * 0.35,
      0x141428,
      0.9
    );
    badge.setStrokeStyle(2 * this.scene.scaleFactor, 0xffffff, 0.6);

    const badgeText = this.scene.add
      .text(badge.x, badge.y, `${index}`, {
        fontSize: `${Math.max(12, 14 * this.scene.scaleFactor)}px`,
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const countdownText = this.scene.add
      .text(0, size * 1.1, "", {
        fontSize: `${Math.max(12, 14 * this.scene.scaleFactor)}px`,
        color: "#bdfdff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    container.add([bg, arrow, badge, badgeText, countdownText]);

    container.on("pointerover", () => {
      arrow.setTint(0xffffff);
      this.showWavePreview(container);
    });

    container.on("pointerout", () => {
      arrow.clearTint();
      this.hideWavePreview();
    });

    container.on("pointerdown", () => {
      if (this.isLocked || this.scene.isWaveRunning) return;
      this.scene.startWave();
    });

    return { container, bg, arrow, countdownText, hitRadius };
  }

  showWavePreview(anchor) {
    this.hideWavePreview();
    const summary = this.scene.waveManager.getNextWaveSummary();
    if (!summary.length) return;

    const s = this.scene.scaleFactor;
    const rowHeight = 36 * s;
    const width = 190 * s;
    const height = summary.length * rowHeight + 20 * s;

    const targetX = Phaser.Math.Clamp(
      anchor.x,
      width / 2 + 10,
      this.scene.gameWidth - width / 2 - 10
    );
    const targetY = Phaser.Math.Clamp(
      anchor.y - (80 * s + height / 2),
      height / 2 + 10,
      this.scene.gameHeight - height / 2 - 10
    );

    this.tooltip = this.scene.add.container(targetX, targetY).setDepth(500);
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x0c0c15, 0.92);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, 12);
    bg.lineStyle(2, 0x00ffc2, 0.45);
    bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 12);
    this.tooltip.add(bg);

    summary.forEach((item, idx) => {
      const rowY = -height / 2 + 12 * s + idx * rowHeight;

      const icon = this.createEnemyPreview(item.type);
      icon.setPosition(-width / 2 + 22 * s, rowY + rowHeight / 2);
      icon.setScale(0.5 * s);

      const countText = this.scene.add.text(
        -width / 2 + 50 * s,
        rowY + rowHeight / 2,
        `x${item.count}`,
        {
          fontSize: `${Math.max(13, 16 * s)}px`,
          color: "#e1f7ff",
          fontFamily: "Arial",
          fontStyle: "bold",
        }
      );
      countText.setOrigin(0, 0.5);

      this.tooltip.add(icon);
      this.tooltip.add(countText);
    });
  }

  hideWavePreview() {
    if (this.tooltip) {
      this.tooltip.destroy(true);
      this.tooltip = null;
    }
  }

  createEnemyPreview(typeKey) {
    const container = this.scene.add.container(0, 0);
    const circle = this.scene.add.circle(0, 0, 12 * this.scene.scaleFactor, 0x171727, 0.85);
    circle.setStrokeStyle(2 * this.scene.scaleFactor, 0x00ffc2, 0.5);
    container.add(circle);

    const enemyDef = ENEMIES[typeKey];
    if (enemyDef?.onDraw) {
      const iconContainer = this.scene.add.container(0, 0);
      try {
        const fakeEnemy = { shouldRotate: false };
        enemyDef.onDraw(this.scene, iconContainer, enemyDef.color || 0xffffff, fakeEnemy);
        iconContainer.setScale(0.4);
        container.add(iconContainer);
      } catch (e) {
        container.add(this.createFallbackIcon());
      }
    } else {
      container.add(this.createFallbackIcon());
    }

    return container;
  }

  createFallbackIcon() {
    const g = this.scene.add.graphics();
    g.fillStyle(0xffffff, 0.9);
    g.fillRoundedRect(-8, -8, 16, 16, 4);
    g.lineStyle(2, 0x00ffc2, 0.7);
    g.strokeRoundedRect(-8, -8, 16, 16, 4);
    return g;
  }

  setLockedState(isLocked) {
    this.isLocked = isLocked;
    this.icons.forEach((icon) => {
      icon.container.disableInteractive();
      icon.container.setInteractive(
        new Phaser.Geom.Circle(0, 0, icon.hitRadius),
        Phaser.Geom.Circle.Contains
      );

      if (icon.container.input) {
        icon.container.input.cursor = isLocked ? "default" : "pointer";
      }
      icon.container.setAlpha(isLocked ? 0.95 : 1);
      icon.bg.setStrokeStyle(
        3 * this.scene.scaleFactor,
        isLocked ? 0x888888 : 0x00ffc2,
        isLocked ? 0.55 : 0.85
      );
    });
  }

  clearCountdown() {
    this.countdownValue = null;
    this.icons.forEach((icon) => icon.countdownText.setText(""));
  }

  showCountdown(seconds) {
    this.countdownValue = seconds;
    this.icons.forEach((icon) =>
      icon.countdownText.setText(
        seconds > 0 ? `Prochaine: ${seconds}s` : ""
      )
    );
  }
}
