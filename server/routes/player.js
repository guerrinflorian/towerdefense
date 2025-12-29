import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { pool, query } from "../db.js";
import { buildPlayerProfile, recordLevelCompletion } from "../utils/profile.js";
import { upgradeHeroStatsBatch } from "../utils/heroUpgrades.js";
import {
  computeFinalHeroStats,
  createPlayerHero,
  fetchHeroById,
  fetchPlayerHero,
  getDefaultHeroId,
} from "../utils/heroes.js";

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

router.get("/me/heroes/:heroId", async (req, res) => {
  const heroId = Number(req.params.heroId);
  if (!Number.isInteger(heroId) || heroId <= 0) {
    return res.status(400).json({ error: "Identifiant de héros invalide" });
  }

  try {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const hero = await fetchHeroById(client, heroId, { forUpdate: true });
      if (!hero) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Héros introuvable" });
      }

      let playerHero = await fetchPlayerHero(client, req.user.id, heroId, {
        forUpdate: true,
      });
      if (!playerHero && Number(hero.hero_points_to_unlock || 0) === 0) {
        playerHero = await createPlayerHero(client, req.user.id, heroId);
      }

      const playerRes = await client.query(
        "SELECT hero_points_available FROM players WHERE id = $1",
        [req.user.id]
      );

      await client.query("COMMIT");

      const finalStats = playerHero ? computeFinalHeroStats(hero, playerHero) : null;
      return res.json({
        hero,
        playerHero,
        finalStats,
        heroPointsAvailable: playerRes.rows[0]?.hero_points_available ?? 0,
        isLocked: !playerHero,
      });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Erreur récupération progression héros:", err);
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
    const heroId = await getDefaultHeroId();

    if (!heroId) {
      return res.json({ entries: [] });
    }

    const result = await query(
      `SELECT 
          p.username,
          LEAST(h.base_hp + COALESCE(ph.bonus_hp, 0), COALESCE(h.max_hp, h.base_hp + COALESCE(ph.bonus_hp, 0))) AS max_hp,
          LEAST(h.base_damage + COALESCE(ph.bonus_damage, 0), COALESCE(h.max_damage, h.base_damage + COALESCE(ph.bonus_damage, 0))) AS base_damage,
          LEAST(h.base_move_speed + COALESCE(ph.bonus_move_speed, 0), COALESCE(h.max_move_speed, h.base_move_speed + COALESCE(ph.bonus_move_speed, 0))) AS move_speed
        FROM players p
        CROSS JOIN heroes h
        LEFT JOIN player_heroes ph 
          ON ph.player_id = p.id AND ph.hero_id = h.id
        WHERE h.id = $1
        ORDER BY 
          (LEAST(h.base_hp + COALESCE(ph.bonus_hp, 0), COALESCE(h.max_hp, h.base_hp + COALESCE(ph.bonus_hp, 0))) 
           + LEAST(h.base_damage + COALESCE(ph.bonus_damage, 0), COALESCE(h.max_damage, h.base_damage + COALESCE(ph.bonus_damage, 0))) 
           + LEAST(h.base_move_speed + COALESCE(ph.bonus_move_speed, 0), COALESCE(h.max_move_speed, h.base_move_speed + COALESCE(ph.bonus_move_speed, 0)))) DESC
        LIMIT 10`,
      [heroId]
    );

    return res.json({
      entries: result.rows.map((row) => ({
        username: row.username,
        max_hp: Number(row.max_hp),
        base_damage: Number(row.base_damage),
        move_speed: Number(row.move_speed),
        hero_score: Number(row.max_hp) + Number(row.base_damage) + Number(row.move_speed),
      })),
    });
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

router.post("/heroes/:heroId/kill", async (req, res) => {
  const heroId = Number(req.params.heroId);
  if (!Number.isInteger(heroId) || heroId <= 0) {
    return res.status(400).json({ error: "Identifiant de héros invalide" });
  }

  const kills =
    Number.isInteger(req.body?.kills) && req.body.kills >= 0 ? req.body.kills : 0;

  try {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const hero = await fetchHeroById(client, heroId, { forUpdate: true });
      if (!hero) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Héros introuvable" });
      }

      let playerHero = await fetchPlayerHero(client, req.user.id, heroId, {
        forUpdate: true,
      });
      if (!playerHero && Number(hero.hero_points_to_unlock || 0) === 0) {
        playerHero = await createPlayerHero(client, req.user.id, heroId);
      }
      if (!playerHero) {
        await client.query("ROLLBACK");
        return res.status(403).json({ error: "Héros verrouillé" });
      }

      const pointsUpdate = await client.query(
        "UPDATE players SET hero_points_available = hero_points_available + $1 WHERE id = $2 RETURNING hero_points_available",
        [kills, req.user.id]
      );

      const playerHeroUpdate = await client.query(
        `UPDATE player_heroes 
         SET kills = COALESCE(kills, 0) + $1 
         WHERE player_id = $2 AND hero_id = $3
         RETURNING player_id, hero_id, bonus_hp, bonus_damage, bonus_attack_interval_ms, bonus_move_speed, kills, upgrade_points_spent`,
        [kills, req.user.id, heroId]
      );

      await client.query("COMMIT");

      const finalStats = computeFinalHeroStats(hero, playerHeroUpdate.rows[0]);

      return res.json({
        heroPointsAvailable: pointsUpdate.rows[0]?.hero_points_available ?? 0,
        playerHero: playerHeroUpdate.rows[0],
        finalStats,
      });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
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

router.post("/heroes/:heroId/upgrade", async (req, res) => {
  const heroId = Number(req.params.heroId);
  if (!Number.isInteger(heroId) || heroId <= 0) {
    return res.status(400).json({ error: "Identifiant de héros invalide" });
  }

  const { upgrades, stat, points } = req.body || {};
  const payload =
    Array.isArray(upgrades) && upgrades.length > 0
      ? upgrades
      : stat
      ? [{ stat, points }]
      : [];

  try {
    const result = await upgradeHeroStatsBatch(req.user.id, heroId, payload);
    const profile = await buildPlayerProfile(req.user.id);

    return res.json({
      message: "Améliorations appliquées",
      playerHero: result.playerHero,
      heroPointsAvailable: result.heroPointsAvailable,
      heroPointConversion: result.heroPointConversion,
      finalStats: result.finalStats,
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
    if (err.code === "PLAYER_NOT_FOUND") {
      return res.status(404).json({ error: "Joueur introuvable" });
    }
    if (err.code === "HERO_NOT_FOUND") {
      return res.status(404).json({ error: "Héros introuvable" });
    }
    if (err.code === "HERO_LOCKED") {
      return res.status(403).json({ error: "Héros verrouillé" });
    }
    console.error("Erreur upgrade héros:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/heroes/:heroId/unlock", async (req, res) => {
  const heroId = Number(req.params.heroId);
  if (!Number.isInteger(heroId) || heroId <= 0) {
    return res.status(400).json({ error: "Identifiant de héros invalide" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const hero = await fetchHeroById(client, heroId, { forUpdate: true });
    if (!hero) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Héros introuvable" });
    }

    const existing = await fetchPlayerHero(client, req.user.id, heroId, {
      forUpdate: true,
    });
    if (existing) {
      const pointsRes = await client.query(
        "SELECT hero_points_available FROM players WHERE id = $1",
        [req.user.id]
      );
      await client.query("COMMIT");
      const finalStats = computeFinalHeroStats(hero, existing);
      return res.json({
        message: "Héros déjà débloqué",
        heroPointsAvailable: pointsRes.rows[0]?.hero_points_available ?? null,
        playerHero: existing,
        finalStats,
      });
    }

    const cost = Number(hero.hero_points_to_unlock || 0);
    const playerRes = await client.query(
      "SELECT hero_points_available FROM players WHERE id = $1 FOR UPDATE",
      [req.user.id]
    );
    if (playerRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Joueur introuvable" });
    }

    const available = Number(playerRes.rows[0].hero_points_available || 0);
    if (available < cost) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Points insuffisants pour débloquer ce héros" });
    }

    let updatedPoints = available;
    if (cost > 0) {
      const deduction = await client.query(
        `UPDATE players
         SET hero_points_available = hero_points_available - $1
         WHERE id = $2
         RETURNING hero_points_available`,
        [cost, req.user.id]
      );
      updatedPoints = deduction.rows[0].hero_points_available;
    }

    const playerHero = await createPlayerHero(client, req.user.id, heroId);

    await client.query("COMMIT");

    const finalStats = computeFinalHeroStats(hero, playerHero);
    return res.json({
      message: "Héros débloqué",
      heroPointsAvailable: updatedPoints,
      playerHero,
      finalStats,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erreur déblocage héros:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  } finally {
    client.release();
  }
});

export default router;
