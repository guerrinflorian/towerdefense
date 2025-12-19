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
  }

  setUIManager(uiManager) {
    this.uiManager = uiManager;
    this.dragHandler.uiManager = uiManager;
  }

  setupInputHandlers() {
    this.scene.input.on("pointermove", (pointer) => {
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
        this.longPressTimer = this.scene.time.delayedCall(
          this.longPressDelay,
          () => {
            this.handleRightClick(pointer);
          }
        );
      }
    });

    this.scene.input.on("pointerup", (pointer) => {
      if (this.longPressTimer) {
        this.longPressTimer.remove();
        this.longPressTimer = null;
        if (
          !this.dragHandler.draggingTurret &&
          !this.isPointerOnToolbar(pointer)
        ) {
          this.handleNormalClick(pointer);
        }
      }

      if (
        this.dragHandler.draggingTurret &&
        pointer.leftButtonReleased() &&
        !this.isPointerOnToolbar(pointer)
      ) {
        this.dragHandler.placeDraggedTurret(pointer);
      }

      if (
        this.spellManager.isPlacingSpell() &&
        pointer.leftButtonReleased() &&
        !this.isPointerOnToolbar(pointer)
      ) {
        this.spellManager.placeLightning(pointer.worldX, pointer.worldY);
      }

      if (
        this.spellManager.isPlacingSpell() &&
        pointer.rightButtonReleased()
      ) {
        this.spellManager.cancelSpellPlacement();
      }
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
      this.uiManager.openUpgradeMenu(pointer, clickedTurret);
      return;
    }

    const tileType = this.scene.levelConfig.map[ty][tx];
    if (tileType !== 0 && tileType !== 6) {
      return;
    }

    if (this.scene.mapManager.hasTree(tx, ty)) {
      this.uiManager.openTreeRemovalConfirmation(pointer, tx, ty);
      return;
    }

    this.uiManager.openBuildMenu(pointer);
  }

  handleNormalClick(pointer) {}

  isPointerOnToolbar(pointer) {
    return this.uiManager.isPointerOnToolbar(pointer);
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
}
