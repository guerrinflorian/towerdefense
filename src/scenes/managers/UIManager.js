import { CONFIG } from "../../config/settings.js";
import { TURRETS } from "../../config/turrets/index.js";
import { Barracks } from "../../objects/Barracks.js";

export class UIManager {
  constructor(scene) {
    this.scene = scene;
    this.scene.upgradeTextLines = [];
  }

  createUI() {
    const UI_HEIGHT = CONFIG.UI_HEIGHT * this.scene.scaleFactor;
    const fontSize = Math.max(16, 24 * this.scene.scaleFactor);
    const smallFontSize = Math.max(12, 18 * this.scene.scaleFactor);
    
    const topBar = this.scene.add.container(0, 0).setDepth(100);
    const bgBar = this.scene.add.graphics();
    bgBar.fillStyle(0x111111, 1);
    bgBar.fillRect(0, 0, this.scene.gameWidth, UI_HEIGHT);
    bgBar.fillStyle(0x00ccff, 0.5);
    bgBar.fillRect(0, UI_HEIGHT - 2 * this.scene.scaleFactor, this.scene.gameWidth, 2 * this.scene.scaleFactor);
    topBar.add(bgBar);
    
    this.scene.txtMoney = this.scene.add
      .text(20 * this.scene.scaleFactor, UI_HEIGHT / 2, "", {
        fontSize: `${fontSize}px`,
        fill: "#ffd700",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0, 0.5);
    topBar.add(this.scene.txtMoney);
    
    this.scene.txtLives = this.scene.add
      .text(250 * this.scene.scaleFactor, UI_HEIGHT / 2, "", {
        fontSize: `${fontSize}px`,
        fill: "#ff4444",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0, 0.5);
    topBar.add(this.scene.txtLives);
    
    const quitBtn = this.scene.add
      .text(this.scene.gameWidth - 20 * this.scene.scaleFactor, UI_HEIGHT / 2, "QUITTER", {
        fontSize: `${smallFontSize}px`,
        fill: "#aaaaaa",
        backgroundColor: "#333333",
        padding: { x: 10 * this.scene.scaleFactor, y: 5 * this.scene.scaleFactor },
      })
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => quitBtn.setColor("#ffffff"))
      .on("pointerout", () => quitBtn.setColor("#aaaaaa"))
      .on("pointerdown", () => this.scene.scene.start("MainMenuScene"));
    topBar.add(quitBtn);
    
    this.scene.updateUI();

    const btnWidth = 300 * this.scene.scaleFactor;
    const btnHeight = 60 * this.scene.scaleFactor;
    const wx = this.scene.gameWidth - 180 * this.scene.scaleFactor;
    const wy = this.scene.mapStartY + 15 * CONFIG.TILE_SIZE * this.scene.scaleFactor - btnHeight - 10 * this.scene.scaleFactor;
    this.scene.waveBtnContainer = this.scene.add.container(wx, wy).setDepth(100);
    this.scene.waveBtnBg = this.scene.add
      .rectangle(0, 0, btnWidth, btnHeight, 0x000000, 0.8)
      .setStrokeStyle(3 * this.scene.scaleFactor, 0x00ff00);
    this.scene.waveBtnText = this.scene.add
      .text(0, 0, "▶ LANCER VAGUE 1", {
        fontSize: `${Math.max(16, 22 * this.scene.scaleFactor)}px`,
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.scene.waveBtnContainer.add([this.scene.waveBtnBg, this.scene.waveBtnText]);
    this.scene.waveBtnBg
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.startWave());

    this.createBuildMenu();
    this.createUpgradeMenu();
  }

  createBuildMenu() {
    this.scene.buildMenu = this.scene.add.container(0, 0).setVisible(false).setDepth(240);
    const menuWidth = 320 * this.scene.scaleFactor;
    const menuHeight = 220 * this.scene.scaleFactor;
    
    const mBgGraphics = this.scene.add.graphics();
    mBgGraphics.fillStyle(0x000000, 0.5);
    mBgGraphics.fillRoundedRect(4 * this.scene.scaleFactor, 4 * this.scene.scaleFactor, menuWidth, menuHeight, 15);
    mBgGraphics.fillStyle(0x0f0f1a, 0.98);
    mBgGraphics.fillRoundedRect(0, 0, menuWidth, menuHeight, 15);
    mBgGraphics.lineStyle(4, 0x00ccff, 1);
    mBgGraphics.strokeRoundedRect(0, 0, menuWidth, menuHeight, 15);
    mBgGraphics.lineStyle(2, 0x0066aa, 0.6);
    mBgGraphics.strokeRoundedRect(2 * this.scene.scaleFactor, 2 * this.scene.scaleFactor, menuWidth - 4 * this.scene.scaleFactor, menuHeight - 4 * this.scene.scaleFactor, 13);
    
    mBgGraphics.lineStyle(2, 0x00ccff, 0.8);
    mBgGraphics.beginPath();
    mBgGraphics.moveTo(15 * this.scene.scaleFactor, 42 * this.scene.scaleFactor);
    mBgGraphics.lineTo(menuWidth - 15 * this.scene.scaleFactor, 42 * this.scene.scaleFactor);
    mBgGraphics.strokePath();
    
    const buildTitle = this.scene.add.text(menuWidth / 2, 25 * this.scene.scaleFactor, "CONSTRUIRE", {
      fontSize: `${Math.max(18, 22 * this.scene.scaleFactor)}px`,
      fill: "#00ccff",
      fontStyle: "bold",
      stroke: "#003366",
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(241);
    this.scene.buildMenu.add([mBgGraphics, buildTitle]);
    
    const btnSpacing = 34 * this.scene.scaleFactor;
    const startY = 55 * this.scene.scaleFactor;
    const btnX = menuWidth / 2;
    
    const btn1 = this.createBuildBtn(btnX, startY, TURRETS.machine_gun);
    const btn2 = this.createBuildBtn(btnX, startY + btnSpacing, TURRETS.sniper);
    const btn3 = this.createBuildBtn(btnX, startY + btnSpacing * 2, TURRETS.cannon);
    const btn4 = this.createBuildBtn(btnX, startY + btnSpacing * 3, TURRETS.zap);
    const btn5 = this.createBuildBtn(btnX, startY + btnSpacing * 4, TURRETS.barracks);
    this.scene.buildMenu.add([btn1, btn2, btn3, btn4, btn5]);
  }

  createBuildBtn(x, y, turretConfig) {
    const fontSize = Math.max(14, 16 * this.scene.scaleFactor);
    const btnWidth = 290 * this.scene.scaleFactor;
    const btnHeight = 32 * this.scene.scaleFactor;
    
    const btnContainer = this.scene.add.container(x, y);
    const btnBg = this.scene.add.rectangle(0, 0, btnWidth, btnHeight, 0x1a1a2e, 0.95);
    btnBg.setStrokeStyle(2, 0x00ccff, 0.7);
    btnBg.setInteractive({ useHandCursor: true });
    
    const nameText = this.scene.add.text(0, -7 * this.scene.scaleFactor, turretConfig.name, {
      fontSize: `${fontSize}px`,
      fill: "#ffffff",
      fontStyle: "bold",
    }).setOrigin(0.5, 0.5);
    
    const costText = this.scene.add.text(0, 7 * this.scene.scaleFactor, `${turretConfig.cost}$`, {
      fontSize: `${fontSize - 2}px`,
      fill: "#ffd700",
      fontStyle: "bold",
    }).setOrigin(0.5, 0.5);
    
    const canAfford = this.scene.money >= turretConfig.cost;
    if (!canAfford) {
      nameText.setColor("#666666");
      costText.setColor("#ff4444");
      btnBg.setFillStyle(0x0f0f0f, 0.8);
      btnBg.setStrokeStyle(2, 0x666666, 0.5);
    }
    
    btnContainer.add([btnBg, nameText, costText]);
    
    btnBg.on("pointerover", () => {
      const canAffordNow = this.scene.money >= turretConfig.cost;
      if (canAffordNow) {
        btnBg.setFillStyle(0x2a2a4e, 1);
        btnBg.setStrokeStyle(3, 0x00ffff, 1);
        if (nameText) nameText.setColor("#ffffff");
        if (costText) costText.setColor("#ffff00");
      }
    });
    
    btnBg.on("pointerout", () => {
      const canAffordNow = this.scene.money >= turretConfig.cost;
      if (canAffordNow) {
        btnBg.setFillStyle(0x1a1a2e, 0.95);
        btnBg.setStrokeStyle(2, 0x00ccff, 0.7);
        if (nameText) nameText.setColor("#ffffff");
        if (costText) costText.setColor("#ffd700");
      } else {
        btnBg.setFillStyle(0x0f0f0f, 0.8);
        btnBg.setStrokeStyle(2, 0x666666, 0.5);
        if (nameText) nameText.setColor("#666666");
        if (costText) costText.setColor("#ff4444");
      }
    });
    
    btnBg.on("pointerdown", () => {
      if (this.scene.selectedTile) {
        if (this.scene.money >= turretConfig.cost) {
          const success = this.scene.buildTurret(turretConfig, this.scene.selectedTile.x, this.scene.selectedTile.y);
          if (success) {
            this.scene.buildMenu.setVisible(false);
          }
        } else {
          this.scene.cameras.main.shake(50, 0.005);
        }
      }
    });
    
    btnContainer.turretConfig = turretConfig;
    btnContainer.btnBg = btnBg;
    btnContainer.nameText = nameText;
    btnContainer.costText = costText;
    
    return btnContainer;
  }

  updateBuildMenuButtons() {
    if (!this.scene.buildMenu || !this.scene.buildMenu.list) return;
    
    this.scene.buildMenu.list.forEach((item) => {
      if (item && item.turretConfig) {
        const config = item.turretConfig;
        const canAfford = this.scene.money >= config.cost;
        
        if (item.nameText) {
          item.nameText.setColor(canAfford ? "#ffffff" : "#666666");
        }
        if (item.costText) {
          item.costText.setColor(canAfford ? "#ffd700" : "#ff4444");
        }
        if (item.btnBg) {
          item.btnBg.setFillStyle(canAfford ? 0x1a1a2e : 0x0f0f0f, canAfford ? 0.95 : 0.8);
          item.btnBg.setStrokeStyle(2, canAfford ? 0x00ccff : 0x666666, canAfford ? 0.7 : 0.5);
        }
      }
    });
  }

  openBuildMenu(pointer) {
    const T = CONFIG.TILE_SIZE * this.scene.scaleFactor;
    const tx = Math.floor((pointer.worldX - this.scene.mapStartX) / T);
    const ty = Math.floor((pointer.worldY - this.scene.mapStartY) / T);
    
    this.scene.selectedTile = { x: tx, y: ty };
    this.scene.selectedTileIsAdjacentToPath = this.scene.mapManager.isAdjacentToPath(tx, ty);
    
    const menuWidth = 320 * this.scene.scaleFactor;
    const menuHeight = 220 * this.scene.scaleFactor;
    
    let menuX = pointer.worldX;
    let menuY = pointer.worldY;
    
    if (menuX + menuWidth / 2 > this.scene.gameWidth) {
      menuX = this.scene.gameWidth - menuWidth / 2 - 10 * this.scene.scaleFactor;
    }
    if (menuX - menuWidth / 2 < 0) {
      menuX = menuWidth / 2 + 10 * this.scene.scaleFactor;
    }
    if (menuY + menuHeight / 2 > this.scene.gameHeight) {
      menuY = this.scene.gameHeight - menuHeight / 2 - 10 * this.scene.scaleFactor;
    }
    if (menuY - menuHeight / 2 < 0) {
      menuY = menuHeight / 2 + 10 * this.scene.scaleFactor;
    }
    
    this.scene.buildMenu.setPosition(menuX - menuWidth / 2, menuY - menuHeight / 2);
    this.scene.buildMenu.setVisible(true);
    this.updateBuildMenuButtons();
  }

  createUpgradeMenu() {
    this.scene.upgradeMenu = this.scene.add.container(0, 0).setVisible(false).setDepth(240);
    
    const uBgGraphics = this.scene.add.graphics();
    uBgGraphics.fillStyle(0x222222, 0.95);
    uBgGraphics.fillRoundedRect(0, 0, 320 * this.scene.scaleFactor, 220 * this.scene.scaleFactor, 10);
    uBgGraphics.lineStyle(3, 0xffffff, 0.3);
    uBgGraphics.strokeRoundedRect(0, 0, 320 * this.scene.scaleFactor, 220 * this.scene.scaleFactor, 10);
    uBgGraphics.setDepth(240);
    this.scene.upgradeMenu.add(uBgGraphics);
    
    this.scene.upgradeInfoText = null;
    
    this.scene.upgradeBtnText = this.scene.add
      .text(15 * this.scene.scaleFactor, 170 * this.scene.scaleFactor, "AMÉLIORER", {
        fontSize: `${Math.max(14, 18 * this.scene.scaleFactor)}px`,
        fill: "#ffffff",
        fontStyle: "bold",
        backgroundColor: "#00aa00",
        padding: { x: 15 * this.scene.scaleFactor, y: 8 * this.scene.scaleFactor },
      })
      .setDepth(241)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        if (this.scene.selectedTurret && this.scene.selectedTurret.getNextLevelStats()) {
          this.scene.upgradeBtnText.setBackgroundColor("#00cc00");
        }
      })
      .on("pointerout", () => {
        this.scene.upgradeBtnText.setBackgroundColor("#00aa00");
      })
      .on("pointerdown", () => {
        if (this.scene.selectedTurret && this.scene.selectedTurret.getNextLevelStats()) {
          this.scene.triggerUpgrade();
        } else {
          this.scene.upgradeMenu.setVisible(false);
          this.scene.selectedTurret = null;
        }
      });
    this.scene.upgradeMenu.add(this.scene.upgradeBtnText);
  }

  openUpgradeMenu(pointer, turret) {
    this.scene.selectedTurret = turret;
    const menuWidth = 320 * this.scene.scaleFactor;
    const menuHeight = 220 * this.scene.scaleFactor;
    const menuX = Phaser.Math.Clamp(pointer.worldX, menuWidth / 2, this.scene.gameWidth - menuWidth / 2);
    const menuY = Phaser.Math.Clamp(pointer.worldY, menuHeight / 2, this.scene.gameHeight - menuHeight / 2);
    
    this.scene.upgradeMenu.setPosition(menuX - menuWidth / 2, menuY - menuHeight / 2);
    
    if (this.scene.upgradeInfoText) {
      try {
        if (this.scene.upgradeInfoText.active) {
          this.scene.upgradeInfoText.destroy();
        }
      } catch (e) {
        console.warn("Erreur lors de la destruction d'upgradeInfoText:", e);
      }
      this.scene.upgradeInfoText = null;
    }
    
    if (this.scene.upgradeTextLines && this.scene.upgradeTextLines.length > 0) {
      this.scene.upgradeTextLines.forEach(line => {
        if (line) {
          try {
            // Retirer du container avant de détruire si possible
            if (this.scene.upgradeMenu && this.scene.upgradeMenu.remove) {
              this.scene.upgradeMenu.remove(line);
            }
            // Détruire seulement si l'objet est actif
            if (line.active !== false && line.destroy) {
              line.destroy();
            }
          } catch (e) {
            // Ignorer les erreurs de destruction (objet déjà détruit)
          }
        }
      });
      this.scene.upgradeTextLines = [];
    } else {
      this.scene.upgradeTextLines = [];
    }
    
    const fontSize = Math.max(14, 16 * this.scene.scaleFactor);
    let yPos = 20 * this.scene.scaleFactor;
    const lineHeight = 22 * this.scene.scaleFactor;
    const xPos = 15 * this.scene.scaleFactor;
    
    if (turret instanceof Barracks) {
      const level = turret.level || 1;
      const soldiersCount = turret.config.soldiersCount[level - 1] || 2;
      const respawnTime = turret.config.respawnTime[level - 1] || 12000;
      const soldierHp = turret.config.soldierHp[level - 1] || 100;
      const nextStats = turret.getNextLevelStats();
      
      const title = this.scene.add.text(xPos, yPos, `Caserne - Niveau ${level}`, {
        fontSize: `${fontSize + 2}px`,
        fill: "#ffffff",
        fontStyle: "bold",
      }).setDepth(241);
      this.scene.upgradeTextLines.push(title);
      this.scene.upgradeMenu.add(title);
      yPos += lineHeight * 1.5;
      
      if (nextStats) {
        const nextSoldiers = turret.config.soldiersCount[level] || 3;
        const nextRespawn = turret.config.respawnTime[level] || 10000;
        const nextHp = turret.config.soldierHp[level] || 120;
        
        const soldiersText = this.scene.add.text(xPos, yPos, `Soldats : ${soldiersCount} > `, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
        }).setDepth(241);
        const soldiersNext = this.scene.add.text(xPos + soldiersText.width, yPos, `${nextSoldiers}`, {
          fontSize: `${fontSize}px`,
          fill: "#00ff00",
          fontStyle: "bold",
        }).setDepth(241);
        this.scene.upgradeTextLines.push(soldiersText, soldiersNext);
        this.scene.upgradeMenu.add([soldiersText, soldiersNext]);
        yPos += lineHeight;
        
        const respawnText = this.scene.add.text(xPos, yPos, `Respawn : ${(respawnTime / 1000).toFixed(1)}s > `, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
        }).setDepth(241);
        const respawnNext = this.scene.add.text(xPos + respawnText.width, yPos, `${(nextRespawn / 1000).toFixed(1)}s`, {
          fontSize: `${fontSize}px`,
          fill: "#00ff00",
          fontStyle: "bold",
        }).setDepth(241);
        this.scene.upgradeTextLines.push(respawnText, respawnNext);
        this.scene.upgradeMenu.add([respawnText, respawnNext]);
        yPos += lineHeight;
        
        const hpText = this.scene.add.text(xPos, yPos, `HP Soldat : ${soldierHp} > `, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
        }).setDepth(241);
        const hpNext = this.scene.add.text(xPos + hpText.width, yPos, `${nextHp}`, {
          fontSize: `${fontSize}px`,
          fill: "#00ff00",
          fontStyle: "bold",
        }).setDepth(241);
        this.scene.upgradeTextLines.push(hpText, hpNext);
        this.scene.upgradeMenu.add([hpText, hpNext]);
        yPos += lineHeight * 1.5;
        
        const costText = this.scene.add.text(xPos, yPos, `Coût : `, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
        }).setDepth(241);
        const costValue = this.scene.add.text(xPos + costText.width, yPos, `${nextStats.cost}$`, {
          fontSize: `${fontSize}px`,
          fill: "#ffd700",
          fontStyle: "bold",
        }).setDepth(241);
        this.scene.upgradeTextLines.push(costText, costValue);
        this.scene.upgradeMenu.add([costText, costValue]);
      } else {
        const soldiersText = this.scene.add.text(xPos, yPos, `Soldats : ${soldiersCount}`, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
        }).setDepth(241);
        this.scene.upgradeTextLines.push(soldiersText);
        this.scene.upgradeMenu.add(soldiersText);
        yPos += lineHeight;
        
