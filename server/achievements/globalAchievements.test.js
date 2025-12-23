import test from "node:test";
import assert from "node:assert/strict";

// Empêcher server/db.js de throw si DATABASE_URL est absent (pool jamais utilisé ici)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgres://fake:fake@localhost:5432/fake";
}

const { evaluateGlobalAchievements } = await import("./globalAchievements.js");

class FakeDb {
  constructor() {
    this.achievements = [
      { id: 1, code_name: "GLOBAL_FIRST_WIN", title: "First Win" },
    ];
    this.progress = new Map();
    this.updates = [];
  }

  async query(text, params = []) {
    if (text.includes("FROM achievements_ref")) {
      return { rows: this.achievements };
    }

    if (text.includes("FROM player_achievement_progress")) {
      const [, achievementIds = []] = params;
      const rows = [];
      for (const id of achievementIds) {
        if (this.progress.has(id)) {
          rows.push(this.progress.get(id));
        }
      }
      return { rows };
    }

    if (text.startsWith("UPDATE player_achievement_progress")) {
      const [playerId, achievementId, currentValue, isUnlocked, runId] = params;
      this.progress.set(achievementId, {
        achievement_id: achievementId,
        current_value: currentValue,
        is_unlocked: isUnlocked,
        last_increment: 0,
        player_id: playerId,
      });
      this.updates.push({
        playerId,
        achievementId,
        currentValue,
        isUnlocked,
        runId,
      });
      return { rows: [], rowCount: 1 };
    }

    throw new Error(`Unexpected query in FakeDb: ${text}`);
  }
}

test("GLOBAL_FIRST_WIN passe à is_unlocked=true après une victoire", async () => {
  const db = new FakeDb();
  const runReport = {
    runId: "test-run-win",
    result: "WIN",
    reasonEnd: "level_complete",
    durationMs: 12_345,
    stats: { base: { livesLost: 0, livesEnd: 20 } },
  };

  const { progress, unlocked } = await evaluateGlobalAchievements(
    42,
    runReport,
    db
  );

  const firstWinProgress = progress.find(
    (p) => p.code_name === "GLOBAL_FIRST_WIN"
  );

  assert.ok(firstWinProgress, "Le progrès GLOBAL_FIRST_WIN est bien renvoyé");
  assert.equal(
    firstWinProgress.is_unlocked,
    true,
    "L'achievement doit être marqué comme débloqué"
  );
  assert.equal(
    firstWinProgress.current_value,
    1,
    "La valeur courante doit refléter la victoire"
  );
  assert.deepEqual(
    unlocked.map((u) => u.code_name),
    ["GLOBAL_FIRST_WIN"],
    "La victoire débloque GLOBAL_FIRST_WIN"
  );

  assert.equal(
    db.updates.at(-1)?.isUnlocked,
    true,
    "L'état en base reçoit un déblocage"
  );
});
