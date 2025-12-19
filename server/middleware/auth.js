import jwt from "jsonwebtoken";

const AUTH_HEADER = "authorization";

export function authMiddleware(req, res, next) {
  const header = req.headers[AUTH_HEADER];
  if (!header) {
    return res.status(401).json({ error: "Token manquant" });
  }

  const [, token] = header.split(" ");

  if (!token) {
    return res.status(401).json({ error: "Format de token invalide" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalide" });
  }
}
