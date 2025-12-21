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
import { grunt } from "./ennemies/grunt.js";
import { runner } from "./ennemies/runner.js";
import { tank } from "./ennemies/tank.js";
import { shield } from "./ennemies/shield.js";
import { bosslvl1 } from "./ennemies/bosslvl1.js";
import { bosslvl2 } from "./ennemies/bosslvl2.js";
import { bosslvl3 } from "./ennemies/bosslvl3.js";
import { bosslvl4 } from "./ennemies/bosslvl4.js";
import { bosslvl5 } from "./ennemies/bosslvl5.js";
import { tortue_dragon } from "./ennemies/tortue_dragon.js";
import { shaman_gobelin } from "./ennemies/shaman_gobelin.js";
import { diviseur } from "./ennemies/diviseur.js";
import { slime_medium } from "./ennemies/slime_medium.js";
import { slime_small } from "./ennemies/slime_small.js";
import { cemeteryTank } from "./ennemies/cemeteryTank.js";
import { juggernaut_igloo } from "./ennemies/juggernaut_igloo.js";
import { soul_messenger_runner } from "./ennemies/soul_messenger_runner.js";
import { scoria_soldier } from "./ennemies/scoria_soldier.js";
import { ember_scout } from "./ennemies/ember_scout.js";
import { obsidian_bastion } from "./ennemies/obsidian_bastion.js";
import { infernal_banner } from "./ennemies/infernal_banner.js";
import { blackflame_sorcerer } from "./ennemies/blackflame_sorcerer.js";
import { ash_queen } from "./ennemies/ash_queen.js";
import { ash_egg } from "./ennemies/ash_egg.js";
import { flame_scarab } from "./ennemies/flame_scarab.js";

export const ENEMIES = {
  grunt,
  runner,
  soul_messenger_runner,
  tank,
  shield,
  bosslvl1,
  bosslvl2,
  bosslvl3,
  bosslvl4,
  bosslvl5,
  tortue_dragon,
  shaman_gobelin,
  diviseur,
  slime_medium,
  slime_small,
  cemeteryTank,
  juggernaut_igloo,
  scoria_soldier,
  ember_scout,
  obsidian_bastion,
  infernal_banner,
  blackflame_sorcerer,
  ash_queen,
  ash_egg,
  flame_scarab,
};

import { machine_gun } from "./turrets/machineGun.js";
import { sniper } from "./turrets/sniper.js";
import { cannon } from "./turrets/cannon.js";
import { zap } from "./turrets/zap.js";
import { barracks } from "./turrets/barracks.js";
export const TURRETS = { machine_gun, sniper, cannon, zap, barracks };
