<template>
  <div class="help-page">
    <div class="help-content">
      <aside class="help-sidebar">
        <nav class="help-nav">
          <button
            class="help-nav-item"
            :class="{ active: currentSection === 'general' }"
            @click="currentSection = 'general'"
          >
            Général
          </button>
          <button
            class="help-nav-item"
            :class="{ active: currentSection === 'turrets' }"
            @click="currentSection = 'turrets'"
          >
            Tourelles
          </button>
          <button
            class="help-nav-item"
            :class="{ active: currentSection === 'enemies' }"
            @click="currentSection = 'enemies'"
          >
            Monstres
          </button>
        </nav>
      </aside>

      <main class="help-main">
        <div v-if="currentSection === 'general'" class="help-section">
          <h2 class="section-title">Guide du Jeu</h2>
          
          <div class="general-content">
            <section class="info-section">
              <h3 class="info-title">🎯 Objectif du Jeu</h3>
              <p class="info-text">
                <strong>Tower Defense</strong> : Votre mission est de défendre votre base contre des vagues d'ennemis qui tentent de l'atteindre.
                Chaque ennemi qui atteint votre base vous fait perdre des <strong>❤️ vies</strong>. Si vous perdez toutes vos vies, c'est la défaite !
                Survivez à toutes les vagues pour remporter la victoire.
              </p>
            </section>

            <section class="info-section">
              <h3 class="info-title">🏗️ Mécaniques Principales</h3>
              
              <div class="mechanic-card">
                <h4 class="mechanic-title">🏰 Tourelles</h4>
                <p class="mechanic-text">
                  Placez des <strong>tourelles</strong> sur les cases constructibles (herbe, sable, etc.) pour attaquer automatiquement les ennemis.
                  Il existe <strong>5 types de tourelles</strong> : Mitrailleuse, Sniper, Canon, Éclair, et Caserne. Chaque tourelle peut être améliorée jusqu'au niveau 3 (ou 4 au chapitre 2).
                  Les améliorations augmentent les dégâts, la portée, et la cadence de tir.
                </p>
              </div>

              <div class="mechanic-card">
                <h4 class="mechanic-title">⚔️ Héros</h4>
                <p class="mechanic-text">
                  Votre <strong>héros</strong> combat directement sur le terrain ! Il peut bloquer et attaquer les ennemis, les empêchant d'avancer.
                  Les héros ont différents types : BRUISER (tank), DPS (dégâts), TANK (défense), CONTROL (contrôle), RANGED (distance).
                  Vous gagnez des <strong>Hero Points</strong> en tuant des ennemis avec votre héros, que vous pouvez utiliser pour améliorer ses statistiques (PV, dégâts, vitesse, cadence d'attaque).
                </p>
              </div>

              <div class="mechanic-card">
                <h4 class="mechanic-title">👥 Soldats</h4>
                <p class="mechanic-text">
                  Les <strong>Casernes</strong> produisent des soldats qui patrouillent et attaquent les ennemis à proximité.
                  Plus la caserne est améliorée, plus elle produit de soldats et plus ils sont résistants.
                  Les soldats peuvent bloquer les ennemis et les empêcher d'avancer, mais ils peuvent être tués.
                </p>
              </div>

              <div class="mechanic-card">
                <h4 class="mechanic-title">💰 Économie</h4>
                <p class="mechanic-text">
                  Vous commencez chaque niveau avec une somme d'<strong>or</strong> de départ. Vous gagnez de l'or en :
                  <ul class="mechanic-list">
                    <li>Tuant des ennemis (récompense de base)</li>
                    <li>Récupérant les <strong>pièces d'or</strong> qui tombent parfois à la mort des ennemis (25% de chance)</li>
                    <li>Vendant des tourelles (récupération partielle du coût)</li>
                  </ul>
                  L'or est utilisé pour construire et améliorer les tourelles. Gérez bien votre économie !
                </p>
              </div>

              <div class="mechanic-card">
                <h4 class="mechanic-title">⚡ Sorts</h4>
                <p class="mechanic-text">
                  Le sort <strong>Éclair</strong> inflige 350 dégâts dans une zone et paralyse les ennemis survivants pendant 3.5 secondes.
                  Utilisez-le stratégiquement lors des vagues difficiles ! Cooldown de 100 secondes.
                  <br />
                  <strong>Bombardement aérien</strong> (chapitre 2+) survole la zone et bombarde tous les chemins une seule fois, infligeant 1080 dégâts.
                  Cooldown de 300 secondes.
                </p>
              </div>

              <div class="mechanic-card">
                <h4 class="mechanic-title">🌊 Vagues d'Ennemis</h4>
                <p class="mechanic-text">
                  Les ennemis arrivent par <strong>vagues</strong>. Chaque vague contient différents types d'ennemis avec des capacités variées.
                  Survivez à toutes les vagues pour gagner le niveau. Vous pouvez lancer la vague suivante manuellement ou attendre le compte à rebours automatique.
                </p>
              </div>
            </section>

            <section class="info-section">
              <h3 class="info-title">📈 Système de Progression</h3>
              
              <div class="mechanic-card">
                <h4 class="mechanic-title">📚 Chapitres et Niveaux</h4>
                <p class="mechanic-text">
                  Le jeu est organisé en <strong>chapitres</strong> (secteurs tactiques), chacun contenant plusieurs <strong>niveaux</strong>.
                  Pour débloquer un chapitre suivant, vous devez :
                  <ul class="mechanic-list">
                    <li>Terminer tous les niveaux du chapitre précédent</li>
                    <li>Respecter la limite de <strong>❤️ cœurs perdus</strong> cumulés (si spécifiée)</li>
                  </ul>
                  Les niveaux se débloquent progressivement : terminez le niveau 1 pour accéder au niveau 2, etc.
                </p>
              </div>

              <div class="mechanic-card">
                <h4 class="mechanic-title">⭐ Hero Points</h4>
                <p class="mechanic-text">
                  Les <strong>Hero Points</strong> sont gagnés en tuant des ennemis avec votre héros pendant les parties.
                  Utilisez-les pour :
                  <ul class="mechanic-list">
                    <li><strong>Améliorer votre héros</strong> : Augmenter ses PV, dégâts, vitesse de déplacement, ou réduire son temps entre les attaques</li>
                    <li><strong>Débloquer de nouveaux héros</strong> : Certains héros nécessitent des Hero Points pour être débloqués</li>
                  </ul>
                  Les améliorations sont permanentes et s'appliquent à toutes vos futures parties !
                </p>
              </div>

              <div class="mechanic-card">
                <h4 class="mechanic-title">🏆 Succès (Achievements)</h4>
                <p class="mechanic-text">
                  Accomplissez des <strong>succès</strong> en réalisant des objectifs spécifiques (tuer X ennemis, terminer un niveau sans perdre de vies, etc.).
                  Les succès sont organisés par catégories : Héros, Économie, Tourelles, Combat, et Globaux.
                  Certains succès sont basés sur une seule partie, d'autres accumulent vos performances sur toutes vos parties.
                </p>
              </div>
            </section>

            <section class="info-section">
              <h3 class="info-title">💡 Conseils Stratégiques</h3>
              
              <div class="tip-card">
                <h4 class="tip-title">🎯 Priorités</h4>
                <ul class="tip-list">
                  <li><strong>Éliminez d'abord les ennemis de soutien</strong> : Soigneurs, Stratèges, et autres qui renforcent les alliés sont prioritaires</li>
                  <li><strong>Bloquez les ennemis rapides</strong> : Utilisez votre héros ou des soldats pour bloquer les éclaireurs rapides</li>
                  <li><strong>Protégez votre héros</strong> : Si votre héros meurt, vous perdez un allié précieux. Placez des tourelles pour le soutenir</li>
                </ul>
              </div>

              <div class="tip-card">
                <h4 class="tip-title">💰 Gestion Économique</h4>
                <ul class="tip-list">
                  <li><strong>Investissez tôt</strong> : Construisez des tourelles dès le début pour gagner plus d'or</li>
                  <li><strong>Améliorez progressivement</strong> : Mieux vaut plusieurs tourelles niveau 1 qu'une seule niveau 3</li>
                  <li><strong>Récupérez les pièces</strong> : Votre héros peut ramasser les pièces d'or qui tombent</li>
                  <li><strong>Vendez si nécessaire</strong> : N'hésitez pas à vendre une tourelle mal placée pour en construire une meilleure</li>
                </ul>
              </div>

              <div class="tip-card">
                <h4 class="tip-title">🏗️ Placement des Tourelles</h4>
                <ul class="tip-list">
                  <li><strong>Coupez les chemins</strong> : Placez des tourelles près des virages et des intersections pour maximiser le temps d'exposition</li>
                  <li><strong>Mélangez les types</strong> : Combinez des tourelles à dégâts élevés (Sniper) avec des tourelles rapides (Mitrailleuse)</li>
                  <li><strong>Utilisez les zones d'effet</strong> : Les tourelles avec AOE (Canon, Éclair) sont efficaces contre les groupes</li>
                  <li><strong>Placez les Casernes stratégiquement</strong> : Les soldats bloquent les ennemis, placez-les aux points de passage</li>
                </ul>
              </div>

              <div class="tip-card">
                <h4 class="tip-title">⚔️ Utilisation du Héros</h4>
                <ul class="tip-list">
                  <li><strong>Bloquez les ennemis</strong> : Votre héros peut retenir plusieurs ennemis (selon son type)</li>
                  <li><strong>Priorisez les cibles</strong> : Attaquez d'abord les ennemis dangereux (soigneurs, tanks)</li>
                  <li><strong>Ramassez les pièces</strong> : Le héros ramasse automatiquement les pièces à proximité</li>
                  <li><strong>Améliorez-le régulièrement</strong> : Utilisez vos Hero Points pour renforcer votre héros</li>
                </ul>
              </div>

              <div class="tip-card">
                <h4 class="tip-title">🎮 Contrôles</h4>
                <ul class="tip-list">
                  <li><strong>Clic gauche</strong> : Sélectionner/Placer des tourelles, déplacer le héros</li>
                  <li><strong>Clic droit</strong> : Annuler une sélection, vendre une tourelle</li>    
                  <li><strong>Pause</strong> : Appuyez sur ESC ou le bouton pause pour mettre le jeu en pause et planifier votre stratégie</li>
                </ul>
              </div>
            </section>

            <section class="info-section">
              <h3 class="info-title">🎓 En Résumé</h3>
              <p class="info-text summary">
                <strong>Tower Defense</strong> est un jeu de stratégie où vous devez défendre votre base contre des vagues d'ennemis.
                Utilisez les <strong>tourelles</strong> pour attaquer automatiquement, votre <strong>héros</strong> pour bloquer et combattre,
                et les <strong>soldats</strong> pour renforcer votre défense. Gérez votre <strong>économie</strong> pour construire et améliorer,
                et progressez à travers les <strong>chapitres</strong> en améliorant votre <strong>héros</strong> avec les Hero Points.
                Chaque ennemi a ses propres capacités spéciales - consultez l'onglet <strong>Monstres</strong> pour les connaître !
              </p>
            </section>
          </div>
        </div>

        <div v-if="currentSection === 'turrets'" class="help-section">
          <h2 class="section-title">Tourelles Disponibles</h2>
          <div class="items-grid">
            <div v-for="turret in turrets" :key="turret.key" class="item-card">
              <div class="item-visual">
                <div class="turret-preview-container">
                  <TurretPreviewCanvas
                    :key="`turret-${turret.key}-${selectedLevels[turret.key] || 1}`"
                    :turret-key="turret.key"
                    :level="selectedLevels[turret.key] || 1"
                    :size="120"
                  />
                  <div class="level-selector">
                    <button
                      v-for="level in getMaxLevel(turret, selectedChapter[turret.key] || (turret.key === 'barracks' ? 1 : 2))"
                      :key="level"
                      class="level-btn"
                      :class="{ active: (selectedLevels[turret.key] || 1) === level }"
                      @click="selectedLevels[turret.key] = level"
                      :title="`Niveau ${level}`"
                    >
                      {{ level }}
                    </button>
                  </div>
                </div>
              </div>
              <div class="item-info">
                <h3 class="item-name">
                  {{ turret.name }}
                  <span v-if="hasLevel4InChapter2(turret)" class="level4-badge" title="Niveau 4 déverrouillé au chapitre 2">Niv.4 (Ch.2)</span>
                </h3>
                <p class="item-description">{{ turret.description }}</p>
                <div class="item-stats">
                  <div class="stat-row">
                    <span class="stat-label">
                      <span class="stat-icon">💰</span> Coût:
                    </span>
                    <span class="stat-value">{{ turret.cost }}$</span>
                  </div>
                  <div v-if="turret.key !== 'barracks'" class="stat-row">
                    <span class="stat-label">
                      <span class="stat-icon">📏</span> Portée:
                    </span>
                    <span class="stat-value">{{ getTurretLevelStats(turret, selectedLevels[turret.key] || 1).range }}</span>
                  </div>
                  <div v-if="turret.key !== 'barracks'" class="stat-row">
                    <span class="stat-label">
                      <span class="stat-icon">⚔️</span> Dégâts:
                    </span>
                    <span class="stat-value">{{ getTurretLevelStats(turret, selectedLevels[turret.key] || 1).damage }}</span>
                  </div>
                  <div v-if="turret.key !== 'barracks'" class="stat-row">
                    <span class="stat-label">
                      <span class="stat-icon">⏱️</span> Cadence:
                    </span>
                    <span class="stat-value">{{ (getTurretLevelStats(turret, selectedLevels[turret.key] || 1).rate / 1000).toFixed(1) }}s</span>
                  </div>
                  <div v-if="turret.aoe" class="stat-row">
                    <span class="stat-label">
                      <span class="stat-icon">💥</span> Zone d'effet:
                    </span>
                    <span class="stat-value">{{ turret.aoe }}</span>
                  </div>
                  <div v-if="turret.maxChainTargets" class="stat-row">
                    <span class="stat-label">
                      <span class="stat-icon">🔗</span> Chaîne max:
                    </span>
                    <span class="stat-value">{{ turret.maxChainTargets }}</span>
                  </div>
                  <div class="upgrade-costs-section">
                    <div class="upgrade-costs-title">
                      <span class="stat-icon">⬆️</span> Coûts d'amélioration:
                    </div>
                    <div class="upgrade-costs-list">
                      <div 
                        v-for="level in Array.from({ length: getMaxLevel(turret, turret.key === 'barracks' ? (selectedChapter[turret.key] || 1) : 2) - 1 }, (_, i) => i + 1)" 
                        :key="level" 
                        class="upgrade-cost-item"
                      >
                        <span class="upgrade-level-label">Niv. {{ level }} → {{ level + 1 }}:</span>
                        <span class="upgrade-cost-value">{{ getUpgradeCost(turret, level) }}$</span>
                      </div>
                    </div>
                  </div>
                  <div v-if="turret.key === 'barracks'" class="barracks-chapter-section">
                    <div class="chapter-selector-barracks">
                      <button
                        class="chapter-btn"
                        :class="{ active: (selectedChapter[turret.key] || 1) === 1 }"
                        @click="changeBarracksChapter(turret, 1)"
                        title="Chapitre 1"
                      >
                        Ch.1
                      </button>
                      <button
                        class="chapter-btn"
                        :class="{ active: (selectedChapter[turret.key] || 1) === 2 }"
                        @click="changeBarracksChapter(turret, 2)"
                        title="Chapitre 2"
                      >
                        Ch.2
                      </button>
                    </div>
                    <div class="barracks-stats-comparison">
                      <div class="chapter-stats">
                        <div class="chapter-label">Chapitre {{ selectedChapter[turret.key] || 1 }}</div>
                        <div class="stat-row">
                          <span class="stat-label">
                            <span class="stat-icon">👥</span> Soldats:
                          </span>
                          <span class="stat-value">{{ getBarracksStats(turret, selectedLevels[turret.key] || 1, selectedChapter[turret.key] || 1).soldiers }}</span>
                        </div>
                        <div class="stat-row">
                          <span class="stat-label">
                            <span class="stat-icon">❤️</span> HP Soldat:
                          </span>
                          <span class="stat-value">{{ getBarracksStats(turret, selectedLevels[turret.key] || 1, selectedChapter[turret.key] || 1).hp }}</span>
                        </div>
                        <div class="stat-row">
                          <span class="stat-label">
                            <span class="stat-icon">⏱️</span> Respawn:
                          </span>
                          <span class="stat-value">{{ (getBarracksStats(turret, selectedLevels[turret.key] || 1, selectedChapter[turret.key] || 1).respawnTime / 1000).toFixed(1) }}s</span>
                        </div>
                      </div>
                      <div class="barracks-comparison-note">
                        <strong>Note :</strong> Les statistiques des casernes diffèrent entre le chapitre 1 et le chapitre 2. 
                        Au chapitre 2, les soldats sont plus résistants, plus nombreux au niveau 4, et respawnent plus rapidement.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentSection === 'enemies'" class="help-section">
          <h2 class="section-title">Monstres</h2>
          <div class="items-grid">
            <div v-for="enemy in enemies" :key="enemy.key" class="item-card">
              <div class="item-visual">
                <EnemyPreviewCanvas
                  :key="`enemy-${enemy.key}`"
                  :enemy-key="enemy.key"
                  :size="120"
                />
              </div>
                <div class="item-info">
                  <h3 class="item-name">{{ enemy.name }}</h3>
                  <p class="item-description">{{ enemy.description || "Un ennemi redoutable qui menace votre base." }}</p>
                <div class="item-stats">
                  <div class="stat-row">
                    <span class="stat-label">
                      <span class="stat-icon">❤️</span> PV:
                    </span>
                    <span class="stat-value">{{ enemy.hp }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">
                      <span class="stat-icon">🏃</span> Vitesse:
                    </span>
                    <span class="stat-value">{{ enemy.speed }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">
                      <span class="stat-icon">💰</span> Récompense:
                    </span>
                    <span class="stat-value">{{ enemy.reward }}$</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">
                      <span class="stat-icon">💔</span> Dégâts au joueur:
                    </span>
                    <span class="stat-value">{{ enemy.playerDamage }}</span>
                  </div>
                  <div v-if="enemy.damage" class="stat-row">
                    <span class="stat-label">
                      <span class="stat-icon">⚔️</span> Dégâts d'attaque:
                    </span>
                    <span class="stat-value">{{ enemy.damage }}</span>
                  </div>
                  <div v-if="enemy.attackSpeed" class="stat-row">
                    <span class="stat-label">
                      <span class="stat-icon">⏱️</span> Vitesse d'attaque:
                    </span>
                    <span class="stat-value">{{ (enemy.attackSpeed / 1000).toFixed(1) }}s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { TURRETS } from '../../config/turrets/index.js';
import { ENEMIES } from '../../config/ennemies/index.js';
import TurretPreviewCanvas from './TurretPreviewCanvas.vue';
import EnemyPreviewCanvas from './EnemyPreviewCanvas.vue';

const currentSection = ref('general');
const selectedLevels = ref({});
const selectedChapter = ref({ barracks: 1 }); // Pour les casernes : 1 ou 2, par défaut chapitre 1

const turrets = computed(() => {
  return Object.entries(TURRETS).map(([key, turret]) => ({ key, ...turret }));
});

const enemies = computed(() => {
  // Filtrer les boss (ceux qui commencent par "bosslvl") et trier par HP croissant
  return Object.entries(ENEMIES)
    .filter(([key]) => !key.startsWith('bosslvl'))
    .map(([key, enemy]) => ({ key, ...enemy }))
    .sort((a, b) => (a.hp || 0) - (b.hp || 0));
});

const getMaxLevel = (turret, chapterId = null) => {
  if (turret.getStatsForChapter) {
    // Pour les casernes, utiliser le chapitre spécifié, sinon chapitre 2 pour avoir le max
    const chapter = chapterId !== null ? chapterId : (turret.key === 'barracks' ? 1 : 2);
    const stats = turret.getStatsForChapter(chapter);
    return stats.maxLevel || turret.maxLevel || 3;
  }
  return turret.maxLevel || 3;
};

const getTurretLevelStats = (turret, level) => {
  if (turret.getStatsForChapter) {
    const stats = turret.getStatsForChapter(2); // Chapitre 2 pour avoir toutes les améliorations
    return {
      damage: stats.damage?.[level - 1] || turret.damage,
      rate: stats.rate?.[level - 1] || turret.rate,
      range: stats.range?.[level - 1] || turret.range,
    };
  }
  return {
    damage: turret.damage,
    rate: turret.rate,
    range: turret.range,
  };
};

const getBarracksStats = (turret, level, chapterId = 2) => {
  if (turret.getStatsForChapter) {
    const stats = turret.getStatsForChapter(chapterId);
    return {
      soldiers: stats.soldiersCount?.[level - 1] || turret.soldiersCount?.[level - 1] || 2,
      hp: stats.soldierHp?.[level - 1] || turret.soldierHp?.[level - 1] || 115,
      respawnTime: stats.respawnTime?.[level - 1] || turret.respawnTime?.[level - 1] || 12000,
    };
  }
  return {
    soldiers: turret.soldiersCount?.[level - 1] || 2,
    hp: turret.soldierHp?.[level - 1] || 115,
    respawnTime: turret.respawnTime?.[level - 1] || 12000,
  };
};

const hasLevel4InChapter2 = (turret) => {
  if (turret.getStatsForChapter) {
    const statsCh1 = turret.getStatsForChapter(1);
    const statsCh2 = turret.getStatsForChapter(2);
    return statsCh1.maxLevel === 3 && statsCh2.maxLevel === 4;
  }
  return false;
};

const changeBarracksChapter = (turret, chapterId) => {
  selectedChapter.value[turret.key] = chapterId;
  const maxLvl = getMaxLevel(turret, chapterId);
  if ((selectedLevels.value[turret.key] || 1) > maxLvl) {
    selectedLevels.value[turret.key] = maxLvl;
  }
};

const getUpgradeCost = (turret, fromLevel) => {
  const baseCost = turret.cost || 100;
  
  if (turret.key === 'barracks') {
    // Casernes
    if (fromLevel === 1) {
      return Math.floor(baseCost * 2.5);
    } else if (fromLevel === 2) {
      return Math.floor(baseCost * 2.5 * 2.2);
    } else if (fromLevel === 3) {
      // Niveau 4 (chapitre 2 uniquement)
      return Math.floor(baseCost * 2.5 * 2.2 * 1.8);
    }
  } else {
    // Autres tourelles
    if (fromLevel === 1) {
      return Math.floor(baseCost * 2.5);
    } else if (fromLevel === 2) {
      if (turret.key === 'cannon') {
        return Math.floor(baseCost * 10);
      } else {
        return Math.floor(baseCost * 2.5 * 2.2);
      }
    } else if (fromLevel === 3) {
      // Niveau 4 (chapitre 2 uniquement)
      return Math.floor(baseCost * 2.5 * 2.2 * 2.0);
    }
  }
  
  return 0;
};

</script>

<style scoped>
.help-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.help-content {
  display: flex;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.help-sidebar {
  flex: 0 0 200px;
  min-width: 0;
}

.help-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.help-nav-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 242, 255, 0.2);
  color: #00f2ff;
  padding: 12px 16px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  font-size: 14px;
  text-align: left;
  font-family: "Orbitron", sans-serif;
}

.help-nav-item:hover {
  background: rgba(0, 242, 255, 0.1);
  border-color: rgba(0, 242, 255, 0.4);
}

.help-nav-item.active {
  background: rgba(0, 242, 255, 0.2);
  border-color: rgba(0, 242, 255, 0.6);
  color: #fff;
}

.help-main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 10px;
}

.help-section {
  width: 100%;
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  color: #00f2ff;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 20px;
}

.item-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 242, 255, 0.2);
  border-radius: 4px;
  padding: 20px;
  display: flex;
  gap: 20px;
  transition: all 0.2s ease;
}

