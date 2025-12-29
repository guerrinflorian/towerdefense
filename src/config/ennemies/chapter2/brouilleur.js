export const brouilleur = {
  name: "Brouilleur",
  speed: 60,
  hp: 550,
  reward: 22,
  playerDamage: 1,
  color: 0x4a148c, // Violet foncé
  damage: 9,
  attackSpeed: 1000,
  scale: 0.95,
  // Cache les barres de vie ennemies
  jammingRadius: 2.5, // En cases (affecte tous les ennemis visibles)

  onDraw: (scene, container, color, enemyInstance) => {
    enemyInstance.elements = {};

    const colors = {
      body: 0x4a148c,        // Violet foncé
      bodyDark: 0x311b92,    // Violet très sombre
      tech: 0x7b1fa2,        // Violet tech
      antenna: 0x9c27b0,     // Antenne violette
      static: 0xffffff,      // Effet statique
    };

    // Corps tech
    const body = scene.add.graphics();
    body.fillStyle(colors.body);
    body.fillRoundedRect(-9, -10, 18, 20, 4);
    body.fillStyle(colors.bodyDark);
    body.fillRoundedRect(-7, -8, 14, 18, 3);
    
    // Détails tech
    body.fillStyle(colors.tech, 0.6);
    body.fillRect(-6, -6, 12, 3);
    body.fillRect(-6, 0, 12, 3);
    body.fillRect(-6, 6, 12, 3);
    
    container.add(body);
    enemyInstance.elements.mainBody = body;

    // Antenne de brouillage
    const antenna = scene.add.graphics();
    antenna.fillStyle(colors.antenna);
    antenna.fillRect(-2, -18, 4, 12);
    antenna.fillStyle(colors.static);
    antenna.fillCircle(0, -20, 2);
    
    container.add(antenna);
    enemyInstance.elements.antenna = antenna;

    // Effet statique (sera animé)
    const staticEffect = scene.add.graphics();
    staticEffect.setVisible(false);
    container.add(staticEffect);
    enemyInstance.elements.staticEffect = staticEffect;

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    // Animation de l'antenne
    if (enemyInstance.elements.antenna) {
      enemyInstance.elements.antenna.rotation = Math.sin(time * 0.02) * 0.15;
    }
    
    // Effet statique pulsant
    if (enemyInstance.elements.staticEffect) {
      enemyInstance.elements.staticEffect.clear();
      const intensity = Math.sin(time * 0.05) * 0.5 + 0.5;
      enemyInstance.elements.staticEffect.lineStyle(1, 0xffffff, intensity * 0.3);
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 15;
        const y = Math.sin(angle) * 15;
        enemyInstance.elements.staticEffect.lineBetween(0, 0, x, y);
      }
    }
  },
};

