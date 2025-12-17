export const LEVEL_2 = {
  // 0=Herbe, 1=Chemin, 2=Base, 3=Eau, 4=Pont
  map: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0], // Ligne 2 : Départ A
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1], // Ligne 5
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1], // Ligne 8 : Départ B & Jonction
    [0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2], // Fin (Base en 14,14)
  ],

  // LISTE DES CHEMINS CORRIGÉS
  paths: [
    // --- CHEMIN A : Départ HAUT GAUCHE ---
    [
      { x: 0, y: 2 },  // Départ
      { x: 8, y: 2 },  // Va à droite
      { x: 8, y: 5 },  // Descend
      { x: 14, y: 5 }, // Va à droite
      { x: 14, y: 8 }, // Descend
      { x: 11, y: 8 }, // Revient vers la gauche (Jonction avec Chemin B)
      { x: 11, y: 14 },// Descend tout droit vers le bas
      { x: 14, y: 14 } // Va à droite vers la Base
    ],

    // --- CHEMIN B : Départ BAS GAUCHE (Le zig-zag) ---
    [
      { x: 0, y: 8 },  // Départ
      { x: 2, y: 8 },  // Va à droite
      { x: 2, y: 11 }, // Descend (contourne le vide)
      { x: 4, y: 11 }, // Va à droite
      { x: 4, y: 10 }, // Remonte
      { x: 6, y: 10 }, // Va à droite
      { x: 6, y: 9 },  // Remonte
      { x: 8, y: 9 },  // Va à droite
      { x: 8, y: 8 },  // Remonte (rejoint la ligne principale)
      { x: 11, y: 8 }, // Va à droite (Jonction avec Chemin A)
      { x: 11, y: 14 },// Descend tout droit vers le bas
      { x: 14, y: 14 } // Va à droite vers la Base
    ],
  ],

  waves: [
    // VAGUE 1 : Introduction avec deux spawns
    [
      { count: 10, type: "grunt", interval: 800 },
      { count: 5, type: "runner", interval: 600 },
    ],

    // VAGUE 2 : Runners rapides depuis les deux points
    [
      { count: 20, type: "runner", interval: 350 },
      { count: 8, type: "grunt", interval: 700 },
    ],

    // VAGUE 3 : Mixte avec shields
    [
      { count: 12, type: "grunt", interval: 600 },
      { count: 8, type: "runner", interval: 500 },
      { count: 4, type: "shield", interval: 1200 },
    ],

    // VAGUE 4 : Tanks et runners
    [
      { count: 25, type: "runner", interval: 350 },
      { count: 15, type: "grunt", interval: 500 },
      { count: 2, type: "shield", interval: 1200 },
      { count: 4, type: "tank", interval: 3500 },
    ],

    // VAGUE 5 : Invasion massive
    [
      { count: 40, type: "grunt", interval: 400 },
      { count: 20, type: "runner", interval: 300 },
      { count: 6, type: "shield", interval: 1000 },
      { count: 5, type: "tank", interval: 3000 },
    ],

    // VAGUE 6 : Boss avec support
    [
      { count: 50, type: "grunt", interval: 500 },
      { count: 35, type: "runner", interval: 400 },
      { count: 8, type: "shield", interval: 1000 },
      { count: 6, type: "tank", interval: 4000 },
      { count: 1, type: "boss", interval: 2000 },
    ],
  ],
};