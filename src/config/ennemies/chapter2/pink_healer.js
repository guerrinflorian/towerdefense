export const pink_healer = {
    name: "Soigneur Rose",
    speed: 40,
    hp: 1510,
    reward: 120,
    playerDamage: 2,
    color: 0xffb6c1,
    damage: 12,
    attackSpeed: 1500,
    scale: 0.9,
    description: "Soigneur Rose - Soigneur. Rôle : soutien médical. POUVOIR SPÉCIAL : Soigne les alliés proches de 75 HP toutes les 2.4 secondes dans un rayon de 2.1 cases. Priorité maximale à éliminer !",
    healAmount: 75,
    healInterval: 2400, 
    healRadius: 2.1, // Rayon mis à jour à 3.5

    onDraw: (scene, container, color, enemyInstance) => {
        enemyInstance.legs = {};
        enemyInstance.elements = {};

        const tileSize = 64 * (scene.scaleFactor || 1);
        const radiusInPixels = pink_healer.healRadius * tileSize;

        const colors = {
            bodyMain: 0xffb6c1,
            bodyShadow: 0xf48fb1,
            auraFill: 0xff69b4,
            auraOutline: 0x330015,
            gem: 0xff1493,
            highlight: 0xffffff,
            staffWood: 0x8b4513
        };

        // --- 1. ZONE DE SOIN CIRCULAIRE (Subtile) ---
        const healArea = scene.add.graphics();
        
        // On réduit l'alpha (0.1 pour le fond, 0.4 pour le contour) pour plus de discrétion
        healArea.lineStyle(2, colors.auraOutline, 0.4); 
        healArea.fillStyle(colors.auraFill, 0.1);
        
        // Dessin du cercle
        healArea.fillCircle(0, 0, radiusInPixels);
        healArea.strokeCircle(0, 0, radiusInPixels);
        
        container.add(healArea);
        container.sendToBack(healArea); 
        enemyInstance.healArea = healArea;
        enemyInstance.healRadiusPixels = radiusInPixels;

        // --- 2. PERSONNAGE ---
        enemyInstance.legs.back = scene.add.container(-4, 6);
        const legB = scene.add.graphics();
        legB.fillStyle(colors.bodyShadow);
        legB.fillRoundedRect(-3, 0, 6, 14, 2);
        enemyInstance.legs.back.add(legB);
        container.add(enemyInstance.legs.back);

        const bodyGroup = scene.add.container(0, 0);
        const body = scene.add.graphics();
        body.fillStyle(colors.bodyShadow);
        body.fillRoundedRect(-9, -12, 18, 20, 6);
        body.fillStyle(colors.bodyMain);
        body.fillRoundedRect(-8, -12, 16, 20, 6);
        
        bodyGroup.add(body);
        container.add(bodyGroup);
        enemyInstance.elements.body = bodyGroup;

        // --- 3. CANNE ---
        const staffGroup = scene.add.container(12, -12);
        const staff = scene.add.graphics();
        staff.lineStyle(3, colors.staffWood, 1);
        staff.lineBetween(0, 10, 0, -20);
        staffGroup.add(staff);
        
        const heartGem = scene.add.graphics();
        heartGem.fillStyle(colors.gem);
        heartGem.lineStyle(1.5, colors.auraOutline, 1);
        const hs = 8; 
        heartGem.beginPath();
        heartGem.moveTo(0, 0);
        heartGem.lineTo(-hs, -hs * 0.4);
        heartGem.arc(-hs * 0.5, -hs * 0.5, hs * 0.5, Math.PI, 0, false);
        heartGem.arc(hs * 0.5, -hs * 0.5, hs * 0.5, Math.PI, 0, false);
        heartGem.lineTo(hs, -hs * 0.4);
        heartGem.lineTo(0, 0);
        heartGem.fillPath();
        heartGem.strokePath();

        staffGroup.add(heartGem);
        container.add(staffGroup);
        enemyInstance.heart = heartGem;
        enemyInstance.staff = staffGroup;

        enemyInstance.legs.front = scene.add.container(4, 6);
        const legF = scene.add.graphics();
        legF.fillStyle(colors.bodyMain);
        legF.fillRoundedRect(-3, 0, 6, 14, 2);
        enemyInstance.legs.front.add(legF);
        container.add(enemyInstance.legs.front);

        enemyInstance.shouldRotate = false;
    },

    onUpdateAnimation: (time, enemyInstance) => {
        const speed = 0.007;
        const now = time;

        if (enemyInstance.legs.front) enemyInstance.legs.front.rotation = Math.sin(time * speed) * 0.5;
        if (enemyInstance.legs.back) enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * 0.5;

        if (enemyInstance.elements.body) {
            enemyInstance.elements.body.y = Math.sin(time * 0.004) * 2;
        }

        // --- ANIMATION DE L'AURA (Cercle pulsant doucement) ---
        if (enemyInstance.healArea) {
            // Pulsation lente de l'opacité pour indiquer que la zone est active
            enemyInstance.healArea.alpha = 0.6 + Math.sin(time * 0.003) * 0.2;
        }

        // Logique de soin
        if (enemyInstance.healInterval && now - (enemyInstance.lastHealTime || 0) > enemyInstance.healInterval) {
            let healed = false;
            enemyInstance.scene.enemies.getChildren().forEach(ally => {
                if (ally !== enemyInstance && ally.active && ally.hp < ally.maxHp) {
                    const dist = Phaser.Math.Distance.Between(enemyInstance.x, enemyInstance.y, ally.x, ally.y);
                    if (dist <= enemyInstance.healRadiusPixels) {
                        ally.hp = Math.min(ally.maxHp, ally.hp + enemyInstance.stats.healAmount);
                        ally.updateHealthBar();
                        healed = true;
                    }
                }
            });

            if (healed) {
                enemyInstance.lastHealTime = now;
                enemyInstance.scene.tweens.add({
                    targets: enemyInstance.heart,
                    scale: 1.5,
                    duration: 100,
                    yoyo: true
                });
            }
        }
    }
};