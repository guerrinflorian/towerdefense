import { CONFIG } from "../../config/settings.js";
import { TURRETS } from "../../config/turrets/index.js";
import { Barracks } from "../../objects/Barracks.js";

export class UIManager {
  constructor(scene) {
    this.scene = scene;
    this.currentTooltip = null; // Tooltip actuellement affiché

    // Text lines (upgrade menu)
    this.scene.upgradeTextLines = [];

    // Build buttons cache (for easy refresh affordability)
    this.buildButtons = [];
  }

  // ------------------------------------------------------------
  // UI ROOT
  // ------------------------------------------------------------
  createUI() {
    const s = this.scene.scaleFactor;

    const UI_HEIGHT = CONFIG.UI_HEIGHT * s;
    const fontSize = Math.max(16, 24 * s);
    const smallFontSize = Math.max(12, 18 * s);

    // Top bar
    const topBar = this.scene.add.container(0, 0).setDepth(100);

    const bgBar = this.scene.add.graphics();
    bgBar.fillStyle(0x111111, 1);
    bgBar.fillRect(0, 0, this.scene.gameWidth, UI_HEIGHT);
    bgBar.fillStyle(0x00ccff, 0.5);
    bgBar.fillRect(0, UI_HEIGHT - 2 * s, this.scene.gameWidth, 2 * s);
    topBar.add(bgBar);

    this.scene.txtMoney = this.scene.add
      .text(20 * s, UI_HEIGHT / 2, "", {
        fontSize: `${fontSize}px`,
        fill: "#ffd700",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0, 0.5);
    topBar.add(this.scene.txtMoney);

    this.scene.txtLives = this.scene.add
      .text(250 * s, UI_HEIGHT / 2, "", {
        fontSize: `${fontSize}px`,
        fill: "#ff4444",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0, 0.5);
    topBar.add(this.scene.txtLives);

    // Affichage de la vague actuelle
    this.scene.txtWave = this.scene.add
      .text(350 * s, UI_HEIGHT / 2, "", {
        fontSize: `${fontSize}px`,
        fill: "#00ccff",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0, 0.5);
    topBar.add(this.scene.txtWave);

    // Bouton Pause/Reprendre (plus à droite pour ne pas écraser la vague)
    this.scene.pauseBtn = this.scene.add
      .text(600 * s, UI_HEIGHT / 2, "⏸️ PAUSE", {
        fontSize: `${smallFontSize}px`,
        fill: "#ffaa00",
        backgroundColor: "#333333",
        padding: { x: 10 * s, y: 5 * s },
        fontFamily: "Arial",
      })
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        if (!this.scene.isPaused) {
          this.scene.pauseBtn.setColor("#ffcc00");
        }
      })
      .on("pointerout", () => {
        if (!this.scene.isPaused) {
          this.scene.pauseBtn.setColor("#ffaa00");
        }
      })
      .on("pointerdown", () => {
        // Le bouton pause dans la toolbar met toujours en pause
        if (!this.scene.isPaused) {
          this.scene.pauseGame();
        }
        // Pour reprendre, on utilise le bouton au centre de l'écran
      });
    topBar.add(this.scene.pauseBtn);

    const quitBtn = this.scene.add
      .text(this.scene.gameWidth - 20 * s, UI_HEIGHT / 2, "QUITTER", {
        fontSize: `${smallFontSize}px`,
        fill: "#aaaaaa",
        backgroundColor: "#333333",
        padding: { x: 10 * s, y: 5 * s },
        fontFamily: "Arial",
      })
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => quitBtn.setColor("#ffffff"))
      .on("pointerout", () => quitBtn.setColor("#aaaaaa"))
      .on("pointerdown", () => this.scene.scene.start("MainMenuScene"));
    topBar.add(quitBtn);

    this.scene.updateUI();

    // Wave button - Positionné à droite, au même niveau que la toolbar
    const btnWidth = 300 * s;
    const btnHeight = 60 * s;
    const toolbarHeight = 120 * s;
    const margin = 20 * s;
    
    // Calculer la position pour être aligné avec les autres sections
    const itemSize = 80 * s;
    const itemSpacing = 90 * s;
    const spellSectionWidth = itemSize + margin * 2;
    const turretsSectionWidth = 5 * itemSpacing;
    const totalWidth = spellSectionWidth + turretsSectionWidth + btnWidth + margin * 4;
    const startX = (this.scene.gameWidth - totalWidth) / 2;
    
    // Positionner à droite, aligné avec les autres sections
    const waveSectionX = startX + spellSectionWidth + turretsSectionWidth + margin * 3;
    const wy = this.scene.toolbarOffsetY + toolbarHeight / 2; // Centré verticalement dans la toolbar

    // Section du bouton de vague avec fond
    this.scene.waveSection = this.scene.add.container(waveSectionX, this.scene.toolbarOffsetY).setDepth(150);
    const waveSectionBg = this.scene.add.graphics();
    waveSectionBg.fillStyle(0x000000, 0.9);
    waveSectionBg.fillRoundedRect(0, 0, btnWidth + margin * 2, toolbarHeight, 10);
    waveSectionBg.lineStyle(3, 0xffffff, 0.6);
    waveSectionBg.strokeRoundedRect(0, 0, btnWidth + margin * 2, toolbarHeight, 10);
    this.scene.waveSection.add(waveSectionBg);

    this.scene.waveBtnContainer = this.scene.add
      .container(margin + btnWidth / 2, toolbarHeight / 2)
      .setDepth(151);

    this.scene.waveBtnBg = this.scene.add
      .rectangle(0, 0, btnWidth, btnHeight, 0x000000, 0.8)
      .setStrokeStyle(3 * s, 0x00ff00);

    this.scene.waveBtnText = this.scene.add
      .text(0, 0, "▶ LANCER VAGUE 1", {
        fontSize: `${Math.max(16, 22 * s)}px`,
        fill: "#ffffff",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.scene.waveBtnContainer.add([
      this.scene.waveBtnBg,
      this.scene.waveBtnText,
    ]);
    
    this.scene.waveSection.add(this.scene.waveBtnContainer);

    // Interactivité simple sur le bouton
    this.scene.waveBtnBg
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.startWave());

    // Menus
    this.createBuildMenu();
    this.createUpgradeMenu();
    // Le menu de confirmation d'arbre sera créé à la demande
  }

  // ------------------------------------------------------------
  // BUILD MENU (Right click)
  // - Simple grid layout with octagonal turret icons
  // - Names below in small text
  // ------------------------------------------------------------
  createBuildMenu() {
    const s = this.scene.scaleFactor;

    this.buildButtons = [];

    this.scene.buildMenu = this.scene.add
      .container(0, 0)
      .setVisible(false)
      .setDepth(240);

    const menuWidth = 300 * s;
    const menuHeight = 250 * s;
    const pad = 20 * s;

    const { bg, headerLine } = this.createPanelBackground(
      menuWidth,
      menuHeight,
      {
        fill: 0x0f0f1a,
        fillAlpha: 0.98,
        shadowAlpha: 0.5,
        stroke: 0x00ccff,
        strokeAlpha: 1,
        innerStroke: 0x0066aa,
        innerAlpha: 0.6,
        radius: 16,
        headerY: 40 * s,
      }
    );

    const title = this.scene.add
      .text(menuWidth / 2, 20 * s, "CONSTRUIRE", {
        fontSize: `${Math.max(16, 18 * s)}px`,
        fill: "#00ccff",
        fontStyle: "bold",
        stroke: "#003366",
        strokeThickness: Math.max(2, 2 * s),
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setDepth(241);

    this.scene.buildMenu.add([bg, headerLine, title]);

    const turrets = [
      TURRETS.machine_gun,
      TURRETS.sniper,
      TURRETS.cannon,
      TURRETS.zap,
      TURRETS.barracks,
    ];

    // Grille 3x2 (3 colonnes, 2 lignes) pour mieux accommoder 5 tourelles
    const cols = 3;
    const rows = 2;
    const octagonSize = 45 * s;
    const spacingX = (menuWidth - pad * 2) / cols;
    const spacingY = 75 * s;
    const startX = pad + spacingX / 2;
    const startY = 55 * s;

    turrets.forEach((cfg, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * spacingX;
      const y = startY + row * spacingY;
      
      const btn = this.createBuildBtnOctagon(x, y, octagonSize, cfg);
      this.scene.buildMenu.add(btn);
      this.buildButtons.push(btn);
    });

    // Store menu geometry (used in openBuildMenu clamp)
    this.scene._buildMenuSize = { w: menuWidth, h: menuHeight };
  }

  // Fonction pour dessiner un octogone
  drawOctagon(graphics, x, y, radius, fillColor, fillAlpha, strokeColor, strokeWidth) {
    graphics.clear();
    graphics.fillStyle(fillColor, fillAlpha);
    graphics.lineStyle(strokeWidth, strokeColor, 1);
    
    const sides = 8;
    const angleStep = (Math.PI * 2) / sides;
    
    graphics.beginPath();
    for (let i = 0; i <= sides; i++) {
      const angle = (i * angleStep) - Math.PI / 2; // Commencer en haut
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) {
        graphics.moveTo(px, py);
      } else {
        graphics.lineTo(px, py);
      }
    }
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();
  }

  createBuildBtnOctagon(x, y, size, turretConfig) {
    const s = this.scene.scaleFactor;
    const radius = size / 2;

    const btn = this.scene.add.container(x, y).setDepth(241);

    // Octogone de fond
    const octagonBg = this.scene.add.graphics();
    this.drawOctagon(
      octagonBg,
      0,
      0,
      radius,
      0x1a1a2e,
      0.96,
      0x00ccff,
      Math.max(2, 2 * s)
    );

    // Zone interactive (cercle pour simplifier)
    const hitArea = this.scene.add.circle(0, 0, radius + 5 * s, 0x000000, 0);
    hitArea.setInteractive({ useHandCursor: true });

    // Miniature de la tourelle
    const previewContainer = this.scene.add.container(0, 0);
    if (this.scene.drawTurretPreview) {
      this.scene.drawTurretPreview(previewContainer, turretConfig);
      previewContainer.setScale(0.35 * s); // Plus petit pour rentrer dans l'octogone
    }

    // Nom en petit en dessous
    const nameText = this.scene.add
      .text(0, radius + 8 * s, turretConfig.name, {
        fontSize: `${Math.max(10, 11 * s)}px`,
        fill: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    // Prix en très petit
    const costText = this.scene.add
      .text(0, radius + 18 * s, `${turretConfig.cost}$`, {
        fontSize: `${Math.max(9, 10 * s)}px`,
        fill: "#ffd700",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    btn.add([octagonBg, hitArea, previewContainer, nameText, costText]);

    // Keep refs for refresh
    btn.turretConfig = turretConfig;
    btn.octagonBg = octagonBg;
    btn.nameText = nameText;
    btn.costText = costText;
    btn.previewContainer = previewContainer;
    btn.hitArea = hitArea;
    btn.radius = radius; // Stocker le radius pour la mise à jour

    // Initial state
    this.applyBuildBtnStateOctagon(btn);

    // Hover states
      hitArea.on("pointerover", () => {
        const canAfford = this.scene.money >= turretConfig.cost;
        const isBarracksMaxed = turretConfig.key === "barracks" && 
          this.scene.barracks.length >= this.scene.maxBarracks;
        
        if (!canAfford || isBarracksMaxed) return;

        this.drawOctagon(
          octagonBg,
          0,
          0,
          radius,
          0x2a2a4e,
          1,
          0x00ffff,
          Math.max(3, 3 * s)
        );
        nameText.setColor("#ffffff");
        costText.setColor("#ffff00");
        
        // Afficher le tooltip avec la description
        if (turretConfig.description) {
          this.showTurretTooltip(btn, turretConfig.description, hitArea);
        }
      });

      hitArea.on("pointerout", () => {
        this.applyBuildBtnStateOctagon(btn);
        // Cacher le tooltip
        if (this.currentTooltip) {
          this.currentTooltip.destroy();
          this.currentTooltip = null;
        }
      });

    hitArea.on("pointerdown", () => {
      // Cacher le tooltip lors du clic
      if (this.currentTooltip) {
        this.currentTooltip.destroy();
        this.currentTooltip = null;
      }
      
      if (!this.scene.selectedTile) return;

      const canAfford = this.scene.money >= turretConfig.cost;
      const isBarracksMaxed = turretConfig.key === "barracks" && 
        this.scene.barracks.length >= this.scene.maxBarracks;
      
      if (!canAfford || isBarracksMaxed) {
        this.scene.cameras.main.shake(50, 0.005);
        return;
      }

      const success = this.scene.buildTurret(
        turretConfig,
        this.scene.selectedTile.x,
        this.scene.selectedTile.y
      );

      if (success) this.scene.buildMenu.setVisible(false);
      this.updateBuildMenuButtons();
    });

    return btn;
  }
  
  // Afficher un tooltip avec la description de la tourelle
  showTurretTooltip(btnContainer, description, triggerElement) {
    const s = this.scene.scaleFactor;
    
    // Détruire l'ancien tooltip s'il existe
    if (this.currentTooltip) {
      this.currentTooltip.destroy();
    }
    
    // Calculer la position du tooltip (à droite du bouton)
    const btnX = btnContainer.x + (this.scene.buildMenu.x || 0);
    const btnY = btnContainer.y + (this.scene.buildMenu.y || 0);
    
    // Créer le tooltip
    const tooltipContainer = this.scene.add.container(0, 0).setDepth(300);
    this.currentTooltip = tooltipContainer;
    
    // Fond du tooltip
    const tooltipBg = this.scene.add.graphics();
    const padding = 15 * s;
    const maxWidth = 350 * s;
    const lineHeight = 20 * s;
    
    // Calculer la taille du texte
    const tempText = this.scene.add.text(0, 0, description, {
      fontSize: `${Math.max(11, 12 * s)}px`,
      fill: "#ffffff",
      fontFamily: "Arial",
      wordWrap: { width: maxWidth - padding * 2 },
      lineSpacing: 4 * s,
    });
    const textWidth = Math.min(tempText.width, maxWidth - padding * 2);
    const textHeight = tempText.height;
    tempText.destroy();
    
    const tooltipWidth = textWidth + padding * 2;
    const tooltipHeight = textHeight + padding * 2;
    
    // Positionner le tooltip à droite du bouton
    const tooltipX = btnX + 60 * s;
    const tooltipY = btnY;
    
    // Dessiner le fond
    tooltipBg.fillStyle(0x000000, 0.95);
    tooltipBg.fillRoundedRect(0, 0, tooltipWidth, tooltipHeight, 8);
    tooltipBg.lineStyle(2, 0x00ccff, 1);
    tooltipBg.strokeRoundedRect(0, 0, tooltipWidth, tooltipHeight, 8);
    
    // Texte de description
    const descText = this.scene.add.text(
      padding,
      padding,
      description,
      {
        fontSize: `${Math.max(11, 12 * s)}px`,
        fill: "#ffffff",
        fontFamily: "Arial",
        wordWrap: { width: maxWidth - padding * 2 },
        lineSpacing: 4 * s,
      }
    );
    
    tooltipContainer.add([tooltipBg, descText]);
    tooltipContainer.setPosition(tooltipX, tooltipY);
    
    // Ajuster la position si le tooltip sort de l'écran
    if (tooltipX + tooltipWidth > this.scene.gameWidth) {
      tooltipContainer.setX(btnX - tooltipWidth - 10 * s);
    }
    if (tooltipY + tooltipHeight > this.scene.gameHeight) {
      tooltipContainer.setY(this.scene.gameHeight - tooltipHeight - 10 * s);
    }
  }

  applyBuildBtnStateOctagon(btnContainer) {
    const s = this.scene.scaleFactor;
    const cfg = btnContainer.turretConfig;
    const canAfford = this.scene.money >= cfg.cost;
    
    let isDisabled = false;
    if (cfg.key === "barracks") {
      isDisabled = this.scene.barracks.length >= this.scene.maxBarracks;
    }
    
    const shouldDisable = !canAfford || isDisabled;
    const radius = btnContainer.radius || (50 * s / 2);

    if (btnContainer.nameText) {
      btnContainer.nameText.setColor(shouldDisable ? "#666666" : "#ffffff");
      btnContainer.nameText.setAlpha(shouldDisable ? 0.6 : 1);
    }
    if (btnContainer.costText) {
      btnContainer.costText.setColor(shouldDisable ? "#ff4444" : "#ffd700");
      btnContainer.costText.setAlpha(shouldDisable ? 0.7 : 1);
    }
    if (btnContainer.octagonBg) {
      const fillColor = shouldDisable ? 0x0f0f0f : 0x1a1a2e;
      const fillAlpha = shouldDisable ? 0.6 : 0.96;
      const strokeColor = shouldDisable ? 0x444444 : 0x00ccff;
      const strokeWidth = Math.max(2, 2 * s);
      
      this.drawOctagon(
        btnContainer.octagonBg,
        0,
        0,
        radius,
        fillColor,
        fillAlpha,
        strokeColor,
        strokeWidth
      );
      btnContainer.octagonBg.setAlpha(shouldDisable ? 0.5 : 1);
      
      if (shouldDisable) {
        btnContainer.hitArea?.disableInteractive();
      } else {
        btnContainer.hitArea?.setInteractive({ useHandCursor: true });
      }
    }
    if (btnContainer.previewContainer) {
      btnContainer.previewContainer.setAlpha(shouldDisable ? 0.4 : 1);
    }
  }

  applyBuildBtnState(btnContainer) {
    // Ancienne méthode pour compatibilité, mais on utilise maintenant applyBuildBtnStateOctagon
    this.applyBuildBtnStateOctagon(btnContainer);
  }

  updateBuildMenuButtons() {
    // Use our cache, but also supports old list style if needed
    const buttons =
      this.buildButtons?.length > 0
        ? this.buildButtons
        : this.scene.buildMenu?.list?.filter((x) => x?.turretConfig) || [];

    buttons.forEach((btn) => {
      if (btn.octagonBg) {
        this.applyBuildBtnStateOctagon(btn);
      } else {
        this.applyBuildBtnState(btn);
      }
    });
  }

  openBuildMenu(pointer) {
    const s = this.scene.scaleFactor;
    const T = CONFIG.TILE_SIZE * s;

    const tx = Math.floor((pointer.worldX - this.scene.mapStartX) / T);
    const ty = Math.floor((pointer.worldY - this.scene.mapStartY) / T);

    this.scene.selectedTile = { x: tx, y: ty };
    this.scene.selectedTileIsAdjacentToPath =
      this.scene.mapManager.isAdjacentToPath(tx, ty);

    const { w: menuWidth, h: menuHeight } = this.scene._buildMenuSize || {
      w: 360 * s,
      h: 310 * s,
    };

    let menuX = pointer.worldX;
    let menuY = pointer.worldY;

    // Clamp to screen
    if (menuX + menuWidth / 2 > this.scene.gameWidth) {
      menuX = this.scene.gameWidth - menuWidth / 2 - 10 * s;
    }
    if (menuX - menuWidth / 2 < 0) {
      menuX = menuWidth / 2 + 10 * s;
    }
    if (menuY + menuHeight / 2 > this.scene.gameHeight) {
      menuY = this.scene.gameHeight - menuHeight / 2 - 10 * s;
    }
    if (menuY - menuHeight / 2 < 0) {
      menuY = menuHeight / 2 + 10 * s;
    }

    this.scene.buildMenu.setPosition(
      menuX - menuWidth / 2,
      menuY - menuHeight / 2
    );
    this.scene.buildMenu.setVisible(true);
    this.updateBuildMenuButtons();
  }

  // ------------------------------------------------------------
  // UPGRADE MENU (kept close to your logic, but cleaned safety)
  // ------------------------------------------------------------
  createUpgradeMenu() {
    const s = this.scene.scaleFactor;

    this.scene.upgradeMenu = this.scene.add
      .container(0, 0)
      .setVisible(false)
      .setDepth(240);

    const menuWidth = 320 * s;
    const menuHeight = 220 * s;

    const uBgGraphics = this.scene.add.graphics();
    uBgGraphics.fillStyle(0x222222, 0.95);
    uBgGraphics.fillRoundedRect(0, 0, menuWidth, menuHeight, 10);
    uBgGraphics.lineStyle(3, 0xffffff, 0.3);
    uBgGraphics.strokeRoundedRect(0, 0, menuWidth, menuHeight, 10);

    this.scene.upgradeMenu.add(uBgGraphics);

    this.scene.upgradeInfoText = null;

    this.scene.upgradeBtnText = this.scene.add
      .text(15 * s, 170 * s, "AMÉLIORER", {
        fontSize: `${Math.max(14, 18 * s)}px`,
        fill: "#ffffff",
        fontStyle: "bold",
        backgroundColor: "#00aa00",
        padding: { x: 15 * s, y: 8 * s },
        fontFamily: "Arial",
      })
      .setDepth(241)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        const nextStats = this.scene.selectedTurret?.getNextLevelStats?.();
        const canAfford = nextStats && this.scene.money >= nextStats.cost;
        if (nextStats && canAfford) {
          this.scene.upgradeBtnText.setBackgroundColor("#00cc00");
        }
      })
      .on("pointerout", () => {
        const nextStats = this.scene.selectedTurret?.getNextLevelStats?.();
        const canAfford = nextStats && this.scene.money >= nextStats.cost;
        const hasNext = !!nextStats;
        if (hasNext && canAfford) {
          this.scene.upgradeBtnText.setBackgroundColor("#00aa00");
        } else {
          this.scene.upgradeBtnText.setBackgroundColor("#666666");
        }
      })
      .on("pointerdown", () => {
        const nextStats = this.scene.selectedTurret?.getNextLevelStats?.();
        const canAfford = nextStats && this.scene.money >= nextStats.cost;
        if (nextStats && canAfford) {
          this.scene.triggerUpgrade();
        } else if (!nextStats) {
          this.scene.upgradeMenu.setVisible(false);
          this.scene.selectedTurret = null;
        } else {
          // Pas assez d'argent
          this.scene.cameras.main.shake(50, 0.005);
        }
      });

    this.scene.upgradeMenu.add(this.scene.upgradeBtnText);

    // Icône poubelle pour revendre (en haut à droite)
    this.scene.trashIcon = this.createTrashIcon(menuWidth, s);
    this.scene.upgradeMenu.add(this.scene.trashIcon);
  }

  createTrashIcon(menuWidth, s) {
    const trashIcon = this.scene.add.graphics();
    const trashSize = 20 * s;
    const trashX = menuWidth - 30 * s;
    const trashY = 15 * s;

    const drawTrash = (color = 0xff0000) => {
      trashIcon.clear();
      trashIcon.fillStyle(color, 1);
      trashIcon.fillRect(trashX - trashSize / 2, trashY - trashSize / 2, trashSize, trashSize * 0.8);
      trashIcon.fillStyle(0xcc0000, 1);
      trashIcon.fillRect(trashX - trashSize / 2 + 2 * s, trashY - trashSize / 2 + 2 * s, trashSize - 4 * s, trashSize * 0.6);
      // Couvercle
      trashIcon.fillStyle(color, 1);
      trashIcon.fillRect(trashX - trashSize / 2 - 2 * s, trashY - trashSize / 2 - 3 * s, trashSize + 4 * s, 4 * s);
      // Poignées
      trashIcon.fillStyle(0xffffff, 1);
      trashIcon.fillRect(trashX - trashSize / 2 - 4 * s, trashY - trashSize / 2 + 2 * s, 2 * s, 6 * s);
      trashIcon.fillRect(trashX + trashSize / 2 + 2 * s, trashY - trashSize / 2 + 2 * s, 2 * s, 6 * s);
    };

    drawTrash();

    trashIcon.setDepth(241);
    trashIcon.setInteractive(new Phaser.Geom.Rectangle(trashX - trashSize / 2 - 4 * s, trashY - trashSize / 2 - 3 * s, trashSize + 8 * s, trashSize + 6 * s), Phaser.Geom.Rectangle.Contains);
    trashIcon.setInteractive({ useHandCursor: true });

    trashIcon.on("pointerover", () => {
      drawTrash(0xff4444);
    });

    trashIcon.on("pointerout", () => {
      drawTrash();
    });

    trashIcon.on("pointerdown", () => {
      if (!this.scene.selectedTurret) return;

      const totalCost = this.scene.selectedTurret.getTotalCost();
      const refund = Math.floor(totalCost / 2);

      // Retirer la tourelle/barracks de la liste
      if (this.scene.selectedTurret instanceof Barracks) {
        const index = this.scene.barracks.indexOf(this.scene.selectedTurret);
        if (index !== -1) {
          this.scene.barracks.splice(index, 1);
        }
      } else {
        const index = this.scene.turrets.indexOf(this.scene.selectedTurret);
        if (index !== -1) {
          this.scene.turrets.splice(index, 1);
        }
      }

      // Détruire l'objet
      this.scene.selectedTurret.destroy();

      // Rembourser
      this.scene.earnMoney(refund);

      // Fermer le menu
      this.scene.upgradeMenu.setVisible(false);
      this.scene.selectedTurret = null;
      this.scene.updateToolbarCounts();
    });

    return trashIcon;
  }

  openUpgradeMenu(pointer, turret) {
    const s = this.scene.scaleFactor;

    this.scene.selectedTurret = turret;

    const menuWidth = 320 * s;
    const menuHeight = 220 * s;

    const menuX = Phaser.Math.Clamp(
      pointer.worldX,
      menuWidth / 2,
      this.scene.gameWidth - menuWidth / 2
    );
    const menuY = Phaser.Math.Clamp(
      pointer.worldY,
      menuHeight / 2,
      this.scene.gameHeight - menuHeight / 2
    );

    this.scene.upgradeMenu.setPosition(
      menuX - menuWidth / 2,
      menuY - menuHeight / 2
    );

    // Clean previous texts safely
    if (this.scene.upgradeInfoText?.active) {
      try {
        this.scene.upgradeInfoText.destroy();
      } catch (e) {}
    }
    this.scene.upgradeInfoText = null;

    if (Array.isArray(this.scene.upgradeTextLines)) {
      this.scene.upgradeTextLines.forEach((obj) => {
        if (!obj) return;
        try {
          this.scene.upgradeMenu.remove(obj);
        } catch (e) {}
        try {
          if (obj.active !== false && obj.destroy) obj.destroy();
        } catch (e) {}
      });
    }
    this.scene.upgradeTextLines = [];

    const fontSize = Math.max(14, 16 * s);
    let yPos = 20 * s;
    const lineHeight = 22 * s;
    const xPos = 15 * s;

    if (turret instanceof Barracks) {
      this.renderBarracksUpgrade(turret, xPos, yPos, lineHeight, fontSize);
    } else {
      this.renderTurretUpgrade(turret, xPos, yPos, lineHeight, fontSize);
    }

    const finalNextStats = turret.getNextLevelStats
      ? turret.getNextLevelStats()
      : null;

    // Vérifier si on a assez d'argent pour l'amélioration
    const canAfford = finalNextStats && this.scene.money >= finalNextStats.cost;
    const shouldDisable = !finalNextStats || !canAfford;

    this.scene.upgradeBtnText.setPosition(15 * s, menuHeight - 50 * s);
    if (finalNextStats) {
      this.scene.upgradeBtnText.setText(
        canAfford ? "AMÉLIORER" : `AMÉLIORER (${finalNextStats.cost}$)`
      );
    } else {
      this.scene.upgradeBtnText.setText("FERMER");
    }
    
    // Désactiver visuellement si on ne peut pas se le permettre
    if (shouldDisable) {
      this.scene.upgradeBtnText.setBackgroundColor("#666666");
      this.scene.upgradeBtnText.setColor("#999999");
      this.scene.upgradeBtnText.setAlpha(0.6);
      this.scene.upgradeBtnText.disableInteractive();
    } else {
      this.scene.upgradeBtnText.setBackgroundColor("#00aa00");
      this.scene.upgradeBtnText.setColor("#ffffff");
      this.scene.upgradeBtnText.setAlpha(1);
      this.scene.upgradeBtnText.setInteractive({ useHandCursor: true });
    }

    this.scene.upgradeMenu.setVisible(true);
  }

  renderBarracksUpgrade(turret, xPos, yPosStart, lineHeight, fontSize) {
    const s = this.scene.scaleFactor;

    let yPos = yPosStart;

    const level = turret.level || 1;
    const soldiersCount = turret.config.soldiersCount[level - 1] || 2;
    const respawnTime = turret.config.respawnTime[level - 1] || 12000;
    const soldierHp = turret.config.soldierHp[level - 1] || 100;

    const nextStats = turret.getNextLevelStats?.();

    const title = this.scene.add
      .text(xPos, yPos, `Caserne - Niveau ${level}`, {
        fontSize: `${fontSize + 2}px`,
        fill: "#ffffff",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setDepth(241);

    this.scene.upgradeTextLines.push(title);
    this.scene.upgradeMenu.add(title);
    yPos += lineHeight * 1.5;

    if (nextStats) {
      const nextSoldiers = turret.config.soldiersCount[level] || 3;
      const nextRespawn = turret.config.respawnTime[level] || 10000;
      const nextHp = turret.config.soldierHp[level] || 120;

      yPos = this.addStatLine(
        xPos,
        yPos,
        lineHeight,
        fontSize,
        "Soldats",
        `${soldiersCount} > `,
        `${nextSoldiers}`
      );
      yPos = this.addStatLine(
        xPos,
        yPos,
        lineHeight,
        fontSize,
        "Respawn",
        `${(respawnTime / 1000).toFixed(1)}s > `,
        `${(nextRespawn / 1000).toFixed(1)}s`
      );
      yPos = this.addStatLine(
        xPos,
        yPos,
        lineHeight,
        fontSize,
        "HP Soldat",
        `${soldierHp} > `,
        `${nextHp}`
      );

      yPos += lineHeight * 0.5;

      const canAfford = this.scene.money >= nextStats.cost;
      const costText = this.scene.add
        .text(xPos, yPos, `Coût : `, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
          fontFamily: "Arial",
        })
        .setDepth(241);
      const costValue = this.scene.add
        .text(xPos + costText.width, yPos, `${nextStats.cost}$`, {
          fontSize: `${fontSize}px`,
          fill: canAfford ? "#ffd700" : "#ff4444",
          fontStyle: "bold",
          fontFamily: "Arial",
        })
        .setDepth(241);

      this.scene.upgradeTextLines.push(costText, costValue);
      this.scene.upgradeMenu.add([costText, costValue]);
    } else {
      const soldiersText = this.scene.add
        .text(xPos, yPos, `Soldats : ${soldiersCount}`, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
          fontFamily: "Arial",
        })
        .setDepth(241);
      this.scene.upgradeTextLines.push(soldiersText);
      this.scene.upgradeMenu.add(soldiersText);
      yPos += lineHeight;

      const respawnText = this.scene.add
        .text(xPos, yPos, `Respawn : ${(respawnTime / 1000).toFixed(1)}s`, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
          fontFamily: "Arial",
        })
        .setDepth(241);
      this.scene.upgradeTextLines.push(respawnText);
      this.scene.upgradeMenu.add(respawnText);
      yPos += lineHeight;

      const hpText = this.scene.add
        .text(xPos, yPos, `HP Soldat : ${soldierHp}`, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
          fontFamily: "Arial",
        })
        .setDepth(241);
      this.scene.upgradeTextLines.push(hpText);
      this.scene.upgradeMenu.add(hpText);
      yPos += lineHeight * 1.5;

      const maxText = this.scene.add
        .text(xPos, yPos, `Niveau Maximum`, {
          fontSize: `${fontSize}px`,
          fill: "#ff0000",
          fontStyle: "bold",
          fontFamily: "Arial",
        })
        .setDepth(241);
      this.scene.upgradeTextLines.push(maxText);
      this.scene.upgradeMenu.add(maxText);
    }
  }

  renderTurretUpgrade(turret, xPos, yPosStart, lineHeight, fontSize) {
    let yPos = yPosStart;

    const level = turret.level || 1;
    const nextStats = turret.getNextLevelStats?.();

    const title = this.scene.add
      .text(xPos, yPos, `${turret.config.name} - Niveau ${level}`, {
        fontSize: `${fontSize + 2}px`,
        fill: "#ffffff",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setDepth(241);

    this.scene.upgradeTextLines.push(title);
    this.scene.upgradeMenu.add(title);
    yPos += lineHeight * 1.5;

    const currentDamage = turret.config.damage || 0;
    const currentRate = turret.config.rate || 0;
    const currentRange = turret.config.range || 0;

    if (nextStats) {
      yPos = this.addStatLine(
        xPos,
        yPos,
        lineHeight,
        fontSize,
        "Dégâts",
        `${currentDamage} > `,
        `${nextStats.damage || 0}`
      );
      yPos = this.addStatLine(
        xPos,
        yPos,
        lineHeight,
        fontSize,
        "Cadence",
        `${(currentRate / 1000).toFixed(1)}s > `,
        `${((nextStats.rate || 0) / 1000).toFixed(1)}s`
      );
      yPos = this.addStatLine(
        xPos,
        yPos,
        lineHeight,
        fontSize,
        "Portée",
        `${currentRange} > `,
        `${nextStats.range || 0}`
      );

      if (nextStats.aoe) {
        yPos = this.addStatLine(
          xPos,
          yPos,
          lineHeight,
          fontSize,
          "Zone",
          `${turret.config.aoe || 0} > `,
          `${nextStats.aoe}`
        );
      }

      yPos += lineHeight * 0.5;

      const canAfford = this.scene.money >= nextStats.cost;
      const costText = this.scene.add
        .text(xPos, yPos, `Coût : `, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
          fontFamily: "Arial",
        })
        .setDepth(241);
      const costValue = this.scene.add
        .text(xPos + costText.width, yPos, `${nextStats.cost}$`, {
          fontSize: `${fontSize}px`,
          fill: canAfford ? "#ffd700" : "#ff4444",
          fontStyle: "bold",
          fontFamily: "Arial",
        })
        .setDepth(241);

      this.scene.upgradeTextLines.push(costText, costValue);
      this.scene.upgradeMenu.add([costText, costValue]);
    } else {
      const damageText = this.scene.add
        .text(xPos, yPos, `Dégâts : ${currentDamage}`, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
          fontFamily: "Arial",
        })
        .setDepth(241);
      this.scene.upgradeTextLines.push(damageText);
      this.scene.upgradeMenu.add(damageText);
      yPos += lineHeight;

      const rateText = this.scene.add
        .text(xPos, yPos, `Cadence : ${(currentRate / 1000).toFixed(1)}s`, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
          fontFamily: "Arial",
        })
        .setDepth(241);
      this.scene.upgradeTextLines.push(rateText);
      this.scene.upgradeMenu.add(rateText);
      yPos += lineHeight;

      const rangeText = this.scene.add
        .text(xPos, yPos, `Portée : ${currentRange}`, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
          fontFamily: "Arial",
        })
        .setDepth(241);
      this.scene.upgradeTextLines.push(rangeText);
      this.scene.upgradeMenu.add(rangeText);
      yPos += lineHeight;

      if (turret.config.aoe) {
        const aoeText = this.scene.add
          .text(xPos, yPos, `Zone : ${turret.config.aoe}`, {
            fontSize: `${fontSize}px`,
            fill: "#ffffff",
            fontFamily: "Arial",
          })
          .setDepth(241);
        this.scene.upgradeTextLines.push(aoeText);
        this.scene.upgradeMenu.add(aoeText);
        yPos += lineHeight;
      }

      yPos += lineHeight * 0.5;

      const maxText = this.scene.add
        .text(xPos, yPos, `Niveau Maximum`, {
          fontSize: `${fontSize}px`,
          fill: "#ff0000",
          fontStyle: "bold",
          fontFamily: "Arial",
        })
        .setDepth(241);
      this.scene.upgradeTextLines.push(maxText);
      this.scene.upgradeMenu.add(maxText);
    }
  }

