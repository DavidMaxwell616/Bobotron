import { H, W, SECS_TO_NOMINALS, GAME_STATE, rect, wall, levelSpecs, scoreValues, RGB2Color } from "./config.js";
import {
    initPlayer, initFamily, initElectrodes, initGrunts, initHulks,
    initSpheroids, initBrains, initQuarks
} from "./entities.js";
import {
    moveEntities, enemyHitFamily, playerHitEnemy, processUserInput, bulletHitEnemy, playerHitReward
} from "./move.js";
import { generateLevel } from "./utils.js";

export class GameScene extends Phaser.Scene {

    constructor() {
        super("GameScene");
    }
    create() {
        this.nextRect = this.time.now + rect.rectDelay;
        this.score = 0;
        this.colors = [];
        this.graphics = this.add.graphics();
        this.changingTimer = 2 * SECS_TO_NOMINALS;
        this.makeColorArray();
        this.rects = this.add.group();
        this.nextRect = this.time.now + rect.rectDelay;
        this.colorNum = 0;
        this.multiplier = 1;
        this.arrowTouched = false;
        this.level = 1;
        this.lives = 3;
        this.ammo = 500;
        this.shieldTime = 20;
        this.bulletVel = 1;
        this.Family = this.physics.add.group();
        this.Enemies = this.physics.add.group();
        this.Bullets = this.physics.add.group();
        this.Particles = this.physics.add.group();
        this.ExtraLives = this.physics.add.group();
        this.Rewards = this.physics.add.group();
        this.maxxdaddy = this.add.image(0, 0, 'maxxdaddy');
        this.maxxdaddy
            .setPosition(W - this.maxxdaddy.width - 35, H - this.maxxdaddy.height * 2)
            .setOrigin(0);
        moveEntities(this);
        this.physics.add.collider(this.Bullets, this.Enemies, function (bullet, enemy) {
            bulletHitEnemy(bullet, enemy);
        });

        this.physics.add.collider(this.Enemies, this.Family, function (enemy, member) {
            enemyHitFamily(enemy, member);
        });

        this.player = this.physics.add.sprite(
            W / 2,
            H / 2,
            'spriteMap',
            'player_07.png',
        );
        this.player.visible = false;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.physics.add.collider(this.player, this.Enemies, function (player, enemy) {
            playerHitEnemy(player, enemy);
        });

        this.physics.add.collider(this.Rewards, this.player, function (reward, player) {
            playerHitReward(reward, player);
        });
        this.arrows = [];
        this.setUpArrows();
        this.input.on('gameobjectdown', this.onObjectClicked);
        this.gameState = GAME_STATE.Transition;
        this.isRefreshingLevel = true;
    }

    onObjectClicked(pointer, gameObject) {
        switch (gameObject.name) {
            case 'right':
                arrowTouched = true;
                movePlayer('right');
                break;
            case 'left':
                arrowTouched = true;
                movePlayer('left');
                break;
            case 'up':
                arrowTouched = true;
                movePlayer('up');
                break;
            case 'down':
                arrowTouched = true;
                movePlayer('down');
                break;
            default:
                break;
        }
    }

    makeColorArray() {
        for (var i = 0; i < 32; ++i) {
            var r = Math.sin(0.2 * i + 0) * 127 + 128;
            var g = Math.sin(0.2 * i + 2) * 127 + 128;
            var b = Math.sin(0.2 * i + 4) * 127 + 128;
            this.colors.push(RGB2Color(r, g, b));
        }
    };

    setUpArrows() {
        for (let index = 0; index < this.arrows.length; index++) {
            var arrow = arrowStats[index];
            this.arrows[index] = this.add.image(0, 0, 'arrow');
            this.arrows[index].setScale(.25).setOrigin(.5);
            this.arrows[index].x = arrows[index].width * .25 + 20 + arrow.xOffset;
            this.arrows[index].y = H - arrows[index].width * .25 + -20 + arrow.yOffset;
            this.arrows[index].visible = false;
            this.arrows[index].name = arrow.direction;
            this.arrows[index].setInteractive();
            this.arrows[index].angle = arrow.angle;
        }
    }

