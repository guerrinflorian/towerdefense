import { TURRETS } from "../../../../../config/turrets/index.js";

export function createTurretButtons(
  buildToolbar,
  turretsSectionWidth,
  toolbarHeight,
  itemSize,
  itemSpacing,
  layout = {}
) {
  const scene = buildToolbar.scene;
  const toolbarButtons = [];

  const columns =
    layout.columns && layout.columns > 0 ? layout.columns : turretTypes.length;
  const verticalSpacing = layout.verticalSpacing || itemSpacing;
  const horizontalStep =
    layout.gridWidth && layout.columns
      ? layout.gridWidth / layout.columns
      : itemSpacing;
  const startX =
    layout.startX !== undefined
      ? layout.startX
      : (turretsSectionWidth - columns * horizontalStep) / 2 + horizontalStep / 2;
  const startY =
    layout.startY !== undefined ? layout.startY : toolbarHeight / 2;

  const turretTypes = [
    { key: "machine_gun", config: TURRETS.machine_gun },
    { key: "sniper", config: TURRETS.sniper },
    { key: "cannon", config: TURRETS.cannon },
    { key: "zap", config: TURRETS.zap },
    { key: "barracks", config: TURRETS.barracks },
  ];

  turretTypes.forEach((item, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const x = startX + col * horizontalStep;
    const y = startY + row * verticalSpacing;

    const btnContainer = scene.add.container(x, y);

    const btnBg = scene.add.rectangle(
      0,
      0,
      itemSize,
      itemSize,
      0x333333,
      0.9
    );
    btnBg.setStrokeStyle(3, 0x666666);
    btnBg.setInteractive({ useHandCursor: true });

    const previewContainer = scene.add.container(0, 0);
    buildToolbar.drawTurretPreview(previewContainer, item.config);
    previewContainer.setScale(0.5 * scene.scaleFactor);

    const countText = scene.add
      .text(0, itemSize / 2 + 12 * scene.scaleFactor, "", {
        fontSize: `${Math.max(14, 16 * scene.scaleFactor)}px`,
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const priceText = scene.add
      .text(0, itemSize / 2 + 28 * scene.scaleFactor, `${item.config.cost}$`, {
        fontSize: `${Math.max(12, 14 * scene.scaleFactor)}px`,
        fill: "#ffd700",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const updateCount = () => {
      if (!countText || countText.active === false) {
        return;
      }
      if (!btnBg || btnBg.active === false) {
        return;
      }
      if (!priceText || priceText.active === false) {
        return;
      }

      try {
        const canAfford = scene.money >= item.config.cost;
        let isDisabled = false;

        if (item.key === "barracks") {
          const count = scene.barracks.length;
          const max = scene.maxBarracks;
          countText.setText(`${count}/${max}`);
          isDisabled = count >= max;
          countText.setColor(count >= max ? "#ff0000" : "#ffffff");
        } else {
          const count = scene.turrets.filter(
            (t) => t.config.key === item.key
          ).length;
          countText.setText(`${count}`);
        }

        const shouldDisable = !canAfford || isDisabled;

        if (shouldDisable) {
          btnBg.setFillStyle(0x1a1a1a, 0.6);
          btnBg.setStrokeStyle(3, 0x444444, 0.5);
          btnBg.setAlpha(0.5);
          previewContainer.setAlpha(0.4);
          priceText.setColor("#ff4444");
          priceText.setAlpha(0.7);
          countText.setAlpha(0.7);
          btnBg.disableInteractive();
        } else {
          btnBg.setFillStyle(0x333333, 0.9);
          btnBg.setStrokeStyle(3, 0x666666, 1);
          btnBg.setAlpha(1);
          previewContainer.setAlpha(1);
          priceText.setColor("#ffd700");
          priceText.setAlpha(1);
          countText.setAlpha(1);
          btnBg.setInteractive({ useHandCursor: true });
        }
      } catch (e) {
        console.warn("Erreur lors de la mise à jour du compteur:", e);
      }
    };

    btnContainer.add([btnBg, previewContainer, countText, priceText]);
    scene.buildToolbar.add(btnContainer);

    btnBg.on("pointerover", () => {
      if (item.config.description) {
        buildToolbar.showToolbarTooltip(
          btnContainer,
          item.config.description,
          btnBg
        );
      }
    });

    btnBg.on("pointerout", () => {
      if (buildToolbar.toolbarTooltip) {
        buildToolbar.toolbarTooltip.destroy();
        buildToolbar.toolbarTooltip = null;
      }
    });

    btnBg.on("pointerdown", () => {
      if (buildToolbar.toolbarTooltip) {
        buildToolbar.toolbarTooltip.destroy();
        buildToolbar.toolbarTooltip = null;
      }
      if (
        item.key === "barracks" &&
        scene.barracks.length >= scene.maxBarracks
      ) {
        scene.cameras.main.shake(50, 0.005);
        return;
      }

      if (scene.money >= item.config.cost) {
        buildToolbar.inputManager.startDrag(item.config);
      } else {
        scene.cameras.main.shake(50, 0.005);
      }
    });

    toolbarButtons.push({
      container: btnContainer,
      config: item.config,
      updateCount: updateCount,
      btnBg: btnBg,
      priceText: priceText,
      countText: countText,
      previewContainer: previewContainer,
    });
  });

  return toolbarButtons;
}
