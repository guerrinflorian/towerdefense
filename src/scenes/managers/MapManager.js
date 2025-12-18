import { CONFIG } from "../../config/settings.js";

export class MapManager {
  constructor(scene) {
    this.scene = scene;
    this.treePositions = new Set();
    this.treeContainers = new Map(); // Stocker les containers d'arbres par position
    this.mountainPositions = new Set(); // Stocker les positions des montagnes
    this.mountainContainers = new Map(); // Stocker les containers de montagnes par position
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
        if (type === 5) key = "tile_mountain"; // Nouveau type : montagne
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

    // Détecter et créer les grandes montagnes (groupes 3x3)
    this.detectAndCreateLargeMountains();

    this.createPaths();
  }
  
  // Détecter les groupes 3x3 de montagnes et créer une grande montagne
  detectAndCreateLargeMountains() {
    const mapData = this.scene.levelConfig.map;
    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;
    const processedTiles = new Set(); // Pour éviter de traiter plusieurs fois les mêmes tiles
    
    // Parcourir toutes les tiles
    for (let y = 0; y < mapData.length - 2; y++) {
      for (let x = 0; x < mapData[y].length - 2; x++) {
        // Vérifier si c'est le coin supérieur gauche d'un groupe 3x3 de montagnes
        if (this.is3x3MountainGroup(mapData, x, y, processedTiles)) {
          // Créer une grande montagne qui couvre les 3x3 tiles
          const centerX = x + 1;
          const centerY = y + 1;
          
          const px = this.scene.mapStartX + centerX * T + T / 2;
          const py = this.scene.mapStartY + centerY * T + T / 2;
          
          this.addLargeMountain(px, py, centerX, centerY);
          
          // Marquer toutes les tiles du groupe 3x3 comme traitées
          for (let dy = 0; dy < 3; dy++) {
            for (let dx = 0; dx < 3; dx++) {
              processedTiles.add(`${x + dx},${y + dy}`);
              this.mountainPositions.add(`${x + dx},${y + dy}`);
            }
          }
        }
      }
    }
  }
  
  // Vérifier si un groupe 3x3 est composé uniquement de montagnes (type 5)
  is3x3MountainGroup(mapData, startX, startY, processedTiles) {
    // Vérifier que toutes les 9 tiles sont de type 5 (montagne) et non déjà traitées
    for (let dy = 0; dy < 3; dy++) {
      for (let dx = 0; dx < 3; dx++) {
        const x = startX + dx;
        const y = startY + dy;
        const key = `${x},${y}`;
        
        // Vérifier les limites
        if (y < 0 || y >= mapData.length || x < 0 || x >= mapData[y].length) {
          return false;
        }
        
        // Vérifier que ce n'est pas déjà traité
        if (processedTiles.has(key)) {
          return false;
        }
        
        // Vérifier que c'est bien une montagne (type 5)
        if (mapData[y][x] !== 5) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  // Créer une grande montagne visuelle (3x3 tiles)
  addLargeMountain(px, py, tileX, tileY) {
    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;
    const scale = this.scene.scaleFactor;
    
    const mountain = this.scene.add.container(px, py);
    mountain.setDepth(1); // Au-dessus des tiles mais sous les arbres
    
    const g = this.scene.add.graphics();
    const size = T * 1.5; // Taille de la grande montagne (couvre 3x3)
    
    // Base de la montagne (forme triangulaire arrondie plus grande)
    g.fillStyle(0x6b5b4f); // Marron/gris pour la roche
    g.beginPath();
    g.moveTo(-size * 0.5, size * 0.3);
    g.lineTo(-size * 0.3, -size * 0.1);
    g.lineTo(0, -size * 0.4);
    g.lineTo(size * 0.3, -size * 0.1);
    g.lineTo(size * 0.5, size * 0.3);
    g.lineTo(size * 0.4, size * 0.4);
    g.lineTo(-size * 0.4, size * 0.4);
    g.closePath();
    g.fillPath();
    
    // Ombre pour la profondeur
    g.fillStyle(0x4a3d32, 0.6);
    g.beginPath();
    g.moveTo(-size * 0.4, size * 0.35);
    g.lineTo(-size * 0.2, size * 0.15);
    g.lineTo(0, -size * 0.3);
    g.lineTo(size * 0.2, size * 0.15);
    g.lineTo(size * 0.4, size * 0.35);
    g.lineTo(size * 0.3, size * 0.4);
    g.lineTo(-size * 0.3, size * 0.4);
    g.closePath();
    g.fillPath();
    
    // Détails de roche (texture) - plus nombreux pour une grande montagne
    g.fillStyle(0x5a4b3f, 0.8);
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const dist = (Math.random() * 0.4 + 0.1) * size;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist * 0.5;
      g.fillCircle(x, y, 4 * scale);
    }
    
    // Plusieurs sommets pour une montagne plus imposante
    g.fillStyle(0x8b7d6f);
    // Sommet principal
    g.beginPath();
    g.moveTo(-size * 0.15, -size * 0.35);
    g.lineTo(0, -size * 0.5);
    g.lineTo(size * 0.15, -size * 0.35);
    g.lineTo(0, -size * 0.25);
    g.closePath();
    g.fillPath();
    
    // Sommets secondaires
    g.fillStyle(0x7b6d5f);
    g.beginPath();
    g.moveTo(-size * 0.35, -size * 0.2);
    g.lineTo(-size * 0.25, -size * 0.3);
    g.lineTo(-size * 0.15, -size * 0.25);
    g.lineTo(-size * 0.2, -size * 0.15);
    g.closePath();
    g.fillPath();
    
    g.beginPath();
    g.moveTo(size * 0.35, -size * 0.2);
    g.lineTo(size * 0.25, -size * 0.3);
    g.lineTo(size * 0.15, -size * 0.25);
    g.lineTo(size * 0.2, -size * 0.15);
    g.closePath();
    g.fillPath();
    
    // Grands rochers autour de la base
    g.fillStyle(0x5a4b3f);
    g.fillCircle(-size * 0.4, size * 0.25, 6 * scale);
    g.fillCircle(size * 0.4, size * 0.25, 6 * scale);
    g.fillCircle(-size * 0.25, size * 0.3, 5 * scale);
    g.fillCircle(size * 0.25, size * 0.3, 5 * scale);
    g.fillCircle(0, size * 0.35, 4 * scale);
    
    // Bordure pour plus de définition
    g.lineStyle(3 * scale, 0x4a3d32, 0.5);
    g.strokePath();
    
    mountain.add(g);
    
    // Stocker le container pour référence
    const key = `${tileX},${tileY}`;
    this.mountainContainers.set(key, mountain);
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
    
    // Stocker le container pour pouvoir le supprimer plus tard
    const key = `${tileX},${tileY}`;
    this.treeContainers.set(key, tree);
  }

  removeTree(tileX, tileY) {
    const key = `${tileX},${tileY}`;
    const tree = this.treeContainers.get(key);
    if (tree) {
      tree.destroy();
      this.treeContainers.delete(key);
      this.treePositions.delete(key);
      return true;
    }
    return false;
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
