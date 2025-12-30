import { CONFIG } from "../config/settings.js";
import { setupAuthOverlay } from "../services/authOverlay.js";
import { ensureProfileLoaded, flushPendingUpgrades } from "../services/authManager.js";

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

function buildConfig(scenes) {
  return {
    type: Phaser.AUTO,
    parent: "game-container",
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: "#000000",
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
    scene: scenes,
    physics: {
      default: "arcade",
      arcade: { debug: false },
    },
  };
}

function bindResize(game) {
  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    game.scale.resize(width, height);

    game.scene.getScenes(true).forEach((scene) => {
      if (typeof scene.handleResize === "function") {
        scene.handleResize();
      }
    });
  };

  const handleOrientation = () => setTimeout(handleResize, 100);

  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", handleOrientation);

  return () => {
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("orientationchange", handleOrientation);
  };
}

async function bindBeforeUnload() {
  window.addEventListener("beforeunload", async () => {
    await flushPendingUpgrades();
  });
}

export async function launchPhaserPage(scenes = []) {
  if (isMobileDevice()) {
    showMobileBlockOverlay();
    return null;
  }

  setupAuthOverlay();

  let game = null;

  await ensureProfileLoaded().catch(() => {
    // Overlay gère la reconnexion
  });

  game = new Phaser.Game(buildConfig(scenes));

  window.game = game;
  game.baseWidth = CONFIG.GAME_WIDTH;
  game.baseHeight = CONFIG.GAME_HEIGHT;

  bindResize(game);
  bindBeforeUnload();

  // Empêche le double-tap zoom sur mobile
  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    (event) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    false
  );

  return game;
}
