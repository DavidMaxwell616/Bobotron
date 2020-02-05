var _scene;

function initEntities(levelData) {
  // Key:
  // Family, Electrodes, Grunts, Hulks, Spheroids, Brains, Quarks (not the Star Trek DS9 version)
  initProtagonist();
  initFamily(levelData[0]);
  //initElectrodes(levelData[1]);
  initGrunts(levelData[2]);
  // initHulks(levelData[3]);
  // initSpheroids(levelData[4]);
  // initBrains(levelData[5]);
  // initQuarks(levelData[6]);
}
//LEVEL STUFF

var _levelSpecs = [
  // Each number in the level array represents how many entities of the
  // corresponding type should be created. There is always one protagonist,
  // so we skip him in the level description

  [], // level "0", skipped automatically
  [2, 0, 6],
  [3, 4, 8, 2],
  [5, 6, 10, 4]
];

var scoreValues = {
  Electrode: 5,
  Spark: 25,
  Shell: 50,
  CruiseMissile: 75,
  Prog: 100,
  Grunt: 100,
  Enforcer: 200,
  Tank: 300,
  Brain: 500,
  Spheroid: 1000,
  Quark: 1000,
  Family: 1000,
  Powerup: 300
};

function startLevel(scene) {
  // Create a fresh level
  _scene = scene;

  var randomLevelRequired = level >= _levelSpecs.length;
  var L = level;

  if (randomLevelRequired) {
    var randomlevel = generateLevel(L);
    initEntities(randomlevel);

    numberOfEntities = randomlevel.reduce(function (a, b) {
      return a + b;
    }, 0);
  } else {
    initEntities(_levelSpecs[level]);
    numberOfEntities = _levelSpecs[level].reduce(function (a, b) {
      return a + b;
    }, 0);
  }
}

function drawDad() {
  for (let index = 0; index < 12; index++) {
    var dad = _scene.add.sprite(index * 20, gameHeight / 2 + 50, 'spriteMap', 'Dad_0' + index + '.png');

  }
}

function findClosestFamilyMember(posX, posY) {
  var closest = null;
  var minDistSq = Infinity;
  for (var i = 0; i < this._family.length; i++) {
    var member = this._family[i];
    var distSq = util.distSq(posX, posY, member.cx, member.cy);
    if (distSq < minDistSq) {
      closest = member;
      minDistSq = distSq;
    }
  }
  return closest;
}

function initProtagonist() {
  var _bulletVel = 10;
  Protagonist = _scene.add.sprite(gameWidth / 2, gameHeight / 2, 'spriteMap', 'Protagonist_07.png');
  Protagonist.speed = 1;
  Protagonist.name = 'Protagonist';
  initPeopleAnimations(Protagonist);
  Protagonist.velX = 0;
  Protagonist.velY = 0;
  var isMoving = false;
  //move Protagonist
  _scene.input.keyboard.on('keydown_LEFT', function (event) {
    movePlayer('left');
  });

  _scene.input.keyboard.on('keydown_RIGHT', function (event) {
    movePlayer('right');
  });

  _scene.input.keyboard.on('keydown_UP', function (event) {
    movePlayer('up');
  });

  _scene.input.keyboard.on('keydown_DOWN', function (event) {
    movePlayer('down');
  });
  //Protagonist shoots
  _scene.input.keyboard.on('keydown_Q', function (event) {
    fireBullet(Protagonist.x, Protagonist.y, -_bulletVel, -_bulletVel)
  });

  _scene.input.keyboard.on('keydown_W', function (event) {
    fireBullet(Protagonist.x, Protagonist.y, 0, -_bulletVel)
  });

  _scene.input.keyboard.on('keydown_E', function (event) {
    fireBullet(Protagonist.x, Protagonist.y, _bulletVel, -_bulletVel)
  });

  _scene.input.keyboard.on('keydown_A', function (event) {
    fireBullet(Protagonist.x, Protagonist.y, -_bulletVel, 0)
  });
  _scene.input.keyboard.on('keydown_D', function (event) {
    fireBullet(Protagonist.x, Protagonist.y, _bulletVel, 0)
  });

  _scene.input.keyboard.on('keydown_Z', function (event) {
    fireBullet(Protagonist.x, Protagonist.y, -_bulletVel, _bulletVel)
  });

  _scene.input.keyboard.on('keydown_X', function (event) {
    fireBullet(Protagonist.x, Protagonist.y, 0, _bulletVel)
  });

  _scene.input.keyboard.on('keydown_C', function (event) {
    fireBullet(Protagonist.x, Protagonist.y, _bulletVel, _bulletVel)
  });

}

