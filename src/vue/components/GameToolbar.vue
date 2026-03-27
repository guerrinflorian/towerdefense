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
          <TurretPreviewCanvas :turret-key="item.key" :size="44" />
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
        <button
          class="game-toolbar__card game-toolbar__card--spell"
          :class="{ 'game-toolbar__card--disabled': isLightningOnCooldown }"
          @click="castLightning"
        >
          <div class="game-toolbar__spell-wrapper">
            <div class="game-toolbar__spell">⚡</div>
            <div v-if="isLightningOnCooldown" class="game-toolbar__cooldown-overlay">
              <div
                class="game-toolbar__cooldown-fill"
                :style="{ height: cooldownFillPercent + '%' }"
              ></div>
              <span class="game-toolbar__cooldown-text">{{ lightningCooldownSeconds }}s</span>
            </div>
          </div>
          <div class="game-toolbar__name">Éclair</div>
        </button>

        <button
          class="game-toolbar__card game-toolbar__card--spell"
          :class="{ 'game-toolbar__card--disabled': !state.barrierAvailable }"
          @click="castBarrier"
        >
          <div class="game-toolbar__spell-wrapper">
            <div class="game-toolbar__spell">🪵</div>
            <div v-if="!state.barrierAvailable" class="game-toolbar__cooldown-overlay">
              <div class="game-toolbar__cooldown-fill" style="height: 100%"></div>
              <span class="game-toolbar__cooldown-text">Utilisé</span>
            </div>
          </div>
          <div class="game-toolbar__name">Barrière</div>
          <div class="game-toolbar__badge">1/vague</div>
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

const isLightningOnCooldown = computed(() => state.lightningCooldown > 0);

const lightningCooldownSeconds = computed(() =>
  Math.ceil(state.lightningCooldown / 1000)
);

const cooldownFillPercent = computed(() =>
  Math.min(100, (state.lightningCooldown / state.lightningTotalCooldown) * 100)
);

const castLightning = () => {
  if (isLightningOnCooldown.value) return;
  const scene = window.game?.scene?.getScene?.("GameScene");
  scene?.spellManager?.startPlacingLightning();
};

const castBarrier = () => {
  if (!state.barrierAvailable) return;
  const scene = window.game?.scene?.getScene?.("GameScene");
  scene?.spellManager?.startPlacingBarrier();
};
</script>

<style scoped>
.game-toolbar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
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
  font-size: clamp(11px, 2.8vw, 15px);
  color: #9edcff;
}

.game-toolbar__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(64px, 1fr));
  gap: 8px;
}

.game-toolbar__grid--spells {
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
}

.game-toolbar__card {
  background: rgba(51, 51, 51, 0.9);
  border: 2px solid rgba(102, 102, 102, 0.9);
  border-radius: 12px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: #ffffff;
}

.game-toolbar__card--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.game-toolbar__name {
  font-size: clamp(9px, 2.4vw, 12px);
  font-weight: 700;
  text-align: center;
  color: #9edcff;
}

.game-toolbar__meta {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: clamp(9px, 2.4vw, 11px);
}

.game-toolbar__cost {
  color: #ffd700;
  font-weight: 700;
}

.game-toolbar__count {
  color: #ffffff;
  font-weight: 700;
}

.game-toolbar__spell-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-toolbar__spell {
  font-size: clamp(18px, 5.5vw, 24px);
}

.game-toolbar__cooldown-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  border-radius: 4px;
}

.game-toolbar__cooldown-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.72);
  transition: height 0.1s linear;
}

.game-toolbar__cooldown-text {
  position: relative;
  z-index: 1;
  font-size: clamp(10px, 3vw, 13px);
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 4px #000;
  padding-bottom: 2px;
}

.game-toolbar__card--spell {
  position: relative;
}

.game-toolbar__badge {
  font-size: clamp(8px, 2vw, 10px);
  color: #aad4ff;
  font-weight: 700;
  margin-top: -2px;
}
</style>
