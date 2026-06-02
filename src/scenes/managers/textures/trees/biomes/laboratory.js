// ============================================================
//  PROPS DÉCORATIFS - BIOME LABORATOIRE (7 types)
// ============================================================

// ── 1. FIOLES CHIMIQUES (détaillées) ──────────────────────────
export function drawLaboratoryVials(g, scale) {
  const s = (v) => v * scale;
  const vialColors = [0xff6347, 0x22d3ee, 0x4ade80, 0xfbbf24, 0xc084fc, 0xf472b6];

  // Châssis métallique (étagère)
  g.fillStyle(0x1e293b, 1);
  g.fillRoundedRect(s(-10), s(2), s(20), s(3), s(0.8));
  g.lineStyle(s(0.8), 0x0ea5e9, 0.4);
  g.strokeRoundedRect(s(-10), s(2), s(20), s(3), s(0.8));
  // Pied central
  g.fillStyle(0x1e293b, 1);
  g.fillRect(s(-2), s(4), s(4), s(9));
  g.fillStyle(0x334155, 1);
  g.fillRoundedRect(s(-6), s(12), s(12), s(3), s(1));

  // 3 fioles sur l'étagère
  const positions = [s(-7), s(0), s(7)];
  positions.forEach((px, idx) => {
    const col = vialColors[idx % vialColors.length];
    const h = s(idx === 1 ? 13 : 10);
    // Corps fiole (verre sombre)
    g.fillStyle(0x0f172a, 0.9);
    g.fillRoundedRect(px - s(3), s(2) - h, s(6), h, s(1.2));
    g.lineStyle(s(0.8), 0x38bdf8, 0.35);
    g.strokeRoundedRect(px - s(3), s(2) - h, s(6), h, s(1.2));
    // Liquide coloré
    g.fillStyle(col, 0.72);
    g.fillRoundedRect(px - s(2.5), s(2) - h * 0.55, s(5), h * 0.5, s(0.8));
    // Bulle dans le liquide
    g.fillStyle(0xffffff, 0.3);
    g.fillCircle(px - s(0.8), s(2) - h * 0.35, s(0.9));
    // Bouchon
    g.fillStyle(0x334155, 1);
    g.fillRoundedRect(px - s(2), s(2) - h - s(2.2), s(4), s(2.5), s(0.6));
  });

  // Vapeurs colorées
  g.fillStyle(0x38bdf8, 0.12);
  g.fillEllipse(s(-7), s(-13), s(5), s(7));
  g.fillStyle(0x22d3ee, 0.1);
  g.fillEllipse(s(0), s(-16), s(4), s(6));
  g.fillStyle(0x4ade80, 0.12);
  g.fillEllipse(s(7), s(-11), s(5), s(7));
}

// ── 2. BOBINE TESLA ────────────────────────────────────────────
export function drawTeslaCoil(g, scale) {
  const s = (v) => v * scale;

  // Socle hexagonal
  g.fillStyle(0x0f172a, 1);
  g.fillRoundedRect(s(-7), s(8), s(14), s(6), s(1.5));
  g.lineStyle(s(1), 0x0ea5e9, 0.5);
  g.strokeRoundedRect(s(-7), s(8), s(14), s(6), s(1.5));
  // Détails socle
  g.fillStyle(0x1e3a5f, 0.7);
  g.fillRect(s(-5), s(10), s(10), s(2));

  // Colonne
  g.fillStyle(0x1e293b, 1);
  g.fillRoundedRect(s(-3.5), s(-6), s(7), s(15), s(1));
  g.fillStyle(0x0ea5e9, 0.1);
  g.fillRoundedRect(s(-2), s(-6), s(4), s(15), s(0.8));

  // Anneaux de bobine (ellipses)
  g.lineStyle(s(1.8), 0x0ea5e9, 0.7);
  for (let i = 0; i < 6; i++) {
    g.strokeEllipse(0, s(-5 + i * 2.3), s(8), s(3));
  }
  // Brillances sur les anneaux
  g.lineStyle(s(0.7), 0x7dd3fc, 0.4);
  for (let i = 0; i < 6; i++) {
    g.strokeEllipse(0, s(-5 + i * 2.3), s(8), s(3));
  }

  // Sphère au sommet
  g.fillStyle(0x0c3a6e, 1);
  g.fillCircle(0, s(-10), s(5.5));
  g.lineStyle(s(1.5), 0x38bdf8, 0.9);
  g.strokeCircle(0, s(-10), s(5.5));
  g.fillStyle(0x7dd3fc, 0.5);
  g.fillCircle(s(-1.8), s(-11.5), s(2));
  g.fillStyle(0xffffff, 0.7);
  g.fillCircle(s(-2.2), s(-12), s(0.8));

  // Arcs électriques (3 éclairs)
  g.lineStyle(s(1.5), 0xffffff, 0.95);
  g.beginPath(); g.moveTo(0, s(-15.5));
  g.lineTo(s(-4), s(-19)); g.lineTo(s(-2), s(-22)); g.strokePath();

  g.lineStyle(s(1.2), 0x7dd3fc, 0.8);
  g.beginPath(); g.moveTo(0, s(-15.5));
  g.lineTo(s(5), s(-18)); g.lineTo(s(3), s(-22)); g.strokePath();

  g.lineStyle(s(1), 0x38bdf8, 0.65);
  g.beginPath(); g.moveTo(0, s(-15.5));
  g.lineTo(s(1), s(-19)); g.lineTo(s(-3), s(-23)); g.strokePath();

  // Halo autour de la sphère
  g.fillStyle(0x38bdf8, 0.06);
  g.fillCircle(0, s(-10), s(9));
}

