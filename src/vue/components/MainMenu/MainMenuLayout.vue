<template>
  <div v-if="visible" class="hud-overlay">
    <div class="hud-background"></div>

    <div class="hud-container">
      <header class="hud-header">
        <div class="brand">
          <span class="eyebrow">Interface de Commandement</span>
          <h1 class="game-title">LAST OUTPOST</h1>
          <p v-if="playerName" class="player-info">
            Joueur : <span class="highlight">{{ playerName }}</span>
          </p>
        </div>

        <div class="header-actions">
          <button class="hud-btn-secondary" @click="openHelp" title="Ouvrir le guide tactique">
            <span class="icon">❓</span> AIDE
          </button>
          <button class="hud-btn-secondary" @click="refreshData" :disabled="loading" title="Actualiser toutes les données">
            <span class="icon">↻</span> ACTUALISER
          </button>
          <button class="hud-btn-danger" @click="handleLogout" title="Se déconnecter">DÉCONNEXION</button>
        </div>
      </header>

      <main v-if="currentView === 'home'" class="hud-main-grid">
        
        <aside class="hud-column-left">
          <section class="hud-element hero-section">
            <div class="hero-avatar-container">
              <div class="avatar-frame-main">
                <HeroAvatarCanvas
                  v-if="heroStats"
                  :hero-id="Number(heroStats?.hero_id || 1)"
                  :hero-color="heroStats?.color || '#2b2b2b'"
                  :size="60"
                />
              </div>
            </div>
            <MainMenuHeroPanel
              :hero-stats="heroStats"
              :hero-points="heroPoints"
              :hero-name="heroName"
              :loading="loading"
              @upgrade="openHeroUpgrade"
              @select="openHeroSelection"
            />
          </section>

          <section class="hud-element achievements-section">
            <h3 class="section-label">Archives de Combat</h3>
            <MainMenuAchievementsSummary
              :summary="achievementsSummary"
              :loading="achievementsLoading"
              @open="openAchievements"
            />
          </section>
        </aside>

        <section class="hud-column-center">
          <div class="deploy-wrapper">
            <div class="scanner-effect"></div>
            <button class="deploy-main-btn" @click="showChapters" title="Sélectionner un chapitre et commencer une mission">
              <span class="deploy-icon">🚀</span>
              <span class="deploy-text">DÉPLOYER</span>
              <span class="deploy-sub">Aller au combat !</span>
            </button>
          </div>
        </section>

        <aside class="hud-column-right">
          <section class="hud-element leaderboard-section">
            <h3 class="section-label">Classement Mondial</h3>
            <MainMenuLeaderboard :entries="leaderboard" :loading="leaderboardLoading" />
          </section>
        </aside>
      </main>

      <div v-else class="hud-navigation-view">
        <nav class="nav-header">
          <button 
            class="hud-btn-secondary" 
            @click="handleBackNavigation"
            :title="getBackButtonTitle()"
          >
            ← RETOUR
          </button>
          <h2 class="view-title">{{ getViewTitle() }}</h2>
        </nav>

        <div class="nav-content">
          <MainMenuChapters
            v-if="currentView === 'chapters'"
            :chapters="chapters"
            :best-runs-map="bestRunsMap"
            :loading="chaptersLoading"
            @select-chapter="showLevels"
          />

          <MainMenuLevels
            v-else-if="currentView === 'levels' && selectedChapter"
            :levels="selectedChapter.levels"
            :best-runs-map="bestRunsMap"
            :level-locks="selectedChapter.levelLocks || []"
            :level-records="levelRecords"
            @select-level="startLevel"
          />

          <HelpPage
            v-else-if="currentView === 'help'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useModalStore } from '../../stores/modalStore.js';
import {
  ensureProfileLoaded, getHeroPointsAvailable, getHeroStats,
  getProfile, getUnlockedLevel, isAuthenticated, setSelectedHeroId
} from '../../../services/authManager.js';
import { showAuth } from '../../../services/authOverlay.js';
import { fetchAchievements } from '../../../services/achievementsService.js';
import {
  buildChapterViewModels, buildLevelLocks, fetchBestRunsMap,
  fetchChapterProgress, fetchChaptersWithLevels, resetCachedChapters
} from '../../../services/chapterService.js';
import { fetchGlobalLeaderboard, fetchLevelLeaderboards } from '../../../services/leaderboardService.js';
import { fetchHeroes, unlockHero } from '../../../services/heroService.js';

