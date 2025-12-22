export function drawSandTree(graphics, scale) {
  const treeType = Math.random();

  if (treeType < 0.6) {
    graphics.fillStyle(0x2d5016);
    graphics.fillRect(-2 * scale, 0, 4 * scale, 16 * scale);
    graphics.fillRect(-6 * scale, 4 * scale, 4 * scale, 8 * scale);
    graphics.fillRect(2 * scale, 6 * scale, 4 * scale, 6 * scale);

    graphics.fillStyle(0x3a6b1f);
    graphics.fillRect(-2 * scale, 0, 4 * scale, 16 * scale);
    graphics.fillRect(-6 * scale, 4 * scale, 4 * scale, 8 * scale);
    graphics.fillRect(2 * scale, 6 * scale, 4 * scale, 6 * scale);

    graphics.fillStyle(0xffffff, 0.8);
    for (let i = 0; i < 8; i++) {
      graphics.fillCircle(
        (Math.random() - 0.5) * 8 * scale,
        Math.random() * 16 * scale,
        1 * scale
      );
    }
  } else {
    graphics.fillStyle(0x8b4513);
    graphics.fillRect(-6 * scale, 0, 12 * scale, 20 * scale);

    graphics.fillStyle(0x654321, 0.6);
    for (let i = 0; i < 3; i++) {
      graphics.fillRect(-5 * scale + i * 4 * scale, 0, 2 * scale, 20 * scale);
    }

    graphics.fillStyle(0x5c4033);
    graphics.fillRect(-8 * scale, 4 * scale, 4 * scale, 3 * scale);
    graphics.fillRect(4 * scale, 6 * scale, 4 * scale, 3 * scale);

    graphics.fillStyle(0x2d5016, 0.7);
    graphics.fillCircle(-6 * scale, 2 * scale, 4 * scale);
    graphics.fillCircle(6 * scale, 4 * scale, 4 * scale);
    graphics.fillCircle(0, -2 * scale, 5 * scale);
  }
}
