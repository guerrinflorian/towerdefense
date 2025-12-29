import { pool, query } from "../db.js";

const DEFAULT_CONVERSION = {
  hp_per_point: 1,
  damage_per_point: 0.2,
  move_speed_per_point: 0.75,
  attack_interval_ms_per_point: 10, // Valeur par défaut : 10ms de réduction par point
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
    "SELECT id, hp_per_point, damage_per_point, move_speed_per_point, attack_interval_ms_per_point FROM hero_point_conversion ORDER BY id LIMIT 1"
  );

  const result = conversionRes.rows[0] || { ...DEFAULT_CONVERSION };
  // S'assurer que attack_interval_ms_per_point existe même si pas dans la DB
  if (!result.attack_interval_ms_per_point) {
    result.attack_interval_ms_per_point = DEFAULT_CONVERSION.attack_interval_ms_per_point || 0;
  }
  return result;
}

export async function upgradeHeroStats(playerId, { stat, points, heroId = 1 }) {
  const cleanPoints = Number(points || 0);
  const selectedHeroId = Number(heroId) || 1;
  
  if (!Number.isInteger(cleanPoints) || cleanPoints <= 0) {
    const error = new Error("INVALID_POINTS");
    error.code = "INVALID_POINTS";
    throw error;
  }

  const statKey = String(stat || "").toLowerCase();
  const allowedStats = ["hp", "damage", "move_speed", "attack_interval_ms"];
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

    // Récupérer les stats de base du héros et les bonus actuels
    const heroStatsRes = await client.query(
      `SELECT 
        h.base_hp, h.base_damage, h.base_attack_interval_ms, h.base_move_speed,
        h.max_hp, h.max_damage, h.min_attack_interval_ms, h.max_move_speed,
        COALESCE(ph.bonus_hp, 0) AS bonus_hp,
        COALESCE(ph.bonus_damage, 0) AS bonus_damage,
        COALESCE(ph.bonus_move_speed, 0) AS bonus_move_speed,
        COALESCE(ph.upgrade_points_spent, 0) AS upgrade_points_spent
       FROM heroes h
       LEFT JOIN player_heroes ph ON ph.player_id = $1 AND ph.hero_id = h.id
       WHERE h.id = $2`,
      [playerId, selectedHeroId]
    );
    
    if (heroStatsRes.rows.length === 0) {
      const error = new Error("HERO_NOT_FOUND");
      error.code = "HERO_NOT_FOUND";
      throw error;
    }

    const heroData = heroStatsRes.rows[0];
    
    // Calculer les stats actuelles (base + bonus, ou base - bonus pour attack_interval_ms)
    const currentHp = heroData.base_hp + (heroData.bonus_hp || 0);
    const currentDamage = parseFloat(heroData.base_damage) + parseFloat(heroData.bonus_damage || 0);
    // Utiliser parseFloat pour gérer les valeurs décimales de bonus_attack_interval_ms
    const currentAttackInterval = parseFloat(heroData.base_attack_interval_ms) - parseFloat(heroData.bonus_attack_interval_ms || 0);
    // S'assurer que bonus_move_speed n'est pas négatif (corriger les valeurs corrompues)
    const bonusMoveSpeed = Math.max(0, Number(heroData.bonus_move_speed || 0));
    const currentSpeed = Number(heroData.base_move_speed || 0) + bonusMoveSpeed;

    // Convertir les valeurs de conversion en nombres (elles peuvent être des strings depuis la DB)
    const hpPerPoint = parseFloat(conversion.hp_per_point) || 0;
    const damagePerPoint = parseFloat(conversion.damage_per_point) || 0;
    // Utiliser la valeur par défaut si attack_interval_ms_per_point est null, undefined, ou 0
    // Mais attention : 0.01 est truthy, donc on doit vérifier explicitement
    const rawAttackIntervalPerPoint = conversion.attack_interval_ms_per_point;
    const attackIntervalPerPoint = (rawAttackIntervalPerPoint != null && rawAttackIntervalPerPoint !== '') 
      ? parseFloat(rawAttackIntervalPerPoint) 
      : DEFAULT_CONVERSION.attack_interval_ms_per_point;
    const speedPerPoint = parseFloat(conversion.move_speed_per_point) || 0;

    // Calculer les deltas avec limitation aux caps du héros
    let deltaHp = 0;
    let deltaDamage = 0;
    let deltaAttackInterval = 0;
    let deltaSpeed = 0;
    
    const maxHp = heroData.max_hp != null ? heroData.max_hp : MAX_STATS.max_hp;
    const maxDamage = heroData.max_damage != null ? parseFloat(heroData.max_damage) : MAX_STATS.base_damage;
    const minAttackInterval = heroData.min_attack_interval_ms != null ? parseFloat(heroData.min_attack_interval_ms) : 500;
    const maxSpeed = heroData.max_move_speed != null ? heroData.max_move_speed : MAX_STATS.move_speed;
    
    if (statKey === "hp") {
      const potentialHp = currentHp + Math.round(hpPerPoint * cleanPoints);
      const cappedHp = heroData.max_hp != null ? Math.min(potentialHp, maxHp) : potentialHp;
      deltaHp = Math.min(Math.round(hpPerPoint * cleanPoints), cappedHp - currentHp);
      if (deltaHp <= 0) {
        const error = new Error("STAT_MAX_REACHED");
        error.code = "STAT_MAX_REACHED";
        error.message = `HP maximum atteint (${cappedHp})`;
        throw error;
      }
    } else if (statKey === "damage") {
      const potentialDamage = currentDamage + parseFloat((damagePerPoint * cleanPoints).toFixed(2));
      const cappedDamage = heroData.max_damage != null ? Math.min(potentialDamage, maxDamage) : potentialDamage;
      deltaDamage = Math.min(parseFloat((damagePerPoint * cleanPoints).toFixed(2)), cappedDamage - currentDamage);
      if (deltaDamage <= 0) {
        const error = new Error("STAT_MAX_REACHED");
        error.code = "STAT_MAX_REACHED";
        error.message = `Dégâts maximum atteint (${cappedDamage})`;
        throw error;
      }
    } else if (statKey === "attack_interval_ms") {
      // Pour attack_interval_ms, on soustrait (plus bas = mieux)
      // Utiliser une précision décimale pour les petites valeurs (ex: 0.01)
      const reductionAmount = parseFloat((attackIntervalPerPoint * cleanPoints).toFixed(2));
      const potentialInterval = currentAttackInterval - reductionAmount;
      const cappedInterval = Math.max(potentialInterval, minAttackInterval);
      // deltaAttackInterval = la réduction réelle appliquée (peut être décimale)
      deltaAttackInterval = Math.min(reductionAmount, currentAttackInterval - cappedInterval);
      if (deltaAttackInterval <= 0) {
        const error = new Error("STAT_MAX_REACHED");
        error.code = "STAT_MAX_REACHED";
        error.message = `Vitesse de frappe maximum atteinte (${(cappedInterval / 1000).toFixed(2)}s)`;
        throw error;
      }
    } else if (statKey === "move_speed") {
      // S'assurer que currentSpeed est valide (>= 0)
      const validCurrentSpeed = Math.max(0, currentSpeed);
      const potentialSpeed = validCurrentSpeed + Math.round(speedPerPoint * cleanPoints);
      const cappedSpeed = heroData.max_move_speed != null ? Math.min(potentialSpeed, maxSpeed) : potentialSpeed;
      deltaSpeed = Math.min(Math.round(speedPerPoint * cleanPoints), cappedSpeed - validCurrentSpeed);
      if (deltaSpeed <= 0) {
        const error = new Error("STAT_MAX_REACHED");
        error.code = "STAT_MAX_REACHED";
        error.message = `Agilité maximum atteinte (${cappedSpeed})`;
        throw error;
      }
      // S'assurer que deltaSpeed est positif
      deltaSpeed = Math.max(0, deltaSpeed);
    }

    // Créer ou mettre à jour player_heroes
    // NOTE: La colonne bonus_attack_interval_ms doit être de type NUMERIC ou DECIMAL dans la DB pour accepter les valeurs décimales
    const playerHeroRes = await client.query(
      `INSERT INTO player_heroes (player_id, hero_id, bonus_hp, bonus_damage, bonus_attack_interval_ms, bonus_move_speed, upgrade_points_spent, kills, is_selected)
       VALUES ($1, $2, 
         CASE WHEN $3 = 'hp' THEN $4 ELSE 0 END,
         CASE WHEN $3 = 'damage' THEN $5 ELSE 0 END,
         CASE WHEN $3 = 'attack_interval_ms' THEN $6::numeric ELSE 0 END,
         CASE WHEN $3 = 'move_speed' THEN $7 ELSE 0 END,
         $8, 0, false)
       ON CONFLICT (player_id, hero_id) DO UPDATE SET
         bonus_hp = player_heroes.bonus_hp + CASE WHEN $3 = 'hp' THEN $4 ELSE 0 END,
         bonus_damage = player_heroes.bonus_damage + CASE WHEN $3 = 'damage' THEN $5 ELSE 0 END,
         bonus_attack_interval_ms = player_heroes.bonus_attack_interval_ms + CASE WHEN $3 = 'attack_interval_ms' THEN $6::numeric ELSE 0 END,
         bonus_move_speed = player_heroes.bonus_move_speed + CASE WHEN $3 = 'move_speed' THEN $7 ELSE 0 END,
         upgrade_points_spent = player_heroes.upgrade_points_spent + $8
       RETURNING *`,
      [playerId, selectedHeroId, statKey, deltaHp, deltaDamage, parseFloat(deltaAttackInterval), deltaSpeed, cleanPoints]
    );
    
    // Récupérer les stats finales calculées
    const finalStatsRes = await client.query(
      `SELECT 
        h.base_hp + COALESCE(ph.bonus_hp, 0) AS max_hp,
        h.base_damage + COALESCE(ph.bonus_damage, 0) AS base_damage,
        GREATEST(h.base_attack_interval_ms - COALESCE(ph.bonus_attack_interval_ms, 0), COALESCE(h.min_attack_interval_ms, 0)) AS attack_interval_ms,
        h.base_move_speed + COALESCE(ph.bonus_move_speed, 0) AS move_speed,
        COALESCE(ph.upgrade_points_spent, 0) AS upgrade_points_spent,
        COALESCE(ph.kills, 0) AS kills,
        COALESCE(ph.color, h.color) AS color
       FROM heroes h
       LEFT JOIN player_heroes ph ON ph.player_id = $1 AND ph.hero_id = h.id
       WHERE h.id = $2`,
      [playerId, selectedHeroId]
    );
    
    const heroRes = { rows: finalStatsRes.rows };

    const pointsRes = await client.query(
      `UPDATE players
       SET hero_points_available = hero_points_available - $1
       WHERE id = $2
       RETURNING hero_points_available`,
      [cleanPoints, playerId]
    );

    await client.query("COMMIT");

    // Appliquer les caps si nécessaire et parser les valeurs NUMERIC (strings)
    const finalRow = finalStatsRes.rows[0];
    const parsedRow = {
      max_hp: Number(finalRow.max_hp) || 0,
      base_damage: parseFloat(finalRow.base_damage) || 0,
      attack_interval_ms: Number(finalRow.attack_interval_ms) || 0,
      move_speed: Number(finalRow.move_speed) || 0,
      upgrade_points_spent: Number(finalRow.upgrade_points_spent) || 0,
      kills: Number(finalRow.kills) || 0,
      color: finalRow.color || "#2b2b2b",
    };
    
    if (heroData.max_hp != null && parsedRow.max_hp > Number(heroData.max_hp)) {
      parsedRow.max_hp = Number(heroData.max_hp);
    }
    if (heroData.max_damage != null && parsedRow.base_damage > parseFloat(heroData.max_damage)) {
      parsedRow.base_damage = parseFloat(heroData.max_damage);
    }
    if (heroData.min_attack_interval_ms != null && parsedRow.attack_interval_ms < Number(heroData.min_attack_interval_ms)) {
      parsedRow.attack_interval_ms = Number(heroData.min_attack_interval_ms);
    }
    if (heroData.max_move_speed != null && parsedRow.move_speed > Number(heroData.max_move_speed)) {
      parsedRow.move_speed = Number(heroData.max_move_speed);
    }
    
    return {
      heroStats: parsedRow,
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
export async function upgradeHeroStatsBatch(playerId, upgrades, heroId = 1) {
  const selectedHeroId = Number(heroId) || 1;
  // Valider le format des upgrades
  if (!Array.isArray(upgrades) || upgrades.length === 0) {
    const error = new Error("INVALID_UPGRADES");
    error.code = "INVALID_UPGRADES";
    throw error;
  }

  // Valider chaque upgrade
  const allowedStats = ["hp", "damage", "move_speed", "attack_interval_ms"];
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

    // Récupérer les stats de base du héros et les bonus actuels
    const heroStatsRes = await client.query(
      `SELECT 
        h.base_hp, h.base_damage, h.base_attack_interval_ms, h.base_move_speed,
        h.max_hp, h.max_damage, h.min_attack_interval_ms, h.max_move_speed,
        COALESCE(ph.bonus_hp, 0) AS bonus_hp,
        COALESCE(ph.bonus_damage, 0) AS bonus_damage,
        COALESCE(ph.bonus_attack_interval_ms, 0) AS bonus_attack_interval_ms,
        COALESCE(ph.bonus_move_speed, 0) AS bonus_move_speed,
        COALESCE(ph.upgrade_points_spent, 0) AS upgrade_points_spent
       FROM heroes h
       LEFT JOIN player_heroes ph ON ph.player_id = $1 AND ph.hero_id = h.id
       WHERE h.id = $2`,
      [playerId, selectedHeroId]
    );
    
    if (heroStatsRes.rows.length === 0) {
      const error = new Error("HERO_NOT_FOUND");
      error.code = "HERO_NOT_FOUND";
      throw error;
    }

    const heroData = heroStatsRes.rows[0];
    
    // Calculer les stats actuelles (base + bonus, ou base - bonus pour attack_interval_ms)
    const currentHp = heroData.base_hp + (heroData.bonus_hp || 0);
    const currentDamage = parseFloat(heroData.base_damage) + parseFloat(heroData.bonus_damage || 0);
    // Utiliser parseFloat pour gérer les valeurs décimales de bonus_attack_interval_ms
    const currentAttackInterval = parseFloat(heroData.base_attack_interval_ms) - parseFloat(heroData.bonus_attack_interval_ms || 0);
    // S'assurer que bonus_move_speed n'est pas négatif (corriger les valeurs corrompues)
    const bonusMoveSpeed = Math.max(0, Number(heroData.bonus_move_speed || 0));
    const currentSpeed = Number(heroData.base_move_speed || 0) + bonusMoveSpeed;

    // Convertir les valeurs de conversion en nombres
    const hpPerPoint = parseFloat(conversion.hp_per_point) || 0;
    const damagePerPoint = parseFloat(conversion.damage_per_point) || 0;
    // Utiliser la valeur par défaut si attack_interval_ms_per_point est null, undefined, ou 0
    // Mais attention : 0.01 est truthy, donc on doit vérifier explicitement
    const rawAttackIntervalPerPoint = conversion.attack_interval_ms_per_point;
    const attackIntervalPerPoint = (rawAttackIntervalPerPoint != null && rawAttackIntervalPerPoint !== '') 
      ? parseFloat(rawAttackIntervalPerPoint) 
      : DEFAULT_CONVERSION.attack_interval_ms_per_point;
    const speedPerPoint = parseFloat(conversion.move_speed_per_point) || 0;

    // Calculer les deltas totaux avec limitation aux maximums
    const totalHpPoints = statsMap.get("hp") || 0;
    const totalDamagePoints = statsMap.get("damage") || 0;
    const totalAttackIntervalPoints = statsMap.get("attack_interval_ms") || 0;
    const totalSpeedPoints = statsMap.get("move_speed") || 0;

    const maxHp = heroData.max_hp != null ? heroData.max_hp : MAX_STATS.max_hp;
    const maxDamage = heroData.max_damage != null ? parseFloat(heroData.max_damage) : MAX_STATS.base_damage;
    const minAttackInterval = heroData.min_attack_interval_ms != null ? parseFloat(heroData.min_attack_interval_ms) : 500;
    const maxSpeed = heroData.max_move_speed != null ? heroData.max_move_speed : MAX_STATS.move_speed;
    
    const potentialHp = currentHp + Math.round(hpPerPoint * totalHpPoints);
    const potentialDamage = currentDamage + parseFloat((damagePerPoint * totalDamagePoints).toFixed(2));
    // Utiliser une précision décimale pour attack_interval_ms (peut être 0.01 par point)
    const attackIntervalReduction = parseFloat((attackIntervalPerPoint * totalAttackIntervalPoints).toFixed(2));
    const potentialAttackInterval = parseFloat((currentAttackInterval - attackIntervalReduction).toFixed(2));
    // S'assurer que currentSpeed est valide (>= 0)
    const validCurrentSpeed = Math.max(0, currentSpeed);
    const potentialSpeed = validCurrentSpeed + Math.round(speedPerPoint * totalSpeedPoints);

    const cappedHp = heroData.max_hp != null ? Math.min(potentialHp, maxHp) : potentialHp;
    const cappedDamage = heroData.max_damage != null ? Math.min(potentialDamage, maxDamage) : potentialDamage;
    const cappedAttackInterval = parseFloat(Math.max(potentialAttackInterval, minAttackInterval).toFixed(2));
    const cappedSpeed = heroData.max_move_speed != null ? Math.min(potentialSpeed, maxSpeed) : potentialSpeed;

    const deltaHp = Math.min(Math.round(hpPerPoint * totalHpPoints), cappedHp - currentHp);
    const deltaDamage = Math.min(parseFloat((damagePerPoint * totalDamagePoints).toFixed(2)), cappedDamage - currentDamage);
    // Pour attack_interval_ms, on soustrait (plus bas = mieux)
    // deltaAttackInterval = la réduction réelle appliquée (peut être décimale)
    // Utiliser parseFloat avec toFixed pour éviter les problèmes de précision flottante
    const maxPossibleReduction = parseFloat((currentAttackInterval - cappedAttackInterval).toFixed(2));
    const deltaAttackInterval = parseFloat(Math.min(attackIntervalReduction, maxPossibleReduction).toFixed(2));
    const deltaSpeed = Math.max(0, Math.min(Math.round(speedPerPoint * totalSpeedPoints), cappedSpeed - validCurrentSpeed));

    // Vérifier qu'au moins une amélioration peut être appliquée
    // Pour attack_interval_ms, utiliser une tolérance pour les très petites valeurs décimales
    const hasAttackIntervalUpgrade = deltaAttackInterval > 0.001; // Tolérance pour les valeurs très petites
    if (deltaHp <= 0 && deltaDamage <= 0 && !hasAttackIntervalUpgrade && deltaSpeed <= 0) {
      const error = new Error("STAT_MAX_REACHED");
      error.code = "STAT_MAX_REACHED";
      // Message de débogage plus détaillé
      const debugInfo = {
        deltaHp,
        deltaDamage,
        deltaAttackInterval,
        deltaSpeed,
        currentAttackInterval,
        minAttackInterval,
        attackIntervalReduction,
        maxPossibleReduction,
        totalAttackIntervalPoints,
        attackIntervalPerPoint
      };
      error.message = `Toutes les stats ont atteint leur maximum. Debug: ${JSON.stringify(debugInfo)}`;
      throw error;
    }

    // Créer ou mettre à jour player_heroes avec tous les bonus
    // S'assurer que deltaAttackInterval est un nombre (peut être décimal pour attack_interval_ms)
    // NOTE: La colonne bonus_attack_interval_ms doit être de type NUMERIC ou DECIMAL dans la DB pour accepter les valeurs décimales
    await client.query(
      `INSERT INTO player_heroes (player_id, hero_id, bonus_hp, bonus_damage, bonus_attack_interval_ms, bonus_move_speed, upgrade_points_spent, kills, is_selected)
       VALUES ($1, $2, $3, $4, $5::numeric, $6, $7, 0, false)
       ON CONFLICT (player_id, hero_id) DO UPDATE SET
         bonus_hp = player_heroes.bonus_hp + $3,
         bonus_damage = player_heroes.bonus_damage + $4,
         bonus_attack_interval_ms = player_heroes.bonus_attack_interval_ms + $5::numeric,
         bonus_move_speed = player_heroes.bonus_move_speed + $6,
         upgrade_points_spent = player_heroes.upgrade_points_spent + $7`,
      [playerId, selectedHeroId, deltaHp, deltaDamage, parseFloat(deltaAttackInterval), deltaSpeed, totalPoints]
    );
    
    // Récupérer les stats finales calculées
    const finalStatsRes = await client.query(
      `SELECT 
        h.base_hp + COALESCE(ph.bonus_hp, 0) AS max_hp,
        h.base_damage + COALESCE(ph.bonus_damage, 0) AS base_damage,
        GREATEST(h.base_attack_interval_ms - COALESCE(ph.bonus_attack_interval_ms, 0), COALESCE(h.min_attack_interval_ms, 0)) AS attack_interval_ms,
        h.base_move_speed + COALESCE(ph.bonus_move_speed, 0) AS move_speed,
        COALESCE(ph.upgrade_points_spent, 0) AS upgrade_points_spent,
        COALESCE(ph.kills, 0) AS kills,
        COALESCE(ph.color, h.color) AS color
       FROM heroes h
       LEFT JOIN player_heroes ph ON ph.player_id = $1 AND ph.hero_id = h.id
       WHERE h.id = $2`,
      [playerId, selectedHeroId]
    );
    
    const heroRes = { rows: finalStatsRes.rows };

    // Décrémenter les points disponibles
    const pointsRes = await client.query(
      `UPDATE players
       SET hero_points_available = hero_points_available - $1
       WHERE id = $2
       RETURNING hero_points_available`,
      [totalPoints, playerId]
    );

    await client.query("COMMIT");

    // Appliquer les caps si nécessaire
    const finalRow = finalStatsRes.rows[0];
    if (heroData.max_hp != null && finalRow.max_hp > heroData.max_hp) {
      finalRow.max_hp = heroData.max_hp;
    }
    if (heroData.max_damage != null && parseFloat(finalRow.base_damage) > parseFloat(heroData.max_damage)) {
      finalRow.base_damage = heroData.max_damage;
    }
    if (heroData.min_attack_interval_ms != null && finalRow.attack_interval_ms < Number(heroData.min_attack_interval_ms)) {
      finalRow.attack_interval_ms = Number(heroData.min_attack_interval_ms);
    }
    if (heroData.max_move_speed != null && finalRow.move_speed > heroData.max_move_speed) {
      finalRow.move_speed = heroData.max_move_speed;
    }
    
    return {
      heroStats: finalRow,
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