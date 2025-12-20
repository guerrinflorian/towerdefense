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
  if (!isAuthenticated()) return null;
  const killsToRecord = Number.isInteger(kills) && kills > 0 ? kills : 1;
  const response = await apiClient.post("/api/player/hero/kill", {
    kills: killsToRecord,
  });
  if (currentProfile?.player) {
    currentProfile.player.hero_points_available =
      response.data.heroPointsAvailable;
  }
  return response.data;
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

export async function upgradeHero(stat, points) {
  if (!isAuthenticated()) return null;
  const response = await apiClient.post("/api/player/hero/upgrade", {
    stat,
    points,
  });

  if (response.data?.profile) {
    currentProfile = response.data.profile;
  }

  return response.data;
}

export function handleAuthError(error) {
  const message =
    error?.response?.data?.error ||
    error?.message ||
    "Une erreur est survenue";
  return message;
}
