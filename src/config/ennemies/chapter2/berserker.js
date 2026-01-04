export const berserker = {
  name: "Berserker",
  speed: 55,
  hp: 500, // HP augmenté pour qu'il survive plus longtemps
  reward: 35,
  playerDamage: 2,
  color: 0x8b0000, // Rouge foncé
  damage: 30, // Dégâts de base augmentés
  attackSpeed: 1000,
  scale: 1.1,
  description: "Berserker - Guerrier enragé. Rôle : devient plus fort en perdant des PV. POUVOIR SPÉCIAL : Plus il perd de PV, plus ses dégâts augmentent. Régénère aussi 1% de ses PV max par seconde. Très dangereux !",
  // Plus il perd de PV, plus il inflige de dégâts
  berserkerMode: true,
  // Gagne 1% de PV max toutes les secondes
  hpGrowthEnabled: true,
  hpGrowthInterval: 1000, // 1 seconde
  hpGrowthPercent: 0.01, // 1% par seconde

  onDraw: (scene, container, color, enemyInstance) => {
    enemyInstance.elements = {};

    const colors = {
      bodyMain: 0x8b0000,      // Rouge foncé
      bodyDark: 0x5a0000,     // Rouge très sombre
      bodyLight: 0xcc0000,    // Rouge vif
      eyes: 0xff0000,         // Yeux rouges brillants
      weapon: 0x333333,       // Arme sombre
      highlight: 0xff4444,    // Reflet
      aura: 0xff0000,         // Aura de rage
    };

    // Corps massif et musclé
    const body = scene.add.graphics();
    
    // Torse large
    body.fillStyle(colors.bodyMain);
    body.fillRoundedRect(-12, -14, 24, 28, 6);
    body.fillStyle(colors.bodyDark);
    body.fillRoundedRect(-10, -12, 20, 24, 5);
    
    // Muscles saillants
    body.fillStyle(colors.bodyLight);
    body.fillEllipse(-8, -8, 6, 8);
    body.fillEllipse(8, -8, 6, 8);
    body.fillEllipse(0, 2, 8, 6);
    
    // Tête
    body.fillStyle(colors.bodyMain);
    body.fillCircle(0, -22, 10);
    body.fillStyle(colors.bodyDark);
    body.fillCircle(0, -22, 8);
    
    // Yeux rouges brillants
    body.fillStyle(colors.eyes, 0.9);
    body.fillCircle(-4, -24, 3);
    body.fillCircle(4, -24, 3);
    
    // Bouche ouverte (cri de rage)
    body.fillStyle(0x000000);
    body.fillEllipse(0, -20, 6, 4);
    
    // Bras musclés avec armes
    body.fillStyle(colors.bodyMain);
    body.fillRoundedRect(-16, -6, 8, 20, 3);
    body.fillRoundedRect(8, -6, 8, 20, 3);
    
    // Armes (haches)
    body.fillStyle(colors.weapon);
    body.fillRect(-18, 8, 12, 3);
    body.fillRect(6, 8, 12, 3);
    body.fillStyle(colors.bodyLight);
    body.fillTriangle(-18, 8, -12, 8, -15, 2);
    body.fillTriangle(18, 8, 12, 8, 15, 2);
    
    // Jambes puissantes
    body.fillStyle(colors.bodyMain);
    body.fillRoundedRect(-8, 12, 6, 18, 3);
    body.fillRoundedRect(2, 12, 6, 18, 3);
    
    container.add(body);
    enemyInstance.elements.mainBody = body;

    // Aura de rage (sera animée)
    const aura = scene.add.graphics();
    aura.lineStyle(2, colors.aura, 0.5);
    aura.strokeCircle(0, 0, 25);
    aura.setVisible(false);
    container.add(aura);
    enemyInstance.elements.aura = aura;

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    // Animation de rage qui s'intensifie avec les PV perdus
    const hpPercent = enemyInstance.hp / enemyInstance.maxHp;
    const rageIntensity = 1 - hpPercent; // Plus il est blessé, plus c'est intense
    
    if (rageIntensity > 0.3) {
      enemyInstance.elements.aura.setVisible(true);
      enemyInstance.elements.aura.clear();
      enemyInstance.elements.aura.lineStyle(2 + rageIntensity * 3, 0xff0000, 0.3 + rageIntensity * 0.4);
      enemyInstance.elements.aura.strokeCircle(0, 0, 25 + rageIntensity * 10);
      
      // Pulsation de l'aura
      const pulse = Math.sin(time * 0.015) * 0.1 + 1;
      enemyInstance.elements.aura.setScale(pulse);
    } else {
      enemyInstance.elements.aura.setVisible(false);
    }

    // Tremblement de rage
    if (rageIntensity > 0.5) {
      enemyInstance.elements.mainBody.x = Math.sin(time * 0.02) * rageIntensity * 2;
      enemyInstance.elements.mainBody.y = Math.cos(time * 0.025) * rageIntensity * 1.5;
    }
  },
};

