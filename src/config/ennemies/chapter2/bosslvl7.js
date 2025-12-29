export const bosslvl7 = {
  name: "GLACEBEAR LE DÉVOREUR",
  speed: 10,
  hp: 140000,
  reward: 0,
  playerDamage: 20,
  color: 0x87ceeb, // Bleu ciel/glace
  damage: 750,
  attackSpeed: 1800,
  scale: 1.4,

  onDraw: (scene, container, color, enemyInstance) => {
    enemyInstance.iceShards = [];
    enemyInstance.frostAura = [];

    // --- 1. AURA DE GEL (Flocons et cristaux) ---
    const frostGroup = scene.add.container(0, 0);
    for (let i = 0; i < 12; i++) {
      const flake = scene.add.graphics();
      flake.fillStyle(0xb0e0e6, 0.4);
      flake.fillCircle(0, 0, 4 + Math.random() * 4);
      flake.x = (Math.random() - 0.5) * 110;
      flake.y = (Math.random() - 0.5) * 110;
      frostGroup.add(flake);
    }
    container.add(frostGroup);
    enemyInstance.frostGroup = frostGroup;

    // --- 2. JAMBES MASSIVES (Ours) ---
    const legs = scene.add.graphics();
    legs.fillStyle(0x4682b4); // Bleu acier
    legs.lineStyle(3, 0x87ceeb, 0.8);
    
    // Jambe gauche (plus large)
    legs.fillRoundedRect(-40, 8, 30, 40, 8);
    legs.strokeRoundedRect(-40, 8, 30, 40, 8);
    
    // Jambe droite
    legs.fillRoundedRect(10, 8, 30, 40, 8);
    legs.strokeRoundedRect(10, 8, 30, 40, 8);
    
    // Griffes de glace
    legs.fillStyle(0xadd8e6);
    for (let i = 0; i < 3; i++) {
      legs.fillTriangle(-35 + i * 8, 48, -30 + i * 8, 55, -25 + i * 8, 48);
      legs.fillTriangle(15 + i * 8, 48, 20 + i * 8, 55, 25 + i * 8, 48);
    }
    container.add(legs);

    // --- 3. CORPS MASSIF (Ours) ---
    const bodyContainer = scene.add.container(0, 0);
    const body = scene.add.graphics();
    body.fillStyle(0x5f9ea0); // Bleu foncé
    body.lineStyle(4, 0x87ceeb, 0.9);
    
    // Corps principal (ovale massif)
    body.fillEllipse(0, -15, 80, 90);
    body.strokeEllipse(0, -15, 80, 90);
    
    // Fourrure de glace (pics)
    body.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = Math.PI + (i * 0.6);
      body.moveTo(Math.cos(angle) * 40, Math.sin(angle) * 45 - 15);
      body.lineTo(Math.cos(angle) * 50, Math.sin(angle) * 50 - 15);
    }
    body.strokePath();
    
    bodyContainer.add(body);
    container.add(bodyContainer);
    enemyInstance.bodyGroup = bodyContainer;

    // --- 4. TÊTE D'OURS ---
    const head = scene.add.graphics();
    head.fillStyle(0x4682b4);
    head.lineStyle(3, 0x87ceeb, 0.9);
    
    // Tête ronde
    head.fillCircle(0, -70, 35);
    head.strokeCircle(0, -70, 35);
    
    // Oreilles
    head.fillEllipse(-28, -85, 12, 18);
    head.fillEllipse(28, -85, 12, 18);
    head.strokeEllipse(-28, -85, 12, 18);
    head.strokeEllipse(28, -85, 12, 18);
    
    // Yeux brillants (glace)
    head.fillStyle(0x00ffff);
    head.fillCircle(-12, -72, 5);
    head.fillCircle(12, -72, 5);
    head.fillStyle(0xffffff);
    head.fillCircle(-10, -73, 2);
    head.fillCircle(14, -73, 2);
    
    // Museau
    head.fillStyle(0x5f9ea0);
    head.fillEllipse(0, -60, 18, 14);
    head.strokeEllipse(0, -60, 18, 14);
    
    // Nez
    head.fillStyle(0x000000);
    head.fillEllipse(0, -58, 6, 5);
    
    // Crocs de glace
    head.fillStyle(0xadd8e6);
    head.fillTriangle(-8, -55, -4, -50, -6, -55);
    head.fillTriangle(8, -55, 4, -50, 6, -55);
    
    container.add(head);

    // --- 5. BRAS ET GRIFFES DE GLACE ---
    const arms = scene.add.graphics();
    arms.fillStyle(0x4682b4);
    arms.lineStyle(3, 0x87ceeb, 0.9);
    
    // Bras gauche
    arms.fillRoundedRect(-55, -20, 25, 50, 6);
    arms.strokeRoundedRect(-55, -20, 25, 50, 6);
    
    // Bras droit
    arms.fillRoundedRect(30, -20, 25, 50, 6);
    arms.strokeRoundedRect(30, -20, 25, 50, 6);
    
    // Griffes de glace (5 par patte)
    arms.fillStyle(0xadd8e6);
    for (let i = 0; i < 5; i++) {
      arms.fillTriangle(-50 + i * 5, 30, -47 + i * 5, 40, -44 + i * 5, 30);
      arms.fillTriangle(35 + i * 5, 30, 38 + i * 5, 40, 41 + i * 5, 30);
    }
    container.add(arms);

    // --- 6. CRISTAUX DE GLACE ORBITAUX ---
    const shardsGroup = scene.add.container(0, 0);
    for (let i = 0; i < 6; i++) {
      const shard = scene.add.graphics();
      shard.fillStyle(0x87ceeb, 0.7);
      shard.lineStyle(2, 0x00ffff, 0.9);
      
      // Forme de cristal (losange)
      shard.beginPath();
      shard.moveTo(0, -8);
      shard.lineTo(6, 0);
      shard.lineTo(0, 8);
      shard.lineTo(-6, 0);
      shard.closePath();
      shard.fillPath();
      shard.strokePath();
      
      shard.x = Math.cos((Math.PI * 2 * i) / 6) * 50;
      shard.y = Math.sin((Math.PI * 2 * i) / 6) * 30 - 15;
      shardsGroup.add(shard);
      enemyInstance.iceShards.push(shard);
    }
    container.add(shardsGroup);
    enemyInstance.shardsGroup = shardsGroup;

    // --- 7. CŒUR DE GLACE (Pulsation) ---
    const core = scene.add.graphics();
    core.fillStyle(0x00ffff, 0.9);
    core.fillCircle(0, -15, 12);
    core.lineStyle(4, 0x87ceeb, 0.6);
    core.strokeCircle(0, -15, 16);
    container.add(core);
    enemyInstance.coreGraphic = core;

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    if (!enemyInstance.active) return;

    // 1) Marche lourde de l'ours
    const walk = Math.cos(time * 0.004);
    enemyInstance.bodyGroup.y = Math.max(0, walk * 6) - 3;

    // 2) Pulsation du cœur de glace
    if (enemyInstance.coreGraphic) {
      const pulse = 1 + Math.sin(time * 0.01) * 0.15;
      enemyInstance.coreGraphic.setScale(pulse);
      enemyInstance.coreGraphic.alpha = 0.8 + Math.sin(time * 0.01) * 0.2;
    }

    // 3) Rotation de l'aura de gel
    if (enemyInstance.frostGroup) {
      enemyInstance.frostGroup.rotation += 0.002;
      enemyInstance.frostGroup.setScale(1 + Math.sin(time * 0.003) * 0.05);
    }

    // 4) Rotation des cristaux de glace
    if (enemyInstance.shardsGroup) {
      enemyInstance.shardsGroup.rotation += 0.006;
      // Scintillement des cristaux
      enemyInstance.iceShards.forEach((shard, i) => {
        shard.alpha = 0.6 + Math.sin(time * 0.015 + i) * 0.4;
      });
    }

    // 5) Tremblement de terre (poids de l'ours)
    if (Math.random() > 0.97) {
      enemyInstance.bodyGroup.x = (Math.random() - 0.5) * 2;
    } else {
      enemyInstance.bodyGroup.x *= 0.9;
    }
  },
};

