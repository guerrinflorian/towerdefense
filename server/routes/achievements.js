import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { ensurePlayerAchievementRows } from "../achievements/index.js";
import { pool } from "../db.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  const playerId = req.user.id;
  const client = await pool.connect();
  try {
    await ensurePlayerAchievementRows(playerId, client);

    const result = await client.query(
      `SELECT 
          a.id,
          a.code_name,
          a.title,
          a.description,
          a.goal_value,
          a.category,
          a.scope,
          a.metric_key,
          a.operator,
          a.accumulate,
          a.difficulty,
          COALESCE(p.current_value, 0) AS current_value,
          COALESCE(p.is_unlocked, FALSE) AS is_unlocked,
          p.unlocked_at
       FROM achievements_ref a
       LEFT JOIN player_achievement_progress p
         ON p.achievement_id = a.id AND p.player_id = $1
       ORDER BY a.category ASC, a.difficulty DESC, a.goal_value ASC, a.id ASC`,
      [playerId]
    );

    const achievements = result.rows.map((row) => ({
      ...row,
      goal_value: Number(row.goal_value),
      difficulty: Number(row.difficulty || 0),
      current_value: Number(row.current_value || 0),
      is_unlocked: row.is_unlocked === true,
    }));

    const total = achievements.length;
    const unlocked = achievements.filter((a) => a.is_unlocked).length;
    const categories = achievements.reduce((acc, ach) => {
      if (!acc[ach.category]) {
        acc[ach.category] = { total: 0, unlocked: 0 };
      }
      acc[ach.category].total += 1;
      if (ach.is_unlocked) acc[ach.category].unlocked += 1;
      return acc;
    }, {});

    return res.json({
      achievements,
      summary: {
        total,
        unlocked,
        categories,
      },
    });
  } catch (err) {
    console.error("Erreur récupération achievements:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  } finally {
    client.release();
  }
});

export default router;
