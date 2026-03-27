import { apiClient } from "./apiClient.js";

export async function fetchSpells() {
  const response = await apiClient.get("/api/player/spells");
  return response.data;
}

export async function unlockSpell(spellKey) {
  const response = await apiClient.post(`/api/player/spells/${spellKey}/unlock`);
  return response.data;
}
