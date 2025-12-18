// On importe ENEMIES depuis settings.js car c'est là qu'on l'a regroupé
import { ENEMIES } from "../config/settings.js";

export class Enemy extends Phaser.GameObjects.Container {
  constructor(scene, path, typeKey) {
    super(scene, -100, -100);
    this.scene = scene;
    this.path = path;
    this.typeKey = typeKey;

    // --- DEBUG ---
    // Si ENEMIES est undefined, c'est un problème d'import.
    if (!ENEMIES) {
      console.error(
        "ERREUR CRITIQUE : L'objet ENEMIES n'est pas chargé. Vérifiez src/config/settings.js"
      );
      return;
    }
    // Si ENEMIES[typeKey] est undefined, c'est que la vague demande un type qui n'existe pas.
    if (!ENEMIES[typeKey]) {
      console.error(
        `ERREUR : Le type d'ennemi '${typeKey}' n'existe pas dans ENEMIES.`
      );
      // Fallback sur 'grunt' pour éviter le crash
      this.stats = ENEMIES["grunt"];
    } else {
      this.stats = ENEMIES[typeKey];
    }
    // -------------

    // Stats
    this.hp = this.stats.hp;
    this.maxHp = this.stats.hp;
    this.speed = this.stats.speed;
    this.attackDamage = this.stats.damage || 10; // Dégâts par défaut (renommé pour éviter conflit avec méthode damage())
    this.attackSpeed = this.stats.attackSpeed || 1000; // Vitesse d'attaque par défaut
    this.attackRange = this.stats.attackRange || 30; // Portée d'attaque
    this.isRanged = this.stats.isRanged || false; // Attaquant à distance
    this.shouldRotate = false; // On n'utilise plus la rotation, mais le flip
    this.facingRight = true; // Direction actuelle (true = droite, false = gauche)
    this.lastAttackTime = 0;
    this.targetSoldier = null; // Soldat ciblé pour les attaques à distance

    // --- 1. VISUEL ---

    // Ombre
    const shadow = scene.add.ellipse(0, 15, 30, 10, 0x000000, 0.5);
    this.add(shadow);

    // Corps de l'ennemi
    this.bodyGroup = scene.add.container(0, 0);
    this.add(this.bodyGroup);

    // Dessin modulaire
    if (this.stats.onDraw) {
      this.stats.onDraw(this.scene, this.bodyGroup, this.stats.color, this);
    } else {
      const fallback = scene.add.rectangle(
        0,
        0,
        32,
        32,
        this.stats.color || 0xffffff
      );
      this.bodyGroup.add(fallback);
    }

    // --- 2. BARRE DE VIE ---
    this.drawHealthBar(scene);

    // Initialisation Phaser
    this.scene.add.existing(this);
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };

