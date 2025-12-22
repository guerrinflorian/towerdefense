export const tileMountain = {
  key: "tile_mountain",
  draw(g, T) {
    g.fillStyle(0x6b5b4f, 1);
    g.fillRect(0, 0, T, T);
    g.fillStyle(0x5a4b3f, 0.8);
    for (let i = 0; i < 15; i++) {
      g.fillRect(Math.random() * T, Math.random() * T, 3, 3);
    }
    g.fillStyle(0x7b6b5f, 0.6);
    for (let i = 0; i < 8; i++) {
      g.fillRect(Math.random() * T, Math.random() * T, 2, 2);
    }
    g.lineStyle(1, 0x4a3d32, 0.5);
    g.strokeRect(0, 0, T, T);
  },
};
