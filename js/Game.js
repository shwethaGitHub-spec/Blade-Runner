class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.leader3 = createElement("h2");
    this.leader4 = createElement("h2");
    this.playerMoving = false;
    this.leftKeyActive = false;
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    runner1 = createSprite(width / 2 - 150, height - 100);
    runner1.addAnimation("runner1", runner1_img);
    runner1.scale = 0.7;

    
   // car1.scale = 0.07;

   // car1.addImage("blast", blastImage);
   
    
   runner2 = createSprite(width / 2 -100, height - 100);
   runner2.addAnimation("runner2", runner2_img);
   runner2.scale = 0.7;
       
   runner3 = createSprite(width / 2 , height - 100);
   runner3.addAnimation("runner3", runner3_img);
   runner3.scale = 0.7;
   // car2.scale = 0.07;
    
   // car2.addImage("blast", blastImage);
    
   runner4 = createSprite(width / 2 + 150, height - 100);
   runner4.addAnimation("runner4", runner4_img);
   runner4.scale = 0.7;
    
   
   runners=[runner1, runner2, runner3, runner4]

    waterBottle = new Group();

    
    obstacles = new Group();

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];

    // Adding fuel sprite in the game
    //this.addSprites(fuels, 4, fuelImage, 0.02);

    // Adding coin sprite in the game
    this.addSprites(waterBottle,10, waterbottleImg, 0.2);

    //Adding obstacles sprite in the game
    this.addSprites(
      obstacles,
      obstaclesPositions.length,
      obstacle1Image,
      0.25,
      obstaclesPositions
    );
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      //C41 //SA
      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;
      } else {
        x = random(width / 2 + 150, width / 2 - 150);
        y = random(-height * 4.5, height - 400);
      }
      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }



  }

  handleElements() {
    form.hide();
    //form.titleImg.class("gameTitleAfterEffect");

    //C39
    this.resetTitle.html("Reset Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Leaderboard");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);

    
    this.leader3.class("leadersText");
    this.leader3.position(width / 3 - 50, 180);

    this.leader4.class("leadersText");
    this.leader4.position(width / 3 - 50, 230);
  }

  handleObstacleCollision(index){
    if(runners[index-1].collide(obstacles)){

      if(this.leftKeyActive){
        player.positionX +=100;
      } else{
        player.positionY -=100;
      }

      if(player.life> 0){
        player.life -= 185/4;
      }

      player.update();
    }
  }

 
  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();
    player.getPlayersAtEnd();

    if (allPlayers !== undefined) {
      image(track,300, -height * 5, width, height * 6);

      this.showLife();
      this.showLeaderboard();
      this.showWaterBottleBar();

      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;
        
        var currentLife = allPlayers[plr].life;

       

        runners[index - 1].position.x = x;
        runners[index - 1].position.y = y;

        if (index === player.index) {
          stroke(10);
          fill("white");
          ellipse(x, y, 30, 30);

        //  this.handleFuel(index);
          //this.handlePowerCoins(index);
          this.handleObstacleCollision(index);
          this.handleWaterbottles(index);
          this.handleWater(index);
         
          if(player.life<=0){
            this.playerMoving = false;
            this.gameOver();
          }
          
          // Changing camera position in y direction
          camera.position.y = runners[index - 1].position.y;
        }
      }

      if (this.playerMoving) {
        player.positionY += 5;
        player.update();
      }

      // handling keyboard events
      this.handlePlayerControls();

      // Finshing Line
      const finshLine = height * 6 - 100;

      if (player.positionY > finshLine) {
        gameState = 2;
        player.rank += 1;
        Player.updatePlayersAtEnd(player.rank);
        player.update();
        this.showRank();
      }

      drawSprites();
    }
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        playersAtEnd: 0
      });
      window.location.reload();
    });
  }

  showLife() {
    push();
    image(lifeImage, width / 2 - 130, height - player.positionY - 400, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 400, 185, 20);
    fill("#f50057");
    rect(width / 2 - 100, height - player.positionY - 400, player.life, 20);
    noStroke();
    pop();
  }

  showWaterBottleBar() {
    push();
    image(dropletImg, width / 2 - 130, height - player.positionY - 350, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 350, 185, 20);
    fill("#02C6FA");
    rect(width / 2 - 100, height - player.positionY - 350, player.waterBottle, 20);
    noStroke();
    pop();
  }

  

  showLeaderboard() {
    var leader1, leader2, leader3, leader4;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    This tag is used for displaying four spaces.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

        
      leader3 =
      players[2].rank +
      "&emsp;" +
      players[2].name +
      "&emsp;" +
      players[2].score;

      
      leader4 =
        players[3].rank +
        "&emsp;" +
        players[3].name +
        "&emsp;" +
        players[3].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader3 =
        players[2].rank +
        "&emsp;" +
        players[2].name +
        "&emsp;" +
        players[2].score;

      
      leader4 =
        players[3].rank +
        "&emsp;" +
        players[3].name +
        "&emsp;" +
        players[3].score;


    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
    
    this.leader3.html(leader3);
    this.leader4.html(leader4);
  }

  handlePlayerControls() {
   

    if (keyIsDown(UP_ARROW)) {
      this.playerMoving = true;
      player.positionY += 10;
      player.update();
    }

    if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
      this.leftKeyActive = true;
      player.positionX -= 5;
      player.update();
    }

    if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
      this.leftKeyActive = false;
      player.positionX += 5;
      player.update();
      }
    
  }

  handleWater(index) {
    // Adding fuel
    runners[index - 1].overlap(waterBottle, function(collector, collected) {
      player.waterBottle = 185;
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    })

    //Reducing Player car fuel
    if (player.waterBottle > 0 && this.playerMoving) {
      player.waterBottle-=0.5;
    }

    if (player.waterBottle <= 0) {
      gameState = 2;
      this.gameOver();
    }
  }

  handleWaterbottles(index) {
    runners[index - 1].overlap(waterBottle, function(collector, collected) {
      player.score += 10;
      player.waterBottle = 185
      player.update();
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });
  }

  showRank() {
    swal({
      title: `Awesome${"\n"}Rank!${"\n"}${player.rank}`,
      text: "You reached the finish line successfully",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Olympic_rings_with_transparent_rims.svg/1280px-Olympic_rings_with_transparent_rims.svg.png",
      imageSize: "200x200",
      confirmButtonText: "Ok"
    });
  }

  gameOver() {
    swal({
      title: `Game Over`,
      text: "Oops you lost the race....!!!",
      imageUrl:
        "https://media.istockphoto.com/vectors/game-over-comic-speech-bubble-style-vector-illustrationjpg-vector-id1169155347?k=20&m=1169155347&s=612x612&w=0&h=eT4Jpj5ZqBu1oFS5Fv2rXPhvq_Q0JUIiPcvae1P3sVI=",
      imageSize: "200x200",
      confirmButtonText: "Thanks For Playing"
    });
  }

  end(){
    console.log(game)

  }
}
