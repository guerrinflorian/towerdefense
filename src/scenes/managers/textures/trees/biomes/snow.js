// Arbres de glace et piliers de glace pour le biome snow
export function drawSnowTree(graphics, scale) {
  // Tronc de glace (bleu translucide)
  graphics.fillStyle(0x87ceeb, 0.8);
  graphics.fillRect(-2 * scale, 0, 4 * scale, 10 * scale);

  // Branches de glace (cristaux)
  const iceBlue = 0xb0e0e6;
  const iceWhite = 0xffffff;

  // Branche principale (cristal central)
  graphics.fillStyle(iceBlue, 0.9);
  graphics.beginPath();
  graphics.moveTo(0, -12 * scale);
  graphics.lineTo(-6 * scale, -6 * scale);
  graphics.lineTo(-4 * scale, -4 * scale);
  graphics.lineTo(0, -8 * scale);
  graphics.lineTo(4 * scale, -4 * scale);
  graphics.lineTo(6 * scale, -6 * scale);
  graphics.closePath();
  graphics.fillPath();

  // Branches secondaires (cristaux latéraux)
  graphics.fillStyle(iceBlue, 0.8);
  // Gauche
  graphics.beginPath();
  graphics.moveTo(-8 * scale, -4 * scale);
  graphics.lineTo(-10 * scale, 0);
  graphics.lineTo(-6 * scale, 0);
  graphics.closePath();
  graphics.fillPath();
  // Droite
  graphics.beginPath();
  graphics.moveTo(8 * scale, -4 * scale);
  graphics.lineTo(10 * scale, 0);
  graphics.lineTo(6 * scale, 0);
  graphics.closePath();
  graphics.fillPath();

  // Pointes de glace scintillantes
  graphics.fillStyle(iceWhite, 0.9);
  graphics.fillTriangle(0, -12 * scale, -1 * scale, -14 * scale, 1 * scale, -14 * scale);
  graphics.fillTriangle(-8 * scale, -4 * scale, -9 * scale, -6 * scale, -7 * scale, -6 * scale);
  graphics.fillTriangle(8 * scale, -4 * scale, 9 * scale, -6 * scale, 7 * scale, -6 * scale);
}

// Pilier de glace (décor)
export function drawIcePillar(graphics, scale) {
  // Base du pilier
  graphics.fillStyle(0x87ceeb, 0.7);
  graphics.fillRect(-3 * scale, 0, 6 * scale, 15 * scale);

  // Reflets de glace
  graphics.fillStyle(0xb0e0e6, 0.5);
  graphics.fillRect(-2 * scale, 2 * scale, 4 * scale, 12 * scale);

  // Pointes de cristal en haut
  graphics.fillStyle(0xffffff, 0.9);
  graphics.fillTriangle(0, -15 * scale, -3 * scale, -12 * scale, 3 * scale, -12 * scale);
  graphics.fillTriangle(-3 * scale, -12 * scale, -5 * scale, -10 * scale, -1 * scale, -10 * scale);
  graphics.fillTriangle(3 * scale, -12 * scale, 5 * scale, -10 * scale, 1 * scale, -10 * scale);

  // Lignes de glace (fissures)
  graphics.lineStyle(1, 0x708090, 0.4);
  graphics.beginPath();
  graphics.moveTo(-2 * scale, 5 * scale);
  graphics.lineTo(2 * scale, 8 * scale);
  graphics.strokePath();
  graphics.beginPath();
  graphics.moveTo(2 * scale, 3 * scale);
  graphics.lineTo(-2 * scale, 6 * scale);
  graphics.strokePath();
}

