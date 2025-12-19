import { CONFIG } from "../config/settings.js";
import { LEVELS_CONFIG } from "../config/levels/index.js";
import { TURRETS } from "../config/turrets/index.js";
import { lightning as LIGHTNING_SPELL } from "../sorts/lightning.js";
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
    if (typeof structuredClone !== "undefined") {
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
    this.nextWaveAutoTimer = null; // Timer pour le lancement automatique
    this.nextWaveCountdown = 0; // Compte à rebours en secondes
    this.waveSpawnTimers = []; // Liste des timers de spawn des ennemis
    this.endCheckTimer = null; // Timer de vérification de fin de vague
    this.selectedTurret = null;
    this.maxBarracks = 5;
    this.draggingTurret = null;
    this.placementPreview = null;
    this.validCellsPreview = [];
    this.upgradeTextLines = []; // Pour stocker les lignes de texte du menu
    this.tileHighlight = null; // Highlight visuel sur la case survolée
    this.placingSpell = null; // Sort en cours de placement
    this.spellPreview = null; // Preview de la zone du sort
    this.lightningCooldown = 0; // Cooldown du sort éclair (0 = disponible)
    this.lightningOnCooldown = false; // Flag pour empêcher les clics multiples

    // Réinitialiser toutes les références UI pour éviter les références vers objets détruits
    this.buildToolbar = null;
    this.toolbarButtons = null;
    this.txtMoney = null;
    this.txtLives = null;
    this.txtWave = null;
    this.txtWave = null;
    this.buildMenu = null;
    this.upgradeMenu = null;
    this.treeRemovalMenu = null;
    this.treeRemovalTile = null;
    this.waveBtnContainer = null;
    this.waveBtnBg = null;
    this.waveBtnText = null;
    this.toolbarTooltip = null; // Tooltip pour la toolbar
    this.isPaused = false; // État de pause
    this.pauseBtn = null; // Bouton pause
    this.resumeBtn = null; // Bouton reprendre au centre de l'écran
    this.pausedTimers = []; // Liste des timers en pause
    this.pausedTweens = []; // Liste des tweens en pause
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
        console.warn(
          "Erreur lors de la génération des textures dans create():",
          e
        );
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

    // Gestion de la touche Echap pour annuler le drag ou le sort
    this.input.keyboard.on("keydown-ESC", () => {
      if (this.placingSpell) {
        this.cancelSpellPlacement();
      } else {
        this.cancelDrag();
      }
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
    const totalHeightNeeded =
      uiHeight + mapHeight + toolbarMargin + toolbarHeight + toolbarMargin;

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
    this.toolbarOffsetY =
      this.mapOffsetY + mapHeightScaled + toolbarMarginScaled;

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
    // Highlight visuel sur la case survolée
    this.input.on("pointermove", (pointer) => {
      const T = CONFIG.TILE_SIZE * this.scaleFactor;

      // Vérifier si le pointeur est dans la zone de la map
      if (
        pointer.worldY < this.mapStartY ||
        pointer.worldY > this.mapStartY + 15 * T ||
        pointer.worldX < this.mapStartX ||
        pointer.worldX > this.mapStartX + 15 * T
      ) {
        if (this.tileHighlight) {
          this.tileHighlight.setVisible(false);
        }
        return;
      }

      // Convertir en coordonnées grille
      const tx = Math.floor((pointer.worldX - this.mapStartX) / T);
      const ty = Math.floor((pointer.worldY - this.mapStartY) / T);

      if (tx < 0 || tx >= 15 || ty < 0 || ty >= 15) {
        if (this.tileHighlight) {
          this.tileHighlight.setVisible(false);
        }
        return;
      }

      // Créer ou mettre à jour le highlight
      if (!this.tileHighlight) {
        this.tileHighlight = this.add.graphics();
        this.tileHighlight.setDepth(1);
      }

      const px = this.mapStartX + tx * T;
      const py = this.mapStartY + ty * T;

      this.tileHighlight.clear();
      this.tileHighlight.lineStyle(2, 0xffffff, 0.3); // Border très léger
      this.tileHighlight.strokeRect(px, py, T, T);
      this.tileHighlight.setVisible(true);
    });

    // Gestion des clics normaux et tactiles
    this.input.on("pointerdown", (pointer) => {
      // Si le jeu est en pause, ne pas gérer les clics (sauf sur le bouton pause)
      if (this.isPaused) {
        return;
      }
      // Masquer les menus par défaut
      this.buildMenu.setVisible(false);
      this.upgradeMenu.setVisible(false);
      if (this.treeRemovalMenu) {
        this.treeRemovalMenu.setVisible(false);
      }
      this.selectedTurret = null;

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
      if (
        this.draggingTurret &&
        pointer.leftButtonReleased() &&
        !this.isPointerOnToolbar(pointer)
      ) {
        this.placeDraggedTurret(pointer);
      }

      // Si on place un sort, gérer le clic
      if (this.placingSpell && pointer.leftButtonReleased()) {
        if (!this.isPointerOnToolbar(pointer)) {
          this.placeLightning(pointer.worldX, pointer.worldY);
        }
      }

      // Annuler le placement du sort avec clic droit
      if (this.placingSpell && pointer.rightButtonReleased()) {
        this.cancelSpellPlacement();
      }
    });
  }

  // Vérifier si le pointeur est sur la toolbar
  isPointerOnToolbar(pointer) {
    if (!this.buildToolbar) return false;

    const toolbarY = this.toolbarOffsetY;
    const toolbarHeight = 120 * this.scaleFactor; // Utiliser la nouvelle hauteur

    return (
      pointer.worldY >= toolbarY && pointer.worldY <= toolbarY + toolbarHeight
    );
  }

  handleNormalClick(pointer) {
    // Gérer les clics sur les boutons UI
  }

  update(time, delta) {
    // Si le jeu est en pause, ne rien mettre à jour
    if (this.isPaused) {
      return;
    }
    // Mettre à jour le cooldown du sort
    if (this.lightningCooldown > 0) {
      this.lightningCooldown -= delta;
      if (this.lightningCooldown <= 0) {
        this.lightningCooldown = 0;
        // Réinitialiser le flag quand le cooldown est terminé
        this.lightningOnCooldown = false;
      }
      this.updateLightningSpellButton();
    } else if (this.lightningOnCooldown) {
      // S'assurer que le flag est réinitialisé si le cooldown est déjà à 0
      this.lightningOnCooldown = false;
      this.updateLightningSpellButton();
    }

    // Le compte à rebours est géré par le timer dans WaveManager, pas besoin de le mettre à jour ici

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
        const deco1 = this.add
          .circle(dx, dy, 3 * this.scaleFactor, 0xffaa00)
          .setDepth(1);
        const deco2 = this.add
          .circle(
            dx + 2 * this.scaleFactor,
            dy + 2 * this.scaleFactor,
            2 * this.scaleFactor,
            0x00ff00
          )
          .setDepth(1);
      } else {
        this.add.circle(dx, dy, 4 * this.scaleFactor, 0x555555).setDepth(1);
      }
    }
  }

  // =========================================================
  // VAGUES
  // =========================================================

  startWave() {
    // Annuler le timer automatique si le joueur lance manuellement
    if (this.nextWaveAutoTimer) {
      this.nextWaveAutoTimer.remove();
      this.nextWaveAutoTimer = null;
      this.nextWaveCountdown = 0;
    }
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

  // Dans GameScene.js

  handleRightClick(pointer) {
    const T = CONFIG.TILE_SIZE * this.scaleFactor;

    // Vérifier si le clic est dans la zone de la map
    if (
      pointer.worldY < this.mapStartY ||
      pointer.worldY > this.mapStartY + 15 * T
    )
      return;
    if (
      pointer.worldX < this.mapStartX ||
      pointer.worldX > this.mapStartX + 15 * T
    )
      return;

    // Convertir clic en coordonnées Grille
    const tx = Math.floor((pointer.worldX - this.mapStartX) / T);
    const ty = Math.floor((pointer.worldY - this.mapStartY) / T);

    if (tx < 0 || tx >= 15 || ty < 0 || ty >= 15) return;

    // Vérifier si une tourelle ou barracks est sur cette case
    let clickedTurret = null;
    for (const t of this.turrets) {
      // ... (code existant inchangé pour trouver la tourelle) ...
      const turretTx = Math.floor((t.x - this.mapStartX) / T);
      const turretTy = Math.floor((t.y - this.mapStartY) / T);
      if (turretTx === tx && turretTy === ty) {
        clickedTurret = t;
        break;
      }
    }
    if (!clickedTurret) {
      for (const b of this.barracks) {
        // ... (code existant inchangé pour trouver la caserne) ...
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
      // Vérifier le type de terrain AVANT d'ouvrir le menu
      // 0 = Herbe (Constructible), tout le reste (Chemin, Eau, Base) = Non constructible
      const tileType = this.levelConfig.map[ty][tx];

      if (tileType !== 0 && tileType !== 6) {
        // C'est un chemin ou un obstacle, on ne fait rien (pas de menu)
        return;
      }

      // Vérifier s'il y a un arbre sur cette case
      if (this.mapManager.hasTree(tx, ty)) {
        // Ouvrir le menu de confirmation pour enlever l'arbre
        this.uiManager.openTreeRemovalConfirmation(pointer, tx, ty);
        return;
      }

      // Clic sur case vide ET constructible -> Build
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
    // --- CORRECTION ICI ---
    // Vérification stricte du terrain : Si ce n'est pas de l'herbe (0), on refuse tout de suite.
    const tileType = this.levelConfig.map[tileY][tileX];
    if (tileType !== 0 && tileType !== 6) {
      this.cameras.main.shake(50, 0.005);
      return false;
    }

    // Vérifier qu'il n'y a pas d'arbre ici
    if (this.mapManager.hasTree(tileX, tileY)) {
      return false;
    }

    // ... Le reste de ta méthode reste identique ...
    const isBarracks = turretConfig.key === "barracks";

    // Limiter les barracks à 5 maximum
    if (isBarracks && this.barracks.length >= this.maxBarracks) {
      this.cameras.main.shake(50, 0.005);
      const errorText = this.add
        .text(
          this.gameWidth / 2,
          this.gameHeight / 2,
          `Maximum ${this.maxBarracks} casernes!`,
          {
            fontSize: `${Math.max(16, 24 * this.scaleFactor)}px`,
            fill: "#ff0000",
            fontStyle: "bold",
          }
        )
        .setOrigin(0.5)
        .setDepth(300);

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

  // =========================================================
  // GESTION DE LA PAUSE
  // =========================================================
  // =========================================================
  // GESTION DE LA PAUSE (VERSION PHASER 3 OPTIMISÉE)
  // =========================================================

  // --- Dans GameScene.js ---

  pauseGame() {
    if (this.isPaused) return;
    this.isPaused = true;

    // 1. Geler le temps (pour les timers de spawn)
    this.time.paused = true;

    // 2. Geler les Tweens (pour les rotations et mouvements par path)
    this.tweens.pauseAll();

    // 3. STOPPER l'update automatique des groupes
    // Cela empêche Phaser d'appeler enemy.update() sur chaque membre
    if (this.enemies) this.enemies.active = false;
    if (this.soldiers) this.soldiers.active = false;

    // 4. Mettre en pause les animations des sprites
    this.anims.pauseAll();

    // 5. Afficher le bouton
    if (!this.resumeBtn) {
      this.createResumeButton();
    } else {
      this.resumeBtn.setVisible(true);
    }
  }

  resumeGame() {
    if (!this.isPaused) return;
    this.isPaused = false;

    // 1. Relancer le temps
    this.time.paused = false;

    // 2. Relancer les Tweens
    this.tweens.resumeAll();

    // 3. RÉACTIVER les groupes
    if (this.enemies) this.enemies.active = true;
    if (this.soldiers) this.soldiers.active = true;

    // 4. Relancer les animations
    this.anims.resumeAll();

    if (this.resumeBtn) {
      this.resumeBtn.setVisible(false);
    }
  }

  // Petite fonction utilitaire pour créer le bouton si besoin
  createResumeButton() {
    const s = this.scaleFactor;
    const btnWidth = 250 * s;
    const btnHeight = 60 * s;

    this.resumeBtn = this.add
      .container(this.gameWidth / 2, this.gameHeight / 2)
      .setDepth(1000);

    const resumeBg = this.add.graphics();
    resumeBg.fillStyle(0x000000, 0.8);
    resumeBg.fillRoundedRect(
      -btnWidth / 2,
      -btnHeight / 2,
      btnWidth,
      btnHeight,
      10
    );
    resumeBg.lineStyle(3, 0x00ff00, 1);
    resumeBg.strokeRoundedRect(
      -btnWidth / 2,
      -btnHeight / 2,
      btnWidth,
      btnHeight,
      10
    );

    const resumeText = this.add
      .text(0, 0, "▶️ REPRENDRE", {
        fontSize: `${Math.max(18, 24 * s)}px`,
        fill: "#00ff00",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.resumeBtn.add([resumeBg, resumeText]);

    // Rendre la zone interactive
    const hitArea = new Phaser.Geom.Rectangle(
      -btnWidth / 2,
      -btnHeight / 2,
      btnWidth,
      btnHeight
    );
    resumeBg.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    resumeBg.on("pointerdown", () => this.resumeGame());
    resumeBg.on("pointerover", () => resumeText.setTint(0x00ff88));
    resumeBg.on("pointerout", () => resumeText.clearTint());
  }

  updateUI() {
    if (this.txtMoney) this.txtMoney.setText(`💰 ${this.money}`);
    if (this.txtLives) this.txtLives.setText(`❤️ ${this.lives}`);

    // Mettre à jour l'affichage de la vague
    if (this.txtWave) {
      let currentWave = (this.currentWaveIndex || 0) + 1;
      let totalWaves = 0;

      // Obtenir le nombre total de vagues
      if (this.levelConfig && this.levelConfig.waves) {
        totalWaves = this.levelConfig.waves.length;
      } else {
        // Fallback : chercher dans LEVELS_CONFIG
        const levelData = LEVELS_CONFIG.find((l) => l.id === this.levelID);
        if (levelData && levelData.data && levelData.data.waves) {
          totalWaves = levelData.data.waves.length;
        } else {
          // Fallback par défaut selon le niveau
          totalWaves = this.levelID === 2 ? 9 : 6;
        }
      }

      this.txtWave.setText(`🌊 VAGUE ${currentWave}/${totalWaves}`);
    }

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
    const toolbarY = this.toolbarOffsetY;
    const itemSize = 80 * this.scaleFactor;
    const itemSpacing = 90 * this.scaleFactor;
    const toolbarHeight = 120 * this.scaleFactor;
    const margin = 20 * this.scaleFactor;

    // Calculer les largeurs des sections
    const spellSectionWidth = itemSize + margin * 2; // Section des sorts à gauche
    const turretsSectionWidth = 5 * itemSpacing; // Section des tourelles au milieu
    const waveButtonWidth = 300 * this.scaleFactor; // Bouton de vague à droite
    const waveButtonHeight = 60 * this.scaleFactor;

    // Calculer la position de départ pour centrer les tourelles
    const totalWidth =
      spellSectionWidth + turretsSectionWidth + waveButtonWidth + margin * 4;
    const startX = (this.gameWidth - totalWidth) / 2;

    // Section des sorts à gauche
    const spellSectionX = startX + margin;
    this.spellSection = this.add
      .container(spellSectionX, toolbarY)
      .setDepth(150);
    const spellBg = this.add.graphics();
    spellBg.fillStyle(0x000000, 0.9);
    spellBg.fillRoundedRect(0, 0, spellSectionWidth, toolbarHeight, 10);
    spellBg.lineStyle(3, 0xffffff, 0.6);
    spellBg.strokeRoundedRect(0, 0, spellSectionWidth, toolbarHeight, 10);
    this.spellSection.add(spellBg);

    // Créer le bouton du sort éclair dans la section des sorts
    this.createLightningSpellButton(
      itemSize,
      itemSize / 2 + margin,
      toolbarHeight,
      spellSectionX
    );

    // Section des tourelles au milieu
    const turretsSectionX = startX + spellSectionWidth + margin * 2;
    this.buildToolbar = this.add
      .container(turretsSectionX, toolbarY)
      .setDepth(150);
    const toolbarBg = this.add.graphics();
    toolbarBg.fillStyle(0x000000, 0.9);
    toolbarBg.fillRoundedRect(0, 0, turretsSectionWidth, toolbarHeight, 10);
    toolbarBg.lineStyle(3, 0xffffff, 0.6);
    toolbarBg.strokeRoundedRect(0, 0, turretsSectionWidth, toolbarHeight, 10);
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
      // Centrer les boutons dans la section des tourelles
      const totalWidth = 5 * itemSpacing;
      const startX = (turretsSectionWidth - totalWidth) / 2 + itemSpacing / 2;
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
      const countText = this.add
        .text(0, itemSize / 2 + 12 * this.scaleFactor, "", {
          fontSize: `${Math.max(14, 16 * this.scaleFactor)}px`,
          fill: "#ffffff",
          fontStyle: "bold",
        })
        .setOrigin(0.5);

      // Texte avec le prix de la tourelle
      const priceText = this.add
        .text(0, itemSize / 2 + 28 * this.scaleFactor, `${item.config.cost}$`, {
          fontSize: `${Math.max(12, 14 * this.scaleFactor)}px`,
          fill: "#ffd700",
          fontStyle: "bold",
        })
        .setOrigin(0.5);

      // Fonction pour mettre à jour le compteur et l'état du bouton
      const updateCount = () => {
        // Vérifier que les objets sont encore valides avant de les manipuler
        if (!countText || countText.active === false) {
          return;
        }
        if (!btnBg || btnBg.active === false) {
          return;
        }
        if (!priceText || priceText.active === false) {
          return;
        }

        try {
          const canAfford = this.money >= item.config.cost;
          let isDisabled = false;
          let disabledReason = "";

          if (item.key === "barracks") {
            const count = this.barracks.length;
            const max = this.maxBarracks;
            countText.setText(`${count}/${max}`);
            isDisabled = count >= max;
            disabledReason = count >= max ? "MAX" : "";
            countText.setColor(count >= max ? "#ff0000" : "#ffffff");
          } else {
            const count = this.turrets.filter(
              (t) => t.config.key === item.key
            ).length;
            countText.setText(`${count}`);
          }

          // Désactiver visuellement si on ne peut pas se le permettre ou si limite atteinte
          const shouldDisable = !canAfford || isDisabled;

          if (shouldDisable) {
            // État désactivé : grisé
            btnBg.setFillStyle(0x1a1a1a, 0.6);
            btnBg.setStrokeStyle(3, 0x444444, 0.5);
            btnBg.setAlpha(0.5);
            previewContainer.setAlpha(0.4);
            priceText.setColor("#ff4444");
            priceText.setAlpha(0.7);
            countText.setAlpha(0.7);
            btnBg.disableInteractive();
          } else {
            // État actif : normal
            btnBg.setFillStyle(0x333333, 0.9);
            btnBg.setStrokeStyle(3, 0x666666, 1);
            btnBg.setAlpha(1);
            previewContainer.setAlpha(1);
            priceText.setColor("#ffd700");
            priceText.setAlpha(1);
            countText.setAlpha(1);
            btnBg.setInteractive({ useHandCursor: true });
          }
        } catch (e) {
          // Ignorer si les objets ont été détruits
          console.warn("Erreur lors de la mise à jour du compteur:", e);
        }
      };

      btnContainer.add([btnBg, previewContainer, countText, priceText]);
      this.buildToolbar.add(btnContainer);

      // Tooltip pour la description dans la toolbar
      let toolbarTooltip = null;

      btnBg.on("pointerover", () => {
        // Afficher le tooltip avec la description
        if (item.config.description) {
          this.showToolbarTooltip(btnContainer, item.config.description, btnBg);
        }
      });

      btnBg.on("pointerout", () => {
        // Cacher le tooltip
        if (this.toolbarTooltip) {
          this.toolbarTooltip.destroy();
          this.toolbarTooltip = null;
        }
      });

      // Gestion du clic pour démarrer le drag (seulement si actif)
      btnBg.on("pointerdown", (pointer) => {
        // Cacher le tooltip lors du clic
        if (this.toolbarTooltip) {
          this.toolbarTooltip.destroy();
          this.toolbarTooltip = null;
        }
        // Vérifier les limites
        if (
          item.key === "barracks" &&
          this.barracks.length >= this.maxBarracks
        ) {
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
        btnBg: btnBg,
        priceText: priceText,
        countText: countText,
        previewContainer: previewContainer,
      });
    });

    // Mettre à jour les compteurs
    this.updateToolbarCounts();
  }

  // Afficher un tooltip avec la description de la tourelle dans la toolbar
  showToolbarTooltip(btnContainer, description, triggerElement) {
    const s = this.scaleFactor;

    // Détruire l'ancien tooltip s'il existe
    if (this.toolbarTooltip) {
      this.toolbarTooltip.destroy();
    }

    // Calculer la position du tooltip (au-dessus du bouton)
    // Le btnContainer peut être dans buildToolbar (tourelles) ou directement dans la scène (sort)
    let btnX, btnY;

    // Vérifier si le container est dans buildToolbar en vérifiant son parent
    const isInBuildToolbar =
      this.buildToolbar &&
      (btnContainer.parentContainer === this.buildToolbar ||
        (this.buildToolbar.list &&
          this.buildToolbar.list.includes(btnContainer)));

    if (isInBuildToolbar) {
      // Pour les tourelles dans buildToolbar
      btnX = btnContainer.x + this.buildToolbar.x;
      btnY = btnContainer.y + this.buildToolbar.y;
    } else {
      // Pour le sort, btnContainer est directement dans la scène avec position absolue
      btnX = btnContainer.x;
      btnY = btnContainer.y;
    }

    // Créer le tooltip
    const tooltipContainer = this.add.container(0, 0).setDepth(300);
    this.toolbarTooltip = tooltipContainer;

    // Fond du tooltip
    const tooltipBg = this.add.graphics();
    const padding = 15 * s;
    const maxWidth = 350 * s;

    // Calculer la taille du texte
    const tempText = this.add.text(0, 0, description, {
      fontSize: `${Math.max(11, 12 * s)}px`,
      fill: "#ffffff",
      fontFamily: "Arial",
      wordWrap: { width: maxWidth - padding * 2 },
      lineSpacing: 4 * s,
    });
    const textWidth = Math.min(tempText.width, maxWidth - padding * 2);
    const textHeight = tempText.height;
    tempText.destroy();

    const tooltipWidth = textWidth + padding * 2;
    const tooltipHeight = textHeight + padding * 2;

    // Positionner le tooltip au-dessus du bouton
    const tooltipX = btnX;
    const tooltipY = btnY - tooltipHeight - 10 * s;

    // Dessiner le fond
    tooltipBg.fillStyle(0x000000, 0.95);
    tooltipBg.fillRoundedRect(0, 0, tooltipWidth, tooltipHeight, 8);
    tooltipBg.lineStyle(2, 0x00ccff, 1);
    tooltipBg.strokeRoundedRect(0, 0, tooltipWidth, tooltipHeight, 8);

    // Texte de description
    const descText = this.add.text(padding, padding, description, {
      fontSize: `${Math.max(11, 12 * s)}px`,
      fill: "#ffffff",
      fontFamily: "Arial",
      wordWrap: { width: maxWidth - padding * 2 },
      lineSpacing: 4 * s,
    });

    tooltipContainer.add([tooltipBg, descText]);
    tooltipContainer.setPosition(tooltipX, tooltipY);

    // Ajuster la position si le tooltip sort de l'écran
    if (tooltipX + tooltipWidth > this.gameWidth) {
      tooltipContainer.setX(this.gameWidth - tooltipWidth - 10 * s);
    }
    if (tooltipY < 0) {
      tooltipContainer.setY(btnY + 80 * s + 10 * s); // En dessous si pas de place au-dessus
    }
  }

  // Créer le bouton du sort éclair
  createLightningSpellButton(itemSize, xOffset, toolbarHeight, sectionX) {
    const x = xOffset;
    const y = toolbarHeight / 2;

    const btnContainer = this.add.container(
      sectionX + x,
      this.toolbarOffsetY + y
    );
    btnContainer.setDepth(151);

    // Fond du bouton
    const btnBg = this.add.rectangle(0, 0, itemSize, itemSize, 0x333333, 0.9);
    btnBg.setStrokeStyle(3, 0x666666);
    btnBg.setInteractive({ useHandCursor: true });

    // Icône d'éclair
    const lightningIcon = this.add.graphics();
    this.drawLightningIcon(lightningIcon, 0, 0, itemSize * 0.6);
    lightningIcon.setScale(this.scaleFactor);

    // Masque de cooldown (cercle qui se remplit)
    const cooldownMask = this.add.graphics();
    cooldownMask.setDepth(152);
    cooldownMask.setVisible(false);

    // Texte de cooldown
    const cooldownText = this.add
      .text(0, itemSize / 2 + 12 * this.scaleFactor, "", {
        fontSize: `${Math.max(10, 12 * this.scaleFactor)}px`,
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    btnContainer.add([btnBg, lightningIcon, cooldownMask, cooldownText]);

    // Tooltip pour la description (même système que pour les tourelles)
    btnBg.on("pointerover", () => {
      // Afficher le tooltip avec la description
      if (LIGHTNING_SPELL.description) {
        this.showToolbarTooltip(
          btnContainer,
          LIGHTNING_SPELL.description,
          btnBg
        );
      }
    });

    btnBg.on("pointerout", () => {
      // Cacher le tooltip
      if (this.toolbarTooltip) {
        this.toolbarTooltip.destroy();
        this.toolbarTooltip = null;
      }
    });

    // Gestion du clic
    btnBg.on("pointerdown", () => {
      // Cacher le tooltip lors du clic
      if (this.toolbarTooltip) {
        this.toolbarTooltip.destroy();
        this.toolbarTooltip = null;
      }

      // Vérifier que le cooldown est terminé et qu'on n'est pas déjà en train de placer
      if (this.lightningCooldown <= 0 && !this.placingSpell) {
        this.startPlacingLightning();
      }
    });

    // Stocker les références pour la mise à jour
    this.lightningSpellButton = {
      container: btnContainer,
      bg: btnBg,
      icon: lightningIcon,
      cooldownMask: cooldownMask,
      cooldownText: cooldownText,
    };

    // Initialiser l'affichage
    this.updateLightningSpellButton();
  }

  // Dessiner l'icône d'éclair
  drawLightningIcon(graphics, x, y, size) {
    graphics.clear();
    graphics.fillStyle(0xffff00, 1);

    // Forme d'éclair en zigzag
    graphics.beginPath();
    graphics.moveTo(x, y - size / 2);
    graphics.lineTo(x - size / 4, y - size / 6);
    graphics.lineTo(x, y);
    graphics.lineTo(x + size / 4, y + size / 6);
    graphics.lineTo(x, y + size / 2);
    graphics.lineTo(x - size / 6, y + size / 4);
    graphics.lineTo(x, y);
    graphics.lineTo(x + size / 6, y - size / 4);
    graphics.closePath();
    graphics.fillPath();

    // Bordure
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.strokePath();
  }

  // Démarrer le placement du sort
  startPlacingLightning() {
    this.placingSpell = LIGHTNING_SPELL;

    // Créer le preview de la zone
    if (!this.spellPreview) {
      this.spellPreview = this.add.graphics();
      this.spellPreview.setDepth(200);
    }

    // Mettre à jour le preview au mouvement de la souris
    this.input.on("pointermove", this.updateSpellPreview, this);
  }

  // Mettre à jour le preview du sort
  updateSpellPreview(pointer) {
    if (!this.placingSpell || !this.spellPreview) return;

    // Utiliser exactement le même radius que pour les dégâts
    const radius = LIGHTNING_SPELL.radius;
    const x = pointer.worldX;
    const y = pointer.worldY;

    this.spellPreview.clear();
    this.spellPreview.lineStyle(3, 0x00ffff, 0.8);
    this.spellPreview.strokeCircle(x, y, radius);
    this.spellPreview.fillStyle(0x00ffff, 0.2);
    this.spellPreview.fillCircle(x, y, radius);
  }

  // Placer le sort éclair
  placeLightning(x, y) {
    if (!this.placingSpell || this.lightningOnCooldown) return;

    // Activer le cooldown immédiatement pour empêcher les clics multiples
    this.lightningOnCooldown = true;
    this.lightningCooldown = LIGHTNING_SPELL.cooldown;

    // Créer l'animation d'éclair
    this.castLightning(x, y);

    // Nettoyer le placement
    this.cancelSpellPlacement();
  }

  // Annuler le placement du sort
  cancelSpellPlacement() {
    this.placingSpell = null;
    if (this.spellPreview) {
      this.spellPreview.clear();
    }
    this.input.off("pointermove", this.updateSpellPreview, this);
  }

  // Lancer le sort éclair avec animation
  castLightning(x, y) {
    // Utiliser exactement le même radius partout
    const effectRadius = LIGHTNING_SPELL.radius;

    // 1. Éclair qui tombe du ciel (animation fixe pour être toujours identique)
    const lightningBolt = this.add.graphics();
    lightningBolt.setDepth(300);

    // Ligne d'éclair depuis le haut
    const startY = this.mapStartY - 50;

    // Éclair principal (zigzag fixe - pas de random pour avoir toujours la même animation)
    lightningBolt.lineStyle(10, 0xffffff, 1);
    lightningBolt.beginPath();
    lightningBolt.moveTo(x, startY);

    // Créer un zigzag fixe pour l'éclair (même pattern à chaque fois)
    const steps = 8;
    const stepHeight = (y - startY) / steps;
    const offsets = [-8, 12, -10, 15, -12, 10, -8, 5]; // Pattern fixe
    for (let i = 1; i <= steps; i++) {
      const currentY = startY + stepHeight * i;
      const offsetX = offsets[i - 1] || 0;
      lightningBolt.lineTo(x + offsetX, currentY);
    }
    lightningBolt.lineTo(x, y);
    lightningBolt.strokePath();

    // Éclair secondaire (plus fin, cyan) - pattern fixe aussi
    lightningBolt.lineStyle(4, 0x00ffff, 1);
    lightningBolt.beginPath();
    lightningBolt.moveTo(x, startY);
    const offsets2 = [-6, 9, -7, 11, -9, 7, -6, 3]; // Pattern fixe
    for (let i = 1; i <= steps; i++) {
      const currentY = startY + stepHeight * i;
      const offsetX = offsets2[i - 1] || 0;
      lightningBolt.lineTo(x + offsetX, currentY);
    }
    lightningBolt.lineTo(x, y);
    lightningBolt.strokePath();

    // Branches d'éclair latérales (positions fixes)
    const branchOffsets = [
      { x: -25, y: 0.3 },
      { x: 30, y: 0.5 },
      { x: -20, y: 0.7 },
      { x: 28, y: 0.4 },
      { x: -22, y: 0.6 },
    ];
    branchOffsets.forEach((branch) => {
      const offsetY = startY + (y - startY) * branch.y;
      lightningBolt.lineStyle(3, 0xffffff, 0.8);
      lightningBolt.lineBetween(x, offsetY, x + branch.x, offsetY);
    });

    // Flash initial
    const flash = this.add.circle(x, y, effectRadius * 1.5, 0xffffff, 1);
    flash.setDepth(301);

    this.tweens.add({
      targets: flash,
      scale: 0,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        flash.destroy();
        lightningBolt.destroy();
      },
    });

    // 2. Zone d'impact avec brûlure du terrain (même radius que les dégâts)
    const burnZone = this.add.graphics();
    burnZone.setDepth(5);
    burnZone.fillStyle(0x000000, 0.6);
    burnZone.fillCircle(x, y, effectRadius);
    burnZone.lineStyle(2, 0x8b4513, 1);
    burnZone.strokeCircle(x, y, effectRadius);

    // Effet de brûlure qui s'estompe
    this.tweens.add({
      targets: burnZone,
      alpha: 0,
      duration: 5000,
      onComplete: () => burnZone.destroy(),
    });

    // 3. Dégâts et paralysie sur les ennemis (utiliser exactement le même radius)
    if (this.enemies) {
      this.enemies.children.each((enemy) => {
        if (enemy && enemy.active) {
          const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
          if (dist <= effectRadius) {
            // Dégâts
            enemy.damage(LIGHTNING_SPELL.damage);

            // Paralysie seulement si l'ennemi survit
            if (enemy.hp > 0 && enemy.paralyze) {
              enemy.paralyze(LIGHTNING_SPELL.paralysisDuration);
            }
          }
        }
      });
    }

    // 4. Effet de particules (dans la zone d'effet)
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * effectRadius;
      const px = x + Math.cos(angle) * dist;
      const py = y + Math.sin(angle) * dist;

      const particle = this.add.circle(px, py, 3, 0xffff00, 1);
      particle.setDepth(302);

      this.tweens.add({
        targets: particle,
        x: px + (Math.random() - 0.5) * 50,
        y: py + (Math.random() - 0.5) * 50,
        alpha: 0,
        scale: 0,
        duration: 1000 + Math.random() * 500,
        onComplete: () => particle.destroy(),
      });
    }
  }

  // Mettre à jour l'affichage du bouton de sort
  updateLightningSpellButton() {
    if (!this.lightningSpellButton) return;

    const { bg, icon, cooldownMask, cooldownText } = this.lightningSpellButton;
    const cooldownPercent = this.lightningCooldown / LIGHTNING_SPELL.cooldown;
    const remainingSeconds = Math.ceil(this.lightningCooldown / 1000);

    if (this.lightningCooldown > 0) {
      // Afficher le masque de cooldown
      cooldownMask.setVisible(true);
      cooldownMask.clear();

      const itemSize = 80 * this.scaleFactor;
      const radius = itemSize / 2;

      // Dessiner un masque circulaire qui se remplit progressivement (de bas en haut)
      cooldownMask.clear();
      cooldownMask.fillStyle(0x000000, 0.7);

      if (cooldownPercent > 0) {
        const startAngle = -Math.PI / 2; // Commence en haut
        const endAngle = startAngle + cooldownPercent * Math.PI * 2;

        cooldownMask.beginPath();
        cooldownMask.moveTo(0, 0);
        cooldownMask.arc(0, 0, radius, startAngle, endAngle, false);
        cooldownMask.closePath();
        cooldownMask.fillPath();
      }

      // Texte de cooldown
      cooldownText.setText(`${remainingSeconds}s`);
      cooldownText.setVisible(true);

      // Désactiver le bouton
      bg.setFillStyle(0x1a1a1a, 0.6);
      bg.setStrokeStyle(3, 0x444444);
      icon.setAlpha(0.5);
      bg.disableInteractive();
    } else {
      // Réactiver le bouton
      cooldownMask.setVisible(false);
      cooldownText.setVisible(false);
      bg.setFillStyle(0x333333, 0.9);
      bg.setStrokeStyle(3, 0x666666);
      icon.setAlpha(1);
      bg.setInteractive({ useHandCursor: true });
    }
  }

  // Dessiner une miniature du bâtiment pour la toolbar avec le vrai visuel
  drawTurretPreview(container, config) {
    // Dessiner la base exactement comme dans Turret.drawBase() (niveau 1)
    const base = this.add.graphics();
    const color = 0x333333; // Même couleur que Turret.drawBase() pour niveau 1
    base.fillStyle(color);
    base.fillCircle(0, 0, 24); // Même taille que dans Turret.drawBase()
    base.lineStyle(2, 0x111111); // Même bordure que dans Turret.drawBase()
    base.strokeCircle(0, 0, 24);
    container.add(base);

    // Dessiner le canon/barrel avec la fonction onDrawBarrel exactement comme dans Turret.drawBarrel()
    if (config.onDrawBarrel) {
      const barrelContainer = this.add.container(0, 0);
      // Créer un objet turret factice pour onDrawBarrel (niveau 1 pour la preview)
      const fakeTurret = { level: 1, config: config };
      try {
        // Utiliser exactement la même signature que Turret.drawBarrel()
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
    this.toolbarButtons = this.toolbarButtons.filter(
      (btn) => btn && btn.updateCount
    );

    // Mettre à jour chaque bouton avec protection
    this.toolbarButtons.forEach((btn) => {
      try {
        if (btn && btn.updateCount) {
          btn.updateCount();
        }
      } catch (e) {
        // Ignorer si un ancien bouton traîne encore
        console.warn(
          "Erreur lors de la mise à jour d'un bouton de toolbar:",
          e
        );
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
      if (
        tx >= 0 &&
        tx < 15 &&
        ty >= 0 &&
        ty < 15 &&
        this.levelConfig &&
        this.levelConfig.map
      ) {
        const tileType = this.levelConfig.map[ty][tx];
        if (tileType === 0 || tileType === 6) {
          // Herbe
          // Vérifier qu'il n'y a pas d'arbre ici
          const hasTree =
            this.mapManager && this.mapManager.hasTree
              ? this.mapManager.hasTree(tx, ty)
              : false;
          if (!hasTree) {
            if (this.draggingTurret.key === "barracks") {
              canPlace =
                this.mapManager && this.mapManager.isAdjacentToPath
                  ? this.mapManager.isAdjacentToPath(tx, ty) &&
                    this.money >= this.draggingTurret.cost
                  : false;
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
      this.validCellsPreview.forEach((cell) => cell.destroy());
      this.validCellsPreview = [];
    } else {
      this.validCellsPreview = [];
    }

    const T = CONFIG.TILE_SIZE * this.scaleFactor;

    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 15; x++) {
        const tileType = this.levelConfig.map[y][x];
        if (tileType === 0 || tileType === 6) {
          // Herbe
          // Vérifier qu'il n'y a pas d'arbre ici
          const hasTree = this.mapManager.hasTree(x, y);
          if (!hasTree) {
            let canPlace = false;
            if (this.draggingTurret.key === "barracks") {
              canPlace =
                this.mapManager.isAdjacentToPath(x, y) &&
                this.money >= this.draggingTurret.cost;
            } else {
              canPlace = this.money >= this.draggingTurret.cost;
            }

            if (canPlace) {
              const px = this.mapStartX + x * T + T / 2;
              const py = this.mapStartY + y * T + T / 2;
              const cell = this.add.rectangle(
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

  // Placer la tourelle draguee
  placeDraggedTurret(pointer) {
    if (!this.draggingTurret) return;

    const T = CONFIG.TILE_SIZE * this.scaleFactor;

    const tx = Math.floor((pointer.worldX - this.mapStartX) / T);
    const ty = Math.floor((pointer.worldY - this.mapStartY) / T);

    if (tx >= 0 && tx < 15 && ty >= 0 && ty < 15) {
      const tileType = this.levelConfig.map[ty][tx];
      if (tileType === 0 || tileType === 6) {
        // Herbe
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
      this.validCellsPreview.forEach((cell) => cell.destroy());
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
          console.warn(
            `Système de textures ou Graphics non disponible pour ${key}`
          );
          return;
        }
        if (this.textures.exists(key)) {
          return; // Texture déjà existante, ne pas regénérer
        }
        if (g.active === false || !g.clear) {
          console.warn(
            `Graphics object détruit ou invalide, impossible de générer ${key}`
          );
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

    // tile_mountain
    generateIfNotExists("tile_mountain", () => {
      // Fond rocheux
      g.fillStyle(0x6b5b4f, 1);
      g.fillRect(0, 0, T, T);
      // Texture de roche
      g.fillStyle(0x5a4b3f, 0.8);
      for (let i = 0; i < 15; i++) {
        g.fillRect(Math.random() * T, Math.random() * T, 3, 3);
      }
      // Détails de roche plus clairs
      g.fillStyle(0x7b6b5f, 0.6);
      for (let i = 0; i < 8; i++) {
        g.fillRect(Math.random() * T, Math.random() * T, 2, 2);
      }
      // Bordure sombre
      g.lineStyle(1, 0x4a3d32, 0.5);
      g.strokeRect(0, 0, T, T);
    });

    // --- TEXTURES BIOME NEIGE ---

    // tile_snow_1 (Sol Neige - ID 6 & 9)
    generateIfNotExists("tile_snow_1", () => {
      // Fond blanc légèrement bleuté (AliceBlue)
      g.fillStyle(0xf0f8ff, 1);
      g.fillRect(0, 0, T, T);

      // Texture de neige (petits points gris/bleu clair)
      g.fillStyle(0xdbe9f4, 0.8);
      for (let i = 0; i < 40; i++) {
        const size = Math.random() * 3 + 1;
        g.fillCircle(Math.random() * T, Math.random() * T, size);
      }
    });

    // tile_snow_path (Chemin Glacé - ID 7)
    generateIfNotExists("tile_snow_path", () => {
      // Fond glace (PowderBlue)
      g.fillStyle(0xb0e0e6, 1);
      g.fillRect(0, 0, T, T);

      // Effet de traces/rayures sur la glace
      g.lineStyle(1, 0xffffff, 0.6);
      for (let i = 0; i < 10; i++) {
        const sx = Math.random() * T;
        const sy = Math.random() * T;
        g.beginPath();
        g.moveTo(sx, sy);
        g.lineTo(
          sx + (Math.random() - 0.5) * 20,
          sy + (Math.random() - 0.5) * 20
        );
        g.strokePath();
      }

      // Bordure du chemin (neige tassée)
      g.fillStyle(0xe0ffff, 0.5);
      g.fillRect(0, 0, T, 3);
      g.fillRect(0, T - 3, T, 3);
      g.fillRect(0, 0, 3, T);
      g.fillRect(T - 3, 0, 3, T);
    });

    // tile_ice_water (Eau Gelée / Trou - ID 8)
    generateIfNotExists("tile_ice_water", () => {
      // Eau sombre en dessous
      g.fillStyle(0x4682b4, 1); // SteelBlue
      g.fillRect(0, 0, T, T);

      // Couche de glace par dessus (semi-transparente)
      g.fillStyle(0xaaddff, 0.7);
      g.fillRect(0, 0, T, T);

      // Fissures bleues foncées
      g.lineStyle(2, 0x2f4f4f, 0.5);
      g.beginPath();
      g.moveTo(0, Math.random() * T);
      g.lineTo(T / 2, T / 2);
      g.lineTo(T, Math.random() * T);
      g.strokePath();

      // Reflets blancs
      g.fillStyle(0xffffff, 0.6);
      g.fillCircle(T * 0.2, T * 0.2, 3);
      g.fillCircle(T * 0.7, T * 0.6, 2);
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
      this.upgradeTextLines.forEach((line) => {
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
      this.validCellsPreview.forEach((cell) => {
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

      // Nettoyer le timer de vague automatique
      if (this.nextWaveAutoTimer) {
        this.nextWaveAutoTimer.remove();
        this.nextWaveAutoTimer = null;
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
      if (
        this.enemies &&
        this.enemies.children &&
        this.enemies.children.size !== undefined
      ) {
        this.enemies.clear(true, true);
      }
    } catch (e) {
      // Ignorer si le groupe est déjà détruit (children devient undefined)
    }

    try {
      if (
        this.soldiers &&
        this.soldiers.children &&
        this.soldiers.children.size !== undefined
      ) {
        this.soldiers.clear(true, true);
      }
    } catch (e) {
      // Ignorer si le groupe est déjà détruit
    }

    // Nettoyer les tourelles et casernes
    if (this.turrets) {
      this.turrets.forEach((t) => {
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
      this.barracks.forEach((b) => {
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
