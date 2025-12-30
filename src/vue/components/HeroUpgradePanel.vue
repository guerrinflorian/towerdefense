<template>
  <div class="hero-upgrade-panel">
    <div class="hero-upgrade-card">
      <!-- Header -->
      <div class="hero-upgrade-header">
        <h2 class="hero-upgrade-title">SYSTÈME HÉROS</h2>
        <button 
          class="hero-upgrade-close"
          @click="handleClose"
          aria-label="Fermer"
        >
          ×
        </button>
      </div>

      <!-- Hero Info -->
      <div class="hero-upgrade-info">
        <div class="hero-avatar-section">
          <HeroAvatarCanvas
            :hero-id="Number(heroStats?.hero_id || 1)"
            :hero-color="heroStats?.color || '#2b2b2b'"
            :size="80"
          />
          <button 
            class="color-picker-btn"
            @click="openColorPicker"
            title="Changer la couleur"
          >
            🎨
          </button>
        </div>
        <div class="hero-name-section">
          <h3 class="hero-name">{{ heroName }}</h3>
          <div class="hero-meta">
            <span v-if="heroStats?.kills != null" class="hero-meta-item">
              💀 {{ heroStats.kills }} kills
            </span>
            <span v-if="heroStats?.enemies_retained != null" class="hero-meta-item">
              👥 {{ heroStats.enemies_retained }} ennemis simultanés
            </span>
          </div>
        </div>
      </div>

      <!-- Points disponibles -->
      <div class="hero-points-section">
        <div class="points-label">POINTS DISPONIBLES</div>
        <div class="points-value">{{ heroPointsAvailable }}</div>
      </div>

      <!-- Stats -->
      <div class="hero-stats-section">
        <div
          v-for="stat in stats"
          :key="stat.key"
          class="stat-row"
          :class="{ 'is-max': stat.isMax, 'has-pending': stat.pendingPoints > 0 }"
        >
          <div class="stat-header">
            <span class="stat-label">{{ stat.label }}</span>
            <span class="stat-value" :class="{ 'pending': stat.pendingPoints > 0 }">
              {{ stat.displayValue }}
              <span v-if="stat.pendingPoints > 0" class="pending-indicator">
                ({{ stat.pendingPoints > 0 ? '+' : '' }}{{ stat.pendingPoints }})
              </span>
            </span>
          </div>
          
          <div class="stat-bar-container">
            <div class="stat-bar-bg">
              <div 
                class="stat-bar-fill"
                :style="{ width: stat.fillPercent + '%' }"
              ></div>
              <div 
                v-if="stat.pendingPoints > 0"
                class="stat-bar-pending"
                :style="{ 
                  width: stat.pendingPercent + '%',
                  left: stat.fillPercent + '%'
                }"
              ></div>
            </div>
            <button
              class="stat-upgrade-btn"
              :disabled="stat.isMax || heroPointsAvailable === 0"
              @mousedown="startUpgrade(stat.key)"
              @mouseup="stopUpgrade"
              @mouseleave="stopUpgrade"
              @touchstart="startUpgrade(stat.key)"
              @touchend="stopUpgrade"
              @touchcancel="stopUpgrade"
            >
              +
            </button>
          </div>

          <div class="stat-footer">
            <span class="stat-limit">{{ stat.limitText }}</span>
            <span class="stat-conversion" v-if="stat.conversionValue">
              {{ stat.conversionText }}
            </span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="hero-actions-section">
        <div v-if="totalPending > 0" class="pending-actions">
          <div class="pending-info">
            {{ totalPending }} point(s) en attente
          </div>
          <div class="action-buttons">
            <button class="action-btn cancel" @click="cancelUpgrades">
              ✗ ANNULER
            </button>
            <button class="action-btn validate" @click="validateUpgrades">
              ✓ VALIDER
            </button>
          </div>
        </div>
        <div v-else class="action-hint">
          Maintenez '+' pour allouer plusieurs points
        </div>
        <button class="change-hero-btn" @click="openHeroSelection">
          🔄 CHANGER DE HÉROS
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { 
  getHeroStats, 
  getHeroPointsAvailable, 
  getHeroPointConversion,
  getHeroLimits,
  queueHeroUpgrade,
  updateHeroColor,
  isAuthenticated,
  getSelectedHeroId
} from '../../services/authManager.js';
import { showAuth } from '../../services/authOverlay.js';
import { fetchHeroes } from '../../services/heroService.js';
import { showHeroSelection, hideHeroSelection, hideHeroUpgrade } from '../bridge.js';
import HeroAvatarCanvas from './HeroAvatarCanvas.vue';
import { getCurrentStatValue, STAT_CONVERSION_MAP } from '../../scenes/components/heroUpgrade/utils.js';

