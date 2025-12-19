import { pool, query } from "../db.js";

const DEFAULT_CONVERSION = {
  hp_per_point: 12,
  damage_per_point: 2,
  move_speed_per_point: 4,
};

export async function getHeroPointConversion(client = null) {
  const executor = client ? client.query.bind(client) : query;
  const conversionRes = await executor(
    "SELECT id, hp_per_point, damage_per_point, move_speed_per_point FROM hero_point_conversion ORDER BY id LIMIT 1"
  );

  return conversionRes.rows[0] || { ...DEFAULT_CONVERSION };
}

export async function upgradeHeroStats(playerId, { stat, points }) {
  const cleanPoints = Number(points || 0);
  if (!Number.isInteger(cleanPoints) || cleanPoints <= 0) {
    const error = new Error("INVALID_POINTS");
    error.code = "INVALID_POINTS";
    throw error;
  }

  const statKey = String(stat || "").toLowerCase();
  const allowedStats = ["hp", "damage", "move_speed"];
  if (!allowedStats.includes(statKey)) {
    const error = new Error("INVALID_STAT");
    error.code = "INVALID_STAT";
    throw error;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const conversion = await getHeroPointConversion(client);

    const playerRes = await client.query(
      "SELECT hero_points_available FROM players WHERE id = $1 FOR UPDATE",
      [playerId]
    );

    if (playerRes.rows.length === 0) {
      const error = new Error("PLAYER_NOT_FOUND");
      error.code = "PLAYER_NOT_FOUND";
      throw error;
    }

    const available = Number(playerRes.rows[0].hero_points_available || 0);
    if (available < cleanPoints) {
      const error = new Error("NOT_ENOUGH_POINTS");
      error.code = "NOT_ENOUGH_POINTS";
      throw error;
    }

    const deltaHp = statKey === "hp" ? conversion.hp_per_point * cleanPoints : 0;
    const deltaDamage = statKey === "damage" ? conversion.damage_per_point * cleanPoints : 0;
    const deltaSpeed = statKey === "move_speed" ? conversion.move_speed_per_point * cleanPoints : 0;

    const heroRes = await client.query(
      `UPDATE hero_stats
       SET max_hp = max_hp + $1,
           base_damage = base_damage + $2,
           move_speed = move_speed + $3,
           upgrade_points_spent = upgrade_points_spent + $4
       WHERE player_id = $5
       RETURNING *`,
      [deltaHp, deltaDamage, deltaSpeed, cleanPoints, playerId]
    );

    const pointsRes = await client.query(
      `UPDATE players
       SET hero_points_available = hero_points_available - $1
       WHERE id = $2
       RETURNING hero_points_available`,
      [cleanPoints, playerId]
    );

    await client.query("COMMIT");

    return {
      heroStats: heroRes.rows[0],
      heroPointsAvailable: pointsRes.rows[0].hero_points_available,
      heroPointConversion: conversion,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
