export const zap = {
  key: "zap",
  name: "Éclair",
  cost: 350,
  range: 120,
  damage: 50,
  rate: 1800,
  color: 0x00ffff, // Cyan électrique
  maxLevel: 3,
  maxChainTargets: 3, // Nombre max de cibles pour la chaîne (niveau 1)
  description: "Générateur électrique avec propagation en chaîne.\n\n✅ Avantages:\n• Propagation d'éclair entre ennemis proches\n• Dégâts instantanés\n• Efficace contre les groupes serrés\n\n❌ Inconvénients:\n• Coût très élevé\n• Portée moyenne\n• Moins efficace si ennemis espacés",

  // --- DESSIN ÉVOLUTIF (Design Électrique) ---
  onDrawBarrel: (scene, container, color, turret) => {
    const g = scene.add.graphics();
    const level = turret.level || 1;

    // Palette de couleurs électriques
    const electricBlue = 0x00ffff;
    const electricYellow = 0xffff00;
    const electricPurple = 0xaa00ff;
    const darkMetal = 0x111111;
    const lightMetal = 0x444444;
    const energyCore = 0xffffff;

    if (level === 1) {
      // === NIVEAU 1 : Générateur d'Éclair Standard ===
      // Base circulaire avec bobines
      g.fillStyle(darkMetal);
      g.fillCircle(0, 0, 20);
      g.lineStyle(2, electricBlue, 0.8);
      g.strokeCircle(0, 0, 20);

      // Bobines électriques (cercles concentriques)
      g.lineStyle(1.5, electricBlue, 0.6);
      g.strokeCircle(0, 0, 12);
      g.strokeCircle(0, 0, 8);

      // Canon électrique (pointant vers l'avant)
      g.fillStyle(electricBlue, 0.7);
      g.fillRect(0, -4, 35, 8);
      g.lineStyle(2, electricYellow, 0.9);
      g.strokeRect(0, -4, 35, 8);

      // Noyau d'énergie
      g.fillStyle(energyCore, 0.9);
      g.fillCircle(35, 0, 5);
    } else if (level === 2) {
      // === NIVEAU 2 : Générateur Renforcé ===
      // Base plus grande avec plus de bobines
      g.fillStyle(darkMetal);
      g.fillCircle(0, 0, 24);
      g.lineStyle(2, electricBlue, 0.9);
      g.strokeCircle(0, 0, 24);

      // Bobines multiples
      g.lineStyle(1.5, electricBlue, 0.7);
      g.strokeCircle(0, 0, 16);
      g.strokeCircle(0, 0, 12);
      g.strokeCircle(0, 0, 8);

      // Canon électrique plus long
      g.fillStyle(electricBlue, 0.8);
      g.fillRect(0, -5, 45, 10);
      g.lineStyle(2, electricYellow, 1);
      g.strokeRect(0, -5, 45, 10);

      // Énergie pulsante (cercles concentriques)
      g.lineStyle(1, electricYellow, 0.5);
      g.strokeCircle(45, 0, 8);
      g.strokeCircle(45, 0, 6);

      // Noyau d'énergie plus gros
      g.fillStyle(energyCore, 1);
      g.fillCircle(45, 0, 6);
    } else {
      // === NIVEAU 3 : Générateur Élite (Tesla) ===
      // Base massive avec bobines complexes
      g.fillStyle(darkMetal);
      g.fillCircle(0, 0, 28);
      g.lineStyle(3, electricPurple, 1);
      g.strokeCircle(0, 0, 28);

      // Bobines en spirale
      g.lineStyle(2, electricPurple, 0.8);
      g.strokeCircle(0, 0, 20);
      g.strokeCircle(0, 0, 16);
      g.strokeCircle(0, 0, 12);
      g.strokeCircle(0, 0, 8);

      // Canon Tesla (très long)
      g.fillStyle(electricPurple, 0.9);
      g.fillRect(0, -6, 55, 12);
      g.lineStyle(3, electricYellow, 1);
      g.strokeRect(0, -6, 55, 12);

      // Énergie Tesla (aura multiple)
      g.lineStyle(2, electricYellow, 0.6);
      g.strokeCircle(55, 0, 10);
      g.strokeCircle(55, 0, 7);
      g.strokeCircle(55, 0, 4);

      // Noyau d'énergie Tesla (brillant)
      g.fillStyle(energyCore, 1);
      g.fillCircle(55, 0, 7);
      g.fillStyle(electricYellow, 0.8);
      g.fillCircle(55, 0, 4);

      // Particules d'énergie (petits points)
      g.fillStyle(electricYellow, 1);
      g.fillCircle(-8, -8, 2);
      g.fillCircle(8, -8, 2);
      g.fillCircle(-8, 8, 2);
      g.fillCircle(8, 8, 2);
    }

    // Pivot central
    g.fillStyle(0x000000);
    g.fillCircle(0, 0, 4);

    container.add(g);

    // --- INDICATEUR DE NIVEAU ---
    const badge = scene.add.container(-20, 20);
    const badgeBg = scene.add.rectangle(0, 0, 24, 14, 0x000000, 0.7);
    const badgeColor = level === 3 ? electricPurple : electricBlue;
    badgeBg.setStrokeStyle(1, badgeColor);
    const lvlText = scene.add
      .text(0, 0, `Lv.${level}`, {
        fontSize: "10px",
        fontFamily: "Arial",
        color: level === 3 ? "#aa00ff" : "#00ffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    badge.add([badgeBg, lvlText]);
    container.add(badge);
  },

  // --- LOGIQUE DE TIR AVEC PROPAGATION D'ÉCLAIR ---
  onFire: (scene, turret, target) => {
    const level = turret.level || 1;
    const angle = turret.barrelGroup.rotation;

    // Nombre max de cibles selon le niveau
    const maxChainTargets = level === 1 ? 3 : level === 2 ? 5 : 7;
    const chainDistance = 80; // 1/2 case = 32 pixels donc environ 1.2 cases

    // Longueur du canon
    const barrelLen = level === 1 ? 32 : level === 2 ? 40 : 48;
    const tipX = turret.x + Math.cos(angle) * barrelLen;
    const tipY = turret.y + Math.sin(angle) * barrelLen;

    // --- EFFET VISUEL INITIAL ---
    const flashColor =
      level === 3 ? 0xaa00ff : level === 2 ? 0x00ffff : 0x00aaff;
    const flashSize = level === 3 ? 25 : level === 2 ? 20 : 15;
    const flash = scene.add.circle(tipX, tipY, flashSize, flashColor, 0.9);
    scene.tweens.add({
      targets: flash,
      scale: 2,
      alpha: 0,
      duration: 200,
      onComplete: () => flash.destroy(),
    });

    // --- PROPAGATION D'ÉCLAIR ---
    const allEnemies = scene.enemies.getChildren();
    const hitEnemies = new Set(); // Pour éviter de toucher deux fois le même ennemi
    const chainSequence = []; // Pour l'animation de la chaîne

    // Fonction récursive pour la propagation
    const chainLightning = (currentTarget, depth, fromX, fromY) => {
      if (depth >= maxChainTargets || !currentTarget || !currentTarget.active) {
        return;
      }

      // Marquer comme touché
      hitEnemies.add(currentTarget);
      chainSequence.push({
        target: currentTarget,
        fromX: fromX,
        fromY: fromY,
        depth: depth,
      });

      // Infliger des dégâts
      currentTarget.damage(turret.config.damage, { source: "turret", turretType: turret.config.key });
      
      // Paralyser l'ennemi pendant 0.15 secondes
      if (currentTarget.paralyze) {
        currentTarget.paralyze(150);
      }

      // Trouver le prochain ennemi à proximité
      let nearestEnemy = null;
      let minDist = chainDistance;

      allEnemies.forEach((enemy) => {
        if (enemy.active && !hitEnemies.has(enemy) && enemy !== currentTarget) {
          const dist = Phaser.Math.Distance.Between(
            currentTarget.x,
            currentTarget.y,
            enemy.x,
            enemy.y
          );
          if (dist <= chainDistance && dist < minDist) {
            minDist = dist;
            nearestEnemy = enemy;
          }
        }
      });

      // Si on trouve un ennemi proche, continuer la chaîne
      if (nearestEnemy) {
        chainLightning(
          nearestEnemy,
          depth + 1,
          currentTarget.x,
          currentTarget.y
        );
      }
    };

    // Démarrer la chaîne depuis la cible initiale
    chainLightning(target, 0, tipX, tipY);

    // --- ANIMATION DE LA CHAÎNE D'ÉCLAIR ---
    chainSequence.forEach((link, index) => {
      const delay = index * 50; // Délai progressif pour l'effet de chaîne

      scene.time.delayedCall(delay, () => {
        // Ligne d'éclair zigzagante
        const lightning = scene.add.graphics();
        const lightningColor = level === 3 ? 0xaa00ff : 0x00ffff;
        const lightningWidth = level === 3 ? 4 : 3;

        // Créer un zigzag pour l'effet éclair
        const steps = 8;
        const dx = link.target.x - link.fromX;
        const dy = link.target.y - link.fromY;

        lightning.lineStyle(lightningWidth, lightningColor, 1);
        lightning.beginPath();
        lightning.moveTo(link.fromX, link.fromY);

        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          const x = link.fromX + dx * t;
          const y = link.fromY + dy * t;
          // Ajouter un décalage aléatoire pour l'effet zigzag
          const offsetX = (Math.random() - 0.5) * 8;
          const offsetY = (Math.random() - 0.5) * 8;
          lightning.lineTo(x + offsetX, y + offsetY);
        }
        lightning.lineTo(link.target.x, link.target.y);
        lightning.strokePath();

        // Ligne principale (plus épaisse)
        lightning.lineStyle(lightningWidth + 2, 0xffffff, 0.8);
        lightning.beginPath();
        lightning.moveTo(link.fromX, link.fromY);
        lightning.lineTo(link.target.x, link.target.y);
        lightning.strokePath();

        lightning.setDepth(100);

        // Disparition rapide
        scene.tweens.add({
          targets: lightning,
          alpha: 0,
          duration: 150,
          onComplete: () => lightning.destroy(),
        });

        // Impact sur la cible
        const impactColor = level === 3 ? 0xaa00ff : 0x00ffff;
        const impactSize = level === 3 ? 15 : 12;
        const impact = scene.add.circle(
          link.target.x,
          link.target.y,
          impactSize,
          impactColor,
          0.9
        );
        impact.setDepth(99);
        scene.tweens.add({
          targets: impact,
          scale: 0,
          alpha: 0,
          duration: 200,
          onComplete: () => impact.destroy(),
        });

        // Particules d'électricité
        for (let i = 0; i < 5; i++) {
          const particle = scene.add.circle(
            link.target.x + (Math.random() - 0.5) * 20,
            link.target.y + (Math.random() - 0.5) * 20,
            2,
            lightningColor,
            1
          );
          particle.setDepth(101);
          scene.tweens.add({
            targets: particle,
            x: particle.x + (Math.random() - 0.5) * 30,
            y: particle.y + (Math.random() - 0.5) * 30,
            alpha: 0,
            scale: 0,
            duration: 300,
            onComplete: () => particle.destroy(),
          });
        }
      });
    });
  },
};
