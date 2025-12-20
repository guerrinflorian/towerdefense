// src/levels/index.js

import { LEVEL_1 } from "./level1.js";
import { LEVEL_2 } from "./level2.js";
import { LEVEL_3 } from "./level3.js";
import { LEVEL_4 } from "./level4.js";

export const LEVELS_CONFIG = [
  { id: 1, name: "Forêt de Sylvarok", data: LEVEL_1 },
  { id: 2, name: "Désert d'Azal'kor", data: LEVEL_2 },
  { id: 3, name: "Glacier de Krovar", data: LEVEL_3 },
  { id: 4, name: "Cimetière Maudit", data: LEVEL_4 },
];
