import { oneBlockHeight, oneBlockWidth } from "../../gameSettings/map/map.js";
export class PacmanTemplate {
    posX;
    posY;
    currentLevel;
    currentDirection;
    desiredDirection;
    score;
    distance;
    size;
    lives;
    startMovement;
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
        this.size = {
            width: oneBlockWidth,
            height: oneBlockHeight,
        };
        this.distance = 2;
        this.currentDirection = "right";
        this.desiredDirection = null;
        this.score = 0;
        this.currentLevel = 1;
        this.lives = 10;
        this.startMovement = false;
    }
}
