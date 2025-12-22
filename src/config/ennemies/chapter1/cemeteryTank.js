export const cemeteryTank = {
    name: "L'ABOMINATION",
    speed: 38,
    hp: 2350,
    reward: 140,
    playerDamage: 4,
    color: 0x2c2e2c, // Pierre tombale sombre
    damage: 28, 
    attackSpeed: 1200, 
    scale: 0.85, // --- ÉCHELLE RÉDUITE ---
  
    onDraw: (scene, container, color, enemyInstance) => {
      enemyInstance.legs = {};
      enemyInstance.glows = [];
  
      // --- 1. BRUME SPECTRALE ---
      const mist = scene.add.graphics();
      mist.fillStyle(0x00ff88, 0.15); 
      for (let i = 0; i < 4; i++) {
          // Rayon réduit (10-18 au lieu de 15-25)
          mist.fillCircle((Phaser.Math.Between(-15, 15)), 5, 10 + Math.random() * 8);
      }
      container.add(mist);
      enemyInstance.mist = mist;
  
      // --- 2. LES PIEDS (Os compacts) ---
      const createBoneFoot = (x) => {
          const foot = scene.add.container(x, 8);
          const g = scene.add.graphics();
          g.fillStyle(0xdcdcdc);
          // Dimensions réduites
          g.fillRoundedRect(-9, 0, 18, 12, 3); 
          g.lineStyle(1.5, 0x000000, 0.5);
          g.strokeRoundedRect(-9, 0, 18, 12, 3);
          foot.add(g);
          return foot;
      };
      enemyInstance.legs.back = createBoneFoot(-4);
      enemyInstance.legs.front = createBoneFoot(4);
      container.add([enemyInstance.legs.back, enemyInstance.legs.front]);
  
      // --- 3. LE CORPS (Stèle affinée) ---
      const body = scene.add.graphics();
      body.fillStyle(color);
      body.lineStyle(2.5, 0x111111);
  
      // Forme de stèle plus étroite (-16 à 16 au lieu de -20 à 20)
      body.beginPath();
      body.moveTo(-16, 12);
      body.lineTo(16, 12);
      body.lineTo(18, -15);
      
      // Courbe du haut plus basse
      const steps = 8;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = (1 - t) * (1 - t) * 18 + 2 * (1 - t) * t * 0 + t * t * (-18);
        const y = (1 - t) * (1 - t) * (-15) + 2 * (1 - t) * t * (-32) + t * t * (-15);
        body.lineTo(x, y);
      }
      body.closePath();
      body.fillPath();
      body.strokePath();
  
      // Fissures discrètes
      body.lineStyle(1.5, 0x000000, 0.5);
      body.moveTo(-4, -10); body.lineTo(-12, -2);
      body.strokePath();
  
      // --- 4. LA TÊTE (Petit crâne) ---
      const skull = scene.add.graphics();
      skull.fillStyle(0xeeeeee);
      skull.fillCircle(0, -14, 8); // Rayon 8 au lieu de 10
      
      skull.fillStyle(0x000000);
      skull.fillCircle(-3, -16, 2.5);
      skull.fillCircle(3, -16, 2.5);
      
      const eyeL = scene.add.circle(-3, -16, 1.2, 0x00ff88);
      const eyeR = scene.add.circle(3, -16, 1.2, 0x00ff88);
      
      container.add([skull, eyeL, eyeR]);
      enemyInstance.glows.push(eyeL, eyeR);
  
      // --- 5. CHAÎNES ---
      const chains = scene.add.graphics();
      chains.lineStyle(2, 0x555555);
      chains.beginPath();
      chains.moveTo(-14, 0); chains.lineTo(-20, 18);
      chains.moveTo(14, 0); chains.lineTo(20, 18);
      chains.strokePath();
      container.add(chains);
      enemyInstance.chains = chains;
  
      enemyInstance.shouldRotate = false;
    },
  
    onUpdateAnimation: (time, enemyInstance) => {
      const speed = 0.004;
      const sin = Math.sin(time * speed);
  
      enemyInstance.legs.front.rotation = sin * 0.22;
      enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * 0.22;
  
      // Rebond réduit pour correspondre à la taille
      enemyInstance.bodyGroup.y = Math.abs(sin) * -3;
      enemyInstance.bodyGroup.x = Math.sin(time * 0.05) * 0.8;
  
      const pulse = 0.6 + Math.abs(Math.sin(time * 0.005)) * 0.4;
      if (enemyInstance.mist) enemyInstance.mist.alpha = pulse * 0.25;
      
      enemyInstance.glows.forEach(eye => {
          eye.alpha = pulse;
          eye.setScale(0.8 + pulse * 0.3);
      });
  
      if (enemyInstance.chains) {
          enemyInstance.chains.x = Math.sin(time * 0.003) * 1.5;
      }
    },
  };