// Arbre de glace cristallin (variante 1)
export function drawCrystalIceTree(graphics, scale) {
  // Tronc de glace bleu foncé
  graphics.fillStyle(0x4a90e2, 0.9);
  graphics.fillRect(-2.5 * scale, 0, 5 * scale, 12 * scale);
  
  // Branches principales (cristaux hexagonaux)
  const iceBlue = 0x7fb3d3;
  const crystalWhite = 0xe6f3ff;
  
  // Cristal central (grand)
  graphics.fillStyle(iceBlue, 0.85);
  graphics.beginPath();
  for (let j = 0; j < 6; j++) {
    const angle = (Math.PI / 3) * j - Math.PI / 2;
    const px = Math.cos(angle) * 8 * scale;
    const py = -10 * scale + Math.sin(angle) * 8 * scale;
    if (j === 0) graphics.moveTo(px, py);
    else graphics.lineTo(px, py);
  }
  graphics.closePath();
  graphics.fillPath();
  
  // Cristaux latéraux (moyens)
  graphics.fillStyle(iceBlue, 0.8);
  // Gauche
  graphics.beginPath();
  for (let j = 0; j < 6; j++) {
    const angle = (Math.PI / 3) * j - Math.PI / 2;
    const px = -12 * scale + Math.cos(angle) * 5 * scale;
    const py = -6 * scale + Math.sin(angle) * 5 * scale;
    if (j === 0) graphics.moveTo(px, py);
    else graphics.lineTo(px, py);
  }
  graphics.closePath();
  graphics.fillPath();
  // Droite
  graphics.beginPath();
  for (let j = 0; j < 6; j++) {
    const angle = (Math.PI / 3) * j - Math.PI / 2;
    const px = 12 * scale + Math.cos(angle) * 5 * scale;
    const py = -6 * scale + Math.sin(angle) * 5 * scale;
    if (j === 0) graphics.moveTo(px, py);
    else graphics.lineTo(px, py);
  }
  graphics.closePath();
  graphics.fillPath();
  
  // Pointes de cristal scintillantes
  graphics.fillStyle(crystalWhite, 0.95);
  graphics.fillTriangle(0, -18 * scale, -2 * scale, -20 * scale, 2 * scale, -20 * scale);
  graphics.fillTriangle(-12 * scale, -6 * scale, -14 * scale, -8 * scale, -10 * scale, -8 * scale);
  graphics.fillTriangle(12 * scale, -6 * scale, 14 * scale, -8 * scale, 10 * scale, -8 * scale);
}

// Stalagmite de glace (variante 2)
export function drawIceStalagmite(graphics, scale) {
  // Base large
  graphics.fillStyle(0x5a9fd4, 0.8);
  graphics.fillEllipse(0, 0, 8 * scale, 4 * scale);
  
  // Corps conique
  graphics.fillStyle(0x6bb3e0, 0.85);
  graphics.beginPath();
  graphics.moveTo(-4 * scale, 0);
  graphics.lineTo(0, -18 * scale);
  graphics.lineTo(4 * scale, 0);
  graphics.closePath();
  graphics.fillPath();
  
  // Reflets de glace
  graphics.fillStyle(0x8fc5e8, 0.6);
  graphics.beginPath();
  graphics.moveTo(-2 * scale, -2 * scale);
  graphics.lineTo(1 * scale, -12 * scale);
  graphics.lineTo(2 * scale, -2 * scale);
  graphics.closePath();
  graphics.fillPath();
  
  // Pointe de cristal
  graphics.fillStyle(0xffffff, 0.95);
  graphics.fillTriangle(0, -18 * scale, -1.5 * scale, -22 * scale, 1.5 * scale, -22 * scale);
  
  // Lignes de glace
  graphics.lineStyle(1, 0x4a7ba7, 0.5);
  graphics.beginPath();
  graphics.moveTo(-3 * scale, -4 * scale);
  graphics.lineTo(0, -10 * scale);
  graphics.strokePath();
  graphics.beginPath();
  graphics.moveTo(3 * scale, -4 * scale);
  graphics.lineTo(0, -10 * scale);
  graphics.strokePath();
}

