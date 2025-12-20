import { LEVELS_CONFIG } from "../config/levels/index.js";
import { getUnlockedLevel, isAuthenticated, getHeroStats } from "../services/authManager.js";
import { showAuth } from "../services/authOverlay.js";
import { fetchPlayerBestRuns } from "../services/leaderboardService.js";

export class MapScene extends Phaser.Scene {
  constructor() {
    super("MapScene");
    this.levelIslands = new Map();
    this.bestRunsByLevel = new Map();
    this.biomes = {
      grass:  { top: 0x55aa44, side: 0x3d2b1f, light: 0x77cc66, prop: 0x225522, glow: 0x00ff00 },
      lava:   { top: 0x333333, side: 0x221100, light: 0xff4400, prop: 0xff0000, glow: 0xff4400 },
      ice:    { top: 0xeeddfb, side: 0x4466aa, light: 0xffffff, prop: 0xaaddff, glow: 0x00ffff },
      sand:   { top: 0xedc9af, side: 0x8b5a2b, light: 0xffe4b5, prop: 0xd2b48c, glow: 0xffcc00 },
      cyber:  { top: 0x1a1a2e, side: 0x0f0f1b, light: 0x00f2ff, prop: 0x0055ff, glow: 0x00f2ff }
    };
  }

  preload() {
    const backgroundMapUrl = new URL("../images/background_map.jpg", import.meta.url).href;
    this.load.image("background_map", backgroundMapUrl);
  }

  create() {
    const { width, height } = this.scale;
    const cx = width / 2;
    
    this.levelIslands = new Map();
    this.bestRunsByLevel = new Map();
    
    // Ajouter le fond avec l'image
    this.addBackground(cx, height);

    this.mapContainer = this.add.container(0, 0);
    this.draw3DMap(cx, height);
    this.loadBestRuns();

    // Titre
    this.add.text(width/2, 50, "CARTOGRAPHIE DES SECTEURS", {
      fontFamily: "Impact", fontSize: "42px", color: "#fff"
    }).setOrigin(0.5).setShadow(0, 0, "#00f2ff", 20, true, true);

    const back = this.add.text(width/2, height - 40, "↩ RETOUR AU QG", {
      fontFamily: "Orbitron", fontSize: "18px", color: "#00f2ff"
    }).setOrigin(0.5).setInteractive({useHandCursor: true});
    back.on("pointerdown", () => this.scene.start("MainMenuScene"));
  }

  addBackground(cx, height) {
    this.cameras.main.setBackgroundColor("#020508");
    if (this.textures.exists("background_map")) {
      const bg = this.add.image(cx, height / 2, "background_map")
        .setDepth(-1)
        .setScrollFactor(0)
        .setTint(0x444444);
      const scale = Math.max(this.scale.width / bg.width, this.scale.height / bg.height);
      bg.setScale(scale);
    }
  }

  draw3DMap(cx, height) {
    const unlocked = getUnlockedLevel();
    const points = [
      { x: cx - 220, y: height * 0.75, b: 'grass' },
      { x: cx + 180, y: height * 0.60, b: 'sand' },
      { x: cx - 150, y: height * 0.42, b: 'ice' },
      { x: cx + 220, y: height * 0.28, b: 'lava' },
      { x: cx,       y: height * 0.12, b: 'cyber' }
    ];

    const pathGfx = this.add.graphics();
    this.mapContainer.add(pathGfx);

    for(let i = 0; i < LEVELS_CONFIG.length; i++) {
        const p = points[i % points.length];
        const isLocked = (i + 1) > unlocked;

        if (i < LEVELS_CONFIG.length - 1) {
            this.drawBridge(pathGfx, p, points[(i+1) % points.length], isLocked);
        }

        const island = this.create3DIsland(p.x, p.y, i + 1, p.b, isLocked);
        this.mapContainer.add(island);
    }
  }

  create3DIsland(x, y, id, biomeType, isLocked) {
    const container = this.add.container(x, y);
    const biome = this.biomes[biomeType];
    const levelData = LEVELS_CONFIG[id - 1];
    const s = 1.2;

    // 1. OMBRE PORTÉE
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.5).fillEllipse(0, 60, 100 * s, 50 * s);

    // 2. SOCLE (FALAISE 3D)
    const cliff = this.add.graphics();
    const cliffColor = isLocked ? 0x1a1a1a : biome.side;
    cliff.fillStyle(cliffColor);
    cliff.beginPath();
    cliff.moveTo(-60 * s, 0); cliff.lineTo(-40 * s, 50 * s); 
    cliff.lineTo(40 * s, 50 * s); cliff.lineTo(60 * s, 0);
    cliff.closePath(); cliff.fillPath();

    // 3. SURFACE
    const surface = this.add.graphics();
    const topColor = isLocked ? 0x2d2d2d : biome.top;
    surface.fillGradientStyle(isLocked ? 0x333333 : biome.light, isLocked ? 0x333333 : biome.light, topColor, topColor, 1);
    
    const p = [-60, -10, -40, -30, 0, -35, 40, -30, 60, -10, 50, 20, 0, 30, -50, 25];
    surface.beginPath();
    surface.moveTo(p[0] * s, p[1] * s);
    for(let i=2; i<p.length; i+=2) surface.lineTo(p[i] * s, p[i+1] * s);
    surface.closePath(); surface.fillPath();
    surface.lineStyle(2, 0xffffff, isLocked ? 0.05 : 0.4); surface.strokePath();

