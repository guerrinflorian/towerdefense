export const summon = {
  key: "summon",
  name: "Invocation de Soldats",
  cooldown: 90000,    // 90 secondes
  soldierCount: 3,    // nombre de soldats invoqués
  duration: 10000,    // 10 secondes avant disparition
  soldierHp: 200,     // PV de chaque soldat invoqué
  description:
    "Invoque 3 soldats temporaires sur le chemin.\n\n✅ Avantages:\n• 3 soldats qui bloquent et attaquent les ennemis\n• Chaque soldat a 200 PV\n• Disparaissent après 10 secondes\n\n❌ Inconvénients:\n• Cooldown de 90 secondes\n• Soldats temporaires (ne persistent pas entre les vagues)",
};
