export const pink_heart_grunt = {
  name: "Heart Knight",
  speed: 62,
  hp: 320, // Légèrement augmenté pour un "beau" monstre
  reward: 15,
  playerDamage: 1,
  color: 0xffb6c1,
  damage: 8,
  attackSpeed: 800,
  scale: 1,
  description: "Heart Knight - Variante rose du Grunt. Rôle : soldat standard sans pouvoir spécial. Plus résistant que le Grunt classique, tête en forme de cœur.",

  onDraw: (scene, container, color, enemyInstance) => {
    enemyInstance.elements = {}; // Stockage pour l'animation

    // Palette étendue
    const colors = {
      outline: 0xff1493,      // Rose profond pour les contours
      bodyMain: 0xffb6c1,     // Rose clair
      bodyShadow: 0xf48fb1,   // Rose d'ombre
      head: 0xff69b4,         // Rose vif (cœur)
      highlight: 0xffffff,    // Blanc pour le brillant
      eyes: 0x2d3436,         // Gris très foncé (presque noir)
      blush: 0xff80ab         // Rose joue
    };

    // 1. JAMBE ARRIÈRE (Plus sombre pour la profondeur)
    const legB = scene.add.graphics();
    legB.fillStyle(colors.bodyShadow);
    legB.fillRoundedRect(-4, 0, 7, 18, 3);
    legB.fillStyle(colors.outline);
    legB.fillRoundedRect(-5, 15, 9, 5, 2); // Botte
    const legBContainer = scene.add.container(0, 4);
    legBContainer.add(legB);
    container.add(legBContainer);
    enemyInstance.elements.legBack = legBContainer;

    // 2. LE CORPS (Torse légèrement bombé)
    const body = scene.add.graphics();
    // Ombre du torse
    body.fillStyle(colors.bodyShadow);
    body.fillRoundedRect(-7, -9, 14, 18, 5);
    // Face avant du torse
    body.fillStyle(colors.bodyMain);
    body.fillRoundedRect(-6, -10, 12, 16, 5);
    
    // 3. TÊTE EN CŒUR (Améliorée)
    const headY = -18;
    body.fillStyle(colors.head);
    // Lobes du cœur
    body.fillCircle(-5, headY - 2, 6);
    body.fillCircle(5, headY - 2, 6);
    // Pointe du cœur
    body.beginPath();
    body.moveTo(-10.5, headY - 1);
    body.lineTo(10.5, headY - 1);
    body.lineTo(0, headY + 8);
    body.closePath();
    body.fillPath();

    // Reflet brillant sur le haut du cœur (le rend "précieux")
    body.fillStyle(colors.highlight, 0.4);
    body.fillCircle(-5, headY - 4, 2);

    // 4. VISAGE (Plus expressif)
    // Yeux (légèrement ovales)
    body.fillStyle(colors.eyes);
    body.fillEllipse(-4, headY - 1, 2, 3);
    body.fillEllipse(4, headY - 1, 2, 3);
    
    // Joues roses (Blush)
    body.fillStyle(colors.blush, 0.6);
    body.fillCircle(-6, headY + 2, 2);
    body.fillCircle(6, headY + 2, 2);
    
    // Bouche en "v" mignon
    body.lineStyle(1.5, colors.eyes, 0.8);
    body.beginPath();
    body.moveTo(-1.5, headY + 2);
    body.lineTo(0, headY + 3.5);
    body.lineTo(1.5, headY + 2);
    body.strokePath();

    // 5. BRAS (Avec petites mains)
    body.fillStyle(colors.bodyMain);
    // Bras droit (devant)
    body.fillRoundedRect(5, -6, 5, 12, 2);
    body.fillStyle(colors.head);
    body.fillCircle(7.5, 6, 3); // Main
    
    container.add(body);
    enemyInstance.elements.mainBody = body;

    // 6. JAMBE AVANT
    const legF = scene.add.graphics();
    legF.fillStyle(colors.bodyMain);
    legF.fillRoundedRect(-4, 0, 7, 18, 3);
    legF.fillStyle(colors.head);
    legF.fillRoundedRect(-5, 15, 9, 5, 2); // Botte
    const legFContainer = scene.add.container(0, 4);
    legFContainer.add(legF);
    container.add(legFContainer);
    enemyInstance.elements.legFront = legFContainer;

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    const walkSpeed = 0.008;
    const walkRange = 0.4;
    const bobSpeed = 0.012;

    // Animation des jambes
    enemyInstance.elements.legFront.rotation = Math.sin(time * walkSpeed) * walkRange;
    enemyInstance.elements.legBack.rotation = Math.sin(time * walkSpeed + Math.PI) * walkRange;

    // Effet de "Bobbing" (le corps monte et descend légèrement)
    // Cela donne une impression de poids et de vie
    enemyInstance.elements.mainBody.y = Math.sin(time * bobSpeed) * 1.5;
    
    // Légère inclinaison du corps pendant la marche
    enemyInstance.elements.mainBody.rotation = Math.sin(time * walkSpeed) * 0.05;
  },
};