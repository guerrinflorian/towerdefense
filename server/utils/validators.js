export function validateEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password) {
  return typeof password === "string" && password.length >= 8;
}

export function validateUsername(username) {
  if (typeof username !== "string") return false;
  const trimmed = username.trim();
  return trimmed.length >= 3 && trimmed.length <= 15;
}

export function sanitizeIdentifier(identifier) {
  return typeof identifier === "string" ? identifier.trim().toLowerCase() : "";
}
