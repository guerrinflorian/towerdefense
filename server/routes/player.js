import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { query } from "../db.js";
import { buildPlayerProfile, recordLevelCompletion } from "../utils/profile.js";

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

export default router;
