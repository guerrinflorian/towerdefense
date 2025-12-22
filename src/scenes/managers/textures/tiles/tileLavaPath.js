export const tileLavaPath = {
  key: "tile_lava_path",
  draw(g, T) {
    g.fillStyle(0x1a0a0a, 1);
    g.fillRect(0, 0, T, T);
    g.fillStyle(0x2a0a0a, 0.8);
    for (let i = 0; i < 50; i++) {
      const size = Math.random() * 2 + 1;
      g.fillCircle(Math.random() * T, Math.random() * T, size);
    }
    g.fillStyle(0xff4400, 0.3);
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * T;
      const y = Math.random() * T;
      g.fillCircle(x, y, Math.random() * 3 + 1);
    }
    g.lineStyle(1, 0xff6600, 0.6);
    for (let i = 0; i < 6; i++) {
      const sx = Math.random() * T;
      const sy = Math.random() * T;
      g.beginPath();
      g.moveTo(sx, sy);
      g.lineTo(
        sx + (Math.random() - 0.5) * 12,
        sy + (Math.random() - 0.5) * 12
      );
      g.strokePath();
    }
    g.fillStyle(0x3a1a1a, 0.5);
    g.fillRect(0, 0, T, 3);
    g.fillRect(0, T - 3, T, 3);
    g.fillRect(0, 0, 3, T);
    g.fillRect(T - 3, 0, 3, T);
  },
};
