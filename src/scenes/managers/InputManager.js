import { CONFIG } from "../../config/settings.js";
import { DragHandler } from "./input/DragHandler.js";

export class InputManager {
  constructor(scene, spellManager, uiManager) {
    this.scene = scene;
    this.spellManager = spellManager;
    this.uiManager = uiManager;
    this.dragHandler = new DragHandler(scene, uiManager);
    this.tileHighlight = null;
    this.longPressTimer = null;
    this.longPressDelay = 500;
    this.longPressTriggered = false;
    this.hero = null;
    // Ignorer les clics pendant les 500ms après le démarrage de la scène
    // pour éviter que le clic sur l'île dans MapScene déclenche un déplacement du héros
    this.ignoreInputUntil = 0;
    this.ignoreFirstPointerUp = false;
    this.pointerDownOnBuildMenu = false;
  }

  setUIManager(uiManager) {
    this.uiManager = uiManager;
    this.dragHandler.uiManager = uiManager;
  }

  setHero(hero) {
    this.hero = hero;
  }

  setupInputHandlers() {
    // Vérifier si le pointer est déjà enfoncé (venant de MapScene)
    const activePointer = this.scene.input.activePointer;
    if (activePointer && activePointer.isDown) {
      this.ignoreFirstPointerUp = true;
      this.ignoreInputUntil = this.scene.time.now + 500;
    } else {
      this.ignoreInputUntil = this.scene.time.now + 300;
    }

    this.scene.input.on("pointermove", (pointer) => {
      // Vérifier si le pointeur est sur un bouton de vague
      if (this.scene.spawnControls) {
        const hitButton = this.scene.spawnControls.icons.some(icon => {
          if (!icon.container || !icon.container.input || !icon.container.active) return false;
          
          // Obtenir les coordonnées mondiales du container
          let containerWorldX, containerWorldY;
          if (icon.container.getWorldTransformMatrix) {
            const matrix = icon.container.getWorldTransformMatrix();
            containerWorldX = matrix.tx;
            containerWorldY = matrix.ty;
          } else {
            containerWorldX = icon.container.x;
            containerWorldY = icon.container.y;
          }
          
          // Calculer les coordonnées locales
          const localX = pointer.worldX - containerWorldX;
          const localY = pointer.worldY - containerWorldY;
          
          // Utiliser la taille définie par setSize pour vérifier si on est dans la zone
          const hitSize = icon.size * 2.2;
          const halfSize = hitSize / 2;
          
          // Vérifier si on est dans le rectangle centré
          return localX >= -halfSize && localX <= halfSize && 
                 localY >= -halfSize && localY <= halfSize;
        });
        
        if (hitButton) {
          // Si on est sur un bouton, ne pas afficher le highlight de tuile
          if (this.tileHighlight) {
            this.tileHighlight.setVisible(false);
          }
          return;
        }
      }

      const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;

      if (
        pointer.worldY < this.scene.mapStartY ||
        pointer.worldY > this.scene.mapStartY + 15 * T ||
        pointer.worldX < this.scene.mapStartX ||
        pointer.worldX > this.scene.mapStartX + 15 * T
      ) {
        if (this.tileHighlight) {
          this.tileHighlight.setVisible(false);
        }
        return;
      }

      const tx = Math.floor((pointer.worldX - this.scene.mapStartX) / T);
      const ty = Math.floor((pointer.worldY - this.scene.mapStartY) / T);

      if (tx < 0 || tx >= 15 || ty < 0 || ty >= 15) {
        if (this.tileHighlight) {
          this.tileHighlight.setVisible(false);
        }
        return;
      }

      if (!this.tileHighlight) {
        this.tileHighlight = this.scene.add.graphics();
        this.tileHighlight.setDepth(1);
      }

      const px = this.scene.mapStartX + tx * T;
      const py = this.scene.mapStartY + ty * T;

      this.tileHighlight.clear();
      this.tileHighlight.lineStyle(2, 0xffffff, 0.3);
      this.tileHighlight.strokeRect(px, py, T, T);
      this.tileHighlight.setVisible(true);
    });

    this.scene.input.on("pointerdown", (pointer) => {
      if (this.scene.isPaused) {
        return;
      }

      // Vérifier si le clic est sur un bouton de spawn avant de faire autre chose
      if (this.isPointerOnSpawnButton(pointer)) {
        return; // Laisser le bouton gérer son propre événement
      }

      if (this.uiManager.isPointerOnBuildMenu(pointer)) {
        this.pointerDownOnBuildMenu = true;
        return;
      }
      this.pointerDownOnBuildMenu = false;

      this.uiManager.hideMenus();
      this.scene.selectedTurret = null;

      if (this.isPointerOnToolbar(pointer)) {
        return;
      }

      if (this.dragHandler.draggingTurret) {
        if (pointer.rightButtonDown()) {
          this.cancelDrag();
        }
        return;
      }

      if (pointer.rightButtonDown()) {
        this.handleRightClick(pointer);
      } else if (pointer.isDown) {
        this.longPressTriggered = false;
        this.longPressTimer = this.scene.time.delayedCall(
          this.longPressDelay,
          () => {
            this.longPressTriggered = true;
            this.handleRightClick(pointer);
          }
        );
      }
    });

    this.scene.input.on("pointerup", (pointer) => {
      // Ignorer le premier pointerup si le pointer était déjà enfoncé au démarrage
      if (this.ignoreFirstPointerUp) {
        this.ignoreFirstPointerUp = false;
        if (this.longPressTimer) {
          this.longPressTimer.remove();
          this.longPressTimer = null;
        }
        this.longPressTriggered = false;
        return;
      }

      const startedOnBuildMenu = this.pointerDownOnBuildMenu;
      this.pointerDownOnBuildMenu = false;

      if (startedOnBuildMenu) {
        if (this.longPressTimer) {
          this.longPressTimer.remove();
          this.longPressTimer = null;
        }
        this.longPressTriggered = false;
        return;
      }

      if (this.uiManager.isPointerOnBuildMenu(pointer)) {
        if (this.longPressTimer) {
          this.longPressTimer.remove();
          this.longPressTimer = null;
        }
        this.longPressTriggered = false;
        return;
      }

      const isOnToolbar = this.isPointerOnToolbar(pointer);
      const isOnMap = this.isPointerInsideMap(pointer);

      if (this.longPressTimer) {
        this.longPressTimer.remove();
        this.longPressTimer = null;
      }

      if (this.dragHandler.draggingTurret) {
        if (isOnToolbar || !isOnMap) {
          this.cancelDrag();
        } else {
          const placed = this.dragHandler.placeDraggedTurret(pointer);
          if (!placed) {
            this.cancelDrag();
          }
        }
        this.longPressTriggered = false;
        return;
      }

      if (this.spellManager.isPlacingSpell()) {
        if (pointer.rightButtonReleased && pointer.rightButtonReleased()) {
          this.spellManager.cancelSpellPlacement();
          this.longPressTriggered = false;
          return;
        }

        if (isOnToolbar || !isOnMap) {
          this.spellManager.cancelSpellPlacement();
        } else {
          this.spellManager.placeLightning(pointer.worldX, pointer.worldY);
        }
        this.longPressTriggered = false;
        return;
      }

      if (this.isPointerOnSpawnButton(pointer)) {
        this.longPressTriggered = false;
        return;
      }

      if (!this.longPressTriggered && !isOnToolbar) {
        this.handleNormalClick(pointer);
      }

      this.longPressTriggered = false;
    });

    this.scene.input.keyboard.on("keydown-ESC", () => {
      if (this.spellManager.isPlacingSpell()) {
        this.spellManager.cancelSpellPlacement();
      } else {
        this.cancelDrag();
      }
    });
  }

