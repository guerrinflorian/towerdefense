import { CHAPTER1_ENEMIES } from "./chapter1/index.js";

export const ENEMIES_BY_CHAPTER = {
  1: CHAPTER1_ENEMIES,
};

export const ENEMIES = {
  ...CHAPTER1_ENEMIES,
};

export function getEnemiesForChapter(chapterId) {
  return ENEMIES_BY_CHAPTER[chapterId] || {};
}