// ── 3. PANNEAU HOLOGRAPHIQUE ────────────────────────────────────
export function drawHolographicPanel(g, scale) {
  const s = (v) => v * scale;

  // Pied
  g.fillStyle(0x0f172a, 1);
  g.fillRoundedRect(s(-2.5), s(4), s(5), s(9), s(1));
  g.fillStyle(0x1e3a5f, 0.6);
  g.fillRect(s(-1.5), s(4), s(3), s(9));
  // Semelle
  g.fillStyle(0x1e293b, 1);
  g.fillRoundedRect(s(-6), s(11), s(12), s(3), s(1.2));
  g.lineStyle(s(0.8), 0x0ea5e9, 0.4);
  g.strokeRoundedRect(s(-6), s(11), s(12), s(3), s(1.2));

  // Châssis panneau
  g.fillStyle(0x1e293b, 1);
  g.fillRoundedRect(s(-11), s(-14), s(22), s(18), s(1.5));
  g.lineStyle(s(1.5), 0x38bdf8, 0.9);
  g.strokeRoundedRect(s(-11), s(-14), s(22), s(18), s(1.5));

  // Écran holographique (intérieur)
  g.fillStyle(0x061428, 0.95);
  g.fillRoundedRect(s(-9.5), s(-12.5), s(19), s(15), s(1));
  g.fillStyle(0x38bdf8, 0.06);
  g.fillRoundedRect(s(-9.5), s(-12.5), s(19), s(15), s(1));

  // Contenu : lignes de données
  const lineWidths = [0.7, 0.9, 0.55, 0.8];
  lineWidths.forEach((w, i) => {
    g.fillStyle(0x38bdf8, 0.45 + Math.random() * 0.2);
    g.fillRect(s(-8), s(-11 + i * 3), s(w * 14), s(1.2));
  });

  // Contenu : graphe en barres
  const barH = [3, 5, 2, 6, 4];
  barH.forEach((h, i) => {
    const barColor = i === 3 ? 0x22d3ee : 0x38bdf8;
    g.fillStyle(barColor, 0.7);
    g.fillRect(s(-7 + i * 3.2), s(0 - h), s(2.2), s(h));
    g.fillStyle(barColor, 0.2);
    g.fillRect(s(-7 + i * 3.2), s(-h - 1.5), s(2.2), s(1));
  });

  // Indicateur rond (coin supérieur droit)
  g.fillStyle(0x22d3ee, 0.8);
  g.fillCircle(s(8.5), s(-11.5), s(1.2));
  g.lineStyle(s(0.7), 0x7dd3fc, 0.9);
  g.strokeCircle(s(8.5), s(-11.5), s(1.2));

  // Halo du panneau
  g.fillStyle(0x38bdf8, 0.04);
  g.fillRoundedRect(s(-11), s(-14), s(22), s(18), s(1.5));
}

