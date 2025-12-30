<template>
  <div class="achievements-overlay" @click.self="handleOverlayClick">
    <div class="achievements-card">
      <!-- Header -->
      <div class="achievements-header">
        <h2 class="achievements-title">SUCCÈS</h2>
        <button 
          class="achievements-close"
          @click="handleClose"
          aria-label="Fermer"
        >
          ×
        </button>
      </div>

      <!-- Progression globale -->
      <div v-if="summary" class="achievements-progression">
        <div class="progression-label">
          TOTAL: {{ summary.unlocked }}/{{ summary.total }} ({{ percentage }}%)
        </div>
        <div class="progression-bar">
          <div 
            class="progression-bar-fill"
            :style="{ width: percentage + '%' }"
          ></div>
        </div>
      </div>

      <!-- Liste des succès groupés par catégorie -->
      <div class="achievements-content">
        <div v-if="loading" class="achievements-loading">
          Chargement des succès...
        </div>
        <div v-else-if="achievements.length === 0" class="achievements-empty">
          Aucun succès disponible
        </div>
        <div v-else class="achievements-categories">
          <div
            v-for="category in groupedAchievements"
            :key="category.name"
            class="achievement-category-section"
          >
            <div class="category-header">
              <h3 class="category-title">{{ category.name }}</h3>
              <div class="category-progress">
                {{ category.unlocked }}/{{ category.total }}
              </div>
            </div>
            <div class="category-progress-bar">
              <div 
                class="category-progress-fill"
                :style="{ width: (category.unlocked / category.total * 100) + '%' }"
              ></div>
            </div>
            <div class="achievements-grid">
              <div
                v-for="achievement in category.items"
                :key="achievement.id"
                class="achievement-card"
                :class="{ unlocked: achievement.is_unlocked === true }"
              >
                <div class="achievement-icon">
                  {{ achievement.is_unlocked === true ? '✓' : '🔒' }}
                </div>
                <div class="achievement-info">
                  <div class="achievement-header-row">
                    <h3 class="achievement-name">{{ achievement.title }}</h3>
                    <div class="achievement-difficulty">
                      <span 
                        v-for="star in 3" 
                        :key="star"
                        class="difficulty-star"
                        :class="{ active: star <= (achievement.difficulty || 0) }"
                      >
                        ★
                      </span>
                    </div>
                  </div>
                  <p class="achievement-description">{{ achievement.description }}</p>
                  <div class="achievement-progress">
                    <span v-if="achievement.current_value != null && achievement.goal_value != null">
                      {{ achievement.current_value }}/{{ achievement.goal_value }}
                    </span>
                  </div>
                </div>
              </div>
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

const modalStore = useModalStore();
const achievementsData = computed(() => modalStore.state.achievements);

const achievements = computed(() => achievementsData.value.achievements || []);
const summary = computed(() => achievementsData.value.summary);
const loading = computed(() => achievements.length === 0 && !summary);

const percentage = computed(() => {
  if (!summary.value || summary.value.total === 0) return 0;
  return Math.floor((summary.value.unlocked / summary.value.total) * 100);
});

// Grouper les achievements par catégorie
const groupedAchievements = computed(() => {
  const groups = {};
  
  achievements.value.forEach(ach => {
    const category = ach.category || 'DIVERS';
    if (!groups[category]) {
      groups[category] = {
        name: category,
        items: [],
        unlocked: 0,
        total: 0
      };
    }
    groups[category].items.push(ach);
    groups[category].total++;
    if (ach.is_unlocked) {
      groups[category].unlocked++;
    }
  });
  
  // Trier les catégories et les items dans chaque catégorie
  const sortedCategories = Object.values(groups).sort((a, b) => {
    // Ordre de priorité des catégories
    const order = ['COMBAT', 'ECONOMY', 'TOWER', 'HERO', 'GLOBAL', 'DIVERS'];
    const aIndex = order.indexOf(a.name) !== -1 ? order.indexOf(a.name) : 999;
    const bIndex = order.indexOf(b.name) !== -1 ? order.indexOf(b.name) : 999;
    return aIndex - bIndex;
  });
  
  // Trier les items dans chaque catégorie par difficulté croissante (du plus facile au plus difficile)
  sortedCategories.forEach(category => {
    category.items.sort((a, b) => {
      return (a.difficulty || 0) - (b.difficulty || 0);
    });
  });
  
  return sortedCategories;
});

