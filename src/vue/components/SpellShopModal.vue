<template>
  <div class="spell-modal-overlay" @click.self="handleClose">
    <div class="spell-modal-card">

      <header class="modal-header">
        <div class="title-group">
          <div class="header-line"></div>
          <h2 class="modal-title">ARSENAL MAGIQUE</h2>
        </div>
        <button class="close-btn" @click="handleClose">×</button>
      </header>

      <div class="status-bar">
        <div class="points-pill">
          <span class="pill-label">CRÉDITS DISPONIBLES</span>
          <span class="pill-value">{{ localPoints }} <small>PTS</small></span>
        </div>
        <div class="status-hint">
          Achète des sorts pour les utiliser en combat
        </div>
      </div>

      <div class="modal-body">
        <div class="spell-grid">
          <div
            v-for="spell in sortedSpells"
            :key="spell.key"
            class="spell-item"
            :class="{
              'is-locked': !spell.is_unlocked,
              'is-free': spell.is_free,
              'is-owned': spell.is_unlocked && !spell.is_free,
            }"
          >
            <div class="item-icon-wrap">
              <div class="item-icon">{{ spell.icon }}</div>
              <div v-if="spell.is_free" class="free-badge">GRATUIT</div>
              <div v-else-if="spell.is_unlocked" class="owned-badge">ACQUIS</div>
            </div>

            <div class="item-identity">
              <h3 class="spell-name">{{ spell.name }}</h3>
              <div class="spell-tags">
                <span v-if="spell.is_free" class="tag-free">De base</span>
                <span v-else-if="spell.is_unlocked" class="tag-owned">Débloqué</span>
                <span v-else class="tag-locked">Verrouillé</span>
              </div>
            </div>

            <p class="spell-desc">{{ spell.description }}</p>

            <div class="item-action">
              <div v-if="spell.is_free || spell.is_unlocked" class="active-badge">
                <span class="check-icon">✓</span> DISPONIBLE
              </div>

              <button
                v-else
                class="btn-unlock"
                :disabled="localPoints < spell.cost_hero_points || unlocking === spell.key"
                @click="handleUnlock(spell)"
              >
                <span v-if="unlocking === spell.key" class="loading-dots">···</span>
                <template v-else>
                  <span class="u-price">{{ spell.cost_hero_points }} PTS</span>
                  <span class="u-label">ACHETER</span>
                </template>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useModalStore } from '../stores/modalStore.js';

const modalStore = useModalStore();
const spellShop = computed(() => modalStore.state.spellShop);

const localPoints = ref(spellShop.value.heroPointsAvailable || 0);
const unlocking = ref(null);

const sortedSpells = computed(() => {
  const spells = spellShop.value.spells || [];
  return [...spells].sort((a, b) => {
    // Gratuits en premier, puis acquis, puis verrouillés par prix
    if (a.is_free && !b.is_free) return -1;
    if (!a.is_free && b.is_free) return 1;
    if (a.is_unlocked && !b.is_unlocked) return -1;
    if (!a.is_unlocked && b.is_unlocked) return 1;
    return (a.cost_hero_points || 0) - (b.cost_hero_points || 0);
  });
});

async function handleUnlock(spell) {
  if (unlocking.value) return;
  unlocking.value = spell.key;
  try {
    await spellShop.value.onUnlock?.(spell.key);
    // Mettre à jour les points localement
    localPoints.value = Math.max(0, localPoints.value - spell.cost_hero_points);
  } catch (err) {
    console.error('Erreur achat sort:', err);
  } finally {
    unlocking.value = null;
  }
}

function handleClose() {
  modalStore.hideSpellShop();
}
</script>

<style scoped>
.spell-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 4, 12, 0.88);
  backdrop-filter: blur(14px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 17000;
  padding: 20px;
  animation: fadeIn 0.18s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}

