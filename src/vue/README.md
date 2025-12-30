# Vue 3 Integration

Cette structure Vue 3 gère tous les overlays et modales du jeu, en remplacement des interfaces Phaser.

## Structure

```
vue/
├── app.js                    # Application Vue principale
├── bridge.js                 # Communication Vue ↔ Phaser
├── stores/
│   └── modalStore.js        # Store pour gérer l'état des modales
└── components/
    ├── GameResultOverlay.vue    # Overlay victoire/défaite
    ├── HeroSelectionModal.vue    # Modale sélection de héros
    └── AchievementsPage.vue      # Page des achievements
```

## Utilisation depuis Phaser

```javascript
import { 
  showGameResult, 
  showHeroSelection, 
  showAchievements 
} from '../vue/bridge.js';

// Afficher un résultat de jeu
showGameResult('victory', 'Félicitations !', () => {
  // Callback quand l'utilisateur clique sur continuer
  scene.start('MainMenuScene');
});

// Afficher la sélection de héros
showHeroSelection({
  heroes: heroesList,
  selectedHeroId: currentHeroId,
  heroPointsAvailable: points,
  onSelect: (heroId) => {
    // Sélectionner le héros
  },
  onUnlock: (heroId) => {
    // Débloquer le héros
  }
});

// Afficher les achievements
showAchievements({
  achievements: achievementsList,
  summary: { unlocked: 10, total: 50 },
  onClose: () => {
    // Callback quand fermé
  }
});
```

## Installation

```bash
npm install
```

Vue 3 est déjà ajouté au package.json.

## Notes

- Les composants Vue sont montés dans un conteneur séparé du canvas Phaser
- Le z-index est géré pour que Vue soit au-dessus de Phaser
- Le blocage du jeu se fait via la classe CSS `.blocked` sur `#game-container`

