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
var _bossJs = require("../config/ennemies/boss.js");
var _throwerJs = require("../config/ennemies/thrower.js");
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
    STARTING_MONEY: 550,
    STARTING_LIVES: 20,
    TOOLBAR_HEIGHT: 100,
    TOOLBAR_MARGIN: 20
};
const ENEMIES = {
    grunt: (0, _gruntJs.grunt),
    runner: (0, _runnerJs.runner),
    tank: (0, _tankJs.tank),
    shield: (0, _shieldJs.shield),
    boss: (0, _bossJs.boss),
    thrower: (0, _throwerJs.thrower)
};
const TURRETS = {
    machine_gun: (0, _machineGunJs.machine_gun),
    sniper: (0, _sniperJs.sniper),
    cannon: (0, _cannonJs.cannon),
    zap: (0, _zapJs.zap),
    barracks: (0, _barracksJs.barracks)
};

},{"../config/ennemies/grunt.js":"iqyIL","../config/ennemies/runner.js":"k54Ru","../config/ennemies/tank.js":"caNrh","../config/ennemies/shield.js":"BAQN3","../config/ennemies/boss.js":"guYEg","../config/turrets/machineGun.js":"ecBws","../config/turrets/sniper.js":"fm2OQ","../config/turrets/cannon.js":"3RJPP","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT","../config/turrets/zap.js":"bgZGw","../config/turrets/barracks.js":"9rF1d","../config/ennemies/thrower.js":"9eVmk"}],"iqyIL":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "grunt", ()=>grunt);
const grunt = {
    name: "Grunt",
    speed: 90,
    hp: 100,
    reward: 20,
    color: 0x558844,
    damage: 8,
    attackSpeed: 800,
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
    speed: 260,
    hp: 110,
    reward: 30,
    color: 0xffd166,
    damage: 14,
    attackSpeed: 600,
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
    hp: 2800,
    reward: 150,
    color: 0x224466,
    damage: 28,
    attackSpeed: 1200,
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

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"guYEg":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "boss", ()=>boss);
const boss = {
    name: "DOOM",
    speed: 20,
    hp: 28000,
    reward: 1000,
    color: 0x222222,
    damage: 70,
    attackSpeed: 1000,
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

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"ecBws":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "machine_gun", ()=>machine_gun);
const machine_gun = {
    key: "machine_gun",
    name: "Mitrailleuse",
    cost: 100,
    range: 170,
    damage: 10,
    rate: 240,
    color: 0x4488ff,
    maxLevel: 3,
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
    cost: 300,
    range: 300,
    damage: 150,
    rate: 2500,
    color: 0x44ff44,
    maxLevel: 3,
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
    cost: 220,
    range: 160,
    damage: 80,
    rate: 2000,
    color: 0xff8844,
    aoe: 100,
    maxLevel: 2,
    // --- DESSIN DU CANON (ÉVOLUTIF) ---
    onDrawBarrel: (scene, container, color, turret)=>{
        const g = scene.add.graphics();
        const level = turret.level || 1;
        // Palette Niv 1 (Bronze)
        const bronze = 0xcd7f32;
        const darkBronze = 0xa05a2c;
        // Palette Niv 2 (Acier Lourd)
        const steel = 0x8899aa;
        const darkSteel = 0x445566;
        const black = 0x111111;
        const heavyMetal = 0x555555;
        if (level === 1) {
            // === NIVEAU 1 : Mortier Bronze ===
            // Base pivotante
            g.fillStyle(darkBronze);
            g.fillRoundedRect(-20, -18, 30, 36, 6);
            g.lineStyle(3, 0x663311);
            g.strokeRoundedRect(-20, -18, 30, 36, 6);
            // Rivets
            g.fillStyle(0x663311);
            g.fillCircle(-15, -12, 2);
            g.fillCircle(-15, 12, 2);
            g.fillCircle(5, -12, 2);
            g.fillCircle(5, 12, 2);
            // Canon Court
            g.fillStyle(bronze);
            g.fillRect(10, -12, 20, 24);
            g.fillStyle(darkBronze); // Renforts
            g.fillRect(12, -14, 4, 28);
            g.fillRect(22, -14, 4, 28);
            // Bouche
            g.fillStyle(black);
            g.fillCircle(30, 0, 10);
            g.lineStyle(4, darkBronze);
            g.strokeCircle(30, 0, 10);
        } else {
            // === NIVEAU 2 : Artillerie Lourde (Acier) ===
            // Base blindée plus large
            g.fillStyle(darkSteel);
            g.fillRoundedRect(-22, -20, 34, 40, 4);
            g.lineStyle(2, 0xaabbcc); // Bordure claire
            g.strokeRoundedRect(-22, -20, 34, 40, 4);
            // Canon Long et Massif
            g.fillStyle(steel);
            g.fillRect(12, -14, 30, 28); // Plus long
            // Système de refroidissement (lamelles)
            g.fillStyle(darkSteel);
            g.fillRect(15, -14, 2, 28);
            g.fillRect(20, -14, 2, 28);
            g.fillRect(25, -14, 2, 28);
            g.fillRect(30, -14, 2, 28);
            // Bouche énorme
            g.fillStyle(black);
            g.fillCircle(42, 0, 12);
            g.lineStyle(4, darkSteel);
            g.strokeCircle(42, 0, 12);
            // Chargeur automatique sur le côté
            g.fillStyle(0x333333);
            g.fillRect(-10, -22, 10, 8);
        }
        // Recul (Commun)
        g.fillStyle(heavyMetal);
        g.fillRect(-5, 18, 20, 6);
        g.fillStyle(0x888888);
        g.fillRect(-2, 20, 15, 2);
        container.add(g);
        // --- INDICATEUR NIVEAU ---
        const badge = scene.add.container(-20, 20);
        const badgeColor = level === 2 ? 0x00ffff : 0xffffff;
        const badgeBg = scene.add.rectangle(0, 0, 24, 14, 0x000000, 0.7);
        badgeBg.setStrokeStyle(1, badgeColor);
        const lvlText = scene.add.text(0, 0, `Lv.${level}`, {
            fontSize: "10px",
            fontFamily: "Arial",
            color: level === 2 ? "#00ffff" : "#ffffff",
            fontStyle: "bold"
        }).setOrigin(0.5);
        badge.add([
            badgeBg,
            lvlText
        ]);
        container.add(badge);
    },
    // --- LOGIQUE DE TIR DE ZONE ---
    onFire: (scene, turret, target)=>{
        const level = turret.level || 1;
        const targetX = target.x;
        const targetY = target.y;
        // 1. Muzzle Flash (Plus gros au niv 2)
        const flashSize = level === 2 ? 30 : 20;
        const flashColor = level === 2 ? 0xffdd88 : 0xaaaaaa;
        const muzzleFlash = scene.add.circle(turret.x, turret.y, flashSize, flashColor, 0.8);
        scene.tweens.add({
            targets: muzzleFlash,
            scale: 2,
            alpha: 0,
            duration: 300,
            onComplete: ()=>muzzleFlash.destroy()
        });
        // 2. Projectile
        const shellSize = level === 2 ? 10 : 8;
        const shellColor = level === 2 ? 0x444444 : 0x222222;
        const shell = scene.add.circle(turret.x, turret.y, shellSize, shellColor);
        shell.setStrokeStyle(2, 0x000000);
        shell.setDepth(100);
        // 3. Trajectoire
        scene.tweens.add({
            targets: shell,
            scale: 1.8,
            duration: 350,
            yoyo: true,
            ease: "Sine.easeInOut"
        });
        scene.tweens.add({
            targets: shell,
            x: targetX,
            y: targetY,
            duration: 700,
            ease: "Linear",
            onComplete: ()=>{
                shell.destroy();
                // 4. Explosion
                // Niv 2 = Explosion plus rouge/sombre et plus grande
                const blastColor = level === 2 ? 0xcc2200 : 0xff4400;
                const blastRadius = turret.config.aoe; // L'AoE a été updatée dans Turret.js lors de l'upgrade
                const blast = scene.add.circle(targetX, targetY, 10, blastColor, 0.9);
                blast.setDepth(99);
                scene.tweens.add({
                    targets: blast,
                    radius: blastRadius,
                    alpha: 0,
                    duration: 400,
                    ease: "Quad.easeOut",
                    onComplete: ()=>blast.destroy()
                });
                // Flash blanc interne
                const innerBlast = scene.add.circle(targetX, targetY, 10, 0xffffaa, 1);
                innerBlast.setDepth(100);
                scene.tweens.add({
                    targets: innerBlast,
                    radius: blastRadius / 2,
                    alpha: 0,
                    duration: 200,
                    onComplete: ()=>innerBlast.destroy()
                });
                // 5. Dégâts de zone
                const allEnemies = scene.enemies.getChildren();
                allEnemies.forEach((e)=>{
                    if (e.active) {
                        const dist = Phaser.Math.Distance.Between(targetX, targetY, e.x, e.y);
                        if (dist <= blastRadius) e.damage(turret.config.damage);
                    }
                });
            }
        });
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"bgZGw":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "zap", ()=>zap);
const zap = {
    key: "zap",
    name: "\xc9clair",
    cost: 350,
    range: 180,
    damage: 60,
    rate: 1800,
    color: 0x00ffff,
    maxLevel: 3,
    maxChainTargets: 4,
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
        const maxChainTargets = level === 1 ? 4 : level === 2 ? 6 : 9;
        const chainDistance = 100; // 1/2 case = 32 pixels (TILE_SIZE / 2)
        // Longueur du canon
        const barrelLen = level === 1 ? 35 : level === 2 ? 45 : 55;
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
    cost: 180,
    range: 0,
    damage: 0,
    rate: 0,
    color: 0x8b4513,
    maxLevel: 3,
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
        120,
        150
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

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"9eVmk":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "thrower", ()=>thrower);
const thrower = {
    name: "Lanceur",
    speed: 70,
    hp: 150,
    reward: 40,
    color: 0x8b4513,
    damage: 15,
    attackSpeed: 1500,
    attackRange: 80,
    isRanged: true,
    onDraw: (scene, container, color, enemyInstance)=>{
        enemyInstance.legs = {};
        // 1. Jambe Arrière
        enemyInstance.legs.back = scene.add.container(0, 5);
        const legB = scene.add.graphics();
        legB.fillStyle(0x654321);
        legB.fillRoundedRect(-3, 0, 6, 18, 2);
        legB.fillRoundedRect(-4, 16, 10, 5, 2);
        enemyInstance.legs.back.add(legB);
        container.add(enemyInstance.legs.back);
        // 2. Corps
        const body = scene.add.graphics();
        body.fillStyle(color);
        body.fillRoundedRect(-6, -10, 12, 18, 3);
        // Tête
        body.fillStyle(0xffdbac);
        body.fillCircle(0, -14, 6);
        // Casque simple
        body.fillStyle(0x654321);
        body.fillRect(-7, -18, 14, 6);
        // Bras avec hache
        body.fillStyle(color);
        body.fillRoundedRect(-2, -8, 6, 14, 2);
        body.fillRoundedRect(4, -8, 6, 14, 2);
        container.add(body);
        // 3. Jambe Avant
        enemyInstance.legs.front = scene.add.container(0, 5);
        const legF = scene.add.graphics();
        legF.fillStyle(color);
        legF.fillRoundedRect(-3, 0, 6, 18, 2);
        legF.fillRoundedRect(-4, 16, 10, 5, 2);
        enemyInstance.legs.front.add(legF);
        container.add(enemyInstance.legs.front);
        // 4. Hache dans la main (sera animée lors du lancer)
        enemyInstance.axe = scene.add.graphics();
        enemyInstance.axe.fillStyle(0x888888); // Manche
        enemyInstance.axe.fillRect(8, -6, 2, 8);
        enemyInstance.axe.fillStyle(0xcccccc); // Lame
        enemyInstance.axe.beginPath();
        enemyInstance.axe.moveTo(10, -6);
        enemyInstance.axe.lineTo(16, -10);
        enemyInstance.axe.lineTo(16, -2);
        enemyInstance.axe.closePath();
        enemyInstance.axe.fillPath();
        container.add(enemyInstance.axe);
        enemyInstance.shouldRotate = false;
    },
    onUpdateAnimation: (time, enemyInstance)=>{
        const speed = 0.006;
        const range = 0.4;
        enemyInstance.legs.front.rotation = Math.sin(time * speed) * range;
        enemyInstance.legs.back.rotation = Math.sin(time * speed + Math.PI) * range;
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
            0,
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
            1,
            1,
            1,
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
            1,
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
            1,
            1,
            1,
            1,
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
                count: 14,
                type: "grunt",
                interval: 1000
            },
            {
                count: 3,
                type: "thrower",
                interval: 500
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
                count: 25,
                type: "runner",
                interval: 400
            }
        ],
        // VAGUE 3 : Mixte
        [
            {
                count: 5,
                type: "shield",
                interval: 1500
            },
            {
                count: 8,
                type: "runner",
                interval: 800
            },
            {
                count: 10,
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
                count: 2,
                type: "shield",
                interval: 1500
            },
            {
                count: 6,
                type: "grunt",
                interval: 600
            },
            {
                count: 3,
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
                count: 5,
                type: "shield",
                interval: 1500
            },
            {
                count: 7,
                type: "tank",
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
            0,
            3
        ],
        [
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
            0,
            0,
            0,
            0,
            0
        ],
        [
            1,
            1,
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
            0,
            0,
            0
        ],
        [
            0,
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
            0,
            0,
            0,
            0
        ],
        [
            0,
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
            0,
            0,
            0,
            0
        ],
        [
            0,
            0,
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
            1,
            1,
            1
        ],
        [
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
            0,
            1
        ],
        [
            1,
            1,
            1,
            0,
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
            0,
            1,
            0,
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
            0,
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
            1,
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
            0,
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
            0,
            0,
            0
        ],
        [
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
        // VAGUE 1 : Introduction avec deux spawns
        [
            {
                count: 10,
                type: "grunt",
                interval: 800
            },
            {
                count: 5,
                type: "runner",
                interval: 600
            }
        ],
        // VAGUE 2 : Runners rapides depuis les deux points
        [
            {
                count: 20,
                type: "runner",
                interval: 350
            },
            {
                count: 8,
                type: "grunt",
                interval: 700
            }
        ],
        // VAGUE 3 : Mixte avec shields
        [
            {
                count: 12,
                type: "grunt",
                interval: 600
            },
            {
                count: 8,
                type: "runner",
                interval: 500
            },
            {
                count: 4,
                type: "shield",
                interval: 1200
            }
        ],
        // VAGUE 4 : Tanks et runners
        [
            {
                count: 25,
                type: "runner",
                interval: 350
            },
            {
                count: 15,
                type: "grunt",
                interval: 500
            },
            {
                count: 2,
                type: "shield",
                interval: 1200
            },
            {
                count: 4,
                type: "tank",
                interval: 3500
            }
        ],
        // VAGUE 5 : Invasion massive
        [
            {
                count: 40,
                type: "grunt",
                interval: 400
            },
            {
                count: 20,
                type: "runner",
                interval: 300
            },
            {
                count: 6,
                type: "shield",
                interval: 1000
            },
            {
                count: 5,
                type: "tank",
                interval: 3000
            }
        ],
        // VAGUE 6 : Boss avec support
        [
            {
                count: 50,
                type: "grunt",
                interval: 500
            },
            {
                count: 35,
                type: "runner",
                interval: 400
            },
            {
                count: 8,
                type: "shield",
                interval: 1000
            },
            {
                count: 6,
                type: "tank",
                interval: 4000
            },
            {
                count: 1,
                type: "boss",
                interval: 2000
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
        if (typeof structuredClone !== 'undefined') this.levelConfig = structuredClone(src);
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
        this.selectedTurret = null;
        this.maxBarracks = 5;
        this.draggingTurret = null;
        this.placementPreview = null;
        this.validCellsPreview = [];
        this.upgradeTextLines = []; // Pour stocker les lignes de texte du menu
        // Réinitialiser toutes les références UI pour éviter les références vers objets détruits
        this.buildToolbar = null;
        this.toolbarButtons = null;
        this.txtMoney = null;
        this.txtLives = null;
        this.buildMenu = null;
        this.upgradeMenu = null;
        this.waveBtnContainer = null;
        this.waveBtnBg = null;
        this.waveBtnText = null;
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
        // Gestion de la touche Echap pour annuler le drag
        this.input.keyboard.on("keydown-ESC", ()=>{
            this.cancelDrag();
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
        // Gestion des clics normaux et tactiles
        this.input.on("pointerdown", (pointer)=>{
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
            const turretTx = Math.floor((t.x - this.mapStartX) / T);
            const turretTy = Math.floor((t.y - this.mapStartY) / T);
            if (turretTx === tx && turretTy === ty) {
                clickedTurret = t;
                break;
            }
        }
        // Vérifier aussi les barracks
        if (!clickedTurret) for (const b of this.barracks){
            const barracksTx = Math.floor((b.x - this.mapStartX) / T);
            const barracksTy = Math.floor((b.y - this.mapStartY) / T);
            if (barracksTx === tx && barracksTy === ty) {
                clickedTurret = b;
                break;
            }
        }
        if (clickedTurret) // Clic exact sur la tourelle -> Upgrade
        this.uiManager.openUpgradeMenu(pointer, clickedTurret);
        else // Clic sur case vide -> Build
        this.uiManager.openBuildMenu(pointer);
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
        // Vérifier qu'il n'y a pas d'arbre ici
        if (this.mapManager.hasTree(tileX, tileY)) return false;
        // Vérifier si c'est une barracks
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
    updateUI() {
        if (this.txtMoney) this.txtMoney.setText(`\u{1F4B0} ${this.money}`);
        if (this.txtLives) this.txtLives.setText(`\u{2764}\u{FE0F} ${this.lives}`);
        this.updateToolbarCounts();
        // Mettre à jour les boutons du menu de construction si visible
        if (this.buildMenu && this.buildMenu.visible) this.uiManager.updateBuildMenuButtons();
    }
    // =========================================================
    // GESTION UI (délégué à UIManager)
    // =========================================================
    // Créer la toolbar de construction en bas (sous la map)
    createBuildToolbar() {
        const toolbarX = this.toolbarOffsetX || 10 * this.scaleFactor;
        const toolbarY = this.toolbarOffsetY;
        const itemSize = 80 * this.scaleFactor; // Augmenté de 60 à 80
        const itemSpacing = 90 * this.scaleFactor; // Augmenté de 70 à 90
        this.buildToolbar = this.add.container(toolbarX, toolbarY).setDepth(150);
        // Fond de la toolbar (plus grande)
        const toolbarBg = this.add.graphics();
        const toolbarWidth = 5 * itemSpacing + 40 * this.scaleFactor; // Plus large
        const toolbarHeight = 120 * this.scaleFactor; // Plus haute (au lieu de CONFIG.TOOLBAR_HEIGHT)
        toolbarBg.fillStyle(0x000000, 0.9);
        toolbarBg.fillRoundedRect(0, 0, toolbarWidth, toolbarHeight, 10);
        toolbarBg.lineStyle(3, 0xffffff, 0.6);
        toolbarBg.strokeRoundedRect(0, 0, toolbarWidth, toolbarHeight, 10);
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
            // Centrer les boutons dans la toolbar
            const totalWidth = 5 * itemSpacing;
            const startX = (toolbarWidth - totalWidth) / 2 + itemSpacing / 2;
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
            // Fonction pour mettre à jour le compteur
            const updateCount = ()=>{
                // Vérifier que les objets sont encore valides avant de les manipuler
                if (!countText || countText.active === false) return;
                if (!btnBg || btnBg.active === false) return;
                try {
                    if (item.key === "barracks") {
                        const count = this.barracks.length;
                        const max = this.maxBarracks;
                        countText.setText(`${count}/${max}`);
                        countText.setColor(count >= max ? "#ff0000" : "#ffffff");
                        btnBg.setFillStyle(count >= max ? 0x330000 : 0x333333);
                    } else {
                        const count = this.turrets.filter((t)=>t.config.key === item.key).length;
                        countText.setText(`${count}`);
                    }
                } catch (e) {
                    // Ignorer si les objets ont été détruits
                    console.warn("Erreur lors de la mise \xe0 jour du compteur:", e);
                }
            };
            btnContainer.add([
                btnBg,
                previewContainer,
                countText
            ]);
            this.buildToolbar.add(btnContainer);
            // Gestion du clic pour démarrer le drag
            btnBg.on("pointerdown", (pointer)=>{
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
                updateCount: updateCount
            });
        });
        // Mettre à jour les compteurs
        this.updateToolbarCounts();
    }
    // Dessiner une miniature du bâtiment pour la toolbar avec le vrai visuel
    drawTurretPreview(container, config) {
        // Dessiner la base (cercle simple)
        const base = this.add.graphics();
        base.fillStyle(config.color || 0x888888, 0.8);
        base.fillCircle(0, 0, 25);
        base.lineStyle(2, 0xffffff, 0.5);
        base.strokeCircle(0, 0, 25);
        container.add(base);
        // Dessiner le canon/barrel avec la fonction onDrawBarrel si elle existe
        if (config.onDrawBarrel) {
            const barrelContainer = this.add.container(0, 0);
            // Créer un objet turret factice pour onDrawBarrel
            const fakeTurret = {
                level: 1
            };
            try {
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

},{"../config/settings.js":"9kTMs","../config/levels/index.js":"8fcfE","../config/turrets/index.js":"97rhz","../objects/Enemy.js":"hW1Gp","../objects/Turret.js":"lbJGU","../objects/Barracks.js":"bSlQd","./managers/MapManager.js":"bYbwC","./managers/WaveManager.js":"bbCRa","./managers/UIManager.js":"1XDfq","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"97rhz":[function(require,module,exports,__globalThis) {
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
        // --- DEBUG ---
        // Si ENEMIES est undefined, c'est un problème d'import.
        if (!(0, _settingsJs.ENEMIES)) {
            console.error("ERREUR CRITIQUE : L'objet ENEMIES n'est pas charg\xe9. V\xe9rifiez src/config/settings.js");
            return;
        }
        // Si ENEMIES[typeKey] est undefined, c'est que la vague demande un type qui n'existe pas.
        if (!(0, _settingsJs.ENEMIES)[typeKey]) {
            console.error(`ERREUR : Le type d'ennemi '${typeKey}' n'existe pas dans ENEMIES.`);
            // Fallback sur 'grunt' pour éviter le crash
            this.stats = (0, _settingsJs.ENEMIES)["grunt"];
        } else this.stats = (0, _settingsJs.ENEMIES)[typeKey];
        // -------------
        // Stats
        this.hp = this.stats.hp;
        this.maxHp = this.stats.hp;
        this.speed = this.stats.speed;
        this.attackDamage = this.stats.damage || 10; // Dégâts par défaut (renommé pour éviter conflit avec méthode damage())
        this.attackSpeed = this.stats.attackSpeed || 1000; // Vitesse d'attaque par défaut
        this.attackRange = this.stats.attackRange || 30; // Portée d'attaque
        this.isRanged = this.stats.isRanged || false; // Attaquant à distance
        this.shouldRotate = false; // On n'utilise plus la rotation, mais le flip
        this.facingRight = true; // Direction actuelle (true = droite, false = gauche)
        this.lastAttackTime = 0;
        this.targetSoldier = null; // Soldat ciblé pour les attaques à distance
        // --- 1. VISUEL ---
        // Ombre
        const shadow = scene.add.ellipse(0, 15, 30, 10, 0x000000, 0.5);
        this.add(shadow);
        // Corps de l'ennemi
        this.bodyGroup = scene.add.container(0, 0);
        this.add(this.bodyGroup);
        // Dessin modulaire
        if (this.stats.onDraw) this.stats.onDraw(this.scene, this.bodyGroup, this.stats.color, this);
        else {
            const fallback = scene.add.rectangle(0, 0, 32, 32, this.stats.color || 0xffffff);
            this.bodyGroup.add(fallback);
        }
        // --- 2. BARRE DE VIE ---
        this.drawHealthBar(scene);
        // Initialisation Phaser
        this.scene.add.existing(this);
        this.follower = {
            t: 0,
            vec: new Phaser.Math.Vector2()
        };
        // Tooltip HP - définir une zone interactive
        this.hpTooltip = null;
        this.setSize(32, 32); // Taille pour l'interactivité
        this.setInteractive({
            useHandCursor: false
        });
        this.on("pointerover", ()=>{
            if (this.active) this.showHpTooltip();
        });
        this.on("pointerout", ()=>this.hideHpTooltip());
    }
    showHpTooltip() {
        if (!this.active) return;
        if (this.hpTooltip) this.hpTooltip.destroy();
        const fontSize = Math.max(12, 14 * (this.scene.scaleFactor || 1));
        this.hpTooltip = this.scene.add.text(this.x, this.y - 60, `${Math.max(0, this.hp)} / ${this.maxHp} HP`, {
            fontSize: `${fontSize}px`,
            fill: "#ffffff",
            fontStyle: "bold",
            backgroundColor: "#000000",
            padding: {
                x: 8,
                y: 4
            }
        }).setOrigin(0.5).setDepth(300);
        // Mettre à jour la position et le texte du tooltip en continu
        if (this.tooltipUpdateTimer) this.tooltipUpdateTimer.remove();
        this.tooltipUpdateTimer = this.scene.time.addEvent({
            delay: 50,
            callback: ()=>{
                if (this.hpTooltip && this.active) {
                    this.hpTooltip.setPosition(this.x, this.y - 60);
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
    update(time, delta) {
        if (this.active && this.stats && this.stats.onUpdateAnimation) this.stats.onUpdateAnimation(time, this);
        // Gérer les attaques contre les soldats
        if (this.active && !this.isBlocked) this.updateCombat(time);
    }
    // Mettre à jour le combat (attaques contre les soldats)
    updateCombat(time) {
        if (this.isRanged) {
            // Attaquant à distance : chercher un soldat à portée
            this.findRangedTarget();
            if (this.targetSoldier && this.targetSoldier.active && this.targetSoldier.isAlive) {
                const dist = Phaser.Math.Distance.Between(this.x, this.y, this.targetSoldier.x, this.targetSoldier.y);
                // Une case = 64 pixels, on s'arrête à environ une case de distance
                const CONFIG = {
                    TILE_SIZE: 64
                };
                const stopDistance = CONFIG.TILE_SIZE * (this.scene.scaleFactor || 1);
                if (dist <= this.attackRange) {
                    // S'arrêter si on est assez proche pour attaquer
                    if (dist <= stopDistance) {
                        // S'arrêter et attaquer
                        if (this.follower && this.follower.tween && !this.follower.tween.isPaused) this.follower.tween.pause();
                        // Attaquer si le cooldown est écoulé
                        if (time - this.lastAttackTime >= this.attackSpeed) {
                            this.attackSoldierRanged(this.targetSoldier);
                            this.lastAttackTime = time;
                        }
                    } else // On est dans la portée mais pas assez proche, continuer à avancer
                    if (this.follower && this.follower.tween && this.follower.tween.isPaused) this.follower.tween.resume();
                } else {
                    // Trop loin pour attaquer, reprendre le mouvement
                    if (this.follower && this.follower.tween && this.follower.tween.isPaused) this.follower.tween.resume();
                    this.targetSoldier = null;
                }
            } else // Pas de cible, reprendre le mouvement
            if (this.follower && this.follower.tween && this.follower.tween.isPaused) this.follower.tween.resume();
        } else {
            // Attaquant au corps à corps : attaquer le soldat qui le bloque
            if (this.isBlocked && this.blockedBy) {
                if (time - this.lastAttackTime >= this.attackSpeed) {
                    this.blockedBy.takeDamage(this.attackDamage);
                    this.lastAttackTime = time;
                }
            }
        }
    }
    // Trouver une cible pour attaque à distance
    findRangedTarget() {
        if (!this.scene || !this.scene.soldiers) return;
        const soldiers = this.scene.soldiers.getChildren();
        let closestSoldier = null;
        let minDist = this.attackRange;
        for (const soldier of soldiers)if (soldier && soldier.active && soldier.isAlive) {
            const dist = Phaser.Math.Distance.Between(this.x, this.y, soldier.x, soldier.y);
            if (dist <= this.attackRange && dist < minDist) {
                minDist = dist;
                closestSoldier = soldier;
            }
        }
        this.targetSoldier = closestSoldier;
    }
    // Attaquer un soldat à distance (lancer de hache)
    attackSoldierRanged(soldier) {
        if (!soldier || !soldier.active || !soldier.isAlive) return;
        // Animation de lancer
        if (this.axe) this.scene.tweens.add({
            targets: this.axe,
            rotation: Math.PI * 2,
            duration: 200,
            onComplete: ()=>{
                if (this.axe) this.axe.rotation = 0;
            }
        });
        // Créer la hache volante
        const CONFIG = {
            TILE_SIZE: 64
        };
        const T = CONFIG.TILE_SIZE * (this.scene.scaleFactor || 1);
        const startX = this.x;
        const startY = this.y;
        const endX = soldier.x;
        const endY = soldier.y;
        const axe = this.scene.add.graphics();
        axe.fillStyle(0x888888);
        axe.fillRect(-2, -4, 4, 8); // Manche
        axe.fillStyle(0xcccccc);
        axe.beginPath();
        axe.moveTo(2, -4);
        axe.lineTo(8, -8);
        axe.lineTo(8, 0);
        axe.closePath();
        axe.fillPath();
        axe.setPosition(startX, startY);
        axe.setDepth(102);
        // Rotation de la hache pendant le vol
        this.scene.tweens.add({
            targets: axe,
            rotation: Math.PI * 4,
            duration: 500
        });
        // Trajectoire de la hache
        this.scene.tweens.add({
            targets: axe,
            x: endX,
            y: endY,
            duration: 500,
            ease: "Power2",
            onComplete: ()=>{
                // Impact sur le soldat
                if (soldier && soldier.active && soldier.isAlive) {
                    soldier.takeDamage(this.attackDamage);
                    // Particules d'impact
                    for(let i = 0; i < 5; i++){
                        const particle = this.scene.add.circle(endX + (Math.random() - 0.5) * 15, endY + (Math.random() - 0.5) * 15, 2, 0xff6600, 1);
                        particle.setDepth(103);
                        this.scene.tweens.add({
                            targets: particle,
                            alpha: 0,
                            scale: 0,
                            duration: 300,
                            onComplete: ()=>particle.destroy()
                        });
                    }
                }
                axe.destroy();
            }
        });
    }
    drawHealthBar(scene) {
        const yOffset = -50;
        const width = 40;
        const height = 6;
        // Cadre noir + bordure blanche
        this.hpBg = scene.add.rectangle(0, yOffset, width + 2, height + 2, 0x000000);
        this.hpBg.setStrokeStyle(1, 0xffffff);
        // Fond rouge sombre (vie manquante)
        this.hpRed = scene.add.rectangle(0, yOffset, width, height, 0x330000);
        // Barre verte (vie actuelle) - Ancrage à gauche (0, 0.5)
        this.hpGreen = scene.add.rectangle(-width / 2, yOffset, width, height, 0x00ff00);
        this.hpGreen.setOrigin(0, 0.5);
        this.add([
            this.hpBg,
            this.hpRed,
            this.hpGreen
        ]);
        this.hpBg.setDepth(100);
        this.hpRed.setDepth(100);
        this.hpGreen.setDepth(100);
    }
    spawn() {
        // Sécurité si path est null
        if (!this.path) return;
        this.isBlocked = false;
        this.blockedBy = null;
        // Initialiser la direction (par défaut vers la droite)
        this.facingRight = true;
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
                // Ne pas bouger si bloqué
                if (this.isBlocked) return;
                const p = this.path.getPoint(this.follower.t, this.follower.vec);
                this.setPosition(p.x, p.y);
                // Déterminer la direction de mouvement pour le flip
                const nextT = Math.min(this.follower.t + 0.01, 1);
                const nextP = this.path.getPoint(nextT);
                const dx = nextP.x - p.x;
                const dy = nextP.y - p.y;
                // Utiliser le flip horizontal au lieu de rotation
                // On détermine la direction principale (horizontal ou vertical)
                // Si le mouvement est principalement horizontal, on flip selon dx
                // Si le mouvement est principalement vertical, on garde la dernière direction horizontale
                const absDx = Math.abs(dx);
                const absDy = Math.abs(dy);
                // Si le mouvement horizontal est significatif, on change la direction
                if (absDx > absDy * 0.3) {
                    const shouldFaceRight = dx > 0;
                    if (shouldFaceRight !== this.facingRight) {
                        this.facingRight = shouldFaceRight;
                        // Appliquer le flip sur le bodyGroup
                        this.bodyGroup.setScale(this.facingRight ? 1 : -1, 1);
                    }
                }
                // Garder l'ennemi toujours droit (pas de rotation)
                // L'ennemi reste vertical, seule la direction horizontale change
                this.bodyGroup.rotation = 0;
            },
            onComplete: ()=>{
                if (this.active && !this.isBlocked) {
                    this.scene.takeDamage();
                    this.destroy();
                }
            }
        });
        // Stocker la référence au tween pour pouvoir le mettre en pause/reprendre
        this.follower.tween = tween;
    }
    damage(amount) {
        this.hp -= amount;
        // Mettre à jour le tooltip si visible
        if (this.hpTooltip) this.hpTooltip.setText(`${this.hp} / ${this.maxHp} HP`);
        // Flash blanc
        if (this.bodyGroup) this.scene.tweens.add({
            targets: this.bodyGroup,
            alpha: 0.5,
            duration: 50,
            yoyo: true
        });
        this.updateHealthBar();
        if (this.hp <= 0) {
            // Libérer le soldat qui bloque cet ennemi
            if (this.isBlocked && this.blockedBy) this.blockedBy.releaseEnemy();
            this.hideHpTooltip();
            this.scene.earnMoney(this.stats.reward);
            this.explode();
            this.destroy();
        }
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
}

},{"../config/settings.js":"9kTMs","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"lbJGU":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Turret", ()=>Turret);
var _indexJs = require("../config/turrets/index.js");
class Turret extends Phaser.GameObjects.Container {
    constructor(scene, x, y, config){
        super(scene, x, y);
        this.scene = scene;
        // Clone de la config
        this.config = JSON.parse(JSON.stringify(typeof config === "string" ? (0, _indexJs.TURRETS)[config] : config));
        const originalConfig = typeof config === "string" ? (0, _indexJs.TURRETS)[config] : config;
        this.config.onDrawBarrel = originalConfig.onDrawBarrel;
        this.config.onFire = originalConfig.onFire;
        // Valeur par défaut si maxLevel n'est pas défini dans la config
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
        this.on("pointerover", ()=>this.rangeCircle.setVisible(true));
        this.on("pointerout", ()=>this.rangeCircle.setVisible(false));
        scene.add.existing(this);
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
    // --- LOGIQUE D'AMÉLIORATION CORRIGÉE ---
    getNextLevelStats() {
        // Si on a atteint le niveau max défini pour CETTE tourelle, pas d'upgrade
        if (this.level >= this.config.maxLevel) return null;
        // Utiliser les valeurs actuelles de la config (qui sont déjà mises à jour après upgrade)
        let nextDmg = this.config.damage || 0;
        let nextRate = this.config.rate || 0;
        let nextRange = this.config.range || 0;
        let nextAoE = this.config.aoe || 0;
        let cost = 0;
        const baseCost = (0, _indexJs.TURRETS)[this.config.key]?.cost || 0;
        if (this.level === 1) {
            // Niv 1 -> 2
            nextDmg = Math.round(nextDmg * 1.5);
            nextRate = Math.round(nextRate / 1.2);
            nextRange = Math.round(nextRange * 1.2);
            if (nextAoE > 0) nextAoE = Math.round(nextAoE * 1.3);
            cost = Math.floor(baseCost * 2.5);
        } else if (this.level === 2) {
            // Niv 2 -> 3
            nextDmg = Math.round(nextDmg * 1.3);
            nextRate = Math.round(nextRate / 1.5);
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
        this.config.damage = nextStats.damage;
        this.config.rate = nextStats.rate;
        this.config.range = nextStats.range;
        if (nextStats.aoe) this.config.aoe = nextStats.aoe;
        // Le coût pour le prochain niveau (informatif, sert à l'affichage si on reclique)
        // Mais getNextLevelStats gère ça dynamiquement, donc pas besoin de stocker le "prochain coût" ici.
        // Mise à jour visuelle
        this.rangeCircle.setRadius(this.config.range);
        this.drawBase();
        this.drawBarrel();
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
    update(time, enemies) {
        const rate = this.config.rate || 1000;
        if (time > this.lastFired) {
            const target = this.findTarget(enemies);
            if (target) {
                const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
                this.barrelGroup.rotation = Phaser.Math.Angle.RotateTo(this.barrelGroup.rotation, angle, 0.2);
                if (Math.abs(Phaser.Math.Angle.ShortestBetween(this.barrelGroup.rotation, angle)) < 0.5) {
                    this.fire(target);
                    this.lastFired = time + rate;
                }
            }
        }
    }
    findTarget(enemies) {
        let nearest = null;
        let minDist = this.config.range;
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
        this.scene.tweens.add({
            targets: this.barrelGroup,
            x: -6 * Math.cos(this.barrelGroup.rotation),
            y: -6 * Math.sin(this.barrelGroup.rotation),
            duration: 60,
            yoyo: true,
            ease: "Quad.easeOut"
        });
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
    // Placer le soldat sur le chemin
    deployToPath(paths) {
        if (!this.scene) return;
        const position = this.findPathPosition(paths);
        if (position && this.isPositionOnPath(position.x, position.y)) {
            this.setPosition(position.x, position.y);
            // Animation d'apparition
            this.setScale(0);
            if (this.scene.tweens) this.scene.tweens.add({
                targets: this,
                scale: this.scene.scaleFactor || 1,
                duration: 300,
                ease: "Back.easeOut"
            });
        } else {
            // Si on ne trouve pas de position valide, essayer de trouver un point sur le chemin le plus proche
            // en cherchant directement dans la map
            const CONFIG = {
                TILE_SIZE: 64
            };
            const T = CONFIG.TILE_SIZE * (this.scene.scaleFactor || 1);
            // Utiliser mapStartX et mapStartY au lieu de MAP_OFFSET
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
            if (closestTile && this.scene && this.scene.tweens) {
                this.setPosition(closestTile.x, closestTile.y);
                this.setScale(0);
                this.scene.tweens.add({
                    targets: this,
                    scale: this.scene.scaleFactor || 1,
                    duration: 300,
                    ease: "Back.easeOut"
                });
            }
        }
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
        // Redéployer sur le chemin
        if (this.scene.paths) this.deployToPath(this.scene.paths);
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
        this.createPaths();
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
        this.scene.isWaveRunning = true;
        this.scene.waveBtnText.setText("\u26A0\uFE0F EN COURS");
        this.scene.waveBtnBg.setStrokeStyle(3, 0xffaa00);
        const waveGroups = this.scene.levelConfig.waves[this.scene.currentWaveIndex];
        let totalEnemiesInWave = 0;
        let spawnedTotal = 0;
        waveGroups.forEach((g)=>totalEnemiesInWave += g.count);
        waveGroups.forEach((group)=>{
            this.scene.time.addEvent({
                delay: group.interval,
                repeat: group.count - 1,
                callback: ()=>{
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
        });
    }
    monitorWaveEnd() {
        this.scene.endCheckTimer = this.scene.time.addEvent({
            delay: 500,
            loop: true,
            callback: ()=>{
                if (this.scene.enemies.getLength() === 0) this.finishWave();
            }
        });
    }
    finishWave() {
        if (this.scene.endCheckTimer) this.scene.endCheckTimer.remove();
        this.scene.isWaveRunning = false;
        this.scene.currentWaveIndex++;
        this.scene.earnMoney(50 + this.scene.currentWaveIndex * 20);
        if (this.scene.currentWaveIndex >= this.scene.levelConfig.waves.length) this.levelComplete();
        else {
            this.scene.waveBtnText.setText(`\u{25B6} VAGUE ${this.scene.currentWaveIndex + 1}`);
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
        this.scene.upgradeTextLines = [];
    }
    createUI() {
        const UI_HEIGHT = (0, _settingsJs.CONFIG).UI_HEIGHT * this.scene.scaleFactor;
        const fontSize = Math.max(16, 24 * this.scene.scaleFactor);
        const smallFontSize = Math.max(12, 18 * this.scene.scaleFactor);
        const topBar = this.scene.add.container(0, 0).setDepth(100);
        const bgBar = this.scene.add.graphics();
        bgBar.fillStyle(0x111111, 1);
        bgBar.fillRect(0, 0, this.scene.gameWidth, UI_HEIGHT);
        bgBar.fillStyle(0x00ccff, 0.5);
        bgBar.fillRect(0, UI_HEIGHT - 2 * this.scene.scaleFactor, this.scene.gameWidth, 2 * this.scene.scaleFactor);
        topBar.add(bgBar);
        this.scene.txtMoney = this.scene.add.text(20 * this.scene.scaleFactor, UI_HEIGHT / 2, "", {
            fontSize: `${fontSize}px`,
            fill: "#ffd700",
            fontStyle: "bold",
            fontFamily: "Arial"
        }).setOrigin(0, 0.5);
        topBar.add(this.scene.txtMoney);
        this.scene.txtLives = this.scene.add.text(250 * this.scene.scaleFactor, UI_HEIGHT / 2, "", {
            fontSize: `${fontSize}px`,
            fill: "#ff4444",
            fontStyle: "bold",
            fontFamily: "Arial"
        }).setOrigin(0, 0.5);
        topBar.add(this.scene.txtLives);
        const quitBtn = this.scene.add.text(this.scene.gameWidth - 20 * this.scene.scaleFactor, UI_HEIGHT / 2, "QUITTER", {
            fontSize: `${smallFontSize}px`,
            fill: "#aaaaaa",
            backgroundColor: "#333333",
            padding: {
                x: 10 * this.scene.scaleFactor,
                y: 5 * this.scene.scaleFactor
            }
        }).setOrigin(1, 0.5).setInteractive({
            useHandCursor: true
        }).on("pointerover", ()=>quitBtn.setColor("#ffffff")).on("pointerout", ()=>quitBtn.setColor("#aaaaaa")).on("pointerdown", ()=>this.scene.scene.start("MainMenuScene"));
        topBar.add(quitBtn);
        this.scene.updateUI();
        const btnWidth = 300 * this.scene.scaleFactor;
        const btnHeight = 60 * this.scene.scaleFactor;
        const wx = this.scene.gameWidth - 180 * this.scene.scaleFactor;
        const wy = this.scene.mapStartY + 15 * (0, _settingsJs.CONFIG).TILE_SIZE * this.scene.scaleFactor - btnHeight - 10 * this.scene.scaleFactor;
        this.scene.waveBtnContainer = this.scene.add.container(wx, wy).setDepth(100);
        this.scene.waveBtnBg = this.scene.add.rectangle(0, 0, btnWidth, btnHeight, 0x000000, 0.8).setStrokeStyle(3 * this.scene.scaleFactor, 0x00ff00);
        this.scene.waveBtnText = this.scene.add.text(0, 0, "\u25B6 LANCER VAGUE 1", {
            fontSize: `${Math.max(16, 22 * this.scene.scaleFactor)}px`,
            fill: "#ffffff",
            fontStyle: "bold"
        }).setOrigin(0.5);
        this.scene.waveBtnContainer.add([
            this.scene.waveBtnBg,
            this.scene.waveBtnText
        ]);
        this.scene.waveBtnBg.setInteractive({
            useHandCursor: true
        }).on("pointerdown", ()=>this.scene.startWave());
        this.createBuildMenu();
        this.createUpgradeMenu();
    }
    createBuildMenu() {
        this.scene.buildMenu = this.scene.add.container(0, 0).setVisible(false).setDepth(240);
        const menuWidth = 320 * this.scene.scaleFactor;
        const menuHeight = 220 * this.scene.scaleFactor;
        const mBgGraphics = this.scene.add.graphics();
        mBgGraphics.fillStyle(0x000000, 0.5);
        mBgGraphics.fillRoundedRect(4 * this.scene.scaleFactor, 4 * this.scene.scaleFactor, menuWidth, menuHeight, 15);
        mBgGraphics.fillStyle(0x0f0f1a, 0.98);
        mBgGraphics.fillRoundedRect(0, 0, menuWidth, menuHeight, 15);
        mBgGraphics.lineStyle(4, 0x00ccff, 1);
        mBgGraphics.strokeRoundedRect(0, 0, menuWidth, menuHeight, 15);
        mBgGraphics.lineStyle(2, 0x0066aa, 0.6);
        mBgGraphics.strokeRoundedRect(2 * this.scene.scaleFactor, 2 * this.scene.scaleFactor, menuWidth - 4 * this.scene.scaleFactor, menuHeight - 4 * this.scene.scaleFactor, 13);
        mBgGraphics.lineStyle(2, 0x00ccff, 0.8);
        mBgGraphics.beginPath();
        mBgGraphics.moveTo(15 * this.scene.scaleFactor, 42 * this.scene.scaleFactor);
        mBgGraphics.lineTo(menuWidth - 15 * this.scene.scaleFactor, 42 * this.scene.scaleFactor);
        mBgGraphics.strokePath();
        const buildTitle = this.scene.add.text(menuWidth / 2, 25 * this.scene.scaleFactor, "CONSTRUIRE", {
            fontSize: `${Math.max(18, 22 * this.scene.scaleFactor)}px`,
            fill: "#00ccff",
            fontStyle: "bold",
            stroke: "#003366",
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(241);
        this.scene.buildMenu.add([
            mBgGraphics,
            buildTitle
        ]);
        const btnSpacing = 34 * this.scene.scaleFactor;
        const startY = 55 * this.scene.scaleFactor;
        const btnX = menuWidth / 2;
        const btn1 = this.createBuildBtn(btnX, startY, (0, _indexJs.TURRETS).machine_gun);
        const btn2 = this.createBuildBtn(btnX, startY + btnSpacing, (0, _indexJs.TURRETS).sniper);
        const btn3 = this.createBuildBtn(btnX, startY + btnSpacing * 2, (0, _indexJs.TURRETS).cannon);
        const btn4 = this.createBuildBtn(btnX, startY + btnSpacing * 3, (0, _indexJs.TURRETS).zap);
        const btn5 = this.createBuildBtn(btnX, startY + btnSpacing * 4, (0, _indexJs.TURRETS).barracks);
        this.scene.buildMenu.add([
            btn1,
            btn2,
            btn3,
            btn4,
            btn5
        ]);
    }
    createBuildBtn(x, y, turretConfig) {
        const fontSize = Math.max(14, 16 * this.scene.scaleFactor);
        const btnWidth = 290 * this.scene.scaleFactor;
        const btnHeight = 32 * this.scene.scaleFactor;
        const btnContainer = this.scene.add.container(x, y);
        const btnBg = this.scene.add.rectangle(0, 0, btnWidth, btnHeight, 0x1a1a2e, 0.95);
        btnBg.setStrokeStyle(2, 0x00ccff, 0.7);
        btnBg.setInteractive({
            useHandCursor: true
        });
        const nameText = this.scene.add.text(0, -7 * this.scene.scaleFactor, turretConfig.name, {
            fontSize: `${fontSize}px`,
            fill: "#ffffff",
            fontStyle: "bold"
        }).setOrigin(0.5, 0.5);
        const costText = this.scene.add.text(0, 7 * this.scene.scaleFactor, `${turretConfig.cost}$`, {
            fontSize: `${fontSize - 2}px`,
            fill: "#ffd700",
            fontStyle: "bold"
        }).setOrigin(0.5, 0.5);
        const canAfford = this.scene.money >= turretConfig.cost;
        if (!canAfford) {
            nameText.setColor("#666666");
            costText.setColor("#ff4444");
            btnBg.setFillStyle(0x0f0f0f, 0.8);
            btnBg.setStrokeStyle(2, 0x666666, 0.5);
        }
        btnContainer.add([
            btnBg,
            nameText,
            costText
        ]);
        btnBg.on("pointerover", ()=>{
            const canAffordNow = this.scene.money >= turretConfig.cost;
            if (canAffordNow) {
                btnBg.setFillStyle(0x2a2a4e, 1);
                btnBg.setStrokeStyle(3, 0x00ffff, 1);
                if (nameText) nameText.setColor("#ffffff");
                if (costText) costText.setColor("#ffff00");
            }
        });
        btnBg.on("pointerout", ()=>{
            const canAffordNow = this.scene.money >= turretConfig.cost;
            if (canAffordNow) {
                btnBg.setFillStyle(0x1a1a2e, 0.95);
                btnBg.setStrokeStyle(2, 0x00ccff, 0.7);
                if (nameText) nameText.setColor("#ffffff");
                if (costText) costText.setColor("#ffd700");
            } else {
                btnBg.setFillStyle(0x0f0f0f, 0.8);
                btnBg.setStrokeStyle(2, 0x666666, 0.5);
                if (nameText) nameText.setColor("#666666");
                if (costText) costText.setColor("#ff4444");
            }
        });
        btnBg.on("pointerdown", ()=>{
            if (this.scene.selectedTile) {
                if (this.scene.money >= turretConfig.cost) {
                    const success = this.scene.buildTurret(turretConfig, this.scene.selectedTile.x, this.scene.selectedTile.y);
                    if (success) this.scene.buildMenu.setVisible(false);
                } else this.scene.cameras.main.shake(50, 0.005);
            }
        });
        btnContainer.turretConfig = turretConfig;
        btnContainer.btnBg = btnBg;
        btnContainer.nameText = nameText;
        btnContainer.costText = costText;
        return btnContainer;
    }
    updateBuildMenuButtons() {
        if (!this.scene.buildMenu || !this.scene.buildMenu.list) return;
        this.scene.buildMenu.list.forEach((item)=>{
            if (item && item.turretConfig) {
                const config = item.turretConfig;
                const canAfford = this.scene.money >= config.cost;
                if (item.nameText) item.nameText.setColor(canAfford ? "#ffffff" : "#666666");
                if (item.costText) item.costText.setColor(canAfford ? "#ffd700" : "#ff4444");
                if (item.btnBg) {
                    item.btnBg.setFillStyle(canAfford ? 0x1a1a2e : 0x0f0f0f, canAfford ? 0.95 : 0.8);
                    item.btnBg.setStrokeStyle(2, canAfford ? 0x00ccff : 0x666666, canAfford ? 0.7 : 0.5);
                }
            }
        });
    }
    openBuildMenu(pointer) {
        const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scene.scaleFactor;
        const tx = Math.floor((pointer.worldX - this.scene.mapStartX) / T);
        const ty = Math.floor((pointer.worldY - this.scene.mapStartY) / T);
        this.scene.selectedTile = {
            x: tx,
            y: ty
        };
        this.scene.selectedTileIsAdjacentToPath = this.scene.mapManager.isAdjacentToPath(tx, ty);
        const menuWidth = 320 * this.scene.scaleFactor;
        const menuHeight = 220 * this.scene.scaleFactor;
        let menuX = pointer.worldX;
        let menuY = pointer.worldY;
        if (menuX + menuWidth / 2 > this.scene.gameWidth) menuX = this.scene.gameWidth - menuWidth / 2 - 10 * this.scene.scaleFactor;
        if (menuX - menuWidth / 2 < 0) menuX = menuWidth / 2 + 10 * this.scene.scaleFactor;
        if (menuY + menuHeight / 2 > this.scene.gameHeight) menuY = this.scene.gameHeight - menuHeight / 2 - 10 * this.scene.scaleFactor;
        if (menuY - menuHeight / 2 < 0) menuY = menuHeight / 2 + 10 * this.scene.scaleFactor;
        this.scene.buildMenu.setPosition(menuX - menuWidth / 2, menuY - menuHeight / 2);
        this.scene.buildMenu.setVisible(true);
        this.updateBuildMenuButtons();
    }
    createUpgradeMenu() {
        this.scene.upgradeMenu = this.scene.add.container(0, 0).setVisible(false).setDepth(240);
        const uBgGraphics = this.scene.add.graphics();
        uBgGraphics.fillStyle(0x222222, 0.95);
        uBgGraphics.fillRoundedRect(0, 0, 320 * this.scene.scaleFactor, 220 * this.scene.scaleFactor, 10);
        uBgGraphics.lineStyle(3, 0xffffff, 0.3);
        uBgGraphics.strokeRoundedRect(0, 0, 320 * this.scene.scaleFactor, 220 * this.scene.scaleFactor, 10);
        uBgGraphics.setDepth(240);
        this.scene.upgradeMenu.add(uBgGraphics);
        this.scene.upgradeInfoText = null;
        this.scene.upgradeBtnText = this.scene.add.text(15 * this.scene.scaleFactor, 170 * this.scene.scaleFactor, "AM\xc9LIORER", {
            fontSize: `${Math.max(14, 18 * this.scene.scaleFactor)}px`,
            fill: "#ffffff",
            fontStyle: "bold",
            backgroundColor: "#00aa00",
            padding: {
                x: 15 * this.scene.scaleFactor,
                y: 8 * this.scene.scaleFactor
            }
        }).setDepth(241).setInteractive({
            useHandCursor: true
        }).on("pointerover", ()=>{
            if (this.scene.selectedTurret && this.scene.selectedTurret.getNextLevelStats()) this.scene.upgradeBtnText.setBackgroundColor("#00cc00");
        }).on("pointerout", ()=>{
            this.scene.upgradeBtnText.setBackgroundColor("#00aa00");
        }).on("pointerdown", ()=>{
            if (this.scene.selectedTurret && this.scene.selectedTurret.getNextLevelStats()) this.scene.triggerUpgrade();
            else {
                this.scene.upgradeMenu.setVisible(false);
                this.scene.selectedTurret = null;
            }
        });
        this.scene.upgradeMenu.add(this.scene.upgradeBtnText);
    }
    openUpgradeMenu(pointer, turret) {
        this.scene.selectedTurret = turret;
        const menuWidth = 320 * this.scene.scaleFactor;
        const menuHeight = 220 * this.scene.scaleFactor;
        const menuX = Phaser.Math.Clamp(pointer.worldX, menuWidth / 2, this.scene.gameWidth - menuWidth / 2);
        const menuY = Phaser.Math.Clamp(pointer.worldY, menuHeight / 2, this.scene.gameHeight - menuHeight / 2);
        this.scene.upgradeMenu.setPosition(menuX - menuWidth / 2, menuY - menuHeight / 2);
        if (this.scene.upgradeInfoText) {
            try {
                if (this.scene.upgradeInfoText.active) this.scene.upgradeInfoText.destroy();
            } catch (e) {
                console.warn("Erreur lors de la destruction d'upgradeInfoText:", e);
            }
            this.scene.upgradeInfoText = null;
        }
        if (this.scene.upgradeTextLines && this.scene.upgradeTextLines.length > 0) {
            this.scene.upgradeTextLines.forEach((line)=>{
                if (line) try {
                    // Retirer du container avant de détruire si possible
                    if (this.scene.upgradeMenu && this.scene.upgradeMenu.remove) this.scene.upgradeMenu.remove(line);
                    // Détruire seulement si l'objet est actif
                    if (line.active !== false && line.destroy) line.destroy();
                } catch (e) {
                // Ignorer les erreurs de destruction (objet déjà détruit)
                }
            });
            this.scene.upgradeTextLines = [];
        } else this.scene.upgradeTextLines = [];
        const fontSize = Math.max(14, 16 * this.scene.scaleFactor);
        let yPos = 20 * this.scene.scaleFactor;
        const lineHeight = 22 * this.scene.scaleFactor;
        const xPos = 15 * this.scene.scaleFactor;
        if (turret instanceof (0, _barracksJs.Barracks)) {
            const level = turret.level || 1;
            const soldiersCount = turret.config.soldiersCount[level - 1] || 2;
            const respawnTime = turret.config.respawnTime[level - 1] || 12000;
            const soldierHp = turret.config.soldierHp[level - 1] || 100;
            const nextStats = turret.getNextLevelStats();
            const title = this.scene.add.text(xPos, yPos, `Caserne - Niveau ${level}`, {
                fontSize: `${fontSize + 2}px`,
                fill: "#ffffff",
                fontStyle: "bold"
            }).setDepth(241);
            this.scene.upgradeTextLines.push(title);
            this.scene.upgradeMenu.add(title);
            yPos += lineHeight * 1.5;
            if (nextStats) {
                const nextSoldiers = turret.config.soldiersCount[level] || 3;
                const nextRespawn = turret.config.respawnTime[level] || 10000;
                const nextHp = turret.config.soldierHp[level] || 120;
                const soldiersText = this.scene.add.text(xPos, yPos, `Soldats : ${soldiersCount} > `, {
                    fontSize: `${fontSize}px`,
                    fill: "#ffffff"
                }).setDepth(241);
                const soldiersNext = this.scene.add.text(xPos + soldiersText.width, yPos, `${nextSoldiers}`, {
                    fontSize: `${fontSize}px`,
                    fill: "#00ff00",
                    fontStyle: "bold"
                }).setDepth(241);
                this.scene.upgradeTextLines.push(soldiersText, soldiersNext);
                this.scene.upgradeMenu.add([
                    soldiersText,
                    soldiersNext
                ]);
                yPos += lineHeight;
                const respawnText = this.scene.add.text(xPos, yPos, `Respawn : ${(respawnTime / 1000).toFixed(1)}s > `, {
                    fontSize: `${fontSize}px`,
                    fill: "#ffffff"
                }).setDepth(241);
                const respawnNext = this.scene.add.text(xPos + respawnText.width, yPos, `${(nextRespawn / 1000).toFixed(1)}s`, {
                    fontSize: `${fontSize}px`,
                    fill: "#00ff00",
                    fontStyle: "bold"
                }).setDepth(241);
                this.scene.upgradeTextLines.push(respawnText, respawnNext);
                this.scene.upgradeMenu.add([
                    respawnText,
                    respawnNext
                ]);
                yPos += lineHeight;
                const hpText = this.scene.add.text(xPos, yPos, `HP Soldat : ${soldierHp} > `, {
                    fontSize: `${fontSize}px`,
                    fill: "#ffffff"
                }).setDepth(241);
                const hpNext = this.scene.add.text(xPos + hpText.width, yPos, `${nextHp}`, {
                    fontSize: `${fontSize}px`,
                    fill: "#00ff00",
                    fontStyle: "bold"
                }).setDepth(241);
                this.scene.upgradeTextLines.push(hpText, hpNext);
                this.scene.upgradeMenu.add([
                    hpText,
                    hpNext
                ]);
                yPos += lineHeight * 1.5;
                const costText = this.scene.add.text(xPos, yPos, `Co\xfbt : `, {
                    fontSize: `${fontSize}px`,
                    fill: "#ffffff"
                }).setDepth(241);
                const costValue = this.scene.add.text(xPos + costText.width, yPos, `${nextStats.cost}$`, {
                    fontSize: `${fontSize}px`,
                    fill: "#ffd700",
                    fontStyle: "bold"
                }).setDepth(241);
                this.scene.upgradeTextLines.push(costText, costValue);
                this.scene.upgradeMenu.add([
                    costText,
                    costValue
                ]);
            } else {
                const soldiersText = this.scene.add.text(xPos, yPos, `Soldats : ${soldiersCount}`, {
                    fontSize: `${fontSize}px`,
                    fill: "#ffffff"
                }).setDepth(241);
                this.scene.upgradeTextLines.push(soldiersText);
                this.scene.upgradeMenu.add(soldiersText);
                yPos += lineHeight;
                const respawnText = this.scene.add.text(xPos, yPos, `Respawn : ${(respawnTime / 1000).toFixed(1)}s`, {
                    fontSize: `${fontSize}px`,
                    fill: "#ffffff"
                }).setDepth(241);
                this.scene.upgradeTextLines.push(respawnText);
                this.scene.upgradeMenu.add(respawnText);
                yPos += lineHeight;
                const hpText = this.scene.add.text(xPos, yPos, `HP Soldat : ${soldierHp}`, {
                    fontSize: `${fontSize}px`,
                    fill: "#ffffff"
                }).setDepth(241);
                this.scene.upgradeTextLines.push(hpText);
                this.scene.upgradeMenu.add(hpText);
                yPos += lineHeight * 1.5;
                const maxText = this.scene.add.text(xPos, yPos, `Niveau Maximum`, {
                    fontSize: `${fontSize}px`,
                    fill: "#ff0000",
                    fontStyle: "bold"
                }).setDepth(241);
                this.scene.upgradeTextLines.push(maxText);
                this.scene.upgradeMenu.add(maxText);
            }
        } else {
            const level = turret.level || 1;
            const nextStats = turret.getNextLevelStats();
            const title = this.scene.add.text(xPos, yPos, `${turret.config.name} - Niveau ${level}`, {
                fontSize: `${fontSize + 2}px`,
                fill: "#ffffff",
                fontStyle: "bold"
            }).setDepth(241);
            this.scene.upgradeTextLines.push(title);
            this.scene.upgradeMenu.add(title);
            yPos += lineHeight * 1.5;
            if (nextStats) {
                const currentDamage = turret.config.damage || 0;
                const currentRate = turret.config.rate || 0;
                const currentRange = turret.config.range || 0;
                const damageText = this.scene.add.text(xPos, yPos, `D\xe9g\xe2ts : ${currentDamage} > `, {
                    fontSize: `${fontSize}px`,
                    fill: "#ffffff"
                }).setDepth(241);
                const damageNext = this.scene.add.text(xPos + damageText.width, yPos, `${nextStats.damage || 0}`, {
                    fontSize: `${fontSize}px`,
                    fill: "#00ff00",
                    fontStyle: "bold"
                }).setDepth(241);
                this.scene.upgradeTextLines.push(damageText, damageNext);
                this.scene.upgradeMenu.add([
                    damageText,
                    damageNext
                ]);
                yPos += lineHeight;
                const rateText = this.scene.add.text(xPos, yPos, `Cadence : ${(currentRate / 1000).toFixed(1)}s > `, {
                    fontSize: `${fontSize}px`,
                    fill: "#ffffff"
                }).setDepth(241);
                const rateNext = this.scene.add.text(xPos + rateText.width, yPos, `${((nextStats.rate || 0) / 1000).toFixed(1)}s`, {
                    fontSize: `${fontSize}px`,
                    fill: "#00ff00",
                    fontStyle: "bold"
                }).setDepth(241);
                this.scene.upgradeTextLines.push(rateText, rateNext);
                this.scene.upgradeMenu.add([
                    rateText,
                    rateNext
                ]);
                yPos += lineHeight;
                const rangeText = this.scene.add.text(xPos, yPos, `Port\xe9e : ${currentRange} > `, {
                    fontSize: `${fontSize}px`,
                    fill: "#ffffff"
                }).setDepth(241);
                const rangeNext = this.scene.add.text(xPos + rangeText.width, yPos, `${nextStats.range || 0}`, {
                    fontSize: `${fontSize}px`,
                    fill: "#00ff00",
                    fontStyle: "bold"
                }).setDepth(241);
                this.scene.upgradeTextLines.push(rangeText, rangeNext);
                this.scene.upgradeMenu.add([
                    rangeText,
                    rangeNext
                ]);
                yPos += lineHeight;
                if (nextStats.aoe) {
                    const aoeText = this.scene.add.text(xPos, yPos, `Zone : ${turret.config.aoe || 0} > `, {
                        fontSize: `${fontSize}px`,
                        fill: "#ffffff"
                    }).setDepth(241);
                    const aoeNext = this.scene.add.text(xPos + aoeText.width, yPos, `${nextStats.aoe}`, {
                        fontSize: `${fontSize}px`,
                        fill: "#00ff00",
                        fontStyle: "bold"
                    }).setDepth(241);
                    this.scene.upgradeTextLines.push(aoeText, aoeNext);
                    this.scene.upgradeMenu.add([
                        aoeText,
                        aoeNext
                    ]);
                    yPos += lineHeight;
                }
                yPos += lineHeight * 0.5;
                const costText = this.scene.add.text(xPos, yPos, `Co\xfbt : `, {
                    fontSize: `${fontSize}px`,
                    fill: "#ffffff"
                }).setDepth(241);
                const costValue = this.scene.add.text(xPos + costText.width, yPos, `${nextStats.cost}$`, {
                    fontSize: `${fontSize}px`,
                    fill: "#ffd700",
                    fontStyle: "bold"
                }).setDepth(241);
                this.scene.upgradeTextLines.push(costText, costValue);
                this.scene.upgradeMenu.add([
                    costText,
                    costValue
                ]);
            } else {
                const currentDamage = turret.config.damage || 0;
                const currentRate = turret.config.rate || 0;
                const currentRange = turret.config.range || 0;
                const damageText = this.scene.add.text(xPos, yPos, `D\xe9g\xe2ts : ${currentDamage}`, {
                    fontSize: `${fontSize}px`,
                    fill: "#ffffff"
                }).setDepth(241);
                this.scene.upgradeTextLines.push(damageText);
                this.scene.upgradeMenu.add(damageText);
                yPos += lineHeight;
                const rateText = this.scene.add.text(xPos, yPos, `Cadence : ${(currentRate / 1000).toFixed(1)}s`, {
                    fontSize: `${fontSize}px`,
                    fill: "#ffffff"
                }).setDepth(241);
                this.scene.upgradeTextLines.push(rateText);
                this.scene.upgradeMenu.add(rateText);
                yPos += lineHeight;
                const rangeText = this.scene.add.text(xPos, yPos, `Port\xe9e : ${currentRange}`, {
                    fontSize: `${fontSize}px`,
                    fill: "#ffffff"
                }).setDepth(241);
                this.scene.upgradeTextLines.push(rangeText);
                this.scene.upgradeMenu.add(rangeText);
                yPos += lineHeight;
                if (turret.config.aoe) {
                    const aoeText = this.scene.add.text(xPos, yPos, `Zone : ${turret.config.aoe}`, {
                        fontSize: `${fontSize}px`,
                        fill: "#ffffff"
                    }).setDepth(241);
                    this.scene.upgradeTextLines.push(aoeText);
                    this.scene.upgradeMenu.add(aoeText);
                    yPos += lineHeight;
                }
                yPos += lineHeight * 0.5;
                const maxText = this.scene.add.text(xPos, yPos, `Niveau Maximum`, {
                    fontSize: `${fontSize}px`,
                    fill: "#ff0000",
                    fontStyle: "bold"
                }).setDepth(241);
                this.scene.upgradeTextLines.push(maxText);
                this.scene.upgradeMenu.add(maxText);
            }
        }
        const finalNextStats = turret.getNextLevelStats ? turret.getNextLevelStats() : null;
        this.scene.upgradeBtnText.setPosition(15 * this.scene.scaleFactor, menuHeight - 50 * this.scene.scaleFactor);
        this.scene.upgradeBtnText.setText(finalNextStats ? "AM\xc9LIORER" : "FERMER");
        if (finalNextStats) this.scene.upgradeBtnText.setBackgroundColor("#00aa00");
        else this.scene.upgradeBtnText.setBackgroundColor("#666666");
        this.scene.upgradeMenu.setVisible(true);
    }
}

},{"../../config/settings.js":"9kTMs","../../config/turrets/index.js":"97rhz","../../objects/Barracks.js":"bSlQd","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}]},["fILKw"], "fILKw", "parcelRequirebaba", {})

//# sourceMappingURL=towerdefense.1fcc916e.js.map
