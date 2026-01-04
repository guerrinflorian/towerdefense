export const flame_scarab = {
  name: "Scarabée des Flammes",
  speed: 115,
  hp: 260,
  reward: 40,
  playerDamage: 2,
  color: 0xff7a33,
  damage: 14,
  attackSpeed: 750,
  scale: 0.9,
  description: "Scarabée des Flammes - Unité rapide. Rôle : éclaireur rapide sans pouvoir spécial. Très rapide et inflammable, éclot des œufs de la Reine.",

  onDraw: (scene, container, color, enemyInstance) => {
    enemyInstance.legs = {};

    const body = scene.add.graphics();
    body.fillStyle(color);
    body.fillEllipse(0, 0, 24, 16);
    body.lineStyle(2, 0x883311);
    body.strokeEllipse(0, 0, 24, 16);
    body.fillStyle(0x331100);
    body.fillTriangle(-6, -6, 6, -6, 0, -14);
    container.add(body);

    // Étincelles
    const glow = scene.add.graphics();
    glow.fillStyle(0xffc266, 0.5);
    glow.fillEllipse(0, 0, 14, 10);
    container.add(glow);
    enemyInstance.glow = glow;

    // Pattes
    const legColor = 0x552200;
    const legs = scene.add.graphics();
    legs.lineStyle(3, legColor);
    legs.beginPath();
    legs.moveTo(-10, -4);
    legs.lineTo(-16, -10);
    legs.moveTo(-10, 4);
    legs.lineTo(-16, 10);
    legs.moveTo(10, -4);
    legs.lineTo(16, -10);
    legs.moveTo(10, 4);
    legs.lineTo(16, 10);
    legs.strokePath();
    container.add(legs);

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    if (enemyInstance.glow) {
      enemyInstance.glow.alpha = 0.3 + Math.sin(time * 0.02) * 0.2;
    }
  },
};
