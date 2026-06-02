export const citadelle_glaciaire = {
  name: "Citadelle Glaciaire",
  speed: 28,
  hp: 4500,
  reward: 220,
  playerDamage: 6,
  color: 0xb3e5fc,
  damage: 58,
  attackSpeed: 1600,
  scale: 0.8,
  description: "Citadelle Glaciaire - Forteresse arctique évoluée. Rôle : tank ultra-résistant. Version renforcée de l'Igloo de Combat : tours de glace cristallisée, armure multicouches et fissures lumineuses.",

  onDraw: (scene, container, color, enemyInstance) => {
    enemyInstance.legs = {};
    enemyInstance.elements = {};

    const colors = {
      steel:      0x263238,
      steelLight: 0x455a64,
      iceMain:    0xb3e5fc,
      iceDark:    0x81d4fa,
      iceDeep:    0x4fc3f7,
      crystal:    0xe1f5fe,
      crack:      0x00b0ff,
      eyeGlow:    0x00e5ff,
      rampPaint:  0x1565c0,
    };

    // 1. PATTES MÉCANIQUES (plus larges et plus massives)
    const createLeg = (x, y, isFront) => {
      const legCont = scene.add.container(x, y);
      const g = scene.add.graphics();
      // Cuisse
      g.fillStyle(isFront ? colors.steelLight : colors.steel);
      g.fillRoundedRect(-6, 0, 12, 16, 3);
      // Articulation
      g.fillStyle(0x78909c);
      g.fillCircle(0, 15, 4);
      // Pied large
      g.fillStyle(isFront ? colors.steelLight : colors.steel);
      g.fillRoundedRect(-10, 14, 21, 8, 3);
      legCont.add(g);
      return legCont;
    };

    enemyInstance.legs.backLeft  = createLeg(-14, 6, false);
    enemyInstance.legs.backRight = createLeg(6,   6, false);
    enemyInstance.legs.frontLeft  = createLeg(-10, 6, true);
    enemyInstance.legs.frontRight = createLeg(10,  6, true);
    container.add([
      enemyInstance.legs.backLeft,
      enemyInstance.legs.backRight,
      enemyInstance.legs.frontLeft,
      enemyInstance.legs.frontRight,
    ]);

    // 2. CORPS PRINCIPAL (forteresse rectangulaire à double mur)
    const bodyGroup = scene.add.container(0, 0);
    const body = scene.add.graphics();

    // Ombre sol
    body.fillStyle(0x000000, 0.25);
    body.fillEllipse(0, 10, 46, 14);

    // Mur extérieur (couche sombre)
    body.fillStyle(colors.iceDark);
    body.fillRoundedRect(-24, -28, 48, 38, 5);

    // Mur intérieur (couche claire)
    body.fillStyle(colors.iceMain);
    body.fillRoundedRect(-21, -26, 42, 34, 4);

    // Reflet de glace (diagonale lumineuse)
    body.fillStyle(colors.crystal, 0.35);
    body.beginPath();
    body.moveTo(-21, -26);
    body.lineTo(0, -26);
    body.lineTo(-21, -5);
    body.closePath();
    body.fillPath();

    // Fissures de glace luminescentes
    body.lineStyle(1.5, colors.crack, 0.8);
    body.moveTo(-12, -20); body.lineTo(-6, -12);
    body.moveTo(-6, -12);  body.lineTo(-10, -6);
    body.moveTo(8, -24);   body.lineTo(14, -16);
    body.moveTo(14, -16);  body.lineTo(10, -8);
    body.strokePath();

    // Meurtrière centrale (fente élargie)
    body.fillStyle(0x0d1b2a);
    body.fillRoundedRect(-16, -18, 32, 8, 2);

    // Créneaux du parapet (haut du mur)
    body.fillStyle(colors.iceDark);
    for (let i = -3; i <= 3; i += 2) {
      body.fillRect(i * 6 - 3, -32, 6, 7);
    }

    bodyGroup.add(body);
    container.add(bodyGroup);
    enemyInstance.bodyGroup = bodyGroup;
    enemyInstance.elements.body = body;

    // 3. CRISTAUX DE GLACE (sur les créneaux)
    const crystals = scene.add.graphics();
    crystals.fillStyle(colors.crystal, 0.9);
    // 3 cristaux en pointe
    [[-12, -32], [0, -35], [12, -32]].forEach(([cx, cy]) => {
      crystals.beginPath();
      crystals.moveTo(cx, cy - 9);
      crystals.lineTo(cx - 4, cy);
      crystals.lineTo(cx + 4, cy);
      crystals.closePath();
      crystals.fillPath();
      crystals.lineStyle(1, colors.iceDeep, 0.6);
      crystals.strokePath();
    });
    container.add(crystals);
    enemyInstance.elements.crystals = crystals;

    // 4. YEUX LUMINEUX (cyan, plus grands)
    const eyes = scene.add.graphics();
    eyes.fillStyle(colors.eyeGlow);
    eyes.fillEllipse(-7, -14, 5, 4);
    eyes.fillEllipse(7, -14, 5, 4);
    container.add(eyes);
    enemyInstance.elements.eyes = eyes;

    // 5. BLASON SUR LE CORPS
    const emblem = scene.add.graphics();
    emblem.fillStyle(colors.rampPaint, 0.7);
    emblem.fillRoundedRect(-5, -4, 10, 10, 2);
    emblem.fillStyle(colors.crystal, 0.9);
    emblem.fillTriangle(0, -3, -4, 5, 4, 5);
    container.add(emblem);

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    const speed = 0.003;
    const sin = Math.sin(time * speed);

    // 4 pattes en alternance deux à deux
    if (enemyInstance.legs.frontLeft)  enemyInstance.legs.frontLeft.rotation  =  sin * 0.22;
    if (enemyInstance.legs.backRight)  enemyInstance.legs.backRight.rotation  =  sin * 0.22;
    if (enemyInstance.legs.frontRight) enemyInstance.legs.frontRight.rotation = -sin * 0.22;
    if (enemyInstance.legs.backLeft)   enemyInstance.legs.backLeft.rotation   = -sin * 0.22;

    // Oscillation verticale lourde
    const bounce = Math.abs(sin) * -5;
    if (enemyInstance.bodyGroup) {
      enemyInstance.bodyGroup.y = bounce;
    }

    // Pulsation des yeux cyan
    if (enemyInstance.elements?.eyes) {
      enemyInstance.elements.eyes.alpha = 0.55 + Math.abs(Math.sin(time * 0.006)) * 0.45;
    }

    // Scintillement des cristaux
    if (enemyInstance.elements?.crystals) {
      enemyInstance.elements.crystals.alpha = 0.75 + Math.sin(time * 0.004) * 0.25;
    }
  },
};
