import {
  ensureProfileLoaded,
  getProfile,
  handleAuthError,
  isAuthenticated,
  loginUser,
  registerUser,
} from "./authManager.js";

// --- Sélecteurs ---
const UI = {
  overlay: document.getElementById("auth-overlay"),
  login: {
    form: document.getElementById("login-form"),
    card: document.getElementById("login-card"),
    error: document.getElementById("auth-error"),
    switchBtn: document.getElementById("show-login"),
  },
  register: {
    form: document.getElementById("register-form"),
    card: document.getElementById("register-card"),
    error: document.getElementById("auth-error-register"),
    switchBtn: document.getElementById("show-register"),
  },
  welcome: document.getElementById("auth-welcome"),
};

// --- Utilitaires UI ---
const toggleVisible = (el, isVisible) => el?.classList.toggle("hidden", !isVisible);

const toggleGameBlock = (block) => {
  const gameContainer = document.getElementById("game-container");
  if (gameContainer) {
    gameContainer.classList.toggle("blocked", block);
  }
};

const updateError = (errorBox, message = "") => {
  if (!errorBox) return;
  errorBox.textContent = message;
  toggleVisible(errorBox, !!message);
};

const clearAllErrors = () => {
  updateError(UI.login.error);
  updateError(UI.register.error);
};

const goToMainMenu = () => {
  const sceneManager = window.game?.scene;
  if (!sceneManager) return;

  sceneManager.stop("GameScene");
  sceneManager.stop("MapScene");
  sceneManager.start("MainMenuScene");
};

// --- Actions ---
function renderWelcome() {
  if (!UI.welcome) return;
  const profile = getProfile();
  UI.welcome.textContent = profile?.player ? `Connecté en tant que ${profile.player.username}` : "";
}

async function processAuth(action, event, errorBox) {
  event.preventDefault();
  updateError(errorBox, ""); // Reset erreur

  const data = Object.fromEntries(new FormData(event.target));

  try {
    await action(data);
    renderWelcome();
    toggleVisible(UI.overlay, false);
    toggleGameBlock(false);
    window.dispatchEvent(new CustomEvent("auth:profile-updated"));
    
    goToMainMenu();
  } catch (error) {
    updateError(errorBox, handleAuthError(error));
  }
}

function switchForm(showRegister) {
  toggleVisible(UI.login.card, !showRegister);
  toggleVisible(UI.register.card, showRegister);
  clearAllErrors();
}

// --- API Publique ---
export function setupAuthOverlay() {
  // Events Submits
  UI.login.form?.addEventListener("submit", (e) => processAuth(loginUser, e, UI.login.error));
  UI.register.form?.addEventListener("submit", (e) => processAuth(registerUser, e, UI.register.error));

  // Events Toggle
  UI.register.switchBtn?.addEventListener("click", (e) => (e.preventDefault(), switchForm(true)));
  UI.login.switchBtn?.addEventListener("click", (e) => (e.preventDefault(), switchForm(false)));

  // État Initial
  if (!isAuthenticated()) {
    toggleVisible(UI.overlay, true);
    toggleGameBlock(true);
  } else {
    ensureProfileLoaded()
      .then(() => {
        toggleVisible(UI.overlay, false);
        toggleGameBlock(false);
        goToMainMenu();
      })
      .catch(() => {
        toggleVisible(UI.overlay, true);
        toggleGameBlock(true);
      });
  }

  renderWelcome();
}

export const requireAuth = () => {
  if (!isAuthenticated()) {
    toggleVisible(UI.overlay, true);
    toggleGameBlock(true);
    return false;
  }
  return true;
};

export const showAuth = () => {
  toggleVisible(UI.overlay, true);
  toggleGameBlock(true);
};
