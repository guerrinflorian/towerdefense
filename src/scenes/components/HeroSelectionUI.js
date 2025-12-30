import { fetchHeroes, unlockHero as apiUnlockHero } from "../../services/heroService.js";
import { getSelectedHeroId, setSelectedHeroId, getHeroPointsAvailable } from "../../services/authManager.js";
import { isAuthenticated } from "../../services/authManager.js";
import { showAuth } from "../../services/authOverlay.js";
import { drawHeroBody } from "../../objects/HeroDesigns.js";
import { drawWeapon } from "../../objects/HeroWeapons.js";

// ---------------------------------------------------------
// Utils
// ---------------------------------------------------------
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function safeNum(n, fallback = 0) {
  const x = Number(n);
  return Number.isFinite(x) ? x : fallback;
}
function truncateDecimals(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.floor((value ?? 0) * factor) / factor;
}
function formatSeconds(ms) {
  const s = truncateDecimals(safeNum(ms) / 1000, 3);
  return `${s.toFixed(3)}s`;
}
function plural(n, singular, pluralForm) {
  return n > 1 ? pluralForm : singular;
}
function res() {
  return window.devicePixelRatio || 1;
}

// ---------------------------------------------------------
// HeroSelectionUI
// ---------------------------------------------------------
export class HeroSelectionUI extends Phaser.GameObjects.Container {
  constructor(scene, x = 0, y = 0) {
    super(scene, x, y);

    this.heroes = [];
    this.heroCards = new Map();

    this.selectedHeroId = getSelectedHeroId();
    this.heroPointsAvailable = getHeroPointsAvailable?.() ?? 0;

    this.isUnlocking = false;
    this.scrollY = 0;
    this.maxScrollY = 0;

    this._destroyed = false;

    // Root overlay + panel
    this._overlay = null;
    this._panel = null;

    // Panel parts
    this._panelBg = null;
    this._titleText = null;
    this._pointsText = null;
    this._closeBtn = null;
    this._closeText = null;

    // Viewport list
    this._viewport = null;
    this.heroesContainer = null;

    // Mask
    this._maskGfx = null;

    // Input zones (ONLY viewport)
    this._scrollZone = null;

    // Drag state
    this._drag = { active: false, startY: 0, startScroll: 0 };

    // Layout
    this.cfg = null;

    // Build + events
    this._build();
    this._bindResize();
    this._loadHeroes();

    scene.add.existing(this);
    this.setDepth(999); // au-dessus
  }

