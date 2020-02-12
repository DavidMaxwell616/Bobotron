var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 480,
  parent: 'game',
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
};

var game = new Phaser.Game(config);
gameWidth = config.width;
gameHeight = config.height;
wallBottom = gameHeight - 5;
wallRight = gameWidth - 5;
var _scene;
var _changingTimer = 0;
var _menuRendered = false;
var _levelRendered = false;
var _levelStarted = false;
var _gameState;

function create() {
  score = 0;
  _scene = this;
  graphics = this.add.graphics();
  _changingTimer = 2 * SECS_TO_NOMINALS;
  makeColorArray();

  Family = this.physics.add.group();
  Enemies = this.physics.add.group();
  Bullets = this.physics.add.group();
  Particles = this.physics.add.group();
  Logos = this.physics.add.group();
  Rewards = this.physics.add.group();
  maxxdaddy = this.add.image(0, 0, 'maxxdaddy');
  maxxdaddy
    .setPosition(gameWidth - maxxdaddy.width, gameHeight - maxxdaddy.height)
    .setOrigin(0);

  this.physics.add.collider(Bullets, Enemies, function (bullet, enemy) {
    bulletHitEnemy(bullet, enemy);
  });

  // this.physics.add.collider(Enemies, Family, function (enemy, member) {
  //   enemyHitFamily(enemy, member);
  // });

  // this.physics.add.collider(Enemies, Protagonist, function (enemy, player) {
  //   enemyHitProtagonist(enemy, player);
  // });

  this.physics.add.collider(Rewards, Protagonist, function (reward, player) {
    protagonistHitReward(reward, player);
  });

  _gameState = gameState.Playing;
}

function updateStats() {
  levelText.setText('LEVEL: ' + level);
  scoreText.setText('SCORE: ' + score);
  ammoText.setText('AMMO: ' + ammo);
  shieldText.setText('SHIELD: ' + Math.ceil(shieldTime / SECS_TO_NOMINALS));
  //livesText.setText('LIVES: ' + lives);
}

