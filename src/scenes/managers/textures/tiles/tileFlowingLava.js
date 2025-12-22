export const tileFlowingLava = {
  key: "tile_flowing_lava",
  draw(g, T) {

    // --- BASE MAGMA FLUIDE ---
    g.fillStyle(0xff3b00, 1);
    g.fillRect(0, 0, T, T);

    // --- GRANDES POCHES DE LAVE (mouvement lent) ---
    g.fillStyle(0xff6a00, 0.55);
    for (let i = 0; i < 22; i++) {
      g.fillCircle(
        Math.random() * T,
        Math.random() * T,
        Math.random() * 5 + 3
      );
    }

    // --- ZONES ULTRA CHAUDES (coeur blanc/jaune) ---
    g.fillStyle(0xffd200, 0.35);
    for (let i = 0; i < 10; i++) {
      g.fillCircle(
        Math.random() * T,
        Math.random() * T,
        Math.random() * 3 + 2
      );
    }

    // --- BULLES DE LAVE (petites et nombreuses) ---
    g.fillStyle(0xff8800, 0.45);
    for (let i = 0; i < 45; i++) {
      g.fillCircle(
        Math.random() * T,
        Math.random() * T,
        Math.random() * 2.2 + 0.8
      );
    }

    // --- MICRO BULLES BRÛLANTES ---
    g.fillStyle(0xfff1b0, 0.22);
    for (let i = 0; i < 30; i++) {
      g.fillCircle(
        Math.random() * T,
        Math.random() * T,
        Math.random() * 1.2 + 0.4
      );
    }

    // --- BRUIT THERMIQUE FIN (scintillement) ---
    g.fillStyle(0x000000, 0.08);
    for (let i = 0; i < 140; i++) {
      g.fillRect(
        Math.random() * T,
        Math.random() * T,
        1,
        1
      );
    }
  }
};
