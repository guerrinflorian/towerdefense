// ==========================================
// PETIT SLIME ROSE (Dernier stade, ne se divise plus)
// ==========================================
export const pink_slime_small = {
  name: "Petit Slime Rose",
  speed: 55,
  hp: 550,
  reward: 15,
  playerDamage: 1,
  color: 0xffc0cb, // Rose plus clair
  damage: 10,
  attackSpeed: 800,
  description: "Petit Slime Rose - Dernier stade de division. Rôle : unité rapide sans pouvoir spécial. Rapide et fuyard, résultat de la division du Slime Rose.",
  scale: 0.65,
  
  // Pas de onDeath car c'est la fin de la chaîne

  onDraw: (scene, container, color, enemyInstance) => {
    // Petit slime rose : forme de goutte petite
    const body = scene.add.graphics();
    
    const colors = {
      main: 0xffc0cb,      // Rose clair
      light: 0xffecf1,      // Rose très clair
      outline: 0xff69b4,   // Rose vif
      eyes: 0x2d3436        // Yeux noirs
    };
    
    // Corps principal
    body.fillStyle(colors.main);
    body.fillEllipse(0, 0, 24, 20);
    body.lineStyle(2, colors.outline);
    body.strokeEllipse(0, 0, 24, 20);
    
    // Reflet
    body.fillStyle(colors.light);
    body.fillEllipse(-4, -5, 8, 7);
    
    // Yeux
    body.fillStyle(colors.eyes);
    body.fillCircle(-6, -3, 2.5);
    body.fillCircle(6, -3, 2.5);
    
    // Petite bulle
    body.fillStyle(colors.light);
    body.fillCircle(0, 7, 2);

    container.add(body);
    enemyInstance.body = body;
    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    // Animation de tremblement rapide
    if (enemyInstance.body) {
      const wobble = Math.sin(time * 0.015) * 0.06;
      enemyInstance.body.scaleX = 1 + wobble;
      enemyInstance.body.scaleY = 1 - wobble * 0.5;
      
      // Mouvement vertical rapide
      enemyInstance.bodyGroup.y = Math.sin(time * 0.018) * 1.5;
    }
  },
};

