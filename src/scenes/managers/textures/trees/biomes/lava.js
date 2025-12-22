// Version OPTIMISÉE : moins de shapes, mais gros props "waw"
export function drawLavaTree(g, scale = 1) {
  const rand = Math.random;

  // --- Taille : 30% gros, 10% mega ---
  const giant = rand() < 0.30;
  const mega = giant && rand() < 0.33;
  const S = scale * (mega ? 2.0 : giant ? 1.45 : 1.0);

  const s = (v) => v * S;

  const circle = (x, y, r, color, a = 1) => {
    g.fillStyle(color, a);
    g.fillCircle(s(x), s(y), s(r));
  };

  const ellipse = (x, y, rx, ry, color, a = 1) => {
    g.fillStyle(color, a);
    g.fillEllipse(s(x), s(y), s(rx), s(ry));
  };

  const line = (x1, y1, x2, y2, w, color, a) => {
    g.lineStyle(s(w), color, a);
    g.beginPath();
    g.moveTo(s(x1), s(y1));
    g.lineTo(s(x2), s(y2));
    g.strokePath();
  };

  // Palette (simple)
  const OBS = 0x120705;
  const BAS = 0x2a1710;
  const ASH = 0x4a4a4a;
  const L1 = 0xff3b00;
  const L2 = 0xff7a00;
  const L3 = 0xffd200;

  const baseY = 17;

  // Socle commun (2 ellipses max)
  ellipse(0, baseY + 1.0, mega ? 8.0 : giant ? 6.8 : 5.4, mega ? 2.9 : 2.4, OBS, 1);
  ellipse(0.8, baseY + 0.8, mega ? 6.0 : giant ? 5.0 : 4.0, mega ? 2.0 : 1.7, BAS, 0.85);

  // Choix type (3 types seulement)
  const t = rand();

  // --------------------------------------------------
  // TYPE A : SPIRE (totem) — IMPOSANT mais peu de shapes
  // --------------------------------------------------
  if (t < 0.38) {
    const seg = mega ? 12 : giant ? 10 : 8;       // moins de segments
    const step = mega ? 2.0 : 2.1;

    for (let i = 0; i < seg; i++) {
      const k = i / (seg - 1);
      const y = baseY - i * step;
      const x = Math.sin(k * 5.2) * (mega ? 1.4 : 1.0);
      const r0 = (mega ? 4.6 : giant ? 3.8 : 3.1) - k * (mega ? 2.6 : 2.0);

      circle(x, y, r0, OBS, 1);
      circle(x + 0.35, y + 0.1, r0 * 0.72, BAS, 0.88);

      // Glow ponctuel (1 seul cercle, pas de halo)
      if (rand() < (giant ? 0.35 : 0.25)) {
        circle(x + 0.1, y, r0 * 0.65, L1, 0.12);
        if (rand() < 0.35) circle(x + (rand() - 0.5) * r0, y - 0.2, 0.45, L3, 0.22);
      }
    }

    // 2 fissures max (pas plus)
    line(-0.8, baseY - 0.5, 0.9, baseY - (mega ? 16 : giant ? 13 : 10), 1.2, L1, 0.55);
    line(1.1, baseY - 3.0, -0.2, baseY - (mega ? 18 : giant ? 14.5 : 11.5), 1.0, L2, 0.45);

    // Cendres (peu)
    const aCount = mega ? 7 : 5;
    for (let i = 0; i < aCount; i++) {
      circle((rand() - 0.5) * (mega ? 14 : 10), -3 - rand() * (mega ? 5 : 3), 0.9 + rand() * 0.7, ASH, 0.12);
    }
    return;
  }

  // --------------------------------------------------
  // TYPE B : CHAMPIGNON — chapeau énorme, très lisible
  // --------------------------------------------------
  if (t < 0.72) {
    const seg = mega ? 8 : giant ? 7 : 6;
    for (let i = 0; i < seg; i++) {
      const y = baseY - i * 2.2;
      const r0 = (mega ? 3.2 : 2.6) + i * (mega ? 0.45 : 0.35);
      circle(0, y, r0, OBS, 1);
      circle(0.25, y + 0.12, r0 * 0.72, BAS, 0.86);
    }

    const capY = baseY - seg * 2.2 - (mega ? 3.0 : 2.2);
    const capR = mega ? 11.0 : giant ? 9.0 : 7.2;

    circle(0, capY, capR, OBS, 1);
    circle(0.8, capY + 0.4, capR * 0.78, BAS, 0.74);

    // Sous-chapeau chaud (1 seul disque)
    circle(0.2, capY + capR * 0.45, capR * 0.42, L1, 0.14);

    // Fissures simples (3 max)
    line(-capR * 0.72, capY + 0.3, -capR * 0.18, capY - 1.2, 1.2, L1, 0.55);
    line(capR * 0.68, capY + 0.6, capR * 0.20, capY - 1.0, 1.2, L1, 0.55);
    line(0, capY + capR * 0.78, 0, capY + 0.2, 1.0, L2, 0.45);

    // Braises (peu)
    const eCount = mega ? 10 : 7;
    for (let i = 0; i < eCount; i++) {
      circle((rand() - 0.5) * (mega ? 14 : 11), 10 + rand() * 8, 0.35 + rand() * 0.35, L2, 0.22);
      if (rand() < 0.35) circle((rand() - 0.5) * (mega ? 14 : 11), 10 + rand() * 8, 0.25, L3, 0.18);
    }

    return;
  }

  // --------------------------------------------------
  // TYPE C : CORAIL — 3 tiges max, pas de surcoût
  // --------------------------------------------------
  {
    const stems = mega
      ? [{ x: -5, h: 15 }, { x: 0.2, h: 19 }, { x: 5, h: 13 }]
      : giant
      ? [{ x: -4, h: 12 }, { x: 0, h: 15 }, { x: 4, h: 10 }]
      : [{ x: -3.2, h: 8 }, { x: 0, h: 10 }, { x: 3.2, h: 7 }];

    for (const st of stems) {
      const seg = mega ? 7 : 6;
      for (let i = 0; i < seg; i++) {
        const k = i / (seg - 1);
        const y = baseY - k * st.h * 1.6;
        const x = st.x + Math.sin(k * 4.5) * (mega ? 1.1 : 0.8);
        const r0 = (mega ? 3.0 : 2.4) - k * (mega ? 1.3 : 1.0);

        circle(x, y, r0, OBS, 1);
        circle(x + 0.22, y + 0.12, r0 * 0.72, BAS, 0.86);

        if (Math.random() < 0.25) circle(x + 0.1, y, r0 * 0.65, L1, 0.10);
      }

      // Une fissure par tige max
      line(st.x - 0.2, baseY - 0.8, st.x + 0.9, baseY - (mega ? 13 : 10), 1.0, L1, 0.42);
      circle(st.x + 0.2, baseY - (mega ? 8 : 6), 0.55, L3, 0.22);
    }

    // Bulbes incandescents (peu)
    const bCount = mega ? 6 : 4;
    for (let i = 0; i < bCount; i++) {
      const bx = (rand() - 0.5) * (mega ? 16 : 11);
      const by = 4 + rand() * 7;
      circle(bx, by, 1.7 + rand() * (mega ? 1.2 : 0.8), L1, 0.14);
      circle(bx + 0.2, by - 0.1, 0.6 + rand() * 0.5, L3, 0.16);
    }

    // Cendre très légère (peu)
    const aCount = mega ? 7 : 5;
    for (let i = 0; i < aCount; i++) {
      circle((rand() - 0.5) * (mega ? 14 : 10), -3 - rand() * (mega ? 5 : 3), 0.9 + rand() * 0.7, ASH, 0.10);
    }
  }
}
