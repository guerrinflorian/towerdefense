import { CONFIG } from "../config/settings.js";
import { LEVELS_CONFIG } from "../config/levels/index.js";

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenuScene");
  }

  shutdown() {
    // Rendre shutdown() idempotent : safe si appelé plusieurs fois
    
    // Nettoyer tous les événements et objets avant de redémarrer
    try {
      if (this.children && this.children.removeAll) {
        this.children.removeAll(true);
      }
    } catch (e) {
      // Ignorer si déjà détruit
    }
    
    try {
      if (this.input && this.input.removeAllListeners) {
        this.input.removeAllListeners();
      }
    } catch (e) {
      // Ignorer si déjà détruit
    }
    
    try {
      if (this.tweens && this.tweens.killAll) {
        this.tweens.killAll();
      }
    } catch (e) {
      // Ignorer si déjà détruit
    }
    
    try {
      if (this.time && this.time.removeAllEvents) {
        this.time.removeAllEvents();
      }
    } catch (e) {
      // Ignorer si déjà détruit
    }
  }

  preload() {
    // Chargement de l'image de fond
    // Assure-toi que le fichier existe bien dans ce dossier !
    try {
      this.load.image("background_main", "../../src/images/backg.jpg");
    } catch (e) {
      console.warn("Image background_main non trouvée, utilisation d'un fond de couleur");
    }
  }

  create() {
    // Obtenir les dimensions réelles et le scale
    this.gameWidth = this.scale.width;
    this.gameHeight = this.scale.height;
    this.scaleFactor = this.game.scaleFactor || 1;
    this.baseWidth = this.game.baseWidth || CONFIG.GAME_WIDTH;
    this.baseHeight = this.game.baseHeight || CONFIG.GAME_HEIGHT;
    
    const cx = this.gameWidth / 2;
    const cy = this.gameHeight / 2;

    // --- 1. FOND D'ÉCRAN ---
    // On met une couleur de fond de secours si l'image ne charge pas
    this.cameras.main.setBackgroundColor("#0f0f1a");

    // Ajout de l'image
    // On vérifie si la texture existe pour éviter un crash si tu as oublié le fichier
    if (this.textures.exists("background_main")) {
      const bg = this.add.image(cx, cy, "background_main");

      // Technique pour faire "cover" (remplir l'écran sans déformer)
      const scaleX = this.gameWidth / bg.width;
      const scaleY = this.gameHeight / bg.height;
      const scale = Math.max(scaleX, scaleY);
      bg.setScale(scale).setScrollFactor(0);
    }

    // --- 2. OVERLAY SOMBRE ---
    // Ajoute un voile noir semi-transparent pour la lisibilité du texte
    this.add
      .rectangle(0, 0, this.gameWidth, this.gameHeight, 0x000000, 0.6)
      .setOrigin(0, 0);

    // --- 3. PARTICLES D'AMBIANCE ---
    this.createAtmosphere();

    // --- 4. TITRE ---
    const titleSize = Math.max(40, 90 * this.scaleFactor);
    const title = this.add
      .text(cx, 150 * this.scaleFactor, "LAST OUTPOST", {
        fontSize: `${titleSize}px`,
        fontFamily: "Impact, Arial", // Police plus lourde
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8 * this.scaleFactor,
        shadow: {
          offsetX: 0,
          offsetY: 10 * this.scaleFactor,
          color: "#000000",
          blur: 20 * this.scaleFactor,
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

    let yPos = 400 * this.scaleFactor;
    LEVELS_CONFIG.forEach((level) => {
      const isLocked = level.id > levelReached;
      this.createLevelButton(level, yPos, isLocked);
      yPos += 120 * this.scaleFactor; // Plus d'espace entre les boutons
    });

    // --- 6. BOUTON RESET (Discret en bas) ---
    const resetBtn = this.add
      .text(cx, this.gameHeight - 60 * this.scaleFactor, "RÉINITIALISER LA PROGRESSION", {
        fontSize: `${Math.max(12, 14 * this.scaleFactor)}px`,
        fontFamily: "Arial",
        color: "#666666",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    resetBtn.on("pointerover", () => {
      if (resetBtn && resetBtn.active !== false) {
        try {
          resetBtn.setColor("#ff4444");
        } catch (e) {
          // Ignorer si le bouton est détruit
        }
      }
    });
    resetBtn.on("pointerout", () => {
      if (resetBtn && resetBtn.active !== false) {
        try {
          resetBtn.setColor("#666666");
        } catch (e) {
          // Ignorer si le bouton est détruit
        }
      }
    });
    resetBtn.on("pointerdown", () => {
      if (confirm("Voulez-vous vraiment effacer votre progression ?")) {
        localStorage.clear();
        this.scene.restart();
      }
    });
  }

  createAtmosphere() {
    // Création d'une texture de particule à la volée (petit rond flou)
    // Ne pas regénérer si elle existe déjà
    if (!this.textures || !this.make) {
      console.warn("Système de textures non disponible pour createAtmosphere");
      return;
    }
    
    if (!this.textures.exists("particle_dot")) {
      try {
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        if (!g || !g.fillStyle || !g.generateTexture) {
          console.warn("Impossible de créer l'objet Graphics pour particle_dot");
          return;
        }
        g.fillStyle(0xffffff, 1);
        g.fillCircle(4, 4, 4);
        g.generateTexture("particle_dot", 8, 8);
        // Nettoyer l'objet Graphics après utilisation
        if (g && g.destroy) {
          try {
            g.destroy();
          } catch (e) {
            // Ignorer si déjà détruit
          }
        }
      } catch (e) {
        console.warn("Erreur lors de la création de particle_dot:", e);
      }
    }

    const particles = this.add.particles(0, 0, "particle_dot", {
      x: { min: 0, max: this.gameWidth },
      y: { min: 0, max: this.gameHeight },
      lifespan: 4000,
      speedY: { min: -10, max: -30 }, // Monte doucement
      scale: { start: 0.2, end: 0 },
      quantity: 2,
      alpha: { start: 0.3, end: 0 },
      blendMode: "ADD",
    });
  }

  createLevelButton(level, y, isLocked) {
    const w = 500 * this.scaleFactor;
    const h = 90 * this.scaleFactor;
    const x = this.gameWidth / 2;

    const container = this.add.container(x, y);

    // --- Design du Bouton ---
    const bg = this.add.graphics();

    // Fonction pour dessiner le bouton (état normal)
    const drawButton = (color, alpha, strokeColor) => {
      if (bg && bg.active !== false) {
        try {
          bg.clear();
          bg.fillStyle(color, alpha);
          // Forme biseautée ou arrondie
          bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
          bg.lineStyle(3, strokeColor, 1);
          bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
        } catch (e) {
          console.warn("Erreur lors du dessin du bouton:", e);
        }
      }
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
      .text(0, -15 * this.scaleFactor, level.name.toUpperCase(), {
        fontSize: `${Math.max(20, 32 * this.scaleFactor)}px`,
        fontFamily: "Arial",
        fontStyle: "bold",
        color: isLocked ? "#666" : "#fff",
      })
      .setOrigin(0.5);

    // Sous-titre (En bas)
    const subTxt = this.add
      .text(0, 20 * this.scaleFactor, labelText, {
        fontSize: `${Math.max(12, 16 * this.scaleFactor)}px`,
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
        if (bg && bg.active !== false) {
          drawButton(0x0055aa, 0.9, 0xffffff);
        }
        if (container && container.active !== false) {
          this.tweens.add({
            targets: container,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 100,
            ease: "Sine.easeOut",
          });
        }
        if (subTxt && subTxt.active !== false) {
          try {
            subTxt.setColor("#ffffff");
          } catch (e) {
            // Ignorer si le texte est détruit
          }
        }
      });

      zone.on("pointerout", () => {
        // Retour normal
        if (bg && bg.active !== false) {
          drawButton(baseColor, baseAlpha, strokeColor);
        }
        if (container && container.active !== false) {
          this.tweens.add({
            targets: container,
            scaleX: 1,
            scaleY: 1,
            duration: 100,
            ease: "Sine.easeOut",
          });
        }
        if (subTxt && subTxt.active !== false) {
          try {
            subTxt.setColor("#00ccff");
          } catch (e) {
            // Ignorer si le texte est détruit
          }
        }
      });

      zone.on("pointerdown", () => {
        // Effet clic puis changement de scène
        if (container && container.active !== false) {
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
        } else {
          // Si le container est détruit, changer directement de scène
          this.scene.start("GameScene", { level: level.id });
        }
      });
    }
  }
}
