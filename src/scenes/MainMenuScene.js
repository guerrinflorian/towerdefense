import { CONFIG } from "../config/settings.js";
import { LEVELS_CONFIG } from "../config/levels/index.js";

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenuScene");
  }

  preload() {
    // Chargement de l'image de fond
    // Assure-toi que le fichier existe bien dans ce dossier !
    this.load.image("background_main", "../../src/images/backg.jpg");
  }

  create() {
    const cx = CONFIG.GAME_WIDTH / 2;
    const cy = CONFIG.GAME_HEIGHT / 2;

    // --- 1. FOND D'ÉCRAN ---
    // On met une couleur de fond de secours si l'image ne charge pas
    this.cameras.main.setBackgroundColor("#0f0f1a");

    // Ajout de l'image
    // On vérifie si la texture existe pour éviter un crash si tu as oublié le fichier
    if (this.textures.exists("background_main")) {
      const bg = this.add.image(cx, cy, "background_main");

      // Technique pour faire "cover" (remplir l'écran sans déformer)
      const scaleX = CONFIG.GAME_WIDTH / bg.width;
      const scaleY = CONFIG.GAME_HEIGHT / bg.height;
      const scale = Math.max(scaleX, scaleY);
      bg.setScale(scale).setScrollFactor(0);
    }

    // --- 2. OVERLAY SOMBRE ---
    // Ajoute un voile noir semi-transparent pour la lisibilité du texte
    this.add
      .rectangle(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT, 0x000000, 0.6)
      .setOrigin(0, 0);

    // --- 3. PARTICLES D'AMBIANCE ---
    this.createAtmosphere();

    // --- 4. TITRE ---
    const title = this.add
      .text(cx, 150, "LAST OUTPOST", {
        fontSize: "90px",
        fontFamily: "Impact, Arial", // Police plus lourde
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        shadow: {
          offsetX: 0,
          offsetY: 10,
          color: "#000000",
          blur: 20,
          stroke: true,
          fill: true,
        },
      })
      .setOrigin(0.5);

    // Animation de "respiration" du titre
    this.tweens.add({
      targets: title,
      scale: 1.05,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // --- 5. BOUTONS DE NIVEAUX ---
    // Récupérer la progression
    const levelReached = parseInt(localStorage.getItem("levelReached")) || 1;

    let yPos = 400;
    LEVELS_CONFIG.forEach((level) => {
      const isLocked = level.id > levelReached;
      this.createLevelButton(level, yPos, isLocked);
      yPos += 120; // Plus d'espace entre les boutons
    });

    // --- 6. BOUTON RESET (Discret en bas) ---
    const resetBtn = this.add
      .text(cx, CONFIG.GAME_HEIGHT - 60, "RÉINITIALISER LA PROGRESSION", {
        fontSize: "14px",
        fontFamily: "Arial",
        color: "#666666",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    resetBtn.on("pointerover", () => resetBtn.setColor("#ff4444"));
    resetBtn.on("pointerout", () => resetBtn.setColor("#666666"));
    resetBtn.on("pointerdown", () => {
      if (confirm("Voulez-vous vraiment effacer votre progression ?")) {
        localStorage.clear();
        this.scene.restart();
      }
    });
  }

  createAtmosphere() {
    // Création d'une texture de particule à la volée (petit rond flou)
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xffffff, 1);
    g.fillCircle(4, 4, 4);
    g.generateTexture("particle_dot", 8, 8);

    const particles = this.add.particles(0, 0, "particle_dot", {
      x: { min: 0, max: CONFIG.GAME_WIDTH },
      y: { min: 0, max: CONFIG.GAME_HEIGHT },
      lifespan: 4000,
      speedY: { min: -10, max: -30 }, // Monte doucement
      scale: { start: 0.2, end: 0 },
      quantity: 2,
      alpha: { start: 0.3, end: 0 },
      blendMode: "ADD",
    });
  }

  createLevelButton(level, y, isLocked) {
    const w = 500;
    const h = 90;
    const x = CONFIG.GAME_WIDTH / 2;

    const container = this.add.container(x, y);

    // --- Design du Bouton ---
    const bg = this.add.graphics();

    // Fonction pour dessiner le bouton (état normal)
    const drawButton = (color, alpha, strokeColor) => {
      bg.clear();
      bg.fillStyle(color, alpha);
      // Forme biseautée ou arrondie
      bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
      bg.lineStyle(3, strokeColor, 1);
      bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
    };

    // État initial
    const baseColor = isLocked ? 0x111111 : 0x004488;
    const strokeColor = isLocked ? 0x333333 : 0x0088ff;
    const baseAlpha = isLocked ? 0.5 : 0.8;

    drawButton(baseColor, baseAlpha, strokeColor);

    // --- Texte ---
    const labelText = isLocked ? `🔒 VÉRROUILLÉ` : `JOUER`;

    // Nom du niveau (En haut)
    const titleTxt = this.add
      .text(0, -15, level.name.toUpperCase(), {
        fontSize: "32px",
        fontFamily: "Arial",
        fontStyle: "bold",
        color: isLocked ? "#666" : "#fff",
      })
      .setOrigin(0.5);

    // Sous-titre (En bas)
    const subTxt = this.add
      .text(0, 20, labelText, {
        fontSize: "16px",
        fontFamily: "Arial",
        color: isLocked ? "#444" : "#00ccff", // Bleu néon si débloqué
      })
      .setOrigin(0.5);

    container.add([bg, titleTxt, subTxt]);

    // --- Interaction ---
    if (!isLocked) {
      const zone = this.add
        .zone(0, 0, w, h)
        .setInteractive({ useHandCursor: true });
      container.add(zone);

      zone.on("pointerover", () => {
        // Effet Survol : Plus clair, bordure blanche, grossissement
        drawButton(0x0055aa, 0.9, 0xffffff);
        this.tweens.add({
          targets: container,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 100,
          ease: "Sine.easeOut",
        });
        subTxt.setColor("#ffffff");
      });

      zone.on("pointerout", () => {
        // Retour normal
        drawButton(baseColor, baseAlpha, strokeColor);
        this.tweens.add({
          targets: container,
          scaleX: 1,
          scaleY: 1,
          duration: 100,
          ease: "Sine.easeOut",
        });
        subTxt.setColor("#00ccff");
      });

      zone.on("pointerdown", () => {
        // Effet clic
        this.tweens.add({
          targets: container,
          scaleX: 0.95,
          scaleY: 0.95,
          duration: 50,
          yoyo: true,
          onComplete: () => {
            this.scene.start("GameScene", { level: level.id });
          },
        });
      });
    }
  }
}
