export const bosslvl3 = {
  name: "KROVAR LE PRIMORDIAL",
  speed: 10,
  hp: 115000,
  reward: 6500,
  playerDamage: 25,
  color: 0xffffff,
  damage: 307,
  attackSpeed: 1800,
  scale: 1.0, // Taille réduite

  onDraw: (scene, container, color, enemyInstance) => {
    // --- APPLICATION DE LA TAILLE ---
    container.setScale(bosslvl3.scale);
    
    enemyInstance.arms = [];
    
    // --- 1. AURA DE BLIZZARD (Flocons en orbite) ---
    const snowGroup = scene.add.container(0, 0);
    for (let i = 0; i < 10; i++) {
      const flake = scene.add.graphics();
      flake.fillStyle(0xffffff, 0.6);
      flake.fillCircle(0, 0, 3 + Math.random() * 3);
      flake.x = (Math.random() - 0.5) * 100;
      flake.y = (Math.random() - 0.5) * 100;
      snowGroup.add(flake);
    }
    container.add(snowGroup);
    enemyInstance.snowGroup = snowGroup;

    // --- 2. LES JAMBES (Massives et poilues) ---
    const legs = scene.add.graphics();
    legs.fillStyle(0xe0e0e0); // Gris clair
    legs.fillRoundedRect(-25, 5, 18, 30, 6); // Jambe G
    legs.fillRoundedRect(7, 5, 18, 30, 6);  // Jambe D
    container.add(legs);

    // --- 3. LE CORPS (Boule de fourrure) ---
    const bodyContainer = scene.add.container(0, 0);
    const bodyMain = scene.add.graphics();
    bodyMain.fillStyle(0xffffff);
    
    // Forme principale du corps
    bodyMain.fillEllipse(0, -10, 65, 75);
    
    // Détails de fourrure (pics sur les côtés)
    bodyMain.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = Math.PI + (i * 0.5);
        bodyMain.lineTo(Math.cos(angle) * 35, Math.sin(angle) * 35 - 10);
        bodyMain.lineTo(Math.cos(angle) * 45, Math.sin(angle) * 40 - 10);
    }
    bodyMain.closePath();
    bodyMain.fillPath();
    
    bodyContainer.add(bodyMain);
    container.add(bodyContainer);
    enemyInstance.bodyGroup = bodyContainer;

    // --- 4. BRAS ET GRIFFES DE GLACE ---
    const createArm = (x, y, side) => {
      const armCont = scene.add.container(x, y);
      const armGfx = scene.add.graphics();
      armGfx.fillStyle(0xf2f2f2);
      armGfx.fillRoundedRect(-10 * side, 0, 20 * side, 42, 8);
      
      // Griffes de cristal bleu
      armGfx.fillStyle(0x00d9ff);
      for(let i=0; i<3; i++) {
         armGfx.fillTriangle(
             (-7 + (i*5)) * side, 38,
             (0 + (i*5)) * side, 38,
             (-3 + (i*5)) * side, 50
         );
      }
      armCont.add(armGfx);
      return armCont;
    };

    const leftArm = createArm(-35, -12, 1);
    const rightArm = createArm(35, -12, -1);
    container.add(leftArm);
    container.add(rightArm);
    enemyInstance.arms.push(leftArm, rightArm);

    // --- 5. TÊTE ET CORNES ---
    const head = scene.add.graphics();
    head.fillStyle(0xcccccc); // Visage un peu plus sombre
    head.fillCircle(0, -45, 18);
    
    // Cornes massives (Gris foncé)
    head.lineStyle(4, 0x333333);
    // Corne Gauche
    head.beginPath();
    head.moveTo(-8, -53);
    head.lineTo(-25, -65);
    head.lineTo(-32, -53);
    head.strokePath();
    // Corne Droite
    head.beginPath();
    head.moveTo(8, -53);
    head.lineTo(25, -65);
    head.lineTo(32, -53);
    head.strokePath();

    // Yeux Bleus Luissants
    head.fillStyle(0x00ffff);
    head.fillCircle(-6, -50, 3);
    head.fillCircle(6, -50, 3);
    container.add(head);
    enemyInstance.headGraphic = head;

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    if (!enemyInstance.bodyGroup) return;

    // 1. ANIMATION DE RESPIRATION
    // Note: On multiplie par 1 car le scale global est déjà géré par le container
    const breath = 1 + Math.sin(time * 0.003) * 0.04;
    enemyInstance.bodyGroup.scaleX = breath;
    enemyInstance.bodyGroup.scaleY = 1 / breath; // S'écrase un peu quand il gonfle

    // 2. BALANCEMENT DES BRAS
    const swing = Math.sin(time * 0.004) * 0.15;
    if (enemyInstance.arms.length >= 2) {
      enemyInstance.arms[0].rotation = swing;
      enemyInstance.arms[1].rotation = -swing;
    }

    // 3. EFFET BLIZZARD (Rotation lente des flocons)
    if (enemyInstance.snowGroup) {
      enemyInstance.snowGroup.rotation += 0.02;
      // Légère vibration de la tête
      enemyInstance.headGraphic.y = Math.sin(time * 0.005) * 2;
    }
  },
};