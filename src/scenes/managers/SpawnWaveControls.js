import { CONFIG, ENEMIES } from "../../config/settings.js";

export class SpawnWaveControls {
  constructor(scene) {
    this.scene = scene;
    this.icons = [];
    this.tooltip = null;
    this.isLocked = false;
  }

  create() {
    this.destroy();
    const spawnTiles = this.getSpawnTiles();
    spawnTiles.forEach((spawn, index) => {
      this.icons.push(this.createIcon(spawn, index + 1));
    });
  }

  destroy() {
    this.hideWavePreview();
    this.icons.forEach(icon => icon.container.destroy());
    this.icons = [];
  }

  getSpawnTiles() {
    const paths = this.scene.levelConfig?.paths || 
                 (this.scene.levelConfig?.path ? [this.scene.levelConfig.path] : []);
    const unique = new Map();

    paths.forEach(points => {
      if (!points?.length) return;
      const start = points[0];
      const key = `${start.x},${start.y}`;
      if (!unique.has(key)) {
        const next = points[1] || start;
        const angle = Math.atan2(next.y - start.y, next.x - start.x);
        unique.set(key, { tileX: start.x, tileY: start.y, angle });
      }
    });
    return Array.from(unique.values());
  }

  createIcon(spawn, index) {
    const s = this.scene.scaleFactor;
    const T = CONFIG.TILE_SIZE * s;
    // Positionnement au centre de la tuile
    const px = this.scene.mapStartX + spawn.tileX * T + T / 2;
    const py = this.scene.mapStartY + spawn.tileY * T + T / 2;
    
    // Taille réduite (environ 35px au lieu de 45-50px)
    const size = Math.max(32 * s, T * 0.35);

    // Profondeur très élevée pour être au-dessus de TOUT (les tuiles sont à depth 0, UI à 200-300)
    const container = this.scene.add.container(px, py).setDepth(2000);
    
    // Cercle de fond style Cyber
    const bg = this.scene.add.circle(0, 0, size, 0x0b0b12, 0.9);
    bg.setStrokeStyle(2 * s, 0x00ffc2, 1);

    // Flèche / Triangle (Pointe vers la droite par défaut)
    const arrow = this.scene.add.graphics();
    this.drawArrow(arrow, 0x00ffc2, size * 0.55);
    arrow.setRotation(spawn.angle);

    // Petit badge avec le numéro du chemin
    const badge = this.scene.add.container(-size * 0.75, -size * 0.75);
    const badgeBg = this.scene.add.circle(0, 0, size * 0.35, 0x00ffc2);
    const badgeText = this.scene.add.text(0, 0, index, {
      fontSize: `${11 * s}px`, color: "#000", fontStyle: "bold"
    }).setOrigin(0.5);
    badge.add([badgeBg, badgeText]);

    // Texte Countdown sous l'icône
    const countdownText = this.scene.add.text(0, size + (12 * s), "", {
      fontSize: `${13 * s}px`, color: "#00ffc2", fontStyle: "bold",
      stroke: "#000", strokeThickness: 2
    }).setOrigin(0.5);

    container.add([bg, arrow, badge, countdownText]);

    // Zone d'interaction - utiliser un rectangle qui couvre tout le cercle
    // Le cercle a un rayon de 'size', on crée un rectangle carré qui le couvre complètement
    const hitSize = size * 2.2; // Assez grand pour couvrir tout le cercle et plus
    
    // Définir la taille du container (utilisé par setInteractive sans paramètres)
    container.setSize(hitSize, hitSize);
    
    // Utiliser setInteractive sans paramètres pour utiliser la zone définie par setSize
    // Cela garantit que la zone est bien centrée sur le container
    container.setInteractive();
    
    if (container.input) {
      container.input.cursor = "pointer";
      // S'assurer que seul l'objet le plus haut reçoit les événements
      // (topOnly est déjà true par défaut dans Phaser 3)
    }
    
    // Forcer le container au-dessus de tous les autres objets
    container.bringToTop();
    
    // EVENTS
    container.on("pointerover", () => {
      if (this.scene.isWaveRunning) return;
      container.setScale(1.1);
      this.drawArrow(arrow, 0xffffff, size * 0.6);
      this.showWavePreview(container);
    });

    container.on("pointermove", () => {
      // Le gestionnaire InputManager vérifie déjà si on est sur un bouton
      // Pas besoin de stopPropagation (n'existe pas dans Phaser)
    });

    container.on("pointerout", () => {
      container.setScale(1.0);
      this.drawArrow(arrow, 0x00ffc2, size * 0.55);
      this.hideWavePreview();
    });

    container.on("pointerdown", () => {
      if (this.isLocked || this.scene.isWaveRunning) return;
      this.scene.startWave();
      this.hideWavePreview();
    });

    return { container, bg, arrow, countdownText, size };
  }

  drawArrow(graphics, color, sz) {
    graphics.clear();
    graphics.fillStyle(color, 1);
    // Triangle pointant vers la droite (0°)
    const points = [
      { x: -sz * 0.4, y: -sz * 0.5 },
      { x: -sz * 0.4, y: sz * 0.5 },
      { x: sz * 0.6, y: 0 }
    ];
    graphics.fillPoints(points, true);
  }

