export const shaman_gobelin = {
  name: "Shaman Gobelin",
  speed: 45,
  hp: 1200,
  reward: 120,
  color: 0x8b4513, // Marron
  damage: 12,
  attackSpeed: 1500,
  scale: 0.9,
  
  // Stats spécifiques au healer
  healAmount: 60,
  healInterval: 2000, // Soigne toutes les 2 secondes
  healRadius: 3,      // Rayon en "cases" (environ 192px)

  onDraw: (scene, container, color, enemyInstance) => {
    // Initialisation des états
    enemyInstance.legs = {};
    enemyInstance.healArea = null;
    enemyInstance.orb = null;
    enemyInstance.lastHealTime = 0; // Important pour le cooldown du soin

    // --- 1. ZONE DE SOIN (Au sol, tout en bas) ---
    const CONFIG = { TILE_SIZE: 64 };
    const tileSize = CONFIG.TILE_SIZE * (scene.scaleFactor || 1);
    // On convertit le rayon "cases" en pixels
    const radiusInPixels = shaman_gobelin.healRadius * tileSize;
    
    const healArea = scene.add.graphics();
    healArea.lineStyle(2, 0x00ff00, 0.5); // Bordure fine
    healArea.strokeCircle(0, 0, radiusInPixels);
    healArea.fillStyle(0x00ff00, 0.1); // Fond très transparent
    healArea.fillCircle(0, 0, radiusInPixels);
    
    // On l'ajoute au container mais avec un z-index négatif simulé par l'ordre d'ajout
    // Astuce : On le met dans un container 'background' attaché au container principal
    const bgContainer = scene.add.container(0, 0);
    bgContainer.add(healArea);
    container.add(bgContainer);
    bgContainer.sendToBack(healArea); // S'assurer qu'il est derrière
    enemyInstance.healArea = healArea;
    enemyInstance.healRadiusPixels = radiusInPixels; // Stocker pour la logique

    // --- 2. JAMBE ARRIÈRE ---
    enemyInstance.legs.back = scene.add.container(-4, 6);
    const legB = scene.add.graphics();
    legB.fillStyle(0x5a3510); // Marron plus foncé pour l'arrière
    legB.fillRoundedRect(-3, 0, 6, 14, 2); // Cuisse
    legB.fillRoundedRect(-4, 12, 9, 5, 2); // Pied
    enemyInstance.legs.back.add(legB);
    container.add(enemyInstance.legs.back);

    // --- 3. CORPS (Robe & Masque) ---
    const bodyGroup = scene.add.container(0, 0);
    const body = scene.add.graphics();
    
    // Robe
    body.fillStyle(color);
    body.fillRoundedRect(-10, -15, 20, 24, 6);
    body.lineStyle(2, 0x5a3510);
    body.strokeRoundedRect(-10, -15, 20, 24, 6);
    
    // Détails de la robe (ceinture)
    body.fillStyle(0xccaa00); // Doré
    body.fillRect(-10, -2, 20, 4);

    // Collier d'os
    body.fillStyle(0xeeeeee);
    body.fillCircle(-6, -10, 2);
    body.fillCircle(0, -8, 2);
    body.fillCircle(6, -10, 2);

    // Masque Tribal
    body.fillStyle(0x222222); // Masque noir
    body.fillRoundedRect(-8, -22, 16, 12, 3);
    
    // Peinture de guerre sur le masque
    body.fillStyle(0xff0000);
    body.fillRect(-6, -20, 2, 8);
    body.fillRect(4, -20, 2, 8);
    
    // Yeux brillants
    body.fillStyle(0x00ff00);
    body.fillCircle(-4, -16, 2);
    body.fillCircle(4, -16, 2);

    bodyGroup.add(body);
    container.add(bodyGroup);

    // --- 4. BÂTON MAGIQUE ---
    const staffContainer = scene.add.container(12, -5);
    const staff = scene.add.graphics();
    
    // Manche
    staff.fillStyle(0x654321);
    staff.fillRoundedRect(-2, -15, 4, 35, 1);
    
    // Tête du bâton (Crâne ou bois)
    staff.fillStyle(0xdddddd);
    staff.fillCircle(0, -15, 5);

    // Orbe magique (séparé pour animer l'alpha)
    const orb = scene.add.circle(0, -15, 6, 0x00ff00, 0.6);
    enemyInstance.orb = orb;

    staffContainer.add(staff);
    staffContainer.add(orb);
    container.add(staffContainer);
    enemyInstance.staff = staffContainer;

    // --- 5. JAMBE AVANT ---
    enemyInstance.legs.front = scene.add.container(4, 6);
    const legF = scene.add.graphics();
    legF.fillStyle(color); 
    legF.fillRoundedRect(-3, 0, 6, 14, 2);
    legF.fillRoundedRect(-4, 12, 9, 5, 2);
    enemyInstance.legs.front.add(legF);
    container.add(enemyInstance.legs.front);

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    // 1. Animation de Marche (Classique)
    const speed = 0.007;
    const range = 0.5;
    if (enemyInstance.legs.front) {
      enemyInstance.legs.front.rotation = Math.sin(time * speed) * range;
    }
    if (enemyInstance.legs.back) {
      enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * range;
    }
    // Petit rebond du bâton
    if (enemyInstance.staff) {
        enemyInstance.staff.y = -5 + Math.sin(time * speed * 2) * 2;
    }

    // 2. Animation Orbe & Zone (Pulsation passive)
    if (enemyInstance.orb) {
      enemyInstance.orb.alpha = 0.5 + Math.sin(time * 0.005) * 0.4;
      const s = 1 + Math.sin(time * 0.01) * 0.2;
      enemyInstance.orb.setScale(s);
    }
    if (enemyInstance.healArea) {
        // La zone "respire" doucement
        enemyInstance.healArea.alpha = 0.3 + Math.sin(time * 0.002) * 0.1;
    }

    // --- 3. LOGIQUE DE SOIN ---
    if (!enemyInstance.scene || !enemyInstance.active) return;
    
    const now = enemyInstance.scene.time.now;
    // Vérifier le Cooldown (healInterval)
    if (now - enemyInstance.lastHealTime > enemyInstance.stats.healInterval) {
        let hasHealedSomeone = false;
        const r2 = enemyInstance.healRadiusPixels * enemyInstance.healRadiusPixels; // Distance au carré pour perf

        // Parcourir tous les ennemis
        enemyInstance.scene.enemies.children.each(ally => {
            // Ne pas soigner si : soi-même, mort, ou déjà full vie
            if (ally === enemyInstance || !ally.active || ally.hp >= ally.maxHp) return;

            // Calcul distance
            const dx = ally.x - enemyInstance.x;
            const dy = ally.y - enemyInstance.y;
            const distSq = dx*dx + dy*dy;

            // Si à portée
            if (distSq <= r2) {
                // APPLIQUER LE SOIN
                const amount = enemyInstance.stats.healAmount;
                ally.hp = Math.min(ally.maxHp, ally.hp + amount);
                ally.updateHealthBar(); // Mise à jour visuelle de la barre de vie
                hasHealedSomeone = true;

                // Effet visuel sur l'allié soigné (Particules +HP)
                if (enemyInstance.scene.add) {
                    const txt = enemyInstance.scene.add.text(ally.x, ally.y - 40, `+${amount}`, {
                        fontSize: '16px', fill: '#00ff00', fontStyle: 'bold', stroke: '#000', strokeThickness: 2
                    }).setOrigin(0.5);
                    
                    enemyInstance.scene.tweens.add({
                        targets: txt,
                        y: ally.y - 80,
                        alpha: 0,
                        duration: 1000,
                        onComplete: () => txt.destroy()
                    });
                }
            }
        });

        // Si on a soigné au moins une personne, on déclenche l'animation de cast
        if (hasHealedSomeone) {
            enemyInstance.lastHealTime = now;
            
            // Flash de la zone au sol
            if (enemyInstance.healArea) {
                enemyInstance.healArea.alpha = 0.8;
                enemyInstance.scene.tweens.add({
                    targets: enemyInstance.healArea,
                    alpha: 0.1,
                    duration: 500
                });
            }
            
            // Flash de l'orbe
            if (enemyInstance.orb) {
                enemyInstance.orb.setScale(2);
                enemyInstance.scene.tweens.add({
                    targets: enemyInstance.orb,
                    scaleX: 1, scaleY: 1,
                    duration: 300
                });
            }
        }
    }
  },
};