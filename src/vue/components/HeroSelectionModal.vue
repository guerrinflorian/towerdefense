<template>
  <div class="hero-modal-overlay" @click.self="handleClose">
    <div class="hero-modal-card">
      <header class="modal-header">
        <div class="title-group">
          <div class="header-line"></div>
          <h2 class="modal-title">SÉLECTION DE HÉROS</h2>
        </div>
        <button class="close-btn" @click="handleClose">×</button>
      </header>

      <div class="status-bar">
        <div class="points-pill">
          <span class="pill-label">CRÉDITS DISPONIBLES</span>
          <span class="pill-value">{{ heroSelection.heroPointsAvailable }} <small>PTS</small></span>
        </div>
        
        <div v-if="selectedHero" class="current-hero-mini">
          <span class="mini-label">ACTUEL :</span>
          <div class="mini-avatar">
            <HeroAvatarCanvas
              :hero-id="Number(selectedHero.hero_id || selectedHero.id)"
              :hero-color="selectedHero.color || '#2b2b2b'"
              :size="32"
            />
          </div>
          <span class="mini-name">{{ selectedHero.name }}</span>
        </div>
      </div>

      <div class="modal-body">
        <div class="hero-grid">
          <div
            v-for="hero in sortedHeroes"
            :key="hero.id"
            class="hero-item"
            :class="{ 'is-locked': !isUnlocked(hero), 'is-selected': isSelected(hero) }"
            @click="handleHeroClick(hero)"
          >
            <div class="item-avatar">
              <div class="avatar-hex">
                <HeroAvatarCanvas
                  :hero-id="Number(hero.hero_id || hero.id)"
                  :hero-color="hero.color || '#2b2b2b'"
                  :size="44"
                />
              </div>
              <div v-if="isSelected(hero)" class="selected-check">✓</div>
            </div>

            <div class="item-identity">
              <h3 class="hero-name">{{ hero.name || `Héros ${hero.id}` }}</h3>
              <div class="hero-tags">
                <span v-if="!isUnlocked(hero)" class="tag-locked">VERROUILLÉ</span>
                <span v-else class="tag-unlocked">OPÉRATIONNEL</span>
              </div>
            </div>

            <div class="item-stats">
              <div class="stat-mini">
                <span class="s-icon">❤️</span>
                <span class="s-val">{{ Math.round(hero.current_hp || hero.base_hp || 0) }}</span>
                <span class="s-max">/{{ Math.round(hero.max_hp || 0) }}</span>
              </div>
              <div class="stat-mini">
                <span class="s-icon">⚔️</span>
                <span class="s-val">{{ (hero.current_damage || hero.base_damage || 0).toFixed(1) }}</span>
                <span class="s-max">/{{ (hero.max_damage || 0).toFixed(1) }}</span>
              </div>
              <div class="stat-mini">
                <span class="s-icon">⚡</span>
                <span class="s-val">{{ formatSeconds(hero.current_attack_interval_ms || hero.base_attack_interval_ms || 1500) }}</span>
                <span class="s-max">/{{ formatSeconds(hero.min_attack_interval_ms || 0) }}</span>
              </div>
              <div class="stat-mini">
                <span class="s-icon">🏃</span>
                <span class="s-val">{{ Math.round(hero.current_move_speed || hero.base_move_speed || 0) }}</span>
                <span class="s-max">/{{ Math.round(hero.max_move_speed || 0) }}</span>
              </div>
              <div v-if="hero.enemies_retained" class="stat-mini full-width">
                <span class="s-icon">🛡️</span>
                <span class="s-val">{{ hero.enemies_retained }} cibles simultanées</span>
              </div>
            </div>

            <div class="item-action">
              <div v-if="isSelected(hero)" class="active-badge">SÉLECTIONNÉ</div>
              
              <button v-else-if="isUnlocked(hero)" class="btn-select">CHOISIR</button>
              
              <button
                v-else
                class="btn-unlock"
                :disabled="!canUnlock(hero)"
                @click.stop="handleUnlock(hero.id)"
              >
                <span class="u-price">{{ hero.hero_points_to_unlock || 0 }} PTS</span>
                <span class="u-label">DÉBLOQUER</span>
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
  
  // Trier les héros : débloqués d'abord, puis verrouillés par prix croissant
  const sortedHeroes = computed(() => {
    if (!heroSelection.value.heroes) return [];
    const heroes = [...heroSelection.value.heroes];
    return heroes.sort((a, b) => {
      const aUnlocked = isUnlocked(a);
      const bUnlocked = isUnlocked(b);
      
      // Les débloqués en premier
      if (aUnlocked && !bUnlocked) return -1;
      if (!aUnlocked && bUnlocked) return 1;
      
      // Si les deux sont verrouillés, trier par prix de déblocage croissant
      if (!aUnlocked && !bUnlocked) {
        const priceA = a.hero_points_to_unlock || 0;
        const priceB = b.hero_points_to_unlock || 0;
        return priceA - priceB;
      }
      
      // Si les deux sont débloqués, garder l'ordre original
      return 0;
    });
  });
  
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
  background: rgba(0, 4, 10, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 15000;
  padding: 20px;
}

