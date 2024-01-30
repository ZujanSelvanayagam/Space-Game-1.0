var shipImage;
var ships = [];
var MARGIN = 40;
var SHIP_NORMAL = 'normal';
var SHIP_THRUST = 'thrust';
var asteroids;
var asteroidImages = [];


function preload() {
  shipImage = loadImage('assets/asteroids_ship0001.png');

  for (var i = 0; i < 3; i++) {
    var asteroidImage = loadImage('assets/asteroid' + i + '.png');
    asteroidImages.push(asteroidImage);
  }
}

function setup() {
  createCanvas(1200, 725);

  ships = [];

  for (var i = 0; i < 2; i++) {
    var newShip = createSprite(width / 2 + i * 50, height / 2);
    newShip.debug = false;
    newShip.maxSpeed = 6;
    newShip.friction = 0.01;
    newShip.addImage(SHIP_NORMAL, shipImage);
    newShip.addAnimation(SHIP_THRUST, 'assets/asteroids_ship0002.png', 'assets/asteroids_ship0007.png');
    ships.push(newShip);
  }

  asteroids = new Group();

  for (var i = 0; i < 8; i++) {
    var angle = random(360);
    var x = width / 2 + 1000 * cos(radians(angle));
    var y = height / 2 + 1000 * sin(radians(angle));
    createAsteroid(3, x, y);
  }
}

function draw() {
  background(0);
  drawUi();
}

function drawUi() {
  for (var i = 0; i < allSprites.length; i++) {
    var sprite = allSprites[i];
    if (sprite.position.x < -MARGIN) {
      sprite.position.x = width + MARGIN;
    }
    if (sprite.position.x > width + MARGIN) {
      sprite.position.x = -MARGIN;
    }
    if (sprite.position.y < -MARGIN) {
      sprite.position.y = height + MARGIN;
    }
    if (sprite.position.y > height + MARGIN) {
      sprite.position.y = -MARGIN;
    }
  }

  // Ship controls
  for (var i = 0; i < ships.length; i++) {
    var currentShip = ships[i];

    if (i === 0) {
      // Controls for the first ship
      if (keyDown(LEFT_ARROW)) {
        currentShip.rotation -= 4;
      }
      if (keyDown(RIGHT_ARROW)) {
        currentShip.rotation += 4;
      }
      if (keyDown(UP_ARROW)) {
        currentShip.addSpeed(0.2, currentShip.rotation);
        currentShip.changeAnimation(SHIP_THRUST);
      } else {
        currentShip.changeAnimation(SHIP_NORMAL);
      }
    }

    if (i === 1) {
      // Controls for the second ship
      if (keyDown(65)) {
        currentShip.rotation -= 4;
      }
      if (keyDown(68)) {
        currentShip.rotation += 4;
      }

      if (keyDown(87)) {
        currentShip.addSpeed(0.2, currentShip.rotation);
        currentShip.changeAnimation(SHIP_THRUST);
      } else {
        currentShip.changeAnimation(SHIP_NORMAL);
      }
    }
  }

  drawSprites();
}


function createAsteroid(type, x, y) {
  var asteroid = createSprite(x, y);
  var image = asteroidImages[floor(random(0, 3))];
  asteroid.addImage(image);
  asteroid.setSpeed(2.5 - type / 2, random(360));
  asteroid.rotationSpeed = 0.5;
  asteroid.type = type;

  if (type === 2) {
    asteroid.scale = 0.6;
  }
  if (type === 1) {
    asteroid.scale = 0.3;
  }

  asteroid.mass = 2 + asteroid.scale;
  asteroid.setCollider('circle', 0, 0, 50);
  asteroids.add(asteroid);
  return asteroid;
}