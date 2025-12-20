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
  function $parcel$resolve(url) {  url = importMap[url] || url;  return import.meta.resolve(distDir + url);}newRequire.resolve = $parcel$resolve;

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
var _mapSceneJs = require("./scenes/MapScene.js");
var _gameSceneJs = require("./scenes/GameScene.js");
var _settingsJs = require("./config/settings.js");
var _authOverlayJs = require("./services/authOverlay.js");
var _authManagerJs = require("./services/authManager.js");
const config = {
    type: Phaser.AUTO,
    parent: "game-container",
    // Utiliser la taille de la fenêtre pour remplir tout l'écran
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
        (0, _mapSceneJs.MapScene),
        (0, _gameSceneJs.GameScene)
    ],
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    }
};
(0, _authOverlayJs.setupAuthOverlay)();
let game = null;
(0, _authManagerJs.ensureProfileLoaded)().catch(()=>{
// L'overlay demandera une reconnexion si besoin
}).finally(()=>{
    game = new Phaser.Game(config);
    // Stocker les infos de taille dans le jeu pour y accéder depuis les scènes
    game.baseWidth = (0, _settingsJs.CONFIG).GAME_WIDTH;
    game.baseHeight = (0, _settingsJs.CONFIG).GAME_HEIGHT;
    // Gérer le redimensionnement
    function handleResize() {
        // Notifier la scène active sans jamais la redémarrer
        if (game.scene.isActive("GameScene")) {
            const scene = game.scene.getScene("GameScene");
            if (scene && scene.handleResize) scene.handleResize();
        }
    }
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", ()=>{
        setTimeout(handleResize, 100);
    });
});
// Empêcher le double-tap zoom sur mobile
let lastTouchEnd = 0;
document.addEventListener("touchend", (event)=>{
    const now = Date.now();
    if (now - lastTouchEnd <= 300) event.preventDefault();
    lastTouchEnd = now;
}, false);

},{"./scenes/MainMenuScene.js":"4CleT","./scenes/GameScene.js":"bDbTi","./config/settings.js":"9kTMs","./services/authOverlay.js":"g1JuO","./services/authManager.js":"cvKjF","./scenes/MapScene.js":"60Yvj"}],"4CleT":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "MainMenuScene", ()=>MainMenuScene);
var _authManagerJs = require("../services/authManager.js");
var _authOverlayJs = require("../services/authOverlay.js");
var _leaderboardUIJs = require("./components/LeaderboardUI.js");
var _heroUpgradeUIJs = require("./components/HeroUpgradeUI.js");
class MainMenuScene extends Phaser.Scene {
    constructor(){
        super("MainMenuScene");
    }
    preload() {
        const backgroundUrl = new URL(require("95ddb640642c8907")).href;
        this.load.image("background", backgroundUrl);
    }
    create() {
        const { width, height } = this.scale;
        const cx = width / 2;
        const padding = 40; // Marge identique pour la gauche et la droite
        // --- 1. AMBIANCE & FOND ---
        this.addBackground(cx, height);
        // --- 2. TITRE PRINCIPAL ---
        const title = this.add.text(cx, height * 0.3, "LAST OUTPOST", {
            fontFamily: "Impact, sans-serif",
            fontSize: "82px",
            color: "#ffffff"
        }).setOrigin(0.5).setShadow(0, 0, "#00f2ff", 30, true, true);
        // --- 3. BOUTON DÉPLOYER (CENTRE) ---
        this.createPlayButton(cx, height * 0.55);
        // --- 4. COMPOSANTS INTERFACE ---
        // À GAUCHE : Amélioration du Héros
        this.heroPanel = new (0, _heroUpgradeUIJs.HeroUpgradeUI)(this, padding, height * 0.25);
        // À DROITE : Leaderboard (Fixé pour ne plus être coupé)
        // Largeur du leaderboard = 460. Position = Largeur totale - Largeur composant - Marge
        const leaderboardWidth = 460;
        const lbX = width - leaderboardWidth - padding;
        this.leaderboard = new (0, _leaderboardUIJs.LeaderboardUI)(this, lbX, height * 0.15);
        // --- 5. PIED DE PAGE ---
        this.createLogoutButton(height - 40);
        // --- 6. ÉVÉNEMENTS ---
        this.setupEventListeners();
        // Initialisation
        (0, _authManagerJs.ensureProfileLoaded)().then(()=>{
            if (this.heroPanel) this.heroPanel.refresh();
        });
    }
    createPlayButton(x, y) {
        const playBtn = this.add.container(x, y);
        const bg = this.add.graphics();
        const btnW = 300;
        const btnH = 80;
        const drawBtn = (isOver)=>{
            bg.clear();
            bg.fillStyle(0x00f2ff, isOver ? 0.4 : 0.2);
            bg.lineStyle(3, 0x00f2ff, 1);
            bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 10);
            bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 10);
        };
        drawBtn(false);
        const txt = this.add.text(0, 0, "D\xc9PLOYER", {
            fontSize: "32px",
            fontFamily: "Orbitron, sans-serif",
            color: "#fff",
            fontWeight: "bold",
            letterSpacing: 4
        }).setOrigin(0.5);
        playBtn.add([
            bg,
            txt
        ]);
        playBtn.setInteractive(new Phaser.Geom.Rectangle(-btnW / 2, -btnH / 2, btnW, btnH), Phaser.Geom.Rectangle.Contains);
        playBtn.on("pointerover", ()=>{
            drawBtn(true);
            playBtn.setScale(1.05);
        });
        playBtn.on("pointerout", ()=>{
            drawBtn(false);
            playBtn.setScale(1);
        });
        playBtn.on("pointerdown", ()=>this.scene.start("MapScene"));
    }
    addBackground(cx, height) {
        this.cameras.main.setBackgroundColor("#020508");
        if (this.textures.exists("background")) {
            const bg = this.add.image(cx, height / 2, "background").setDepth(-1).setScrollFactor(0).setTint(0x333333); // Un peu plus sombre pour faire ressortir l'UI
            const scale = Math.max(this.scale.width / bg.width, this.scale.height / bg.height);
            bg.setScale(scale);
        }
    }
    createLogoutButton(y) {
        const btn = this.add.text(this.scale.width / 2, y, "D\xc9CONNEXION DU SYST\xc8ME", {
            fontSize: "12px",
            fontFamily: "Orbitron, sans-serif",
            color: "#666",
            letterSpacing: 2
        }).setOrigin(0.5).setInteractive({
            useHandCursor: true
        });
        btn.on("pointerover", ()=>btn.setColor("#ff4d4d"));
        btn.on("pointerout", ()=>btn.setColor("#666"));
        btn.on("pointerdown", ()=>{
            (0, _authManagerJs.logout)();
            this.scene.restart();
            (0, _authOverlayJs.showAuth)();
        });
    }
    setupEventListeners() {
        this.profileUpdatedHandler = ()=>{
            if (this.heroPanel) this.heroPanel.refresh();
        };
        window.addEventListener("auth:profile-updated", this.profileUpdatedHandler);
        this.events.once("shutdown", ()=>{
            window.removeEventListener("auth:profile-updated", this.profileUpdatedHandler);
        });
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT","../services/authManager.js":"cvKjF","../services/authOverlay.js":"g1JuO","./components/LeaderboardUI.js":"fNAJL","./components/HeroUpgradeUI.js":"cwcYt","95ddb640642c8907":"hLiDk"}],"jnFvT":[function(require,module,exports,__globalThis) {
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

},{}],"cvKjF":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "isAuthenticated", ()=>isAuthenticated);
parcelHelpers.export(exports, "getProfile", ()=>getProfile);
parcelHelpers.export(exports, "getUnlockedLevel", ()=>getUnlockedLevel);
parcelHelpers.export(exports, "getHeroStats", ()=>getHeroStats);
parcelHelpers.export(exports, "getHeroPointConversion", ()=>getHeroPointConversion);
parcelHelpers.export(exports, "getHeroPointsAvailable", ()=>getHeroPointsAvailable);
parcelHelpers.export(exports, "getPlayer", ()=>getPlayer);
parcelHelpers.export(exports, "ensureProfileLoaded", ()=>ensureProfileLoaded);
parcelHelpers.export(exports, "registerUser", ()=>registerUser);
parcelHelpers.export(exports, "loginUser", ()=>loginUser);
parcelHelpers.export(exports, "logout", ()=>logout);
parcelHelpers.export(exports, "recordHeroKill", ()=>recordHeroKill);
parcelHelpers.export(exports, "recordLevelCompletion", ()=>recordLevelCompletion);
parcelHelpers.export(exports, "upgradeHero", ()=>upgradeHero);
parcelHelpers.export(exports, "handleAuthError", ()=>handleAuthError);
var _apiClientJs = require("./apiClient.js");
const TOKEN_KEY = "authToken";
let currentProfile = null;
let loadingProfile = null;
function setToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
}
function isAuthenticated() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
}
function getProfile() {
    return currentProfile;
}
function getUnlockedLevel() {
    return currentProfile?.progress?.unlockedLevel || 1;
}
function getHeroStats() {
    return currentProfile?.heroStats || null;
}
function getHeroPointConversion() {
    return currentProfile?.heroPointConversion || null;
}
function getHeroPointsAvailable() {
    return currentProfile?.player?.hero_points_available ?? 0;
}
function getPlayer() {
    return currentProfile?.player || null;
}
async function fetchProfile() {
    const response = await (0, _apiClientJs.apiClient).get("/api/player/me");
    currentProfile = response.data;
    return currentProfile;
}
async function ensureProfileLoaded() {
    if (!isAuthenticated()) {
        currentProfile = null;
        return null;
    }
    if (currentProfile) return currentProfile;
    if (!loadingProfile) loadingProfile = fetchProfile().finally(()=>{
        loadingProfile = null;
    });
    return loadingProfile;
}
async function registerUser({ username, email, password }) {
    const response = await (0, _apiClientJs.apiClient).post("/api/auth/register", {
        username,
        email,
        password
    });
    const { token, profile } = response.data;
    setToken(token);
    currentProfile = profile;
    return profile;
}
async function loginUser({ identifier, password }) {
    const response = await (0, _apiClientJs.apiClient).post("/api/auth/login", {
        identifier,
        password
    });
    const { token, profile } = response.data;
    setToken(token);
    currentProfile = profile;
    return profile;
}
function logout() {
    setToken(null);
    currentProfile = null;
}
async function recordHeroKill(kills = 1) {
    if (!isAuthenticated()) return null;
    const killsToRecord = Number.isInteger(kills) && kills > 0 ? kills : 1;
    const response = await (0, _apiClientJs.apiClient).post("/api/player/hero/kill", {
        kills: killsToRecord
    });
    if (currentProfile?.player) currentProfile.player.hero_points_available = response.data.heroPointsAvailable;
    return response.data;
}
async function recordLevelCompletion(payload) {
    if (!isAuthenticated()) return null;
    const response = await (0, _apiClientJs.apiClient).post("/api/player/levels/completion", {
        ...payload
    });
    if (currentProfile?.progress) currentProfile.progress = response.data.progress;
    return response.data;
}
async function upgradeHero(stat, points) {
    if (!isAuthenticated()) return null;
    const response = await (0, _apiClientJs.apiClient).post("/api/player/hero/upgrade", {
        stat,
        points
    });
    if (response.data?.profile) currentProfile = response.data.profile;
    return response.data;
}
function handleAuthError(error) {
    const message = error?.response?.data?.error || error?.message || "Une erreur est survenue";
    return message;
}

},{"./apiClient.js":"eiuF4","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"eiuF4":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "apiClient", ()=>apiClient);
var _axios = require("axios");
var _axiosDefault = parcelHelpers.interopDefault(_axios);
const API_BASE_URL = "http://localhost:3000";
const apiClient = (0, _axiosDefault.default).create({
    baseURL: API_BASE_URL,
    timeout: 10000
});
apiClient.interceptors.request.use((config)=>{
    const token = localStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
apiClient.interceptors.response.use((response)=>response, (error)=>{
    if (error.response?.status === 401) localStorage.removeItem("authToken");
    return Promise.reject(error);
});

},{"axios":"kooH4","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"kooH4":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _axiosJsDefault.default));
parcelHelpers.export(exports, "Axios", ()=>Axios);
parcelHelpers.export(exports, "AxiosError", ()=>AxiosError);
parcelHelpers.export(exports, "CanceledError", ()=>CanceledError);
parcelHelpers.export(exports, "isCancel", ()=>isCancel);
parcelHelpers.export(exports, "CancelToken", ()=>CancelToken);
parcelHelpers.export(exports, "VERSION", ()=>VERSION);
parcelHelpers.export(exports, "all", ()=>all);
parcelHelpers.export(exports, "Cancel", ()=>Cancel);
parcelHelpers.export(exports, "isAxiosError", ()=>isAxiosError);
parcelHelpers.export(exports, "spread", ()=>spread);
parcelHelpers.export(exports, "toFormData", ()=>toFormData);
parcelHelpers.export(exports, "AxiosHeaders", ()=>AxiosHeaders);
parcelHelpers.export(exports, "HttpStatusCode", ()=>HttpStatusCode);
parcelHelpers.export(exports, "formToJSON", ()=>formToJSON);
parcelHelpers.export(exports, "getAdapter", ()=>getAdapter);
parcelHelpers.export(exports, "mergeConfig", ()=>mergeConfig);
var _axiosJs = require("./lib/axios.js");
var _axiosJsDefault = parcelHelpers.interopDefault(_axiosJs);
// This module is intended to unwrap Axios default export as named.
// Keep top-level export same with static properties
// so that it can keep same with es module or cjs
const { Axios, AxiosError, CanceledError, isCancel, CancelToken, VERSION, all, Cancel, isAxiosError, spread, toFormData, AxiosHeaders, HttpStatusCode, formToJSON, getAdapter, mergeConfig } = (0, _axiosJsDefault.default);

},{"./lib/axios.js":"le7Ue","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"le7Ue":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("./utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _bindJs = require("./helpers/bind.js");
var _bindJsDefault = parcelHelpers.interopDefault(_bindJs);
var _axiosJs = require("./core/Axios.js");
var _axiosJsDefault = parcelHelpers.interopDefault(_axiosJs);
var _mergeConfigJs = require("./core/mergeConfig.js");
var _mergeConfigJsDefault = parcelHelpers.interopDefault(_mergeConfigJs);
var _indexJs = require("./defaults/index.js");
var _indexJsDefault = parcelHelpers.interopDefault(_indexJs);
var _formDataToJSONJs = require("./helpers/formDataToJSON.js");
var _formDataToJSONJsDefault = parcelHelpers.interopDefault(_formDataToJSONJs);
var _canceledErrorJs = require("./cancel/CanceledError.js");
var _canceledErrorJsDefault = parcelHelpers.interopDefault(_canceledErrorJs);
var _cancelTokenJs = require("./cancel/CancelToken.js");
var _cancelTokenJsDefault = parcelHelpers.interopDefault(_cancelTokenJs);
var _isCancelJs = require("./cancel/isCancel.js");
var _isCancelJsDefault = parcelHelpers.interopDefault(_isCancelJs);
var _dataJs = require("./env/data.js");
var _toFormDataJs = require("./helpers/toFormData.js");
var _toFormDataJsDefault = parcelHelpers.interopDefault(_toFormDataJs);
var _axiosErrorJs = require("./core/AxiosError.js");
var _axiosErrorJsDefault = parcelHelpers.interopDefault(_axiosErrorJs);
var _spreadJs = require("./helpers/spread.js");
var _spreadJsDefault = parcelHelpers.interopDefault(_spreadJs);
var _isAxiosErrorJs = require("./helpers/isAxiosError.js");
var _isAxiosErrorJsDefault = parcelHelpers.interopDefault(_isAxiosErrorJs);
var _axiosHeadersJs = require("./core/AxiosHeaders.js");
var _axiosHeadersJsDefault = parcelHelpers.interopDefault(_axiosHeadersJs);
var _adaptersJs = require("./adapters/adapters.js");
var _adaptersJsDefault = parcelHelpers.interopDefault(_adaptersJs);
var _httpStatusCodeJs = require("./helpers/HttpStatusCode.js");
var _httpStatusCodeJsDefault = parcelHelpers.interopDefault(_httpStatusCodeJs);
'use strict';
/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */ function createInstance(defaultConfig) {
    const context = new (0, _axiosJsDefault.default)(defaultConfig);
    const instance = (0, _bindJsDefault.default)((0, _axiosJsDefault.default).prototype.request, context);
    // Copy axios.prototype to instance
    (0, _utilsJsDefault.default).extend(instance, (0, _axiosJsDefault.default).prototype, context, {
        allOwnKeys: true
    });
    // Copy context to instance
    (0, _utilsJsDefault.default).extend(instance, context, null, {
        allOwnKeys: true
    });
    // Factory for creating new instances
    instance.create = function create(instanceConfig) {
        return createInstance((0, _mergeConfigJsDefault.default)(defaultConfig, instanceConfig));
    };
    return instance;
}
// Create the default instance to be exported
const axios = createInstance((0, _indexJsDefault.default));
// Expose Axios class to allow class inheritance
axios.Axios = (0, _axiosJsDefault.default);
// Expose Cancel & CancelToken
axios.CanceledError = (0, _canceledErrorJsDefault.default);
axios.CancelToken = (0, _cancelTokenJsDefault.default);
axios.isCancel = (0, _isCancelJsDefault.default);
axios.VERSION = (0, _dataJs.VERSION);
axios.toFormData = (0, _toFormDataJsDefault.default);
// Expose AxiosError class
axios.AxiosError = (0, _axiosErrorJsDefault.default);
// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;
// Expose all/spread
axios.all = function all(promises) {
    return Promise.all(promises);
};
axios.spread = (0, _spreadJsDefault.default);
// Expose isAxiosError
axios.isAxiosError = (0, _isAxiosErrorJsDefault.default);
// Expose mergeConfig
axios.mergeConfig = (0, _mergeConfigJsDefault.default);
axios.AxiosHeaders = (0, _axiosHeadersJsDefault.default);
axios.formToJSON = (thing)=>(0, _formDataToJSONJsDefault.default)((0, _utilsJsDefault.default).isHTMLForm(thing) ? new FormData(thing) : thing);
axios.getAdapter = (0, _adaptersJsDefault.default).getAdapter;
axios.HttpStatusCode = (0, _httpStatusCodeJsDefault.default);
axios.default = axios;
// this module should only have a default export
exports.default = axios;

},{"./utils.js":"jI6DP","./helpers/bind.js":"bgexy","./core/Axios.js":"cBDUi","./core/mergeConfig.js":"311Mu","./defaults/index.js":"9WXKx","./helpers/formDataToJSON.js":"fefHq","./cancel/CanceledError.js":"9yG1c","./cancel/CancelToken.js":"kSqbX","./cancel/isCancel.js":"fkTUi","./env/data.js":"9SLyZ","./helpers/toFormData.js":"2RXm4","./core/AxiosError.js":"7z85x","./helpers/spread.js":"i5yWF","./helpers/isAxiosError.js":"2FN3e","./core/AxiosHeaders.js":"9EzTj","./adapters/adapters.js":"hI0HS","./helpers/HttpStatusCode.js":"7tr76","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"jI6DP":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _bindJs = require("./helpers/bind.js");
var _bindJsDefault = parcelHelpers.interopDefault(_bindJs);
var global = arguments[3];
'use strict';
// utils is a library of generic helper functions non-specific to axios
const { toString } = Object.prototype;
const { getPrototypeOf } = Object;
const { iterator, toStringTag } = Symbol;
const kindOf = ((cache)=>(thing)=>{
        const str = toString.call(thing);
        return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
    })(Object.create(null));
const kindOfTest = (type)=>{
    type = type.toLowerCase();
    return (thing)=>kindOf(thing) === type;
};
const typeOfTest = (type)=>(thing)=>typeof thing === type;
/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */ const { isArray } = Array;
/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */ const isUndefined = typeOfTest('undefined');
/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */ function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */ const isArrayBuffer = kindOfTest('ArrayBuffer');
/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */ function isArrayBufferView(val) {
    let result;
    if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) result = ArrayBuffer.isView(val);
    else result = val && val.buffer && isArrayBuffer(val.buffer);
    return result;
}
/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */ const isString = typeOfTest('string');
/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */ const isFunction = typeOfTest('function');
/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */ const isNumber = typeOfTest('number');
/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */ const isObject = (thing)=>thing !== null && typeof thing === 'object';
/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */ const isBoolean = (thing)=>thing === true || thing === false;
/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */ const isPlainObject = (val)=>{
    if (kindOf(val) !== 'object') return false;
    const prototype = getPrototypeOf(val);
    return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(toStringTag in val) && !(iterator in val);
};
/**
 * Determine if a value is an empty object (safely handles Buffers)
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an empty object, otherwise false
 */ const isEmptyObject = (val)=>{
    // Early return for non-objects or Buffers to prevent RangeError
    if (!isObject(val) || isBuffer(val)) return false;
    try {
        return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
    } catch (e) {
        // Fallback for any other objects that might cause RangeError with Object.keys()
        return false;
    }
};
/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */ const isDate = kindOfTest('Date');
/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */ const isFile = kindOfTest('File');
/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */ const isBlob = kindOfTest('Blob');
/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */ const isFileList = kindOfTest('FileList');
/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */ const isStream = (val)=>isObject(val) && isFunction(val.pipe);
/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */ const isFormData = (thing)=>{
    let kind;
    return thing && (typeof FormData === 'function' && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === 'formdata' || // detect form-data instance
    kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]'));
};
/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */ const isURLSearchParams = kindOfTest('URLSearchParams');
const [isReadableStream, isRequest, isResponse, isHeaders] = [
    'ReadableStream',
    'Request',
    'Response',
    'Headers'
].map(kindOfTest);
/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */ const trim = (str)=>str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */ function forEach(obj, fn, { allOwnKeys = false } = {}) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') return;
    let i;
    let l;
    // Force an array if not already something iterable
    if (typeof obj !== 'object') /*eslint no-param-reassign:0*/ obj = [
        obj
    ];
    if (isArray(obj)) // Iterate over array values
    for(i = 0, l = obj.length; i < l; i++)fn.call(null, obj[i], i, obj);
    else {
        // Buffer check
        if (isBuffer(obj)) return;
        // Iterate over object keys
        const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
        const len = keys.length;
        let key;
        for(i = 0; i < len; i++){
            key = keys[i];
            fn.call(null, obj[key], key, obj);
        }
    }
}
function findKey(obj, key) {
    if (isBuffer(obj)) return null;
    key = key.toLowerCase();
    const keys = Object.keys(obj);
    let i = keys.length;
    let _key;
    while(i-- > 0){
        _key = keys[i];
        if (key === _key.toLowerCase()) return _key;
    }
    return null;
}
const _global = (()=>{
    /*eslint no-undef:0*/ if (typeof globalThis !== "undefined") return globalThis;
    return typeof self !== "undefined" ? self : typeof window !== 'undefined' ? window : global;
})();
const isContextDefined = (context)=>!isUndefined(context) && context !== _global;
/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */ function merge() {
    const { caseless, skipUndefined } = isContextDefined(this) && this || {};
    const result = {};
    const assignValue = (val, key)=>{
        const targetKey = caseless && findKey(result, key) || key;
        if (isPlainObject(result[targetKey]) && isPlainObject(val)) result[targetKey] = merge(result[targetKey], val);
        else if (isPlainObject(val)) result[targetKey] = merge({}, val);
        else if (isArray(val)) result[targetKey] = val.slice();
        else if (!skipUndefined || !isUndefined(val)) result[targetKey] = val;
    };
    for(let i = 0, l = arguments.length; i < l; i++)arguments[i] && forEach(arguments[i], assignValue);
    return result;
}
/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */ const extend = (a, b, thisArg, { allOwnKeys } = {})=>{
    forEach(b, (val, key)=>{
        if (thisArg && isFunction(val)) a[key] = (0, _bindJsDefault.default)(val, thisArg);
        else a[key] = val;
    }, {
        allOwnKeys
    });
    return a;
};
/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */ const stripBOM = (content)=>{
    if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
    return content;
};
/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */ const inherits = (constructor, superConstructor, props, descriptors)=>{
    constructor.prototype = Object.create(superConstructor.prototype, descriptors);
    constructor.prototype.constructor = constructor;
    Object.defineProperty(constructor, 'super', {
        value: superConstructor.prototype
    });
    props && Object.assign(constructor.prototype, props);
};
/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */ const toFlatObject = (sourceObj, destObj, filter, propFilter)=>{
    let props;
    let i;
    let prop;
    const merged = {};
    destObj = destObj || {};
    // eslint-disable-next-line no-eq-null,eqeqeq
    if (sourceObj == null) return destObj;
    do {
        props = Object.getOwnPropertyNames(sourceObj);
        i = props.length;
        while(i-- > 0){
            prop = props[i];
            if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
                destObj[prop] = sourceObj[prop];
                merged[prop] = true;
            }
        }
        sourceObj = filter !== false && getPrototypeOf(sourceObj);
    }while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
};
/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */ const endsWith = (str, searchString, position)=>{
    str = String(str);
    if (position === undefined || position > str.length) position = str.length;
    position -= searchString.length;
    const lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
};
/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */ const toArray = (thing)=>{
    if (!thing) return null;
    if (isArray(thing)) return thing;
    let i = thing.length;
    if (!isNumber(i)) return null;
    const arr = new Array(i);
    while(i-- > 0)arr[i] = thing[i];
    return arr;
};
/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */ // eslint-disable-next-line func-names
const isTypedArray = ((TypedArray)=>{
    // eslint-disable-next-line func-names
    return (thing)=>{
        return TypedArray && thing instanceof TypedArray;
    };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));
/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */ const forEachEntry = (obj, fn)=>{
    const generator = obj && obj[iterator];
    const _iterator = generator.call(obj);
    let result;
    while((result = _iterator.next()) && !result.done){
        const pair = result.value;
        fn.call(obj, pair[0], pair[1]);
    }
};
/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */ const matchAll = (regExp, str)=>{
    let matches;
    const arr = [];
    while((matches = regExp.exec(str)) !== null)arr.push(matches);
    return arr;
};
/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */ const isHTMLForm = kindOfTest('HTMLFormElement');
const toCamelCase = (str)=>{
    return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function replacer(m, p1, p2) {
        return p1.toUpperCase() + p2;
    });
};
/* Creating a function that will check if an object has a property. */ const hasOwnProperty = (({ hasOwnProperty })=>(obj, prop)=>hasOwnProperty.call(obj, prop))(Object.prototype);
/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */ const isRegExp = kindOfTest('RegExp');
const reduceDescriptors = (obj, reducer)=>{
    const descriptors = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};
    forEach(descriptors, (descriptor, name)=>{
        let ret;
        if ((ret = reducer(descriptor, name, obj)) !== false) reducedDescriptors[name] = ret || descriptor;
    });
    Object.defineProperties(obj, reducedDescriptors);
};
/**
 * Makes all methods read-only
 * @param {Object} obj
 */ const freezeMethods = (obj)=>{
    reduceDescriptors(obj, (descriptor, name)=>{
        // skip restricted props in strict mode
        if (isFunction(obj) && [
            'arguments',
            'caller',
            'callee'
        ].indexOf(name) !== -1) return false;
        const value = obj[name];
        if (!isFunction(value)) return;
        descriptor.enumerable = false;
        if ('writable' in descriptor) {
            descriptor.writable = false;
            return;
        }
        if (!descriptor.set) descriptor.set = ()=>{
            throw Error('Can not rewrite read-only method \'' + name + '\'');
        };
    });
};
const toObjectSet = (arrayOrString, delimiter)=>{
    const obj = {};
    const define = (arr)=>{
        arr.forEach((value)=>{
            obj[value] = true;
        });
    };
    isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
    return obj;
};
const noop = ()=>{};
const toFiniteNumber = (value, defaultValue)=>{
    return value != null && Number.isFinite(value = +value) ? value : defaultValue;
};
/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */ function isSpecCompliantForm(thing) {
    return !!(thing && isFunction(thing.append) && thing[toStringTag] === 'FormData' && thing[iterator]);
}
const toJSONObject = (obj)=>{
    const stack = new Array(10);
    const visit = (source, i)=>{
        if (isObject(source)) {
            if (stack.indexOf(source) >= 0) return;
            //Buffer check
            if (isBuffer(source)) return source;
            if (!('toJSON' in source)) {
                stack[i] = source;
                const target = isArray(source) ? [] : {};
                forEach(source, (value, key)=>{
                    const reducedValue = visit(value, i + 1);
                    !isUndefined(reducedValue) && (target[key] = reducedValue);
                });
                stack[i] = undefined;
                return target;
            }
        }
        return source;
    };
    return visit(obj, 0);
};
const isAsyncFn = kindOfTest('AsyncFunction');
const isThenable = (thing)=>thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
// original code
// https://github.com/DigitalBrainJS/AxiosPromise/blob/16deab13710ec09779922131f3fa5954320f83ab/lib/utils.js#L11-L34
const _setImmediate = ((setImmediateSupported, postMessageSupported)=>{
    if (setImmediateSupported) return setImmediate;
    return postMessageSupported ? ((token, callbacks)=>{
        _global.addEventListener("message", ({ source, data })=>{
            if (source === _global && data === token) callbacks.length && callbacks.shift()();
        }, false);
        return (cb)=>{
            callbacks.push(cb);
            _global.postMessage(token, "*");
        };
    })(`axios@${Math.random()}`, []) : (cb)=>setTimeout(cb);
})(typeof setImmediate === 'function', isFunction(_global.postMessage));
const asap = typeof queueMicrotask !== 'undefined' ? queueMicrotask.bind(_global) : _setImmediate;
// *********************
const isIterable = (thing)=>thing != null && isFunction(thing[iterator]);
exports.default = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isPlainObject,
    isEmptyObject,
    isReadableStream,
    isRequest,
    isResponse,
    isHeaders,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isRegExp,
    isFunction,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty,
    hasOwnProp: hasOwnProperty,
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable,
    setImmediate: _setImmediate,
    asap,
    isIterable
};

},{"./helpers/bind.js":"bgexy","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"bgexy":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>bind);
'use strict';
function bind(fn, thisArg) {
    return function wrap() {
        return fn.apply(thisArg, arguments);
    };
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"cBDUi":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("./../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _buildURLJs = require("../helpers/buildURL.js");
var _buildURLJsDefault = parcelHelpers.interopDefault(_buildURLJs);
var _interceptorManagerJs = require("./InterceptorManager.js");
var _interceptorManagerJsDefault = parcelHelpers.interopDefault(_interceptorManagerJs);
var _dispatchRequestJs = require("./dispatchRequest.js");
var _dispatchRequestJsDefault = parcelHelpers.interopDefault(_dispatchRequestJs);
var _mergeConfigJs = require("./mergeConfig.js");
var _mergeConfigJsDefault = parcelHelpers.interopDefault(_mergeConfigJs);
var _buildFullPathJs = require("./buildFullPath.js");
var _buildFullPathJsDefault = parcelHelpers.interopDefault(_buildFullPathJs);
var _validatorJs = require("../helpers/validator.js");
var _validatorJsDefault = parcelHelpers.interopDefault(_validatorJs);
var _axiosHeadersJs = require("./AxiosHeaders.js");
var _axiosHeadersJsDefault = parcelHelpers.interopDefault(_axiosHeadersJs);
'use strict';
const validators = (0, _validatorJsDefault.default).validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */ class Axios {
    constructor(instanceConfig){
        this.defaults = instanceConfig || {};
        this.interceptors = {
            request: new (0, _interceptorManagerJsDefault.default)(),
            response: new (0, _interceptorManagerJsDefault.default)()
        };
    }
    /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */ async request(configOrUrl, config) {
        try {
            return await this._request(configOrUrl, config);
        } catch (err) {
            if (err instanceof Error) {
                let dummy = {};
                Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
                // slice off the Error: ... line
                const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
                try {
                    if (!err.stack) err.stack = stack;
                    else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) err.stack += '\n' + stack;
                } catch (e) {
                // ignore the case where "stack" is an un-writable property
                }
            }
            throw err;
        }
    }
    _request(configOrUrl, config) {
        /*eslint no-param-reassign:0*/ // Allow for axios('example/url'[, config]) a la fetch API
        if (typeof configOrUrl === 'string') {
            config = config || {};
            config.url = configOrUrl;
        } else config = configOrUrl || {};
        config = (0, _mergeConfigJsDefault.default)(this.defaults, config);
        const { transitional, paramsSerializer, headers } = config;
        if (transitional !== undefined) (0, _validatorJsDefault.default).assertOptions(transitional, {
            silentJSONParsing: validators.transitional(validators.boolean),
            forcedJSONParsing: validators.transitional(validators.boolean),
            clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
        if (paramsSerializer != null) {
            if ((0, _utilsJsDefault.default).isFunction(paramsSerializer)) config.paramsSerializer = {
                serialize: paramsSerializer
            };
            else (0, _validatorJsDefault.default).assertOptions(paramsSerializer, {
                encode: validators.function,
                serialize: validators.function
            }, true);
        }
        // Set config.allowAbsoluteUrls
        if (config.allowAbsoluteUrls !== undefined) ;
        else if (this.defaults.allowAbsoluteUrls !== undefined) config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
        else config.allowAbsoluteUrls = true;
        (0, _validatorJsDefault.default).assertOptions(config, {
            baseUrl: validators.spelling('baseURL'),
            withXsrfToken: validators.spelling('withXSRFToken')
        }, true);
        // Set config.method
        config.method = (config.method || this.defaults.method || 'get').toLowerCase();
        // Flatten headers
        let contextHeaders = headers && (0, _utilsJsDefault.default).merge(headers.common, headers[config.method]);
        headers && (0, _utilsJsDefault.default).forEach([
            'delete',
            'get',
            'head',
            'post',
            'put',
            'patch',
            'common'
        ], (method)=>{
            delete headers[method];
        });
        config.headers = (0, _axiosHeadersJsDefault.default).concat(contextHeaders, headers);
        // filter out skipped interceptors
        const requestInterceptorChain = [];
        let synchronousRequestInterceptors = true;
        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
            if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) return;
            synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
            requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
        });
        const responseInterceptorChain = [];
        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
            responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
        });
        let promise;
        let i = 0;
        let len;
        if (!synchronousRequestInterceptors) {
            const chain = [
                (0, _dispatchRequestJsDefault.default).bind(this),
                undefined
            ];
            chain.unshift(...requestInterceptorChain);
            chain.push(...responseInterceptorChain);
            len = chain.length;
            promise = Promise.resolve(config);
            while(i < len)promise = promise.then(chain[i++], chain[i++]);
            return promise;
        }
        len = requestInterceptorChain.length;
        let newConfig = config;
        while(i < len){
            const onFulfilled = requestInterceptorChain[i++];
            const onRejected = requestInterceptorChain[i++];
            try {
                newConfig = onFulfilled(newConfig);
            } catch (error) {
                onRejected.call(this, error);
                break;
            }
        }
        try {
            promise = (0, _dispatchRequestJsDefault.default).call(this, newConfig);
        } catch (error) {
            return Promise.reject(error);
        }
        i = 0;
        len = responseInterceptorChain.length;
        while(i < len)promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
        return promise;
    }
    getUri(config) {
        config = (0, _mergeConfigJsDefault.default)(this.defaults, config);
        const fullPath = (0, _buildFullPathJsDefault.default)(config.baseURL, config.url, config.allowAbsoluteUrls);
        return (0, _buildURLJsDefault.default)(fullPath, config.params, config.paramsSerializer);
    }
}
// Provide aliases for supported request methods
(0, _utilsJsDefault.default).forEach([
    'delete',
    'get',
    'head',
    'options'
], function forEachMethodNoData(method) {
    /*eslint func-names:0*/ Axios.prototype[method] = function(url, config) {
        return this.request((0, _mergeConfigJsDefault.default)(config || {}, {
            method,
            url,
            data: (config || {}).data
        }));
    };
});
(0, _utilsJsDefault.default).forEach([
    'post',
    'put',
    'patch'
], function forEachMethodWithData(method) {
    /*eslint func-names:0*/ function generateHTTPMethod(isForm) {
        return function httpMethod(url, data, config) {
            return this.request((0, _mergeConfigJsDefault.default)(config || {}, {
                method,
                headers: isForm ? {
                    'Content-Type': 'multipart/form-data'
                } : {},
                url,
                data
            }));
        };
    }
    Axios.prototype[method] = generateHTTPMethod();
    Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});
