import { pool, query } from "../db.js";
import { getHeroPointConversion } from "./heroUpgrades.js";

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

export async function buildPlayerProfile(playerId, heroId = null) {
  const client = await pool.connect();
  try {
    const playerRes = await client.query(
      "SELECT id, username, email, hero_points_available FROM players WHERE id = $1",
      [playerId]
    );

    if (playerRes.rows.length === 0) {
      return null;
    }

    const heroPointConversion = await getHeroPointConversion(client);

    // Récupérer les limites maximales/minimales du héros
    const heroLimitsRes = await client.query(
      `SELECT max_hp, max_damage, min_attack_interval_ms, max_move_speed
       FROM heroes WHERE id = $1`,
      [heroId]
    );

    const heroLimits = heroLimitsRes.rows[0] || {};
    const heroLimitsData = {
      max_hp: heroLimits.max_hp != null ? Number(heroLimits.max_hp) : null,
      max_damage: heroLimits.max_damage != null ? parseFloat(heroLimits.max_damage) : null,
      min_attack_interval_ms: heroLimits.min_attack_interval_ms != null ? Number(heroLimits.min_attack_interval_ms) : null,
      max_move_speed: heroLimits.max_move_speed != null ? Number(heroLimits.max_move_speed) : null,
    };

    const progress = await getProgress(playerId);

    return {
      player: playerRes.rows[0],
      heroPointConversion,
      heroLimits: heroLimitsData,
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
