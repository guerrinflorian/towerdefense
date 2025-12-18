// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      if (res === false) {
        return {};
      }
      // Synthesize a module to follow re-exports.
      if (Array.isArray(res)) {
        var m = {__esModule: true};
        res.forEach(function (v) {
          var key = v[0];
          var id = v[1];
          var exp = v[2] || v[0];
          var x = newRequire(id);
          if (key === '*') {
            Object.keys(x).forEach(function (key) {
              if (
                key === 'default' ||
                key === '__esModule' ||
                Object.prototype.hasOwnProperty.call(m, key)
              ) {
                return;
              }

              Object.defineProperty(m, key, {
                enumerable: true,
                get: function () {
                  return x[key];
                },
              });
            });
          } else if (exp === '*') {
            Object.defineProperty(m, key, {
              enumerable: true,
              value: x,
            });
          } else {
            Object.defineProperty(m, key, {
              enumerable: true,
              get: function () {
                if (exp === 'default') {
                  return x.__esModule ? x.default : x;
                }
                return x[exp];
              },
            });
          }
        });
        return m;
      }
      return newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"fILKw":[function(require,module,exports,__globalThis) {
var _mainMenuSceneJs = require("./scenes/MainMenuScene.js");
var _gameSceneJs = require("./scenes/GameScene.js");
var _settingsJs = require("./config/settings.js");
const config = {
    type: Phaser.AUTO,
    parent: "game-container",
    // Utiliser toute la taille de la fenêtre
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: "#000000",
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    input: {
        activePointers: 3,
        smoothFactor: 0
    },
    scene: [
        (0, _mainMenuSceneJs.MainMenuScene),
        (0, _gameSceneJs.GameScene)
    ],
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    }
};
const game = new Phaser.Game(config);
// Stocker les infos de taille dans le jeu pour y accéder depuis les scènes
game.baseWidth = (0, _settingsJs.CONFIG).GAME_WIDTH;
game.baseHeight = (0, _settingsJs.CONFIG).GAME_HEIGHT;
// Gérer le redimensionnement
function handleResize() {
    // Notifier la scène active
    if (game.scene.isActive("GameScene")) {
        const scene = game.scene.getScene("GameScene");
        if (scene && scene.handleResize) scene.handleResize();
    }
}
window.addEventListener("resize", handleResize);
window.addEventListener("orientationchange", ()=>{
    setTimeout(handleResize, 100);
});
// Empêcher le double-tap zoom sur mobile
let lastTouchEnd = 0;
document.addEventListener("touchend", (event)=>{
    const now = Date.now();
    if (now - lastTouchEnd <= 300) event.preventDefault();
    lastTouchEnd = now;
}, false);

},{"./scenes/MainMenuScene.js":"4CleT","./scenes/GameScene.js":"bDbTi","./config/settings.js":"9kTMs"}],"4CleT":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "MainMenuScene", ()=>MainMenuScene);
var _settingsJs = require("../config/settings.js");
var _indexJs = require("../config/levels/index.js");
class MainMenuScene extends Phaser.Scene {
    constructor(){
        super("MainMenuScene");
    }
    shutdown() {
        // Rendre shutdown() idempotent : safe si appelé plusieurs fois
        // Nettoyer tous les événements et objets avant de redémarrer
        try {
            if (this.children && this.children.removeAll) this.children.removeAll(true);
        } catch (e) {
        // Ignorer si déjà détruit
        }
        try {
            if (this.input && this.input.removeAllListeners) this.input.removeAllListeners();
        } catch (e) {
        // Ignorer si déjà détruit
        }
        try {
            if (this.tweens && this.tweens.killAll) this.tweens.killAll();
        } catch (e) {
        // Ignorer si déjà détruit
        }
        try {
            if (this.time && this.time.removeAllEvents) this.time.removeAllEvents();
        } catch (e) {
        // Ignorer si déjà détruit
        }
    }
    preload() {
        // Chargement de l'image de fond
        // Assure-toi que le fichier existe bien dans ce dossier !
        try {
            this.load.image("background_main", "../../src/images/backg.jpg");
        } catch (e) {
            console.warn("Image background_main non trouv\xe9e, utilisation d'un fond de couleur");
        }
    }
    create() {
        // Obtenir les dimensions réelles et le scale
        this.gameWidth = this.scale.width;
        this.gameHeight = this.scale.height;
        this.scaleFactor = this.game.scaleFactor || 1;
        this.baseWidth = this.game.baseWidth || (0, _settingsJs.CONFIG).GAME_WIDTH;
        this.baseHeight = this.game.baseHeight || (0, _settingsJs.CONFIG).GAME_HEIGHT;
        const cx = this.gameWidth / 2;
        const cy = this.gameHeight / 2;
        // --- 1. FOND D'ÉCRAN ---
        // On met une couleur de fond de secours si l'image ne charge pas
        this.cameras.main.setBackgroundColor("#0f0f1a");
        // Ajout de l'image
        // On vérifie si la texture existe pour éviter un crash si tu as oublié le fichier
        if (this.textures.exists("background_main")) {
            const bg = this.add.image(cx, cy, "background_main");
            // Technique pour faire "cover" (remplir l'écran sans déformer)
            const scaleX = this.gameWidth / bg.width;
            const scaleY = this.gameHeight / bg.height;
            const scale = Math.max(scaleX, scaleY);
            bg.setScale(scale).setScrollFactor(0);
        }
        // --- 2. OVERLAY SOMBRE ---
        // Ajoute un voile noir semi-transparent pour la lisibilité du texte
        this.add.rectangle(0, 0, this.gameWidth, this.gameHeight, 0x000000, 0.6).setOrigin(0, 0);
        // --- 3. PARTICLES D'AMBIANCE ---
        this.createAtmosphere();
        // --- 4. TITRE ---
        const titleSize = Math.max(40, 90 * this.scaleFactor);
        const title = this.add.text(cx, 150 * this.scaleFactor, "LAST OUTPOST", {
            fontSize: `${titleSize}px`,
            fontFamily: "Impact, Arial",
            fontStyle: "bold",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 8 * this.scaleFactor,
            shadow: {
                offsetX: 0,
                offsetY: 10 * this.scaleFactor,
                color: "#000000",
                blur: 20 * this.scaleFactor,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);
        // Animation de "respiration" du titre
        this.tweens.add({
            targets: title,
            scale: 1.05,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
        // --- 5. BOUTONS DE NIVEAUX ---
        // Récupérer la progression
        const levelReached = parseInt(localStorage.getItem("levelReached")) || 1;
        let yPos = 400 * this.scaleFactor;
        (0, _indexJs.LEVELS_CONFIG).forEach((level)=>{
            const isLocked = level.id > levelReached;
            this.createLevelButton(level, yPos, isLocked);
            yPos += 120 * this.scaleFactor; // Plus d'espace entre les boutons
        });
        // --- 6. BOUTON RESET (Discret en bas) ---
        const resetBtn = this.add.text(cx, this.gameHeight - 60 * this.scaleFactor, "R\xc9INITIALISER LA PROGRESSION", {
            fontSize: `${Math.max(12, 14 * this.scaleFactor)}px`,
            fontFamily: "Arial",
            color: "#666666"
        }).setOrigin(0.5).setInteractive({
            useHandCursor: true
        });
        resetBtn.on("pointerover", ()=>{
            if (resetBtn && resetBtn.active !== false) try {
                resetBtn.setColor("#ff4444");
            } catch (e) {
            // Ignorer si le bouton est détruit
            }
        });
        resetBtn.on("pointerout", ()=>{
            if (resetBtn && resetBtn.active !== false) try {
                resetBtn.setColor("#666666");
            } catch (e) {
            // Ignorer si le bouton est détruit
            }
        });
        resetBtn.on("pointerdown", ()=>{
            if (confirm("Voulez-vous vraiment effacer votre progression ?")) {
                localStorage.clear();
                this.scene.restart();
            }
        });
    }
    createAtmosphere() {
        // Création d'une texture de particule à la volée (petit rond flou)
        // Ne pas regénérer si elle existe déjà
        if (!this.textures || !this.make) {
            console.warn("Syst\xe8me de textures non disponible pour createAtmosphere");
            return;
        }
        if (!this.textures.exists("particle_dot")) try {
            const g = this.make.graphics({
                x: 0,
                y: 0,
                add: false
            });
            if (!g || !g.fillStyle || !g.generateTexture) {
                console.warn("Impossible de cr\xe9er l'objet Graphics pour particle_dot");
                return;
            }
            g.fillStyle(0xffffff, 1);
            g.fillCircle(4, 4, 4);
            g.generateTexture("particle_dot", 8, 8);
            // Nettoyer l'objet Graphics après utilisation
            if (g && g.destroy) try {
                g.destroy();
            } catch (e) {
            // Ignorer si déjà détruit
            }
        } catch (e) {
            console.warn("Erreur lors de la cr\xe9ation de particle_dot:", e);
        }
        const particles = this.add.particles(0, 0, "particle_dot", {
            x: {
                min: 0,
                max: this.gameWidth
            },
            y: {
                min: 0,
                max: this.gameHeight
            },
            lifespan: 4000,
            speedY: {
                min: -10,
                max: -30
            },
            scale: {
                start: 0.2,
                end: 0
            },
            quantity: 2,
            alpha: {
                start: 0.3,
                end: 0
            },
            blendMode: "ADD"
        });
    }
    createLevelButton(level, y, isLocked) {
        const w = 500 * this.scaleFactor;
        const h = 90 * this.scaleFactor;
        const x = this.gameWidth / 2;
        const container = this.add.container(x, y);
        // --- Design du Bouton ---
        const bg = this.add.graphics();
        // Fonction pour dessiner le bouton (état normal)
        const drawButton = (color, alpha, strokeColor)=>{
            if (bg && bg.active !== false) try {
                bg.clear();
                bg.fillStyle(color, alpha);
                // Forme biseautée ou arrondie
                bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
                bg.lineStyle(3, strokeColor, 1);
                bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
            } catch (e) {
                console.warn("Erreur lors du dessin du bouton:", e);
            }
        };
        // État initial
        const baseColor = isLocked ? 0x111111 : 0x004488;
        const strokeColor = isLocked ? 0x333333 : 0x0088ff;
        const baseAlpha = isLocked ? 0.5 : 0.8;
        drawButton(baseColor, baseAlpha, strokeColor);
        // --- Texte ---
        const labelText = isLocked ? `\u{1F512} V\xc9RROUILL\xc9` : `JOUER`;
        // Nom du niveau (En haut)
        const titleTxt = this.add.text(0, -15 * this.scaleFactor, level.name.toUpperCase(), {
            fontSize: `${Math.max(20, 32 * this.scaleFactor)}px`,
            fontFamily: "Arial",
            fontStyle: "bold",
            color: isLocked ? "#666" : "#fff"
        }).setOrigin(0.5);
        // Sous-titre (En bas)
        const subTxt = this.add.text(0, 20 * this.scaleFactor, labelText, {
            fontSize: `${Math.max(12, 16 * this.scaleFactor)}px`,
            fontFamily: "Arial",
            color: isLocked ? "#444" : "#00ccff"
        }).setOrigin(0.5);
        container.add([
            bg,
            titleTxt,
            subTxt
        ]);
        // --- Interaction ---
        if (!isLocked) {
            const zone = this.add.zone(0, 0, w, h).setInteractive({
                useHandCursor: true
            });
            container.add(zone);
            zone.on("pointerover", ()=>{
                // Effet Survol : Plus clair, bordure blanche, grossissement
                if (bg && bg.active !== false) drawButton(0x0055aa, 0.9, 0xffffff);
                if (container && container.active !== false) this.tweens.add({
                    targets: container,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 100,
                    ease: "Sine.easeOut"
                });
                if (subTxt && subTxt.active !== false) try {
                    subTxt.setColor("#ffffff");
                } catch (e) {
                // Ignorer si le texte est détruit
                }
            });
            zone.on("pointerout", ()=>{
                // Retour normal
                if (bg && bg.active !== false) drawButton(baseColor, baseAlpha, strokeColor);
                if (container && container.active !== false) this.tweens.add({
                    targets: container,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100,
                    ease: "Sine.easeOut"
                });
                if (subTxt && subTxt.active !== false) try {
                    subTxt.setColor("#00ccff");
                } catch (e) {
                // Ignorer si le texte est détruit
                }
            });
            zone.on("pointerdown", ()=>{
                // Effet clic puis changement de scène
                if (container && container.active !== false) this.tweens.add({
                    targets: container,
                    scaleX: 0.95,
                    scaleY: 0.95,
                    duration: 50,
                    yoyo: true,
                    onComplete: ()=>{
                        this.scene.start("GameScene", {
                            level: level.id
                        });
                    }
                });
                else // Si le container est détruit, changer directement de scène
                this.scene.start("GameScene", {
                    level: level.id
                });
            });
        }
    }
}

},{"../config/settings.js":"9kTMs","../config/levels/index.js":"8fcfE","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"9kTMs":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "CONFIG", ()=>CONFIG);
parcelHelpers.export(exports, "ENEMIES", ()=>ENEMIES);
parcelHelpers.export(exports, "TURRETS", ()=>TURRETS);
// ... Imports inchangés ...
var _gruntJs = require("../config/ennemies/grunt.js");
var _runnerJs = require("../config/ennemies/runner.js");
var _tankJs = require("../config/ennemies/tank.js");
var _shieldJs = require("../config/ennemies/shield.js");
var _bosslvl1Js = require("../config/ennemies/bosslvl1.js");
var _bosslvl2Js = require("../config/ennemies/bosslvl2.js");
var _witchJs = require("../config/ennemies/witch.js");
var _zombieMinionJs = require("../config/ennemies/zombie_minion.js");
var _tortueDragonJs = require("../config/ennemies/tortue_dragon.js");
var _shamanGobelinJs = require("../config/ennemies/shaman_gobelin.js");
var _diviseurJs = require("../config/ennemies/diviseur.js");
var _slimeMediumJs = require("../config/ennemies/slime_medium.js");
var _slimeSmallJs = require("../config/ennemies/slime_small.js");
var _machineGunJs = require("../config/turrets/machineGun.js");
var _sniperJs = require("../config/turrets/sniper.js");
var _cannonJs = require("../config/turrets/cannon.js");
var _zapJs = require("../config/turrets/zap.js");
var _barracksJs = require("../config/turrets/barracks.js");
const CONFIG = {
    TILE_SIZE: 64,
    UI_HEIGHT: 80,
    MAP_OFFSET: 120,
    GAME_WIDTH: 960,
    GAME_HEIGHT: 1080,
    STARTING_MONEY: 650,
    STARTING_LIVES: 20,
    TOOLBAR_HEIGHT: 100,
    TOOLBAR_MARGIN: 20
};
const ENEMIES = {
    grunt: (0, _gruntJs.grunt),
    runner: (0, _runnerJs.runner),
    tank: (0, _tankJs.tank),
    shield: (0, _shieldJs.shield),
    bosslvl1: (0, _bosslvl1Js.bosslvl1),
    bosslvl2: (0, _bosslvl2Js.bosslvl2),
    witch: (0, _witchJs.witch),
    zombie_minion: (0, _zombieMinionJs.zombie_minion),
    tortue_dragon: (0, _tortueDragonJs.tortue_dragon),
    shaman_gobelin: (0, _shamanGobelinJs.shaman_gobelin),
    diviseur: (0, _diviseurJs.diviseur),
    slime_medium: (0, _slimeMediumJs.slime_medium),
    slime_small: (0, _slimeSmallJs.slime_small)
};
const TURRETS = {
    machine_gun: (0, _machineGunJs.machine_gun),
    sniper: (0, _sniperJs.sniper),
    cannon: (0, _cannonJs.cannon),
    zap: (0, _zapJs.zap),
    barracks: (0, _barracksJs.barracks)
};

},{"../config/ennemies/grunt.js":"iqyIL","../config/ennemies/runner.js":"k54Ru","../config/ennemies/tank.js":"caNrh","../config/ennemies/shield.js":"BAQN3","../config/turrets/machineGun.js":"ecBws","../config/turrets/sniper.js":"fm2OQ","../config/turrets/cannon.js":"3RJPP","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT","../config/turrets/zap.js":"bgZGw","../config/turrets/barracks.js":"9rF1d","../config/ennemies/witch.js":"k759O","../config/ennemies/zombie_minion.js":"bONBj","../config/ennemies/bosslvl1.js":"lF8pq","../config/ennemies/bosslvl2.js":"hQduM","../config/ennemies/tortue_dragon.js":"bnkzu","../config/ennemies/shaman_gobelin.js":"8mFrl","../config/ennemies/diviseur.js":"7ppi2","../config/ennemies/slime_medium.js":"j7fMh","../config/ennemies/slime_small.js":"KCZbL"}],"iqyIL":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "grunt", ()=>grunt);
const grunt = {
    name: "Grunt",
    speed: 65,
    hp: 100,
    reward: 20,
    color: 0x558844,
    damage: 8,
    attackSpeed: 800,
    scale: 1,
    // --- DESSIN DU PERSONNAGE (Vue de profil) ---
    onDraw: (scene, container, color, enemyInstance)=>{
        // On stocke les références aux jambes dans l'instance pour pouvoir les animer
        enemyInstance.legs = {};
        // 1. Jambe Arrière (plus sombre)
        enemyInstance.legs.back = scene.add.container(0, 5); // Pivot à la hanche
        const legB = scene.add.graphics();
        legB.fillStyle(0x335522); // Vert foncé
        legB.fillRoundedRect(-3, 0, 6, 18, 2); // Cuisse/Mollet
        legB.fillRoundedRect(-4, 16, 10, 5, 2); // Botte
        enemyInstance.legs.back.add(legB);
        container.add(enemyInstance.legs.back);
        // 2. Corps (Torse, Tête, Bras visible)
        const body = scene.add.graphics();
        // Torse (Gilet)
        body.fillStyle(color);
        body.fillRoundedRect(-6, -10, 12, 18, 3);
        // Tête (Casque rond)
        body.fillStyle(0x446633);
        body.fillCircle(0, -14, 7);
        // Visière/Yeux (Petit trait noir)
        body.fillStyle(0x000000);
        body.fillRect(2, -16, 4, 3);
        // Bras (fixe le long du corps pour simplifier)
        body.fillStyle(color);
        body.fillRoundedRect(-2, -8, 6, 16, 2);
        container.add(body);
        // 3. Jambe Avant (couleur normale)
        enemyInstance.legs.front = scene.add.container(0, 5); // Pivot à la hanche
        const legF = scene.add.graphics();
        legF.fillStyle(color);
        legF.fillRoundedRect(-3, 0, 6, 18, 2); // Cuisse/Mollet
        legF.fillRoundedRect(-4, 16, 10, 5, 2); // Botte
        enemyInstance.legs.front.add(legF);
        container.add(enemyInstance.legs.front);
        // L'ennemi utilise maintenant le flip horizontal au lieu de rotation
        enemyInstance.shouldRotate = false;
    },
    // --- ANIMATION DE MARCHE (Pendule) ---
    onUpdateAnimation: (time, enemyInstance)=>{
        const speed = 0.008; // Vitesse du balancement
        const range = 0.5; // Amplitude du balancement (en radians)
        // Oscillation sinusoïdale
        // La jambe arrière est opposée à la jambe avant (+ Math.PI)
        enemyInstance.legs.front.rotation = Math.sin(time * speed) * range;
        enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * range;
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"jnFvT":[function(require,module,exports,__globalThis) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"k54Ru":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "runner", ()=>runner);
const runner = {
    name: "Scout",
    speed: 220,
    hp: 112,
    reward: 30,
    color: 0xffd166,
    damage: 14,
    attackSpeed: 600,
    scale: 1,
    onDraw: (scene, container, color, enemyInstance)=>{
        enemyInstance.legs = {};
        // Le corps est légèrement penché vers l'avant (mais on garde l'orientation verticale)
        // container.angle = -15; // Retiré pour garder l'ennemi droit
        // 1. Jambe Arrière (sombre)
        enemyInstance.legs.back = scene.add.container(2, 4);
        const legB = scene.add.graphics();
        legB.fillStyle(0xccaa44);
        legB.fillRoundedRect(-2, 0, 5, 22, 2); // Jambe fine et longue
        enemyInstance.legs.back.add(legB);
        container.add(enemyInstance.legs.back);
        // 2. Corps (Fin et aérodynamique)
        const body = scene.add.graphics();
        body.fillStyle(color);
        // Torse fin
        body.fillRoundedRect(-5, -12, 10, 18, 4);
        // Tête avec une sorte de capuche/masque pointu
        body.beginPath();
        body.moveTo(0, -22);
        body.lineTo(8, -14);
        body.lineTo(-4, -12);
        body.closePath();
        body.fillPath();
        container.add(body);
        // 3. Jambe Avant
        enemyInstance.legs.front = scene.add.container(2, 4);
        const legF = scene.add.graphics();
        legF.fillStyle(color);
        legF.fillRoundedRect(-2, 0, 5, 22, 2);
        enemyInstance.legs.front.add(legF);
        container.add(enemyInstance.legs.front);
        enemyInstance.shouldRotate = false;
    },
    onUpdateAnimation: (time, enemyInstance)=>{
        // Course rapide : vitesse élevée, grande amplitude
        const speed = 0.015;
        const range = 0.8;
        enemyInstance.legs.front.rotation = Math.sin(time * speed) * range;
        enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * range;
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"caNrh":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "tank", ()=>tank);
const tank = {
    name: "Heavy",
    speed: 38,
    hp: 2650,
    reward: 150,
    color: 0x224466,
    damage: 28,
    attackSpeed: 1200,
    scale: 1,
    onDraw: (scene, container, color, enemyInstance)=>{
        enemyInstance.legs = {};
        // 1. "Pied" Arrière (Gros bloc)
        enemyInstance.legs.back = scene.add.container(0, 10);
        const legB = scene.add.graphics();
        legB.fillStyle(0x112233);
        legB.fillRect(-10, 0, 20, 12); // Pied large
        enemyInstance.legs.back.add(legB);
        container.add(enemyInstance.legs.back);
        // 2. Corps (Armure massive)
        const body = scene.add.graphics();
        body.fillStyle(color);
        // Gros plastron carré
        body.fillRoundedRect(-18, -25, 36, 35, 6);
        body.lineStyle(3, 0x000000);
        body.strokeRoundedRect(-18, -25, 36, 35, 6);
        // Petite tête carrée engoncée dans l'armure
        body.fillStyle(0x112233);
        body.fillRect(-8, -32, 16, 10);
        // Oeil rouge unique type "cyclope robot"
        body.fillStyle(0xff0000);
        body.fillRect(4, -28, 6, 4);
        // Gros bras carré sur le côté
        body.fillStyle(color);
        body.fillRoundedRect(-4, -15, 14, 25, 4);
        container.add(body);
        // 3. "Pied" Avant
        enemyInstance.legs.front = scene.add.container(0, 10);
        const legF = scene.add.graphics();
        legF.fillStyle(color);
        legF.fillRect(-10, 0, 20, 12);
        enemyInstance.legs.front.add(legF);
        container.add(enemyInstance.legs.front);
        // Le tank est si gros qu'il ne tourne pas pour suivre le chemin, il reste droit
        enemyInstance.shouldRotate = false;
    },
    onUpdateAnimation: (time, enemyInstance)=>{
        // Piétinement lourd : faible vitesse, faible amplitude, mouvement vertical ajouté
        const speed = 0.004;
        const range = 0.2;
        const sin = Math.sin(time * speed);
        enemyInstance.legs.front.rotation = sin * range;
        enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * range;
        // Petit effet de rebond vertical lourd
        enemyInstance.bodyGroup.y = Math.abs(sin) * -3;
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"BAQN3":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "shield", ()=>shield);
const shield = {
    name: "Aegis",
    speed: 65,
    hp: 550,
    reward: 70,
    color: 0x00aabb,
    damage: 12,
    attackSpeed: 900,
    scale: 1,
    onDraw: (scene, container, color, enemyInstance)=>{
        enemyInstance.legs = {};
        // 1. Jambes (Similaires au Grunt mais plus robustes)
        enemyInstance.legs.back = scene.add.container(0, 5);
        const legB = scene.add.graphics();
        legB.fillStyle(0x007788);
        legB.fillRoundedRect(-4, 0, 8, 18, 3);
        enemyInstance.legs.back.add(legB);
        container.add(enemyInstance.legs.back);
        // 2. Corps (Derrière le bouclier)
        const body = scene.add.graphics();
        body.fillStyle(color);
        body.fillRoundedRect(-7, -12, 14, 20, 4); // Torse
        body.fillStyle(0x007788);
        body.fillCircle(0, -16, 8); // Tête
        container.add(body);
        // 3. Jambe Avant
        enemyInstance.legs.front = scene.add.container(0, 5);
        const legF = scene.add.graphics();
        legF.fillStyle(color);
        legF.fillRoundedRect(-4, 0, 8, 18, 3);
        enemyInstance.legs.front.add(legF);
        container.add(enemyInstance.legs.front);
        // 4. LE BOUCLIER (Devant tout le reste)
        const shield = scene.add.graphics();
        // Grand hexagone d'énergie
        shield.fillStyle(0x00ffff, 0.7); // Cyan semi-transparent
        shield.lineStyle(3, 0xffffff);
        shield.beginPath();
        shield.moveTo(15, -20);
        shield.lineTo(20, 0);
        shield.lineTo(15, 25);
        shield.lineTo(5, 20);
        shield.lineTo(5, -15);
        shield.closePath();
        shield.fillPath();
        shield.strokePath();
        // Symbole "+" dessus
        shield.fillStyle(0xffffff);
        shield.fillRect(10, -5, 6, 16);
        shield.fillRect(5, 0, 16, 6);
        container.add(shield);
        enemyInstance.shouldRotate = false;
    },
    onUpdateAnimation: (time, enemyInstance)=>{
        // Marche lente et assurée
        const speed = 0.006;
        const range = 0.4;
        enemyInstance.legs.front.rotation = Math.sin(time * speed) * range;
        enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * range;
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"ecBws":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "machine_gun", ()=>machine_gun);
const machine_gun = {
    key: "machine_gun",
    name: "Mitrailleuse",
    cost: 90,
    range: 95,
    damage: 10,
    rate: 240,
    color: 0x4488ff,
    maxLevel: 3,
    description: "Tourelle polyvalente avec cadence de tir tr\xe8s \xe9lev\xe9e.\n\n\u2705 Avantages:\n\u2022 Cadence de tir rapide\n\u2022 D\xe9g\xe2ts constants\n\u2022 Port\xe9e correcte\n\n\u274C Inconv\xe9nients:\n\u2022 D\xe9g\xe2ts par tir faibles\n\u2022 Moins efficace contre les ennemis blind\xe9s",
    // --- DESSIN ÉVOLUTIF (Base + 2 Améliorations) ---
    // Note: On assume que Turret.js passe (scene, container, color, turretInstance)
    onDrawBarrel: (scene, container, color, turret)=>{
        const g = scene.add.graphics();
        const level = turret.level || 1; // Niveau actuel (1, 2 ou 3)
        // Palette de couleurs
        const darkMetal = 0x222222;
        const lightMetal = 0x8899aa;
        const gold = 0xffd700;
        const ammoColor = 0xccaa00;
        // --- DESIGN SELON LE NIVEAU ---
        if (level === 1) {
            // === NIVEAU 1 : Standard ===
            g.fillStyle(color);
            g.fillRoundedRect(-10, -10, 20, 20, 3); // Culasse
            g.fillStyle(lightMetal);
            g.fillRect(10, -6, 20, 4); // Canon gauche
            g.fillRect(10, 2, 20, 4); // Canon droit
            g.fillStyle(darkMetal);
            g.fillRect(30, -6, 3, 4); // Embout gauche
            g.fillRect(30, 2, 3, 4); // Embout droit
        } else if (level === 2) {
            // === NIVEAU 2 : Renforcé ===
            g.fillStyle(0x113355); // Bleu nuit
            g.fillRoundedRect(-14, -14, 28, 28, 4); // Culasse large
            g.lineStyle(2, 0x557799);
            g.strokeRoundedRect(-14, -14, 28, 28, 4);
            g.fillStyle(lightMetal);
            g.fillRect(14, -8, 28, 6); // Canons longs
            g.fillRect(14, 2, 28, 6);
            g.fillStyle(darkMetal);
            g.fillRect(20, -8, 10, 2); // Events
            g.fillRect(20, 6, 10, 2);
            g.fillStyle(ammoColor);
            g.fillRect(-12, -8, 6, 16); // Chargeur
        } else {
            // === NIVEAU 3 : Élite (Gatling) ===
            g.fillStyle(0x001133); // Presque noir
            g.fillRoundedRect(-16, -18, 32, 36, 5); // Corps massif
            g.lineStyle(2, gold);
            g.strokeRoundedRect(-16, -18, 32, 36, 5); // Bordure dorée
            // Bloc Gatling
            g.fillStyle(darkMetal);
            g.fillCircle(25, 0, 12);
            g.fillStyle(lightMetal);
            g.fillCircle(25, -5, 3);
            g.fillCircle(25, 5, 3);
            g.fillCircle(20, 0, 3);
            g.fillCircle(30, 0, 3);
            g.fillStyle(color);
            g.fillRect(10, -12, 15, 24); // Support
            g.fillStyle(0xff0000);
            g.fillRect(0, -20, 10, 2); // Laser
        }
        // Pivot central
        g.fillStyle(0x111111);
        g.fillCircle(0, 0, 6);
        container.add(g);
        // --- INDICATEUR DE NIVEAU ---
        const badge = scene.add.container(-20, 20);
        const badgeBg = scene.add.rectangle(0, 0, 24, 14, 0x000000, 0.7);
        badgeBg.setStrokeStyle(1, level === 3 ? gold : 0xffffff);
        const lvlText = scene.add.text(0, 0, `Lv.${level}`, {
            fontSize: "10px",
            fontFamily: "Arial",
            color: level === 3 ? "#ffd700" : "#ffffff",
            fontStyle: "bold"
        }).setOrigin(0.5);
        badge.add([
            badgeBg,
            lvlText
        ]);
        container.add(badge);
    },
    // --- LOGIQUE DE TIR ---
    onFire: (scene, turret, target)=>{
        const level = turret.level || 1;
        const angle = turret.barrelGroup.rotation;
        const barrelLen = level === 1 ? 30 : level === 2 ? 42 : 38;
        // Alternance des canons
        turret.fireAlt = !turret.fireAlt;
        const offsetSide = turret.fireAlt ? 4 : -4;
        const tipX = turret.x + Math.cos(angle) * barrelLen - Math.sin(angle) * offsetSide;
        const tipY = turret.y + Math.sin(angle) * barrelLen + Math.cos(angle) * offsetSide;
        // Flash
        const flashColor = level === 3 ? 0xffaa00 : 0xffffaa;
        const flashSize = level === 3 ? 12 : 8;
        const flash = scene.add.circle(tipX, tipY, flashSize, flashColor, 0.9);
        scene.tweens.add({
            targets: flash,
            scale: 0,
            duration: 50,
            onComplete: ()=>flash.destroy()
        });
        // Traceur
        const tracer = scene.add.graphics();
        const tracerColor = level === 3 ? 0xff4400 : 0xffdd44;
        const tracerWidth = level === 3 ? 3 : 2;
        tracer.lineStyle(tracerWidth, tracerColor, 0.8);
        tracer.lineBetween(tipX, tipY, target.x, target.y);
        scene.time.delayedCall(60, ()=>tracer.destroy());
        // Dégâts
        if (target.active) {
            target.damage(turret.config.damage);
            if (level >= 2) {
                // Impact visuel à partir du niveau 2
                const impact = scene.add.circle(target.x, target.y, 5, 0xffffff, 0.7);
                scene.tweens.add({
                    targets: impact,
                    scale: 0,
                    duration: 100,
                    onComplete: ()=>impact.destroy()
                });
            }
        }
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"fm2OQ":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "sniper", ()=>sniper);
const sniper = {
    key: "sniper",
    name: "Sniper",
    cost: 270,
    range: 160,
    damage: 150,
    rate: 2500,
    color: 0x44ff44,
    maxLevel: 3,
    description: "Tourelle de pr\xe9cision avec d\xe9g\xe2ts massifs et tr\xe8s longue port\xe9e.\n\n\u2705 Avantages:\n\u2022 D\xe9g\xe2ts \xe9normes par tir\n\u2022 Port\xe9e exceptionnelle\n\u2022 Id\xe9al contre les ennemis r\xe9sistants\n\n\u274C Inconv\xe9nients:\n\u2022 Cadence de tir tr\xe8s lente\n\u2022 Co\xfbt \xe9lev\xe9\n\u2022 Moins efficace contre les groupes",
    // --- DESSIN ÉVOLUTIF ---
    onDrawBarrel: (scene, container, color, turret)=>{
        const g = scene.add.graphics();
        const level = turret.level || 1;
        // Palette
        const black = 0x111111;
        const darkGrey = 0x333333;
        const camoGreen = 0x336633;
        const techWhite = 0xeeeeee;
        const energyBlue = 0x00ffff;
        const lensColor = 0x000000;
        if (level === 1) {
            // === NIVEAU 1 : Fusil de précision standard ===
            // Canon fin
            g.fillStyle(black);
            g.fillRect(0, -3, 45, 6);
            // Corps
            g.fillStyle(camoGreen);
            g.fillRect(-10, -6, 25, 12);
            // Lunette simple (Ronde)
            g.fillStyle(darkGrey);
            g.fillRect(-5, -10, 15, 4); // Support
            g.fillCircle(0, -10, 4); // Oculaire
            g.fillCircle(10, -10, 4); // Objectif
        } else if (level === 2) {
            // === NIVEAU 2 : Heavy Sniper (Calibre .50) ===
            // Canon lourd
            g.fillStyle(darkGrey);
            g.fillRect(0, -4, 50, 8);
            // Frein de bouche (le bout carré pour le recul)
            g.fillStyle(black);
            g.fillRect(50, -6, 8, 12);
            // Corps renforcé
            g.fillStyle(0x224422); // Vert foncé
            g.fillRoundedRect(-15, -8, 35, 16, 2);
            // Lunette Tactique (Carrée/Digitale)
            g.fillStyle(black);
            g.fillRect(-5, -14, 20, 6);
            g.fillStyle(0x00ff00); // Lentille verte
            g.fillRect(15, -14, 2, 6);
            // Bipied replié en dessous
            g.fillStyle(darkGrey);
            g.fillRect(10, 5, 20, 3);
        } else {
            // === NIVEAU 3 : RAILGUN (Futuriste) ===
            // Rails magnétiques (Haut et Bas)
            g.fillStyle(techWhite);
            g.fillRect(0, -10, 55, 4); // Rail haut
            g.fillRect(0, 6, 55, 4); // Rail bas
            // Noyau d'énergie (au milieu)
            g.fillStyle(energyBlue, 0.8);
            g.fillRect(5, -2, 45, 4); // Lueur interne
            // Corps High-Tech
            g.fillStyle(darkGrey);
            g.fillRoundedRect(-15, -12, 30, 24, 4);
            g.lineStyle(2, energyBlue);
            g.strokeRoundedRect(-15, -12, 30, 24, 4); // Bordure néon
            // Lunette Holographique
            g.lineStyle(1, energyBlue, 0.5);
            g.strokeRect(-5, -18, 15, 6);
            g.fillStyle(energyBlue, 0.3);
            g.fillRect(-5, -18, 15, 6);
        }
        // Pivot central
        g.fillStyle(black);
        g.fillCircle(0, 0, 5);
        container.add(g);
        // --- INDICATEUR DE NIVEAU ---
        // Un petit badge sur le côté
        const badge = scene.add.container(-20, 20);
        const badgeBg = scene.add.rectangle(0, 0, 24, 14, 0x000000, 0.7);
        badgeBg.setStrokeStyle(1, level === 3 ? energyBlue : 0xffffff);
        const lvlText = scene.add.text(0, 0, `Lv.${level}`, {
            fontSize: "10px",
            fontFamily: "Arial",
            color: level === 3 ? energyBlue : "#ffffff",
            fontStyle: "bold"
        }).setOrigin(0.5);
        badge.add([
            badgeBg,
            lvlText
        ]);
        container.add(badge);
    },
    // --- LOGIQUE DE TIR (Railgun au niveau 3) ---
    onFire: (scene, turret, target)=>{
        const level = turret.level || 1;
        const angle = turret.barrelGroup.rotation;
        // Longueur du canon pour savoir d'où part le tir
        const barrelLen = level === 1 ? 45 : level === 2 ? 58 : 55;
        const tipX = turret.x + Math.cos(angle) * barrelLen;
        const tipY = turret.y + Math.sin(angle) * barrelLen;
        // --- EFFETS VISUELS ---
        if (level < 3) {
            // NIVEAU 1 & 2 : Tir de balle classique mais puissant
            // 1. Flash de bouche
            const flashColor = level === 2 ? 0xffaa00 : 0xffffaa;
            const flashSize = level === 2 ? 20 : 15;
            const flash = scene.add.circle(tipX, tipY, flashSize, flashColor, 1);
            scene.tweens.add({
                targets: flash,
                scale: 0,
                alpha: 0,
                duration: 150,
                onComplete: ()=>flash.destroy()
            });
            // 2. Traînée blanche (Vapeur)
            const beam = scene.add.graphics();
            const thickness = level === 2 ? 4 : 2;
            beam.lineStyle(thickness, 0xffffff, 0.8);
            beam.lineBetween(tipX, tipY, target.x, target.y);
            // Disparition rapide
            scene.tweens.add({
                targets: beam,
                alpha: 0,
                duration: 200,
                onComplete: ()=>beam.destroy()
            });
        } else {
            // NIVEAU 3 : RAILGUN (Rayon d'énergie)
            // 1. Accumulation d'énergie (Flash bleu cyan)
            const flash = scene.add.circle(tipX, tipY, 25, 0x00ffff, 1);
            scene.tweens.add({
                targets: flash,
                scale: 0,
                alpha: 0,
                duration: 300,
                onComplete: ()=>flash.destroy()
            });
            // 2. Le Rayon principal (Cœur blanc, bord bleu)
            const beam = scene.add.graphics();
            // Aura bleue
            beam.lineStyle(10, 0x00ffff, 0.4);
            beam.lineBetween(tipX, tipY, target.x, target.y);
            // Cœur blanc pur
            beam.lineStyle(4, 0xffffff, 1);
            beam.lineBetween(tipX, tipY, target.x, target.y);
            // Disparition lente et stylée
            scene.tweens.add({
                targets: beam,
                alpha: 0,
                duration: 400,
                onComplete: ()=>beam.destroy()
            });
        // 3. Particules sur le trajet (optionnel, pour le style)
        // On pourrait ajouter des petites étincelles ici
        }
        // --- DÉGÂTS ET IMPACT ---
        if (target.active) {
            target.damage(turret.config.damage);
            // Impact sur la cible
            const impactColor = level === 3 ? 0x00ffff : 0xffffff;
            const impactSize = level === 3 ? 30 : 20;
            const impact = scene.add.circle(target.x, target.y, impactSize, impactColor, 0.8);
            scene.tweens.add({
                targets: impact,
                scale: 0,
                duration: 150,
                onComplete: ()=>impact.destroy()
            });
        }
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"3RJPP":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "cannon", ()=>cannon);
const cannon = {
    key: "cannon",
    name: "Mortier",
    cost: 180,
    range: 135,
    damage: 90,
    rate: 2300,
    color: 0xff8844,
    aoe: 50,
    maxLevel: 3,
    description: "Artillerie lourde avec d\xe9g\xe2ts de zone (AOE).\n\n\u2705 Avantages:\n\u2022 D\xe9g\xe2ts de zone (touche plusieurs ennemis)\n\u2022 Port\xe9e longue\n\u2022 Efficace contre les groupes\n\n\u274C Inconv\xe9nients:\n\u2022 Cadence de tir lente\n\u2022 Projectile en arc (d\xe9lai d'impact)\n\u2022 Moins pr\xe9cis que les autres tourelles",
    // ============================================================
    // DESSIN DU CANON
    // ============================================================
    onDrawBarrel: (scene, container, color, turret)=>{
        const g = scene.add.graphics();
        const level = turret.level || 1;
        const black = 0x111111;
        g.clear();
        if (level === 1) {
            // --- Niv 1 : Mortier Bronze (Classique) ---
            const bronze = 0xcd7f32;
            const darkBronze = 0xa05a2c;
            g.fillStyle(darkBronze);
            g.fillRoundedRect(-20, -18, 30, 36, 6);
            g.lineStyle(3, 0x663311);
            g.strokeRoundedRect(-20, -18, 30, 36, 6);
            g.fillStyle(0x663311);
            g.fillCircle(-15, -12, 2);
            g.fillCircle(-15, 12, 2);
            g.fillCircle(5, -12, 2);
            g.fillCircle(5, 12, 2);
            g.fillStyle(bronze);
            g.fillRect(10, -12, 20, 24);
            g.fillStyle(darkBronze);
            g.fillRect(12, -14, 4, 28);
            g.fillRect(22, -14, 4, 28);
            g.fillStyle(black);
            g.fillCircle(30, 0, 10);
            g.lineStyle(4, darkBronze);
            g.strokeCircle(30, 0, 10);
            // Recul
            g.fillStyle(0x555555);
            g.fillRect(-5, 18, 20, 6);
        } else if (level === 2) {
            // --- Niv 2 : Artillerie Lourde (Classique) ---
            const steel = 0x8899aa;
            const darkSteel = 0x445566;
            g.fillStyle(darkSteel);
            g.fillRoundedRect(-22, -20, 34, 40, 4);
            g.lineStyle(2, 0xaabbcc);
            g.strokeRoundedRect(-22, -20, 34, 40, 4);
            g.fillStyle(steel);
            g.fillRect(12, -14, 30, 28);
            g.fillStyle(darkSteel);
            g.fillRect(15, -14, 2, 28);
            g.fillRect(20, -14, 2, 28);
            g.fillRect(25, -14, 2, 28);
            g.fillRect(30, -14, 2, 28);
            g.fillStyle(black);
            g.fillCircle(42, 0, 12);
            g.lineStyle(4, darkSteel);
            g.strokeCircle(42, 0, 12);
            g.fillStyle(0x333333);
            g.fillRect(-10, -22, 10, 8);
            g.fillStyle(0x555555);
            g.fillRect(-5, 18, 20, 6);
        } else {
            // --- Niv 3 : Système de Missiles "Titan" (RE-DESIGN COMPLET) ---
            const hullColor = 0xe0e0e0; // Blanc cassé blindage
            const darkHull = 0x546e7a; // Bleu gris sombre
            const accent = 0xff3d00; // Orange sécurité
            const glow = 0x00eaff; // Cyan futuriste
            // 1. Base pivotante lourde
            g.fillStyle(0x263238);
            g.fillCircle(0, 0, 22);
            g.lineStyle(2, 0x37474f);
            g.strokeCircle(0, 0, 22);
            // 2. Corps central blindé (Anguleux)
            g.fillStyle(hullColor);
            g.beginPath();
            g.moveTo(-15, -15);
            g.lineTo(25, -15);
            g.lineTo(35, 0);
            g.lineTo(25, 15);
            g.lineTo(-15, 15);
            g.closePath();
            g.fill();
            g.lineStyle(2, 0x90a4ae);
            g.strokePath();
            // Détails techniques sur le dessus
            g.fillStyle(0x263238);
            g.fillRect(-5, -8, 15, 16); // Trappe maintenance
            g.fillStyle(accent);
            g.fillRect(20, -5, 4, 10); // Indicateur de tir
            // 3. Pods de missiles latéraux (Gauche et Droite)
            const drawPod = (offsetY)=>{
                // Structure du pod
                g.fillStyle(darkHull);
                g.fillRoundedRect(-10, offsetY - 10, 35, 20, 4);
                g.lineStyle(1, 0x000000);
                g.strokeRoundedRect(-10, offsetY - 10, 35, 20, 4);
                // Têtes de missiles visibles
                g.fillStyle(0x000000);
                g.fillCircle(25, offsetY, 6); // Le trou
                g.fillStyle(0xff0000);
                g.fillCircle(25, offsetY, 3); // La tête du missile
                // Lumière d'état sur le pod
                g.fillStyle(glow);
                g.fillRect(0, offsetY - 2, 8, 4);
            };
            drawPod(-20); // Pod Gauche
            drawPod(20); // Pod Droit
            // 4. Radar/Optique sur le côté
            g.lineStyle(2, glow, 0.6);
            g.strokeCircle(10, 0, 8);
            g.fillStyle(glow, 0.3);
            g.fillCircle(10, 0, 3);
        }
        container.add(g);
        // Badge niveau
        const badge = scene.add.container(-20, 20);
        let badgeColorStr = "#ffffff";
        let badgeColorHex = 0xffffff;
        if (level === 2) {
            badgeColorStr = "#00ffff";
            badgeColorHex = 0x00ffff;
        } else if (level === 3) {
            badgeColorStr = "#ff00aa";
            badgeColorHex = 0xff00aa;
        }
        const badgeBg = scene.add.rectangle(0, 0, 24, 14, 0x000000, 0.55);
        badgeBg.setStrokeStyle(1, badgeColorHex, 0.9);
        const lvlText = scene.add.text(0, 0, `Lv.${level}`, {
            fontSize: "10px",
            fontFamily: "Arial",
            color: badgeColorStr,
            fontStyle: "bold"
        }).setOrigin(0.5);
        badge.add([
            badgeBg,
            lvlText
        ]);
        container.add(badge);
    },
    // ============================================================
    // LOGIQUE DE TIR
    // ============================================================
    onFire: (scene, turret, target)=>{
        if (!scene || !turret || !target || !target.active) return;
        const level = turret.level || 1;
        if (level < 3) {
            // --- LOGIQUE NIV 1 & 2 : OBUS EN CLOCHE (INCHANGÉ) ---
            const spread = 5;
            const impactX = target.x + (Math.random() - 0.5) * spread;
            const impactY = target.y + (Math.random() - 0.5) * spread;
            const blastRadius = turret.config.aoe;
            const damageAmount = turret.config.damage;
            const muzzle = scene.add.circle(turret.x, turret.y, 10, 0xffaa00, 0.8);
            scene.tweens.add({
                targets: muzzle,
                scale: 2,
                alpha: 0,
                duration: 100,
                onComplete: ()=>muzzle.destroy()
            });
            const shell = scene.add.circle(turret.x, turret.y, 4, 0x000000, 1);
            shell.setStrokeStyle(2, 0x555555);
            shell.setDepth(200);
            const shadow = scene.add.ellipse(turret.x, turret.y, 8, 4, 0x000000, 0.3);
            shadow.setDepth(5);
            const dist = Phaser.Math.Distance.Between(turret.x, turret.y, impactX, impactY);
            const flightTime = Phaser.Math.Clamp(dist * 2.5, 400, 800);
            const peakHeight = 150;
            scene.tweens.add({
                targets: [
                    shell,
                    shadow
                ],
                x: impactX,
                y: impactY,
                duration: flightTime,
                ease: "Linear"
            });
            scene.tweens.add({
                targets: shell,
                z: 1,
                duration: flightTime,
                ease: "Linear",
                onUpdate: (tween)=>{
                    const progress = tween.progress;
                    const heightOffset = Math.sin(progress * Math.PI) * peakHeight;
                    shell.y = turret.y + (impactY - turret.y) * progress - heightOffset;
                },
                onComplete: ()=>{
                    shell.destroy();
                    shadow.destroy();
                    triggerExplosion(scene, impactX, impactY, blastRadius, damageAmount, level);
                }
            });
        } else // --- LOGIQUE NIV 3 : MISSILE CINÉMATIQUE ---
        launchRealisticMissile(scene, turret, target);
    }
};
// ============================================================
// NOUVEAU SYSTÈME DE MISSILE (PLUS FLUIDE ET RÉALISTE)
// ============================================================
function launchRealisticMissile(scene, turret, target) {
    const damageAmount = turret.config.damage * 2.5;
    const blastRadius = turret.config.aoe * 1.8;
    const flightDuration = 2500; // 3 secondes
    // 1. Design du Missile (Plus détaillé)
    const missile = scene.add.container(turret.x, turret.y);
    missile.setDepth(300);
    const mg = scene.add.graphics();
    // Flamme du réacteur (animée plus tard)
    mg.fillStyle(0x00ffff);
    mg.fillTriangle(0, 15, -4, 25, 4, 25);
    // Corps
    mg.fillStyle(0xffffff);
    mg.fillRoundedRect(-5, -20, 10, 35, 2);
    // Tête nucléaire
    mg.fillStyle(0xff0000);
    mg.fillTriangle(0, -30, -5, -20, 5, -20);
    // Ailerons arrière
    mg.fillStyle(0x445566);
    mg.beginPath();
    mg.moveTo(-5, 0);
    mg.lineTo(-14, 15);
    mg.lineTo(-5, 15);
    mg.fill(); // Gauche
    mg.beginPath();
    mg.moveTo(5, 0);
    mg.lineTo(14, 15);
    mg.lineTo(5, 15);
    mg.fill(); // Droite
    missile.add(mg);
    missile.setScale(0.6);
    // 2. Définition de la trajectoire COURBE (Pas de zigzag sec)
    // On crée un point de contrôle pour faire un bel arc de cercle
    // Le point de contrôle est décalé perpendiculairement à la cible
    const startX = turret.x;
    const startY = turret.y;
    // Angle initial vers la cible
    const angleToTarget = Phaser.Math.Angle.Between(startX, startY, target.x, target.y);
    // On détermine aléatoirement si l'arc part à gauche ou à droite (-1 ou 1)
    const arcSide = Math.random() > 0.5 ? 1 : -1;
    const arcIntensity = 200; // Amplitude de la courbe
    // Variables de suivi
    let prevX = startX;
    let prevY = startY;
    let smokeTimer = 0;
    // Flash de départ
    const flash = scene.add.circle(startX, startY, 25, 0xffaa00, 1);
    scene.tweens.add({
        targets: flash,
        scale: 2,
        alpha: 0,
        duration: 200,
        onComplete: ()=>flash.destroy()
    });
    // 3. TWEEN AVEC COURBE DE BÉZIER DYNAMIQUE
    scene.tweens.add({
        targets: missile,
        z: 1,
        duration: flightDuration,
        ease: "Quad.easeIn",
        onUpdate: (tween, targetParam, param2, progress)=>{
            if (!missile.active) return;
            // Position actuelle de la cible (ou dernière connue)
            const tx = target.active ? target.x : target.lastX || target.x;
            const ty = target.active ? target.y : target.lastY || target.y;
            // --- CALCUL DE LA POSITION ---
            // On calcule une courbe de Bézier quadratique à la volée.
            // P0 = Départ
            // P1 = Point de contrôle (qui bouge un peu pour faire "vivant")
            // P2 = Cible
            // Calcul du point de contrôle P1 :
            // Il est au milieu du trajet, mais décalé sur le côté pour créer l'arc
            const midX = (startX + tx) / 2;
            const midY = (startY + ty) / 2;
            // Vecteur perpendiculaire pour le décalage
            const dx = tx - startX;
            const dy = ty - startY;
            // Normalisation approximative pour le décalage
            const perpX = -dy * 0.5;
            const perpY = dx * 0.5;
            // Le point de contrôle se rapproche de la ligne directe à la fin (progress)
            // pour que le missile "rentre" dans la cible
            const currentArc = arcIntensity * (1 - progress);
            // Ajout d'une petite turbulence (Noise) pour le réalisme, pas un zigzag mathématique
            const turbulence = Math.sin(progress * 20) * 10 * (1 - progress); // Vibre moins à la fin
            const controlX = midX + perpX * arcSide / (Math.abs(dx) + Math.abs(dy)) * currentArc + turbulence;
            const controlY = midY + perpY * arcSide / (Math.abs(dx) + Math.abs(dy)) * currentArc + turbulence;
            // Formule de Bézier Quadratique : (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
            const t = progress;
            const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * tx;
            const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * ty;
            missile.x = x;
            missile.y = y;
            // --- CALCUL DE LA ROTATION (LISSÉE) ---
            // On regarde la différence avec la frame d'avant
            const angle = Math.atan2(y - prevY, x - prevX);
            // + PI/2 car le dessin pointe vers le haut (-Y)
            missile.setRotation(angle + Math.PI / 2);
            prevX = x;
            prevY = y;
            // --- FX DE TRAINÉE (SMOKE) ---
            smokeTimer += scene.game.loop.delta;
            if (smokeTimer > 20) {
                // Très dense
                smokeTimer = 0;
                const p = scene.add.circle(missile.x, missile.y, 4, 0x999999, 0.6);
                p.setDepth(290);
                scene.tweens.add({
                    targets: p,
                    scale: {
                        from: 1,
                        to: 3
                    },
                    alpha: {
                        from: 0.6,
                        to: 0
                    },
                    duration: 600,
                    onComplete: ()=>p.destroy()
                });
                // Petit cœur de flamme
                const f = scene.add.circle(missile.x, missile.y, 2, 0x00ffff, 1);
                f.setDepth(291);
                scene.tweens.add({
                    targets: f,
                    scale: 0,
                    duration: 200,
                    onComplete: ()=>f.destroy()
                });
            }
        },
        onComplete: ()=>{
            const finalX = target.active ? target.x : missile.x;
            const finalY = target.active ? target.y : missile.y;
            missile.destroy();
            triggerExplosion(scene, finalX, finalY, blastRadius, damageAmount, 3);
        }
    });
}
// ============================================================
// EXPLOSION (INCHANGÉE MAIS OPTIMISÉE)
// ============================================================
function triggerExplosion(scene, x, y, radius, damage, level) {
    const hitboxBuffer = 8;
    const effectiveRadius = radius + hitboxBuffer;
    const isLvl3 = level === 3;
    // Secousse
    scene.cameras.main.shake(isLvl3 ? 300 : 150, isLvl3 ? 0.01 : 0.005);
    // Trace au sol
    const scorch = scene.add.circle(x, y, effectiveRadius, isLvl3 ? 0x001122 : 0x000000, 0.6);
    scorch.setDepth(4);
    scorch.scaleY = 0.6;
    scene.tweens.add({
        targets: scorch,
        alpha: 0,
        duration: 2000,
        delay: 500,
        onComplete: ()=>scorch.destroy()
    });
    // Flash
    const flash = scene.add.circle(x, y, radius, isLvl3 ? 0xccffff : 0xffaa00, 1);
    flash.setDepth(350);
    scene.tweens.add({
        targets: flash,
        scale: 1.5,
        alpha: 0,
        duration: 200,
        onComplete: ()=>flash.destroy()
    });
    // Onde de choc
    const shock = scene.add.graphics();
    shock.setDepth(340);
    shock.lineStyle(isLvl3 ? 8 : 4, isLvl3 ? 0x00ffff : 0xffaa00);
    shock.strokeCircle(0, 0, radius);
    shock.setPosition(x, y);
    shock.setScale(0.1);
    scene.tweens.add({
        targets: shock,
        scale: 1.2,
        alpha: 0,
        duration: 400,
        onComplete: ()=>shock.destroy()
    });
    // Particules
    const pCount = isLvl3 ? 20 : 8;
    for(let i = 0; i < pCount; i++){
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * radius * 0.5;
        const px = x + Math.cos(angle) * dist;
        const py = y + Math.sin(angle) * dist;
        // Mixte feu/fumée ou plasma/fumée
        const color = isLvl3 ? Math.random() > 0.5 ? 0x00ffff : 0x555555 : 0x666666;
        const p = scene.add.circle(px, py, Math.random() * 4 + 2, color, 1);
        p.setDepth(345);
        scene.tweens.add({
            targets: p,
            x: px + Math.cos(angle) * radius,
            y: py + Math.sin(angle) * radius - 50,
            alpha: 0,
            scale: 0.5,
            duration: Math.random() * 500 + 500,
            onComplete: ()=>p.destroy()
        });
    }
    // Dégâts
    if (scene.enemies) scene.enemies.children.each((e)=>{
        if (e.active && Phaser.Math.Distance.Between(x, y, e.x, e.y) <= effectiveRadius) {
            e.damage(damage);
            if (e.bodyGroup) scene.tweens.add({
                targets: e.bodyGroup,
                tint: isLvl3 ? 0x00ffff : 0xff0000,
                duration: 100,
                yoyo: true
            });
        }
    });
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"bgZGw":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "zap", ()=>zap);
const zap = {
    key: "zap",
    name: "\xc9clair",
    cost: 350,
    range: 120,
    damage: 50,
    rate: 1800,
    color: 0x00ffff,
    maxLevel: 3,
    maxChainTargets: 3,
    description: "G\xe9n\xe9rateur \xe9lectrique avec propagation en cha\xeene.\n\n\u2705 Avantages:\n\u2022 Propagation d'\xe9clair entre ennemis proches\n\u2022 D\xe9g\xe2ts instantan\xe9s\n\u2022 Efficace contre les groupes serr\xe9s\n\n\u274C Inconv\xe9nients:\n\u2022 Co\xfbt tr\xe8s \xe9lev\xe9\n\u2022 Port\xe9e moyenne\n\u2022 Moins efficace si ennemis espac\xe9s",
    // --- DESSIN ÉVOLUTIF (Design Électrique) ---
    onDrawBarrel: (scene, container, color, turret)=>{
        const g = scene.add.graphics();
        const level = turret.level || 1;
        // Palette de couleurs électriques
        const electricBlue = 0x00ffff;
        const electricYellow = 0xffff00;
        const electricPurple = 0xaa00ff;
        const darkMetal = 0x111111;
        const lightMetal = 0x444444;
        const energyCore = 0xffffff;
        if (level === 1) {
            // === NIVEAU 1 : Générateur d'Éclair Standard ===
            // Base circulaire avec bobines
            g.fillStyle(darkMetal);
            g.fillCircle(0, 0, 20);
            g.lineStyle(2, electricBlue, 0.8);
            g.strokeCircle(0, 0, 20);
            // Bobines électriques (cercles concentriques)
            g.lineStyle(1.5, electricBlue, 0.6);
            g.strokeCircle(0, 0, 12);
            g.strokeCircle(0, 0, 8);
            // Canon électrique (pointant vers l'avant)
            g.fillStyle(electricBlue, 0.7);
            g.fillRect(0, -4, 35, 8);
            g.lineStyle(2, electricYellow, 0.9);
            g.strokeRect(0, -4, 35, 8);
            // Noyau d'énergie
            g.fillStyle(energyCore, 0.9);
            g.fillCircle(35, 0, 5);
        } else if (level === 2) {
            // === NIVEAU 2 : Générateur Renforcé ===
            // Base plus grande avec plus de bobines
            g.fillStyle(darkMetal);
            g.fillCircle(0, 0, 24);
            g.lineStyle(2, electricBlue, 0.9);
            g.strokeCircle(0, 0, 24);
            // Bobines multiples
            g.lineStyle(1.5, electricBlue, 0.7);
            g.strokeCircle(0, 0, 16);
            g.strokeCircle(0, 0, 12);
            g.strokeCircle(0, 0, 8);
            // Canon électrique plus long
            g.fillStyle(electricBlue, 0.8);
            g.fillRect(0, -5, 45, 10);
            g.lineStyle(2, electricYellow, 1);
            g.strokeRect(0, -5, 45, 10);
            // Énergie pulsante (cercles concentriques)
            g.lineStyle(1, electricYellow, 0.5);
            g.strokeCircle(45, 0, 8);
            g.strokeCircle(45, 0, 6);
            // Noyau d'énergie plus gros
            g.fillStyle(energyCore, 1);
            g.fillCircle(45, 0, 6);
        } else {
            // === NIVEAU 3 : Générateur Élite (Tesla) ===
            // Base massive avec bobines complexes
            g.fillStyle(darkMetal);
            g.fillCircle(0, 0, 28);
            g.lineStyle(3, electricPurple, 1);
            g.strokeCircle(0, 0, 28);
            // Bobines en spirale
            g.lineStyle(2, electricPurple, 0.8);
            g.strokeCircle(0, 0, 20);
            g.strokeCircle(0, 0, 16);
            g.strokeCircle(0, 0, 12);
            g.strokeCircle(0, 0, 8);
            // Canon Tesla (très long)
            g.fillStyle(electricPurple, 0.9);
            g.fillRect(0, -6, 55, 12);
            g.lineStyle(3, electricYellow, 1);
            g.strokeRect(0, -6, 55, 12);
            // Énergie Tesla (aura multiple)
            g.lineStyle(2, electricYellow, 0.6);
            g.strokeCircle(55, 0, 10);
            g.strokeCircle(55, 0, 7);
            g.strokeCircle(55, 0, 4);
            // Noyau d'énergie Tesla (brillant)
            g.fillStyle(energyCore, 1);
            g.fillCircle(55, 0, 7);
            g.fillStyle(electricYellow, 0.8);
            g.fillCircle(55, 0, 4);
            // Particules d'énergie (petits points)
            g.fillStyle(electricYellow, 1);
            g.fillCircle(-8, -8, 2);
            g.fillCircle(8, -8, 2);
            g.fillCircle(-8, 8, 2);
            g.fillCircle(8, 8, 2);
        }
        // Pivot central
        g.fillStyle(0x000000);
        g.fillCircle(0, 0, 4);
        container.add(g);
        // --- INDICATEUR DE NIVEAU ---
        const badge = scene.add.container(-20, 20);
        const badgeBg = scene.add.rectangle(0, 0, 24, 14, 0x000000, 0.7);
        const badgeColor = level === 3 ? electricPurple : electricBlue;
        badgeBg.setStrokeStyle(1, badgeColor);
        const lvlText = scene.add.text(0, 0, `Lv.${level}`, {
            fontSize: "10px",
            fontFamily: "Arial",
            color: level === 3 ? "#aa00ff" : "#00ffff",
            fontStyle: "bold"
        }).setOrigin(0.5);
        badge.add([
            badgeBg,
            lvlText
        ]);
        container.add(badge);
    },
    // --- LOGIQUE DE TIR AVEC PROPAGATION D'ÉCLAIR ---
    onFire: (scene, turret, target)=>{
        const level = turret.level || 1;
        const angle = turret.barrelGroup.rotation;
        // Nombre max de cibles selon le niveau
        const maxChainTargets = level === 1 ? 3 : level === 2 ? 5 : 7;
        const chainDistance = 80; // 1/2 case = 32 pixels donc environ 1.2 cases
        // Longueur du canon
        const barrelLen = level === 1 ? 32 : level === 2 ? 40 : 48;
        const tipX = turret.x + Math.cos(angle) * barrelLen;
        const tipY = turret.y + Math.sin(angle) * barrelLen;
        // --- EFFET VISUEL INITIAL ---
        const flashColor = level === 3 ? 0xaa00ff : level === 2 ? 0x00ffff : 0x00aaff;
        const flashSize = level === 3 ? 25 : level === 2 ? 20 : 15;
        const flash = scene.add.circle(tipX, tipY, flashSize, flashColor, 0.9);
        scene.tweens.add({
            targets: flash,
            scale: 2,
            alpha: 0,
            duration: 200,
            onComplete: ()=>flash.destroy()
        });
        // --- PROPAGATION D'ÉCLAIR ---
        const allEnemies = scene.enemies.getChildren();
        const hitEnemies = new Set(); // Pour éviter de toucher deux fois le même ennemi
        const chainSequence = []; // Pour l'animation de la chaîne
        // Fonction récursive pour la propagation
        const chainLightning = (currentTarget, depth, fromX, fromY)=>{
            if (depth >= maxChainTargets || !currentTarget || !currentTarget.active) return;
            // Marquer comme touché
            hitEnemies.add(currentTarget);
            chainSequence.push({
                target: currentTarget,
                fromX: fromX,
                fromY: fromY,
                depth: depth
            });
            // Infliger des dégâts
            currentTarget.damage(turret.config.damage);
            // Trouver le prochain ennemi à proximité
            let nearestEnemy = null;
            let minDist = chainDistance;
            allEnemies.forEach((enemy)=>{
                if (enemy.active && !hitEnemies.has(enemy) && enemy !== currentTarget) {
                    const dist = Phaser.Math.Distance.Between(currentTarget.x, currentTarget.y, enemy.x, enemy.y);
                    if (dist <= chainDistance && dist < minDist) {
                        minDist = dist;
                        nearestEnemy = enemy;
                    }
                }
            });
            // Si on trouve un ennemi proche, continuer la chaîne
            if (nearestEnemy) chainLightning(nearestEnemy, depth + 1, currentTarget.x, currentTarget.y);
        };
        // Démarrer la chaîne depuis la cible initiale
        chainLightning(target, 0, tipX, tipY);
        // --- ANIMATION DE LA CHAÎNE D'ÉCLAIR ---
        chainSequence.forEach((link, index)=>{
            const delay = index * 50; // Délai progressif pour l'effet de chaîne
            scene.time.delayedCall(delay, ()=>{
                // Ligne d'éclair zigzagante
                const lightning = scene.add.graphics();
                const lightningColor = level === 3 ? 0xaa00ff : 0x00ffff;
                const lightningWidth = level === 3 ? 4 : 3;
                // Créer un zigzag pour l'effet éclair
                const steps = 8;
                const dx = link.target.x - link.fromX;
                const dy = link.target.y - link.fromY;
                lightning.lineStyle(lightningWidth, lightningColor, 1);
                lightning.beginPath();
                lightning.moveTo(link.fromX, link.fromY);
                for(let i = 1; i <= steps; i++){
                    const t = i / steps;
                    const x = link.fromX + dx * t;
                    const y = link.fromY + dy * t;
                    // Ajouter un décalage aléatoire pour l'effet zigzag
                    const offsetX = (Math.random() - 0.5) * 8;
                    const offsetY = (Math.random() - 0.5) * 8;
                    lightning.lineTo(x + offsetX, y + offsetY);
                }
                lightning.lineTo(link.target.x, link.target.y);
                lightning.strokePath();
                // Ligne principale (plus épaisse)
                lightning.lineStyle(lightningWidth + 2, 0xffffff, 0.8);
                lightning.beginPath();
                lightning.moveTo(link.fromX, link.fromY);
                lightning.lineTo(link.target.x, link.target.y);
                lightning.strokePath();
                lightning.setDepth(100);
                // Disparition rapide
                scene.tweens.add({
                    targets: lightning,
                    alpha: 0,
                    duration: 150,
                    onComplete: ()=>lightning.destroy()
                });
                // Impact sur la cible
                const impactColor = level === 3 ? 0xaa00ff : 0x00ffff;
                const impactSize = level === 3 ? 15 : 12;
                const impact = scene.add.circle(link.target.x, link.target.y, impactSize, impactColor, 0.9);
                impact.setDepth(99);
                scene.tweens.add({
                    targets: impact,
                    scale: 0,
                    alpha: 0,
                    duration: 200,
                    onComplete: ()=>impact.destroy()
                });
                // Particules d'électricité
                for(let i = 0; i < 5; i++){
                    const particle = scene.add.circle(link.target.x + (Math.random() - 0.5) * 20, link.target.y + (Math.random() - 0.5) * 20, 2, lightningColor, 1);
                    particle.setDepth(101);
                    scene.tweens.add({
                        targets: particle,
                        x: particle.x + (Math.random() - 0.5) * 30,
                        y: particle.y + (Math.random() - 0.5) * 30,
                        alpha: 0,
                        scale: 0,
                        duration: 300,
                        onComplete: ()=>particle.destroy()
                    });
                }
            });
        });
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"9rF1d":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "barracks", ()=>barracks);
const barracks = {
    key: "barracks",
    name: "Caserne",
    cost: 200,
    range: 0,
    damage: 0,
    rate: 0,
    color: 0x8b4513,
    maxLevel: 3,
    description: "B\xe2timent qui produit des soldats pour bloquer les ennemis.\n\n\u2705 Avantages:\n\u2022 Soldats bloquent temporairement les ennemis\n\u2022 Les soldats se r\xe9g\xe9n\xe8rent automatiquement\n\u2022 Compl\xe9mentaire aux tourelles\n\u2022 Peut \xeatre am\xe9lior\xe9 pour plus de soldats\n\n\u274C Inconv\xe9nients:\n\u2022 Pas de d\xe9g\xe2ts directs\n\u2022 Les soldats peuvent mourir\n\u2022 N\xe9cessite un placement strat\xe9gique",
    // Nombre de soldats par niveau
    soldiersCount: [
        2,
        3,
        4
    ],
    // Temps de respawn en millisecondes
    respawnTime: [
        12000,
        10000,
        8000
    ],
    // Vie des soldats par niveau
    soldierHp: [
        100,
        130,
        170
    ],
    // --- DESSIN ÉVOLUTIF (Bâtiment militaire) ---
    onDrawBarrel: (scene, container, color, turret)=>{
        const g = scene.add.graphics();
        const level = turret.level || 1;
        // Palette de couleurs
        const woodBrown = 0x8b4513;
        const darkWood = 0x654321;
        const stoneGray = 0x696969;
        const darkStone = 0x404040;
        const metalGray = 0x708090;
        const flagRed = 0xcc0000;
        const flagBlue = 0x0000cc;
        if (level === 1) {
            // === NIVEAU 1 : Baraque Simple ===
            // Base en bois
            g.fillStyle(woodBrown);
            g.fillRect(-20, -20, 40, 40);
            g.lineStyle(2, darkWood);
            g.strokeRect(-20, -20, 40, 40);
            // Toit
            g.fillStyle(darkWood);
            g.fillTriangle(-22, -20, 0, -30, 22, -20);
            g.lineStyle(2, 0x000000);
            g.strokeTriangle(-22, -20, 0, -30, 22, -20);
            // Porte
            g.fillStyle(0x000000);
            g.fillRect(-6, 0, 12, 20);
            g.lineStyle(1, darkWood);
            g.strokeRect(-6, 0, 12, 20);
            // Fenêtre
            g.fillStyle(0xffffaa, 0.8);
            g.fillRect(-12, -12, 8, 8);
            g.fillRect(4, -12, 8, 8);
        } else if (level === 2) {
            // === NIVEAU 2 : Caserne Renforcée ===
            // Base en pierre
            g.fillStyle(stoneGray);
            g.fillRect(-24, -24, 48, 48);
            g.lineStyle(2, darkStone);
            g.strokeRect(-24, -24, 48, 48);
            // Toit plus imposant
            g.fillStyle(darkStone);
            g.fillTriangle(-26, -24, 0, -36, 26, -24);
            g.lineStyle(3, 0x000000);
            g.strokeTriangle(-26, -24, 0, -36, 26, -24);
            // Porte renforcée
            g.fillStyle(0x000000);
            g.fillRect(-8, 2, 16, 24);
            g.lineStyle(2, metalGray);
            g.strokeRect(-8, 2, 16, 24);
            // Fenêtres avec barreaux
            g.fillStyle(0xffffaa, 0.8);
            g.fillRect(-14, -14, 10, 10);
            g.fillRect(4, -14, 10, 10);
            g.lineStyle(1, 0x000000);
            g.strokeRect(-14, -14, 10, 10);
            g.strokeRect(4, -14, 10, 10);
            // Barreaux
            g.lineStyle(1, 0x000000);
            g.lineBetween(-14, -9, -4, -9);
            g.lineBetween(-9, -14, -9, -4);
            g.lineBetween(4, -9, 14, -9);
            g.lineBetween(9, -14, 9, -4);
            // Drapeau simple
            g.fillStyle(flagRed);
            g.fillRect(20, -30, 4, 12);
        } else {
            // === NIVEAU 3 : Forteresse ===
            // Base massive en pierre
            g.fillStyle(stoneGray);
            g.fillRect(-28, -28, 56, 56);
            g.lineStyle(3, darkStone);
            g.strokeRect(-28, -28, 56, 56);
            // Détails de pierre
            g.lineStyle(1, darkStone);
            for(let i = -24; i < 24; i += 8)g.lineBetween(i, -28, i, 28);
            // Toit imposant avec créneaux
            g.fillStyle(darkStone);
            g.fillRect(-30, -40, 60, 12);
            g.fillStyle(0x000000);
            // Créneaux
            for(let i = -28; i < 28; i += 8)g.fillRect(i, -40, 4, 4);
            // Porte massive
            g.fillStyle(0x000000);
            g.fillRect(-10, 4, 20, 28);
            g.lineStyle(3, metalGray);
            g.strokeRect(-10, 4, 20, 28);
            // Clous
            g.fillStyle(metalGray);
            g.fillCircle(-5, 10, 2);
            g.fillCircle(5, 10, 2);
            g.fillCircle(-5, 20, 2);
            g.fillCircle(5, 20, 2);
            // Fenêtres avec barreaux
            g.fillStyle(0xffffaa, 0.8);
            g.fillRect(-16, -16, 12, 12);
            g.fillRect(4, -16, 12, 12);
            g.lineStyle(2, 0x000000);
            g.strokeRect(-16, -16, 12, 12);
            g.strokeRect(4, -16, 12, 12);
            // Barreaux épais
            g.lineStyle(2, 0x000000);
            g.lineBetween(-16, -11, -4, -11);
            g.lineBetween(-10, -16, -10, -4);
            g.lineBetween(4, -11, 16, -11);
            g.lineBetween(10, -16, 10, -4);
            // Drapeau avec mât
            g.fillStyle(0x654321);
            g.fillRect(24, -42, 3, 20);
            g.fillStyle(flagRed);
            g.fillRect(27, -40, 8, 6);
            g.fillStyle(flagBlue);
            g.fillRect(27, -34, 8, 6);
            // Tourelles latérales
            g.fillStyle(stoneGray);
            g.fillCircle(-26, -26, 6);
            g.fillCircle(26, -26, 6);
            g.lineStyle(2, darkStone);
            g.strokeCircle(-26, -26, 6);
            g.strokeCircle(26, -26, 6);
        }
        // Pivot central
        g.fillStyle(0x000000);
        g.fillCircle(0, 0, 3);
        container.add(g);
        // --- INDICATEUR DE NIVEAU ---
        const badge = scene.add.container(-20, 20);
        const badgeBg = scene.add.rectangle(0, 0, 24, 14, 0x000000, 0.7);
        const badgeColor = level === 3 ? 0xffd700 : level === 2 ? 0x00ffff : 0xffffff;
        badgeBg.setStrokeStyle(1, badgeColor);
        const lvlText = scene.add.text(0, 0, `Lv.${level}`, {
            fontSize: "10px",
            fontFamily: "Arial",
            color: level === 3 ? "#ffd700" : level === 2 ? "#00ffff" : "#ffffff",
            fontStyle: "bold"
        }).setOrigin(0.5);
        badge.add([
            badgeBg,
            lvlText
        ]);
        container.add(badge);
    },
    // --- LOGIQUE SPÉCIALE : Pas de tir, mais gestion des soldats ---
    onFire: null,
    // Fonction appelée lors de la création du bâtiment
    onBuild: (scene, barracks)=>{
    // Cette fonction sera appelée depuis GameScene après la création
    // Les soldats seront créés et déployés automatiquement
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"k759O":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "witch", ()=>witch);
const witch = {
    name: "Sorci\xe8re",
    speed: 28,
    hp: 800,
    reward: 150,
    color: 0x6a1b9a,
    damage: 15,
    attackSpeed: 1200,
    spawnInterval: 5000,
    spawnCount: 4,
    spawnType: "zombie_minion",
    scale: 1.2,
    onDraw: (scene, container, color, enemyInstance)=>{
        // Stocker les références pour l'animation
        enemyInstance.legs = {};
        enemyInstance.staff = null;
        enemyInstance.hat = null;
        // 1. Jambe Arrière
        enemyInstance.legs.back = scene.add.container(0, 8);
        const legB = scene.add.graphics();
        legB.fillStyle(0x4a148c); // Violet foncé
        legB.fillRoundedRect(-3, 0, 6, 20, 2);
        legB.fillRoundedRect(-4, 18, 8, 4, 2); // Botte pointue
        enemyInstance.legs.back.add(legB);
        container.add(enemyInstance.legs.back);
        // 2. Robe (longue et ample)
        const robe = scene.add.graphics();
        robe.fillStyle(color);
        // Robe en forme de trapèze
        robe.beginPath();
        robe.moveTo(-8, -5);
        robe.lineTo(8, -5);
        robe.lineTo(12, 20);
        robe.lineTo(-12, 20);
        robe.closePath();
        robe.fillPath();
        // Bordure dorée
        robe.lineStyle(2, 0xffd700);
        robe.strokePath();
        // Détails de la robe (étoiles, runes)
        robe.fillStyle(0xffd700, 0.6);
        robe.fillCircle(-5, 5, 2);
        robe.fillCircle(5, 5, 2);
        robe.fillCircle(0, 12, 1.5);
        container.add(robe);
        // 3. Tête et chapeau pointu
        const head = scene.add.graphics();
        head.fillStyle(0xffdbac); // Peau
        head.fillCircle(0, -12, 6);
        // Yeux brillants (magie)
        head.fillStyle(0x00ffff); // Cyan magique
        head.fillCircle(-2, -13, 1.5);
        head.fillCircle(2, -13, 1.5);
        // Chapeau pointu
        enemyInstance.hat = scene.add.graphics();
        enemyInstance.hat.fillStyle(0x4a148c);
        enemyInstance.hat.beginPath();
        enemyInstance.hat.moveTo(-6, -18);
        enemyInstance.hat.lineTo(6, -18);
        enemyInstance.hat.lineTo(0, -30);
        enemyInstance.hat.closePath();
        enemyInstance.hat.fillPath();
        enemyInstance.hat.lineStyle(2, 0xffd700);
        enemyInstance.hat.strokePath();
        // Étoile sur le chapeau
        enemyInstance.hat.fillStyle(0xffd700);
        enemyInstance.hat.fillCircle(0, -24, 2);
        container.add(head);
        container.add(enemyInstance.hat);
        // 4. Bâton magique (tenu à la main)
        const staffContainer = scene.add.container(0, 0);
        const staff = scene.add.graphics();
        staff.fillStyle(0x8b4513); // Marron pour le bâton
        staff.fillRect(8, -8, 3, 25);
        staffContainer.add(staff);
        // Orbe magique au bout (objet séparé pour l'animation)
        enemyInstance.orb = scene.add.circle(9.5, 18, 4, 0x00ffff, 0.8);
        enemyInstance.orb.setStrokeStyle(1, 0xffffff);
        staffContainer.add(enemyInstance.orb);
        enemyInstance.staff = staffContainer;
        container.add(staffContainer);
        // 5. Jambe Avant
        enemyInstance.legs.front = scene.add.container(0, 8);
        const legF = scene.add.graphics();
        legF.fillStyle(0x4a148c);
        legF.fillRoundedRect(-3, 0, 6, 20, 2);
        legF.fillRoundedRect(-4, 18, 8, 4, 2);
        enemyInstance.legs.front.add(legF);
        container.add(enemyInstance.legs.front);
        // Aura magique (particules autour)
        enemyInstance.aura = scene.add.graphics();
        enemyInstance.aura.lineStyle(1, 0x00ffff, 0.4);
        enemyInstance.aura.strokeCircle(0, 0, 18);
        enemyInstance.aura.strokeCircle(0, 0, 20);
        container.add(enemyInstance.aura);
        enemyInstance.shouldRotate = false;
    },
    onUpdateAnimation: (time, enemyInstance)=>{
        const speed = 0.005; // Marche très lente
        const range = 0.3;
        // Animation de marche
        enemyInstance.legs.front.rotation = Math.sin(time * speed) * range;
        enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * range;
        // Animation du chapeau (légère oscillation)
        if (enemyInstance.hat) enemyInstance.hat.rotation = Math.sin(time * 0.003) * 0.1;
        // Animation du bâton (légère pulsation de l'orbe)
        if (enemyInstance.orb && enemyInstance.orb.active) {
            const pulseScale = 1 + Math.sin(time * 0.01) * 0.2;
            enemyInstance.orb.setScale(pulseScale);
            enemyInstance.orb.setAlpha(0.6 + Math.sin(time * 0.015) * 0.3);
        }
        // Animation de l'aura
        if (enemyInstance.aura) {
            enemyInstance.aura.alpha = 0.3 + Math.sin(time * 0.008) * 0.2;
            enemyInstance.aura.rotation += 0.002;
        }
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"bONBj":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "zombie_minion", ()=>zombie_minion);
const zombie_minion = {
    name: "B\xe9b\xe9 Zombie",
    speed: 60,
    hp: 55,
    reward: 5,
    color: 0x4a7a2f,
    damage: 3,
    attackSpeed: 1000,
    scale: 0.7,
    onDraw: (scene, container, color, enemyInstance)=>{
        enemyInstance.legs = {};
        // 1. Jambe Arrière
        enemyInstance.legs.back = scene.add.container(0, 3);
        const legB = scene.add.graphics();
        legB.fillStyle(0x2d5016); // Vert foncé
        legB.fillRoundedRect(-2, 0, 4, 12, 1);
        legB.fillRoundedRect(-3, 11, 6, 3, 1); // Petit pied
        enemyInstance.legs.back.add(legB);
        container.add(enemyInstance.legs.back);
        // 2. Corps (petit et trapu)
        const body = scene.add.graphics();
        // Torse
        body.fillStyle(color);
        body.fillRoundedRect(-4, -6, 8, 10, 2);
        // Tête (plus grosse proportionnellement)
        body.fillStyle(0x3a6b1f);
        body.fillCircle(0, -10, 5);
        // Yeux morts (points rouges)
        body.fillStyle(0xff0000);
        body.fillCircle(-2, -11, 1);
        body.fillCircle(2, -11, 1);
        // Bras (courts)
        body.fillStyle(color);
        body.fillRoundedRect(-5, -4, 3, 6, 1);
        body.fillRoundedRect(2, -4, 3, 6, 1);
        container.add(body);
        // 3. Jambe Avant
        enemyInstance.legs.front = scene.add.container(0, 3);
        const legF = scene.add.graphics();
        legF.fillStyle(color);
        legF.fillRoundedRect(-2, 0, 4, 12, 1);
        legF.fillRoundedRect(-3, 11, 6, 3, 1);
        enemyInstance.legs.front.add(legF);
        container.add(enemyInstance.legs.front);
        // Détails zombie (plaies, déchirures)
        body.fillStyle(0x8b4513); // Marron pour les plaies
        body.fillRect(-3, -2, 2, 1);
        body.fillRect(1, 0, 2, 1);
        enemyInstance.shouldRotate = false;
    },
    onUpdateAnimation: (time, enemyInstance)=>{
        const speed = 0.01; // Animation plus rapide pour les petits
        const range = 0.4;
        enemyInstance.legs.front.rotation = Math.sin(time * speed) * range;
        enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * range;
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"lF8pq":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "bosslvl1", ()=>bosslvl1);
const bosslvl1 = {
    name: "DOOM",
    speed: 11,
    hp: 42000,
    reward: 1000,
    color: 0x222222,
    damage: 70,
    attackSpeed: 1500,
    scale: 1,
    onDraw: (scene, container, color, enemyInstance)=>{
        // Pas de jambes pour le boss, il flotte !
        // 1. Cape / Aura (Flottant derrière)
        const aura = scene.add.graphics();
        aura.fillStyle(0xff0000, 0.3); // Rouge sang transparent
        // Forme déchiquetée
        aura.beginPath();
        aura.moveTo(-30, -40);
        aura.lineTo(30, -40);
        aura.lineTo(40, 20);
        aura.lineTo(20, 50);
        aura.lineTo(0, 30);
        aura.lineTo(-20, 50);
        aura.lineTo(-40, 20);
        aura.closePath();
        aura.fillPath();
        container.add(aura);
        // 2. Corps (Armure noire massive à pointes)
        const body = scene.add.graphics();
        body.fillStyle(color); // Noir
        body.lineStyle(4, 0xff0000); // Bordure rouge
        // Torse massif
        body.beginPath();
        body.moveTo(-25, -30);
        body.lineTo(25, -30);
        body.lineTo(15, 30);
        body.lineTo(-15, 30);
        body.closePath();
        body.fillPath();
        body.strokePath();
        // Épaulières à pointes
        body.fillStyle(0xff0000);
        body.beginPath();
        body.moveTo(-25, -30);
        body.lineTo(-45, -40);
        body.lineTo(-25, -10);
        body.fillPath();
        body.beginPath();
        body.moveTo(25, -30);
        body.lineTo(45, -40);
        body.lineTo(25, -10);
        body.fillPath();
        // Tête (Casque cornu)
        body.fillStyle(color);
        body.fillRect(-12, -50, 24, 20);
        // Cornes
        body.fillStyle(0xff0000);
        body.beginPath();
        body.moveTo(-12, -50);
        body.lineTo(-25, -70);
        body.lineTo(-5, -50);
        body.fillPath();
        body.beginPath();
        body.moveTo(12, -50);
        body.lineTo(25, -70);
        body.lineTo(5, -50);
        body.fillPath();
        // Yeux brillants
        body.fillStyle(0xffff00);
        body.fillRect(-8, -45, 6, 4);
        body.fillRect(2, -45, 6, 4);
        container.add(body);
        // Le Boss est trop imposant pour tourner rapidement
        enemyInstance.shouldRotate = false;
        // On stocke l'aura pour l'animer
        enemyInstance.aura = aura;
    },
    onUpdateAnimation: (time, enemyInstance)=>{
        // Pas de marche, mais une lévitation menaçante
        const speed = 0.002;
        const floatRange = 10;
        // Flottement vertical lent
        enemyInstance.bodyGroup.y = Math.sin(time * speed) * floatRange;
        // L'aura ondule légèrement
        enemyInstance.aura.scaleX = 1 + Math.sin(time * 0.005) * 0.1;
        enemyInstance.aura.alpha = 0.3 + Math.sin(time * 0.01) * 0.1;
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"hQduM":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "bosslvl2", ()=>bosslvl2);
const bosslvl2 = {
    name: "N\xc9ANT VORACE",
    speed: 12,
    hp: 90000,
    reward: 2500,
    color: 0x000000,
    damage: 150,
    attackSpeed: 800,
    scale: 1.3,
    onDraw: (scene, container, color, enemyInstance)=>{
        // Initialisation pour l'animation
        enemyInstance.legs = [];
        enemyInstance.eye = null;
        enemyInstance.pupil = null;
        // --- 1. LES PATTES (8 pattes d'araignée effrayantes) ---
        // On les dessine d'abord pour qu'elles soient derrière le corps
        for(let i = 0; i < 8; i++){
            const leg = scene.add.graphics();
            leg.lineStyle(4, 0x110022); // Violet très sombre
            // Forme de patte articulée pointue
            leg.beginPath();
            leg.moveTo(0, 0);
            leg.lineTo(30, -20); // Premier segment
            leg.lineTo(55, 10); // Pointe vers le bas
            leg.strokePath();
            // On positionne la patte autour du corps
            // On les groupe un peu pour laisser de la place devant
            // Angles : -135, -90, -45, -20 (gauche) et 20, 45, 90, 135 (droite)
            const angles = [
                -2.2,
                -1.5,
                -0.8,
                -0.3,
                0.3,
                0.8,
                1.5,
                2.2
            ];
            const angle = angles[i];
            // Créer un conteneur pour la patte pour pouvoir la pivoter facilement
            const legContainer = scene.add.container(0, 0);
            legContainer.add(leg);
            legContainer.rotation = angle;
            // Stocker l'angle de base pour l'animation
            legContainer.baseRotation = angle;
            container.add(legContainer);
            enemyInstance.legs.push(legContainer);
        }
        // --- 2. AURA DE TÉNÈBRES (Fumée noire) ---
        const darkness = scene.add.graphics();
        darkness.fillStyle(0x000000, 0.3);
        for(let i = 0; i < 8; i++)darkness.fillCircle((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, 15 + Math.random() * 15);
        container.add(darkness);
        enemyInstance.darkness = darkness;
        // --- 3. CORPS (Masse informe) ---
        const body = scene.add.graphics();
        body.fillStyle(0x0a000a); // Noir quasi absolu
        body.lineStyle(3, 0x440044); // Contour violet maladif
        // Forme irrégulière
        body.beginPath();
        body.moveTo(-25, -30);
        body.lineTo(25, -30);
        body.lineTo(35, 0);
        body.lineTo(20, 35);
        body.lineTo(-20, 35);
        body.lineTo(-35, 0);
        body.closePath();
        body.fillPath();
        body.strokePath();
        container.add(body);
        enemyInstance.bodyGraphic = body;
        // --- 4. L'ŒIL UNIQUE (Sauron style mais organique) ---
        // Blanc de l'œil (injecté de sang)
        const eyeWhite = scene.add.graphics();
        eyeWhite.fillStyle(0xffcccc);
        eyeWhite.fillEllipse(0, -5, 15, 10);
        container.add(eyeWhite);
        enemyInstance.eye = eyeWhite;
        // Pupille (Fente verticale rouge vif)
        const pupil = scene.add.graphics();
        pupil.fillStyle(0xff0000);
        pupil.fillEllipse(0, -5, 3, 9);
        container.add(pupil);
        enemyInstance.pupil = pupil;
        // --- CONFIG ---
        enemyInstance.shouldRotate = false; // Il fait face au joueur
    },
    onUpdateAnimation: (time, enemyInstance)=>{
        // Sécurité
        if (!enemyInstance.legs || !enemyInstance.bodyGraphic) return;
        // 1. ANIMATION DES PATTES (Frénétique)
        // Elles bougent très vite et de manière désynchronisée (effet insecte)
        const legSpeed = 0.02;
        enemyInstance.legs.forEach((leg, index)=>{
            // Mouvement de marche rapide et saccadé
            const offset = index * 0.5; // Décalage pour qu'elles ne bougent pas toutes en même temps
            const wiggle = Math.sin(time * legSpeed + offset) * 0.2;
            // Ajout d'un "twitch" (spasme) aléatoire
            const twitch = Math.random() > 0.95 ? 0.1 : 0;
            leg.rotation = leg.baseRotation + wiggle + twitch;
            // Les pointes des pattes bougent légèrement en distance
            leg.x = Math.cos(leg.rotation) * (Math.sin(time * 0.01) * 2);
            leg.y = Math.sin(leg.rotation) * (Math.sin(time * 0.01) * 2);
        });
        // 2. CORPS QUI RESPIRE / PALPITE
        const breath = 1 + Math.sin(time * 0.005) * 0.05;
        enemyInstance.bodyGraphic.scaleX = breath;
        enemyInstance.bodyGraphic.scaleY = breath;
        // 3. MOUVEMENT "GLITCH" DU BOSS
        // Au lieu de flotter doucement, il se décale brusquement de temps en temps
        if (Math.random() > 0.92) {
            enemyInstance.bodyGroup.x = (Math.random() - 0.5) * 3;
            enemyInstance.bodyGroup.y = (Math.random() - 0.5) * 3;
        } else {
            // Retour progressif au centre (lissage)
            enemyInstance.bodyGroup.x *= 0.8;
            enemyInstance.bodyGroup.y *= 0.8;
        }
        // 4. L'ŒIL QUI REGARDE PARTOUT
        if (enemyInstance.pupil) {
            // La pupille bouge nerveusement
            enemyInstance.pupil.x = (Math.random() - 0.5) * 4;
            enemyInstance.pupil.y = -5 + (Math.random() - 0.5) * 2;
            // Clignement de l'œil (disparition brève)
            if (Math.random() > 0.99) {
                enemyInstance.eye.visible = false;
                enemyInstance.pupil.visible = false;
                // Réapparaît après 100ms
                setTimeout(()=>{
                    if (enemyInstance.active) {
                        enemyInstance.eye.visible = true;
                        enemyInstance.pupil.visible = true;
                    }
                }, 100);
            }
        }
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"bnkzu":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "tortue_dragon", ()=>tortue_dragon);
const tortue_dragon = {
    name: "Tortue-Dragon",
    speed: 35,
    hp: 2800,
    reward: 200,
    color: 0x4a5d23,
    damage: 25,
    attackSpeed: 1000,
    scale: 1.1,
    // Paramètres spécifiques
    shellThreshold: 0.3,
    shellDuration: 4000,
    onDraw: (scene, container, color, enemyInstance)=>{
        // Initialisation des états
        enemyInstance.legs = {};
        enemyInstance.shellGroup = null; // Groupe visuel carapace fermée
        enemyInstance.normalGroup = null; // Groupe visuel normal
        enemyInstance.isInShell = false;
        enemyInstance.hasUsedShell = false; // Pour ne le faire qu'une fois
        // --- 1. GROUPE NORMAL (Marche) ---
        const normalGroup = scene.add.container(0, 0);
        // a) Pattes Arrière
        const legBack = scene.add.graphics();
        legBack.fillStyle(0x3a4d13);
        legBack.fillRoundedRect(-4, 0, 8, 18, 3); // Cuisse
        legBack.fillRoundedRect(-5, 15, 12, 6, 2); // Pied
        const legBackContainer = scene.add.container(-10, 5);
        legBackContainer.add(legBack);
        normalGroup.add(legBackContainer);
        enemyInstance.legs.back = legBackContainer;
        // b) Pattes Avant (Ajouté pour le réalisme)
        const legFront = scene.add.graphics();
        legFront.fillStyle(0x3a4d13);
        legFront.fillRoundedRect(-4, 0, 8, 18, 3);
        legFront.fillRoundedRect(-5, 15, 12, 6, 2);
        const legFrontContainer = scene.add.container(12, 5);
        legFrontContainer.add(legFront);
        normalGroup.add(legFrontContainer);
        enemyInstance.legs.front = legFrontContainer;
        // c) Queue
        const tail = scene.add.graphics();
        tail.fillStyle(color);
        tail.fillTriangle(-20, 0, -35, -5, -35, 5);
        normalGroup.add(tail);
        // d) Corps/Carapace Ouverte
        const body = scene.add.graphics();
        body.fillStyle(color);
        body.fillEllipse(0, -5, 42, 32); // Corps principal
        body.lineStyle(3, 0x2a3d13);
        body.strokeEllipse(0, -5, 42, 32); // Contour
        // Écailles décoratives
        body.fillStyle(0x2a3d13);
        body.fillEllipse(-10, -8, 8, 6);
        body.fillEllipse(0, -10, 10, 8);
        body.fillEllipse(10, -8, 8, 6);
        normalGroup.add(body);
        // e) Tête
        const head = scene.add.graphics();
        head.fillStyle(0x5a6d33);
        head.fillRoundedRect(15, -15, 20, 14, 5); // Cou/Tête
        // Yeux
        head.fillStyle(0xff0000);
        head.fillCircle(28, -11, 2);
        // Corne/Museau
        head.fillStyle(0xffffaa);
        head.fillTriangle(32, -15, 38, -12, 32, -9);
        normalGroup.add(head);
        container.add(normalGroup);
        enemyInstance.normalGroup = normalGroup;
        // --- 2. GROUPE CARAPACE (Caché) ---
        const shellGroup = scene.add.container(0, 0);
        const shellGraphic = scene.add.graphics();
        // Ombre sous la carapace
        shellGraphic.fillStyle(0x000000, 0.3);
        shellGraphic.fillEllipse(0, 10, 40, 10);
        // La carapace fermée
        shellGraphic.fillStyle(0x3a4d13); // Plus sombre
        shellGraphic.fillEllipse(0, 0, 46, 36);
        shellGraphic.lineStyle(4, 0x1a2d03);
        shellGraphic.strokeEllipse(0, 0, 46, 36);
        // Pics sur la carapace fermée
        shellGraphic.fillStyle(0x1a2d03);
        shellGraphic.fillTriangle(-15, -10, -15, -20, -5, -12);
        shellGraphic.fillTriangle(0, -15, 0, -25, 10, -15);
        shellGraphic.fillTriangle(15, -10, 15, -20, 25, -12);
        shellGroup.add(shellGraphic);
        shellGroup.visible = false; // Invisible au départ
        container.add(shellGroup);
        enemyInstance.shellGroup = shellGroup;
        // Désactiver la rotation automatique du sprite car on gère le flip dans Enemy.js
        enemyInstance.shouldRotate = false;
    },
    onUpdateAnimation: (time, enemyInstance)=>{
        // --- LOGIQUE "SE CACHER" ---
        if (!enemyInstance.isInShell && !enemyInstance.hasUsedShell) // Vérifier si HP < 30%
        {
            if (enemyInstance.hp / enemyInstance.maxHp <= 0.3) {
                enemyInstance.isInShell = true;
                enemyInstance.hasUsedShell = true;
                // 1. Arrêter le mouvement
                if (enemyInstance.follower && enemyInstance.follower.tween) enemyInstance.follower.tween.pause();
                // 2. Visuel : Passage en mode coquille
                enemyInstance.normalGroup.visible = false;
                enemyInstance.shellGroup.visible = true;
                // 3. Timer pour ressortir (4 secondes)
                enemyInstance.scene.time.delayedCall(4000, ()=>{
                    // Vérifier si l'ennemi n'est pas mort entre temps
                    if (enemyInstance.active) {
                        enemyInstance.isInShell = false;
                        // Reprendre le mouvement
                        if (enemyInstance.follower && enemyInstance.follower.tween) enemyInstance.follower.tween.resume();
                        // Visuel : Retour normal
                        enemyInstance.normalGroup.visible = true;
                        enemyInstance.shellGroup.visible = false;
                    // Petit soin optionnel (bonus) : +10% HP
                    // enemyInstance.hp = Math.min(enemyInstance.maxHp, enemyInstance.hp + (enemyInstance.maxHp * 0.1));
                    // enemyInstance.updateHealthBar();
                    }
                });
            }
        }
        // --- ANIMATIONS ---
        if (enemyInstance.isInShell) // Animation : Tremblement quand caché
        {
            if (enemyInstance.shellGroup) {
                enemyInstance.shellGroup.x = Math.sin(time * 0.05) * 1.5; // Tremble horizontalement
                enemyInstance.shellGroup.rotation = Math.sin(time * 0.02) * 0.05; // Oscille un peu
            }
        } else {
            // Animation : Marche normale
            const speed = 0.006;
            const range = 0.5;
            // Animation des pattes (marche croisée)
            if (enemyInstance.legs.front) enemyInstance.legs.front.rotation = Math.sin(time * speed) * range;
            if (enemyInstance.legs.back) enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * range; // Opposé
            // Animation du corps (léger rebond)
            if (enemyInstance.normalGroup) enemyInstance.normalGroup.y = Math.sin(time * speed * 2) * 1;
        }
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"8mFrl":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "shaman_gobelin", ()=>shaman_gobelin);
const shaman_gobelin = {
    name: "Shaman Gobelin",
    speed: 45,
    hp: 1200,
    reward: 120,
    color: 0x8b4513,
    damage: 12,
    attackSpeed: 1500,
    scale: 0.9,
    // Stats spécifiques au healer
    healAmount: 60,
    healInterval: 2000,
    healRadius: 3,
    onDraw: (scene, container, color, enemyInstance)=>{
        // Initialisation des états
        enemyInstance.legs = {};
        enemyInstance.healArea = null;
        enemyInstance.orb = null;
        enemyInstance.lastHealTime = 0; // Important pour le cooldown du soin
        // --- 1. ZONE DE SOIN (Au sol, tout en bas) ---
        const CONFIG = {
            TILE_SIZE: 64
        };
        const tileSize = CONFIG.TILE_SIZE * (scene.scaleFactor || 1);
        // On convertit le rayon "cases" en pixels
        const radiusInPixels = shaman_gobelin.healRadius * tileSize;
        const healArea = scene.add.graphics();
        healArea.lineStyle(2, 0x00ff00, 0.5); // Bordure fine
        healArea.strokeCircle(0, 0, radiusInPixels);
        healArea.fillStyle(0x00ff00, 0.1); // Fond très transparent
        healArea.fillCircle(0, 0, radiusInPixels);
        // On l'ajoute au container mais avec un z-index négatif simulé par l'ordre d'ajout
        // Astuce : On le met dans un container 'background' attaché au container principal
        const bgContainer = scene.add.container(0, 0);
        bgContainer.add(healArea);
        container.add(bgContainer);
        bgContainer.sendToBack(healArea); // S'assurer qu'il est derrière
        enemyInstance.healArea = healArea;
        enemyInstance.healRadiusPixels = radiusInPixels; // Stocker pour la logique
        // --- 2. JAMBE ARRIÈRE ---
        enemyInstance.legs.back = scene.add.container(-4, 6);
        const legB = scene.add.graphics();
        legB.fillStyle(0x5a3510); // Marron plus foncé pour l'arrière
        legB.fillRoundedRect(-3, 0, 6, 14, 2); // Cuisse
        legB.fillRoundedRect(-4, 12, 9, 5, 2); // Pied
        enemyInstance.legs.back.add(legB);
        container.add(enemyInstance.legs.back);
        // --- 3. CORPS (Robe & Masque) ---
        const bodyGroup = scene.add.container(0, 0);
        const body = scene.add.graphics();
        // Robe
        body.fillStyle(color);
        body.fillRoundedRect(-10, -15, 20, 24, 6);
        body.lineStyle(2, 0x5a3510);
        body.strokeRoundedRect(-10, -15, 20, 24, 6);
        // Détails de la robe (ceinture)
        body.fillStyle(0xccaa00); // Doré
        body.fillRect(-10, -2, 20, 4);
        // Collier d'os
        body.fillStyle(0xeeeeee);
        body.fillCircle(-6, -10, 2);
        body.fillCircle(0, -8, 2);
        body.fillCircle(6, -10, 2);
        // Masque Tribal
        body.fillStyle(0x222222); // Masque noir
        body.fillRoundedRect(-8, -22, 16, 12, 3);
        // Peinture de guerre sur le masque
        body.fillStyle(0xff0000);
        body.fillRect(-6, -20, 2, 8);
        body.fillRect(4, -20, 2, 8);
        // Yeux brillants
        body.fillStyle(0x00ff00);
        body.fillCircle(-4, -16, 2);
        body.fillCircle(4, -16, 2);
        bodyGroup.add(body);
        container.add(bodyGroup);
        // --- 4. BÂTON MAGIQUE ---
        const staffContainer = scene.add.container(12, -5);
        const staff = scene.add.graphics();
        // Manche
        staff.fillStyle(0x654321);
        staff.fillRoundedRect(-2, -15, 4, 35, 1);
        // Tête du bâton (Crâne ou bois)
        staff.fillStyle(0xdddddd);
        staff.fillCircle(0, -15, 5);
        // Orbe magique (séparé pour animer l'alpha)
        const orb = scene.add.circle(0, -15, 6, 0x00ff00, 0.6);
        enemyInstance.orb = orb;
        staffContainer.add(staff);
        staffContainer.add(orb);
        container.add(staffContainer);
        enemyInstance.staff = staffContainer;
        // --- 5. JAMBE AVANT ---
        enemyInstance.legs.front = scene.add.container(4, 6);
        const legF = scene.add.graphics();
        legF.fillStyle(color);
        legF.fillRoundedRect(-3, 0, 6, 14, 2);
        legF.fillRoundedRect(-4, 12, 9, 5, 2);
        enemyInstance.legs.front.add(legF);
        container.add(enemyInstance.legs.front);
        enemyInstance.shouldRotate = false;
    },
    onUpdateAnimation: (time, enemyInstance)=>{
        // 1. Animation de Marche (Classique)
        const speed = 0.007;
        const range = 0.5;
        if (enemyInstance.legs.front) enemyInstance.legs.front.rotation = Math.sin(time * speed) * range;
        if (enemyInstance.legs.back) enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * range;
        // Petit rebond du bâton
        if (enemyInstance.staff) enemyInstance.staff.y = -5 + Math.sin(time * speed * 2) * 2;
        // 2. Animation Orbe & Zone (Pulsation passive)
        if (enemyInstance.orb) {
            enemyInstance.orb.alpha = 0.5 + Math.sin(time * 0.005) * 0.4;
            const s = 1 + Math.sin(time * 0.01) * 0.2;
            enemyInstance.orb.setScale(s);
        }
        if (enemyInstance.healArea) // La zone "respire" doucement
        enemyInstance.healArea.alpha = 0.3 + Math.sin(time * 0.002) * 0.1;
        // --- 3. LOGIQUE DE SOIN ---
        if (!enemyInstance.scene || !enemyInstance.active) return;
        const now = enemyInstance.scene.time.now;
        // Vérifier le Cooldown (healInterval)
        if (now - enemyInstance.lastHealTime > enemyInstance.stats.healInterval) {
            let hasHealedSomeone = false;
            const r2 = enemyInstance.healRadiusPixels * enemyInstance.healRadiusPixels; // Distance au carré pour perf
            // Parcourir tous les ennemis
            enemyInstance.scene.enemies.children.each((ally)=>{
                // Ne pas soigner si : soi-même, mort, ou déjà full vie
                if (ally === enemyInstance || !ally.active || ally.hp >= ally.maxHp) return;
                // Calcul distance
                const dx = ally.x - enemyInstance.x;
                const dy = ally.y - enemyInstance.y;
                const distSq = dx * dx + dy * dy;
                // Si à portée
                if (distSq <= r2) {
                    // APPLIQUER LE SOIN
                    const amount = enemyInstance.stats.healAmount;
                    ally.hp = Math.min(ally.maxHp, ally.hp + amount);
                    ally.updateHealthBar(); // Mise à jour visuelle de la barre de vie
                    hasHealedSomeone = true;
                    // Effet visuel sur l'allié soigné (Particules +HP)
                    if (enemyInstance.scene.add) {
                        const txt = enemyInstance.scene.add.text(ally.x, ally.y - 40, `+${amount}`, {
                            fontSize: '16px',
                            fill: '#00ff00',
                            fontStyle: 'bold',
                            stroke: '#000',
                            strokeThickness: 2
                        }).setOrigin(0.5);
                        enemyInstance.scene.tweens.add({
                            targets: txt,
                            y: ally.y - 80,
                            alpha: 0,
                            duration: 1000,
                            onComplete: ()=>txt.destroy()
                        });
                    }
                }
            });
            // Si on a soigné au moins une personne, on déclenche l'animation de cast
            if (hasHealedSomeone) {
                enemyInstance.lastHealTime = now;
                // Flash de la zone au sol
                if (enemyInstance.healArea) {
                    enemyInstance.healArea.alpha = 0.8;
                    enemyInstance.scene.tweens.add({
                        targets: enemyInstance.healArea,
                        alpha: 0.1,
                        duration: 500
                    });
                }
                // Flash de l'orbe
                if (enemyInstance.orb) {
                    enemyInstance.orb.setScale(2);
                    enemyInstance.scene.tweens.add({
                        targets: enemyInstance.orb,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 300
                    });
                }
            }
        }
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"7ppi2":[function(require,module,exports,__globalThis) {
// ==========================================
// 3. DIVISEUR (Le Boss, se divise en moyens)
// ==========================================
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "diviseur", ()=>diviseur);
const diviseur = {
    name: "Diviseur",
    speed: 30,
    hp: 3500,
    reward: 180,
    color: 0x00ff00,
    damage: 20,
    attackSpeed: 1200,
    scale: 1.3,
    // --- LOGIQUE DE DIVISION ---
    onDeath: (enemy)=>{
        if (!enemy.scene || !enemy.active) return;
        // Paramètres
        const childKey = "slime_medium";
        const count = 2; // Se divise en 2 moyens
        // Splash visuel à la mort du gros
        const splash = enemy.scene.add.circle(enemy.x, enemy.y, 10, 0x00ff00);
        enemy.scene.tweens.add({
            targets: splash,
            scale: 5,
            alpha: 0,
            duration: 400,
            onComplete: ()=>splash.destroy()
        });
        // Création des enfants
        const ChildClass = enemy.constructor;
        for(let i = 0; i < count; i++){
            const child = new ChildClass(enemy.scene, enemy.path, childKey);
            child.follower.t = Math.max(0, enemy.follower.t - i * 0.02);
            const point = enemy.path.getPoint(child.follower.t);
            child.setPosition(point.x, point.y);
            child.targetPathOffset = (Math.random() - 0.5) * 35;
            child.currentPathOffset = child.targetPathOffset;
            child.spawn();
            enemy.scene.enemies.add(child);
            child.bodyGroup.y = -25;
            enemy.scene.tweens.add({
                targets: child.bodyGroup,
                y: 0,
                duration: 400,
                ease: 'Bounce.Out'
            });
        }
    },
    onDraw: (scene, container, color, enemyInstance)=>{
        // Slime géant : forme de goutte massive
        const body = scene.add.graphics();
        // Corps principal (grosse goutte)
        body.fillStyle(color);
        body.fillEllipse(0, 0, 50, 45);
        body.lineStyle(3, 0x00cc00);
        body.strokeEllipse(0, 0, 50, 45);
        // Reflets brillants
        body.fillStyle(0x88ff88);
        body.fillEllipse(-8, -10, 15, 12);
        body.fillEllipse(5, -8, 10, 8);
        // Yeux multiples
        body.fillStyle(0x000000);
        body.fillCircle(-12, -5, 4);
        body.fillCircle(0, -8, 4);
        body.fillCircle(12, -5, 4);
        // Petites bulles à la surface
        body.fillStyle(0x88ff88);
        for(let i = 0; i < 5; i++){
            const angle = i / 5 * Math.PI * 2;
            const dist = 18;
            body.fillCircle(Math.cos(angle) * dist, Math.sin(angle) * dist, 3);
        }
        container.add(body);
        enemyInstance.body = body;
        enemyInstance.shouldRotate = false;
    },
    onUpdateAnimation: (time, enemyInstance)=>{
        // Animation de tremblement/ondulation
        if (enemyInstance.body) {
            const wobble = Math.sin(time * 0.008) * 0.1;
            enemyInstance.body.scaleX = 1 + wobble;
            enemyInstance.body.scaleY = 1 - wobble * 0.5;
            // Mouvement vertical de rebond
            enemyInstance.bodyGroup.y = Math.sin(time * 0.01) * 3;
        }
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"j7fMh":[function(require,module,exports,__globalThis) {
// ==========================================
// 2. SLIME MOYEN (Se divise en petits)
// ==========================================
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "slime_medium", ()=>slime_medium);
const slime_medium = {
    name: "Slime Moyen",
    speed: 40,
    hp: 800,
    reward: 50,
    color: 0x44ff44,
    damage: 12,
    attackSpeed: 1000,
    scale: 0.9,
    // --- LOGIQUE DE DIVISION ---
    onDeath: (enemy)=>{
        if (!enemy.scene || !enemy.active) return;
        // Paramètres
        const childKey = "slime_small";
        const count = 2; // Se divise en 2 petits
        // Création des enfants
        const ChildClass = enemy.constructor;
        for(let i = 0; i < count; i++){
            const child = new ChildClass(enemy.scene, enemy.path, childKey);
            // Positionnement légèrement décalé
            child.follower.t = Math.max(0, enemy.follower.t - i * 0.015);
            const point = enemy.path.getPoint(child.follower.t);
            child.setPosition(point.x, point.y);
            // Dispersion latérale
            child.targetPathOffset = (Math.random() - 0.5) * 25;
            child.currentPathOffset = child.targetPathOffset;
            child.spawn();
            enemy.scene.enemies.add(child);
            // Petit saut à l'apparition
            child.bodyGroup.y = -15;
            enemy.scene.tweens.add({
                targets: child.bodyGroup,
                y: 0,
                duration: 250,
                ease: 'Bounce.Out'
            });
        }
    },
    onDraw: (scene, container, color, enemyInstance)=>{
        // Slime moyen : forme de goutte
        const body = scene.add.graphics();
        // Corps principal
        body.fillStyle(color);
        body.fillEllipse(0, 0, 35, 30);
        body.lineStyle(2, 0x33cc33);
        body.strokeEllipse(0, 0, 35, 30);
        // Reflets
        body.fillStyle(0x66ff66);
        body.fillEllipse(-5, -6, 10, 8);
        body.fillEllipse(3, -5, 7, 6);
        // Yeux
        body.fillStyle(0x000000);
        body.fillCircle(-8, -3, 3);
        body.fillCircle(8, -3, 3);
        // Petites bulles
        body.fillStyle(0x66ff66);
        for(let i = 0; i < 3; i++){
            const angle = i / 3 * Math.PI * 2;
            const dist = 12;
            body.fillCircle(Math.cos(angle) * dist, Math.sin(angle) * dist, 2);
        }
        container.add(body);
        enemyInstance.body = body;
        enemyInstance.shouldRotate = false;
    },
    onUpdateAnimation: (time, enemyInstance)=>{
        // Animation de tremblement
        if (enemyInstance.body) {
            const wobble = Math.sin(time * 0.01) * 0.08;
            enemyInstance.body.scaleX = 1 + wobble;
            enemyInstance.body.scaleY = 1 - wobble * 0.5;
            // Mouvement vertical
            enemyInstance.bodyGroup.y = Math.sin(time * 0.012) * 2;
        }
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"KCZbL":[function(require,module,exports,__globalThis) {
// ==========================================
// 1. PETIT SLIME (Dernier stade, ne se divise plus)
// ==========================================
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "slime_small", ()=>slime_small);
const slime_small = {
    name: "Petit Slime",
    speed: 50,
    hp: 300,
    reward: 20,
    color: 0x88ff88,
    damage: 8,
    attackSpeed: 800,
    scale: 0.6,
    // Pas de onDeath car c'est la fin de la chaîne
    onDraw: (scene, container, color, enemyInstance)=>{
        // Petit slime : forme de goutte petite
        const body = scene.add.graphics();
        // Corps principal
        body.fillStyle(color);
        body.fillEllipse(0, 0, 22, 18);
        body.lineStyle(2, 0x66ff66);
        body.strokeEllipse(0, 0, 22, 18);
        // Reflet
        body.fillStyle(0xaaffaa);
        body.fillEllipse(-3, -4, 6, 5);
        // Yeux
        body.fillStyle(0x000000);
        body.fillCircle(-5, -2, 2);
        body.fillCircle(5, -2, 2);
        // Petite bulle
        body.fillStyle(0xaaffaa);
        body.fillCircle(0, 6, 1.5);
        container.add(body);
        enemyInstance.body = body;
        enemyInstance.shouldRotate = false;
    },
    onUpdateAnimation: (time, enemyInstance)=>{
        // Animation de tremblement rapide
        if (enemyInstance.body) {
            const wobble = Math.sin(time * 0.015) * 0.06;
            enemyInstance.body.scaleX = 1 + wobble;
            enemyInstance.body.scaleY = 1 - wobble * 0.5;
            // Mouvement vertical rapide
            enemyInstance.bodyGroup.y = Math.sin(time * 0.018) * 1.5;
        }
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"8fcfE":[function(require,module,exports,__globalThis) {
// src/levels/index.js
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "LEVELS_CONFIG", ()=>LEVELS_CONFIG);
var _level1Js = require("./level1.js");
var _level2Js = require("./level2.js");
const LEVELS_CONFIG = [
    {
        id: 1,
        name: "Les Bocages",
        data: (0, _level1Js.LEVEL_1)
    },
    {
        id: 2,
        name: "Double Front",
        data: (0, _level2Js.LEVEL_2)
    }
];

},{"./level1.js":"4Dl0R","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT","./level2.js":"alrw9"}],"4Dl0R":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "LEVEL_1", ()=>LEVEL_1);
const LEVEL_1 = {
    // 0=Herbe, 1=Chemin, 2=Base, 3=Eau, 4=Pont
    map: [
        [
            1,
            1,
            1,
            3,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            3,
            3,
            3
        ],
        [
            0,
            0,
            1,
            3,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            3,
            3
        ],
        [
            0,
            0,
            1,
            4,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            0,
            0,
            0,
            3
        ],
        [
            0,
            0,
            1,
            3,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            3
        ],
        [
            5,
            0,
            1,
            3,
            0,
            5,
            5,
            5,
            0,
            0,
            1,
            0,
            0,
            0,
            3
        ],
        [
            0,
            0,
            1,
            3,
            0,
            5,
            5,
            5,
            0,
            0,
            1,
            0,
            0,
            0,
            0
        ],
        [
            0,
            0,
            1,
            3,
            0,
            5,
            5,
            5,
            0,
            0,
            1,
            0,
            0,
            0,
            0
        ],
        [
            0,
            0,
            1,
            3,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0
        ],
        [
            0,
            0,
            1,
            4,
            1,
            1,
            1,
            0,
            0,
            0,
            1,
            0,
            0,
            3,
            0
        ],
        [
            0,
            0,
            0,
            3,
            0,
            0,
            1,
            0,
            0,
            0,
            1,
            0,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            3,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            0,
            0,
            0,
            3
        ],
        [
            0,
            0,
            0,
            3,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0
        ],
        [
            0,
            0,
            0,
            3,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            0
        ],
        [
            3,
            3,
            3,
            3,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0
        ],
        [
            0,
            0,
            0,
            3,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            2
        ]
    ],
    // LISTE DES CHEMINS POSSIBLES (paths au pluriel)
    paths: [
        // CHEMIN A : Passe par le pont du HAUT
        [
            {
                x: 0,
                y: 0
            },
            {
                x: 2,
                y: 0
            },
            {
                x: 2,
                y: 2
            },
            {
                x: 10,
                y: 2
            },
            {
                x: 10,
                y: 10
            },
            {
                x: 10,
                y: 12
            },
            {
                x: 13,
                y: 12
            },
            {
                x: 13,
                y: 13
            },
            {
                x: 13,
                y: 14
            },
            {
                x: 14,
                y: 14
            }
        ],
        // CHEMIN B : Passe par le pont du BAS
        [
            {
                x: 0,
                y: 0
            },
            {
                x: 2,
                y: 0
            },
            {
                x: 2,
                y: 8
            },
            {
                x: 6,
                y: 8
            },
            {
                x: 6,
                y: 10
            },
            {
                x: 10,
                y: 10
            },
            {
                x: 10,
                y: 12
            },
            {
                x: 13,
                y: 12
            },
            {
                x: 13,
                y: 13
            },
            {
                x: 13,
                y: 14
            },
            {
                x: 14,
                y: 14
            }
        ]
    ],
    waves: [
        // VAGUE 1 : Soldats (50% haut, 50% bas)
        [
            {
                count: 18,
                type: "grunt",
                interval: 1000
            },
            {
                count: 15,
                type: "grunt",
                interval: 1000
            }
        ],
        // VAGUE 2 : Runners
        [
            {
                count: 20,
                type: "runner",
                interval: 450
            }
        ],
        // VAGUE 3 : Mixte
        [
            {
                count: 4,
                type: "shield",
                interval: 1500
            },
            {
                count: 8,
                type: "runner",
                interval: 800
            },
            {
                count: 15,
                type: "grunt",
                interval: 600
            }
        ],
        // VAGUE 4 : Tank
        [
            {
                count: 20,
                type: "runner",
                interval: 400
            },
            {
                count: 3,
                type: "shield",
                interval: 1500
            },
            {
                count: 8,
                type: "grunt",
                interval: 600
            },
            {
                count: 4,
                type: "tank",
                interval: 4000
            }
        ],
        // VAGUE 5 : Invasion
        [
            {
                count: 60,
                type: "grunt",
                interval: 500
            },
            {
                count: 6,
                type: "shield",
                interval: 1500
            },
            {
                count: 10,
                type: "runner",
                interval: 400
            },
            {
                count: 4,
                type: "tank",
                interval: 4000
            },
            {
                count: 2,
                type: "witch",
                interval: 4000
            }
        ],
        // VAGUE 6 : BOSS
        [
            {
                count: 60,
                type: "grunt",
                interval: 700
            },
            {
                count: 30,
                type: "runner",
                interval: 1500
            },
            {
                count: 6,
                type: "tank",
                interval: 5000
            },
            {
                count: 1,
                type: "boss",
                interval: 3000
            }
        ]
    ]
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"alrw9":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "LEVEL_2", ()=>LEVEL_2);
const LEVEL_2 = {
    // 0=Herbe, 1=Chemin, 2=Base, 3=Eau, 4=Pont
    map: [
        [
            0,
            0,
            0,
            3,
            3,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ],
        [
            0,
            0,
            0,
            3,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            5,
            5,
            5,
            0
        ],
        [
            1,
            1,
            1,
            4,
            1,
            1,
            1,
            1,
            1,
            0,
            0,
            5,
            5,
            5,
            0
        ],
        [
            0,
            0,
            0,
            3,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            5,
            5,
            5,
            0
        ],
        [
            0,
            0,
            0,
            3,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            0
        ],
        [
            0,
            0,
            3,
            3,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            1
        ],
        [
            0,
            3,
            3,
            3,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1
        ],
        [
            0,
            0,
            0,
            3,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1
        ],
        [
            1,
            1,
            1,
            3,
            3,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            1
        ],
        [
            0,
            0,
            1,
            3,
            0,
            0,
            1,
            1,
            1,
            0,
            0,
            1,
            0,
            0,
            0
        ],
        [
            0,
            0,
            1,
            3,
            1,
            1,
            1,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0
        ],
        [
            0,
            0,
            1,
            4,
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0
        ],
        [
            0,
            0,
            0,
            3,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0
        ],
        [
            0,
            0,
            3,
            3,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0
        ],
        [
            3,
            3,
            3,
            3,
            3,
            0,
            5,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            2
        ]
    ],
    // LISTE DES CHEMINS CORRIGÉS
    paths: [
        // --- CHEMIN A : Départ HAUT GAUCHE ---
        [
            {
                x: 0,
                y: 2
            },
            {
                x: 8,
                y: 2
            },
            {
                x: 8,
                y: 5
            },
            {
                x: 14,
                y: 5
            },
            {
                x: 14,
                y: 8
            },
            {
                x: 11,
                y: 8
            },
            {
                x: 11,
                y: 14
            },
            {
                x: 14,
                y: 14
            } // Va à droite vers la Base
        ],
        // --- CHEMIN B : Départ BAS GAUCHE (Le zig-zag) ---
        [
            {
                x: 0,
                y: 8
            },
            {
                x: 2,
                y: 8
            },
            {
                x: 2,
                y: 11
            },
            {
                x: 4,
                y: 11
            },
            {
                x: 4,
                y: 10
            },
            {
                x: 6,
                y: 10
            },
            {
                x: 6,
                y: 9
            },
            {
                x: 8,
                y: 9
            },
            {
                x: 8,
                y: 8
            },
            {
                x: 11,
                y: 8
            },
            {
                x: 11,
                y: 14
            },
            {
                x: 14,
                y: 14
            } // Va à droite vers la Base
        ]
    ],
    waves: [
        // VAGUE 1 : Introduction douce - Ennemis de base
        [
            {
                count: 15,
                type: "grunt",
                interval: 900
            },
            {
                count: 8,
                type: "runner",
                interval: 700
            }
        ],
        // VAGUE 2 : Runners rapides et grunts
        [
            {
                count: 15,
                type: "runner",
                interval: 400
            },
            {
                count: 30,
                type: "grunt",
                interval: 600
            }
        ],
        // VAGUE 3 : Introduction des shields - Mixte équilibré
        [
            {
                count: 18,
                type: "grunt",
                interval: 550
            },
            {
                count: 15,
                type: "runner",
                interval: 450
            },
            {
                count: 5,
                type: "shield",
                interval: 1300
            }
        ],
        // VAGUE 4 : Tanks et support - Augmentation de la difficulté
        [
            {
                count: 30,
                type: "runner",
                interval: 380
            },
            {
                count: 25,
                type: "grunt",
                interval: 500
            },
            {
                count: 6,
                type: "shield",
                interval: 1200
            },
            {
                count: 3,
                type: "tank",
                interval: 4000
            }
        ],
        // VAGUE 5 : Introduction Tortue-Dragon - Premier nouveau ennemi
        [
            {
                count: 35,
                type: "grunt",
                interval: 450
            },
            {
                count: 20,
                type: "runner",
                interval: 400
            },
            {
                count: 8,
                type: "shield",
                interval: 1100
            },
            {
                count: 4,
                type: "tank",
                interval: 3500
            },
            {
                count: 2,
                type: "tortue_dragon",
                interval: 5000
            }
        ],
        // VAGUE 6 : Shaman Gobelin - Soin des ennemis
        [
            {
                count: 40,
                type: "grunt",
                interval: 400
            },
            {
                count: 25,
                type: "runner",
                interval: 350
            },
            {
                count: 10,
                type: "shield",
                interval: 1000
            },
            {
                count: 5,
                type: "tank",
                interval: 3000
            },
            {
                count: 3,
                type: "tortue_dragon",
                interval: 4500
            },
            {
                count: 2,
                type: "shaman_gobelin",
                interval: 6000
            }
        ],
        // VAGUE 7 : Diviseur - Les slimes arrivent !
        [
            {
                count: 45,
                type: "grunt",
                interval: 380
            },
            {
                count: 30,
                type: "runner",
                interval: 350
            },
            {
                count: 12,
                type: "shield",
                interval: 950
            },
            {
                count: 6,
                type: "tank",
                interval: 2800
            },
            {
                count: 4,
                type: "tortue_dragon",
                interval: 4000
            },
            {
                count: 3,
                type: "shaman_gobelin",
                interval: 5500
            },
            {
                count: 2,
                type: "diviseur",
                interval: 8000
            }
        ],
        // VAGUE 8 : Invasion massive - Tous les ennemis
        [
            {
                count: 50,
                type: "grunt",
                interval: 350
            },
            {
                count: 35,
                type: "runner",
                interval: 320
            },
            {
                count: 15,
                type: "shield",
                interval: 900
            },
            {
                count: 8,
                type: "tank",
                interval: 2500
            },
            {
                count: 5,
                type: "tortue_dragon",
                interval: 3800
            },
            {
                count: 4,
                type: "shaman_gobelin",
                interval: 5000
            },
            {
                count: 3,
                type: "diviseur",
                interval: 7000
            },
            {
                count: 2,
                type: "witch",
                interval: 6000
            }
        ],
        // VAGUE 9 : BOSS FINAL - Boss Level 2 avec armée complète
        [
            {
                count: 60,
                type: "grunt",
                interval: 400
            },
            {
                count: 40,
                type: "runner",
                interval: 350
            },
            {
                count: 18,
                type: "shield",
                interval: 850
            },
            {
                count: 10,
                type: "tank",
                interval: 2200
            },
            {
                count: 6,
                type: "tortue_dragon",
                interval: 3500
            },
            {
                count: 5,
                type: "shaman_gobelin",
                interval: 4500
            },
            {
                count: 4,
                type: "diviseur",
                interval: 6000
            },
            {
                count: 3,
                type: "witch",
                interval: 5000
            },
            {
                count: 1,
                type: "bosslvl2",
                interval: 20000
            }
        ]
    ]
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"bDbTi":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "GameScene", ()=>GameScene);
var _settingsJs = require("../config/settings.js");
var _indexJs = require("../config/levels/index.js");
var _indexJs1 = require("../config/turrets/index.js");
var _lightningJs = require("../sorts/lightning.js");
var _enemyJs = require("../objects/Enemy.js");
var _turretJs = require("../objects/Turret.js");
var _barracksJs = require("../objects/Barracks.js");
var _mapManagerJs = require("./managers/MapManager.js");
var _waveManagerJs = require("./managers/WaveManager.js");
var _uimanagerJs = require("./managers/UIManager.js");
class GameScene extends Phaser.Scene {
    constructor(){
        super("GameScene");
    }
    init(data) {
        this.levelID = data.level || 1;
        const levelData = (0, _indexJs.LEVELS_CONFIG).find((l)=>l.id === this.levelID);
        const src = levelData ? levelData.data : (0, _indexJs.LEVELS_CONFIG)[0].data;
        // CLONE PROFOND pour ne jamais muter LEVELS_CONFIG
        if (typeof structuredClone !== "undefined") this.levelConfig = structuredClone(src);
        else this.levelConfig = JSON.parse(JSON.stringify(src));
        this.money = (0, _settingsJs.CONFIG).STARTING_MONEY;
        this.lives = (0, _settingsJs.CONFIG).STARTING_LIVES;
        this.turrets = [];
        this.barracks = [];
        this.paths = [];
        this.currentWaveIndex = 0;
        this.isWaveRunning = false;
        this.enemies = null;
        this.soldiers = null;
        this.nextWaveAutoTimer = null; // Timer pour le lancement automatique
        this.nextWaveCountdown = 0; // Compte à rebours en secondes
        this.waveSpawnTimers = []; // Liste des timers de spawn des ennemis
        this.endCheckTimer = null; // Timer de vérification de fin de vague
        this.selectedTurret = null;
        this.maxBarracks = 5;
        this.draggingTurret = null;
        this.placementPreview = null;
        this.validCellsPreview = [];
        this.upgradeTextLines = []; // Pour stocker les lignes de texte du menu
        this.tileHighlight = null; // Highlight visuel sur la case survolée
        this.placingSpell = null; // Sort en cours de placement
        this.spellPreview = null; // Preview de la zone du sort
        this.lightningCooldown = 0; // Cooldown du sort éclair (0 = disponible)
        this.lightningOnCooldown = false; // Flag pour empêcher les clics multiples
        // Réinitialiser toutes les références UI pour éviter les références vers objets détruits
        this.buildToolbar = null;
        this.toolbarButtons = null;
        this.txtMoney = null;
        this.txtLives = null;
        this.txtWave = null;
        this.txtWave = null;
        this.buildMenu = null;
        this.upgradeMenu = null;
        this.treeRemovalMenu = null;
        this.treeRemovalTile = null;
        this.waveBtnContainer = null;
        this.waveBtnBg = null;
        this.waveBtnText = null;
        this.toolbarTooltip = null; // Tooltip pour la toolbar
        this.isPaused = false; // État de pause
        this.pauseBtn = null; // Bouton pause
        this.resumeBtn = null; // Bouton reprendre au centre de l'écran
        this.pausedTimers = []; // Liste des timers en pause
        this.pausedTweens = []; // Liste des tweens en pause
    }
    preload() {
        // Générer les textures seulement si le système est prêt
        if (this.textures && this.make) this.generateTextures();
        else console.warn("Syst\xe8me de textures non pr\xeat, report de la g\xe9n\xe9ration");
    }
    create() {
        this.input.mouse.disableContextMenu();
        this.cameras.main.setBackgroundColor("#050505");
        // Attacher shutdown() aux events Phaser pour un cleanup automatique
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
        this.events.once(Phaser.Scenes.Events.DESTROY, this.shutdown, this);
        // S'assurer que les textures sont générées (au cas où preload() n'a pas pu le faire)
        if (this.textures && this.make) try {
            this.generateTextures();
        } catch (e) {
            console.warn("Erreur lors de la g\xe9n\xe9ration des textures dans create():", e);
        }
        // Calculer les dimensions et le scale
        this.calculateLayout();
        // Initialiser les managers
        this.mapManager = new (0, _mapManagerJs.MapManager)(this);
        this.waveManager = new (0, _waveManagerJs.WaveManager)(this);
        this.uiManager = new (0, _uimanagerJs.UIManager)(this);
        // Support tactile : long press pour clic droit
        this.longPressTimer = null;
        this.longPressDelay = 500;
        this.mapManager.createMap();
        this.enemies = this.add.group({
            runChildUpdate: true
        });
        this.soldiers = this.add.group({
            runChildUpdate: true
        });
        this.uiManager.createUI();
        this.createBuildToolbar();
        // Gestion de la touche Echap pour annuler le drag ou le sort
        this.input.keyboard.on("keydown-ESC", ()=>{
            if (this.placingSpell) this.cancelSpellPlacement();
            else this.cancelDrag();
        });
        // Gestion des clics
        this.setupInputHandlers();
    }
    // Calculer le layout pour centrer correctement
    calculateLayout() {
        this.gameWidth = this.scale.width;
        this.gameHeight = this.scale.height;
        this.baseWidth = this.game.baseWidth || (0, _settingsJs.CONFIG).GAME_WIDTH;
        this.baseHeight = this.game.baseHeight || (0, _settingsJs.CONFIG).GAME_HEIGHT;
        // Calculer le scale factor pour adapter à l'écran
        // On veut que tout tienne dans la hauteur disponible
        const mapWidth = 15 * (0, _settingsJs.CONFIG).TILE_SIZE;
        const mapHeight = 15 * (0, _settingsJs.CONFIG).TILE_SIZE;
        const uiHeight = (0, _settingsJs.CONFIG).UI_HEIGHT;
        const toolbarHeight = 120; // Toolbar plus grande
        const toolbarMargin = (0, _settingsJs.CONFIG).TOOLBAR_MARGIN;
        // Hauteur totale nécessaire
        const totalHeightNeeded = uiHeight + mapHeight + toolbarMargin + toolbarHeight + toolbarMargin;
        // Calculer le scale pour que tout tienne
        const scaleY = (this.gameHeight - 20) / totalHeightNeeded; // -20 pour marge
        const scaleX = (this.gameWidth - 20) / mapWidth; // -20 pour marge
        // Utiliser le plus petit pour que tout tienne
        this.scaleFactor = Math.min(scaleX, scaleY, 1.5); // Limiter à 1.5x max
        // Dimensions réelles avec le scale
        const mapWidthScaled = mapWidth * this.scaleFactor;
        const mapHeightScaled = mapHeight * this.scaleFactor;
        const uiHeightScaled = uiHeight * this.scaleFactor;
        const toolbarHeightScaled = toolbarHeight * this.scaleFactor;
        const toolbarMarginScaled = toolbarMargin * this.scaleFactor;
        // Centrer la map horizontalement
        this.mapOffsetX = (this.gameWidth - mapWidthScaled) / 2;
        // Positionner l'UI en haut
        this.uiOffsetY = 0;
        // Positionner la map sous l'UI
        this.mapOffsetY = uiHeightScaled;
        // Positionner la toolbar sous la map (centrée horizontalement aussi)
        this.toolbarOffsetY = this.mapOffsetY + mapHeightScaled + toolbarMarginScaled;
        // Calculer la largeur exacte de la toolbar pour un centrage parfait
        const itemSpacing = 90 * this.scaleFactor;
        const toolbarWidth = 5 * itemSpacing + 40 * this.scaleFactor; // Largeur exacte de la toolbar
        this.toolbarOffsetX = (this.gameWidth - toolbarWidth) / 2; // Centrer horizontalement
        // Stocker les offsets pour utilisation dans createMap
        this.mapStartX = this.mapOffsetX;
        this.mapStartY = this.mapOffsetY;
    }
    // Gérer le redimensionnement
    handleResize() {
        this.calculateLayout();
        // Repositionner les éléments
        if (this.buildToolbar) this.buildToolbar.setPosition(this.toolbarOffsetX, this.toolbarOffsetY);
    // Mettre à jour les positions des éléments UI
    // (On pourrait recréer l'UI complètement, mais pour simplifier on ajuste juste)
    }
    setupInputHandlers() {
        // Highlight visuel sur la case survolée
        this.input.on("pointermove", (pointer)=>{
            const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scaleFactor;
            // Vérifier si le pointeur est dans la zone de la map
            if (pointer.worldY < this.mapStartY || pointer.worldY > this.mapStartY + 15 * T || pointer.worldX < this.mapStartX || pointer.worldX > this.mapStartX + 15 * T) {
                if (this.tileHighlight) this.tileHighlight.setVisible(false);
                return;
            }
            // Convertir en coordonnées grille
            const tx = Math.floor((pointer.worldX - this.mapStartX) / T);
            const ty = Math.floor((pointer.worldY - this.mapStartY) / T);
            if (tx < 0 || tx >= 15 || ty < 0 || ty >= 15) {
                if (this.tileHighlight) this.tileHighlight.setVisible(false);
                return;
            }
            // Créer ou mettre à jour le highlight
            if (!this.tileHighlight) {
                this.tileHighlight = this.add.graphics();
                this.tileHighlight.setDepth(1);
            }
            const px = this.mapStartX + tx * T;
            const py = this.mapStartY + ty * T;
            this.tileHighlight.clear();
            this.tileHighlight.lineStyle(2, 0xffffff, 0.3); // Border très léger
            this.tileHighlight.strokeRect(px, py, T, T);
            this.tileHighlight.setVisible(true);
        });
        // Gestion des clics normaux et tactiles
        this.input.on("pointerdown", (pointer)=>{
            // Si le jeu est en pause, ne pas gérer les clics (sauf sur le bouton pause)
            if (this.isPaused) return;
            // Vérifier si le clic est sur la toolbar
            if (this.isPointerOnToolbar(pointer)) // Ne pas gérer les clics sur la toolbar comme des clics de jeu
            return;
            // Si on est en train de drag, gérer le placement
            if (this.draggingTurret) {
                if (pointer.rightButtonDown()) this.cancelDrag();
                return;
            }
            // Masquer les menus par défaut
            this.buildMenu.setVisible(false);
            this.upgradeMenu.setVisible(false);
            if (this.treeRemovalMenu) this.treeRemovalMenu.setVisible(false);
            this.selectedTurret = null;
            // Clic droit ou long press sur mobile
            if (pointer.rightButtonDown()) this.handleRightClick(pointer);
            else if (pointer.isDown) // Démarrer le timer pour long press
            this.longPressTimer = this.time.delayedCall(this.longPressDelay, ()=>{
                this.handleRightClick(pointer);
            });
        });
        // Annuler le long press si on relève le doigt
        this.input.on("pointerup", (pointer)=>{
            if (this.longPressTimer) {
                this.longPressTimer.remove();
                this.longPressTimer = null;
                // C'est un clic normal, pas un long press
                if (!this.draggingTurret && !this.isPointerOnToolbar(pointer)) this.handleNormalClick(pointer);
            }
            // Si on drag, placer au clic gauche (mais pas si on est sur la toolbar)
            if (this.draggingTurret && pointer.leftButtonReleased() && !this.isPointerOnToolbar(pointer)) this.placeDraggedTurret(pointer);
            // Si on place un sort, gérer le clic
            if (this.placingSpell && pointer.leftButtonReleased()) {
                if (!this.isPointerOnToolbar(pointer)) this.placeLightning(pointer.worldX, pointer.worldY);
            }
            // Annuler le placement du sort avec clic droit
            if (this.placingSpell && pointer.rightButtonReleased()) this.cancelSpellPlacement();
        });
    }
    // Vérifier si le pointeur est sur la toolbar
    isPointerOnToolbar(pointer) {
        if (!this.buildToolbar) return false;
        const toolbarY = this.toolbarOffsetY;
        const toolbarHeight = 120 * this.scaleFactor; // Utiliser la nouvelle hauteur
        return pointer.worldY >= toolbarY && pointer.worldY <= toolbarY + toolbarHeight;
    }
    handleNormalClick(pointer) {
    // Gérer les clics sur les boutons UI
    }
    update(time, delta) {
        // Si le jeu est en pause, ne rien mettre à jour
        if (this.isPaused) return;
        // Mettre à jour le cooldown du sort
        if (this.lightningCooldown > 0) {
            this.lightningCooldown -= delta;
            if (this.lightningCooldown <= 0) {
                this.lightningCooldown = 0;
                // Réinitialiser le flag quand le cooldown est terminé
                this.lightningOnCooldown = false;
            }
            this.updateLightningSpellButton();
        } else if (this.lightningOnCooldown) {
            // S'assurer que le flag est réinitialisé si le cooldown est déjà à 0
            this.lightningOnCooldown = false;
            this.updateLightningSpellButton();
        }
        // Le compte à rebours est géré par le timer dans WaveManager, pas besoin de le mettre à jour ici
        this.turrets.forEach((t)=>t.update(time, this.enemies));
        this.barracks.forEach((b)=>b.update(time));
        this.soldiers.children.each((soldier)=>{
            if (soldier && soldier.active) soldier.update();
        });
        // Mettre à jour le preview de placement si on drag
        if (this.draggingTurret) this.updatePlacementPreview();
    }
    // =========================================================
    // GESTION CARTE & CHEMINS (délégué à MapManager)
    // =========================================================
    addDecoration(px, py) {
        // Garder quelques petites décorations pour la variété
        if (Math.random() > 0.95) {
            const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scaleFactor;
            const dx = px + Phaser.Math.Between(10, T - 10) * this.scaleFactor;
            const dy = py + Phaser.Math.Between(10, T - 10) * this.scaleFactor;
            if (Math.random() > 0.5) {
                const deco1 = this.add.circle(dx, dy, 3 * this.scaleFactor, 0xffaa00).setDepth(1);
                const deco2 = this.add.circle(dx + 2 * this.scaleFactor, dy + 2 * this.scaleFactor, 2 * this.scaleFactor, 0x00ff00).setDepth(1);
            } else this.add.circle(dx, dy, 4 * this.scaleFactor, 0x555555).setDepth(1);
        }
    }
    // =========================================================
    // VAGUES
    // =========================================================
    startWave() {
        // Annuler le timer automatique si le joueur lance manuellement
        if (this.nextWaveAutoTimer) {
            this.nextWaveAutoTimer.remove();
            this.nextWaveAutoTimer = null;
            this.nextWaveCountdown = 0;
        }
        this.waveManager.startWave();
    }
    monitorWaveEnd() {
        this.waveManager.monitorWaveEnd();
    }
    finishWave() {
        this.waveManager.finishWave();
    }
    levelComplete() {
        this.waveManager.levelComplete();
    }
    // =========================================================
    // GESTION CLICS & MENUS
    // =========================================================
    // Dans GameScene.js
    handleRightClick(pointer) {
        const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scaleFactor;
        // Vérifier si le clic est dans la zone de la map
        if (pointer.worldY < this.mapStartY || pointer.worldY > this.mapStartY + 15 * T) return;
        if (pointer.worldX < this.mapStartX || pointer.worldX > this.mapStartX + 15 * T) return;
        // Convertir clic en coordonnées Grille
        const tx = Math.floor((pointer.worldX - this.mapStartX) / T);
        const ty = Math.floor((pointer.worldY - this.mapStartY) / T);
        if (tx < 0 || tx >= 15 || ty < 0 || ty >= 15) return;
        // Vérifier si une tourelle ou barracks est sur cette case
        let clickedTurret = null;
        for (const t of this.turrets){
            // ... (code existant inchangé pour trouver la tourelle) ...
            const turretTx = Math.floor((t.x - this.mapStartX) / T);
            const turretTy = Math.floor((t.y - this.mapStartY) / T);
            if (turretTx === tx && turretTy === ty) {
                clickedTurret = t;
                break;
            }
        }
        if (!clickedTurret) for (const b of this.barracks){
            // ... (code existant inchangé pour trouver la caserne) ...
            const barracksTx = Math.floor((b.x - this.mapStartX) / T);
            const barracksTy = Math.floor((b.y - this.mapStartY) / T);
            if (barracksTx === tx && barracksTy === ty) {
                clickedTurret = b;
                break;
            }
        }
        if (clickedTurret) // Clic exact sur la tourelle -> Upgrade
        this.uiManager.openUpgradeMenu(pointer, clickedTurret);
        else {
            // Vérifier le type de terrain AVANT d'ouvrir le menu
            // 0 = Herbe (Constructible), tout le reste (Chemin, Eau, Base) = Non constructible
            const tileType = this.levelConfig.map[ty][tx];
            if (tileType !== 0) // C'est un chemin ou un obstacle, on ne fait rien (pas de menu)
            return;
            // Vérifier s'il y a un arbre sur cette case
            if (this.mapManager.hasTree(tx, ty)) {
                // Ouvrir le menu de confirmation pour enlever l'arbre
                this.uiManager.openTreeRemovalConfirmation(pointer, tx, ty);
                return;
            }
            // Clic sur case vide ET constructible -> Build
            this.uiManager.openBuildMenu(pointer);
        }
    }
    // Vérifier si une case est adjacente à un chemin
    isAdjacentToPath(tx, ty) {
        return this.mapManager.isAdjacentToPath(tx, ty);
    }
    triggerUpgrade() {
        if (!this.selectedTurret) return;
        const nextStats = this.selectedTurret.getNextLevelStats();
        if (!nextStats) return;
        const cost = nextStats.cost;
        if (this.money >= cost) {
            this.money -= cost;
            this.updateUI();
            this.selectedTurret.upgrade();
            this.upgradeMenu.setVisible(false);
            this.selectedTurret = null;
        } else this.cameras.main.shake(50, 0.005);
    }
    buildTurret(turretConfig, tileX, tileY) {
        // --- CORRECTION ICI ---
        // Vérification stricte du terrain : Si ce n'est pas de l'herbe (0), on refuse tout de suite.
        const tileType = this.levelConfig.map[tileY][tileX];
        if (tileType !== 0) {
            this.cameras.main.shake(50, 0.005);
            return false;
        }
        // Vérifier qu'il n'y a pas d'arbre ici
        if (this.mapManager.hasTree(tileX, tileY)) return false;
        // ... Le reste de ta méthode reste identique ...
        const isBarracks = turretConfig.key === "barracks";
        // Limiter les barracks à 5 maximum
        if (isBarracks && this.barracks.length >= this.maxBarracks) {
            this.cameras.main.shake(50, 0.005);
            const errorText = this.add.text(this.gameWidth / 2, this.gameHeight / 2, `Maximum ${this.maxBarracks} casernes!`, {
                fontSize: `${Math.max(16, 24 * this.scaleFactor)}px`,
                fill: "#ff0000",
                fontStyle: "bold"
            }).setOrigin(0.5).setDepth(300);
            this.tweens.add({
                targets: errorText,
                alpha: 0,
                y: errorText.y - 30,
                duration: 2000,
                onComplete: ()=>errorText.destroy()
            });
            return false;
        }
        // Pour les barracks, vérifier qu'on peut poser uniquement sur les cases adjacentes aux chemins
        if (isBarracks && !this.mapManager.isAdjacentToPath(tileX, tileY)) {
            this.cameras.main.shake(50, 0.005);
            return false;
        }
        if (this.money >= turretConfig.cost) {
            this.money -= turretConfig.cost;
            this.updateUI();
            const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scaleFactor;
            const px = this.mapStartX + tileX * T + T / 2;
            const py = this.mapStartY + tileY * T + T / 2;
            if (isBarracks) {
                const b = new (0, _barracksJs.Barracks)(this, px, py, turretConfig);
                b.setDepth(20);
                b.setScale(this.scaleFactor);
                this.barracks.push(b);
                b.deploySoldiers();
            } else {
                const t = new (0, _turretJs.Turret)(this, px, py, turretConfig);
                t.setDepth(20);
                t.setScale(this.scaleFactor);
                this.turrets.push(t);
            }
            this.levelConfig.map[tileY][tileX] = 9;
            // Mettre à jour les compteurs de la toolbar
            this.updateToolbarCounts();
            return true;
        } else {
            this.cameras.main.shake(50, 0.005);
            return false;
        }
    }
    takeDamage() {
        this.lives--;
        this.updateUI();
        this.cameras.main.shake(150, 0.01);
        if (this.lives <= 0) {
            alert("PERDU !");
            this.scene.start("MainMenuScene");
        }
    }
    earnMoney(amount) {
        this.money += amount;
        this.updateUI();
    }
    // =========================================================
    // GESTION DE LA PAUSE
    // =========================================================
    pauseGame() {
        if (this.isPaused) return;
        this.isPaused = true;
        // Le bouton pause dans la toolbar reste inchangé (reste "PAUSE")
        // Mettre en pause tous les timers de spawn des vagues
        this.pausedTimers = [];
        if (this.waveSpawnTimers) this.waveSpawnTimers.forEach((timer)=>{
            if (timer && timer.paused !== undefined) {
                timer.paused = true;
                this.pausedTimers.push(timer);
            }
        });
        // Mettre en pause le timer de vérification de fin de vague
        if (this.endCheckTimer && this.endCheckTimer.paused !== undefined) {
            this.endCheckTimer.paused = true;
            this.pausedTimers.push(this.endCheckTimer);
        }
        // Mettre en pause le timer de compte à rebours
        if (this.nextWaveAutoTimer && this.nextWaveAutoTimer.paused !== undefined) {
            this.nextWaveAutoTimer.paused = true;
            this.pausedTimers.push(this.nextWaveAutoTimer);
        }
        // Mettre en pause tous les autres timers
        if (this.time && this.time.events) this.time.events.getAll().forEach((event)=>{
            if (event && !event.paused && event !== this.endCheckTimer && event !== this.nextWaveAutoTimer) // Vérifier que ce n'est pas déjà dans waveSpawnTimers
            {
                if (!this.waveSpawnTimers || !this.waveSpawnTimers.includes(event)) {
                    event.paused = true;
                    this.pausedTimers.push(event);
                }
            }
        });
        // Mettre en pause tous les tweens
        this.pausedTweens = [];
        if (this.tweens && this.tweens.getAllTweens) {
            const allTweens = this.tweens.getAllTweens();
            allTweens.forEach((tween)=>{
                if (tween && tween.isPlaying && !tween.isPaused) {
                    tween.pause();
                    this.pausedTweens.push(tween);
                }
            });
        }
        // Mettre en pause les ennemis (leurs tweens de mouvement)
        if (this.enemies) this.enemies.children.each((enemy)=>{
            if (enemy && enemy.follower && enemy.follower.tween && enemy.follower.tween.isPlaying) enemy.follower.tween.pause();
        });
        // Mettre en pause les animations des tourelles
        if (this.turrets) this.turrets.forEach((turret)=>{
            if (turret && turret.rotationTween && turret.rotationTween.isPlaying) turret.rotationTween.pause();
        });
        // Créer le bouton "REPRENDRE" au centre de l'écran
        if (!this.resumeBtn) {
            const s = this.scaleFactor;
            const btnWidth = 250 * s;
            const btnHeight = 60 * s;
            // Container pour le bouton
            const resumeContainer = this.add.container(this.gameWidth / 2, this.gameHeight / 2).setDepth(200);
            // Fond du bouton
            const resumeBg = this.add.graphics();
            resumeBg.fillStyle(0x333333, 0.95);
            resumeBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 10);
            resumeBg.lineStyle(3, 0x00ff00, 1);
            resumeBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 10);
            resumeContainer.add(resumeBg);
            // Texte du bouton
            const resumeText = this.add.text(0, 0, "\u25B6\uFE0F REPRENDRE", {
                fontSize: `${Math.max(18, 24 * s)}px`,
                fill: "#00ff00",
                fontStyle: "bold",
                fontFamily: "Arial"
            }).setOrigin(0.5);
            resumeContainer.add(resumeText);
            // Rendre le bouton interactif
            resumeBg.setInteractive(new Phaser.Geom.Rectangle(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight), Phaser.Geom.Rectangle.Contains);
            resumeBg.on("pointerover", ()=>{
                resumeBg.clear();
                resumeBg.fillStyle(0x444444, 0.95);
                resumeBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 10);
                resumeBg.lineStyle(3, 0x00ff00, 1);
                resumeBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 10);
                resumeText.setColor("#00ff88");
            });
            resumeBg.on("pointerout", ()=>{
                resumeBg.clear();
                resumeBg.fillStyle(0x333333, 0.95);
                resumeBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 10);
                resumeBg.lineStyle(3, 0x00ff00, 1);
                resumeBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 10);
                resumeText.setColor("#00ff00");
            });
            resumeBg.on("pointerdown", ()=>{
                this.resumeGame();
            });
            this.resumeBtn = resumeContainer;
        } else this.resumeBtn.setVisible(true);
    }
    resumeGame() {
        if (!this.isPaused) return;
        this.isPaused = false;
        // Le bouton pause dans la toolbar reste inchangé
        // Reprendre tous les timers de spawn des vagues
        if (this.waveSpawnTimers) this.waveSpawnTimers.forEach((timer)=>{
            if (timer && timer.paused !== undefined) timer.paused = false;
        });
        // Reprendre le timer de vérification de fin de vague
        if (this.endCheckTimer && this.endCheckTimer.paused !== undefined) this.endCheckTimer.paused = false;
        // Reprendre le timer de compte à rebours
        if (this.nextWaveAutoTimer && this.nextWaveAutoTimer.paused !== undefined) this.nextWaveAutoTimer.paused = false;
        // Reprendre tous les autres timers
        this.pausedTimers.forEach((timer)=>{
            if (timer && timer.paused !== undefined) timer.paused = false;
        });
        this.pausedTimers = [];
        // Reprendre tous les tweens
        this.pausedTweens.forEach((tween)=>{
            if (tween && tween.isPaused) tween.resume();
        });
        this.pausedTweens = [];
        // Reprendre les ennemis
        if (this.enemies) this.enemies.children.each((enemy)=>{
            if (enemy && enemy.follower && enemy.follower.tween && enemy.follower.tween.isPaused && !enemy.isParalyzed && !enemy.isInShell) enemy.follower.tween.resume();
        });
        // Reprendre les animations des tourelles
        if (this.turrets) this.turrets.forEach((turret)=>{
            if (turret && turret.rotationTween && turret.rotationTween.isPaused) turret.rotationTween.resume();
        });
        // Masquer le bouton reprendre
        if (this.resumeBtn) this.resumeBtn.setVisible(false);
    }
    updateUI() {
        if (this.txtMoney) this.txtMoney.setText(`\u{1F4B0} ${this.money}`);
        if (this.txtLives) this.txtLives.setText(`\u{2764}\u{FE0F} ${this.lives}`);
        // Mettre à jour l'affichage de la vague
        if (this.txtWave) {
            let currentWave = (this.currentWaveIndex || 0) + 1;
            let totalWaves = 0;
            // Obtenir le nombre total de vagues
            if (this.levelConfig && this.levelConfig.waves) totalWaves = this.levelConfig.waves.length;
            else {
                // Fallback : chercher dans LEVELS_CONFIG
                const levelData = (0, _indexJs.LEVELS_CONFIG).find((l)=>l.id === this.levelID);
                if (levelData && levelData.data && levelData.data.waves) totalWaves = levelData.data.waves.length;
                else // Fallback par défaut selon le niveau
                totalWaves = this.levelID === 2 ? 9 : 6;
            }
            this.txtWave.setText(`\u{1F30A} VAGUE ${currentWave}/${totalWaves}`);
        }
        this.updateToolbarCounts();
        // Mettre à jour les boutons du menu de construction si visible
        if (this.buildMenu && this.buildMenu.visible) this.uiManager.updateBuildMenuButtons();
    }
    // =========================================================
    // GESTION UI (délégué à UIManager)
    // =========================================================
    // Créer la toolbar de construction en bas (sous la map)
    createBuildToolbar() {
        const toolbarY = this.toolbarOffsetY;
        const itemSize = 80 * this.scaleFactor;
        const itemSpacing = 90 * this.scaleFactor;
        const toolbarHeight = 120 * this.scaleFactor;
        const margin = 20 * this.scaleFactor;
        // Calculer les largeurs des sections
        const spellSectionWidth = itemSize + margin * 2; // Section des sorts à gauche
        const turretsSectionWidth = 5 * itemSpacing; // Section des tourelles au milieu
        const waveButtonWidth = 300 * this.scaleFactor; // Bouton de vague à droite
        const waveButtonHeight = 60 * this.scaleFactor;
        // Calculer la position de départ pour centrer les tourelles
        const totalWidth = spellSectionWidth + turretsSectionWidth + waveButtonWidth + margin * 4;
        const startX = (this.gameWidth - totalWidth) / 2;
        // Section des sorts à gauche
        const spellSectionX = startX + margin;
        this.spellSection = this.add.container(spellSectionX, toolbarY).setDepth(150);
        const spellBg = this.add.graphics();
        spellBg.fillStyle(0x000000, 0.9);
        spellBg.fillRoundedRect(0, 0, spellSectionWidth, toolbarHeight, 10);
        spellBg.lineStyle(3, 0xffffff, 0.6);
        spellBg.strokeRoundedRect(0, 0, spellSectionWidth, toolbarHeight, 10);
        this.spellSection.add(spellBg);
        // Créer le bouton du sort éclair dans la section des sorts
        this.createLightningSpellButton(itemSize, itemSize / 2 + margin, toolbarHeight, spellSectionX);
        // Section des tourelles au milieu
        const turretsSectionX = startX + spellSectionWidth + margin * 2;
        this.buildToolbar = this.add.container(turretsSectionX, toolbarY).setDepth(150);
        const toolbarBg = this.add.graphics();
        toolbarBg.fillStyle(0x000000, 0.9);
        toolbarBg.fillRoundedRect(0, 0, turretsSectionWidth, toolbarHeight, 10);
        toolbarBg.lineStyle(3, 0xffffff, 0.6);
        toolbarBg.strokeRoundedRect(0, 0, turretsSectionWidth, toolbarHeight, 10);
        this.buildToolbar.add(toolbarBg);
        // Créer les boutons pour chaque type de tourelle
        const turretTypes = [
            {
                key: "machine_gun",
                config: (0, _indexJs1.TURRETS).machine_gun
            },
            {
                key: "sniper",
                config: (0, _indexJs1.TURRETS).sniper
            },
            {
                key: "cannon",
                config: (0, _indexJs1.TURRETS).cannon
            },
            {
                key: "zap",
                config: (0, _indexJs1.TURRETS).zap
            },
            {
                key: "barracks",
                config: (0, _indexJs1.TURRETS).barracks
            }
        ];
        this.toolbarButtons = [];
        turretTypes.forEach((item, index)=>{
            // Centrer les boutons dans la section des tourelles
            const totalWidth = 5 * itemSpacing;
            const startX = (turretsSectionWidth - totalWidth) / 2 + itemSpacing / 2;
            const x = startX + index * itemSpacing;
            const y = toolbarHeight / 2; // Centrer verticalement
            // Container pour le bouton
            const btnContainer = this.add.container(x, y);
            // Fond du bouton (plus grand)
            const btnBg = this.add.rectangle(0, 0, itemSize, itemSize, 0x333333, 0.9);
            btnBg.setStrokeStyle(3, 0x666666);
            btnBg.setInteractive({
                useHandCursor: true
            });
            // Miniature du bâtiment avec le vrai visuel (plus grande)
            const previewContainer = this.add.container(0, 0);
            this.drawTurretPreview(previewContainer, item.config);
            previewContainer.setScale(0.5 * this.scaleFactor); // Augmenté de 0.3 à 0.5
            // Texte avec nombre construit / maximum (plus grand)
            const countText = this.add.text(0, itemSize / 2 + 12 * this.scaleFactor, "", {
                fontSize: `${Math.max(14, 16 * this.scaleFactor)}px`,
                fill: "#ffffff",
                fontStyle: "bold"
            }).setOrigin(0.5);
            // Texte avec le prix de la tourelle
            const priceText = this.add.text(0, itemSize / 2 + 28 * this.scaleFactor, `${item.config.cost}$`, {
                fontSize: `${Math.max(12, 14 * this.scaleFactor)}px`,
                fill: "#ffd700",
                fontStyle: "bold"
            }).setOrigin(0.5);
            // Fonction pour mettre à jour le compteur et l'état du bouton
            const updateCount = ()=>{
                // Vérifier que les objets sont encore valides avant de les manipuler
                if (!countText || countText.active === false) return;
                if (!btnBg || btnBg.active === false) return;
                if (!priceText || priceText.active === false) return;
                try {
                    const canAfford = this.money >= item.config.cost;
                    let isDisabled = false;
                    let disabledReason = "";
                    if (item.key === "barracks") {
                        const count = this.barracks.length;
                        const max = this.maxBarracks;
                        countText.setText(`${count}/${max}`);
                        isDisabled = count >= max;
                        disabledReason = count >= max ? "MAX" : "";
                        countText.setColor(count >= max ? "#ff0000" : "#ffffff");
                    } else {
                        const count = this.turrets.filter((t)=>t.config.key === item.key).length;
                        countText.setText(`${count}`);
                    }
                    // Désactiver visuellement si on ne peut pas se le permettre ou si limite atteinte
                    const shouldDisable = !canAfford || isDisabled;
                    if (shouldDisable) {
                        // État désactivé : grisé
                        btnBg.setFillStyle(0x1a1a1a, 0.6);
                        btnBg.setStrokeStyle(3, 0x444444, 0.5);
                        btnBg.setAlpha(0.5);
                        previewContainer.setAlpha(0.4);
                        priceText.setColor("#ff4444");
                        priceText.setAlpha(0.7);
                        countText.setAlpha(0.7);
                        btnBg.disableInteractive();
                    } else {
                        // État actif : normal
                        btnBg.setFillStyle(0x333333, 0.9);
                        btnBg.setStrokeStyle(3, 0x666666, 1);
                        btnBg.setAlpha(1);
                        previewContainer.setAlpha(1);
                        priceText.setColor("#ffd700");
                        priceText.setAlpha(1);
                        countText.setAlpha(1);
                        btnBg.setInteractive({
                            useHandCursor: true
                        });
                    }
                } catch (e) {
                    // Ignorer si les objets ont été détruits
                    console.warn("Erreur lors de la mise \xe0 jour du compteur:", e);
                }
            };
            btnContainer.add([
                btnBg,
                previewContainer,
                countText,
                priceText
            ]);
            this.buildToolbar.add(btnContainer);
            // Tooltip pour la description dans la toolbar
            let toolbarTooltip = null;
            btnBg.on("pointerover", ()=>{
                // Afficher le tooltip avec la description
                if (item.config.description) this.showToolbarTooltip(btnContainer, item.config.description, btnBg);
            });
            btnBg.on("pointerout", ()=>{
                // Cacher le tooltip
                if (this.toolbarTooltip) {
                    this.toolbarTooltip.destroy();
                    this.toolbarTooltip = null;
                }
            });
            // Gestion du clic pour démarrer le drag (seulement si actif)
            btnBg.on("pointerdown", (pointer)=>{
                // Cacher le tooltip lors du clic
                if (this.toolbarTooltip) {
                    this.toolbarTooltip.destroy();
                    this.toolbarTooltip = null;
                }
                // Vérifier les limites
                if (item.key === "barracks" && this.barracks.length >= this.maxBarracks) {
                    this.cameras.main.shake(50, 0.005);
                    return;
                }
                if (this.money >= item.config.cost) this.startDrag(item.config);
                else this.cameras.main.shake(50, 0.005);
            });
            this.toolbarButtons.push({
                container: btnContainer,
                config: item.config,
                updateCount: updateCount,
                btnBg: btnBg,
                priceText: priceText,
                countText: countText,
                previewContainer: previewContainer
            });
        });
        // Mettre à jour les compteurs
        this.updateToolbarCounts();
    }
    // Afficher un tooltip avec la description de la tourelle dans la toolbar
    showToolbarTooltip(btnContainer, description, triggerElement) {
        const s = this.scaleFactor;
        // Détruire l'ancien tooltip s'il existe
        if (this.toolbarTooltip) this.toolbarTooltip.destroy();
        // Calculer la position du tooltip (au-dessus du bouton)
        // Le btnContainer peut être dans buildToolbar (tourelles) ou directement dans la scène (sort)
        let btnX, btnY;
        // Vérifier si le container est dans buildToolbar en vérifiant son parent
        const isInBuildToolbar = this.buildToolbar && (btnContainer.parentContainer === this.buildToolbar || this.buildToolbar.list && this.buildToolbar.list.includes(btnContainer));
        if (isInBuildToolbar) {
            // Pour les tourelles dans buildToolbar
            btnX = btnContainer.x + this.buildToolbar.x;
            btnY = btnContainer.y + this.buildToolbar.y;
        } else {
            // Pour le sort, btnContainer est directement dans la scène avec position absolue
            btnX = btnContainer.x;
            btnY = btnContainer.y;
        }
        // Créer le tooltip
        const tooltipContainer = this.add.container(0, 0).setDepth(300);
        this.toolbarTooltip = tooltipContainer;
        // Fond du tooltip
        const tooltipBg = this.add.graphics();
        const padding = 15 * s;
        const maxWidth = 350 * s;
        // Calculer la taille du texte
        const tempText = this.add.text(0, 0, description, {
            fontSize: `${Math.max(11, 12 * s)}px`,
            fill: "#ffffff",
            fontFamily: "Arial",
            wordWrap: {
                width: maxWidth - padding * 2
            },
            lineSpacing: 4 * s
        });
        const textWidth = Math.min(tempText.width, maxWidth - padding * 2);
        const textHeight = tempText.height;
        tempText.destroy();
        const tooltipWidth = textWidth + padding * 2;
        const tooltipHeight = textHeight + padding * 2;
        // Positionner le tooltip au-dessus du bouton
        const tooltipX = btnX;
        const tooltipY = btnY - tooltipHeight - 10 * s;
        // Dessiner le fond
        tooltipBg.fillStyle(0x000000, 0.95);
        tooltipBg.fillRoundedRect(0, 0, tooltipWidth, tooltipHeight, 8);
        tooltipBg.lineStyle(2, 0x00ccff, 1);
        tooltipBg.strokeRoundedRect(0, 0, tooltipWidth, tooltipHeight, 8);
        // Texte de description
        const descText = this.add.text(padding, padding, description, {
            fontSize: `${Math.max(11, 12 * s)}px`,
            fill: "#ffffff",
            fontFamily: "Arial",
            wordWrap: {
                width: maxWidth - padding * 2
            },
            lineSpacing: 4 * s
        });
        tooltipContainer.add([
            tooltipBg,
            descText
        ]);
        tooltipContainer.setPosition(tooltipX, tooltipY);
        // Ajuster la position si le tooltip sort de l'écran
        if (tooltipX + tooltipWidth > this.gameWidth) tooltipContainer.setX(this.gameWidth - tooltipWidth - 10 * s);
        if (tooltipY < 0) tooltipContainer.setY(btnY + 80 * s + 10 * s); // En dessous si pas de place au-dessus
    }
    // Créer le bouton du sort éclair
    createLightningSpellButton(itemSize, xOffset, toolbarHeight, sectionX) {
        const x = xOffset;
        const y = toolbarHeight / 2;
        const btnContainer = this.add.container(sectionX + x, this.toolbarOffsetY + y);
        btnContainer.setDepth(151);
        // Fond du bouton
        const btnBg = this.add.rectangle(0, 0, itemSize, itemSize, 0x333333, 0.9);
        btnBg.setStrokeStyle(3, 0x666666);
        btnBg.setInteractive({
            useHandCursor: true
        });
        // Icône d'éclair
        const lightningIcon = this.add.graphics();
        this.drawLightningIcon(lightningIcon, 0, 0, itemSize * 0.6);
        lightningIcon.setScale(this.scaleFactor);
        // Masque de cooldown (cercle qui se remplit)
        const cooldownMask = this.add.graphics();
        cooldownMask.setDepth(152);
        cooldownMask.setVisible(false);
        // Texte de cooldown
        const cooldownText = this.add.text(0, itemSize / 2 + 12 * this.scaleFactor, "", {
            fontSize: `${Math.max(10, 12 * this.scaleFactor)}px`,
            fill: "#ffffff",
            fontStyle: "bold"
        }).setOrigin(0.5);
        btnContainer.add([
            btnBg,
            lightningIcon,
            cooldownMask,
            cooldownText
        ]);
        // Tooltip pour la description (même système que pour les tourelles)
        btnBg.on("pointerover", ()=>{
            // Afficher le tooltip avec la description
            if ((0, _lightningJs.lightning).description) this.showToolbarTooltip(btnContainer, (0, _lightningJs.lightning).description, btnBg);
        });
        btnBg.on("pointerout", ()=>{
            // Cacher le tooltip
            if (this.toolbarTooltip) {
                this.toolbarTooltip.destroy();
                this.toolbarTooltip = null;
            }
        });
        // Gestion du clic
        btnBg.on("pointerdown", ()=>{
            // Cacher le tooltip lors du clic
            if (this.toolbarTooltip) {
                this.toolbarTooltip.destroy();
                this.toolbarTooltip = null;
            }
            // Vérifier que le cooldown est terminé et qu'on n'est pas déjà en train de placer
            if (this.lightningCooldown <= 0 && !this.placingSpell) this.startPlacingLightning();
        });
        // Stocker les références pour la mise à jour
        this.lightningSpellButton = {
            container: btnContainer,
            bg: btnBg,
            icon: lightningIcon,
            cooldownMask: cooldownMask,
            cooldownText: cooldownText
        };
        // Initialiser l'affichage
        this.updateLightningSpellButton();
    }
    // Dessiner l'icône d'éclair
    drawLightningIcon(graphics, x, y, size) {
        graphics.clear();
        graphics.fillStyle(0xffff00, 1);
        // Forme d'éclair en zigzag
        graphics.beginPath();
        graphics.moveTo(x, y - size / 2);
        graphics.lineTo(x - size / 4, y - size / 6);
        graphics.lineTo(x, y);
        graphics.lineTo(x + size / 4, y + size / 6);
        graphics.lineTo(x, y + size / 2);
        graphics.lineTo(x - size / 6, y + size / 4);
        graphics.lineTo(x, y);
        graphics.lineTo(x + size / 6, y - size / 4);
        graphics.closePath();
        graphics.fillPath();
        // Bordure
        graphics.lineStyle(2, 0xffffff, 1);
        graphics.strokePath();
    }
    // Démarrer le placement du sort
    startPlacingLightning() {
        this.placingSpell = (0, _lightningJs.lightning);
        // Créer le preview de la zone
        if (!this.spellPreview) {
            this.spellPreview = this.add.graphics();
            this.spellPreview.setDepth(200);
        }
        // Mettre à jour le preview au mouvement de la souris
        this.input.on("pointermove", this.updateSpellPreview, this);
    }
    // Mettre à jour le preview du sort
    updateSpellPreview(pointer) {
        if (!this.placingSpell || !this.spellPreview) return;
        // Utiliser exactement le même radius que pour les dégâts
        const radius = (0, _lightningJs.lightning).radius;
        const x = pointer.worldX;
        const y = pointer.worldY;
        this.spellPreview.clear();
        this.spellPreview.lineStyle(3, 0x00ffff, 0.8);
        this.spellPreview.strokeCircle(x, y, radius);
        this.spellPreview.fillStyle(0x00ffff, 0.2);
        this.spellPreview.fillCircle(x, y, radius);
    }
    // Placer le sort éclair
    placeLightning(x, y) {
        if (!this.placingSpell || this.lightningOnCooldown) return;
        // Activer le cooldown immédiatement pour empêcher les clics multiples
        this.lightningOnCooldown = true;
        this.lightningCooldown = (0, _lightningJs.lightning).cooldown;
        // Créer l'animation d'éclair
        this.castLightning(x, y);
        // Nettoyer le placement
        this.cancelSpellPlacement();
    }
    // Annuler le placement du sort
    cancelSpellPlacement() {
        this.placingSpell = null;
        if (this.spellPreview) this.spellPreview.clear();
        this.input.off("pointermove", this.updateSpellPreview, this);
    }
    // Lancer le sort éclair avec animation
    castLightning(x, y) {
        // Utiliser exactement le même radius partout
        const effectRadius = (0, _lightningJs.lightning).radius;
        // 1. Éclair qui tombe du ciel (animation fixe pour être toujours identique)
        const lightningBolt = this.add.graphics();
        lightningBolt.setDepth(300);
        // Ligne d'éclair depuis le haut
        const startY = this.mapStartY - 50;
        // Éclair principal (zigzag fixe - pas de random pour avoir toujours la même animation)
        lightningBolt.lineStyle(10, 0xffffff, 1);
        lightningBolt.beginPath();
        lightningBolt.moveTo(x, startY);
        // Créer un zigzag fixe pour l'éclair (même pattern à chaque fois)
        const steps = 8;
        const stepHeight = (y - startY) / steps;
        const offsets = [
            -8,
            12,
            -10,
            15,
            -12,
            10,
            -8,
            5
        ]; // Pattern fixe
        for(let i = 1; i <= steps; i++){
            const currentY = startY + stepHeight * i;
            const offsetX = offsets[i - 1] || 0;
            lightningBolt.lineTo(x + offsetX, currentY);
        }
        lightningBolt.lineTo(x, y);
        lightningBolt.strokePath();
        // Éclair secondaire (plus fin, cyan) - pattern fixe aussi
        lightningBolt.lineStyle(4, 0x00ffff, 1);
        lightningBolt.beginPath();
        lightningBolt.moveTo(x, startY);
        const offsets2 = [
            -6,
            9,
            -7,
            11,
            -9,
            7,
            -6,
            3
        ]; // Pattern fixe
        for(let i = 1; i <= steps; i++){
            const currentY = startY + stepHeight * i;
            const offsetX = offsets2[i - 1] || 0;
            lightningBolt.lineTo(x + offsetX, currentY);
        }
        lightningBolt.lineTo(x, y);
        lightningBolt.strokePath();
        // Branches d'éclair latérales (positions fixes)
        const branchOffsets = [
            {
                x: -25,
                y: 0.3
            },
            {
                x: 30,
                y: 0.5
            },
            {
                x: -20,
                y: 0.7
            },
            {
                x: 28,
                y: 0.4
            },
            {
                x: -22,
                y: 0.6
            }
        ];
        branchOffsets.forEach((branch)=>{
            const offsetY = startY + (y - startY) * branch.y;
            lightningBolt.lineStyle(3, 0xffffff, 0.8);
            lightningBolt.lineBetween(x, offsetY, x + branch.x, offsetY);
        });
        // Flash initial
        const flash = this.add.circle(x, y, effectRadius * 1.5, 0xffffff, 1);
        flash.setDepth(301);
        this.tweens.add({
            targets: flash,
            scale: 0,
            alpha: 0,
            duration: 200,
            onComplete: ()=>{
                flash.destroy();
                lightningBolt.destroy();
            }
        });
        // 2. Zone d'impact avec brûlure du terrain (même radius que les dégâts)
        const burnZone = this.add.graphics();
        burnZone.setDepth(5);
        burnZone.fillStyle(0x000000, 0.6);
        burnZone.fillCircle(x, y, effectRadius);
        burnZone.lineStyle(2, 0x8b4513, 1);
        burnZone.strokeCircle(x, y, effectRadius);
        // Effet de brûlure qui s'estompe
        this.tweens.add({
            targets: burnZone,
            alpha: 0,
            duration: 5000,
            onComplete: ()=>burnZone.destroy()
        });
        // 3. Dégâts et paralysie sur les ennemis (utiliser exactement le même radius)
        if (this.enemies) this.enemies.children.each((enemy)=>{
            if (enemy && enemy.active) {
                const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
                if (dist <= effectRadius) {
                    // Dégâts
                    enemy.damage((0, _lightningJs.lightning).damage);
                    // Paralysie seulement si l'ennemi survit
                    if (enemy.hp > 0 && enemy.paralyze) enemy.paralyze((0, _lightningJs.lightning).paralysisDuration);
                }
            }
        });
        // 4. Effet de particules (dans la zone d'effet)
        for(let i = 0; i < 20; i++){
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * effectRadius;
            const px = x + Math.cos(angle) * dist;
            const py = y + Math.sin(angle) * dist;
            const particle = this.add.circle(px, py, 3, 0xffff00, 1);
            particle.setDepth(302);
            this.tweens.add({
                targets: particle,
                x: px + (Math.random() - 0.5) * 50,
                y: py + (Math.random() - 0.5) * 50,
                alpha: 0,
                scale: 0,
                duration: 1000 + Math.random() * 500,
                onComplete: ()=>particle.destroy()
            });
        }
    }
    // Mettre à jour l'affichage du bouton de sort
    updateLightningSpellButton() {
        if (!this.lightningSpellButton) return;
        const { bg, icon, cooldownMask, cooldownText } = this.lightningSpellButton;
        const cooldownPercent = this.lightningCooldown / (0, _lightningJs.lightning).cooldown;
        const remainingSeconds = Math.ceil(this.lightningCooldown / 1000);
        if (this.lightningCooldown > 0) {
            // Afficher le masque de cooldown
            cooldownMask.setVisible(true);
            cooldownMask.clear();
            const itemSize = 80 * this.scaleFactor;
            const radius = itemSize / 2;
            // Dessiner un masque circulaire qui se remplit progressivement (de bas en haut)
            cooldownMask.clear();
            cooldownMask.fillStyle(0x000000, 0.7);
            if (cooldownPercent > 0) {
                const startAngle = -Math.PI / 2; // Commence en haut
                const endAngle = startAngle + cooldownPercent * Math.PI * 2;
                cooldownMask.beginPath();
                cooldownMask.moveTo(0, 0);
                cooldownMask.arc(0, 0, radius, startAngle, endAngle, false);
                cooldownMask.closePath();
                cooldownMask.fillPath();
            }
            // Texte de cooldown
            cooldownText.setText(`${remainingSeconds}s`);
            cooldownText.setVisible(true);
            // Désactiver le bouton
            bg.setFillStyle(0x1a1a1a, 0.6);
            bg.setStrokeStyle(3, 0x444444);
            icon.setAlpha(0.5);
            bg.disableInteractive();
        } else {
            // Réactiver le bouton
            cooldownMask.setVisible(false);
            cooldownText.setVisible(false);
            bg.setFillStyle(0x333333, 0.9);
            bg.setStrokeStyle(3, 0x666666);
            icon.setAlpha(1);
            bg.setInteractive({
                useHandCursor: true
            });
        }
    }
    // Dessiner une miniature du bâtiment pour la toolbar avec le vrai visuel
    drawTurretPreview(container, config) {
        // Dessiner la base exactement comme dans Turret.drawBase() (niveau 1)
        const base = this.add.graphics();
        const color = 0x333333; // Même couleur que Turret.drawBase() pour niveau 1
        base.fillStyle(color);
        base.fillCircle(0, 0, 24); // Même taille que dans Turret.drawBase()
        base.lineStyle(2, 0x111111); // Même bordure que dans Turret.drawBase()
        base.strokeCircle(0, 0, 24);
        container.add(base);
        // Dessiner le canon/barrel avec la fonction onDrawBarrel exactement comme dans Turret.drawBarrel()
        if (config.onDrawBarrel) {
            const barrelContainer = this.add.container(0, 0);
            // Créer un objet turret factice pour onDrawBarrel (niveau 1 pour la preview)
            const fakeTurret = {
                level: 1,
                config: config
            };
            try {
                // Utiliser exactement la même signature que Turret.drawBarrel()
                config.onDrawBarrel(this, barrelContainer, config.color, fakeTurret);
                container.add(barrelContainer);
            } catch (e) {
                console.warn("Erreur lors du dessin de la pr\xe9visualisation:", e);
                // Fallback : dessin simple
                const fallback = this.add.graphics();
                fallback.fillStyle(0xffffff);
                fallback.fillRect(0, -3, 15, 6);
                container.add(fallback);
            }
        } else {
            // Fallback : dessin simple si pas de onDrawBarrel
            const fallback = this.add.graphics();
            fallback.fillStyle(0xffffff);
            fallback.fillRect(0, -3, 15, 6);
            container.add(fallback);
        }
    }
    // Mettre à jour les compteurs de la toolbar
    updateToolbarCounts() {
        // Vérifier que toolbarButtons existe et est un tableau valide
        if (!this.toolbarButtons || !Array.isArray(this.toolbarButtons)) return;
        // Filtrer les boutons invalides (références vers objets détruits)
        this.toolbarButtons = this.toolbarButtons.filter((btn)=>btn && btn.updateCount);
        // Mettre à jour chaque bouton avec protection
        this.toolbarButtons.forEach((btn)=>{
            try {
                if (btn && btn.updateCount) btn.updateCount();
            } catch (e) {
                // Ignorer si un ancien bouton traîne encore
                console.warn("Erreur lors de la mise \xe0 jour d'un bouton de toolbar:", e);
            }
        });
    }
    // Démarrer le drag d'une tourelle
    startDrag(turretConfig) {
        if (!turretConfig || !this.scene || !this.scene.isActive()) return;
        this.draggingTurret = turretConfig;
        // Créer un aperçu qui suit le curseur
        if (this.placementPreview && this.placementPreview.active !== false) try {
            this.placementPreview.destroy();
        } catch (e) {
        // Ignorer si déjà détruit
        }
        try {
            const preview = this.add.graphics();
            preview.fillStyle(turretConfig.color || 0x888888, 0.6);
            preview.fillCircle(0, 0, 20 * this.scaleFactor);
            preview.lineStyle(2, turretConfig.color || 0x888888);
            preview.strokeCircle(0, 0, 20 * this.scaleFactor);
            preview.setDepth(200);
            this.placementPreview = preview;
            // Afficher les cellules valides
            this.showValidPlacementCells();
        } catch (e) {
            console.warn("Erreur lors du d\xe9marrage du drag:", e);
            this.draggingTurret = null;
        }
    }
    // Mettre à jour l'aperçu de placement
    updatePlacementPreview() {
        if (!this.placementPreview || !this.draggingTurret) {
            // Si le preview est détruit, annuler le drag
            if (!this.placementPreview && this.draggingTurret) this.draggingTurret = null;
            return;
        }
        // Vérifier que le preview est toujours actif
        if (this.placementPreview.active === false) {
            this.draggingTurret = null;
            this.placementPreview = null;
            return;
        }
        try {
            const pointer = this.input.activePointer;
            if (!pointer) return;
            const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scaleFactor;
            // Suivre le curseur
            this.placementPreview.setPosition(pointer.worldX, pointer.worldY);
            // Convertir en coordonnées de tile
            const tx = Math.floor((pointer.worldX - this.mapStartX) / T);
            const ty = Math.floor((pointer.worldY - this.mapStartY) / T);
            // Vérifier si on peut poser ici
            let canPlace = false;
            if (tx >= 0 && tx < 15 && ty >= 0 && ty < 15 && this.levelConfig && this.levelConfig.map) {
                const tileType = this.levelConfig.map[ty][tx];
                if (tileType === 0) {
                    // Herbe
                    // Vérifier qu'il n'y a pas d'arbre ici
                    const hasTree = this.mapManager && this.mapManager.hasTree ? this.mapManager.hasTree(tx, ty) : false;
                    if (!hasTree) {
                        if (this.draggingTurret.key === "barracks") canPlace = this.mapManager && this.mapManager.isAdjacentToPath ? this.mapManager.isAdjacentToPath(tx, ty) && this.money >= this.draggingTurret.cost : false;
                        else canPlace = this.money >= this.draggingTurret.cost;
                    }
                }
            }
            // Changer la couleur selon si on peut poser
            this.placementPreview.clear();
            const color = canPlace ? 0x00ff00 : 0xff0000;
            this.placementPreview.fillStyle(color, 0.4);
            this.placementPreview.fillCircle(0, 0, 20 * this.scaleFactor);
            this.placementPreview.lineStyle(2, color);
            this.placementPreview.strokeCircle(0, 0, 20 * this.scaleFactor);
        } catch (e) {
            console.warn("Erreur lors de la mise \xe0 jour du preview:", e);
            // Annuler le drag en cas d'erreur
            this.draggingTurret = null;
            if (this.placementPreview && this.placementPreview.active !== false) try {
                this.placementPreview.destroy();
            } catch (e2) {
            // Ignorer
            }
            this.placementPreview = null;
        }
    }
    // Afficher les cellules où on peut poser
    showValidPlacementCells() {
        // Supprimer l'ancien aperçu
        if (this.validCellsPreview) {
            this.validCellsPreview.forEach((cell)=>cell.destroy());
            this.validCellsPreview = [];
        } else this.validCellsPreview = [];
        const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scaleFactor;
        for(let y = 0; y < 15; y++)for(let x = 0; x < 15; x++){
            const tileType = this.levelConfig.map[y][x];
            if (tileType === 0) {
                // Herbe
                // Vérifier qu'il n'y a pas d'arbre ici
                const hasTree = this.mapManager.hasTree(x, y);
                if (!hasTree) {
                    let canPlace = false;
                    if (this.draggingTurret.key === "barracks") canPlace = this.mapManager.isAdjacentToPath(x, y) && this.money >= this.draggingTurret.cost;
                    else canPlace = this.money >= this.draggingTurret.cost;
                    if (canPlace) {
                        const px = this.mapStartX + x * T + T / 2;
                        const py = this.mapStartY + y * T + T / 2;
                        const cell = this.add.rectangle(px, py, T - 4, T - 4, 0x00ff00, 0.2);
                        cell.setStrokeStyle(2, 0x00ff00, 0.5);
                        cell.setDepth(1);
                        this.validCellsPreview.push(cell);
                    }
                }
            }
        }
    }
    // Placer la tourelle draguee
    placeDraggedTurret(pointer) {
        if (!this.draggingTurret) return;
        const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scaleFactor;
        const tx = Math.floor((pointer.worldX - this.mapStartX) / T);
        const ty = Math.floor((pointer.worldY - this.mapStartY) / T);
        if (tx >= 0 && tx < 15 && ty >= 0 && ty < 15) {
            const tileType = this.levelConfig.map[ty][tx];
            if (tileType === 0) {
                // Herbe
                // Vérifier qu'il n'y a pas d'arbre ici
                const hasTree = this.mapManager.hasTree(tx, ty);
                if (!hasTree) {
                    const success = this.buildTurret(this.draggingTurret, tx, ty);
                    if (success) {
                        this.cancelDrag();
                        this.updateToolbarCounts();
                    }
                } else this.cameras.main.shake(50, 0.005);
            }
        }
    }
    // Annuler le drag
    cancelDrag() {
        this.draggingTurret = null;
        if (this.placementPreview) {
            this.placementPreview.destroy();
            this.placementPreview = null;
        }
        if (this.validCellsPreview) {
            this.validCellsPreview.forEach((cell)=>cell.destroy());
            this.validCellsPreview = [];
        }
    }
    generateTextures() {
        const T = (0, _settingsJs.CONFIG).TILE_SIZE;
        // Vérifier que le système de textures est disponible
        if (!this.textures || !this.make) {
            console.warn("Syst\xe8me de textures non disponible");
            return;
        }
        const g = this.make.graphics({
            add: false
        });
        if (!g) {
            console.warn("Impossible de cr\xe9er l'objet Graphics");
            return;
        }
        // Fonction helper pour générer une texture seulement si elle n'existe pas
        const generateIfNotExists = (key, drawFunc)=>{
            try {
                if (!this.textures || !g) {
                    console.warn(`Syst\xe8me de textures ou Graphics non disponible pour ${key}`);
                    return;
                }
                if (this.textures.exists(key)) return; // Texture déjà existante, ne pas regénérer
                if (g.active === false || !g.clear) {
                    console.warn(`Graphics object d\xe9truit ou invalide, impossible de g\xe9n\xe9rer ${key}`);
                    return;
                }
                g.clear();
                drawFunc();
                // Vérifier que g est toujours valide avant de générer
                if (g && g.active !== false && g.generateTexture) g.generateTexture(key, T, T);
            } catch (e) {
                console.warn(`Erreur lors de la g\xe9n\xe9ration de la texture ${key}:`, e);
            }
        };
        // tile_grass_1
        generateIfNotExists("tile_grass_1", ()=>{
            g.fillStyle(0x2d8a3e, 1);
            g.fillRect(0, 0, T, T);
            for(let i = 0; i < 40; i++){
                g.fillStyle(0x3da850, 0.5);
                g.fillRect(Math.random() * T, Math.random() * T, 2, 2);
            }
        });
        // tile_grass_2
        generateIfNotExists("tile_grass_2", ()=>{
            g.fillStyle(0x267534, 1);
            g.fillRect(0, 0, T, T);
            for(let i = 0; i < 40; i++){
                g.fillStyle(0x3da850, 0.3);
                g.fillRect(Math.random() * T, Math.random() * T, 2, 2);
            }
        });
        // tile_path
        generateIfNotExists("tile_path", ()=>{
            g.fillStyle(0xdbb679, 1);
            g.fillRect(0, 0, T, T);
            g.fillStyle(0xbf9b5e, 0.6);
            for(let i = 0; i < 60; i++)g.fillRect(Math.random() * T, Math.random() * T, 3, 3);
            g.fillStyle(0xa88548, 0.8);
            g.fillRect(0, 0, T, 4);
            g.fillRect(0, T - 4, T, 4);
            g.fillRect(0, 0, 4, T);
            g.fillRect(T - 4, 0, 4, T);
        });
        // tile_base
        generateIfNotExists("tile_base", ()=>{
            g.fillStyle(0x333333, 1);
            g.fillRect(0, 0, T, T);
            g.lineStyle(3, 0x00ffff, 1);
            g.strokeRect(6, 6, T - 12, T - 12);
            g.fillStyle(0x00ffff, 0.5);
            g.fillCircle(T / 2, T / 2, 10);
        });
        // tile_water
        generateIfNotExists("tile_water", ()=>{
            g.fillStyle(0x4488ff, 1);
            g.fillRect(0, 0, T, T);
            g.lineStyle(2, 0xffffff, 0.3);
            g.beginPath();
            g.moveTo(10, 20);
            g.lineTo(25, 20);
            g.strokePath();
            g.beginPath();
            g.moveTo(40, 50);
            g.lineTo(55, 50);
            g.strokePath();
        });
        // tile_bridge
        generateIfNotExists("tile_bridge", ()=>{
            g.fillStyle(0x4488ff, 1);
            g.fillRect(0, 0, T, T);
            g.fillStyle(0x8b5a2b, 1);
            g.fillRect(4, 0, T - 8, T);
            g.lineStyle(2, 0x5c3a1e, 1);
            g.beginPath();
            g.moveTo(4, 16);
            g.lineTo(T - 4, 16);
            g.strokePath();
            g.beginPath();
            g.moveTo(4, 32);
            g.lineTo(T - 4, 32);
            g.strokePath();
            g.beginPath();
            g.moveTo(4, 48);
            g.lineTo(T - 4, 48);
            g.strokePath();
        });
        // tile_mountain
        generateIfNotExists("tile_mountain", ()=>{
            // Fond rocheux
            g.fillStyle(0x6b5b4f, 1);
            g.fillRect(0, 0, T, T);
            // Texture de roche
            g.fillStyle(0x5a4b3f, 0.8);
            for(let i = 0; i < 15; i++)g.fillRect(Math.random() * T, Math.random() * T, 3, 3);
            // Détails de roche plus clairs
            g.fillStyle(0x7b6b5f, 0.6);
            for(let i = 0; i < 8; i++)g.fillRect(Math.random() * T, Math.random() * T, 2, 2);
            // Bordure sombre
            g.lineStyle(1, 0x4a3d32, 0.5);
            g.strokeRect(0, 0, T, T);
        });
    // Ne pas détruire l'objet Graphics ici car il peut être réutilisé
    // Il sera nettoyé automatiquement par Phaser quand la scène est détruite
    }
    shutdown() {
        // Rendre shutdown() idempotent : safe si appelé plusieurs fois
        // Nettoyer tous les listeners d'input pour éviter les handlers sur objets détruits
        try {
            if (this.input) this.input.removeAllListeners();
            if (this.input && this.input.keyboard) this.input.keyboard.removeAllListeners();
        } catch (e) {
        // Ignorer si déjà nettoyé
        }
        // Nettoyer tous les objets avant de redémarrer la scène
        if (this.upgradeTextLines && this.upgradeTextLines.length > 0) {
            this.upgradeTextLines.forEach((line)=>{
                if (line && line.active !== false) try {
                    if (this.upgradeMenu && this.upgradeMenu.remove) this.upgradeMenu.remove(line);
                    if (line.destroy) line.destroy();
                } catch (e) {
                // Ignorer les erreurs
                }
            });
            this.upgradeTextLines = [];
        }
        if (this.placementPreview && this.placementPreview.active) {
            try {
                this.placementPreview.destroy();
            } catch (e) {
            // Ignorer
            }
            this.placementPreview = null;
        }
        if (this.validCellsPreview && this.validCellsPreview.length > 0) {
            this.validCellsPreview.forEach((cell)=>{
                if (cell && cell.active !== false) try {
                    cell.destroy();
                } catch (e) {
                // Ignorer
                }
            });
            this.validCellsPreview = [];
        }
        // Nettoyer les managers
        try {
            if (this.mapManager && this.mapManager.treePositions) this.mapManager.treePositions.clear();
            // Nettoyer le timer de vague automatique
            if (this.nextWaveAutoTimer) {
                this.nextWaveAutoTimer.remove();
                this.nextWaveAutoTimer = null;
            }
        } catch (e) {
        // Ignorer si déjà détruit
        }
        // Arrêter tous les timers
        try {
            if (this.time && this.time.removeAllEvents) this.time.removeAllEvents();
        } catch (e) {
        // Ignorer si déjà détruit
        }
        // Arrêter tous les tweens
        try {
            if (this.tweens && this.tweens.killAll) this.tweens.killAll();
        } catch (e) {
        // Ignorer si déjà détruit
        }
        // Nettoyer les groupes - VÉRIFIER QUE children EXISTE AVANT clear()
        try {
            if (this.enemies && this.enemies.children && this.enemies.children.size !== undefined) this.enemies.clear(true, true);
        } catch (e) {
        // Ignorer si le groupe est déjà détruit (children devient undefined)
        }
        try {
            if (this.soldiers && this.soldiers.children && this.soldiers.children.size !== undefined) this.soldiers.clear(true, true);
        } catch (e) {
        // Ignorer si le groupe est déjà détruit
        }
        // Nettoyer les tourelles et casernes
        if (this.turrets) {
            this.turrets.forEach((t)=>{
                if (t && t.active !== false) try {
                    t.destroy();
                } catch (e) {
                // Ignorer
                }
            });
            this.turrets = [];
        }
        if (this.barracks) {
            this.barracks.forEach((b)=>{
                if (b && b.active !== false) try {
                    b.destroy();
                } catch (e) {
                // Ignorer
                }
            });
            this.barracks = [];
        }
        // Détruire la toolbar et les menus
        try {
            if (this.buildToolbar && this.buildToolbar.destroy) this.buildToolbar.destroy(true);
        } catch (e) {
        // Ignorer si déjà détruit
        }
        this.buildToolbar = null;
        this.toolbarButtons = null;
        try {
            if (this.buildMenu && this.buildMenu.destroy) this.buildMenu.destroy(true);
        } catch (e) {
        // Ignorer si déjà détruit
        }
        this.buildMenu = null;
        try {
            if (this.upgradeMenu && this.upgradeMenu.destroy) this.upgradeMenu.destroy(true);
        } catch (e) {
        // Ignorer si déjà détruit
        }
        this.upgradeMenu = null;
        // Réinitialiser les variables d'état
        this.draggingTurret = null;
        this.selectedTurret = null;
        this.longPressTimer = null;
        this.txtMoney = null;
        this.txtLives = null;
        this.waveBtnContainer = null;
        this.waveBtnBg = null;
        this.waveBtnText = null;
    }
}

},{"../config/settings.js":"9kTMs","../config/levels/index.js":"8fcfE","../config/turrets/index.js":"97rhz","../objects/Enemy.js":"hW1Gp","../objects/Turret.js":"lbJGU","../objects/Barracks.js":"bSlQd","./managers/MapManager.js":"bYbwC","./managers/WaveManager.js":"bbCRa","./managers/UIManager.js":"1XDfq","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT","../sorts/lightning.js":"lqA3P"}],"97rhz":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "TURRETS", ()=>TURRETS);
var _machineGunJs = require("./machineGun.js");
var _sniperJs = require("./sniper.js");
var _cannonJs = require("./cannon.js");
var _zapJs = require("./zap.js");
var _barracksJs = require("./barracks.js");
const TURRETS = {
    machine_gun: (0, _machineGunJs.machine_gun),
    sniper: (0, _sniperJs.sniper),
    cannon: (0, _cannonJs.cannon),
    zap: (0, _zapJs.zap),
    barracks: (0, _barracksJs.barracks)
};

},{"./machineGun.js":"ecBws","./sniper.js":"fm2OQ","./cannon.js":"3RJPP","./zap.js":"bgZGw","./barracks.js":"9rF1d","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"hW1Gp":[function(require,module,exports,__globalThis) {
// On importe ENEMIES depuis settings.js car c'est là qu'on l'a regroupé
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Enemy", ()=>Enemy);
var _settingsJs = require("../config/settings.js");
class Enemy extends Phaser.GameObjects.Container {
    constructor(scene, path, typeKey){
        super(scene, -100, -100);
        this.scene = scene;
        this.path = path;
        this.typeKey = typeKey;
        // --- DEBUG & INIT ---
        if (!(0, _settingsJs.ENEMIES)) {
            console.error("ERREUR CRITIQUE : ENEMIES non charg\xe9.");
            return;
        }
        if (!(0, _settingsJs.ENEMIES)[typeKey]) {
            console.error(`ERREUR : Le type '${typeKey}' n'existe pas.`);
            this.stats = (0, _settingsJs.ENEMIES)["grunt"];
        } else this.stats = (0, _settingsJs.ENEMIES)[typeKey];
        // --- STATS ---
        this.hp = this.stats.hp;
        this.maxHp = this.stats.hp;
        this.speed = this.stats.speed;
        this.attackDamage = this.stats.damage || 10;
        this.attackSpeed = this.stats.attackSpeed || 1000;
        this.attackRange = this.stats.attackRange || 30;
        this.isRanged = this.stats.isRanged || false;
        this.facingRight = true;
        this.lastAttackTime = 0;
        this.targetSoldier = null;
        // --- ÉTATS SPÉCIAUX ---
        // Paralysie (Glace/Sorts)
        this.isParalyzed = false;
        this.paralysisTimer = null;
        this.originalSpeed = this.speed;
        this.paralysisOverlay = null;
        // Spawn (Sorcière)
        this.spawnTimer = null;
        this.lastSpawnTime = 0;
        // Tortue-Dragon : carapace
        this.isInShell = false;
        this.shellTimer = null;
        this.isInvulnerable = false;
        this.hasUsedShell = false; // Pour qu'elle ne le fasse qu'une fois
        this.shellThreshold = this.stats.shellThreshold || null;
        // Shaman Gobelin : soin
        this.lastHealTime = 0;
        this.healInterval = this.stats.healInterval || null;
        this.healAmount = this.stats.healAmount || 0;
        this.healRadius = this.stats.healRadius || 0;
        // --- LOGIQUE DE POSITIONNEMENT (Anti-Stacking) ---
        // Offset cible (là où l'ennemi veut aller sur la largeur du chemin)
        this.targetPathOffset = (Math.random() - 0.5) * 25;
        this.currentPathOffset = this.targetPathOffset;
        this.separationRadius = 22; // Rayon de "bulle" personnelle
        this.maxPathWidth = 25; // Limite pour ne pas sortir du chemin
        // États de mouvement
        this.isBlocked = false;
        this.blockedBy = null;
        // --- 1. VISUEL ---
        // Ombre
        const shadow = scene.add.ellipse(0, 15, 30, 10, 0x000000, 0.5);
        this.add(shadow);
        // Corps
        this.bodyGroup = scene.add.container(0, 0);
        this.add(this.bodyGroup);
        // Dessin personnalisé (Settings) ou Carré par défaut
        if (this.stats.onDraw) this.stats.onDraw(this.scene, this.bodyGroup, this.stats.color, this);
        else {
            const fallback = scene.add.rectangle(0, 0, 32, 32, this.stats.color || 0xffffff);
            this.bodyGroup.add(fallback);
        }
        // --- 2. BARRE DE VIE (CORRIGÉE) ---
        this.drawHealthBar(scene);
        // Initialisation Phaser
        this.scene.add.existing(this);
        this.follower = {
            t: 0,
            vec: new Phaser.Math.Vector2()
        };
        // Tooltip HP (Souris)
        this.hpTooltip = null;
        this.setSize(32, 32);
        this.setInteractive({
            useHandCursor: false
        });
        this.on("pointerover", ()=>{
            if (this.active) this.showHpTooltip();
        });
        this.on("pointerout", ()=>this.hideHpTooltip());
    }
    // =========================================================
    //                     BOUCLE PRINCIPALE
    // =========================================================
    update(time, delta) {
        if (this.isParalyzed) return;
        // Si dans la carapace (Tortue), on ne fait RIEN (pas de mouvement, pas d'attaque)
        if (this.isInShell) {
            // On continue juste l'animation visuelle pour l'effet de tremblement
            if (this.stats.onUpdateAnimation) this.stats.onUpdateAnimation(time, this);
            return;
        }
        // 1. Gestion des Spawns (Sorcière)
        if (this.stats.spawnInterval && this.active) {
            const currentTime = this.scene.time.now;
            if (currentTime - this.lastSpawnTime >= this.stats.spawnInterval) {
                this.spawnMinions();
                this.lastSpawnTime = currentTime;
            }
        }
        // 2. Gestion du Soin (Shaman)
        if (this.healInterval && this.active) {
            const currentTime = this.scene.time.now;
            if (currentTime - this.lastHealTime >= this.healInterval) {
                this.healNearbyEnemies();
                this.lastHealTime = currentTime;
            }
        }
        // 3. Ajustement de l'espacement (Anti-Stacking)
        this.adjustSpacing(delta);
        // 4. Animation Custom (Boss, Slimes, etc.)
        if (this.active && this.stats && this.stats.onUpdateAnimation) this.stats.onUpdateAnimation(time, this);
        // 5. Combat
        if (this.active && !this.isBlocked) this.updateCombat(time);
    }
    // =========================================================
    //                  MOUVEMENT & ESPACEMENT
    // =========================================================
    spawn() {
        if (!this.path) return;
        this.isBlocked = false;
        this.blockedBy = null;
        this.facingRight = true;
        // Initialisation des timers
        if (this.stats.spawnInterval) this.lastSpawnTime = this.scene.time.now;
        if (this.healInterval) this.lastHealTime = this.scene.time.now;
        if (this.bodyGroup) {
            this.bodyGroup.setScale(1, 1);
            this.bodyGroup.rotation = 0;
        }
        const pathLength = this.path.getLength();
        const duration = pathLength / this.speed * 1000;
        const tween = this.scene.tweens.add({
            targets: this.follower,
            t: 1,
            duration: duration,
            onUpdate: ()=>{
                // Si bloqué ou caché, on arrête le calcul de position sur le chemin
                if (this.isBlocked || this.isInShell) return;
                const p = this.path.getPoint(this.follower.t, this.follower.vec);
                // Calculer la normale pour appliquer l'offset latéral
                const nextT = Math.min(this.follower.t + 0.01, 1);
                const nextP = this.path.getPoint(nextT);
                const dx = nextP.x - p.x;
                const dy = nextP.y - p.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                // Appliquer l'offset dynamique
                if (length > 0) {
                    const perpX = -dy / length;
                    const perpY = dx / length;
                    const offsetX = perpX * this.currentPathOffset;
                    const offsetY = perpY * this.currentPathOffset;
                    this.setPosition(p.x + offsetX, p.y + offsetY);
                } else this.setPosition(p.x, p.y);
                // Gestion de la profondeur (Z-Index)
                const baseDepth = 10 + Math.floor(this.follower.t * 50);
                this.setDepth(baseDepth);
                // S'assurer que la barre de vie reste au-dessus
                if (this.hpBarContainer) this.hpBarContainer.setDepth(1000); // Toujours au-dessus du corps
                // Orientation (Flip) - Sauf pour les Boss qui ont shouldRotate=false
                if (this.stats.shouldRotate !== false) {
                    const absDx = Math.abs(dx);
                    const absDy = Math.abs(dy);
                    if (absDx > absDy * 0.3) {
                        const shouldFaceRight = dx > 0;
                        if (shouldFaceRight !== this.facingRight) {
                            this.facingRight = shouldFaceRight;
                            this.bodyGroup.setScale(this.facingRight ? 1 : -1, 1);
                        }
                    }
                }
                this.bodyGroup.rotation = 0;
            },
            onComplete: ()=>{
                if (this.active && !this.isBlocked) {
                    this.scene.takeDamage();
                    this.destroy();
                }
            }
        });
        this.follower.tween = tween;
    }
    adjustSpacing(delta) {
        if (!this.scene || !this.scene.enemies || !this.active || !this.path) return;
        let pushForce = 0;
        // Vecteur direction du chemin
        const t = this.follower.t;
        const pCurrent = this.path.getPoint(t);
        const pNext = this.path.getPoint(Math.min(t + 0.01, 1));
        const dirX = pNext.x - pCurrent.x;
        const dirY = pNext.y - pCurrent.y;
        const len = Math.sqrt(dirX * dirX + dirY * dirY);
        if (len === 0) return;
        // Vecteur Normal (perpendiculaire)
        const normX = -dirY / len;
        const normY = dirX / len;
        this.scene.enemies.children.each((other)=>{
            if (other === this || !other.active) return;
            const dist = Phaser.Math.Distance.Between(this.x, this.y, other.x, other.y);
            if (dist < this.separationRadius) {
                const dx = other.x - this.x;
                const dy = other.y - this.y;
                // Produit scalaire pour savoir si l'autre est à gauche ou droite
                const dot = dx * normX + dy * normY;
                if (dot > 0) pushForce -= 1.5;
                else pushForce += 1.5;
                if (Math.abs(dot) < 0.1 && dist < 5) pushForce += Math.random() > 0.5 ? 2 : -2;
            }
        });
        // Appliquer et limiter
        const speed = 0.8;
        this.targetPathOffset += pushForce * speed;
        this.targetPathOffset = Phaser.Math.Clamp(this.targetPathOffset, -this.maxPathWidth, this.maxPathWidth);
        this.currentPathOffset = Phaser.Math.Linear(this.currentPathOffset, this.targetPathOffset, 0.1);
    }
    // =========================================================
    //                  COMBAT & DÉGÂTS
    // =========================================================
    damage(amount) {
        // 1. Tortue-Dragon : Invulnérable si cachée
        if (this.isInvulnerable) return;
        this.hp -= amount;
        // Update Visuel
        if (this.hpTooltip) this.hpTooltip.setText(`${Math.ceil(this.hp)} / ${this.maxHp} HP`);
        if (this.bodyGroup) this.scene.tweens.add({
            targets: this.bodyGroup,
            alpha: 0.5,
            duration: 50,
            yoyo: true
        });
        this.updateHealthBar();
        // 2. Tortue-Dragon : Vérifier seuil pour entrer dans la carapace
        if (this.shellThreshold && !this.isInShell && !this.hasUsedShell) {
            const hpPercent = this.hp / this.maxHp;
            if (hpPercent <= this.shellThreshold) {
                this.enterShell();
                return; // On arrête là pour l'instant
            }
        }
        // 3. Mort
        if (this.hp <= 0) {
            // Gestion des bloquages
            if (this.isBlocked && this.blockedBy) this.blockedBy.releaseEnemy();
            if (this.isParalyzed) this.removeParalysis();
            // 4. Slimes / Diviseurs : Appel de la fonction onDeath définie dans settings.js
            if (this.stats.onDeath) this.stats.onDeath(this);
            this.hideHpTooltip();
            this.scene.earnMoney(this.stats.reward);
            this.explode();
            this.destroy();
        }
    }
    updateCombat(time) {
        if (this.isRanged) {
            this.findRangedTarget();
            if (this.targetSoldier && this.targetSoldier.active && this.targetSoldier.isAlive) {
                const dist = Phaser.Math.Distance.Between(this.x, this.y, this.targetSoldier.x, this.targetSoldier.y);
                const stopDist = 64 * (this.scene.scaleFactor || 1); // ~1 case
                if (dist <= this.attackRange) {
                    if (dist <= stopDist) {
                        // Pause pour tirer
                        if (this.follower.tween && !this.follower.tween.isPaused()) this.follower.tween.pause();
                        if (time - this.lastAttackTime >= this.attackSpeed) {
                            this.attackSoldierRanged(this.targetSoldier);
                            this.lastAttackTime = time;
                        }
                    } else // Avancer
                    if (this.follower.tween && this.follower.tween.isPaused()) this.follower.tween.resume();
                } else {
                    // Trop loin
                    if (this.follower.tween && this.follower.tween.isPaused()) this.follower.tween.resume();
                    this.targetSoldier = null;
                }
            } else if (this.follower.tween && this.follower.tween.isPaused()) this.follower.tween.resume();
        } else {
            // Mêlée
            if (this.isBlocked && this.blockedBy) {
                if (time - this.lastAttackTime >= this.attackSpeed) {
                    this.blockedBy.takeDamage(this.attackDamage);
                    this.lastAttackTime = time;
                }
            }
        }
    }
    findRangedTarget() {
        if (!this.scene || !this.scene.soldiers) return;
        const soldiers = this.scene.soldiers.getChildren();
        let closest = null;
        let minDist = this.attackRange;
        for (const soldier of soldiers)if (soldier.active && soldier.isAlive) {
            const dist = Phaser.Math.Distance.Between(this.x, this.y, soldier.x, soldier.y);
            if (dist <= this.attackRange && dist < minDist) {
                minDist = dist;
                closest = soldier;
            }
        }
        this.targetSoldier = closest;
    }
    attackSoldierRanged(soldier) {
        if (!soldier || !soldier.active || !soldier.isAlive) return;
        // Création projectile (Hache ou autre)
        const startX = this.x;
        const startY = this.y;
        const endX = soldier.x;
        const endY = soldier.y;
        const projectile = this.scene.add.graphics();
        projectile.fillStyle(0xffffff);
        projectile.fillCircle(0, 0, 4);
        projectile.setPosition(startX, startY);
        projectile.setDepth(100);
        this.scene.tweens.add({
            targets: projectile,
            x: endX,
            y: endY,
            duration: 400,
            onComplete: ()=>{
                if (soldier.active && soldier.isAlive) soldier.takeDamage(this.attackDamage);
                projectile.destroy();
            }
        });
    }
    // =========================================================
    //                  CAPACITÉS SPÉCIALES
    // =========================================================
    // --- TORTUE DRAGON ---
    enterShell() {
        if (this.isInShell) return;
        this.isInShell = true;
        this.isInvulnerable = true;
        this.hasUsedShell = true;
        if (this.follower.tween) this.follower.tween.pause();
        // Sortir après X ms (défini dans settings ou par défaut 3000)
        const duration = this.stats.shellDuration || 3000;
        this.shellTimer = this.scene.time.delayedCall(duration, ()=>{
            if (this.active) this.exitShell();
        });
    }
    exitShell() {
        if (!this.isInShell) return;
        this.isInShell = false;
        this.isInvulnerable = false;
        if (this.follower.tween && !this.isBlocked) this.follower.tween.resume();
    }
    // --- SHAMAN ---
    healNearbyEnemies() {
        if (!this.scene.enemies) return;
        // Conversion rayon cases -> pixels
        const tileSize = 64 * (this.scene.scaleFactor || 1);
        const radiusPixel = this.healRadius * tileSize; // Pour être sûr
        // Visuel
        const healEffect = this.scene.add.graphics();
        healEffect.lineStyle(2, 0x00ff00, 0.5);
        healEffect.strokeCircle(this.x, this.y, radiusPixel);
        healEffect.setDepth(5);
        this.scene.tweens.add({
            targets: healEffect,
            alpha: 0,
            scale: 1.2,
            duration: 500,
            onComplete: ()=>healEffect.destroy()
        });
        // Logique
        let hasHealed = false;
        this.scene.enemies.children.each((enemy)=>{
            if (enemy === this || !enemy.active || enemy.hp >= enemy.maxHp) return;
            const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
            if (dist <= radiusPixel) {
                enemy.hp = Math.min(enemy.hp + this.healAmount, enemy.maxHp);
                enemy.updateHealthBar();
                hasHealed = true;
                // Texte flottant
                const txt = this.scene.add.text(enemy.x, enemy.y - 40, `+${this.healAmount}`, {
                    fontSize: '16px',
                    fill: '#00ff00',
                    fontStyle: 'bold'
                }).setOrigin(0.5).setDepth(300);
                this.scene.tweens.add({
                    targets: txt,
                    y: enemy.y - 60,
                    alpha: 0,
                    duration: 800,
                    onComplete: ()=>txt.destroy()
                });
            }
        });
    }
    // --- SORCIÈRE ---
    spawnMinions() {
        if (!this.stats.spawnType) return;
        const spawnCount = this.stats.spawnCount || 3;
        const type = this.stats.spawnType;
        for(let i = 0; i < spawnCount; i++){
            const minion = new Enemy(this.scene, this.path, type);
            minion.follower.t = Math.max(0, this.follower.t - 0.05 - i * 0.02);
            const p = this.path.getPoint(minion.follower.t);
            minion.setPosition(p.x, p.y);
            minion.spawn();
            this.scene.enemies.add(minion);
        }
    }
    // =========================================================
    //                  UTILITAIRES & UI
    // =========================================================
    drawHealthBar(scene) {
        const yOffset = -50;
        const width = 40;
        const height = 6;
        // 1. On crée les rectangles
        this.hpBg = scene.add.rectangle(0, yOffset, width + 2, height + 2, 0x000000);
        this.hpBg.setStrokeStyle(1, 0xffffff);
        this.hpRed = scene.add.rectangle(0, yOffset, width, height, 0x330000);
        this.hpGreen = scene.add.rectangle(-width / 2, yOffset, width, height, 0x00ff00);
        this.hpGreen.setOrigin(0, 0.5);
        // 2. On les met dans un conteneur dédié à la barre de vie
        this.hpBarContainer = scene.add.container(0, 0);
        this.hpBarContainer.add([
            this.hpBg,
            this.hpRed,
            this.hpGreen
        ]);
        // 3. On ajoute ce conteneur à l'ennemi (this)
        this.add(this.hpBarContainer);
        // 4. FIX : Si l'ennemi a un scale (ex: 1.3), on INVERSE le scale de la barre (ex: 0.76)
        // Cela annule l'effet de grossissement, la barre garde sa taille d'origine.
        if (this.stats.scale && this.stats.scale !== 1) this.hpBarContainer.setScale(1 / this.stats.scale);
    }
    updateHealthBar() {
        const pct = Phaser.Math.Clamp(this.hp / this.maxHp, 0, 1);
        let newWidth = 40 * pct;
        if (this.hp > 0 && newWidth < 2) newWidth = 2;
        this.hpGreen.width = newWidth;
        if (pct < 0.25) this.hpGreen.fillColor = 0xff0000;
        else if (pct < 0.5) this.hpGreen.fillColor = 0xffa500;
        else this.hpGreen.fillColor = 0x00ff00;
    }
    showHpTooltip() {
        if (!this.active) return;
        if (this.hpTooltip) this.hpTooltip.destroy();
        const fontSize = Math.max(12, 14 * (this.scene.scaleFactor || 1));
        this.hpTooltip = this.scene.add.text(this.x, this.y - 60, `${Math.ceil(this.hp)} / ${this.maxHp} HP`, {
            fontSize: `${fontSize}px`,
            fill: "#ffffff",
            backgroundColor: "#000000",
            padding: {
                x: 8,
                y: 4
            }
        }).setOrigin(0.5).setDepth(300);
        if (this.tooltipUpdateTimer) this.tooltipUpdateTimer.remove();
        this.tooltipUpdateTimer = this.scene.time.addEvent({
            delay: 50,
            callback: ()=>{
                if (this.hpTooltip && this.active) {
                    this.hpTooltip.setPosition(this.x, this.y - 60);
                    this.hpTooltip.setText(`${Math.ceil(this.hp)} / ${this.maxHp} HP`);
                } else if (this.hpTooltip) this.hideHpTooltip();
            },
            loop: true
        });
    }
    hideHpTooltip() {
        if (this.hpTooltip) {
            this.hpTooltip.destroy();
            this.hpTooltip = null;
        }
        if (this.tooltipUpdateTimer) {
            this.tooltipUpdateTimer.remove();
            this.tooltipUpdateTimer = null;
        }
    }
    paralyze(duration) {
        if (this.isParalyzed) {
            if (this.paralysisTimer) this.paralysisTimer.remove();
        }
        this.isParalyzed = true;
        this.originalSpeed = this.speed;
        this.speed = 0;
        // Overlay visuel
        if (!this.paralysisOverlay) {
            this.paralysisOverlay = this.scene.add.graphics();
            this.paralysisOverlay.fillStyle(0x4444ff, 0.3);
            this.paralysisOverlay.fillCircle(0, 0, 25);
            this.add(this.paralysisOverlay);
        }
        if (this.follower.tween) this.follower.tween.pause();
        this.paralysisTimer = this.scene.time.delayedCall(duration, ()=>{
            if (this.active) this.removeParalysis();
        });
    }
    removeParalysis() {
        if (!this.isParalyzed) return;
        this.isParalyzed = false;
        this.speed = this.originalSpeed;
        if (this.paralysisOverlay) {
            this.paralysisOverlay.destroy();
            this.paralysisOverlay = null;
        }
        if (this.follower.tween && !this.isBlocked && !this.isInShell) this.follower.tween.resume();
    }
    explode() {
        for(let i = 0; i < 6; i++){
            const p = this.scene.add.rectangle(this.x, this.y, 8, 8, this.stats.color);
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 40 + 20;
            this.scene.tweens.add({
                targets: p,
                x: this.x + Math.cos(angle) * speed,
                y: this.y + Math.sin(angle) * speed,
                alpha: 0,
                scale: 0.2,
                duration: 400,
                onComplete: ()=>p.destroy()
            });
        }
    }
    destroy(fromScene) {
        if (this.paralysisTimer) this.paralysisTimer.remove();
        if (this.spawnTimer) this.spawnTimer.remove();
        if (this.shellTimer) this.shellTimer.remove();
        if (this.tooltipUpdateTimer) this.tooltipUpdateTimer.remove();
        if (this.hpTooltip) this.hpTooltip.destroy();
        if (this.paralysisOverlay) this.paralysisOverlay.destroy();
        super.destroy(fromScene);
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT","../config/settings.js":"9kTMs"}],"lbJGU":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Turret", ()=>Turret);
var _indexJs = require("../config/turrets/index.js");
class Turret extends Phaser.GameObjects.Container {
    constructor(scene, x, y, config){
        super(scene, x, y);
        this.scene = scene;
        // Clone de la config pour que chaque tourelle soit indépendante
        this.config = JSON.parse(JSON.stringify(typeof config === "string" ? (0, _indexJs.TURRETS)[config] : config));
        const originalConfig = typeof config === "string" ? (0, _indexJs.TURRETS)[config] : config;
        // On récupère les fonctions de dessin et de tir depuis la config originale
        this.config.onDrawBarrel = originalConfig.onDrawBarrel;
        this.config.onFire = originalConfig.onFire;
        // Valeur par défaut si maxLevel n'est pas défini dans la config
        // (Pour le cannon, c'est défini à 3 dans le fichier cannon.js)
        this.config.maxLevel = this.config.maxLevel || 3;
        this.level = 1;
        this.lastFired = 0;
        // --- VISUEL ---
        this.base = scene.add.graphics();
        this.drawBase();
        this.add(this.base);
        this.barrelGroup = scene.add.container(0, 0);
        this.add(this.barrelGroup);
        this.drawBarrel();
        // Portée
        this.rangeCircle = scene.add.circle(0, 0, this.config.range);
        this.rangeCircle.setStrokeStyle(2, 0xffffff, 0.3);
        this.rangeCircle.setVisible(false);
        this.sendToBack(this.rangeCircle);
        this.add(this.rangeCircle);
        this.setSize(64, 64);
        this.setInteractive();
        // --- GESTION DE LA PORTÉE VISUELLE ---
        this.on("pointerover", ()=>{
            this.rangeCircle.setVisible(true);
            // Correction : On inverse l'échelle du parent pour garder un cercle rond
            if (this.scaleX !== 0) this.rangeCircle.setScale(1 / this.scaleX);
        });
        this.on("pointerout", ()=>this.rangeCircle.setVisible(false));
        scene.add.existing(this);
    }
    drawBase() {
        this.base.clear();
        const color = this.level > 1 ? 0x554422 : 0x333333;
        // Socle principal
        this.base.fillStyle(color);
        this.base.fillCircle(0, 0, 24);
        this.base.lineStyle(2, 0x111111);
        this.base.strokeCircle(0, 0, 24);
        // Indicateurs visuels de niveau sur le socle
        if (this.level >= 2) {
            this.base.fillStyle(0xffff00); // Jaune pour niv 2
            this.base.fillCircle(-10, -18, 3);
        }
        if (this.level >= 3) {
            this.base.fillStyle(0x00ffff); // Cyan pour niv 3
            this.base.fillCircle(10, -18, 3);
        }
    }
    drawBarrel() {
        this.barrelGroup.removeAll(true);
        if (this.config.onDrawBarrel) this.config.onDrawBarrel(this.scene, this.barrelGroup, this.config.color, this);
    }
    // ============================================================
    // LOGIQUE D'AMÉLIORATION (MODIFIÉE POUR LE CANON NIV 3)
    // ============================================================
    getNextLevelStats() {
        // Si on a atteint le niveau max, pas d'upgrade
        if (this.level >= this.config.maxLevel) return null;
        // Utiliser les valeurs actuelles de la config
        let nextDmg = this.config.damage || 0;
        let nextRate = this.config.rate || 0;
        let nextRange = this.config.range || 0;
        let nextAoE = this.config.aoe || 0;
        // Coût de base récupéré depuis la config globale
        const baseCost = (0, _indexJs.TURRETS)[this.config.key]?.cost || 100;
        let cost = 0;
        // --- LOGIQUE SPÉCIFIQUE : PASSAGE AU NIVEAU 3 POUR LE CANON ---
        if (this.config.key === "cannon" && this.level === 2) {
            // C'est ici qu'on applique les stats "Jugement dernier"
            // 1. Dégâts x2.5
            nextDmg = Math.round(nextDmg * 2.5);
            // 2. Temps de rechargement fixée à 5 secondes (5000ms)
            // Contrairement aux autres upgrades qui réduisent le temps, celui-ci l'augmente massivement
            nextRate = 5000;
            // 3. AoE x1.1
            if (nextAoE > 0) nextAoE = Math.round(nextAoE * 1.1);
            // Portée augmente un peu
            nextRange = Math.round(nextRange * 1.2);
            // Coût très élevé pour cette arme ultime (x3 du coût précédent environ)
            cost = Math.floor(baseCost * 10);
        } else if (this.level === 1) {
            // Niv 1 -> 2 (Standard)
            nextDmg = Math.round(nextDmg * 1.5);
            nextRate = Math.round(nextRate / 1.2); // Tir plus vite
            nextRange = Math.round(nextRange * 1.2);
            if (nextAoE > 0) nextAoE = Math.round(nextAoE * 1.1);
            cost = Math.floor(baseCost * 2.5);
        } else if (this.level === 2) {
            // Niv 2 -> 3 (Standard pour les tourelles classiques)
            nextDmg = Math.round(nextDmg * 1.3);
            nextRate = Math.round(nextRate / 1.5); // Tir beaucoup plus vite
            nextRange = Math.round(nextRange * 1.1);
            if (nextAoE > 0) nextAoE = Math.round(nextAoE * 1.2);
            cost = Math.floor(baseCost * 5.5);
        }
        return {
            damage: nextDmg,
            rate: nextRate,
            range: nextRange,
            aoe: nextAoE > 0 ? nextAoE : undefined,
            cost: cost
        };
    }
    upgrade() {
        const nextStats = this.getNextLevelStats();
        if (!nextStats) return; // Sécurité
        this.level++;
        // Application des nouvelles stats
        this.config.damage = nextStats.damage;
        this.config.rate = nextStats.rate;
        this.config.range = nextStats.range;
        if (nextStats.aoe) this.config.aoe = nextStats.aoe;
        // Mise à jour visuelle du rayon
        this.rangeCircle.setRadius(this.config.range);
        // On force la mise à jour de l'échelle du cercle après l'upgrade
        if (this.scaleX !== 0) this.rangeCircle.setScale(1 / this.scaleX);
        // Redessiner le socle (ajoute le point de couleur) et le canon (change le skin)
        this.drawBase();
        this.drawBarrel();
        // Texte flottant "LEVEL UP"
        const txtContent = this.level >= this.config.maxLevel ? "MAX LEVEL!" : "LEVEL UP!";
        const txtColor = this.level === 3 ? "#00ffff" : "#ffff00"; // Bleu pour le niv 3
        const txt = this.scene.add.text(this.x, this.y - 40, txtContent, {
            fontSize: "20px",
            fontFamily: "Arial",
            fontStyle: "bold",
            color: txtColor,
            stroke: "#000000",
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(300);
        this.scene.tweens.add({
            targets: txt,
            y: this.y - 80,
            alpha: 0,
            duration: 1200,
            onComplete: ()=>txt.destroy()
        });
    }
    // Calculer le coût total déboursé (base + améliorations)
    getTotalCost() {
        const baseCost = (0, _indexJs.TURRETS)[this.config.key]?.cost || 100;
        let totalCost = baseCost;
        // Calculer les coûts des améliorations
        if (this.level >= 2) // Coût upgrade niveau 1 -> 2
        totalCost += Math.floor(baseCost * 2.5);
        if (this.level >= 3) {
            // Coût upgrade niveau 2 -> 3
            if (this.config.key === "cannon") totalCost += Math.floor(baseCost * 10);
            else totalCost += Math.floor(baseCost * 5.5);
        }
        return totalCost;
    }
    update(time, enemies) {
        // Si la tourelle a une 'rate' définie, on l'utilise, sinon valeur par défaut
        const rate = this.config.rate || 1000;
        if (time > this.lastFired) {
            const target = this.findTarget(enemies);
            if (target) {
                // Calcul de l'angle vers la cible
                const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
                // Rotation fluide du canon
                this.barrelGroup.rotation = Phaser.Math.Angle.RotateTo(this.barrelGroup.rotation, angle, 0.15 // Vitesse de rotation (un peu plus lent pour faire lourd)
                );
                // Si le canon est aligné (à +/- 0.5 radian près), on tire
                if (Math.abs(Phaser.Math.Angle.ShortestBetween(this.barrelGroup.rotation, angle)) < 0.5) {
                    this.fire(target);
                    // Mise à jour du prochain tir basé sur le 'rate' actuel
                    this.lastFired = time + rate;
                }
            }
        }
    }
    findTarget(enemies) {
        let nearest = null;
        let minDist = this.config.range;
        // Note: Distance.Between est en pixels Monde, indépendant du scale du container
        enemies.children.each((e)=>{
            if (e.active) {
                const d = Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y);
                if (d <= this.config.range && d < minDist) {
                    minDist = d;
                    nearest = e;
                }
            }
        });
        return nearest;
    }
    fire(target) {
        // Animation de recul du canon
        this.scene.tweens.add({
            targets: this.barrelGroup,
            x: -6 * Math.cos(this.barrelGroup.rotation),
            y: -6 * Math.sin(this.barrelGroup.rotation),
            duration: 60,
            yoyo: true,
            ease: "Quad.easeOut"
        });
        // Appel de la fonction de tir spécifique définie dans cannon.js (ou autre config)
        if (this.config.onFire) this.config.onFire(this.scene, this, target);
    }
}

},{"../config/turrets/index.js":"97rhz","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"bSlQd":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Barracks", ()=>Barracks);
var _indexJs = require("../config/turrets/index.js");
var _soldierJs = require("./Soldier.js");
class Barracks extends Phaser.GameObjects.Container {
    constructor(scene, x, y, config){
        super(scene, x, y);
        this.scene = scene;
        // Clone de la config
        this.config = JSON.parse(JSON.stringify(typeof config === "string" ? (0, _indexJs.TURRETS)[config] : config));
        const originalConfig = typeof config === "string" ? (0, _indexJs.TURRETS)[config] : config;
        this.config.onDrawBarrel = originalConfig.onDrawBarrel;
        this.level = 1;
        this.soldiers = [];
        this.deadSoldiers = [];
        // --- VISUEL ---
        this.base = scene.add.graphics();
        this.drawBase();
        this.add(this.base);
        this.barrelGroup = scene.add.container(0, 0);
        this.add(this.barrelGroup);
        this.drawBarrel();
        this.setSize(64, 64);
        this.setInteractive();
        // Highlight des soldats au hover
        this.on("pointerover", ()=>this.highlightSoldiers());
        this.on("pointerout", ()=>this.unhighlightSoldiers());
        scene.add.existing(this);
    }
    highlightSoldiers() {
        if (this.soldiers) this.soldiers.forEach((soldier)=>{
            if (soldier && soldier.active && soldier.isAlive) soldier.showHighlight();
        });
    }
    unhighlightSoldiers() {
        if (this.soldiers) this.soldiers.forEach((soldier)=>{
            if (soldier && soldier.active) soldier.hideHighlight();
        });
    }
    drawBase() {
        this.base.clear();
        const color = this.level > 1 ? 0x554422 : 0x333333;
        this.base.fillStyle(color);
        this.base.fillCircle(0, 0, 24);
        this.base.lineStyle(2, 0x111111);
        this.base.strokeCircle(0, 0, 24);
        if (this.level >= 2) {
            this.base.fillStyle(0xffff00);
            this.base.fillCircle(-10, -18, 3);
        }
        if (this.level >= 3) this.base.fillCircle(10, -18, 3);
    }
    drawBarrel() {
        this.barrelGroup.removeAll(true);
        if (this.config.onDrawBarrel) this.config.onDrawBarrel(this.scene, this.barrelGroup, this.config.color, this);
    }
    getNextLevelStats() {
        if (this.level >= this.config.maxLevel) return null;
        let cost = 0;
        const baseCost = (0, _indexJs.TURRETS)[this.config.key].cost;
        if (this.level === 1) cost = Math.floor(baseCost * 2.5);
        else if (this.level === 2) cost = Math.floor(baseCost * 5.5);
        return {
            cost: cost
        };
    }
    // Calculer le coût total déboursé (base + améliorations)
    getTotalCost() {
        const baseCost = (0, _indexJs.TURRETS)[this.config.key].cost;
        let totalCost = baseCost;
        // Calculer les coûts des améliorations
        if (this.level >= 2) totalCost += Math.floor(baseCost * 2.5);
        if (this.level >= 3) totalCost += Math.floor(baseCost * 5.5);
        return totalCost;
    }
    upgrade() {
        const nextStats = this.getNextLevelStats();
        if (!nextStats) return;
        this.level++;
        this.drawBase();
        this.drawBarrel();
        // Mettre à jour le niveau des soldats existants
        this.soldiers.forEach((soldier)=>{
            if (soldier && soldier.active) {
                soldier.updateLevel(this.level);
                soldier.maxHp = this.config.soldierHp[this.level - 1];
                soldier.hp = Math.min(soldier.hp, soldier.maxHp);
                soldier.updateHealthBar();
            }
        });
        // Recréer les soldats avec le nouveau niveau (pour ajouter les nouveaux)
        this.deploySoldiers();
        const txt = this.scene.add.text(this.x, this.y - 40, this.level >= this.config.maxLevel ? "MAX!" : "LEVEL UP!", {
            fontSize: "20px",
            fontStyle: "bold",
            color: "#ffff00",
            stroke: "#000",
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(200);
        this.scene.tweens.add({
            targets: txt,
            y: this.y - 80,
            alpha: 0,
            duration: 1000,
            onComplete: ()=>txt.destroy()
        });
    }
    // Déployer les soldats
    deploySoldiers() {
        // Supprimer les anciens soldats
        this.soldiers.forEach((soldier)=>{
            if (soldier && soldier.active) soldier.destroy();
        });
        this.soldiers = [];
        this.deadSoldiers = [];
        const count = this.config.soldiersCount[this.level - 1];
        const paths = this.scene.paths;
        const map = this.scene.levelConfig.map;
        const CONFIG = {
            TILE_SIZE: 64
        };
        const T = CONFIG.TILE_SIZE * (this.scene.scaleFactor || 1);
        // Utiliser mapStartX et mapStartY au lieu de MAP_OFFSET
        const mapStartX = this.scene.mapStartX || 0;
        const mapStartY = this.scene.mapStartY || 120 * (this.scene.scaleFactor || 1);
        // Trouver toutes les positions de chemin valides près du bâtiment
        const validPathPositions = [];
        // Chercher dans un rayon autour du bâtiment
        for(let y = 0; y < map.length; y++)for(let x = 0; x < map[y].length; x++){
            const tileType = map[y][x];
            if (tileType === 1 || tileType === 4) {
                const tileX = mapStartX + x * T + T / 2;
                const tileY = mapStartY + y * T + T / 2;
                const dist = Phaser.Math.Distance.Between(this.x, this.y, tileX, tileY);
                // Dans un rayon de 150 pixels
                if (dist <= 150 * (this.scene.scaleFactor || 1)) validPathPositions.push({
                    x: tileX,
                    y: tileY,
                    dist: dist
                });
            }
        }
        // Trier par distance
        validPathPositions.sort((a, b)=>a.dist - b.dist);
        // Espacer les soldats pour éviter qu'ils soient au même endroit
        const usedPositions = [];
        const minDistance = 30 * (this.scene.scaleFactor || 1); // Distance minimale entre soldats (augmentée)
        // Vérifier aussi les soldats des autres casernes
        const allExistingSoldiers = [];
        if (this.scene.soldiers) this.scene.soldiers.getChildren().forEach((soldier)=>{
            if (soldier && soldier.active && soldier.isAlive) allExistingSoldiers.push({
                x: soldier.x,
                y: soldier.y
            });
        });
        // Créer les soldats sur les positions valides les plus proches
        for(let i = 0; i < count && i < validPathPositions.length; i++){
            let pos = validPathPositions[i];
            let attempts = 0;
            const maxAttempts = 20;
            // Chercher une position qui respecte la distance minimale
            while(attempts < maxAttempts){
                let tooClose = false;
                // Vérifier avec les positions déjà utilisées dans cette caserne
                for (const used of usedPositions){
                    const dist = Phaser.Math.Distance.Between(pos.x, pos.y, used.x, used.y);
                    if (dist < minDistance) {
                        tooClose = true;
                        break;
                    }
                }
                // Vérifier avec les soldats des autres casernes
                if (!tooClose) for (const existing of allExistingSoldiers){
                    const dist = Phaser.Math.Distance.Between(pos.x, pos.y, existing.x, existing.y);
                    if (dist < minDistance) {
                        tooClose = true;
                        break;
                    }
                }
                if (!tooClose) break; // Position valide trouvée
                // Chercher une position alternative
                attempts++;
                if (attempts < maxAttempts) {
                    // Essayer différentes positions autour de la position de base
                    const angle = attempts / maxAttempts * Math.PI * 2;
                    const offset = minDistance * 0.9;
                    const newX = validPathPositions[i].x + Math.cos(angle) * offset;
                    const newY = validPathPositions[i].y + Math.sin(angle) * offset;
                    // Vérifier que c'est toujours sur un chemin
                    if (this.isPositionOnPath(newX, newY)) pos = {
                        x: newX,
                        y: newY,
                        dist: validPathPositions[i].dist
                    };
                    else // Si pas sur chemin, essayer la position suivante dans la liste
                    if (i + attempts < validPathPositions.length) pos = validPathPositions[i + attempts];
                }
            }
            // Si toujours trop proche après tous les essais, chercher dans les positions suivantes
            if (attempts >= maxAttempts) {
                let found = false;
                for(let j = i + 1; j < validPathPositions.length && j < i + 10; j++){
                    const testPos = validPathPositions[j];
                    let valid = true;
                    for (const used of usedPositions){
                        const dist = Phaser.Math.Distance.Between(testPos.x, testPos.y, used.x, used.y);
                        if (dist < minDistance) {
                            valid = false;
                            break;
                        }
                    }
                    if (valid) for (const existing of allExistingSoldiers){
                        const dist = Phaser.Math.Distance.Between(testPos.x, testPos.y, existing.x, existing.y);
                        if (dist < minDistance) {
                            valid = false;
                            break;
                        }
                    }
                    if (valid) {
                        pos = testPos;
                        found = true;
                        break;
                    }
                }
                // Si aucune position valide trouvée, utiliser quand même avec un décalage minimal
                if (!found) pos = {
                    x: validPathPositions[i].x + (Math.random() - 0.5) * 15,
                    y: validPathPositions[i].y + (Math.random() - 0.5) * 15,
                    dist: validPathPositions[i].dist
                };
            }
            usedPositions.push({
                x: pos.x,
                y: pos.y
            });
            const soldier = new (0, _soldierJs.Soldier)(this.scene, pos.x, pos.y, this);
            soldier.level = this.level; // Définir le niveau
            soldier.drawBody(); // Redessiner avec le bon niveau
            soldier.setScale(this.scene.scaleFactor || 1);
            // Mettre à jour les stats selon le niveau
            soldier.maxHp = this.config.soldierHp[this.level - 1];
            soldier.hp = soldier.maxHp;
            soldier.updateHealthBar();
            // S'assurer que le soldat est bien positionné sur le chemin
            soldier.deployToPath(this.scene.paths);
            // Animation d'apparition
            soldier.setScale(0);
            this.scene.tweens.add({
                targets: soldier,
                scale: this.scene.scaleFactor || 1,
                duration: 300,
                ease: "Back.easeOut"
            });
            this.soldiers.push(soldier);
            this.scene.soldiers.add(soldier);
        }
    }
    // Vérifier si une position est sur un chemin
    isPositionOnPath(x, y) {
        const CONFIG = {
            TILE_SIZE: 64
        };
        const T = CONFIG.TILE_SIZE * (this.scene.scaleFactor || 1);
        // Utiliser mapStartX et mapStartY au lieu de MAP_OFFSET
        const mapStartX = this.scene.mapStartX || 0;
        const mapStartY = this.scene.mapStartY || 120 * (this.scene.scaleFactor || 1);
        const tx = Math.floor((x - mapStartX) / T);
        const ty = Math.floor((y - mapStartY) / T);
        if (tx < 0 || tx >= 15 || ty < 0 || ty >= 15) return false;
        const map = this.scene.levelConfig.map;
        const tileType = map[ty][tx];
        return tileType === 1 || tileType === 4;
    }
    // Quand un soldat meurt
    onSoldierDied(soldier) {
        const index = this.soldiers.indexOf(soldier);
        if (index !== -1) {
            // Retirer de la liste active
            this.soldiers.splice(index, 1);
            // Ajouter à la liste des morts pour respawn
            this.deadSoldiers.push({
                soldier: soldier,
                deathTime: this.scene.time.now,
                respawnDelay: this.config.respawnTime[this.level - 1]
            });
        }
    }
    // Mettre à jour (gérer le respawn)
    update(time) {
        // Vérifier les soldats morts pour respawn
        for(let i = this.deadSoldiers.length - 1; i >= 0; i--){
            const dead = this.deadSoldiers[i];
            const elapsed = time - dead.deathTime;
            if (elapsed >= dead.respawnDelay) {
                // Respawn le soldat
                dead.soldier.respawn();
                dead.soldier.updateLevel(this.level); // Mettre à jour le design
                dead.soldier.maxHp = this.config.soldierHp[this.level - 1];
                dead.soldier.hp = dead.soldier.maxHp;
                dead.soldier.updateHealthBar();
                // Redéployer sur le chemin
                dead.soldier.deployToPath(this.scene.paths);
                // Remettre dans la liste active
                this.soldiers.push(dead.soldier);
                this.deadSoldiers.splice(i, 1);
            }
        }
    }
}

},{"../config/turrets/index.js":"97rhz","./Soldier.js":"4cBYc","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"4cBYc":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Soldier", ()=>Soldier);
class Soldier extends Phaser.GameObjects.Container {
    constructor(scene, x, y, barracks){
        super(scene, x, y);
        this.scene = scene;
        this.barracks = barracks;
        this.level = barracks ? barracks.level : 1;
        // Stats
        this.maxHp = 100;
        this.hp = this.maxHp;
        this.blockingEnemy = null; // L'ennemi actuellement bloqué
        this.isAlive = true;
        this.combatTimer = null;
        this.combatAnimationState = 0; // Pour l'animation de combat
        // Position sur le chemin
        this.pathPosition = null;
        this.pathIndex = 0;
        // --- VISUEL ---
        this.bodyGroup = scene.add.container(0, 0);
        this.add(this.bodyGroup);
        this.drawBody();
        // Barre de vie
        this.drawHealthBar();
        // Animation de combat
        this.combatGraphics = scene.add.graphics();
        this.combatGraphics.setVisible(false);
        this.add(this.combatGraphics);
        scene.add.existing(this);
        this.setDepth(15); // Au-dessus des ennemis
        // Tooltip HP - définir une zone interactive
        this.hpTooltip = null;
        this.setSize(32, 32); // Taille pour l'interactivité
        this.setInteractive({
            useHandCursor: false
        });
        this.on("pointerover", ()=>{
            if (this.active && this.isAlive) this.showHpTooltip();
        });
        this.on("pointerout", ()=>this.hideHpTooltip());
        // Highlight pour la caserne
        this.highlightCircle = null;
    }
    showHpTooltip() {
        if (!this.active || !this.isAlive) return;
        if (this.hpTooltip) this.hpTooltip.destroy();
        const fontSize = Math.max(12, 14 * (this.scene.scaleFactor || 1));
        this.hpTooltip = this.scene.add.text(this.x, this.y - 50, `${Math.max(0, this.hp)} / ${this.maxHp} HP`, {
            fontSize: `${fontSize}px`,
            fill: "#ffffff",
            fontStyle: "bold",
            backgroundColor: "#000000",
            padding: {
                x: 8,
                y: 4
            }
        }).setOrigin(0.5).setDepth(300);
        // Mettre à jour la position du tooltip en continu
        if (this.tooltipUpdateTimer) this.tooltipUpdateTimer.remove();
        this.tooltipUpdateTimer = this.scene.time.addEvent({
            delay: 50,
            callback: ()=>{
                if (this.hpTooltip && this.active && this.isAlive) {
                    this.hpTooltip.setPosition(this.x, this.y - 50);
                    this.hpTooltip.setText(`${Math.max(0, this.hp)} / ${this.maxHp} HP`);
                } else if (this.hpTooltip) this.hideHpTooltip();
            },
            loop: true
        });
    }
    hideHpTooltip() {
        if (this.hpTooltip) {
            this.hpTooltip.destroy();
            this.hpTooltip = null;
        }
        if (this.tooltipUpdateTimer) {
            this.tooltipUpdateTimer.remove();
            this.tooltipUpdateTimer = null;
        }
    }
    showHighlight() {
        if (this.highlightCircle) this.highlightCircle.destroy();
        this.highlightCircle = this.scene.add.circle(this.x, this.y, 20 * (this.scene.scaleFactor || 1), 0x00ffff, 0);
        this.highlightCircle.setStrokeStyle(2, 0x00ffff, 0.8);
        this.highlightCircle.setDepth(16);
        // Mettre à jour la position du highlight en continu
        this.highlightUpdateTimer = this.scene.time.addEvent({
            delay: 50,
            callback: ()=>{
                if (this.highlightCircle && this.active) this.highlightCircle.setPosition(this.x, this.y);
            },
            loop: true
        });
    }
    hideHighlight() {
        if (this.highlightCircle) {
            this.highlightCircle.destroy();
            this.highlightCircle = null;
        }
        if (this.highlightUpdateTimer) {
            this.highlightUpdateTimer.remove();
            this.highlightUpdateTimer = null;
        }
    }
    drawBody() {
        this.bodyGroup.removeAll(true);
        const g = this.scene.add.graphics();
        const level = this.level || 1;
        if (level === 1) {
            // === NIVEAU 1 : Recrue (Faible) ===
            // Corps simple en tissu
            g.fillStyle(0x8b7355); // Tissu marron
            g.fillRect(-7, -10, 14, 20);
            // Tête
            g.fillStyle(0xffdbac);
            g.fillCircle(0, -16, 5);
            // Chapeau simple
            g.fillStyle(0x654321);
            g.fillRect(-8, -18, 16, 4);
            // Arme simple (bâton/épée basique)
            g.fillStyle(0x666666);
            g.fillRect(7, -6, 2, 12);
            // Bras simples
            g.fillStyle(0x8b7355);
            g.fillRect(-9, -8, 5, 10);
            g.fillRect(4, -8, 5, 10);
        } else if (level === 2) {
            // === NIVEAU 2 : Soldat (Armure légère) ===
            // Corps avec armure
            g.fillStyle(0x4a4a4a); // Armure grise
            g.fillRect(-8, -11, 16, 22);
            g.lineStyle(1, 0x2a2a2a);
            g.strokeRect(-8, -11, 16, 22);
            // Tête
            g.fillStyle(0xffdbac);
            g.fillCircle(0, -17, 6);
            // Casque
            g.fillStyle(0x3a3a3a);
            g.fillRect(-9, -19, 18, 7);
            g.lineStyle(2, 0x1a1a1a);
            g.strokeRect(-9, -19, 18, 7);
            // Arme (épée)
            g.fillStyle(0x888888);
            g.fillRect(8, -7, 3, 14);
            g.fillStyle(0xcccccc);
            g.fillRect(8, -7, 3, 7);
            // Bras avec protection
            g.fillStyle(0x4a4a4a);
            g.fillRect(-10, -9, 6, 11);
            g.fillRect(4, -9, 6, 11);
            g.lineStyle(1, 0x2a2a2a);
            g.strokeRect(-10, -9, 6, 11);
            g.strokeRect(4, -9, 6, 11);
        } else {
            // === NIVEAU 3 : Vétéran (Armure lourde) ===
            // Corps avec armure lourde
            g.fillStyle(0x2a2a2a); // Armure sombre
            g.fillRect(-9, -12, 18, 24);
            g.lineStyle(2, 0x1a1a1a);
            g.strokeRect(-9, -12, 18, 24);
            // Détails d'armure
            g.fillStyle(0x3a3a3a);
            g.fillRect(-7, -10, 14, 4); // Plaque pectorale
            g.fillRect(-7, 8, 14, 4); // Plaque ventrale
            // Tête
            g.fillStyle(0xffdbac);
            g.fillCircle(0, -18, 6);
            // Casque lourd
            g.fillStyle(0x1a1a1a);
            g.fillRect(-10, -20, 20, 8);
            g.lineStyle(2, 0x4a4a4a);
            g.strokeRect(-10, -20, 20, 8);
            // Visière
            g.fillStyle(0x000000, 0.6);
            g.fillRect(-8, -18, 16, 2);
            // Arme (épée améliorée)
            g.fillStyle(0xaaaaaa);
            g.fillRect(9, -8, 4, 16);
            g.fillStyle(0xffffff);
            g.fillRect(9, -8, 4, 8);
            // Garde
            g.fillStyle(0x888888);
            g.fillRect(7, -6, 8, 2);
            // Bras avec armure complète
            g.fillStyle(0x2a2a2a);
            g.fillRect(-11, -10, 7, 12);
            g.fillRect(4, -10, 7, 12);
            g.lineStyle(2, 0x1a1a1a);
            g.strokeRect(-11, -10, 7, 12);
            g.strokeRect(4, -10, 7, 12);
            // Épaulières
            g.fillStyle(0x3a3a3a);
            g.fillCircle(-8, -10, 4);
            g.fillCircle(8, -10, 4);
        }
        this.bodyGroup.add(g);
    }
    // Mettre à jour le design selon le niveau
    updateLevel(newLevel) {
        this.level = newLevel;
        this.drawBody();
    }
    drawHealthBar() {
        const yOffset = -35;
        const width = 30;
        const height = 4;
        this.hpBg = this.scene.add.rectangle(0, yOffset, width + 2, height + 2, 0x000000);
        this.hpBg.setStrokeStyle(1, 0xffffff);
        this.hpRed = this.scene.add.rectangle(0, yOffset, width, height, 0x330000);
        this.hpGreen = this.scene.add.rectangle(-width / 2, yOffset, width, height, 0x00ff00);
        this.hpGreen.setOrigin(0, 0.5);
        this.add([
            this.hpBg,
            this.hpRed,
            this.hpGreen
        ]);
    }
    updateHealthBar() {
        const pct = Phaser.Math.Clamp(this.hp / this.maxHp, 0, 1);
        let newWidth = 30 * pct;
        if (this.hp > 0 && newWidth < 2) newWidth = 2;
        this.hpGreen.width = newWidth;
        if (pct < 0.25) this.hpGreen.fillColor = 0xff0000;
        else if (pct < 0.5) this.hpGreen.fillColor = 0xffa500;
        else this.hpGreen.fillColor = 0x00ff00;
    }
    // Vérifier si une position est sur un chemin (tile type 1 ou 4)
    isPositionOnPath(x, y) {
        const CONFIG = {
            TILE_SIZE: 64
        };
        const T = CONFIG.TILE_SIZE * (this.scene.scaleFactor || 1);
        // Utiliser mapStartX et mapStartY au lieu de MAP_OFFSET
        const mapStartX = this.scene.mapStartX || 0;
        const mapStartY = this.scene.mapStartY || 120 * (this.scene.scaleFactor || 1);
        // Convertir en coordonnées de tile
        const tx = Math.floor((x - mapStartX) / T);
        const ty = Math.floor((y - mapStartY) / T);
        // Vérifier les limites
        if (tx < 0 || tx >= 15 || ty < 0 || ty >= 15) return false;
        // Vérifier le type de tile (1 = chemin, 4 = pont)
        const map = this.scene.levelConfig.map;
        const tileType = map[ty][tx];
        return tileType === 1 || tileType === 4;
    }
    // Trouver la position sur le chemin le plus proche
    findPathPosition(paths) {
        if (!paths || paths.length === 0) return null;
        let closestPath = null;
        let closestPoint = null;
        let minDist = Infinity;
        let pathIndex = 0;
        paths.forEach((path, idx)=>{
            // Chercher le point le plus proche sur ce chemin
            for(let t = 0; t <= 1; t += 0.02){
                const point = path.getPoint(t);
                // Vérifier que le point est bien sur un chemin
                if (!this.isPositionOnPath(point.x, point.y)) continue;
                const dist = Phaser.Math.Distance.Between(this.x, this.y, point.x, point.y);
                if (dist < minDist) {
                    minDist = dist;
                    closestPath = path;
                    closestPoint = point;
                    pathIndex = idx;
                }
            }
        });
        if (closestPath && closestPoint && minDist < 200) {
            this.pathPosition = closestPath;
            this.pathIndex = pathIndex;
            return closestPoint;
        }
        return null;
    }
    // Placer le soldat sur le chemin (version simplifiée)
    deployToPath(paths) {
        if (!this.scene) return;
        // Si le soldat est déjà sur un chemin valide, ne rien faire
        if (this.isPositionOnPath(this.x, this.y)) return;
        // Chercher la position la plus proche sur un chemin
        const CONFIG = {
            TILE_SIZE: 64
        };
        const T = CONFIG.TILE_SIZE * (this.scene.scaleFactor || 1);
        const mapStartX = this.scene.mapStartX || 0;
        const mapStartY = this.scene.mapStartY || 120 * (this.scene.scaleFactor || 1);
        const map = this.scene.levelConfig.map;
        // Chercher la tile de chemin la plus proche
        let closestTile = null;
        let minTileDist = Infinity;
        for(let y = 0; y < map.length; y++)for(let x = 0; x < map[y].length; x++){
            const tileType = map[y][x];
            if (tileType === 1 || tileType === 4) {
                const tileX = mapStartX + x * T + T / 2;
                const tileY = mapStartY + y * T + T / 2;
                const dist = Phaser.Math.Distance.Between(this.x, this.y, tileX, tileY);
                if (dist < minTileDist) {
                    minTileDist = dist;
                    closestTile = {
                        x: tileX,
                        y: tileY
                    };
                }
            }
        }
        // Positionner le soldat sur la tile la plus proche trouvée
        if (closestTile) this.setPosition(closestTile.x, closestTile.y);
    }
    // Bloquer un ennemi
    blockEnemy(enemy) {
        if (!this.isAlive || this.blockingEnemy !== null) return false;
        if (enemy.isBlocked) return false; // L'ennemi est déjà bloqué par un autre soldat
        this.blockingEnemy = enemy;
        enemy.isBlocked = true;
        enemy.blockedBy = this;
        // Arrêter le mouvement de l'ennemi
        if (enemy.follower && enemy.follower.tween) enemy.follower.tween.pause();
        // Démarrer le combat
        this.startCombat(enemy);
        return true;
    }
    // Libérer l'ennemi bloqué
    releaseEnemy() {
        if (this.blockingEnemy) {
            const enemy = this.blockingEnemy;
            enemy.isBlocked = false;
            enemy.blockedBy = null;
            // Reprendre le mouvement si l'ennemi est encore vivant
            if (enemy.active && enemy.follower && enemy.follower.tween) enemy.follower.tween.resume();
            this.blockingEnemy = null;
        }
    }
    // Démarrer le combat
    startCombat(enemy) {
        if (this.combatTimer || !this.scene || !this.scene.time) return;
        this.combatGraphics.setVisible(true);
        // Animation de combat continue
        this.combatTimer = this.scene.time.addEvent({
            delay: 500,
            callback: ()=>{
                if (!this.isAlive || !enemy || !enemy.active || !this.blockingEnemy || enemy !== this.blockingEnemy) {
                    this.stopCombat();
                    if (enemy && !enemy.active) // L'ennemi est mort, libérer le soldat
                    this.releaseEnemy();
                    return;
                }
                // Le soldat attaque l'ennemi
                const soldierDamage = 15;
                if (enemy && typeof enemy.damage === 'function') enemy.damage(soldierDamage);
                // L'ennemi attaque le soldat avec ses propres dégâts
                const enemyDamage = enemy && enemy.attackDamage ? enemy.attackDamage : 10;
                this.takeDamage(enemyDamage);
                // Animation visuelle
                this.playCombatAnimation(enemy);
            },
            loop: true
        });
    }
    // Animation visuelle du combat
    playCombatAnimation(enemy) {
        if (!this.scene || !enemy) return;
        // Alterner l'animation de combat
        this.combatAnimationState = (this.combatAnimationState + 1) % 2;
        // Animation du soldat qui attaque
        if (this.combatAnimationState === 0 && this.scene && this.scene.tweens) {
            // Le soldat frappe vers l'avant
            this.scene.tweens.add({
                targets: this,
                x: this.x + Math.cos(Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y)) * 8,
                duration: 100,
                yoyo: true,
                ease: "Power2"
            });
            // Rotation de l'arme (épée)
            this.scene.tweens.add({
                targets: this.bodyGroup,
                rotation: 0.3,
                duration: 100,
                yoyo: true,
                ease: "Power2"
            });
        }
        // Flash sur le soldat
        if (this.scene && this.scene.tweens) this.bodyGroup.list.forEach((child)=>{
            if (child.setTint) this.scene.tweens.add({
                targets: child,
                tint: 0xffffff,
                duration: 50,
                yoyo: true,
                onComplete: ()=>{
                    if (child.clearTint) child.clearTint();
                    else child.setTint(0xffffff);
                }
            });
        });
        // Animation de l'ennemi qui recule
        if (this.scene && this.scene.tweens) this.scene.tweens.add({
            targets: enemy,
            x: enemy.x - Math.cos(Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y)) * 5,
            duration: 150,
            yoyo: true,
            ease: "Power2"
        });
        // Ligne d'attaque dynamique (épée qui frappe)
        this.combatGraphics.clear();
        const angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
        const startX = this.x + Math.cos(angle) * 10;
        const startY = this.y + Math.sin(angle) * 10;
        const endX = enemy.x;
        const endY = enemy.y;
        // Traînée d'épée
        this.combatGraphics.lineStyle(3, 0xffffff, 1);
        this.combatGraphics.lineBetween(startX, startY, endX, endY);
        this.combatGraphics.lineStyle(2, 0xffff00, 0.9);
        this.combatGraphics.lineBetween(startX, startY, endX, endY);
        // Disparition rapide
        if (this.scene && this.scene.tweens) this.scene.tweens.add({
            targets: this.combatGraphics,
            alpha: 0,
            duration: 150,
            onComplete: ()=>{
                if (this.combatGraphics) this.combatGraphics.clear();
            }
        });
        // Étincelles d'impact
        if (this.scene && this.scene.tweens) for(let i = 0; i < 8; i++){
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 30 + 15;
            const particle = this.scene.add.circle(endX + (Math.random() - 0.5) * 10, endY + (Math.random() - 0.5) * 10, Math.random() * 3 + 1, 0xffff00, 1);
            particle.setDepth(101);
            this.scene.tweens.add({
                targets: particle,
                x: particle.x + Math.cos(angle) * speed,
                y: particle.y + Math.sin(angle) * speed,
                alpha: 0,
                scale: 0,
                duration: 400,
                onComplete: ()=>{
                    if (particle && particle.active) particle.destroy();
                }
            });
        }
        // Flash d'impact sur l'ennemi
        if (enemy.bodyGroup && this.scene && this.scene.tweens) this.scene.tweens.add({
            targets: enemy.bodyGroup,
            alpha: 0.2,
            duration: 50,
            yoyo: true
        });
    }
    // Arrêter le combat
    stopCombat() {
        if (this.combatTimer) {
            this.combatTimer.remove();
            this.combatTimer = null;
        }
        this.combatGraphics.setVisible(false);
        this.combatGraphics.clear();
    }
    // Prendre des dégâts
    takeDamage(amount) {
        this.hp -= amount;
        // Mettre à jour le tooltip si visible
        if (this.hpTooltip) this.hpTooltip.setText(`${this.hp} / ${this.maxHp} HP`);
        // Flash rouge sur les enfants du bodyGroup
        if (this.scene && this.scene.tweens) this.bodyGroup.list.forEach((child)=>{
            if (child.setTint) this.scene.tweens.add({
                targets: child,
                tint: 0xff0000,
                duration: 100,
                yoyo: true,
                onComplete: ()=>{
                    if (child.clearTint) child.clearTint();
                    else child.setTint(0xffffff);
                }
            });
        });
        this.updateHealthBar();
        if (this.hp <= 0) {
            this.hideHpTooltip();
            this.hideHighlight();
            this.die();
        }
    }
    // Mourir
    die() {
        if (!this.isAlive) return;
        this.isAlive = false;
        this.stopCombat();
        this.releaseEnemy();
        // Animation de mort
        if (this.scene && this.scene.tweens) this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scale: 0,
            rotation: Math.PI,
            duration: 500,
            onComplete: ()=>{
                this.setVisible(false);
                // Le respawn sera géré par le barracks
                if (this.barracks) this.barracks.onSoldierDied(this);
            }
        });
        else {
            // Si la scène n'existe plus, juste cacher le soldat
            this.setVisible(false);
            if (this.barracks) this.barracks.onSoldierDied(this);
        }
    }
    // Ressusciter
    respawn() {
        if (!this.scene) return;
        this.hp = this.maxHp;
        this.isAlive = true;
        this.blockingEnemy = null;
        this.setVisible(true);
        this.setAlpha(1);
        this.setScale(this.scene.scaleFactor || 1);
        this.setRotation(0);
        this.updateHealthBar();
        // Redéployer sur le chemin (version simplifiée)
        this.deployToPath(this.scene.paths);
        // Animation de réapparition
        if (this.scene && this.scene.tweens) {
            this.setScale(0);
            this.scene.tweens.add({
                targets: this,
                scale: this.scene.scaleFactor || 1,
                duration: 300,
                ease: "Back.easeOut"
            });
        }
    }
    update() {
        // Vérifier si un ennemi passe à proximité
        if (this.isAlive && !this.blockingEnemy) {
            const enemies = this.scene.enemies.getChildren();
            for (const enemy of enemies)// Ne pas bloquer les ennemis à distance (throwers)
            if (enemy.active && !enemy.isBlocked && !enemy.isRanged) {
                const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
                if (dist < 30) {
                    this.blockEnemy(enemy);
                    break;
                }
            }
        }
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"bYbwC":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "MapManager", ()=>MapManager);
var _settingsJs = require("../../config/settings.js");
class MapManager {
    constructor(scene){
        this.scene = scene;
        this.treePositions = new Set();
        this.treeContainers = new Map(); // Stocker les containers d'arbres par position
        this.mountainPositions = new Set(); // Stocker les positions des montagnes
        this.mountainContainers = new Map(); // Stocker les containers de montagnes par position
    }
    createMap() {
        // Vérifier que levelConfig existe et a une map
        if (!this.scene.levelConfig || !this.scene.levelConfig.map) {
            console.error("levelConfig ou map est undefined");
            return;
        }
        const mapData = this.scene.levelConfig.map;
        const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scene.scaleFactor;
        for(let y = 0; y < mapData.length; y++)for(let x = 0; x < mapData[y].length; x++){
            const type = mapData[y][x];
            const px = this.scene.mapStartX + x * T;
            const py = this.scene.mapStartY + y * T;
            let key = "tile_grass_1";
            if (type === 0) key = (x + y) % 2 === 0 ? "tile_grass_2" : "tile_grass_1";
            if (type === 1) key = "tile_path";
            if (type === 2) key = "tile_base";
            if (type === 3) key = "tile_water";
            if (type === 4) key = "tile_bridge";
            if (type === 5) key = "tile_mountain"; // Nouveau type : montagne
            if (type === 9) key = "tile_grass_2";
            // Vérifier que la texture existe avant de l'utiliser
            if (!this.scene.textures.exists(key)) {
                console.warn(`Texture manquante: ${key}, utilisation d'une texture de secours`);
                key = "tile_grass_1"; // Fallback
            }
            const tile = this.scene.add.image(px, py, key).setOrigin(0, 0).setDepth(0);
            tile.setScale(this.scene.scaleFactor);
            if (type === 0) {
                const canPlaceBarracks = this.isAdjacentToPath(x, y);
                if (!canPlaceBarracks && Math.random() < 0.3) {
                    this.addTree(px, py, x, y);
                    this.treePositions.add(`${x},${y}`);
                } else if (canPlaceBarracks && Math.random() < 0.1) {
                    this.addTree(px, py, x, y);
                    this.treePositions.add(`${x},${y}`);
                }
            }
        }
        // Détecter et créer les grandes montagnes (groupes 3x3)
        this.detectAndCreateLargeMountains();
        this.createPaths();
    }
    // Détecter les groupes 3x3 de montagnes et créer une grande montagne
    detectAndCreateLargeMountains() {
        const mapData = this.scene.levelConfig.map;
        const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scene.scaleFactor;
        const processedTiles = new Set(); // Pour éviter de traiter plusieurs fois les mêmes tiles
        // Parcourir toutes les tiles
        for(let y = 0; y < mapData.length - 2; y++){
            for(let x = 0; x < mapData[y].length - 2; x++)// Vérifier si c'est le coin supérieur gauche d'un groupe 3x3 de montagnes
            if (this.is3x3MountainGroup(mapData, x, y, processedTiles)) {
                // Créer une grande montagne qui couvre les 3x3 tiles
                const centerX = x + 1;
                const centerY = y + 1;
                const px = this.scene.mapStartX + centerX * T + T / 2;
                const py = this.scene.mapStartY + centerY * T + T / 2;
                this.addLargeMountain(px, py, centerX, centerY);
                // Marquer toutes les tiles du groupe 3x3 comme traitées
                for(let dy = 0; dy < 3; dy++)for(let dx = 0; dx < 3; dx++){
                    processedTiles.add(`${x + dx},${y + dy}`);
                    this.mountainPositions.add(`${x + dx},${y + dy}`);
                }
            }
        }
    }
    // Vérifier si un groupe 3x3 est composé uniquement de montagnes (type 5)
    is3x3MountainGroup(mapData, startX, startY, processedTiles) {
        // Vérifier que toutes les 9 tiles sont de type 5 (montagne) et non déjà traitées
        for(let dy = 0; dy < 3; dy++)for(let dx = 0; dx < 3; dx++){
            const x = startX + dx;
            const y = startY + dy;
            const key = `${x},${y}`;
            // Vérifier les limites
            if (y < 0 || y >= mapData.length || x < 0 || x >= mapData[y].length) return false;
            // Vérifier que ce n'est pas déjà traité
            if (processedTiles.has(key)) return false;
            // Vérifier que c'est bien une montagne (type 5)
            if (mapData[y][x] !== 5) return false;
        }
        return true;
    }
    // Créer une grande montagne visuelle (3x3 tiles)
    addLargeMountain(px, py, tileX, tileY) {
        const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scene.scaleFactor;
        const scale = this.scene.scaleFactor;
        const mountain = this.scene.add.container(px, py);
        mountain.setDepth(1); // Au-dessus des tiles mais sous les arbres
        const g = this.scene.add.graphics();
        const size = T * 1.5; // Taille de la grande montagne (couvre 3x3)
        // Base de la montagne (forme triangulaire arrondie plus grande)
        g.fillStyle(0x6b5b4f); // Marron/gris pour la roche
        g.beginPath();
        g.moveTo(-size * 0.5, size * 0.3);
        g.lineTo(-size * 0.3, -size * 0.1);
        g.lineTo(0, -size * 0.4);
        g.lineTo(size * 0.3, -size * 0.1);
        g.lineTo(size * 0.5, size * 0.3);
        g.lineTo(size * 0.4, size * 0.4);
        g.lineTo(-size * 0.4, size * 0.4);
        g.closePath();
        g.fillPath();
        // Ombre pour la profondeur
        g.fillStyle(0x4a3d32, 0.6);
        g.beginPath();
        g.moveTo(-size * 0.4, size * 0.35);
        g.lineTo(-size * 0.2, size * 0.15);
        g.lineTo(0, -size * 0.3);
        g.lineTo(size * 0.2, size * 0.15);
        g.lineTo(size * 0.4, size * 0.35);
        g.lineTo(size * 0.3, size * 0.4);
        g.lineTo(-size * 0.3, size * 0.4);
        g.closePath();
        g.fillPath();
        // Détails de roche (texture) - plus nombreux pour une grande montagne
        g.fillStyle(0x5a4b3f, 0.8);
        for(let i = 0; i < 20; i++){
            const angle = i / 20 * Math.PI * 2;
            const dist = (Math.random() * 0.4 + 0.1) * size;
            const x = Math.cos(angle) * dist;
            const y = Math.sin(angle) * dist * 0.5;
            g.fillCircle(x, y, 4 * scale);
        }
        // Plusieurs sommets pour une montagne plus imposante
        g.fillStyle(0x8b7d6f);
        // Sommet principal
        g.beginPath();
        g.moveTo(-size * 0.15, -size * 0.35);
        g.lineTo(0, -size * 0.5);
        g.lineTo(size * 0.15, -size * 0.35);
        g.lineTo(0, -size * 0.25);
        g.closePath();
        g.fillPath();
        // Sommets secondaires
        g.fillStyle(0x7b6d5f);
        g.beginPath();
        g.moveTo(-size * 0.35, -size * 0.2);
        g.lineTo(-size * 0.25, -size * 0.3);
        g.lineTo(-size * 0.15, -size * 0.25);
        g.lineTo(-size * 0.2, -size * 0.15);
        g.closePath();
        g.fillPath();
        g.beginPath();
        g.moveTo(size * 0.35, -size * 0.2);
        g.lineTo(size * 0.25, -size * 0.3);
        g.lineTo(size * 0.15, -size * 0.25);
        g.lineTo(size * 0.2, -size * 0.15);
        g.closePath();
        g.fillPath();
        // Grands rochers autour de la base
        g.fillStyle(0x5a4b3f);
        g.fillCircle(-size * 0.4, size * 0.25, 6 * scale);
        g.fillCircle(size * 0.4, size * 0.25, 6 * scale);
        g.fillCircle(-size * 0.25, size * 0.3, 5 * scale);
        g.fillCircle(size * 0.25, size * 0.3, 5 * scale);
        g.fillCircle(0, size * 0.35, 4 * scale);
        // Bordure pour plus de définition
        g.lineStyle(3 * scale, 0x4a3d32, 0.5);
        g.strokePath();
        mountain.add(g);
        // Stocker le container pour référence
        const key = `${tileX},${tileY}`;
        this.mountainContainers.set(key, mountain);
    }
    createPaths() {
        const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scene.scaleFactor;
        const H = T / 2;
        this.scene.paths = [];
        const rawPaths = this.scene.levelConfig.paths || [
            this.scene.levelConfig.path
        ];
        rawPaths.forEach((points)=>{
            const newPath = new Phaser.Curves.Path();
            newPath.moveTo(this.scene.mapStartX + points[0].x * T + H, this.scene.mapStartY + points[0].y * T + H);
            for(let i = 1; i < points.length; i++)newPath.lineTo(this.scene.mapStartX + points[i].x * T + H, this.scene.mapStartY + points[i].y * T + H);
            this.scene.paths.push(newPath);
        });
    }
    addTree(px, py, tileX, tileY) {
        const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scene.scaleFactor;
        const treeX = px + T / 2 + (Math.random() - 0.5) * 15 * this.scene.scaleFactor;
        const treeY = py + T / 2 + (Math.random() - 0.5) * 15 * this.scene.scaleFactor;
        const tree = this.scene.add.container(treeX, treeY);
        tree.setDepth(2);
        const g = this.scene.add.graphics();
        const treeType = Math.floor(Math.random() * 3);
        const scale = this.scene.scaleFactor;
        if (treeType === 0) {
            g.fillStyle(0x8b4513);
            g.fillRect(-2 * scale, 0, 4 * scale, 12 * scale);
            g.fillStyle(0x2d5016);
            g.fillCircle(0, -5 * scale, 10 * scale);
            g.fillStyle(0x3a6b1f);
            g.fillCircle(0, -5 * scale, 8 * scale);
            g.fillStyle(0x4a7a2f);
            g.fillCircle(0, -5 * scale, 6 * scale);
        } else if (treeType === 1) {
            g.fillStyle(0x654321);
            g.fillRect(-3 * scale, 0, 6 * scale, 15 * scale);
            g.fillStyle(0x1a4d1a);
            g.fillCircle(-5 * scale, -8 * scale, 8 * scale);
            g.fillCircle(5 * scale, -8 * scale, 8 * scale);
            g.fillCircle(0, -12 * scale, 10 * scale);
            g.fillStyle(0x2d6b2d);
            g.fillCircle(-5 * scale, -8 * scale, 6 * scale);
            g.fillCircle(5 * scale, -8 * scale, 6 * scale);
            g.fillCircle(0, -12 * scale, 8 * scale);
        } else {
            g.fillStyle(0x5c4033);
            g.fillRect(-4 * scale, 0, 8 * scale, 18 * scale);
            g.fillStyle(0x2d5016);
            g.fillCircle(-8 * scale, -10 * scale, 12 * scale);
            g.fillCircle(8 * scale, -10 * scale, 12 * scale);
            g.fillCircle(0, -15 * scale, 14 * scale);
            g.fillStyle(0x3a6b1f);
            g.fillCircle(-8 * scale, -10 * scale, 10 * scale);
            g.fillCircle(8 * scale, -10 * scale, 10 * scale);
            g.fillCircle(0, -15 * scale, 12 * scale);
            g.fillStyle(0x4a7a2f);
            g.fillCircle(0, -15 * scale, 8 * scale);
        }
        tree.add(g);
        // Stocker le container pour pouvoir le supprimer plus tard
        const key = `${tileX},${tileY}`;
        this.treeContainers.set(key, tree);
    }
    removeTree(tileX, tileY) {
        const key = `${tileX},${tileY}`;
        const tree = this.treeContainers.get(key);
        if (tree) {
            tree.destroy();
            this.treeContainers.delete(key);
            this.treePositions.delete(key);
            return true;
        }
        return false;
    }
    isAdjacentToPath(tx, ty) {
        const map = this.scene.levelConfig.map;
        const directions = [
            {
                x: 0,
                y: -1
            },
            {
                x: 0,
                y: 1
            },
            {
                x: -1,
                y: 0
            },
            {
                x: 1,
                y: 0
            }
        ];
        for (const dir of directions){
            const nx = tx + dir.x;
            const ny = ty + dir.y;
            if (nx >= 0 && nx < 15 && ny >= 0 && ny < 15) {
                const tileType = map[ny][nx];
                if (tileType === 1 || tileType === 4) return true;
            }
        }
        return false;
    }
    hasTree(tileX, tileY) {
        return this.treePositions.has(`${tileX},${tileY}`);
    }
}

},{"../../config/settings.js":"9kTMs","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"bbCRa":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "WaveManager", ()=>WaveManager);
var _enemyJs = require("../../objects/Enemy.js");
class WaveManager {
    constructor(scene){
        this.scene = scene;
    }
    startWave() {
        if (this.scene.isWaveRunning) return;
        if (this.scene.currentWaveIndex >= this.scene.levelConfig.waves.length) return;
        // Ne pas démarrer une vague si le jeu est en pause
        if (this.scene.isPaused) return;
        // Annuler le timer automatique si présent
        if (this.scene.nextWaveAutoTimer) {
            this.scene.nextWaveAutoTimer.remove();
            this.scene.nextWaveAutoTimer = null;
            this.scene.nextWaveCountdown = 0;
        }
        // Nettoyer les anciens timers de spawn
        if (this.scene.waveSpawnTimers) {
            this.scene.waveSpawnTimers.forEach((timer)=>{
                if (timer && timer.remove) timer.remove();
            });
            this.scene.waveSpawnTimers = [];
        }
        this.scene.isWaveRunning = true;
        this.scene.waveBtnText.setText("\u26A0\uFE0F EN COURS");
        this.scene.waveBtnBg.setStrokeStyle(3, 0xffaa00);
        const waveGroups = this.scene.levelConfig.waves[this.scene.currentWaveIndex];
        let totalEnemiesInWave = 0;
        let spawnedTotal = 0;
        waveGroups.forEach((g)=>totalEnemiesInWave += g.count);
        waveGroups.forEach((group)=>{
            const spawnTimer = this.scene.time.addEvent({
                delay: group.interval,
                repeat: group.count - 1,
                callback: ()=>{
                    // Ne pas spawner si le jeu est en pause
                    if (this.scene.isPaused) return;
                    const randomPath = Phaser.Utils.Array.GetRandom(this.scene.paths);
                    const enemy = new (0, _enemyJs.Enemy)(this.scene, randomPath, group.type);
                    enemy.setDepth(10);
                    enemy.setScale(this.scene.scaleFactor);
                    enemy.spawn();
                    this.scene.enemies.add(enemy);
                    spawnedTotal++;
                    if (spawnedTotal >= totalEnemiesInWave) this.monitorWaveEnd();
                }
            });
            // Stocker le timer pour pouvoir le mettre en pause
            this.scene.waveSpawnTimers.push(spawnTimer);
        });
    }
    monitorWaveEnd() {
        this.scene.endCheckTimer = this.scene.time.addEvent({
            delay: 500,
            loop: true,
            callback: ()=>{
                // Ne pas vérifier si le jeu est en pause
                if (this.scene.isPaused) return;
                if (this.scene.enemies.getLength() === 0) this.finishWave();
            }
        });
    }
    finishWave() {
        if (this.scene.endCheckTimer) this.scene.endCheckTimer.remove();
        this.scene.isWaveRunning = false;
        this.scene.currentWaveIndex++;
        this.scene.earnMoney(50 + this.scene.currentWaveIndex * 20);
        // Mettre à jour l'affichage de la vague
        this.scene.updateUI();
        if (this.scene.currentWaveIndex >= this.scene.levelConfig.waves.length) this.levelComplete();
        else // Démarrer le timer automatique de 30 secondes
        this.startNextWaveCountdown();
    }
    startNextWaveCountdown() {
        // Annuler un timer existant si présent
        if (this.scene.nextWaveAutoTimer) this.scene.nextWaveAutoTimer.remove();
        this.scene.nextWaveCountdown = 30; // 30 secondes
        this.updateWaveButtonText();
        // Mettre à jour le bouton toutes les secondes
        this.scene.nextWaveAutoTimer = this.scene.time.addEvent({
            delay: 1000,
            repeat: 30,
            callback: ()=>{
                // Ne pas décrémenter si le jeu est en pause
                if (this.scene.isPaused) return;
                this.scene.nextWaveCountdown--;
                this.updateWaveButtonText();
                // Si le compte à rebours arrive à 0, lancer automatiquement
                if (this.scene.nextWaveCountdown <= 0) {
                    if (this.scene.nextWaveAutoTimer) {
                        this.scene.nextWaveAutoTimer.remove();
                        this.scene.nextWaveAutoTimer = null;
                    }
                    this.scene.nextWaveCountdown = 0;
                    // Lancer la vague directement (pas via waveManager.startWave() pour éviter la récursion)
                    this.startWave();
                }
            }
        });
    }
    updateWaveButtonText() {
        if (!this.scene.waveBtnText) return;
        const nextWaveNum = this.scene.currentWaveIndex + 1;
        if (this.scene.nextWaveCountdown > 0) {
            // Afficher le compte à rebours
            this.scene.waveBtnText.setText(`\u{25B6} VAGUE ${nextWaveNum} (${this.scene.nextWaveCountdown}s)`);
            this.scene.waveBtnBg.setStrokeStyle(3, 0x00ff00);
        } else {
            // État normal
            this.scene.waveBtnText.setText(`\u{25B6} LANCER VAGUE ${nextWaveNum}`);
            this.scene.waveBtnBg.setStrokeStyle(3, 0x00ff00);
        }
    }
    levelComplete() {
        const currentSaved = parseInt(localStorage.getItem("levelReached")) || 1;
        if (this.scene.levelID >= currentSaved) localStorage.setItem("levelReached", this.scene.levelID + 1);
        const bg = this.scene.add.rectangle(this.scene.gameWidth / 2, this.scene.gameHeight / 2, 500 * this.scene.scaleFactor, 300 * this.scene.scaleFactor, 0x000000, 0.9).setDepth(200);
        const txt = this.scene.add.text(this.scene.gameWidth / 2, this.scene.gameHeight / 2 - 30 * this.scene.scaleFactor, "VICTOIRE !", {
            fontSize: `${Math.max(30, 50 * this.scene.scaleFactor)}px`,
            color: "#00ff00",
            fontStyle: "bold"
        }).setOrigin(0.5).setDepth(201);
        const sub = this.scene.add.text(this.scene.gameWidth / 2, this.scene.gameHeight / 2 + 50 * this.scene.scaleFactor, "Continuer", {
            fontSize: `${Math.max(16, 24 * this.scene.scaleFactor)}px`
        }).setOrigin(0.5).setDepth(201);
        bg.setInteractive({
            useHandCursor: true
        }).on("pointerdown", ()=>this.scene.scene.start("MainMenuScene"));
    }
}

},{"../../objects/Enemy.js":"hW1Gp","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"1XDfq":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "UIManager", ()=>UIManager);
var _settingsJs = require("../../config/settings.js");
var _indexJs = require("../../config/turrets/index.js");
var _barracksJs = require("../../objects/Barracks.js");
class UIManager {
    constructor(scene){
        this.scene = scene;
        this.currentTooltip = null; // Tooltip actuellement affiché
        // Text lines (upgrade menu)
        this.scene.upgradeTextLines = [];
        // Build buttons cache (for easy refresh affordability)
        this.buildButtons = [];
    }
    // ------------------------------------------------------------
    // UI ROOT
    // ------------------------------------------------------------
    createUI() {
        const s = this.scene.scaleFactor;
        const UI_HEIGHT = (0, _settingsJs.CONFIG).UI_HEIGHT * s;
        const fontSize = Math.max(16, 24 * s);
        const smallFontSize = Math.max(12, 18 * s);
        // Top bar
        const topBar = this.scene.add.container(0, 0).setDepth(100);
        const bgBar = this.scene.add.graphics();
        bgBar.fillStyle(0x111111, 1);
        bgBar.fillRect(0, 0, this.scene.gameWidth, UI_HEIGHT);
        bgBar.fillStyle(0x00ccff, 0.5);
        bgBar.fillRect(0, UI_HEIGHT - 2 * s, this.scene.gameWidth, 2 * s);
        topBar.add(bgBar);
        this.scene.txtMoney = this.scene.add.text(20 * s, UI_HEIGHT / 2, "", {
            fontSize: `${fontSize}px`,
            fill: "#ffd700",
            fontStyle: "bold",
            fontFamily: "Arial"
        }).setOrigin(0, 0.5);
        topBar.add(this.scene.txtMoney);
        this.scene.txtLives = this.scene.add.text(250 * s, UI_HEIGHT / 2, "", {
            fontSize: `${fontSize}px`,
            fill: "#ff4444",
            fontStyle: "bold",
            fontFamily: "Arial"
        }).setOrigin(0, 0.5);
        topBar.add(this.scene.txtLives);
        // Affichage de la vague actuelle
        this.scene.txtWave = this.scene.add.text(350 * s, UI_HEIGHT / 2, "", {
            fontSize: `${fontSize}px`,
            fill: "#00ccff",
            fontStyle: "bold",
            fontFamily: "Arial"
        }).setOrigin(0, 0.5);
        topBar.add(this.scene.txtWave);
        // Bouton Pause/Reprendre (plus à droite pour ne pas écraser la vague)
        this.scene.pauseBtn = this.scene.add.text(600 * s, UI_HEIGHT / 2, "\u23F8\uFE0F PAUSE", {
            fontSize: `${smallFontSize}px`,
            fill: "#ffaa00",
            backgroundColor: "#333333",
            padding: {
                x: 10 * s,
                y: 5 * s
            },
            fontFamily: "Arial"
        }).setOrigin(0, 0.5).setInteractive({
            useHandCursor: true
        }).on("pointerover", ()=>{
            if (!this.scene.isPaused) this.scene.pauseBtn.setColor("#ffcc00");
        }).on("pointerout", ()=>{
            if (!this.scene.isPaused) this.scene.pauseBtn.setColor("#ffaa00");
        }).on("pointerdown", ()=>{
            // Le bouton pause dans la toolbar met toujours en pause
            if (!this.scene.isPaused) this.scene.pauseGame();
        // Pour reprendre, on utilise le bouton au centre de l'écran
        });
        topBar.add(this.scene.pauseBtn);
        const quitBtn = this.scene.add.text(this.scene.gameWidth - 20 * s, UI_HEIGHT / 2, "QUITTER", {
            fontSize: `${smallFontSize}px`,
            fill: "#aaaaaa",
            backgroundColor: "#333333",
            padding: {
                x: 10 * s,
                y: 5 * s
            },
            fontFamily: "Arial"
        }).setOrigin(1, 0.5).setInteractive({
            useHandCursor: true
        }).on("pointerover", ()=>quitBtn.setColor("#ffffff")).on("pointerout", ()=>quitBtn.setColor("#aaaaaa")).on("pointerdown", ()=>this.scene.scene.start("MainMenuScene"));
        topBar.add(quitBtn);
        this.scene.updateUI();
        // Wave button - Positionné à droite, au même niveau que la toolbar
        const btnWidth = 300 * s;
        const btnHeight = 60 * s;
        const toolbarHeight = 120 * s;
        const margin = 20 * s;
        // Calculer la position pour être aligné avec les autres sections
        const itemSize = 80 * s;
        const itemSpacing = 90 * s;
        const spellSectionWidth = itemSize + margin * 2;
        const turretsSectionWidth = 5 * itemSpacing;
        const totalWidth = spellSectionWidth + turretsSectionWidth + btnWidth + margin * 4;
        const startX = (this.scene.gameWidth - totalWidth) / 2;
        // Positionner à droite, aligné avec les autres sections
        const waveSectionX = startX + spellSectionWidth + turretsSectionWidth + margin * 3;
        const wy = this.scene.toolbarOffsetY + toolbarHeight / 2; // Centré verticalement dans la toolbar
        // Section du bouton de vague avec fond
        this.scene.waveSection = this.scene.add.container(waveSectionX, this.scene.toolbarOffsetY).setDepth(150);
        const waveSectionBg = this.scene.add.graphics();
        waveSectionBg.fillStyle(0x000000, 0.9);
        waveSectionBg.fillRoundedRect(0, 0, btnWidth + margin * 2, toolbarHeight, 10);
        waveSectionBg.lineStyle(3, 0xffffff, 0.6);
        waveSectionBg.strokeRoundedRect(0, 0, btnWidth + margin * 2, toolbarHeight, 10);
        this.scene.waveSection.add(waveSectionBg);
        this.scene.waveBtnContainer = this.scene.add.container(margin + btnWidth / 2, toolbarHeight / 2).setDepth(151);
        this.scene.waveBtnBg = this.scene.add.rectangle(0, 0, btnWidth, btnHeight, 0x000000, 0.8).setStrokeStyle(3 * s, 0x00ff00);
        this.scene.waveBtnText = this.scene.add.text(0, 0, "\u25B6 LANCER VAGUE 1", {
            fontSize: `${Math.max(16, 22 * s)}px`,
            fill: "#ffffff",
            fontStyle: "bold",
            fontFamily: "Arial"
        }).setOrigin(0.5);
        this.scene.waveBtnContainer.add([
            this.scene.waveBtnBg,
            this.scene.waveBtnText
        ]);
        this.scene.waveSection.add(this.scene.waveBtnContainer);
        // Interactivité simple sur le bouton
        this.scene.waveBtnBg.setInteractive({
            useHandCursor: true
        }).on("pointerdown", ()=>this.scene.startWave());
        // Menus
        this.createBuildMenu();
        this.createUpgradeMenu();
    // Le menu de confirmation d'arbre sera créé à la demande
    }
    // ------------------------------------------------------------
    // BUILD MENU (Right click)
    // - Simple grid layout with octagonal turret icons
    // - Names below in small text
    // ------------------------------------------------------------
    createBuildMenu() {
        const s = this.scene.scaleFactor;
        this.buildButtons = [];
        this.scene.buildMenu = this.scene.add.container(0, 0).setVisible(false).setDepth(240);
        const menuWidth = 300 * s;
        const menuHeight = 250 * s;
        const pad = 20 * s;
        const { bg, headerLine } = this.createPanelBackground(menuWidth, menuHeight, {
            fill: 0x0f0f1a,
            fillAlpha: 0.98,
            shadowAlpha: 0.5,
            stroke: 0x00ccff,
            strokeAlpha: 1,
            innerStroke: 0x0066aa,
            innerAlpha: 0.6,
            radius: 16,
            headerY: 40 * s
        });
        const title = this.scene.add.text(menuWidth / 2, 20 * s, "CONSTRUIRE", {
            fontSize: `${Math.max(16, 18 * s)}px`,
            fill: "#00ccff",
            fontStyle: "bold",
            stroke: "#003366",
            strokeThickness: Math.max(2, 2 * s),
            fontFamily: "Arial"
        }).setOrigin(0.5).setDepth(241);
        this.scene.buildMenu.add([
            bg,
            headerLine,
            title
        ]);
        const turrets = [
            (0, _indexJs.TURRETS).machine_gun,
            (0, _indexJs.TURRETS).sniper,
            (0, _indexJs.TURRETS).cannon,
            (0, _indexJs.TURRETS).zap,
            (0, _indexJs.TURRETS).barracks
        ];
        // Grille 3x2 (3 colonnes, 2 lignes) pour mieux accommoder 5 tourelles
        const cols = 3;
        const rows = 2;
        const octagonSize = 45 * s;
        const spacingX = (menuWidth - pad * 2) / cols;
        const spacingY = 75 * s;
        const startX = pad + spacingX / 2;
        const startY = 55 * s;
        turrets.forEach((cfg, i)=>{
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * spacingX;
            const y = startY + row * spacingY;
            const btn = this.createBuildBtnOctagon(x, y, octagonSize, cfg);
            this.scene.buildMenu.add(btn);
            this.buildButtons.push(btn);
        });
        // Store menu geometry (used in openBuildMenu clamp)
        this.scene._buildMenuSize = {
            w: menuWidth,
            h: menuHeight
        };
    }
    // Fonction pour dessiner un octogone
    drawOctagon(graphics, x, y, radius, fillColor, fillAlpha, strokeColor, strokeWidth) {
        graphics.clear();
        graphics.fillStyle(fillColor, fillAlpha);
        graphics.lineStyle(strokeWidth, strokeColor, 1);
        const sides = 8;
        const angleStep = Math.PI * 2 / sides;
        graphics.beginPath();
        for(let i = 0; i <= sides; i++){
            const angle = i * angleStep - Math.PI / 2; // Commencer en haut
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            if (i === 0) graphics.moveTo(px, py);
            else graphics.lineTo(px, py);
        }
        graphics.closePath();
        graphics.fillPath();
        graphics.strokePath();
    }
    createBuildBtnOctagon(x, y, size, turretConfig) {
        const s = this.scene.scaleFactor;
        const radius = size / 2;
        const btn = this.scene.add.container(x, y).setDepth(241);
        // Octogone de fond
        const octagonBg = this.scene.add.graphics();
        this.drawOctagon(octagonBg, 0, 0, radius, 0x1a1a2e, 0.96, 0x00ccff, Math.max(2, 2 * s));
        // Zone interactive (cercle pour simplifier)
        const hitArea = this.scene.add.circle(0, 0, radius + 5 * s, 0x000000, 0);
        hitArea.setInteractive({
            useHandCursor: true
        });
        // Miniature de la tourelle
        const previewContainer = this.scene.add.container(0, 0);
        if (this.scene.drawTurretPreview) {
            this.scene.drawTurretPreview(previewContainer, turretConfig);
            previewContainer.setScale(0.35 * s); // Plus petit pour rentrer dans l'octogone
        }
        // Nom en petit en dessous
        const nameText = this.scene.add.text(0, radius + 8 * s, turretConfig.name, {
            fontSize: `${Math.max(10, 11 * s)}px`,
            fill: "#ffffff",
            fontFamily: "Arial"
        }).setOrigin(0.5);
        // Prix en très petit
        const costText = this.scene.add.text(0, radius + 18 * s, `${turretConfig.cost}$`, {
            fontSize: `${Math.max(9, 10 * s)}px`,
            fill: "#ffd700",
            fontFamily: "Arial"
        }).setOrigin(0.5);
        btn.add([
            octagonBg,
            hitArea,
            previewContainer,
            nameText,
            costText
        ]);
        // Keep refs for refresh
        btn.turretConfig = turretConfig;
        btn.octagonBg = octagonBg;
        btn.nameText = nameText;
        btn.costText = costText;
        btn.previewContainer = previewContainer;
        btn.hitArea = hitArea;
        btn.radius = radius; // Stocker le radius pour la mise à jour
        // Initial state
        this.applyBuildBtnStateOctagon(btn);
        // Hover states
        hitArea.on("pointerover", ()=>{
            const canAfford = this.scene.money >= turretConfig.cost;
            const isBarracksMaxed = turretConfig.key === "barracks" && this.scene.barracks.length >= this.scene.maxBarracks;
            if (!canAfford || isBarracksMaxed) return;
            this.drawOctagon(octagonBg, 0, 0, radius, 0x2a2a4e, 1, 0x00ffff, Math.max(3, 3 * s));
            nameText.setColor("#ffffff");
            costText.setColor("#ffff00");
            // Afficher le tooltip avec la description
            if (turretConfig.description) this.showTurretTooltip(btn, turretConfig.description, hitArea);
        });
        hitArea.on("pointerout", ()=>{
            this.applyBuildBtnStateOctagon(btn);
            // Cacher le tooltip
            if (this.currentTooltip) {
                this.currentTooltip.destroy();
                this.currentTooltip = null;
            }
        });
        hitArea.on("pointerdown", ()=>{
            // Cacher le tooltip lors du clic
            if (this.currentTooltip) {
                this.currentTooltip.destroy();
                this.currentTooltip = null;
            }
            if (!this.scene.selectedTile) return;
            const canAfford = this.scene.money >= turretConfig.cost;
            const isBarracksMaxed = turretConfig.key === "barracks" && this.scene.barracks.length >= this.scene.maxBarracks;
            if (!canAfford || isBarracksMaxed) {
                this.scene.cameras.main.shake(50, 0.005);
                return;
            }
            const success = this.scene.buildTurret(turretConfig, this.scene.selectedTile.x, this.scene.selectedTile.y);
            if (success) this.scene.buildMenu.setVisible(false);
            this.updateBuildMenuButtons();
        });
        return btn;
    }
    // Afficher un tooltip avec la description de la tourelle
    showTurretTooltip(btnContainer, description, triggerElement) {
        const s = this.scene.scaleFactor;
        // Détruire l'ancien tooltip s'il existe
        if (this.currentTooltip) this.currentTooltip.destroy();
        // Calculer la position du tooltip (à droite du bouton)
        const btnX = btnContainer.x + (this.scene.buildMenu.x || 0);
        const btnY = btnContainer.y + (this.scene.buildMenu.y || 0);
        // Créer le tooltip
        const tooltipContainer = this.scene.add.container(0, 0).setDepth(300);
        this.currentTooltip = tooltipContainer;
        // Fond du tooltip
        const tooltipBg = this.scene.add.graphics();
        const padding = 15 * s;
        const maxWidth = 350 * s;
        const lineHeight = 20 * s;
        // Calculer la taille du texte
        const tempText = this.scene.add.text(0, 0, description, {
            fontSize: `${Math.max(11, 12 * s)}px`,
            fill: "#ffffff",
            fontFamily: "Arial",
            wordWrap: {
                width: maxWidth - padding * 2
            },
            lineSpacing: 4 * s
        });
        const textWidth = Math.min(tempText.width, maxWidth - padding * 2);
        const textHeight = tempText.height;
        tempText.destroy();
        const tooltipWidth = textWidth + padding * 2;
        const tooltipHeight = textHeight + padding * 2;
        // Positionner le tooltip à droite du bouton
        const tooltipX = btnX + 60 * s;
        const tooltipY = btnY;
        // Dessiner le fond
        tooltipBg.fillStyle(0x000000, 0.95);
        tooltipBg.fillRoundedRect(0, 0, tooltipWidth, tooltipHeight, 8);
        tooltipBg.lineStyle(2, 0x00ccff, 1);
        tooltipBg.strokeRoundedRect(0, 0, tooltipWidth, tooltipHeight, 8);
        // Texte de description
        const descText = this.scene.add.text(padding, padding, description, {
            fontSize: `${Math.max(11, 12 * s)}px`,
            fill: "#ffffff",
            fontFamily: "Arial",
            wordWrap: {
                width: maxWidth - padding * 2
            },
            lineSpacing: 4 * s
        });
        tooltipContainer.add([
            tooltipBg,
            descText
        ]);
        tooltipContainer.setPosition(tooltipX, tooltipY);
        // Ajuster la position si le tooltip sort de l'écran
        if (tooltipX + tooltipWidth > this.scene.gameWidth) tooltipContainer.setX(btnX - tooltipWidth - 10 * s);
        if (tooltipY + tooltipHeight > this.scene.gameHeight) tooltipContainer.setY(this.scene.gameHeight - tooltipHeight - 10 * s);
    }
    applyBuildBtnStateOctagon(btnContainer) {
        const s = this.scene.scaleFactor;
        const cfg = btnContainer.turretConfig;
        const canAfford = this.scene.money >= cfg.cost;
        let isDisabled = false;
        if (cfg.key === "barracks") isDisabled = this.scene.barracks.length >= this.scene.maxBarracks;
        const shouldDisable = !canAfford || isDisabled;
        const radius = btnContainer.radius || 50 * s / 2;
        if (btnContainer.nameText) {
            btnContainer.nameText.setColor(shouldDisable ? "#666666" : "#ffffff");
            btnContainer.nameText.setAlpha(shouldDisable ? 0.6 : 1);
        }
        if (btnContainer.costText) {
            btnContainer.costText.setColor(shouldDisable ? "#ff4444" : "#ffd700");
            btnContainer.costText.setAlpha(shouldDisable ? 0.7 : 1);
        }
        if (btnContainer.octagonBg) {
            const fillColor = shouldDisable ? 0x0f0f0f : 0x1a1a2e;
            const fillAlpha = shouldDisable ? 0.6 : 0.96;
            const strokeColor = shouldDisable ? 0x444444 : 0x00ccff;
            const strokeWidth = Math.max(2, 2 * s);
            this.drawOctagon(btnContainer.octagonBg, 0, 0, radius, fillColor, fillAlpha, strokeColor, strokeWidth);
            btnContainer.octagonBg.setAlpha(shouldDisable ? 0.5 : 1);
            if (shouldDisable) btnContainer.hitArea?.disableInteractive();
            else btnContainer.hitArea?.setInteractive({
                useHandCursor: true
            });
        }
        if (btnContainer.previewContainer) btnContainer.previewContainer.setAlpha(shouldDisable ? 0.4 : 1);
    }
    applyBuildBtnState(btnContainer) {
        // Ancienne méthode pour compatibilité, mais on utilise maintenant applyBuildBtnStateOctagon
        this.applyBuildBtnStateOctagon(btnContainer);
    }
    updateBuildMenuButtons() {
        // Use our cache, but also supports old list style if needed
        const buttons = this.buildButtons?.length > 0 ? this.buildButtons : this.scene.buildMenu?.list?.filter((x)=>x?.turretConfig) || [];
        buttons.forEach((btn)=>{
            if (btn.octagonBg) this.applyBuildBtnStateOctagon(btn);
            else this.applyBuildBtnState(btn);
        });
    }
    openBuildMenu(pointer) {
        const s = this.scene.scaleFactor;
        const T = (0, _settingsJs.CONFIG).TILE_SIZE * s;
        const tx = Math.floor((pointer.worldX - this.scene.mapStartX) / T);
        const ty = Math.floor((pointer.worldY - this.scene.mapStartY) / T);
        this.scene.selectedTile = {
            x: tx,
            y: ty
        };
        this.scene.selectedTileIsAdjacentToPath = this.scene.mapManager.isAdjacentToPath(tx, ty);
        const { w: menuWidth, h: menuHeight } = this.scene._buildMenuSize || {
            w: 360 * s,
            h: 310 * s
        };
        let menuX = pointer.worldX;
        let menuY = pointer.worldY;
        // Clamp to screen
        if (menuX + menuWidth / 2 > this.scene.gameWidth) menuX = this.scene.gameWidth - menuWidth / 2 - 10 * s;
        if (menuX - menuWidth / 2 < 0) menuX = menuWidth / 2 + 10 * s;
        if (menuY + menuHeight / 2 > this.scene.gameHeight) menuY = this.scene.gameHeight - menuHeight / 2 - 10 * s;
        if (menuY - menuHeight / 2 < 0) menuY = menuHeight / 2 + 10 * s;
        this.scene.buildMenu.setPosition(menuX - menuWidth / 2, menuY - menuHeight / 2);
        this.scene.buildMenu.setVisible(true);
        this.updateBuildMenuButtons();
    }
    // ------------------------------------------------------------
    // UPGRADE MENU (kept close to your logic, but cleaned safety)
    // ------------------------------------------------------------
    createUpgradeMenu() {
        const s = this.scene.scaleFactor;
        this.scene.upgradeMenu = this.scene.add.container(0, 0).setVisible(false).setDepth(240);
        const menuWidth = 320 * s;
        const menuHeight = 220 * s;
        const uBgGraphics = this.scene.add.graphics();
        uBgGraphics.fillStyle(0x222222, 0.95);
        uBgGraphics.fillRoundedRect(0, 0, menuWidth, menuHeight, 10);
        uBgGraphics.lineStyle(3, 0xffffff, 0.3);
        uBgGraphics.strokeRoundedRect(0, 0, menuWidth, menuHeight, 10);
        this.scene.upgradeMenu.add(uBgGraphics);
        this.scene.upgradeInfoText = null;
        this.scene.upgradeBtnText = this.scene.add.text(15 * s, 170 * s, "AM\xc9LIORER", {
            fontSize: `${Math.max(14, 18 * s)}px`,
            fill: "#ffffff",
            fontStyle: "bold",
            backgroundColor: "#00aa00",
            padding: {
                x: 15 * s,
                y: 8 * s
            },
            fontFamily: "Arial"
        }).setDepth(241).setInteractive({
            useHandCursor: true
        }).on("pointerover", ()=>{
            const nextStats = this.scene.selectedTurret?.getNextLevelStats?.();
            const canAfford = nextStats && this.scene.money >= nextStats.cost;
            if (nextStats && canAfford) this.scene.upgradeBtnText.setBackgroundColor("#00cc00");
        }).on("pointerout", ()=>{
            const nextStats = this.scene.selectedTurret?.getNextLevelStats?.();
            const canAfford = nextStats && this.scene.money >= nextStats.cost;
            const hasNext = !!nextStats;
            if (hasNext && canAfford) this.scene.upgradeBtnText.setBackgroundColor("#00aa00");
            else this.scene.upgradeBtnText.setBackgroundColor("#666666");
        }).on("pointerdown", ()=>{
            const nextStats = this.scene.selectedTurret?.getNextLevelStats?.();
            const canAfford = nextStats && this.scene.money >= nextStats.cost;
            if (nextStats && canAfford) this.scene.triggerUpgrade();
            else if (!nextStats) {
                this.scene.upgradeMenu.setVisible(false);
                this.scene.selectedTurret = null;
            } else // Pas assez d'argent
            this.scene.cameras.main.shake(50, 0.005);
        });
        this.scene.upgradeMenu.add(this.scene.upgradeBtnText);
        // Icône poubelle pour revendre (en haut à droite)
        this.scene.trashIcon = this.createTrashIcon(menuWidth, s);
        this.scene.upgradeMenu.add(this.scene.trashIcon);
    }
    createTrashIcon(menuWidth, s) {
        const trashIcon = this.scene.add.graphics();
        const trashSize = 20 * s;
        const trashX = menuWidth - 30 * s;
        const trashY = 15 * s;
        const drawTrash = (color = 0xff0000)=>{
            trashIcon.clear();
            trashIcon.fillStyle(color, 1);
            trashIcon.fillRect(trashX - trashSize / 2, trashY - trashSize / 2, trashSize, trashSize * 0.8);
            trashIcon.fillStyle(0xcc0000, 1);
            trashIcon.fillRect(trashX - trashSize / 2 + 2 * s, trashY - trashSize / 2 + 2 * s, trashSize - 4 * s, trashSize * 0.6);
            // Couvercle
            trashIcon.fillStyle(color, 1);
            trashIcon.fillRect(trashX - trashSize / 2 - 2 * s, trashY - trashSize / 2 - 3 * s, trashSize + 4 * s, 4 * s);
            // Poignées
            trashIcon.fillStyle(0xffffff, 1);
            trashIcon.fillRect(trashX - trashSize / 2 - 4 * s, trashY - trashSize / 2 + 2 * s, 2 * s, 6 * s);
            trashIcon.fillRect(trashX + trashSize / 2 + 2 * s, trashY - trashSize / 2 + 2 * s, 2 * s, 6 * s);
        };
        drawTrash();
        trashIcon.setDepth(241);
        trashIcon.setInteractive(new Phaser.Geom.Rectangle(trashX - trashSize / 2 - 4 * s, trashY - trashSize / 2 - 3 * s, trashSize + 8 * s, trashSize + 6 * s), Phaser.Geom.Rectangle.Contains);
        trashIcon.setInteractive({
            useHandCursor: true
        });
        trashIcon.on("pointerover", ()=>{
            drawTrash(0xff4444);
        });
        trashIcon.on("pointerout", ()=>{
            drawTrash();
        });
        trashIcon.on("pointerdown", ()=>{
            if (!this.scene.selectedTurret) return;
            const totalCost = this.scene.selectedTurret.getTotalCost();
            const refund = Math.floor(totalCost / 2);
            // Retirer la tourelle/barracks de la liste
            if (this.scene.selectedTurret instanceof (0, _barracksJs.Barracks)) {
                const index = this.scene.barracks.indexOf(this.scene.selectedTurret);
                if (index !== -1) this.scene.barracks.splice(index, 1);
            } else {
                const index = this.scene.turrets.indexOf(this.scene.selectedTurret);
                if (index !== -1) this.scene.turrets.splice(index, 1);
            }
            // Détruire l'objet
            this.scene.selectedTurret.destroy();
            // Rembourser
            this.scene.earnMoney(refund);
            // Fermer le menu
            this.scene.upgradeMenu.setVisible(false);
            this.scene.selectedTurret = null;
            this.scene.updateToolbarCounts();
        });
        return trashIcon;
    }
    openUpgradeMenu(pointer, turret) {
        const s = this.scene.scaleFactor;
        this.scene.selectedTurret = turret;
        const menuWidth = 320 * s;
        const menuHeight = 220 * s;
        const menuX = Phaser.Math.Clamp(pointer.worldX, menuWidth / 2, this.scene.gameWidth - menuWidth / 2);
        const menuY = Phaser.Math.Clamp(pointer.worldY, menuHeight / 2, this.scene.gameHeight - menuHeight / 2);
        this.scene.upgradeMenu.setPosition(menuX - menuWidth / 2, menuY - menuHeight / 2);
        // Clean previous texts safely
        if (this.scene.upgradeInfoText?.active) try {
            this.scene.upgradeInfoText.destroy();
        } catch (e) {}
        this.scene.upgradeInfoText = null;
        if (Array.isArray(this.scene.upgradeTextLines)) this.scene.upgradeTextLines.forEach((obj)=>{
            if (!obj) return;
            try {
                this.scene.upgradeMenu.remove(obj);
            } catch (e) {}
            try {
                if (obj.active !== false && obj.destroy) obj.destroy();
            } catch (e) {}
        });
        this.scene.upgradeTextLines = [];
        const fontSize = Math.max(14, 16 * s);
        let yPos = 20 * s;
        const lineHeight = 22 * s;
        const xPos = 15 * s;
        if (turret instanceof (0, _barracksJs.Barracks)) this.renderBarracksUpgrade(turret, xPos, yPos, lineHeight, fontSize);
        else this.renderTurretUpgrade(turret, xPos, yPos, lineHeight, fontSize);
        const finalNextStats = turret.getNextLevelStats ? turret.getNextLevelStats() : null;
        // Vérifier si on a assez d'argent pour l'amélioration
        const canAfford = finalNextStats && this.scene.money >= finalNextStats.cost;
        const shouldDisable = !finalNextStats || !canAfford;
        this.scene.upgradeBtnText.setPosition(15 * s, menuHeight - 50 * s);
        if (finalNextStats) this.scene.upgradeBtnText.setText(canAfford ? "AM\xc9LIORER" : `AM\xc9LIORER (${finalNextStats.cost}$)`);
        else this.scene.upgradeBtnText.setText("FERMER");
        // Désactiver visuellement si on ne peut pas se le permettre
        if (shouldDisable) {
            this.scene.upgradeBtnText.setBackgroundColor("#666666");
            this.scene.upgradeBtnText.setColor("#999999");
            this.scene.upgradeBtnText.setAlpha(0.6);
            this.scene.upgradeBtnText.disableInteractive();
        } else {
            this.scene.upgradeBtnText.setBackgroundColor("#00aa00");
            this.scene.upgradeBtnText.setColor("#ffffff");
            this.scene.upgradeBtnText.setAlpha(1);
            this.scene.upgradeBtnText.setInteractive({
                useHandCursor: true
            });
        }
        this.scene.upgradeMenu.setVisible(true);
    }
    renderBarracksUpgrade(turret, xPos, yPosStart, lineHeight, fontSize) {
        const s = this.scene.scaleFactor;
        let yPos = yPosStart;
        const level = turret.level || 1;
        const soldiersCount = turret.config.soldiersCount[level - 1] || 2;
        const respawnTime = turret.config.respawnTime[level - 1] || 12000;
        const soldierHp = turret.config.soldierHp[level - 1] || 100;
        const nextStats = turret.getNextLevelStats?.();
        const title = this.scene.add.text(xPos, yPos, `Caserne - Niveau ${level}`, {
            fontSize: `${fontSize + 2}px`,
            fill: "#ffffff",
            fontStyle: "bold",
            fontFamily: "Arial"
        }).setDepth(241);
        this.scene.upgradeTextLines.push(title);
        this.scene.upgradeMenu.add(title);
        yPos += lineHeight * 1.5;
        if (nextStats) {
            const nextSoldiers = turret.config.soldiersCount[level] || 3;
            const nextRespawn = turret.config.respawnTime[level] || 10000;
            const nextHp = turret.config.soldierHp[level] || 120;
            yPos = this.addStatLine(xPos, yPos, lineHeight, fontSize, "Soldats", `${soldiersCount} > `, `${nextSoldiers}`);
            yPos = this.addStatLine(xPos, yPos, lineHeight, fontSize, "Respawn", `${(respawnTime / 1000).toFixed(1)}s > `, `${(nextRespawn / 1000).toFixed(1)}s`);
            yPos = this.addStatLine(xPos, yPos, lineHeight, fontSize, "HP Soldat", `${soldierHp} > `, `${nextHp}`);
            yPos += lineHeight * 0.5;
            const canAfford = this.scene.money >= nextStats.cost;
            const costText = this.scene.add.text(xPos, yPos, `Co\xfbt : `, {
                fontSize: `${fontSize}px`,
                fill: "#ffffff",
                fontFamily: "Arial"
            }).setDepth(241);
            const costValue = this.scene.add.text(xPos + costText.width, yPos, `${nextStats.cost}$`, {
                fontSize: `${fontSize}px`,
                fill: canAfford ? "#ffd700" : "#ff4444",
                fontStyle: "bold",
                fontFamily: "Arial"
            }).setDepth(241);
            this.scene.upgradeTextLines.push(costText, costValue);
            this.scene.upgradeMenu.add([
                costText,
                costValue
            ]);
        } else {
            const soldiersText = this.scene.add.text(xPos, yPos, `Soldats : ${soldiersCount}`, {
                fontSize: `${fontSize}px`,
                fill: "#ffffff",
                fontFamily: "Arial"
            }).setDepth(241);
            this.scene.upgradeTextLines.push(soldiersText);
            this.scene.upgradeMenu.add(soldiersText);
            yPos += lineHeight;
            const respawnText = this.scene.add.text(xPos, yPos, `Respawn : ${(respawnTime / 1000).toFixed(1)}s`, {
                fontSize: `${fontSize}px`,
                fill: "#ffffff",
                fontFamily: "Arial"
            }).setDepth(241);
            this.scene.upgradeTextLines.push(respawnText);
            this.scene.upgradeMenu.add(respawnText);
            yPos += lineHeight;
            const hpText = this.scene.add.text(xPos, yPos, `HP Soldat : ${soldierHp}`, {
                fontSize: `${fontSize}px`,
                fill: "#ffffff",
                fontFamily: "Arial"
            }).setDepth(241);
            this.scene.upgradeTextLines.push(hpText);
            this.scene.upgradeMenu.add(hpText);
            yPos += lineHeight * 1.5;
            const maxText = this.scene.add.text(xPos, yPos, `Niveau Maximum`, {
                fontSize: `${fontSize}px`,
                fill: "#ff0000",
                fontStyle: "bold",
                fontFamily: "Arial"
            }).setDepth(241);
            this.scene.upgradeTextLines.push(maxText);
            this.scene.upgradeMenu.add(maxText);
        }
    }
    renderTurretUpgrade(turret, xPos, yPosStart, lineHeight, fontSize) {
        let yPos = yPosStart;
        const level = turret.level || 1;
        const nextStats = turret.getNextLevelStats?.();
        const title = this.scene.add.text(xPos, yPos, `${turret.config.name} - Niveau ${level}`, {
            fontSize: `${fontSize + 2}px`,
            fill: "#ffffff",
            fontStyle: "bold",
            fontFamily: "Arial"
        }).setDepth(241);
        this.scene.upgradeTextLines.push(title);
        this.scene.upgradeMenu.add(title);
        yPos += lineHeight * 1.5;
        const currentDamage = turret.config.damage || 0;
        const currentRate = turret.config.rate || 0;
        const currentRange = turret.config.range || 0;
        if (nextStats) {
            yPos = this.addStatLine(xPos, yPos, lineHeight, fontSize, "D\xe9g\xe2ts", `${currentDamage} > `, `${nextStats.damage || 0}`);
            yPos = this.addStatLine(xPos, yPos, lineHeight, fontSize, "Cadence", `${(currentRate / 1000).toFixed(1)}s > `, `${((nextStats.rate || 0) / 1000).toFixed(1)}s`);
            yPos = this.addStatLine(xPos, yPos, lineHeight, fontSize, "Port\xe9e", `${currentRange} > `, `${nextStats.range || 0}`);
            if (nextStats.aoe) yPos = this.addStatLine(xPos, yPos, lineHeight, fontSize, "Zone", `${turret.config.aoe || 0} > `, `${nextStats.aoe}`);
            yPos += lineHeight * 0.5;
            const canAfford = this.scene.money >= nextStats.cost;
            const costText = this.scene.add.text(xPos, yPos, `Co\xfbt : `, {
                fontSize: `${fontSize}px`,
                fill: "#ffffff",
                fontFamily: "Arial"
            }).setDepth(241);
            const costValue = this.scene.add.text(xPos + costText.width, yPos, `${nextStats.cost}$`, {
                fontSize: `${fontSize}px`,
                fill: canAfford ? "#ffd700" : "#ff4444",
                fontStyle: "bold",
                fontFamily: "Arial"
            }).setDepth(241);
            this.scene.upgradeTextLines.push(costText, costValue);
            this.scene.upgradeMenu.add([
                costText,
                costValue
            ]);
        } else {
            const damageText = this.scene.add.text(xPos, yPos, `D\xe9g\xe2ts : ${currentDamage}`, {
                fontSize: `${fontSize}px`,
                fill: "#ffffff",
                fontFamily: "Arial"
            }).setDepth(241);
            this.scene.upgradeTextLines.push(damageText);
            this.scene.upgradeMenu.add(damageText);
            yPos += lineHeight;
            const rateText = this.scene.add.text(xPos, yPos, `Cadence : ${(currentRate / 1000).toFixed(1)}s`, {
                fontSize: `${fontSize}px`,
                fill: "#ffffff",
                fontFamily: "Arial"
            }).setDepth(241);
            this.scene.upgradeTextLines.push(rateText);
            this.scene.upgradeMenu.add(rateText);
            yPos += lineHeight;
            const rangeText = this.scene.add.text(xPos, yPos, `Port\xe9e : ${currentRange}`, {
                fontSize: `${fontSize}px`,
                fill: "#ffffff",
                fontFamily: "Arial"
            }).setDepth(241);
            this.scene.upgradeTextLines.push(rangeText);
            this.scene.upgradeMenu.add(rangeText);
            yPos += lineHeight;
            if (turret.config.aoe) {
                const aoeText = this.scene.add.text(xPos, yPos, `Zone : ${turret.config.aoe}`, {
                    fontSize: `${fontSize}px`,
                    fill: "#ffffff",
                    fontFamily: "Arial"
                }).setDepth(241);
                this.scene.upgradeTextLines.push(aoeText);
                this.scene.upgradeMenu.add(aoeText);
                yPos += lineHeight;
            }
            yPos += lineHeight * 0.5;
            const maxText = this.scene.add.text(xPos, yPos, `Niveau Maximum`, {
                fontSize: `${fontSize}px`,
                fill: "#ff0000",
                fontStyle: "bold",
                fontFamily: "Arial"
            }).setDepth(241);
            this.scene.upgradeTextLines.push(maxText);
            this.scene.upgradeMenu.add(maxText);
        }
    }
    addStatLine(xPos, yPos, lineHeight, fontSize, label, leftValue, rightValue) {
        // label is unused in display (kept if you want to reformat later), but we keep the API stable.
        const leftText = this.scene.add.text(xPos, yPos, `${label} : ${leftValue}`, {
            fontSize: `${fontSize}px`,
            fill: "#ffffff",
            fontFamily: "Arial"
        }).setDepth(241);
        const rightText = this.scene.add.text(xPos + leftText.width, yPos, `${rightValue}`, {
            fontSize: `${fontSize}px`,
            fill: "#00ff00",
            fontStyle: "bold",
            fontFamily: "Arial"
        }).setDepth(241);
        this.scene.upgradeTextLines.push(leftText, rightText);
        this.scene.upgradeMenu.add([
            leftText,
            rightText
        ]);
        return yPos + lineHeight;
    }
    // ------------------------------------------------------------
    // Small UI helper
    // ------------------------------------------------------------
    createPanelBackground(w, h, opts) {
        const s = this.scene.scaleFactor;
        const radius = opts.radius ?? 15;
        const g = this.scene.add.graphics();
        // Shadow-ish offset
        g.fillStyle(0x000000, opts.shadowAlpha ?? 0.5);
        g.fillRoundedRect(4 * s, 4 * s, w, h, radius);
        // Main fill
        g.fillStyle(opts.fill ?? 0x0f0f1a, opts.fillAlpha ?? 0.98);
        g.fillRoundedRect(0, 0, w, h, radius);
        // Border
        g.lineStyle(Math.max(3, 4 * s), opts.stroke ?? 0x00ccff, opts.strokeAlpha ?? 1);
        g.strokeRoundedRect(0, 0, w, h, radius);
        // Inner border
        g.lineStyle(2, opts.innerStroke ?? 0x0066aa, opts.innerAlpha ?? 0.6);
        g.strokeRoundedRect(2 * s, 2 * s, w - 4 * s, h - 4 * s, radius - 2);
        // Header separator
        const headerLine = this.scene.add.graphics();
        headerLine.lineStyle(2, 0x00ccff, 0.8);
        headerLine.beginPath();
        headerLine.moveTo(14 * s, opts.headerY ?? 42 * s);
        headerLine.lineTo(w - 14 * s, opts.headerY ?? 42 * s);
        headerLine.strokePath();
        return {
            bg: g,
            headerLine
        };
    }
    // ------------------------------------------------------------
    // TREE REMOVAL CONFIRMATION MENU
    // ------------------------------------------------------------
    createTreeRemovalMenu() {
        const s = this.scene.scaleFactor;
        this.scene.treeRemovalMenu = this.scene.add.container(0, 0).setVisible(false).setDepth(250);
        const menuWidth = 280 * s;
        const menuHeight = 140 * s;
        const { bg } = this.createPanelBackground(menuWidth, menuHeight, {
            fill: 0x0f0f1a,
            fillAlpha: 0.98,
            shadowAlpha: 0.5,
            stroke: 0xff6600,
            strokeAlpha: 1,
            innerStroke: 0xcc4400,
            innerAlpha: 0.6,
            radius: 16,
            headerY: 0
        });
        this.scene.treeRemovalMenu.add(bg);
        // Texte de confirmation
        this.scene.treeRemovalText = this.scene.add.text(menuWidth / 2, 35 * s, "", {
            fontSize: `${Math.max(14, 16 * s)}px`,
            fill: "#ffffff",
            fontFamily: "Arial",
            align: "center",
            wordWrap: {
                width: menuWidth - 40 * s
            }
        }).setOrigin(0.5).setDepth(251);
        this.scene.treeRemovalMenu.add(this.scene.treeRemovalText);
        // Bouton Oui
        const yesBtn = this.scene.add.text(menuWidth / 2 - 60 * s, 90 * s, "OUI", {
            fontSize: `${Math.max(14, 16 * s)}px`,
            fill: "#ffffff",
            fontStyle: "bold",
            backgroundColor: "#00aa00",
            padding: {
                x: 20 * s,
                y: 8 * s
            },
            fontFamily: "Arial"
        }).setOrigin(0.5).setDepth(251).setInteractive({
            useHandCursor: true
        }).on("pointerover", ()=>yesBtn.setBackgroundColor("#00cc00")).on("pointerout", ()=>yesBtn.setBackgroundColor("#00aa00")).on("pointerdown", ()=>{
            if (this.scene.treeRemovalTile) {
                const { tx, ty } = this.scene.treeRemovalTile;
                if (this.scene.money >= 25) {
                    this.scene.mapManager.removeTree(tx, ty);
                    this.scene.earnMoney(-25); // Déduire 25$
                    this.scene.treeRemovalMenu.setVisible(false);
                    this.scene.treeRemovalTile = null;
                } else // Pas assez d'argent
                this.scene.cameras.main.shake(50, 0.005);
            }
        });
        // Bouton Non
        const noBtn = this.scene.add.text(menuWidth / 2 + 60 * s, 90 * s, "NON", {
            fontSize: `${Math.max(14, 16 * s)}px`,
            fill: "#ffffff",
            fontStyle: "bold",
            backgroundColor: "#aa0000",
            padding: {
                x: 20 * s,
                y: 8 * s
            },
            fontFamily: "Arial"
        }).setOrigin(0.5).setDepth(251).setInteractive({
            useHandCursor: true
        }).on("pointerover", ()=>noBtn.setBackgroundColor("#cc0000")).on("pointerout", ()=>noBtn.setBackgroundColor("#aa0000")).on("pointerdown", ()=>{
            this.scene.treeRemovalMenu.setVisible(false);
            this.scene.treeRemovalTile = null;
        });
        this.scene.treeRemovalMenu.add([
            yesBtn,
            noBtn
        ]);
    }
    openTreeRemovalConfirmation(pointer, tx, ty) {
        const s = this.scene.scaleFactor;
        // Créer le menu s'il n'existe pas
        if (!this.scene.treeRemovalMenu) this.createTreeRemovalMenu();
        // Stocker les coordonnées de la tuile
        this.scene.treeRemovalTile = {
            tx,
            ty
        };
        const menuWidth = 280 * s;
        const menuHeight = 140 * s;
        // Positionner le menu près du pointeur
        let menuX = Phaser.Math.Clamp(pointer.worldX, menuWidth / 2, this.scene.gameWidth - menuWidth / 2);
        let menuY = Phaser.Math.Clamp(pointer.worldY, menuHeight / 2, this.scene.gameHeight - menuHeight / 2);
        this.scene.treeRemovalMenu.setPosition(menuX - menuWidth / 2, menuY - menuHeight / 2);
        // Mettre à jour le texte
        const canAfford = this.scene.money >= 25;
        const costText = canAfford ? "25" : "25 (insuffisant)";
        this.scene.treeRemovalText.setText([
            "Voulez-vous enlever",
            "cet arbre pour",
            `${costText} pi\xe8ces ?`
        ]);
        // Changer la couleur si pas assez d'argent
        if (canAfford) this.scene.treeRemovalText.setColor("#ffffff");
        else this.scene.treeRemovalText.setColor("#ff4444");
        this.scene.treeRemovalMenu.setVisible(true);
    }
}

},{"../../config/settings.js":"9kTMs","../../config/turrets/index.js":"97rhz","../../objects/Barracks.js":"bSlQd","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"lqA3P":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "lightning", ()=>lightning);
const lightning = {
    key: "lightning",
    name: "\xc9clair",
    damage: 200,
    radius: 80,
    paralysisDuration: 3500,
    cooldown: 100000,
    description: "Sort puissant qui fait tomber un \xe9clair destructeur.\n\n\u2705 Avantages:\n\u2022 D\xe9g\xe2ts massifs (200)\n\u2022 Zone d'effet (touche plusieurs ennemis)\n\u2022 Paralysie les ennemis survivants (3.5s)\n\n\u274C Inconv\xe9nients:\n\u2022 Cooldown tr\xe8s long (100 secondes)\n\u2022 N\xe9cessite un placement pr\xe9cis\n\u2022 Zone d'effet limit\xe9e"
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}]},["fILKw"], "fILKw", "parcelRequirebaba", {})

//# sourceMappingURL=towerdefense.1fcc916e.js.map
