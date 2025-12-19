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
  }

  create() {
    const toolbarY = this.scene.toolbarOffsetY;
    const itemSize = 80 * this.scene.scaleFactor;
    const itemSpacing = 90 * this.scene.scaleFactor;
    const toolbarHeight = 120 * this.scene.scaleFactor;
    const margin = 20 * this.scene.scaleFactor;

    const spellSectionWidth = itemSize + margin * 2;
    const turretsSectionWidth = 5 * itemSpacing;
    const waveButtonWidth = 300 * this.scene.scaleFactor;
    const waveButtonHeight = 60 * this.scene.scaleFactor;

    const totalWidth =
      spellSectionWidth + turretsSectionWidth + waveButtonWidth + margin * 4;
    const startX = (this.scene.gameWidth - totalWidth) / 2;

    const spellSectionX = startX + margin;
    this.scene.spellSection = this.scene.add
      .container(spellSectionX, toolbarY)
      .setDepth(150);
    const spellBg = this.scene.add.graphics();
    spellBg.fillStyle(0x000000, 0.9);
    spellBg.fillRoundedRect(0, 0, spellSectionWidth, toolbarHeight, 10);
    spellBg.lineStyle(3, 0xffffff, 0.6);
    spellBg.strokeRoundedRect(0, 0, spellSectionWidth, toolbarHeight, 10);
    this.scene.spellSection.add(spellBg);

    this.createLightningSpellButton(
      itemSize,
      itemSize / 2 + margin,
      toolbarHeight,
      spellSectionX
    );

    const turretsSectionX = startX + spellSectionWidth + margin * 2;
    this.scene.buildToolbar = this.scene.add
      .container(turretsSectionX, toolbarY)
      .setDepth(150);
    const toolbarBg = this.scene.add.graphics();
    toolbarBg.fillStyle(0x000000, 0.9);
    toolbarBg.fillRoundedRect(0, 0, turretsSectionWidth, toolbarHeight, 10);
    toolbarBg.lineStyle(3, 0xffffff, 0.6);
    toolbarBg.strokeRoundedRect(0, 0, turretsSectionWidth, toolbarHeight, 10);
    this.scene.buildToolbar.add(toolbarBg);

    this.toolbarButtons = createTurretButtons(
      this,
      turretsSectionWidth,
      toolbarHeight,
      itemSize,
      itemSpacing
    );

    const waveSectionX =
      startX + spellSectionWidth + turretsSectionWidth + margin * 3;
    const wy = this.scene.toolbarOffsetY + toolbarHeight / 2;

    this.scene.waveSection = this.scene.add
      .container(waveSectionX, this.scene.toolbarOffsetY)
      .setDepth(150);
    const waveSectionBg = this.scene.add.graphics();
    waveSectionBg.fillStyle(0x000000, 0.9);
    waveSectionBg.fillRoundedRect(
      0,
      0,
      waveButtonWidth + margin * 2,
      toolbarHeight,
      10
    );
    waveSectionBg.lineStyle(3, 0xffffff, 0.6);
    waveSectionBg.strokeRoundedRect(
      0,
      0,
      waveButtonWidth + margin * 2,
      toolbarHeight,
      10
    );
    this.scene.waveSection.add(waveSectionBg);

    this.scene.waveBtnContainer = this.scene.add
      .container(margin + waveButtonWidth / 2, toolbarHeight / 2)
      .setDepth(151);

    this.scene.waveBtnBg = this.scene.add
      .rectangle(0, 0, waveButtonWidth, waveButtonHeight, 0x000000, 0.8)
      .setStrokeStyle(3 * this.scene.scaleFactor, 0x00ff00);

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

    this.updateToolbarCounts();
  }

  showToolbarTooltip(btnContainer, description, triggerElement) {
    showToolbarTooltip(this, btnContainer, description);
  }

  createLightningSpellButton(itemSize, xOffset, toolbarHeight, sectionX) {
    const x = xOffset;
    const y = toolbarHeight / 2;

    const btnContainer = this.scene.add.container(
      sectionX + x,
      this.scene.toolbarOffsetY + y
    );
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
    if (!this.scene.buildToolbar) return false;

    const toolbarY = this.scene.toolbarOffsetY;
    const toolbarHeight = 120 * this.scene.scaleFactor;

    return (
      pointer.worldY >= toolbarY && pointer.worldY <= toolbarY + toolbarHeight
    );
  }
}
