export const tileRosePath = {
  key: "tile_rose_path",
  draw(g, T) {
    // Base rose quartz royale - un rose profond et cristallin
    const baseColor = 0xe91e63; // Rose profond
    g.fillStyle(baseColor, 1);
    g.fillRect(0, 0, T, T);

    // Motif cristallin avec des reflets
    g.fillStyle(0xf06292, 0.7); // Rose moyen brillant
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * T;
      const y = Math.random() * T;
      const size = 1.5 + Math.random() * 2;
      g.fillRect(x, y, size, size);
    }

    // Éclats de lumière cristalline (rose quartz)
    g.fillStyle(0xffb3d9, 0.6); // Rose très clair
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * T;
      const y = Math.random() * T;
      const radius = 2 + Math.random() * 3;
      g.fillCircle(x, y, radius);
    }

    // Bordures brillantes pour un aspect royal
    g.fillStyle(0xff4081, 0.8); // Rose magenta brillant
    g.fillRect(0, 0, T, 3);
    g.fillRect(0, T - 3, T, 3);
    g.fillRect(0, 0, 3, T);
    g.fillRect(T - 3, 0, 3, T);

    // Lignes de lumière pour l'effet cristallin
    g.lineStyle(1, 0xffb3d9, 0.4);
    for (let i = 0; i < 5; i++) {
      const startX = Math.random() * T;
      const startY = Math.random() * T;
      const endX = startX + (Math.random() - 0.5) * 20;
      const endY = startY + (Math.random() - 0.5) * 20;
      g.lineBetween(startX, startY, endX, endY);
    }

    // Points de brillance (effet gemme)
    g.fillStyle(0xffffff, 0.5);
    for (let i = 0; i < 6; i++) {
      const x = Math.random() * T;
      const y = Math.random() * T;
      g.fillCircle(x, y, 1);
    }
  },
};

