export const CONFIG = {
  TILE_SIZE: 64,
  UI_HEIGHT: 80,
  MAP_OFFSET: 120, // 80px UI + 40px marge
  GAME_WIDTH: 960,
  GAME_HEIGHT: 1080,
  STARTING_MONEY: 550,
  STARTING_LIVES: 20,
  TOOLBAR_HEIGHT: 100, // Hauteur de la toolbar
  TOOLBAR_MARGIN: 20, // Marge autour de la toolbar
};

// ... Imports inchangés ...
import { grunt } from "../config/ennemies/grunt.js";
import { runner } from "../config/ennemies/runner.js";
import { tank } from "../config/ennemies/tank.js";
import { shield } from "../config/ennemies/shield.js";
import { boss } from "../config/ennemies/boss.js";
import { thrower } from "../config/ennemies/thrower.js";

export const ENEMIES = { grunt, runner, tank, shield, boss, thrower };

import { machine_gun } from "../config/turrets/machineGun.js";
import { sniper } from "../config/turrets/sniper.js";
import { cannon } from "../config/turrets/cannon.js";
import { zap } from "../config/turrets/zap.js";
import { barracks } from "../config/turrets/barracks.js";
export const TURRETS = { machine_gun, sniper, cannon, zap, barracks };
