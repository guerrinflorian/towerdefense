export const tileLaboratoryGround = {
  key: "tile_laboratory_ground",
  draw(g, T) {
    // ── Base : plaque métallique noire profonde ──────────────────
    g.fillStyle(0x060e1f, 1);
    g.fillRect(0, 0, T, T);

    // ── Micro-bruit (grain industriel) ──────────────────────────
    g.fillStyle(0x0d1e38, 0.3);
    for (let i = 0; i < 80; i++) {
      g.fillRect(Math.random() * T, Math.random() * T, 1, 1);
    }

    // ── Grille hexagonale fine (circuit board) ───────────────────
    const hexR = T * 0.16;
    const hexW = hexR * 2;
    const hexH = hexR * Math.sqrt(3);

    g.lineStyle(0.8, 0x0e3060, 0.55);
    for (let row = -1; row < 4; row++) {
      for (let col = -1; col < 4; col++) {
        const cx = col * hexW * 0.75 + T * 0.08;
        const cy = row * hexH + (col % 2 === 0 ? 0 : hexH / 2) + T * 0.1;
        g.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i + Math.PI / 6;
          const hx = cx + hexR * Math.cos(a);
          const hy = cy + hexR * Math.sin(a);
          if (i === 0) g.moveTo(hx, hy);
          else g.lineTo(hx, hy);
        }
        g.closePath();
        g.strokePath();
      }
    }

    // ── Traces de circuit (lignes fines horizontales/verticales) ─
    g.lineStyle(0.7, 0x1a4a8a, 0.35);
    g.lineBetween(0, T * 0.28, T * 0.42, T * 0.28);
    g.lineBetween(T * 0.58, T * 0.28, T, T * 0.28);
    g.lineBetween(0, T * 0.72, T * 0.38, T * 0.72);
    g.lineBetween(T * 0.62, T * 0.72, T, T * 0.72);
    g.lineBetween(T * 0.28, 0, T * 0.28, T * 0.38);
    g.lineBetween(T * 0.28, T * 0.62, T * 0.28, T);
    g.lineBetween(T * 0.72, 0, T * 0.72, T * 0.42);
    g.lineBetween(T * 0.72, T * 0.58, T * 0.72, T);

    // ── Noeuds de circuit aux intersections ─────────────────────
    const nodes = [
      [T * 0.28, T * 0.28],
      [T * 0.72, T * 0.28],
      [T * 0.28, T * 0.72],
      [T * 0.72, T * 0.72],
    ];
    nodes.forEach(([nx, ny]) => {
      g.fillStyle(0x1a4a8a, 0.55);
      g.fillCircle(nx, ny, 2.8);
      g.lineStyle(0.7, 0x38bdf8, 0.5);
      g.strokeCircle(nx, ny, 2.8);
      g.fillStyle(0x38bdf8, 0.3);
      g.fillCircle(nx, ny, 1.1);
    });

    // ── Hexagone central (plus lumineux) ─────────────────────────
    const cx = T / 2, cy = T / 2;
    const mainR = T * 0.33;

    g.fillStyle(0x091628, 0.8);
    g.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      const hx = cx + mainR * Math.cos(a);
      const hy = cy + mainR * Math.sin(a);
      if (i === 0) g.moveTo(hx, hy);
      else g.lineTo(hx, hy);
    }
    g.closePath();
    g.fillPath();

    g.lineStyle(1, 0x38bdf8, 0.45);
    g.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      const hx = cx + mainR * Math.cos(a);
      const hy = cy + mainR * Math.sin(a);
      if (i === 0) g.moveTo(hx, hy);
      else g.lineTo(hx, hy);
    }
    g.closePath();
    g.strokePath();

    // ── Halo central (glow concentrique) ─────────────────────────
    g.fillStyle(0x38bdf8, 0.055);
    g.fillCircle(cx, cy, mainR * 0.85);
    g.fillStyle(0x38bdf8, 0.07);
    g.fillCircle(cx, cy, mainR * 0.5);
    g.fillStyle(0x38bdf8, 0.18);
    g.fillCircle(cx, cy, mainR * 0.22);
    g.fillStyle(0x7dd3fc, 0.4);
    g.fillCircle(cx, cy, mainR * 0.08);

    // ── Micro-points lumineux (données) ─────────────────────────
    const dataPoints = [
      [T * 0.15, T * 0.15],
      [T * 0.85, T * 0.18],
      [T * 0.12, T * 0.82],
      [T * 0.82, T * 0.85],
      [T * 0.5,  T * 0.12],
      [T * 0.5,  T * 0.88],
    ];
    dataPoints.forEach(([dx, dy]) => {
      g.fillStyle(0x38bdf8, 0.25 + Math.random() * 0.2);
      g.fillCircle(dx, dy, 1.2);
    });

    // ── Bords légèrement plus sombres (vignette) ─────────────────
    g.fillStyle(0x000000, 0.18);
    g.fillRect(0, 0, T, 4);
    g.fillRect(0, T - 4, T, 4);
    g.fillRect(0, 0, 4, T);
    g.fillRect(T - 4, 0, 4, T);
  },
};
