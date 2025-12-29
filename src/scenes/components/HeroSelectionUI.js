import { fetchHeroes, unlockHero } from "../../services/heroService.js";
import { getSelectedHeroId, setSelectedHeroId, getHeroPointsAvailable } from "../../services/authManager.js";
import { isAuthenticated } from "../../services/authManager.js";
import { showAuth } from "../../services/authOverlay.js";

// Fonction pour tronquer un nombre à N décimales (sans arrondir)
function truncateDecimals(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.floor(value * factor) / factor;
}

export class HeroSelectionUI extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.config = {
      width: 500,
      height: 600,
      padding: 20,
      accentColor: 0x00eaff,
      bgColor: 0x050a10,
      rowHeight: 100,
      heroCardWidth: 460,
      heroCardHeight: 90,
    };

    this.heroes = [];
    this.heroCards = new Map();
    this.selectedHeroId = getSelectedHeroId();
    this.isUnlocking = false;

    this.setupPanel();
    this.loadHeroes();

    this.scene.add.existing(this);
    this.setDepth(200);
  }

  setupPanel() {
    const { width, height, padding, accentColor, bgColor } = this.config;

    // Fond
    const bg = this.scene.add.graphics();
    bg.fillStyle(bgColor, 0.98);
    bg.lineStyle(3, accentColor, 1);
    bg.fillRoundedRect(0, 0, width, height, 15);
    bg.strokeRoundedRect(0, 0, width, height, 15);
    this.add(bg);

    // Titre
    const resolution = window.devicePixelRatio || 1;
    const title = this.scene.add
      .text(width / 2, padding, "SÉLECTION DE HÉROS", {
        fontFamily: "Impact, sans-serif",
        fontSize: "28px",
        color: "#ffffff",
        backgroundColor: "#050a10",
        padding: { x: 10, y: 2 },
        resolution,
      })
      .setOrigin(0.5);
    this.add(title);

    // Zone de scroll pour les héros
    this.heroesContainer = this.scene.add.container(padding, padding + 50);
    this.add(this.heroesContainer);

    // Bouton fermer
    const closeBtn = this.scene.add
      .rectangle(width - padding - 15, padding + 15, 30, 30, accentColor, 0.8)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => closeBtn.setAlpha(1))
      .on("pointerout", () => closeBtn.setAlpha(0.8))
      .on("pointerdown", () => {
        this.destroy();
      });

    const closeText = this.scene.add.text(width - padding - 15, padding + 15, "×", {
      fontSize: "24px",
      color: "#ffffff",
      resolution,
    }).setOrigin(0.5);
    this.add(closeBtn);
    this.add(closeText);
  }

  async loadHeroes() {
    if (!isAuthenticated()) {
      showAuth();
      return;
    }

    try {
      const data = await fetchHeroes();
      this.heroes = data.heroes || [];
      this.heroPointsAvailable = data.heroPointsAvailable || 0;
      
      // Mettre à jour selectedHeroId avec le héros qui a isSelected = true
      const selectedHero = this.heroes.find(h => h.isSelected);
      if (selectedHero) {
        this.selectedHeroId = selectedHero.id;
      } else {
        // Fallback vers getSelectedHeroId si aucun n'est sélectionné
        this.selectedHeroId = getSelectedHeroId();
      }
      
      this.renderHeroes();
    } catch (error) {
      console.error("Erreur chargement héros:", error);
    }
  }

  renderHeroes() {
    // Nettoyer les cartes existantes
    this.heroCards.forEach((card) => card.destroy());
    this.heroCards.clear();

    const { heroCardWidth, heroCardHeight, rowHeight, padding } = this.config;
    let yOffset = 0;

    this.heroes.forEach((hero, index) => {
      const cardY = yOffset;
      const card = this.createHeroCard(hero, 0, cardY, heroCardWidth, heroCardHeight);
      this.heroesContainer.add(card);
      this.heroCards.set(hero.id, card);
      yOffset += rowHeight;
    });
  }

  createHeroCard(hero, x, y, width, height) {
    const card = this.scene.add.container(x, y);
    const { accentColor, bgColor } = this.config;
    const resolution = window.devicePixelRatio || 1;

    // Fond de la carte
    const bg = this.scene.add.graphics();
    const isSelected = hero.isSelected || false;
    const isUnlocked = hero.isUnlocked;
    const cardBgColor = isSelected ? accentColor : bgColor;
    const cardBgAlpha = isSelected ? 0.3 : 0.2;

    bg.fillStyle(cardBgColor, cardBgAlpha);
    bg.lineStyle(2, isSelected ? accentColor : 0x444444, 1);
    bg.fillRoundedRect(0, 0, width, height, 10);
    bg.strokeRoundedRect(0, 0, width, height, 10);
    card.add(bg);

    // Nom du héros
    const nameText = this.scene.add.text(15, 15, hero.name, {
      fontFamily: "Orbitron, sans-serif",
      fontSize: "20px",
      color: isUnlocked ? "#ffffff" : "#888888",
      fontWeight: "bold",
      resolution,
    });
    card.add(nameText);

    // Stats avec icônes (plus beau)
    const statsY = 40;
    const hp = isUnlocked ? hero.current_hp : hero.base_hp;
    const damage = isUnlocked ? hero.current_damage : hero.base_damage;
    const attackInterval = isUnlocked ? hero.current_attack_interval_ms : hero.base_attack_interval_ms;
    const moveSpeed = isUnlocked ? hero.current_move_speed : hero.base_move_speed;
    
    // Créer un container pour les stats avec icônes
    const statsContainer = this.scene.add.container(15, statsY);
    
    const statColor = isUnlocked ? "#aaaaaa" : "#666666";
    const iconSize = 14;
    const statSpacing = 75;
    let statX = 0;
    
    // HP avec icône ❤️
    const hpIcon = this.scene.add.text(statX, 0, "❤️", { fontSize: `${iconSize}px`, resolution });
    const hpText = this.scene.add.text(statX + 18, 0, `${Math.round(hp)}`, {
      fontFamily: "Arial",
      fontSize: "11px",
      color: statColor,
      resolution,
    });
    statsContainer.add([hpIcon, hpText]);
    statX += statSpacing;
    
    // Dégât avec icône ⚔️
    const damageIcon = this.scene.add.text(statX, 0, "⚔️", { fontSize: `${iconSize}px`, resolution });
    const damageText = this.scene.add.text(statX + 18, 0, `${damage.toFixed(1)}`, {
      fontFamily: "Arial",
      fontSize: "11px",
      color: statColor,
      resolution,
    });
    statsContainer.add([damageIcon, damageText]);
    statX += statSpacing;
    
    // Vitesse de frappe avec icône ⚡
    const speedIcon = this.scene.add.text(statX, 0, "⚡", { fontSize: `${iconSize}px`, resolution });
    const speedText = this.scene.add.text(statX + 18, 0, `${truncateDecimals(attackInterval / 1000, 3).toFixed(3)}s`, {
      fontFamily: "Arial",
      fontSize: "11px",
      color: statColor,
      resolution,
    });
    statsContainer.add([speedIcon, speedText]);
    statX += statSpacing;
    
    // Agilité avec icône 🏃
    const agilityIcon = this.scene.add.text(statX, 0, "🏃", { fontSize: `${iconSize}px`, resolution });
    const agilityText = this.scene.add.text(statX + 18, 0, `${Math.round(moveSpeed)}`, {
      fontFamily: "Arial",
      fontSize: "11px",
      color: statColor,
      resolution,
    });
    statsContainer.add([agilityIcon, agilityText]);
    
    card.add(statsContainer);

    // Statut de déblocage ou bouton
    if (isUnlocked) {
      // Héros débloqué - afficher "SÉLECTIONNÉ" si isSelected est true
      if (isSelected) {
        const selectedContainer = this.scene.add.container(width - 90, height / 2);
        
        // Fond du badge "SÉLECTIONNÉ"
        const selectedBg = this.scene.add.graphics();
        selectedBg.fillStyle(accentColor, 0.3);
        selectedBg.lineStyle(2, accentColor, 1);
        selectedBg.fillRoundedRect(-45, -18, 90, 36, 8);
        selectedBg.strokeRoundedRect(-45, -18, 90, 36, 8);
        
        const selectedText = this.scene.add.text(0, 0, "✓ SÉLECTIONNÉ", {
          fontFamily: "Orbitron, sans-serif",
          fontSize: "12px",
          color: accentColor,
          fontWeight: "bold",
          resolution,
        }).setOrigin(0.5);
        
        selectedContainer.add([selectedBg, selectedText]);
        card.add(selectedContainer);
      } else {
        // Bouton sélectionner amélioré (plus rempli et visible)
        const selectBtnContainer = this.scene.add.container(width - 90, height / 2);
        
        // Fond du bouton avec bordure
        const selectBtnBg = this.scene.add.graphics();
        selectBtnBg.fillStyle(accentColor, 0.9);
        selectBtnBg.lineStyle(2, accentColor, 1);
        selectBtnBg.fillRoundedRect(-45, -18, 90, 36, 8);
        selectBtnBg.strokeRoundedRect(-45, -18, 90, 36, 8);
        
        // Texte du bouton
        const selectText = this.scene.add.text(0, 0, "✓ SÉLECTIONNER", {
          fontFamily: "Orbitron, sans-serif",
          fontSize: "12px",
          color: "#ffffff",
          fontWeight: "bold",
          resolution,
        }).setOrigin(0.5);
        
        selectBtnContainer.add([selectBtnBg, selectText]);
        selectBtnContainer.setSize(90, 36).setInteractive({ useHandCursor: true });
        
        selectBtnContainer.on("pointerover", () => {
          selectBtnBg.clear();
          selectBtnBg.fillStyle(accentColor, 1);
          selectBtnBg.lineStyle(2, accentColor, 1);
          selectBtnBg.fillRoundedRect(-45, -18, 90, 36, 8);
          selectBtnBg.strokeRoundedRect(-45, -18, 90, 36, 8);
        });
        
        selectBtnContainer.on("pointerout", () => {
          selectBtnBg.clear();
          selectBtnBg.fillStyle(accentColor, 0.9);
          selectBtnBg.lineStyle(2, accentColor, 1);
          selectBtnBg.fillRoundedRect(-45, -18, 90, 36, 8);
          selectBtnBg.strokeRoundedRect(-45, -18, 90, 36, 8);
        });
        
        selectBtnContainer.on("pointerdown", () => this.selectHero(hero.id));
        
        card.add(selectBtnContainer);
      }
    } else {
      // Héros verrouillé
      const lockIcon = this.scene.add.text(width - 15, 15, "🔒", {
        fontSize: "20px",
        resolution,
      }).setOrigin(1, 0);

      const unlockCost = hero.hero_points_to_unlock || 0;
      const canUnlock = this.heroPointsAvailable >= unlockCost;

      const unlockBtn = this.scene.add
        .rectangle(width - 80, height / 2 + 20, 70, 30, canUnlock ? 0x4caf50 : 0x666666, canUnlock ? 0.8 : 0.4)
        .setInteractive({ useHandCursor: canUnlock })
        .on("pointerover", () => {
          if (canUnlock) unlockBtn.setAlpha(1);
        })
        .on("pointerout", () => {
          if (canUnlock) unlockBtn.setAlpha(0.8);
        })
        .on("pointerdown", () => {
          if (canUnlock && !this.isUnlocking) {
            this.unlockHero(hero.id);
          }
        });

      const unlockText = this.scene.add.text(width - 80, height / 2 + 20, `${unlockCost} pts`, {
        fontFamily: "Arial",
        fontSize: "11px",
        color: canUnlock ? "#ffffff" : "#aaaaaa",
        fontWeight: "bold",
        resolution,
      }).setOrigin(0.5);

      card.add(lockIcon);
      card.add(unlockBtn);
      card.add(unlockText);
    }

    return card;
  }

  async selectHero(heroId) {
    if (!isAuthenticated()) {
      showAuth();
      return;
    }

    try {
      await setSelectedHeroId(heroId);
      this.selectedHeroId = heroId;
      
      // Recharger les héros pour mettre à jour isSelected
      await this.loadHeroes();
    } catch (error) {
      console.error("Erreur lors de la sélection du héros:", error);
    }
  }

  async unlockHero(heroId) {
    if (this.isUnlocking) return;
    
    if (!isAuthenticated()) {
      showAuth();
      return;
    }

    this.isUnlocking = true;

    try {
      const result = await unlockHero(heroId);
      
      // Mettre à jour les points disponibles dans le profil
      const { getProfile } = await import("../../services/authManager.js");
      const profile = getProfile();
      if (profile?.player) {
        profile.player.hero_points_available = result.heroPointsAvailable;
      }
      
      // Mettre à jour les heroStats
      if (result.heroStats && profile) {
        profile.heroStats = result.heroStats;
      }

      // Rafraîchir la liste
      await this.loadHeroes();
      
      // Sélectionner automatiquement le héros débloqué
      await this.selectHero(heroId);

      // Afficher un message de succès
      console.log(result.message);
      
      // Déclencher un événement pour mettre à jour l'UI globale
      window.dispatchEvent(new CustomEvent("profile:updated"));
    } catch (error) {
      console.error("Erreur déblocage héros:", error);
      const errorMsg = error.response?.data?.error || "Erreur lors du déblocage";
      alert(errorMsg);
    } finally {
      this.isUnlocking = false;
    }
  }
}

