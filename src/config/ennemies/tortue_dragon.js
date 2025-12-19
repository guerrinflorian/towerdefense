export const tortue_dragon = {
  name: "Tortue-Dragon",
  speed: 35,
  hp: 2800,
  reward: 200,
  playerDamage: 4,
  color: 0x4a5d23, // Vert foncé carapace
  damage: 25,
  attackSpeed: 1000,
  scale: 1.1,
  
  // Paramètres spécifiques
  shellThreshold: 0.3, // Se cache à 30% HP
  shellDuration: 4000, // Reste caché 4 secondes
  
  onDraw: (scene, container, color, enemyInstance) => {
    // Initialisation des états
    enemyInstance.legs = {};
    enemyInstance.shellGroup = null; // Groupe visuel carapace fermée
    enemyInstance.normalGroup = null; // Groupe visuel normal
    enemyInstance.isInShell = false;
    enemyInstance.hasUsedShell = false; // Pour ne le faire qu'une fois
    
    // --- 1. GROUPE NORMAL (Marche) ---
    const normalGroup = scene.add.container(0, 0);
    
    // a) Pattes Arrière
    const legBack = scene.add.graphics();
    legBack.fillStyle(0x3a4d13);
    legBack.fillRoundedRect(-4, 0, 8, 18, 3); // Cuisse
    legBack.fillRoundedRect(-5, 15, 12, 6, 2); // Pied
    const legBackContainer = scene.add.container(-10, 5);
    legBackContainer.add(legBack);
    normalGroup.add(legBackContainer);
    enemyInstance.legs.back = legBackContainer;

    // b) Pattes Avant (Ajouté pour le réalisme)
    const legFront = scene.add.graphics();
    legFront.fillStyle(0x3a4d13);
    legFront.fillRoundedRect(-4, 0, 8, 18, 3);
    legFront.fillRoundedRect(-5, 15, 12, 6, 2);
    const legFrontContainer = scene.add.container(12, 5);
    legFrontContainer.add(legFront);
    normalGroup.add(legFrontContainer);
    enemyInstance.legs.front = legFrontContainer;

    // c) Queue
    const tail = scene.add.graphics();
    tail.fillStyle(color);
    tail.fillTriangle(-20, 0, -35, -5, -35, 5);
    normalGroup.add(tail);

    // d) Corps/Carapace Ouverte
    const body = scene.add.graphics();
    body.fillStyle(color);
    body.fillEllipse(0, -5, 42, 32); // Corps principal
    body.lineStyle(3, 0x2a3d13);
    body.strokeEllipse(0, -5, 42, 32); // Contour
    
    // Écailles décoratives
    body.fillStyle(0x2a3d13); 
    body.fillEllipse(-10, -8, 8, 6);
    body.fillEllipse(0, -10, 10, 8);
    body.fillEllipse(10, -8, 8, 6);
    normalGroup.add(body);

    // e) Tête
    const head = scene.add.graphics();
    head.fillStyle(0x5a6d33);
    head.fillRoundedRect(15, -15, 20, 14, 5); // Cou/Tête
    // Yeux
    head.fillStyle(0xff0000);
    head.fillCircle(28, -11, 2);
    // Corne/Museau
    head.fillStyle(0xffffaa);
    head.fillTriangle(32, -15, 38, -12, 32, -9);
    normalGroup.add(head);

    container.add(normalGroup);
    enemyInstance.normalGroup = normalGroup;

    // --- 2. GROUPE CARAPACE (Caché) ---
    const shellGroup = scene.add.container(0, 0);
    
    const shellGraphic = scene.add.graphics();
    // Ombre sous la carapace
    shellGraphic.fillStyle(0x000000, 0.3);
    shellGraphic.fillEllipse(0, 10, 40, 10);
    
    // La carapace fermée
    shellGraphic.fillStyle(0x3a4d13); // Plus sombre
    shellGraphic.fillEllipse(0, 0, 46, 36);
    shellGraphic.lineStyle(4, 0x1a2d03);
    shellGraphic.strokeEllipse(0, 0, 46, 36);
    
    // Pics sur la carapace fermée
    shellGraphic.fillStyle(0x1a2d03);
    shellGraphic.fillTriangle(-15, -10, -15, -20, -5, -12);
    shellGraphic.fillTriangle(0, -15, 0, -25, 10, -15);
    shellGraphic.fillTriangle(15, -10, 15, -20, 25, -12);

    shellGroup.add(shellGraphic);
    shellGroup.visible = false; // Invisible au départ
    container.add(shellGroup);
    enemyInstance.shellGroup = shellGroup;

    // Désactiver la rotation automatique du sprite car on gère le flip dans Enemy.js
    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    // --- LOGIQUE "SE CACHER" ---
    if (!enemyInstance.isInShell && !enemyInstance.hasUsedShell) {
        // Vérifier si HP < 30%
        if (enemyInstance.hp / enemyInstance.maxHp <= 0.3) {
            enemyInstance.isInShell = true;
            enemyInstance.hasUsedShell = true;
            
            // 1. Arrêter le mouvement
            if (enemyInstance.follower && enemyInstance.follower.tween) {
                enemyInstance.follower.tween.pause();
            }
            
            // 2. Visuel : Passage en mode coquille
            enemyInstance.normalGroup.visible = false;
            enemyInstance.shellGroup.visible = true;
            
            // 3. Timer pour ressortir (4 secondes)
            enemyInstance.scene.time.delayedCall(4000, () => {
                // Vérifier si l'ennemi n'est pas mort entre temps
                if (enemyInstance.active) {
                    enemyInstance.isInShell = false;
                    
                    // Reprendre le mouvement
                    if (enemyInstance.follower && enemyInstance.follower.tween) {
                        enemyInstance.follower.tween.resume();
                    }
                    
                    // Visuel : Retour normal
                    enemyInstance.normalGroup.visible = true;
                    enemyInstance.shellGroup.visible = false;
                    
                    // Petit soin optionnel (bonus) : +10% HP
                    // enemyInstance.hp = Math.min(enemyInstance.maxHp, enemyInstance.hp + (enemyInstance.maxHp * 0.1));
                    // enemyInstance.updateHealthBar();
                }
            });
        }
    }

    // --- ANIMATIONS ---
    if (enemyInstance.isInShell) {
        // Animation : Tremblement quand caché
        if (enemyInstance.shellGroup) {
            enemyInstance.shellGroup.x = Math.sin(time * 0.05) * 1.5; // Tremble horizontalement
            enemyInstance.shellGroup.rotation = Math.sin(time * 0.02) * 0.05; // Oscille un peu
        }
    } else {
        // Animation : Marche normale
        const speed = 0.006;
        const range = 0.5;
        
        // Animation des pattes (marche croisée)
        if (enemyInstance.legs.front) {
            enemyInstance.legs.front.rotation = Math.sin(time * speed) * range;
        }
        if (enemyInstance.legs.back) {
            enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * range; // Opposé
        }
        
        // Animation du corps (léger rebond)
        if (enemyInstance.normalGroup) {
            enemyInstance.normalGroup.y = Math.sin(time * speed * 2) * 1;
        }
    }
  },
};
