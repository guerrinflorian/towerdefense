export const witch = {
  name: "Sorcière",
  speed: 28, // Très lent
  hp: 800,
  reward: 150,
  color: 0x6a1b9a, // Violet/Pourpre
  damage: 15,
  attackSpeed: 1200,
  spawnInterval: 5000, // Spawn toutes les 5 secondes
  spawnCount: 4, // 4 bébés zombies à chaque spawn
  spawnType: "zombie_minion", // Type d'ennemi à spawner
  scale: 1.2, // Légèrement plus grande

  onDraw: (scene, container, color, enemyInstance) => {
    // Stocker les références pour l'animation
    enemyInstance.legs = {};
    enemyInstance.staff = null;
    enemyInstance.hat = null;

    // 1. Jambe Arrière
    enemyInstance.legs.back = scene.add.container(0, 8);
    const legB = scene.add.graphics();
    legB.fillStyle(0x4a148c); // Violet foncé
    legB.fillRoundedRect(-3, 0, 6, 20, 2);
    legB.fillRoundedRect(-4, 18, 8, 4, 2); // Botte pointue
    enemyInstance.legs.back.add(legB);
    container.add(enemyInstance.legs.back);

    // 2. Robe (longue et ample)
    const robe = scene.add.graphics();
    robe.fillStyle(color);
    // Robe en forme de trapèze
    robe.beginPath();
    robe.moveTo(-8, -5);
    robe.lineTo(8, -5);
    robe.lineTo(12, 20);
    robe.lineTo(-12, 20);
    robe.closePath();
    robe.fillPath();
    
    // Bordure dorée
    robe.lineStyle(2, 0xffd700);
    robe.strokePath();
    
    // Détails de la robe (étoiles, runes)
    robe.fillStyle(0xffd700, 0.6);
    robe.fillCircle(-5, 5, 2);
    robe.fillCircle(5, 5, 2);
    robe.fillCircle(0, 12, 1.5);
    container.add(robe);

    // 3. Tête et chapeau pointu
    const head = scene.add.graphics();
    head.fillStyle(0xffdbac); // Peau
    head.fillCircle(0, -12, 6);
    
    // Yeux brillants (magie)
    head.fillStyle(0x00ffff); // Cyan magique
    head.fillCircle(-2, -13, 1.5);
    head.fillCircle(2, -13, 1.5);
    
    // Chapeau pointu
    enemyInstance.hat = scene.add.graphics();
    enemyInstance.hat.fillStyle(0x4a148c);
    enemyInstance.hat.beginPath();
    enemyInstance.hat.moveTo(-6, -18);
    enemyInstance.hat.lineTo(6, -18);
    enemyInstance.hat.lineTo(0, -30);
    enemyInstance.hat.closePath();
    enemyInstance.hat.fillPath();
    enemyInstance.hat.lineStyle(2, 0xffd700);
    enemyInstance.hat.strokePath();
    
    // Étoile sur le chapeau
    enemyInstance.hat.fillStyle(0xffd700);
    enemyInstance.hat.fillCircle(0, -24, 2);
    
    container.add(head);
    container.add(enemyInstance.hat);

    // 4. Bâton magique (tenu à la main)
    const staffContainer = scene.add.container(0, 0);
    const staff = scene.add.graphics();
    staff.fillStyle(0x8b4513); // Marron pour le bâton
    staff.fillRect(8, -8, 3, 25);
    staffContainer.add(staff);
    
    // Orbe magique au bout (objet séparé pour l'animation)
    enemyInstance.orb = scene.add.circle(9.5, 18, 4, 0x00ffff, 0.8);
    enemyInstance.orb.setStrokeStyle(1, 0xffffff);
    staffContainer.add(enemyInstance.orb);
    
    enemyInstance.staff = staffContainer;
    container.add(staffContainer);

    // 5. Jambe Avant
    enemyInstance.legs.front = scene.add.container(0, 8);
    const legF = scene.add.graphics();
    legF.fillStyle(0x4a148c);
    legF.fillRoundedRect(-3, 0, 6, 20, 2);
    legF.fillRoundedRect(-4, 18, 8, 4, 2);
    enemyInstance.legs.front.add(legF);
    container.add(enemyInstance.legs.front);

    // Aura magique (particules autour)
    enemyInstance.aura = scene.add.graphics();
    enemyInstance.aura.lineStyle(1, 0x00ffff, 0.4);
    enemyInstance.aura.strokeCircle(0, 0, 18);
    enemyInstance.aura.strokeCircle(0, 0, 20);
    container.add(enemyInstance.aura);

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    const speed = 0.005; // Marche très lente
    const range = 0.3;

    // Animation de marche
    enemyInstance.legs.front.rotation = Math.sin(time * speed) * range;
    enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * range;

    // Animation du chapeau (légère oscillation)
    if (enemyInstance.hat) {
      enemyInstance.hat.rotation = Math.sin(time * 0.003) * 0.1;
    }

    // Animation du bâton (légère pulsation de l'orbe)
    if (enemyInstance.orb && enemyInstance.orb.active) {
      const pulseScale = 1 + Math.sin(time * 0.01) * 0.2;
      enemyInstance.orb.setScale(pulseScale);
      enemyInstance.orb.setAlpha(0.6 + Math.sin(time * 0.015) * 0.3);
    }

    // Animation de l'aura
    if (enemyInstance.aura) {
      enemyInstance.aura.alpha = 0.3 + Math.sin(time * 0.008) * 0.2;
      enemyInstance.aura.rotation += 0.002;
    }
  },
};
