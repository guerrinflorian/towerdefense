export const bosslvl2 = {
  name: "NÉANT VORACE",
  speed: 12, // Plus rapide que le chevalier, course effrayante
  hp: 80000,
  reward: 2500,
  playerDamage: 20,
  color: 0x000000,
  damage: 150, 
  attackSpeed: 800, // Attaque très vite (frénétique)
  scale: 1.3,

  onDraw: (scene, container, color, enemyInstance) => {
    // Initialisation pour l'animation
    enemyInstance.legs = [];
    enemyInstance.eye = null;
    enemyInstance.pupil = null;

    // --- 1. LES PATTES (8 pattes d'araignée effrayantes) ---
    // On les dessine d'abord pour qu'elles soient derrière le corps
    for (let i = 0; i < 8; i++) {
        const leg = scene.add.graphics();
        leg.lineStyle(4, 0x110022); // Violet très sombre
        
        // Forme de patte articulée pointue
        leg.beginPath();
        leg.moveTo(0, 0);
        leg.lineTo(30, -20); // Premier segment
        leg.lineTo(55, 10);  // Pointe vers le bas
        leg.strokePath();
        
        // On positionne la patte autour du corps
        // On les groupe un peu pour laisser de la place devant
        // Angles : -135, -90, -45, -20 (gauche) et 20, 45, 90, 135 (droite)
        const angles = [-2.2, -1.5, -0.8, -0.3, 0.3, 0.8, 1.5, 2.2];
        const angle = angles[i];
        
        // Créer un conteneur pour la patte pour pouvoir la pivoter facilement
        const legContainer = scene.add.container(0, 0);
        legContainer.add(leg);
        legContainer.rotation = angle;
        
        // Stocker l'angle de base pour l'animation
        legContainer.baseRotation = angle;
        
        container.add(legContainer);
        enemyInstance.legs.push(legContainer);
    }

    // --- 2. AURA DE TÉNÈBRES (Fumée noire) ---
    const darkness = scene.add.graphics();
    darkness.fillStyle(0x000000, 0.3);
    for(let i=0; i<8; i++) {
        darkness.fillCircle(
            (Math.random()-0.5)*50, 
            (Math.random()-0.5)*50, 
            15 + Math.random()*15
        );
    }
    container.add(darkness);
    enemyInstance.darkness = darkness;

    // --- 3. CORPS (Masse informe) ---
    const body = scene.add.graphics();
    body.fillStyle(0x0a000a); // Noir quasi absolu
    body.lineStyle(3, 0x440044); // Contour violet maladif
    
    // Forme irrégulière
    body.beginPath();
    body.moveTo(-25, -30);
    body.lineTo(25, -30);
    body.lineTo(35, 0);
    body.lineTo(20, 35);
    body.lineTo(-20, 35);
    body.lineTo(-35, 0);
    body.closePath();
    body.fillPath();
    body.strokePath();
    container.add(body);
    enemyInstance.bodyGraphic = body;

    // --- 4. L'ŒIL UNIQUE (Sauron style mais organique) ---
    // Blanc de l'œil (injecté de sang)
    const eyeWhite = scene.add.graphics();
    eyeWhite.fillStyle(0xffcccc); 
    eyeWhite.fillEllipse(0, -5, 15, 10);
    container.add(eyeWhite);
    enemyInstance.eye = eyeWhite;

    // Pupille (Fente verticale rouge vif)
    const pupil = scene.add.graphics();
    pupil.fillStyle(0xff0000);
    pupil.fillEllipse(0, -5, 3, 9);
    container.add(pupil);
    enemyInstance.pupil = pupil;

    // --- CONFIG ---
    enemyInstance.shouldRotate = false; // Il fait face au joueur
  },

  onUpdateAnimation: (time, enemyInstance) => {
    // Sécurité
    if (!enemyInstance.legs || !enemyInstance.bodyGraphic) return;

    // 1. ANIMATION DES PATTES (Frénétique)
    // Elles bougent très vite et de manière désynchronisée (effet insecte)
    const legSpeed = 0.02;
    enemyInstance.legs.forEach((leg, index) => {
        // Mouvement de marche rapide et saccadé
        const offset = index * 0.5; // Décalage pour qu'elles ne bougent pas toutes en même temps
        const wiggle = Math.sin(time * legSpeed + offset) * 0.2; 
        
        // Ajout d'un "twitch" (spasme) aléatoire
        const twitch = (Math.random() > 0.95) ? 0.1 : 0;
        
        leg.rotation = leg.baseRotation + wiggle + twitch;
        
        // Les pointes des pattes bougent légèrement en distance
        leg.x = Math.cos(leg.rotation) * (Math.sin(time * 0.01) * 2);
        leg.y = Math.sin(leg.rotation) * (Math.sin(time * 0.01) * 2);
    });

    // 2. CORPS QUI RESPIRE / PALPITE
    const breath = 1 + Math.sin(time * 0.005) * 0.05;
    enemyInstance.bodyGraphic.scaleX = breath;
    enemyInstance.bodyGraphic.scaleY = breath;

    // 3. MOUVEMENT "GLITCH" DU BOSS
    // Au lieu de flotter doucement, il se décale brusquement de temps en temps
    if (Math.random() > 0.92) {
        enemyInstance.bodyGroup.x = (Math.random() - 0.5) * 3;
        enemyInstance.bodyGroup.y = (Math.random() - 0.5) * 3;
    } else {
        // Retour progressif au centre (lissage)
        enemyInstance.bodyGroup.x *= 0.8;
        enemyInstance.bodyGroup.y *= 0.8;
    }

    // 4. L'ŒIL QUI REGARDE PARTOUT
    if (enemyInstance.pupil) {
        // La pupille bouge nerveusement
        enemyInstance.pupil.x = (Math.random() - 0.5) * 4;
        enemyInstance.pupil.y = -5 + (Math.random() - 0.5) * 2;
        
        // Clignement de l'œil (disparition brève)
        if (Math.random() > 0.99) {
            enemyInstance.eye.visible = false;
            enemyInstance.pupil.visible = false;
            // Réapparaît après 100ms
            setTimeout(() => {
                if(enemyInstance.active) {
                    enemyInstance.eye.visible = true;
                    enemyInstance.pupil.visible = true;
                }
            }, 100);
        }
    }
  },
};
