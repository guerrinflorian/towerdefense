import { 
  getHeroStats, 
  getHeroPointsAvailable, 
  getHeroPointConversion, 
  upgradeHero, 
  isAuthenticated 
} from "../../services/authManager.js";
import { showAuth } from "../../services/authOverlay.js";

export class HeroUpgradeUI extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    
    // --- Configuration du Design ---
    this.config = {
      width: 380,           // Élargi pour éviter les chevauchements
      height: 300,
      padding: 20,
      accentColor: 0x00eaff,
      bgColor: 0x050a10,
      rowHeight: 55,
      avatarSize: 80
    };

    this.statElements = new Map(); // Pour stocker les références proprement
    
    this.setupMainPanel();
    this.refresh();
    
    this.scene.add.existing(this);
    this.setDepth(180);
  }

  setupMainPanel() {
    const { width, height, padding, accentColor, bgColor } = this.config;

    // 1. Fond avec bordure néon et dégradé
    const bg = this.scene.add.graphics();
    bg.fillStyle(bgColor, 0.9);
    bg.lineStyle(2, accentColor, 1);
    bg.fillRoundedRect(0, 0, width, height, 15);
    bg.strokeRoundedRect(0, 0, width, height, 15);
    
    // Petite barre décorative en haut
    bg.lineStyle(4, accentColor, 0.5);
    bg.lineBetween(width * 0.3, 0, width * 0.7, 0);
    this.add(bg);

    // 2. Titre stylisé
    const title = this.scene.add.text(width / 2, -15, " SYSTÈME HÉROS ", {
      fontFamily: "Impact, sans-serif",
      fontSize: "24px",
      color: "#ffffff",
      backgroundColor: "#050a10",
      padding: { x: 10, y: 2 }
    }).setOrigin(0.5);
    this.add(title);

    // 3. Section Avatar (à gauche)
    this.createAvatar(padding, 40);

    // 4. Section Stats (à droite de l'avatar)
    const statsData = [
      { key: "hp", label: "INTÉGRITÉ (PV)", color: 0x4caf50 },
      { key: "damage", label: "PUISSANCE", color: 0xff4d4d },
      { key: "move_speed", label: "AGILITÉ", color: 0x00eaff }
    ];

    const statsStartX = padding + this.config.avatarSize + 25; // Espace après l'avatar
    statsData.forEach((stat, idx) => {
      this.createStatRow(stat, statsStartX, 60 + (idx * this.config.rowHeight));
    });

    // 5. Footer (Points & Coût)
    this.pointsText = this.scene.add.text(width / 2, height - 50, "", {
      fontSize: "16px",
      fontFamily: "Orbitron, sans-serif",
      color: "#7dd0ff",
      fontWeight: "bold"
    }).setOrigin(0.5);

    this.costText = this.scene.add.text(width / 2, height - 25, "", {
      fontSize: "11px",
      fontFamily: "Arial",
      color: "#aaaaaa"
    }).setOrigin(0.5);

    this.add([this.pointsText, this.costText]);
  }

  createAvatar(x, y) {
    const size = this.config.avatarSize;
    const container = this.scene.add.container(x, y);
    
    const frame = this.scene.add.graphics();
    // Ombre/Glow de l'avatar
    frame.lineStyle(2, this.config.accentColor, 0.5);
    frame.strokeRect(-2, -2, size + 4, size + 4);
    
    // Fond de l'avatar
    frame.fillStyle(0x1a2a3a, 1);
    frame.fillRect(0, 0, size, size);
    
    // Dessiner le héros comme dans Hero.js (version réduite)
    const scale = size / 50; // Facteur d'échelle pour adapter au format avatar
    const centerX = size / 2;
    const centerY = size / 2;
    
    // Ombre au sol
    frame.fillStyle(0x000000, 0.18);
    frame.fillEllipse(centerX, centerY + 18 * scale, 26 * scale, 10 * scale);
    
    // Cape
    frame.fillStyle(0x151526, 0.92);
    frame.fillEllipse(centerX - 2 * scale, centerY + 8 * scale, 22 * scale, 30 * scale);
    frame.fillStyle(0x0d0d18, 0.35);
    frame.fillEllipse(centerX - 6 * scale, centerY + 10 * scale, 14 * scale, 24 * scale);
    
    // Armure (corps)
    frame.fillStyle(0x505050, 1);
    frame.fillRoundedRect(centerX - 12 * scale, centerY - 18 * scale, 24 * scale, 34 * scale, 7 * scale);
    frame.lineStyle(2 * scale, 0x242424, 1);
    frame.strokeRoundedRect(centerX - 12 * scale, centerY - 18 * scale, 24 * scale, 34 * scale, 7 * scale);
    
    // Plastron
    frame.lineStyle(2 * scale, 0x6a6a6a, 0.6);
    frame.beginPath();
    frame.moveTo(centerX, centerY - 16 * scale);
    frame.lineTo(centerX, centerY + 10 * scale);
    frame.strokePath();
    
    // Épaulières
    frame.fillStyle(0x7a7a7a, 1);
    frame.fillCircle(centerX - 11 * scale, centerY - 12 * scale, 7 * scale);
    frame.fillCircle(centerX + 11 * scale, centerY - 12 * scale, 7 * scale);
    frame.lineStyle(2 * scale, 0x2a2a2a, 0.9);
    frame.strokeCircle(centerX - 11 * scale, centerY - 12 * scale, 7 * scale);
    frame.strokeCircle(centerX + 11 * scale, centerY - 12 * scale, 7 * scale);
    
    // Ceinture
    frame.fillStyle(0x8b5a2b, 1);
    frame.fillRoundedRect(centerX - 12 * scale, centerY + 6 * scale, 24 * scale, 5 * scale, 2 * scale);
    frame.fillStyle(0xd2b48c, 0.9);
    frame.fillRect(centerX - 2 * scale, centerY + 6 * scale, 4 * scale, 5 * scale);
    
    // Tête (comme dans Hero.js)
    frame.fillStyle(0xffd4a3, 1);
    frame.fillCircle(centerX, centerY - 24 * scale, 8 * scale);
    
    // Casque / cheveux
    frame.fillStyle(0x2b2b2b, 1);
    frame.fillRoundedRect(centerX - 10 * scale, centerY - 33 * scale, 20 * scale, 8 * scale, 3 * scale);
    
    // Yeux (regard)
    frame.fillStyle(0x111111, 0.9);
    frame.fillCircle(centerX - 3.2 * scale, centerY - 24 * scale, 1.1 * scale);
    frame.fillCircle(centerX + 3.2 * scale, centerY - 24 * scale, 1.1 * scale);

    // Épée (comme dans Hero.js) - utiliser un container pour la rotation
    const swordPivotX = centerX + 12 * scale;
    const swordPivotY = centerY - 4 * scale;
    const swordPivot = this.scene.add.container(swordPivotX, swordPivotY);
    swordPivot.setRotation(-0.3);
    
    const sword = this.scene.add.graphics();
    
    // Lame (avec petit highlight)
    sword.fillStyle(0xd6d6d6, 1);
    sword.fillRoundedRect(0, -2 * scale, 22 * scale, 5 * scale, 2 * scale);
    sword.fillStyle(0xffffff, 0.75);
    sword.fillRoundedRect(0, -2 * scale, 22 * scale, 2.2 * scale, 2 * scale);
    
    // Pointe
    sword.fillStyle(0xcfcfcf, 1);
    sword.fillTriangle(22 * scale, -2 * scale, 28 * scale, 0.5 * scale, 22 * scale, 3 * scale);
    
    // Garde
    sword.fillStyle(0x6b3d18, 1);
    sword.fillRoundedRect(-4 * scale, -4.2 * scale, 6 * scale, 9 * scale, 2 * scale);
    
    // Poignée
    sword.fillStyle(0x8b4513, 1);
    sword.fillRoundedRect(-8 * scale, -2.5 * scale, 5 * scale, 6 * scale, 2 * scale);
    sword.fillStyle(0x3b2210, 0.55);
    sword.fillRect(-7.2 * scale, -2.2 * scale, 3.5 * scale, 0.8 * scale);
    sword.fillRect(-7.2 * scale, -0.6 * scale, 3.5 * scale, 0.8 * scale);
    sword.fillRect(-7.2 * scale, 1.0 * scale, 3.5 * scale, 0.8 * scale);
    
    // Pommeau
    sword.fillStyle(0xbdbdbd, 1);
    sword.fillCircle(-9.2 * scale, 0.5 * scale, 2.2 * scale);
    
    swordPivot.add(sword);
    container.add(swordPivot);

    container.add(frame);
    this.add(container);
    
    // Afficher les kills en dessous de l'avatar
    this.killsText = this.scene.add.text(x + size / 2, y + size + 15, "", {
      fontSize: "14px",
      fontFamily: "Arial",
      color: "#ff6b6b",
      fontWeight: "bold"
    }).setOrigin(0.5);
    this.add(this.killsText);
  }

  createStatRow(stat, x, y) {
    const barWidth = 180;
    
    // Label de la stat
    const label = this.scene.add.text(x, y - 20, stat.label, {
      fontSize: "11px",
      fontWeight: "bold",
      color: "#ffffff",
      letterSpacing: 1
    });

    // Valeur numérique
    const valText = this.scene.add.text(x + barWidth, y - 20, "0", {
      fontSize: "12px",
      color: "#00eaff"
    }).setOrigin(1, 0);

    // Texte de conversion (ex: "+0.4 par point")
    const conversionText = this.scene.add.text(x, y + 15, "", {
      fontSize: "9px",
      color: "#7dd0ff",
      fontStyle: "italic"
    });

    // Fond de la barre (vaisseau)
    const barBg = this.scene.add.graphics();
    barBg.fillStyle(0xffffff, 0.1);
    barBg.fillRoundedRect(x, y, barWidth, 10, 5);

    // Barre de progression (le remplissage)
    const barFill = this.scene.add.graphics();
    
    // Bouton "+" stylisé
    const btn = this.scene.add.container(x + barWidth + 25, y + 5);
    const btnBg = this.scene.add.circle(0, 0, 12, 0x00eaff, 0.2).setStrokeStyle(1, 0x00eaff);
    const btnPlus = this.scene.add.text(0, 0, "+", { fontSize: "18px", color: "#00eaff" }).setOrigin(0.5);
    btn.add([btnBg, btnPlus]);
    btn.setSize(24, 24).setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => {
      if (btn.input.enabled) {
        btnBg.setFillStyle(0x00eaff, 0.5);
      }
    });
    btn.on("pointerout", () => {
      if (btn.input.enabled) {
        btnBg.setFillStyle(0x00eaff, 0.2);
      }
    });
    btn.on("pointerdown", () => {
      if (btn.input.enabled) {
        this.handleUpgrade(stat.key);
      }
    });

    this.statElements.set(stat.key, { label, valText, barFill, conversionText, color: stat.color, x, y, barWidth, btn, btnBg, btnPlus });
    this.add([label, valText, conversionText, barBg, barFill, btn]);
  }

  async handleUpgrade(key) {
    if (!isAuthenticated()) return showAuth();
    try {
      this.scene.cameras.main.shake(100, 0.002); // Petit feedback visuel
      await upgradeHero(key, 1);
      this.refresh();
    } catch (err) {
      console.error("Échec upgrade:", err);
    }
  }

  refresh() {
    const stats = getHeroStats();
    const available = getHeroPointsAvailable();
    const conversion = getHeroPointConversion();

    if (!stats) {
      this.pointsText.setText("SYNCHRONISATION REQUISE");
      return;
    }

    const values = { 
      hp: Number(stats.max_hp) || 0, 
      damage: parseFloat(stats.base_damage) || 0, // Parser pour gérer les chaînes "25.00"
      move_speed: Number(stats.move_speed) || 0 
    };

    // Mapping des clés vers les noms de conversion
    const conversionMap = {
      hp: "hp_per_point",
      damage: "damage_per_point",
      move_speed: "move_speed_per_point"
    };

    // Mise à jour des barres avec animation
    this.statElements.forEach((el, key) => {
      const val = values[key];
      // Formater les dégâts avec 2 décimales si c'est une valeur décimale
      const displayVal = key === "damage" && val % 1 !== 0 
        ? val.toFixed(2) 
        : Math.round(val).toString();
      el.valText.setText(displayVal);

      // Afficher la conversion pour chaque stat
      const conversionKey = conversionMap[key];
      const conversionValue = conversion?.[conversionKey];
      if (conversionValue !== undefined && el.conversionText) {
        const formattedValue = parseFloat(conversionValue).toFixed(2);
        el.conversionText.setText(`+${formattedValue} par point`);
      }

      // Calcul du pourcentage (ex: max 500 pour le visuel)
      const targetScale = Phaser.Math.Clamp(val / 500, 0.1, 1);
      
      // Animation fluide de la barre
      this.scene.tweens.addCounter({
        from: el.barFill.scaleX || 0,
        to: targetScale,
        duration: 600,
        ease: 'Cubic.out',
        onUpdate: (tween) => {
          el.barFill.clear();
          el.barFill.fillStyle(el.color, 1);
          el.barFill.fillRoundedRect(el.x, el.y, el.barWidth * tween.getValue(), 10, 5);
        }
      });

      // Activer/désactiver le bouton selon les points disponibles
      if (el.btn && el.btnBg && el.btnPlus) {
        if (available > 0) {
          // Activer le bouton
          el.btn.setInteractive({ useHandCursor: true });
          el.btn.setAlpha(1);
          el.btnBg.setFillStyle(0x00eaff, 0.2);
          el.btnBg.setStrokeStyle(1, 0x00eaff);
          el.btnPlus.setColor("#00eaff");
        } else {
          // Désactiver le bouton
          el.btn.disableInteractive();
          el.btn.setAlpha(0.4);
          el.btnBg.setFillStyle(0x666666, 0.2);
          el.btnBg.setStrokeStyle(1, 0x666666);
          el.btnPlus.setColor("#666666");
        }
      }
    });

    this.pointsText.setText(`POINTS DISPONIBLES : ${available}`);
    this.costText.setText(`1 point améliore chaque stat selon sa conversion`);
    
    // Afficher les kills avec icône de tête de mort
    if (this.killsText) {
      const kills = Number(stats.kills) || 0;
      this.killsText.setText(`💀 ${kills.toLocaleString()} kills`);
    }
  }
}