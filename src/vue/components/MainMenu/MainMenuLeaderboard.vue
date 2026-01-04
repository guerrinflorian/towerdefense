<template>
  <div class="leaderboard">
    <div class="leaderboard__header">
      <div>
        <p class="leaderboard__eyebrow">Leaderboard</p>
        <h3 class="leaderboard__title">Classement global</h3>
      </div>
    </div>

    <div v-if="loading" class="leaderboard__placeholder">Chargement du classement...</div>
    <div v-else-if="entries.length === 0" class="leaderboard__placeholder">
      Pas encore de scores disponibles.
    </div>
    <ul v-else class="leaderboard__list">
      <li v-for="entry in entries" :key="entry.rank" class="leaderboard__row">
        <span class="leaderboard__rank">#{{ entry.rank ?? '?' }}</span>
        <div class="leaderboard__player">
          <span class="leaderboard__name">{{ entry.username || entry.name || 'Joueur' }}</span>
          <span class="leaderboard__score">{{ entry.score ?? entry.points ?? entry.value ?? 0 }} pts</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  entries: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.leaderboard__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
}

.leaderboard__eyebrow {
  margin: 0;
  color: #6ddcff;
  letter-spacing: 0.08em;
  font-size: 12px;
  text-transform: uppercase;
}

.leaderboard__title {
  margin: 4px 0 0;
  font-size: 20px;
}

.leaderboard__placeholder {
  color: #95a8b8;
}

.leaderboard__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.leaderboard__row {
  display: grid;
  grid-template-columns: 50px 1fr;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 12px;
}

.leaderboard__rank {
  font-weight: 800;
  color: #9ecff9;
}

.leaderboard__player {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.leaderboard__name {
  font-weight: 700;
}

.leaderboard__score {
  color: #d1e6f5;
  font-weight: 600;
}
</style>
