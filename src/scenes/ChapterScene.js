import { fetchChaptersWithLevels, fetchBestRunsMap, buildChapterViewModels, fetchChapterProgress } from "../services/chapterService.js";
import { showAuth } from "../services/authOverlay.js";
import { isAuthenticated } from "../services/authManager.js";

export class ChapterScene extends Phaser.Scene {
  constructor() {
    super("ChapterScene");
    this.chapters = [];
    this.bestRunsMap = new Map();
    this.chapterColors = [
      { base: 0x0e1b2a, accent: 0x00f2ff },
      { base: 0x2a1a1a, accent: 0xffa000 },
      { base: 0x1a2a1f, accent: 0x6bffb5 },
      { base: 0x1f1a2a, accent: 0xff66ff },
    ];
  }

  preload() {
    const bg = new URL("../images/background_map.jpg", import.meta.url).href;
    this.load.image("chapters-bg", bg);
  }

  create() {
    if (!isAuthenticated()) {
      showAuth();
      this.scene.start("MainMenuScene");
      return;
    }

    const { width, height } = this.scale;
    this.addBackground(width, height);
    this.addTitle(width);
    this.addBackButton();
    this.cardGroup = this.add.container(0, 0);
    this.loadingText = this.add.text(width / 2, height / 2, "Chargement des chapitres...", {
      fontFamily: "Orbitron",
      fontSize: "18px",
      color: "#9ae8ff",
    }).setOrigin(0.5);

    this.loadData();
    this.scale.on("resize", this.handleResize, this);
    this.events.once("shutdown", () => {
      this.scale.off("resize", this.handleResize, this);
    });
  }

  async loadData() {
    try {
      let chapters = [];
      let bestRunsMap = new Map();

      if (isAuthenticated()) {
        try {
          const progress = await fetchChapterProgress();
          chapters = progress.chapters || [];
          bestRunsMap = progress.bestRunsMap || new Map();
        } catch (err) {
          // fallback sur les endpoints publics
        }
      }

      if (chapters.length === 0) {
        const [chs, runsMap] = await Promise.all([
          fetchChaptersWithLevels(),
          fetchBestRunsMap(),
        ]);
        chapters = chs;
        bestRunsMap = runsMap;
      }

      this.bestRunsMap = bestRunsMap;
      this.chapters = buildChapterViewModels(chapters, bestRunsMap);
      this.renderCards();
    } catch (error) {
      console.error("Erreur chargement chapitres", error);
      if (this.loadingText) {
        this.loadingText.setText("Impossible de charger les chapitres.");
      }
    }
  }

