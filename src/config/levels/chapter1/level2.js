export const LEVEL_2 = {
  biome: "sand",
  startingMoney: 650,
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
    [10, 10, 10,  3,  3, 10, 10, 10, 10, 11, 11, 10, 10, 10, 10],
    [10, 10, 10,  3, 10, 10, 10, 10, 10, 10, 10,  5,  5,  5, 10],
    [ 1,  1,  1,  4,  1,  1,  1,  1,  1, 10, 10,  5,  5,  5, 11], // Ligne 2 : Départ A
    [10, 10, 10,  3, 10, 10, 11, 10,  1, 10, 10,  5,  5,  5, 10],
    [10, 10, 10,  3, 10, 10, 10, 10,  1, 10, 10, 10, 10, 10, 10],
    [10, 10,  3,  3, 11, 11, 10, 10,  1,  1,  1,  1,  1,  1,  1], // Ligne  5
    [10,  3,  3,  3, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,  1],
    [10, 10, 10,  3, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,  1],
    [ 1,  1,  1,  3,  3, 10, 10, 10,  1,  1,  1,  1,  1,  1,  1], // Ligne 8 : Départ B & Jonction
    [11, 10,  1,  3, 10, 10,  1,  1, 1, 10, 10,   1, 10, 10, 10],
    [10, 10,  1,  3,  1,  1,  1, 10, 10, 10, 10,  1, 10, 10, 10],
    [10, 10,  1,  4,  1, 10, 10, 10, 11, 10, 10,  1, 10, 10, 10],
    [10, 10, 10,  3, 10, 10, 10, 10, 10, 10, 10,  1, 10, 10, 10],
    [10, 10,  3,  3, 10, 10, 10, 10, 10, 10, 10,  1, 10, 10, 10],
    [ 3,  3,  3,  3,  3, 10,  5, 10, 10, 11, 10,  1,  1,  1,  2], // Fin (Base en 1 4,1 4)
  ],

  // LISTE DES CHEMINS (Identiques à ta version corrigée)
  paths: [
    // --- CHEMIN A : Départ HAUT GAUCHE ---
    [
      { x: 0, y: 2 }, // Départ
      { x: 8, y: 2 }, // Va à droite
      { x: 8, y: 5 }, // Descend
      { x: 14, y: 5 }, // Va à droite
      { x: 14, y: 8 }, // Descend
      { x: 11, y: 8 }, // Revient vers la gauche (Jonction avec Chemin B)
      { x: 11, y: 14 }, // Descend tout droit vers le bas
      { x: 14, y: 14 }, // Va à droite vers la Base
    ],

    // --- CHEMIN B : Départ BAS GAUCHE (Le zig-zag) ---
    [
      { x: 0, y: 8 }, // Départ
      { x: 2, y: 8 }, // Va à droite
      { x: 2, y: 11 }, // Descend (contourne le vide)
      { x: 4, y: 11 }, // Va à droite
      { x: 4, y: 10 }, // Remonte
      { x: 6, y: 10 }, // Va à droite
      { x: 6, y: 9 }, // Remonte
      { x: 8, y: 9 }, // Va à droite
      { x: 8, y: 8 }, // Remonte (rejoint la ligne principale)
      { x: 11, y: 8 }, // Va à droite (Jonction avec Chemin A)
      { x: 11, y: 14 }, // Descend tout droit vers le bas
      { x: 14, y: 14 }, // Va à droite vers la Base
    ],
  ],

  // CONFIGURATION DES 8 VAGUES (Sans Shaman, Difficile)
  waves: [
    // VAGUE 1 : Mise en bouche (2 chemins)
    [
      { count: 12, type: "grunt", interval: 1000, startDelay: 0 },
      { count: 12, type: "grunt", interval: 1000, startDelay: 6000 }, // Décalage pour forcer la gestion des 2 chemins
      { count: 5, type: "runner", interval: 800, startDelay: 15000 }, // Les rapides à la fin
    ],

    // VAGUE 2 : Le Mur de Boucliers
    [
      { count: 8, type: "shield", interval: 1500, startDelay: 0 }, // Ils encaissent les premiers tirs
      { count: 20, type: "runner", interval: 400, startDelay: 5000 }, // Les runners doublent les shields lents
    ],

    // VAGUE 3 : Introduction Tortue Dragon (Tanky)
    [
      { count: 25, type: "grunt", interval: 600, startDelay: 0 },
      { count: 3, type: "tortue_dragon", interval: 3000, startDelay: 10000 }, // Nouvelle unité très résistante
      { count: 10, type: "runner", interval: 500, startDelay: 18000 },
    ],

    // VAGUE 4 : L'Escorte Blindée
    [
      { count: 30, type: "grunt", interval: 500, startDelay: 0 },
      { count: 5, type: "tank", interval: 3000, startDelay: 10000 }, // Les tanks classiques
      { count: 5, type: "shield", interval: 1200, startDelay: 12000 }, // Protection rapprochée
    ],

    // VAGUE 5 : Division Cellulaire (Introduction Diviseur)
    [
      { count: 4, type: "diviseur", interval: 4000, startDelay: 0 }, // Si on les tue, ils se divisent
      { count: 20, type: "runner", interval: 350, startDelay: 8000 }, // Rush pendant que le joueur gère les divisions
      { count: 15, type: "grunt", interval: 500, startDelay: 12000 },
    ],

    // VAGUE 6 : Le Combo Lourd
    [
      { count: 5, type: "tortue_dragon", interval: 3500, startDelay: 0 }, // Très lent, très costaud
      { count: 4, type: "tank", interval: 3000, startDelay: 5000 },
      { count: 6, type: "diviseur", interval: 4000, startDelay: 20000 }, // Arrivent quand les tours sont occupées par les tanks
    ],

    // VAGUE 7 : Submersion (Test de DPS)
    [
      { count: 50, type: "grunt", interval: 300, startDelay: 0 }, // Flux continu et rapide
      { count: 15, type: "shield", interval: 1000, startDelay: 5000 },
      { count: 15, type: "runner", interval: 300, startDelay: 15000 },
      { count: 5, type: "diviseur", interval: 3000, startDelay: 25000 },
    ],

    // VAGUE 8 : BOSS FINAL (Boss Lvl 2)
    [
      { count: 30, type: "runner", interval: 350, startDelay: 0 }, // Distraction initiale
      { count: 8, type: "tortue_dragon", interval: 3000, startDelay: 10000 }, // La garde royale
      { count: 8, type: "tank", interval: 3000, startDelay: 20000 },
      { count: 1, type: "bosslvl2", interval: 5000, startDelay: 40000 }, // Le Boss final arrive tard
    ],
  ],
};
