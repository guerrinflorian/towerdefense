import { CONFIG } from "../config/settings.js";
import { LEVELS_CONFIG } from "../config/levels/index.js";

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenuScene");
  }

  create() {
    const { width, height } = this.scale;
    const cx = width / 2;

    // --- 1. CONFIGURATION DES ESPACEMENTS (Ajustable ici) ---
    const TITLE_Y = 100; // Position du titre
    const LIST_START_Y = 240; // Où commence la liste (bien plus bas pour éviter le titre)
    const LIST_BOTTOM_Y = height - 120; // Où s'arrête la liste avant le bouton reset
    const VIEW_HEIGHT = LIST_BOTTOM_Y - LIST_START_Y;

    // --- 2. FOND ---
    this.cameras.main.setBackgroundColor("#05050a");
    if (this.textures.exists("background_main")) {
      const bg = this.add.image(cx, height / 2, "background_main");
      const scale = Math.max(width / bg.width, height / bg.height);
      bg.setScale(scale).setAlpha(0.2).setScrollFactor(0);
    }

    // --- 3. TITRE FIXE (Anglais - LAST OUTPOST) ---
    const title = this.add
      .text(cx, TITLE_Y, "LAST OUTPOST", {
        fontFamily: "Impact, sans-serif",
        fontSize: `${Math.max(45, width * 0.08)}px`,
        color: "#ffffff",
        letterSpacing: 8,
      })
      .setOrigin(0.5)
      .setDepth(100);
    title.setShadow(0, 5, "#00f2ff", 15, true, true);

    // --- 4. GESTION DE LA LISTE SCROLLABLE ---
    // On crée un conteneur pour les niveaux
    this.levelContainer = this.add.container(cx, LIST_START_Y);

    const levelReached = parseInt(localStorage.getItem("levelReached")) || 1;
    let currentY = 50; // On commence à 50 pour que le 1er bouton ne soit pas collé au bord du masque
    const spacing = 120;

    LEVELS_CONFIG.forEach((level) => {
      const isLocked = level.id > levelReached;
      const card = this.createLevelCard(0, currentY, level, isLocked);
      this.levelContainer.add(card);
      currentY += spacing;
    });

    const totalContentHeight = currentY;

    // --- 5. CRÉATION DU MASQUE ---
    // Le masque définit la zone "fenêtre" où les boutons sont visibles
    const maskShape = this.make.graphics();
    maskShape.fillStyle(0xffffff);
    // On dessine le rectangle de visibilité
    maskShape.fillRect(0, LIST_START_Y, width, VIEW_HEIGHT);
    const mask = maskShape.createGeometryMask();
    this.levelContainer.setMask(mask);

    // --- 6. LOGIQUE DE SCROLL (LIMITES STRICTES) ---
    const limitTop = LIST_START_Y;
    const limitBottom =
      totalContentHeight > VIEW_HEIGHT
        ? LIST_START_Y - (totalContentHeight - VIEW_HEIGHT)
        : LIST_START_Y;

    // Interaction Molette
    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
      this.levelContainer.y -= deltaY;
      this.clampScroll(limitTop, limitBottom);
    });

    // Interaction Drag (Tactile/Souris)
    let dragY = 0;
    this.input.on("pointerdown", (p) => {
      dragY = this.levelContainer.y - p.y;
    });
    this.input.on("pointermove", (p) => {
      if (p.isDown) {
        this.levelContainer.y = p.y + dragY;
        this.clampScroll(limitTop, limitBottom);
      }
    });

    // --- 7. BOUTON RÉINITIALISER (Bas de page) ---
    this.createResetButton(height - 50);
  }

  clampScroll(top, bottom) {
    if (this.levelContainer.y > top) this.levelContainer.y = top;
    if (this.levelContainer.y < bottom) this.levelContainer.y = bottom;
  }

  createLevelCard(x, y, level, isLocked) {
    const cardWidth = Math.min(this.scale.width * 0.85, 500);
    const cardHeight = 100;
    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    const draw = (over = false) => {
      bg.clear();
      bg.fillStyle(isLocked ? 0x1a1a1a : over ? 0x004488 : 0x002244, 0.8);
      bg.lineStyle(2, isLocked ? 0x333333 : over ? 0x00f2ff : 0x0088ff, 1);
      bg.fillRoundedRect(
        -cardWidth / 2,
        -cardHeight / 2,
        cardWidth,
        cardHeight,
        8
      );
      bg.strokeRoundedRect(
        -cardWidth / 2,
        -cardHeight / 2,
        cardWidth,
        cardHeight,
        8
      );
    };
    draw();

    const title = this.add.text(
      -cardWidth / 2 + 20,
      -20,
      `NIVEAU ${level.id}`,
      {
        fontSize: "18px",
        fontWeight: "bold",
        color: isLocked ? "#666" : "#00ccff",
        fontFamily: "Arial",
      }
    );

    const name = this.add.text(
      -cardWidth / 2 + 20,
      5,
      level.name.toUpperCase(),
      {
        fontSize: "22px",
        fontWeight: "900",
        color: isLocked ? "#444" : "#fff",
        fontFamily: "Arial",
      }
    );

    container.add([bg, title, name]);

    if (!isLocked) {
      const zone = this.add
        .zone(0, 0, cardWidth, cardHeight)
        .setInteractive({ useHandCursor: true });
      container.add(zone);
      zone.on("pointerover", () => {
        draw(true);
        container.setScale(1.02);
      });
      zone.on("pointerout", () => {
        draw(false);
        container.setScale(1);
      });
      zone.on("pointerdown", () =>
        this.scene.start("GameScene", { level: level.id })
      );
    }

    return container;
  }

  createResetButton(y) {
    const btn = this.add
      .text(this.scale.width / 2, y, "RÉINITIALISER LA PROGRESSION", {
        fontSize: "14px",
        color: "#555",
        fontFamily: "Arial",
        textDecoration: "underline",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(100);

    btn.on("pointerover", () => btn.setColor("#ff0000"));
    btn.on("pointerout", () => btn.setColor("#555"));
    btn.on("pointerdown", () => {
      if (confirm("Voulez-vous vraiment effacer votre progression ?")) {
        localStorage.clear();
        this.scene.restart();
      }
    });
  }

  createAtmosphere() {
    // Particules simples pour le style
    if (!this.textures.exists("p")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffffff).fillCircle(2, 2, 2).generateTexture("p", 4, 4);
    }
    this.add.particles(0, 0, "p", {
      x: { min: 0, max: this.scale.width },
      y: { min: 0, max: this.scale.height },
      alpha: { start: 0.2, end: 0 },
      scale: { start: 0.5, end: 0 },
      speedY: { min: -10, max: -2 },
      lifespan: 3000,
    });
  }
}
