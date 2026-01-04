<template>
  <div v-if="visible" class="main-menu-overlay">
    <div class="main-menu__backdrop"></div>
    <div class="main-menu__content">
      <header class="main-menu__header">
        <div>
          <p class="main-menu__eyebrow">Menu Principal</p>
          <h1 class="main-menu__title">Last Outpost</h1>
          <p v-if="playerName" class="main-menu__subtitle">
            Connecté en tant que <strong>{{ playerName }}</strong>
          </p>
        </div>
        <div class="main-menu__header-actions">
          <button class="ghost-btn" type="button" @click="refreshData" :disabled="loading">
            ↻ Rafraîchir
          </button>
          <button class="ghost-btn" type="button" @click="handleLogout">
            Se déconnecter
          </button>
        </div>
      </header>

      <div class="main-menu__grid">
        <section class="main-menu__panel hero-panel">
          <MainMenuHeroPanel
            :hero-stats="heroStats"
            :hero-points="heroPoints"
            :loading="loading"
            @upgrade="openHeroUpgrade"
            @select="openHeroSelection"
          />

          <MainMenuAchievementsSummary
            class="panel-margin"
            :summary="achievementsSummary"
            :loading="achievementsLoading"
            @open="openAchievements"
          />
        </section>

        <section class="main-menu__panel chapters-panel">
          <MainMenuChapters
            :chapters="chapters"
            :best-runs-map="bestRunsMap"
            :loading="chaptersLoading"
            @play="startLevel"
          />
        </section>

        <section class="main-menu__panel leaderboard-panel">
          <MainMenuLeaderboard :entries="leaderboard" :loading="leaderboardLoading" />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useModalStore } from '../../stores/modalStore.js';
import {
  ensureProfileLoaded,
  getHeroPointsAvailable,
  getHeroStats,
  getProfile,
  getUnlockedLevel,
  isAuthenticated,
  setSelectedHeroId,
} from '../../../services/authManager.js';
import { showAuth } from '../../../services/authOverlay.js';
import { fetchAchievements } from '../../../services/achievementsService.js';
import {
  buildChapterViewModels,
  buildLevelLocks,
  fetchBestRunsMap,
  fetchChapterProgress,
  fetchChaptersWithLevels,
  resetCachedChapters,
} from '../../../services/chapterService.js';
import { fetchGlobalLeaderboard } from '../../../services/leaderboardService.js';
import { fetchHeroes, unlockHero } from '../../../services/heroService.js';
import MainMenuHeroPanel from './MainMenuHeroPanel.vue';
import MainMenuAchievementsSummary from './MainMenuAchievementsSummary.vue';
import MainMenuChapters from './MainMenuChapters.vue';
import MainMenuLeaderboard from './MainMenuLeaderboard.vue';

const modalStore = useModalStore();
const visible = computed(() => modalStore.state.mainMenu.visible);
const callbacks = computed(() => modalStore.state.mainMenu.callbacks || {});

const heroStats = ref(null);
const heroPoints = ref(0);
const playerName = ref('');
const achievementsSummary = ref(null);
const achievements = ref([]);
const bestRunsMap = ref(new Map());
const chapters = ref([]);
const leaderboard = ref([]);

const loading = ref(false);
const achievementsLoading = ref(false);
const chaptersLoading = ref(false);
const leaderboardLoading = ref(false);

const loadProfile = async () => {
  await ensureProfileLoaded();
  const profile = getProfile();
  heroStats.value = getHeroStats();
  heroPoints.value = getHeroPointsAvailable();
  playerName.value = profile?.player?.username || 'Invité';
};

const loadAchievements = async () => {
  achievementsLoading.value = true;
  try {
    const data = await fetchAchievements();
    achievements.value = data?.achievements || data || [];
    achievementsSummary.value = data?.summary || {
      unlocked: achievements.value.filter((a) => a.is_unlocked).length,
      total: achievements.value.length,
    };
  } finally {
    achievementsLoading.value = false;
  }
};

const buildChaptersPayload = (chapterData, runsMap, unlockedLevel) => {
  const chapterVMs = buildChapterViewModels(chapterData, runsMap);
  return chapterVMs.map((chapter) => {
    const locks = buildLevelLocks(chapter.levels, chapter.isLocked, runsMap, unlockedLevel);
    return {
      ...chapter,
      levelLocks: Array.from(locks.entries()).map(([levelId, payload]) => ({
        levelId,
        ...payload,
      })),
    };
  });
};

const loadChapters = async () => {
  chaptersLoading.value = true;
  try {
    const progress = await fetchChapterProgress().catch(() => null);
    const runsMap = progress?.bestRunsMap || (await fetchBestRunsMap().catch(() => new Map()));
    const chapterData =
      progress?.chapters?.length > 0
        ? progress.chapters
        : await fetchChaptersWithLevels().catch(() => []);
    const unlockedLevel = getUnlockedLevel();
    bestRunsMap.value = runsMap || new Map();
    chapters.value = buildChaptersPayload(chapterData, bestRunsMap.value, unlockedLevel);
  } finally {
    chaptersLoading.value = false;
  }
};

const loadLeaderboard = async () => {
  leaderboardLoading.value = true;
  try {
    leaderboard.value = await fetchGlobalLeaderboard();
  } catch (error) {
    console.error('Erreur leaderboard', error);
    leaderboard.value = [];
  } finally {
    leaderboardLoading.value = false;
  }
};

