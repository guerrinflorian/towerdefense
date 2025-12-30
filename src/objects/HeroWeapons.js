/**
 * HeroWeapons.js
 * Dessin + animations des armes (version "plus réaliste", plus détaillée, mais toujours lisible en petit).
 * - Métal : highlights + ombres + rainures
 * - Bois : grain + wrap cuir
 * - Corde : tension / relâchement (visuel + tween)
 *
 * Retourne toujours :
 * { swordPivot, swordGroup, secondDaggerPivot, secondWeaponGroup, parts? }
 * parts contient des refs utiles (ex: bowString) pour animer la corde proprement.
 */

// ---------------------------------------------------------
// Utils couleurs
// ---------------------------------------------------------

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function lighten(hexNum, amount = 0.18) {
  const r = (hexNum >> 16) & 255;
  const g = (hexNum >> 8) & 255;
  const b = hexNum & 255;
  const nr = clamp(Math.round(r + (255 - r) * amount), 0, 255);
  const ng = clamp(Math.round(g + (255 - g) * amount), 0, 255);
  const nb = clamp(Math.round(b + (255 - b) * amount), 0, 255);
  return (nr << 16) | (ng << 8) | nb;
}

function darken(hexNum, amount = 0.22) {
  const r = (hexNum >> 16) & 255;
  const g = (hexNum >> 8) & 255;
  const b = hexNum & 255;
  const nr = clamp(Math.round(r * (1 - amount)), 0, 255);
  const ng = clamp(Math.round(g * (1 - amount)), 0, 255);
  const nb = clamp(Math.round(b * (1 - amount)), 0, 255);
  return (nr << 16) | (ng << 8) | nb;
}

// Petit helper : "trait" anti-alias (Phaser Graphics reste simple)
function strokeSoft(g, width, color, alpha) {
  g.lineStyle(width, color, alpha);
}

// ---------------------------------------------------------
// ÉPÉE (Pulskar - hero_id=1)
// ---------------------------------------------------------

