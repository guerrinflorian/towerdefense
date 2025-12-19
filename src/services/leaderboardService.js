import { apiClient } from "./apiClient.js";

export async function fetchLeaderboard() {
  const response = await apiClient.get("/api/player/leaderboard");
  return response.data?.entries || [];
}
