export const bear_trap = {
  key: "bear_trap",
  name: "Piège à Ours",
  trapRadius: 28,   // rayon de déclenchement (px, avant scaleFactor)
  paralyzeDuration: 4000, // 4 secondes d'immobilisation
  bleedDamage: 20,  // dégâts de saignement par tick
  bleedTicks: 5,    // 5 ticks = 100 dégâts total
  bleedInterval: 1000,
  description:
    "Pose un piège invisible sur le chemin.\n\n✅ Avantages:\n• Immobilise le premier ennemi 4 secondes\n• Inflige 20 dégâts/sec pendant 5 secondes (saignement)\n• Invisible pour les ennemis\n\n❌ Inconvénients:\n• 1 seul par vague\n• Ne s'active que sur le premier ennemi",
};
