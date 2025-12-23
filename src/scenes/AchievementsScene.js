import { fetchAchievements } from "../services/achievementsService.js";

export class AchievementsScene extends Phaser.Scene {
  constructor() {
    super("AchievementsScene");

    // Scroll state
    this.view = null;
    this.scrollContainer = null;
    this.scrollAmount = 0;
    this.maxScroll = 0;

    // UI refs
    this.loadingText = null;
    this.maskGfx = null;
    this.backBtn = null;
    this._bgCache = new Map();

    // Drag state
    this._drag = { active: false, startY: 0, lastY: 0 };

    // Card layout
    this.cardHeight = 118;
  }

  create() {
    const { width, height } = this.scale;

    // --- 1) BACKGROUND ---
    this.drawBackground(width, height);

    // --- 2) STATIC UI ---
    this.createHeader(width);
    this.createBackButton(width);

    // --- 3) SCROLL VIEW ---
    this.view = {
      x: 40,
      y: 130,
      width: width - 80,
      height: height - 160,
      radius: 14,
    };

    this.scrollContainer = this.add.container(this.view.x, this.view.y);

    this.maskGfx = this.make.graphics();
    this.maskGfx.fillStyle(0xffffff, 1);
    this.maskGfx.fillRoundedRect(
      this.view.x,
      this.view.y,
      this.view.width,
      this.view.height,
      this.view.radius
    );
    this.scrollContainer.setMask(this.maskGfx.createGeometryMask());

    // --- 4) LOADING ---
    this.loadingText = this.add
      .text(width / 2, height / 2, "SYNCHRONISATION DES ARCHIVES...", {
        fontFamily: "Orbitron, sans-serif",
        fontSize: "18px",
        color: "#00eaff",
      })
      .setOrigin(0.5)
      .setAlpha(0.95);

    // --- 5) DATA + INPUT ---
    this.loadData();
    this.setupInteractions();
  }

  shutdown() {
    // idempotent cleanup
    try {
      this._bgCache?.forEach((g) => g?.destroy?.());
      this._bgCache?.clear?.();
    } catch (e) {}

    try {
      this.input?.removeAllListeners?.();
    } catch (e) {}

    try {
      this.maskGfx?.destroy?.();
    } catch (e) {}

    try {
      this.scrollContainer?.destroy?.(true);
    } catch (e) {}

    try {
      this.loadingText?.destroy?.();
    } catch (e) {}
  }

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------

