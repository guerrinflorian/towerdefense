export const pink_marshmallow_runner = {
  name: "Berry Bolt",
  speed: 185,
  hp: 140,
  reward: 20,
  playerDamage: 1,
  color: 0xffd1dc, // Rose guimauve plus doux
  damage: 18,
  attackSpeed: 600,
  scale: 1,

  onDraw: (scene, container, color, enemyInstance) => {
    enemyInstance.elements = {};

    const colors = {
      main: 0xffd1dc,
      shadow: 0xe5a9b8,
      top: 0xffecf1,    // Le dessus du marshmallow est plus clair
      outline: 0xff8fab,
      eyes: 0x333333,
      powder: 0xffffff  // Effet sucre glace
    };

    // 1. OMBRE PORTÉE AU SOL (pour le réalisme)
    const shadowGround = scene.add.graphics();
    shadowGround.fillStyle(0x000000, 0.2);
    shadowGround.fillEllipse(0, 22, 12, 6);
    container.add(shadowGround);
    enemyInstance.elements.groundShadow = shadowGround;

    // 2. JAMBES DYNAMIQUES (plus fines pour la course)
    const createLeg = (isBack) => {
      const g = scene.add.graphics();
      g.fillStyle(isBack ? colors.shadow : colors.main);
      // Jambes légèrement arquées pour donner une impression de ressort
      g.fillRoundedRect(-2, 0, 4, 20, 2); 
      const legContainer = scene.add.container(isBack ? 3 : -3, 5);
      legContainer.add(g);
      return legContainer;
    };

    enemyInstance.elements.legBack = createLeg(true);
    enemyInstance.elements.legFront = createLeg(false);
    container.add(enemyInstance.elements.legBack);
    container.add(enemyInstance.elements.legFront);

    // 3. CORPS CYLINDRIQUE (Le vrai look Marshmallow)
    const bodyGroup = scene.add.container(0, 5);
    const body = scene.add.graphics();
    
    // Base du cylindre (Ombre)
    body.fillStyle(colors.shadow);
    body.fillRoundedRect(-10, -22, 20, 22, 6);
    
    // Face avant (Volume)
    body.fillStyle(colors.main);
    body.fillRoundedRect(-10, -22, 18, 20, 6);

    // Le "Top" (Ellipse pour la perspective 3D)
    body.fillStyle(colors.top);
    body.fillEllipse(0, -22, 10, 4);

    // Reflets de "sucre" (Highlights)
    body.fillStyle(colors.powder, 0.5);
    body.fillCircle(-5, -12, 2);
    body.fillCircle(-6, -18, 1.5);

    // 4. VISAGE DE COMPÉTITION
    // Yeux déterminés (ovales et penchés vers l'intérieur)
    body.fillStyle(colors.eyes);
    body.fillEllipse(-4, -14, 2, 3);
    body.fillEllipse(4, -14, 2, 3);
    
    // Sourcils (petits traits pour l'air concentré)
    body.lineStyle(1, colors.eyes, 0.8);
    body.lineBetween(-6, -18, -2, -16);
    body.lineBetween(6, -18, 2, -16);

    // Petite bouche en "O" (essoufflement de course)
    body.fillStyle(colors.shadow);
    body.fillCircle(0, -9, 1.5);

    bodyGroup.add(body);
    container.add(bodyGroup);
    enemyInstance.elements.body = bodyGroup;

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    const walkSpeed = 0.02; // Très rapide
    const walkRange = 0.9;  // Grande foulée
    
    const elements = enemyInstance.elements;

    // Animation des jambes (Cycle de course)
    elements.legFront.rotation = Math.sin(time * walkSpeed) * walkRange;
    elements.legBack.rotation = Math.sin(time * walkSpeed + Math.PI) * walkRange;

    // EFFET SQUASH & STRETCH (Le marshmallow s'écrase et s'étire)
    // Quand les jambes sont écartées, il baisse un peu, quand elles se croisent, il monte
    const bounce = Math.sin(time * walkSpeed * 2); 
    elements.body.y = 5 + (bounce * 2);
    
    // Étirement vertical basé sur le rebond
    elements.body.scaleY = 1 - (bounce * 0.1); 
    elements.body.scaleX = 1 + (bounce * 0.05);

    // Inclinaison du corps vers l'avant (Donne l'impression de vitesse)
    elements.body.rotation = 0.15; 

    // L'ombre au sol s'agrandit/rétrécit selon la hauteur
    elements.groundShadow.scaleX = 1 + (bounce * 0.2);
    elements.groundShadow.alpha = 0.2 - (bounce * 0.1);
  },
};