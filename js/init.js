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

function drawSprite() {
  for (let index = 0; index < 12; index++) {
    var dad = _scene.add.sprite(index * 20, gameHeight / 2 + 50, 'spriteMap', 'Dad_0' + index + '.png');

  }
}

function findClosestFamilyMember(posX, posY) {
  var closest = null;
  var minDistSq = Infinity;
  for (var i = 0; i < this._family.length; i++) {
    var member = this._family[i];
    var distSq = util.distSq(posX, posY, member.x, member.y);
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
  dad.setPosition(descr.x, descr.y);
  setFamilyProperties(dad);
  dad.name = 'Dad';
  initPeopleAnimations(dad);
  Family.add(dad);
  if (number < 2)
    return;
  var mom = _scene.add.sprite(0, 0, 'spriteMap', 'Mom_01.png');
  var descr = findSpawn(playerSafeDist);
  mom.setPosition(descr.x, descr.y);
  setFamilyProperties(mom);
  mom.name = 'Mom';
  initPeopleAnimations(mom);
  Family.add(mom);
  if (number < 3)
    return;
  for (let index = 0; index < number - 3; index++) {
    var child = _scene.add.sprite(0, 0, 'spriteMap', 'Child_01.png');
    var descr = findSpawn(playerSafeDist);
    child.setPosition(descr.x, descr.y);
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
      x,
      y
    };
  }
};



function initGrunts(number) {
  for (let index = 0; index < number; index++) {
    var playerSafeDist = 120;
    var descr = findSpawn(playerSafeDist);
    var grunt = _scene.add.sprite(descr.x, descr.y, 'spriteMap', 'Grunt_01.png');
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
    var hulk = _scene.add.sprite(descr.x, descr.y, 'spriteMap', 'Hulk_01.png');
    hulk.killFamily = true;
    hulk.stepsize = 12;
    hulk.bootTime = 2 * SECS_TO_NOMINALS;
    hulk.brainpower = 0.05;
    hulk.facing = 0;
    hulk.name = 'Hulk';
    setupAnimation(hulk, 1, 3, 'Walk');
    Enemies.add(hulk);
  }
};

function initBrains(number) {
  for (let index = 0; index < number; index++) {
    var playerSafeDist = 120;
    var descr = findSpawn(playerSafeDist);
    var brain = _scene.add.sprite(descr.x, descr.y, 'spriteMap', 'Brain_01.png');
    brain.killFamily = true;
    brain.stepsize = 3;
    brain.makesProgs = true;
    brain.missileFireChance = 0.005; // 0.5% chance of firing a CM per update
    // TODO: Find a good firing interval for the missiles.
    brain.dropChance = 0.9; // 90% chance of a random drop
    brain.bootTime = SECS_TO_NOMINALS;
    brain.facing = 0;
    brain.name = 'Brain';
    setupAnimation(brain, 1, 3, 'Walk');
    Enemies.add(brain);
  }
};

function initElectrodes(number) {
  for (let index = 0; index < number; index++) {
    var playerSafeDist = 120;
    var descr = findSpawn(playerSafeDist);
    descr.shapes = Math.floor(Math.random() * 7);
    var electrode = _scene.add.sprite(descr.x, descr.y, 'spriteMap', 'Electrode_01.png');
    electrode.setFrame(descr.shapes);
    Enemies.add(electrode);
  }
};

function initProg(x, y) {
  var prog = _scene.add.sprite(x, y, 'spriteMap', 'Prog_01.png');
  prog.speed = 1.5;
  prog.renderPos = {
    x: 0,
    y: 0
  };
  prog.stepsize = 15;
  prog.facing = 0;
  Enemies.add(prog);
};

function initQuarks(scene, number) {
  for (let index = 0; index < number; index++) {
    var playerSafeDist = 120;
    var descr = findSpawn(playerSafeDist);
    var quark = _scene.add.sprite(descr.x, descr.y, 'spriteMap', 'Quark_01.png');
    quark.baseSpeed = 1;
    quark.velX = quark.baseSpeed * randTrinary();
    quark.velY = quark.baseSpeed * randTrinary();
    quark.tanksSpawned = 0;
    // TODO play spawning sound?
    quark.makeWarpParticles();
    quark.tankSpawnChance = 0.005; //0,5% chance of spawning a tank/update
    // TODO: Find a good spawn interval.
    quark.maxTanks = 6;
    quark.constructionTime = SECS_TO_NOMINALS;
    quark.name = 'Quark';
    setupAnimation(quark, 1, 3, 'Walk');
    Enemies.add(quark);
  }
};

