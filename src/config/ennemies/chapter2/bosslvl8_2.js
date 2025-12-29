import { playBosslvl8Transform2Animation } from "./animations/bosslvl8_transform2.js";

export const bosslvl8_2 = {
  name: "FERROX L'ALCHIMISTE MÉCANIQUE - PHASE 2",
  speed: 11,
  hp: 70000, //70000
  reward: 0,
  playerDamage: 20,
  color: 0x8b4513, // Brun/Orange (plus chaud)
  damage: 650,
  attackSpeed: 1600,
  scale: 1.2,
  
  // Transformation en phase 3 à la mort
  nextPhase: "bosslvl8_3",

  onDraw: (scene, container, color, enemyInstance) => {
    // Phase 2 : Design amélioré (vous pourrez l'améliorer)
    enemyInstance.vials = [];
    enemyInstance.gears = [];
    enemyInstance.steamParticles = [];

    // --- 1. VAPEURS CHIMIQUES INTENSIFIÉES ---
    const steamGroup = scene.add.container(0, 0);
    for (let i = 0; i < 15; i++) {
      const steam = scene.add.graphics();
      steam.fillStyle(0x8b4513, 0.4);
      steam.fillEllipse(0, 0, 18 + Math.random() * 12, 30 + Math.random() * 18);
      steam.x = (Math.random() - 0.5) * 120;
      steam.y = (Math.random() - 0.5) * 120;
      steamGroup.add(steam);
      enemyInstance.steamParticles.push(steam);
    }
    container.add(steamGroup);
    enemyInstance.steamGroup = steamGroup;

    // --- 2. JAMBES MÉCANIQUES RENFORCÉES ---
    const legs = scene.add.graphics();
    legs.fillStyle(0x654321); // Brun foncé
    legs.lineStyle(4, 0x8b4513, 0.9);
    
    // Jambes plus massives
    legs.fillRoundedRect(-40, 10, 32, 42, 5);
    legs.strokeRoundedRect(-40, 10, 32, 42, 5);
    legs.fillRoundedRect(8, 10, 32, 42, 5);
    legs.strokeRoundedRect(8, 10, 32, 42, 5);
    
    // Articulations renforcées
    legs.fillStyle(0x1a1a1a);
    legs.fillCircle(-24, 28, 10);
    legs.fillCircle(24, 28, 10);
    legs.lineStyle(3, 0x8b4513);
    legs.strokeCircle(-24, 28, 10);
    legs.strokeCircle(24, 28, 10);
    
    // Pieds plus larges
    legs.fillStyle(0x1a1a1a);
    legs.fillRoundedRect(-45, 50, 42, 10, 3);
    legs.fillRoundedRect(3, 50, 42, 10, 3);
    container.add(legs);

    // --- 3. TORSE BLINDÉ RENFORCÉ ---
    const bodyContainer = scene.add.container(0, 0);
    const torso = scene.add.graphics();
    torso.fillStyle(0x654321);
    torso.lineStyle(5, 0x8b4513, 0.9);
    
    // Torse plus large
    const torsoPath = [
      -60, -35,
      60, -35,
      52, 25,
      -52, 25
    ];
    torso.fillPoints(
      [
        { x: torsoPath[0], y: torsoPath[1] },
        { x: torsoPath[2], y: torsoPath[3] },
        { x: torsoPath[4], y: torsoPath[5] },
        { x: torsoPath[6], y: torsoPath[7] },
      ],
      true
    );
    torso.strokePoints(
      [
        { x: torsoPath[0], y: torsoPath[1] },
        { x: torsoPath[2], y: torsoPath[3] },
        { x: torsoPath[4], y: torsoPath[5] },
        { x: torsoPath[6], y: torsoPath[7] },
      ],
      true
    );
    
    // Plaques de blindage renforcées
    torso.lineStyle(3, 0x8b4513, 0.8);
    torso.strokeRect(-55, -30, 110, 50);
    torso.strokeRect(-50, -25, 100, 40);
    
    bodyContainer.add(torso);
    container.add(bodyContainer);
    enemyInstance.bodyGroup = bodyContainer;

    // --- 4. CŒUR ALCHEMIQUE INTENSIFIÉ ---
    const core = scene.add.graphics();
    core.fillStyle(0xff6347, 0.95); // Rouge plus vif
    core.fillCircle(0, -5, 16);
    core.lineStyle(5, 0xff4500, 0.7);
    core.strokeCircle(0, -5, 20);
    core.lineStyle(3, 0x8b4513, 0.6);
    core.strokeCircle(0, -5, 25);
    container.add(core);
    enemyInstance.coreGraphic = core;

    // --- 5. ENGRENAGES PLUS NOMBREUX ---
    const createGear = (x, y, size = 20) => {
      const gear = scene.add.graphics();
      gear.lineStyle(4, 0x8b4513);
      gear.fillStyle(0x654321);

      const radius = size;
      const teeth = 12;
      gear.beginPath();
      for (let i = 0; i < teeth * 2; i++) {
        const angle = (Math.PI * 2 * i) / (teeth * 2);
        const r = i % 2 === 0 ? radius : radius - 6;
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        if (i === 0) gear.moveTo(px, py);
        else gear.lineTo(px, py);
      }
      gear.closePath();
      gear.fillPath();
      gear.strokePath();

      gear.fillStyle(0x1a1a1a);
      gear.fillCircle(0, 0, 6);

      const gearCont = scene.add.container(x, y);
      gearCont.add(gear);
      container.add(gearCont);
      return gear;
    };

    enemyInstance.gears.push(createGear(-65, -30, 22));
    enemyInstance.gears.push(createGear(65, -30, 22));
    enemyInstance.gears.push(createGear(0, -40, 18)); // Engrenage central

    // --- 6. BRAS MÉCANIQUES RENFORCÉS ---
    const arms = scene.add.graphics();
    arms.fillStyle(0x654321);
    arms.lineStyle(4, 0x8b4513, 0.9);
    
    // Bras gauche
    arms.fillRoundedRect(-75, -18, 35, 50, 6);
    arms.strokeRoundedRect(-75, -18, 35, 50, 6);
    arms.fillStyle(0x1a1a1a);
    arms.fillCircle(-57, 7, 12);
    arms.lineStyle(3, 0x8b4513);
    arms.strokeCircle(-57, 7, 12);
    arms.fillStyle(0x654321);
    arms.fillRoundedRect(-80, 30, 25, 15, 4);
    arms.fillRoundedRect(-70, 30, 25, 15, 4);
    
    // Bras droit
    arms.fillStyle(0x654321);
    arms.fillRoundedRect(40, -18, 35, 50, 6);
    arms.strokeRoundedRect(40, -18, 35, 50, 6);
    arms.fillStyle(0x1a1a1a);
    arms.fillCircle(57, 7, 12);
    arms.lineStyle(3, 0x8b4513);
    arms.strokeCircle(57, 7, 12);
    arms.fillStyle(0x654321);
    arms.fillRoundedRect(45, 30, 25, 15, 4);
    arms.fillRoundedRect(55, 30, 25, 15, 4);
    
    container.add(arms);

    // --- 7. TÊTE ALCHEMIQUE RENFORCÉE ---
    const head = scene.add.graphics();
    head.fillStyle(0x654321);
    head.lineStyle(4, 0x8b4513, 0.9);
    
    head.fillRoundedRect(-22, -70, 44, 40, 6);
    head.strokeRoundedRect(-22, -70, 44, 40, 6);
    
    head.fillStyle(0x1a1a1a);
    head.fillRoundedRect(-20, -65, 40, 10, 3);
    head.lineStyle(3, 0x8b4513);
    head.strokeRoundedRect(-20, -65, 40, 10, 3);
    
    head.fillStyle(0xff4500, 0.9);
    head.fillRect(-14, -63, 28, 6);
    
    head.fillStyle(0x654321);
    head.fillRoundedRect(-5, -75, 10, 10, 3);
    head.strokeRoundedRect(-5, -75, 10, 10, 3);
    
    container.add(head);

    // --- 8. FIOLES ALCHEMIQUES PLUS NOMBREUSES ---
    const vialsGroup = scene.add.container(0, 0);
    const vialColors = [0xff6347, 0x32cd32, 0x4169e1, 0xffd700, 0xff1493, 0x00ffff];
    
    for (let i = 0; i < 6; i++) {
      const vial = scene.add.graphics();
      const vialColor = vialColors[i % vialColors.length];
      
      vial.fillStyle(0x1a1a1a, 0.4);
      vial.fillRoundedRect(-5, -10, 10, 18, 3);
      vial.lineStyle(3, 0x8b4513, 0.9);
      vial.strokeRoundedRect(-5, -10, 10, 18, 3);
      
      vial.fillStyle(vialColor, 0.8);
      vial.fillRoundedRect(-4, 0, 8, 10, 2);
      
      vial.fillStyle(0x654321);
      vial.fillRoundedRect(-4, -12, 8, 4, 2);
      
      vial.x = Math.cos((Math.PI * 2 * i) / 6) * 50;
      vial.y = Math.sin((Math.PI * 2 * i) / 6) * 30 - 5;
      vialsGroup.add(vial);
      enemyInstance.vials.push(vial);
    }
    container.add(vialsGroup);
    enemyInstance.vialsGroup = vialsGroup;

    // --- 9. TUBES ET CONDUITS RENFORCÉS ---
    const tubes = scene.add.graphics();
    tubes.lineStyle(4, 0x8b4513, 0.9);
    
    tubes.beginPath();
    tubes.moveTo(-65, -30);
    tubes.lineTo(-25, -5);
    tubes.moveTo(65, -30);
    tubes.lineTo(25, -5);
    tubes.moveTo(0, -40);
    tubes.lineTo(0, -5);
    tubes.strokePath();
    
    tubes.beginPath();
    tubes.moveTo(-60, -18);
    tubes.lineTo(-75, -12);
    tubes.moveTo(60, -18);
    tubes.lineTo(75, -12);
    tubes.strokePath();
    
    container.add(tubes);

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    if (!enemyInstance.active) return;

    const walk = Math.cos(time * 0.005);
    if (enemyInstance.bodyGroup) {
      enemyInstance.bodyGroup.y = Math.max(0, walk * 8) - 4;
    }

    if (enemyInstance.coreGraphic) {
      const pulse = 1 + Math.sin(time * 0.015) * 0.2;
      enemyInstance.coreGraphic.setScale(pulse);
      enemyInstance.coreGraphic.alpha = 0.8 + Math.sin(time * 0.015) * 0.2;
    }

    if (enemyInstance.gears) {
      enemyInstance.gears.forEach((gear, i) => {
        gear.rotation += (i % 2 === 0 ? -1 : 1) * 0.03;
      });
    }

    if (enemyInstance.vialsGroup) {
      enemyInstance.vialsGroup.rotation += 0.006;
      enemyInstance.vials.forEach((vial, i) => {
        vial.alpha = 0.75 + Math.sin(time * 0.025 + i) * 0.25;
      });
    }

    if (enemyInstance.steamGroup) {
      enemyInstance.steamGroup.rotation += 0.002;
      enemyInstance.steamGroup.setScale(1 + Math.sin(time * 0.005) * 0.08);
      enemyInstance.steamParticles.forEach((steam, i) => {
        steam.y -= 0.4 + Math.sin(time * 0.012 + i) * 0.25;
        steam.alpha = 0.3 + Math.sin(time * 0.018 + i) * 0.2;
      });
    }

    if (enemyInstance.bodyGroup && Math.random() > 0.94) {
      enemyInstance.bodyGroup.x = (Math.random() - 0.5) * 3;
    } else if (enemyInstance.bodyGroup) {
      enemyInstance.bodyGroup.x *= 0.85;
    }
  },

  // Transformation en phase 3 à la mort
  onDeath: (enemy) => {
    // Ne pas vérifier enemy.active car il est false quand il meurt
    if (!enemy.scene || !enemy.path || !enemy.scene.time) return;
    
    const nextPhaseKey = enemy.stats?.nextPhase;
    if (!nextPhaseKey) return;

    // Sauvegarder toutes les références nécessaires AVANT que l'ennemi soit détruit
    const scene = enemy.scene;
    const path = enemy.path;
    const deathX = enemy.x;
    const deathY = enemy.y;
    const deathProgress = enemy.progress;
    const deathWaveIndex = enemy.waveIndex;
    const EnemyClass = enemy.constructor;

    // Jouer l'animation de transformation magnifique
    playBosslvl8Transform2Animation(scene, deathX, deathY);

    // Créer la phase suivante après un court délai pour laisser l'animation se jouer
    scene.time.delayedCall(800, () => {
      if (!scene || !scene.enemies) return;
      
      // Créer la phase suivante
      const nextPhase = new EnemyClass(scene, path, nextPhaseKey);
      
      // Initialiser le spawn d'abord (pour initialiser pathLength, etc.)
      nextPhase.spawn();
      
      // PUIS positionner exactement où le précédent est mort (après spawn pour ne pas être écrasé)
      nextPhase.progress = deathProgress;
      nextPhase.waveIndex = deathWaveIndex;
      nextPhase.x = deathX;
      nextPhase.y = deathY;
      
      // Calculer la tangente pour le mouvement
      if (nextPhase.progress > 0) {
        nextPhase.previousTangent = nextPhase.calculateTangent(nextPhase.progress);
      }
      
      // Ajouter à la scène
      scene.enemies.add(nextPhase);
      
      // Effet d'apparition spectaculaire
      nextPhase.setAlpha(0);
      nextPhase.setScale(0.2);
      scene.tweens.add({
        targets: nextPhase,
        alpha: 1,
        scale: 1,
        duration: 1000,
        ease: 'Back.Out',
      });
    });
  },
};