const props = defineProps({
  onClose: {
    type: Function,
    default: () => {}
  }
});

const heroStats = ref(null);
const heroPointsAvailable = ref(0);
const heroName = ref('HÉROS');
const heroLimits = ref(null);
const conversion = ref(null);
const pendingUpgrades = ref({
  hp: 0,
  damage: 0,
  move_speed: 0,
  attack_interval_ms: 0
});

const holdTimer = ref(null);
const isHolding = ref(false);

// Fonction pour tronquer les décimales
function truncateDecimals(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.floor(value * factor) / factor;
}

// Fonction pour formater les secondes (avec plus de précision pour les millisecondes)
function formatSeconds(ms) {
  // Afficher en millisecondes avec 2 décimales pour mieux voir les changements
  return ms.toFixed(2) + ' ms';
}

// Charger les données
async function loadData() {
  if (!isAuthenticated()) return;
  
  heroStats.value = getHeroStats();
  heroPointsAvailable.value = getHeroPointsAvailable() || 0;
  heroLimits.value = getHeroLimits();
  conversion.value = getHeroPointConversion();
  
  // Charger le nom du héros
  try {
    const heroId = getSelectedHeroId();
    const response = await fetchHeroes();
    const heroes = response?.heroes || [];
    const hero = Array.isArray(heroes) ? heroes.find(h => Number(h.id) === Number(heroId)) : null;
    heroName.value = hero ? hero.name.toUpperCase() : 'HÉROS';
  } catch (error) {
    console.error('Erreur récupération nom héros:', error);
  }
}

// Stats calculées
const stats = computed(() => {
  if (!heroStats.value || !heroLimits.value) return [];
  
  const maxValues = {
    hp: heroLimits.value.max_hp ?? 2500,
    damage: heroLimits.value.max_damage ?? 450,
    move_speed: heroLimits.value.max_move_speed ?? 200,
    attack_interval_ms: 1500
  };
  
  const minValues = {
    attack_interval_ms: heroLimits.value.min_attack_interval_ms ?? 500
  };
  
  const statConfigs = [
    { key: 'hp', label: 'Points de vie', max: maxValues.hp },
    { key: 'damage', label: 'Dégâts', max: maxValues.damage },
    { key: 'move_speed', label: 'Vitesse de déplacement', max: maxValues.move_speed },
    { key: 'attack_interval_ms', label: 'Vitesse d\'attaque', max: maxValues.attack_interval_ms, min: minValues.attack_interval_ms }
  ];
  
  return statConfigs.map(stat => {
    const baseValue = getCurrentStatValue(heroStats.value, stat.key);
    const pendingPoints = pendingUpgrades.value[stat.key] || 0;
    const convKey = STAT_CONVERSION_MAP[stat.key];
    const convValue = parseFloat(conversion.value?.[convKey] || 0);
    
    // Calculer la valeur projetée
    let pendingValue;
    if (stat.key === 'attack_interval_ms') {
      pendingValue = Math.max(stat.min || 0, baseValue - pendingPoints * convValue);
    } else {
      pendingValue = baseValue + pendingPoints * convValue;
    }
    
    // Calculer les pourcentages pour les barres
    const range = stat.key === 'attack_interval_ms' 
      ? (stat.max - (stat.min || 0))
      : stat.max;
    
    const fillPercent = stat.key === 'attack_interval_ms'
      ? Math.max(0, Math.min(100, (1 - (baseValue - (stat.min || 0)) / range) * 100))
      : Math.max(0, Math.min(100, (baseValue / stat.max) * 100));
    
    const pendingPercent = stat.key === 'attack_interval_ms'
      ? Math.max(0, Math.min(100, (1 - (pendingValue - (stat.min || 0)) / range) * 100)) - fillPercent
      : Math.max(0, Math.min(100, (pendingValue / stat.max) * 100)) - fillPercent;
    
    // Vérifier si max
    const isMax = stat.key === 'attack_interval_ms'
      ? baseValue <= (stat.min || 0)
      : baseValue >= stat.max;
    
    // Formatage de l'affichage
    let displayValue;
    if (stat.key === 'damage') {
      displayValue = pendingPoints > 0 
        ? pendingValue.toFixed(2)
        : baseValue.toFixed(2);
    } else if (stat.key === 'attack_interval_ms') {
      displayValue = formatSeconds(pendingPoints > 0 ? pendingValue : baseValue);
    } else {
      displayValue = Math.round(pendingPoints > 0 ? pendingValue : baseValue);
    }
    
    // Texte de limite
    const limitText = stat.key === 'attack_interval_ms'
      ? `Min: ${formatSeconds(stat.min || 0)}`
      : `Max: ${stat.key === 'damage' ? stat.max.toFixed(2) : Math.round(stat.max)}`;
    
    // Texte de conversion
    const conversionText = convValue 
      ? `${stat.key === 'attack_interval_ms' ? '-' : '+'}${convValue.toFixed(2)} / pt`
      : '';
    
    return {
      ...stat,
      baseValue,
      pendingValue,
      pendingPoints,
      fillPercent,
      pendingPercent,
      isMax,
      displayValue,
      limitText,
      conversionValue: convValue,
      conversionText
    };
  });
});

