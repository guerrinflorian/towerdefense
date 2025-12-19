// ==========================================
// 2. SLIME MOYEN (Se divise en petits)
// ==========================================
export const slime_medium = {
  name: "Slime Moyen",
  speed: 40,
  hp: 800,
  reward: 50,
  playerDamage: 2,
  color: 0x44ff44, // Vert moyen
  damage: 12,
  attackSpeed: 1000,
  scale: 0.9,
  
  // --- LOGIQUE DE DIVISION ---
  onDeath: (enemy) => {
    if (!enemy.scene || !enemy.active) return;
    
    // Paramètres
    const childKey = "slime_small";
    const count = 2; // Se divise en 2 petits
    
    // Création des enfants
    const ChildClass = enemy.constructor;
    for (let i = 0; i < count; i++) {
        const child = new ChildClass(enemy.scene, enemy.path, childKey);
        
        // Positionnement légèrement décalé
        child.follower.t = Math.max(0, enemy.follower.t - (i * 0.015)); 
        const point = enemy.path.getPoint(child.follower.t);
        child.setPosition(point.x, point.y);
        
        // Dispersion latérale
        child.targetPathOffset = (Math.random() - 0.5) * 25;
        child.currentPathOffset = child.targetPathOffset;
        
        child.spawn();
        enemy.scene.enemies.add(child);
        
        // Petit saut à l'apparition
        child.bodyGroup.y = -15;
        enemy.scene.tweens.add({
            targets: child.bodyGroup, y: 0, duration: 250, ease: 'Bounce.Out'
        });
    }
  },

  onDraw: (scene, container, color, enemyInstance) => {
    // Slime moyen : forme de goutte
    const body = scene.add.graphics();
    
    // Corps principal
    body.fillStyle(color);
    body.fillEllipse(0, 0, 35, 30);
    body.lineStyle(2, 0x33cc33);
    body.strokeEllipse(0, 0, 35, 30);
    
    // Reflets
    body.fillStyle(0x66ff66);
    body.fillEllipse(-5, -6, 10, 8);
    body.fillEllipse(3, -5, 7, 6);
    
    // Yeux
    body.fillStyle(0x000000);
    body.fillCircle(-8, -3, 3);
    body.fillCircle(8, -3, 3);
    
    // Petites bulles
    body.fillStyle(0x66ff66);
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const dist = 12;
      body.fillCircle(Math.cos(angle) * dist, Math.sin(angle) * dist, 2);
    }

    container.add(body);
    enemyInstance.body = body;
    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    // Animation de tremblement
    if (enemyInstance.body) {
      const wobble = Math.sin(time * 0.01) * 0.08;
      enemyInstance.body.scaleX = 1 + wobble;
      enemyInstance.body.scaleY = 1 - wobble * 0.5;
      
      // Mouvement vertical
      enemyInstance.bodyGroup.y = Math.sin(time * 0.012) * 2;
    }
  },
};
