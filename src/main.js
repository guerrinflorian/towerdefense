import { MainMenuScene } from "./scenes/MainMenuScene.js";
import { GameScene } from "./scenes/GameScene.js";
import { CONFIG } from "../src/config/settings";

const config = {
  type: Phaser.AUTO,
  width: CONFIG.GAME_WIDTH,
  height: CONFIG.GAME_HEIGHT,
  parent: "game-container",
  backgroundColor: "#000000",
  scene: [MainMenuScene, GameScene],
};

const game = new Phaser.Game(config);
