import { GAME_STATE, wall } from "./config.js";
import { createParticle, fireBullet } from "./entities.js";
import { distSq } from "./utils.js";
var _scene;

export function moveEntities(scene) {
  _scene = scene;
  moveFamily()
  moveEnemies();
  moveBullets();
  moveParticles();
  _scene.Bullets.children.each(bullet => {
    bullet.x += bullet.velX;
    bullet.y += bullet.velY;
  });
}

export function moveEnemies() {
  var members = _scene.Enemies.getChildren();
  members.forEach(element => {
    switch (element.name) {
      case "Grunt":
        moveGrunt(element);
        break;
      case "Hulk":
        moveHulk(element);
        break;
      case "Spheroid":
        moveSpheroids(element);
        break;
      case "Brain":
        moveBrains(element);
        break;
      case "Quark":
        moveQuarks(element);
        break;
      case "Prog":
        moveProgs(element);
        break;
      case "Enforcer":
        moveEnforcers(element);
        break;
      case "Missile":
        moveMissiles(element);
        break;
      default:
        break;
    }
    edgeBounce(element);
  });

}

export function moveGrunt(grunt) {
  var du = 1;
  //rage(grunt, du);
  var xOffset = _scene.player.x - grunt.x;
  var yOffset = _scene.player.y - grunt.y;

  var velX = 0;
  if (xOffset > 0) {
    velX = grunt.speed;
  } else if (xOffset < 0) {
    velX = -grunt.speed;
  }

  var velY = 0;
  if (yOffset > 0) {
    velY = grunt.speed;
  } else if (yOffset < 0) {
    velY = -grunt.speed;
  }

  // Clamp vel
  if (xOffset !== 0 && yOffset !== 0) {
    velX *= grunt.speed * Math.cos(Math.PI / 4);
    velY *= grunt.speed * Math.sin(Math.PI / 4);
  }
  if (!grunt.anims.isPlaying) {
    grunt.anims.play('GruntWalk');
  }
  grunt.x += velX * du;
  grunt.y += velY * du;
}

export function moveMissiles(missile) {
  var du = 1;
  missile.lifeSpan--;
  if (missile.lifeSpan == 0)
    missile.destroy();
  missile.x += missile.velX * du;
  missile.y += missile.velY * du;
}

export function moveBrains(brain) {
  var du = 1;
  var target = findTarget(brain);
  var xOffset = target.x - brain.x;
  var yOffset = target.y - brain.y;

  if (Math.random() < brain.missileFireChance) {
    fireCruiseMissile(brain.x, brain.y);
  }
  if (Math.abs(xOffset) > Math.abs(yOffset)) {
    if (xOffset > 0) {
      brain.anims.play(brain.name + 'WalkRight');
      brain.velX = 1;
    } else {
      brain.anims.play(brain.name + 'WalkLeft');
      brain.velX = -1;
    }
  } else {
    if (yOffset > 0) {
      brain.anims.play(brain.name + 'WalkUpDown');
      brain.velY = 1;
    } else {
      brain.anims.play(brain.name + 'WalkUpDown');
      brain.velY = -1;
    }
    brain.x += brain.velX * du;
    brain.y += brain.velY * du;
  }
}

export function rage(enemy, du) {
  var timeFraction = du / enemy.maxRageReachedTime;
  enemy.speed += (enemy.maxSpeed - enemy.baseSpeed) * timeFraction;
  enemy.speed = Math.min(enemy.speed, enemy.maxSpeed);
};

export function movePlayer(dir) {
  switch (dir) {
    case 'left':
      _scene.player.velX = -_scene.player.speed;
      _scene.player.velY = 0;
      _scene.player.anims.play('playerWalkLeft', true);
      break;

    case 'right':
      _scene.player.velX = _scene.player.speed;
      _scene.player.velY = 0;
      _scene.player.anims.play('playerWalkRight', true);
      break;

    case 'up':
      _scene.player.velX = 0;
      _scene.player.velY = -_scene.player.speed;
      _scene.player.anims.play('playerWalkUp', true);
      break;

    case 'down':
      _scene.player.velX = 0;
      _scene.player.velY = _scene.player.speed;
      _scene.player.anims.play('playerWalkDown', true);
      break;
  }

  _scene.player.x += _scene.player.velX;
  _scene.player.y += _scene.player.velY;
  edgeBounce(_scene.player);
}