export function drawSwordWeapon(scene, s, k) {
  const swordGroup = scene.add.container(0, 0);

  // Pivot où tu animes (comme avant)
  const swordPivot = scene.add.container(12 * s * k, -4 * s * k);
  swordPivot.setRotation(-0.35);

  const sword = scene.add.graphics();

  // Dimensions
  const bladeW = 26 * s * k;
  const bladeH = 5.4 * s * k;
  const bladeX = 0;
  const bladeY = -2.2 * s * k;

  // --- Lame : base métal + biseau + gouttière ---
  const steel = 0xcfd6de;
  const steelDark = 0x7f8892;
  const steelLight = 0xf3f7fb;

  // Ombre portée (donne du volume)
  sword.fillStyle(0x000000, 0.18);
  sword.fillRoundedRect(bladeX + 1.4 * s * k, bladeY + 1.1 * s * k, bladeW, bladeH, 2.2 * s * k);

  // Lame principale
  sword.fillStyle(steel, 1);
  sword.fillRoundedRect(bladeX, bladeY, bladeW, bladeH, 2.2 * s * k);

  // Biseau (tranchant lumineux)
  sword.fillStyle(steelLight, 0.78);
  sword.fillRoundedRect(bladeX, bladeY, bladeW, 1.9 * s * k, 2.2 * s * k);

  // Biseau bas (ombre)
  sword.fillStyle(steelDark, 0.25);
  sword.fillRoundedRect(bladeX, bladeY + 3.2 * s * k, bladeW, 1.6 * s * k, 2.2 * s * k);

  // Gouttière (rainure centrale)
  sword.fillStyle(0x000000, 0.16);
  sword.fillRoundedRect(bladeX + 3.2 * s * k, bladeY + 2.1 * s * k, (bladeW - 6.4 * s * k), 0.9 * s * k, 1 * s * k);
  sword.fillStyle(0xffffff, 0.12);
  sword.fillRoundedRect(bladeX + 3.4 * s * k, bladeY + 1.9 * s * k, (bladeW - 6.8 * s * k), 0.45 * s * k, 1 * s * k);

  // Pointe (plus crédible : pointe + tranchant)
  sword.fillStyle(steel, 1);
  sword.fillTriangle(
    bladeX + bladeW, bladeY,
    bladeX + bladeW + 9.2 * s * k, bladeY + bladeH / 2,
    bladeX + bladeW, bladeY + bladeH
  );
  sword.fillStyle(steelLight, 0.55);
  sword.fillTriangle(
    bladeX + bladeW, bladeY,
    bladeX + bladeW + 6.4 * s * k, bladeY + bladeH / 2,
    bladeX + bladeW, bladeY + 2.0 * s * k
  );

  // Ligne de contour ultra fine (lisibilité)
  strokeSoft(sword, 1.2 * s * k, 0x0a0a0a, 0.18);
  sword.strokeRoundedRect(bladeX, bladeY, bladeW, bladeH, 2.2 * s * k);

  // --- Garde (crossguard) : métal doré + rivets ---
  const gold = 0xcfa14a;
  const goldDark = 0x7a5a22;
  const guardW = 7.2 * s * k;
  const guardH = 12.2 * s * k;

  sword.fillStyle(gold, 1);
  sword.fillRoundedRect(-5.2 * s * k, -6.2 * s * k, guardW, guardH, 2.4 * s * k);
  sword.fillStyle(goldDark, 0.35);
  sword.fillRoundedRect(-5.2 * s * k, -6.2 * s * k, guardW, 3.2 * s * k, 2.4 * s * k);

  // Petits rivets
  sword.fillStyle(0x111111, 0.22);
  sword.fillCircle(-2.0 * s * k, -3.2 * s * k, 0.6 * s * k);
  sword.fillCircle(-2.0 * s * k, 3.2 * s * k, 0.6 * s * k);

  // --- Poignée : cuir wrap + anneaux ---
  const grip = 0x3b2620;
  const gripLight = 0x5a3a30;

  sword.fillStyle(grip, 1);
  sword.fillRoundedRect(-11.2 * s * k, -2.3 * s * k, 6.8 * s * k, 4.6 * s * k, 1.8 * s * k);

  // Wrap (bandes)
  sword.fillStyle(gripLight, 0.35);
  for (let i = 0; i < 4; i++) {
    sword.fillRoundedRect((-10.7 + i * 1.6) * s * k, -2.1 * s * k, 0.7 * s * k, 4.2 * s * k, 0.6 * s * k);
  }

  // Pommeau (métal)
  sword.fillStyle(0xbec6cf, 1);
  sword.fillCircle(-12.2 * s * k, 0, 2.7 * s * k);
  sword.fillStyle(0xffffff, 0.25);
  sword.fillCircle(-13.1 * s * k, -0.9 * s * k, 0.9 * s * k);

  swordPivot.add(sword);
  swordGroup.add(swordPivot);

  return { swordPivot, swordGroup, secondDaggerPivot: null, secondWeaponGroup: null, parts: {} };
}

// ---------------------------------------------------------
// DAGUES (Dirlov - hero_id=2)
// ---------------------------------------------------------

