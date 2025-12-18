export class Soldier extends Phaser.GameObjects.Container {
  constructor(scene, x, y, barracks) {
    super(scene, x, y);
    this.scene = scene;
    this.barracks = barracks;
    this.level = barracks ? barracks.level : 1;
    
    // Stats
    this.maxHp = 100;
    this.hp = this.maxHp;
    this.blockingEnemy = null; // L'ennemi actuellement bloqué
    this.isAlive = true;
    this.combatTimer = null;
    this.combatAnimationState = 0; // Pour l'animation de combat
    
    // Position sur le chemin
    this.pathPosition = null;
    this.pathIndex = 0;
    
    // --- VISUEL ---
    this.bodyGroup = scene.add.container(0, 0);
    this.add(this.bodyGroup);
    this.drawBody();
    
    // Barre de vie
    this.drawHealthBar();
    
    // Animation de combat
    this.combatGraphics = scene.add.graphics();
    this.combatGraphics.setVisible(false);
    this.add(this.combatGraphics);
    
    scene.add.existing(this);
    this.setDepth(15); // Au-dessus des ennemis
    
    // Tooltip HP - définir une zone interactive
    this.hpTooltip = null;
    this.setSize(32, 32); // Taille pour l'interactivité
    this.setInteractive({ useHandCursor: false });
    this.on("pointerover", () => {
      if (this.active && this.isAlive) {
        this.showHpTooltip();
      }
    });
    this.on("pointerout", () => this.hideHpTooltip());
    
    // Highlight pour la caserne
    this.highlightCircle = null;
  }
  
  showHpTooltip() {
    if (!this.active || !this.isAlive) return;
    
    if (this.hpTooltip) {
      this.hpTooltip.destroy();
    }
    
    const fontSize = Math.max(12, 14 * (this.scene.scaleFactor || 1));
    this.hpTooltip = this.scene.add.text(
      this.x,
      this.y - 50,
      `${Math.max(0, this.hp)} / ${this.maxHp} HP`,
      {
        fontSize: `${fontSize}px`,
        fill: "#ffffff",
        fontStyle: "bold",
        backgroundColor: "#000000",
        padding: { x: 8, y: 4 },
      }
    ).setOrigin(0.5).setDepth(300);
    
    // Mettre à jour la position du tooltip en continu
    if (this.tooltipUpdateTimer) {
      this.tooltipUpdateTimer.remove();
    }
    this.tooltipUpdateTimer = this.scene.time.addEvent({
      delay: 50,
      callback: () => {
        if (this.hpTooltip && this.active && this.isAlive) {
          this.hpTooltip.setPosition(this.x, this.y - 50);
          this.hpTooltip.setText(`${Math.max(0, this.hp)} / ${this.maxHp} HP`);
        } else if (this.hpTooltip) {
          this.hideHpTooltip();
        }
      },
      loop: true
    });
  }
  
  hideHpTooltip() {
    if (this.hpTooltip) {
      this.hpTooltip.destroy();
      this.hpTooltip = null;
    }
    if (this.tooltipUpdateTimer) {
      this.tooltipUpdateTimer.remove();
      this.tooltipUpdateTimer = null;
    }
  }
  
  showHighlight() {
    if (this.highlightCircle) {
      this.highlightCircle.destroy();
    }
    
    this.highlightCircle = this.scene.add.circle(
      this.x,
      this.y,
      20 * (this.scene.scaleFactor || 1),
      0x00ffff,
      0
    );
    this.highlightCircle.setStrokeStyle(2, 0x00ffff, 0.8);
    this.highlightCircle.setDepth(16);
    
    // Mettre à jour la position du highlight en continu
    this.highlightUpdateTimer = this.scene.time.addEvent({
      delay: 50,
      callback: () => {
        if (this.highlightCircle && this.active) {
          this.highlightCircle.setPosition(this.x, this.y);
        }
      },
      loop: true
    });
  }
  
  hideHighlight() {
    if (this.highlightCircle) {
      this.highlightCircle.destroy();
      this.highlightCircle = null;
    }
    if (this.highlightUpdateTimer) {
      this.highlightUpdateTimer.remove();
      this.highlightUpdateTimer = null;
    }
  }
  
  drawBody() {
    this.bodyGroup.removeAll(true);
    const g = this.scene.add.graphics();
    const level = this.level || 1;
    
    if (level === 1) {
      // === NIVEAU 1 : Recrue (Faible) ===
      // Corps simple en tissu
      g.fillStyle(0x8b7355); // Tissu marron
      g.fillRect(-7, -10, 14, 20);
      
      // Tête
      g.fillStyle(0xffdbac);
      g.fillCircle(0, -16, 5);
      
      // Chapeau simple
      g.fillStyle(0x654321);
      g.fillRect(-8, -18, 16, 4);
      
      // Arme simple (bâton/épée basique)
      g.fillStyle(0x666666);
      g.fillRect(7, -6, 2, 12);
      
      // Bras simples
      g.fillStyle(0x8b7355);
      g.fillRect(-9, -8, 5, 10);
      g.fillRect(4, -8, 5, 10);
      
    } else if (level === 2) {
      // === NIVEAU 2 : Soldat (Armure légère) ===
      // Corps avec armure
      g.fillStyle(0x4a4a4a); // Armure grise
      g.fillRect(-8, -11, 16, 22);
      g.lineStyle(1, 0x2a2a2a);
      g.strokeRect(-8, -11, 16, 22);
      
      // Tête
      g.fillStyle(0xffdbac);
      g.fillCircle(0, -17, 6);
      
      // Casque
      g.fillStyle(0x3a3a3a);
      g.fillRect(-9, -19, 18, 7);
      g.lineStyle(2, 0x1a1a1a);
      g.strokeRect(-9, -19, 18, 7);
      
      // Arme (épée)
      g.fillStyle(0x888888);
      g.fillRect(8, -7, 3, 14);
      g.fillStyle(0xcccccc);
      g.fillRect(8, -7, 3, 7);
      
      // Bras avec protection
      g.fillStyle(0x4a4a4a);
      g.fillRect(-10, -9, 6, 11);
      g.fillRect(4, -9, 6, 11);
      g.lineStyle(1, 0x2a2a2a);
      g.strokeRect(-10, -9, 6, 11);
      g.strokeRect(4, -9, 6, 11);
      
    } else {
      // === NIVEAU 3 : Vétéran (Armure lourde) ===
      // Corps avec armure lourde
      g.fillStyle(0x2a2a2a); // Armure sombre
      g.fillRect(-9, -12, 18, 24);
      g.lineStyle(2, 0x1a1a1a);
      g.strokeRect(-9, -12, 18, 24);
      
      // Détails d'armure
      g.fillStyle(0x3a3a3a);
      g.fillRect(-7, -10, 14, 4); // Plaque pectorale
      g.fillRect(-7, 8, 14, 4); // Plaque ventrale
      
      // Tête
      g.fillStyle(0xffdbac);
      g.fillCircle(0, -18, 6);
      
      // Casque lourd
      g.fillStyle(0x1a1a1a);
      g.fillRect(-10, -20, 20, 8);
      g.lineStyle(2, 0x4a4a4a);
      g.strokeRect(-10, -20, 20, 8);
      // Visière
      g.fillStyle(0x000000, 0.6);
      g.fillRect(-8, -18, 16, 2);
      
      // Arme (épée améliorée)
      g.fillStyle(0xaaaaaa);
      g.fillRect(9, -8, 4, 16);
      g.fillStyle(0xffffff);
      g.fillRect(9, -8, 4, 8);
      // Garde
      g.fillStyle(0x888888);
      g.fillRect(7, -6, 8, 2);
      
      // Bras avec armure complète
      g.fillStyle(0x2a2a2a);
      g.fillRect(-11, -10, 7, 12);
      g.fillRect(4, -10, 7, 12);
      g.lineStyle(2, 0x1a1a1a);
      g.strokeRect(-11, -10, 7, 12);
      g.strokeRect(4, -10, 7, 12);
      // Épaulières
      g.fillStyle(0x3a3a3a);
      g.fillCircle(-8, -10, 4);
      g.fillCircle(8, -10, 4);
    }
    
    this.bodyGroup.add(g);
  }
  
  // Mettre à jour le design selon le niveau
  updateLevel(newLevel) {
    this.level = newLevel;
    this.drawBody();
  }
  
  drawHealthBar() {
    const yOffset = -35;
    const width = 30;
    const height = 4;
    
    this.hpBg = this.scene.add.rectangle(
      0,
      yOffset,
      width + 2,
      height + 2,
      0x000000
    );
    this.hpBg.setStrokeStyle(1, 0xffffff);
    
    this.hpRed = this.scene.add.rectangle(0, yOffset, width, height, 0x330000);
    
    this.hpGreen = this.scene.add.rectangle(
      -width / 2,
      yOffset,
      width,
      height,
      0x00ff00
    );
    this.hpGreen.setOrigin(0, 0.5);
    
    this.add([this.hpBg, this.hpRed, this.hpGreen]);
  }
  
  updateHealthBar() {
    const pct = Phaser.Math.Clamp(this.hp / this.maxHp, 0, 1);
    let newWidth = 30 * pct;
    
    if (this.hp > 0 && newWidth < 2) newWidth = 2;
    
    this.hpGreen.width = newWidth;
    
    if (pct < 0.25) this.hpGreen.fillColor = 0xff0000;
    else if (pct < 0.5) this.hpGreen.fillColor = 0xffa500;
    else this.hpGreen.fillColor = 0x00ff00;
  }
  
  // Vérifier si une position est sur un chemin (tile type 1 ou 4)
  isPositionOnPath(x, y) {
    const CONFIG = { TILE_SIZE: 64 };
    const T = CONFIG.TILE_SIZE * (this.scene.scaleFactor || 1);
    // Utiliser mapStartX et mapStartY au lieu de MAP_OFFSET
    const mapStartX = this.scene.mapStartX || 0;
    const mapStartY = this.scene.mapStartY || (120 * (this.scene.scaleFactor || 1));
    
    // Convertir en coordonnées de tile
    const tx = Math.floor((x - mapStartX) / T);
    const ty = Math.floor((y - mapStartY) / T);
    
    // Vérifier les limites
    if (tx < 0 || tx >= 15 || ty < 0 || ty >= 15) return false;
    
    // Vérifier le type de tile (1 = chemin, 4 = pont)
    const map = this.scene.levelConfig.map;
    const tileType = map[ty][tx];
    return tileType === 1 || tileType === 4;
  }
  
  // Trouver la position sur le chemin le plus proche
  findPathPosition(paths) {
    if (!paths || paths.length === 0) return null;
    
    let closestPath = null;
    let closestPoint = null;
    let minDist = Infinity;
    let pathIndex = 0;
    
    paths.forEach((path, idx) => {
      // Chercher le point le plus proche sur ce chemin
      for (let t = 0; t <= 1; t += 0.02) { // Plus de précision
        const point = path.getPoint(t);
        
        // Vérifier que le point est bien sur un chemin
        if (!this.isPositionOnPath(point.x, point.y)) {
          continue;
        }
        
        const dist = Phaser.Math.Distance.Between(this.x, this.y, point.x, point.y);
        if (dist < minDist) {
          minDist = dist;
          closestPath = path;
          closestPoint = point;
          pathIndex = idx;
        }
      }
    });
    
    if (closestPath && closestPoint && minDist < 200) { // 200 pixels de tolérance
      this.pathPosition = closestPath;
      this.pathIndex = pathIndex;
      return closestPoint;
    }
    
    return null;
  }
  
  // Placer le soldat sur le chemin (version simplifiée)
  deployToPath(paths) {
    if (!this.scene) return;
    
    // Si le soldat est déjà sur un chemin valide, ne rien faire
    if (this.isPositionOnPath(this.x, this.y)) {
      return;
    }
    
    // Chercher la position la plus proche sur un chemin
    const CONFIG = { TILE_SIZE: 64 };
    const T = CONFIG.TILE_SIZE * (this.scene.scaleFactor || 1);
    const mapStartX = this.scene.mapStartX || 0;
    const mapStartY = this.scene.mapStartY || (120 * (this.scene.scaleFactor || 1));
    const map = this.scene.levelConfig.map;
    
    // Chercher la tile de chemin la plus proche
    let closestTile = null;
    let minTileDist = Infinity;
    
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const tileType = map[y][x];
        if (tileType === 1 || tileType === 4) {
          const tileX = mapStartX + x * T + T / 2;
          const tileY = mapStartY + y * T + T / 2;
          const dist = Phaser.Math.Distance.Between(this.x, this.y, tileX, tileY);
          if (dist < minTileDist) {
            minTileDist = dist;
            closestTile = { x: tileX, y: tileY };
          }
        }
      }
    }
    
    // Positionner le soldat sur la tile la plus proche trouvée
    if (closestTile) {
      this.setPosition(closestTile.x, closestTile.y);
    }
  }
  
  // Bloquer un ennemi
  blockEnemy(enemy) {
    if (!this.isAlive || this.blockingEnemy !== null) return false;
    if (enemy.isBlocked) return false; // L'ennemi est déjà bloqué par un autre soldat
    
    this.blockingEnemy = enemy;
    enemy.isBlocked = true;
    enemy.blockedBy = this;
    
    // Arrêter le mouvement de l'ennemi
    if (enemy.follower && enemy.follower.tween) {
      enemy.follower.tween.pause();
    }
    
    // Démarrer le combat
    this.startCombat(enemy);
    return true;
  }
  
  // Libérer l'ennemi bloqué
  releaseEnemy() {
    if (this.blockingEnemy) {
      const enemy = this.blockingEnemy;
      enemy.isBlocked = false;
      enemy.blockedBy = null;
      
      // Reprendre le mouvement si l'ennemi est encore vivant
      if (enemy.active && enemy.follower && enemy.follower.tween) {
        enemy.follower.tween.resume();
      }
      
      this.blockingEnemy = null;
    }
  }
  
  // Démarrer le combat
  startCombat(enemy) {
    if (this.combatTimer || !this.scene || !this.scene.time) return;
    
    this.combatGraphics.setVisible(true);
    
    // Animation de combat continue
    this.combatTimer = this.scene.time.addEvent({
      delay: 500, // Attaque toutes les 500ms
      callback: () => {
        if (!this.isAlive || !enemy || !enemy.active || !this.blockingEnemy || enemy !== this.blockingEnemy) {
          this.stopCombat();
          if (enemy && !enemy.active) {
            // L'ennemi est mort, libérer le soldat
            this.releaseEnemy();
          }
          return;
        }
        
        // Le soldat attaque l'ennemi
        const soldierDamage = 15;
        if (enemy && typeof enemy.damage === 'function') {
          enemy.damage(soldierDamage);
        }
        
        // L'ennemi attaque le soldat avec ses propres dégâts
        const enemyDamage = enemy && enemy.attackDamage ? enemy.attackDamage : 10;
        this.takeDamage(enemyDamage);
        
        // Animation visuelle
        this.playCombatAnimation(enemy);
      },
      loop: true,
    });
  }
  
  // Animation visuelle du combat
  playCombatAnimation(enemy) {
    if (!this.scene || !enemy) return;
    
    // Alterner l'animation de combat
    this.combatAnimationState = (this.combatAnimationState + 1) % 2;
    
    // Animation du soldat qui attaque
    if (this.combatAnimationState === 0 && this.scene && this.scene.tweens) {
      // Le soldat frappe vers l'avant
      this.scene.tweens.add({
        targets: this,
        x: this.x + Math.cos(Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y)) * 8,
        duration: 100,
        yoyo: true,
        ease: "Power2",
      });
      
      // Rotation de l'arme (épée)
      this.scene.tweens.add({
        targets: this.bodyGroup,
        rotation: 0.3,
        duration: 100,
        yoyo: true,
        ease: "Power2",
      });
    }
    
    // Flash sur le soldat
    if (this.scene && this.scene.tweens) {
      this.bodyGroup.list.forEach((child) => {
        if (child.setTint) {
          this.scene.tweens.add({
            targets: child,
            tint: 0xffffff,
            duration: 50,
            yoyo: true,
            onComplete: () => {
              if (child.clearTint) {
                child.clearTint();
              } else {
                child.setTint(0xffffff);
              }
            },
          });
        }
      });
    }
    
    // Animation de l'ennemi qui recule
    if (this.scene && this.scene.tweens) {
      this.scene.tweens.add({
        targets: enemy,
        x: enemy.x - Math.cos(Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y)) * 5,
        duration: 150,
        yoyo: true,
        ease: "Power2",
      });
    }
    
    // Ligne d'attaque dynamique (épée qui frappe)
    this.combatGraphics.clear();
    const angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
    const startX = this.x + Math.cos(angle) * 10;
    const startY = this.y + Math.sin(angle) * 10;
    const endX = enemy.x;
    const endY = enemy.y;
    
    // Traînée d'épée
    this.combatGraphics.lineStyle(3, 0xffffff, 1);
    this.combatGraphics.lineBetween(startX, startY, endX, endY);
    this.combatGraphics.lineStyle(2, 0xffff00, 0.9);
    this.combatGraphics.lineBetween(startX, startY, endX, endY);
    
    // Disparition rapide
    if (this.scene && this.scene.tweens) {
      this.scene.tweens.add({
        targets: this.combatGraphics,
        alpha: 0,
        duration: 150,
        onComplete: () => {
          if (this.combatGraphics) {
            this.combatGraphics.clear();
          }
        },
      });
    }
    
    // Étincelles d'impact
    if (this.scene && this.scene.tweens) {
      for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 30 + 15;
        const particle = this.scene.add.circle(
          endX + (Math.random() - 0.5) * 10,
          endY + (Math.random() - 0.5) * 10,
          Math.random() * 3 + 1,
          0xffff00,
          1
        );
        particle.setDepth(101);
        this.scene.tweens.add({
          targets: particle,
          x: particle.x + Math.cos(angle) * speed,
          y: particle.y + Math.sin(angle) * speed,
          alpha: 0,
          scale: 0,
          duration: 400,
          onComplete: () => {
            if (particle && particle.active) {
              particle.destroy();
            }
          },
        });
      }
    }
    
    // Flash d'impact sur l'ennemi
    if (enemy.bodyGroup && this.scene && this.scene.tweens) {
      this.scene.tweens.add({
        targets: enemy.bodyGroup,
        alpha: 0.2,
        duration: 50,
        yoyo: true,
      });
    }
  }
  
  // Arrêter le combat
  stopCombat() {
    if (this.combatTimer) {
      this.combatTimer.remove();
      this.combatTimer = null;
    }
    this.combatGraphics.setVisible(false);
    this.combatGraphics.clear();
  }
  
  // Prendre des dégâts
  takeDamage(amount) {
    this.hp -= amount;
    
    // Mettre à jour le tooltip si visible
    if (this.hpTooltip) {
      this.hpTooltip.setText(`${this.hp} / ${this.maxHp} HP`);
    }
    
    // Flash rouge sur les enfants du bodyGroup
    if (this.scene && this.scene.tweens) {
      this.bodyGroup.list.forEach((child) => {
        if (child.setTint) {
          this.scene.tweens.add({
            targets: child,
            tint: 0xff0000,
            duration: 100,
            yoyo: true,
            onComplete: () => {
              if (child.clearTint) {
                child.clearTint();
              } else {
                child.setTint(0xffffff);
              }
            },
          });
        }
      });
    }
    
    this.updateHealthBar();
    
    if (this.hp <= 0) {
      this.hideHpTooltip();
      this.hideHighlight();
      this.die();
    }
  }
  
  // Mourir
  die() {
    if (!this.isAlive) return;
    
    this.isAlive = false;
    this.stopCombat();
    this.releaseEnemy();
    
    // Animation de mort
    if (this.scene && this.scene.tweens) {
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        scale: 0,
        rotation: Math.PI,
        duration: 500,
        onComplete: () => {
          this.setVisible(false);
          // Le respawn sera géré par le barracks
          if (this.barracks) {
            this.barracks.onSoldierDied(this);
          }
        },
      });
    } else {
      // Si la scène n'existe plus, juste cacher le soldat
      this.setVisible(false);
      if (this.barracks) {
        this.barracks.onSoldierDied(this);
      }
    }
  }
  
  // Ressusciter
  respawn() {
    if (!this.scene) return;
    
    this.hp = this.maxHp;
    this.isAlive = true;
    this.blockingEnemy = null;
    this.setVisible(true);
    this.setAlpha(1);
    this.setScale(this.scene.scaleFactor || 1);
    this.setRotation(0);
    this.updateHealthBar();
    
    // Redéployer sur le chemin (version simplifiée)
    this.deployToPath(this.scene.paths);
    
    // Animation de réapparition
    if (this.scene && this.scene.tweens) {
      this.setScale(0);
      this.scene.tweens.add({
        targets: this,
        scale: this.scene.scaleFactor || 1,
        duration: 300,
        ease: "Back.easeOut",
      });
    }
  }
  
  update() {
    // Vérifier si un ennemi passe à proximité
    if (this.isAlive && !this.blockingEnemy) {
      const enemies = this.scene.enemies.getChildren();
      for (const enemy of enemies) {
        // Ne pas bloquer les ennemis à distance (throwers)
        if (enemy.active && !enemy.isBlocked && !enemy.isRanged) {
          const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
          if (dist < 30) { // Range de blocage
            this.blockEnemy(enemy);
            break;
          }
        }
      }
    }
  }
}
