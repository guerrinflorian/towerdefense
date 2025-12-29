export const tileLaboratoryPath = {
  key: "tile_laboratory_path",
  draw(g, T) {
    const bgColor = 0x1e293b;     // Gris ardoise (plus clair que le sol pour le contraste)
    const detailColor = 0x334155; // Couleur des motifs
    const neonColor = 0x38bdf8;   // Cyan pour les bords

    // 1. Fond du chemin (Plaque unie)
    g.fillStyle(bgColor, 1);
    g.fillRect(0, 0, T, T);

    // 2. Motif de "Grip" (Micro-hexagones pour l'adhérence)
    // On crée une grille de petits points/hexagones pour donner de la texture
    g.fillStyle(detailColor, 0.5);
    const spacing = T / 8;
    for (let x = 0; x < T; x += spacing) {
      for (let y = 0; y < T; y += spacing) {
        // Décalage pour un look en nid d'abeille
        const offsetX = (y / spacing) % 2 === 0 ? 0 : spacing / 2;
        g.fillCircle(x + offsetX, y, 1.5);
      }
    }

    // 3. Bordures de délimitation (Rails latéraux)
    // Cela permet de bien voir où s'arrête le chemin
    g.fillStyle(neonColor, 0.2); 
    g.fillRect(0, 0, 4, T);       // Bord gauche (halo)
    g.fillRect(T - 4, 0, 4, T);   // Bord droit (halo)

    g.fillStyle(neonColor, 0.8);
    g.fillRect(0, 0, 1.5, T);     // Ligne nette gauche
    g.fillRect(T - 1.5, 0, 1.5, T); // Ligne nette droite

    // 4. Marquage d'usure centrale (Subtile)
    // Simule le passage répété au milieu
    g.fillStyle(0xffffff, 0.03);
    g.fillRect(T * 0.2, 0, T * 0.6, T);
  },
};