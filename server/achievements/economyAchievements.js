import { query } from "../db.js";

const ECONOMY_RULES = {
  ECO_FIRST_GAIN: {
    type: "run",
    value: (metrics) => metrics.goldEarned,
    shouldUnlock: (metrics, achievement) =>
      metrics.goldEarned >= Number(achievement.goal_value || 0),
  },
  ECO_ECONOME_I: {
    type: "run",
    value: (metrics) => metrics.finalGold,
    shouldUnlock: (metrics, achievement) =>
      metrics.isWin && metrics.finalGold >= Number(achievement.goal_value || 0),
  },
  ECO_GROS_SALAIRE: {
    type: "run",
    value: (metrics) => metrics.goldEarned,
    shouldUnlock: (metrics, achievement) =>
      metrics.goldEarned >= Number(achievement.goal_value || 0),
  },
  ECO_ECONOME_II: {
    type: "run",
    value: (metrics) => metrics.finalGold,
    shouldUnlock: (metrics, achievement) =>
      metrics.isWin && metrics.finalGold >= Number(achievement.goal_value || 0),
  },
  ECO_DEPENSIER: {
    type: "run",
    value: (metrics) => metrics.goldSpent,
    shouldUnlock: (metrics, achievement) =>
      metrics.goldSpent >= Number(achievement.goal_value || 0),
  },
  ECO_ZERO_SPEND_WAVE: {
    type: "run",
    value: (metrics) => metrics.zeroSpendWaveCount,
    shouldUnlock: (metrics) => metrics.isWin && metrics.zeroSpendWaveCount > 0,
  },
  ECO_TOUT_CLAQUE: {
    type: "run",
    value: (metrics) => metrics.finalGold,
    shouldUnlock: (metrics) => metrics.isWin && metrics.finalGold === 0,
  },
  ECO_ECONOME_III: {
    type: "run",
    value: (metrics) => metrics.finalGold,
    shouldUnlock: (metrics, achievement) =>
      metrics.isWin && metrics.finalGold >= Number(achievement.goal_value || 0),
  },
  ECO_EARNED_20000_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + Math.max(0, metrics.goldEarned),
    lastIncrement: (metrics) => Math.max(0, metrics.goldEarned),
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  ECO_EARNED_80000_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + Math.max(0, metrics.goldEarned),
    lastIncrement: (metrics) => Math.max(0, metrics.goldEarned),
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  ECO_EARNED_250000_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + Math.max(0, metrics.goldEarned),
    lastIncrement: (metrics) => Math.max(0, metrics.goldEarned),
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

function extractEconomyMetrics(runReport = {}) {
  const goldStats = runReport?.stats?.economy?.gold || {};
  const rawRunId = runReport?.runId ?? runReport?.id ?? null;
  const normalizedRunId =
    rawRunId === null || rawRunId === undefined
      ? null
      : String(rawRunId).slice(0, 64);

  const waves = Array.isArray(runReport?.waves) ? runReport.waves : [];
  const zeroSpendWaveCount = waves.reduce((count, wave) => {
    const spent = Number(wave?.economy?.spent ?? 0);
    const started = wave?.startedAt || wave?.endedAt;
    if (started && Number.isFinite(spent) && spent === 0) {
      return count + 1;
    }
    return count;
  }, 0);

  const runResult =
    typeof runReport?.result === "string"
      ? runReport.result.toUpperCase()
      : "";

  const goldEarned = Number.isFinite(Number(goldStats.earned))
    ? Number(goldStats.earned)
    : 0;
  const goldSpent = Number.isFinite(Number(goldStats.spent))
    ? Number(goldStats.spent)
    : 0;
  const finalGold = Number.isFinite(Number(goldStats.final))
    ? Number(goldStats.final)
    : 0;

  return {
    goldEarned: Math.max(0, goldEarned),
    goldSpent: Math.max(0, goldSpent),
    finalGold: Math.max(0, finalGold),
    zeroSpendWaveCount: Math.max(0, zeroSpendWaveCount),
    isWin: runResult === "WIN",
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

export async function evaluateEconomyAchievements(
  playerId,
  runReport,
  client = null
) {
  const db = getDbExecutor(client);
  const metrics = extractEconomyMetrics(runReport);

  const achievementsRes = await db.query(
    `SELECT id, code_name, title, goal_value 
     FROM achievements_ref 
     WHERE category = 'ECONOMY'`
  );
  const achievements = achievementsRes.rows;

  const unknownCodes = achievements
    .map((a) => a.code_name)
    .filter((code) => !ECONOMY_RULES[code]);
  if (unknownCodes.length > 0) {
    console.warn(
      "[achievements] Codes ECONOMY non gérés détectés:",
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

    const rule = ECONOMY_RULES[achievement.code_name];
    if (!rule) {
      updateProgressState(
        achievement,
        existing.current_value,
        existing.is_unlocked,
        existing.last_increment
      );
      continue;
    }

    const currentValue =
      rule.type === "lifetime"
        ? rule.value(metrics, existing)
        : rule.value(metrics, existing);

    const lastIncrement =
      rule.type === "lifetime" && typeof rule.lastIncrement === "function"
        ? rule.lastIncrement(metrics)
        : existing.last_increment || 0;

    const willUnlock =
      rule.type === "lifetime"
        ? rule.shouldUnlock(metrics, achievement, currentValue)
        : rule.shouldUnlock(metrics, achievement, currentValue);

    const isUnlocked = willUnlock || existing.is_unlocked;
    const unlockedJustNow = willUnlock && !existing.is_unlocked;

    if (unlockedJustNow) {
      unlockedNow.push({
        id: achievement.id,
        code_name: achievement.code_name,
        title: achievement.title,
      });
    }

    const safeCurrentValue = Number.isFinite(currentValue)
      ? currentValue
      : existing.current_value;

    updateProgressState(achievement, safeCurrentValue, isUnlocked, lastIncrement);

    if (rule.type === "lifetime") {
      lifetimeUpdates.push({
        achievementId: achievement.id,
        currentValue: safeCurrentValue,
        isUnlocked,
        lastIncrement,
      });
    } else {
      runUpdates.push({
        achievementId: achievement.id,
        currentValue: safeCurrentValue,
        isUnlocked,
      });
    }
  }

  for (const update of runUpdates) {
    await db.query(
      `UPDATE player_achievement_progress
         SET current_value = $3,
             is_unlocked = CASE WHEN is_unlocked = TRUE THEN TRUE ELSE $4 END,
             unlocked_at = CASE WHEN $4 = TRUE AND is_unlocked = FALSE THEN COALESCE(unlocked_at, NOW()) ELSE unlocked_at END,
             last_run_at = NOW(),
             last_run_id = $5,
             unlocked_run_id = CASE WHEN $4 = TRUE AND is_unlocked = FALSE THEN COALESCE(unlocked_run_id, $5) ELSE unlocked_run_id END
       WHERE player_id = $1 AND achievement_id = $2`,
      [playerId, update.achievementId, update.currentValue, update.isUnlocked, metrics.runId]
    );
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
