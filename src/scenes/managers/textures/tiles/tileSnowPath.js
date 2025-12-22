export const tileSnowPath = {
  key: "tile_snow_path",
  draw(g, T) {
    g.fillStyle(0xb0e0e6, 1);
    g.fillRect(0, 0, T, T);
    g.lineStyle(1, 0xffffff, 0.6);
    for (let i = 0; i < 10; i++) {
      const sx = Math.random() * T;
      const sy = Math.random() * T;
      g.beginPath();
      g.moveTo(sx, sy);
      g.lineTo(sx + (Math.random() - 0.5) * 20, sy + (Math.random() - 0.5) * 20);
      g.strokePath();
    }
    g.fillStyle(0xe0ffff, 0.5);
    g.fillRect(0, 0, T, 3);
    g.fillRect(0, T - 3, T, 3);
    g.fillRect(0, 0, 3, T);
    g.fillRect(T - 3, 0, 3, T);
  },
};
