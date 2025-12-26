export const tileRoseGround = {
  key: "tile_rose_ground",
  draw(g, T) {
    // Base rose douce
    const baseColor = 0xffb6c1; // Rose clair
    g.fillStyle(baseColor, 1);
    g.fillRect(0, 0, T, T);

    // Variations de rose pour la texture
    g.fillStyle(0xffc0cb, 0.6); // Rose poudré
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * T;
      const y = Math.random() * T;
      const size = 2 + Math.random() * 3;
      g.fillCircle(x, y, size);
    }

    // Taches de rose plus foncé pour la profondeur
    g.fillStyle(0xff91a4, 0.4); // Rose moyen
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * T;
      const y = Math.random() * T;
      const w = 8 + Math.random() * 12;
      const h = 6 + Math.random() * 10;
      g.fillEllipse(x, y, w, h);
    }

    // Petites fleurs roses (points décoratifs)
    g.fillStyle(0xff69b4, 0.5); // Rose vif
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * T;
      const y = Math.random() * T;
      g.fillCircle(x, y, 1.5);
      // Petites pétales autour
      g.fillCircle(x - 2, y, 0.8);
      g.fillCircle(x + 2, y, 0.8);
      g.fillCircle(x, y - 2, 0.8);
      g.fillCircle(x, y + 2, 0.8);
    }

    // Légère brillance pour un aspect féerique
    g.fillStyle(0xffffff, 0.1);
    g.fillCircle(T * 0.3, T * 0.3, T * 0.2);
    g.fillCircle(T * 0.7, T * 0.7, T * 0.15);
  },
};

