<template>
  <div class="hud-leaderboard" :class="{ 'modal-open': isProfileModalOpen }">
    <header class="lb-header">
      <button class="nav-arrow" @click="switchMode(-1)" title="Mode précédent">◀</button>
      <div class="lb-title-box">
        <p class="lb-eyebrow">Data Stream // {{ currentMode.toUpperCase() }}</p>
        <h3 class="lb-title">{{ getTitleText() }}</h3>
      </div>
      <button class="nav-arrow" @click="switchMode(1)" title="Mode suivant">▶</button>
      <button class="refresh-btn" :class="{ 'is-loading': loading }" @click="handleRefresh" title="Actualiser le classement">↻</button>
    </header>

    <div v-if="showSubNav" class="lb-sub-nav">
      <button class="sub-arrow" @click="changeSubIndex(-1)" title="Élément précédent">⟸</button>
      <span class="sub-label">{{ getSubLabel() }}</span>
      <button class="sub-arrow" @click="changeSubIndex(1)" title="Élément suivant">⟹</button>
    </div>

    <div class="lb-content">
      <div class="lb-table-wrapper">
        <div class="lb-table-header" :style="{ gridTemplateColumns: getGridTemplate() }">
          <span v-for="col in activeColumns" :key="col.key" 
                :class="['col-' + col.key, col.align]">
            {{ col.label }}
          </span>
        </div>

        <div v-if="loading" class="lb-status">SYNCHRONISATION EN COURS...</div>
        <div v-else-if="displayEntries.length === 0" class="lb-status">AUCUNE DONNÉE TROUVÉE</div>

        <ul v-else class="lb-list">
          <li v-for="(entry, idx) in displayEntries" :key="idx" 
              class="lb-row" :class="{ 'row-top': idx === 0 }"
              :style="{ gridTemplateColumns: getGridTemplate() }">
            <span v-for="col in activeColumns" :key="col.key" 
                  :class="['col-' + col.key, col.align, getCellColorClass(col.key, idx)]"
                  :style="col.key === 'player' ? { cursor: 'pointer', textDecoration: 'underline' } : {}"
                  @click="col.key === 'player' && handlePlayerClick(entry.username)"
                  :title="col.key === 'player' ? `Cliquer pour voir le profil de ${entry.username || 'Anonyme'}` : ''">
              <template v-if="col.icon">
                <span class="cell-icon">{{ col.icon }}</span>
                <span class="cell-value">{{ formatValue(entry, col.key, idx) }}</span>
              </template>
              <template v-else>
                {{ formatValue(entry, col.key, idx) }}
              </template>
            </span>
            <div class="row-glow"></div>
          </li>
        </ul>
      </div>
    </div>

    <footer class="lb-footer">
      <span class="footer-tag">Jeu créer par GUERRIN FLORIAN  </span>
      <div class="footer-line"></div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { 
  fetchGlobalLeaderboard, 
  fetchAchievementsLeaderboard, 
  fetchLevelLeaderboards, 
  fetchHeroTypeLeaderboards 
} from "../../../services/leaderboardService.js";
import { fetchChaptersWithLevels, buildChapterViewModels } from "../../../services/chapterService.js";
import { useModalStore } from "../../stores/modalStore.js";

const modalStore = useModalStore();

const isProfileModalOpen = computed(() => modalStore.state.playerProfile.visible);

// --- ÉTAT ---
const viewModes = ["global", "achievements", "level", "hero-type"];
const currentModeIndex = ref(0);
const loading = ref(false);
const displayEntries = ref([]);

// Métadonnées pour sous-navigation
const levelMetas = ref([]);
const currentLevelIndex = ref(0);
const heroTypeMetas = ref([]);
const currentHeroTypeIndex = ref(0);

// Maps pour le cache local
const levelLeaderboardMap = ref(new Map());
const heroTypeLeaderboardMap = ref(new Map());

