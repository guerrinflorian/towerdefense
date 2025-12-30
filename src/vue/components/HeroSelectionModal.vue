<template>
  <div class="hero-modal-overlay" @click.self="handleOverlayClick">
    <div class="hero-modal-card">
      <!-- Header -->
      <div class="hero-modal-header">
        <h2 class="hero-modal-title">SÉLECTION DE HÉROS</h2>
        <button 
          class="hero-modal-close"
          @click="handleClose"
          aria-label="Fermer"
        >
          ×
        </button>
      </div>

      <!-- Points disponibles et héros sélectionné -->
      <div class="hero-modal-info">
        <div class="hero-modal-points">
          POINTS DISPONIBLES : {{ heroSelection.heroPointsAvailable }}
        </div>
        <div v-if="selectedHero" class="hero-modal-selected">
          <div class="selected-hero-label">HÉROS ACTUELLEMENT SÉLECTIONNÉ :</div>
          <div class="selected-hero-card">
            <HeroAvatarCanvas
              :hero-id="Number(selectedHero.hero_id || selectedHero.id)"
              :hero-color="selectedHero.color || '#2b2b2b'"
              :size="40"
            />
            <div class="selected-hero-name">{{ selectedHero.name || `Héros ${selectedHero.id}` }}</div>
          </div>
        </div>
      </div>

      <!-- Liste des héros -->
      <div class="hero-modal-content">
        <div class="hero-list">
          <div
            v-for="hero in heroSelection.heroes"
            :key="hero.id"
            class="hero-card"
            :class="{
              locked: !isUnlocked(hero),
              selected: isSelected(hero)
            }"
            @click="handleHeroClick(hero)"
          >
            <!-- Avatar avec visuel du héros -->
            <div class="hero-avatar">
              <HeroAvatarCanvas
                :hero-id="Number(hero.hero_id || hero.id)"
                :hero-color="hero.color || '#2b2b2b'"
                :size="35"
              />
            </div>

            <!-- Infos -->
            <div class="hero-info">
              <h3 class="hero-name">{{ hero.name || `Héros ${hero.id}` }}</h3>
              <div class="hero-stats-container">
                <!-- Stats actuelles -->
                <div class="hero-stats-current">
                  <div v-if="hero.current_hp != null || hero.base_hp != null" class="hero-stat-row">
                    <span class="stat-icon">❤️</span>
                    <span class="stat-label">PV:</span>
                    <span class="stat-value">{{ Math.round(hero.current_hp || hero.base_hp || 0) }}</span>
                  </div>
                  <div v-if="hero.current_damage != null || hero.base_damage != null" class="hero-stat-row">
                    <span class="stat-icon">⚔️</span>
                    <span class="stat-label">Dégâts:</span>
                    <span class="stat-value">{{ (hero.current_damage || hero.base_damage || 0).toFixed(1) }}</span>
                  </div>
                  <div v-if="hero.current_attack_interval_ms != null || hero.base_attack_interval_ms != null" class="hero-stat-row">
                    <span class="stat-icon">⚡</span>
                    <span class="stat-label">Vitesse:</span>
                    <span class="stat-value">{{ formatSeconds(hero.current_attack_interval_ms || hero.base_attack_interval_ms || 1500) }}</span>
                  </div>
                  <div v-if="hero.current_move_speed != null || hero.base_move_speed != null" class="hero-stat-row">
                    <span class="stat-icon">🏃</span>
                    <span class="stat-label">Agilité:</span>
                    <span class="stat-value">{{ Math.round(hero.current_move_speed || hero.base_move_speed || 0) }}</span>
                  </div>
                  <div v-if="hero.enemies_retained != null" class="hero-stat-row special">
                    <span class="stat-icon">🛡️</span>
                    <span class="stat-label">Ennemis arrêtés:</span>
                    <span class="stat-value">{{ hero.enemies_retained }}</span>
                    <span class="stat-hint">(simultanément)</span>
                  </div>
                </div>
                <!-- Stats max (si débloqué) -->
                <div v-if="isUnlocked(hero)" class="hero-stats-max">
                  <div class="stats-max-label">Limites maximales:</div>
                  <div class="stats-max-values">
                    <span v-if="hero.max_hp != null" class="stat-max">
                      ❤️ {{ Math.round(hero.max_hp) }}
                    </span>
                    <span v-if="hero.max_damage != null" class="stat-max">
                      ⚔️ {{ hero.max_damage.toFixed(1) }}
                    </span>
                    <span v-if="hero.min_attack_interval_ms != null" class="stat-max">
                      ⚡ {{ formatSeconds(hero.min_attack_interval_ms) }}
                    </span>
                    <span v-if="hero.max_move_speed != null" class="stat-max">
                      🏃 {{ Math.round(hero.max_move_speed) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="hero-actions">
              <div 
                v-if="isUnlocked(hero) && isSelected(hero)"
                class="hero-selected-indicator"
              >
                <span class="hero-badge-selected">✓ SÉLECTIONNÉ</span>
              </div>
              <button
                v-else-if="isUnlocked(hero)"
                class="hero-button"
                @click.stop="handleSelect(hero.id)"
              >
                SÉLECTIONNER
              </button>
              <button
                v-else
                class="hero-button unlock"
                :class="{ 'can-afford': canUnlock(hero) }"
                :disabled="!canUnlock(hero)"
                @click.stop="handleUnlock(hero.id)"
              >
                <span class="unlock-icon">🔓</span>
                <span class="unlock-text">DÉBLOQUER</span>
                <span class="unlock-cost">{{ hero.hero_points_to_unlock || 0 }} pts</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useModalStore } from '../stores/modalStore.js';
import HeroAvatarCanvas from './HeroAvatarCanvas.vue';

const modalStore = useModalStore();
const heroSelection = computed(() => modalStore.state.heroSelection);

const isUnlocked = (hero) => {
  return hero.isUnlocked !== false && hero.unlocked !== false;
};

const isSelected = (hero) => {
  const selectedId = Number(heroSelection.value.selectedHeroId);
  const heroId = Number(hero.id);
  return selectedId === heroId;
};

const selectedHero = computed(() => {
  if (!heroSelection.value.selectedHeroId) return null;
  return heroSelection.value.heroes.find(h => h.id === heroSelection.value.selectedHeroId);
});

const canUnlock = (hero) => {
  return heroSelection.value.heroPointsAvailable >= (hero.hero_points_to_unlock || 0);
};

const formatSeconds = (ms) => {
  return (ms / 1000).toFixed(3) + 's';
};

const handleSelect = async (heroId) => {
  if (modalStore.state.heroSelection.onSelect) {
    await modalStore.state.heroSelection.onSelect(heroId);
  }
  modalStore.hideHeroSelection();
};

const handleUnlock = async (heroId) => {
  const hero = heroSelection.value.heroes.find(h => h.id === heroId);
  if (!hero || !canUnlock(hero)) {
    return;
  }
  
  // Vérifier si le héros est déjà débloqué (éviter les appels inutiles)
  if (isUnlocked(hero)) {
    return;
  }
  
  if (modalStore.state.heroSelection.onUnlock) {
    try {
      await modalStore.state.heroSelection.onUnlock(heroId);
    } catch (error) {
      // L'erreur est déjà gérée dans onUnlock
      console.error('Erreur lors du déblocage:', error);
    }
  }
};

const handleHeroClick = (hero) => {
  if (isUnlocked(hero) && !isSelected(hero)) {
    handleSelect(hero.id);
  }
};

const handleClose = () => {
  modalStore.hideHeroSelection();
};

const handleOverlayClick = () => {
  handleClose();
};
</script>

<style scoped>
.hero-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 15000;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
}