.item-card:hover {
  border-color: rgba(0, 242, 255, 0.5);
  box-shadow: 0 0 20px rgba(0, 242, 255, 0.2);
}

.item-visual {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 242, 255, 0.3);
  border-radius: 4px;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-name {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.item-description {
  font-size: 12px;
  color: #ccc;
  line-height: 1.6;
  margin: 0;
  white-space: pre-line;
}

.item-stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.stat-label {
  color: #00f2ff;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-icon {
  font-size: 14px;
  display: inline-block;
}

.stat-value {
  color: #fff;
}


.turret-preview-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.level-selector {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.level-btn {
  width: 28px;
  height: 28px;
  border: 2px solid rgba(0, 242, 255, 0.5);
  background: rgba(0, 0, 0, 0.6);
  color: #00f2ff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.level-btn:hover {
  background: rgba(0, 242, 255, 0.2);
  border-color: #00f2ff;
}

.level-btn.active {
  background: #00f2ff;
  color: #000;
  border-color: #00f2ff;
}

.level4-badge {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 6px;
  background: rgba(255, 215, 0, 0.2);
  border: 1px solid #ffd700;
  color: #ffd700;
  font-size: 10px;
  font-weight: 600;
  border-radius: 3px;
}

.general-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.info-section {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 242, 255, 0.2);
  border-radius: 8px;
  padding: 24px;
}

.info-title {
  font-size: 20px;
  font-weight: 700;
  color: #00f2ff;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info-text {
  font-size: 14px;
  color: #e0e0e0;
  line-height: 1.8;
  margin: 0;
}

.info-text strong {
  color: #fff;
  font-weight: 700;
}

.info-text.summary {
  font-size: 15px;
  line-height: 2;
  padding: 16px;
  background: rgba(0, 242, 255, 0.05);
  border-left: 3px solid #00f2ff;
  border-radius: 4px;
}

.mechanic-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 242, 255, 0.15);
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
}

