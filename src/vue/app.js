/**
 * Application Vue principale
 * Gère tous les overlays et modales du jeu
 */

// IMPORTANT: Charger la config des feature flags AVANT Vue
import './config.js';

// Utiliser le build runtime complet de Vue (avec support des templates compilés)
import { createApp, h, Teleport, computed } from 'vue/dist/vue.esm-bundler.js';
import { useModalStore } from './stores/modalStore.js';
import { initGameUIBridge, initVueBridge } from './bridge.js';
import { useGameUIStore } from './stores/gameUIStore.js';
import { useServerStatusStore } from './stores/serverStatusStore.js';
import { useServerStatus } from './composables/useServerStatus.js';
import GameResultOverlay from './components/GameResultOverlay.vue';
import HeroSelectionModal from './components/HeroSelectionModal.vue';
import AchievementsPage from './components/AchievementsPage.vue';
import HeroUpgradePanel from './components/HeroUpgradePanel.vue';
import AuthOverlay from './components/AuthOverlay.vue';
import MainMenuLayout from './components/MainMenu/MainMenuLayout.vue';
import PlayerProfileModal from './components/PlayerProfileModal.vue';
import GameHud from './components/GameHud.vue';
import GameToolbar from './components/GameToolbar.vue';
import ServerStatusOverlay from './components/ServerStatusOverlay.vue';

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
    ServerStatusOverlay,
  },
  setup() {
    const modalStore = useModalStore();
    const gameUIStore = useGameUIStore();
    const serverStatusStore = useServerStatusStore();

    useServerStatus();
    
    // Initialiser le bridge pour communication avec Phaser
    initVueBridge(modalStore);
    initGameUIBridge(gameUIStore);
    
    // Utiliser directement l'état reactive pour la réactivité
    const showGameResult = computed(() => modalStore.state.showGameResult);
    const showHeroSelection = computed(() => modalStore.state.showHeroSelection);
    const showAchievements = computed(() => modalStore.state.showAchievements);
    const showHeroUpgrade = computed(() => modalStore.state.showHeroUpgrade);
    const showMainMenu = computed(() => modalStore.state.mainMenu.visible);
    const playerProfile = computed(() => modalStore.state.playerProfile);
    
    const isConnectionReady = computed(
      () =>
        serverStatusStore.state.connectionState === 'connected' &&
        !serverStatusStore.state.isWakingUp
    );

    return () => h('div', { id: 'vue-app' }, [
      h(ServerStatusOverlay, {
        status: serverStatusStore.state.connectionState,
        wakingUp: serverStatusStore.state.isWakingUp,
        message: serverStatusStore.state.statusMessage,
      }),
      isConnectionReady.value ? h(AuthOverlay) : null,
      isConnectionReady.value ? h(Teleport, { to: '#hud-root' }, [h(GameHud)]) : null,
      isConnectionReady.value ? h(Teleport, { to: '#toolbar-root' }, [h(GameToolbar)]) : null,
      isConnectionReady.value && showMainMenu.value ? h(MainMenuLayout) : null,
      isConnectionReady.value && showGameResult.value ? h(GameResultOverlay) : null,
      isConnectionReady.value && showHeroSelection.value ? h(HeroSelectionModal) : null,
      isConnectionReady.value && showAchievements.value ? h(AchievementsPage) : null,
      isConnectionReady.value && showHeroUpgrade.value ? h(HeroUpgradePanel, { onClose: () => modalStore.hideHeroUpgrade() }) : null,
      isConnectionReady.value && playerProfile.value.visible ? h(PlayerProfileModal, { 
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
