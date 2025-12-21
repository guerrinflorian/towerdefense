export const LEVEL_5 = {
  biome: "lavaland",
  map: [
    [5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
    [0, 0, 0, 0, 5, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 5, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 5, 0, 0, 0, 0, 5, 0, 0, 0, 1, 0, 0],
    [0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 1, 1, 1, 2, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 5, 0, 0, 1, 0, 0, 0, 0, 5, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 5, 0, 0, 5, 0, 1, 0, 0, 5, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 5, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5],
  ],

  paths: [
    [
      { x: 0, y: 3 },
      { x: 12, y: 3 },
      { x: 12, y: 7 },
      { x: 13, y: 7 },
    ],
    [
      { x: 0, y: 12 },
      { x: 6, y: 12 },
      { x: 6, y: 8 },
      { x: 10, y: 8 },
      { x: 10, y: 7 },
      { x: 13, y: 7 },
    ],
  ],

  waves: [
    [
      { count: 24, type: "scoria_soldier", interval: 850, startDelay: 0 },
      { count: 10, type: "ember_scout", interval: 420, startDelay: 4000 },
    ],
    [
      { count: 40, type: "ember_scout", interval: 330, startDelay: 0 },
      { count: 12, type: "scoria_soldier", interval: 750, startDelay: 6000 },
    ],
    [
      { count: 8, type: "obsidian_bastion", interval: 2500, startDelay: 0 },
      { count: 20, type: "scoria_soldier", interval: 700, startDelay: 4000 },
      { count: 4, type: "infernal_banner", interval: 2400, startDelay: 7000 },
    ],
    [
      { count: 28, type: "scoria_soldier", interval: 650, startDelay: 0 },
      { count: 6, type: "infernal_banner", interval: 2200, startDelay: 5000 },
      { count: 14, type: "ember_scout", interval: 380, startDelay: 8000 },
    ],
    [
      { count: 6, type: "blackflame_sorcerer", interval: 3600, startDelay: 0 },
      { count: 18, type: "scoria_soldier", interval: 700, startDelay: 0 },
      { count: 6, type: "obsidian_bastion", interval: 2400, startDelay: 7000 },
    ],
    [
      { count: 18, type: "ember_scout", interval: 340, startDelay: 0 },
      { count: 10, type: "obsidian_bastion", interval: 2100, startDelay: 6000 },
      { count: 5, type: "infernal_banner", interval: 2300, startDelay: 8000 },
    ],
    [
      { count: 1, type: "ash_queen", interval: 8000, startDelay: 0 },
      { count: 30, type: "scoria_soldier", interval: 620, startDelay: 5000 },
      { count: 10, type: "ember_scout", interval: 420, startDelay: 8000 },
      { count: 6, type: "blackflame_sorcerer", interval: 3200, startDelay: 12000 },
    ],
    [
      { count: 1, type: "ash_queen", interval: 8000, startDelay: 0 },
      { count: 12, type: "infernal_banner", interval: 2200, startDelay: 4000 },
      { count: 16, type: "obsidian_bastion", interval: 2200, startDelay: 5000 },
      { count: 24, type: "ember_scout", interval: 380, startDelay: 11000 },
    ],
    [
      { count: 60, type: "ember_scout", interval: 260, startDelay: 0 },
      { count: 10, type: "blackflame_sorcerer", interval: 3000, startDelay: 5000 },
      { count: 12, type: "obsidian_bastion", interval: 2200, startDelay: 9000 },
      { count: 6, type: "infernal_banner", interval: 2200, startDelay: 14000 },
    ],
    [
      { count: 20, type: "scoria_soldier", interval: 500, startDelay: 0 },
      { count: 10, type: "obsidian_bastion", interval: 2000, startDelay: 4000 },
      { count: 8, type: "blackflame_sorcerer", interval: 2500, startDelay: 6000 },
      { count: 6, type: "infernal_banner", interval: 2400, startDelay: 7000 },
      { count: 1, type: "ash_queen", interval: 8000, startDelay: 12000 },
      { count: 1, type: "bosslvl5", interval: 12000, startDelay: 20000 },
    ],
  ],
};