exports.default = Axios;

},{"./../utils.js":"jI6DP","../helpers/buildURL.js":"3CNaw","./InterceptorManager.js":"bt5wS","./dispatchRequest.js":"1p0aT","./mergeConfig.js":"311Mu","./buildFullPath.js":"kg0Bk","../helpers/validator.js":"9wnyh","./AxiosHeaders.js":"9EzTj","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"3CNaw":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>buildURL);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _axiosURLSearchParamsJs = require("../helpers/AxiosURLSearchParams.js");
var _axiosURLSearchParamsJsDefault = parcelHelpers.interopDefault(_axiosURLSearchParamsJs);
'use strict';
/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */ function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+');
}
function buildURL(url, params, options) {
    /*eslint no-param-reassign:0*/ if (!params) return url;
    const _encode = options && options.encode || encode;
    if ((0, _utilsJsDefault.default).isFunction(options)) options = {
        serialize: options
    };
    const serializeFn = options && options.serialize;
    let serializedParams;
    if (serializeFn) serializedParams = serializeFn(params, options);
    else serializedParams = (0, _utilsJsDefault.default).isURLSearchParams(params) ? params.toString() : new (0, _axiosURLSearchParamsJsDefault.default)(params, options).toString(_encode);
    if (serializedParams) {
        const hashmarkIndex = url.indexOf("#");
        if (hashmarkIndex !== -1) url = url.slice(0, hashmarkIndex);
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }
    return url;
}

},{"../utils.js":"jI6DP","../helpers/AxiosURLSearchParams.js":"i7MZs","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"i7MZs":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _toFormDataJs = require("./toFormData.js");
var _toFormDataJsDefault = parcelHelpers.interopDefault(_toFormDataJs);
'use strict';
/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */ function encode(str) {
    const charMap = {
        '!': '%21',
        "'": '%27',
        '(': '%28',
        ')': '%29',
        '~': '%7E',
        '%20': '+',
        '%00': '\x00'
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
        return charMap[match];
    });
}
/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */ function AxiosURLSearchParams(params, options) {
    this._pairs = [];
    params && (0, _toFormDataJsDefault.default)(params, this, options);
}
const prototype = AxiosURLSearchParams.prototype;
prototype.append = function append(name, value) {
    this._pairs.push([
        name,
        value
    ]);
};
prototype.toString = function toString(encoder) {
    const _encode = encoder ? function(value) {
        return encoder.call(this, value, encode);
    } : encode;
    return this._pairs.map(function each(pair) {
        return _encode(pair[0]) + '=' + _encode(pair[1]);
    }, '').join('&');
};
exports.default = AxiosURLSearchParams;

},{"./toFormData.js":"2RXm4","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"2RXm4":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _axiosErrorJs = require("../core/AxiosError.js");
var _axiosErrorJsDefault = parcelHelpers.interopDefault(_axiosErrorJs);
// temporary hotfix to avoid circular references until AxiosURLSearchParams is refactored
var _formDataJs = require("../platform/node/classes/FormData.js");
var _formDataJsDefault = parcelHelpers.interopDefault(_formDataJs);
var Buffer = require("adfd9b103875c2dd").Buffer;
'use strict';
/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */ function isVisitable(thing) {
    return (0, _utilsJsDefault.default).isPlainObject(thing) || (0, _utilsJsDefault.default).isArray(thing);
}
/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */ function removeBrackets(key) {
    return (0, _utilsJsDefault.default).endsWith(key, '[]') ? key.slice(0, -2) : key;
}
/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */ function renderKey(path, key, dots) {
    if (!path) return key;
    return path.concat(key).map(function each(token, i) {
        // eslint-disable-next-line no-param-reassign
        token = removeBrackets(token);
        return !dots && i ? '[' + token + ']' : token;
    }).join(dots ? '.' : '');
}
/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */ function isFlatArray(arr) {
    return (0, _utilsJsDefault.default).isArray(arr) && !arr.some(isVisitable);
}
const predicates = (0, _utilsJsDefault.default).toFlatObject((0, _utilsJsDefault.default), {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
});
/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/ /**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */ function toFormData(obj, formData, options) {
    if (!(0, _utilsJsDefault.default).isObject(obj)) throw new TypeError('target must be an object');
    // eslint-disable-next-line no-param-reassign
    formData = formData || new ((0, _formDataJsDefault.default) || FormData)();
    // eslint-disable-next-line no-param-reassign
    options = (0, _utilsJsDefault.default).toFlatObject(options, {
        metaTokens: true,
        dots: false,
        indexes: false
    }, false, function defined(option, source) {
        // eslint-disable-next-line no-eq-null,eqeqeq
        return !(0, _utilsJsDefault.default).isUndefined(source[option]);
    });
    const metaTokens = options.metaTokens;
    // eslint-disable-next-line no-use-before-define
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
    const useBlob = _Blob && (0, _utilsJsDefault.default).isSpecCompliantForm(formData);
    if (!(0, _utilsJsDefault.default).isFunction(visitor)) throw new TypeError('visitor must be a function');
    function convertValue(value) {
        if (value === null) return '';
        if ((0, _utilsJsDefault.default).isDate(value)) return value.toISOString();
        if ((0, _utilsJsDefault.default).isBoolean(value)) return value.toString();
        if (!useBlob && (0, _utilsJsDefault.default).isBlob(value)) throw new (0, _axiosErrorJsDefault.default)('Blob is not supported. Use a Buffer instead.');
        if ((0, _utilsJsDefault.default).isArrayBuffer(value) || (0, _utilsJsDefault.default).isTypedArray(value)) return useBlob && typeof Blob === 'function' ? new Blob([
            value
        ]) : Buffer.from(value);
        return value;
    }
    /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */ function defaultVisitor(value, key, path) {
        let arr = value;
        if (value && !path && typeof value === 'object') {
            if ((0, _utilsJsDefault.default).endsWith(key, '{}')) {
                // eslint-disable-next-line no-param-reassign
                key = metaTokens ? key : key.slice(0, -2);
                // eslint-disable-next-line no-param-reassign
                value = JSON.stringify(value);
            } else if ((0, _utilsJsDefault.default).isArray(value) && isFlatArray(value) || ((0, _utilsJsDefault.default).isFileList(value) || (0, _utilsJsDefault.default).endsWith(key, '[]')) && (arr = (0, _utilsJsDefault.default).toArray(value))) {
                // eslint-disable-next-line no-param-reassign
                key = removeBrackets(key);
                arr.forEach(function each(el, index) {
                    !((0, _utilsJsDefault.default).isUndefined(el) || el === null) && formData.append(// eslint-disable-next-line no-nested-ternary
                    indexes === true ? renderKey([
                        key
                    ], index, dots) : indexes === null ? key : key + '[]', convertValue(el));
                });
                return false;
            }
        }
        if (isVisitable(value)) return true;
        formData.append(renderKey(path, key, dots), convertValue(value));
        return false;
    }
    const stack = [];
    const exposedHelpers = Object.assign(predicates, {
        defaultVisitor,
        convertValue,
        isVisitable
    });
    function build(value, path) {
        if ((0, _utilsJsDefault.default).isUndefined(value)) return;
        if (stack.indexOf(value) !== -1) throw Error('Circular reference detected in ' + path.join('.'));
        stack.push(value);
        (0, _utilsJsDefault.default).forEach(value, function each(el, key) {
            const result = !((0, _utilsJsDefault.default).isUndefined(el) || el === null) && visitor.call(formData, el, (0, _utilsJsDefault.default).isString(key) ? key.trim() : key, path, exposedHelpers);
            if (result === true) build(el, path ? path.concat(key) : [
                key
            ]);
        });
        stack.pop();
    }
    if (!(0, _utilsJsDefault.default).isObject(obj)) throw new TypeError('data must be an object');
    build(obj);
    return formData;
}
exports.default = toFormData;

},{"adfd9b103875c2dd":"bCaf4","../utils.js":"jI6DP","../core/AxiosError.js":"7z85x","../platform/node/classes/FormData.js":"dVGJ4","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"bCaf4":[function(require,module,exports,__globalThis) {
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */ /* eslint-disable no-proto */ 'use strict';
const base64 = require("9c62938f1dccc73c");
const ieee754 = require("aceacb6a4531a9d2");
const customInspectSymbol = typeof Symbol === 'function' && typeof Symbol['for'] === 'function' // eslint-disable-line dot-notation
 ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
 : null;
exports.Buffer = Buffer;
exports.SlowBuffer = SlowBuffer;
exports.INSPECT_MAX_BYTES = 50;
const K_MAX_LENGTH = 0x7fffffff;
exports.kMaxLength = K_MAX_LENGTH;
/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */ Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' && typeof console.error === 'function') console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
function typedArraySupport() {
    // Can typed array instances can be augmented?
    try {
        const arr = new Uint8Array(1);
        const proto = {
            foo: function() {
                return 42;
            }
        };
        Object.setPrototypeOf(proto, Uint8Array.prototype);
        Object.setPrototypeOf(arr, proto);
        return arr.foo() === 42;
    } catch (e) {
        return false;
    }
}
Object.defineProperty(Buffer.prototype, 'parent', {
    enumerable: true,
    get: function() {
        if (!Buffer.isBuffer(this)) return undefined;
        return this.buffer;
    }
});
Object.defineProperty(Buffer.prototype, 'offset', {
    enumerable: true,
    get: function() {
        if (!Buffer.isBuffer(this)) return undefined;
        return this.byteOffset;
    }
});
function createBuffer(length) {
    if (length > K_MAX_LENGTH) throw new RangeError('The value "' + length + '" is invalid for option "size"');
    // Return an augmented `Uint8Array` instance
    const buf = new Uint8Array(length);
    Object.setPrototypeOf(buf, Buffer.prototype);
    return buf;
}
/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */ function Buffer(arg, encodingOrOffset, length) {
    // Common case.
    if (typeof arg === 'number') {
        if (typeof encodingOrOffset === 'string') throw new TypeError('The "string" argument must be of type string. Received type number');
        return allocUnsafe(arg);
    }
    return from(arg, encodingOrOffset, length);
}
Buffer.poolSize = 8192 // not used by this implementation
;
function from(value, encodingOrOffset, length) {
    if (typeof value === 'string') return fromString(value, encodingOrOffset);
    if (ArrayBuffer.isView(value)) return fromArrayView(value);
    if (value == null) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
    if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) return fromArrayBuffer(value, encodingOrOffset, length);
    if (typeof SharedArrayBuffer !== 'undefined' && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) return fromArrayBuffer(value, encodingOrOffset, length);
    if (typeof value === 'number') throw new TypeError('The "value" argument must not be of type number. Received type number');
    const valueOf = value.valueOf && value.valueOf();
    if (valueOf != null && valueOf !== value) return Buffer.from(valueOf, encodingOrOffset, length);
    const b = fromObject(value);
    if (b) return b;
    if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === 'function') return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length);
    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
}
/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/ Buffer.from = function(value, encodingOrOffset, length) {
    return from(value, encodingOrOffset, length);
};
// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
Object.setPrototypeOf(Buffer, Uint8Array);
function assertSize(size) {
    if (typeof size !== 'number') throw new TypeError('"size" argument must be of type number');
    else if (size < 0) throw new RangeError('The value "' + size + '" is invalid for option "size"');
}
function alloc(size, fill, encoding) {
    assertSize(size);
    if (size <= 0) return createBuffer(size);
    if (fill !== undefined) // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string' ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
    return createBuffer(size);
}
/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/ Buffer.alloc = function(size, fill, encoding) {
    return alloc(size, fill, encoding);
};
function allocUnsafe(size) {
    assertSize(size);
    return createBuffer(size < 0 ? 0 : checked(size) | 0);
}
/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */ Buffer.allocUnsafe = function(size) {
    return allocUnsafe(size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */ Buffer.allocUnsafeSlow = function(size) {
    return allocUnsafe(size);
};
function fromString(string, encoding) {
    if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8';
    if (!Buffer.isEncoding(encoding)) throw new TypeError('Unknown encoding: ' + encoding);
    const length = byteLength(string, encoding) | 0;
    let buf = createBuffer(length);
    const actual = buf.write(string, encoding);
    if (actual !== length) // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual);
    return buf;
}
function fromArrayLike(array) {
    const length = array.length < 0 ? 0 : checked(array.length) | 0;
    const buf = createBuffer(length);
    for(let i = 0; i < length; i += 1)buf[i] = array[i] & 255;
    return buf;
}
function fromArrayView(arrayView) {
    if (isInstance(arrayView, Uint8Array)) {
        const copy = new Uint8Array(arrayView);
        return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
    }
    return fromArrayLike(arrayView);
}
function fromArrayBuffer(array, byteOffset, length) {
    if (byteOffset < 0 || array.byteLength < byteOffset) throw new RangeError('"offset" is outside of buffer bounds');
    if (array.byteLength < byteOffset + (length || 0)) throw new RangeError('"length" is outside of buffer bounds');
    let buf;
    if (byteOffset === undefined && length === undefined) buf = new Uint8Array(array);
    else if (length === undefined) buf = new Uint8Array(array, byteOffset);
    else buf = new Uint8Array(array, byteOffset, length);
    // Return an augmented `Uint8Array` instance
    Object.setPrototypeOf(buf, Buffer.prototype);
    return buf;
}
function fromObject(obj) {
    if (Buffer.isBuffer(obj)) {
        const len = checked(obj.length) | 0;
        const buf = createBuffer(len);
        if (buf.length === 0) return buf;
        obj.copy(buf, 0, 0, len);
        return buf;
    }
    if (obj.length !== undefined) {
        if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) return createBuffer(0);
        return fromArrayLike(obj);
    }
    if (obj.type === 'Buffer' && Array.isArray(obj.data)) return fromArrayLike(obj.data);
}
function checked(length) {
    // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
    // length is NaN (which is otherwise coerced to zero.)
    if (length >= K_MAX_LENGTH) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + ' bytes');
    return length | 0;
}
function SlowBuffer(length) {
    if (+length != length) length = 0;
    return Buffer.alloc(+length);
}
Buffer.isBuffer = function isBuffer(b) {
    return b != null && b._isBuffer === true && b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
    ;
};
Buffer.compare = function compare(a, b) {
    if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
    if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);
    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
    if (a === b) return 0;
    let x = a.length;
    let y = b.length;
    for(let i = 0, len = Math.min(x, y); i < len; ++i)if (a[i] !== b[i]) {
        x = a[i];
        y = b[i];
        break;
    }
    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
};
Buffer.isEncoding = function isEncoding(encoding) {
    switch(String(encoding).toLowerCase()){
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'latin1':
        case 'binary':
        case 'base64':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
            return true;
        default:
            return false;
    }
};
Buffer.concat = function concat(list, length) {
    if (!Array.isArray(list)) throw new TypeError('"list" argument must be an Array of Buffers');
    if (list.length === 0) return Buffer.alloc(0);
    let i;
    if (length === undefined) {
        length = 0;
        for(i = 0; i < list.length; ++i)length += list[i].length;
    }
    const buffer = Buffer.allocUnsafe(length);
    let pos = 0;
    for(i = 0; i < list.length; ++i){
        let buf = list[i];
        if (isInstance(buf, Uint8Array)) {
            if (pos + buf.length > buffer.length) {
                if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf);
                buf.copy(buffer, pos);
            } else Uint8Array.prototype.set.call(buffer, buf, pos);
        } else if (!Buffer.isBuffer(buf)) throw new TypeError('"list" argument must be an Array of Buffers');
        else buf.copy(buffer, pos);
        pos += buf.length;
    }
    return buffer;
};
function byteLength(string, encoding) {
    if (Buffer.isBuffer(string)) return string.length;
    if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) return string.byteLength;
    if (typeof string !== 'string') throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string);
    const len = string.length;
    const mustMatch = arguments.length > 2 && arguments[2] === true;
    if (!mustMatch && len === 0) return 0;
    // Use a for loop to avoid recursion
    let loweredCase = false;
    for(;;)switch(encoding){
        case 'ascii':
        case 'latin1':
        case 'binary':
            return len;
        case 'utf8':
        case 'utf-8':
            return utf8ToBytes(string).length;
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
            return len * 2;
        case 'hex':
            return len >>> 1;
        case 'base64':
            return base64ToBytes(string).length;
        default:
            if (loweredCase) return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
            ;
            encoding = ('' + encoding).toLowerCase();
            loweredCase = true;
    }
}
Buffer.byteLength = byteLength;
function slowToString(encoding, start, end) {
    let loweredCase = false;
    // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
    // property of a typed array.
    // This behaves neither like String nor Uint8Array in that we set start/end
    // to their upper/lower bounds if the value passed is out of range.
    // undefined is handled specially as per ECMA-262 6th Edition,
    // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
    if (start === undefined || start < 0) start = 0;
    // Return early if start > this.length. Done here to prevent potential uint32
    // coercion fail below.
    if (start > this.length) return '';
    if (end === undefined || end > this.length) end = this.length;
    if (end <= 0) return '';
    // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
    end >>>= 0;
    start >>>= 0;
    if (end <= start) return '';
    if (!encoding) encoding = 'utf8';
    while(true)switch(encoding){
        case 'hex':
            return hexSlice(this, start, end);
        case 'utf8':
        case 'utf-8':
            return utf8Slice(this, start, end);
        case 'ascii':
            return asciiSlice(this, start, end);
        case 'latin1':
        case 'binary':
            return latin1Slice(this, start, end);
        case 'base64':
            return base64Slice(this, start, end);
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
            return utf16leSlice(this, start, end);
        default:
            if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
            encoding = (encoding + '').toLowerCase();
            loweredCase = true;
    }
}
// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true;
function swap(b, n, m) {
    const i = b[n];
    b[n] = b[m];
    b[m] = i;
}
Buffer.prototype.swap16 = function swap16() {
    const len = this.length;
    if (len % 2 !== 0) throw new RangeError('Buffer size must be a multiple of 16-bits');
    for(let i = 0; i < len; i += 2)swap(this, i, i + 1);
    return this;
};
Buffer.prototype.swap32 = function swap32() {
    const len = this.length;
    if (len % 4 !== 0) throw new RangeError('Buffer size must be a multiple of 32-bits');
    for(let i = 0; i < len; i += 4){
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
    }
    return this;
};
Buffer.prototype.swap64 = function swap64() {
    const len = this.length;
    if (len % 8 !== 0) throw new RangeError('Buffer size must be a multiple of 64-bits');
    for(let i = 0; i < len; i += 8){
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
    }
    return this;
};
Buffer.prototype.toString = function toString() {
    const length = this.length;
    if (length === 0) return '';
    if (arguments.length === 0) return utf8Slice(this, 0, length);
    return slowToString.apply(this, arguments);
};
Buffer.prototype.toLocaleString = Buffer.prototype.toString;
Buffer.prototype.equals = function equals(b) {
    if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
    if (this === b) return true;
    return Buffer.compare(this, b) === 0;
};
Buffer.prototype.inspect = function inspect() {
    let str = '';
    const max = exports.INSPECT_MAX_BYTES;
    str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim();
    if (this.length > max) str += ' ... ';
    return '<Buffer ' + str + '>';
};
if (customInspectSymbol) Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
    if (isInstance(target, Uint8Array)) target = Buffer.from(target, target.offset, target.byteLength);
    if (!Buffer.isBuffer(target)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target);
    if (start === undefined) start = 0;
    if (end === undefined) end = target ? target.length : 0;
    if (thisStart === undefined) thisStart = 0;
    if (thisEnd === undefined) thisEnd = this.length;
    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) throw new RangeError('out of range index');
    if (thisStart >= thisEnd && start >= end) return 0;
    if (thisStart >= thisEnd) return -1;
    if (start >= end) return 1;
    start >>>= 0;
    end >>>= 0;
    thisStart >>>= 0;
    thisEnd >>>= 0;
    if (this === target) return 0;
    let x = thisEnd - thisStart;
    let y = end - start;
    const len = Math.min(x, y);
    const thisCopy = this.slice(thisStart, thisEnd);
    const targetCopy = target.slice(start, end);
    for(let i = 0; i < len; ++i)if (thisCopy[i] !== targetCopy[i]) {
        x = thisCopy[i];
        y = targetCopy[i];
        break;
    }
    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
};
// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
    // Empty buffer means no match
    if (buffer.length === 0) return -1;
    // Normalize byteOffset
    if (typeof byteOffset === 'string') {
        encoding = byteOffset;
        byteOffset = 0;
    } else if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff;
    else if (byteOffset < -2147483648) byteOffset = -2147483648;
    byteOffset = +byteOffset // Coerce to Number.
    ;
    if (numberIsNaN(byteOffset)) // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : buffer.length - 1;
    // Normalize byteOffset: negative offsets start from the end of the buffer
    if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
    if (byteOffset >= buffer.length) {
        if (dir) return -1;
        else byteOffset = buffer.length - 1;
    } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;
        else return -1;
    }
    // Normalize val
    if (typeof val === 'string') val = Buffer.from(val, encoding);
    // Finally, search either indexOf (if dir is true) or lastIndexOf
    if (Buffer.isBuffer(val)) {
        // Special case: looking for empty string/buffer always fails
        if (val.length === 0) return -1;
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
    } else if (typeof val === 'number') {
        val = val & 0xFF // Search for a byte value [0-255]
        ;
        if (typeof Uint8Array.prototype.indexOf === 'function') {
            if (dir) return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            else return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
        }
        return arrayIndexOf(buffer, [
            val
        ], byteOffset, encoding, dir);
    }
    throw new TypeError('val must be string, number or Buffer');
}
function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
    let indexSize = 1;
    let arrLength = arr.length;
    let valLength = val.length;
    if (encoding !== undefined) {
        encoding = String(encoding).toLowerCase();
        if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
            if (arr.length < 2 || val.length < 2) return -1;
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
        }
    }
    function read(buf, i) {
        if (indexSize === 1) return buf[i];
        else return buf.readUInt16BE(i * indexSize);
    }
    let i;
    if (dir) {
        let foundIndex = -1;
        for(i = byteOffset; i < arrLength; i++)if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1) foundIndex = i;
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
        } else {
            if (foundIndex !== -1) i -= i - foundIndex;
            foundIndex = -1;
        }
    } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
        for(i = byteOffset; i >= 0; i--){
            let found = true;
            for(let j = 0; j < valLength; j++)if (read(arr, i + j) !== read(val, j)) {
                found = false;
                break;
            }
            if (found) return i;
        }
    }
    return -1;
}
Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1;
};
Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};
Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};
function hexWrite(buf, string, offset, length) {
    offset = Number(offset) || 0;
    const remaining = buf.length - offset;
    if (!length) length = remaining;
    else {
        length = Number(length);
        if (length > remaining) length = remaining;
    }
    const strLen = string.length;
    if (length > strLen / 2) length = strLen / 2;
    let i;
    for(i = 0; i < length; ++i){
        const parsed = parseInt(string.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed)) return i;
        buf[offset + i] = parsed;
    }
    return i;
}
function utf8Write(buf, string, offset, length) {
    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}
