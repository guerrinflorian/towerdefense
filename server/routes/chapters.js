import express from "express";
import {
  buildChapterProgress,
  fetchBestRunsForPlayer,
  fetchChaptersWithLevelsFromDb,
} from "../utils/chapters.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const chapters = await fetchChaptersWithLevelsFromDb();
    return res.json({ chapters });
  } catch (error) {
    console.error("Erreur chargement chapitres:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/progress", authMiddleware, async (req, res) => {
  try {
    const [chapters, bestRuns] = await Promise.all([
      fetchChaptersWithLevelsFromDb(),
      fetchBestRunsForPlayer(req.user.id),
    ]);
    const payload = buildChapterProgress(chapters, bestRuns);
    return res.json(payload);
  } catch (error) {
    console.error("Erreur progression chapitres:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