.hero-modal-card {
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  background: linear-gradient(145deg, #0f0f1a, #050510);
  border: 2px solid rgba(0, 234, 255, 0.3);
  border-radius: 20px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(0, 234, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  padding: 0;
  color: #ffffff;
  font-family: "Arial", "Segoe UI", sans-serif;
  animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.hero-modal-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #00eaff, #00c6ff, #00eaff);
  background-size: 200% 100%;
  animation: shimmer 3s linear infinite;
}

.hero-modal-header {
  padding: 24px 30px;
  border-bottom: 1px solid rgba(0, 234, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(5, 10, 16, 0.5);
}

.hero-modal-title {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: "Impact", "Arial Black", sans-serif;
}

.hero-modal-close {
  width: 34px;
  height: 34px;
  background: rgba(0, 234, 255, 0.9);
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  line-height: 1;
  padding: 0;
}

.hero-modal-close:hover {
  background: rgba(0, 234, 255, 1);
  transform: scale(1.1);
}

.hero-modal-close:active {
  transform: scale(0.95);
}

.hero-modal-info {
  padding: 16px 30px;
  background: rgba(0, 234, 255, 0.1);
  border-bottom: 1px solid rgba(0, 234, 255, 0.2);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hero-modal-points {
  font-size: 14px;
  color: #7dd0ff;
  font-family: "Orbitron", monospace;
  font-weight: bold;
}

.hero-modal-selected {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 8px;
}

.selected-hero-label {
  font-size: 12px;
  color: #00ff88;
  font-family: "Orbitron", monospace;
  font-weight: bold;
  text-transform: uppercase;
}

.selected-hero-card {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selected-hero-name {
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  text-transform: uppercase;
}

.hero-modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 30px;
  min-height: 0;
}

.hero-modal-content::-webkit-scrollbar {
  width: 8px;
}

.hero-modal-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.hero-modal-content::-webkit-scrollbar-thumb {
  background: rgba(0, 234, 255, 0.5);
  border-radius: 4px;
}

.hero-modal-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 234, 255, 0.7);
}

.hero-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hero-card {
  background: linear-gradient(145deg, rgba(15, 15, 26, 0.8), rgba(5, 5, 16, 0.8));
  border: 2px solid rgba(0, 234, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.hero-card:hover {
  border-color: rgba(0, 234, 255, 0.5);
  background: linear-gradient(145deg, rgba(15, 15, 26, 0.95), rgba(5, 5, 16, 0.95));
  transform: translateX(4px);
}

.hero-card.locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.hero-card.selected {
  border-color: rgba(0, 255, 136, 0.8);
  border-width: 3px;
  background: linear-gradient(145deg, rgba(0, 255, 136, 0.15), rgba(0, 234, 255, 0.1));
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
  transform: scale(1.02);
}

.hero-avatar {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  border: 2px solid rgba(0, 234, 255, 0.3);
  background: rgba(0, 0, 0, 0.5);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 3px;
}

.hero-card.selected .hero-avatar {
  border-color: rgba(0, 255, 136, 0.9);
  border-width: 3px;
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
}

.hero-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hero-name {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.hero-info {
  flex: 1;
  min-width: 0;
}

.hero-name {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  margin: 0 0 8px 0;
  text-transform: uppercase;
}

.hero-stats-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.hero-stats-current {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hero-stat-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #7dd0ff;
}

.hero-stat-row.special {
  margin-top: 4px;
  padding-top: 6px;
  border-top: 1px solid rgba(0, 234, 255, 0.2);
}

.stat-icon {
  font-size: 14px;
  width: 18px;
  text-align: center;
}

.stat-label {
  font-weight: 500;
  min-width: 60px;
}

.stat-value {
  font-weight: bold;
  color: #00eaff;
  font-family: "Orbitron", monospace;
}

.stat-hint {
  font-size: 10px;
  color: #5a9fbf;
  font-style: italic;
  margin-left: 4px;
}

.hero-stats-max {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 234, 255, 0.15);
}

.stats-max-label {
  font-size: 10px;
  color: #5a9fbf;
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.stats-max-values {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 11px;
  color: #7dd0ff;
}

.stat-max {
  font-family: "Orbitron", monospace;
}


.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.hero-button {
  padding: 8px 16px;
  font-size: 12px;
  font-weight: bold;
  color: #ffffff;
  background: linear-gradient(135deg, #00eaff, #00c6ff);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  min-width: 100px;
}

.hero-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 234, 255, 0.4);
}

.hero-button:active {
  transform: translateY(0);
}

.hero-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hero-button.unlock {
  background: rgba(255, 102, 102, 0.2);
  color: #ff6666;
  border: 2px solid rgba(255, 102, 102, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 16px;
  min-width: 100px;
}

.hero-button.unlock.can-afford {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.3), rgba(56, 142, 60, 0.2));
  color: #4caf50;
  border-color: rgba(76, 175, 80, 0.6);
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
}

.hero-button.unlock.can-afford:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.4), rgba(56, 142, 60, 0.3));
  border-color: rgba(76, 175, 80, 0.8);
  box-shadow: 0 0 15px rgba(76, 175, 80, 0.5);
  transform: translateY(-2px);
}

