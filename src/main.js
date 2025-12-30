// IMPORTANT: Initialiser Vue AVANT Phaser pour éviter les conflits
import "./vue/app.js";

import { MainMenuScene } from "./scenes/MainMenuScene.js";
import { ChapterScene } from "./scenes/ChapterScene.js";
import { MapScene } from "./scenes/MapScene.js";
import { GameScene } from "./scenes/GameScene.js";
import { AchievementsScene } from "./scenes/AchievementsScene.js";
import { CONFIG } from "./config/settings.js";
import { setupAuthOverlay } from "./services/authOverlay.js";
import { ensureProfileLoaded } from "./services/authManager.js";

function isMobileDevice() {
  const ua = (navigator.userAgent || navigator.vendor || "").toLowerCase();
  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const smallViewport = Math.min(window.innerWidth, window.innerHeight) < 900;
  const mobileRegex = /android|iphone|ipad|ipod|mobile|blackberry|iemobile|opera mini/i;
  return mobileRegex.test(ua) || (hasTouch && smallViewport);
}

function showMobileBlockOverlay() {
  const warning = document.getElementById("orientation-warning");
  if (warning) {
    warning.classList.remove("hidden");
  }
  const gameContainer = document.getElementById("game-container");
  if (gameContainer) {
    gameContainer.classList.add("blocked");
  }
  document.body?.classList.add("mobile-blocked");
}

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

const isMobileBlocked = isMobileDevice();

if (isMobileBlocked) {
  showMobileBlockOverlay();
} else {
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
     // Replace the problematic block in handleResize() with this:
function handleResize() {
  // Get current window dimensions
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Manually tell Phaser to resize the canvas
  game.scale.resize(width, height);
  
  // Notify the active GameScene
  if (game.scene.isActive("GameScene")) {
    const scene = game.scene.getScene("GameScene");
    if (scene && typeof scene.handleResize === 'function') {
      scene.handleResize();
    }
  }
}

      window.addEventListener("resize", handleResize);
      window.addEventListener("orientationchange", () => {
        setTimeout(handleResize, 100);
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
}
