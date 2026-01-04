// ==========================================
// SLIME ROSE (Se divise en 3 petits slimes à sa mort)
// ==========================================
export const pink_slime = {
  name: "Slime Rose",
  speed: 40,
  hp: 3800,
  reward: 40,
  playerDamage: 4,
  color: 0xffb6c1, // Rose clair
  damage: 65,
  attackSpeed: 1500,
  description: "Slime Rose - Créature divisante. Rôle : se divise à sa mort. POUVOIR SPÉCIAL : À sa mort, se divise en 3 Petits Slimes Roses. Résistant et collant, éliminez-le avec précaution !",
  scale: 1,
  
  // --- LOGIQUE DE DIVISION ---
  onDeath: (enemy) => {
    if (!enemy.scene || !enemy.active || !enemy.path) return;
    
    // Paramètres
    const childKey = "pink_slime_small";
    const count = 3; // Se divise en 3 petits
    
    // Création des enfants
    const ChildClass = enemy.constructor;
    const waveIndex = enemy.waveIndex ?? enemy.scene?.activeWaveIndex ?? null;
    
    for (let i = 0; i < count; i++) {
        const child = new ChildClass(enemy.scene, enemy.path, childKey);
        
        // Transmettre le waveIndex pour le tracking
        child.waveIndex = waveIndex;
        
        // Initialiser spawn d'abord (pour pathLength, etc.)
        child.spawn();
        
        // Ensuite définir progress à la position du parent (légèrement en retrait)
        child.progress = Math.max(0, enemy.progress - (i * 0.015));
        const point = enemy.path.getPoint(child.progress);
        child.setPosition(point.x, point.y);
        
        // Initialiser previousTangent pour le mouvement
        if (child.progress > 0) {
          child.previousTangent = child.calculateTangent(child.progress);
        }
        
        enemy.scene.enemies.add(child);
        
        // Tracking de spawn pour les statistiques
        if (enemy.scene.runTracker) {
          enemy.scene.runTracker.onEnemySpawn(waveIndex, childKey);
        }
        
        // Petit saut à l'apparition
        child.bodyGroup.y = -15;
        enemy.scene.tweens.add({
            targets: child.bodyGroup, y: 0, duration: 250, ease: 'Bounce.Out'
        });
    }
  },

  onDraw: (scene, container, color, enemyInstance) => {
    // Slime rose : forme de goutte
    const body = scene.add.graphics();
    
    const colors = {
      main: 0xffb6c1,      // Rose clair
      light: 0xffc0cb,     // Rose plus clair
      outline: 0xff1493, // Rose profond
      highlight: 0xffecf1, // Rose très clair
      eyes: 0x2d3436       // Yeux noirs
    };
    
    // Corps principal
    body.fillStyle(colors.main);
    body.fillEllipse(0, 0, 38, 32);
    body.lineStyle(2, colors.outline);
    body.strokeEllipse(0, 0, 38, 32);
    
    // Reflets
    body.fillStyle(colors.light);
    body.fillEllipse(-6, -7, 12, 10);
    body.fillEllipse(4, -6, 9, 8);
    
    // Yeux
    body.fillStyle(colors.eyes);
    body.fillCircle(-9, -4, 3.5);
    body.fillCircle(9, -4, 3.5);
    
    // Petites bulles roses
    body.fillStyle(colors.highlight);
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const dist = 14;
      body.fillCircle(Math.cos(angle) * dist, Math.sin(angle) * dist, 2.5);
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

