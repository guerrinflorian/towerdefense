import {
  fetchGlobalLeaderboard,
  fetchHeroLeaderboard,
  fetchLevelLeaderboards,
} from "../../services/leaderboardService.js";
import { isAuthenticated } from "../../services/authManager.js";
import {
  buildChapterViewModels,
  fetchChaptersWithLevels,
} from "../../services/chapterService.js";

/**
 * UI du Classement - Style Cyberpunk / Sci-Fi
 * Entièrement localisé en Français
 */
export class LeaderboardUI extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this._loadToken = 0;
    this._destroyed = false;

    // --- CONFIGURATION STYLE ---
    this.uiConfig = {
      width: 560,
      height: 500,
      colors: {
        bg: 0x0d1b2a,
        accent: 0x00eaff,
        textBlue: 0x7dd0ff,
        gold: 0xffd700,
        white: 0xffffff,
      },
      rowHeight: 34,
      maxEntries: 8,
    };

    // --- ÉTAT ---
    this.viewModes = ["hero", "global", "level"];
    this.currentModeIndex = 1;
    this.currentLevelIndex = 0;
    this.levelLeaderboards = [];
    this.levelLeaderboardMap = new Map();
    this.levelMetas = [];

    this.setupLayout();
    this.updateModeUI();
    this.loadData();

    this.scene.add.existing(this);
    this.setDepth(200);
  }

  destroy(fromScene) {
    this._destroyed = true;
    this._loadToken++; // invalide toute requête en cours
    super.destroy(fromScene);
  }

  get currentMode() {
    return this.viewModes[this.currentModeIndex];
  }

  setupLayout() {
    const { width, height, colors } = this.uiConfig;

    // 1. FOND PRINCIPAL
    const bg = this.scene.add.graphics();
    // Ombre
    bg.fillStyle(0x000000, 0.4).fillRoundedRect(10, 10, width, height, 15);
    // Fond
    bg.fillStyle(colors.bg, 0.95).lineStyle(2, colors.accent, 1);
    bg.fillRoundedRect(0, 0, width, height, 15).strokeRoundedRect(
      0,
      0,
      width,
      height,
      15
    );
    // Ligne de séparation titre
    bg.lineStyle(1, colors.accent, 0.4).lineBetween(15, 55, width - 15, 55);
    this.add(bg);

    // 2. NAVIGATION DES MODES (Haut)
    const resolution = window.devicePixelRatio || 1;
    const navStyle = {
      fontSize: "22px",
      fontFamily: "Impact, sans-serif",
      color: "#7dd0ff",
      resolution,
    };

    this.btnPrevMode = this.scene.add
      .text(20, 28, "◀", navStyle)
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true });
    this.btnNextMode = this.scene.add
      .text(width - 70, 28, "▶", navStyle)
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true });

    this.title = this.scene.add
      .text(width / 2, 28, "", {
        fontSize: "22px",
        fontFamily: "Impact, sans-serif",
        color: "#ffffff",
        letterSpacing: 1,
        resolution,
      })
      .setOrigin(0.5)
      .setShadow(0, 0, "#00eaff", 10);

    this.refreshBtn = this.scene.add
      .text(width - 30, 28, "↻", {
        fontSize: "26px",
        color: "#00eaff",
        fontStyle: "bold",
        resolution,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.add([this.btnPrevMode, this.btnNextMode, this.title, this.refreshBtn]);

    // 3. BARRE DE SELECTION DES NIVEAUX (Plus espacée et structurée)
    // On crée un conteneur dédié pour la navigation de niveau
    this.levelNavContainer = this.scene.add.container(0, 75);

    const levelBg = this.scene.add.graphics();
    levelBg
      .fillStyle(0xffffff, 0.05)
      .fillRoundedRect(20, 0, width - 40, 40, 10);
    this.levelNavContainer.add(levelBg);

    const levelNavStyle = {
      fontSize: "14px",
      color: "#9ae8ff",
      fontFamily: "Orbitron",
      fontWeight: "bold",
      resolution,
    };

    this.btnPrevLvl = this.scene.add
      .text(45, 20, "⟸ NIVEAU PRÉCÉDENT", {
        ...levelNavStyle,
        fontSize: "11px",
      })
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true });

    this.levelNavLabel = this.scene.add
      .text(width / 2, 20, "", levelNavStyle)
      .setOrigin(0.5)
      .setShadow(0, 0, "#00eaff", 5);

    this.btnNextLvl = this.scene.add
      .text(width - 45, 20, "NIVEAU SUIVANT ⟹", {
        ...levelNavStyle,
        fontSize: "11px",
      })
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true });

    this.levelNavContainer.add([
      this.btnPrevLvl,
      this.levelNavLabel,
      this.btnNextLvl,
    ]);
    this.add(this.levelNavContainer);

    // 4. ZONE DE DONNÉES
    this.headerContainer = this.scene.add.container(0, 130);
    this.listContainer = this.scene.add.container(0, 155);
    this.statusText = this.scene.add
      .text(width / 2, height / 2 + 50, "", {
        fontSize: "14px",
        color: "#ffffff",
        fontFamily: "Courier New",
        resolution,
      })
      .setOrigin(0.5);

    this.add([this.headerContainer, this.listContainer, this.statusText]);

    // --- ÉVÉNEMENTS ---
    this.btnPrevMode.on("pointerdown", () => this.switchMode(-1));
    this.btnNextMode.on("pointerdown", () => this.switchMode(1));
    this.btnPrevLvl.on("pointerdown", () => this.changeLevel(-1));
    this.btnNextLvl.on("pointerdown", () => this.changeLevel(1));
    this.refreshBtn.on("pointerdown", () => this.handleRefresh());
  }

  // --- LOGIQUE DE NAVIGATION ---

  switchMode(delta) {
    const total = this.viewModes.length;
    this.currentModeIndex = (this.currentModeIndex + delta + total) % total;
    if (this.currentMode === "level") this.currentLevelIndex = 0;
    this.updateModeUI();
    this.loadData();
  }

  async changeLevel(delta) {
    await this.ensureLevelMetadata();
    const totalLevels = this.levelMetas.length;
    if (totalLevels === 0) return;
    this.currentLevelIndex =
      (this.currentLevelIndex + delta + totalLevels) % totalLevels;
    this.updateModeUI();
    this.loadData();
  }

  updateModeUI() {
    this.title.setText(this.getTitleText());

    // Afficher/Cacher la barre de sélection de niveau
    const isLevelMode = this.currentMode === "level";
    this.levelNavContainer.setVisible(isLevelMode);

    // Ajuster la position du tableau si on est en mode niveau ou non
    this.headerContainer.setY(isLevelMode ? 130 : 80);
    this.listContainer.setY(isLevelMode ? 155 : 105);

    if (isLevelMode) {
      if (this.levelMetas.length === 0) {
        this.ensureLevelMetadata().then(() => this.updateModeUI());
      }
      const lvl = this.levelMetas[this.currentLevelIndex];
      this.levelNavLabel.setText(
        lvl ? `${lvl.id} • ${lvl.name.toUpperCase()}` : "NIVEAU INCONNU"
      );
    }

    this.drawHeaders();
  }

  getTitleText() {
    switch (this.currentMode) {
      case "hero":
        return "🦸 CLASSEMENT DES HÉROS";
      case "level":
        return "🗺️ RECORDS PAR MISSION";
      default:
        return "📊 CLASSEMENT GÉNÉRAL";
    }
  }

  // --- RENDU DU TABLEAU ---

  getColumns() {
    const { width } = this.uiConfig;
    if (this.currentMode === "hero") {
      return [
        { key: "rank", label: "RG", x: 20 },
        { key: "player", label: "JOUEUR", x: 70 },
        { key: "hp", label: "PV", x: 210 },
        { key: "dmg", label: "DÉGÂTS", x: 290 },
        { key: "speed", label: "VIT.", x: 380 },
        { key: "score", label: "TOTAL", x: width - 20, align: "right" },
      ];
    }
    if (this.currentMode === "level") {
      return [
        { key: "rank", label: "RG", x: 20 },
        { key: "player", label: "PILOTE", x: 120 },
        { key: "hearts", label: "VIES PERDUES", x: 280 },
        { key: "time", label: "TEMPS", x: width - 110, align: "right" },
        { key: "date", label: "DATE", x: width - 20, align: "right" },
      ];
    }
    return [
      { key: "rank", label: "RG", x: 20 },
      { key: "player", label: "JOUEUR", x: 75 },
      { key: "lvl", label: "NIV. MAX", x: 200 },
      { key: "hearts", label: "COEURS PERDUS", x: 320 },
      { key: "time", label: "TEMPS TOTAL", x: width - 20, align: "right" },
    ];
  }

  drawHeaders() {
    const resolution = window.devicePixelRatio || 1;
    const hStyle = {
      fontSize: "11px",
      color: "#7dd0ff",
      fontWeight: "bold",
      fontFamily: "Orbitron",
      resolution,
    };
    this.headerContainer.removeAll(true);
    this.activeColumns = this.getColumns();
    this.activeColumns.forEach((col) => {
      const txt = this.scene.add.text(col.x, 0, col.label, hStyle);
      if (col.align === "right") txt.setOrigin(1, 0);
      this.headerContainer.add(txt);
    });
  }

  // --- CHARGEMENT DES DONNÉES ---

  async ensureLevelMetadata() {
    if (this.levelMetas.length > 0) return;
    try {
      const chapters = await fetchChaptersWithLevels();
      const chapterVMs = buildChapterViewModels(chapters, new Map());
      const levels = chapterVMs.flatMap((chapter) =>
        (chapter.levels || []).map((lvl) => ({
          ...lvl,
          chapterId: chapter.id,
          chapterName: chapter.name,
        }))
      );
      levels.sort((a, b) => a.orderIndex - b.orderIndex || a.id - b.id);
      this.levelMetas = levels;
    } catch (error) {
      console.warn("Impossible de charger la liste des niveaux", error);
      this.levelMetas = [];
    }
  }

  async loadData() {
    const token = ++this._loadToken;
    console.log("[LB] loadData start", {
      token,
      mode: this.currentMode,
    });

    const stillAlive = () => {
      const alive =
        !this._destroyed &&
        this.active &&
        this.scene &&
        this.scene.sys &&
        !(
          typeof this.scene.sys.settings?.status === "number" &&
          this.scene.sys.settings.status >= 5
        );

      return alive;
    };

    const safeSetText = (txtObj, value) => {
      if (!stillAlive() || !txtObj || !txtObj.active) return;
      txtObj.setText(String(value ?? ""));
    };

    try {
      if (!stillAlive()) {
        console.log("[LB] stop: not alive");
        return;
      }

      if (this.listContainer) this.listContainer.removeAll(true);

      console.log("[LB] authenticated ?", isAuthenticated());
      if (!isAuthenticated()) {
        safeSetText(this.statusText, "CONNEXION REQUISE");
        console.log("[LB] stop: not authenticated");
        return;
      }

      safeSetText(this.statusText, "SYNCHRONISATION...");
      console.log("[LB] fetching data...");

      let entries = [];

      if (this.currentMode === "hero") {
        console.log("[LB] fetchHeroLeaderboard");
        entries = await fetchHeroLeaderboard();
      } else if (this.currentMode === "level") {
        console.log("[LB] fetch level leaderboard");

        await this.ensureLevelMetadata();
        if (!stillAlive() || token !== this._loadToken) {
          console.log("[LB] stop after metadata");
          return;
        }

        if (this.levelLeaderboards.length === 0) {
          const levels = await fetchLevelLeaderboards();
          if (!stillAlive() || token !== this._loadToken) {
            console.log("[LB] stop after fetchLevelLeaderboards");
            return;
          }

          this.levelLeaderboards = levels;
          this.levelLeaderboardMap = new Map(
            levels.map((l) => [l.levelId, l.entries || []])
          );
        }

        const levelId = this.levelMetas[this.currentLevelIndex]?.id;
        entries = levelId ? this.levelLeaderboardMap.get(levelId) || [] : [];
      } else {
        console.log("[LB] fetchGlobalLeaderboard");
        entries = await fetchGlobalLeaderboard();
      }

      if (!stillAlive() || token !== this._loadToken) {
        console.log("[LB] stop: token changed or destroyed");
        return;
      }

      console.log("[LB] fetch OK, entries:", entries.length);

      safeSetText(this.statusText, entries.length === 0 ? "AUCUNE DONNÉE" : "");
      this.renderEntries(entries);
    } catch (err) {
      console.error("[LB] fetch error", err);
      if (!stillAlive() || token !== this._loadToken) return;
      if (this.statusText) this.statusText.setText("ERREUR DE CONNEXION");
    }
  }

  renderEntries(entries) {
    entries.slice(0, this.uiConfig.maxEntries).forEach((entry, idx) => {
      const y = idx * this.uiConfig.rowHeight;
      const isTop1 = idx === 0;
      const color = isTop1 ? "#ffd700" : "#ffffff";
      const row = this.scene.add.container(0, y);

      // Fond de ligne alterné
      const rowBg = this.scene.add.graphics();
      rowBg.fillStyle(0xffffff, idx % 2 === 0 ? 0.04 : 0);
      rowBg.fillRect(10, -5, this.uiConfig.width - 20, 30);
      row.add(rowBg);

      // Création des cellules dynamiques
      this.activeColumns.forEach((col) => {
        let value = "";
        switch (col.key) {
          case "rank":
            value = (idx + 1).toString().padStart(2, "0");
            break;
          case "player":
            value = (entry.username || "Anonyme").substring(0, 14);
            break;
          case "time":
            value = this.formatTime(
              entry.completion_time_ms || entry.total_time_ms
            );
            break;
          case "date":
            value = this.formatDate(entry.created_at);
            break;
          case "score":
            value = Math.round(entry.hero_score || 0).toLocaleString();
            break;
          case "hearts":
            value = entry.lives_lost ?? entry.total_lives_lost ?? 0;
            break;
          case "hp":
            value = entry.max_hp || 0;
            break;
          case "dmg":
            value = parseFloat(entry.base_damage || 0).toFixed(2);
            break;
          case "speed":
            value = parseFloat(entry.move_speed || 0).toFixed(2);
            break;
          case "lvl":
            value = entry.max_level || 0;
            break;
        }

        const cell = this.scene.add.text(col.x, 0, value, {
          fontSize: "13px",
          fontFamily: "Arial",
          color: col.key === "time" || col.key === "score" ? "#00eaff" : color,
          fontWeight: isTop1 || col.key === "rank" ? "bold" : "normal",
          resolution: window.devicePixelRatio || 1,
        });

        if (col.align === "right") cell.setOrigin(1, 0);
        row.add(cell);
      });

      this.animateRow(row, idx);
      this.listContainer.add(row);
    });
  }

  // --- UTILITAIRES ---

  handleRefresh() {
    this.levelLeaderboards = [];
    this.levelLeaderboardMap.clear();
    this.levelMetas = [];
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

  animateRow(row, idx) {
    row.alpha = 0;
    row.x = -10;
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
    return `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`;
  }

  formatDate(date) {
    if (!date) return "--/--";
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
  }
}
