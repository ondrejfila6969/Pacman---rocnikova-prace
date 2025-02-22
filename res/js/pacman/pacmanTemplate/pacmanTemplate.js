import { oneBlockHeight, oneBlockWidth } from "../../script.js";
export class PacmanTemplate {
    posX;
    posY;
    currentDirection;
    desiredDirection;
    score;
    distance;
    size;
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
    }
}
