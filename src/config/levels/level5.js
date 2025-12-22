export const LEVEL_5 = {
  biome: "lava",
  startingMoney: 950,
  // TYPES DE TEXTURES (0-17) :
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
  map: [
    [16, 16, 15, 16, 16, 16, 16, 16, 16, 17, 16, 16, 16, 14, 16],
    [16, 16, 16, 16, 16, 14, 14, 14, 16, 17, 16, 16, 14, 14, 16],
    [16, 16, 16, 15, 14, 14, 16, 14, 14, 17, 16, 16, 14, 16, 16],
    [16, 16, 16, 16, 14, 16, 16, 16, 14, 14, 14, 14, 14, 16, 16],
    [16, 16, 16, 16, 14, 16, 16, 16, 16, 17, 16, 16, 16, 16, 16],
    [16, 16, 14, 14, 14, 16, 16, 16, 16, 17, 17, 17, 17, 16, 16],
    [16, 16, 14, 16, 14, 16, 16, 16, 14, 14, 14, 16, 17, 16, 16],
    [2, 14, 14, 16, 14, 14, 14, 14, 14, 16, 14, 14, 14, 14, 14],
    [16, 16, 14, 16, 14, 16, 16, 16, 14, 14, 14, 16, 17, 16, 16],
    [16, 16, 14, 14, 14, 16, 16, 16, 16, 16, 16, 16, 17, 16, 16],
    [16, 16, 16, 16, 14, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17],
    [16, 15, 16, 16, 14, 16, 16, 16, 14, 14, 14, 14, 14, 16, 17],
    [16, 16, 16, 16, 14, 14, 16, 14, 14, 16, 16, 16, 14, 16, 17],
    [16, 16, 16, 16, 16, 14, 14, 14, 16, 16, 16, 16, 14, 14, 17],
    [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 14, 17],
  ],
  

  paths: [
    // --- CHEMIN 1 : SPAWN HAUT DROITE (13, 0) ---
    // Descend par le couloir vertical, traverse le haut et rejoint l'artère centrale
    [
      { x: 13, y: 0 },  // Départ (14)
      { x: 13, y: 1 },
      { x: 12, y: 1 },
      { x: 12, y: 2 },
      { x: 12, y: 3 },
      { x: 11, y: 3 },
      { x: 10, y: 3 },
      { x: 9,  y: 3 },
      { x: 8,  y: 3 },
      { x: 8,  y: 2 },
      { x: 7,  y: 2 },
      { x: 7,  y: 1 },
      { x: 6,  y: 1 },
      { x: 5,  y: 1 },
      { x: 5,  y: 2 },
      { x: 4,  y: 2 },
      { x: 4,  y: 3 },
      { x: 4,  y: 4 },
      { x: 4,  y: 5 },
      { x: 3,  y: 5 },
      { x: 2,  y: 5 },
      { x: 2,  y: 6 },
      { x: 2,  y: 7 },
      { x: 1,  y: 7 },
      { x: 0,  y: 7 }   // BASE (2)
    ],

    // --- CHEMIN 2 : SPAWN MILIEU DROITE (14, 7) ---
    // Suit l'artère principale, mais doit dévier car il y a un mur à x=9
    [
      { x: 14, y: 7 },  // Départ (14)
      { x: 13, y: 7 },
      { x: 12, y: 7 },
      { x: 11, y: 7 },
      { x: 10, y: 7 },
      { x: 10, y: 8 },  // Contourne le mur (9,7) par le bas
      { x: 9,  y: 8 },
      { x: 8,  y: 8 },
      { x: 8,  y: 7 },
      { x: 7,  y: 7 },
      { x: 6,  y: 7 },
      { x: 5,  y: 7 },
      { x: 4,  y: 7 },
      { x: 4,  y: 8 },  // Contourne le mur (3,7) par le bas
      { x: 4,  y: 9 },
      { x: 3,  y: 9 },
      { x: 2,  y: 9 },
      { x: 2,  y: 8 },
      { x: 2,  y: 7 },
      { x: 1,  y: 7 },
      { x: 0,  y: 7 }   // BASE (2)
    ],

    // --- CHEMIN 3 : SPAWN BAS DROITE (13, 14) ---
    // Remonte par le couloir du bas et rejoint la boucle centrale
    [
      { x: 13, y: 14 }, { x: 13, y: 13 }, { x: 12, y: 13 }, { x: 12, y: 12 },
      { x: 12, y: 11 }, { x: 11, y: 11 }, { x: 10, y: 11 }, { x: 9,  y: 11 },
      { x: 8,  y: 11 }, { x: 8,  y: 12 }, { x: 7,  y: 12 }, { x: 7,  y: 13 },
      { x: 6,  y: 13 }, { x: 5,  y: 13 }, { x: 5,  y: 12 }, { x: 4,  y: 12 },
      { x: 4,  y: 11 }, { x: 4,  y: 10 }, { x: 4,  y: 9 }, { x: 3,  y: 9 },
      { x: 2,  y: 9 }, { x: 2,  y: 8 }, { x: 2,  y: 7 }, { x: 1,  y: 7 },
      { x: 0,  y: 7 } // BASE
    ]
  ],
  
  

  // CONFIGURATION DES 10 VAGUES - DIFFICULTÉ "CIMETIÈRE MAUDIT"

  waves: [
    [
      { count: 1, type: "ash_queen", interval: 850, startDelay: 0 },
      { count: 10, type: "ember_scout", interval: 420, startDelay: 4000 },
    ],
    [
      { count: 40, type: "ember_scout", interval: 330, startDelay: 0 },
      { count: 12, type: "scoria_soldier", interval: 750, startDelay: 6000 },
    ],
    [
      { count: 8, type: "obsidian_bastion", interval: 2500, startDelay: 0 },
      { count: 20, type: "scoria_soldier", interval: 700, startDelay: 4000 },
      { count: 4, type: "infernal_banner", interval: 2400, startDelay: 7000 },
    ],
    [
      { count: 28, type: "scoria_soldier", interval: 650, startDelay: 0 },
      { count: 6, type: "infernal_banner", interval: 2200, startDelay: 5000 },
      { count: 14, type: "ember_scout", interval: 380, startDelay: 8000 },
    ],
    [
      { count: 6, type: "obsidian_bastion", interval: 2400, startDelay: 0 },
      { count: 4, type: "blackflame_sorcerer", interval: 3600, startDelay: 7000 },
      { count: 18, type: "scoria_soldier", interval: 700, startDelay: 13000 },
    ],
    [
      { count: 18, type: "ember_scout", interval: 340, startDelay: 0 },
      { count: 10, type: "obsidian_bastion", interval: 2100, startDelay: 6000 },
      { count: 5, type: "infernal_banner", interval: 2300, startDelay: 8000 },
    ],
    [
      { count: 1, type: "ash_queen", interval: 8000, startDelay: 0 },
      { count: 30, type: "scoria_soldier", interval: 620, startDelay: 5000 },
      { count: 10, type: "ember_scout", interval: 420, startDelay: 8000 },
      { count: 6, type: "blackflame_sorcerer", interval: 3200, startDelay: 12000 },
    ],
    [
      { count: 1, type: "ash_queen", interval: 8000, startDelay: 0 },
      { count: 12, type: "infernal_banner", interval: 2200, startDelay: 4000 },
      { count: 16, type: "obsidian_bastion", interval: 2200, startDelay: 5000 },
      { count: 24, type: "ember_scout", interval: 380, startDelay: 11000 },
    ],
    [
      { count: 60, type: "ember_scout", interval: 260, startDelay: 0 },
      { count: 10, type: "blackflame_sorcerer", interval: 3000, startDelay: 5000 },
      { count: 12, type: "obsidian_bastion", interval: 2200, startDelay: 9000 },
      { count: 6, type: "infernal_banner", interval: 2200, startDelay: 14000 },
    ],
    [
      { count: 20, type: "scoria_soldier", interval: 500, startDelay: 0 },
      { count: 10, type: "obsidian_bastion", interval: 2000, startDelay: 4000 },
      { count: 8, type: "blackflame_sorcerer", interval: 2500, startDelay: 6000 },
      { count: 6, type: "infernal_banner", interval: 2400, startDelay: 7000 },
      { count: 2, type: "ash_queen", interval: 8000, startDelay: 12000 },
      { count: 1, type: "bosslvl5", interval: 12000, startDelay: 30000 },
    ],
  ],
};
