import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../db.js";
import { HERO_BASE_STATS, TOKEN_EXPIRATION } from "../constants.js";
import {
  sanitizeIdentifier,
  validateEmail,
  validatePassword,
  validateUsername,
} from "../utils/validators.js";
import { buildPlayerProfile } from "../utils/profile.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body || {};

  if (!validateUsername(username)) {
    return res
      .status(400)
      .json({ error: "Nom d'utilisateur invalide (3 caractères minimum)" });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Email invalide" });
  }
  if (!validatePassword(password)) {
    return res
      .status(400)
      .json({ error: "Mot de passe invalide (8 caractères minimum)" });
  }

  try {
    const existing = await query(
      "SELECT 1 FROM players WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($2)",
      [username, email]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({
        error: "Un compte avec ce nom d'utilisateur ou email existe déjà",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const insertedPlayer = await query(
      `INSERT INTO players (username, email, password_hash, hero_points_available)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, hero_points_available`,
      [username.trim(), email.trim(), passwordHash, 0]
    );

    const player = insertedPlayer.rows[0];

    await query(
      `INSERT INTO hero_stats 
        (player_id, max_hp, base_damage, attack_interval_ms, move_speed, upgrade_points_spent)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        player.id,
        HERO_BASE_STATS.max_hp,
        HERO_BASE_STATS.base_damage,
        HERO_BASE_STATS.attack_interval_ms,
        HERO_BASE_STATS.move_speed,
        HERO_BASE_STATS.upgrade_points_spent,
      ]
    );

    const token = jwt.sign(
      { id: player.id, username: player.username },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    const profile = await buildPlayerProfile(player.id);

    return res.status(201).json({
      token,
      profile,
    });
  } catch (err) {
    console.error("Erreur registre:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/login", async (req, res) => {
  const { identifier, password } = req.body || {};
  const normalizedIdentifier = sanitizeIdentifier(identifier);

  if (!normalizedIdentifier || !validatePassword(password)) {
    return res
      .status(400)
      .json({ error: "Identifiants ou mot de passe invalides" });
  }

  try {
    const userRes = await query(
      `SELECT id, username, email, password_hash 
       FROM players 
       WHERE LOWER(username) = $1 OR LOWER(email) = $1
       LIMIT 1`,
      [normalizedIdentifier]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    const user = userRes.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    const profile = await buildPlayerProfile(user.id);

    return res.json({ token, profile });
  } catch (err) {
    console.error("Erreur login:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
