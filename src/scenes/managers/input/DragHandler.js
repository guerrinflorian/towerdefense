import { CONFIG } from "../../../config/settings.js";

export class DragHandler {
  constructor(scene, uiManager) {
    this.scene = scene;
    this.uiManager = uiManager;
    this.draggingTurret = null;
    this.placementPreview = null;
    this.rangePreview = null;
    this.validCellsPreview = [];
    this.staticPreviewActive = false;
  }

  startDrag(turretConfig) {
    if (!turretConfig || !this.scene.scene || !this.scene.scene.isActive())
      return;

    this.draggingTurret = turretConfig;
    this.staticPreviewActive = false;

    try {
      this.ensurePreviewGraphics(turretConfig);
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

      const tx = Math.floor((pointer.worldX - this.scene.mapStartX) / T);
      const ty = Math.floor((pointer.worldY - this.scene.mapStartY) / T);

      const placementData = this.getPlacementData(
        tx,
        ty,
        this.draggingTurret,
        { respectMoney: true, fallbackX: pointer.worldX, fallbackY: pointer.worldY }
      );

      this.renderPreviews(
        placementData.centerX,
        placementData.centerY,
        this.draggingTurret,
        placementData.canPlace && placementData.isInsideMap,
        placementData.isInsideMap
      );
    } catch (e) {
      console.warn("Erreur lors de la mise à jour du preview:", e);
      this.draggingTurret = null;
      this.destroyPreviews();
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
        if (tileType === 0 || tileType === 6 || tileType === 10 || tileType === 12 || tileType === 16) {
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
    if (!this.draggingTurret) return false;

    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;

    const tx = Math.floor((pointer.worldX - this.scene.mapStartX) / T);
    const ty = Math.floor((pointer.worldY - this.scene.mapStartY) / T);

    if (tx >= 0 && tx < 15 && ty >= 0 && ty < 15) {
      const tileType = this.scene.levelConfig.map[ty][tx];
      if (tileType === 0 || tileType === 6 || tileType === 10 || tileType === 12 || tileType === 16) {
        const hasTree = this.scene.mapManager.hasTree(tx, ty);
        if (!hasTree) {
          const success = this.scene.buildTurret(this.draggingTurret, tx, ty);
          if (success) {
            this.cancelDrag();
            this.uiManager.updateToolbarCounts();
            return true;
          }
        } else {
          this.scene.cameras.main.shake(50, 0.005);
        }
      }
    }

    return false;
  }

  cancelDrag() {
    this.draggingTurret = null;
    this.staticPreviewActive = false;

    this.destroyPreviews();
    this.clearValidCells();
  }

  updateRangePreview(x, y, radius, color, isInsideMap) {
    if (!this.rangePreview || this.rangePreview.active === false) {
      if (this.rangePreview && this.rangePreview.active === false) {
        this.rangePreview.destroy();
      }
      this.rangePreview = this.scene.add.graphics();
      this.rangePreview.setDepth(180);
    }

    if (!isInsideMap || !radius) {
      this.rangePreview.setVisible(false);
      this.rangePreview.clear();
      return;
    }

    this.rangePreview.clear();
    this.rangePreview.setPosition(x, y);
    this.rangePreview.lineStyle(2, color, 0.35);
    this.rangePreview.fillStyle(color, 0.08);
    this.rangePreview.strokeCircle(0, 0, radius);
    this.rangePreview.fillCircle(0, 0, radius);
    this.rangePreview.setVisible(true);
  }

  showTileRangePreview(turretConfig, tileX, tileY) {
    const data = this.getPlacementData(tileX, tileY, turretConfig, {
      respectMoney: true,
    });
    this.renderPreviews(
      data.centerX,
      data.centerY,
      turretConfig,
      data.canPlace && data.isInsideMap,
      data.isInsideMap
    );
    this.staticPreviewActive = true;
  }

  hideTileRangePreview() {
    if (this.placementPreview) {
      this.placementPreview.setVisible(false);
    }
    if (this.rangePreview) {
      this.rangePreview.setVisible(false);
    }
    this.staticPreviewActive = false;
  }

  renderPreviews(x, y, turretConfig, canPlace, isInsideMap) {
    this.ensurePreviewGraphics(turretConfig);
    const color = canPlace ? 0x00ff00 : 0xff0000;

    this.placementPreview.setPosition(x, y);
    this.placementPreview.clear();
    this.placementPreview.fillStyle(color, 0.4);
    this.placementPreview.fillCircle(0, 0, 20 * this.scene.scaleFactor);
    this.placementPreview.lineStyle(2, color);
    this.placementPreview.strokeCircle(0, 0, 20 * this.scene.scaleFactor);
    this.placementPreview.setVisible(isInsideMap);

    const rangeRadius = this.getRangePixels(turretConfig);
    this.updateRangePreview(x, y, rangeRadius, color, isInsideMap);
  }

  ensurePreviewGraphics(turretConfig) {
    if (!this.placementPreview || this.placementPreview.active === false) {
      if (this.placementPreview && this.placementPreview.active === false) {
        this.placementPreview.destroy();
      }
      const preview = this.scene.add.graphics();
      preview.fillStyle(turretConfig?.color || 0x888888, 0.6);
      preview.fillCircle(0, 0, 20 * this.scene.scaleFactor);
      preview.lineStyle(2, turretConfig?.color || 0x888888);
      preview.strokeCircle(0, 0, 20 * this.scene.scaleFactor);
      preview.setDepth(200);
      this.placementPreview = preview;
    }

    if (!this.rangePreview || this.rangePreview.active === false) {
      if (this.rangePreview && this.rangePreview.active === false) {
        this.rangePreview.destroy();
      }
      const rangePreview = this.scene.add.graphics();
      rangePreview.setDepth(180);
      rangePreview.setVisible(false);
      this.rangePreview = rangePreview;
    }
  }

  destroyPreviews() {
    if (this.placementPreview) {
      this.placementPreview.destroy();
      this.placementPreview = null;
    }
    if (this.rangePreview) {
      this.rangePreview.destroy();
      this.rangePreview = null;
    }
    this.clearValidCells();
  }

  clearValidCells() {
    if (this.validCellsPreview) {
      this.validCellsPreview.forEach((cell) => cell.destroy());
      this.validCellsPreview = [];
    }
  }

  getPlacementData(tx, ty, turretConfig, options = {}) {
    const { respectMoney = true, fallbackX = 0, fallbackY = 0 } = options;
    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;
    const hasMap =
      this.scene.levelConfig &&
      this.scene.levelConfig.map &&
      Array.isArray(this.scene.levelConfig.map);

    const isInsideMap =
      hasMap && tx >= 0 && tx < 15 && ty >= 0 && ty < 15;

    const centerX = isInsideMap
      ? this.scene.mapStartX + tx * T + T / 2
      : fallbackX;
    const centerY = isInsideMap
      ? this.scene.mapStartY + ty * T + T / 2
      : fallbackY;

    if (!isInsideMap || !turretConfig) {
      return { centerX, centerY, canPlace: false, isInsideMap: false };
    }

    const tileType = this.scene.levelConfig.map[ty][tx];
    const isBuildableTile =
      tileType === 0 ||
      tileType === 6 ||
      tileType === 10 ||
      tileType === 12 ||
      tileType === 16;

    if (!isBuildableTile) {
      return { centerX, centerY, canPlace: false, isInsideMap: true };
    }

    const hasTree =
      this.scene.mapManager && this.scene.mapManager.hasTree
        ? this.scene.mapManager.hasTree(tx, ty)
        : false;
    if (hasTree) {
      return { centerX, centerY, canPlace: false, isInsideMap: true };
    }

    let canPlace = true;
    if (turretConfig.key === "barracks") {
      canPlace =
        this.scene.mapManager &&
        this.scene.mapManager.isAdjacentToPath(tx, ty) &&
        (!respectMoney || this.scene.money >= turretConfig.cost);
    } else if (respectMoney) {
      canPlace = this.scene.money >= turretConfig.cost;
    }

    return {
      centerX,
      centerY,
      canPlace,
      isInsideMap: true,
    };
  }

  getRangePixels(turretConfig) {
    const rawRange = Number(turretConfig?.range || 0);
    if (!Number.isFinite(rawRange) || rawRange <= 0) return 0;
    return rawRange * (this.scene?.scaleFactor || 1);
  }
}
