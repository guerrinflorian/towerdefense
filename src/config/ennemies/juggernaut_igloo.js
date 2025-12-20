export const juggernaut_igloo = {
    name: "Igloo de Combat",
    speed: 33, // Très lent et lourd
    hp: 3200, // Plus résistant que le tank de base
    reward: 180,
    playerDamage: 5,
    color: 0xe0f7fa, // Blanc bleuté (Neige)
    damage: 45, 
    attackSpeed: 1500, 
    scale: 0.75, // Taille réduite
  
    onDraw: (scene, container, color, enemyInstance) => {
      enemyInstance.legs = {};
  
      // 1. PATTES MÉCANIQUES (4 pattes en métal sombre)
      const createMechLeg = (x, y, isFront) => {
          const legCont = scene.add.container(x, y);
          const g = scene.add.graphics();
          g.fillStyle(0x37474f); // Gris acier foncé
          // Jambe articulée
          g.fillRect(-4, 0, 8, 13);
          // Pied large pour la neige
          g.fillStyle(isFront ? 0x455a64 : 0x263238);
          g.fillRoundedRect(-8, 10, 17, 7, 2);
          legCont.add(g);
          return legCont;
      };
  
      enemyInstance.legs.back = createMechLeg(-10, 4, false);
      enemyInstance.legs.front = createMechLeg(10, 4, true);
      container.add([enemyInstance.legs.back, enemyInstance.legs.front]);
  
      // 2. CORPS (Dôme d'Igloo)
      const bodyGroup = scene.add.container(0, 0);
      const body = scene.add.graphics();
      
      // Ombre à la base du dôme
      body.fillStyle(0x000000, 0.2);
      body.fillEllipse(0, 8, 38, 13);

      // Le dôme de neige
      body.fillStyle(color);
      body.lineStyle(2, 0x90caf9, 0.5); // Bordures de briques bleu clair
      
      // Dessin du dôme (demi-cercle aplati) - dimensions réduites
      // Approximation de la courbe quadratique : point de contrôle (0, -38), point final (-24, 0)
      // Formule: (1-t)²P0 + 2(1-t)tP1 + t²P2
      body.beginPath();
      body.moveTo(-21, 8);
      body.lineTo(21, 8);
      body.lineTo(24, 0);
      // Approximation de la courbe quadratique
      const steps = 15;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = (1 - t) * (1 - t) * 24 + 2 * (1 - t) * t * 0 + t * t * (-24);
        const y = (1 - t) * (1 - t) * 0 + 2 * (1 - t) * t * (-38) + t * t * 0;
        body.lineTo(x, y);
      }
      body.closePath();
      body.fillPath();
      body.strokePath();

      // Motifs de briques de glace
      body.lineStyle(1, 0x90caf9, 0.3);
      body.moveTo(-13, -13); body.lineTo(13, -13); // Ligne horizontale 1
      body.moveTo(-17, -4); body.lineTo(17, -4);   // Ligne horizontale 2
      body.strokePath();

      // 3. MEURTRIÈRE (Fente de vision)
      body.fillStyle(0x111111); // Noir profond
      body.fillRoundedRect(-13, -19, 26, 7, 2);

      bodyGroup.add(body);
      container.add(bodyGroup);
      enemyInstance.bodyGroup = bodyGroup;

      // Yeux rouges brillants
      const eyeGlow = scene.add.graphics();
      eyeGlow.fillStyle(0xff0000);
      eyeGlow.fillCircle(-5, -15, 1.5);
      eyeGlow.fillCircle(5, -15, 1.5);
      container.add(eyeGlow);
      enemyInstance.eyes = eyeGlow;
  
      // 4. DRAPEAU DE GUERRE (Sur le sommet)
      const flag = scene.add.graphics();
      flag.lineStyle(2, 0x37474f);
      flag.moveTo(0, -30); flag.lineTo(0, -38); // Mât
      flag.fillStyle(0xd32f2f); // Rouge
      flag.fillTriangle(0, -38, 10, -35, 0, -32); // Fanion
      flag.strokePath();
      container.add(flag);
      enemyInstance.flag = flag;
  
      enemyInstance.shouldRotate = false;
    },
  
    onUpdateAnimation: (time, enemyInstance) => {
      const speed = 0.0035; // Marche très cadencée
      const sin = Math.sin(time * speed);
  
      // Mouvement des quatre pattes (alternance)
      enemyInstance.legs.front.rotation = sin * 0.2;
      enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * 0.2;
  
      // Effet de poids : l'igloo s'écrase un peu à chaque pas
      const bounce = Math.abs(sin) * -4;
      enemyInstance.bodyGroup.y = bounce;
  
      // Animation du drapeau (flotte au vent)
      if (enemyInstance.flag) {
          enemyInstance.flag.skewX = Math.sin(time * 0.01) * 0.1;
      }
  
      // Pulsation des yeux rouges
      if (enemyInstance.eyes) {
          enemyInstance.eyes.alpha = 0.6 + Math.abs(Math.sin(time * 0.005)) * 0.4;
      }
    },
  };