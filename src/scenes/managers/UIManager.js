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
    this.scene.inputManager?.dragHandler?.hideTileRangePreview();
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
    if (this.isPointerOnBuildMenu(pointer)) {
      return true;
    }
    return this.buildToolbar?.isPointerOnToolbar(pointer) || false;
  }

  isPointerOnBuildMenu(pointer) {
    if (!this.scene.buildMenu || !this.scene.buildMenu.visible) {
      return false;
    }
    
    // Vérifier si le clic est réellement sur un bouton interactif du menu
    // plutôt que juste dans la zone rectangulaire du menu
    const px = pointer.worldX ?? pointer.x;
    const py = pointer.worldY ?? pointer.y;
    
    // Parcourir tous les enfants du menu pour voir si le clic est sur un élément interactif
    if (this.scene.buildMenu && this.scene.buildMenu.list) {
      for (const child of this.scene.buildMenu.list) {
        if (child && child.input && child.input.enabled) {
          // Vérifier si le clic est sur cet élément interactif
          if (child.input.hitArea) {
            // Obtenir les coordonnées mondiales de l'enfant
            let childWorldX, childWorldY;
            if (child.getWorldTransformMatrix) {
              const matrix = child.getWorldTransformMatrix();
              childWorldX = matrix.tx;
              childWorldY = matrix.ty;
            } else {
              // Calculer les coordonnées mondiales en ajoutant la position du parent
              let menuWorldX, menuWorldY;
              if (this.scene.buildMenu.getWorldTransformMatrix) {
                const menuMatrix = this.scene.buildMenu.getWorldTransformMatrix();
                menuWorldX = menuMatrix.tx;
                menuWorldY = menuMatrix.ty;
              } else {
                menuWorldX = this.scene.buildMenu.x;
                menuWorldY = this.scene.buildMenu.y;
              }
              childWorldX = menuWorldX + (child.x || 0);
              childWorldY = menuWorldY + (child.y || 0);
            }
            
            // Vérifier si le clic est dans la zone de hit de l'enfant
            // Pour les boutons octagonaux, on utilise une zone circulaire approximative
            const hitRadius = 40 * (this.scene.scaleFactor || 1);
            const dist = Math.sqrt(
              Math.pow(px - childWorldX, 2) + Math.pow(py - childWorldY, 2)
            );
            
            if (dist <= hitRadius) {
              return true;
            }
          }
        }
      }
    }
    
    // Si aucun bouton interactif n'a été touché, considérer que le clic n'est pas sur le menu
    return false;
  }
}
