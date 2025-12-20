export const tortue_dragon = {
    name: "Tortue-Dragon",
    speed: 35,
    hp: 2800,
    reward: 200,
    playerDamage: 4,
    color: 0x4a5d23,
    damage: 25,
    attackSpeed: 1000,
    scale: 1.1,
    
    // Paramètres lus par la classe Enemy.js
    shellThreshold: 0.3, 
    shellDuration: 4000, 

    onDraw: (scene, container, color, enemyInstance) => {
        enemyInstance.legs = {};
        enemyInstance.isInShell = false; // Initialisation
        
        // --- GROUPE NORMAL ---
        const normalGroup = scene.add.container(0, 0);
        
        const legBack = scene.add.graphics().fillStyle(0x3a4d13);
        legBack.fillRoundedRect(-4, 0, 8, 18, 3).fillRoundedRect(-5, 15, 12, 6, 2);
        const lbC = scene.add.container(-10, 5).add(legBack);
        normalGroup.add(lbC);
        enemyInstance.legs.back = lbC;

        const legFront = scene.add.graphics().fillStyle(0x3a4d13);
        legFront.fillRoundedRect(-4, 0, 8, 18, 3).fillRoundedRect(-5, 15, 12, 6, 2);
        const lfC = scene.add.container(12, 5).add(legFront);
        normalGroup.add(lfC);
        enemyInstance.legs.front = lfC;

        const tail = scene.add.graphics().fillStyle(color).fillTriangle(-20, 0, -35, -5, -35, 5);
        normalGroup.add(tail);

        const body = scene.add.graphics();
        body.fillStyle(color).fillEllipse(0, -5, 42, 32);
        body.lineStyle(3, 0x2a3d13).strokeEllipse(0, -5, 42, 32);
        normalGroup.add(body);

        const head = scene.add.graphics().fillStyle(0x5a6d33);
        head.fillRoundedRect(15, -15, 20, 14, 5);
        head.fillStyle(0xff0000).fillCircle(28, -11, 2); // Oeil
        normalGroup.add(head);

        container.add(normalGroup);
        enemyInstance.normalGroup = normalGroup;

        // --- GROUPE CARAPACE ---
        const shellGroup = scene.add.container(0, 0);
        const shellGraphic = scene.add.graphics();
        shellGraphic.fillStyle(0x3a4d13).fillEllipse(0, 0, 46, 36);
        shellGraphic.lineStyle(4, 0x1a2d03).strokeEllipse(0, 0, 46, 36);
        // Pics
        shellGraphic.fillStyle(0x1a2d03);
        shellGraphic.fillTriangle(-15, -10, -15, -20, -5, -12);
        shellGraphic.fillTriangle(0, -15, 0, -25, 10, -15);
        shellGraphic.fillTriangle(15, -10, 15, -20, 25, -12);

        shellGroup.add(shellGraphic);
        shellGroup.visible = false; 
        container.add(shellGroup);
        enemyInstance.shellGroup = shellGroup;

        enemyInstance.shouldRotate = false;
    },

    onUpdateAnimation: (time, enemyInstance) => {
        // On synchronise le visuel sur le flag de la classe
        const hidden = enemyInstance.isInShell;

        if (hidden) {
            enemyInstance.normalGroup.visible = false;
            enemyInstance.shellGroup.visible = true;
            
            // Animation : Tremblement
            enemyInstance.shellGroup.x = Math.sin(time * 0.05) * 1.5;
            enemyInstance.shellGroup.rotation = Math.sin(time * 0.02) * 0.05;
        } else {
            enemyInstance.normalGroup.visible = true;
            enemyInstance.shellGroup.visible = false;
            enemyInstance.shellGroup.x = 0;
            enemyInstance.shellGroup.rotation = 0;

            // Marche normale
            const speed = 0.006;
            const range = 0.5;
            if (enemyInstance.legs.front) enemyInstance.legs.front.rotation = Math.sin(time * speed) * range;
            if (enemyInstance.legs.back) enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * range;
            enemyInstance.normalGroup.y = Math.sin(time * speed * 2) * 1;
        }
    },
};