    // 4. ÉTIQUETTE DE NOM (HOLOGRAPHIQUE)
    const labelBox = this.add.graphics();
    labelBox.fillStyle(0x000000, 0.8);
    labelBox.lineStyle(1, isLocked ? 0x333333 : biome.light, 1);
    labelBox.fillRoundedRect(-75, 65, 150, 26, 6);
    labelBox.strokeRoundedRect(-75, 65, 150, 26, 6);

    // 5. ÉLÉMENTS TEXTUELS
    const txtId = this.add.text(0, -12, id, { 
        fontSize: "44px", fontFamily: "Impact", color: isLocked ? "#444" : "#fff" 
    }).setOrigin(0.5);
    
    const txtName = this.add.text(0, 78, levelData.name.toUpperCase(), { 
        fontSize: "11px", fontFamily: "Orbitron", color: isLocked ? "#555" : "#fff", fontWeight: "bold"
    }).setOrigin(0.5);

    container.add([shadow, cliff, surface, labelBox, txtId, txtName]);
    const statsStyle = { fontSize: "12px", fontFamily: "Orbitron", color: "#bdf1ff" };
    const bestTime = this.add.text(0, -78, "", statsStyle).setOrigin(0.5);
    const bestHearts = this.add.text(0, -62, "", { ...statsStyle, color: "#ffb3b3" }).setOrigin(0.5);
    const statsContainer = this.add.container(0, 0, [bestTime, bestHearts]);
    statsContainer.setVisible(false);
    container.add(statsContainer);
    this.levelIslands.set(id, { container, statsContainer, bestTime, bestHearts, isLocked });

    // 6. LE CADENA (Si verrouillé)
    if (isLocked) {
        const lock = this.add.text(0, 0, "🔒", { fontSize: "40px" })
            .setOrigin(0.5)
            .setAlpha(0.6);
        container.add(lock);
        container.setAlpha(0.8); // Rend toute l'île légèrement transparente
    }

    // ANIMATION DE FLOTTAISON
    this.tweens.add({
      targets: container,
      y: y - 15,
      duration: 2500 + (id * 200),
      yoyo: true, repeat: -1, ease: "Sine.easeInOut"
    });

    // INTERACTIONS (Seulement si débloqué)
    if (!isLocked) {
      container.setInteractive(new Phaser.Geom.Circle(0, 0, 70), Phaser.Geom.Circle.Contains);
      container.on("pointerover", () => {
          this.tweens.add({ targets: container, scale: 1.1, duration: 150 });
          labelBox.lineStyle(2, 0xffffff, 1).strokeRoundedRect(-75, 65, 150, 26, 6);
      });
      container.on("pointerout", () => {
          this.tweens.add({ targets: container, scale: 1, duration: 150 });
          labelBox.clear().fillStyle(0x000000, 0.8).lineStyle(1, biome.light, 1).fillRoundedRect(-75, 65, 150, 26, 6).strokeRoundedRect(-75, 65, 150, 26, 6);
      });
      container.on("pointerdown", () => {
          if (!isAuthenticated()) return showAuth();
          this.scene.start("GameScene", { level: id, heroStats: getHeroStats() });
      });
    }

    return container;
  }

  drawBridge(gfx, p1, p2, isLocked) {
    const color = isLocked ? 0x222222 : 0x00f2ff;
    const curve = new Phaser.Curves.QuadraticBezier(
        new Phaser.Math.Vector2(p1.x, p1.y + 10),
        new Phaser.Math.Vector2((p1.x + p2.x)/2, (p1.y + p2.y)/2 - 40),
        new Phaser.Math.Vector2(p2.x, p2.y + 10)
    );
    gfx.lineStyle(8, 0x000000, 0.3); curve.draw(gfx);
    gfx.lineStyle(2, color, isLocked ? 0.1 : 0.6); curve.draw(gfx);
  }

  async loadBestRuns() {
    if (!isAuthenticated()) return;
    try {
      const entries = await fetchPlayerBestRuns();
      this.bestRunsByLevel = new Map(
        entries.map((run) => [
          Number(run.level_id),
          {
            livesLost: Number(run.lives_lost ?? 0),
            completionTimeMs: Number(run.completion_time_ms || 0),
          },
        ])
      );
      this.updateAllIslandStats();
    } catch (err) {
      // Silencieux pour ne pas bloquer la carte
    }
  }

  updateAllIslandStats() {
    this.levelIslands.forEach((_value, levelId) => this.updateIslandStats(levelId));
  }

  updateIslandStats(levelId) {
    const island = this.levelIslands.get(levelId);
    if (!island || island.isLocked) return;
    const bestRun = this.bestRunsByLevel.get(levelId);
    if (!bestRun) {
      island.statsContainer.setVisible(false);
      return;
    }

    island.bestTime.setText(`⏱ ${this.formatTime(bestRun.completionTimeMs)}`);
    island.bestHearts.setText(`❤️ ${bestRun.livesLost} coeurs perdus`);
    island.statsContainer.setVisible(true);
  }

  formatTime(ms) {
    if (!ms || ms <= 0) return "0:00";
    const sec = Math.floor(ms / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
}
