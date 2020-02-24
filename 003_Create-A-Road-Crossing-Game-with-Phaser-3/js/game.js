//create a new scene
let gameScene = new Phaser.Scene('Game')

//initalize all varibles
gameScene.init = function(){
  this.playerSpeed = 2;

  this.maxY = 280;
  this.minY = 80;

  this.isEnding = false;
}

//load assets
gameScene.preload = function (){
  //load sprites
  this.load.image("background","assets/background.png");
  this.load.image("player","assets/player.png");
  this.load.image("enemy","assets/dragon.png");
  this.load.image("goal","assets/treasure.png");
}

gameScene.create = function(){
  //---create background sprite---
  let bg = this.add.sprite(0,0,"background");
  bg.setOrigin(0,0);

  //---create player sprite---
  this.player = this.add.sprite(50,180,"player");
  this.player.setScale(.5);

  //---Create a group of enemy sprites---
  this.enemies = this.add.group({
    key: 'enemy',
    repeat: 5,
    setXY: {
      x: 90,
      y: 90,
      stepX: 85,
      stepY: 20
    }
  });
  Phaser.Actions.ScaleXY(this.enemies.getChildren(),-.5,-.5);
  Phaser.Actions.Call(this.enemies.getChildren(), function(enemy){
    enemy.flipX = true;
    enemy.speed = Math.trunc(1 + Math.random() * 3);
    if (Math.random() < .5){enemy.speed *= -1;};
  }, this)

  //---Create Goal Sprite---
  this.goal = this.add.sprite(this.sys.game.config.width - 80,180,"goal");
  this.goal.setScale(.5);
}

//called up to 60 times a second
gameScene.update = function (){
  if (this.isEnding){return;};

  //check for active input
  if(this.input.activePointer.isDown){
    this.player.x += this.playerSpeed;
  }

  //move enemies and check enemy collison with walls
  let dragons =  this.enemies.getChildren();
  let dragonsNum = dragons.length;

  for (let i = 0; i < dragonsNum; i++){
    //move enemies
    dragons[i].y += dragons[i].speed; 

    //let enemyRect = dragons[i].getBounds();

    //if enemy hits wall
    if (dragons[i].speed < 0 && dragons[i].y <= this.minY){
      dragons[i].speed *= -1;
    } else if (dragons[i].speed > 0 && dragons[i].y >= this.maxY){
      dragons[i].speed *= -1;
    }
  }

  //---------------collisons---------------

  let playerRect = this.player.getBounds();
  let goalRect = this.goal.getBounds();

  //player Collides with any enemy in the group
  for (let i = 0; i < dragonsNum; i++){
    let enemyRect = dragons[i].getBounds();
    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect,enemyRect)){
      //lose message
      console.log("Damn Bro! you lose!");

      //restart scene
      return this.GameOver();
    }
  }

  //player collides with goal
  if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect,goalRect)){
    //win message
    console.log("Yay! you made it!")

    //restart scene
    return this.GameOver();
  }
}

gameScene.GameOver = function(){
  //makes sure not to run this function multiple times
  this.isEnding = true;
  //shake camera event
  this.cameras.main.shake(500)
  //listen for event end
  this.cameras.main.on("camerashakecomplete",function(){
    this.cameras.main.fade(500)
  },this)
  this.cameras.main.on("camerafadeoutcomplete",function(){
    this.scene.restart();
  },this)
}

//set the configuration of the game
let config = {
  type: Phaser.Auto,
  width: 640,
  height:360,
  scene: gameScene
};

//create a new game, pass the config
let game = new Phaser.Game(config)