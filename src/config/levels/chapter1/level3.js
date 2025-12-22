export const LEVEL_3 = {
  biome: "ice",
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
    // 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
    [7, 7, 7, 6, 6, 6, 8, 8, 8, 6, 6, 6, 6, 6, 6], // y=0  Spawn 1
    [6, 6, 7, 6, 6, 6, 8, 8, 8, 6, 9, 9, 9, 6, 6], // y=1
    [6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 9, 9, 9, 6, 6], // y=2
    [6, 6, 7, 7, 7, 7, 7, 6, 6, 6, 9, 9, 9, 6, 6], // y=3  long couloir
    [6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6], // y=4
    [8, 8, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6], // y=5
    [8, 8, 6, 6, 6, 6, 7, 7, 7, 7, 7, 6, 6, 6, 6], // y=6  grande traversée
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6], // y=7
    [6, 6, 6, 6, 6, 6, 7, 7, 7, 6, 7, 6, 6, 6, 6], // y=8  boucle + jonction
    [6, 6, 9, 9, 9, 6, 7, 6, 7, 6, 7, 6, 6, 6, 6], // y=9
    [6, 6, 9, 9, 9, 6, 7, 6, 7, 7, 7, 7, 7, 7, 2], // y=10 Base (14,10)
    [6, 6, 9, 9, 9, 6, 7, 7, 6, 6, 6, 6, 6, 6, 6], // y=11
    [7, 7, 7, 7, 7, 7, 6, 7, 8, 8, 8, 6, 6, 6, 6], // y=12 Spawn 2
    [6, 6, 6, 6, 6, 7, 6, 7, 8, 8, 8, 6, 6, 6, 6], // y=13
    [6, 6, 6, 6, 6, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6], // y=14 sortie bas vers centre
  ],

  paths: [
    // CHEMIN 1 : HAUT GAUCHE vers BASE (suivre uniquement les cases 7)
    [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 3 },
      { x: 6, y: 3 },
      { x: 6, y: 6 },
      { x: 10, y: 6 },
      { x: 10, y: 10 },
      { x: 14, y: 10 },
    ],

    // CHEMIN 2 : BAS GAUCHE vers BASE (suivre uniquement les cases 7)
    [
      { x: 0, y: 12 },
      { x: 5, y: 12 },
      { x: 5, y: 14 },
      { x: 7, y: 14 },
      { x: 7, y: 11 },
      { x: 6, y: 11 },
      { x: 6, y: 8 },
      { x: 8, y: 8 },
      { x: 8, y: 10 },
      { x: 14, y: 10 },
    ],
  ],

  // 10 VAGUES - DIFFICULTÉ "CAUCHEMAR TACTIQUE"
  waves: [
    // VAGUE 1 : Échauffement bilatéral
    // Le joueur doit placer des tours aux deux spawn ou au centre.
    [
      { count: 10, type: "grunt", interval: 800, startDelay: 0 },
      { count: 12, type: "grunt", interval: 800, startDelay: 5000 }, // Arrive sur l'autre chemin (aléatoire selon ton code)
    ],

    // VAGUE 2 : La vitesse
    [{ count: 21, type: "runner", interval: 400, startDelay: 0 }],

    // VAGUE 3 : INTRODUCTION DU SHAMAN
    // Les Grunts servent de bouclier de chair, les Shamans les soignent derrière.
    [
      { count: 20, type: "grunt", interval: 600, startDelay: 0 },
      { count: 3, type: "shaman_gobelin", interval: 3000, startDelay: 3000 }, // Il arrive et soigne ceux devant
    ],

    // VAGUE 4 : Le Mur immortel
    // Shields (haute défense) + Shaman (Soin) = Très dur à tuer sans gros DPS.
    [
      { count: 2, type: "shaman_gobelin", interval: 3000, startDelay: 0 },
      { count: 7, type: "shield", interval: 1200, startDelay: 8000 },
      { count: 12, type: "runner", interval: 400, startDelay: 19000 }, // Pour punir si le joueur n'a que des tours lentes
    ],

    // VAGUE 5 : Lourdeur Mécanique
    [
      { count: 3, type: "tortue_dragon", interval: 4000, startDelay: 0 },
      { count: 3, type: "shield", interval: 1200, startDelay: 8000 },
      { count: 1, type: "juggernaut_igloo", interval: 2500, startDelay: 22000 }, // Unité très juggernaut_iglooy du lvl 2
    ],

    // VAGUE 6 : Division et Multiplication
    // Les Diviseurs explosent en petits slimes, les Shamans soignent les petits slimes.
    [
      { count: 3, type: "diviseur", interval: 2500, startDelay: 0 },
      { count: 20, type: "grunt", interval: 500, startDelay: 8000 }, // Noyade sous le nombre
      { count: 2, type: "shaman_gobelin", interval: 4000, startDelay: 13000 },
    ],

    // VAGUE 7 : L'Escouade d'Élite
    // Un mélange compact et dangereux.
    [
      { count: 5, type: "shield", interval: 1000, startDelay: 0 },
      { count: 3, type: "tortue_dragon", interval: 3000, startDelay: 2000 },
      { count: 3, type: "shaman_gobelin", interval: 3000, startDelay: 4000 }, // Protégés par les tortues
      { count: 4, type: "juggernaut_igloo", interval: 2500, startDelay: 15000 },
    ],

    // VAGUE 8 : Chaos Total
    // Ça vient de partout.
    [
      { count: 50, type: "runner", interval: 250, startDelay: 0 }, // Flux continu ultra rapide
      { count: 6, type: "diviseur", interval: 3500, startDelay: 5000 },
      { count: 4, type: "shaman_gobelin", interval: 4000, startDelay: 12000 },
      { count: 1, type: "juggernaut_igloo", interval: 2500, startDelay: 18000 },
    ],

    // VAGUE 9 : Avant la tempête
    // Des unités très résistantes pour vider les munitions/énergie du joueur.
    [
      { count: 7, type: "tortue_dragon", interval: 2500, startDelay: 0 },
      { count: 1, type: "juggernaut_igloo", interval: 2500, startDelay: 10000 },
      { count: 10, type: "shield", interval: 1000, startDelay: 15000 },
      { count: 6, type: "shaman_gobelin", interval: 3000, startDelay: 23000 }, // Soignent les tortues
    ],

    // VAGUE 10 : LE SEIGNEUR DE GUERRE (Boss Lvl 3)
    [
      // L'avant-garde
      { count: 40, type: "grunt", interval: 320, startDelay: 0 },
      { count: 20, type: "runner", interval: 300, startDelay: 5000 },

      // La garde rapprochée
      { count: 8, type: "juggernaut_igloo", interval: 2000, startDelay: 23000 },
      { count: 6, type: "shaman_gobelin", interval: 2000, startDelay: 28000 }, // ILS SONT LÀ POUR SOIGNER LE BOSS

      // LE BOSS
      { count: 1, type: "bosslvl3", interval: 10000, startDelay: 39000 }, // Arrive tard, très PV

      // Les renforts de dernière chance
      { count: 12, type: "runner", interval: 200, startDelay: 49000 },
    ],
  ],
};
