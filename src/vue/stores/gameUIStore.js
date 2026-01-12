import { reactive, readonly } from "vue/dist/vue.esm-bundler.js";

const state = reactive({
  visible: false,
  money: 0,
  lives: 0,
  currentWave: 1,
  totalWaves: 1,
  elapsedMs: 0,
  turrets: {
    counts: {},
    maxBarracks: 0,
    maxSnipers: 0,
  },
});

export function useGameUIStore() {
  const setVisible = (value) => {
    state.visible = Boolean(value);
  };

  const setHud = ({ money, lives, currentWave, totalWaves, elapsedMs }) => {
    if (typeof money === "number") state.money = money;
    if (typeof lives === "number") state.lives = lives;
    if (typeof currentWave === "number") state.currentWave = currentWave;
    if (typeof totalWaves === "number") state.totalWaves = totalWaves;
    if (typeof elapsedMs === "number") state.elapsedMs = elapsedMs;
  };

  const setTimer = (elapsedMs) => {
    if (typeof elapsedMs === "number") state.elapsedMs = elapsedMs;
  };

  const setTurrets = ({ money, counts, maxBarracks, maxSnipers }) => {
    if (typeof money === "number") state.money = money;
    if (counts) {
      state.turrets.counts = { ...counts };
    }
    if (typeof maxBarracks === "number") state.turrets.maxBarracks = maxBarracks;
    if (typeof maxSnipers === "number") state.turrets.maxSnipers = maxSnipers;
  };

  return {
    state: readonly(state),
    setVisible,
    setHud,
    setTimer,
    setTurrets,
  };
}