    // Tooltip HP - définir une zone interactive
    this.hpTooltip = null;
    this.setSize(32, 32); // Taille pour l'interactivité
    this.setInteractive({ useHandCursor: false });
    this.on("pointerover", () => {
      if (this.active) {
        this.showHpTooltip();
      }
    });
    this.on("pointerout", () => this.hideHpTooltip());
  }

  showHpTooltip() {
    if (!this.active) return;

    if (this.hpTooltip) {
      this.hpTooltip.destroy();
    }

    const fontSize = Math.max(12, 14 * (this.scene.scaleFactor || 1));
    this.hpTooltip = this.scene.add
      .text(this.x, this.y - 60, `${Math.max(0, this.hp)} / ${this.maxHp} HP`, {
        fontSize: `${fontSize}px`,
        fill: "#ffffff",
        fontStyle: "bold",
        backgroundColor: "#000000",
        padding: { x: 8, y: 4 },
      })
      .setOrigin(0.5)
      .setDepth(300);

    // Mettre à jour la position et le texte du tooltip en continu
    if (this.tooltipUpdateTimer) {
      this.tooltipUpdateTimer.remove();
    }
    this.tooltipUpdateTimer = this.scene.time.addEvent({
      delay: 50,
      callback: () => {
        if (this.hpTooltip && this.active) {
          this.hpTooltip.setPosition(this.x, this.y - 60);
          this.hpTooltip.setText(`${Math.max(0, this.hp)} / ${this.maxHp} HP`);
        } else if (this.hpTooltip) {
          this.hideHpTooltip();
        }
      },
      loop: true,
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

  update(time, delta) {
    if (this.active && this.stats && this.stats.onUpdateAnimation) {
      this.stats.onUpdateAnimation(time, this);
    }

    // Gérer les attaques contre les soldats
    if (this.active && !this.isBlocked) {
      this.updateCombat(time);
    }
  }

  // Mettre à jour le combat (attaques contre les soldats)
  updateCombat(time) {
    if (this.isRanged) {
      // Attaquant à distance : chercher un soldat à portée
      this.findRangedTarget();

      if (
        this.targetSoldier &&
        this.targetSoldier.active &&
        this.targetSoldier.isAlive
      ) {
        const dist = Phaser.Math.Distance.Between(
          this.x,
          this.y,
          this.targetSoldier.x,
          this.targetSoldier.y
        );

        // Une case = 64 pixels, on s'arrête à environ une case de distance
        const CONFIG = { TILE_SIZE: 64 };
        const stopDistance = CONFIG.TILE_SIZE * (this.scene.scaleFactor || 1);

        if (dist <= this.attackRange) {
          // S'arrêter si on est assez proche pour attaquer
          if (dist <= stopDistance) {
            // S'arrêter et attaquer
            if (
              this.follower &&
              this.follower.tween &&
              !this.follower.tween.isPaused
            ) {
              this.follower.tween.pause();
            }

            // Attaquer si le cooldown est écoulé
            if (time - this.lastAttackTime >= this.attackSpeed) {
              this.attackSoldierRanged(this.targetSoldier);
              this.lastAttackTime = time;
            }
          } else {
            // On est dans la portée mais pas assez proche, continuer à avancer
            if (
              this.follower &&
              this.follower.tween &&
              this.follower.tween.isPaused
            ) {
              this.follower.tween.resume();
            }
          }
        } else {
          // Trop loin pour attaquer, reprendre le mouvement
          if (
            this.follower &&
            this.follower.tween &&
            this.follower.tween.isPaused
          ) {
            this.follower.tween.resume();
          }
          this.targetSoldier = null;
        }
      } else {
        // Pas de cible, reprendre le mouvement
        if (
          this.follower &&
          this.follower.tween &&
          this.follower.tween.isPaused
        ) {
          this.follower.tween.resume();
        }
      }
    } else {
      // Attaquant au corps à corps : attaquer le soldat qui le bloque
      if (this.isBlocked && this.blockedBy) {
        if (time - this.lastAttackTime >= this.attackSpeed) {
          this.blockedBy.takeDamage(this.attackDamage);
          this.lastAttackTime = time;
        }
      }
    }
  }

  // Trouver une cible pour attaque à distance
  findRangedTarget() {
    if (!this.scene || !this.scene.soldiers) return;

    const soldiers = this.scene.soldiers.getChildren();
    let closestSoldier = null;
    let minDist = this.attackRange;

    for (const soldier of soldiers) {
      if (soldier && soldier.active && soldier.isAlive) {
        const dist = Phaser.Math.Distance.Between(
          this.x,
          this.y,
          soldier.x,
          soldier.y
        );
        if (dist <= this.attackRange && dist < minDist) {
          minDist = dist;
          closestSoldier = soldier;
        }
      }
    }

    this.targetSoldier = closestSoldier;
  }

  // Attaquer un soldat à distance (lancer de hache)
  attackSoldierRanged(soldier) {
    if (!soldier || !soldier.active || !soldier.isAlive) return;

    // Animation de lancer
    if (this.axe) {
      this.scene.tweens.add({
        targets: this.axe,
        rotation: Math.PI * 2,
        duration: 200,
        onComplete: () => {
          if (this.axe) {
            this.axe.rotation = 0;
          }
        },
      });
    }

    // Créer la hache volante
    const CONFIG = { TILE_SIZE: 64 };
    const T = CONFIG.TILE_SIZE * (this.scene.scaleFactor || 1);
    const startX = this.x;
    const startY = this.y;
    const endX = soldier.x;
    const endY = soldier.y;

    const axe = this.scene.add.graphics();
    axe.fillStyle(0x888888);
    axe.fillRect(-2, -4, 4, 8); // Manche
    axe.fillStyle(0xcccccc);
    axe.beginPath();
    axe.moveTo(2, -4);
    axe.lineTo(8, -8);
    axe.lineTo(8, 0);
    axe.closePath();
    axe.fillPath();
    axe.setPosition(startX, startY);
    axe.setDepth(102);

    // Rotation de la hache pendant le vol
    this.scene.tweens.add({
      targets: axe,
      rotation: Math.PI * 4,
      duration: 500,
    });

    // Trajectoire de la hache
    this.scene.tweens.add({
      targets: axe,
      x: endX,
      y: endY,
      duration: 500,
      ease: "Power2",
      onComplete: () => {
        if (!this.scene || !this.active) return;
        // Impact sur le soldat
        if (soldier && soldier.active && soldier.isAlive) {
          soldier.takeDamage(this.attackDamage);

          // Particules d'impact
          for (let i = 0; i < 5; i++) {
            const particle = this.scene.add.circle(
              endX + (Math.random() - 0.5) * 15,
              endY + (Math.random() - 0.5) * 15,
              2,
              0xff6600,
              1
            );
            particle.setDepth(103);
            this.scene.tweens.add({
              targets: particle,
              alpha: 0,
              scale: 0,
              duration: 300,
              onComplete: () => particle.destroy(),
            });
          }
        }

        axe.destroy();
      },
    });
  }

  drawHealthBar(scene) {
    const yOffset = -50;
    const width = 40;
    const height = 6;

    // Cadre noir + bordure blanche
    this.hpBg = scene.add.rectangle(
      0,
      yOffset,
      width + 2,
      height + 2,
      0x000000
    );
    this.hpBg.setStrokeStyle(1, 0xffffff);

    // Fond rouge sombre (vie manquante)
    this.hpRed = scene.add.rectangle(0, yOffset, width, height, 0x330000);

    // Barre verte (vie actuelle) - Ancrage à gauche (0, 0.5)
    this.hpGreen = scene.add.rectangle(
      -width / 2,
      yOffset,
      width,
      height,
      0x00ff00
    );
    this.hpGreen.setOrigin(0, 0.5);

    this.add([this.hpBg, this.hpRed, this.hpGreen]);
    this.hpBg.setDepth(100);
    this.hpRed.setDepth(100);
    this.hpGreen.setDepth(100);
  }

  spawn() {
    // Sécurité si path est null
    if (!this.path) return;

    this.isBlocked = false;
    this.blockedBy = null;

    // Initialiser la direction (par défaut vers la droite)
    this.facingRight = true;
    if (this.bodyGroup) {
      this.bodyGroup.setScale(1, 1);
      this.bodyGroup.rotation = 0;
    }

    const pathLength = this.path.getLength();
    const duration = (pathLength / this.speed) * 1000;

    const tween = this.scene.tweens.add({
      targets: this.follower,
      t: 1,
      duration: duration,
      onUpdate: () => {
        // Ne pas bouger si bloqué
        if (this.isBlocked) return;

        const p = this.path.getPoint(this.follower.t, this.follower.vec);
        this.setPosition(p.x, p.y);

        // Déterminer la direction de mouvement pour le flip
        const nextT = Math.min(this.follower.t + 0.01, 1);
        const nextP = this.path.getPoint(nextT);
        const dx = nextP.x - p.x;
        const dy = nextP.y - p.y;

        // Utiliser le flip horizontal au lieu de rotation
        // On détermine la direction principale (horizontal ou vertical)
        // Si le mouvement est principalement horizontal, on flip selon dx
        // Si le mouvement est principalement vertical, on garde la dernière direction horizontale
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        // Si le mouvement horizontal est significatif, on change la direction
        if (absDx > absDy * 0.3) {
          const shouldFaceRight = dx > 0;

          if (shouldFaceRight !== this.facingRight) {
            this.facingRight = shouldFaceRight;
            // Appliquer le flip sur le bodyGroup
            this.bodyGroup.setScale(this.facingRight ? 1 : -1, 1);
          }
        }

        // Garder l'ennemi toujours droit (pas de rotation)
        // L'ennemi reste vertical, seule la direction horizontale change
        this.bodyGroup.rotation = 0;
      },
      onComplete: () => {
        if (this.active && !this.isBlocked) {
          this.scene.takeDamage();
          this.destroy();
        }
      },
    });

    // Stocker la référence au tween pour pouvoir le mettre en pause/reprendre
    this.follower.tween = tween;
  }

  damage(amount) {
    this.hp -= amount;

    // Mettre à jour le tooltip si visible
    if (this.hpTooltip) {
      this.hpTooltip.setText(`${this.hp} / ${this.maxHp} HP`);
    }

    // Flash blanc
    if (this.bodyGroup) {
      this.scene.tweens.add({
        targets: this.bodyGroup,
        alpha: 0.5,
        duration: 50,
        yoyo: true,
      });
    }

    this.updateHealthBar();

    if (this.hp <= 0) {
      // Libérer le soldat qui bloque cet ennemi
      if (this.isBlocked && this.blockedBy) {
        this.blockedBy.releaseEnemy();
      }

      this.hideHpTooltip();
      this.scene.earnMoney(this.stats.reward);
      this.explode();
      this.destroy();
    }
  }

  updateHealthBar() {
    const pct = Phaser.Math.Clamp(this.hp / this.maxHp, 0, 1);
    let newWidth = 40 * pct;

    if (this.hp > 0 && newWidth < 2) newWidth = 2;

    this.hpGreen.width = newWidth;

    if (pct < 0.25) this.hpGreen.fillColor = 0xff0000;
    else if (pct < 0.5) this.hpGreen.fillColor = 0xffa500;
    else this.hpGreen.fillColor = 0x00ff00;
  }

  explode() {
    for (let i = 0; i < 6; i++) {
      const p = this.scene.add.rectangle(
        this.x,
        this.y,
        8,
        8,
        this.stats.color
      );
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 40 + 20;

      this.scene.tweens.add({
        targets: p,
        x: this.x + Math.cos(angle) * speed,
        y: this.y + Math.sin(angle) * speed,
        alpha: 0,
        scale: 0.2,
        duration: 400,
        onComplete: () => p.destroy(),
      });
    }
  }
}
