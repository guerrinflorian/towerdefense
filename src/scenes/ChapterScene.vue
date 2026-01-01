<template>
  <!-- Scene rendered via Phaser; component placeholder for Vue tooling -->
  <div class="scene-wrapper" aria-hidden="true"></div>
</template>

<script>
import {
  fetchChaptersWithLevels,
  fetchBestRunsMap,
  buildChapterViewModels,
  fetchChapterProgress,
} from "../services/chapterService.js";
import { showAuth } from "../services/authOverlay.js";
import { isAuthenticated } from "../services/authManager.js";

export class ChapterScene extends Phaser.Scene {
  constructor() {
    super("ChapterScene");
    this.chapters = [];
    this.bestRunsMap = new Map();
  }

  init() {
    this.bgImage = null;
    this.title = null;
    this.backButton = null;
    this.cardGroup = null;
    this.loadingText = null;
  }

  preload() {
    const bgUrl = new URL("../images/background.jpg", import.meta.url).href;
    this.load.image("chapters-bg", bgUrl);

    const chapter1Url = new URL("../images/chapitre1.png", import.meta.url)
      .href;
    this.load.image("chapter-img-1", chapter1Url);

    const chapter2Url = new URL("../images/chapitre2.png", import.meta.url)
      .href;
    this.load.image("chapter-img-2", chapter2Url);

    // Gestion des erreurs de chargement
    this.load.on("loaderror", (file) => {
      console.warn(
        `Impossible de charger l'asset : ${file.key} à l'adresse ${file.src}`
      );
    });
  }

  create() {
    if (!isAuthenticated()) {
      showAuth();
      this.scene.start("MainMenuScene");
      return;
    }

    const { width, height } = this.scale;

    // --- INITIALISATION UI ---
    this.addBackground();
    this.setupHeader();
    this.addBackButton();

    // Container principal pour les cartes
    this.cardGroup = this.add.container(0, 0);

    // Texte de chargement
    this.loadingText = this.add
      .text(width / 2, height / 2, "CHARGEMENT DES DONNÉES...", {
        fontFamily: "Orbitron, sans-serif",
        fontSize: "20px",
        color: "#00f2ff",
      })
      .setOrigin(0.5);

    this.loadData();

    // --- RESPONSIVE EVENT ---
    this.scale.on("resize", this.handleResize, this);
    this.events.once("shutdown", () => {
      this.scale.off("resize", this.handleResize, this);
    });
  }

  async loadData() {
    try {
      const progress = await fetchChapterProgress();
      this.chapters = buildChapterViewModels(
        progress.chapters || [],
        progress.bestRunsMap || new Map()
      );

      if (this.chapters.length === 0) {
        const [chs, runsMap] = await Promise.all([
          fetchChaptersWithLevels(),
          fetchBestRunsMap(),
        ]);
        this.chapters = buildChapterViewModels(chs, runsMap);
      }

      if (this.loadingText) this.loadingText.destroy();
      this.renderCards();
    } catch (error) {
      console.error("Erreur chargement data:", error);
      if (this.loadingText) this.loadingText.setText("ERREUR DE CONNEXION");
    }
  }

  addBackground() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor("#020408");

    if (this.bgImage) this.bgImage.destroy();

