export const LEVEL_2 = {
  // 0=Herbe, 1=Chemin, 2=Base, 3=Eau, 4=Pont
  map: [
    [0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0],
    [1, 1, 1, 4, 1, 1, 1, 1, 1, 0, 0, 5, 5, 5, 0], // Ligne 2 : Départ A
    [0, 0, 0, 3, 0, 0, 0, 0, 1, 0, 0, 5, 5, 5, 0],
    [0, 0, 0, 3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 3, 3, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1], // Ligne 5
    [0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 3, 3, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1], // Ligne 8 : Départ B & Jonction
    [0, 0, 1, 3, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 3, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 4, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [3, 3, 3, 3, 3, 0, 5, 0, 0, 0, 0, 1, 1, 1, 2], // Fin (Base en 14,14)
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
    // VAGUE 1 : Introduction douce - Ennemis de base
    [
      { count: 15, type: "grunt", interval: 900 },
      { count: 8, type: "runner", interval: 700 },
    ],

    // VAGUE 2 : Runners rapides et grunts
    [
      { count: 15, type: "runner", interval: 400 },
      { count: 30, type: "grunt", interval: 600 },
    ],

    // VAGUE 3 : Introduction des shields - Mixte équilibré
    [
      { count: 18, type: "grunt", interval: 550 },
      { count: 15, type: "runner", interval: 450 },
      { count: 5, type: "shield", interval: 1300 },
    ],

    // VAGUE 4 : Tanks et support - Augmentation de la difficulté
    [
      { count: 30, type: "runner", interval: 380 },
      { count: 25, type: "grunt", interval: 500 },
      { count: 6, type: "shield", interval: 1200 },
      { count: 3, type: "tank", interval: 4000 },
    ],

    // VAGUE 5 : Introduction Tortue-Dragon - Premier nouveau ennemi
    [
      { count: 35, type: "grunt", interval: 450 },
      { count: 20, type: "runner", interval: 400 },
      { count: 8, type: "shield", interval: 1100 },
      { count: 4, type: "tank", interval: 3500 },
      { count: 2, type: "tortue_dragon", interval: 5000 },
    ],

    // VAGUE 6 : Shaman Gobelin - Soin des ennemis
    [
      { count: 40, type: "grunt", interval: 400 },
      { count: 25, type: "runner", interval: 350 },
      { count: 10, type: "shield", interval: 1000 },
      { count: 5, type: "tank", interval: 3000 },
      { count: 3, type: "tortue_dragon", interval: 4500 },
      { count: 2, type: "shaman_gobelin", interval: 6000 },
    ],

    // VAGUE 7 : Diviseur - Les slimes arrivent !
    [
      { count: 45, type: "grunt", interval: 380 },
      { count: 30, type: "runner", interval: 350 },
      { count: 12, type: "shield", interval: 950 },
      { count: 6, type: "tank", interval: 2800 },
      { count: 4, type: "tortue_dragon", interval: 4000 },
      { count: 3, type: "shaman_gobelin", interval: 5500 },
      { count: 2, type: "diviseur", interval: 8000 },
    ],

    // VAGUE 8 : Invasion massive - Tous les ennemis
    [
      { count: 50, type: "grunt", interval: 350 },
      { count: 35, type: "runner", interval: 320 },
      { count: 15, type: "shield", interval: 900 },
      { count: 8, type: "tank", interval: 2500 },
      { count: 5, type: "tortue_dragon", interval: 3800 },
      { count: 4, type: "shaman_gobelin", interval: 5000 },
      { count: 3, type: "diviseur", interval: 7000 },
      { count: 2, type: "witch", interval: 6000 },
    ],

    // VAGUE 9 : BOSS FINAL - Boss Level 2 avec armée complète
    [
      { count: 60, type: "grunt", interval: 400 },
      { count: 40, type: "runner", interval: 350 },
      { count: 18, type: "shield", interval: 850 },
      { count: 10, type: "tank", interval: 2200 },
      { count: 6, type: "tortue_dragon", interval: 3500 },
      { count: 5, type: "shaman_gobelin", interval: 4500 },
      { count: 4, type: "diviseur", interval: 6000 },
      { count: 3, type: "witch", interval: 5000 },
      { count: 1, type: "bosslvl2", interval: 20000 },
    ],
  ],
};
