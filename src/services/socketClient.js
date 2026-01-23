import { io } from "socket.io-client";
import { getApiBaseUrl } from "./apiClient.js";

let socketInstance = null;

export function getSocket() {
  if (socketInstance) {
    return socketInstance;
  }

  const baseUrl = getApiBaseUrl().replace(/\/$/, "");

  socketInstance = io(baseUrl, {
    reconnection: true,
    reconnectionAttempts: Infinity,
  });

  return socketInstance;
}
