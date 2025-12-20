import { fetchLeaderboard } from "../../services/leaderboardService.js";

export class LeaderboardUI extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    
    this.config = {
      width: 500,           // Plus large pour accueillir toutes les colonnes
      height: 450,          // Plus haut pour le confort visuel
      accentColor: 0x00eaff,
      rowHeight: 32,        // Un peu plus haut pour le confort
      maxEntries: 8
    };

    this.setupLayout();
    this.loadData();

    this.scene.add.existing(this);
    this.setDepth(200);
  }

  setupLayout() {
    const { width, height, accentColor } = this.config;

    // --- 1. PANNEAU DE FOND ---
    const bg = this.scene.add.graphics();
    // Ombre de profondeur
    bg.fillStyle(0x000000, 0.5);
    bg.fillRoundedRect(10, 10, width, height, 15);
    // Bordure et fond
    bg.fillStyle(0x0d1b2a, 0.95);
    bg.lineStyle(2, accentColor, 1);
    bg.fillRoundedRect(0, 0, width, height, 15);
    bg.strokeRoundedRect(0, 0, width, height, 15);
    
    // Ligne de séparation header
    bg.lineStyle(1, accentColor, 0.4);
    bg.lineBetween(15, 55, width - 15, 55);
    this.add(bg);

    // --- 2. TITRE ---
    const title = this.scene.add.text(width / 2, 18, "📊 CLASSEMENT DES SURVIVANTS", {
      fontSize: "20px",
      fontFamily: "Impact, sans-serif",
      color: "#ffffff",
      letterSpacing: 1
    }).setOrigin(0.5, 0).setShadow(0, 0, "#00eaff", 10);
    this.add(title);

    // --- 3. BOUTON REFRESH ---
    this.refreshBtn = this.scene.add.text(width - 30, 28, "↻", { 
      fontSize: "26px", color: accentColor, fontStyle: "bold" 
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.refreshBtn.on("pointerdown", () => this.handleRefresh());
    this.add(this.refreshBtn);

    // --- 4. EN-TÊTE DES COLONNES (ALIGNEMENT FIXE) ---
    const hStyle = { fontSize: "11px", color: "#7dd0ff", fontWeight: "bold", fontFamily: "Orbitron, Arial" };
    
    // On définit des X fixes pour chaque colonne
    this.cols = { rank: 20, player: 65, lvl: 185, hearts: 275, time: width - 20 };

    this.add([
      this.scene.add.text(this.cols.rank, 65, "RANG", hStyle),
      this.scene.add.text(this.cols.player, 65, "JOUEUR", hStyle),
      this.scene.add.text(this.cols.lvl, 65, "NIV MAX", hStyle),
      this.scene.add.text(this.cols.hearts, 65, "COEURS PERDUS", hStyle),
      this.scene.add.text(this.cols.time, 65, "TEMPS CUMULÉ", hStyle).setOrigin(1, 0)
    ]);

    // --- 5. LISTE DES ENTRÉES ---
    this.listContainer = this.scene.add.container(0, 95);
    this.add(this.listContainer);

    this.statusText = this.scene.add.text(width / 2, height / 2 + 30, "", {
      fontSize: "14px", color: "#ffffff", fontFamily: "Courier New"
    }).setOrigin(0.5);
    this.add(this.statusText);
  }

  async handleRefresh() {
    this.scene.tweens.add({
      targets: this.refreshBtn,
      angle: 360, duration: 500,
      onComplete: () => { this.refreshBtn.angle = 0; this.loadData(); }
    });
  }

  async loadData() {
    try {
      this.listContainer.removeAll(true);
      this.statusText.setText("CHARGEMENT DES DONNÉES...");
      const entries = await fetchLeaderboard();
      this.statusText.setText("");
      this.renderEntries(entries);
    } catch (err) {
      this.statusText.setText("ERREUR DE SYNCHRONISATION");
    }
  }

  renderEntries(entries) {
    if (!entries || entries.length === 0) {
      this.statusText.setText("AUCUN SURVIVANT RÉPERTORIÉ");
      return;
    }

    entries.slice(0, this.config.maxEntries).forEach((entry, idx) => {
      const y = idx * this.config.rowHeight;
      const isFirst = idx === 0;
      const color = isFirst ? "#ffd700" : "#ffffff";
      
      const row = this.scene.add.container(0, y);

      // Fond de ligne alterné
      const rowBg = this.scene.add.graphics();
      rowBg.fillStyle(0xffffff, idx % 2 === 0 ? 0.03 : 0);
      rowBg.fillRect(10, -5, this.config.width - 20, 28);
      row.add(rowBg);

      // 1. RANG (01, 02...)
      const rank = (idx + 1).toString().padStart(2, '0');
      const rankTxt = this.scene.add.text(this.cols.rank, 0, rank, {
        fontSize: "13px", fontFamily: "Courier New", color: color, fontWeight: isFirst ? "bold" : "normal"
      });

      // 2. JOUEUR
      const name = (entry.username || "Inconnu").substring(0, 12);
      const nameTxt = this.scene.add.text(this.cols.player, 0, name, {
        fontSize: "13px", fontFamily: "Arial", color: color
      });

      // 3. NIV MAX
      const lvlTxt = this.scene.add.text(this.cols.lvl, 0, `${entry.max_level || 0}`, {
        fontSize: "13px", fontFamily: "Courier New", color: color
      });

      // 4. COEURS PERDUS (Icône + nombre + "perdu")
      const heartsCount = entry.total_lives_lost || 0;
      const heartsContainer = this.scene.add.container(this.cols.hearts, 0);
      
      const heartIcon = this.scene.add.text(0, -1, "❤️", { fontSize: "12px" });
      const heartValue = this.scene.add.text(18, 0, `${heartsCount}`, {
        fontSize: "12px", fontFamily: "Arial", color: color
      });
      heartsContainer.add([heartIcon, heartValue]);

      // 5. TEMPS CUMULÉ
      const timeStr = this.formatTime(entry.total_time_ms);
      const timeTxt = this.scene.add.text(this.cols.time, 0, timeStr, {
        fontSize: "13px", fontFamily: "Courier New", color: "#00eaff"
      }).setOrigin(1, 0);

      row.add([rankTxt, nameTxt, lvlTxt, heartsContainer, timeTxt]);
      this.listContainer.add(row);

      // Animation d'apparition
      row.alpha = 0;
      row.x = -15;
      this.scene.tweens.add({
        targets: row,
        alpha: 1, x: 0,
        duration: 300, delay: idx * 40
      });
    });
  }

  formatTime(ms) {
    if (!ms || ms <= 0) return "0:00";
    const sec = Math.floor(ms / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}