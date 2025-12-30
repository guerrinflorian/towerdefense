/**
 * Composant Avatar du héros
 * Gère l'affichage et la mise à jour de l'avatar du héros
 */

import { getHeroStats } from "../../../services/authManager.js";
import { drawHeroBody } from "../../../objects/HeroDesigns.js";
import { drawWeapon } from "../../../objects/HeroWeapons.js";

export class HeroAvatarComponent {
  constructor(scene, config, parentContainer) {
    this.scene = scene;
    this.config = config;
    this.parentContainer = parentContainer;
    
    this.avatarContainer = null;
    this.avatarFrame = null;
    this.avatarFrameBg = null;
    this.avatarBodyContainer = null;
    this.avatarBodyGraphics = null;
    this.killsText = null;
    this.penBtn = null;
  }

  create(x, y, onColorPickerClick) {
    // Si un avatar existe déjà, le détruire d'abord
    if (this.avatarContainer) {
      this.destroy();
    }
    
    const size = this.config.avatarSize;
    const container = this.scene.add.container(x, y);

    // Frame avec fond et bordure
    const frameBg = this.scene.add.rectangle(0, 0, size, size, 0x1a2a3a, 0.1);
    frameBg.setOrigin(0, 0);
    frameBg.setDepth(1);
    
    const frameBorder = this.scene.add.graphics();
    frameBorder.lineStyle(2, this.config.accentColor, 0.5);
    frameBorder.strokeRect(-2, -2, size + 4, size + 4);

    const scale = size / 50;
    const centerX = size / 2;
    const centerY = size / 2;

    const stats = getHeroStats();
    const heroColor = stats?.color || "#2b2b2b";
    const heroId = stats?.hero_id ?? 1;

    container.add(frameBg);
    
    // Container pour le corps
    const bodyContainer = this.scene.add.container(centerX, centerY);
    const bodyGraphics = this.scene.make.graphics({ add: false });
    
    // Dessiner le corps
    drawHeroBody(bodyGraphics, scale, 1, heroId, heroColor);
    bodyContainer.add(bodyGraphics);
    
    bodyContainer.setDepth(5);
    bodyGraphics.setDepth(5);
    container.add(bodyContainer);
    container.add(frameBorder);

    // Ajouter les armes
    const weaponData = drawWeapon(this.scene, heroId, scale, 1);
    
    if (weaponData.swordGroup) {
      weaponData.swordGroup.setPosition(centerX, centerY);
      weaponData.swordGroup.setDepth(10);
      container.add(weaponData.swordGroup);
    }
    if (weaponData.secondWeaponGroup) {
      weaponData.secondWeaponGroup.setPosition(centerX, centerY);
      weaponData.secondWeaponGroup.setDepth(10);
      container.add(weaponData.secondWeaponGroup);
    }

    this.parentContainer.add(container);

    // Bouton de sélection de couleur
    const penBtn = this.scene.add.container(x + size - 5, y + 5);
    const penBg = this.scene.add
      .circle(0, 0, 12, 0x00eaff, 0.2)
      .setStrokeStyle(1, 0x00eaff);
    const resolution = window.devicePixelRatio || 1;
    const penIcon = this.scene.add
      .text(0, 0, "✏️", { fontSize: "14px", resolution })
      .setOrigin(0.5);
    penBtn.add([penBg, penIcon]);
    penBtn.setSize(24, 24).setInteractive({ useHandCursor: true });

    penBtn.on("pointerover", () => penBg.setFillStyle(0x00eaff, 0.5));
    penBtn.on("pointerout", () => penBg.setFillStyle(0x00eaff, 0.2));
    penBtn.on("pointerdown", onColorPickerClick);

    this.parentContainer.add(penBtn);

    // Texte des kills
    this.killsText = this.scene.add
      .text(x + size / 2, y + size + 15, "", {
        fontSize: "15px",
        fontFamily: "Arial",
        color: "#ff6b6b",
        fontWeight: "bold",
        resolution,
      })
      .setOrigin(0.5);
    this.parentContainer.add(this.killsText);

    // Texte du nombre d'ennemis retenus
    this.enemiesRetainedText = this.scene.add
      .text(x + size / 2, y + size + 32, "", {
        fontSize: "12px",
        fontFamily: "Arial",
        color: "#7dd0ff",
        fontWeight: "bold",
        resolution,
      })
      .setOrigin(0.5);
    this.parentContainer.add(this.enemiesRetainedText);

    // Stocker les références
    this.avatarFrame = frameBorder;
    this.avatarFrameBg = frameBg;
    this.avatarContainer = container;
    this.avatarBodyContainer = bodyContainer;
    this.avatarBodyGraphics = bodyGraphics;
    this.penBtn = penBtn;
  }

