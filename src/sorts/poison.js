export const poison = {
  key: "poison",
  name: "Flaque de Poison",
  cooldown: 40000, // 40 secondes
  poolRadius: 52,  // rayon de la flaque (px, avant scaleFactor)
  poolDuration: 12000, // 12 secondes sur la carte
  tickDamage: 18,  // dégâts par tick (toutes les secondes)
  tickInterval: 1000,
  totalTicks: 8,   // 8 ticks = 144 dégâts max si ennemi reste dans la flaque
  description:
    "Crée une flaque toxique sur le chemin.\n\n✅ Avantages:\n• Empoisonne tous les ennemis qui passent dessus\n• 18 dégâts/sec pendant 8 secondes\n• Reste 12s sur la carte\n\n❌ Inconvénients:\n• Cooldown de 40 secondes",
};
