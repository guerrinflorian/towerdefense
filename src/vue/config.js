/**
 * Configuration des feature flags Vue pour Parcel
 * Ces flags doivent être définis avant l'import de Vue
 */

// Définir les feature flags Vue globalement
if (typeof globalThis !== 'undefined') {
  globalThis.__VUE_OPTIONS_API__ = true;
  globalThis.__VUE_PROD_DEVTOOLS__ = false;
  globalThis.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;
}

// Pour compatibilité navigateur
if (typeof window !== 'undefined') {
  window.__VUE_OPTIONS_API__ = true;
  window.__VUE_PROD_DEVTOOLS__ = false;
  window.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;
}
