<template>
  <section v-if="state.visible" class="game-hud">
    <header class="game-hud__title">INFORMATIONS</header>
    <div class="game-hud__stats">
      <div class="game-hud__stat game-hud__stat--money">💰 {{ state.money }}</div>
      <div class="game-hud__stat game-hud__stat--lives">❤️ {{ state.lives }}</div>
      <div class="game-hud__stat game-hud__stat--wave">
        🌊 {{ state.currentWave }}/{{ state.totalWaves }}
      </div>
      <div class="game-hud__stat game-hud__stat--timer">⏱️ {{ formattedTimer }}</div>
    </div>
    <div class="game-hud__actions">
      <button class="game-hud__button game-hud__button--pause" @click="pauseGame">
        ⏸️ Pause
      </button>
      <button class="game-hud__button game-hud__button--quit" @click="quitGame">
        🚪 Quitter
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue/dist/vue.esm-bundler.js";
import { useGameUIStore } from "../stores/gameUIStore.js";

const { state } = useGameUIStore();

const formattedTimer = computed(() => {
  const totalSeconds = Math.floor(state.elapsedMs / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
});

const pauseGame = () => {
  const scene = window.game?.scene?.getScene?.("GameScene");
  if (scene && !scene.isPaused) {
    scene.pauseGame();
  }
};

const quitGame = () => {
  const scene = window.game?.scene?.getScene?.("GameScene");
  if (scene) {
    scene.showQuitConfirmation();
  }
};
</script>

<style scoped>
.game-hud {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  width: 100%;
  height: 100%;
  background: rgba(15, 16, 21, 0.92);
  border-radius: 14px;
  border: 1px solid rgba(0, 204, 255, 0.35);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  color: #ffffff;
  font-family: "Arial", sans-serif;
}

.game-hud__title {
  text-align: center;
  font-weight: 700;
  font-size: clamp(11px, 2.6vw, 14px);
  color: #9edcff;
}

.game-hud__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
}

.game-hud__stat {
  padding: 5px 6px;
  border-radius: 10px;
  background: rgba(26, 26, 46, 0.8);
  text-align: center;
  font-weight: 700;
  font-size: clamp(10px, 2.4vw, 13px);
}

.game-hud__stat--money {
  border: 1px solid rgba(255, 215, 0, 0.5);
  color: #ffd700;
}

.game-hud__stat--lives {
  border: 1px solid rgba(255, 102, 102, 0.5);
  color: #ff6666;
}

.game-hud__stat--wave {
  border: 1px solid rgba(0, 204, 255, 0.5);
  color: #00ccff;
}

.game-hud__stat--timer {
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #ffffff;
}

.game-hud__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
}

.game-hud__button {
  padding: 6px 8px;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  font-size: clamp(10px, 2.6vw, 13px);
  cursor: pointer;
}

.game-hud__button--pause {
  background: #1e1e1e;
  color: #ffaa00;
}

.game-hud__button--pause:hover {
  color: #ffcc00;
}

.game-hud__button--quit {
  background: #1e1e1e;
  color: #ff4444;
}

.game-hud__button--quit:hover {
  color: #ff6666;
}
</style>