  redraw(color) {
    const size = this.config.avatarSize;
    const scale = size / 50;
    const centerX = size / 2;
    const centerY = size / 2;
    const stats = getHeroStats();
    const heroId = stats?.hero_id ?? 1;

    // Nettoyer la bordure
    if (this.avatarFrame) {
      this.avatarFrame.clear();
      this.avatarFrame.lineStyle(2, this.config.accentColor, 0.5);
      this.avatarFrame.strokeRect(-2, -2, size + 4, size + 4);
    }

    // Redessiner le corps
    if (this.avatarBodyContainer) {
      this.avatarBodyContainer.removeAll(true);
      const bodyGraphics = this.scene.add.graphics();
      drawHeroBody(bodyGraphics, scale, 1, heroId, color);
      this.avatarBodyContainer.add(bodyGraphics);
    } else {
      const bodyGraphics = this.scene.add.graphics();
      this.avatarBodyContainer = this.scene.add.container(centerX, centerY);
      this.avatarBodyContainer.setDepth(5);
      drawHeroBody(bodyGraphics, scale, 1, heroId, color);
      this.avatarBodyContainer.add(bodyGraphics);
      if (this.avatarContainer) {
        this.avatarContainer.add(this.avatarBodyContainer);
      }
    }

    // Supprimer uniquement les armes (garder fond + corps + frame)
    if (this.avatarContainer) {
      const keep = new Set([this.avatarFrame, this.avatarFrameBg, this.avatarBodyContainer]);
      this.avatarContainer.list.slice().forEach(child => {
        if (!keep.has(child)) {
          child.destroy();
        }
      });

      // Safety : réajouter si nécessaire
      if (this.avatarFrameBg && !this.avatarContainer.list.includes(this.avatarFrameBg)) {
        this.avatarContainer.addAt(this.avatarFrameBg, 0);
      }
      if (this.avatarBodyContainer && !this.avatarContainer.list.includes(this.avatarBodyContainer)) {
        this.avatarContainer.add(this.avatarBodyContainer);
      }
      if (this.avatarFrame && !this.avatarContainer.list.includes(this.avatarFrame)) {
        this.avatarContainer.add(this.avatarFrame);
      }
    }

    // Redessiner les armes
    if (this.avatarContainer) {
      const weaponData = drawWeapon(this.scene, heroId, scale, 1);
      if (weaponData.swordGroup) {
        weaponData.swordGroup.setPosition(centerX, centerY);
        this.avatarContainer.add(weaponData.swordGroup);
      }
      if (weaponData.secondWeaponGroup) {
        weaponData.secondWeaponGroup.setPosition(centerX, centerY);
        this.avatarContainer.add(weaponData.secondWeaponGroup);
      }
    }
  }

  updateKills(kills) {
    if (this.killsText) {
      this.killsText.setText(`${kills || 0}☠️`);
    }
  }

  updateEnemiesRetained(enemiesRetained) {
    if (this.enemiesRetainedText) {
      // S'assurer que la valeur est bien un nombre
      const value = (enemiesRetained != null && enemiesRetained !== undefined) 
        ? Number(enemiesRetained) 
        : 1;
      this.enemiesRetainedText.setText(`🛡️ ${value} ennemi${value > 1 ? 's' : ''} simultané${value > 1 ? 's' : ''}`);
    }
  }

  destroy() {
    if (this.avatarContainer) {
      this.avatarContainer.destroy();
      this.avatarContainer = null;
    }
    if (this.killsText) {
      this.killsText.destroy();
      this.killsText = null;
    }
    if (this.enemiesRetainedText) {
      this.enemiesRetainedText.destroy();
      this.enemiesRetainedText = null;
    }
    if (this.penBtn) {
      this.penBtn.destroy();
      this.penBtn = null;
    }
    this.avatarFrame = null;
    this.avatarFrameBg = null;
    this.avatarBodyContainer = null;
    this.avatarBodyGraphics = null;
  }
}

