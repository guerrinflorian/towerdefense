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
import { ENEMIES, ENEMIES_BY_CHAPTER, getEnemiesForChapter } from "./ennemies/index.js";

export { ENEMIES, ENEMIES_BY_CHAPTER, getEnemiesForChapter };

import { machine_gun } from "./turrets/machineGun.js";
import { sniper } from "./turrets/sniper.js";
import { cannon } from "./turrets/cannon.js";
import { zap } from "./turrets/zap.js";
import { barracks } from "./turrets/barracks.js";
export const TURRETS = { machine_gun, sniper, cannon, zap, barracks };
