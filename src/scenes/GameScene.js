import { CONFIG } from "../config/settings.js";
import { LEVELS_CONFIG } from "../config/levels/index.js";
import { Enemy } from "../objects/Enemy.js";
import { Turret } from "../objects/Turret.js";
import { Barracks } from "../objects/Barracks.js";
import { MapManager } from "./managers/MapManager.js";
import { WaveManager } from "./managers/WaveManager.js";
import { UIManager } from "./managers/UIManager.js";
import { InputManager } from "./managers/InputManager.js";
import { SpellManager } from "./managers/SpellManager.js";
import { TextureFactory } from "./managers/TextureFactory.js";

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
    this.upgradeTextLines = []; // Pour stocker les lignes de texte du menu

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
      TextureFactory.generate(this);
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
        TextureFactory.generate(this);
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
    this.spellManager = new SpellManager(this);
    this.inputManager = new InputManager(this, this.spellManager, null);
    this.uiManager = new UIManager(this, this.spellManager, this.inputManager);
    this.inputManager.setUIManager(this.uiManager);

    this.mapManager.createMap();
    this.enemies = this.add.group({ runChildUpdate: true });
    this.soldiers = this.add.group({ runChildUpdate: true });
    this.uiManager.createUI();

    this.inputManager.setupInputHandlers();
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

  update(time, delta) {
    // Si le jeu est en pause, ne rien mettre à jour
    if (this.isPaused) {
      return;
    }
    this.spellManager.update(time, delta);

    this.turrets.forEach((t) => t.update(time, this.enemies));
    this.barracks.forEach((b) => b.update(time));
    this.soldiers.children.each((soldier) => {
      if (soldier && soldier.active) {
        soldier.update();
      }
    });

    if (this.inputManager) {
      this.inputManager.update(time, delta);
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
    this.uiManager.updateUI();
  }

  updateToolbarCounts() {
    this.uiManager.updateToolbarCounts();
  }

  drawTurretPreview(container, config) {
    this.uiManager.buildToolbar.drawTurretPreview(container, config);
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

    if (this.inputManager) {
      try {
        this.inputManager.cancelDrag();
      } catch (e) {}
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
    this.selectedTurret = null;
    this.txtMoney = null;
    this.txtLives = null;
    this.waveBtnContainer = null;
    this.waveBtnBg = null;
    this.waveBtnText = null;
  }
}
