export const criard = {
  name: "Criard",
  speed: 50,
  hp: 630,
  reward: 25,
  playerDamage: 1,
  color: 0xff6b00, // Orange vif
  damage: 38,
  attackSpeed: 1200,
  scale: 0.9,
  // Désactive les tours à 2 cases pendant 2s
  screamRadius: 2, // En cases
  screamDuration: 2000, // 2 secondes
  screamCooldown: 8000, // 8 secondes entre chaque cri

  onDraw: (scene, container, color, enemyInstance) => {
    enemyInstance.elements = {};

    const colors = {
      body: 0xff6b00,        // Orange vif
      bodyDark: 0xcc5500,    // Orange foncé
      mouth: 0xff0000,       // Bouche rouge
      eyes: 0xffff00,        // Yeux jaunes
      soundWave: 0xffff00,   // Ondes sonores
    };

    // Corps rond
    const body = scene.add.graphics();
    body.fillStyle(colors.body);
    body.fillCircle(0, 0, 14);
    body.fillStyle(colors.bodyDark);
    body.fillCircle(0, 0, 12);
    
    // Grande bouche ouverte
    body.fillStyle(colors.mouth);
    body.fillEllipse(0, 2, 16, 12);
    body.fillStyle(0x000000);
    body.fillEllipse(0, 2, 14, 10);
    
    // Yeux exorbités
    body.fillStyle(colors.eyes);
    body.fillCircle(-6, -6, 4);
    body.fillCircle(6, -6, 4);
    body.fillStyle(0x000000);
    body.fillCircle(-6, -6, 2);
    body.fillCircle(6, -6, 2);
    
    container.add(body);
    enemyInstance.elements.mainBody = body;

    // Ondes sonores (seront affichées lors du cri)
    const soundWaves = scene.add.container(0, 0);
    soundWaves.setVisible(false);
    container.add(soundWaves);
    enemyInstance.elements.soundWaves = soundWaves;

    enemyInstance.shouldRotate = false;
  },

  onUpdateAnimation: (time, enemyInstance) => {
    // Animation de la bouche qui s'ouvre et se ferme
    if (enemyInstance.elements.mainBody) {
      const mouthPulse = Math.sin(time * 0.02) * 0.1 + 1;
      enemyInstance.elements.mainBody.setScale(1, mouthPulse);
    }
  },
};

