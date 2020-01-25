var _scene;

function moveEntities(scene) {
  _scene = scene;
  moveProtagonist();
  moveFamily()
  moveEnemies();

}

function moveEnemies() {
  var members = Enemies.getChildren();
  members.forEach(element => {
    switch (element.name) {
      case "Grunt":
        moveGrunt(element, 1);
        break;

      default:
        break;
    }
  });

}

function moveGrunt(grunt, du) {
  rage(grunt, du);
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

function rage(enemy, du) {
  var timeFraction = du / enemy.maxRageReachedTime;
  enemy.speed += (enemy.maxSpeed - enemy.baseSpeed) * timeFraction;
  enemy.speed = Math.min(enemy.speed, enemy.maxSpeed);
};

function moveFamily() {
  var members = Family.getChildren();

  members.forEach(person => {
    person.lifeSpan += -1;
    if (person.lifeSpan <= 0) {
      if (person.willSpawnProg) {
        createProg(person.x, person.y);
      }
      person.destroy();
    } else {
      if (Math.random() < 0.01 && person.panic < 3) {
        person.panic += 0.1;
      }
      var velX = 0,
        velY = 0;
      if (Math.random() < 0.02 * person.panic) {
        //2% chance to change direction

        var n = Math.floor(Math.random() * 4);
        switch (n) {
          case 0:
            velX = -0.3 * person.panic;
            break;
          case 1:
            velY = -0.3 * person.panic;
            break;
          case 2:
            velX = 0.3 * person.panic;
            break;
          case 3:
            velY = 0.3 * person.panic;
        }
        if (person.velX < 0)
          person.anims.play(person.name + 'WalkLeft');
        if (person.velX > 0)
          person.anims.play(person.name + 'WalkRight');
        if (person.velY < 0)
          person.anims.play(person.name + 'WalkUp');
        if (person.velY > 0)
          person.anims.play(person.name + 'WalkDown');

        person.x += velX;
        person.y += velY;
      }
    }
  });
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
};

function moveProtagonist() {
  Protagonist.x += Protagonist.velX;
  Protagonist.y += Protagonist.velY;
}

function moveBullets(du) {
  var bullets = Bullets.getChildren();
  bullets.forEach(bullet => {
    // Handle death
    bullet.lifeSpan -= du;
    if (bullet.lifeSpan < 0) bullet.destroy();

    if (edgeBounce()) {
      if (Player.hasMachineGun) spawnFragment(5, "cyan");
      if (Player.hasShotgun) spawnFragment(5, "orange");
      if (!Player.hasMachineGun && !Player.hasShotgun) spawnFragment(5, "lime");
      bullet.destroy();
    }

    // Update positions
    bullet.velX = bullet.bulletVel * bullet.dirnX;
    bullet.velY = bullet.bulletVel * bullet.dirnY;

    bullet.prevX = bullet.x;
    bullet.prevY = bullet.y;

    bullet.x += bullet.velX * du;
    bullet.y += bullet.velY * du;

    bullet.rotation += 1 * du;
    // bullet.rotation = wrapRange(bullet.rotation,
    //                                0, consts.FULL_CIRCLE);

    // Handle collisions
    var hitEntity = findHitEntity(bullet);
    if (hitEntity) {
      // The bulletVel check is a hack to stop the shotgun bullets 
      // from killing each other on spawn
      // if (!hitEntity.bulletVel) {
      //   var canTakeHit = hitEntity.takeBulletHit;
      //   var canFriendlyHit = hitEntity.takeFriendlyHit;
      //   var descr = {
      //     velX: this.velX,
      //     velY: this.velY,
      //     du: du
      //   };
      // if (canTakeHit || (g_friendlyFire && canFriendlyHit)) {
      //   if (canTakeHit) {
      //     // Enemy takes the hit and removed from collision check
      //     canTakeHit.call(hitEntity, descr);
      //     spatialManager.unregister(hitEntity);
      //   } else {
      //     canFriendlyHit.call(hitEntity);
      //     spatialManager.unregister(hitEntity);
      //   }
      //   if (Player.hasMachineGun) this.spawnFragment(5, "cyan");
      //   if (Player.hasShotgun) this.spawnFragment(5, "orange");
      //   if (!Player.hasMachineGun && !Player.hasShotgun) this.spawnFragment(5, "lime");
      //   return entityManager.KILL_ME_NOW;
      // }
    }
  });

};



function edgeBounce(entity) {
  var bounceHappened = false;

  var velX = entity.velX;
  var velY = entity.velY;
  var cx = entity.x;
  var cy = entity.y;
  var r = entity.getRadius();

  if (cx + velX > wallRight - r || cx + velX < wallLeft + r) {
    bounceHappened = true;
    entity.velX = -entity.velX;
  }
  if (cy + velY > wallBottom - r || cy + velY < wallTop + wallThickness + r) {
    bounceHappened = true;
    entity.velY = -entity.velY;
  }
  return bounceHappened;
};

function getRadius(entity) {
  return (entity.width / 2) * 0.9;
};

function findHitEntity(bullet) {
  var pos = this.getPosition();
  return findEntityInRange(
    pos.x, pos.y, getRadius()
  );
};

function findEntityInRange(x, y, radius) {
  // for-in loop used due to sparseness of the _entities array.
  var members = Enemies.getChildren();
  members.forEach(entity => {
    // Circle-based distance checking
    var distSq = distSq(x, y, entity.x, entity.y);
    var limSq = square(radius + getRadius(entity));
    if (distSq < limSq) {
      return entity;
    }
  });
  return null;
};

function moveParticles(du) {

  this.lifeSpan -= du;
  if (this.lifeSpan < 0) particle.destroy;

  if (this.dirn) {
    this.velX = Math.cos(this.dirn) * this.speed;
    this.velY = Math.sin(this.dirn) * this.speed;
  }

  this.x += this.velX * du;
  this.y += this.velY * du;
};