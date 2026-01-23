import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.js";
import playerRoutes from "./routes/player.js";
import chapterRoutes from "./routes/chapters.js";
import runReportRoutes from "./routes/runReport.js";
import achievementRoutes from "./routes/achievements.js";
import profileRoutes from "./routes/profile.js";

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

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const normalizedOrigin = origin.replace(/\/$/, "");
  return (
    allowedOrigins.includes(normalizedOrigin) ||
    /^https?:\/\/([a-z0-9-]+\.)?last-outpost\.vercel\.app$/i.test(
      normalizedOrigin
    ) ||
    /^https?:\/\/([a-z0-9-]+\.)?last-outpost\.fr$/i.test(normalizedOrigin)
  );
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: false,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/health", (_req, res) => res.status(200).send("ok"));
app.use("/api/auth", authRoutes);
app.use("/api/player", playerRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/run-report", runReportRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/profile", profileRoutes);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: false,
  },
  pingInterval: 25000,
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    // socket cleanup hook if needed
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`API démarrée sur le port ${PORT}`);
});
