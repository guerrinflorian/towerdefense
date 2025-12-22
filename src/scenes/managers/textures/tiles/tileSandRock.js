export const tileSandRock = {
  key: "tile_sand_rock",
  draw(g, T) {
    g.fillStyle(0xedc9af, 1);
    g.fillRect(0, 0, T, T);
    g.fillStyle(0xd2b48c, 0.5);
    for (let i = 0; i < 40; i++) {
      const size = Math.random() * 2 + 1;
      g.fillCircle(Math.random() * T, Math.random() * T, size);
    }
    g.fillStyle(0x8b7355, 1);
    g.fillCircle(T * 0.3, T * 0.4, 8);
    g.fillStyle(0x6b5b4f, 0.8);
    g.fillCircle(T * 0.3, T * 0.4, 6);
    g.fillStyle(0x8b7355, 1);
    g.fillCircle(T * 0.7, T * 0.6, 6);
    g.fillStyle(0x6b5b4f, 0.8);
    g.fillCircle(T * 0.7, T * 0.6, 4);
    g.fillStyle(0x8b7355, 1);
    g.fillCircle(T * 0.5, T * 0.8, 5);
    g.fillStyle(0x6b5b4f, 0.8);
    g.fillCircle(T * 0.5, T * 0.8, 3);
    g.fillStyle(0x6b5b4f, 0.3);
    g.fillEllipse(T * 0.3, T * 0.5, 12, 4);
    g.fillEllipse(T * 0.7, T * 0.7, 10, 3);
    g.fillEllipse(T * 0.5, T * 0.9, 8, 2);
  },
};
