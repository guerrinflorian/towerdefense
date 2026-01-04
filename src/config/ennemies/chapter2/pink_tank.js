export const pink_bear_tank = {
  name: "Mini Grizzly Rose",
  speed: 36,
  hp: 5250,
  reward: 140,
  playerDamage: 4,
  color: 0xffb6c1,
  damage: 78,
  attackSpeed: 1200,
  scale: 0.8, // On réduit le scale global ici aussi
  description: "Mini Grizzly Rose - Tank ours. Rôle : unité blindée sans pouvoir spécial. Massif et résistant avec une apparence d'ours rose, très haute résistance.",

  onDraw: (scene, container, color, enemyInstance) => {
    enemyInstance.elements = {};

    const colors = {
      fur: 0xffb6c1,
      furShadow: 0xe5a9b8,
      belly: 0xfff0f5,
      muzzle: 0xfff0f5,
      pads: 0xff8fab,
      claws: 0xffffff,
      eyes: 0x1a1a1a,
      detail: 0xff1493
    };

    // 1. OMBRE PORTÉE (plus petite)
    const groundShadow = scene.add.graphics();
    groundShadow.fillStyle(0x000000, 0.2);
    groundShadow.fillEllipse(0, 18, 22, 8);
    container.add(groundShadow);
    enemyInstance.elements.groundShadow = groundShadow;

    // 2. JAMBES ARRIÈRES (réduites mais robustes)
    const createLeg = (isBack) => {
      const g = scene.add.graphics();
      const col = isBack ? colors.furShadow : colors.fur;
      g.fillStyle(col);
      g.fillRoundedRect(-8, 0, 16, 18, 6); // Plus court
      g.fillStyle(isBack ? colors.furShadow : colors.pads);
      g.fillRoundedRect(-9, 14, 18, 8, 4); // Pied compact
      
      const legCont = scene.add.container(isBack ? 6 : -6, 5);
      legCont.add(g);
      return legCont;
    };

    enemyInstance.elements.legBack = createLeg(true);
    enemyInstance.elements.legFront = createLeg(false);
    container.add(enemyInstance.elements.legBack);
    container.add(enemyInstance.elements.legFront);

    // 3. CORPS (Plus compact et rond)
    const bodyGroup = scene.add.container(0, 0);
    const body = scene.add.graphics();
    
    // Silhouette principale
    body.fillStyle(colors.furShadow);
    body.fillEllipse(0, -2, 22, 28); 
    body.fillStyle(colors.fur);
    body.fillEllipse(0, -4, 20, 26); 

    // Tâche ventrale
    body.fillStyle(colors.belly);
    body.fillCircle(0, 0, 12);

    // 4. TÊTE & MUSEAU
    const headY = -24; // Plus proche du corps
    // Oreilles
    [ -10, 10 ].forEach(x => {
        body.fillStyle(colors.furShadow);
        body.fillCircle(x, headY - 6, 6);
        body.fillStyle(colors.detail);
        body.fillCircle(x, headY - 6, 3);
    });

    // Tête ronde
    body.fillStyle(colors.fur);
    body.fillCircle(0, headY, 12);

    // Museau
    body.fillStyle(colors.muzzle);
    body.fillEllipse(0, headY + 3, 7, 5);
    
    // Truffe & Yeux
    body.fillStyle(colors.eyes);
    body.fillRoundedRect(-2, headY + 1.5, 4, 3, 1); // Petit nez
    body.fillCircle(-4.5, headY - 1, 2.5); // Œil G
    body.fillCircle(4.5, headY - 1, 2.5);  // Œil D

    // 5. BRAS (courts et épais)
    const drawArm = (xPos) => {
        body.fillStyle(colors.furShadow);
        body.fillRoundedRect(xPos, -18, 10, 18, 5);
    };
    drawArm(-18); 
    drawArm(8); 

    bodyGroup.add(body);
    container.add(bodyGroup);
    enemyInstance.elements.body = bodyGroup;

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    const stepSpeed = 0.005;
    const stepRange = 0.2;
    const elements = enemyInstance.elements;

    const walkCycle = Math.sin(time * stepSpeed);
    elements.legFront.rotation = walkCycle * stepRange;
    elements.legBack.rotation = -walkCycle * stepRange;

    // Piétinement vertical réduit pour la petite taille
    const thump = Math.abs(Math.cos(time * stepSpeed));
    elements.body.y = -1 + (thump * 2);
    
    elements.groundShadow.scaleX = 1 + (thump * 0.1);
  },
};