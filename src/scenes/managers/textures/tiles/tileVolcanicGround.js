export const tileVolcanicGround = {
  key: "tile_volcanic_ground",
  draw(g, T) {
    g.fillStyle(0x3a2a1a, 1);
    g.fillRect(0, 0, T, T);
    g.fillStyle(0x2a1a0a, 0.6);
    for (let i = 0; i < 45; i++) {
      const size = Math.random() * 2 + 1;
      g.fillCircle(Math.random() * T, Math.random() * T, size);
    }
    g.fillStyle(0x4a3a2a, 0.4);
    for (let i = 0; i < 20; i++) {
      g.fillCircle(Math.random() * T, Math.random() * T, 1);
    }
    g.lineStyle(1, 0x1a0a05, 0.5);
    for (let i = 0; i < 4; i++) {
      const sx = Math.random() * T;
      const sy = Math.random() * T;
      g.beginPath();
      g.moveTo(sx, sy);
      g.lineTo(
        sx + (Math.random() - 0.5) * 10,
        sy + (Math.random() - 0.5) * 10
      );
      g.strokePath();
    }
  },
};