function initTank(x, y) {
  var tank = _scene.add.sprite(x, y, 'spriteMap', 'Tank_01.png');
  tank.shellFireChance = 0.01; //1% chance of firing a shell/update
  tank.ammo = 20;
  tank.dropChance = 1; // 100% chance of a random drop
  tank.stepsize = 3;
  Enemies.add(tank);
};

function initSpheroids(number) {
  for (let index = 0; index < number; index++) {
    var playerSafeDist = 120;
    var descr = findSpawn(playerSafeDist);
    var spheroid = _scene.add.sprite(descr.x, descr.y, 'spriteMap', 'Spheroid_01.png');
    spheroid.baseSpeed = 3;
    spheroid.velX = spheroid.baseSpeed * randTrinary();
    spheroid.velY = spheroid.baseSpeed * randTrinary();
    spheroid.tanksSpawned = 0;
    spheroid.makeWarpParticles();
    // TODO play spawning sound?
    spheroid.tankSpawnChance = 0.005; //0,5% chance of spawning a tank/update
    // TODO: Find a good spawn interval.
    spheroid.maxTanks = 6;
    spheroid.constructionTime = SECS_TO_NOMINALS;

    Enemies.add(spheroid);
  }
};

function initEnforcer(x, y) {
  var enforcer = _scene.add.sprite(x, y, 'spriteMap', 'Enforcer_01.png');
  enforcer.ammo = 20;
  enforcer.sparkFireChance = 0.01; //1% chance of firing a spark/update
  enforcer.spawnTime = SECS_TO_NOMINALS;
  Enemies.add(enforcer);
};

function fireCruiseMissile(x, y) {
  var missile = _scene.add.sprite(x, y, 'spriteMap', 'Cruise_Missile_01.png');
  Bullets.add(missile);
};

function fireShell(x, y, angle) {
  var shell = _scene.add.sprite(x, y, 'spriteMap', 'Shell_01.png');
  shell.angle = angle;
  Bullets.add(shell);
};

function fireSpark(x, y, angle) {
  var spark = _scene.add.sprite(x, y, 'spriteMap', 'Spark_01.png');
  spark.angle = angle;
  Bullets.add(spark);
};

function fireBullet(x, y, dirnX, dirnY) {
  if (ammo == 0)
    return;
  ammo--
  Bullets.add(new Projectile({
    x: x,
    y: y,
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
      // ctx.strokeStyle = 0x008b8b; //yan
      // ctx.fillStyle = 0x008b8;
      //var dirn = util.angleTo(this.x, this.y, this.prevX, this.prevY);
      //var x = this.x + 10 * Math.cos(dirn);
      //var y = this.y + 10 * Math.sin(dirn);
      // ctx.globalAlpha = 0.4;
      // ctx.beginPath();
      // ctx.moveTo(this.x, this.y);
      // ctx.lineTo(x, y);
      // ctx.lineWidth = 8;
      // ctx.stroke();
      // util.fillCircle(ctx, this.x, this.y, 4);

      // ctx.globalAlpha = 0.6;
      // ctx.beginPath();
      // ctx.moveTo(this.x, this.y);
      // ctx.lineTo(x, y);
      // ctx.lineWidth = 4;
      // ctx.stroke();
      // util.fillCircle(ctx, this.x, this.y, 2);

      // ctx.strokeStyle = "white";
      // ctx.fillStyle = "white";
      // ctx.globalAlpha = 1;
      // ctx.beginPath();
      // ctx.moveTo(this.x, this.y);
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

  var explosionColors = ["0xffff00", "0xffa500", "0xff0000", "0x080808", "0xffffff"];

  for (var i = 0; i < num; i++) {
    var dirn = Math.random() * 2 * Math.PI;
    var color;
    //if (specificColor === undefined) {
    var colorId = Math.floor(Math.random() * 5);
    color = explosionColors[colorId];
    // } else {
    //   color = specificColor;
    // }
    var descr = {
      x: this.x,
      y: this.y,
      dirn: dirn,
      color: color
    };
    createParticle(descr);
  }
};

// ------------------------
// Particle effects methods

// function createCMTrail(x, y) {
//   Particles.add(new CMTrail({x: x, y: y}));
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
  graphics.fillStyle(descr.color, alpha);
  graphics.fillCircleShape(circle);
  var texture = graphics.generateTexture('particle', descr.radius * 2, descr.radius * 2);
  newSprite = _scene.add.sprite(descr.x, descr.y, 'particle');
  newSprite.velX = 1;
  newSprite.velY = 1;
  newSprite.speed = 10;
  newSprite.dirn = descr.dirn;
  graphics.destroy();
  return newSprite;
}