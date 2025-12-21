export const blackflame_sorcerer = {
  name: "Sorcier de Flamme Noire",
  speed: 45,
  hp: 1800,
  reward: 220,
  playerDamage: 3,
  color: 0x552255,
  damage: 12,
  attackSpeed: 1100,
  scale: 1,

  curseInterval: 12000,
  curseCost: 25,

  onDraw: (scene, container, color, enemyInstance) => {
    // Cape de cendre
    const robe = scene.add.graphics();
    robe.fillStyle(0x1a0f1a, 0.9);
    robe.fillEllipse(0, 0, 26, 30);
    container.add(robe);

    // Aura sombre
    const aura = scene.add.graphics();
    aura.lineStyle(2, 0x661144, 0.45);
    aura.strokeCircle(0, 0, 22);
    aura.fillStyle(0x330022, 0.08);
    aura.fillCircle(0, 0, 22);
    container.add(aura);
    enemyInstance.aura = aura;

    // Bras embrasés
    const hands = scene.add.graphics();
    hands.fillStyle(0x9b59b6);
    hands.fillCircle(-6, 6, 4);
    hands.fillCircle(6, 6, 4);
    container.add(hands);

    // Flamme noire
    const flame = scene.add.graphics();
    flame.fillStyle(0x330022);
    flame.fillTriangle(0, -20, -6, -6, 6, -6);
    flame.fillStyle(0xaa66ff);
    flame.fillTriangle(0, -14, -4, -6, 4, -6);
    container.add(flame);

    // Yeux
    const eyes = scene.add.graphics();
    eyes.fillStyle(0xd6b3ff);
    eyes.fillCircle(-3, -2, 1.6);
    eyes.fillCircle(3, -2, 1.6);
    container.add(eyes);

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    if (enemyInstance.aura) {
      enemyInstance.aura.rotation += 0.0025;
      enemyInstance.aura.alpha = 0.1 + Math.abs(Math.sin(time * 0.01)) * 0.2;
    }
    enemyInstance.bodyGroup.y = Math.sin(time * 0.006) * 2;
  },
};
