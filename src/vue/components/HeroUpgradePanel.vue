<template>
  <div class="hero-upgrade-panel">
    <div class="hero-upgrade-card">
      <header class="hero-upgrade-header">
        <div class="header-left">
          <div class="status-dot"></div>
          <h2 class="hero-upgrade-title">SYSTÈME HÉROS</h2>
        </div>
        <button class="hero-upgrade-close" @click="handleClose">×</button>
      </header>

      <div class="hero-profile-row">
        <div class="hero-avatar-wrapper">
          <div class="avatar-frame">
            <HeroAvatarCanvas
              :hero-id="Number(heroStats?.hero_id || 1)"
              :hero-color="heroStats?.color || '#2b2b2b'"
              :size="64"
            />
          </div>
          <button class="color-picker-mini" @click="openColorPicker">🎨</button>
        </div>

        <div class="hero-identity">
          <h3 class="hero-name">{{ heroName }}</h3>
          <div class="hero-meta-grid">
            <span>💀 {{ heroStats?.kills || 0 }}</span>
            <span>👥 {{ heroStats?.enemies_retained || 0 }}</span>
          </div>
        </div>

        <div class="hero-points-badge">
          <span class="label">POINTS</span>
          <span class="value">{{ heroPointsAvailable }}</span>
        </div>
      </div>

      <div class="hero-stats-grid">
        <div
          v-for="stat in stats"
          :key="stat.key"
          class="stat-box"
          :class="{ 'is-max': stat.isMax, 'has-pending': stat.pendingPoints > 0 }"
        >
          <div class="stat-info">
            <span class="stat-label">
              <span class="stat-icon">{{ stat.icon }}</span>
              {{ stat.label }}
            </span>
            <span class="stat-val" :class="{ 'pending': stat.pendingPoints > 0 }">
              {{ stat.displayValue }}
            </span>
          </div>
          
          <div class="stat-control">
            <div class="bar-container">
              <div class="bar-bg">
                <div class="bar-fill" :style="{ width: stat.fillPercent + '%' }"></div>
                <div 
                  v-if="stat.pendingPoints > 0"
                  class="bar-pending"
                  :style="{ width: stat.pendingPercent + '%', left: stat.fillPercent + '%' }"
                ></div>
              </div>
            </div>
            <button
              class="add-btn"
              :disabled="stat.isMax || heroPointsAvailable === 0"
              @mousedown="startUpgrade(stat.key)"
              @mouseup="stopUpgrade"
              @mouseleave="stopUpgrade"
            >+</button>
          </div>
          <div class="stat-sub">{{ stat.limitText }} <span v-if="stat.conversionValue">({{ stat.conversionText }})</span></div>
        </div>
      </div>

      <footer class="hero-footer">
        <div v-if="totalPending > 0" class="pending-bar">
          <span class="pending-count">{{ totalPending }} AMÉLIORATION(S) EN ATTENTE</span>
          <div class="pending-btns">
            <button class="btn-cancel" @click="cancelUpgrades">ANNULER</button>
            <button class="btn-validate" @click="validateUpgrades">CONFIRMER</button>
          </div>
        </div>
        <button class="btn-switch" @click="openHeroSelection">
          🔄 CHANGER DE HÉROS
        </button>
      </footer>
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
      { key: 'hp', label: 'Points de vie', icon: '❤️', max: maxValues.hp },
      { key: 'damage', label: 'Dégâts', icon: '⚔️', max: maxValues.damage },
      { key: 'move_speed', label: 'Agilité', icon: '💨', max: maxValues.move_speed },
      { key: 'attack_interval_ms', label: 'Vitesse de frappe', icon: '⚡', max: maxValues.attack_interval_ms, min: minValues.attack_interval_ms }
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
      // Émettre un événement pour notifier les autres composants
      window.dispatchEvent(new CustomEvent('hero:color-changed', { 
        detail: { color: e.target.value } 
      }));
      window.dispatchEvent(new CustomEvent('profile:updated'));
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
  background: rgba(0, 4, 10, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 16000;
  padding: 20px;
}

.hero-upgrade-card {
  width: 100%;
  max-width: 580px; /* Un peu plus large pour la grille */
  background: #0b0e14;
  border: 1px solid rgba(0, 234, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(0, 234, 255, 0.05);
  overflow: hidden;
  font-family: 'Segoe UI', Roboto, sans-serif;
}

/* Header */
.hero-upgrade-header {
  background: rgba(0, 234, 255, 0.05);
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 234, 255, 0.1);
}

