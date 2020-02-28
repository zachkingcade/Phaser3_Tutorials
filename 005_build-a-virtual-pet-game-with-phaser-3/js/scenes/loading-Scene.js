// create a new scene
let LoadingScene = new Phaser.Scene('Loading');

// load asset files for our game
LoadingScene.preload = function() {
    
    //add logo
    let logo = this.add.sprite(this.sys.game.config.width/2,250,"logo")

    //progress bar background
    let bgBar = this.add.graphics();
    //loading bar background width and height
    let barW = 150;
    let barH = 30;
    bgBar.setPosition(this.sys.game.config.width/2 - barW/2,this.sys.game.config.height/2 - barH/2);
    bgBar.fillStyle(0xF5F5F5, 1);
    bgBar.fillRect(0,0,barW,barH);

    //progress bar
    let progressBar = this.add.graphics();
    //loading bar background width and height
    let pBarW = 150;
    let pBarH = 30;
    progressBar.setPosition(this.sys.game.config.width/2 - pBarW/2,this.sys.game.config.height/2 - pBarH/2);

    //listen to the "progress" event
    this.load.on("Progress", function(value){
        //clear the progress bar so we can draw again
        progressBar.clear()
        
        //redraw progress bar
        progressBar.fillStyle(0x9AD98D, 1);
        progressBar.fillRect(0,0,value * 150,30)

        
    },this)


    // load assets
    this.load.image('backyard', 'assets/images/backyard.png');
    this.load.image('apple', 'assets/images/apple.png');
    this.load.image('candy', 'assets/images/candy.png');
    this.load.image('rotate', 'assets/images/rotate.png');
    this.load.image('toy', 'assets/images/rubber_duck.png');
    //chearacter Sprite sheet
    this.load.spritesheet("pet","./assets/images/pet.png",{
      frameWidth: 97,
      frameHeight: 83,
      margin: 1,
      spacing: 1
    });
  };

  LoadingScene.create = function(){
    //pet eating animation
    this.anims.create({
        key: 'funnyfaces',
        frames: this.anims.generateFrameNames('pet', {frames: [1, 2, 3]}),
        frameRate: 7,
        yoyo: true, 
        repeat: 0
    });

    this.scene.start("Home")
  }