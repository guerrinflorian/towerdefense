export const soul_messenger_runner = {
    name: "Soul Messenger",
    speed: 210, // Ultra rapide
    hp: 105, // Très fragile
    reward: 28,
    playerDamage: 2,
    color: 0x4ef0c2, // Vert spectral
    damage: 10,
    attackSpeed: 550,
    scale: 1,
    description: "Soul Messenger - Messager spectral. Rôle : éclaireur ultra-rapide sans pouvoir spécial. Très rapide mais extrêmement fragile, éliminez-le rapidement !",
  
    onDraw: (scene, container, color, enemyInstance) => {
      enemyInstance.shouldRotate = false;
  
      // --- TRANSPARENCE GLOBALE ---
      container.setAlpha(0.85);
  
      // === CORPS SPECTRAL ===
      const body = scene.add.graphics();
      body.fillStyle(color, 0.9);
      body.fillRoundedRect(-6, -10, 12, 20, 6);
      container.add(body);
  
      // === CAPUCHE FLOTTANTE ===
      const hood = scene.add.graphics();
      hood.fillStyle(0x1a2e2a, 0.95);
      hood.beginPath();
      hood.moveTo(0, -28);
      hood.lineTo(14, -12);
      hood.lineTo(-14, -12);
      hood.closePath();
      hood.fillPath();
      container.add(hood);
  
      // === VISAGE OMBRÉ ===
      const face = scene.add.graphics();
      face.fillStyle(0x000000, 0.7);
      face.fillRoundedRect(-4, -14, 8, 8, 3);
      container.add(face);
  
      // === YEUX PHOSPHORESCENTS ===
      const eyes = scene.add.graphics();
      eyes.fillStyle(0x7fffe1, 1);
      eyes.fillCircle(-2, -10, 1.3);
      eyes.fillCircle(2, -10, 1.3);
      container.add(eyes);
  
      // === BRUME INFERIEURE (PAS DE JAMBES) ===
      enemyInstance.smoke = scene.add.graphics();
      enemyInstance.smoke.fillStyle(0x4ef0c2, 0.25);
      enemyInstance.smoke.fillEllipse(0, 10, 18, 10);
      container.add(enemyInstance.smoke);
  
      // === TRAÎNÉE D’ÂMES ===
      enemyInstance.trail = scene.add.graphics();
      container.add(enemyInstance.trail);
    },
  
    onUpdateAnimation: (time, enemyInstance) => {
      // === FLOTTEMENT DU CORPS ===
      enemyInstance.yOffset = Math.sin(time * 0.003) * 2;
      enemyInstance.container?.setY(enemyInstance.y + enemyInstance.yOffset);
  
      // === PULSATION DES YEUX ===
      if (enemyInstance.container?.list) {
        const eyes = enemyInstance.container.list.find(
          el => el.fillStyle && el.alpha === 1
        );
        if (eyes) {
          eyes.alpha = 0.7 + Math.sin(time * 0.01) * 0.3;
        }
      }
  
      // === BRUME QUI ONDULE ===
      if (enemyInstance.smoke) {
        enemyInstance.smoke.scaleX = 1 + Math.sin(time * 0.01) * 0.1;
        enemyInstance.smoke.scaleY = 1 + Math.cos(time * 0.012) * 0.1;
      }
  
      // === TRAÎNÉE SPECTRALE ===
      if (enemyInstance.trail) {
        enemyInstance.trail.clear();
        enemyInstance.trail.fillStyle(0x4ef0c2, 0.15);
        enemyInstance.trail.fillEllipse(
          -12,
          8,
          22 + Math.sin(time * 0.02) * 6,
          12
        );
      }
    },
  };
  