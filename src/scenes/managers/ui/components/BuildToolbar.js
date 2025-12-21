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
    // Les sidebars commencent en haut (y=0) mais le contenu est aligné avec la map
    const toolbarY = this.scene.toolbarOffsetY || 0;
    const columnWidth = this.scene.toolbarWidth;
    const columnHeight = this.scene.toolbarHeight;
    const padding =
      (this.scene.isPortrait ? 14 : 18) * this.scene.scaleFactor;
    const itemSize =
      (this.scene.isPortrait ? 98 : 82) * this.scene.scaleFactor;
    const itemSpacing = Math.max(
      (this.scene.isPortrait ? 118 : 110) * this.scene.scaleFactor,
      itemSize + padding
    );

    // Colonne gauche : tourelles en haut, sorts en dessous
    this.leftColumn = this.scene.add
      .container(this.scene.toolbarOffsetX, toolbarY)
      .setDepth(150);
    this.leftBg = this.scene.add.graphics();
    this.leftBg.fillStyle(0x0a0a10, 0.92);
    this.leftBg.fillRoundedRect(0, 0, columnWidth, columnHeight, 14);
    this.leftBg.lineStyle(2, 0x00ccff, 0.35);
    this.leftBg.strokeRoundedRect(0, 0, columnWidth, columnHeight, 14);
    this.leftColumn.add(this.leftBg);

    // Titre TOURELLES
    const towerTitle = this.scene.add
      .text(padding, padding, "TOURELLES", {
        fontSize: `${Math.max(14, 16 * this.scene.scaleFactor)}px`,
        fill: "#9edcff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0, 0);
    this.leftColumn.add(towerTitle);

    // Zone des tourelles
    const turretGridStartY = towerTitle.y + towerTitle.height + padding * 0.8;
    const turretGridHeight = columnHeight * (this.scene.isPortrait ? 0.7 : 0.65); // un peu plus de place en portrait
    const turretGridWidth = columnWidth - padding * 2;
    const columns = 2;
    const rows = Math.ceil(5 / columns);
    // Augmenter l'espacement vertical pour que ce soit plus beau
    const verticalSpacing = Math.min(
      turretGridHeight / rows,
      itemSpacing + padding * 1.5
    );

    // S'assurer que buildToolbar pointe vers leftColumn avant de créer les boutons
    this.scene.buildToolbar = this.leftColumn;

    this.toolbarButtons = createTurretButtons(
      this,
      turretGridWidth,
      turretGridHeight,
      itemSize,
      verticalSpacing,
      {
        startX: padding + turretGridWidth / (columns * 2),
        startY: turretGridStartY + itemSize / 2,
        columns: columns,
        padding,
        gridWidth: turretGridWidth,
        verticalSpacing,
      }
    );

    // Titre SORTS
    const spellTitleY = turretGridStartY + turretGridHeight + padding * 1.2;
    const spellTitle = this.scene.add
      .text(padding, spellTitleY, "SORTS", {
        fontSize: `${Math.max(14, 16 * this.scene.scaleFactor)}px`,
        fill: "#9edcff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0, 0);
    this.leftColumn.add(spellTitle);

    // Zone des sorts
    const spellAreaY = spellTitle.y + spellTitle.height + padding * 0.8;
    const spellPanelHeight = itemSize + padding * 1.2;
    const spellPanelWidth = columnWidth - padding * 2;

    this.scene.spellSection = this.scene.add
      .container(padding, spellAreaY)
      .setDepth(150);
    const spellBg = this.scene.add.graphics();
    spellBg.fillStyle(0x0f0f18, 0.9);
    spellBg.fillRoundedRect(0, 0, spellPanelWidth, spellPanelHeight, 12);
    spellBg.lineStyle(2, 0x7dd6ff, 0.35);
    spellBg.strokeRoundedRect(0, 0, spellPanelWidth, spellPanelHeight, 12);
    this.scene.spellSection.add(spellBg);

    const lightningY = spellPanelHeight / 2;
    this.createLightningSpellButton({
      itemSize,
      posX: spellPanelWidth / 2,
      posY: lightningY,
      targetContainer: this.scene.spellSection,
    });

    this.leftColumn.add(this.scene.spellSection);

    // Plus besoin de la colonne droite (elle est maintenant dans HUD)
    // On garde juste la référence pour compatibilité
    this.rightBg = this.leftBg;

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

  reposition() {
    if (!this.leftColumn || !this.leftBg) return;

    const columnWidth = this.scene.toolbarWidth;
    const columnHeight = this.scene.toolbarHeight;

    this.leftColumn.setPosition(
      this.scene.toolbarOffsetX,
      this.scene.toolbarOffsetY
    );

    // Redessiner le fond pour la nouvelle largeur/hauteur
    this.leftBg.clear();
    this.leftBg.fillStyle(0x0a0a10, 0.92);
    this.leftBg.fillRoundedRect(0, 0, columnWidth, columnHeight, 14);
    this.leftBg.lineStyle(2, 0x00ccff, 0.35);
    this.leftBg.strokeRoundedRect(0, 0, columnWidth, columnHeight, 14);

    // Mettre à jour le cache des limites pour la détection des clics
    this.scene.leftToolbarBounds = {
      x: this.scene.toolbarOffsetX,
      y: this.scene.toolbarOffsetY,
      width: columnWidth,
      height: columnHeight,
    };
  }
}
