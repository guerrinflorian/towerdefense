// Animation de transformation Phase 1 -> Phase 2
export function playBosslvl8Transform1Animation(scene, x, y) {
  if (!scene || !scene.add || !scene.tweens) {
    console.warn("Scene non disponible pour l'animation de transformation");
    return;
  }
  
  const duration = 1200; // 1.2 secondes
  
  // === 1. EXPLOSION DE PARTICULES MÉTALLIQUES ===
  const particleCount = 30;
  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount;
    const distance = 20 + Math.random() * 30;
    const speed = 50 + Math.random() * 100;
    
    const particle = scene.add.graphics();
    particle.x = x;
    particle.y = y;
    particle.fillStyle(0x708090, 0.9);
    particle.fillCircle(0, 0, 3 + Math.random() * 4);
    particle.setDepth(2000);
    
    scene.tweens.add({
      targets: particle,
      x: x + Math.cos(angle) * distance,
      y: y + Math.sin(angle) * distance,
      alpha: 0,
      scale: 0,
      duration: 400 + Math.random() * 300,
      ease: 'Power2',
      onComplete: () => particle.destroy(),
    });
  }
  
  // === 2. ONDE DE CHOC MÉTALLIQUE ===
  const shockwave1 = scene.add.graphics();
  shockwave1.x = x;
  shockwave1.y = y;
  shockwave1.lineStyle(6, 0x708090, 0.8);
  shockwave1.strokeCircle(0, 0, 30);
  shockwave1.setDepth(1999);
  
  scene.tweens.add({
    targets: shockwave1,
    scaleX: 4,
    scaleY: 4,
    alpha: 0,
    duration: 600,
    ease: 'Power2',
    onComplete: () => shockwave1.destroy(),
  });
  
  const shockwave2 = scene.add.graphics();
  shockwave2.x = x;
  shockwave2.y = y;
  shockwave2.lineStyle(4, 0x556b2f, 0.6);
  shockwave2.strokeCircle(0, 0, 25);
  shockwave2.setDepth(1998);
  
  scene.tweens.add({
    targets: shockwave2,
    scaleX: 5,
    scaleY: 5,
    alpha: 0,
    duration: 800,
    delay: 100,
    ease: 'Power2',
    onComplete: () => shockwave2.destroy(),
  });
  
  // === 3. FLASH LUMINEUX CENTRAL ===
  const flash = scene.add.circle(x, y, 15, 0xffffff, 1);
  flash.setDepth(2001);
  
  scene.tweens.add({
    targets: flash,
    scale: 3,
    alpha: 0,
    duration: 300,
    ease: 'Power2',
    onComplete: () => flash.destroy(),
  });
  
  // === 4. VAPEURS CHIMIQUES INTENSIFIÉES ===
  for (let i = 0; i < 15; i++) {
    const steam = scene.add.graphics();
    steam.x = x + (Math.random() - 0.5) * 60;
    steam.y = y + (Math.random() - 0.5) * 60;
    const steamColor = [0x778899, 0x708090, 0x556b2f][Math.floor(Math.random() * 3)];
    steam.fillStyle(steamColor, 0.6);
    steam.fillEllipse(0, 0, 10 + Math.random() * 15, 20 + Math.random() * 25);
    steam.setDepth(1997);
    
    scene.tweens.add({
      targets: steam,
      y: steam.y - 80 - Math.random() * 40,
      x: steam.x + (Math.random() - 0.5) * 40,
      scale: 1.5 + Math.random() * 0.5,
      alpha: 0,
      rotation: (Math.random() - 0.5) * 0.5,
      duration: 600 + Math.random() * 400,
      ease: 'Power1',
      onComplete: () => steam.destroy(),
    });
  }
  
  // === 5. ÉTINCELLES MÉTALLIQUES ===
  for (let i = 0; i < 20; i++) {
    const spark = scene.add.graphics();
    spark.x = x;
    spark.y = y;
    spark.fillStyle(0xffffff, 1);
    spark.fillCircle(0, 0, 2);
    spark.setDepth(2002);
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 60;
    const speed = 2 + Math.random() * 3;
    
    scene.tweens.add({
      targets: spark,
      x: x + Math.cos(angle) * distance,
      y: y + Math.sin(angle) * distance,
      alpha: 0,
      scale: 0,
      duration: 200 + Math.random() * 200,
      ease: 'Power2',
      onComplete: () => spark.destroy(),
    });
  }
  
  // === 6. ANNEAUX CONCENTRIQUES ===
  for (let i = 0; i < 3; i++) {
    const ring = scene.add.graphics();
    ring.x = x;
    ring.y = y;
    ring.lineStyle(3 - i, 0x708090, 0.7 - i * 0.2);
    ring.strokeCircle(0, 0, 20 + i * 10);
    ring.setDepth(1996);
    
    scene.tweens.add({
      targets: ring,
      scaleX: 3 + i,
      scaleY: 3 + i,
      alpha: 0,
      duration: 500 + i * 100,
      delay: i * 100,
      ease: 'Power2',
      onComplete: () => ring.destroy(),
    });
  }
  
  // === 7. LUMIÈRE PULSANTE ===
  const pulse = scene.add.circle(x, y, 40, 0x708090, 0.4);
  pulse.setDepth(1995);
  
  scene.tweens.add({
    targets: pulse,
    scale: 2,
    alpha: 0,
    duration: duration,
    ease: 'Sine',
    onComplete: () => pulse.destroy(),
  });
  
  // === 8. PARTICULES D'ÉNERGIE ORBITANTES ===
  for (let i = 0; i < 8; i++) {
    const energy = scene.add.graphics();
    energy.x = x;
    energy.y = y;
    energy.fillStyle(0x556b2f, 0.8);
    energy.fillCircle(0, 0, 4);
    energy.setDepth(2003);
    
    const radius = 30;
    const startAngle = (Math.PI * 2 * i) / 8;
    
    scene.tweens.add({
      targets: energy,
      x: x + Math.cos(startAngle) * radius * 2,
      y: y + Math.sin(startAngle) * radius * 2,
      alpha: 0,
      scale: 0,
      duration: 400,
      delay: i * 50,
      ease: 'Power2',
      onComplete: () => energy.destroy(),
    });
  }
}

