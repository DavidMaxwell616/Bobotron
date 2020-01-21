var config = {
  type: Phaser.AUTO,
  width: 900,
  height: 500,
  parent: 'game',
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);
var _isChangingLevel = false;
var _isRefreshingLevel = false;
var _changingTimer = 0;
var isInMenu = true;
var isGameOver = false;

function create() {
  score = 0;

  graphics = this.add.graphics();
  _isRefreshingLevel = true;
  _changingTimer = 2 * SECS_TO_NOMINALS;
  makeColorArray();

  Family = this.add.group();
  Enemies = this.add.group();
  maxxdaddy = this.add.image(0, 0, 'maxxdaddy')
  maxxdaddy.setPosition(gameWidth - maxxdaddy.width, gameHeight - maxxdaddy.height).setOrigin(0);
  initAnimations(this);
  return;
  playerXSpeed = 0;
  playerYSpeed = 0;
  this.world.setBounds(0, 0, this.game.config.width, this.game.config.height);
  //maxxdaddy.visible = false;

  numGuards = curLevel + 4;
  initEnemies(this);
  loadLevel(this, curLevel);


  this.input.keyboard.on('keydown_SPACE', function (event) {
    bulletDirection = {
      xv: playerXSpeed,
      yv: playerYSpeed
    };
    var frame = 3 + bulletDirection.yv;
    player.anims.pause(player.anims.currentAnim.frames[frame]);
    var bullet = this.add.sprite(0, 0, 'bullet');
    shootBullet(this, bullet, bulletDirection);
    playerXSpeed = 0;
    playerYSpeed = 0;
    shooting = true;
  }, this);

  this.input.keyboard.on('keyup_SPACE', function (event) {
    shooting = false;
  });

  // this.world.on('collisionstart', function (event, player, objects) {
  //   fryPlayer(this);
  // });

}

function movePlayer(xv, yv) {
  if (xv != 0) {
    if (playerXSpeed === -xv) {
      playerXSpeed = 0;
      player.anims.pause(player.anims.currentAnim.frames[0]);
    } else if (playerXSpeed === 0) {
      playerXSpeed = xv;
      player.anims.play('run');
    }
  }
  if (yv != 0) {
    if (playerYSpeed === -yv) {
      playerYSpeed = 0;
      player.anims.pause(player.anims.currentAnim.frames[0]);
    } else if (playerYSpeed === 0) {
      playerYSpeed = yv;
      player.anims.play('run');
    }
  }
}

function shootBullet(scene, bullet, direction) {
  bullet.setPosition(player.x, player.y);
  bullet.setVelocityX(direction.xv * 5);
  bullet.setVelocityY(direction.yv * 5);
  player.flipX = direction.xv < 0;
  scene.world.on('collisionstart', function (event, objects, bullet) {
    bullet.destroy();
  });
  // scene.world.on('collisionstart', function (event, bullet, guards) {
  //   console.log('shot guard');
  // });
}

function initAnimations(scene) {
  var entities = [
    'Protagonist',
    'Dad',
    'Mom',
    'Child',
    'Brain'
  ]

  entities.forEach(element => {
    setupAnimation(scene, element, 1, 3, 'WalkLeft');
    setupAnimation(scene, element, 4, 6, 'WalkRight');
    setupAnimation(scene, element, 7, 9, 'WalkDown');
    setupAnimation(scene, element, 10, 12, 'WalkUp');
  });
  setupAnimation(scene, 'Grunt', 1, 3, 'Walk');
}

function setupAnimation(scene, entity, start, end, movement) {
  var frameNames = scene.anims.generateFrameNames('spriteMap', {
    start: start,
    end: end,
    zeroPad: 2,
    prefix: entity + '_',
    suffix: '.png'
  });
  scene.anims.create({
    key: entity + movement,
    frames: frameNames,
    frameRate: 10,
    repeat: -1
  });
}

function updateStats() {
  levelText.setText('LEVEL: ' + curLevel);
  scoreText.setText('SCORE: ' + score);
  livesText.setText('LIVES: ' + lives);
}

