export const ember_scout = {
  name: "Éclaireur de Braises",
  speed: 210,
  hp: 120,
  reward: 30,
  playerDamage: 2,
  color: 0xff6a1f,
  damage: 7,
  attackSpeed: 900,
  scale: 0.95,
  description: "Éclaireur de Braises - Éclaireur rapide. Rôle : unité de reconnaissance sans pouvoir spécial. Rapide et agile avec une traînée d'étincelles.",

  onDraw: (scene, container, color, enemyInstance) => {
    enemyInstance.legs = {};

    // Traînée d'étincelles
    const trail = scene.add.graphics();
    trail.fillStyle(0xffaa55, 0.35);
    trail.fillEllipse(-14, 8, 18, 10);
    container.add(trail);
    enemyInstance.trail = trail;

    // Corps fuselé
    const body = scene.add.graphics();
    body.fillStyle(0x1a1a1a);
    body.fillRoundedRect(-6, -10, 12, 18, 5);
    body.fillStyle(color);
    body.fillTriangle(0, -18, 8, -8, -8, -8);
    container.add(body);

    // Jambe arrière
    enemyInstance.legs.back = scene.add.container(0, 6);
    const legB = scene.add.graphics();
    legB.fillStyle(0x662200);
    legB.fillRoundedRect(-2, 0, 4, 16, 2);
    enemyInstance.legs.back.add(legB);
    container.add(enemyInstance.legs.back);

    // Jambe avant
    enemyInstance.legs.front = scene.add.container(2, 6);
    const legF = scene.add.graphics();
    legF.fillStyle(color);
    legF.fillRoundedRect(-2, 0, 4, 16, 2);
    enemyInstance.legs.front.add(legF);
    container.add(enemyInstance.legs.front);

    // Lueur fissures
    const glow = scene.add.graphics();
    glow.lineStyle(2, 0xffb347);
    glow.strokeLineShape(new Phaser.Geom.Line(-4, -6, 4, 4));
    glow.strokeLineShape(new Phaser.Geom.Line(0, -8, 2, 6));
    container.add(glow);

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    const s = 0.015;
    const r = 0.9;
    enemyInstance.legs.front.rotation = Math.sin(time * s) * r;
    enemyInstance.legs.back.rotation = Math.sin(time * s + Math.PI) * r;
    if (enemyInstance.trail) {
      enemyInstance.trail.alpha = 0.2 + Math.abs(Math.sin(time * 0.01)) * 0.3;
    }
  },
};
