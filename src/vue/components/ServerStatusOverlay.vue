<script setup>
import { computed } from "vue/dist/vue.esm-bundler.js";

const props = defineProps({
  status: {
    type: String,
    default: "connecting",
  },
  message: {
    type: String,
    default: "",
  },
  wakingUp: {
    type: Boolean,
    default: false,
  },
});

const isVisible = computed(
  () => props.wakingUp || props.status !== "connected"
);

const statusMessage = computed(() => {
  if (props.wakingUp) {
    return "Le serveur se réveille doucement... (cela peut prendre 30s)";
  }

  if (props.message) {
    return props.message;
  }

  return props.status === "connected"
    ? "Connecté."
    : "Connexion en cours...";
});
</script>

<template>
  <div v-if="isVisible" class="server-status-overlay">
    <div class="server-status-card">
      <div class="server-status-title">Connexion au serveur</div>
      <p class="server-status-message">{{ statusMessage }}</p>
      <div class="server-status-spinner" aria-hidden="true"></div>
    </div>
  </div>
</template>

<style scoped>
.server-status-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(6, 10, 20, 0.92), rgba(10, 20, 30, 0.96));
  color: #f0f4ff;
  text-align: center;
  pointer-events: all;
}

.server-status-card {
  max-width: 420px;
  padding: 32px 28px;
  border-radius: 16px;
  background: rgba(15, 25, 45, 0.85);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.server-status-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  letter-spacing: 0.4px;
}

.server-status-message {
  font-size: 15px;
  line-height: 1.5;
  margin: 0 0 18px;
  opacity: 0.85;
}

.server-status-spinner {
  width: 32px;
  height: 32px;
  margin: 0 auto;
  border-radius: 50%;
  border: 3px solid rgba(240, 244, 255, 0.2);
  border-top-color: #7cc4ff;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