function renderLevelChanger(scene) {
  var halfWidth = gameWidth / 2;
  var halfHeight = (gameHeight - wallTop) / 2;
  var yMiddle = wallTop + halfHeight;
  var layerOffsetX = 5;
  var layerOffsetY = halfHeight / (halfWidth / layerOffsetX);
  var layers = halfWidth / layerOffsetX;

  if (_isRefreshingLevel) {

    var alpha;
    if (_changingTimer > SECS_TO_NOMINALS) {
      alpha = (2 * SECS_TO_NOMINALS - _changingTimer) / SECS_TO_NOMINALS;
    } else {
      alpha = _changingTimer / SECS_TO_NOMINALS;
      if (alpha < 0) alpha = 0;
      // entityManager.clearPartial();
      // entityManager.resetPos();
    }
    var rect = new Phaser.Geom.Rectangle(wallLeft,
      wallTop + wallThickness,
      wallRight - wallThickness,
      wallBottom - wallThickness);
    graphics.fillStyle(0xff0000, alpha);
    graphics.fillRectShape(rect);

  } else {

    if (_changingTimer > SECS_TO_NOMINALS) {

      var range = (2 * SECS_TO_NOMINALS - _changingTimer) / SECS_TO_NOMINALS;
      var currentLayer = Math.floor(range * layers);

      for (var i = 1; i < currentLayer; i++) {
        if (i % colors.length < i * colors.length) {
          graphics.fillStyle(colors[i % colors.length], 1);
        }
        var rect = new Phaser.Geom.Rectangle(halfWidth - i * layerOffsetX,
          yMiddle - i * layerOffsetY,
          i * layerOffsetX * 2,
          i * layerOffsetY * 2
        );
        graphics.fillRectShape(rect);
      }
    } else {
      var range = _changingTimer / SECS_TO_NOMINALS;
      var currentLayer = Math.ceil(range * layers);

      for (var i = 1; i < currentLayer; i++) {
        if (i % colors.length < i * colors.length) {
          graphics.fillStyle(colors[i % colors.length], 1);
        }
        var rect = new Phaser.Geom.Rectangle(i * layerOffsetX,
          wallTop + i * layerOffsetY,
          gameWidth - i * layerOffsetX * 2,
          gameHeight - wallTop - i * layerOffsetY * 2
        );
        graphics.fillRectShape(rect);
      }

      range = (SECS_TO_NOMINALS - _changingTimer) / SECS_TO_NOMINALS;
      currentLayer = Math.ceil(range * layers);

      graphics.fillStyle(0x000000, 1);
      var rect = new Phaser.Geom.Rectangle(halfWidth - currentLayer * layerOffsetX,
        yMiddle - currentLayer * layerOffsetY,
        currentLayer * layerOffsetX * 2,
        currentLayer * layerOffsetY * 2
      );
      graphics.fillRectShape(rect);

    }
  }
  // console.log(_changingTimer);
  //graphics.restore();
  // graphics.clear();
  // Reset changing timer when level changing is complete
  if (_changingTimer < 0) {
    _isChangingLevel = false;
    _isRefreshingLevel = false;
    _changingTimer = 2 * SECS_TO_NOMINALS;
  }
};

function reduceTimer(du) {
  _changingTimer -= du;
};

function isChangingLevel() {
  return _isChangingLevel;
};

function isRefreshingLevel() {
  return _isRefreshingLevel;
};

function renderMenu(scene) {
  var str = "ROBOTRON";
  var re = "";
  if (str == undefined) str = "";
  if (re !== "re") re = "";
  var str2 = "Press R to " + re + "start the game!";
  var hw = gameWidth / 2,
    hh = gameHeight / 2;

  var rect = new Phaser.Geom.Rectangle(0, hh / 2, hw * 2, hh);
  var color = 0x2b0628;
  graphics.fillStyle(color, 1);
  graphics.fillRectShape(rect);

  var line = new Phaser.Geom.Line(0, hh / 2, hw * 2, hh / 2);
  graphics.lineStyle(3, 0xffffff, 1); // color: 0xRRGGBB
  graphics.strokeLineShape(line);

  graphics.moveTo(0, hh * 1.5);
  graphics.lineTo(hw * 2, hh * 1.5);
  graphics.stroke();

  var titleText = scene.add.text(
    hw,
    hh,
    str, {
      fontFamily: 'sans-serif',
      fontSize: '60px',
      fill: 'red',
    },
  );
  titleText.setOrigin(0.5, 0.5);
  var titleText2 = scene.add.text(
    hw,
    hh * 3,
    str2, {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      fill: 'red',
    },
  );
  titleText2.setOrigin(0.5, 0.5);
  scene.input.keyboard.on('keydown_R', function (event) {
    isInMenu = false;
    titleText.visible = false;
    titleText2.visible = false;
  });

  // graphics.font = "bold 20px sans-serif";
  // graphics.fillText(str2, hw, hh * 3 / 2 - 10); //10 is the font's halfheight

  // Music volume display
  // var vol = Math.round(g_bgm.getVolume()*100);
  // if (!g_music) vol = 0;
  // var volStr = "MUSIC VOLUME: "+vol+"%";
  // graphics.fillStyle = "gray";
  // graphics.fillText(volStr,hw,2*hh-10);

  //graphics.restore();

}

