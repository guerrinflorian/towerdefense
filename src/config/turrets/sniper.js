export const sniper = {
  key: "sniper",
  name: "Sniper",
  cost: 270,
  range: 160, // Très longue portée
  damage: 158, // Dégâts massifs
  rate: 2200, // Tir très lent
  color: 0x44ff44, // Vert fluo (interface)
  maxLevel: 3,
  description: "Tourelle de précision avec dégâts massifs et très longue portée.\n\n✅ Avantages:\n• Dégâts énormes par tir\n• Portée exceptionnelle\n• Idéal contre les ennemis résistants\n\n❌ Inconvénients:\n• Cadence de tir très lente\n• Coût élevé\n• Moins efficace contre les groupes",

  // --- DESSIN ÉVOLUTIF ---
  onDrawBarrel: (scene, container, color, turret) => {
    const g = scene.add.graphics();
    const level = turret.level || 1;

    // Palette
    const black = 0x111111;
    const darkGrey = 0x333333;
    const camoGreen = 0x336633;
    const techWhite = 0xeeeeee;
    const energyBlue = 0x00ffff;
    const lensColor = 0x000000;

    if (level === 1) {
      // === NIVEAU 1 : Fusil de précision standard ===
      // Canon fin
      g.fillStyle(black);
      g.fillRect(0, -3, 45, 6);

      // Corps
      g.fillStyle(camoGreen);
      g.fillRect(-10, -6, 25, 12);

      // Lunette simple (Ronde)
      g.fillStyle(darkGrey);
      g.fillRect(-5, -10, 15, 4); // Support
      g.fillCircle(0, -10, 4); // Oculaire
      g.fillCircle(10, -10, 4); // Objectif
    } else if (level === 2) {
      // === NIVEAU 2 : Heavy Sniper (Calibre .50) ===
      // Canon lourd
      g.fillStyle(darkGrey);
      g.fillRect(0, -4, 50, 8);

      // Frein de bouche (le bout carré pour le recul)
      g.fillStyle(black);
      g.fillRect(50, -6, 8, 12);

      // Corps renforcé
      g.fillStyle(0x224422); // Vert foncé
      g.fillRoundedRect(-15, -8, 35, 16, 2);

      // Lunette Tactique (Carrée/Digitale)
      g.fillStyle(black);
      g.fillRect(-5, -14, 20, 6);
      g.fillStyle(0x00ff00); // Lentille verte
      g.fillRect(15, -14, 2, 6);

      // Bipied replié en dessous
      g.fillStyle(darkGrey);
      g.fillRect(10, 5, 20, 3);
    } else {
      // === NIVEAU 3 : RAILGUN (Futuriste) ===
      // Rails magnétiques (Haut et Bas)
      g.fillStyle(techWhite);
      g.fillRect(0, -10, 55, 4); // Rail haut
      g.fillRect(0, 6, 55, 4); // Rail bas

      // Noyau d'énergie (au milieu)
      g.fillStyle(energyBlue, 0.8);
      g.fillRect(5, -2, 45, 4); // Lueur interne

      // Corps High-Tech
      g.fillStyle(darkGrey);
      g.fillRoundedRect(-15, -12, 30, 24, 4);
      g.lineStyle(2, energyBlue);
      g.strokeRoundedRect(-15, -12, 30, 24, 4); // Bordure néon

      // Lunette Holographique
      g.lineStyle(1, energyBlue, 0.5);
      g.strokeRect(-5, -18, 15, 6);
      g.fillStyle(energyBlue, 0.3);
      g.fillRect(-5, -18, 15, 6);
    }

    // Pivot central
    g.fillStyle(black);
    g.fillCircle(0, 0, 5);

    container.add(g);

    // --- INDICATEUR DE NIVEAU ---
    // Un petit badge sur le côté
    const badge = scene.add.container(-20, 20);
    const badgeBg = scene.add.rectangle(0, 0, 24, 14, 0x000000, 0.7);
    badgeBg.setStrokeStyle(1, level === 3 ? energyBlue : 0xffffff);

    const lvlText = scene.add
      .text(0, 0, `Lv.${level}`, {
        fontSize: "10px",
        fontFamily: "Arial",
        color: level === 3 ? energyBlue : "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    badge.add([badgeBg, lvlText]);
    container.add(badge);
  },

  // --- LOGIQUE DE TIR (Railgun au niveau 3) ---
  onFire: (scene, turret, target) => {
    const level = turret.level || 1;
    const angle = turret.barrelGroup.rotation;

    // Longueur du canon pour savoir d'où part le tir
    const barrelLen = level === 1 ? 45 : level === 2 ? 58 : 55;
    const tipX = turret.x + Math.cos(angle) * barrelLen;
    const tipY = turret.y + Math.sin(angle) * barrelLen;

    // --- EFFETS VISUELS ---

    if (level < 3) {
      // NIVEAU 1 & 2 : Tir de balle classique mais puissant

      // 1. Flash de bouche
      const flashColor = level === 2 ? 0xffaa00 : 0xffffaa;
      const flashSize = level === 2 ? 20 : 15;
      const flash = scene.add.circle(tipX, tipY, flashSize, flashColor, 1);
      scene.tweens.add({
        targets: flash,
        scale: 0,
        alpha: 0,
        duration: 150,
        onComplete: () => flash.destroy(),
      });

      // 2. Traînée blanche (Vapeur)
      const beam = scene.add.graphics();
      const thickness = level === 2 ? 4 : 2;
      beam.lineStyle(thickness, 0xffffff, 0.8);
      beam.lineBetween(tipX, tipY, target.x, target.y);

      // Disparition rapide
      scene.tweens.add({
        targets: beam,
        alpha: 0,
        duration: 200,
        onComplete: () => beam.destroy(),
      });
    } else {
      // NIVEAU 3 : RAILGUN (Rayon d'énergie)

      // 1. Accumulation d'énergie (Flash bleu cyan)
      const flash = scene.add.circle(tipX, tipY, 25, 0x00ffff, 1);
      scene.tweens.add({
        targets: flash,
        scale: 0,
        alpha: 0,
        duration: 300,
        onComplete: () => flash.destroy(),
      });

      // 2. Le Rayon principal (Cœur blanc, bord bleu)
      const beam = scene.add.graphics();
      // Aura bleue
      beam.lineStyle(10, 0x00ffff, 0.4);
      beam.lineBetween(tipX, tipY, target.x, target.y);
      // Cœur blanc pur
      beam.lineStyle(4, 0xffffff, 1);
      beam.lineBetween(tipX, tipY, target.x, target.y);

      // Disparition lente et stylée
      scene.tweens.add({
        targets: beam,
        alpha: 0,
        duration: 400,
        onComplete: () => beam.destroy(),
      });

      // 3. Particules sur le trajet (optionnel, pour le style)
      // On pourrait ajouter des petites étincelles ici
    }

    // --- DÉGÂTS ET IMPACT ---
    if (target.active) {
      target.damage(turret.config.damage, { source: "turret", turretType: turret.config.key });

      // Impact sur la cible
      const impactColor = level === 3 ? 0x00ffff : 0xffffff;
      const impactSize = level === 3 ? 30 : 20;

      const impact = scene.add.circle(
        target.x,
        target.y,
        impactSize,
        impactColor,
        0.8
      );
      scene.tweens.add({
        targets: impact,
        scale: 0,
        duration: 150,
        onComplete: () => impact.destroy(),
      });
    }
  },
};