const currentMode = computed(() => viewModes[currentModeIndex.value]);
const showSubNav = computed(() => currentMode.value === 'level' || currentMode.value === 'hero-type');

// --- LOGIQUE DE NAVIGATION ---

const switchMode = (delta) => {
  currentModeIndex.value = (currentModeIndex.value + delta + viewModes.length) % viewModes.length;
  loadData();
};

const changeSubIndex = (delta) => {
  if (currentMode.value === 'level') {
    const total = levelMetas.value.length;
    if (total > 0) {
      currentLevelIndex.value = (currentLevelIndex.value + delta + total) % total;
      updateDisplayFromMap();
    }
  } else if (currentMode.value === 'hero-type') {
    const total = heroTypeMetas.value.length;
    if (total > 0) {
      currentHeroTypeIndex.value = (currentHeroTypeIndex.value + delta + total) % total;
      updateDisplayFromMap();
    }
  }
};

// --- CHARGEMENT DES DONNÉES ---

const loadData = async () => {
  loading.value = true;
  displayEntries.value = [];

  try {
    if (currentMode.value === 'global') {
      displayEntries.value = await fetchGlobalLeaderboard();
    } 
    else if (currentMode.value === 'achievements') {
      displayEntries.value = await fetchAchievementsLeaderboard();
    } 
    else if (currentMode.value === 'level') {
      if (levelMetas.value.length === 0) await ensureLevelMetadata();
      const levels = await fetchLevelLeaderboards();
      levelLeaderboardMap.value = new Map(levels.map(l => [l.levelId, l.entries || []]));
      updateDisplayFromMap();
    } 
    else if (currentMode.value === 'hero-type') {
      if (heroTypeMetas.value.length === 0) await ensureHeroTypeMetadata();
      const heroTypes = await fetchHeroTypeLeaderboards();
      heroTypeLeaderboardMap.value = new Map(heroTypes.map(ht => [ht.heroId, ht.entries || []]));
      updateDisplayFromMap();
    }
  } catch (e) {
    console.error("LB Error:", e);
  } finally {
    loading.value = false;
  }
};

const updateDisplayFromMap = () => {
  if (currentMode.value === 'level') {
    const id = levelMetas.value[currentLevelIndex.value]?.id;
    displayEntries.value = id ? levelLeaderboardMap.value.get(id) || [] : [];
  } else {
    const id = heroTypeMetas.value[currentHeroTypeIndex.value]?.id;
    displayEntries.value = id ? heroTypeLeaderboardMap.value.get(id) || [] : [];
  }
};

const ensureLevelMetadata = async () => {
  const chapters = await fetchChaptersWithLevels();
  const vms = buildChapterViewModels(chapters, new Map());
  levelMetas.value = vms.flatMap(c => (c.levels || []).map(l => ({ id: l.id, name: l.name })))
                        .sort((a, b) => parseInt(a.id) - parseInt(b.id));
};

const ensureHeroTypeMetadata = async () => {
  const heroTypes = await fetchHeroTypeLeaderboards();
  heroTypeMetas.value = heroTypes.filter(ht => ht.heroId != null)
                                 .map(ht => ({ id: ht.heroId, name: ht.heroName }));
};

const handleRefresh = () => loadData();

// --- CONFIGURATION DU TABLEAU ---

