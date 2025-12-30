/**
 * Composant pour les boutons Valider/Annuler
 */

export class UpgradeButtonsComponent {
  constructor(scene, config, onCancel, onValidate) {
    this.scene = scene;
    this.config = config;
    this.onCancel = onCancel;
    this.onValidate = onValidate;
    
    this.cancelBtn = null;
    this.validateBtn = null;
    this.costText = null;
    this.cancelBg = null;
    this.validateBg = null;
  }

  create(x, y) {
    const { width, height } = this.config;
    const resolution = window.devicePixelRatio || 1;
    const buttonY = height - 60;

    // Bouton Annuler (Rouge)
    this.cancelBtn = this.scene.add.container(width / 2 - 70, buttonY);
    this.cancelBg = this.scene.add.graphics();
    this.drawButtonBg(this.cancelBg, 0xff4d4d, 0.3);

    const cancelIcon = this.scene.add
      .text(0, 0, "X ANNULER", {
        fontSize: "16px",
        fontFamily: "Arial",
        color: "#ff4d4d",
        fontWeight: "bold",
        resolution,
      })
      .setOrigin(0.5);

    this.cancelBtn.add([this.cancelBg, cancelIcon]);
    this.cancelBtn
      .setSize(130, 36)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);

    this.cancelBtn.on("pointerover", () =>
      this.drawButtonBg(this.cancelBg, 0xff4d4d, 0.6)
    );
    this.cancelBtn.on("pointerout", () =>
      this.drawButtonBg(this.cancelBg, 0xff4d4d, 0.3)
    );
    this.cancelBtn.on("pointerdown", this.onCancel);

    // Bouton Valider (Vert)
    this.validateBtn = this.scene.add.container(width / 2 + 70, buttonY);
    this.validateBg = this.scene.add.graphics();
    this.drawButtonBg(this.validateBg, 0x4caf50, 0.3);

    const validateIcon = this.scene.add
      .text(0, 0, "✓ VALIDER", {
        fontSize: "16px",
        fontFamily: "Arial",
        color: "#4caf50",
        fontWeight: "bold",
        resolution,
      })
      .setOrigin(0.5);

    this.validateBtn.add([this.validateBg, validateIcon]);
    this.validateBtn
      .setSize(130, 36)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);

    this.validateBtn.on("pointerover", () =>
      this.drawButtonBg(this.validateBg, 0x4caf50, 0.6)
    );
    this.validateBtn.on("pointerout", () =>
      this.drawButtonBg(this.validateBg, 0x4caf50, 0.3)
    );
    this.validateBtn.on("pointerdown", this.onValidate);

    // Texte de coût
    this.costText = this.scene.add.text(width / 2, height - 25, "", {
      fontSize: "12px",
      fontFamily: "Arial",
      color: "#aaaaaa",
      resolution,
    }).setOrigin(0.5);

    return [this.costText, this.cancelBtn, this.validateBtn];
  }

  drawButtonBg(graphics, color, alpha) {
    graphics.clear();
    graphics.fillStyle(color, alpha);
    graphics.lineStyle(2, color, 1);
    graphics.fillRoundedRect(-65, -18, 130, 36, 8);
    graphics.strokeRoundedRect(-65, -18, 130, 36, 8);
  }

  updateState(totalPending) {
    const show = totalPending > 0;
    if (this.cancelBtn) this.cancelBtn.setVisible(show);
    if (this.validateBtn) this.validateBtn.setVisible(show);
    if (this.costText) {
      this.costText.setText(
        show
          ? "Valider ou Annuler les changements"
          : "Maintenez '+' pour allouer plusieurs points"
      );
    }
  }

  destroy() {
    if (this.cancelBtn) {
      this.cancelBtn.destroy();
      this.cancelBtn = null;
    }
    if (this.validateBtn) {
      this.validateBtn.destroy();
      this.validateBtn = null;
    }
    if (this.costText) {
      this.costText.destroy();
      this.costText = null;
    }
    this.cancelBg = null;
    this.validateBg = null;
  }
}

