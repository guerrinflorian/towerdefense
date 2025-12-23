import { query } from "../db.js";
import { evaluateHeroAchievements } from "./heroAchievements.js";
import { evaluateEconomyAchievements } from "./economyAchievements.js";
import { evaluateTowerAchievements } from "./towerAchievements.js";
import { evaluateGlobalAchievements } from "./globalAchievements.js";
import { evaluateCombatAchievements } from "./combatAchievements.js";

function getDbExecutor(client) {
  if (client && typeof client.query === "function") {
    return client;
  }
  return { query };
}

export async function ensurePlayerAchievementRows(playerId, client = null) {
  const db = getDbExecutor(client);
  await db.query(
    `INSERT INTO player_achievement_progress (player_id, achievement_id)
     SELECT $1, a.id
     FROM achievements_ref a
     ON CONFLICT (player_id, achievement_id) DO NOTHING`,
    [playerId]
  );
}

export async function evaluateAchievementsFromRun(playerId, runReport, client = null) {
  const db = getDbExecutor(client);
  const heroResults = await evaluateHeroAchievements(playerId, runReport, db);
  const economyResults = await evaluateEconomyAchievements(playerId, runReport, db);
  const towerResults = await evaluateTowerAchievements(playerId, runReport, db);
  const globalResults = await evaluateGlobalAchievements(playerId, runReport, db);
  const combatResults = await evaluateCombatAchievements(playerId, runReport, db);

  return {
    unlocked: [
      ...(heroResults.unlocked || []),
      ...(economyResults.unlocked || []),
      ...(towerResults.unlocked || []),
      ...(globalResults.unlocked || []),
      ...(combatResults.unlocked || []),
    ],
    progress: [
      ...(heroResults.progress || []),
      ...(economyResults.progress || []),
      ...(towerResults.progress || []),
      ...(globalResults.progress || []),
      ...(combatResults.progress || []),
    ],
  };
}
