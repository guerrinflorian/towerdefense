import { Enemy } from "../../objects/Enemy.js";

export class WaveManager {
  constructor(scene) {
    this.scene = scene;
  }

  startWave() {
    if (this.scene.isWaveRunning) return;
    if (this.scene.currentWaveIndex >= this.scene.levelConfig.waves.length) return;
    
    this.scene.isWaveRunning = true;
    this.scene.waveBtnText.setText("⚠️ EN COURS");
    this.scene.waveBtnBg.setStrokeStyle(3, 0xffaa00);
    
    const waveGroups = this.scene.levelConfig.waves[this.scene.currentWaveIndex];
    let totalEnemiesInWave = 0;
    let spawnedTotal = 0;
    
    waveGroups.forEach((g) => (totalEnemiesInWave += g.count));
    
    waveGroups.forEach((group) => {
      this.scene.time.addEvent({
        delay: group.interval,
        repeat: group.count - 1,
        callback: () => {
          const randomPath = Phaser.Utils.Array.GetRandom(this.scene.paths);
          const enemy = new Enemy(this.scene, randomPath, group.type);
          enemy.setDepth(10);
          enemy.setScale(this.scene.scaleFactor);
          enemy.spawn();
          this.scene.enemies.add(enemy);
          spawnedTotal++;
          if (spawnedTotal >= totalEnemiesInWave) {
            this.monitorWaveEnd();
          }
        },
      });
    });
  }

  monitorWaveEnd() {
    this.scene.endCheckTimer = this.scene.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        if (this.scene.enemies.getLength() === 0) {
          this.finishWave();
        }
      },
    });
  }

  finishWave() {
    if (this.scene.endCheckTimer) {
      this.scene.endCheckTimer.remove();
    }
    this.scene.isWaveRunning = false;
    this.scene.currentWaveIndex++;
    this.scene.earnMoney(50 + this.scene.currentWaveIndex * 20);
    
    if (this.scene.currentWaveIndex >= this.scene.levelConfig.waves.length) {
      this.levelComplete();
    } else {
      this.scene.waveBtnText.setText(`▶ VAGUE ${this.scene.currentWaveIndex + 1}`);
      this.scene.waveBtnBg.setStrokeStyle(3, 0x00ff00);
    }
  }

  levelComplete() {
    const currentSaved = parseInt(localStorage.getItem("levelReached")) || 1;
    if (this.scene.levelID >= currentSaved) {
      localStorage.setItem("levelReached", this.scene.levelID + 1);
    }
    
    const bg = this.scene.add
      .rectangle(
        this.scene.gameWidth / 2,
        this.scene.gameHeight / 2,
        500 * this.scene.scaleFactor,
        300 * this.scene.scaleFactor,
        0x000000,
        0.9
      )
      .setDepth(200);
      
    const txt = this.scene.add
      .text(this.scene.gameWidth / 2, this.scene.gameHeight / 2 - 30 * this.scene.scaleFactor, "VICTOIRE !", {
        fontSize: `${Math.max(30, 50 * this.scene.scaleFactor)}px`,
        color: "#00ff00",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(201);
      
    const sub = this.scene.add
      .text(this.scene.gameWidth / 2, this.scene.gameHeight / 2 + 50 * this.scene.scaleFactor, "Continuer", {
        fontSize: `${Math.max(16, 24 * this.scene.scaleFactor)}px`,
      })
      .setOrigin(0.5)
      .setDepth(201);
      
    bg.setInteractive({ useHandCursor: true }).on("pointerdown", () =>
      this.scene.scene.start("MainMenuScene")
    );
  }
}
