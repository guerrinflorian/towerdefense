/**
 * Affiche un chiffre de dégâts flottant au-dessus d'une cible.
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {number} amount   - montant de dégâts (positif)
 * @param {string} source   - "poison"|"bleed"|"lightning"|"hero"|"soldier"|"turret"|...
 */
export function showFloatingDamage(scene, x, y, amount, source = "turret") {
  if (!scene?.add || !amount) return;

  const sc = scene.scaleFactor || 1;

  // Couleur selon la source
  let color = "#ff4444"; // défaut : rouge (tourelles, autres)
  if (source === "poison" || source === "bleed") color = "#44ff44";
  else if (source === "lightning") color = "#00eeff";
  else if (source === "hero") color = "#ffaa00";
  else if (source === "soldier") color = "#ff8800";
  // hero_dmg / soldier_dmg = dégâts reçus par le héros/soldat → orange foncé
  else if (source === "hero_dmg" || source === "soldier_dmg") color = "#ff6622";

  const offsetX = (Math.random() - 0.5) * 12 * sc;
  const fontSize = Math.round(Phaser.Math.Clamp(11 * sc, 9, 16));

  const txt = scene.add
    .text(x + offsetX, y - 14 * sc, `-${Math.round(amount)}`, {
      fontSize: `${fontSize}px`,
      color,
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: Math.round(2 * sc),
    })
    .setOrigin(0.5)
    .setDepth(2000);

  scene.tweens.add({
    targets: txt,
    y: txt.y - 26 * sc,
    alpha: 0,
    duration: 850,
    ease: "Cubic.easeOut",
    onComplete: () => txt.destroy(),
  });
}