function initPeopleAnimations(entity) {
  setupAnimation(entity, 1, 3, 'WalkLeft');
  setupAnimation(entity, 4, 6, 'WalkRight');
  setupAnimation(entity, 7, 9, 'WalkDown');
  setupAnimation(entity, 10, 12, 'WalkUp');

}

function setupAnimation(entity, start, end, movement) {
  var frameNames = _scene.anims.generateFrameNames('spriteMap', {
    start: start,
    end: end,
    zeroPad: 2,
    prefix: entity.name + '_',
    suffix: '.png'
  });
  var anim = _scene.anims.create({
    key: entity.name + movement,
    frames: frameNames,
    frameRate: 5,
    repeat: -1
  });
}

function initFamily(number) {

  var playerSafeDist = 120;

  var dad = _scene.add.sprite(0, 0, 'spriteMap', 'Dad_01.png');
  var descr = findSpawn(playerSafeDist);
  dad.setPosition(descr.cx, descr.cy);
  setFamilyProperties(dad);
  dad.name = 'Dad';
  initPeopleAnimations(dad);
  Family.add(dad);
  if (number < 2)
    return;
  var mom = _scene.add.sprite(0, 0, 'spriteMap', 'Mom_01.png');
  var descr = findSpawn(playerSafeDist);
  mom.setPosition(descr.cx, descr.cy);
  setFamilyProperties(mom);
  mom.name = 'Mom';
  initPeopleAnimations(mom);
  Family.add(mom);
  if (number < 3)
    return;
  for (let index = 0; index < number - 3; index++) {
    var child = _scene.add.sprite(0, 0, 'spriteMap', 'Child_01.png');
    var descr = findSpawn(playerSafeDist);
    child.setPosition(descr.cx, descr.cy);
    setFamilyProperties(child);
    child.name = 'Child';
    initPeopleAnimations(child);
    Family.add(child);
  }

}

function setFamilyProperties(member) {
  member.rotation = 0;
  member.velX = 1;
  member.velY = 0;
  member.stepsize = 10;
  member.panic = 1;
  member.lifeSpan = 1 * SECS_TO_NOMINALS;
  member.isDying = false;
  member.willSpawnProg = false;
  member.facing = 0;
  member.speed = 1;
}

function findSpawn(playerSafeDist) {
  // A function to prevent the Enemies from 
  // spawning too close to the protagonist
  for (var i = 0; i < 100; i++) {
    var x = Phaser.Math.Between(wallLeft, wallRight);
    var y = Phaser.Math.Between(wallTop, wallBottom);

    var locationFound = true;

    var pPos = Protagonist.getCenter();
    var dstSq = distSq(x, y, pPos.x, pPos.y);
    if (dstSq < square(playerSafeDist))
      locationFound = false;

    if (!locationFound) continue;

    return {
      cx: x,
      cy: y
    };
  }
};



function initGrunts(number) {
  for (let index = 0; index < number; index++) {
    var playerSafeDist = 120;
    var descr = findSpawn(playerSafeDist);
    var grunt = _scene.add.sprite(descr.cx, descr.cy, 'spriteMap', 'Grunt_01.png');
    grunt.stepsize = 3;
    grunt.baseSpeed = 1;
    grunt.speed = .5;
    grunt.maxSpeed = 3;
    grunt.maxRageReachedTime = 40 * SECS_TO_NOMINALS;
    grunt.name = 'Grunt';
    grunt.value = scoreValues.Grunt * multiplier;
    grunt.takeBulletHit = true;
    setupAnimation(grunt, 1, 3, 'Walk');
    Enemies.add(grunt);
  }
};

function initHulks(number) {
  for (let index = 0; index < number; index++) {
    var playerSafeDist = 120;
    var descr = findSpawn(playerSafeDist);
    var hulk = _scene.add.sprite(descr.cx, descr.cy, 'spriteMap', 'Hulk_01.png');
    hulk.killFamily = true;
    hulk.stepsize = 12;
    hulk.bootTime = 2 * SECS_TO_NOMINALS;
    hulk.brainpower = 0.05;
    hulk.facing = 0;
    Enemies.add(hulk);
  }
};

function initBrains(number) {
  for (let index = 0; index < number; index++) {
    var playerSafeDist = 120;
    var descr = findSpawn(playerSafeDist);
    var brain = _scene.add.sprite(descr.cx, descr.cy, 'spriteMap', 'Brain_01.png');
    Enemies.add(brain);
  }
};