  // --------------------------
  // Build
  // --------------------------
  _build() {
    // Container root - sera positionné dans _layout()
    // On le laisse à (0,0) pour l'instant
    this.setPosition(0, 0);

    // Overlay (dark background) - couvre tout l'écran
    // Sera repositionné dans _layout() pour couvrir tout l'écran
    this._overlay = this.scene.add.rectangle(0, 0, 10, 10, 0x000000, 0.55);
    this._overlay.setOrigin(0, 0);
    this._overlay.setInteractive({ useHandCursor: false });
    this._overlay.on("pointerdown", () => this.destroy());
    this.add(this._overlay);

    // Panel container
    this._panel = this.scene.add.container(0, 0);
    this.add(this._panel);

    // Background graphics
    this._panelBg = this.scene.add.graphics();
    this._panel.add(this._panelBg);

    // Title
    this._titleText = this.scene.add.text(0, 0, "SÉLECTION DE HÉROS", {
      fontFamily: "Impact, sans-serif",
      fontSize: "24px", // Réduit
      color: "#ffffff",
      backgroundColor: "#050a10",
      padding: { x: 8, y: 2 },
      resolution: res(),
    });
    this._titleText.setOrigin(0.5, 0);
    this._panel.add(this._titleText);

    // Points
    this._pointsText = this.scene.add.text(0, 0, "", {
      fontFamily: "Orbitron, sans-serif",
      fontSize: "14px",
      color: "#7dd0ff",
      resolution: res(),
    });
    this._pointsText.setOrigin(0, 0.5);
    this._panel.add(this._pointsText);

    // Close button (TOP)
    this._closeBtn = this.scene.add.rectangle(0, 0, 34, 34, 0x00eaff, 0.9);
    this._closeBtn.setInteractive({ useHandCursor: true });
    this._closeBtn.on("pointerover", () => this._closeBtn?.setAlpha(1));
    this._closeBtn.on("pointerout", () => this._closeBtn?.setAlpha(0.9));
    this._closeBtn.on("pointerdown", (p) => {
      // Stop propagation: on évite que ça traverse vers overlay
      p?.event?.stopPropagation?.();
      this.destroy();
    });
    this._panel.add(this._closeBtn);

    this._closeText = this.scene.add.text(0, 0, "×", {
      fontFamily: "Arial Black, Arial",
      fontSize: "24px",
      color: "#ffffff",
      resolution: res(),
    });
    this._closeText.setOrigin(0.5);
    this._panel.add(this._closeText);

    // Viewport
    this._viewport = this.scene.add.container(0, 0);
    this._panel.add(this._viewport);

    // List container (inside viewport)
    this.heroesContainer = this.scene.add.container(0, 0);
    this._viewport.add(this.heroesContainer);

    // Mask graphics (IMPORTANT: must be in display list -> follows panel)
    this._maskGfx = this.scene.add.graphics();
    this._maskGfx.setVisible(false);
    this._panel.add(this._maskGfx);

    // Scroll zone (ONLY viewport area)
    this._scrollZone = this.scene.add.zone(0, 0, 10, 10);
    this._scrollZone.setOrigin(0, 0);
    this._scrollZone.setInteractive({ useHandCursor: false });
    this._panel.add(this._scrollZone);

    // Wheel
    this._scrollZone.on("wheel", (pointer, gameObjects, dx, dy) => {
      if (this._destroyed) return;
      if (this.maxScrollY <= 0) return;

      const speed = 0.75;
      this.scrollY = clamp(this.scrollY + dy * speed, 0, this.maxScrollY);
      this._applyScroll();
    });

    // Drag (mouse/touch)
    this._scrollZone.on("pointerdown", (p) => {
      if (this.maxScrollY <= 0) return;
      this._drag.active = true;
      this._drag.startY = p.y;
      this._drag.startScroll = this.scrollY;
    });

    this._scrollZone.on("pointermove", (p) => {
      if (!this._drag.active) return;
      const dy = p.y - this._drag.startY;
      this.scrollY = clamp(this._drag.startScroll - dy, 0, this.maxScrollY);
      this._applyScroll();
    });

    const endDrag = () => (this._drag.active = false);
    this._scrollZone.on("pointerup", endDrag);
    this._scrollZone.on("pointerupoutside", endDrag);

    // Make panel click NOT close (stop overlay click-through)
    // (overlay is behind, so ok, but this prevents weird cases)
    // Créer AVANT _layout() pour qu'il soit disponible
    const panelHit = this.scene.add.rectangle(0, 0, 10, 10, 0x000000, 0.001);
    panelHit.setOrigin(0, 0);
    panelHit.setInteractive({ useHandCursor: false });
    panelHit.on("pointerdown", (p) => p?.event?.stopPropagation?.());
    this._panel.addAt(panelHit, 1);
    this._panelHit = panelHit;

    // Initial layout (après création de _panelHit)
    this._layout(false);
  }

  _bindResize() {
    this._resizeHandler = () => {
      if (this._destroyed) return;
      this._layout(true);
    };
    this.scene.scale.on("resize", this._resizeHandler);
  }