function renderGameOver() {

}

// the game loop. Game logic lives in here.
// is called every frame
function update() {

  if (!levelRendered) {
    renderLevel(this);
    startLevel(this);
    levelRendered = true;
  } else {
    moveEnemies(this);
  }
  // if (isInMenu) {

  //   renderMenu(this);

  // } else if (isChangingLevel &&
  //   !isRefreshingLevel) {

  //   renderLevel(this);
  //   //renderLevelChanger(this);

  // } else if (isGameOver) {

  //   renderGameOver();

  // } else {
  //   renderLevel(this);
  //   //entityManager.render(ctx);
  //   //renderCrosshair(ctx);
  //   //if (g_Debug) spatialManager.render(ctx);
  //   if (isRefreshingLevel) {
  //     renderLevelChanger(this);
  //   }
  // }


  reduceTimer(1);

}

function clearLevel() {}

function restart() {
  lives--;
  game.state.restart();
}

function renderLevel(scene) {
  graphics.clear();
  // Display score bar
  graphics.fillStyle(0x000000, 1);
  graphics.fillRect(0, 0, gameWidth, wallTop);

  // Display the score
  var scoretxt = "Score: " + score;
  scoreText = scene.add.text(
    5,
    5,
    scoretxt, {
      fontFamily: 'Arial',
      fontSize: '20px',
      fill: 'red',
    },
  );

  function addMultiplier() {
    if (multiplier < 5) {
      multiplier += 1;
    }
  };

  function resetMultiplier() {
    multiplier = 1;
  };

  //display the multiplier and the level
  var disp = "X" + multiplier + "  Level: " + level;
  scoreText = scene.add.text(
    gameWidth / 2 - 140, 5,
    disp, {
      fontFamily: 'Arial',
      fontSize: '20px',
      fill: 'red',
    },
  );

  // Display ammo
  var text = "Ammo: " + ammo;
  ammoText = scene.add.text(
    gameWidth / 2, 5,
    text, {
      fontFamily: 'Arial',
      fontSize: '20px',
      fill: 'red',
    },
  );
  // Display shield
  var moretxt = "Shield: " + Math.ceil(shieldTime / SECS_TO_NOMINALS);
  shieldText = scene.add.text(
    gameWidth / 2 + 130, 5,
    moretxt, {
      fontFamily: 'Arial',
      fontSize: '20px',
      fill: 'red',
    },
  );

  // Display remaining lives
  for (var i = 1; i < lives; i++) {
    scene.add.image(Extralife,
      gameWidth - i * 20,
      15
    );
  };

  // Display border
  graphics.fillStyle(0xffffff, 1);
  // graphics.fillStyle(colors[colorCounter % colors.length], 1);
  var rect = new Phaser.Geom.Rectangle(0, wallTop, gameWidth, wallThickness);
  graphics.fillRectShape(rect);
  rect = new Phaser.Geom.Rectangle(0, wallTop, wallLeft, gameHeight - wallTop);
  graphics.fillRectShape(rect);
  rect = new Phaser.Geom.Rectangle(0, wallBottom, gameWidth, wallThickness);
  graphics.fillRectShape(rect);
  rect = new Phaser.Geom.Rectangle(wallRight, wallTop, wallThickness, gameHeight - wallTop);
  graphics.fillRectShape(rect);
}

function restartGame() {
  game.state.start(game.state.current);
}