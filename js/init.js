function initEntities(scene, levelData) {
  // Key:
  // Family, Electrodes, Grunts, Hulks, Spheroids, Brains, Quarks (not the Star Trek DS9 version)
  initProtagonist(scene);
  initFamily(scene, levelData[0]);
  initElectrodes(scene, levelData[1]);
  initGrunts(scene, levelData[2]);
  initHulks(scene, levelData[3]);
  initSpheroids(scene, levelData[4]);
  initBrains(scene, levelData[5]);
  initQuarks(scene, levelData[6]);
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

function startLevel(scene) {
  // Create a fresh level

  var randomLevelRequired = level >= _levelSpecs.length;
  var L = level;

  if (randomLevelRequired) {
    var randomlevel = generateLevel(L);
    initEntities(scene, randomlevel);

    numberOfEntities = randomlevel.reduce(function (a, b) {
      return a + b;
    }, 0);
  } else {
    initEntities(scene, _levelSpecs[level]);
    numberOfEntities = _levelSpecs[level].reduce(function (a, b) {
      return a + b;
    }, 0);
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

function initProtagonist(scene) {
  Protagonist = scene.add.sprite(gameWidth / 2, gameHeight / 2, 'spriteMap', 'Protagonist_02.png');
  Protagonist.speed = 1;
  Protagonist.setFrame(0);
  scene.input.keyboard.on('keydown_LEFT', function (event) {
    Protagonist.x -= Protagonist.speed;
    Protagonist.anims.play('ProtagonistWalkLeft');
  });

  scene.input.keyboard.on('keydown_RIGHT', function (event) {
    Protagonist.x += Protagonist.speed;
    Protagonist.anims.play('ProtagonistWalkRight');
  });

  scene.input.keyboard.on('keydown_UP', function (event) {
    Protagonist.y -= Protagonist.speed;
    Protagonist.anims.play('ProtagonistWalkUp');
  });

  scene.input.keyboard.on('keydown_DOWN', function (event) {
    Protagonist.y += Protagonist.speed;
    Protagonist.anims.play('ProtagonistWalkDown');
  });
}

function initFamily(scene, number) {

  var playerSafeDist = 120;

  var dad = scene.add.sprite(0, 0, 'spriteMap', 'Dad_01.png');
  var descr = findSpawn(playerSafeDist);
  dad.setPosition(descr.cx, descr.cy);
  Family.add(dad);
  if (number < 2)
    return;
  var mom = scene.add.sprite(0, 0, 'spriteMap', 'Mom_01.png');
  var descr = findSpawn(playerSafeDist);
  mom.setPosition(descr.cx, descr.cy);
  Family.add(mom);
  if (number < 3)
    return;
  for (let index = 0; index < number - 3; index++) {
    var child = scene.add.sprite(0, 0, 'spriteMap', 'Child_01.png');
    var descr = findSpawn(playerSafeDist);
    child.setPosition(descr.cx, descr.cy);
    Family.add(child);
  }

}

function findSpawn(playerSafeDist) {
  // A function to prevent the Enemies from 
  // spawning too close to the protagonist
  for (var i = 0; i < 100; i++) {
    var x = Phaser.Math.Between(0, gameWidth);
    var y = Phaser.Math.Between(0, gameHeight);

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



function initGrunts(scene, number) {
  for (let index = 0; index < number; index++) {
    var playerSafeDist = 120;
    var descr = findSpawn(playerSafeDist);
    var grunt = scene.add.sprite(descr.cx, descr.cy, 'spriteMap', 'Grunt_01.png');
    grunt.stepsize = 3;
    grunt.baseSpeed = 1;
    grunt.speed = 1;
    grunt.maxSpeed = 3;
    grunt.maxRageReachedTime = 40 * SECS_TO_NOMINALS;
    Enemies.add(grunt);
  }
};

function initHulks(scene, number) {
  for (let index = 0; index < number; index++) {
    var playerSafeDist = 120;
    var descr = findSpawn(playerSafeDist);
    var hulk = scene.add.sprite(descr.cx, descr.cy, 'spriteMap', 'Hulk_01.png');
    hulk.killFamily = true;
    hulk.stepsize = 12;
    hulk.bootTime = 2 * SECS_TO_NOMINALS;
    hulk.brainpower = 0.05;
    hulk.facing = 0;
    Enemies.add(hulk);
  }
};

function initBrains(scene, number) {
  for (let index = 0; index < number; index++) {
    var playerSafeDist = 120;
    var descr = findSpawn(playerSafeDist);
    var brain = scene.add.sprite(descr.cx, descr.cy, 'spriteMap', 'Brain_01.png');
    Enemies.add(brain);
  }
};

function initElectrodes(scene, number) {
  for (let index = 0; index < number; index++) {
    var playerSafeDist = 120;
    var descr = findSpawn(playerSafeDist);
    descr.shapes = Math.floor(Math.random() * 7);
    var electrode = scene.add.sprite(descr.cx, descr.cy, 'spriteMap', 'Electrode_01.png');
    electrode.setFrame(descr.shapes);
    Enemies.add(electrode);
  }
};

function initProg(cx, cy) {
  var prog = scene.add.sprite(cx, cy, 'spriteMap', 'Prog_01.png');
  Enemies.add(prog);
};

function initQuarks(scene, number) {
  for (let index = 0; index < number; index++) {
    var playerSafeDist = 120;
    var descr = findSpawn(playerSafeDist);
    var quark = scene.add.sprite(descr.cx, descr.cy, 'spriteMap', 'Quark_01.png');
    Enemies.add(quark);
  }
};

function initTank(cx, cy) {
  var tank = scene.add.sprite(cx, cy, 'spriteMap', 'Tank_01.png');
  Enemies.add(tank);
};

function initSpheroids(scene, number) {
  for (let index = 0; index < number; index++) {
    var playerSafeDist = 120;
    var descr = this.findSpawn(playerSafeDist);
    var spheroid = scene.add.sprite(descr.cx, descr.cy, 'spriteMap', 'Spheroid_01.png');
    Enemies.add(spheroid);
  }
};

function initEnforcer(cx, cy) {
  var enforcer = scene.add.sprite(cx, cy, 'spriteMap', 'Enforcer_01.png');
  Enemies.add(enforcer);
};

function fireCruiseMissile(cx, cy) {
  var missile = scene.add.sprite(cx, cy, 'spriteMap', 'Cruise_Missile_01.png');
  bullets.push(missile);
};

function fireShell(cx, cy, angle) {
  var shell = scene.add.sprite(cx, cy, 'spriteMap', 'Shell_01.png');
  shell.angle = angle;
  bullets.push(shell);
};

function fireSpark(cx, cy, angle) {
  var spark = scene.add.sprite(cx, cy, 'spriteMap', 'Spark_01.png');
  spark.angle = angle;
  bullets.push(spark);
};

function fireBullet(cx, cy, dirnX, dirnY) {
  this._bulletDU = 0;
  _bullets.push(new Bullet({
    cx: cx,
    cy: cy,
    dirnX: dirnX,
    dirnY: dirnY
  }));
  ammo--;
};