  showWavePreview(anchor) {
    this.hideWavePreview();
    const summary = this.scene.waveManager.getNextWaveSummary();
    if (!summary || summary.length === 0) return;

    const s = this.scene.scaleFactor;
    const rowHeight = 55 * s; 
    const width = 180 * s;
    const height = summary.length * rowHeight + 15 * s;

    // Obtenir les coordonnées mondiales du container (centre de l'icône)
    let iconWorldX, iconWorldY;
    if (anchor.getWorldTransformMatrix) {
      const matrix = anchor.getWorldTransformMatrix();
      iconWorldX = matrix.tx;
      iconWorldY = matrix.ty;
    } else {
      // Fallback si getWorldTransformMatrix n'existe pas
      iconWorldX = anchor.x;
      iconWorldY = anchor.y;
    }

    // Calculer la position Y du tooltip (au-dessus de l'icône)
    let targetY = iconWorldY - height/2 - 50 * s;
    
    // S'assurer que le tooltip ne dépasse pas le haut de l'écran
    const minY = height/2 + 10 * s;
    if (targetY < minY) {
      // Si trop haut, placer le tooltip en dessous de l'icône
      targetY = iconWorldY + height/2 + 50 * s;
    }
    
    // S'assurer que le tooltip ne dépasse pas le bas de l'écran
    const maxY = (this.scene.gameHeight || this.scene.cameras.main.height) - height/2 - 10 * s;
    if (targetY > maxY) {
      targetY = maxY;
    }
    
    // Clamp la position X pour rester dans l'écran (centré sur l'icône)
    const targetX = Phaser.Math.Clamp(
      iconWorldX,
      width/2 + 10 * s,
      (this.scene.gameWidth || this.scene.cameras.main.width) - width/2 - 10 * s
    );

    this.tooltip = this.scene.add.container(targetX, targetY).setDepth(1000);
    
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x0c0c15, 0.95);
    bg.lineStyle(2 * s, 0x00ffc2, 1);
    bg.fillRoundedRect(-width/2, -height/2, width, height, 10);
    bg.strokeRoundedRect(-width/2, -height/2, width, height, 10);
    this.tooltip.add(bg);

    summary.forEach((item, idx) => {
      const y = -height/2 + (idx * rowHeight) + rowHeight/2;
      const preview = this.createEnemyPreview(item.type);
      preview.setPosition(-width/2 + 35 * s, y);
      
      const txt = this.scene.add.text(-width/2 + 75 * s, y, `x${item.count}`, {
        fontSize: `${20 * s}px`, color: "#ffffff", fontStyle: "bold"
      }).setOrigin(0, 0.5);
      
      this.tooltip.add([preview, txt]);
    });
  }

  createEnemyPreview(typeKey) {
    const container = this.scene.add.container(0, 0);
    const s = this.scene.scaleFactor;
    const enemyDef = ENEMIES[typeKey];

    const circle = this.scene.add.circle(0, 0, 22 * s, 0x1a1a2e).setStrokeStyle(1, 0x00ffc2, 0.5);
    container.add(circle);

    if (enemyDef?.onDraw) {
      const iconG = this.scene.add.container(0, 0);
      enemyDef.onDraw(this.scene, iconG, enemyDef.color || 0xffffff, { shouldRotate: false });
      iconG.setScale(0.85 * s); // Ennemis bien visibles
      container.add(iconG);
    }
    return container;
  }

  hideWavePreview() {
    if (this.tooltip) {
      this.tooltip.destroy(true);
      this.tooltip = null;
    }
  }

  setLockedState(isLocked) {
    this.isLocked = isLocked;
    this.updateWaveRunningState();
  }

  updateWaveRunningState() {
    const isRunning = this.scene.isWaveRunning;
    this.icons.forEach(icon => {
      if (isRunning) {
        icon.container.setAlpha(0.05); // Presque invisible pendant la vague
        icon.container.disableInteractive();
        icon.countdownText.setText("");
      } else {
        icon.container.setAlpha(this.isLocked ? 0.5 : 1);
        if (!this.isLocked) {
          const hitSize = icon.size * 2.2; // Même zone d'interaction qu'à la création
          icon.container.setSize(hitSize, hitSize);
          // Utiliser setInteractive sans paramètres pour utiliser la zone définie par setSize
          icon.container.setInteractive();
          if (icon.container.input) {
            icon.container.input.cursor = "pointer";
          }
        } else {
          icon.container.disableInteractive();
        }
      }
    });
  }

  clearCountdown() {
    this.icons.forEach(icon => {
      icon.countdownText.setText("");
    });
  }

  showCountdown(seconds) {
    if (this.scene.isWaveRunning) return;
    this.icons.forEach(icon => {
      if (seconds > 0) {
        icon.countdownText.setText(`${seconds}s`);
        // Alerte visuelle quand il reste peu de temps
        icon.countdownText.setColor(seconds <= 5 ? "#ff3333" : "#00ffc2");
      } else {
        icon.countdownText.setText("");
      }
    });
  }
}