const totalPending = computed(() => {
  return Object.values(pendingUpgrades.value).reduce((a, b) => a + b, 0);
});

// Gestion des upgrades
function startUpgrade(statKey) {
  if (isHolding.value) return;
  isHolding.value = true;
  
  const doUpgrade = () => {
    if (!isHolding.value) return;
    
    const stat = stats.value.find(s => s.key === statKey);
    if (!stat || stat.isMax || heroPointsAvailable.value === 0) {
      stopUpgrade();
      return;
    }
    
    pendingUpgrades.value[statKey] = (pendingUpgrades.value[statKey] || 0) + 1;
    heroPointsAvailable.value = Math.max(0, heroPointsAvailable.value - 1);
    
    holdTimer.value = setTimeout(doUpgrade, 100);
  };
  
  doUpgrade();
}

function stopUpgrade() {
  isHolding.value = false;
  if (holdTimer.value) {
    clearTimeout(holdTimer.value);
    holdTimer.value = null;
  }
}

async function validateUpgrades() {
  if (!isAuthenticated()) {
    showAuth();
    return;
  }
  
  try {
    for (const [key, points] of Object.entries(pendingUpgrades.value)) {
      if (points > 0) {
        queueHeroUpgrade(key, points);
      }
    }
    
    pendingUpgrades.value = { hp: 0, damage: 0, move_speed: 0, attack_interval_ms: 0 };
    await new Promise(r => setTimeout(r, 150));
    await loadData();
    window.dispatchEvent(new CustomEvent('hero:upgrade-complete'));
  } catch (error) {
    console.error('Erreur validation upgrades:', error);
  }
}

function cancelUpgrades() {
  // Restaurer les points
  const total = Object.values(pendingUpgrades.value).reduce((a, b) => a + b, 0);
  heroPointsAvailable.value += total;
  pendingUpgrades.value = { hp: 0, damage: 0, move_speed: 0, attack_interval_ms: 0 };
}

