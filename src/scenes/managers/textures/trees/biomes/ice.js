export function drawIceTree(graphics, scale) {
  graphics.fillStyle(0x5c4033);
  graphics.fillRect(-2 * scale, 0, 4 * scale, 8 * scale);

  const darkGreen = 0x1a4d1a;
  const snowWhite = 0xffffff;

  graphics.fillStyle(darkGreen);
  graphics.fillTriangle(0, -10 * scale, -8 * scale, 0, 8 * scale, 0);
  graphics.fillStyle(snowWhite);
  graphics.fillTriangle(0, -10 * scale, -2 * scale, -2 * scale, 2 * scale, -2 * scale);

  graphics.fillStyle(darkGreen);
  graphics.fillTriangle(0, -16 * scale, -6 * scale, -6 * scale, 6 * scale, -6 * scale);

  graphics.fillStyle(darkGreen);
  graphics.fillTriangle(0, -20 * scale, -4 * scale, -12 * scale, 4 * scale, -12 * scale);
  graphics.fillStyle(snowWhite);
  graphics.fillTriangle(0, -20 * scale, -2 * scale, -16 * scale, 2 * scale, -16 * scale);
}
