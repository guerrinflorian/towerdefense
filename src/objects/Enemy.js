import { Chapter1Enemy } from "./enemies/chapter1/Chapter1Enemy.js";
import { Chapter2Enemy } from "./enemies/chapter2/Chapter2Enemy.js";
import { LEVELS_CONFIG } from "../config/levels/index.js";

// Fonction helper pour obtenir le chapitre depuis le levelID
function getChapterIdFromScene(scene) {
  if (scene?.levelID) {
    const level = LEVELS_CONFIG.find((lvl) => lvl.id === Number(scene.levelID));
    if (level) {
      return level.chapterId || 1;
    }
  }
  return 1; // Par défaut chapitre 1
}

// Classe Enemy qui détecte automatiquement le chapitre
export class Enemy {
  constructor(scene, path, typeKey) {
    const chapterId = getChapterIdFromScene(scene);
    
    // Créer l'ennemi avec la bonne classe
    if (chapterId === 2) {
      return new Chapter2Enemy(scene, path, typeKey);
    }
    
    // Par défaut, utiliser Chapter1Enemy
    return new Chapter1Enemy(scene, path, typeKey);
  }
}
