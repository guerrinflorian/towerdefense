export const LEVEL_4 = {
  biome: "cimetiere",
  map: [
    [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 2, 12, 12],
    [12, 12, 12, 12, 12, 12, 12, 12, 13, 13, 13, 12, 13, 12, 12],
    [12, 12, 12, 12, 12, 12, 12, 12, 13, 12, 13, 12, 13, 12, 12],
    [12, 12, 12, 12, 12, 12, 12, 12, 13, 12, 13, 13, 13, 12, 12],
    [12, 12, 12, 12, 12, 12, 12, 12, 13, 12, 12, 12, 12, 12, 12],
    [12, 12, 12, 13, 13, 13, 12, 12, 13, 12, 12, 12, 12, 12, 12],
    [12, 12, 12, 13, 12, 13, 13, 13, 13, 12, 12, 12, 12, 12, 12],
    [12, 12, 12, 13, 12, 12, 12, 12, 13, 12, 12, 12, 12, 12, 12],
    [12, 12, 12, 13, 13, 13, 12, 12, 13, 13, 12, 12, 12, 12, 12],
    [12, 12, 12, 12, 12, 13, 12, 12, 12, 13, 12, 13, 13, 13, 12],
    [12, 12, 12, 12, 12, 13, 12, 12, 12, 13, 13, 13, 12, 13, 12],
    [12, 12, 12, 12, 13, 13, 12, 12, 12, 12, 12, 12, 12, 13, 12],
    [12, 12, 13, 13, 13, 12, 12, 12, 12, 12, 12, 12, 12, 13, 13],
    [12, 12, 13, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    [12, 12, 13, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
  ],

  paths: [
    // --- CHEMIN 1 : SPAWN BAS (Sortie du tunnel y=14) ---
    [
      { x: 2, y: 14 }, // Sortie tout en bas
      { x: 2, y: 12 }, // Remonte le couloir
      { x: 4, y: 12 }, // Tourne à droite
      { x: 4, y: 11 }, // Remonte
      { x: 5, y: 11 }, // Petit crochet droite
      { x: 5, y: 8 },  // Remonte jusqu'à la boucle
      { x: 3, y: 8 },  // Va à gauche
      { x: 3, y: 5 },  // Remonte le long couloir gauche
      { x: 5, y: 5 },  // Tourne à droite
      { x: 5, y: 6 },  // Descend un peu
      { x: 8, y: 6 },  // Grande traversée horizontale
      { x: 8, y: 1 },  // Remonte vers le haut de la carte
      { x: 10, y: 1 }, // Longe le haut
      { x: 10, y: 3 }, // Descend vers le couloir intermédiaire
      { x: 12, y: 3 }, // Tourne vers la droite
      { x: 12, y: 0 }, // ARRIVÉE À LA BASE
    ],

    // --- CHEMIN 2 : SPAWN DROITE (y=12, x=14) ---
    [
      { x: 14, y: 12 }, // Spawn extrême droite
      { x: 13, y: 12 }, // Entre dans le couloir
      { x: 13, y: 9 },  // Remonte le couloir vertical droit
      { x: 11, y: 9 },  // Bifurque à gauche
      { x: 11, y: 10 }, // Petit détour bas
      { x: 9, y: 10 },  // Continue à gauche
      { x: 9, y: 8 },   // Remonte vers la jonction
      { x: 8, y: 8 },   // Rejoint le centre
      { x: 8, y: 1 },   // Remonte tout le couloir central
      { x: 10, y: 1 },  // Vers la base
      { x: 10, y: 3 },  // Crochet
      { x: 12, y: 3 },  // Alignement final
      { x: 12, y: 0 },  // ARRIVÉE À LA BASE
    ],
  ],
  

  // CONFIGURATION DES 10 VAGUES - DIFFICULTÉ "CIMETIÈRE MAUDIT"
  waves: [
    // VAGUE 1 : Échauffement bilatéral
    [
      { count: 15, type: "grunt", interval: 800, startDelay: 0 },
      { count: 15, type: "grunt", interval: 800, startDelay: 5000 },
    ],

    // VAGUE 2 : La vitesse
    [{ count: 30, type: "runner", interval: 400, startDelay: 0 }],

    // VAGUE 3 : INTRODUCTION DU SHAMAN
    [
      { count: 25, type: "grunt", interval: 600, startDelay: 0 },
      { count: 4, type: "shaman_gobelin", interval: 4000, startDelay: 5000 },
    ],

    // VAGUE 4 : Le Mur immortel
    [
      { count: 12, type: "shield", interval: 1200, startDelay: 0 },
      { count: 5, type: "shaman_gobelin", interval: 3000, startDelay: 4000 },
      { count: 20, type: "runner", interval: 400, startDelay: 12000 },
    ],

    // VAGUE 5 : Lourdeur Mécanique
    [
      { count: 8, type: "cemeteryTank", interval: 3000, startDelay: 0 },
      { count: 5, type: "tortue_dragon", interval: 4000, startDelay: 10000 },
    ],

    // VAGUE 6 : Division et Multiplication
    [
      { count: 6, type: "diviseur", interval: 4000, startDelay: 0 },
      { count: 45, type: "grunt", interval: 300, startDelay: 8000 },
      { count: 5, type: "shaman_gobelin", interval: 4000, startDelay: 10000 },
    ],

    // VAGUE 7 : L'Escouade d'Élite
    [
      { count: 6, type: "shield", interval: 1000, startDelay: 0 },
      { count: 4, type: "tortue_dragon", interval: 3000, startDelay: 2000 },
      { count: 4, type: "shaman_gobelin", interval: 3000, startDelay: 4000 },
      { count: 6, type: "cemeteryTank", interval: 2500, startDelay: 15000 },
    ],

    // VAGUE 8 : Chaos Total
    [
      { count: 70, type: "runner", interval: 250, startDelay: 0 },
      { count: 10, type: "diviseur", interval: 3500, startDelay: 5000 },
      { count: 6, type: "shaman_gobelin", interval: 4000, startDelay: 10000 },
    ],

    // VAGUE 9 : Avant la tempête
    [
      { count: 12, type: "tortue_dragon", interval: 2500, startDelay: 0 },
      { count: 12, type: "shield", interval: 1000, startDelay: 5000 },
      { count: 8, type: "shaman_gobelin", interval: 3000, startDelay: 10000 },
    ],

    // VAGUE 10 : LE SEIGNEUR DES MORTS (Boss Lvl 4 - à créer plus tard)
    [
      // L'avant-garde
      { count: 40, type: "grunt", interval: 300, startDelay: 0 },
      { count: 25, type: "runner", interval: 300, startDelay: 5000 },

      // La garde rapprochée
      { count: 10, type: "tank", interval: 2000, startDelay: 20000 },
      { count: 8, type: "shaman_gobelin", interval: 2000, startDelay: 25000 },

      // LE BOSS (à remplacer par bosslvl4 quand créé)
      { count: 1, type: "bosslvl3", interval: 10000, startDelay: 35000 },

      // Les renforts de dernière chance
      { count: 15, type: "runner", interval: 200, startDelay: 49000 },
    ],
  ],
};
