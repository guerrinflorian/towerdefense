import { CONFIG } from "../../../config/settings.js";

export class DragHandler {
  constructor(scene, uiManager) {
    this.scene = scene;
    this.uiManager = uiManager;
    this.draggingTurret = null;
    this.placementPreview = null;
    this.validCellsPreview = [];
  }

  startDrag(turretConfig) {
    if (!turretConfig || !this.scene.scene || !this.scene.scene.isActive())
      return;

    this.draggingTurret = turretConfig;

    if (this.placementPreview && this.placementPreview.active !== false) {
      try {
        this.placementPreview.destroy();
      } catch (e) {}
    }

    try {
      const preview = this.scene.add.graphics();
      preview.fillStyle(turretConfig.color || 0x888888, 0.6);
      preview.fillCircle(0, 0, 20 * this.scene.scaleFactor);
      preview.lineStyle(2, turretConfig.color || 0x888888);
      preview.strokeCircle(0, 0, 20 * this.scene.scaleFactor);
      preview.setDepth(200);
      this.placementPreview = preview;

      this.showValidPlacementCells();
    } catch (e) {
      console.warn("Erreur lors du démarrage du drag:", e);
      this.draggingTurret = null;
    }
  }

  update() {
    if (this.draggingTurret) {
      this.updatePlacementPreview();
    }
  }

  updatePlacementPreview() {
    if (!this.placementPreview || !this.draggingTurret) {
      if (!this.placementPreview && this.draggingTurret) {
        this.draggingTurret = null;
      }
      return;
    }

    if (this.placementPreview.active === false) {
      this.draggingTurret = null;
      this.placementPreview = null;
      return;
    }

    try {
      const pointer = this.scene.input.activePointer;
      if (!pointer) return;

      const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;

      this.placementPreview.setPosition(pointer.worldX, pointer.worldY);

      const tx = Math.floor((pointer.worldX - this.scene.mapStartX) / T);
      const ty = Math.floor((pointer.worldY - this.scene.mapStartY) / T);

      let canPlace = false;
      if (
        tx >= 0 &&
        tx < 15 &&
        ty >= 0 &&
        ty < 15 &&
        this.scene.levelConfig &&
        this.scene.levelConfig.map
      ) {
        const tileType = this.scene.levelConfig.map[ty][tx];
        if (tileType === 0 || tileType === 6 || tileType === 10 || tileType === 12) {
          const hasTree =
            this.scene.mapManager && this.scene.mapManager.hasTree
              ? this.scene.mapManager.hasTree(tx, ty)
              : false;
          if (!hasTree) {
            if (this.draggingTurret.key === "barracks") {
              canPlace =
                this.scene.mapManager && this.scene.mapManager.isAdjacentToPath
                  ? this.scene.mapManager.isAdjacentToPath(tx, ty) &&
                    this.scene.money >= this.draggingTurret.cost
                  : false;
            } else {
              canPlace = this.scene.money >= this.draggingTurret.cost;
            }
          }
        }
      }

      this.placementPreview.clear();
      const color = canPlace ? 0x00ff00 : 0xff0000;
      this.placementPreview.fillStyle(color, 0.4);
      this.placementPreview.fillCircle(0, 0, 20 * this.scene.scaleFactor);
      this.placementPreview.lineStyle(2, color);
      this.placementPreview.strokeCircle(0, 0, 20 * this.scene.scaleFactor);
    } catch (e) {
      console.warn("Erreur lors de la mise à jour du preview:", e);
      this.draggingTurret = null;
      if (this.placementPreview && this.placementPreview.active !== false) {
        try {
          this.placementPreview.destroy();
        } catch (e2) {}
      }
      this.placementPreview = null;
    }
  }

  showValidPlacementCells() {
    if (this.validCellsPreview) {
      this.validCellsPreview.forEach((cell) => cell.destroy());
      this.validCellsPreview = [];
    } else {
      this.validCellsPreview = [];
    }

    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;

    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 15; x++) {
        const tileType = this.scene.levelConfig.map[y][x];
        if (tileType === 0 || tileType === 6 || tileType === 10 || tileType === 12) {
          const hasTree = this.scene.mapManager.hasTree(x, y);
          if (!hasTree) {
            let canPlace = false;
            if (this.draggingTurret.key === "barracks") {
              canPlace =
                this.scene.mapManager.isAdjacentToPath(x, y) &&
                this.scene.money >= this.draggingTurret.cost;
            } else {
              canPlace = this.scene.money >= this.draggingTurret.cost;
            }

            if (canPlace) {
              const px = this.scene.mapStartX + x * T + T / 2;
              const py = this.scene.mapStartY + y * T + T / 2;
              const cell = this.scene.add.rectangle(
                px,
                py,
                T - 4,
                T - 4,
                0x00ff00,
                0.2
              );
              cell.setStrokeStyle(2, 0x00ff00, 0.5);
              cell.setDepth(1);
              this.validCellsPreview.push(cell);
            }
          }
        }
      }
    }
  }

  placeDraggedTurret(pointer) {
    if (!this.draggingTurret) return;

    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;

    const tx = Math.floor((pointer.worldX - this.scene.mapStartX) / T);
    const ty = Math.floor((pointer.worldY - this.scene.mapStartY) / T);

    if (tx >= 0 && tx < 15 && ty >= 0 && ty < 15) {
      const tileType = this.scene.levelConfig.map[ty][tx];
      if (tileType === 0 || tileType === 6 || tileType === 10 || tileType === 12) {
        const hasTree = this.scene.mapManager.hasTree(tx, ty);
        if (!hasTree) {
          const success = this.scene.buildTurret(this.draggingTurret, tx, ty);
          if (success) {
            this.cancelDrag();
            this.uiManager.updateToolbarCounts();
          }
        } else {
          this.scene.cameras.main.shake(50, 0.005);
        }
      }
    }
  }

  cancelDrag() {
    this.draggingTurret = null;

    if (this.placementPreview) {
      this.placementPreview.destroy();
      this.placementPreview = null;
    }

    if (this.validCellsPreview) {
      this.validCellsPreview.forEach((cell) => cell.destroy());
      this.validCellsPreview = [];
    }
  }
}