  // --------------------------
  // Layout
  // --------------------------
  _layout(forceRerender) {
    const sw = this.scene.scale.width;
    const sh = this.scene.scale.height;

    // Panel responsive - plus petit pour que tout rentre
    const panelW = clamp(sw * 0.75, 480, 720);
    const panelH = clamp(sh * 0.75, 400, 650);
    const padding = clamp(Math.round(panelW * 0.025), 14, 26);

    const accentColor = 0x00eaff;
    const bgColor = 0x050a10;

    const headerH = 60; // title+points+close (réduit)
    const footerPad = 15;

    const viewportX = padding;
    const viewportY = padding + headerH;
    const viewportW = panelW - padding * 2;
    const viewportH = panelH - (padding + headerH) - footerPad;

    const cardH = clamp(Math.round(viewportH * 0.18), 100, 130); // Réduit
    const rowGap = clamp(Math.round(cardH * 0.10), 8, 15);
    const avatarSize = clamp(Math.round(cardH * 0.65), 65, 85); // Réduit

    this.cfg = {
      panelW,
      panelH,
      padding,
      accentColor,
      bgColor,
      headerH,
      viewportX,
      viewportY,
      viewportW,
      viewportH,
      cardW: viewportW,
      cardH,
      rowGap,
      avatarSize,
    };

    // Calculer la position du panel pour le centrer dans la scène
    const panelX = Math.round((sw - panelW) / 2);
    const panelY = Math.round((sh - panelH) / 2);
    
    // Overlay full screen - couvre tout l'écran (positionné à (0,0) dans le container root)
    this._overlay.setSize(sw, sh);
    this._overlay.setPosition(0, 0);
    
    // Le container root reste à (0,0) dans la scène
    // Le panel est positionné pour être centré dans la scène
    this._panel.setPosition(panelX, panelY);

    // Draw background
    this._panelBg.clear();
    this._panelBg.fillStyle(bgColor, 0.98);
    this._panelBg.lineStyle(3, accentColor, 1);
    this._panelBg.fillRoundedRect(0, 0, panelW, panelH, 16);
    this._panelBg.strokeRoundedRect(0, 0, panelW, panelH, 16);

    // Panel hit area (si elle existe)
    if (this._panelHit) {
      this._panelHit.setPosition(0, 0);
      this._panelHit.setSize(panelW, panelH);
    }

    // Title
    this._titleText.setPosition(panelW / 2, padding);
    this._titleText.setFontSize(clamp(Math.round(panelW * 0.030), 18, 24)); // Réduit
    this._titleText.setResolution(res());

    // Points
    this._pointsText.setPosition(padding, padding + 35);
    this._pointsText.setResolution(res());
    this._updatePointsText();

    // Close top-right
    const cx = panelW - padding - 15;
    const cy = padding + 15;
    this._closeBtn.setPosition(cx, cy);
    this._closeText.setPosition(cx, cy);

    // Viewport placement
    this._viewport.setPosition(viewportX, viewportY);

    // Mask rectangle follows panel (IMPORTANT)
    this._maskGfx.clear();
    this._maskGfx.fillStyle(0xffffff, 1);
    // mask drawn in panel local coords, so it matches viewport position
    this._maskGfx.fillRect(viewportX, viewportY, viewportW, viewportH);
    const mask = this._maskGfx.createGeometryMask();
    this.heroesContainer.setMask(mask);

    // Scroll zone EXACT viewport only (does not cover close button)
    this._scrollZone.setPosition(viewportX, viewportY);
    this._scrollZone.setSize(viewportW, viewportH);

    // Recompute scroll bounds
    this._recomputeScrollBounds();
    this._applyScroll();

    if (forceRerender) this._renderHeroes();
  }

  _recomputeScrollBounds() {
    if (!this.cfg) return;
    const totalH = this.heroes.length * (this.cfg.cardH + this.cfg.rowGap);
    this.maxScrollY = Math.max(0, totalH - this.cfg.viewportH);
    this.scrollY = clamp(this.scrollY, 0, this.maxScrollY);
  }

  _applyScroll() {
    this.heroesContainer.y = -this.scrollY;
  }

  // --------------------------
  // Data
  // --------------------------
  async _loadHeroes() {
    if (!isAuthenticated()) {
      showAuth();
      return;
    }
    try {
      const data = await fetchHeroes();

      this.heroes = data?.heroes || [];
      this.heroPointsAvailable = safeNum(data?.heroPointsAvailable, 0);

      const selected = this.heroes.find((h) => h?.isSelected);
      this.selectedHeroId = selected ? selected.id : getSelectedHeroId();

      this._updatePointsText();
      this._renderHeroes();
    } catch (e) {
      console.error("Erreur chargement héros:", e);
    }
  }

  _updatePointsText() {
    if (!this._pointsText) return;
    this._pointsText.setText(`⭐ Points héros : ${safeNum(this.heroPointsAvailable, 0)}`);
  }

