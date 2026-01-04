/**
 * Store Vue pour gérer l'état des modales
 * Utilise la Composition API avec un pattern store simple
 */

import { ref, reactive, toRefs } from 'vue/dist/vue.esm-bundler.js';

// État global des modales - utiliser reactive pour la réactivité
const state = reactive({
  showGameResult: false,
  showHeroSelection: false,
  showAchievements: false,
  showHeroUpgrade: false,
  mainMenu: {
    visible: false,
    callbacks: {},
  },
  gameResult: {
    type: null, // 'victory' | 'defeat'
    message: '',
    onContinue: null,
  },
  heroSelection: {
    heroes: [],
    selectedHeroId: null,
    heroPointsAvailable: 0,
    onSelect: null,
    onUnlock: null,
    onClose: null,
  },
  achievements: {
    achievements: [],
    summary: null,
    onClose: null,
  },
  heroUpgrade: {
    onClose: null,
  },
});

export function useModalStore() {
  // Game Result
  const showGameResult = (type, message = '', onContinue = null) => {
    state.gameResult = { type, message, onContinue };
    state.showGameResult = true;
    blockGame(true);
  };

  const hideGameResult = () => {
    const onContinue = state.gameResult.onContinue;
    state.showGameResult = false;
    blockGame(false);
    if (onContinue) {
      onContinue();
    }
  };

  // Hero Selection
  const showHeroSelection = (config = {}) => {
    state.heroSelection = {
      heroes: config.heroes || [],
      selectedHeroId: config.selectedHeroId || null,
      heroPointsAvailable: config.heroPointsAvailable || 0,
      onSelect: config.onSelect || null,
      onUnlock: config.onUnlock || null,
      onClose: config.onClose || null,
    };
    state.showHeroSelection = true;
    blockGame(true);
  };

  const hideHeroSelection = () => {
    const onClose = state.heroSelection.onClose;
    // Réinitialiser onClose avant de mettre à jour l'état pour éviter les boucles
    state.heroSelection.onClose = null;
    state.showHeroSelection = false;
    blockGame(false);
    // Appeler onClose après avoir mis à jour l'état pour éviter les boucles
    if (onClose) {
      // Utiliser setTimeout pour éviter les boucles infinies
      setTimeout(() => {
        try {
          onClose();
        } catch (e) {
          console.error('Erreur dans onClose de heroSelection:', e);
        }
      }, 0);
    }
  };

  const updateHeroPoints = (points) => {
    state.heroSelection.heroPointsAvailable = points;
  };

  const updateHeroList = (heroes, heroPointsAvailable) => {
    if (state.showHeroSelection) {
      state.heroSelection.heroes = heroes || [];
      if (heroPointsAvailable !== undefined) {
        state.heroSelection.heroPointsAvailable = heroPointsAvailable;
      }
    }
  };

  // Achievements
  const showAchievements = (config = {}) => {
    state.achievements = {
      achievements: config.achievements || [],
      summary: config.summary || null,
      onClose: config.onClose || null,
    };
    state.showAchievements = true;
    blockGame(true);
  };

  const hideAchievements = () => {
    state.showAchievements = false;
    blockGame(false);
    if (state.achievements.onClose) {
      state.achievements.onClose();
    }
  };

  // Hero Upgrade
  const showHeroUpgrade = (config = {}) => {
    state.heroUpgrade = {
      onClose: config.onClose || null,
    };
    state.showHeroUpgrade = true;
    blockGame(true);
  };

  const hideHeroUpgrade = () => {
    state.showHeroUpgrade = false;
    blockGame(false);
    if (state.heroUpgrade.onClose) {
      state.heroUpgrade.onClose();
    }
  };

  // Main menu overlay
  const showMainMenu = (config = {}) => {
    state.mainMenu.callbacks = config;
    state.mainMenu.visible = true;
    blockGame(true);
  };

  const hideMainMenu = () => {
    state.mainMenu.visible = false;
    state.mainMenu.callbacks = {};
    blockGame(false);
  };

  // Helper pour bloquer le jeu
  const blockGame = (block) => {
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
      gameContainer.classList.toggle('blocked', block);
    }
  };

  // Retourner directement l'état reactive pour la réactivité complète
  return {
    // State - accès direct à l'état reactive
    state,
    // Getters réactifs
    get showGameResult() {
      return state.showGameResult;
    },
    get showHeroSelection() {
      return state.showHeroSelection;
    },
    get showAchievements() {
      return state.showAchievements;
    },
    get gameResult() {
      return state.gameResult;
    },
    get heroSelection() {
      return state.heroSelection;
    },
    get achievements() {
      return state.achievements;
    },
    get showHeroUpgrade() {
      return state.showHeroUpgrade;
    },
    get heroUpgrade() {
      return state.heroUpgrade;
    },
    get mainMenu() {
      return state.mainMenu;
    },
    // Actions
    showGameResult,
    hideGameResult,
    showHeroSelection,
    hideHeroSelection,
    updateHeroPoints,
    updateHeroList,
    showAchievements,
    hideAchievements,
    showHeroUpgrade,
    hideHeroUpgrade,
    showMainMenu,
    hideMainMenu,
  };
}
