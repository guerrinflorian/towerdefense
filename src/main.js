// IMPORTANT: Initialiser Vue AVANT Phaser pour éviter les conflits
import "./vue/app.js";

import MainMenuSceneView from "./scenes/MainMenuScene.vue";
import ChapterSceneView from "./scenes/ChapterScene.vue";
import MapSceneView from "./scenes/MapScene.vue";
import GameSceneView from "./scenes/GameScene.vue";
import { AchievementsScene } from "./scenes/AchievementsScene.js";
import { CONFIG } from "./config/settings.js";
import { setupAuthOverlay } from "./services/authOverlay.js";
import { ensureProfileLoaded } from "./services/authManager.js";

const MainMenuScene = MainMenuSceneView.scene;
const ChapterScene = ChapterSceneView.scene;
const MapScene = MapSceneView.scene;
const GameScene = GameSceneView.scene;

const config = {
  type: Phaser.AUTO,
  parent: "game-container",

  // Utiliser la taille de la fenêtre pour remplir tout l'écran
  width: window.innerWidth,
  height: window.innerHeight,

  backgroundColor: "#000000",

  // Améliorer la qualité du rendu en utilisant la résolution de l'écran
  resolution: window.devicePixelRatio || 1,

  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  fps: {
    target: 60,
    min: 30,
    forceSetTimeOut: true,
    pauseOnBlur: false,
    pauseOnHidden: false,
  },

  input: { 
    activePointers: 3,
    smoothFactor: 0,
  },

  scene: [MainMenuScene, AchievementsScene, ChapterScene, MapScene, GameScene],
  
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
};

setupAuthOverlay();

let game = null;

function notifyScenesOfResize(gameInstance) {
  const scenes = ["GameScene", "MapScene", "MainMenuScene", "ChapterScene"];
  scenes.forEach((key) => {
    if (gameInstance.scene.isActive(key)) {
      const scene = gameInstance.scene.getScene(key);
      if (scene && typeof scene.handleResize === "function") {
        scene.handleResize();
      } else if (scene && typeof scene.applyResponsiveLayout === "function") {
        scene.applyResponsiveLayout();
      }
    }
  });
}

ensureProfileLoaded()
  .catch(() => {
    // L'overlay demandera une reconnexion si besoin
  })
  .finally(() => {
    game = new Phaser.Game(config);

    // Forcer le retour sur le menu principal au démarrage,
    // même si une autre scène était active (HMR / rechargement).
    const sceneManager = game.scene;
    if (sceneManager && !sceneManager.isActive("MainMenuScene")) {
      sceneManager.stop("GameScene");
      sceneManager.stop("MapScene");
      sceneManager.start("MainMenuScene");
    }
    
    // Exposer game globalement pour pouvoir y accéder depuis authOverlay
    window.game = game;

    // Stocker les infos de taille dans le jeu pour y accéder depuis les scènes
    game.baseWidth = CONFIG.GAME_WIDTH;
    game.baseHeight = CONFIG.GAME_HEIGHT;

    // Gérer le redimensionnement
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      game.scale.resize(width, height);
      notifyScenesOfResize(game);
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", () => {
      setTimeout(handleResize, 120);
    });
    
    // Forcer l'envoi des améliorations en attente avant de quitter la page
    window.addEventListener("beforeunload", async () => {
      const { flushPendingUpgrades } = await import("./services/authManager.js");
      await flushPendingUpgrades();
    });
  });

// Empêcher le double-tap zoom sur mobile
let lastTouchEnd = 0;
document.addEventListener("touchend", (event) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);
