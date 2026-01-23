import { onMounted, onUnmounted } from "vue/dist/vue.esm-bundler.js";
import { useServerStatusStore } from "../stores/serverStatusStore.js";
import { getApiBaseUrl } from "../../services/apiClient.js";
import { getSocket } from "../../services/socketClient.js";

const HEALTH_TIMEOUT_MS = 2000;
const HEARTBEAT_INTERVAL_MS = 10 * 60 * 1000;

export function useServerStatus() {
  const { setConnectionState, setWakingUp } = useServerStatusStore();
  const apiBaseUrl = getApiBaseUrl().replace(/\/$/, "");
  const healthUrl = `${apiBaseUrl}/health`;
  const socket = getSocket();

  let heartbeatId = null;
  let initialTimeoutId = null;

  const runHealthCheck = async ({ markWakingUp } = { markWakingUp: false }) => {
    try {
      const response = await fetch(healthUrl, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Health check failed");
      }
      setWakingUp(false);
      return true;
    } catch (_error) {
      if (markWakingUp) {
        setWakingUp(true);
      }
      return false;
    }
  };

  const startInitialHealthCheck = async () => {
    initialTimeoutId = window.setTimeout(() => {
      setWakingUp(true);
    }, HEALTH_TIMEOUT_MS);

    try {
      const success = await runHealthCheck({ markWakingUp: true });

      if (success) {
        setWakingUp(false);
      }
    } finally {
      if (initialTimeoutId) {
        window.clearTimeout(initialTimeoutId);
        initialTimeoutId = null;
      }
    }
  };

  const startHeartbeat = () => {
    heartbeatId = window.setInterval(() => {
      if (document.visibilityState !== "visible") {
        return;
      }
      runHealthCheck({ markWakingUp: false });
    }, HEARTBEAT_INTERVAL_MS);
  };

  const setupSocketListeners = () => {
    socket.on("connect", () => {
      setConnectionState("connected", "Connecté.");
    });

    socket.on("disconnect", () => {
      setConnectionState(
        "connecting",
        "Connexion perdue, reconnexion en cours..."
      );
    });

    socket.io.on("reconnect_attempt", () => {
      setConnectionState(
        "connecting",
        "Connexion perdue, reconnexion en cours..."
      );
    });
  };

  onMounted(() => {
    startInitialHealthCheck();
    startHeartbeat();
    setupSocketListeners();
  });

  onUnmounted(() => {
    if (heartbeatId) {
      window.clearInterval(heartbeatId);
      heartbeatId = null;
    }
    if (initialTimeoutId) {
      window.clearTimeout(initialTimeoutId);
      initialTimeoutId = null;
    }
    socket.off("connect");
    socket.off("disconnect");
    socket.io.off("reconnect_attempt");
  });
}