async function openHeroSelection() {
  if (!isAuthenticated()) {
    showAuth();
    return;
  }
  
  // Fermer d'abord le panneau HeroUpgrade
  hideHeroUpgrade();
  
  // Attendre un peu pour que la fermeture soit visible
  await new Promise(resolve => setTimeout(resolve, 150));
  
  try {
    const response = await fetchHeroes();
    const heroes = response?.heroes || [];
    const selectedHeroId = getSelectedHeroId();
    const heroPointsAvailable = getHeroPointsAvailable() || 0;
    
    showHeroSelection({
      heroes,
      selectedHeroId,
      heroPointsAvailable,
      onSelect: async (heroId) => {
        const { setSelectedHeroId } = await import('../../services/authManager.js');
        await setSelectedHeroId(heroId);
        await loadData();
        window.dispatchEvent(new CustomEvent('hero:selected', { detail: { heroId } }));
      },
      onUnlock: async (heroId) => {
        const { unlockHero } = await import('../../services/heroService.js');
        const { fetchHeroes } = await import('../../services/heroService.js');
        const { getHeroPointsAvailable, loadProfile } = await import('../../services/authManager.js');
        const { updateHeroList } = await import('../bridge.js');
        
        try {
          const response = await unlockHero(heroId);
          
          // Rafraîchir le profil pour mettre à jour les points disponibles
          await loadProfile();
          
          // Rafraîchir la liste des héros dans la modale de sélection
          const heroesResponse = await fetchHeroes();
          const heroes = heroesResponse?.heroes || [];
          const heroPointsAvailable = getHeroPointsAvailable() || 0;
          
          // Mettre à jour la modale de sélection avec les nouvelles données
          updateHeroList(heroes, heroPointsAvailable);
          
          // Rafraîchir les données du panneau d'amélioration
          await loadData();
          
          // Émettre l'événement pour notifier les autres composants
          window.dispatchEvent(new CustomEvent('hero:unlocked', { detail: { heroId, response } }));
        } catch (error) {
          console.error('Erreur déblocage héros:', error);
          // Afficher un message d'erreur à l'utilisateur si nécessaire
          if (error.response?.status === 400) {
            const errorMessage = error.response?.data?.error || 'Impossible de débloquer ce héros';
            alert(errorMessage);
          }
        }
      },
      onClose: () => {
        // Ne rien faire, la modale se ferme déjà automatiquement
      }
    });
  } catch (error) {
    console.error('Erreur chargement héros:', error);
  }
}

function openColorPicker() {
  if (!isAuthenticated()) {
    showAuth();
    return;
  }
  
  const input = document.createElement('input');
  input.type = 'color';
  input.value = heroStats.value?.color || '#2b2b2b';
  input.style.opacity = '0';
  input.style.position = 'absolute';
  document.body.appendChild(input);
  
  input.onchange = async (e) => {
    await updateHeroColor(e.target.value);
    await loadData();
    document.body.removeChild(input);
  };
  
  input.onblur = () => {
    setTimeout(() => {
      if (document.body.contains(input)) document.body.removeChild(input);
    }, 100);
  };
  
  input.click();
}

function handleClose() {
  cancelUpgrades();
  props.onClose();
}

// Écouter les événements
let upgradeHandler = null;
let profileHandler = null;
let selectedHandler = null;

onMounted(async () => {
  await loadData();
  
  upgradeHandler = () => loadData();
  profileHandler = () => loadData();
  selectedHandler = () => loadData();
  
  window.addEventListener('hero:upgrade-complete', upgradeHandler);
  window.addEventListener('profile:updated', profileHandler);
  window.addEventListener('hero:selected', selectedHandler);
});

onUnmounted(() => {
  if (upgradeHandler) window.removeEventListener('hero:upgrade-complete', upgradeHandler);
  if (profileHandler) window.removeEventListener('profile:updated', profileHandler);
  if (selectedHandler) window.removeEventListener('hero:selected', selectedHandler);
});

watch(() => heroStats.value?.hero_id, async () => {
  await loadData();
});
</script>

<style scoped>
.hero-upgrade-panel {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 16000;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
  pointer-events: auto;
}

.hero-upgrade-card {
  width: 100%;
  max-width: 500px;
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
  pointer-events: auto;
}

