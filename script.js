var shipImage;
var ships = [];
var MARGIN = 40;
var SHIP_NORMAL = 'normal';
var SHIP_THRUST = 'thrust';
var asteroids;
var bullets = [];
var bulletImage;
var particleImage;

var asteroidImages = [];


function preload() {
  shipImage = loadImage('assets/asteroids_ship0001.png');
  bulletImage = loadImage('assets/asteroids_bullet.png');
  particleImage = loadImage('assets/asteroids_particle.png');

  for (var i = 0; i < 3; i++) {
    var asteroidImage = loadImage('assets/asteroid' + i + '.png');
    asteroidImages.push(asteroidImage);
  }
}

function setup() {
  createCanvas(1200, 725);

  ships = [];
  bullets = [];

  for (var i = 0; i < 2; i++) {
    var newShip = createSprite(width / 2 + i * 50, height / 2);
    newShip.debug = false;
    newShip.maxSpeed = 6;
    newShip.friction = 0.01;
    newShip.addImage(SHIP_NORMAL, shipImage);
    newShip.addAnimation(SHIP_THRUST, 'assets/asteroids_ship0002.png', 'assets/asteroids_ship0007.png');
    ships.push(newShip);

    var newBullets = new Group();
    newBullets.debug = false;
    bullets.push(newBullets);
    
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


  for (var i = 0; i < ships.length; i++) {
  shipHit(ships[i], bullets[(i + 1) % ships.length]);
  

  for (var i = 0; i < ships.length; i++) {
  var currentShip = ships[i];
  var shipBullets = bullets[i];

  if (keyDown(LEFT_ARROW) && i === 0) {
    currentShip.rotation -= 4;
  }
  if (keyDown(RIGHT_ARROW) && i === 0) {
    currentShip.rotation += 4;
  }
  if (keyDown(UP_ARROW) && i === 0) {
    currentShip.addSpeed(0.2, currentShip.rotation);
    currentShip.changeAnimation(SHIP_THRUST);
  } else {
    currentShip.changeAnimation(SHIP_NORMAL);
  }

  if (!currentShip.removed && keyWentDown('x') && i === 0) {
    var bullet = createSprite(currentShip.position.x, currentShip.position.y);
    bullet.debug = false;
    bullet.addImage(bulletImage);
    bullet.setSpeed(10 + currentShip.getSpeed(), currentShip.rotation);
    bullet.life = 100;
    shipBullets.add(bullet);
  }

  if (i === 1) {
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

    if (!currentShip.bulletFired && keyWentDown('Space')) {
      var bullet2 = createSprite(currentShip.position.x, currentShip.position.y);
      bullet2.debug = false;
      bullet2.addImage(bulletImage);
      bullet2.setSpeed(10 + currentShip.getSpeed(), currentShip.rotation);
      bullet2.life = 100;
      bullets[1].add(bullet2);
    }
  }
  
  drawSprites();
}
}
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

function shipHit(ship, bulletGroup) {
  for (var i = 0; i < bulletGroup.length; i++) {
    if (bulletGroup[i].overlap(ship)) {
      bulletGroup[i].remove();
    }
  }
}
