export const zombie_minion = {
  name: "Bébé Zombie",
  speed: 60, // Lent
  hp: 55,
  reward: 5, // Peu de récompense
  playerDamage: 1,
  color: 0x4a7a2f, // Vert zombie
  damage: 3, // Dégâts faibles
  attackSpeed: 1000,
  scale: 0.7, // Plus petit que les autres ennemis

  onDraw: (scene, container, color, enemyInstance) => {
    enemyInstance.legs = {};

    // 1. Jambe Arrière
    enemyInstance.legs.back = scene.add.container(0, 3);
    const legB = scene.add.graphics();
    legB.fillStyle(0x2d5016); // Vert foncé
    legB.fillRoundedRect(-2, 0, 4, 12, 1);
    legB.fillRoundedRect(-3, 11, 6, 3, 1); // Petit pied
    enemyInstance.legs.back.add(legB);
    container.add(enemyInstance.legs.back);

    // 2. Corps (petit et trapu)
    const body = scene.add.graphics();
    // Torse
    body.fillStyle(color);
    body.fillRoundedRect(-4, -6, 8, 10, 2);
    // Tête (plus grosse proportionnellement)
    body.fillStyle(0x3a6b1f);
    body.fillCircle(0, -10, 5);
    // Yeux morts (points rouges)
    body.fillStyle(0xff0000);
    body.fillCircle(-2, -11, 1);
    body.fillCircle(2, -11, 1);
    // Bras (courts)
    body.fillStyle(color);
    body.fillRoundedRect(-5, -4, 3, 6, 1);
    body.fillRoundedRect(2, -4, 3, 6, 1);
    container.add(body);

    // 3. Jambe Avant
    enemyInstance.legs.front = scene.add.container(0, 3);
    const legF = scene.add.graphics();
    legF.fillStyle(color);
    legF.fillRoundedRect(-2, 0, 4, 12, 1);
    legF.fillRoundedRect(-3, 11, 6, 3, 1);
    enemyInstance.legs.front.add(legF);
    container.add(enemyInstance.legs.front);

    // Détails zombie (plaies, déchirures)
    body.fillStyle(0x8b4513); // Marron pour les plaies
    body.fillRect(-3, -2, 2, 1);
    body.fillRect(1, 0, 2, 1);

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    const speed = 0.01; // Animation plus rapide pour les petits
    const range = 0.4;

    enemyInstance.legs.front.rotation = Math.sin(time * speed) * range;
    enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * range;
  },
};
