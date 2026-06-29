import { wall, SECS_TO_NOMINALS, scoreValues, levelSpecs, electrodes } from "./config.js";
import { distSq, square } from "./utils.js";
var _scene;

export function findClosestFamilyMember(posX, posY) {
  var closest = null;
  var minDistSq = Infinity;
  for (var i = 0; i < _family.length; i++) {
    var member = _family[i];
    var distSq = util.distSq(posX, posY, member.x, member.y);
    if (distSq < minDistSq) {
      closest = member;
      minDistSq = distSq;
    }
  }
  return closest;
}

export function initPlayer(scene) {
  _scene = scene;
  scene.player.visible = true;
  scene.player.speed = 1;
  scene.player.name = 'player';
  initPeopleAnimations(_scene.player);
  scene.player.velX = 0;
  scene.player.velY = 0;
  var isMoving = false;
}

function initPeopleAnimations(entity) {
  setupAnimation(entity, 1, 3, 'WalkLeft');
  setupAnimation(entity, 4, 6, 'WalkRight');
  setupAnimation(entity, 7, 9, 'WalkDown');
  setupAnimation(entity, 10, 12, 'WalkUp');
}

export function setupAnimation(entity, start, end, movement) {
  const key = entity.name + movement;
  if (_scene.anims.exists(key)) {
    return;
  } var frameNames = _scene.anims.generateFrameNames('spriteMap', {
    start: start,
    end: end,
    zeroPad: 2,
    prefix: entity.name + '_',
    suffix: '.png'
  });
  var anim = _scene.anims.create({
    key: key,
    frames: frameNames,
    frameRate: 5,
    repeat: -1
  });
}

export function initFamily(number) {
  var playerSafeDist = 120;
  var descr = findSpawn(playerSafeDist);
  var dad = _scene.add.sprite(0, 0, 'spriteMap', 'Dad_01.png');
  var descr = findSpawn(playerSafeDist);
  dad.setPosition(descr.x, descr.y);
  setFamilyProperties(dad);
  dad.name = 'Dad';
  initPeopleAnimations(dad);
  _scene.Family.add(dad);
  if (number < 2)
    return;
  var mom = _scene.add.sprite(0, 0, 'spriteMap', 'Mom_01.png');
  var descr = findSpawn(playerSafeDist);
  mom.setPosition(descr.x, descr.y);
  setFamilyProperties(mom);
  mom.name = 'Mom';
  initPeopleAnimations(mom);
  _scene.Family.add(mom);
  if (number < 3)
    return;
  for (let index = 0; index < number - 3; index++) {
    var child = _scene.add.sprite(0, 0, 'spriteMap', 'Child_01.png');
    var descr = findSpawn(playerSafeDist);
    child.setPosition(descr.x, descr.y);
    setFamilyProperties(child);
    child.name = 'Child';
    initPeopleAnimations(child);
    _scene.Family.add(child);
  }

}

