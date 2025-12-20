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

    // Utiliser la largeur spécifique de la sidebar droite (qui s'étire jusqu'à la map)
    const columnWidth = this.scene.rightToolbarWidth || this.scene.toolbarWidth;
    const columnHeight = this.scene.toolbarHeight;
    const padding = 18 * s;
    const fontSize = Math.max(16, 20 * s);
    const smallFontSize = Math.max(12, 16 * s);
    const startX = this.scene.rightToolbarOffsetX;
    // Les sidebars commencent en haut (y=0) pour s'étirer sur toute la hauteur
    const startY = this.scene.toolbarOffsetY || 0;

    // Container principal à droite
    const rightPanel = this.scene.add.container(startX, startY).setDepth(200);
    this.topBar = rightPanel; // Garder la référence pour compatibilité

    // Fond du panneau
    const bgPanel = this.scene.add.graphics();
    bgPanel.fillStyle(0x0f1015, 0.92);
    bgPanel.fillRoundedRect(0, 0, columnWidth, columnHeight, 14);
    bgPanel.lineStyle(2, 0x00ccff, 0.35);
    bgPanel.strokeRoundedRect(0, 0, columnWidth, columnHeight, 14);
    rightPanel.add(bgPanel);
    this.bgBar = bgPanel;

    // Titre du panneau
    const title = this.scene.add
      .text(columnWidth / 2, padding, "INFORMATIONS", {
        fontSize: `${Math.max(14, 16 * s)}px`,
        fill: "#9edcff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0);
    rightPanel.add(title);

    // Zone des informations (argent, vies, vague, chrono)
    const infoStartY = title.y + title.height + padding * 1.5;
    const infoSpacing = 50 * s;
    const infoItemHeight = 60 * s;

    // Argent
    const moneyY = infoStartY;
    const moneyBg = this.scene.add.graphics();
    moneyBg.fillStyle(0x1a1a2e, 0.8);
    moneyBg.fillRoundedRect(padding, moneyY, columnWidth - padding * 2, infoItemHeight, 10);
    moneyBg.lineStyle(2, 0xffd700, 0.5);
    moneyBg.strokeRoundedRect(padding, moneyY, columnWidth - padding * 2, infoItemHeight, 10);
    rightPanel.add(moneyBg);

    this.scene.txtMoney = this.scene.add
      .text(columnWidth / 2, moneyY + infoItemHeight / 2, "", {
        fontSize: `${fontSize}px`,
        fill: "#ffd700",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);
    rightPanel.add(this.scene.txtMoney);

    // Vies
    const livesY = moneyY + infoItemHeight + padding * 0.8;
    const livesBg = this.scene.add.graphics();
    livesBg.fillStyle(0x1a1a2e, 0.8);
    livesBg.fillRoundedRect(padding, livesY, columnWidth - padding * 2, infoItemHeight, 10);
    livesBg.lineStyle(2, 0xff6666, 0.5);
    livesBg.strokeRoundedRect(padding, livesY, columnWidth - padding * 2, infoItemHeight, 10);
    rightPanel.add(livesBg);

    this.scene.txtLives = this.scene.add
      .text(columnWidth / 2, livesY + infoItemHeight / 2, "", {
        fontSize: `${fontSize}px`,
        fill: "#ff6666",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);
    rightPanel.add(this.scene.txtLives);

    // Vague
    const waveY = livesY + infoItemHeight + padding * 0.8;
    const waveBg = this.scene.add.graphics();
    waveBg.fillStyle(0x1a1a2e, 0.8);
    waveBg.fillRoundedRect(padding, waveY, columnWidth - padding * 2, infoItemHeight, 10);
    waveBg.lineStyle(2, 0x00ccff, 0.5);
    waveBg.strokeRoundedRect(padding, waveY, columnWidth - padding * 2, infoItemHeight, 10);
    rightPanel.add(waveBg);

    this.scene.txtWave = this.scene.add
      .text(columnWidth / 2, waveY + infoItemHeight / 2, "", {
        fontSize: `${fontSize}px`,
        fill: "#00ccff",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);
    rightPanel.add(this.scene.txtWave);

    // Chrono
    const timerY = waveY + infoItemHeight + padding * 0.8;
    const timerBg = this.scene.add.graphics();
    timerBg.fillStyle(0x1a1a2e, 0.8);
    timerBg.fillRoundedRect(padding, timerY, columnWidth - padding * 2, infoItemHeight, 10);
    timerBg.lineStyle(2, 0xffffff, 0.5);
    timerBg.strokeRoundedRect(padding, timerY, columnWidth - padding * 2, infoItemHeight, 10);
    rightPanel.add(timerBg);

    this.scene.txtTimer = this.scene.add
      .text(columnWidth / 2, timerY + infoItemHeight / 2, "", {
        fontSize: `${fontSize}px`,
        fill: "#ffffff",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);
    rightPanel.add(this.scene.txtTimer);

    // Zone des boutons en bas
    const buttonAreaY = columnHeight - padding - 140 * s;
    const buttonHeight = 50 * s;
    const buttonSpacing = padding * 0.8;
    const buttonWidth = columnWidth - padding * 2;

    // Bouton Pause
    const pauseBtnX = padding + buttonWidth / 2;
    const pauseBtnY = buttonAreaY + buttonHeight / 2;
    this.scene.pauseBtn = this.scene.add
      .text(pauseBtnX, pauseBtnY, "⏸️ PAUSE", {
        fontSize: `${smallFontSize}px`,
        fill: "#ffaa00",
        backgroundColor: "#1e1e1e",
        padding: { x: 12 * s, y: 8 * s },
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
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
    rightPanel.add(this.scene.pauseBtn);

    // Bouton Quitter (juste en dessous du bouton pause)
    const quitBtnY = pauseBtnY + buttonHeight + buttonSpacing;
    this.scene.quitBtn = this.scene.add
      .text(pauseBtnX, quitBtnY, "🚪 QUITTER", {
        fontSize: `${smallFontSize}px`,
        fill: "#ff4444",
        backgroundColor: "#1e1e1e",
        padding: { x: 12 * s, y: 8 * s },
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        this.scene.quitBtn.setColor("#ff6666");
      })
      .on("pointerout", () => {
        this.scene.quitBtn.setColor("#ff4444");
      })
      .on("pointerdown", () => {
        this.scene.showQuitConfirmation();
      });
    rightPanel.add(this.scene.quitBtn);

    this.barWidth = columnWidth;
    this.basePadding = padding;
    this.UI_HEIGHT = columnHeight;
    this.fontSize = fontSize;
    this.smallFontSize = smallFontSize;

    this.update(this.scene.money, this.scene.lives, 1, 1);
    this.updateTimer(0);
  }

  reposition() {
    if (!this.topBar || !this.bgBar) return;

    const s = this.scene.scaleFactor;
    // Utiliser la largeur spécifique de la sidebar droite (qui s'étire jusqu'à la map)
    const columnWidth = this.scene.rightToolbarWidth || this.scene.toolbarWidth;
    const columnHeight = this.scene.toolbarHeight;
    const padding = 18 * s;
    const startX = this.scene.rightToolbarOffsetX;
    const startY = this.scene.toolbarOffsetY;

    this.topBar.setPosition(startX, startY);

    this.bgBar.clear();
    this.bgBar.fillStyle(0x0f1015, 0.92);
    this.bgBar.fillRoundedRect(0, 0, columnWidth, columnHeight, 14);
    this.bgBar.lineStyle(2, 0x00ccff, 0.35);
    this.bgBar.strokeRoundedRect(0, 0, columnWidth, columnHeight, 14);

    // Les positions des éléments sont calculées relativement au container
    // donc elles restent correctes même après repositionnement
  }

  update(money, lives, currentWave, totalWaves) {
    if (this.scene.txtMoney) this.scene.txtMoney.setText(`💰 ${money}`);
    if (this.scene.txtLives) this.scene.txtLives.setText(`❤️ ${lives}`);

    if (this.scene.txtWave) {
      this.scene.txtWave.setText(`🌊 ${currentWave}/${totalWaves}`);
    }
  }

  updateTimer(elapsedMs) {
    if (this.scene.txtTimer) {
      this.scene.txtTimer.setText(`⏱️ ${formatMsToTimer(elapsedMs)}`);
    }
  }
}
