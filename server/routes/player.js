import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { query } from "../db.js";
import { buildPlayerProfile, recordLevelCompletion } from "../utils/profile.js";
import { upgradeHeroStats } from "../utils/heroUpgrades.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/me", async (req, res) => {
  try {
    const profile = await buildPlayerProfile(req.user.id);
    if (!profile) {
      return res.status(404).json({ error: "Profil introuvable" });
    }
    return res.json(profile);
  } catch (err) {
    console.error("Erreur récupération profil:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/leaderboard", async (_req, res) => {
  try {
    const result = await query(
      `SELECT p.username,
              MAX(lc.level_id) AS max_level,
              COALESCE(SUM(20 - COALESCE(lc.lives_remaining, 20)), 0) AS total_lives_lost,
              COALESCE(SUM(lc.completion_time_ms), 0) AS total_time_ms
         FROM players p
         LEFT JOIN level_completions lc ON lc.player_id = p.id
        GROUP BY p.id, p.username
        HAVING MAX(lc.level_id) IS NOT NULL
        ORDER BY 
                 MAX(lc.level_id) DESC,
                 COALESCE(SUM(20 - COALESCE(lc.lives_remaining, 20)), 0) ASC,
                 COALESCE(SUM(lc.completion_time_ms), 0) ASC
        LIMIT 10`
    );

    return res.json({ entries: result.rows });
  } catch (err) {
    console.error("Erreur leaderboard:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/hero/kill", async (req, res) => {
  try {
    const updated = await query(
      "UPDATE players SET hero_points_available = hero_points_available + 1 WHERE id = $1 RETURNING hero_points_available",
      [req.user.id]
    );
    return res.json({ heroPointsAvailable: updated.rows[0].hero_points_available });
  } catch (err) {
    console.error("Erreur incrément point héros:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/levels/completion", async (req, res) => {
  const {
    levelId,
    completionTimeMs,
    livesRemaining,
    wavesCompleted,
    moneyEarned,
    starsEarned,
    isPerfectRun,
  } = req.body || {};

  if (!levelId || typeof levelId !== "number") {
    return res.status(400).json({ error: "levelId manquant ou invalide" });
  }

  try {
    const progress = await recordLevelCompletion(req.user.id, {
      levelId,
      completionTimeMs: completionTimeMs || 0,
      livesRemaining: livesRemaining ?? null,
      wavesCompleted: wavesCompleted ?? null,
      moneyEarned: moneyEarned ?? null,
      starsEarned: starsEarned ?? null,
      isPerfectRun: Boolean(isPerfectRun),
    });

    return res.json({ progress });
  } catch (err) {
    console.error("Erreur enregistrement niveau:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/hero/upgrade", async (req, res) => {
  const { stat, points } = req.body || {};

  try {
    const result = await upgradeHeroStats(req.user.id, { stat, points });
    const profile = await buildPlayerProfile(req.user.id);

    return res.json({
      message: "Amélioration appliquée",
      heroStats: result.heroStats,
      heroPointsAvailable: result.heroPointsAvailable,
      heroPointConversion: result.heroPointConversion,
      profile,
    });
  } catch (err) {
    if (err.code === "INVALID_POINTS") {
      return res.status(400).json({ error: "Nombre de points invalide" });
    }
    if (err.code === "INVALID_STAT") {
      return res.status(400).json({ error: "Statistique inconnue" });
    }
    if (err.code === "NOT_ENOUGH_POINTS") {
      return res.status(400).json({ error: "Points insuffisants" });
    }
    console.error("Erreur upgrade héros:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
