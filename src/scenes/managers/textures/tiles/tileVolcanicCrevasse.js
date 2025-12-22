export const tileVolcanicCrevasse = {
  key: "tile_volcanic_crevasse",
  draw(g, T) {
    g.fillStyle(0x2a1a0a, 1);
    g.fillRect(0, 0, T, T);
    g.fillStyle(0x1a0a05, 0.7);
    for (let i = 0; i < 40; i++) {
      const size = Math.random() * 3 + 1;
      g.fillCircle(Math.random() * T, Math.random() * T, size);
    }
    g.lineStyle(2, 0xff2200, 0.8);
    for (let i = 0; i < 4; i++) {
      const sx = Math.random() * T;
      const sy = Math.random() * T;
      g.beginPath();
      g.moveTo(sx, sy);
      g.lineTo(
        sx + (Math.random() - 0.5) * 20,
        sy + (Math.random() - 0.5) * 20
      );
      g.strokePath();
    }
    g.fillStyle(0xff4400, 0.5);
    for (let i = 0; i < 8; i++) {
      g.fillCircle(Math.random() * T, Math.random() * T, 2);
    }
  },
};
