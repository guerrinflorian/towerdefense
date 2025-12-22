import { CONFIG } from "../../config/settings.js";
import { TILE_TEXTURES } from "./textures/tiles/index.js";

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

    TILE_TEXTURES.forEach(({ key, draw }) => {
      generateIfNotExists(key, () => draw(g, T));
    });

    // Ne pas détruire l'objet Graphics ici car il peut être réutilisé
    // Il sera nettoyé automatiquement par Phaser quand la scène est détruite
  }
}
