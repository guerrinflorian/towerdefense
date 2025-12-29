import express from "express";
import { fetchHeroes } from "../utils/heroes.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const heroes = await fetchHeroes();
    return res.json({ heroes });
  } catch (err) {
    console.error("Erreur récupération des héros:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