export function drawDaggers(scene, s, k) {
  const createDagger = (isLeft) => {
    const pivot = scene.add.container(isLeft ? -12.5 * s * k : 12.5 * s * k, -2.2 * s * k);
    pivot.setRotation(isLeft ? 0.35 : -0.35);

    const g = scene.add.graphics();

    const blade = 0x3b4a5a;
    const bladeDark = 0x1f2a33;
    const bladeLight = 0xdfe8f0;

    // Lame (profil + biseau)
    g.fillStyle(0x000000, 0.16);
    g.fillRoundedRect(1.1 * s * k, -1.5 * s * k, 18.2 * s * k, 3.2 * s * k, 1.2 * s * k);

    g.fillStyle(blade, 1);
    g.fillRoundedRect(0, -1.6 * s * k, 18 * s * k, 3.2 * s * k, 1.2 * s * k);

    g.fillStyle(bladeLight, 0.28);
    g.fillRoundedRect(0, -1.6 * s * k, 18 * s * k, 1.05 * s * k, 1.2 * s * k);

    g.fillStyle(bladeDark, 0.25);
    g.fillRoundedRect(0, 0.5 * s * k, 18 * s * k, 1.1 * s * k, 1.2 * s * k);

    // Pointe plus fine
    g.fillStyle(blade, 1);
    g.fillTriangle(
      18 * s * k, -1.6 * s * k,
      25.2 * s * k, 0,
      18 * s * k, 1.6 * s * k
    );
    g.fillStyle(bladeLight, 0.22);
    g.fillTriangle(
      18 * s * k, -1.6 * s * k,
      23.0 * s * k, 0,
      18 * s * k, 0.2 * s * k
    );

    // Garde compacte
    g.fillStyle(0x9aa3ad, 1);
    g.fillRoundedRect(-2.4 * s * k, -3.4 * s * k, 3.6 * s * k, 6.8 * s * k, 1.3 * s * k);
    g.fillStyle(0x000000, 0.15);
    g.fillRoundedRect(-2.4 * s * k, -3.4 * s * k, 3.6 * s * k, 2.1 * s * k, 1.3 * s * k);

    // Poignée
    g.fillStyle(0x141414, 1);
    g.fillRoundedRect(-6.6 * s * k, -1.6 * s * k, 5.0 * s * k, 3.2 * s * k, 1.2 * s * k);

    // Petit anneau / pommeau
    g.fillStyle(0xbec6cf, 0.9);
    g.fillCircle(-6.9 * s * k, 0, 1.2 * s * k);

    // micro contour
    strokeSoft(g, 1.1 * s * k, 0x0a0a0a, 0.15);
    g.strokeRoundedRect(0, -1.6 * s * k, 18 * s * k, 3.2 * s * k, 1.2 * s * k);

    pivot.add(g);
    return pivot;
  };

  const swordGroup = scene.add.container(0, 0);
  const swordPivot = createDagger(false);
  swordGroup.add(swordPivot);

  const secondWeaponGroup = scene.add.container(0, 0);
  const secondDaggerPivot = createDagger(true);
  secondWeaponGroup.add(secondDaggerPivot);

  return { swordPivot, secondDaggerPivot, swordGroup, secondWeaponGroup, parts: {} };
}

// ---------------------------------------------------------
// BOUCLIER (Kargan - hero_id=4)
// ---------------------------------------------------------