  drawBackground(width, height) {
    const g = this.add.graphics();
    g.fillGradientStyle(0x05080f, 0x05080f, 0x0a1425, 0x0a1425, 1);
    g.fillRect(0, 0, width, height);

    // petite texture "stars" légère
    const dots = this.add.graphics();
    dots.fillStyle(0x00eaff, 0.06);
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() < 0.85 ? 1 : 1.6;
      dots.fillCircle(x, y, r);
    }
  }

  createHeader(width) {
    const title = this.add.text(40, 48, "SYSTÈME DE SUCCÈS", {
      fontFamily: "Orbitron, sans-serif",
      fontSize: "28px",
      fontStyle: "normal",
      fontWeight: "700",
      color: "#ffffff",
      letterSpacing: 4,
    });

    // glow discret
    title.setShadow(0, 0, "#00eaff", 8);

    const line = this.add.graphics();
    line.lineStyle(2, 0x00eaff, 0.28);
    line.lineBetween(40, 95, width - 40, 95);
  }

  createBackButton(width) {
    const x = width - 170;
    const y = 42;
    const w = 130;
    const h = 42;
    const r = 10;

    const btn = this.add.container(x, y).setDepth(10);

    const bg = this.add.graphics();
    const drawIdle = () => {
      bg.clear();
      bg.lineStyle(2, 0x00eaff, 1);
      bg.strokeRoundedRect(0, 0, w, h, r);
      bg.fillStyle(0x00eaff, 0.06);
      bg.fillRoundedRect(0, 0, w, h, r);
    };
    const drawHover = () => {
      bg.clear();
      bg.lineStyle(2, 0x00eaff, 1);
      bg.strokeRoundedRect(0, 0, w, h, r);
      bg.fillStyle(0x00eaff, 0.14);
      bg.fillRoundedRect(0, 0, w, h, r);
    };

    drawIdle();

    const txt = this.add
      .text(w / 2, h / 2, "RETOUR", {
        fontFamily: "Orbitron, sans-serif",
        fontSize: "13px",
        color: "#00eaff",
      })
      .setOrigin(0.5);

    btn.add([bg, txt]);
    btn.setSize(w, h);
    // Remplace la ligne btn.setInteractive(...) par :
btn.setInteractive(
  new Phaser.Geom.Rectangle(w / 2, h / 2, w, h), 
  Phaser.Geom.Rectangle.Contains
);

    btn.on("pointerover", () => drawHover());
    btn.on("pointerout", () => drawIdle());
    btn.on("pointerdown", () => this.scene.start("MainMenuScene"));

    this.backBtn = btn;
  }

  // ---------------------------------------------------------------------------
  // Data / Render
  // ---------------------------------------------------------------------------

  async loadData() {
    try {
      const { achievements, summary } = await fetchAchievements();
      if (this.loadingText) this.loadingText.destroy();

      this.renderContent(achievements || [], summary || { unlocked: 0, total: 0 });
    } catch (err) {
      console.error(err);
      if (!this.loadingText) return;
      this.loadingText.setText("ERREUR DE CONNEXION").setColor("#ff0055");
    }
  }

  renderContent(achievements, summary) {
    const contentWidth = this.view.width;
    const cardHeight = this.cardHeight || 102;
    const cardSpacing = 10;

    let currentY = 0;

    // Summary box
    const summaryBox = this.createSummaryBox(summary, contentWidth);
    this.scrollContainer.add(summaryBox);
    currentY += 120;

    // Group & sort
    const grouped = this.groupByCategory(achievements);

    grouped.forEach((group) => {
      const catTitle = this.add.text(0, currentY, `// SECTION : ${String(group.category || "AUTRE").toUpperCase()}`, {
        fontFamily: "Orbitron, sans-serif",
        fontSize: "16px",
        color: "#7dd0ff",
      });
      catTitle.setAlpha(0.95);

      this.scrollContainer.add(catTitle);
      currentY += 38;

      group.items.forEach((ach) => {
        const card = this.createAchievementCard(ach, contentWidth, currentY);
        this.scrollContainer.add(card);
        currentY += cardHeight + cardSpacing;
      });

      currentY += 18;
    });

    // max scroll
    this.maxScroll = Math.max(0, currentY - this.view.height);
    this.scrollAmount = 0;
    this.applyScroll();
  }

  createSummaryBox(summary, width) {
    const container = this.add.container(0, 0);

    const total = Math.max(0, Number(summary.total || 0));
    const unlocked = Math.max(0, Number(summary.unlocked || 0));
    const percent = total > 0 ? Math.floor((unlocked / total) * 100) : 0;

    const bg = this.add.graphics();
    bg.fillStyle(0x0d121d, 0.82);
    bg.fillRoundedRect(0, 0, width, 92, 14);
    bg.lineStyle(2, 0x00eaff, 0.2);
    bg.strokeRoundedRect(0, 0, width, 92, 14);

    const label = this.add.text(18, 18, `SYNCHRONISATION : ${percent}% (${unlocked}/${total})`, {
      fontFamily: "Orbitron, sans-serif",
      fontSize: "15px",
      color: "#00eaff",
    });

    const barW = width - 36;
    const barX = 18;
    const barY = 54;

    const barBg = this.add.graphics();
    barBg.fillStyle(0x1a202c, 1);
    barBg.fillRoundedRect(barX, barY, barW, 12, 6);

    const barFill = this.add.graphics();
    barFill.fillStyle(0x00eaff, 1);
    barFill.fillRoundedRect(barX, barY, Math.max(0, barW * (percent / 100)), 12, 6);

    const hint = this.add.text(18, 72, "Débloque des succès en jouant pour compléter ta collection.", {
      fontFamily: "Arial",
      fontSize: "12px",
      color: "#94a3b8",
    });

    container.add([bg, label, barBg, barFill, hint]);
    return container;
  }

  createAchievementCard(ach, width, y) {
    const container = this.add.container(0, y);

    const unlocked = !!ach.is_unlocked;
    const difficulty = Phaser.Math.Clamp(Number(ach.difficulty || 1), 1, 3);
    const cardHeight = this.cardHeight || 102;

    const goalValue = Number(ach.goal_value);
    const hasGoalValue = Number.isFinite(goalValue);
    const currentValueRaw = Number(ach.current_value);
    const currentValue = Number.isFinite(currentValueRaw)
      ? Math.max(0, currentValueRaw)
      : 0;
    const scope = String(ach.scope || "").toUpperCase();
    const isGlobalScope =
      scope === "LIFETIME" || scope === "GLOBAL" || ach.accumulate === true;

    // 1. On prépare le fond (Graphics)
    const cardGfx = this.add.graphics();
    const fillColor = unlocked ? 0x0d1f18 : 0x0a0f18;
    const strokeColor = unlocked ? 0x00ff88 : 0x1f2937;

    cardGfx.fillStyle(fillColor, 0.92);
    cardGfx.lineStyle(2, strokeColor, 1);
    cardGfx.fillRoundedRect(0, 0, width, cardHeight, 14);
    cardGfx.strokeRoundedRect(0, 0, width, cardHeight, 14);
    
    // Barre d'accentuation à gauche
    cardGfx.fillStyle(unlocked ? 0x00ff88 : 0x334155, 0.18);
    cardGfx.fillRoundedRect(0, 0, 10, cardHeight, 14);

    // 2. AJOUTER LE FOND EN PREMIER (Z-index le plus bas)
    container.add(cardGfx);

    // 3. On prépare les textes
    const title = this.add.text(22, 14, String(ach.title || "Succès"), {
      fontFamily: "Orbitron, sans-serif", fontSize: "17px",
      color: unlocked ? "#00ff88" : "#ffffff", fontWeight: "700",
    });

    const desc = this.add.text(22, 42, String(ach.description || ""), {
      fontFamily: "Arial", fontSize: "13px", color: "#94a3b8",
      wordWrap: { width: width - 210 },
    });

    // 4. ON AJOUTE LES ÉTOILES (Elles seront au-dessus du fond)
    const starBaseX = 22;
    const starY = 70;
    const gap = 26;

    for (let i = 0; i < 3; i++) {
        const isGold = i < difficulty;
        const star = this.add.text(starBaseX + i * gap, starY, "★", {
            fontFamily: "Arial",
            fontSize: "22px",
            // Si pas gold, on met un gris visible (#444444) car #1a1a1a est trop proche du noir du fond
            color: isGold ? "#ffc857" : "#444444",
        });

        if (isGold) {
            star.setShadow(0, 0, "#ffc857", 6);
        } else {
            star.setAlpha(0.5);
        }
        container.add(star);
    }

    // 5. On ajoute le reste des éléments (Pill, Status, Icon)

    // status pill
    const pill = this.add.graphics();
    const pillText = unlocked ? "DÉBLOQUÉ" : "VERROUILLÉ";
    const pillColor = unlocked ? 0x00ff88 : 0x334155;

    const pillW = 110;
    const pillH = 24;
    const pillX = width - pillW - 16;
    const pillY = 66;

    pill.fillStyle(pillColor, unlocked ? 0.14 : 0.12);
    pill.lineStyle(1, pillColor, unlocked ? 0.7 : 0.35);
    pill.fillRoundedRect(pillX, pillY, pillW, pillH, 12);
    pill.strokeRoundedRect(pillX, pillY, pillW, pillH, 12);

    const status = this.add
      .text(pillX + pillW / 2, pillY + pillH / 2, pillText, {
        fontFamily: "Orbitron, sans-serif",
        fontSize: "10px",
        color: unlocked ? "#00ff88" : "#94a3b8",
      })
      .setOrigin(0.5);

    // icon
    const icon = this.add
      .text(width - 32, 22, unlocked ? "✔" : "🔒", {
        fontSize: "20px",
        color: unlocked ? "#00ff88" : "#1f2937",
      })
      .setOrigin(0.5);

    const progressY = cardHeight - 26;
    const progressElements = [];
    if (isGlobalScope && hasGoalValue) {
      const progressText = this.add.text(
        22,
        progressY,
        `Progression : ${currentValue}/${goalValue}`,
        {
          fontFamily: "Arial",
          fontSize: "12px",
          color: unlocked ? "#9ef0c0" : "#cbd5e1",
        }
      );
      progressElements.push(progressText);
    }

    container.add([title, desc, pill, status, icon, ...progressElements]);
    
      return container;
  }

  // ---------------------------------------------------------------------------
  // Input / Scroll
  // ---------------------------------------------------------------------------

  setupInteractions() {
    // wheel
    this.input.on("wheel", (pointer, gameObjects, dx, dy) => {
      // dy > 0 = scroll down
      this.scrollAmount -= dy * 0.65;
      this.applyScroll();
    });

    // drag (mobile + desktop)
    // Modifie le pointerdown dans setupInteractions :
this.input.on("pointerdown", (p) => {
  // SI on clique sur un objet (le bouton retour par exemple), on n'active pas le drag
  const hitObjects = this.input.hitTestPointer(p);
  if (hitObjects.length > 0) return; 

  this._drag.active = true;
  this._drag.startY = p.y;
  this._drag.lastY = p.y;
});

    this.input.on("pointerup", () => {
      this._drag.active = false;
    });

    this.input.on("pointermove", (p) => {
      if (!this._drag.active) return;

      const delta = p.y - this._drag.lastY;
      this._drag.lastY = p.y;

      this.scrollAmount += delta;
      this.applyScroll();
    });
  }

  applyScroll() {
    if (!this.scrollContainer || !this.view) return;

    this.scrollAmount = Phaser.Math.Clamp(this.scrollAmount, -this.maxScroll, 0);
    this.scrollContainer.y = this.view.y + this.scrollAmount;
  }

  // ---------------------------------------------------------------------------
  // Utils
  // ---------------------------------------------------------------------------

  groupByCategory(achievements) {
    const map = new Map();

    achievements.forEach((ach) => {
      const cat = ach.category || "AUTRE";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat).push(ach);
    });

    return Array.from(map.entries()).map(([category, items]) => ({
      category,
      items: items.sort((a, b) => (Number(a.difficulty || 1) - Number(b.difficulty || 1))),
    }));
  }
}