// ── 4. RÉACTEUR CHIMIQUE ────────────────────────────────────────
export function drawChemicalReactor(g, scale) {
  const s = (v) => v * scale;
  const liquidColor = Math.random() < 0.4 ? 0x22c55e : Math.random() < 0.6 ? 0xa855f7 : 0xf97316;

  // Socle
  g.fillStyle(0x0f172a, 1);
  g.fillRoundedRect(s(-8), s(9), s(16), s(5), s(1.2));
  g.lineStyle(s(0.8), 0x334155, 1);
  g.strokeRoundedRect(s(-8), s(9), s(16), s(5), s(1.2));
  // Boulons socle
  g.fillStyle(0x374155, 1);
  [s(-6), s(6)].forEach((bx) => {
    g.fillCircle(bx, s(11.5), s(1));
    g.lineStyle(s(0.5), 0x556370, 0.8);
    g.strokeCircle(bx, s(11.5), s(1));
  });

  // Tuyaux latéraux
  g.fillStyle(0x1e293b, 1);
  g.fillRoundedRect(s(-11), s(-1), s(3.5), s(8), s(0.8));
  g.fillRoundedRect(s(7.5), s(-1), s(3.5), s(8), s(0.8));
  g.lineStyle(s(0.7), 0x38bdf8, 0.3);
  g.strokeRoundedRect(s(-11), s(-1), s(3.5), s(8), s(0.8));
  g.strokeRoundedRect(s(7.5), s(-1), s(3.5), s(8), s(0.8));

  // Corps cylindrique (cuve)
  g.fillStyle(0x0c2040, 1);
  g.fillEllipse(0, 0, s(16), s(24));
  g.lineStyle(s(2), 0x1e4a7a, 0.8);
  g.strokeEllipse(0, 0, s(16), s(24));
  g.lineStyle(s(0.8), 0x38bdf8, 0.4);
  g.strokeEllipse(0, 0, s(16), s(24));

  // Cerclages métalliques
  g.lineStyle(s(2), 0x1e293b, 0.9);
  g.strokeEllipse(0, s(-6), s(14), s(4));
  g.strokeEllipse(0, s(0), s(14), s(4));
  g.strokeEllipse(0, s(6), s(14), s(4));

  // Liquide (visible par transparence)
  g.fillStyle(liquidColor, 0.25);
  g.fillEllipse(0, s(3), s(12), s(16));
  g.fillStyle(liquidColor, 0.12);
  g.fillEllipse(0, s(-2), s(10), s(10));

  // Bulles internes
  g.fillStyle(liquidColor, 0.55);
  g.fillCircle(s(-2.5), s(2), s(1.5));
  g.fillCircle(s(2), s(4), s(1));
  g.fillCircle(s(-1), s(-1), s(1.2));
  g.fillCircle(s(3), s(-2), s(0.8));

  // Dôme supérieur
  g.fillStyle(0x0c2040, 1);
  g.fillEllipse(0, s(-11), s(12), s(7));
  g.lineStyle(s(1.5), 0x1e4a7a, 0.8);
  g.strokeEllipse(0, s(-11), s(12), s(7));
  g.lineStyle(s(0.7), 0x38bdf8, 0.4);
  g.strokeEllipse(0, s(-11), s(12), s(7));

  // Jauge de pression (haut)
  g.fillStyle(0x060e1f, 1);
  g.fillCircle(0, s(-11), s(3));
  g.lineStyle(s(1.2), 0xfbbf24, 0.9);
  g.strokeCircle(0, s(-11), s(3));
  // Aiguille
  g.lineStyle(s(1.2), liquidColor, 0.9);
  g.lineBetween(0, s(-11), s(1.8), s(-13));
}

