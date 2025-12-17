export const runner = {
  name: "Scout",
  speed: 260,
  hp: 110, 
  reward: 30,
  color: 0xffd166, // Jaune/Orange
  damage: 14, // Dégâts par attaque (rapide mais faible)
  attackSpeed: 600, // Vitesse d'attaque en ms

  onDraw: (scene, container, color, enemyInstance) => {
    enemyInstance.legs = {};

    // Le corps est légèrement penché vers l'avant (mais on garde l'orientation verticale)
    // container.angle = -15; // Retiré pour garder l'ennemi droit

    // 1. Jambe Arrière (sombre)
    enemyInstance.legs.back = scene.add.container(2, 4);
    const legB = scene.add.graphics();
    legB.fillStyle(0xccaa44);
    legB.fillRoundedRect(-2, 0, 5, 22, 2); // Jambe fine et longue
    enemyInstance.legs.back.add(legB);
    container.add(enemyInstance.legs.back);

    // 2. Corps (Fin et aérodynamique)
    const body = scene.add.graphics();
    body.fillStyle(color);
    // Torse fin
    body.fillRoundedRect(-5, -12, 10, 18, 4);
    // Tête avec une sorte de capuche/masque pointu
    body.beginPath();
    body.moveTo(0, -22);
    body.lineTo(8, -14);
    body.lineTo(-4, -12);
    body.closePath();
    body.fillPath();
    container.add(body);

    // 3. Jambe Avant
    enemyInstance.legs.front = scene.add.container(2, 4);
    const legF = scene.add.graphics();
    legF.fillStyle(color);
    legF.fillRoundedRect(-2, 0, 5, 22, 2);
    enemyInstance.legs.front.add(legF);
    container.add(enemyInstance.legs.front);

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    // Course rapide : vitesse élevée, grande amplitude
    const speed = 0.015;
    const range = 0.8;

    enemyInstance.legs.front.rotation = Math.sin(time * speed) * range;
    enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * range;
  },
};
