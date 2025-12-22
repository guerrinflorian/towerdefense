import { query } from "../db.js";

const DEFAULT_MAX_LIVES = 20;

export async function fetchChaptersWithLevelsFromDb() {
  const res = await query(
    `SELECT 
        c.id AS chapter_id,
        c.name AS chapter_name,
        c.order_index AS chapter_order_index,
        c.unlock_prev_chapter_hearts_max,
        l.id AS level_id,
        l.name AS level_name,
        l.order_index AS level_order_index
     FROM chapters c
     LEFT JOIN levels l ON l.chapter_id = c.id
     ORDER BY c.order_index, c.id, l.order_index NULLS LAST, l.id`
  );

  const map = new Map();
  res.rows.forEach((row) => {
    const chapterId = Number(row.chapter_id);
    if (!map.has(chapterId)) {
      map.set(chapterId, {
        id: chapterId,
        name: row.chapter_name,
        order_index: Number(row.chapter_order_index ?? chapterId),
        unlock_prev_chapter_hearts_max: row.unlock_prev_chapter_hearts_max,
        levels: [],
      });
    }
    if (row.level_id) {
      map.get(chapterId).levels.push({
        id: Number(row.level_id),
        name: row.level_name,
        chapter_id: chapterId,
        order_index: Number(row.level_order_index ?? row.level_id),
      });
    }
  });

  return Array.from(map.values());
}

export async function fetchBestRunsForPlayer(playerId) {
  const res = await query(
    `WITH ranked AS (
        SELECT 
          lc.level_id,
          ( $2::INT - COALESCE(lc.lives_remaining, $2::INT) ) AS lives_lost,
          lc.completion_time_ms,
          lc.created_at,
          ROW_NUMBER() OVER (
            PARTITION BY lc.level_id 
            ORDER BY ($2::INT - COALESCE(lc.lives_remaining, $2::INT)), lc.completion_time_ms, lc.created_at
          ) AS rn
        FROM level_completions lc
        WHERE lc.player_id = $1
      )
      SELECT level_id, lives_lost, completion_time_ms, created_at
      FROM ranked
      WHERE rn = 1`,
    [playerId, DEFAULT_MAX_LIVES]
  );

  return res.rows.map((row) => ({
    levelId: Number(row.level_id),
    livesLost: Number(row.lives_lost || 0),
    completionTimeMs: Number(row.completion_time_ms || 0),
    createdAt: row.created_at,
  }));
}

function computeChapterLocks(chapters, bestRunsMap) {
  const sorted = [...chapters].sort(
    (a, b) =>
      (a.order_index ?? a.id ?? 0) - (b.order_index ?? b.id ?? 0) ||
      (a.id - b.id)
  );

  let previousChapter = null;
  return sorted.map((chapter) => {
    const levels = [...(chapter.levels || [])].sort(
      (a, b) =>
        (a.order_index ?? a.id ?? 0) - (b.order_index ?? b.id ?? 0) ||
        (a.id - b.id)
    );

    const stats = {
      totalLevels: levels.length,
      clearedLevels: 0,
      totalHeartsUsed: 0,
    };

    levels.forEach((lvl) => {
      const run = bestRunsMap.get(lvl.id);
      if (run) {
        stats.clearedLevels += 1;
        stats.totalHeartsUsed += run.livesLost || 0;
      }
    });

    let isLocked = false;
    let lockReason = "";
    if (!previousChapter) {
      isLocked = false;
    } else {
      const prevLevels = previousChapter.levels || [];
      const prevAllCleared = prevLevels.every((lvl) => bestRunsMap.has(lvl.id));
      const heartsMax = chapter.unlock_prev_chapter_hearts_max;
      const heartsUsedPrev = (previousChapter.stats || {}).totalHeartsUsed ?? 0;
      const heartsOk =
        heartsMax == null ? true : heartsUsedPrev <= Number(heartsMax);

      if (!prevAllCleared) {
        isLocked = true;
        lockReason = "Termine tous les niveaux du chapitre précédent.";
      } else if (!heartsOk) {
        isLocked = true;
        lockReason = `Perds au maximum ${heartsMax} cœurs sur le chapitre précédent.`;
      }
    }

    const enriched = {
      ...chapter,
      levels,
      stats,
      is_locked: isLocked,
      lock_reason: lockReason,
    };

    previousChapter = enriched;
    return enriched;
  });
}

export function buildChapterProgress(chapters, bestRuns) {
  const bestRunsMap = new Map(
    bestRuns.map((run) => [Number(run.levelId), run])
  );
  const chaptersWithLocks = computeChapterLocks(chapters, bestRunsMap);
  return { chapters: chaptersWithLocks, bestRuns };
}