  // --------------------------
  // Render
  // --------------------------
  _clearHeroCards() {
    this.heroCards.forEach((c) => c?.destroy());
    this.heroCards.clear();
    this.heroesContainer?.removeAll(true);
  }

  _renderHeroes() {
    if (!this.cfg || !this.heroesContainer) return;

    this._clearHeroCards();

    const { cardW, cardH, rowGap } = this.cfg;

    let y = 0;
    for (const hero of this.heroes) {
      const card = this._createHeroCard(hero, 0, y, cardW, cardH);
      this.heroesContainer.add(card);
      this.heroCards.set(hero.id, card);

      y += cardH + rowGap;
    }

    this._recomputeScrollBounds();
    this._applyScroll();
  }

  _createHeroCard(hero, x, y, width, height) {
    const cfg = this.cfg;
    const resolution = res();

    const card = this.scene.add.container(x, y);

    const isUnlocked = !!hero.isUnlocked;
    const isSelected = !!hero.isSelected;

    // BG
    const bg = this.scene.add.graphics();
    const fillAlpha = isSelected ? 0.30 : 0.16;

    bg.fillStyle(isSelected ? cfg.accentColor : cfg.bgColor, fillAlpha);
    bg.lineStyle(2, isSelected ? cfg.accentColor : 0x3a3a3a, 1);
    bg.fillRoundedRect(0, 0, width, height, 12);
    bg.strokeRoundedRect(0, 0, width, height, 12);
    card.add(bg);

    // Avatar
    const avatarSize = cfg.avatarSize;
    const avatarCX = 14 + avatarSize / 2;
    const avatarCY = height / 2;

    const avatar = this.scene.add.container(avatarCX, avatarCY);

    const frame = this.scene.add.graphics();
    frame.fillStyle(0x0b1622, 0.55);
    frame.fillRoundedRect(-avatarSize / 2, -avatarSize / 2, avatarSize, avatarSize, 10);
    frame.lineStyle(2, isUnlocked ? cfg.accentColor : 0x4a4a4a, 0.75);
    frame.strokeRoundedRect(-avatarSize / 2, -avatarSize / 2, avatarSize, avatarSize, 10);
    avatar.add(frame);

    const scale = avatarSize / 50;
    const heroColor = hero.color || "#2b2b2b";
    const heroId = Number(hero.id);

    const body = this.scene.make.graphics({ add: false });
    drawHeroBody(body, scale, 1, heroId, heroColor);
    avatar.add(body);

    const weaponData = drawWeapon(this.scene, heroId, scale, 1);
    if (weaponData?.swordGroup) avatar.add(weaponData.swordGroup);
    if (weaponData?.secondWeaponGroup) avatar.add(weaponData.secondWeaponGroup);

    card.add(avatar);

    // Text area
    const textX = 14 + avatarSize + 18;

    const name = this.scene.add.text(textX, 10, hero.name ?? "Héros", {
      fontFamily: "Orbitron, sans-serif",
      fontSize: `${clamp(Math.round(height * 0.18), 14, 20)}px`,
      color: isUnlocked ? "#ffffff" : "#8a8a8a",
      fontWeight: "bold",
      resolution,
    });
    card.add(name);

    const hp = isUnlocked ? hero.current_hp : hero.base_hp;
    const dmg = isUnlocked ? hero.current_damage : hero.base_damage;
    const atkMs = isUnlocked ? hero.current_attack_interval_ms : hero.base_attack_interval_ms;
    const ms = isUnlocked ? hero.current_move_speed : hero.base_move_speed;

    const statColor = isUnlocked ? "#b9c2cc" : "#6d737a";
    const smallColor = isUnlocked ? "#6f7a85" : "#4f545a";

    const rightUiW = 140;
    const statsW = Math.max(220, width - textX - rightUiW);
    const colW = Math.floor(statsW / 4);

    const statsY = Math.round(height * 0.40);
    const stats = this.scene.add.container(textX, statsY);

    const makeStat = (col, icon, value) => {
      const x0 = col * colW;
      const i = this.scene.add.text(x0, 0, icon, { fontSize: "13px", resolution });
      const t = this.scene.add.text(x0 + 18, 1, value, {
        fontFamily: "Arial",
        fontSize: "11px",
        color: statColor,
        resolution,
      });
      stats.add([i, t]);
    };

    makeStat(0, "❤️", `${Math.round(safeNum(hp))}`);
    makeStat(1, "⚔️", `${safeNum(dmg).toFixed(1)}`);
    makeStat(2, "⚡", `${formatSeconds(atkMs)}`);
    makeStat(3, "🏃", `${Math.round(safeNum(ms))}`);
    card.add(stats);

    const maxLineY = statsY + 18;
    const maxLine = this.scene.add.container(textX, maxLineY);

    const mkSmall = (col, label) => {
      const x0 = col * colW;
      const t = this.scene.add.text(x0, 0, label, {
        fontFamily: "Arial",
        fontSize: "9px",
        color: smallColor,
        fontStyle: "italic",
        resolution,
      });
      maxLine.add(t);
    };

    if (hero.max_hp != null) mkSmall(0, `Max: ${Math.round(safeNum(hero.max_hp))}`);
    if (hero.max_damage != null) mkSmall(1, `Max: ${safeNum(hero.max_damage).toFixed(1)}`);
    if (hero.min_attack_interval_ms != null) mkSmall(2, `Min: ${formatSeconds(hero.min_attack_interval_ms)}`);
    if (hero.max_move_speed != null) mkSmall(3, `Max: ${Math.round(safeNum(hero.max_move_speed))}`);
    card.add(maxLine);

    const enemiesRetained =
      hero.enemies_retained != null && hero.enemies_retained !== undefined
        ? Number(hero.enemies_retained)
        : 1;

    const retain = this.scene.add.text(
      textX,
      maxLineY + 16,
      `🛡️ ${enemiesRetained} ${plural(enemiesRetained, "ennemi", "ennemis")} simultané${enemiesRetained > 1 ? "s" : ""}`,
      {
        fontFamily: "Arial",
        fontSize: "10px",
        color: isUnlocked ? "#7dd0ff" : "#555555",
        fontWeight: "bold",
        resolution,
      }
    );
    card.add(retain);

    // Right side actions
    const actionX = width - 18 - 110;
    const actionY = height / 2;

    if (isUnlocked) {
      if (isSelected) {
        card.add(this._selectedBadge(actionX + 55, actionY));
      } else {
        card.add(this._selectButton(actionX + 55, actionY, () => this.selectHero(hero.id)));
      }
    } else {
      const lock = this.scene.add.text(width - 18, 10, "🔒", { fontSize: "20px", resolution });
      lock.setOrigin(1, 0);
      card.add(lock);

      const cost = safeNum(hero.hero_points_to_unlock, 0);
      const canUnlock = this.heroPointsAvailable >= cost;

      card.add(this._unlockButton(actionX + 55, actionY + 18, cost, canUnlock, () => {
        if (!this.isUnlocking && canUnlock) this.unlockHero(hero.id);
      }));
    }

    // Click card (unlocked)
    if (isUnlocked && !isSelected) {
      const hit = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.001);
      hit.setInteractive({ useHandCursor: true });
      hit.on("pointerdown", () => this.selectHero(hero.id));
      card.add(hit);
      hit.setDepth(9999);
    }

