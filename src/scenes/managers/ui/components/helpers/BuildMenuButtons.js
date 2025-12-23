export function drawOctagon(
  scene,
  graphics,
  x,
  y,
  radius,
  fillColor,
  fillAlpha,
  strokeColor,
  strokeWidth
) {
  graphics.clear();
  graphics.fillStyle(fillColor, fillAlpha);
  graphics.lineStyle(strokeWidth, strokeColor, 1);

  const sides = 8;
  const angleStep = (Math.PI * 2) / sides;

  graphics.beginPath();
  for (let i = 0; i <= sides; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) {
      graphics.moveTo(px, py);
    } else {
      graphics.lineTo(px, py);
    }
  }
  graphics.closePath();
  graphics.fillPath();
  graphics.strokePath();
}

export function applyBuildBtnStateOctagon(scene, btnContainer) {
  const s = scene.scaleFactor;
  const cfg = btnContainer.turretConfig;
  const canAfford = scene.money >= cfg.cost;

  let isDisabled = false;
  if (cfg.key === "barracks") {
    isDisabled = scene.barracks.length >= scene.maxBarracks;
  } else if (cfg.key === "sniper") {
    const sniperCount = scene.turrets.filter((t) => t.config.key === "sniper").length;
    isDisabled = sniperCount >= scene.maxSnipers;
  }

  const shouldDisable = !canAfford || isDisabled;
  const radius = btnContainer.radius || (50 * s) / 2;

  if (btnContainer.nameText) {
    btnContainer.nameText.setColor(shouldDisable ? "#666666" : "#ffffff");
    btnContainer.nameText.setAlpha(shouldDisable ? 0.6 : 1);
  }
  if (btnContainer.costText) {
    btnContainer.costText.setColor(shouldDisable ? "#ff4444" : "#ffd700");
    btnContainer.costText.setAlpha(shouldDisable ? 0.7 : 1);
  }
  if (btnContainer.octagonBg) {
    const fillColor = shouldDisable ? 0x0f0f0f : 0x1a1a2e;
    const fillAlpha = shouldDisable ? 0.6 : 0.96;
    const strokeColor = shouldDisable ? 0x444444 : 0x00ccff;
    const strokeWidth = Math.max(2, 2 * s);

    drawOctagon(
      scene,
      btnContainer.octagonBg,
      0,
      0,
      radius,
      fillColor,
      fillAlpha,
      strokeColor,
      strokeWidth
    );
    btnContainer.octagonBg.setAlpha(shouldDisable ? 0.5 : 1);

    if (shouldDisable) {
      btnContainer.hitArea?.disableInteractive();
    } else {
      btnContainer.hitArea?.setInteractive({ useHandCursor: true });
    }
  }
  if (btnContainer.previewContainer) {
    btnContainer.previewContainer.setAlpha(shouldDisable ? 0.4 : 1);
  }
}

