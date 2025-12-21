import { pool, query } from "../db.js";

const DEFAULT_CONVERSION = {
  hp_per_point: 12,
  damage_per_point: 2,
  move_speed_per_point: 4,
};

// Limites maximales des stats
const MAX_STATS = {
  max_hp: 2500,
  base_damage: 450,
  move_speed: 200,
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

    // Récupérer les stats actuelles pour vérifier les limites
    const currentStatsRes = await client.query(
      "SELECT max_hp, base_damage, move_speed FROM hero_stats WHERE player_id = $1",
      [playerId]
    );
    
    if (currentStatsRes.rows.length === 0) {
      const error = new Error("HERO_STATS_NOT_FOUND");
      error.code = "HERO_STATS_NOT_FOUND";
      throw error;
    }

    const currentStats = currentStatsRes.rows[0];
    const currentHp = Number(currentStats.max_hp || 0);
    const currentDamage = parseFloat(currentStats.base_damage || 0);
    const currentSpeed = Number(currentStats.move_speed || 0);

    // Convertir les valeurs de conversion en nombres (elles peuvent être des strings depuis la DB)
    const hpPerPoint = parseFloat(conversion.hp_per_point) || 0;
    const damagePerPoint = parseFloat(conversion.damage_per_point) || 0;
    const speedPerPoint = parseFloat(conversion.move_speed_per_point) || 0;

    // Calculer les deltas avec limitation aux maximums
    let deltaHp = 0;
    let deltaDamage = 0;
    let deltaSpeed = 0;
    
    if (statKey === "hp") {
      const potentialHp = currentHp + Math.round(hpPerPoint * cleanPoints);
      const maxHp = MAX_STATS.max_hp;
      deltaHp = Math.min(Math.round(hpPerPoint * cleanPoints), maxHp - currentHp);
      if (deltaHp <= 0) {
        const error = new Error("STAT_MAX_REACHED");
        error.code = "STAT_MAX_REACHED";
        error.message = `HP maximum atteint (${maxHp})`;
        throw error;
      }
    } else if (statKey === "damage") {
      const potentialDamage = currentDamage + parseFloat((damagePerPoint * cleanPoints).toFixed(2));
      const maxDamage = MAX_STATS.base_damage;
      deltaDamage = Math.min(parseFloat((damagePerPoint * cleanPoints).toFixed(2)), maxDamage - currentDamage);
      if (deltaDamage <= 0) {
        const error = new Error("STAT_MAX_REACHED");
        error.code = "STAT_MAX_REACHED";
        error.message = `Dégâts maximum atteint (${maxDamage})`;
        throw error;
      }
    } else if (statKey === "move_speed") {
      const potentialSpeed = currentSpeed + Math.round(speedPerPoint * cleanPoints);
      const maxSpeed = MAX_STATS.move_speed;
      deltaSpeed = Math.min(Math.round(speedPerPoint * cleanPoints), maxSpeed - currentSpeed);
      if (deltaSpeed <= 0) {
        const error = new Error("STAT_MAX_REACHED");
        error.code = "STAT_MAX_REACHED";
        error.message = `Agilité maximum atteinte (${maxSpeed})`;
        throw error;
      }
    }

    const heroRes = await client.query(
      `UPDATE hero_stats
       SET max_hp = max_hp + $1,
           base_damage = (base_damage + $2)::NUMERIC(10,2),
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

// Fonction batch pour traiter plusieurs améliorations en une seule transaction
export async function upgradeHeroStatsBatch(playerId, upgrades) {
  // Valider le format des upgrades
  if (!Array.isArray(upgrades) || upgrades.length === 0) {
    const error = new Error("INVALID_UPGRADES");
    error.code = "INVALID_UPGRADES";
    throw error;
  }

  // Valider chaque upgrade
  const allowedStats = ["hp", "damage", "move_speed"];
  for (const upgrade of upgrades) {
    const { stat, points } = upgrade || {};
    const cleanPoints = Number(points || 0);
    const statKey = String(stat || "").toLowerCase();
    
    if (!Number.isInteger(cleanPoints) || cleanPoints <= 0) {
      const error = new Error("INVALID_POINTS");
      error.code = "INVALID_POINTS";
      throw error;
    }
    
    if (!allowedStats.includes(statKey)) {
      const error = new Error("INVALID_STAT");
      error.code = "INVALID_STAT";
      throw error;
    }
  }

  // Accumuler les points par stat
  const statsMap = new Map();
  let totalPoints = 0;
  
  for (const upgrade of upgrades) {
    const { stat, points } = upgrade;
    const statKey = String(stat).toLowerCase();
    const cleanPoints = Number(points);
    
    const current = statsMap.get(statKey) || 0;
    statsMap.set(statKey, current + cleanPoints);
    totalPoints += cleanPoints;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const conversion = await getHeroPointConversion(client);

    // Vérifier les points disponibles
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
    if (available < totalPoints) {
      const error = new Error("NOT_ENOUGH_POINTS");
      error.code = "NOT_ENOUGH_POINTS";
      throw error;
    }

    // Récupérer les stats actuelles pour vérifier les limites
    const currentStatsRes = await client.query(
      "SELECT max_hp, base_damage, move_speed FROM hero_stats WHERE player_id = $1",
      [playerId]
    );
    
    if (currentStatsRes.rows.length === 0) {
      const error = new Error("HERO_STATS_NOT_FOUND");
      error.code = "HERO_STATS_NOT_FOUND";
      throw error;
    }

    const currentStats = currentStatsRes.rows[0];
    const currentHp = Number(currentStats.max_hp || 0);
    const currentDamage = parseFloat(currentStats.base_damage || 0);
    const currentSpeed = Number(currentStats.move_speed || 0);

    // Convertir les valeurs de conversion en nombres
    const hpPerPoint = parseFloat(conversion.hp_per_point) || 0;
    const damagePerPoint = parseFloat(conversion.damage_per_point) || 0;
    const speedPerPoint = parseFloat(conversion.move_speed_per_point) || 0;

    // Calculer les deltas totaux avec limitation aux maximums
    const totalHpPoints = statsMap.get("hp") || 0;
    const totalDamagePoints = statsMap.get("damage") || 0;
    const totalSpeedPoints = statsMap.get("move_speed") || 0;

    const potentialHp = currentHp + Math.round(hpPerPoint * totalHpPoints);
    const potentialDamage = currentDamage + parseFloat((damagePerPoint * totalDamagePoints).toFixed(2));
    const potentialSpeed = currentSpeed + Math.round(speedPerPoint * totalSpeedPoints);

    const deltaHp = Math.min(Math.round(hpPerPoint * totalHpPoints), MAX_STATS.max_hp - currentHp);
    const deltaDamage = Math.min(parseFloat((damagePerPoint * totalDamagePoints).toFixed(2)), MAX_STATS.base_damage - currentDamage);
    const deltaSpeed = Math.min(Math.round(speedPerPoint * totalSpeedPoints), MAX_STATS.move_speed - currentSpeed);

    // Vérifier qu'au moins une amélioration peut être appliquée
    if (deltaHp <= 0 && deltaDamage <= 0 && deltaSpeed <= 0) {
      const error = new Error("STAT_MAX_REACHED");
      error.code = "STAT_MAX_REACHED";
      error.message = "Toutes les stats ont atteint leur maximum";
      throw error;
    }

    // Appliquer toutes les améliorations en une seule requête
    const heroRes = await client.query(
      `UPDATE hero_stats
       SET max_hp = max_hp + $1,
           base_damage = (base_damage + $2)::NUMERIC(10,2),
           move_speed = move_speed + $3,
           upgrade_points_spent = upgrade_points_spent + $4
       WHERE player_id = $5
       RETURNING *`,
      [deltaHp, deltaDamage, deltaSpeed, totalPoints, playerId]
    );

    // Décrémenter les points disponibles
    const pointsRes = await client.query(
      `UPDATE players
       SET hero_points_available = hero_points_available - $1
       WHERE id = $2
       RETURNING hero_points_available`,
      [totalPoints, playerId]
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