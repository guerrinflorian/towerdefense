// src/levels/index.js

import { LEVEL_1 } from "./level1.js";
import { LEVEL_2 } from "./level2.js";
import { LEVEL_3 } from "./level3.js";
import { LEVEL_4 } from "./level4.js";
import { LEVEL_5 } from "./level5.js";

export const LEVELS_CONFIG = [
  { id: 1, data: LEVEL_1 },
  { id: 2, data: LEVEL_2 },
  { id: 3, data: LEVEL_3 },
  { id: 4, data: LEVEL_4 },
  { id: 5, data: LEVEL_5 },
];

export function getLevelConfigById(levelId) {
  const level = LEVELS_CONFIG.find((lvl) => lvl.id === Number(levelId));
  return level?.data || null;
}
