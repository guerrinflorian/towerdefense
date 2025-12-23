export const bosslvl5 = {
  name: "OMEGA-TITAN",
  speed: 8, 
  hp: 180000, 
  reward: 0,
  playerDamage: 20,
  color: 0xff4400, 
  damage: 500, 
  attackSpeed: 2000, 
  scale: 1.6, 

  onDraw: (scene, container, color, enemyInstance) => {
    // Initialisation des listes pour l'animation
    enemyInstance.gears = [];
    
    // --- 1. FUMÉE VOLCANIQUE (Arrière-plan) ---
    const smokeGroup = scene.add.container(0, 0);
    for (let i = 0; i < 8; i++) {
      const smoke = scene.add.graphics();
      smoke.fillStyle(0x333333, 0.4);
      smoke.fillCircle(0, 0, 12 + Math.random() * 8);
      smoke.x = (Math.random() - 0.5) * 80;
      smoke.y = (Math.random() - 0.5) * 80;
      smokeGroup.add(smoke);
    }
    container.add(smokeGroup);
    enemyInstance.smokeGroup = smokeGroup;

    // --- 2. JAMBES MÉCANIQUES ---
    const legs = scene.add.graphics();
    legs.fillStyle(0x1a1a1a);
    legs.lineStyle(3, 0xff4400); // Lave entre les plaques
    // Jambe G
    legs.fillRoundedRect(-35, 10, 25, 35, 5);
    legs.strokeRoundedRect(-35, 10, 25, 35, 5);
    // Jambe D
    legs.fillRoundedRect(10, 10, 25, 35, 5);
    legs.strokeRoundedRect(10, 10, 25, 35, 5);
    container.add(legs);

    // --- 3. TORSE (BLINDAGE TRAPÉZOÏDAL) ---
    const torso = scene.add.graphics();
    torso.fillStyle(0x222222);
    torso.lineStyle(2, 0x444444);
    
    const torsoPath = [-50, -25, 50, -25, 40, 25, -40, 25];
    torso.fillPoints(torsoPath.map((v, i) => (i % 2 === 0 ? v : v)), true);
    torso.strokePoints(torsoPath.map((v, i) => (i % 2 === 0 ? v : v)), true);
    container.add(torso);

    // --- 4. CŒUR DE FUSION (PULSE) ---
    const core = scene.add.graphics();
    core.fillStyle(0xffaa00);
    core.fillCircle(0, 0, 15);
    // Halo lumineux
    core.lineStyle(4, 0xff4400, 0.5);
    core.strokeCircle(0, 0, 18);
    container.add(core);
    enemyInstance.coreGraphic = core;

    // --- 5. ENGRENAGES D'ÉPAULES ---
    const createGear = (x, y) => {
      const gear = scene.add.graphics();
      gear.lineStyle(3, 0x444444);
      gear.fillStyle(0x2a2a2a);

      const radius = 22;
      const teeth = 8;
      gear.beginPath();
      for (let i = 0; i < teeth * 2; i++) {
        const angle = (Math.PI * 2 * i) / (teeth * 2);
        const r = i % 2 === 0 ? radius : radius - 7;
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        if (i === 0) gear.moveTo(px, py); else gear.lineTo(px, py);
      }
      gear.closePath();
      gear.fillPath();
      gear.strokePath();

      // Centre du mécanisme
      gear.fillStyle(0x111111);
      gear.fillCircle(0, 0, 6);

      const gearCont = scene.add.container(x, y);
      gearCont.add(gear);
      container.add(gearCont);
      return gear; // On retourne le graphique pour le faire pivoter
    };

    enemyInstance.gears.push(createGear(-55, -25));
    enemyInstance.gears.push(createGear(55, -25));

    // --- 6. TÊTE (COMMANDEMENT) ---
    const head = scene.add.graphics();
    head.fillStyle(0x111111);
    head.fillRoundedRect(-18, -55, 36, 30, 4);
    // Visière lumineuse
    head.fillStyle(0xff0000);
    head.fillRect(-14, -45, 28, 6);
    container.add(head);

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    // Sécurités pour éviter les erreurs si l'ennemi est détruit
    if (!enemyInstance.active || !enemyInstance.coreGraphic) return;

    // 1. MARCHE DU TITAN (Effet de poids massif)
    // On utilise Math.cos pour un impact au sol bien marqué
    const walk = Math.cos(time * 0.005);
    enemyInstance.bodyGroup.y = Math.max(0, walk * 8) - 4; 

    // 2. PULSATION THERMIQUE DU CŒUR
    const heat = 1 + Math.sin(time * 0.01) * 0.15;
    enemyInstance.coreGraphic.setScale(heat);
    enemyInstance.coreGraphic.alpha = 0.7 + Math.sin(time * 0.01) * 0.3;

    // 3. ROTATION DES MÉCANISMES
    if (enemyInstance.gears) {
      enemyInstance.gears[0].rotation -= 0.03; 
      enemyInstance.gears[1].rotation += 0.03; 
    }

    // 4. TURBULENCE DE LA FUMÉE
    if (enemyInstance.smokeGroup) {
      enemyInstance.smokeGroup.rotation += 0.002;
      enemyInstance.smokeGroup.setScale(1 + Math.sin(time * 0.003) * 0.05);
    }
    
    // 5. TREMBLEMENT DE TERRE ALÉATOIRE (Subtile)
    if (Math.random() > 0.98) {
        enemyInstance.bodyGroup.x = (Math.random() - 0.5) * 2;
    } else {
        enemyInstance.bodyGroup.x *= 0.9;
    }
  },
};