export const tilePath = {
  key: "tile_path",
  draw(g, T) {
    g.fillStyle(0xdbb679, 1);
    g.fillRect(0, 0, T, T);
    g.fillStyle(0xbf9b5e, 0.6);
    for (let i = 0; i < 60; i++) {
      g.fillRect(Math.random() * T, Math.random() * T, 3, 3);
    }
    g.fillStyle(0xa88548, 0.8);
    g.fillRect(0, 0, T, 4);
    g.fillRect(0, T - 4, T, 4);
    g.fillRect(0, 0, 4, T);
    g.fillRect(T - 4, 0, 4, T);
  },
};
