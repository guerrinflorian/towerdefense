export const LEVEL_6 = {
  biome: "rose",
  startingMoney: 1850,
  // TYPES DE TEXTURES (0-18) :
  // 0 = Herbe (sol constructible)
  // 1 = Chemin (passage des ennemis)
  // 2 = Base (destination finale)
  // 3 = Eau (décor)
  // 4 = Pont (chemin sur l'eau)
  // 5 = Rocher/Décor (montagne, non constructible)
  // 6 = Sol Neige (biome glace, constructible)
  // 7 = Chemin Glacé (biome glace, passage des ennemis)
  // 8 = Eau Glacée (biome glace, décor)
  // 9 = Montagne Neige (biome glace, décor)
  // 10 = Sable (biome désert, constructible)
  // 11 = Rocher de Sable (biome désert, décor)
  // 12 = Sol Cimetière (biome cimetière, constructible)
  // 13 = Chemin Cimetière (biome cimetière, passage des ennemis)
  // 14 = Chemin Lave Noire (biome volcan, passage des ennemis)
  // 15 = Crevasses Volcaniques (biome volcan, décor)
  // 16 = Sol Roche Cramée (biome volcan, constructible)
  // 17 = Lave qui Coule (biome volcan, décor)
  // 18 = Sol Rose (biome rose, constructible)
  // 19 = Chemin Rose Quartz Royale (biome rose, passage des ennemis)
  map: [
    [18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 2, 18],
    [18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 18],
    [18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 18], // Départ
    [18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 18],
    [18, 18, 18, 18, 18, 19, 19, 19, 18, 18, 19, 19, 19, 19, 18],
    [18, 18, 18, 18, 18, 19, 18, 19, 19, 19, 19, 18, 18, 18, 18],
    [18, 18, 18, 18, 18, 19, 18, 18, 18, 18, 18, 18, 18, 18, 18],
    [18, 18, 19, 19, 19, 19, 18, 18, 18, 18, 18, 18, 18, 18, 18],
    [19, 19, 19, 18, 18, 19, 18, 18, 18, 18, 18, 18, 18, 18, 18],
    [18, 18, 19, 18, 18, 19, 18, 19, 19, 19, 19, 18, 18, 18, 18],
    [18, 18, 19, 18, 18, 19, 19, 19, 18, 18, 19, 19, 19, 19, 2],
    [18, 18, 19, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
    [18, 18, 19, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
    [18, 18, 19, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
    [18, 18, 19, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18], // Fin
  ],

  // LISTE DES CHEMINS POSSIBLES
  paths: [
    // PATH 1 : part de la gauche -> finit à la base du haut (2) en (13, 0)
    [
      { x: 0,  y: 8 },  // Départ gauche (route touche le bord)
      { x: 2,  y: 8 },
      { x: 2,  y: 7 },
      { x: 5,  y: 7 },
      { x: 5,  y: 4 },
      { x: 7,  y: 4 },
      { x: 7,  y: 5 },
      { x: 10, y: 5 },
      { x: 10, y: 4 },
      { x: 13, y: 4 },
      { x: 13, y: 0 }, // Base du haut (2)
    ],
  
    // PATH 2 : part du bas gauche -> finit à la base en bas à droite (2) en (14, 10)
    [
      { x: 2,  y: 14 }, // Départ bas-gauche (route en bas)
      { x: 2,  y: 7 },
      { x: 5,  y: 7 },
      { x: 5,  y: 10 },
      { x: 7,  y: 10 },
      { x: 7,  y: 9 },
      { x: 10, y: 9 },
      { x: 10, y: 10 },
      { x: 14, y: 10 }, // Base bas droite (2)
    ],
  ],
  

  // CONFIGURATION DES VAGUES - NIVEAU 6 CHAPITRE 2 (9 VAGUES DIFFICILES MAIS FAISABLES)
  waves: [
    // VAGUE 1 : Introduction douce
    [
      { count: 22, type: "pink_heart_grunt", interval: 700, startDelay: 0 },
      { count: 1, type: "pink_slime", interval: 1200, startDelay: 4000 },
      { count: 8, type: "pink_marshmallow_runner", interval: 500, startDelay: 10000 },
    ],

    // VAGUE 2 : Premiers défis
    [
      { count: 12, type: "pink_heart_grunt", interval: 600, startDelay: 0 },
      { count: 2, type: "pink_phase_ghost", interval: 900, startDelay: 3000 },
      { count: 8, type: "pink_marshmallow_runner", interval: 450, startDelay: 7000 },
      { count: 1, type: "pink_healer", interval: 2000, startDelay: 10000 },
    ],

    // VAGUE 3 : Montée en puissance
    [
      { count: 18, type: "pink_heart_grunt", interval: 550, startDelay: 0 },
      { count: 3, type: "pink_slime", interval: 1000, startDelay: 2000 },
      { count: 2, type: "pink_phase_ghost", interval: 800, startDelay: 5000 },
      { count: 12, type: "pink_marshmallow_runner", interval: 400, startDelay: 9000 },
      { count: 1, type: "pink_bear_tank", interval: 3500, startDelay: 12000 },
    ],

    // VAGUE 4 : Mixte intensifié
    [
      { count: 25, type: "pink_heart_grunt", interval: 500, startDelay: 0 },
      { count: 8, type: "pink_slime", interval: 900, startDelay: 2500 },
      { count: 5, type: "pink_phase_ghost", interval: 700, startDelay: 4000 },
      { count: 15, type: "pink_marshmallow_runner", interval: 380, startDelay: 8000 },
      { count: 2, type: "pink_healer", interval: 2500, startDelay: 12000 },
      { count: 2, type: "pink_bear_tank", interval: 3200, startDelay: 15000 },
    ],

    // VAGUE 5 : Défense renforcée
    [
      { count: 30, type: "pink_heart_grunt", interval: 450, startDelay: 0 },
      { count: 10, type: "pink_slime", interval: 850, startDelay: 2000 },
      { count: 7, type: "pink_phase_ghost", interval: 650, startDelay: 4000 },
      { count: 6, type: "shield", interval: 1500, startDelay: 7000 },
      { count: 18, type: "pink_marshmallow_runner", interval: 350, startDelay: 10000 },
      { count: 3, type: "pink_bear_tank", interval: 3000, startDelay: 14000 },
    ],

    // VAGUE 6 : Assaut coordonné
    [
      { count: 35, type: "pink_heart_grunt", interval: 420, startDelay: 0 },
      { count: 12, type: "pink_slime", interval: 800, startDelay: 2000 },
      { count: 10, type: "pink_phase_ghost", interval: 600, startDelay: 4000 },
      { count: 3, type: "pink_healer", interval: 3000, startDelay: 6000 },
      { count: 20, type: "pink_marshmallow_runner", interval: 330, startDelay: 9000 },
      { count: 3, type: "pink_bear_tank", interval: 2800, startDelay: 13000 },
    ],

    // VAGUE 7 : Préparation finale
    [
      { count: 40, type: "pink_heart_grunt", interval: 400, startDelay: 0 },
      { count: 15, type: "pink_slime", interval: 750, startDelay: 1500 },
      { count: 14, type: "pink_phase_ghost", interval: 550, startDelay: 3500 },
      { count: 8, type: "shield", interval: 1200, startDelay: 6000 },
      { count: 25, type: "pink_marshmallow_runner", interval: 300, startDelay: 8000 },
      { count: 4, type: "pink_healer", interval: 2800, startDelay: 11000 },
      { count: 5, type: "pink_bear_tank", interval: 2600, startDelay: 15000 },
    ],

    // VAGUE 8 : Avant le boss
    [
      { count: 45, type: "pink_heart_grunt", interval: 380, startDelay: 0 },
      { count: 18, type: "pink_slime", interval: 700, startDelay: 1500 },
      { count: 16, type: "pink_phase_ghost", interval: 500, startDelay: 3000 },
      { count: 10, type: "shield", interval: 1100, startDelay: 5500 },
      { count: 30, type: "pink_marshmallow_runner", interval: 280, startDelay: 7000 },
      { count: 5, type: "pink_healer", interval: 2600, startDelay: 10000 },
      { count: 6, type: "pink_bear_tank", interval: 2400, startDelay: 14000 },
    ],

    // VAGUE 9 : BOSS FINAL - LA REINE DE VÉLORIA
    [
      { count: 50, type: "pink_heart_grunt", interval: 350, startDelay: 0 },
      { count: 20, type: "pink_slime", interval: 650, startDelay: 1000 },
      { count: 18, type: "pink_phase_ghost", interval: 450, startDelay: 3000 },
      { count: 12, type: "shield", interval: 1000, startDelay: 5000 },
      { count: 35, type: "pink_marshmallow_runner", interval: 250, startDelay: 6000 },
      { count: 6, type: "pink_healer", interval: 2400, startDelay: 10000 },
      { count: 10, type: "pink_bear_tank", interval: 2200, startDelay: 15000 },
      { count: 1, type: "bosslvl6", interval: 10000, startDelay: 27000 },
    ],
  ],
};

