/**
 * Utilitaires pour HeroUpgradeUI
 */

/**
 * Tronque un nombre à N décimales (sans arrondir)
 */
export function truncateDecimals(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.floor(value * factor) / factor;
}

/**
 * Mapping des clés de stats vers les clés de conversion
 */
export const STAT_CONVERSION_MAP = {
  hp: "hp_per_point",
  damage: "damage_per_point",
  move_speed: "move_speed_per_point",
  attack_interval_ms: "attack_interval_ms_per_point",
};

/**
 * Récupère la valeur actuelle d'une statistique
 */
export function getCurrentStatValue(stats, key) {
  if (key === "hp") return Number(stats?.max_hp) || 0;
  if (key === "damage") return parseFloat(stats?.base_damage) || 0;
  if (key === "attack_interval_ms") return Number(stats?.attack_interval_ms) || 1500;
  return Number(stats?.move_speed) || 0;
}

