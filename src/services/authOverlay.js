import { useAuthStore } from "../vue/stores/authStore.js";

const store = useAuthStore();

export function setupAuthOverlay() {
  store.initialize();
}

export const requireAuth = () => {
  return store.requireAuth();
};

export const showAuth = () => {
  store.open("login");
};
