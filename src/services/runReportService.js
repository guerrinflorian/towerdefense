import { apiClient } from "./apiClient.js";

export async function sendRunReport(report) {
  try {
    const response = await apiClient.post("/api/run-report", report, {
      headers: { "Content-Type": "application/json" },
    });
    return response?.data || null;
  } catch (err) {
    // Pas de stockage pour l'instant : log uniquement
    console.warn("Impossible d'envoyer le RunReport", err);
    return null;
  }
}