// Imports des composants enfants (inchangés)
import MainMenuHeroPanel from './MainMenuHeroPanel.vue';
import MainMenuAchievementsSummary from './MainMenuAchievementsSummary.vue';
import MainMenuChapters from './MainMenuChapters.vue';
import MainMenuLeaderboard from './MainMenuLeaderboard.vue';
import MainMenuLevels from './MainMenuLevels.vue';
import HeroAvatarCanvas from '../HeroAvatarCanvas.vue';
import HelpPage from '../HelpPage.vue';

const modalStore = useModalStore();
const visible = computed(() => modalStore.state.mainMenu.visible);
const callbacks = computed(() => modalStore.state.mainMenu.callbacks || {});

// State
const currentView = ref('home');
const selectedChapter = ref(null);
const loading = ref(false);
const heroStats = ref(null);
const heroPoints = ref(0);
const heroName = ref('Héros');
const playerName = ref('');
const achievementsSummary = ref(null);
const achievements = ref([]);
const bestRunsMap = ref(new Map());
const chapters = ref([]);
const leaderboard = ref([]);
const achievementsLoading = ref(false);
const chaptersLoading = ref(false);
const leaderboardLoading = ref(false);
const levelRecords = ref(new Map()); // Map<levelId, { username, lives_lost, completion_time_ms }>

// Logic (Data fetching)
const refreshData = async () => {
  loading.value = true;
  try {
    resetCachedChapters();
    if (isAuthenticated()) {
      await Promise.all([loadProfile(), loadAchievements(), loadLeaderboard()]);
    }
    await loadChapters();
  } finally {
    loading.value = false;
  }
};

const loadProfile = async () => {
  await ensureProfileLoaded();
  const profile = getProfile();
  heroStats.value = getHeroStats();
  heroPoints.value = getHeroPointsAvailable();
  playerName.value = profile?.player?.username || 'Invité';
  
  // Charger le nom du héros
  if (heroStats.value?.hero_id) {
    try {
      const heroId = heroStats.value.hero_id;
      const response = await fetchHeroes();
      const heroes = response?.heroes || response || [];
      const hero = Array.isArray(heroes) ? heroes.find(h => Number(h.id) === Number(heroId) || Number(h.hero_id) === Number(heroId)) : null;
      heroName.value = hero ? hero.name : `Héros ${heroId}`;
    } catch (error) {
      console.error('Erreur récupération nom héros:', error);
      heroName.value = `Héros ${heroStats.value.hero_id || ''}`;
    }
  } else {
    heroName.value = 'Héros';
  }
};

const loadAchievements = async () => {
  achievementsLoading.value = true;
  const data = await fetchAchievements();
  achievements.value = data?.achievements || data || [];
  achievementsSummary.value = data?.summary || { unlocked: 0, total: 0 };
  achievementsLoading.value = false;
};

const loadChapters = async () => {
  chaptersLoading.value = true;
  let chapterData = [];
  let runsMap = new Map();
  
  if (isAuthenticated()) {
    const progress = await fetchChapterProgress().catch(() => null);
    chapterData = progress?.chapters || await fetchChaptersWithLevels();
    runsMap = progress?.bestRunsMap || await fetchBestRunsMap();
  } else {
    chapterData = await fetchChaptersWithLevels();
  }
  
  const unlockedLevel = isAuthenticated() ? getUnlockedLevel() : 1;
  bestRunsMap.value = runsMap;
  const chapterVMs = buildChapterViewModels(chapterData, runsMap);
  chapters.value = chapterVMs.map(c => ({
    ...c,
    levelLocks: Array.from(buildLevelLocks(c.levels, c.isLocked, runsMap, unlockedLevel))
      .map(([id, p]) => ({ levelId: id, ...p }))
  }));
  chaptersLoading.value = false;
};

