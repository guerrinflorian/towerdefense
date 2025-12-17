import { CONFIG } from "../config/settings.js";
import { LEVELS_CONFIG } from "../config/levels/index.js";
import { TURRETS } from "../config/turrets/index.js";
import { Enemy } from "../objects/Enemy.js";
import { Turret } from "../objects/Turret.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  init(data) {
    this.levelID = data.level || 1;
    const levelData = LEVELS_CONFIG.find((l) => l.id === this.levelID);
    this.levelConfig = levelData ? levelData.data : LEVELS_CONFIG[0].data;

    this.money = CONFIG.STARTING_MONEY;
    this.lives = CONFIG.STARTING_LIVES;
    this.turrets = [];
    this.paths = [];
    this.currentWaveIndex = 0;
    this.isWaveRunning = false;
    this.enemies = null;
    this.selectedTurret = null;
  }

  preload() {
    this.generateTextures();
  }

  create() {
    this.input.mouse.disableContextMenu();
    this.cameras.main.setBackgroundColor("#050505");

    this.createMap();
    this.enemies = this.add.group({ runChildUpdate: true });
    this.createUI();

    this.input.on("pointerdown", (pointer) => {
      // Masquer les menus par défaut
      this.buildMenu.setVisible(false);
      this.upgradeMenu.setVisible(false);
      this.selectedTurret = null;

      if (pointer.rightButtonDown()) {
        this.handleRightClick(pointer);
      }
    });
  }

  update(time, delta) {
    this.turrets.forEach((t) => t.update(time, this.enemies));
  }

  // =========================================================
  // GESTION CARTE & CHEMINS
  // =========================================================

  createMap() {
    const mapData = this.levelConfig.map;
    const T = CONFIG.TILE_SIZE;
    const OFF = CONFIG.MAP_OFFSET;

    for (let y = 0; y < mapData.length; y++) {
      for (let x = 0; x < mapData[y].length; x++) {
        const type = mapData[y][x];
        const px = x * T;
        const py = y * T + OFF;

        let key = "tile_grass_1";
        if (type === 0)
          key = (x + y) % 2 === 0 ? "tile_grass_2" : "tile_grass_1";
        if (type === 1) key = "tile_path";
        if (type === 2) key = "tile_base";
        if (type === 3) key = "tile_water";
        if (type === 4) key = "tile_bridge";
        if (type === 9) key = "tile_grass_2";

        this.add.image(px, py, key).setOrigin(0, 0).setDepth(0);
        if (type === 0) this.addDecoration(px, py);
      }
    }

    this.paths = [];
    const rawPaths = this.levelConfig.paths || [this.levelConfig.path];
    const H = T / 2;
    rawPaths.forEach((points) => {
      const newPath = new Phaser.Curves.Path();
      newPath.moveTo(points[0].x * T + H, points[0].y * T + H + OFF);
      for (let i = 1; i < points.length; i++) {
        newPath.lineTo(points[i].x * T + H, points[i].y * T + H + OFF);
      }
      this.paths.push(newPath);
    });
  }

  addDecoration(px, py) {
    if (Math.random() > 0.92) {
      const dx = px + Phaser.Math.Between(10, 54);
      const dy = py + Phaser.Math.Between(10, 54);
      if (Math.random() > 0.5) {
        this.add.circle(dx, dy, 3, 0xffaa00).setDepth(1);
        this.add.circle(dx + 2, dy + 2, 2, 0x00ff00).setDepth(1);
      } else {
        this.add.circle(dx, dy, 4, 0x555555).setDepth(1);
      }
    }
  }

  // =========================================================
  // VAGUES
  // =========================================================

  startWave() {
    if (this.isWaveRunning) return;
    if (this.currentWaveIndex >= this.levelConfig.waves.length) return;
    this.isWaveRunning = true;
    this.waveBtnText.setText("⚠️ EN COURS");
    this.waveBtnBg.setStrokeStyle(3, 0xffaa00);
    const waveGroups = this.levelConfig.waves[this.currentWaveIndex];
    let totalEnemiesInWave = 0;
    let spawnedTotal = 0;
    waveGroups.forEach((g) => (totalEnemiesInWave += g.count));
    waveGroups.forEach((group) => {
      this.time.addEvent({
        delay: group.interval,
        repeat: group.count - 1,
        callback: () => {
          const randomPath = Phaser.Utils.Array.GetRandom(this.paths);
          const enemy = new Enemy(this, randomPath, group.type);
          enemy.setDepth(10);
          enemy.spawn();
          this.enemies.add(enemy);
          spawnedTotal++;
          if (spawnedTotal >= totalEnemiesInWave) {
            this.monitorWaveEnd();
          }
        },
      });
    });
  }
  monitorWaveEnd() {
    this.endCheckTimer = this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        if (this.enemies.getLength() === 0) {
          this.finishWave();
        }
      },
    });
  }
  finishWave() {
    this.endCheckTimer.remove();
    this.isWaveRunning = false;
    this.currentWaveIndex++;
    this.earnMoney(50 + this.currentWaveIndex * 20);
    if (this.currentWaveIndex >= this.levelConfig.waves.length) {
      this.levelComplete();
    } else {
      this.waveBtnText.setText(`▶ VAGUE ${this.currentWaveIndex + 1}`);
      this.waveBtnBg.setStrokeStyle(3, 0x00ff00);
    }
  }
  levelComplete() {
    const currentSaved = parseInt(localStorage.getItem("levelReached")) || 1;
    if (this.levelID >= currentSaved) {
      localStorage.setItem("levelReached", this.levelID + 1);
    }
    const bg = this.add
      .rectangle(
        CONFIG.GAME_WIDTH / 2,
        CONFIG.GAME_HEIGHT / 2,
        500,
        300,
        0x000000,
        0.9
      )
      .setDepth(200);
    const txt = this.add
      .text(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 - 30, "VICTOIRE !", {
        fontSize: "50px",
        color: "#00ff00",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(201);
    const sub = this.add
      .text(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 + 50, "Continuer", {
        fontSize: "24px",
      })
      .setOrigin(0.5)
      .setDepth(201);
    bg.setInteractive({ useHandCursor: true }).on("pointerdown", () =>
      this.scene.start("MainMenuScene")
    );
    this.add.existing(bg);
    this.add.existing(txt);
    this.add.existing(sub);
  }

  // =========================================================
  // GESTION CLICS & MENUS (CORRIGÉ)
  // =========================================================

  handleRightClick(pointer) {
    if (pointer.worldY < CONFIG.MAP_OFFSET) return;

    // 1. Convertir clic en coordonnées Grille
    const tx = Math.floor(pointer.worldX / CONFIG.TILE_SIZE);
    const ty = Math.floor(
      (pointer.worldY - CONFIG.MAP_OFFSET) / CONFIG.TILE_SIZE
    );

    if (tx < 0 || tx >= 15 || ty < 0 || ty >= 15) return;

    // 2. Vérifier si une tourelle est sur cette case précise
    let clickedTurret = null;
    for (const t of this.turrets) {
      const turretTx = Math.floor(t.x / CONFIG.TILE_SIZE);
      const turretTy = Math.floor((t.y - CONFIG.MAP_OFFSET) / CONFIG.TILE_SIZE);
      if (turretTx === tx && turretTy === ty) {
        clickedTurret = t;
        break;
      }
    }

    if (clickedTurret) {
      // Clic exact sur la tourelle -> Upgrade
      this.openUpgradeMenu(pointer, clickedTurret);
    } else {
      // Clic sur case vide -> Build
      this.openBuildMenu(pointer);
    }
  }

  openBuildMenu(pointer) {
    const tx = Math.floor(pointer.worldX / CONFIG.TILE_SIZE);
    const ty = Math.floor(
      (pointer.worldY - CONFIG.MAP_OFFSET) / CONFIG.TILE_SIZE
    );

    if (tx < 0 || tx >= 15 || ty < 0 || ty >= 15) return;
    if (this.levelConfig.map[ty][tx] !== 0) return;

    this.selectedTile = { x: tx, y: ty };

    let mx = pointer.worldX;
    let my = pointer.worldY;
    if (mx > CONFIG.GAME_WIDTH - 240) mx = CONFIG.GAME_WIDTH - 240;
    if (my > CONFIG.GAME_HEIGHT - 110) my = CONFIG.GAME_HEIGHT - 110;

    this.buildMenu.setPosition(mx, my);
    this.buildMenu.setVisible(true);
  }

  openUpgradeMenu(pointer, turret) {
    this.selectedTurret = turret;

    // --- CORRECTION MAJEURE ICI ---
    // Si niveau max atteint, on affiche un message spécial et on désactive l'upgrade
    if (turret.level >= turret.config.maxLevel) {
      this.upgradeInfoText.setText(`NIVEAU MAX ATTEINT\n(Lv.${turret.level})`);
      this.upgradeBtnText.setText("NIVEAU MAX");
      this.upgradeBtnText.setColor("#888888"); // Grisé
      // On empêche le clic via une logique dans triggerUpgrade
    } else {
      // Cas normal : on peut upgrade
      const nextStats = turret.getNextLevelStats();

      // Sécurité supplémentaire
      if (!nextStats) return;

      const cost = nextStats.cost;

      this.upgradeBtnText.setText(`AMÉLIORER (${cost}$)`);

      if (this.money >= cost) {
        this.upgradeBtnText.setColor("#00ff00");
      } else {
        this.upgradeBtnText.setColor("#ff0000");
      }

      // Affichage détaillé des stats
      this.upgradeInfoText.setText(
        `Niveau: ${turret.level} -> ${turret.level + 1}\n` +
          `Dégâts: ${Math.round(turret.config.damage)} -> ${
            nextStats.damage
          }\n` +
          `Vitesse: ${Math.round(turret.config.rate)}ms -> ${
            nextStats.rate
          }ms\n` +
          `Portée: ${Math.round(turret.config.range)} -> ${nextStats.range}`
      );
    }

    let mx = pointer.worldX;
    let my = pointer.worldY;
    if (mx > CONFIG.GAME_WIDTH - 240) mx = CONFIG.GAME_WIDTH - 240;
    if (my > CONFIG.GAME_HEIGHT - 110) my = CONFIG.GAME_HEIGHT - 110;

    this.upgradeMenu.setPosition(mx, my);
    this.upgradeMenu.setVisible(true);
  }

  triggerUpgrade() {
    if (!this.selectedTurret) return;

    // --- CORRECTION : BLOQUAGE SI MAX LEVEL ---
    if (this.selectedTurret.level >= this.selectedTurret.config.maxLevel) {
      // Petit shake pour dire "Non"
      this.cameras.main.shake(30, 0.005);
      return;
    }

    const nextStats = this.selectedTurret.getNextLevelStats();
    if (!nextStats) return;

    const cost = nextStats.cost;

    if (this.money >= cost) {
      this.money -= cost;
      this.updateUI();

      this.selectedTurret.upgrade(); // Action

      this.upgradeMenu.setVisible(false);
      this.selectedTurret = null;
    } else {
      this.cameras.main.shake(50, 0.005);
    }
  }

  buildTurret(turretConfig) {
    if (this.money >= turretConfig.cost) {
      this.money -= turretConfig.cost;
      this.updateUI();
      const px = this.selectedTile.x * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
      const py =
        this.selectedTile.y * CONFIG.TILE_SIZE +
        CONFIG.MAP_OFFSET +
        CONFIG.TILE_SIZE / 2;
      const t = new Turret(this, px, py, turretConfig);
      t.setDepth(20);
      this.turrets.push(t);
      this.buildMenu.setVisible(false);
      this.levelConfig.map[this.selectedTile.y][this.selectedTile.x] = 9;
    } else {
      this.cameras.main.shake(50, 0.005);
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
  }

  createUI() {
    const topBar = this.add.container(0, 0).setDepth(100);
    const bgBar = this.add.graphics();
    bgBar.fillStyle(0x111111, 1);
    bgBar.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.UI_HEIGHT);
    bgBar.fillStyle(0x00ccff, 0.5);
    bgBar.fillRect(0, CONFIG.UI_HEIGHT - 2, CONFIG.GAME_WIDTH, 2);
    topBar.add(bgBar);
    this.txtMoney = this.add
      .text(20, CONFIG.UI_HEIGHT / 2, "", {
        fontSize: "24px",
        fill: "#ffd700",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0, 0.5);
    topBar.add(this.txtMoney);
    this.txtLives = this.add
      .text(250, CONFIG.UI_HEIGHT / 2, "", {
        fontSize: "24px",
        fill: "#ff4444",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0, 0.5);
    topBar.add(this.txtLives);
    const quitBtn = this.add
      .text(CONFIG.GAME_WIDTH - 20, CONFIG.UI_HEIGHT / 2, "QUITTER", {
        fontSize: "18px",
        fill: "#aaaaaa",
        backgroundColor: "#333333",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => quitBtn.setColor("#ffffff"))
      .on("pointerout", () => quitBtn.setColor("#aaaaaa"))
      .on("pointerdown", () => this.scene.start("MainMenuScene"));
    topBar.add(quitBtn);
    this.updateUI();

    const wx = CONFIG.GAME_WIDTH - 180;
    const wy = CONFIG.GAME_HEIGHT - 60;
    this.waveBtnContainer = this.add.container(wx, wy).setDepth(100);
    this.waveBtnBg = this.add
      .rectangle(0, 0, 300, 60, 0x000000, 0.8)
      .setStrokeStyle(3, 0x00ff00);
    this.waveBtnText = this.add
      .text(0, 0, "▶ LANCER VAGUE 1", {
        fontSize: "22px",
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.waveBtnContainer.add([this.waveBtnBg, this.waveBtnText]);
    this.waveBtnBg
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.startWave());

    // Menu Construction
    this.buildMenu = this.add.container(0, 0).setVisible(false).setDepth(240);
    const mBg = this.add.image(0, 0, "ui_bg").setOrigin(0, 0);
    const btn1 = this.createBuildBtn(10, 10, TURRETS.machine_gun);
    const btn2 = this.createBuildBtn(10, 40, TURRETS.sniper);
    const btn3 = this.createBuildBtn(10, 70, TURRETS.cannon);
    this.buildMenu.add([mBg, btn1, btn2, btn3]);

    // Menu Amélioration
    this.upgradeMenu = this.add.container(0, 0).setVisible(false).setDepth(240);
    const uBg = this.add.image(0, 0, "ui_bg").setOrigin(0, 0);
    this.upgradeInfoText = this.add.text(10, 10, "", {
      fontSize: "14px",
      fill: "#ffffff",
      wordWrap: { width: 220 },
    });
    this.upgradeBtnText = this.add
      .text(10, 75, "UPGRADE", {
        fontSize: "16px",
        fill: "#ffffff",
        fontStyle: "bold",
        backgroundColor: "#333",
        padding: { x: 5, y: 5 },
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.triggerUpgrade());
    this.upgradeMenu.add([uBg, this.upgradeInfoText, this.upgradeBtnText]);
  }

  createBuildBtn(x, y, turretConfig) {
    const txt = this.add
      .text(x, y, `${turretConfig.name} (${turretConfig.cost}$)`, {
        fontSize: "16px",
        fill: "#ffffff",
      })
      .setInteractive({ useHandCursor: true });
    txt.on("pointerdown", () => this.buildTurret(turretConfig));
    return txt;
  }

  generateTextures() {
    const T = CONFIG.TILE_SIZE;
    const g = this.make.graphics({ add: false });
    g.clear();
    g.fillStyle(0x222222, 0.95);
    g.fillRoundedRect(0, 0, 240, 110, 8);
    g.lineStyle(2, 0xffffff, 0.2);
    g.strokeRoundedRect(0, 0, 240, 110, 8);
    g.generateTexture("ui_bg", 240, 110);
    g.clear();
    g.fillStyle(0x2d8a3e, 1);
    g.fillRect(0, 0, T, T);
    for (let i = 0; i < 40; i++) {
      g.fillStyle(0x3da850, 0.5);
      g.fillRect(Math.random() * T, Math.random() * T, 2, 2);
    }
    g.generateTexture("tile_grass_1", T, T);
    g.clear();
    g.fillStyle(0x267534, 1);
    g.fillRect(0, 0, T, T);
    for (let i = 0; i < 40; i++) {
      g.fillStyle(0x3da850, 0.3);
      g.fillRect(Math.random() * T, Math.random() * T, 2, 2);
    }
    g.generateTexture("tile_grass_2", T, T);
    g.clear();
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
    g.generateTexture("tile_path", T, T);
    g.clear();
    g.fillStyle(0x333333, 1);
    g.fillRect(0, 0, T, T);
    g.lineStyle(3, 0x00ffff, 1);
    g.strokeRect(6, 6, T - 12, T - 12);
    g.fillStyle(0x00ffff, 0.5);
    g.fillCircle(T / 2, T / 2, 10);
    g.generateTexture("tile_base", T, T);
    g.clear();
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
    g.generateTexture("tile_water", T, T);
    g.clear();
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
    g.fillStyle(0x5c3a1e, 1);
    g.fillRect(0, 0, 6, T);
    g.fillRect(T - 6, 0, 6, T);
    g.generateTexture("tile_bridge", T, T);
  }
}
