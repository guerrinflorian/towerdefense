<template>
  <div class="chapters">
    <div class="chapters__header">
      <div>
        <p class="chapters__eyebrow">Chapitres & niveaux</p>
        <h3 class="chapters__title">Progression</h3>
      </div>
    </div>

    <div v-if="loading" class="chapters__placeholder">
      Chargement des chapitres...
    </div>

    <div v-else-if="chapters.length === 0" class="chapters__placeholder">
      Aucun chapitre disponible pour le moment.
    </div>

    <div v-else class="chapters__list">
      <div v-for="chapter in chapters" :key="chapter.id" class="chapter-card">
        <div class="chapter-card__header">
          <div>
            <p class="chapter-card__eyebrow">Chapitre {{ chapter.orderIndex || chapter.id }}</p>
            <h4 class="chapter-card__title">{{ chapter.name }}</h4>
            <p class="chapter-card__meta">
              {{ chapter.stats?.clearedLevels || 0 }}/{{ chapter.stats?.totalLevels || chapter.levels.length }} niveaux complétés
            </p>
          </div>
          <div class="chapter-card__status" :class="{ locked: chapter.isLocked }">
            {{ chapter.isLocked ? 'Verrouillé' : 'Débloqué' }}
          </div>
        </div>

        <p v-if="chapter.isLocked && chapter.lockReason" class="chapter-card__lock-reason">
          {{ chapter.lockReason }}
        </p>

        <div class="chapter-card__levels">
          <button
            v-for="level in chapter.levels"
            :key="level.id"
            class="level-chip"
            :class="{ locked: isLevelLocked(chapter, level.id) }"
            :disabled="isLevelLocked(chapter, level.id)"
            @click="$emit('play', { levelId: level.id, levelName: level.name })"
          >
            <div class="level-chip__main">
              <span class="level-chip__name">{{ level.name }}</span>
              <span class="level-chip__tag">Niveau {{ level.orderIndex || level.id }}</span>
            </div>
            <div class="level-chip__details">
              <template v-if="getBestRun(level.id)">
                <span class="pill success">Victoire</span>
                <span class="pill muted">Vies perdues: {{ getBestRun(level.id).livesLost }}</span>
              </template>
              <template v-else>
                <span class="pill muted">Jamais tenté</span>
              </template>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  chapters: {
    type: Array,
    default: () => [],
  },
  bestRunsMap: {
    type: [Map, Object],
    default: () => new Map(),
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const locksByChapter = computed(() => {
  const map = new Map();
  props.chapters.forEach((chapter) => {
    map.set(
      chapter.id,
      new Map(
        (chapter.levelLocks || []).map((lock) => [
          lock.levelId,
          { isLocked: lock.isLocked, bestRun: lock.bestRun || null },
        ])
      )
    );
  });
  return map;
});

const getBestRun = (levelId) => {
  if (props.bestRunsMap instanceof Map) {
    return props.bestRunsMap.get(levelId) || null;
  }
  return props.bestRunsMap[levelId] || null;
};

const isLevelLocked = (chapter, levelId) => {
  const locks = locksByChapter.value.get(chapter.id);
  if (!locks) return true;
  return locks.get(levelId)?.isLocked ?? true;
};
</script>

<style scoped>
.chapters__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
}

.chapters__eyebrow {
  margin: 0;
  color: #6ddcff;
  letter-spacing: 0.08em;
  font-size: 12px;
  text-transform: uppercase;
}

.chapters__title {
  margin: 4px 0 0;
  font-size: 20px;
}

.chapters__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chapter-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  padding: 12px;
}

.chapter-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.chapter-card__eyebrow {
  margin: 0;
  color: #9ecff9;
  letter-spacing: 0.04em;
  font-size: 12px;
}

.chapter-card__title {
  margin: 2px 0 0;
  font-size: 18px;
}

.chapter-card__meta {
  margin: 4px 0 0;
  color: #8ca4b8;
  font-size: 13px;
}

.chapter-card__status {
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(0, 242, 255, 0.35);
  color: #b7f3ff;
  background: rgba(0, 242, 255, 0.08);
  font-weight: 700;
}

.chapter-card__status.locked {
  background: rgba(255, 255, 255, 0.06);
  color: #d7dee5;
  border-color: rgba(255, 255, 255, 0.14);
}

.chapter-card__lock-reason {
  margin: 8px 0 0;
  color: #c9a861;
  font-size: 13px;
}

.chapter-card__levels {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 8px;
}

.level-chip {
  width: 100%;
  border: 1px solid rgba(0, 242, 255, 0.18);
  background: rgba(255, 255, 255, 0.02);
  color: #e5ecf5;
  padding: 10px;
  border-radius: 12px;
  text-align: left;
  cursor: pointer;
  transition: transform 0.12s ease, border-color 0.12s ease, background 0.12s ease;
}

.level-chip:hover {
  transform: translateY(-1px);
  border-color: rgba(0, 242, 255, 0.35);
  background: rgba(0, 242, 255, 0.06);
}

.level-chip.locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.level-chip__main {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 6px;
}

.level-chip__name {
  font-weight: 700;
}

.level-chip__tag {
  font-size: 12px;
  color: #9eb4c4;
}

.level-chip__details {
  display: flex;
  gap: 6px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.pill {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.pill.success {
  border-color: rgba(0, 242, 255, 0.35);
  background: rgba(0, 242, 255, 0.12);
  color: #bef4ff;
}

.pill.muted {
  color: #8ea6b8;
}

.chapters__placeholder {
  color: #95a8b8;
}
</style>
