import { apiClient } from "./apiClient.js";

const TOKEN_KEY = "authToken";

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

export function getHeroStats() {
  return currentProfile?.heroStats || null;
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

async function fetchProfile() {
  const response = await apiClient.get("/api/player/me");
  currentProfile = response.data;
  return currentProfile;
}

export async function ensureProfileLoaded() {
  if (!isAuthenticated()) {
    currentProfile = null;
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
  try {
  const response = await apiClient.post("/api/player/hero/kill", {
    kills: killsToRecord,
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

// Mise à jour optimiste locale (sans appel API)
function applyOptimisticUpgrade(stat, points) {
  if (!currentProfile?.heroStats) return;
  
  const conversion = currentProfile.heroPointConversion || {};
  const stats = currentProfile.heroStats;
  
  // Calculer les nouvelles valeurs basées sur la conversion
  const hpPerPoint = parseFloat(conversion.hp_per_point) || 0;
  const damagePerPoint = parseFloat(conversion.damage_per_point) || 0;
  const speedPerPoint = parseFloat(conversion.move_speed_per_point) || 0;
  
  // Mettre à jour les stats localement
  if (stat === "hp") {
    stats.max_hp = (Number(stats.max_hp) || 0) + Math.round(hpPerPoint * points);
  } else if (stat === "damage") {
    stats.base_damage = parseFloat((parseFloat(stats.base_damage || 0) + damagePerPoint * points).toFixed(2));
  } else if (stat === "move_speed") {
    stats.move_speed = (Number(stats.move_speed) || 0) + Math.round(speedPerPoint * points);
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
    
    // Envoyer en batch
    const response = await apiClient.post("/api/player/hero/upgrade/batch", {
      upgrades
    });
    
    if (response.data?.profile) {
      currentProfile = response.data.profile;
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
