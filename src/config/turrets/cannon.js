export const cannon = {
  key: "cannon",
  name: "Mortier",
  cost: 180,
  range: 110,
  damage: 72,
  rate: 2300, // Note: Pour le Niv 3, le moteur doit passer ce rate à 5000
  color: 0xff8844,
  aoe: 50,
  maxLevel: 3,
  description:
    "Artillerie lourde avec dégâts de zone (AOE).\n\n✅ Avantages:\n• Dégâts de zone (touche plusieurs ennemis)\n• Portée longue\n• Efficace contre les groupes\n\n❌ Inconvénients:\n• Cadence de tir lente\n• Projectile en arc (délai d'impact)\n• Moins précis que les autres tourelles",

  // ============================================================
  // DESSIN DU CANON
  // ============================================================
  onDrawBarrel: (scene, container, color, turret) => {
    const g = scene.add.graphics();
    const level = turret.level || 1;
    const black = 0x111111;

    g.clear();

    if (level === 1) {
      // --- Niv 1 : Mortier Bronze (Classique) ---
      const bronze = 0xcd7f32;
      const darkBronze = 0xa05a2c;

      g.fillStyle(darkBronze);
      g.fillRoundedRect(-20, -18, 30, 36, 6);
      g.lineStyle(3, 0x663311);
      g.strokeRoundedRect(-20, -18, 30, 36, 6);

      g.fillStyle(0x663311);
      g.fillCircle(-15, -12, 2);
      g.fillCircle(-15, 12, 2);
      g.fillCircle(5, -12, 2);
      g.fillCircle(5, 12, 2);

      g.fillStyle(bronze);
      g.fillRect(10, -12, 20, 24);
      g.fillStyle(darkBronze);
      g.fillRect(12, -14, 4, 28);
      g.fillRect(22, -14, 4, 28);

      g.fillStyle(black);
      g.fillCircle(30, 0, 10);
      g.lineStyle(4, darkBronze);
      g.strokeCircle(30, 0, 10);

      // Recul
      g.fillStyle(0x555555);
      g.fillRect(-5, 18, 20, 6);
    } else if (level === 2) {
      // --- Niv 2 : Artillerie Lourde (Classique) ---
      const steel = 0x8899aa;
      const darkSteel = 0x445566;

      g.fillStyle(darkSteel);
      g.fillRoundedRect(-22, -20, 34, 40, 4);
      g.lineStyle(2, 0xaabbcc);
      g.strokeRoundedRect(-22, -20, 34, 40, 4);

      g.fillStyle(steel);
      g.fillRect(12, -14, 30, 28);
      g.fillStyle(darkSteel);
      g.fillRect(15, -14, 2, 28);
      g.fillRect(20, -14, 2, 28);
      g.fillRect(25, -14, 2, 28);
      g.fillRect(30, -14, 2, 28);

      g.fillStyle(black);
      g.fillCircle(42, 0, 12);
      g.lineStyle(4, darkSteel);
      g.strokeCircle(42, 0, 12);
      g.fillStyle(0x333333);
      g.fillRect(-10, -22, 10, 8);
      g.fillStyle(0x555555);
      g.fillRect(-5, 18, 20, 6);
    } else {
      // --- Niv 3 : Système de Missiles "Titan" (RE-DESIGN COMPLET) ---
      const hullColor = 0xe0e0e0; // Blanc cassé blindage
      const darkHull = 0x546e7a; // Bleu gris sombre
      const accent = 0xff3d00; // Orange sécurité
      const glow = 0x00eaff; // Cyan futuriste

      // 1. Base pivotante lourde
      g.fillStyle(0x263238);
      g.fillCircle(0, 0, 22);
      g.lineStyle(2, 0x37474f);
      g.strokeCircle(0, 0, 22);

      // 2. Corps central blindé (Anguleux)
      g.fillStyle(hullColor);
      g.beginPath();
      g.moveTo(-15, -15);
      g.lineTo(25, -15);
      g.lineTo(35, 0);
      g.lineTo(25, 15);
      g.lineTo(-15, 15);
      g.closePath();
      g.fill();
      g.lineStyle(2, 0x90a4ae);
      g.strokePath();

      // Détails techniques sur le dessus
      g.fillStyle(0x263238);
      g.fillRect(-5, -8, 15, 16); // Trappe maintenance
      g.fillStyle(accent);
      g.fillRect(20, -5, 4, 10); // Indicateur de tir

      // 3. Pods de missiles latéraux (Gauche et Droite)
      const drawPod = (offsetY) => {
        // Structure du pod
        g.fillStyle(darkHull);
        g.fillRoundedRect(-10, offsetY - 10, 35, 20, 4);
        g.lineStyle(1, 0x000000);
        g.strokeRoundedRect(-10, offsetY - 10, 35, 20, 4);

        // Têtes de missiles visibles
        g.fillStyle(0x000000);
        g.fillCircle(25, offsetY, 6); // Le trou
        g.fillStyle(0xff0000);
        g.fillCircle(25, offsetY, 3); // La tête du missile

        // Lumière d'état sur le pod
        g.fillStyle(glow);
        g.fillRect(0, offsetY - 2, 8, 4);
      };

      drawPod(-20); // Pod Gauche
      drawPod(20); // Pod Droit

      // 4. Radar/Optique sur le côté
      g.lineStyle(2, glow, 0.6);
      g.strokeCircle(10, 0, 8);
      g.fillStyle(glow, 0.3);
      g.fillCircle(10, 0, 3);
    }

    container.add(g);

    // Badge niveau
    const badge = scene.add.container(-20, 20);
    let badgeColorStr = "#ffffff";
    let badgeColorHex = 0xffffff;

    if (level === 2) {
      badgeColorStr = "#00ffff";
      badgeColorHex = 0x00ffff;
    } else if (level === 3) {
      badgeColorStr = "#ff00aa";
      badgeColorHex = 0xff00aa;
    }

    const badgeBg = scene.add.rectangle(0, 0, 24, 14, 0x000000, 0.55);
    badgeBg.setStrokeStyle(1, badgeColorHex, 0.9);
    const lvlText = scene.add
      .text(0, 0, `Lv.${level}`, {
        fontSize: "10px",
        fontFamily: "Arial",
        color: badgeColorStr,
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    badge.add([badgeBg, lvlText]);
    container.add(badge);
  },

  // ============================================================
  // LOGIQUE DE TIR
  // ============================================================
  onFire: (scene, turret, target) => {
    if (!scene || !turret || !target || !target.active) return;
    const level = turret.level || 1;

    if (level < 3) {
      // --- LOGIQUE NIV 1 & 2 : OBUS EN CLOCHE (INCHANGÉ) ---
      const spread = 5;
      const impactX = target.x + (Math.random() - 0.5) * spread;
      const impactY = target.y + (Math.random() - 0.5) * spread;
      const blastRadius = turret.config.aoe;
      const damageAmount = turret.config.damage;

      const muzzle = scene.add.circle(turret.x, turret.y, 10, 0xffaa00, 0.8);
      scene.tweens.add({
        targets: muzzle,
        scale: 2,
        alpha: 0,
        duration: 100,
        onComplete: () => muzzle.destroy(),
      });

      const shell = scene.add.circle(turret.x, turret.y, 4, 0x000000, 1);
      shell.setStrokeStyle(2, 0x555555);
      shell.setDepth(200);
      const shadow = scene.add.ellipse(turret.x, turret.y, 8, 4, 0x000000, 0.3);
      shadow.setDepth(5);

      const dist = Phaser.Math.Distance.Between(
        turret.x,
        turret.y,
        impactX,
        impactY
      );
      const flightTime = Phaser.Math.Clamp(dist * 2.5, 400, 800);
      const peakHeight = 150;

      scene.tweens.add({
        targets: [shell, shadow],
        x: impactX,
        y: impactY,
        duration: flightTime,
        ease: "Linear",
      });
      scene.tweens.add({
        targets: shell,
        z: 1,
        duration: flightTime,
        ease: "Linear",
        onUpdate: (tween) => {
          const progress = tween.progress;
          const heightOffset = Math.sin(progress * Math.PI) * peakHeight;
          shell.y = turret.y + (impactY - turret.y) * progress - heightOffset;
        },
        onComplete: () => {
          shell.destroy();
          shadow.destroy();
          triggerExplosion(
            scene,
            impactX,
            impactY,
            blastRadius,
            damageAmount,
            level,
            turret.config.key
          );
        },
      });
    } else {
      // --- LOGIQUE NIV 3 : MISSILE CINÉMATIQUE ---
      launchRealisticMissile(scene, turret, target);
    }
  },
};

// ============================================================
// NOUVEAU SYSTÈME DE MISSILE (PLUS FLUIDE ET RÉALISTE)
// ============================================================
function launchRealisticMissile(scene, turret, target) {
  const damageAmount = turret.config.damage * 2.5;
  const blastRadius = turret.config.aoe * 1.8;
  const flightDuration = 2500; // 3 secondes

  // 1. Design du Missile (Plus détaillé)
  const missile = scene.add.container(turret.x, turret.y);
  missile.setDepth(300);

  const mg = scene.add.graphics();
  // Flamme du réacteur (animée plus tard)
  mg.fillStyle(0x00ffff);
  mg.fillTriangle(0, 15, -4, 25, 4, 25);
  // Corps
  mg.fillStyle(0xffffff);
  mg.fillRoundedRect(-5, -20, 10, 35, 2);
  // Tête nucléaire
  mg.fillStyle(0xff0000);
  mg.fillTriangle(0, -30, -5, -20, 5, -20);
  // Ailerons arrière
  mg.fillStyle(0x445566);
  mg.beginPath();
  mg.moveTo(-5, 0);
  mg.lineTo(-14, 15);
  mg.lineTo(-5, 15);
  mg.fill(); // Gauche
  mg.beginPath();
  mg.moveTo(5, 0);
  mg.lineTo(14, 15);
  mg.lineTo(5, 15);
  mg.fill(); // Droite

  missile.add(mg);

  missile.setScale(0.6);

  // 2. Définition de la trajectoire COURBE (Pas de zigzag sec)
  // On crée un point de contrôle pour faire un bel arc de cercle
  // Le point de contrôle est décalé perpendiculairement à la cible
  const startX = turret.x;
  const startY = turret.y;

  // Angle initial vers la cible
  const angleToTarget = Phaser.Math.Angle.Between(
    startX,
    startY,
    target.x,
    target.y
  );

  // On détermine aléatoirement si l'arc part à gauche ou à droite (-1 ou 1)
  const arcSide = Math.random() > 0.5 ? 1 : -1;
  const arcIntensity = 200; // Amplitude de la courbe

  // Variables de suivi
  let prevX = startX;
  let prevY = startY;
  let smokeTimer = 0;

  // Flash de départ
  const flash = scene.add.circle(startX, startY, 25, 0xffaa00, 1);
  scene.tweens.add({
    targets: flash,
    scale: 2,
    alpha: 0,
    duration: 200,
    onComplete: () => flash.destroy(),
  });

  // 3. TWEEN AVEC COURBE DE BÉZIER DYNAMIQUE
  scene.tweens.add({
    targets: missile,
    z: 1, // Propriété fictive pour le tween
    duration: flightDuration,
    ease: "Quad.easeIn", // Commence doucement, accélère à la fin (effet gravité/propulsion)
    onUpdate: (tween, targetParam, param2, progress) => {
      if (!missile.active) return;

      // Position actuelle de la cible (ou dernière connue)
      const tx = target.active ? target.x : target.lastX || target.x;
      const ty = target.active ? target.y : target.lastY || target.y;

      // --- CALCUL DE LA POSITION ---
      // On calcule une courbe de Bézier quadratique à la volée.
      // P0 = Départ
      // P1 = Point de contrôle (qui bouge un peu pour faire "vivant")
      // P2 = Cible

      // Calcul du point de contrôle P1 :
      // Il est au milieu du trajet, mais décalé sur le côté pour créer l'arc
      const midX = (startX + tx) / 2;
      const midY = (startY + ty) / 2;

      // Vecteur perpendiculaire pour le décalage
      const dx = tx - startX;
      const dy = ty - startY;
      // Normalisation approximative pour le décalage
      const perpX = -dy * 0.5;
      const perpY = dx * 0.5;

      // Le point de contrôle se rapproche de la ligne directe à la fin (progress)
      // pour que le missile "rentre" dans la cible
      const currentArc = arcIntensity * (1 - progress);

      // Ajout d'une petite turbulence (Noise) pour le réalisme, pas un zigzag mathématique
      const turbulence = Math.sin(progress * 20) * 10 * (1 - progress); // Vibre moins à la fin

      const controlX =
        midX +
        ((perpX * arcSide) / (Math.abs(dx) + Math.abs(dy))) * currentArc +
        turbulence;
      const controlY =
        midY +
        ((perpY * arcSide) / (Math.abs(dx) + Math.abs(dy))) * currentArc +
        turbulence;

      // Formule de Bézier Quadratique : (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
      const t = progress;
      const x =
        (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * tx;
      const y =
        (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * ty;

      missile.x = x;
      missile.y = y;

      // --- CALCUL DE LA ROTATION (LISSÉE) ---
      // On regarde la différence avec la frame d'avant
      const angle = Math.atan2(y - prevY, x - prevX);
      // + PI/2 car le dessin pointe vers le haut (-Y)
      missile.setRotation(angle + Math.PI / 2);

      prevX = x;
      prevY = y;

      // --- FX DE TRAINÉE (SMOKE) ---
      smokeTimer += scene.game.loop.delta;
      if (smokeTimer > 20) {
        // Très dense
        smokeTimer = 0;
        const p = scene.add.circle(missile.x, missile.y, 4, 0x999999, 0.6);
        p.setDepth(290);
        scene.tweens.add({
          targets: p,
          scale: { from: 1, to: 3 },
          alpha: { from: 0.6, to: 0 },
          duration: 600,
          onComplete: () => p.destroy(),
        });

        // Petit cœur de flamme
        const f = scene.add.circle(missile.x, missile.y, 2, 0x00ffff, 1);
        f.setDepth(291);
        scene.tweens.add({
          targets: f,
          scale: 0,
          duration: 200,
          onComplete: () => f.destroy(),
        });
      }
    },
    onComplete: () => {
      const finalX = target.active ? target.x : missile.x;
      const finalY = target.active ? target.y : missile.y;
      missile.destroy();
      triggerExplosion(scene, finalX, finalY, blastRadius, damageAmount, 3, turret.config.key);
    },
  });
}

// ============================================================
// EXPLOSION (INCHANGÉE MAIS OPTIMISÉE)
// ============================================================
function triggerExplosion(scene, x, y, radius, damage, level, turretType) {
  const hitboxBuffer = 8;
  const effectiveRadius = radius + hitboxBuffer;
  const isLvl3 = level === 3;

  // Trace au sol
  const scorch = scene.add.circle(
    x,
    y,
    effectiveRadius,
    isLvl3 ? 0x001122 : 0x000000,
    0.6
  );
  scorch.setDepth(4);
  scorch.scaleY = 0.6;
  scene.tweens.add({
    targets: scorch,
    alpha: 0,
    duration: 2000,
    delay: 500,
    onComplete: () => scorch.destroy(),
  });

  // Flash
  const flash = scene.add.circle(x, y, radius, isLvl3 ? 0xccffff : 0xffaa00, 1);
  flash.setDepth(350);
  scene.tweens.add({
    targets: flash,
    scale: 1.5,
    alpha: 0,
    duration: 200,
    onComplete: () => flash.destroy(),
  });

  // Onde de choc
  const shock = scene.add.graphics();
  shock.setDepth(340);
  shock.lineStyle(isLvl3 ? 8 : 4, isLvl3 ? 0x00ffff : 0xffaa00);
  shock.strokeCircle(0, 0, radius);
  shock.setPosition(x, y);
  shock.setScale(0.1);
  scene.tweens.add({
    targets: shock,
    scale: 1.2,
    alpha: 0,
    duration: 400,
    onComplete: () => shock.destroy(),
  });

  // Particules
  const pCount = isLvl3 ? 20 : 8;
  for (let i = 0; i < pCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * radius * 0.5;
    const px = x + Math.cos(angle) * dist;
    const py = y + Math.sin(angle) * dist;

    // Mixte feu/fumée ou plasma/fumée
    const color = isLvl3
      ? Math.random() > 0.5
        ? 0x00ffff
        : 0x555555
      : 0x666666;

    const p = scene.add.circle(px, py, Math.random() * 4 + 2, color, 1);
    p.setDepth(345);
    scene.tweens.add({
      targets: p,
      x: px + Math.cos(angle) * radius,
      y: py + Math.sin(angle) * radius - 50,
      alpha: 0,
      scale: 0.5,
      duration: Math.random() * 500 + 500,
      onComplete: () => p.destroy(),
    });
  }

  // Dégâts
  if (scene.enemies) {
    scene.enemies.children.each((e) => {
      if (
        e.active &&
        Phaser.Math.Distance.Between(x, y, e.x, e.y) <= effectiveRadius
      ) {
        e.damage(damage, { source: "turret", turretType: turretType });
        if (e.bodyGroup) {
          scene.tweens.add({
            targets: e.bodyGroup,
            tint: isLvl3 ? 0x00ffff : 0xff0000,
            duration: 100,
            yoyo: true,
          });
        }
      }
    });
  }
}
