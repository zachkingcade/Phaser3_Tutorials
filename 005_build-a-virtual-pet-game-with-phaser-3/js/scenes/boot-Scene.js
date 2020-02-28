// create a new scene
let BootScene = new Phaser.Scene('Boot');

BootScene.preload = function() {
//load inital image
    this.load.image("logo", "assets/images/rubber_duck.png");
}

BootScene.create = function() {
    this.scene.start("Loading");
}

    

