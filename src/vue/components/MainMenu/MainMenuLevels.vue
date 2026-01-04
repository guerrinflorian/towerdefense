<template>
  <div class="levels-view">
    <div class="levels-grid">
      <button
        v-for="level in levels"
        :key="level.id"
        class="level-card"
        :class="[
          `biome-${getBiome(level.id)}`,
          { locked: isLocked(level.id) }
        ]"
        :disabled="isLocked(level.id)"
        @click="!isLocked(level.id) && $emit('select-level', { levelId: level.id, levelName: level.name })"
        :title="isLocked(level.id) ? 'Mission verrouillée' : `Commencer la mission: ${level.name}`"
      >
        <div class="level-visual">
          <div class="biome-background" :class="`biome-${getBiome(level.id)}`"></div>
          <div class="level-number">{{ level.orderIndex || level.id }}</div>
          <div class="particles-container" :class="`biome-${getBiome(level.id)}`">
            <div class="particle" v-for="i in 15" :key="i" :style="getParticleStyle(i)"></div>
          </div>
        </div>
        
        <div class="level-content">
          <div class="level-info">
            <span class="level-num">MISSION {{ level.orderIndex || level.id }}</span>
            <h4 class="level-name">{{ level.name }}</h4>
          </div>
          
          <div class="level-status">
            <template v-if="getBestRun(level.id)">
              <span class="status-cleared">
                <span class="status-icon">✓</span>
                COMPLÉTÉ
              </span>
              <div class="best-run-stats">
                <span class="stat-item">
                  <span class="stat-icon">❤️</span>
                  <span class="stat-value">{{ getBestRun(level.id).livesLost || 0 }}</span>
                </span>
                <span class="stat-item">
                  <span class="stat-icon">⏱️</span>
                  <span class="stat-value">{{ formatTime(getBestRun(level.id).completionTimeMs || 0) }}</span>
                </span>
              </div>
              <div v-if="getGlobalRecord(level.id)" class="global-record">
                <span class="record-text">🏆 {{ getGlobalRecord(level.id).username }}: </span>
                <span class="record-stats-inline">
                  <span>❤️ {{ getGlobalRecord(level.id).lives_lost || 0 }}</span>
                  <span>⏱️ {{ formatTime(getGlobalRecord(level.id).completion_time_ms || 0) }}</span>
                </span>
              </div>
            </template>
            <span v-else class="status-pending">
              <span class="status-icon">○</span>
              EN ATTENTE
            </span>
          </div>
        </div>
        
        <div v-if="isLocked(level.id)" class="lock-overlay">
          <span class="lock-icon">🔒</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { getLevelConfigById } from '../../../config/levels/index.js';

const props = defineProps({
  levels: { type: Array, default: () => [] },
  bestRunsMap: { type: [Map, Object], default: () => new Map() },
  levelLocks: { type: Array, default: () => [] },
  levelRecords: { type: Map, default: () => new Map() },
});

const getBiome = (levelId) => {
  const config = getLevelConfigById(levelId);
  if (!config || !config.biome) return 'grass';
  return config.biome;
};

const getBestRun = (levelId) => {
  if (props.bestRunsMap instanceof Map) {
    return props.bestRunsMap.get(levelId);
  }
  return props.bestRunsMap[levelId];
};

const getGlobalRecord = (levelId) => {
  if (props.levelRecords instanceof Map) {
    return props.levelRecords.get(levelId);
  }
  return props.levelRecords[levelId];
};

const isLocked = (levelId) => {
  const lock = props.levelLocks?.find(l => l.levelId === levelId);
  return lock?.isLocked ?? false;
};

const getParticleStyle = (index) => {
  // Position aléatoire mais cohérente basée sur l'index
  const left = (index * 7.5) % 100;
  const delay = (index * 0.3) % 3;
  const duration = 2 + (index % 3) * 0.5; // Entre 2 et 3.5 secondes
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  };
};

const formatTime = (ms) => {
  if (!ms || ms === 0) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
</script>

<style scoped>
.levels-view {
  width: 100%;
  padding: 10px;
}

.levels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.level-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  min-height: 180px;
}

.level-card:hover:not(.locked) {
  border-color: #00eaff;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 234, 255, 0.3);
  cursor: pointer;
  background: rgba(0, 234, 255, 0.05);
}

.level-card:active:not(.locked) {
  transform: translateY(-2px);
}

/* VISUEL AVEC BIOME */
.level-visual {
  position: relative;
  height: 100px;
  overflow: hidden;
}

.biome-background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.level-card:hover:not(.locked) .biome-background {
  opacity: 0.8;
}

.level-number {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.3);
  text-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  z-index: 2;
}

/* PARTICULES ANIMÉES */
.particles-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  opacity: 0.6;
  animation: particle-fall linear infinite;
  top: -10px;
}

@keyframes particle-fall {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(120px) translateX(10px);
    opacity: 0;
  }
}

