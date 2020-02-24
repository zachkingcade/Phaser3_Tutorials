abs = Math.abs;

//----------Varibles----------
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

let screenWidth = 1000;
let screenHeight = 500;
let playerSpeed = 3;
let gameOver = false;
let currentLevel = 0;
let walkingSoundPlaying = false;


//----------Listeners----------
document.onkeydown = function (event) {
    //captures which key is pressed down
    let keyPressed = event.keyCode;

    //right arrow key
    if (keyPressed == 39) { levels[currentLevel].player.xSpeed = playerSpeed; }
    //left arrow key
    if (keyPressed == 37) { levels[currentLevel].player.xSpeed = -1 * playerSpeed; }
    //down arrow key
    if (keyPressed == 40) { levels[currentLevel].player.ySpeed = playerSpeed; }
    //up arrow key
    if (keyPressed == 38) { levels[currentLevel].player.ySpeed = -1 * playerSpeed; }
}

document.onkeyup = function (event) {
    //captures which key was unpressed
    let keyPressed = event.keyCode;

    //if right arrow key
    if (keyPressed == 39) { levels[currentLevel].player.xSpeed = 0; }
    //if left arrow key
    if (keyPressed == 37) { levels[currentLevel].player.xSpeed = 0; }
    //if down arrow key
    if (keyPressed == 40) { levels[currentLevel].player.ySpeed = 0; }
    //if up arrow key
    if (keyPressed == 38) { levels[currentLevel].player.ySpeed = 0; }
}

//----------NonPlayer Asset Loading----------

//sounds
let sounds = {};

let loadSounds = function () {
    sounds.badies = new sound("./Assets/Sounds/ikillyou");
    sounds.eat = new sound("./Assets/Sounds/Eating");
    sounds.walk = new sound("./Assets/Sounds/walking.mp3");
}

//----------Level Objects----------
//used to hold all the levels
let levels = [];

//----------Level one----------
levels[0] = new Level();
levels[0].background.src = "./Assets/Sprites/woodenfloor.jpg";
levels[0].player = new Gamecharacter(50, 200, 50, 50, "rgb(0,255,0)", 0, 0, "./Assets/Sprites/zach.jpg");
levels[0].player.soundWalking = new sound("./Assets/Sounds/walking.mp3");
levels[0].goal = new NPC(900, 200, 50, 50, "rgb(255,200,200)", 0, 0, "./Assets/Sprites/kitkat.png","./Assets/Sounds/ikillyou");
levels[0].badies[0] = new NPC(200, 50, 50, 50, "rgb(255,0,0)", 0, 1, "./Assets/Sprites/savanna.jpg","./Assets/Sounds/ikillyou");
levels[0].badies[1] = new NPC(400, 50, 50, 50, "rgb(255,0,0)", 0, 3, "./Assets/Sprites/savanna.jpg","./Assets/Sounds/ikillyou");
levels[0].badies[2] = new NPC(600, 50, 50, 50, "rgb(255,0,0)", 0, 5, "./Assets/Sprites/savanna.jpg","./Assets/Sounds/ikillyou");
levels[0].badies[3] = new NPC(750, 50, 50, 50, "rgb(255,0,0)", 0, 4, "./Assets/Sprites/savanna.jpg","./Assets/Sounds/ikillyou");

//----------Level two----------
levels[1] = new Level();
levels[1].background.src = "./Assets/Sprites/grassBG.jpg";
levels[1].player = new Gamecharacter(50, 200, 50, 50, "rgb(0,255,0)", 0, 0, "./Assets/Sprites/zach.jpg");
levels[1].player.soundWalking = new sound("./Assets/Sounds/walking.mp3");
levels[1].goal = new NPC(900, 200, 50, 50, "rgb(255,200,200)", 0, 0, "./Assets/Sprites/chipotle.png");
levels[1].badies[0] = new NPC(150, 50, 50, 50, "rgb(255,0,0)", 0, 1, "./Assets/Sprites/jeremy.jpg","./Assets/Sounds/Jeremy.m4a");
levels[1].badies[1] = new NPC(200, 50, 50, 50, "rgb(255,0,0)", 0, 2, "./Assets/Sprites/jeremy.jpg","./Assets/Sounds/Jeremy.m4a");
levels[1].badies[2] = new NPC(300, 50, 50, 50, "rgb(255,0,0)", 0, 3, "./Assets/Sprites/jeremy.jpg","./Assets/Sounds/Jeremy.m4a");
levels[1].badies[3] = new NPC(350, 50, 50, 50, "rgb(255,0,0)", 0, 4, "./Assets/Sprites/jeremy.jpg","./Assets/Sounds/Jeremy.m4a");
levels[1].badies[4] = new NPC(400, 50, 50, 50, "rgb(255,0,0)", 0, 6, "./Assets/Sprites/jeremy.jpg","./Assets/Sounds/Jeremy.m4a");
levels[1].badies[5] = new NPC(500, 50, 50, 50, "rgb(255,0,0)", 0, 5, "./Assets/Sprites/jeremy.jpg","./Assets/Sounds/Jeremy.m4a");
levels[1].badies[6] = new NPC(550, 50, 50, 50, "rgb(255,0,0)", 0, 8,"./Assets/Sprites/jeremy.jpg","./Assets/Sounds/Jeremy.m4a");
levels[1].badies[7] = new NPC(600, 50, 50, 50, "rgb(255,0,0)", 0, 7, "./Assets/Sprites/jeremy.jpg","./Assets/Sounds/Jeremy.m4a");

