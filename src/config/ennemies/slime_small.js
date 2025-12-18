// ==========================================
// 1. PETIT SLIME (Dernier stade, ne se divise plus)
// ==========================================
export const slime_small = {
  name: "Petit Slime",
  speed: 50,
  hp: 300,
  reward: 20,
  color: 0x88ff88, // Vert clair
  damage: 8,
  attackSpeed: 800,
  scale: 0.6,
  
  // Pas de onDeath car c'est la fin de la chaîne

  onDraw: (scene, container, color, enemyInstance) => {
    // Petit slime : forme de goutte petite
    const body = scene.add.graphics();
    
    // Corps principal
    body.fillStyle(color);
    body.fillEllipse(0, 0, 22, 18);
    body.lineStyle(2, 0x66ff66);
    body.strokeEllipse(0, 0, 22, 18);
    
    // Reflet
    body.fillStyle(0xaaffaa);
    body.fillEllipse(-3, -4, 6, 5);
    
    // Yeux
    body.fillStyle(0x000000);
    body.fillCircle(-5, -2, 2);
    body.fillCircle(5, -2, 2);
    
    // Petite bulle
    body.fillStyle(0xaaffaa);
    body.fillCircle(0, 6, 1.5);

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