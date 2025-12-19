import { CONFIG } from "../../../../config/settings.js";

const formatMsToTimer = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export class HUD {
  constructor(scene) {
    this.scene = scene;
    this.topBar = null;
    this.bgBar = null;
    this.barWidth = 0;
    this.basePadding = 0;
  }

  create() {
    const s = this.scene.scaleFactor;

    const UI_HEIGHT = CONFIG.UI_HEIGHT * s;
    const fontSize = Math.max(16, 24 * s);
    const smallFontSize = Math.max(12, 18 * s);
    const barWidth = this.scene.hudWidth || this.scene.gameWidth;
    const padding = 18 * s;
    const usableWidth = barWidth - padding * 2;
    const startX = this.scene.hudX || 0;
    const startY = this.scene.hudY || 0;

    const topBar = this.scene.add.container(startX, startY).setDepth(200);

    const bgBar = this.scene.add.graphics();
    bgBar.fillStyle(0x0f1015, 0.92);
    bgBar.fillRoundedRect(0, 0, barWidth, UI_HEIGHT, 12);
    bgBar.lineStyle(2, 0x00ccff, 0.3);
    bgBar.strokeRoundedRect(0, 0, barWidth, UI_HEIGHT, 12);
    topBar.add(bgBar);

    const textConfigs = [
      { key: "txtMoney", color: "#ffd700", label: "💰", ratio: 0.08 },
      { key: "txtLives", color: "#ff6666", label: "❤️", ratio: 0.33 },
      { key: "txtWave", color: "#00ccff", label: "🌊", ratio: 0.58 },
      { key: "txtTimer", color: "#ffffff", label: "⏱️", ratio: 0.82 },
    ];

    textConfigs.forEach((cfg) => {
      const x = padding + usableWidth * cfg.ratio;
      const textObj = this.scene.add
        .text(x, UI_HEIGHT / 2, "", {
          fontSize: `${fontSize}px`,
          fill: cfg.color,
          fontStyle: "bold",
          fontFamily: "Arial",
        })
        .setOrigin(0.5);
      topBar.add(textObj);
      this.scene[cfg.key] = textObj;
    });

    this.scene.pauseBtn = this.scene.add
      .text(barWidth - padding * 2.2, UI_HEIGHT / 2, "⏸️ PAUSE", {
        fontSize: `${smallFontSize}px`,
        fill: "#ffaa00",
        backgroundColor: "#1e1e1e",
        padding: { x: 12 * s, y: 6 * s },
        fontFamily: "Arial",
      })
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        if (!this.scene.isPaused) {
          this.scene.pauseBtn.setColor("#ffcc00");
        }
      })
      .on("pointerout", () => {
        if (!this.scene.isPaused) {
          this.scene.pauseBtn.setColor("#ffaa00");
        }
      })
      .on("pointerdown", () => {
        if (!this.scene.isPaused) {
          this.scene.pauseGame();
        }
      });
    topBar.add(this.scene.pauseBtn);

    const quitBtn = this.scene.add
      .text(barWidth - padding * 0.6, UI_HEIGHT / 2, "QUITTER", {
        fontSize: `${smallFontSize}px`,
        fill: "#aaaaaa",
        backgroundColor: "#1e1e1e",
        padding: { x: 10 * s, y: 6 * s },
        fontFamily: "Arial",
      })
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => quitBtn.setColor("#ffffff"))
      .on("pointerout", () => quitBtn.setColor("#aaaaaa"))
      .on("pointerdown", () => this.scene.scene.start("MainMenuScene"));
    topBar.add(quitBtn);

    this.topBar = topBar;
    this.bgBar = bgBar;
    this.barWidth = barWidth;
    this.basePadding = padding;
    this.UI_HEIGHT = UI_HEIGHT;
    this.fontSize = fontSize;
    this.smallFontSize = smallFontSize;

    this.update(this.scene.money, this.scene.lives, 1, 1);
    this.updateTimer(0);
  }

  reposition() {
    if (!this.topBar || !this.bgBar) return;

    const s = this.scene.scaleFactor;
    const barWidth = this.scene.hudWidth || this.scene.gameWidth;
    const UI_HEIGHT = CONFIG.UI_HEIGHT * s;
    const padding = 18 * s;
    const usableWidth = barWidth - padding * 2;

    this.topBar.setPosition(this.scene.hudX || 0, this.scene.hudY || 0);

    this.bgBar.clear();
    this.bgBar.fillStyle(0x0f1015, 0.92);
    this.bgBar.fillRoundedRect(0, 0, barWidth, UI_HEIGHT, 12);
    this.bgBar.lineStyle(2, 0x00ccff, 0.3);
    this.bgBar.strokeRoundedRect(0, 0, barWidth, UI_HEIGHT, 12);

    const textObjects = [
      this.scene.txtMoney,
      this.scene.txtLives,
      this.scene.txtWave,
      this.scene.txtTimer,
    ];
    const ratios = [0.08, 0.33, 0.58, 0.82];
    textObjects.forEach((txt, index) => {
      if (txt) {
        txt.setPosition(
          padding + usableWidth * ratios[index],
          UI_HEIGHT / 2
        );
      }
    });

    if (this.scene.pauseBtn) {
      this.scene.pauseBtn.setPosition(
        barWidth - padding * 2.2,
        UI_HEIGHT / 2
      );
    }
  }

  update(money, lives, currentWave, totalWaves) {
    if (this.scene.txtMoney) this.scene.txtMoney.setText(`💰 ${money}`);
    if (this.scene.txtLives) this.scene.txtLives.setText(`❤️ ${lives}`);

    if (this.scene.txtWave) {
      this.scene.txtWave.setText(`🌊 VAGUE ${currentWave}/${totalWaves}`);
    }
  }

  updateTimer(elapsedMs) {
    if (this.scene.txtTimer) {
      this.scene.txtTimer.setText(`⏱️ ${formatMsToTimer(elapsedMs)}`);
    }
  }
}
