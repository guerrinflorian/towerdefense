export function drawGrassTree(graphics, scale) {
  const treeType = Math.floor(Math.random() * 3);
  if (treeType === 0) {
    graphics.fillStyle(0x8b4513);
    graphics.fillRect(-2 * scale, 0, 4 * scale, 12 * scale);
    graphics.fillStyle(0x2d5016);
    graphics.fillCircle(0, -5 * scale, 10 * scale);
    graphics.fillStyle(0x3a6b1f);
    graphics.fillCircle(0, -5 * scale, 8 * scale);
  } else if (treeType === 1) {
    graphics.fillStyle(0x654321);
    graphics.fillRect(-3 * scale, 0, 6 * scale, 15 * scale);
    graphics.fillStyle(0x1a4d1a);
    graphics.fillCircle(-5 * scale, -8 * scale, 8 * scale);
    graphics.fillCircle(5 * scale, -8 * scale, 8 * scale);
    graphics.fillCircle(0, -12 * scale, 10 * scale);
  } else {
    graphics.fillStyle(0x5c4033);
    graphics.fillRect(-4 * scale, 0, 8 * scale, 18 * scale);
    graphics.fillStyle(0x2d5016);
    graphics.fillCircle(-8 * scale, -10 * scale, 12 * scale);
    graphics.fillCircle(8 * scale, -10 * scale, 12 * scale);
  }
}