function asciiWrite(buf, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf, offset, length);
}
function base64Write(buf, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf, offset, length);
}
function ucs2Write(buf, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}
Buffer.prototype.write = function write(string, offset, length, encoding) {
    // Buffer#write(string)
    if (offset === undefined) {
        encoding = 'utf8';
        length = this.length;
        offset = 0;
    // Buffer#write(string, encoding)
    } else if (length === undefined && typeof offset === 'string') {
        encoding = offset;
        length = this.length;
        offset = 0;
    // Buffer#write(string, offset[, length][, encoding])
    } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === undefined) encoding = 'utf8';
        } else {
            encoding = length;
            length = undefined;
        }
    } else throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
    const remaining = this.length - offset;
    if (length === undefined || length > remaining) length = remaining;
    if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) throw new RangeError('Attempt to write outside buffer bounds');
    if (!encoding) encoding = 'utf8';
    let loweredCase = false;
    for(;;)switch(encoding){
        case 'hex':
            return hexWrite(this, string, offset, length);
        case 'utf8':
        case 'utf-8':
            return utf8Write(this, string, offset, length);
        case 'ascii':
        case 'latin1':
        case 'binary':
            return asciiWrite(this, string, offset, length);
        case 'base64':
            // Warning: maxLength not taken into account in base64Write
            return base64Write(this, string, offset, length);
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
            return ucs2Write(this, string, offset, length);
        default:
            if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
            encoding = ('' + encoding).toLowerCase();
            loweredCase = true;
    }
};
Buffer.prototype.toJSON = function toJSON() {
    return {
        type: 'Buffer',
        data: Array.prototype.slice.call(this._arr || this, 0)
    };
};
function base64Slice(buf, start, end) {
    if (start === 0 && end === buf.length) return base64.fromByteArray(buf);
    else return base64.fromByteArray(buf.slice(start, end));
}
function utf8Slice(buf, start, end) {
    end = Math.min(buf.length, end);
    const res = [];
    let i = start;
    while(i < end){
        const firstByte = buf[i];
        let codePoint = null;
        let bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;
        if (i + bytesPerSequence <= end) {
            let secondByte, thirdByte, fourthByte, tempCodePoint;
            switch(bytesPerSequence){
                case 1:
                    if (firstByte < 0x80) codePoint = firstByte;
                    break;
                case 2:
                    secondByte = buf[i + 1];
                    if ((secondByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
                        if (tempCodePoint > 0x7F) codePoint = tempCodePoint;
                    }
                    break;
                case 3:
                    secondByte = buf[i + 1];
                    thirdByte = buf[i + 2];
                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
                        if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) codePoint = tempCodePoint;
                    }
                    break;
                case 4:
                    secondByte = buf[i + 1];
                    thirdByte = buf[i + 2];
                    fourthByte = buf[i + 3];
                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
                        if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) codePoint = tempCodePoint;
                    }
            }
        }
        if (codePoint === null) {
            // we did not generate a valid codePoint so insert a
            // replacement char (U+FFFD) and advance only 1 byte
            codePoint = 0xFFFD;
            bytesPerSequence = 1;
        } else if (codePoint > 0xFFFF) {
            // encode to utf16 (surrogate pair dance)
            codePoint -= 0x10000;
            res.push(codePoint >>> 10 & 0x3FF | 0xD800);
            codePoint = 0xDC00 | codePoint & 0x3FF;
        }
        res.push(codePoint);
        i += bytesPerSequence;
    }
    return decodeCodePointsArray(res);
}
// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
const MAX_ARGUMENTS_LENGTH = 0x1000;
function decodeCodePointsArray(codePoints) {
    const len = codePoints.length;
    if (len <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
    ;
    // Decode in chunks to avoid "call stack size exceeded".
    let res = '';
    let i = 0;
    while(i < len)res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
    return res;
}
function asciiSlice(buf, start, end) {
    let ret = '';
    end = Math.min(buf.length, end);
    for(let i = start; i < end; ++i)ret += String.fromCharCode(buf[i] & 0x7F);
    return ret;
}
function latin1Slice(buf, start, end) {
    let ret = '';
    end = Math.min(buf.length, end);
    for(let i = start; i < end; ++i)ret += String.fromCharCode(buf[i]);
    return ret;
}
function hexSlice(buf, start, end) {
    const len = buf.length;
    if (!start || start < 0) start = 0;
    if (!end || end < 0 || end > len) end = len;
    let out = '';
    for(let i = start; i < end; ++i)out += hexSliceLookupTable[buf[i]];
    return out;
}
function utf16leSlice(buf, start, end) {
    const bytes = buf.slice(start, end);
    let res = '';
    // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
    for(let i = 0; i < bytes.length - 1; i += 2)res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
    return res;
}
Buffer.prototype.slice = function slice(start, end) {
    const len = this.length;
    start = ~~start;
    end = end === undefined ? len : ~~end;
    if (start < 0) {
        start += len;
        if (start < 0) start = 0;
    } else if (start > len) start = len;
    if (end < 0) {
        end += len;
        if (end < 0) end = 0;
    } else if (end > len) end = len;
    if (end < start) end = start;
    const newBuf = this.subarray(start, end);
    // Return an augmented `Uint8Array` instance
    Object.setPrototypeOf(newBuf, Buffer.prototype);
    return newBuf;
};
/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */ function checkOffset(offset, ext, length) {
    if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
    if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
}
Buffer.prototype.readUintLE = Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    let val = this[offset];
    let mul = 1;
    let i = 0;
    while(++i < byteLength && (mul *= 0x100))val += this[offset + i] * mul;
    return val;
};
Buffer.prototype.readUintBE = Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    let val = this[offset + --byteLength];
    let mul = 1;
    while(byteLength > 0 && (mul *= 0x100))val += this[offset + --byteLength] * mul;
    return val;
};
Buffer.prototype.readUint8 = Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 1, this.length);
    return this[offset];
};
Buffer.prototype.readUint16LE = Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] | this[offset + 1] << 8;
};
Buffer.prototype.readUint16BE = Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] << 8 | this[offset + 1];
};
Buffer.prototype.readUint32LE = Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
};
Buffer.prototype.readUint32BE = Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};
Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, 'offset');
    const first = this[offset];
    const last = this[offset + 7];
    if (first === undefined || last === undefined) boundsError(offset, this.length - 8);
    const lo = first + this[++offset] * 256 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
    const hi = this[++offset] + this[++offset] * 256 + this[++offset] * 2 ** 16 + last * 2 ** 24;
    return BigInt(lo) + (BigInt(hi) << BigInt(32));
});
Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, 'offset');
    const first = this[offset];
    const last = this[offset + 7];
    if (first === undefined || last === undefined) boundsError(offset, this.length - 8);
    const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 256 + this[++offset];
    const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 256 + last;
    return (BigInt(hi) << BigInt(32)) + BigInt(lo);
});
Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    let val = this[offset];
    let mul = 1;
    let i = 0;
    while(++i < byteLength && (mul *= 0x100))val += this[offset + i] * mul;
    mul *= 0x80;
    if (val >= mul) val -= Math.pow(2, 8 * byteLength);
    return val;
};
Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    let i = byteLength;
    let mul = 1;
    let val = this[offset + --i];
    while(i > 0 && (mul *= 0x100))val += this[offset + --i] * mul;
    mul *= 0x80;
    if (val >= mul) val -= Math.pow(2, 8 * byteLength);
    return val;
};
Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 1, this.length);
    if (!(this[offset] & 0x80)) return this[offset];
    return (0xff - this[offset] + 1) * -1;
};
Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    const val = this[offset] | this[offset + 1] << 8;
    return val & 0x8000 ? val | 0xFFFF0000 : val;
};
Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    const val = this[offset + 1] | this[offset] << 8;
    return val & 0x8000 ? val | 0xFFFF0000 : val;
};
Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};
Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};
Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, 'offset');
    const first = this[offset];
    const last = this[offset + 7];
    if (first === undefined || last === undefined) boundsError(offset, this.length - 8);
    const val = this[offset + 4] + this[offset + 5] * 256 + this[offset + 6] * 2 ** 16 + (last << 24 // Overflow
    );
    return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 256 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
});
Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, 'offset');
    const first = this[offset];
    const last = this[offset + 7];
    if (first === undefined || last === undefined) boundsError(offset, this.length - 8);
    const val = (first << 24) + // Overflow
    this[++offset] * 2 ** 16 + this[++offset] * 256 + this[++offset];
    return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 256 + last);
});
Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, true, 23, 4);
};
Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, false, 23, 4);
};
Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, true, 52, 8);
};
Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, false, 52, 8);
};
function checkInt(buf, value, offset, ext, max, min) {
    if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
    if (offset + ext > buf.length) throw new RangeError('Index out of range');
}
Buffer.prototype.writeUintLE = Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength) - 1;
        checkInt(this, value, offset, byteLength, maxBytes, 0);
    }
    let mul = 1;
    let i = 0;
    this[offset] = value & 0xFF;
    while(++i < byteLength && (mul *= 0x100))this[offset + i] = value / mul & 0xFF;
    return offset + byteLength;
};
Buffer.prototype.writeUintBE = Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength) - 1;
        checkInt(this, value, offset, byteLength, maxBytes, 0);
    }
    let i = byteLength - 1;
    let mul = 1;
    this[offset + i] = value & 0xFF;
    while(--i >= 0 && (mul *= 0x100))this[offset + i] = value / mul & 0xFF;
    return offset + byteLength;
};
Buffer.prototype.writeUint8 = Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
    this[offset] = value & 0xff;
    return offset + 1;
};
Buffer.prototype.writeUint16LE = Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    return offset + 2;
};
Buffer.prototype.writeUint16BE = Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
    return offset + 2;
};
Buffer.prototype.writeUint32LE = Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 0xff;
    return offset + 4;
};
Buffer.prototype.writeUint32BE = Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
    return offset + 4;
};
function wrtBigUInt64LE(buf, value, offset, min, max) {
    checkIntBI(value, min, max, buf, offset, 7);
    let lo = Number(value & BigInt(0xffffffff));
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    let hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
    buf[offset++] = hi;
    hi = hi >> 8;
    buf[offset++] = hi;
    hi = hi >> 8;
    buf[offset++] = hi;
    hi = hi >> 8;
    buf[offset++] = hi;
    return offset;
}
function wrtBigUInt64BE(buf, value, offset, min, max) {
    checkIntBI(value, min, max, buf, offset, 7);
    let lo = Number(value & BigInt(0xffffffff));
    buf[offset + 7] = lo;
    lo = lo >> 8;
    buf[offset + 6] = lo;
    lo = lo >> 8;
    buf[offset + 5] = lo;
    lo = lo >> 8;
    buf[offset + 4] = lo;
    let hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
    buf[offset + 3] = hi;
    hi = hi >> 8;
    buf[offset + 2] = hi;
    hi = hi >> 8;
    buf[offset + 1] = hi;
    hi = hi >> 8;
    buf[offset] = hi;
    return offset + 8;
}
Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
    return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'));
});
Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
    return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'));
});
Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength - 1);
        checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }
    let i = 0;
    let mul = 1;
    let sub = 0;
    this[offset] = value & 0xFF;
    while(++i < byteLength && (mul *= 0x100)){
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) sub = 1;
        this[offset + i] = (value / mul >> 0) - sub & 0xFF;
    }
    return offset + byteLength;
};
Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength - 1);
        checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }
    let i = byteLength - 1;
    let mul = 1;
    let sub = 0;
    this[offset + i] = value & 0xFF;
    while(--i >= 0 && (mul *= 0x100)){
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) sub = 1;
        this[offset + i] = (value / mul >> 0) - sub & 0xFF;
    }
    return offset + byteLength;
};
Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -128);
    if (value < 0) value = 0xff + value + 1;
    this[offset] = value & 0xff;
    return offset + 1;
};
Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -32768);
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    return offset + 2;
};
Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -32768);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
    return offset + 2;
};
Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -2147483648);
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
    return offset + 4;
};
Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -2147483648);
    if (value < 0) value = 0xffffffff + value + 1;
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
    return offset + 4;
};
Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
    return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'));
});
Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
    return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'));
});
function checkIEEE754(buf, value, offset, ext, max, min) {
    if (offset + ext > buf.length) throw new RangeError('Index out of range');
    if (offset < 0) throw new RangeError('Index out of range');
}
function writeFloat(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -340282346638528860000000000000000000000);
    ieee754.write(buf, value, offset, littleEndian, 23, 4);
    return offset + 4;
}
Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert);
};
Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert);
};
function writeDouble(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000);
    ieee754.write(buf, value, offset, littleEndian, 52, 8);
    return offset + 8;
}
Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert);
};
Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert);
};
// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy(target, targetStart, start, end) {
    if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer');
    if (!start) start = 0;
    if (!end && end !== 0) end = this.length;
    if (targetStart >= target.length) targetStart = target.length;
    if (!targetStart) targetStart = 0;
    if (end > 0 && end < start) end = start;
    // Copy 0 bytes; we're done
    if (end === start) return 0;
    if (target.length === 0 || this.length === 0) return 0;
    // Fatal error conditions
    if (targetStart < 0) throw new RangeError('targetStart out of bounds');
    if (start < 0 || start >= this.length) throw new RangeError('Index out of range');
    if (end < 0) throw new RangeError('sourceEnd out of bounds');
    // Are we oob?
    if (end > this.length) end = this.length;
    if (target.length - targetStart < end - start) end = target.length - targetStart + start;
    const len = end - start;
    if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end);
    else Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
    return len;
};
// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill(val, start, end, encoding) {
    // Handle string cases:
    if (typeof val === 'string') {
        if (typeof start === 'string') {
            encoding = start;
            start = 0;
            end = this.length;
        } else if (typeof end === 'string') {
            encoding = end;
            end = this.length;
        }
        if (encoding !== undefined && typeof encoding !== 'string') throw new TypeError('encoding must be a string');
        if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) throw new TypeError('Unknown encoding: ' + encoding);
        if (val.length === 1) {
            const code = val.charCodeAt(0);
            if (encoding === 'utf8' && code < 128 || encoding === 'latin1') // Fast path: If `val` fits into a single byte, use that numeric value.
            val = code;
        }
    } else if (typeof val === 'number') val = val & 255;
    else if (typeof val === 'boolean') val = Number(val);
    // Invalid ranges are not set to a default, so can range check early.
    if (start < 0 || this.length < start || this.length < end) throw new RangeError('Out of range index');
    if (end <= start) return this;
    start = start >>> 0;
    end = end === undefined ? this.length : end >>> 0;
    if (!val) val = 0;
    let i;
    if (typeof val === 'number') for(i = start; i < end; ++i)this[i] = val;
    else {
        const bytes = Buffer.isBuffer(val) ? val : Buffer.from(val, encoding);
        const len = bytes.length;
        if (len === 0) throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        for(i = 0; i < end - start; ++i)this[i + start] = bytes[i % len];
    }
    return this;
};
// CUSTOM ERRORS
// =============
// Simplified versions from Node, changed for Buffer-only usage
const errors = {};
function E(sym, getMessage, Base) {
    errors[sym] = class NodeError extends Base {
        constructor(){
            super();
            Object.defineProperty(this, 'message', {
                value: getMessage.apply(this, arguments),
                writable: true,
                configurable: true
            });
            // Add the error code to the name to include it in the stack trace.
            this.name = `${this.name} [${sym}]`;
            // Access the stack to generate the error message including the error code
            // from the name.
            this.stack // eslint-disable-line no-unused-expressions
            ;
            // Reset the name to the actual name.
            delete this.name;
        }
        get code() {
            return sym;
        }
        set code(value) {
            Object.defineProperty(this, 'code', {
                configurable: true,
                enumerable: true,
                value,
                writable: true
            });
        }
        toString() {
            return `${this.name} [${sym}]: ${this.message}`;
        }
    };
}
E('ERR_BUFFER_OUT_OF_BOUNDS', function(name) {
    if (name) return `${name} is outside of buffer bounds`;
    return 'Attempt to access memory outside buffer bounds';
}, RangeError);
E('ERR_INVALID_ARG_TYPE', function(name, actual) {
    return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
}, TypeError);
E('ERR_OUT_OF_RANGE', function(str, range, input) {
    let msg = `The value of "${str}" is out of range.`;
    let received = input;
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) received = addNumericalSeparator(String(input));
    else if (typeof input === 'bigint') {
        received = String(input);
        if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) received = addNumericalSeparator(received);
        received += 'n';
    }
    msg += ` It must be ${range}. Received ${received}`;
    return msg;
}, RangeError);
function addNumericalSeparator(val) {
    let res = '';
    let i = val.length;
    const start = val[0] === '-' ? 1 : 0;
    for(; i >= start + 4; i -= 3)res = `_${val.slice(i - 3, i)}${res}`;
    return `${val.slice(0, i)}${res}`;
}
// CHECK FUNCTIONS
// ===============
function checkBounds(buf, offset, byteLength) {
    validateNumber(offset, 'offset');
    if (buf[offset] === undefined || buf[offset + byteLength] === undefined) boundsError(offset, buf.length - (byteLength + 1));
}
function checkIntBI(value, min, max, buf, offset, byteLength) {
    if (value > max || value < min) {
        const n = typeof min === 'bigint' ? 'n' : '';
        let range;
        if (byteLength > 3) {
            if (min === 0 || min === BigInt(0)) range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`;
            else range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` + `${(byteLength + 1) * 8 - 1}${n}`;
        } else range = `>= ${min}${n} and <= ${max}${n}`;
        throw new errors.ERR_OUT_OF_RANGE('value', range, value);
    }
    checkBounds(buf, offset, byteLength);
}
function validateNumber(value, name) {
    if (typeof value !== 'number') throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value);
}
function boundsError(value, length, type) {
    if (Math.floor(value) !== value) {
        validateNumber(value, type);
        throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value);
    }
    if (length < 0) throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
    throw new errors.ERR_OUT_OF_RANGE(type || 'offset', `>= ${type ? 1 : 0} and <= ${length}`, value);
}
// HELPER FUNCTIONS
// ================
const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
function base64clean(str) {
    // Node takes equal signs as end of the Base64 encoding
    str = str.split('=')[0];
    // Node strips out invalid characters like \n and \t from the string, base64-js does not
    str = str.trim().replace(INVALID_BASE64_RE, '');
    // Node converts strings with length < 2 to ''
    if (str.length < 2) return '';
    // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
    while(str.length % 4 !== 0)str = str + '=';
    return str;
}
function utf8ToBytes(string, units) {
    units = units || Infinity;
    let codePoint;
    const length = string.length;
    let leadSurrogate = null;
    const bytes = [];
    for(let i = 0; i < length; ++i){
        codePoint = string.charCodeAt(i);
        // is surrogate component
        if (codePoint > 0xD7FF && codePoint < 0xE000) {
            // last char was a lead
            if (!leadSurrogate) {
                // no lead yet
                if (codePoint > 0xDBFF) {
                    // unexpected trail
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                    continue;
                } else if (i + 1 === length) {
                    // unpaired lead
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                    continue;
                }
                // valid lead
                leadSurrogate = codePoint;
                continue;
            }
            // 2 leads in a row
            if (codePoint < 0xDC00) {
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                leadSurrogate = codePoint;
                continue;
            }
            // valid surrogate pair
            codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
        } else if (leadSurrogate) // valid bmp char, but last char was a lead
        {
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        }
        leadSurrogate = null;
        // encode utf8
        if (codePoint < 0x80) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
        } else if (codePoint < 0x800) {
            if ((units -= 2) < 0) break;
            bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
        } else if (codePoint < 0x10000) {
            if ((units -= 3) < 0) break;
            bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
        } else if (codePoint < 0x110000) {
            if ((units -= 4) < 0) break;
            bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
        } else throw new Error('Invalid code point');
    }
    return bytes;
}
function asciiToBytes(str) {
    const byteArray = [];
    for(let i = 0; i < str.length; ++i)// Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
    return byteArray;
}
function utf16leToBytes(str, units) {
    let c, hi, lo;
    const byteArray = [];
    for(let i = 0; i < str.length; ++i){
        if ((units -= 2) < 0) break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
    }
    return byteArray;
}
function base64ToBytes(str) {
    return base64.toByteArray(base64clean(str));
}
function blitBuffer(src, dst, offset, length) {
    let i;
    for(i = 0; i < length; ++i){
        if (i + offset >= dst.length || i >= src.length) break;
        dst[i + offset] = src[i];
    }
    return i;
}
// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance(obj, type) {
    return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
}
function numberIsNaN(obj) {
    // For IE11 support
    return obj !== obj // eslint-disable-line no-self-compare
    ;
}
// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
const hexSliceLookupTable = function() {
    const alphabet = '0123456789abcdef';
    const table = new Array(256);
    for(let i = 0; i < 16; ++i){
        const i16 = i * 16;
        for(let j = 0; j < 16; ++j)table[i16 + j] = alphabet[i] + alphabet[j];
    }
    return table;
}();
// Return not function with Error if BigInt not supported
function defineBigIntMethod(fn) {
    return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn;
}
function BufferBigIntNotDefined() {
    throw new Error('BigInt not supported');
}

},{"9c62938f1dccc73c":"9I2RJ","aceacb6a4531a9d2":"geXY6"}],"9I2RJ":[function(require,module,exports,__globalThis) {
'use strict';
exports.byteLength = byteLength;
exports.toByteArray = toByteArray;
exports.fromByteArray = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for(var i = 0, len = code.length; i < len; ++i){
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
}
// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;
function getLens(b64) {
    var len = b64.length;
    if (len % 4 > 0) throw new Error('Invalid string. Length must be a multiple of 4');
    // Trim off extra bytes after placeholder bytes are found
    // See: https://github.com/beatgammit/base64-js/issues/42
    var validLen = b64.indexOf('=');
    if (validLen === -1) validLen = len;
    var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
    return [
        validLen,
        placeHoldersLen
    ];
}
// base64 is 4/3 + up to two characters of the original data
function byteLength(b64) {
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function _byteLength(b64, validLen, placeHoldersLen) {
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function toByteArray(b64) {
    var tmp;
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
    var curByte = 0;
    // if there are placeholders, only get up to the last complete 4 chars
    var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
    var i;
    for(i = 0; i < len; i += 4){
        tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
        arr[curByte++] = tmp >> 16 & 0xFF;
        arr[curByte++] = tmp >> 8 & 0xFF;
        arr[curByte++] = tmp & 0xFF;
    }
    if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
        arr[curByte++] = tmp & 0xFF;
    }
    if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 0xFF;
        arr[curByte++] = tmp & 0xFF;
    }
    return arr;
}
function tripletToBase64(num) {
    return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}
function encodeChunk(uint8, start, end) {
    var tmp;
    var output = [];
    for(var i = start; i < end; i += 3){
        tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
        output.push(tripletToBase64(tmp));
    }
    return output.join('');
}
function fromByteArray(uint8) {
    var tmp;
    var len = uint8.length;
    var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
    ;
    var parts = [];
    var maxChunkLength = 16383 // must be multiple of 3
    ;
    // go through the array every three bytes, we'll deal with trailing stuff later
    for(var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength)parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
    // pad the end with zeros, but make sure to not forget the extra bytes
    if (extraBytes === 1) {
        tmp = uint8[len - 1];
        parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==');
    } else if (extraBytes === 2) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
        parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=');
    }
    return parts.join('');
}

},{}],"geXY6":[function(require,module,exports,__globalThis) {
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */ exports.read = function(buffer, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = isLE ? nBytes - 1 : 0;
    var d = isLE ? -1 : 1;
    var s = buffer[offset + i];
    i += d;
    e = s & (1 << -nBits) - 1;
    s >>= -nBits;
    nBits += eLen;
    for(; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);
    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;
    for(; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);
    if (e === 0) e = 1 - eBias;
    else if (e === eMax) return m ? NaN : (s ? -1 : 1) * Infinity;
    else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};
exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    var i = isLE ? 0 : nBytes - 1;
    var d = isLE ? 1 : -1;
    var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
    value = Math.abs(value);
    if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
    } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
        }
        if (e + eBias >= 1) value += rt / c;
        else value += rt * Math.pow(2, 1 - eBias);
        if (value * c >= 2) {
            e++;
            c /= 2;
        }
        if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
        } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
        } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
        }
    }
    for(; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);
    e = e << mLen | m;
    eLen += mLen;
    for(; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);
    buffer[offset + i - d] |= s * 128;
};

},{}],"7z85x":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
'use strict';
/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */ function AxiosError(message, code, config, request, response) {
    Error.call(this);
    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    else this.stack = new Error().stack;
    this.message = message;
    this.name = 'AxiosError';
    code && (this.code = code);
    config && (this.config = config);
    request && (this.request = request);
    if (response) {
        this.response = response;
        this.status = response.status ? response.status : null;
    }
}
(0, _utilsJsDefault.default).inherits(AxiosError, Error, {
    toJSON: function toJSON() {
        return {
            // Standard
            message: this.message,
            name: this.name,
            // Microsoft
            description: this.description,
            number: this.number,
            // Mozilla
            fileName: this.fileName,
            lineNumber: this.lineNumber,
            columnNumber: this.columnNumber,
            stack: this.stack,
            // Axios
            config: (0, _utilsJsDefault.default).toJSONObject(this.config),
            code: this.code,
            status: this.status
        };
    }
});
const prototype = AxiosError.prototype;
const descriptors = {};
[
    'ERR_BAD_OPTION_VALUE',
    'ERR_BAD_OPTION',
    'ECONNABORTED',
    'ETIMEDOUT',
    'ERR_NETWORK',
    'ERR_FR_TOO_MANY_REDIRECTS',
    'ERR_DEPRECATED',
    'ERR_BAD_RESPONSE',
    'ERR_BAD_REQUEST',
    'ERR_CANCELED',
    'ERR_NOT_SUPPORT',
    'ERR_INVALID_URL'
].forEach((code)=>{
    descriptors[code] = {
        value: code
    };
});
Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, 'isAxiosError', {
    value: true
});
// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps)=>{
    const axiosError = Object.create(prototype);
    (0, _utilsJsDefault.default).toFlatObject(error, axiosError, function filter(obj) {
        return obj !== Error.prototype;
    }, (prop)=>{
        return prop !== 'isAxiosError';
    });
    const msg = error && error.message ? error.message : 'Error';
    // Prefer explicit code; otherwise copy the low-level error's code (e.g. ECONNREFUSED)
    const errCode = code == null && error ? error.code : code;
    AxiosError.call(axiosError, msg, errCode, config, request, response);
    // Chain the original error on the standard field; non-enumerable to avoid JSON noise
    if (error && axiosError.cause == null) Object.defineProperty(axiosError, 'cause', {
        value: error,
        configurable: true
    });
    axiosError.name = error && error.name || 'Error';
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
};
exports.default = AxiosError;

},{"../utils.js":"jI6DP","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"dVGJ4":[function(require,module,exports,__globalThis) {
// eslint-disable-next-line strict
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
exports.default = null;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"bt5wS":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("./../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
'use strict';
class InterceptorManager {
    constructor(){
        this.handlers = [];
    }
    /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */ use(fulfilled, rejected, options) {
        this.handlers.push({
            fulfilled,
            rejected,
            synchronous: options ? options.synchronous : false,
            runWhen: options ? options.runWhen : null
        });
        return this.handlers.length - 1;
    }
    /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {void}
   */ eject(id) {
        if (this.handlers[id]) this.handlers[id] = null;
    }
    /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */ clear() {
        if (this.handlers) this.handlers = [];
    }
    /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */ forEach(fn) {
        (0, _utilsJsDefault.default).forEach(this.handlers, function forEachHandler(h) {
            if (h !== null) fn(h);
        });
    }
}
exports.default = InterceptorManager;

},{"./../utils.js":"jI6DP","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"1p0aT":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>dispatchRequest);
var _transformDataJs = require("./transformData.js");
var _transformDataJsDefault = parcelHelpers.interopDefault(_transformDataJs);
var _isCancelJs = require("../cancel/isCancel.js");
var _isCancelJsDefault = parcelHelpers.interopDefault(_isCancelJs);
var _indexJs = require("../defaults/index.js");
var _indexJsDefault = parcelHelpers.interopDefault(_indexJs);
var _canceledErrorJs = require("../cancel/CanceledError.js");
var _canceledErrorJsDefault = parcelHelpers.interopDefault(_canceledErrorJs);
var _axiosHeadersJs = require("../core/AxiosHeaders.js");
var _axiosHeadersJsDefault = parcelHelpers.interopDefault(_axiosHeadersJs);
var _adaptersJs = require("../adapters/adapters.js");
var _adaptersJsDefault = parcelHelpers.interopDefault(_adaptersJs);
'use strict';
/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */ function throwIfCancellationRequested(config) {
    if (config.cancelToken) config.cancelToken.throwIfRequested();
    if (config.signal && config.signal.aborted) throw new (0, _canceledErrorJsDefault.default)(null, config);
}
function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    config.headers = (0, _axiosHeadersJsDefault.default).from(config.headers);
    // Transform request data
    config.data = (0, _transformDataJsDefault.default).call(config, config.transformRequest);
    if ([
        'post',
        'put',
        'patch'
    ].indexOf(config.method) !== -1) config.headers.setContentType('application/x-www-form-urlencoded', false);
    const adapter = (0, _adaptersJsDefault.default).getAdapter(config.adapter || (0, _indexJsDefault.default).adapter, config);
    return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);
        // Transform response data
        response.data = (0, _transformDataJsDefault.default).call(config, config.transformResponse, response);
        response.headers = (0, _axiosHeadersJsDefault.default).from(response.headers);
        return response;
    }, function onAdapterRejection(reason) {
        if (!(0, _isCancelJsDefault.default)(reason)) {
            throwIfCancellationRequested(config);
            // Transform response data
            if (reason && reason.response) {
                reason.response.data = (0, _transformDataJsDefault.default).call(config, config.transformResponse, reason.response);
                reason.response.headers = (0, _axiosHeadersJsDefault.default).from(reason.response.headers);
            }
        }
        return Promise.reject(reason);
    });
}

},{"./transformData.js":"8ANo1","../cancel/isCancel.js":"fkTUi","../defaults/index.js":"9WXKx","../cancel/CanceledError.js":"9yG1c","../core/AxiosHeaders.js":"9EzTj","../adapters/adapters.js":"hI0HS","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"8ANo1":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>transformData);
var _utilsJs = require("./../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _indexJs = require("../defaults/index.js");
var _indexJsDefault = parcelHelpers.interopDefault(_indexJs);
var _axiosHeadersJs = require("../core/AxiosHeaders.js");
var _axiosHeadersJsDefault = parcelHelpers.interopDefault(_axiosHeadersJs);
'use strict';
function transformData(fns, response) {
    const config = this || (0, _indexJsDefault.default);
    const context = response || config;
    const headers = (0, _axiosHeadersJsDefault.default).from(context.headers);
    let data = context.data;
    (0, _utilsJsDefault.default).forEach(fns, function transform(fn) {
        data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
    });
    headers.normalize();
    return data;
}

},{"./../utils.js":"jI6DP","../defaults/index.js":"9WXKx","../core/AxiosHeaders.js":"9EzTj","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"9WXKx":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _axiosErrorJs = require("../core/AxiosError.js");
var _axiosErrorJsDefault = parcelHelpers.interopDefault(_axiosErrorJs);
var _transitionalJs = require("./transitional.js");
var _transitionalJsDefault = parcelHelpers.interopDefault(_transitionalJs);
var _toFormDataJs = require("../helpers/toFormData.js");
var _toFormDataJsDefault = parcelHelpers.interopDefault(_toFormDataJs);
var _toURLEncodedFormJs = require("../helpers/toURLEncodedForm.js");
var _toURLEncodedFormJsDefault = parcelHelpers.interopDefault(_toURLEncodedFormJs);
var _indexJs = require("../platform/index.js");
var _indexJsDefault = parcelHelpers.interopDefault(_indexJs);
var _formDataToJSONJs = require("../helpers/formDataToJSON.js");
var _formDataToJSONJsDefault = parcelHelpers.interopDefault(_formDataToJSONJs);
'use strict';
/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */ function stringifySafely(rawValue, parser, encoder) {
    if ((0, _utilsJsDefault.default).isString(rawValue)) try {
        (parser || JSON.parse)(rawValue);
        return (0, _utilsJsDefault.default).trim(rawValue);
    } catch (e) {
        if (e.name !== 'SyntaxError') throw e;
    }
    return (encoder || JSON.stringify)(rawValue);
}
const defaults = {
    transitional: (0, _transitionalJsDefault.default),
    adapter: [
        'xhr',
        'http',
        'fetch'
    ],
    transformRequest: [
        function transformRequest(data, headers) {
            const contentType = headers.getContentType() || '';
            const hasJSONContentType = contentType.indexOf('application/json') > -1;
            const isObjectPayload = (0, _utilsJsDefault.default).isObject(data);
            if (isObjectPayload && (0, _utilsJsDefault.default).isHTMLForm(data)) data = new FormData(data);
            const isFormData = (0, _utilsJsDefault.default).isFormData(data);
            if (isFormData) return hasJSONContentType ? JSON.stringify((0, _formDataToJSONJsDefault.default)(data)) : data;
            if ((0, _utilsJsDefault.default).isArrayBuffer(data) || (0, _utilsJsDefault.default).isBuffer(data) || (0, _utilsJsDefault.default).isStream(data) || (0, _utilsJsDefault.default).isFile(data) || (0, _utilsJsDefault.default).isBlob(data) || (0, _utilsJsDefault.default).isReadableStream(data)) return data;
            if ((0, _utilsJsDefault.default).isArrayBufferView(data)) return data.buffer;
            if ((0, _utilsJsDefault.default).isURLSearchParams(data)) {
                headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
                return data.toString();
            }
            let isFileList;
            if (isObjectPayload) {
                if (contentType.indexOf('application/x-www-form-urlencoded') > -1) return (0, _toURLEncodedFormJsDefault.default)(data, this.formSerializer).toString();
                if ((isFileList = (0, _utilsJsDefault.default).isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
                    const _FormData = this.env && this.env.FormData;
                    return (0, _toFormDataJsDefault.default)(isFileList ? {
                        'files[]': data
                    } : data, _FormData && new _FormData(), this.formSerializer);
                }
            }
            if (isObjectPayload || hasJSONContentType) {
                headers.setContentType('application/json', false);
                return stringifySafely(data);
            }
            return data;
        }
    ],
    transformResponse: [
        function transformResponse(data) {
            const transitional = this.transitional || defaults.transitional;
            const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
            const JSONRequested = this.responseType === 'json';
            if ((0, _utilsJsDefault.default).isResponse(data) || (0, _utilsJsDefault.default).isReadableStream(data)) return data;
            if (data && (0, _utilsJsDefault.default).isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
                const silentJSONParsing = transitional && transitional.silentJSONParsing;
                const strictJSONParsing = !silentJSONParsing && JSONRequested;
                try {
                    return JSON.parse(data, this.parseReviver);
                } catch (e) {
                    if (strictJSONParsing) {
                        if (e.name === 'SyntaxError') throw (0, _axiosErrorJsDefault.default).from(e, (0, _axiosErrorJsDefault.default).ERR_BAD_RESPONSE, this, null, this.response);
                        throw e;
                    }
                }
            }
            return data;
        }
    ],
    /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */ timeout: 0,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
        FormData: (0, _indexJsDefault.default).classes.FormData,
        Blob: (0, _indexJsDefault.default).classes.Blob
    },
    validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
    },
    headers: {
        common: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': undefined
        }
    }
};
(0, _utilsJsDefault.default).forEach([
    'delete',
    'get',
    'head',
    'post',
    'put',
    'patch'
], (method)=>{
    defaults.headers[method] = {};
});
exports.default = defaults;

},{"../utils.js":"jI6DP","../core/AxiosError.js":"7z85x","./transitional.js":"cKdyU","../helpers/toFormData.js":"2RXm4","../helpers/toURLEncodedForm.js":"keaer","../platform/index.js":"626Zd","../helpers/formDataToJSON.js":"fefHq","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"cKdyU":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
'use strict';
exports.default = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"keaer":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>toURLEncodedForm);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _toFormDataJs = require("./toFormData.js");
var _toFormDataJsDefault = parcelHelpers.interopDefault(_toFormDataJs);
var _indexJs = require("../platform/index.js");
var _indexJsDefault = parcelHelpers.interopDefault(_indexJs);
'use strict';
function toURLEncodedForm(data, options) {
    return (0, _toFormDataJsDefault.default)(data, new (0, _indexJsDefault.default).classes.URLSearchParams(), {
        visitor: function(value, key, path, helpers) {
            if ((0, _indexJsDefault.default).isNode && (0, _utilsJsDefault.default).isBuffer(value)) {
                this.append(key, value.toString('base64'));
                return false;
            }
            return helpers.defaultVisitor.apply(this, arguments);
        },
        ...options
    });
}

},{"../utils.js":"jI6DP","./toFormData.js":"2RXm4","../platform/index.js":"626Zd","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"626Zd":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _indexJs = require("./node/index.js");
var _indexJsDefault = parcelHelpers.interopDefault(_indexJs);
var _utilsJs = require("./common/utils.js");
exports.default = {
    ..._utilsJs,
    ...(0, _indexJsDefault.default)
};

},{"./node/index.js":"1TZsR","./common/utils.js":"3Z7Gl","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"1TZsR":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _urlsearchParamsJs = require("./classes/URLSearchParams.js");
var _urlsearchParamsJsDefault = parcelHelpers.interopDefault(_urlsearchParamsJs);
var _formDataJs = require("./classes/FormData.js");
var _formDataJsDefault = parcelHelpers.interopDefault(_formDataJs);
var _blobJs = require("./classes/Blob.js");
var _blobJsDefault = parcelHelpers.interopDefault(_blobJs);
exports.default = {
    isBrowser: true,
    classes: {
        URLSearchParams: (0, _urlsearchParamsJsDefault.default),
        FormData: (0, _formDataJsDefault.default),
        Blob: (0, _blobJsDefault.default)
    },
    protocols: [
        'http',
        'https',
        'file',
        'blob',
        'url',
        'data'
    ]
};

},{"./classes/URLSearchParams.js":"6cHm6","./classes/FormData.js":"7ag3a","./classes/Blob.js":"hRvHl","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"6cHm6":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _axiosURLSearchParamsJs = require("../../../helpers/AxiosURLSearchParams.js");
var _axiosURLSearchParamsJsDefault = parcelHelpers.interopDefault(_axiosURLSearchParamsJs);
'use strict';
exports.default = typeof URLSearchParams !== 'undefined' ? URLSearchParams : (0, _axiosURLSearchParamsJsDefault.default);

},{"../../../helpers/AxiosURLSearchParams.js":"i7MZs","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"7ag3a":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
'use strict';
exports.default = typeof FormData !== 'undefined' ? FormData : null;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"hRvHl":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
'use strict';
exports.default = typeof Blob !== 'undefined' ? Blob : null;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"3Z7Gl":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "hasBrowserEnv", ()=>hasBrowserEnv);
parcelHelpers.export(exports, "hasStandardBrowserWebWorkerEnv", ()=>hasStandardBrowserWebWorkerEnv);
parcelHelpers.export(exports, "hasStandardBrowserEnv", ()=>hasStandardBrowserEnv);
parcelHelpers.export(exports, "navigator", ()=>_navigator);
parcelHelpers.export(exports, "origin", ()=>origin);
const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';
const _navigator = typeof navigator === 'object' && navigator || undefined;
/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */ const hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || [
    'ReactNative',
    'NativeScript',
    'NS'
].indexOf(_navigator.product) < 0);
/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */ const hasStandardBrowserWebWorkerEnv = (()=>{
    return typeof WorkerGlobalScope !== 'undefined' && // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope && typeof self.importScripts === 'function';
})();
const origin = hasBrowserEnv && window.location.href || 'http://localhost';

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"fefHq":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
'use strict';
/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */ function parsePropPath(name) {
    // foo[x][y][z]
    // foo.x.y.z
    // foo-x-y-z
    // foo x y z
    return (0, _utilsJsDefault.default).matchAll(/\w+|\[(\w*)]/g, name).map((match)=>{
        return match[0] === '[]' ? '' : match[1] || match[0];
    });
}
/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */ function arrayToObject(arr) {
    const obj = {};
    const keys = Object.keys(arr);
    let i;
    const len = keys.length;
    let key;
    for(i = 0; i < len; i++){
        key = keys[i];
        obj[key] = arr[key];
    }
    return obj;
}
/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */ function formDataToJSON(formData) {
    function buildPath(path, value, target, index) {
        let name = path[index++];
        if (name === '__proto__') return true;
        const isNumericKey = Number.isFinite(+name);
        const isLast = index >= path.length;
        name = !name && (0, _utilsJsDefault.default).isArray(target) ? target.length : name;
        if (isLast) {
            if ((0, _utilsJsDefault.default).hasOwnProp(target, name)) target[name] = [
                target[name],
                value
            ];
            else target[name] = value;
            return !isNumericKey;
        }
        if (!target[name] || !(0, _utilsJsDefault.default).isObject(target[name])) target[name] = [];
        const result = buildPath(path, value, target[name], index);
        if (result && (0, _utilsJsDefault.default).isArray(target[name])) target[name] = arrayToObject(target[name]);
        return !isNumericKey;
    }
    if ((0, _utilsJsDefault.default).isFormData(formData) && (0, _utilsJsDefault.default).isFunction(formData.entries)) {
        const obj = {};
        (0, _utilsJsDefault.default).forEachEntry(formData, (name, value)=>{
            buildPath(parsePropPath(name), value, obj, 0);
        });
        return obj;
    }
    return null;
}
exports.default = formDataToJSON;

},{"../utils.js":"jI6DP","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"9EzTj":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _parseHeadersJs = require("../helpers/parseHeaders.js");
var _parseHeadersJsDefault = parcelHelpers.interopDefault(_parseHeadersJs);
'use strict';
const $internals = Symbol('internals');
function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
    if (value === false || value == null) return value;
    return (0, _utilsJsDefault.default).isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str) {
    const tokens = Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;
    while(match = tokensRE.exec(str))tokens[match[1]] = match[2];
    return tokens;
}
const isValidHeaderName = (str)=>/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
    if ((0, _utilsJsDefault.default).isFunction(filter)) return filter.call(this, value, header);
    if (isHeaderNameFilter) value = header;
    if (!(0, _utilsJsDefault.default).isString(value)) return;
    if ((0, _utilsJsDefault.default).isString(filter)) return value.indexOf(filter) !== -1;
    if ((0, _utilsJsDefault.default).isRegExp(filter)) return filter.test(value);
}
function formatHeader(header) {
    return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str)=>{
        return char.toUpperCase() + str;
    });
}
function buildAccessors(obj, header) {
    const accessorName = (0, _utilsJsDefault.default).toCamelCase(' ' + header);
    [
        'get',
        'set',
        'has'
    ].forEach((methodName)=>{
        Object.defineProperty(obj, methodName + accessorName, {
            value: function(arg1, arg2, arg3) {
                return this[methodName].call(this, header, arg1, arg2, arg3);
            },
            configurable: true
        });
    });
}
class AxiosHeaders {
    constructor(headers){
        headers && this.set(headers);
    }
    set(header, valueOrRewrite, rewrite) {
        const self = this;
        function setHeader(_value, _header, _rewrite) {
            const lHeader = normalizeHeader(_header);
            if (!lHeader) throw new Error('header name must be a non-empty string');
            const key = (0, _utilsJsDefault.default).findKey(self, lHeader);
            if (!key || self[key] === undefined || _rewrite === true || _rewrite === undefined && self[key] !== false) self[key || _header] = normalizeValue(_value);
        }
        const setHeaders = (headers, _rewrite)=>(0, _utilsJsDefault.default).forEach(headers, (_value, _header)=>setHeader(_value, _header, _rewrite));
        if ((0, _utilsJsDefault.default).isPlainObject(header) || header instanceof this.constructor) setHeaders(header, valueOrRewrite);
        else if ((0, _utilsJsDefault.default).isString(header) && (header = header.trim()) && !isValidHeaderName(header)) setHeaders((0, _parseHeadersJsDefault.default)(header), valueOrRewrite);
        else if ((0, _utilsJsDefault.default).isObject(header) && (0, _utilsJsDefault.default).isIterable(header)) {
            let obj = {}, dest, key;
            for (const entry of header){
                if (!(0, _utilsJsDefault.default).isArray(entry)) throw TypeError('Object iterator must return a key-value pair');
                obj[key = entry[0]] = (dest = obj[key]) ? (0, _utilsJsDefault.default).isArray(dest) ? [
                    ...dest,
                    entry[1]
                ] : [
                    dest,
                    entry[1]
                ] : entry[1];
            }
            setHeaders(obj, valueOrRewrite);
        } else header != null && setHeader(valueOrRewrite, header, rewrite);
        return this;
    }
    get(header, parser) {
        header = normalizeHeader(header);
        if (header) {
            const key = (0, _utilsJsDefault.default).findKey(this, header);
            if (key) {
                const value = this[key];
                if (!parser) return value;
                if (parser === true) return parseTokens(value);
                if ((0, _utilsJsDefault.default).isFunction(parser)) return parser.call(this, value, key);
                if ((0, _utilsJsDefault.default).isRegExp(parser)) return parser.exec(value);
                throw new TypeError('parser must be boolean|regexp|function');
            }
        }
    }
    has(header, matcher) {
        header = normalizeHeader(header);
        if (header) {
            const key = (0, _utilsJsDefault.default).findKey(this, header);
            return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
        }
        return false;
    }
    delete(header, matcher) {
        const self = this;
        let deleted = false;
        function deleteHeader(_header) {
            _header = normalizeHeader(_header);
            if (_header) {
                const key = (0, _utilsJsDefault.default).findKey(self, _header);
                if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
                    delete self[key];
                    deleted = true;
                }
            }
        }
        if ((0, _utilsJsDefault.default).isArray(header)) header.forEach(deleteHeader);
        else deleteHeader(header);
        return deleted;
    }
    clear(matcher) {
        const keys = Object.keys(this);
        let i = keys.length;
        let deleted = false;
        while(i--){
            const key = keys[i];
            if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
                delete this[key];
                deleted = true;
            }
        }
        return deleted;
    }
    normalize(format) {
        const self = this;
        const headers = {};
        (0, _utilsJsDefault.default).forEach(this, (value, header)=>{
            const key = (0, _utilsJsDefault.default).findKey(headers, header);
            if (key) {
                self[key] = normalizeValue(value);
                delete self[header];
                return;
            }
            const normalized = format ? formatHeader(header) : String(header).trim();
            if (normalized !== header) delete self[header];
            self[normalized] = normalizeValue(value);
            headers[normalized] = true;
        });
        return this;
    }
    concat(...targets) {
        return this.constructor.concat(this, ...targets);
    }
    toJSON(asStrings) {
        const obj = Object.create(null);
        (0, _utilsJsDefault.default).forEach(this, (value, header)=>{
            value != null && value !== false && (obj[header] = asStrings && (0, _utilsJsDefault.default).isArray(value) ? value.join(', ') : value);
        });
        return obj;
    }
    [Symbol.iterator]() {
        return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
        return Object.entries(this.toJSON()).map(([header, value])=>header + ': ' + value).join('\n');
    }
    getSetCookie() {
        return this.get("set-cookie") || [];
    }
    get [Symbol.toStringTag]() {
        return 'AxiosHeaders';
    }
    static from(thing) {
        return thing instanceof this ? thing : new this(thing);
    }
    static concat(first, ...targets) {
        const computed = new this(first);
        targets.forEach((target)=>computed.set(target));
        return computed;
    }
    static accessor(header) {
        const internals = this[$internals] = this[$internals] = {
            accessors: {}
        };
        const accessors = internals.accessors;
        const prototype = this.prototype;
        function defineAccessor(_header) {
            const lHeader = normalizeHeader(_header);
            if (!accessors[lHeader]) {
                buildAccessors(prototype, _header);
                accessors[lHeader] = true;
            }
        }
        (0, _utilsJsDefault.default).isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
        return this;
    }
}
AxiosHeaders.accessor([
    'Content-Type',
    'Content-Length',
    'Accept',
    'Accept-Encoding',
    'User-Agent',
    'Authorization'
]);
// reserved names hotfix
(0, _utilsJsDefault.default).reduceDescriptors(AxiosHeaders.prototype, ({ value }, key)=>{
    let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
    return {
        get: ()=>value,
        set (headerValue) {
            this[mapped] = headerValue;
        }
    };
});
(0, _utilsJsDefault.default).freezeMethods(AxiosHeaders);
exports.default = AxiosHeaders;

},{"../utils.js":"jI6DP","../helpers/parseHeaders.js":"H8RrA","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"H8RrA":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("./../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
'use strict';
// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = (0, _utilsJsDefault.default).toObjectSet([
    'age',
    'authorization',
    'content-length',
    'content-type',
    'etag',
    'expires',
    'from',
    'host',
    'if-modified-since',
    'if-unmodified-since',
    'last-modified',
    'location',
    'max-forwards',
    'proxy-authorization',
    'referer',
    'retry-after',
    'user-agent'
]);
/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */ exports.default = (rawHeaders)=>{
    const parsed = {};
    let key;
    let val;
    let i;
    rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
        i = line.indexOf(':');
        key = line.substring(0, i).trim().toLowerCase();
        val = line.substring(i + 1).trim();
        if (!key || parsed[key] && ignoreDuplicateOf[key]) return;
        if (key === 'set-cookie') {
            if (parsed[key]) parsed[key].push(val);
            else parsed[key] = [
                val
            ];
        } else parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    });
    return parsed;
};

},{"./../utils.js":"jI6DP","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"fkTUi":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>isCancel);
'use strict';
function isCancel(value) {
    return !!(value && value.__CANCEL__);
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"9yG1c":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _axiosErrorJs = require("../core/AxiosError.js");
var _axiosErrorJsDefault = parcelHelpers.interopDefault(_axiosErrorJs);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
'use strict';
/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */ function CanceledError(message, config, request) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    (0, _axiosErrorJsDefault.default).call(this, message == null ? 'canceled' : message, (0, _axiosErrorJsDefault.default).ERR_CANCELED, config, request);
    this.name = 'CanceledError';
}
(0, _utilsJsDefault.default).inherits(CanceledError, (0, _axiosErrorJsDefault.default), {
    __CANCEL__: true
});
exports.default = CanceledError;

},{"../core/AxiosError.js":"7z85x","../utils.js":"jI6DP","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"hI0HS":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _httpJs = require("./http.js");
var _httpJsDefault = parcelHelpers.interopDefault(_httpJs);
var _xhrJs = require("./xhr.js");
var _xhrJsDefault = parcelHelpers.interopDefault(_xhrJs);
var _fetchJs = require("./fetch.js");
var _axiosErrorJs = require("../core/AxiosError.js");
var _axiosErrorJsDefault = parcelHelpers.interopDefault(_axiosErrorJs);
/**
 * Known adapters mapping.
 * Provides environment-specific adapters for Axios:
 * - `http` for Node.js
 * - `xhr` for browsers
 * - `fetch` for fetch API-based requests
 * 
 * @type {Object<string, Function|Object>}
 */ const knownAdapters = {
    http: (0, _httpJsDefault.default),
    xhr: (0, _xhrJsDefault.default),
    fetch: {
        get: _fetchJs.getFetch
    }
};
// Assign adapter names for easier debugging and identification
(0, _utilsJsDefault.default).forEach(knownAdapters, (fn, value)=>{
    if (fn) {
        try {
            Object.defineProperty(fn, 'name', {
                value
            });
        } catch (e) {
        // eslint-disable-next-line no-empty
        }
        Object.defineProperty(fn, 'adapterName', {
            value
        });
    }
});
/**
 * Render a rejection reason string for unknown or unsupported adapters
 * 
 * @param {string} reason
 * @returns {string}
 */ const renderReason = (reason)=>`- ${reason}`;
/**
 * Check if the adapter is resolved (function, null, or false)
 * 
 * @param {Function|null|false} adapter
 * @returns {boolean}
 */ const isResolvedHandle = (adapter)=>(0, _utilsJsDefault.default).isFunction(adapter) || adapter === null || adapter === false;
/**
 * Get the first suitable adapter from the provided list.
 * Tries each adapter in order until a supported one is found.
 * Throws an AxiosError if no adapter is suitable.
 * 
 * @param {Array<string|Function>|string|Function} adapters - Adapter(s) by name or function.
 * @param {Object} config - Axios request configuration
 * @throws {AxiosError} If no suitable adapter is available
 * @returns {Function} The resolved adapter function
 */ function getAdapter(adapters, config) {
    adapters = (0, _utilsJsDefault.default).isArray(adapters) ? adapters : [
        adapters
    ];
    const { length } = adapters;
    let nameOrAdapter;
    let adapter;
    const rejectedReasons = {};
    for(let i = 0; i < length; i++){
        nameOrAdapter = adapters[i];
        let id;
        adapter = nameOrAdapter;
        if (!isResolvedHandle(nameOrAdapter)) {
            adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
            if (adapter === undefined) throw new (0, _axiosErrorJsDefault.default)(`Unknown adapter '${id}'`);
        }
        if (adapter && ((0, _utilsJsDefault.default).isFunction(adapter) || (adapter = adapter.get(config)))) break;
        rejectedReasons[id || '#' + i] = adapter;
    }
    if (!adapter) {
        const reasons = Object.entries(rejectedReasons).map(([id, state])=>`adapter ${id} ` + (state === false ? 'is not supported by the environment' : 'is not available in the build'));
        let s = length ? reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0]) : 'as no adapter specified';
        throw new (0, _axiosErrorJsDefault.default)(`There is no suitable adapter to dispatch the request ` + s, 'ERR_NOT_SUPPORT');
    }
    return adapter;
}
/**
 * Exports Axios adapters and utility to resolve an adapter
 */ exports.default = {
    /**
   * Resolve an adapter from a list of adapter names or functions.
   * @type {Function}
   */ getAdapter,
    /**
   * Exposes all known adapters
   * @type {Object<string, Function|Object>}
   */ adapters: knownAdapters
};

},{"../utils.js":"jI6DP","./http.js":"dVGJ4","./xhr.js":"ao6fA","./fetch.js":"d5PZl","../core/AxiosError.js":"7z85x","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"ao6fA":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("./../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _settleJs = require("./../core/settle.js");
var _settleJsDefault = parcelHelpers.interopDefault(_settleJs);
var _transitionalJs = require("../defaults/transitional.js");
var _transitionalJsDefault = parcelHelpers.interopDefault(_transitionalJs);
var _axiosErrorJs = require("../core/AxiosError.js");
var _axiosErrorJsDefault = parcelHelpers.interopDefault(_axiosErrorJs);
var _canceledErrorJs = require("../cancel/CanceledError.js");
var _canceledErrorJsDefault = parcelHelpers.interopDefault(_canceledErrorJs);
var _parseProtocolJs = require("../helpers/parseProtocol.js");
var _parseProtocolJsDefault = parcelHelpers.interopDefault(_parseProtocolJs);
var _indexJs = require("../platform/index.js");
var _indexJsDefault = parcelHelpers.interopDefault(_indexJs);
var _axiosHeadersJs = require("../core/AxiosHeaders.js");
var _axiosHeadersJsDefault = parcelHelpers.interopDefault(_axiosHeadersJs);
var _progressEventReducerJs = require("../helpers/progressEventReducer.js");
var _resolveConfigJs = require("../helpers/resolveConfig.js");
var _resolveConfigJsDefault = parcelHelpers.interopDefault(_resolveConfigJs);
const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';
exports.default = isXHRAdapterSupported && function(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
        const _config = (0, _resolveConfigJsDefault.default)(config);
        let requestData = _config.data;
        const requestHeaders = (0, _axiosHeadersJsDefault.default).from(_config.headers).normalize();
        let { responseType, onUploadProgress, onDownloadProgress } = _config;
        let onCanceled;
        let uploadThrottled, downloadThrottled;
        let flushUpload, flushDownload;
        function done() {
            flushUpload && flushUpload(); // flush events
            flushDownload && flushDownload(); // flush events
            _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
            _config.signal && _config.signal.removeEventListener('abort', onCanceled);
        }
        let request = new XMLHttpRequest();
        request.open(_config.method.toUpperCase(), _config.url, true);
        // Set the request timeout in MS
        request.timeout = _config.timeout;
        function onloadend() {
            if (!request) return;
            // Prepare the response
            const responseHeaders = (0, _axiosHeadersJsDefault.default).from('getAllResponseHeaders' in request && request.getAllResponseHeaders());
            const responseData = !responseType || responseType === 'text' || responseType === 'json' ? request.responseText : request.response;
            const response = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                config,
                request
            };
            (0, _settleJsDefault.default)(function _resolve(value) {
                resolve(value);
                done();
            }, function _reject(err) {
                reject(err);
                done();
            }, response);
            // Clean up request
            request = null;
        }
        if ('onloadend' in request) // Use onloadend if available
        request.onloadend = onloadend;
        else // Listen for ready state to emulate onloadend
        request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) return;
            // The request errored out and we didn't get a response, this will be
            // handled by onerror instead
            // With one exception: request that using file: protocol, most browsers
            // will return status as 0 even though it's a successful request
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) return;
            // readystate handler is calling before onerror or ontimeout handlers,
            // so we should call onloadend on the next 'tick'
            setTimeout(onloadend);
        };
        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
            if (!request) return;
            reject(new (0, _axiosErrorJsDefault.default)('Request aborted', (0, _axiosErrorJsDefault.default).ECONNABORTED, config, request));
            // Clean up request
            request = null;
        };
        // Handle low level network errors
        request.onerror = function handleError(event) {
            // Browsers deliver a ProgressEvent in XHR onerror
            // (message may be empty; when present, surface it)
            // See https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/error_event
            const msg = event && event.message ? event.message : 'Network Error';
            const err = new (0, _axiosErrorJsDefault.default)(msg, (0, _axiosErrorJsDefault.default).ERR_NETWORK, config, request);
            // attach the underlying event for consumers who want details
            err.event = event || null;
            reject(err);
            request = null;
        };
        // Handle timeout
        request.ontimeout = function handleTimeout() {
            let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
            const transitional = _config.transitional || (0, _transitionalJsDefault.default);
            if (_config.timeoutErrorMessage) timeoutErrorMessage = _config.timeoutErrorMessage;
            reject(new (0, _axiosErrorJsDefault.default)(timeoutErrorMessage, transitional.clarifyTimeoutError ? (0, _axiosErrorJsDefault.default).ETIMEDOUT : (0, _axiosErrorJsDefault.default).ECONNABORTED, config, request));
            // Clean up request
            request = null;
        };
        // Remove Content-Type if data is undefined
        requestData === undefined && requestHeaders.setContentType(null);
        // Add headers to the request
        if ('setRequestHeader' in request) (0, _utilsJsDefault.default).forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
            request.setRequestHeader(key, val);
        });
        // Add withCredentials to request if needed
        if (!(0, _utilsJsDefault.default).isUndefined(_config.withCredentials)) request.withCredentials = !!_config.withCredentials;
        // Add responseType to request if needed
        if (responseType && responseType !== 'json') request.responseType = _config.responseType;
        // Handle progress if needed
        if (onDownloadProgress) {
            [downloadThrottled, flushDownload] = (0, _progressEventReducerJs.progressEventReducer)(onDownloadProgress, true);
            request.addEventListener('progress', downloadThrottled);
        }
        // Not all browsers support upload events
        if (onUploadProgress && request.upload) {
            [uploadThrottled, flushUpload] = (0, _progressEventReducerJs.progressEventReducer)(onUploadProgress);
            request.upload.addEventListener('progress', uploadThrottled);
            request.upload.addEventListener('loadend', flushUpload);
        }
        if (_config.cancelToken || _config.signal) {
            // Handle cancellation
            // eslint-disable-next-line func-names
            onCanceled = (cancel)=>{
                if (!request) return;
                reject(!cancel || cancel.type ? new (0, _canceledErrorJsDefault.default)(null, config, request) : cancel);
                request.abort();
                request = null;
            };
            _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
            if (_config.signal) _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
        }
        const protocol = (0, _parseProtocolJsDefault.default)(_config.url);
        if (protocol && (0, _indexJsDefault.default).protocols.indexOf(protocol) === -1) {
            reject(new (0, _axiosErrorJsDefault.default)('Unsupported protocol ' + protocol + ':', (0, _axiosErrorJsDefault.default).ERR_BAD_REQUEST, config));
            return;
        }
        // Send the request
        request.send(requestData || null);
    });
};

},{"./../utils.js":"jI6DP","./../core/settle.js":"2vmJg","../defaults/transitional.js":"cKdyU","../core/AxiosError.js":"7z85x","../cancel/CanceledError.js":"9yG1c","../helpers/parseProtocol.js":"af3D4","../platform/index.js":"626Zd","../core/AxiosHeaders.js":"9EzTj","../helpers/progressEventReducer.js":"6rzPu","../helpers/resolveConfig.js":"3RDMa","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"2vmJg":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>settle);
var _axiosErrorJs = require("./AxiosError.js");
var _axiosErrorJsDefault = parcelHelpers.interopDefault(_axiosErrorJs);
'use strict';
function settle(resolve, reject, response) {
    const validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) resolve(response);
    else reject(new (0, _axiosErrorJsDefault.default)('Request failed with status code ' + response.status, [
        (0, _axiosErrorJsDefault.default).ERR_BAD_REQUEST,
        (0, _axiosErrorJsDefault.default).ERR_BAD_RESPONSE
    ][Math.floor(response.status / 100) - 4], response.config, response.request, response));
}

},{"./AxiosError.js":"7z85x","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"af3D4":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>parseProtocol);
'use strict';
function parseProtocol(url) {
    const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
    return match && match[1] || '';
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"6rzPu":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "progressEventReducer", ()=>progressEventReducer);
parcelHelpers.export(exports, "progressEventDecorator", ()=>progressEventDecorator);
parcelHelpers.export(exports, "asyncDecorator", ()=>asyncDecorator);
var _speedometerJs = require("./speedometer.js");
var _speedometerJsDefault = parcelHelpers.interopDefault(_speedometerJs);
var _throttleJs = require("./throttle.js");
var _throttleJsDefault = parcelHelpers.interopDefault(_throttleJs);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
const progressEventReducer = (listener, isDownloadStream, freq = 3)=>{
    let bytesNotified = 0;
    const _speedometer = (0, _speedometerJsDefault.default)(50, 250);
    return (0, _throttleJsDefault.default)((e)=>{
        const loaded = e.loaded;
        const total = e.lengthComputable ? e.total : undefined;
        const progressBytes = loaded - bytesNotified;
        const rate = _speedometer(progressBytes);
        const inRange = loaded <= total;
        bytesNotified = loaded;
        const data = {
            loaded,
            total,
            progress: total ? loaded / total : undefined,
            bytes: progressBytes,
            rate: rate ? rate : undefined,
            estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
            event: e,
            lengthComputable: total != null,
            [isDownloadStream ? 'download' : 'upload']: true
        };
        listener(data);
    }, freq);
};
const progressEventDecorator = (total, throttled)=>{
    const lengthComputable = total != null;
    return [
        (loaded)=>throttled[0]({
                lengthComputable,
                total,
                loaded
            }),
        throttled[1]
    ];
};
const asyncDecorator = (fn)=>(...args)=>(0, _utilsJsDefault.default).asap(()=>fn(...args));

},{"./speedometer.js":"cCdi6","./throttle.js":"esfhP","../utils.js":"jI6DP","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"cCdi6":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
'use strict';
/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */ function speedometer(samplesCount, min) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;
    min = min !== undefined ? min : 1000;
    return function push(chunkLength) {
        const now = Date.now();
        const startedAt = timestamps[tail];
        if (!firstSampleTS) firstSampleTS = now;
        bytes[head] = chunkLength;
        timestamps[head] = now;
        let i = tail;
        let bytesCount = 0;
        while(i !== head){
            bytesCount += bytes[i++];
            i = i % samplesCount;
        }
        head = (head + 1) % samplesCount;
        if (head === tail) tail = (tail + 1) % samplesCount;
        if (now - firstSampleTS < min) return;
        const passed = startedAt && now - startedAt;
        return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
    };
}
exports.default = speedometer;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"esfhP":[function(require,module,exports,__globalThis) {
/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
function throttle(fn, freq) {
    let timestamp = 0;
    let threshold = 1000 / freq;
    let lastArgs;
    let timer;
    const invoke = (args, now = Date.now())=>{
        timestamp = now;
        lastArgs = null;
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        fn(...args);
    };
    const throttled = (...args)=>{
        const now = Date.now();
        const passed = now - timestamp;
        if (passed >= threshold) invoke(args, now);
        else {
            lastArgs = args;
            if (!timer) timer = setTimeout(()=>{
                timer = null;
                invoke(lastArgs);
            }, threshold - passed);
        }
    };
    const flush = ()=>lastArgs && invoke(lastArgs);
    return [
        throttled,
        flush
    ];
}
exports.default = throttle;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"3RDMa":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _indexJs = require("../platform/index.js");
var _indexJsDefault = parcelHelpers.interopDefault(_indexJs);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _isURLSameOriginJs = require("./isURLSameOrigin.js");
var _isURLSameOriginJsDefault = parcelHelpers.interopDefault(_isURLSameOriginJs);
var _cookiesJs = require("./cookies.js");
var _cookiesJsDefault = parcelHelpers.interopDefault(_cookiesJs);
var _buildFullPathJs = require("../core/buildFullPath.js");
var _buildFullPathJsDefault = parcelHelpers.interopDefault(_buildFullPathJs);
var _mergeConfigJs = require("../core/mergeConfig.js");
var _mergeConfigJsDefault = parcelHelpers.interopDefault(_mergeConfigJs);
var _axiosHeadersJs = require("../core/AxiosHeaders.js");
var _axiosHeadersJsDefault = parcelHelpers.interopDefault(_axiosHeadersJs);
var _buildURLJs = require("./buildURL.js");
var _buildURLJsDefault = parcelHelpers.interopDefault(_buildURLJs);
exports.default = (config)=>{
    const newConfig = (0, _mergeConfigJsDefault.default)({}, config);
    let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
    newConfig.headers = headers = (0, _axiosHeadersJsDefault.default).from(headers);
    newConfig.url = (0, _buildURLJsDefault.default)((0, _buildFullPathJsDefault.default)(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);
    // HTTP basic authentication
    if (auth) headers.set('Authorization', 'Basic ' + btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : '')));
    if ((0, _utilsJsDefault.default).isFormData(data)) {
        if ((0, _indexJsDefault.default).hasStandardBrowserEnv || (0, _indexJsDefault.default).hasStandardBrowserWebWorkerEnv) headers.setContentType(undefined); // browser handles it
        else if ((0, _utilsJsDefault.default).isFunction(data.getHeaders)) {
            // Node.js FormData (like form-data package)
            const formHeaders = data.getHeaders();
            // Only set safe headers to avoid overwriting security headers
            const allowedHeaders = [
                'content-type',
                'content-length'
            ];
            Object.entries(formHeaders).forEach(([key, val])=>{
                if (allowedHeaders.includes(key.toLowerCase())) headers.set(key, val);
            });
        }
    }
    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if ((0, _indexJsDefault.default).hasStandardBrowserEnv) {
        withXSRFToken && (0, _utilsJsDefault.default).isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
        if (withXSRFToken || withXSRFToken !== false && (0, _isURLSameOriginJsDefault.default)(newConfig.url)) {
            // Add xsrf header
            const xsrfValue = xsrfHeaderName && xsrfCookieName && (0, _cookiesJsDefault.default).read(xsrfCookieName);
            if (xsrfValue) headers.set(xsrfHeaderName, xsrfValue);
        }
    }
    return newConfig;
};

},{"../platform/index.js":"626Zd","../utils.js":"jI6DP","./isURLSameOrigin.js":"d9uxL","./cookies.js":"hoVvn","../core/buildFullPath.js":"kg0Bk","../core/mergeConfig.js":"311Mu","../core/AxiosHeaders.js":"9EzTj","./buildURL.js":"3CNaw","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"d9uxL":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _indexJs = require("../platform/index.js");
var _indexJsDefault = parcelHelpers.interopDefault(_indexJs);
exports.default = (0, _indexJsDefault.default).hasStandardBrowserEnv ? ((origin, isMSIE)=>(url)=>{
        url = new URL(url, (0, _indexJsDefault.default).origin);
        return origin.protocol === url.protocol && origin.host === url.host && (isMSIE || origin.port === url.port);
    })(new URL((0, _indexJsDefault.default).origin), (0, _indexJsDefault.default).navigator && /(msie|trident)/i.test((0, _indexJsDefault.default).navigator.userAgent)) : ()=>true;

},{"../platform/index.js":"626Zd","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"hoVvn":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("./../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _indexJs = require("../platform/index.js");
var _indexJsDefault = parcelHelpers.interopDefault(_indexJs);
exports.default = (0, _indexJsDefault.default).hasStandardBrowserEnv ? // Standard browser envs support document.cookie
{
    write (name, value, expires, path, domain, secure, sameSite) {
        if (typeof document === 'undefined') return;
        const cookie = [
            `${name}=${encodeURIComponent(value)}`
        ];
        if ((0, _utilsJsDefault.default).isNumber(expires)) cookie.push(`expires=${new Date(expires).toUTCString()}`);
        if ((0, _utilsJsDefault.default).isString(path)) cookie.push(`path=${path}`);
        if ((0, _utilsJsDefault.default).isString(domain)) cookie.push(`domain=${domain}`);
        if (secure === true) cookie.push('secure');
        if ((0, _utilsJsDefault.default).isString(sameSite)) cookie.push(`SameSite=${sameSite}`);
        document.cookie = cookie.join('; ');
    },
    read (name) {
        if (typeof document === 'undefined') return null;
        const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]) : null;
    },
    remove (name) {
        this.write(name, '', Date.now() - 86400000, '/');
    }
} : // Non-standard browser env (web workers, react-native) lack needed support.
{
    write () {},
    read () {
        return null;
    },
    remove () {}
};

},{"./../utils.js":"jI6DP","../platform/index.js":"626Zd","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"kg0Bk":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>buildFullPath);
var _isAbsoluteURLJs = require("../helpers/isAbsoluteURL.js");
var _isAbsoluteURLJsDefault = parcelHelpers.interopDefault(_isAbsoluteURLJs);
var _combineURLsJs = require("../helpers/combineURLs.js");
var _combineURLsJsDefault = parcelHelpers.interopDefault(_combineURLsJs);
'use strict';
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
    let isRelativeUrl = !(0, _isAbsoluteURLJsDefault.default)(requestedURL);
    if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) return (0, _combineURLsJsDefault.default)(baseURL, requestedURL);
    return requestedURL;
}

},{"../helpers/isAbsoluteURL.js":"6XRC7","../helpers/combineURLs.js":"l5Wmt","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"6XRC7":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>isAbsoluteURL);
'use strict';
function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"l5Wmt":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>combineURLs);
'use strict';
function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"311Mu":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>mergeConfig);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _axiosHeadersJs = require("./AxiosHeaders.js");
var _axiosHeadersJsDefault = parcelHelpers.interopDefault(_axiosHeadersJs);
'use strict';
const headersToObject = (thing)=>thing instanceof (0, _axiosHeadersJsDefault.default) ? {
        ...thing
    } : thing;
