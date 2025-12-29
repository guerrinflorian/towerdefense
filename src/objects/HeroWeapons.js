/**
 * Fonctions de dessin et d'animation des armes des héros
 * Version Premium : Animations fluides, effets d'impact et de recul.
 */

/**
 * Dessine une épée stylisée (Pulskar - hero_id = 1)
 */
export function drawSwordWeapon(scene, s, k) {
  const swordGroup = scene.add.container(0, 0);
  const swordPivot = scene.add.container(12 * s * k, -4 * s * k);
  swordPivot.setRotation(-0.3);

  const sword = scene.add.graphics();

  // Ombre portée interne
  sword.fillStyle(0x000000, 0.2);
  sword.fillRoundedRect(1 * s * k, -1 * s * k, 23 * s * k, 5 * s * k, 2 * s * k);

  // Lame principale (Gris acier)
  sword.fillStyle(0xd6d6d6, 1);
  sword.fillRoundedRect(0, -2 * s * k, 22 * s * k, 5 * s * k, 2 * s * k);
  
  // Reflet de lumière sur le tranchant
  sword.fillStyle(0xffffff, 0.8);
  sword.fillRoundedRect(0, -2 * s * k, 22 * s * k, 1.8 * s * k, 2 * s * k);

  // Pointe affûtée
  sword.fillStyle(0xeaeaea, 1);
  sword.fillTriangle(22 * s * k, -2 * s * k, 30 * s * k, 0.5 * s * k, 22 * s * k, 3 * s * k);

  // Garde (Or / Bronze)
  sword.fillStyle(0xcd7f32, 1);
  sword.fillRoundedRect(-4 * s * k, -5 * s * k, 6 * s * k, 10 * s * k, 2 * s * k);
  
  // Poignée (Cuir sombre)
  sword.fillStyle(0x3e2723, 1);
  sword.fillRoundedRect(-9 * s * k, -2 * s * k, 6 * s * k, 4 * s * k, 1 * s * k);

  // Pommeau
  sword.fillStyle(0xbdc3c7, 1);
  sword.fillCircle(-9.5 * s * k, 0, 2.5 * s * k);

  swordPivot.add(sword);
  swordGroup.add(swordPivot);

  return { swordPivot, swordGroup, secondDaggerPivot: null, secondWeaponGroup: null };
}

/**
 * Dessine deux dagues de précision (Pirlov - hero_id = 2)
 */
export function drawDaggers(scene, s, k) {
  const createDagger = (isLeft) => {
    const pivot = scene.add.container(isLeft ? -12 * s * k : 12 * s * k, -2 * s * k);
    pivot.setRotation(isLeft ? 0.3 : -0.3);

    const d = scene.add.graphics();
    
    // Lame (Obscure avec liseré clair)
    d.fillStyle(0x2c3e50, 1);
    d.fillRoundedRect(0, -1.2 * s * k, 16 * s * k, 2.5 * s * k, 1 * s * k);
    d.fillStyle(0xecf0f1, 0.4);
    d.fillRect(0, -1.2 * s * k, 16 * s * k, 0.8 * s * k);
    
    // Pointe
    d.fillStyle(0x2c3e50, 1);
    d.fillTriangle(16 * s * k, -1.2 * s * k, 22 * s * k, 0, 16 * s * k, 1.3 * s * k);
    
    // Garde minimaliste
    d.fillStyle(0x7f8c8d, 1);
    d.fillRoundedRect(-2 * s * k, -3 * s * k, 3 * s * k, 6 * s * k, 1 * s * k);
    
    // Poignée
    d.fillStyle(0x1a1a1a, 1);
    d.fillRoundedRect(-5 * s * k, -1.2 * s * k, 4 * s * k, 2.5 * s * k, 1 * s * k);

    pivot.add(d);
    return pivot;
  };

  const swordGroup = scene.add.container(0, 0);
  const swordPivot = createDagger(false);
  swordGroup.add(swordPivot);

  const secondWeaponGroup = scene.add.container(0, 0);
  const secondDaggerPivot = createDagger(true);
  secondWeaponGroup.add(secondDaggerPivot);

  return { swordPivot, secondDaggerPivot, swordGroup, secondWeaponGroup };
}

export function drawWeapon(scene, heroId, s, k) {
  return heroId === 2 ? drawDaggers(scene, s, k) : drawSwordWeapon(scene, s, k);
}

/**
 * ANIMATION ÉPÉE : Grand arc de cercle + Stretch + Recul
 */
export function playSwordAttackAnimation(scene, swordPivot) {
  if (!swordPivot) return;
  
  // Sauvegarder la position initiale pour le retour
  const initialX = swordPivot.x;
  const initialRotation = swordPivot.rotation || -0.3;
  const initialScaleX = swordPivot.scaleX || 1;
  const initialScaleY = swordPivot.scaleY || 1;

  // 1. Préparation (Wind up) : L'épée recule un peu
  scene.tweens.add({
    targets: swordPivot,
    rotation: -1.2,
    x: initialX - 5,
    duration: 100,
    ease: 'Cubic.easeIn',
    onComplete: () => {
      // 2. Frappe (The Strike) : Rotation rapide + étirement (scale)
      scene.tweens.add({
        targets: swordPivot,
        rotation: 1.1,
        scaleX: 1.4, // Étirement pour l'effet de vitesse
        scaleY: 0.8,
        x: initialX + 15,
        duration: 80,
        ease: 'Expo.easeOut',
        onComplete: () => {
          // 3. Retour à la normale avec petit rebond (Overshoot)
          scene.tweens.add({
            targets: swordPivot,
            rotation: initialRotation,
            scaleX: initialScaleX,
            scaleY: initialScaleY,
            x: initialX,
            duration: 300,
            ease: 'Back.easeOut'
          });
        }
      });
    }
  });
}

/**
 * ANIMATION DAGUES : Estocades rapides et alternées (L-R-L)
 */
export function playDaggerAttackAnimation(scene, swordPivot, secondDaggerPivot) {
  if (!swordPivot || !secondDaggerPivot) return;

  const animateDagger = (target, delay, isLeft) => {
    scene.tweens.add({
      targets: target,
      x: target.x + (isLeft ? -20 : 20), // Poussée vers l'avant
      rotation: isLeft ? -0.5 : 0.5,
      scaleX: 1.5,
      duration: 70,
      delay: delay,
      yoyo: true,
      ease: 'Quart.easeOut',
      onComplete: () => {
        // Reset propre
        scene.tweens.add({
          targets: target,
          rotation: isLeft ? 0.3 : -0.3,
          scaleX: 1,
          duration: 150
        });
      }
    });
  };

  // Attaque en "V" : la dague droite part d'abord, la gauche suit très vite
  animateDagger(swordPivot, 0, false);
  animateDagger(secondDaggerPivot, 60, true);
}

/**
 * Orchestrateur d'animation
 */
export function playWeaponAttackAnimation(scene, heroId, swordPivot, secondDaggerPivot = null) {
  if (heroId === 2) {
    playDaggerAttackAnimation(scene, swordPivot, secondDaggerPivot);
  } else {
    playSwordAttackAnimation(scene, swordPivot);
  }
}