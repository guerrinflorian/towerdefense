import { reactive, readonly } from "vue/dist/vue.esm-bundler.js";

const state = reactive({
  connectionState: "connecting",
  statusMessage: "Connexion en cours...",
  isWakingUp: false,
});

export function useServerStatusStore() {
  const setConnectionState = (value, message) => {
    state.connectionState = value;

    if (message) {
      state.statusMessage = message;
      return;
    }

    if (value === "connected") {
      state.statusMessage = "Connecté.";
      return;
    }

    state.statusMessage = "Connexion en cours...";
  };

  const setWakingUp = (value) => {
    state.isWakingUp = Boolean(value);
  };

  return {
    state: readonly(state),
    setConnectionState,
    setWakingUp,
  };
}