//----------Draw Function----------
var draw = function () {
    //clears the canvas
    ctx.clearRect(0, 0, screenWidth, screenHeight);

    //draw the background
    ctx.drawImage(levels[currentLevel].background, 0, 0);

    //draw our player character
    ctx.drawImage(levels[currentLevel].player.sprite, levels[currentLevel].player.x, levels[currentLevel].player.y);

    //draw our goal
    ctx.drawImage(levels[currentLevel].goal.sprite, levels[currentLevel].goal.x, levels[currentLevel].goal.y);

    //draw all the eneimes
    for (badies of levels[currentLevel].badies) {
        ctx.drawImage(badies.sprite, badies.x, badies.y)
    }
}

//update the position of on screen elements
var update = function () {
    //walking sound update
    if (walkingSoundPlaying == false && (abs(levels[currentLevel].player.ySpeed) > 0 || abs(levels[currentLevel].player.xSpeed) > 0)) {
        levels[currentLevel].player.soundWalking.play();
        walkingSoundPlaying = true;
    }
    if (walkingSoundPlaying == true && (abs(levels[currentLevel].player.ySpeed) < 1 && abs(levels[currentLevel].player.xSpeed) < 1)) {
        levels[currentLevel].player.soundWalking.stop();
        walkingSoundPlaying = false;
    }

    for (badies of levels[currentLevel].badies) {
        //update all badies positions
        badies.moveVer();
        badies.moveHor();
    }

    //check player bounds
    if (levels[currentLevel].player.y > screenHeight - 50 && levels[currentLevel].player.ySpeed > 0) { levels[currentLevel].player.ySpeed = 0; }
    if (levels[currentLevel].player.y < 0 && levels[currentLevel].player.ySpeed < 0) { levels[currentLevel].player.ySpeed = 0; }
    if (levels[currentLevel].player.x > screenWidth - 50 && levels[currentLevel].player.xSpeed > 0) { levels[currentLevel].player.xSpeed = 0; }
    if (levels[currentLevel].player.x < 0 && levels[currentLevel].player.xSpeed < 0) { levels[currentLevel].player.xSpeed = 0; }

    //player's ySpeed and xSpeed are zero if a arrow key is not pressed
    levels[currentLevel].player.moveHor();
    levels[currentLevel].player.moveVer();

    //collisions
    //check collison with goal
    if (Math.abs(levels[currentLevel].player.x - levels[currentLevel].goal.x) <= Math.max(levels[currentLevel].player.width, levels[currentLevel].goal.width) &&
        Math.abs(levels[currentLevel].player.y - levels[currentLevel].goal.y) <= Math.max(levels[currentLevel].player.height, levels[currentLevel].goal.height)) {
        sounds.eat.play();
        alert("Badass brother you got the food");
        currentLevel++;
        levels[currentLevel].player.xSpeed = levels[currentLevel].player.ySpeed = 0;
    }
    //check collison with eneimes
    for (let i = 0; i < levels[currentLevel].badies.length; i++) {
        if (Math.abs(levels[currentLevel].player.x - levels[currentLevel].badies[i].x) <= Math.max(levels[currentLevel].player.width, levels[currentLevel].badies[i].width) &&
            Math.abs(levels[currentLevel].player.y - levels[currentLevel].badies[i].y) <= Math.max(levels[currentLevel].player.height, levels[currentLevel].badies[i].height)) {
            gameOver = true;
            levels[currentLevel].badies[0].killSound.play()
            alert("Game over you lose, You got caught trying to steel the food");
        }
    }
    //will recode once everything else is working
    // if (gameOver == true){
    //     window.location = "";
    //     gameOver = false;
    // }
}

var step = function () {
    update();
    draw();
}
loadSounds();
window.setInterval(() => {
    if (!gameOver) {
        step();
    }else{
        sounds.walk.stop();
    }
}, 16.66);