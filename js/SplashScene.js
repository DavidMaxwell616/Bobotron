import { H, W } from "./config.js";

export class SplashScene extends Phaser.Scene {
    constructor() {
        super("SplashScene");
    }

    preload() {
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.refresh();

        this.load.path = '../assets/json/';
        this.load.multiatlas('spriteMap', 'spriteMap.json');

        this.load.path = '../assets/images/';
        this.load.image('maxxdaddy', 'maxxdaddy.gif');
        this.load.image('arrow', 'arrow.png');
        this.load.image('splash', 'robotron splash.png');
        this.load.spritesheet('w', 'williams w.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.Logos = this.physics.add.group();

    }

    create() {
        this.renderMenu();
    }

    renderMenu() {
        this.splash = this.add.image(W / 2, H / 2, 'splash');
        for (let index = 0; index < 25; index++) {
            var frame = index % 8;
            this.addLogo(index * 32 + 16, 16, 1, 0, frame);
            this.addLogo(W - (index * 32 + 16), H - 16, -1, 0, frame);
        }
        for (let index = 0; index < 15; index++) {
            var frame = index % 8;
            this.addLogo(16, index * 32 + 16, 0, -1, frame);
            this.addLogo(W - 16, index * 32 + 16, 0, 1, frame);
        }
        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("GameScene");
        });

        this.input.on('pointerdown', () => {
            this.scene.start("GameScene");
        });
    }

    addLogo(x, y, xv, yv, f) {
        var logo = this.add.sprite(x, y, 'w');
        logo.xv = xv;
        logo.yv = yv;
        logo.setFrame(f);
        this.Logos.add(logo);
    }
    update() {
        this.animateMenu();
    }

    animateMenu() {
        var members = this.Logos.getChildren();
        members.forEach(element => {
            element.x += element.xv;
            element.y += element.yv;
            if (element.x > W - 16 && element.xv == 1) {
                element.x = W - 16;
                element.xv = 0;
                element.yv = 1;
            } else if (element.x < 16 && element.xv == -1) {
                element.x = 16;
                element.xv = 0;
                element.yv = -1;
            } else if (element.y > H - 16 && element.yv == 1) {
                element.y = H - 16;
                element.yv = 0;
                element.xv = -1;
            } else if (element.y < 16 && element.yv == -1) {
                element.y = 16;
                element.yv = 0;
                element.xv = 1;
            }
        });
    }


}