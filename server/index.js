import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import playerRoutes from "./routes/player.js";

dotenv.config();

const app = express();

const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:1234";

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API démarrée sur le port ${PORT}`);
});