.header-left { display: flex; align-items: center; gap: 10px; }
.status-dot { width: 6px; height: 6px; background: #00eaff; border-radius: 50%; box-shadow: 0 0 8px #00eaff; }
.hero-upgrade-title { font-size: 14px; font-weight: 900; letter-spacing: 2px; color: #7dd0ff; margin: 0; }
.hero-upgrade-close { background: none; border: none; color: #7dd0ff; font-size: 24px; cursor: pointer; opacity: 0.6; }
.hero-upgrade-close:hover { opacity: 1; color: #ff4d4d; }

/* Identity Row */
.hero-profile-row {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  gap: 15px;
  background: linear-gradient(to bottom, rgba(0, 234, 255, 0.02), transparent);
}

.avatar-frame {
  width: 70px;
  height: 84px;
  border: 2px solid #00eaff;
  border-radius: 50%;
  padding: 2px;
  background: #05070a;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* Empêche le débordement de l'avatar */
}

.hero-avatar-wrapper { position: relative; }
.color-picker-mini {
  position: absolute; bottom: -2px; right: -2px;
  background: #00eaff; border: none; border-radius: 50%;
  width: 22px; height: 22px; font-size: 10px; cursor: pointer;
}

.hero-identity { flex: 1; }
.hero-name { font-size: 18px; margin: 0 0 4px 0; color: #fff; letter-spacing: 1px; }
.hero-meta-grid { display: flex; gap: 12px; font-size: 11px; color: #7dd0ff; opacity: 0.8; }

.hero-points-badge {
  background: rgba(0, 234, 255, 0.1);
  padding: 8px 15px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid rgba(0, 234, 255, 0.2);
}
.hero-points-badge .label { display: block; font-size: 9px; color: #7dd0ff; letter-spacing: 1px; }
.hero-points-badge .value { font-size: 20px; font-weight: 900; color: #00eaff; }

/* Stats Grid (Le coeur du changement) */
.hero-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 15px 20px;
  background: rgba(0,0,0,0.2);
}

.stat-box {
  background: rgba(255, 255, 255, 0.03);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-info { display: flex; justify-content: space-between; margin-bottom: 8px; align-items: center; }
.stat-label { font-size: 11px; color: rgba(255,255,255,0.6); text-transform: uppercase; display: flex; align-items: center; gap: 6px; }
.stat-icon { font-size: 14px; filter: drop-shadow(0 0 2px rgba(0, 234, 255, 0.5)); }
.stat-val { font-size: 12px; font-weight: bold; color: #00eaff; }
.stat-val.pending { color: #ffaa00; }

.stat-control { display: flex; align-items: center; gap: 10px; }
.bar-container { flex: 1; }
.bar-bg { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; position: relative; overflow: hidden; }
.bar-fill { position: absolute; height: 100%; background: #00eaff; box-shadow: 0 0 8px #00eaff; transition: width 0.3s; }
.bar-pending { position: absolute; height: 100%; background: #ffaa00; opacity: 0.6; }

.add-btn {
  width: 24px; height: 24px; border-radius: 4px; border: 1px solid #00eaff;
  background: rgba(0, 234, 255, 0.1); color: #00eaff; font-weight: bold; cursor: pointer;
}
.add-btn:disabled { opacity: 0.2; cursor: not-allowed; border-color: gray; color: gray; }
.add-btn:hover:not(:disabled) { background: #00eaff; color: #000; }

.stat-sub { font-size: 9px; color: rgba(125, 208, 255, 0.5); margin-top: 5px; }

/* Footer */
.hero-footer { padding: 15px 20px; }
.pending-bar {
  background: rgba(255, 170, 0, 0.1);
  border: 1px solid rgba(255, 170, 0, 0.3);
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
.pending-count { font-size: 10px; font-weight: bold; color: #ffaa00; }
.pending-btns { display: flex; gap: 10px; width: 100%; }
.btn-cancel, .btn-validate { flex: 1; padding: 8px; border-radius: 4px; border: none; font-weight: bold; cursor: pointer; font-size: 11px; }
.btn-cancel { background: rgba(255, 77, 77, 0.2); color: #ff4d4d; }
.btn-validate { background: #4caf50; color: #fff; }

.btn-switch {
  width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  color: #fff; padding: 10px; border-radius: 6px; cursor: pointer; font-size: 11px; transition: 0.2s;
}
.btn-switch:hover { background: rgba(255,255,255,0.1); border-color: #00eaff; }

/* Animations */
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.hero-upgrade-panel { animation: fadeIn 0.2s ease-out; }

@media (max-width: 500px) {
  .hero-stats-grid { grid-template-columns: 1fr; }
  .hero-upgrade-card { max-width: 95vw; }
}
</style>