const loadLeaderboard = async () => {
  leaderboardLoading.value = true;
  leaderboard.value = await fetchGlobalLeaderboard().catch(() => []);
  leaderboardLoading.value = false;
};

const loadLevelRecords = async () => {
  try {
    const levels = await fetchLevelLeaderboards();
    // Créer une Map avec le meilleur record (premier de la liste) pour chaque niveau
    const recordsMap = new Map();
    levels.forEach(level => {
      if (level.entries && level.entries.length > 0) {
        // Le premier entry est le meilleur record
        const bestRecord = level.entries[0];
        recordsMap.set(level.levelId, {
          username: bestRecord.username,
          lives_lost: bestRecord.lives_lost,
          completion_time_ms: bestRecord.completion_time_ms,
        });
      }
    });
    levelRecords.value = recordsMap;
  } catch (error) {
    console.error("Erreur chargement records niveaux:", error);
    levelRecords.value = new Map();
  }
};

// Navigation
const goHome = () => { currentView.value = 'home'; selectedChapter.value = null; };
const showChapters = () => { currentView.value = 'chapters'; selectedChapter.value = null; };
const showLevels = (chapter) => { selectedChapter.value = chapter; currentView.value = 'levels'; };
const showHelp = () => { currentView.value = 'help'; };

const handleBackNavigation = () => {
  if (currentView.value === 'levels') {
    showChapters();
  } else if (currentView.value === 'help') {
    goHome();
  } else {
    goHome();
  }
};

const getBackButtonTitle = () => {
  if (currentView.value === 'levels') return 'Retour à la sélection des chapitres';
  if (currentView.value === 'help') return 'Retour au menu principal';
  return 'Retour au menu principal';
};

const getViewTitle = () => {
  if (currentView.value === 'chapters') return 'SÉLECTION DU CHAPITRE';
  if (currentView.value === 'help') return 'GUIDE TACTIQUE';
  return selectedChapter.value?.name || '';
};

const startLevel = (payload) => {
  if (!isAuthenticated()) return showAuth();
  callbacks.value.onStartLevel?.(payload);
};

// Helpers
const getBestRun = (id) => bestRunsMap.value instanceof Map ? bestRunsMap.value.get(id) : bestRunsMap.value[id];
const isLevelLocked = (chap, id) => chap?.levelLocks?.find(l => l.levelId === id)?.isLocked ?? true;

const openHeroUpgrade = () => callbacks.value.onShowHeroUpgrade ? callbacks.value.onShowHeroUpgrade() : modalStore.showHeroUpgrade({});
const openHeroSelection = async () => {
  const h = await fetchHeroes();
  modalStore.showHeroSelection({
    heroes: h?.heroes || h,
    selectedHeroId: heroStats.value?.hero_id,
    heroPointsAvailable: heroPoints.value,
    onSelect: async (id) => { await setSelectedHeroId(id); await loadProfile(); },
    onUnlock: async (heroId) => {
      try {
        const response = await unlockHero(heroId);
        // Mettre à jour les points disponibles
        if (response?.heroPointsAvailable !== undefined) {
          modalStore.updateHeroPoints(response.heroPointsAvailable);
        }
        // Recharger la liste des héros et le profil
        await loadProfile();
        const updatedHeroes = await fetchHeroes();
        modalStore.updateHeroList(updatedHeroes?.heroes || updatedHeroes, response?.heroPointsAvailable);
        window.dispatchEvent(new CustomEvent('hero:unlocked', { detail: { heroId, response } }));
      } catch (error) {
        console.error('Erreur déblocage héros:', error);
        const errorMessage = error.response?.data?.error || 'Impossible de débloquer ce héros';
        alert(errorMessage);
        throw error;
      }
    }
  });
};
const openAchievements = () => modalStore.showAchievements({ achievements: achievements.value, summary: achievementsSummary.value });
const openHelp = () => { showHelp(); };
const handleLogout = () => callbacks.value.onLogout ? callbacks.value.onLogout() : showAuth();

// Lifecycle
const hydrate = () => { 
  if (visible.value) { 
    currentView.value = 'home'; 
    refreshData();
    loadLevelRecords();
  } 
};

