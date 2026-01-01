<template>
  <div
    id="auth-overlay"
    class="auth-overlay"
    :class="{ hidden: !state.showOverlay }"
    aria-live="polite"
  >
    <div v-if="isLoginMode" class="auth-card">
      <h2>Connexion</h2>
      <div class="hint" v-if="profileName">Connecté en tant que {{ profileName }}</div>
      <div v-if="state.errors.login" class="error">{{ state.errors.login }}</div>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="identifier">Email ou pseudo</label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            v-model="state.login.identifier"
            required
          />
        </div>
        <div>
          <label for="password">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            v-model="state.login.password"
            required
          />
        </div>
        <button type="submit" :disabled="state.loading">Se connecter</button>
      </form>
      <p class="hint">
        Pas encore de compte ?
        <a href="#" class="link" @click.prevent="() => switchMode('register')">Créer un compte</a>
      </p>
      <p class="hint small">
        <a href="#" class="link" @click.prevent="() => switchMode('forgot')">Mot de passe oublié ?</a>
      </p>
    </div>

    <div v-else-if="isRegisterMode" class="auth-card">
      <h2>Créer un compte</h2>
      <div v-if="state.errors.register" class="error">{{ state.errors.register }}</div>
      <form @submit.prevent="handleRegister">
        <div>
          <label for="username">Nom d'utilisateur (max 15 caractères)</label>
          <input
            id="username"
            name="username"
            v-model="state.register.username"
            maxlength="15"
            required
          />
        </div>
        <div>
          <label for="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            v-model="state.register.email"
            required
          />
        </div>
        <div>
          <label for="register-password">Mot de passe (8+ caractères)</label>
          <input
            id="register-password"
            name="password"
            type="password"
            v-model="state.register.password"
            minlength="8"
            required
          />
        </div>
        <button type="submit" :disabled="state.loading">Créer mon compte</button>
      </form>
      <p class="hint">
        Déjà inscrit ?
        <a href="#" class="link" @click.prevent="() => switchMode('login')">Se connecter</a>
      </p>
      <p class="hint small">
        <a href="#" class="link" @click.prevent="() => switchMode('forgot')">Mot de passe oublié ?</a>
      </p>
    </div>

    <div v-else-if="isForgotMode" class="auth-card">
      <h2>Mot de passe oublié</h2>
      <div v-if="state.errors.forgot" class="error">{{ state.errors.forgot }}</div>
      <div v-if="state.success.forgot" class="success">{{ state.success.forgot }}</div>
      <form @submit.prevent="handleForgot">
        <div>
          <label for="forgot-email">Adresse email du compte</label>
          <input
            id="forgot-email"
            name="email"
            type="email"
            v-model="state.forgot.email"
            required
          />
        </div>
        <button id="forgot-submit" type="submit" :disabled="state.loading || state.resendCountdown > 0">
          <template v-if="state.resendCountdown > 0">
            Renvoyer dans {{ state.resendCountdown }}s
          </template>
          <template v-else>
            Envoyer le lien
          </template>
        </button>
        <div v-if="state.resendCountdown > 0" class="hint small">
          Vous pourrez renvoyer un email dans {{ state.resendCountdown }}s
        </div>
      </form>
      <p class="hint">
        <a href="#" class="link" @click.prevent="() => switchMode('login')">Retour à la connexion</a>
      </p>
    </div>

    <div v-else class="auth-card">
      <h2>Réinitialiser le mot de passe</h2>
      <div v-if="state.errors.reset" class="error">{{ state.errors.reset }}</div>
      <div v-if="state.success.reset" class="success">{{ state.success.reset }}</div>
      <form @submit.prevent="handleReset">
        <div>
          <label for="reset-email">Adresse email</label>
          <input id="reset-email" type="email" v-model="state.reset.email" disabled />
        </div>
        <div>
          <label for="reset-username">Pseudo</label>
          <input id="reset-username" type="text" v-model="state.reset.username" disabled />
        </div>
        <div>
          <label for="reset-password">Nouveau mot de passe</label>
          <input
            id="reset-password"
            type="password"
            minlength="8"
            v-model="state.reset.password"
            required
          />
        </div>
        <div>
          <label for="reset-password-confirm">Confirmer le mot de passe</label>
          <input
            id="reset-password-confirm"
            type="password"
            minlength="8"
            v-model="state.reset.confirm"
            required
          />
        </div>
        <button id="reset-submit" type="submit" :disabled="state.loading">Mettre à jour</button>
      </form>
      <p class="hint">
        <a href="#" class="link" @click.prevent="() => switchMode('login')">Retour à la connexion</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue/dist/vue.esm-bundler.js';
import { useAuthStore } from '../stores/authStore.js';

const store = useAuthStore();
const state = store.state;
const profileName = store.profileName;

const isLoginMode = store.isLoginMode;
const isRegisterMode = store.isRegisterMode;
const isForgotMode = store.isForgotMode;
const isResetMode = store.isResetMode;

const switchMode = (mode) => store.switchMode(mode);
const handleLogin = () => store.handleLogin();
const handleRegister = () => store.handleRegister();
const handleForgot = () => store.handleForgot();
const handleReset = () => store.handleReset();

onMounted(() => {
  store.initialize();
});
</script>

<style scoped>
#auth-overlay {
  pointer-events: auto;
}
</style>
