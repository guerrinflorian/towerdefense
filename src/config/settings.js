export const CONFIG = {
  TILE_SIZE: 64,
  UI_HEIGHT: 80,
  MAP_OFFSET: 120, // 80px UI + 40px marge
  GAME_WIDTH: 960,
  GAME_HEIGHT: 1080,
  STARTING_MONEY: 550,
  STARTING_LIVES: 20,
};

// ... Imports inchangés ...
import { grunt } from "../config/ennemies/grunt.js";
import { runner } from "../config/ennemies/runner.js";
import { tank } from "../config/ennemies/tank.js";
import { shield } from "../config/ennemies/shield.js";
import { boss } from "../config/ennemies/boss.js";

export const ENEMIES = { grunt, runner, tank, shield, boss };

import { machine_gun } from "../config/turrets/machineGun.js";
import { sniper } from "../config/turrets/sniper.js";
import { cannon } from "../config/turrets/cannon.js";

export const TURRETS = { machine_gun, sniper, cannon };