// Arbre gelé avec branches de glace (variante 3)
export function drawFrozenTree(graphics, scale) {
  // Tronc principal (glace bleue)
  graphics.fillStyle(0x4682b4, 0.9);
  graphics.fillRect(-2 * scale, 0, 4 * scale, 14 * scale);
  
  // Branches de glace (cristaux pointus)
  const iceColor = 0x7fb3d3;
  const whiteIce = 0xffffff;
  
  // Branche principale (haut)
  graphics.fillStyle(iceColor, 0.85);
  graphics.beginPath();
  graphics.moveTo(0, -14 * scale);
  graphics.lineTo(-6 * scale, -8 * scale);
  graphics.lineTo(-4 * scale, -6 * scale);
  graphics.lineTo(0, -10 * scale);
  graphics.lineTo(4 * scale, -6 * scale);
  graphics.lineTo(6 * scale, -8 * scale);
  graphics.closePath();
  graphics.fillPath();
  
  // Branches latérales (moyennes)
  // Gauche
  graphics.fillStyle(iceColor, 0.8);
  graphics.beginPath();
  graphics.moveTo(-8 * scale, -4 * scale);
  graphics.lineTo(-10 * scale, 0);
  graphics.lineTo(-6 * scale, 0);
  graphics.closePath();
  graphics.fillPath();
  // Droite
  graphics.beginPath();
  graphics.moveTo(8 * scale, -4 * scale);
  graphics.lineTo(10 * scale, 0);
  graphics.lineTo(6 * scale, 0);
  graphics.closePath();
  graphics.fillPath();
  
  // Petites branches de glace
  graphics.fillStyle(iceColor, 0.75);
  // Haut gauche
  graphics.fillTriangle(-6 * scale, -8 * scale, -8 * scale, -10 * scale, -4 * scale, -10 * scale);
  // Haut droite
  graphics.fillTriangle(6 * scale, -8 * scale, 8 * scale, -10 * scale, 4 * scale, -10 * scale);
  
  // Pointes de cristal scintillantes
  graphics.fillStyle(whiteIce, 0.95);
  graphics.fillTriangle(0, -14 * scale, -1 * scale, -16 * scale, 1 * scale, -16 * scale);
  graphics.fillTriangle(-8 * scale, -4 * scale, -9 * scale, -6 * scale, -7 * scale, -6 * scale);
  graphics.fillTriangle(8 * scale, -4 * scale, 9 * scale, -6 * scale, 7 * scale, -6 * scale);
  
  // Flocons de neige gelés sur les branches
  graphics.fillStyle(whiteIce, 0.7);
  graphics.fillCircle(-6 * scale, -8 * scale, 1.5 * scale);
  graphics.fillCircle(6 * scale, -8 * scale, 1.5 * scale);
  graphics.fillCircle(-8 * scale, -4 * scale, 1 * scale);
  graphics.fillCircle(8 * scale, -4 * scale, 1 * scale);
}

// Colonne de glace avec cristaux (variante 4)
export function drawIceColumn(graphics, scale) {
  // Base
  graphics.fillStyle(0x5a9fd4, 0.75);
  graphics.fillEllipse(0, 0, 6 * scale, 3 * scale);
  
  // Colonne principale
  graphics.fillStyle(0x6bb3e0, 0.8);
  graphics.fillRect(-2.5 * scale, 0, 5 * scale, 16 * scale);
  
  // Reflets internes
  graphics.fillStyle(0x8fc5e8, 0.5);
  graphics.fillRect(-1.5 * scale, 2 * scale, 3 * scale, 12 * scale);
  
  // Cristaux latéraux (petits)
  graphics.fillStyle(0x7fb3d3, 0.85);
  // Gauche
  graphics.beginPath();
  for (let j = 0; j < 6; j++) {
    const angle = (Math.PI / 3) * j;
    const px = -6 * scale + Math.cos(angle) * 3 * scale;
    const py = -8 * scale + Math.sin(angle) * 3 * scale;
    if (j === 0) graphics.moveTo(px, py);
    else graphics.lineTo(px, py);
  }
  graphics.closePath();
  graphics.fillPath();
  // Droite
  graphics.beginPath();
  for (let j = 0; j < 6; j++) {
    const angle = (Math.PI / 3) * j;
    const px = 6 * scale + Math.cos(angle) * 3 * scale;
    const py = -8 * scale + Math.sin(angle) * 3 * scale;
    if (j === 0) graphics.moveTo(px, py);
    else graphics.lineTo(px, py);
  }
  graphics.closePath();
  graphics.fillPath();
  
  // Pointe de cristal en haut
  graphics.fillStyle(0xffffff, 0.95);
  graphics.fillTriangle(0, -16 * scale, -2.5 * scale, -14 * scale, 2.5 * scale, -14 * scale);
  
  // Lignes de glace (fissures verticales)
  graphics.lineStyle(1, 0x4a7ba7, 0.4);
  graphics.beginPath();
  graphics.moveTo(-1.5 * scale, 4 * scale);
  graphics.lineTo(-1.5 * scale, 10 * scale);
  graphics.strokePath();
  graphics.beginPath();
  graphics.moveTo(1.5 * scale, 4 * scale);
  graphics.lineTo(1.5 * scale, 10 * scale);
  graphics.strokePath();
}

