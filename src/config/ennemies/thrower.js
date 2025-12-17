export const thrower = {
  name: "Lanceur",
  speed: 70,
  hp: 150,
  reward: 40,
  color: 0x8b4513, // Marron
  damage: 15, // Dégâts par hache
  attackSpeed: 1500, // Vitesse d'attaque en ms
  attackRange: 80, // Portée d'attaque (une case = 64px)
  isRanged: true, // Indique que c'est un attaquant à distance

  onDraw: (scene, container, color, enemyInstance) => {
    enemyInstance.legs = {};

    // 1. Jambe Arrière
    enemyInstance.legs.back = scene.add.container(0, 5);
    const legB = scene.add.graphics();
    legB.fillStyle(0x654321);
    legB.fillRoundedRect(-3, 0, 6, 18, 2);
    legB.fillRoundedRect(-4, 16, 10, 5, 2);
    enemyInstance.legs.back.add(legB);
    container.add(enemyInstance.legs.back);

    // 2. Corps
    const body = scene.add.graphics();
    body.fillStyle(color);
    body.fillRoundedRect(-6, -10, 12, 18, 3);
    
    // Tête
    body.fillStyle(0xffdbac);
    body.fillCircle(0, -14, 6);
    
    // Casque simple
    body.fillStyle(0x654321);
    body.fillRect(-7, -18, 14, 6);
    
    // Bras avec hache
    body.fillStyle(color);
    body.fillRoundedRect(-2, -8, 6, 14, 2);
    body.fillRoundedRect(4, -8, 6, 14, 2);
    
    container.add(body);

    // 3. Jambe Avant
    enemyInstance.legs.front = scene.add.container(0, 5);
    const legF = scene.add.graphics();
    legF.fillStyle(color);
    legF.fillRoundedRect(-3, 0, 6, 18, 2);
    legF.fillRoundedRect(-4, 16, 10, 5, 2);
    enemyInstance.legs.front.add(legF);
    container.add(enemyInstance.legs.front);

    // 4. Hache dans la main (sera animée lors du lancer)
    enemyInstance.axe = scene.add.graphics();
    enemyInstance.axe.fillStyle(0x888888); // Manche
    enemyInstance.axe.fillRect(8, -6, 2, 8);
    enemyInstance.axe.fillStyle(0xcccccc); // Lame
    enemyInstance.axe.beginPath();
    enemyInstance.axe.moveTo(10, -6);
    enemyInstance.axe.lineTo(16, -10);
    enemyInstance.axe.lineTo(16, -2);
    enemyInstance.axe.closePath();
    enemyInstance.axe.fillPath();
    container.add(enemyInstance.axe);

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    const speed = 0.006;
    const range = 0.4;
    enemyInstance.legs.front.rotation = Math.sin(time * speed) * range;
    enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * range;
  },
};
