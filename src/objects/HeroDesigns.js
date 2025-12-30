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
 * Dessine le corps de Kargan le Rempart (TANK - hero_id = 4)
 * Design massif et imposant avec armure lourde
 */
export function drawTankBody(g, s, k, heroColor) {
  // Ombre au sol (plus grande pour le tank)
  g.fillStyle(0x000000, 0.25);
  g.fillEllipse(0, 20 * s * k, 32 * s * k, 12 * s * k);
  
  // Corps MASSIF et carré (beaucoup plus large et imposant)
  const tankColor = hexToNumber(heroColor);
  g.fillStyle(tankColor, 1);
  g.fillRoundedRect(-16 * s * k, -20 * s * k, 32 * s * k, 42 * s * k, 5 * s * k);
  g.lineStyle(3 * s * k, 0x1a1a1a, 1);
  g.strokeRoundedRect(-16 * s * k, -20 * s * k, 32 * s * k, 42 * s * k, 5 * s * k);
  
  // Plaques d'armure horizontales (style tank)
  g.fillStyle(0x3a3a3a, 1);
  g.fillRoundedRect(-14 * s * k, -18 * s * k, 28 * s * k, 6 * s * k, 2 * s * k);
  g.fillRoundedRect(-14 * s * k, -8 * s * k, 28 * s * k, 6 * s * k, 2 * s * k);
  g.fillRoundedRect(-14 * s * k, 2 * s * k, 28 * s * k, 6 * s * k, 2 * s * k);
  g.fillRoundedRect(-14 * s * k, 12 * s * k, 28 * s * k, 6 * s * k, 2 * s * k);
  
  // Renforts verticaux
  g.lineStyle(2 * s * k, 0x2a2a2a, 0.8);
  g.beginPath();
  g.moveTo(-8 * s * k, -18 * s * k);
  g.lineTo(-8 * s * k, 18 * s * k);
  g.moveTo(8 * s * k, -18 * s * k);
  g.lineTo(8 * s * k, 18 * s * k);
  g.strokePath();
  
  // Épaulières MASSIVES (très imposantes)
  g.fillStyle(0x2a2a2a, 1);
  g.fillCircle(-16 * s * k, -14 * s * k, 11 * s * k);
  g.fillCircle(16 * s * k, -14 * s * k, 11 * s * k);
  g.lineStyle(2 * s * k, 0x1a1a1a, 1);
  g.strokeCircle(-16 * s * k, -14 * s * k, 11 * s * k);
  g.strokeCircle(16 * s * k, -14 * s * k, 11 * s * k);
  
  // Détails sur les épaulières
  g.fillStyle(0x4a4a4a, 1);
  g.fillCircle(-16 * s * k, -14 * s * k, 6 * s * k);
  g.fillCircle(16 * s * k, -14 * s * k, 6 * s * k);
  
  // Tête (plus grosse pour le tank)
  g.fillStyle(0xffd4a3, 1);
  g.fillCircle(0, -28 * s * k, 10 * s * k);
  
  // Casque lourd et fermé (style chevalier lourd)
  g.fillStyle(0x1a1a1a, 1);
  g.fillRoundedRect(-12 * s * k, -40 * s * k, 24 * s * k, 14 * s * k, 3 * s * k);
  g.lineStyle(2 * s * k, 0x3a3a3a, 1);
  g.strokeRoundedRect(-12 * s * k, -40 * s * k, 24 * s * k, 14 * s * k, 3 * s * k);
  
  // Visière (fente horizontale)
  g.fillStyle(0x0a0a0a, 1);
  g.fillRoundedRect(-10 * s * k, -36 * s * k, 20 * s * k, 3 * s * k, 1 * s * k);
  
  // Détails de protection sur le torse
  g.fillStyle(0x5a5a5a, 0.6);
  g.fillRoundedRect(-10 * s * k, -12 * s * k, 20 * s * k, 8 * s * k, 2 * s * k);
}

/**
 * Dessine le corps de Tharok le Tourbillon (CONTROL - hero_id = 5)
 * Design mystique avec motifs tourbillonnants et cape dynamique
 */
