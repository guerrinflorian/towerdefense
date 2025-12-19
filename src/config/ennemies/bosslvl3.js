export const bosslvl3 = {
  name: "OMEGA-TITAN",
  speed: 6, // Très lent (c'est un tank ultime)
  hp: 250000, // Une barre de vie colossale
  reward: 5000,
  color: 0xff4400, // Orange lave
  damage: 500, // One-shot presque tout
  attackSpeed: 2000, // Frappe lentement mais fort
  scale: 1.6, // Il est énorme

  onDraw: (scene, container, color, enemyInstance) => {
    // Initialisation des références pour l'animation
    enemyInstance.gears = [];
    enemyInstance.pistons = [];

    // --- 1. FUMÉE VOLCANIQUE (Arrière-plan) ---
    // Des cercles gris qui tourneront autour de lui
    const smokeGroup = scene.add.container(0, 0);
    for (let i = 0; i < 6; i++) {
      const smoke = scene.add.graphics();
      smoke.fillStyle(0x333333, 0.5);
      smoke.fillCircle(0, 0, 10 + Math.random() * 10);
      // Position aléatoire autour du centre
      smoke.x = (Math.random() - 0.5) * 60;
      smoke.y = (Math.random() - 0.5) * 60;
      smokeGroup.add(smoke);
    }
    container.add(smokeGroup);
    enemyInstance.smokeGroup = smokeGroup;

    // --- 2. JAMBES BLINDÉES ---
    // Deux gros rectangles noirs pour les pieds
    const legs = scene.add.graphics();
    legs.fillStyle(0x1a1a1a); // Acier noir
    legs.lineStyle(2, 0xff4400); // Bordure en fusion
    // Jambe G
    legs.fillRect(-30, 10, 20, 30);
    // Jambe D
    legs.fillRect(10, 10, 20, 30);
    legs.strokeRect(-30, 10, 20, 30);
    legs.strokeRect(10, 10, 20, 30);
    container.add(legs);

    // --- 3. CORPS (TORSE MASSIF) ---
    const torso = scene.add.graphics();
    torso.fillStyle(0x222222); // Gris foncé
    // Forme trapézoïdale pour faire "costaud"
    torso.beginPath();
    torso.moveTo(-40, -20); // Haut G
    torso.lineTo(40, -20); // Haut D
    torso.lineTo(30, 20); // Bas D
    torso.lineTo(-30, 20); // Bas G
    torso.closePath();
    torso.fillPath();
    container.add(torso);

    // --- 4. CŒUR DE FUSION (Le point faible visuel) ---
    // Un cercle qui va pulser
    const core = scene.add.graphics();
    core.fillStyle(0xffaa00); // Jaune/Orange très vif
    core.fillCircle(0, 0, 12);
    container.add(core);
    enemyInstance.coreGraphic = core;

    // --- 5. ÉPAULIÈRES ROTATIVES (Engrenages) ---
    // Deux engrenages sur les épaules qui tournent
    const createGear = (x, y) => {
      const gear = scene.add.graphics();
      gear.lineStyle(3, 0x555555);
      gear.fillStyle(0x333333);

      // Dessin d'un engrenage simple
      const radius = 18;
      const teeth = 8;
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

      // Centre de l'engrenage
      gear.fillStyle(0xff0000);
      gear.fillCircle(0, 0, 5);

      const gearCont = scene.add.container(x, y);
      gearCont.add(gear);
      return gearCont;
    };

    const leftGear = createGear(-45, -25);
    const rightGear = createGear(45, -25);
    container.add(leftGear);
    container.add(rightGear);
    enemyInstance.gears.push(leftGear, rightGear);

    // --- 6. TÊTE (Casque) ---
    const head = scene.add.graphics();
    head.fillStyle(0x111111); // Noir
    head.fillRect(-15, -45, 30, 25);
    // Visière cylon (rouge/orange)
    head.fillStyle(0xff0000);
    head.fillRect(-12, -35, 24, 4);
    container.add(head);

    // --- CONFIG ---
    enemyInstance.shouldRotate = false; // Il reste droit (comme un mech)
  },

  onUpdateAnimation: (time, enemyInstance) => {
    // Sécurité
    if (!enemyInstance.coreGraphic || !enemyInstance.smokeGroup) return;

    // 1. MARCHE LOURDE (Pilonnage)
    // Au lieu de trembler, il monte et descend lourdement
    // Sinus lent mais grande amplitude
    const walkCycle = Math.sin(time * 0.008);
    // On déplace tout le conteneur du corps (offset Y)
    // Note: on modifie les éléments graphiques internes pour ne pas casser le x/y global de l'ennemi sur le chemin
    enemyInstance.bodyGroup.y = Math.abs(walkCycle) * -5; // Il s'écrase au sol à 0, monte à -5

    // 2. PULSATION DU CŒUR (Thermique)
    // La chaleur monte et descend
    const heat = 0.8 + Math.abs(Math.sin(time * 0.01)) * 0.5;
    enemyInstance.coreGraphic.scaleX = heat;
    enemyInstance.coreGraphic.scaleY = heat;
    enemyInstance.coreGraphic.alpha = 0.5 + heat / 3;

    // 3. ROTATION DES ENGRENAGES (Mécanique)
    // Ils tournent en sens inverse l'un de l'autre
    if (enemyInstance.gears) {
      enemyInstance.gears[0].rotation -= 0.02; // Gauche
      enemyInstance.gears[1].rotation += 0.02; // Droite
    }

    // 4. FUMÉE EN ORBITE
    // La fumée tourne lentement autour du boss
    enemyInstance.smokeGroup.rotation += 0.005;
    // Et palpite légèrement
    enemyInstance.smokeGroup.scaleX = 1 + Math.sin(time * 0.002) * 0.1;
    enemyInstance.smokeGroup.scaleY = 1 + Math.sin(time * 0.002) * 0.1;
  },
};
