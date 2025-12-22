import { getLevelConfigById } from "../config/levels/index.js";
import { getHeroStats, isAuthenticated } from "../services/authManager.js";
import { showAuth } from "../services/authOverlay.js";
import {
  fetchChaptersWithLevels,
  buildChapterViewModels,
  buildLevelLocks,
  fetchBestRunsMap,
  toBestRunMap,
  fetchChapterProgress,
} from "../services/chapterService.js";
import { fetchPlayerBestRuns } from "../services/leaderboardService.js";

export class MapScene extends Phaser.Scene {
  constructor() {
    super("MapScene");
    this.levelIslands = new Map();
    this.bestRunsByLevel = new Map();
    this.levelLocks = new Map();
    this.currentChapter = null;
    this.launchedFromMainMenu = false;
    this.biomes = {
      grass: {
        top: 0x55aa44,
        side: 0x3d2b1f,
        light: 0x77cc66,
        prop: 0x225522,
        glow: 0x00ff00,
      },
      lava: {
        top: 0x333333,
        side: 0x221100,
        light: 0xff4400,
        prop: 0xff0000,
        glow: 0xff4400,
      },
      ice: {
        top: 0xeeddfb,
        side: 0x4466aa,
        light: 0xffffff,
        prop: 0xaaddff,
        glow: 0x00ffff,
      },
      sand: {
        top: 0xedc9af,
        side: 0x8b5a2b,
        light: 0xffe4b5,
        prop: 0xd2b48c,
        glow: 0xffcc00,
      },
      cyber: {
        top: 0x1a1a2e,
        side: 0x0f0f1b,
        light: 0x00f2ff,
        prop: 0x0055ff,
        glow: 0x00f2ff,
      },
      cimetiere: {
        top: 0x2a1f1a,
        side: 0x1a1510,
        light: 0x3a2f2a,
        prop: 0x4a3a35,
        glow: 0x8b4513,
      },
    };
  }

  init(data) {
    this.launchedFromMainMenu = data?.fromMainMenu === true;
    this.currentChapter = data?.chapter || null;
    this.bestRunsByLevel = data?.bestRuns ? new Map(data.bestRuns) : new Map();
  }

  preload() {
    const backgroundMapUrl = new URL(
      "../images/background_map.jpg",
      import.meta.url
    ).href;
    this.load.image("background_map", backgroundMapUrl);
  }

  create() {
    if (!this.launchedFromMainMenu) {
      this.scene.start("MainMenuScene");
      return;
    }

    const { width, height } = this.scale;
    const cx = width / 2;

    this.levelIslands = new Map();
    this.mapContainer = this.add.container(0, 0);

    this.addBackground(cx, height);
    this.addHeader();

    this.loadingText = this.add
      .text(width / 2, height / 2, "Chargement des niveaux...", {
        fontFamily: "Orbitron",
        fontSize: "18px",
        color: "#9ae8ff",
      })
      .setOrigin(0.5);

    this.hydrateData();

    this.scale.on("resize", this.applyResponsiveScale, this);
    this.events.once("shutdown", () => {
      this.scale.off("resize", this.applyResponsiveScale, this);
    });
  }

  async hydrateData() {
    try {
      let chapters = [];
      if (isAuthenticated()) {
        try {
          const progress = await fetchChapterProgress();
          chapters = progress.chapters || [];
          if (!this.bestRunsByLevel.size && progress.bestRunsMap) {
            this.bestRunsByLevel = progress.bestRunsMap;
          }
        } catch (_err) {
          // fallback public
        }
      }

      if (!chapters.length) {
        if (this.bestRunsByLevel.size === 0) {
          const runs = await fetchBestRunsMap();
          this.bestRunsByLevel = runs;
        }
        chapters = await fetchChaptersWithLevels();
      }

      const chapterVMs = buildChapterViewModels(chapters, this.bestRunsByLevel);

      if (!this.currentChapter && chapterVMs.length > 0) {
        this.currentChapter = chapterVMs[0];
      } else if (this.currentChapter) {
        this.currentChapter =
          chapterVMs.find((c) => c.id === this.currentChapter.id) ||
          chapterVMs[0];
      }

      if (this.currentChapter) {
        this.levelLocks = buildLevelLocks(
          this.currentChapter.levels,
          this.currentChapter.isLocked,
          this.bestRunsByLevel
        );
      }

      this.renderScene();
    } catch (error) {
      console.error("Erreur lors du chargement de la carte", error);
      if (this.loadingText) {
        this.loadingText.setText("Impossible de charger la carte.");
      }
    }
  }