const refreshData = async () => {
  if (!isAuthenticated()) {
    showAuth();
    return;
  }
  loading.value = true;
  try {
    resetCachedChapters();
    await Promise.all([loadProfile(), loadAchievements(), loadChapters(), loadLeaderboard()]);
  } finally {
    loading.value = false;
  }
};

const startLevel = (payload) => {
  if (!isAuthenticated()) {
    showAuth();
    return;
  }
  if (callbacks.value.onStartLevel) {
    callbacks.value.onStartLevel(payload);
  }
};

const openHeroUpgrade = () => {
  if (callbacks.value.onShowHeroUpgrade) {
    callbacks.value.onShowHeroUpgrade();
    return;
  }
  modalStore.showHeroUpgrade({});
};

const openHeroSelection = async () => {
  if (callbacks.value.onShowHeroSelection) {
    callbacks.value.onShowHeroSelection();
    return;
  }
  try {
    const heroesData = await fetchHeroes();
    const heroes = heroesData?.heroes || heroesData || [];
    const selectedHeroId =
      heroesData?.selectedHeroId || heroStats.value?.hero_id || heroes.find((h) => h.is_selected)?.id;

    modalStore.showHeroSelection({
      heroes,
      selectedHeroId,
      heroPointsAvailable: heroPoints.value,
      onSelect: async (heroId) => {
        await setSelectedHeroId(heroId);
        await ensureProfileLoaded();
        heroStats.value = getHeroStats();
        heroPoints.value = getHeroPointsAvailable();
      },
      onUnlock: async (heroId) => {
        await unlockHero(heroId);
        await ensureProfileLoaded();
        heroPoints.value = getHeroPointsAvailable();
      },
    });
  } catch (error) {
    console.error('Erreur chargement héros', error);
    showAuth();
  }
};

const openAchievements = () => {
  modalStore.showAchievements({
    achievements: achievements.value,
    summary: achievementsSummary.value,
    onClose: () => {},
  });
};

const handleLogout = () => {
  if (callbacks.value.onLogout) {
    callbacks.value.onLogout();
  } else {
    showAuth();
  }
};

const hydrate = async () => {
  if (!visible.value) return;
  await refreshData();
};

onMounted(() => {
  if (visible.value) {
    hydrate();
  }
  window.addEventListener('hero:upgrade-complete', hydrate);
  window.addEventListener('profile:updated', hydrate);
});

onBeforeUnmount(() => {
  window.removeEventListener('hero:upgrade-complete', hydrate);
  window.removeEventListener('profile:updated', hydrate);
});

watch(visible, (isVisible) => {
  if (isVisible) {
    hydrate();
  }
});
</script>

<style scoped>
.main-menu-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: stretch;
  justify-content: center;
  pointer-events: none;
  z-index: 12000;
  color: #e5ecf5;
  font-family: "Inter", "Orbitron", "Segoe UI", sans-serif;
}

.main-menu__backdrop {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 30%, rgba(0, 242, 255, 0.08), transparent 35%),
    radial-gradient(circle at 80% 10%, rgba(86, 158, 255, 0.08), transparent 30%),
    rgba(3, 6, 12, 0.78);
  backdrop-filter: blur(12px);
  pointer-events: auto;
}

.main-menu__content {
  position: relative;
  width: min(1400px, 96vw);
  margin: auto;
  padding: 28px;
  pointer-events: auto;
}

.main-menu__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.main-menu__eyebrow {
  letter-spacing: 0.08em;
  color: #6ddcff;
  text-transform: uppercase;
  font-size: 12px;
  margin: 0 0 4px;
}

.main-menu__title {
  margin: 0;
  font-size: clamp(32px, 4vw, 46px);
  letter-spacing: 0.06em;
  color: #f3f8ff;
  text-shadow: 0 0 24px rgba(0, 242, 255, 0.35);
}

.main-menu__subtitle {
  margin: 6px 0 0;
  color: #9db4c7;
  font-size: 14px;
}

.main-menu__header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.main-menu__grid {
  display: grid;
  grid-template-columns: 320px 1fr 320px;
  gap: 16px;
}

.main-menu__panel {
  background: linear-gradient(160deg, rgba(10, 18, 32, 0.9), rgba(5, 8, 16, 0.9));
  border: 1px solid rgba(0, 242, 255, 0.12);
  border-radius: 18px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 0 0 1px rgba(255, 255, 255, 0.02);
  padding: 18px;
  position: relative;
}

.main-menu__panel::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 18px;
  padding: 1px;
  background: linear-gradient(120deg, rgba(0, 242, 255, 0.18), transparent 45%, rgba(109, 220, 255, 0.08));
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.panel-margin {
  margin-top: 12px;
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

.ghost-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 1260px) {
  .main-menu__grid {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "hero leaderboard"
      "chapters chapters";
  }

  .hero-panel {
    grid-area: hero;
  }

  .leaderboard-panel {
    grid-area: leaderboard;
  }

  .chapters-panel {
    grid-area: chapters;
  }
}

@media (max-width: 980px) {
  .main-menu__grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "hero"
      "leaderboard"
      "chapters";
  }

  .main-menu__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .main-menu__header-actions {
    width: 100%;
  }
}
</style>
