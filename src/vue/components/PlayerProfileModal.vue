<template>
  <div v-if="visible" class="profile-modal-overlay" @click.self="close">
    <div class="profile-modal">
      <div class="modal-header">
        <h2 class="modal-title">PROFIL DE JOUEUR</h2>
        <button class="close-btn" @click.stop="close">×</button>
      </div>
      
      <div v-if="loading" class="modal-content loading">
        <div class="loading-spinner"></div>
        <p>CHARGEMENT DU PROFIL...</p>
      </div>
      
      <div v-else-if="error" class="modal-content error">
        <p>{{ error }}</p>
      </div>
      
      <div v-else-if="profile" class="modal-content">
        <!-- HEADER PROFIL -->
        <div class="profile-header">
          <div class="player-avatar">
            <div class="avatar-circle">{{ profile.player.username.charAt(0).toUpperCase() }}</div>
          </div>
          <div class="player-info">
            <h3 class="player-name">{{ profile.player.username }}</h3>
            <p v-if="profile.player.created_at" class="player-joined">Membre depuis {{ formatDate(profile.player.created_at) }}</p>
            <div v-if="profile.stats.globalRank" class="player-rank">
              <span class="rank-icon">🏆</span>
              <span>Classé #{{ profile.stats.globalRank }}</span>
            </div>
          </div>
        </div>
        
        <!-- STATISTIQUES PRINCIPALES -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
              <span class="stat-label">NIVEAUX COMPLÉTÉS</span>
              <span class="stat-value">{{ profile.stats.levelsCompleted }}</span>
              <span class="stat-desc">Niveaux terminés</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">❤️</div>
            <div class="stat-content">
              <span class="stat-label">CŒURS PERDUS</span>
              <span class="stat-value">{{ profile.stats.totalLivesLost }}</span>
              <span class="stat-desc">Sur meilleur temps par niveau</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-content">
              <span class="stat-label">TEMPS TOTAL</span>
              <span class="stat-value">{{ formatTime(profile.stats.totalTimeMs) }}</span>
              <span class="stat-desc">Sur meilleur temps par niveau</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <span class="stat-label">RUNS PARFAITS</span>
              <span class="stat-value">{{ profile.stats.perfectRuns }}</span>
              <span class="stat-desc">Sans perdre de cœurs</span>
            </div>
          </div>
        </div>
        
        <!-- STATISTIQUES HÉROS -->
        <div class="section">
          <h4 class="section-title">STATISTIQUES HÉROS</h4>
          <div class="hero-stats">
            <div class="hero-stat-item">
              <span class="hero-stat-label">Héros débloqués</span>
              <span class="hero-stat-value">{{ profile.stats.heroesUnlocked }}</span>
            </div>
            <div class="hero-stat-item">
              <span class="hero-stat-label">Ennemis tués</span>
              <span class="hero-stat-value">{{ profile.stats.totalKills.toLocaleString() }}</span>
            </div>
          </div>
        </div>
        
        <!-- SUCCÈS -->
        <div class="section">
          <h4 class="section-title">SUCCÈS</h4>
          <div class="achievements-progress">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: getAchievementPercent() + '%' }"
              ></div>
            </div>
            <p class="achievements-text">
              {{ profile.stats.achievementsUnlocked }} / {{ profile.stats.totalAchievements }} débloqués
            </p>
          </div>
        </div>
        
        <!-- MEILLEURS TEMPS -->
        <div v-if="profile.bestRuns && profile.bestRuns.length > 0" class="section">
          <h4 class="section-title">MEILLEURS TEMPS</h4>
          <div class="best-runs-list">
            <div 
              v-for="run in sortedBestRuns" 
              :key="run.levelId"
              class="best-run-item"
            >
              <div class="run-level-info">
                <span class="run-level">Niveau {{ run.levelId }}</span>
                <span v-if="run.globalRank" class="run-rank-badge">🏆 Classé #{{ run.globalRank }} mondial</span>
              </div>
              <div class="run-stats">
                <span class="run-stat">
                  <span class="run-stat-label">Cœurs perdus:</span>
                  <span class="run-stat-value">❤️ {{ run.livesLost }}</span>
                </span>
                <span class="run-stat">
                  <span class="run-stat-label">Temps:</span>
                  <span class="run-stat-value">⏱️ {{ formatTime(run.completionTimeMs) }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { fetchPlayerProfile } from '../../services/profileService.js';

const props = defineProps({
  visible: { type: Boolean, default: false },
  username: { type: String, default: '' },
});

const emit = defineEmits(['close']);

const loading = ref(false);
const error = ref(null);
const profile = ref(null);

const loadProfile = async (username) => {
  loading.value = true;
  error.value = null;
  try {
    profile.value = await fetchPlayerProfile(username);
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur lors du chargement du profil';
    profile.value = null;
  } finally {
    loading.value = false;
  }
};

const sortedBestRuns = computed(() => {
  if (!profile.value?.bestRuns) return [];
  return [...profile.value.bestRuns].sort((a, b) => a.levelId - b.levelId);
});

watch([() => props.visible, () => props.username], async ([isVisible, username]) => {
  if (isVisible && username) {
    await loadProfile(username);
  } else {
    profile.value = null;
    error.value = null;
  }
}, { immediate: true });

const close = (e) => {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  emit('close');
};

const formatDate = (dateString) => {
  if (!dateString) return 'Inconnu';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatTime = (ms) => {
  if (!ms || ms === 0) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const getAchievementPercent = () => {
  if (!profile.value || profile.value.stats.totalAchievements === 0) return 0;
  return Math.round((profile.value.stats.achievementsUnlocked / profile.value.stats.totalAchievements) * 100);
};
</script>

<style scoped>
.profile-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20000;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
  pointer-events: auto;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.profile-modal {
  background: linear-gradient(135deg, rgba(8, 10, 15, 0.95) 0%, rgba(15, 20, 30, 0.95) 100%);
  border: 2px solid rgba(0, 234, 255, 0.3);
  border-radius: 8px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 234, 255, 0.2);
  animation: slideUp 0.3s ease-out;
  pointer-events: auto;
  position: relative;
  z-index: 20001;
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid rgba(0, 234, 255, 0.2);
  background: rgba(0, 234, 255, 0.05);
}

.modal-title {
  margin: 0;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 2px;
  color: #00eaff;
  text-transform: uppercase;
}

.close-btn {
  background: none;
  border: none;
  color: #00eaff;
  font-size: 32px;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border-radius: 4px;
}

.close-btn:hover {
  background: rgba(0, 234, 255, 0.1);
  transform: scale(1.1);
}

.modal-content {
  padding: 30px;
}

.modal-content.loading,
.modal-content.error {
  text-align: center;
  padding: 60px 30px;
  color: #7dd0ff;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 234, 255, 0.1);
  border-top-color: #00eaff;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* HEADER PROFIL */
.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 25px;
  margin-bottom: 25px;
  border-bottom: 1px solid rgba(0, 234, 255, 0.2);
}

.player-avatar {
  flex-shrink: 0;
}

.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00eaff 0%, #0077ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 900;
  color: #fff;
  box-shadow: 0 0 20px rgba(0, 234, 255, 0.4);
}

.player-info {
  flex: 1;
}

.player-name {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 1px;
}

.player-joined {
  margin: 0 0 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.player-rank {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #ffd700;
  font-weight: 700;
}

.rank-icon {
  font-size: 18px;
}

/* STATISTIQUES */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(0, 234, 255, 0.2);
  border-radius: 4px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s;
}

.stat-card:hover {
  background: rgba(0, 234, 255, 0.1);
  border-color: #00eaff;
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  font-size: 24px;
  font-weight: 900;
  color: #00eaff;
}

.stat-desc {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

/* SECTIONS */
.section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 14px;
  font-weight: 800;
  color: #00eaff;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0 0 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 234, 255, 0.2);
}

.hero-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hero-stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border-left: 3px solid #00eaff;
  border-radius: 4px;
}

.hero-stat-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-stat-value {
  font-size: 16px;
  font-weight: 800;
  color: #00eaff;
}

/* PROGRESSION SUCCÈS */
.achievements-progress {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00eaff 0%, #00ffaa 100%);
  box-shadow: 0 0 10px rgba(0, 234, 255, 0.5);
  transition: width 0.5s ease-out;
}

.achievements-text {
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
}

/* MEILLEURS TEMPS */
.best-runs-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.best-run-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(0, 234, 255, 0.1);
  border-radius: 4px;
  transition: all 0.2s;
}

.best-run-item:hover {
  background: rgba(0, 234, 255, 0.05);
  border-color: #00eaff;
}

.run-level-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.run-level {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}

.run-rank-badge {
  font-size: 10px;
  color: #ffd700;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  letter-spacing: 0.5px;
}

.run-stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.run-stat {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.run-stat-label {
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  font-size: 11px;
}

.run-stat-value {
  color: #00eaff;
  font-weight: 700;
}

.run-rank {
  font-size: 11px;
  color: #ffd700;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>

