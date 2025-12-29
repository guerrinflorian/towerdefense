import {
  ensureHeroContext,
  getAvailableHeroes,
  getHeroStats,
  getHeroPointsAvailable,
  getHeroPointConversion,
  getSelectedHeroId,
  getHeroUnlockCost,
  isHeroLocked,
  queueHeroUpgrade,
  selectHero,
  unlockHero,
  isAuthenticated,
  getSelectedHeroId,
  getProfile,
} from "../../services/authManager.js";
import { showAuth } from "../../services/authOverlay.js";
import { fetchHeroes } from "../../services/heroService.js";

// Fonction pour tronquer un nombre à N décimales (sans arrondir)
function truncateDecimals(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.floor(value * factor) / factor;
}
import { HeroSelectionUI } from "./HeroSelectionUI.js";

export class HeroUpgradeUI extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.config = {
      width: 420,
      height: 440, // Augmenté pour 4 stats
      padding: 20,
      accentColor: 0x00eaff,
      bgColor: 0x050a10,
      rowHeight: 60,
      avatarSize: 85,
      // Les valeurs max/min seront mises à jour depuis le profil
      maxValues: { hp: 2500, damage: 450, move_speed: 200, attack_interval_ms: 1500 },
      minValues: { attack_interval_ms: 500 }, // Minimum pour la vitesse de frappe
    };

    this.statElements = new Map();
    this.pendingUpgrades = { hp: 0, damage: 0, move_speed: 0, attack_interval_ms: 0 };
    this.holdTimer = null;

    this.upgradeCompleteHandler = () => {
      this.refresh();
    };
    this.profileUpdateHandler = () => {
      this.refresh();
    };
    window.addEventListener(
      "hero:upgrade-complete",
      this.upgradeCompleteHandler
    );
    window.addEventListener(
      "profile:updated",
      this.profileUpdateHandler
    );

    this.heroSelectionHandler = () => {
      this.pendingUpgrades = { hp: 0, damage: 0, move_speed: 0 };
      this.refresh();
    };
    window.addEventListener("hero:selection-changed", this.heroSelectionHandler);

    this.scene.events.once("shutdown", () => {
      this.stopContinuousUpgrade();
      window.removeEventListener(
        "hero:upgrade-complete",
        this.upgradeCompleteHandler
      );
      window.removeEventListener(
        "hero:selection-changed",
        this.heroSelectionHandler
      );
    });

    this.setupMainPanel();
    ensureHeroContext().then(() => this.refresh());

    this.scene.add.existing(this);
    this.setDepth(180);
  }

  setupMainPanel() {
    const { width, height, padding, accentColor, bgColor } = this.config;

    const bg = this.scene.add.graphics();
    bg.fillStyle(bgColor, 0.95);
    bg.lineStyle(2, accentColor, 1);
    bg.fillRoundedRect(0, 0, width, height, 15);
    bg.strokeRoundedRect(0, 0, width, height, 15);

    bg.lineStyle(4, accentColor, 0.5);
    bg.lineBetween(width * 0.3, 0, width * 0.7, 0);
    this.add(bg);

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

    this.heroNameText = this.scene.add
      .text(width / 2, 20, "", {
        fontFamily: "Orbitron, sans-serif",
        fontSize: "18px",
        color: "#7dd0ff",
        fontWeight: "bold",
        resolution,
      })
      .setOrigin(0.5);
    this.add(this.heroNameText);

    const navOffsetY = 20;
    this.heroNavLeft = this.scene.add
      .text(padding, navOffsetY, "◀", {
        fontSize: "18px",
        color: "#7dd0ff",
        fontFamily: "Orbitron, sans-serif",
        resolution,
      })
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true });
    this.heroNavRight = this.scene.add
      .text(width - padding, navOffsetY, "▶", {
        fontSize: "18px",
        color: "#7dd0ff",
        fontFamily: "Orbitron, sans-serif",
        resolution,
      })
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true });

    this.heroNavLeft.on("pointerdown", () => this.cycleHero(-1));
    this.heroNavRight.on("pointerdown", () => this.cycleHero(1));

    this.add([this.heroNavLeft, this.heroNavRight]);
    this.add(this.heroNameText);

    // --- RESTAURATION DE L'AVATAR ORIGINAL ---
    this.createAvatar(padding, 40);

    const statsData = [
      { key: "hp", label: "VIE", color: 0x4caf50 },
      { key: "damage", label: "DÉGÂT", color: 0xff4d4d },
      { key: "attack_interval_ms", label: "VIT. DE FRAPPE", color: 0xffaa00 },
      { key: "move_speed", label: "AGILITÉ", color: 0x00eaff },
    ];

    const statsStartX = padding + this.config.avatarSize + 25;
    statsData.forEach((stat, idx) => {
      this.createStatRow(stat, statsStartX, 65 + idx * this.config.rowHeight);
    });

    // --- TEXTES DU BAS ---
    this.pointsText = this.scene.add
      .text(width / 2, height - 115, "", {
        fontSize: "18px",
        fontFamily: "Orbitron, sans-serif",
        color: "#7dd0ff",
        fontWeight: "bold",
        resolution,
      })
      .setOrigin(0.5);

    this.lockedText = this.scene.add
      .text(width / 2, height - 90, "", {
        fontSize: "15px",
        fontFamily: "Orbitron, sans-serif",
        color: "#ffb347",
        fontWeight: "bold",
        resolution,
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.unlockButton = this.scene.add
      .container(width / 2, height - 60)
      .setVisible(false);
    const unlockBg = this.scene.add.graphics();
    const unlockW = 220;
    const unlockH = 38;
    const drawUnlockBg = (hover) => {
      unlockBg.clear();
      unlockBg.fillStyle(0x1a2639, hover ? 0.9 : 0.7);
      unlockBg.lineStyle(2, 0x00eaff, hover ? 1 : 0.7);
      unlockBg.fillRoundedRect(-unlockW / 2, -unlockH / 2, unlockW, unlockH, 10);
      unlockBg.strokeRoundedRect(-unlockW / 2, -unlockH / 2, unlockW, unlockH, 10);
    };
    drawUnlockBg(false);
    this.unlockText = this.scene.add
      .text(0, 0, "DÉBLOQUER", {
        fontSize: "16px",
        fontFamily: "Orbitron, sans-serif",
        color: "#ffffff",
        fontWeight: "bold",
        resolution,
      })
      .setOrigin(0.5);
    this.unlockButton.add([unlockBg, this.unlockText]);
    this.unlockButton.setSize(unlockW, unlockH).setInteractive({ useHandCursor: true });
    this.unlockButton
      .on("pointerover", () => drawUnlockBg(true))
      .on("pointerout", () => drawUnlockBg(false))
      .on("pointerdown", () => this.handleUnlock());

    this.costText = this.scene.add
      .text(width / 2, height - 25, "", {
        fontSize: "12px",
        fontFamily: "Arial",
        color: "#aaaaaa",
        resolution,
      })
      .setOrigin(0.5);

    // --- BOUTONS D'ACTION (ANNULER & VALIDER) ---
    const buttonY = height - 60;

    // 1. Bouton Annuler (Rouge)
    this.globalCancelBtn = this.scene.add.container(width / 2 - 70, buttonY);
    const cancelBg = this.scene.add.graphics();
    this.drawButtonBg(cancelBg, 0xff4d4d, 0.3);

    const cancelIcon = this.scene.add
      .text(0, 0, "X ANNULER", {
        fontSize: "16px",
        fontFamily: "Arial",
        color: "#ff4d4d",
        fontWeight: "bold",
        resolution,
      })
      .setOrigin(0.5);

    this.globalCancelBtn.add([cancelBg, cancelIcon]);
    this.globalCancelBtn
      .setSize(130, 36)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);

    this.globalCancelBtn.on("pointerover", () =>
      this.drawButtonBg(cancelBg, 0xff4d4d, 0.6)
    );
    this.globalCancelBtn.on("pointerout", () =>
      this.drawButtonBg(cancelBg, 0xff4d4d, 0.3)
    );
    this.globalCancelBtn.on("pointerdown", () => this.cancelUpgrades());

    // 2. Bouton Valider (Vert)
    this.globalValidateBtn = this.scene.add.container(width / 2 + 70, buttonY);
    const validateBg = this.scene.add.graphics();
    this.drawButtonBg(validateBg, 0x4caf50, 0.3);

    const validateIcon = this.scene.add
      .text(0, 0, "✓ VALIDER", {
        fontSize: "16px",
        fontFamily: "Arial",
        color: "#4caf50",
        fontWeight: "bold",
        resolution,
      })
      .setOrigin(0.5);

    this.globalValidateBtn.add([validateBg, validateIcon]);
    this.globalValidateBtn
      .setSize(130, 36)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);

    this.globalValidateBtn.on("pointerover", () =>
      this.drawButtonBg(validateBg, 0x4caf50, 0.6)
    );
    this.globalValidateBtn.on("pointerout", () =>
      this.drawButtonBg(validateBg, 0x4caf50, 0.3)
    );
    this.globalValidateBtn.on("pointerdown", () => this.confirmAllUpgrades());

    this.add([
      this.pointsText,
      this.costText,
      this.lockedText,
      this.unlockButton,
      this.globalCancelBtn,
      this.globalValidateBtn,
    ]);
  }

  drawButtonBg(graphics, color, alpha) {
    graphics.clear();
    graphics.fillStyle(color, alpha);
    graphics.lineStyle(2, color, 1);
    graphics.fillRoundedRect(-65, -18, 130, 36, 8);
    graphics.strokeRoundedRect(-65, -18, 130, 36, 8);
  }

  async cycleHero(direction) {
    const list = getAvailableHeroes();
    if (!list || list.length === 0) return;
    const currentId = getSelectedHeroId();
    const currentIndex = Math.max(
      0,
      list.findIndex((h) => Number(h.id) === Number(currentId ?? list[0]?.id))
    );
    const nextIndex = (currentIndex + direction + list.length) % list.length;
    const nextHero = list[nextIndex];
    if (!nextHero) return;
    try {
      await selectHero(nextHero.id);
      this.refresh();
    } catch (err) {
      console.error("Impossible de changer de héros", err);
    }
  }

  // --- FONCTIONS DE DESSIN DE L'AVATAR ORIGINALES ---
  hexToNumber(hex) {
    if (!hex) return 0x2b2b2b;
    const cleanHex = hex.replace("#", "");
    return parseInt(cleanHex, 16);
  }

  createAvatar(x, y) {
    const size = this.config.avatarSize;
    const resolution = window.devicePixelRatio || 1;
    const container = this.scene.add.container(x, y);

    const frame = this.scene.add.graphics();
    frame.lineStyle(2, this.config.accentColor, 0.5);
    frame.strokeRect(-2, -2, size + 4, size + 4);
    frame.fillStyle(0x1a2a3a, 1);
    frame.fillRect(0, 0, size, size);

    const scale = size / 50;
    const centerX = size / 2;
    const centerY = size / 2;

    frame.fillStyle(0x000000, 0.18);
    frame.fillEllipse(centerX, centerY + 18 * scale, 26 * scale, 10 * scale);

    frame.fillStyle(0x151526, 0.92);
    frame.fillEllipse(
      centerX - 2 * scale,
      centerY + 8 * scale,
      22 * scale,
      30 * scale
    );
    frame.fillStyle(0x0d0d18, 0.35);
    frame.fillEllipse(
      centerX - 6 * scale,
      centerY + 10 * scale,
      14 * scale,
      24 * scale
    );

    const stats = getHeroStats();
    const heroColor = stats?.color || "#2b2b2b";
    const chestplateColor = this.hexToNumber(heroColor);
    frame.fillStyle(chestplateColor, 1);
    frame.fillRoundedRect(
      centerX - 12 * scale,
      centerY - 18 * scale,
      24 * scale,
      34 * scale,
      7 * scale
    );
    frame.lineStyle(2 * scale, 0x242424, 1);
    frame.strokeRoundedRect(
      centerX - 12 * scale,
      centerY - 18 * scale,
      24 * scale,
      34 * scale,
      7 * scale
    );

    frame.lineStyle(2 * scale, 0x6a6a6a, 0.6);
    frame.beginPath();
    frame.moveTo(centerX, centerY - 16 * scale);
    frame.lineTo(centerX, centerY + 10 * scale);
    frame.strokePath();

    frame.fillStyle(0x7a7a7a, 1);
    frame.fillCircle(centerX - 11 * scale, centerY - 12 * scale, 7 * scale);
    frame.fillCircle(centerX + 11 * scale, centerY - 12 * scale, 7 * scale);
    frame.lineStyle(2 * scale, 0x2a2a2a, 0.9);
    frame.strokeCircle(centerX - 11 * scale, centerY - 12 * scale, 7 * scale);
    frame.strokeCircle(centerX + 11 * scale, centerY - 12 * scale, 7 * scale);

    frame.fillStyle(0x8b5a2b, 1);
    frame.fillRoundedRect(
      centerX - 12 * scale,
      centerY + 6 * scale,
      24 * scale,
      5 * scale,
      2 * scale
    );
    frame.fillStyle(0xd2b48c, 0.9);
    frame.fillRect(
      centerX - 2 * scale,
      centerY + 6 * scale,
      4 * scale,
      5 * scale
    );

    frame.fillStyle(0xffd4a3, 1);
    frame.fillCircle(centerX, centerY - 24 * scale, 8 * scale);

    const hatColor = this.hexToNumber(heroColor);
    frame.fillStyle(hatColor, 1);
    frame.fillRoundedRect(
      centerX - 10 * scale,
      centerY - 33 * scale,
      20 * scale,
      8 * scale,
      3 * scale
    );

    frame.fillStyle(0x111111, 0.9);
    frame.fillCircle(centerX - 3.2 * scale, centerY - 24 * scale, 1.1 * scale);
    frame.fillCircle(centerX + 3.2 * scale, centerY - 24 * scale, 1.1 * scale);
  }

  drawNinjaAvatarBody(frame, centerX, centerY, scale, heroColor) {
    // Tenue ninja
    frame.fillStyle(0x1a1a2e, 0.85);
    frame.fillEllipse(centerX - 1 * scale, centerY + 6 * scale, 18 * scale, 28 * scale);
    frame.fillStyle(0x0f0f1a, 0.4);
    frame.fillEllipse(centerX - 4 * scale, centerY + 8 * scale, 12 * scale, 22 * scale);

    const ninjaColor = this.hexToNumber(heroColor);
    frame.fillStyle(ninjaColor, 1);
    frame.fillRoundedRect(
      centerX - 10 * scale,
      centerY - 16 * scale,
      20 * scale,
      32 * scale,
      5 * scale
    );
    frame.lineStyle(1.5 * scale, 0x1a1a1a, 1);
    frame.strokeRoundedRect(
      centerX - 10 * scale,
      centerY - 16 * scale,
      20 * scale,
      32 * scale,
      5 * scale
    );

    frame.lineStyle(1.5 * scale, 0x4a4a4a, 0.7);
    frame.beginPath();
    frame.moveTo(centerX - 8 * scale, centerY - 12 * scale);
    frame.lineTo(centerX + 8 * scale, centerY + 8 * scale);
    frame.moveTo(centerX + 8 * scale, centerY - 12 * scale);
    frame.lineTo(centerX - 8 * scale, centerY + 8 * scale);
    frame.strokePath();

    frame.fillStyle(0x2a2a2a, 1);
    frame.fillRoundedRect(
      centerX - 10 * scale,
      centerY + 4 * scale,
      20 * scale,
      4 * scale,
      1 * scale
    );
    frame.fillStyle(0x4a4a4a, 0.8);
    frame.fillRect(
      centerX - 1 * scale,
      centerY + 4 * scale,
      2 * scale,
      4 * scale
    );

    frame.fillStyle(0xffd4a3, 1);
    frame.fillCircle(centerX, centerY - 22 * scale, 7 * scale);

    frame.fillStyle(0x1a1a1a, 1);
    frame.fillRoundedRect(
      centerX - 9 * scale,
      centerY - 30 * scale,
      18 * scale,
      6 * scale,
      2 * scale
    );
    frame.fillStyle(0x111111, 0.95);
    frame.fillRect(centerX - 6 * scale, centerY - 28 * scale, 3 * scale, 2 * scale);
    frame.fillRect(centerX + 3 * scale, centerY - 28 * scale, 3 * scale, 2 * scale);
  }

  drawSwordAvatar(container, centerX, centerY, scale) {
    const swordPivotX = centerX + 12 * scale;
    const swordPivotY = centerY - 4 * scale;
    const swordPivot = this.scene.add.container(swordPivotX, swordPivotY);
    swordPivot.setRotation(-0.3);
    swordPivot.setDepth(10);

    const sword = this.scene.add.graphics();
    sword.fillStyle(0xd6d6d6, 1);
    sword.fillRoundedRect(0, -2 * scale, 22 * scale, 5 * scale, 2 * scale);
    sword.fillStyle(0xffffff, 0.75);
    sword.fillRoundedRect(0, -2 * scale, 22 * scale, 2.2 * scale, 2 * scale);
    sword.fillStyle(0xcfcfcf, 1);
    sword.fillTriangle(
      22 * scale,
      -2 * scale,
      28 * scale,
      0.5 * scale,
      22 * scale,
      3 * scale
    );
    sword.fillStyle(0x6b3d18, 1);
    sword.fillRoundedRect(
      -4 * scale,
      -4.2 * scale,
      6 * scale,
      9 * scale,
      2 * scale
    );
    sword.fillStyle(0x8b4513, 1);
    sword.fillRoundedRect(
      -8 * scale,
      -2.5 * scale,
      5 * scale,
      6 * scale,
      2 * scale
    );
    sword.fillStyle(0x3b2210, 0.55);
    sword.fillRect(-7.2 * scale, -2.2 * scale, 3.5 * scale, 0.8 * scale);
    sword.fillRect(-7.2 * scale, -0.6 * scale, 3.5 * scale, 0.8 * scale);
    sword.fillRect(-7.2 * scale, 1.0 * scale, 3.5 * scale, 0.8 * scale);
    sword.fillStyle(0xbdbdbd, 1);
    sword.fillCircle(-9.2 * scale, 0.5 * scale, 2.2 * scale);

    swordPivot.add(sword);
    container.add(swordPivot);
  }

  drawDaggersAvatar(container, centerX, centerY, scale) {
    // Première dague (droite)
    const dagger1PivotX = centerX + 10 * scale;
    const dagger1PivotY = centerY - 2 * scale;
    const dagger1Pivot = this.scene.add.container(dagger1PivotX, dagger1PivotY);
    dagger1Pivot.setRotation(-0.2);
    dagger1Pivot.setDepth(10);

    const dagger1 = this.scene.add.graphics();
    dagger1.fillStyle(0xc0c0c0, 1);
    dagger1.fillRoundedRect(0, -1.5 * scale, 14 * scale, 3 * scale, 1 * scale);
    dagger1.fillStyle(0xffffff, 0.8);
    dagger1.fillRoundedRect(0, -1.5 * scale, 14 * scale, 1.5 * scale, 1 * scale);
    dagger1.fillStyle(0xa0a0a0, 1);
    dagger1.fillTriangle(14 * scale, -1.5 * scale, 18 * scale, 0, 14 * scale, 1.5 * scale);
    dagger1.fillStyle(0x4a4a4a, 1);
    dagger1.fillRoundedRect(-2 * scale, -2.5 * scale, 4 * scale, 5 * scale, 1 * scale);
    dagger1.fillStyle(0x2a2a2a, 1);
    dagger1.fillRoundedRect(-4 * scale, -1.5 * scale, 3 * scale, 3 * scale, 1 * scale);
    dagger1.fillStyle(0x1a1a1a, 0.7);
    dagger1.fillRect(-3.5 * scale, -1.2 * scale, 2 * scale, 0.6 * scale);
    dagger1.fillRect(-3.5 * scale, 0.3 * scale, 2 * scale, 0.6 * scale);
    dagger1.fillStyle(0x5a5a5a, 1);
    dagger1.fillCircle(-5 * scale, 0, 1.5 * scale);

    dagger1Pivot.add(dagger1);
    container.add(dagger1Pivot);

    // Deuxième dague (gauche)
    const dagger2PivotX = centerX - 10 * scale;
    const dagger2PivotY = centerY - 2 * scale;
    const dagger2Pivot = this.scene.add.container(dagger2PivotX, dagger2PivotY);
    dagger2Pivot.setRotation(0.2);
    dagger2Pivot.setDepth(10);

    const dagger2 = this.scene.add.graphics();
    dagger2.fillStyle(0xc0c0c0, 1);
    dagger2.fillRoundedRect(0, -1.5 * scale, 14 * scale, 3 * scale, 1 * scale);
    dagger2.fillStyle(0xffffff, 0.8);
    dagger2.fillRoundedRect(0, -1.5 * scale, 14 * scale, 1.5 * scale, 1 * scale);
    dagger2.fillStyle(0xa0a0a0, 1);
    dagger2.fillTriangle(14 * scale, -1.5 * scale, 18 * scale, 0, 14 * scale, 1.5 * scale);
    dagger2.fillStyle(0x4a4a4a, 1);
    dagger2.fillRoundedRect(-2 * scale, -2.5 * scale, 4 * scale, 5 * scale, 1 * scale);
    dagger2.fillStyle(0x2a2a2a, 1);
    dagger2.fillRoundedRect(-4 * scale, -1.5 * scale, 3 * scale, 3 * scale, 1 * scale);
    dagger2.fillStyle(0x1a1a1a, 0.7);
    dagger2.fillRect(-3.5 * scale, -1.2 * scale, 2 * scale, 0.6 * scale);
    dagger2.fillRect(-3.5 * scale, 0.3 * scale, 2 * scale, 0.6 * scale);
    dagger2.fillStyle(0x5a5a5a, 1);
    dagger2.fillCircle(-5 * scale, 0, 1.5 * scale);

    dagger2Pivot.add(dagger2);
    container.add(dagger2Pivot);
  }

  createAvatar(x, y) {
    // Si un avatar existe déjà, le détruire d'abord
    if (this.avatarContainer) {
      this.avatarContainer.destroy();
      this.avatarContainer = null;
      this.avatarFrame = null;
    }
    
    const size = this.config.avatarSize;
    const container = this.scene.add.container(x, y);

    const frame = this.scene.add.graphics();
    frame.lineStyle(2, this.config.accentColor, 0.5);
    frame.strokeRect(-2, -2, size + 4, size + 4);
    frame.fillStyle(0x1a2a3a, 1);
    frame.fillRect(0, 0, size, size);

    const scale = size / 50;
    const centerX = size / 2;
    const centerY = size / 2;

    frame.fillStyle(0x000000, 0.18);
    frame.fillEllipse(centerX, centerY + 18 * scale, 26 * scale, 10 * scale);

    frame.fillStyle(0x151526, 0.92);
    frame.fillEllipse(
      centerX - 2 * scale,
      centerY + 8 * scale,
      22 * scale,
      30 * scale
    );
    frame.fillStyle(0x0d0d18, 0.35);
    frame.fillEllipse(
      centerX - 6 * scale,
      centerY + 10 * scale,
      14 * scale,
      24 * scale
    );

    const stats = getHeroStats();
    const heroColor = stats?.color || "#2b2b2b";
    const heroId = stats?.hero_id ?? 1;

    // Dessiner le corps selon le hero_id
    if (heroId === 2) {
      // Pirlov dagues - Ninja
      this.drawNinjaAvatarBody(frame, centerX, centerY, scale, heroColor);
    } else {
      // Pulskar l'épéiste (hero_id = 1) ou autres - Chevalier
      this.drawKnightAvatarBody(frame, centerX, centerY, scale, heroColor);
    }

    container.add(frame);

    // Dessiner les armes selon le hero_id
    if (heroId === 2) {
      // Deux dagues
      this.drawDaggersAvatar(container, centerX, centerY, scale);
    } else {
      // Épée
      this.drawSwordAvatar(container, centerX, centerY, scale);
    }

    this.add(container);

    this.killsText = this.scene.add
      .text(x + size / 2, y + size + 15, "", {
        fontSize: "15px",
        fontFamily: "Arial",
        color: "#ff6b6b",
        fontWeight: "bold",
        resolution,
      })
      .setOrigin(0.5);
    this.add(this.killsText);

    this.avatarFrame = frame;
    this.avatarContainer = container; // Stocker la référence au container pour pouvoir supprimer les armes
  }

  redrawAvatar(color) {
    const size = this.config.avatarSize;
    const scale = size / 50;
    const centerX = size / 2;
    const centerY = size / 2;
    const stats = getHeroStats();
    const heroId = stats?.hero_id ?? 1;

    // Nettoyer le frame
    this.avatarFrame.clear();

    this.avatarFrame.lineStyle(2, this.config.accentColor, 0.5);
    this.avatarFrame.strokeRect(-2, -2, size + 4, size + 4);
    this.avatarFrame.fillStyle(0x1a2a3a, 1);
    this.avatarFrame.fillRect(0, 0, size, size);

    // Ombre au sol
    this.avatarFrame.fillStyle(0x000000, 0.18);
    this.avatarFrame.fillEllipse(
      centerX,
      centerY + 18 * scale,
      26 * scale,
      10 * scale
    );

    // Dessiner le corps selon le hero_id
    if (heroId === 2) {
      // Pirlov dagues - Ninja
      this.drawNinjaAvatarBody(this.avatarFrame, centerX, centerY, scale, color);
    } else {
      // Pulskar l'épéiste (hero_id = 1) ou autres - Chevalier
      this.drawKnightAvatarBody(this.avatarFrame, centerX, centerY, scale, color);
    }

    // Supprimer toutes les armes existantes du container (garder seulement le frame)
    if (this.avatarContainer) {
      const children = this.avatarContainer.list.slice(); // Copie de la liste
      children.forEach(child => {
        // Supprimer tout sauf le frame
        if (child !== this.avatarFrame) {
          child.destroy();
        }
      });
      // S'assurer que le frame est toujours dans le container
      if (!this.avatarContainer.list.includes(this.avatarFrame)) {
        this.avatarContainer.add(this.avatarFrame);
      }
    }

    // Redessiner les armes selon le hero_id actuel
    if (this.avatarContainer) {
      if (heroId === 2) {
        // Deux dagues
        this.drawDaggersAvatar(this.avatarContainer, centerX, centerY, scale);
      } else {
        // Épée
        this.drawSwordAvatar(this.avatarContainer, centerX, centerY, scale);
      }
    }
  }
  // ---------------------------------------------------------

  createStatRow(stat, x, y) {
    const barWidth = 200;
    const resolution = window.devicePixelRatio || 1;

    const label = this.scene.add.text(x, y - 22, stat.label, {
      fontSize: "13px",
      fontWeight: "bold",
      color: "#ffffff",
      resolution,
    });

    const valText = this.scene.add
      .text(x + barWidth, y - 22, "0", {
        fontSize: "14px",
        color: "#00eaff",
        fontWeight: "bold",
        resolution,
      })
      .setOrigin(1, 0);

    const conversionText = this.scene.add.text(x, y + 18, "", {
      fontSize: "11px",
      color: "#7dd0ff",
      fontStyle: "italic",
      resolution,
    });

    // Afficher le maximum de la stat au-dessus de la barre (blanc avec bordure noire)
    const maxText = this.scene.add.text(x + barWidth / 2, y - 15, "", {
      fontSize: "10px",
      color: "#ffffff",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 3,
      resolution,
    }).setOrigin(0.5, 0);

    const barBg = this.scene.add
      .graphics()
      .fillStyle(0xffffff, 0.1)
      .fillRoundedRect(x, y, barWidth, 12, 5);
    const barFill = this.scene.add.graphics();
    const barPending = this.scene.add.graphics();

    const btn = this.scene.add.container(x + barWidth + 25, y + 6);
    const btnBg = this.scene.add
      .circle(0, 0, 15, 0x00eaff, 0.2)
      .setStrokeStyle(1, 0x00eaff);
    const btnPlus = this.scene.add
      .text(0, 0, "+", {
        fontSize: "22px",
        color: "#00eaff",
        fontWeight: "bold",
        resolution,
      })
      .setOrigin(0.5);
    btn.add([btnBg, btnPlus]);
    btn.setSize(30, 30).setInteractive({ useHandCursor: true });

    // --- GESTION DU LONG PRESS ---
    btn.on("pointerdown", () => this.startContinuousUpgrade(stat.key));
    btn.on("pointerup", () => this.stopContinuousUpgrade());
    btn.on("pointerout", () => this.stopContinuousUpgrade());

    btn.on("pointerover", () => {
      if (btn.input.enabled) btnBg.setFillStyle(0x00eaff, 0.5);
    });
    btn.on("pointerout", () => {
      if (btn.input.enabled) btnBg.setFillStyle(0x00eaff, 0.2);
      this.stopContinuousUpgrade();
    });

    this.statElements.set(stat.key, {
      valText,
      barFill,
      barPending,
      conversionText,
      maxText,
      color: stat.color,
      x,
      y,
      barWidth,
      btn,
    });

    this.add([label, valText, conversionText, maxText, barBg, barFill, barPending, btn]);
  }

  startContinuousUpgrade(key) {
    this.handlePendingUpgrade(key);
    this.holdTimer = this.scene.time.addEvent({
      delay: 400,
      callback: () => {
        this.holdTimer = this.scene.time.addEvent({
          delay: 70, // Vitesse d'incrémentation rapide
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

    const stats = getHeroStats();
    const conversion = getHeroPointConversion();
    if (!stats || !conversion) {
      this.stopContinuousUpgrade();
      return;
    }

    const available = getHeroPointsAvailable();
    const totalPending = Object.values(this.pendingUpgrades).reduce(
      (a, b) => a + b,
      0
    );
    if (totalPending >= available) {
      this.stopContinuousUpgrade();
      return;
    }

    // Vérification du maximum absolu
    const conversionMap = {
      hp: "hp_per_point",
      damage: "damage_per_point",
      move_speed: "move_speed_per_point",
      attack_interval_ms: "attack_interval_ms_per_point",
    };

    const currentVal =
      (key === "hp"
        ? Number(stats?.max_hp) || 0
        : key === "damage"
        ? parseFloat(stats?.base_damage) || 0
        : key === "attack_interval_ms"
        ? Number(stats?.attack_interval_ms) || 1500
        : Number(stats?.move_speed) || 0);
    const pendingPoints = this.pendingUpgrades[key];
    const convValue = Number(conversion?.[conversionMap[key]] || 0);
    if (convValue <= 0) {
      this.stopContinuousUpgrade();
      return;
    }
    const projectedValue =
      parseFloat(currentVal) + (pendingPoints + 1) * convValue;

    const capValue = this.config.maxValues[key];
    if (capValue !== null && capValue !== undefined && projectedValue > capValue) {
      this.stopContinuousUpgrade();
      return;
    }

    this.pendingUpgrades[key]++;
    this.updateBarVisuals(key);
    this.updatePointsDisplay();
    this.updateValidateButtonsState();
  }

  updateBarVisuals(statKey) {
    const el = this.statElements.get(statKey);
    const stats = getHeroStats();
    if (!stats) {
      el.barFill.clear();
      el.barPending.clear();
      el.valText.setText("—");
      return;
    }
    const values = {
      hp: Number(stats?.max_hp) || 0,
      damage: Number(parseFloat(stats?.base_damage) || 0),
      attack_interval_ms: Number(stats?.attack_interval_ms) || 1500,
      move_speed: Number(stats?.move_speed) || 0,
    };
    const max = this.config.maxValues[statKey] || values[statKey] || 1;

    const conversion = getHeroPointConversion();
    const conversionMap = {
      hp: "hp_per_point",
      damage: "damage_per_point",
      move_speed: "move_speed_per_point",
      attack_interval_ms: "attack_interval_ms_per_point",
    };

    const baseValue = values[statKey];
    const pendingPoints = this.pendingUpgrades[statKey];
    const convValue = parseFloat(conversion?.[conversionMap[statKey]] || 0);
    
    // Pour attack_interval_ms, on soustrait (plus bas = mieux)
    const pendingValue = statKey === "attack_interval_ms"
      ? Math.max(min || 0, baseValue - pendingPoints * convValue)
      : baseValue + pendingPoints * convValue;

    // Pour attack_interval_ms, on inverse la logique (plus bas = mieux)
    const range = statKey === "attack_interval_ms" 
      ? (max - (min || 0))
      : max;
    const baseScale = statKey === "attack_interval_ms"
      ? Phaser.Math.Clamp(1 - (baseValue - (min || 0)) / range, 0, 1)
      : Phaser.Math.Clamp(baseValue / max, 0, 1);
    const pendingScale = statKey === "attack_interval_ms"
      ? Phaser.Math.Clamp(1 - (pendingValue - (min || 0)) / range, 0, 1)
      : Phaser.Math.Clamp(pendingValue / max, 0, 1);

    el.barFill
      .clear()
      .fillStyle(el.color, 1)
      .fillRoundedRect(el.x, el.y, el.barWidth * baseScale, 12, 5);
    el.barPending.clear();

    if (pendingPoints > 0) {
      el.barPending
        .fillStyle(el.color, 0.4)
        .fillRoundedRect(
          el.x + el.barWidth * baseScale,
          el.y,
          el.barWidth * (pendingScale - baseScale),
          12,
          5
        );
      const displayVal =
        statKey === "damage"
          ? (Number(pendingValue) || 0).toFixed(2)
          : statKey === "attack_interval_ms"
          ? `${truncateDecimals((Number(pendingValue) || 0) / 1000, 5).toFixed(5)}s`
          : Math.round(Number(pendingValue) || 0);
      const sign = statKey === "attack_interval_ms" ? "-" : "+";
      el.valText
        .setText(`${displayVal} (${sign}${pendingPoints})`)
        .setColor("#ffaa00");
    } else {
      const displayVal =
        statKey === "damage"
          ? (Number(baseValue) || 0).toFixed(2)
          : statKey === "attack_interval_ms"
          ? `${truncateDecimals((Number(baseValue) || 0) / 1000, 5).toFixed(5)}s`
          : Math.round(Number(baseValue) || 0);
      el.valText
        .setText(displayVal)
        .setColor("#00eaff");
    }
  }

  updatePointsDisplay() {
    const available = getHeroPointsAvailable();
    const totalPending = Object.values(this.pendingUpgrades).reduce(
      (a, b) => a + b,
      0
    );
    const remaining = available - totalPending;
    this.pointsText.setText(
      totalPending > 0
        ? `POINTS : ${remaining} / ${available}`
        : `POINTS DISPONIBLES : ${available}`
    );
  }

  updateValidateButtonsState() {
    const totalPending = Object.values(this.pendingUpgrades).reduce(
      (a, b) => a + b,
      0
    );
    const show = totalPending > 0;
    this.globalValidateBtn.setVisible(show);
    this.globalCancelBtn.setVisible(show);
    this.costText.setText(
      show
        ? "Valider ou Annuler les changements"
        : "Maintenez '+' pour allouer plusieurs points"
    );
  }

  // --- NOUVELLE FONCTION ANNULER ---
  cancelUpgrades() {
    this.scene.cameras.main.shake(50, 0.002);
    this.pendingUpgrades = { hp: 0, damage: 0, move_speed: 0, attack_interval_ms: 0 };
    this.refresh();
  }

  async confirmAllUpgrades() {
    if (!getHeroStats()) return;
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

  async handleUnlock() {
    if (!isAuthenticated()) {
      showAuth();
      return;
    }
    try {
      await unlockHero(getSelectedHeroId());
      await ensureHeroContext(getSelectedHeroId());
      this.scene.cameras.main.flash(120, 0, 234, 255);
      this.refresh();
    } catch (err) {
      console.error("Erreur déblocage héros", err);
    }
  }

  refresh() {
    const stats = getHeroStats();
    const heroes = getAvailableHeroes();
    const selectedHero = heroes.find((h) => Number(h.id) === Number(getSelectedHeroId()));
    if (this.heroNameText) {
      const name = selectedHero?.name || "Sélectionnez un héros";
      this.heroNameText.setText(name.toUpperCase());
    }
    const hasMultipleHeroes = heroes.length > 1;
    if (this.heroNavLeft) this.heroNavLeft.setVisible(hasMultipleHeroes);
    if (this.heroNavRight) this.heroNavRight.setVisible(hasMultipleHeroes);
    const locked = isHeroLocked();
    const unlockCost = getHeroUnlockCost();
    if (this.lockedText) {
      this.lockedText.setVisible(locked);
      if (locked) {
        const costTxt = unlockCost > 0 ? `${unlockCost} pts` : "gratuit";
        this.lockedText.setText(`HÉROS VERROUILLÉ (${costTxt})`);
      }
    }
    if (this.unlockButton) {
      this.unlockButton.setVisible(locked);
      const available = getHeroPointsAvailable();
      const canAfford = (unlockCost ?? 0) <= available;
      this.unlockButton.setAlpha(canAfford ? 1 : 0.4);
      this.unlockButton.list?.forEach?.((child) => {
        if (child.setFillStyle) child.setFillStyle(child.fillColor || 0xffffff, canAfford ? child.alpha : 0.4);
      });
      this.unlockButton.input.enabled = canAfford;
      if (this.unlockText) {
        this.unlockText.setText(
          unlockCost && unlockCost > 0
            ? `DÉBLOQUER (${unlockCost} pts)`
            : "DÉBLOQUER GRATUITEMENT"
        );
      }
    }
    const caps = {
      hp: stats?.max_hp_cap ?? stats?.max_hp ?? this.config.maxValues.hp,
      damage: stats?.max_damage_cap ?? stats?.base_damage ?? this.config.maxValues.damage,
      move_speed:
        stats?.max_move_speed_cap ?? stats?.move_speed ?? this.config.maxValues.move_speed,
    };
    this.config.maxValues = caps;

    if (!stats) {
      const available = getHeroPointsAvailable();
      this.pointsText?.setText(`POINTS DISPONIBLES : ${available}`);
      this.costText?.setText(locked ? "Débloquez ce héros pour voir ses stats" : "");
      this.updateValidateButtonsState();
      this.statElements.forEach((el) => {
        el.btn.setAlpha(0.3);
        el.btn.input.enabled = false;
      });
      return;
    }
    const conversion = getHeroPointConversion();
    const heroLimits = getHeroLimits();
    
    // Vérifier si le hero_id a changé - si oui, recréer complètement l'avatar
    const currentHeroId = stats?.hero_id ?? 1;
    if (this.lastHeroId !== undefined && this.lastHeroId !== currentHeroId) {
      // Le héros a changé, détruire l'ancien avatar et en créer un nouveau
      if (this.avatarContainer) {
        this.avatarContainer.destroy();
        this.avatarContainer = null;
        this.avatarFrame = null;
      }
      // Détruire l'ancien killsText s'il existe pour éviter la superposition
      if (this.killsText) {
        this.killsText.destroy();
        this.killsText = null;
      }
      // Note: heroNameText n'est pas recréé car il est créé une seule fois dans le constructeur
      // et mis à jour via setText(), donc pas besoin de le détruire
      this.createAvatar(this.config.padding, 40);
    }
    this.lastHeroId = currentHeroId;
    
    // Mettre à jour les limites depuis le profil
    if (heroLimits) {
      this.config.maxValues = {
        hp: heroLimits.max_hp ?? 2500,
        damage: heroLimits.max_damage ?? 450,
        move_speed: heroLimits.max_move_speed ?? 200,
        attack_interval_ms: 1500, // Pas de max pour attack_interval_ms
      };
      this.config.minValues = {
        attack_interval_ms: heroLimits.min_attack_interval_ms ?? 500,
      };
    }
    
    // Important : on s'assure que les pending sont reset si on refresh depuis l'extérieur
    this.pendingUpgrades = { hp: 0, damage: 0, move_speed: 0, attack_interval_ms: 0 };

    const conversionMap = {
      hp: "hp_per_point",
      damage: "damage_per_point",
      move_speed: "move_speed_per_point",
      attack_interval_ms: "attack_interval_ms_per_point",
    };

    this.statElements.forEach((el, key) => {
      this.updateBarVisuals(key);
      const convVal = conversion?.[conversionMap[key]];
      if (convVal) {
        const sign = key === "attack_interval_ms" ? "-" : "+";
        el.conversionText.setText(`${sign}${parseFloat(convVal).toFixed(2)} / pt`);
      }

      // Désactiver le bouton si déjà au max/min
      const currentVal =
        (key === "hp"
          ? Number(stats?.max_hp) || 0
          : key === "damage"
          ? parseFloat(stats?.base_damage) || 0
          : key === "attack_interval_ms"
          ? Number(stats?.attack_interval_ms) || 1500
          : Number(stats?.move_speed) || 0);
      
      const isMax = key === "attack_interval_ms"
        ? currentVal <= (this.config.minValues?.attack_interval_ms || 500)
        : currentVal >= this.config.maxValues[key];
      
      if (isMax) {
        el.btn.setAlpha(0.3);
        el.btn.input.enabled = false;
      } else {
        el.btn.setAlpha(locked ? 0.3 : 1);
        el.btn.input.enabled = !locked;
      }
    });

    if (this.killsText) this.killsText.setText(`${stats.kills || 0}☠️`);
    this.updatePointsDisplay();
    this.updateValidateButtonsState();
    if (stats.color && this.avatarFrame) this.redrawAvatar(stats.color);
    
    // Mettre à jour le nom du héros
    this.updateHeroName();
  }

  async updateHeroName() {
    try {
      const heroId = getSelectedHeroId();
      const response = await fetchHeroes();
      // fetchHeroes retourne { heroes, heroPointsAvailable }
      const heroes = response?.heroes || [];
      const hero = Array.isArray(heroes) ? heroes.find(h => h.id === heroId) : null;
      if (hero && this.heroNameText) {
        this.heroNameText.setText(hero.name.toUpperCase());
      } else if (this.heroNameText) {
        // Fallback si pas trouvé
        this.heroNameText.setText("HÉROS");
      }
    } catch (error) {
      console.error("Erreur récupération nom héros:", error);
      if (this.heroNameText) {
        this.heroNameText.setText("HÉROS");
      }
    }
  }

}
