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
var bulletImage;
var bullets = [];
var gameState = 0;
var timer = 100;
var transitionState = 0;


let player1Name = "";
let player2Name = "";
var typingPlayer1Name = false;
var typingPlayer2Name = false;


var myFont;
var myFont1;

var music;

function preload() {
  shipImage = loadImage('assets/asteroids_ship0001.png');
  bulletImage = loadImage('assets/asteroids_bullet.png');
  particleImage = loadImage('assets/asteroids_particle.png');

  myFont = loadFont('fonts/BrokenMachine.ttf');
  myFont1 = loadFont('fonts/FutureNowRegular.ttf');

  music = loadSound('fortnitecoral.mp3');
  
  for (var i = 0; i < 3; i++) {
    var asteroidImage = loadImage('assets/asteroid' + i + '.png');
    asteroidImages.push(asteroidImage);
  }
}

function setup() {
  createCanvas(1200, 725);

  music.play();


  // Laad opgeslagen namen uit de localstorage als deze bestaan
  if (localStorage.getItem('player1Name')) {
    player1Name = localStorage.getItem('player1Name');
  }
  if (localStorage.getItem('player2Name')) {
    player2Name = localStorage.getItem('player2Name');
  }

  document.getElementById("player1Name").addEventListener("input", function(event) {
    player1Name = event.target.value;
    // Sla de ingevoerde naam op in de localstorage
    localStorage.setItem('player1Name', player1Name);
  });

  document.getElementById("player2Name").addEventListener("input", function(event) {
    player2Name = event.target.value;
    // Sla de ingevoerde naam op in de localstorage
    localStorage.setItem('player2Name', player2Name);
  });

  
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
  if (gameState == 0) {
    menu();
  } else if (gameState == 1) {
    SpaceGame();
  } else if (gameState == 3) {
    showLivesTransition();
  } 

}

function menu() {
  background(0);
  fill(4, 44, 220);
  textSize(70);
  textFont(myFont);
  text('Space Games', width / 3, height / 4);

  fill(255, 255, 255);
  textSize(35);
  textAlign(LEFT);
  textFont(myFont1);
  text('Player 1 Name: ', width / 2, height / 2 - 50);
  text('Player 2 Name: ', width / 2, height / 2);


  var player1NameInput = document.getElementById("player1Name");
  player1NameInput.style.display = 'block';
  player1NameInput.style.position = 'absolute';
  player1NameInput.style.left = (width / 2 + 5) + 'px'; 
  player1NameInput.style.top = (height / 2 - 10) + 'px'; 

  var player2NameInput = document.getElementById("player2Name");
  player2NameInput.style.display = 'block';
  player2NameInput.style.position = 'absolute';
  player2NameInput.style.left = (width / 2 + 5) + 'px'; 
  player2NameInput.style.top = (height / 2 + 20) + 'px'; 

  fill(4, 44, 220);
  textSize(30);
  text('Press 1 for Space Race', width / 3, height / 2 + 50);

  fill(255, 255, 255);
  textAlign(CENTER);
  textSize(20);
  textFont(myFont);
  text('CONTROLS: WASD + Spacebar', 1000, 550);
  text('CONTROLS: ArrowKeys + Enter', 1000, 580);
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

  for (var i = 0; i < asteroids.length; i++) {
    for (var j = 0; j < ships.length; j++) {
      if (asteroids[i].overlap(ships[j])) {
        asteroidHit(asteroids[i], ships[j]);
      }
    }
  }

  for (var i = 0; i < asteroids.length; i++) {
    for (var j = 0; j < bullets.length; j++) {
      bullets[j].overlap(asteroids[i], hitAsteroid);
    }
  }

  for (var i = 0; i < ships.length; i++) {
  shipHit(ships[i], bullets[(i + 1) % ships.length]);
  }

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

  if (!currentShip.removed && keyWentDown('Enter') && i === 0) {
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
     currentShip.bulletFired = true;
      }
      }

      if (!keyDown('Space')) {
        currentShip.bulletFired = false;
      }
    }
  
  drawSprites();

  fill(255, 255, 255);
  textAlign(CENTER);
  textSize(20);
  textAlign(CENTER);
  text('TIME: ' + timer + ' s', width / 2, 100);

  if (frameCount % 60 == 0) {
    timer -= 1;
  }
  }

function SpaceGame() {
background(0);
drawUi();

  var player1NameInput = document.getElementById("player1Name");
  player1NameInput.style.display = 'none';

  var player2NameInput = document.getElementById("player2Name");
  player2NameInput.style.display = 'none';

  
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


function hitAsteroid(bullet, asteroid) {
  bullet.remove();
  asteroid.remove();
  asteroid.type--;

  if (asteroid.type >= 1) {
    createAsteroid(asteroid.type, asteroid.position.x + 20, asteroid.position.y + 20);
    createAsteroid(asteroid.type, asteroid.position.x - 20, asteroid.position.y - 20);
  }

  for (var i = 0; i < 10; i++) {
    var particle = createSprite(asteroid.position.x, asteroid.position.y);
    particle.addImage(particleImage);
    particle.setSpeed(random(3, 5), random(360));
    particle.friction = 0.01;
    particle.life = 15;
  }
}

function asteroidHit(asteroid, ship) {
  ship.position.x = width / 2;
  ship.position.y = height / 2;
}

var transitionTimer = 5;
var lastFrameTime;

function shipHit(ship, bulletGroup) {
  for (var i = 0; i < bulletGroup.length; i++) {
    if (bulletGroup[i].overlap(ship)) {
      bulletGroup[i].remove();
      ship.lives--;

      if (ship.lives > 0) {
        gameState = 3;
        transitionTimer = 5; 
      } 
    }
  }
}


function showLivesTransition() {
  background(0);

  var currentTime = millis(); 
  var deltaTime = (currentTime - lastFrameTime) / 1000; 
  lastFrameTime = currentTime; 

  transitionTimer -= deltaTime; 

 
  fill(255);
  textSize(20);
  textAlign(CENTER);
  text(player1Name + ": " + ships[0].lives + " lives remaining", width/4, height/2);
  text(player2Name + ": " + ships[1].lives + " lives remaining", width * 3/4, height/2);

  if (transitionTimer <= 0) {
    gameState = 1; 
  }

  if (ships[0].lives <= 0 || ships[1].lives <= 0) {
    if (ships[0].lives <= 0) {
      gameState = 3;
    } else {
      gameState = 3;
    }
  }
}


function keyPressed() {
  if (keyCode == 49) { // Toets 1
    if (gameState == 0){
    gameState = 1;
    }
  }
}