const activeColumns = computed(() => {
  const m = currentMode.value;
  if (m === 'achievements') return [
    { key: 'rank', label: 'RG', width: '40px' },
    { key: 'player', label: 'JOUEUR', width: '1.5fr' },
    { key: 'successes', label: 'SUCCÈS', width: '70px', align: 'right' },
    { key: 'date', label: 'DERN. ACTIVITÉ', width: '100px', align: 'right' }
  ];
  if (m === 'level') return [
    { key: 'rank', label: 'RG', width: '40px' },
    { key: 'player', label: 'JOUEUR', width: '1.5fr' },
    { key: 'hearts', label: 'COEURS PERDUS', width: '50px', align: 'center', icon: '❤️' },
    { key: 'time', label: 'TEMPS', width: '70px', align: 'right', icon: '⏱️' }
  ];
  if (m === 'hero-type') return [
    { key: 'rank', label: 'RG', width: '40px' },
    { key: 'player', label: 'JOUEUR', width: '1.5fr' },
    { key: 'hp', label: 'PV', width: '50px', align: 'center', icon: '❤️' },
    { key: 'damage', label: 'ATQ', width: '60px', align: 'center', icon: '⚔️' },
    { key: 'speed', label: 'VIT', width: '55px', align: 'center', icon: '💨' },
    { key: 'attack', label: 'VIT. ATQ', width: '70px', align: 'center', icon: '⏱️' }
  ];
  return [ // Global
    { key: 'rank', label: 'RG', width: '40px' },
    { key: 'player', label: 'JOUEUR', width: '1.5fr' },
    { key: 'lvl', label: 'NIV', width: '50px', align: 'center', icon: '🎯' },
    { key: 'hearts', label: 'COEURS PERDUS', width: '60px', align: 'center', icon: '❤️' },
    { key: 'time', label: 'TEMPS', width: '80px', align: 'right', icon: '⏱️' }
  ];
});

// --- FORMATAGE ---

const getTitleText = () => {
  const titles = { 
    global: "CLASSEMENT GÉNÉRAL", 
    achievements: "CLASSEMENT DES SUCCÈS", 
    level: "RECORDS PAR MISSION", 
    "hero-type": "CLASSEMENT HÉROS" 
  };
  return titles[currentMode.value];
};

const getSubLabel = () => {
  if (currentMode.value === 'level') {
    const l = levelMetas.value[currentLevelIndex.value];
    return l ? `NIV. ${l.id} • ${l.name.toUpperCase()}` : "CHARGEMENT...";
  }
  const h = heroTypeMetas.value[currentHeroTypeIndex.value];
  return h ? h.name.toUpperCase() : "CHARGEMENT...";
};

const formatValue = (entry, key, idx) => {
  switch (key) {
    case 'rank': return (idx + 1).toString().padStart(2, '0');
    case 'player': return (entry.username || "Anonyme").substring(0, 20);
    case 'score': return Math.round(entry.hero_score || 0).toLocaleString();
    case 'time': return formatTime(entry.completion_time_ms || entry.total_time_ms);
    case 'date': return formatDate(entry.created_at || entry.last_unlocked_at);
    case 'successes': return entry.unlocked_count ?? 0;
    case 'hearts': return entry.lives_lost ?? entry.total_lives_lost ?? 0;
    case 'hp': return entry.max_hp || 0;
    case 'damage': return parseFloat(entry.base_damage || 0).toFixed(1);
    case 'speed': return Math.round(entry.move_speed || 0);
    case 'attack': return formatAttackInterval(entry.attack_interval_ms);
    case 'lvl': return entry.max_level || 0;
    default: return "";
  }
};

const formatTime = (ms) => {
  if (!ms) return "0:00";
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
};

const formatDate = (d) => {
  if (!d) return "--/--";
  const date = new Date(d);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
};

const formatAttackInterval = (ms) => {
  if (!ms) return "0.00s";
  return `${(ms / 1000).toFixed(2)}s`;
};

const getCellColorClass = (key, idx) => {
  if (idx === 0) return 'text-gold';
  if (key === 'time' || key === 'score' || key === 'hearts' || key === 'hp' || key === 'damage' || key === 'speed' || key === 'attack') return 'text-accent';
  return '';
};

const getGridTemplate = () => {
  return activeColumns.value.map(col => col.width).join(' ');
};

