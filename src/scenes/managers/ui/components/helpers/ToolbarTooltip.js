export function showToolbarTooltip(buildToolbar, btnContainer, description) {
  const scene = buildToolbar.scene;
  const s = scene.scaleFactor;

  if (buildToolbar.toolbarTooltip) {
    buildToolbar.toolbarTooltip.destroy();
  }

  let btnX, btnY;

  const isInBuildToolbar =
    scene.buildToolbar &&
    (btnContainer.parentContainer === scene.buildToolbar ||
      (scene.buildToolbar.list &&
        scene.buildToolbar.list.includes(btnContainer)));

  if (isInBuildToolbar) {
    btnX = btnContainer.x + scene.buildToolbar.x;
    btnY = btnContainer.y + scene.buildToolbar.y;
  } else {
    btnX = btnContainer.x;
    btnY = btnContainer.y;
  }

  const tooltipContainer = scene.add.container(0, 0).setDepth(300);
  buildToolbar.toolbarTooltip = tooltipContainer;

  const tooltipBg = scene.add.graphics();
  const padding = 15 * s;
  const maxWidth = 350 * s;

  const tempText = scene.add.text(0, 0, description, {
    fontSize: `${Math.max(11, 12 * s)}px`,
    fill: "#ffffff",
    fontFamily: "Arial",
    wordWrap: { width: maxWidth - padding * 2 },
    lineSpacing: 4 * s,
  });
  const textWidth = Math.min(tempText.width, maxWidth - padding * 2);
  const textHeight = tempText.height;
  tempText.destroy();

  const tooltipWidth = textWidth + padding * 2;
  const tooltipHeight = textHeight + padding * 2;

  const tooltipX = btnX;
  const tooltipY = btnY - tooltipHeight - 10 * s;

  tooltipBg.fillStyle(0x000000, 0.95);
  tooltipBg.fillRoundedRect(0, 0, tooltipWidth, tooltipHeight, 8);
  tooltipBg.lineStyle(2, 0x00ccff, 1);
  tooltipBg.strokeRoundedRect(0, 0, tooltipWidth, tooltipHeight, 8);

  const descText = scene.add.text(padding, padding, description, {
    fontSize: `${Math.max(11, 12 * s)}px`,
    fill: "#ffffff",
    fontFamily: "Arial",
    wordWrap: { width: maxWidth - padding * 2 },
    lineSpacing: 4 * s,
  });

  tooltipContainer.add([tooltipBg, descText]);
  tooltipContainer.setPosition(tooltipX, tooltipY);

  if (tooltipX + tooltipWidth > scene.gameWidth) {
    tooltipContainer.setX(scene.gameWidth - tooltipWidth - 10 * s);
  }
  if (tooltipY < 0) {
    tooltipContainer.setY(btnY + 80 * s + 10 * s);
  }
}
