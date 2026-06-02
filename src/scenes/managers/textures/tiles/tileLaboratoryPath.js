export const tileLaboratoryPath = {
  key: "tile_laboratory_path",
  draw(g, T) {
    // ── Base : ardoise foncée ────────────────────────────────────
    g.fillStyle(0x0a1525, 1);
    g.fillRect(0, 0, T, T);

    // ── Micro-grain ──────────────────────────────────────────────
    g.fillStyle(0x132035, 0.4);
    for (let i = 0; i < 60; i++) {
      g.fillRect(Math.random() * T, Math.random() * T, 1, 1);
    }

    // ── Grip honeycomb (petits points) ───────────────────────────
    const spacing = T / 8;
    g.fillStyle(0x1a3050, 0.55);
    for (let x = spacing * 0.5; x < T; x += spacing) {
      for (let y = spacing * 0.5; y < T; y += spacing) {
        const offsetX = (Math.floor(y / spacing) % 2) * (spacing / 2);
        g.fillCircle(x + offsetX, y, 1.3);
      }
    }

    // ── Bande centrale usure ─────────────────────────────────────
    g.fillStyle(0x0d1d30, 0.5);
    g.fillRect(T * 0.3, 0, T * 0.4, T);

    // ── Ligne pointillée centrale (marquage au sol) ───────────────
    g.fillStyle(0x1e4060, 0.45);
    for (let y = 0; y < T; y += T / 5) {
      g.fillRect(T / 2 - 1, y, 2, T / 5 * 0.6);
    }

    // ── Bord gauche : glow néon cyan ─────────────────────────────
    g.fillStyle(0x38bdf8, 0.07);
    g.fillRect(0, 0, 9, T);
    g.fillStyle(0x38bdf8, 0.15);
    g.fillRect(0, 0, 5, T);
    g.fillStyle(0x38bdf8, 0.55);
    g.fillRect(0, 0, 2.5, T);
    g.fillStyle(0x7dd3fc, 0.9);
    g.fillRect(0, 0, 1, T);

    // ── Bord droit : glow néon cyan ──────────────────────────────
    g.fillStyle(0x38bdf8, 0.07);
    g.fillRect(T - 9, 0, 9, T);
    g.fillStyle(0x38bdf8, 0.15);
    g.fillRect(T - 5, 0, 5, T);
    g.fillStyle(0x38bdf8, 0.55);
    g.fillRect(T - 2.5, 0, 2.5, T);
    g.fillStyle(0x7dd3fc, 0.9);
    g.fillRect(T - 1, 0, 1, T);

    // ── Petits triangles directionnels (indicateurs de chemin) ───
    g.fillStyle(0x1e4060, 0.35);
    const arrY = [T * 0.2, T * 0.5, T * 0.8];
    arrY.forEach((ay) => {
      g.fillTriangle(T / 2, ay - 3, T / 2 - 3, ay + 3, T / 2 + 3, ay + 3);
    });
  },
};