let profileHandler = null;
let colorHandler = null;
let upgradeHandler = null;

onMounted(() => { 
  hydrate(); 
  profileHandler = () => hydrate();
  colorHandler = () => loadProfile();
  upgradeHandler = () => loadProfile(); // Rafraîchir les stats après une amélioration
  window.addEventListener('profile:updated', profileHandler);
  window.addEventListener('hero:color-changed', colorHandler);
  window.addEventListener('hero:upgrade-complete', upgradeHandler);
});
onBeforeUnmount(() => {
  if (profileHandler) window.removeEventListener('profile:updated', profileHandler);
  if (colorHandler) window.removeEventListener('hero:color-changed', colorHandler);
  if (upgradeHandler) window.removeEventListener('hero:upgrade-complete', upgradeHandler);
});
watch(visible, (val) => val && hydrate());
</script>

<style scoped>
/* HUD BASE */
.hud-overlay {
  position: fixed;
  inset: 0;
  z-index: 12000;
  color: #e5ecf5;
  font-family: "Orbitron", sans-serif;
  overflow-y: auto;
  overflow-x: hidden;
  pointer-events: auto;
}

.hud-background {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%),
              url('../../../images/background.jpg') center/cover no-repeat;
  z-index: -1;
  pointer-events: none;
  opacity: 0.3;
}

.hud-container {
  min-height: 100vh;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 1800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  pointer-events: auto;
  box-sizing: border-box;
}

/* HEADER */
.hud-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(0, 242, 255, 0.2);
  padding-bottom: 15px;
  flex-shrink: 0;
  gap: 12px;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.game-title {
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 3px;
  margin: 0;
  color: #fff;
  text-shadow: 0 0 20px rgba(0, 242, 255, 0.6);
  line-height: 1.2;
}

.eyebrow {
  color: #00f2ff;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* MAIN GRID */
.hud-main-grid {
  display: flex;
  flex-direction: row;
  gap: 20px;
  flex: 1;
  min-height: 0;
  align-items: stretch;
}

/* COLUMNS */
.hud-column-left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 0 0 28%;
  min-width: 0;
  min-height: 0;
}

.hud-column-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 44%;
  min-width: 0;
  min-height: 0;
}

.hud-column-right {
  display: flex;
  flex-direction: column;
  flex: 0 0 28%;
  min-width: 0;
  min-height: 0;
}