export function drawShield(scene, s, k) {
  const shieldGroup = scene.add.container(0, 0);
  const shieldPivot = scene.add.container(-14.5 * s * k, 0);

  const sh = scene.add.graphics();

  // Palette - style bouclier lourd et massif avec accents dorés
  const steel = 0x9aa8b5;
  const steelDark = 0x4a5865;
  const steelLight = 0xd8e5f2;
  const iron = 0x6a7885;
  const gold = 0xd4af37;
  const goldDark = 0x9d7a1a;

  const w = 12 * s * k;
  const h = 32 * s * k; // Réduit pour éviter les dépassements

  // Ombre portée
  sh.fillStyle(0x000000, 0.18);
  sh.fillRoundedRect(1 * s * k, (-16 + 1) * s * k, w, h, 5 * s * k);

  // Corps principal - forme rectangulaire arrondie
  sh.fillStyle(steel, 1);
  sh.fillRoundedRect(0, -16 * s * k, w, h, 5 * s * k);
  
  // Bordure épaisse extérieure
  strokeSoft(sh, 2.8 * s * k, steelDark, 1);
  sh.strokeRoundedRect(0, -16 * s * k, w, h, 5 * s * k);
  
  // Bordure interne dorée (accent)
  strokeSoft(sh, 1.2 * s * k, goldDark, 0.8);
  sh.strokeRoundedRect(1.2 * s * k, (-16 + 1.2) * s * k, w - 2.4 * s * k, h - 2.4 * s * k, 4 * s * k);

  // Plaques de renforcement horizontales (3 sections)
  const plateY = [-8, 0, 8];
  plateY.forEach((yy) => {
    // Plaque principale
    sh.fillStyle(iron, 0.65);
    sh.fillRoundedRect(2 * s * k, yy * s * k - 2.5 * s * k, w - 4 * s * k, 5 * s * k, 2 * s * k);
    
    // Highlight sur la plaque
    sh.fillStyle(steelLight, 0.25);
    sh.fillRoundedRect(2.5 * s * k, yy * s * k - 2 * s * k, w - 5 * s * k, 1.8 * s * k, 1.5 * s * k);
    
    // Ligne de séparation fine
    sh.fillStyle(steelDark, 0.4);
    sh.fillRoundedRect(2.5 * s * k, yy * s * k - 0.2 * s * k, w - 5 * s * k, 0.4 * s * k, 0.2 * s * k);
  });

  // Bossage central massif (umbo) avec emblème doré
  const umboRadius = 4.8 * s * k;
  
  // Ombre du bossage
  sh.fillStyle(0x000000, 0.25);
  sh.fillCircle((w / 2) + 0.4 * s * k, 0.4 * s * k, umboRadius);
  
  // Bossage principal
  sh.fillStyle(steelDark, 1);
  sh.fillCircle((w / 2), 0, umboRadius);
  
  // Bordure dorée du bossage
  strokeSoft(sh, 1.8 * s * k, goldDark, 0.9);
  sh.strokeCircle((w / 2), 0, umboRadius);
  
  // Highlight sur le bossage
  sh.fillStyle(steelLight, 0.55);
  sh.fillCircle((w / 2) - 1.4 * s * k, -1.8 * s * k, 2.8 * s * k);
  
  // Centre doré (emblème)
  sh.fillStyle(goldDark, 1);
  sh.fillCircle((w / 2), 0, 2.2 * s * k);
  sh.fillStyle(gold, 0.95);
  sh.fillCircle((w / 2) - 0.7 * s * k, -1 * s * k, 1.4 * s * k);
  
  // Détail central (point lumineux)
  sh.fillStyle(steelLight, 0.9);
  sh.fillCircle((w / 2), 0, 0.8 * s * k);

  // Motif en étoile (4 pointes) autour du bossage
  sh.fillStyle(gold, 0.5);
  const starPoints = [
    { x: w / 2, y: -10 * s * k },      // Haut
    { x: w / 2, y: 10 * s * k },       // Bas
    { x: 1.5 * s * k, y: 0 },          // Gauche
    { x: w - 1.5 * s * k, y: 0 }       // Droite
  ];
  starPoints.forEach((point) => {
    sh.fillCircle(point.x, point.y, 1.2 * s * k);
    sh.fillStyle(steelLight, 0.3);
    sh.fillCircle(point.x - 0.3 * s * k, point.y - 0.3 * s * k, 0.6 * s * k);
    sh.fillStyle(gold, 0.5);
  });

  // Rivets aux coins (style industriel)
  const cornerRivets = [
    { x: 2.5 * s * k, y: -13 * s * k },
    { x: w - 2.5 * s * k, y: -13 * s * k },
    { x: 2.5 * s * k, y: 13 * s * k },
    { x: w - 2.5 * s * k, y: 13 * s * k }
  ];
  cornerRivets.forEach((rivet) => {
    sh.fillStyle(steelDark, 0.85);
    sh.fillCircle(rivet.x, rivet.y, 1.3 * s * k);
    sh.fillStyle(steelLight, 0.45);
    sh.fillCircle(rivet.x - 0.35 * s * k, rivet.y - 0.35 * s * k, 0.65 * s * k);
  });

  shieldPivot.add(sh);
  shieldGroup.add(shieldPivot);

  return { swordPivot: shieldPivot, swordGroup: shieldGroup, secondDaggerPivot: null, secondWeaponGroup: null, parts: {} };
}

// ---------------------------------------------------------
// ARME TOURBILLON (Tharok - hero_id=5) : chakrams/lammes arcaniques
// ---------------------------------------------------------