function renderLevelChanger() {
  var halfWidth = gameWidth / 2;
  var halfHeight = (gameHeight - wallTop) / 2;
  var yMiddle = wallTop + halfHeight;
  var layerOffsetX = 5;
  var layerOffsetY = halfHeight / (halfWidth / layerOffsetX);
  var layers = halfWidth / layerOffsetX;
  // if (_isRefreshingLevel) {
  //   var alpha;
  //   if (_changingTimer > SECS_TO_NOMINALS) {
  //     alpha = (2 * SECS_TO_NOMINALS - _changingTimer) / SECS_TO_NOMINALS;
  //   } else {
  //     alpha = _changingTimer / SECS_TO_NOMINALS;
  //     if (alpha < 0) alpha = 0;
  //     // entityManager.clearPartial();
  //     // entityManager.resetPos();
  //   }
  //   var rect = new Phaser.Geom.Rectangle(
  //     wallLeft,
  //     wallTop + wallThickness,
  //     wallRight - wallThickness,
  //     wallBottom - wallThickness,
  //   );
  //   graphics.fillStyle(0xff0000, alpha);
  //   graphics.fillRectShape(rect);
  // } else {
  if (_changingTimer > SECS_TO_NOMINALS) {
    var range = (2 * SECS_TO_NOMINALS - _changingTimer) / SECS_TO_NOMINALS;
    var currentLayer = Math.floor(range * layers);

    for (var i = 1; i < currentLayer; i++) {
      if (i % colors.length < i * colors.length) {
        graphics.fillStyle(colors[i % colors.length], 1);
      }
      var rect = new Phaser.Geom.Rectangle(
        halfWidth - i * layerOffsetX,
        yMiddle - i * layerOffsetY,
        i * layerOffsetX * 2,
        i * layerOffsetY * 2,
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
      var rect = new Phaser.Geom.Rectangle(
        i * layerOffsetX,
        wallTop + i * layerOffsetY,
        gameWidth - i * layerOffsetX * 2,
        gameHeight - wallTop - i * layerOffsetY * 2,
      );
      graphics.fillRectShape(rect);
    }

    range = (SECS_TO_NOMINALS - _changingTimer) / SECS_TO_NOMINALS;
    currentLayer = Math.ceil(range * layers);

    graphics.fillStyle(0x000000, 1);
    var rect = new Phaser.Geom.Rectangle(
      halfWidth - currentLayer * layerOffsetX,
      yMiddle - currentLayer * layerOffsetY,
      currentLayer * layerOffsetX * 2,
      currentLayer * layerOffsetY * 2,
    );
    graphics.fillRectShape(rect);
  }
  // }
  //graphics.restore();
  // graphics.clear();
  // Reset changing timer when level changing is complete
  if (_changingTimer < 0) {
    _gameState = gameState.Playing;
    _changingTimer = 2 * SECS_TO_NOMINALS;
  }
}

function animateMenu() {
  var members = Logos.getChildren();
  members.forEach(element => {
    element.x += element.xv;
    element.y += element.yv;
    if (element.x > gameWidth - 16 && element.xv == 1) {
      element.x = gameWidth - 16;
      element.xv = 0;
      element.yv = 1;
    } else if (element.x < 16 && element.xv == -1) {
      element.x = 16;
      element.xv = 0;
      element.yv = -1;
    } else if (element.y > gameHeight - 16 && element.yv == 1) {
      element.y = gameHeight - 16;
      element.yv = 0;
      element.xv = -1;
    } else if (element.y < 16 && element.yv == -1) {
      element.y = 16;
      element.yv = 0;
      element.xv = 1;
    }
  });
}

function renderMenu() {
  var splash = _scene.add.image(gameWidth / 2, gameHeight / 2, 'splash');
  for (let index = 0; index < 25; index++) {
    var frame = index % 8;
    addLogo(index * 32 + 16, 16, 1, 0, frame);
    addLogo(gameWidth - (index * 32 + 16), gameHeight - 16, -1, 0, frame);
  }
  for (let index = 0; index < 15; index++) {
    var frame = index % 8;
    addLogo(16, index * 32 + 16, 0, -1, frame);
    addLogo(gameWidth - 16, index * 32 + 16, 0, 1, frame);
  }
  _scene.input.keyboard.on('keydown_R', function (event) {
    if (_gameState != gameState.Menu) return;
    splash.destroy();
    _gameState = gameState.Transition;
    Logos.clear(true);
  });
  _menuRendered = true;
}

function renderLevelChanger() {
  var halfWidth = gameWidth / 2;

  var halfHeight = (gameHeight - wallTop) / 2;
  var yMiddle = wallTop + halfHeight;
  var layerOffsetX = 5;
  var layerOffsetY = halfHeight / (halfWidth / layerOffsetX);
  var layers = halfWidth / layerOffsetX;

  if (_changingTimer > SECS_TO_NOMINALS) {
    var range = (2 * SECS_TO_NOMINALS - _changingTimer) / SECS_TO_NOMINALS;
    var currentLayer = Math.floor(range * layers);

    for (var i = 1; i < currentLayer; i++) {
      if (i % colors.length < i * colors.length) {
        graphics.fillStyle(colors[i % colors.length], 1);
      }
      var rect = new Phaser.Geom.Rectangle(
        halfWidth - i * layerOffsetX,
        yMiddle - i * layerOffsetY,
        i * layerOffsetX * 2,
        i * layerOffsetY * 2,
      );
      graphics.fillRectShape(rect);
    }
  } else {
    range = (SECS_TO_NOMINALS - _changingTimer) / SECS_TO_NOMINALS;
    currentLayer = Math.ceil(range * layers);

    var rect = new Phaser.Geom.Rectangle(
      halfWidth - currentLayer * layerOffsetX,
      yMiddle - currentLayer * layerOffsetY,
      currentLayer * layerOffsetX * 2,
      currentLayer * layerOffsetY * 2,
    );
    graphics.fillStyle(0x000000, 1);
    graphics.fillRectShape(rect);
  }
  // Reset changing timer when level changing is complete
  if (_changingTimer < 0) {
    _gameState = gameState.Playing;
    //   _levelRendered = false;
    _levelStarted = false;
    _changingTimer = 2 * SECS_TO_NOMINALS;
  }
}

function addLogo(x, y, xv, yv, f) {
  var logo = _scene.add.sprite(x, y, 'w');
  logo.xv = xv;
  logo.yv = yv;
  logo.setFrame(f);
  Logos.add(logo);
}

function renderGameOver() {
  var gameOverText = _scene.add.text(
    gameWidth / 2,
    gameHeight / 2,
    'GAME OVER', {
      fontFamily: 'Arial',
      fontSize: '60px',
      fill: 'red',
    },
  );
  var timedEvent = _scene.time.delayedCall(
    3000,
    function () {
      gameOverText.destroy();
      _gameState = gameState.Menu;
    },
    [],
    _scene,
  );
}

// the game loop. Game logic lives in here.
// is called every frame
function update() {
  switch (_gameState) {
    case gameState.Menu:
      if (!_menuRendered) renderMenu();
      else animateMenu();
      break;
    case gameState.Transition:
      renderLevelChanger();
      _changingTimer -= 1;
      break;
    case gameState.Playing:
      if (!_levelRendered) {
        renderLevel();
        _levelRendered = true;
      }
      if (!_levelStarted) {
        startLevel(this);
        _levelStarted = true;
      } else {
        moveEntities(this);
        updateStats();
        if (Enemies.getLength() == 0 && Particles.getLength() == 0) {
          clearLevel();
          level++;
          _gameState = gameState.Transition;
        }
      }
      break;
    default:
      break;
  }
}

function protagonistHitReward(player, reward) {
  score += scoreValues.Electrode;
  reward.destroy();
}

function clearLevel() {
  Family.clear(true);
  Particles.clear(true);
  Enemies.clear(true);
  Bullets.clear(true);
  Protagonist.x = gameWidth / 2;
  Protagonist.y = gameHeight / 2;
  Protagonist.velX = 0;
  Protagonist.velY = 0;
  graphics.clear();
}

function restart() {
  lives--;
  game.state.restart();
}

function renderLevel() {
  graphics.clear();
  // Display score bar
  graphics.fillStyle(0x000000, 1);
  graphics.fillRect(0, 0, gameWidth, wallTop);

  // Display the score
  scoretxt = 'Score: ' + score;
  scoreText = _scene.add.text(5, 5, scoretxt, {
    fontFamily: 'Arial',
    fontSize: '20px',
    fill: 'red',
  });

  //display the multiplier and the level
  var disp = 'X' + multiplier + '  Level: ' + level;
  levelText = _scene.add.text(gameWidth / 2 - 140, 5, disp, {
    fontFamily: 'Arial',
    fontSize: '20px',
    fill: 'red',
  });

  // Display ammo
  var text = 'Ammo: ' + ammo;
  ammoText = _scene.add.text(gameWidth / 2, 5, text, {
    fontFamily: 'Arial',
    fontSize: '20px',
    fill: 'red',
  });
  // Display shield
  var moretxt = 'Shield: ' + Math.ceil(shieldTime / SECS_TO_NOMINALS);
  shieldText = _scene.add.text(gameWidth / 2 + 130, 5, moretxt, {
    fontFamily: 'Arial',
    fontSize: '20px',
    fill: 'red',
  });

  // Display remaining lives
  for (var i = 1; i < lives; i++) {
    _scene.add.image(Extralife, gameWidth - i * 20, 15);
  }

  // Display border
  graphics.fillStyle(0xffffff, 1);
  // graphics.fillStyle(colors[colorCounter % colors.length], 1);
  var rect = new Phaser.Geom.Rectangle(0, wallTop, gameWidth, wallThickness);
  graphics.fillRectShape(rect);
  rect = new Phaser.Geom.Rectangle(0, wallTop, wallLeft, gameHeight - wallTop);
  graphics.fillRectShape(rect);
  rect = new Phaser.Geom.Rectangle(0, wallBottom, gameWidth, wallThickness);
  graphics.fillRectShape(rect);
  rect = new Phaser.Geom.Rectangle(
    wallRight,
    wallTop,
    wallThickness,
    gameHeight - wallTop,
  );
  graphics.fillRectShape(rect);
}

function addMultiplier() {
  if (multiplier < 5) {
    multiplier += 1;
  }
}

function resetMultiplier() {
  multiplier = 1;
}

function restartGame() {
  game.state.start(game.state.current);
}