import { query } from "../db.js";

const TOWER_RULES = {
  TOW_FIRST_BUILD: {
    type: "run",
    value: (metrics) => metrics.towersBuilt,
    shouldUnlock: (metrics, achievement) =>
      metrics.towersBuilt >= Number(achievement.goal_value || 0),
  },
  TOW_FIRST_UPGRADE: {
    type: "run",
    value: (metrics) => metrics.towersUpgraded,
    shouldUnlock: (metrics, achievement) =>
      metrics.towersUpgraded >= Number(achievement.goal_value || 0),
  },
  TOW_WIN_NO_SELLS: {
    type: "run",
    value: (metrics) => (metrics.noSells && metrics.isWin ? 1 : 0),
    shouldUnlock: (metrics) => metrics.isWin && metrics.noSells,
  },
  TOW_WIN_NO_UPGRADES: {
    type: "run",
    value: (metrics) => (metrics.noUpgrades && metrics.isWin ? 1 : 0),
    shouldUnlock: (metrics) => metrics.isWin && metrics.noUpgrades,
  },
  TOW_FIRST_TURRET_KILL: {
    type: "run",
    value: (metrics) => metrics.turretKillsTotal,
    shouldUnlock: (metrics, achievement) =>
      metrics.turretKillsTotal >= Number(achievement.goal_value || 0),
  },
  TOW_BUILD_BARRACKS_250_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + metrics.towersBuiltByType.barracks,
    lastIncrement: (metrics) => metrics.towersBuiltByType.barracks,
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  TOW_BUILD_CANNON_250_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + metrics.towersBuiltByType.cannon,
    lastIncrement: (metrics) => metrics.towersBuiltByType.cannon,
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  TOW_BUILD_MACHINE_GUN_250_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + metrics.towersBuiltByType.machine_gun,
    lastIncrement: (metrics) => metrics.towersBuiltByType.machine_gun,
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  TOW_BUILD_SNIPER_250_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + metrics.towersBuiltByType.sniper,
    lastIncrement: (metrics) => metrics.towersBuiltByType.sniper,
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  TOW_BUILD_ZAP_250_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + metrics.towersBuiltByType.zap,
    lastIncrement: (metrics) => metrics.towersBuiltByType.zap,
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  TOW_KILLS_CANNON_1000_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + metrics.turretKillsByType.cannon,
    lastIncrement: (metrics) => metrics.turretKillsByType.cannon,
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  TOW_KILLS_MACHINE_GUN_1000_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + metrics.turretKillsByType.machine_gun,
    lastIncrement: (metrics) => metrics.turretKillsByType.machine_gun,
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  TOW_KILLS_SNIPER_1000_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + metrics.turretKillsByType.sniper,
    lastIncrement: (metrics) => metrics.turretKillsByType.sniper,
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  TOW_KILLS_ZAP_1000_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + metrics.turretKillsByType.zap,
    lastIncrement: (metrics) => metrics.turretKillsByType.zap,
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  TOW_TURRET_KILLS_5000_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + metrics.turretKillsTotal,
    lastIncrement: (metrics) => metrics.turretKillsTotal,
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  TOW_SELL_50_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + metrics.towersSold,
    lastIncrement: (metrics) => metrics.towersSold,
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  TOW_MAXED_6_RUN: {
    type: "run",
    value: (metrics) => metrics.towersMaxed,
    shouldUnlock: (metrics, achievement) =>
      metrics.towersMaxed >= Number(achievement.goal_value || 0),
  },
  TOW_BUILD_BARRACKS_1000_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + metrics.towersBuiltByType.barracks,
    lastIncrement: (metrics) => metrics.towersBuiltByType.barracks,
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  TOW_BUILD_CANNON_1000_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + metrics.towersBuiltByType.cannon,
    lastIncrement: (metrics) => metrics.towersBuiltByType.cannon,
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  TOW_BUILD_MACHINE_GUN_1000_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + metrics.towersBuiltByType.machine_gun,
    lastIncrement: (metrics) => metrics.towersBuiltByType.machine_gun,
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  TOW_BUILD_SNIPER_1000_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + metrics.towersBuiltByType.sniper,
    lastIncrement: (metrics) => metrics.towersBuiltByType.sniper,
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  TOW_BUILD_ZAP_1000_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + metrics.towersBuiltByType.zap,
    lastIncrement: (metrics) => metrics.towersBuiltByType.zap,
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  TOW_KILLS_CANNON_5000_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + metrics.turretKillsByType.cannon,
    lastIncrement: (metrics) => metrics.turretKillsByType.cannon,
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  TOW_KILLS_MACHINE_GUN_5000_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + metrics.turretKillsByType.machine_gun,
    lastIncrement: (metrics) => metrics.turretKillsByType.machine_gun,
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  TOW_KILLS_SNIPER_5000_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + metrics.turretKillsByType.sniper,
    lastIncrement: (metrics) => metrics.turretKillsByType.sniper,
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  TOW_KILLS_ZAP_5000_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + metrics.turretKillsByType.zap,
    lastIncrement: (metrics) => metrics.turretKillsByType.zap,
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  TOW_TURRET_KILLS_20000_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + metrics.turretKillsTotal,
    lastIncrement: (metrics) => metrics.turretKillsTotal,
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  TOW_SELL_250_TOTAL: {
    type: "lifetime",
    value: (metrics, existing) =>
      (existing.current_value || 0) + metrics.towersSold,
    lastIncrement: (metrics) => metrics.towersSold,
    shouldUnlock: (metrics, achievement, currentValue) =>
      currentValue >= Number(achievement.goal_value || 0),
  },
  TOW_MAXED_15_RUN: {
    type: "run",
    value: (metrics) => metrics.towersMaxed,
    shouldUnlock: (metrics, achievement) =>
      metrics.towersMaxed >= Number(achievement.goal_value || 0),
  },
};

