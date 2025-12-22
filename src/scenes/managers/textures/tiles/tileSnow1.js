export const tileSnow1 = {
  key: "tile_snow_1",
  draw(g, T) {
    g.fillStyle(0xf0f8ff, 1);
    g.fillRect(0, 0, T, T);
    g.fillStyle(0xdbe9f4, 0.8);
    for (let i = 0; i < 40; i++) {
      const size = Math.random() * 3 + 1;
      g.fillCircle(Math.random() * T, Math.random() * T, size);
    }
  },
};
