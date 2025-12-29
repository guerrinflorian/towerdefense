// Arbres fioles de chimie et arbres maléfiques pour le biome laboratory
export function drawLaboratoryTree(graphics, scale) {
  // Tronc métallique (gris foncé)
  graphics.fillStyle(0x2f4f4f, 1);
  graphics.fillRect(-2 * scale, 0, 4 * scale, 12 * scale);

  // Fioles de chimie (branches)
  const vialColors = [0xff6347, 0x32cd32, 0x4169e1, 0xffd700]; // Rouge, Vert, Bleu, Or

  // Fiole principale (centrale)
  const mainColor = vialColors[Math.floor(Math.random() * vialColors.length)];
  graphics.fillStyle(0x1a1a1a, 0.8);
  graphics.fillRoundedRect(-3 * scale, -8 * scale, 6 * scale, 10 * scale, 1 * scale);
  graphics.fillStyle(mainColor, 0.7);
  graphics.fillRoundedRect(-2.5 * scale, -5 * scale, 5 * scale, 6 * scale, 0.5 * scale);
  graphics.fillStyle(0x2f4f4f, 0.9);
  graphics.fillRoundedRect(-2 * scale, -9 * scale, 4 * scale, 2 * scale, 0.5 * scale);

  // Fioles latérales
  for (let i = 0; i < 2; i++) {
    const side = i === 0 ? -1 : 1;
    const color = vialColors[Math.floor(Math.random() * vialColors.length)];
    graphics.fillStyle(0x1a1a1a, 0.8);
    graphics.fillRoundedRect((side * 6 - 2) * scale, -6 * scale, 4 * scale, 8 * scale, 1 * scale);
    graphics.fillStyle(color, 0.7);
    graphics.fillRoundedRect((side * 6 - 1.5) * scale, -4 * scale, 3 * scale, 5 * scale, 0.5 * scale);
    graphics.fillStyle(0x2f4f4f, 0.9);
    graphics.fillRoundedRect((side * 6 - 1) * scale, -7 * scale, 2 * scale, 1.5 * scale, 0.5 * scale);
  }

  // Vapeurs chimiques (au-dessus des fioles)
  graphics.fillStyle(0x778899, 0.4);
  for (let i = 0; i < 3; i++) {
    const x = (i - 1) * 6 * scale;
    graphics.fillEllipse(x, -10 * scale, 3 * scale, 5 * scale);
  }
}

// Arbre maléfique (pour le biome laboratory)
export function drawEvilTree(graphics, scale) {
  // Tronc tordu et sombre
  graphics.fillStyle(0x1a1a1a, 1);
  graphics.fillRect(-2.5 * scale, 0, 5 * scale, 14 * scale);

  // Branches tordues (métal rouillé)
  graphics.fillStyle(0x8b4513, 0.9); // Brun (rouille)
  graphics.fillRoundedRect(-8 * scale, -4 * scale, 4 * scale, 2 * scale, 0.5 * scale);
  graphics.fillRoundedRect(4 * scale, -4 * scale, 4 * scale, 2 * scale, 0.5 * scale);
  graphics.fillRoundedRect(-6 * scale, -8 * scale, 3 * scale, 2 * scale, 0.5 * scale);
  graphics.fillRoundedRect(3 * scale, -8 * scale, 3 * scale, 2 * scale, 0.5 * scale);

  // Pointes métalliques acérées
  graphics.fillStyle(0x2f4f4f, 1);
  graphics.fillTriangle(0, -14 * scale, -2 * scale, -12 * scale, 2 * scale, -12 * scale);
  graphics.fillTriangle(-8 * scale, -4 * scale, -10 * scale, -6 * scale, -6 * scale, -6 * scale);
  graphics.fillTriangle(8 * scale, -4 * scale, 10 * scale, -6 * scale, 6 * scale, -6 * scale);

  // Yeux maléfiques (rouge)
  graphics.fillStyle(0xff0000, 0.9);
  graphics.fillCircle(-1.5 * scale, -10 * scale, 1.5 * scale);
  graphics.fillCircle(1.5 * scale, -10 * scale, 1.5 * scale);

  // Fissures et marques d'usure
  graphics.lineStyle(1, 0x000000, 0.6);
  graphics.beginPath();
  graphics.moveTo(-2 * scale, 3 * scale);
  graphics.lineTo(2 * scale, 6 * scale);
  graphics.strokePath();
  graphics.beginPath();
  graphics.moveTo(2 * scale, 2 * scale);
  graphics.lineTo(-2 * scale, 5 * scale);
  graphics.strokePath();
}

