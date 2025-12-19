import { CONFIG } from "../../../../config/settings.js";

export class HUD {
  constructor(scene) {
    this.scene = scene;
  }

  create() {
    const s = this.scene.scaleFactor;

    const UI_HEIGHT = CONFIG.UI_HEIGHT * s;
    const fontSize = Math.max(16, 24 * s);
    const smallFontSize = Math.max(12, 18 * s);

    const topBar = this.scene.add.container(0, 0).setDepth(100);

    const bgBar = this.scene.add.graphics();
    bgBar.fillStyle(0x111111, 1);
    bgBar.fillRect(0, 0, this.scene.gameWidth, UI_HEIGHT);
    bgBar.fillStyle(0x00ccff, 0.5);
    bgBar.fillRect(0, UI_HEIGHT - 2 * s, this.scene.gameWidth, 2 * s);
    topBar.add(bgBar);

    this.scene.txtMoney = this.scene.add
      .text(20 * s, UI_HEIGHT / 2, "", {
        fontSize: `${fontSize}px`,
        fill: "#ffd700",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0, 0.5);
    topBar.add(this.scene.txtMoney);

    this.scene.txtLives = this.scene.add
      .text(250 * s, UI_HEIGHT / 2, "", {
        fontSize: `${fontSize}px`,
        fill: "#ff4444",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0, 0.5);
    topBar.add(this.scene.txtLives);

    this.scene.txtWave = this.scene.add
      .text(350 * s, UI_HEIGHT / 2, "", {
        fontSize: `${fontSize}px`,
        fill: "#00ccff",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0, 0.5);
    topBar.add(this.scene.txtWave);

    this.scene.pauseBtn = this.scene.add
      .text(600 * s, UI_HEIGHT / 2, "⏸️ PAUSE", {
        fontSize: `${smallFontSize}px`,
        fill: "#ffaa00",
        backgroundColor: "#333333",
        padding: { x: 10 * s, y: 5 * s },
        fontFamily: "Arial",
      })
      .setOrigin(0, 0.5)
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
      .text(this.scene.gameWidth - 20 * s, UI_HEIGHT / 2, "QUITTER", {
        fontSize: `${smallFontSize}px`,
        fill: "#aaaaaa",
        backgroundColor: "#333333",
        padding: { x: 10 * s, y: 5 * s },
        fontFamily: "Arial",
      })
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => quitBtn.setColor("#ffffff"))
      .on("pointerout", () => quitBtn.setColor("#aaaaaa"))
      .on("pointerdown", () => this.scene.scene.start("MainMenuScene"));
    topBar.add(quitBtn);

    this.update(this.scene.money, this.scene.lives, 1, 1);
  }

  update(money, lives, currentWave, totalWaves) {
    if (this.scene.txtMoney) this.scene.txtMoney.setText(`💰 ${money}`);
    if (this.scene.txtLives) this.scene.txtLives.setText(`❤️ ${lives}`);

    if (this.scene.txtWave) {
      this.scene.txtWave.setText(`🌊 VAGUE ${currentWave}/${totalWaves}`);
    }
  }
}