const getRowTooltip = (entry, idx) => {
  const username = entry.username || "Anonyme";
  const rank = idx + 1;
  
  if (currentMode.value === 'global') {
    return `Rang ${rank}: ${username}\nNiveaux complétés: ${entry.max_level || 0}\nCoeurs perdus: ${entry.total_lives_lost || 0}\nTemps total: ${formatTime(entry.total_time_ms || 0)}`;
  } else if (currentMode.value === 'achievements') {
    return `Rang ${rank}: ${username}\nSuccès débloqués: ${entry.unlocked_count || 0}\nDernière activité: ${formatDate(entry.last_unlocked_at)}`;
  } else if (currentMode.value === 'level') {
    return `Rang ${rank}: ${username}\nCoeurs perdus: ${entry.lives_lost || entry.total_lives_lost || 0}\nTemps: ${formatTime(entry.completion_time_ms || 0)}`;
  } else if (currentMode.value === 'hero-type') {
    return `Rang ${rank}: ${username}\nPoints de vie max: ${entry.max_hp || 0}\nDégâts: ${parseFloat(entry.base_damage || 0).toFixed(1)}\nVitesse: ${Math.round(entry.move_speed || 0)}\nVitesse d'attaque: ${formatAttackInterval(entry.attack_interval_ms)}`;
  }
  return `Rang ${rank}: ${username}`;
};

const handlePlayerClick = (username) => {
  if (username && !isProfileModalOpen.value) {
    modalStore.showPlayerProfile(username);
  }
};

onMounted(() => loadData());
</script>

<style scoped>
.hud-leaderboard {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  max-height: 100%;
  font-family: 'Orbitron', sans-serif;
  color: #fff;
  position: relative;
  z-index: 1;
}

.hud-leaderboard.modal-open {
  pointer-events: none;
  opacity: 0.5;
}

/* NAVIGATION MODES */
.lb-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 12px 0;
  border-bottom: 1px solid rgba(0, 234, 255, 0.3);
  flex-shrink: 0;
  gap: 8px;
}

.lb-title-box { 
  text-align: center; 
  flex: 1; 
  min-width: 0;
}
.lb-eyebrow { 
  font-size: 9px; 
  color: #00eaff; 
  letter-spacing: 1.5px; 
  margin: 0; 
  opacity: 0.7; 
}
.lb-title { 
  font-size: 16px; 
  margin: 2px 0 0; 
  letter-spacing: 0.5px; 
  text-shadow: 0 0 10px rgba(0, 234, 255, 0.5); 
}

.nav-arrow { 
  background: none; 
  border: none; 
  color: #7dd0ff; 
  font-size: 18px; 
  cursor: pointer; 
  padding: 6px 8px; 
  transition: all 0.2s ease; 
  flex-shrink: 0;
  border-radius: 4px;
}
.nav-arrow:hover { 
  color: #fff; 
  transform: scale(1.2);
  background: rgba(0, 234, 255, 0.1);
}

.refresh-btn { 
  background: none; 
  border: none; 
  color: #00eaff; 
  font-size: 20px; 
  cursor: pointer; 
  transition: all 0.2s ease;
  flex-shrink: 0;
  padding: 6px;
  border-radius: 4px;
}
.refresh-btn:hover {
  background: rgba(0, 234, 255, 0.1);
  transform: rotate(90deg);
}
.refresh-btn.is-loading { animation: spin 1s infinite linear; }

/* SOUS-NAVIGATION */
.lb-sub-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  background: rgba(255, 255, 255, 0.05);
  padding: 6px 12px;
  border-radius: 4px;
  flex-shrink: 0;
  gap: 8px;
}
.sub-label { 
  font-size: 10px; 
  font-weight: bold; 
  color: #9ae8ff; 
  flex: 1;
  text-align: center;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sub-arrow { 
  background: none; 
  border: none; 
  color: #00eaff; 
  cursor: pointer; 
  font-size: 12px; 
  flex-shrink: 0;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}
.sub-arrow:hover {
  background: rgba(0, 234, 255, 0.1);
  transform: scale(1.2);
  color: #fff;
}

/* TABLEAU */
.lb-content { 
  flex: 1; 
  margin-top: 12px; 
  display: flex; 
  flex-direction: column; 
  overflow: hidden; 
  min-height: 0;
}

.lb-table-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  min-height: 0;
}

