export const tileGraveyard = {
  key: "tile_graveyard",
  draw(g, T) {
    g.fillStyle(0x2a1f1a, 1);
    g.fillRect(0, 0, T, T);
    g.fillStyle(0x1a1510, 0.7);
    for (let i = 0; i < 30; i++) {
      const size = Math.random() * 3 + 1;
      g.fillCircle(Math.random() * T, Math.random() * T, size);
    }
    g.fillStyle(0x0f0a05, 0.5);
    for (let i = 0; i < 15; i++) {
      g.fillCircle(Math.random() * T, Math.random() * T, 2);
    }
    g.fillStyle(0x3a3a3a, 0.8);
    for (let i = 0; i < 3; i++) {
      const x = Math.random() * T;
      const y = Math.random() * T;
      g.fillRect(x, y, 4, 2);
    }
  },
};
