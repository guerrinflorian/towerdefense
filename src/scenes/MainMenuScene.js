import { ensureProfileLoaded, logout } from "../services/authManager.js";
import { showAuth } from "../services/authOverlay.js";
import { LeaderboardUI } from "./components/LeaderboardUI.js";
import { HeroUpgradeUI } from "./components/HeroUpgradeUI.js";

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenuScene");
  }

  preload() {
    const backgroundUrl = new URL("../images/background.jpg", import.meta.url).href;
    this.load.image("background", backgroundUrl);
  }

  create() {
    const { width, height } = this.scale;
    const cx = width / 2;
    const padding = 40; // Marge identique pour la gauche et la droite

    // --- 1. AMBIANCE & FOND ---
    this.addBackground(cx, height);
    
    // --- 2. TITRE PRINCIPAL ---
    const title = this.add.text(cx, height * 0.3, "LAST OUTPOST", {
      fontFamily: "Impact, sans-serif",
      fontSize: "82px",
      color: "#ffffff",
    }).setOrigin(0.5).setShadow(0, 0, "#00f2ff", 30, true, true);

    // --- 3. BOUTON DÉPLOYER (CENTRE) ---
    this.createPlayButton(cx, height * 0.55);

    // --- 4. COMPOSANTS INTERFACE ---
    
    // À GAUCHE : Amélioration du Héros
    this.heroPanel = new HeroUpgradeUI(this, padding, height * 0.25);

    // À DROITE : Leaderboard (Fixé pour ne plus être coupé)
    // Largeur du leaderboard = 460. Position = Largeur totale - Largeur composant - Marge
    const leaderboardWidth = 460;
    const lbX = width - leaderboardWidth - padding;
    this.leaderboard = new LeaderboardUI(this, lbX, height * 0.15);

    // --- 5. PIED DE PAGE ---
    this.createLogoutButton(height - 40);

    // --- 6. ÉVÉNEMENTS ---
    this.setupEventListeners();

    // Initialisation
    ensureProfileLoaded().then(() => {
      if (this.heroPanel) this.heroPanel.refresh();
    });
  }

  createPlayButton(x, y) {
    const playBtn = this.add.container(x, y);
    const bg = this.add.graphics();
    const btnW = 300;
    const btnH = 80;

    const drawBtn = (isOver) => {
      bg.clear();
      bg.fillStyle(0x00f2ff, isOver ? 0.4 : 0.2);
      bg.lineStyle(3, 0x00f2ff, 1);
      bg.fillRoundedRect(-btnW/2, -btnH/2, btnW, btnH, 10);
      bg.strokeRoundedRect(-btnW/2, -btnH/2, btnW, btnH, 10);
    };

    drawBtn(false);

    const txt = this.add.text(0, 0, "DÉPLOYER", {
      fontSize: "32px",
      fontFamily: "Orbitron, sans-serif",
      color: "#fff",
      fontWeight: "bold",
      letterSpacing: 4
    }).setOrigin(0.5);

    playBtn.add([bg, txt]);
    playBtn.setInteractive(new Phaser.Geom.Rectangle(-btnW/2, -btnH/2, btnW, btnH), Phaser.Geom.Rectangle.Contains);
    
    playBtn.on("pointerover", () => { drawBtn(true); playBtn.setScale(1.05); });
    playBtn.on("pointerout", () => { drawBtn(false); playBtn.setScale(1); });
    playBtn.on("pointerdown", () => this.scene.start("MapScene"));
  }

  addBackground(cx, height) {
    this.cameras.main.setBackgroundColor("#020508");
    if (this.textures.exists("background")) {
      const bg = this.add.image(cx, height / 2, "background")
        .setDepth(-1)
        .setScrollFactor(0)
        .setTint(0x333333); // Un peu plus sombre pour faire ressortir l'UI
      const scale = Math.max(this.scale.width / bg.width, this.scale.height / bg.height);
      bg.setScale(scale);
    }
  }

  createLogoutButton(y) {
    const btn = this.add.text(this.scale.width / 2, y, "DÉCONNEXION DU SYSTÈME", {
      fontSize: "12px",
      fontFamily: "Orbitron, sans-serif",
      color: "#666",
      letterSpacing: 2
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => btn.setColor("#ff4d4d"));
    btn.on("pointerout", () => btn.setColor("#666"));
    btn.on("pointerdown", () => {
      logout();
      this.scene.restart();
      showAuth();
    });
  }

  setupEventListeners() {
    this.profileUpdatedHandler = () => {
      if (this.heroPanel) this.heroPanel.refresh();
    };
    window.addEventListener("auth:profile-updated", this.profileUpdatedHandler);
    this.events.once("shutdown", () => {
      window.removeEventListener("auth:profile-updated", this.profileUpdatedHandler);
    });
  }
}