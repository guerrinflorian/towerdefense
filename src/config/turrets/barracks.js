export const barracks = {
  key: "barracks",
  name: "Caserne",
  cost: 180,
  range: 0, // Pas de portée de tir
  damage: 0, // Pas de dégâts directs
  rate: 0, // Pas de tir
  color: 0x8b4513, // Marron
  maxLevel: 3,
  
  // Nombre de soldats par niveau
  soldiersCount: [2, 3, 4],
  
  // Temps de respawn en millisecondes
  respawnTime: [12000, 10000, 8000],
  
  // Vie des soldats par niveau
  soldierHp: [100, 120, 150],

  // --- DESSIN ÉVOLUTIF (Bâtiment militaire) ---
  onDrawBarrel: (scene, container, color, turret) => {
    const g = scene.add.graphics();
    const level = turret.level || 1;

    // Palette de couleurs
    const woodBrown = 0x8b4513;
    const darkWood = 0x654321;
    const stoneGray = 0x696969;
    const darkStone = 0x404040;
    const metalGray = 0x708090;
    const flagRed = 0xcc0000;
    const flagBlue = 0x0000cc;

    if (level === 1) {
      // === NIVEAU 1 : Baraque Simple ===
      // Base en bois
      g.fillStyle(woodBrown);
      g.fillRect(-20, -20, 40, 40);
      g.lineStyle(2, darkWood);
      g.strokeRect(-20, -20, 40, 40);
      
      // Toit
      g.fillStyle(darkWood);
      g.fillTriangle(-22, -20, 0, -30, 22, -20);
      g.lineStyle(2, 0x000000);
      g.strokeTriangle(-22, -20, 0, -30, 22, -20);
      
      // Porte
      g.fillStyle(0x000000);
      g.fillRect(-6, 0, 12, 20);
      g.lineStyle(1, darkWood);
      g.strokeRect(-6, 0, 12, 20);
      
      // Fenêtre
      g.fillStyle(0xffffaa, 0.8);
      g.fillRect(-12, -12, 8, 8);
      g.fillRect(4, -12, 8, 8);
      
    } else if (level === 2) {
      // === NIVEAU 2 : Caserne Renforcée ===
      // Base en pierre
      g.fillStyle(stoneGray);
      g.fillRect(-24, -24, 48, 48);
      g.lineStyle(2, darkStone);
      g.strokeRect(-24, -24, 48, 48);
      
      // Toit plus imposant
      g.fillStyle(darkStone);
      g.fillTriangle(-26, -24, 0, -36, 26, -24);
      g.lineStyle(3, 0x000000);
      g.strokeTriangle(-26, -24, 0, -36, 26, -24);
      
      // Porte renforcée
      g.fillStyle(0x000000);
      g.fillRect(-8, 2, 16, 24);
      g.lineStyle(2, metalGray);
      g.strokeRect(-8, 2, 16, 24);
      
      // Fenêtres avec barreaux
      g.fillStyle(0xffffaa, 0.8);
      g.fillRect(-14, -14, 10, 10);
      g.fillRect(4, -14, 10, 10);
      g.lineStyle(1, 0x000000);
      g.strokeRect(-14, -14, 10, 10);
      g.strokeRect(4, -14, 10, 10);
      
      // Barreaux
      g.lineStyle(1, 0x000000);
      g.lineBetween(-14, -9, -4, -9);
      g.lineBetween(-9, -14, -9, -4);
      g.lineBetween(4, -9, 14, -9);
      g.lineBetween(9, -14, 9, -4);
      
      // Drapeau simple
      g.fillStyle(flagRed);
      g.fillRect(20, -30, 4, 12);
      
    } else {
      // === NIVEAU 3 : Forteresse ===
      // Base massive en pierre
      g.fillStyle(stoneGray);
      g.fillRect(-28, -28, 56, 56);
      g.lineStyle(3, darkStone);
      g.strokeRect(-28, -28, 56, 56);
      
      // Détails de pierre
      g.lineStyle(1, darkStone);
      for (let i = -24; i < 24; i += 8) {
        g.lineBetween(i, -28, i, 28);
      }
      
      // Toit imposant avec créneaux
      g.fillStyle(darkStone);
      g.fillRect(-30, -40, 60, 12);
      g.fillStyle(0x000000);
      // Créneaux
      for (let i = -28; i < 28; i += 8) {
        g.fillRect(i, -40, 4, 4);
      }
      
      // Porte massive
      g.fillStyle(0x000000);
      g.fillRect(-10, 4, 20, 28);
      g.lineStyle(3, metalGray);
      g.strokeRect(-10, 4, 20, 28);
      // Clous
      g.fillStyle(metalGray);
      g.fillCircle(-5, 10, 2);
      g.fillCircle(5, 10, 2);
      g.fillCircle(-5, 20, 2);
      g.fillCircle(5, 20, 2);
      
      // Fenêtres avec barreaux
      g.fillStyle(0xffffaa, 0.8);
      g.fillRect(-16, -16, 12, 12);
      g.fillRect(4, -16, 12, 12);
      g.lineStyle(2, 0x000000);
      g.strokeRect(-16, -16, 12, 12);
      g.strokeRect(4, -16, 12, 12);
      
      // Barreaux épais
      g.lineStyle(2, 0x000000);
      g.lineBetween(-16, -11, -4, -11);
      g.lineBetween(-10, -16, -10, -4);
      g.lineBetween(4, -11, 16, -11);
      g.lineBetween(10, -16, 10, -4);
      
      // Drapeau avec mât
      g.fillStyle(0x654321);
      g.fillRect(24, -42, 3, 20);
      g.fillStyle(flagRed);
      g.fillRect(27, -40, 8, 6);
      g.fillStyle(flagBlue);
      g.fillRect(27, -34, 8, 6);
      
      // Tourelles latérales
      g.fillStyle(stoneGray);
      g.fillCircle(-26, -26, 6);
      g.fillCircle(26, -26, 6);
      g.lineStyle(2, darkStone);
      g.strokeCircle(-26, -26, 6);
      g.strokeCircle(26, -26, 6);
    }

    // Pivot central
    g.fillStyle(0x000000);
    g.fillCircle(0, 0, 3);

    container.add(g);

    // --- INDICATEUR DE NIVEAU ---
    const badge = scene.add.container(-20, 20);
    const badgeBg = scene.add.rectangle(0, 0, 24, 14, 0x000000, 0.7);
    const badgeColor = level === 3 ? 0xffd700 : level === 2 ? 0x00ffff : 0xffffff;
    badgeBg.setStrokeStyle(1, badgeColor);
    const lvlText = scene.add
      .text(0, 0, `Lv.${level}`, {
        fontSize: "10px",
        fontFamily: "Arial",
        color: level === 3 ? "#ffd700" : level === 2 ? "#00ffff" : "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    badge.add([badgeBg, lvlText]);
    container.add(badge);
  },

  // --- LOGIQUE SPÉCIALE : Pas de tir, mais gestion des soldats ---
  onFire: null, // Pas de tir

  // Fonction appelée lors de la création du bâtiment
  onBuild: (scene, barracks) => {
    // Cette fonction sera appelée depuis GameScene après la création
    // Les soldats seront créés et déployés automatiquement
  },
};
