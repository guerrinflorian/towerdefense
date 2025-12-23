import { fetchAchievements } from "../services/achievementsService.js";

export class AchievementsScene extends Phaser.Scene {
  constructor() {
    super("AchievementsScene");
    this.scrollSpeed = 0.6;
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor("#05080f");
    this.scrollBounds = { min: 0, max: 0 };

    this.addOverlay(width, height);
    this.createHeader(width);
    this.createBackButton(width, height);

    this.loadingText = this.add
      .text(width / 2, height / 2, "Chargement des succès...", {
        fontSize: "20px",
        fontFamily: "Orbitron, sans-serif",
        color: "#00eaff",
      })
      .setOrigin(0.5);

    this.loadData();
    this.enableScroll();
  }

  addOverlay(width, height) {
    const bg = this.add.graphics();
    bg.fillStyle(0x0a0f1a, 0.85);
    bg.fillRect(0, 0, width, height);
  }

  createHeader(width) {
    this.titleText = this.add
      .text(width / 2, 40, "SYSTÈME DE SUCCÈS", {
        fontFamily: "Impact, sans-serif",
        fontSize: "36px",
        color: "#ffffff",
        stroke: "#00eaff",
        strokeThickness: 3,
      })
      .setOrigin(0.5);
  }

  createBackButton(width, height) {
    const container = this.add.container(30, 30);
    const bg = this.add.graphics();
    const size = 44;
    bg.fillStyle(0x0d1626, 0.9);
    bg.lineStyle(2, 0x00eaff, 0.8);
    bg.fillRoundedRect(0, 0, size, size, 10);
    bg.strokeRoundedRect(0, 0, size, size, 10);
    container.add(bg);

    const arrow = this.add.text(size / 2, size / 2, "←", {
      fontFamily: "Arial",
      fontSize: "24px",
      color: "#00eaff",
    });
    arrow.setOrigin(0.5);
    container.add(arrow);

    container.setSize(size, size);
    container.setInteractive({ useHandCursor: true });
    container.on("pointerover", () => bg.setAlpha(1));
    container.on("pointerout", () => bg.setAlpha(0.9));
    container.on("pointerdown", () => {
      this.scene.start("MainMenuScene");
    });

    container.setPosition(width - size - 20, 20);
    this.backButton = container;
  }

  enableScroll() {
    this.input.on("wheel", (_p, _g, _dx, dy) => {
      const cam = this.cameras.main;
      cam.scrollY = Phaser.Math.Clamp(
        cam.scrollY + dy * this.scrollSpeed,
        this.scrollBounds.min,
        this.scrollBounds.max
      );
    });
  }

  async loadData() {
    try {
      const { achievements, summary } = await fetchAchievements();
      if (this.loadingText) {
        this.loadingText.destroy();
        this.loadingText = null;
      }
      this.renderAchievements(achievements, summary);
      window.dispatchEvent(
        new CustomEvent("achievements:updated", { detail: { summary } })
      );
    } catch (err) {
      console.error("Erreur chargement achievements", err);
      if (this.loadingText) {
        this.loadingText.setText("Impossible de charger les succès.");
        this.loadingText.setColor("#ff6666");
      }
    }
  }

  renderAchievements(achievements, summary) {
    const { width } = this.scale;
    const padding = 40;
    const topOffset = 90;
    let currentY = topOffset;

    this.createSummaryCard(summary, padding, currentY, width - padding * 2);
    currentY += 90;

    const grouped = this.groupByCategory(achievements);
    grouped.forEach(({ category, items }) => {
      const title = this.add.text(padding, currentY, `CATÉGORIE : ${category}`, {
        fontFamily: "Orbitron, sans-serif",
        fontSize: "20px",
        color: "#7dd0ff",
      });
      currentY += 40;
      items.forEach((achievement) => {
        const cardHeight = this.createAchievementCard(
          achievement,
          padding,
          currentY,
          width - padding * 2
        );
        currentY += cardHeight + 12;
      });
      currentY += 10;
    });

    this.scrollBounds.max = Math.max(0, currentY - this.scale.height + 40);
    this.cameras.main.setBounds(
      0,
      0,
      this.scale.width,
      currentY + 60
    );
  }

  createSummaryCard(summary, x, y, width) {
    const containerHeight = 70;
    const bg = this.add.graphics();
    bg.fillStyle(0x0d1626, 0.9);
    bg.lineStyle(2, 0x00eaff, 0.5);
    bg.fillRoundedRect(x, y, width, containerHeight, 12);
    bg.strokeRoundedRect(x, y, width, containerHeight, 12);

    const ratioText = this.add.text(
      x + 15,
      y + containerHeight / 2,
      `Succès : ${summary.unlocked}/${summary.total}`,
      {
        fontFamily: "Orbitron, sans-serif",
        fontSize: "18px",
        color: "#ffffff",
      }
    ).setOrigin(0, 0.5);

    const subText = this.add.text(
      x + width - 10,
      y + containerHeight / 2,
      "Débloquez des récompenses !",
      {
        fontFamily: "Arial",
        fontSize: "14px",
        color: "#7dd0ff",
      }
    ).setOrigin(1, 0.5);

    return { bg, ratioText, subText };
  }

  groupByCategory(achievements) {
    const map = new Map();
    achievements.forEach((ach) => {
      if (!map.has(ach.category)) {
        map.set(ach.category, []);
      }
      map.get(ach.category).push(ach);
    });

    return Array.from(map.entries())
      .map(([category, items]) => ({
        category,
        items: items.sort((a, b) => {
          const diff = (b.difficulty || 0) - (a.difficulty || 0);
          if (diff !== 0) return diff;
          return a.goal_value - b.goal_value;
        }),
      }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }

  createAchievementCard(achievement, x, y, width) {
    const height = 100;
    const unlocked = achievement.is_unlocked;

    const bg = this.add.graphics();
    bg.fillStyle(unlocked ? 0x0f1f14 : 0x0d0f17, 0.92);
    bg.lineStyle(2, unlocked ? 0x4caf50 : 0x1b2030, 1);
    bg.fillRoundedRect(x, y, width, height, 12);
    bg.strokeRoundedRect(x, y, width, height, 12);

    const title = this.add.text(x + 16, y + 16, achievement.title, {
      fontFamily: "Orbitron, sans-serif",
      fontSize: "18px",
      color: unlocked ? "#c8ffd0" : "#ffffff",
    });

    const description = this.add.text(
      x + 16,
      y + 46,
      achievement.description || "",
      {
        fontFamily: "Arial",
        fontSize: "14px",
        color: "#d0d8e0",
        wordWrap: { width: width - 220 },
      }
    );

    const stars = this.createStars(
      achievement.difficulty || 0,
      x + width - 150,
      y + 32
    );

    const statusText = this.add.text(
      x + width - 150,
      y + 65,
      unlocked ? "Déverrouillé" : "En cours",
      {
        fontFamily: "Arial",
        fontSize: "14px",
        color: unlocked ? "#4caf50" : "#7dd0ff",
      }
    );

    return height;
  }

  createStars(count, x, y) {
    const maxStars = 3;
    const gap = 26;
    for (let i = 0; i < maxStars; i++) {
      const filled = i < count;
      const star = this.add.text(x + i * gap, y, "★", {
        fontFamily: "Arial",
        fontSize: "22px",
        color: filled ? "#ffc857" : "#2d3445",
      });
      star.setOrigin(0.5);
    }
  }
}