  handleRightClick(pointer) {
    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;

    if (
      pointer.worldY < this.scene.mapStartY ||
      pointer.worldY > this.scene.mapStartY + 15 * T ||
      pointer.worldX < this.scene.mapStartX ||
      pointer.worldX > this.scene.mapStartX + 15 * T
    ) {
      return;
    }

    const tx = Math.floor((pointer.worldX - this.scene.mapStartX) / T);
    const ty = Math.floor((pointer.worldY - this.scene.mapStartY) / T);

    if (tx < 0 || tx >= 15 || ty < 0 || ty >= 15) return;

    let clickedTurret = null;
    for (const t of this.scene.turrets) {
      const turretTx = Math.floor((t.x - this.scene.mapStartX) / T);
      const turretTy = Math.floor((t.y - this.scene.mapStartY) / T);
      if (turretTx === tx && turretTy === ty) {
        clickedTurret = t;
        break;
      }
    }
    if (!clickedTurret) {
      for (const b of this.scene.barracks) {
        const barracksTx = Math.floor((b.x - this.scene.mapStartX) / T);
        const barracksTy = Math.floor((b.y - this.scene.mapStartY) / T);
        if (barracksTx === tx && barracksTy === ty) {
          clickedTurret = b;
          break;
        }
      }
    }

    if (clickedTurret) {
      if (clickedTurret.isCursed) {
        const removed = clickedTurret.removeCurse(true);
        if (removed) {
          const txt = this.scene.add
            .text(clickedTurret.x, clickedTurret.y - 50, "Réparée !", {
              fontSize: "16px",
              color: "#ffddaa",
              backgroundColor: "rgba(0,0,0,0.7)",
              padding: { x: 6, y: 3 },
            })
            .setOrigin(0.5)
            .setDepth(2400);
          this.scene.tweens.add({
            targets: txt,
            y: txt.y - 25,
            alpha: 0,
            duration: 700,
            onComplete: () => txt.destroy(),
          });
        }
        return;
      }
      this.uiManager.openUpgradeMenu(pointer, clickedTurret);
      return;
    }

    const tileType = this.scene.levelConfig.map[ty][tx];

    if (tileType !== 0 && tileType !== 6 && tileType !== 10 && tileType !== 12 && tileType !== 16) {
      return;
    }

    if (this.scene.mapManager.hasTree(tx, ty)) {
      this.uiManager.openTreeRemovalConfirmation(pointer, tx, ty);
      return;
    }

    this.uiManager.openBuildMenu(pointer);
  }

