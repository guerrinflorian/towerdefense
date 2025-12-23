import { query } from "../db.js";

const GLOBAL_RULES = {
  GLOBAL_FIRST_WIN: {
    type: "run",
    value: (metrics) => (metrics.isWin ? 1 : 0),
    shouldUnlock: (metrics) => metrics.isWin,
  },
  GLOBAL_BASE_DESTROYED: {
    type: "run",
    value: (metrics) => (metrics.isBaseDestroyed ? 1 : 0),
    shouldUnlock: (metrics) => metrics.isBaseDestroyed,
  },
  GLOBAL_SPEEDRUN_I: {
    type: "run",
    value: (metrics) => metrics.durationMs,
    shouldUnlock: (metrics, achievement) =>
      metrics.isWin &&
      metrics.durationMs > 0 &&
      metrics.durationMs <= Number(achievement.goal_value || 0),
  },
  GLOBAL_SPEEDRUN_II: {
    type: "run",
    value: (metrics) => metrics.durationMs,
    shouldUnlock: (metrics, achievement) =>
      metrics.isWin &&
      metrics.durationMs > 0 &&
      metrics.durationMs <= Number(achievement.goal_value || 0),
  },
  GLOBAL_SPEEDRUN_III: {
    type: "run",
    value: (metrics) => metrics.durationMs,
    shouldUnlock: (metrics, achievement) =>
      metrics.isWin &&
      metrics.durationMs > 0 &&
      metrics.durationMs <= Number(achievement.goal_value || 0),
  },
  GLOBAL_MARATHON: {
    type: "run",
    value: (metrics) => metrics.durationMs,
    shouldUnlock: (metrics, achievement) =>
      metrics.durationMs >= Number(achievement.goal_value || 0),
  },
  GLOBAL_BASE_INTACT: {
    type: "run",
    value: (metrics) => metrics.baseLivesLost,
    shouldUnlock: (metrics) =>
      metrics.isWin && metrics.baseLivesLost === 0,
  },
  GLOBAL_LAST_STAND: {
    type: "run",
    value: (metrics) => metrics.baseLivesEnd,
    shouldUnlock: (metrics) =>
      metrics.isWin && metrics.baseLivesEnd === 1,
  },
};

function getDbExecutor(client) {
  if (client && typeof client.query === "function") {
    return client;
  }
  return { query };
}

function extractGlobalMetrics(runReport = {}) {
  const runResult =
    typeof runReport?.result === "string"
      ? runReport.result.toUpperCase()
      : "";
  const reasonEndRaw =
    typeof runReport?.reasonEnd === "string" ? runReport.reasonEnd : "";
  const reasonEnd = reasonEndRaw.toLowerCase();
  const durationMs = Number(runReport?.durationMs ?? 0);
  const baseLivesLost = Number(runReport?.stats?.base?.livesLost ?? 0);
  const baseLivesEnd = Number(runReport?.stats?.base?.livesEnd ?? 0);

  const rawRunId = runReport?.runId ?? runReport?.id ?? null;
  const normalizedRunId =
    rawRunId === null || rawRunId === undefined
      ? null
      : String(rawRunId).slice(0, 64);

  return {
    isWin: runResult === "WIN",
    isBaseDestroyed: runResult === "LOSE" && reasonEnd === "base_destroyed",
    durationMs: Number.isFinite(durationMs) ? Math.max(0, durationMs) : 0,
    baseLivesLost:
      Number.isFinite(baseLivesLost) && baseLivesLost > 0
        ? baseLivesLost
        : 0,
    baseLivesEnd: Number.isFinite(baseLivesEnd) ? baseLivesEnd : 0,
    runId: normalizedRunId,
  };
}

function buildProgressResponse(achievements, progressState) {
  return achievements.map((achievement) => {
    const progress = progressState.get(achievement.id);
    return {
      achievement_id: achievement.id,
      code_name: achievement.code_name,
      current_value: progress?.current_value ?? 0,
      is_unlocked: Boolean(progress?.is_unlocked),
    };
  });
}