export function moveFamily() {
  var members = _scene.Family.getChildren();

  members.forEach(person => {
    if (Math.random() < 0.02 * person.panic) {
      //2% chance to change direction

      var n = Math.floor(Math.random() * 4);
      switch (n) {
        case 0:
          person.velX = -0.3 * person.panic;
          person.anims.play(person.name + 'WalkLeft');
          break;
        case 1:
          person.velY = -0.3 * person.panic;
          person.anims.play(person.name + 'WalkUp');
          break;
        case 2:
          person.velX = 0.3 * person.panic;
          person.anims.play(person.name + 'WalkRight');
          break;
        case 3:
          person.velY = 0.3 * person.panic;
          person.anims.play(person.name + 'WalkDown');
      }
    }
    person.x += person.velX;
    person.y += person.velY;
    edgeBounce(person);
  });
}

export function findTarget(entity) {
  var target = findClosestFamilyMember(entity.x, entity.y);
  if (target === null || target === undefined) {
    target = _scene.player;
  }
  return target;
};

export function moveHulk(hulk) {
  var du = 1;
  var target = findTarget(hulk);
  var xOffset = target.x - hulk.x;
  var yOffset = target.y - hulk.y;
  var difficulty = Math.random();
  if (
    (Math.abs(xOffset) < 10 && difficulty < hulk.brainpower) ||
    (Math.abs(yOffset) < 10 && difficulty < hulk.brainpower)
  ) {
    if (Math.abs(xOffset) > Math.abs(yOffset)) {
      if (xOffset > 0) {
        hulk.anims.play(hulk.name + 'WalkRight');
        hulk.velX = 1;
      } else {
        hulk.anims.play(hulk.name + 'WalkLeft');
        hulk.velX = -1;
      }
    } else {
      if (yOffset > 0) {
        hulk.anims.play(hulk.name + 'WalkUpDown');
        hulk.velY = 1;
      } else {
        hulk.anims.play(hulk.name + 'WalkUpDown');
        hulk.velY = -1;
      }
    }
  } else
    hulk.anims.pause();

  hulk.x += hulk.velX * du;
  hulk.y += hulk.velY * du;
}

export function findClosestFamilyMember(posX, posY) {
  var closest = null;
  var minDistSq = Infinity;
  var members = _scene.Family.getChildren();

  members.forEach(member => {
    var dS = distSq(posX, posY, member.x, member.y);
    if (dS < minDistSq) {
      closest = member;
      minDistSq = dS;
    }
  });
  return closest;
};

// export function movePlayer() {
//   isMoving = (_scene.player.velX != 0 || _scene.player.velY != 0)
//   if (!isMoving && _scene.player.anims != undefined && _scene.player.anims.currentAnim != null) {
//     _scene.player.anims.pause(_scene.player.anims.currentAnim.frames[0]);
//   } else {
//     _scene.player.x += _scene.player.velX;
//     player.y += player.velY;
//   }
//   edgeBounce(player);
// }

export function moveBullets() {
  var bullets = _scene.Bullets.getChildren();
  bullets.forEach(bullet => {
    // Handle death
    bullet.lifeSpan -= 1;
    if (bullet.lifeSpan < 0) bullet.destroy();
    if (edgeBounce(bullet)) {
      bullet.destroy();
    }
    if (bullet.name == 'missile') {
      var xOffset = _scene.player.x - bullet.x;
      var yOffset = _scene.player.y - bullet.y;
      bullet.velX += xOffset / 10;
      bullet.velY += yOffset / 10;
    }
    // Update positions

    // bullet.velX = bullet.bulletVel * bullet.dirnX;
    // bullet.velY = bullet.bulletVel * bullet.dirnY;

    // bullet.prevX = bullet.x;
    // bullet.prevY = bullet.y;

    bullet.x += bullet.velX;
    bullet.y += bullet.velY;

    // bullet.rotation += 1 * du;
    // bullet.rotation = wrapRange(bullet.rotation,
    //                                0, consts.FULL_CIRCLE);

    // Handle collisions
    // var hitEntity = findHitEntity(bullet);
    // if (hitEntity) {
    //   console.log(hitEntity);
    //   var canTakeHit = hitEntity.takeBulletHit;

    // The bulletVel check is a hack to stop the shotgun bullets 
    // from killing each other on spawn
    // if (!hitEntity.bulletVel) {
    //   var canFriendlyHit = hitEntity.takeFriendlyHit;
    //   var descr = {
    //     velX: this.velX,
    //     velY: this.velY,
    //     du: du
    //   };
    //   if (canTakeHit || (g_friendlyFire && canFriendlyHit)) {
    //     if (canTakeHit) {
    //       // Enemy takes the hit and removed from collision check
    //       canTakeHit.call(hitEntity, descr);
    //       spatialManager.unregister(hitEntity);
    //     } else {
    //       canFriendlyHit.call(hitEntity);
    //       spatialManager.unregister(hitEntity);
    //     }
    //     if (Player.hasMachineGun) this.spawnFragment(5, "yan");
    //     if (Player.hasShotgun) this.spawnFragment(5, "orange");
    //     if (!Player.hasMachineGun && !Player.hasShotgun) this.spawnFragment(5, "lime");
    //     return entityManager.KILL_ME_NOW;
    //   }
    //    }
  });

};

