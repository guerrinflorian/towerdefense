export const CONFIG = {
  TILE_SIZE: 64,
  UI_HEIGHT: 80,
  MAP_OFFSET: 120, // 80px UI + 40px marge
  GAME_WIDTH: 960,
  GAME_HEIGHT: 1080,
  STARTING_MONEY: 650,
  STARTING_LIVES: 20,
  TOOLBAR_HEIGHT: 100, // Hauteur de la toolbar
  TOOLBAR_MARGIN: 20, // Marge autour de la toolbar
};

// ... Imports inchangés ...
import { grunt } from "../config/ennemies/grunt.js";
import { runner } from "../config/ennemies/runner.js";
import { tank } from "../config/ennemies/tank.js";
import { shield } from "../config/ennemies/shield.js";
import { bosslvl1 } from "../config/ennemies/bosslvl1.js";
import { bosslvl2 } from "../config/ennemies/bosslvl2.js";
import { witch } from "../config/ennemies/witch.js";
import { zombie_minion } from "../config/ennemies/zombie_minion.js";
import { tortue_dragon } from "../config/ennemies/tortue_dragon.js";
import { shaman_gobelin } from "../config/ennemies/shaman_gobelin.js";
import { diviseur } from "../config/ennemies/diviseur.js";
import { slime_medium } from "../config/ennemies/slime_medium.js";
import { slime_small } from "../config/ennemies/slime_small.js";

export const ENEMIES = {
  grunt,
  runner,
  tank,
  shield,
  bosslvl1,
  bosslvl2,
  witch,
  zombie_minion,
  tortue_dragon,
  shaman_gobelin,
  diviseur,
  slime_medium,
  slime_small,
};

import { machine_gun } from "../config/turrets/machineGun.js";
import { sniper } from "../config/turrets/sniper.js";
import { cannon } from "../config/turrets/cannon.js";
import { zap } from "../config/turrets/zap.js";
import { barracks } from "../config/turrets/barracks.js";
export const TURRETS = { machine_gun, sniper, cannon, zap, barracks };
