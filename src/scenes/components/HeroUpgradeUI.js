/**
 * Interface principale de mise à niveau des héros
 * Orchestre les différents composants pour une interface claire et modulaire
 */

import {
  getHeroStats,
  getHeroPointsAvailable,
  getHeroPointConversion,
  getHeroLimits,
  queueHeroUpgrade,
  updateHeroColor,
  isAuthenticated,
  getSelectedHeroId,
} from "../../services/authManager.js";
import { showAuth } from "../../services/authOverlay.js";
import { fetchHeroes } from "../../services/heroService.js";
import { showHeroSelection } from "../../vue/bridge.js";
import { HeroAvatarComponent } from "./heroUpgrade/HeroAvatarComponent.js";
import { StatRowComponent } from "./heroUpgrade/StatRowComponent.js";
import { UpgradeButtonsComponent } from "./heroUpgrade/UpgradeButtonsComponent.js";
import { getCurrentStatValue, STAT_CONVERSION_MAP } from "./heroUpgrade/utils.js";

export class HeroUpgradeUI extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.config = {
      width: 420,
      height: 440,
      padding: 20,
      accentColor: 0x00eaff,
      bgColor: 0x050a10,
      rowHeight: 60,
      avatarSize: 70, // Réduit de 85 à 70 pour un avatar plus petit
      maxValues: { hp: 2500, damage: 450, move_speed: 200, attack_interval_ms: 1500 },
      minValues: { attack_interval_ms: 500 },
    };

    this.statRows = new Map();
    this.pendingUpgrades = { hp: 0, damage: 0, move_speed: 0, attack_interval_ms: 0 };
    this.holdTimer = null;
    this.lastHeroId = undefined;

    // Composants
    this.avatarComponent = null;
    this.buttonsComponent = null;

    // Handlers pour les événements
    this.setupEventHandlers();
    this.setupMainPanel();
    this.refresh();
    this.updateHeroName();

    this.scene.add.existing(this);
    this.setDepth(180);
  }

  setupEventHandlers() {
    this.upgradeCompleteHandler = () => this.refresh();
    this.profileUpdateHandler = () => this.refresh();

    window.addEventListener("hero:upgrade-complete", this.upgradeCompleteHandler);
    window.addEventListener("profile:updated", this.profileUpdateHandler);

    this.scene.events.once("shutdown", () => {
      this.stopContinuousUpgrade();
      window.removeEventListener("hero:upgrade-complete", this.upgradeCompleteHandler);
      window.removeEventListener("profile:updated", this.profileUpdateHandler);
    });
  }

  setupMainPanel() {
    const { width, height, padding, accentColor, bgColor } = this.config;

    // Fond
    const bg = this.scene.add.graphics();
    bg.fillStyle(bgColor, 0.95);
    bg.lineStyle(2, accentColor, 1);
    bg.fillRoundedRect(0, 0, width, height, 15);
    bg.strokeRoundedRect(0, 0, width, height, 15);
    bg.lineStyle(4, accentColor, 0.5);
    bg.lineBetween(width * 0.3, 0, width * 0.7, 0);
    this.add(bg);

    // Titre
    const resolution = window.devicePixelRatio || 1;
    const title = this.scene.add
      .text(width / 2, -15, " SYSTÈME HÉROS ", {
        fontFamily: "Impact, sans-serif",
        fontSize: "26px",
        color: "#ffffff",
        backgroundColor: "#050a10",
        padding: { x: 10, y: 2 },
        resolution,
      })
      .setOrigin(0.5);
    this.add(title);

    // Bouton changer héros
    this.heroSelectionBtn = this.scene.add
      .rectangle(width - padding - 10, -15, 80, 25, accentColor, 0.7)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => this.heroSelectionBtn.setAlpha(1))
      .on("pointerout", () => this.heroSelectionBtn.setAlpha(0.7))
      .on("pointerdown", () => this.openHeroSelection());

    const selectText = this.scene.add.text(width - padding - 10, -15, "CHANGER", {
      fontFamily: "Arial",
      fontSize: "11px",
      color: "#ffffff",
      fontWeight: "bold",
      resolution,
    }).setOrigin(0.5);
    this.add(this.heroSelectionBtn);
    this.add(selectText);

    // Nom du héros
    this.heroNameText = this.scene.add.text(width / 2, 10, "", {
      fontFamily: "Orbitron, sans-serif",
      fontSize: "22px",
      color: "#ffffff",
      fontWeight: "bold",
      stroke: "#000000",
      strokeThickness: 4,
      resolution,
    }).setOrigin(0.5, 0);
    this.add(this.heroNameText);

    // Avatar
    this.avatarComponent = new HeroAvatarComponent(
      this.scene,
      this.config,
      this
    );
    this.avatarComponent.create(padding, 40, () => this.openColorPicker());

    // Lignes de statistiques
    const statsData = [
      { key: "hp", label: "VIE", color: 0x4caf50 },
      { key: "damage", label: "DÉGÂT", color: 0xff4d4d },
      { key: "attack_interval_ms", label: "VIT. DE FRAPPE", color: 0xffaa00 },
      { key: "move_speed", label: "AGILITÉ", color: 0x00eaff },
    ];

    const statsStartX = padding + this.config.avatarSize + 25;
    statsData.forEach((stat, idx) => {
      const statRow = new StatRowComponent(
        this.scene,
        stat,
        statsStartX,
        65 + idx * this.config.rowHeight,
        this.config,
        (key) => this.startContinuousUpgrade(key),
        () => this.stopContinuousUpgrade()
      );
      this.statRows.set(stat.key, statRow);
      statRow.getElements().forEach(el => this.add(el));
    });

    // Texte des points
    this.pointsText = this.scene.add
      .text(width / 2, height - 95, "", {
        fontSize: "18px",
        fontFamily: "Orbitron, sans-serif",
        color: "#7dd0ff",
        fontWeight: "bold",
        resolution,
      })
      .setOrigin(0.5);
    this.add(this.pointsText);

    // Boutons Valider/Annuler
    this.buttonsComponent = new UpgradeButtonsComponent(
      this.scene,
      this.config,
      () => this.cancelUpgrades(),
      () => this.confirmAllUpgrades()
    );
    this.buttonsComponent.create().forEach(el => this.add(el));
  }

  startContinuousUpgrade(key) {
    this.handlePendingUpgrade(key);
    this.holdTimer = this.scene.time.addEvent({
      delay: 400,
      callback: () => {
        this.holdTimer = this.scene.time.addEvent({
          delay: 70,
          callback: () => this.handlePendingUpgrade(key),
          loop: true,
        });
      },
    });
  }

  stopContinuousUpgrade() {
    if (this.holdTimer) {
      this.holdTimer.remove();
      this.holdTimer = null;
    }
  }

  handlePendingUpgrade(key) {
    if (!isAuthenticated()) {
      this.stopContinuousUpgrade();
      showAuth();
      return;
    }

    const available = getHeroPointsAvailable();
    const totalPending = Object.values(this.pendingUpgrades).reduce((a, b) => a + b, 0);
    if (totalPending >= available) {
      this.stopContinuousUpgrade();
      return;
    }

    const stats = getHeroStats();
    const conversion = getHeroPointConversion();

    const currentVal = getCurrentStatValue(stats, key);
    const pendingPoints = this.pendingUpgrades[key];
    const convValue = parseFloat(conversion?.[STAT_CONVERSION_MAP[key]] || 0);

    const projectedValue = key === "attack_interval_ms"
      ? Math.max(this.config.minValues.attack_interval_ms, currentVal - (pendingPoints + 1) * convValue)
      : parseFloat(currentVal) + (pendingPoints + 1) * convValue;

    if (key === "attack_interval_ms") {
      if (projectedValue <= this.config.minValues.attack_interval_ms) {
        this.stopContinuousUpgrade();
        return;
      }
    } else if (projectedValue > this.config.maxValues[key]) {
      this.stopContinuousUpgrade();
      return;
    }

    this.pendingUpgrades[key]++;
    this.updateAllVisuals();
    this.updatePointsDisplay();
  }

  updateAllVisuals() {
    const stats = getHeroStats();
    const conversion = getHeroPointConversion();
    
    this.statRows.forEach((statRow, key) => {
      statRow.updateVisuals(
        stats,
        conversion,
        this.pendingUpgrades[key],
        this.config.maxValues,
        this.config.minValues
      );
      statRow.updateButtonState(stats, this.config.maxValues, this.config.minValues);
    });
  }

  updatePointsDisplay() {
    const available = getHeroPointsAvailable();
    const totalPending = Object.values(this.pendingUpgrades).reduce((a, b) => a + b, 0);
    const remaining = available - totalPending;
    this.pointsText.setText(
      totalPending > 0
        ? `POINTS : ${remaining} / ${available}`
        : `POINTS DISPONIBLES : ${available}`
    );
  }

  cancelUpgrades() {
    this.scene.cameras.main.shake(50, 0.002);
    this.pendingUpgrades = { hp: 0, damage: 0, move_speed: 0, attack_interval_ms: 0 };
    this.refresh();
  }

  async confirmAllUpgrades() {
    try {
      this.scene.cameras.main.shake(100, 0.002);
      for (const [key, points] of Object.entries(this.pendingUpgrades)) {
        if (points > 0) queueHeroUpgrade(key, points);
      }
      this.pendingUpgrades = { hp: 0, damage: 0, move_speed: 0, attack_interval_ms: 0 };
      await new Promise((r) => setTimeout(r, 150));
      this.refresh();
    } catch (err) {
      console.error(err);
    }
  }

  async openHeroSelection() {
    if (!isAuthenticated()) {
      showAuth();
      return;
    }
    
    try {
      const response = await fetchHeroes();
      const heroes = response?.heroes || [];
      const selectedHeroId = getSelectedHeroId();
      const heroPointsAvailable = getHeroPointsAvailable() || 0;

      showHeroSelection({
        heroes,
        selectedHeroId,
        heroPointsAvailable,
        onSelect: async (heroId) => {
          const { setSelectedHeroId } = await import("../../services/authManager.js");
          setSelectedHeroId(heroId);
          this.refresh();
          window.dispatchEvent(new CustomEvent("hero:selected", { detail: { heroId } }));
        },
        onUnlock: async (heroId) => {
          const { unlockHero } = await import("../../services/heroService.js");
          try {
            await unlockHero(heroId);
            this.refresh();
            window.dispatchEvent(new CustomEvent("hero:unlocked", { detail: { heroId } }));
          } catch (error) {
            console.error("Erreur déblocage héros:", error);
          }
        },
        onClose: () => {
          // La modale est fermée
        },
      });
    } catch (error) {
      console.error("Erreur chargement héros:", error);
    }
  }

  refresh() {
    const stats = getHeroStats();
    if (!stats) return;
    
    const heroLimits = getHeroLimits();
    const currentHeroId = stats?.hero_id ?? 1;

    // Vérifier si le héros a changé
    if (this.lastHeroId !== undefined && this.lastHeroId !== currentHeroId) {
      if (this.avatarComponent) {
        this.avatarComponent.destroy();
      }
      this.avatarComponent = new HeroAvatarComponent(this.scene, this.config, this);
      this.avatarComponent.create(this.config.padding, 40, () => this.openColorPicker());
    }
    this.lastHeroId = currentHeroId;

    // Mettre à jour les limites
    if (heroLimits) {
      this.config.maxValues = {
        hp: heroLimits.max_hp ?? 2500,
        damage: heroLimits.max_damage ?? 450,
        move_speed: heroLimits.max_move_speed ?? 200,
        attack_interval_ms: 1500,
      };
      this.config.minValues = {
        attack_interval_ms: heroLimits.min_attack_interval_ms ?? 500,
      };
    }

    // Reset des pending upgrades
    this.pendingUpgrades = { hp: 0, damage: 0, move_speed: 0, attack_interval_ms: 0 };

    // Mettre à jour tous les visuels
    this.updateAllVisuals();
    
    // Mettre à jour l'avatar
    if (this.avatarComponent && stats.color) {
      this.avatarComponent.redraw(stats.color);
      this.avatarComponent.updateKills(stats.kills);
      this.avatarComponent.updateEnemiesRetained(stats.enemies_retained);
    }

    this.updatePointsDisplay();
    const totalPending = Object.values(this.pendingUpgrades).reduce((a, b) => a + b, 0);
    if (this.buttonsComponent) {
      this.buttonsComponent.updateState(totalPending);
    }
    
    this.updateHeroName();
  }

  async updateHeroName() {
    try {
      const heroId = getSelectedHeroId();
      const response = await fetchHeroes();
      const heroes = response?.heroes || [];
      const hero = Array.isArray(heroes) ? heroes.find(h => h.id === heroId) : null;
      if (hero && this.heroNameText) {
        this.heroNameText.setText(hero.name.toUpperCase());
      } else if (this.heroNameText) {
        this.heroNameText.setText("HÉROS");
      }
    } catch (error) {
      console.error("Erreur récupération nom héros:", error);
      if (this.heroNameText) {
        this.heroNameText.setText("HÉROS");
      }
    }
  }

  openColorPicker() {
    if (!isAuthenticated()) {
      showAuth();
      return;
    }
    const input = document.createElement("input");
    input.type = "color";
    input.value = getHeroStats()?.color || "#2b2b2b";
    input.style.opacity = "0";
    document.body.appendChild(input);

    input.onchange = async (e) => {
      await updateHeroColor(e.target.value);
      this.refresh();
      document.body.removeChild(input);
    };
    input.onblur = () => {
      setTimeout(() => {
        if (document.body.contains(input)) document.body.removeChild(input);
      }, 100);
    };
    input.click();
  }
}