.spell-modal-card {
  width: 100%;
  max-width: 720px;
  max-height: 88vh;
  background: #080b11;
  border: 1px solid rgba(160, 80, 255, 0.3);
  border-radius: 14px;
  box-shadow: 0 0 60px rgba(120, 40, 255, 0.25), inset 0 0 30px rgba(120, 40, 255, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Orbitron', 'Segoe UI', sans-serif;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: rgba(120, 40, 255, 0.07);
  border-bottom: 1px solid rgba(120, 40, 255, 0.15);
  flex-shrink: 0;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-line {
  width: 3px;
  height: 20px;
  background: linear-gradient(to bottom, #a050ff, #6010cc);
  border-radius: 2px;
}

.modal-title {
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 3px;
  color: #c080ff;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #c080ff;
  font-size: 26px;
  cursor: pointer;
  opacity: 0.6;
  line-height: 1;
  transition: opacity 0.15s;
}
.close-btn:hover { opacity: 1; color: #ff4d4d; }

/* Status bar */
.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(120, 40, 255, 0.1);
  flex-shrink: 0;
  gap: 12px;
}

.points-pill {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.pill-label {
  font-size: 9px;
  letter-spacing: 1.5px;
  color: #8060b0;
  text-transform: uppercase;
}

.pill-value {
  font-size: 22px;
  font-weight: 900;
  color: #c080ff;
}

.pill-value small {
  font-size: 11px;
  font-weight: 600;
  color: #8060b0;
  margin-left: 3px;
}

.status-hint {
  font-size: 11px;
  color: #6050a0;
  font-style: italic;
}

/* Body */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

.spell-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

/* Spell item */
.spell-item {
  display: grid;
  grid-template-columns: 70px 1fr auto;
  grid-template-rows: auto auto;
  gap: 0 14px;
  align-items: start;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(120, 40, 255, 0.12);
  border-radius: 10px;
  padding: 14px;
  transition: border-color 0.2s, background 0.2s;
}

.spell-item:hover {
  border-color: rgba(160, 80, 255, 0.3);
  background: rgba(120, 40, 255, 0.06);
}

.spell-item.is-free {
  border-color: rgba(0, 242, 255, 0.2);
}

.spell-item.is-owned {
  border-color: rgba(80, 220, 100, 0.2);
}

/* Icon */
.item-icon-wrap {
  grid-row: 1 / 3;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-icon {
  font-size: 38px;
  width: 62px;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(120, 40, 255, 0.2);
  border-radius: 12px;
}

.is-free .item-icon {
  border-color: rgba(0, 242, 255, 0.3);
  background: rgba(0, 242, 255, 0.06);
}

.is-owned .item-icon {
  border-color: rgba(80, 220, 100, 0.3);
  background: rgba(80, 220, 100, 0.06);
}

.free-badge, .owned-badge {
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 7px;
  font-weight: 900;
  letter-spacing: 0.5px;
  padding: 2px 6px;
  border-radius: 3px;
  white-space: nowrap;
}

.free-badge {
  background: #00c8ff;
  color: #000;
}

.owned-badge {
  background: #50dc64;
  color: #000;
}

/* Identity */
.item-identity {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.spell-name {
  font-size: 15px;
  font-weight: 700;
  color: #e8d8ff;
  margin: 0;
  letter-spacing: 0.5px;
}

.spell-tags { display: flex; gap: 6px; }

.tag-free {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 3px;
  background: rgba(0, 200, 255, 0.15);
  border: 1px solid rgba(0, 200, 255, 0.4);
  color: #00c8ff;
  letter-spacing: 0.5px;
}

.tag-owned {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 3px;
  background: rgba(80, 220, 100, 0.15);
  border: 1px solid rgba(80, 220, 100, 0.4);
  color: #50dc64;
  letter-spacing: 0.5px;
}

.tag-locked {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 3px;
  background: rgba(255, 100, 100, 0.1);
  border: 1px solid rgba(255, 100, 100, 0.3);
  color: #ff8080;
  letter-spacing: 0.5px;
}

/* Description */
.spell-desc {
  grid-column: 2 / 3;
  margin: 6px 0 0;
  font-size: 12px;
  color: #8070a0;
  line-height: 1.55;
  font-family: 'Segoe UI', sans-serif;
}

/* Action */
.item-action {
  grid-row: 1 / 3;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 4px;
}

.active-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 800;
  color: #50dc64;
  letter-spacing: 1px;
  background: rgba(80, 220, 100, 0.1);
  border: 1px solid rgba(80, 220, 100, 0.25);
  padding: 6px 10px;
  border-radius: 6px;
  white-space: nowrap;
}

.check-icon { font-size: 12px; }

.btn-unlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid rgba(200, 100, 255, 0.5);
  background: rgba(160, 60, 255, 0.15);
  color: #e0b0ff;
  cursor: pointer;
  transition: all 0.18s;
  min-width: 82px;
  white-space: nowrap;
}

.btn-unlock:hover:not(:disabled) {
  background: rgba(160, 60, 255, 0.3);
  border-color: #c060ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(160, 60, 255, 0.3);
}

.btn-unlock:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  transform: none;
}

.u-price {
  font-size: 13px;
  font-weight: 900;
  color: #e0b0ff;
  letter-spacing: 0.5px;
}

.u-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #a070d0;
}

.loading-dots {
  font-size: 18px;
  color: #e0b0ff;
  letter-spacing: 4px;
}

@media (max-width: 500px) {
  .spell-item {
    grid-template-columns: 56px 1fr;
  }
  .item-action {
    grid-column: 1 / 3;
    grid-row: 3;
    justify-content: flex-start;
    margin-top: 8px;
  }
  .status-hint { display: none; }
}
</style>
