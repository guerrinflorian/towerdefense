export const tileVolcanicGround = {
  key: "tile_volcanic_ground",
  draw(g, T) {

    // --- BASE : roche volcanique sombre ---
    g.fillStyle(0x2b1b12, 1);
    g.fillRect(0, 0, T, T);

    // --- GRAIN FIN (cendre) ---
    g.fillStyle(0x1e120b, 0.35);
    for (let i = 0; i < 120; i++) {
      g.fillCircle(
        Math.random() * T,
        Math.random() * T,
        Math.random() * 1.2 + 0.3
      );
    }

    // --- GRAIN MOYEN (roche cassée) ---
    g.fillStyle(0x3a261a, 0.4);
    for (let i = 0; i < 60; i++) {
      g.fillCircle(
        Math.random() * T,
        Math.random() * T,
        Math.random() * 2 + 1
      );
    }

    // --- MICRO TOUCHES CHAUDES (lave refroidie) ---
    g.fillStyle(0x6b2a1a, 0.15);
    for (let i = 0; i < 25; i++) {
      g.fillCircle(
        Math.random() * T,
        Math.random() * T,
        Math.random() * 1.5 + 0.5
      );
    }

    // --- BRUIT FINAL ULTRA FIN ---
    g.fillStyle(0x000000, 0.08);
    for (let i = 0; i < 150; i++) {
      g.fillRect(
        Math.random() * T,
        Math.random() * T,
        1,
        1
      );
    }
  }
};
