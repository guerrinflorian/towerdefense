import { playBosslvl8Transform1Animation } from "./animations/bosslvl8_transform1.js";

export const bosslvl8_1 = {
  name: "FERROX L'ALCHIMISTE MÉCANIQUE - PHASE 1",
  speed: 13,
  hp: 45000, //45000
  reward: 0,
  playerDamage: 20,
  color: 0x708090, // Gris acier
  damage: 400,
  attackSpeed: 1700,
  scale: 1.1,
  
  // Transformation en phase 2 à la mort
  nextPhase: "bosslvl8_2",

  onDraw: (scene, container, color, enemyInstance) => {
    enemyInstance.vials = [];
    enemyInstance.gears = [];
    enemyInstance.steamParticles = [];

    // --- 1. VAPEURS CHIMIQUES (Arrière-plan) ---
    const steamGroup = scene.add.container(0, 0);
    for (let i = 0; i < 10; i++) {
      const steam = scene.add.graphics();
      steam.fillStyle(0x778899, 0.35);
      steam.fillEllipse(0, 0, 15 + Math.random() * 10, 25 + Math.random() * 15);
      steam.x = (Math.random() - 0.5) * 100;
      steam.y = (Math.random() - 0.5) * 100;
      steamGroup.add(steam);
      enemyInstance.steamParticles.push(steam);
    }
    container.add(steamGroup);
    enemyInstance.steamGroup = steamGroup;

    // --- 2. JAMBES MÉCANIQUES EN FER ---
    const legs = scene.add.graphics();
    legs.fillStyle(0x2f4f4f); // Gris foncé
    legs.lineStyle(3, 0x708090, 0.9);
    
    // Jambe gauche (articulée)
    legs.fillRoundedRect(-35, 12, 28, 38, 4);
    legs.strokeRoundedRect(-35, 12, 28, 38, 4);
    
    // Articulation
    legs.fillStyle(0x1a1a1a);
    legs.fillCircle(-21, 25, 8);
    legs.lineStyle(2, 0x708090);
    legs.strokeCircle(-21, 25, 8);
    
    // Jambe droite
    legs.fillStyle(0x2f4f4f);
    legs.fillRoundedRect(7, 12, 28, 38, 4);
    legs.strokeRoundedRect(7, 12, 28, 38, 4);
    
    // Articulation
    legs.fillStyle(0x1a1a1a);
    legs.fillCircle(21, 25, 8);
    legs.lineStyle(2, 0x708090);
    legs.strokeCircle(21, 25, 8);
    
    // Pieds mécaniques
    legs.fillStyle(0x1a1a1a);
    legs.fillRoundedRect(-40, 48, 38, 8, 2);
    legs.fillRoundedRect(5, 48, 38, 8, 2);
    container.add(legs);

    // --- 3. TORSE EN FER (Blindage) ---
    const bodyContainer = scene.add.container(0, 0);
    const torso = scene.add.graphics();
    torso.fillStyle(0x36454f);
    torso.lineStyle(4, 0x708090, 0.9);
    
    // Torse trapézoïdal
    const torsoPath = [
      -55, -30,
      55, -30,
      48, 20,
      -48, 20
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
    
    // Plaques de blindage
    torso.lineStyle(2, 0x556b2f, 0.7);
    torso.strokeRect(-50, -25, 100, 45);
    torso.strokeRect(-45, -20, 90, 35);
    
    bodyContainer.add(torso);
    container.add(bodyContainer);
    enemyInstance.bodyGroup = bodyContainer;

    // --- 4. CŒUR ALCHEMIQUE (Pulsation) ---
    const core = scene.add.graphics();
    core.fillStyle(0x8b4513, 0.9); // Brun (potion)
    core.fillCircle(0, -5, 14);
    core.lineStyle(4, 0xff6347, 0.6); // Rouge (chaleur)
    core.strokeCircle(0, -5, 18);
    core.lineStyle(2, 0x708090, 0.5);
    core.strokeCircle(0, -5, 22);
    container.add(core);
    enemyInstance.coreGraphic = core;

    // --- 5. ENGRENAGES D'ÉPAULES ---
    const createGear = (x, y) => {
      const gear = scene.add.graphics();
      gear.lineStyle(3, 0x556b2f);
      gear.fillStyle(0x2f4f4f);

      const radius = 20;
      const teeth = 10;
      gear.beginPath();
      for (let i = 0; i < teeth * 2; i++) {
        const angle = (Math.PI * 2 * i) / (teeth * 2);
        const r = i % 2 === 0 ? radius : radius - 5;
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        if (i === 0) gear.moveTo(px, py);
        else gear.lineTo(px, py);
      }
      gear.closePath();
      gear.fillPath();
      gear.strokePath();

      // Centre
      gear.fillStyle(0x1a1a1a);
      gear.fillCircle(0, 0, 5);

      const gearCont = scene.add.container(x, y);
      gearCont.add(gear);
      container.add(gearCont);
      return gear;
    };

    enemyInstance.gears.push(createGear(-60, -25));
    enemyInstance.gears.push(createGear(60, -25));

    // --- 6. BRAS MÉCANIQUES ARTICULÉS ---
    const arms = scene.add.graphics();
    arms.fillStyle(0x36454f);
    arms.lineStyle(3, 0x708090, 0.9);
    
    // Bras gauche (articulé)
    arms.fillRoundedRect(-70, -15, 30, 45, 5);
    arms.strokeRoundedRect(-70, -15, 30, 45, 5);
    
    // Articulation
    arms.fillStyle(0x1a1a1a);
    arms.fillCircle(-55, 5, 10);
    arms.lineStyle(2, 0x708090);
    arms.strokeCircle(-55, 5, 10);
    
    // Main mécanique (pince)
    arms.fillStyle(0x2f4f4f);
    arms.fillRoundedRect(-75, 28, 20, 12, 3);
    arms.fillRoundedRect(-65, 28, 20, 12, 3);
    
    // Bras droit
    arms.fillStyle(0x36454f);
    arms.fillRoundedRect(40, -15, 30, 45, 5);
    arms.strokeRoundedRect(40, -15, 30, 45, 5);
    
    // Articulation
    arms.fillStyle(0x1a1a1a);
    arms.fillCircle(55, 5, 10);
    arms.lineStyle(2, 0x708090);
    arms.strokeCircle(55, 5, 10);
    
    // Main mécanique (pince)
    arms.fillStyle(0x2f4f4f);
    arms.fillRoundedRect(45, 28, 20, 12, 3);
    arms.fillRoundedRect(55, 28, 20, 12, 3);
    
    container.add(arms);

    // --- 7. TÊTE ALCHEMIQUE (Casque avec visière) ---
    const head = scene.add.graphics();
    head.fillStyle(0x2f4f4f);
    head.lineStyle(3, 0x708090, 0.9);
    
    // Casque
    head.fillRoundedRect(-20, -65, 40, 35, 5);
    head.strokeRoundedRect(-20, -65, 40, 35, 5);
    
    // Visière (avec fente)
    head.fillStyle(0x1a1a1a);
    head.fillRoundedRect(-18, -60, 36, 8, 2);
    head.lineStyle(2, 0x708090);
    head.strokeRoundedRect(-18, -60, 36, 8, 2);
    
    // Fente de visière (yeux)
    head.fillStyle(0xff6347, 0.8); // Rouge (yeux)
    head.fillRect(-12, -58, 24, 4);
    
    // Tube respiratoire
    head.fillStyle(0x36454f);
    head.fillRoundedRect(-4, -70, 8, 8, 2);
    head.strokeRoundedRect(-4, -70, 8, 8, 2);
    
    container.add(head);

    // --- 8. FIOLES ALCHEMIQUES (Orbitantes) ---
    const vialsGroup = scene.add.container(0, 0);
    const vialColors = [0xff6347, 0x32cd32, 0x4169e1, 0xffd700]; // Rouge, Vert, Bleu, Or
    
    for (let i = 0; i < 4; i++) {
      const vial = scene.add.graphics();
      const vialColor = vialColors[i];
      
      // Fiole (forme de bouteille)
      vial.fillStyle(0x1a1a1a, 0.3);
      vial.fillRoundedRect(-4, -8, 8, 16, 2);
      vial.lineStyle(2, 0x708090, 0.9);
      vial.strokeRoundedRect(-4, -8, 8, 16, 2);
      
      // Liquide coloré
      vial.fillStyle(vialColor, 0.7);
      vial.fillRoundedRect(-3, 0, 6, 8, 1);
      
      // Bouchon
      vial.fillStyle(0x2f4f4f);
      vial.fillRoundedRect(-3, -10, 6, 3, 1);
      
      vial.x = Math.cos((Math.PI * 2 * i) / 4) * 45;
      vial.y = Math.sin((Math.PI * 2 * i) / 4) * 25 - 5;
      vialsGroup.add(vial);
      enemyInstance.vials.push(vial);
    }
    container.add(vialsGroup);
    enemyInstance.vialsGroup = vialsGroup;

    // --- 9. TUBES ET CONDUITS ---
    const tubes = scene.add.graphics();
    tubes.lineStyle(3, 0x556b2f, 0.8);
    
    // Tubes reliant les engrenages au cœur
    tubes.beginPath();
    tubes.moveTo(-60, -25);
    tubes.lineTo(-20, -5);
    tubes.moveTo(60, -25);
    tubes.lineTo(20, -5);
    tubes.strokePath();
    
    // Tubes vers les bras
    tubes.beginPath();
    tubes.moveTo(-55, -15);
    tubes.lineTo(-70, -10);
    tubes.moveTo(55, -15);
    tubes.lineTo(70, -10);
    tubes.strokePath();
    
    container.add(tubes);

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    if (!enemyInstance.active) return;

    // 1) Marche mécanique lourde
    const walk = Math.cos(time * 0.0045);
    if (enemyInstance.bodyGroup) {
      enemyInstance.bodyGroup.y = Math.max(0, walk * 7) - 3.5;
    }

    // 2) Pulsation du cœur alchimique
    if (enemyInstance.coreGraphic) {
      const pulse = 1 + Math.sin(time * 0.012) * 0.18;
      enemyInstance.coreGraphic.setScale(pulse);
      enemyInstance.coreGraphic.alpha = 0.75 + Math.sin(time * 0.012) * 0.25;
    }

    // 3) Rotation des engrenages
    if (enemyInstance.gears) {
      enemyInstance.gears[0].rotation -= 0.025;
      enemyInstance.gears[1].rotation += 0.025;
    }

    // 4) Rotation des fioles alchimiques
    if (enemyInstance.vialsGroup) {
      enemyInstance.vialsGroup.rotation += 0.005;
      // Scintillement des liquides
      enemyInstance.vials.forEach((vial, i) => {
        vial.alpha = 0.7 + Math.sin(time * 0.02 + i) * 0.3;
      });
    }

    // 5) Vapeurs chimiques (mouvement)
    if (enemyInstance.steamGroup) {
      enemyInstance.steamGroup.rotation += 0.0015;
      enemyInstance.steamGroup.setScale(1 + Math.sin(time * 0.004) * 0.06);
      // Animation des particules de vapeur
      enemyInstance.steamParticles.forEach((steam, i) => {
        steam.y -= 0.3 + Math.sin(time * 0.01 + i) * 0.2;
        steam.alpha = 0.25 + Math.sin(time * 0.015 + i) * 0.15;
      });
    }

    // 6) Tremblement mécanique
    if (enemyInstance.bodyGroup && Math.random() > 0.96) {
      enemyInstance.bodyGroup.x = (Math.random() - 0.5) * 2.5;
    } else if (enemyInstance.bodyGroup) {
      enemyInstance.bodyGroup.x *= 0.88;
    }
  },

  // Transformation en phase 2 à la mort
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
    playBosslvl8Transform1Animation(scene, deathX, deathY);

    // Créer la phase suivante après un court délai pour laisser l'animation se jouer
    scene.time.delayedCall(600, () => {
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
      nextPhase.setScale(0.3);
      scene.tweens.add({
        targets: nextPhase,
        alpha: 1,
        scale: 1,
        duration: 800,
        ease: 'Back.Out',
      });
    });
  },
};

