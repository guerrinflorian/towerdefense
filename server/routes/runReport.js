import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  try {
    console.log("Run report reçu:", JSON.stringify(req.body, null, 2));
  } catch (err) {
    console.log("Run report (payload non sérialisable)", err);
  }
  return res.status(200).json({ status: "ok" });
});

export default router;
