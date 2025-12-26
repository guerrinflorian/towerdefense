import { TURRETS } from "../config/turrets/index.js";
import { Soldier } from "./Soldier.js";
import { LEVELS_CONFIG } from "../config/levels/index.js";

// Fonction helper pour obtenir le chapitre depuis le levelID
function getChapterIdFromScene(scene) {
  if (scene?.levelID) {
    const levelId = Number(scene.levelID);
    const level = LEVELS_CONFIG.find((lvl) => lvl.id === levelId);
    if (level) {
      return level.chapterId || 1;
    }
  }
  return 1; // Par défaut chapitre 1
}

export class Barracks extends Phaser.GameObjects.Container {
  constructor(scene, x, y, config) {
    super(scene, x, y);
    this.scene = scene;

    // Clone de la config
    const originalConfig =
      typeof config === "string" ? TURRETS[config] : config;
    this.config = JSON.parse(
      JSON.stringify(originalConfig)
    );
    // Restaurer les fonctions qui ne sont pas copiées par JSON
    this.config.onDrawBarrel = originalConfig.onDrawBarrel;
    this.config.getStatsForChapter = originalConfig.getStatsForChapter;

    // Détecter le chapitre et appliquer les bonnes stats
    this.chapterId = getChapterIdFromScene(scene);
    if (this.config.getStatsForChapter) {
      const chapterStats = this.config.getStatsForChapter(this.chapterId);
      this.config.maxLevel = chapterStats.maxLevel;
      this.config.soldiersCount = chapterStats.soldiersCount;
      this.config.respawnTime = chapterStats.respawnTime;
      this.config.soldierHp = chapterStats.soldierHp;
    }

    this.level = 1;
    this.soldiers = [];
    this.deadSoldiers = [];

    // --- VISUEL ---
    this.base = scene.add.graphics();
    this.drawBase();
    this.add(this.base);

    this.barrelGroup = scene.add.container(0, 0);
    this.add(this.barrelGroup);
    this.drawBarrel();

    this.setSize(64, 64);
    this.setInteractive();

    // Highlight des soldats au hover
    this.on("pointerover", () => this.highlightSoldiers());
    this.on("pointerout", () => this.unhighlightSoldiers());

    scene.add.existing(this);
  }

  highlightSoldiers() {
    if (this.soldiers) {
      this.soldiers.forEach((soldier) => {
        if (soldier && soldier.active && soldier.isAlive) {
          soldier.showHighlight();
        }
      });
    }
  }

  unhighlightSoldiers() {
    if (this.soldiers) {
      this.soldiers.forEach((soldier) => {
        if (soldier && soldier.active) {
          soldier.hideHighlight();
        }
      });
    }
  }

  drawBase() {
    this.base.clear();
    const color = this.level > 1 ? 0x554422 : 0x333333;
    this.base.fillStyle(color);
    this.base.fillCircle(0, 0, 24);
    this.base.lineStyle(2, 0x111111);
    this.base.strokeCircle(0, 0, 24);

    if (this.level >= 2) {
      this.base.fillStyle(0xffff00);
      this.base.fillCircle(-10, -18, 3);
    }
    if (this.level >= 3) {
      this.base.fillCircle(10, -18, 3);
    }
    if (this.level >= 4) {
      // Indicateur doré pour le niveau 4
      this.base.fillStyle(0xffd700);
      this.base.fillCircle(0, -20, 4);
      this.base.lineStyle(1, 0xcc9900);
      this.base.strokeCircle(0, -20, 4);
    }
  }

  drawBarrel() {
    this.barrelGroup.removeAll(true);
    if (this.config.onDrawBarrel) {
      this.config.onDrawBarrel(
        this.scene,
        this.barrelGroup,
        this.config.color,
        this
      );
    }
  }

  getNextLevelStats() {
    if (this.level >= this.config.maxLevel) return null;

    let cost = 0;
    const baseCost = TURRETS[this.config.key].cost;

    if (this.level === 1) {
      cost = Math.floor(baseCost * 2.5);
    } else if (this.level === 2) {
      cost = Math.floor(baseCost * 2.5 * 2.2);
    } else if (this.level === 3) {
      // Coût niveau 4 réduit (au lieu de 2.5, on utilise 1.8)
      cost = Math.floor(baseCost * 2.5 * 2.2 * 1.8);
    }

    return {
      cost: cost,
    };
  }

  // Calculer le coût total déboursé (base + améliorations)
  getTotalCost() {
    const baseCost = TURRETS[this.config.key].cost;
    let totalCost = baseCost;

    // Calculer les coûts des améliorations
    if (this.level >= 2) {
      totalCost += Math.floor(baseCost * 2.5);
    }
    if (this.level >= 3) {
      totalCost += Math.floor(baseCost * 2.5 * 2.2);
    }
    if (this.level >= 4) {
      totalCost += Math.floor(baseCost * 2.5 * 2.2 * 1.8);
    }

    return totalCost;
  }

