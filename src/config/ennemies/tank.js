export const tank = {
  name: "Heavy",
  speed: 38,
  hp: 2650,
  reward: 140,
  color: 0x224466, // Bleu acier foncé
  damage: 28, // Dégâts par attaque (très fort)
  attackSpeed: 1200, // Vitesse d'attaque en ms (lent)
  scale: 1,

  onDraw: (scene, container, color, enemyInstance) => {
    enemyInstance.legs = {};

    // 1. "Pied" Arrière (Gros bloc)
    enemyInstance.legs.back = scene.add.container(0, 10);
    const legB = scene.add.graphics();
    legB.fillStyle(0x112233);
    legB.fillRect(-10, 0, 20, 12); // Pied large
    enemyInstance.legs.back.add(legB);
    container.add(enemyInstance.legs.back);

    // 2. Corps (Armure massive)
    const body = scene.add.graphics();
    body.fillStyle(color);
    // Gros plastron carré
    body.fillRoundedRect(-18, -25, 36, 35, 6);
    body.lineStyle(3, 0x000000);
    body.strokeRoundedRect(-18, -25, 36, 35, 6);

    // Petite tête carrée engoncée dans l'armure
    body.fillStyle(0x112233);
    body.fillRect(-8, -32, 16, 10);
    // Oeil rouge unique type "cyclope robot"
    body.fillStyle(0xff0000);
    body.fillRect(4, -28, 6, 4);

    // Gros bras carré sur le côté
    body.fillStyle(color);
    body.fillRoundedRect(-4, -15, 14, 25, 4);

    container.add(body);

    // 3. "Pied" Avant
    enemyInstance.legs.front = scene.add.container(0, 10);
    const legF = scene.add.graphics();
    legF.fillStyle(color);
    legF.fillRect(-10, 0, 20, 12);
    enemyInstance.legs.front.add(legF);
    container.add(enemyInstance.legs.front);

    // Le tank est si gros qu'il ne tourne pas pour suivre le chemin, il reste droit
    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    // Piétinement lourd : faible vitesse, faible amplitude, mouvement vertical ajouté
    const speed = 0.004;
    const range = 0.2;

    const sin = Math.sin(time * speed);
    enemyInstance.legs.front.rotation = sin * range;
    enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * range;

    // Petit effet de rebond vertical lourd
    enemyInstance.bodyGroup.y = Math.abs(sin) * -3;
  },
};