/* Couleurs des particules selon le biome */
.biome-grass .particle {
  background: #6b9f3d;
  box-shadow: 0 0 4px #6b9f3d;
}

.biome-sand .particle {
  background: #f4d03f;
  box-shadow: 0 0 4px #f4d03f;
}

.biome-ice .particle {
  background: #87ceeb;
  box-shadow: 0 0 4px #87ceeb;
}

.biome-cimetiere .particle {
  background: #8b8b8b;
  box-shadow: 0 0 4px #8b8b8b;
}

.biome-volcan .particle,
.biome-lava .particle {
  background: #ff4444;
  box-shadow: 0 0 4px #ff4444;
}

/* BIOMES - COULEURS ET DÉGRADÉS */
.biome-grass .biome-background {
  background: linear-gradient(135deg, #2d5016 0%, #4a7c2a 50%, #6b9f3d 100%);
  box-shadow: inset 0 0 50px rgba(107, 159, 61, 0.3);
}

.biome-grass .level-number {
  color: rgba(107, 159, 61, 0.4);
}

.biome-grass.level-card {
  border-left: 4px solid #6b9f3d;
}

.biome-grass.level-card:hover:not(.locked) {
  box-shadow: 0 10px 30px rgba(107, 159, 61, 0.2);
}

.biome-sand .biome-background {
  background: linear-gradient(135deg, #8b6914 0%, #d4a574 50%, #f4d03f 100%);
  box-shadow: inset 0 0 50px rgba(244, 208, 63, 0.3);
}

.biome-sand .level-number {
  color: rgba(244, 208, 63, 0.4);
}

.biome-sand.level-card {
  border-left: 4px solid #f4d03f;
}

.biome-sand.level-card:hover:not(.locked) {
  box-shadow: 0 10px 30px rgba(244, 208, 63, 0.2);
}

.biome-ice .biome-background {
  background: linear-gradient(135deg, #1a3a52 0%, #4a90a4 50%, #87ceeb 100%);
  box-shadow: inset 0 0 50px rgba(135, 206, 235, 0.3);
}

.biome-ice .level-number {
  color: rgba(135, 206, 235, 0.4);
}

.biome-ice.level-card {
  border-left: 4px solid #87ceeb;
}

.biome-ice.level-card:hover:not(.locked) {
  box-shadow: 0 10px 30px rgba(135, 206, 235, 0.2);
}

.biome-cimetiere .biome-background {
  background: linear-gradient(135deg, #1a1a1a 0%, #3d3d3d 50%, #5a5a5a 100%);
  box-shadow: inset 0 0 50px rgba(100, 100, 100, 0.3);
}

.biome-cimetiere .level-number {
  color: rgba(150, 150, 150, 0.4);
}

.biome-cimetiere.level-card {
  border-left: 4px solid #8b8b8b;
}

.biome-cimetiere.level-card:hover:not(.locked) {
  box-shadow: 0 10px 30px rgba(139, 139, 139, 0.2);
}

.biome-volcan .biome-background,
.biome-lava .biome-background {
  background: linear-gradient(135deg, #4a1a1a 0%, #8b2a2a 50%, #ff4444 100%);
  box-shadow: inset 0 0 50px rgba(255, 68, 68, 0.3);
}

.biome-volcan .level-number,
.biome-lava .level-number {
  color: rgba(255, 68, 68, 0.4);
}

.biome-volcan.level-card,
.biome-lava.level-card {
  border-left: 4px solid #ff4444;
}

.biome-volcan.level-card:hover:not(.locked),
.biome-lava.level-card:hover:not(.locked) {
  box-shadow: 0 10px 30px rgba(255, 68, 68, 0.2);
}

/* CONTENU */
.level-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.level-info {
  margin-bottom: 15px;
}

.level-num {
  font-size: 10px;
  color: #00eaff;
  letter-spacing: 2px;
  font-weight: 700;
  text-transform: uppercase;
  display: block;
  margin-bottom: 8px;
  opacity: 0.8;
}

.level-name {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #fff;
  line-height: 1.3;
}

.level-status {
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.status-cleared,
.status-pending {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.status-icon {
  font-size: 14px;
}

.status-cleared {
  color: #00ffaa;
}

.status-pending {
  color: rgba(255, 255, 255, 0.4);
}

.best-run-stats {
  display: flex;
  gap: 15px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.stat-icon {
  font-size: 14px;
}

.stat-value {
  font-weight: 700;
  color: #00ffaa;
}

.global-record {
  margin-top: 8px;
  font-size: 10px;
  color: rgba(255, 215, 0, 0.8);
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1.2;
}

.record-text {
  font-weight: 600;
}

.record-stats-inline {
  display: flex;
  gap: 10px;
  font-weight: 700;
  color: #ffd700;
}

/* LOCK OVERLAY */
.lock-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  z-index: 10;
}

.lock-icon {
  font-size: 40px;
  opacity: 0.8;
}

.level-card.locked {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(0.8);
}

.level-card.locked .biome-background {
  opacity: 0.3;
}
</style>