function mergeConfig(config1, config2) {
    // eslint-disable-next-line no-param-reassign
    config2 = config2 || {};
    const config = {};
    function getMergedValue(target, source, prop, caseless) {
        if ((0, _utilsJsDefault.default).isPlainObject(target) && (0, _utilsJsDefault.default).isPlainObject(source)) return (0, _utilsJsDefault.default).merge.call({
            caseless
        }, target, source);
        else if ((0, _utilsJsDefault.default).isPlainObject(source)) return (0, _utilsJsDefault.default).merge({}, source);
        else if ((0, _utilsJsDefault.default).isArray(source)) return source.slice();
        return source;
    }
    // eslint-disable-next-line consistent-return
    function mergeDeepProperties(a, b, prop, caseless) {
        if (!(0, _utilsJsDefault.default).isUndefined(b)) return getMergedValue(a, b, prop, caseless);
        else if (!(0, _utilsJsDefault.default).isUndefined(a)) return getMergedValue(undefined, a, prop, caseless);
    }
    // eslint-disable-next-line consistent-return
    function valueFromConfig2(a, b) {
        if (!(0, _utilsJsDefault.default).isUndefined(b)) return getMergedValue(undefined, b);
    }
    // eslint-disable-next-line consistent-return
    function defaultToConfig2(a, b) {
        if (!(0, _utilsJsDefault.default).isUndefined(b)) return getMergedValue(undefined, b);
        else if (!(0, _utilsJsDefault.default).isUndefined(a)) return getMergedValue(undefined, a);
    }
    // eslint-disable-next-line consistent-return
    function mergeDirectKeys(a, b, prop) {
        if (prop in config2) return getMergedValue(a, b);
        else if (prop in config1) return getMergedValue(undefined, a);
    }
    const mergeMap = {
        url: valueFromConfig2,
        method: valueFromConfig2,
        data: valueFromConfig2,
        baseURL: defaultToConfig2,
        transformRequest: defaultToConfig2,
        transformResponse: defaultToConfig2,
        paramsSerializer: defaultToConfig2,
        timeout: defaultToConfig2,
        timeoutMessage: defaultToConfig2,
        withCredentials: defaultToConfig2,
        withXSRFToken: defaultToConfig2,
        adapter: defaultToConfig2,
        responseType: defaultToConfig2,
        xsrfCookieName: defaultToConfig2,
        xsrfHeaderName: defaultToConfig2,
        onUploadProgress: defaultToConfig2,
        onDownloadProgress: defaultToConfig2,
        decompress: defaultToConfig2,
        maxContentLength: defaultToConfig2,
        maxBodyLength: defaultToConfig2,
        beforeRedirect: defaultToConfig2,
        transport: defaultToConfig2,
        httpAgent: defaultToConfig2,
        httpsAgent: defaultToConfig2,
        cancelToken: defaultToConfig2,
        socketPath: defaultToConfig2,
        responseEncoding: defaultToConfig2,
        validateStatus: mergeDirectKeys,
        headers: (a, b, prop)=>mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
    };
    (0, _utilsJsDefault.default).forEach(Object.keys({
        ...config1,
        ...config2
    }), function computeConfigValue(prop) {
        const merge = mergeMap[prop] || mergeDeepProperties;
        const configValue = merge(config1[prop], config2[prop], prop);
        (0, _utilsJsDefault.default).isUndefined(configValue) && merge !== mergeDirectKeys || (config[prop] = configValue);
    });
    return config;
}

},{"../utils.js":"jI6DP","./AxiosHeaders.js":"9EzTj","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"d5PZl":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getFetch", ()=>getFetch);
var _indexJs = require("../platform/index.js");
var _indexJsDefault = parcelHelpers.interopDefault(_indexJs);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _axiosErrorJs = require("../core/AxiosError.js");
var _axiosErrorJsDefault = parcelHelpers.interopDefault(_axiosErrorJs);
var _composeSignalsJs = require("../helpers/composeSignals.js");
var _composeSignalsJsDefault = parcelHelpers.interopDefault(_composeSignalsJs);
var _trackStreamJs = require("../helpers/trackStream.js");
var _axiosHeadersJs = require("../core/AxiosHeaders.js");
var _axiosHeadersJsDefault = parcelHelpers.interopDefault(_axiosHeadersJs);
var _progressEventReducerJs = require("../helpers/progressEventReducer.js");
var _resolveConfigJs = require("../helpers/resolveConfig.js");
var _resolveConfigJsDefault = parcelHelpers.interopDefault(_resolveConfigJs);
var _settleJs = require("../core/settle.js");
var _settleJsDefault = parcelHelpers.interopDefault(_settleJs);
const DEFAULT_CHUNK_SIZE = 65536;
const { isFunction } = (0, _utilsJsDefault.default);
const globalFetchAPI = (({ Request, Response })=>({
        Request,
        Response
    }))((0, _utilsJsDefault.default).global);