  handleNormalClick(pointer) {
    // Ignorer les clics qui arrivent juste après le démarrage de la scène
    // pour éviter que le clic sur l'île dans MapScene déclenche un déplacement du héros
    if (this.scene.time.now < this.ignoreInputUntil) {
      return;
    }

    // Ne pas déplacer le héros si on est en train de placer un sort
    if (this.spellManager && this.spellManager.isPlacingSpell()) {
      return;
    }

    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;

    if (
      pointer.worldY < this.scene.mapStartY ||
      pointer.worldY > this.scene.mapStartY + 15 * T ||
      pointer.worldX < this.scene.mapStartX ||
      pointer.worldX > this.scene.mapStartX + 15 * T
    ) {
      return;
    }

    const tx = Math.floor((pointer.worldX - this.scene.mapStartX) / T);
    const ty = Math.floor((pointer.worldY - this.scene.mapStartY) / T);

    if (tx < 0 || tx >= 15 || ty < 0 || ty >= 15) return;

    const tileType = this.scene.levelConfig.map[ty][tx];

    // Commande du héros par clic gauche sur un chemin
    if (this.hero && this.isPathTile(tileType)) {
      this.hero.setDestination(tx, ty);
      return;
    }
  }

  isPointerOnToolbar(pointer) {
    return this.uiManager.isPointerOnToolbar(pointer);
  }

  isPointerOnSpawnButton(pointer) {
    if (!this.scene.spawnControls || !this.scene.spawnControls.icons) {
      return false;
    }
    
    return this.scene.spawnControls.icons.some(icon => {
      if (!icon.container || !icon.container.input || !icon.container.active) {
        return false;
      }
      
      // Obtenir les coordonnées mondiales du container
      let containerWorldX, containerWorldY;
      if (icon.container.getWorldTransformMatrix) {
        const matrix = icon.container.getWorldTransformMatrix();
        containerWorldX = matrix.tx;
        containerWorldY = matrix.ty;
      } else {
        containerWorldX = icon.container.x;
        containerWorldY = icon.container.y;
      }
      
      // Calculer les coordonnées locales
      const localX = pointer.worldX - containerWorldX;
      const localY = pointer.worldY - containerWorldY;
      
      // Utiliser la taille définie par setSize pour vérifier si on est dans la zone
      const hitSize = icon.size * 2.2;
      const halfSize = hitSize / 2;
      
      // Vérifier si on est dans le rectangle centré
      return localX >= -halfSize && localX <= halfSize && 
             localY >= -halfSize && localY <= halfSize;
    });
  }

  startDrag(turretConfig) {
    this.dragHandler.startDrag(turretConfig);
  }

  update() {
    this.dragHandler.update();
  }

  cancelDrag() {
    this.dragHandler.cancelDrag();
  }

  isPointerInsideMap(pointer) {
    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;
    return !(
      pointer.worldY < this.scene.mapStartY ||
      pointer.worldY > this.scene.mapStartY + 15 * T ||
      pointer.worldX < this.scene.mapStartX ||
      pointer.worldX > this.scene.mapStartX + 15 * T
    );
  }

  isPathTile(tileType) {
    return tileType === 1 || tileType === 4 || tileType === 7 || tileType === 13 || tileType === 14;
  }
}
