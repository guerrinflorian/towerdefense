import { fetchAchievements } from "../services/achievementsService.js";

export class AchievementsScene extends Phaser.Scene {
  constructor() {
    super("AchievementsScene");

    this.allAchievements = [];
    this.columns = [];
    this.searchQuery = "";

    this.scrollX = 0;
    this.maxScrollX = 0;

    this.columnArea = null;
    this.mainColumnsContainer = null;
    this.progressionContainer = null;

    // drag state
    this._drag = {
      active: false,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      mode: null, // "x" | "y"
      col: null,
    };
  }

  create() {
    const { width, height } = this.scale;

    this.drawBackground(width, height);

    // Header
    this.add.text(40, 45, "SUCCÈS", {
      fontFamily: "Orbitron",
      fontSize: "24px",
      fontStyle: "bold",
      color: "#ffffff",
    });

    // Bouton fermer à la place de la recherche (en haut à droite)
    this.createCloseButton(width);

    // Progression globale (fixe)
    this.progressionContainer = this.add.container(40, 110);

    // Zone dashboard (colonnes)
    this.columnArea = {
      x: 40,
      y: 180, // remonte un peu vu qu'il n'y a plus de search bar
      width: width - 80,
      height: height - 220,
    };

    this.mainColumnsContainer = this.add.container(this.columnArea.x, this.columnArea.y);

    // Masque global de la zone colonnes
    const maskGfx = this.make.graphics();
    maskGfx.fillStyle(0xffffff, 1);
    maskGfx.fillRect(this.columnArea.x, this.columnArea.y, this.columnArea.width, this.columnArea.height);
    this.mainColumnsContainer.setMask(maskGfx.createGeometryMask());

    // Loading
    this.loadingText = this.add
      .text(width / 2, height / 2, "ACCÈS AUX ARCHIVES...", {
        fontFamily: "Orbitron",
        fontSize: "18px",
        color: "#00eaff",
      })
      .setOrigin(0.5);

    this.setupInteractions();
    this.loadData();

    // Resize: recalcul flex colonnes
    this.scale.on("resize", (gameSize) => this.onResize(gameSize));
  }

  // ----------------------------
  // DATA
  // ----------------------------
  async loadData() {
    try {
      const { achievements, summary } = await fetchAchievements();
      this.allAchievements = achievements || [];

      this.updateGlobalProgression(summary || { unlocked: 0, total: 0 });

      if (this.loadingText) this.loadingText.destroy();
      this.refreshDisplay();
    } catch (err) {
      if (this.loadingText) this.loadingText.setText("ERREUR DE LIAISON").setColor("#ff0055");
    }
  }

  updateGlobalProgression(summary) {
    this.progressionContainer.removeAll(true);

    const w = this.scale.width - 80;
    const total = Math.max(0, Number(summary.total || 0));
    const unlocked = Math.max(0, Number(summary.unlocked || 0));
    const percent = total > 0 ? Math.floor((unlocked / total) * 100) : 0;

    const bg = this.add.graphics();
    bg.fillStyle(0x0d121d, 0.86);
    bg.fillRoundedRect(0, 0, w, 50, 10);

    const barX = 280;
    const barW = Math.max(10, w - 300);

    const barBg = this.add.graphics();
    barBg.fillStyle(0x1a202c, 1);
    barBg.fillRoundedRect(barX, 20, barW, 10, 5);

    const barFill = this.add.graphics();
    barFill.fillStyle(0x00eaff, 1);
    barFill.fillRoundedRect(barX, 20, barW * (percent / 100), 10, 5);

    const label = this.add.text(15, 15, `TOTAL: ${unlocked}/${total} (${percent}%)`, {
      fontFamily: "Orbitron",
      fontSize: "14px",
      color: "#ffffff",
    });

    this.progressionContainer.add([bg, barBg, barFill, label]);
  }

  // ----------------------------
  // DISPLAY (colonnes flex)
  // ----------------------------
  refreshDisplay() {
    if (!this.mainColumnsContainer || !this.columnArea) return;

    this.mainColumnsContainer.removeAll(true);
    this.columns = [];

    this.scrollX = 0;
    this.mainColumnsContainer.x = this.columnArea.x;

    // plus de recherche => tout afficher
    const grouped = this.groupByCategory(this.allAchievements);

    const areaW = this.columnArea.width;
    const areaH = this.columnArea.height;

    const gap = 14;
    const minColW = 240;
    const maxColW = 360;

    // combien de colonnes visibles selon la largeur
    const colsVisible = Math.max(1, Math.floor((areaW + gap) / (minColW + gap)));

    // largeur "flex": remplit l'espace
    let colW = Math.floor((areaW - gap * (colsVisible - 1)) / colsVisible);
    colW = Phaser.Math.Clamp(colW, minColW, maxColW);

    grouped.forEach((group, index) => {
      const x = index * (colW + gap);
      this.createCategoryColumn(group, x, colW, areaH);
    });

    const totalW = grouped.length * (colW + gap) - gap;
    this.maxScrollX = Math.max(0, totalW - areaW);
  }

