import { TURRETS } from "../config/turrets/index.js";

export class Turret extends Phaser.GameObjects.Container {
  constructor(scene, x, y, config) {
    super(scene, x, y);
    this.scene = scene;

    // Clone de la config pour que chaque tourelle soit indépendante
    this.config = JSON.parse(
      JSON.stringify(typeof config === "string" ? TURRETS[config] : config)
    );

    const originalConfig =
      typeof config === "string" ? TURRETS[config] : config;

    // On récupère les fonctions de dessin et de tir depuis la config originale
    this.config.onDrawBarrel = originalConfig.onDrawBarrel;
    this.config.onFire = originalConfig.onFire;

    // Valeur par défaut si maxLevel n'est pas défini dans la config
    // (Pour le cannon, c'est défini à 3 dans le fichier cannon.js)
    this.config.maxLevel = this.config.maxLevel || 3;

    this.level = 1;
    this.lastFired = 0;
    this.isCursed = false;
    this.curseCost = 0;

    // --- VISUEL ---
    this.base = scene.add.graphics();
    this.drawBase();
    this.add(this.base);

    this.barrelGroup = scene.add.container(0, 0);
    this.add(this.barrelGroup);
    this.drawBarrel();

    // Portée
    this.rangeCircle = scene.add.circle(0, 0, this.config.range);
    this.rangeCircle.setStrokeStyle(2, 0xffffff, 0.3);
    this.rangeCircle.setVisible(false);
    this.sendToBack(this.rangeCircle);
    this.add(this.rangeCircle);

    this.setSize(64, 64);
    this.setInteractive();

    // --- GESTION DE LA PORTÉE VISUELLE ---
    this.on("pointerover", () => {
      this.rangeCircle.setVisible(true);
      // Correction : On inverse l'échelle du parent pour garder un cercle rond
      if (this.scaleX !== 0) {
        this.rangeCircle.setScale(1 / this.scaleX);
      }
    });

    this.on("pointerout", () => this.rangeCircle.setVisible(false));

    scene.add.existing(this);
  }