const handleClose = () => {
  modalStore.hideAchievements();
};

const handleOverlayClick = () => {
  handleClose();
};
</script>

<style scoped>
.achievements-overlay {
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

.achievements-card {
  width: 100%;
  max-width: 900px;
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

.achievements-card::before {
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

.achievements-header {
  padding: 24px 30px;
  border-bottom: 1px solid rgba(0, 234, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(5, 10, 16, 0.5);
}

.achievements-title {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: "Orbitron", "Arial Black", sans-serif;
}

.achievements-close {
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

.achievements-close:hover {
  background: rgba(0, 234, 255, 1);
  transform: scale(1.1);
}

.achievements-progression {
  padding: 20px 30px;
  background: rgba(0, 234, 255, 0.05);
  border-bottom: 1px solid rgba(0, 234, 255, 0.2);
}

.progression-label {
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 10px;
  font-family: "Orbitron", monospace;
  font-weight: bold;
}

.progression-bar {
  width: 100%;
  height: 10px;
  background: rgba(26, 32, 44, 1);
  border-radius: 5px;
  overflow: hidden;
}

.progression-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #00eaff, #00c6ff);
  border-radius: 5px;
  transition: width 0.3s ease;
}

.achievements-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 30px;
  min-height: 0;
}

.achievements-content::-webkit-scrollbar {
  width: 8px;
}

.achievements-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.achievements-content::-webkit-scrollbar-thumb {
  background: rgba(0, 234, 255, 0.5);
  border-radius: 4px;
}

.achievements-loading,
.achievements-empty {
  text-align: center;
  padding: 40px;
  color: #7dd0ff;
  font-size: 18px;
}

.achievements-categories {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.achievement-category-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 2px solid rgba(0, 234, 255, 0.3);
}

.category-title {
  font-size: 18px;
  font-weight: bold;
  color: #00eaff;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: "Orbitron", "Arial Black", sans-serif;
}

.category-progress {
  font-size: 14px;
  color: #7dd0ff;
  font-family: "Orbitron", monospace;
  font-weight: bold;
}

.category-progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(26, 32, 44, 1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.category-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00eaff, #00c6ff);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.achievement-card {
  background: linear-gradient(145deg, rgba(15, 15, 26, 0.8), rgba(5, 5, 16, 0.8));
  border: 2px solid rgba(0, 234, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  transition: all 0.3s ease;
}

.achievement-card:hover {
  border-color: rgba(0, 234, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 234, 255, 0.2);
}

.achievement-card.unlocked {
  border-color: rgba(0, 255, 136, 0.4);
  background: linear-gradient(145deg, rgba(0, 255, 136, 0.1), rgba(0, 234, 255, 0.05));
}

.achievement-progress {
  font-size: 11px;
  color: #00eaff;
  margin-top: 8px;
  font-weight: bold;
}

.achievement-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: rgba(0, 234, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.achievement-card.unlocked .achievement-icon {
  background: rgba(0, 255, 136, 0.3);
}

.achievement-info {
  flex: 1;
  min-width: 0;
}

.achievement-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 12px;
}

.achievement-name {
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  margin: 0;
  flex: 1;
}

.achievement-difficulty {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.difficulty-star {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
}

.difficulty-star.active {
  color: #ffc857;
  text-shadow: 0 0 4px rgba(255, 200, 87, 0.5);
}

.achievement-description {
  font-size: 13px;
  color: #7dd0ff;
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.achievement-category {
  font-size: 11px;
  color: #00eaff;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 0.5px;
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
  .achievements-card {
    max-width: 95vw;
  }

  .achievements-grid {
    grid-template-columns: 1fr;
  }
}
</style>

