export const vampire = {
  name: "Vampire",
  speed: 70,
  hp: 380,
  reward: 40,
  playerDamage: 1,
  color: 0x4a0e4e, // Violet foncé
  damage: 65,
  attackSpeed: 900,
  scale: 1.0,
  description: "Vampire - Régénérateur. Rôle : auto-soin et régénération. POUVOIR SPÉCIAL : Se soigne de 30% des dégâts qu'il inflige en attaquant. Récupère aussi 10% de ses PV max quand un ennemi meurt à 1.8 cases. Éliminez-le rapidement !",
  // Se soigne de 30% des dégâts qu'il inflige
  vampireLifesteal: 0.3,
  // Récupère 1/4 de son maxHp quand un ennemi meurt à 2 cases autour
  vampireDeathFeast: true,
  vampireDeathFeastRadius: 1.8, // En cases (1.8 cases = ~108 pixels)
  vampireDeathFeastPercent: 0.10, // 1/10 = 10%

  onDraw: (scene, container, color, enemyInstance) => {
    enemyInstance.elements = {};

    const colors = {
      cape: 0x2d1b3d,        // Cape violet très sombre
      capeInside: 0x4a0e4e,  // Intérieur de la cape
      body: 0x1a0a1a,        // Corps sombre
      skin: 0x8b7d8b,        // Peau pâle
      eyes: 0xff0000,        // Yeux rouges
      fangs: 0xffffff,       // Crocs blancs
      blood: 0x8b0000,       // Sang
    };

    // Cape volante
    const cape = scene.add.graphics();
    cape.fillStyle(colors.cape);
    cape.beginPath();
    cape.moveTo(-15, -20);
    cape.lineTo(-20, 15);
    cape.lineTo(20, 15);
    cape.lineTo(15, -20);
    cape.closePath();
    cape.fillPath();
    
    cape.fillStyle(colors.capeInside);
    cape.beginPath();
    cape.moveTo(-12, -18);
    cape.lineTo(-18, 12);
    cape.lineTo(18, 12);
    cape.lineTo(12, -18);
    cape.closePath();
    cape.fillPath();
    
    container.add(cape);
    enemyInstance.elements.cape = cape;

    // Corps
    const body = scene.add.graphics();
    body.fillStyle(colors.body);
    body.fillRoundedRect(-8, -10, 16, 20, 4);
    
    // Tête pâle
    body.fillStyle(colors.skin);
    body.fillCircle(0, -18, 8);
    
    // Yeux rouges
    body.fillStyle(colors.eyes, 0.9);
    body.fillCircle(-3, -19, 2);
    body.fillCircle(3, -19, 2);
    
    // Crocs
    body.fillStyle(colors.fangs);
    body.fillTriangle(-2, -16, -1, -13, 0, -16);
    body.fillTriangle(2, -16, 1, -13, 0, -16);
    
    // Bras avec griffes
    body.fillStyle(colors.body);
    body.fillRoundedRect(-12, -6, 6, 16, 2);
    body.fillRoundedRect(6, -6, 6, 16, 2);
    body.fillStyle(colors.fangs);
    body.fillRect(-12, 8, 6, 3);
    body.fillRect(6, 8, 6, 3);
    
    // Jambes
    body.fillStyle(colors.body);
    body.fillRoundedRect(-6, 10, 5, 18, 2);
    body.fillRoundedRect(1, 10, 5, 18, 2);
    
    container.add(body);
    enemyInstance.elements.mainBody = body;

    // Effet de sang (sera animé lors du soin)
    const bloodEffect = scene.add.graphics();
    bloodEffect.setVisible(false);
    container.add(bloodEffect);
    enemyInstance.elements.bloodEffect = bloodEffect;

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    // Animation de la cape
    if (enemyInstance.elements.cape) {
      const wave = Math.sin(time * 0.01) * 0.1;
      enemyInstance.elements.cape.rotation = wave;
    }
    
    // Animation de vol
    if (enemyInstance.elements.mainBody) {
      enemyInstance.elements.mainBody.y = Math.sin(time * 0.008) * 2;
    }
  },
};