    return card;
  }

  _selectedBadge(cx, cy) {
    const cont = this.scene.add.container(cx, cy);
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x00eaff, 0.24);
    bg.lineStyle(2, 0x00eaff, 1);
    bg.fillRoundedRect(-54, -16, 108, 32, 10);
    bg.strokeRoundedRect(-54, -16, 108, 32, 10);

    const t = this.scene.add.text(0, 0, "✓ SÉLECTIONNÉ", {
      fontFamily: "Orbitron, sans-serif",
      fontSize: "12px",
      color: "#00eaff",
      fontWeight: "bold",
      resolution: res(),
    }).setOrigin(0.5);

    cont.add([bg, t]);
    return cont;
  }

  _selectButton(cx, cy, onClick) {
    const cont = this.scene.add.container(cx, cy);
    const bg = this.scene.add.graphics();

    const draw = (a) => {
      bg.clear();
      bg.fillStyle(0x00eaff, a);
      bg.lineStyle(2, 0x00eaff, 1);
      bg.fillRoundedRect(-58, -16, 116, 32, 10);
      bg.strokeRoundedRect(-58, -16, 116, 32, 10);
    };
    draw(0.95);

    const t = this.scene.add.text(0, 0, "✓ SÉLECTIONNER", {
      fontFamily: "Orbitron, sans-serif",
      fontSize: "12px",
      color: "#ffffff",
      fontWeight: "bold",
      resolution: res(),
    }).setOrigin(0.5);

    cont.add([bg, t]);
    cont.setSize(116, 32).setInteractive({ useHandCursor: true });
    cont.on("pointerover", () => draw(1));
    cont.on("pointerout", () => draw(0.95));
    cont.on("pointerdown", onClick);

    return cont;
  }

  _unlockButton(cx, cy, cost, canUnlock, onClick) {
    const cont = this.scene.add.container(cx, cy);
    const bg = this.scene.add.graphics();

    const base = canUnlock ? 0x37c86b : 0x666666;
    const draw = (a) => {
      bg.clear();
      bg.fillStyle(base, a);
      bg.lineStyle(2, canUnlock ? 0x7dffb0 : 0x8a8a8a, canUnlock ? 0.9 : 0.45);
      bg.fillRoundedRect(-55, -15, 110, 30, 10);
      bg.strokeRoundedRect(-55, -15, 110, 30, 10);
    };
    draw(canUnlock ? 0.85 : 0.35);

    const label = cost > 0 ? `${cost} pts` : "GRATUIT";
    const t = this.scene.add.text(0, 0, label, {
      fontFamily: "Orbitron, sans-serif",
      fontSize: "11px",
      color: canUnlock ? "#ffffff" : "#cfcfcf",
      fontWeight: "bold",
      resolution: res(),
    }).setOrigin(0.5);

    cont.add([bg, t]);
    cont.setSize(110, 30).setInteractive({ useHandCursor: !!canUnlock });
    cont.on("pointerover", () => canUnlock && draw(1));
    cont.on("pointerout", () => canUnlock && draw(0.85));
    cont.on("pointerdown", () => canUnlock && onClick?.());

    return cont;
  }

  // --------------------------
  // Actions
  // --------------------------
  async selectHero(heroId) {
    if (!isAuthenticated()) {
      showAuth();
      return;
    }
    try {
      await setSelectedHeroId(heroId);
      this.selectedHeroId = heroId;

      // IMPORTANT : ton HeroUpgradeUI écoute "hero:selected"
      window.dispatchEvent(new CustomEvent("hero:selected", { detail: { heroId } }));

      await this._loadHeroes();
      this.destroy(); // option: ferme direct après sélection
    } catch (e) {
      console.error("Erreur sélection héros:", e);
    }
  }

  async unlockHero(heroId) {
    if (this.isUnlocking) return;

    if (!isAuthenticated()) {
      showAuth();
      return;
    }

    this.isUnlocking = true;
    try {
      const result = await apiUnlockHero(heroId);

      // Update profile cache (si présent)
      try {
        const { getProfile } = await import("../../services/authManager.js");
        const profile = getProfile?.();
        if (profile?.player) {
          profile.player.hero_points_available =
            result?.heroPointsAvailable ?? profile.player.hero_points_available;
        }
        if (result?.heroStats && profile) profile.heroStats = result.heroStats;
      } catch (_) {}

      await this._loadHeroes();
      await this.selectHero(heroId);

      window.dispatchEvent(new CustomEvent("profile:updated"));
    } catch (e) {
      console.error("Erreur déblocage héros:", e);
      const msg = e?.response?.data?.error || "Erreur lors du déblocage";
      alert(msg);
    } finally {
      this.isUnlocking = false;
    }
  }

  // --------------------------
  // Destroy
  // --------------------------
  destroy(fromScene) {
    this._destroyed = true;

    if (this._resizeHandler) {
      this.scene.scale.off("resize", this._resizeHandler);
      this._resizeHandler = null;
    }

    this._clearHeroCards();

    super.destroy(fromScene);
  }
}
