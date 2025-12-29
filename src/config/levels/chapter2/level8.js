export const LEVEL_8 = {
  biome: "laboratory",
  startingMoney: 1300,
  // TYPES DE TEXTURES (0-23) :
  // 0 = Herbe (sol constructible)
  // 1 = Chemin (passage des ennemis)
  // 2 = Base (destination finale)
  // 22 = Sol Laboratoire (biome laboratory, constructible)
  // 23 = Chemin Laboratoire (biome laboratory, passage des ennemis)
  map: [
    [22, 22, 22, 22, 23, 23, 23, 23, 22, 23, 23, 23, 23, 22, 22],
    [22, 22, 22, 23, 23, 22, 22, 23, 23, 23, 22, 22, 23, 22, 22],
    [22, 22, 22, 23, 22, 22, 22, 22, 22, 23, 22, 22, 23, 22, 22], // Départ
    [22, 22, 23, 23, 22, 22, 22, 22, 22, 23, 22, 22, 23, 23, 22],
    [22, 23, 23, 22, 22, 22, 22, 22, 22, 23, 22, 22, 22, 23, 22],
    [22, 23, 22, 22, 23, 23, 23, 23, 22, 23, 22, 22, 22, 23,  2],
    [22, 23, 22, 22, 23, 22, 22, 23, 22, 23, 23, 22, 22, 22, 22],
    [22, 23, 22, 22, 23, 22, 22, 23, 22, 22, 23, 23, 22, 22, 22],
    [22, 23, 22, 22, 23, 22, 22, 23, 22, 22, 22, 23, 22, 22, 22],
    [22, 23, 22, 22, 23, 22, 22, 23, 22, 22, 22, 23, 23, 22, 22],
    [22, 23, 23, 23, 23, 22, 22, 23, 22, 22, 22, 22, 23, 23,  2],
    [22, 22, 22, 22, 22, 22, 22, 23, 22, 22, 22, 22, 22, 22, 22],
    [22, 22, 22, 22, 22, 22, 22, 23, 22, 22, 22, 22, 22, 22, 22],
    [22, 22, 22, 22, 22, 22, 22, 23, 22, 22, 22, 22, 22, 22, 22],
    [22, 22, 22, 22, 22, 22, 22, 23, 22, 22, 22, 22, 22, 22, 22], // Fin
  ],

  // LISTE DES CHEMINS POSSIBLES
  paths: [
    // PATH 1 : bas-milieu -> base droite (14,10)
    [
      { x: 7, y: 14 },
      { x: 7, y: 13 },
      { x: 7, y: 12 },
      { x: 7, y: 11 },
      { x: 7, y: 10 },
      { x: 7, y: 9 },
      { x: 7, y: 8 },
      { x: 7, y: 7 },
      { x: 7, y: 6 },
      { x: 7, y: 5 },
      { x: 6, y: 5 },
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 4, y: 6 },
      { x: 4, y: 7 },
      { x: 4, y: 8 },
      { x: 4, y: 9 },
      { x: 4, y: 10 },
      { x: 3, y: 10 },
      { x: 2, y: 10 },
      { x: 1, y: 10 },
      { x: 1, y: 9 },
      { x: 1, y: 8 },
      { x: 1, y: 7 },
      { x: 1, y: 6 },
      { x: 1, y: 5 },
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 3, y: 2 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 6, y: 0 },
      { x: 7, y: 0 },
      { x: 7, y: 1 },
      { x: 8, y: 1 },
      { x: 9, y: 1 },
      { x: 9, y: 2 },
      { x: 9, y: 3 },
      { x: 9, y: 4 },
      { x: 9, y: 5 },
      { x: 9, y: 6 },
      { x: 10, y: 6 },
      { x: 10, y: 7 },
      { x: 11, y: 7 },
      { x: 11, y: 8 },
      { x: 11, y: 9 },
      { x: 12, y: 9 },
      { x: 12, y: 10 },
      { x: 13, y: 10 },
      { x: 14, y: 10 }, // 2
    ],
  
    // PATH 2 : bas-milieu -> base droite (14,5)
    [
      { x: 7, y: 14 },
      { x: 7, y: 13 },
      { x: 7, y: 12 },
      { x: 7, y: 11 },
      { x: 7, y: 10 },
      { x: 7, y: 9 },
      { x: 7, y: 8 },
      { x: 7, y: 7 },
      { x: 7, y: 6 },
      { x: 7, y: 5 },
      { x: 6, y: 5 },
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 4, y: 6 },
      { x: 4, y: 7 },
      { x: 4, y: 8 },
      { x: 4, y: 9 },
      { x: 4, y: 10 },
      { x: 3, y: 10 },
      { x: 2, y: 10 },
      { x: 1, y: 10 },
      { x: 1, y: 9 },
      { x: 1, y: 8 },
      { x: 1, y: 7 },
      { x: 1, y: 6 },
      { x: 1, y: 5 },
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 3, y: 2 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 6, y: 0 },
      { x: 7, y: 0 },
      { x: 7, y: 1 },
      { x: 8, y: 1 },
      { x: 9, y: 1 },
      { x: 9, y: 0 },
      { x: 10, y: 0 },
      { x: 11, y: 0 },
      { x: 12, y: 0 },
      { x: 12, y: 1 },
      { x: 12, y: 2 },
      { x: 12, y: 3 },
      { x: 13, y: 3 },
      { x: 13, y: 4 },
      { x: 13, y: 5 },
      { x: 14, y: 5 }, // 2
    ],
  ],
  

  // CONFIGURATION DES VAGUES - NIVEAU 8 CHAPITRE 2 (Criard, Stratège, Brouilleur)
  waves: [
    // VAGUE 1 : Introduction
    [
      { count: 22, type: "grunt", interval: 600, startDelay: 0 },
      { count: 1, type: "tortue_dragon", interval: 600, startDelay: 2000 }, 
      { count: 12, type: "runner", interval: 450, startDelay: 5000 },

    ],

    // VAGUE 2 : Premiers Criards
    [
      { count: 18, type: "grunt", interval: 550, startDelay: 0 },
      { count: 3, type: "criard", interval: 2500, startDelay: 3000 },
      { count: 15, type: "runner", interval: 400, startDelay: 8000 },
    ],

    // VAGUE 3 : Premiers Stratèges
    [
      { count: 20, type: "grunt", interval: 500, startDelay: 0 },
      { count: 2, type: "stratege", interval: 3000, startDelay: 2000 },
      { count: 1, type: "tortue_dragon", interval: 600, startDelay: 4000 }, 
      { count: 18, type: "runner", interval: 380, startDelay: 7000 },
    ],

    // VAGUE 4 : Premiers Brouilleurs
    [
      { count: 25, type: "grunt", interval: 480, startDelay: 0 },
      { count: 3, type: "brouilleur", interval: 2200, startDelay: 2500 },
      { count: 20, type: "runner", interval: 350, startDelay: 10000 },
    ],

    // VAGUE 5 : Mix des nouveaux monstres
    [
      { count: 30, type: "grunt", interval: 450, startDelay: 0 },
      { count: 4, type: "criard", interval: 2000, startDelay: 2000 },
      { count: 3, type: "stratege", interval: 2800, startDelay: 5000 },
      { count: 4, type: "brouilleur", interval: 2000, startDelay: 8000 },
      { count: 22, type: "runner", interval: 330, startDelay: 12000 },
    ],

    // VAGUE 6 : Intensification
    [
      { count: 35, type: "grunt", interval: 420, startDelay: 0 },
      { count: 5, type: "criard", interval: 1800, startDelay: 1500 },
      { count: 4, type: "stratege", interval: 2600, startDelay: 4500 },
      { count: 5, type: "brouilleur", interval: 1800, startDelay: 8000 },
      { count: 4, type: "shaman_gobelin", interval: 2400, startDelay: 10000 },
      { count: 25, type: "runner", interval: 300, startDelay: 12000 },
      { count: 3, type: "tank", interval: 3000, startDelay: 15000 },
    ],

    // VAGUE 7 : Assaut coordonné
    [
      { count: 40, type: "grunt", interval: 400, startDelay: 0 },
      { count: 6, type: "criard", interval: 1600, startDelay: 1000 },
      { count: 5, type: "stratege", interval: 2400, startDelay: 4000 },
      { count: 6, type: "brouilleur", interval: 1600, startDelay: 7000 },
      { count: 5, type: "shaman_gobelin", interval: 2300, startDelay: 9000 },
      { count: 28, type: "runner", interval: 280, startDelay: 10000 },
      { count: 3, type: "slime", interval: 2280, startDelay: 5000 },
      { count: 6, type: "tank", interval: 2800, startDelay: 14000 },
    ],

    // VAGUE 8 : Avant le boss
    [
      { count: 45, type: "grunt", interval: 380, startDelay: 0 },
      { count: 8, type: "criard", interval: 1500, startDelay: 1000 },
      { count: 6, type: "stratege", interval: 2200, startDelay: 3500 },
      { count: 8, type: "brouilleur", interval: 1500, startDelay: 6000 },
      { count: 6, type: "shaman_gobelin", interval: 2200, startDelay: 8000 },
      { count: 32, type: "runner", interval: 250, startDelay: 9000 },
      { count: 10, type: "tank", interval: 2600, startDelay: 13000 },
    ],

    // VAGUE 9 : BOSS FINAL
    [
      { count: 50, type: "grunt", interval: 350, startDelay: 0 },
      { count: 10, type: "criard", interval: 1400, startDelay: 1000 },
      { count: 8, type: "stratege", interval: 2000, startDelay: 3000 },
      { count: 10, type: "brouilleur", interval: 1400, startDelay: 5000 },
      { count: 8, type: "shaman_gobelin", interval: 2100, startDelay: 7000 },
      { count: 38, type: "runner", interval: 220, startDelay: 8000 },
      { count: 10, type: "tank", interval: 2400, startDelay: 12000 },
      { count: 4, type: "vampire", interval: 1700, startDelay: 2500 },
      { count: 2, type: "ash_queen", interval: 8280, startDelay: 4000 },
      { count: 1, type: "bosslvl8_1", interval: 10000, startDelay: 25000 },
    ],
  ],
};

