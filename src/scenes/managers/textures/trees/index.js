import { drawCimetiereTree } from "./biomes/cimetiere.js";
import { drawGrassTree } from "./biomes/grass.js";
import { drawIceTree } from "./biomes/ice.js";
import { drawLaboratoryTree, drawEvilTree } from "./biomes/laboratory.js";
import { drawLavaTree } from "./biomes/lava.js";
import { drawRoseTree } from "./biomes/rose.js";
import { drawSandTree } from "./biomes/sand.js";
import { 
  drawSnowTree, 
  drawCrystalIceTree, 
  drawIceStalagmite, 
  drawFrozenTree, 
  drawIceColumn 
} from "./biomes/snow.js";

export const TREE_DRAWERS = {
  grass: drawGrassTree,
  ice: drawIceTree,
  sand: drawSandTree,
  cimetiere: drawCimetiereTree,
  lava: drawLavaTree,
  lavaland: drawLavaTree,
  rose: drawRoseTree,
  snow: (graphics, scale) => {
    // Alterner entre différents types d'arbres glacés
    const rand = Math.random();
    if (rand < 0.25) {
      drawSnowTree(graphics, scale);
    } else if (rand < 0.5) {
      drawCrystalIceTree(graphics, scale);
    } else if (rand < 0.75) {
      drawIceStalagmite(graphics, scale);
    } else if (rand < 0.9) {
      drawFrozenTree(graphics, scale);
    } else {
      drawIceColumn(graphics, scale);
    }
  },
  ice: (graphics, scale) => {
    // Alterner entre différents types d'arbres glacés pour le biome ice aussi
    const rand = Math.random();
    if (rand < 0.2) {
      drawIceTree(graphics, scale);
    } else if (rand < 0.4) {
      drawSnowTree(graphics, scale);
    } else if (rand < 0.6) {
      drawCrystalIceTree(graphics, scale);
    } else if (rand < 0.8) {
      drawIceStalagmite(graphics, scale);
    } else if (rand < 0.9) {
      drawFrozenTree(graphics, scale);
    } else {
      drawIceColumn(graphics, scale);
    }
  },
  laboratory: (graphics, scale) => {
    // Alterner entre arbre fiole et arbre maléfique
    if (Math.random() < 0.6) {
      drawLaboratoryTree(graphics, scale);
    } else {
      drawEvilTree(graphics, scale);
    }
  },
};

export function createTreeGraphics(scene, biome, scale) {
  const graphics = scene.add.graphics();
  const drawer = TREE_DRAWERS[biome] || TREE_DRAWERS.grass;
  drawer(graphics, scale);
  return graphics;
}
