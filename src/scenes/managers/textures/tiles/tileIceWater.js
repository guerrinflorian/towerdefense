export const tileIceWater = {
  key: "tile_ice_water",
  draw(g, T) {
    g.fillStyle(0x4682b4, 1);
    g.fillRect(0, 0, T, T);
    g.fillStyle(0xaaddff, 0.7);
    g.fillRect(0, 0, T, T);
    g.lineStyle(2, 0x2f4f4f, 0.5);
    g.beginPath();
    g.moveTo(0, Math.random() * T);
    g.lineTo(T / 2, T / 2);
    g.lineTo(T, Math.random() * T);
    g.strokePath();
    g.fillStyle(0xffffff, 0.6);
    g.fillCircle(T * 0.2, T * 0.2, 3);
    g.fillCircle(T * 0.7, T * 0.6, 2);
  },
};
