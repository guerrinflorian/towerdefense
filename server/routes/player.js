import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { query } from "../db.js";
import { buildPlayerProfile, recordLevelCompletion, ensureHeroStats } from "../utils/profile.js";
import { upgradeHeroStats, upgradeHeroStatsBatch } from "../utils/heroUpgrades.js";
import { HERO_BASE_STATS } from "../constants.js";

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

async function getGlobalLeaderboard() {
    const result = await query(
      `WITH ranked_runs AS (
          SELECT 
            lc.level_id,
            lc.player_id,
            p.username,
            (20 - COALESCE(lc.lives_remaining, 20)) AS lives_lost,
            lc.completion_time_ms,
            ROW_NUMBER() OVER (
              PARTITION BY lc.level_id, lc.player_id 
              ORDER BY (20 - COALESCE(lc.lives_remaining, 20)), lc.completion_time_ms, lc.created_at
            ) AS player_rank
          FROM level_completions lc
          JOIN players p ON p.id = lc.player_id
        ),
        best_per_level AS (
          SELECT 
            player_id,
            username,
            level_id,
            lives_lost,
            completion_time_ms
          FROM ranked_runs
          WHERE player_rank = 1
        )
        SELECT 
          username,
          MAX(level_id) AS max_level,
          COALESCE(SUM(lives_lost), 0) AS total_lives_lost,
          COALESCE(SUM(completion_time_ms), 0) AS total_time_ms
        FROM best_per_level
        GROUP BY player_id, username
        ORDER BY 
          MAX(level_id) DESC,
          COALESCE(SUM(lives_lost), 0) ASC,
          COALESCE(SUM(completion_time_ms), 0) ASC
        LIMIT 10`
    );

  return result.rows;
}

async function getAchievementsLeaderboard() {
  const result = await query(
    `SELECT 
        p.username,
        COUNT(*) FILTER (WHERE pap.is_unlocked) AS unlocked_count,
        MAX(pap.unlocked_at) FILTER (WHERE pap.is_unlocked) AS last_unlocked_at
     FROM players p
     LEFT JOIN player_achievement_progress pap
       ON pap.player_id = p.id AND pap.is_unlocked = TRUE
     GROUP BY p.id, p.username
     HAVING COUNT(*) FILTER (WHERE pap.is_unlocked) > 0
     ORDER BY unlocked_count DESC, last_unlocked_at ASC NULLS LAST, p.username ASC
     LIMIT 10`
  );

  return result.rows.map((row) => ({
    username: row.username,
    unlocked_count: Number(row.unlocked_count || 0),
    last_unlocked_at: row.last_unlocked_at,
  }));
}

