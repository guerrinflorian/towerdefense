export const ash_queen = {
  name: "Reine des Cendres",
  speed: 32,
  hp: 32000,
  reward: 1400,
  playerDamage: 8,
  color: 0x6a4b3a,
  damage: 90,
  attackSpeed: 1400,
  scale: 1.3,
  description: "Reine des Cendres - Boss reproducteur. Rôle : génère des renforts. POUVOIR SPÉCIAL : Spawne un Œuf Incandescent toutes les 8 secondes qui éclot en 3 Scarabées des Flammes. Commandante redoutable !",

  eggSpawnInterval: 8000,
  eggSpawnType: "ash_egg",
  eggScarabType: "flame_scarab",
  eggScarabCount: 3,
  eggDamageOnDestroy: 1200,

  onDraw: (scene, container, color, enemyInstance) => {
    // Ombre
    const shadow = scene.add.graphics();
    shadow.fillStyle(0x000000, 0.3);
    shadow.fillEllipse(0, 20, 60, 24);
    container.add(shadow);

    // Abdomen incandescent
    const abdomen = scene.add.graphics();
    abdomen.fillStyle(0xff5a1a);
    abdomen.fillEllipse(0, 10, 50, 36);
    abdomen.lineStyle(3, 0xffb366);
    abdomen.strokeEllipse(0, 10, 50, 36);
    container.add(abdomen);

    // Thorax
    const thorax = scene.add.graphics();
    thorax.fillStyle(0x3a2a22);
    thorax.fillEllipse(0, -12, 34, 24);
    thorax.lineStyle(2, 0x8b6a52);
    thorax.strokeEllipse(0, -12, 34, 24);
    container.add(thorax);

    // Pattes
    const legs = scene.add.graphics();
    legs.lineStyle(4, 0x2b1a12);
    legs.strokeLineShape(new Phaser.Geom.Line(-16, 2, -34, 14));
    legs.strokeLineShape(new Phaser.Geom.Line(-12, 12, -30, 22));
    legs.strokeLineShape(new Phaser.Geom.Line(16, 2, 34, 14));
    legs.strokeLineShape(new Phaser.Geom.Line(12, 12, 30, 22));
    container.add(legs);

    // Carapace cendrée
    const carapace = scene.add.graphics();
    carapace.fillStyle(0x4a3a2a);
    carapace.fillEllipse(0, -20, 26, 14);
    carapace.lineStyle(2, 0xffc266, 0.8);
    carapace.strokeEllipse(0, -20, 26, 14);
    container.add(carapace);

    // Cendres en suspension
    const ash = scene.add.graphics();
    ash.fillStyle(0xcccccc, 0.25);
    for (let i = 0; i < 12; i++) {
      ash.fillCircle(
        Phaser.Math.Between(-30, 30),
        Phaser.Math.Between(-30, 30),
        Phaser.Math.Between(1, 3)
      );
    }
    container.add(ash);
    enemyInstance.ash = ash;

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    if (enemyInstance.ash) {
      enemyInstance.ash.alpha = 0.25 + Math.abs(Math.sin(time * 0.01)) * 0.15;
    }
    enemyInstance.bodyGroup.y = Math.sin(time * 0.004) * 3;
  },
};