export function enemyHitFamily(enemy, member) {
  if (enemy.name == 'Brain') {
    createProg(member.x, member.y);
    member.destroy();
  } else if (enemy.name == 'Missile') {
    var skull = _scene.add.sprite(member.x, member.y, 'spriteMap', 'Skull.png');
    member.destroy();
    makeExplosion(enemy);
    enemy.destroy();
  } else {
    var skull = _scene.add.sprite(member.x, member.y, 'spriteMap', 'Skull.png');
    member.destroy();
    var timedEvent = _scene.time.delayedCall(3000, function () {
      skull.destroy();
    }, [], _scene);
  }
}

export function playerHitEnemy(player, enemy) {
  if (!_scene.playerDying) {
    _scene.playerDying = true;
    var skull = _scene.add.sprite(_scene.player.x, _scene.player.y, 'spriteMap', 'Skull.png');
    _scene.lives--;
    _scene.player.visible = false;
    if (enemy.name == 'Missile') {
      makeExplosion(enemy);
      enemy.destroy();
    }
    var timedEvent = _scene.time.delayedCall(3000, function () {
      skull.destroy();
      if (_scene.lives == 0) {
        _scene.clearLevel();
        _scene.gameState = GAME_STATE.GameOver;
        _scene.playerDying = false;
      }
    }, [], _scene);
  }
}

export function bulletHitEnemy(bullet, enemy) {
  var canTakeHit = enemy.takeBulletHit;
  if (!canTakeHit) {
    _scene.score += enemy.value;
    makeExplosion(enemy);
    enemy.destroy();
    bullet.destroy();
  } else {
    enemy.x += bullet.velX;
    enemy.y += bullet.velY;
    bullet.destroy();
  }
}

export function moveProgs(enemy) {
  var du = 1;
  if (Math.random() < 0.02) {
    //2% chance to change direction

    var n = Math.floor(Math.random() * 4);
    switch (n) {
      case 0:
        enemy.velX = -enemy.speed;
        enemy.anims.play(enemy.name + 'WalkLeft');
        break;
      case 1:
        enemy.velY = -enemy.speed;
        enemy.anims.play(enemy.name + 'WalkUpDown');
        break;
      case 2:
        enemy.velX = enemy.speed;
        enemy.anims.play(enemy.name + 'WalkRight');
        break;
      case 3:
        enemy.velY = enemy.speed;
        enemy.anims.play(enemy.name + 'WalkUpDown');
    }
  }
  enemy.x += enemy.velX * du;
  enemy.y += enemy.velY * du;

}

export function makeExplosion(enemy) {
  var numberOfParticles = getNumberOfParticles();
  for (var j = 0; j < numberOfParticles; j++) {
    var colorDefinition = _scene.colors[Phaser.Math.Between(0, _scene.colors.length)];
    var particle = {
      dirn: Math.random() * 2 * Math.PI,
      speed: Math.random() * 4,
      x: enemy.x,
      y: enemy.y,
      color: colorDefinition,
      radius: 5
    };
    createParticle(particle);
  }
};

export function getNumberOfParticles() {
  var maxNumParticlesOnScreen = 4000;
  var maxNumParticles = 200;
  var minNumParticles = 20;

  var numEntities = _scene.Enemies.children.size;
  var numParticles = maxNumParticlesOnScreen / numEntities;
  // Capping
  var numParticles = Math.max(numParticles, minNumParticles);
  var numParticles = Math.min(numParticles, maxNumParticles);
  return numParticles;
};

function edgeBounce(entity) {
  var bounceHappened = false;
  var velX = entity.velX;
  var velY = entity.velY;
  var x = entity.x;
  var y = entity.y;
  var r = entity.width / 2;
  if (x + velX > wall.wallRight - r || x + velX < wall.wallLeft + r) {
    bounceHappened = true;
    entity.velX = -entity.velX;
  }
  if (y + velY > wall.wallBottom - r || y + velY < wall.wallTop + wall.wallThickness + r) {
    bounceHappened = true;
    entity.velY = -entity.velY;
  }
  return bounceHappened;
};

export function moveParticles() {
  var du = 1;
  var particles = _scene.Particles.getChildren();
  particles.forEach(particle => {
    particle.lifeSpan -= 1;
    var alpha = 1;
    var fadeThresh = 3 * particle.lifeSpan / 4;
    if (particle.lifeSpan < fadeThresh) {
      alpha = particle.lifeSpan / fadeThresh;
      particle.width = particle.width * particle.lifeSpan / fadeThresh;
      particle.height = particle.height * particle.lifeSpan / fadeThresh;
    }

    if (particle.lifeSpan < 0) particle.destroy();
    if (particle.dirn) {
      particle.velX = Math.cos(particle.dirn) * particle.speed;
      particle.velY = Math.sin(particle.dirn) * particle.speed;
    }

    particle.x += particle.velX * du;
    particle.y += particle.velY * du;
  });
};

