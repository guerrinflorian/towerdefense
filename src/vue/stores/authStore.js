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
} from '../../services/authManager.js';
import { reactive, computed } from 'vue/dist/vue.esm-bundler.js';

const state = reactive({
  showOverlay: false,
  mode: 'login',
  loading: false,
  errors: {
    login: '',
    register: '',
    forgot: '',
    reset: '',
  },
  success: {
    forgot: '',
    reset: '',
  },
  login: {
    identifier: '',
    password: '',
  },
  register: {
    username: '',
    email: '',
    password: '',
  },
  forgot: {
    email: '',
  },
  reset: {
    email: '',
    username: '',
    password: '',
    confirm: '',
    token: null,
  },
  resendCountdown: 0,
  resendTimer: null,
  initialized: false,
});

function blockGame(block) {
  const gameContainer = document.getElementById('game-container');
  if (gameContainer) {
    gameContainer.classList.toggle('blocked', block);
  }
}

function goToMainMenu() {
  const sceneManager = window.game?.scene;
  if (!sceneManager) return;
  sceneManager.stop('GameScene');
  sceneManager.stop('MapScene');
  sceneManager.start('MainMenuScene');
}

function clearMessages() {
  state.errors.login = '';
  state.errors.register = '';
  state.errors.forgot = '';
  state.errors.reset = '';
  state.success.forgot = '';
  state.success.reset = '';
}

function startResendCountdown() {
  state.resendCountdown = 60;
  if (state.resendTimer) {
    clearInterval(state.resendTimer);
  }
  state.resendTimer = setInterval(() => {
    state.resendCountdown -= 1;
    if (state.resendCountdown <= 0) {
      clearInterval(state.resendTimer);
      state.resendTimer = null;
      state.resendCountdown = 0;
    }
  }, 1000);
}

export function useAuthStore() {
  const isLoginMode = computed(() => state.mode === 'login');
  const isRegisterMode = computed(() => state.mode === 'register');
  const isForgotMode = computed(() => state.mode === 'forgot');
  const isResetMode = computed(() => state.mode === 'reset');

  const open = (mode = 'login') => {
    state.mode = mode;
    state.showOverlay = true;
    blockGame(true);
  };

  const close = () => {
    state.showOverlay = false;
    blockGame(false);
  };

  const switchMode = (mode) => {
    clearMessages();
    state.mode = mode;
  };

  const requireAuth = () => {
    if (!isAuthenticated()) {
      open('login');
      return false;
    }
    return true;
  };

  const initialize = async () => {
    if (state.initialized) return;
    state.initialized = true;
    clearMessages();
    const params = new URLSearchParams(window.location.search);
    const resetToken = params.get('token');
    const resetEmail = params.get('email');

    if (!isAuthenticated()) {
      open('login');
    } else {
      try {
        await ensureProfileLoaded();
        close();
        goToMainMenu();
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        open('login');
      }
    }

    if (resetToken && resetEmail) {
      await startResetFlow(resetToken, resetEmail);
    }
  };

  const handleLogin = async () => {
    clearMessages();
    state.loading = true;
    try {
      await loginUser({ ...state.login });
      await ensureProfileLoaded();
      window.dispatchEvent(new CustomEvent('auth:profile-updated'));
      close();
      goToMainMenu();
    } catch (error) {
      state.errors.login = handleAuthError(error);
    } finally {
      state.loading = false;
    }
  };

  const handleRegister = async () => {
    clearMessages();
    state.loading = true;
    try {
      await registerUser({ ...state.register });
      await ensureProfileLoaded();
      window.dispatchEvent(new CustomEvent('auth:profile-updated'));
      close();
      goToMainMenu();
    } catch (error) {
      state.errors.register = handleAuthError(error);
    } finally {
      state.loading = false;
    }
  };

  const handleForgot = async () => {
    clearMessages();
    state.loading = true;
    try {
      await requestPasswordReset(state.forgot.email);
      state.success.forgot =
        "Un email de réinitialisation a été envoyé. Si un autre email est demandé, le lien précédent sera invalidé.";
      startResendCountdown();
    } catch (error) {
      state.errors.forgot = handleAuthError(error);
    } finally {
      state.loading = false;
    }
  };

  const startResetFlow = async (token, email) => {
    clearMessages();
    state.mode = 'reset';
    state.showOverlay = true;
    blockGame(true);
    state.reset.token = token;
    try {
      const data = await validateResetToken({ token, email });
      state.reset.email = data.email;
      state.reset.username = data.username;
      const cleanUrl = window.location.pathname + window.location.hash;
      if (window?.history?.replaceState) {
        window.history.replaceState(null, '', cleanUrl);
      }
    } catch (error) {
      state.errors.reset = handleAuthError(error);
    }
  };

  const handleReset = async () => {
    clearMessages();
    if (!state.reset.token || !state.reset.email) {
      state.errors.reset = 'Lien invalide ou expiré';
      return;
    }
    if (!state.reset.password || state.reset.password.length < 8) {
      state.errors.reset = 'Le mot de passe doit contenir au moins 8 caractères';
      return;
    }
    if (state.reset.password !== state.reset.confirm) {
      state.errors.reset = 'Les mots de passe ne correspondent pas';
      return;
    }

    state.loading = true;
    try {
      await resetPassword({
        email: state.reset.email,
        token: state.reset.token,
        password: state.reset.password,
        confirmPassword: state.reset.confirm,
      });
      state.success.reset = 'Mot de passe mis à jour. Vous pouvez vous reconnecter.';
      switchMode('login');
      state.login.identifier = state.reset.email;
    } catch (error) {
      state.errors.reset = handleAuthError(error);
    } finally {
      state.loading = false;
    }
  };

  const profileName = computed(() => {
    const profile = getProfile();
    return profile?.player?.username || '';
  });

  return {
    state,
    isLoginMode,
    isRegisterMode,
    isForgotMode,
    isResetMode,
    profileName,
    open,
    close,
    switchMode,
    requireAuth,
    initialize,
    handleLogin,
    handleRegister,
    handleForgot,
    handleReset,
    startResetFlow,
  };
}
