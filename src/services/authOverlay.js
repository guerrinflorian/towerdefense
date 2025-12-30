import {
  ensureProfileLoaded,
  getProfile,
  handleAuthError,
  isAuthenticated,
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
  validateResetToken,
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
  forgot: {
    card: document.getElementById("forgot-card"),
    form: document.getElementById("forgot-form"),
    emailInput: document.getElementById("forgot-email"),
    error: document.getElementById("auth-error-forgot"),
    success: document.getElementById("auth-success-forgot"),
    submit: document.getElementById("forgot-submit"),
    countdown: document.getElementById("forgot-countdown"),
    backBtn: document.getElementById("back-to-login"),
  },
  reset: {
    card: document.getElementById("reset-card"),
    form: document.getElementById("reset-form"),
    emailInput: document.getElementById("reset-email"),
    usernameInput: document.getElementById("reset-username"),
    passwordInput: document.getElementById("reset-password"),
    confirmInput: document.getElementById("reset-password-confirm"),
    error: document.getElementById("auth-error-reset"),
    success: document.getElementById("auth-success-reset"),
    submit: document.getElementById("reset-submit"),
    backBtn: document.getElementById("reset-back-login"),
  },
  welcome: document.getElementById("auth-welcome"),
};

// --- Utilitaires UI ---
const toggleVisible = (el, isVisible) => el?.classList.toggle("hidden", !isVisible);
const disableElement = (el, disabled) => {
  if (!el) return;
  el.disabled = disabled;
};
const validateEmailFormat = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

const updateSuccess = (box, message = "") => {
  if (!box) return;
  box.textContent = message;
  toggleVisible(box, !!message);
};

const clearAllErrors = () => {
  updateError(UI.login.error);
  updateError(UI.register.error);
  updateError(UI.forgot.error);
  updateError(UI.reset.error);
  updateSuccess(UI.forgot.success);
  updateSuccess(UI.reset.success);
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
  } catch (error) {
    updateError(errorBox, handleAuthError(error));
  }
}

function switchForm(showRegister) {
  toggleVisible(UI.login.card, !showRegister);
  toggleVisible(UI.register.card, showRegister);
  toggleVisible(UI.forgot.card, false);
  toggleVisible(UI.reset.card, false);
  clearAllErrors();
}

function showForgotPassword() {
  toggleVisible(UI.login.card, false);
  toggleVisible(UI.register.card, false);
  toggleVisible(UI.reset.card, false);
  toggleVisible(UI.forgot.card, true);
  clearAllErrors();
  UI.forgot.form?.reset();
  updateSuccess(UI.forgot.success, "");
}

function showResetCard() {
  toggleVisible(UI.login.card, false);
  toggleVisible(UI.register.card, false);
  toggleVisible(UI.forgot.card, false);
  toggleVisible(UI.reset.card, true);
  clearAllErrors();
}

let resendTimer = null;
const RESEND_DELAY = 60;
let currentResetToken = null;

function startResendCountdown() {
  if (!UI.forgot.countdown || !UI.forgot.submit) return;
  let remaining = RESEND_DELAY;

  disableElement(UI.forgot.submit, true);
  UI.forgot.countdown.textContent = `Vous pourrez renvoyer un email dans ${remaining}s`;
  toggleVisible(UI.forgot.countdown, true);

  resendTimer && clearInterval(resendTimer);
  resendTimer = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(resendTimer);
      resendTimer = null;
      disableElement(UI.forgot.submit, false);
      toggleVisible(UI.forgot.countdown, false);
      return;
    }
    UI.forgot.countdown.textContent = `Vous pourrez renvoyer un email dans ${remaining}s`;
  }, 1000);
}

async function handleForgotSubmit(e) {
  e.preventDefault();
  clearAllErrors();
  const email = UI.forgot.emailInput?.value?.trim();

  if (!validateEmailFormat(email)) {
    updateError(UI.forgot.error, "Email invalide");
    return;
  }

  try {
    disableElement(UI.forgot.submit, true);
    await requestPasswordReset(email);
    updateSuccess(
      UI.forgot.success,
      "Un email de réinitialisation a été envoyé. Si un autre email est demandé, le lien précédent sera invalidé."
    );
    startResendCountdown();
  } catch (error) {
    disableElement(UI.forgot.submit, false);
    updateError(UI.forgot.error, handleAuthError(error));
  }
}