.hero-modal-card {
  width: 100%;
  max-width: 850px;
  max-height: 85vh;
  background: #080a0f;
  border: 1px solid rgba(0, 234, 255, 0.2);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 0 50px rgba(0,0,0,0.8);
}

/* HEADER */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(0, 234, 255, 0.1);
}

.header-line { width: 3px; height: 18px; background: #00eaff; box-shadow: 0 0 10px #00eaff; }
.title-group { display: flex; align-items: center; gap: 12px; }
.modal-title { font-size: 16px; font-weight: 900; letter-spacing: 3px; color: #fff; margin: 0; }
.close-btn { background: none; border: none; color: #7dd0ff; font-size: 28px; cursor: pointer; opacity: 0.5; }
.close-btn:hover { opacity: 1; transform: scale(1.1); }

/* STATUS BAR */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 25px;
  background: rgba(0, 234, 255, 0.05);
}

.points-pill { display: flex; align-items: center; gap: 10px; }
.pill-label { font-size: 10px; color: #7dd0ff; font-weight: bold; }
.pill-value { font-family: 'Orbitron', sans-serif; font-size: 16px; color: #00eaff; font-weight: 900; }

.current-hero-mini { display: flex; align-items: center; gap: 8px; background: rgba(0, 255, 136, 0.1); padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(0, 255, 136, 0.2); }
.mini-label { font-size: 9px; color: #00ff88; }
.mini-avatar { width: 24px; height: 24px; border-radius: 50%; overflow: hidden; border: 1px solid #00ff88; }
.mini-name { font-size: 12px; font-weight: bold; color: #fff; }

/* LISTE DES HEROS */
.modal-body { flex: 1; overflow-y: auto; padding: 20px; }
.hero-grid { display: flex; flex-direction: column; gap: 8px; }

.hero-item {
  display: grid;
  grid-template-columns: 60px 140px 1fr 140px;
  align-items: center;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
}

.hero-item:hover { background: rgba(0, 234, 255, 0.05); border-color: rgba(0, 234, 255, 0.2); transform: translateX(5px); }
.hero-item.is-selected { border-color: #00ff88; background: rgba(0, 255, 136, 0.05); }
.hero-item.is-locked { opacity: 0.6; }

/* AVATAR */
.item-avatar { position: relative; }
.avatar-hex { 
  width: 48px; height: 64px; background: #000; border: 1px solid rgba(0, 234, 255, 0.3); 
  border-radius: 10px; display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.selected-check {
  position: absolute; bottom: -5px; right: 5px; background: #00ff88; 
  color: #000; font-size: 9px; font-weight: 900; width: 16px; height: 16px;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
}

/* IDENTITY */
.hero-name { font-size: 15px; font-weight: 800; color: #fff; margin: 0 0 4px 0; }
.tag-locked { font-size: 9px; color: #ff6666; font-weight: bold; }
.tag-unlocked { font-size: 9px; color: #00eaff; font-weight: bold; }

/* STATS */
.item-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px 15px; }
.stat-mini { display: flex; align-items: center; gap: 6px; font-size: 11px; }
.s-icon { font-size: 12px; }
.s-val { color: #00eaff; font-weight: bold; font-family: 'Orbitron', sans-serif; }
.s-max { color: rgba(125, 208, 255, 0.4); font-size: 9px; }
.full-width { grid-column: span 2; color: #7dd0ff; font-style: italic; opacity: 0.8; margin-top: 2px; }

/* ACTIONS */
.item-action { display: flex; justify-content: flex-end; }
.active-badge { font-size: 10px; font-weight: 900; color: #00ff88; border: 1px solid #00ff88; padding: 6px 12px; border-radius: 4px; }

.btn-select {
  background: #00eaff; color: #000; border: none; padding: 8px 16px;
  border-radius: 4px; font-weight: 900; font-size: 11px; cursor: pointer;
  transition: 0.2s;
}
.btn-select:hover { transform: scale(1.05); box-shadow: 0 0 15px rgba(0, 234, 255, 0.4); }

.btn-unlock {
  background: rgba(255, 170, 0, 0.1); border: 1px solid #ffaa00;
  border-radius: 4px; display: flex; flex-direction: column; align-items: center;
  padding: 4px 12px; cursor: pointer; min-width: 110px;
}
.btn-unlock:disabled { opacity: 0.3; filter: grayscale(1); cursor: not-allowed; }
.u-price { font-size: 12px; font-weight: 900; color: #ffaa00; font-family: 'Orbitron', sans-serif; }
.u-label { font-size: 8px; color: #fff; opacity: 0.8; font-weight: bold; }

/* RESPONSIVE */
@media (max-width: 750px) {
  .hero-item { grid-template-columns: 60px 1fr 100px; grid-template-rows: auto auto; gap: 10px; }
  .item-stats { grid-column: 1 / span 3; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.05); }
}
</style>

