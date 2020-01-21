function moveEnemies(scene) {
  console.log(Enemies);
  Enemies.children.forEach(element => {
    switch (element.tag) {
      case "Grunt":
        moveGrunt(element);
        break;

      default:
        break;
    }
  });

}

function moveGrunt(grunt) {
  rage(grunt, du);
  //seek target
  var target = findProtagonist();
  var xOffset = x - grunt.x;
  var yOffset = target.y - grunt.y;

  velX = 0;
  if (xOffset > 0) {
    velX = speed;
  } else if (xOffset < 0) {
    velX = -speed;
  }

  velY = 0;
  if (yOffset > 0) {
    velY = speed;
  } else if (yOffset < 0) {
    velY = -speed;
  }

  // Clamp vel
  if (xOffset !== 0 && yOffset !== 0) {
    velX *= speed * Math.cos(Math.PI / 4);
    velY *= speed * Math.sin(Math.PI / 4);
  }

  grunt.x += velX * du;
  grunt.y += velY * du;
}

function rage(enemy, du) {
  var timeFraction = du / maxRageReachedTime;
  enemy.speed += (enemy.maxSpeed - enemy.baseSpeed) * timeFraction;
  enemy.speed = Math.min(enemy.speed, enemy.maxSpeed);
};

function moveFamily(person) {
  person.lifeSpan += -du;
  if (person.lifeSpan <= 0) {
    if (person.willSpawnProg) {
      entityManager.createProg(person.x, person.y);
    }
    this.kill();
  } else {
    if (Math.random() < 0.01 && person.panic < 3) {
      person.panic += 0.1;
    }

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


      person.x += velX * du;
      person.y += velY * du;


    }
  }
}