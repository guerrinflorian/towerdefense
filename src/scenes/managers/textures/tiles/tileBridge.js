export const tileBridge = {
  key: "tile_bridge",
  draw(g, T) {
    g.fillStyle(0x4488ff, 1);
    g.fillRect(0, 0, T, T);
    g.fillStyle(0x8b5a2b, 1);
    g.fillRect(4, 0, T - 8, T);
    g.lineStyle(2, 0x5c3a1e, 1);
    g.beginPath();
    g.moveTo(4, 16);
    g.lineTo(T - 4, 16);
    g.strokePath();
    g.beginPath();
    g.moveTo(4, 32);
    g.lineTo(T - 4, 32);
    g.strokePath();
    g.beginPath();
    g.moveTo(4, 48);
    g.lineTo(T - 4, 48);
    g.strokePath();
  },
};