export function drawControlBody(g, s, k, heroColor) {
  // Ombre au sol
  drawShadow(g, s, k);
  
  // Cape tourbillonnante (plus dynamique, en spirale)
  const controlColor = hexToNumber(heroColor);
  g.fillStyle(0x2a1a3e, 0.85);
  // Cape en forme de spirale
  g.beginPath();
  g.arc(0, 10 * s * k, 20 * s * k, 0.5, Math.PI * 1.5);
  g.arc(0, 10 * s * k, 15 * s * k, Math.PI * 1.5, 0.5);
  g.fillPath();
  
  // Corps principal (plus mince et agile)
  g.fillStyle(controlColor, 1);
  g.fillRoundedRect(-10 * s * k, -16 * s * k, 20 * s * k, 28 * s * k, 4 * s * k);
  g.lineStyle(2 * s * k, 0x5a4fa0, 1);
  g.strokeRoundedRect(-10 * s * k, -16 * s * k, 20 * s * k, 28 * s * k, 4 * s * k);
  
  // Motifs tourbillonnants SPIRAUX sur le torse
  g.lineStyle(2 * s * k, 0x8b7fa0, 0.7);
  // Spirale externe
  g.beginPath();
  g.arc(0, 2 * s * k, 12 * s * k, 0, Math.PI * 2);
  g.strokePath();
  // Spirale interne
  g.beginPath();
  g.arc(0, 2 * s * k, 7 * s * k, 0, Math.PI * 2);
  g.strokePath();
  // Lignes tourbillonnantes (courbes avec arc)
  g.beginPath();
  g.arc(0, -4 * s * k, 8 * s * k, Math.PI * 0.25, Math.PI * 0.75);
  g.strokePath();
  g.beginPath();
  g.arc(0, 4 * s * k, 8 * s * k, Math.PI * 1.25, Math.PI * 1.75);
  g.strokePath();
  
  // Bandeau/cape sur les épaules (style mage)
  g.fillStyle(0x3a2f60, 1);
  g.fillRoundedRect(-11 * s * k, -14 * s * k, 22 * s * k, 6 * s * k, 2 * s * k);
  
  // Tête
  g.fillStyle(0xffd4a3, 1);
  g.fillCircle(0, -22 * s * k, 7 * s * k);
  
  // Coiffe mystique avec motifs (style mage/contrôleur)
  g.fillStyle(0x4a3fa0, 1);
  g.fillRoundedRect(-9 * s * k, -30 * s * k, 18 * s * k, 10 * s * k, 4 * s * k);
  g.lineStyle(1.5 * s * k, 0x6b5fa0, 1);
  g.strokeRoundedRect(-9 * s * k, -30 * s * k, 18 * s * k, 10 * s * k, 4 * s * k);
  
  // Symbole mystique sur le front
  g.fillStyle(0x8b7fa0, 1);
  g.fillCircle(0, -26 * s * k, 2 * s * k);
  g.lineStyle(1 * s * k, 0x9b8fa0, 1);
  g.beginPath();
  g.moveTo(0, -28 * s * k);
  g.lineTo(-3 * s * k, -24 * s * k);
  g.lineTo(3 * s * k, -24 * s * k);
  g.closePath();
  g.strokePath();
  
  // Bras avec manches flottantes
  g.fillStyle(0x3a2f60, 0.8);
  g.fillRoundedRect(-12 * s * k, -8 * s * k, 4 * s * k, 16 * s * k, 2 * s * k);
  g.fillRoundedRect(8 * s * k, -8 * s * k, 4 * s * k, 16 * s * k, 2 * s * k);
}

/**
 * Dessine le corps d'Eryndel l'Archer (RANGED - hero_id = 6)
 * Design léger, agile, style ranger/archer avec vêtements verts
 */
