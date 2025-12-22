export const tileGrass1 = {
  key: "tile_grass_1",
  draw(g, T) {
    g.fillStyle(0x2d8a3e, 1);
    g.fillRect(0, 0, T, T);
    for (let i = 0; i < 40; i++) {
      g.fillStyle(0x3da850, 0.5);
      g.fillRect(Math.random() * T, Math.random() * T, 2, 2);
    }
  },
};
