export const shield = {
  name: "Aegis",
  speed: 65,
  hp: 550,
  reward: 65,
  playerDamage: 2,
  color: 0x00aabb, // Cyan/Teal
  damage: 12, // Dégâts par attaque
  attackSpeed: 900, // Vitesse d'attaque en ms
  scale: 1,
  description: "Aegis - Protecteur. Rôle : bloque les attaques pour protéger les alliés derrière lui. POUVOIR SPÉCIAL : Bouclier qui intercepte les projectiles. Priorité absolue à éliminer en premier !",

  onDraw: (scene, container, color, enemyInstance) => {
    enemyInstance.legs = {};

    // 1. Jambes (Similaires au Grunt mais plus robustes)
    enemyInstance.legs.back = scene.add.container(0, 5);
    const legB = scene.add.graphics();
    legB.fillStyle(0x007788);
    legB.fillRoundedRect(-4, 0, 8, 18, 3);
    enemyInstance.legs.back.add(legB);
    container.add(enemyInstance.legs.back);

    // 2. Corps (Derrière le bouclier)
    const body = scene.add.graphics();
    body.fillStyle(color);
    body.fillRoundedRect(-7, -12, 14, 20, 4); // Torse
    body.fillStyle(0x007788);
    body.fillCircle(0, -16, 8); // Tête
    container.add(body);

    // 3. Jambe Avant
    enemyInstance.legs.front = scene.add.container(0, 5);
    const legF = scene.add.graphics();
    legF.fillStyle(color);
    legF.fillRoundedRect(-4, 0, 8, 18, 3);
    enemyInstance.legs.front.add(legF);
    container.add(enemyInstance.legs.front);

    // 4. LE BOUCLIER (Devant tout le reste)
    const shield = scene.add.graphics();
    // Grand hexagone d'énergie
    shield.fillStyle(0x00ffff, 0.7); // Cyan semi-transparent
    shield.lineStyle(3, 0xffffff);
    shield.beginPath();
    shield.moveTo(15, -20);
    shield.lineTo(20, 0);
    shield.lineTo(15, 25);
    shield.lineTo(5, 20);
    shield.lineTo(5, -15);
    shield.closePath();
    shield.fillPath();
    shield.strokePath();
    // Symbole "+" dessus
    shield.fillStyle(0xffffff);
    shield.fillRect(10, -5, 6, 16);
    shield.fillRect(5, 0, 16, 6);

    container.add(shield);

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    // Marche lente et assurée
    const speed = 0.006;
    const range = 0.4;
    enemyInstance.legs.front.rotation = Math.sin(time * speed) * range;
    enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * range;
  },
};
