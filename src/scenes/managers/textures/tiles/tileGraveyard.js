export const tileGraveyard = {
  key: "tile_graveyard",
  draw(g, T) {
    // 1. BASE UNIFORME (La même sur chaque tile pour supprimer la coupure)
    // On utilise un noir organique (terre humide)
    const baseColor = 0x08070a; 
    g.fillStyle(baseColor, 1);
    g.fillRect(0, 0, T, T);

    // 2. TEXTURE DE SOL "SANS COUTURE"
    // On utilise des cercles très larges et très transparents. 
    // Comme ils sont grands, ils se chevauchent visuellement d'une case à l'autre.
    g.fillStyle(0x131118, 0.4);
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * T;
      const y = Math.random() * T;
      // Rayon assez grand pour "casser" les coins de la tile
      const radius = T * (0.3 + Math.random() * 0.4); 
      g.fillCircle(x, y, radius);
    }

    // 3. GRAIN DE TERRE (Bruit aléatoire)
    // On parsème des petits points partout de façon uniforme
    // pour que l'oeil ne repère pas le carré de T x T.
    g.fillStyle(0x000000, 0.5);
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * T;
      const y = Math.random() * T;
      g.fillCircle(x, y, 1);
    }

    // 4. MOUSSE DE CIMETIÈRE (Taches de décomposition)
    // Vert-gris très sombre, fondu dans la terre
    g.fillStyle(0x1a2016, 0.2);
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * T;
      const y = Math.random() * T;
      const w = 15 * Math.random() + 5;
      const h = 8 * Math.random() + 4;
      g.fillEllipse(x, y, w, h);
    }

    // 5. ÉCLATS D'OS / CAILLOUX (Très petits et discrets)
    g.fillStyle(0x888888, 0.2);
    for (let i = 0; i < 6; i++) {
      const x = Math.random() * T;
      const y = Math.random() * T;
      g.fillCircle(x, y, 0.5 + Math.random());
    }

    // 6. VOILE DE BRUME FIXE
    // On ajoute un centre très légèrement plus clair (bleu nuit) 
    // pour donner du volume sans faire de bordures.
    g.fillStyle(0x2a2d3e, 0.03);
    g.fillCircle(T / 2, T / 2, T * 0.7);
  },
};