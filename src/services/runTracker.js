const getClientVersion = () => {
  if (typeof process !== "undefined") {
    return process.env.npm_package_version || process.env.APP_VERSION || null;
  }
  return null;
};

const generateRunId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `run-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
};

const cloneKillsBySource = () => ({
  hero: 0,
  turret: 0,
  soldier: 0,
  spell: 0,
  other: 0,
});

export class RunTracker {
  constructor() {
    this.reset();
  }

  reset() {
    this.activeWaveIndex = null;
    this.state = {
      started: false,
      ended: false,
      activeEnemies: 0,
      activeTowers: 0,
      activeSoldiers: 0,
      heroKillStreak: 0,
      currentGold: 0,
    };

    this.report = {
      runId: generateRunId(),
      clientVersion: getClientVersion(),
      startedAt: null,
      endedAt: null,
      durationMs: 0,
      level: {
        id: null,
        name: null,
        biome: null,
        difficulty: null,
        seed: null,
        totalWaves: 0,
      },
      result: null,
      reasonEnd: null,
      stats: {
        enemies: {
          spawned: 0,
          killed: 0,
          leaked: 0,
          killedBySource: cloneKillsBySource(),
        },
        hero: {
          deaths: 0,
          bestKillStreak: 0,
        },
        base: {
          livesStart: 0,
          livesEnd: 0,
          livesLost: 0,
          damageEvents: 0,
        },
        economy: {
          gold: {
            start: 0,
            earned: 0,
            spent: 0,
            final: 0,
          },
        },
        towers: {
          built: 0,
          sold: 0,
          upgrades: 0,
          maxed: 0,
          byType: {},
        },
        soldiers: {
          spawned: 0,
          deaths: 0,
          kills: 0,
        },
        wavesCompleted: 0,
        maxSimultaneous: {
          towersAlive: 0,
          enemiesAlive: 0,
          soldiersAlive: 0,
        },
        flags: {
          noSells: true,
          heroNeverDied: true,
          baseIntact: true,
        },
        notes: [
          "TODO: instrument per-source damage dealt/taken when damage events are exposed",
        ],
      },
      waves: [],
    };
  }

  startRun({
    levelId,
    levelName,
    biome,
    difficulty,
    seed,
    startingMoney = 0,
    startingLives = 0,
    totalWaves = 0,
  }) {
    this.reset();
    this.state.started = true;
    this.report.startedAt = Date.now();
    this.report.level = {
      id: levelId ?? null,
      name: levelName ?? null,
      biome: biome ?? null,
      difficulty: difficulty ?? null,
      seed: seed ?? null,
      totalWaves: totalWaves ?? 0,
    };
    this.report.stats.base.livesStart = startingLives || 0;
    this.report.stats.base.livesEnd = startingLives || 0;
    this.report.stats.base.livesLost = 0;
    this.report.stats.economy.gold.start = startingMoney || 0;
    this.report.stats.economy.gold.final = startingMoney || 0;
    this.state.currentGold = startingMoney || 0;
  }

  ensureWave(index) {
    if (index === null || index === undefined || index < 0) return null;
    if (!this.report.waves[index]) {
      this.report.waves[index] = {
        index,
        startedAt: null,
        endedAt: null,
        durationMs: 0,
        earlyLaunch: false,
        enemies: {
          expected: 0,
          spawned: 0,
          killed: 0,
          leaked: 0,
          killedBySource: cloneKillsBySource(),
        },
        economy: {
          earned: 0,
          spent: 0,
          finalGold: null,
        },
        builds: {
          towersPlaced: {},
          upgrades: 0,
          sold: 0,
        },
        soldiers: {
          spawned: 0,
          deaths: 0,
          kills: 0,
        },
      };
    }
    return this.report.waves[index];
  }

  startWave(index, { earlyLaunch = false, expectedEnemies = 0 } = {}) {
    const wave = this.ensureWave(index);
    if (!wave) return;
    this.activeWaveIndex = index;
    if (!wave.startedAt) wave.startedAt = Date.now();
    wave.earlyLaunch = wave.earlyLaunch || earlyLaunch;
    wave.enemies.expected = Math.max(wave.enemies.expected || 0, expectedEnemies || 0);
  }

  endWave(index) {
    const wave = this.ensureWave(index);
    if (!wave) return;
    if (!wave.startedAt) {
      wave.startedAt = this.report.startedAt;
    }
    if (!wave.endedAt) {
      wave.endedAt = Date.now();
      wave.durationMs = wave.endedAt - wave.startedAt;
    }
    this.report.stats.wavesCompleted = Math.max(
      this.report.stats.wavesCompleted,
      index + 1
    );
    if (this.activeWaveIndex === index) {
      this.activeWaveIndex = null;
    }
  }

  onGoldEarned(amount = 0, meta = {}) {
    if (!Number.isFinite(amount)) return;
    this.report.stats.economy.gold.earned += amount;
    this.state.currentGold += amount;
    this.report.stats.economy.gold.final = this.state.currentGold;
    if (this.activeWaveIndex !== null) {
      const wave = this.ensureWave(this.activeWaveIndex);
      if (wave) {
        wave.economy.earned += amount;
        wave.economy.finalGold = this.state.currentGold;
      }
    }
    if (meta.source === "sell") {
      this.report.stats.flags.noSells = false;
    }
  }

  onGoldSpent(amount = 0) {
    if (!Number.isFinite(amount)) return;
    this.report.stats.economy.gold.spent += amount;
    this.state.currentGold -= amount;
    this.report.stats.economy.gold.final = this.state.currentGold;
    if (this.activeWaveIndex !== null) {
      const wave = this.ensureWave(this.activeWaveIndex);
      if (wave) {
        wave.economy.spent += amount;
        wave.economy.finalGold = this.state.currentGold;
      }
    }
  }

  onEnemySpawn(waveIndex, typeKey) {
    this.report.stats.enemies.spawned += 1;
    this.state.activeEnemies += 1;
    this.report.stats.maxSimultaneous.enemiesAlive = Math.max(
      this.report.stats.maxSimultaneous.enemiesAlive,
      this.state.activeEnemies
    );

    const wave = this.ensureWave(waveIndex ?? this.activeWaveIndex);
    if (wave) {
      wave.enemies.spawned += 1;
    }
  }

  onEnemyKill({ source = "other", waveIndex = null } = {}) {
    this.report.stats.enemies.killed += 1;
    this.state.activeEnemies = Math.max(0, this.state.activeEnemies - 1);
    if (!this.report.stats.enemies.killedBySource[source]) {
      source = "other";
    }
    this.report.stats.enemies.killedBySource[source] += 1;

    const wave = this.ensureWave(waveIndex ?? this.activeWaveIndex);
    if (wave) {
      wave.enemies.killed += 1;
      wave.enemies.killedBySource[source] += 1;
    }

    if (source === "hero") {
      this.state.heroKillStreak += 1;
      this.report.stats.hero.bestKillStreak = Math.max(
        this.report.stats.hero.bestKillStreak,
        this.state.heroKillStreak
      );
    }
    if (source === "soldier") {
      this.report.stats.soldiers.kills += 1;
      if (wave) {
        wave.soldiers.kills += 1;
      }
    }
  }

  onEnemyLeak({ waveIndex = null } = {}) {
    this.report.stats.enemies.leaked += 1;
    this.state.activeEnemies = Math.max(0, this.state.activeEnemies - 1);
    const wave = this.ensureWave(waveIndex ?? this.activeWaveIndex);
    if (wave) {
      wave.enemies.leaked += 1;
    }
  }

  onHeroDeath() {
    this.report.stats.hero.deaths += 1;
    this.report.stats.flags.heroNeverDied = false;
    this.state.heroKillStreak = 0;
  }

  onBaseDamage({ amount = 0, livesRemaining = 0, livesLost = 0 } = {}) {
    this.report.stats.base.damageEvents += 1;
    this.report.stats.base.livesEnd = livesRemaining;
    this.report.stats.base.livesLost += livesLost;
    if (livesLost > 0) {
      this.report.stats.flags.baseIntact = false;
    }
    // TODO: expose exact damage intake per source when available
  }

  onTowerBuild({ key, level = 1 } = {}) {
    this.report.stats.towers.built += 1;
    this.state.activeTowers += 1;
    this.report.stats.maxSimultaneous.towersAlive = Math.max(
      this.report.stats.maxSimultaneous.towersAlive,
      this.state.activeTowers
    );
    if (key) {
      this.report.stats.towers.byType[key] =
        (this.report.stats.towers.byType[key] || 0) + 1;
    }

    const wave = this.ensureWave(this.activeWaveIndex);
    if (wave && key) {
      wave.builds.towersPlaced[key] = (wave.builds.towersPlaced[key] || 0) + 1;
    }
  }

  onTowerUpgrade({ key, level = 0, maxLevel = null } = {}) {
    this.report.stats.towers.upgrades += 1;
    const wave = this.ensureWave(this.activeWaveIndex);
    if (wave) {
      wave.builds.upgrades += 1;
    }
    if (maxLevel && level >= maxLevel) {
      this.report.stats.towers.maxed += 1;
    }
  }

  onTowerSell({ key } = {}) {
    this.report.stats.towers.sold += 1;
    this.report.stats.flags.noSells = false;
    this.state.activeTowers = Math.max(0, this.state.activeTowers - 1);
    const wave = this.ensureWave(this.activeWaveIndex);
    if (wave) {
      wave.builds.sold += 1;
    }
    if (key && this.report.stats.towers.byType[key]) {
      this.report.stats.towers.byType[key] = Math.max(
        0,
        this.report.stats.towers.byType[key] - 1
      );
    }
  }

  onSoldierSpawn() {
    this.report.stats.soldiers.spawned += 1;
    this.state.activeSoldiers += 1;
    this.report.stats.maxSimultaneous.soldiersAlive = Math.max(
      this.report.stats.maxSimultaneous.soldiersAlive,
      this.state.activeSoldiers
    );
    const wave = this.ensureWave(this.activeWaveIndex);
    if (wave) {
      wave.soldiers.spawned += 1;
    }
  }

  onSoldierDeath() {
    this.report.stats.soldiers.deaths += 1;
    this.state.activeSoldiers = Math.max(0, this.state.activeSoldiers - 1);
    const wave = this.ensureWave(this.activeWaveIndex);
    if (wave) {
      wave.soldiers.deaths += 1;
    }
  }

  onSoldiersRemoved(count = 1) {
    const removal = Math.max(0, count);
    this.state.activeSoldiers = Math.max(
      0,
      this.state.activeSoldiers - removal
    );
  }

  endRun({ result, reasonEnd, finalGold, livesRemaining, elapsedMs } = {}) {
    if (this.state.ended || !this.state.started) return null;
    this.state.ended = true;

    this.report.result = result || this.report.result;
    this.report.reasonEnd = reasonEnd || this.report.reasonEnd;
    this.report.endedAt = Date.now();
    this.report.durationMs = this.report.startedAt
      ? this.report.endedAt - this.report.startedAt
      : elapsedMs || 0;

    if (Number.isFinite(finalGold)) {
      this.report.stats.economy.gold.final = finalGold;
      this.state.currentGold = finalGold;
    }
    if (Number.isFinite(livesRemaining)) {
      this.report.stats.base.livesEnd = livesRemaining;
      this.report.stats.base.livesLost = Math.max(
        0,
        (this.report.stats.base.livesStart || 0) - livesRemaining
      );
    }

    // Fermer les vagues ouvertes
    this.report.waves.forEach((wave) => {
      if (wave && !wave.endedAt) {
        wave.endedAt = this.report.endedAt;
        wave.durationMs = wave.startedAt
          ? wave.endedAt - wave.startedAt
          : 0;
      }
    });

    return this.report;
  }

  hasEnded() {
    return this.state.ended;
  }
}
