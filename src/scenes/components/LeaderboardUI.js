import { LEVELS_CONFIG } from "../../config/levels/index.js";
import {
  fetchGlobalLeaderboard,
  fetchHeroLeaderboard,
  fetchLevelLeaderboards,
} from "../../services/leaderboardService.js";

export class LeaderboardUI extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.config = {
      width: 540,
      height: 450,
      accentColor: 0x00eaff,
      rowHeight: 32,
      maxEntries: 8,
    };

    this.viewModes = ["hero", "global", "level"];
    this.currentModeIndex = 1; // Start on "global"
    this.currentLevelIndex = 0;
    this.levelLeaderboards = [];
    this.levelLeaderboardMap = new Map();

    this.setupLayout();
    this.updateModeUI();
    this.loadData();

    this.scene.add.existing(this);
    this.setDepth(200);
  }

  get currentMode() {
    return this.viewModes[this.currentModeIndex];
  }

  setupLayout() {
    const { width, height, accentColor } = this.config;

    // --- 1. PANNEAU DE FOND ---
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x000000, 0.5);
    bg.fillRoundedRect(10, 10, width, height, 15);
    bg.fillStyle(0x0d1b2a, 0.95);
    bg.lineStyle(2, accentColor, 1);
    bg.fillRoundedRect(0, 0, width, height, 15);
    bg.strokeRoundedRect(0, 0, width, height, 15);
    bg.lineStyle(1, accentColor, 0.4);
    bg.lineBetween(15, 55, width - 15, 55);
    this.add(bg);

    // --- 2. NAVIGATION DES MODES ---
    const navStyle = {
      fontSize: "20px",
      fontFamily: "Impact, sans-serif",
      color: "#7dd0ff",
    };

    this.leftArrow = this.scene.add
      .text(20, 28, "◀", navStyle)
      .setInteractive({ useHandCursor: true });
    this.rightArrow = this.scene.add
      .text(width - 60, 28, "▶", navStyle)
      .setInteractive({ useHandCursor: true });
    this.add(this.leftArrow);
    this.add(this.rightArrow);

    this.leftArrow.on("pointerdown", () => this.switchMode(-1));
    this.rightArrow.on("pointerdown", () => this.switchMode(1));

    // --- 3. TITRE ---
    this.title = this.scene.add
      .text(width / 2, 18, "", {
        fontSize: "20px",
        fontFamily: "Impact, sans-serif",
        color: "#ffffff",
        letterSpacing: 1,
      })
      .setOrigin(0.5, 0)
      .setShadow(0, 0, "#00eaff", 10);
    this.add(this.title);

    // --- 4. BOUTON REFRESH ---
    this.refreshBtn = this.scene.add
      .text(width - 30, 28, "↻", {
        fontSize: "26px",
        color: accentColor,
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    this.refreshBtn.on("pointerdown", () => this.handleRefresh());
    this.add(this.refreshBtn);

    // --- 5. NAVIGATION DES NIVEAUX (VISIBLE UNIQUEMENT EN MODE NIVEAU) ---
    const levelNavStyle = { fontSize: "12px", color: "#9ae8ff", fontFamily: "Orbitron" };
    this.levelNav = this.scene.add.container(width / 2, 50);
    this.levelNavLeft = this.scene.add
      .text(-90, 0, "⟸", levelNavStyle)
      .setInteractive({ useHandCursor: true });
    this.levelNavLabel = this.scene.add.text(0, 0, "", levelNavStyle).setOrigin(0.5, 0.5);
    this.levelNavRight = this.scene.add
      .text(90, 0, "⟹", levelNavStyle)
      .setInteractive({ useHandCursor: true });
    this.levelNav.add([this.levelNavLeft, this.levelNavLabel, this.levelNavRight]);
    this.levelNavLeft.on("pointerdown", () => this.changeLevel(-1));
    this.levelNavRight.on("pointerdown", () => this.changeLevel(1));
    this.add(this.levelNav);

    // --- 6. EN-TÊTE DES COLONNES ---
    this.headerContainer = this.scene.add.container(0, 0);
    this.add(this.headerContainer);

    // --- 7. LISTE DES ENTRÉES ---
    this.listContainer = this.scene.add.container(0, 95);
    this.add(this.listContainer);

    this.statusText = this.scene.add
      .text(width / 2, height / 2 + 30, "", {
        fontSize: "14px",
        color: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);
    this.add(this.statusText);
  }

  switchMode(delta) {
    const total = this.viewModes.length;
    this.currentModeIndex = (this.currentModeIndex + delta + total) % total;
    if (this.currentMode === "level") {
      this.currentLevelIndex = 0;
    }
    this.updateModeUI();
    this.loadData();
  }

  changeLevel(delta) {
    const totalLevels = LEVELS_CONFIG.length;
    if (totalLevels === 0) return;
    this.currentLevelIndex = (this.currentLevelIndex + delta + totalLevels) % totalLevels;
    this.updateModeUI();
    this.loadData();
  }

  updateModeUI() {
    this.title.setText(this.getTitleText());
    this.levelNav.setVisible(this.currentMode === "level");
    this.updateLevelNavLabel();
    this.drawHeaders();
  }

  getTitleText() {
    if (this.currentMode === "hero") return "🦸 CLASSEMENT HÉROS";
    if (this.currentMode === "level") {
      const lvl = LEVELS_CONFIG[this.currentLevelIndex];
      if (lvl) {
        return `🗺️ CLASSEMENT NIVEAU ${lvl.id} • ${lvl.name.toUpperCase()}`;
      }
      return "🗺️ CLASSEMENT NIVEAU";
    }
    return "📊 CLASSEMENT GLOBAL";
  }

  updateLevelNavLabel() {
    if (!this.levelNav.visible) return;
    const lvl = LEVELS_CONFIG[this.currentLevelIndex];
    const label = lvl ? `NIVEAU ${lvl.id} — ${lvl.name}` : "NIVEAU";
    this.levelNavLabel.setText(label);
  }

  getColumns() {
    const { width } = this.config;
    if (this.currentMode === "hero") {
      return [
        { key: "rank", label: "RANG", x: 20, align: "left" },
        { key: "player", label: "JOUEUR", x: 80, align: "left" },
        { key: "hp", label: "PV", x: 220, align: "left" },
        { key: "dmg", label: "DÉGÂTS", x: 310, align: "left" },
        { key: "speed", label: "VITESSE", x: 400, align: "left" },
        { key: "score", label: "TOTAL", x: width - 20, align: "right" },
      ];
    }
    if (this.currentMode === "level") {
      return [
        { key: "rank", label: "RANG", x: 20, align: "left" },
        { key: "player", label: "JOUEUR", x: 150, align: "left" },
        { key: "hearts", label: "VIES PERDUES", x: 310, align: "left" },
        { key: "time", label: "TEMPS", x: width - 110, align: "right" },
        { key: "date", label: "DATE", x: width - 20, align: "right" },
      ];
    }
    return [
      { key: "rank", label: "RANG", x: 20, align: "left" },
      { key: "player", label: "JOUEUR", x: 75, align: "left" },
      { key: "lvl", label: "NIV MAX", x: 200, align: "left" },
      { key: "hearts", label: "COEURS PERDUS", x: 320, align: "left" },
      { key: "time", label: "TEMPS CUMULÉ", x: width - 20, align: "right" },
    ];
  }

  drawHeaders() {
    const hStyle = { fontSize: "11px", color: "#7dd0ff", fontWeight: "bold", fontFamily: "Orbitron, Arial" };
    this.headerContainer.removeAll(true);
    this.activeColumns = this.getColumns();
    this.activeColumns.forEach((col) => {
      const txt = this.scene.add.text(col.x, 65, col.label, hStyle);
      if (col.align === "right") txt.setOrigin(1, 0);
      this.headerContainer.add(txt);
    });
  }

  async handleRefresh() {
    if (this.currentMode === "level") {
      this.levelLeaderboards = [];
      this.levelLeaderboardMap.clear();
    }
    this.scene.tweens.add({
      targets: this.refreshBtn,
      angle: 360,
      duration: 500,
      onComplete: () => {
        this.refreshBtn.angle = 0;
        this.loadData();
      },
    });
  }

  async loadData() {
    try {
      this.listContainer.removeAll(true);
      this.statusText.setText("CHARGEMENT DES DONNÉES...");

      if (this.currentMode === "hero") {
        const entries = await fetchHeroLeaderboard();
        this.statusText.setText("");
        this.renderHeroEntries(entries);
        return;
      }

      if (this.currentMode === "level") {
        if (!this.levelLeaderboards.length) {
          const levels = await fetchLevelLeaderboards();
          this.levelLeaderboards = levels;
          this.levelLeaderboardMap = new Map(levels.map((lvl) => [lvl.levelId, lvl.entries || []]));
        }
        const levelId = LEVELS_CONFIG[this.currentLevelIndex]?.id;
        const entries = levelId ? this.levelLeaderboardMap.get(levelId) || [] : [];
        this.statusText.setText("");
        this.renderLevelEntries(entries);
        return;
      }

      const entries = await fetchGlobalLeaderboard();
      this.statusText.setText("");
      this.renderGlobalEntries(entries);
    } catch (err) {
      this.statusText.setText("ERREUR DE SYNCHRONISATION");
    }
  }

  renderHeroEntries(entries) {
    if (!entries || entries.length === 0) {
      this.statusText.setText("AUCUN HÉROS RÉPERTORIÉ");
      return;
    }
    entries.slice(0, this.config.maxEntries).forEach((entry, idx) => {
      const y = idx * this.config.rowHeight;
      const isFirst = idx === 0;
      const color = isFirst ? "#ffd700" : "#ffffff";
      const row = this.scene.add.container(0, y);
      this.addRowBackground(row, idx);

      const rankTxt = this.createCellText("rank", (idx + 1).toString().padStart(2, "0"), color);
      const nameTxt = this.createCellText("player", (entry.username || "Inconnu").substring(0, 14), color);
      const hpTxt = this.createCellText("hp", `${entry.max_hp || 0}`, color);
      const dmgTxt = this.createCellText("dmg", `${Math.round(entry.base_damage || 0)}`, color);
      const speedTxt = this.createCellText("speed", `${entry.move_speed || 0}`, color);
      const scoreTxt = this.createCellText("score", `${Math.round(entry.hero_score || 0)}`, "#00eaff", true);

      row.add([rankTxt, nameTxt, hpTxt, dmgTxt, speedTxt, scoreTxt]);
      this.animateRow(row, idx);
      this.listContainer.add(row);
    });
  }

  renderLevelEntries(entries) {
    const levelLabel = LEVELS_CONFIG[this.currentLevelIndex]
      ? `Niveau ${LEVELS_CONFIG[this.currentLevelIndex].id}`
      : "Ce niveau";
    if (!entries || entries.length === 0) {
      this.statusText.setText(`AUCUN ENREGISTREMENT POUR ${levelLabel.toUpperCase()}`);
      return;
    }
    entries.slice(0, this.config.maxEntries).forEach((entry, idx) => {
      const y = idx * this.config.rowHeight;
      const isFirst = idx === 0;
      const color = isFirst ? "#ffd700" : "#ffffff";
      const row = this.scene.add.container(0, y);
      this.addRowBackground(row, idx);

      const rankTxt = this.createCellText("rank", (idx + 1).toString().padStart(2, "0"), color);
      const nameTxt = this.createCellText("player", (entry.username || "Inconnu").substring(0, 14), color);
      const heartsTxt = this.createCellText("hearts", `${entry.lives_lost ?? 0}`, color);
      const timeTxt = this.createCellText("time", this.formatTime(entry.completion_time_ms), "#00eaff", true);
      const dateTxt = this.createCellText("date", this.formatDate(entry.created_at), "#7dd0ff", true);

      row.add([rankTxt, nameTxt, heartsTxt, timeTxt, dateTxt]);
      this.animateRow(row, idx);
      this.listContainer.add(row);
    });
  }

  renderGlobalEntries(entries) {
    if (!entries || entries.length === 0) {
      this.statusText.setText("AUCUN SURVIVANT RÉPERTORIÉ");
      return;
    }

    entries.slice(0, this.config.maxEntries).forEach((entry, idx) => {
      const y = idx * this.config.rowHeight;
      const isFirst = idx === 0;
      const color = isFirst ? "#ffd700" : "#ffffff";
      const row = this.scene.add.container(0, y);
      this.addRowBackground(row, idx);

      const rankTxt = this.createCellText("rank", (idx + 1).toString().padStart(2, "0"), color);
      const nameTxt = this.createCellText("player", (entry.username || "Inconnu").substring(0, 12), color);
      const lvlTxt = this.createCellText("lvl", `${entry.max_level || 0}`, color);
      const heartsTxt = this.createHeartCell(entry.total_lives_lost || 0, color);
      const timeTxt = this.createCellText("time", this.formatTime(entry.total_time_ms), "#00eaff", true);

      row.add([rankTxt, nameTxt, lvlTxt, heartsTxt, timeTxt]);
      this.animateRow(row, idx);
      this.listContainer.add(row);
    });
  }

  addRowBackground(row, idx) {
    const rowBg = this.scene.add.graphics();
    rowBg.fillStyle(0xffffff, idx % 2 === 0 ? 0.03 : 0);
    rowBg.fillRect(10, -5, this.config.width - 20, 28);
    row.add(rowBg);
  }

  createCellText(key, value, color = "#ffffff", alignRight = false) {
    const col = this.activeColumns.find((c) => c.key === key) || { x: 0 };
    const txt = this.scene.add.text(col.x, 0, value, {
      fontSize: "13px",
      fontFamily: "Arial",
      color,
      fontWeight: key === "rank" ? "bold" : "normal",
    });
    if (alignRight || col.align === "right") {
      txt.setOrigin(1, 0);
    }
    return txt;
  }

  createHeartCell(heartsCount, color) {
    const col = this.activeColumns.find((c) => c.key === "hearts") || { x: 0 };
    const heartsContainer = this.scene.add.container(col.x, 0);
    const heartIcon = this.scene.add.text(0, -1, "❤️", { fontSize: "12px" });
    const heartValue = this.scene.add.text(18, 0, `${heartsCount}`, {
      fontSize: "12px",
      fontFamily: "Arial",
      color,
    });
    heartsContainer.add([heartIcon, heartValue]);
    return heartsContainer;
  }

  animateRow(row, idx) {
    row.alpha = 0;
    row.x = -15;
    this.scene.tweens.add({
      targets: row,
      alpha: 1,
      x: 0,
      duration: 300,
      delay: idx * 40,
    });
  }

  formatTime(ms) {
    if (!ms || ms <= 0) return "0:00";
    const sec = Math.floor(ms / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  formatDate(date) {
    if (!date) return "-";
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    return `${day}/${month}`;
  }
}
