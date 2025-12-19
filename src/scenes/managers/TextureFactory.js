import { CONFIG } from "../../config/settings.js";

export class TextureFactory {
  static generate(scene) {
    const T = CONFIG.TILE_SIZE;

    // Vérifier que le système de textures est disponible
    if (!scene.textures || !scene.make) {
      console.warn("Système de textures non disponible");
      return;
    }

    const g = scene.make.graphics({ add: false });
    if (!g) {
      console.warn("Impossible de créer l'objet Graphics");
      return;
    }

    // Fonction helper pour générer une texture seulement si elle n'existe pas
    const generateIfNotExists = (key, drawFunc) => {
      try {
        if (!scene.textures || !g) {
          console.warn(
            `Système de textures ou Graphics non disponible pour ${key}`
          );
          return;
        }
        if (scene.textures.exists(key)) {
          return; // Texture déjà existante, ne pas regénérer
        }
        if (g.active === false || !g.clear) {
          console.warn(
            `Graphics object détruit ou invalide, impossible de générer ${key}`
          );
          return;
        }
        g.clear();
        drawFunc();
        // Vérifier que g est toujours valide avant de générer
        if (g && g.active !== false && g.generateTexture) {
          g.generateTexture(key, T, T);
        }
      } catch (e) {
        console.warn(`Erreur lors de la génération de la texture ${key}:`, e);
      }
    };

    // tile_grass_1
    generateIfNotExists("tile_grass_1", () => {
      g.fillStyle(0x2d8a3e, 1);
      g.fillRect(0, 0, T, T);
      for (let i = 0; i < 40; i++) {
        g.fillStyle(0x3da850, 0.5);
        g.fillRect(Math.random() * T, Math.random() * T, 2, 2);
      }
    });

    // tile_grass_2
    generateIfNotExists("tile_grass_2", () => {
      g.fillStyle(0x267534, 1);
      g.fillRect(0, 0, T, T);
      for (let i = 0; i < 40; i++) {
        g.fillStyle(0x3da850, 0.3);
        g.fillRect(Math.random() * T, Math.random() * T, 2, 2);
      }
    });

    // tile_path
    generateIfNotExists("tile_path", () => {
      g.fillStyle(0xdbb679, 1);
      g.fillRect(0, 0, T, T);
      g.fillStyle(0xbf9b5e, 0.6);
      for (let i = 0; i < 60; i++)
        g.fillRect(Math.random() * T, Math.random() * T, 3, 3);
      g.fillStyle(0xa88548, 0.8);
      g.fillRect(0, 0, T, 4);
      g.fillRect(0, T - 4, T, 4);
      g.fillRect(0, 0, 4, T);
      g.fillRect(T - 4, 0, 4, T);
    });

    // tile_base
    generateIfNotExists("tile_base", () => {
      g.fillStyle(0x333333, 1);
      g.fillRect(0, 0, T, T);
      g.lineStyle(3, 0x00ffff, 1);
      g.strokeRect(6, 6, T - 12, T - 12);
      g.fillStyle(0x00ffff, 0.5);
      g.fillCircle(T / 2, T / 2, 10);
    });

    // tile_water
    generateIfNotExists("tile_water", () => {
      g.fillStyle(0x4488ff, 1);
      g.fillRect(0, 0, T, T);
      g.lineStyle(2, 0xffffff, 0.3);
      g.beginPath();
      g.moveTo(10, 20);
      g.lineTo(25, 20);
      g.strokePath();
      g.beginPath();
      g.moveTo(40, 50);
      g.lineTo(55, 50);
      g.strokePath();
    });

    // tile_bridge
    generateIfNotExists("tile_bridge", () => {
      g.fillStyle(0x4488ff, 1);
      g.fillRect(0, 0, T, T);
      g.fillStyle(0x8b5a2b, 1);
      g.fillRect(4, 0, T - 8, T);
      g.lineStyle(2, 0x5c3a1e, 1);
      g.beginPath();
      g.moveTo(4, 16);
      g.lineTo(T - 4, 16);
      g.strokePath();
      g.beginPath();
      g.moveTo(4, 32);
      g.lineTo(T - 4, 32);
      g.strokePath();
      g.beginPath();
      g.moveTo(4, 48);
      g.lineTo(T - 4, 48);
      g.strokePath();
    });

    // tile_mountain
    generateIfNotExists("tile_mountain", () => {
      // Fond rocheux
      g.fillStyle(0x6b5b4f, 1);
      g.fillRect(0, 0, T, T);
      // Texture de roche
      g.fillStyle(0x5a4b3f, 0.8);
      for (let i = 0; i < 15; i++) {
        g.fillRect(Math.random() * T, Math.random() * T, 3, 3);
      }
      // Détails de roche plus clairs
      g.fillStyle(0x7b6b5f, 0.6);
      for (let i = 0; i < 8; i++) {
        g.fillRect(Math.random() * T, Math.random() * T, 2, 2);
      }
      // Bordure sombre
      g.lineStyle(1, 0x4a3d32, 0.5);
      g.strokeRect(0, 0, T, T);
    });

    // --- TEXTURES BIOME NEIGE ---

    // tile_snow_1 (Sol Neige - ID 6 & 9)
    generateIfNotExists("tile_snow_1", () => {
      // Fond blanc légèrement bleuté (AliceBlue)
      g.fillStyle(0xf0f8ff, 1);
      g.fillRect(0, 0, T, T);

      // Texture de neige (petits points gris/bleu clair)
      g.fillStyle(0xdbe9f4, 0.8);
      for (let i = 0; i < 40; i++) {
        const size = Math.random() * 3 + 1;
        g.fillCircle(Math.random() * T, Math.random() * T, size);
      }
    });

    // tile_snow_path (Chemin Glacé - ID 7)
    generateIfNotExists("tile_snow_path", () => {
      // Fond glace (PowderBlue)
      g.fillStyle(0xb0e0e6, 1);
      g.fillRect(0, 0, T, T);

      // Effet de traces/rayures sur la glace
      g.lineStyle(1, 0xffffff, 0.6);
      for (let i = 0; i < 10; i++) {
        const sx = Math.random() * T;
        const sy = Math.random() * T;
        g.beginPath();
        g.moveTo(sx, sy);
        g.lineTo(
          sx + (Math.random() - 0.5) * 20,
          sy + (Math.random() - 0.5) * 20
        );
        g.strokePath();
      }

      // Bordure du chemin (neige tassée)
      g.fillStyle(0xe0ffff, 0.5);
      g.fillRect(0, 0, T, 3);
      g.fillRect(0, T - 3, T, 3);
      g.fillRect(0, 0, 3, T);
      g.fillRect(T - 3, 0, 3, T);
    });

    // tile_ice_water (Eau Gelée / Trou - ID 8)
    generateIfNotExists("tile_ice_water", () => {
      // Eau sombre en dessous
      g.fillStyle(0x4682b4, 1); // SteelBlue
      g.fillRect(0, 0, T, T);

      // Couche de glace par dessus (semi-transparente)
      g.fillStyle(0xaaddff, 0.7);
      g.fillRect(0, 0, T, T);

      // Fissures bleues foncées
      g.lineStyle(2, 0x2f4f4f, 0.5);
      g.beginPath();
      g.moveTo(0, Math.random() * T);
      g.lineTo(T / 2, T / 2);
      g.lineTo(T, Math.random() * T);
      g.strokePath();

      // Reflets blancs
      g.fillStyle(0xffffff, 0.6);
      g.fillCircle(T * 0.2, T * 0.2, 3);
      g.fillCircle(T * 0.7, T * 0.6, 2);
    });

    // Ne pas détruire l'objet Graphics ici car il peut être réutilisé
    // Il sera nettoyé automatiquement par Phaser quand la scène est détruite
  }
}
