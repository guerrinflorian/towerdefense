import { apiClient } from "./apiClient.js";
import { fetchPlayerBestRuns } from "./leaderboardService.js";

let cachedChapters = null;
let chaptersPromise = null;
let cachedBestRuns = null;

function normalizeChapter(chapter) {
  if (!chapter) return null;
  const levels = (chapter.levels || []).map((lvl) => ({
    id: Number(lvl.id),
    chapterId: Number(lvl.chapter_id ?? lvl.chapterId ?? chapter.id),
    name: lvl.name,
    orderIndex: Number(lvl.order_index ?? lvl.orderIndex ?? lvl.id ?? 0),
  }));

  return {
    id: Number(chapter.id),
    name: chapter.name,
    orderIndex: Number(chapter.order_index ?? chapter.orderIndex ?? chapter.id ?? 0),
    unlockPrevChapterHeartsMax: chapter.unlock_prev_chapter_hearts_max ?? chapter.unlockPrevChapterHeartsMax ?? null,
    levels,
  };
}

export async function fetchChaptersWithLevels(forceReload = false) {
  if (cachedChapters && !forceReload) return cachedChapters;
  if (chaptersPromise && !forceReload) return chaptersPromise;

  chaptersPromise = apiClient
    .get("/api/chapters")
    .then((response) => {
      const raw = response.data?.chapters ?? response.data ?? [];
      const normalized = raw.map(normalizeChapter).filter(Boolean);
      // Tri cohérent pour l'affichage
      normalized.sort((a, b) => (a.orderIndex - b.orderIndex) || (a.id - b.id));
      cachedChapters = normalized;
      return normalized;
    })
    .finally(() => {
      chaptersPromise = null;
    });

  return chaptersPromise;
}

export function getCachedChapters() {
  return cachedChapters || [];
}

export async function fetchBestRunsMap() {
  if (cachedBestRuns) return cachedBestRuns;
  const runs = await fetchPlayerBestRuns().catch(() => []);
  cachedBestRuns = toBestRunMap(runs);
  return cachedBestRuns;
}

export function toBestRunMap(entries = []) {
  const map = new Map();
  entries.forEach((entry) => {
    const levelId = Number(entry.level_id ?? entry.levelId ?? entry.id);
    if (!levelId) return;
    map.set(levelId, {
      livesLost: Number(entry.lives_lost ?? entry.livesLost ?? 0),
      completionTimeMs: Number(entry.completion_time_ms ?? entry.completionTimeMs ?? 0),
      isWin: entry.is_win ?? entry.isWin ?? true,
    });
  });
  return map;
}

function sumHeartsForChapter(chapter, bestRunsMap) {
  return chapter.levels.reduce((sum, lvl) => {
    const best = bestRunsMap.get(lvl.id);
    return sum + (best ? best.livesLost : 0);
  }, 0);
}

function isChapterCleared(chapter, bestRunsMap) {
  if (!chapter || !chapter.levels.length) return false;
  return chapter.levels.every((lvl) => {
    const run = bestRunsMap.get(lvl.id);
    return Boolean(run?.isWin !== false); // best run est supposé être une victoire
  });
}

export function buildChapterViewModels(chapters = [], bestRunsMap = new Map()) {
  const sorted = [...chapters].sort((a, b) => (a.orderIndex - b.orderIndex) || (a.id - b.id));
  const chapterVMs = [];

  sorted.forEach((chapter, idx) => {
    const prevChapter = idx > 0 ? sorted[idx - 1] : null;
    let isLocked = false;
    let lockReason = "";

    if (prevChapter) {
      const prevCleared = isChapterCleared(prevChapter, bestRunsMap);
      const hearts = sumHeartsForChapter(prevChapter, bestRunsMap);
      const maxHearts = chapter.unlockPrevChapterHeartsMax;
      const heartsOk = maxHearts == null ? true : hearts <= Number(maxHearts);

      if (!prevCleared) {
        isLocked = true;
        lockReason = "Termine tous les niveaux du chapitre précédent.";
      } else if (!heartsOk) {
        isLocked = true;
        lockReason = `Perds au maximum ${maxHearts} cœurs sur le chapitre précédent.`;
      }
    }

    const levels = [...(chapter.levels || [])].sort((a, b) => (a.orderIndex - b.orderIndex) || (a.id - b.id));

    chapterVMs.push({
      ...chapter,
      isLocked,
      lockReason,
      levels,
      stats: {
        totalLevels: levels.length,
        clearedLevels: levels.filter((lvl) => bestRunsMap.has(lvl.id)).length,
        totalHeartsUsed: sumHeartsForChapter(chapter, bestRunsMap),
      },
    });
  });

  return chapterVMs;
}

export function buildLevelLocks(levels = [], chapterLocked = false, bestRunsMap = new Map()) {
  const locks = new Map();
  let previousCleared = !chapterLocked;

  levels.forEach((lvl, idx) => {
    const hasPrevious = idx > 0;
    const previousLevel = hasPrevious ? levels[idx - 1] : null;
    const previousWin = previousLevel ? Boolean(bestRunsMap.get(previousLevel.id)) : true;
    const isUnlocked = previousCleared && previousWin;
    locks.set(lvl.id, { isLocked: !isUnlocked, bestRun: bestRunsMap.get(lvl.id) || null });
    previousCleared = previousCleared && previousWin;
  });

  return locks;
}

export function resetCachedChapters() {
  cachedChapters = null;
  cachedBestRuns = null;
}