// ── 5. RACK DE SERVEURS ─────────────────────────────────────────
export function drawServerRack(g, scale) {
  const s = (v) => v * scale;

  // Châssis principal
  g.fillStyle(0x060e1f, 1);
  g.fillRoundedRect(s(-9), s(-16), s(18), s(30), s(1.5));
  g.lineStyle(s(1.5), 0x1e3a5f, 1);
  g.strokeRoundedRect(s(-9), s(-16), s(18), s(30), s(1.5));

  // Rail vertical gauche et droit
  g.fillStyle(0x1e293b, 1);
  g.fillRect(s(-8.5), s(-15.5), s(2), s(29));
  g.fillRect(s(6.5), s(-15.5), s(2), s(29));

  // Unités de serveur (9 tiroirs)
  const statusColors = [
    0x22c55e, 0x22c55e, 0xfbbf24, 0x22c55e,
    0x22c55e, 0xef4444, 0x22c55e, 0x22c55e, 0x38bdf8
  ];
  for (let i = 0; i < 9; i++) {
    const ty = s(-14 + i * 3.2);
    // Tiroir
    g.fillStyle(0x1e293b, 1);
    g.fillRect(s(-7), ty, s(14), s(2.8));
    g.lineStyle(s(0.4), 0x334155, 0.8);
    g.strokeRect(s(-7), ty, s(14), s(2.8));
    // Ligne de façade
    g.lineStyle(s(0.3), 0x374155, 0.6);
    g.lineBetween(s(-5.5), ty + s(1.4), s(4.5), ty + s(1.4));
    // LED status
    g.fillStyle(statusColors[i], 0.95);
    g.fillCircle(s(6), ty + s(1.4), s(0.9));
    if (statusColors[i] !== 0xef4444) {
      g.fillStyle(statusColors[i], 0.25);
      g.fillCircle(s(6), ty + s(1.4), s(1.8));
    }
  }

  // Câble management (bas)
  g.fillStyle(0x0ea5e9, 0.5);
  g.fillRect(s(-7), s(13.5), s(14), s(1.5));
  g.lineStyle(s(0.8), 0x38bdf8, 0.35);
  for (let c = 0; c < 6; c++) {
    g.lineBetween(s(-5 + c * 2.2), s(14.8), s(-5 + c * 2.2 + 0.5), s(17));
  }

  // Logo/badge (haut du rack)
  g.fillStyle(0x0ea5e9, 0.2);
  g.fillRect(s(-5), s(-15.5), s(10), s(2));
  g.fillStyle(0x38bdf8, 0.6);
  g.fillRect(s(-3), s(-15), s(6), s(1));
}

// ── 6. COLONNE D'ÉNERGIE (pylon) ──────────────────────────────
export function drawEnergyPillar(g, scale) {
  const s = (v) => v * scale;

  // Socle en diamant
  g.fillStyle(0x0f172a, 1);
  g.fillRoundedRect(s(-5), s(9), s(10), s(5), s(1.2));
  g.lineStyle(s(1), 0x0ea5e9, 0.5);
  g.strokeRoundedRect(s(-5), s(9), s(10), s(5), s(1.2));

  // Corps de la colonne
  g.fillStyle(0x1e293b, 1);
  g.fillRoundedRect(s(-3), s(-10), s(6), s(20), s(1.2));
  g.lineStyle(s(0.8), 0x1e4a7a, 0.7);
  g.strokeRoundedRect(s(-3), s(-10), s(6), s(20), s(1.2));

  // Flux d'énergie interne (cœur lumineux)
  g.fillStyle(0x38bdf8, 0.07);
  g.fillRoundedRect(s(-2.5), s(-10), s(5), s(20), s(1));
  g.fillStyle(0x38bdf8, 0.12);
  g.fillRoundedRect(s(-1.5), s(-10), s(3), s(20), s(0.8));
  g.fillStyle(0x7dd3fc, 0.18);
  g.fillRoundedRect(s(-0.8), s(-10), s(1.6), s(20), s(0.5));

  // Anneaux d'énergie (ellipses)
  g.lineStyle(s(2), 0x38bdf8, 0.7);
  g.strokeEllipse(0, s(-7), s(7), s(3.5));
  g.strokeEllipse(0, s(-2), s(7), s(3.5));
  g.strokeEllipse(0, s(3), s(7), s(3.5));
  g.lineStyle(s(0.8), 0x7dd3fc, 0.4);
  g.strokeEllipse(0, s(-7), s(7), s(3.5));
  g.strokeEllipse(0, s(-2), s(7), s(3.5));
  g.strokeEllipse(0, s(3), s(7), s(3.5));

  // Cristal au sommet
  g.fillStyle(0x0ea5e9, 0.85);
  g.fillTriangle(0, s(-18), s(-3.5), s(-11), s(3.5), s(-11));
  g.lineStyle(s(1), 0x38bdf8, 0.9);
  g.beginPath();
  g.moveTo(0, s(-18));
  g.lineTo(s(-3.5), s(-11));
  g.lineTo(s(3.5), s(-11));
  g.closePath();
  g.strokePath();
  // Brillance cristal
  g.fillStyle(0xffffff, 0.7);
  g.fillCircle(s(-0.8), s(-15), s(1));
  g.fillStyle(0x7dd3fc, 0.9);
  g.fillCircle(0, s(-14), s(0.5));

  // Halo d'énergie autour
  g.fillStyle(0x38bdf8, 0.04);
  g.fillEllipse(0, 0, s(16), s(38));
}

