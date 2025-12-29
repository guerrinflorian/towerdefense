import { pool, query } from "../db.js";
import { HERO_BASE_STATS } from "../constants.js";
import { getHeroPointConversion } from "./heroUpgrades.js";

// Fonction pour obtenir ou créer une entrée player_heroes pour un héros spécifique
export async function getOrCreatePlayerHero(playerId, heroId = 1) {
  try {
    // Essayer de récupérer l'entrée existante
    // Utiliser des alias explicites pour éviter les conflits avec ph.*
    const existing = await query(
      `SELECT 
        ph.id, ph.player_id, ph.hero_id, 
        ph.bonus_hp, ph.bonus_damage, ph.bonus_attack_interval_ms, ph.bonus_move_speed,
        ph.kills, ph.upgrade_points_spent, ph.is_selected,
        h.base_hp, h.base_damage, h.base_attack_interval_ms, h.base_move_speed,
        h.max_hp, h.max_damage, h.min_attack_interval_ms, h.max_move_speed,
        COALESCE(ph.color, h.color) AS color
       FROM player_heroes ph
       JOIN heroes h ON h.id = ph.hero_id
       WHERE ph.player_id = $1 AND ph.hero_id = $2`,
      [playerId, heroId]
    );
    
    if (existing.rows.length > 0) {
      const row = existing.rows[0];
      // Calculer les stats finales (parser les valeurs NUMERIC qui sont des strings)
      // Gérer les cas où les valeurs peuvent être null
      const baseHp = row.base_hp != null ? Number(row.base_hp) : 0;
      const bonusHp = row.bonus_hp != null ? Number(row.bonus_hp) : 0;
      const baseDamage = row.base_damage != null ? parseFloat(row.base_damage) : 0;
      const bonusDamage = row.bonus_damage != null ? parseFloat(row.bonus_damage) : 0;
      const baseAttackInterval = row.base_attack_interval_ms != null ? Number(row.base_attack_interval_ms) : 0;
      const bonusAttackInterval = row.bonus_attack_interval_ms != null ? Number(row.bonus_attack_interval_ms) : 0;
      const baseMoveSpeed = row.base_move_speed != null ? Number(row.base_move_speed) : 0;
      const bonusMoveSpeed = row.bonus_move_speed != null ? Number(row.bonus_move_speed) : 0;
      
      const finalHp = row.max_hp != null 
        ? Math.min(baseHp + bonusHp, Number(row.max_hp))
        : baseHp + bonusHp;
      const finalDamage = row.max_damage != null
        ? Math.min(baseDamage + bonusDamage, parseFloat(row.max_damage))
        : baseDamage + bonusDamage;
      const finalAttackInterval = row.min_attack_interval_ms != null
        ? Math.max(baseAttackInterval - bonusAttackInterval, Number(row.min_attack_interval_ms))
        : baseAttackInterval - bonusAttackInterval;
      const finalMoveSpeed = row.max_move_speed != null
        ? Math.min(baseMoveSpeed + bonusMoveSpeed, Number(row.max_move_speed))
        : baseMoveSpeed + bonusMoveSpeed;
      
      // S'assurer que les valeurs ne sont jamais null ou NaN
      return {
        max_hp: Number.isFinite(finalHp) ? finalHp : 0,
        base_damage: Number.isFinite(finalDamage) ? finalDamage : 0,
        attack_interval_ms: Number.isFinite(finalAttackInterval) ? finalAttackInterval : 1500,
        move_speed: Number.isFinite(finalMoveSpeed) ? finalMoveSpeed : 0,
        upgrade_points_spent: row.upgrade_points_spent != null ? Number(row.upgrade_points_spent) : 0,
        kills: row.kills != null ? Number(row.kills) : 0,
        color: row.color || "#2b2b2b",
        hero_id: heroId,
      };
    }
    
    // Si pas d'entrée, créer une nouvelle entrée player_heroes
    // Vérifier si c'est le premier héros du joueur pour le sélectionner par défaut
    const playerHeroesCount = await query(
      `SELECT COUNT(*) as count FROM player_heroes WHERE player_id = $1`,
      [playerId]
    );
    const isFirstHero = Number(playerHeroesCount.rows[0]?.count || 0) === 0;
    
    const heroBase = await query(
      `SELECT base_hp, base_damage, base_attack_interval_ms, base_move_speed, color
       FROM heroes WHERE id = $1`,
      [heroId]
    );
    
    if (heroBase.rows.length > 0) {
      const hero = heroBase.rows[0];
      
      // Créer l'entrée player_heroes avec is_selected = true si c'est le premier héros
      await query(
        `INSERT INTO player_heroes (player_id, hero_id, bonus_hp, bonus_damage, bonus_attack_interval_ms, bonus_move_speed, kills, upgrade_points_spent, is_selected)
         VALUES ($1, $2, 0, 0, 0, 0, 0, 0, $3)`,
        [playerId, heroId, isFirstHero]
      );
      
      return {
        max_hp: Number(hero.base_hp) || 0,
        base_damage: parseFloat(hero.base_damage) || 0,
        attack_interval_ms: Number(hero.base_attack_interval_ms) || 0,
        move_speed: Number(hero.base_move_speed) || 0,
        upgrade_points_spent: 0,
        kills: 0,
        color: hero.color || "#2b2b2b",
        hero_id: heroId,
      };
    }
    
    // Fallback vers les constantes si le héros n'existe pas
    return {
      max_hp: HERO_BASE_STATS.max_hp,
      base_damage: HERO_BASE_STATS.base_damage,
      attack_interval_ms: HERO_BASE_STATS.attack_interval_ms,
      move_speed: HERO_BASE_STATS.move_speed,
      upgrade_points_spent: 0,
      kills: 0,
      color: "#2b2b2b",
      hero_id: heroId,
    };
  } catch (err) {
    // Si les tables n'existent pas encore, retourner les stats de base
    console.warn("Erreur lors de la récupération des stats du héros:", err.message);
    return {
      max_hp: HERO_BASE_STATS.max_hp,
      base_damage: HERO_BASE_STATS.base_damage,
      attack_interval_ms: HERO_BASE_STATS.attack_interval_ms,
      move_speed: HERO_BASE_STATS.move_speed,
      upgrade_points_spent: 0,
      kills: 0,
      color: "#2b2b2b",
      hero_id: heroId,
    };
  }
}

// Fonction de compatibilité (dépréciée, utilise getOrCreatePlayerHero avec hero_id = 1)
export async function ensureHeroStats(playerId) {
  return getOrCreatePlayerHero(playerId, 1);
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

    // Si heroId n'est pas fourni, récupérer le héros sélectionné
    if (heroId === null) {
      const selectedHeroRes = await client.query(
        `SELECT hero_id FROM player_heroes WHERE player_id = $1 AND is_selected = true LIMIT 1`,
        [playerId]
      );
      heroId = selectedHeroRes.rows.length > 0 ? Number(selectedHeroRes.rows[0].hero_id) : 1;
    }

    // Utiliser la nouvelle structure heroes/player_heroes
    const heroStats = await getOrCreatePlayerHero(playerId, heroId);
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
      heroStats,
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
