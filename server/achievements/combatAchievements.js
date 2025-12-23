import { query } from "../db.js";

const COMBAT_RULES = {
  COMBAT_CLEANUP_I: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + Math.max(0, metrics.enemiesKilled),
    lastIncrement: (metrics) => Math.max(0, metrics.enemiesKilled),
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  COMBAT_CLEANUP_II: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + Math.max(0, metrics.enemiesKilled),
    lastIncrement: (metrics) => Math.max(0, metrics.enemiesKilled),
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  COMBAT_CLEANUP_III: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + Math.max(0, metrics.enemiesKilled),
    lastIncrement: (metrics) => Math.max(0, metrics.enemiesKilled),
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
};

function getDbExecutor(client) {
  if (client && typeof client.query === "function") {
    return client;
  }
  return { query };
}

function extractCombatMetrics(runReport = {}) {
  const enemiesKilled = Number(runReport?.stats?.enemies?.killed ?? 0);
  const rawRunId = runReport?.runId ?? runReport?.id ?? null;
  const normalizedRunId =
    rawRunId === null || rawRunId === undefined
      ? null
      : String(rawRunId).slice(0, 64);

  return {
    enemiesKilled: Number.isFinite(enemiesKilled) ? Math.max(0, enemiesKilled) : 0,
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

export async function evaluateCombatAchievements(
  playerId,
  runReport,
  client = null
) {
  const db = getDbExecutor(client);
  const metrics = extractCombatMetrics(runReport);

  const achievementsRes = await db.query(
    `SELECT id, code_name, title, goal_value
     FROM achievements_ref
     WHERE category = 'COMBAT'`
  );
  const achievements = achievementsRes.rows;

  const unknownCodes = achievements
    .map((a) => a.code_name)
    .filter((code) => !COMBAT_RULES[code]);
  if (unknownCodes.length > 0) {
    console.warn(
      "[achievements] Codes COMBAT non gérés détectés:",
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
  const lifetimeUpdates = [];

  const updateProgressState = (
    achievement,
    currentValue,
    isUnlocked,
    lastIncrement = 0
  ) => {
    progressState.set(achievement.id, {
      current_value: currentValue,
      is_unlocked: isUnlocked,
      last_increment: lastIncrement,
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
      updateProgressState(
        achievement,
        existing.current_value,
        true,
        existing.last_increment
      );
      continue;
    }

    const rule = COMBAT_RULES[achievement.code_name];
    if (!rule) {
      updateProgressState(
        achievement,
        existing.current_value,
        existing.is_unlocked,
        existing.last_increment
      );
      continue;
    }

    const rawCurrentValue = rule.value(metrics, existing);

    const safeCurrentValue = Number.isFinite(rawCurrentValue)
      ? rawCurrentValue
      : existing.current_value;

    const lastIncrement =
      rule.type === "lifetime" && typeof rule.lastIncrement === "function"
        ? rule.lastIncrement(metrics)
        : existing.last_increment || 0;

    const willUnlock = rule.shouldUnlock(metrics, achievement, safeCurrentValue);

    const isUnlocked = willUnlock || existing.is_unlocked;
    const unlockedJustNow = willUnlock && !existing.is_unlocked;

    if (unlockedJustNow) {
      unlockedNow.push({
        id: achievement.id,
        code_name: achievement.code_name,
        title: achievement.title,
      });
    }

    updateProgressState(achievement, safeCurrentValue, isUnlocked, lastIncrement);

    lifetimeUpdates.push({
      achievementId: achievement.id,
      currentValue: safeCurrentValue,
      isUnlocked,
      lastIncrement,
    });
  }

  for (const update of lifetimeUpdates) {
    await db.query(
      `UPDATE player_achievement_progress
         SET current_value = $3,
             last_increment = $4,
             is_unlocked = $5,
             unlocked_at = CASE WHEN $5 THEN COALESCE(unlocked_at, NOW()) ELSE unlocked_at END,
             last_run_at = NOW(),
             last_run_id = $6,
             unlocked_run_id = CASE WHEN $5 THEN COALESCE(unlocked_run_id, $6) ELSE unlocked_run_id END
       WHERE player_id = $1 AND achievement_id = $2 AND is_unlocked = FALSE`,
      [
        playerId,
        update.achievementId,
        update.currentValue,
        update.lastIncrement,
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
