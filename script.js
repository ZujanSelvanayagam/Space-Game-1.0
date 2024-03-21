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
var gameState = 0;
var timer = 100;
var transitionState = 0;

var player1Wins = false;
var player2Wins = false;

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


  document.getElementById("player1Name").addEventListener("input", function(event) {
      var input = event.target.value;
      if (input.length <= 10) {
          player1Name = input;
          // Sla de ingevoerde naam op in de localstorage
          localStorage.setItem('player1Name', player1Name);
      } else {
          // Als de ingevoerde naam langer is dan 10 tekens
          event.target.value = input.substring(0, 10);
      }
  });

  document.getElementById("player2Name").addEventListener("input", function(event) {
      var input = event.target.value;
      if (input.length <= 10) {
          player2Name = input;
          // Sla de ingevoerde naam op in de localstorage
          localStorage.setItem('player2Name', player2Name);
      } else {
          // Als de ingevoerde naam langer is dan 10 tekens
          event.target.value = input.substring(0, 10);
      }
  });


  lastFrameTime = millis();
  
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
  } else if (gameState == 2) {
    gameOver();
  } else if (gameState == 3) {
    showLivesTransition();
  } else if (gameState == 4) {
    player1WinsState();
  } else if (gameState == 5) {
    player2WinsState();
  }

    if (gameState !== 3) {
      updateAsteroids();
    }
  }

  function updateAsteroids() {
    for (var i = 0; i < asteroids.length; i++) {
      if (gameState !== 3) {
        asteroids[i].update();
      }
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

  text('Player 1 Name: ' + player1Name, width / 2, height / 2 - 50);
  text('Player 2 Name: ' + player2Name, width / 2, height / 2);

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

  restart();
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

  if (timer <= 0) {
    gameState = 2;
  } 
}

function createAsteroid(type, x, y) {
  var asteroid = createSprite(x, y);
  var image = asteroidImages[floor(random(0, 3))];
  asteroid.addImage(image);
  asteroid.setSpeed(0.01 - type / 15, random(360));
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
  ship.position.x = random(width);
  ship.position.y = random(height);
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
      } else {
        if (ships.indexOf(ship) === 0) {
          gameState = 5;  
        } else {
          gameState = 4;  
      }
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

  textAlign(CENTER);
  fill(255, 255, 255);
  textSize(20);
  textFont(myFont);
  text(player1Name + ": " + ships[0].lives + " lives remaining", width/4, height/2);
  text(player2Name + ": " + ships[1].lives + " lives remaining", width * 3/4, height/2);

  if (transitionTimer <= 0) {
    gameState = 1; 
  }

  if (ships[0].lives <= 0 || ships[1].lives <= 0) {
    if (ships[0].lives <= 0) {
      gameState = 4; 
    } else {
      gameState = 5; 
    }
    if (ships[0].lives <= 0) {
      gameState = 3;
    } else {
      gameState = 3;
    }
  }
}

function player1WinsState() {
  background(0);
  textSize(50);
  fill(4, 44, 220);
  textAlign(CENTER);
  textFont(myFont);
  text(player1Name + ' Wins!', width / 2, height / 2 - 50);
 
  fill(255, 255, 255);
  textSize(35);
  textAlign(CENTER);
  textFont(myFont);
  text('Press 1 to restart', width / 2, height / 2 + 50);
}

function player2WinsState() {
  background(0);
  textSize(50);
  fill(4, 44, 220);
  textAlign(CENTER);
  textFont(myFont);
  text(player2Name + ' Wins!', width / 2, height / 2 - 50);
 
  fill(255, 255, 255);
  textSize(35);
  textAlign(CENTER);
  textFont(myFont);
  text('Press 1 to restart', width / 2, height / 2 + 50);
}

function keyPressed() {
  if (keyCode == 49) { // Toets 1
    if (gameState == 0) {
      restart();
      gameState = 1;
      timer = 100;
    }else if (keyCode == 49 && gameState == 2 || gameState == 4 || gameState == 5){ 
          gameState = 0; 

      player1Name = "";
      player2Name = "";
      // Wis de namen ook uit de local storage
      localStorage.removeItem('player1Name');
      localStorage.removeItem('player2Name');
      // Wis de inhoud van de invoervakjes
      document.getElementById("player1Name").value = "";
      document.getElementById("player2Name").value = "";
        }
      } 
    }

function gameOver() {
  background(0);
  textSize(50);
  textAlign(CENTER);
  fill(4, 44, 220);
  textFont(myFont);
  text('Both Game Over', width / 2, height / 2 - 50);
  
  textSize(30);
  fill(255, 255, 255);
  textAlign(CENTER);
  textFont(myFont);
  text('Press 1 to restart', width / 2, height / 2 + 50);

  fill(4, 44, 220);
  textFont(myFont);
  text('Made by Jimi, Zujan, Ruben, Ramses', width / 3, height - 20);
}

function restart() {
  localStorage.clear();
  
  timer = 100;

  for (var i = 0; i < ships.length; i++) {
    ships[i].lives = 5;
  }

  for (var i = 0; i < ships.length; i++) {
    ships[i].position.x = width / 2 + i * 50;
    ships[i].position.y = height / 2;
    ships[i].rotation = 0;
  }

  for (var i = 0; i < bullets.length; i++) {
    bullets[i].removeSprites();
  }

  asteroids.removeSprites();

  for (var i = 0; i < 8; i++) {
    var angle = random(360);
    var x = width / 2 + 1000 * cos(radians(angle));
    var y = height / 2 + 1000 * sin(radians(angle));
    createAsteroid(3, x, y);
  }
}