export function createBuildBtnOctagon(buildMenu, x, y, size, turretConfig) {
  const scene = buildMenu.scene;
  const s = scene.scaleFactor;
  const radius = size / 2;
  const labelBgAlpha = 0.55;
  const labelBgRadius = 8 * s;

  const btn = scene.add.container(x, y).setDepth(241);

  const octagonBg = scene.add.graphics();
  drawOctagon(scene, octagonBg, 0, 0, radius, 0x1a1a2e, 0.96, 0x00ccff, Math.max(2, 2 * s));

  const hitArea = scene.add.circle(0, 0, radius + 6 * s, 0x000000, 0);
  hitArea.setInteractive({ useHandCursor: true });

  const previewContainer = scene.add.container(0, -2 * s);
  if (scene.drawTurretPreview) {
    scene.drawTurretPreview(previewContainer, turretConfig);
    previewContainer.setScale(0.4 * s * 1.25);
  }

  const nameY = radius + 12 * s;
  const costY = radius + 30 * s;

  const nameText = scene.add
    .text(0, nameY, turretConfig.name, {
      fontSize: `${Math.round(Math.max(12, 13 * s * 1.25))}px`,
      fill: "#ffffff",
      fontFamily: "Arial",
      fontStyle: "bold",
    })
    .setOrigin(0.5);

  const costText = scene.add
    .text(0, costY, `${turretConfig.cost}$`, {
      fontSize: `${Math.round(Math.max(11, 12 * s * 1.25))}px`,
      fill: "#ffd700",
      fontFamily: "Arial",
      fontStyle: "bold",
    })
    .setOrigin(0.5);

  const nameBg = scene.add.graphics();
  const costBg = scene.add.graphics();

  const redrawLabelBg = () => {
    const padX = 10 * s;
    const padY = 6 * s;

    const nameW = nameText.width + padX * 2;
    const nameH = nameText.height + padY * 2;

    nameBg.clear();
    nameBg.fillStyle(0x000000, labelBgAlpha);
    nameBg.fillRoundedRect(
      -nameW / 2,
      nameY - nameH / 2,
      nameW,
      nameH,
      labelBgRadius
    );

    const costW = costText.width + padX * 2;
    const costH = costText.height + padY * 2;

    costBg.clear();
    costBg.fillStyle(0x000000, labelBgAlpha);
    costBg.fillRoundedRect(
      -costW / 2,
      costY - costH / 2,
      costW,
      costH,
      labelBgRadius
    );
  };

  redrawLabelBg();

  btn.add([
    octagonBg,
    hitArea,
    previewContainer,
    nameBg,
    costBg,
    nameText,
    costText,
  ]);

  btn.turretConfig = turretConfig;
  btn.octagonBg = octagonBg;
  btn.nameText = nameText;
  btn.costText = costText;
  btn.previewContainer = previewContainer;
  btn.hitArea = hitArea;
  btn.radius = radius;
  btn.nameBg = nameBg;
  btn.costBg = costBg;
  btn._redrawLabelBg = redrawLabelBg;

  applyBuildBtnStateOctagon(scene, btn);

  hitArea.on("pointerover", () => {
    const canAfford = scene.money >= turretConfig.cost;
    const isBarracksMaxed =
      turretConfig.key === "barracks" &&
      scene.barracks.length >= scene.maxBarracks;
    const isSniperMaxed =
      turretConfig.key === "sniper" &&
      scene.turrets.filter((t) => t.config.key === "sniper").length >= scene.maxSnipers;

    if (!canAfford || isBarracksMaxed || isSniperMaxed) return;

    drawOctagon(
      scene,
      octagonBg,
      0,
      0,
      radius,
      0x2a2a4e,
      1,
      0x00ffff,
      Math.max(3, 3 * s)
    );

    nameText.setColor("#ffffff");
    costText.setColor("#ffff00");

    nameBg.setAlpha(0.7);
    costBg.setAlpha(0.7);

    if (turretConfig.description) {
      buildMenu.showTurretTooltip(btn, turretConfig.description, hitArea);
    }

    if (scene.selectedTile) {
      scene.inputManager?.dragHandler?.showTileRangePreview(
        turretConfig,
        scene.selectedTile.x,
        scene.selectedTile.y
      );
    }
  });

  hitArea.on("pointerout", () => {
    applyBuildBtnStateOctagon(scene, btn);
    nameBg.setAlpha(1);
    costBg.setAlpha(1);

    if (buildMenu.currentTooltip) {
      buildMenu.currentTooltip.destroy();
      buildMenu.currentTooltip = null;
    }

    scene.inputManager?.dragHandler?.hideTileRangePreview();
  });

  hitArea.on("pointerdown", () => {
    if (buildMenu.currentTooltip) {
      buildMenu.currentTooltip.destroy();
      buildMenu.currentTooltip = null;
    }

    if (!scene.selectedTile) return;

    const canAfford = scene.money >= turretConfig.cost;
    const isBarracksMaxed =
      turretConfig.key === "barracks" &&
      scene.barracks.length >= scene.maxBarracks;
    const isSniperMaxed =
      turretConfig.key === "sniper" &&
      scene.turrets.filter((t) => t.config.key === "sniper").length >= scene.maxSnipers;

    if (!canAfford || isBarracksMaxed || isSniperMaxed) {
      scene.cameras.main.shake(50, 0.005);
      return;
    }

    const success = scene.buildTurret(
      turretConfig,
      scene.selectedTile.x,
      scene.selectedTile.y
    );

    if (success) {
      scene.buildMenu.setVisible(false);
      // Activer le flag pour ignorer le prochain clic (qui serait le pointerup du clic sur le bouton)
      if (scene.inputManager) {
        scene.inputManager.justBuiltFromMenu = true;
      }
    }
    scene.inputManager?.dragHandler?.hideTileRangePreview();
    buildMenu.updateBuildMenuButtons();
  });

  return btn;
}
