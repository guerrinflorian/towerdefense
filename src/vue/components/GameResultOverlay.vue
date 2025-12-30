<template>
  <div class="game-result-overlay" @click.self="handleOverlayClick">
    <div class="game-result-card" :class="{ defeat: result.type === 'defeat' }">
      <div class="game-result-card__top-bar"></div>
      
      <h1 class="game-result-title">
        {{ result.type === 'victory' ? 'VICTOIRE !' : 'PERDU !' }}
      </h1>
      
      <p class="game-result-message">
        {{ result.message || defaultMessage }}
      </p>
      
      <div v-if="loading" class="game-result-loader"></div>
      
      <button 
        v-else
        class="game-result-button"
        @click="handleContinue"
      >
        Retour au menu
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useModalStore } from '../stores/modalStore.js';

const modalStore = useModalStore();
const result = computed(() => modalStore.state.gameResult);
const loading = computed(() => !result.value.message);

const defaultMessage = computed(() => {
  return result.value.type === 'victory'
    ? 'Félicitations ! Vous avez terminé le niveau avec succès.'
    : 'Votre base a été détruite. Essayez encore !';
});

const handleContinue = () => {
  modalStore.hideGameResult();
};

const handleOverlayClick = () => {
  if (!loading.value) {
    handleContinue();
  }
};
</script>

<style scoped>
.game-result-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20000;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
  pointer-events: auto;
}

.game-result-card {
  width: 100%;
  max-width: 520px;
  background: linear-gradient(145deg, #0f0f1a, #050510);
  border-radius: 20px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.8),
    0 0 0 3px rgba(0, 255, 136, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  padding: 40px;
  text-align: center;
  color: #ffffff;
  font-family: "Arial", "Segoe UI", sans-serif;
  animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  pointer-events: auto;
}

.game-result-card.defeat {
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.8),
    0 0 0 3px rgba(255, 102, 102, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.game-result-card__top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #00ff88, #00c6ff, #00ff88);
  background-size: 200% 100%;
  animation: shimmer 3s linear infinite;
}

.game-result-card.defeat .game-result-card__top-bar {
  background: linear-gradient(90deg, #ff6666, #ff0000, #ff6666);
}

.game-result-title {
  font-size: 48px;
  font-weight: bold;
  margin: 0 0 20px 0;
  letter-spacing: 2px;
  text-transform: uppercase;
  background: linear-gradient(135deg, #00ff88, #00c6ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: pulse 2s ease-in-out infinite;
}

.game-result-card.defeat .game-result-title {
  background: linear-gradient(135deg, #ff6666, #ff0000);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.game-result-message {
  font-size: 18px;
  color: #cccccc;
  margin: 20px 0;
  line-height: 1.6;
  white-space: pre-line;
}

.game-result-loader {
  width: 40px;
  height: 40px;
  margin: 30px auto;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: #00ff88;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

.game-result-card.defeat .game-result-loader {
  border-top-color: #ff6666;
}

.game-result-button {
  margin-top: 30px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  background: linear-gradient(135deg, #00ff88, #00c6ff);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(0, 255, 136, 0.3);
  pointer-events: auto;
  position: relative;
  z-index: 1;
}

.game-result-card.defeat .game-result-button {
  background: linear-gradient(135deg, #ff6666, #ff0000);
  box-shadow: 0 4px 15px rgba(255, 102, 102, 0.3);
}

.game-result-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 255, 136, 0.5);
}

.game-result-card.defeat .game-result-button:hover {
  box-shadow: 0 6px 20px rgba(255, 102, 102, 0.5);
}

.game-result-button:active {
  transform: translateY(0);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .game-result-card {
    max-width: 90vw;
    padding: 30px 20px;
  }

  .game-result-title {
    font-size: 36px;
  }
}
</style>

