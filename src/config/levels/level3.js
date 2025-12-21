export const LEVEL_3 = {
  biome: "ice",
  // THEME : Désert de Glace
  // 6=Sol Neige, 7=Chemin Glacé, 8=Eau Glacée, 9=Montagne Neige, 2=Base
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
      { count: 4, type: "diviseur", interval: 2500, startDelay: 0 },
      { count: 20, type: "grunt", interval: 500, startDelay: 8000 }, // Noyade sous le nombre
      { count: 3, type: "shaman_gobelin", interval: 4000, startDelay: 13000 },
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
      { count: 8, type: "diviseur", interval: 3500, startDelay: 5000 },
      { count: 5, type: "shaman_gobelin", interval: 4000, startDelay: 10000 },
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
      { count: 30, type: "grunt", interval: 300, startDelay: 0 },
      { count: 20, type: "runner", interval: 300, startDelay: 5000 },

      // La garde rapprochée
      { count: 8, type: "juggernaut_igloo", interval: 2000, startDelay: 20000 },
      { count: 6, type: "shaman_gobelin", interval: 2000, startDelay: 25000 }, // ILS SONT LÀ POUR SOIGNER LE BOSS

      // LE BOSS
      { count: 1, type: "bosslvl3", interval: 10000, startDelay: 35000 }, // Arrive tard, très PV

      // Les renforts de dernière chance
      { count: 10, type: "runner", interval: 200, startDelay: 49000 },
    ],
  ],
};