    renderLevelChanger() {
        var halfWidth = W / 2;
        var halfHeight = (H - wall.wallTop) / 2;
        if (this.rects.children.entries.length < halfWidth / rect.rectStep) {
            var r = this.add.rectangle(halfWidth, halfHeight, rect.rectWidth, rect.rectHeight);
            var color = Phaser.Display.Color.HexStringToColor(this.colors[this.colorNum]).color;
            r.setStrokeStyle(3, color);
            this.rects.add(r);
            rect.rectWidth += 12;
            rect.rectHeight += 7;
            this.nextRect = this.time.now + rect.rectDelay;
            this.colorNum++
            if (this.colorNum > 31) this.colorNum = 0;
        }
        else {
            if (rect.rectCount < this.rects.children.entries.length) {
                this.rects.children.entries[0].destroy();
                rect.rectCount++;
            }
            else {
                rect.rectCount = 0;
                this.rects.clear();
                rect.rectWidth = 10;
                rect.rectHeight = 5;
                this.isRefreshingLevel = false;
                this.gameState = GAME_STATE.Playing;
            }
        }

    }


    renderGameOver() {
        this.gameOverText = this.add.text(
            W * .2,
            H / 2,
            'G A M E  O V E R', {
            fontFamily: 'Arial',
            fontSize: '60px',
            fill: 'red',
        },
        );
        var timedEvent = this.time.delayedCall(
            3000,
            function () {
                this.arrows.forEach(element => {
                    element.visible = false;
                });
                this.gameOverText.destroy();
                this.gameState = GAME_STATE.Menu;
            },
            [],
            this,
        );
    }

    updateStats() {
        this.levelText.setText('LEVEL: ' + this.level);
        this.scoreText.setText('SCORE: ' + this.score);
        this.ammoText.setText('AMMO: ' + this.ammo);
        this.shieldText.setText('SHIELD: ' + Math.ceil(this.shieldTime / SECS_TO_NOMINALS));
        this.livesText.setText('LIVES: ' + this.lives);
    }

    drawLives() {
        for (var i = 1; i < lives; i++) {
            var extralife = this.physics.add.sprite(
                W - i * 20,
                15,
                'spriteMap',
                'extralife.png',
            );
            ExtraLives.add(extralife);
        }
    }

    update(time, delta) {
        const dt = delta / 1000;

        this.arrowTouched = false;

        switch (this.gameState) {
            case GAME_STATE.Menu:
                this.scene.start("SplashScene");
                break;
            case GAME_STATE.Transition:
                if (this.isRefreshingLevel && time / 10 < this.nextRect)
                    this.renderLevelChanger();
                break;
            case GAME_STATE.Playing:
                if (!this.levelRendered) {
                    this.renderLevel();
                    this.levelRendered = true;
                }
                if (!this.levelStarted) {
                    this.startLevel(this);
                    this.levelStarted = true;
                } else {
                    moveEntities(this);
                    processUserInput();
                    this.updateStats();
                    var enemiesLeft = this.Enemies.getChildren().filter(function (value) {
                        return value.name != 'Hulk';
                    });
                    if (this.playerDying) {
                        this.clearLevel();
                        this.playerDying = false;
                        this.isRefreshingLevel = true;
                        this.nextRect = time + rect.rectDelay;
                        this.gameState = GAME_STATE.Transition;
                        this.levelStarted = false;
                    }
                    else if (this.levelStarted && enemiesLeft == 0 && this.Particles.getLength() == 0) {
                        this.clearLevel();
                        this.level++;
                        this.levelStarted = false;
                        this.isRefreshingLevel = true;
                        this.nextRect = time + rect.rectDelay;
                        this.gameState = GAME_STATE.Transition;
                    }
                }
                break;
            case GAME_STATE.GameOver:
                this.renderGameOver();
                break;
            default:
                break;
        }
    }

