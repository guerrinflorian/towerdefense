import { apiClient } from "./apiClient.js";

const TOKEN_KEY = "authToken";
const SELECTED_HERO_KEY = "selectedHeroId";

let currentProfile = null;
let loadingProfile = null;

function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
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

export function getSelectedHeroId() {
  // Récupérer depuis le profil si disponible, sinon depuis localStorage, sinon défaut 1
  if (currentProfile?.heroStats?.hero_id) {
    return currentProfile.heroStats.hero_id;
  }
  const stored = localStorage.getItem(SELECTED_HERO_KEY);
  return stored ? Number(stored) : 1; // Par défaut héros 1
}

export async function setSelectedHeroId(heroId) {
  if (!isAuthenticated()) {
    // Si non authentifié, juste stocker dans localStorage
    localStorage.setItem(SELECTED_HERO_KEY, String(heroId));
    return;
  }
  
  try {
    // Appeler l'API pour mettre à jour is_selected dans la DB
    const response = await apiClient.post(`/api/player/heroes/${heroId}/select`);
    
    // Mettre à jour localStorage pour le fallback
    localStorage.setItem(SELECTED_HERO_KEY, String(heroId));
    
    // Recharger le profil avec le nouveau héros
    const profile = await fetchProfile();
    currentProfile = profile;
    window.dispatchEvent(new CustomEvent("profile:updated"));
    window.dispatchEvent(new CustomEvent("hero:selected", { detail: { heroId } }));
    
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la sélection du héros:", error);
    // En cas d'erreur, quand même mettre à jour localStorage
    localStorage.setItem(SELECTED_HERO_KEY, String(heroId));
    throw error;
  }
}

export function getHeroStats() {
  return currentProfile?.heroStats || null;
}

export function getHeroPointConversion() {
  return currentProfile?.heroPointConversion || null;
}

export function getHeroLimits() {
  return currentProfile?.heroLimits || null;
}

export function getHeroPointsAvailable() {
  return currentProfile?.player?.hero_points_available ?? 0;
}

export function getPlayer() {
  return currentProfile?.player || null;
}

async function fetchProfile() {
  // Ne plus passer heroId, le serveur récupère automatiquement le héros sélectionné
  const response = await apiClient.get("/api/player/me");
  currentProfile = response.data;
  
  // Mettre à jour localStorage avec le héros sélectionné depuis le profil
  if (currentProfile?.heroStats?.hero_id) {
    localStorage.setItem(SELECTED_HERO_KEY, String(currentProfile.heroStats.hero_id));
  }
  
  return currentProfile;
}

export async function loadProfile() {
  if (!isAuthenticated()) {
    currentProfile = null;
    return null;
  }
  return fetchProfile();
}