  upgrade() {
    const nextStats = this.getNextLevelStats();
    if (!nextStats) return;

    this.level++;
    this.drawBase();
    this.drawBarrel();

    // Mettre à jour le niveau des soldats existants
    this.soldiers.forEach((soldier) => {
      if (soldier && soldier.active) {
        soldier.updateLevel(this.level);
        soldier.maxHp = this.config.soldierHp[this.level - 1];
        soldier.hp = Math.min(soldier.hp, soldier.maxHp);
        soldier.updateHealthBar();
      }
    });

    // Recréer les soldats avec le nouveau niveau (pour ajouter les nouveaux)
    this.deploySoldiers();

    const txt = this.scene.add
      .text(
        this.x,
        this.y - 40,
        this.level >= this.config.maxLevel ? "MAX!" : "LEVEL UP!",
        {
          fontSize: "20px",
          fontStyle: "bold",
          color: "#ffff00",
          stroke: "#000",
          strokeThickness: 3,
        }
      )
      .setOrigin(0.5)
      .setDepth(200);

    this.scene.tweens.add({
      targets: txt,
      y: this.y - 80,
      alpha: 0,
      duration: 1000,
      onComplete: () => txt.destroy(),
    });
  }

  // Déployer les soldats
  deploySoldiers() {
    // Supprimer les anciens soldats
    this.soldiers.forEach((soldier) => {
      if (soldier && soldier.active) {
        soldier.destroy();
      }
    });
    this.soldiers = [];
    this.deadSoldiers = [];

    const count = this.config.soldiersCount[this.level - 1];
    const paths = this.scene.paths;
    const map = this.scene.levelConfig.map;
    const CONFIG = { TILE_SIZE: 64 };
    const T = CONFIG.TILE_SIZE * (this.scene.scaleFactor || 1);
    // Utiliser mapStartX et mapStartY au lieu de MAP_OFFSET
    const mapStartX = this.scene.mapStartX || 0;
    const mapStartY =
      this.scene.mapStartY || 120 * (this.scene.scaleFactor || 1);

    // Trouver toutes les positions de chemin valides près du bâtiment
    const validPathPositions = [];

    // Chercher dans un rayon autour du bâtiment
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const tileType = map[y][x];
        if (tileType === 1 || tileType === 4 || tileType === 7 || tileType === 13 || tileType === 14 || tileType === 19) {
          // Chemin, pont, neige, cimetière, lave ou chemin rose
          const tileX = mapStartX + x * T + T / 2;
          const tileY = mapStartY + y * T + T / 2;
          const dist = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            tileX,
            tileY
          );

          // Dans un rayon de 150 pixels
          if (dist <= 150 * (this.scene.scaleFactor || 1)) {
            validPathPositions.push({ x: tileX, y: tileY, dist: dist });
          }
        }
      }
    }

    // Trier par distance
    validPathPositions.sort((a, b) => a.dist - b.dist);

    // Espacer les soldats pour éviter qu'ils soient au même endroit
    const usedPositions = [];
    const minDistance = 30 * (this.scene.scaleFactor || 1); // Distance minimale entre soldats (augmentée)

    // Vérifier aussi les soldats des autres casernes
    const allExistingSoldiers = [];
    if (this.scene.soldiers) {
      this.scene.soldiers.getChildren().forEach((soldier) => {
        if (soldier && soldier.active && soldier.isAlive) {
          allExistingSoldiers.push({ x: soldier.x, y: soldier.y });
        }
      });
    }

    // Créer les soldats sur les positions valides les plus proches
    for (let i = 0; i < count && i < validPathPositions.length; i++) {
      let pos = validPathPositions[i];
      let attempts = 0;
      const maxAttempts = 20;

      // Chercher une position qui respecte la distance minimale
      while (attempts < maxAttempts) {
        let tooClose = false;

        // Vérifier avec les positions déjà utilisées dans cette caserne
        for (const used of usedPositions) {
          const dist = Phaser.Math.Distance.Between(
            pos.x,
            pos.y,
            used.x,
            used.y
          );
          if (dist < minDistance) {
            tooClose = true;
            break;
          }
        }

        // Vérifier avec les soldats des autres casernes
        if (!tooClose) {
          for (const existing of allExistingSoldiers) {
            const dist = Phaser.Math.Distance.Between(
              pos.x,
              pos.y,
              existing.x,
              existing.y
            );
            if (dist < minDistance) {
              tooClose = true;
              break;
            }
          }
        }

        if (!tooClose) {
          break; // Position valide trouvée
        }

        // Chercher une position alternative
        attempts++;
        if (attempts < maxAttempts) {
          // Essayer différentes positions autour de la position de base
          const angle = (attempts / maxAttempts) * Math.PI * 2;
          const offset = minDistance * 0.9;
          const newX = validPathPositions[i].x + Math.cos(angle) * offset;
          const newY = validPathPositions[i].y + Math.sin(angle) * offset;

          // Vérifier que c'est toujours sur un chemin
          if (this.isPositionOnPath(newX, newY)) {
            pos = { x: newX, y: newY, dist: validPathPositions[i].dist };
          } else {
            // Si pas sur chemin, essayer la position suivante dans la liste
            if (i + attempts < validPathPositions.length) {
              pos = validPathPositions[i + attempts];
            }
          }
        }
      }

      // Si toujours trop proche après tous les essais, chercher dans les positions suivantes
      if (attempts >= maxAttempts) {
        let found = false;
        for (let j = i + 1; j < validPathPositions.length && j < i + 10; j++) {
          const testPos = validPathPositions[j];
          let valid = true;

          for (const used of usedPositions) {
            const dist = Phaser.Math.Distance.Between(
              testPos.x,
              testPos.y,
              used.x,
              used.y
            );
            if (dist < minDistance) {
              valid = false;
              break;
            }
          }

          if (valid) {
            for (const existing of allExistingSoldiers) {
              const dist = Phaser.Math.Distance.Between(
                testPos.x,
                testPos.y,
                existing.x,
                existing.y
              );
              if (dist < minDistance) {
                valid = false;
                break;
              }
            }
          }

          if (valid) {
            pos = testPos;
            found = true;
            break;
          }
        }

        // Si aucune position valide trouvée, utiliser quand même avec un décalage minimal
        if (!found) {
          pos = {
            x: validPathPositions[i].x + (Math.random() - 0.5) * 15,
            y: validPathPositions[i].y + (Math.random() - 0.5) * 15,
            dist: validPathPositions[i].dist,
          };
        }
      }

      usedPositions.push({ x: pos.x, y: pos.y });

      const soldier = new Soldier(this.scene, pos.x, pos.y, this);
      soldier.level = this.level; // Définir le niveau
      soldier.drawBody(); // Redessiner avec le bon niveau
      soldier.setScale(this.scene.scaleFactor || 1);

      // Mettre à jour les stats selon le niveau
      soldier.maxHp = this.config.soldierHp[this.level - 1];
      soldier.hp = soldier.maxHp;
      soldier.updateHealthBar();

      // S'assurer que le soldat est bien positionné sur le chemin
      soldier.deployToPath(this.scene.paths);

      // Animation d'apparition
      soldier.setScale(0);
      this.scene.tweens.add({
        targets: soldier,
        scale: this.scene.scaleFactor || 1,
        duration: 300,
        ease: "Back.easeOut",
      });

      this.soldiers.push(soldier);
      this.scene.soldiers.add(soldier);
      if (this.scene.runTracker) {
        this.scene.runTracker.onSoldierSpawn();
      }
    }
  }

  // Vérifier si une position est sur un chemin
  isPositionOnPath(x, y) {
    const CONFIG = { TILE_SIZE: 64 };
    const T = CONFIG.TILE_SIZE * (this.scene.scaleFactor || 1);
    // Utiliser mapStartX et mapStartY au lieu de MAP_OFFSET
    const mapStartX = this.scene.mapStartX || 0;
    const mapStartY =
      this.scene.mapStartY || 120 * (this.scene.scaleFactor || 1);

    const tx = Math.floor((x - mapStartX) / T);
    const ty = Math.floor((y - mapStartY) / T);

    if (tx < 0 || tx >= 15 || ty < 0 || ty >= 15) return false;

    const map = this.scene.levelConfig.map;
    const tileType = map[ty][tx];
    return tileType === 1 || tileType === 4 || tileType === 7 || tileType === 13 || tileType === 14 || tileType === 19;
  }

  // Quand un soldat meurt
  onSoldierDied(soldier) {
    const index = this.soldiers.indexOf(soldier);
    if (index !== -1) {
      // Retirer de la liste active
      this.soldiers.splice(index, 1);

      // Ajouter à la liste des morts pour respawn
      this.deadSoldiers.push({
        soldier: soldier,
        deathTime: this.scene.time.now,
        respawnDelay: this.config.respawnTime[this.level - 1],
      });
    }
  }

  // Mettre à jour (gérer le respawn)
  update(time) {
    // Vérifier les soldats morts pour respawn
    for (let i = this.deadSoldiers.length - 1; i >= 0; i--) {
      const dead = this.deadSoldiers[i];
      const elapsed = time - dead.deathTime;

      if (elapsed >= dead.respawnDelay) {
        // Respawn le soldat
        dead.soldier.respawn();
        dead.soldier.updateLevel(this.level); // Mettre à jour le design
        dead.soldier.maxHp = this.config.soldierHp[this.level - 1];
        dead.soldier.hp = dead.soldier.maxHp;
        dead.soldier.updateHealthBar();

        // Redéployer sur le chemin
        dead.soldier.deployToPath(this.scene.paths);

        // Remettre dans la liste active
        this.soldiers.push(dead.soldier);

        this.deadSoldiers.splice(i, 1);

        if (this.scene.runTracker) {
          this.scene.runTracker.onSoldierSpawn();
        }
      }
    }
  }
}
