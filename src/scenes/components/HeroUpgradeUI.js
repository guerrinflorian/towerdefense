import {
  getHeroStats,
  getHeroPointsAvailable,
  getHeroPointConversion,
  queueHeroUpgrade,
  updateHeroColor,
  isAuthenticated,
} from "../../services/authManager.js";
import { showAuth } from "../../services/authOverlay.js";

export class HeroUpgradeUI extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.config = {
      width: 420,
      height: 380,
      padding: 20,
      accentColor: 0x00eaff,
      bgColor: 0x050a10,
      rowHeight: 60,
      avatarSize: 85,
      maxValues: { hp: 2500, damage: 450, move_speed: 200 },
    };

    this.statElements = new Map();
    this.pendingUpgrades = { hp: 0, damage: 0, move_speed: 0 };
    this.holdTimer = null;

    this.upgradeCompleteHandler = () => {
      this.refresh();
    };
    window.addEventListener(
      "hero:upgrade-complete",
      this.upgradeCompleteHandler
    );

    this.scene.events.once("shutdown", () => {
      this.stopContinuousUpgrade();
      window.removeEventListener(
        "hero:upgrade-complete",
        this.upgradeCompleteHandler
      );
    });

    this.setupMainPanel();
    this.refresh();

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

    // --- RESTAURATION DE L'AVATAR ORIGINAL ---
    this.createAvatar(padding, 40);

    const statsData = [
      { key: "hp", label: "INTÉGRITÉ (PV)", color: 0x4caf50 },
      { key: "damage", label: "PUISSANCE", color: 0xff4d4d },
      { key: "move_speed", label: "AGILITÉ", color: 0x00eaff },
    ];

    const statsStartX = padding + this.config.avatarSize + 25;
    statsData.forEach((stat, idx) => {
      this.createStatRow(stat, statsStartX, 65 + idx * this.config.rowHeight);
    });

    // --- TEXTES DU BAS ---
    this.pointsText = this.scene.add
      .text(width / 2, height - 95, "", {
        fontSize: "18px",
        fontFamily: "Orbitron, sans-serif",
        color: "#7dd0ff",
        fontWeight: "bold",
        resolution,
      })
      .setOrigin(0.5);

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

  // --- FONCTIONS DE DESSIN DE L'AVATAR ORIGINALES ---
  hexToNumber(hex) {
    if (!hex) return 0x2b2b2b;
    const cleanHex = hex.replace("#", "");
    return parseInt(cleanHex, 16);
  }

  createAvatar(x, y) {
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

    container.add(frame);

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

    this.add(container);

    const penBtn = this.scene.add.container(x + size - 5, y + 5);
    const penBg = this.scene.add
      .circle(0, 0, 12, 0x00eaff, 0.2)
      .setStrokeStyle(1, 0x00eaff);
    const resolution = window.devicePixelRatio || 1;
    const penIcon = this.scene.add
      .text(0, 0, "✏️", { fontSize: "14px", resolution })
      .setOrigin(0.5);
    penBtn.add([penBg, penIcon]);
    penBtn.setSize(24, 24).setInteractive({ useHandCursor: true });

    penBtn.on("pointerover", () => penBg.setFillStyle(0x00eaff, 0.5));
    penBtn.on("pointerout", () => penBg.setFillStyle(0x00eaff, 0.2));
    penBtn.on("pointerdown", () => this.openColorPicker());

    this.add(penBtn);

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
  }

  redrawAvatar(color) {
    const size = this.config.avatarSize;
    const scale = size / 50;
    const centerX = size / 2;
    const centerY = size / 2;
    const hatColor = this.hexToNumber(color);
    const chestplateColor = this.hexToNumber(color);

    this.avatarFrame.clear();

    this.avatarFrame.lineStyle(2, this.config.accentColor, 0.5);
    this.avatarFrame.strokeRect(-2, -2, size + 4, size + 4);
    this.avatarFrame.fillStyle(0x1a2a3a, 1);
    this.avatarFrame.fillRect(0, 0, size, size);

    this.avatarFrame.fillStyle(0x000000, 0.18);
    this.avatarFrame.fillEllipse(
      centerX,
      centerY + 18 * scale,
      26 * scale,
      10 * scale
    );

    this.avatarFrame.fillStyle(0x151526, 0.92);
    this.avatarFrame.fillEllipse(
      centerX - 2 * scale,
      centerY + 8 * scale,
      22 * scale,
      30 * scale
    );
    this.avatarFrame.fillStyle(0x0d0d18, 0.35);
    this.avatarFrame.fillEllipse(
      centerX - 6 * scale,
      centerY + 10 * scale,
      14 * scale,
      24 * scale
    );

    this.avatarFrame.fillStyle(chestplateColor, 1);
    this.avatarFrame.fillRoundedRect(
      centerX - 12 * scale,
      centerY - 18 * scale,
      24 * scale,
      34 * scale,
      7 * scale
    );
    this.avatarFrame.lineStyle(2 * scale, 0x242424, 1);
    this.avatarFrame.strokeRoundedRect(
      centerX - 12 * scale,
      centerY - 18 * scale,
      24 * scale,
      34 * scale,
      7 * scale
    );

    this.avatarFrame.lineStyle(2 * scale, 0x6a6a6a, 0.6);
    this.avatarFrame.beginPath();
    this.avatarFrame.moveTo(centerX, centerY - 16 * scale);
    this.avatarFrame.lineTo(centerX, centerY + 10 * scale);
    this.avatarFrame.strokePath();

    this.avatarFrame.fillStyle(0x7a7a7a, 1);
    this.avatarFrame.fillCircle(
      centerX - 11 * scale,
      centerY - 12 * scale,
      7 * scale
    );
    this.avatarFrame.fillCircle(
      centerX + 11 * scale,
      centerY - 12 * scale,
      7 * scale
    );
    this.avatarFrame.lineStyle(2 * scale, 0x2a2a2a, 0.9);
    this.avatarFrame.strokeCircle(
      centerX - 11 * scale,
      centerY - 12 * scale,
      7 * scale
    );
    this.avatarFrame.strokeCircle(
      centerX + 11 * scale,
      centerY - 12 * scale,
      7 * scale
    );

    this.avatarFrame.fillStyle(0x8b5a2b, 1);
    this.avatarFrame.fillRoundedRect(
      centerX - 12 * scale,
      centerY + 6 * scale,
      24 * scale,
      5 * scale,
      2 * scale
    );
    this.avatarFrame.fillStyle(0xd2b48c, 0.9);
    this.avatarFrame.fillRect(
      centerX - 2 * scale,
      centerY + 6 * scale,
      4 * scale,
      5 * scale
    );

    this.avatarFrame.fillStyle(0xffd4a3, 1);
    this.avatarFrame.fillCircle(centerX, centerY - 24 * scale, 8 * scale);

    this.avatarFrame.fillStyle(hatColor, 1);
    this.avatarFrame.fillRoundedRect(
      centerX - 10 * scale,
      centerY - 33 * scale,
      20 * scale,
      8 * scale,
      3 * scale
    );

    this.avatarFrame.fillStyle(0x111111, 0.9);
    this.avatarFrame.fillCircle(
      centerX - 3.2 * scale,
      centerY - 24 * scale,
      1.1 * scale
    );
    this.avatarFrame.fillCircle(
      centerX + 3.2 * scale,
      centerY - 24 * scale,
      1.1 * scale
    );
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
      color: stat.color,
      x,
      y,
      barWidth,
      btn,
    });

    this.add([label, valText, conversionText, barBg, barFill, barPending, btn]);
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
    const stats = getHeroStats();
    const conversion = getHeroPointConversion();
    const conversionMap = {
      hp: "hp_per_point",
      damage: "damage_per_point",
      move_speed: "move_speed_per_point",
    };

    const currentVal =
      (key === "hp"
        ? stats.max_hp
        : key === "damage"
        ? stats.base_damage
        : stats.move_speed) || 0;
    const pendingPoints = this.pendingUpgrades[key];
    const convValue = conversion?.[conversionMap[key]] || 0;
    const projectedValue =
      parseFloat(currentVal) + (pendingPoints + 1) * convValue;

    if (projectedValue > this.config.maxValues[key]) {
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
    const values = {
      hp: Number(stats.max_hp),
      damage: parseFloat(stats.base_damage),
      move_speed: Number(stats.move_speed),
    };
    const max = this.config.maxValues[statKey];

    const conversion = getHeroPointConversion();
    const conversionMap = {
      hp: "hp_per_point",
      damage: "damage_per_point",
      move_speed: "move_speed_per_point",
    };

    const baseValue = values[statKey];
    const pendingPoints = this.pendingUpgrades[statKey];
    const pendingValue =
      baseValue + pendingPoints * (conversion?.[conversionMap[statKey]] || 0);

    const baseScale = Phaser.Math.Clamp(baseValue / max, 0, 1);
    const pendingScale = Phaser.Math.Clamp(pendingValue / max, 0, 1);

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
          ? pendingValue.toFixed(2)
          : Math.round(pendingValue);
      el.valText
        .setText(`${displayVal} (+${pendingPoints})`)
        .setColor("#ffaa00");
    } else {
      el.valText
        .setText(
          statKey === "damage" ? baseValue.toFixed(2) : Math.round(baseValue)
        )
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
    this.pendingUpgrades = { hp: 0, damage: 0, move_speed: 0 };
    this.refresh();
  }

  async confirmAllUpgrades() {
    try {
      this.scene.cameras.main.shake(100, 0.002);
      for (const [key, points] of Object.entries(this.pendingUpgrades)) {
        if (points > 0) queueHeroUpgrade(key, points);
      }
      this.pendingUpgrades = { hp: 0, damage: 0, move_speed: 0 };
      await new Promise((r) => setTimeout(r, 150));
      this.refresh();
    } catch (err) {
      console.error(err);
    }
  }

  refresh() {
    const stats = getHeroStats();
    if (!stats) return;
    const conversion = getHeroPointConversion();
    // Important : on s'assure que les pending sont reset si on refresh depuis l'extérieur
    this.pendingUpgrades = { hp: 0, damage: 0, move_speed: 0 };

    const conversionMap = {
      hp: "hp_per_point",
      damage: "damage_per_point",
      move_speed: "move_speed_per_point",
    };

    this.statElements.forEach((el, key) => {
      this.updateBarVisuals(key);
      const convVal = conversion?.[conversionMap[key]];
      if (convVal)
        el.conversionText.setText(`+${parseFloat(convVal).toFixed(2)} / pt`);

      // Désactiver le bouton si déjà au max
      const currentVal =
        (key === "hp"
          ? stats.max_hp
          : key === "damage"
          ? stats.base_damage
          : stats.move_speed) || 0;
      if (currentVal >= this.config.maxValues[key]) {
        el.btn.setAlpha(0.3);
        el.btn.input.enabled = false;
      } else {
        el.btn.setAlpha(1);
        el.btn.input.enabled = true;
      }
    });

    if (this.killsText) this.killsText.setText(`${stats.kills || 0}☠️`);
    this.updatePointsDisplay();
    this.updateValidateButtonsState();
    if (stats.color) this.redrawAvatar(stats.color);
  }

  openColorPicker() {
    if (!isAuthenticated()) {
      showAuth();
      return;
    }
    const input = document.createElement("input");
    input.type = "color";
    input.value = getHeroStats()?.color || "#2b2b2b";
    input.style.opacity = "0"; // Cacher l'input
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