export function drawWhirlwindWeapon(scene, s, k) {
  const weaponGroup = scene.add.container(0, 0);
  const weaponPivot = scene.add.container(0, 0);
  weaponPivot.setRotation(0);

  const w = scene.add.graphics();

  // Palette arcanique
  const arc = 0x7a4bd6;
  const arcDark = 0x3a1c6a;
  const arcLight = 0xd3c2ff;

  // Deux anneaux (chakrams) croisés -> taille réduite pour plus de réalisme
  // Anneau vertical
  w.fillStyle(arcDark, 0.55);
  w.fillEllipse(0, 0, 6 * s * k, 28 * s * k);
  strokeSoft(w, 2.2 * s * k, arc, 0.95);
  // Approximation d'ellipse avec arc (ellipse verticale)
  w.beginPath();
  const rx1 = 3 * s * k;
  const ry1 = 14 * s * k;
  const segments1 = 32;
  for (let i = 0; i <= segments1; i++) {
    const angle = (i / segments1) * Math.PI * 2;
    const x = Math.cos(angle) * rx1;
    const y = Math.sin(angle) * ry1;
    if (i === 0) {
      w.moveTo(x, y);
    } else {
      w.lineTo(x, y);
    }
  }
  w.strokePath();

  // Anneau horizontal
  w.fillStyle(arcDark, 0.45);
  w.fillEllipse(0, 0, 28 * s * k, 6 * s * k);
  strokeSoft(w, 2.2 * s * k, arc, 0.95);
  // Approximation d'ellipse avec arc (ellipse horizontale)
  w.beginPath();
  const rx2 = 14 * s * k;
  const ry2 = 3 * s * k;
  const segments2 = 32;
  for (let i = 0; i <= segments2; i++) {
    const angle = (i / segments2) * Math.PI * 2;
    const x = Math.cos(angle) * rx2;
    const y = Math.sin(angle) * ry2;
    if (i === 0) {
      w.moveTo(x, y);
    } else {
      w.lineTo(x, y);
    }
  }
  w.strokePath();

  // "Lames" sur anneau (4 pointes) - taille réduite
  w.fillStyle(arc, 0.95);
  const spikes = [
    { x: 0, y: -15 },
    { x: 0, y: 15 },
    { x: -15, y: 0 },
    { x: 15, y: 0 },
  ];
  spikes.forEach((p) => {
    w.fillTriangle(
      (p.x) * s * k, (p.y) * s * k,
      (p.x + (p.x === 0 ? -3 : 0)) * s * k, (p.y + (p.y === 0 ? 0 : -3)) * s * k,
      (p.x + (p.x === 0 ? 3 : 0)) * s * k, (p.y + (p.y === 0 ? 0 : 3)) * s * k
    );
  });

  // Noyau - taille réduite
  w.fillStyle(arcDark, 1);
  w.fillCircle(0, 0, 4.5 * s * k);
  w.fillStyle(arcLight, 0.35);
  w.fillCircle(-1.0 * s * k, -1.2 * s * k, 2.2 * s * k);

  weaponPivot.add(w);
  weaponGroup.add(weaponPivot);

  return { swordPivot: weaponPivot, swordGroup: weaponGroup, secondDaggerPivot: null, secondWeaponGroup: null, parts: {} };
}

// ---------------------------------------------------------
// ARC (Eryndel - hero_id=6) : plus détaillé + corde animable
// ---------------------------------------------------------

