import axios from "axios";

// Détection automatique de l'URL de l'API
// En production (Vercel), utilise l'origine actuelle (même domaine)
// En développement, utilise localhost:3000
const getApiBaseUrl = () => {
  // Si une variable d'environnement est définie, l'utiliser (pour override)
  if (process.env.API_BASE_URL || process.env.API_URL) {
    return process.env.API_BASE_URL || process.env.API_URL;
  }
  
  // En production (sur Vercel ou autre domaine), utilise l'origine actuelle
  if (typeof window !== "undefined") {
    const origin = window.location.origin;
    // Si on est sur localhost, utilise le port 3000 par défaut
    if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
      return "http://localhost:3000";
    }
    // Sinon, utilise l'origine actuelle (même domaine = même URL Vercel)
    return origin;
  }
  
  // Fallback pour SSR ou autres cas
  return "http://localhost:3000";
};

const API_BASE_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
    }
    return Promise.reject(error);
  }
);
