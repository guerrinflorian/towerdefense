export const obsidian_bastion = {
  name: "Bastion d'Obsidienne",
  speed: 20,
  hp: 3400,
  reward: 200,
  playerDamage: 5,
  color: 0x2b2b2b,
  damage: 32,
  attackSpeed: 1800,
  scale: 1.15,

  onDraw: (scene, container, color, enemyInstance) => {
    enemyInstance.legs = {};

    // Ombre lourde
    const shadow = scene.add.graphics();
    shadow.fillStyle(0x000000, 0.35);
    shadow.fillEllipse(0, 18, 46, 16);
    container.add(shadow);

    // Corps massif
    const body = scene.add.graphics();
    body.fillStyle(color);
    body.fillRoundedRect(-22, -26, 44, 46, 6);
    body.lineStyle(3, 0x444444);
    body.strokeRoundedRect(-22, -26, 44, 46, 6);

    // Épaulières obsidiennes
    body.fillStyle(0x111111);
    // Épaule gauche
    body.beginPath();
    body.moveTo(-26, -18);
    body.lineTo(-10, -32);
    body.lineTo(-2, -28);
    body.lineTo(-8, -14);
    body.closePath();
    body.fillPath();
    // Épaule droite
    body.beginPath();
    body.moveTo(26, -18);
    body.lineTo(10, -32);
    body.lineTo(2, -28);
    body.lineTo(8, -14);
    body.closePath();
    body.fillPath();

    // Noyau magma
    body.fillStyle(0xff4400);
    body.fillCircle(0, -4, 8);
    container.add(body);

    // Plaques épaisses
    const plates = scene.add.graphics();
    plates.lineStyle(3, 0x6a4a3a);
    plates.strokeRect(-20, -18, 40, 10);
    plates.strokeRect(-18, -4, 36, 10);
    container.add(plates);

    // Jambes blocs
    enemyInstance.legs.back = scene.add.container(0, 12);
    const legB = scene.add.graphics();
    legB.fillStyle(0x1d1d1d);
    legB.fillRect(-12, 0, 24, 12);
    enemyInstance.legs.back.add(legB);
    container.add(enemyInstance.legs.back);

    enemyInstance.legs.front = scene.add.container(0, 12);
    const legF = scene.add.graphics();
    legF.fillStyle(0x222222);
    legF.fillRect(-12, 0, 24, 12);
    enemyInstance.legs.front.add(legF);
    container.add(enemyInstance.legs.front);

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    const speed = 0.003;
    const range = 0.18;
    const sin = Math.sin(time * speed);
    if (enemyInstance.legs.front) enemyInstance.legs.front.rotation = sin * range;
    if (enemyInstance.legs.back) enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * range;
    enemyInstance.bodyGroup.y = Math.abs(sin) * -4;
  },
};
