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
  rects = _scene.add.group();
  nextRect = _scene.time.now + rectDelay;
  colorNum = 0;

  Family = this.physics.add.group();
  Enemies = this.physics.add.group();
  Bullets = this.physics.add.group();
  Particles = this.physics.add.group();
  Logos = this.physics.add.group();
  ExtraLives = this.physics.add.group();
  Rewards = this.physics.add.group();
  maxxdaddy = this.add.image(0, 0, 'maxxdaddy');
  maxxdaddy
    .setPosition(gameWidth - maxxdaddy.width-35, gameHeight - maxxdaddy.height*2)
    .setOrigin(0);

  this.physics.add.collider(Bullets, Enemies, function (bullet, enemy) {
    bulletHitEnemy(bullet, enemy);
  });

  this.physics.add.collider(Enemies, Family, function (enemy, member) {
    enemyHitFamily(enemy, member);
  });

  Protagonist = this.physics.add.sprite(
    gameWidth / 2,
    gameHeight / 2,
    'spriteMap',
    'Protagonist_07.png',
  );
  Protagonist.visible = false;

  this.physics.add.collider(Protagonist, Enemies, function (player, enemy) {
    protagonistHitEnemy(player, enemy);
  });

  this.physics.add.collider(Rewards, Protagonist, function (reward, player) {
    protagonistHitReward(reward, player);
  });

setUpArrows();
this.input.on('gameobjectdown',onObjectClicked);
  _gameState = gameState.Menu;
}

function onObjectClicked(pointer,gameObject){
  switch (gameObject.name) {
  case 'right':
    arrowTouched=true;
    movePlayer('right');
    break;
  case 'left':
    arrowTouched=true;
    movePlayer('left');
    break;
  case 'up':
    arrowTouched=true;
    movePlayer('up');
    break;
  case 'down':
    arrowTouched=true;
    movePlayer('down');
    break;
  default:
    break;
}
}

function setUpArrows(){
 for (let index = 0; index < arrows.length; index++) {
  var arrow = arrowStats[index];
  arrows[index] = _scene.add.image(0,0,'arrow');
   arrows[index].setScale(.25).setOrigin(.5);
  arrows[index].x = arrows[index].width*.25+20+arrow.xOffset;
  arrows[index].y =gameHeight -arrows[index].width*.25+-20+arrow.yOffset;
  arrows[index].visible = false;
  arrows[index].name= arrow.direction;
  arrows[index].setInteractive();
  arrows[index].angle =arrow.angle;  
 }
 
 
}
function updateStats() {
  levelText.setText('LEVEL: ' + level);
  scoreText.setText('SCORE: ' + score);
  ammoText.setText('AMMO: ' + ammo);
  shieldText.setText('SHIELD: ' + Math.ceil(shieldTime / SECS_TO_NOMINALS));
  //livesText.setText('LIVES: ' + lives);
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
  splash = _scene.add.image(gameWidth / 2, gameHeight / 2, 'splash');
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
  _scene.input.keyboard.on('keydown_SPACE', Fire);
  _scene.input.on('pointerdown', TouchFire);
  _menuRendered = true;
}

function Fire(){
    if (_gameState != gameState.Menu) return;
    splash.destroy();
    _isRefreshingLevel = true;
    nextRect = _scene.time.now + rectDelay;
    _gameState = gameState.Transition;
    Logos.clear(true);
}

function TouchFire(){
  if (_gameState === gameState.Menu){

  splash.destroy();
  _isRefreshingLevel = true;
  nextRect = _scene.time.now + rectDelay;
  _gameState = gameState.Transition;
  Logos.clear(true);
}
else if(_gameState === gameState.Playing)
{
  
  var x = _scene.input.activePointer.x;
  var y = _scene.input.activePointer.y;
  var _bulletVelX = x>Protagonist.x+10 ? 10 : x<Protagonist.x-10?-10:0;
  var _bulletVelY = y>Protagonist.y+10 ? 10 : y<Protagonist.y-10?-10:0;
  console.log(arrowTouched);
  if(!arrowTouched)
    fireBullet(Protagonist.x, Protagonist.y, _bulletVelX, _bulletVelY);
}
}

function renderLevelChanger() {
  var halfWidth = gameWidth / 2;
  var halfHeight = (gameHeight - wallTop) / 2;
  if(rects.children.entries.length<halfWidth/rectStep){
    var r = _scene.add.rectangle(halfWidth, halfHeight, rectWidth, rectHeight);
    var color = Phaser.Display.Color.HexStringToColor(colors[colorNum]).color;
    r.setStrokeStyle(3, color);
    rects.add(r);
    rectWidth+=12;
    rectHeight+=7;     
    nextRect = _scene.time.now + rectDelay;
    colorNum++
    if(colorNum>31)colorNum=0;
}
else
{
if(rectCount<rects.children.entries.length){
rects.children.entries[0].destroy();
rectCount++;
}
else{
  rectCount=0;
  rects.clear();
  rectWidth=10;
  rectHeight=5;
  _isRefreshingLevel = false;
  _gameState = gameState.Playing;
    //   _levelRendered = false;
    _levelStarted = false;
    graphics.clear();
  }
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
  arrowTouched= false;
  
  switch (_gameState) {
    case gameState.Menu:
      if (!_menuRendered) renderMenu();
      else animateMenu();
      break;
    case gameState.Transition:
      if(_isRefreshingLevel && _scene.time.now<nextRect)       
         renderLevelChanger();
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
        var enemiesLeft = Enemies.getChildren().filter(function (value) {
          return value.name != 'Hulk';
        });
        if (enemiesLeft == 0 && Particles.getLength() == 0) {
          clearLevel();
          level++;
          _isRefreshingLevel = true;
          nextRect = _scene.time.now + rectDelay;
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
  Rewards.clear(true);
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
    var extralife = _scene.physics.add.sprite(
      gameWidth - i * 20,
      15,
      'spriteMap',
      'extralife.png',
    );
    ExtraLives.add(extralife);
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