  addBackground(cx, height) {
    this.cameras.main.setBackgroundColor("#020508");
    if (this.textures.exists("background_map")) {
      if (!this.bgImage) {
        this.bgImage = this.add
          .image(cx, height / 2, "background_map")
          .setDepth(-1)
          .setScrollFactor(0)
          .setTint(0x444444);
      }
      const scale = Math.max(
        this.scale.width / this.bgImage.width,
        this.scale.height / this.bgImage.height
      );
      this.bgImage.setPosition(cx, height / 2).setScale(scale);
    }

    if (!this.bgOverlay || !this.bgOverlay.scene) {
      this.bgOverlay = this.add.rectangle(
        cx,
        height / 2,
        this.scale.width,
        height,
        0x000000,
        0.35
      );
      this.bgOverlay.setDepth(-0.5);
    } else {
      this.bgOverlay.setPosition(cx, height / 2);
      this.bgOverlay.setSize(this.scale.width, height);
    }
  }

  addHeader() {
    const { width, height } = this.scale;
    this.title = this.add
      .text(width / 2, 50, "SÉLECTION DU SECTEUR", {
        fontFamily: "Impact",
        fontSize: "42px",
        color: "#fff",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, "#00f2ff", 20, true, true);

    this.chapterLabel = this.add
      .text(width / 2, 90, "", {
        fontFamily: "Orbitron",
        fontSize: "18px",
        color: "#9ae8ff",
      })
      .setOrigin(0.5);

    const backMain = this.add
      .text(width / 2, height - 40, "↩ RETOUR AU QG", {
        fontFamily: "Orbitron",
        fontSize: "16px",
        color: "#00f2ff",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    backMain.on("pointerover", () => backMain.setColor("#9ae8ff"));
    backMain.on("pointerout", () => backMain.setColor("#00f2ff"));
    backMain.on("pointerdown", () => this.scene.start("MainMenuScene"));
    this.backMain = backMain;

    const backChapters = this.add
      .text(90, 50, "⟵ Chapitres", {
        fontFamily: "Orbitron",
        fontSize: "16px",
        color: "#9ae8ff",
      })
      .setInteractive({ useHandCursor: true });
    backChapters.on("pointerover", () => backChapters.setColor("#ffffff"));
    backChapters.on("pointerout", () => backChapters.setColor("#9ae8ff"));
    backChapters.on("pointerdown", () =>
      this.scene.start("ChapterScene", { fromMainMenu: true })
    );
    this.backChapters = backChapters;
  }

  renderScene() {
    if (this.loadingText) {
      this.loadingText.destroy();
      this.loadingText = null;
    }

    this.mapContainer.removeAll(true);
    this.levelIslands.clear();
    this.draw3DMap();
    this.applyResponsiveScale();
    this.updateChapterLabel();
    this.updateAllIslandStats();
  }

  updateChapterLabel() {
    if (!this.chapterLabel || !this.currentChapter) return;
    const hearts = this.currentChapter.unlockPrevChapterHeartsMax;
    const heartsInfo =
      hearts != null
        ? `• Pré-requis: ≤ ${hearts} cœurs sur le chapitre précédent`
        : "• Chapitre initial";
    this.chapterLabel.setText(
      `${this.currentChapter.name.toUpperCase()} ${
        heartsInfo ? `\n${heartsInfo}` : ""
      }`
    );
  }

  draw3DMap() {
    if (!this.currentChapter) return;
    const { width, height } = this.scale;
    const levels = this.currentChapter.levels || [];
    if (!levels.length) return;

    const yBase = height * 0.6;
    const margin = Math.min(220, width * 0.12);
    const gap =
      levels.length > 1 ? (width - margin * 2) / (levels.length - 1) : 0;

    const pathGfx = this.add.graphics();
    this.mapContainer.add(pathGfx);

    let previousPoint = null;

    levels.forEach((level, idx) => {
      const x = margin + idx * gap;
      const wobble = Math.sin(idx * 0.8) * 40;
      const y = yBase + wobble;
      const levelConfig = getLevelConfigById(level.id);
      const biome = levelConfig?.biome || "grass";
      const lockState = this.levelLocks.get(level.id);
      const isLocked = this.currentChapter.isLocked || lockState?.isLocked;

      if (previousPoint) {
        this.drawBridge(pathGfx, previousPoint, { x, y }, isLocked);
      }

      const island = this.create3DIsland(x, y, level, biome, isLocked);
      this.mapContainer.add(island);
      previousPoint = { x, y };
    });
  }

  applyResponsiveScale() {
    const { width, height } = this.scale;
    const isPortrait = height >= width;
    const targetScale = isPortrait ? 0.85 : width < 1100 ? 0.92 : 1;
    this.mapContainer.setScale(targetScale);

    const offsetX = (width - width * targetScale) / 2;
    const offsetY = (height - height * targetScale) / 4;
    this.mapContainer.setPosition(offsetX, offsetY);

    this.addBackground(width / 2, height);

    if (this.title) this.title.setPosition(width / 2, 50);
    if (this.chapterLabel) this.chapterLabel.setPosition(width / 2, 90);
    if (this.backMain) this.backMain.setPosition(width / 2, height - 40);
    if (this.backChapters) this.backChapters.setPosition(90, 50);
  }

  create3DIsland(x, y, level, biomeType, isLocked) {
    const container = this.add.container(x, y);
    const biome = this.biomes[biomeType] || this.biomes.grass;
    const s = 0.95;

    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.5).fillEllipse(0, 60, 100 * s, 50 * s);

    const cliff = this.add.graphics();
    cliff.fillStyle(isLocked ? 0x1a1a1a : biome.side);
    cliff.beginPath();
    cliff.moveTo(-60 * s, 0);
    cliff.lineTo(-40 * s, 50 * s);
    cliff.lineTo(40 * s, 50 * s);
    cliff.lineTo(60 * s, 0);
    cliff.closePath();
    cliff.fillPath();

    const surface = this.add.graphics();
    const topColor = isLocked ? 0x2d2d2d : biome.top;
    surface.fillGradientStyle(
      isLocked ? 0x333333 : biome.light,
      isLocked ? 0x333333 : biome.light,
      topColor,
      topColor,
      1
    );
    const p = [
      -60, -10, -40, -30, 0, -35, 40, -30, 60, -10, 50, 20, 0, 30, -50, 25,
    ];
    surface.beginPath();
    surface.moveTo(p[0] * s, p[1] * s);
    for (let i = 2; i < p.length; i += 2)
      surface.lineTo(p[i] * s, p[i + 1] * s);
    surface.closePath();
    surface.fillPath();
    surface.lineStyle(2, 0xffffff, isLocked ? 0.05 : 0.4);
    surface.strokePath();

    container.add([shadow, cliff, surface]);

    if (!isLocked) {
      this.addEnvironmentEffects(container, biomeType, s);
    }

    if (biomeType === "cimetiere" && !isLocked) {
      const pumpkin = this.add.graphics();
      pumpkin.fillStyle(0xff6600);
      pumpkin.fillCircle(0, -20, 8 * s);
      pumpkin.fillStyle(0x1a0a00);
      pumpkin.fillRect(-1 * s, -28 * s, 2 * s, 3 * s);
      pumpkin.fillStyle(0x000000);
      pumpkin.fillCircle(-3 * s, -22 * s, 1.5 * s);
      pumpkin.fillCircle(3 * s, -22 * s, 1.5 * s);
      pumpkin.beginPath();
      pumpkin.moveTo(-4 * s, -18 * s);
      pumpkin.lineTo(-2 * s, -16 * s);
      pumpkin.lineTo(0, -17 * s);
      pumpkin.lineTo(2 * s, -16 * s);
      pumpkin.lineTo(4 * s, -18 * s);
      pumpkin.closePath();
      pumpkin.fillPath();
      container.add(pumpkin);
    }

    const labelBox = this.add.graphics();
    labelBox
      .fillStyle(0x000000, 0.8)
      .lineStyle(1, isLocked ? 0x333333 : biome.light, 1);
    labelBox
      .fillRoundedRect(-75, 65, 150, 26, 6)
      .strokeRoundedRect(-75, 65, 150, 26, 6);

    const txtId = this.add
      .text(0, -12, level.id, {
        fontSize: "44px",
        fontFamily: "Impact",
        color: isLocked ? "#444" : "#fff",
      })
      .setOrigin(0.5);
    const txtName = this.add
      .text(0, 78, level.name.toUpperCase(), {
        fontSize: "11px",
        fontFamily: "Orbitron",
        color: isLocked ? "#555" : "#fff",
        fontWeight: "bold",
        align: "center",
        wordWrap: { width: 140 },
      })
      .setOrigin(0.5);

    container.add([labelBox, txtId, txtName]);

    const statsStyle = {
      fontSize: "11px",
      fontFamily: "Orbitron",
      color: "#bdf1ff",
    };
    const bestTime = this.add.text(0, -78, "", statsStyle).setOrigin(0.5);
    const bestHearts = this.add
      .text(0, -62, "", { ...statsStyle, color: "#ffb3b3" })
      .setOrigin(0.5);
    const statsContainer = this.add
      .container(0, 0, [bestTime, bestHearts])
      .setVisible(false);
    container.add(statsContainer);

    this.levelIslands.set(level.id, {
      container,
      statsContainer,
      bestTime,
      bestHearts,
      isLocked,
    });

    if (isLocked) {
      container.add(
        this.add
          .text(0, 0, "🔒", { fontSize: "40px" })
          .setOrigin(0.5)
          .setAlpha(0.6)
      );
      container.setAlpha(0.85);
    }

    this.tweens.add({
      targets: container,
      y: y - 15,
      duration: 2500 + level.id * 200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    if (!isLocked) {
      container.setInteractive(
        new Phaser.Geom.Circle(0, 0, 55),
        Phaser.Geom.Circle.Contains
      );
      container.on("pointerover", () =>
        this.tweens.add({ targets: container, scale: 1.08, duration: 150 })
      );
      container.on("pointerout", () =>
        this.tweens.add({ targets: container, scale: 1, duration: 150 })
      );
      container.on("pointerdown", () => this.handleLevelSelection(level));
    }

    return container;
  }

  addEnvironmentEffects(container, biomeType, s) {
    const propColor = this.biomes[biomeType]?.prop ?? this.biomes.grass.prop;

    switch (biomeType) {
      case "ice":
        for (let i = 0; i < 15; i++) {
          const flake = this.add.circle(
            Phaser.Math.Between(-50, 50) * s,
            Phaser.Math.Between(-40, 20) * s,
            2 * s,
            0xffffff,
            0.8
          );
          container.add(flake);
          this.tweens.add({
            targets: flake,
            y: flake.y + 40,
            x: flake.x + Phaser.Math.Between(-10, 10),
            alpha: 0,
            duration: 2000 + Math.random() * 2000,
            repeat: -1,
            delay: Math.random() * 2000,
          });
        }
        break;

      case "sand":
        for (let i = 0; i < 20; i++) {
          const particle = this.add.rectangle(
            Phaser.Math.Between(-60, 60) * s,
            Phaser.Math.Between(-30, 30) * s,
            4 * s,
            1 * s,
            propColor,
            0.6
          );
          container.add(particle);
          this.tweens.add({
            targets: particle,
            x: particle.x + 50,
            alpha: { from: 0, to: 0.6 },
            duration: 800 + Math.random() * 500,
            repeat: -1,
            onRepeat: () => {
              particle.x = -60 * s;
            },
          });
        }
        break;

      case "grass":
        for (let i = 0; i < 8; i++) {
          const tuft = this.add.graphics();
          tuft.fillStyle(propColor, 0.7);
          const tx = Phaser.Math.Between(-40, 40) * s;
          const ty = Phaser.Math.Between(-20, 20) * s;
          tuft.fillCircle(tx, ty, 3 * s);
          tuft.fillCircle(tx + 4, ty - 2, 2 * s);
          container.add(tuft);
        }
        break;

      case "lava":
        for (let i = 0; i < 12; i++) {
          const ember = this.add.circle(
            Phaser.Math.Between(-40, 40) * s,
            20 * s,
            2 * s,
            0xff4400,
            1
          );
          container.add(ember);
          this.tweens.add({
            targets: ember,
            y: ember.y - 60,
            x: ember.x + Phaser.Math.Between(-20, 20),
            scale: 0,
            duration: 1500 + Math.random() * 1000,
            repeat: -1,
          });
        }
        break;

      case "cyber":
        for (let i = 0; i < 5; i++) {
          const glitch = this.add.rectangle(
            Phaser.Math.Between(-40, 40) * s,
            Phaser.Math.Between(-20, 20) * s,
            10 * s,
            2 * s,
            0x00f2ff,
            0.8
          );
          container.add(glitch);
          this.tweens.add({
            targets: glitch,
            alpha: 0,
            duration: 100,
            yoyo: true,
            repeat: -1,
            repeatDelay: Math.random() * 2000,
          });
        }
        break;

      case "cimetiere":
        for (let i = 0; i < 15; i++) {
          const mist = this.add.circle(
            Phaser.Math.Between(-50, 50) * s,
            Phaser.Math.Between(-30, 30) * s,
            3 * s,
            0x4a4a4a,
            0.4
          );
          container.add(mist);
          this.tweens.add({
            targets: mist,
            x: mist.x + Phaser.Math.Between(-20, 20),
            y: mist.y + Phaser.Math.Between(-15, 15),
            alpha: { from: 0.2, to: 0.5 },
            duration: 3000 + Math.random() * 2000,
            yoyo: true,
            repeat: -1,
            delay: Math.random() * 2000,
          });
        }
        break;
    }
  }

  drawBridge(gfx, p1, p2, isLocked) {
    const color = isLocked ? 0x222222 : 0x00f2ff;
    const curve = new Phaser.Curves.QuadraticBezier(
      new Phaser.Math.Vector2(p1.x, p1.y),
      new Phaser.Math.Vector2((p1.x + p2.x) / 2, (p1.y + p2.y) / 2 - 60),
      new Phaser.Math.Vector2(p2.x, p2.y)
    );
    gfx.lineStyle(10, 0x000000, 0.2);
    curve.draw(gfx);
    gfx.lineStyle(3, color, isLocked ? 0.15 : 0.7);
    curve.draw(gfx);
  }

  async refreshBestRuns() {
    if (!isAuthenticated()) return;
    try {
      const entries = await fetchPlayerBestRuns();
      this.bestRunsByLevel = toBestRunMap(entries);
      if (this.currentChapter) {
        this.levelLocks = buildLevelLocks(
          this.currentChapter.levels,
          this.currentChapter.isLocked,
          this.bestRunsByLevel
        );
      }
      this.updateAllIslandStats();
    } catch (err) {
      console.warn("Impossible de rafraîchir les meilleurs runs", err);
    }
  }

  updateAllIslandStats() {
    this.levelIslands.forEach((_value, levelId) =>
      this.updateIslandStats(levelId)
    );
  }

  updateIslandStats(levelId) {
    const island = this.levelIslands.get(levelId);
    if (!island || island.isLocked) return;
    const bestRun = this.bestRunsByLevel.get(levelId);
    if (!bestRun) {
      island.statsContainer.setVisible(false);
      return;
    }
    island.bestTime.setText(`⏱ ${this.formatTime(bestRun.completionTimeMs)}`);
    island.bestHearts.setText(`❤️ ${bestRun.livesLost} perdus`);
    island.statsContainer.setVisible(true);
  }

  handleLevelSelection(level) {
    const config = getLevelConfigById(level.id);
    if (!config) {
      this.showToast("Configuration du niveau manquante côté client.");
      return;
    }
    if (!isAuthenticated()) {
      showAuth();
      return;
    }
    this.scene.start("GameScene", {
      level: level.id,
      heroStats: getHeroStats(),
    });
  }

  showToast(message) {
    if (this.toast) this.toast.destroy();
    const { width } = this.scale;
    this.toast = this.add
      .text(width / 2, 140, message, {
        fontFamily: "Orbitron",
        fontSize: "14px",
        color: "#ffb3b3",
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: { x: 10, y: 6 },
      })
      .setOrigin(0.5);
    this.time.delayedCall(2500, () => {
      if (this.toast) this.toast.destroy();
      this.toast = null;
    });
  }

  formatTime(ms) {
    if (!ms || ms <= 0) return "0:00";
    const sec = Math.floor(ms / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
}
