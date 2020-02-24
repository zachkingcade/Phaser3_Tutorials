//create a new scene
let gameScene = new Phaser.Scene('Game')

//initalize all varibles
gameScene.init = function(){
  this.playerSpeed = 2;

  this.maxY = 280;
  this.minY = 130;
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

  //---Create enemy sprite---
  this.enemy = this.add.sprite(450,180,"enemy")
  this.enemy.setScale(.5)
  this.enemy.flipX = true;
  this.enemy.speed = Math.trunc(1 + Math.random() * 3);
  if (Math.random() < .5){
    this.enemy.speed *= -1;
  }

  //---Create Goal Sprite---
  this.goal = this.add.sprite(this.sys.game.config.width - 80,180,"goal");
  this.goal.setScale(.5);
}

//called up to 60 times a second
gameScene.update = function (){
  //check for active input
  if(this.input.activePointer.isDown){
    this.player.x += this.playerSpeed;
  }

  //move enemies
  this.enemy.y += this.enemy.speed;

  //---------------collisons---------------

  let playerRect = this.player.getBounds();
  let goalRect = this.goal.getBounds();
  let enemyRect = this.enemy.getBounds();

  //player Collides with enemy
  if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect,enemyRect)){
    //lose message
    console.log("Damn Bro! you lose!");

    //restart scene
    this.scene.restart();
    return;
  }

  //if enemy hits wall
  if (this.enemy.speed < 0 && this.enemy.y <= this.minY){
    this.enemy.speed *= -1;
  } else if (this.enemy.speed > 0 && this.enemy.y >= this.maxY){
    this.enemy.speed *= -1;
  }

  //player collides with goal
  if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect,goalRect)){
    //win message
    console.log("Yay! you made it!")

    //restart scene
    this.scene.restart();
    return;
  }
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