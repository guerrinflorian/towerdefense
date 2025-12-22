export function drawCimetiereTree(graphics, scale) {
  const treeType = Math.random();

  if (treeType < 0.5) {
    graphics.fillStyle(0x2a2a2a);
    graphics.fillRoundedRect(-6 * scale, 8 * scale, 12 * scale, 8 * scale, 2 * scale);

    graphics.fillStyle(0x3a3a3a);
    graphics.fillRoundedRect(-4 * scale, 0, 8 * scale, 10 * scale, 1 * scale);

    graphics.lineStyle(1.5, 0x1a1a1a, 0.8);
    graphics.strokeRoundedRect(-4 * scale, 0, 8 * scale, 10 * scale, 1 * scale);

    if (Math.random() < 0.7) {
      graphics.lineStyle(2, 0x1a1a1a, 0.9);
      graphics.beginPath();
      graphics.moveTo(-3 * scale, 3 * scale);
      graphics.lineTo(3 * scale, 3 * scale);
      graphics.strokePath();
      graphics.beginPath();
      graphics.moveTo(0, 1 * scale);
      graphics.lineTo(0, 6 * scale);
      graphics.strokePath();
    }

    graphics.fillStyle(0x1a3a1a, 0.4);
    graphics.fillCircle(-2 * scale, 5 * scale, 2 * scale);
    graphics.fillCircle(2 * scale, 7 * scale, 1.5 * scale);

    graphics.lineStyle(1, 0x1a1a1a, 0.5);
    graphics.beginPath();
    graphics.moveTo(-2 * scale, 2 * scale);
    graphics.lineTo(-1 * scale, 4 * scale);
    graphics.strokePath();
  } else {
    graphics.fillStyle(0x3a2a1a);
    graphics.fillRect(-2 * scale, 0, 4 * scale, 14 * scale);

    graphics.fillStyle(0x2a1a0a);
    graphics.fillRect(-2 * scale, 0, 1 * scale, 6 * scale);
    graphics.fillRect(1 * scale, 0, 1 * scale, 6 * scale);
    graphics.fillRect(-4 * scale, -4 * scale, 2 * scale, 1 * scale);
    graphics.fillRect(2 * scale, -4 * scale, 2 * scale, 1 * scale);

    graphics.fillStyle(0xff6600);
    graphics.fillCircle(-5 * scale, -4 * scale, 3 * scale);
    graphics.fillStyle(0x1a0a00);
    graphics.fillRect(-5 * scale, -1 * scale, 1 * scale, 2 * scale);

    graphics.fillStyle(0xff6600);
    graphics.fillCircle(5 * scale, -4 * scale, 3 * scale);
    graphics.fillStyle(0x1a0a00);
    graphics.fillRect(4 * scale, -1 * scale, 1 * scale, 2 * scale);

    graphics.fillStyle(0x000000);
    graphics.fillCircle(-6 * scale, -4 * scale, 1 * scale);
    graphics.fillCircle(-4 * scale, -4 * scale, 1 * scale);
    graphics.fillCircle(4 * scale, -4 * scale, 1 * scale);
    graphics.fillCircle(6 * scale, -4 * scale, 1 * scale);
  }
}
