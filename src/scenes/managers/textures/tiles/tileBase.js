export const tileBase = {
  key: "tile_base",
  draw(g, T) {
    g.fillStyle(0x333333, 1);
    g.fillRect(0, 0, T, T);
    g.lineStyle(3, 0x00ffff, 1);
    g.strokeRect(6, 6, T - 12, T - 12);
    g.fillStyle(0x00ffff, 0.5);
    g.fillCircle(T / 2, T / 2, 10);
  },
};