  createCategoryColumn(group, x, colW, colH) {
    const colContainer = this.add.container(x, 0);

    const title = this.add.text(0, -34, `// ${String(group.category || "DIVERS").toUpperCase()}`, {
      fontFamily: "Orbitron",
      fontSize: "13px",
      color: "#7dd0ff",
      fontStyle: "bold",
    });

    const frame = this.add.graphics();
    frame.fillStyle(0x060b12, 0.35);
    frame.lineStyle(1, 0x0b1d2b, 1);
    frame.fillRoundedRect(0, 0, colW, colH, 14);
    frame.strokeRoundedRect(0, 0, colW, colH, 14);

    const listContainer = this.add.container(0, 0);

    let currentY = 14;
    (group.items || []).forEach((ach) => {
      const card = this.createAchievementCard(ach, colW - 20);
      card.x = 10;
      card.y = currentY;
      listContainer.add(card);
      currentY += card.cardHeight + 10;
    });

    colContainer.add([title, frame, listContainer]);
    this.mainColumnsContainer.add(colContainer);

    const maxScrollY = Math.max(0, currentY - colH + 10);

    this.columns.push({
      listContainer,
      maxScrollY,
      currentScrollY: 0,
      x0: x,
      x1: x + colW,
      width: colW,
    });
  }

  createAchievementCard(ach, width) {
    const container = this.add.container(0, 0);
    const unlocked = !!ach.is_unlocked;

    const title = this.add.text(12, 12, String(ach.title || "").toUpperCase(), {
      fontFamily: "Orbitron",
      fontSize: "13px",
      color: unlocked ? "#00ff88" : "#ffffff",
      fontStyle: "bold",
      wordWrap: { width: width - 50 },
    });

    const desc = this.add.text(12, title.y + title.displayHeight + 8, String(ach.description || ""), {
      fontFamily: "Arial",
      fontSize: "11px",
      color: "#94a3b8",
      wordWrap: { width: width - 24 },
    });

    const cardHeight = desc.y + desc.displayHeight + 44;
    container.cardHeight = cardHeight;

    const bg = this.add.graphics();
    bg.fillStyle(unlocked ? 0x0d1f18 : 0x0a0f18, 0.95);
    bg.lineStyle(1, unlocked ? 0x00ff88 : 0x1f2937, 1);
    bg.fillRoundedRect(0, 0, width, cardHeight, 12);
    bg.strokeRoundedRect(0, 0, width, cardHeight, 12);

    // étoiles: 3 toujours noires, dorées selon difficulté de gauche à droite
    const difficulty = Phaser.Math.Clamp(Number(ach.difficulty || 1), 1, 3);
    for (let i = 0; i < 3; i++) {
      const star = this.add.text(12 + i * 20, cardHeight - 26, "★", {
        fontFamily: "Arial",
        fontSize: "18px",
        color: i < difficulty ? "#ffc857" : "#1a1a1a",
      });
      container.add(star);
    }

    const icon = this.add
      .text(width - 18, 20, unlocked ? "✔" : "🔒", {
        fontFamily: "Arial",
        fontSize: "18px",
        color: unlocked ? "#00ff88" : "#1f2937",
      })
      .setOrigin(0.5);

    container.add([bg, title, desc, icon]);
    container.sendToBack(bg);

    return container;
  }

  groupByCategory(achievements) {
    const map = new Map();
    (achievements || []).forEach((ach) => {
      const cat = ach.category || "DIVERS";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat).push(ach);
    });

