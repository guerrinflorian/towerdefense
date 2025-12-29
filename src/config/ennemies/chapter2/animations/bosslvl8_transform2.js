// Animation de transformation Phase 2 -> Phase 3
export function playBosslvl8Transform2Animation(scene, x, y) {
  if (!scene || !scene.add || !scene.tweens) {
    console.warn("Scene non disponible pour l'animation de transformation");
    return;
  }
  
  const duration = 1500; // 1.5 secondes
  
  // === 1. EXPLOSION MASSIVE DE PARTICULES ===
  const particleCount = 50;
  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
    const distance = 30 + Math.random() * 50;
    const speed = 80 + Math.random() * 120;
    
    const particle = scene.add.graphics();
    particle.x = x;
    particle.y = y;
    const colors = [0x8b4513, 0xff6347, 0xff4500, 0x654321];
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.fillStyle(color, 0.9);
    particle.fillCircle(0, 0, 4 + Math.random() * 5);
    particle.setDepth(2000);
    
    scene.tweens.add({
      targets: particle,
      x: x + Math.cos(angle) * distance,
      y: y + Math.sin(angle) * distance,
      alpha: 0,
      scale: 0,
      duration: 500 + Math.random() * 400,
      ease: 'Power2',
      onComplete: () => particle.destroy(),
    });
  }
  
  // === 2. ONDES DE CHOC MULTIPLES ===
  for (let i = 0; i < 4; i++) {
    const shockwave = scene.add.graphics();
    shockwave.x = x;
    shockwave.y = y;
    const colors = [0x8b4513, 0xff6347, 0xff4500];
    const color = colors[i % colors.length];
    shockwave.lineStyle(8 - i * 1.5, color, 0.9 - i * 0.15);
    shockwave.strokeCircle(0, 0, 35 + i * 5);
    shockwave.setDepth(1999);
    
    scene.tweens.add({
      targets: shockwave,
      scaleX: 4 + i * 0.5,
      scaleY: 4 + i * 0.5,
      alpha: 0,
      duration: 700 + i * 100,
      delay: i * 150,
      ease: 'Power2',
      onComplete: () => shockwave.destroy(),
    });
  }
  
  // === 3. FLASH EXPLOSIF INTENSE ===
  const flash1 = scene.add.circle(x, y, 20, 0xffffff, 1);
  flash1.setDepth(2001);
  
  scene.tweens.add({
    targets: flash1,
    scale: 4,
    alpha: 0,
    duration: 400,
    ease: 'Power2',
    onComplete: () => flash1.destroy(),
  });
  
  const flash2 = scene.add.circle(x, y, 15, 0xff4500, 0.9);
  flash2.setDepth(2002);
  
  scene.tweens.add({
    targets: flash2,
    scale: 5,
    alpha: 0,
    duration: 500,
    delay: 100,
    ease: 'Power2',
    onComplete: () => flash2.destroy(),
  });
  
  // === 4. VAPEURS EXPLOSIVES ===
  for (let i = 0; i < 25; i++) {
    const steam = scene.add.graphics();
    steam.x = x + (Math.random() - 0.5) * 80;
    steam.y = y + (Math.random() - 0.5) * 80;
    const steamColors = [0x8b4513, 0xff6347, 0xff4500, 0x654321];
    const steamColor = steamColors[Math.floor(Math.random() * steamColors.length)];
    steam.fillStyle(steamColor, 0.7);
    steam.fillEllipse(0, 0, 15 + Math.random() * 20, 25 + Math.random() * 30);
    steam.setDepth(1997);
    
    scene.tweens.add({
      targets: steam,
      y: steam.y - 100 - Math.random() * 50,
      x: steam.x + (Math.random() - 0.5) * 60,
      scale: 2 + Math.random() * 0.5,
      alpha: 0,
      rotation: (Math.random() - 0.5) * 0.8,
      duration: 800 + Math.random() * 500,
      ease: 'Power1',
      onComplete: () => steam.destroy(),
    });
  }
  
  // === 5. ÉTINCELLES EXPLOSIVES ===
  for (let i = 0; i < 35; i++) {
    const spark = scene.add.graphics();
    spark.x = x;
    spark.y = y;
    const sparkColors = [0xffffff, 0xff6347, 0xff4500, 0xffff00];
    const sparkColor = sparkColors[Math.floor(Math.random() * sparkColors.length)];
    spark.fillStyle(sparkColor, 1);
    spark.fillCircle(0, 0, 2 + Math.random() * 3);
    spark.setDepth(2003);
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 80;
    const speed = 3 + Math.random() * 4;
    
    scene.tweens.add({
      targets: spark,
      x: x + Math.cos(angle) * distance,
      y: y + Math.sin(angle) * distance,
      alpha: 0,
      scale: 0,
      duration: 300 + Math.random() * 300,
      ease: 'Power2',
      onComplete: () => spark.destroy(),
    });
  }
  
  // === 6. ANNEAUX CONCENTRIQUES INTENSIFIÉS ===
  for (let i = 0; i < 5; i++) {
    const ring = scene.add.graphics();
    ring.x = x;
    ring.y = y;
    const ringColors = [0x8b4513, 0xff6347, 0xff4500];
    const ringColor = ringColors[i % ringColors.length];
    ring.lineStyle(4 - i * 0.5, ringColor, 0.8 - i * 0.1);
    ring.strokeCircle(0, 0, 25 + i * 8);
    ring.setDepth(1996);
    
    scene.tweens.add({
      targets: ring,
      scaleX: 4 + i * 0.5,
      scaleY: 4 + i * 0.5,
      alpha: 0,
      duration: 600 + i * 100,
      delay: i * 80,
      ease: 'Power2',
      onComplete: () => ring.destroy(),
    });
  }
  
  // === 7. LUMIÈRE PULSANTE INTENSE ===
  const pulse1 = scene.add.circle(x, y, 50, 0xff4500, 0.5);
  pulse1.setDepth(1995);
  
  scene.tweens.add({
    targets: pulse1,
    scale: 2.5,
    alpha: 0,
    duration: duration,
    ease: 'Sine',
    onComplete: () => pulse1.destroy(),
  });
  
  const pulse2 = scene.add.circle(x, y, 40, 0xff6347, 0.4);
  pulse2.setDepth(1994);
  
  scene.tweens.add({
    targets: pulse2,
    scale: 3,
    alpha: 0,
    duration: duration + 200,
    delay: 100,
    ease: 'Sine',
    onComplete: () => pulse2.destroy(),
  });
  
  // === 8. PARTICULES D'ÉNERGIE EXPLOSIVES ===
  for (let i = 0; i < 12; i++) {
    const energy = scene.add.graphics();
    energy.x = x;
    energy.y = y;
    const energyColors = [0xff4500, 0xff6347, 0xffff00];
    const energyColor = energyColors[Math.floor(Math.random() * energyColors.length)];
    energy.fillStyle(energyColor, 0.9);
    energy.fillCircle(0, 0, 5 + Math.random() * 3);
    energy.setDepth(2004);
    
    const radius = 40;
    const startAngle = (Math.PI * 2 * i) / 12;
    
    scene.tweens.add({
      targets: energy,
      x: x + Math.cos(startAngle) * radius * 2.5,
      y: y + Math.sin(startAngle) * radius * 2.5,
      alpha: 0,
      scale: 0,
      duration: 500,
      delay: i * 40,
      ease: 'Power2',
      onComplete: () => energy.destroy(),
    });
  }
  
  // === 9. RAYONS LUMINEUX ===
  for (let i = 0; i < 8; i++) {
    const ray = scene.add.graphics();
    ray.x = x;
    ray.y = y;
    const rayAngle = (Math.PI * 2 * i) / 8;
    ray.lineStyle(4, 0xff4500, 0.8);
    ray.lineBetween(0, 0, Math.cos(rayAngle) * 60, Math.sin(rayAngle) * 60);
    ray.setDepth(2005);
    
    scene.tweens.add({
      targets: ray,
      alpha: 0,
      scale: 1.5,
      rotation: rayAngle,
      duration: 400,
      delay: i * 50,
      ease: 'Power2',
      onComplete: () => ray.destroy(),
    });
  }
  
  // === 10. NUAGE DE FUMÉE CENTRAL ===
  const smokeCloud = scene.add.graphics();
  smokeCloud.x = x;
  smokeCloud.y = y;
  smokeCloud.fillStyle(0x654321, 0.6);
  for (let i = 0; i < 10; i++) {
    smokeCloud.fillEllipse(
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 40,
      20 + Math.random() * 20,
      30 + Math.random() * 30
    );
  }
  smokeCloud.setDepth(1993);
  
  scene.tweens.add({
    targets: smokeCloud,
    scale: 3,
    alpha: 0,
    duration: 1000,
    ease: 'Power2',
    onComplete: () => smokeCloud.destroy(),
  });
}

