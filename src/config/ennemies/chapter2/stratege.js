export const stratege = {
  name: "Stratège",
  speed: 45,
  hp: 790,
  reward: 28,
  playerDamage: 2,
  color: 0x2e7d32, // Vert stratégique
  damage: 50,
  attackSpeed: 1100,
  scale: 1.0,
  description: "Stratège - Renforceur d'alliés. Rôle : buff les alliés. POUVOIR SPÉCIAL : Renforce les alliés proches (rayon 1.5 cases) de +12% à toutes leurs statistiques. Très dangereux, priorité élevée !",
  // Renforce les monstres proches à 1.5 cases (+12% stats)
  buffRadius: 1.5, // En cases
  buffMultiplier: 1.12, // +12% stats

  onDraw: (scene, container, color, enemyInstance) => {
    enemyInstance.elements = {};

    const colors = {
      robe: 0x2e7d32,        // Vert stratégique
      robeDark: 0x1b5e20,    // Vert foncé
      hat: 0x1b5e20,         // Chapeau
      staff: 0x8b4513,       // Bâton
      gem: 0x00ff00,         // Gemme verte
      aura: 0x00ff00,        // Aura de buff
    };

    // Robe longue
    const robe = scene.add.graphics();
    robe.fillStyle(colors.robe);
    robe.fillRoundedRect(-10, -8, 20, 30, 4);
    robe.fillStyle(colors.robeDark);
    robe.fillRoundedRect(-8, -6, 16, 28, 3);
    
    container.add(robe);
    enemyInstance.elements.robe = robe;

    // Tête
    const head = scene.add.graphics();
    head.fillStyle(0xffdbac);
    head.fillCircle(0, -20, 7);
    
    // Chapeau de stratégie
    head.fillStyle(colors.hat);
    head.fillRoundedRect(-8, -28, 16, 10, 2);
    head.fillStyle(colors.gem);
    head.fillCircle(0, -24, 3);
    
    container.add(head);
    enemyInstance.elements.head = head;

    // Bâton de commandement
    const staff = scene.add.graphics();
    staff.fillStyle(colors.staff);
    staff.fillRect(10, -15, 3, 25);
    staff.fillStyle(colors.gem);
    staff.fillCircle(11.5, -12, 4);
    
    container.add(staff);
    enemyInstance.elements.staff = staff;

    // Aura de buff (sera visible autour des alliés)
    const aura = scene.add.graphics();
    aura.lineStyle(2, colors.aura, 0.4);
    aura.strokeCircle(0, 0, 20);
    aura.setVisible(false);
    container.add(aura);
    enemyInstance.elements.aura = aura;

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    // Animation du bâton qui bouge
    if (enemyInstance.elements.staff) {
      enemyInstance.elements.staff.rotation = Math.sin(time * 0.01) * 0.1;
    }
    
    // Aura pulsante
    if (enemyInstance.elements.aura && enemyInstance.elements.aura.visible) {
      const pulse = Math.sin(time * 0.015) * 0.1 + 1;
      enemyInstance.elements.aura.setScale(pulse);
    }
  },
};

