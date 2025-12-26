import { LEVELS_CONFIG } from "../levels/index.js";

export const machine_gun = {
  key: "machine_gun",
  name: "Mitrailleuse",
  cost: 90,
  range: 100,
  damage: 10,
  rate: 290,
  color: 0x4488ff,
  maxLevel: 3, // Sera ajusté dynamiquement selon le chapitre
  description: "Tourelle polyvalente avec cadence de tir très élevée.\n\n✅ Avantages:\n• Cadence de tir rapide\n• Dégâts constants\n• Portée correcte\n\n❌ Inconvénients:\n• Dégâts par tir faibles\n• Moins efficace contre les ennemis blindés",

  // Fonction pour obtenir les stats selon le chapitre
  getStatsForChapter(chapterId) {
    if (chapterId >= 2) {
      // Chapitre 2 et plus : stats améliorées
      return {
        maxLevel: 4,
        damage: [10, 15, 22, 35], // Dégâts par niveau (niveau 4 augmenté)
        rate: [290, 260, 230, 200], // Cadence de tir (plus rapide = nombre plus petit)
        range: [100, 110, 120, 130], // Portée par niveau
      };
    } else {
      // Chapitre 1 : stats originales
      return {
        maxLevel: 3,
        damage: [10, 15, 22],
        rate: [290, 260, 230],
        range: [100, 110, 120],
      };
    }
  },

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
    } else if (level === 3) {
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
    } else {
      // === NIVEAU 4 : Élite Ultime (Chapitre 2 uniquement) - Double Gatling ===
      const eliteGold = 0xffd700;
      const elitePurple = 0x8b00ff;
      const eliteSilver = 0xc0c0c0;
      
      // Corps massif avec renforts dorés
      g.fillStyle(0x000011); // Presque noir
      g.fillRoundedRect(-20, -22, 40, 44, 6);
      g.lineStyle(3, eliteGold);
      g.strokeRoundedRect(-20, -22, 40, 44, 6);
      
      // Renforts dorés aux coins
      g.fillStyle(eliteGold);
      g.fillRect(-20, -22, 6, 6);
      g.fillRect(14, -22, 6, 6);
      g.fillRect(-20, 16, 6, 6);
      g.fillRect(14, 16, 6, 6);
      g.lineStyle(2, 0xcc9900);
      g.strokeRect(-20, -22, 6, 6);
      g.strokeRect(14, -22, 6, 6);
      g.strokeRect(-20, 16, 6, 6);
      g.strokeRect(14, 16, 6, 6);

      // Double bloc Gatling (gauche et droite)
      // Gatling gauche
      g.fillStyle(darkMetal);
      g.fillCircle(22, -8, 14);
      g.fillStyle(lightMetal);
      g.fillCircle(22, -12, 4);
      g.fillCircle(22, -4, 4);
      g.fillCircle(17, -8, 4);
      g.fillCircle(27, -8, 4);
      
      // Gatling droit
      g.fillStyle(darkMetal);
      g.fillCircle(22, 8, 14);
      g.fillStyle(lightMetal);
      g.fillCircle(22, 4, 4);
      g.fillCircle(22, 12, 4);
      g.fillCircle(17, 8, 4);
      g.fillCircle(27, 8, 4);
      
      // Ornements dorés sur les Gatlings
      g.fillStyle(eliteGold);
      g.fillCircle(22, -8, 6);
      g.fillCircle(22, 8, 6);
      g.lineStyle(2, 0xcc9900);
      g.strokeCircle(22, -8, 6);
      g.strokeCircle(22, 8, 6);
      
      // Motifs violets
      g.fillStyle(elitePurple, 0.5);
      g.fillCircle(22, -8, 4);
      g.fillCircle(22, 8, 4);

      // Support central renforcé
      g.fillStyle(color);
      g.fillRect(8, -16, 18, 32);
      g.lineStyle(2, eliteGold);
      g.strokeRect(8, -16, 18, 32);
      
      // Double laser de visée
      g.fillStyle(0xff0000);
      g.fillRect(-2, -24, 8, 2);
      g.fillStyle(elitePurple);
      g.fillRect(-2, -22, 8, 1);
      
      // Écrans de contrôle latéraux
      g.fillStyle(0x00ff00, 0.8);
      g.fillRect(-18, -10, 4, 8);
      g.fillRect(-18, 2, 4, 8);
      
      // Éclairs magiques (effet spécial chapitre 2)
      g.lineStyle(2, elitePurple, 0.6);
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const startX = Math.cos(angle) * 18;
        const startY = Math.sin(angle) * 18;
        const endX = Math.cos(angle) * 24;
        const endY = Math.sin(angle) * 24;
        g.lineBetween(startX, startY, endX, endY);
      }
    }

    // Pivot central
    g.fillStyle(0x111111);
    g.fillCircle(0, 0, 6);

    container.add(g);

    // --- INDICATEUR DE NIVEAU ---
    const badge = scene.add.container(-20, 20);
    const badgeBg = scene.add.rectangle(0, 0, 24, 14, 0x000000, 0.7);
    const badgeColor = level === 4 ? 0xffd700 : level === 3 ? gold : 0xffffff;
    badgeBg.setStrokeStyle(level === 4 ? 2 : 1, badgeColor);
    const lvlText = scene.add
      .text(0, 0, `Lv.${level}`, {
        fontSize: level === 4 ? "11px" : "10px",
        fontFamily: "Arial",
        color: level === 4 ? "#ffd700" : level === 3 ? "#ffd700" : "#ffffff",
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

    const barrelLen = level === 1 ? 30 : level === 2 ? 42 : level === 3 ? 38 : 45;

    if (level === 4) {
      // Niveau 4 : Double tir (gauche et droite)
      turret.fireAlt = !turret.fireAlt;
      const offsets = turret.fireAlt ? [-8, 8] : [8, -8];
      
      offsets.forEach((offsetSide, idx) => {
        const tipX =
          turret.x + Math.cos(angle) * barrelLen - Math.sin(angle) * offsetSide;
        const tipY =
          turret.y + Math.sin(angle) * barrelLen + Math.cos(angle) * offsetSide;

        // Flash doré/violet
        const flashColor = idx === 0 ? 0xffd700 : 0x8b00ff;
        const flash = scene.add.circle(tipX, tipY, 14, flashColor, 0.9);
        scene.tweens.add({
          targets: flash,
          scale: 0,
          duration: 50,
          onComplete: () => flash.destroy(),
        });

        // Traceur élite
        const tracer = scene.add.graphics();
        const tracerColor = idx === 0 ? 0xffaa00 : 0xff00ff;
        tracer.lineStyle(4, tracerColor, 0.9);
        tracer.lineBetween(tipX, tipY, target.x, target.y);
        scene.time.delayedCall(80, () => tracer.destroy());
      });
      
      // Dégâts doubles
      if (target.active) {
        target.damage(turret.config.damage, { source: "turret", turretType: turret.config.key });
        // Impact visuel élite
        const impact = scene.add.circle(target.x, target.y, 8, 0xffd700, 0.8);
        scene.tweens.add({
          targets: impact,
          scale: 0,
          duration: 150,
          onComplete: () => impact.destroy(),
        });
      }
    } else {
      // Niveaux 1-3 : comportement normal
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
        target.damage(turret.config.damage, { source: "turret", turretType: turret.config.key });
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
    }
  },
};
