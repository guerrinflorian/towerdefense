import { pool, query } from "../db.js";
import {
  computeFinalHeroStats,
  fetchHeroById,
  fetchPlayerHero,
  createPlayerHero,
} from "./heroes.js";

const DEFAULT_CONVERSION = {
  hp_per_point: 1,
  damage_per_point: 0.2,
  move_speed_per_point: 0.75,
};

export async function getHeroPointConversion(client = null) {
  const executor = client ? client.query.bind(client) : query;
  const conversionRes = await executor(
    "SELECT id, hp_per_point, damage_per_point, move_speed_per_point FROM hero_point_conversion ORDER BY id LIMIT 1"
  );

  return conversionRes.rows[0] || { ...DEFAULT_CONVERSION };
}

const ALLOWED_STATS = ["hp", "damage", "move_speed"];
const STAT_TO_COLUMN = {
  hp: "bonus_hp",
  damage: "bonus_damage",
  move_speed: "bonus_move_speed",
};
const STAT_TO_CAP = {
  hp: "max_hp",
  damage: "max_damage",
  move_speed: "max_move_speed",
};
const STAT_PER_POINT = {
  hp: "hp_per_point",
  damage: "damage_per_point",
  move_speed: "move_speed_per_point",
};

function normalizeNumber(value) {
  return value === null || value === undefined ? 0 : Number(value);
}

function validateUpgrades(upgrades) {
  if (!Array.isArray(upgrades) || upgrades.length === 0) {
    const error = new Error("INVALID_UPGRADES");
    error.code = "INVALID_UPGRADES";
    throw error;
  }

  for (const upgrade of upgrades) {
    const cleanPoints = Number(upgrade?.points || 0);
    const statKey = String(upgrade?.stat || "").toLowerCase();

    if (!Number.isInteger(cleanPoints) || cleanPoints <= 0) {
      const error = new Error("INVALID_POINTS");
      error.code = "INVALID_POINTS";
      throw error;
    }

    if (!ALLOWED_STATS.includes(statKey)) {
      const error = new Error("INVALID_STAT");
      error.code = "INVALID_STAT";
      throw error;
    }
  }
}

function buildUpgradePlan(hero, playerHero, conversion, upgrades) {
  const statsMap = new Map();
  for (const upgrade of upgrades) {
    const key = String(upgrade.stat).toLowerCase();
    const current = statsMap.get(key) || 0;
    statsMap.set(key, current + Number(upgrade.points));
  }

  const deltas = {
    bonus_hp: 0,
    bonus_damage: 0,
    bonus_move_speed: 0,
  };

  let pointsToSpend = 0;

  for (const [statKey, requestedPoints] of statsMap.entries()) {
    const perPoint = parseFloat(conversion[STAT_PER_POINT[statKey]] || 0);
    if (perPoint <= 0) continue;

    const column = STAT_TO_COLUMN[statKey];
    const capKey = STAT_TO_CAP[statKey];

    const baseValue =
      statKey === "hp"
        ? normalizeNumber(hero.base_hp)
        : statKey === "damage"
        ? normalizeNumber(hero.base_damage)
        : normalizeNumber(hero.base_move_speed);

    const currentBonus = normalizeNumber(playerHero[column]);
    const capValue =
      hero[capKey] === null || hero[capKey] === undefined
        ? null
        : Number(hero[capKey]);

    const currentTotal = baseValue + currentBonus;
    const desiredDelta = perPoint * requestedPoints;
    const allowedDelta =
      capValue === null ? desiredDelta : Math.min(desiredDelta, capValue - currentTotal);

    if (allowedDelta <= 0) continue;

    deltas[column] +=
      statKey === "damage" ? parseFloat(allowedDelta.toFixed(2)) : Math.round(allowedDelta);

    const appliedPoints = Math.min(
      requestedPoints,
      Math.ceil(allowedDelta / perPoint)
    );
    pointsToSpend += appliedPoints;
  }

  return { deltas, pointsToSpend };
}

export async function upgradeHeroStats(playerId, heroId, { stat, points }) {
  const cleanStat = String(stat || "").toLowerCase();
  return upgradeHeroStatsBatch(playerId, heroId, [{ stat: cleanStat, points }]);
}

export async function upgradeHeroStatsBatch(playerId, heroId, upgrades) {
  validateUpgrades(upgrades);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const hero = await fetchHeroById(client, heroId, { forUpdate: true });
    if (!hero) {
      const error = new Error("HERO_NOT_FOUND");
      error.code = "HERO_NOT_FOUND";
      throw error;
    }

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
    let playerHero = await fetchPlayerHero(client, playerId, heroId, {
      forUpdate: true,
    });
    if (!playerHero) {
      const cost = Number(hero.hero_points_to_unlock || 0);
      if (cost > 0) {
        const error = new Error("HERO_LOCKED");
        error.code = "HERO_LOCKED";
        throw error;
      }
      playerHero = await createPlayerHero(client, playerId, heroId);
    }

    const { deltas, pointsToSpend } = buildUpgradePlan(
      hero,
      playerHero,
      conversion,
      upgrades
    );

    if (pointsToSpend <= 0) {
      const error = new Error("STAT_MAX_REACHED");
      error.code = "STAT_MAX_REACHED";
      error.message = "Aucune amélioration supplémentaire possible pour ce héros";
      throw error;
    }

    if (available < pointsToSpend) {
      const error = new Error("NOT_ENOUGH_POINTS");
      error.code = "NOT_ENOUGH_POINTS";
      throw error;
    }

    const updatedHero = await client.query(
      `UPDATE player_heroes
       SET bonus_hp = bonus_hp + $1,
           bonus_damage = bonus_damage + $2,
           bonus_move_speed = bonus_move_speed + $3,
           upgrade_points_spent = upgrade_points_spent + $4
       WHERE player_id = $5 AND hero_id = $6
       RETURNING player_id, hero_id, bonus_hp, bonus_damage, bonus_attack_interval_ms, bonus_move_speed, kills, upgrade_points_spent`,
      [
        deltas.bonus_hp,
        deltas.bonus_damage,
        deltas.bonus_move_speed,
        pointsToSpend,
        playerId,
        heroId,
      ]
    );

    const pointsRes = await client.query(
      `UPDATE players
       SET hero_points_available = hero_points_available - $1
       WHERE id = $2
       RETURNING hero_points_available`,
      [pointsToSpend, playerId]
    );

    await client.query("COMMIT");

    const finalStats = computeFinalHeroStats(hero, updatedHero.rows[0]);

    return {
      playerHero: updatedHero.rows[0],
      heroPointsAvailable: pointsRes.rows[0].hero_points_available,
      heroPointConversion: conversion,
      finalStats,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
