<template>
  <div class="hero-panel__wrapper">
    <div class="hero-panel__header">
      <div>
        <p class="hero-panel__eyebrow">Héros sélectionné</p>
        <h2 class="hero-panel__title">
          {{ heroName }}
        </h2>
        <p class="hero-panel__subtitle" v-if="heroStats">
          Niveau {{ heroStats.level || 1 }} · {{ heroStats.experience || 0 }} XP
        </p>
      </div>
      <div class="hero-panel__actions">
        <button class="primary-btn" type="button" @click="$emit('upgrade')" :disabled="loading">
          Améliorer
        </button>
        <button class="ghost-btn" type="button" @click="$emit('select')" :disabled="loading">
          Changer
        </button>
      </div>
    </div>

    <div class="hero-panel__stats" v-if="heroStats">
      <div class="stat-card" v-for="stat in displayedStats" :key="stat.key">
        <p class="stat-label">{{ stat.label }}</p>
        <p class="stat-value">{{ stat.value }}</p>
      </div>
    </div>
    <p v-else class="hero-panel__placeholder">
      Chargement des informations du héros...
    </p>

    <div class="hero-panel__footer">
      <div class="points-chip">
        Points disponibles: <strong>{{ heroPoints }}</strong>
      </div>
      <p class="hint">Utilise tes points pour renforcer ton héros avant de partir en mission.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  heroStats: {
    type: Object,
    default: null,
  },
  heroPoints: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const heroName = computed(() => props.heroStats?.hero_name || props.heroStats?.name || 'Héros inconnu');

const displayedStats = computed(() => {
  if (!props.heroStats) return [];
  return [
    { key: 'hp', label: 'Vie', value: props.heroStats.max_hp ?? props.heroStats.hp ?? '—' },
    { key: 'damage', label: 'Dégâts', value: props.heroStats.base_damage ?? props.heroStats.damage ?? '—' },
    { key: 'attack_speed', label: 'Vitesse de frappe', value: props.heroStats.attack_interval_ms ? `${props.heroStats.attack_interval_ms} ms` : '—' },
    { key: 'move_speed', label: 'Agilité', value: props.heroStats.move_speed ?? '—' },
  ];
});
</script>

<style scoped>
.hero-panel__wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hero-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.hero-panel__eyebrow {
  margin: 0;
  font-size: 12px;
  color: #7ae0ff;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-panel__title {
  margin: 2px 0 0;
  font-size: 24px;
  letter-spacing: 0.04em;
}

.hero-panel__subtitle {
  margin: 4px 0 0;
  color: #98aec0;
  font-size: 13px;
}

.hero-panel__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.hero-panel__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 10px;
}

.stat-label {
  margin: 0;
  color: #9fb3c6;
  font-size: 12px;
  letter-spacing: 0.04em;
}

.stat-value {
  margin: 4px 0 0;
  font-size: 16px;
  font-weight: 700;
  color: #f4fbff;
}

.hero-panel__placeholder {
  margin: 0;
  color: #94a8ba;
}

.hero-panel__footer {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.points-chip {
  background: rgba(0, 242, 255, 0.12);
  color: #bef4ff;
  padding: 6px 10px;
  border-radius: 12px;
  border: 1px solid rgba(0, 242, 255, 0.35);
  font-weight: 600;
}

.hint {
  margin: 0;
  color: #6c7b8a;
  font-size: 12px;
}

.primary-btn {
  background: linear-gradient(135deg, #00f2ff, #6ddcff);
  border: none;
  color: #041018;
  font-weight: 800;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(0, 242, 255, 0.25);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.primary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 26px rgba(0, 242, 255, 0.35);
}

.primary-btn:disabled,
.ghost-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ghost-btn {
  border: 1px solid rgba(0, 242, 255, 0.4);
  background: rgba(0, 242, 255, 0.08);
  color: #dff7ff;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: all 0.15s ease;
}

.ghost-btn:hover {
  border-color: rgba(0, 242, 255, 0.8);
  background: rgba(0, 242, 255, 0.16);
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .hero-panel__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-panel__actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