  addBackground(width, height) {
    this.cameras.main.setBackgroundColor("#03060b");
    if (this.textures.exists("chapters-bg")) {
      if (!this.bgImage) {
        this.bgImage = this.add.image(width / 2, height / 2, "chapters-bg")
          .setDepth(-2)
          .setScrollFactor(0)
          .setTint(0x1d2c3a);
      }
      const scale = Math.max(this.scale.width / this.bgImage.width, this.scale.height / this.bgImage.height);
      this.bgImage.setPosition(width / 2, height / 2).setScale(scale);
    }

    if (!this.bgOverlay) {
      this.bgOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.45);
      this.bgOverlay.setDepth(-1);
    } else {
      this.bgOverlay.setPosition(width / 2, height / 2).setSize(width, height);
    }
  }

  addTitle(width) {
    this.title = this.add.text(width / 2, 70, "CHAPITRES", {
      fontFamily: "Impact",
      fontSize: "46px",
      color: "#ffffff",
    }).setOrigin(0.5).setShadow(0, 0, "#00f2ff", 20, true, true);

    this.subtitle = this.add.text(width / 2, 110, "Progresse chapitre par chapitre", {
      fontFamily: "Orbitron",
      fontSize: "18px",
      color: "#9ae8ff",
    }).setOrigin(0.5);
  }

  addBackButton() {
    const { width, height } = this.scale;
    const btn = this.add.text(60, height - 40, "↩ RETOUR", {
      fontFamily: "Orbitron",
      fontSize: "16px",
      color: "#00f2ff",
    }).setInteractive({ useHandCursor: true }).setDepth(10);

    btn.on("pointerover", () => btn.setColor("#9ae8ff"));
    btn.on("pointerout", () => btn.setColor("#00f2ff"));
    btn.on("pointerdown", () => this.scene.start("MainMenuScene"));

    this.backButton = btn;
  }

  renderCards() {
    const { width } = this.scale;
    if (this.loadingText) this.loadingText.destroy();
    this.cardGroup.removeAll(true);

    const cardWidth = Math.min(420, width * 0.8);
    const cardHeight = 230;
    const padding = 28;
    const cols = width > 1200 ? 2 : 1;
    const startX = width / 2 - ((cols - 1) * (cardWidth + padding)) / 2;
    let row = 0;
    let col = 0;

    this.chapters.forEach((chapter) => {
      const x = startX + col * (cardWidth + padding);
      const y = 180 + row * (cardHeight + padding);
      const card = this.createChapterCard(x, y, cardWidth, cardHeight, chapter);
      this.cardGroup.add(card);
      col += 1;
      if (col >= cols) {
        col = 0;
        row += 1;
      }
    });
  }

  createChapterCard(x, y, w, h, chapter) {
    const container = this.add.container(x, y);
    container.setSize(w, h);
    container.setInteractive(new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h), Phaser.Geom.Rectangle.Contains);

    const { base, accent } = this.getChapterColors(chapter.id);

    const panel = this.add.graphics();
    panel.fillStyle(0x0d1c26, 0.92);
    panel.fillRoundedRect(-w / 2, -h / 2, w, h, 16);
    panel.lineStyle(2, accent, chapter.isLocked ? 0.35 : 0.95);
    panel.strokeRoundedRect(-w / 2, -h / 2, w, h, 16);
    panel.setShadow(0, 0, accent, 12, false, false);

    const art = this.createChapterArt(base, accent, h - 40, chapter.isLocked);
    art.setPosition(-w / 2 + 90, 0);

    const title = this.add.text(-w / 2 + 260, -30, chapter.name.toUpperCase(), {
      fontFamily: "Orbitron",
      fontSize: "20px",
      color: chapter.isLocked ? "#607080" : "#ffffff",
      wordWrap: { width: w - 210 },
    }).setOrigin(0, 0.5);

    const progress = this.add.text(-w / 2 + 260, 5, `${chapter.stats.clearedLevels}/${chapter.stats.totalLevels} niveaux terminés`, {
      fontFamily: "Orbitron",
      fontSize: "14px",
      color: "#9ae8ff",
    }).setOrigin(0, 0.5);

    const hearts = chapter.unlockPrevChapterHeartsMax != null
      ? `≤ ${chapter.unlockPrevChapterHeartsMax} cœurs perdus sur le chapitre précédent`
      : "Premier chapitre - aucun prérequis";

    const heartsText = this.add.text(-w / 2 + 260, 32, hearts, {
      fontFamily: "Orbitron",
      fontSize: "13px",
      color: "#7ad3ff",
    }).setOrigin(0, 0.5);

    let lockText = null;
    if (chapter.isLocked) {
      lockText = this.add.text(-w / 2 + 260, 60, chapter.lockReason || "Chapitre verrouillé", {
        fontFamily: "Orbitron",
        fontSize: "13px",
        color: "#ff7676",
      }).setOrigin(0, 0.5);
    }

    const ctaBg = this.add.graphics();
    const ctaW = 180;
    const ctaH = 40;
    const ctaX = w / 2 - ctaW / 2 - 20;
    const ctaY = h / 2 - ctaH - 10;
    ctaBg.fillStyle(chapter.isLocked ? 0x30414b : 0x00f2ff, chapter.isLocked ? 0.3 : 0.15);
    ctaBg.fillRoundedRect(ctaX - w / 2, ctaY - h / 2, ctaW, ctaH, 10);
    ctaBg.lineStyle(2, chapter.isLocked ? 0x506068 : 0x00f2ff, chapter.isLocked ? 0.6 : 1);
    ctaBg.strokeRoundedRect(ctaX - w / 2, ctaY - h / 2, ctaW, ctaH, 10);

    const ctaLabel = this.add.text(ctaX - w / 2 + ctaW / 2, ctaY - h / 2 + ctaH / 2, chapter.isLocked ? "VERROUILLÉ" : "DÉCOUVRIR", {
      fontFamily: "Orbitron",
      fontSize: "16px",
      color: chapter.isLocked ? "#607080" : "#ffffff",
      fontStyle: "bold",
    }).setOrigin(0.5);

    container.add([panel, art, title, progress, heartsText, ctaBg, ctaLabel].concat(lockText ? [lockText] : []));

    container.on("pointerover", () => {
      if (chapter.isLocked) return;
      panel.lineStyle(2, 0x00f2ff, 1);
      panel.strokeRoundedRect(-w / 2, -h / 2, w, h, 16);
      container.setScale(1.01);
    });

    container.on("pointerout", () => {
      container.setScale(1);
      panel.lineStyle(2, 0x00f2ff, chapter.isLocked ? 0.4 : 0.9);
      panel.strokeRoundedRect(-w / 2, -h / 2, w, h, 16);
    });

    container.on("pointerdown", () => {
      if (chapter.isLocked) return;
      this.scene.start("MapScene", {
        fromMainMenu: true,
        chapter,
        bestRuns: Array.from(this.bestRunsMap.entries()),
      });
    });

    return container;
  }

  getChapterTextureKey(chapterId) {
    return `chapter-${chapterId}`; // kept for compatibility
  }

  handleResize() {
    if (!this.title) return;
    this.addBackground(this.scale.width, this.scale.height);
    this.title.setPosition(this.scale.width / 2, 70);
    if (this.subtitle) this.subtitle.setPosition(this.scale.width / 2, 110);
    if (this.backButton) this.backButton.setPosition(60, this.scale.height - 40);
    this.renderCards();
  }

  createChapterArt(baseColor, accentColor, height, isLocked) {
    const artW = 150;
    const artH = height;
    const g = this.add.graphics();
    const bgColor = isLocked ? Phaser.Display.Color.IntegerToColor(baseColor).darken(30).color : baseColor;
    g.fillStyle(bgColor, 0.95);
    g.fillRoundedRect(-artW / 2, -artH / 2, artW, artH, 12);

    const spineColor = isLocked ? 0x2a2a2a : accentColor;
    g.fillStyle(spineColor, 0.8);
    g.fillRoundedRect(-artW / 2, -artH / 2, 18, artH, 10);

    g.lineStyle(2, isLocked ? 0x555555 : 0xffffff, 0.6);
    g.strokeRoundedRect(-artW / 2, -artH / 2, artW, artH, 12);

    const stripe = this.add.graphics();
    stripe.fillStyle(isLocked ? 0x555555 : accentColor, 0.35);
    stripe.fillRoundedRect(-artW / 2 + 20, -artH / 2 + 16, artW - 40, 18, 6);

    const title = this.add.text(0, 0, "Chapitre", {
      fontFamily: "Orbitron",
      fontSize: "14px",
      color: isLocked ? "#a0a0a0" : "#ffffff",
    }).setOrigin(0.5);

    const container = this.add.container(0, 0, [g, stripe, title]);
    container.setScale(1, 1).setAngle(-2).setAlpha(isLocked ? 0.8 : 1);
    return container;
  }

  getChapterColors(chapterId) {
    const idx = (Number(chapterId) - 1) % this.chapterColors.length;
    return this.chapterColors[idx] || this.chapterColors[0];
  }
}