    return Array.from(map.entries())
      .map(([category, items]) => ({
        category,
        items: (items || [])
          .slice()
          .sort((a, b) => (Number(a.difficulty || 1) || 1) - (Number(b.difficulty || 1) || 1)),
      }))
      .sort((a, b) => (a.category === "GLOBAL" ? -1 : a.category.localeCompare(b.category)));
  }

  // ----------------------------
  // INTERACTIONS
  // ----------------------------
  setupInteractions() {
    // Wheel: vertical => colonne sous la souris, SHIFT (ou vide) => scroll X
    this.input.on("wheel", (pointer, _gameObjects, _dx, dy) => {
      const col = this.getColumnAtPointer(pointer.x, pointer.y);
      const shift = !!pointer.event?.shiftKey;

      if (col && !shift) {
        col.currentScrollY = Phaser.Math.Clamp(col.currentScrollY - dy, -col.maxScrollY, 0);
        col.listContainer.y = col.currentScrollY;
      } else {
        this.scrollX = Phaser.Math.Clamp(this.scrollX - dy, -this.maxScrollX, 0);
        this.mainColumnsContainer.x = this.columnArea.x + this.scrollX;
      }
    });

    this.input.on("pointerdown", (p) => {
      this._drag.active = true;
      this._drag.startX = p.x;
      this._drag.startY = p.y;
      this._drag.lastX = p.x;
      this._drag.lastY = p.y;
      this._drag.mode = null;
      this._drag.col = this.getColumnAtPointer(p.x, p.y);
    });

    this.input.on("pointerup", () => {
      this._drag.active = false;
      this._drag.mode = null;
      this._drag.col = null;
    });

    this.input.on("pointermove", (p) => {
      if (!this._drag.active) return;

      const dx = p.x - this._drag.lastX;
      const dy = p.y - this._drag.lastY;

      // lock direction pour éviter diagonales chelou
      if (!this._drag.mode) {
        const totalDx = p.x - this._drag.startX;
        const totalDy = p.y - this._drag.startY;
        if (Math.abs(totalDx) < 4 && Math.abs(totalDy) < 4) return;
        this._drag.mode = Math.abs(totalDx) > Math.abs(totalDy) ? "x" : "y";
      }

      if (this._drag.mode === "y" && this._drag.col) {
        const col = this._drag.col;
        col.currentScrollY = Phaser.Math.Clamp(col.currentScrollY + dy, -col.maxScrollY, 0);
        col.listContainer.y = col.currentScrollY;
      } else {
        this.scrollX = Phaser.Math.Clamp(this.scrollX + dx, -this.maxScrollX, 0);
        this.mainColumnsContainer.x = this.columnArea.x + this.scrollX;
      }

      this._drag.lastX = p.x;
      this._drag.lastY = p.y;
    });
  }

  getColumnAtPointer(px, py) {
    if (!this.columnArea) return null;

    const inArea =
      px >= this.columnArea.x &&
      px <= this.columnArea.x + this.columnArea.width &&
      py >= this.columnArea.y &&
      py <= this.columnArea.y + this.columnArea.height;

    if (!inArea) return null;

    const localX = px - (this.mainColumnsContainer.x || 0);
    const localY = py - (this.mainColumnsContainer.y || 0);
    if (localY < 0) return null;

    return this.columns.find((c) => localX >= c.x0 && localX <= c.x1) || null;
  }

  // ----------------------------
  // RESIZE
  // ----------------------------
  onResize(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;

    // maj zone
    this.columnArea = {
      x: 40,
      y: 180,
      width: width - 80,
      height: height - 220,
    };

    if (this.mainColumnsContainer) {
      this.mainColumnsContainer.x = this.columnArea.x + this.scrollX;
      this.mainColumnsContainer.y = this.columnArea.y;
    }

    // maj bouton fermer (si tu veux le retrouver facilement, tu peux stocker la ref)
    // ici on fait simple: on refresh tout
    this.refreshDisplay();
  }

  // ----------------------------
  // UI
  // ----------------------------
  createCloseButton(width) {
    const x = width - 40;
    const y = 62;
    
    // 1. Créer un container pour grouper le fond et le texte
    const btn = this.add.container(x, y).setDepth(1000);

    // 2. Calculer les dimensions (Capsule)
    const labelText = "× FERMER";
    const style = { fontFamily: "Orbitron", fontSize: "14px", color: "#ff0055" };
    const tempText = this.make.text({ text: labelText, style: style });
    const bw = tempText.width + 30; // Largeur avec padding
    const bh = 36;                  // Hauteur fixe
    tempText.destroy();

    const bg = this.add.graphics();
    const label = this.add.text(-15, 0, labelText, style).setOrigin(1, 0.5);

    // 3. Fonctions de dessin
    const drawBtn = (isHover) => {
        bg.clear();
        bg.fillStyle(isHover ? 0x1a0716 : 0x120711, isHover ? 0.7 : 0.55);
        bg.lineStyle(1, 0xff0055, isHover ? 0.9 : 0.55);
        // On dessine le rectangle par rapport au point d'ancrage du container
        bg.fillRoundedRect(-bw, -bh / 2, bw, bh, 10);
        bg.strokeRoundedRect(-bw, -bh / 2, bw, bh, 10);
    };

    drawBtn(false);
    btn.add([bg, label]);

    // 4. HITBOX : On définit un rectangle qui couvre tout le bouton
    // x: -bw, y: -bh/2 (le coin haut-gauche du dessin)
    btn.setInteractive(
        new Phaser.Geom.Rectangle(-bw, -bh / 2, bw, bh),
        Phaser.Geom.Rectangle.Contains
    );

    // 5. Événements sur le bouton entier
    btn.on("pointerover", () => drawBtn(true));
    btn.on("pointerout", () => drawBtn(false));
    btn.on("pointerdown", () => this.scene.start("MainMenuScene"));

    this._closeBtn = btn;
}

  drawBackground(width, height) {
    this.add
      .graphics()
      .fillGradientStyle(0x05080f, 0x05080f, 0x0a1425, 0x0a1425, 1)
      .fillRect(0, 0, width, height);
  }
}