.mechanic-title {
  font-size: 16px;
  font-weight: 700;
  color: #00f2ff;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mechanic-text {
  font-size: 13px;
  color: #d0d0d0;
  line-height: 1.7;
  margin: 0;
}

.mechanic-text strong {
  color: #fff;
  font-weight: 600;
}

.mechanic-list {
  margin: 10px 0 0 20px;
  padding: 0;
  color: #d0d0d0;
  font-size: 13px;
  line-height: 1.8;
}

.mechanic-list li {
  margin-bottom: 6px;
}

.mechanic-list li strong {
  color: #00f2ff;
  font-weight: 600;
}

.tip-card {
  background: rgba(0, 242, 255, 0.05);
  border: 1px solid rgba(0, 242, 255, 0.2);
  border-left: 4px solid #00f2ff;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
}

.tip-title {
  font-size: 15px;
  font-weight: 700;
  color: #00f2ff;
  margin: 0 0 10px 0;
}

.tip-list {
  margin: 0;
  padding-left: 20px;
  color: #d0d0d0;
  font-size: 13px;
  line-height: 1.8;
}

.tip-list li {
  margin-bottom: 8px;
}

.tip-list li strong {
  color: #fff;
  font-weight: 600;
}

.barracks-chapter-section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 242, 255, 0.2);
}

