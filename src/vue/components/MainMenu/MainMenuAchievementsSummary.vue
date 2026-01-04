<template>
  <div class="achievements-summary">
    <div class="achievements-summary__header">
      <h3>Succès</h3>
      <button 
        class="ghost-btn small" 
        type="button" 
        @click="$emit('open')" 
        :disabled="loading"
        title="Voir tous les succès débloqués"
      >
        Voir tout
      </button>
    </div>
    <div v-if="loading" class="achievements-summary__loading">Chargement...</div>
    <div v-else class="achievements-summary__content">
      <p class="achievements-summary__progress">
        {{ unlocked }} / {{ total }} débloqués
      </p>
      <div class="progress-bar">
        <div class="progress-bar__fill" :style="{ width: percentage + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  summary: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const unlocked = computed(() => props.summary?.unlocked ?? 0);
const total = computed(() => props.summary?.total ?? 0);
const percentage = computed(() => {
  if (!total.value) return 0;
  return Math.round((unlocked.value / total.value) * 100);
});
</script>

<style scoped>
.achievements-summary {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  padding: 12px 14px;
}

.achievements-summary__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.achievements-summary h3 {
  margin: 0;
  font-size: 16px;
  letter-spacing: 0.05em;
}

.achievements-summary__progress {
  margin: 0 0 8px;
  color: #9ab6cc;
  font-size: 13px;
}

.progress-bar {
  position: relative;
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.progress-bar__fill {
  position: absolute;
  inset: 0;
  width: 0%;
  background: linear-gradient(135deg, #00f2ff, #6ddcff);
  transition: width 0.25s ease;
}

.achievements-summary__loading {
  color: #8ba1b5;
  font-size: 13px;
}

.ghost-btn {
  border: 1px solid rgba(0, 242, 255, 0.4);
  background: rgba(0, 242, 255, 0.08);
  color: #dff7ff;
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: all 0.15s ease;
}

.ghost-btn:hover {
  border-color: rgba(0, 242, 255, 0.8);
  background: rgba(0, 242, 255, 0.16);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 242, 255, 0.2);
}

.ghost-btn:active {
  transform: translateY(0);
}

.ghost-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ghost-btn.small {
  padding: 6px 10px;
  font-size: 12px;
}
</style>
