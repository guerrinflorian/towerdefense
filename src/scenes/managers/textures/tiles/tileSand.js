export const tileSand = {
  key: "tile_sand",
  draw(g, T) {
    g.fillStyle(0xedc9af, 1);
    g.fillRect(0, 0, T, T);
    g.fillStyle(0xd2b48c, 0.6);
    for (let i = 0; i < 50; i++) {
      const size = Math.random() * 2 + 1;
      g.fillCircle(Math.random() * T, Math.random() * T, size);
    }
    g.fillStyle(0xbc8f5f, 0.4);
    for (let i = 0; i < 20; i++) {
      g.fillCircle(Math.random() * T, Math.random() * T, 1);
    }
  },
};