function initElectrodes(number) {
  for (let index = 0; index < number; index++) {
    var playerSafeDist = 120;
    var descr = findSpawn(playerSafeDist);
    descr.shapes = Math.floor(Math.random() * 7);
    var electrode = _scene.add.sprite(descr.cx, descr.cy, 'spriteMap', 'Electrode_01.png');
    electrode.setFrame(descr.shapes);
    Enemies.add(electrode);
  }
};

function initProg(cx, cy) {
  var prog = _scene.add.sprite(cx, cy, 'spriteMap', 'Prog_01.png');
  Enemies.add(prog);
};

function initQuarks(scene, number) {
  for (let index = 0; index < number; index++) {
    var playerSafeDist = 120;
    var descr = findSpawn(playerSafeDist);
    var quark = _scene.add.sprite(descr.cx, descr.cy, 'spriteMap', 'Quark_01.png');
    Enemies.add(quark);
  }
};

function initTank(cx, cy) {
  var tank = _scene.add.sprite(cx, cy, 'spriteMap', 'Tank_01.png');
  Enemies.add(tank);
};

function initSpheroids(number) {
  for (let index = 0; index < number; index++) {
    var playerSafeDist = 120;
    var descr = this.findSpawn(playerSafeDist);
    var spheroid = _scene.add.sprite(descr.cx, descr.cy, 'spriteMap', 'Spheroid_01.png');
    Enemies.add(spheroid);
  }
};

function initEnforcer(cx, cy) {
  var enforcer = _scene.add.sprite(cx, cy, 'spriteMap', 'Enforcer_01.png');
  Enemies.add(enforcer);
};

function fireCruiseMissile(cx, cy) {
  var missile = _scene.add.sprite(cx, cy, 'spriteMap', 'Cruise_Missile_01.png');
  Bullets.add(missile);
};

function fireShell(cx, cy, angle) {
  var shell = _scene.add.sprite(cx, cy, 'spriteMap', 'Shell_01.png');
  shell.angle = angle;
  Bullets.add(shell);
};

function fireSpark(cx, cy, angle) {
  var spark = _scene.add.sprite(cx, cy, 'spriteMap', 'Spark_01.png');
  spark.angle = angle;
  Bullets.add(spark);
};

function fireBullet(cx, cy, dirnX, dirnY) {
  if (ammo == 0)
    return;
  ammo--
  Bullets.add(new Projectile({
    x: cx,
    y: cy,
    velX: dirnX,
    velY: dirnY
  }));
  ammo--;
};

