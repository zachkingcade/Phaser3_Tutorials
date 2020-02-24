class NPC extends Gamecharacter {
    constructor(x, y, width, height, color, xSpeed, ySpeed, sprite = "",killSound) {
        super(x, y, width, height, color, xSpeed, ySpeed, sprite);
        this.killSound = new sound(killSound);
    }
    moveHor() {
        //checks bounds of npc's x
        if (this.x > screenHeight - 65 || this.x < 15) {
            this.xSpeed *= -1;
        }
        this.x += this.xSpeed;
    }

    moveVer() {
        //checks bounds of npc's x
        if (this.y > screenHeight - 65 || this.y < 15) {
            this.ySpeed *= -1;
        }
        this.y += this.ySpeed;
    }
}