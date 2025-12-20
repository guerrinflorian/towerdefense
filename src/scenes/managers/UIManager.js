import { LEVELS_CONFIG } from "../../config/levels/index.js";
import { BuildMenu } from "./ui/components/BuildMenu.js";
import { BuildToolbar } from "./ui/components/BuildToolbar.js";
import { HUD } from "./ui/components/HUD.js";
import { TreeMenu } from "./ui/components/TreeMenu.js";
import { UpgradeMenu } from "./ui/components/UpgradeMenu.js";

export class UIManager {
  constructor(scene, spellManager, inputManager) {
    this.scene = scene;
    this.spellManager = spellManager;
    this.inputManager = inputManager;
    this.hud = null;
    this.buildToolbar = null;
    this.buildMenu = null;
    this.upgradeMenu = null;
    this.treeMenu = null;

    this.scene.upgradeTextLines = [];
    this.buildButtons = [];
  }

  createUI() {
    this.hud = new HUD(this.scene);
    this.hud.create();

    this.buildToolbar = new BuildToolbar(
      this.scene,
      this.spellManager,
      this.inputManager
    );
    this.buildToolbar.create();

    this.buildMenu = new BuildMenu(this.scene);
    this.buildMenu.create();

    this.upgradeMenu = new UpgradeMenu(this.scene);
    this.upgradeMenu.create();

    this.treeMenu = new TreeMenu(this.scene);
  }

  updateUI() {
    const wavesStarted = this.scene.currentWaveIndex || 0;
    const wavesCompleted = this.scene.wavesCompleted || 0;
    let currentWave = wavesCompleted + 1;
    if (this.scene.isWaveRunning) {
      currentWave = Math.max(currentWave, wavesStarted);
    }
    let totalWaves = 0;

    // Essayer d'abord avec levelConfig
    if (this.scene.levelConfig && this.scene.levelConfig.waves && Array.isArray(this.scene.levelConfig.waves)) {
      totalWaves = this.scene.levelConfig.waves.length;
    } else {
      // Fallback: chercher dans LEVELS_CONFIG
      const levelData = LEVELS_CONFIG.find((l) => l.id === this.scene.levelID);
      if (levelData && levelData.data && levelData.data.waves && Array.isArray(levelData.data.waves)) {
        totalWaves = levelData.data.waves.length;
      } else {
        // Fallback final selon le levelID
    if (this.scene.levelID === 3) {
          totalWaves = 10;
        } else if (this.scene.levelID === 2) {
          totalWaves = 8;
        } else {
          totalWaves = 6; // Level 1 par défaut
        }
      }
    }

    // S'assurer que totalWaves est au moins 1
    if (totalWaves < 1) {
      totalWaves = 1;
    }
    currentWave = Math.min(currentWave, totalWaves);

    if (this.hud) {
      this.hud.update(this.scene.money, this.scene.lives, currentWave, totalWaves);
      this.hud.updateTimer(this.scene.elapsedTimeMs || 0);
    }

    this.updateToolbarCounts();
    if (this.buildMenu && this.scene.buildMenu && this.scene.buildMenu.visible) {
      this.buildMenu.updateBuildMenuButtons();
    }
    if (
      this.upgradeMenu &&
      this.scene.upgradeMenu &&
      this.scene.upgradeMenu.visible
    ) {
      this.upgradeMenu.updateUpgradeButtonState();
    }
  }

  updateToolbarCounts() {
    if (this.buildToolbar) {
      this.buildToolbar.updateToolbarCounts();
    }
  }

  updateTimer(elapsedMs) {
    if (this.hud) {
      this.hud.updateTimer(elapsedMs);
    }
  }

  hideMenus() {
    if (this.scene.buildMenu) {
      this.scene.buildMenu.setVisible(false);
    }
    if (this.scene.upgradeMenu) {
      this.scene.upgradeMenu.setVisible(false);
    }
    if (this.scene.treeRemovalMenu) {
      this.scene.treeRemovalMenu.setVisible(false);
    }
  }

  openBuildMenu(pointer) {
    this.buildMenu?.openBuildMenu(pointer);
  }

  openUpgradeMenu(pointer, turret) {
    this.upgradeMenu?.openUpgradeMenu(pointer, turret);
  }

  openTreeRemovalConfirmation(pointer, tx, ty) {
    this.treeMenu?.openTreeRemovalConfirmation(pointer, tx, ty);
  }

  isPointerOnToolbar(pointer) {
    return this.buildToolbar?.isPointerOnToolbar(pointer) || false;
  }
}
