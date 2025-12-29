import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../db.js";
import { TOKEN_EXPIRATION } from "../constants.js";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../utils/email.js";
import {
  sanitizeIdentifier,
  validateEmail,
  validatePassword,
  validateUsername,
} from "../utils/validators.js";
import { buildPlayerProfile } from "../utils/profile.js";
import { ensurePlayerAchievementRows } from "../achievements/index.js";

const router = express.Router();
const RESET_TOKEN_EXPIRATION_MS = 60 * 60 * 1000; // 1 heure

function buildResetLink(email, token) {
  const baseFromEnv =
    (process.env.PASSWORD_RESET_URL_BASE ||
      (process.env.CLIENT_ORIGIN || "").split(",")[0]) ??
    "";
  const base =
    (typeof baseFromEnv === "string" && baseFromEnv.trim()) ||
    "http://localhost:1234";

  return `${base.replace(/\/$/, "")}/reset-password?token=${token}&email=${encodeURIComponent(
    email
  )}`;
}

async function findUserByEmail(email) {
  const result = await query(
    `SELECT id, username, email, password_hash, reset_token_hash, reset_expires_at
     FROM players WHERE LOWER(email) = LOWER($1) LIMIT 1`,
    [email]
  );
  return result.rows[0] || null;
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body || {};

  if (!validateUsername(username)) {
    return res
      .status(400)
      .json({ error: "Nom d'utilisateur invalide (3 à 15 caractères)" });
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

    await ensurePlayerAchievementRows(player.id);

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

    await ensurePlayerAchievementRows(user.id);

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

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body || {};
  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Email invalide" });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "Email introuvable" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = hashToken(resetToken);
    const resetExpiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRATION_MS);

    await query(
      "UPDATE players SET reset_token_hash = $1, reset_expires_at = $2 WHERE id = $3",
      [resetTokenHash, resetExpiresAt, user.id]
    );

    if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_KEY) {
      return res
        .status(500)
        .json({ error: "Configuration email manquante côté serveur" });
    }

    const resetLink = buildResetLink(user.email, resetToken);
    await sendResetPasswordEmail({
      to: user.email,
      resetLink,
      username: user.username,
    });

    return res.json({ message: "Email envoyé" });
  } catch (err) {
    console.error("Erreur forgot-password:", err);
    const errorMessage = err.message || "Erreur lors de l'envoi de l'email";
    return res.status(500).json({ error: errorMessage });
  }
});

router.get("/reset-password/validate", async (req, res) => {
  const { email, token } = req.query || {};
  if (!validateEmail(email) || !token) {
    return res.status(400).json({ error: "Requête invalide" });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user || !user.reset_token_hash || !user.reset_expires_at) {
      return res.status(400).json({ error: "Lien invalide ou expiré" });
    }

    const hashed = hashToken(token);
    const isExpired = new Date(user.reset_expires_at).getTime() < Date.now();

    if (user.reset_token_hash !== hashed || isExpired) {
      return res.status(400).json({ error: "Lien invalide ou expiré" });
    }

    return res.json({ email: user.email, username: user.username });
  } catch (err) {
    console.error("Erreur validate reset:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, token, password, confirmPassword } = req.body || {};
  if (!validateEmail(email) || !token) {
    return res.status(400).json({ error: "Requête invalide" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Les mots de passe ne correspondent pas" });
  }
  if (!validatePassword(password)) {
    return res
      .status(400)
      .json({ error: "Mot de passe invalide (8 caractères minimum)" });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user || !user.reset_token_hash || !user.reset_expires_at) {
      return res.status(400).json({ error: "Lien invalide ou expiré" });
    }

    const hashed = hashToken(token);
    const isExpired = new Date(user.reset_expires_at).getTime() < Date.now();

    if (user.reset_token_hash !== hashed || isExpired) {
      return res.status(400).json({ error: "Lien invalide ou expiré" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await query(
      `UPDATE players 
       SET password_hash = $1, reset_token_hash = NULL, reset_expires_at = NULL 
       WHERE id = $2`,
      [passwordHash, user.id]
    );

    return res.json({ message: "Mot de passe mis à jour" });
  } catch (err) {
    console.error("Erreur reset-password:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