export function drawRangedBody(g, s, k, heroColor) {
  // Ombre au sol (plus petite, style agile)
  g.fillStyle(0x000000, 0.15);
  g.fillEllipse(0, 18 * s * k, 22 * s * k, 8 * s * k);
  
  // Corps LÉGER et mince (style ranger)
  const rangedColor = hexToNumber(heroColor);
  
  // Cape/cape légère (vert foncé)
  g.fillStyle(0x1a3a1a, 0.75);
  g.fillEllipse(0, 8 * s * k, 20 * s * k, 26 * s * k);
  
  // Corps principal (vert clair - couleur du héros)
  g.fillStyle(rangedColor, 1);
  g.fillRoundedRect(-8 * s * k, -14 * s * k, 16 * s * k, 26 * s * k, 3 * s * k);
  g.lineStyle(1.5 * s * k, 0x2a5a2a, 1);
  g.strokeRoundedRect(-8 * s * k, -14 * s * k, 16 * s * k, 26 * s * k, 3 * s * k);
  
  // Détails de vêtement (lignes diagonales style ranger)
  g.lineStyle(1 * s * k, 0x3a6a3a, 0.6);
  g.beginPath();
  g.moveTo(-6 * s * k, -10 * s * k);
  g.lineTo(6 * s * k, 6 * s * k);
  g.moveTo(6 * s * k, -10 * s * k);
  g.lineTo(-6 * s * k, 6 * s * k);
  g.strokePath();
  
  // Ceinture avec carquois (style archer)
  g.fillStyle(0x4a6a4a, 1);
  g.fillRoundedRect(-8 * s * k, 4 * s * k, 16 * s * k, 4 * s * k, 1 * s * k);
  // Carquois sur le côté
  g.fillStyle(0x3a5a3a, 1);
  g.fillRoundedRect(6 * s * k, -2 * s * k, 5 * s * k, 12 * s * k, 2 * s * k);
  g.lineStyle(1 * s * k, 0x2a4a2a, 1);
  g.strokeRoundedRect(6 * s * k, -2 * s * k, 5 * s * k, 12 * s * k, 2 * s * k);
  // Flèches dans le carquois
  g.lineStyle(1 * s * k, 0x5a7a5a, 0.8);
  for (let i = 0; i < 3; i++) {
    g.beginPath();
    g.moveTo(7.5 * s * k, 1 * s * k + i * 3 * s * k);
    g.lineTo(9.5 * s * k, 1 * s * k + i * 3 * s * k);
    g.strokePath();
  }
  
  // Tête
  g.fillStyle(0xffd4a3, 1);
  g.fillCircle(0, -20 * s * k, 7 * s * k);
  
  // Capuche de ranger (pointue, style elfe)
  g.fillStyle(0x2a5a2a, 1);
  g.beginPath();
  g.moveTo(0, -30 * s * k);
  g.lineTo(-8 * s * k, -26 * s * k);
  g.lineTo(-7 * s * k, -20 * s * k);
  g.lineTo(7 * s * k, -20 * s * k);
  g.lineTo(8 * s * k, -26 * s * k);
  g.closePath();
  g.fillPath();
  g.lineStyle(1.5 * s * k, 0x1a4a1a, 1);
  g.strokePath();
  
  // Détails de la capuche
  g.fillStyle(0x3a6a3a, 0.6);
  g.fillRoundedRect(-6 * s * k, -24 * s * k, 12 * s * k, 4 * s * k, 1 * s * k);
  
  // Bras avec manches (plus visibles)
  g.fillStyle(rangedColor, 0.9);
  g.fillRoundedRect(-10 * s * k, -6 * s * k, 3 * s * k, 14 * s * k, 1 * s * k);
  g.fillRoundedRect(7 * s * k, -6 * s * k, 3 * s * k, 14 * s * k, 1 * s * k);
}

/**
 * Dessine le corps d'un héros selon son hero_id
 */
export function drawHeroBody(g, s, k, heroId, heroColor) {
  // Ombre au sol (commune)
  drawShadow(g, s, k);

  // Design selon le hero_id
  if (heroId === 2) {
    // Dirlov dagues - Guerrier ninja
    drawNinjaBody(g, s, k, heroColor);
  } else if (heroId === 4) {
    // Kargan le Rempart - TANK
    drawTankBody(g, s, k, heroColor);
  } else if (heroId === 5) {
    // Tharok le Tourbillon - CONTROL
    drawControlBody(g, s, k, heroColor);
  } else if (heroId === 6) {
    // Eryndel l'Archer - RANGED
    drawRangedBody(g, s, k, heroColor);
  } else {
    // Pulskar l'épéiste (hero_id = 1) ou autres - Chevalier avec armure
    drawKnightBody(g, s, k, heroColor);
  }
}