router.get("/leaderboard", async (_req, res) => {
  try {
    const entries = await getGlobalLeaderboard();
    return res.json({ entries });
  } catch (err) {
    console.error("Erreur leaderboard:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/leaderboard/global", async (_req, res) => {
  try {
    const entries = await getGlobalLeaderboard();
    return res.json({ entries });
  } catch (err) {
    console.error("Erreur leaderboard global:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/leaderboard/heroes", async (_req, res) => {
  try {
    const result = await query(
      `SELECT 
          p.username,
          COALESCE(hs.max_hp, $1::INT) AS max_hp,
          COALESCE(hs.base_damage, $2::NUMERIC) AS base_damage,
          COALESCE(hs.move_speed, $3::INT) AS move_speed,
          (COALESCE(hs.max_hp, $1::INT) + COALESCE(hs.base_damage, $2::NUMERIC) + COALESCE(hs.move_speed, $3::INT)) AS hero_score
        FROM players p
        LEFT JOIN hero_stats hs ON hs.player_id = p.id
        ORDER BY hero_score DESC, max_hp DESC, base_damage DESC, move_speed DESC
        LIMIT 10`,
      [HERO_BASE_STATS.max_hp, HERO_BASE_STATS.base_damage, HERO_BASE_STATS.move_speed]
    );

    return res.json({ entries: result.rows });
  } catch (err) {
    console.error("Erreur leaderboard héros:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/leaderboard/achievements", async (_req, res) => {
  try {
    const entries = await getAchievementsLeaderboard();
    return res.json({ entries });
  } catch (err) {
    console.error("Erreur leaderboard succès:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/leaderboard/levels", async (_req, res) => {
  try {
    const result = await query(
      `WITH ranked_runs AS (
          SELECT 
            lc.level_id,
            lc.player_id,
            p.username,
            (20 - COALESCE(lc.lives_remaining, 20)) AS lives_lost,
            lc.completion_time_ms,
            lc.created_at,
            ROW_NUMBER() OVER (
              PARTITION BY lc.level_id, lc.player_id 
              ORDER BY (20 - COALESCE(lc.lives_remaining, 20)), lc.completion_time_ms, lc.created_at
            ) AS player_rank
          FROM level_completions lc
          JOIN players p ON p.id = lc.player_id
        ),
        best_per_player AS (
          SELECT *
          FROM ranked_runs
          WHERE player_rank = 1
        ),
        ranked_levels AS (
          SELECT 
            level_id,
            username,
            lives_lost,
            completion_time_ms,
            created_at,
            ROW_NUMBER() OVER (
              PARTITION BY level_id 
              ORDER BY lives_lost, completion_time_ms, created_at
            ) AS level_rank
          FROM best_per_player
        )
        SELECT level_id, username, lives_lost, completion_time_ms, created_at
        FROM ranked_levels
        WHERE level_rank <= 10
        ORDER BY level_id, level_rank`
    );

    const grouped = result.rows.reduce((acc, row) => {
      const levelId = Number(row.level_id);
      if (!acc[levelId]) acc[levelId] = [];
      acc[levelId].push({
        username: row.username,
        lives_lost: Number(row.lives_lost),
        completion_time_ms: Number(row.completion_time_ms || 0),
        created_at: row.created_at,
      });
      return acc;
    }, {});

    const levels = Object.keys(grouped)
      .map((levelId) => ({
        levelId: Number(levelId),
        entries: grouped[levelId],
      }))
      .sort((a, b) => a.levelId - b.levelId);

    return res.json({ levels });
  } catch (err) {
    console.error("Erreur leaderboard niveaux:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/levels/best", async (req, res) => {
  try {
    const result = await query(
      `WITH ranked AS (
        SELECT 
          lc.level_id,
          (20 - COALESCE(lc.lives_remaining, 20)) AS lives_lost,
          lc.completion_time_ms,
          lc.created_at,
          ROW_NUMBER() OVER (
            PARTITION BY lc.level_id 
            ORDER BY (20 - COALESCE(lc.lives_remaining, 20)), lc.completion_time_ms, lc.created_at
          ) AS rn
        FROM level_completions lc
        WHERE lc.player_id = $1
      )
      SELECT level_id, lives_lost, completion_time_ms, created_at
      FROM ranked
      WHERE rn = 1
      ORDER BY level_id`,
      [req.user.id]
    );

    return res.json({ entries: result.rows });
  } catch (err) {
    console.error("Erreur meilleures performances niveaux:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/hero/kill", async (req, res) => {
  try {
    const kills = Number.isInteger(req.body?.kills) && req.body.kills >= 0 ? req.body.kills : 0;
    
    // Mettre à jour les points disponibles
    const updated = await query(
      "UPDATE players SET hero_points_available = hero_points_available + $1 WHERE id = $2 RETURNING hero_points_available",
      [kills, req.user.id]
    );
    
    // Mettre à jour les kills dans hero_stats
    await query(
      `UPDATE hero_stats 
       SET kills = COALESCE(kills, 0) + $1 
       WHERE player_id = $2`,
      [kills, req.user.id]
    );
    
    // Récupérer les stats mises à jour
    const heroStatsResult = await query(
      "SELECT * FROM hero_stats WHERE player_id = $1",
      [req.user.id]
    );
    
    return res.json({ 
      heroPointsAvailable: updated.rows[0].hero_points_available,
      heroStats: heroStatsResult.rows[0] || null
    });
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
    if (err.code === "STAT_MAX_REACHED") {
      return res.status(400).json({ error: err.message || "Statistique au maximum" });
    }
    if (err.code === "HERO_STATS_NOT_FOUND") {
      return res.status(404).json({ error: "Stats du héros introuvables" });
    }
    console.error("Erreur upgrade héros:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/hero/upgrade/batch", async (req, res) => {
  const { upgrades } = req.body || {};

  try {
    const result = await upgradeHeroStatsBatch(req.user.id, upgrades);
    const profile = await buildPlayerProfile(req.user.id);

    return res.json({
      message: "Améliorations appliquées",
      heroStats: result.heroStats,
      heroPointsAvailable: result.heroPointsAvailable,
      heroPointConversion: result.heroPointConversion,
      profile,
    });
  } catch (err) {
    if (err.code === "INVALID_UPGRADES") {
      return res.status(400).json({ error: "Format d'améliorations invalide" });
    }
    if (err.code === "INVALID_POINTS") {
      return res.status(400).json({ error: "Nombre de points invalide" });
    }
    if (err.code === "INVALID_STAT") {
      return res.status(400).json({ error: "Statistique inconnue" });
    }
    if (err.code === "NOT_ENOUGH_POINTS") {
      return res.status(400).json({ error: "Points insuffisants" });
    }
    if (err.code === "STAT_MAX_REACHED") {
      return res.status(400).json({ error: err.message || "Statistique au maximum" });
    }
    if (err.code === "HERO_STATS_NOT_FOUND") {
      return res.status(404).json({ error: "Stats du héros introuvables" });
    }
    if (err.code === "PLAYER_NOT_FOUND") {
      return res.status(404).json({ error: "Joueur introuvable" });
    }
    console.error("Erreur upgrade batch héros:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/hero/color", async (req, res) => {
  const { color } = req.body || {};
  
  // Valider le format hexadécimal (ex: #FF5733 ou FF5733)
  const hexColor = String(color || "").trim();
  const isValidHex = /^#?[0-9A-Fa-f]{6}$/.test(hexColor);
  
  if (!isValidHex) {
    return res.status(400).json({ error: "Couleur invalide. Format attendu: #RRGGBB" });
  }
  
  // Normaliser en format avec #
  const normalizedColor = hexColor.startsWith("#") ? hexColor : `#${hexColor}`;
  
  try {
    // S'assurer que hero_stats existe
    await ensureHeroStats(req.user.id);
    
    // Mettre à jour la couleur dans hero_stats
    const result = await query(
      `UPDATE hero_stats 
       SET color = $1 
       WHERE player_id = $2 
       RETURNING *`,
      [normalizedColor, req.user.id]
    );
    
    if (result.rows.length === 0) {
      // Si la mise à jour n'a rien retourné, réessayer après avoir créé les stats
      await ensureHeroStats(req.user.id);
      const retryResult = await query(
        `UPDATE hero_stats 
         SET color = $1 
         WHERE player_id = $2 
         RETURNING *`,
        [normalizedColor, req.user.id]
      );
      return res.json({ heroStats: retryResult.rows[0] });
    }
    
    return res.json({ heroStats: result.rows[0] });
  } catch (err) {
    console.error("Erreur mise à jour couleur héros:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