.lb-table-header {
  display: grid;
  padding: 6px 8px;
  border-bottom: 1px solid rgba(125, 208, 255, 0.2);
  margin-bottom: 4px;
  gap: 6px;
  align-items: center;
  flex-shrink: 0;
}
.lb-table-header span { 
  font-size: 9px; 
  color: #7dd0ff; 
  font-weight: bold; 
  text-transform: uppercase;
  letter-spacing: 0.5px;
  word-break: break-word;
  line-height: 1.2;
  text-align: center;
  hyphens: auto;
}

.lb-table-header span.right {
  justify-content: flex-end;
}

.lb-table-header span.center {
  justify-content: center;
}

.header-icon {
  font-size: 12px;
  filter: drop-shadow(0 0 2px rgba(0, 234, 255, 0.6));
  line-height: 1;
}

.lb-list { 
  list-style: none; 
  padding: 0; 
  margin: 0; 
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.lb-row { 
  position: relative; 
  display: grid;
  padding: 8px;
  gap: 6px;
  align-items: center;
  background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, transparent 100%);
  font-size: 12px;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.col-player {
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.col-player:hover {
  color: #00eaff !important;
  text-shadow: 0 0 8px rgba(0, 234, 255, 0.6);
  transform: translateX(2px);
}

.lb-row:nth-child(even) { 
  background: transparent; 
}

.lb-row:hover {
  background: rgba(0, 234, 255, 0.1);
  cursor: pointer;
  transform: translateX(2px);
  transition: all 0.2s ease;
}

.lb-row span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: inherit;
  gap: 4px;
}

.cell-icon {
  font-size: 12px;
  filter: drop-shadow(0 0 2px rgba(0, 234, 255, 0.6));
  line-height: 1;
  flex-shrink: 0;
}

.cell-value {
  line-height: 1;
}

/* COLONNES */
.right { 
  text-align: right; 
  justify-content: flex-end !important;
}
.center { 
  text-align: center; 
  justify-content: center !important;
}

.text-gold { color: #ffd700; font-weight: bold; }
.text-accent { color: #00eaff; font-weight: bold; }

/* ANIMATIONS ET ÉTATS */
.lb-status { 
  padding: 30px 20px; 
  text-align: center; 
  font-size: 11px; 
  color: #7dd0ff; 
  letter-spacing: 1.5px; 
  flex-shrink: 0;
}

.row-glow {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #00eaff;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.lb-row:hover .row-glow {
  opacity: 1;
}

.lb-footer { 
  margin-top: auto; 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  opacity: 0.3; 
  padding-top: 8px; 
  flex-shrink: 0;
}
.footer-line { 
  flex: 1; 
  height: 1px; 
  background: linear-gradient(90deg, #00eaff, transparent); 
}
.footer-tag { 
  font-size: 7px; 
  white-space: nowrap;
}

@keyframes spin { 
  from { transform: rotate(0deg); } 
  to { transform: rotate(360deg); } 
}

/* RESPONSIVE */
@media (max-width: 1400px) {
  .lb-title { font-size: 14px; }
  .lb-eyebrow { font-size: 8px; }
  .lb-row { font-size: 11px; padding: 6px; }
  .col-player { font-size: 12px; }
}

@media (max-height: 800px) {
  .lb-header { padding-bottom: 8px; }
  .lb-sub-nav { margin-top: 8px; padding: 4px 10px; }
  .lb-content { margin-top: 8px; }
  .lb-table-header { padding: 4px 6px; }
  .lb-row { padding: 5px; }
  .lb-footer { padding-top: 6px; }
}
</style>