    startLevel() {
        this.maxxdaddy.visible = false;

        var randomLevelRequired = this.level >= levelSpecs.length;
        var L = this.level;

        for (let index = 0; index < this.arrows.length; index++) {
            arrows[index].visible = true;
        }

        if (randomLevelRequired) {
            var randomlevel = generateLevel(this.level);
            this.initEntities(randomlevel);

            this.numberOfEntities = randomlevel.reduce(function (a, b) {
                return a + b;
            }, 0);
        } else {
            this.initEntities(levelSpecs[this.level]);
            this.numberOfEntities = levelSpecs[this.level].reduce(function (a, b) {
                return a + b;
            }, 0);
        }
    }

    initEntities(levelData) {
        // Key:
        initPlayer(this);
        initFamily(levelData[0]);
        initElectrodes(levelData[1]);
        initGrunts(levelData[2]);
        initHulks(levelData[3]);
        initSpheroids(levelData[4]);
        initBrains(levelData[5]);
        initQuarks(levelData[6]);
    }

    clearLevel() {
        this.Family.clear(true);
        this.Particles.clear(true);
        this.Enemies.clear(true);
        this.Rewards.clear(true);
        this.Bullets.clear(true);
        this.player.x = W / 2;
        this.player.y = H / 2;
        this.player.velX = 0;
        this.player.velY = 0;
        this.graphics.clear();
    }

    renderLevel() {
        this.graphics.clear();
        // Display score bar
        this.graphics.fillStyle(0x000000, 1);
        this.graphics.fillRect(0, 0, W, wall.wallTop);

        // Display the score
        this.scoretxt = 'Score: ' + this.score;
        this.scoreText = this.add.text(5, 5, this.scoretxt, {
            fontFamily: 'Arial',
            fontSize: '20px',
            fill: 'red',
        });

        //display the multiplier and the level
        var disp = 'X' + this.multiplier + '  Level: ' + this.level;
        this.levelText = this.add.text(W / 2 - 140, 5, disp, {
            fontFamily: 'Arial',
            fontSize: '20px',
            fill: 'red',
        });

        // Display ammo
        var text = 'Ammo: ' + this.ammo;
        this.ammoText = this.add.text(W / 2, 5, text, {
            fontFamily: 'Arial',
            fontSize: '20px',
            fill: 'red',
        });
        // Display shield
        var moretxt = 'Shield: ' + Math.ceil(this.shieldTime / SECS_TO_NOMINALS);
        this.shieldText = this.add.text(W / 2 + 130, 5, moretxt, {
            fontFamily: 'Arial',
            fontSize: '20px',
            fill: 'red',
        });

        // Display lives
        var livestxt = 'Lives: ' + this.lives;
        this.livesText = this.add.text(W / 2 + 280, 5, livestxt, {
            fontFamily: 'Arial',
            fontSize: '20px',
            fill: 'red',
        });

        // Display border
        this.graphics.fillStyle(0xffffff, 1);
        // graphics.fillStyle(colors[colorCounter % colors.length], 1);
        var rect = new Phaser.Geom.Rectangle(0, wall.wallTop, W, wall.wallThickness);
        this.graphics.fillRectShape(rect);
        rect = new Phaser.Geom.Rectangle(0, wall.wallTop, wall.wallLeft, H - wall.wallTop);
        this.graphics.fillRectShape(rect);
        rect = new Phaser.Geom.Rectangle(0, wall.wallBottom, W, wall.wallThickness);
        this.graphics.fillRectShape(rect);
        rect = new Phaser.Geom.Rectangle(
            wall.wallRight,
            wall.wallTop,
            wall.wallThickness,
            H - wall.wallTop,
        );
        this.graphics.fillRectShape(rect);
    }

    addMultiplier = () => {
        if (multiplier < 5) {
            multiplier += 1;
        }
    }

    resetMultiplier = () => this.multiplier = 1;
}