export const poison = {
  key: "poison",
  name: "Flaque de Poison",
  cooldown: 40000,     // 40 secondes
  poolRadius: 52,      // rayon de la flaque (px, avant scaleFactor)
  poolDuration: 12000, // 12 secondes sur la carte
  poisonDuration: 10000, // 10 secondes d'empoisonnement après contact
  tickInterval: 1000,
  minTickDamage: 10,   // dégâts min par tick
  maxTickDamage: 25,   // dégâts max par tick
  description:
    "Crée une flaque toxique sur le chemin.\n\n✅ Avantages:\n• Empoisonne tous les ennemis qui passent dessus\n• 10-25 dégâts/sec aléatoires pendant 10 secondes\n• Reste 12s sur la carte\n\n❌ Inconvénients:\n• Cooldown de 40 secondes",
};
