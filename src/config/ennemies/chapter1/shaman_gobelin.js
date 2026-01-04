export const shaman_gobelin = {
    name: "Shaman Gobelin",
    speed: 40,
    hp: 1210,
    reward: 120,
    playerDamage: 2,
    color: 0x8b4513,
    damage: 12,
    attackSpeed: 1500,
    scale: 0.9,
    description: "Shaman Gobelin - Soigneur. Rôle : soutien médical. POUVOIR SPÉCIAL : Soigne les alliés proches de 75 HP toutes les 2.4 secondes dans un rayon de 1.7 cases. Priorité absolue à éliminer !",
    healAmount: 75,
    healInterval: 2400, 
    healRadius: 1.7, // Rayon en cases

    onDraw: (scene, container, color, enemyInstance) => {
        enemyInstance.legs = {};
        enemyInstance.orb = null;

        // --- 1. ZONE DE SOIN (Visuel Aura) ---
        const tileSize = 64 * (scene.scaleFactor || 1);
        const radiusInPixels = shaman_gobelin.healRadius * tileSize;
        
        const healArea = scene.add.graphics();
        healArea.lineStyle(2, 0x00ff00, 0.4);
        healArea.strokeCircle(0, 0, radiusInPixels);
        healArea.fillStyle(0x00ff00, 0.05);
        healArea.fillCircle(0, 0, radiusInPixels);
        
        container.add(healArea);
        container.sendToBack(healArea); 
        
        enemyInstance.healArea = healArea;
        // On stocke le rayon en pixels pour l'update
        enemyInstance.healRadiusPixels = radiusInPixels; 

        // --- 2. CORPS ET JAMBES --- (Identique à ton code)
        enemyInstance.legs.back = scene.add.container(-4, 6);
        const legB = scene.add.graphics().fillStyle(0x5a3510).fillRoundedRect(-3, 0, 6, 14, 2).fillRoundedRect(-4, 12, 9, 5, 2);
        enemyInstance.legs.back.add(legB);
        container.add(enemyInstance.legs.back);

        const bodyGroup = scene.add.container(0, 0);
        const body = scene.add.graphics().fillStyle(color).fillRoundedRect(-10, -15, 20, 24, 6);
        body.lineStyle(2, 0x5a3510).strokeRoundedRect(-10, -15, 20, 24, 6);
        body.fillStyle(0x00ff00).fillCircle(-4, -16, 2).fillCircle(4, -16, 2); // Yeux
        bodyGroup.add(body);
        container.add(bodyGroup);

        // Orbe
        const orb = scene.add.circle(12, -20, 6, 0x00ff00, 0.6);
        container.add(orb);
        enemyInstance.orb = orb;

        enemyInstance.legs.front = scene.add.container(4, 6);
        const legF = scene.add.graphics().fillStyle(color).fillRoundedRect(-3, 0, 6, 14, 2).fillRoundedRect(-4, 12, 9, 5, 2);
        enemyInstance.legs.front.add(legF);
        container.add(enemyInstance.legs.front);

        enemyInstance.shouldRotate = false;
    },

    onUpdateAnimation: (time, enemyInstance) => {
        const now = time; // Utilise le temps passé par Phaser
        
        // 1. Animations visuelles
        const speed = 0.007;
        if (enemyInstance.legs.front) enemyInstance.legs.front.rotation = Math.sin(time * speed) * 0.5;
        if (enemyInstance.legs.back) enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * 0.5;
        if (enemyInstance.orb) {
            enemyInstance.orb.alpha = 0.5 + Math.sin(time * 0.005) * 0.4;
            enemyInstance.orb.y = -20 + Math.sin(time * 0.01) * 3;
        }

        // 2. LOGIQUE DE SOIN (Optimisée)
        if (enemyInstance.healInterval && now - enemyInstance.lastHealTime > enemyInstance.healInterval) {
            let healed = false;
            const radiusSq = Math.pow(enemyInstance.healRadiusPixels, 2);

            enemyInstance.scene.enemies.getChildren().forEach(ally => {
                // Ne soigner que les alliés vivants et blessés
                if (ally !== enemyInstance && ally.active && ally.hp < ally.maxHp) {
                    const distSq = Phaser.Math.Distance.Squared(enemyInstance.x, enemyInstance.y, ally.x, ally.y);
                    
                    if (distSq <= radiusSq) {
                        ally.hp = Math.min(ally.maxHp, ally.hp + enemyInstance.stats.healAmount);
                        ally.updateHealthBar();
                        healed = true;

                        // Effet visuel sur l'allié
                        const txt = enemyInstance.scene.add.text(ally.x, ally.y - 30, "+HP", {
                            fontSize: '12px', fill: '#00ff00', fontWeight: 'bold'
                        }).setOrigin(0.5);
                        enemyInstance.scene.tweens.add({ targets: txt, y: ally.y - 60, alpha: 0, duration: 800, onComplete: () => txt.destroy() });
                    }
                }
            });

            if (healed) {
                enemyInstance.lastHealTime = now;
                // Petit flash de l'orbe au moment du soin
                if (enemyInstance.orb) {
                    enemyInstance.scene.tweens.add({ targets: enemyInstance.orb, scale: 1.5, duration: 200, yoyo: true });
                }
            }
        }
    }
};