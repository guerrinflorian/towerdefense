export const tileLaboratoryGround = {
  key: "tile_laboratory_ground",
  draw(g, T) {
    const bgColor = 0x0f172a;
    const strokeColor = 0x38bdf8; // Bleu cyan néon
    
    g.fillStyle(bgColor, 1);
    g.fillRect(0, 0, T, T);

    // Dessin d'un hexagone centré
    const centerX = T / 2;
    const centerY = T / 2;
    const size = T * 0.45;

    g.lineStyle(1, strokeColor, 0.3);
    g.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = centerX + size * Math.cos(angle);
      const y = centerY + size * Math.sin(angle);
      if (i === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.closePath();
    g.strokePath();

    // Petit point de donnée central (core)
    g.fillStyle(strokeColor, 0.1);
    g.fillCircle(centerX, centerY, size * 0.6);
  },
};