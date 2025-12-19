import { CONFIG } from "../config/settings.js";
import { LEVELS_CONFIG } from "../config/levels/index.js";
import {
  ensureProfileLoaded,
  getHeroStats,
  getHeroPointsAvailable,
  getHeroPointConversion,
  getUnlockedLevel,
  isAuthenticated,
  logout,
  upgradeHero,
} from "../services/authManager.js";
import { showAuth } from "../services/authOverlay.js";
import { fetchLeaderboard } from "../services/leaderboardService.js";

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenuScene");
    this.levelReached = 1;
    this.leaderboardEntries = [];
  }

  create() {
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);

    const { width, height } = this.scale;
    const cx = width / 2;

    // --- 1. CONFIGURATION DES ESPACEMENTS (Ajustable ici) ---
    const TITLE_Y = 100; // Position du titre
    const LIST_START_Y = 240; // Où commence la liste (bien plus bas pour éviter le titre)
    const LIST_BOTTOM_Y = height - 120; // Où s'arrête la liste avant le bouton reset
    const VIEW_HEIGHT = LIST_BOTTOM_Y - LIST_START_Y;

    // --- 2. FOND ---
    this.cameras.main.setBackgroundColor("#05050a");
    if (this.textures.exists("background_main")) {
      const bg = this.add.image(cx, height / 2, "background_main");
      const scale = Math.max(width / bg.width, height / bg.height);
      bg.setScale(scale).setAlpha(0.2).setScrollFactor(0);
    }

    // --- 3. TITRE FIXE (Anglais - LAST OUTPOST) ---
    const title = this.add
      .text(cx, TITLE_Y, "LAST OUTPOST", {
        fontFamily: "Impact, sans-serif",
        fontSize: `${Math.max(45, width * 0.08)}px`,
        color: "#ffffff",
        letterSpacing: 8,
      })
      .setOrigin(0.5)
      .setDepth(100);
    title.setShadow(0, 5, "#00f2ff", 15, true, true);

    // --- 4. LEADERBOARD (haut droite) ---
    this.createLeaderboard(width, TITLE_Y + 20);

    // --- 5. GESTION DE LA LISTE SCROLLABLE ---
    // On crée un conteneur pour les niveaux
    this.levelContainer = this.add.container(cx, LIST_START_Y);

    this.levelReached = getUnlockedLevel();
    let currentY = 50; // On commence à 50 pour que le 1er bouton ne soit pas collé au bord du masque
    const spacing = 120;

    LEVELS_CONFIG.forEach((level) => {
      const isLocked = level.id > this.levelReached;
      const card = this.createLevelCard(0, currentY, level, isLocked);
      this.levelContainer.add(card);
      currentY += spacing;
    });

    const totalContentHeight = currentY;

    // --- 6. CRÉATION DU MASQUE ---
    // Le masque définit la zone "fenêtre" où les boutons sont visibles
    const maskShape = this.make.graphics();
    maskShape.fillStyle(0xffffff);
    // On dessine le rectangle de visibilité
    maskShape.fillRect(0, LIST_START_Y, width, VIEW_HEIGHT);
    const mask = maskShape.createGeometryMask();
    this.levelContainer.setMask(mask);

    // --- 7. LOGIQUE DE SCROLL (LIMITES STRICTES) ---
    const limitTop = LIST_START_Y;
    const limitBottom =
      totalContentHeight > VIEW_HEIGHT
        ? LIST_START_Y - (totalContentHeight - VIEW_HEIGHT)
        : LIST_START_Y;

    // Interaction Molette
    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
      this.levelContainer.y -= deltaY;
      this.clampScroll(limitTop, limitBottom);
    });

    // Interaction Drag (Tactile/Souris)
    let dragY = 0;
    this.input.on("pointerdown", (p) => {
      dragY = this.levelContainer.y - p.y;
    });
    this.input.on("pointermove", (p) => {
      if (p.isDown) {
        this.levelContainer.y = p.y + dragY;
        this.clampScroll(limitTop, limitBottom);
      }
    });

    // --- 8. BOUTON DECONNEXION (Bas de page) ---
    this.createLogoutButton(height - 50);

    // --- 9. PANEL AMELIORATION HERO ---
    this.createHeroUpgradePanel();

    this.profileUpdatedHandler = () => {
      this.levelReached = getUnlockedLevel();
      this.refreshLevelLocks();
      this.populateHeroPanel();
    };
    window.addEventListener("auth:profile-updated", this.profileUpdatedHandler);

    ensureProfileLoaded().then(() => {
      const updatedLevel = getUnlockedLevel();
      if (updatedLevel !== this.levelReached) {
        this.levelReached = updatedLevel;
        this.refreshLevelLocks();
      }
      this.loadLeaderboard();
      this.populateHeroPanel();
    });
  }

  clampScroll(top, bottom) {
    if (this.levelContainer.y > top) this.levelContainer.y = top;
    if (this.levelContainer.y < bottom) this.levelContainer.y = bottom;
  }

  createLevelCard(x, y, level, isLocked) {
    const cardWidth = Math.min(this.scale.width * 0.85, 500);
    const cardHeight = 100;
    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    const draw = (over = false) => {
      bg.clear();
      bg.fillStyle(isLocked ? 0x1a1a1a : over ? 0x004488 : 0x002244, 0.8);
      bg.lineStyle(2, isLocked ? 0x333333 : over ? 0x00f2ff : 0x0088ff, 1);
      bg.fillRoundedRect(
        -cardWidth / 2,
        -cardHeight / 2,
        cardWidth,
        cardHeight,
        8
      );
      bg.strokeRoundedRect(
        -cardWidth / 2,
        -cardHeight / 2,
        cardWidth,
        cardHeight,
        8
      );
    };
    draw();

    const title = this.add.text(
      -cardWidth / 2 + 20,
      -20,
      `NIVEAU ${level.id}`,
      {
        fontSize: "18px",
        fontWeight: "bold",
        color: isLocked ? "#666" : "#00ccff",
        fontFamily: "Arial",
      }
    );

    const name = this.add.text(
      -cardWidth / 2 + 20,
      5,
      level.name.toUpperCase(),
      {
        fontSize: "22px",
        fontWeight: "900",
        color: isLocked ? "#444" : "#fff",
        fontFamily: "Arial",
      }
    );

    container.add([bg, title, name]);

    if (!isLocked) {
      const zone = this.add
        .zone(0, 0, cardWidth, cardHeight)
        .setInteractive({ useHandCursor: true });
      container.add(zone);
      zone.on("pointerover", () => {
        draw(true);
        container.setScale(1.02);
      });
      zone.on("pointerout", () => {
        draw(false);
        container.setScale(1);
      });
      zone.on("pointerdown", () => {
        if (!isAuthenticated()) {
          showAuth();
          return;
        }
        this.scene.start("GameScene", {
          level: level.id,
          heroStats: getHeroStats(),
        });
      });
    }

    return container;
  }

  createLogoutButton(y) {
    const btn = this.add
      .text(this.scale.width / 2, y, "Se déconnecter", {
        fontSize: "14px",
        color: "#cccccc",
        fontFamily: "Arial",
        textDecoration: "underline",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(100);

    btn.on("pointerover", () => btn.setColor("#ff0000"));
    btn.on("pointerout", () => btn.setColor("#cccccc"));
    btn.on("pointerdown", () => {
      logout();
      this.levelReached = 1;
      this.refreshLevelLocks();
      showAuth();
    });
  }

  refreshLevelLocks() {
    this.scene.restart();
  }

  shutdown() {
    if (this.profileUpdatedHandler) {
      window.removeEventListener("auth:profile-updated", this.profileUpdatedHandler);
      this.profileUpdatedHandler = null;
    }
  }

  async loadLeaderboard() {
    try {
      const entries = await fetchLeaderboard();
      this.leaderboardEntries = entries;
      this.renderLeaderboard();
    } catch (err) {
      console.error("Erreur leaderboard", err);
    }
  }

  createLeaderboard(width, y) {
    const container = this.add.container(width - 180, y);
    container.setDepth(200);
    this.leaderboardContainer = container;

    const bg = this.add.graphics();
    bg.fillStyle(0x0a1a2a, 0.7);
    bg.lineStyle(2, 0x00bfff, 0.8);
    bg.fillRoundedRect(-160, 0, 320, 260, 12);
    bg.strokeRoundedRect(-160, 0, 320, 260, 12);
    container.add(bg);

    const title = this.add.text(0, 14, "LEADERBOARD", {
      fontSize: "20px",
      fontFamily: "Impact, sans-serif",
      color: "#00eaff",
      align: "center",
    })
      .setOrigin(0.5, 0)
      .setShadow(0, 3, "#000", 8);
    container.add(title);

    const headers = this.add.text(-150, 50, "Lv  | Joueur", {
      fontSize: "12px",
      color: "#7dd0ff",
      fontFamily: "Arial",
    });
    container.add(headers);

    this.leaderboardText = this.add.text(-150, 70, "Chargement...", {
      fontSize: "12px",
      color: "#ffffff",
      fontFamily: "Courier New, monospace",
      lineSpacing: 4,
    });
    container.add(this.leaderboardText);

    const refresh = this.add.text(140, 16, "↻", {
      fontSize: "18px",
      fontFamily: "Arial",
      color: "#00eaff",
    })
      .setOrigin(0.5, 0)
      .setInteractive({ useHandCursor: true });
    refresh.on("pointerdown", () => this.loadLeaderboard());
    refresh.on("pointerover", () => refresh.setColor("#ffffff"));
    refresh.on("pointerout", () => refresh.setColor("#00eaff"));
    container.add(refresh);
  }

  renderLeaderboard() {
    if (!this.leaderboardText) return;
    if (!this.leaderboardEntries || this.leaderboardEntries.length === 0) {
      this.leaderboardText.setText("Aucune donnée");
      return;
    }

    const lines = this.leaderboardEntries.map((entry, idx) => {
      const rank = idx + 1;
      const name = entry.username?.slice(0, 12) || "-";
      const level = entry.max_level || 1;
      const lives = entry.lives_remaining ?? "-";
      const time = entry.completion_time_ms
        ? `${Math.round(entry.completion_time_ms / 1000)}s`
        : "-";
      return `${rank.toString().padStart(2, " ")}. Lv${level} | ${name.padEnd(12, " ")}  ♥${lives}  ⏱ ${time}`;
    });

    this.leaderboardText.setText(lines.join("\n"));
  }

  createHeroUpgradePanel() {
    const { width, height } = this.scale;
    const panelWidth = 320;
    const panel = this.add.container(width - panelWidth - 30, height * 0.45);
    panel.setDepth(180);
    this.heroPanel = panel;

    const bg = this.add.graphics();
    bg.fillStyle(0x101820, 0.82);
    bg.lineStyle(2, 0x00bfff, 0.8);
    bg.fillRoundedRect(0, 0, panelWidth, 260, 12);
    bg.strokeRoundedRect(0, 0, panelWidth, 260, 12);
    panel.add(bg);

    const title = this.add.text(panelWidth / 2, 12, "HÉROS", {
      fontFamily: "Impact, sans-serif",
      fontSize: "20px",
      color: "#00eaff",
    })
      .setOrigin(0.5, 0)
      .setShadow(0, 3, "#000", 8);
    panel.add(title);

    // Avatar stylisé
    const avatar = this.add.graphics();
    avatar.fillStyle(0x27384a, 1);
    avatar.fillRoundedRect(14, 44, 90, 90, 10);
    avatar.lineStyle(2, 0x00eaff, 0.8);
    avatar.strokeRoundedRect(14, 44, 90, 90, 10);
    avatar.fillStyle(0xcfd8dc, 1);
    avatar.fillCircle(59, 80, 16);
    avatar.fillStyle(0x90a4ae, 1);
    avatar.fillRect(45, 98, 28, 28);
    panel.add(avatar);

    const statStartX = 120;
    const statStartY = 48;
    const statSpacing = 48;

    this.heroStatLabels = {};
    const stats = [
      { key: "hp", label: "PV", color: 0x4caf50 },
      { key: "damage", label: "Dégâts", color: 0xf57c00 },
      { key: "move_speed", label: "Vitesse", color: 0x29b6f6 },
    ];

    stats.forEach((stat, idx) => {
      const y = statStartY + idx * statSpacing;

      const label = this.add.text(statStartX, y, `${stat.label}: 0`, {
        fontSize: "14px",
        fontFamily: "Arial",
        color: "#ffffff",
      });
      panel.add(label);
      this.heroStatLabels[stat.key] = label;

      const barBg = this.add.graphics();
      barBg.fillStyle(0x0d1b28, 0.9);
      barBg.fillRoundedRect(statStartX, y + 18, 170, 12, 6);
      panel.add(barBg);

      const bar = this.add.graphics();
      bar.fillStyle(stat.color, 1);
      bar.fillRoundedRect(statStartX + 1, y + 19, 80, 10, 5);
      panel.add(bar);
      this.heroStatLabels[`${stat.key}Bar`] = bar;

      const btn = this.add.text(panelWidth - 24, y + 6, "+", {
        fontSize: "22px",
        fontFamily: "Arial",
        color: "#00eaff",
      })
        .setOrigin(0.5, 0)
        .setInteractive({ useHandCursor: true });
      btn.on("pointerdown", () => this.handleUpgrade(stat.key));
      btn.on("pointerover", () => btn.setColor("#ffffff"));
      btn.on("pointerout", () => btn.setColor("#00eaff"));
      panel.add(btn);
    });

    this.pointsText = this.add.text(panelWidth / 2, 210, "Points: 0", {
      fontSize: "14px",
      fontFamily: "Arial",
      color: "#7dd0ff",
    }).setOrigin(0.5);
    panel.add(this.pointsText);

    this.costText = this.add.text(panelWidth / 2, 232, "Coût: 1 pt", {
      fontSize: "12px",
      fontFamily: "Arial",
      color: "#cccccc",
    }).setOrigin(0.5);
    panel.add(this.costText);
  }

  populateHeroPanel() {
    if (!this.heroPanel) return;
    const stats = getHeroStats();
    const available = getHeroPointsAvailable();
    const conversion = getHeroPointConversion();

    if (!stats) {
      this.pointsText?.setText("Connectez-vous pour améliorer votre héros");
      return;
    }

    const statDefs = {
      hp: stats.max_hp,
      damage: stats.base_damage,
      move_speed: stats.move_speed,
    };

    Object.entries(statDefs).forEach(([key, value]) => {
      const label = this.heroStatLabels?.[key];
      const bar = this.heroStatLabels?.[`${key}Bar`];
      if (label) label.setText(`${key === "hp" ? "PV" : key === "damage" ? "Dégâts" : "Vitesse"}: ${value}`);
      if (bar) {
        const pct = Phaser.Math.Clamp(value / 400, 0.1, 1);
        bar.scaleX = pct;
      }
    });

    const hpCost = conversion?.hp_per_point || 1;
    const dmgCost = conversion?.damage_per_point || 1;
    const speedCost = conversion?.move_speed_per_point || 1;

    this.pointsText?.setText(`Points dispo: ${available}`);
    this.costText?.setText(
      `+PV (${hpCost}), +Dégâts (${dmgCost}), +Vitesse (${speedCost}) par point`
    );
  }

  async handleUpgrade(statKey) {
    if (!isAuthenticated()) {
      showAuth();
      return;
    }

    try {
      await upgradeHero(statKey, 1);
      this.populateHeroPanel();
    } catch (err) {
      console.error("Upgrade héros", err);
    }
  }

  createAtmosphere() {
    // Particules simples pour le style
    if (!this.textures.exists("p")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffffff).fillCircle(2, 2, 2).generateTexture("p", 4, 4);
    }
    this.add.particles(0, 0, "p", {
      x: { min: 0, max: this.scale.width },
      y: { min: 0, max: this.scale.height },
      alpha: { start: 0.2, end: 0 },
      scale: { start: 0.5, end: 0 },
      speedY: { min: -10, max: -2 },
      lifespan: 3000,
    });
  }
}
