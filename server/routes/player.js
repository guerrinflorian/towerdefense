import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { query, pool } from "../db.js";
import { buildPlayerProfile, recordLevelCompletion, ensureHeroStats } from "../utils/profile.js";
import { upgradeHeroStats, upgradeHeroStatsBatch } from "../utils/heroUpgrades.js";
import { HERO_BASE_STATS } from "../constants.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/me", async (req, res) => {
  try {
    // Récupérer automatiquement le héros sélectionné (is_selected = true)
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
            lc.created_at,
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
            completion_time_ms,
            created_at
          FROM ranked_runs
          WHERE player_rank = 1
        ),
        player_stats AS (
          SELECT 
            player_id,
            username,
            COUNT(DISTINCT level_id) AS levels_completed,
            COALESCE(SUM(lives_lost), 0) AS total_lives_lost,
            COALESCE(SUM(completion_time_ms), 0) AS total_time_ms,
            MAX(created_at) AS last_level_completed_at
          FROM best_per_level
          GROUP BY player_id, username
        )
        SELECT 
          username,
          levels_completed AS max_level,
          total_lives_lost,
          total_time_ms,
          last_level_completed_at
        FROM player_stats
        ORDER BY 
          levels_completed DESC,
          total_lives_lost ASC,
          total_time_ms ASC,
          last_level_completed_at ASC
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
    // Utiliser la nouvelle structure heroes/player_heroes
    const result = await query(
      `SELECT 
          p.username,
          COALESCE(
            LEAST(h.base_hp + COALESCE(ph.bonus_hp, 0), h.max_hp),
            h.base_hp + COALESCE(ph.bonus_hp, 0)
          ) AS max_hp,
          COALESCE(
            LEAST(h.base_damage + COALESCE(ph.bonus_damage, 0), h.max_damage),
            h.base_damage + COALESCE(ph.bonus_damage, 0)
          ) AS base_damage,
          COALESCE(
            LEAST(h.base_move_speed + COALESCE(ph.bonus_move_speed, 0), h.max_move_speed),
            h.base_move_speed + COALESCE(ph.bonus_move_speed, 0)
          ) AS move_speed,
          (COALESCE(LEAST(h.base_hp + COALESCE(ph.bonus_hp, 0), h.max_hp), h.base_hp + COALESCE(ph.bonus_hp, 0)) +
           COALESCE(LEAST(h.base_damage + COALESCE(ph.bonus_damage, 0), h.max_damage), h.base_damage + COALESCE(ph.bonus_damage, 0)) +
           COALESCE(LEAST(h.base_move_speed + COALESCE(ph.bonus_move_speed, 0), h.max_move_speed), h.base_move_speed + COALESCE(ph.bonus_move_speed, 0))
          ) AS hero_score
        FROM players p
        LEFT JOIN player_heroes ph ON ph.player_id = p.id AND ph.hero_id = 1
        LEFT JOIN heroes h ON h.id = COALESCE(ph.hero_id, 1)
        WHERE h.id IS NOT NULL
        ORDER BY hero_score DESC, max_hp DESC, base_damage DESC, move_speed DESC
        LIMIT 10`
    );

    return res.json({ entries: result.rows });
  } catch (err) {
    // Si les tables n'existent pas encore, retourner un tableau vide
    console.warn("Erreur leaderboard héros (tables peut-être non créées):", err.message);
    return res.json({ entries: [] });
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

router.get("/leaderboard/hero-types", async (_req, res) => {
  try {
    const result = await query(
      `WITH hero_stats AS (
          SELECT 
            h.id AS hero_id,
            h.name AS hero_name,
            h.hero_type,
            p.id AS player_id,
            p.username,
            COALESCE(
              LEAST(h.base_hp + COALESCE(ph.bonus_hp, 0), h.max_hp),
              h.base_hp + COALESCE(ph.bonus_hp, 0)
            ) AS max_hp,
            COALESCE(
              LEAST(h.base_damage + COALESCE(ph.bonus_damage, 0), h.max_damage),
              h.base_damage + COALESCE(ph.bonus_damage, 0)
            ) AS base_damage,
            COALESCE(
              LEAST(h.base_move_speed + COALESCE(ph.bonus_move_speed, 0), h.max_move_speed),
              h.base_move_speed + COALESCE(ph.bonus_move_speed, 0)
            ) AS move_speed,
            COALESCE(
              GREATEST(h.base_attack_interval_ms - COALESCE(ph.bonus_attack_interval_ms, 0), h.min_attack_interval_ms),
              h.base_attack_interval_ms - COALESCE(ph.bonus_attack_interval_ms, 0)
            ) AS attack_interval_ms,
            (COALESCE(LEAST(h.base_hp + COALESCE(ph.bonus_hp, 0), h.max_hp), h.base_hp + COALESCE(ph.bonus_hp, 0)) +
             COALESCE(LEAST(h.base_damage + COALESCE(ph.bonus_damage, 0), h.max_damage), h.base_damage + COALESCE(ph.bonus_damage, 0)) +
             COALESCE(LEAST(h.base_move_speed + COALESCE(ph.bonus_move_speed, 0), h.max_move_speed), h.base_move_speed + COALESCE(ph.bonus_move_speed, 0)) +
             GREATEST(
               h.base_attack_interval_ms - COALESCE(
                 GREATEST(h.base_attack_interval_ms - COALESCE(ph.bonus_attack_interval_ms, 0), h.min_attack_interval_ms),
                 h.base_attack_interval_ms - COALESCE(ph.bonus_attack_interval_ms, 0)
               ),
               0
             )
            ) AS hero_score,
            ph.kills,
            ph.upgrade_points_spent
          FROM players p
          JOIN player_heroes ph ON ph.player_id = p.id
          JOIN heroes h ON h.id = ph.hero_id
          WHERE h.hero_type IS NOT NULL
        ),
        ranked_heroes AS (
          SELECT 
            hero_id,
            hero_name,
            hero_type,
            username,
            max_hp,
            base_damage,
            move_speed,
            attack_interval_ms,
            hero_score,
            kills,
            upgrade_points_spent,
            ROW_NUMBER() OVER (
              PARTITION BY hero_id 
              ORDER BY hero_score DESC, max_hp DESC, base_damage DESC, move_speed DESC
            ) AS hero_rank
          FROM hero_stats
        )
        SELECT hero_id, hero_name, hero_type, username, max_hp, base_damage, move_speed, attack_interval_ms, hero_score, kills, upgrade_points_spent
        FROM ranked_heroes
        WHERE hero_rank <= 10
        ORDER BY hero_id, hero_rank`
    );

    const grouped = result.rows.reduce((acc, row) => {
      const heroId = Number(row.hero_id);
      const heroName = row.hero_name || `Héros ${heroId}`;
      if (!acc[heroId]) acc[heroId] = { heroId, heroName, entries: [] };
      acc[heroId].entries.push({
        username: row.username,
        max_hp: Number(row.max_hp || 0),
        base_damage: parseFloat(row.base_damage || 0),
        move_speed: Number(row.move_speed || 0),
        attack_interval_ms: Number(row.attack_interval_ms || 0),
        hero_score: Number(row.hero_score || 0),
        kills: Number(row.kills || 0),
        upgrade_points_spent: Number(row.upgrade_points_spent || 0),
      });
      return acc;
    }, {});

    const heroTypes = Object.values(grouped)
      .map((hero) => ({
        heroId: hero.heroId,
        heroName: hero.heroName,
        entries: hero.entries,
      }))
      .sort((a, b) => a.heroId - b.heroId);

    return res.json({ heroTypes });
  } catch (err) {
    console.error("Erreur leaderboard types de héros:", err);
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
    const heroId = Number(req.body?.heroId) || 1; // Par défaut héros 1
    
    // Mettre à jour les points disponibles
    const updated = await query(
      "UPDATE players SET hero_points_available = hero_points_available + $1 WHERE id = $2 RETURNING hero_points_available",
      [kills, req.user.id]
    );
    
    // Mettre à jour les kills dans player_heroes (nouvelle structure)
    try {
      // Essayer de mettre à jour si l'entrée existe
      const updateResult = await query(
        `UPDATE player_heroes 
         SET kills = COALESCE(kills, 0) + $1 
         WHERE player_id = $2 AND hero_id = $3
         RETURNING *`,
        [kills, req.user.id, heroId]
      );
      
      // Si pas d'entrée, créer une nouvelle ligne
      if (updateResult.rows.length === 0) {
        await query(
          `INSERT INTO player_heroes (player_id, hero_id, kills, bonus_hp, bonus_damage, bonus_attack_interval_ms, bonus_move_speed, upgrade_points_spent, is_selected)
           VALUES ($1, $2, $3, 0, 0, 0, 0, 0, false)
           ON CONFLICT (player_id, hero_id) DO UPDATE SET kills = player_heroes.kills + $3
           RETURNING *`,
          [req.user.id, heroId, kills]
        );
      }
    } catch (err) {
      // Si la table n'existe pas encore, ignorer silencieusement
      console.warn("Table player_heroes non disponible:", err.message);
    }
    
    // Récupérer les stats mises à jour via la nouvelle fonction
    const { getOrCreatePlayerHero } = await import("../utils/profile.js");
    const heroStats = await getOrCreatePlayerHero(req.user.id, heroId);
    
    return res.json({ 
      heroPointsAvailable: updated.rows[0].hero_points_available,
      heroStats: heroStats
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
  const { upgrades, heroId } = req.body || {};
  const selectedHeroId = Number(heroId) || null; // null = utiliser le héros sélectionné

  try {
    // Si heroId n'est pas fourni, récupérer le héros sélectionné
    let finalHeroId = selectedHeroId;
    if (!finalHeroId) {
      const selectedHeroRes = await query(
        `SELECT hero_id FROM player_heroes WHERE player_id = $1 AND is_selected = true LIMIT 1`,
        [req.user.id]
      );
      finalHeroId = selectedHeroRes.rows.length > 0 ? Number(selectedHeroRes.rows[0].hero_id) : 1;
    }
    
    const result = await upgradeHeroStatsBatch(req.user.id, upgrades, finalHeroId);
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
  const { color, heroId } = req.body || {};
  // Si heroId n'est pas fourni, récupérer le héros sélectionné
  let selectedHeroId = Number(heroId);
  if (!selectedHeroId) {
    const selectedHeroRes = await query(
      `SELECT hero_id FROM player_heroes WHERE player_id = $1 AND is_selected = true LIMIT 1`,
      [req.user.id]
    );
    selectedHeroId = selectedHeroRes.rows.length > 0 ? Number(selectedHeroRes.rows[0].hero_id) : 1;
  }
  
  // Valider le format hexadécimal (ex: #FF5733 ou FF5733)
  const hexColor = String(color || "").trim();
  const isValidHex = /^#?[0-9A-Fa-f]{6}$/.test(hexColor);
  
  if (!isValidHex) {
    return res.status(400).json({ error: "Couleur invalide. Format attendu: #RRGGBB" });
  }
  
  // Normaliser en format avec #
  const normalizedColor = hexColor.startsWith("#") ? hexColor : `#${hexColor}`;
  
  try {
    // Vérifier que le héros existe et que le joueur l'a débloqué
    const heroCheck = await query(
      `SELECT ph.hero_id FROM player_heroes ph
       WHERE ph.player_id = $1 AND ph.hero_id = $2`,
      [req.user.id, selectedHeroId]
    );
    
    if (heroCheck.rows.length === 0) {
      return res.status(404).json({ error: "Héros introuvable ou non débloqué" });
    }
    
    // Mettre à jour la couleur dans player_heroes (couleur personnalisée par joueur)
    await query(
      `UPDATE player_heroes 
       SET color = $1 
       WHERE player_id = $2 AND hero_id = $3`,
      [normalizedColor, req.user.id, selectedHeroId]
    );
    
    // Récupérer les stats finales avec la nouvelle couleur
    const { getOrCreatePlayerHero } = await import("../utils/profile.js");
    const heroStats = await getOrCreatePlayerHero(req.user.id, selectedHeroId);
    
    return res.json({ heroStats });
  } catch (err) {
    console.error("Erreur mise à jour couleur héros:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// Route pour récupérer tous les héros avec leur statut de déblocage pour le joueur
router.get("/heroes", async (req, res) => {
  try {
    // Récupérer tous les héros avec leurs stats de base et les stats actuelles du joueur
    const heroesResult = await query(
      `SELECT 
        h.id, h.name, 
        h.base_hp, h.base_damage, h.base_attack_interval_ms, h.base_move_speed,
        h.max_hp, h.max_damage, h.min_attack_interval_ms, h.max_move_speed, 
        h.enemies_retained,
        COALESCE(ph.color, h.color) AS color, h.hero_points_to_unlock,
        COALESCE(ph.bonus_hp, 0) AS bonus_hp,
        COALESCE(ph.bonus_damage, 0) AS bonus_damage,
        COALESCE(ph.bonus_attack_interval_ms, 0) AS bonus_attack_interval_ms,
        COALESCE(ph.bonus_move_speed, 0) AS bonus_move_speed,
        COALESCE(ph.is_selected, false) AS is_selected,
        CASE WHEN ph.hero_id IS NOT NULL THEN true ELSE false END AS is_unlocked
       FROM heroes h
       LEFT JOIN player_heroes ph ON ph.player_id = $1 AND ph.hero_id = h.id
       ORDER BY h.id`,
      [req.user.id]
    );
    
    // Récupérer les points disponibles du joueur
    const playerResult = await query(
      `SELECT hero_points_available FROM players WHERE id = $1`,
      [req.user.id]
    );
    const heroPointsAvailable = playerResult.rows[0]?.hero_points_available || 0;
    
    // Construire la réponse avec les stats actuelles (base + bonus) si débloqué, sinon stats de base
    const heroes = heroesResult.rows.map(hero => {
      const isUnlocked = hero.is_unlocked;
      
      // Calculer les stats actuelles si débloqué, sinon utiliser les stats de base
      let currentHp, currentDamage, currentAttackInterval, currentMoveSpeed;
      
      if (isUnlocked) {
        // Stats actuelles = base + bonus (ou base - bonus pour attack_interval_ms)
        const baseHp = Number(hero.base_hp) || 0;
        const bonusHp = Number(hero.bonus_hp) || 0;
        const maxHp = hero.max_hp != null ? Number(hero.max_hp) : null;
        currentHp = maxHp != null ? Math.min(baseHp + bonusHp, maxHp) : baseHp + bonusHp;
        
        const baseDamage = parseFloat(hero.base_damage) || 0;
        const bonusDamage = parseFloat(hero.bonus_damage) || 0;
        const maxDamage = hero.max_damage != null ? parseFloat(hero.max_damage) : null;
        currentDamage = maxDamage != null ? Math.min(baseDamage + bonusDamage, maxDamage) : baseDamage + bonusDamage;
        
        const baseAttackInterval = Number(hero.base_attack_interval_ms) || 1500;
        const bonusAttackInterval = Number(hero.bonus_attack_interval_ms) || 0;
        const minAttackInterval = hero.min_attack_interval_ms != null ? Number(hero.min_attack_interval_ms) : null;
        currentAttackInterval = minAttackInterval != null 
          ? Math.max(baseAttackInterval - bonusAttackInterval, minAttackInterval)
          : baseAttackInterval - bonusAttackInterval;
        
        const baseMoveSpeed = Number(hero.base_move_speed) || 0;
        const bonusMoveSpeed = Number(hero.bonus_move_speed) || 0;
        const maxMoveSpeed = hero.max_move_speed != null ? Number(hero.max_move_speed) : null;
        currentMoveSpeed = maxMoveSpeed != null 
          ? Math.min(baseMoveSpeed + bonusMoveSpeed, maxMoveSpeed)
          : baseMoveSpeed + bonusMoveSpeed;
      } else {
        // Stats de base si non débloqué
        currentHp = Number(hero.base_hp) || 0;
        currentDamage = parseFloat(hero.base_damage) || 0;
        currentAttackInterval = Number(hero.base_attack_interval_ms) || 1500;
        currentMoveSpeed = Number(hero.base_move_speed) || 0;
      }
      
      return {
        id: hero.id,
        name: hero.name,
        // Stats de base (pour référence)
        base_hp: Number(hero.base_hp),
        base_damage: parseFloat(hero.base_damage),
        base_attack_interval_ms: Number(hero.base_attack_interval_ms),
        base_move_speed: Number(hero.base_move_speed),
        // Stats actuelles (base + bonus si débloqué, sinon base)
        current_hp: currentHp,
        current_damage: currentDamage,
        current_attack_interval_ms: currentAttackInterval,
        current_move_speed: currentMoveSpeed,
        // Limites
        max_hp: hero.max_hp != null ? Number(hero.max_hp) : null,
        max_damage: hero.max_damage != null ? parseFloat(hero.max_damage) : null,
        min_attack_interval_ms: hero.min_attack_interval_ms != null ? Number(hero.min_attack_interval_ms) : null,
        max_move_speed: hero.max_move_speed != null ? Number(hero.max_move_speed) : null,
        // Nombre d'ennemis retenus (s'assurer que c'est bien un nombre)
        enemies_retained: (hero.enemies_retained != null && hero.enemies_retained !== undefined) 
          ? Number(hero.enemies_retained) 
          : 1,
        color: hero.color || "#2b2b2b",
        hero_points_to_unlock: Number(hero.hero_points_to_unlock) || 0,
        isUnlocked: isUnlocked,
        isSelected: Boolean(hero.is_selected),
        canUnlock: !isUnlocked && heroPointsAvailable >= (Number(hero.hero_points_to_unlock) || 0),
      };
    });
    
    return res.json({ heroes, heroPointsAvailable });
  } catch (err) {
    console.error("Erreur récupération héros:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// Route pour débloquer un héros
router.post("/heroes/:heroId/unlock", async (req, res) => {
  const heroId = Number(req.params.heroId);
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");
    
    // Vérifier que le héros existe
    const heroResult = await client.query(
      `SELECT id, name, hero_points_to_unlock FROM heroes WHERE id = $1`,
      [heroId]
    );
    
    if (heroResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Héros introuvable" });
    }
    
    const hero = heroResult.rows[0];
    const unlockCost = Number(hero.hero_points_to_unlock) || 0;
    
    // Vérifier si le héros est déjà débloqué
    const existingResult = await client.query(
      `SELECT id FROM player_heroes WHERE player_id = $1 AND hero_id = $2`,
      [req.user.id, heroId]
    );
    
    if (existingResult.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Ce héros est déjà débloqué" });
    }
    
    // Vérifier que le joueur a assez de points
    const playerResult = await client.query(
      `SELECT hero_points_available FROM players WHERE id = $1 FOR UPDATE`,
      [req.user.id]
    );
    
    if (playerResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Joueur introuvable" });
    }
    
    const availablePoints = Number(playerResult.rows[0].hero_points_available || 0);
    
    if (availablePoints < unlockCost) {
      await client.query("ROLLBACK");
      return res.status(400).json({ 
        error: `Points insuffisants. Nécessaire: ${unlockCost}, Disponible: ${availablePoints}` 
      });
    }
    
    // Décrémenter les points disponibles
    await client.query(
      `UPDATE players SET hero_points_available = hero_points_available - $1 WHERE id = $2`,
      [unlockCost, req.user.id]
    );
    
    // Vérifier si c'est le premier héros du joueur pour le sélectionner par défaut
    const playerHeroesCount = await client.query(
      `SELECT COUNT(*) as count FROM player_heroes WHERE player_id = $1`,
      [req.user.id]
    );
    const isFirstHero = Number(playerHeroesCount.rows[0]?.count || 0) === 0;
    
    // Créer l'entrée player_heroes
    await client.query(
      `INSERT INTO player_heroes (player_id, hero_id, bonus_hp, bonus_damage, bonus_attack_interval_ms, bonus_move_speed, kills, upgrade_points_spent, is_selected)
       VALUES ($1, $2, 0, 0, 0, 0, 0, 0, $3)`,
      [req.user.id, heroId, isFirstHero]
    );
    
    await client.query("COMMIT");
    
    // Récupérer les stats finales du héros débloqué
    const { getOrCreatePlayerHero } = await import("../utils/profile.js");
    const heroStats = await getOrCreatePlayerHero(req.user.id, heroId);
    
    // Récupérer les nouveaux points disponibles
    const updatedPlayerResult = await client.query(
      `SELECT hero_points_available FROM players WHERE id = $1`,
      [req.user.id]
    );
    
    return res.json({
      success: true,
      message: `${hero.name} débloqué !`,
      heroStats,
      heroPointsAvailable: updatedPlayerResult.rows[0].hero_points_available,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erreur déblocage héros:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  } finally {
    client.release();
  }
});

// Route pour sélectionner un héros
router.post("/heroes/:heroId/select", async (req, res) => {
  const heroId = Number(req.params.heroId);
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");
    
    // Vérifier que le héros existe et est débloqué par le joueur
    const heroCheck = await client.query(
      `SELECT ph.hero_id, h.name 
       FROM player_heroes ph 
       JOIN heroes h ON h.id = ph.hero_id
       WHERE ph.player_id = $1 AND ph.hero_id = $2`,
      [req.user.id, heroId]
    );
    
    if (heroCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Héros introuvable ou non débloqué" });
    }
    
    // Désélectionner tous les héros du joueur
    await client.query(
      `UPDATE player_heroes SET is_selected = false WHERE player_id = $1`,
      [req.user.id]
    );
    
    // Sélectionner le héros demandé
    await client.query(
      `UPDATE player_heroes SET is_selected = true WHERE player_id = $1 AND hero_id = $2`,
      [req.user.id, heroId]
    );
    
    await client.query("COMMIT");
    
    // Récupérer les stats du héros sélectionné
    const { getOrCreatePlayerHero } = await import("../utils/profile.js");
    const heroStats = await getOrCreatePlayerHero(req.user.id, heroId);
    
    return res.json({
      success: true,
      message: `${heroCheck.rows[0].name} sélectionné !`,
      heroStats,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erreur sélection héros:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  } finally {
    client.release();
  }
});

// ─── SORTS ────────────────────────────────────────────────────────────────────

// Récupérer tous les sorts avec statut de déblocage du joueur
router.get("/spells", async (req, res) => {
  try {
    const result = await query(
      `SELECT s.key, s.name, s.description, s.icon, s.cost_hero_points, s.is_free, s.sort_order,
              CASE WHEN ps.spell_key IS NOT NULL OR s.is_free THEN true ELSE false END AS is_unlocked
       FROM spells s
       LEFT JOIN player_spells ps ON ps.player_id = $1 AND ps.spell_key = s.key
       ORDER BY s.sort_order`,
      [req.user.id]
    );

    const playerResult = await query(
      `SELECT hero_points_available FROM players WHERE id = $1`,
      [req.user.id]
    );
    const heroPointsAvailable = Number(playerResult.rows[0]?.hero_points_available || 0);

    return res.json({
      spells: result.rows,
      heroPointsAvailable,
    });
  } catch (err) {
    console.error("Erreur récupération sorts:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// Acheter un sort
router.post("/spells/:spellKey/unlock", async (req, res) => {
  const spellKey = req.params.spellKey;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Vérifier que le sort existe
    const spellResult = await client.query(
      `SELECT key, name, cost_hero_points, is_free FROM spells WHERE key = $1`,
      [spellKey]
    );
    if (spellResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Sort introuvable" });
    }

    const spell = spellResult.rows[0];

    // Sort gratuit : pas besoin d'achat
    if (spell.is_free) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Ce sort est gratuit, il est déjà disponible" });
    }

    // Vérifier si déjà débloqué
    const existingResult = await client.query(
      `SELECT id FROM player_spells WHERE player_id = $1 AND spell_key = $2`,
      [req.user.id, spellKey]
    );
    if (existingResult.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Ce sort est déjà débloqué" });
    }

    const cost = Number(spell.cost_hero_points || 0);

    // Vérifier les points disponibles
    const playerResult = await client.query(
      `SELECT hero_points_available FROM players WHERE id = $1 FOR UPDATE`,
      [req.user.id]
    );
    const available = Number(playerResult.rows[0]?.hero_points_available || 0);

    if (available < cost) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        error: `Points insuffisants. Nécessaire : ${cost}, Disponible : ${available}`,
      });
    }

    // Déduire les points
    await client.query(
      `UPDATE players SET hero_points_available = hero_points_available - $1 WHERE id = $2`,
      [cost, req.user.id]
    );

    // Insérer le sort débloqué
    await client.query(
      `INSERT INTO player_spells (player_id, spell_key) VALUES ($1, $2)`,
      [req.user.id, spellKey]
    );

    await client.query("COMMIT");

    const remainingPoints = available - cost;
    return res.json({
      success: true,
      message: `Sort "${spell.name}" débloqué !`,
      spellKey,
      heroPointsAvailable: remainingPoints,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erreur achat sort:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  } finally {
    client.release();
  }
});

export default router;
