export const machine_gun = {
  key: "machine_gun",
  name: "Mitrailleuse",
  cost: 90,
  range: 95,
  damage: 9,
  rate: 290,
  color: 0x4488ff,
  maxLevel: 3,
  description: "Tourelle polyvalente avec cadence de tir très élevée.\n\n✅ Avantages:\n• Cadence de tir rapide\n• Dégâts constants\n• Portée correcte\n\n❌ Inconvénients:\n• Dégâts par tir faibles\n• Moins efficace contre les ennemis blindés",

  // --- DESSIN ÉVOLUTIF (Base + 2 Améliorations) ---
  // Note: On assume que Turret.js passe (scene, container, color, turretInstance)
  onDrawBarrel: (scene, container, color, turret) => {
    const g = scene.add.graphics();
    const level = turret.level || 1; // Niveau actuel (1, 2 ou 3)

    // Palette de couleurs
    const darkMetal = 0x222222;
    const lightMetal = 0x8899aa;
    const gold = 0xffd700;
    const ammoColor = 0xccaa00;

    // --- DESIGN SELON LE NIVEAU ---
    if (level === 1) {
      // === NIVEAU 1 : Standard ===
      g.fillStyle(color);
      g.fillRoundedRect(-10, -10, 20, 20, 3); // Culasse

      g.fillStyle(lightMetal);
      g.fillRect(10, -6, 20, 4); // Canon gauche
      g.fillRect(10, 2, 20, 4); // Canon droit

      g.fillStyle(darkMetal);
      g.fillRect(30, -6, 3, 4); // Embout gauche
      g.fillRect(30, 2, 3, 4); // Embout droit
    } else if (level === 2) {
      // === NIVEAU 2 : Renforcé ===
      g.fillStyle(0x113355); // Bleu nuit
      g.fillRoundedRect(-14, -14, 28, 28, 4); // Culasse large
      g.lineStyle(2, 0x557799);
      g.strokeRoundedRect(-14, -14, 28, 28, 4);

      g.fillStyle(lightMetal);
      g.fillRect(14, -8, 28, 6); // Canons longs
      g.fillRect(14, 2, 28, 6);

      g.fillStyle(darkMetal);
      g.fillRect(20, -8, 10, 2); // Events
      g.fillRect(20, 6, 10, 2);

      g.fillStyle(ammoColor);
      g.fillRect(-12, -8, 6, 16); // Chargeur
    } else {
      // === NIVEAU 3 : Élite (Gatling) ===
      g.fillStyle(0x001133); // Presque noir
      g.fillRoundedRect(-16, -18, 32, 36, 5); // Corps massif
      g.lineStyle(2, gold);
      g.strokeRoundedRect(-16, -18, 32, 36, 5); // Bordure dorée

      // Bloc Gatling
      g.fillStyle(darkMetal);
      g.fillCircle(25, 0, 12);
      g.fillStyle(lightMetal);
      g.fillCircle(25, -5, 3);
      g.fillCircle(25, 5, 3);
      g.fillCircle(20, 0, 3);
      g.fillCircle(30, 0, 3);

      g.fillStyle(color);
      g.fillRect(10, -12, 15, 24); // Support
      g.fillStyle(0xff0000);
      g.fillRect(0, -20, 10, 2); // Laser
    }

    // Pivot central
    g.fillStyle(0x111111);
    g.fillCircle(0, 0, 6);

    container.add(g);

    // --- INDICATEUR DE NIVEAU ---
    const badge = scene.add.container(-20, 20);
    const badgeBg = scene.add.rectangle(0, 0, 24, 14, 0x000000, 0.7);
    badgeBg.setStrokeStyle(1, level === 3 ? gold : 0xffffff);
    const lvlText = scene.add
      .text(0, 0, `Lv.${level}`, {
        fontSize: "10px",
        fontFamily: "Arial",
        color: level === 3 ? "#ffd700" : "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    badge.add([badgeBg, lvlText]);
    container.add(badge);
  },

  // --- LOGIQUE DE TIR ---
  onFire: (scene, turret, target) => {
    const level = turret.level || 1;
    const angle = turret.barrelGroup.rotation;

    const barrelLen = level === 1 ? 30 : level === 2 ? 42 : 38;

    // Alternance des canons
    turret.fireAlt = !turret.fireAlt;
    const offsetSide = turret.fireAlt ? 4 : -4;

    const tipX =
      turret.x + Math.cos(angle) * barrelLen - Math.sin(angle) * offsetSide;
    const tipY =
      turret.y + Math.sin(angle) * barrelLen + Math.cos(angle) * offsetSide;

    // Flash
    const flashColor = level === 3 ? 0xffaa00 : 0xffffaa;
    const flashSize = level === 3 ? 12 : 8;
    const flash = scene.add.circle(tipX, tipY, flashSize, flashColor, 0.9);
    scene.tweens.add({
      targets: flash,
      scale: 0,
      duration: 50,
      onComplete: () => flash.destroy(),
    });

    // Traceur
    const tracer = scene.add.graphics();
    const tracerColor = level === 3 ? 0xff4400 : 0xffdd44;
    const tracerWidth = level === 3 ? 3 : 2;
    tracer.lineStyle(tracerWidth, tracerColor, 0.8);
    tracer.lineBetween(tipX, tipY, target.x, target.y);
    scene.time.delayedCall(60, () => tracer.destroy());

    // Dégâts
    if (target.active) {
      target.damage(turret.config.damage);
      if (level >= 2) {
        // Impact visuel à partir du niveau 2
        const impact = scene.add.circle(target.x, target.y, 5, 0xffffff, 0.7);
        scene.tweens.add({
          targets: impact,
          scale: 0,
          duration: 100,
          onComplete: () => impact.destroy(),
        });
      }
    }
  },
};
