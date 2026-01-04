<template>
  <div class="chapters-view">
    <header class="chapters-header">
      <div class="header-decorator"></div>
      <div class="header-content">
        <p class="eyebrow">Secteurs Disponibles</p>
        <h3 class="title">PROGRESSION DE CAMPAGNE</h3>
      </div>
    </header>

    <div v-if="loading" class="status-message">
      <div class="loading-spinner"></div>
      <p>SYNCHRONISATION DES ARCHIVES...</p>
    </div>

    <div v-else-if="chapters.length === 0" class="status-message">
      <p>AUCUN SECTEUR DE MISSION DÉTECTÉ</p>
    </div>

    <div v-else class="chapters-grid">
      <div 
        v-for="chapter in chapters" 
        :key="chapter.id" 
        class="chapter-card"
        :class="{ 'is-locked': chapter.isLocked }"
        @click="!chapter.isLocked && $emit('select-chapter', chapter)"
        :title="chapter.isLocked ? 'Chapitre verrouillé' : `Accéder au chapitre: ${chapter.name}`"
      >
        <div class="chapter-visual">
          <img 
            :src="getImageSrc(chapter)" 
            :alt="chapter.name"
            class="chapter-img"
            @error="handleImageError($event, chapter)"
          />
          <div class="visual-overlay"></div>
          
          <div v-if="chapter.isLocked" class="lock-overlay">
            <span class="lock-icon">🔒</span>
            <p class="lock-text">CHAPITRE NON DÉBLOQUÉ</p>
          </div>
        </div>

        <div class="chapter-details">
          <div class="details-top">
            <span class="chapter-num">SECTEUR {{ chapter.orderIndex || chapter.id }}</span>
            <h4 class="chapter-name">{{ chapter.name }}</h4>
          </div>

          <div class="progress-section">
            <div class="progress-meta">
              <span class="progress-label">COMPLÉTION</span>
              <span class="progress-value">{{ getCompletionPercent(chapter) }}%</span>
            </div>
            <div class="progress-track">
              <div 
                class="progress-fill" 
                :style="{ width: getCompletionPercent(chapter) + '%' }"
              ></div>
            </div>
            <p class="levels-count">
              {{ chapter.stats?.clearedLevels || 0 }} / {{ chapter.stats?.totalLevels || chapter.levels.length }} NIVEAUX
            </p>
          </div>

          <p v-if="chapter.isLocked && chapter.lockReason" class="lock-reason">
            {{ chapter.lockReason }}
          </p>

          <div class="action-area">
            <button 
              v-if="!chapter.isLocked" 
              class="select-btn"
              title="Voir les missions de ce chapitre"
            >
              ACCÉDER AU SECTEUR
              <span class="btn-arrow">→</span>
            </button>
          </div>
        </div>
        
        <div class="border-decorator top-left"></div>
        <div class="border-decorator bottom-right"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  chapters: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});


const getImageSrc = (chapter) => {
  // Utiliser l'image base64 si disponible
  if (chapter.imageb64Url) {
    return chapter.imageb64Url;
  }
  
  // Fallback vers l'image locale si pas d'image base64
  const numId = Number(chapter.orderIndex || chapter.id) || 1;
  return `/images/chapitre${numId}.png`;
};

const handleImageError = (event, chapter) => {
  // Si l'image base64 échoue, utiliser l'image locale comme fallback
  const numId = Number(chapter.orderIndex || chapter.id) || 1;
  event.target.src = `/images/chapitre${numId}.png`;
};

const getCompletionPercent = (chapter) => {
  const cleared = chapter.stats?.clearedLevels || 0;
  const total = chapter.stats?.totalLevels || chapter.levels.length || 1;
  return Math.round((cleared / total) * 100);
};
</script>

<style scoped>
.chapters-view {
  width: 100%;
  padding: 10px;
}

/* HEADER STYLE */
.chapters-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.header-decorator {
  width: 4px;
  height: 40px;
  background: #00eaff;
  box-shadow: 0 0 15px #00eaff;
}

.eyebrow {
  margin: 0;
  color: #00eaff;
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  opacity: 0.8;
}

.title {
  margin: 2px 0 0;
  font-size: 22px;
  font-weight: 900;
  color: #fff;
}

/* GRILLE */
.chapters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
}

/* CARTE CHAPITRE */
.chapter-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.chapter-card:hover:not(.is-locked) {
  border-color: #00eaff;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 234, 255, 0.3);
  cursor: pointer;
  background: rgba(0, 234, 255, 0.05);
}

.chapter-card:active:not(.is-locked) {
  transform: translateY(-2px);
}

/* VISUEL */
.chapter-visual {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.chapter-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  display: block; /* S'assurer que l'image est affichée */
  position: relative; /* S'assurer qu'elle est au-dessus du fond */
  z-index: 1; /* Au-dessus du fond mais sous l'overlay */
}

.chapter-card:hover .chapter-img {
  transform: scale(1.1);
}

.visual-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(8, 10, 15, 0.6) 100%);
  z-index: 2; /* Au-dessus de l'image mais sous le lock-overlay */
  pointer-events: none; /* Permettre les clics à travers */
}

/* LOCK STATE */
.is-locked .chapter-img {
  filter: grayscale(1) blur(4px);
  opacity: 0.4;
}

.lock-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
}

.lock-icon { font-size: 40px; margin-bottom: 10px; }
.lock-text { 
  font-size: 12px; 
  font-weight: 900; 
  letter-spacing: 2px; 
  color: rgba(255, 255, 255, 0.7);
}

/* DETAILS */
.chapter-details {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chapter-num {
  font-size: 10px;
  color: #00eaff;
  letter-spacing: 2px;
  font-weight: 700;
}

.chapter-name {
  margin: 5px 0 15px;
  font-size: 20px;
  font-weight: 800;
  color: #fff;
}

/* PROGRESSION */
.progress-section { margin-bottom: 20px; }

.progress-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.progress-label { font-size: 9px; opacity: 0.5; letter-spacing: 1px; }
.progress-value { font-size: 11px; color: #00eaff; font-weight: 900; }

.progress-track {
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: #00eaff;
  box-shadow: 0 0 10px #00eaff;
  border-radius: 2px;
  transition: width 1s ease-out;
}

.levels-count { font-size: 10px; opacity: 0.4; margin: 0; }

.lock-reason {
  font-size: 12px;
  color: #ffaa00;
  background: rgba(255, 170, 0, 0.1);
  padding: 8px;
  border-left: 2px solid #ffaa00;
  margin: 0 0 15px;
}

/* BOUTON SELECTION */
.select-btn {
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px solid rgba(0, 234, 255, 0.4);
  color: #00eaff;
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: 0.2s;
}

.chapter-card:hover .select-btn {
  background: #00eaff;
  color: #000;
}

/* DECORATIONS HUD */
.border-decorator {
  position: absolute;
  width: 10px;
  height: 10px;
  border-color: #00eaff;
  border-style: solid;
  opacity: 0;
  transition: opacity 0.3s;
}

.top-left { top: 0; left: 0; border-width: 2px 0 0 2px; }
.bottom-right { bottom: 0; right: 0; border-width: 0 2px 2px 0; }

.chapter-card:hover .border-decorator {
  opacity: 1;
}

/* CHARGEMENT */
.status-message {
  padding: 60px;
  text-align: center;
  color: #7dd0ff;
  letter-spacing: 2px;
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

@keyframes spin { to { transform: rotate(360deg); } }
</style>