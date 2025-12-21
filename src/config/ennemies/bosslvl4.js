export const bosslvl4 = {
  name: "MORVATH, SEIGNEUR DES MORTS",
  speed: 11,
  hp: 142000,
  reward: 12000,
  playerDamage: 30,
  color: 0xb7c0c6, // os/acier froid
  damage: 650,
  attackSpeed: 1700,
  scale: 0.7, // Réduit pour correspondre aux autres bosses

  onDraw: (scene, container, color, enemyInstance) => {
    // --- TAILLE ---
    container.setScale(bosslvl4.scale);

    enemyInstance.shouldRotate = false;
    enemyInstance.bonesOrbit = [];
    enemyInstance.wisps = [];
    enemyInstance.arms = [];

    // Palette
    const bone = 0xe8e2d6;
    const boneDark = 0xb9b1a3;
    const steel = 0x2a2f36;
    const steel2 = 0x404854;
    const soul = 0x79f2ff;      // bleu âme
    const soulDark = 0x1a7aa6;  // bleu sombre
    const curse = 0x7b3cff;     // violet nécro (léger)
    const shadow = 0x000000;

    // -------------------------
    // 1) AURA NÉCRO : cercle d’ombre + runes
    // -------------------------
    const aura = scene.add.graphics();
    aura.fillStyle(shadow, 0.22);
    aura.fillEllipse(0, 20, 77, 21);
    aura.fillStyle(0x0b0f14, 0.18);
    aura.fillEllipse(0, 21, 105, 29);

    // runes
    aura.lineStyle(1.4, soul, 0.35);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const x1 = Math.cos(a) * 36;
      const y1 = 20 + Math.sin(a) * 7;
      const x2 = Math.cos(a) * 43;
      const y2 = 20 + Math.sin(a) * 8;
      aura.beginPath();
      aura.moveTo(x1, y1);
      aura.lineTo(x2, y2);
      aura.strokePath();
    }
    container.add(aura);
    enemyInstance.aura = aura;

    // -------------------------
    // 2) JAMBES : armure + tibias
    // -------------------------
    const legs = scene.add.graphics();
    // ombres
    legs.fillStyle(steel, 1);
    legs.fillRoundedRect(-15, 1, 11, 24, 4); // jambe G (armure)
    legs.fillRoundedRect(4, 1, 11, 24, 4);   // jambe D
    // os visible
    legs.fillStyle(bone, 1);
    legs.fillRoundedRect(-14, 10, 8, 14, 4);
    legs.fillRoundedRect(6, 10, 8, 14, 4);
    // petits rivets
    legs.fillStyle(0x9aa3ad, 0.9);
    legs.fillCircle(-10, 7, 1.1);
    legs.fillCircle(10, 7, 1.1);
    container.add(legs);

    // -------------------------
    // 3) CORPS : torse d’armure + cage osseuse
    // -------------------------
    const bodyGroup = scene.add.container(0, 0);

    const body = scene.add.graphics();
    // base torse
    body.fillStyle(steel2, 1);
    body.lineStyle(2.8, 0x9aa3ad, 0.55);
    body.fillRoundedRect(-22, -22, 45, 55, 11);
    body.strokeRoundedRect(-22, -22, 45, 55, 11);

    // plastron central
    body.fillStyle(steel, 1);
    body.lineStyle(2.1, soulDark, 0.5);
    body.fillRoundedRect(-13, -15, 25, 39, 8);
    body.strokeRoundedRect(-13, -15, 25, 39, 8);

    // cage osseuse stylisée
    body.fillStyle(bone, 0.95);
    for (let i = 0; i < 4; i++) {
      const y = -8 + i * 8;
      body.fillRoundedRect(-15, y, 31, 4, 2);
    }

    // coeur d’âme (noyau)
    body.fillStyle(soul, 0.95);
    body.lineStyle(2.1, curse, 0.35);
    body.fillCircle(0, 6, 6);
    body.strokeCircle(0, 6, 6);

    bodyGroup.add(body);
    container.add(bodyGroup);
    enemyInstance.bodyGroup = bodyGroup;
    enemyInstance.core = body;

    // -------------------------
    // 4) EPAULES : crânes / épaulières
    // -------------------------
    const makeSkullShoulder = (x, y, side) => {
      const c = scene.add.container(x, y);

      const g = scene.add.graphics();
      // plaque
      g.fillStyle(steel, 1);
      g.lineStyle(2.8, 0x8f99a3, 0.55);
      g.fillRoundedRect(-13, -10, 25, 20, 7);
      g.strokeRoundedRect(-13, -10, 25, 20, 7);

      // skull incrusté
      g.fillStyle(bone, 0.95);
      g.fillCircle(0, -1, 5);
      g.fillRoundedRect(-5, 2, 10, 6, 2);
      g.fillStyle(0x111418, 0.8);
      g.fillCircle(-1.8, -1, 1);
      g.fillCircle(1.8, -1, 1);

      // petite corne
      g.fillStyle(boneDark, 0.85);
      g.fillTriangle(7 * side, -6, 13 * side, -8, 10 * side, -2);

      c.add(g);
      c.baseX = x;
      c.baseY = y;
      return c;
    };

    const leftShoulder = makeSkullShoulder(-32, -15, -1);
    const rightShoulder = makeSkullShoulder(32, -15, 1);
    container.add([leftShoulder, rightShoulder]);
    enemyInstance.shoulders = [leftShoulder, rightShoulder];

    // -------------------------
    // 5) BRAS : manchettes + faux mains
    // -------------------------
    const createArm = (x, y, side) => {
      const armCont = scene.add.container(x, y);

      const armGfx = scene.add.graphics();
      // bras / manchette
      armGfx.fillStyle(steel2, 1);
      armGfx.lineStyle(2.1, 0x9aa3ad, 0.55);
      armGfx.fillRoundedRect(-7, 0, 14, 31, 6);
      armGfx.strokeRoundedRect(-7, 0, 14, 31, 6);

      // os doigts
      armGfx.fillStyle(bone, 0.95);
      armGfx.fillRoundedRect(-8, 24, 17, 8, 4);

      // griffes (3)
      armGfx.fillStyle(soul, 0.85);
      for (let i = 0; i < 3; i++) {
        const dx = (-6 + i * 6) * 1;
        armGfx.fillTriangle(dx, 32, dx + 3.5, 32, dx + 1.8, 39);
      }

      // marque nécro
      armGfx.lineStyle(1.4, curse, 0.35);
      armGfx.beginPath();
      armGfx.moveTo(-3.5, 10);
      armGfx.lineTo(0, 7);
      armGfx.lineTo(3.5, 10);
      armGfx.strokePath();

      armCont.add(armGfx);
      armCont.scaleX = side; // miroir
      return armCont;
    };

    const leftArm = createArm(-34, -4, 1);
    const rightArm = createArm(34, -4, -1);
    container.add([leftArm, rightArm]);
    enemyInstance.arms.push(leftArm, rightArm);

    // -------------------------
    // 6) TÊTE : crâne roi + couronne funéraire
    // -------------------------
    const headGroup = scene.add.container(0, -39);

    const head = scene.add.graphics();
    // crâne
    head.fillStyle(bone, 1);
    head.lineStyle(2.8, boneDark, 0.9);
    head.fillRoundedRect(-13, -13, 25, 21, 7);
    head.strokeRoundedRect(-13, -13, 25, 21, 7);

    // mâchoire
    head.fillStyle(boneDark, 0.75);
    head.fillRoundedRect(-10, 4, 20, 7, 4);

    // yeux (âme)
    head.fillStyle(soul, 0.95);
    head.fillCircle(-4, -4, 2);
    head.fillCircle(4, -4, 2);

    // fissures
    head.lineStyle(1.4, 0x000000, 0.18);
    head.beginPath();
    head.moveTo(-1.4, -13);
    head.lineTo(-4, -4);
    head.strokePath();

    // couronne (roi des cimetières)
    head.lineStyle(2.8, curse, 0.35);
    head.fillStyle(steel, 1);
    // bandeau
    head.fillRoundedRect(-14, -18, 28, 7, 4);
    // pointes
    head.fillTriangle(-10, -18, -6, -28, -1.4, -18);
    head.fillTriangle(-2, -18, 0, -31, 2, -18);
    head.fillTriangle(1.4, -18, 6, -28, 10, -18);

    // gemmes
    head.fillStyle(soul, 0.85);
    head.fillCircle(0, -15, 1.5);
    head.fillCircle(-7, -15, 1.2);
    head.fillCircle(7, -15, 1.2);

    headGroup.add(head);
    container.add(headGroup);
    enemyInstance.headGroup = headGroup;
    enemyInstance.headGraphic = head;

    // -------------------------
    // 7) ORBITE D’OS + FEUX FOLLETS
    // -------------------------
    const orbit = scene.add.container(0, -7);
    for (let i = 0; i < 6; i++) {
      const b = scene.add.graphics();
      b.fillStyle(bone, 0.95);
      b.lineStyle(1.4, boneDark, 0.8);
      b.fillRoundedRect(-4, -1.4, 8, 3, 1.4);
      b.strokeRoundedRect(-4, -1.4, 8, 3, 1.4);

      const boneCont = scene.add.container(0, 0);
      boneCont.add(b);
      boneCont._a = (i / 6) * Math.PI * 2;
      boneCont._r = 29 + Math.random() * 6;
      orbit.add(boneCont);
      enemyInstance.bonesOrbit.push(boneCont);
    }
    container.add(orbit);
    enemyInstance.orbit = orbit;

    // feux follets
    for (let i = 0; i < 10; i++) {
      const w = scene.add.circle(
        (Math.random() - 0.5) * 84,
        (Math.random() - 0.5) * 84,
        1.4 + Math.random() * 1.4,
        soul,
        0.55
      );
      container.add(w);
      enemyInstance.wisps.push(w);
    }
  },

  onUpdateAnimation: (time, enemyInstance) => {
    // Respiration / pulsation du torse
    if (enemyInstance.bodyGroup) {
      const breath = 1 + Math.sin(time * 0.003) * 0.035;
      enemyInstance.bodyGroup.scaleX = breath;
      enemyInstance.bodyGroup.scaleY = 1 / breath;
    }

    // Balancement des bras (lourd)
    if (enemyInstance.arms?.length >= 2) {
      const swing = Math.sin(time * 0.0036) * 0.14;
      enemyInstance.arms[0].rotation = swing;
      enemyInstance.arms[1].rotation = -swing;
    }

    // Épaules (micro flottement)
    if (enemyInstance.shoulders?.length === 2) {
      const bob = Math.sin(time * 0.0042) * 1;
      enemyInstance.shoulders[0].y = -15 + bob;
      enemyInstance.shoulders[1].y = -15 - bob;
    }

    // Tête : vibration “roi”
    if (enemyInstance.headGroup) {
      enemyInstance.headGroup.y = -39 + Math.sin(time * 0.005) * 1.3;
    }

    // Aura : rotation lente
    if (enemyInstance.aura) {
      enemyInstance.aura.rotation += 0.006;
    }

    // Orbe d’os : orbite
    if (enemyInstance.bonesOrbit?.length) {
      enemyInstance.bonesOrbit.forEach((b, i) => {
        const a = b._a + time * 0.0012 + i * 0.08;
        b.x = Math.cos(a) * b._r;
        b.y = -7 + Math.sin(a) * (b._r * 0.35);
        b.rotation = a;
      });
    }

    // Feux follets : dérive + recycle
    if (enemyInstance.wisps?.length) {
      enemyInstance.wisps.forEach((w, i) => {
        w.x += Math.cos(time * 0.003 + i) * 0.6;
        w.y += Math.sin(time * 0.0035 + i * 1.3) * 0.4;

        if (w.x > 91) w.x = -91;
        if (w.x < -91) w.x = 91;
        if (w.y > 77) w.y = -77;
        if (w.y < -77) w.y = 77;

        // petit scintillement
        w.alpha = 0.35 + (Math.sin(time * 0.01 + i) + 1) * 0.12;
      });
    }

    // Tremblement léger (marche lourde)
    if (enemyInstance.bodyGroup) {
      enemyInstance.bodyGroup.y = Math.sin(time * 0.01) * 0.9;
    }
  },
};
