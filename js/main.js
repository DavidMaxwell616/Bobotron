import { H, W } from "./config.js";
import { SplashScene } from "./SplashScene.js";
import { GameScene } from "./GameScene.js";
var config = {
    type: Phaser.AUTO,
    width: W,
    height: H,
    backgroundColor: "#081018",
    physics: {
        default: "arcade",
        arcade: { debug: false }
    },
    scene: [SplashScene, GameScene]
};

var game = new Phaser.Game(config);