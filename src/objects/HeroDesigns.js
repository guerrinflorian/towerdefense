/**
 * Fonctions de dessin des designs de héros
 * Chaque héros a son propre design selon son hero_id
 */

/**
 * Convertit une couleur hexadécimale en nombre pour Phaser
 */
export function hexToNumber(hex) {
  if (!hex) return 0x2b2b2b;
  const cleanHex = hex.replace("#", "");
  return parseInt(cleanHex, 16);
}

/**
 * Dessine l'ombre au sol (commune à tous les héros)
 */
export function drawShadow(g, s, k) {
  g.fillStyle(0x000000, 0.18);
  g.fillEllipse(0, 18 * s * k, 26 * s * k, 10 * s * k);
}

/**
 * Dessine le corps du chevalier (Pulskar l'épéiste - hero_id = 1)
 */
export function drawKnightBody(g, s, k, heroColor) {
  // Cape (plus stylée)
  g.fillStyle(0x151526, 0.92);
  g.fillEllipse(-2 * s * k, 8 * s * k, 22 * s * k, 30 * s * k);
  g.fillStyle(0x0d0d18, 0.35);
  g.fillEllipse(-6 * s * k, 10 * s * k, 14 * s * k, 24 * s * k);

  // Armure (corps) - utiliser la couleur personnalisée pour le plastron
  const chestplateColor = hexToNumber(heroColor);
  g.fillStyle(chestplateColor, 1);
  g.fillRoundedRect(-12 * s * k, -18 * s * k, 24 * s * k, 34 * s * k, 7 * s * k);
  g.lineStyle(2 * s * k, 0x242424, 1);
  g.strokeRoundedRect(-12 * s * k, -18 * s * k, 24 * s * k, 34 * s * k, 7 * s * k);

  // Plastron (détail) - trait vertical au milieu
  g.lineStyle(2 * s * k, 0x6a6a6a, 0.6);
  g.beginPath();
  g.moveTo(0, -16 * s * k);
  g.lineTo(0, 10 * s * k);
  g.strokePath();

  // Épaulières
  g.fillStyle(0x7a7a7a, 1);
  g.fillCircle(-11 * s * k, -12 * s * k, 7 * s * k);
  g.fillCircle(11 * s * k, -12 * s * k, 7 * s * k);
  g.lineStyle(2 * s * k, 0x2a2a2a, 0.9);
  g.strokeCircle(-11 * s * k, -12 * s * k, 7 * s * k);
  g.strokeCircle(11 * s * k, -12 * s * k, 7 * s * k);

  // Ceinture
  g.fillStyle(0x8b5a2b, 1);
  g.fillRoundedRect(-12 * s * k, 6 * s * k, 24 * s * k, 5 * s * k, 2 * s * k);
  g.fillStyle(0xd2b48c, 0.9);
  g.fillRect(-2 * s * k, 6 * s * k, 4 * s * k, 5 * s * k);

  // Tête
  g.fillStyle(0xffd4a3, 1);
  g.fillCircle(0, -24 * s * k, 8 * s * k);

  // Casque / cheveux - utiliser la couleur personnalisée
  const hatColor = hexToNumber(heroColor);
  g.fillStyle(hatColor, 1);
  g.fillRoundedRect(-10 * s * k, -33 * s * k, 20 * s * k, 8 * s * k, 3 * s * k);

  // Petit "regard"
  g.fillStyle(0x111111, 0.9);
  g.fillCircle(-3.2 * s * k, -24 * s * k, 1.1 * s * k);
  g.fillCircle(3.2 * s * k, -24 * s * k, 1.1 * s * k);
}

/**
 * Dessine le corps du ninja (Pirlov dagues - hero_id = 2)
 */
export function drawNinjaBody(g, s, k, heroColor) {
  // Tenue ninja - plus légère et agile
  // Cape/cape ninja (plus petite et discrète)
  g.fillStyle(0x1a1a2e, 0.85);
  g.fillEllipse(-1 * s * k, 6 * s * k, 18 * s * k, 28 * s * k);
  g.fillStyle(0x0f0f1a, 0.4);
  g.fillEllipse(-4 * s * k, 8 * s * k, 12 * s * k, 22 * s * k);

  // Corps ninja (plus mince et agile)
  const ninjaColor = hexToNumber(heroColor);
  g.fillStyle(ninjaColor, 1);
  g.fillRoundedRect(-10 * s * k, -16 * s * k, 20 * s * k, 32 * s * k, 5 * s * k);
  g.lineStyle(1.5 * s * k, 0x1a1a1a, 1);
  g.strokeRoundedRect(-10 * s * k, -16 * s * k, 20 * s * k, 32 * s * k, 5 * s * k);

  // Détails ninja - bandes croisées
  g.lineStyle(1.5 * s * k, 0x4a4a4a, 0.7);
  g.beginPath();
  g.moveTo(-8 * s * k, -12 * s * k);
  g.lineTo(8 * s * k, 8 * s * k);
  g.moveTo(8 * s * k, -12 * s * k);
  g.lineTo(-8 * s * k, 8 * s * k);
  g.strokePath();

  // Ceinture ninja
  g.fillStyle(0x2a2a2a, 1);
  g.fillRoundedRect(-10 * s * k, 4 * s * k, 20 * s * k, 4 * s * k, 1 * s * k);
  g.fillStyle(0x4a4a4a, 0.8);
  g.fillRect(-1 * s * k, 4 * s * k, 2 * s * k, 4 * s * k);

  // Tête ninja
  g.fillStyle(0xffd4a3, 1);
  g.fillCircle(0, -22 * s * k, 7 * s * k);

  // Masque ninja / bandeau
  g.fillStyle(0x1a1a1a, 1);
  g.fillRoundedRect(-9 * s * k, -30 * s * k, 18 * s * k, 6 * s * k, 2 * s * k);
  // Yeux visibles à travers le masque
  g.fillStyle(0x111111, 0.95);
  g.fillRect(-6 * s * k, -28 * s * k, 3 * s * k, 2 * s * k);
  g.fillRect(3 * s * k, -28 * s * k, 3 * s * k, 2 * s * k);
}

/**
 * Dessine le corps d'un héros selon son hero_id
 */
export function drawHeroBody(g, s, k, heroId, heroColor) {
  // Ombre au sol (commune)
  drawShadow(g, s, k);

  // Design selon le hero_id
  if (heroId === 2) {
    // Pirlov dagues - Guerrier ninja
    drawNinjaBody(g, s, k, heroColor);
  } else {
    // Pulskar l'épéiste (hero_id = 1) ou autres - Chevalier avec armure
    drawKnightBody(g, s, k, heroColor);
  }
}

