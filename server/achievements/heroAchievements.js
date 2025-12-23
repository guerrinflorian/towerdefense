import { query } from "../db.js";

const HERO_RULES = {
  HERO_FIRST_BLOOD: {
    type: "run",
    value: (metrics) => metrics.heroKills,
    shouldUnlock: (metrics, achievement) =>
      metrics.heroKills >= Number(achievement.goal_value || 0),
  },
  HERO_KILLS_50_RUN: {
    type: "run",
    value: (metrics) => metrics.heroKills,
    shouldUnlock: (metrics, achievement) =>
      metrics.heroKills >= Number(achievement.goal_value || 0),
  },
  HERO_KILLS_100_RUN: {
    type: "run",
    value: (metrics) => metrics.heroKills,
    shouldUnlock: (metrics, achievement) =>
      metrics.heroKills >= Number(achievement.goal_value || 0),
  },
  HERO_KILLS_200_RUN: {
    type: "run",
    value: (metrics) => metrics.heroKills,
    shouldUnlock: (metrics, achievement) =>
      metrics.heroKills >= Number(achievement.goal_value || 0),
  },
  HERO_SPECTATOR: {
    type: "run",
    value: (metrics) => metrics.heroKills,
    shouldUnlock: (metrics) => metrics.heroKills === 0,
  },
  HERO_STREAK_50_RUN: {
    type: "run",
    value: (metrics) => metrics.bestKillStreak,
    shouldUnlock: (metrics, achievement) =>
      metrics.bestKillStreak >= Number(achievement.goal_value || 0),
  },
  HERO_IMMORTAL: {
    type: "run",
    value: (metrics) => metrics.heroDeaths,
    shouldUnlock: (metrics) => metrics.isWin && metrics.heroDeaths === 0,
  },
  HERO_DEATHS_10_PLUS: {
    type: "run",
    value: (metrics) => metrics.heroDeaths,
    shouldUnlock: (metrics, achievement) =>
      metrics.heroDeaths >= Number(achievement.goal_value || 0),
  },
  HERO_USELESS_BUT_ALIVE: {
    type: "run",
    value: (metrics) => metrics.heroKills,
    shouldUnlock: (metrics) =>
      metrics.heroKills === 0 && metrics.heroDeaths === 0,
  },
  HERO_KILLS_1000_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + Math.max(0, metrics.heroKills),
    lastIncrement: (metrics) => Math.max(0, metrics.heroKills),
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  HERO_KILLS_5000_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + Math.max(0, metrics.heroKills),
    lastIncrement: (metrics) => Math.max(0, metrics.heroKills),
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

function extractHeroMetrics(runReport = {}) {
  const heroKills = Number(
    runReport?.stats?.enemies?.killedBySource?.hero ?? 0
  );
  const heroDeaths = Number(runReport?.stats?.hero?.deaths ?? 0);
  const bestKillStreak = Number(runReport?.stats?.hero?.bestKillStreak ?? 0);
  const runResult =
    typeof runReport?.result === "string"
      ? runReport.result.toUpperCase()
      : "";
  const rawRunId = runReport?.runId ?? runReport?.id ?? null;
  const normalizedRunId =
    rawRunId === null || rawRunId === undefined
      ? null
      : String(rawRunId).slice(0, 64);

  return {
    heroKills: Number.isFinite(heroKills) && heroKills > 0 ? heroKills : 0,
    heroDeaths: Number.isFinite(heroDeaths) && heroDeaths > 0 ? heroDeaths : 0,
    bestKillStreak:
      Number.isFinite(bestKillStreak) && bestKillStreak > 0
        ? bestKillStreak
        : 0,
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

export async function evaluateHeroAchievements(
  playerId,
  runReport,
  client = null
) {
  const db = getDbExecutor(client);
  const metrics = extractHeroMetrics(runReport);

  const achievementsRes = await db.query(
    `SELECT id, code_name, title, goal_value 
     FROM achievements_ref 
     WHERE category = 'HERO'`
  );
  const achievements = achievementsRes.rows;

  const unknownCodes = achievements
    .map((a) => a.code_name)
    .filter((code) => !HERO_RULES[code]);
  if (unknownCodes.length > 0) {
    console.warn(
      "[achievements] Codes HERO non gérés détectés:",
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

    const rule = HERO_RULES[achievement.code_name];
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

    updateProgressState(achievement, currentValue, isUnlocked, lastIncrement);

    if (rule.type === "lifetime") {
      lifetimeUpdates.push({
        achievementId: achievement.id,
        currentValue,
        isUnlocked,
        lastIncrement,
      });
    } else {
      runUpdates.push({
        achievementId: achievement.id,
        currentValue,
        isUnlocked,
      });
    }
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
