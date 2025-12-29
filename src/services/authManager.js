import { apiClient } from "./apiClient.js";

const TOKEN_KEY = "authToken";
const SELECTED_HERO_KEY = "selectedHeroId";

let currentProfile = null;
let loadingProfile = null;
let heroes = [];
let playerHeroes = new Map(); // Map<heroId, player_heroes row>
let selectedHeroId = loadSelectedHeroId();
let heroStatsCache = null;
let heroesLoading = null;
const playerHeroLoading = new Map();
const heroLocked = new Map(); // Map<heroId, boolean>

function loadSelectedHeroId() {
  const stored = localStorage.getItem(SELECTED_HERO_KEY);
  const parsed = Number(stored);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function setSelectedHeroId(heroId) {
  if (heroId) {
    selectedHeroId = Number(heroId);
    localStorage.setItem(SELECTED_HERO_KEY, String(heroId));
  } else {
    selectedHeroId = null;
    localStorage.removeItem(SELECTED_HERO_KEY);
  }
}

function normalizeNumber(value, fallback = 0) {
  return value === null || value === undefined || Number.isNaN(Number(value))
    ? fallback
    : Number(value);
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

function computeHeroStats(hero, playerHero) {
  if (!hero || !playerHero) return null;
  const baseHp = normalizeNumber(hero.base_hp);
  const baseDamage = normalizeNumber(hero.base_damage);
  const baseAttackInterval = normalizeNumber(hero.base_attack_interval_ms);
  const baseMoveSpeed = normalizeNumber(hero.base_move_speed);

  const bonusHp = normalizeNumber(playerHero.bonus_hp);
  const bonusDamage = normalizeNumber(playerHero.bonus_damage);
  const bonusAttackInterval = normalizeNumber(playerHero.bonus_attack_interval_ms);
  const bonusMoveSpeed = normalizeNumber(playerHero.bonus_move_speed);

  const hpFinal = clampValue(baseHp + bonusHp, {
    max:
      hero.max_hp === null || hero.max_hp === undefined
        ? null
        : normalizeNumber(hero.max_hp),
  });

  const damageFinal = clampValue(baseDamage + bonusDamage, {
    max:
      hero.max_damage === null || hero.max_damage === undefined
        ? null
        : normalizeNumber(hero.max_damage),
  });

  const attackIntervalFinal = clampValue(baseAttackInterval + bonusAttackInterval, {
    min:
      hero.min_attack_interval_ms === null || hero.min_attack_interval_ms === undefined
        ? null
        : normalizeNumber(hero.min_attack_interval_ms),
  });

  const moveSpeedFinal = clampValue(baseMoveSpeed + bonusMoveSpeed, {
    max:
      hero.max_move_speed === null || hero.max_move_speed === undefined
        ? null
        : normalizeNumber(hero.max_move_speed),
  });

  return {
    heroId: hero.id,
    heroName: hero.name,
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
      hero.max_hp === null || hero.max_hp === undefined ? null : normalizeNumber(hero.max_hp),
    max_damage_cap:
      hero.max_damage === null || hero.max_damage === undefined
        ? null
        : normalizeNumber(hero.max_damage),
    min_attack_interval_ms:
      hero.min_attack_interval_ms === null || hero.min_attack_interval_ms === undefined
        ? null
        : normalizeNumber(hero.min_attack_interval_ms),
    max_move_speed_cap:
      hero.max_move_speed === null || hero.max_move_speed === undefined
        ? null
        : normalizeNumber(hero.max_move_speed),
    kills: normalizeNumber(playerHero.kills),
    upgrade_points_spent: normalizeNumber(playerHero.upgrade_points_spent),
    color: hero.color,
  };
}

function normalizeFinalStats(finalStats) {
  if (!finalStats) return null;
  return {
    heroId: finalStats.hero_id ?? finalStats.heroId,
    heroName: finalStats.hero_name ?? finalStats.heroName,
    base_hp: normalizeNumber(finalStats.base_hp),
    bonus_hp: normalizeNumber(finalStats.bonus_hp),
    max_hp: normalizeNumber(finalStats.max_hp),
    base_damage: normalizeNumber(finalStats.base_damage),
    bonus_damage: normalizeNumber(finalStats.bonus_damage),
    attack_interval_ms: normalizeNumber(finalStats.attack_interval_ms),
    bonus_attack_interval_ms: normalizeNumber(finalStats.bonus_attack_interval_ms),
    move_speed: normalizeNumber(finalStats.move_speed),
    bonus_move_speed: normalizeNumber(finalStats.bonus_move_speed),
    max_hp_cap: finalStats.max_hp_cap ?? null,
    max_damage_cap: finalStats.max_damage_cap ?? null,
    min_attack_interval_ms: finalStats.min_attack_interval_ms ?? null,
    max_move_speed_cap: finalStats.max_move_speed_cap ?? null,
    kills: normalizeNumber(finalStats.kills),
    upgrade_points_spent: normalizeNumber(finalStats.upgrade_points_spent),
    color: finalStats.color,
  };
}

function getHeroFromCache(heroId = null) {
  const targetId = heroId ?? selectedHeroId;
  if (!targetId) return null;
  return heroes.find((h) => Number(h.id) === Number(targetId)) || null;
}

function getPlayerHeroFromCache(heroId = null) {
  const targetId = heroId ?? selectedHeroId;
  if (!targetId) return null;
  return playerHeroes.has(Number(targetId))
    ? playerHeroes.get(Number(targetId))
    : null;
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export function getProfile() {
  return currentProfile;
}

export function getUnlockedLevel() {
  return currentProfile?.progress?.unlockedLevel || 1;
}

export function getHeroStats() {
  if (heroStatsCache) return heroStatsCache;
  const hero = getHeroFromCache();
  const playerHero = getPlayerHeroFromCache();
  if (hero && playerHero) {
    heroStatsCache = computeHeroStats(hero, playerHero);
  }
  return heroStatsCache;
}

export function getHeroPointConversion() {
  return currentProfile?.heroPointConversion || null;
}

export function getHeroPointsAvailable() {
  return currentProfile?.player?.hero_points_available ?? 0;
}

export function getPlayer() {
  return currentProfile?.player || null;
}

export function getAvailableHeroes() {
  return heroes;
}

export function getSelectedHeroId() {
  return selectedHeroId;
}

export function isHeroUnlocked(heroId = null) {
  const targetId = heroId ?? selectedHeroId;
  if (!targetId) return false;
  return Boolean(playerHeroes.get(Number(targetId)));
}

export function getHeroUnlockCost(heroId = null) {
  const hero = getHeroFromCache(heroId);
  if (!hero) return null;
  return normalizeNumber(hero.hero_points_to_unlock, 0);
}

export function isHeroLocked(heroId = null) {
  const targetId = heroId ?? selectedHeroId;
  if (!targetId) return true;
  if (playerHeroes.has(Number(targetId))) {
    return !playerHeroes.get(Number(targetId));
  }
  return heroLocked.get(Number(targetId)) ?? true;
}

async function ensureHeroesLoaded() {
  if (heroes.length > 0) return heroes;
  if (!heroesLoading) {
    heroesLoading = apiClient
      .get("/api/heroes")
      .then((response) => {
        heroes = response.data?.heroes || response.data || [];
        // Si aucun héros sélectionné, choisir le premier disponible
        if (!selectedHeroId && heroes.length > 0) {
          setSelectedHeroId(heroes[0].id);
        }
        return heroes;
      })
      .finally(() => {
        heroesLoading = null;
      });
  }
  return heroesLoading;
}

function normalizePlayerHero(row = {}) {
  return {
    player_id: row.player_id ?? null,
    hero_id: row.hero_id ?? null,
    bonus_hp: normalizeNumber(row.bonus_hp),
    bonus_damage: normalizeNumber(row.bonus_damage),
    bonus_attack_interval_ms: normalizeNumber(row.bonus_attack_interval_ms),
    bonus_move_speed: normalizeNumber(row.bonus_move_speed),
    kills: normalizeNumber(row.kills),
    upgrade_points_spent: normalizeNumber(row.upgrade_points_spent),
  };
}

function updateHeroCache(heroId, playerHero, heroOverride = null, finalStats = null) {
  const hero = heroOverride || getHeroFromCache(heroId);
  playerHeroes.set(heroId, playerHero ? normalizePlayerHero(playerHero) : null);
  heroLocked.set(heroId, !playerHero);

  const normalizedStats = normalizeFinalStats(finalStats);
  if (heroId === selectedHeroId) {
    if (hero && playerHero) {
      heroStatsCache =
        normalizedStats ||
        computeHeroStats(hero, playerHero ? normalizePlayerHero(playerHero) : getPlayerHeroFromCache(heroId));
    } else if (normalizedStats) {
      heroStatsCache = normalizedStats;
    } else {
      heroStatsCache = null;
    }
  }
}

async function ensurePlayerHeroLoaded(heroId) {
  const targetHeroId = Number(heroId);
  if (!targetHeroId) return null;
  const cached = playerHeroes.get(targetHeroId);
  if (cached !== undefined) return cached;

  if (!playerHeroLoading.has(targetHeroId)) {
    const promise = apiClient
      .get(`/api/player/heroes/${targetHeroId}`)
      .then((response) => {
        const hero = response.data?.hero || getHeroFromCache(targetHeroId);
        if (hero && !heroes.find((h) => Number(h.id) === Number(hero.id))) {
          heroes = [...heroes, hero];
        }
        const playerHero = response.data?.playerHero
          ? normalizePlayerHero(response.data?.playerHero)
          : null;
        const finalStats = normalizeFinalStats(response.data?.finalStats);

        updateHeroCache(targetHeroId, playerHero, hero, finalStats);

        if (response.data?.heroPointsAvailable !== undefined && currentProfile?.player) {
          currentProfile.player.hero_points_available = normalizeNumber(
            response.data.heroPointsAvailable
          );
        }
        return playerHero || null;
      })
      .finally(() => {
        playerHeroLoading.delete(targetHeroId);
      });
    playerHeroLoading.set(targetHeroId, promise);
  }

  return playerHeroLoading.get(targetHeroId);
}

export async function ensureHeroContext(targetHeroId = null) {
  if (!isAuthenticated()) {
    heroStatsCache = null;
    playerHeroes.clear();
    return null;
  }
  await ensureHeroesLoaded();
  const heroId =
    Number(targetHeroId) ||
    selectedHeroId ||
    (heroes.length > 0 ? Number(heroes[0].id) : null);
  if (!heroId) return null;
  if (selectedHeroId !== heroId) {
    setSelectedHeroId(heroId);
  }
  await ensurePlayerHeroLoaded(heroId);
  return getHeroStats();
}

export async function selectHero(heroId) {
  await ensureHeroContext(heroId);
  window.dispatchEvent(
    new CustomEvent("hero:selection-changed", { detail: { heroId: selectedHeroId } })
  );
  return getHeroStats();
}

export function getCurrentHeroContext() {
  const hero = getHeroFromCache();
  const playerHero = getPlayerHeroFromCache();
  const stats = getHeroStats();
  return { hero, playerHero, stats };
}

async function fetchProfile() {
  const response = await apiClient.get("/api/player/me");
  currentProfile = response.data;
  await ensureHeroContext(selectedHeroId);
  return currentProfile;
}

export async function ensureProfileLoaded() {
  if (!isAuthenticated()) {
    currentProfile = null;
    heroStatsCache = null;
    heroes = [];
    playerHeroes.clear();
    heroLocked.clear();
    return null;
  }

  if (currentProfile) return currentProfile;

  if (!loadingProfile) {
    loadingProfile = fetchProfile().finally(() => {
      loadingProfile = null;
    });
  }
  return loadingProfile;
}

export async function registerUser({ username, email, password }) {
  const response = await apiClient.post("/api/auth/register", {
    username,
    email,
    password,
  });
  const { token, profile } = response.data;
  setToken(token);
  currentProfile = profile;
  await ensureHeroContext();
  return profile;
}

export async function loginUser({ identifier, password }) {
  const response = await apiClient.post("/api/auth/login", {
    identifier,
    password,
  });
  const { token, profile } = response.data;
  setToken(token);
  currentProfile = profile;
  await ensureHeroContext();
  return profile;
}

export function logout() {
  setToken(null);
  currentProfile = null;
  heroStatsCache = null;
  heroes = [];
  playerHeroes.clear();
  heroLocked.clear();
}

export async function recordHeroKill(kills = 1, heroId = null) {
  if (!isAuthenticated()) {
    return null;
  }
  const targetHeroId = Number(heroId) || selectedHeroId;
  if (!targetHeroId) return null;
  const killsToRecord = Number.isInteger(kills) && kills >= 0 ? kills : 1;
  try {
    const response = await apiClient.post(`/api/player/heroes/${targetHeroId}/kill`, {
      kills: killsToRecord,
    });
    if (currentProfile?.player && response.data?.heroPointsAvailable !== undefined) {
      currentProfile.player.hero_points_available = normalizeNumber(
        response.data.heroPointsAvailable
      );
    }
    updateHeroCache(targetHeroId, response.data?.playerHero, null, response.data?.finalStats);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function unlockHero(heroId) {
  if (!isAuthenticated()) return null;
  const targetHeroId = Number(heroId) || selectedHeroId;
  if (!targetHeroId) return null;
  const response = await apiClient.post(`/api/player/heroes/${targetHeroId}/unlock`);

  if (response.data?.heroPointsAvailable !== undefined && currentProfile?.player) {
    currentProfile.player.hero_points_available = normalizeNumber(
      response.data.heroPointsAvailable
    );
  }

  const hero = getHeroFromCache(targetHeroId);
  const playerHero = response.data?.playerHero ? normalizePlayerHero(response.data.playerHero) : null;
  const finalStats = normalizeFinalStats(response.data?.finalStats);

  updateHeroCache(targetHeroId, playerHero, hero, finalStats);
  return {
    playerHero,
    finalStats,
    heroPointsAvailable: currentProfile?.player?.hero_points_available ?? 0,
  };
}

export async function recordLevelCompletion(payload) {
  if (!isAuthenticated()) return null;
  const response = await apiClient.post("/api/player/levels/completion", {
    ...payload,
  });
  if (currentProfile?.progress) {
    currentProfile.progress = response.data.progress;
  }
  return response.data;
}

// Système de queue pour les améliorations du héros
let upgradeQueue = new Map(); // Map<stat, points>
let upgradeDebounceTimer = null;
const UPGRADE_DEBOUNCE_DELAY = 500; // 500ms après le dernier clic

// Mise à jour optimiste locale (sans appel API)
function applyOptimisticUpgrade(stat, points) {
  if (!isHeroUnlocked()) return;
  const hero = getHeroFromCache();
  const playerHero =
    getPlayerHeroFromCache() || normalizePlayerHero({ hero_id: selectedHeroId });
  if (!hero || !playerHero || !currentProfile?.player) return;

  const conversion = currentProfile.heroPointConversion || {};
  const perPointMap = {
    hp: parseFloat(conversion.hp_per_point) || 0,
    damage: parseFloat(conversion.damage_per_point) || 0,
    move_speed: parseFloat(conversion.move_speed_per_point) || 0,
  };

  const statKey = String(stat);
  const perPoint = perPointMap[statKey];
  if (!perPoint || perPoint <= 0) return;

  const caps = {
    hp: hero.max_hp === null || hero.max_hp === undefined ? null : Number(hero.max_hp),
    damage:
      hero.max_damage === null || hero.max_damage === undefined
        ? null
        : Number(hero.max_damage),
    move_speed:
      hero.max_move_speed === null || hero.max_move_speed === undefined
        ? null
        : Number(hero.max_move_speed),
  };

  const baseValues = {
    hp: normalizeNumber(hero.base_hp),
    damage: normalizeNumber(hero.base_damage),
    move_speed: normalizeNumber(hero.base_move_speed),
  };

  const bonusValues = {
    hp: normalizeNumber(playerHero.bonus_hp),
    damage: normalizeNumber(playerHero.bonus_damage),
    move_speed: normalizeNumber(playerHero.bonus_move_speed),
  };

  const currentTotal = baseValues[statKey] + bonusValues[statKey];
  const desiredDelta = perPoint * points;
  const allowedDelta =
    caps[statKey] === null ? desiredDelta : Math.min(desiredDelta, caps[statKey] - currentTotal);

  if (allowedDelta <= 0) return;

  const appliedPoints = Math.min(points, Math.ceil(allowedDelta / perPoint));
  const appliedDelta =
    statKey === "damage"
      ? parseFloat((perPoint * appliedPoints).toFixed(2))
      : Math.round(perPoint * appliedPoints);

  if (statKey === "hp") {
    playerHero.bonus_hp += appliedDelta;
  } else if (statKey === "damage") {
    playerHero.bonus_damage += appliedDelta;
  } else if (statKey === "move_speed") {
    playerHero.bonus_move_speed += appliedDelta;
  }

  playerHero.upgrade_points_spent = (playerHero.upgrade_points_spent || 0) + appliedPoints;
  playerHeroes.set(selectedHeroId, playerHero);

  currentProfile.player.hero_points_available = Math.max(
    0,
    (currentProfile.player.hero_points_available || 0) - appliedPoints
  );

  heroStatsCache = computeHeroStats(hero, playerHero);
}

// Envoyer toutes les améliorations en batch
async function flushUpgradeQueue() {
  if (upgradeQueue.size === 0) return;
  
  if (!isAuthenticated()) {
    upgradeQueue.clear();
    return;
  }

  if (!selectedHeroId) {
    upgradeQueue.clear();
    return;
  }
  
  try {
    // Convertir la queue en array d'améliorations
    const upgrades = Array.from(upgradeQueue.entries()).map(([stat, points]) => ({
      stat,
      points
    }));
    
    // Envoyer en batch
    const response = await apiClient.post(
      `/api/player/heroes/${selectedHeroId}/upgrade`,
      { upgrades }
    );
    
    if (response.data?.profile) {
      currentProfile = response.data.profile;
    } else if (response.data?.heroPointConversion && currentProfile) {
      currentProfile.heroPointConversion = response.data.heroPointConversion;
    }
    if (response.data?.heroPointsAvailable !== undefined && currentProfile?.player) {
      currentProfile.player.hero_points_available = normalizeNumber(
        response.data.heroPointsAvailable
      );
    }

    const hero = getHeroFromCache(selectedHeroId);
    updateHeroCache(selectedHeroId, response.data?.playerHero, hero, response.data?.finalStats);

    upgradeQueue.clear();
    
    // Déclencher un événement pour notifier la mise à jour
    window.dispatchEvent(new CustomEvent("hero:upgrade-complete", { 
      detail: response.data 
    }));
    
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi des améliorations:", error);
    // En cas d'erreur, on pourrait rollback les changements optimistes
    // Pour l'instant, on vide juste la queue
    upgradeQueue.clear();
    throw error;
  }
}

// Fonction publique pour ajouter une amélioration à la queue
export function queueHeroUpgrade(stat, points = 1) {
  if (!isAuthenticated()) return;
  if (!selectedHeroId) return;
  if (!getHeroStats()) return;
  
  // Ajouter à la queue (accumuler si la stat existe déjà)
  const currentPoints = upgradeQueue.get(stat) || 0;
  upgradeQueue.set(stat, currentPoints + points);
  
  // Appliquer la mise à jour optimiste immédiatement
  applyOptimisticUpgrade(stat, points);
  
  // Déclencher un événement pour mettre à jour l'UI
  window.dispatchEvent(new CustomEvent("hero:upgrade-queued", { 
    detail: { stat, points, queue: new Map(upgradeQueue) }
  }));
  
  // Reset le timer de debounce
  if (upgradeDebounceTimer) {
    clearTimeout(upgradeDebounceTimer);
  }
  
  // Programmer l'envoi après le délai
  upgradeDebounceTimer = setTimeout(() => {
    flushUpgradeQueue();
    upgradeDebounceTimer = null;
  }, UPGRADE_DEBOUNCE_DELAY);
}

// Fonction pour forcer l'envoi immédiat (utile quand l'utilisateur quitte la page)
export async function flushPendingUpgrades() {
  if (upgradeDebounceTimer) {
    clearTimeout(upgradeDebounceTimer);
    upgradeDebounceTimer = null;
  }
  return await flushUpgradeQueue();
}

// Fonction originale conservée pour compatibilité (mais on recommande queueHeroUpgrade)
export async function upgradeHero(stat, points) {
  // Si on veut garder l'ancien comportement, on peut l'utiliser directement
  // Sinon, on redirige vers la queue
  return queueHeroUpgrade(stat, points);
}

export function handleAuthError(error) {
  const message =
    error?.response?.data?.error ||
    error?.message ||
    "Une erreur est survenue";
  return message;
}

export async function requestPasswordReset(email) {
  const response = await apiClient.post("/api/auth/forgot-password", { email });
  return response.data;
}

export async function validateResetToken({ email, token }) {
  const response = await apiClient.get(
    `/api/auth/reset-password/validate?email=${encodeURIComponent(
      email
    )}&token=${encodeURIComponent(token)}`
  );
  return response.data;
}

export async function resetPassword({ email, token, password, confirmPassword }) {
  const response = await apiClient.post("/api/auth/reset-password", {
    email,
    token,
    password,
    confirmPassword,
  });
  return response.data;
}
