export const LEVEL_7 = {
  biome: "ice",
  startingMoney: 1200,
  // TYPES DE TEXTURES (0-24) :
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
  // 24 = Sol Glacé Profond (biome glace, constructible, plus glacé que type 6)
  map: [
    // 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
    [7, 7, 7, 7, 7, 24, 24, 24, 24, 24, 24, 24, 24, 24, 2], // y=0  Spawn 1 -> Base 1 (14,0)
    [24, 24, 24, 24, 7, 24, 24, 8, 8, 8, 24, 24, 24, 24, 7], // y=1
    [24, 9, 9, 9, 7, 24, 24, 8, 8, 8, 24, 24, 24, 24, 7], // y=2
    [24, 9, 9, 9, 7, 7, 24, 24, 7, 7, 7, 7, 7, 7, 7], // y=3  traversée horizontale
    [24, 9, 9, 9, 24, 7, 24, 24, 7, 24, 24, 24, 24, 24, 24], // y=4
    [24, 24, 24, 24, 24, 7, 24, 24, 7, 24, 24, 24, 24, 24, 24], // y=5
    [8, 8, 8, 24, 24, 7, 7, 7, 7, 24, 7, 7, 7, 7, 2], // y=6
    [8, 8, 8, 24, 24, 24, 24, 24, 24, 24, 7, 24, 24, 24, 24], // y=7
    [24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 7, 24, 24, 24, 24], // y=8
    [24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 7, 7, 7, 24, 24], // y=9
    [24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 7, 7, 24], // y=10
    [24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 7, 24], // y=11
    [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 24], // y=12 Spawn 2 -> traverse
    [24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24], // y=13
    [24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24], // y=14 Base 2 (14,14)
  ],

  // LISTE DES CHEMINS POSSIBLES - DEUX BASES
  paths: [
    // CHEMIN 1 : sortie haut-gauche -> BASE (14,0)
 // CHEMIN 1 : HAUT GAUCHE (Spawn 1) vers BASE 1 (14,0)
[
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 3, y: 0 },
  { x: 4, y: 0 },

  { x: 4, y: 1 },
  { x: 4, y: 2 },
  { x: 4, y: 3 },

  // au lieu d'aller tout droit (impossible), on descend par la branche x=5
  { x: 5, y: 3 },
  { x: 5, y: 4 },
  { x: 5, y: 5 },
  { x: 5, y: 6 },

  // on va à droite jusqu'à x=8 (ligne y=6)
  { x: 6, y: 6 },
  { x: 7, y: 6 },
  { x: 8, y: 6 },

  // puis on remonte sur la colonne x=8 pour rejoindre la grande ligne y=3
  { x: 8, y: 5 },
  { x: 8, y: 4 },
  { x: 8, y: 3 },

  // ensuite on part à droite jusqu'au bord
  { x: 9,  y: 3 },
  { x: 10, y: 3 },
  { x: 11, y: 3 },
  { x: 12, y: 3 },
  { x: 13, y: 3 },
  { x: 14, y: 3 },

  // et on remonte vers la base du haut
  { x: 14, y: 2 },
  { x: 14, y: 1 },
  { x: 14, y: 0 }, // Base 1 (14,0)
],
  
    // CHEMIN 2 : sortie bas-gauche -> BASE (14,6)
    [
      { x: 0, y: 12 },
      { x: 1, y: 12 },
      { x: 2, y: 12 },
      { x: 3, y: 12 },
      { x: 4, y: 12 },
      { x: 5, y: 12 },
      { x: 6, y: 12 },
      { x: 7, y: 12 },
      { x: 8, y: 12 },
      { x: 9, y: 12 },
      { x: 10, y: 12 },
      { x: 11, y: 12 },
      { x: 12, y: 12 },
      { x: 13, y: 12 },
  
      { x: 13, y: 11 },
      { x: 13, y: 10 },
      { x: 12, y: 10 },
  
      { x: 12, y: 9 },
      { x: 11, y: 9 },
      { x: 10, y: 9 },
  
      { x: 10, y: 8 },
      { x: 10, y: 7 },
      { x: 10, y: 6 },
  
      { x: 11, y: 6 },
      { x: 12, y: 6 },
      { x: 13, y: 6 },
      { x: 14, y: 6 }, // Base (14,6)
    ],
  ],
  

  // CONFIGURATION DES VAGUES - NIVEAU 7 CHAPITRE 2 (Introduction Berserker et Vampire)
  waves: [
    // VAGUE 1 : Introduction
    [
      { count: 20, type: "grunt", interval: 600, startDelay: 0 },
      { count: 10, type: "runner", interval: 450, startDelay: 5000 },
    ],

    // VAGUE 2 : Premiers Berserkers
    [
      { count: 15, type: "grunt", interval: 550, startDelay: 0 },
      { count: 3, type: "berserker", interval: 2000, startDelay: 3000 },
      { count: 12, type: "runner", interval: 400, startDelay: 8000 },
    ],

    // VAGUE 3 : Premiers Vampires
    [
      { count: 18, type: "grunt", interval: 500, startDelay: 0 },
      { count: 15, type: "runner", interval: 380, startDelay: 7000 },
      { count: 4, type: "vampire", interval: 1800, startDelay: 9000 },
    ],

    // VAGUE 4 : Mix Berserker + Vampire
    [
      { count: 25, type: "grunt", interval: 480, startDelay: 0 },
      { count: 5, type: "berserker", interval: 1800, startDelay: 2500 },
      { count: 5, type: "vampire", interval: 1700, startDelay: 8000 },
      { count: 18, type: "runner", interval: 350, startDelay: 10000 },
    ],

    // VAGUE 5 : Intensification
    [
      { count: 30, type: "grunt", interval: 450, startDelay: 0 },
      { count: 6, type: "berserker", interval: 1600, startDelay: 2000 },
      { count: 6, type: "vampire", interval: 1600, startDelay: 5000 },
      { count: 3, type: "shaman_gobelin", interval: 2500, startDelay: 9000 },
      { count: 20, type: "runner", interval: 330, startDelay: 12000 },
    ],

    // VAGUE 6 : Défense renforcée
    [
      { count: 35, type: "grunt", interval: 420, startDelay: 0 },
      { count: 8, type: "berserker", interval: 1500, startDelay: 1500 },
      { count: 8, type: "vampire", interval: 1500, startDelay: 4500 },
      { count: 4, type: "shaman_gobelin", interval: 2400, startDelay: 8000 },
      { count: 22, type: "runner", interval: 300, startDelay: 10000 },
      { count: 4, type: "juggernaut_igloo", interval: 3000, startDelay: 14000 },
    ],

    // VAGUE 7 : Assaut coordonné
    [
      { count: 40, type: "grunt", interval: 400, startDelay: 0 },
      { count: 10, type: "berserker", interval: 1400, startDelay: 1000 },
      { count: 10, type: "vampire", interval: 1400, startDelay: 4000 },
      { count: 5, type: "shaman_gobelin", interval: 2300, startDelay: 7000 },
      { count: 25, type: "runner", interval: 280, startDelay: 9000 },
      { count: 5, type: "juggernaut_igloo", interval: 2800, startDelay: 13000 },
    ],

    // VAGUE 8 : Avant le boss
    [
      { count: 45, type: "grunt", interval: 380, startDelay: 0 },
      { count: 12, type: "berserker", interval: 1300, startDelay: 1000 },
      { count: 12, type: "vampire", interval: 1300, startDelay: 3500 },
      { count: 6, type: "shaman_gobelin", interval: 2200, startDelay: 6000 },
      { count: 30, type: "runner", interval: 250, startDelay: 8000 },
      { count: 6, type: "juggernaut_igloo", interval: 2600, startDelay: 12000 },
    ],

    // VAGUE 9 : BOSS FINAL
    [
      { count: 50, type: "grunt", interval: 350, startDelay: 0 },
      { count: 15, type: "berserker", interval: 1200, startDelay: 1000 },
      { count: 15, type: "vampire", interval: 1200, startDelay: 3000 },
      { count: 8, type: "shaman_gobelin", interval: 2100, startDelay: 5000 },
      { count: 35, type: "runner", interval: 220, startDelay: 6000 },
      { count: 8, type: "juggernaut_igloo", interval: 2400, startDelay: 11000 },
      { count: 1, type: "bosslvl7", interval: 10000, startDelay: 25000 },
    ],
  ],
};

