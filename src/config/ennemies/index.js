import { CHAPTER1_ENEMIES } from "./chapter1/index.js";
import { CHAPTER2_ENEMIES } from "./chapter2/index.js";

export const ENEMIES_BY_CHAPTER = {
  1: CHAPTER1_ENEMIES,
  2: CHAPTER2_ENEMIES,
};

export const ENEMIES = {
  ...CHAPTER1_ENEMIES,
  ...CHAPTER2_ENEMIES,
};

export function getEnemiesForChapter(chapterId) {
  return ENEMIES_BY_CHAPTER[chapterId] || {};
}
