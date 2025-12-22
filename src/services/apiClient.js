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

const API_BASE_URL = getApiBaseUrl().replace(/\/$/, "");
const DEFAULT_TIMEOUT = 10000;

async function httpRequest(
  path,
  { method = "GET", data, headers = {}, credentials } = {}
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  const token = localStorage.getItem("authToken");
  const finalHeaders = {
    Accept: "application/json",
    ...(data ? { "Content-Type": "application/json" } : {}),
    ...headers,
  };

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const url =
    path.startsWith("http://") || path.startsWith("https://")
      ? path
      : `${API_BASE_URL}${path}`;

  try {
    const urlObj = new URL(
      path.startsWith("http") ? path : `${API_BASE_URL}${path}`
    );
    const isSameOrigin =
      typeof window !== "undefined" &&
      window.location.origin === urlObj.origin;

    const response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: data ? JSON.stringify(data) : undefined,
      signal: controller.signal,
      credentials:
        credentials ??
        (isSameOrigin ? "include" : "omit"), // align with axios default (omit for cross-origin)
    });

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (response.status === 401) {
      localStorage.removeItem("authToken");
    }

    if (!response.ok) {
      const error = new Error("API request failed");
      error.response = { status: response.status, data: payload };
      throw error;
    }

    return { data: payload, status: response.status };
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error("API request timed out");
      timeoutError.code = "TIMEOUT";
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export const apiClient = {
  get: (path, config = {}) => httpRequest(path, { ...config, method: "GET" }),
  post: (path, data, config = {}) =>
    httpRequest(path, { ...config, method: "POST", data }),
};