.hero-button.unlock:hover:not(:disabled):not(.can-afford) {
  background: rgba(255, 102, 102, 0.3);
  border-color: rgba(255, 102, 102, 0.6);
}

.hero-button.unlock:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.unlock-icon {
  font-size: 18px;
}

.unlock-text {
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.unlock-cost {
  font-size: 11px;
  font-family: "Orbitron", monospace;
  opacity: 0.9;
}

.hero-selected-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.hero-badge-selected {
  padding: 8px 16px;
  font-size: 12px;
  font-weight: bold;
  color: #00ff88;
  background: linear-gradient(135deg, rgba(0, 255, 136, 0.3), rgba(0, 234, 255, 0.2));
  border: 2px solid rgba(0, 255, 136, 0.6);
  border-radius: 8px;
  text-transform: uppercase;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);
  }
  50% {
    box-shadow: 0 0 25px rgba(0, 255, 136, 0.6);
  }
}

.hero-badge {
  padding: 6px 12px;
  font-size: 11px;
  font-weight: bold;
  color: #00ff88;
  background: rgba(0, 255, 136, 0.2);
  border: 1px solid rgba(0, 255, 136, 0.4);
  border-radius: 6px;
  text-transform: uppercase;
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

@media (max-width: 768px) {
  .hero-modal-card {
    max-width: 95vw;
  }

  .hero-modal-header {
    padding: 20px;
  }

  .hero-modal-content {
    padding: 15px 20px;
  }

  .hero-card {
    flex-direction: column;
    text-align: center;
  }

  .hero-actions {
    width: 100%;
    align-items: stretch;
  }

  .hero-button {
    width: 100%;
  }
}
</style>

