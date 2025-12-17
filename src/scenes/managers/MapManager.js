import { CONFIG } from "../../config/settings.js";

export class MapManager {
  constructor(scene) {
    this.scene = scene;
    this.treePositions = new Set();
  }

  createMap() {
    // Vérifier que levelConfig existe et a une map
    if (!this.scene.levelConfig || !this.scene.levelConfig.map) {
      console.error("levelConfig ou map est undefined");
      return;
    }
    
    const mapData = this.scene.levelConfig.map;
    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;

    for (let y = 0; y < mapData.length; y++) {
      for (let x = 0; x < mapData[y].length; x++) {
        const type = mapData[y][x];
        const px = this.scene.mapStartX + x * T;
        const py = this.scene.mapStartY + y * T;

        let key = "tile_grass_1";
        if (type === 0)
          key = (x + y) % 2 === 0 ? "tile_grass_2" : "tile_grass_1";
        if (type === 1) key = "tile_path";
        if (type === 2) key = "tile_base";
        if (type === 3) key = "tile_water";
        if (type === 4) key = "tile_bridge";
        if (type === 9) key = "tile_grass_2";

        // Vérifier que la texture existe avant de l'utiliser
        if (!this.scene.textures.exists(key)) {
          console.warn(`Texture manquante: ${key}, utilisation d'une texture de secours`);
          key = "tile_grass_1"; // Fallback
        }

        const tile = this.scene.add.image(px, py, key).setOrigin(0, 0).setDepth(0);
        tile.setScale(this.scene.scaleFactor);
        if (type === 0) {
          const canPlaceBarracks = this.isAdjacentToPath(x, y);
          if (!canPlaceBarracks && Math.random() < 0.3) {
            this.addTree(px, py, x, y);
            this.treePositions.add(`${x},${y}`);
          } else if (canPlaceBarracks && Math.random() < 0.1) {
            this.addTree(px, py, x, y);
            this.treePositions.add(`${x},${y}`);
          }
        }
      }
    }

    this.createPaths();
  }

  createPaths() {
    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;
    const H = T / 2;
    this.scene.paths = [];
    const rawPaths = this.scene.levelConfig.paths || [this.scene.levelConfig.path];
    
    rawPaths.forEach((points) => {
      const newPath = new Phaser.Curves.Path();
      newPath.moveTo(this.scene.mapStartX + points[0].x * T + H, this.scene.mapStartY + points[0].y * T + H);
      for (let i = 1; i < points.length; i++) {
        newPath.lineTo(this.scene.mapStartX + points[i].x * T + H, this.scene.mapStartY + points[i].y * T + H);
      }
      this.scene.paths.push(newPath);
    });
  }

  addTree(px, py, tileX, tileY) {
    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;
    const treeX = px + T / 2 + (Math.random() - 0.5) * 15 * this.scene.scaleFactor;
    const treeY = py + T / 2 + (Math.random() - 0.5) * 15 * this.scene.scaleFactor;
    
    const tree = this.scene.add.container(treeX, treeY);
    tree.setDepth(2);
    
    const g = this.scene.add.graphics();
    const treeType = Math.floor(Math.random() * 3);
    const scale = this.scene.scaleFactor;
    
    if (treeType === 0) {
      g.fillStyle(0x8b4513);
      g.fillRect(-2 * scale, 0, 4 * scale, 12 * scale);
      g.fillStyle(0x2d5016);
      g.fillCircle(0, -5 * scale, 10 * scale);
      g.fillStyle(0x3a6b1f);
      g.fillCircle(0, -5 * scale, 8 * scale);
      g.fillStyle(0x4a7a2f);
      g.fillCircle(0, -5 * scale, 6 * scale);
    } else if (treeType === 1) {
      g.fillStyle(0x654321);
      g.fillRect(-3 * scale, 0, 6 * scale, 15 * scale);
      g.fillStyle(0x1a4d1a);
      g.fillCircle(-5 * scale, -8 * scale, 8 * scale);
      g.fillCircle(5 * scale, -8 * scale, 8 * scale);
      g.fillCircle(0, -12 * scale, 10 * scale);
      g.fillStyle(0x2d6b2d);
      g.fillCircle(-5 * scale, -8 * scale, 6 * scale);
      g.fillCircle(5 * scale, -8 * scale, 6 * scale);
      g.fillCircle(0, -12 * scale, 8 * scale);
    } else {
      g.fillStyle(0x5c4033);
      g.fillRect(-4 * scale, 0, 8 * scale, 18 * scale);
      g.fillStyle(0x2d5016);
      g.fillCircle(-8 * scale, -10 * scale, 12 * scale);
      g.fillCircle(8 * scale, -10 * scale, 12 * scale);
      g.fillCircle(0, -15 * scale, 14 * scale);
      g.fillStyle(0x3a6b1f);
      g.fillCircle(-8 * scale, -10 * scale, 10 * scale);
      g.fillCircle(8 * scale, -10 * scale, 10 * scale);
      g.fillCircle(0, -15 * scale, 12 * scale);
      g.fillStyle(0x4a7a2f);
      g.fillCircle(0, -15 * scale, 8 * scale);
    }
    
    tree.add(g);
  }

  isAdjacentToPath(tx, ty) {
    const map = this.scene.levelConfig.map;
    const directions = [
      { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 },
    ];
    
    for (const dir of directions) {
      const nx = tx + dir.x;
      const ny = ty + dir.y;
      
      if (nx >= 0 && nx < 15 && ny >= 0 && ny < 15) {
        const tileType = map[ny][nx];
        if (tileType === 1 || tileType === 4) {
          return true;
        }
      }
    }
    return false;
  }

  hasTree(tileX, tileY) {
    return this.treePositions.has(`${tileX},${tileY}`);
  }
}
