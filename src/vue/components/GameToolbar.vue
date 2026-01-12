<template>
  <section v-if="state.visible" class="game-toolbar">
    <div class="game-toolbar__section">
      <h3>TOURELLES</h3>
      <div class="game-toolbar__grid">
        <button
          v-for="item in turretList"
          :key="item.key"
          class="game-toolbar__card"
          :class="{ 'game-toolbar__card--disabled': item.disabled }"
          @click="startDrag(item.key)"
        >
          <TurretPreviewCanvas :turret-key="item.key" :size="56" />
          <div class="game-toolbar__name">{{ item.label }}</div>
          <div class="game-toolbar__meta">
            <span class="game-toolbar__cost">{{ item.cost }}$</span>
            <span class="game-toolbar__count">{{ item.countLabel }}</span>
          </div>
        </button>
      </div>
    </div>

    <div class="game-toolbar__section">
      <h3>SORTS</h3>
      <div class="game-toolbar__grid game-toolbar__grid--spells">
        <button class="game-toolbar__card" @click="castLightning">
          <div class="game-toolbar__spell">⚡</div>
          <div class="game-toolbar__name">Éclair</div>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue/dist/vue.esm-bundler.js";
import { TURRETS } from "../../config/turrets/index.js";
import TurretPreviewCanvas from "./TurretPreviewCanvas.vue";
import { useGameUIStore } from "../stores/gameUIStore.js";

const { state } = useGameUIStore();

const turretConfigList = [
  { key: "machine_gun", config: TURRETS.machine_gun },
  { key: "sniper", config: TURRETS.sniper },
  { key: "cannon", config: TURRETS.cannon },
  { key: "zap", config: TURRETS.zap },
  { key: "barracks", config: TURRETS.barracks },
];

const turretList = computed(() => {
  const counts = state.turrets.counts || {};
  return turretConfigList.map((item) => {
    const count = counts[item.key] ?? 0;
    const max =
      item.key === "barracks"
        ? state.turrets.maxBarracks
        : item.key === "sniper"
        ? state.turrets.maxSnipers
        : null;
    const disabled =
      state.money < item.config.cost ||
      (max !== null && count >= max);
    const countLabel = max ? `${count}/${max}` : `${count}`;
    return {
      key: item.key,
      label: item.config.name || item.key,
      cost: item.config.cost,
      countLabel,
      disabled,
    };
  });
});

const startDrag = (key) => {
  const item = turretConfigList.find((turret) => turret.key === key);
  if (!item) return;
  if (state.money < item.config.cost) {
    window.game?.scene?.getScene?.("GameScene")?.cameras?.main?.shake?.(50, 0.005);
    return;
  }
  window.game?.scene
    ?.getScene?.("GameScene")
    ?.inputManager?.dragHandler?.startDrag(item.config);
};

const castLightning = () => {
  const scene = window.game?.scene?.getScene?.("GameScene");
  if (scene?.spellManager?.lightningCooldown <= 0) {
    scene.spellManager.startPlacingLightning();
  }
};
</script>

<style scoped>
.game-toolbar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  width: 100%;
  height: 100%;
  background: rgba(10, 10, 16, 0.92);
  border-radius: 14px;
  border: 1px solid rgba(0, 204, 255, 0.35);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  color: #ffffff;
  font-family: "Arial", sans-serif;
}

.game-toolbar__section h3 {
  margin: 0 0 8px;
  font-size: clamp(12px, 3vw, 16px);
  color: #9edcff;
}

.game-toolbar__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 10px;
}

.game-toolbar__grid--spells {
  grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
}

.game-toolbar__card {
  background: rgba(51, 51, 51, 0.9);
  border: 2px solid rgba(102, 102, 102, 0.9);
  border-radius: 12px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #ffffff;
}

.game-toolbar__card--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.game-toolbar__name {
  font-size: clamp(10px, 2.5vw, 13px);
  font-weight: 700;
  text-align: center;
  color: #9edcff;
}

.game-toolbar__meta {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: clamp(10px, 2.5vw, 12px);
}

.game-toolbar__cost {
  color: #ffd700;
  font-weight: 700;
}

.game-toolbar__count {
  color: #ffffff;
  font-weight: 700;
}

.game-toolbar__spell {
  font-size: clamp(20px, 6vw, 26px);
}
</style>
