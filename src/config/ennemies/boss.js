export const boss = {
  name: "DOOM",
  speed: 11,
  hp: 42000,
  reward: 1000,
  color: 0x222222, // Noir/Rouge
  damage: 70, // Dégâts par attaque (très fort)
  attackSpeed: 1500, // Vitesse d'attaque en ms
  scale: 1,

  onDraw: (scene, container, color, enemyInstance) => {
    // Pas de jambes pour le boss, il flotte !

    // 1. Cape / Aura (Flottant derrière)
    const aura = scene.add.graphics();
    aura.fillStyle(0xff0000, 0.3); // Rouge sang transparent
    // Forme déchiquetée
    aura.beginPath();
    aura.moveTo(-30, -40);
    aura.lineTo(30, -40);
    aura.lineTo(40, 20);
    aura.lineTo(20, 50);
    aura.lineTo(0, 30);
    aura.lineTo(-20, 50);
    aura.lineTo(-40, 20);
    aura.closePath();
    aura.fillPath();
    container.add(aura);

    // 2. Corps (Armure noire massive à pointes)
    const body = scene.add.graphics();
    body.fillStyle(color); // Noir
    body.lineStyle(4, 0xff0000); // Bordure rouge

    // Torse massif
    body.beginPath();
    body.moveTo(-25, -30);
    body.lineTo(25, -30);
    body.lineTo(15, 30);
    body.lineTo(-15, 30);
    body.closePath();
    body.fillPath();
    body.strokePath();

    // Épaulières à pointes
    body.fillStyle(0xff0000);
    body.beginPath();
    body.moveTo(-25, -30);
    body.lineTo(-45, -40);
    body.lineTo(-25, -10);
    body.fillPath();
    body.beginPath();
    body.moveTo(25, -30);
    body.lineTo(45, -40);
    body.lineTo(25, -10);
    body.fillPath();

    // Tête (Casque cornu)
    body.fillStyle(color);
    body.fillRect(-12, -50, 24, 20);
    // Cornes
    body.fillStyle(0xff0000);
    body.beginPath();
    body.moveTo(-12, -50);
    body.lineTo(-25, -70);
    body.lineTo(-5, -50);
    body.fillPath();
    body.beginPath();
    body.moveTo(12, -50);
    body.lineTo(25, -70);
    body.lineTo(5, -50);
    body.fillPath();
    // Yeux brillants
    body.fillStyle(0xffff00);
    body.fillRect(-8, -45, 6, 4);
    body.fillRect(2, -45, 6, 4);

    container.add(body);

    // Le Boss est trop imposant pour tourner rapidement
    enemyInstance.shouldRotate = false;

    // On stocke l'aura pour l'animer
    enemyInstance.aura = aura;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    // Pas de marche, mais une lévitation menaçante
    const speed = 0.002;
    const floatRange = 10;

    // Flottement vertical lent
    enemyInstance.bodyGroup.y = Math.sin(time * speed) * floatRange;

    // L'aura ondule légèrement
    enemyInstance.aura.scaleX = 1 + Math.sin(time * 0.005) * 0.1;
    enemyInstance.aura.alpha = 0.3 + Math.sin(time * 0.01) * 0.1;
  },
};
