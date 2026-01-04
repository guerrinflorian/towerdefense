// ==========================================
// 3. DIVISEUR (Le Boss, se divise en moyens)
// ==========================================
export const diviseur = {
  name: "Diviseur",
  speed: 30,
  hp: 3500,
  reward: 180,
  playerDamage: 4,
  color: 0x00ff00, // Vert slime
  damage: 20,
  attackSpeed: 1200,
  scale: 1.3,
  description: "Diviseur - Créature gélatineuse géante. Rôle : se divise à sa mort. POUVOIR SPÉCIAL : À sa mort, se divise en 2 Slimes Moyens. Éliminez-le avec précaution !",
  
  // --- LOGIQUE DE DIVISION ---
  onDeath: (enemy) => {
    if (!enemy.scene || !enemy.active || !enemy.path) return;
    
    // Paramètres
    const childKey = "slime_medium";
    const count = 2; // Se divise en 2 moyens
    
    // Splash visuel à la mort du gros
    const splash = enemy.scene.add.circle(enemy.x, enemy.y, 10, 0x00ff00);
    enemy.scene.tweens.add({
        targets: splash, scale: 5, alpha: 0, duration: 400, onComplete: () => splash.destroy()
    });

    // Création des enfants
    const ChildClass = enemy.constructor;
    for (let i = 0; i < count; i++) {
        const child = new ChildClass(enemy.scene, enemy.path, childKey);
        
        // Initialiser spawn d'abord (pour pathLength, etc.)
        child.spawn();
        
        // Ensuite définir progress à la position du parent (légèrement en retrait)
        child.progress = Math.max(0, enemy.progress - (i * 0.02));
        const point = enemy.path.getPoint(child.progress);
        child.setPosition(point.x, point.y);
        
        // Initialiser previousTangent pour le mouvement
        if (child.progress > 0) {
          child.previousTangent = child.calculateTangent(child.progress);
        }
        
        enemy.scene.enemies.add(child);
        
        child.bodyGroup.y = -25;
        enemy.scene.tweens.add({
            targets: child.bodyGroup, y: 0, duration: 400, ease: 'Bounce.Out'
        });
    }
  },

  onDraw: (scene, container, color, enemyInstance) => {
    // Slime géant : forme de goutte massive
    const body = scene.add.graphics();
    
    // Corps principal (grosse goutte)
    body.fillStyle(color);
    body.fillEllipse(0, 0, 50, 45);
    body.lineStyle(3, 0x00cc00);
    body.strokeEllipse(0, 0, 50, 45);
    
    // Reflets brillants
    body.fillStyle(0x88ff88);
    body.fillEllipse(-8, -10, 15, 12);
    body.fillEllipse(5, -8, 10, 8);
    
    // Yeux multiples
    body.fillStyle(0x000000);
    body.fillCircle(-12, -5, 4);
    body.fillCircle(0, -8, 4);
    body.fillCircle(12, -5, 4);
    
    // Petites bulles à la surface
    body.fillStyle(0x88ff88);
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const dist = 18;
      body.fillCircle(Math.cos(angle) * dist, Math.sin(angle) * dist, 3);
    }

    container.add(body);
    enemyInstance.body = body;
    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    // Animation de tremblement/ondulation
    if (enemyInstance.body) {
      const wobble = Math.sin(time * 0.008) * 0.1;
      enemyInstance.body.scaleX = 1 + wobble;
      enemyInstance.body.scaleY = 1 - wobble * 0.5;
      
      // Mouvement vertical de rebond
      enemyInstance.bodyGroup.y = Math.sin(time * 0.01) * 3;
    }
  },
};