  addStatLine(xPos, yPos, lineHeight, fontSize, label, leftValue, rightValue) {
    // label is unused in display (kept if you want to reformat later), but we keep the API stable.
    const leftText = this.scene.add
      .text(xPos, yPos, `${label} : ${leftValue}`, {
        fontSize: `${fontSize}px`,
        fill: "#ffffff",
        fontFamily: "Arial",
      })
      .setDepth(241);

    const rightText = this.scene.add
      .text(xPos + leftText.width, yPos, `${rightValue}`, {
        fontSize: `${fontSize}px`,
        fill: "#00ff00",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setDepth(241);

    this.scene.upgradeTextLines.push(leftText, rightText);
    this.scene.upgradeMenu.add([leftText, rightText]);

    return yPos + lineHeight;
  }

  // ------------------------------------------------------------
  // Small UI helper
  // ------------------------------------------------------------
  createPanelBackground(w, h, opts) {
    const s = this.scene.scaleFactor;
    const radius = opts.radius ?? 15;

    const g = this.scene.add.graphics();

    // Shadow-ish offset
    g.fillStyle(0x000000, opts.shadowAlpha ?? 0.5);
    g.fillRoundedRect(4 * s, 4 * s, w, h, radius);

    // Main fill
    g.fillStyle(opts.fill ?? 0x0f0f1a, opts.fillAlpha ?? 0.98);
    g.fillRoundedRect(0, 0, w, h, radius);

    // Border
    g.lineStyle(
      Math.max(3, 4 * s),
      opts.stroke ?? 0x00ccff,
      opts.strokeAlpha ?? 1
    );
    g.strokeRoundedRect(0, 0, w, h, radius);

    // Inner border
    g.lineStyle(2, opts.innerStroke ?? 0x0066aa, opts.innerAlpha ?? 0.6);
    g.strokeRoundedRect(2 * s, 2 * s, w - 4 * s, h - 4 * s, radius - 2);

    // Header separator
    const headerLine = this.scene.add.graphics();
    headerLine.lineStyle(2, 0x00ccff, 0.8);
    headerLine.beginPath();
    headerLine.moveTo(14 * s, opts.headerY ?? 42 * s);
    headerLine.lineTo(w - 14 * s, opts.headerY ?? 42 * s);
    headerLine.strokePath();

    return { bg: g, headerLine };
  }

  // ------------------------------------------------------------
  // TREE REMOVAL CONFIRMATION MENU
  // ------------------------------------------------------------
  createTreeRemovalMenu() {
    const s = this.scene.scaleFactor;

    this.scene.treeRemovalMenu = this.scene.add
      .container(0, 0)
      .setVisible(false)
      .setDepth(250);

    const menuWidth = 280 * s;
    const menuHeight = 140 * s;

    const { bg } = this.createPanelBackground(menuWidth, menuHeight, {
      fill: 0x0f0f1a,
      fillAlpha: 0.98,
      shadowAlpha: 0.5,
      stroke: 0xff6600,
      strokeAlpha: 1,
      innerStroke: 0xcc4400,
      innerAlpha: 0.6,
      radius: 16,
      headerY: 0,
    });

    this.scene.treeRemovalMenu.add(bg);

    // Texte de confirmation
    this.scene.treeRemovalText = this.scene.add
      .text(menuWidth / 2, 35 * s, "", {
        fontSize: `${Math.max(14, 16 * s)}px`,
        fill: "#ffffff",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: menuWidth - 40 * s },
      })
      .setOrigin(0.5)
      .setDepth(251);

    this.scene.treeRemovalMenu.add(this.scene.treeRemovalText);

    // Bouton Oui
    const yesBtn = this.scene.add
      .text(menuWidth / 2 - 60 * s, 90 * s, "OUI", {
        fontSize: `${Math.max(14, 16 * s)}px`,
        fill: "#ffffff",
        fontStyle: "bold",
        backgroundColor: "#00aa00",
        padding: { x: 20 * s, y: 8 * s },
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setDepth(251)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => yesBtn.setBackgroundColor("#00cc00"))
      .on("pointerout", () => yesBtn.setBackgroundColor("#00aa00"))
      .on("pointerdown", () => {
        if (this.scene.treeRemovalTile) {
          const { tx, ty } = this.scene.treeRemovalTile;
          if (this.scene.money >= 25) {
            this.scene.mapManager.removeTree(tx, ty);
            this.scene.earnMoney(-25); // Déduire 25$
            this.scene.treeRemovalMenu.setVisible(false);
            this.scene.treeRemovalTile = null;
          } else {
            // Pas assez d'argent
            this.scene.cameras.main.shake(50, 0.005);
          }
        }
      });

    // Bouton Non
    const noBtn = this.scene.add
      .text(menuWidth / 2 + 60 * s, 90 * s, "NON", {
        fontSize: `${Math.max(14, 16 * s)}px`,
        fill: "#ffffff",
        fontStyle: "bold",
        backgroundColor: "#aa0000",
        padding: { x: 20 * s, y: 8 * s },
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setDepth(251)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => noBtn.setBackgroundColor("#cc0000"))
      .on("pointerout", () => noBtn.setBackgroundColor("#aa0000"))
      .on("pointerdown", () => {
        this.scene.treeRemovalMenu.setVisible(false);
        this.scene.treeRemovalTile = null;
      });

    this.scene.treeRemovalMenu.add([yesBtn, noBtn]);
  }

  openTreeRemovalConfirmation(pointer, tx, ty) {
    const s = this.scene.scaleFactor;

    // Créer le menu s'il n'existe pas
    if (!this.scene.treeRemovalMenu) {
      this.createTreeRemovalMenu();
    }

    // Stocker les coordonnées de la tuile
    this.scene.treeRemovalTile = { tx, ty };

    const menuWidth = 280 * s;
    const menuHeight = 140 * s;

    // Positionner le menu près du pointeur
    let menuX = Phaser.Math.Clamp(
      pointer.worldX,
      menuWidth / 2,
      this.scene.gameWidth - menuWidth / 2
    );
    let menuY = Phaser.Math.Clamp(
      pointer.worldY,
      menuHeight / 2,
      this.scene.gameHeight - menuHeight / 2
    );

    this.scene.treeRemovalMenu.setPosition(
      menuX - menuWidth / 2,
      menuY - menuHeight / 2
    );

    // Mettre à jour le texte
    const canAfford = this.scene.money >= 25;
    const costText = canAfford ? "25" : "25 (insuffisant)";
    
    this.scene.treeRemovalText.setText([
      "Voulez-vous enlever",
      "cet arbre pour",
      `${costText} pièces ?`
    ]);
    
    // Changer la couleur si pas assez d'argent
    if (canAfford) {
      this.scene.treeRemovalText.setColor("#ffffff");
    } else {
      this.scene.treeRemovalText.setColor("#ff4444");
    }

    this.scene.treeRemovalMenu.setVisible(true);
  }
}
