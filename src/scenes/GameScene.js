import { CONFIG } from "../config/settings.js";
import { getLevelConfigById, LEVELS_CONFIG } from "../config/levels/index.js";
import { Enemy } from "../objects/Enemy.js";
import { Turret } from "../objects/Turret.js";
import { Barracks } from "../objects/Barracks.js";
import { Hero } from "../objects/Hero.js";
import { GoldCoin } from "../objects/GoldCoin.js";
import { MapManager } from "./managers/MapManager.js";
import { WaveManager } from "./managers/WaveManager.js";
import { UIManager } from "./managers/UIManager.js";
import { InputManager } from "./managers/InputManager.js";
import { SpellManager } from "./managers/SpellManager.js";
import { TextureFactory } from "./managers/TextureFactory.js";
import { recordHeroKill } from "../services/authManager.js";
import { RunTracker } from "../services/runTracker.js";
import { sendRunReport } from "../services/runReportService.js";
import { fetchAchievements } from "../services/achievementsService.js";
import { resetCachedChapters } from "../services/chapterService.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  init(data) {
    this.levelID = data.level || 1;
    this.levelName = data.levelName || null;
    const src = getLevelConfigById(this.levelID) || LEVELS_CONFIG[0].data;

    // CLONE PROFOND pour ne jamais muter LEVELS_CONFIG
    if (typeof structuredClone !== "undefined") {
      this.levelConfig = structuredClone(src);
    } else {
      this.levelConfig = JSON.parse(JSON.stringify(src));
    }

    this.heroStats = data.heroStats || null;

    this.money = this.levelConfig.startingMoney || CONFIG.STARTING_MONEY;
    this.lives = CONFIG.STARTING_LIVES;
    this.turrets = [];
    this.barracks = [];
    this.paths = [];
    this.currentWaveIndex = 0;
    this.wavesCompleted = 0;
    this.isWaveRunning = false;
    this.hasWaveFinishedSpawning = false;
    this.canCallNextWave = false;
    this.enemies = null;
    this.soldiers = null;
    this.coins = null;
    this.nextWaveAutoTimer = null; // Timer pour le lancement automatique
    this.nextWaveCountdown = 0; // Compte à rebours en secondes
    this.waveSpawnTimers = []; // Liste des timers de spawn des ennemis
    this.endCheckTimer = null; // Timer de vérification de fin de vague
    this.selectedTurret = null;
    this.maxBarracks = 5;
    this.maxSnipers = 10;
    this.upgradeTextLines = []; // Pour stocker les lignes de texte du menu
    this.spawnControls = null;
    this.hero = null;

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
    this.quitBtn = null; // Bouton quitter
    this.resumeBtn = null; // Bouton reprendre au centre de l'écran
    this.quitConfirmationContainer = null; // Container de confirmation de quitter
    this.pausedTimers = []; // Liste des timers en pause
    this.pausedTweens = []; // Liste des tweens en pause
    this.elapsedTimeMs = 0; // Chronomètre de session
    this.isTimerRunning = false;
    this.gameOverTriggered = false;
    this.heroKillCount = 0;
    this.heroKillReportPromise = null;
    this.runReportPromise = null;
    this.isRunReportSending = false;
    this.pendingNaturalRunResult = null;
    this.pendingNaturalReason = null;
    this.sendRunReportFn = sendRunReport;
    this.transmissionOverlay = null;
    this.isPortrait = false;
    this.activeWaveIndex = null;
    this.runTracker = new RunTracker();
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

    this.runReportPromise = null;
    this.runTracker.startRun({
      levelId: this.levelID,
      levelName:
        this.levelName ||
        this.levelConfig?.name ||
        `Niveau ${this.levelID}`,
      biome: this.levelConfig?.biome || null,
      startingMoney: this.money,
      startingLives: this.lives,
      totalWaves: this.levelConfig?.waves?.length || 0,
    });

    this.mapManager.createMap();
    this.waveManager.initSpawnControls();
    this.enemies = this.add.group({ runChildUpdate: true });
    this.soldiers = this.add.group({ runChildUpdate: true });
    this.coins = this.add.group({ runChildUpdate: false });

    const heroSpawnTile = this.findHeroSpawnTile();
    this.hero = new Hero(this, heroSpawnTile.x, heroSpawnTile.y, this.heroStats);
    this.soldiers.add(this.hero);

    this.uiManager.createUI();
    this.uiManager.updateTimer(this.elapsedTimeMs);
    this.updateUI(); // Initialiser l'affichage des vagues

    this.inputManager.setHero(this.hero);
    this.inputManager.setupInputHandlers();

    this.events.on("enemy-killed", this.handleEnemyKilled, this);
  }

  // Calculer le layout pour centrer correctement
  calculateLayout() {
    this.gameWidth = this.scale.width;
    this.gameHeight = this.scale.height;
    this.baseWidth = this.game.baseWidth || CONFIG.GAME_WIDTH;
    this.baseHeight = this.game.baseHeight || CONFIG.GAME_HEIGHT;

    // Détecter l'orientation actuelle (important pour le responsive mobile)
    this.isPortrait = this.gameHeight >= this.gameWidth * 0.94;

    const mapSize = 15 * CONFIG.TILE_SIZE;
    // Réduire les marges pour maximiser l'espace de la map, surtout sur mobile
    const padding = Math.max(6, Math.min(this.gameWidth, this.gameHeight) * 0.006);
    const isPortrait = this.isPortrait;

    if (isPortrait) {
      const topBarHeight = Phaser.Math.Clamp(
        this.gameHeight * 0.12,
        96,
        150
      );
      const bottomBarHeight = Phaser.Math.Clamp(
        this.gameHeight * 0.16,
        110,
        170
      );

      const usableHeight = this.gameHeight - padding * 2 - topBarHeight - bottomBarHeight;
      const usableWidth = this.gameWidth - padding * 2;

      const scaleByHeight = usableHeight / mapSize;
      const scaleByWidth = usableWidth / mapSize;
      this.scaleFactor = Phaser.Math.Clamp(
        Math.min(scaleByHeight, scaleByWidth),
        0.4,
        1.4
      );

      const projectedMapSize = mapSize * this.scaleFactor;
      if (projectedMapSize > usableHeight) {
        this.scaleFactor = Math.min(this.scaleFactor, usableHeight / mapSize);
      }

      this.mapPixelSize = mapSize * this.scaleFactor;

      this.mapOffsetX = padding + (usableWidth - this.mapPixelSize) / 2;
      this.mapOffsetY = padding + topBarHeight + (usableHeight - this.mapPixelSize) / 2;

      this.mapStartX = this.mapOffsetX;
      this.mapStartY = this.mapOffsetY;

      // Barre de construction en haut
      this.toolbarOffsetX = padding;
      this.toolbarWidth = this.gameWidth - padding * 2;
      this.toolbarHeight = topBarHeight;
      this.toolbarOffsetY = padding;

      // HUD en bas
      this.hudOffsetX = padding;
      this.hudWidth = this.toolbarWidth;
      this.hudHeight = bottomBarHeight;
      this.hudOffsetY = this.gameHeight - bottomBarHeight - padding;

      this.leftToolbarBounds = {
        x: this.toolbarOffsetX,
        y: this.toolbarOffsetY,
        width: this.toolbarWidth,
        height: this.toolbarHeight,
      };
      this.rightToolbarOffsetX = this.hudOffsetX;
      this.rightToolbarWidth = this.hudWidth;
      this.rightToolbarBounds = {
        x: this.hudOffsetX,
        y: this.hudOffsetY,
        width: this.hudWidth,
        height: this.hudHeight,
      };
    } else {
      // Mise en page paysage (PC / tablettes horizontales)
      const minSidebarWidth = this.gameWidth < 1100 ? 140 : 180;
      const maxSidebarWidth = 320;
      const targetSidebarWidth = Phaser.Math.Clamp(
        this.gameWidth * 0.15,
        minSidebarWidth,
        maxSidebarWidth
      );

      // Calculer d'abord la taille de la map en fonction de l'espace disponible
      const usableHeight = this.gameHeight - padding * 2;
      // Espace central estimé (on va l'ajuster après)
      const estimatedCenterWidth = this.gameWidth - 2 * targetSidebarWidth - 2 * padding;

      const scaleByHeight = usableHeight / mapSize;
      const scaleByWidth = estimatedCenterWidth / mapSize;
      this.scaleFactor = Phaser.Math.Clamp(Math.min(scaleByHeight, scaleByWidth), 0.6, 2);

      // Si malgré tout la map dépasse la hauteur disponible (écrans très allongés),
      // on réduit légèrement l'échelle pour que les 15 cases soient visibles.
      const projectedMapSize = mapSize * this.scaleFactor;
      if (projectedMapSize > usableHeight) {
        this.scaleFactor = Math.min(this.scaleFactor, usableHeight / mapSize);
      }

      this.mapPixelSize = mapSize * this.scaleFactor;

      // Centrer la map horizontalement dans l'écran
      this.mapOffsetX = (this.gameWidth - this.mapPixelSize) / 2;
      this.mapOffsetY = padding + (usableHeight - this.mapPixelSize) / 2;

      // Stocker les offsets pour utilisation dans createMap
      this.mapStartX = this.mapOffsetX;
      this.mapStartY = this.mapOffsetY;

      // Sidebars qui s'étirent jusqu'à la map (pas de largeur fixe)
      // Sidebar gauche : de padding jusqu'à mapOffsetX
      this.toolbarOffsetX = padding;
      this.toolbarWidth = this.mapOffsetX - padding;

      // Sidebar droite : de (mapOffsetX + mapPixelSize) jusqu'à (gameWidth - padding)
      this.rightToolbarOffsetX = this.mapOffsetX + this.mapPixelSize;
      this.rightToolbarWidth = this.gameWidth - padding - this.rightToolbarOffsetX;

      // Les sidebars prennent toute la hauteur de l'écran pour remplir l'espace
      this.toolbarHeight = this.gameHeight;
      // Les sidebars commencent en haut de l'écran (y = 0) pour s'étirer jusqu'en bas
      this.toolbarOffsetY = 0;
      this.hudOffsetY = this.toolbarOffsetY;
      this.hudHeight = this.toolbarHeight;
      this.hudWidth = this.rightToolbarWidth;
      this.hudOffsetX = this.rightToolbarOffsetX;

      // HUD maintenant à droite (plus besoin de calculer hudX/hudY en haut)
      // Les valeurs sont calculées automatiquement via rightToolbarOffsetX et toolbarOffsetY

      this.leftToolbarBounds = {
        x: this.toolbarOffsetX,
        y: this.toolbarOffsetY,
        width: this.toolbarWidth,
        height: this.toolbarHeight,
      };
      this.rightToolbarBounds = {
        x: this.rightToolbarOffsetX,
        y: this.toolbarOffsetY,
        width: this.rightToolbarWidth,
        height: this.toolbarHeight,
      };
    }
  }

  // Gérer le redimensionnement
  handleResize() {
    // Phaser gère le scaling via FIT : seules les références d'UI doivent rester centrées
    this.gameWidth = this.scale.width;
    this.gameHeight = this.scale.height;

    if (this.uiManager?.hud?.reposition) {
      this.uiManager.hud.reposition();
    }
    if (this.uiManager?.buildToolbar?.reposition) {
      this.uiManager.buildToolbar.reposition();
    }

    if (this.resumeBtn) {
      this.resumeBtn.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);
    }
  }

  update(time, delta) {
    if (this.lives <= 0 && !this.gameOverTriggered) {
      this.triggerGameOver();
      return;
    }

    // Si le jeu est en pause, ne rien mettre à jour
    if (this.isPaused) {
      return;
    }

    if (this.isTimerRunning) {
      this.elapsedTimeMs += delta;
    }

    if (this.uiManager) {
      this.uiManager.updateTimer(this.elapsedTimeMs);
    }
    this.spellManager.update(time, delta);

    this.turrets.forEach((t) => t.update(time, this.enemies));
    this.barracks.forEach((b) => b.update(time));
    this.soldiers.children.each((soldier) => {
      if (soldier && soldier.active) {
        soldier.update();
      }
    });

    this.updateCoins(time, delta);
    this.checkHeroCoinPickup();

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
    this.grantEarlyWaveBonus();

    // Annuler le timer automatique si le joueur lance manuellement
    if (this.nextWaveAutoTimer) {
      this.nextWaveAutoTimer.remove();
      this.nextWaveAutoTimer = null;
      this.nextWaveCountdown = 0;
    }
    this.waveManager.spawnControls?.clearCountdown();
    this.waveManager.startWave();
  }

  grantEarlyWaveBonus() {
    if (!this.shouldGrantEarlyWaveBonus()) return;

    const bonus = this.calculateEarlyWaveBonus();
    if (bonus <= 0) return;

    this.earnMoney(bonus);
    this.showEarlyWaveBonusText(bonus);
    // Empêcher un double déclenchement si le bouton est spammé
    this.canCallNextWave = false;
  }

  shouldGrantEarlyWaveBonus() {
    const hasEnemiesAlive =
      this.enemies && this.enemies.getLength && this.enemies.getLength() > 0;
    return this.isWaveRunning && this.canCallNextWave && hasEnemiesAlive;
  }

  calculateEarlyWaveBonus() {
    if (!this.enemies) return 0;

    const baseReward = this.enemies.getChildren().reduce((sum, enemy) => {
      if (!enemy || !enemy.active) return sum;
      const damageValue = enemy.playerDamage || enemy.stats?.playerDamage || 0;
      return sum + damageValue;
    }, 0);

    return baseReward * 2;
  }

  getAnticipationBonusCoins() {
    // Retourne le bonus calculé pour l'anticipation de vague
    // Le bonus est calculé en fonction des ennemis actuellement vivants
    // On peut l'afficher même si canCallNextWave est false (pendant le spawn)
    if (!this.isWaveRunning) return 0;
    return this.calculateEarlyWaveBonus();
  }

  showEarlyWaveBonusText(bonus) {
    const text = this.add
      .text(
        this.gameWidth / 2,
        40 * this.scaleFactor,
        `+${bonus} pièces (appel anticipé)`,
        {
          fontSize: `${Math.max(16, 22 * this.scaleFactor)}px`,
          color: "#ffd166",
          fontStyle: "bold",
          stroke: "#000",
          strokeThickness: 3,
        }
      )
      .setOrigin(0.5)
      .setDepth(500);

    this.tweens.add({
      targets: text,
      y: text.y - 25 * this.scaleFactor,
      alpha: 0,
      duration: 1200,
      ease: "Cubic.easeOut",
      onComplete: () => text.destroy(),
    });
  }

  startSessionTimer() {
    this.isTimerRunning = true;
  }

  monitorWaveEnd() {
    this.waveManager.monitorWaveEnd();
  }

  finishWave() {
    this.waveManager.finishWave();
  }

  async levelComplete() {
    // Vérifier si le joueur a encore des vies avant d'enregistrer une victoire
    if (this.lives <= 0) {
      // Le joueur a perdu toutes ses vies, c'est une défaite
      await this.showGameOverNotification();
      return;
    }
    
    this.showTransmissionOverlay("VICTOIRE");
    this.pendingNaturalRunResult = "WIN";
    this.pendingNaturalReason = "level_complete";
    this.reportHeroKillsOnce();
    await this.finalizeRunReport("WIN", "level_complete");
    await this.waveManager.levelComplete();
    this.refreshProgressCaches();
    this.notifyAchievementsUpdate();
    this.hideTransmissionOverlay();
  }

  handleEnemyKilled(payload) {
    if (payload?.source === "hero") {
      this.heroKillCount += 1;
    }

    this.runTracker.onEnemyKill({
      source: payload?.source || "other",
      turretType: payload?.turretType || null,
      waveIndex: payload?.waveIndex ?? this.activeWaveIndex,
    });

    if (payload && Math.random() < 0.25) {
      this.spawnCoinDrop(payload.x, payload.y);
    }
  }

  reportHeroKillsOnce(force = false) {
    // Si on force (défaite), toujours envoyer même si 0 kills
    if (!force && this.heroKillCount <= 0) {
      return null;
    }
    
    // Si on force, créer une nouvelle requête même si une existe déjà
    if (!force && this.heroKillReportPromise) {
      return this.heroKillReportPromise;
    }

    const killsToReport = this.heroKillCount || 0;
    this.heroKillCount = 0;

    const heroId = this.heroStats?.heroId || this.heroStats?.hero_id || null;
    // Toujours créer une nouvelle promesse pour forcer l'envoi
    this.heroKillReportPromise = recordHeroKill(killsToReport, heroId).catch(
      (err) => {
        return null;
      }
    );
    return this.heroKillReportPromise;
  }

  async finalizeRunReport(result = null, reasonEnd = null) {
    if (!this.runTracker) return null;
    const isNaturalEnd = result === "WIN" || result === "LOSE";

    if (isNaturalEnd) {
      this.pendingNaturalRunResult = result;
      this.pendingNaturalReason = reasonEnd || this.pendingNaturalReason;
    }

    const naturalSendExpected =
      !isNaturalEnd && Boolean(this.pendingNaturalRunResult);
    const naturalSendInFlight = this.isRunReportSending || !!this.runReportPromise;

    if (naturalSendExpected || naturalSendInFlight) {
      return this.runReportPromise || null;
    }

    const hasEnded = this.runTracker.hasEnded && this.runTracker.hasEnded();
    if (hasEnded) {
      return this.runReportPromise || null;
    }

    const finalReason = reasonEnd || this.pendingNaturalReason || null;

    const report = this.runTracker.endRun({
      result,
      reasonEnd: finalReason,
      finalGold: this.money,
      livesRemaining: this.lives,
      elapsedMs: Math.round(this.elapsedTimeMs || 0),
    });
    if (!report) return null;

    if (!isNaturalEnd) {
      return null;
    }

    console.log("[RunReport] Sending natural end", {
      result: report.result,
      reason: report.reasonEnd,
    });
    const sender = this.sendRunReportFn || sendRunReport;
    this.isRunReportSending = true;
    this.runReportPromise = sender(report)
      .then((response) => {
        this.notifyAchievementsUpdate();
        return response;
      })
      .catch((err) => {
        console.warn("RunReport send failed", err);
        return null;
      })
      .finally(() => {
        this.isRunReportSending = false;
      });
    return this.runReportPromise;
  }

  async notifyAchievementsUpdate() {
    try {
      const { summary } = await fetchAchievements();
      if (summary) {
        window.dispatchEvent(
          new CustomEvent("achievements:updated", { detail: { summary } })
        );
      }
    } catch (err) {
      console.warn("Impossible de rafraîchir les succès après la partie", err);
    }
  }

  refreshProgressCaches() {
    try {
      resetCachedChapters();
    } catch (err) {
      console.warn("Impossible de réinitialiser les chapitres mis en cache", err);
    }
  }


  // =========================================================
  // GESTION CLICS & MENUS
  // =========================================================

  findHeroSpawnTile() {
    const map = this.levelConfig.map || [];
    const pathTypes = [1, 4, 7, 13, 19];
    let baseTile = null;
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === 2) {
          baseTile = { x, y };
          break;
        }
      }
      if (baseTile) break;
    }

    if (baseTile) {
      const dirs = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ];
      for (const d of dirs) {
        const nx = baseTile.x + d.x;
        const ny = baseTile.y + d.y;
        if (ny >= 0 && ny < map.length && nx >= 0 && nx < map[ny].length) {
          if (pathTypes.includes(map[ny][nx])) {
            return { x: nx, y: ny };
          }
        }
      }
    }

    if (this.levelConfig.paths?.[0]?.length) {
      const lastPoint =
        this.levelConfig.paths[0][this.levelConfig.paths[0].length - 1];
      return { x: lastPoint.x, y: lastPoint.y };
    }

    return { x: 0, y: 0 };
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
      this.runTracker.onGoldSpent(cost);
      this.updateUI();

      this.runTracker.onTowerUpgrade({
        key: this.selectedTurret?.config?.key,
        level: this.selectedTurret?.level + 1,
        maxLevel: this.selectedTurret?.config?.maxLevel,
      });
      this.selectedTurret.upgrade();

      this.upgradeMenu.setVisible(false);
      // Activer le flag pour ignorer le prochain clic (qui serait le pointerup du clic sur le bouton)
      if (this.inputManager) {
        this.inputManager.justUpgradedFromMenu = true;
      }
      this.selectedTurret = null;
    } else {
      this.cameras.main.shake(50, 0.005);
    }
  }

  buildTurret(turretConfig, tileX, tileY) {
    // --- CORRECTION ICI ---
    // Vérification stricte du terrain : Types autorisés : herbe (0), neige (6), sol glacé profond (24), sable (10), cimetière (12), roche volcanique (16), sol rose (18), sol laboratoire (22)
    // Note: type 11 (rochers sable) et type 5 (rochers) ne sont pas constructibles car ce sont des décors
    const tileType = this.levelConfig.map[tileY][tileX];
    if (tileType !== 0 && tileType !== 6 && tileType !== 24 && tileType !== 10 && tileType !== 12 && tileType !== 16 && tileType !== 18 && tileType !== 22) {
      this.cameras.main.shake(50, 0.005);
      return false;
    }

    // Vérifier qu'il n'y a pas d'arbre ici
    if (this.mapManager.hasTree(tileX, tileY)) {
      return false;
    }

    // ... Le reste de ta méthode reste identique ... 
    const isBarracks = turretConfig.key === "barracks";
    const isSniper = turretConfig.key === "sniper";

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

    // Limiter les snipers à 10 maximum
    if (isSniper) {
      const sniperCount = this.turrets.filter((t) => t.config.key === "sniper").length;
      if (sniperCount >= this.maxSnipers) {
        this.cameras.main.shake(50, 0.005);
        const errorText = this.add
          .text(
            this.gameWidth / 2,
            this.gameHeight / 2,
            `Maximum ${this.maxSnipers} snipers!`,
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
    }

    // Pour les barracks, vérifier qu'on peut poser uniquement sur les cases adjacentes aux chemins
    if (isBarracks && !this.mapManager.isAdjacentToPath(tileX, tileY)) {
      this.cameras.main.shake(50, 0.005);
      return false;
    }

    if (this.money >= turretConfig.cost) {
      this.money -= turretConfig.cost;
      this.runTracker.onGoldSpent(turretConfig.cost);
      this.updateUI();
      const T = CONFIG.TILE_SIZE * this.scaleFactor;
      const px = this.mapStartX + tileX * T + T / 2;
      const py = this.mapStartY + tileY * T + T / 2;

      // Sauvegarder la valeur originale de la case avant de la modifier
      const originalTileType = this.levelConfig.map[tileY][tileX];
      
      if (isBarracks) {
        const b = new Barracks(this, px, py, turretConfig);
        b.tileX = tileX;
        b.tileY = tileY;
        b.originalTileType = originalTileType;
        b.setDepth(20);
        b.setScale(this.scaleFactor);
        this.barracks.push(b);
        b.deploySoldiers();
        this.runTracker.onTowerBuild({ key: turretConfig.key, level: 1 });
      } else {
        const t = new Turret(this, px, py, turretConfig);
        t.tileX = tileX;
        t.tileY = tileY;
        t.originalTileType = originalTileType;
        t.setDepth(20);
        t.setScale(this.scaleFactor);
        this.turrets.push(t);
        this.runTracker.onTowerBuild({ key: turretConfig.key, level: 1 });
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

  takeDamage(amount = 1) {
    // Si le jeu est déjà terminé, ne plus accepter de dégâts
    // On vérifie seulement gameOverTriggered et isPaused, pas _gameOverShown
    // car _gameOverShown est un flag UI, pas un flag de game state
    if (this.gameOverTriggered || this.isPaused) {
      return;
    }

    const previousLives = this.lives;
    this.lives = Math.max(0, this.lives - amount);
    const lost = Math.max(0, previousLives - this.lives);
    this.runTracker.onBaseDamage({
      amount,
      livesRemaining: this.lives,
      livesLost: lost,
    });
    this.updateUI();
    this.cameras.main.shake(150, 0.01);
    if (this.lives <= 0) {
      this.triggerGameOver();
    }
  }

  triggerGameOver() {
    if (this.gameOverTriggered) return;

    this.gameOverTriggered = true;
    this.isPaused = true;
    this.pendingNaturalRunResult = "LOSE";
    this.pendingNaturalReason = "base_destroyed";

    // Nettoyer tous les timers liés aux vagues pour empêcher toute progression
    if (this.waveSpawnTimers?.length) {
      this.waveSpawnTimers.forEach((t) => t?.remove());
    }
    this.waveSpawnTimers = [];

    if (this.endCheckTimer) {
      this.endCheckTimer.remove();
      this.endCheckTimer = null;
    }

    if (this.nextWaveAutoTimer) {
      this.nextWaveAutoTimer.remove();
      this.nextWaveAutoTimer = null;
      this.nextWaveCountdown = 0;
    }

    this.isWaveRunning = false;
    this.hasWaveFinishedSpawning = false;
    this.canCallNextWave = false;

    // Appeler de manière asynchrone sans bloquer
    this.showGameOverNotification().catch((err) => {
      console.error("[GameOver] Error showing game over notification:", err);
      // Fallback : afficher quand même la popup après un délai si l'erreur survient
      setTimeout(() => {
        if (!this._gameOverShown && this.scene && this.scene.isActive()) {
          console.warn("[GameOver] Fallback: forcing game over display");
          this._gameOverShown = false; // Réinitialiser pour permettre l'affichage
          this.showGameOverNotification().catch(() => {});
        }
      }, 2000);
    });
  }

  showTransmissionOverlay(result = "VICTOIRE") {
    if (this.transmissionOverlay) return;
  
    const s = this.scaleFactor || 1;
    const cam = this.cameras.main;
  
    // IMPORTANT: tout en coordonnées écran (UI), pas monde
    const width = cam.width;
    const height = cam.height;
  
    const container = this.add.container(cam.midPoint.x, cam.midPoint.y);
    container.setDepth(999999);
    container.setScrollFactor(0);
  
    const blocker = this.add
      .rectangle(0, 0, width, height, 0x000000, 0.6)
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setInteractive();
  
    const panelWidth = Math.min(width * 0.9, 520 * s);
    const panelHeight = Math.min(height * 0.6, 220 * s);
  
    const bg = this.add.graphics();
    bg.setScrollFactor(0);
    bg.fillStyle(0x0f0f1a, 0.95);
    bg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 16);
    bg.lineStyle(3, result === "VICTOIRE" ? 0x00ff88 : 0xff6666, 1);
    bg.strokeRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 16);
  
    const title = this.add
      .text(0, -50 * s, result, {
        fontSize: `${Math.max(26, 36 * s)}px`,
        fontStyle: "bold",
        color: result === "VICTOIRE" ? "#00ff88" : "#ff6666",
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setScrollFactor(0);
  
    const message = this.add
      .text(0, 10 * s, "Envoi des données du niveau en cours\nVeuillez patienter...", {
        fontSize: `${Math.max(16, 20 * s)}px`,
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: panelWidth - 40 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0);
  
    const loaderSize = 28 * s;
    const loader = this.add.graphics();
    loader.setScrollFactor(0);
    loader.lineStyle(4 * s, 0xffffff, 1);
    loader.beginPath();
    loader.arc(0, 60 * s, loaderSize, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(270));
    loader.strokePath();
  
    this.tweens.add({
      targets: loader,
      angle: 360,
      duration: 900,
      repeat: -1,
      ease: "Linear",
    });
  
    // bloquer la propagation
    blocker.on("pointerdown", (pointer) => pointer?.event?.stopPropagation?.());
  
    container.add([blocker, bg, title, message, loader]);
    this.transmissionOverlay = container;
  }
  
  hideTransmissionOverlay() {
    if (!this.transmissionOverlay) return;
  
    // tuer tous les tweens des enfants (loader tourne en boucle)
    this.transmissionOverlay.list.forEach((obj) => {
      try {
        this.tweens.killTweensOf(obj);
      } catch (_) {}
    });
  
    try {
      this.transmissionOverlay.destroy(true);
    } catch (_) {}
  
    this.transmissionOverlay = null;
  }
  
  async showGameOverNotification() {
    if (this._gameOverShown) return;
    this._gameOverShown = true;
  
    this.isPaused = true;
  
    // écran "envoi" pendant les requêtes
    this.hideTransmissionOverlay();
    this.showTransmissionOverlay("DÉFAITE");
  
    // Utiliser un timeout pour s'assurer que l'écran s'affiche même si les requêtes prennent trop de temps
    const maxWaitTime = 10000; // 10 secondes maximum
    const startTime = Date.now();
    
    try {
      const heroKillReport = this.reportHeroKillsOnce(true);
      if (heroKillReport) {
        await Promise.race([
          heroKillReport,
          new Promise(resolve => setTimeout(resolve, maxWaitTime - (Date.now() - startTime)))
        ]);
      }
    } catch (_) {}
  
    try {
      const remainingTime = Math.max(0, maxWaitTime - (Date.now() - startTime));
      if (remainingTime > 0) {
        await Promise.race([
          this.finalizeRunReport("LOSE", "base_destroyed"),
          new Promise(resolve => setTimeout(resolve, remainingTime))
        ]);
      }
    } catch (_) {}
  
    // stop l'écran "envoi" avant d'afficher la vraie popup
    this.hideTransmissionOverlay();
    
    // S'assurer qu'on attend un peu pour que l'overlay soit bien détruit avant d'afficher la popup
    await new Promise(resolve => setTimeout(resolve, 100));

    // Vérifier que la scène est toujours active avant d'afficher la popup
    if (!this.scene || !this.scene.isActive()) {
      console.warn("[GameOver] Scene is not active, cannot show notification");
      return;
    }

    if (this.pauseBtn) {
      try {
        this.pauseBtn.disableInteractive();
        this.pauseBtn.setAlpha(0.5);
      } catch (_) {}
    }
    if (this.quitBtn) {
      try {
        this.quitBtn.disableInteractive();
        this.quitBtn.setAlpha(0.5);
      } catch (_) {}
    }

    const cam = this.cameras.main;
    if (!cam) {
      console.warn("[GameOver] Camera not available, cannot show notification");
      return;
    }
    
    const s = this.scaleFactor || 1;

    // UI overlay fixé à l'écran
    const overlay = this.add.container(cam.midPoint.x, cam.midPoint.y);
    if (!overlay) {
      console.warn("[GameOver] Failed to create overlay container");
      return;
    }
    overlay.setDepth(999999);
    overlay.setScrollFactor(0);
  
    const blocker = this.add
      .rectangle(0, 0, cam.width, cam.height, 0x000000, 0.35)
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setInteractive();
  
    const panelW = Math.min(cam.width * 0.86, 520 * s);
    const panelH = Math.min(cam.height * 0.56, 300 * s);
  
    const panelBg = this.add.graphics();
    panelBg.setScrollFactor(0);
    panelBg.fillStyle(0x000000, 0.92);
    panelBg.fillRoundedRect(-panelW / 2, -panelH / 2, panelW, panelH, 18);
    panelBg.lineStyle(3, 0xff0000, 0.9);
    panelBg.strokeRoundedRect(-panelW / 2, -panelH / 2, panelW, panelH, 18);
  
    const title = this.add
      .text(0, -panelH * 0.18, "PERDU !", {
        fontSize: `${Math.max(28, 52 * s)}px`,
        color: "#ff0000",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setScrollFactor(0);
  
    const sub = this.add
      .text(0, panelH * 0.10, "Cliquez pour retourner au menu", {
        fontSize: `${Math.max(16, 24 * s)}px`,
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: panelW - 40 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0);
  
    overlay.add([blocker, panelBg, title, sub]);
  
    const goMenu = () => {
      try {
        blocker.disableInteractive();
      } catch (_) {}
  
      try {
        overlay.destroy(true);
      } catch (_) {}
  
      this.gameOverBlocker = null;
      this.scene.start("MainMenuScene");
    };
  
    blocker.on("pointerdown", (pointer) => {
      pointer?.event?.stopPropagation?.();
      goMenu();
    });
  
    this.gameOverBlocker = overlay;
  
    // resize: garder au centre et blocker à la bonne taille
    const onResize = () => {
      if (!overlay?.active) return;
      overlay.setPosition(this.cameras.main.midPoint.x, this.cameras.main.midPoint.y);
      blocker.setSize(this.cameras.main.width, this.cameras.main.height);
    };
  
    try {
      this.scale.off("resize", this._onGameOverResize);
    } catch (_) {}
    this._onGameOverResize = onResize;
    this.scale.on("resize", this._onGameOverResize);
  
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      try {
        this.scale.off("resize", this._onGameOverResize);
      } catch (_) {}
    });
  }  
  
  earnMoney(amount, meta = {}) {
    this.money += amount;
    this.runTracker.onGoldEarned(amount, meta);
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
      // Repositionner au centre au cas où la taille de l'écran a changé
      this.resumeBtn.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);
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

    // Utiliser le centre de la caméra pour un centrage parfait
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    this.resumeBtn = this.add
      .container(centerX, centerY)
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

  showQuitConfirmation() {
    // Si une confirmation est déjà affichée, ne pas en créer une autre
    if (this.quitConfirmationContainer) {
      return;
    }

    const s = this.scaleFactor;
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;
    const dialogWidth = 400 * s;
    const dialogHeight = 200 * s;

    // Container principal de la confirmation
    this.quitConfirmationContainer = this.add
      .container(centerX, centerY)
      .setDepth(2000);

    // Fond semi-transparent
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(
      -this.cameras.main.width / 2,
      -this.cameras.main.height / 2,
      this.cameras.main.width,
      this.cameras.main.height
    );
    this.quitConfirmationContainer.add(overlay);

    // Fond de la boîte de dialogue
    const dialogBg = this.add.graphics();
    dialogBg.fillStyle(0x1a1a2e, 0.95);
    dialogBg.fillRoundedRect(
      -dialogWidth / 2,
      -dialogHeight / 2,
      dialogWidth,
      dialogHeight,
      15
    );
    dialogBg.lineStyle(3, 0xff4444, 1);
    dialogBg.strokeRoundedRect(
      -dialogWidth / 2,
      -dialogHeight / 2,
      dialogWidth,
      dialogHeight,
      15
    );
    this.quitConfirmationContainer.add(dialogBg);

    // Texte de confirmation
    const confirmText = this.add
      .text(0, -40, "Êtes-vous sûr de vouloir\nquitter la partie ?", {
        fontSize: `${Math.max(16, 20 * s)}px`,
        fill: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);
    this.quitConfirmationContainer.add(confirmText);

    // Bouton Oui
    const yesBtn = this.add
      .text(-80, 40, "OUI", {
        fontSize: `${Math.max(14, 18 * s)}px`,
        fill: "#ff4444",
        backgroundColor: "#2a1a1a",
        padding: { x: 20 * s, y: 10 * s },
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => yesBtn.setColor("#ff6666"))
      .on("pointerout", () => yesBtn.setColor("#ff4444"))
      .on("pointerdown", () => {
        this.quitGame();
      });
    this.quitConfirmationContainer.add(yesBtn);

    // Bouton Non
    const noBtn = this.add
      .text(80, 40, "NON", {
        fontSize: `${Math.max(14, 18 * s)}px`,
        fill: "#00ccff",
        backgroundColor: "#1a1a2a",
        padding: { x: 20 * s, y: 10 * s },
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => noBtn.setColor("#00eaff"))
      .on("pointerout", () => noBtn.setColor("#00ccff"))
      .on("pointerdown", () => {
        this.closeQuitConfirmation();
      });
    this.quitConfirmationContainer.add(noBtn);

    // Fermer en cliquant sur l'overlay (mais pas sur la boîte)
    overlay.setInteractive(
      new Phaser.Geom.Rectangle(
        -this.cameras.main.width / 2,
        -this.cameras.main.height / 2,
        this.cameras.main.width,
        this.cameras.main.height
      ),
      Phaser.Geom.Rectangle.Contains
    );
    overlay.on("pointerdown", (pointer) => {
      // Ne fermer que si on clique sur l'overlay, pas sur la boîte
      const dialogRect = new Phaser.Geom.Rectangle(
        centerX - dialogWidth / 2,
        centerY - dialogHeight / 2,
        dialogWidth,
        dialogHeight
      );
      if (!dialogRect.contains(pointer.x, pointer.y)) {
        this.closeQuitConfirmation();
      }
    });
  }

  closeQuitConfirmation() {
    if (this.quitConfirmationContainer) {
      this.quitConfirmationContainer.destroy();
      this.quitConfirmationContainer = null;
    }
  }

  quitGame() {
    // Nettoyer les ressources
    this.closeQuitConfirmation();
    
    this.finalizeRunReport("ABORT", "quit_to_menu");

    // Retourner au menu principal
    this.scene.start("MainMenuScene");
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

  spawnCoinDrop(x, y) {
    if (!this.coins) return;
    const dropX = Number.isFinite(x) ? x : this.cameras.main.centerX;
    const dropY = Number.isFinite(y) ? y : this.cameras.main.centerY;
    const amount = Phaser.Math.Between(2, 12);
    const coin = new GoldCoin(this, dropX, dropY, amount);
    this.coins.add(coin);
  }

  updateCoins(time, delta) {
    if (!this.coins) return;
    this.coins.children.each((coin) => {
      if (coin?.update) {
        coin.update(time, delta);
      }
    });
  }

  checkHeroCoinPickup() {
    if (!this.hero || !this.coins) return;
    this.coins.children.each((coin) => {
      if (!coin?.active || coin.isCollected) return;
      const dist = Phaser.Math.Distance.Between(this.hero.x, this.hero.y, coin.x, coin.y);
      if (dist <= coin.pickupRadius) {
        coin.collect();
      }
    });
  }

  shutdown() {
    this.hideTransmissionOverlay();
    if (this.runTracker && this.runTracker.hasEnded && !this.runTracker.hasEnded()) {
      this.finalizeRunReport("ABORT", "scene_shutdown");
    }
    // Rendre shutdown() idempotent : safe si appelé plusieurs fois
    try {
      this.events?.off("enemy-killed", this.handleEnemyKilled, this);
    } catch (e) {}

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
      if (this.hero) {
        try {
          if (this.hero.corpseTimerEvent) this.hero.corpseTimerEvent.remove();
          if (this.hero.corpseContainer) this.hero.corpseContainer.destroy();
          this.hero.destroy();
        } catch (e) {}
        this.hero = null;
      }

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

    try {
      this.spawnControls?.destroy();
    } catch (e) {
      // ignore
    }
    this.spawnControls = null;
  }
}
