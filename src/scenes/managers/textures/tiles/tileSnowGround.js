export const tileSnowGround = {
  key: "tile_snow_ground",
  draw(g, T) {
    // Base neige blanche
    const baseColor = 0xf0f8ff; // Blanc bleuté
    g.fillStyle(baseColor, 1);
    g.fillRect(0, 0, T, T);

    // Flocons de neige dispersés
    g.fillStyle(0xffffff, 0.9);
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * T;
      const y = Math.random() * T;
      const size = 1 + Math.random() * 2;
      g.fillCircle(x, y, size);
    }

    // Zones d'ombre bleutées pour la profondeur
    g.fillStyle(0xdbe9f4, 0.6);
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * T;
      const y = Math.random() * T;
      const w = 10 + Math.random() * 15;
      const h = 8 + Math.random() * 12;
      g.fillEllipse(x, y, w, h);
    }

    // Petites cristaux de glace scintillants
    g.fillStyle(0xb0e0e6, 0.7);
    for (let i = 0; i < 12; i++) {
      const x = Math.random() * T;
      const y = Math.random() * T;
      // Forme de cristal (losange)
      g.beginPath();
      g.moveTo(x, y - 2);
      g.lineTo(x + 2, y);
      g.lineTo(x, y + 2);
      g.lineTo(x - 2, y);
      g.closePath();
      g.fillPath();
    }

    // Légère brillance pour un aspect gelé
    g.fillStyle(0xffffff, 0.15);
    g.fillCircle(T * 0.25, T * 0.25, T * 0.15);
    g.fillCircle(T * 0.75, T * 0.75, T * 0.12);
  },
};

