import { apiClient } from "./apiClient.js";

export async function fetchAchievements() {
  const { data } = await apiClient.get("/api/achievements");
  return data;
}