export function setFamilyProperties(member) {
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

export function findSpawn(playerSafeDist) {
  // A function to prevent the Enemies from 
  // spawning too close to the player
  for (var i = 0; i < 100; i++) {
    var x = Phaser.Math.Between(wall.wallLeft, wall.wallRight);
    var y = Phaser.Math.Between(wall.wallTop, wall.wallBottom);
    var locationFound = true;
    var pPos = _scene.player.getCenter();
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

export function initGrunts(number) {
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
    grunt.value = scoreValues.Grunt * _scene.multiplier;
    grunt.takeBulletHit = false;
    setupAnimation(grunt, 1, 3, 'Walk');
    _scene.Enemies.add(grunt);
  }
};

export function initHulks(number) {
  for (let index = 0; index < number; index++) {
    var playerSafeDist = 120;
    var descr = findSpawn(playerSafeDist);
    var hulk = _scene.add.sprite(descr.x, descr.y, 'spriteMap', 'Hulk_01.png');
    hulk.killFamily = true;
    hulk.stepsize = 12;
    hulk.bootTime = 2 * SECS_TO_NOMINALS;
    hulk.brainpower = 0.05;
    hulk.facing = 0;
    hulk.takeBulletHit = true;
    hulk.name = 'Hulk';
    hulk.value = scoreValues.Hulk * _scene.multiplier;
    hulk.velX = 0;
    hulk.velY = 0;
    setupAnimation(hulk, 1, 3, 'WalkLeft');
    setupAnimation(hulk, 4, 6, 'WalkUpDown');
    setupAnimation(hulk, 7, 9, 'WalkRight');
    _scene.Enemies.add(hulk);
  }
};

export function initQuarks(number) {
  for (let index = 0; index < number; index++) {
    var playerSafeDist = 120;
    var descr = findSpawn(playerSafeDist);
    var quark = _scene.add.sprite(descr.x, descr.y, 'spriteMap', 'Quark_01.png');
    quark.baseSpeed = 1;
    quark.velX = quark.baseSpeed * randTrinary();
    quark.velY = quark.baseSpeed * randTrinary();
    quark.tanksSpawned = 0;
    quark.maxTanks = 6;
    quark.value = scoreValues.Quark * multiplier;
    quark.takeBulletHit = false;
    quark.bootTime = 2 * SECS_TO_NOMINALS;
    quark.name = 'Quark';
    setupAnimation(quark, 1, 3, 'WalkLeft');
    setupAnimation(quark, 4, 6, 'WalkUpDown');
    setupAnimation(quark, 7, 9, 'WalkRight');
    _scene.Enemies.add(quark);
  }
};

export function createProg(x, y) {
  var prog = _scene.add.sprite(x, y, 'spriteMap', 'Prog_01.png');
  prog.speed = 1.5;
  prog.name = 'Prog';
  prog.velX = 0;
  prog.velY = 0;
  setupAnimation(prog, 1, 3, 'WalkLeft');
  setupAnimation(prog, 4, 6, 'WalkUpDown');
  setupAnimation(prog, 7, 9, 'WalkRight');
  _scene.Enemies.add(prog);
};

export function initBrains(number) {
  for (let index = 0; index < number; index++) {
    var playerSafeDist = 120;
    var descr = findSpawn(playerSafeDist);
    var brain = _scene.add.sprite(descr.x, descr.y, 'spriteMap', 'Brain_01.png');
    brain.killFamily = true;
    brain.stepsize = 3;
    brain.makesProgs = true;
    brain.value = scoreValues.Brain * multiplier;
    brain.takeBulletHit = false;
    brain.missileFireChance = 0.005; // 0.5% chance of firing a CM per update
    // TODO: Find a good firing interval for the missiles.
    brain.dropChance = 0.9; // 90% chance of a random drop
    brain.bootTime = SECS_TO_NOMINALS;
    brain.facing = 0;
    brain.name = 'Brain';
    brain.velX = 0;
    brain.velY = 0;
    setupAnimation(brain, 1, 3, 'WalkLeft');
    setupAnimation(brain, 4, 6, 'WalkUpDown');
    setupAnimation(brain, 7, 9, 'WalkRight');
    _scene.Enemies.add(brain);
  }
};

export function initElectrodes(number) {
  for (let index = 0; index < number; index++) {
    var playerSafeDist = 120;
    var descr = findSpawn(playerSafeDist);
    descr.shapes = Math.floor(Math.random() * 7);
    var elec = electrodes[descr.shapes];
    var electrode = _scene.add.sprite(descr.x, descr.y, 'spriteMap', elec + '_01.png');
    electrode.name = elec;
    setupAnimation(electrode, 1, 3, 'Blink');
    electrode.anims.play(elec + 'Blink');
    _scene.Rewards.add(electrode);
  }
};



export function initTank(x, y) {
  var tank = _scene.add.sprite(x, y, 'spriteMap', 'Tank_01.png');
  tank.shellFireChance = 0.01; //1% chance of firing a shell/update
  tank.ammo = 20;
  tank.value = scoreValues.Tank * multiplier;
  tank.dropChance = 1; // 100% chance of a random drop
  tank.stepsize = 3;
  _scene.Enemies.add(tank);
};

export function initSpheroids(number) {
  for (let index = 0; index < number; index++) {
    var playerSafeDist = 120;
    var descr = findSpawn(playerSafeDist);
    var spheroid = _scene.add.sprite(descr.x, descr.y, 'spriteMap', 'Spheroid_01.png');
    spheroid.baseSpeed = 3;
    spheroid.velX = spheroid.baseSpeed * randTrinary();
    spheroid.velY = spheroid.baseSpeed * randTrinary();
    spheroid.value = scoreValues.Spheroid * multiplier;
    spheroid.tanksSpawned = 0;
    makeWarpParticles();
    // TODO play spawning sound?
    spheroid.tankSpawnChance = 0.005; //0,5% chance of spawning a tank/update
    // TODO: Find a good spawn interval.
    spheroid.maxTanks = 6;
    spheroid.constructionTime = SECS_TO_NOMINALS;
    spheroid.name = 'Spheroid';
    setupAnimation(spheroid, 1, 9, 'Blink');
    spheroid.anims.play('SpheroidBlink');
    _scene.Enemies.add(spheroid);
  }
};

export function createEnforcer(x, y) {
  var enforcer = _scene.add.sprite(x, y, 'spriteMap', 'Enforcer_01.png');
  enforcer.ammo = 20;
  enforcer.sparkFireChance = 0.01; //1% chance of firing a spark/update
  enforcer.spawnTime = SECS_TO_NOMINALS;
  enforcer.name = 'Enforcer';
  enforcer.value = scoreValues.Enforcer * multiplier;
  setupAnimation(enforcer, 1, 3, 'Left');
  setupAnimation(enforcer, 4, 6, 'Right');
  _scene.Enemies.add(enforcer);
};

export function fireCruiseMissile(x, y) {
  var graphics = _scene.add.graphics();
  var circle = new Phaser.Geom.Circle(4, 4, 2);
  graphics.fillStyle(0xff0000, 1);
  graphics.fillCircleShape(circle);
  circle = new Phaser.Geom.Circle(4, 4, 4);
  graphics.fillStyle(0x808080, 1);
  graphics.fillCircleShape(circle);
  var texture = graphics.generateTexture('missile', 8, 8);
  newSprite = _scene.add.sprite(x, y, 'missile');
  newSprite.lifeSpan = 200;
  newSprite.velX = Math.cos(newSprite.x - player.x) * 3;
  newSprite.velY = Math.sin(newSprite.y - player.y) * 3;
  newSprite.setOrigin(.5);
  newSprite.name = 'Missile';
  graphics.destroy();
  _scene.Enemies.add(newSprite);
};

export function fireShell(x, y, angle) {
  var shell = _scene.add.sprite(x, y, 'spriteMap', 'Shell_01.png');
  shell.angle = angle;
  _scene.Bullets.add(shell);
};

export function fireSpark(x, y, angle) {
  var spark = _scene.add.sprite(x, y, 'spriteMap', 'Spark_01.png');
  spark.angle = angle;
  _scene.Bullets.add(spark);
};

export function fireBullet(x, y, dirnX, dirnY) {
  if (_scene.ammo <= 0) return;

  _scene.ammo--;

  const bullet = Projectile({
    x,
    y,
    velX: dirnX * 8,
    velY: dirnY * 8
  });

  _scene.Bullets.add(bullet);
}
export function Projectile(descr) {
  if (descr.velX == 0 && descr.velY == 0)
    descr.velX = 0;
  var newSprite;
  switch (true) {
    case _scene.player.hasShotgun:
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
    case _scene.player.hasMachineGun:
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
    //case player.hasMachineGun:
    // ctx.strokeStyle = 0x008b8b; //yan
    // ctx.fillStyle = 0x008b8;
    //var dirn = util.angleTo(x, y, prevX, prevY);
    //var x = x + 10 * Math.cos(dirn);
    //var y = y + 10 * Math.sin(dirn);
    // ctx.globalAlpha = 0.4;
    // ctx.beginPath();
    // ctx.moveTo(x, y);
    // ctx.lineTo(x, y);
    // ctx.lineWidth = 8;
    // ctx.stroke();
    // util.fillCircle(ctx, x, y, 4);

    // ctx.globalAlpha = 0.6;
    // ctx.beginPath();
    // ctx.moveTo(x, y);
    // ctx.lineTo(x, y);
    // ctx.lineWidth = 4;
    // ctx.stroke();
    // util.fillCircle(ctx, x, y, 2);

    // ctx.strokeStyle = "white";
    // ctx.fillStyle = "white";
    // ctx.globalAlpha = 1;
    // ctx.beginPath();
    // ctx.moveTo(x, y);
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

export function makeWarpParticles() {

  for (var i = 0; i < colors.length; i++) {
    var colorDefinition = colors[i];
    var numberOfParticles = colorDefinition.ratio * Particles.getChildren().Length;
    for (var j = 0; j < numberOfParticles; j++) {
      var direction = Phaser.Math.Between(0, Math.PI * 2);
      var speed = Phaser.Math.Between(0, 2);
      var distance = speed * particle.lifeSpan;

      var particle = {
        dirn: direction,
        speed: -speed,
        x: x + distance * Math.cos(direction),
        y: y + distance * Math.sin(direction),
        color: colorDefinition.color,
        radius: 1
      };
      createParticle(particle);
    }
  }
};

export function warpIn(du) {
  spawnTimeElapsed += du;
  if (spawnTimeElapsed > spawnTime) {
    isSpawning = false;
  }
};

export function spawnFragment(num, specificColor) {

  var explosionColors = ["0xffff00", "0xffa500", "0xff0000", "0x080808", "0xffffff"];

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
      x,
      y,
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

export function createParticle(descr) {
  _scene.Particles.add(new Particle(descr));
};

export function Particle(descr) {
  var newSprite;
  var _graphics = _scene.add.graphics();
  var circle = new Phaser.Geom.Circle(descr.radius / 2, descr.radius / 2, descr.radius);
  _graphics.fillStyle(descr.color, 1);
  _graphics.fillCircleShape(circle);
  var texture = _graphics.generateTexture('particle', descr.radius * 2, descr.radius * 2);
  newSprite = _scene.add.sprite(descr.x, descr.y, 'particle');
  newSprite.velX = 1;
  newSprite.velY = 1;
  newSprite.speed = 10;
  newSprite.lifeSpan = SECS_TO_NOMINALS / 2;
  newSprite.dirn = descr.dirn;
  _graphics.destroy();
  return newSprite;
}
