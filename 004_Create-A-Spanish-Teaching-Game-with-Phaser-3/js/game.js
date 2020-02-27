// create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {
  // word database
  this.words = [{
      key: 'building',
      setXY: {
        x: 100,
        y: 240
      },
      spanish: 'edificio'
    },
    {
      key: 'house',
      setXY: {
        x: 240,
        y: 280
      },
      setScale: {
        x: 0.8,
        y: 0.8
      },
      spanish: 'casa'
    },
    {
      key: 'car',
      setXY: {
        x: 400,
        y: 300
      },
      setScale: {
        x: 0.8,
        y: 0.8
      },
      spanish: 'automóvil'
    },
    {
      key: 'tree',
      setXY: {
        x: 550,
        y: 250
      },
      spanish: 'árbol'
    }
  ];
}

// load asset files for our game
gameScene.preload = function() {
  // load images
  this.load.image('background', 'assets/images/background-city.png');
  this.load.image('building', 'assets/images/building.png');
  this.load.image('car', 'assets/images/car.png');
  this.load.image('house', 'assets/images/house.png');
  this.load.image('tree', 'assets/images/tree.png');

  this.load.audio('treeAudio', 'assets/audio/arbol.mp3');
  this.load.audio('carAudio', 'assets/audio/auto.mp3');
  this.load.audio('houseAudio', 'assets/audio/casa.mp3');
  this.load.audio('buildingAudio', 'assets/audio/edificio.mp3');
  this.load.audio('correct', 'assets/audio/correct.mp3');
  this.load.audio('wrong', 'assets/audio/wrong.mp3');
};

// executed once, after assets were loaded
gameScene.create = function() {

  this.items = this.add.group(this.words);

  // background
  let bg = this.add.sprite(0, 0, 'background').setOrigin(0, 0);

  // show group sprites on top of the background
  this.items.setDepth(1);

  // getting group array
  let items = this.items.getChildren();

  for(let i = 0; i < items.length; i++) {

    let item = items[i];

    // make item interactive
    item.setInteractive();

    // correct tween
    item.correctTween = this.tweens.add({
      targets: item,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 300,
      paused: true,
      yoyo: true,
      ease: 'Quad.easeInOut'
    });

    item.wrongTween = this.tweens.add({
      targets: item,
      scaleX: 0.5,
      scaleY: 0.5,
      angle : 90,
      duration: 300,
      paused: true,
      yoyo: true,
      ease: 'Quad.easeInOut'
    });

    // transparency tween
    item.alphaTween = this.tweens.add({
      targets: item,
      alpha: 0.7,
      duration: 200,
      paused: true
    });

    // listen to the pointerdown event
    item.on('pointerdown', function(pointer) {
      //grab result of item clicked on
      let result = this.processAnswer(this.words[i].spanish)

      if(result){
        item.correctTween.restart();
      } else {
        item.wrongTween.restart();
      }

      // show next question
      this.showNextQuestion();
    }, this);

    // listen to the pointerover event
    item.on('pointerover', function(pointer) {
      item.alphaTween.restart();
    }, this);

    // listen to the pointerout event
    item.on('pointerout', function(pointer) {
      //stop alpha tween
      item.alphaTween.stop();

      // set no transparency
      item.alpha = 1;
    }, this);

    // create sound for each word
    this.words[i].sound = this.sound.add(this.words[i].key + 'Audio');

  }

  // text object
  this.wordText = this.add.text(30, 20, ' ', {
    font: '28px Open Sans',
    fill: '#ffffff'
  });

  this.correctSound = this.sound.add("correct");
  this.wrongSound = this.sound.add("wrong");

  // show the first question
  this.showNextQuestion();
};

// show new question
gameScene.showNextQuestion = function(){

  // select a random word
  this.nextWord = Phaser.Math.RND.pick(this.words);

  // play a sound for that word
  this.nextWord.sound.play();

  // show the text of the word in Spanish
  this.wordText.setText(this.nextWord.spanish);
};

// check answer
gameScene.processAnswer = function (userResponse){
  //compare user responce to the correct response
  if (userResponse == this.nextWord.spanish){
    //it's correct, play sound
    this.correctSound.play();

    return true;
  } else {
    //it's wrong, play sound
    this.wrongSound.play();

    return false;
  }
}


// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene,
  title: 'Spanish Learning Game',
  pixelArt: false,
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
