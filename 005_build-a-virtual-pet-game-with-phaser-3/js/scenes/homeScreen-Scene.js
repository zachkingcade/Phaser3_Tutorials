// create a new scene
let HomeScreenScene = new Phaser.Scene('Home');

HomeScreenScene.create = function(){
    //game background, with active input
    let bg = this.add.sprite(0,0,"backyard").setOrigin(0,0);
    bg.setInteractive();

    //welcome test
    let text = this.add.text(this.sys.game.config.width/2,this.sys.game.config.height/2,"Virtual Pet",{
        font: "40px Ariel",
        fill: "#ffffff"
    })
    text.setOrigin(.5,.5)
    text.depth = 1;

    //text background
    let textBG = this.add.graphics();
    textBG.fillStyle(0x000000, 0.8);
    textBG.fillRect(this.sys.game.config.width/2 - text.width/2, this.sys.game.config.height/2 - text.height/2,text.width,text.height)

    bg.on("pointerdown", function(){
        this.scene.start("Game");
    },this)
}