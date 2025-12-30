/**
 * Composant pour une ligne de statistique
 * Gère l'affichage et l'interaction d'une stat (barre, bouton, valeurs)
 */

import { truncateDecimals, STAT_CONVERSION_MAP, getCurrentStatValue } from "./utils.js";

export class StatRowComponent {
  constructor(scene, stat, x, y, config, onUpgradeClick, onUpgradeStop) {
    this.scene = scene;
    this.stat = stat;
    this.config = config;
    this.onUpgradeClick = onUpgradeClick;
    this.onUpgradeStop = onUpgradeStop;
    
    this.barWidth = 200;
    this.resolution = window.devicePixelRatio || 1;
    
    this.elements = this.createElements(x, y);
  }

  createElements(x, y) {
    const elements = { x, y, barWidth: this.barWidth };

    // Label
    elements.label = this.scene.add.text(x, y - 22, this.stat.label, {
      fontSize: "13px",
      fontWeight: "bold",
      color: "#ffffff",
      resolution: this.resolution,
    });

    // Valeur
    elements.valText = this.scene.add
      .text(x + this.barWidth, y - 22, "0", {
        fontSize: "14px",
        color: "#00eaff",
        fontWeight: "bold",
        resolution: this.resolution,
      })
      .setOrigin(1, 0);

    // Texte de conversion
    elements.conversionText = this.scene.add.text(x, y + 18, "", {
      fontSize: "11px",
      color: "#7dd0ff",
      fontStyle: "italic",
      resolution: this.resolution,
    });

    // Texte max/min
    elements.maxText = this.scene.add.text(x + this.barWidth / 2, y - 15, "", {
      fontSize: "10px",
      color: "#ffffff",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 3,
      resolution: this.resolution,
    }).setOrigin(0.5, 0);

    // Barres
    elements.barBg = this.scene.add
      .graphics()
      .fillStyle(0xffffff, 0.1)
      .fillRoundedRect(x, y, this.barWidth, 12, 5);
    elements.barFill = this.scene.add.graphics();
    elements.barPending = this.scene.add.graphics();

    // Bouton +
    const btn = this.scene.add.container(x + this.barWidth + 25, y + 6);
    const btnBg = this.scene.add
      .circle(0, 0, 15, 0x00eaff, 0.2)
      .setStrokeStyle(1, 0x00eaff);
    const btnPlus = this.scene.add
      .text(0, 0, "+", {
        fontSize: "22px",
        color: "#00eaff",
        fontWeight: "bold",
        resolution: this.resolution,
      })
      .setOrigin(0.5);
    btn.add([btnBg, btnPlus]);
    btn.setSize(30, 30).setInteractive({ useHandCursor: true });

    // Gestion du long press
    btn.on("pointerdown", () => this.onUpgradeClick(this.stat.key));
    btn.on("pointerup", () => this.onUpgradeStop());
    btn.on("pointerout", () => this.onUpgradeStop());

    btn.on("pointerover", () => {
      if (btn.input.enabled) btnBg.setFillStyle(0x00eaff, 0.5);
    });
    btn.on("pointerout", () => {
      if (btn.input.enabled) btnBg.setFillStyle(0x00eaff, 0.2);
      this.onUpgradeStop();
    });

    elements.btn = btn;
    elements.color = this.stat.color;

    return elements;
  }

  updateVisuals(stats, conversion, pendingPoints, maxValues, minValues) {
    const el = this.elements;
    const statKey = this.stat.key;
    
    const baseValue = getCurrentStatValue(stats, statKey);
    const max = maxValues[statKey];
    const min = minValues?.[statKey];
    const convValue = parseFloat(conversion?.[STAT_CONVERSION_MAP[statKey]] || 0);

    // Afficher max/min
    if (el.maxText) {
      const maxDisplay = statKey === "attack_interval_ms"
        ? `Min: ${truncateDecimals((min || 0) / 1000, 3).toFixed(3)}s`
        : `Max: ${statKey === "damage" ? max.toFixed(2) : Math.round(max)}`;
      el.maxText.setText(maxDisplay);
      el.maxText.setPosition(el.x + el.barWidth / 2, el.y - 15);
    }

    // Calculer la valeur projetée
    const pendingValue = statKey === "attack_interval_ms"
      ? Math.max(min || 0, baseValue - pendingPoints * convValue)
      : baseValue + pendingPoints * convValue;

    // Calculer les échelles pour les barres
    const range = statKey === "attack_interval_ms" 
      ? (max - (min || 0))
      : max;
    const baseScale = statKey === "attack_interval_ms"
      ? Phaser.Math.Clamp(1 - (baseValue - (min || 0)) / range, 0, 1)
      : Phaser.Math.Clamp(baseValue / max, 0, 1);
    const pendingScale = statKey === "attack_interval_ms"
      ? Phaser.Math.Clamp(1 - (pendingValue - (min || 0)) / range, 0, 1)
      : Phaser.Math.Clamp(pendingValue / max, 0, 1);

    // Dessiner les barres
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

    // Mettre à jour le texte de conversion
    if (convValue) {
      const sign = statKey === "attack_interval_ms" ? "-" : "+";
      el.conversionText.setText(`${sign}${parseFloat(convValue).toFixed(2)} / pt`);
    }
  }

  updateButtonState(stats, maxValues, minValues) {
    const el = this.elements;
    const statKey = this.stat.key;
    const currentVal = getCurrentStatValue(stats, statKey);
    
    const isMax = statKey === "attack_interval_ms"
      ? currentVal <= (minValues?.attack_interval_ms || 500)
      : currentVal >= maxValues[statKey];
    
    if (isMax) {
      el.btn.setAlpha(0.3);
      el.btn.input.enabled = false;
    } else {
      el.btn.setAlpha(1);
      el.btn.input.enabled = true;
    }
  }

  getElements() {
    return [
      this.elements.label,
      this.elements.valText,
      this.elements.conversionText,
      this.elements.maxText,
      this.elements.barBg,
      this.elements.barFill,
      this.elements.barPending,
      this.elements.btn,
    ];
  }

  destroy() {
    // Les éléments seront détruits par le parent container
    this.elements = null;
  }
}

