import { Enemy } from "../../objects/Enemy.js";
import { SpawnWaveControls } from "./SpawnWaveControls.js";
import { CONFIG } from "../../config/settings.js";
import { recordLevelCompletion } from "../../services/authManager.js";
import { showGameResult } from "../../vue/bridge.js";

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
    const totalWaves = this.scene.levelConfig?.waves?.length || 0;
    const hasMoreWaves = this.scene.currentWaveIndex < totalWaves;

    // --- CORRECTION 1 : On autorise le lancement si c'est une anticipation ---
    const isAnticipating = this.scene.isWaveRunning && !this.scene.canCallNextWave;
    
    if (!hasMoreWaves) return;
    if (this.scene.isPaused) return;

    // Nettoyage du timer de fin de vague (IMPORTANT : toujours le faire en premier)
    if (this.scene.endCheckTimer) {
        this.scene.endCheckTimer.remove();
        this.scene.endCheckTimer = null;
    }

    // Si on anticipe, on donne un bonus d'or immédiat !
    if (isAnticipating) {
        const bonus = 50; // Ou un calcul basé sur le temps restant
        this.scene.earnMoney?.(bonus);
        // On ne fait PAS de return, on continue pour lancer la vague suivante
    } else {
        // Si ce n'est PAS une anticipation (vague normale), on nettoie les anciens timers
        if (this.scene.waveSpawnTimers) {
            this.scene.waveSpawnTimers.forEach(t => t.remove());
        }
        this.scene.waveSpawnTimers = [];
    }

    // Nettoyage du timer auto (toujours le faire)
    if (this.scene.nextWaveAutoTimer) {
        this.scene.nextWaveAutoTimer.remove();
        this.scene.nextWaveAutoTimer = null;
        this.scene.nextWaveCountdown = 0;
    }

    // --- CORRECTION 2 : Gestion des états ---
    this.scene.isWaveRunning = true;
    this.scene.hasWaveFinishedSpawning = false;
    this.scene.canCallNextWave = false;
    this.scene.activeWaveIndex = this.scene.currentWaveIndex;
    
    // Démarrer le chronomètre si ce n'est pas déjà fait
    if (!this.scene.isTimerRunning) {
      this.scene.startSessionTimer();
    }
    
    // On ne locke le bouton QUE s'il n'y a plus de vagues après celle-ci
    const isLastWave = (this.scene.currentWaveIndex + 1) >= totalWaves;
    this.spawnControls?.setLockedState(isLastWave); 
    
    this.spawnControls?.clearCountdown();
    this.spawnControls?.updateWaveRunningState();

    const waveIndex = this.scene.currentWaveIndex;
    const waveGroups = this.scene.levelConfig.waves[waveIndex];
    
    this.scene.currentWaveIndex++;
    this.scene.updateUI();

    let totalEnemiesInWave = 0;
    let spawnedTotal = 0;
    waveGroups.forEach((g) => (totalEnemiesInWave += g.count));

    this.scene.runTracker.startWave(waveIndex, {
      earlyLaunch: isAnticipating,
      expectedEnemies: totalEnemiesInWave,
    });

    // Compteur pour équilibrer la répartition entre les chemins
    const pathCounts = new Array(this.scene.paths.length).fill(0);

    waveGroups.forEach((group) => {
        const delayBeforeStart = group.startDelay || 0;

        const startDelayTimer = this.scene.time.addEvent({
            delay: delayBeforeStart,
            callback: () => {
                if (this.scene.isPaused) return;

                const spawnLoopTimer = this.scene.time.addEvent({
                    delay: group.interval,
                    repeat: group.count - 1,
                    callback: () => {
                        if (this.scene.isPaused) return;

                        // Choisir le chemin de manière équilibrée
                        let selectedPathIndex = 0;
                        if (this.scene.paths.length > 1) {
                            // Trouver le chemin avec le moins d'ennemis spawnés
                            let minCount = pathCounts[0];
                            let minIndex = 0;
                            for (let i = 1; i < pathCounts.length; i++) {
                                if (pathCounts[i] < minCount) {
                                    minCount = pathCounts[i];
                                    minIndex = i;
                                }
                            }
                            // Si la différence est trop grande (>40%), choisir aléatoirement parmi les moins utilisés
                            const maxCount = Math.max(...pathCounts);
                            if (maxCount > 0 && (maxCount - minCount) / maxCount > 0.4) {
                                // Trouver tous les chemins avec un compte proche du minimum
                                const candidates = [];
                                for (let i = 0; i < pathCounts.length; i++) {
                                    if (pathCounts[i] <= minCount + 1) {
                                        candidates.push(i);
                                    }
                                }
                                selectedPathIndex = Phaser.Utils.Array.GetRandom(candidates);
                            } else {
                                selectedPathIndex = minIndex;
                            }
                        }
                        
                        const selectedPath = this.scene.paths[selectedPathIndex];
                        pathCounts[selectedPathIndex]++;
                        
                        const enemy = new Enemy(this.scene, selectedPath, group.type);
                        enemy.waveIndex = waveIndex;
                        enemy.spawn();
                        this.scene.enemies.add(enemy);
                        this.scene.runTracker.onEnemySpawn(waveIndex, group.type);
                        spawnedTotal++;

                        // Quand CETTE vague précise a fini de spawner
                        if (spawnedTotal >= totalEnemiesInWave) {
                            // On vérifie s'il y en a encore d'autres après
                            const stillMoreWaves = this.scene.currentWaveIndex < totalWaves;
                            this.scene.canCallNextWave = stillMoreWaves;
                            this.scene.hasWaveFinishedSpawning = true;
                            
                            this.spawnControls?.setLockedState(!stillMoreWaves);
                            this.spawnControls?.updateWaveRunningState();
                            
                            // On ne lance le monitor qu'une fois
                            if (!this.scene.endCheckTimer) {
                                this.monitorWaveEnd();
                            }
                        }
                    },
                });
                this.scene.waveSpawnTimers.push(spawnLoopTimer);
            },
        });
        this.scene.waveSpawnTimers.push(startDelayTimer);
    });
}

  monitorWaveEnd() {
    // Ne pas créer un nouveau timer si un existe déjà
    if (this.scene.endCheckTimer) {
      return;
    }
    
    this.scene.endCheckTimer = this.scene.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        // Ne pas vérifier si le jeu est en pause
        if (this.scene.isPaused) return;

        const enemiesCount = this.scene.enemies?.getLength?.() || 0;
        if (enemiesCount === 0 && this.scene.hasWaveFinishedSpawning) {
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
    this.scene.hasWaveFinishedSpawning = false;
    this.scene.canCallNextWave = false;

    this.scene.wavesCompleted = Math.max(
      this.scene.wavesCompleted,
      this.scene.currentWaveIndex
    );
    const finishedWaveIndex =
      this.scene.activeWaveIndex ?? Math.max(0, this.scene.currentWaveIndex - 1);
    this.scene.runTracker.endWave(finishedWaveIndex);
    this.scene.activeWaveIndex = null;
    const completedWaveNumber = this.scene.wavesCompleted;
    this.scene.earnMoney(50 + completedWaveNumber * 20);

    // Mettre à jour l'affichage de la vague
    this.scene.updateUI();

    if (this.scene.wavesCompleted >= this.scene.levelConfig.waves.length) {
      if (this.scene?.levelComplete) {
        this.scene.levelComplete();
      } else {
        this.levelComplete();
      }
    } else {
      this.spawnControls?.setLockedState(false);
      this.spawnControls?.updateWaveRunningState();
      // Démarrer le timer automatique de 30 secondes
      this.startNextWaveCountdown();
    }
  }

  startNextWaveCountdown() {
    if (
      !this.scene.levelConfig?.waves ||
      this.scene.currentWaveIndex >= this.scene.levelConfig.waves.length
    ) {
      return;
    }

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

  async levelComplete() {
    this.spawnControls?.destroy();
    this.scene.spawnControls = null;
    this.spawnControls = null;

    // Ne pas enregistrer de completion si le joueur a perdu toutes ses vies
    if (this.scene.lives <= 0) {
      return;
    }

    // Préparer les requêtes
    const heroKillReport = this.scene?.reportHeroKillsOnce
      ? this.scene.reportHeroKillsOnce()
      : null;

    const completionPayload = {
      levelId: this.scene.levelID,
      completionTimeMs: Math.round(this.scene.elapsedTimeMs || 0),
      livesRemaining: this.scene.lives,
      wavesCompleted: this.scene.wavesCompleted,
      moneyEarned: this.scene.money,
      starsEarned: this.scene.lives === CONFIG.STARTING_LIVES ? 3 : 1,
      isPerfectRun: this.scene.lives === CONFIG.STARTING_LIVES,
    };

    // Exécuter les requêtes immédiatement et attendre leur complétion
    const requests = [];
    if (completionPayload) {
      requests.push(recordLevelCompletion(completionPayload));
    }
    if (heroKillReport) {
      requests.push(heroKillReport);
    }

    // Attendre que toutes les requêtes soient terminées (succès ou échec)
    if (requests.length > 0) {
      await Promise.allSettled(requests);
    }

    // Désactiver les boutons pause et quitter
    if (this.scene.pauseBtn) {
      this.scene.pauseBtn.disableInteractive();
      this.scene.pauseBtn.setAlpha(0.5);
    }
    if (this.scene.quitBtn) {
      this.scene.quitBtn.disableInteractive();
      this.scene.quitBtn.setAlpha(0.5);
    }

    // Utiliser le composant Vue pour afficher la victoire
    showGameResult(
      "victory",
      "Félicitations ! Vous avez terminé le niveau avec succès.",
      () => {
        this.scene.scene.start("MainMenuScene");
      }
    );
  }
}
