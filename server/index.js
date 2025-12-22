import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import playerRoutes from "./routes/player.js";
import chapterRoutes from "./routes/chapters.js";

dotenv.config();

const app = express();

const allowedOrigin = process.env.CLIENT_ORIGIN;

app.use(
  cors({
    origin: allowedOrigin,
    credentials: false,
  })
);
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/player", playerRoutes);
app.use("/api/chapters", chapterRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API démarrée sur le port ${PORT}`);
});
