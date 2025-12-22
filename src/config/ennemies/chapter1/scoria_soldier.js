export const scoria_soldier = {
  name: "Soldat de Scories",
  speed: 65,
  hp: 220,
  reward: 20,
  playerDamage: 1,
  color: 0xaa4422,
  damage: 12,
  attackSpeed: 800,
  scale: 1,

  onDraw: (scene, container, color, enemyInstance) => {
    enemyInstance.legs = {};

    // Jambe arrière
    enemyInstance.legs.back = scene.add.container(-2, 5);
    const legB = scene.add.graphics();
    legB.fillStyle(0x552211);
    legB.fillRoundedRect(-3, 0, 6, 16, 2);
    enemyInstance.legs.back.add(legB);
    container.add(enemyInstance.legs.back);

    // Torse
    const body = scene.add.graphics();
    body.fillStyle(color);
    body.fillRoundedRect(-6, -12, 12, 20, 3);
    body.lineStyle(2, 0xff6a2e);
    body.strokeRoundedRect(-6, -12, 12, 20, 3);
    // Casque
    body.fillStyle(0x2b1a10);
    body.fillRoundedRect(-7, -18, 14, 8, 3);
    // Visor
    body.fillStyle(0xffdd99);
    body.fillRect(-2, -16, 6, 3);
    container.add(body);

    // Jambe avant
    enemyInstance.legs.front = scene.add.container(2, 5);
    const legF = scene.add.graphics();
    legF.fillStyle(0xcc5522);
    legF.fillRoundedRect(-3, 0, 6, 16, 2);
    enemyInstance.legs.front.add(legF);
    container.add(enemyInstance.legs.front);

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    const speed = 0.009;
    const range = 0.45;
    enemyInstance.legs.front.rotation = Math.sin(time * speed) * range;
    enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * range;
  },
};
