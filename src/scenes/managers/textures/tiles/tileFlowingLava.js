export const tileFlowingLava = {
  key: "tile_flowing_lava",
  draw(g, T) {
    g.fillStyle(0xff4400, 1);
    g.fillRect(0, 0, T, T);
    g.fillStyle(0xff6600, 0.7);
    for (let i = 0; i < 30; i++) {
      const size = Math.random() * 4 + 2;
      g.fillCircle(Math.random() * T, Math.random() * T, size);
    }
    g.fillStyle(0xcc2200, 0.6);
    for (let i = 0; i < 15; i++) {
      g.fillCircle(Math.random() * T, Math.random() * T, Math.random() * 3 + 1);
    }
    g.fillStyle(0xffaa00, 0.5);
    for (let i = 0; i < 10; i++) {
      g.fillCircle(Math.random() * T, Math.random() * T, 2);
    }
    g.lineStyle(1, 0xff8800, 0.4);
    for (let i = 0; i < 5; i++) {
      const sx = Math.random() * T;
      const sy = Math.random() * T;
      g.beginPath();
      g.moveTo(sx, sy);
      g.lineTo(
        sx + (Math.random() - 0.5) * 25,
        sy + (Math.random() - 0.5) * 25
      );
      g.strokePath();
    }
  },
};
