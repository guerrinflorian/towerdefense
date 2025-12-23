export const bosslvl2 = {
    name: "AZAL'KOR SOUVERAIN DES SABLES",
    speed: 9,
    hp: 83000,
    reward: 0,
    playerDamage: 30,
    color: 0xead2a8, // Couleur sable clair de base
    damage: 250,
    attackSpeed: 1500,
    scale: 0.83, // Réduit de 1.8x (1.5 / 1.8 ≈ 0.83)
  
    onDraw: (scene, container, color, enemyInstance) => {
      // Initialisation des références pour l'animation
      enemyInstance.vortexLayers = [];
      enemyInstance.sandParticles = [];
      enemyInstance.arms = [];
  
      // --- 1. LA BASE : VORTEX TOURNANT MULTICOUCHE ---
      const vortexContainer = scene.add.container(0, 28);
      // On crée 3 couches d'ellipses qui tourneront à des vitesses différentes
      for (let i = 0; i < 3; i++) {
          const layer = scene.add.graphics();
          // Dégradé d'opacité : le centre est plus opaque
          const alpha = 0.8 - (i * 0.2);
          const scale = 1 - (i * 0.15);
          layer.fillStyle(0xc2b280, alpha); // Sable plus foncé
          // Des ellipses aplaties pour l'effet tourbillon au sol
          layer.fillEllipse(0, 0, 44 * scale, 17 * scale);
          // On stocke une vitesse de rotation aléatoire pour chaque couche
          layer.rotSpeed = (i % 2 === 0 ? 1 : -1) * (0.02 + Math.random() * 0.03);
          vortexContainer.add(layer);
          enemyInstance.vortexLayers.push(layer);
      }
      container.add(vortexContainer);
  
      // --- 2. LE CORPS : SILHOUETTE DE DJINN ---
      const body = scene.add.graphics();
      // Torse principal (forme conique inversée)
      body.fillStyle(0xe1c699); // Sable doré
      body.beginPath();
      body.moveTo(-28, -33); // Épaule G
      body.lineTo(28, -33);  // Épaule D
      // Approximation de la courbe vers le bas D avec des lignes
      body.lineTo(22, -11);
      body.lineTo(14, 6);
      body.lineTo(6, 28);
      body.lineTo(-6, 28); // Base étroite
      // Approximation de la courbe vers le haut G avec des lignes
      body.lineTo(-14, 6);
      body.lineTo(-22, -11);
      body.lineTo(-28, -33);
      body.closePath();
      body.fillPath();

      // Plaques d'armure en sable compacté (plus foncé)
      body.fillStyle(0xa98c66);
      // Plaque pectorale
      body.beginPath();
      body.moveTo(-22, -28); body.lineTo(22, -28); body.lineTo(0, 6);
      body.closePath(); body.fillPath();
      container.add(body);
  
      // --- 3. LE CŒUR RUNIQUE (Le point focal "beau") ---
      const rune = scene.add.graphics();
      // Lumière Cyan mystique (contraste magnifique avec le sable orange/jaune)
      rune.lineStyle(2, 0x00ffff, 0.8); 
      rune.fillStyle(0x00ffff, 0.3);
      
      // Symbole ancien (Losange avec cercle)
      rune.beginPath();
      rune.moveTo(0, -14); rune.lineTo(11, 0); rune.lineTo(0, 22); rune.lineTo(-11, 0);
      rune.closePath();
      rune.fillPath(); rune.strokePath();
      
      // Noyau central brillant
      rune.fillStyle(0xffffff, 1);
      rune.fillCircle(0, 3, 4);
      rune.y = -11; // Position sur le torse
      container.add(rune);
      enemyInstance.runeGraphic = rune;
  
      // --- 4. LES BRAS MASSIFS (Courants de sable) ---
      const createArm = (side) => {
          const armCont = scene.add.container(side * 31, -28);
          const armGfx = scene.add.graphics();
          
          // Épaule (Sphère de sable tourbillonnant)
          armGfx.fillStyle(0xd4b483);
          armGfx.fillCircle(0, 0, 16);
          // Lignes de flux sur l'épaule
          armGfx.lineStyle(2, 0xffd700, 0.5); // Or
          armGfx.strokeCircle(0,0, 11);

          // Avant-bras / Griffe massive
          armGfx.fillStyle(0xa98c66); // Sable foncé
          armGfx.beginPath();
          armGfx.moveTo(-8 * side, 6);
          armGfx.lineTo(8 * side, 6);
          // Forme de griffe lourde
          armGfx.lineTo(19 * side, 39);
          armGfx.lineTo(6 * side, 47);
          armGfx.lineTo(-6 * side, 47);
          armGfx.lineTo(-19 * side, 39);
          armGfx.closePath();
          armGfx.fillPath();

          armCont.add(armGfx);
          // Stockage de la position de base pour l'animation de lévitation
          armCont.baseY = -28;
          return armCont;
      };
  
      const leftArm = createArm(-1);
      const rightArm = createArm(1);
      container.add(leftArm);
      container.add(rightArm);
      enemyInstance.arms.push(leftArm, rightArm);
  
      // --- 5. TÊTE / COURONNE ---
      const head = scene.add.graphics();
      head.fillStyle(0xe1c699);
      // Forme de tête stylisée sans visage, juste une présence
      head.beginPath();
      head.moveTo(-11, -33);
      head.lineTo(11, -33);
      head.lineTo(6, -22);
      head.lineTo(-6, -22);
      head.closePath();
      head.fillPath();
      // Couronne de lumière
      head.fillStyle(0xffd700); // Or
      head.fillTriangle(-8, -36, 0, -47, 8, -36);
      container.add(head);
      enemyInstance.headGraphic = head;
  
      // --- 6. SYSTÈME DE PARTICULES (Sable qui tombe) ---
      // On crée des petits carrés qui vont tomber des bras
      for(let i=0; i<20; i++) {
          const p = scene.add.rectangle(0, 0, 2, 2, 0xedc9af);
          p.setAlpha(Math.random() * 0.6 + 0.2);
          // Position initiale aléatoire près des bras
          p.x = (Math.random() > 0.5 ? 31 : -31) + (Math.random()*17 - 8);
          p.y = (Math.random() * 56) - 28;
          p.speedY = 1 + Math.random() * 2;
          container.add(p);
          enemyInstance.sandParticles.push(p);
      }
  
      enemyInstance.shouldRotate = false;
    },
  
    onUpdateAnimation: (time, enemyInstance) => {
      // 1. ANIMATION DU VORTEX (Base tournante)
      if (enemyInstance.vortexLayers) {
          enemyInstance.vortexLayers.forEach(layer => {
              layer.rotation += layer.rotSpeed;
          });
      }
  
      // 2. RESPIRATION MAJESTUEUSE (Lévitation lente)
      const hover = Math.sin(time * 0.002) * 5;
      // Le corps entier monte et descend doucement
      enemyInstance.bodyGroup.y = hover;
  
      // 3. MOUVEMENT DES BRAS (Indépendant du corps)
      if (enemyInstance.arms) {
          enemyInstance.arms.forEach((arm, index) => {
              // Léger balancement des bras en sens opposé
              const swing = Math.sin(time * 0.003 + index) * 0.05;
              arm.rotation = swing;
              // Les bras flottent aussi verticalement avec un décalage
              arm.y = arm.baseY + Math.sin(time * 0.0025 + index) * 3;
          });
      }
  
      // 4. PULSATION DE LA RUNE (Cœur magique)
      if (enemyInstance.runeGraphic) {
          // La lumière pulse en intensité et en taille
          const pulse = 1 + Math.sin(time * 0.005) * 0.1;
          enemyInstance.runeGraphic.scaleX = pulse;
          enemyInstance.runeGraphic.scaleY = pulse;
          enemyInstance.runeGraphic.alpha = 0.8 + Math.sin(time * 0.008) * 0.2;
      }
  
      // 5. PLUIE DE SABLE (Particules)
      if (enemyInstance.sandParticles) {
          enemyInstance.sandParticles.forEach(p => {
              p.y += p.speedY;
              p.rotation += 0.1;
              // Si la particule arrive en bas, on la remet en haut
              if (p.y > 44) {
                  p.y = -33;
                  // On la replace aléatoirement sous un des deux bras
                  p.x = (Math.random() > 0.5 ? 31 : -31) + (Math.random()*22 - 11);
                  p.setAlpha(Math.random() * 0.6 + 0.2);
              }
          });
      }
    },
  };