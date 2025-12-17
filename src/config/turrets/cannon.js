export const cannon = {
  key: "cannon",
  name: "Mortier",
  cost: 220,
  range: 160,
  damage: 80,
  rate: 2000,
  color: 0xff8844,
  aoe: 100,
  maxLevel: 2,

  // --- DESSIN DU CANON (ÉVOLUTIF) ---
  onDrawBarrel: (scene, container, color, turret) => {
    const g = scene.add.graphics();
    const level = turret.level || 1;

    // Palette Niv 1 (Bronze)
    const bronze = 0xcd7f32;
    const darkBronze = 0xa05a2c;

    // Palette Niv 2 (Acier Lourd)
    const steel = 0x8899aa;
    const darkSteel = 0x445566;

    const black = 0x111111;
    const heavyMetal = 0x555555;

    if (level === 1) {
      // === NIVEAU 1 : Mortier Bronze ===
      // Base pivotante
      g.fillStyle(darkBronze);
      g.fillRoundedRect(-20, -18, 30, 36, 6);
      g.lineStyle(3, 0x663311);
      g.strokeRoundedRect(-20, -18, 30, 36, 6);
      // Rivets
      g.fillStyle(0x663311);
      g.fillCircle(-15, -12, 2);
      g.fillCircle(-15, 12, 2);
      g.fillCircle(5, -12, 2);
      g.fillCircle(5, 12, 2);

      // Canon Court
      g.fillStyle(bronze);
      g.fillRect(10, -12, 20, 24);
      g.fillStyle(darkBronze); // Renforts
      g.fillRect(12, -14, 4, 28);
      g.fillRect(22, -14, 4, 28);

      // Bouche
      g.fillStyle(black);
      g.fillCircle(30, 0, 10);
      g.lineStyle(4, darkBronze);
      g.strokeCircle(30, 0, 10);
    } else {
      // === NIVEAU 2 : Artillerie Lourde (Acier) ===
      // Base blindée plus large
      g.fillStyle(darkSteel);
      g.fillRoundedRect(-22, -20, 34, 40, 4);
      g.lineStyle(2, 0xaabbcc); // Bordure claire
      g.strokeRoundedRect(-22, -20, 34, 40, 4);

      // Canon Long et Massif
      g.fillStyle(steel);
      g.fillRect(12, -14, 30, 28); // Plus long

      // Système de refroidissement (lamelles)
      g.fillStyle(darkSteel);
      g.fillRect(15, -14, 2, 28);
      g.fillRect(20, -14, 2, 28);
      g.fillRect(25, -14, 2, 28);
      g.fillRect(30, -14, 2, 28);

      // Bouche énorme
      g.fillStyle(black);
      g.fillCircle(42, 0, 12);
      g.lineStyle(4, darkSteel);
      g.strokeCircle(42, 0, 12);

      // Chargeur automatique sur le côté
      g.fillStyle(0x333333);
      g.fillRect(-10, -22, 10, 8);
    }

    // Recul (Commun)
    g.fillStyle(heavyMetal);
    g.fillRect(-5, 18, 20, 6);
    g.fillStyle(0x888888);
    g.fillRect(-2, 20, 15, 2);

    container.add(g);

    // --- INDICATEUR NIVEAU ---
    const badge = scene.add.container(-20, 20);
    const badgeColor = level === 2 ? 0x00ffff : 0xffffff;
    const badgeBg = scene.add.rectangle(0, 0, 24, 14, 0x000000, 0.7);
    badgeBg.setStrokeStyle(1, badgeColor);
    const lvlText = scene.add
      .text(0, 0, `Lv.${level}`, {
        fontSize: "10px",
        fontFamily: "Arial",
        color: level === 2 ? "#00ffff" : "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    badge.add([badgeBg, lvlText]);
    container.add(badge);
  },

  // --- LOGIQUE DE TIR DE ZONE ---
  onFire: (scene, turret, target) => {
    const level = turret.level || 1;
    const targetX = target.x;
    const targetY = target.y;

    // 1. Muzzle Flash (Plus gros au niv 2)
    const flashSize = level === 2 ? 30 : 20;
    const flashColor = level === 2 ? 0xffdd88 : 0xaaaaaa;

    const muzzleFlash = scene.add.circle(
      turret.x,
      turret.y,
      flashSize,
      flashColor,
      0.8
    );
    scene.tweens.add({
      targets: muzzleFlash,
      scale: 2,
      alpha: 0,
      duration: 300,
      onComplete: () => muzzleFlash.destroy(),
    });

    // 2. Projectile
    const shellSize = level === 2 ? 10 : 8;
    const shellColor = level === 2 ? 0x444444 : 0x222222;
    const shell = scene.add.circle(turret.x, turret.y, shellSize, shellColor);
    shell.setStrokeStyle(2, 0x000000);
    shell.setDepth(100);

    // 3. Trajectoire
    scene.tweens.add({
      targets: shell,
      scale: 1.8,
      duration: 350,
      yoyo: true,
      ease: "Sine.easeInOut",
    });

    scene.tweens.add({
      targets: shell,
      x: targetX,
      y: targetY,
      duration: 700,
      ease: "Linear",
      onComplete: () => {
        shell.destroy();

        // 4. Explosion
        // Niv 2 = Explosion plus rouge/sombre et plus grande
        const blastColor = level === 2 ? 0xcc2200 : 0xff4400;
        const blastRadius = turret.config.aoe; // L'AoE a été updatée dans Turret.js lors de l'upgrade

        const blast = scene.add.circle(targetX, targetY, 10, blastColor, 0.9);
        blast.setDepth(99);
        scene.tweens.add({
          targets: blast,
          radius: blastRadius,
          alpha: 0,
          duration: 400,
          ease: "Quad.easeOut",
          onComplete: () => blast.destroy(),
        });

        // Flash blanc interne
        const innerBlast = scene.add.circle(targetX, targetY, 10, 0xffffaa, 1);
        innerBlast.setDepth(100);
        scene.tweens.add({
          targets: innerBlast,
          radius: blastRadius / 2,
          alpha: 0,
          duration: 200,
          onComplete: () => innerBlast.destroy(),
        });

        // 5. Dégâts de zone
        const allEnemies = scene.enemies.getChildren();
        allEnemies.forEach((e) => {
          if (e.active) {
            const dist = Phaser.Math.Distance.Between(
              targetX,
              targetY,
              e.x,
              e.y
            );
            if (dist <= blastRadius) {
              e.damage(turret.config.damage);
            }
          }
        });
      },
    });
  },
};
