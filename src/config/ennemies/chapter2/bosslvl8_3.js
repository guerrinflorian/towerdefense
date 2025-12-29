export const bosslvl8_3 = {
  name: "FERROX L'ALCHIMISTE MÉCANIQUE - PHASE 3",
  speed: 10,
  hp: 150000, //140000
  reward: 0,
  playerDamage: 20,
  color: 0xff4500, // Orange/rouge intense (forme finale)
  damage: 1050,
  attackSpeed: 1500,
  scale: 1.30,
  
  // Phase finale, pas de transformation

  onDraw: (scene, container, color, enemyInstance) => {
    // Phase 3 : Design ultime (vous pourrez l'améliorer)
    enemyInstance.vials = [];
    enemyInstance.gears = [];
    enemyInstance.steamParticles = [];

    // --- 1. VAPEURS CHIMIQUES EXPLOSIVES ---
    const steamGroup = scene.add.container(0, 0);
    for (let i = 0; i < 20; i++) {
      const steam = scene.add.graphics();
      steam.fillStyle(0xff4500, 0.5);
      steam.fillEllipse(0, 0, 20 + Math.random() * 15, 35 + Math.random() * 20);
      steam.x = (Math.random() - 0.5) * 140;
      steam.y = (Math.random() - 0.5) * 140;
      steamGroup.add(steam);
      enemyInstance.steamParticles.push(steam);
    }
    container.add(steamGroup);
    enemyInstance.steamGroup = steamGroup;

    // --- 2. JAMBES MÉCANIQUES ULTIMES ---
    const legs = scene.add.graphics();
    legs.fillStyle(0x8b0000); // Rouge foncé
    legs.lineStyle(5, 0xff4500, 1);
    
    legs.fillRoundedRect(-45, 8, 36, 46, 6);
    legs.strokeRoundedRect(-45, 8, 36, 46, 6);
    legs.fillRoundedRect(9, 8, 36, 46, 6);
    legs.strokeRoundedRect(9, 8, 36, 46, 6);
    
    legs.fillStyle(0x1a1a1a);
    legs.fillCircle(-27, 31, 12);
    legs.fillCircle(27, 31, 12);
    legs.lineStyle(4, 0xff4500);
    legs.strokeCircle(-27, 31, 12);
    legs.strokeCircle(27, 31, 12);
    
    legs.fillStyle(0x1a1a1a);
    legs.fillRoundedRect(-50, 52, 46, 12, 4);
    legs.fillRoundedRect(4, 52, 46, 12, 4);
    container.add(legs);

    // --- 3. TORSE BLINDÉ ULTIME ---
    const bodyContainer = scene.add.container(0, 0);
    const torso = scene.add.graphics();
    torso.fillStyle(0x8b0000);
    torso.lineStyle(6, 0xff4500, 1);
    
    const torsoPath = [
      -65, -40,
      65, -40,
      56, 30,
      -56, 30
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
    
    torso.lineStyle(4, 0xff6347, 0.9);
    torso.strokeRect(-60, -35, 120, 60);
    torso.strokeRect(-55, -30, 110, 50);
    
    bodyContainer.add(torso);
    container.add(bodyContainer);
    enemyInstance.bodyGroup = bodyContainer;

    // --- 4. CŒUR ALCHEMIQUE EXPLOSIF ---
    const core = scene.add.graphics();
    core.fillStyle(0xff0000, 1);
    core.fillCircle(0, -5, 18);
    core.lineStyle(6, 0xff4500, 0.8);
    core.strokeCircle(0, -5, 23);
    core.lineStyle(4, 0xff6347, 0.7);
    core.strokeCircle(0, -5, 28);
    container.add(core);
    enemyInstance.coreGraphic = core;

    // --- 5. ENGRENAGES MULTIPLES ---
    const createGear = (x, y, size = 25) => {
      const gear = scene.add.graphics();
      gear.lineStyle(5, 0xff4500);
      gear.fillStyle(0x8b0000);

      const radius = size;
      const teeth = 14;
      gear.beginPath();
      for (let i = 0; i < teeth * 2; i++) {
        const angle = (Math.PI * 2 * i) / (teeth * 2);
        const r = i % 2 === 0 ? radius : radius - 7;
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        if (i === 0) gear.moveTo(px, py);
        else gear.lineTo(px, py);
      }
      gear.closePath();
      gear.fillPath();
      gear.strokePath();

      gear.fillStyle(0x1a1a1a);
      gear.fillCircle(0, 0, 7);

      const gearCont = scene.add.container(x, y);
      gearCont.add(gear);
      container.add(gearCont);
      return gear;
    };

    enemyInstance.gears.push(createGear(-70, -35, 25));
    enemyInstance.gears.push(createGear(70, -35, 25));
    enemyInstance.gears.push(createGear(0, -45, 20));
    enemyInstance.gears.push(createGear(-35, -25, 18));
    enemyInstance.gears.push(createGear(35, -25, 18));

    // --- 6. BRAS MÉCANIQUES ULTIMES ---
    const arms = scene.add.graphics();
    arms.fillStyle(0x8b0000);
    arms.lineStyle(5, 0xff4500, 1);
    
    arms.fillRoundedRect(-80, -20, 40, 55, 7);
    arms.strokeRoundedRect(-80, -20, 40, 55, 7);
    arms.fillStyle(0x1a1a1a);
    arms.fillCircle(-60, 8, 14);
    arms.lineStyle(4, 0xff4500);
    arms.strokeCircle(-60, 8, 14);
    arms.fillStyle(0x8b0000);
    arms.fillRoundedRect(-85, 33, 30, 18, 5);
    arms.fillRoundedRect(-75, 33, 30, 18, 5);
    
    arms.fillStyle(0x8b0000);
    arms.fillRoundedRect(40, -20, 40, 55, 7);
    arms.strokeRoundedRect(40, -20, 40, 55, 7);
    arms.fillStyle(0x1a1a1a);
    arms.fillCircle(60, 8, 14);
    arms.lineStyle(4, 0xff4500);
    arms.strokeCircle(60, 8, 14);
    arms.fillStyle(0x8b0000);
    arms.fillRoundedRect(45, 33, 30, 18, 5);
    arms.fillRoundedRect(55, 33, 30, 18, 5);
    
    container.add(arms);

    // --- 7. TÊTE ALCHEMIQUE ULTIME ---
    const head = scene.add.graphics();
    head.fillStyle(0x8b0000);
    head.lineStyle(5, 0xff4500, 1);
    
    head.fillRoundedRect(-25, -75, 50, 45, 7);
    head.strokeRoundedRect(-25, -75, 50, 45, 7);
    
    head.fillStyle(0x1a1a1a);
    head.fillRoundedRect(-22, -70, 44, 12, 4);
    head.lineStyle(4, 0xff4500);
    head.strokeRoundedRect(-22, -70, 44, 12, 4);
    
    head.fillStyle(0xff0000, 1);
    head.fillRect(-16, -68, 32, 8);
    
    head.fillStyle(0x8b0000);
    head.fillRoundedRect(-6, -80, 12, 12, 4);
    head.strokeRoundedRect(-6, -80, 12, 12, 4);
    
    container.add(head);

    // --- 8. FIOLES ALCHEMIQUES MAXIMISÉES ---
    const vialsGroup = scene.add.container(0, 0);
    const vialColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xff6347, 0x32cd32];
    
    for (let i = 0; i < 8; i++) {
      const vial = scene.add.graphics();
      const vialColor = vialColors[i % vialColors.length];
      
      vial.fillStyle(0x1a1a1a, 0.5);
      vial.fillRoundedRect(-6, -12, 12, 20, 4);
      vial.lineStyle(4, 0xff4500, 1);
      vial.strokeRoundedRect(-6, -12, 12, 20, 4);
      
      vial.fillStyle(vialColor, 0.9);
      vial.fillRoundedRect(-5, 0, 10, 12, 3);
      
      vial.fillStyle(0x8b0000);
      vial.fillRoundedRect(-5, -14, 10, 5, 3);
      
      vial.x = Math.cos((Math.PI * 2 * i) / 8) * 55;
      vial.y = Math.sin((Math.PI * 2 * i) / 8) * 35 - 5;
      vialsGroup.add(vial);
      enemyInstance.vials.push(vial);
    }
    container.add(vialsGroup);
    enemyInstance.vialsGroup = vialsGroup;

    // --- 9. TUBES ET CONDUITS ULTIMES ---
    const tubes = scene.add.graphics();
    tubes.lineStyle(5, 0xff4500, 1);
    
    tubes.beginPath();
    tubes.moveTo(-70, -35);
    tubes.lineTo(-30, -5);
    tubes.moveTo(70, -35);
    tubes.lineTo(30, -5);
    tubes.moveTo(0, -45);
    tubes.lineTo(0, -5);
    tubes.moveTo(-35, -25);
    tubes.lineTo(-20, -5);
    tubes.moveTo(35, -25);
    tubes.lineTo(20, -5);
    tubes.strokePath();
    
    tubes.beginPath();
    tubes.moveTo(-65, -20);
    tubes.lineTo(-80, -15);
    tubes.moveTo(65, -20);
    tubes.lineTo(80, -15);
    tubes.strokePath();
    
    container.add(tubes);

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    if (!enemyInstance.active) return;

    const walk = Math.cos(time * 0.006);
    if (enemyInstance.bodyGroup) {
      enemyInstance.bodyGroup.y = Math.max(0, walk * 10) - 5;
    }

    if (enemyInstance.coreGraphic) {
      const pulse = 1 + Math.sin(time * 0.018) * 0.25;
      enemyInstance.coreGraphic.setScale(pulse);
      enemyInstance.coreGraphic.alpha = 0.85 + Math.sin(time * 0.018) * 0.15;
    }

    if (enemyInstance.gears) {
      enemyInstance.gears.forEach((gear, i) => {
        gear.rotation += (i % 2 === 0 ? -1 : 1) * 0.035;
      });
    }

    if (enemyInstance.vialsGroup) {
      enemyInstance.vialsGroup.rotation += 0.008;
      enemyInstance.vials.forEach((vial, i) => {
        vial.alpha = 0.8 + Math.sin(time * 0.03 + i) * 0.2;
      });
    }

    if (enemyInstance.steamGroup) {
      enemyInstance.steamGroup.rotation += 0.003;
      enemyInstance.steamGroup.setScale(1 + Math.sin(time * 0.006) * 0.1);
      enemyInstance.steamParticles.forEach((steam, i) => {
        steam.y -= 0.5 + Math.sin(time * 0.015 + i) * 0.3;
        steam.alpha = 0.4 + Math.sin(time * 0.02 + i) * 0.3;
      });
    }

    if (enemyInstance.bodyGroup && Math.random() > 0.92) {
      enemyInstance.bodyGroup.x = (Math.random() - 0.5) * 4;
    } else if (enemyInstance.bodyGroup) {
      enemyInstance.bodyGroup.x *= 0.82;
    }
  },
};

