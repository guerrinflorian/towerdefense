import { pool, query } from "../db.js";
import { HERO_BASE_STATS } from "../constants.js";
import { getHeroPointConversion } from "./heroUpgrades.js";

async function ensureHeroStats(playerId) {
  const existing = await query(
    "SELECT * FROM hero_stats WHERE player_id = $1 LIMIT 1",
    [playerId]
  );
  if (existing.rows.length > 0) return existing.rows[0];

  const inserted = await query(
    `INSERT INTO hero_stats 
      (player_id, max_hp, base_damage, attack_interval_ms, move_speed, upgrade_points_spent)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      playerId,
      HERO_BASE_STATS.max_hp,
      HERO_BASE_STATS.base_damage,
      HERO_BASE_STATS.attack_interval_ms,
      HERO_BASE_STATS.move_speed,
      HERO_BASE_STATS.upgrade_points_spent,
    ]
  );
  return inserted.rows[0];
}

async function getProgress(playerId) {
  const result = await query(
    "SELECT COALESCE(MAX(level_id), 0) AS max_level FROM level_completions WHERE player_id = $1",
    [playerId]
  );
  const maxLevel = Number(result.rows[0]?.max_level || 0);
  return {
    maxLevel,
    unlockedLevel: Math.max(1, maxLevel + 1),
  };
}

export async function buildPlayerProfile(playerId) {
  const client = await pool.connect();
  try {
    const playerRes = await client.query(
      "SELECT id, username, email, hero_points_available FROM players WHERE id = $1",
      [playerId]
    );

    if (playerRes.rows.length === 0) {
      return null;
    }

    const heroStats = await ensureHeroStats(playerId);
    const heroPointConversion = await getHeroPointConversion(client);

    const progress = await getProgress(playerId);

    return {
      player: playerRes.rows[0],
      heroStats,
      heroPointConversion,
      progress,
    };
  } finally {
    client.release();
  }
}

export async function recordLevelCompletion(playerId, payload) {
  const {
    levelId,
    completionTimeMs,
    livesRemaining,
    wavesCompleted,
    moneyEarned,
    starsEarned,
    isPerfectRun,
  } = payload;

  await query(
    `INSERT INTO level_completions
      (player_id, level_id, completion_time_ms, lives_remaining, waves_completed, money_earned, stars_earned, is_perfect_run, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
    [
      playerId,
      levelId,
      completionTimeMs,
      livesRemaining,
      wavesCompleted,
      moneyEarned,
      starsEarned,
      isPerfectRun,
    ]
  );

  return getProgress(playerId);
}
