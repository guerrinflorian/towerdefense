export class TreeMenu {
  constructor(scene) {
    this.scene = scene;
  }

  create() {
    const s = this.scene.scaleFactor;

    this.scene.treeRemovalMenu = this.scene.add
      .container(0, 0)
      .setVisible(false)
      .setDepth(250);

    const menuWidth = 280 * s;
    const menuHeight = 140 * s;

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x000000, 0.5);
    bg.fillRoundedRect(4 * s, 4 * s, menuWidth, menuHeight, 16);
    bg.fillStyle(0x0f0f1a, 0.98);
    bg.fillRoundedRect(0, 0, menuWidth, menuHeight, 16);
    bg.lineStyle(3, 0xff6600, 1);
    bg.strokeRoundedRect(0, 0, menuWidth, menuHeight, 16);
    bg.lineStyle(2, 0xcc4400, 0.6);
    bg.strokeRoundedRect(2 * s, 2 * s, menuWidth - 4 * s, menuHeight - 4 * s, 14);

    this.scene.treeRemovalMenu.add(bg);

    this.scene.treeRemovalText = this.scene.add
      .text(menuWidth / 2, 35 * s, "", {
        fontSize: `${Math.max(10, 12 * s)}px`,
        fill: "#ffffff",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: menuWidth - 40 * s },
      })
      .setOrigin(0.5)
      .setDepth(251);

    this.scene.treeRemovalMenu.add(this.scene.treeRemovalText);

    const yesBtn = this.scene.add
      .text(menuWidth / 2 - 60 * s, 90 * s, "OUI", {
        fontSize: `${Math.max(10, 12 * s)}px`,
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
            this.scene.earnMoney(-25);
            this.scene.treeRemovalMenu.setVisible(false);
            this.scene.treeRemovalTile = null;
          } else {
            this.scene.cameras.main.shake(50, 0.005);
          }
        }
      });

    const noBtn = this.scene.add
      .text(menuWidth / 2 + 60 * s, 90 * s, "NON", {
        fontSize: `${Math.max(10, 12 * s)}px`,
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

    if (!this.scene.treeRemovalMenu) {
      this.create();
    }

    this.scene.treeRemovalTile = { tx, ty };

    const menuWidth = 280 * s;
    const menuHeight = 140 * s;

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

    const canAfford = this.scene.money >= 25;
    const costText = canAfford ? "25" : "25 (insuffisant)";

    this.scene.treeRemovalText.setText([
      "Voulez-vous enlever",
      "cet arbre pour",
      `${costText} pièces ?`,
    ]);

    if (canAfford) {
      this.scene.treeRemovalText.setColor("#ffffff");
    } else {
      this.scene.treeRemovalText.setColor("#ff4444");
    }

    this.scene.treeRemovalMenu.setVisible(true);
  }
}
