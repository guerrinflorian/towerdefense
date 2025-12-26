export function drawRoseTree(graphics, scale) {
  // On réduit légèrement le multiplicateur pour un équilibre parfait
  const s = scale * 1.25; 
  const treeType = Math.floor(Math.random() * 4);

  // Palette de couleurs "Sakura"
  const colors = {
    trunk: 0x6d4c41,      // Brun chaud
    leafDark: 0xf48fb1,   // Rose soutenu
    leafMed: 0xf8bbd0,    // Rose classique
    leafLight: 0xfce4ec,  // Rose très pâle
    flower: 0xff4081,     // Rose vif pour les détails
    accent: 0xffffff      // Blanc pour l'éclat
  };

  if (treeType === 0) {
    // --- L'ARBRE BALON (ÉLÉGANT & SYMÉTRIQUE) ---
    const trunkW = 5 * s;
    // Tronc centré : on retire la moitié de la largeur à l'axe X
    graphics.fillStyle(colors.trunk);
    graphics.fillRect(-trunkW / 2, 0, trunkW, 22 * s);
    
    // Feuillage en couches de tailles décroissantes pour l'effet de volume
    graphics.fillStyle(colors.leafDark);
    graphics.fillCircle(0, -5 * s, 14 * s);
    graphics.fillStyle(colors.leafMed);
    graphics.fillCircle(0, -7 * s, 11 * s);
    graphics.fillStyle(colors.leafLight);
    graphics.fillCircle(0, -9 * s, 7 * s);

    // Petites fleurs éparpillées
    graphics.fillStyle(colors.flower);
    graphics.fillCircle(-6 * s, -6 * s, 2 * s);
    graphics.fillCircle(6 * s, -6 * s, 2 * s);
    graphics.fillCircle(0, -12 * s, 2 * s);

  } else if (treeType === 1) {
    // --- LE BUISSON TRIPLE (LARGE MAIS ÉQUILIBRÉ) ---
    const trunkW = 6 * s;
    graphics.fillStyle(colors.trunk);
    graphics.fillRect(-trunkW / 2, 0, trunkW, 15 * s);
    
    // Trois sphères de feuillage pour un look "nuage"
    const spheres = [
        {x: -10 * s, y: -5 * s, r: 10 * s, c: colors.leafDark},
        {x: 10 * s, y: -5 * s, r: 10 * s, c: colors.leafDark},
        {x: 0, y: -12 * s, r: 12 * s, c: colors.leafMed}
    ];

    spheres.forEach(sp => {
        graphics.fillStyle(sp.c);
        graphics.fillCircle(sp.x, sp.y, sp.r);
        // Point lumineux sur chaque sphère
        graphics.fillStyle(colors.leafLight);
        graphics.fillCircle(sp.x - 2*s, sp.y - 2*s, sp.r / 2);
    });

  } else if (treeType === 2) {
    // --- LE GRAND CHÊNE ROSE (MAJESTUEUX) ---
    const trunkW = 8 * s;
    graphics.fillStyle(colors.trunk);
    graphics.fillRect(-trunkW / 2, 0, trunkW, 25 * s);
    
    // Base du feuillage
    graphics.fillStyle(colors.leafDark);
    graphics.fillEllipse(0, -10 * s, 20 * s, 15 * s);
    
    // Éclats de fleurs aléatoires bien centrés dans la masse
    graphics.fillStyle(colors.flower);
    for (let i = 0; i < 8; i++) {
        const rx = (Math.random() - 0.5) * 25 * s;
        const ry = -5 * s - (Math.random() * 15 * s);
        graphics.fillCircle(rx, ry, 1.5 * s);
    }
    
    // Touche de lumière au sommet
    graphics.fillStyle(colors.leafLight);
    graphics.fillCircle(0, -18 * s, 8 * s);

  } else {
    // --- LA PETITE MAISON DU JARDINIER ---
    const houseW = 20 * s;
    // Corps de la maison centré
    graphics.fillStyle(colors.leafMed);
    graphics.fillRect(-houseW / 2, 0, houseW, 14 * s);
    
    // Toit
    graphics.fillStyle(colors.flower);
    graphics.fillTriangle(
        - (houseW / 2 + 2 * s), 0, 
        (houseW / 2 + 2 * s), 0, 
        0, -12 * s
    );
    
    // Porte parfaitement centrée
    graphics.fillStyle(colors.trunk);
    graphics.fillRect(-3 * s, 6 * s, 6 * s, 8 * s);
    
    // Fenêtres à gauche et à droite
    graphics.fillStyle(0xffffff);
    graphics.fillRect(-7 * s, 3 * s, 4 * s, 4 * s);
    graphics.fillRect(3 * s, 3 * s, 4 * s, 4 * s);
  }
}