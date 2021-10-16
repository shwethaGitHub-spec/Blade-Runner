var canvas;
var backgroundImage, runner1_img, runner2_img, runner3_img, runner4_img, track;
var waterImage, waterbottleImg, lifeImage;
var obstacle1Image, obstacle2Image;
var database, gameState;
var form, player, playerCount;
var blastImage;
var allPlayers, runner1, runner2, runner3, runner4, water, waterbottleImg , obstacles;
var runners = [];
var waterBottle;
var droplet;

function preload() {
  backgroundImage = loadImage("../assets/background.png");
  runner1_img = loadAnimation("../assets/bluerun1.png","../assets/bluerun2.png", "../assets/bluerun3.png");
  runner2_img = loadAnimation("../assets/greenrun1.png", "../assets/greenrun2.png", "../assets/greenrun3.png");
  runner3_img = loadAnimation("../assets/purplerun1.png", "../assets/purplerun2.png", "../assets/purplerun3.png");
  runner4_img = loadAnimation("../assets/redrun1.png", "../assets/redrun2.png", "../assets/redrun3.png");
  track = loadImage("../assets/track.png");
  obstacle1Image = loadImage("../assets/obstacle1.png");
  obstacle2Image = loadImage("../assets/obstacle2.png");
  lifeImage = loadImage("../assets/life.png");
  waterbottleImg = loadImage("../assets/water.png");
  dropletImg = loadImage("../assets/droplet.png");
}


function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);
  if (playerCount === 4) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}