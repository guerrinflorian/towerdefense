import { CONFIG } from "../../config/settings.js";

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
          (biome === "ice" && type === 6) || // Neige pour biome ice
          (biome === "cimetiere" && type === 12); // Sol cimetière pour biome cimetiere

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

    const g = this.scene.add.graphics();
    const scale = this.scene.scaleFactor;

    if (biome === "ice") {
      // --- ARBRES ENNEIGÉS (Sapins) ---
      // Tronc
      g.fillStyle(0x5c4033); // Marron foncé
      g.fillRect(-2 * scale, 0, 4 * scale, 8 * scale);

      // Feuillage (Triangle de sapin)
      const darkGreen = 0x1a4d1a;
      const snowWhite = 0xffffff;

      // Étage bas
      g.fillStyle(darkGreen);
      g.fillTriangle(0, -10 * scale, -8 * scale, 0, 8 * scale, 0);
      // Neige sur étage bas
      g.fillStyle(snowWhite);
      g.fillTriangle(
        0,
        -10 * scale,
        -2 * scale,
        -2 * scale,
        2 * scale,
        -2 * scale
      );

      // Étage milieu
      g.fillStyle(darkGreen);
      g.fillTriangle(
        0,
        -16 * scale,
        -6 * scale,
        -6 * scale,
        6 * scale,
        -6 * scale
      );

      // Étage haut
      g.fillStyle(darkGreen);
      g.fillTriangle(
        0,
        -20 * scale,
        -4 * scale,
        -12 * scale,
        4 * scale,
        -12 * scale
      );
      // Neige sommet
      g.fillStyle(snowWhite);
      g.fillTriangle(
        0,
        -20 * scale,
        -2 * scale,
        -16 * scale,
        2 * scale,
        -16 * scale
      );
    } else if (biome === "sand") {
      // --- BIOME SABLE : Cactus et Baobabs ---
      const treeType = Math.random();
      
      if (treeType < 0.6) {
        // CACTUS (60% de chance)
        // Tronc principal vertical
        g.fillStyle(0x2d5016); // Vert foncé
        g.fillRect(-2 * scale, 0, 4 * scale, 16 * scale);
        
        // Bras du cactus (gauche)
        g.fillRect(-6 * scale, 4 * scale, 4 * scale, 8 * scale);
        // Bras du cactus (droite)
        g.fillRect(2 * scale, 6 * scale, 4 * scale, 6 * scale);
        
        // Détails verts plus clairs
        g.fillStyle(0x3a6b1f);
        g.fillRect(-2 * scale, 0, 4 * scale, 16 * scale);
        g.fillRect(-6 * scale, 4 * scale, 4 * scale, 8 * scale);
        g.fillRect(2 * scale, 6 * scale, 4 * scale, 6 * scale);
        
        // Petites épines (points blancs)
        g.fillStyle(0xffffff, 0.8);
        for (let i = 0; i < 8; i++) {
          g.fillCircle(
            (Math.random() - 0.5) * 8 * scale,
            Math.random() * 16 * scale,
            1 * scale
          );
        }
      } else {
        // BAOBAB (40% de chance)
        // Tronc épais et large
        g.fillStyle(0x8b4513); // Marron
        g.fillRect(-6 * scale, 0, 12 * scale, 20 * scale);
        
        // Détails du tronc (lignes verticales)
        g.fillStyle(0x654321, 0.6);
        for (let i = 0; i < 3; i++) {
          g.fillRect(-5 * scale + i * 4 * scale, 0, 2 * scale, 20 * scale);
        }
        
        // Branches courtes et épaisses
        g.fillStyle(0x5c4033);
        // Branche gauche
        g.fillRect(-8 * scale, 4 * scale, 4 * scale, 3 * scale);
        // Branche droite
        g.fillRect(4 * scale, 6 * scale, 4 * scale, 3 * scale);
        
        // Feuillage minimal (petites boules)
        g.fillStyle(0x2d5016, 0.7);
        g.fillCircle(-6 * scale, 2 * scale, 4 * scale);
        g.fillCircle(6 * scale, 4 * scale, 4 * scale);
        g.fillCircle(0, -2 * scale, 5 * scale);
      }
    } else if (biome === "cimetiere") {
      // --- BIOME CIMETIÈRE : Tombes ou Arbres avec citrouilles ---
      const treeType = Math.random();
      
      if (treeType < 0.5) {
        // TOMBE (50% de chance)
        // Base de la tombe (rectangulaire)
        g.fillStyle(0x2a2a2a); // Pierre grise foncée
        g.fillRoundedRect(-6 * scale, 8 * scale, 12 * scale, 8 * scale, 2 * scale);
        
        // Stèle (pierre tombale verticale)
        g.fillStyle(0x3a3a3a);
        g.fillRoundedRect(-4 * scale, 0, 8 * scale, 10 * scale, 1 * scale);
        
        // Bordure de la stèle
        g.lineStyle(1.5, 0x1a1a1a, 0.8);
        g.strokeRoundedRect(-4 * scale, 0, 8 * scale, 10 * scale, 1 * scale);
        
        // Croix sur la stèle (optionnelle, 70% de chance)
        if (Math.random() < 0.7) {
          g.lineStyle(2, 0x1a1a1a, 0.9);
          // Traverse horizontale
          g.beginPath();
          g.moveTo(-3 * scale, 3 * scale);
          g.lineTo(3 * scale, 3 * scale);
          g.strokePath();
          // Traverse verticale
          g.beginPath();
          g.moveTo(0, 1 * scale);
          g.lineTo(0, 6 * scale);
          g.strokePath();
        }
        
        // Mousse/lichen sur la pierre (détails verts sombres)
        g.fillStyle(0x1a3a1a, 0.4);
        g.fillCircle(-2 * scale, 5 * scale, 2 * scale);
        g.fillCircle(2 * scale, 7 * scale, 1.5 * scale);
        
        // Petites fissures
        g.lineStyle(1, 0x1a1a1a, 0.5);
        g.beginPath();
        g.moveTo(-2 * scale, 2 * scale);
        g.lineTo(-1 * scale, 4 * scale);
        g.strokePath();
      } else {
        // ARBRE AVEC CITROUILLES (50% de chance)
        // Tronc mort
        g.fillStyle(0x3a2a1a); // Marron sombre
        g.fillRect(-2 * scale, 0, 4 * scale, 14 * scale);
        
        // Branches mortes
        g.fillStyle(0x2a1a0a);
        g.fillRect(-2 * scale, 0, 1 * scale, 6 * scale);
        g.fillRect(1 * scale, 0, 1 * scale, 6 * scale);
        g.fillRect(-4 * scale, -4 * scale, 2 * scale, 1 * scale);
        g.fillRect(2 * scale, -4 * scale, 2 * scale, 1 * scale);
        
        // Citrouilles sur les branches
        g.fillStyle(0xff6600); // Orange
        // Citrouille gauche
        g.fillCircle(-5 * scale, -4 * scale, 3 * scale);
        g.fillStyle(0x1a0a00); // Tige
        g.fillRect(-5 * scale, -1 * scale, 1 * scale, 2 * scale);
        
        // Citrouille droite
        g.fillStyle(0xff6600);
        g.fillCircle(5 * scale, -4 * scale, 3 * scale);
        g.fillStyle(0x1a0a00);
        g.fillRect(4 * scale, -1 * scale, 1 * scale, 2 * scale);
        
        // Visages effrayants sur les citrouilles (yeux)
        g.fillStyle(0x000000);
        g.fillCircle(-6 * scale, -4 * scale, 1 * scale);
        g.fillCircle(-4 * scale, -4 * scale, 1 * scale);
        g.fillCircle(4 * scale, -4 * scale, 1 * scale);
        g.fillCircle(6 * scale, -4 * scale, 1 * scale);
      }
    } else {
      // --- ARBRES CLASSIQUES (Biome Grass) ---
      const treeType = Math.floor(Math.random() * 3);
      if (treeType === 0) {
        g.fillStyle(0x8b4513);
        g.fillRect(-2 * scale, 0, 4 * scale, 12 * scale);
        g.fillStyle(0x2d5016);
        g.fillCircle(0, -5 * scale, 10 * scale);
        g.fillStyle(0x3a6b1f);
        g.fillCircle(0, -5 * scale, 8 * scale);
      } else if (treeType === 1) {
        g.fillStyle(0x654321);
        g.fillRect(-3 * scale, 0, 6 * scale, 15 * scale);
        g.fillStyle(0x1a4d1a);
        g.fillCircle(-5 * scale, -8 * scale, 8 * scale);
        g.fillCircle(5 * scale, -8 * scale, 8 * scale);
        g.fillCircle(0, -12 * scale, 10 * scale);
      } else {
        g.fillStyle(0x5c4033);
        g.fillRect(-4 * scale, 0, 8 * scale, 18 * scale);
        g.fillStyle(0x2d5016);
        g.fillCircle(-8 * scale, -10 * scale, 12 * scale);
        g.fillCircle(8 * scale, -10 * scale, 12 * scale);
      }
    }

    tree.add(g);
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
    // On considère 1 et 4 (Volcan), 7 (Neige), et 13 (Cimetière) comme des chemins
    const pathTypes = [1, 4, 7, 13];
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
