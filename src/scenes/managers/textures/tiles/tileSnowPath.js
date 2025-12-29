export const tileSnowPath = {
  key: "tile_snow_path",
  draw(g, T) {
    // Base chemin de glace (bleu-gris)
    const baseColor = 0xb0c4de; // Bleu acier clair
    g.fillStyle(baseColor, 1);
    g.fillRect(0, 0, T, T);

    // Motifs de glace (cristaux)
    g.fillStyle(0x87ceeb, 0.5);
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * T;
      const y = Math.random() * T;
      const size = 2 + Math.random() * 4;
      g.fillCircle(x, y, size);
    }

    // Lignes de glace (fissures)
    g.lineStyle(1, 0x708090, 0.4);
    for (let i = 0; i < 8; i++) {
      const startX = Math.random() * T;
      const startY = Math.random() * T;
      const endX = startX + (Math.random() - 0.5) * 20;
      const endY = startY + (Math.random() - 0.5) * 20;
      g.beginPath();
      g.moveTo(startX, startY);
      g.lineTo(endX, endY);
      g.strokePath();
    }

    // Reflets de glace
    g.fillStyle(0xffffff, 0.3);
    g.fillRect(0, 0, T, T * 0.3);
  },
};
