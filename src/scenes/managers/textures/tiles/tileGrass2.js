export const tileGrass2 = {
  key: "tile_grass_2",
  draw(g, T) {
    g.fillStyle(0x267534, 1);
    g.fillRect(0, 0, T, T);
    for (let i = 0; i < 40; i++) {
      g.fillStyle(0x3da850, 0.3);
      g.fillRect(Math.random() * T, Math.random() * T, 2, 2);
    }
  },
};
