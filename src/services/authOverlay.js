import {
  ensureProfileLoaded,
  getProfile,
  handleAuthError,
  isAuthenticated,
  loginUser,
  registerUser,
} from "./authManager.js";

const overlay = document.getElementById("auth-overlay");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const switchToRegister = document.getElementById("show-register");
const switchToLogin = document.getElementById("show-login");
const loginErrorBox = document.getElementById("auth-error");
const registerErrorBox = document.getElementById("auth-error-register");
const authWelcome = document.getElementById("auth-welcome");

function showOverlay() {
  overlay?.classList.remove("hidden");
}

function hideOverlay() {
  overlay?.classList.add("hidden");
}

function renderWelcome() {
  if (!authWelcome) return;
  const profile = getProfile();
  if (profile?.player) {
    authWelcome.textContent = `Connecté en tant que ${profile.player.username}`;
  } else {
    authWelcome.textContent = "";
  }
}

function displayError(message, { isRegister } = {}) {
  const target = isRegister ? registerErrorBox : loginErrorBox;
  if (!target) return;
  if (message) {
    target.textContent = message;
    target.classList.remove("hidden");
  } else {
    target.textContent = "";
    target.classList.add("hidden");
  }
}

async function handleLogin(event) {
  event.preventDefault();
  displayError("");
  const formData = new FormData(loginForm);
  const identifier = formData.get("identifier");
  const password = formData.get("password");

  try {
    await loginUser({ identifier, password });
    renderWelcome();
    hideOverlay();
    window.dispatchEvent(new CustomEvent("auth:profile-updated"));
  } catch (error) {
    displayError(handleAuthError(error));
  }
}

async function handleRegister(event) {
  event.preventDefault();
  displayError("", { isRegister: true });
  const formData = new FormData(registerForm);
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    await registerUser({ username, email, password });
    renderWelcome();
    hideOverlay();
    window.dispatchEvent(new CustomEvent("auth:profile-updated"));
  } catch (error) {
    displayError(handleAuthError(error), { isRegister: true });
  }
}

function toggleForms(showRegisterForm) {
  document
    .getElementById("login-card")
    ?.classList.toggle("hidden", showRegisterForm);
  document
    .getElementById("register-card")
    ?.classList.toggle("hidden", !showRegisterForm);
  displayError("");
  displayError("", { isRegister: true });
}

export function setupAuthOverlay() {
  if (loginForm) loginForm.addEventListener("submit", handleLogin);
  if (registerForm) registerForm.addEventListener("submit", handleRegister);
  switchToRegister?.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms(true);
  });
  switchToLogin?.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms(false);
  });

  if (!isAuthenticated()) {
    showOverlay();
  } else {
    ensureProfileLoaded()
      .then(() => hideOverlay())
      .catch(() => showOverlay());
  }

  renderWelcome();
}

export function requireAuth() {
  if (!isAuthenticated()) {
    showOverlay();
    return false;
  }
  return true;
}

export function showAuth() {
  showOverlay();
}
