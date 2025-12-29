export const tileFrozenGround = {
  key: "tile_frozen_ground",
  draw(g, T) {
    // --- Palette "Neige et Glace" ---
    const snowWhite = 0xffffff;      // Neige pure
    const iceBlue = 0xe0f7ff;       // Bleu très pâle (glace)
    const deepIce = 0xa5d8ff;       // Reflets profonds
    const sparkle = 0xffffff;       // Éclats de lumière

    // 1. Fond de base : Neige totale (Remplit tout l'espace, pas de bordure)
    g.fillStyle(snowWhite, 1);
    g.fillRect(0, 0, T, T);

    // 2. Taches de glace (zones bleutées lisses)
    g.fillStyle(iceBlue, 0.4);
    for (let i = 0; i < 3; i++) {
      const x = Math.random() * T;
      const y = Math.random() * T;
      const radius = T * (0.2 + Math.random() * 0.3);
      g.fillCircle(x, y, radius);
    }

    // 3. Micro-relief de la neige (petites ombres pour donner du grain)
    g.fillStyle(deepIce, 0.2);
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * T;
      const y = Math.random() * T;
      const w = 4 + Math.random() * 12;
      const h = 2 + Math.random() * 4;
      // Correction ici : utilisation de fillEllipse(x, y, width, height)
      g.fillEllipse(x, y, w, h);
    }

    // 4. Fissures de glace fines et discrètes
    g.lineStyle(1, deepIce, 0.3);
    for (let i = 0; i < 4; i++) {
      g.beginPath();
      let cx = Math.random() * T;
      let cy = Math.random() * T;
      g.moveTo(cx, cy);
      for (let j = 0; j < 2; j++) {
        cx += (Math.random() - 0.5) * 20;
        cy += (Math.random() - 0.5) * 20;
        g.lineTo(cx, cy);
      }
      g.strokePath();
    }

    // 5. Scintillements (effet cristal de glace)
    g.fillStyle(sparkle, 1);
    for (let i = 0; i < 25; i++) {
      const x = Math.random() * T;
      const y = Math.random() * T;
      const size = 0.5 + Math.random() * 1.2;
      g.fillRect(x, y, size, size);
    }

    // 6. Grand reflet de surface (aspect gelé)
    g.fillStyle(0xffffff, 0.3);
    // Utilisation sécurisée de fillEllipse
    g.fillEllipse(T * 0.5, T * 0.3, T * 0.8, T * 0.2);
  },
};