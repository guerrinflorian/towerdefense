import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { ensurePlayerAchievementRows, evaluateAchievementsFromRun } from "../achievements/index.js";
import { pool } from "../db.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", async (req, res) => {
  const playerId = req.user.id;
  const runReport = req.body || {};

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await ensurePlayerAchievementRows(playerId, client);

    const { unlocked, progress } = await evaluateAchievementsFromRun(
      playerId,
      runReport,
      client
    );

    await client.query("COMMIT");

    return res.status(200).json({
      status: "ok",
      unlocked,
      progress,
    });
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Erreur lors du rollback run report:", rollbackError);
    }
    console.error("Erreur traitement run report:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  } finally {
    client.release();
  }
});

export default router;
