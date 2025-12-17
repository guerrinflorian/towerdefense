import { CONFIG } from "../config/settings.js";
import { LEVELS_CONFIG } from "../config/levels/index.js";
import { TURRETS } from "../config/turrets/index.js";
import { Enemy } from "../objects/Enemy.js";
import { Turret } from "../objects/Turret.js";
import { Barracks } from "../objects/Barracks.js";
import { MapManager } from "./managers/MapManager.js";
import { WaveManager } from "./managers/WaveManager.js";
import { UIManager } from "./managers/UIManager.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  init(data) {
    this.levelID = data.level || 1;
    const levelData = LEVELS_CONFIG.find((l) => l.id === this.levelID);
    const src = levelData ? levelData.data : LEVELS_CONFIG[0].data;

    // CLONE PROFOND pour ne jamais muter LEVELS_CONFIG
    if (typeof structuredClone !== 'undefined') {
      this.levelConfig = structuredClone(src);
    } else {
      this.levelConfig = JSON.parse(JSON.stringify(src));
    }

    this.money = CONFIG.STARTING_MONEY;
    this.lives = CONFIG.STARTING_LIVES;
    this.turrets = [];
    this.barracks = [];
    this.paths = [];
    this.currentWaveIndex = 0;
    this.isWaveRunning = false;
    this.enemies = null;
    this.soldiers = null;
    this.selectedTurret = null;
    this.maxBarracks = 5;
    this.draggingTurret = null;
    this.placementPreview = null;
    this.validCellsPreview = [];
    this.upgradeTextLines = []; // Pour stocker les lignes de texte du menu
    
    // Réinitialiser toutes les références UI pour éviter les références vers objets détruits
    this.buildToolbar = null;
    this.toolbarButtons = null;
    this.txtMoney = null;
    this.txtLives = null;
    this.buildMenu = null;
    this.upgradeMenu = null;
    this.waveBtnContainer = null;
    this.waveBtnBg = null;
    this.waveBtnText = null;
  }

  preload() {
    // Générer les textures seulement si le système est prêt
    if (this.textures && this.make) {
      this.generateTextures();
    } else {
      console.warn("Système de textures non prêt, report de la génération");
      // Réessayer dans create() si nécessaire
    }
  }

  create() {
    this.input.mouse.disableContextMenu();
    this.cameras.main.setBackgroundColor("#050505");

    // Attacher shutdown() aux events Phaser pour un cleanup automatique
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
    this.events.once(Phaser.Scenes.Events.DESTROY, this.shutdown, this);

    // S'assurer que les textures sont générées (au cas où preload() n'a pas pu le faire)
    if (this.textures && this.make) {
      try {
        this.generateTextures();
      } catch (e) {
        console.warn("Erreur lors de la génération des textures dans create():", e);
      }
    }

    // Calculer les dimensions et le scale
    this.calculateLayout();

    // Initialiser les managers
    this.mapManager = new MapManager(this);
    this.waveManager = new WaveManager(this);
    this.uiManager = new UIManager(this);

    // Support tactile : long press pour clic droit
    this.longPressTimer = null;
    this.longPressDelay = 500;

    this.mapManager.createMap();
    this.enemies = this.add.group({ runChildUpdate: true });
    this.soldiers = this.add.group({ runChildUpdate: true });
    this.uiManager.createUI();
    this.createBuildToolbar();
    
    // Gestion de la touche Echap pour annuler le drag
    this.input.keyboard.on("keydown-ESC", () => {
      this.cancelDrag();
    });

    // Gestion des clics
    this.setupInputHandlers();
  }

  // Calculer le layout pour centrer correctement
  calculateLayout() {
    this.gameWidth = this.scale.width;
    this.gameHeight = this.scale.height;
    this.baseWidth = this.game.baseWidth || CONFIG.GAME_WIDTH;
    this.baseHeight = this.game.baseHeight || CONFIG.GAME_HEIGHT;

    // Calculer le scale factor pour adapter à l'écran
    // On veut que tout tienne dans la hauteur disponible
    const mapWidth = 15 * CONFIG.TILE_SIZE;
    const mapHeight = 15 * CONFIG.TILE_SIZE;
    const uiHeight = CONFIG.UI_HEIGHT;
    const toolbarHeight = 120; // Toolbar plus grande
    const toolbarMargin = CONFIG.TOOLBAR_MARGIN;
    
    // Hauteur totale nécessaire
    const totalHeightNeeded = uiHeight + mapHeight + toolbarMargin + toolbarHeight + toolbarMargin;
    
    // Calculer le scale pour que tout tienne
    const scaleY = (this.gameHeight - 20) / totalHeightNeeded; // -20 pour marge
    const scaleX = (this.gameWidth - 20) / mapWidth; // -20 pour marge
    
    // Utiliser le plus petit pour que tout tienne
    this.scaleFactor = Math.min(scaleX, scaleY, 1.5); // Limiter à 1.5x max
    
    // Dimensions réelles avec le scale
    const mapWidthScaled = mapWidth * this.scaleFactor;
    const mapHeightScaled = mapHeight * this.scaleFactor;
    const uiHeightScaled = uiHeight * this.scaleFactor;
    const toolbarHeightScaled = toolbarHeight * this.scaleFactor;
    const toolbarMarginScaled = toolbarMargin * this.scaleFactor;
    
    // Centrer la map horizontalement
    this.mapOffsetX = (this.gameWidth - mapWidthScaled) / 2;
    
    // Positionner l'UI en haut
    this.uiOffsetY = 0;
    
    // Positionner la map sous l'UI
    this.mapOffsetY = uiHeightScaled;
    
    // Positionner la toolbar sous la map (centrée horizontalement aussi)
    this.toolbarOffsetY = this.mapOffsetY + mapHeightScaled + toolbarMarginScaled;
    
    // Calculer la largeur exacte de la toolbar pour un centrage parfait
    const itemSpacing = 90 * this.scaleFactor;
    const toolbarWidth = 5 * itemSpacing + 40 * this.scaleFactor; // Largeur exacte de la toolbar
    this.toolbarOffsetX = (this.gameWidth - toolbarWidth) / 2; // Centrer horizontalement
    
    // Stocker les offsets pour utilisation dans createMap
    this.mapStartX = this.mapOffsetX;
    this.mapStartY = this.mapOffsetY;
  }

  // Gérer le redimensionnement
  handleResize() {
    this.calculateLayout();
    
    // Repositionner les éléments
    if (this.buildToolbar) {
      this.buildToolbar.setPosition(this.toolbarOffsetX, this.toolbarOffsetY);
    }
    
    // Mettre à jour les positions des éléments UI
    // (On pourrait recréer l'UI complètement, mais pour simplifier on ajuste juste)
  }

  setupInputHandlers() {
    // Gestion des clics normaux et tactiles
    this.input.on("pointerdown", (pointer) => {
      // Vérifier si le clic est sur la toolbar
      if (this.isPointerOnToolbar(pointer)) {
        // Ne pas gérer les clics sur la toolbar comme des clics de jeu
        return;
      }
      
      // Si on est en train de drag, gérer le placement
      if (this.draggingTurret) {
        if (pointer.rightButtonDown()) {
          this.cancelDrag();
        }
        return;
      }
      
      // Masquer les menus par défaut
      this.buildMenu.setVisible(false);
      this.upgradeMenu.setVisible(false);
      this.selectedTurret = null;

      // Clic droit ou long press sur mobile
      if (pointer.rightButtonDown()) {
        this.handleRightClick(pointer);
      } else if (pointer.isDown) {
        // Démarrer le timer pour long press
        this.longPressTimer = this.time.delayedCall(this.longPressDelay, () => {
          this.handleRightClick(pointer);
        });
      }
    });

    // Annuler le long press si on relève le doigt
    this.input.on("pointerup", (pointer) => {
      if (this.longPressTimer) {
        this.longPressTimer.remove();
        this.longPressTimer = null;
        // C'est un clic normal, pas un long press
        if (!this.draggingTurret && !this.isPointerOnToolbar(pointer)) {
          this.handleNormalClick(pointer);
        }
      }
      
      // Si on drag, placer au clic gauche (mais pas si on est sur la toolbar)
      if (this.draggingTurret && pointer.leftButtonReleased() && !this.isPointerOnToolbar(pointer)) {
        this.placeDraggedTurret(pointer);
      }
    });
  }

  // Vérifier si le pointeur est sur la toolbar
  isPointerOnToolbar(pointer) {
    if (!this.buildToolbar) return false;
    
    const toolbarY = this.toolbarOffsetY;
    const toolbarHeight = 120 * this.scaleFactor; // Utiliser la nouvelle hauteur
    
    return pointer.worldY >= toolbarY && pointer.worldY <= toolbarY + toolbarHeight;
  }

  handleNormalClick(pointer) {
    // Gérer les clics sur les boutons UI
  }

  update(time, delta) {
    this.turrets.forEach((t) => t.update(time, this.enemies));
    this.barracks.forEach((b) => b.update(time));
    this.soldiers.children.each((soldier) => {
      if (soldier && soldier.active) {
        soldier.update();
      }
    });
    
    // Mettre à jour le preview de placement si on drag
    if (this.draggingTurret) {
      this.updatePlacementPreview();
    }
  }

  // =========================================================
  // GESTION CARTE & CHEMINS (délégué à MapManager)
  // =========================================================
  
  addDecoration(px, py) {
    // Garder quelques petites décorations pour la variété
    if (Math.random() > 0.95) {
      const T = CONFIG.TILE_SIZE * this.scaleFactor;
      const dx = px + Phaser.Math.Between(10, T - 10) * this.scaleFactor;
      const dy = py + Phaser.Math.Between(10, T - 10) * this.scaleFactor;
      if (Math.random() > 0.5) {
        const deco1 = this.add.circle(dx, dy, 3 * this.scaleFactor, 0xffaa00).setDepth(1);
        const deco2 = this.add.circle(dx + 2 * this.scaleFactor, dy + 2 * this.scaleFactor, 2 * this.scaleFactor, 0x00ff00).setDepth(1);
      } else {
        this.add.circle(dx, dy, 4 * this.scaleFactor, 0x555555).setDepth(1);
      }
    }
  }

  // =========================================================
  // VAGUES
  // =========================================================

  startWave() {
    this.waveManager.startWave();
  }
  
  monitorWaveEnd() {
    this.waveManager.monitorWaveEnd();
  }
  
  finishWave() {
    this.waveManager.finishWave();
  }
  
  levelComplete() {
    this.waveManager.levelComplete();
  }

  // =========================================================
  // GESTION CLICS & MENUS
  // =========================================================

  handleRightClick(pointer) {
    const T = CONFIG.TILE_SIZE * this.scaleFactor;
    
    // Vérifier si le clic est dans la zone de la map
    if (pointer.worldY < this.mapStartY || pointer.worldY > this.mapStartY + 15 * T) return;
    if (pointer.worldX < this.mapStartX || pointer.worldX > this.mapStartX + 15 * T) return;

    // Convertir clic en coordonnées Grille
    const tx = Math.floor((pointer.worldX - this.mapStartX) / T);
    const ty = Math.floor((pointer.worldY - this.mapStartY) / T);

    if (tx < 0 || tx >= 15 || ty < 0 || ty >= 15) return;

    // Vérifier si une tourelle ou barracks est sur cette case
    let clickedTurret = null;
    for (const t of this.turrets) {
      const turretTx = Math.floor((t.x - this.mapStartX) / T);
      const turretTy = Math.floor((t.y - this.mapStartY) / T);
      if (turretTx === tx && turretTy === ty) {
        clickedTurret = t;
        break;
      }
    }
    // Vérifier aussi les barracks
    if (!clickedTurret) {
      for (const b of this.barracks) {
        const barracksTx = Math.floor((b.x - this.mapStartX) / T);
        const barracksTy = Math.floor((b.y - this.mapStartY) / T);
        if (barracksTx === tx && barracksTy === ty) {
          clickedTurret = b;
          break;
        }
      }
    }

    if (clickedTurret) {
      // Clic exact sur la tourelle -> Upgrade
      this.uiManager.openUpgradeMenu(pointer, clickedTurret);
    } else {
      // Clic sur case vide -> Build
      this.uiManager.openBuildMenu(pointer);
    }
  }

  // Vérifier si une case est adjacente à un chemin
  isAdjacentToPath(tx, ty) {
    return this.mapManager.isAdjacentToPath(tx, ty);
  }


  triggerUpgrade() {
    if (!this.selectedTurret) return;
    const nextStats = this.selectedTurret.getNextLevelStats();
    if (!nextStats) return;

    const cost = nextStats.cost;

    if (this.money >= cost) {
      this.money -= cost;
      this.updateUI();

      this.selectedTurret.upgrade();

      this.upgradeMenu.setVisible(false);
      this.selectedTurret = null;
    } else {
      this.cameras.main.shake(50, 0.005);
    }
  }

  buildTurret(turretConfig, tileX, tileY) {
    // Vérifier qu'il n'y a pas d'arbre ici
    if (this.mapManager.hasTree(tileX, tileY)) {
      return false;
    }
    
    // Vérifier si c'est une barracks
    const isBarracks = turretConfig.key === "barracks";
    
    // Limiter les barracks à 5 maximum
    if (isBarracks && this.barracks.length >= this.maxBarracks) {
      this.cameras.main.shake(50, 0.005);
      const errorText = this.add.text(
        this.gameWidth / 2,
        this.gameHeight / 2,
        `Maximum ${this.maxBarracks} casernes!`,
        {
          fontSize: `${Math.max(16, 24 * this.scaleFactor)}px`,
          fill: "#ff0000",
          fontStyle: "bold",
        }
      ).setOrigin(0.5).setDepth(300);
      
      this.tweens.add({
        targets: errorText,
        alpha: 0,
        y: errorText.y - 30,
        duration: 2000,
        onComplete: () => errorText.destroy(),
      });
      return false;
    }
    
    // Pour les barracks, vérifier qu'on peut poser uniquement sur les cases adjacentes aux chemins
    if (isBarracks && !this.mapManager.isAdjacentToPath(tileX, tileY)) {
      this.cameras.main.shake(50, 0.005);
      return false;
    }
    
    if (this.money >= turretConfig.cost) {
      this.money -= turretConfig.cost;
      this.updateUI();
      const T = CONFIG.TILE_SIZE * this.scaleFactor;
      const px = this.mapStartX + tileX * T + T / 2;
      const py = this.mapStartY + tileY * T + T / 2;
      
      if (isBarracks) {
        const b = new Barracks(this, px, py, turretConfig);
        b.setDepth(20);
        b.setScale(this.scaleFactor);
        this.barracks.push(b);
        b.deploySoldiers();
      } else {
        const t = new Turret(this, px, py, turretConfig);
        t.setDepth(20);
        t.setScale(this.scaleFactor);
        this.turrets.push(t);
      }
      
      this.levelConfig.map[tileY][tileX] = 9;
      // Mettre à jour les compteurs de la toolbar
      this.updateToolbarCounts();
      return true;
    } else {
      this.cameras.main.shake(50, 0.005);
      return false;
    }
  }

  takeDamage() {
    this.lives--;
    this.updateUI();
    this.cameras.main.shake(150, 0.01);
    if (this.lives <= 0) {
      alert("PERDU !");
      this.scene.start("MainMenuScene");
    }
  }

  earnMoney(amount) {
    this.money += amount;
    this.updateUI();
  }

  updateUI() {
    if (this.txtMoney) this.txtMoney.setText(`💰 ${this.money}`);
    if (this.txtLives) this.txtLives.setText(`❤️ ${this.lives}`);
    this.updateToolbarCounts();
    // Mettre à jour les boutons du menu de construction si visible
    if (this.buildMenu && this.buildMenu.visible) {
      this.uiManager.updateBuildMenuButtons();
    }
  }

  // =========================================================
  // GESTION UI (délégué à UIManager)
  // =========================================================

  // Créer la toolbar de construction en bas (sous la map)
  createBuildToolbar() {
    const toolbarX = this.toolbarOffsetX || 10 * this.scaleFactor;
    const toolbarY = this.toolbarOffsetY;
    const itemSize = 80 * this.scaleFactor; // Augmenté de 60 à 80
    const itemSpacing = 90 * this.scaleFactor; // Augmenté de 70 à 90
    
    this.buildToolbar = this.add.container(toolbarX, toolbarY).setDepth(150);
    
    // Fond de la toolbar (plus grande)
    const toolbarBg = this.add.graphics();
    const toolbarWidth = 5 * itemSpacing + 40 * this.scaleFactor; // Plus large
    const toolbarHeight = 120 * this.scaleFactor; // Plus haute (au lieu de CONFIG.TOOLBAR_HEIGHT)
    toolbarBg.fillStyle(0x000000, 0.9);
    toolbarBg.fillRoundedRect(0, 0, toolbarWidth, toolbarHeight, 10);
    toolbarBg.lineStyle(3, 0xffffff, 0.6);
    toolbarBg.strokeRoundedRect(0, 0, toolbarWidth, toolbarHeight, 10);
    this.buildToolbar.add(toolbarBg);
    
    // Créer les boutons pour chaque type de tourelle
    const turretTypes = [
      { key: "machine_gun", config: TURRETS.machine_gun },
      { key: "sniper", config: TURRETS.sniper },
      { key: "cannon", config: TURRETS.cannon },
      { key: "zap", config: TURRETS.zap },
      { key: "barracks", config: TURRETS.barracks },
    ];
    
    this.toolbarButtons = [];
    
    turretTypes.forEach((item, index) => {
      // Centrer les boutons dans la toolbar
      const totalWidth = 5 * itemSpacing;
      const startX = (toolbarWidth - totalWidth) / 2 + itemSpacing / 2;
      const x = startX + index * itemSpacing;
      const y = toolbarHeight / 2; // Centrer verticalement
      
      // Container pour le bouton
      const btnContainer = this.add.container(x, y);
      
      // Fond du bouton (plus grand)
      const btnBg = this.add.rectangle(0, 0, itemSize, itemSize, 0x333333, 0.9);
      btnBg.setStrokeStyle(3, 0x666666);
      btnBg.setInteractive({ useHandCursor: true });
      
      // Miniature du bâtiment avec le vrai visuel (plus grande)
      const previewContainer = this.add.container(0, 0);
      this.drawTurretPreview(previewContainer, item.config);
      previewContainer.setScale(0.5 * this.scaleFactor); // Augmenté de 0.3 à 0.5
      
      // Texte avec nombre construit / maximum (plus grand)
      const countText = this.add.text(0, itemSize / 2 + 12 * this.scaleFactor, "", {
        fontSize: `${Math.max(14, 16 * this.scaleFactor)}px`,
        fill: "#ffffff",
        fontStyle: "bold",
      }).setOrigin(0.5);
      
      // Fonction pour mettre à jour le compteur
      const updateCount = () => {
        // Vérifier que les objets sont encore valides avant de les manipuler
        if (!countText || countText.active === false) {
          return;
        }
        if (!btnBg || btnBg.active === false) {
          return;
        }
        
        try {
          if (item.key === "barracks") {
            const count = this.barracks.length;
            const max = this.maxBarracks;
            countText.setText(`${count}/${max}`);
            countText.setColor(count >= max ? "#ff0000" : "#ffffff");
            btnBg.setFillStyle(count >= max ? 0x330000 : 0x333333);
          } else {
            const count = this.turrets.filter(t => t.config.key === item.key).length;
            countText.setText(`${count}`);
          }
        } catch (e) {
          // Ignorer si les objets ont été détruits
          console.warn("Erreur lors de la mise à jour du compteur:", e);
        }
      };
      
      btnContainer.add([btnBg, previewContainer, countText]);
      this.buildToolbar.add(btnContainer);
      
      // Gestion du clic pour démarrer le drag
      btnBg.on("pointerdown", (pointer) => {
        // Vérifier les limites
        if (item.key === "barracks" && this.barracks.length >= this.maxBarracks) {
          this.cameras.main.shake(50, 0.005);
          return;
        }
        
        if (this.money >= item.config.cost) {
          this.startDrag(item.config);
        } else {
          this.cameras.main.shake(50, 0.005);
        }
      });
      
      this.toolbarButtons.push({
        container: btnContainer,
        config: item.config,
        updateCount: updateCount,
      });
    });
    
    // Mettre à jour les compteurs
    this.updateToolbarCounts();
  }
  
  // Dessiner une miniature du bâtiment pour la toolbar avec le vrai visuel
  drawTurretPreview(container, config) {
    // Dessiner la base (cercle simple)
    const base = this.add.graphics();
    base.fillStyle(config.color || 0x888888, 0.8);
    base.fillCircle(0, 0, 25);
    base.lineStyle(2, 0xffffff, 0.5);
    base.strokeCircle(0, 0, 25);
    container.add(base);
    
    // Dessiner le canon/barrel avec la fonction onDrawBarrel si elle existe
    if (config.onDrawBarrel) {
      const barrelContainer = this.add.container(0, 0);
      // Créer un objet turret factice pour onDrawBarrel
      const fakeTurret = { level: 1 };
      try {
        config.onDrawBarrel(this, barrelContainer, config.color, fakeTurret);
        container.add(barrelContainer);
      } catch (e) {
        console.warn("Erreur lors du dessin de la prévisualisation:", e);
        // Fallback : dessin simple
        const fallback = this.add.graphics();
        fallback.fillStyle(0xffffff);
        fallback.fillRect(0, -3, 15, 6);
        container.add(fallback);
      }
    } else {
      // Fallback : dessin simple si pas de onDrawBarrel
      const fallback = this.add.graphics();
      fallback.fillStyle(0xffffff);
      fallback.fillRect(0, -3, 15, 6);
      container.add(fallback);
    }
  }
  
  // Mettre à jour les compteurs de la toolbar
  updateToolbarCounts() {
    // Vérifier que toolbarButtons existe et est un tableau valide
    if (!this.toolbarButtons || !Array.isArray(this.toolbarButtons)) {
      return;
    }
    
    // Filtrer les boutons invalides (références vers objets détruits)
    this.toolbarButtons = this.toolbarButtons.filter(btn => btn && btn.updateCount);
    
    // Mettre à jour chaque bouton avec protection
    this.toolbarButtons.forEach(btn => {
      try {
        if (btn && btn.updateCount) {
          btn.updateCount();
        }
      } catch (e) {
        // Ignorer si un ancien bouton traîne encore
        console.warn("Erreur lors de la mise à jour d'un bouton de toolbar:", e);
      }
    });
  }
  
  // Démarrer le drag d'une tourelle
  startDrag(turretConfig) {
    if (!turretConfig || !this.scene || !this.scene.isActive()) return;
    
    this.draggingTurret = turretConfig;
    
    // Créer un aperçu qui suit le curseur
    if (this.placementPreview && this.placementPreview.active !== false) {
      try {
        this.placementPreview.destroy();
      } catch (e) {
        // Ignorer si déjà détruit
      }
    }
    
    try {
      const preview = this.add.graphics();
      preview.fillStyle(turretConfig.color || 0x888888, 0.6);
      preview.fillCircle(0, 0, 20 * this.scaleFactor);
      preview.lineStyle(2, turretConfig.color || 0x888888);
      preview.strokeCircle(0, 0, 20 * this.scaleFactor);
      preview.setDepth(200);
      this.placementPreview = preview;
      
      // Afficher les cellules valides
      this.showValidPlacementCells();
    } catch (e) {
      console.warn("Erreur lors du démarrage du drag:", e);
      this.draggingTurret = null;
    }
  }
  
  // Mettre à jour l'aperçu de placement
  updatePlacementPreview() {
    if (!this.placementPreview || !this.draggingTurret) {
      // Si le preview est détruit, annuler le drag
      if (!this.placementPreview && this.draggingTurret) {
        this.draggingTurret = null;
      }
      return;
    }
    
    // Vérifier que le preview est toujours actif
    if (this.placementPreview.active === false) {
      this.draggingTurret = null;
      this.placementPreview = null;
      return;
    }
    
    try {
      const pointer = this.input.activePointer;
      if (!pointer) return;
      
      const T = CONFIG.TILE_SIZE * this.scaleFactor;
      
      // Suivre le curseur
      this.placementPreview.setPosition(pointer.worldX, pointer.worldY);
      
      // Convertir en coordonnées de tile
      const tx = Math.floor((pointer.worldX - this.mapStartX) / T);
      const ty = Math.floor((pointer.worldY - this.mapStartY) / T);
      
      // Vérifier si on peut poser ici
      let canPlace = false;
      if (tx >= 0 && tx < 15 && ty >= 0 && ty < 15 && this.levelConfig && this.levelConfig.map) {
        const tileType = this.levelConfig.map[ty][tx];
        if (tileType === 0) { // Herbe
          // Vérifier qu'il n'y a pas d'arbre ici
          const hasTree = this.mapManager && this.mapManager.hasTree ? this.mapManager.hasTree(tx, ty) : false;
          if (!hasTree) {
            if (this.draggingTurret.key === "barracks") {
              canPlace = this.mapManager && this.mapManager.isAdjacentToPath ? 
                this.mapManager.isAdjacentToPath(tx, ty) && this.money >= this.draggingTurret.cost : false;
            } else {
              canPlace = this.money >= this.draggingTurret.cost;
            }
          }
        }
      }
      
      // Changer la couleur selon si on peut poser
      this.placementPreview.clear();
      const color = canPlace ? 0x00ff00 : 0xff0000;
      this.placementPreview.fillStyle(color, 0.4);
      this.placementPreview.fillCircle(0, 0, 20 * this.scaleFactor);
      this.placementPreview.lineStyle(2, color);
      this.placementPreview.strokeCircle(0, 0, 20 * this.scaleFactor);
    } catch (e) {
      console.warn("Erreur lors de la mise à jour du preview:", e);
      // Annuler le drag en cas d'erreur
      this.draggingTurret = null;
      if (this.placementPreview && this.placementPreview.active !== false) {
        try {
          this.placementPreview.destroy();
        } catch (e2) {
          // Ignorer
        }
      }
      this.placementPreview = null;
    }
  }
  
  // Afficher les cellules où on peut poser
  showValidPlacementCells() {
    // Supprimer l'ancien aperçu
    if (this.validCellsPreview) {
      this.validCellsPreview.forEach(cell => cell.destroy());
      this.validCellsPreview = [];
    } else {
      this.validCellsPreview = [];
    }
    
    const T = CONFIG.TILE_SIZE * this.scaleFactor;
    
    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 15; x++) {
        const tileType = this.levelConfig.map[y][x];
        if (tileType === 0) { // Herbe
          // Vérifier qu'il n'y a pas d'arbre ici
          const hasTree = this.mapManager.hasTree(x, y);
          if (!hasTree) {
            let canPlace = false;
            if (this.draggingTurret.key === "barracks") {
              canPlace = this.mapManager.isAdjacentToPath(x, y) && this.money >= this.draggingTurret.cost;
            } else {
              canPlace = this.money >= this.draggingTurret.cost;
            }
            
            if (canPlace) {
              const px = this.mapStartX + x * T + T / 2;
              const py = this.mapStartY + y * T + T / 2;
              const cell = this.add.rectangle(px, py, T - 4, T - 4, 0x00ff00, 0.2);
              cell.setStrokeStyle(2, 0x00ff00, 0.5);
              cell.setDepth(1);
              this.validCellsPreview.push(cell);
            }
          }
        }
      }
    }
  }
  
  // Placer la tourelle draguee
  placeDraggedTurret(pointer) {
    if (!this.draggingTurret) return;
    
    const T = CONFIG.TILE_SIZE * this.scaleFactor;
    
    const tx = Math.floor((pointer.worldX - this.mapStartX) / T);
    const ty = Math.floor((pointer.worldY - this.mapStartY) / T);
    
    if (tx >= 0 && tx < 15 && ty >= 0 && ty < 15) {
      const tileType = this.levelConfig.map[ty][tx];
      if (tileType === 0) { // Herbe
        // Vérifier qu'il n'y a pas d'arbre ici
        const hasTree = this.mapManager.hasTree(tx, ty);
        if (!hasTree) {
          const success = this.buildTurret(this.draggingTurret, tx, ty);
          if (success) {
            this.cancelDrag();
            this.updateToolbarCounts();
          }
        } else {
          this.cameras.main.shake(50, 0.005);
        }
      }
    }
  }
  
  // Annuler le drag
  cancelDrag() {
    this.draggingTurret = null;
    
    if (this.placementPreview) {
      this.placementPreview.destroy();
      this.placementPreview = null;
    }
    
    if (this.validCellsPreview) {
      this.validCellsPreview.forEach(cell => cell.destroy());
      this.validCellsPreview = [];
    }
  }

  generateTextures() {
    const T = CONFIG.TILE_SIZE;
    
    // Vérifier que le système de textures est disponible
    if (!this.textures || !this.make) {
      console.warn("Système de textures non disponible");
      return;
    }
    
    const g = this.make.graphics({ add: false });
    if (!g) {
      console.warn("Impossible de créer l'objet Graphics");
      return;
    }
    
    // Fonction helper pour générer une texture seulement si elle n'existe pas
    const generateIfNotExists = (key, drawFunc) => {
      try {
        if (!this.textures || !g) {
          console.warn(`Système de textures ou Graphics non disponible pour ${key}`);
          return;
        }
        if (this.textures.exists(key)) {
          return; // Texture déjà existante, ne pas regénérer
        }
        if (g.active === false || !g.clear) {
          console.warn(`Graphics object détruit ou invalide, impossible de générer ${key}`);
          return;
        }
        g.clear();
        drawFunc();
        // Vérifier que g est toujours valide avant de générer
        if (g && g.active !== false && g.generateTexture) {
          g.generateTexture(key, T, T);
        }
      } catch (e) {
        console.warn(`Erreur lors de la génération de la texture ${key}:`, e);
      }
    };

    // tile_grass_1
    generateIfNotExists("tile_grass_1", () => {
      g.fillStyle(0x2d8a3e, 1);
      g.fillRect(0, 0, T, T);
      for (let i = 0; i < 40; i++) {
        g.fillStyle(0x3da850, 0.5);
        g.fillRect(Math.random() * T, Math.random() * T, 2, 2);
      }
    });

    // tile_grass_2
    generateIfNotExists("tile_grass_2", () => {
      g.fillStyle(0x267534, 1);
      g.fillRect(0, 0, T, T);
      for (let i = 0; i < 40; i++) {
        g.fillStyle(0x3da850, 0.3);
        g.fillRect(Math.random() * T, Math.random() * T, 2, 2);
      }
    });

    // tile_path
    generateIfNotExists("tile_path", () => {
      g.fillStyle(0xdbb679, 1);
      g.fillRect(0, 0, T, T);
      g.fillStyle(0xbf9b5e, 0.6);
      for (let i = 0; i < 60; i++)
        g.fillRect(Math.random() * T, Math.random() * T, 3, 3);
      g.fillStyle(0xa88548, 0.8);
      g.fillRect(0, 0, T, 4);
      g.fillRect(0, T - 4, T, 4);
      g.fillRect(0, 0, 4, T);
      g.fillRect(T - 4, 0, 4, T);
    });

    // tile_base
    generateIfNotExists("tile_base", () => {
      g.fillStyle(0x333333, 1);
      g.fillRect(0, 0, T, T);
      g.lineStyle(3, 0x00ffff, 1);
      g.strokeRect(6, 6, T - 12, T - 12);
      g.fillStyle(0x00ffff, 0.5);
      g.fillCircle(T / 2, T / 2, 10);
    });

    // tile_water
    generateIfNotExists("tile_water", () => {
      g.fillStyle(0x4488ff, 1);
      g.fillRect(0, 0, T, T);
      g.lineStyle(2, 0xffffff, 0.3);
      g.beginPath();
      g.moveTo(10, 20);
      g.lineTo(25, 20);
      g.strokePath();
      g.beginPath();
      g.moveTo(40, 50);
      g.lineTo(55, 50);
      g.strokePath();
    });

    // tile_bridge
    generateIfNotExists("tile_bridge", () => {
      g.fillStyle(0x4488ff, 1);
      g.fillRect(0, 0, T, T);
      g.fillStyle(0x8b5a2b, 1);
      g.fillRect(4, 0, T - 8, T);
      g.lineStyle(2, 0x5c3a1e, 1);
      g.beginPath();
      g.moveTo(4, 16);
      g.lineTo(T - 4, 16);
      g.strokePath();
      g.beginPath();
      g.moveTo(4, 32);
      g.lineTo(T - 4, 32);
      g.strokePath();
      g.beginPath();
      g.moveTo(4, 48);
      g.lineTo(T - 4, 48);
      g.strokePath();
    });
    
    // Ne pas détruire l'objet Graphics ici car il peut être réutilisé
    // Il sera nettoyé automatiquement par Phaser quand la scène est détruite
  }

  shutdown() {
    // Rendre shutdown() idempotent : safe si appelé plusieurs fois
    
    // Nettoyer tous les listeners d'input pour éviter les handlers sur objets détruits
    try {
      if (this.input) {
        this.input.removeAllListeners();
      }
      if (this.input && this.input.keyboard) {
        this.input.keyboard.removeAllListeners();
      }
    } catch (e) {
      // Ignorer si déjà nettoyé
    }

    // Nettoyer tous les objets avant de redémarrer la scène
    if (this.upgradeTextLines && this.upgradeTextLines.length > 0) {
      this.upgradeTextLines.forEach(line => {
        if (line && line.active !== false) {
          try {
            if (this.upgradeMenu && this.upgradeMenu.remove) {
              this.upgradeMenu.remove(line);
            }
            if (line.destroy) {
              line.destroy();
            }
          } catch (e) {
            // Ignorer les erreurs
          }
        }
      });
      this.upgradeTextLines = [];
    }

    if (this.placementPreview && this.placementPreview.active) {
      try {
        this.placementPreview.destroy();
      } catch (e) {
        // Ignorer
      }
      this.placementPreview = null;
    }

    if (this.validCellsPreview && this.validCellsPreview.length > 0) {
      this.validCellsPreview.forEach(cell => {
        if (cell && cell.active !== false) {
          try {
            cell.destroy();
          } catch (e) {
            // Ignorer
          }
        }
      });
      this.validCellsPreview = [];
    }

    // Nettoyer les managers
    try {
      if (this.mapManager && this.mapManager.treePositions) {
        this.mapManager.treePositions.clear();
      }
    } catch (e) {
      // Ignorer si déjà détruit
    }

    // Arrêter tous les timers
    try {
      if (this.time && this.time.removeAllEvents) {
        this.time.removeAllEvents();
      }
    } catch (e) {
      // Ignorer si déjà détruit
    }

    // Arrêter tous les tweens
    try {
      if (this.tweens && this.tweens.killAll) {
        this.tweens.killAll();
      }
    } catch (e) {
      // Ignorer si déjà détruit
    }

    // Nettoyer les groupes - VÉRIFIER QUE children EXISTE AVANT clear()
    try {
      if (this.enemies && this.enemies.children && this.enemies.children.size !== undefined) {
        this.enemies.clear(true, true);
      }
    } catch (e) {
      // Ignorer si le groupe est déjà détruit (children devient undefined)
    }
    
    try {
      if (this.soldiers && this.soldiers.children && this.soldiers.children.size !== undefined) {
        this.soldiers.clear(true, true);
      }
    } catch (e) {
      // Ignorer si le groupe est déjà détruit
    }

    // Nettoyer les tourelles et casernes
    if (this.turrets) {
      this.turrets.forEach(t => {
        if (t && t.active !== false) {
          try {
            t.destroy();
          } catch (e) {
            // Ignorer
          }
        }
      });
      this.turrets = [];
    }

    if (this.barracks) {
      this.barracks.forEach(b => {
        if (b && b.active !== false) {
          try {
            b.destroy();
          } catch (e) {
            // Ignorer
          }
        }
      });
      this.barracks = [];
    }

    // Détruire la toolbar et les menus
    try {
      if (this.buildToolbar && this.buildToolbar.destroy) {
        this.buildToolbar.destroy(true);
      }
    } catch (e) {
      // Ignorer si déjà détruit
    }
    this.buildToolbar = null;
    this.toolbarButtons = null;
    
    try {
      if (this.buildMenu && this.buildMenu.destroy) {
        this.buildMenu.destroy(true);
      }
    } catch (e) {
      // Ignorer si déjà détruit
    }
    this.buildMenu = null;
    
    try {
      if (this.upgradeMenu && this.upgradeMenu.destroy) {
        this.upgradeMenu.destroy(true);
      }
    } catch (e) {
      // Ignorer si déjà détruit
    }
    this.upgradeMenu = null;
    
    // Réinitialiser les variables d'état
    this.draggingTurret = null;
    this.selectedTurret = null;
    this.longPressTimer = null;
    this.txtMoney = null;
    this.txtLives = null;
    this.waveBtnContainer = null;
    this.waveBtnBg = null;
    this.waveBtnText = null;
  }
}