/* HUD ELEMENTS (No bg, just border/glow) */
.hud-element {
  background: transparent;
  border-left: 2px solid rgba(0, 242, 255, 0.2);
  padding: 15px;
  position: relative;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.hero-section {
  flex: 0 1 auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.hero-avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
}

.avatar-frame-main {
  width: 50px;
  height: 70px;
  border: 2px solid rgba(0, 242, 255, 0.4);
  border-radius: 8px;
  padding: 2px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 0 12px rgba(0, 242, 255, 0.2);
}

.achievements-section {
  flex: 0 1 auto;
  margin-top: 15px;
}

.leaderboard-section {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.leaderboard-section > :deep(.hud-leaderboard) {
  flex: 1;
  min-height: 0;
}

.section-label {
  font-size: 12px;
  color: #00f2ff;
  text-transform: uppercase;
  margin-bottom: 12px;
  opacity: 0.8;
  flex-shrink: 0;
}

/* DEPLOY BUTTON - CENTRAL PIECE */
.deploy-wrapper {
  position: relative;
  padding: 30px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.deploy-main-btn {
  background: transparent;
  border: 2px solid #00f2ff;
  padding: 40px 50px;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  box-shadow: 0 0 30px rgba(0, 242, 255, 0.1), inset 0 0 20px rgba(0, 242, 255, 0.05);
  position: relative;
  overflow: hidden;
  pointer-events: auto;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.deploy-main-btn:hover {
  background: rgba(0, 242, 255, 0.1);
  box-shadow: 0 0 50px rgba(0, 242, 255, 0.4);
  transform: scale(1.05);
  border-color: #00f2ff;
}

.deploy-main-btn:active {
  transform: scale(1.02);
}

.deploy-icon { font-size: 48px; margin-bottom: 8px; }
.deploy-text { font-size: 24px; font-weight: 800; letter-spacing: 6px; }
.deploy-sub { font-size: 11px; opacity: 0.6; margin-top: 8px; }

/* SCANNER EFFECT */
.scanner-effect {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 2px;
  background: #00f2ff;
  box-shadow: 0 0 15px #00f2ff;
  animation: scan 3s infinite linear;
}

@keyframes scan {
  0% { top: 10%; opacity: 0; }
  50% { opacity: 1; }
  100% { top: 90%; opacity: 0; }
}

/* BUTTONS */
.hud-btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 242, 255, 0.3);
  color: #00f2ff;
  padding: 8px 16px;
  margin-bottom: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  font-size: 12px;
  white-space: nowrap;
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1;
}

.hud-btn-secondary:hover {
  background: rgba(0, 242, 255, 0.2);
  border-color: rgba(0, 242, 255, 0.6);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 242, 255, 0.3);
}

.hud-btn-secondary:active {
  transform: translateY(0);
}

.hud-btn-danger {
  background: rgba(255, 60, 60, 0.1);
  border: 1px solid #ff3c3c;
  color: #ff3c3c;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.hud-btn-danger:hover {
  background: rgba(255, 60, 60, 0.2);
  border-color: #ff6b6b;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 60, 60, 0.3);
}

.hud-btn-danger:active {
  transform: translateY(0);
}

/* NAV VIEWS */
.hud-navigation-view {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.nav-header {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(0, 242, 255, 0.2);
  flex-shrink: 0;
}

.nav-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 20px;
}


/* RESPONSIVE */
@media (max-width: 1400px) {
  .hud-container {
    padding: 15px;
  }
  
  .game-title {
    font-size: 28px;
    letter-spacing: 2px;
  }
  
  .hud-main-grid {
    gap: 15px;
  }
  
  .hud-column-left {
    flex: 0 0 26%;
  }
  
  .hud-column-center {
    flex: 0 0 48%;
  }
  
  .hud-column-right {
    flex: 0 0 26%;
  }
  
  .deploy-icon { font-size: 40px; }
  .deploy-text { font-size: 20px; letter-spacing: 4px; }
}

@media (max-width: 1200px) {
  .hud-main-grid {
    flex-direction: column;
    gap: 20px;
  }
  
  .hud-column-left,
  .hud-column-center,
  .hud-column-right {
    flex: 1 1 auto;
    width: 100%;
  }
  
  .hud-column-center {
    order: -1;
  }
  
  .deploy-wrapper {
    padding: 20px;
  }
  
  .deploy-main-btn {
    padding: 30px 40px;
  }
  
  .hud-column-left {
    flex-direction: row;
    gap: 15px;
  }
  
  .hero-section,
  .achievements-section {
    flex: 1;
    margin-top: 0;
  }
}

@media (max-height: 800px) {
  .hud-container {
    padding: 15px;
  }
  
  .hud-header {
    margin-bottom: 15px;
    padding-bottom: 10px;
    flex-wrap: wrap;
  }
  
  .game-title {
    font-size: 24px;
  }
  
  .header-actions {
    gap: 6px;
  }
  
  .hud-main-grid {
    gap: 15px;
  }
  
  .hud-element {
    padding: 12px;
  }
  
  .deploy-wrapper {
    padding: 15px;
  }
  
  .deploy-main-btn {
    padding: 25px 35px;
  }
  
  .deploy-icon { font-size: 36px; }
  .deploy-text { font-size: 18px; letter-spacing: 3px; }
}

@media (max-width: 768px) {
  .hud-container {
    padding: 10px;
  }
  
  .hud-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .game-title {
    font-size: 20px;
  }
  
  .hud-btn-secondary,
  .hud-btn-danger {
    padding: 6px 12px;
    font-size: 11px;
  }
}

@media (max-width: 640px) {
  .hud-main-grid {
    gap: 16px;
  }

  .hud-column-left {
    flex-direction: column;
    gap: 12px;
  }

  .hud-column-left,
  .hud-column-center,
  .hud-column-right {
    width: 100%;
  }

  .hud-element {
    width: 100%;
  }
}
</style>
