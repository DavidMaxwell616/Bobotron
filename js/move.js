var _scene;

function moveEntities(scene) {
  _scene = scene;
  moveProtagonist();
  moveFamily()
  moveEnemies();
  moveBullets();
  moveParticles();
}

function moveEnemies() {
  var members = Enemies.getChildren();
  members.forEach(element => {
    switch (element.name) {
      case "Grunt":
        moveGrunt(element);
        break;
      case "Hulk":
        moveHulk(element);
        break;
      default:
        break;
    }
  });

}

function moveGrunt(grunt) {
  var du = 1;
  //rage(grunt, du);
  var xOffset = Protagonist.x - grunt.x;
  var yOffset = Protagonist.y - grunt.y;

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

function moveBrain(brain, du0) {
  seekTarget(brain);

  if (Math.random() < brain.missileFireChance) {
    fireCruiseMissile(brain.x, brain.y);
  }
  if (!brain.anims.isPlaying) {
    brain.anims.play('BrainWalk');
  }

  brain.x += brain.velX * du;
  brain.y += brain.velY * du;
}

function rage(enemy, du) {
  var timeFraction = du / enemy.maxRageReachedTime;
  enemy.speed += (enemy.maxSpeed - enemy.baseSpeed) * timeFraction;
  enemy.speed = Math.min(enemy.speed, enemy.maxSpeed);
};

function movePlayer(dir) {
  switch (dir) {
    case 'left':
      Protagonist.velX = Protagonist.velX <= 0 ? -Protagonist.speed : 0;
      Protagonist.anims.play('ProtagonistWalkLeft');
      break;
    case 'right':
      Protagonist.velX = Protagonist.velX >= 0 ? Protagonist.speed : 0;
      Protagonist.anims.play('ProtagonistWalkRight');
      break;
    case 'up':
      Protagonist.velY = Protagonist.velY <= 0 ? -Protagonist.speed : 0;
      Protagonist.anims.play('ProtagonistWalkUp');
      break;
    case 'down':
      Protagonist.velY = Protagonist.velY >= 0 ? Protagonist.speed : 0;
      Protagonist.anims.play('ProtagonistWalkDown');
      break;

    default:
      break;
  }
}

function moveFamily() {
  var members = Family.getChildren();

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

function findTarget(entity) {
  var target = findClosestFamilyMember(entity.x, entity.y);
  if (target === null || target === undefined) {
    target = findProtagonist();
  }
  return target;
};

function moveHulk(hulk) {
  var du = 1;
  var target = findTarget(hulk);

  var xOffset = target.x - hulk.x;
  var yOffset = target.y - hulk.y;
  var difficulty = Math.random();

  if (
    (Math.abs(xOffset) < 10 && difficulty < hulk.brainpower) ||
    (Math.abs(yOffset) < 10 && difficulty < hulk.brainpower)
  ) {
    hulk.velX = 0;
    hulk.velY = 0;
    if (Math.abs(xOffset) > Math.abs(yOffset)) {
      if (xOffset > 0) {
        hulk.velX = 1;
      } else {
        hulk.velX = -1;
      }
    } else {
      if (yOffset > 0) {
        hulk.velY = 1;
      } else {
        hulk.velY = -1;
      }
    }
    hulk.bootTime = 2 * SECS_TO_NOMINALS;
    hulk.x += hulk.velX * du;
    hulk.y += hulk.velY * du;
  }
}

function findClosestFamilyMember(posX, posY) {
  var closest = null;
  var minDistSq = Infinity;
  var members = Family.getChildren();

  members.forEach(member => {
    var distSq = this.distSq(posX, posY, member.x, member.y);
    if (distSq < minDistSq) {
      closest = member;
      minDistSq = distSq;
    }
  });
  return closest;
};

function moveProtagonist() {
  isMoving = (Protagonist.velX != 0 || Protagonist.velY != 0)
  if (!isMoving && Protagonist.anims != undefined && Protagonist.anims.currentAnim != null) {
    Protagonist.anims.pause(Protagonist.anims.currentAnim.frames[0]);
  } else {
    Protagonist.x += Protagonist.velX;
    Protagonist.y += Protagonist.velY;
  }
  edgeBounce(Protagonist);
}

function moveBullets() {
  var bullets = Bullets.getChildren();
  bullets.forEach(bullet => {
    // Handle death
    bullet.lifeSpan -= 1;
    if (bullet.lifeSpan < 0) bullet.destroy();
    if (edgeBounce(bullet)) {
      //  if (Protagonist.hasMachineGun) spawnFragment(5, "yan");
      //  if (Protagonist.hasShotgun) spawnFragment(5, "orange");
      //if (!Protagonist.hasMachineGun && !Protagonist.hasShotgun) spawnFragment(5, "lime");
      bullet.destroy();
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

function enemyHitFamily(enemy, member) {
  var skull = _scene.add.sprite(member.x, member.y, 'spriteMap', 'Skull.png');
  member.destroy();
  var timedEvent = _scene.time.delayedCall(3000, function () {
    skull.destroy();
  }, [], _scene);
}

function enemyHitProtagonist(enemy, player) {
  var skull = _scene.add.sprite(player.x, player.y, 'spriteMap', 'Skull.png');
  player.destroy();
  var timedEvent = _scene.time.delayedCall(3000, function () {
    skull.destroy();
    lives--;
    if (lives == 0)
      _gameState = gameState.GameOver;
    else
      _gameState = gameState.Transition;
  }, [], _scene);
}

function bulletHitEnemy(bullet, enemy) {
  var canTakeHit = enemy.takeBulletHit;
  if (canTakeHit) {
    score += enemy.value;
    makeExplosion(enemy);
    enemy.destroy();
    bullet.destroy();
  }
}

function makeExplosion(enemy) {
  for (var i = 0; i < colors.length; i++) {
    var colorDefinition = colors[i];
    var numberOfParticles = 10; //getNumberOfParticles();
    for (var j = 0; j < numberOfParticles; j++) {
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
  }
};

function getNumberOfParticles() {
  var maxNumParticlesOnScreen = 4000;
  var maxNumParticles = 200;
  var minNumParticles = 20;

  var numEntities = Enemies.children.size;
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
  if (x + velX > wallRight - r || x + velX < wallLeft + r) {
    bounceHappened = true;
    entity.velX = -entity.velX;
  }
  if (y + velY > wallBottom - r || y + velY < wallTop + wallThickness + r) {
    bounceHappened = true;
    entity.velY = -entity.velY;
  }
  return bounceHappened;
};

function moveParticles() {
  var du = 1;
  var particles = Particles.getChildren();
  particles.forEach(particle => {
    particle.lifeSpan -= 1;
    var alpha = 1;
    var fadeThresh = 3 * particle.lifeSpan / 4;
    if (particle.lifeSpan < fadeThresh) {
      alpha = particle.lifeSpan / fadeThresh;
      particle.width = particle.width * particle.lifeSpan / fadeThresh;
      particle.height = particle.height * particle.lifeSpan / fadeThresh;
    }

    //  console.log(particle.lifeSpan);
    if (particle.lifeSpan < 0) particle.destroy();
    //console.log(particle.dirn);
    if (particle.dirn) {
      particle.velX = Math.cos(particle.dirn) * particle.speed;
      particle.velY = Math.sin(particle.dirn) * particle.speed;
    }

    particle.x += particle.velX * du;
    particle.y += particle.velY * du;
  });
};