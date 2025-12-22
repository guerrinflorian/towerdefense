export function drawLavaTree(graphics, scale) {
  const treeType = Math.random();

  if (treeType < 0.6) {
    graphics.fillStyle(0x1a0a05);
    graphics.fillRect(-3 * scale, 4 * scale, 6 * scale, 14 * scale);

    graphics.fillStyle(0x3a1f13, 0.8);
    graphics.fillRect(-2 * scale, 6 * scale, 4 * scale, 10 * scale);

    graphics.lineStyle(1, 0xff4400, 0.6);
    graphics.beginPath();
    graphics.moveTo(-1 * scale, 8 * scale);
    graphics.lineTo(0, 12 * scale);
    graphics.strokePath();
    graphics.beginPath();
    graphics.moveTo(1 * scale, 10 * scale);
    graphics.lineTo(2 * scale, 14 * scale);
    graphics.strokePath();

    graphics.fillStyle(0xff6a2e, 0.9);
    graphics.fillCircle(-1 * scale, 6 * scale, 1.6 * scale);
    graphics.fillCircle(2 * scale, 10 * scale, 1.2 * scale);
    graphics.fillCircle(-2 * scale, 12 * scale, 1.2 * scale);
    graphics.fillCircle(0, 8 * scale, 1 * scale);

    graphics.fillStyle(0xffaa00, 0.7);
    graphics.fillCircle(-1.5 * scale, 9 * scale, 0.8 * scale);
    graphics.fillCircle(1.5 * scale, 13 * scale, 0.8 * scale);
  } else {
    graphics.fillStyle(0x2a1a0a);
    graphics.fillRoundedRect(-5 * scale, 8 * scale, 10 * scale, 10 * scale, 2 * scale);

    graphics.fillStyle(0x1a0a05, 0.7);
    graphics.fillRoundedRect(-4 * scale, 10 * scale, 8 * scale, 8 * scale, 1 * scale);

    graphics.lineStyle(1.5, 0xff2200, 0.8);
    graphics.beginPath();
    graphics.moveTo(-3 * scale, 12 * scale);
    graphics.lineTo(3 * scale, 14 * scale);
    graphics.strokePath();
    graphics.beginPath();
    graphics.moveTo(-2 * scale, 10 * scale);
    graphics.lineTo(2 * scale, 16 * scale);
    graphics.strokePath();

    graphics.fillStyle(0xff4400, 0.8);
    graphics.fillCircle(-2 * scale, 12 * scale, 1.5 * scale);
    graphics.fillCircle(2 * scale, 14 * scale, 1.2 * scale);
    graphics.fillCircle(0, 13 * scale, 1 * scale);

    graphics.fillStyle(0x4a4a4a, 0.4);
    graphics.fillCircle(-3 * scale, 6 * scale, 1.5 * scale);
    graphics.fillCircle(3 * scale, 5 * scale, 1.2 * scale);
    graphics.fillCircle(0, 4 * scale, 1 * scale);
  }
}
