export const tileWater = {
  key: "tile_water",
  draw(g, T) {
    g.fillStyle(0x4488ff, 1);
    g.fillRect(0, 0, T, T);
    g.lineStyle(2, 0xffffff, 0.3);
    g.beginPath();
    g.moveTo(10, 20);
    g.lineTo(25, 20);
    g.strokePath();
    g.beginPath();
    g.moveTo(40, 50);
    g.lineTo(55, 50);
    g.strokePath();
  },
};
