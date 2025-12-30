/**
 * Exemples d'utilisation des composants Vue depuis Phaser
 * 
 * Ces fonctions peuvent être appelées depuis n'importe quelle scène Phaser
 */

import { 
  showGameResult, 
  showHeroSelection, 
  showAchievements,
  hideGameResult,
  hideHeroSelection,
  hideAchievements,
} from './bridge.js';
import { fetchHeroes } from '../services/heroService.js';
import { fetchAchievements } from '../services/achievementsService.js';
import { getSelectedHeroId, getHeroPointsAvailable } from '../services/authManager.js';

/**
 * Exemple : Afficher l'overlay de victoire
 */
export async function exampleShowVictory(scene) {
  showGameResult('victory', 'Félicitations ! Vous avez terminé le niveau avec succès.', () => {
    scene.scene.start('MainMenuScene');
  });
}

/**
 * Exemple : Afficher l'overlay de défaite
 */
export async function exampleShowDefeat(scene) {
  showGameResult('defeat', 'Votre base a été détruite. Essayez encore !', () => {
    scene.scene.start('MainMenuScene');
  });
}

/**
 * Exemple : Afficher la modale de sélection de héros
 */
export async function exampleShowHeroSelection(scene) {
  try {
    const response = await fetchHeroes();
    const heroes = response?.heroes || [];
    const selectedHeroId = getSelectedHeroId();
    const heroPointsAvailable = getHeroPointsAvailable() || 0;

    showHeroSelection({
      heroes,
      selectedHeroId,
      heroPointsAvailable,
      onSelect: async (heroId) => {
        // Importer et utiliser votre fonction de sélection
        const { setSelectedHeroId } = await import('../services/authManager.js');
        setSelectedHeroId(heroId);
        console.log('Héros sélectionné:', heroId);
        // Rafraîchir l'UI si nécessaire
        window.dispatchEvent(new CustomEvent('hero:selected', { detail: { heroId } }));
      },
      onUnlock: async (heroId) => {
        // Importer et utiliser votre fonction de déblocage
        const { unlockHero } = await import('../services/heroService.js');
        try {
          await unlockHero(heroId);
          console.log('Héros débloqué:', heroId);
          // Rafraîchir la liste
          window.dispatchEvent(new CustomEvent('hero:unlocked', { detail: { heroId } }));
        } catch (error) {
          console.error('Erreur déblocage héros:', error);
        }
      },
      onClose: () => {
        console.log('Modale fermée');
      },
    });
  } catch (error) {
    console.error('Erreur chargement héros:', error);
  }
}

/**
 * Exemple : Afficher la page des achievements
 */
export async function exampleShowAchievements(scene) {
  try {
    const { achievements, summary } = await fetchAchievements();

    showAchievements({
      achievements: achievements || [],
      summary: summary || { unlocked: 0, total: 0 },
      onClose: () => {
        console.log('Page achievements fermée');
        // Retourner au menu si nécessaire
        // scene.scene.start('MainMenuScene');
      },
    });
  } catch (error) {
    console.error('Erreur chargement achievements:', error);
  }
}

/**
 * Utilisation dans une scène Phaser :
 * 
 * import { exampleShowVictory, exampleShowHeroSelection } from '../vue/examples.js';
 * 
 * // Dans votre scène
 * exampleShowVictory(this);
 * exampleShowHeroSelection(this);
 */