async function startResetFlow({ token, email }) {
  currentResetToken = token;
  toggleVisible(UI.overlay, true);
  toggleGameBlock(true);
  showResetCard();
  disableElement(UI.reset.submit, true);
  updateError(UI.reset.error, "");
  updateSuccess(UI.reset.success, "");

  try {
    const data = await validateResetToken({ token, email });
    if (UI.reset.emailInput) {
      UI.reset.emailInput.value = data.email;
    }
    if (UI.reset.usernameInput) {
      UI.reset.usernameInput.value = data.username;
    }
    disableElement(UI.reset.submit, false);
    if (window?.history?.replaceState) {
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState(null, "", cleanUrl);
    }
  } catch (error) {
    updateError(UI.reset.error, handleAuthError(error));
    currentResetToken = null;
  } finally {
    disableElement(UI.reset.submit, false);
  }
}

async function handleResetSubmit(e) {
  e.preventDefault();
  clearAllErrors();
  const email = UI.reset.emailInput?.value?.trim();
  const password = UI.reset.passwordInput?.value || "";
  const confirmPassword = UI.reset.confirmInput?.value || "";
  const token = currentResetToken;

  if (!token || !validateEmailFormat(email)) {
    updateError(UI.reset.error, "Lien invalide ou expiré");
    return;
  }
  if (password.length < 8) {
    updateError(UI.reset.error, "Le mot de passe doit contenir au moins 8 caractères");
    return;
  }
  if (password !== confirmPassword) {
    updateError(UI.reset.error, "Les mots de passe ne correspondent pas");
    return;
  }

  try {
    disableElement(UI.reset.submit, true);
    await resetPassword({ email, token, password, confirmPassword });
    updateSuccess(UI.reset.success, "Mot de passe mis à jour. Vous pouvez vous reconnecter.");
    switchForm(false);
    UI.login.form?.reset();
    currentResetToken = null;
  } catch (error) {
    updateError(UI.reset.error, handleAuthError(error));
  } finally {
    disableElement(UI.reset.submit, false);
  }
}

// --- API Publique ---
export function setupAuthOverlay() {
  // Events Submits
  UI.login.form?.addEventListener("submit", (e) => processAuth(loginUser, e, UI.login.error));
  UI.register.form?.addEventListener("submit", (e) => processAuth(registerUser, e, UI.register.error));
  UI.forgot.form?.addEventListener("submit", handleForgotSubmit);
  UI.reset.form?.addEventListener("submit", handleResetSubmit);

  // Events Toggle
  UI.register.switchBtn?.addEventListener("click", (e) => (e.preventDefault(), switchForm(true)));
  UI.login.switchBtn?.addEventListener("click", (e) => (e.preventDefault(), switchForm(false)));
  document
    .getElementById("forgot-password-link")
    ?.addEventListener("click", (e) => (e.preventDefault(), showForgotPassword()));
  document
    .getElementById("forgot-password-link-register")
    ?.addEventListener("click", (e) => (e.preventDefault(), showForgotPassword()));
  UI.forgot.backBtn?.addEventListener("click", (e) => (e.preventDefault(), switchForm(false)));
  UI.reset.backBtn?.addEventListener("click", (e) => (e.preventDefault(), switchForm(false)));

  // État Initial
  if (!isAuthenticated()) {
    toggleVisible(UI.overlay, true);
    toggleGameBlock(true);
  } else {
    ensureProfileLoaded()
      .then(() => {
        toggleVisible(UI.overlay, false);
        toggleGameBlock(false);
      })
      .catch(() => {
        toggleVisible(UI.overlay, true);
        toggleGameBlock(true);
      });
  }

  const params = new URLSearchParams(window.location.search);
  const resetToken = params.get("token");
  const resetEmail = params.get("email");

  if (resetToken && resetEmail) {
    showResetCard();
    startResetFlow({ token: resetToken, email: resetEmail });
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
