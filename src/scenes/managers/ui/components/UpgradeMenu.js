import { Barracks } from "../../../../objects/Barracks.js";
import {
  renderBarracksUpgrade,
  renderTurretUpgrade,
} from "./helpers/UpgradeRenderers.js";

export class UpgradeMenu {
  constructor(scene) {
    this.scene = scene;
  }

  create() {
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
          this.scene.cameras.main.shake(50, 0.005);
        }
      });

    this.scene.upgradeMenu.add(this.scene.upgradeBtnText);

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
      trashIcon.fillRect(
        trashX - trashSize / 2,
        trashY - trashSize / 2,
        trashSize,
        trashSize * 0.8
      );
      trashIcon.fillStyle(0xcc0000, 1);
      trashIcon.fillRect(
        trashX - trashSize / 2 + 2 * s,
        trashY - trashSize / 2 + 2 * s,
        trashSize - 4 * s,
        trashSize * 0.6
      );
      trashIcon.fillStyle(color, 1);
      trashIcon.fillRect(
        trashX - trashSize / 2 - 2 * s,
        trashY - trashSize / 2 - 3 * s,
        trashSize + 4 * s,
        4 * s
      );
      trashIcon.fillStyle(0xffffff, 1);
      trashIcon.fillRect(
        trashX - trashSize / 2 - 4 * s,
        trashY - trashSize / 2 + 2 * s,
        2 * s,
        6 * s
      );
      trashIcon.fillRect(
        trashX + trashSize / 2 + 2 * s,
        trashY - trashSize / 2 + 2 * s,
        2 * s,
        6 * s
      );
    };

    drawTrash();

    trashIcon.setDepth(241);
    trashIcon.setInteractive(
      new Phaser.Geom.Rectangle(
        trashX - trashSize / 2 - 4 * s,
        trashY - trashSize / 2 - 3 * s,
        trashSize + 8 * s,
        trashSize + 6 * s
      ),
      Phaser.Geom.Rectangle.Contains
    );
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

      this.scene.selectedTurret.destroy();
      this.scene.earnMoney(refund);

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
      renderBarracksUpgrade(this.scene, turret, xPos, yPos, lineHeight, fontSize);
    } else {
      renderTurretUpgrade(this.scene, turret, xPos, yPos, lineHeight, fontSize);
    }

    const finalNextStats = turret.getNextLevelStats
      ? turret.getNextLevelStats()
      : null;

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
}
