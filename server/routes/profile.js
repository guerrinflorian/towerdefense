import express from "express";
import { query } from "../db.js";
import { buildPlayerProfile } from "../utils/profile.js";

const DEFAULT_MAX_LIVES = 20;

const router = express.Router();

// Route publique pour récupérer le profil d'un joueur par username
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    
    // Récupérer l'ID du joueur depuis le username
    const playerRes = await query(
      "SELECT id, username FROM players WHERE username = $1",
      [username]
    );
    
    if (playerRes.rows.length === 0) {
      return res.status(404).json({ error: "Joueur introuvable" });
    }
    
    const playerId = playerRes.rows[0].id;
    const player = {
      id: playerRes.rows[0].id,
      username: playerRes.rows[0].username,
      created_at: null, // La colonne created_at n'existe pas dans la table players
    };
    
    // Récupérer le profil complet
    const profile = await buildPlayerProfile(playerId);
    if (!profile) {
      return res.status(404).json({ error: "Profil introuvable" });
    }
    
    // Récupérer les meilleurs runs avec leur classement mondial
    const bestRunsRes = await query(
      `WITH all_best_runs AS (
          -- On récupère le meilleur run de CHAQUE joueur pour CHAQUE niveau
          SELECT 
            level_id,
            player_id,
            ( $2::INT - COALESCE(lives_remaining, $2::INT) ) AS lives_lost,
            completion_time_ms,
            created_at,
            ROW_NUMBER() OVER (
              PARTITION BY level_id, player_id 
              ORDER BY ($2::INT - COALESCE(lives_remaining, $2::INT)) ASC, completion_time_ms ASC, created_at ASC
            ) as run_rank
          FROM level_completions
        ),
        global_leaderboard AS (
          -- On calcule le rang mondial parmi les meilleurs runs de tout le monde
          SELECT 
            level_id,
            player_id,
            lives_lost,
            completion_time_ms,
            created_at,
            RANK() OVER (
              PARTITION BY level_id 
              ORDER BY lives_lost ASC, completion_time_ms ASC, created_at ASC
            ) as global_rank
          FROM all_best_runs
          WHERE run_rank = 1
        )
        -- Enfin, on sélectionne uniquement les résultats pour NOTRE joueur
        SELECT 
          level_id,
          lives_lost,
          completion_time_ms,
          created_at,
          global_rank
        FROM global_leaderboard
        WHERE player_id = $1`,
      [playerId, DEFAULT_MAX_LIVES]
    );
    
    const bestRuns = bestRunsRes.rows.map((row) => ({
      levelId: Number(row.level_id),
      livesLost: Number(row.lives_lost || 0),
      completionTimeMs: Number(row.completion_time_ms || 0),
      createdAt: row.created_at,
      globalRank: row.global_rank ? Number(row.global_rank) : null,
    }));
    
    // Récupérer les statistiques de complétion (uniquement sur les meilleurs temps de chaque niveau)
    const completionStats = await query(
      `WITH player_best_runs AS (
        SELECT 
          lc.level_id,
          ( $2::INT - COALESCE(lc.lives_remaining, $2::INT) ) AS lives_lost,
          lc.completion_time_ms,
          lc.is_perfect_run,
          ROW_NUMBER() OVER (
            PARTITION BY lc.level_id 
            ORDER BY ($2::INT - COALESCE(lc.lives_remaining, $2::INT)), lc.completion_time_ms, lc.created_at
          ) AS rn
        FROM level_completions lc
        WHERE lc.player_id = $1
      )
      SELECT 
        COUNT(DISTINCT level_id) as levels_completed,
        SUM(completion_time_ms) as total_time_ms,
        SUM(lives_lost) as total_lives_lost,
        COUNT(*) FILTER (WHERE is_perfect_run = true) as perfect_runs
       FROM player_best_runs
       WHERE rn = 1`,
      [playerId, DEFAULT_MAX_LIVES]
    );
    
    // Récupérer les statistiques de héros
    const heroStats = await query(
      `SELECT 
        COUNT(DISTINCT hero_id) as heroes_unlocked,
        SUM(kills) as total_kills,
        SUM(upgrade_points_spent) as total_upgrade_points
       FROM player_heroes
       WHERE player_id = $1`,
      [playerId]
    );
    
    // Récupérer les succès débloqués
    const achievementsStats = await query(
      `SELECT 
        COUNT(*) FILTER (WHERE is_unlocked = true) as achievements_unlocked,
        COUNT(*) as total_achievements
       FROM player_achievement_progress
       WHERE player_id = $1`,
      [playerId]
    );
    
    // Récupérer le classement global (même logique que le leaderboard global)
    const globalRank = await query(
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
        ),
        player_stats AS (
          SELECT 
            player_id,
            username,
            MAX(level_id) AS max_level,
            COALESCE(SUM(lives_lost), 0) AS total_lives_lost,
            COALESCE(SUM(completion_time_ms), 0) AS total_time_ms
          FROM best_per_level
          GROUP BY player_id, username
        ),
        ranked AS (
          SELECT 
            p.id,
            p.username,
            COALESCE(ps.max_level, 0) AS max_level,
            COALESCE(ps.total_lives_lost, 0) AS total_lives_lost,
            COALESCE(ps.total_time_ms, 0) AS total_time_ms,
            ROW_NUMBER() OVER (
              ORDER BY 
                COALESCE(ps.max_level, 0) DESC,
                COALESCE(ps.total_lives_lost, 0) ASC,
                COALESCE(ps.total_time_ms, 0) ASC
            ) AS rank
          FROM players p
          LEFT JOIN player_stats ps ON ps.player_id = p.id
        )
        SELECT rank FROM ranked WHERE id = $1`,
      [playerId]
    );
    
    const stats = completionStats.rows[0] || {};
    const heroData = heroStats.rows[0] || {};
    const achievementsData = achievementsStats.rows[0] || {};
    const rank = globalRank.rows[0]?.rank || null;
    
    return res.json({
      player: {
        id: player.id,
        username: player.username,
        created_at: player.created_at,
      },
      profile: {
        heroStats: profile.heroStats,
        progress: profile.progress,
      },
      stats: {
        levelsCompleted: Number(stats.levels_completed || 0),
        totalTimeMs: Number(stats.total_time_ms || 0),
        totalLivesLost: Number(stats.total_lives_lost || 0),
        perfectRuns: Number(stats.perfect_runs || 0),
        heroesUnlocked: Number(heroData.heroes_unlocked || 0),
        totalKills: Number(heroData.total_kills || 0),
        totalUpgradePoints: Number(heroData.total_upgrade_points || 0),
        achievementsUnlocked: Number(achievementsData.achievements_unlocked || 0),
        totalAchievements: Number(achievementsData.total_achievements || 0),
        globalRank: rank,
      },
      bestRuns: bestRuns.map(run => ({
        levelId: run.levelId,
        livesLost: run.livesLost,
        completionTimeMs: run.completionTimeMs,
        createdAt: run.createdAt,
        globalRank: run.globalRank, // N'oublie pas d'ajouter cette ligne !
      })),
    });
  } catch (err) {
    console.error("Erreur récupération profil public:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;

