/**
 * Application Vue principale
 * Gère tous les overlays et modales du jeu
 */

// IMPORTANT: Charger la config des feature flags AVANT Vue
import './config.js';

// Utiliser le build runtime complet de Vue (avec support des templates compilés)
import { createApp, h } from 'vue/dist/vue.esm-bundler.js';
import { computed } from 'vue/dist/vue.esm-bundler.js';
import { useModalStore } from './stores/modalStore.js';
import { initVueBridge } from './bridge.js';
import GameResultOverlay from './components/GameResultOverlay.vue';
import HeroSelectionModal from './components/HeroSelectionModal.vue';
import AchievementsPage from './components/AchievementsPage.vue';
import HeroUpgradePanel from './components/HeroUpgradePanel.vue';
import AuthOverlay from './components/AuthOverlay.vue';
import MainMenuLayout from './components/MainMenu/MainMenuLayout.vue';
import PlayerProfileModal from './components/PlayerProfileModal.vue';

// Créer l'app Vue avec render function au lieu de template string
const app = createApp({
  components: {
    GameResultOverlay,
    HeroSelectionModal,
    AchievementsPage,
    HeroUpgradePanel,
    AuthOverlay,
    MainMenuLayout,
    PlayerProfileModal,
  },
  setup() {
    const modalStore = useModalStore();
    
    // Initialiser le bridge pour communication avec Phaser
    initVueBridge(modalStore);
    
    // Utiliser directement l'état reactive pour la réactivité
    const showGameResult = computed(() => modalStore.state.showGameResult);
    const showHeroSelection = computed(() => modalStore.state.showHeroSelection);
    const showAchievements = computed(() => modalStore.state.showAchievements);
    const showHeroUpgrade = computed(() => modalStore.state.showHeroUpgrade);
    const showMainMenu = computed(() => modalStore.state.mainMenu.visible);
    const playerProfile = computed(() => modalStore.state.playerProfile);
    
    return () => h('div', { id: 'vue-app' }, [
      h(AuthOverlay),
      showMainMenu.value ? h(MainMenuLayout) : null,
      showGameResult.value ? h(GameResultOverlay) : null,
      showHeroSelection.value ? h(HeroSelectionModal) : null,
      showAchievements.value ? h(AchievementsPage) : null,
      showHeroUpgrade.value ? h(HeroUpgradePanel, { onClose: () => modalStore.hideHeroUpgrade() }) : null,
      playerProfile.value.visible ? h(PlayerProfileModal, { 
        visible: true,
        username: playerProfile.value.username,
        onClose: () => modalStore.hidePlayerProfile()
      }) : null,
    ]);
  },
});

// Monter l'app sur un élément du DOM
const vueContainer = document.createElement('div');
vueContainer.id = 'vue-app-container';
document.body.appendChild(vueContainer);

app.mount(vueContainer);

// Exposer l'app globalement pour communication avec Phaser
window.vueApp = app;

export default app;
