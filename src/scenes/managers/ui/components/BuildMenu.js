import { CONFIG } from "../../../../config/settings.js";
import { TURRETS } from "../../../../config/turrets/index.js";
import {
  applyBuildBtnStateOctagon,
  createBuildBtnOctagon,
} from "./helpers/BuildMenuButtons.js";

export class BuildMenu {
  constructor(scene) {
    this.scene = scene;
    this.buildButtons = [];
    this.currentTooltip = null;
  }

  create() {
    const s = this.scene.scaleFactor;

    this.buildButtons = [];

    const menu = (this.scene.buildMenu = this.scene.add
      .container(0, 0)
      .setVisible(false)
      .setDepth(240));

    const turrets = [
      TURRETS.machine_gun,
      TURRETS.sniper,
      TURRETS.cannon,
      TURRETS.zap,
      TURRETS.barracks,
    ];

    const pad = 18 * s;
    const btnSize = 62 * s;
    const radius = 105 * s;
    const titleH = 44 * s;

    const menuWidth = pad * 2 + (radius + btnSize / 2) * 2;
    const menuHeight = pad * 2 + titleH + (radius + btnSize / 2) * 2;

    const cx = menuWidth / 2;
    const cy = pad + titleH + (menuHeight - pad * 2 - titleH) / 2;

    const titleBg = this.scene.add
      .rectangle(cx, pad + 14 * s, 210 * s, 40 * s, 0x000000, 0.55)
      .setOrigin(0.5)
      .setDepth(240);

    const title = this.scene.add
      .text(cx, pad + 14 * s, "CONSTRUIRE", {
        fontFamily: "Arial",
        fontStyle: "bold",
        fontSize: `${Math.round(30 * s)}px`,
        fill: "#00ccff",
        stroke: "#001a2a",
        strokeThickness: Math.round(4 * s),
      })
      .setOrigin(0.5)
      .setDepth(241);

    menu.add([titleBg, title]);

    const anglesDeg = [-90, -18, 54, 126, 198];

    turrets.forEach((cfg, i) => {
      const a = Phaser.Math.DegToRad(anglesDeg[i]);
      const x = cx + Math.cos(a) * radius;
      const y = cy + Math.sin(a) * radius;

      const btn = createBuildBtnOctagon(this, x, y, btnSize, cfg);
      menu.add(btn);
      this.buildButtons.push(btn);
    });

    this.scene._buildMenuSize = { w: menuWidth, h: menuHeight };
  }

  showTurretTooltip(btnContainer, description) {
    const s = this.scene.scaleFactor;

    if (this.currentTooltip) {
      this.currentTooltip.destroy();
    }

    const btnX = btnContainer.x + (this.scene.buildMenu.x || 0);
    const btnY = btnContainer.y + (this.scene.buildMenu.y || 0);

    const tooltipContainer = this.scene.add.container(0, 0).setDepth(300);
    this.currentTooltip = tooltipContainer;

    const tooltipBg = this.scene.add.graphics();
    const padding = 15 * s;
    const maxWidth = 350 * s;

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

    const tooltipX = btnX + 60 * s;
    const tooltipY = btnY;

    tooltipBg.fillStyle(0x000000, 0.95);
    tooltipBg.fillRoundedRect(0, 0, tooltipWidth, tooltipHeight, 8);
    tooltipBg.lineStyle(2, 0x00ccff, 1);
    tooltipBg.strokeRoundedRect(0, 0, tooltipWidth, tooltipHeight, 8);

    const descText = this.scene.add.text(padding, padding, description, {
      fontSize: `${Math.max(11, 12 * s)}px`,
      fill: "#ffffff",
      fontFamily: "Arial",
      wordWrap: { width: maxWidth - padding * 2 },
      lineSpacing: 4 * s,
    });

    tooltipContainer.add([tooltipBg, descText]);
    tooltipContainer.setPosition(tooltipX, tooltipY);

    if (tooltipX + tooltipWidth > this.scene.gameWidth) {
      tooltipContainer.setX(btnX - tooltipWidth - 10 * s);
    }
    if (tooltipY + tooltipHeight > this.scene.gameHeight) {
      tooltipContainer.setY(this.scene.gameHeight - tooltipHeight - 10 * s);
    }
  }

  applyBuildBtnStateOctagon(btnContainer) {
    applyBuildBtnStateOctagon(this.scene, btnContainer);
  }

  applyBuildBtnState(btnContainer) {
    this.applyBuildBtnStateOctagon(btnContainer);
  }

  updateBuildMenuButtons() {
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
}
