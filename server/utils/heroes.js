import { query } from "../db.js";

const HERO_FIELDS = `
  id,
  name,
  base_hp,
  base_damage,
  base_attack_interval_ms,
  base_move_speed,
  max_hp,
  max_damage,
  min_attack_interval_ms,
  max_move_speed,
  color,
  hero_points_to_unlock
`;

function toNumber(value) {
  return value === null || value === undefined ? null : Number(value);
}

export async function fetchHeroes() {
  const result = await query(
    `SELECT ${HERO_FIELDS}
     FROM heroes
     ORDER BY id`
  );
  return result.rows;
}

export async function fetchHeroById(executor, heroId, { forUpdate = false } = {}) {
  const runner = executor?.query ? executor.query.bind(executor) : query;
  const sql = `
    SELECT ${HERO_FIELDS}
    FROM heroes
    WHERE id = $1
    ${forUpdate ? "FOR UPDATE" : ""}`;
  const result = await runner(sql, [heroId]);
  return result.rows[0] || null;
}

export async function fetchPlayerHero(executor, playerId, heroId, { forUpdate = false } = {}) {
  const runner = executor?.query ? executor.query.bind(executor) : query;
  const sql = `
    SELECT player_id, hero_id, bonus_hp, bonus_damage, bonus_attack_interval_ms, bonus_move_speed, kills, upgrade_points_spent
    FROM player_heroes
    WHERE player_id = $1 AND hero_id = $2
    ${forUpdate ? "FOR UPDATE" : ""}`;
  const result = await runner(sql, [playerId, heroId]);
  return result.rows[0] || null;
}

export async function getDefaultHeroId(executor = null) {
  const runner = executor?.query ? executor.query.bind(executor) : query;
  const result = await runner(
    `SELECT id FROM heroes ORDER BY id LIMIT 1`
  );
  return result.rows[0]?.id || null;
}

export async function getOrCreatePlayerHero(
  executor,
  playerId,
  heroId,
  { forUpdate = false } = {}
) {
  const runner = executor?.query ? executor.query.bind(executor) : query;
  const existing = await fetchPlayerHero(runner, playerId, heroId, { forUpdate });
  if (existing) return existing;

  return await createPlayerHero(runner, playerId, heroId);
}

export async function createPlayerHero(executor, playerId, heroId) {
  const runner = executor?.query ? executor.query.bind(executor) : query;
  const inserted = await runner(
    `INSERT INTO player_heroes (
      player_id,
      hero_id,
      bonus_hp,
      bonus_damage,
      bonus_attack_interval_ms,
      bonus_move_speed,
      kills,
      upgrade_points_spent
    ) VALUES ($1, $2, 0, 0, 0, 0, 0, 0)
    RETURNING player_id, hero_id, bonus_hp, bonus_damage, bonus_attack_interval_ms, bonus_move_speed, kills, upgrade_points_spent`,
    [playerId, heroId]
  );
  return inserted.rows[0];
}

function clampValue(value, { min = null, max = null } = {}) {
  let result = value;
  if (min !== null && min !== undefined) {
    result = Math.max(result, min);
  }
  if (max !== null && max !== undefined) {
    result = Math.min(result, max);
  }
  return result;
}

export function computeFinalHeroStats(hero, playerHero) {
  if (!hero) return null;
  const bonus = playerHero || {};

  const baseHp = toNumber(hero.base_hp) || 0;
  const baseDamage = toNumber(hero.base_damage) || 0;
  const baseAttackInterval = toNumber(hero.base_attack_interval_ms) || 0;
  const baseMoveSpeed = toNumber(hero.base_move_speed) || 0;

  const bonusHp = toNumber(bonus.bonus_hp) || 0;
  const bonusDamage = toNumber(bonus.bonus_damage) || 0;
  const bonusAttackInterval = toNumber(bonus.bonus_attack_interval_ms) || 0;
  const bonusMoveSpeed = toNumber(bonus.bonus_move_speed) || 0;

  const hpFinal = clampValue(baseHp + bonusHp, {
    max: hero.max_hp !== null && hero.max_hp !== undefined ? Number(hero.max_hp) : null,
  });

  const damageFinal = clampValue(baseDamage + bonusDamage, {
    max: hero.max_damage !== null && hero.max_damage !== undefined ? Number(hero.max_damage) : null,
  });

  const attackIntervalFinal = clampValue(baseAttackInterval + bonusAttackInterval, {
    min:
      hero.min_attack_interval_ms !== null && hero.min_attack_interval_ms !== undefined
        ? Number(hero.min_attack_interval_ms)
        : null,
  });

  const moveSpeedFinal = clampValue(baseMoveSpeed + bonusMoveSpeed, {
    max:
      hero.max_move_speed !== null && hero.max_move_speed !== undefined
        ? Number(hero.max_move_speed)
        : null,
  });

  return {
    hero_id: hero.id,
    hero_name: hero.name,
    base_hp: baseHp,
    bonus_hp: bonusHp,
    max_hp: hpFinal,
    base_damage: damageFinal,
    bonus_damage: bonusDamage,
    attack_interval_ms: attackIntervalFinal,
    bonus_attack_interval_ms: bonusAttackInterval,
    move_speed: moveSpeedFinal,
    bonus_move_speed: bonusMoveSpeed,
    max_hp_cap:
      hero.max_hp !== null && hero.max_hp !== undefined ? Number(hero.max_hp) : null,
    max_damage_cap:
      hero.max_damage !== null && hero.max_damage !== undefined ? Number(hero.max_damage) : null,
    min_attack_interval_ms:
      hero.min_attack_interval_ms !== null && hero.min_attack_interval_ms !== undefined
        ? Number(hero.min_attack_interval_ms)
        : null,
    max_move_speed_cap:
      hero.max_move_speed !== null && hero.max_move_speed !== undefined
        ? Number(hero.max_move_speed)
        : null,
    kills: toNumber(bonus.kills) || 0,
    upgrade_points_spent: toNumber(bonus.upgrade_points_spent) || 0,
    color: hero.color,
  };
}
