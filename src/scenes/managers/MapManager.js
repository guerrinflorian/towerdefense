import { CONFIG } from "../../config/settings.js";
import { createTreeGraphics } from "./textures/trees/index.js";

export class MapManager {
  constructor(scene) {
    this.scene = scene;
    this.treePositions = new Set();
    this.treeContainers = new Map();
    this.mountainPositions = new Set();
    this.mountainContainers = new Map();
  }

  createMap() {
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

        let key = "tile_grass_1"; // Default

        // --- BIOME VOLCAN (0-5) ---
        if (type === 0)
          key = (x + y) % 2 === 0 ? "tile_grass_2" : "tile_grass_1"; // Terre brûlée
        if (type === 1) key = "tile_path"; // Chemin terre/roche
        if (type === 2) key = "tile_base";
        if (type === 3) key = "tile_water"; // eau
        if (type === 4) key = "tile_bridge";
        if (type === 5) key = "tile_mountain"; // Sol sous la montagne

        // --- BIOME NEIGE (6-9) ---
        if (type === 6) key = "tile_snow_1"; // Sol Neige
        if (type === 7) key = "tile_snow_path"; // Chemin Glace
        if (type === 8) key = "tile_ice_water"; // Eau/Glace profonde
        if (type === 9) key = "tile_snow_1"; // Sol sous la montagne neige

        // --- BIOME SABLE (10-11) ---
        if (type === 10) key = "tile_sand"; // Sable
        if (type === 11) key = "tile_sand_rock"; // Rochers de sable

        // --- BIOME CIMETIÈRE (12-13) ---
        if (type === 12) key = "tile_graveyard"; // Sol de cimetière
        if (type === 13) key = "tile_graveyard_path"; // Chemin de cimetière

        // --- BIOME VOLCAN (14-17) ---
        if (type === 14) key = "tile_lava_path"; // Chemin Lave Noire
        if (type === 15) key = "tile_volcanic_crevasse"; // Crevasses Volcaniques
        if (type === 16) key = "tile_volcanic_ground"; // Sol Roche Cramée (constructible)
        if (type === 17) key = "tile_flowing_lava"; // Lave qui Coule

        // --- BIOME ROSE (18-19) ---
        if (type === 18) key = "tile_rose_ground"; // Sol Rose (constructible)
        if (type === 19) key = "tile_rose_path"; // Chemin Rose Quartz Royale

        // --- BIOME SNOW (20-21) ---
        if (type === 20) key = "tile_snow_ground"; // Sol Neige (constructible)
        if (type === 21) key = "tile_snow_path"; // Chemin Neige

        // --- BIOME LABORATORY (22-23) ---
        if (type === 22) key = "tile_laboratory_ground"; // Sol Laboratoire (constructible)
        if (type === 23) key = "tile_laboratory_path"; // Chemin Laboratoire

        // --- BIOME GLACE PROFONDE (24) ---
        if (type === 24) key = "tile_frozen_ground"; // Sol Glacé Profond (constructible, plus glacé que type 6)

        const tile = this.scene.add
          .image(px, py, key)
          .setOrigin(0, 0)
          .setDepth(0);
        tile.setScale(this.scene.scaleFactor);

        // --- GESTION DES ARBRES ---
        // On place des arbres selon le biome du niveau
        const biome = this.scene.levelConfig.biome || "grass";
        const shouldPlaceTree = 
          (biome === "grass" && type === 0) || // Herbe pour biome grass
          (biome === "sand" && (type === 0 || type === 10)) || // Herbe ou sable pour biome sand
          (biome === "ice" && (type === 6 || type === 24)) || // Neige ou sol glacé profond pour biome ice
          (biome === "cimetiere" && type === 12) || // Sol cimetière pour biome cimetiere
          (biome === "lava" && type === 16) || // Sol roche cramée pour biome lava
          (biome === "rose" && type === 18) || // Sol rose pour biome rose
          (biome === "snow" && type === 20) || // Sol neige pour biome snow
          (biome === "laboratory" && type === 22); // Sol laboratoire pour biome laboratory

        if (shouldPlaceTree) {
          const canPlaceBarracks = this.isAdjacentToPath(x, y);
          // Probabilités d'apparition
          if (!canPlaceBarracks && Math.random() < 0.3) {
            this.addTree(px, py, x, y, biome); // On passe le biome pour savoir quel arbre dessiner
            this.treePositions.add(`${x},${y}`);
          } else if (canPlaceBarracks && Math.random() < 0.1) {
            this.addTree(px, py, x, y, biome);
            this.treePositions.add(`${x},${y}`);
          }
        }
      }
    }

    // Détecter les montagnes (Type 5 = Volcan, Type 9 = Neige)
    this.detectAndCreateLargeMountains();

    this.createPaths();
  }

  detectAndCreateLargeMountains() {
    const mapData = this.scene.levelConfig.map;
    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;
    const processedTiles = new Set();

    for (let y = 0; y < mapData.length - 2; y++) {
      for (let x = 0; x < mapData[y].length - 2; x++) {
        // On vérifie quel type de montagne c'est (5 ou 9)
        const mountainType = mapData[y][x];

        if (
          (mountainType === 5 || mountainType === 9) &&
          this.is3x3MountainGroup(mapData, x, y, processedTiles, mountainType)
        ) {
          const centerX = x + 1;
          const centerY = y + 1;
          const px = this.scene.mapStartX + centerX * T + T / 2;
          const py = this.scene.mapStartY + centerY * T + T / 2;

          // On passe le type à la fonction de création
          this.addLargeMountain(px, py, centerX, centerY, mountainType);

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

  // Modifié pour vérifier un type spécifique (targetType)
  is3x3MountainGroup(mapData, startX, startY, processedTiles, targetType) {
    for (let dy = 0; dy < 3; dy++) {
      for (let dx = 0; dx < 3; dx++) {
        const x = startX + dx;
        const y = startY + dy;
        const key = `${x},${y}`;

        if (y < 0 || y >= mapData.length || x < 0 || x >= mapData[y].length)
          return false;
        if (processedTiles.has(key)) return false;

        // Doit être exactement le même type (ne pas mélanger volcan et neige)
        if (mapData[y][x] !== targetType) return false;
      }
    }
    return true;
  }

  // Ajout du paramètre "type" pour changer les couleurs
  addLargeMountain(px, py, tileX, tileY, type) {
    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;
    const scale = this.scene.scaleFactor;

    const mountain = this.scene.add.container(px, py);
    mountain.setDepth(1);

    const g = this.scene.add.graphics();
    const size = T * 1.5;

    // --- PALETTE DE COULEURS ---
    let colorBase, colorShadow, colorDetail, colorPeakMain, colorPeakSub;

    if (type === 9) {
      // THEME NEIGE
      colorBase = 0xe0e0e0; // Gris très clair / Blanc
      colorShadow = 0xb0c4de; // Bleu gris ombre
      colorDetail = 0xa9a9a9; // Gris roche
      colorPeakMain = 0xffffff; // Blanc pur (Neige éternelle)
      colorPeakSub = 0xf0f8ff; // AliceBlue
    } else {
      // THEME VOLCAN (Type 5)
      colorBase = 0x6b5b4f;
      colorShadow = 0x4a3d32;
      colorDetail = 0x5a4b3f;
      colorPeakMain = 0x8b7d6f;
      colorPeakSub = 0x7b6d5f;
    }

    // Base de la montagne
    g.fillStyle(colorBase);
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

    // Ombre
    g.fillStyle(colorShadow, 0.6);
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

    // Détails de roche
    g.fillStyle(colorDetail, 0.8);
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const dist = (Math.random() * 0.4 + 0.1) * size;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist * 0.5;
      g.fillCircle(x, y, 4 * scale);
    }

    // Sommet principal
    g.fillStyle(colorPeakMain);
    g.beginPath();
    g.moveTo(-size * 0.15, -size * 0.35);
    g.lineTo(0, -size * 0.5);
    g.lineTo(size * 0.15, -size * 0.35);
    g.lineTo(0, -size * 0.25);
    g.closePath();
    g.fillPath();

    // Sommets secondaires
    g.fillStyle(colorPeakSub);
    // ... (Même dessin géométrique, juste la couleur change) ...
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

    // Bordure
    g.lineStyle(3 * scale, colorShadow, 0.5);
    g.strokePath();

    mountain.add(g);
    const key = `${tileX},${tileY}`;
    this.mountainContainers.set(key, mountain);
  }

  createPaths() {
    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;
    const H = T / 2;
    this.scene.paths = [];
    // Support pour configuration simple ou multiple chemins
    const rawPaths =
      this.scene.levelConfig.paths ||
      (this.scene.levelConfig.path ? [this.scene.levelConfig.path] : []);

    rawPaths.forEach((points) => {
      const newPath = new Phaser.Curves.Path();
      if (points.length > 0) {
        newPath.moveTo(
          this.scene.mapStartX + points[0].x * T + H,
          this.scene.mapStartY + points[0].y * T + H
        );
        for (let i = 1; i < points.length; i++) {
          newPath.lineTo(
            this.scene.mapStartX + points[i].x * T + H,
            this.scene.mapStartY + points[i].y * T + H
          );
        }
        this.scene.paths.push(newPath);
      }
    });
  }

  // Ajout du paramètre "biome" pour déterminer le type d'arbre
  addTree(px, py, tileX, tileY, biome) {
    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;
    // Petit décalage aléatoire
    const treeX =
      px + T / 2 + (Math.random() - 0.5) * 15 * this.scene.scaleFactor;
    const treeY =
      py + T / 2 + (Math.random() - 0.5) * 15 * this.scene.scaleFactor;

    const tree = this.scene.add.container(treeX, treeY);
    tree.setDepth(2);

    const scale = this.scene.scaleFactor;
    const graphics = createTreeGraphics(this.scene, biome, scale);

    tree.add(graphics);
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
    // On considère 1 et 4 (Volcan), 7 (Neige), 13 (Cimetière), 14 (Lave), 19 (Rose), et 23 (Laboratoire) comme des chemins
    const pathTypes = [1, 4, 7, 13, 14, 19, 23];
    const directions = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];

    for (const dir of directions) {
      const nx = tx + dir.x;
      const ny = ty + dir.y;

      if (nx >= 0 && nx < 15 && ny >= 0 && ny < 15) {
        if (pathTypes.includes(map[ny][nx])) {
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
