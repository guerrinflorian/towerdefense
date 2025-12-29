import { apiClient } from "./apiClient.js";

/**
 * Récupère la liste de tous les héros avec leur statut de déblocage
 */
export async function fetchHeroes() {
  try {
    const response = await apiClient.get("/api/player/heroes");
    return response.data;
  } catch (error) {
    console.error("Erreur récupération héros:", error);
    throw error;
  }
}

/**
 * Débloque un héros
 */
export async function unlockHero(heroId) {
  try {
    const response = await apiClient.post(`/api/player/heroes/${heroId}/unlock`);
    return response.data;
  } catch (error) {
    console.error("Erreur déblocage héros:", error);
    throw error;
  }
}

