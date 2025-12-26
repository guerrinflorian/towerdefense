export const bosslvl6 = {
    name: "LA REINE DE VÉLORIA",
    speed: 10,
    hp: 210000,
    reward: 0,
    playerDamage: 20,
    color: 0xff6fb7, // rose
    damage: 720,
    attackSpeed: 1900,
    scale: 1.35,
  
    onDraw: (scene, container, color, enemyInstance) => {
      enemyInstance.petals = [];
      enemyInstance.crownGems = [];
  
      // --- 1. AURA ROSELUME (arrière-plan) ---
      const auraGroup = scene.add.container(0, 0);
      for (let i = 0; i < 10; i++) {
        const puff = scene.add.graphics();
        puff.fillStyle(0xffb6d9, 0.22);
        puff.fillCircle(0, 0, 10 + Math.random() * 10);
        puff.x = (Math.random() - 0.5) * 90;
        puff.y = (Math.random() - 0.5) * 90;
        auraGroup.add(puff);
      }
      container.add(auraGroup);
      enemyInstance.auraGroup = auraGroup;
  
      // --- 2. ROBE / CORPS (silhouette reine) ---
      const dress = scene.add.graphics();
      // Base robe
      dress.fillStyle(0xff5fae, 0.95);
      dress.lineStyle(2, 0xffd1ea, 0.8);
  
      // Robe en "goutte" (simple et lisible)
      const dressPath = [
        0, 40,   // bas
        -42, 10,
        -28, -28,
        0, -45,  // haut
        28, -28,
        42, 10,
      ];
      dress.fillPoints(
        [
          { x: dressPath[0], y: dressPath[1] },
          { x: dressPath[2], y: dressPath[3] },
          { x: dressPath[4], y: dressPath[5] },
          { x: dressPath[6], y: dressPath[7] },
          { x: dressPath[8], y: dressPath[9] },
          { x: dressPath[10], y: dressPath[11] },
          { x: dressPath[12], y: dressPath[13] },
        ],
        true
      );
      dress.strokePoints(
        [
          { x: dressPath[0], y: dressPath[1] },
          { x: dressPath[2], y: dressPath[3] },
          { x: dressPath[4], y: dressPath[5] },
          { x: dressPath[6], y: dressPath[7] },
          { x: dressPath[8], y: dressPath[9] },
          { x: dressPath[10], y: dressPath[11] },
          { x: dressPath[12], y: dressPath[13] },
        ],
        true
      );
      container.add(dress);
  
      // --- 3. VISAGE (simple) ---
      const face = scene.add.graphics();
      face.fillStyle(0xffd6ef, 1);
      face.fillRoundedRect(-14, -62, 28, 20, 8);
  
      // yeux
      face.fillStyle(0x3a1f2a, 0.9);
      face.fillCircle(-6, -52, 2.4);
      face.fillCircle(6, -52, 2.4);
  
      // bouche
      face.lineStyle(2, 0x3a1f2a, 0.7);
      face.beginPath();
      face.moveTo(-4, -45);
      face.lineTo(4, -45);
      face.strokePath();
  
      container.add(face);
  
      // --- 4. CŒUR / NOYAU (pulsation) ---
      const core = scene.add.graphics();
      core.fillStyle(0xfff0fa, 0.95);
      core.fillCircle(0, -8, 12);
      core.lineStyle(4, 0xff6fb7, 0.35);
      core.strokeCircle(0, -8, 15);
      container.add(core);
      enemyInstance.coreGraphic = core;
  
      // --- 5. COURONNE (rose + gemmes) ---
      const crown = scene.add.graphics();
      crown.fillStyle(0xff86c5, 1);
      crown.lineStyle(2, 0xffd1ea, 0.9);
  
      // base couronne
      crown.fillRoundedRect(-20, -78, 40, 10, 4);
  
      // pics (3 pointes)
      crown.beginPath();
      crown.moveTo(-18, -68);
      crown.lineTo(-10, -88);
      crown.lineTo(-2, -68);
      crown.lineTo(0, -68);
      crown.lineTo(0, -92);
      crown.lineTo(2, -68);
      crown.lineTo(10, -88);
      crown.lineTo(18, -68);
      crown.closePath();
      crown.fillPath();
      crown.strokePath();
  
      container.add(crown);
      enemyInstance.crownGraphic = crown;
  
      // gemmes (3 petites)
      const makeGem = (x, y) => {
        const g = scene.add.graphics();
        g.fillStyle(0xffffff, 0.9);
        g.fillCircle(x, y, 3.2);
        g.lineStyle(2, 0xff6fb7, 0.6);
        g.strokeCircle(x, y, 4.8);
        container.add(g);
        return g;
      };
      enemyInstance.crownGems.push(makeGem(-12, -78));
      enemyInstance.crownGems.push(makeGem(0, -82));
      enemyInstance.crownGems.push(makeGem(12, -78));
  
      // --- 6. PETITS PÉTALES ORBITAUX (léger, pas chargé) ---
      const petalsGroup = scene.add.container(0, 0);
      for (let i = 0; i < 6; i++) {
        const p = scene.add.graphics();
        p.fillStyle(0xffb6d9, 0.55);
        p.fillEllipse(0, 0, 10, 6);
        p.x = Math.cos((Math.PI * 2 * i) / 6) * 36;
        p.y = Math.sin((Math.PI * 2 * i) / 6) * 18 - 8;
        petalsGroup.add(p);
        enemyInstance.petals.push(p);
      }
      container.add(petalsGroup);
      enemyInstance.petalsGroup = petalsGroup;
  
      enemyInstance.shouldRotate = false;
    },
  
    onUpdateAnimation: (time, enemyInstance) => {
      if (!enemyInstance.active) return;
  
      // 1) Flottement royal (léger)
      const floatY = Math.sin(time * 0.006) * 5;
      enemyInstance.bodyGroup.y = floatY;
  
      // 2) Pulsation du noyau
      if (enemyInstance.coreGraphic) {
        const pulse = 1 + Math.sin(time * 0.012) * 0.12;
        enemyInstance.coreGraphic.setScale(pulse);
        enemyInstance.coreGraphic.alpha = 0.75 + Math.sin(time * 0.012) * 0.25;
      }
  
      // 3) Aura douce en rotation
      if (enemyInstance.auraGroup) {
        enemyInstance.auraGroup.rotation += 0.0018;
        enemyInstance.auraGroup.setScale(1 + Math.sin(time * 0.003) * 0.04);
      }
  
      // 4) Pétales orbitaux (simple)
      if (enemyInstance.petalsGroup) {
        enemyInstance.petalsGroup.rotation += 0.008;
      }
  
      // 5) Scintillement des gemmes
      if (enemyInstance.crownGems && enemyInstance.crownGems.length) {
        const a = 0.75 + Math.sin(time * 0.02) * 0.25;
        enemyInstance.crownGems[0].alpha = a;
        enemyInstance.crownGems[1].alpha = 0.75 + Math.sin(time * 0.02 + 1) * 0.25;
        enemyInstance.crownGems[2].alpha = 0.75 + Math.sin(time * 0.02 + 2) * 0.25;
      }
  
      // 6) Micro mouvement latéral (subtil) pour éviter rigidité
      enemyInstance.bodyGroup.x = Math.sin(time * 0.004) * 1.5;
    },
  };
  