export async function ensureProfileLoaded() {
  const hasToken = isAuthenticated();
  
  if (!hasToken) {
    currentProfile = null;
    return null;
  }

  if (currentProfile) {
    return currentProfile;
  }

  if (!loadingProfile) {
    loadingProfile = fetchProfile()
      .catch((error) => {
        console.error("[authManager] Erreur lors du chargement du profil:", error);
        // Si le token est invalide (401), nettoyer le token
        if (error?.response?.status === 401) {
          setToken(null);
          currentProfile = null;
        }
        throw error;
      })
      .finally(() => {
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
  return profile;
}

export function logout() {
  setToken(null);
  currentProfile = null;
}

export async function recordHeroKill(kills = 1) {
  if (!isAuthenticated()) {
    return null;
  }
  // Accepter 0 kills (pour forcer l'envoi même sans kills)
  const killsToRecord = Number.isInteger(kills) && kills >= 0 ? kills : 1;
  const selectedHeroId = getSelectedHeroId();
  try {
    const response = await apiClient.post("/api/player/hero/kill", {
      kills: killsToRecord,
      heroId: selectedHeroId,
    });
    if (currentProfile?.player) {
      currentProfile.player.hero_points_available =
        response.data.heroPointsAvailable;
    }
    // Mettre à jour les heroStats si disponibles
    if (response.data?.heroStats && currentProfile) {
      currentProfile.heroStats = response.data.heroStats;
    }
    return response.data;
  } catch (error) {
    throw error;
  }
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

// Limites maximales des stats par défaut (utilisées si non définies dans le profil)
const DEFAULT_MAX_STATS = {
  max_hp: 2500,
  base_damage: 450,
  move_speed: 200,
  attack_interval_ms: 1500,
};
const DEFAULT_MIN_STATS = {
  attack_interval_ms: 500, // Minimum pour la vitesse de frappe (plus bas = mieux)
};

// Fonction pour obtenir les limites maximales depuis le profil ou les valeurs par défaut
function getMaxStats() {
  const heroLimits = getHeroLimits();
  return {
    max_hp: heroLimits?.max_hp ?? DEFAULT_MAX_STATS.max_hp,
    base_damage: heroLimits?.max_damage ?? DEFAULT_MAX_STATS.base_damage,
    move_speed: heroLimits?.max_move_speed ?? DEFAULT_MAX_STATS.move_speed,
    attack_interval_ms: DEFAULT_MAX_STATS.attack_interval_ms, // Pas de max pour attack_interval_ms
  };
}

// Fonction pour obtenir les limites minimales depuis le profil ou les valeurs par défaut
function getMinStats() {
  const heroLimits = getHeroLimits();
  return {
    attack_interval_ms: heroLimits?.min_attack_interval_ms ?? DEFAULT_MIN_STATS.attack_interval_ms,
  };
}

// Mise à jour optimiste locale (sans appel API)
function applyOptimisticUpgrade(stat, points) {
  if (!currentProfile?.heroStats) return;
  
  const conversion = currentProfile.heroPointConversion || {};
  const stats = currentProfile.heroStats;
  
  // Calculer les nouvelles valeurs basées sur la conversion
  const hpPerPoint = parseFloat(conversion.hp_per_point) || 0;
  const damagePerPoint = parseFloat(conversion.damage_per_point) || 0;
  const speedPerPoint = parseFloat(conversion.move_speed_per_point) || 0;
  const attackIntervalPerPoint = parseFloat(conversion.attack_interval_ms_per_point) || 0;
  
  // Mettre à jour les stats localement avec limitation aux maximums/minimums
  const maxStats = getMaxStats();
  const minStats = getMinStats();
  
  if (stat === "hp") {
    const currentHp = Number(stats.max_hp) || 0;
    const delta = Math.round(hpPerPoint * points);
    stats.max_hp = Math.min(currentHp + delta, maxStats.max_hp);
  } else if (stat === "damage") {
    const currentDamage = parseFloat(stats.base_damage || 0);
    const delta = parseFloat((damagePerPoint * points).toFixed(2));
    stats.base_damage = Math.min(parseFloat((currentDamage + delta).toFixed(2)), maxStats.base_damage);
  } else if (stat === "move_speed") {
    const currentSpeed = Number(stats.move_speed) || 0;
    const delta = Math.round(speedPerPoint * points);
    stats.move_speed = Math.min(currentSpeed + delta, maxStats.move_speed);
  } else if (stat === "attack_interval_ms") {
    // Pour attack_interval_ms, on soustrait (plus bas = mieux)
    const currentInterval = Number(stats.attack_interval_ms) || 1500;
    const delta = Math.round(attackIntervalPerPoint * points);
    stats.attack_interval_ms = Math.max(currentInterval - delta, minStats.attack_interval_ms);
  }
  
  // Décrémenter les points disponibles
  if (currentProfile.player) {
    currentProfile.player.hero_points_available = Math.max(0, 
      (currentProfile.player.hero_points_available || 0) - points
    );
  }
  
  // Incrémenter les points dépensés
  stats.upgrade_points_spent = (Number(stats.upgrade_points_spent) || 0) + points;
}

// Envoyer toutes les améliorations en batch
async function flushUpgradeQueue() {
  if (upgradeQueue.size === 0) return;
  
  if (!isAuthenticated()) {
    upgradeQueue.clear();
    return;
  }
  
  try {
    // Convertir la queue en array d'améliorations
    const upgrades = Array.from(upgradeQueue.entries()).map(([stat, points]) => ({
      stat,
      points
    }));
    
    // Récupérer le heroId sélectionné
    const selectedHeroId = getSelectedHeroId();
    
    // Envoyer en batch avec le heroId
    const response = await apiClient.post("/api/player/hero/upgrade/batch", {
      upgrades,
      heroId: selectedHeroId
    });
    
    if (response.data?.profile) {
      currentProfile = response.data.profile;
      // Déclencher aussi l'événement profile:updated pour rafraîchir toutes les vues
      window.dispatchEvent(new CustomEvent("profile:updated"));
    }
    
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

export async function updateHeroColor(color) {
  if (!isAuthenticated()) return null;
  try {
    const response = await apiClient.post("/api/player/hero/color", {
      color,
    });
    
    // Mettre à jour les heroStats dans le profil
    if (response.data?.heroStats && currentProfile) {
      currentProfile.heroStats = response.data.heroStats;
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
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