export function drawBow(scene, s, k) {
  const bowGroup = scene.add.container(0, 0);
  const bowPivot = scene.add.container(0, 0);
  bowPivot.setRotation(-0.22);

  // On sépare : bois (Graphics) + corde (Graphics) + flèche (Graphics)
  const bowWood = scene.add.graphics();
  const bowString = scene.add.graphics();
  const bowArrow = scene.add.graphics();

  // Palette
  const wood = 0x7a4a20;
  const woodDark = 0x4f2c12;
  const woodLight = 0xb37a3d;
  const stringCol = 0xe6d0a6;

  // Dimensions arc
  const R = 20 * s * k;        // rayon extérieur
  const thickness = 4.2 * s * k;

  // --- Arc bois : double courbe + volume ---
  // Ombre
  strokeSoft(bowWood, thickness + 1.2 * s * k, 0x000000, 0.18);
  bowWood.beginPath();
  bowWood.arc(0, 0, R, -0.65, 0.65);
  bowWood.strokePath();

  // Corps
  strokeSoft(bowWood, thickness, wood, 1);
  bowWood.beginPath();
  bowWood.arc(0, 0, R, -0.65, 0.65);
  bowWood.strokePath();

  // Highlight (liseré)
  strokeSoft(bowWood, 1.6 * s * k, woodLight, 0.55);
  bowWood.beginPath();
  bowWood.arc(0.8 * s * k, -0.4 * s * k, R - 1.2 * s * k, -0.62, 0.62);
  bowWood.strokePath();

  // Rainure sombre interne
  strokeSoft(bowWood, 1.6 * s * k, woodDark, 0.45);
  bowWood.beginPath();
  bowWood.arc(-0.6 * s * k, 0.6 * s * k, R - 2.2 * s * k, -0.62, 0.62);
  bowWood.strokePath();

  // Extrémités (nocks)
  bowWood.fillStyle(woodDark, 1);
  bowWood.fillCircle(Math.cos(-0.65) * R, Math.sin(-0.65) * R, 2.2 * s * k);
  bowWood.fillCircle(Math.cos(0.65) * R, Math.sin(0.65) * R, 2.2 * s * k);

  // Poignée + wrap cuir
  bowWood.fillStyle(woodDark, 1);
  bowWood.fillRoundedRect(-2.6 * s * k, -5.2 * s * k, 5.2 * s * k, 10.4 * s * k, 2.2 * s * k);
  bowWood.fillStyle(0x5a3a22, 1);
  bowWood.fillRoundedRect(-2.2 * s * k, -4.6 * s * k, 4.4 * s * k, 9.2 * s * k, 2 * s * k);
  bowWood.fillStyle(0x000000, 0.12);
  for (let i = -3; i <= 3; i += 1.5) {
    bowWood.fillRoundedRect(-2.1 * s * k, i * s * k, 4.2 * s * k, 0.55 * s * k, 0.6 * s * k);
  }

  // --- Corde (animable) ---
  // On trace une corde légèrement incurvée (au repos)
  const top = { x: Math.cos(-0.65) * R, y: Math.sin(-0.65) * R };
  const bot = { x: Math.cos(0.65) * R, y: Math.sin(0.65) * R };

  const drawString = (pull = 0) => {
    // pull > 0 => corde tirée vers l'arrière (x négatif si tu veux)
    bowString.clear();
    strokeSoft(bowString, 1.6 * s * k, stringCol, 1);
    
    // Point de contrôle pour la courbe quadratique
    const controlX = (-10 - pull) * s * k;
    const controlY = 0;
    
    // Approximation de la courbe quadratique avec plusieurs segments
    const segments = 8;
    bowString.beginPath();
    bowString.moveTo(top.x, top.y);
    
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      // Formule de Bézier quadratique : (1-t)²P0 + 2(1-t)tP1 + t²P2
      const x = (1 - t) * (1 - t) * top.x + 2 * (1 - t) * t * controlX + t * t * bot.x;
      const y = (1 - t) * (1 - t) * top.y + 2 * (1 - t) * t * controlY + t * t * bot.y;
      bowString.lineTo(x, y);
    }
    bowString.strokePath();

    // petit highlight
    strokeSoft(bowString, 0.9 * s * k, 0xffffff, 0.18);
    const topHighlight = { x: top.x + 0.2 * s * k, y: top.y - 0.2 * s * k };
    const botHighlight = { x: bot.x + 0.2 * s * k, y: bot.y + 0.2 * s * k };
    
    bowString.beginPath();
    bowString.moveTo(topHighlight.x, topHighlight.y);
    
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const x = (1 - t) * (1 - t) * topHighlight.x + 2 * (1 - t) * t * controlX + t * t * botHighlight.x;
      const y = (1 - t) * (1 - t) * topHighlight.y + 2 * (1 - t) * t * controlY + t * t * botHighlight.y;
      bowString.lineTo(x, y);
    }
    bowString.strokePath();
  };

  drawString(0);

  // --- Flèche (option visuelle sur l'arc, sympa) ---
  // Petite flèche alignée horizontalement
  bowArrow.fillStyle(0xc8b08a, 0.9);
  bowArrow.fillRoundedRect(-10 * s * k, -0.8 * s * k, 18 * s * k, 1.6 * s * k, 0.8 * s * k);
  bowArrow.fillStyle(0x8a6a3a, 0.9);
  bowArrow.fillTriangle(8 * s * k, -1.5 * s * k, 13.2 * s * k, 0, 8 * s * k, 1.5 * s * k);
  bowArrow.fillStyle(0xdddddd, 0.7);
  bowArrow.fillTriangle(10.8 * s * k, -1.0 * s * k, 13.2 * s * k, 0, 10.8 * s * k, 1.0 * s * k);
  // Empennage
  bowArrow.fillStyle(0xeaeaea, 0.6);
  bowArrow.fillTriangle(-10.5 * s * k, 0, -13.5 * s * k, -2 * s * k, -13.5 * s * k, 2 * s * k);

  // Assemblage
  bowPivot.add(bowWood);
  bowPivot.add(bowString);
  bowPivot.add(bowArrow);
  bowGroup.add(bowPivot);

  return {
    swordPivot: bowPivot,
    swordGroup: bowGroup,
    secondDaggerPivot: null,
    secondWeaponGroup: null,
    parts: {
      bowString,
      bowArrow,
      drawString, // utile pour animer corde sans recréer la fonction ailleurs
    },
  };
}

