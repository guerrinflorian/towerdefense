export const grunt = {
  name: "Grunt",
  speed: 62,
  hp: 100,
  reward: 15,
  playerDamage: 1,
  color: 0x558844, // Vert militaire
  damage: 8, // Dégâts par attaque
  attackSpeed: 800, // Vitesse d'attaque en ms
  scale: 1,
  description: "Soldat de base ennemi. Rôle : unité standard sans pouvoir spécial. Lent mais résistant, il avance vers votre base pour l'attaquer.",

  // --- DESSIN DU PERSONNAGE (Vue de profil) ---
  onDraw: (scene, container, color, enemyInstance) => {
    // On stocke les références aux jambes dans l'instance pour pouvoir les animer
    enemyInstance.legs = {};

    // 1. Jambe Arrière (plus sombre)
    enemyInstance.legs.back = scene.add.container(0, 5); // Pivot à la hanche
    const legB = scene.add.graphics();
    legB.fillStyle(0x335522); // Vert foncé
    legB.fillRoundedRect(-3, 0, 6, 18, 2); // Cuisse/Mollet
    legB.fillRoundedRect(-4, 16, 10, 5, 2); // Botte
    enemyInstance.legs.back.add(legB);
    container.add(enemyInstance.legs.back);

    // 2. Corps (Torse, Tête, Bras visible)
    const body = scene.add.graphics();
    // Torse (Gilet)
    body.fillStyle(color);
    body.fillRoundedRect(-6, -10, 12, 18, 3);
    // Tête (Casque rond)
    body.fillStyle(0x446633);
    body.fillCircle(0, -14, 7);
    // Visière/Yeux (Petit trait noir)
    body.fillStyle(0x000000);
    body.fillRect(2, -16, 4, 3);
    // Bras (fixe le long du corps pour simplifier)
    body.fillStyle(color);
    body.fillRoundedRect(-2, -8, 6, 16, 2);
    container.add(body);

    // 3. Jambe Avant (couleur normale)
    enemyInstance.legs.front = scene.add.container(0, 5); // Pivot à la hanche
    const legF = scene.add.graphics();
    legF.fillStyle(color);
    legF.fillRoundedRect(-3, 0, 6, 18, 2); // Cuisse/Mollet
    legF.fillRoundedRect(-4, 16, 10, 5, 2); // Botte
    enemyInstance.legs.front.add(legF);
    container.add(enemyInstance.legs.front);

    // L'ennemi utilise maintenant le flip horizontal au lieu de rotation
    enemyInstance.shouldRotate = false;
  },

  // --- ANIMATION DE MARCHE (Pendule) ---
  onUpdateAnimation: (time, enemyInstance) => {
    const speed = 0.008; // Vitesse du balancement
    const range = 0.5; // Amplitude du balancement (en radians)

    // Oscillation sinusoïdale
    // La jambe arrière est opposée à la jambe avant (+ Math.PI)
    enemyInstance.legs.front.rotation = Math.sin(time * speed) * range;
    enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * range;
  },
};
