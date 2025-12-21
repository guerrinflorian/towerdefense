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

    // --- TEXTURES BIOME SABLE ---

    // tile_sand (Sable - ID 10)
    generateIfNotExists("tile_sand", () => {
      // Fond sable beige clair
      g.fillStyle(0xedc9af, 1);
      g.fillRect(0, 0, T, T);

      // Texture de sable (petits grains)
      g.fillStyle(0xd2b48c, 0.6);
      for (let i = 0; i < 50; i++) {
        const size = Math.random() * 2 + 1;
        g.fillCircle(Math.random() * T, Math.random() * T, size);
      }

      // Détails plus foncés
      g.fillStyle(0xbc8f5f, 0.4);
      for (let i = 0; i < 20; i++) {
        g.fillCircle(Math.random() * T, Math.random() * T, 1);
      }
    });

    // tile_sand_rock (Rochers de Sable - ID 11)
    generateIfNotExists("tile_sand_rock", () => {
      // Fond sable
      g.fillStyle(0xedc9af, 1);
      g.fillRect(0, 0, T, T);

      // Texture de sable
      g.fillStyle(0xd2b48c, 0.5);
      for (let i = 0; i < 40; i++) {
        const size = Math.random() * 2 + 1;
        g.fillCircle(Math.random() * T, Math.random() * T, size);
      }

      // Rochers (couleur beige/brun)
      g.fillStyle(0x8b7355, 1);
      // Rocher 1
      g.fillCircle(T * 0.3, T * 0.4, 8);
      g.fillStyle(0x6b5b4f, 0.8);
      g.fillCircle(T * 0.3, T * 0.4, 6);
      
      // Rocher 2
      g.fillStyle(0x8b7355, 1);
      g.fillCircle(T * 0.7, T * 0.6, 6);
      g.fillStyle(0x6b5b4f, 0.8);
      g.fillCircle(T * 0.7, T * 0.6, 4);

      // Rocher 3 (plus petit)
      g.fillStyle(0x8b7355, 1);
      g.fillCircle(T * 0.5, T * 0.8, 5);
      g.fillStyle(0x6b5b4f, 0.8);
      g.fillCircle(T * 0.5, T * 0.8, 3);

      // Ombres sous les rochers
      g.fillStyle(0x6b5b4f, 0.3);
      g.fillEllipse(T * 0.3, T * 0.5, 12, 4);
      g.fillEllipse(T * 0.7, T * 0.7, 10, 3);
      g.fillEllipse(T * 0.5, T * 0.9, 8, 2);
    });

    // --- TEXTURES BIOME CIMETIÈRE ---

    // tile_graveyard (Sol de Cimetière - ID 12)
    generateIfNotExists("tile_graveyard", () => {
      // Fond terre sombre
      g.fillStyle(0x2a1f1a, 1);
      g.fillRect(0, 0, T, T);

      // Texture de terre (petites mottes)
      g.fillStyle(0x1a1510, 0.7);
      for (let i = 0; i < 30; i++) {
        const size = Math.random() * 3 + 1;
        g.fillCircle(Math.random() * T, Math.random() * T, size);
      }

      // Détails plus foncés (creux)
      g.fillStyle(0x0f0a05, 0.5);
      for (let i = 0; i < 15; i++) {
        g.fillCircle(Math.random() * T, Math.random() * T, 2);
      }

      // Petites pierres/tombes
      g.fillStyle(0x3a3a3a, 0.8);
      for (let i = 0; i < 3; i++) {
        const x = Math.random() * T;
        const y = Math.random() * T;
        g.fillRect(x, y, 4, 2);
      }
    });

    // tile_graveyard_path (Chemin de Cimetière - ID 13)
    generateIfNotExists("tile_graveyard_path", () => {
      // Fond chemin sombre (pierre grise foncée)
      g.fillStyle(0x1a1a1a, 1);
      g.fillRect(0, 0, T, T);

      // Texture de pierre (fissures et détails)
      g.fillStyle(0x0f0f0f, 0.6);
      for (let i = 0; i < 40; i++) {
        const size = Math.random() * 2 + 1;
        g.fillCircle(Math.random() * T, Math.random() * T, size);
      }

      // Fissures sombres
      g.lineStyle(1, 0x0a0a0a, 0.8);
      for (let i = 0; i < 5; i++) {
        const sx = Math.random() * T;
        const sy = Math.random() * T;
        g.beginPath();
        g.moveTo(sx, sy);
        g.lineTo(sx + (Math.random() - 0.5) * 15, sy + (Math.random() - 0.5) * 15);
        g.strokePath();
      }

      // Bordure du chemin (pierre plus claire mais toujours sombre)
      g.fillStyle(0x2a2a2a, 0.6);
      g.fillRect(0, 0, T, 3);
      g.fillRect(0, T - 3, T, 3);
      g.fillRect(0, 0, 3, T);
      g.fillRect(T - 3, 0, 3, T);
    });

    // --- TEXTURES BIOME VOLCAN ---

    // tile_lava_path (Chemin Lave Noire - ID 14)
    generateIfNotExists("tile_lava_path", () => {
      // Fond lave noire/rouge foncé
      g.fillStyle(0x1a0a0a, 1);
      g.fillRect(0, 0, T, T);

      // Texture de lave noire avec reflets rouges
      g.fillStyle(0x2a0a0a, 0.8);
      for (let i = 0; i < 50; i++) {
        const size = Math.random() * 2 + 1;
        g.fillCircle(Math.random() * T, Math.random() * T, size);
      }

      // Reflets de lave rouge/orange
      g.fillStyle(0xff4400, 0.3);
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * T;
        const y = Math.random() * T;
        g.fillCircle(x, y, Math.random() * 3 + 1);
      }

      // Fissures lumineuses (lave qui brille)
      g.lineStyle(1, 0xff6600, 0.6);
      for (let i = 0; i < 6; i++) {
        const sx = Math.random() * T;
        const sy = Math.random() * T;
        g.beginPath();
        g.moveTo(sx, sy);
        g.lineTo(sx + (Math.random() - 0.5) * 12, sy + (Math.random() - 0.5) * 12);
        g.strokePath();
      }

      // Bordure du chemin (lave plus claire)
      g.fillStyle(0x3a1a1a, 0.5);
      g.fillRect(0, 0, T, 3);
      g.fillRect(0, T - 3, T, 3);
      g.fillRect(0, 0, 3, T);
      g.fillRect(T - 3, 0, 3, T);
    });

    // tile_volcanic_crevasse (Crevasses Volcaniques - ID 15)
    generateIfNotExists("tile_volcanic_crevasse", () => {
      // Fond roche volcanique sombre
      g.fillStyle(0x2a1a0a, 1);
      g.fillRect(0, 0, T, T);

      // Texture de roche volcanique
      g.fillStyle(0x1a0a05, 0.7);
      for (let i = 0; i < 40; i++) {
        const size = Math.random() * 3 + 1;
        g.fillCircle(Math.random() * T, Math.random() * T, size);
      }

      // Crevasses avec lueur de lave
      g.lineStyle(2, 0xff2200, 0.8);
      for (let i = 0; i < 4; i++) {
        const sx = Math.random() * T;
        const sy = Math.random() * T;
        g.beginPath();
        g.moveTo(sx, sy);
        g.lineTo(sx + (Math.random() - 0.5) * 20, sy + (Math.random() - 0.5) * 20);
        g.strokePath();
      }

      // Points de lueur rouge/orange dans les crevasses
      g.fillStyle(0xff4400, 0.5);
      for (let i = 0; i < 8; i++) {
        g.fillCircle(Math.random() * T, Math.random() * T, 2);
      }
    });

    // tile_volcanic_ground (Sol Roche Cramée - ID 16)
    generateIfNotExists("tile_volcanic_ground", () => {
      // Fond roche volcanique cramée (constructible)
      g.fillStyle(0x3a2a1a, 1);
      g.fillRect(0, 0, T, T);

      // Texture de roche avec variations
      g.fillStyle(0x2a1a0a, 0.6);
      for (let i = 0; i < 45; i++) {
        const size = Math.random() * 2 + 1;
        g.fillCircle(Math.random() * T, Math.random() * T, size);
      }

      // Détails plus clairs (roche cramée)
      g.fillStyle(0x4a3a2a, 0.4);
      for (let i = 0; i < 20; i++) {
        g.fillCircle(Math.random() * T, Math.random() * T, 1);
      }

      // Petites fissures sombres
      g.lineStyle(1, 0x1a0a05, 0.5);
      for (let i = 0; i < 4; i++) {
        const sx = Math.random() * T;
        const sy = Math.random() * T;
        g.beginPath();
        g.moveTo(sx, sy);
        g.lineTo(sx + (Math.random() - 0.5) * 10, sy + (Math.random() - 0.5) * 10);
        g.strokePath();
      }
    });

    // tile_flowing_lava (Lave qui Coule - ID 17)
    generateIfNotExists("tile_flowing_lava", () => {
      // Fond lave rouge/orange
      g.fillStyle(0xff4400, 1);
      g.fillRect(0, 0, T, T);

      // Texture de lave avec variations de couleur
      g.fillStyle(0xff6600, 0.7);
      for (let i = 0; i < 30; i++) {
        const size = Math.random() * 4 + 2;
        g.fillCircle(Math.random() * T, Math.random() * T, size);
      }

      // Zones plus sombres (lave refroidie)
      g.fillStyle(0xcc2200, 0.6);
      for (let i = 0; i < 15; i++) {
        g.fillCircle(Math.random() * T, Math.random() * T, Math.random() * 3 + 1);
      }

      // Zones plus claires (lave très chaude)
      g.fillStyle(0xffaa00, 0.5);
      for (let i = 0; i < 10; i++) {
        g.fillCircle(Math.random() * T, Math.random() * T, 2);
      }

      // Effet de mouvement (lignes de flux)
      g.lineStyle(1, 0xff8800, 0.4);
      for (let i = 0; i < 5; i++) {
        const sx = Math.random() * T;
        const sy = Math.random() * T;
        g.beginPath();
        g.moveTo(sx, sy);
        g.lineTo(sx + (Math.random() - 0.5) * 25, sy + (Math.random() - 0.5) * 25);
        g.strokePath();
      }
    });

    // Ne pas détruire l'objet Graphics ici car il peut être réutilisé
    // Il sera nettoyé automatiquement par Phaser quand la scène est détruite
  }
}