// ---------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------

export function drawWeapon(scene, heroId, s, k) {
  if (heroId === 2) return drawDaggers(scene, s, k);
  if (heroId === 4) return drawShield(scene, s, k);
  if (heroId === 5) return drawWhirlwindWeapon(scene, s, k);
  if (heroId === 6) return drawBow(scene, s, k);
  return drawSwordWeapon(scene, s, k);
}

// ---------------------------------------------------------
// ANIMATIONS
// ---------------------------------------------------------

/**
 * ÉPÉE : windup + strike + recoil + settle
 */
export function playSwordAttackAnimation(scene, swordPivot) {
  if (!swordPivot) return;

  const initialX = swordPivot.x;
  const initialY = swordPivot.y;
  const initialRotation = swordPivot.rotation ?? -0.35;
  const initialScaleX = swordPivot.scaleX ?? 1;
  const initialScaleY = swordPivot.scaleY ?? 1;

  scene.tweens.add({
    targets: swordPivot,
    rotation: initialRotation - 0.95,
    x: initialX - 6,
    y: initialY + 1,
    duration: 110,
    ease: "Cubic.easeIn",
    onComplete: () => {
      scene.tweens.add({
        targets: swordPivot,
        rotation: initialRotation + 1.25,
        x: initialX + 16,
        y: initialY - 2,
        scaleX: 1.45,
        scaleY: 0.82,
        duration: 85,
        ease: "Expo.easeOut",
        onComplete: () => {
          scene.tweens.add({
            targets: swordPivot,
            rotation: initialRotation,
            x: initialX,
            y: initialY,
            scaleX: initialScaleX,
            scaleY: initialScaleY,
            duration: 260,
            ease: "Back.easeOut",
          });
        },
      });
    },
  });
}

/**
 * DAGUES : deux estocades punchy + micro overshoot
 */
export function playDaggerAttackAnimation(scene, swordPivot, secondDaggerPivot) {
  if (!swordPivot || !secondDaggerPivot) return;

  const stab = (target, delay, dir) => {
    const ix = target.x;
    const ir = target.rotation ?? 0;
    scene.tweens.add({
      targets: target,
      x: ix + dir * 22,
      rotation: ir + dir * 0.35,
      scaleX: 1.55,
      scaleY: 0.92,
      duration: 70,
      delay,
      ease: "Quart.easeOut",
      onComplete: () => {
        scene.tweens.add({
          targets: target,
          x: ix - dir * 3,
          rotation: ir - dir * 0.08,
          scaleX: 1.0,
          scaleY: 1.0,
          duration: 90,
          ease: "Cubic.easeOut",
          onComplete: () => {
            scene.tweens.add({
              targets: target,
              x: ix,
              rotation: ir,
              duration: 120,
              ease: "Back.easeOut",
            });
          },
        });
      },
    });
  };

  // droite puis gauche (rythme)
  stab(swordPivot, 0, +1);
  stab(secondDaggerPivot, 60, -1);
}

/**
 * Bouclier : "bash" avec inertie (plus lourd)
 */
