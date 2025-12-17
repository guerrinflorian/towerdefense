export const LEVEL_1 = {
  // 0=Herbe, 1=Chemin, 2=Base, 3=Eau, 4=Pont
  map: [
    [1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y=0  : Départ
    [0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 4, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0], // y=2  : Pont du haut (x=3)
    [0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], // Bifurcation (x=2, y=2)
    [0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 4, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0], // y=8  : Pont du bas (x=3)
    [0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0], // Jonction (x=10, y=10)
    [0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
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
    // VAGUE 1 : Soldats (50% haut, 50% bas)
    [
      { count: 14, type: "grunt", interval: 1000 },
    { count: 3, type: "thrower", interval: 500 },   
    { count: 15, type: "grunt", interval: 1000 }
    ]   ,


    // VAGUE 2 : Runners
    [{ count: 25, type: "runner", interval: 400 }],

    // VAGUE 3 : Mixte
    [
      { count: 5, type: "shield", interval: 1500 },
      { count: 8, type: "runner", interval: 800 },
      { count: 10, type: "grunt", interval: 600 },
    ],

    // VAGUE 4 : Tank
    [
      { count: 20, type: "runner", interval: 400 },
      { count: 2, type: "shield", interval: 1500 },
      { count: 6, type: "grunt", interval: 600 },
      { count: 3, type: "tank", interval: 4000 },
    ],

    // VAGUE 5 : Invasion
    [
      { count: 60, type: "grunt", interval: 500 },
      { count: 5, type: "shield", interval: 1500 },
      { count: 7, type: "tank", interval: 4000 },
    ],

    // VAGUE 6 : BOSS
    [
      { count: 60, type: "grunt", interval: 700 },
      { count: 30, type: "runner", interval: 1500 },
      { count: 6, type: "tank", interval: 5000 },
      { count: 1, type: "boss", interval: 3000 },
    ],
  ],
};