const { ReadableStream, TextEncoder } = (0, _utilsJsDefault.default).global;
const test = (fn, ...args)=>{
    try {
        return !!fn(...args);
    } catch (e) {
        return false;
    }
};
const factory = (env)=>{
    env = (0, _utilsJsDefault.default).merge.call({
        skipUndefined: true
    }, globalFetchAPI, env);
    const { fetch: envFetch, Request, Response } = env;
    const isFetchSupported = envFetch ? isFunction(envFetch) : typeof fetch === 'function';
    const isRequestSupported = isFunction(Request);
    const isResponseSupported = isFunction(Response);
    if (!isFetchSupported) return false;
    const isReadableStreamSupported = isFetchSupported && isFunction(ReadableStream);
    const encodeText = isFetchSupported && (typeof TextEncoder === 'function' ? ((encoder)=>(str)=>encoder.encode(str))(new TextEncoder()) : async (str)=>new Uint8Array(await new Request(str).arrayBuffer()));
    const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(()=>{
        let duplexAccessed = false;
        const hasContentType = new Request((0, _indexJsDefault.default).origin, {
            body: new ReadableStream(),
            method: 'POST',
            get duplex () {
                duplexAccessed = true;
                return 'half';
            }
        }).headers.has('Content-Type');
        return duplexAccessed && !hasContentType;
    });
    const supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(()=>(0, _utilsJsDefault.default).isReadableStream(new Response('').body));
    const resolvers = {
        stream: supportsResponseStream && ((res)=>res.body)
    };
    isFetchSupported && (()=>{
        [
            'text',
            'arrayBuffer',
            'blob',
            'formData',
            'stream'
        ].forEach((type)=>{
            !resolvers[type] && (resolvers[type] = (res, config)=>{
                let method = res && res[type];
                if (method) return method.call(res);
                throw new (0, _axiosErrorJsDefault.default)(`Response type '${type}' is not supported`, (0, _axiosErrorJsDefault.default).ERR_NOT_SUPPORT, config);
            });
        });
    })();
    const getBodyLength = async (body)=>{
        if (body == null) return 0;
        if ((0, _utilsJsDefault.default).isBlob(body)) return body.size;
        if ((0, _utilsJsDefault.default).isSpecCompliantForm(body)) {
            const _request = new Request((0, _indexJsDefault.default).origin, {
                method: 'POST',
                body
            });
            return (await _request.arrayBuffer()).byteLength;
        }
        if ((0, _utilsJsDefault.default).isArrayBufferView(body) || (0, _utilsJsDefault.default).isArrayBuffer(body)) return body.byteLength;
        if ((0, _utilsJsDefault.default).isURLSearchParams(body)) body = body + '';
        if ((0, _utilsJsDefault.default).isString(body)) return (await encodeText(body)).byteLength;
    };
    const resolveBodyLength = async (headers, body)=>{
        const length = (0, _utilsJsDefault.default).toFiniteNumber(headers.getContentLength());
        return length == null ? getBodyLength(body) : length;
    };
    return async (config)=>{
        let { url, method, data, signal, cancelToken, timeout, onDownloadProgress, onUploadProgress, responseType, headers, withCredentials = 'same-origin', fetchOptions } = (0, _resolveConfigJsDefault.default)(config);
        let _fetch = envFetch || fetch;
        responseType = responseType ? (responseType + '').toLowerCase() : 'text';
        let composedSignal = (0, _composeSignalsJsDefault.default)([
            signal,
            cancelToken && cancelToken.toAbortSignal()
        ], timeout);
        let request = null;
        const unsubscribe = composedSignal && composedSignal.unsubscribe && (()=>{
            composedSignal.unsubscribe();
        });
        let requestContentLength;
        try {
            if (onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
                let _request = new Request(url, {
                    method: 'POST',
                    body: data,
                    duplex: "half"
                });
                let contentTypeHeader;
                if ((0, _utilsJsDefault.default).isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) headers.setContentType(contentTypeHeader);
                if (_request.body) {
                    const [onProgress, flush] = (0, _progressEventReducerJs.progressEventDecorator)(requestContentLength, (0, _progressEventReducerJs.progressEventReducer)((0, _progressEventReducerJs.asyncDecorator)(onUploadProgress)));
                    data = (0, _trackStreamJs.trackStream)(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
                }
            }
            if (!(0, _utilsJsDefault.default).isString(withCredentials)) withCredentials = withCredentials ? 'include' : 'omit';
            // Cloudflare Workers throws when credentials are defined
            // see https://github.com/cloudflare/workerd/issues/902
            const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
            const resolvedOptions = {
                ...fetchOptions,
                signal: composedSignal,
                method: method.toUpperCase(),
                headers: headers.normalize().toJSON(),
                body: data,
                duplex: "half",
                credentials: isCredentialsSupported ? withCredentials : undefined
            };
            request = isRequestSupported && new Request(url, resolvedOptions);
            let response = await (isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url, resolvedOptions));
            const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');
            if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
                const options = {};
                [
                    'status',
                    'statusText',
                    'headers'
                ].forEach((prop)=>{
                    options[prop] = response[prop];
                });
                const responseContentLength = (0, _utilsJsDefault.default).toFiniteNumber(response.headers.get('content-length'));
                const [onProgress, flush] = onDownloadProgress && (0, _progressEventReducerJs.progressEventDecorator)(responseContentLength, (0, _progressEventReducerJs.progressEventReducer)((0, _progressEventReducerJs.asyncDecorator)(onDownloadProgress), true)) || [];
                response = new Response((0, _trackStreamJs.trackStream)(response.body, DEFAULT_CHUNK_SIZE, onProgress, ()=>{
                    flush && flush();
                    unsubscribe && unsubscribe();
                }), options);
            }
            responseType = responseType || 'text';
            let responseData = await resolvers[(0, _utilsJsDefault.default).findKey(resolvers, responseType) || 'text'](response, config);
            !isStreamResponse && unsubscribe && unsubscribe();
            return await new Promise((resolve, reject)=>{
                (0, _settleJsDefault.default)(resolve, reject, {
                    data: responseData,
                    headers: (0, _axiosHeadersJsDefault.default).from(response.headers),
                    status: response.status,
                    statusText: response.statusText,
                    config,
                    request
                });
            });
        } catch (err) {
            unsubscribe && unsubscribe();
            if (err && err.name === 'TypeError' && /Load failed|fetch/i.test(err.message)) throw Object.assign(new (0, _axiosErrorJsDefault.default)('Network Error', (0, _axiosErrorJsDefault.default).ERR_NETWORK, config, request), {
                cause: err.cause || err
            });
            throw (0, _axiosErrorJsDefault.default).from(err, err && err.code, config, request);
        }
    };
};
const seedCache = new Map();
const getFetch = (config)=>{
    let env = config && config.env || {};
    const { fetch: fetch1, Request, Response } = env;
    const seeds = [
        Request,
        Response,
        fetch1
    ];
    let len = seeds.length, i = len, seed, target, map = seedCache;
    while(i--){
        seed = seeds[i];
        target = map.get(seed);
        target === undefined && map.set(seed, target = i ? new Map() : factory(env));
        map = target;
    }
    return target;
};
const adapter = getFetch();
exports.default = adapter;

},{"../platform/index.js":"626Zd","../utils.js":"jI6DP","../core/AxiosError.js":"7z85x","../helpers/composeSignals.js":"fy9c7","../helpers/trackStream.js":"6dI08","../core/AxiosHeaders.js":"9EzTj","../helpers/progressEventReducer.js":"6rzPu","../helpers/resolveConfig.js":"3RDMa","../core/settle.js":"2vmJg","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"fy9c7":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _canceledErrorJs = require("../cancel/CanceledError.js");
var _canceledErrorJsDefault = parcelHelpers.interopDefault(_canceledErrorJs);
var _axiosErrorJs = require("../core/AxiosError.js");
var _axiosErrorJsDefault = parcelHelpers.interopDefault(_axiosErrorJs);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
const composeSignals = (signals, timeout)=>{
    const { length } = signals = signals ? signals.filter(Boolean) : [];
    if (timeout || length) {
        let controller = new AbortController();
        let aborted;
        const onabort = function(reason) {
            if (!aborted) {
                aborted = true;
                unsubscribe();
                const err = reason instanceof Error ? reason : this.reason;
                controller.abort(err instanceof (0, _axiosErrorJsDefault.default) ? err : new (0, _canceledErrorJsDefault.default)(err instanceof Error ? err.message : err));
            }
        };
        let timer = timeout && setTimeout(()=>{
            timer = null;
            onabort(new (0, _axiosErrorJsDefault.default)(`timeout ${timeout} of ms exceeded`, (0, _axiosErrorJsDefault.default).ETIMEDOUT));
        }, timeout);
        const unsubscribe = ()=>{
            if (signals) {
                timer && clearTimeout(timer);
                timer = null;
                signals.forEach((signal)=>{
                    signal.unsubscribe ? signal.unsubscribe(onabort) : signal.removeEventListener('abort', onabort);
                });
                signals = null;
            }
        };
        signals.forEach((signal)=>signal.addEventListener('abort', onabort));
        const { signal } = controller;
        signal.unsubscribe = ()=>(0, _utilsJsDefault.default).asap(unsubscribe);
        return signal;
    }
};
exports.default = composeSignals;

},{"../cancel/CanceledError.js":"9yG1c","../core/AxiosError.js":"7z85x","../utils.js":"jI6DP","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"6dI08":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "streamChunk", ()=>streamChunk);
parcelHelpers.export(exports, "readBytes", ()=>readBytes);
parcelHelpers.export(exports, "trackStream", ()=>trackStream);
const streamChunk = function*(chunk, chunkSize) {
    let len = chunk.byteLength;
    if (!chunkSize || len < chunkSize) {
        yield chunk;
        return;
    }
    let pos = 0;
    let end;
    while(pos < len){
        end = pos + chunkSize;
        yield chunk.slice(pos, end);
        pos = end;
    }
};
const readBytes = async function*(iterable, chunkSize) {
    for await (const chunk of readStream(iterable))yield* streamChunk(chunk, chunkSize);
};
const readStream = async function*(stream) {
    if (stream[Symbol.asyncIterator]) {
        yield* stream;
        return;
    }
    const reader = stream.getReader();
    try {
        for(;;){
            const { done, value } = await reader.read();
            if (done) break;
            yield value;
        }
    } finally{
        await reader.cancel();
    }
};
const trackStream = (stream, chunkSize, onProgress, onFinish)=>{
    const iterator = readBytes(stream, chunkSize);
    let bytes = 0;
    let done;
    let _onFinish = (e)=>{
        if (!done) {
            done = true;
            onFinish && onFinish(e);
        }
    };
    return new ReadableStream({
        async pull (controller) {
            try {
                const { done, value } = await iterator.next();
                if (done) {
                    _onFinish();
                    controller.close();
                    return;
                }
                let len = value.byteLength;
                if (onProgress) {
                    let loadedBytes = bytes += len;
                    onProgress(loadedBytes);
                }
                controller.enqueue(new Uint8Array(value));
            } catch (err) {
                _onFinish(err);
                throw err;
            }
        },
        cancel (reason) {
            _onFinish(reason);
            return iterator.return();
        }
    }, {
        highWaterMark: 2
    });
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"9wnyh":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _dataJs = require("../env/data.js");
var _axiosErrorJs = require("../core/AxiosError.js");
var _axiosErrorJsDefault = parcelHelpers.interopDefault(_axiosErrorJs);
'use strict';
const validators = {};
// eslint-disable-next-line func-names
[
    'object',
    'boolean',
    'number',
    'function',
    'string',
    'symbol'
].forEach((type, i)=>{
    validators[type] = function validator(thing) {
        return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
    };
});
const deprecatedWarnings = {};
/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */ validators.transitional = function transitional(validator, version, message) {
    function formatMessage(opt, desc) {
        return '[Axios v' + (0, _dataJs.VERSION) + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
    }
    // eslint-disable-next-line func-names
    return (value, opt, opts)=>{
        if (validator === false) throw new (0, _axiosErrorJsDefault.default)(formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')), (0, _axiosErrorJsDefault.default).ERR_DEPRECATED);
        if (version && !deprecatedWarnings[opt]) {
            deprecatedWarnings[opt] = true;
            // eslint-disable-next-line no-console
            console.warn(formatMessage(opt, ' has been deprecated since v' + version + ' and will be removed in the near future'));
        }
        return validator ? validator(value, opt, opts) : true;
    };
};
validators.spelling = function spelling(correctSpelling) {
    return (value, opt)=>{
        // eslint-disable-next-line no-console
        console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
        return true;
    };
};
/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */ function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== 'object') throw new (0, _axiosErrorJsDefault.default)('options must be an object', (0, _axiosErrorJsDefault.default).ERR_BAD_OPTION_VALUE);
    const keys = Object.keys(options);
    let i = keys.length;
    while(i-- > 0){
        const opt = keys[i];
        const validator = schema[opt];
        if (validator) {
            const value = options[opt];
            const result = value === undefined || validator(value, opt, options);
            if (result !== true) throw new (0, _axiosErrorJsDefault.default)('option ' + opt + ' must be ' + result, (0, _axiosErrorJsDefault.default).ERR_BAD_OPTION_VALUE);
            continue;
        }
        if (allowUnknown !== true) throw new (0, _axiosErrorJsDefault.default)('Unknown option ' + opt, (0, _axiosErrorJsDefault.default).ERR_BAD_OPTION);
    }
}
exports.default = {
    assertOptions,
    validators
};

},{"../env/data.js":"9SLyZ","../core/AxiosError.js":"7z85x","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"9SLyZ":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "VERSION", ()=>VERSION);
const VERSION = "1.13.2";

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"kSqbX":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _canceledErrorJs = require("./CanceledError.js");
var _canceledErrorJsDefault = parcelHelpers.interopDefault(_canceledErrorJs);
'use strict';
/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */ class CancelToken {
    constructor(executor){
        if (typeof executor !== 'function') throw new TypeError('executor must be a function.');
        let resolvePromise;
        this.promise = new Promise(function promiseExecutor(resolve) {
            resolvePromise = resolve;
        });
        const token = this;
        // eslint-disable-next-line func-names
        this.promise.then((cancel)=>{
            if (!token._listeners) return;
            let i = token._listeners.length;
            while(i-- > 0)token._listeners[i](cancel);
            token._listeners = null;
        });
        // eslint-disable-next-line func-names
        this.promise.then = (onfulfilled)=>{
            let _resolve;
            // eslint-disable-next-line func-names
            const promise = new Promise((resolve)=>{
                token.subscribe(resolve);
                _resolve = resolve;
            }).then(onfulfilled);
            promise.cancel = function reject() {
                token.unsubscribe(_resolve);
            };
            return promise;
        };
        executor(function cancel(message, config, request) {
            if (token.reason) // Cancellation has already been requested
            return;
            token.reason = new (0, _canceledErrorJsDefault.default)(message, config, request);
            resolvePromise(token.reason);
        });
    }
    /**
   * Throws a `CanceledError` if cancellation has been requested.
   */ throwIfRequested() {
        if (this.reason) throw this.reason;
    }
    /**
   * Subscribe to the cancel signal
   */ subscribe(listener) {
        if (this.reason) {
            listener(this.reason);
            return;
        }
        if (this._listeners) this._listeners.push(listener);
        else this._listeners = [
            listener
        ];
    }
    /**
   * Unsubscribe from the cancel signal
   */ unsubscribe(listener) {
        if (!this._listeners) return;
        const index = this._listeners.indexOf(listener);
        if (index !== -1) this._listeners.splice(index, 1);
    }
    toAbortSignal() {
        const controller = new AbortController();
        const abort = (err)=>{
            controller.abort(err);
        };
        this.subscribe(abort);
        controller.signal.unsubscribe = ()=>this.unsubscribe(abort);
        return controller.signal;
    }
    /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */ static source() {
        let cancel;
        const token = new CancelToken(function executor(c) {
            cancel = c;
        });
        return {
            token,
            cancel
        };
    }
}
exports.default = CancelToken;

},{"./CanceledError.js":"9yG1c","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"i5yWF":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>spread);
'use strict';
function spread(callback) {
    return function wrap(arr) {
        return callback.apply(null, arr);
    };
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"2FN3e":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>isAxiosError);
var _utilsJs = require("./../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
'use strict';
function isAxiosError(payload) {
    return (0, _utilsJsDefault.default).isObject(payload) && payload.isAxiosError === true;
}

},{"./../utils.js":"jI6DP","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"7tr76":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
const HttpStatusCode = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511,
    WebServerIsDown: 521,
    ConnectionTimedOut: 522,
    OriginIsUnreachable: 523,
    TimeoutOccurred: 524,
    SslHandshakeFailed: 525,
    InvalidSslCertificate: 526
};
Object.entries(HttpStatusCode).forEach(([key, value])=>{
    HttpStatusCode[value] = key;
});
exports.default = HttpStatusCode;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"g1JuO":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
// --- API Publique ---
parcelHelpers.export(exports, "setupAuthOverlay", ()=>setupAuthOverlay);
parcelHelpers.export(exports, "requireAuth", ()=>requireAuth);
parcelHelpers.export(exports, "showAuth", ()=>showAuth);
var _authManagerJs = require("./authManager.js");
// --- Sélecteurs ---
const UI = {
    overlay: document.getElementById("auth-overlay"),
    login: {
        form: document.getElementById("login-form"),
        card: document.getElementById("login-card"),
        error: document.getElementById("auth-error"),
        switchBtn: document.getElementById("show-login")
    },
    register: {
        form: document.getElementById("register-form"),
        card: document.getElementById("register-card"),
        error: document.getElementById("auth-error-register"),
        switchBtn: document.getElementById("show-register")
    },
    welcome: document.getElementById("auth-welcome")
};
// --- Utilitaires UI ---
const toggleVisible = (el, isVisible)=>el?.classList.toggle("hidden", !isVisible);
const toggleGameBlock = (block)=>{
    const gameContainer = document.getElementById("game-container");
    if (gameContainer) gameContainer.classList.toggle("blocked", block);
};
const updateError = (errorBox, message = "")=>{
    if (!errorBox) return;
    errorBox.textContent = message;
    toggleVisible(errorBox, !!message);
};
const clearAllErrors = ()=>{
    updateError(UI.login.error);
    updateError(UI.register.error);
};
// --- Actions ---
function renderWelcome() {
    if (!UI.welcome) return;
    const profile = (0, _authManagerJs.getProfile)();
    UI.welcome.textContent = profile?.player ? `Connect\xe9 en tant que ${profile.player.username}` : "";
}
async function processAuth(action, event, errorBox) {
    event.preventDefault();
    updateError(errorBox, ""); // Reset erreur
    const data = Object.fromEntries(new FormData(event.target));
    try {
        await action(data);
        renderWelcome();
        toggleVisible(UI.overlay, false);
        toggleGameBlock(false);
        window.dispatchEvent(new CustomEvent("auth:profile-updated"));
    } catch (error) {
        updateError(errorBox, (0, _authManagerJs.handleAuthError)(error));
    }
}
function switchForm(showRegister) {
    toggleVisible(UI.login.card, !showRegister);
    toggleVisible(UI.register.card, showRegister);
    clearAllErrors();
}
function setupAuthOverlay() {
    // Events Submits
    UI.login.form?.addEventListener("submit", (e)=>processAuth((0, _authManagerJs.loginUser), e, UI.login.error));
    UI.register.form?.addEventListener("submit", (e)=>processAuth((0, _authManagerJs.registerUser), e, UI.register.error));
    // Events Toggle
    UI.register.switchBtn?.addEventListener("click", (e)=>(e.preventDefault(), switchForm(true)));
    UI.login.switchBtn?.addEventListener("click", (e)=>(e.preventDefault(), switchForm(false)));
    // État Initial
    if (!(0, _authManagerJs.isAuthenticated)()) {
        toggleVisible(UI.overlay, true);
        toggleGameBlock(true);
    } else (0, _authManagerJs.ensureProfileLoaded)().then(()=>{
        toggleVisible(UI.overlay, false);
        toggleGameBlock(false);
    }).catch(()=>{
        toggleVisible(UI.overlay, true);
        toggleGameBlock(true);
    });
    renderWelcome();
}
const requireAuth = ()=>{
    if (!(0, _authManagerJs.isAuthenticated)()) {
        toggleVisible(UI.overlay, true);
        toggleGameBlock(true);
        return false;
    }
    return true;
};
const showAuth = ()=>{
    toggleVisible(UI.overlay, true);
    toggleGameBlock(true);
};

},{"./authManager.js":"cvKjF","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"fNAJL":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "LeaderboardUI", ()=>LeaderboardUI);
var _leaderboardServiceJs = require("../../services/leaderboardService.js");
class LeaderboardUI extends Phaser.GameObjects.Container {
    constructor(scene, x, y){
        super(scene, x, y);
        this.config = {
            width: 500,
            height: 450,
            accentColor: 0x00eaff,
            rowHeight: 32,
            maxEntries: 8
        };
        this.setupLayout();
        this.loadData();
        this.scene.add.existing(this);
        this.setDepth(200);
    }
    setupLayout() {
        const { width, height, accentColor } = this.config;
        // --- 1. PANNEAU DE FOND ---
        const bg = this.scene.add.graphics();
        // Ombre de profondeur
        bg.fillStyle(0x000000, 0.5);
        bg.fillRoundedRect(10, 10, width, height, 15);
        // Bordure et fond
        bg.fillStyle(0x0d1b2a, 0.95);
        bg.lineStyle(2, accentColor, 1);
        bg.fillRoundedRect(0, 0, width, height, 15);
        bg.strokeRoundedRect(0, 0, width, height, 15);
        // Ligne de séparation header
        bg.lineStyle(1, accentColor, 0.4);
        bg.lineBetween(15, 55, width - 15, 55);
        this.add(bg);
        // --- 2. TITRE ---
        const title = this.scene.add.text(width / 2, 18, "\uD83D\uDCCA CLASSEMENT DES SURVIVANTS", {
            fontSize: "20px",
            fontFamily: "Impact, sans-serif",
            color: "#ffffff",
            letterSpacing: 1
        }).setOrigin(0.5, 0).setShadow(0, 0, "#00eaff", 10);
        this.add(title);
        // --- 3. BOUTON REFRESH ---
        this.refreshBtn = this.scene.add.text(width - 30, 28, "\u21BB", {
            fontSize: "26px",
            color: accentColor,
            fontStyle: "bold"
        }).setOrigin(0.5).setInteractive({
            useHandCursor: true
        });
        this.refreshBtn.on("pointerdown", ()=>this.handleRefresh());
        this.add(this.refreshBtn);
        // --- 4. EN-TÊTE DES COLONNES (ALIGNEMENT FIXE) ---
        const hStyle = {
            fontSize: "11px",
            color: "#7dd0ff",
            fontWeight: "bold",
            fontFamily: "Orbitron, Arial"
        };
        // On définit des X fixes pour chaque colonne
        this.cols = {
            rank: 20,
            player: 65,
            lvl: 185,
            hearts: 275,
            time: width - 20
        };
        this.add([
            this.scene.add.text(this.cols.rank, 65, "RANG", hStyle),
            this.scene.add.text(this.cols.player, 65, "JOUEUR", hStyle),
            this.scene.add.text(this.cols.lvl, 65, "NIV MAX", hStyle),
            this.scene.add.text(this.cols.hearts, 65, "COEURS PERDUS", hStyle),
            this.scene.add.text(this.cols.time, 65, "TEMPS CUMUL\xc9", hStyle).setOrigin(1, 0)
        ]);
        // --- 5. LISTE DES ENTRÉES ---
        this.listContainer = this.scene.add.container(0, 95);
        this.add(this.listContainer);
        this.statusText = this.scene.add.text(width / 2, height / 2 + 30, "", {
            fontSize: "14px",
            color: "#ffffff",
            fontFamily: "Courier New"
        }).setOrigin(0.5);
        this.add(this.statusText);
    }
    async handleRefresh() {
        this.scene.tweens.add({
            targets: this.refreshBtn,
            angle: 360,
            duration: 500,
            onComplete: ()=>{
                this.refreshBtn.angle = 0;
                this.loadData();
            }
        });
    }
    async loadData() {
        try {
            this.listContainer.removeAll(true);
            this.statusText.setText("CHARGEMENT DES DONN\xc9ES...");
            const entries = await (0, _leaderboardServiceJs.fetchLeaderboard)();
            this.statusText.setText("");
            this.renderEntries(entries);
        } catch (err) {
            this.statusText.setText("ERREUR DE SYNCHRONISATION");
        }
    }
    renderEntries(entries) {
        if (!entries || entries.length === 0) {
            this.statusText.setText("AUCUN SURVIVANT R\xc9PERTORI\xc9");
            return;
        }
        entries.slice(0, this.config.maxEntries).forEach((entry, idx)=>{
            const y = idx * this.config.rowHeight;
            const isFirst = idx === 0;
            const color = isFirst ? "#ffd700" : "#ffffff";
            const row = this.scene.add.container(0, y);
            // Fond de ligne alterné
            const rowBg = this.scene.add.graphics();
            rowBg.fillStyle(0xffffff, idx % 2 === 0 ? 0.03 : 0);
            rowBg.fillRect(10, -5, this.config.width - 20, 28);
            row.add(rowBg);
            // 1. RANG (01, 02...)
            const rank = (idx + 1).toString().padStart(2, '0');
            const rankTxt = this.scene.add.text(this.cols.rank, 0, rank, {
                fontSize: "13px",
                fontFamily: "Courier New",
                color: color,
                fontWeight: isFirst ? "bold" : "normal"
            });
            // 2. JOUEUR
            const name = (entry.username || "Inconnu").substring(0, 12);
            const nameTxt = this.scene.add.text(this.cols.player, 0, name, {
                fontSize: "13px",
                fontFamily: "Arial",
                color: color
            });
            // 3. NIV MAX
            const lvlTxt = this.scene.add.text(this.cols.lvl, 0, `${entry.max_level || 0}`, {
                fontSize: "13px",
                fontFamily: "Courier New",
                color: color
            });
            // 4. COEURS PERDUS (Icône + nombre + "perdu")
            const heartsCount = entry.total_lives_lost || 0;
            const heartsContainer = this.scene.add.container(this.cols.hearts, 0);
            const heartIcon = this.scene.add.text(0, -1, "\u2764\uFE0F", {
                fontSize: "12px"
            });
            const heartValue = this.scene.add.text(18, 0, `${heartsCount}`, {
                fontSize: "12px",
                fontFamily: "Arial",
                color: color
            });
            heartsContainer.add([
                heartIcon,
                heartValue
            ]);
            // 5. TEMPS CUMULÉ
            const timeStr = this.formatTime(entry.total_time_ms);
            const timeTxt = this.scene.add.text(this.cols.time, 0, timeStr, {
                fontSize: "13px",
                fontFamily: "Courier New",
                color: "#00eaff"
            }).setOrigin(1, 0);
            row.add([
                rankTxt,
                nameTxt,
                lvlTxt,
                heartsContainer,
                timeTxt
            ]);
            this.listContainer.add(row);
            // Animation d'apparition
            row.alpha = 0;
            row.x = -15;
            this.scene.tweens.add({
                targets: row,
                alpha: 1,
                x: 0,
                duration: 300,
                delay: idx * 40
            });
        });
    }
    formatTime(ms) {
        if (!ms || ms <= 0) return "0:00";
        const sec = Math.floor(ms / 1000);
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }
}

},{"../../services/leaderboardService.js":"2zhl5","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"2zhl5":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "fetchLeaderboard", ()=>fetchLeaderboard);
var _apiClientJs = require("./apiClient.js");
async function fetchLeaderboard() {
    const response = await (0, _apiClientJs.apiClient).get("/api/player/leaderboard");
    return response.data?.entries || [];
}

},{"./apiClient.js":"eiuF4","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"cwcYt":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "HeroUpgradeUI", ()=>HeroUpgradeUI);
var _authManagerJs = require("../../services/authManager.js");
var _authOverlayJs = require("../../services/authOverlay.js");
class HeroUpgradeUI extends Phaser.GameObjects.Container {
    constructor(scene, x, y){
        super(scene, x, y);
        // --- Configuration du Design ---
        this.config = {
            width: 380,
            height: 300,
            padding: 20,
            accentColor: 0x00eaff,
            bgColor: 0x050a10,
            rowHeight: 55,
            avatarSize: 80
        };
        this.statElements = new Map(); // Pour stocker les références proprement
        this.setupMainPanel();
        this.refresh();
        this.scene.add.existing(this);
        this.setDepth(180);
    }
    setupMainPanel() {
        const { width, height, padding, accentColor, bgColor } = this.config;
        // 1. Fond avec bordure néon et dégradé
        const bg = this.scene.add.graphics();
        bg.fillStyle(bgColor, 0.9);
        bg.lineStyle(2, accentColor, 1);
        bg.fillRoundedRect(0, 0, width, height, 15);
        bg.strokeRoundedRect(0, 0, width, height, 15);
        // Petite barre décorative en haut
        bg.lineStyle(4, accentColor, 0.5);
        bg.lineBetween(width * 0.3, 0, width * 0.7, 0);
        this.add(bg);
        // 2. Titre stylisé
        const title = this.scene.add.text(width / 2, -15, " SYST\xc8ME H\xc9ROS ", {
            fontFamily: "Impact, sans-serif",
            fontSize: "24px",
            color: "#ffffff",
            backgroundColor: "#050a10",
            padding: {
                x: 10,
                y: 2
            }
        }).setOrigin(0.5);
        this.add(title);
        // 3. Section Avatar (à gauche)
        this.createAvatar(padding, 40);
        // 4. Section Stats (à droite de l'avatar)
        const statsData = [
            {
                key: "hp",
                label: "INT\xc9GRIT\xc9 (PV)",
                color: 0x4caf50
            },
            {
                key: "damage",
                label: "PUISSANCE",
                color: 0xff4d4d
            },
            {
                key: "move_speed",
                label: "AGILIT\xc9",
                color: 0x00eaff
            }
        ];
        const statsStartX = padding + this.config.avatarSize + 25; // Espace après l'avatar
        statsData.forEach((stat, idx)=>{
            this.createStatRow(stat, statsStartX, 60 + idx * this.config.rowHeight);
        });
        // 5. Footer (Points & Coût)
        this.pointsText = this.scene.add.text(width / 2, height - 50, "", {
            fontSize: "16px",
            fontFamily: "Orbitron, sans-serif",
            color: "#7dd0ff",
            fontWeight: "bold"
        }).setOrigin(0.5);
        this.costText = this.scene.add.text(width / 2, height - 25, "", {
            fontSize: "11px",
            fontFamily: "Arial",
            color: "#aaaaaa"
        }).setOrigin(0.5);
        this.add([
            this.pointsText,
            this.costText
        ]);
    }
    createAvatar(x, y) {
        const size = this.config.avatarSize;
        const container = this.scene.add.container(x, y);
        const frame = this.scene.add.graphics();
        // Ombre/Glow de l'avatar
        frame.lineStyle(2, this.config.accentColor, 0.5);
        frame.strokeRect(-2, -2, size + 4, size + 4);
        // Fond de l'avatar
        frame.fillStyle(0x1a2a3a, 1);
        frame.fillRect(0, 0, size, size);
        // Dessiner le héros comme dans Hero.js (version réduite)
        const scale = size / 50; // Facteur d'échelle pour adapter au format avatar
        const centerX = size / 2;
        const centerY = size / 2;
        // Ombre au sol
        frame.fillStyle(0x000000, 0.18);
        frame.fillEllipse(centerX, centerY + 18 * scale, 26 * scale, 10 * scale);
        // Cape
        frame.fillStyle(0x151526, 0.92);
        frame.fillEllipse(centerX - 2 * scale, centerY + 8 * scale, 22 * scale, 30 * scale);
        frame.fillStyle(0x0d0d18, 0.35);
        frame.fillEllipse(centerX - 6 * scale, centerY + 10 * scale, 14 * scale, 24 * scale);
        // Armure (corps)
        frame.fillStyle(0x505050, 1);
        frame.fillRoundedRect(centerX - 12 * scale, centerY - 18 * scale, 24 * scale, 34 * scale, 7 * scale);
        frame.lineStyle(2 * scale, 0x242424, 1);
        frame.strokeRoundedRect(centerX - 12 * scale, centerY - 18 * scale, 24 * scale, 34 * scale, 7 * scale);
        // Plastron
        frame.lineStyle(2 * scale, 0x6a6a6a, 0.6);
        frame.beginPath();
        frame.moveTo(centerX, centerY - 16 * scale);
        frame.lineTo(centerX, centerY + 10 * scale);
        frame.strokePath();
        // Épaulières
        frame.fillStyle(0x7a7a7a, 1);
        frame.fillCircle(centerX - 11 * scale, centerY - 12 * scale, 7 * scale);
        frame.fillCircle(centerX + 11 * scale, centerY - 12 * scale, 7 * scale);
        frame.lineStyle(2 * scale, 0x2a2a2a, 0.9);
        frame.strokeCircle(centerX - 11 * scale, centerY - 12 * scale, 7 * scale);
        frame.strokeCircle(centerX + 11 * scale, centerY - 12 * scale, 7 * scale);
        // Ceinture
        frame.fillStyle(0x8b5a2b, 1);
        frame.fillRoundedRect(centerX - 12 * scale, centerY + 6 * scale, 24 * scale, 5 * scale, 2 * scale);
        frame.fillStyle(0xd2b48c, 0.9);
        frame.fillRect(centerX - 2 * scale, centerY + 6 * scale, 4 * scale, 5 * scale);
        // Tête (comme dans Hero.js)
        frame.fillStyle(0xffd4a3, 1);
        frame.fillCircle(centerX, centerY - 24 * scale, 8 * scale);
        // Casque / cheveux
        frame.fillStyle(0x2b2b2b, 1);
        frame.fillRoundedRect(centerX - 10 * scale, centerY - 33 * scale, 20 * scale, 8 * scale, 3 * scale);
        // Yeux (regard)
        frame.fillStyle(0x111111, 0.9);
        frame.fillCircle(centerX - 3.2 * scale, centerY - 24 * scale, 1.1 * scale);
        frame.fillCircle(centerX + 3.2 * scale, centerY - 24 * scale, 1.1 * scale);
        // Épée (comme dans Hero.js) - utiliser un container pour la rotation
        const swordPivotX = centerX + 12 * scale;
        const swordPivotY = centerY - 4 * scale;
        const swordPivot = this.scene.add.container(swordPivotX, swordPivotY);
        swordPivot.setRotation(-0.3);
        const sword = this.scene.add.graphics();
        // Lame (avec petit highlight)
        sword.fillStyle(0xd6d6d6, 1);
        sword.fillRoundedRect(0, -2 * scale, 22 * scale, 5 * scale, 2 * scale);
        sword.fillStyle(0xffffff, 0.75);
        sword.fillRoundedRect(0, -2 * scale, 22 * scale, 2.2 * scale, 2 * scale);
        // Pointe
        sword.fillStyle(0xcfcfcf, 1);
        sword.fillTriangle(22 * scale, -2 * scale, 28 * scale, 0.5 * scale, 22 * scale, 3 * scale);
        // Garde
        sword.fillStyle(0x6b3d18, 1);
        sword.fillRoundedRect(-4 * scale, -4.2 * scale, 6 * scale, 9 * scale, 2 * scale);
        // Poignée
        sword.fillStyle(0x8b4513, 1);
        sword.fillRoundedRect(-8 * scale, -2.5 * scale, 5 * scale, 6 * scale, 2 * scale);
        sword.fillStyle(0x3b2210, 0.55);
        sword.fillRect(-7.2 * scale, -2.2 * scale, 3.5 * scale, 0.8 * scale);
        sword.fillRect(-7.2 * scale, -0.6 * scale, 3.5 * scale, 0.8 * scale);
        sword.fillRect(-7.2 * scale, 1.0 * scale, 3.5 * scale, 0.8 * scale);
        // Pommeau
        sword.fillStyle(0xbdbdbd, 1);
        sword.fillCircle(-9.2 * scale, 0.5 * scale, 2.2 * scale);
        swordPivot.add(sword);
        container.add(swordPivot);
        container.add(frame);
        this.add(container);
    }
    createStatRow(stat, x, y) {
        const barWidth = 180;
        // Label de la stat
        const label = this.scene.add.text(x, y - 20, stat.label, {
            fontSize: "11px",
            fontWeight: "bold",
            color: "#ffffff",
            letterSpacing: 1
        });
        // Valeur numérique
        const valText = this.scene.add.text(x + barWidth, y - 20, "0", {
            fontSize: "12px",
            color: "#00eaff"
        }).setOrigin(1, 0);
        // Texte de conversion (ex: "+0.4 par point")
        const conversionText = this.scene.add.text(x, y + 15, "", {
            fontSize: "9px",
            color: "#7dd0ff",
            fontStyle: "italic"
        });
        // Fond de la barre (vaisseau)
        const barBg = this.scene.add.graphics();
        barBg.fillStyle(0xffffff, 0.1);
        barBg.fillRoundedRect(x, y, barWidth, 10, 5);
        // Barre de progression (le remplissage)
        const barFill = this.scene.add.graphics();
        // Bouton "+" stylisé
        const btn = this.scene.add.container(x + barWidth + 25, y + 5);
        const btnBg = this.scene.add.circle(0, 0, 12, 0x00eaff, 0.2).setStrokeStyle(1, 0x00eaff);
        const btnPlus = this.scene.add.text(0, 0, "+", {
            fontSize: "18px",
            color: "#00eaff"
        }).setOrigin(0.5);
        btn.add([
            btnBg,
            btnPlus
        ]);
        btn.setSize(24, 24).setInteractive({
            useHandCursor: true
        });
        btn.on("pointerover", ()=>btnBg.setFillStyle(0x00eaff, 0.5));
        btn.on("pointerout", ()=>btnBg.setFillStyle(0x00eaff, 0.2));
        btn.on("pointerdown", ()=>this.handleUpgrade(stat.key));
        this.statElements.set(stat.key, {
            label,
            valText,
            barFill,
            conversionText,
            color: stat.color,
            x,
            y,
            barWidth
        });
        this.add([
            label,
            valText,
            conversionText,
            barBg,
            barFill,
            btn
        ]);
    }
    async handleUpgrade(key) {
        if (!(0, _authManagerJs.isAuthenticated)()) return (0, _authOverlayJs.showAuth)();
        try {
            this.scene.cameras.main.shake(100, 0.002); // Petit feedback visuel
            await (0, _authManagerJs.upgradeHero)(key, 1);
            this.refresh();
        } catch (err) {
            console.error("\xc9chec upgrade:", err);
        }
    }
    refresh() {
        const stats = (0, _authManagerJs.getHeroStats)();
        const available = (0, _authManagerJs.getHeroPointsAvailable)();
        const conversion = (0, _authManagerJs.getHeroPointConversion)();
        if (!stats) {
            this.pointsText.setText("SYNCHRONISATION REQUISE");
            return;
        }
        const values = {
            hp: Number(stats.max_hp) || 0,
            damage: parseFloat(stats.base_damage) || 0,
            move_speed: Number(stats.move_speed) || 0
        };
        // Mapping des clés vers les noms de conversion
        const conversionMap = {
            hp: "hp_per_point",
            damage: "damage_per_point",
            move_speed: "move_speed_per_point"
        };
        // Mise à jour des barres avec animation
        this.statElements.forEach((el, key)=>{
            const val = values[key];
            // Formater les dégâts avec 2 décimales si c'est une valeur décimale
            const displayVal = key === "damage" && val % 1 !== 0 ? val.toFixed(2) : Math.round(val).toString();
            el.valText.setText(displayVal);
            // Afficher la conversion pour chaque stat
            const conversionKey = conversionMap[key];
            const conversionValue = conversion?.[conversionKey];
            if (conversionValue !== undefined && el.conversionText) {
                const formattedValue = parseFloat(conversionValue).toFixed(2);
                el.conversionText.setText(`+${formattedValue} par point`);
            }
            // Calcul du pourcentage (ex: max 500 pour le visuel)
            const targetScale = Phaser.Math.Clamp(val / 500, 0.1, 1);
            // Animation fluide de la barre
            this.scene.tweens.addCounter({
                from: el.barFill.scaleX || 0,
                to: targetScale,
                duration: 600,
                ease: 'Cubic.out',
                onUpdate: (tween)=>{
                    el.barFill.clear();
                    el.barFill.fillStyle(el.color, 1);
                    el.barFill.fillRoundedRect(el.x, el.y, el.barWidth * tween.getValue(), 10, 5);
                }
            });
        });
        this.pointsText.setText(`POINTS DISPONIBLES : ${available}`);
        this.costText.setText(`1 point am\xe9liore chaque stat selon sa conversion`);
    }
}

},{"../../services/authManager.js":"cvKjF","../../services/authOverlay.js":"g1JuO","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"hLiDk":[function(require,module,exports,__globalThis) {
module.exports = module.bundle.resolve("background.4281a5ae.jpg");

},{}],"bDbTi":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "GameScene", ()=>GameScene);
var _settingsJs = require("../config/settings.js");
var _indexJs = require("../config/levels/index.js");
var _enemyJs = require("../objects/Enemy.js");
var _turretJs = require("../objects/Turret.js");
var _barracksJs = require("../objects/Barracks.js");
var _heroJs = require("../objects/Hero.js");
var _mapManagerJs = require("./managers/MapManager.js");
var _waveManagerJs = require("./managers/WaveManager.js");
var _uimanagerJs = require("./managers/UIManager.js");
var _inputManagerJs = require("./managers/InputManager.js");
var _spellManagerJs = require("./managers/SpellManager.js");
var _textureFactoryJs = require("./managers/TextureFactory.js");
var _authManagerJs = require("../services/authManager.js");
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
        this.heroStats = data.heroStats || null;
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
        this.spawnControls = null;
        this.hero = null;
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
        this.isTimerRunning = false;
        this.heroKillCount = 0;
        this.heroKillReportPromise = null;
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
        this.waveManager.initSpawnControls();
        this.enemies = this.add.group({
            runChildUpdate: true
        });
        this.soldiers = this.add.group({
            runChildUpdate: true
        });
        const heroSpawnTile = this.findHeroSpawnTile();
        this.hero = new (0, _heroJs.Hero)(this, heroSpawnTile.x, heroSpawnTile.y, this.heroStats);
        this.soldiers.add(this.hero);
        this.uiManager.createUI();
        this.uiManager.updateTimer(this.elapsedTimeMs);
        this.updateUI(); // Initialiser l'affichage des vagues
        this.inputManager.setHero(this.hero);
        this.inputManager.setupInputHandlers();
        this.events.on("enemy-killed", this.handleEnemyKilled, this);
    }
    // Calculer le layout pour centrer correctement
    calculateLayout() {
        this.gameWidth = this.scale.width;
        this.gameHeight = this.scale.height;
        this.baseWidth = this.game.baseWidth || (0, _settingsJs.CONFIG).GAME_WIDTH;
        this.baseHeight = this.game.baseHeight || (0, _settingsJs.CONFIG).GAME_HEIGHT;
        const mapSize = 15 * (0, _settingsJs.CONFIG).TILE_SIZE;
        // Réduire les marges pour maximiser l'espace de la map
        const padding = Math.max(8, Math.min(this.gameWidth, this.gameHeight) * 0.008);
        // Largeur minimale et maximale pour les sidebars (pour éviter qu'elles soient trop petites ou trop grandes)
        const minSidebarWidth = 180;
        const maxSidebarWidth = 320;
        const targetSidebarWidth = Math.max(minSidebarWidth, Math.min(maxSidebarWidth, this.gameWidth * 0.15));
        // Calculer d'abord la taille de la map en fonction de l'espace disponible
        const usableHeight = this.gameHeight - padding * 2;
        // Espace central estimé (on va l'ajuster après)
        const estimatedCenterWidth = this.gameWidth - 2 * targetSidebarWidth - 2 * padding;
        const scaleByHeight = usableHeight / mapSize;
        const scaleByWidth = estimatedCenterWidth / mapSize;
        this.scaleFactor = Phaser.Math.Clamp(Math.min(scaleByHeight, scaleByWidth), 0.6, 2);
        this.mapPixelSize = mapSize * this.scaleFactor;
        // Centrer la map horizontalement dans l'écran
        this.mapOffsetX = (this.gameWidth - this.mapPixelSize) / 2;
        this.mapOffsetY = padding + (usableHeight - this.mapPixelSize) / 2;
        // Stocker les offsets pour utilisation dans createMap
        this.mapStartX = this.mapOffsetX;
        this.mapStartY = this.mapOffsetY;
        // Sidebars qui s'étirent jusqu'à la map (pas de largeur fixe)
        // Sidebar gauche : de padding jusqu'à mapOffsetX
        this.toolbarOffsetX = padding;
        this.toolbarWidth = this.mapOffsetX - padding;
        // Sidebar droite : de (mapOffsetX + mapPixelSize) jusqu'à (gameWidth - padding)
        this.rightToolbarOffsetX = this.mapOffsetX + this.mapPixelSize;
        this.rightToolbarWidth = this.gameWidth - padding - this.rightToolbarOffsetX;
        // Les sidebars prennent toute la hauteur de l'écran pour remplir l'espace
        this.toolbarHeight = this.gameHeight;
        // Les sidebars commencent en haut de l'écran (y = 0) pour s'étirer jusqu'en bas
        this.toolbarOffsetY = 0;
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
            width: this.rightToolbarWidth,
            height: this.toolbarHeight
        };
    }
    // Gérer le redimensionnement
    handleResize() {
        // Phaser gère le scaling via FIT : seules les références d'UI doivent rester centrées
        this.gameWidth = this.scale.width;
        this.gameHeight = this.scale.height;
        if (this.uiManager?.hud?.reposition) this.uiManager.hud.reposition();
        if (this.uiManager?.buildToolbar?.reposition) this.uiManager.buildToolbar.reposition();
        if (this.resumeBtn) this.resumeBtn.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);
    }
    update(time, delta) {
        // Si le jeu est en pause, ne rien mettre à jour
        if (this.isPaused) return;
        if (this.isTimerRunning) this.elapsedTimeMs += delta;
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
        this.waveManager.spawnControls?.clearCountdown();
        this.waveManager.startWave();
    }
    startSessionTimer() {
        this.isTimerRunning = true;
    }
    monitorWaveEnd() {
        this.waveManager.monitorWaveEnd();
    }
    finishWave() {
        this.waveManager.finishWave();
    }
    levelComplete() {
        this.reportHeroKillsOnce();
        this.waveManager.levelComplete();
    }
    handleEnemyKilled(payload) {
        if (payload?.source === "hero") this.heroKillCount += 1;
    }
    reportHeroKillsOnce() {
        if (this.heroKillCount <= 0) return null;
        if (this.heroKillReportPromise) return this.heroKillReportPromise;
        const killsToReport = this.heroKillCount;
        this.heroKillCount = 0;
        this.heroKillReportPromise = (0, _authManagerJs.recordHeroKill)(killsToReport).catch(()=>{});
        return this.heroKillReportPromise;
    }
    // =========================================================
    // GESTION CLICS & MENUS
    // =========================================================
    findHeroSpawnTile() {
        const map = this.levelConfig.map || [];
        const pathTypes = [
            1,
            4,
            7
        ];
        let baseTile = null;
        for(let y = 0; y < map.length; y++){
            for(let x = 0; x < map[y].length; x++)if (map[y][x] === 2) {
                baseTile = {
                    x,
                    y
                };
                break;
            }
            if (baseTile) break;
        }
        if (baseTile) {
            const dirs = [
                {
                    x: 1,
                    y: 0
                },
                {
                    x: -1,
                    y: 0
                },
                {
                    x: 0,
                    y: 1
                },
                {
                    x: 0,
                    y: -1
                }
            ];
            for (const d of dirs){
                const nx = baseTile.x + d.x;
                const ny = baseTile.y + d.y;
                if (ny >= 0 && ny < map.length && nx >= 0 && nx < map[ny].length) {
                    if (pathTypes.includes(map[ny][nx])) return {
                        x: nx,
                        y: ny
                    };
                }
            }
        }
        if (this.levelConfig.paths?.[0]?.length) {
            const lastPoint = this.levelConfig.paths[0][this.levelConfig.paths[0].length - 1];
            return {
                x: lastPoint.x,
                y: lastPoint.y
            };
        }
        return {
            x: 0,
            y: 0
        };
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
        if (this.lives <= 0) this.showGameOverNotification();
    }
    showGameOverNotification() {
        // Mettre le jeu en pause
        this.isPaused = true;
        this.reportHeroKillsOnce();
        const bg = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, 500 * this.scaleFactor, 300 * this.scaleFactor, 0x000000, 0.9).setDepth(200);
        const txt = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 30 * this.scaleFactor, "PERDU !", {
            fontSize: `${Math.max(30, 50 * this.scaleFactor)}px`,
            color: "#ff0000",
            fontStyle: "bold",
            fontFamily: "Arial"
        }).setOrigin(0.5).setDepth(201);
        const sub = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 50 * this.scaleFactor, "Cliquez pour retourner au menu", {
            fontSize: `${Math.max(16, 24 * this.scaleFactor)}px`,
            color: "#ffffff",
            fontFamily: "Arial"
        }).setOrigin(0.5).setDepth(201);
        bg.setInteractive({
            useHandCursor: true
        }).on("pointerdown", ()=>{
            this.scene.start("MainMenuScene");
        });
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
        else {
            // Repositionner au centre au cas où la taille de l'écran a changé
            this.resumeBtn.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);
            this.resumeBtn.setVisible(true);
        }
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
        // Utiliser le centre de la caméra pour un centrage parfait
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        this.resumeBtn = this.add.container(centerX, centerY).setDepth(1000);
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
        try {
            this.events?.off("enemy-killed", this.handleEnemyKilled, this);
        } catch (e) {}
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
            if (this.hero) {
                try {
                    if (this.hero.corpseTimerEvent) this.hero.corpseTimerEvent.remove();
                    if (this.hero.corpseContainer) this.hero.corpseContainer.destroy();
                    this.hero.destroy();
                } catch (e) {}
                this.hero = null;
            }
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
        try {
            this.spawnControls?.destroy();
        } catch (e) {
        // ignore
        }
        this.spawnControls = null;
    }
}

},{"../config/settings.js":"9kTMs","../config/levels/index.js":"8fcfE","../objects/Enemy.js":"hW1Gp","../objects/Turret.js":"lbJGU","../objects/Barracks.js":"bSlQd","./managers/MapManager.js":"bYbwC","./managers/WaveManager.js":"bbCRa","./managers/UIManager.js":"1XDfq","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT","./managers/InputManager.js":"9HXrx","./managers/SpellManager.js":"WA9IR","./managers/TextureFactory.js":"bSv7j","../objects/Hero.js":"bdQ7o","../services/authManager.js":"cvKjF"}],"9kTMs":[function(require,module,exports,__globalThis) {
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
    playerDamage: 1,
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

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"k54Ru":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "runner", ()=>runner);
const runner = {
    name: "Scout",
    speed: 205,
    hp: 105,
    reward: 20,
    playerDamage: 1,
    color: 0xffd166,
    damage: 8,
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
    playerDamage: 4,
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
    playerDamage: 2,
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
    range: 100,
    damage: 10,
    rate: 290,
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
    damage: 158,
    rate: 2200,
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
    range: 110,
    damage: 72,
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
    playerDamage: 4,
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
    playerDamage: 2,
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
                count: 24,
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
            },
            {
                count: 1,
                type: "shield",
                interval: 1500,
                startDelay: 3000
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
                count: 12,
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
                count: 8,
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
                count: 68,
                type: "grunt",
                interval: 700,
                startDelay: 0
            },
            {
                count: 36,
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

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"hW1Gp":[function(require,module,exports,__globalThis) {
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
        // Système de lanes plus réactif - pas de collision, juste évitement visuel
        this.laneOffset = (Math.random() - 0.5) * 12;
        this.targetLaneOffset = this.laneOffset;
        this.avoidanceRadius = 32; // Distance à partir de laquelle on commence à éviter
        this.minDistance = 20; // Distance minimale souhaitée entre ennemis
        this.maxLaneWidth = 20;
        // Vitesses de réaction
        this.laneChangeSpeed = 0.15; // Plus rapide pour éviter les blocages
        this.tangentSmoothSpeed = 0.35;
        this.previousTangent = null;
        this.isParalyzed = false;
        this.paralysisTimer = null;
        this.paralysisPosition = null; // Position où l'ennemi a été paralysé
        this.isInShell = false;
        this.isInvulnerable = false;
        this.shellThreshold = this.stats.shellThreshold || null;
        this.lastHealTime = 0;
        this.healInterval = this.stats.healInterval || null;
        this.lastSpawnTime = 0;
        // Pour la variation de vitesse fluide
        this.speedMultiplier = 1.0;
        this.targetSpeedMultiplier = 1.0;
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
        if (this.path) {
            this.pathLength = this.path.getLength();
            this.previousTangent = this.calculateTangent(0);
        }
    }
    calculateTangent(t) {
        const epsilon = 0.002;
        const t1 = Math.max(0, t - epsilon);
        const t2 = Math.min(1, t + epsilon);
        const p1 = this.path.getPoint(t1);
        const p2 = this.path.getPoint(t2);
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len > 0.001) return {
            x: dx / len,
            y: dy / len
        };
        return {
            x: 1,
            y: 0
        };
    }
    update(time, delta) {
        if (!this.active || !this.scene || this.isInShell || this.scene.isPaused) return;
        // Si paralysé, maintenir la position et ne rien faire d'autre
        if (this.isParalyzed) {
            if (this.paralysisPosition) // Forcer l'ennemi à rester à sa position de paralysie
            this.setPosition(this.paralysisPosition.x, this.paralysisPosition.y);
            return;
        }
        // Toujours calculer l'évitement, même si bloqué par un soldat
        this.calculateAvoidance(delta);
        if (this.isMoving && !this.isBlocked && this.path) this.handleMovement(delta);
        this.handleSpecialAbilities(time);
        this.updateCombat(time);
        if (this.hpTooltip && this.hpTooltip.active) {
            this.hpTooltip.setPosition(this.x, this.y - 60);
            this.refreshHpTooltip();
        }
        if (this.stats.onUpdateAnimation) this.stats.onUpdateAnimation(time, this);
    }
    calculateAvoidance(delta) {
        if (!this.scene?.enemies) return;
        let avoidanceLeft = 0;
        let avoidanceRight = 0;
        let slowDown = false;
        const neighbors = this.scene.enemies.getChildren();
        for (const other of neighbors){
            if (other === this || !other.active) continue;
            const dx = this.x - other.x;
            const dy = this.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            // Si trop proche, on s'écarte sur les côtés
            if (dist < this.avoidanceRadius && dist > 0.1) {
                // Calculer de quel côté l'autre ennemi se trouve
                if (this.previousTangent) {
                    const normalX = -this.previousTangent.y;
                    const normalY = this.previousTangent.x;
                    // Produit scalaire pour savoir si c'est à gauche ou droite
                    const side = dx * normalX + dy * normalY;
                    const strength = (this.avoidanceRadius - dist) / this.avoidanceRadius;
                    if (side > 0) avoidanceRight += strength;
                    else avoidanceLeft += strength;
                }
                // Ralentir si collision frontale imminente
                const progressDiff = other.progress - this.progress;
                if (progressDiff > 0 && progressDiff < 0.015 && dist < this.minDistance) slowDown = true;
            }
        }
        // Décision d'évitement : aller du côté opposé
        if (avoidanceLeft > avoidanceRight) this.targetLaneOffset += avoidanceLeft * 3.0;
        else if (avoidanceRight > avoidanceLeft) this.targetLaneOffset -= avoidanceRight * 3.0;
        // Retour progressif au centre si pas d'évitement nécessaire
        if (avoidanceLeft === 0 && avoidanceRight === 0) this.targetLaneOffset *= 0.95;
        // Ajustement de vitesse fluide pour éviter les blocages
        if (slowDown) this.targetSpeedMultiplier = 0.4;
        else this.targetSpeedMultiplier = 1.0;
        // Lissage de la vitesse
        this.speedMultiplier = Phaser.Math.Linear(this.speedMultiplier, this.targetSpeedMultiplier, 0.1);
        // Clamp de l'offset
        this.targetLaneOffset = Phaser.Math.Clamp(this.targetLaneOffset, -this.maxLaneWidth, this.maxLaneWidth);
        // Application progressive de l'offset
        this.laneOffset = Phaser.Math.Linear(this.laneOffset, this.targetLaneOffset, this.laneChangeSpeed);
    }
    handleMovement(delta) {
        if (!this.pathLength) return;
        // Vitesse de base modulée par le multiplicateur fluide
        const effectiveSpeed = this.speed * this.speedMultiplier;
        const step = effectiveSpeed * (delta / 1000) / this.pathLength;
        this.progress += step;
        if (this.progress >= 1) {
            this.progress = 1;
            this.reachEnd();
            return;
        }
        this.updatePositionOnPath();
        this.updateFacingDirection();
        this.setDepth(10 + Math.floor(this.y / 10));
    }
    updatePositionOnPath() {
        const currentPoint = this.path.getPoint(this.progress);
        // Lookahead pour anticiper les virages
        const lookAheadDist = 0.01;
        const lookAhead = Math.min(this.progress + lookAheadDist, 1);
        let tangent;
        if (lookAhead > this.progress) {
            const lookAheadPoint = this.path.getPoint(lookAhead);
            const dx = lookAheadPoint.x - currentPoint.x;
            const dy = lookAheadPoint.y - currentPoint.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len > 0.001) tangent = {
                x: dx / len,
                y: dy / len
            };
            else tangent = this.calculateTangent(this.progress);
        } else tangent = this.calculateTangent(this.progress);
        // Lissage de la tangente
        if (this.previousTangent) {
            tangent.x = Phaser.Math.Linear(this.previousTangent.x, tangent.x, this.tangentSmoothSpeed);
            tangent.y = Phaser.Math.Linear(this.previousTangent.y, tangent.y, this.tangentSmoothSpeed);
            // Re-normalisation
            const len = Math.sqrt(tangent.x * tangent.x + tangent.y * tangent.y);
            if (len > 0.001) {
                tangent.x /= len;
                tangent.y /= len;
            }
        }
        this.previousTangent = {
            ...tangent
        };
        // Normale pour l'offset latéral
        const normalX = -tangent.y;
        const normalY = tangent.x;
        // Position finale avec offset
        const finalX = currentPoint.x + normalX * this.laneOffset;
        const finalY = currentPoint.y + normalY * this.laneOffset;
        this.setPosition(finalX, finalY);
    }
    updateFacingDirection() {
        if (this.stats.shouldRotate === false || !this.bodyGroup || !this.previousTangent) return;
        const threshold = 0.15;
        if (this.previousTangent.x > threshold && !this.facingRight) {
            this.facingRight = true;
            this.bodyGroup.setScale(1, 1);
        } else if (this.previousTangent.x < -threshold && this.facingRight) {
            this.facingRight = false;
            this.bodyGroup.setScale(-1, 1);
        }
    }
    reachEnd() {
        if (this.active && this.scene) {
            if (this.scene.takeDamage) this.scene.takeDamage(this.playerDamage);
            this.destroy();
        }
    }
    damage(amount, metadata = {}) {
        if (this.isInvulnerable || !this.active) return;
        this.lastDamageSource = metadata?.source || null;
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
        if (this.targetSoldier?.active && (this.targetSoldier.isAlive || this.targetSoldier.hp > 0)) {
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
        if (!this.scene?.soldiers) return;
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
        if (this.stats.onUpdateAnimation) return;
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
        const radius = this.stats.healRadiusPixels || this.stats.healRadius || 100;
        this.scene.enemies.getChildren().forEach((e)=>{
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
        if (this.isBlocked && this.blockedBy?.releaseEnemy) this.blockedBy.releaseEnemy();
        if (this.stats.onDeath) this.stats.onDeath(this);
        if (this.scene.earnMoney) this.scene.earnMoney(this.stats.reward || 10);
        if (this.scene?.events) this.scene.events.emit("enemy-killed", {
            source: this.lastDamageSource || null
        });
        this.explode();
        this.destroy();
    }
    explode() {
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
    paralyze(duration) {
        if (!this.active || !this.scene) return;
        // Annuler toute paralysie précédente
        if (this.paralysisTimer) {
            this.paralysisTimer.remove();
            this.paralysisTimer = null;
        }
        // Sauvegarder la position actuelle où l'ennemi est paralysé
        this.paralysisPosition = {
            x: this.x,
            y: this.y
        };
        // Mettre l'ennemi en état de paralysie
        this.isParalyzed = true;
        // Arrêter le mouvement
        this.isMoving = false;
        // Si l'ennemi était bloqué par un soldat, le libérer
        if (this.isBlocked && this.blockedBy) {
            this.isBlocked = false;
            if (this.blockedBy.releaseEnemy) this.blockedBy.releaseEnemy();
            this.blockedBy = null;
        }
        // Créer un timer pour libérer l'ennemi après la durée spécifiée
        this.paralysisTimer = this.scene.time.delayedCall(duration, ()=>{
            if (this.active) {
                this.isParalyzed = false;
                this.paralysisPosition = null;
                this.isMoving = true; // Reprendre le mouvement
                this.paralysisTimer = null;
            }
        });
    }
    destroy(fromScene) {
        if (this.paralysisTimer) {
            this.paralysisTimer.remove();
            this.paralysisTimer = null;
        }
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
        // Régénération de PV
        this.lastCombatTime = 0; // Temps du dernier combat
        this.regenTimer = null; // Timer pour la régénération
        this.regenDelay = 3000; // 3 secondes avant de commencer à régénérer
        this.regenAmount = 10; // 10 PV par seconde
        this.regenInterval = 1000; // Toutes les secondes
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
        // Mettre à jour le temps du dernier combat
        this.lastCombatTime = this.scene.time.now;
        // Arrêter la régénération si elle est active
        this.stopRegeneration();
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
        // Mettre à jour le temps du dernier combat pour démarrer le délai de régénération
        this.lastCombatTime = this.scene.time.now;
    }
    // Démarrer la régénération
    startRegeneration() {
        if (this.regenTimer || !this.scene || !this.scene.time) return;
        if (!this.isAlive || this.hp >= this.maxHp) return;
        this.regenTimer = this.scene.time.addEvent({
            delay: this.regenInterval,
            callback: ()=>{
                if (!this.isAlive || this.hp >= this.maxHp) {
                    this.stopRegeneration();
                    return;
                }
                // Vérifier si on est toujours hors combat
                const timeSinceCombat = this.scene.time.now - this.lastCombatTime;
                if (timeSinceCombat < this.regenDelay) // Pas encore assez de temps depuis le dernier combat
                return;
                // Régénérer 10 PV
                const oldHp = this.hp;
                this.hp = Math.min(this.maxHp, this.hp + this.regenAmount);
                // Mettre à jour la barre de vie et le tooltip
                this.updateHealthBar();
                if (this.hpTooltip) this.hpTooltip.setText(this.getHpTooltipText());
            },
            loop: true
        });
    }
    // Arrêter la régénération
    stopRegeneration() {
        if (this.regenTimer) {
            this.regenTimer.remove();
            this.regenTimer = null;
        }
    }
    // Prendre des dégâts
    takeDamage(amount) {
        this.hp -= amount;
        // Mettre à jour le temps du dernier combat
        this.lastCombatTime = this.scene.time.now;
        // Arrêter la régénération si elle est active
        this.stopRegeneration();
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
        this.stopRegeneration();
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
        if (!this.isAlive || !this.scene) return;
        // Vérifier si un ennemi passe à proximité
        if (!this.blockingEnemy) {
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
        // Gérer la régénération de PV
        if (!this.blockingEnemy && this.hp < this.maxHp) {
            const timeSinceCombat = this.scene.time.now - this.lastCombatTime;
            // Si 3 secondes se sont écoulées depuis le dernier combat, démarrer la régénération
            if (timeSinceCombat >= this.regenDelay) {
                if (!this.regenTimer) this.startRegeneration();
            }
        } else // En combat, arrêter la régénération
        if (this.regenTimer) this.stopRegeneration();
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
var _spawnWaveControlsJs = require("./SpawnWaveControls.js");
var _settingsJs = require("../../config/settings.js");
var _authManagerJs = require("../../services/authManager.js");
class WaveManager {
    constructor(scene){
        this.scene = scene;
        this.spawnControls = null;
    }
    initSpawnControls() {
        this.spawnControls = new (0, _spawnWaveControlsJs.SpawnWaveControls)(this.scene);
        this.scene.spawnControls = this.spawnControls;
        this.spawnControls.create();
    }
    getNextWaveSummary() {
        const wave = this.scene.levelConfig?.waves?.[this.scene.currentWaveIndex] || null;
        if (!wave) return [];
        const counts = {};
        wave.forEach((group)=>{
            if (!group?.type || !group.count) return;
            counts[group.type] = (counts[group.type] || 0) + group.count;
        });
        return Object.entries(counts).map(([type, count])=>({
                type,
                count
            })).sort((a, b)=>b.count - a.count);
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
        this.spawnControls?.setLockedState(true);
        this.spawnControls?.clearCountdown();
        this.spawnControls?.updateWaveRunningState();
        if (!this.scene.isTimerRunning) this.scene.startSessionTimer();
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
        else {
            this.spawnControls?.setLockedState(false);
            this.spawnControls?.updateWaveRunningState();
            // Démarrer le timer automatique de 30 secondes
            this.startNextWaveCountdown();
        }
    }
    startNextWaveCountdown() {
        // Annuler un timer existant si présent
        if (this.scene.nextWaveAutoTimer) this.scene.nextWaveAutoTimer.remove();
        this.scene.nextWaveCountdown = 30; // 30 secondes
        this.spawnControls?.showCountdown(this.scene.nextWaveCountdown);
        // Mettre à jour le bouton toutes les secondes
        this.scene.nextWaveAutoTimer = this.scene.time.addEvent({
            delay: 1000,
            repeat: 30,
            callback: ()=>{
                // Ne pas décrémenter si le jeu est en pause
                if (this.scene.isPaused) return;
                this.scene.nextWaveCountdown--;
                this.spawnControls?.showCountdown(this.scene.nextWaveCountdown);
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
    levelComplete() {
        this.spawnControls?.destroy();
        this.scene.spawnControls = null;
        this.spawnControls = null;
        const completionPayload = {
            levelId: this.scene.levelID,
            completionTimeMs: Math.round(this.scene.elapsedTimeMs || 0),
            livesRemaining: this.scene.lives,
            wavesCompleted: this.scene.currentWaveIndex + 1,
            moneyEarned: this.scene.money,
            starsEarned: this.scene.lives === (0, _settingsJs.CONFIG).STARTING_LIVES ? 3 : 1,
            isPerfectRun: this.scene.lives === (0, _settingsJs.CONFIG).STARTING_LIVES
        };
        (0, _authManagerJs.recordLevelCompletion)(completionPayload).catch(()=>{});
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

},{"../../objects/Enemy.js":"hW1Gp","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT","./SpawnWaveControls.js":"dP5UP","../../config/settings.js":"9kTMs","../../services/authManager.js":"cvKjF"}],"dP5UP":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "SpawnWaveControls", ()=>SpawnWaveControls);
var _settingsJs = require("../../config/settings.js");
class SpawnWaveControls {
    constructor(scene){
        this.scene = scene;
        this.icons = [];
        this.tooltip = null;
        this.isLocked = false;
    }
    create() {
        this.destroy();
        const spawnTiles = this.getSpawnTiles();
        spawnTiles.forEach((spawn, index)=>{
            this.icons.push(this.createIcon(spawn, index + 1));
        });
    }
    destroy() {
        this.hideWavePreview();
        this.icons.forEach((icon)=>icon.container.destroy());
        this.icons = [];
    }
    getSpawnTiles() {
        const paths = this.scene.levelConfig?.paths || (this.scene.levelConfig?.path ? [
            this.scene.levelConfig.path
        ] : []);
        const unique = new Map();
        paths.forEach((points)=>{
            if (!points?.length) return;
            const start = points[0];
            const key = `${start.x},${start.y}`;
            if (!unique.has(key)) {
                const next = points[1] || start;
                const angle = Math.atan2(next.y - start.y, next.x - start.x);
                unique.set(key, {
                    tileX: start.x,
                    tileY: start.y,
                    angle
                });
            }
        });
        return Array.from(unique.values());
    }
    createIcon(spawn, index) {
        const s = this.scene.scaleFactor;
        const T = (0, _settingsJs.CONFIG).TILE_SIZE * s;
        // Positionnement au centre de la tuile
        const px = this.scene.mapStartX + spawn.tileX * T + T / 2;
        const py = this.scene.mapStartY + spawn.tileY * T + T / 2;
        // Taille réduite (environ 35px au lieu de 45-50px)
        const size = Math.max(32 * s, T * 0.35);
        // Profondeur très élevée pour être au-dessus de TOUT (les tuiles sont à depth 0, UI à 200-300)
        const container = this.scene.add.container(px, py).setDepth(2000);
        // Cercle de fond style Cyber
        const bg = this.scene.add.circle(0, 0, size, 0x0b0b12, 0.9);
        bg.setStrokeStyle(2 * s, 0x00ffc2, 1);
        // Flèche / Triangle (Pointe vers la droite par défaut)
        const arrow = this.scene.add.graphics();
        this.drawArrow(arrow, 0x00ffc2, size * 0.55);
        arrow.setRotation(spawn.angle);
        // Petit badge avec le numéro du chemin
        const badge = this.scene.add.container(-size * 0.75, -size * 0.75);
        const badgeBg = this.scene.add.circle(0, 0, size * 0.35, 0x00ffc2);
        const badgeText = this.scene.add.text(0, 0, index, {
            fontSize: `${11 * s}px`,
            color: "#000",
            fontStyle: "bold"
        }).setOrigin(0.5);
        badge.add([
            badgeBg,
            badgeText
        ]);
        // Texte Countdown sous l'icône
        const countdownText = this.scene.add.text(0, size + 12 * s, "", {
            fontSize: `${13 * s}px`,
            color: "#00ffc2",
            fontStyle: "bold",
            stroke: "#000",
            strokeThickness: 2
        }).setOrigin(0.5);
        container.add([
            bg,
            arrow,
            badge,
            countdownText
        ]);
        // Zone d'interaction - utiliser un rectangle qui couvre tout le cercle
        // Le cercle a un rayon de 'size', on crée un rectangle carré qui le couvre complètement
        const hitSize = size * 2.2; // Assez grand pour couvrir tout le cercle et plus
        // Définir la taille du container (utilisé par setInteractive sans paramètres)
        container.setSize(hitSize, hitSize);
        // Utiliser setInteractive sans paramètres pour utiliser la zone définie par setSize
        // Cela garantit que la zone est bien centrée sur le container
        container.setInteractive();
        if (container.input) container.input.cursor = "pointer";
        // Forcer le container au-dessus de tous les autres objets
        container.bringToTop();
        // EVENTS
        container.on("pointerover", ()=>{
            if (this.scene.isWaveRunning) return;
            container.setScale(1.1);
            this.drawArrow(arrow, 0xffffff, size * 0.6);
            this.showWavePreview(container);
        });
        container.on("pointermove", ()=>{
        // Le gestionnaire InputManager vérifie déjà si on est sur un bouton
        // Pas besoin de stopPropagation (n'existe pas dans Phaser)
        });
        container.on("pointerout", ()=>{
            container.setScale(1.0);
            this.drawArrow(arrow, 0x00ffc2, size * 0.55);
            this.hideWavePreview();
        });
        container.on("pointerdown", ()=>{
            if (this.isLocked || this.scene.isWaveRunning) return;
            this.scene.startWave();
            this.hideWavePreview();
        });
        return {
            container,
            bg,
            arrow,
            countdownText,
            size
        };
    }
    drawArrow(graphics, color, sz) {
        graphics.clear();
        graphics.fillStyle(color, 1);
        // Triangle pointant vers la droite (0°)
        const points = [
            {
                x: -sz * 0.4,
                y: -sz * 0.5
            },
            {
                x: -sz * 0.4,
                y: sz * 0.5
            },
            {
                x: sz * 0.6,
                y: 0
            }
        ];
        graphics.fillPoints(points, true);
    }
    showWavePreview(anchor) {
        this.hideWavePreview();
        const summary = this.scene.waveManager.getNextWaveSummary();
        if (!summary || summary.length === 0) return;
        const s = this.scene.scaleFactor;
        const rowHeight = 55 * s;
        const width = 180 * s;
        const height = summary.length * rowHeight + 15 * s;
        // Obtenir les coordonnées mondiales du container (centre de l'icône)
        let iconWorldX, iconWorldY;
        if (anchor.getWorldTransformMatrix) {
            const matrix = anchor.getWorldTransformMatrix();
            iconWorldX = matrix.tx;
            iconWorldY = matrix.ty;
        } else {
            // Fallback si getWorldTransformMatrix n'existe pas
            iconWorldX = anchor.x;
            iconWorldY = anchor.y;
        }
        // Calculer la position Y du tooltip (au-dessus de l'icône)
        let targetY = iconWorldY - height / 2 - 50 * s;
        // S'assurer que le tooltip ne dépasse pas le haut de l'écran
        const minY = height / 2 + 10 * s;
        if (targetY < minY) // Si trop haut, placer le tooltip en dessous de l'icône
        targetY = iconWorldY + height / 2 + 50 * s;
        // S'assurer que le tooltip ne dépasse pas le bas de l'écran
        const maxY = (this.scene.gameHeight || this.scene.cameras.main.height) - height / 2 - 10 * s;
        if (targetY > maxY) targetY = maxY;
        // Clamp la position X pour rester dans l'écran (centré sur l'icône)
        const targetX = Phaser.Math.Clamp(iconWorldX, width / 2 + 10 * s, (this.scene.gameWidth || this.scene.cameras.main.width) - width / 2 - 10 * s);
        this.tooltip = this.scene.add.container(targetX, targetY).setDepth(1000);
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x0c0c15, 0.95);
        bg.lineStyle(2 * s, 0x00ffc2, 1);
        bg.fillRoundedRect(-width / 2, -height / 2, width, height, 10);
        bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 10);
        this.tooltip.add(bg);
        summary.forEach((item, idx)=>{
            const y = -height / 2 + idx * rowHeight + rowHeight / 2;
            const preview = this.createEnemyPreview(item.type);
            preview.setPosition(-width / 2 + 35 * s, y);
            const txt = this.scene.add.text(-width / 2 + 75 * s, y, `x${item.count}`, {
                fontSize: `${20 * s}px`,
                color: "#ffffff",
                fontStyle: "bold"
            }).setOrigin(0, 0.5);
            this.tooltip.add([
                preview,
                txt
            ]);
        });
    }
    createEnemyPreview(typeKey) {
        const container = this.scene.add.container(0, 0);
        const s = this.scene.scaleFactor;
        const enemyDef = (0, _settingsJs.ENEMIES)[typeKey];
        const circle = this.scene.add.circle(0, 0, 22 * s, 0x1a1a2e).setStrokeStyle(1, 0x00ffc2, 0.5);
        container.add(circle);
        if (enemyDef?.onDraw) {
            const iconG = this.scene.add.container(0, 0);
            enemyDef.onDraw(this.scene, iconG, enemyDef.color || 0xffffff, {
                shouldRotate: false
            });
            iconG.setScale(0.85 * s); // Ennemis bien visibles
            container.add(iconG);
        }
        return container;
    }
    hideWavePreview() {
        if (this.tooltip) {
            this.tooltip.destroy(true);
            this.tooltip = null;
        }
    }
    setLockedState(isLocked) {
        this.isLocked = isLocked;
        this.updateWaveRunningState();
    }
    updateWaveRunningState() {
        const isRunning = this.scene.isWaveRunning;
        this.icons.forEach((icon)=>{
            if (isRunning) {
                icon.container.setAlpha(0.05); // Presque invisible pendant la vague
                icon.container.disableInteractive();
                icon.countdownText.setText("");
            } else {
                icon.container.setAlpha(this.isLocked ? 0.5 : 1);
                if (!this.isLocked) {
                    const hitSize = icon.size * 2.2; // Même zone d'interaction qu'à la création
                    icon.container.setSize(hitSize, hitSize);
                    // Utiliser setInteractive sans paramètres pour utiliser la zone définie par setSize
                    icon.container.setInteractive();
                    if (icon.container.input) icon.container.input.cursor = "pointer";
                } else icon.container.disableInteractive();
            }
        });
    }
    clearCountdown() {
        this.icons.forEach((icon)=>{
            icon.countdownText.setText("");
        });
    }
    showCountdown(seconds) {
        if (this.scene.isWaveRunning) return;
        this.icons.forEach((icon)=>{
            if (seconds > 0) {
                icon.countdownText.setText(`${seconds}s`);
                // Alerte visuelle quand il reste peu de temps
                icon.countdownText.setColor(seconds <= 5 ? "#ff3333" : "#00ffc2");
            } else icon.countdownText.setText("");
        });
    }
}

},{"../../config/settings.js":"9kTMs","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"1XDfq":[function(require,module,exports,__globalThis) {
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
        // Essayer d'abord avec levelConfig
        if (this.scene.levelConfig && this.scene.levelConfig.waves && Array.isArray(this.scene.levelConfig.waves)) totalWaves = this.scene.levelConfig.waves.length;
        else {
            // Fallback: chercher dans LEVELS_CONFIG
            const levelData = (0, _indexJs.LEVELS_CONFIG).find((l)=>l.id === this.scene.levelID);
            if (levelData && levelData.data && levelData.data.waves && Array.isArray(levelData.data.waves)) totalWaves = levelData.data.waves.length;
            else {
                // Fallback final selon le levelID
                if (this.scene.levelID === 3) totalWaves = 10;
                else if (this.scene.levelID === 2) totalWaves = 8;
                else totalWaves = 6; // Level 1 par défaut
            }
        }
        // S'assurer que totalWaves est au moins 1
        if (totalWaves < 1) totalWaves = 1;
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
        // Les sidebars commencent en haut (y=0) mais le contenu est aligné avec la map
        const toolbarY = this.scene.toolbarOffsetY || 0;
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
        // Augmenter l'espacement vertical pour que ce soit plus beau
        const verticalSpacing = Math.min(turretGridHeight / rows, itemSpacing + padding * 1.5);
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
    reposition() {
        if (!this.leftColumn || !this.leftBg) return;
        const columnWidth = this.scene.toolbarWidth;
        const columnHeight = this.scene.toolbarHeight;
        this.leftColumn.setPosition(this.scene.toolbarOffsetX, this.scene.toolbarOffsetY);
        // Redessiner le fond pour la nouvelle largeur/hauteur
        this.leftBg.clear();
        this.leftBg.fillStyle(0x0a0a10, 0.92);
        this.leftBg.fillRoundedRect(0, 0, columnWidth, columnHeight, 14);
        this.leftBg.lineStyle(2, 0x00ccff, 0.35);
        this.leftBg.strokeRoundedRect(0, 0, columnWidth, columnHeight, 14);
        // Mettre à jour le cache des limites pour la détection des clics
        this.scene.leftToolbarBounds = {
            x: this.scene.toolbarOffsetX,
            y: this.scene.toolbarOffsetY,
            width: columnWidth,
            height: columnHeight
        };
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
    description: "Sort puissant qui fait tomber un \xe9clair destructeur.\n\n\u2705 Avantages:\n\u2022 D\xe9g\xe2ts massifs (350)\n\u2022 Zone d'effet (touche plusieurs ennemis)\n\u2022 Paralysie les ennemis survivants (3.5s)\n\n\u274C Inconv\xe9nients:\n\u2022 Cooldown tr\xe8s long (100 secondes)\n\u2022 N\xe9cessite un placement pr\xe9cis\n\u2022 Zone d'effet limit\xe9e"
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
        // Ajouter le nom de la tourelle
        const nameText = scene.add.text(0, -itemSize / 2 - 8 * scene.scaleFactor, item.config.name || item.key, {
            fontSize: `${Math.max(11, 13 * scene.scaleFactor)}px`,
            fill: "#9edcff",
            fontFamily: "Arial",
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
            priceText,
            nameText
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
        // Utiliser la largeur spécifique de la sidebar droite (qui s'étire jusqu'à la map)
        const columnWidth = this.scene.rightToolbarWidth || this.scene.toolbarWidth;
        const columnHeight = this.scene.toolbarHeight;
        const padding = 18 * s;
        const fontSize = Math.max(16, 20 * s);
        const smallFontSize = Math.max(12, 16 * s);
        const startX = this.scene.rightToolbarOffsetX;
        // Les sidebars commencent en haut (y=0) pour s'étirer sur toute la hauteur
        const startY = this.scene.toolbarOffsetY || 0;
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
        const buttonWidth = columnWidth - padding * 2;
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
        // Utiliser la largeur spécifique de la sidebar droite (qui s'étire jusqu'à la map)
        const columnWidth = this.scene.rightToolbarWidth || this.scene.toolbarWidth;
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
        this.hero = null;
    }
    setUIManager(uiManager) {
        this.uiManager = uiManager;
        this.dragHandler.uiManager = uiManager;
    }
    setHero(hero) {
        this.hero = hero;
    }
    setupInputHandlers() {
        this.scene.input.on("pointermove", (pointer)=>{
            // Vérifier si le pointeur est sur un bouton de vague
            if (this.scene.spawnControls) {
                const hitButton = this.scene.spawnControls.icons.some((icon)=>{
                    if (!icon.container || !icon.container.input || !icon.container.active) return false;
                    // Obtenir les coordonnées mondiales du container
                    let containerWorldX, containerWorldY;
                    if (icon.container.getWorldTransformMatrix) {
                        const matrix = icon.container.getWorldTransformMatrix();
                        containerWorldX = matrix.tx;
                        containerWorldY = matrix.ty;
                    } else {
                        containerWorldX = icon.container.x;
                        containerWorldY = icon.container.y;
                    }
                    // Calculer les coordonnées locales
                    const localX = pointer.worldX - containerWorldX;
                    const localY = pointer.worldY - containerWorldY;
                    // Utiliser la taille définie par setSize pour vérifier si on est dans la zone
                    const hitSize = icon.size * 2.2;
                    const halfSize = hitSize / 2;
                    // Vérifier si on est dans le rectangle centré
                    return localX >= -halfSize && localX <= halfSize && localY >= -halfSize && localY <= halfSize;
                });
                if (hitButton) {
                    // Si on est sur un bouton, ne pas afficher le highlight de tuile
                    if (this.tileHighlight) this.tileHighlight.setVisible(false);
                    return;
                }
            }
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
    handleNormalClick(pointer) {
        // Ne pas déplacer le héros si on est en train de placer un sort
        if (this.spellManager && this.spellManager.isPlacingSpell()) return;
        const T = (0, _settingsJs.CONFIG).TILE_SIZE * this.scene.scaleFactor;
        if (pointer.worldY < this.scene.mapStartY || pointer.worldY > this.scene.mapStartY + 15 * T || pointer.worldX < this.scene.mapStartX || pointer.worldX > this.scene.mapStartX + 15 * T) return;
        const tx = Math.floor((pointer.worldX - this.scene.mapStartX) / T);
        const ty = Math.floor((pointer.worldY - this.scene.mapStartY) / T);
        if (tx < 0 || tx >= 15 || ty < 0 || ty >= 15) return;
        const tileType = this.scene.levelConfig.map[ty][tx];
        // Commande du héros par clic gauche sur un chemin
        if (this.hero && this.isPathTile(tileType)) {
            this.hero.setDestination(tx, ty);
            return;
        }
    }
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
    isPathTile(tileType) {
        return tileType === 1 || tileType === 4 || tileType === 7;
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

},{"../../config/settings.js":"9kTMs","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"bdQ7o":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Hero", ()=>Hero);
var _settingsJs = require("../config/settings.js");
const PATH_TYPES = [
    1,
    4,
    7
];
class Hero extends Phaser.GameObjects.Container {
    constructor(scene, tileX, tileY, stats = {}){
        const s = scene.scaleFactor || 1;
        const T = (0, _settingsJs.CONFIG).TILE_SIZE * s;
        const startX = scene.mapStartX + tileX * T + T / 2;
        const startY = scene.mapStartY + tileY * T + T / 2;
        super(scene, startX, startY);
        this.scene = scene;
        // --- Stats ---
        this.maxHp = stats.max_hp ?? 230;
        this.hp = this.maxHp;
        this.damage = stats.base_damage ?? 25;
        this.attackInterval = stats.attack_interval_ms ?? 1200;
        this.moveSpeed = (stats.move_speed ?? 100) * s;
        // --- State ---
        this.isAlive = true;
        this.blockingEnemy = null;
        this.targetPath = [];
        this.currentPathIndex = 0;
        this.lastAttackTime = 0;
        this.corpseTimerEvent = null;
        this.corpseContainer = null;
        // --- Régénération automatique ---
        this.lastDamageTime = scene?.time?.now || 0; // Temps du dernier dégât reçu
        this.regenTimer = null; // Timer pour la régénération
        this.regenDelay = 5000; // 5 secondes avant de commencer à régénérer
        this.regenPercent = 0.03; // 3% de la vie max
        this.regenInterval = 1000; // Toutes les 1 seconde
        // --- Visual / Layout (un peu plus gros + mieux lisible) ---
        this.baseScale = 1.05; // <- rend le héros un peu plus gros
        this.visualScale = this.baseScale * s;
        this.bodyGroup = scene.add.container(0, 0);
        this.add(this.bodyGroup);
        // Épée séparée pour mieux animer
        this.swordGroup = scene.add.container(0, 0);
        this.add(this.swordGroup);
        // Effets
        this.hpBar = this.scene.add.graphics();
        this.add(this.hpBar);
        this.swordTrail = this.scene.add.graphics();
        this.swordTrail.setDepth(3);
        this.add(this.swordTrail);
        this.hitSpark = this.scene.add.graphics();
        this.hitSpark.setDepth(4);
        this.add(this.hitSpark);
        // Draw
        this.drawBody();
        this.drawSword();
        this.drawHealthBar();
        scene.add.existing(this);
        // Hitbox (un chouïa plus grosse aussi)
        this.setDepth(40);
        this.setSize(56, 56);
        this.setScale(this.visualScale);
        // Tooltip HP - définir une zone interactive
        this.hpTooltip = null;
        this.setInteractive({
            useHandCursor: false
        });
        this.on("pointerover", ()=>{
            if (this.active && this.isAlive) this.showHpTooltip();
        });
        this.on("pointerout", ()=>this.hideHpTooltip());
    }
    // -----------------------------
    // Drawing
    // -----------------------------
    drawBody() {
        const s = this.scene.scaleFactor || 1;
        const k = this.baseScale; // appliqué déjà par setScale, mais utile pour proportions internes
        this.bodyGroup.removeAll(true);
        const g = this.scene.add.graphics();
        // Ombre au sol (ça donne du volume)
        g.fillStyle(0x000000, 0.18);
        g.fillEllipse(0, 18 * s * k, 26 * s * k, 10 * s * k);
        // Cape (plus stylée)
        g.fillStyle(0x151526, 0.92);
        g.fillEllipse(-2 * s * k, 8 * s * k, 22 * s * k, 30 * s * k);
        g.fillStyle(0x0d0d18, 0.35);
        g.fillEllipse(-6 * s * k, 10 * s * k, 14 * s * k, 24 * s * k);
        // Armure (corps)
        g.fillStyle(0x505050, 1);
        g.fillRoundedRect(-12 * s * k, -18 * s * k, 24 * s * k, 34 * s * k, 7 * s * k);
        g.lineStyle(2 * s * k, 0x242424, 1);
        g.strokeRoundedRect(-12 * s * k, -18 * s * k, 24 * s * k, 34 * s * k, 7 * s * k);
        // Plastron (détail)
        g.lineStyle(2 * s * k, 0x6a6a6a, 0.6);
        g.beginPath();
        g.moveTo(0, -16 * s * k);
        g.lineTo(0, 10 * s * k);
        g.strokePath();
        // Épaulières
        g.fillStyle(0x7a7a7a, 1);
        g.fillCircle(-11 * s * k, -12 * s * k, 7 * s * k);
        g.fillCircle(11 * s * k, -12 * s * k, 7 * s * k);
        g.lineStyle(2 * s * k, 0x2a2a2a, 0.9);
        g.strokeCircle(-11 * s * k, -12 * s * k, 7 * s * k);
        g.strokeCircle(11 * s * k, -12 * s * k, 7 * s * k);
        // Ceinture
        g.fillStyle(0x8b5a2b, 1);
        g.fillRoundedRect(-12 * s * k, 6 * s * k, 24 * s * k, 5 * s * k, 2 * s * k);
        g.fillStyle(0xd2b48c, 0.9);
        g.fillRect(-2 * s * k, 6 * s * k, 4 * s * k, 5 * s * k);
        // Tête
        g.fillStyle(0xffd4a3, 1);
        g.fillCircle(0, -24 * s * k, 8 * s * k);
        // Casque / cheveux
        g.fillStyle(0x2b2b2b, 1);
        g.fillRoundedRect(-10 * s * k, -33 * s * k, 20 * s * k, 8 * s * k, 3 * s * k);
        // Petit “regard” (vite fait mais ça donne de la vie)
        g.fillStyle(0x111111, 0.9);
        g.fillCircle(-3.2 * s * k, -24 * s * k, 1.1 * s * k);
        g.fillCircle(3.2 * s * k, -24 * s * k, 1.1 * s * k);
        this.bodyGroup.add(g);
    }
    drawSword() {
        const s = this.scene.scaleFactor || 1;
        const k = this.baseScale;
        this.swordGroup.removeAll(true);
        // Pivot de l’épée (pour animer comme un vrai swing)
        this.swordPivot = this.scene.add.container(12 * s * k, -4 * s * k);
        this.swordPivot.setRotation(-0.3);
        const sword = this.scene.add.graphics();
        // Lame (avec petit highlight)
        sword.fillStyle(0xd6d6d6, 1);
        sword.fillRoundedRect(0, -2 * s * k, 22 * s * k, 5 * s * k, 2 * s * k);
        sword.fillStyle(0xffffff, 0.75);
        sword.fillRoundedRect(0, -2 * s * k, 22 * s * k, 2.2 * s * k, 2 * s * k);
        // Pointe
        sword.fillStyle(0xcfcfcf, 1);
        sword.fillTriangle(22 * s * k, -2 * s * k, 28 * s * k, 0.5 * s * k, 22 * s * k, 3 * s * k);
        // Garde
        sword.fillStyle(0x6b3d18, 1);
        sword.fillRoundedRect(-4 * s * k, -4.2 * s * k, 6 * s * k, 9 * s * k, 2 * s * k);
        // Poignée
        sword.fillStyle(0x8b4513, 1);
        sword.fillRoundedRect(-8 * s * k, -2.5 * s * k, 5 * s * k, 6 * s * k, 2 * s * k);
        sword.fillStyle(0x3b2210, 0.55);
        sword.fillRect(-7.2 * s * k, -2.2 * s * k, 3.5 * s * k, 0.8 * s * k);
        sword.fillRect(-7.2 * s * k, -0.6 * s * k, 3.5 * s * k, 0.8 * s * k);
        sword.fillRect(-7.2 * s * k, 1.0 * s * k, 3.5 * s * k, 0.8 * s * k);
        // Pommeau
        sword.fillStyle(0xbdbdbd, 1);
        sword.fillCircle(-9.2 * s * k, 0.5 * s * k, 2.2 * s * k);
        this.swordPivot.add(sword);
        this.swordGroup.add(this.swordPivot);
    }
    drawHealthBar() {
        const s = this.scene.scaleFactor || 1;
        const k = this.baseScale;
        const pct = Phaser.Math.Clamp(this.hp / this.maxHp, 0, 1);
        const width = 56 * s * k;
        const height = 7 * s * k;
        const y = -50 * s * k;
        this.hpBar.clear();
        // Fond
        this.hpBar.fillStyle(0x000000, 0.75);
        this.hpBar.fillRoundedRect(-width / 2, y, width, height, 3 * s * k);
        // Bord plus visible
        this.hpBar.lineStyle(2 * s * k, 0xffffff, 0.4);
        this.hpBar.strokeRoundedRect(-width / 2, y, width, height, 3 * s * k);
        // Barre
        const col = pct < 0.3 ? 0xff3b30 : pct < 0.6 ? 0xffc107 : 0x4caf50;
        this.hpBar.fillStyle(col, 1);
        this.hpBar.fillRoundedRect(-width / 2 + 1.2 * s * k, y + 1.2 * s * k, (width - 2.4 * s * k) * pct, height - 2.4 * s * k, 3 * s * k);
    }
    showHpTooltip() {
        if (!this.active || !this.isAlive) return;
        if (this.hpTooltip) this.hpTooltip.destroy();
        const fontSize = Math.max(14, 16 * (this.scene.scaleFactor || 1));
        this.hpTooltip = this.scene.add.text(this.x, this.y - 70, this.getHpTooltipText(), {
            fontSize: `${fontSize}px`,
            fill: "#ffffff",
            fontStyle: "bold",
            backgroundColor: "#000000",
            padding: {
                x: 10,
                y: 6
            }
        }).setOrigin(0.5).setDepth(300);
        // Mettre à jour la position du tooltip en continu
        if (this.tooltipUpdateTimer) this.tooltipUpdateTimer.remove();
        this.tooltipUpdateTimer = this.scene.time.addEvent({
            delay: 50,
            callback: ()=>{
                if (this.hpTooltip && this.active && this.isAlive) {
                    this.hpTooltip.setPosition(this.x, this.y - 70);
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
    // -----------------------------
    // Grid / Pathfinding
    // -----------------------------
    getCurrentTile() {
        const T = (0, _settingsJs.CONFIG).TILE_SIZE * (this.scene.scaleFactor || 1);
        const tx = Math.floor((this.x - this.scene.mapStartX) / T);
        const ty = Math.floor((this.y - this.scene.mapStartY) / T);
        return {
            x: Phaser.Math.Clamp(tx, 0, 14),
            y: Phaser.Math.Clamp(ty, 0, 14)
        };
    }
    isPathTile(tx, ty) {
        const row = this.scene.levelConfig.map[ty];
        if (!row) return false;
        return PATH_TYPES.includes(row[tx]);
    }
    findPath(start, goal) {
        if (!this.isPathTile(goal.x, goal.y)) return null;
        const key = (p)=>`${p.x},${p.y}`;
        const queue = [
            start
        ];
        const cameFrom = new Map();
        cameFrom.set(key(start), null);
        const dirs = [
            {
                x: 1,
                y: 0
            },
            {
                x: -1,
                y: 0
            },
            {
                x: 0,
                y: 1
            },
            {
                x: 0,
                y: -1
            }
        ];
        while(queue.length > 0){
            const current = queue.shift();
            if (current.x === goal.x && current.y === goal.y) break;
            for (const d of dirs){
                const nx = current.x + d.x;
                const ny = current.y + d.y;
                if (nx < 0 || nx > 14 || ny < 0 || ny > 14) continue;
                if (!this.isPathTile(nx, ny)) continue;
                const nk = key({
                    x: nx,
                    y: ny
                });
                if (!cameFrom.has(nk)) {
                    cameFrom.set(nk, current);
                    queue.push({
                        x: nx,
                        y: ny
                    });
                }
            }
        }
        if (!cameFrom.has(key(goal))) return null;
        const path = [];
        let cur = goal;
        while(cur){
            path.push(cur);
            cur = cameFrom.get(key(cur));
        }
        return path.reverse();
    }
    setDestination(tileX, tileY) {
        if (!this.isAlive) return false;
        const start = this.getCurrentTile();
        const path = this.findPath(start, {
            x: tileX,
            y: tileY
        });
        if (!path || path.length === 0) return false;
        const T = (0, _settingsJs.CONFIG).TILE_SIZE * (this.scene.scaleFactor || 1);
        this.targetPath = path.map((p)=>({
                x: this.scene.mapStartX + p.x * T + T / 2,
                y: this.scene.mapStartY + p.y * T + T / 2
            }));
        this.currentPathIndex = 0;
        // Si on donne une nouvelle destination pendant le combat, libérer l'ennemi
        if (this.blockingEnemy) this.releaseEnemy();
        return true;
    }
    // -----------------------------
    // Update / Movement / Combat
    // -----------------------------
    update(time, delta) {
        const now = time ?? this.scene?.time?.now ?? 0;
        const dt = delta ?? this.scene?.game?.loop?.delta ?? 16;
        if (!this.isAlive || this.scene.isPaused) return;
        // Toujours permettre le déplacement, même en combat
        this.followPath(dt);
        // Gérer le combat si on a un ennemi bloqué
        if (this.blockingEnemy) {
            if (!this.blockingEnemy.active || this.blockingEnemy.hp <= 0) this.releaseEnemy();
            else {
                // Vérifier la distance avec l'ennemi - si on s'est trop éloigné, le libérer
                const dist = Phaser.Math.Distance.Between(this.x, this.y, this.blockingEnemy.x, this.blockingEnemy.y);
                if (dist > 50) // Si on s'est éloigné de plus de 50 pixels, libérer l'ennemi
                this.releaseEnemy();
                else // Sinon, continuer à attaquer
                this.tryAttack(now);
            }
        } else // Si on n'est pas en combat, vérifier si on peut engager un ennemi
        this.checkForEnemyEngage();
        // Gérer la régénération automatique
        this.handleRegeneration(now);
    }
    handleRegeneration(now) {
        if (!this.isAlive || this.hp >= this.maxHp) {
            this.stopRegeneration();
            return;
        }
        // Si en combat, arrêter la régénération
        if (this.blockingEnemy) {
            this.stopRegeneration();
            return;
        }
        // Vérifier si 5 secondes se sont écoulées depuis le dernier dégât
        const timeSinceDamage = now - this.lastDamageTime;
        if (timeSinceDamage >= this.regenDelay) // Démarrer la régénération si elle n'est pas déjà active
        {
            if (!this.regenTimer) this.startRegeneration();
        } else // Pas encore assez de temps, arrêter la régénération si elle est active
        if (this.regenTimer) this.stopRegeneration();
    }
    startRegeneration() {
        if (this.regenTimer || !this.scene || !this.scene.time) return;
        if (!this.isAlive || this.hp >= this.maxHp) return;
        this.regenTimer = this.scene.time.addEvent({
            delay: this.regenInterval,
            callback: ()=>{
                if (!this.isAlive || this.hp >= this.maxHp) {
                    this.stopRegeneration();
                    return;
                }
                // Vérifier si on est toujours hors combat et si assez de temps s'est écoulé
                const timeSinceDamage = this.scene.time.now - this.lastDamageTime;
                if (timeSinceDamage < this.regenDelay || this.blockingEnemy) {
                    this.stopRegeneration();
                    return;
                }
                // Régénérer 3% de la vie max
                const healAmount = Math.ceil(this.maxHp * this.regenPercent);
                const oldHp = this.hp;
                this.hp = Math.min(this.maxHp, this.hp + healAmount);
                // Mettre à jour la barre de vie et le tooltip
                this.drawHealthBar();
                if (this.hpTooltip) this.hpTooltip.setText(this.getHpTooltipText());
            },
            loop: true
        });
    }
    stopRegeneration() {
        if (this.regenTimer) {
            this.regenTimer.remove();
            this.regenTimer = null;
        }
    }
    followPath(delta) {
        if (!this.targetPath || this.currentPathIndex >= this.targetPath.length) return;
        const target = this.targetPath[this.currentPathIndex];
        const dist = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
        if (dist < 2) {
            this.currentPathIndex++;
            return;
        }
        const step = this.moveSpeed * delta / 1000;
        const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
        // Petit “bobbing” de marche (subtil)
        const s = this.scene.scaleFactor || 1;
        const k = this.baseScale;
        const bob = Math.sin((this.scene.time.now || 0) / 90) * 0.35 * s * k;
        this.bodyGroup.y = bob;
        this.swordGroup.y = bob;
        const dx = Math.cos(angle) * Math.min(step, dist);
        const dy = Math.sin(angle) * Math.min(step, dist);
        this.x += dx;
        this.y += dy;
        this.setDepth(40 + Math.floor(this.y / 10));
        // Oriente légèrement l’épée selon le mouvement (sans faire tourner tout le perso)
        if (this.swordPivot) {
            const desired = Phaser.Math.Clamp(angle, -Math.PI, Math.PI);
            const tilt = Phaser.Math.Clamp(Math.sin(desired) * 0.18, -0.25, 0.25);
            this.swordPivot.rotation = Phaser.Math.Linear(this.swordPivot.rotation, tilt - 0.25, 0.12);
        }
    }
    checkForEnemyEngage() {
        if (!this.scene?.enemies) return;
        const enemies = this.scene.enemies.getChildren();
        let closest = null;
        let minDist = 32;
        for (const enemy of enemies){
            if (!enemy.active || enemy.isBlocked || enemy.isRanged) continue;
            const d = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
            if (d < minDist) {
                minDist = d;
                closest = enemy;
            }
        }
        if (closest) this.blockEnemy(closest);
    }
    blockEnemy(enemy) {
        this.blockingEnemy = enemy;
        enemy.isBlocked = true;
        enemy.blockedBy = this;
        // Ne pas vider le chemin automatiquement - permettre le déplacement pendant le combat
        // Le joueur peut toujours donner une nouvelle destination pour partir
        // Arrêter la régénération quand on entre en combat
        this.stopRegeneration();
        this.tryAttack(this.scene?.time?.now ?? 0);
    }
    tryAttack(time) {
        if (time - this.lastAttackTime < this.attackInterval) return;
        if (!this.blockingEnemy || !this.blockingEnemy.active) return;
        this.lastAttackTime = time;
        // Hit
        this.blockingEnemy.damage(this.damage, {
            source: "hero"
        });
        // Animations
        this.playAttackAnimation(this.blockingEnemy);
    }
    playAttackAnimation(enemy) {
        if (!enemy || !enemy.active) return;
        const s = this.scene.scaleFactor || 1;
        const k = this.baseScale;
        const angleToEnemy = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
        // 1) Swing d'épée basé sur un pivot -> plus “propre” et punchy
        if (this.swordPivot) {
            // Pré-armement puis coup
            const pre = -0.95;
            const hit = 0.75;
            this.swordPivot.rotation = pre;
            this.scene.tweens.add({
                targets: this.swordPivot,
                rotation: hit,
                duration: 140,
                ease: "Cubic.easeOut",
                yoyo: true,
                hold: 0,
                onComplete: ()=>{
                    // revient à une pose neutre
                    this.scene.tweens.add({
                        targets: this.swordPivot,
                        rotation: -0.25,
                        duration: 120,
                        ease: "Cubic.easeOut"
                    });
                }
            });
        }
        // 2) Arc trail (beaucoup plus stylé) : double arc + petit glow
        this.swordTrail.clear();
        // Arc principal
        this.swordTrail.lineStyle(8 * s * k, 0xffd166, 0.55);
        this.swordTrail.beginPath();
        this.swordTrail.arc(0, 0, 30 * s * k, angleToEnemy - 1.15, angleToEnemy + 0.55);
        this.swordTrail.strokePath();
        // Highlight
        this.swordTrail.lineStyle(4 * s * k, 0xffffff, 0.38);
        this.swordTrail.beginPath();
        this.swordTrail.arc(0, 0, 29 * s * k, angleToEnemy - 1.05, angleToEnemy + 0.45);
        this.swordTrail.strokePath();
        this.swordTrail.alpha = 1;
        this.scene.tweens.add({
            targets: this.swordTrail,
            alpha: 0,
            duration: 170,
            ease: "Quad.easeOut",
            onComplete: ()=>this.swordTrail.clear()
        });
        // 3) Petit impact sparkle côté ennemi (ça fait “hit confirm”)
        this.spawnHitSpark(angleToEnemy);
        // 4) Recul du corps + petite torsion
        this.scene.tweens.add({
            targets: this.bodyGroup,
            x: -Math.cos(angleToEnemy) * 2.2 * s * k,
            y: Math.sin(angleToEnemy) * 1.2 * s * k,
            duration: 90,
            yoyo: true,
            ease: "Quad.easeOut",
            onComplete: ()=>{
                this.bodyGroup.x = 0;
                this.bodyGroup.y = 0;
            }
        });
        this.scene.tweens.add({
            targets: this.bodyGroup,
            rotation: 0.18 * Math.sign(Math.cos(angleToEnemy)),
            duration: 110,
            yoyo: true,
            ease: "Quad.easeOut",
            onComplete: ()=>this.bodyGroup.rotation = 0
        });
    }
    spawnHitSpark(angle) {
        const s = this.scene.scaleFactor || 1;
        const k = this.baseScale;
        // Spark à la “position” de l'impact (dans le repère local du hero)
        const r = 26 * s * k;
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        this.hitSpark.clear();
        this.hitSpark.alpha = 1;
        // Étoile simple (traits)
        this.hitSpark.lineStyle(3.5 * s * k, 0xffffff, 0.9);
        this.hitSpark.beginPath();
        this.hitSpark.moveTo(px - 6 * s * k, py);
        this.hitSpark.lineTo(px + 6 * s * k, py);
        this.hitSpark.moveTo(px, py - 6 * s * k);
        this.hitSpark.lineTo(px, py + 6 * s * k);
        this.hitSpark.strokePath();
        // Petit halo
        this.hitSpark.fillStyle(0xffd166, 0.45);
        this.hitSpark.fillCircle(px, py, 4.5 * s * k);
        this.scene.tweens.add({
            targets: this.hitSpark,
            alpha: 0,
            duration: 120,
            ease: "Quad.easeOut",
            onComplete: ()=>this.hitSpark.clear()
        });
    }
    // -----------------------------
    // Damage / Death / Respawn
    // -----------------------------
    takeDamage(amount) {
        if (!this.isAlive) return;
        this.hp -= amount;
        // Mettre à jour le temps du dernier dégât
        this.lastDamageTime = this.scene?.time?.now || 0;
        // Arrêter la régénération si elle est active
        this.stopRegeneration();
        this.drawHealthBar();
        // Mettre à jour le tooltip si visible
        if (this.hpTooltip) this.hpTooltip.setText(this.getHpTooltipText());
        this.flashDamage();
        if (this.hp <= 0) this.die();
    }
    flashDamage() {
        // Comme on dessine en Graphics, on fait un flash via alpha (simple et clean)
        this.scene.tweens.add({
            targets: [
                this.bodyGroup,
                this.swordGroup
            ],
            alpha: 0.2,
            duration: 60,
            yoyo: true,
            repeat: 1,
            onComplete: ()=>{
                this.bodyGroup.alpha = 1;
                this.swordGroup.alpha = 1;
            }
        });
    }
    releaseEnemy() {
        if (this.blockingEnemy) {
            this.blockingEnemy.isBlocked = false;
            this.blockingEnemy.blockedBy = null;
        }
        this.blockingEnemy = null;
    }
    die() {
        this.isAlive = false;
        this.hp = 0;
        this.hideHpTooltip();
        this.stopRegeneration();
        this.releaseEnemy();
        this.targetPath = [];
        this.currentPathIndex = 0;
        // petite “pop” avant de disparaître
        this.scene.tweens.add({
            targets: this,
            scale: this.visualScale * 1.05,
            duration: 80,
            yoyo: true,
            onComplete: ()=>{
                this.setVisible(false);
                this.spawnCorpse();
            }
        });
    }
    spawnCorpse() {
        const s = this.scene.scaleFactor || 1;
        const k = this.baseScale;
        this.corpseContainer = this.scene.add.container(this.x, this.y).setDepth(45);
        const blood = this.scene.add.graphics();
        blood.fillStyle(0x8b0000, 0.82);
        blood.fillEllipse(0, 10 * s * k, 30 * s * k, 13 * s * k);
        const body = this.scene.add.graphics();
        body.fillStyle(0x5a5a5a, 1);
        body.fillRoundedRect(-14 * s * k, -18 * s * k, 28 * s * k, 36 * s * k, 7 * s * k);
        body.fillStyle(0x2d2d2d, 1);
        body.fillCircle(0, -22 * s * k, 8 * s * k);
        const timerText = this.scene.add.text(0, -48 * s * k, "20", {
            fontSize: `${Math.max(14, 16 * s * k)}px`,
            color: "#ffdddd",
            fontStyle: "bold",
            stroke: "#000",
            strokeThickness: Math.max(2, 3 * s * k)
        }).setOrigin(0.5);
        this.corpseContainer.add([
            blood,
            body,
            timerText
        ]);
        let remaining = 20;
        this.corpseTimerEvent = this.scene.time.addEvent({
            delay: 1000,
            repeat: 19,
            callback: ()=>{
                remaining -= 1;
                timerText.setText(`${remaining}`);
                if (remaining <= 0) this.respawn();
            }
        });
    }
    respawn() {
        if (this.corpseTimerEvent) {
            this.corpseTimerEvent.remove();
            this.corpseTimerEvent = null;
        }
        if (this.corpseContainer) {
            this.corpseContainer.destroy();
            this.corpseContainer = null;
        }
        this.hp = this.maxHp;
        this.isAlive = true;
        this.drawHealthBar();
        this.setVisible(true);
        // Respawn “Back” propre
        this.setScale(0);
        this.scene.tweens.add({
            targets: this,
            scale: this.visualScale,
            duration: 240,
            ease: "Back.easeOut",
            onComplete: ()=>{
                // reset alpha/rotations au cas où
                this.alpha = 1;
                this.bodyGroup.rotation = 0;
                if (this.swordPivot) this.swordPivot.rotation = -0.25;
            }
        });
    }
}

},{"../config/settings.js":"9kTMs","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"60Yvj":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "MapScene", ()=>MapScene);
var _indexJs = require("../config/levels/index.js");
var _authManagerJs = require("../services/authManager.js");
var _authOverlayJs = require("../services/authOverlay.js");
class MapScene extends Phaser.Scene {
    constructor(){
        super("MapScene");
        this.biomes = {
            grass: {
                top: 0x55aa44,
                side: 0x3d2b1f,
                light: 0x77cc66,
                prop: 0x225522,
                glow: 0x00ff00
            },
            lava: {
                top: 0x333333,
                side: 0x221100,
                light: 0xff4400,
                prop: 0xff0000,
                glow: 0xff4400
            },
            ice: {
                top: 0xeeddfb,
                side: 0x4466aa,
                light: 0xffffff,
                prop: 0xaaddff,
                glow: 0x00ffff
            },
            sand: {
                top: 0xedc9af,
                side: 0x8b5a2b,
                light: 0xffe4b5,
                prop: 0xd2b48c,
                glow: 0xffcc00
            },
            cyber: {
                top: 0x1a1a2e,
                side: 0x0f0f1b,
                light: 0x00f2ff,
                prop: 0x0055ff,
                glow: 0x00f2ff
            }
        };
    }
    create() {
        const { width, height } = this.scale;
        this.createDeepSea(width, height);
        this.mapContainer = this.add.container(0, 0);
        this.draw3DMap(width / 2, height);
        // Titre
        this.add.text(width / 2, 50, "CARTOGRAPHIE DES SECTEURS", {
            fontFamily: "Impact",
            fontSize: "42px",
            color: "#fff"
        }).setOrigin(0.5).setShadow(0, 0, "#00f2ff", 20, true, true);
        const back = this.add.text(width / 2, height - 40, "\u21A9 RETOUR AU QG", {
            fontFamily: "Orbitron",
            fontSize: "18px",
            color: "#00f2ff"
        }).setOrigin(0.5).setInteractive({
            useHandCursor: true
        });
        back.on("pointerdown", ()=>this.scene.start("MainMenuScene"));
    }
    createDeepSea(w, h) {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x02101a, 0x02101a, 0x00050a, 0x00050a, 1);
        bg.fillRect(0, 0, w, h);
    }
    draw3DMap(cx, height) {
        const unlocked = (0, _authManagerJs.getUnlockedLevel)();
        const points = [
            {
                x: cx - 220,
                y: height * 0.75,
                b: 'grass'
            },
            {
                x: cx + 180,
                y: height * 0.60,
                b: 'sand'
            },
            {
                x: cx - 150,
                y: height * 0.42,
                b: 'ice'
            },
            {
                x: cx + 220,
                y: height * 0.28,
                b: 'lava'
            },
            {
                x: cx,
                y: height * 0.12,
                b: 'cyber'
            }
        ];
        const pathGfx = this.add.graphics();
        this.mapContainer.add(pathGfx);
        for(let i = 0; i < (0, _indexJs.LEVELS_CONFIG).length; i++){
            const p = points[i % points.length];
            const isLocked = i + 1 > unlocked;
            if (i < (0, _indexJs.LEVELS_CONFIG).length - 1) this.drawBridge(pathGfx, p, points[(i + 1) % points.length], isLocked);
            const island = this.create3DIsland(p.x, p.y, i + 1, p.b, isLocked);
            this.mapContainer.add(island);
        }
    }
    create3DIsland(x, y, id, biomeType, isLocked) {
        const container = this.add.container(x, y);
        const biome = this.biomes[biomeType];
        const levelData = (0, _indexJs.LEVELS_CONFIG)[id - 1];
        const s = 1.2;
        // 1. OMBRE PORTÉE
        const shadow = this.add.graphics();
        shadow.fillStyle(0x000000, 0.5).fillEllipse(0, 60, 100 * s, 50 * s);
        // 2. SOCLE (FALAISE 3D)
        const cliff = this.add.graphics();
        const cliffColor = isLocked ? 0x1a1a1a : biome.side;
        cliff.fillStyle(cliffColor);
        cliff.beginPath();
        cliff.moveTo(-60 * s, 0);
        cliff.lineTo(-40 * s, 50 * s);
        cliff.lineTo(40 * s, 50 * s);
        cliff.lineTo(60 * s, 0);
        cliff.closePath();
        cliff.fillPath();
        // 3. SURFACE
        const surface = this.add.graphics();
        const topColor = isLocked ? 0x2d2d2d : biome.top;
        surface.fillGradientStyle(isLocked ? 0x333333 : biome.light, isLocked ? 0x333333 : biome.light, topColor, topColor, 1);
        const p = [
            -60,
            -10,
            -40,
            -30,
            0,
            -35,
            40,
            -30,
            60,
            -10,
            50,
            20,
            0,
            30,
            -50,
            25
        ];
        surface.beginPath();
        surface.moveTo(p[0] * s, p[1] * s);
        for(let i = 2; i < p.length; i += 2)surface.lineTo(p[i] * s, p[i + 1] * s);
        surface.closePath();
        surface.fillPath();
        surface.lineStyle(2, 0xffffff, isLocked ? 0.05 : 0.4);
        surface.strokePath();
        // 4. ÉTIQUETTE DE NOM (HOLOGRAPHIQUE)
        const labelBox = this.add.graphics();
        labelBox.fillStyle(0x000000, 0.8);
        labelBox.lineStyle(1, isLocked ? 0x333333 : biome.light, 1);
        labelBox.fillRoundedRect(-75, 65, 150, 26, 6);
        labelBox.strokeRoundedRect(-75, 65, 150, 26, 6);
        // 5. ÉLÉMENTS TEXTUELS
        const txtId = this.add.text(0, -12, id, {
            fontSize: "44px",
            fontFamily: "Impact",
            color: isLocked ? "#444" : "#fff"
        }).setOrigin(0.5);
        const txtName = this.add.text(0, 78, levelData.name.toUpperCase(), {
            fontSize: "11px",
            fontFamily: "Orbitron",
            color: isLocked ? "#555" : "#fff",
            fontWeight: "bold"
        }).setOrigin(0.5);
        container.add([
            shadow,
            cliff,
            surface,
            labelBox,
            txtId,
            txtName
        ]);
        // 6. LE CADENA (Si verrouillé)
        if (isLocked) {
            const lock = this.add.text(0, 0, "\uD83D\uDD12", {
                fontSize: "40px"
            }).setOrigin(0.5).setAlpha(0.6);
            container.add(lock);
            container.setAlpha(0.8); // Rend toute l'île légèrement transparente
        }
        // ANIMATION DE FLOTTAISON
        this.tweens.add({
            targets: container,
            y: y - 15,
            duration: 2500 + id * 200,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
        // INTERACTIONS (Seulement si débloqué)
        if (!isLocked) {
            container.setInteractive(new Phaser.Geom.Circle(0, 0, 70), Phaser.Geom.Circle.Contains);
            container.on("pointerover", ()=>{
                this.tweens.add({
                    targets: container,
                    scale: 1.1,
                    duration: 150
                });
                labelBox.lineStyle(2, 0xffffff, 1).strokeRoundedRect(-75, 65, 150, 26, 6);
            });
            container.on("pointerout", ()=>{
                this.tweens.add({
                    targets: container,
                    scale: 1,
                    duration: 150
                });
                labelBox.clear().fillStyle(0x000000, 0.8).lineStyle(1, biome.light, 1).fillRoundedRect(-75, 65, 150, 26, 6).strokeRoundedRect(-75, 65, 150, 26, 6);
            });
            container.on("pointerdown", ()=>{
                if (!(0, _authManagerJs.isAuthenticated)()) return (0, _authOverlayJs.showAuth)();
                this.scene.start("GameScene", {
                    level: id,
                    heroStats: (0, _authManagerJs.getHeroStats)()
                });
            });
        }
        return container;
    }
    drawBridge(gfx, p1, p2, isLocked) {
        const color = isLocked ? 0x222222 : 0x00f2ff;
        const curve = new Phaser.Curves.QuadraticBezier(new Phaser.Math.Vector2(p1.x, p1.y + 10), new Phaser.Math.Vector2((p1.x + p2.x) / 2, (p1.y + p2.y) / 2 - 40), new Phaser.Math.Vector2(p2.x, p2.y + 10));
        gfx.lineStyle(8, 0x000000, 0.3);
        curve.draw(gfx);
        gfx.lineStyle(2, color, isLocked ? 0.1 : 0.6);
        curve.draw(gfx);
    }
}

},{"../config/levels/index.js":"8fcfE","../services/authManager.js":"cvKjF","../services/authOverlay.js":"g1JuO","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}]},["fILKw"], "fILKw", "parcelRequirebaba", {}, "./", "/")

//# sourceMappingURL=towerdefense.1fcc916e.js.map
