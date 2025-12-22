export const tileGraveyardPath = {
  key: "tile_graveyard_path",
  draw(g, T) {
    g.fillStyle(0x1a1a1a, 1);
    g.fillRect(0, 0, T, T);
    g.fillStyle(0x0f0f0f, 0.6);
    for (let i = 0; i < 40; i++) {
      const size = Math.random() * 2 + 1;
      g.fillCircle(Math.random() * T, Math.random() * T, size);
    }
    g.lineStyle(1, 0x0a0a0a, 0.8);
    for (let i = 0; i < 5; i++) {
      const sx = Math.random() * T;
      const sy = Math.random() * T;
      g.beginPath();
      g.moveTo(sx, sy);
      g.lineTo(
        sx + (Math.random() - 0.5) * 15,
        sy + (Math.random() - 0.5) * 15
      );
      g.strokePath();
    }
    g.fillStyle(0x2a2a2a, 0.6);
    g.fillRect(0, 0, T, 3);
    g.fillRect(0, T - 3, T, 3);
    g.fillRect(0, 0, 3, T);
    g.fillRect(T - 3, 0, 3, T);
  },
};
