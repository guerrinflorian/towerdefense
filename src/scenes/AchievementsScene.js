/**
 * Scène Achievements - Utilise maintenant le composant Vue
 * Cette scène sert uniquement de pont pour charger les données et afficher le composant Vue
 */
import { fetchAchievements } from "../services/achievementsService.js";
import { showAchievements } from "../vue/bridge.js";

export class AchievementsScene extends Phaser.Scene {
  constructor() {
    super("AchievementsScene");
  }

  create() {
    // Charger les données et afficher le composant Vue
    this.loadAchievementsAndShow();
  }

  async loadAchievementsAndShow() {
    try {
      const { achievements, summary } = await fetchAchievements();

      showAchievements({
        achievements: achievements || [],
        summary: summary || { unlocked: 0, total: 0 },
        onClose: () => {
          // Retourner au menu principal quand fermé
          this.scene.start("MainMenuScene");
        },
      });
    } catch (error) {
      console.error("Erreur chargement achievements:", error);
      // En cas d'erreur, retourner au menu
      this.scene.start("MainMenuScene");
    }
  }
}