.chapter-selector-barracks {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  justify-content: center;
}

.chapter-btn {
  padding: 6px 16px;
  border: 2px solid rgba(0, 242, 255, 0.5);
  background: rgba(0, 0, 0, 0.6);
  color: #00f2ff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  font-family: "Orbitron", sans-serif;
}

.chapter-btn:hover {
  background: rgba(0, 242, 255, 0.2);
  border-color: #00f2ff;
}

.chapter-btn.active {
  background: #00f2ff;
  color: #000;
  border-color: #00f2ff;
}

.barracks-stats-comparison {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chapter-stats {
  background: rgba(0, 242, 255, 0.05);
  border: 1px solid rgba(0, 242, 255, 0.2);
  border-radius: 4px;
  padding: 12px;
}

.chapter-label {
  font-size: 13px;
  font-weight: 700;
  color: #00f2ff;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.barracks-comparison-note {
  font-size: 11px;
  color: #aaa;
  line-height: 1.6;
  padding: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-left: 3px solid rgba(0, 242, 255, 0.4);
  border-radius: 3px;
}

.barracks-comparison-note strong {
  color: #00f2ff;
  font-weight: 600;
}

.upgrade-costs-section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 242, 255, 0.2);
}

.upgrade-costs-title {
  font-size: 13px;
  font-weight: 700;
  color: #00f2ff;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.upgrade-costs-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.upgrade-cost-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 4px 8px;
  background: rgba(0, 242, 255, 0.05);
  border-radius: 3px;
}

.upgrade-level-label {
  color: #ccc;
}

.upgrade-cost-value {
  color: #ffd700;
  font-weight: 600;
}

@media (max-width: 1200px) {
  .items-grid {
    grid-template-columns: 1fr;
  }
  
  .help-content {
    flex-direction: column;
  }
  
  .help-sidebar {
    flex: 0 0 auto;
  }
  
  .help-nav {
    flex-direction: row;
  }
}
</style>
