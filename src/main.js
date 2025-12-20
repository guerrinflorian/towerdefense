import { MainMenuScene } from "./scenes/MainMenuScene.js";
import { MapScene } from "./scenes/MapScene.js";
import { GameScene } from "./scenes/GameScene.js";
import { CONFIG } from "./config/settings.js";
import { setupAuthOverlay } from "./services/authOverlay.js";
import { ensureProfileLoaded } from "./services/authManager.js";

const config = {
  type: Phaser.AUTO,
  parent: "game-container",

  // Utiliser la taille de la fenêtre pour remplir tout l'écran
  width: window.innerWidth,
  height: window.innerHeight,

  backgroundColor: "#000000",

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

  scene: [MainMenuScene, MapScene, GameScene],
  
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
};

setupAuthOverlay();

let game = null;

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
      // Notifier la scène active sans jamais la redémarrer
      if (game.scene.isActive("GameScene")) {
        const scene = game.scene.getScene("GameScene");
        if (scene && scene.handleResize) {
          scene.handleResize();
        }
      }
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", () => {
      setTimeout(handleResize, 100);
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
