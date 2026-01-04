<template>
  <!-- Scene rendered via Phaser; component placeholder for Vue tooling -->
  <div class="scene-wrapper" aria-hidden="true"></div>
</template>

<script>
import {
  ensureProfileLoaded,
  getHeroStats,
  isAuthenticated,
  logout,
} from "../services/authManager.js";
import { showAuth } from "../services/authOverlay.js";
import {
  hideMainMenu,
  showHeroUpgrade,
  showMainMenu,
} from "../vue/bridge.js";

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenuScene");
    this.background = null;
  }

  preload() {
    const backgroundUrl = new URL("../images/background.jpg", import.meta.url)
      .href;
    this.load.image("menu-background", backgroundUrl);
  }

  create() {
    const { width, height } = this.scale;
    this.addBackground(width, height);

    this.registerResize();
    this.events.once("shutdown", () => {
      this.unregisterResize();
      hideMainMenu();
    });

    // Charger le profil avant d'afficher les composants Vue
    ensureProfileLoaded()
      .catch(() => {
        if (!isAuthenticated()) {
          showAuth();
        }
      })
      .finally(() => {
        this.openMainMenuOverlay();
      });
  }

  openMainMenuOverlay() {
    showMainMenu({
      onStartLevel: ({ levelId, levelName }) => {
        hideMainMenu();
        this.scene.start("GameScene", {
          level: levelId,
          levelName,
          heroStats: getHeroStats(),
        });
      },
      onLogout: async () => {
        logout();
        showAuth();
      },
      onShowHeroUpgrade: () => {
        showHeroUpgrade();
      },
    });
  }

  addBackground(width, height) {
    this.cameras.main.setBackgroundColor("#010409");
    if (this.background) {
      this.background.destroy();
    }
    if (this.textures.exists("menu-background")) {
      this.background = this.add
        .image(width / 2, height / 2, "menu-background")
        .setOrigin(0.5)
        .setDepth(-10)
        .setAlpha(0.25);
      const scale = Math.max(
        width / this.background.width,
        height / this.background.height
      );
      this.background.setScale(scale);
    }
  }

  registerResize() {
    this.scale.on("resize", this.handleResize, this);
  }

  unregisterResize() {
    this.scale.off("resize", this.handleResize, this);
  }

  handleResize(gameSize) {
    const { width, height } = gameSize;
    this.cameras.main.setSize(width, height);
    this.addBackground(width, height);
  }
}

export default {
  name: "MainMenuSceneView",
  scene: MainMenuScene,
};
</script>
