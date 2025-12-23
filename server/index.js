import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import playerRoutes from "./routes/player.js";
import chapterRoutes from "./routes/chapters.js";
import runReportRoutes from "./routes/runReport.js";
import achievementRoutes from "./routes/achievements.js";

dotenv.config();

const app = express();

const envOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultAllowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://last-outpost.vercel.app",
  "https://www.last-outpost.vercel.app",
  "https://last-outpost.fr",
  "https://www.last-outpost.fr",
];

const allowedOrigins = Array.from(
  new Set([...envOrigins, ...defaultAllowedOrigins])
).map((origin) => origin.replace(/\/$/, ""));

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, "");
    const isWhitelisted =
      allowedOrigins.includes(normalizedOrigin) ||
      /^https?:\/\/([a-z0-9-]+\.)?last-outpost\.vercel\.app$/i.test(
        normalizedOrigin
      ) ||
      /^https?:\/\/([a-z0-9-]+\.)?last-outpost\.fr$/i.test(
        normalizedOrigin
      );

    if (isWhitelisted) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: false,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/player", playerRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/run-report", runReportRoutes);
app.use("/api/achievements", achievementRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API démarrée sur le port ${PORT}`);
});
