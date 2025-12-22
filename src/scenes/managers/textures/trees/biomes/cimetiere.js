export function drawCimetiereTree(graphics, scale) {
  const objectType = Math.random();

  // --- 1. L'ARBRE HANTÉ TORDU (Aspect noueux et sinistre) ---
  if (objectType < 0.4) {
    const trunkColor = 0x1a1a1a;
    graphics.fillStyle(trunkColor, 1);
    
    // Dessin du tronc en segments pour simuler une torsion sans quadraticCurve
    graphics.beginPath();
    graphics.moveTo(-5 * scale, 15 * scale); // Base large
    graphics.lineTo(5 * scale, 15 * scale);
    graphics.lineTo(3 * scale, 5 * scale);
    graphics.lineTo(6 * scale, -5 * scale);  // Torsion vers la droite
    graphics.lineTo(2 * scale, -12 * scale); // Retour
    graphics.lineTo(0, -20 * scale);         // Pointe
    graphics.lineTo(-3 * scale, -5 * scale); 
    graphics.lineTo(-2 * scale, 5 * scale);
    graphics.closePath();
    graphics.fillPath();

    // Branches fines et pointues
    graphics.lineStyle(2 * scale, trunkColor, 1);
    
    // Branche Droite
    graphics.beginPath();
    graphics.moveTo(4 * scale, 0);
    graphics.lineTo(12 * scale, -8 * scale);
    graphics.lineTo(10 * scale, -15 * scale);
    graphics.strokePath();

    // Branche Gauche
    graphics.beginPath();
    graphics.moveTo(-3 * scale, -5 * scale);
    graphics.lineTo(-11 * scale, -12 * scale);
    graphics.strokePath();

    // TOILE D'ARAIGNÉE (Dans les branches)
    graphics.lineStyle(0.5, 0xffffff, 0.3);
    const wx = 5 * scale, wy = -5 * scale;
    for (let i = 0; i < 4; i++) {
      graphics.beginPath();
      graphics.moveTo(wx, wy);
      graphics.lineTo(wx + (5 + i*2) * scale, wy - (2 + i*3) * scale);
      graphics.strokePath();
    }
  } 
  
  // --- 2. LAMPADAIRE CITROUILLE (Lumière d'ambiance) ---
  else if (objectType < 0.7) {
    // Le poteau en fer forgé
    graphics.fillStyle(0x0a0a0a);
    graphics.fillRect(-1.5 * scale, -10 * scale, 3 * scale, 25 * scale); // Socle
    graphics.fillCircle(0, -10 * scale, 3 * scale); // Support

    // La Citrouille
    const pY = -16 * scale;
    graphics.fillStyle(0xd35400); // Orange sombre
    graphics.fillEllipse(0, pY, 9 * scale, 8 * scale);
    
    // Effet de lueur (Glow)
    graphics.fillStyle(0xffaa00, 0.15);
    graphics.fillCircle(0, pY, 15 * scale);
    graphics.fillStyle(0xffaa00, 0.08);
    graphics.fillCircle(0, pY, 25 * scale);

    // Visage découpé (Yeux jaunes brillants)
    graphics.fillStyle(0xffff00);
    graphics.fillTriangle(-4 * scale, pY - 1 * scale, -1 * scale, pY - 1 * scale, -2.5 * scale, pY - 3 * scale);
    graphics.fillTriangle(4 * scale, pY - 1 * scale, 1 * scale, pY - 1 * scale, 2.5 * scale, pY - 3 * scale);
    
    // Bouche maléfique
    graphics.lineStyle(1.5, 0xffff00, 1);
    graphics.beginPath();
    graphics.moveTo(-5 * scale, pY + 2 * scale);
    graphics.lineTo(-2 * scale, pY + 4 * scale);
    graphics.lineTo(0, pY + 2 * scale);
    graphics.lineTo(2 * scale, pY + 4 * scale);
    graphics.lineTo(5 * scale, pY + 2 * scale);
    graphics.strokePath();

    // Tige de la citrouille
    graphics.fillStyle(0x1a3a1a);
    graphics.fillRect(-1 * scale, pY - 9 * scale, 2 * scale, 3 * scale);
  } 
  
  // --- 3. PIERRE TOMBALE ANCIENNE (Détails de fissures) ---
  else {
    const stoneColor = 0x333333;
    graphics.fillStyle(stoneColor);
    
    // Forme de pierre tombale (Haut arrondi)
    graphics.fillRoundedRect(-9 * scale, -2 * scale, 18 * scale, 20 * scale, { 
        tl: 10 * scale, tr: 10 * scale, bl: 0, br: 0 
    });
    
    // Bordure d'usure
    graphics.lineStyle(1, 0x555555, 0.5);
    graphics.strokeRoundedRect(-9 * scale, -2 * scale, 18 * scale, 20 * scale, 10 * scale);

    // Fissure
    graphics.lineStyle(1, 0x000000, 0.6);
    graphics.beginPath();
    graphics.moveTo(2 * scale, 2 * scale);
    graphics.lineTo(-2 * scale, 6 * scale);
    graphics.lineTo(1 * scale, 10 * scale);
    graphics.strokePath();

    // Gravure RIP ou Croix
    graphics.lineStyle(2, 0x111111, 0.8);
    graphics.beginPath();
    graphics.moveTo(0, 4 * scale);
    graphics.lineTo(0, 12 * scale);
    graphics.moveTo(-3 * scale, 7 * scale);
    graphics.lineTo(3 * scale, 7 * scale);
    graphics.strokePath();

    // Petite herbe morte au pied
    graphics.fillStyle(0x1a2a1a);
    graphics.fillTriangle(-10 * scale, 18 * scale, -7 * scale, 14 * scale, -4 * scale, 18 * scale);
    graphics.fillTriangle(10 * scale, 18 * scale, 7 * scale, 15 * scale, 4 * scale, 18 * scale);
  }
}