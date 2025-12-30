import { launchPhaserPage } from "../boot/pageBootstrap.js";
import { MapScene } from "../scenes/MapScene.js";
import { GameScene } from "../scenes/GameScene.js";

launchPhaserPage([MapScene, GameScene]);
