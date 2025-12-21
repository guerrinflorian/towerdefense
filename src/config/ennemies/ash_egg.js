export const ash_egg = {
  name: "Œuf incandescent",
  speed: 0,
  hp: 240,
  reward: 0,
  playerDamage: 0,
  color: 0xff9933,
  damage: 0,
  attackSpeed: 0,
  scale: 1,

  isEgg: true,
  isStationary: true,
  hatchTime: 5000,
  hatchSpawnType: "flame_scarab",
  hatchCount: 2,

  onDraw: (scene, container, color, enemyInstance) => {
    const shell = scene.add.graphics();
    shell.fillStyle(0x4a2a1a);
    shell.fillEllipse(0, 0, 22, 28);
    shell.lineStyle(3, 0xff7a33, 0.8);
    shell.strokeEllipse(0, 0, 22, 28);
    shell.fillStyle(0xffe0b3, 0.6);
    shell.fillEllipse(-4, -6, 10, 8);
    container.add(shell);

    const cracks = scene.add.graphics();
    cracks.lineStyle(2, 0xffd18c);
    cracks.strokeLineShape(new Phaser.Geom.Line(-6, -2, 0, 4));
    cracks.strokeLineShape(new Phaser.Geom.Line(0, 4, 6, 0));
    container.add(cracks);

    enemyInstance.shouldRotate = false;
  },

  onDeath: (enemy) => {
    if (enemy.hatchTimer) {
      enemy.hatchTimer.remove();
      enemy.hatchTimer = null;
    }
    if (enemy.linkedQueen?.active) {
      const damage = enemy.stats.linkedDamageToQueen || enemy.hatchDamageToQueen || 800;
      enemy.linkedQueen.damage(damage, { source: enemy });
    }
  },
};