export async function evaluateGlobalAchievements(
  playerId,
  runReport,
  client = null
) {
  const db = getDbExecutor(client);
  const metrics = extractGlobalMetrics(runReport);

  const achievementsRes = await db.query(
    `SELECT id, code_name, title, goal_value 
     FROM achievements_ref 
     WHERE category = 'GLOBAL'`
  );
  const achievements = achievementsRes.rows;

  const unknownCodes = achievements
    .map((a) => a.code_name)
    .filter((code) => !GLOBAL_RULES[code]);
  if (unknownCodes.length > 0) {
    console.warn(
      "[achievements] Codes GLOBAL non gérés détectés:",
      unknownCodes.join(", ")
    );
  }

  if (achievements.length === 0) {
    return { unlocked: [], progress: [] };
  }

  const achievementIds = achievements.map((a) => a.id);
  const progressRes = await db.query(
    `SELECT achievement_id, current_value, is_unlocked, unlocked_at, last_increment
     FROM player_achievement_progress
     WHERE player_id = $1 AND achievement_id = ANY($2::INT[])`,
    [playerId, achievementIds]
  );

  const progressMap = new Map(
    progressRes.rows.map((row) => [
      row.achievement_id,
      {
        current_value: Number(row.current_value ?? 0),
        is_unlocked: row.is_unlocked,
        unlocked_at: row.unlocked_at,
        last_increment: Number(row.last_increment ?? 0),
      },
    ])
  );

  const unlockedNow = [];
  const progressState = new Map();
  const runUpdates = [];

  const updateProgressState = (achievement, currentValue, isUnlocked) => {
    progressState.set(achievement.id, {
      current_value: currentValue,
      is_unlocked: isUnlocked,
      last_increment: 0,
    });
  };

  for (const achievement of achievements) {
    const existing =
      progressMap.get(achievement.id) || {
        current_value: 0,
        is_unlocked: false,
        unlocked_at: null,
        last_increment: 0,
      };

    if (existing.is_unlocked) {
      updateProgressState(achievement, existing.current_value, true);
      continue;
    }

    const rule = GLOBAL_RULES[achievement.code_name];
    if (!rule) {
      updateProgressState(
        achievement,
        existing.current_value,
        existing.is_unlocked
      );
      continue;
    }

    const rawCurrentValue = rule.value(metrics, existing);

    const safeCurrentValue = Number.isFinite(rawCurrentValue)
      ? rawCurrentValue
      : existing.current_value;

    const willUnlock = rule.shouldUnlock(
      metrics,
      achievement,
      safeCurrentValue
    );

    const isUnlocked = willUnlock || existing.is_unlocked;
    const unlockedJustNow = willUnlock && !existing.is_unlocked;

    if (unlockedJustNow) {
      unlockedNow.push({
        id: achievement.id,
        code_name: achievement.code_name,
        title: achievement.title,
      });
    }

    updateProgressState(achievement, safeCurrentValue, isUnlocked);

    runUpdates.push({
      achievementId: achievement.id,
      currentValue: safeCurrentValue,
      isUnlocked,
    });
  }

  for (const update of runUpdates) {
    await db.query(
      `UPDATE player_achievement_progress
         SET current_value = $3,
             is_unlocked = $4,
             unlocked_at = CASE WHEN $4 THEN COALESCE(unlocked_at, NOW()) ELSE unlocked_at END,
             last_run_at = NOW(),
             last_run_id = $5,
             unlocked_run_id = CASE WHEN $4 THEN COALESCE(unlocked_run_id, $5) ELSE unlocked_run_id END
       WHERE player_id = $1 AND achievement_id = $2 AND is_unlocked = FALSE`,
      [
        playerId,
        update.achievementId,
        update.currentValue,
        update.isUnlocked,
        metrics.runId,
      ]
    );
  }

  return {
    unlocked: unlockedNow,
    progress: buildProgressResponse(achievements, progressState),
  };
}