function getDbExecutor(client) {
  if (client && typeof client.query === "function") {
    return client;
  }
  return { query };
}

function normalizePositiveNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : 0;
}

function extractTowerMetrics(runReport = {}) {
  const stats = runReport?.stats || {};
  const towers = stats.towers || {};
  const enemies = stats.enemies || {};
  const killSources = enemies.killedBySource || {};
  const waves = Array.isArray(runReport?.waves) ? runReport.waves : [];

  const rawRunId = runReport?.runId ?? runReport?.id ?? null;
  const normalizedRunId =
    rawRunId === null || rawRunId === undefined
      ? null
      : String(rawRunId).slice(0, 64);

  const built = normalizePositiveNumber(towers.built);
  const upgrades = normalizePositiveNumber(towers.upgrades);
  const sold = normalizePositiveNumber(towers.sold);
  const maxed = normalizePositiveNumber(towers.maxed);

  const towersBuiltByType = {
    barracks: 0,
    cannon: 0,
    machine_gun: 0,
    sniper: 0,
    zap: 0,
  };
  const turretKillsByType = {
    barracks: 0,
    cannon: 0,
    machine_gun: 0,
    sniper: 0,
    zap: 0,
  };

  waves.forEach((wave) => {
    const placements =
      wave && wave.builds && typeof wave.builds.towersPlaced === "object"
        ? wave.builds.towersPlaced
        : null;
    if (!placements) return;
    Object.entries(placements).forEach(([key, count]) => {
      if (!Object.prototype.hasOwnProperty.call(towersBuiltByType, key)) return;
      const normalized = normalizePositiveNumber(count);
      towersBuiltByType[key] += normalized;
    });
  });

  const byType = towers.byType && typeof towers.byType === "object" ? towers.byType : {};
  Object.entries(byType).forEach(([key, value]) => {
    if (!Object.prototype.hasOwnProperty.call(towersBuiltByType, key)) return;
    const builtFromStats =
      value && typeof value === "object"
        ? normalizePositiveNumber(value.built)
        : normalizePositiveNumber(value);
    if (builtFromStats > towersBuiltByType[key]) {
      towersBuiltByType[key] = builtFromStats;
    }
    if (value && typeof value === "object") {
      turretKillsByType[key] = normalizePositiveNumber(value.kills);
    }
  });

  const turretKillsFromSource = normalizePositiveNumber(killSources.turret);
  const turretKillsFromTypes = Object.values(turretKillsByType).reduce(
    (sum, val) => sum + (Number.isFinite(val) ? val : 0),
    0
  );
  const turretKillsTotal = Math.max(turretKillsFromSource, turretKillsFromTypes);

  const runResult =
    typeof runReport?.result === "string" ? runReport.result.toUpperCase() : "";

  const noSellsFlag = runReport?.stats?.flags?.noSells !== false;
  const noUpgradesFlag = upgrades === 0 || runReport?.stats?.flags?.noUpgrades === true;

  return {
    towersBuilt: built,
    towersUpgraded: upgrades,
    towersSold: sold,
    towersMaxed: maxed,
    towersBuiltByType,
    turretKillsByType,
    turretKillsTotal,
    noSells: noSellsFlag,
    noUpgrades: noUpgradesFlag,
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

export async function evaluateTowerAchievements(
  playerId,
  runReport,
  client = null
) {
  const db = getDbExecutor(client);
  const metrics = extractTowerMetrics(runReport);

  const achievementsRes = await db.query(
    `SELECT id, code_name, title, goal_value 
     FROM achievements_ref 
     WHERE category = 'TOWERS'`
  );
  const achievements = achievementsRes.rows;

  const unknownCodes = achievements
    .map((a) => a.code_name)
    .filter((code) => !TOWER_RULES[code]);
  if (unknownCodes.length > 0) {
    console.warn(
      "[achievements] Codes TOWERS non gérés détectés:",
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

    const rule = TOWER_RULES[achievement.code_name];
    if (!rule) {
      updateProgressState(
        achievement,
        existing.current_value,
        existing.is_unlocked,
        existing.last_increment
      );
      continue;
    }

    const rawCurrentValue =
      rule.type === "lifetime"
        ? rule.value(metrics, existing)
        : rule.value(metrics, existing);

    const safeCurrentValue = Number.isFinite(rawCurrentValue)
      ? rawCurrentValue
      : existing.current_value;

    const lastIncrement =
      rule.type === "lifetime" && typeof rule.lastIncrement === "function"
        ? rule.lastIncrement(metrics)
        : existing.last_increment || 0;

    const willUnlock =
      rule.type === "lifetime"
        ? rule.shouldUnlock(metrics, achievement, safeCurrentValue)
        : rule.shouldUnlock(metrics, achievement, safeCurrentValue);

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
