<template>
  <!-- Scene rendered via Phaser; component placeholder for Vue tooling -->
  <div class="scene-wrapper" aria-hidden="true"></div>
</template>

<script>
import { ensureProfileLoaded, logout, getProfile, isAuthenticated } from "../services/authManager.js";
import { showAuth } from "../services/authOverlay.js";
import { LeaderboardUI } from "./components/LeaderboardUI.js";
import { showHeroUpgrade } from "../vue/bridge.js";
import { fetchAchievements } from "../services/achievementsService.js";
import { showAchievements } from "../vue/bridge.js";

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
    this.titleText = this.add.text(cx, height * 0.3, "LAST OUTPOST", {
      fontFamily: "Impact, sans-serif",
      fontSize: "82px",
      color: "#ffffff",
    }).setOrigin(0.5).setShadow(0, 0, "#00f2ff", 30, true, true);

    // --- 3. NOM DE L'UTILISATEUR CONNECTÉ ---
    this.userDisplayText = null;
    this.createUserDisplay(cx, height * 0.15);

    // --- 4. BOUTON DÉPLOYER (CENTRE) ---
    this.createPlayButton(cx, height * 0.55);

    // --- 5. COMPOSANTS INTERFACE ---
    
    // À GAUCHE : Bouton pour ouvrir le panneau d'amélioration du Héros (Vue)
    this.createHeroUpgradeButton(padding, height * 0.25);
    this.createAchievementsButton();

    // À DROITE : Leaderboard
    // Largeur du leaderboard = 540 (selon sa config)
    const leaderboardWidth = 540;
    // Position = Largeur totale - Largeur composant - Marge droite
    const lbX = width - leaderboardWidth - padding;
    // S'assurer que le leaderboard ne dépasse pas de l'écran (au moins padding à droite)
    const safeLbX = Math.max(padding, lbX);
    this.leaderboard = new LeaderboardUI(this, safeLbX, height * 0.15);

    // --- 6. PIED DE PAGE ---
    this.createLogoutButton(height - 40);

    // --- 7. ÉVÉNEMENTS ---
    this.setupEventListeners();

    this.applyResponsiveLayout();
    this.scale.on("resize", this.applyResponsiveLayout, this);
    this.events.once("shutdown", async () => {
      this.scale.off("resize", this.applyResponsiveLayout, this);
      // Forcer l'envoi des améliorations en attente avant de quitter la scène
      const { flushPendingUpgrades } = await import("../services/authManager.js");
      await flushPendingUpgrades();
    });

    // Initialisation
    ensureProfileLoaded().then(() => {
      this.refreshAchievementsSummary();
      this.updateHeroName();
      // Mettre à jour le nom d'utilisateur après chargement du profil
      if (this.userDisplayText) {
        const profile = getProfile();
        const username = profile?.player?.username || "Invité";
        this.userDisplayText.setText(`CONNECTÉ EN TANT QUE : ${username.toUpperCase()}`);
      }
    });
    
    // Écouter les changements de héros
    window.addEventListener("hero:selected", () => {
      this.updateHeroName();
    });
  }

  createUserDisplay(cx, y) {
    const profile = getProfile();
    const username = profile?.player?.username || "Invité";
    
    this.userDisplayText = this.add.text(cx, y, `CONNECTÉ EN TANT QUE : ${username.toUpperCase()}`, {
      fontSize: "16px",
      fontFamily: "Orbitron, sans-serif",
      color: "#00f2ff",
      letterSpacing: 2
    }).setOrigin(0.5).setShadow(0, 0, "#00f2ff", 10, true, true);
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
    playBtn.baseScale = 1;
    playBtn.setInteractive(new Phaser.Geom.Rectangle(-btnW/2, -btnH/2, btnW, btnH), Phaser.Geom.Rectangle.Contains);
    
    playBtn.on("pointerover", () => { drawBtn(true); playBtn.setScale(playBtn.baseScale * 1.05); });
    playBtn.on("pointerout", () => { drawBtn(false); playBtn.setScale(playBtn.baseScale); });
    playBtn.on("pointerdown", () => this.scene.start("ChapterScene", { fromMainMenu: true }));

    this.playButton = playBtn;
  }

  createHeroUpgradeButton(x, y) {
    const width = 420;
    const btnHeight = 90;
    
    const container = this.add.container(x, y);
    const bg = this.add.graphics();
    const glowBg = this.add.graphics(); // Pour l'effet de lueur au hover
  
    const draw = (hover) => {
      bg.clear();
      glowBg.clear();
      
      if (hover) {
        // Effet de lueur externe
        glowBg.fillStyle(0x00f2ff, 0.15);
        glowBg.fillRoundedRect(-4, -4, width + 8, btnHeight + 8, 16);
        
        // Bordure et fond au hover
        bg.lineStyle(4, 0x00f2ff, 1);
        bg.fillStyle(0x1a2639, 1);
        bg.fillRoundedRect(0, 0, width, btnHeight, 14);
        bg.strokeRoundedRect(0, 0, width, btnHeight, 14);
        
        // Ligne d'accentuation interne
        bg.lineStyle(1, 0x00eaff, 0.4);
        bg.strokeRoundedRect(2, 2, width - 4, btnHeight - 4, 12);
      } else {
        // Style normal
        bg.lineStyle(2, 0x334155, 0.8);
        bg.fillStyle(0x0e1624, 0.95);
        bg.fillRoundedRect(0, 0, width, btnHeight, 14);
        bg.strokeRoundedRect(0, 0, width, btnHeight, 14);
      }
    };
    
    draw(false);
  
    // Icône héros plus grande et avec effet
    const heroIcon = this.add.text(35, btnHeight / 2, "⚔️", {
      fontSize: "36px",
    }).setOrigin(0.5).setShadow(0, 0, "#00eaff", 8, true, true);
  
    // Texte principal "Voir son héros"
    const title = this.add.text(75, btnHeight / 2 - 18, "VOIR SON HÉROS", {
      fontSize: "22px",
      fontFamily: "Orbitron, sans-serif",
      color: "#ffffff",
      fontWeight: "bold",
      letterSpacing: 1
    }).setOrigin(0, 0.5).setShadow(0, 0, "#00eaff", 5, true, true);
    
    // Label "Héros actuellement sélectionné :"
    const labelText = this.add.text(75, btnHeight / 2 + 4, "Héros actuellement sélectionné :", {
      fontSize: "11px",
      fontFamily: "Orbitron, sans-serif",
      color: "#9ae8ff",
      fontStyle: "italic"
    }).setOrigin(0, 0.5);
    
    // Nom du héros (mis à jour dynamiquement)
    this.heroNameSubtitle = this.add.text(75, btnHeight / 2 + 18, "Chargement...", {
      fontSize: "16px",
      fontFamily: "Orbitron, sans-serif",
      color: "#00eaff",
      fontWeight: "bold"
    }).setOrigin(0, 0.5).setShadow(0, 0, "#00eaff", 8, true, true);
  
    container.add([glowBg, bg, heroIcon, title, labelText, this.heroNameSubtitle]);
  
    container.setSize(width, btnHeight);
    container.width = width;
    container.setInteractive(
      new Phaser.Geom.Rectangle(width / 2, btnHeight / 2, width, btnHeight),
      Phaser.Geom.Rectangle.Contains
    );
  
    container.on("pointerover", () => {
      draw(true);
      container.setScale(container.scaleX * 1.02); // Effet de zoom
    });
    
    container.on("pointerout", () => {
      draw(false);
      container.setScale(container.scaleX / 1.02);
    });
  
    container.on("pointerdown", async () => {
      const { showHeroUpgrade } = await import("../vue/bridge.js");
      showHeroUpgrade({
        onClose: () => {
          this.updateHeroName(); // Rafraîchir le nom après fermeture
        }
      });
    });
  
    this.add.existing(container);
    this.heroUpgradeButton = container;
  }

  createAchievementsButton() {
    // On récupère la largeur du bouton hero ou 380 par défaut
    const width = this.heroUpgradeButton?.width || 380;
    const btnHeight = 60; // Plus haut pour être plus visible et cliquable
    
    const container = this.add.container(0, 0);
    const bg = this.add.graphics();
  
    // Fonction de dessin avec un style plus prononcé
    const draw = (hover) => {
      bg.clear();
      // Ombre/Lueur externe si hover
      if (hover) {
        bg.lineStyle(4, 0x00f2ff, 1);
        bg.fillStyle(0x1a2639, 1);
      } else {
        bg.lineStyle(2, 0x334155, 0.8);
        bg.fillStyle(0x0e1624, 0.9);
      }
      
      bg.fillRoundedRect(0, 0, width, btnHeight, 12);
      bg.strokeRoundedRect(0, 0, width, btnHeight, 12);
    };
    
    draw(false);
  
    // Étoile plus grosse
    const star = this.add.text(25, btnHeight / 2, "★", {
      fontSize: "28px",
      color: "#ffc857",
    }).setOrigin(0.5);
  
    // Texte "Succès" plus gros (20px au lieu de 16px)
    this.achievementLabel = this.add.text(55, btnHeight / 2, "Succès 0/0", {
      fontSize: "20px",
      fontFamily: "Orbitron, sans-serif",
      color: "#ffffff",
      fontWeight: "bold"
    }).setOrigin(0, 0.5);
  
    // Sous-titre plus visible
    const subtitle = this.add.text(width - 20, btnHeight / 2, "VOIR LA LISTE", {
      fontSize: "14px",
      fontFamily: "Orbitron, sans-serif",
      color: "#7dd0ff",
    }).setOrigin(1, 0.5);
  
    container.add([bg, star, this.achievementLabel, subtitle]);
  
    // --- CORRECTION CRITIQUE DE LA HITBOX ---
    // On définit la taille du container
    container.setSize(width, btnHeight);
    
    // On force la zone interactive à ignorer les décalages d'origine 
    // et on l'aligne pile sur le dessin (0,0,width,height)
    container.setInteractive(
      new Phaser.Geom.Rectangle(width / 2, btnHeight / 2, width, btnHeight),
      Phaser.Geom.Rectangle.Contains
    );
  
    container.on("pointerover", () => {
      draw(true);
      container.setScale(container.scaleX * 1.02); // Petit effet de zoom
    });
    
    container.on("pointerout", () => {
      draw(false);
      container.setScale(container.scaleX / 1.02);
    });
    
    container.on("pointerdown", async () => {
      // Utiliser le composant Vue au lieu de la scène Phaser
      try {
        const { achievements, summary } = await fetchAchievements();
        showAchievements({
          achievements: achievements || [],
          summary: summary || { unlocked: 0, total: 0 },
          onClose: () => {
            // Reste sur le menu principal
          },
        });
      } catch (error) {
        console.error("Erreur chargement achievements:", error);
      }
    });
  
    this.add.existing(container);
    this.achievementsButton = container;
  }

  async updateHeroName() {
    try {
      const { getSelectedHeroId } = await import("../services/authManager.js");
      const { fetchHeroes } = await import("../services/heroService.js");
      const heroId = getSelectedHeroId();
      const response = await fetchHeroes();
      const heroes = response?.heroes || [];
      const hero = Array.isArray(heroes) ? heroes.find(h => Number(h.id) === Number(heroId)) : null;
      if (hero && this.heroNameSubtitle) {
        this.heroNameSubtitle.setText(hero.name.toUpperCase());
      } else if (this.heroNameSubtitle) {
        this.heroNameSubtitle.setText("AUCUN HÉROS");
      }
    } catch (error) {
      console.error("Erreur récupération nom héros:", error);
      if (this.heroNameSubtitle) {
        this.heroNameSubtitle.setText("ERREUR");
      }
    }
  }

  async refreshAchievementsSummary() {
    // Ne pas faire d'appel API si l'utilisateur n'est pas connecté
    if (!isAuthenticated()) {
      if (this.achievementLabel) {
        this.achievementLabel.setText("Succès -");
      }
      return;
    }

    try {
      const { summary } = await fetchAchievements();
      if (this.achievementLabel) {
        this.achievementLabel.setText(`Succès ${summary.unlocked}/${summary.total}`);
      }
    } catch (err) {
      console.error("Erreur récupération des succès", err);
      if (this.achievementLabel) {
        this.achievementLabel.setText("Succès (erreur)");
      }
    }
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
    const btn = this.add.text(this.scale.width / 2, y, "DÉCONNEXION", {
      fontSize: "14px",
      fontFamily: "Orbitron, sans-serif",
      color: "#ff0000",
      letterSpacing: 2
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => btn.setColor("#ff6666"));
    btn.on("pointerout", () => btn.setColor("#ff0000"));
    btn.on("pointerdown", () => {
      logout();
      this.scene.restart();
      showAuth();
    });

    this.logoutButton = btn;
  }

  setupEventListeners() {
    this.profileUpdatedHandler = () => {
      if (this.heroPanel) this.heroPanel.refresh();
      // Mettre à jour le nom d'utilisateur affiché
      if (this.userDisplayText) {
        const profile = getProfile();
        const username = profile?.player?.username || "Invité";
        this.userDisplayText.setText(`CONNECTÉ EN TANT QUE : ${username.toUpperCase()}`);
      }
    };
    this.achievementUpdatedHandler = (event) => {
      const summary = event?.detail?.summary;
      if (summary && this.achievementLabel) {
        this.achievementLabel.setText(`Succès ${summary.unlocked}/${summary.total}`);
      } else {
        this.refreshAchievementsSummary();
      }
    };
    window.addEventListener("auth:profile-updated", this.profileUpdatedHandler);
    window.addEventListener("achievements:updated", this.achievementUpdatedHandler);
    this.events.once("shutdown", () => {
      window.removeEventListener("auth:profile-updated", this.profileUpdatedHandler);
      window.removeEventListener("achievements:updated", this.achievementUpdatedHandler);
    });
  }

  applyResponsiveLayout() {
    const { width, height } = this.scale;
    const padding = Math.max(20, Math.min(width, height) * 0.04);
    const uiScale = Phaser.Math.Clamp(Math.min(width / 1400, height / 900), 0.6, 1);
    const isMobile = width < 900 || height > width * 1.05;

    if (this.heroPanel) {
      const heroScale = isMobile ? uiScale * 0.9 : uiScale;
      this.heroPanel.setScale(heroScale);
      const heroHeight = (this.heroPanel.config?.height || 300) * this.heroPanel.scaleY;
      const targetY = isMobile
        ? padding
        : Math.max(padding, height * 0.16 - heroHeight * 0.15);
      const targetX = isMobile ? width / 2 - (this.heroPanel.config?.width || 380) * this.heroPanel.scaleX / 2 : padding;
      this.heroPanel.setPosition(targetX, targetY);
      if (this.achievementsButton) {
        this.achievementsButton.setScale(heroScale);
        // Augmenter l'espacement à 15 ou 20 si nécessaire
  const buttonY = targetY + heroHeight + 15; 
  this.achievementsButton.setPosition(targetX, buttonY);
      }
    }

    if (this.leaderboard) {
      const targetScale = Phaser.Math.Clamp(uiScale, isMobile ? 0.48 : 0.5, 1);
      const baseHeight = this.leaderboard.uiConfig?.height || 500;
      const baseWidth = this.leaderboard.uiConfig?.width || 560;
      let lbScale = Math.min(targetScale, (height - padding * 2) / baseHeight);
      lbScale = Phaser.Math.Clamp(lbScale, isMobile ? 0.48 : 0.5, 1);
      this.leaderboard.setScale(lbScale);

      const lbWidth = baseWidth * lbScale;
      const lbHeight = baseHeight * lbScale;

      if (isMobile) {
        const lbX = (width - lbWidth) / 2;
        const lbY = (this.playButton?.y || height * 0.55) + padding * 0.6;
        this.leaderboard.setPosition(lbX, lbY);
      } else {
        const lbX = Math.max(padding, width - padding - lbWidth);
        let lbY = padding;
        if (lbY + lbHeight > height - padding) {
          lbY = height - padding - lbHeight;
        }
        this.leaderboard.setPosition(lbX, lbY);
      }
    }

    const heroBottom = this.heroPanel
      ? this.heroPanel.y + (this.heroPanel.config?.height || 300) * (this.heroPanel.scaleY || 1)
      : padding;
    const lbBottom = this.leaderboard
      ? this.leaderboard.y + (this.leaderboard.uiConfig?.height || 500) * (this.leaderboard.scaleY || 1)
      : padding;
    const panelsBottom = isMobile ? Math.max(heroBottom, (this.playButton?.y || 0)) : Math.max(heroBottom, lbBottom);

    // Positionner le texte "CONNECTÉ EN TANT QUE" en haut
    if (this.userDisplayText) {
      this.userDisplayText.setScale(uiScale);
      const userTextY = padding + 30 * uiScale;
      this.userDisplayText.setPosition(width / 2, userTextY);
    }

    // Positionner le titre "LAST OUTPOST" en dessous du texte utilisateur
    if (this.titleText) {
      this.titleText.setScale(uiScale);
      const titleY = this.userDisplayText 
        ? this.userDisplayText.y + 100 * uiScale // Espacement augmenté entre le texte et le titre
        : Math.max(height * 0.14, panelsBottom + padding * 0.6);
      this.titleText.setPosition(width / 2, titleY);
    }

    // Positionner le bouton "DÉPLOYER" au centre vertical de l'écran
    if (this.playButton) {
      const playHeight = 80 * uiScale;
      // Positionner au centre vertical (height / 2)
      const centerY = height / 2;
      // S'assurer qu'il ne chevauche pas avec les autres éléments
      const titleBottom = this.titleText ? this.titleText.y + 50 * uiScale : 0;
      const minY = titleBottom + padding * 2;
      const desiredY = Math.max(centerY, minY);
      const clampedY = Math.min(height - padding - playHeight * 0.5, desiredY);
      this.playButton.baseScale = uiScale * (isMobile ? 0.95 : 1);
      this.playButton.setScale(this.playButton.baseScale);
      this.playButton.setPosition(width / 2, clampedY);
    }

    if (this.leaderboard && isMobile) {
      const baseHeight = this.leaderboard.uiConfig?.height || 500;
      const lbHeight = baseHeight * this.leaderboard.scaleY;
      const lbY = this.leaderboard.y;
      if (lbY + lbHeight > height - padding * 1.6 && this.playButton) {
        this.playButton.setY(Math.max(padding * 2, this.playButton.y - padding * 0.8));
        this.leaderboard.setY(this.playButton.y + padding * 0.6);
      }
    }

    if (this.logoutButton) {
      this.logoutButton.setScale(uiScale);
      this.logoutButton.setPosition(width / 2, height - padding);
    }
  }
}

export default {
  name: "MainMenuSceneView",
  scene: MainMenuScene,
};
</script>

<style scoped>
.scene-wrapper {
  display: none;
}
</style>
