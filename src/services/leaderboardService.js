import { apiClient } from "./apiClient.js";

export async function fetchGlobalLeaderboard() {
  const response = await apiClient.get("/api/player/leaderboard/global");
  return response.data?.entries || [];
}

export async function fetchHeroLeaderboard() {
  const response = await apiClient.get("/api/player/leaderboard/heroes");
  return response.data?.entries || [];
}

export async function fetchLevelLeaderboards() {
  const response = await apiClient.get("/api/player/leaderboard/levels");
  return response.data?.levels || [];
}

export async function fetchPlayerBestRuns() {
  const response = await apiClient.get("/api/player/levels/best");
  return response.data?.entries || [];
}

// Compatibilité avec l'ancienne API
export async function fetchLeaderboard() {
  return fetchGlobalLeaderboard();
}
