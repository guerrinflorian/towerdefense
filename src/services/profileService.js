import { apiClient } from "./apiClient.js";

export async function fetchPlayerProfile(username) {
  const response = await apiClient.get(`/api/profile/${encodeURIComponent(username)}`);
  return response.data;
}