export function moveSpheroids(spheroid) {
  var du = 1;
  if (spheroid.isSpawning) {
    warpIn(1);
  } else {
    // maxTanks is effectively zero-indexed
    if (Math.random() < spheroid.tankSpawnChance &&
      spheroid.tanksSpawned < spheroid.maxTanks &&
      spheroid.constructionTime < 0) {
      spheroid.tanksSpawned++;
      entityManager.createEnforcer(spheroid.x, spheroid.y);
      spheroid.constructionTime = SECS_TO_NOMINALS;
    }

    if (Math.random() < 0.02) {
      //2% chance to change direction

      var n = Math.floor(Math.random() * 4);
      switch (n) {
        case 0:
          spheroid.velX = -spheroid.baseSpeed;
          break;
        case 1:
          spheroid.velY = -spheroid.baseSpeed;
          break;
        case 2:
          spheroid.velX = spheroid.baseSpeed;
          break;
        case 3:
          spheroid.velY = spheroid.baseSpeed;
      }
      spheroid.x += spheroid.velX * du;
      spheroid.y += spheroid.velY * du;
    }
  }
};
export function processUserInput() {
  //move player
  if (_scene.cursors.left.isDown) movePlayer('left');
  if (_scene.cursors.right.isDown) movePlayer('right');
  if (_scene.cursors.up.isDown) movePlayer('up');
  if (_scene.cursors.down.isDown) movePlayer('down');
  if (!_scene.arrowTouched) {
    //player shoots
    if (_scene.keyQ.isDown) {
      fireBullet(_scene.player.x, _scene.player.y, -_scene.bulletVel, -_scene.bulletVel);
    };

    if (_scene.keyW.isDown) {
      fireBullet(_scene.player.x, _scene.player.y, 0, -_scene.bulletVel);
    };
    if (_scene.keyE.isDown) {
      fireBullet(_scene.player.x, _scene.player.y, _scene.bulletVel, -_scene.bulletVel);
    };

    if (_scene.keyA.isDown) {
      fireBullet(_scene.player.x, _scene.player.y, -_scene.bulletVel, 0);
    };
    if (_scene.keyD.isDown) {
      fireBullet(_scene.player.x, _scene.player.y, _scene.bulletVel, 0);
    };
    if (_scene.keyZ.isDown) {
      fireBullet(_scene.player.x, _scene.player.y, -_scene.bulletVel, _scene.bulletVel);
    };
    if (_scene.keyX.isDown) {
      fireBullet(_scene.player.x, _scene.player.y, 0, _scene.bulletVel);
    };
    if (_scene.keyC.isDown) {
      fireBullet(_scene.player.x, _scene.player.y, _scene.bulletVel, _scene.bulletVel);
    };
  }
}
export function moveEnforcers(enforcer) {
  var du = 1;
  seekTarget();
  enforcer.target = _scene.player;
  enforcer.x += enforcer.velX * du;
  enforcer.y += enforcer.velY * du;

  if (Math.random() < this.sparkFireChance && this.ammo > 0) {
    var angle = angleTo(
      enforcer.x,
      enforcer.y,
      enforcer.target.cx,
      enforcer.target.cy
    );
    enforcer.ammo--;
    fireSpark(enforcer.cx, enforcer.cy, angle);
  }

};

export function moveQuarks(quark) {
  var du = 1;
  // maxTanks is effectively zero-indexed
  if (Math.random() < quark.tankSpawnChance &&
    quark.tanksSpawned < quark.maxTanks &&
    quark.constructionTime < 0) {
    quark.tanksSpawned++;
    createTank(quark.x, quark.y);
    quark.constructionTime = 2 * SECS_TO_NOMINALS;
  }
  if (Math.random() < 0.005) {
    //0.5% chance to change direction
    var n = Math.floor(Math.random() * 4);
    switch (n) {
      case 0:
        quark.anims.play(quark.name + 'WalkLeft');
        quark.velX = -quark.baseSpeed;
        break;
      case 1:
        quark.anims.play(quark.name + 'WalkUpDown');
        quark.velY = -quark.baseSpeed;
        break;
      case 2:
        quark.anims.play(quark.name + 'WalkRight');
        quark.velX = quark.baseSpeed;
        break;
      case 3:
        quark.anims.play(quark.name + 'WalkUpDown');
        quark.velY = quark.baseSpeed;
    }
    quark.x += quark.velX * du;
    quark.y += quark.velY * du;

  }
};