import { LEVELS_CONFIG } from "../levels/index.js";

// Fonction helper pour obtenir le chapitre depuis le levelID
function getChapterIdFromScene(scene) {
  if (scene?.levelID) {
    const level = LEVELS_CONFIG.find((lvl) => lvl.id === Number(scene.levelID));
    if (level) {
      return level.chapterId || 1;
    }
  }
  return 1; // Par défaut chapitre 1
}

export const barracks = {
  key: "barracks",
  name: "Caserne",
  cost: 200,
  range: 0, // Pas de portée de tir
  damage: 0, // Pas de dégâts directs
  rate: 0, // Pas de tir
  color: 0x8b4513, // Marron
  maxLevel: 3, // Sera ajusté dynamiquement selon le chapitre
  description: "Bâtiment qui produit des soldats pour bloquer les ennemis.\n\n✅ Avantages:\n• Soldats bloquent temporairement les ennemis\n• Les soldats se régénèrent automatiquement\n• Complémentaire aux tourelles\n• Peut être amélioré pour plus de soldats\n\n❌ Inconvénients:\n• Pas de dégâts directs\n• Les soldats peuvent mourir\n• Nécessite un placement stratégique",

  // Fonction pour obtenir les stats selon le chapitre
  getStatsForChapter(chapterId) {
    if (chapterId >= 2) {
      // Chapitre 2 et plus : stats améliorées
      return {
        maxLevel: 4,
        soldiersCount: [2, 3, 4, 4], // Niveau 4 garde 4 soldats
        respawnTime: [10000, 8000, 6000, 5500], // Respawn plus rapide
        soldierHp: [190, 240, 330, 410], // HP augmentés
      };
    } else {
      // Chapitre 1 : stats originales
      return {
        maxLevel: 3,
        soldiersCount: [2, 3, 4],
        respawnTime: [12000, 10000, 8000],
        soldierHp: [115, 170, 250],
      };
    }
  },

  // Nombre de soldats par niveau (par défaut chapitre 1)
  soldiersCount: [2, 3, 4],

  // Temps de respawn en millisecondes (par défaut chapitre 1)
  respawnTime: [12000, 10000, 8000],

  // Vie des soldats par niveau (par défaut chapitre 1)
  soldierHp: [115, 170, 250],

  // --- DESSIN ÉVOLUTIF (Bâtiment militaire) ---
  onDrawBarrel: (scene, container, color, turret) => {
    const g = scene.add.graphics();
    const level = turret.level || 1;

    // Palette de couleurs
    const woodBrown = 0x8b4513;
    const darkWood = 0x654321;
    const stoneGray = 0x696969;
    const darkStone = 0x404040;
    const metalGray = 0x708090;
    const flagRed = 0xcc0000;
    const flagBlue = 0x0000cc;

    if (level === 1) {
      // === NIVEAU 1 : Baraque Simple ===
      // Base en bois
      g.fillStyle(woodBrown);
      g.fillRect(-20, -20, 40, 40);
      g.lineStyle(2, darkWood);
      g.strokeRect(-20, -20, 40, 40);

      // Toit
      g.fillStyle(darkWood);
      g.fillTriangle(-22, -20, 0, -30, 22, -20);
      g.lineStyle(2, 0x000000);
      g.strokeTriangle(-22, -20, 0, -30, 22, -20);

      // Porte
      g.fillStyle(0x000000);
      g.fillRect(-6, 0, 12, 20);
      g.lineStyle(1, darkWood);
      g.strokeRect(-6, 0, 12, 20);

      // Fenêtre
      g.fillStyle(0xffffaa, 0.8);
      g.fillRect(-12, -12, 8, 8);
      g.fillRect(4, -12, 8, 8);
    } else if (level === 2) {
      // === NIVEAU 2 : Caserne Renforcée ===
      // Base en pierre
      g.fillStyle(stoneGray);
      g.fillRect(-24, -24, 48, 48);
      g.lineStyle(2, darkStone);
      g.strokeRect(-24, -24, 48, 48);

      // Toit plus imposant
      g.fillStyle(darkStone);
      g.fillTriangle(-26, -24, 0, -36, 26, -24);
      g.lineStyle(3, 0x000000);
      g.strokeTriangle(-26, -24, 0, -36, 26, -24);

      // Porte renforcée
      g.fillStyle(0x000000);
      g.fillRect(-8, 2, 16, 24);
      g.lineStyle(2, metalGray);
      g.strokeRect(-8, 2, 16, 24);

      // Fenêtres avec barreaux
      g.fillStyle(0xffffaa, 0.8);
      g.fillRect(-14, -14, 10, 10);
      g.fillRect(4, -14, 10, 10);
      g.lineStyle(1, 0x000000);
      g.strokeRect(-14, -14, 10, 10);
      g.strokeRect(4, -14, 10, 10);

      // Barreaux
      g.lineStyle(1, 0x000000);
      g.lineBetween(-14, -9, -4, -9);
      g.lineBetween(-9, -14, -9, -4);
      g.lineBetween(4, -9, 14, -9);
      g.lineBetween(9, -14, 9, -4);

      // Drapeau simple
      g.fillStyle(flagRed);
      g.fillRect(20, -30, 4, 12);
    } else if (level === 3) {
      // === NIVEAU 3 : Forteresse ===
      // Base massive en pierre
      g.fillStyle(stoneGray);
      g.fillRect(-28, -28, 56, 56);
      g.lineStyle(3, darkStone);
      g.strokeRect(-28, -28, 56, 56);

      // Détails de pierre
      g.lineStyle(1, darkStone);
      for (let i = -24; i < 24; i += 8) {
        g.lineBetween(i, -28, i, 28);
      }

      // Toit imposant avec créneaux
      g.fillStyle(darkStone);
      g.fillRect(-30, -40, 60, 12);
      g.fillStyle(0x000000);
      // Créneaux
      for (let i = -28; i < 28; i += 8) {
        g.fillRect(i, -40, 4, 4);
      }

      // Porte massive
      g.fillStyle(0x000000);
      g.fillRect(-10, 4, 20, 28);
      g.lineStyle(3, metalGray);
      g.strokeRect(-10, 4, 20, 28);
      // Clous
      g.fillStyle(metalGray);
      g.fillCircle(-5, 10, 2);
      g.fillCircle(5, 10, 2);
      g.fillCircle(-5, 20, 2);
      g.fillCircle(5, 20, 2);

      // Fenêtres avec barreaux
      g.fillStyle(0xffffaa, 0.8);
      g.fillRect(-16, -16, 12, 12);
      g.fillRect(4, -16, 12, 12);
      g.lineStyle(2, 0x000000);
      g.strokeRect(-16, -16, 12, 12);
      g.strokeRect(4, -16, 12, 12);

      // Barreaux épais
      g.lineStyle(2, 0x000000);
      g.lineBetween(-16, -11, -4, -11);
      g.lineBetween(-10, -16, -10, -4);
      g.lineBetween(4, -11, 16, -11);
      g.lineBetween(10, -16, 10, -4);

      // Drapeau avec mât
      g.fillStyle(0x654321);
      g.fillRect(24, -42, 3, 20);
      g.fillStyle(flagRed);
      g.fillRect(27, -40, 8, 6);
      g.fillStyle(flagBlue);
      g.fillRect(27, -34, 8, 6);

      // Tourelles latérales
      g.fillStyle(stoneGray);
      g.fillCircle(-26, -26, 6);
      g.fillCircle(26, -26, 6);
      g.lineStyle(2, darkStone);
      g.strokeCircle(-26, -26, 6);
      g.strokeCircle(26, -26, 6);
    } else {
      // === NIVEAU 4 : Citadelle Élite (Chapitre 2 uniquement) ===
      const eliteGold = 0xffd700;
      const elitePurple = 0x8b00ff;
      const eliteSilver = 0xc0c0c0;
      
      // Base massive en pierre avec renforts dorés
      g.fillStyle(stoneGray);
      g.fillRect(-32, -32, 64, 64);
      g.lineStyle(4, darkStone);
      g.strokeRect(-32, -32, 64, 64);
      
      // Renforts dorés aux coins
      g.fillStyle(eliteGold);
      g.fillRect(-32, -32, 8, 8);
      g.fillRect(24, -32, 8, 8);
      g.fillRect(-32, 24, 8, 8);
      g.fillRect(24, 24, 8, 8);
      g.lineStyle(2, 0xcc9900);
      g.strokeRect(-32, -32, 8, 8);
      g.strokeRect(24, -32, 8, 8);
      g.strokeRect(-32, 24, 8, 8);
      g.strokeRect(24, 24, 8, 8);

      // Détails de pierre avec motifs
      g.lineStyle(2, darkStone);
      for (let i = -28; i < 28; i += 8) {
        g.lineBetween(i, -32, i, 32);
      }
      // Lignes horizontales
      for (let i = -28; i < 28; i += 8) {
        g.lineBetween(-32, i, 32, i);
      }

      // Toit imposant avec créneaux dorés
      g.fillStyle(darkStone);
      g.fillRect(-34, -44, 68, 14);
      g.fillStyle(eliteGold);
      // Créneaux dorés
      for (let i = -30; i < 30; i += 8) {
        g.fillRect(i, -44, 4, 6);
        g.fillRect(i, -38, 4, 4);
      }
      g.lineStyle(2, 0xcc9900);
      g.strokeRect(-34, -44, 68, 14);

      // Porte massive avec décorations dorées
      g.fillStyle(0x000000);
      g.fillRect(-12, 6, 24, 32);
      g.lineStyle(4, eliteGold);
      g.strokeRect(-12, 6, 24, 32);
      // Clous dorés
      g.fillStyle(eliteGold);
      g.fillCircle(-6, 12, 2.5);
      g.fillCircle(6, 12, 2.5);
      g.fillCircle(-6, 22, 2.5);
      g.fillCircle(6, 22, 2.5);
      g.fillCircle(-6, 32, 2.5);
      g.fillCircle(6, 32, 2.5);
      // Motif central
      g.fillStyle(elitePurple, 0.6);
      g.fillRect(-8, 16, 16, 8);

      // Fenêtres avec barreaux et vitraux
      g.fillStyle(0xffffaa, 0.9);
      g.fillRect(-18, -18, 14, 14);
      g.fillRect(4, -18, 14, 14);
      g.lineStyle(3, eliteGold);
      g.strokeRect(-18, -18, 14, 14);
      g.strokeRect(4, -18, 14, 14);
      
      // Barreaux dorés épais
      g.lineStyle(3, eliteGold);
      g.lineBetween(-18, -13, -4, -13);
      g.lineBetween(-11, -18, -11, -4);
      g.lineBetween(4, -13, 18, -13);
      g.lineBetween(11, -18, 11, -4);

      // Drapeau avec mât doré et bannière élite
      g.fillStyle(eliteGold);
      g.fillRect(28, -46, 4, 24);
      g.lineStyle(2, 0xcc9900);
      g.strokeRect(28, -46, 4, 24);
      
      // Bannière élite (dorée et violette)
      g.fillStyle(eliteGold);
      g.fillRect(32, -44, 10, 8);
      g.fillStyle(elitePurple);
      g.fillRect(32, -36, 10, 8);
      g.fillStyle(eliteGold);
      g.fillRect(32, -28, 10, 8);
      g.lineStyle(2, 0x000000);
      g.strokeRect(32, -44, 10, 24);

      // Tourelles latérales améliorées avec ornements
      g.fillStyle(stoneGray);
      g.fillCircle(-30, -30, 8);
      g.fillCircle(30, -30, 8);
      g.lineStyle(3, eliteGold);
      g.strokeCircle(-30, -30, 8);
      g.strokeCircle(30, -30, 8);
      
      // Ornements dorés sur les tourelles
      g.fillStyle(eliteGold);
      g.fillCircle(-30, -30, 3);
      g.fillCircle(30, -30, 3);
      
      // Éclairs magiques (effet spécial chapitre 2)
      g.lineStyle(2, elitePurple, 0.7);
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const startX = Math.cos(angle) * 20;
        const startY = Math.sin(angle) * 20;
        const endX = Math.cos(angle) * 28;
        const endY = Math.sin(angle) * 28;
        g.lineBetween(startX, startY, endX, endY);
      }
    }

    // Pivot central
    g.fillStyle(0x000000);
    g.fillCircle(0, 0, 3);

    container.add(g);

    // --- INDICATEUR DE NIVEAU ---
    const badge = scene.add.container(-20, 20);
    const badgeBg = scene.add.rectangle(0, 0, 24, 14, 0x000000, 0.7);
    const badgeColor =
      level === 4 ? 0xffd700 : level === 3 ? 0xffd700 : level === 2 ? 0x00ffff : 0xffffff;
    badgeBg.setStrokeStyle(level === 4 ? 2 : 1, badgeColor);
    const lvlText = scene.add
      .text(0, 0, `Lv.${level}`, {
        fontSize: level === 4 ? "11px" : "10px",
        fontFamily: "Arial",
        color: level === 4 ? "#ffd700" : level === 3 ? "#ffd700" : level === 2 ? "#00ffff" : "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    badge.add([badgeBg, lvlText]);
    container.add(badge);
  },

  // --- LOGIQUE SPÉCIALE : Pas de tir, mais gestion des soldats ---
  onFire: null, // Pas de tir

  // Fonction appelée lors de la création du bâtiment
  onBuild: (scene, barracks) => {
    // Cette fonction sera appelée depuis GameScene après la création
    // Les soldats seront créés et déployés automatiquement
  },
};
