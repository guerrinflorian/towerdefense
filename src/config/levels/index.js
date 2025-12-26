// src/levels/index.js

import { CHAPTER1_LEVELS } from "./chapter1/index.js";
import { CHAPTER2_LEVELS } from "./chapter2/index.js";

export const CHAPTER_LEVELS = {
  1: CHAPTER1_LEVELS,
  2: CHAPTER2_LEVELS,
};

export const LEVELS_CONFIG = Object.entries(CHAPTER_LEVELS).flatMap(
  ([chapterId, levels]) =>
    levels.map((level) => ({
      ...level,
      chapterId: Number(chapterId),
    }))
);

export function getLevelsByChapter(chapterId) {
  return CHAPTER_LEVELS[chapterId] || [];
}

export function getLevelConfigById(levelId) {
  const level = LEVELS_CONFIG.find((lvl) => lvl.id === Number(levelId));
  return level?.data || null;
}
