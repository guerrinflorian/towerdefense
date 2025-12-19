export const LEVEL_1 = {
  // 0=Herbe, 1=Chemin, 2=Base, 3=Eau, 4=Pont
  map: [
    [1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3], // y=0  : Départ
    [0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3],
    [0, 0, 1, 4, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 3], // y=2  : Pont du haut (x=3)
    [0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3], // Bifurcation (x=2, y=2)
    [5, 0, 1, 3, 0, 5, 5, 5, 0, 0, 1, 0, 0, 0, 3],
    [0, 0, 1, 3, 0, 5, 5, 5, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 3, 0, 5, 5, 5, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 4, 1, 1, 1, 0, 0, 0, 1, 0, 0, 3, 0], // y=8  : Pont du bas (x=3)
    [0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 1, 0, 3, 3, 3],
    [0, 0, 0, 3, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 3], // Jonction (x=10, y=10)
    [0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
    [3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2], // Fin
  ],

  // LISTE DES CHEMINS POSSIBLES (paths au pluriel)
  paths: [
    // CHEMIN A : Passe par le pont du HAUT
    [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 2 }, // Avant pont
      { x: 10, y: 2 }, // Traverse et va à droite
      { x: 10, y: 10 }, // Descend vers jonction
      { x: 10, y: 12 },
      { x: 13, y: 12 },
      { x: 13, y: 13 },
      { x: 13, y: 14 },
      { x: 14, y: 14 }, // Fin
    ],
    // CHEMIN B : Passe par le pont du BAS
    [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 8 }, // Descend avant la rivière
      { x: 6, y: 8 },
      { x: 6, y: 10 }, // Traverse et zig-zag
      { x: 10, y: 10 }, // Rejoins la jonction
      { x: 10, y: 12 },
      { x: 13, y: 12 },
      { x: 13, y: 13 },
      { x: 13, y: 14 },
      { x: 14, y: 14 }, // Fin
    ],
  ],

  waves: [
    // VAGUE 1 : Soldats (La seconde escouade arrive après 10 secondes)
    [
      { count: 22, type: "grunt", interval: 1000, startDelay: 0 },
      { count: 15, type: "grunt", interval: 1000, startDelay: 10000 }, // Arrivent quand les premiers sont loin
    ],

    // VAGUE 2 : Runners (Rush immédiat)
    [{ count: 21, type: "runner", interval: 450, startDelay: 0 }],

    // VAGUE 3 : Mixte (Chair à canon d'abord, Boucliers ensuite, Runners en traître)
    [
      { count: 12, type: "grunt", interval: 600, startDelay: 0 }, // 1. D'abord la masse
      { count: 6, type: "shield", interval: 1500, startDelay: 4000 }, // 2. Les tanks absorbent les coups
      { count: 10, type: "runner", interval: 800, startDelay: 12000 }, // 3. Les runners profitent du chaos à 12s
    ],

    // VAGUE 4 : Tank (Escorte progressive)
    [
      { count: 8, type: "grunt", interval: 600, startDelay: 0 }, // Eclaireurs
      { count: 20, type: "runner", interval: 400, startDelay: 5000 }, // Rush rapide pour distraire
      { count: 4, type: "shield", interval: 1500, startDelay: 15000 }, // Protection lourde
      { count: 4, type: "tank", interval: 4000, startDelay: 25000 }, // Les Boss arrivent à 25s
    ],

    // VAGUE 5 : Invasion (Longue bataille)
    [
      { count: 60, type: "grunt", interval: 500, startDelay: 0 }, // Flux continu dès le début
      { count: 10, type: "runner", interval: 400, startDelay: 8000 }, // Vague rapide à 10s
      { count: 6, type: "shield", interval: 1500, startDelay: 18000 }, // Renforts blindés à 20s
      { count: 7, type: "tank", interval: 4000, startDelay: 30000 }, // L'artillerie lourde à 40s
    ],

    // VAGUE 6 : BOSS (Le Final)
    [
      { count: 60, type: "grunt", interval: 700, startDelay: 0 }, // Ambiance de fond
      { count: 30, type: "runner", interval: 1500, startDelay: 12000 }, // Harcèlement constant
      { count: 6, type: "tank", interval: 5000, startDelay: 35000 }, // Garde d'élite avant le boss
      { count: 1, type: "bosslvl1", interval: 3000, startDelay: 45000 }, // LE BOSS arrive après 1 minute de combat !
    ],
  ],
};
