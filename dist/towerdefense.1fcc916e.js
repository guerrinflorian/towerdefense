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
    fps: {
        target: 60,
        min: 30,
        forceSetTimeOut: true,
        pauseOnBlur: false,
        pauseOnHidden: false
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
    create() {
        const { width, height } = this.scale;
        const cx = width / 2;
        // --- 1. CONFIGURATION DES ESPACEMENTS (Ajustable ici) ---
        const TITLE_Y = 100; // Position du titre
        const LIST_START_Y = 240; // Où commence la liste (bien plus bas pour éviter le titre)
        const LIST_BOTTOM_Y = height - 120; // Où s'arrête la liste avant le bouton reset
        const VIEW_HEIGHT = LIST_BOTTOM_Y - LIST_START_Y;
        // --- 2. FOND ---
        this.cameras.main.setBackgroundColor("#05050a");
        if (this.textures.exists("background_main")) {
            const bg = this.add.image(cx, height / 2, "background_main");
            const scale = Math.max(width / bg.width, height / bg.height);
            bg.setScale(scale).setAlpha(0.2).setScrollFactor(0);
        }
        // --- 3. TITRE FIXE (Anglais - LAST OUTPOST) ---
        const title = this.add.text(cx, TITLE_Y, "LAST OUTPOST", {
            fontFamily: "Impact, sans-serif",
            fontSize: `${Math.max(45, width * 0.08)}px`,
            color: "#ffffff",
            letterSpacing: 8
        }).setOrigin(0.5).setDepth(100);
        title.setShadow(0, 5, "#00f2ff", 15, true, true);
        // --- 4. GESTION DE LA LISTE SCROLLABLE ---
        // On crée un conteneur pour les niveaux
        this.levelContainer = this.add.container(cx, LIST_START_Y);
        const levelReached = parseInt(localStorage.getItem("levelReached")) || 1;
        let currentY = 50; // On commence à 50 pour que le 1er bouton ne soit pas collé au bord du masque
        const spacing = 120;
        (0, _indexJs.LEVELS_CONFIG).forEach((level)=>{
            const isLocked = level.id > levelReached;
            const card = this.createLevelCard(0, currentY, level, isLocked);
            this.levelContainer.add(card);
            currentY += spacing;
        });
        const totalContentHeight = currentY;
        // --- 5. CRÉATION DU MASQUE ---
        // Le masque définit la zone "fenêtre" où les boutons sont visibles
        const maskShape = this.make.graphics();
        maskShape.fillStyle(0xffffff);
        // On dessine le rectangle de visibilité
        maskShape.fillRect(0, LIST_START_Y, width, VIEW_HEIGHT);
        const mask = maskShape.createGeometryMask();
        this.levelContainer.setMask(mask);
        // --- 6. LOGIQUE DE SCROLL (LIMITES STRICTES) ---
        const limitTop = LIST_START_Y;
        const limitBottom = totalContentHeight > VIEW_HEIGHT ? LIST_START_Y - (totalContentHeight - VIEW_HEIGHT) : LIST_START_Y;
        // Interaction Molette
        this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY)=>{
            this.levelContainer.y -= deltaY;
            this.clampScroll(limitTop, limitBottom);
        });
        // Interaction Drag (Tactile/Souris)
        let dragY = 0;
        this.input.on("pointerdown", (p)=>{
            dragY = this.levelContainer.y - p.y;
        });
        this.input.on("pointermove", (p)=>{
            if (p.isDown) {
                this.levelContainer.y = p.y + dragY;
                this.clampScroll(limitTop, limitBottom);
            }
        });
        // --- 7. BOUTON RÉINITIALISER (Bas de page) ---
        this.createResetButton(height - 50);
    }
    clampScroll(top, bottom) {
        if (this.levelContainer.y > top) this.levelContainer.y = top;
        if (this.levelContainer.y < bottom) this.levelContainer.y = bottom;
    }
    createLevelCard(x, y, level, isLocked) {
        const cardWidth = Math.min(this.scale.width * 0.85, 500);
        const cardHeight = 100;
        const container = this.add.container(x, y);
        const bg = this.add.graphics();
        const draw = (over = false)=>{
            bg.clear();
            bg.fillStyle(isLocked ? 0x1a1a1a : over ? 0x004488 : 0x002244, 0.8);
            bg.lineStyle(2, isLocked ? 0x333333 : over ? 0x00f2ff : 0x0088ff, 1);
            bg.fillRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 8);
            bg.strokeRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 8);
        };
        draw();
        const title = this.add.text(-cardWidth / 2 + 20, -20, `NIVEAU ${level.id}`, {
            fontSize: "18px",
            fontWeight: "bold",
            color: isLocked ? "#666" : "#00ccff",
            fontFamily: "Arial"
        });
        const name = this.add.text(-cardWidth / 2 + 20, 5, level.name.toUpperCase(), {
            fontSize: "22px",
            fontWeight: "900",
            color: isLocked ? "#444" : "#fff",
            fontFamily: "Arial"
        });
        container.add([
            bg,
            title,
            name
        ]);
        if (!isLocked) {
            const zone = this.add.zone(0, 0, cardWidth, cardHeight).setInteractive({
                useHandCursor: true
            });
            container.add(zone);
            zone.on("pointerover", ()=>{
                draw(true);
                container.setScale(1.02);
            });
            zone.on("pointerout", ()=>{
                draw(false);
                container.setScale(1);
            });
            zone.on("pointerdown", ()=>this.scene.start("GameScene", {
                    level: level.id
                }));
        }
        return container;
    }
    createResetButton(y) {
        const btn = this.add.text(this.scale.width / 2, y, "R\xc9INITIALISER LA PROGRESSION", {
            fontSize: "14px",
            color: "#555",
            fontFamily: "Arial",
            textDecoration: "underline"
        }).setOrigin(0.5).setInteractive({
            useHandCursor: true
        }).setDepth(100);
        btn.on("pointerover", ()=>btn.setColor("#ff0000"));
        btn.on("pointerout", ()=>btn.setColor("#555"));
        btn.on("pointerdown", ()=>{
            if (confirm("Voulez-vous vraiment effacer votre progression ?")) {
                localStorage.clear();
                this.scene.restart();
            }
        });
    }
    createAtmosphere() {
        // Particules simples pour le style
        if (!this.textures.exists("p")) {
            const g = this.make.graphics({
                x: 0,
                y: 0,
                add: false
            });
            g.fillStyle(0xffffff).fillCircle(2, 2, 2).generateTexture("p", 4, 4);
        }
        this.add.particles(0, 0, "p", {
            x: {
                min: 0,
                max: this.scale.width
            },
            y: {
                min: 0,
                max: this.scale.height
            },
            alpha: {
                start: 0.2,
                end: 0
            },
            scale: {
                start: 0.5,
                end: 0
            },
            speedY: {
                min: -10,
                max: -2
            },
            lifespan: 3000
        });
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
var _bosslvl3Js = require("../config/ennemies/bosslvl3.js");
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
    bosslvl3: (0, _bosslvl3Js.bosslvl3),
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

},{"../config/ennemies/grunt.js":"iqyIL","../config/ennemies/runner.js":"k54Ru","../config/ennemies/tank.js":"caNrh","../config/ennemies/shield.js":"BAQN3","../config/turrets/machineGun.js":"ecBws","../config/turrets/sniper.js":"fm2OQ","../config/turrets/cannon.js":"3RJPP","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT","../config/turrets/zap.js":"bgZGw","../config/turrets/barracks.js":"9rF1d","../config/ennemies/witch.js":"k759O","../config/ennemies/zombie_minion.js":"bONBj","../config/ennemies/bosslvl1.js":"lF8pq","../config/ennemies/bosslvl2.js":"hQduM","../config/ennemies/tortue_dragon.js":"bnkzu","../config/ennemies/shaman_gobelin.js":"8mFrl","../config/ennemies/diviseur.js":"7ppi2","../config/ennemies/slime_medium.js":"j7fMh","../config/ennemies/slime_small.js":"KCZbL","../config/ennemies/bosslvl3.js":"8MdQT"}],"iqyIL":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "grunt", ()=>grunt);
const grunt = {
    name: "Grunt",
    speed: 62,
    hp: 100,
    reward: 15,
    playerDamage: 2,
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
    speed: 205,
    hp: 112,
    reward: 20,
    playerDamage: 2,
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
    reward: 140,
    playerDamage: 6,
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
    reward: 65,
    playerDamage: 4,
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
    range: 115,
    damage: 76,
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
    playerDamage: 4,
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
    playerDamage: 1,
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
    playerDamage: 20,
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
    playerDamage: 20,
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
    playerDamage: 6,
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
    playerDamage: 4,
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
    playerDamage: 4,
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
    playerDamage: 2,
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
    playerDamage: 1,
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

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"8MdQT":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "bosslvl3", ()=>bosslvl3);
const bosslvl3 = {
    name: "OMEGA-TITAN",
    speed: 8,
    hp: 180000,
    reward: 5000,
    playerDamage: 20,
    color: 0xff4400,
    damage: 500,
    attackSpeed: 2000,
    scale: 1.6,
    onDraw: (scene, container, color, enemyInstance)=>{
        // Initialisation des références pour l'animation
        enemyInstance.gears = [];
        enemyInstance.pistons = [];
        // --- 1. FUMÉE VOLCANIQUE (Arrière-plan) ---
        // Des cercles gris qui tourneront autour de lui
        const smokeGroup = scene.add.container(0, 0);
        for(let i = 0; i < 6; i++){
            const smoke = scene.add.graphics();
            smoke.fillStyle(0x333333, 0.5);
            smoke.fillCircle(0, 0, 10 + Math.random() * 10);
            // Position aléatoire autour du centre
            smoke.x = (Math.random() - 0.5) * 60;
            smoke.y = (Math.random() - 0.5) * 60;
            smokeGroup.add(smoke);
        }
        container.add(smokeGroup);
        enemyInstance.smokeGroup = smokeGroup;
        // --- 2. JAMBES BLINDÉES ---
        // Deux gros rectangles noirs pour les pieds
        const legs = scene.add.graphics();
        legs.fillStyle(0x1a1a1a); // Acier noir
        legs.lineStyle(2, 0xff4400); // Bordure en fusion
        // Jambe G
        legs.fillRect(-30, 10, 20, 30);
        // Jambe D
        legs.fillRect(10, 10, 20, 30);
        legs.strokeRect(-30, 10, 20, 30);
        legs.strokeRect(10, 10, 20, 30);
        container.add(legs);
        // --- 3. CORPS (TORSE MASSIF) ---
        const torso = scene.add.graphics();
        torso.fillStyle(0x222222); // Gris foncé
        // Forme trapézoïdale pour faire "costaud"
        torso.beginPath();
        torso.moveTo(-40, -20); // Haut G
        torso.lineTo(40, -20); // Haut D
        torso.lineTo(30, 20); // Bas D
        torso.lineTo(-30, 20); // Bas G
        torso.closePath();
        torso.fillPath();
        container.add(torso);
        // --- 4. CŒUR DE FUSION (Le point faible visuel) ---
        // Un cercle qui va pulser
        const core = scene.add.graphics();
        core.fillStyle(0xffaa00); // Jaune/Orange très vif
        core.fillCircle(0, 0, 12);
        container.add(core);
        enemyInstance.coreGraphic = core;
        // --- 5. ÉPAULIÈRES ROTATIVES (Engrenages) ---
        // Deux engrenages sur les épaules qui tournent
        const createGear = (x, y)=>{
            const gear = scene.add.graphics();
            gear.lineStyle(3, 0x555555);
            gear.fillStyle(0x333333);
            // Dessin d'un engrenage simple
            const radius = 18;
            const teeth = 8;
            gear.beginPath();
            for(let i = 0; i < teeth * 2; i++){
                const angle = Math.PI * 2 * i / (teeth * 2);
                const r = i % 2 === 0 ? radius : radius - 5;
                const px = Math.cos(angle) * r;
                const py = Math.sin(angle) * r;
                if (i === 0) gear.moveTo(px, py);
                else gear.lineTo(px, py);
            }
            gear.closePath();
            gear.fillPath();
            gear.strokePath();
            // Centre de l'engrenage
            gear.fillStyle(0xff0000);
            gear.fillCircle(0, 0, 5);
            const gearCont = scene.add.container(x, y);
            gearCont.add(gear);
            return gearCont;
        };
        const leftGear = createGear(-45, -25);
        const rightGear = createGear(45, -25);
        container.add(leftGear);
        container.add(rightGear);
        enemyInstance.gears.push(leftGear, rightGear);
        // --- 6. TÊTE (Casque) ---
        const head = scene.add.graphics();
        head.fillStyle(0x111111); // Noir
        head.fillRect(-15, -45, 30, 25);
        // Visière cylon (rouge/orange)
        head.fillStyle(0xff0000);
        head.fillRect(-12, -35, 24, 4);
        container.add(head);
        // --- CONFIG ---
        enemyInstance.shouldRotate = false; // Il reste droit (comme un mech)
    },
    onUpdateAnimation: (time, enemyInstance)=>{
        // Sécurité
        if (!enemyInstance.coreGraphic || !enemyInstance.smokeGroup) return;
        // 1. MARCHE LOURDE (Pilonnage)
        // Au lieu de trembler, il monte et descend lourdement
        // Sinus lent mais grande amplitude
        const walkCycle = Math.sin(time * 0.008);
        // On déplace tout le conteneur du corps (offset Y)
        // Note: on modifie les éléments graphiques internes pour ne pas casser le x/y global de l'ennemi sur le chemin
        enemyInstance.bodyGroup.y = Math.abs(walkCycle) * -5; // Il s'écrase au sol à 0, monte à -5
        // 2. PULSATION DU CŒUR (Thermique)
        // La chaleur monte et descend
        const heat = 0.8 + Math.abs(Math.sin(time * 0.01)) * 0.5;
        enemyInstance.coreGraphic.scaleX = heat;
        enemyInstance.coreGraphic.scaleY = heat;
        enemyInstance.coreGraphic.alpha = 0.5 + heat / 3;
        // 3. ROTATION DES ENGRENAGES (Mécanique)
        // Ils tournent en sens inverse l'un de l'autre
        if (enemyInstance.gears) {
            enemyInstance.gears[0].rotation -= 0.02; // Gauche
            enemyInstance.gears[1].rotation += 0.02; // Droite
        }
        // 4. FUMÉE EN ORBITE
        // La fumée tourne lentement autour du boss
        enemyInstance.smokeGroup.rotation += 0.005;
        // Et palpite légèrement
        enemyInstance.smokeGroup.scaleX = 1 + Math.sin(time * 0.002) * 0.1;
        enemyInstance.smokeGroup.scaleY = 1 + Math.sin(time * 0.002) * 0.1;
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"8fcfE":[function(require,module,exports,__globalThis) {
// src/levels/index.js
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "LEVELS_CONFIG", ()=>LEVELS_CONFIG);
var _level1Js = require("./level1.js");
var _level2Js = require("./level2.js");
var _level3Js = require("./level3.js");
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
    },
    {
        id: 3,
        name: "Forteresse de neige",
        data: (0, _level3Js.LEVEL_3)
    }
];

},{"./level1.js":"4Dl0R","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT","./level2.js":"alrw9","./level3.js":"c2Phu"}],"4Dl0R":[function(require,module,exports,__globalThis) {
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
        // VAGUE 1 : Soldats (La seconde escouade arrive après 10 secondes)
        [
            {
                count: 22,
                type: "grunt",
                interval: 1000,
                startDelay: 0
            },
            {
                count: 15,
                type: "grunt",
                interval: 1000,
                startDelay: 10000
            }
        ],
        // VAGUE 2 : Runners (Rush immédiat)
        [
            {
                count: 21,
                type: "runner",
                interval: 450,
                startDelay: 0
            }
        ],
        // VAGUE 3 : Mixte (Chair à canon d'abord, Boucliers ensuite, Runners en traître)
        [
            {
                count: 12,
                type: "grunt",
                interval: 600,
                startDelay: 0
            },
            {
                count: 6,
                type: "shield",
                interval: 1500,
                startDelay: 4000
            },
            {
                count: 10,
                type: "runner",
                interval: 800,
                startDelay: 12000
            }
        ],
        // VAGUE 4 : Tank (Escorte progressive)
        [
            {
                count: 8,
                type: "grunt",
                interval: 600,
                startDelay: 0
            },
            {
                count: 20,
                type: "runner",
                interval: 400,
                startDelay: 5000
            },
            {
                count: 4,
                type: "shield",
                interval: 1500,
                startDelay: 15000
            },
            {
                count: 4,
                type: "tank",
                interval: 4000,
                startDelay: 25000
            }
        ],
        // VAGUE 5 : Invasion (Longue bataille)
        [
            {
                count: 60,
                type: "grunt",
                interval: 500,
                startDelay: 0
            },
            {
                count: 10,
                type: "runner",
                interval: 400,
                startDelay: 8000
            },
            {
                count: 6,
                type: "shield",
                interval: 1500,
                startDelay: 18000
            },
            {
                count: 7,
                type: "tank",
                interval: 4000,
                startDelay: 30000
            }
        ],
        // VAGUE 6 : BOSS (Le Final)
        [
            {
                count: 60,
                type: "grunt",
                interval: 700,
                startDelay: 0
            },
            {
                count: 30,
                type: "runner",
                interval: 1500,
                startDelay: 12000
            },
            {
                count: 6,
                type: "tank",
                interval: 5000,
                startDelay: 35000
            },
            {
                count: 1,
                type: "bosslvl1",
                interval: 3000,
                startDelay: 45000
            }
        ]
    ]
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"alrw9":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "LEVEL_2", ()=>LEVEL_2);
const LEVEL_2 = {
    // 0=Herbe, 1=Chemin, 2=Base, 3=Eau, 4=Pont, 5=Rocher/Decor
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
    // LISTE DES CHEMINS (Identiques à ta version corrigée)
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
            }
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
            }
        ]
    ],
    // CONFIGURATION DES 8 VAGUES (Sans Shaman, Difficile)
    waves: [
        // VAGUE 1 : Mise en bouche (2 chemins)
        [
            {
                count: 12,
                type: "grunt",
                interval: 1000,
                startDelay: 0
            },
            {
                count: 12,
                type: "grunt",
                interval: 1000,
                startDelay: 6000
            },
            {
                count: 5,
                type: "runner",
                interval: 800,
                startDelay: 15000
            }
        ],
        // VAGUE 2 : Le Mur de Boucliers
        [
            {
                count: 8,
                type: "shield",
                interval: 1500,
                startDelay: 0
            },
            {
                count: 20,
                type: "runner",
                interval: 400,
                startDelay: 5000
            }
        ],
        // VAGUE 3 : Introduction Tortue Dragon (Tanky)
        [
            {
                count: 25,
                type: "grunt",
                interval: 600,
                startDelay: 0
            },
            {
                count: 3,
                type: "tortue_dragon",
                interval: 3000,
                startDelay: 10000
            },
            {
                count: 10,
                type: "runner",
                interval: 500,
                startDelay: 18000
            }
        ],
        // VAGUE 4 : L'Escorte Blindée
        [
            {
                count: 30,
                type: "grunt",
                interval: 500,
                startDelay: 0
            },
            {
                count: 5,
                type: "tank",
                interval: 3000,
                startDelay: 10000
            },
            {
                count: 5,
                type: "shield",
                interval: 1200,
                startDelay: 12000
            }
        ],
        // VAGUE 5 : Division Cellulaire (Introduction Diviseur)
        [
            {
                count: 4,
                type: "diviseur",
                interval: 4000,
                startDelay: 0
            },
            {
                count: 20,
                type: "runner",
                interval: 350,
                startDelay: 8000
            },
            {
                count: 15,
                type: "grunt",
                interval: 500,
                startDelay: 12000
            }
        ],
        // VAGUE 6 : Le Combo Lourd
        [
            {
                count: 5,
                type: "tortue_dragon",
                interval: 3500,
                startDelay: 0
            },
            {
                count: 4,
                type: "tank",
                interval: 3000,
                startDelay: 5000
            },
            {
                count: 6,
                type: "diviseur",
                interval: 4000,
                startDelay: 20000
            }
        ],
        // VAGUE 7 : Submersion (Test de DPS)
        [
            {
                count: 50,
                type: "grunt",
                interval: 300,
                startDelay: 0
            },
            {
                count: 15,
                type: "shield",
                interval: 1000,
                startDelay: 5000
            },
            {
                count: 15,
                type: "runner",
                interval: 300,
                startDelay: 15000
            },
            {
                count: 5,
                type: "diviseur",
                interval: 3000,
                startDelay: 25000
            }
        ],
        // VAGUE 8 : BOSS FINAL (Boss Lvl 2)
        [
            {
                count: 30,
                type: "runner",
                interval: 350,
                startDelay: 0
            },
            {
                count: 8,
                type: "tortue_dragon",
                interval: 3000,
                startDelay: 10000
            },
            {
                count: 8,
                type: "tank",
                interval: 3000,
                startDelay: 20000
            },
            {
                count: 1,
                type: "bosslvl2",
                interval: 5000,
                startDelay: 40000
            }
        ]
    ]
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"c2Phu":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "LEVEL_3", ()=>LEVEL_3);
const LEVEL_3 = {
    // THEME : Désert de Glace
    // 6=Sol Neige, 7=Chemin Glacé, 8=Eau Glacée, 9=Montagne Neige, 2=Base
    map: [
        // 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
        [
            7,
            7,
            7,
            6,
            6,
            6,
            8,
            8,
            8,
            6,
            6,
            6,
            6,
            6,
            6
        ],
        [
            6,
            6,
            7,
            6,
            6,
            6,
            8,
            8,
            8,
            6,
            9,
            9,
            9,
            6,
            6
        ],
        [
            6,
            6,
            7,
            6,
            6,
            6,
            6,
            6,
            6,
            6,
            9,
            9,
            9,
            6,
            6
        ],
        [
            6,
            6,
            7,
            7,
            7,
            7,
            7,
            6,
            6,
            6,
            9,
            9,
            9,
            6,
            6
        ],
        [
            6,
            6,
            6,
            6,
            6,
            6,
            7,
            6,
            6,
            6,
            6,
            6,
            6,
            6,
            6
        ],
        [
            8,
            8,
            6,
            6,
            6,
            6,
            7,
            6,
            6,
            6,
            6,
            6,
            6,
            6,
            6
        ],
        [
            8,
            8,
            6,
            6,
            6,
            6,
            7,
            7,
            7,
            7,
            7,
            6,
            6,
            6,
            6
        ],
        [
            6,
            6,
            6,
            6,
            6,
            6,
            6,
            6,
            6,
            6,
            7,
            6,
            6,
            6,
            6
        ],
        [
            6,
            6,
            6,
            6,
            6,
            6,
            7,
            7,
            7,
            6,
            7,
            6,
            6,
            6,
            6
        ],
        [
            6,
            6,
            9,
            9,
            9,
            6,
            7,
            6,
            7,
            6,
            7,
            6,
            6,
            6,
            6
        ],
        [
            6,
            6,
            9,
            9,
            9,
            6,
            7,
            6,
            7,
            7,
            7,
            7,
            7,
            7,
            2
        ],
        [
            6,
            6,
            9,
            9,
            9,
            6,
            7,
            7,
            6,
            6,
            6,
            6,
            6,
            6,
            6
        ],
        [
            7,
            7,
            7,
            7,
            7,
            7,
            6,
            7,
            8,
            8,
            8,
            6,
            6,
            6,
            6
        ],
        [
            6,
            6,
            6,
            6,
            6,
            7,
            6,
            7,
            8,
            8,
            8,
            6,
            6,
            6,
            6
        ],
        [
            6,
            6,
            6,
            6,
            6,
            7,
            7,
            7,
            6,
            6,
            6,
            6,
            6,
            6,
            6
        ]
    ],
    paths: [
        // CHEMIN 1 : HAUT GAUCHE vers BASE (suivre uniquement les cases 7)
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
                y: 3
            },
            {
                x: 6,
                y: 3
            },
            {
                x: 6,
                y: 6
            },
            {
                x: 10,
                y: 6
            },
            {
                x: 10,
                y: 10
            },
            {
                x: 14,
                y: 10
            }
        ],
        // CHEMIN 2 : BAS GAUCHE vers BASE (suivre uniquement les cases 7)
        [
            {
                x: 0,
                y: 12
            },
            {
                x: 5,
                y: 12
            },
            {
                x: 5,
                y: 14
            },
            {
                x: 7,
                y: 14
            },
            {
                x: 7,
                y: 11
            },
            {
                x: 6,
                y: 11
            },
            {
                x: 6,
                y: 8
            },
            {
                x: 8,
                y: 8
            },
            {
                x: 8,
                y: 10
            },
            {
                x: 14,
                y: 10
            }
        ]
    ],
    // 10 VAGUES - DIFFICULTÉ "CAUCHEMAR TACTIQUE"
    waves: [
        // VAGUE 1 : Échauffement bilatéral
        // Le joueur doit placer des tours aux deux spawn ou au centre.
        [
            {
                count: 10,
                type: "grunt",
                interval: 800,
                startDelay: 0
            },
            {
                count: 10,
                type: "grunt",
                interval: 800,
                startDelay: 5000
            }
        ],
        // VAGUE 2 : La vitesse
        [
            {
                count: 25,
                type: "runner",
                interval: 400,
                startDelay: 0
            }
        ],
        // VAGUE 3 : INTRODUCTION DU SHAMAN
        // Les Grunts servent de bouclier de chair, les Shamans les soignent derrière.
        [
            {
                count: 20,
                type: "grunt",
                interval: 600,
                startDelay: 0
            },
            {
                count: 3,
                type: "shaman_gobelin",
                interval: 4000,
                startDelay: 5000
            }
        ],
        // VAGUE 4 : Le Mur immortel
        // Shields (haute défense) + Shaman (Soin) = Très dur à tuer sans gros DPS.
        [
            {
                count: 10,
                type: "shield",
                interval: 1200,
                startDelay: 0
            },
            {
                count: 4,
                type: "shaman_gobelin",
                interval: 3000,
                startDelay: 4000
            },
            {
                count: 15,
                type: "runner",
                interval: 400,
                startDelay: 12000
            }
        ],
        // VAGUE 5 : Lourdeur Mécanique
        [
            {
                count: 6,
                type: "tank",
                interval: 3000,
                startDelay: 0
            },
            {
                count: 4,
                type: "tortue_dragon",
                interval: 4000,
                startDelay: 10000
            }
        ],
        // VAGUE 6 : Division et Multiplication
        // Les Diviseurs explosent en petits slimes, les Shamans soignent les petits slimes.
        [
            {
                count: 5,
                type: "diviseur",
                interval: 4000,
                startDelay: 0
            },
            {
                count: 40,
                type: "grunt",
                interval: 300,
                startDelay: 8000
            },
            {
                count: 4,
                type: "shaman_gobelin",
                interval: 4000,
                startDelay: 10000
            }
        ],
        // VAGUE 7 : L'Escouade d'Élite
        // Un mélange compact et dangereux.
        [
            {
                count: 5,
                type: "shield",
                interval: 1000,
                startDelay: 0
            },
            {
                count: 3,
                type: "tortue_dragon",
                interval: 3000,
                startDelay: 2000
            },
            {
                count: 3,
                type: "shaman_gobelin",
                interval: 3000,
                startDelay: 4000
            },
            {
                count: 5,
                type: "tank",
                interval: 2500,
                startDelay: 15000
            }
        ],
        // VAGUE 8 : Chaos Total
        // Ça vient de partout.
        [
            {
                count: 60,
                type: "runner",
                interval: 250,
                startDelay: 0
            },
            {
                count: 8,
                type: "diviseur",
                interval: 3500,
                startDelay: 5000
            },
            {
                count: 5,
                type: "shaman_gobelin",
                interval: 4000,
                startDelay: 10000
            }
        ],
        // VAGUE 9 : Avant la tempête
        // Des unités très résistantes pour vider les munitions/énergie du joueur.
        [
            {
                count: 10,
                type: "tortue_dragon",
                interval: 2500,
                startDelay: 0
            },
            {
                count: 10,
                type: "shield",
                interval: 1000,
                startDelay: 5000
            },
            {
                count: 6,
                type: "shaman_gobelin",
                interval: 3000,
                startDelay: 10000
            }
        ],
        // VAGUE 10 : LE SEIGNEUR DE GUERRE (Boss Lvl 3)
        [
            // L'avant-garde
            {
                count: 30,
                type: "grunt",
                interval: 300,
                startDelay: 0
            },
            {
                count: 20,
                type: "runner",
                interval: 300,
                startDelay: 5000
            },
            // La garde rapprochée
            {
                count: 8,
                type: "tank",
                interval: 2000,
                startDelay: 20000
            },
            {
                count: 6,
                type: "shaman_gobelin",
                interval: 2000,
                startDelay: 25000
            },
            // LE BOSS
            {
                count: 1,
                type: "bosslvl3",
                interval: 10000,
                startDelay: 35000
            },
            // Les renforts de dernière chance
            {
                count: 10,
                type: "runner",
                interval: 200,
                startDelay: 49000
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
var _enemyJs = require("../objects/Enemy.js");
var _turretJs = require("../objects/Turret.js");
var _barracksJs = require("../objects/Barracks.js");
var _mapManagerJs = require("./managers/MapManager.js");
var _waveManagerJs = require("./managers/WaveManager.js");
var _uimanagerJs = require("./managers/UIManager.js");
var _inputManagerJs = require("./managers/InputManager.js");
var _spellManagerJs = require("./managers/SpellManager.js");
var _textureFactoryJs = require("./managers/TextureFactory.js");
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
        this.upgradeTextLines = []; // Pour stocker les lignes de texte du menu
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
        this.elapsedTimeMs = 0; // Chronomètre de session
    }
    preload() {
        // Générer les textures seulement si le système est prêt
        if (this.textures && this.make) (0, _textureFactoryJs.TextureFactory).generate(this);
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
            (0, _textureFactoryJs.TextureFactory).generate(this);
        } catch (e) {
            console.warn("Erreur lors de la g\xe9n\xe9ration des textures dans create():", e);
        }
        // Calculer les dimensions et le scale
        this.calculateLayout();
        // Initialiser les managers
        this.mapManager = new (0, _mapManagerJs.MapManager)(this);
        this.waveManager = new (0, _waveManagerJs.WaveManager)(this);
        this.spellManager = new (0, _spellManagerJs.SpellManager)(this);
        this.inputManager = new (0, _inputManagerJs.InputManager)(this, this.spellManager, null);
        this.uiManager = new (0, _uimanagerJs.UIManager)(this, this.spellManager, this.inputManager);
        this.inputManager.setUIManager(this.uiManager);
        this.mapManager.createMap();
        this.enemies = this.add.group({
            runChildUpdate: true
        });
        this.soldiers = this.add.group({
            runChildUpdate: true
        });
        this.uiManager.createUI();
        this.uiManager.updateTimer(this.elapsedTimeMs);
        this.inputManager.setupInputHandlers();
    }
    // Calculer le layout pour centrer correctement
    calculateLayout() {
        this.gameWidth = this.scale.width;
        this.gameHeight = this.scale.height;
        this.baseWidth = this.game.baseWidth || (0, _settingsJs.CONFIG).GAME_WIDTH;
        this.baseHeight = this.game.baseHeight || (0, _settingsJs.CONFIG).GAME_HEIGHT;
        const mapSize = 15 * (0, _settingsJs.CONFIG).TILE_SIZE;
        const padding = Math.max(12, Math.min(this.gameWidth, this.gameHeight) * 0.015);
        const sidebarWidth = Math.max(220, Math.min(340, this.gameWidth * 0.22));
        // Espace central disponible pour la carte carrée
        const usableWidth = Math.max(this.gameWidth - 2 * sidebarWidth - padding * 2, mapSize);
        const usableHeight = this.gameHeight - padding * 2;
        const scaleByHeight = usableHeight / mapSize;
        const scaleByWidth = usableWidth / mapSize;
        this.scaleFactor = Phaser.Math.Clamp(Math.min(scaleByHeight, scaleByWidth), 0.6, 2);
        this.mapPixelSize = mapSize * this.scaleFactor;
        this.mapOffsetX = padding + sidebarWidth + (usableWidth - this.mapPixelSize) / 2;
        this.mapOffsetY = padding + (usableHeight - this.mapPixelSize) / 2;
        // Stocker les offsets pour utilisation dans createMap
        this.mapStartX = this.mapOffsetX;
        this.mapStartY = this.mapOffsetY;
        // Sidebars verticaux
        this.toolbarWidth = sidebarWidth;
        this.toolbarHeight = this.mapPixelSize;
        this.toolbarOffsetX = padding;
        this.rightToolbarOffsetX = this.gameWidth - sidebarWidth - padding;
        this.toolbarOffsetY = this.mapOffsetY;
        // HUD maintenant à droite (plus besoin de calculer hudX/hudY en haut)
        // Les valeurs sont calculées automatiquement via rightToolbarOffsetX et toolbarOffsetY
        this.leftToolbarBounds = {
            x: this.toolbarOffsetX,
            y: this.toolbarOffsetY,
            width: this.toolbarWidth,
            height: this.toolbarHeight
        };
        this.rightToolbarBounds = {
            x: this.rightToolbarOffsetX,
            y: this.toolbarOffsetY,
            width: this.toolbarWidth,
            height: this.toolbarHeight
        };
    }
    // Gérer le redimensionnement
    handleResize() {
        // On reconstruit proprement la scène pour garder un layout carré et centré
        this.scene.restart({
            level: this.levelID
        });
    }
    update(time, delta) {
        // Si le jeu est en pause, ne rien mettre à jour
        if (this.isPaused) return;
        this.elapsedTimeMs += delta;
        if (this.uiManager) this.uiManager.updateTimer(this.elapsedTimeMs);
        this.spellManager.update(time, delta);
        this.turrets.forEach((t)=>t.update(time, this.enemies));
        this.barracks.forEach((b)=>b.update(time));
        this.soldiers.children.each((soldier)=>{
            if (soldier && soldier.active) soldier.update();
        });
        if (this.inputManager) this.inputManager.update(time, delta);
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
        if (tileType !== 0 && tileType !== 6) {
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
    takeDamage(amount = 1) {
        this.lives = Math.max(0, this.lives - amount);
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
    // =========================================================
    // GESTION DE LA PAUSE (VERSION PHASER 3 OPTIMISÉE)
    // =========================================================
    // --- Dans GameScene.js ---
    pauseGame() {
        if (this.isPaused) return;
        this.isPaused = true;
        // 1. Geler le temps (pour les timers de spawn)
        this.time.paused = true;
        // 2. Geler les Tweens (pour les rotations et mouvements par path)
        this.tweens.pauseAll();
        // 3. STOPPER l'update automatique des groupes
        // Cela empêche Phaser d'appeler enemy.update() sur chaque membre
        if (this.enemies) this.enemies.active = false;
        if (this.soldiers) this.soldiers.active = false;
        // 4. Mettre en pause les animations des sprites
        this.anims.pauseAll();
        // 5. Afficher le bouton
        if (!this.resumeBtn) this.createResumeButton();
        else this.resumeBtn.setVisible(true);
    }
    resumeGame() {
        if (!this.isPaused) return;
        this.isPaused = false;
        // 1. Relancer le temps
        this.time.paused = false;
        // 2. Relancer les Tweens
        this.tweens.resumeAll();
        // 3. RÉACTIVER les groupes
        if (this.enemies) this.enemies.active = true;
        if (this.soldiers) this.soldiers.active = true;
        // 4. Relancer les animations
        this.anims.resumeAll();
        if (this.resumeBtn) this.resumeBtn.setVisible(false);
    }
    // Petite fonction utilitaire pour créer le bouton si besoin
    createResumeButton() {
        const s = this.scaleFactor;
        const btnWidth = 250 * s;
        const btnHeight = 60 * s;
        this.resumeBtn = this.add.container(this.gameWidth / 2, this.gameHeight / 2).setDepth(1000);
        const resumeBg = this.add.graphics();
        resumeBg.fillStyle(0x000000, 0.8);
        resumeBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 10);
        resumeBg.lineStyle(3, 0x00ff00, 1);
        resumeBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 10);
        const resumeText = this.add.text(0, 0, "\u25B6\uFE0F REPRENDRE", {
            fontSize: `${Math.max(18, 24 * s)}px`,
            fill: "#00ff00",
            fontStyle: "bold"
        }).setOrigin(0.5);
        this.resumeBtn.add([
            resumeBg,
            resumeText
        ]);
        // Rendre la zone interactive
        const hitArea = new Phaser.Geom.Rectangle(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight);
        resumeBg.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
        resumeBg.on("pointerdown", ()=>this.resumeGame());
        resumeBg.on("pointerover", ()=>resumeText.setTint(0x00ff88));
        resumeBg.on("pointerout", ()=>resumeText.clearTint());
    }
    updateUI() {
        this.uiManager.updateUI();
    }
    updateToolbarCounts() {
        this.uiManager.updateToolbarCounts();
    }
    drawTurretPreview(container, config) {
        this.uiManager.buildToolbar.drawTurretPreview(container, config);
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
        if (this.inputManager) try {
            this.inputManager.cancelDrag();
        } catch (e) {}
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
        this.selectedTurret = null;
        this.txtMoney = null;
        this.txtLives = null;
        this.waveBtnContainer = null;
        this.waveBtnBg = null;
        this.waveBtnText = null;
    }
}

},{"../config/settings.js":"9kTMs","../config/levels/index.js":"8fcfE","../objects/Enemy.js":"hW1Gp","../objects/Turret.js":"lbJGU","../objects/Barracks.js":"bSlQd","./managers/MapManager.js":"bYbwC","./managers/WaveManager.js":"bbCRa","./managers/UIManager.js":"1XDfq","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT","./managers/InputManager.js":"9HXrx","./managers/SpellManager.js":"WA9IR","./managers/TextureFactory.js":"bSv7j"}],"hW1Gp":[function(require,module,exports,__globalThis) {
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
        this.stats = (0, _settingsJs.ENEMIES) && (0, _settingsJs.ENEMIES)[typeKey] ? (0, _settingsJs.ENEMIES)[typeKey] : (0, _settingsJs.ENEMIES)?.grunt || {};
        this.hp = this.stats.hp || 100;
        this.maxHp = this.hp;
        this.speed = this.stats.speed || 50;
        this.attackDamage = this.stats.damage || 10;
        this.playerDamage = this.stats.playerDamage || 1;
        this.attackSpeed = this.stats.attackSpeed || 1000;
        this.attackRange = this.stats.attackRange || 30;
        this.isRanged = this.stats.isRanged || false;
        this.progress = 0;
        this.isMoving = false;
        this.facingRight = true;
        this.lastAttackTime = 0;
        this.targetSoldier = null;
        this.isBlocked = false;
        this.blockedBy = null;
        this.targetPathOffset = (Math.random() - 0.5) * 25;
        this.currentPathOffset = this.targetPathOffset;
        this.separationRadius = 24;
        this.maxPathWidth = 30;
        this.smoothedDir = new Phaser.Math.Vector2(1, 0);
        this.isParalyzed = false;
        this.isInShell = false;
        this.isInvulnerable = false;
        this.shellThreshold = this.stats.shellThreshold || null;
        this.lastHealTime = 0;
        this.healInterval = this.stats.healInterval || null;
        this.lastSpawnTime = 0;
        this.initVisuals();
        this.scene.add.existing(this);
        this.setSize(32, 32);
        this.setInteractive();
        this.on("pointerover", ()=>this.showHpTooltip());
        this.on("pointerout", ()=>this.hideHpTooltip());
    }
    initVisuals() {
        if (!this.scene) return;
        const shadow = this.scene.add.ellipse(0, 15, 30, 10, 0x000000, 0.3);
        this.add(shadow);
        this.bodyGroup = this.scene.add.container(0, 0);
        this.add(this.bodyGroup);
        if (this.stats.onDraw) this.stats.onDraw(this.scene, this.bodyGroup, this.stats.color, this);
        else {
            const rect = this.scene.add.rectangle(0, 0, 32, 32, this.stats.color || 0xffffff);
            this.bodyGroup.add(rect);
        }
        this.drawHealthBar();
    }
    spawn() {
        this.isMoving = true;
        this.progress = 0;
        if (this.path) this.pathLength = this.path.getLength();
    }
    update(time, delta) {
        // PROTECTION CRITIQUE : Si l'objet est détruit ou la scène inexistante, on arrête tout
        if (!this.active || !this.scene || this.isParalyzed || this.isInShell || this.scene.isPaused) return;
        if (this.isMoving && !this.isBlocked && this.path) this.handleMovement(delta);
        this.handleSpecialAbilities(time);
        this.adjustSpacing(delta);
        this.updateCombat(time);
        if (this.hpTooltip && this.hpTooltip.active) {
            this.hpTooltip.setPosition(this.x, this.y - 60);
            this.refreshHpTooltip();
        }
        if (this.stats.onUpdateAnimation) this.stats.onUpdateAnimation(time, this);
    }
    handleMovement(delta) {
        if (!this.pathLength) return;
        const moveStep = this.speed * (delta / 1000) / this.pathLength;
        this.progress += moveStep;
        if (this.progress >= 1) {
            this.progress = 1;
            this.reachEnd();
            return;
        }
        const point = this.path.getPoint(this.progress);
        const tangent = this.path.getTangent(this.progress);
        this.smoothedDir.x = Phaser.Math.Linear(this.smoothedDir.x, tangent.x, 0.15);
        this.smoothedDir.y = Phaser.Math.Linear(this.smoothedDir.y, tangent.y, 0.15);
        const normX = -this.smoothedDir.y;
        const normY = this.smoothedDir.x;
        this.setPosition(point.x + normX * this.currentPathOffset, point.y + normY * this.currentPathOffset);
        if (this.stats.shouldRotate !== false && this.bodyGroup) {
            if (this.smoothedDir.x > 0.1 && !this.facingRight) {
                this.facingRight = true;
                this.bodyGroup.setScale(1, 1);
            } else if (this.smoothedDir.x < -0.1 && this.facingRight) {
                this.facingRight = false;
                this.bodyGroup.setScale(-1, 1);
            }
        }
        this.setDepth(10 + Math.floor(this.y / 10));
    }
    adjustSpacing(delta) {
        // PROTECTION : On vérifie si la scène existe AVANT d'accéder à .enemies
        if (!this.scene || !this.scene.enemies || typeof this.scene.enemies.getChildren !== "function") return;
        let avoidanceForce = 0;
        const neighbors = this.scene.enemies.getChildren();
        for (const other of neighbors){
            if (other === this || !other.active) continue;
            const dist = Phaser.Math.Distance.Between(this.x, this.y, other.x, other.y);
            if (dist < this.separationRadius) avoidanceForce += (this.x < other.x ? -1 : 1) * 2;
        }
        this.targetPathOffset += avoidanceForce * 0.1;
        this.targetPathOffset = Phaser.Math.Clamp(this.targetPathOffset, -this.maxPathWidth, this.maxPathWidth);
        this.currentPathOffset = Phaser.Math.Linear(this.currentPathOffset, this.targetPathOffset, 0.05);
    }
    reachEnd() {
        if (this.active && this.scene) {
            if (this.scene.takeDamage) this.scene.takeDamage(this.playerDamage);
            // On utilise destroy() à la fin de la frame pour éviter les erreurs de lecture
            this.destroy();
        }
    }
    damage(amount) {
        if (this.isInvulnerable || !this.active || !this.scene) return;
        this.hp -= amount;
        this.updateHealthBar();
        this.scene.tweens.add({
            targets: this.bodyGroup,
            alpha: 0.5,
            duration: 50,
            yoyo: true
        });
        if (this.shellThreshold && !this.isInShell && this.hp / this.maxHp <= this.shellThreshold) this.enterShell();
        if (this.hp <= 0) this.die();
    }
    updateCombat(time) {
        if (!this.scene) return;
        if (this.isRanged) this.handleRangedCombat(time);
        else if (this.isBlocked && this.blockedBy) {
            if (time - this.lastAttackTime >= this.attackSpeed) {
                if (this.blockedBy.takeDamage) this.blockedBy.takeDamage(this.attackDamage);
                this.lastAttackTime = time;
            }
        }
    }
    handleRangedCombat(time) {
        this.findRangedTarget();
        if (this.targetSoldier?.active && this.targetSoldier?.isAlive) {
            const dist = Phaser.Math.Distance.Between(this.x, this.y, this.targetSoldier.x, this.targetSoldier.y);
            if (dist <= this.attackRange) {
                this.isMoving = false;
                if (time - this.lastAttackTime >= this.attackSpeed) {
                    this.attackSoldierRanged(this.targetSoldier);
                    this.lastAttackTime = time;
                }
            } else this.isMoving = true;
        } else this.isMoving = true;
    }
    attackSoldierRanged(soldier) {
        if (!this.scene) return;
        const proj = this.scene.add.circle(this.x, this.y, 4, 0xffffff).setDepth(2000);
        this.scene.tweens.add({
            targets: proj,
            x: soldier.x,
            y: soldier.y,
            duration: 300,
            onComplete: ()=>{
                if (soldier.active && soldier.takeDamage) soldier.takeDamage(this.attackDamage);
                proj.destroy();
            }
        });
    }
    findRangedTarget() {
        if (!this.scene?.soldiers || typeof this.scene.soldiers.getChildren !== "function") return;
        let closest = null;
        let minDist = this.attackRange;
        this.scene.soldiers.getChildren().forEach((s)=>{
            const d = Phaser.Math.Distance.Between(this.x, this.y, s.x, s.y);
            if (s.active && (s.isAlive || s.hp > 0) && d < minDist) {
                minDist = d;
                closest = s;
            }
        });
        this.targetSoldier = closest;
    }
    handleSpecialAbilities(time) {
        if (!this.scene) return;
        // Si on a un onUpdateAnimation, on laisse la config gérer ses propres sorts
        // pour éviter les conflits de Cooldown ou de calcul de rayon.
        if (this.stats.onUpdateAnimation) return;
        // Logique générique pour les ennemis simples
        if (this.healInterval && time - this.lastHealTime >= this.healInterval) {
            this.healNearbyEnemies();
            this.lastHealTime = time;
        }
        if (this.stats.spawnInterval && time - this.lastSpawnTime >= this.stats.spawnInterval) {
            this.spawnMinions();
            this.lastSpawnTime = time;
        }
    }
    healNearbyEnemies() {
        if (!this.scene?.enemies) return;
        // Correction : on s'assure que le rayon est en pixels (par défaut 100 si non défini)
        const radius = this.stats.healRadiusPixels || this.stats.healRadius || 100;
        this.scene.enemies.children.each((e)=>{
            if (e !== this && e.active) {
                const dist = Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y);
                if (dist < radius) {
                    e.hp = Math.min(e.hp + (this.stats.healAmount || 10), e.maxHp);
                    e.updateHealthBar();
                }
            }
        });
    }
    enterShell() {
        if (!this.scene) return;
        this.isInShell = true;
        this.isInvulnerable = true;
        this.scene.time.delayedCall(this.stats.shellDuration || 3000, ()=>{
            if (this.active) {
                this.isInShell = false;
                this.isInvulnerable = false;
            }
        });
    }
    spawnMinions() {
        if (!this.stats.spawnType || !this.scene?.enemies) return;
        for(let i = 0; i < (this.stats.spawnCount || 2); i++){
            const m = new Enemy(this.scene, this.path, this.stats.spawnType);
            m.progress = Math.max(0, this.progress - 0.05);
            this.scene.enemies.add(m);
            m.spawn();
        }
    }
    drawHealthBar() {
        if (!this.scene) return;
        const width = 40;
        const height = 5;
        if (this.hpBarContainer) this.hpBarContainer.destroy();
        this.hpBarContainer = this.scene.add.container(0, -40);
        const bg = this.scene.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0.5);
        this.hpFill = this.scene.add.rectangle(-width / 2, 0, width, height, 0x00ff00).setOrigin(0, 0.5);
        this.hpBarContainer.add([
            bg,
            this.hpFill
        ]);
        this.add(this.hpBarContainer);
        this.hpBarContainer.setDepth(2000);
    }
    updateHealthBar() {
        if (!this.hpFill) return;
        const pct = Phaser.Math.Clamp(this.hp / this.maxHp, 0, 1);
        this.hpFill.width = 40 * pct;
        const color = pct < 0.3 ? 0xff0000 : pct < 0.6 ? 0xffa500 : 0x00ff00;
        this.hpFill.fillColor = color;
        this.refreshHpTooltip();
    }
    die() {
        if (!this.scene) return;
        if (this.isBlocked && this.blockedBy && this.blockedBy.releaseEnemy) this.blockedBy.releaseEnemy();
        if (this.stats.onDeath) this.stats.onDeath(this);
        if (this.scene.earnMoney) this.scene.earnMoney(this.stats.reward || 10);
        this.explode();
        this.destroy();
    }
    explode() {
        if (!this.scene) return;
        const color = this.stats.color || 0xffffff;
        for(let i = 0; i < 5; i++){
            const p = this.scene.add.rectangle(this.x, this.y, 6, 6, color);
            this.scene.tweens.add({
                targets: p,
                x: this.x + Phaser.Math.Between(-40, 40),
                y: this.y + Phaser.Math.Between(-40, 40),
                alpha: 0,
                scale: 0,
                duration: 500,
                onComplete: ()=>p.destroy()
            });
        }
    }
    showHpTooltip() {
        if (this.hpTooltip || !this.scene) return;
        this.hpTooltip = this.scene.add.text(this.x, this.y - 60, this.getHpTooltipText(), {
            fontSize: "14px",
            backgroundColor: "#000",
            padding: 3
        }).setOrigin(0.5).setDepth(3000);
    }
    hideHpTooltip() {
        if (this.hpTooltip) {
            this.hpTooltip.destroy();
            this.hpTooltip = null;
        }
    }
    getHpTooltipText() {
        return `${Math.max(0, Math.ceil(this.hp))} / ${Math.ceil(this.maxHp)} HP`;
    }
    refreshHpTooltip() {
        if (this.hpTooltip) this.hpTooltip.setText(this.getHpTooltipText());
    }
    destroy(fromScene) {
        this.hideHpTooltip();
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

},{"../config/turrets/index.js":"97rhz","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"97rhz":[function(require,module,exports,__globalThis) {
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

},{"./machineGun.js":"ecBws","./sniper.js":"fm2OQ","./cannon.js":"3RJPP","./zap.js":"bgZGw","./barracks.js":"9rF1d","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"bSlQd":[function(require,module,exports,__globalThis) {
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
            if (tileType === 1 || tileType === 4 || tileType === 7) {
                // Chemin ou pont
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
        this.hpTooltip = this.scene.add.text(this.x, this.y - 50, this.getHpTooltipText(), {
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
                    this.hpTooltip.setText(this.getHpTooltipText());
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
    getHpTooltipText() {
        return `${Math.max(0, Math.ceil(this.hp))} / ${Math.ceil(this.maxHp)} HP`;
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
        if (this.hpTooltip) this.hpTooltip.setText(this.getHpTooltipText());
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
        this.treeContainers = new Map();
        this.mountainPositions = new Set();
        this.mountainContainers = new Map();
    }
    createMap() {
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
            let key = "tile_grass_1"; // Default
            // --- BIOME VOLCAN (0-5) ---
            if (type === 0) key = (x + y) % 2 === 0 ? "tile_grass_2" : "tile_grass_1"; // Terre brûlée
            if (type === 1) key = "tile_path"; // Chemin terre/roche
            if (type === 2) key = "tile_base";
            if (type === 3) key = "tile_water"; // eau
            if (type === 4) key = "tile_bridge";
            if (type === 5) key = "tile_mountain"; // Sol sous la montagne
            // --- BIOME NEIGE (6-9) ---
            if (type === 6) key = "tile_snow_1"; // Sol Neige
            if (type === 7) key = "tile_snow_path"; // Chemin Glace
            if (type === 8) key = "tile_ice_water"; // Eau/Glace profonde
            if (type === 9) key = "tile_snow_1"; // Sol sous la montagne neige
            const tile = this.scene.add.image(px, py, key).setOrigin(0, 0).setDepth(0);
            tile.setScale(this.scene.scaleFactor);
            // --- GESTION DES ARBRES ---
            // On place des arbres sur le type 0 (Morts/Verts) et le type 6 (Sapins enneigés)
            if (type === 0 || type === 6) {
                const canPlaceBarracks = this.isAdjacentToPath(x, y);
                // Probabilités d'apparition
                if (!canPlaceBarracks && Math.random() < 0.3) {
                    this.addTree(px, py, x, y, type); // On passe le type pour savoir quel arbre dessiner
                    this.treePositions.add(`${x},${y}`);
                } else if (canPlaceBarracks && Math.random() < 0.1) {
                    this.addTree(px, py, x, y, type);
                    this.treePositions.add(`${x},${y}`);
                }
            }
        }
        // Détecter les montagnes (Type 5 = Volcan, Type 9 = Neige)
        this.detectAndCreateLargeMountains();
        this.createPaths();
    }
    detectAndCreateLargeMountains() {
        const mapData = this.scene.levelConfig.map;
        const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scene.scaleFactor;
        const processedTiles = new Set();
        for(let y = 0; y < mapData.length - 2; y++)for(let x = 0; x < mapData[y].length - 2; x++){
            // On vérifie quel type de montagne c'est (5 ou 9)
            const mountainType = mapData[y][x];
            if ((mountainType === 5 || mountainType === 9) && this.is3x3MountainGroup(mapData, x, y, processedTiles, mountainType)) {
                const centerX = x + 1;
                const centerY = y + 1;
                const px = this.scene.mapStartX + centerX * T + T / 2;
                const py = this.scene.mapStartY + centerY * T + T / 2;
                // On passe le type à la fonction de création
                this.addLargeMountain(px, py, centerX, centerY, mountainType);
                for(let dy = 0; dy < 3; dy++)for(let dx = 0; dx < 3; dx++){
                    processedTiles.add(`${x + dx},${y + dy}`);
                    this.mountainPositions.add(`${x + dx},${y + dy}`);
                }
            }
        }
    }
    // Modifié pour vérifier un type spécifique (targetType)
    is3x3MountainGroup(mapData, startX, startY, processedTiles, targetType) {
        for(let dy = 0; dy < 3; dy++)for(let dx = 0; dx < 3; dx++){
            const x = startX + dx;
            const y = startY + dy;
            const key = `${x},${y}`;
            if (y < 0 || y >= mapData.length || x < 0 || x >= mapData[y].length) return false;
            if (processedTiles.has(key)) return false;
            // Doit être exactement le même type (ne pas mélanger volcan et neige)
            if (mapData[y][x] !== targetType) return false;
        }
        return true;
    }
    // Ajout du paramètre "type" pour changer les couleurs
    addLargeMountain(px, py, tileX, tileY, type) {
        const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scene.scaleFactor;
        const scale = this.scene.scaleFactor;
        const mountain = this.scene.add.container(px, py);
        mountain.setDepth(1);
        const g = this.scene.add.graphics();
        const size = T * 1.5;
        // --- PALETTE DE COULEURS ---
        let colorBase, colorShadow, colorDetail, colorPeakMain, colorPeakSub;
        if (type === 9) {
            // THEME NEIGE
            colorBase = 0xe0e0e0; // Gris très clair / Blanc
            colorShadow = 0xb0c4de; // Bleu gris ombre
            colorDetail = 0xa9a9a9; // Gris roche
            colorPeakMain = 0xffffff; // Blanc pur (Neige éternelle)
            colorPeakSub = 0xf0f8ff; // AliceBlue
        } else {
            // THEME VOLCAN (Type 5)
            colorBase = 0x6b5b4f;
            colorShadow = 0x4a3d32;
            colorDetail = 0x5a4b3f;
            colorPeakMain = 0x8b7d6f;
            colorPeakSub = 0x7b6d5f;
        }
        // Base de la montagne
        g.fillStyle(colorBase);
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
        // Ombre
        g.fillStyle(colorShadow, 0.6);
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
        // Détails de roche
        g.fillStyle(colorDetail, 0.8);
        for(let i = 0; i < 20; i++){
            const angle = i / 20 * Math.PI * 2;
            const dist = (Math.random() * 0.4 + 0.1) * size;
            const x = Math.cos(angle) * dist;
            const y = Math.sin(angle) * dist * 0.5;
            g.fillCircle(x, y, 4 * scale);
        }
        // Sommet principal
        g.fillStyle(colorPeakMain);
        g.beginPath();
        g.moveTo(-size * 0.15, -size * 0.35);
        g.lineTo(0, -size * 0.5);
        g.lineTo(size * 0.15, -size * 0.35);
        g.lineTo(0, -size * 0.25);
        g.closePath();
        g.fillPath();
        // Sommets secondaires
        g.fillStyle(colorPeakSub);
        // ... (Même dessin géométrique, juste la couleur change) ...
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
        // Bordure
        g.lineStyle(3 * scale, colorShadow, 0.5);
        g.strokePath();
        mountain.add(g);
        const key = `${tileX},${tileY}`;
        this.mountainContainers.set(key, mountain);
    }
    createPaths() {
        const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scene.scaleFactor;
        const H = T / 2;
        this.scene.paths = [];
        // Support pour configuration simple ou multiple chemins
        const rawPaths = this.scene.levelConfig.paths || (this.scene.levelConfig.path ? [
            this.scene.levelConfig.path
        ] : []);
        rawPaths.forEach((points)=>{
            const newPath = new Phaser.Curves.Path();
            if (points.length > 0) {
                newPath.moveTo(this.scene.mapStartX + points[0].x * T + H, this.scene.mapStartY + points[0].y * T + H);
                for(let i = 1; i < points.length; i++)newPath.lineTo(this.scene.mapStartX + points[i].x * T + H, this.scene.mapStartY + points[i].y * T + H);
                this.scene.paths.push(newPath);
            }
        });
    }
    // Ajout du paramètre "groundType"
    addTree(px, py, tileX, tileY, groundType) {
        const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scene.scaleFactor;
        // Petit décalage aléatoire
        const treeX = px + T / 2 + (Math.random() - 0.5) * 15 * this.scene.scaleFactor;
        const treeY = py + T / 2 + (Math.random() - 0.5) * 15 * this.scene.scaleFactor;
        const tree = this.scene.add.container(treeX, treeY);
        tree.setDepth(2);
        const g = this.scene.add.graphics();
        const scale = this.scene.scaleFactor;
        // Si on est sur de la neige (Type 6), on dessine un Sapin Enneigé
        if (groundType === 6) {
            // Tronc
            g.fillStyle(0x5c4033); // Marron foncé
            g.fillRect(-2 * scale, 0, 4 * scale, 8 * scale);
            // Feuillage (Triangle de sapin)
            const darkGreen = 0x1a4d1a;
            const snowWhite = 0xffffff;
            // Étage bas
            g.fillStyle(darkGreen);
            g.fillTriangle(0, -10 * scale, -8 * scale, 0, 8 * scale, 0);
            // Neige sur étage bas
            g.fillStyle(snowWhite);
            g.fillTriangle(0, -10 * scale, -2 * scale, -2 * scale, 2 * scale, -2 * scale);
            // Étage milieu
            g.fillStyle(darkGreen);
            g.fillTriangle(0, -16 * scale, -6 * scale, -6 * scale, 6 * scale, -6 * scale);
            // Étage haut
            g.fillStyle(darkGreen);
            g.fillTriangle(0, -20 * scale, -4 * scale, -12 * scale, 4 * scale, -12 * scale);
            // Neige sommet
            g.fillStyle(snowWhite);
            g.fillTriangle(0, -20 * scale, -2 * scale, -16 * scale, 2 * scale, -16 * scale);
        } else {
            // --- ARBRES CLASSIQUES / MORTS (Biome Volcan Type 0) ---
            // J'ai gardé ton code existant ici, tu peux le laisser tel quel
            const treeType = Math.floor(Math.random() * 3);
            if (treeType === 0) {
                g.fillStyle(0x8b4513);
                g.fillRect(-2 * scale, 0, 4 * scale, 12 * scale);
                g.fillStyle(0x2d5016);
                g.fillCircle(0, -5 * scale, 10 * scale);
                g.fillStyle(0x3a6b1f);
                g.fillCircle(0, -5 * scale, 8 * scale);
            } else if (treeType === 1) {
                g.fillStyle(0x654321);
                g.fillRect(-3 * scale, 0, 6 * scale, 15 * scale);
                g.fillStyle(0x1a4d1a);
                g.fillCircle(-5 * scale, -8 * scale, 8 * scale);
                g.fillCircle(5 * scale, -8 * scale, 8 * scale);
                g.fillCircle(0, -12 * scale, 10 * scale);
            } else {
                g.fillStyle(0x5c4033);
                g.fillRect(-4 * scale, 0, 8 * scale, 18 * scale);
                g.fillStyle(0x2d5016);
                g.fillCircle(-8 * scale, -10 * scale, 12 * scale);
                g.fillCircle(8 * scale, -10 * scale, 12 * scale);
            }
        }
        tree.add(g);
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
        // On considère 1 et 4 (Volcan) ET 7 (Neige) comme des chemins
        const pathTypes = [
            1,
            4,
            7
        ];
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
                if (pathTypes.includes(map[ny][nx])) return true;
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
        // 1. Vérifications de sécurité
        if (this.scene.isWaveRunning) return;
        if (this.scene.currentWaveIndex >= this.scene.levelConfig.waves.length) return;
        if (this.scene.isPaused) return;
        // 2. Nettoyage (Timer Auto et Timers de spawn précédents)
        if (this.scene.nextWaveAutoTimer) {
            this.scene.nextWaveAutoTimer.remove();
            this.scene.nextWaveAutoTimer = null;
            this.scene.nextWaveCountdown = 0;
        }
        if (this.scene.waveSpawnTimers) this.scene.waveSpawnTimers.forEach((timer)=>{
            if (timer && !timer.hasDestroyed) timer.remove();
        });
        // On réinitialise le tableau pour cette nouvelle vague
        this.scene.waveSpawnTimers = [];
        // 3. Initialisation de l'état de la vague
        this.scene.isWaveRunning = true;
        this.scene.waveBtnText.setText("\u26A0\uFE0F EN COURS");
        this.scene.waveBtnBg.setStrokeStyle(3, 0xffaa00);
        const waveGroups = this.scene.levelConfig.waves[this.scene.currentWaveIndex];
        // Calcul du nombre total d'ennemis pour savoir quand la vague finit
        let totalEnemiesInWave = 0;
        let spawnedTotal = 0;
        waveGroups.forEach((g)=>totalEnemiesInWave += g.count);
        // 4. Lancement des groupes avec gestion du DÉLAI + INTERVALLE
        waveGroups.forEach((group)=>{
            // Sécurité : si startDelay n'est pas défini dans le JSON, on met 0
            const delayBeforeStart = group.startDelay || 0;
            // TIMER A : Le délai initial avant que ce groupe ne commence
            const startDelayTimer = this.scene.time.addEvent({
                delay: delayBeforeStart,
                callback: ()=>{
                    // Ce code s'exécute après le délai "startDelay"
                    // Si le jeu est en pause au moment exact où le délai finit, on annule
                    if (this.scene.isPaused) return;
                    // TIMER B : La boucle de spawn des ennemis du groupe
                    const spawnLoopTimer = this.scene.time.addEvent({
                        delay: group.interval,
                        repeat: group.count - 1,
                        callback: ()=>{
                            // Vérification pause à chaque ennemi
                            if (this.scene.isPaused) return;
                            const randomPath = Phaser.Utils.Array.GetRandom(this.scene.paths);
                            const enemy = new (0, _enemyJs.Enemy)(this.scene, randomPath, group.type);
                            enemy.setDepth(10);
                            enemy.setScale(this.scene.scaleFactor);
                            enemy.spawn();
                            this.scene.enemies.add(enemy);
                            spawnedTotal++;
                            // Vérifier si c'était le tout dernier ennemi de TOUTE la vague
                            if (spawnedTotal >= totalEnemiesInWave) this.monitorWaveEnd();
                        }
                    });
                    // On ajoute le timer de boucle à la liste pour pouvoir le gérer (pause/fin)
                    this.scene.waveSpawnTimers.push(spawnLoopTimer);
                }
            });
            // On ajoute le timer de délai à la liste aussi
            this.scene.waveSpawnTimers.push(startDelayTimer);
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
var _indexJs = require("../../config/levels/index.js");
var _buildMenuJs = require("./ui/components/BuildMenu.js");
var _buildToolbarJs = require("./ui/components/BuildToolbar.js");
var _hudJs = require("./ui/components/HUD.js");
var _treeMenuJs = require("./ui/components/TreeMenu.js");
var _upgradeMenuJs = require("./ui/components/UpgradeMenu.js");
class UIManager {
    constructor(scene, spellManager, inputManager){
        this.scene = scene;
        this.spellManager = spellManager;
        this.inputManager = inputManager;
        this.hud = null;
        this.buildToolbar = null;
        this.buildMenu = null;
        this.upgradeMenu = null;
        this.treeMenu = null;
        this.scene.upgradeTextLines = [];
        this.buildButtons = [];
    }
    createUI() {
        this.hud = new (0, _hudJs.HUD)(this.scene);
        this.hud.create();
        this.buildToolbar = new (0, _buildToolbarJs.BuildToolbar)(this.scene, this.spellManager, this.inputManager);
        this.buildToolbar.create();
        this.buildMenu = new (0, _buildMenuJs.BuildMenu)(this.scene);
        this.buildMenu.create();
        this.upgradeMenu = new (0, _upgradeMenuJs.UpgradeMenu)(this.scene);
        this.upgradeMenu.create();
        this.treeMenu = new (0, _treeMenuJs.TreeMenu)(this.scene);
    }
    updateUI() {
        const currentWave = (this.scene.currentWaveIndex || 0) + 1;
        let totalWaves = 0;
        if (this.scene.levelConfig && this.scene.levelConfig.waves) totalWaves = this.scene.levelConfig.waves.length;
        else {
            const levelData = (0, _indexJs.LEVELS_CONFIG).find((l)=>l.id === this.scene.levelID);
            if (levelData && levelData.data && levelData.data.waves) totalWaves = levelData.data.waves.length;
            else totalWaves = this.scene.levelID === 2 ? 9 : 6;
        }
        if (this.hud) {
            this.hud.update(this.scene.money, this.scene.lives, currentWave, totalWaves);
            this.hud.updateTimer(this.scene.elapsedTimeMs || 0);
        }
        this.updateToolbarCounts();
        if (this.buildMenu && this.scene.buildMenu && this.scene.buildMenu.visible) this.buildMenu.updateBuildMenuButtons();
        if (this.upgradeMenu && this.scene.upgradeMenu && this.scene.upgradeMenu.visible) this.upgradeMenu.updateUpgradeButtonState();
    }
    updateToolbarCounts() {
        if (this.buildToolbar) this.buildToolbar.updateToolbarCounts();
    }
    updateTimer(elapsedMs) {
        if (this.hud) this.hud.updateTimer(elapsedMs);
    }
    hideMenus() {
        if (this.scene.buildMenu) this.scene.buildMenu.setVisible(false);
        if (this.scene.upgradeMenu) this.scene.upgradeMenu.setVisible(false);
        if (this.scene.treeRemovalMenu) this.scene.treeRemovalMenu.setVisible(false);
    }
    openBuildMenu(pointer) {
        this.buildMenu?.openBuildMenu(pointer);
    }
    openUpgradeMenu(pointer, turret) {
        this.upgradeMenu?.openUpgradeMenu(pointer, turret);
    }
    openTreeRemovalConfirmation(pointer, tx, ty) {
        this.treeMenu?.openTreeRemovalConfirmation(pointer, tx, ty);
    }
    isPointerOnToolbar(pointer) {
        return this.buildToolbar?.isPointerOnToolbar(pointer) || false;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT","../../config/levels/index.js":"8fcfE","./ui/components/BuildMenu.js":"BRVxo","./ui/components/BuildToolbar.js":"1jjKP","./ui/components/HUD.js":"lURKX","./ui/components/TreeMenu.js":"aeuIi","./ui/components/UpgradeMenu.js":"51K14"}],"BRVxo":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "BuildMenu", ()=>BuildMenu);
var _settingsJs = require("../../../../config/settings.js");
var _indexJs = require("../../../../config/turrets/index.js");
var _buildMenuButtonsJs = require("./helpers/BuildMenuButtons.js");
class BuildMenu {
    constructor(scene){
        this.scene = scene;
        this.buildButtons = [];
        this.currentTooltip = null;
    }
    create() {
        const s = this.scene.scaleFactor;
        this.buildButtons = [];
        const menu = this.scene.buildMenu = this.scene.add.container(0, 0).setVisible(false).setDepth(240);
        const turrets = [
            (0, _indexJs.TURRETS).machine_gun,
            (0, _indexJs.TURRETS).sniper,
            (0, _indexJs.TURRETS).cannon,
            (0, _indexJs.TURRETS).zap,
            (0, _indexJs.TURRETS).barracks
        ];
        const pad = 18 * s;
        const btnSize = 62 * s;
        const radius = 105 * s;
        const titleH = 44 * s;
        const menuWidth = pad * 2 + (radius + btnSize / 2) * 2;
        const menuHeight = pad * 2 + titleH + (radius + btnSize / 2) * 2;
        const cx = menuWidth / 2;
        const cy = pad + titleH + (menuHeight - pad * 2 - titleH) / 2;
        const titleBg = this.scene.add.rectangle(cx, pad + 14 * s, 210 * s, 40 * s, 0x000000, 0.55).setOrigin(0.5).setDepth(240);
        const title = this.scene.add.text(cx, pad + 14 * s, "CONSTRUIRE", {
            fontFamily: "Arial",
            fontStyle: "bold",
            fontSize: `${Math.round(30 * s)}px`,
            fill: "#00ccff",
            stroke: "#001a2a",
            strokeThickness: Math.round(4 * s)
        }).setOrigin(0.5).setDepth(241);
        menu.add([
            titleBg,
            title
        ]);
        const anglesDeg = [
            -90,
            -18,
            54,
            126,
            198
        ];
        turrets.forEach((cfg, i)=>{
            const a = Phaser.Math.DegToRad(anglesDeg[i]);
            const x = cx + Math.cos(a) * radius;
            const y = cy + Math.sin(a) * radius;
            const btn = (0, _buildMenuButtonsJs.createBuildBtnOctagon)(this, x, y, btnSize, cfg);
            menu.add(btn);
            this.buildButtons.push(btn);
        });
        this.scene._buildMenuSize = {
            w: menuWidth,
            h: menuHeight
        };
    }
    showTurretTooltip(btnContainer, description) {
        const s = this.scene.scaleFactor;
        if (this.currentTooltip) this.currentTooltip.destroy();
        const btnX = btnContainer.x + (this.scene.buildMenu.x || 0);
        const btnY = btnContainer.y + (this.scene.buildMenu.y || 0);
        const tooltipContainer = this.scene.add.container(0, 0).setDepth(300);
        this.currentTooltip = tooltipContainer;
        const tooltipBg = this.scene.add.graphics();
        const padding = 15 * s;
        const maxWidth = 350 * s;
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
        const tooltipX = btnX + 60 * s;
        const tooltipY = btnY;
        tooltipBg.fillStyle(0x000000, 0.95);
        tooltipBg.fillRoundedRect(0, 0, tooltipWidth, tooltipHeight, 8);
        tooltipBg.lineStyle(2, 0x00ccff, 1);
        tooltipBg.strokeRoundedRect(0, 0, tooltipWidth, tooltipHeight, 8);
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
        if (tooltipX + tooltipWidth > this.scene.gameWidth) tooltipContainer.setX(btnX - tooltipWidth - 10 * s);
        if (tooltipY + tooltipHeight > this.scene.gameHeight) tooltipContainer.setY(this.scene.gameHeight - tooltipHeight - 10 * s);
    }
    applyBuildBtnStateOctagon(btnContainer) {
        (0, _buildMenuButtonsJs.applyBuildBtnStateOctagon)(this.scene, btnContainer);
    }
    applyBuildBtnState(btnContainer) {
        this.applyBuildBtnStateOctagon(btnContainer);
    }
    updateBuildMenuButtons() {
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
        if (menuX + menuWidth / 2 > this.scene.gameWidth) menuX = this.scene.gameWidth - menuWidth / 2 - 10 * s;
        if (menuX - menuWidth / 2 < 0) menuX = menuWidth / 2 + 10 * s;
        if (menuY + menuHeight / 2 > this.scene.gameHeight) menuY = this.scene.gameHeight - menuHeight / 2 - 10 * s;
        if (menuY - menuHeight / 2 < 0) menuY = menuHeight / 2 + 10 * s;
        this.scene.buildMenu.setPosition(menuX - menuWidth / 2, menuY - menuHeight / 2);
        this.scene.buildMenu.setVisible(true);
        this.updateBuildMenuButtons();
    }
}

},{"../../../../config/settings.js":"9kTMs","../../../../config/turrets/index.js":"97rhz","./helpers/BuildMenuButtons.js":"6yiSo","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"6yiSo":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "drawOctagon", ()=>drawOctagon);
parcelHelpers.export(exports, "applyBuildBtnStateOctagon", ()=>applyBuildBtnStateOctagon);
parcelHelpers.export(exports, "createBuildBtnOctagon", ()=>createBuildBtnOctagon);
function drawOctagon(scene, graphics, x, y, radius, fillColor, fillAlpha, strokeColor, strokeWidth) {
    graphics.clear();
    graphics.fillStyle(fillColor, fillAlpha);
    graphics.lineStyle(strokeWidth, strokeColor, 1);
    const sides = 8;
    const angleStep = Math.PI * 2 / sides;
    graphics.beginPath();
    for(let i = 0; i <= sides; i++){
        const angle = i * angleStep - Math.PI / 2;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        if (i === 0) graphics.moveTo(px, py);
        else graphics.lineTo(px, py);
    }
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();
}
function applyBuildBtnStateOctagon(scene, btnContainer) {
    const s = scene.scaleFactor;
    const cfg = btnContainer.turretConfig;
    const canAfford = scene.money >= cfg.cost;
    let isDisabled = false;
    if (cfg.key === "barracks") isDisabled = scene.barracks.length >= scene.maxBarracks;
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
        drawOctagon(scene, btnContainer.octagonBg, 0, 0, radius, fillColor, fillAlpha, strokeColor, strokeWidth);
        btnContainer.octagonBg.setAlpha(shouldDisable ? 0.5 : 1);
        if (shouldDisable) btnContainer.hitArea?.disableInteractive();
        else btnContainer.hitArea?.setInteractive({
            useHandCursor: true
        });
    }
    if (btnContainer.previewContainer) btnContainer.previewContainer.setAlpha(shouldDisable ? 0.4 : 1);
}
function createBuildBtnOctagon(buildMenu, x, y, size, turretConfig) {
    const scene = buildMenu.scene;
    const s = scene.scaleFactor;
    const radius = size / 2;
    const labelBgAlpha = 0.55;
    const labelBgRadius = 8 * s;
    const btn = scene.add.container(x, y).setDepth(241);
    const octagonBg = scene.add.graphics();
    drawOctagon(scene, octagonBg, 0, 0, radius, 0x1a1a2e, 0.96, 0x00ccff, Math.max(2, 2 * s));
    const hitArea = scene.add.circle(0, 0, radius + 6 * s, 0x000000, 0);
    hitArea.setInteractive({
        useHandCursor: true
    });
    const previewContainer = scene.add.container(0, -2 * s);
    if (scene.drawTurretPreview) {
        scene.drawTurretPreview(previewContainer, turretConfig);
        previewContainer.setScale(0.4 * s * 1.25);
    }
    const nameY = radius + 12 * s;
    const costY = radius + 30 * s;
    const nameText = scene.add.text(0, nameY, turretConfig.name, {
        fontSize: `${Math.round(Math.max(12, 13 * s * 1.25))}px`,
        fill: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold"
    }).setOrigin(0.5);
    const costText = scene.add.text(0, costY, `${turretConfig.cost}$`, {
        fontSize: `${Math.round(Math.max(11, 12 * s * 1.25))}px`,
        fill: "#ffd700",
        fontFamily: "Arial",
        fontStyle: "bold"
    }).setOrigin(0.5);
    const nameBg = scene.add.graphics();
    const costBg = scene.add.graphics();
    const redrawLabelBg = ()=>{
        const padX = 10 * s;
        const padY = 6 * s;
        const nameW = nameText.width + padX * 2;
        const nameH = nameText.height + padY * 2;
        nameBg.clear();
        nameBg.fillStyle(0x000000, labelBgAlpha);
        nameBg.fillRoundedRect(-nameW / 2, nameY - nameH / 2, nameW, nameH, labelBgRadius);
        const costW = costText.width + padX * 2;
        const costH = costText.height + padY * 2;
        costBg.clear();
        costBg.fillStyle(0x000000, labelBgAlpha);
        costBg.fillRoundedRect(-costW / 2, costY - costH / 2, costW, costH, labelBgRadius);
    };
    redrawLabelBg();
    btn.add([
        octagonBg,
        hitArea,
        previewContainer,
        nameBg,
        costBg,
        nameText,
        costText
    ]);
    btn.turretConfig = turretConfig;
    btn.octagonBg = octagonBg;
    btn.nameText = nameText;
    btn.costText = costText;
    btn.previewContainer = previewContainer;
    btn.hitArea = hitArea;
    btn.radius = radius;
    btn.nameBg = nameBg;
    btn.costBg = costBg;
    btn._redrawLabelBg = redrawLabelBg;
    applyBuildBtnStateOctagon(scene, btn);
    hitArea.on("pointerover", ()=>{
        const canAfford = scene.money >= turretConfig.cost;
        const isBarracksMaxed = turretConfig.key === "barracks" && scene.barracks.length >= scene.maxBarracks;
        if (!canAfford || isBarracksMaxed) return;
        drawOctagon(scene, octagonBg, 0, 0, radius, 0x2a2a4e, 1, 0x00ffff, Math.max(3, 3 * s));
        nameText.setColor("#ffffff");
        costText.setColor("#ffff00");
        nameBg.setAlpha(0.7);
        costBg.setAlpha(0.7);
        if (turretConfig.description) buildMenu.showTurretTooltip(btn, turretConfig.description, hitArea);
    });
    hitArea.on("pointerout", ()=>{
        applyBuildBtnStateOctagon(scene, btn);
        nameBg.setAlpha(1);
        costBg.setAlpha(1);
        if (buildMenu.currentTooltip) {
            buildMenu.currentTooltip.destroy();
            buildMenu.currentTooltip = null;
        }
    });
    hitArea.on("pointerdown", ()=>{
        if (buildMenu.currentTooltip) {
            buildMenu.currentTooltip.destroy();
            buildMenu.currentTooltip = null;
        }
        if (!scene.selectedTile) return;
        const canAfford = scene.money >= turretConfig.cost;
        const isBarracksMaxed = turretConfig.key === "barracks" && scene.barracks.length >= scene.maxBarracks;
        if (!canAfford || isBarracksMaxed) {
            scene.cameras.main.shake(50, 0.005);
            return;
        }
        const success = scene.buildTurret(turretConfig, scene.selectedTile.x, scene.selectedTile.y);
        if (success) scene.buildMenu.setVisible(false);
        buildMenu.updateBuildMenuButtons();
    });
    return btn;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"1jjKP":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "BuildToolbar", ()=>BuildToolbar);
var _settingsJs = require("../../../../config/settings.js");
var _lightningJs = require("../../../../sorts/lightning.js");
var _turretButtonsJs = require("./helpers/TurretButtons.js");
var _toolbarTooltipJs = require("./helpers/ToolbarTooltip.js");
class BuildToolbar {
    constructor(scene, spellManager, inputManager){
        this.scene = scene;
        this.spellManager = spellManager;
        this.inputManager = inputManager;
        this.toolbarButtons = [];
        this.toolbarTooltip = null;
        this.leftColumn = null;
        this.rightColumn = null;
        this.leftBg = null;
        this.rightBg = null;
    }
    create() {
        const toolbarY = this.scene.toolbarOffsetY;
        const columnWidth = this.scene.toolbarWidth;
        const columnHeight = this.scene.toolbarHeight;
        const padding = 18 * this.scene.scaleFactor;
        const itemSize = 82 * this.scene.scaleFactor;
        const itemSpacing = Math.max(110 * this.scene.scaleFactor, itemSize + 24);
        // Colonne gauche : tourelles en haut, sorts en dessous
        this.leftColumn = this.scene.add.container(this.scene.toolbarOffsetX, toolbarY).setDepth(150);
        this.leftBg = this.scene.add.graphics();
        this.leftBg.fillStyle(0x0a0a10, 0.92);
        this.leftBg.fillRoundedRect(0, 0, columnWidth, columnHeight, 14);
        this.leftBg.lineStyle(2, 0x00ccff, 0.35);
        this.leftBg.strokeRoundedRect(0, 0, columnWidth, columnHeight, 14);
        this.leftColumn.add(this.leftBg);
        // Titre TOURELLES
        const towerTitle = this.scene.add.text(padding, padding, "TOURELLES", {
            fontSize: `${Math.max(14, 16 * this.scene.scaleFactor)}px`,
            fill: "#9edcff",
            fontFamily: "Arial",
            fontStyle: "bold"
        }).setOrigin(0, 0);
        this.leftColumn.add(towerTitle);
        // Zone des tourelles
        const turretGridStartY = towerTitle.y + towerTitle.height + padding * 0.8;
        const turretGridHeight = columnHeight * 0.65; // 65% de la hauteur pour les tourelles
        const turretGridWidth = columnWidth - padding * 2;
        const columns = 2;
        const rows = Math.ceil(5 / columns);
        const verticalSpacing = Math.min(turretGridHeight / rows, itemSpacing + padding * 0.5);
        // S'assurer que buildToolbar pointe vers leftColumn avant de créer les boutons
        this.scene.buildToolbar = this.leftColumn;
        this.toolbarButtons = (0, _turretButtonsJs.createTurretButtons)(this, turretGridWidth, turretGridHeight, itemSize, verticalSpacing, {
            startX: padding + turretGridWidth / (columns * 2),
            startY: turretGridStartY + itemSize / 2,
            columns: columns,
            padding,
            gridWidth: turretGridWidth,
            verticalSpacing
        });
        // Titre SORTS
        const spellTitleY = turretGridStartY + turretGridHeight + padding * 1.2;
        const spellTitle = this.scene.add.text(padding, spellTitleY, "SORTS", {
            fontSize: `${Math.max(14, 16 * this.scene.scaleFactor)}px`,
            fill: "#9edcff",
            fontFamily: "Arial",
            fontStyle: "bold"
        }).setOrigin(0, 0);
        this.leftColumn.add(spellTitle);
        // Zone des sorts
        const spellAreaY = spellTitle.y + spellTitle.height + padding * 0.8;
        const spellPanelHeight = itemSize + padding * 1.2;
        const spellPanelWidth = columnWidth - padding * 2;
        this.scene.spellSection = this.scene.add.container(padding, spellAreaY).setDepth(150);
        const spellBg = this.scene.add.graphics();
        spellBg.fillStyle(0x0f0f18, 0.9);
        spellBg.fillRoundedRect(0, 0, spellPanelWidth, spellPanelHeight, 12);
        spellBg.lineStyle(2, 0x7dd6ff, 0.35);
        spellBg.strokeRoundedRect(0, 0, spellPanelWidth, spellPanelHeight, 12);
        this.scene.spellSection.add(spellBg);
        const lightningY = spellPanelHeight / 2;
        this.createLightningSpellButton({
            itemSize,
            posX: spellPanelWidth / 2,
            posY: lightningY,
            targetContainer: this.scene.spellSection
        });
        this.leftColumn.add(this.scene.spellSection);
        // Plus besoin de la colonne droite (elle est maintenant dans HUD)
        // On garde juste la référence pour compatibilité
        this.rightBg = this.leftBg;
        this.updateToolbarCounts();
    }
    showToolbarTooltip(btnContainer, description, triggerElement) {
        (0, _toolbarTooltipJs.showToolbarTooltip)(this, btnContainer, description);
    }
    createLightningSpellButton({ itemSize, posX, posY, targetContainer }) {
        const x = posX;
        const y = posY;
        const container = targetContainer || this.scene.spellSection;
        const btnContainer = this.scene.add.container(x, y);
        btnContainer.setDepth(151);
        const btnBg = this.scene.add.rectangle(0, 0, itemSize, itemSize, 0x333333, 0.9);
        btnBg.setStrokeStyle(3, 0x666666);
        btnBg.setInteractive({
            useHandCursor: true
        });
        const lightningIcon = this.scene.add.graphics();
        this.spellManager.drawLightningIcon(lightningIcon, 0, 0, itemSize * 0.6);
        lightningIcon.setScale(this.scene.scaleFactor);
        const cooldownMask = this.scene.add.graphics();
        cooldownMask.setDepth(152);
        cooldownMask.setVisible(false);
        const cooldownText = this.scene.add.text(0, itemSize / 2 + 12 * this.scene.scaleFactor, "", {
            fontSize: `${Math.max(10, 12 * this.scene.scaleFactor)}px`,
            fill: "#ffffff",
            fontStyle: "bold"
        }).setOrigin(0.5);
        btnContainer.add([
            btnBg,
            lightningIcon,
            cooldownMask,
            cooldownText
        ]);
        btnBg.on("pointerover", ()=>{
            if ((0, _lightningJs.lightning).description) this.showToolbarTooltip(btnContainer, (0, _lightningJs.lightning).description, btnBg);
        });
        btnBg.on("pointerout", ()=>{
            if (this.toolbarTooltip) {
                this.toolbarTooltip.destroy();
                this.toolbarTooltip = null;
            }
        });
        btnBg.on("pointerdown", ()=>{
            if (this.toolbarTooltip) {
                this.toolbarTooltip.destroy();
                this.toolbarTooltip = null;
            }
            if (this.spellManager.lightningCooldown <= 0) this.spellManager.startPlacingLightning();
        });
        this.spellManager.attachLightningButton({
            container: btnContainer,
            bg: btnBg,
            icon: lightningIcon,
            cooldownMask: cooldownMask,
            cooldownText: cooldownText
        });
        if (container) container.add(btnContainer);
    }
    drawTurretPreview(container, config) {
        const base = this.scene.add.graphics();
        const color = 0x333333;
        base.fillStyle(color);
        base.fillCircle(0, 0, 24);
        base.lineStyle(2, 0x111111);
        base.strokeCircle(0, 0, 24);
        container.add(base);
        if (config.onDrawBarrel) {
            const barrelContainer = this.scene.add.container(0, 0);
            const fakeTurret = {
                level: 1,
                config: config
            };
            try {
                config.onDrawBarrel(this.scene, barrelContainer, config.color, fakeTurret);
                container.add(barrelContainer);
            } catch (e) {
                console.warn("Erreur lors du dessin de la pr\xe9visualisation:", e);
                const fallback = this.scene.add.graphics();
                fallback.fillStyle(0xffffff);
                fallback.fillRect(0, -3, 15, 6);
                container.add(fallback);
            }
        } else {
            const fallback = this.scene.add.graphics();
            fallback.fillStyle(0xffffff);
            fallback.fillRect(0, -3, 15, 6);
            container.add(fallback);
        }
    }
    updateToolbarCounts() {
        if (!this.toolbarButtons || !Array.isArray(this.toolbarButtons)) return;
        this.toolbarButtons = this.toolbarButtons.filter((btn)=>btn && btn.updateCount);
        this.toolbarButtons.forEach((btn)=>{
            try {
                if (btn && btn.updateCount) btn.updateCount();
            } catch (e) {
                console.warn("Erreur lors de la mise \xe0 jour d'un bouton de toolbar:", e);
            }
        });
    }
    isPointerOnToolbar(pointer) {
        const bounds = [
            this.scene.leftToolbarBounds,
            this.scene.rightToolbarBounds
        ];
        return bounds.some((b)=>{
            if (!b) return false;
            return pointer.worldX >= b.x && pointer.worldX <= b.x + b.width && pointer.worldY >= b.y && pointer.worldY <= b.y + b.height;
        });
    }
}

},{"../../../../config/settings.js":"9kTMs","../../../../sorts/lightning.js":"lqA3P","./helpers/TurretButtons.js":"8ZDZv","./helpers/ToolbarTooltip.js":"22DYV","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"lqA3P":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "lightning", ()=>lightning);
const lightning = {
    key: "lightning",
    name: "\xc9clair",
    damage: 350,
    radius: 45,
    paralysisDuration: 3500,
    cooldown: 100000,
    description: "Sort puissant qui fait tomber un \xe9clair destructeur.\n\n\u2705 Avantages:\n\u2022 D\xe9g\xe2ts massifs (200)\n\u2022 Zone d'effet (touche plusieurs ennemis)\n\u2022 Paralysie les ennemis survivants (3.5s)\n\n\u274C Inconv\xe9nients:\n\u2022 Cooldown tr\xe8s long (100 secondes)\n\u2022 N\xe9cessite un placement pr\xe9cis\n\u2022 Zone d'effet limit\xe9e"
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"8ZDZv":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "createTurretButtons", ()=>createTurretButtons);
var _indexJs = require("../../../../../config/turrets/index.js");
function createTurretButtons(buildToolbar, turretsSectionWidth, toolbarHeight, itemSize, itemSpacing, layout = {}) {
    const scene = buildToolbar.scene;
    const toolbarButtons = [];
    const columns = layout.columns && layout.columns > 0 ? layout.columns : turretTypes.length;
    const verticalSpacing = layout.verticalSpacing || itemSpacing;
    const horizontalStep = layout.gridWidth && layout.columns ? layout.gridWidth / layout.columns : itemSpacing;
    const startX = layout.startX !== undefined ? layout.startX : (turretsSectionWidth - columns * horizontalStep) / 2 + horizontalStep / 2;
    const startY = layout.startY !== undefined ? layout.startY : toolbarHeight / 2;
    const turretTypes = [
        {
            key: "machine_gun",
            config: (0, _indexJs.TURRETS).machine_gun
        },
        {
            key: "sniper",
            config: (0, _indexJs.TURRETS).sniper
        },
        {
            key: "cannon",
            config: (0, _indexJs.TURRETS).cannon
        },
        {
            key: "zap",
            config: (0, _indexJs.TURRETS).zap
        },
        {
            key: "barracks",
            config: (0, _indexJs.TURRETS).barracks
        }
    ];
    turretTypes.forEach((item, index)=>{
        const col = index % columns;
        const row = Math.floor(index / columns);
        const x = startX + col * horizontalStep;
        const y = startY + row * verticalSpacing;
        const btnContainer = scene.add.container(x, y);
        const btnBg = scene.add.rectangle(0, 0, itemSize, itemSize, 0x333333, 0.9);
        btnBg.setStrokeStyle(3, 0x666666);
        btnBg.setInteractive({
            useHandCursor: true
        });
        const previewContainer = scene.add.container(0, 0);
        buildToolbar.drawTurretPreview(previewContainer, item.config);
        previewContainer.setScale(0.5 * scene.scaleFactor);
        const countText = scene.add.text(0, itemSize / 2 + 12 * scene.scaleFactor, "", {
            fontSize: `${Math.max(14, 16 * scene.scaleFactor)}px`,
            fill: "#ffffff",
            fontStyle: "bold"
        }).setOrigin(0.5);
        const priceText = scene.add.text(0, itemSize / 2 + 28 * scene.scaleFactor, `${item.config.cost}$`, {
            fontSize: `${Math.max(12, 14 * scene.scaleFactor)}px`,
            fill: "#ffd700",
            fontStyle: "bold"
        }).setOrigin(0.5);
        const updateCount = ()=>{
            if (!countText || countText.active === false) return;
            if (!btnBg || btnBg.active === false) return;
            if (!priceText || priceText.active === false) return;
            try {
                const canAfford = scene.money >= item.config.cost;
                let isDisabled = false;
                if (item.key === "barracks") {
                    const count = scene.barracks.length;
                    const max = scene.maxBarracks;
                    countText.setText(`${count}/${max}`);
                    isDisabled = count >= max;
                    countText.setColor(count >= max ? "#ff0000" : "#ffffff");
                } else {
                    const count = scene.turrets.filter((t)=>t.config.key === item.key).length;
                    countText.setText(`${count}`);
                }
                const shouldDisable = !canAfford || isDisabled;
                if (shouldDisable) {
                    btnBg.setFillStyle(0x1a1a1a, 0.6);
                    btnBg.setStrokeStyle(3, 0x444444, 0.5);
                    btnBg.setAlpha(0.5);
                    previewContainer.setAlpha(0.4);
                    priceText.setColor("#ff4444");
                    priceText.setAlpha(0.7);
                    countText.setAlpha(0.7);
                    btnBg.disableInteractive();
                } else {
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
                console.warn("Erreur lors de la mise \xe0 jour du compteur:", e);
            }
        };
        btnContainer.add([
            btnBg,
            previewContainer,
            countText,
            priceText
        ]);
        scene.buildToolbar.add(btnContainer);
        btnBg.on("pointerover", ()=>{
            if (item.config.description) buildToolbar.showToolbarTooltip(btnContainer, item.config.description, btnBg);
        });
        btnBg.on("pointerout", ()=>{
            if (buildToolbar.toolbarTooltip) {
                buildToolbar.toolbarTooltip.destroy();
                buildToolbar.toolbarTooltip = null;
            }
        });
        btnBg.on("pointerdown", ()=>{
            if (buildToolbar.toolbarTooltip) {
                buildToolbar.toolbarTooltip.destroy();
                buildToolbar.toolbarTooltip = null;
            }
            if (item.key === "barracks" && scene.barracks.length >= scene.maxBarracks) {
                scene.cameras.main.shake(50, 0.005);
                return;
            }
            if (scene.money >= item.config.cost) buildToolbar.inputManager.startDrag(item.config);
            else scene.cameras.main.shake(50, 0.005);
        });
        toolbarButtons.push({
            container: btnContainer,
            config: item.config,
            updateCount: updateCount,
            btnBg: btnBg,
            priceText: priceText,
            countText: countText,
            previewContainer: previewContainer
        });
    });
    return toolbarButtons;
}

},{"../../../../../config/turrets/index.js":"97rhz","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"22DYV":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "showToolbarTooltip", ()=>showToolbarTooltip);
function showToolbarTooltip(buildToolbar, btnContainer, description) {
    const scene = buildToolbar.scene;
    const s = scene.scaleFactor;
    if (buildToolbar.toolbarTooltip) buildToolbar.toolbarTooltip.destroy();
    let btnX = 0;
    let btnY = 0;
    if (btnContainer.getWorldTransformMatrix) {
        const matrix = btnContainer.getWorldTransformMatrix();
        btnX = matrix.tx;
        btnY = matrix.ty;
    } else {
        const isInBuildToolbar = scene.buildToolbar && (btnContainer.parentContainer === scene.buildToolbar || scene.buildToolbar.list && scene.buildToolbar.list.includes(btnContainer));
        if (isInBuildToolbar) {
            btnX = btnContainer.x + scene.buildToolbar.x;
            btnY = btnContainer.y + scene.buildToolbar.y;
        } else {
            btnX = btnContainer.x;
            btnY = btnContainer.y;
        }
    }
    const tooltipContainer = scene.add.container(0, 0).setDepth(300);
    buildToolbar.toolbarTooltip = tooltipContainer;
    const tooltipBg = scene.add.graphics();
    const padding = 15 * s;
    const maxWidth = 350 * s;
    const tempText = scene.add.text(0, 0, description, {
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
    const tooltipX = btnX;
    const tooltipY = btnY - tooltipHeight - 10 * s;
    tooltipBg.fillStyle(0x000000, 0.95);
    tooltipBg.fillRoundedRect(0, 0, tooltipWidth, tooltipHeight, 8);
    tooltipBg.lineStyle(2, 0x00ccff, 1);
    tooltipBg.strokeRoundedRect(0, 0, tooltipWidth, tooltipHeight, 8);
    const descText = scene.add.text(padding, padding, description, {
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
    if (tooltipX + tooltipWidth > scene.gameWidth) tooltipContainer.setX(scene.gameWidth - tooltipWidth - 10 * s);
    if (tooltipY < 0) tooltipContainer.setY(btnY + 80 * s + 10 * s);
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"lURKX":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "HUD", ()=>HUD);
var _settingsJs = require("../../../../config/settings.js");
const formatMsToTimer = (ms)=>{
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
};
class HUD {
    constructor(scene){
        this.scene = scene;
        this.topBar = null;
        this.bgBar = null;
        this.barWidth = 0;
        this.basePadding = 0;
    }
    create() {
        const s = this.scene.scaleFactor;
        const columnWidth = this.scene.toolbarWidth;
        const columnHeight = this.scene.toolbarHeight;
        const padding = 18 * s;
        const fontSize = Math.max(16, 20 * s);
        const smallFontSize = Math.max(12, 16 * s);
        const startX = this.scene.rightToolbarOffsetX;
        const startY = this.scene.toolbarOffsetY;
        // Container principal à droite
        const rightPanel = this.scene.add.container(startX, startY).setDepth(200);
        this.topBar = rightPanel; // Garder la référence pour compatibilité
        // Fond du panneau
        const bgPanel = this.scene.add.graphics();
        bgPanel.fillStyle(0x0f1015, 0.92);
        bgPanel.fillRoundedRect(0, 0, columnWidth, columnHeight, 14);
        bgPanel.lineStyle(2, 0x00ccff, 0.35);
        bgPanel.strokeRoundedRect(0, 0, columnWidth, columnHeight, 14);
        rightPanel.add(bgPanel);
        this.bgBar = bgPanel;
        // Titre du panneau
        const title = this.scene.add.text(columnWidth / 2, padding, "INFORMATIONS", {
            fontSize: `${Math.max(14, 16 * s)}px`,
            fill: "#9edcff",
            fontFamily: "Arial",
            fontStyle: "bold"
        }).setOrigin(0.5, 0);
        rightPanel.add(title);
        // Zone des informations (argent, vies, vague, chrono)
        const infoStartY = title.y + title.height + padding * 1.5;
        const infoSpacing = 50 * s;
        const infoItemHeight = 60 * s;
        // Argent
        const moneyY = infoStartY;
        const moneyBg = this.scene.add.graphics();
        moneyBg.fillStyle(0x1a1a2e, 0.8);
        moneyBg.fillRoundedRect(padding, moneyY, columnWidth - padding * 2, infoItemHeight, 10);
        moneyBg.lineStyle(2, 0xffd700, 0.5);
        moneyBg.strokeRoundedRect(padding, moneyY, columnWidth - padding * 2, infoItemHeight, 10);
        rightPanel.add(moneyBg);
        this.scene.txtMoney = this.scene.add.text(columnWidth / 2, moneyY + infoItemHeight / 2, "", {
            fontSize: `${fontSize}px`,
            fill: "#ffd700",
            fontStyle: "bold",
            fontFamily: "Arial"
        }).setOrigin(0.5);
        rightPanel.add(this.scene.txtMoney);
        // Vies
        const livesY = moneyY + infoItemHeight + padding * 0.8;
        const livesBg = this.scene.add.graphics();
        livesBg.fillStyle(0x1a1a2e, 0.8);
        livesBg.fillRoundedRect(padding, livesY, columnWidth - padding * 2, infoItemHeight, 10);
        livesBg.lineStyle(2, 0xff6666, 0.5);
        livesBg.strokeRoundedRect(padding, livesY, columnWidth - padding * 2, infoItemHeight, 10);
        rightPanel.add(livesBg);
        this.scene.txtLives = this.scene.add.text(columnWidth / 2, livesY + infoItemHeight / 2, "", {
            fontSize: `${fontSize}px`,
            fill: "#ff6666",
            fontStyle: "bold",
            fontFamily: "Arial"
        }).setOrigin(0.5);
        rightPanel.add(this.scene.txtLives);
        // Vague
        const waveY = livesY + infoItemHeight + padding * 0.8;
        const waveBg = this.scene.add.graphics();
        waveBg.fillStyle(0x1a1a2e, 0.8);
        waveBg.fillRoundedRect(padding, waveY, columnWidth - padding * 2, infoItemHeight, 10);
        waveBg.lineStyle(2, 0x00ccff, 0.5);
        waveBg.strokeRoundedRect(padding, waveY, columnWidth - padding * 2, infoItemHeight, 10);
        rightPanel.add(waveBg);
        this.scene.txtWave = this.scene.add.text(columnWidth / 2, waveY + infoItemHeight / 2, "", {
            fontSize: `${fontSize}px`,
            fill: "#00ccff",
            fontStyle: "bold",
            fontFamily: "Arial"
        }).setOrigin(0.5);
        rightPanel.add(this.scene.txtWave);
        // Chrono
        const timerY = waveY + infoItemHeight + padding * 0.8;
        const timerBg = this.scene.add.graphics();
        timerBg.fillStyle(0x1a1a2e, 0.8);
        timerBg.fillRoundedRect(padding, timerY, columnWidth - padding * 2, infoItemHeight, 10);
        timerBg.lineStyle(2, 0xffffff, 0.5);
        timerBg.strokeRoundedRect(padding, timerY, columnWidth - padding * 2, infoItemHeight, 10);
        rightPanel.add(timerBg);
        this.scene.txtTimer = this.scene.add.text(columnWidth / 2, timerY + infoItemHeight / 2, "", {
            fontSize: `${fontSize}px`,
            fill: "#ffffff",
            fontStyle: "bold",
            fontFamily: "Arial"
        }).setOrigin(0.5);
        rightPanel.add(this.scene.txtTimer);
        // Zone des boutons en bas
        const buttonAreaY = columnHeight - padding - 140 * s;
        const buttonHeight = 50 * s;
        const buttonSpacing = padding * 0.8;
        const buttonWidth = (columnWidth - padding * 3) / 2;
        // Bouton Pause
        const pauseBtnX = padding + buttonWidth / 2;
        const pauseBtnY = buttonAreaY + buttonHeight / 2;
        this.scene.pauseBtn = this.scene.add.text(pauseBtnX, pauseBtnY, "\u23F8\uFE0F PAUSE", {
            fontSize: `${smallFontSize}px`,
            fill: "#ffaa00",
            backgroundColor: "#1e1e1e",
            padding: {
                x: 12 * s,
                y: 8 * s
            },
            fontFamily: "Arial",
            fontStyle: "bold"
        }).setOrigin(0.5).setInteractive({
            useHandCursor: true
        }).on("pointerover", ()=>{
            if (!this.scene.isPaused) this.scene.pauseBtn.setColor("#ffcc00");
        }).on("pointerout", ()=>{
            if (!this.scene.isPaused) this.scene.pauseBtn.setColor("#ffaa00");
        }).on("pointerdown", ()=>{
            if (!this.scene.isPaused) this.scene.pauseGame();
        });
        rightPanel.add(this.scene.pauseBtn);
        // Bouton Lancer Vague (sera créé par BuildToolbar mais on le place ici)
        const waveBtnX = padding * 2 + buttonWidth + buttonWidth / 2;
        const waveBtnY = buttonAreaY + buttonHeight / 2;
        const waveButtonWidth = buttonWidth;
        const waveButtonHeight = buttonHeight;
        this.scene.waveSection = this.scene.add.container(waveBtnX, waveBtnY);
        const waveSectionBg = this.scene.add.graphics();
        waveSectionBg.fillStyle(0x0f0f18, 0.9);
        waveSectionBg.fillRoundedRect(-waveButtonWidth / 2, -waveButtonHeight / 2, waveButtonWidth, waveButtonHeight, 10);
        waveSectionBg.lineStyle(2, 0x00ff99, 0.6);
        waveSectionBg.strokeRoundedRect(-waveButtonWidth / 2, -waveButtonHeight / 2, waveButtonWidth, waveButtonHeight, 10);
        this.scene.waveSection.add(waveSectionBg);
        this.scene.waveBtnContainer = this.scene.add.container(0, 0).setDepth(201);
        this.scene.waveBtnBg = this.scene.add.rectangle(0, 0, waveButtonWidth, waveButtonHeight, 0x111422, 0.92).setStrokeStyle(3 * s, 0x00ff99, 0.8).setInteractive({
            useHandCursor: true
        });
        this.scene.waveBtnText = this.scene.add.text(0, 0, "\u25B6 LANCER VAGUE 1", {
            fontSize: `${Math.max(14, 16 * s)}px`,
            fill: "#ffffff",
            fontStyle: "bold",
            fontFamily: "Arial"
        }).setOrigin(0.5);
        this.scene.waveBtnContainer.add([
            this.scene.waveBtnBg,
            this.scene.waveBtnText
        ]);
        this.scene.waveSection.add(this.scene.waveBtnContainer);
        this.scene.waveBtnBg.setInteractive({
            useHandCursor: true
        }).on("pointerdown", ()=>this.scene.startWave());
        rightPanel.add(this.scene.waveSection);
        this.barWidth = columnWidth;
        this.basePadding = padding;
        this.UI_HEIGHT = columnHeight;
        this.fontSize = fontSize;
        this.smallFontSize = smallFontSize;
        this.update(this.scene.money, this.scene.lives, 1, 1);
        this.updateTimer(0);
    }
    reposition() {
        if (!this.topBar || !this.bgBar) return;
        const s = this.scene.scaleFactor;
        const columnWidth = this.scene.toolbarWidth;
        const columnHeight = this.scene.toolbarHeight;
        const padding = 18 * s;
        const startX = this.scene.rightToolbarOffsetX;
        const startY = this.scene.toolbarOffsetY;
        this.topBar.setPosition(startX, startY);
        this.bgBar.clear();
        this.bgBar.fillStyle(0x0f1015, 0.92);
        this.bgBar.fillRoundedRect(0, 0, columnWidth, columnHeight, 14);
        this.bgBar.lineStyle(2, 0x00ccff, 0.35);
        this.bgBar.strokeRoundedRect(0, 0, columnWidth, columnHeight, 14);
    // Les positions des éléments sont calculées relativement au container
    // donc elles restent correctes même après repositionnement
    }
    update(money, lives, currentWave, totalWaves) {
        if (this.scene.txtMoney) this.scene.txtMoney.setText(`\u{1F4B0} ${money}`);
        if (this.scene.txtLives) this.scene.txtLives.setText(`\u{2764}\u{FE0F} ${lives}`);
        if (this.scene.txtWave) this.scene.txtWave.setText(`\u{1F30A} ${currentWave}/${totalWaves}`);
    }
    updateTimer(elapsedMs) {
        if (this.scene.txtTimer) this.scene.txtTimer.setText(`\u{23F1}\u{FE0F} ${formatMsToTimer(elapsedMs)}`);
    }
}

},{"../../../../config/settings.js":"9kTMs","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"aeuIi":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "TreeMenu", ()=>TreeMenu);
class TreeMenu {
    constructor(scene){
        this.scene = scene;
    }
    create() {
        const s = this.scene.scaleFactor;
        this.scene.treeRemovalMenu = this.scene.add.container(0, 0).setVisible(false).setDepth(250);
        const menuWidth = 280 * s;
        const menuHeight = 140 * s;
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x000000, 0.5);
        bg.fillRoundedRect(4 * s, 4 * s, menuWidth, menuHeight, 16);
        bg.fillStyle(0x0f0f1a, 0.98);
        bg.fillRoundedRect(0, 0, menuWidth, menuHeight, 16);
        bg.lineStyle(3, 0xff6600, 1);
        bg.strokeRoundedRect(0, 0, menuWidth, menuHeight, 16);
        bg.lineStyle(2, 0xcc4400, 0.6);
        bg.strokeRoundedRect(2 * s, 2 * s, menuWidth - 4 * s, menuHeight - 4 * s, 14);
        this.scene.treeRemovalMenu.add(bg);
        this.scene.treeRemovalText = this.scene.add.text(menuWidth / 2, 35 * s, "", {
            fontSize: `${Math.max(10, 12 * s)}px`,
            fill: "#ffffff",
            fontFamily: "Arial",
            align: "center",
            wordWrap: {
                width: menuWidth - 40 * s
            }
        }).setOrigin(0.5).setDepth(251);
        this.scene.treeRemovalMenu.add(this.scene.treeRemovalText);
        const yesBtn = this.scene.add.text(menuWidth / 2 - 60 * s, 90 * s, "OUI", {
            fontSize: `${Math.max(10, 12 * s)}px`,
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
                    this.scene.earnMoney(-25);
                    this.scene.treeRemovalMenu.setVisible(false);
                    this.scene.treeRemovalTile = null;
                } else this.scene.cameras.main.shake(50, 0.005);
            }
        });
        const noBtn = this.scene.add.text(menuWidth / 2 + 60 * s, 90 * s, "NON", {
            fontSize: `${Math.max(10, 12 * s)}px`,
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
        if (!this.scene.treeRemovalMenu) this.create();
        this.scene.treeRemovalTile = {
            tx,
            ty
        };
        const menuWidth = 280 * s;
        const menuHeight = 140 * s;
        let menuX = Phaser.Math.Clamp(pointer.worldX, menuWidth / 2, this.scene.gameWidth - menuWidth / 2);
        let menuY = Phaser.Math.Clamp(pointer.worldY, menuHeight / 2, this.scene.gameHeight - menuHeight / 2);
        this.scene.treeRemovalMenu.setPosition(menuX - menuWidth / 2, menuY - menuHeight / 2);
        const canAfford = this.scene.money >= 25;
        const costText = canAfford ? "25" : "25 (insuffisant)";
        this.scene.treeRemovalText.setText([
            "Voulez-vous enlever",
            "cet arbre pour",
            `${costText} pi\xe8ces ?`
        ]);
        if (canAfford) this.scene.treeRemovalText.setColor("#ffffff");
        else this.scene.treeRemovalText.setColor("#ff4444");
        this.scene.treeRemovalMenu.setVisible(true);
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"51K14":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "UpgradeMenu", ()=>UpgradeMenu);
var _barracksJs = require("../../../../objects/Barracks.js");
var _upgradeRenderersJs = require("./helpers/UpgradeRenderers.js");
class UpgradeMenu {
    constructor(scene){
        this.scene = scene;
    }
    create() {
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
            } else this.scene.cameras.main.shake(50, 0.005);
        });
        this.scene.upgradeMenu.add(this.scene.upgradeBtnText);
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
            trashIcon.fillStyle(color, 1);
            trashIcon.fillRect(trashX - trashSize / 2 - 2 * s, trashY - trashSize / 2 - 3 * s, trashSize + 4 * s, 4 * s);
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
            if (this.scene.selectedTurret instanceof (0, _barracksJs.Barracks)) {
                const index = this.scene.barracks.indexOf(this.scene.selectedTurret);
                if (index !== -1) this.scene.barracks.splice(index, 1);
            } else {
                const index = this.scene.turrets.indexOf(this.scene.selectedTurret);
                if (index !== -1) this.scene.turrets.splice(index, 1);
            }
            this.scene.selectedTurret.destroy();
            this.scene.earnMoney(refund);
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
        if (turret instanceof (0, _barracksJs.Barracks)) (0, _upgradeRenderersJs.renderBarracksUpgrade)(this.scene, turret, xPos, yPos, lineHeight, fontSize);
        else (0, _upgradeRenderersJs.renderTurretUpgrade)(this.scene, turret, xPos, yPos, lineHeight, fontSize);
        const finalNextStats = turret.getNextLevelStats ? turret.getNextLevelStats() : null;
        this.scene.upgradeBtnText.setPosition(15 * s, menuHeight - 50 * s);
        this.updateUpgradeButtonState();
        this.scene.upgradeMenu.setVisible(true);
    }
    updateUpgradeButtonState() {
        const nextStats = this.scene.selectedTurret?.getNextLevelStats?.();
        const canAfford = nextStats && this.scene.money >= nextStats.cost;
        const hasNext = !!nextStats;
        if (!this.scene.upgradeBtnText) return;
        if (hasNext) this.scene.upgradeBtnText.setText(canAfford ? "AM\xc9LIORER" : `AM\xc9LIORER (${nextStats.cost}$)`);
        else this.scene.upgradeBtnText.setText("FERMER");
        if (!hasNext || !canAfford) {
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
    }
}

},{"../../../../objects/Barracks.js":"bSlQd","./helpers/UpgradeRenderers.js":"gJ2Md","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"gJ2Md":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "addStatLine", ()=>addStatLine);
parcelHelpers.export(exports, "renderBarracksUpgrade", ()=>renderBarracksUpgrade);
parcelHelpers.export(exports, "renderTurretUpgrade", ()=>renderTurretUpgrade);
function addStatLine(scene, xPos, yPos, lineHeight, fontSize, label, leftValue, rightValue) {
    const leftText = scene.add.text(xPos, yPos, `${label} : ${leftValue}`, {
        fontSize: `${fontSize}px`,
        fill: "#ffffff",
        fontFamily: "Arial"
    }).setDepth(241);
    const rightText = scene.add.text(xPos + leftText.width, yPos, `${rightValue}`, {
        fontSize: `${fontSize}px`,
        fill: "#00ff00",
        fontStyle: "bold",
        fontFamily: "Arial"
    }).setDepth(241);
    scene.upgradeTextLines.push(leftText, rightText);
    scene.upgradeMenu.add([
        leftText,
        rightText
    ]);
    return yPos + lineHeight;
}
function renderBarracksUpgrade(scene, turret, xPos, yPosStart, lineHeight, fontSize) {
    const s = scene.scaleFactor;
    let yPos = yPosStart;
    const level = turret.level || 1;
    const soldiersCount = turret.config.soldiersCount[level - 1] || 2;
    const respawnTime = turret.config.respawnTime[level - 1] || 12000;
    const soldierHp = turret.config.soldierHp[level - 1] || 100;
    const nextStats = turret.getNextLevelStats?.();
    const title = scene.add.text(xPos, yPos, `Caserne - Niveau ${level}`, {
        fontSize: `${fontSize + 2}px`,
        fill: "#ffffff",
        fontStyle: "bold",
        fontFamily: "Arial"
    }).setDepth(241);
    scene.upgradeTextLines.push(title);
    scene.upgradeMenu.add(title);
    yPos += lineHeight * 1.5;
    if (nextStats) {
        const nextSoldiers = turret.config.soldiersCount[level] || 3;
        const nextRespawn = turret.config.respawnTime[level] || 10000;
        const nextHp = turret.config.soldierHp[level] || 120;
        yPos = addStatLine(scene, xPos, yPos, lineHeight, fontSize, "Soldats", `${soldiersCount} > `, `${nextSoldiers}`);
        yPos = addStatLine(scene, xPos, yPos, lineHeight, fontSize, "Respawn", `${(respawnTime / 1000).toFixed(1)}s > `, `${(nextRespawn / 1000).toFixed(1)}s`);
        yPos = addStatLine(scene, xPos, yPos, lineHeight, fontSize, "HP Soldat", `${soldierHp} > `, `${nextHp}`);
        yPos += lineHeight * 0.5;
        const canAfford = scene.money >= nextStats.cost;
        const costText = scene.add.text(xPos, yPos, `Co\xfbt : `, {
            fontSize: `${fontSize}px`,
            fill: "#ffffff",
            fontFamily: "Arial"
        }).setDepth(241);
        const costValue = scene.add.text(xPos + costText.width, yPos, `${nextStats.cost}$`, {
            fontSize: `${fontSize}px`,
            fill: canAfford ? "#ffd700" : "#ff4444",
            fontStyle: "bold",
            fontFamily: "Arial"
        }).setDepth(241);
        scene.upgradeTextLines.push(costText, costValue);
        scene.upgradeMenu.add([
            costText,
            costValue
        ]);
    } else {
        const soldiersText = scene.add.text(xPos, yPos, `Soldats : ${soldiersCount}`, {
            fontSize: `${fontSize}px`,
            fill: "#ffffff",
            fontFamily: "Arial"
        }).setDepth(241);
        scene.upgradeTextLines.push(soldiersText);
        scene.upgradeMenu.add(soldiersText);
        yPos += lineHeight;
        const respawnText = scene.add.text(xPos, yPos, `Respawn : ${(respawnTime / 1000).toFixed(1)}s`, {
            fontSize: `${fontSize}px`,
            fill: "#ffffff",
            fontFamily: "Arial"
        }).setDepth(241);
        scene.upgradeTextLines.push(respawnText);
        scene.upgradeMenu.add(respawnText);
        yPos += lineHeight;
        const hpText = scene.add.text(xPos, yPos, `HP Soldat : ${soldierHp}`, {
            fontSize: `${fontSize}px`,
            fill: "#ffffff",
            fontFamily: "Arial"
        }).setDepth(241);
        scene.upgradeTextLines.push(hpText);
        scene.upgradeMenu.add(hpText);
        yPos += lineHeight * 1.5;
        const maxText = scene.add.text(xPos, yPos, `Niveau Maximum`, {
            fontSize: `${fontSize}px`,
            fill: "#ff0000",
            fontStyle: "bold",
            fontFamily: "Arial"
        }).setDepth(241);
        scene.upgradeTextLines.push(maxText);
        scene.upgradeMenu.add(maxText);
    }
}
function renderTurretUpgrade(scene, turret, xPos, yPosStart, lineHeight, fontSize) {
    let yPos = yPosStart;
    const level = turret.level || 1;
    const nextStats = turret.getNextLevelStats?.();
    const title = scene.add.text(xPos, yPos, `${turret.config.name} - Niveau ${level}`, {
        fontSize: `${fontSize + 2}px`,
        fill: "#ffffff",
        fontStyle: "bold",
        fontFamily: "Arial"
    }).setDepth(241);
    scene.upgradeTextLines.push(title);
    scene.upgradeMenu.add(title);
    yPos += lineHeight * 1.5;
    const currentDamage = turret.config.damage || 0;
    const currentRate = turret.config.rate || 0;
    const currentRange = turret.config.range || 0;
    if (nextStats) {
        yPos = addStatLine(scene, xPos, yPos, lineHeight, fontSize, "D\xe9g\xe2ts", `${currentDamage} > `, `${nextStats.damage || 0}`);
        yPos = addStatLine(scene, xPos, yPos, lineHeight, fontSize, "Cadence", `${(currentRate / 1000).toFixed(1)}s > `, `${((nextStats.rate || 0) / 1000).toFixed(1)}s`);
        yPos = addStatLine(scene, xPos, yPos, lineHeight, fontSize, "Port\xe9e", `${currentRange} > `, `${nextStats.range || 0}`);
        if (nextStats.aoe) yPos = addStatLine(scene, xPos, yPos, lineHeight, fontSize, "Zone", `${turret.config.aoe || 0} > `, `${nextStats.aoe}`);
        yPos += lineHeight * 0.5;
        const canAfford = scene.money >= nextStats.cost;
        const costText = scene.add.text(xPos, yPos, `Co\xfbt : `, {
            fontSize: `${fontSize}px`,
            fill: "#ffffff",
            fontFamily: "Arial"
        }).setDepth(241);
        const costValue = scene.add.text(xPos + costText.width, yPos, `${nextStats.cost}$`, {
            fontSize: `${fontSize}px`,
            fill: canAfford ? "#ffd700" : "#ff4444",
            fontStyle: "bold",
            fontFamily: "Arial"
        }).setDepth(241);
        scene.upgradeTextLines.push(costText, costValue);
        scene.upgradeMenu.add([
            costText,
            costValue
        ]);
    } else {
        const damageText = scene.add.text(xPos, yPos, `D\xe9g\xe2ts : ${currentDamage}`, {
            fontSize: `${fontSize}px`,
            fill: "#ffffff",
            fontFamily: "Arial"
        }).setDepth(241);
        scene.upgradeTextLines.push(damageText);
        scene.upgradeMenu.add(damageText);
        yPos += lineHeight;
        const rateText = scene.add.text(xPos, yPos, `Cadence : ${(currentRate / 1000).toFixed(1)}s`, {
            fontSize: `${fontSize}px`,
            fill: "#ffffff",
            fontFamily: "Arial"
        }).setDepth(241);
        scene.upgradeTextLines.push(rateText);
        scene.upgradeMenu.add(rateText);
        yPos += lineHeight;
        const rangeText = scene.add.text(xPos, yPos, `Port\xe9e : ${currentRange}`, {
            fontSize: `${fontSize}px`,
            fill: "#ffffff",
            fontFamily: "Arial"
        }).setDepth(241);
        scene.upgradeTextLines.push(rangeText);
        scene.upgradeMenu.add(rangeText);
        yPos += lineHeight;
        if (turret.config.aoe) {
            const aoeText = scene.add.text(xPos, yPos, `Zone : ${turret.config.aoe}`, {
                fontSize: `${fontSize}px`,
                fill: "#ffffff",
                fontFamily: "Arial"
            }).setDepth(241);
            scene.upgradeTextLines.push(aoeText);
            scene.upgradeMenu.add(aoeText);
            yPos += lineHeight;
        }
        yPos += lineHeight * 0.5;
        const maxText = scene.add.text(xPos, yPos, `Niveau Maximum`, {
            fontSize: `${fontSize}px`,
            fill: "#ff0000",
            fontStyle: "bold",
            fontFamily: "Arial"
        }).setDepth(241);
        scene.upgradeTextLines.push(maxText);
        scene.upgradeMenu.add(maxText);
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"9HXrx":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "InputManager", ()=>InputManager);
var _settingsJs = require("../../config/settings.js");
var _dragHandlerJs = require("./input/DragHandler.js");
class InputManager {
    constructor(scene, spellManager, uiManager){
        this.scene = scene;
        this.spellManager = spellManager;
        this.uiManager = uiManager;
        this.dragHandler = new (0, _dragHandlerJs.DragHandler)(scene, uiManager);
        this.tileHighlight = null;
        this.longPressTimer = null;
        this.longPressDelay = 500;
    }
    setUIManager(uiManager) {
        this.uiManager = uiManager;
        this.dragHandler.uiManager = uiManager;
    }
    setupInputHandlers() {
        this.scene.input.on("pointermove", (pointer)=>{
            const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scene.scaleFactor;
            if (pointer.worldY < this.scene.mapStartY || pointer.worldY > this.scene.mapStartY + 15 * T || pointer.worldX < this.scene.mapStartX || pointer.worldX > this.scene.mapStartX + 15 * T) {
                if (this.tileHighlight) this.tileHighlight.setVisible(false);
                return;
            }
            const tx = Math.floor((pointer.worldX - this.scene.mapStartX) / T);
            const ty = Math.floor((pointer.worldY - this.scene.mapStartY) / T);
            if (tx < 0 || tx >= 15 || ty < 0 || ty >= 15) {
                if (this.tileHighlight) this.tileHighlight.setVisible(false);
                return;
            }
            if (!this.tileHighlight) {
                this.tileHighlight = this.scene.add.graphics();
                this.tileHighlight.setDepth(1);
            }
            const px = this.scene.mapStartX + tx * T;
            const py = this.scene.mapStartY + ty * T;
            this.tileHighlight.clear();
            this.tileHighlight.lineStyle(2, 0xffffff, 0.3);
            this.tileHighlight.strokeRect(px, py, T, T);
            this.tileHighlight.setVisible(true);
        });
        this.scene.input.on("pointerdown", (pointer)=>{
            if (this.scene.isPaused) return;
            this.uiManager.hideMenus();
            this.scene.selectedTurret = null;
            if (this.isPointerOnToolbar(pointer)) return;
            if (this.dragHandler.draggingTurret) {
                if (pointer.rightButtonDown()) this.cancelDrag();
                return;
            }
            if (pointer.rightButtonDown()) this.handleRightClick(pointer);
            else if (pointer.isDown) this.longPressTimer = this.scene.time.delayedCall(this.longPressDelay, ()=>{
                this.handleRightClick(pointer);
            });
        });
        this.scene.input.on("pointerup", (pointer)=>{
            if (this.longPressTimer) {
                this.longPressTimer.remove();
                this.longPressTimer = null;
                if (!this.dragHandler.draggingTurret && !this.isPointerOnToolbar(pointer)) this.handleNormalClick(pointer);
            }
            if (this.dragHandler.draggingTurret && pointer.leftButtonReleased() && !this.isPointerOnToolbar(pointer)) this.dragHandler.placeDraggedTurret(pointer);
            if (this.spellManager.isPlacingSpell() && pointer.leftButtonReleased() && !this.isPointerOnToolbar(pointer)) this.spellManager.placeLightning(pointer.worldX, pointer.worldY);
            if (this.spellManager.isPlacingSpell() && pointer.rightButtonReleased()) this.spellManager.cancelSpellPlacement();
        });
        this.scene.input.keyboard.on("keydown-ESC", ()=>{
            if (this.spellManager.isPlacingSpell()) this.spellManager.cancelSpellPlacement();
            else this.cancelDrag();
        });
    }
    handleRightClick(pointer) {
        const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scene.scaleFactor;
        if (pointer.worldY < this.scene.mapStartY || pointer.worldY > this.scene.mapStartY + 15 * T || pointer.worldX < this.scene.mapStartX || pointer.worldX > this.scene.mapStartX + 15 * T) return;
        const tx = Math.floor((pointer.worldX - this.scene.mapStartX) / T);
        const ty = Math.floor((pointer.worldY - this.scene.mapStartY) / T);
        if (tx < 0 || tx >= 15 || ty < 0 || ty >= 15) return;
        let clickedTurret = null;
        for (const t of this.scene.turrets){
            const turretTx = Math.floor((t.x - this.scene.mapStartX) / T);
            const turretTy = Math.floor((t.y - this.scene.mapStartY) / T);
            if (turretTx === tx && turretTy === ty) {
                clickedTurret = t;
                break;
            }
        }
        if (!clickedTurret) for (const b of this.scene.barracks){
            const barracksTx = Math.floor((b.x - this.scene.mapStartX) / T);
            const barracksTy = Math.floor((b.y - this.scene.mapStartY) / T);
            if (barracksTx === tx && barracksTy === ty) {
                clickedTurret = b;
                break;
            }
        }
        if (clickedTurret) {
            this.uiManager.openUpgradeMenu(pointer, clickedTurret);
            return;
        }
        const tileType = this.scene.levelConfig.map[ty][tx];
        if (tileType !== 0 && tileType !== 6) return;
        if (this.scene.mapManager.hasTree(tx, ty)) {
            this.uiManager.openTreeRemovalConfirmation(pointer, tx, ty);
            return;
        }
        this.uiManager.openBuildMenu(pointer);
    }
    handleNormalClick(pointer) {}
    isPointerOnToolbar(pointer) {
        return this.uiManager.isPointerOnToolbar(pointer);
    }
    startDrag(turretConfig) {
        this.dragHandler.startDrag(turretConfig);
    }
    update() {
        this.dragHandler.update();
    }
    cancelDrag() {
        this.dragHandler.cancelDrag();
    }
}

},{"../../config/settings.js":"9kTMs","./input/DragHandler.js":"9SPrl","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"9SPrl":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "DragHandler", ()=>DragHandler);
var _settingsJs = require("../../../config/settings.js");
class DragHandler {
    constructor(scene, uiManager){
        this.scene = scene;
        this.uiManager = uiManager;
        this.draggingTurret = null;
        this.placementPreview = null;
        this.validCellsPreview = [];
    }
    startDrag(turretConfig) {
        if (!turretConfig || !this.scene.scene || !this.scene.scene.isActive()) return;
        this.draggingTurret = turretConfig;
        if (this.placementPreview && this.placementPreview.active !== false) try {
            this.placementPreview.destroy();
        } catch (e) {}
        try {
            const preview = this.scene.add.graphics();
            preview.fillStyle(turretConfig.color || 0x888888, 0.6);
            preview.fillCircle(0, 0, 20 * this.scene.scaleFactor);
            preview.lineStyle(2, turretConfig.color || 0x888888);
            preview.strokeCircle(0, 0, 20 * this.scene.scaleFactor);
            preview.setDepth(200);
            this.placementPreview = preview;
            this.showValidPlacementCells();
        } catch (e) {
            console.warn("Erreur lors du d\xe9marrage du drag:", e);
            this.draggingTurret = null;
        }
    }
    update() {
        if (this.draggingTurret) this.updatePlacementPreview();
    }
    updatePlacementPreview() {
        if (!this.placementPreview || !this.draggingTurret) {
            if (!this.placementPreview && this.draggingTurret) this.draggingTurret = null;
            return;
        }
        if (this.placementPreview.active === false) {
            this.draggingTurret = null;
            this.placementPreview = null;
            return;
        }
        try {
            const pointer = this.scene.input.activePointer;
            if (!pointer) return;
            const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scene.scaleFactor;
            this.placementPreview.setPosition(pointer.worldX, pointer.worldY);
            const tx = Math.floor((pointer.worldX - this.scene.mapStartX) / T);
            const ty = Math.floor((pointer.worldY - this.scene.mapStartY) / T);
            let canPlace = false;
            if (tx >= 0 && tx < 15 && ty >= 0 && ty < 15 && this.scene.levelConfig && this.scene.levelConfig.map) {
                const tileType = this.scene.levelConfig.map[ty][tx];
                if (tileType === 0 || tileType === 6) {
                    const hasTree = this.scene.mapManager && this.scene.mapManager.hasTree ? this.scene.mapManager.hasTree(tx, ty) : false;
                    if (!hasTree) {
                        if (this.draggingTurret.key === "barracks") canPlace = this.scene.mapManager && this.scene.mapManager.isAdjacentToPath ? this.scene.mapManager.isAdjacentToPath(tx, ty) && this.scene.money >= this.draggingTurret.cost : false;
                        else canPlace = this.scene.money >= this.draggingTurret.cost;
                    }
                }
            }
            this.placementPreview.clear();
            const color = canPlace ? 0x00ff00 : 0xff0000;
            this.placementPreview.fillStyle(color, 0.4);
            this.placementPreview.fillCircle(0, 0, 20 * this.scene.scaleFactor);
            this.placementPreview.lineStyle(2, color);
            this.placementPreview.strokeCircle(0, 0, 20 * this.scene.scaleFactor);
        } catch (e) {
            console.warn("Erreur lors de la mise \xe0 jour du preview:", e);
            this.draggingTurret = null;
            if (this.placementPreview && this.placementPreview.active !== false) try {
                this.placementPreview.destroy();
            } catch (e2) {}
            this.placementPreview = null;
        }
    }
    showValidPlacementCells() {
        if (this.validCellsPreview) {
            this.validCellsPreview.forEach((cell)=>cell.destroy());
            this.validCellsPreview = [];
        } else this.validCellsPreview = [];
        const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scene.scaleFactor;
        for(let y = 0; y < 15; y++)for(let x = 0; x < 15; x++){
            const tileType = this.scene.levelConfig.map[y][x];
            if (tileType === 0 || tileType === 6) {
                const hasTree = this.scene.mapManager.hasTree(x, y);
                if (!hasTree) {
                    let canPlace = false;
                    if (this.draggingTurret.key === "barracks") canPlace = this.scene.mapManager.isAdjacentToPath(x, y) && this.scene.money >= this.draggingTurret.cost;
                    else canPlace = this.scene.money >= this.draggingTurret.cost;
                    if (canPlace) {
                        const px = this.scene.mapStartX + x * T + T / 2;
                        const py = this.scene.mapStartY + y * T + T / 2;
                        const cell = this.scene.add.rectangle(px, py, T - 4, T - 4, 0x00ff00, 0.2);
                        cell.setStrokeStyle(2, 0x00ff00, 0.5);
                        cell.setDepth(1);
                        this.validCellsPreview.push(cell);
                    }
                }
            }
        }
    }
    placeDraggedTurret(pointer) {
        if (!this.draggingTurret) return;
        const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scene.scaleFactor;
        const tx = Math.floor((pointer.worldX - this.scene.mapStartX) / T);
        const ty = Math.floor((pointer.worldY - this.scene.mapStartY) / T);
        if (tx >= 0 && tx < 15 && ty >= 0 && ty < 15) {
            const tileType = this.scene.levelConfig.map[ty][tx];
            if (tileType === 0 || tileType === 6) {
                const hasTree = this.scene.mapManager.hasTree(tx, ty);
                if (!hasTree) {
                    const success = this.scene.buildTurret(this.draggingTurret, tx, ty);
                    if (success) {
                        this.cancelDrag();
                        this.uiManager.updateToolbarCounts();
                    }
                } else this.scene.cameras.main.shake(50, 0.005);
            }
        }
    }
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
}

},{"../../../config/settings.js":"9kTMs","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"WA9IR":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "SpellManager", ()=>SpellManager);
var _settingsJs = require("../../config/settings.js");
var _lightningJs = require("../../sorts/lightning.js");
class SpellManager {
    constructor(scene){
        this.scene = scene;
        this.placingSpell = null;
        this.spellPreview = null;
        this.lightningCooldown = 0;
        this.lightningOnCooldown = false;
        this.lightningSpellButton = null;
    }
    attachLightningButton(button) {
        this.lightningSpellButton = button;
        this.updateLightningSpellButton();
    }
    startPlacingLightning() {
        if (this.lightningCooldown > 0 || this.placingSpell) return;
        this.placingSpell = (0, _lightningJs.lightning);
        if (!this.spellPreview) {
            this.spellPreview = this.scene.add.graphics();
            this.spellPreview.setDepth(200);
        }
        this.scene.input.on("pointermove", this.updateSpellPreview, this);
    }
    isPlacingSpell() {
        return !!this.placingSpell;
    }
    updateSpellPreview(pointer) {
        if (!this.placingSpell || !this.spellPreview) return;
        const radius = (0, _lightningJs.lightning).radius;
        const x = pointer.worldX;
        const y = pointer.worldY;
        this.spellPreview.clear();
        this.spellPreview.lineStyle(3, 0x00ffff, 0.8);
        this.spellPreview.strokeCircle(x, y, radius);
        this.spellPreview.fillStyle(0x00ffff, 0.2);
        this.spellPreview.fillCircle(x, y, radius);
    }
    placeLightning(x, y) {
        if (!this.placingSpell || this.lightningOnCooldown) return;
        this.lightningOnCooldown = true;
        this.lightningCooldown = (0, _lightningJs.lightning).cooldown;
        this.castLightning(x, y);
        this.cancelSpellPlacement();
    }
    cancelSpellPlacement() {
        this.placingSpell = null;
        if (this.spellPreview) this.spellPreview.clear();
        this.scene.input.off("pointermove", this.updateSpellPreview, this);
    }
    castLightning(x, y) {
        const effectRadius = (0, _lightningJs.lightning).radius;
        const lightningBolt = this.scene.add.graphics();
        lightningBolt.setDepth(300);
        const startY = this.scene.mapStartY - 50;
        lightningBolt.lineStyle(10, 0xffffff, 1);
        lightningBolt.beginPath();
        lightningBolt.moveTo(x, startY);
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
        ];
        for(let i = 1; i <= steps; i++){
            const currentY = startY + stepHeight * i;
            const offsetX = offsets[i - 1] || 0;
            lightningBolt.lineTo(x + offsetX, currentY);
        }
        lightningBolt.lineTo(x, y);
        lightningBolt.strokePath();
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
        ];
        for(let i = 1; i <= steps; i++){
            const currentY = startY + stepHeight * i;
            const offsetX = offsets2[i - 1] || 0;
            lightningBolt.lineTo(x + offsetX, currentY);
        }
        lightningBolt.lineTo(x, y);
        lightningBolt.strokePath();
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
        const flash = this.scene.add.circle(x, y, effectRadius * 1.5, 0xffffff, 1);
        flash.setDepth(301);
        this.scene.tweens.add({
            targets: flash,
            scale: 0,
            alpha: 0,
            duration: 200,
            onComplete: ()=>{
                flash.destroy();
                lightningBolt.destroy();
            }
        });
        const burnZone = this.scene.add.graphics();
        burnZone.setDepth(5);
        burnZone.fillStyle(0x000000, 0.6);
        burnZone.fillCircle(x, y, effectRadius);
        burnZone.lineStyle(2, 0x8b4513, 1);
        burnZone.strokeCircle(x, y, effectRadius);
        this.scene.tweens.add({
            targets: burnZone,
            alpha: 0,
            duration: 5000,
            onComplete: ()=>burnZone.destroy()
        });
        if (this.scene.enemies) this.scene.enemies.children.each((enemy)=>{
            if (enemy && enemy.active) {
                const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
                if (dist <= effectRadius) {
                    enemy.damage((0, _lightningJs.lightning).damage);
                    if (enemy.hp > 0 && enemy.paralyze) enemy.paralyze((0, _lightningJs.lightning).paralysisDuration);
                }
            }
        });
        for(let i = 0; i < 20; i++){
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * effectRadius;
            const px = x + Math.cos(angle) * dist;
            const py = y + Math.sin(angle) * dist;
            const particle = this.scene.add.circle(px, py, 3, 0xffff00, 1);
            particle.setDepth(302);
            this.scene.tweens.add({
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
    updateLightningSpellButton() {
        if (!this.lightningSpellButton) return;
        const { bg, icon, cooldownMask, cooldownText } = this.lightningSpellButton;
        const cooldownPercent = this.lightningCooldown / (0, _lightningJs.lightning).cooldown;
        const remainingSeconds = Math.ceil(this.lightningCooldown / 1000);
        if (this.lightningCooldown > 0) {
            cooldownMask.setVisible(true);
            cooldownMask.clear();
            const itemSize = 80 * this.scene.scaleFactor;
            const radius = itemSize / 2;
            cooldownMask.clear();
            cooldownMask.fillStyle(0x000000, 0.7);
            if (cooldownPercent > 0) {
                const startAngle = -Math.PI / 2;
                const endAngle = startAngle + cooldownPercent * Math.PI * 2;
                cooldownMask.beginPath();
                cooldownMask.moveTo(0, 0);
                cooldownMask.arc(0, 0, radius, startAngle, endAngle, false);
                cooldownMask.closePath();
                cooldownMask.fillPath();
            }
            cooldownText.setText(`${remainingSeconds}s`);
            cooldownText.setVisible(true);
            bg.setFillStyle(0x1a1a1a, 0.6);
            bg.setStrokeStyle(3, 0x444444);
            icon.setAlpha(0.5);
            bg.disableInteractive();
        } else {
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
    drawLightningIcon(graphics, x, y, size) {
        graphics.clear();
        graphics.fillStyle(0xffff00, 1);
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
        graphics.lineStyle(2, 0xffffff, 1);
        graphics.strokePath();
    }
    update(time, delta) {
        if (this.lightningCooldown > 0) {
            this.lightningCooldown -= delta;
            if (this.lightningCooldown <= 0) {
                this.lightningCooldown = 0;
                this.lightningOnCooldown = false;
            }
            this.updateLightningSpellButton();
        } else if (this.lightningOnCooldown) {
            this.lightningOnCooldown = false;
            this.updateLightningSpellButton();
        }
    }
}

},{"../../config/settings.js":"9kTMs","../../sorts/lightning.js":"lqA3P","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"bSv7j":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "TextureFactory", ()=>TextureFactory);
var _settingsJs = require("../../config/settings.js");
class TextureFactory {
    static generate(scene) {
        const T = (0, _settingsJs.CONFIG).TILE_SIZE;
        // Vérifier que le système de textures est disponible
        if (!scene.textures || !scene.make) {
            console.warn("Syst\xe8me de textures non disponible");
            return;
        }
        const g = scene.make.graphics({
            add: false
        });
        if (!g) {
            console.warn("Impossible de cr\xe9er l'objet Graphics");
            return;
        }
        // Fonction helper pour générer une texture seulement si elle n'existe pas
        const generateIfNotExists = (key, drawFunc)=>{
            try {
                if (!scene.textures || !g) {
                    console.warn(`Syst\xe8me de textures ou Graphics non disponible pour ${key}`);
                    return;
                }
                if (scene.textures.exists(key)) return; // Texture déjà existante, ne pas regénérer
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
        // --- TEXTURES BIOME NEIGE ---
        // tile_snow_1 (Sol Neige - ID 6 & 9)
        generateIfNotExists("tile_snow_1", ()=>{
            // Fond blanc légèrement bleuté (AliceBlue)
            g.fillStyle(0xf0f8ff, 1);
            g.fillRect(0, 0, T, T);
            // Texture de neige (petits points gris/bleu clair)
            g.fillStyle(0xdbe9f4, 0.8);
            for(let i = 0; i < 40; i++){
                const size = Math.random() * 3 + 1;
                g.fillCircle(Math.random() * T, Math.random() * T, size);
            }
        });
        // tile_snow_path (Chemin Glacé - ID 7)
        generateIfNotExists("tile_snow_path", ()=>{
            // Fond glace (PowderBlue)
            g.fillStyle(0xb0e0e6, 1);
            g.fillRect(0, 0, T, T);
            // Effet de traces/rayures sur la glace
            g.lineStyle(1, 0xffffff, 0.6);
            for(let i = 0; i < 10; i++){
                const sx = Math.random() * T;
                const sy = Math.random() * T;
                g.beginPath();
                g.moveTo(sx, sy);
                g.lineTo(sx + (Math.random() - 0.5) * 20, sy + (Math.random() - 0.5) * 20);
                g.strokePath();
            }
            // Bordure du chemin (neige tassée)
            g.fillStyle(0xe0ffff, 0.5);
            g.fillRect(0, 0, T, 3);
            g.fillRect(0, T - 3, T, 3);
            g.fillRect(0, 0, 3, T);
            g.fillRect(T - 3, 0, 3, T);
        });
        // tile_ice_water (Eau Gelée / Trou - ID 8)
        generateIfNotExists("tile_ice_water", ()=>{
            // Eau sombre en dessous
            g.fillStyle(0x4682b4, 1); // SteelBlue
            g.fillRect(0, 0, T, T);
            // Couche de glace par dessus (semi-transparente)
            g.fillStyle(0xaaddff, 0.7);
            g.fillRect(0, 0, T, T);
            // Fissures bleues foncées
            g.lineStyle(2, 0x2f4f4f, 0.5);
            g.beginPath();
            g.moveTo(0, Math.random() * T);
            g.lineTo(T / 2, T / 2);
            g.lineTo(T, Math.random() * T);
            g.strokePath();
            // Reflets blancs
            g.fillStyle(0xffffff, 0.6);
            g.fillCircle(T * 0.2, T * 0.2, 3);
            g.fillCircle(T * 0.7, T * 0.6, 2);
        });
    // Ne pas détruire l'objet Graphics ici car il peut être réutilisé
    // Il sera nettoyé automatiquement par Phaser quand la scène est détruite
    }
}

},{"../../config/settings.js":"9kTMs","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}]},["fILKw"], "fILKw", "parcelRequirebaba", {})

//# sourceMappingURL=towerdefense.1fcc916e.js.map