.hero-upgrade-card::before {
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

.hero-upgrade-header {
  padding: 24px 30px;
  border-bottom: 1px solid rgba(0, 234, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(5, 10, 16, 0.5);
}

.hero-upgrade-title {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: "Impact", "Arial Black", sans-serif;
}

.hero-upgrade-close {
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

.hero-upgrade-close:hover {
  background: rgba(0, 234, 255, 1);
  transform: scale(1.1);
}

.hero-upgrade-info {
  padding: 20px 30px;
  display: flex;
  gap: 20px;
  align-items: center;
  border-bottom: 1px solid rgba(0, 234, 255, 0.2);
}

.hero-avatar-section {
  position: relative;
  flex-shrink: 0;
}

.color-picker-btn {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 28px;
  height: 28px;
  background: rgba(0, 234, 255, 0.9);
  border: 2px solid rgba(0, 234, 255, 1);
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.color-picker-btn:hover {
  background: rgba(0, 234, 255, 1);
  transform: scale(1.1);
}

.hero-name-section {
  flex: 1;
}

.hero-name {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  margin: 0 0 8px 0;
  text-transform: uppercase;
}

.hero-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.hero-meta-item {
  font-size: 12px;
  color: #7dd0ff;
}

.hero-points-section {
  padding: 16px 30px;
  background: rgba(0, 234, 255, 0.1);
  border-bottom: 1px solid rgba(0, 234, 255, 0.2);
  text-align: center;
}

.points-label {
  font-size: 12px;
  color: #7dd0ff;
  margin-bottom: 4px;
  text-transform: uppercase;
  font-weight: bold;
}

.points-value {
  font-size: 32px;
  font-weight: bold;
  color: #00eaff;
  font-family: "Orbitron", monospace;
}

.hero-stats-section {
  flex: 1;
  overflow-y: auto;
  padding: 20px 30px;
  min-height: 0;
}

.hero-stats-section::-webkit-scrollbar {
  width: 8px;
}

.hero-stats-section::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.hero-stats-section::-webkit-scrollbar-thumb {
  background: rgba(0, 234, 255, 0.5);
  border-radius: 4px;
}

.stat-row {
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(15, 15, 26, 0.5);
  border: 2px solid rgba(0, 234, 255, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stat-row:hover {
  border-color: rgba(0, 234, 255, 0.4);
}

.stat-row.is-max {
  opacity: 0.6;
}

.stat-row.has-pending {
  border-color: rgba(255, 170, 0, 0.4);
  background: rgba(255, 170, 0, 0.05);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.stat-label {
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
}

.stat-value {
  font-size: 16px;
  font-weight: bold;
  color: #00eaff;
  font-family: "Orbitron", monospace;
}

.stat-value.pending {
  color: #ffaa00;
}

.pending-indicator {
  font-size: 12px;
  color: #ffaa00;
}

.stat-bar-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.stat-bar-bg {
  flex: 1;
  height: 14px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 7px;
  position: relative;
  overflow: hidden;
}

.stat-bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #00eaff, #00c6ff);
  border-radius: 7px;
  transition: width 0.3s ease;
}

.stat-bar-pending {
  position: absolute;
  top: 0;
  height: 100%;
  background: rgba(255, 170, 0, 0.6);
  border-radius: 7px;
  transition: all 0.3s ease;
}

.stat-upgrade-btn {
  width: 32px;
  height: 32px;
  background: rgba(0, 234, 255, 0.2);
  border: 2px solid rgba(0, 234, 255, 0.6);
  border-radius: 8px;
  color: #00eaff;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.stat-upgrade-btn:hover:not(:disabled) {
  background: rgba(0, 234, 255, 0.4);
  border-color: rgba(0, 234, 255, 1);
  transform: scale(1.1);
}

.stat-upgrade-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.stat-upgrade-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.stat-footer {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #7dd0ff;
}

.stat-limit {
  font-weight: bold;
}

.stat-conversion {
  font-style: italic;
}

.hero-actions-section {
  padding: 20px 30px;
  border-top: 1px solid rgba(0, 234, 255, 0.2);
  background: rgba(5, 10, 16, 0.5);
}

.pending-actions {
  margin-bottom: 16px;
}

.pending-info {
  text-align: center;
  font-size: 14px;
  color: #ffaa00;
  margin-bottom: 12px;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.action-btn {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
}

.action-btn.cancel {
  background: rgba(255, 77, 77, 0.3);
  color: #ff4d4d;
  border: 2px solid rgba(255, 77, 77, 0.6);
}

.action-btn.cancel:hover {
  background: rgba(255, 77, 77, 0.5);
  border-color: rgba(255, 77, 77, 1);
}

.action-btn.validate {
  background: rgba(76, 175, 80, 0.3);
  color: #4caf50;
  border: 2px solid rgba(76, 175, 80, 0.6);
}

.action-btn.validate:hover {
  background: rgba(76, 175, 80, 0.5);
  border-color: rgba(76, 175, 80, 1);
}

.action-hint {
  text-align: center;
  font-size: 12px;
  color: #7dd0ff;
  margin-bottom: 16px;
  font-style: italic;
}

.change-hero-btn {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  background: linear-gradient(135deg, #00eaff, #00c6ff);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.change-hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 234, 255, 0.4);
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
  .hero-upgrade-card {
    max-width: 95vw;
  }

  .hero-upgrade-header {
    padding: 20px;
  }

  .hero-upgrade-info {
    flex-direction: column;
    text-align: center;
  }
}
</style>