export function playShieldAttackAnimation(scene, shieldPivot) {
  if (!shieldPivot) return;

  const initialX = shieldPivot.x ?? -14.5;
  const initialY = shieldPivot.y ?? 0;
  const initialRotation = shieldPivot.rotation ?? 0;

  scene.tweens.add({
    targets: shieldPivot,
    x: initialX - 7,
    y: initialY + 1,
    rotation: initialRotation - 0.22,
    duration: 110,
    ease: "Cubic.easeIn",
    onComplete: () => {
      scene.tweens.add({
        targets: shieldPivot,
        x: initialX + 14,
        y: initialY - 2,
        rotation: initialRotation + 0.55,
        duration: 130,
        ease: "Expo.easeOut",
        onComplete: () => {
          scene.tweens.add({
            targets: shieldPivot,
            x: initialX,
            y: initialY,
            rotation: initialRotation,
            duration: 260,
            ease: "Back.easeOut",
          });
        },
      });
    },
  });
}

/**
 * ARC : tension corde (visuel) + relâchement + petit kick
 * - parts.drawString(pull) est utilisé si fourni (sinon fallback simple).
 */
export function playBowAttackAnimation(scene, bowPivot, isMelee = false, parts = null) {
  if (!bowPivot) return;

  const initialRotation = bowPivot.rotation ?? -0.22;
  const initialScaleX = bowPivot.scaleX ?? 1;
  const initialScaleY = bowPivot.scaleY ?? 1;

  const hasString = parts?.drawString && typeof parts.drawString === "function";

  if (isMelee) {
    scene.tweens.add({
      targets: bowPivot,
      rotation: initialRotation + 0.85,
      scaleX: 1.2,
      scaleY: 0.95,
      duration: 110,
      yoyo: true,
      ease: "Quad.easeOut",
      onComplete: () => {
        if (!bowPivot) return;
        bowPivot.rotation = initialRotation;
        bowPivot.scaleX = initialScaleX;
        bowPivot.scaleY = initialScaleY;
      },
    });
    return;
  }

  // TENSION : on "tire" la corde via un tween virtuel
  const pullObj = { pull: 0 };

  // 1) Wind-up : rotation + squeeze
  scene.tweens.add({
    targets: bowPivot,
    rotation: initialRotation - 0.28,
    scaleX: 0.88,
    scaleY: 1.12,
    duration: 90,
    ease: "Cubic.easeIn",
  });

  // 2) Pull corde (visuel)
  scene.tweens.add({
    targets: pullObj,
    pull: 10, // plus grand = corde plus tirée
    duration: 95,
    ease: "Cubic.easeIn",
    onUpdate: () => {
      if (hasString) parts.drawString(pullObj.pull);
    },
    onComplete: () => {
      // 3) Release : corde revient d’un coup + kick
      scene.tweens.add({
        targets: pullObj,
        pull: 0,
        duration: 70,
        ease: "Expo.easeOut",
        onUpdate: () => {
          if (hasString) parts.drawString(pullObj.pull);
        },
      });

      scene.tweens.add({
        targets: bowPivot,
        rotation: initialRotation + 0.18,
        scaleX: 1.12,
        scaleY: 0.92,
        duration: 90,
        ease: "Expo.easeOut",
        onComplete: () => {
          scene.tweens.add({
            targets: bowPivot,
            rotation: initialRotation,
            scaleX: initialScaleX,
            scaleY: initialScaleY,
            duration: 220,
            ease: "Back.easeOut",
          });
        },
      });
    },
  });
}

/**
 * Orchestrateur d'animation
 * - Si heroId==6 et que tu as parts (corde), passe-les ici.
 */
export function playWeaponAttackAnimation(scene, heroId, swordPivot, secondDaggerPivot = null, parts = null) {
  if (heroId === 2) {
    playDaggerAttackAnimation(scene, swordPivot, secondDaggerPivot);
  } else if (heroId === 4) {
    playShieldAttackAnimation(scene, swordPivot);
  } else if (heroId === 6) {
    playBowAttackAnimation(scene, swordPivot, false, parts);
  } else {
    playSwordAttackAnimation(scene, swordPivot);
  }
}
