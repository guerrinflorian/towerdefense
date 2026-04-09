# Tower Defense

Jeu de tower defense en temps réel avec héros jouable, système de sorts, multi-niveaux et classements en ligne.

## Présentation

Projet full-stack développé en JavaScript vanille avec Phaser 3 pour le moteur de jeu, Vue 3 pour l'interface, et une API REST Express avec PostgreSQL pour la persistance des données.

Le joueur contrôle un héros en temps réel sur la carte tout en plaçant des tourelles pour défendre sa base contre des vagues d'ennemis. Un système de sorts achetables, un leaderboard global et un suivi de statistiques par run complètent l'expérience.

## Fonctionnalités

- **Héros jouable** : déplacement en temps réel, attaques, améliorations de stats entre les parties
- **Sorts achetables** : barrière, poison, paralysie et autres effets avec cooldowns
- **Tourelles** : placement par drag & drop, portée affichée au survol, types variés (sniper, mortier, mitrailleuse, caserne)
- **Ennemis** : 20+ types répartis sur 8 niveaux, comportements distincts, boss et unités spéciales
- **Système de vagues** : bonus d'anticipation si la vague est lancée tôt
- **Pièces d'or** : loot des ennemis ramassé automatiquement
- **Succès** : 30+ succès liés au combat, à l'économie et aux héros
- **Classements** : leaderboard global par héros et par niveau
- **Authentification** : inscription, connexion JWT, réinitialisation de mot de passe par email
- **Multi-chapitres** : carte du monde avec niveaux débloquables

## Stack technique

| Côté | Technologies |
|------|-------------|
| Frontend | Phaser 3, Vue 3, JavaScript ES modules, Parcel |
| Backend | Node.js, Express, PostgreSQL, JWT, Nodemailer |
| Déploiement | Vercel (frontend + API serverless) |

## Architecture

```
src/
  scenes/          # Scènes Phaser (GameScene, MainMenuScene)
  scenes/managers/ # Managers modulaires (UI, vagues, tourelles, héros...)
  objects/         # Entités du jeu (Hero, Enemy, Turret, Soldier, Barracks...)
  objects/enemies/ # Ennemis par chapitre
  vue/             # Composants Vue (menus, modales, HUD, sorts...)
  sorts/           # Logique des sorts
  config/          # Configuration des niveaux et ennemis
server/
  routes/          # Routes API (auth, leaderboard, succès, runs)
  db.js            # Connexion PostgreSQL
  middleware/      # Authentification JWT
```

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/guerrinflorian/towerdefense.git
cd towerdefense

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Renseigner DATABASE_URL, JWT_SECRET, SMTP_*

# Lancer en développement (client + serveur)
npm start
```

Le client est disponible sur `http://localhost:1234`.

## Variables d'environnement

```
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=votre_secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=email@example.com
SMTP_PASS=mot_de_passe
```

## Branches

| Branche | Description |
|---------|-------------|
| `main` | Version stable de production |
| `dev` | Branche de développement |
