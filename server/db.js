import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL manquant dans les variables d'environnement");
}

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

pool.on("error", (err) => {
  console.error("Erreur inattendue du pool PostgreSQL", err);
});

export const query = (text, params) => pool.query(text, params);
