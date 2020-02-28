// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {
  this.stats = {
    health: 100,
    fun: 100
  }
  //ui is ready to be used
  this.uiReady = false;
};

// executed once, after assets were loaded
gameScene.create = function() {
  //place game background
  let bg = this.add.sprite(0,0,"backyard").setOrigin(0,0);
  bg.setInteractive();

  //event listener for when the background is clicked on
  bg.on("pointerdown", this.placeItem, this)

  //create our ui elements
  this.createUI();
  this.uiReady = true;

  this.pet = this.add.sprite(100,200,"pet",0).setInteractive();
  //make pet apear on top of everything else
  this.pet.depth = 1;
  //make pet draggable
  this.input.setDraggable(this.pet);
  //set pet to follow pointer when being dragged
  this.input.on("drag",function(pointer, gameObject, dragX, dragY){
    //make sprite move to the corrdinate being draged to
    gameObject.x = dragX;
    gameObject.y = dragY;
  })

  //create score texts
  this.createHud();
  this.updateHud()

  //decay of health and fun overtime
  this.timedEventStats = this.time.addEvent({
    delay: 1000,
    repeat: -1,
    callbackScope: this,
    callback: function(){
      this.updateStats({
        health: -5,
        fun : -5
      })
      this.updateHud();
    }
  })
  
};

gameScene.rotatePet = function(){
  //make sure the ui is not blocked
  if (this.scene.uiReady != true){return;}

  //reset ui
  this.scene.resetUI();
  //make sure other ui elements are not selected while this one is
  this.scene.uiReady = false;
  //set alpha to denote selection
  this.alpha = 0.5;

  //scene = this.scene;

  let rotateTween = this.scene.tweens.add({
    targets: this.scene.pet,
    duration:600,
    angle: 720,
    pause: false,
    callbackScope: this,
    onComplete: function(tween, sprites){
      //increase fun
      this.scene.updateStats({
        health: 0,
        fun : 5
      })
      //set ui ready
      this.scene.resetUI();
      this.scene.uiReady = true;
      //update score
      this.scene.updateHud();
    }
  })
}

gameScene.pickItem = function(){
  //if the ui is currently "busy" return
  if (this.scene.uiReady != true){
    return;
  }
  //make sure to reset the ui
  this.scene.resetUI();

  //set item as selected
  this.scene.selectedItem = this;

  //make selected item transparent
  this.alpha = 0.5;
}

//function to create the scenes ui elements
gameScene.createUI = function(){
  this.appleButton = this.add.sprite(80,570,"apple").setInteractive();
  this.appleButton.customStats = {health: 20, fun: 0};
  this.appleButton.on("pointerdown", this.pickItem);

  this.candyButton = this.add.sprite(150,570, "candy").setInteractive();
  this.candyButton.customStats = {health: -5, fun: 10};
  this.candyButton.on("pointerdown", this.pickItem);

  this.toyButton = this.add.sprite(220,570,"toy").setInteractive();
  this.toyButton.customStats = {health: -8, fun: 15};
  this.toyButton.on("pointerdown", this.pickItem);

  this.rotateButton = this.add.sprite(290,570,"rotate").setInteractive();
  this.rotateButton.customStats = {health: 0, fun: 5};
  this.rotateButton.on("pointerdown", this.rotatePet);

  //wrap them all in an array
  this.buttons = [this.appleButton, this.candyButton, this.toyButton, this.rotateButton];
}

gameScene.resetUI = function(){
  //deselect selected item
  this.selectedItem = null;

  //set ui as ready to be used again
  this.uiReady = true;

  //make sure the alpha of all the items are reset
  for (let i = 0; i < this.buttons.length; i++){
    this.buttons[i].alpha = 1;
  }

}

gameScene.placeItem = function (pointer, localX, localY){
  //if no ui element is selected we cannot create a new item
  if(!this.selectedItem || this.uiReady != true){return;}

  //create a new item at the clicked spot
  let newItem = this.add.sprite(localX,localY,this.selectedItem.texture.key);

  //block ui till pet has used item
  this.uiReady = false;

  //pet movement towards the placed item
  let petTween = this.tweens.add({
    targets: this.pet,
    duration: 500,
    x: newItem.x,
    y: newItem.y,
    pause: false,
    callbackScope: this,
    onComplete: function(tween,sprites){
    //destry item
    newItem.destroy();
    
    //play eating animation
    this.pet.play('funnyfaces');

    this.pet.on("animationcomplete", function(){
      //reset pets face to default
      this.pet.setFrame(0);
      //reset ui only after the eating animation is complete
      this.resetUI();
    }, this)
      
    //update pets stats
    this.updateStats({
      health: this.selectedItem.customStats.health,
      fun : this.selectedItem.customStats.fun
    })

    //update score
    this.updateHud()
    }
  })
}

// create the text elements that will show the stats
gameScene.createHud = function(){
  this.healthText = this.add.text(20,20,"Health: ",{
    font: "20px Arial",
    fill: "#ffffff"
  })
  this.funText = this.add.text(150,20,"Fun: ",{
    font: "20px Arial",
    fill: "#ffffff"
  })
}

//update the strings for the hud
gameScene.updateHud = function (){
  this.healthText.setText("Health: " + this.stats.health);
  this.funText.setText("Fun: " + this.stats.fun);
}

gameScene.updateStats = function(statBlock){
  if (this.stats.health + statBlock.health > 0){
    this.stats.health += statBlock.health;
  } else {
    this.stats.health = 0;
    this.gameOver();
  }

  if (this.stats.fun + statBlock.fun > 0){
    this.stats.fun += statBlock.fun;
  } else {
    this.stats.fun = 0;
    this.gameOver();
  }
}

gameScene.gameOver = function (){
  //restrict access to ui
  this.uiReady = false;

  //set sprite to dead pet sprite
  this.pet.setFrame(4);

  this.time.addEvent({
    delay: 3000,
    repeat: 1,
    callbackScope: this,
    callback: function(){
      this.scene.start("Home");
    }
  })
}

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  scene: [BootScene,LoadingScene,HomeScreenScene,gameScene,],
  title: 'Virtual Pet',
  pixelArt: false,
  backgroundColor: 'ffffff'
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
