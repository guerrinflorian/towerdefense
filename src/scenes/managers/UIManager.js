import { CONFIG } from "../../config/settings.js";
import { TURRETS } from "../../config/turrets/index.js";
import { Barracks } from "../../objects/Barracks.js";

export class UIManager {
  constructor(scene) {
    this.scene = scene;

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

    // Wave button
    const btnWidth = 300 * s;
    const btnHeight = 60 * s;
    const wx = this.scene.gameWidth - 180 * s;
    const wy =
      this.scene.mapStartY + 15 * CONFIG.TILE_SIZE * s - btnHeight - 10 * s;

    this.scene.waveBtnContainer = this.scene.add
      .container(wx, wy)
      .setDepth(100);

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

    this.scene.waveBtnBg
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.startWave());

    // Menus
    this.createBuildMenu();
    this.createUpgradeMenu();
  }

  // ------------------------------------------------------------
  // BUILD MENU (Right click)
  // - More readable, more spaced, cost aligned to the right
  // - Bigger buttons, clearer hover/disabled states
  // ------------------------------------------------------------
  createBuildMenu() {
    const s = this.scene.scaleFactor;

    this.buildButtons = [];

    this.scene.buildMenu = this.scene.add
      .container(0, 0)
      .setVisible(false)
      .setDepth(240);

    const menuWidth = 360 * s;
    const menuHeight = 310 * s;
    const pad = 16 * s;

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
        headerY: 54 * s,
      }
    );

    const title = this.scene.add
      .text(menuWidth / 2, 28 * s, "CONSTRUIRE", {
        fontSize: `${Math.max(18, 22 * s)}px`,
        fill: "#00ccff",
        fontStyle: "bold",
        stroke: "#003366",
        strokeThickness: Math.max(2, 2 * s),
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setDepth(241);

    const hint = this.scene.add
      .text(menuWidth / 2, 44 * s, "Choisis une tour à placer", {
        fontSize: `${Math.max(12, 14 * s)}px`,
        fill: "#a8c7d8",
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setDepth(241);

    this.scene.buildMenu.add([bg, headerLine, title, hint]);

    const rows = [
      TURRETS.machine_gun,
      TURRETS.sniper,
      TURRETS.cannon,
      TURRETS.zap,
      TURRETS.barracks,
    ];

    const startY = 76 * s;
    const rowH = 44 * s; // bigger spacing
    const btnW = menuWidth - pad * 2;
    const btnX = pad + btnW / 2;

    rows.forEach((cfg, i) => {
      const y = startY + i * rowH;
      const btn = this.createBuildBtn(btnX, y, btnW, 38 * s, cfg);
      this.scene.buildMenu.add(btn);
      this.buildButtons.push(btn);
    });

    // Footer note
    const footer = this.scene.add
      .text(
        pad,
        menuHeight - 22 * s,
        "Astuce : clic droit sur la grille pour ouvrir",
        {
          fontSize: `${Math.max(11, 12 * s)}px`,
          fill: "#6f91a3",
          fontFamily: "Arial",
        }
      )
      .setOrigin(0, 0.5)
      .setDepth(241);

    this.scene.buildMenu.add(footer);

    // Store menu geometry (used in openBuildMenu clamp)
    this.scene._buildMenuSize = { w: menuWidth, h: menuHeight };
  }

  createBuildBtn(x, y, w, h, turretConfig) {
    const s = this.scene.scaleFactor;

    const fontName = Math.max(14, 16 * s);
    const fontCost = Math.max(12, 14 * s);

    const btn = this.scene.add.container(x, y).setDepth(241);

    // Base rectangle
    const bg = this.scene.add
      .rectangle(0, 0, w, h, 0x1a1a2e, 0.96)
      .setStrokeStyle(Math.max(2, 2 * s), 0x00ccff, 0.7);

    // Soft inner highlight line (gives a "button" feel)
    const deco = this.scene.add.graphics();
    deco.lineStyle(Math.max(1, 1 * s), 0xffffff, 0.08);
    deco.strokeRoundedRect(
      -w / 2 + 3 * s,
      -h / 2 + 3 * s,
      w - 6 * s,
      h - 6 * s,
      8
    );

    // Left texts
    const name = this.scene.add
      .text(-w / 2 + 12 * s, 0, turretConfig.name, {
        fontSize: `${fontName}px`,
        fill: "#ffffff",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0, 0.5);

    // Right cost aligned
    const cost = this.scene.add
      .text(w / 2 - 12 * s, 0, `${turretConfig.cost}$`, {
        fontSize: `${fontCost}px`,
        fill: "#ffd700",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(1, 0.5);

    // Optional small label under name (if you ever add category tags)
    // const sub = ...

    bg.setInteractive({ useHandCursor: true });

    btn.add([bg, deco, name, cost]);

    // Keep refs for refresh
    btn.turretConfig = turretConfig;
    btn.btnBg = bg;
    btn.nameText = name;
    btn.costText = cost;

    // Initial state
    this.applyBuildBtnState(btn);

    // Hover states
    bg.on("pointerover", () => {
      const canAfford = this.scene.money >= turretConfig.cost;
      if (!canAfford) return;

      bg.setFillStyle(0x2a2a4e, 1);
      bg.setStrokeStyle(Math.max(3, 3 * s), 0x00ffff, 1);
      name.setColor("#ffffff");
      cost.setColor("#ffff00");
    });

    bg.on("pointerout", () => {
      this.applyBuildBtnState(btn);
    });

    bg.on("pointerdown", () => {
      if (!this.scene.selectedTile) return;

      const canAfford = this.scene.money >= turretConfig.cost;
      if (!canAfford) {
        this.scene.cameras.main.shake(50, 0.005);
        return;
      }

      const success = this.scene.buildTurret(
        turretConfig,
        this.scene.selectedTile.x,
        this.scene.selectedTile.y
      );

      if (success) this.scene.buildMenu.setVisible(false);
      this.updateBuildMenuButtons(); // refresh after spending
    });

    return btn;
  }

  applyBuildBtnState(btnContainer) {
    const s = this.scene.scaleFactor;

    const cfg = btnContainer.turretConfig;
    const canAfford = this.scene.money >= cfg.cost;

    if (btnContainer.nameText) {
      btnContainer.nameText.setColor(canAfford ? "#ffffff" : "#666666");
    }
    if (btnContainer.costText) {
      btnContainer.costText.setColor(canAfford ? "#ffd700" : "#ff4444");
    }
    if (btnContainer.btnBg) {
      btnContainer.btnBg.setFillStyle(
        canAfford ? 0x1a1a2e : 0x0f0f0f,
        canAfford ? 0.96 : 0.85
      );
      btnContainer.btnBg.setStrokeStyle(
        Math.max(2, 2 * s),
        canAfford ? 0x00ccff : 0x666666,
        canAfford ? 0.7 : 0.5
      );
    }
  }

  updateBuildMenuButtons() {
    // Use our cache, but also supports old list style if needed
    const buttons =
      this.buildButtons?.length > 0
        ? this.buildButtons
        : this.scene.buildMenu?.list?.filter((x) => x?.turretConfig) || [];

    buttons.forEach((btn) => this.applyBuildBtnState(btn));
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
        if (this.scene.selectedTurret?.getNextLevelStats?.()) {
          this.scene.upgradeBtnText.setBackgroundColor("#00cc00");
        }
      })
      .on("pointerout", () => {
        const hasNext = !!this.scene.selectedTurret?.getNextLevelStats?.();
        this.scene.upgradeBtnText.setBackgroundColor(
          hasNext ? "#00aa00" : "#666666"
        );
      })
      .on("pointerdown", () => {
        if (this.scene.selectedTurret?.getNextLevelStats?.()) {
          this.scene.triggerUpgrade();
        } else {
          this.scene.upgradeMenu.setVisible(false);
          this.scene.selectedTurret = null;
        }
      });

    this.scene.upgradeMenu.add(this.scene.upgradeBtnText);
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

    this.scene.upgradeBtnText.setPosition(15 * s, menuHeight - 50 * s);
    this.scene.upgradeBtnText.setText(finalNextStats ? "AMÉLIORER" : "FERMER");
    this.scene.upgradeBtnText.setBackgroundColor(
      finalNextStats ? "#00aa00" : "#666666"
    );

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
          fill: "#ffd700",
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
          fill: "#ffd700",
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
}
