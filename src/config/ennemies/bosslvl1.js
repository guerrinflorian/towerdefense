export const bosslvl1 = {
  name: "SYLVAROK",
  speed: 11,
  hp: 42000,
  reward: 1000,
  playerDamage: 20,
  color: 0x4b3621, // Brun écorce sombre
  damage: 70, 
  attackSpeed: 1500, 
  scale: 0.67, // Réduit d'environ 1.8x (1.2 / 1.8 ≈ 0.67)

  onDraw: (scene, container, color, enemyInstance) => {
    enemyInstance.arms = [];

    // --- 1. BASE (Racines animées qui s'enfoncent) ---
    const roots = scene.add.graphics();
    roots.lineStyle(2, 0x2e1d0b);
    for(let i = 0; i < 5; i++) {
        roots.beginPath();
        roots.moveTo((i - 2) * 8, 11);
        roots.lineTo((i - 2) * 14, 31);
        roots.strokePath();
    }
    container.add(roots);
    enemyInstance.rootsGfx = roots;

    // --- 2. TORSE (Tronc fendu avec veines lumineuses) ---
    const torso = scene.add.graphics();
    torso.fillStyle(color);
    torso.lineStyle(1, 0x2e1d0b);

    // Forme de tronc robuste et irrégulière
    const trunkPoints = [-19, -22, 19, -22, 17, 17, -17, 17];
    torso.fillPoints(trunkPoints, true);
    torso.strokePoints(trunkPoints, true);
    container.add(torso);

    // Veines vertes lumineuses (La faille centrale)
    const veins = scene.add.graphics();
    veins.fillStyle(0x00ff00, 0.7);
    // Dessin d'une "faille" d'énergie au centre du torse
    veins.beginPath();
    veins.moveTo(-3, -17);
    veins.lineTo(3, -17);
    veins.lineTo(4, 0);
    veins.lineTo(1, 14);
    veins.lineTo(-3, 6);
    veins.closePath();
    veins.fillPath();
    container.add(veins);
    enemyInstance.veinsGfx = veins;

    // --- 3. ÉPAULES (Souches avec mousse) ---
    const createShoulder = (side) => {
        const shoulder = scene.add.graphics();
        shoulder.fillStyle(0x3d2b1f);
        // Souche coupée
        shoulder.fillRect(side * 19 - 7, -25, 13, 8);
        // Mousse verte sur le dessus
        shoulder.fillStyle(0x55aa44);
        shoulder.fillEllipse(side * 19, -25, 16, 6);
        container.add(shoulder);
    };
    createShoulder(-1); // Gauche
    createShoulder(1);  // Droite

    // --- 4. BRAS (Racines torsadées flottantes) ---
    const createArm = (side) => {
        const armCont = scene.add.container(side * 28, -11);
        const armGfx = scene.add.graphics();
        armGfx.lineStyle(3, 0x4b3621);
        
        // Forme de racine torsadée qui descend (approximation avec des lignes)
        armGfx.beginPath();
        armGfx.moveTo(0, 0);
        // Approximation de la courbe avec des segments
        armGfx.lineTo(side * 8, 6);
        armGfx.lineTo(side * 10, 14);
        armGfx.lineTo(side * 7, 25);
        armGfx.lineTo(side * 4, 33);
        armGfx.lineTo(side * 3, 39);
        armGfx.strokePath();

        // Main/Griffe en bois
        armGfx.fillStyle(0x4b3621);
        armGfx.fillTriangle(side * 3, 39, side * 11, 33, side * -6, 33);
        
        armCont.add(armGfx);
        container.add(armCont);
        return armCont;
    };
    enemyInstance.arms.push(createArm(-1), createArm(1));

    // --- 5. TÊTE (Masque de bois et yeux phosphorescents) ---
    const head = scene.add.graphics();
    head.fillStyle(0x5d4037); // Bois un peu plus clair pour le masque
    // Forme de masque rectangulaire taillé
    head.fillRoundedRect(-10, -39, 20, 22, 2);
    head.lineStyle(1, 0x2e1d0b);
    head.strokeRoundedRect(-10, -39, 20, 22, 2);

    // Yeux verts phosphorescents (brillance)
    head.fillStyle(0x00ff00);
    head.fillCircle(-4, -31, 3);
    head.fillCircle(4, -31, 3);
    container.add(head);
    enemyInstance.headGfx = head;

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    // 1. RESPIRATION LENTE (Lévitation du bloc supérieur)
    const slowFloat = Math.sin(time * 0.0015) * 6;
    enemyInstance.bodyGroup.y = slowFloat;

    // 2. PULSATION DES VEINES (Énergie de la forêt)
    if (enemyInstance.veinsGfx) {
        const pulse = 0.4 + Math.abs(Math.sin(time * 0.003)) * 0.6;
        enemyInstance.veinsGfx.alpha = pulse;
        // La lumière semble s'étendre légèrement
        enemyInstance.veinsGfx.scaleX = 0.9 + pulse * 0.2;
    }

    // 3. BRAS FLOTTANTS (Mouvement torsadé)
    if (enemyInstance.arms) {
        enemyInstance.arms.forEach((arm, i) => {
            const offset = i * Math.PI;
            arm.y = -11 + Math.sin(time * 0.002 + offset) * 7;
            arm.rotation = Math.sin(time * 0.001 + offset) * 0.15;
        });
    }

    // 4. ANIMATION DES YEUX (Clignotement mystique)
    if (enemyInstance.headGfx) {
        const eyeGlow = 0.7 + Math.abs(Math.sin(time * 0.005)) * 0.3;
        enemyInstance.headGfx.alpha = eyeGlow;
    }
  },
};