// ── 7. MACHINE MALÉFIQUE (évolution evil tree) ──────────────────
export function drawEvilMachine(g, scale) {
  const s = (v) => v * scale;

  // Pieds mécaniques
  g.fillStyle(0x111827, 1);
  g.fillRoundedRect(s(-9), s(8), s(4), s(6), s(0.8));
  g.fillRoundedRect(s(5), s(8), s(4), s(6), s(0.8));
  g.lineStyle(s(0.7), 0x374155, 0.8);
  g.strokeRoundedRect(s(-9), s(8), s(4), s(6), s(0.8));
  g.strokeRoundedRect(s(5), s(8), s(4), s(6), s(0.8));

  // Corps principal (métal sombre tordu)
  g.fillStyle(0x111827, 1);
  g.fillRoundedRect(s(-7), s(-5), s(14), s(14), s(1.5));
  g.lineStyle(s(1.5), 0x374155, 1);
  g.strokeRoundedRect(s(-7), s(-5), s(14), s(14), s(1.5));
  // Rivets
  const rivets = [[-5.5, -3.5], [5.5, -3.5], [-5.5, 7.5], [5.5, 7.5]];
  rivets.forEach(([rx, ry]) => {
    g.fillStyle(0x4b5563, 1);
    g.fillCircle(s(rx), s(ry), s(0.9));
    g.lineStyle(s(0.5), 0x6b7280, 0.8);
    g.strokeCircle(s(rx), s(ry), s(0.9));
  });

  // Fissures lumineuses rouges
  g.lineStyle(s(1.2), 0xff2222, 0.55);
  g.beginPath(); g.moveTo(s(-3), s(-2)); g.lineTo(s(2), s(3)); g.strokePath();
  g.lineStyle(s(1), 0xff4444, 0.4);
  g.beginPath(); g.moveTo(s(3), s(-3)); g.lineTo(s(-1), s(5)); g.strokePath();
  // Lueur rouge intérieure
  g.fillStyle(0xff0000, 0.08);
  g.fillRoundedRect(s(-6), s(-4), s(12), s(12), s(1));

  // Bras/tuyaux latéraux
  g.fillStyle(0x1f2937, 1);
  g.fillRoundedRect(s(-13), s(-2), s(6), s(3.5), s(0.8));
  g.fillRoundedRect(s(7), s(-2), s(6), s(3.5), s(0.8));
  // Bouts pointus
  g.fillStyle(0x374155, 1);
  g.fillTriangle(s(-13), s(-2), s(-15), s(-0.25), s(-13), s(1.5));
  g.fillTriangle(s(13), s(-2), s(15), s(-0.25), s(13), s(1.5));

  // Tête (cube avec yeux)
  g.fillStyle(0x0f172a, 1);
  g.fillRoundedRect(s(-6), s(-17), s(12), s(13), s(1.5));
  g.lineStyle(s(1.5), 0x374155, 1);
  g.strokeRoundedRect(s(-6), s(-17), s(12), s(13), s(1.5));

  // Yeux rougeoyants (2)
  g.fillStyle(0x7f1d1d, 1);
  g.fillCircle(s(-2.8), s(-12), s(2.2));
  g.fillCircle(s(2.8), s(-12), s(2.2));
  g.fillStyle(0xff2222, 0.9);
  g.fillCircle(s(-2.8), s(-12), s(1.5));
  g.fillCircle(s(2.8), s(-12), s(1.5));
  g.fillStyle(0xff8888, 0.8);
  g.fillCircle(s(-2.8), s(-12.4), s(0.6));
  g.fillCircle(s(2.8), s(-12.4), s(0.6));
  // Halo yeux
  g.fillStyle(0xff0000, 0.1);
  g.fillCircle(s(-2.8), s(-12), s(3.5));
  g.fillCircle(s(2.8), s(-12), s(3.5));

  // Antennes (épines)
  g.fillStyle(0x374155, 1);
  g.fillTriangle(s(-3), s(-17), s(-4), s(-23), s(-2), s(-23));
  g.fillTriangle(s(3), s(-17), s(2), s(-23), s(4), s(-23));
  g.fillStyle(0xff4444, 0.5);
  g.fillCircle(s(-3), s(-23), s(0.8));
  g.fillCircle(s(3), s(-23), s(0.8));

  // Fumée/vapeur sombre
  g.fillStyle(0x374155, 0.18);
  g.fillEllipse(s(-5), s(-26), s(5), s(7));
  g.fillStyle(0x4b5563, 0.12);
  g.fillEllipse(s(4), s(-27), s(4), s(6));
}
