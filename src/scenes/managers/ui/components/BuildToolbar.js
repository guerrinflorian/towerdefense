import { CONFIG } from "../../../../config/settings.js";
import { lightning as LIGHTNING_SPELL } from "../../../../sorts/lightning.js";
import { createTurretButtons } from "./helpers/TurretButtons.js";
import { showToolbarTooltip } from "./helpers/ToolbarTooltip.js";

export class BuildToolbar {
  constructor(scene, spellManager, inputManager) {
    this.scene = scene;
    this.spellManager = spellManager;
    this.inputManager = inputManager;
    this.toolbarButtons = [];
    this.toolbarTooltip = null;
    this.leftColumn = null;
    this.rightColumn = null;
    this.leftBg = null;
    this.rightBg = null;
  }

  create() {
    const toolbarY = this.scene.toolbarOffsetY;
    const columnWidth = this.scene.toolbarWidth;
    const columnHeight = this.scene.toolbarHeight;
    const padding = 18 * this.scene.scaleFactor;
    const itemSize = 82 * this.scene.scaleFactor;
    const itemSpacing = Math.max(110 * this.scene.scaleFactor, itemSize + 24);

    // Colonne gauche : sorts + contrôles de vague
    this.leftColumn = this.scene.add
      .container(this.scene.toolbarOffsetX, toolbarY)
      .setDepth(150);
    this.leftBg = this.scene.add.graphics();
    this.leftBg.fillStyle(0x0a0a10, 0.92);
    this.leftBg.fillRoundedRect(0, 0, columnWidth, columnHeight, 14);
    this.leftBg.lineStyle(2, 0x00ccff, 0.35);
    this.leftBg.strokeRoundedRect(0, 0, columnWidth, columnHeight, 14);
    this.leftColumn.add(this.leftBg);

    const leftTitle = this.scene.add
      .text(padding, padding, "ACTIONS", {
        fontSize: `${Math.max(14, 16 * this.scene.scaleFactor)}px`,
        fill: "#9edcff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0, 0);
    this.leftColumn.add(leftTitle);

    const waveButtonWidth = columnWidth - padding * 2;
    const waveButtonHeight = 66 * this.scene.scaleFactor;
    const waveAreaY = leftTitle.y + leftTitle.height + padding * 0.8;

    this.scene.waveSection = this.scene.add.container(padding, waveAreaY);
    const waveSectionBg = this.scene.add.graphics();
    waveSectionBg.fillStyle(0x0f0f18, 0.9);
    waveSectionBg.fillRoundedRect(
      0,
      0,
      waveButtonWidth,
      waveButtonHeight,
      12
    );
    waveSectionBg.lineStyle(2, 0x00ff99, 0.4);
    waveSectionBg.strokeRoundedRect(
      0,
      0,
      waveButtonWidth,
      waveButtonHeight,
      12
    );
    this.scene.waveSection.add(waveSectionBg);

    this.scene.waveBtnContainer = this.scene.add
      .container(waveButtonWidth / 2, waveButtonHeight / 2)
      .setDepth(151);

    this.scene.waveBtnBg = this.scene.add
      .rectangle(0, 0, waveButtonWidth, waveButtonHeight, 0x111422, 0.92)
      .setStrokeStyle(3 * this.scene.scaleFactor, 0x00ff99, 0.8);

    this.scene.waveBtnText = this.scene.add
      .text(0, 0, "▶ LANCER VAGUE 1", {
        fontSize: `${Math.max(16, 22 * this.scene.scaleFactor)}px`,
        fill: "#ffffff",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.scene.waveBtnContainer.add([
      this.scene.waveBtnBg,
      this.scene.waveBtnText,
    ]);

    this.scene.waveSection.add(this.scene.waveBtnContainer);

    this.scene.waveBtnBg
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.startWave());

    this.leftColumn.add(this.scene.waveSection);

    const spellAreaY = waveAreaY + waveButtonHeight + padding * 1.2;
    const spellPanelHeight = itemSize + padding * 1.2;

    this.scene.spellSection = this.scene.add
      .container(padding, spellAreaY)
      .setDepth(150);
    const spellBg = this.scene.add.graphics();
    spellBg.fillStyle(0x0f0f18, 0.9);
    spellBg.fillRoundedRect(0, 0, waveButtonWidth, spellPanelHeight, 12);
    spellBg.lineStyle(2, 0x7dd6ff, 0.35);
    spellBg.strokeRoundedRect(0, 0, waveButtonWidth, spellPanelHeight, 12);
    this.scene.spellSection.add(spellBg);

    const lightningY = spellPanelHeight / 2;
    this.createLightningSpellButton({
      itemSize,
      posX: waveButtonWidth / 2,
      posY: lightningY,
      targetContainer: this.scene.spellSection,
    });

    this.leftColumn.add(this.scene.spellSection);

    // Colonne droite : tourelles
    this.scene.buildToolbar = this.scene.add
      .container(this.scene.rightToolbarOffsetX, toolbarY)
      .setDepth(150);
    this.rightBg = this.scene.add.graphics();
    this.rightBg.fillStyle(0x0a0a10, 0.92);
    this.rightBg.fillRoundedRect(0, 0, columnWidth, columnHeight, 14);
    this.rightBg.lineStyle(2, 0x00ccff, 0.35);
    this.rightBg.strokeRoundedRect(0, 0, columnWidth, columnHeight, 14);
    this.scene.buildToolbar.add(this.rightBg);

    const towerTitle = this.scene.add
      .text(padding, padding, "TOURELLES", {
        fontSize: `${Math.max(14, 16 * this.scene.scaleFactor)}px`,
        fill: "#9edcff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0, 0);
    this.scene.buildToolbar.add(towerTitle);

    const gridStartY = towerTitle.y + towerTitle.height + padding * 0.8;
    const gridHeight = columnHeight - gridStartY - padding;
    const gridWidth = columnWidth - padding * 2;
    const columns = 2;
    const rows = Math.ceil(5 / columns);
    const verticalSpacing = Math.min(
      gridHeight / rows,
      itemSpacing + padding * 0.5
    );

    this.toolbarButtons = createTurretButtons(
      this,
      gridWidth,
      gridHeight,
      itemSize,
      verticalSpacing,
      {
        startX: padding + gridWidth / (columns * 2),
        startY: gridStartY + itemSize / 2,
        columns: columns,
        padding,
        gridWidth,
        verticalSpacing,
      }
    );

    this.updateToolbarCounts();
  }

  showToolbarTooltip(btnContainer, description, triggerElement) {
    showToolbarTooltip(this, btnContainer, description);
  }

  createLightningSpellButton({ itemSize, posX, posY, targetContainer }) {
    const x = posX;
    const y = posY;
    const container = targetContainer || this.scene.spellSection;

    const btnContainer = this.scene.add.container(x, y);
    btnContainer.setDepth(151);

    const btnBg = this.scene.add.rectangle(
      0,
      0,
      itemSize,
      itemSize,
      0x333333,
      0.9
    );
    btnBg.setStrokeStyle(3, 0x666666);
    btnBg.setInteractive({ useHandCursor: true });

    const lightningIcon = this.scene.add.graphics();
    this.spellManager.drawLightningIcon(lightningIcon, 0, 0, itemSize * 0.6);
    lightningIcon.setScale(this.scene.scaleFactor);

    const cooldownMask = this.scene.add.graphics();
    cooldownMask.setDepth(152);
    cooldownMask.setVisible(false);

    const cooldownText = this.scene.add
      .text(0, itemSize / 2 + 12 * this.scene.scaleFactor, "", {
        fontSize: `${Math.max(10, 12 * this.scene.scaleFactor)}px`,
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    btnContainer.add([btnBg, lightningIcon, cooldownMask, cooldownText]);

    btnBg.on("pointerover", () => {
      if (LIGHTNING_SPELL.description) {
        this.showToolbarTooltip(btnContainer, LIGHTNING_SPELL.description, btnBg);
      }
    });

    btnBg.on("pointerout", () => {
      if (this.toolbarTooltip) {
        this.toolbarTooltip.destroy();
        this.toolbarTooltip = null;
      }
    });

    btnBg.on("pointerdown", () => {
      if (this.toolbarTooltip) {
        this.toolbarTooltip.destroy();
        this.toolbarTooltip = null;
      }

      if (this.spellManager.lightningCooldown <= 0) {
        this.spellManager.startPlacingLightning();
      }
    });

    this.spellManager.attachLightningButton({
      container: btnContainer,
      bg: btnBg,
      icon: lightningIcon,
      cooldownMask: cooldownMask,
      cooldownText: cooldownText,
    });

    if (container) {
      container.add(btnContainer);
    }
  }

  drawTurretPreview(container, config) {
    const base = this.scene.add.graphics();
    const color = 0x333333;
    base.fillStyle(color);
    base.fillCircle(0, 0, 24);
    base.lineStyle(2, 0x111111);
    base.strokeCircle(0, 0, 24);
    container.add(base);

    if (config.onDrawBarrel) {
      const barrelContainer = this.scene.add.container(0, 0);
      const fakeTurret = { level: 1, config: config };
      try {
        config.onDrawBarrel(this.scene, barrelContainer, config.color, fakeTurret);
        container.add(barrelContainer);
      } catch (e) {
        console.warn("Erreur lors du dessin de la prévisualisation:", e);
        const fallback = this.scene.add.graphics();
        fallback.fillStyle(0xffffff);
        fallback.fillRect(0, -3, 15, 6);
        container.add(fallback);
      }
    } else {
      const fallback = this.scene.add.graphics();
      fallback.fillStyle(0xffffff);
      fallback.fillRect(0, -3, 15, 6);
      container.add(fallback);
    }
  }

  updateToolbarCounts() {
    if (!this.toolbarButtons || !Array.isArray(this.toolbarButtons)) {
      return;
    }

    this.toolbarButtons = this.toolbarButtons.filter(
      (btn) => btn && btn.updateCount
    );

    this.toolbarButtons.forEach((btn) => {
      try {
        if (btn && btn.updateCount) {
          btn.updateCount();
        }
      } catch (e) {
        console.warn("Erreur lors de la mise à jour d'un bouton de toolbar:", e);
      }
    });
  }

  isPointerOnToolbar(pointer) {
    const bounds = [this.scene.leftToolbarBounds, this.scene.rightToolbarBounds];

    return bounds.some((b) => {
      if (!b) return false;
      return (
        pointer.worldX >= b.x &&
        pointer.worldX <= b.x + b.width &&
        pointer.worldY >= b.y &&
        pointer.worldY <= b.y + b.height
      );
    });
  }
}
