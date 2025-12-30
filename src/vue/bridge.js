/**
 * Bridge pour communication entre Phaser et Vue
 * Permet à Phaser d'ouvrir/fermer les modales Vue
 */

let modalStore = null;

export function initVueBridge(store) {
  modalStore = store;
}

/**
 * Affiche l'overlay de résultat de jeu
 */
export function showGameResult(type, message = '', onContinue = null) {
  if (!modalStore) {
    console.warn('Vue bridge not initialized');
    return;
  }
  modalStore.showGameResult(type, message, onContinue);
}

/**
 * Cache l'overlay de résultat
 */
export function hideGameResult() {
  if (!modalStore) {
    return;
  }
  modalStore.hideGameResult();
}

/**
 * Affiche la modale de sélection de héros
 */
export function showHeroSelection(config = {}) {
  if (!modalStore) {
    console.warn('Vue bridge not initialized');
    return;
  }
  modalStore.showHeroSelection(config);
}

/**
 * Cache la modale de sélection de héros
 */
export function hideHeroSelection() {
  if (!modalStore) {
    return;
  }
  modalStore.hideHeroSelection();
}

/**
 * Met à jour les points de héros disponibles
 */
export function updateHeroPoints(points) {
  if (!modalStore) {
    return;
  }
  modalStore.updateHeroPoints(points);
}

/**
 * Met à jour la liste des héros dans la modale de sélection
 */
export function updateHeroList(heroes, heroPointsAvailable) {
  if (!modalStore) {
    return;
  }
  modalStore.updateHeroList(heroes, heroPointsAvailable);
}

/**
 * Affiche la page des achievements
 */
export function showAchievements(config = {}) {
  if (!modalStore) {
    console.warn('Vue bridge not initialized');
    return;
  }
  modalStore.showAchievements(config);
}

/**
 * Cache la page des achievements
 */
export function hideAchievements() {
  if (!modalStore) {
    return;
  }
  modalStore.hideAchievements();
}

/**
 * Affiche le panneau de mise à niveau du héros
 */
export function showHeroUpgrade(config = {}) {
  if (!modalStore) {
    console.warn('Vue bridge not initialized');
    return;
  }
  modalStore.showHeroUpgrade(config);
}

/**
 * Cache le panneau de mise à niveau du héros
 */
export function hideHeroUpgrade() {
  if (!modalStore) {
    return;
  }
  modalStore.hideHeroUpgrade();
}

