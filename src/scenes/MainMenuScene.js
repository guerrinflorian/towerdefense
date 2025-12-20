import { LEVELS_CONFIG } from "../config/levels/index.js";
import { ensureProfileLoaded, getUnlockedLevel, logout, isAuthenticated, getHeroStats } from "../services/authManager.js";
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
    const padding = 40;

    // --- 1. AMBIANCE & FOND ---
    this.addBackground(cx, height);
    
    // --- 2. TITRE PRINCIPAL ---
    this.addTitle(cx);

    // --- 3. COLONNE GAUCHE : HERO PANEL ---
    this.heroPanel = new HeroUpgradeUI(this, padding, height * 0.3);

    // --- 4. COLONNE DROITE : LEADERBOARD ---
    const lbWidth = 500; 
    this.leaderboard = new LeaderboardUI(this, width - lbWidth - padding, height * 0.15);

    // --- 5. COLONNE CENTRALE : LISTE DES NIVEAUX ---
    this.createLevelList(cx, height);
    
    // --- 6. PIED DE PAGE : DÉCONNEXION ---
    this.createLogoutButton(height - 40);

    // --- 7. GESTION DES ÉVÉNEMENTS ---
    this.setupEventListeners();

    // Chargement initial des données
    ensureProfileLoaded().then(() => {
      if (this.heroPanel) this.heroPanel.refresh();
    });
  }

  addBackground(cx, height) {
    this.cameras.main.setBackgroundColor("#020508");
    
    if (this.textures.exists("background")) {
      const bg = this.add.image(cx, height / 2, "background");
      bg.setScrollFactor(0);
      bg.setDepth(-1);
      
      const scaleX = this.scale.width / bg.width;
      const scaleY = this.scale.height / bg.height;
      const scale = Math.max(scaleX, scaleY);
      bg.setScale(scale);
      bg.setTint(0x888888);
    }
  }

  addTitle(cx) {
    const title = this.add.text(cx, 60, "LAST OUTPOST", {
      fontFamily: "Impact, sans-serif",
      fontSize: "64px",
      color: "#ffffff",
      letterSpacing: 12
    }).setOrigin(0.5).setShadow(0, 0, "#00f2ff", 20, true, true);
    
    const line = this.add.graphics();
    line.lineStyle(2, 0x00f2ff, 0.5);
    line.lineBetween(cx - 200, 100, cx + 200, 100);
  }

  createLevelList(cx, height) {
    const startY = 180;
    const bottomMargin = 80; // Espace pour le bouton de déconnexion
    const availableHeight = height - startY - bottomMargin;
    const cardSpacing = 110;
    const cardHeight = 90;

    this.levelContainer = this.add.container(cx, startY);

    let currentY = 0;
    const levelReached = getUnlockedLevel();

    // Créer toutes les cartes de niveau
    LEVELS_CONFIG.forEach((level) => {
      const isLocked = level.id > levelReached;
      const card = this.createLevelCard(0, currentY, level, isLocked);
      this.levelContainer.add(card);
      currentY += cardSpacing;
    });

    // Calculer la hauteur totale du contenu
    const totalContentHeight = LEVELS_CONFIG.length * cardSpacing;
    
    // Déterminer si le scroll est nécessaire
    const needsScroll = totalContentHeight > availableHeight;

    if (needsScroll) {
      // Activer le masque et le scroll uniquement si nécessaire
      const maskShape = this.make.graphics();
      maskShape.fillStyle(0xffffff);
      maskShape.fillRect(cx - 250, startY, 500, availableHeight);
      this.levelContainer.setMask(maskShape.createGeometryMask());

      this.setupScrollLogic(startY, totalContentHeight, availableHeight);
      
      // Ajouter des indicateurs visuels de scroll
      this.addScrollIndicators(cx, startY, availableHeight, totalContentHeight);
    } else {
      // Pas de scroll nécessaire - centrer verticalement le contenu
      const verticalOffset = (availableHeight - totalContentHeight) / 2;
      this.levelContainer.y = startY + verticalOffset;
    }
  }

  createLevelCard(x, y, level, isLocked) {
    const container = this.add.container(x, y);
    const cardWidth = 400;
    const cardHeight = 90;
    
    const bg = this.add.graphics();
    const drawBg = (over = false) => {
      bg.clear();
      const fillColor = isLocked ? 0x111111 : (over ? 0x003366 : 0x050a15);
      const strokeColor = isLocked ? 0x333333 : (over ? 0x00f2ff : 0x0088ff);
      
      bg.fillStyle(fillColor, 0.9);
      bg.lineStyle(2, strokeColor, 1);
      bg.fillRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 10);
      bg.strokeRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 10);
    };
    
    drawBg();

    const title = this.add.text(-cardWidth/2 + 25, -22, `MISSION ${level.id.toString().padStart(2, '0')}`, {
      fontSize: "14px",
      fontFamily: "Orbitron, sans-serif",
      color: isLocked ? "#555" : "#00ccff"
    });

    const name = this.add.text(-cardWidth/2 + 25, 2, level.name.toUpperCase(), {
      fontSize: "22px",
      fontFamily: "Impact, sans-serif",
      color: isLocked ? "#333" : "#fff"
    });

    container.add([bg, title, name]);

    if (!isLocked) {
      const zone = this.add.zone(0, 0, cardWidth, cardHeight).setInteractive({ useHandCursor: true });
      zone.on("pointerover", () => { drawBg(true); container.setScale(1.03); });
      zone.on("pointerout", () => { drawBg(false); container.setScale(1); });
      zone.on("pointerdown", () => {
        if (!isAuthenticated()) return showAuth();
        this.scene.start("GameScene", { level: level.id, heroStats: getHeroStats() });
      });
      container.add(zone);
    } else {
      const lockIcon = this.add.text(cardWidth/2 - 40, 0, "🔒", { fontSize: "20px" }).setOrigin(0.5);
      container.add(lockIcon);
    }

    return container;
  }

  setupScrollLogic(startY, totalContentHeight, viewHeight) {
    const bottomLimit = startY - (totalContentHeight - viewHeight);
    let isScrolling = false;
    
    // Gestion de la molette
    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
      const newY = Phaser.Math.Clamp(
        this.levelContainer.y - deltaY * 0.5, 
        bottomLimit, 
        startY
      );
      this.levelContainer.y = newY;
      this.updateScrollIndicators(startY, bottomLimit);
    });

    // Support du drag tactile/souris
    let dragStartY = 0;
    let containerStartY = 0;

    this.input.on("pointerdown", (pointer) => {
      // Vérifier si le pointeur est dans la zone de scroll
      const cx = this.scale.width / 2;
      if (pointer.x > cx - 250 && pointer.x < cx + 250) {
        isScrolling = true;
        dragStartY = pointer.y;
        containerStartY = this.levelContainer.y;
      }
    });

    this.input.on("pointermove", (pointer) => {
      if (isScrolling && pointer.isDown) {
        const deltaY = pointer.y - dragStartY;
        const newY = Phaser.Math.Clamp(
          containerStartY + deltaY,
          bottomLimit,
          startY
        );
        this.levelContainer.y = newY;
        this.updateScrollIndicators(startY, bottomLimit);
      }
    });

    this.input.on("pointerup", () => {
      isScrolling = false;
    });
  }

  addScrollIndicators(cx, startY, viewHeight, totalHeight) {
    // Indicateur en haut
    this.scrollTopIndicator = this.add.triangle(
      cx, startY - 10, 
      0, 10, 10, 0, -10, 0, 
      0x00f2ff, 0.5
    ).setOrigin(0.5);

    // Indicateur en bas
    this.scrollBottomIndicator = this.add.triangle(
      cx, startY + viewHeight + 10,
      0, 0, 10, 10, -10, 10,
      0x00f2ff, 0.5
    ).setOrigin(0.5);

    // Masquer l'indicateur du haut au départ (on est en haut)
    this.scrollTopIndicator.setVisible(false);
  }

  updateScrollIndicators(topLimit, bottomLimit) {
    if (!this.scrollTopIndicator || !this.scrollBottomIndicator) return;

    // Afficher/masquer les indicateurs selon la position
    const atTop = this.levelContainer.y >= topLimit - 5;
    const atBottom = this.levelContainer.y <= bottomLimit + 5;

    this.scrollTopIndicator.setVisible(!atTop);
    this.scrollBottomIndicator.setVisible(!atBottom);

    // Animation de pulsation
    if (this.scrollTopIndicator.visible) {
      this.tweens.add({
        targets: this.scrollTopIndicator,
        alpha: 0.3,
        duration: 800,
        yoyo: true,
        repeat: -1
      });
    }

    if (this.scrollBottomIndicator.visible) {
      this.tweens.add({
        targets: this.scrollBottomIndicator,
        alpha: 0.3,
        duration: 800,
        yoyo: true,
        repeat: -1
      });
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
    this.profileUpdatedHandler = () => this.scene.restart();
    window.addEventListener("auth:profile-updated", this.profileUpdatedHandler);

    this.events.once("shutdown", () => {
      window.removeEventListener("auth:profile-updated", this.profileUpdatedHandler);
    });
  }
}