    if (this.textures.exists("chapters-bg")) {
      this.bgImage = this.add
        .image(width / 2, height / 2, "chapters-bg")
        .setOrigin(0.5)
        .setDepth(-2)
        .setAlpha(0.3)
        .setTint(0x223344);

      const scale = Math.max(
        width / this.bgImage.width,
        height / this.bgImage.height
      );
      this.bgImage.setScale(scale);
    }
  }

  setupHeader() {
    const { width } = this.scale;
    if (this.title) this.title.destroy();

    this.title = this.add
      .text(width / 2, 60, "SÉLECTION DU CHAPITRE", {
        fontFamily: "Impact, sans-serif",
        fontSize: width < 600 ? "28px" : "48px",
        color: "#ffffff",
        letterSpacing: 2,
      })
      .setOrigin(0.5)
      .setShadow(0, 0, "#00f2ff", 20, true, true);
  }

  renderCards() {
    if (!this.cardGroup || !this.scene.isActive()) return;
    this.cardGroup.removeAll(true);

    const { width, height } = this.scale;

    const isMobile = width < 800;
    const cols = width < 650 ? 1 : width < 1200 ? 2 : 3;
    const padding = 25;

    const gridWidth = Math.min(width * 0.95, 1300);
    const cardWidth = (gridWidth - padding * (cols - 1)) / cols;
    const cardHeight = 200; // Légèrement augmenté pour laisser de la place au texte de condition

    const headerBottom = this.title
      ? this.title.y + this.title.height * (1 - this.title.originY)
      : 100;

    const startX =
      (width - (cols * cardWidth + (cols - 1) * padding)) / 2 + cardWidth / 2;
    const startY = Math.max(headerBottom + 80, 220);

    this.chapters.forEach((chapter, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = startX + col * (cardWidth + padding);
      const y = startY + row * (cardHeight + padding);

      const card = this.createChapterCard(x, y, cardWidth, cardHeight, chapter);
      this.cardGroup.add(card);
    });
  }

  createChapterCard(x, y, w, h, chapter) {
    const container = this.add.container(x, y);
    const isLocked = chapter.isLocked;
    const accentColor = isLocked ? 0x445566 : 0x00f2ff;

    // 1. Fond de carte
    const bg = this.add.graphics();
    bg.fillStyle(0x0a1018, 0.9);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 12);
    bg.lineStyle(2, accentColor, 0.6);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 12);

    // 2. Image du chapitre
    const imgKey = `chapter-img-${chapter.id}`;
    const artSize = h - 60;
    let art;

    if (this.textures.exists(imgKey)) {
      art = this.add.image(-w / 2 + 20, 0, imgKey).setOrigin(0, 0.5);
      art.setDisplaySize(artSize * 1.3, artSize);
      if (isLocked) art.setTint(0x222222);
    } else {
      art = this.add
        .rectangle(-w / 2 + 20, 0, 80, artSize, 0x1a2530)
        .setOrigin(0, 0.5);
    }

    // 3. Textes
    const textX = art.x + (art.displayWidth || 80) + 20;
    const availableWidth = w - (textX + w / 2) - 20;

    const title = this.add.text(
      textX,
      -h / 2 + 25,
      chapter.name.toUpperCase(),
      {
        fontFamily: "Orbitron",
        fontSize: w < 350 ? "15px" : "19px",
        fontWeight: "bold",
        color: isLocked ? "#556677" : "#ffffff",
        wordWrap: { width: availableWidth },
      }
    );

    const stats = this.add.text(
      textX,
      title.y + title.height + 8,
      `Progression: ${chapter.stats.clearedLevels}/${chapter.stats.totalLevels}`,
      {
        fontFamily: "Orbitron",
        fontSize: "12px",
        color: "#9ae8ff",
      }
    );

    // --- CONDITION DE DÉBLOCAGE ---
    let conditionText = "";
    let conditionColor = "#44ffaa"; // Vert (débloqué)

    if (isLocked) {
      conditionColor = "#ff9900"; // Orange (bloqué)
      if (chapter.unlockPrevChapterHeartsMax != null) {
        conditionText = `REQUIS: Perdre < ${chapter.unlockPrevChapterHeartsMax} cœurs au chapitre précédent`;
      } else {
        conditionText = "REQUIS: Terminer le chapitre précédent";
      }
    } else {
      conditionText = "✓ SECTEUR ACCESSIBLE";
    }

    const unlockInfo = this.add.text(textX, stats.y + 22, conditionText, {
      fontFamily: "Orbitron",
      fontSize: "11px",
      color: conditionColor,
      fontWeight: "bold",
      wordWrap: { width: availableWidth },
    });

    const statusText = isLocked ? "VERROUILLÉ" : "DISPONIBLE";
    const status = this.add.text(
      textX,
      unlockInfo.y + unlockInfo.height + 12,
      statusText,
      {
        fontFamily: "Orbitron",
        fontSize: "10px",
        color: isLocked ? "#ff4444" : "#44ffaa",
        backgroundColor: "#00000055",
        padding: { x: 5, y: 2 },
      }
    );

    container.add([bg, art, title, stats, unlockInfo, status]);

    // 4. Interactions
    if (!isLocked) {
      container.setInteractive(
        new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h),
        Phaser.Geom.Rectangle.Contains
      );

      container.on("pointerover", () => {
        bg.lineStyle(3, 0xffffff, 1);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 12);
        container.setScale(1.03);
      });

      container.on("pointerout", () => {
        bg.lineStyle(2, accentColor, 0.6);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 12);
        container.setScale(1);
      });

      container.on("pointerdown", () => {
        this.scene.start("MapScene", {
          chapter: chapter,
          fromMainMenu: true,
        });
      });
    }

    return container;
  }

  handleResize() {
    const { width, height } = this.scale;
    this.addBackground();
    this.setupHeader();
    if (this.backButton) {
      this.backButton.setPosition(40, height - 40);
    }
    this.renderCards();
  }

  addBackButton() {
    const { height } = this.scale;
    this.backButton = this.add
      .text(40, height - 40, "↩ RETOUR AU MENU", {
        fontFamily: "Orbitron",
        fontSize: "16px",
        color: "#00f2ff",
      })
      .setOrigin(0, 1)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => this.backButton.setColor("#ffffff"))
      .on("pointerout", () => this.backButton.setColor("#00f2ff"))
      .on("pointerdown", () => this.scene.start("MainMenuScene"));
  }
}

export default {
  name: "ChapterSceneView",
  scene: ChapterScene,
};
</script>

<style scoped>
.scene-wrapper {
  display: none;
}
</style>
