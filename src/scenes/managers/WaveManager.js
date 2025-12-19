import { Enemy } from "../../objects/Enemy.js";
import { SpawnWaveControls } from "./SpawnWaveControls.js";

export class WaveManager {
  constructor(scene) {
    this.scene = scene;
    this.spawnControls = null;
  }

  initSpawnControls() {
    this.spawnControls = new SpawnWaveControls(this.scene);
    this.scene.spawnControls = this.spawnControls;
    this.spawnControls.create();
  }

  getNextWaveSummary() {
    const wave =
      this.scene.levelConfig?.waves?.[this.scene.currentWaveIndex] || null;
    if (!wave) return [];

    const counts = {};
    wave.forEach((group) => {
      if (!group?.type || !group.count) return;
      counts[group.type] = (counts[group.type] || 0) + group.count;
    });

    return Object.entries(counts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }

  startWave() {
    // 1. Vérifications de sécurité
    if (this.scene.isWaveRunning) return;
    if (this.scene.currentWaveIndex >= this.scene.levelConfig.waves.length)
      return;
    if (this.scene.isPaused) return;

    // 2. Nettoyage (Timer Auto et Timers de spawn précédents)
    if (this.scene.nextWaveAutoTimer) {
      this.scene.nextWaveAutoTimer.remove();
      this.scene.nextWaveAutoTimer = null;
      this.scene.nextWaveCountdown = 0;
    }

    if (this.scene.waveSpawnTimers) {
      this.scene.waveSpawnTimers.forEach((timer) => {
        if (timer && !timer.hasDestroyed) timer.remove();
      });
    }
    // On réinitialise le tableau pour cette nouvelle vague
    this.scene.waveSpawnTimers = [];

    // 3. Initialisation de l'état de la vague
    this.scene.isWaveRunning = true;
    this.spawnControls?.setLockedState(true);
    this.spawnControls?.clearCountdown();
    this.spawnControls?.updateWaveRunningState();

    if (!this.scene.isTimerRunning) {
      this.scene.startSessionTimer();
    }

    const waveGroups =
      this.scene.levelConfig.waves[this.scene.currentWaveIndex];

    // Calcul du nombre total d'ennemis pour savoir quand la vague finit
    let totalEnemiesInWave = 0;
    let spawnedTotal = 0;
    waveGroups.forEach((g) => (totalEnemiesInWave += g.count));

    // 4. Lancement des groupes avec gestion du DÉLAI + INTERVALLE
    waveGroups.forEach((group) => {
      // Sécurité : si startDelay n'est pas défini dans le JSON, on met 0
      const delayBeforeStart = group.startDelay || 0;

      // TIMER A : Le délai initial avant que ce groupe ne commence
      const startDelayTimer = this.scene.time.addEvent({
        delay: delayBeforeStart,
        callback: () => {
          // Ce code s'exécute après le délai "startDelay"

          // Si le jeu est en pause au moment exact où le délai finit, on annule
          if (this.scene.isPaused) return;

          // TIMER B : La boucle de spawn des ennemis du groupe
          const spawnLoopTimer = this.scene.time.addEvent({
            delay: group.interval,
            repeat: group.count - 1, // repeat X fois + 1 exécution immédiate = count total
            callback: () => {
              // Vérification pause à chaque ennemi
              if (this.scene.isPaused) return;

              const randomPath = Phaser.Utils.Array.GetRandom(this.scene.paths);
              const enemy = new Enemy(this.scene, randomPath, group.type);

              enemy.setDepth(10);
              enemy.setScale(this.scene.scaleFactor);
              enemy.spawn();

              this.scene.enemies.add(enemy);
              spawnedTotal++;

              // Vérifier si c'était le tout dernier ennemi de TOUTE la vague
              if (spawnedTotal >= totalEnemiesInWave) {
                this.monitorWaveEnd();
              }
            },
          });

          // On ajoute le timer de boucle à la liste pour pouvoir le gérer (pause/fin)
          this.scene.waveSpawnTimers.push(spawnLoopTimer);
        },
      });

      // On ajoute le timer de délai à la liste aussi
      this.scene.waveSpawnTimers.push(startDelayTimer);
    });
  }

  monitorWaveEnd() {
    this.scene.endCheckTimer = this.scene.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        // Ne pas vérifier si le jeu est en pause
        if (this.scene.isPaused) return;

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

    // Mettre à jour l'affichage de la vague
    this.scene.updateUI();

    if (this.scene.currentWaveIndex >= this.scene.levelConfig.waves.length) {
      this.levelComplete();
    } else {
      this.spawnControls?.setLockedState(false);
      this.spawnControls?.updateWaveRunningState();
      // Démarrer le timer automatique de 30 secondes
      this.startNextWaveCountdown();
    }
  }

  startNextWaveCountdown() {
    // Annuler un timer existant si présent
    if (this.scene.nextWaveAutoTimer) {
      this.scene.nextWaveAutoTimer.remove();
    }

    this.scene.nextWaveCountdown = 30; // 30 secondes
    this.spawnControls?.showCountdown(this.scene.nextWaveCountdown);

    // Mettre à jour le bouton toutes les secondes
    this.scene.nextWaveAutoTimer = this.scene.time.addEvent({
      delay: 1000, // Toutes les secondes
      repeat: 30, // 30 fois
      callback: () => {
        // Ne pas décrémenter si le jeu est en pause
        if (this.scene.isPaused) return;

        this.scene.nextWaveCountdown--;
        this.spawnControls?.showCountdown(this.scene.nextWaveCountdown);

        // Si le compte à rebours arrive à 0, lancer automatiquement
        if (this.scene.nextWaveCountdown <= 0) {
          if (this.scene.nextWaveAutoTimer) {
            this.scene.nextWaveAutoTimer.remove();
            this.scene.nextWaveAutoTimer = null;
          }
          this.scene.nextWaveCountdown = 0;
          // Lancer la vague directement (pas via waveManager.startWave() pour éviter la récursion)
          this.startWave();
        }
      },
    });
  }

  levelComplete() {
    this.spawnControls?.destroy();
    this.scene.spawnControls = null;
    this.spawnControls = null;

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
      .text(
        this.scene.gameWidth / 2,
        this.scene.gameHeight / 2 - 30 * this.scene.scaleFactor,
        "VICTOIRE !",
        {
          fontSize: `${Math.max(30, 50 * this.scene.scaleFactor)}px`,
          color: "#00ff00",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5)
      .setDepth(201);

    const sub = this.scene.add
      .text(
        this.scene.gameWidth / 2,
        this.scene.gameHeight / 2 + 50 * this.scene.scaleFactor,
        "Continuer",
        {
          fontSize: `${Math.max(16, 24 * this.scene.scaleFactor)}px`,
        }
      )
      .setOrigin(0.5)
      .setDepth(201);

    bg.setInteractive({ useHandCursor: true }).on("pointerdown", () =>
      this.scene.scene.start("MainMenuScene")
    );
  }
}
