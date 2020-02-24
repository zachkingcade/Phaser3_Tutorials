class Gamecharacter {
    constructor(x, y, width, height, color, xSpeed, ySpeed, sprite = "") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.sprite = new Image();
        this.soundWalking = new sound("");

        this.sprite.src = sprite;
    }

    moveHor() {
        this.x += this.xSpeed;
    }

    moveVer() {
        this.y += this.ySpeed;
    }
}