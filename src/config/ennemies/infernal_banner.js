export const infernal_banner = {
  name: "Porte-Bannière Infernal",
  speed: 60,
  hp: 2800,
  reward: 180,
  playerDamage: 3,
  color: 0xcc3322,
  damage: 16,
  attackSpeed: 1200,
  scale: 1,

  preventDeathAura: true,
  survivalAuraRadius: 1.6,

  onDraw: (scene, container, color, enemyInstance) => {
    // Aura de survie
    const tileSize = 64 * (scene.scaleFactor || 1);
    const radius = (infernal_banner.survivalAuraRadius || 1.6) * tileSize;
    const aura = scene.add.graphics();
    aura.lineStyle(2, 0xff5533, 0.45);
    aura.strokeCircle(0, 0, radius);
    aura.fillStyle(0xff5533, 0.08);
    aura.fillCircle(0, 0, radius);
    aura.setDepth(-1);
    container.add(aura);
    enemyInstance.aura = aura;

    // Corps blindé
    const body = scene.add.graphics();
    body.fillStyle(0x3a1a12);
    body.fillRoundedRect(-10, -16, 20, 26, 4);
    body.lineStyle(2, 0xff8a5c);
    body.strokeRoundedRect(-10, -16, 20, 26, 4);
    container.add(body);

    // Bannière
    const bannerPole = scene.add.graphics();
    bannerPole.lineStyle(4, 0x111111);
    bannerPole.strokeLineShape(new Phaser.Geom.Line(0, -24, 0, -44));
    bannerPole.lineStyle(3, 0xaa2211);
    bannerPole.strokeLineShape(new Phaser.Geom.Line(-1, -24, -1, -46));
    const flag = scene.add.graphics();
    flag.fillStyle(0xff4422);
    flag.fillRect(0, -46, 22, 16);
    flag.fillStyle(0x7a1a0e);
    flag.fillTriangle(22, -30, 22, -46, 30, -40);
    container.add(bannerPole);
    container.add(flag);
    enemyInstance.flag = flag;

    // Casque
    const head = scene.add.graphics();
    head.fillStyle(0x1a0e08);
    head.fillCircle(0, -20, 8);
    head.fillStyle(0xffcc88);
    head.fillRect(-3, -22, 6, 3);
    container.add(head);

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    if (enemyInstance.flag) {
      enemyInstance.flag.y = -46 + Math.sin(time * 0.01) * 2;
    }
    if (enemyInstance.aura) {
      enemyInstance.aura.alpha = 0.1 + Math.abs(Math.sin(time * 0.012)) * 0.12;
    }
  },
};
