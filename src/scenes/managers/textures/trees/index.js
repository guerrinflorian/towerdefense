import { drawCimetiereTree } from "./biomes/cimetiere.js";
import { drawGrassTree } from "./biomes/grass.js";
import { drawIceTree } from "./biomes/ice.js";
import { drawLavaTree } from "./biomes/lava.js";
import { drawRoseTree } from "./biomes/rose.js";
import { drawSandTree } from "./biomes/sand.js";

export const TREE_DRAWERS = {
  grass: drawGrassTree,
  ice: drawIceTree,
  sand: drawSandTree,
  cimetiere: drawCimetiereTree,
  lava: drawLavaTree,
  lavaland: drawLavaTree,
  rose: drawRoseTree,
};

export function createTreeGraphics(scene, biome, scale) {
  const graphics = scene.add.graphics();
  const drawer = TREE_DRAWERS[biome] || TREE_DRAWERS.grass;
  drawer(graphics, scale);
  return graphics;
}