  drawBase() {
    this.base.clear();
    const color = this.level > 1 ? 0x554422 : 0x333333;

    // Socle principal
    this.base.fillStyle(color);
    this.base.fillCircle(0, 0, 24);
    this.base.lineStyle(2, 0x111111);
    this.base.strokeCircle(0, 0, 24);

    // Indicateurs visuels de niveau sur le socle
    if (this.level >= 2) {
      this.base.fillStyle(0xffff00); // Jaune pour niv 2
      this.base.fillCircle(-10, -18, 3);
    }
    if (this.level >= 3) {
      this.base.fillStyle(0x00ffff); // Cyan pour niv 3
      this.base.fillCircle(10, -18, 3);
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

  // ============================================================
  // LOGIQUE D'AMÉLIORATION (MODIFIÉE POUR LE CANON NIV 3)
  // ============================================================
  getNextLevelStats() {
    // Si on a atteint le niveau max, pas d'upgrade
    if (this.level >= this.config.maxLevel) return null;

    // Utiliser les valeurs actuelles de la config
    let nextDmg = this.config.damage || 0;
    let nextRate = this.config.rate || 0;
    let nextRange = this.config.range || 0;
    let nextAoE = this.config.aoe || 0;

    // Coût de base récupéré depuis la config globale
    const baseCost = TURRETS[this.config.key]?.cost || 100;
    let cost = 0;

    // --- LOGIQUE SPÉCIFIQUE : PASSAGE AU NIVEAU 3 POUR LE CANON ---
    if (this.config.key === "cannon" && this.level === 2) {
      // C'est ici qu'on applique les stats "Jugement dernier"
      // 1. Dégâts x2.5
      nextDmg = Math.round(nextDmg * 2.5);

      // 2. Temps de rechargement fixée à 5 secondes (5000ms)
      // Contrairement aux autres upgrades qui réduisent le temps, celui-ci l'augmente massivement
      nextRate = 5000;

      // 3. AoE x1.1
      if (nextAoE > 0) nextAoE = Math.round(nextAoE * 1.1);

      // Portée augmente un peu
      nextRange = Math.round(nextRange * 1.2);

      // Coût très élevé pour cette arme ultime (x3 du coût précédent environ)
      cost = Math.floor(baseCost * 10);
    }
    // --- LOGIQUE GÉNÉRIQUE POUR LES AUTRES TOURELLES OU AUTRES NIVEAUX ---
    else if (this.level === 1) {
      // Niv 1 -> 2 (Standard)
      nextDmg = Math.round(nextDmg * 1.5);
      nextRate = Math.round(nextRate / 1.2); // Tir plus vite
      nextRange = Math.round(nextRange * 1.2);
      if (nextAoE > 0) nextAoE = Math.round(nextAoE * 1.1);
      cost = Math.floor(baseCost * 2.5);
    } else if (this.level === 2) {
      // Niv 2 -> 3 (Standard pour les tourelles classiques)
      nextDmg = Math.round(nextDmg * 1.3);
      nextRate = Math.round(nextRate / 1.5); // Tir beaucoup plus vite
      nextRange = Math.round(nextRange * 1.1);
      if (nextAoE > 0) nextAoE = Math.round(nextAoE * 1.2);
      cost = Math.floor(baseCost * 2.5 * 2.2);
    }

    return {
      damage: nextDmg,
      rate: nextRate,
      range: nextRange,
      aoe: nextAoE > 0 ? nextAoE : undefined,
      cost: cost,
    };
  }

  upgrade() {
    const nextStats = this.getNextLevelStats();
    if (!nextStats) return; // Sécurité

    this.level++;

    // Application des nouvelles stats
    this.config.damage = nextStats.damage;
    this.config.rate = nextStats.rate;
    this.config.range = nextStats.range;
    if (nextStats.aoe) this.config.aoe = nextStats.aoe;

    // Mise à jour visuelle du rayon
    this.rangeCircle.setRadius(this.config.range);

    // On force la mise à jour de l'échelle du cercle après l'upgrade
    if (this.scaleX !== 0) {
      this.rangeCircle.setScale(1 / this.scaleX);
    }

    // Redessiner le socle (ajoute le point de couleur) et le canon (change le skin)
    this.drawBase();
    this.drawBarrel();

    // Texte flottant "LEVEL UP"
    const txtContent =
      this.level >= this.config.maxLevel ? "MAX LEVEL!" : "LEVEL UP!";
    const txtColor = this.level === 3 ? "#00ffff" : "#ffff00"; // Bleu pour le niv 3

    const txt = this.scene.add
      .text(this.x, this.y - 40, txtContent, {
        fontSize: "20px",
        fontFamily: "Arial",
        fontStyle: "bold",
        color: txtColor,
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(300);

    this.scene.tweens.add({
      targets: txt,
      y: this.y - 80,
      alpha: 0,
      duration: 1200,
      onComplete: () => txt.destroy(),
    });
  }

  applyCurse(cost = 25) {
    if (this.isCursed) return;

    this.isCursed = true;
    this.curseCost = cost;

    // Border violet pulsant autour de la tour
    const border = this.scene.add.graphics();
    border.lineStyle(4, 0x9b59b6, 1);
    border.strokeCircle(0, 0, 32);
    border.setDepth(this.depth + 1);
    this.add(border);
    this.curseBorder = border;
    
    // Animation du border (pulsation)
    this.scene.tweens.add({
      targets: border,
      alpha: { from: 0.3, to: 1 },
      scaleX: { from: 0.9, to: 1.1 },
      scaleY: { from: 0.9, to: 1.1 },
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Effet visuel de flammes violettes/noires plus visible
    const flame = this.scene.add.graphics();
    flame.fillStyle(0x6a1b9a, 0.7);
    flame.fillEllipse(0, 0, 40, 30);
    flame.fillStyle(0x442244, 0.5);
    flame.fillEllipse(0, -5, 30, 20);
    flame.setDepth(this.depth + 1);
    this.add(flame);
    this.scene.tweens.add({
      targets: flame,
      y: -10,
      alpha: { from: 0.4, to: 0.8 },
      scaleX: { from: 0.95, to: 1.15 },
      scaleY: { from: 0.95, to: 1.15 },
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
    this.curseFlame = flame;

    // Overlay violet/rouge sombre plus visible
    const overlay = this.scene.add.graphics();
    overlay.fillStyle(0x4a1a5a, 0.5);
    overlay.fillCircle(0, 0, 32);
    overlay.setDepth(this.depth);
    this.add(overlay);
    this.curseOverlay = overlay;
    
    // Animation de l'overlay
    this.scene.tweens.add({
      targets: overlay,
      alpha: { from: 0.3, to: 0.6 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Tooltip coût réparation - Positionné juste au-dessus de la tour
    const tooltipContainer = this.scene.add.container(0, -45);
    tooltipContainer.setDepth(2500); // Z-index très élevé pour être au-dessus de tout
    
    // Texte "Réparer"
    const repairText = this.scene.add.text(0, 0, "Réparer", {
      fontSize: "16px",
      fontFamily: "Arial",
      color: "#ffddcc",
      fontStyle: "bold",
    }).setOrigin(0.5, 0.5);
    
    // Icône de pièce
    const coinIcon = this.scene.add.graphics();
    const coinSize = 10;
    coinIcon.fillStyle(0xf4d35e, 1);
    coinIcon.fillCircle(0, 0, coinSize);
    coinIcon.lineStyle(2, 0xe7b029, 1);
    coinIcon.strokeCircle(0, 0, coinSize);
    coinIcon.fillStyle(0xe7b029, 1);
    coinIcon.fillRoundedRect(-5, -7, 10, 14, 2);
    
    // Texte du montant
    const costText = this.scene.add.text(0, 0, `${cost}`, {
      fontSize: "16px",
      fontFamily: "Arial",
      color: "#ffd700",
      fontStyle: "bold",
    }).setOrigin(0.5, 0.5);
    
    // Calculer les positions pour centrer le tout
    const textWidth = repairText.width;
    const coinWidth = coinSize * 2 + 6;
    const costWidth = costText.width;
    const totalWidth = textWidth + 10 + coinWidth + costWidth;
    
    repairText.setX(-totalWidth / 2 + textWidth / 2);
    coinIcon.setX(-totalWidth / 2 + textWidth + 5 + coinSize);
    costText.setX(-totalWidth / 2 + textWidth + 5 + coinWidth + costWidth / 2);
    
    // Fond semi-transparent
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x000000, 0.85);
    bg.fillRoundedRect(-totalWidth / 2 - 8, -12, totalWidth + 16, 24, 5);
    bg.lineStyle(2, 0xffd700, 0.8);
    bg.strokeRoundedRect(-totalWidth / 2 - 8, -12, totalWidth + 16, 24, 5);
    
    tooltipContainer.add([bg, repairText, coinIcon, costText]);
    this.add(tooltipContainer);
    this.curseTooltip = tooltipContainer;
  }

  removeCurse(pay = true) {
    if (!this.isCursed) return false;

    if (pay && this.scene.money < this.curseCost) {
      this.scene.cameras.main.shake(80, 0.006);
      return false;
    }

    if (pay) {
      this.scene.money -= this.curseCost;
      this.scene.updateUI();
    }

    this.isCursed = false;
    if (this.curseFlame) {
      this.curseFlame.destroy();
      this.curseFlame = null;
    }
    if (this.curseOverlay) {
      this.curseOverlay.destroy();
      this.curseOverlay = null;
    }
    if (this.curseBorder) {
      this.curseBorder.destroy();
      this.curseBorder = null;
    }
    if (this.curseTooltip) {
      this.curseTooltip.destroy();
      this.curseTooltip = null;
    }

    return true;
  }

  // Calculer le coût total déboursé (base + améliorations)
  getTotalCost() {
    const baseCost = TURRETS[this.config.key]?.cost || 100;
    let totalCost = baseCost;

    // Calculer les coûts des améliorations
    if (this.level >= 2) {
      // Coût upgrade niveau 1 -> 2
      totalCost += Math.floor(baseCost * 2.5);
    }
    if (this.level >= 3) {
      // Coût upgrade niveau 2 -> 3
      if (this.config.key === "cannon") {
        totalCost += Math.floor(baseCost * 10);
      } else {
        totalCost += Math.floor(baseCost * 2.5 * 2.2);
      }
    }

    return totalCost;
  }

  update(time, enemies) {
    // Si la tourelle a une 'rate' définie, on l'utilise, sinon valeur par défaut
    const rate = this.config.rate || 1000;

    if (this.isCursed) {
      return;
    }

    if (time > this.lastFired) {
      const target = this.findTarget(enemies);

      if (target) {
        // Calcul de l'angle vers la cible
        const angle = Phaser.Math.Angle.Between(
          this.x,
          this.y,
          target.x,
          target.y
        );

        // Rotation fluide du canon
        this.barrelGroup.rotation = Phaser.Math.Angle.RotateTo(
          this.barrelGroup.rotation,
          angle,
          0.15 // Vitesse de rotation (un peu plus lent pour faire lourd)
        );

        // Si le canon est aligné (à +/- 0.5 radian près), on tire
        if (
          Math.abs(
            Phaser.Math.Angle.ShortestBetween(this.barrelGroup.rotation, angle)
          ) < 0.5
        ) {
          this.fire(target);

          // Mise à jour du prochain tir basé sur le 'rate' actuel
          this.lastFired = time + rate;
        }
      }
    }
  }

  findTarget(enemies) {
    let nearest = null;
    let minDist = this.config.range;

    // Note: Distance.Between est en pixels Monde, indépendant du scale du container
    enemies.children.each((e) => {
      if (e.active) {
        const d = Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y);
        if (d <= this.config.range && d < minDist) {
          minDist = d;
          nearest = e;
        }
      }
    });
    return nearest;
  }

  fire(target) {
    // Animation de recul du canon
    this.scene.tweens.add({
      targets: this.barrelGroup,
      x: -6 * Math.cos(this.barrelGroup.rotation),
      y: -6 * Math.sin(this.barrelGroup.rotation),
      duration: 60,
      yoyo: true,
      ease: "Quad.easeOut",
    });

    // Appel de la fonction de tir spécifique définie dans cannon.js (ou autre config)
    if (this.config.onFire) {
      this.config.onFire(this.scene, this, target);
    }
  }
}
