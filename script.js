var shipImage;
var ship;
var MARGIN = 40;
var SHIP_NORMAL = 'normal';
var SHIP_THRUST = 'thrust';

function preload() {
  shipImage = loadImage('assets/asteroids_ship0001.png');
}

function setup() {
  createCanvas(1200, 725);

  ship = createSprite(width / 2, height / 2);
  ship.debug = false;
  ship.maxSpeed = 6;
  ship.friction = 0.01;
  ship.addImage(SHIP_NORMAL, shipImage);
  ship.addAnimation(SHIP_THRUST, 'assets/asteroids_ship0002.png', 'assets/asteroids_ship0007.png');
}

function draw() {
  background(0);

  // Ship controls
  if (keyDown(LEFT_ARROW)) {
    ship.rotation -= 4;
  }
  if (keyDown(RIGHT_ARROW)) {
    ship.rotation += 4;
  }
  if (keyDown(UP_ARROW)) {
    ship.addSpeed(0.2, ship.rotation);
    ship.changeAnimation(SHIP_THRUST);
  } else {
    ship.changeAnimation(SHIP_NORMAL);
  }

  // Wrap around the screen
  if (ship.position.x < -MARGIN) {
    ship.position.x = width + MARGIN;
  }
  if (ship.position.x > width + MARGIN) {
    ship.position.x = -MARGIN;
  }
  if (ship.position.y < -MARGIN) {
    ship.position.y = height + MARGIN;
  }
  if (ship.position.y > height + MARGIN) {
    ship.position.y = -MARGIN;
  }

  drawSprites();
}
