export const pink_phase_ghost = {
  name: "Fantôme de Phase",
  speed: 55, // Vitesse modérée, glisse doucement
  hp: 1380, // Plus fort en HP
  reward: 35, // Récompense augmentée
  playerDamage: 2,
  color: 0xffb6c1, // Rose clair
  damage: 28, // Dégâts augmentés
  attackSpeed: 700,
  scale: 1.3, // Plus gros
  description: "Fantôme de Phase - Unité invulnérable. Rôle : tank avec invulnérabilité périodique. POUVOIR SPÉCIAL : Devient invulnérable pendant 2 secondes toutes les 5 secondes (cycle de 3s vulnérable + 2s invulnérable). Très dangereux !",

  // Configuration de l'invulnérabilité périodique
  phaseInvulnerableDuration: 2000, // 2 secondes d'invulnérabilité
  phaseCycleDuration: 5000, // Cycle total de 5 secondes (3s vulnérable + 2s invulnérable)

  onDraw: (scene, container, color, enemyInstance) => {
    enemyInstance.elements = {};
    
    // Initialiser les timers pour l'invulnérabilité périodique
    enemyInstance.phaseStartTime = scene.time.now || 0;
    enemyInstance.isPhaseInvulnerable = false;
    // S'assurer que isInvulnerable est initialisé (sera mis à jour dans onUpdateAnimation)
    if (enemyInstance.isInvulnerable === undefined) {
      enemyInstance.isInvulnerable = false;
    }

    const colors = {
      ghostBody: 0xffb6c1,      // Rose clair pour le corps
      ghostBodyLight: 0xffc0cb, // Rose plus clair
      core: 0xff1493,           // Rose vif pour le noyau (quand vulnérable)
      coreDim: 0xff69b4,        // Rose plus pâle (quand invulnérable)
      outline: 0xff8fab,        // Contour rose
    };

    // CORPS DU FANTÔME (Forme de goutte arrondie) - PLUS GROS
    const ghostBody = scene.add.graphics();
    
    // Forme de goutte : partie supérieure arrondie, partie inférieure pointue
    ghostBody.fillStyle(colors.ghostBody);
    
    // Dessiner la forme de goutte (dimensions augmentées)
    ghostBody.beginPath();
    // Partie supérieure arrondie (cercle plus grand)
    ghostBody.arc(0, -10, 16, 0, Math.PI * 2);
    // Partie inférieure pointue (triangle arrondi plus grand)
    ghostBody.moveTo(-16, -10);
    ghostBody.lineTo(0, 12);
    ghostBody.lineTo(16, -10);
    ghostBody.closePath();
    ghostBody.fillPath();
    
    // Contour léger
    ghostBody.lineStyle(2, colors.outline, 0.6);
    ghostBody.strokePath();
    
    // Reflet lumineux sur le haut
    ghostBody.fillStyle(colors.ghostBodyLight, 0.5);
    ghostBody.fillCircle(-5, -13, 4);
    
    container.add(ghostBody);
    enemyInstance.elements.ghostBody = ghostBody;

    // NOYAU CENTRAL - Version vulnérable (rose vif, bien visible) - PLUS GROS
    const coreVulnerable = scene.add.graphics();
    coreVulnerable.fillStyle(colors.core); // Rose vif
    coreVulnerable.fillCircle(0, 0, 7); // Noyau plus gros
    coreVulnerable.fillStyle(0xffffff, 0.4);
    coreVulnerable.fillCircle(-2, -2, 3);
    container.add(coreVulnerable);
    enemyInstance.elements.coreVulnerable = coreVulnerable;

    // NOYAU CENTRAL - Version invulnérable (rose pâle, opacité 0.5)
    const coreInvulnerable = scene.add.graphics();
    coreInvulnerable.fillStyle(colors.coreDim, 0.5); // Rose pâle, opacité 0.5
    coreInvulnerable.fillCircle(0, 0, 7); // Noyau plus gros
    coreInvulnerable.alpha = 0.5;
    container.add(coreInvulnerable);
    enemyInstance.elements.coreInvulnerable = coreInvulnerable;
    
    // Par défaut, vulnérable est visible
    coreVulnerable.visible = true;
    coreInvulnerable.visible = false;

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    if (!enemyInstance.scene) return;

    const elements = enemyInstance.elements;
    if (!elements) return;

    // Gérer l'invulnérabilité périodique
    const stats = enemyInstance.stats || {};
    const phaseCycleDuration = stats.phaseCycleDuration || 5000;
    const phaseInvulnerableDuration = stats.phaseInvulnerableDuration || 2000;
    
    const cycleTime = (time - enemyInstance.phaseStartTime) % phaseCycleDuration;
    
    // Déterminer si on est dans la phase invulnérable (les 2 dernières secondes du cycle)
    const invulnerableStart = phaseCycleDuration - phaseInvulnerableDuration;
    const wasInvulnerable = enemyInstance.isPhaseInvulnerable;
    enemyInstance.isPhaseInvulnerable = cycleTime >= invulnerableStart;
    
    // Mettre à jour l'état d'invulnérabilité dans l'instance
    enemyInstance.isInvulnerable = enemyInstance.isPhaseInvulnerable;
    
    // Si on vient de devenir invulnérable, libérer tous les bloqueurs
    if (enemyInstance.isPhaseInvulnerable && !wasInvulnerable) {
      // Libérer les soldats qui bloquent ce fantôme
      if (enemyInstance.isBlocked && enemyInstance.blockedBy) {
        const blocker = enemyInstance.blockedBy;
        if (blocker && blocker.releaseEnemy) {
          blocker.releaseEnemy();
        }
        enemyInstance.isBlocked = false;
        enemyInstance.blockedBy = null;
      }
      
      // Libérer le héros s'il bloque ce fantôme
      if (enemyInstance.scene && enemyInstance.scene.hero) {
        const hero = enemyInstance.scene.hero;
        if (hero.blockingEnemy === enemyInstance) {
          hero.releaseEnemy();
        }
      }
      
      // Libérer tous les soldats qui pourraient bloquer ce fantôme
      if (enemyInstance.scene && enemyInstance.scene.soldiers) {
        enemyInstance.scene.soldiers.getChildren().forEach((soldier) => {
          if (soldier && soldier.blockingEnemy === enemyInstance) {
            if (soldier.releaseEnemy) {
              soldier.releaseEnemy();
            }
          }
        });
      }
      
      // S'assurer que le fantôme continue à bouger
      enemyInstance.isMoving = true;
    }

    // Animation de flottement (légère oscillation verticale)
    const floatSpeed = 0.003;
    const floatRange = 2.5; // Légèrement plus d'amplitude pour un plus gros fantôme
    const floatOffset = Math.sin(time * floatSpeed) * floatRange;
    if (elements.ghostBody) {
      elements.ghostBody.y = -10 + floatOffset;
    }

    // Indication visuelle selon l'état d'invulnérabilité
    if (enemyInstance.isPhaseInvulnerable) {
      // INVULNÉRABLE : Opacité 0.5
      if (enemyInstance.bodyGroup) {
        enemyInstance.bodyGroup.alpha = 0.5; // Opacité 0.5
      }
      if (elements.ghostBody) {
        elements.ghostBody.alpha = 0.5;
      }
      // Basculer vers le noyau invulnérable
      if (elements.coreVulnerable) elements.coreVulnerable.visible = false;
      if (elements.coreInvulnerable) elements.coreInvulnerable.visible = true;
    } else {
      // VULNÉRABLE : Bien visible, noyau rose vif
      if (enemyInstance.bodyGroup) {
        enemyInstance.bodyGroup.alpha = 1.0; // Complètement visible
      }
      if (elements.ghostBody) {
        elements.ghostBody.alpha = 1.0;
      }
      // Basculer vers le noyau vulnérable
      if (elements.coreVulnerable) elements.coreVulnerable.visible = true;
      if (elements.coreInvulnerable) elements.coreInvulnerable.visible = false;
    }

    // Animation de pulsation du noyau (légère) - seulement quand vulnérable
    const activeCore = enemyInstance.isPhaseInvulnerable ? elements.coreInvulnerable : elements.coreVulnerable;
    if (activeCore && activeCore.visible) {
      const pulseSpeed = 0.008;
      const pulseScale = 1 + Math.sin(time * pulseSpeed) * 0.1;
      activeCore.scaleX = pulseScale;
      activeCore.scaleY = pulseScale;
    }

    // Légère rotation du fantôme (effet de flottement)
    if (elements.ghostBody) {
      const rotationSpeed = 0.001;
      elements.ghostBody.rotation = Math.sin(time * rotationSpeed) * 0.1;
    }
  },
};