        const respawnText = this.scene.add.text(xPos, yPos, `Respawn : ${(respawnTime / 1000).toFixed(1)}s`, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
        }).setDepth(241);
        this.scene.upgradeTextLines.push(respawnText);
        this.scene.upgradeMenu.add(respawnText);
        yPos += lineHeight;
        
        const hpText = this.scene.add.text(xPos, yPos, `HP Soldat : ${soldierHp}`, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
        }).setDepth(241);
        this.scene.upgradeTextLines.push(hpText);
        this.scene.upgradeMenu.add(hpText);
        yPos += lineHeight * 1.5;
        
        const maxText = this.scene.add.text(xPos, yPos, `Niveau Maximum`, {
          fontSize: `${fontSize}px`,
          fill: "#ff0000",
          fontStyle: "bold",
        }).setDepth(241);
        this.scene.upgradeTextLines.push(maxText);
        this.scene.upgradeMenu.add(maxText);
      }
    } else {
      const level = turret.level || 1;
      const nextStats = turret.getNextLevelStats();
      
      const title = this.scene.add.text(xPos, yPos, `${turret.config.name} - Niveau ${level}`, {
        fontSize: `${fontSize + 2}px`,
        fill: "#ffffff",
        fontStyle: "bold",
      }).setDepth(241);
      this.scene.upgradeTextLines.push(title);
      this.scene.upgradeMenu.add(title);
      yPos += lineHeight * 1.5;
      
      if (nextStats) {
        const currentDamage = turret.config.damage || 0;
        const currentRate = turret.config.rate || 0;
        const currentRange = turret.config.range || 0;
        
        const damageText = this.scene.add.text(xPos, yPos, `Dégâts : ${currentDamage} > `, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
        }).setDepth(241);
        const damageNext = this.scene.add.text(xPos + damageText.width, yPos, `${nextStats.damage || 0}`, {
          fontSize: `${fontSize}px`,
          fill: "#00ff00",
          fontStyle: "bold",
        }).setDepth(241);
        this.scene.upgradeTextLines.push(damageText, damageNext);
        this.scene.upgradeMenu.add([damageText, damageNext]);
        yPos += lineHeight;
        
        const rateText = this.scene.add.text(xPos, yPos, `Cadence : ${(currentRate / 1000).toFixed(1)}s > `, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
        }).setDepth(241);
        const rateNext = this.scene.add.text(xPos + rateText.width, yPos, `${((nextStats.rate || 0) / 1000).toFixed(1)}s`, {
          fontSize: `${fontSize}px`,
          fill: "#00ff00",
          fontStyle: "bold",
        }).setDepth(241);
        this.scene.upgradeTextLines.push(rateText, rateNext);
        this.scene.upgradeMenu.add([rateText, rateNext]);
        yPos += lineHeight;
        
        const rangeText = this.scene.add.text(xPos, yPos, `Portée : ${currentRange} > `, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
        }).setDepth(241);
        const rangeNext = this.scene.add.text(xPos + rangeText.width, yPos, `${nextStats.range || 0}`, {
          fontSize: `${fontSize}px`,
          fill: "#00ff00",
          fontStyle: "bold",
        }).setDepth(241);
        this.scene.upgradeTextLines.push(rangeText, rangeNext);
        this.scene.upgradeMenu.add([rangeText, rangeNext]);
        yPos += lineHeight;
        
        if (nextStats.aoe) {
          const aoeText = this.scene.add.text(xPos, yPos, `Zone : ${turret.config.aoe || 0} > `, {
            fontSize: `${fontSize}px`,
            fill: "#ffffff",
          }).setDepth(241);
          const aoeNext = this.scene.add.text(xPos + aoeText.width, yPos, `${nextStats.aoe}`, {
            fontSize: `${fontSize}px`,
            fill: "#00ff00",
            fontStyle: "bold",
          }).setDepth(241);
          this.scene.upgradeTextLines.push(aoeText, aoeNext);
          this.scene.upgradeMenu.add([aoeText, aoeNext]);
          yPos += lineHeight;
        }
        
        yPos += lineHeight * 0.5;
        
        const costText = this.scene.add.text(xPos, yPos, `Coût : `, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
        }).setDepth(241);
        const costValue = this.scene.add.text(xPos + costText.width, yPos, `${nextStats.cost}$`, {
          fontSize: `${fontSize}px`,
          fill: "#ffd700",
          fontStyle: "bold",
        }).setDepth(241);
        this.scene.upgradeTextLines.push(costText, costValue);
        this.scene.upgradeMenu.add([costText, costValue]);
      } else {
        const currentDamage = turret.config.damage || 0;
        const currentRate = turret.config.rate || 0;
        const currentRange = turret.config.range || 0;
        
        const damageText = this.scene.add.text(xPos, yPos, `Dégâts : ${currentDamage}`, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
        }).setDepth(241);
        this.scene.upgradeTextLines.push(damageText);
        this.scene.upgradeMenu.add(damageText);
        yPos += lineHeight;
        
        const rateText = this.scene.add.text(xPos, yPos, `Cadence : ${(currentRate / 1000).toFixed(1)}s`, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
        }).setDepth(241);
        this.scene.upgradeTextLines.push(rateText);
        this.scene.upgradeMenu.add(rateText);
        yPos += lineHeight;
        
        const rangeText = this.scene.add.text(xPos, yPos, `Portée : ${currentRange}`, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
        }).setDepth(241);
        this.scene.upgradeTextLines.push(rangeText);
        this.scene.upgradeMenu.add(rangeText);
        yPos += lineHeight;
        
        if (turret.config.aoe) {
          const aoeText = this.scene.add.text(xPos, yPos, `Zone : ${turret.config.aoe}`, {
            fontSize: `${fontSize}px`,
            fill: "#ffffff",
          }).setDepth(241);
          this.scene.upgradeTextLines.push(aoeText);
          this.scene.upgradeMenu.add(aoeText);
          yPos += lineHeight;
        }
        
        yPos += lineHeight * 0.5;
        
        const maxText = this.scene.add.text(xPos, yPos, `Niveau Maximum`, {
          fontSize: `${fontSize}px`,
          fill: "#ff0000",
          fontStyle: "bold",
        }).setDepth(241);
        this.scene.upgradeTextLines.push(maxText);
        this.scene.upgradeMenu.add(maxText);
      }
    }
    
    const finalNextStats = turret.getNextLevelStats ? turret.getNextLevelStats() : null;
    this.scene.upgradeBtnText.setPosition(15 * this.scene.scaleFactor, menuHeight - 50 * this.scene.scaleFactor);
    this.scene.upgradeBtnText.setText(finalNextStats ? "AMÉLIORER" : "FERMER");
    if (finalNextStats) {
      this.scene.upgradeBtnText.setBackgroundColor("#00aa00");
    } else {
      this.scene.upgradeBtnText.setBackgroundColor("#666666");
    }
    
    this.scene.upgradeMenu.setVisible(true);
  }
}