function Projectile(descr) {
  if (descr.velX == 0 && descr.velY == 0)
    descr.velX = 0;
  var newSprite;
  switch (true) {
    case Protagonist.hasShotgun:
      var graphics = _scene.add.graphics();
      var circle = new Phaser.Geom.Circle(descr.x, descr.y, 6);
      graphics.fillStyle(0xffffff, .3);
      graphics.fillCircleShape(circle);
      circle = new Phaser.Geom.Circle(descr.x, descr.y, 4);
      graphics.fillStyle(0xffa500, .6);
      graphics.fillCircleShape(circle);
      circle = new Phaser.Geom.Circle(descr.x, descr.y, 3);
      graphics.fillStyle(0xffa500, .8);
      graphics.fillCircleShape(circle);
      circle = new Phaser.Geom.Circle(descr.x, descr.y, 1);
      graphics.fillStyle(0xffffff, 1);
      graphics.fillCircleShape(circle);
      var texture = graphics.generateTexture('bullet');
      newSprite = _scene.add.sprite(descr.x, descr.y, 'bullet');
      newSprite.velX = descr.velX;
      newSprite.velY = descr.velY;
      graphics.destroy();
      break;
    case Protagonist.hasMachineGun:
      var graphics = _scene.add.graphics();
      var circle = new Phaser.Geom.Circle(descr.x, descr.y, 6);
      graphics.fillStyle(0xffffff, .3);
      graphics.fillCircleShape(circle);
      circle = new Phaser.Geom.Circle(descr.x, descr.y, 4);
      graphics.fillStyle(0xffa500, .6);
      graphics.fillCircleShape(circle);
      circle = new Phaser.Geom.Circle(descr.x, descr.y, 3);
      graphics.fillStyle(0xffa500, .8);
      graphics.fillCircleShape(circle);
      circle = new Phaser.Geom.Circle(descr.x, descr.y, 1);
      graphics.fillStyle(0xffffff, 1);
      graphics.fillCircleShape(circle);
      var texture = graphics.generateTexture('bullet');
      newSprite = _scene.add.sprite(descr.x, descr.y, 'bullet');
      newSprite.velX = descr.velX;
      newSprite.velY = descr.velY;
      graphics.destroy();
      //case Protagonist.hasMachineGun:
      // ctx.strokeStyle = 0x008b8b; //cyan
      // ctx.fillStyle = 0x008b8;
      //var dirn = util.angleTo(this.cx, this.cy, this.prevX, this.prevY);
      //var x = this.cx + 10 * Math.cos(dirn);
      //var y = this.cy + 10 * Math.sin(dirn);
      // ctx.globalAlpha = 0.4;
      // ctx.beginPath();
      // ctx.moveTo(this.cx, this.cy);
      // ctx.lineTo(x, y);
      // ctx.lineWidth = 8;
      // ctx.stroke();
      // util.fillCircle(ctx, this.cx, this.cy, 4);

      // ctx.globalAlpha = 0.6;
      // ctx.beginPath();
      // ctx.moveTo(this.cx, this.cy);
      // ctx.lineTo(x, y);
      // ctx.lineWidth = 4;
      // ctx.stroke();
      // util.fillCircle(ctx, this.cx, this.cy, 2);

      // ctx.strokeStyle = "white";
      // ctx.fillStyle = "white";
      // ctx.globalAlpha = 1;
      // ctx.beginPath();
      // ctx.moveTo(this.cx, this.cy);
      // ctx.lineTo(x, y);
      // ctx.lineWidth = 2;
      // ctx.stroke();

      // ctx.restore();
      //  break;
    default:
      var graphics = _scene.add.graphics();
      var circle = new Phaser.Geom.Circle(3, 3, 6);
      graphics.fillStyle("white", .5);
      graphics.fillCircleShape(circle);
      circle = new Phaser.Geom.Circle(3, 3, 4);
      graphics.fillStyle(0x32cd32, .8);
      graphics.fillCircleShape(circle);
      circle = new Phaser.Geom.Circle(3, 3, 2);
      graphics.fillStyle(0xffffff, 1);
      graphics.fillCircleShape(circle);
      var texture = graphics.generateTexture('bullet', 6, 6);
      newSprite = _scene.add.sprite(descr.x, descr.y, 'bullet');
      newSprite.velX = descr.velX;
      newSprite.velY = descr.velY;
      newSprite.lifeSpan = 100;
      newSprite.setScale(.7);
      newSprite.setOrigin(.5);
      graphics.destroy();
  }
  return newSprite;
};


function spawnFragment(num, specificColor) {

  var explosionColors = ["yellow", "orange", "red", "grey", "white"];

  for (var i = 0; i < num; i++) {
    var dirn = Math.random() * 2 * Math.PI;
    var color;
    if (specificColor === undefined) {
      var colorId = Math.floor(Math.random() * 5);
      color = explosionColors[colorId];
    } else {
      color = specificColor;
    }
    var descr = {
      cx: this.cx,
      cy: this.cy,
      dirn: dirn,
      color: color
    };
    createParticle(descr);
  }
};

// ------------------------
// Particle effects methods

// function createCMTrail(cx, cy) {
//   Particles.add(new CMTrail({cx: cx, cy: cy}));
// };

function createParticle(descr) {
  Particles.add(new Particle(descr));
};

function Particle(descr) {
  var newSprite;
  Particle.lifeSpan = SECS_TO_NOMINALS / 2;
  var alpha = 1;
  var fadeThresh = 3 * Particle.lifeSpan / 4;
  var graphics = _scene.add.graphics();
  if (Particle.lifeSpan < fadeThresh) {
    alpha = Particle.lifeSpan / fadeThresh;
    descr.radius = descr.radius * Particle.lifeSpan / fadeThresh;
  }
  var circle = new Phaser.Geom.Circle(0, 0, descr.radius);
  var color = descr.color.replace("#", "0x");
  graphics.fillStyle(color, alpha);
  graphics.fillCircleShape(circle);
  var texture = graphics.generateTexture('particle', descr.radius * 2, descr.radius * 2);
  newSprite = _scene.add.sprite(descr.cx, descr.cy, 'particle');
  newSprite.velX = 1;
  newSprite.velY = 1;
  newSprite.speed = 10;
  newSprite.dirn = descr.dirn;
  graphics.destroy();
  return newSprite;
}