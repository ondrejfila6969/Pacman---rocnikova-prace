import { oneBlockHeight, oneBlockWidth } from "../../script.js";
export class GhostTemplate {
    posX;
    posY;
    size;
    image;
    imagePaths;
    imageIndex;
    imageLoaded = null; // to tady bohužel musí být, protože se metoda pro vykreslování ghosta provádí dřív, než se obrázek načte
    distance; // vzdálenost, o kterou se duch pohybuje
    currentDirection;
    mode; // budou 2 mody duchů - chase nebo frightened
    constructor(posX, posY, imageIndex) {
        this.posX = posX;
        this.posY = posY;
        this.imageIndex = imageIndex;
        this.size = {
            width: oneBlockWidth,
            height: oneBlockHeight,
        };
        this.image = new Image();
        this.imagePaths = [
            // cesty k obrázkům jsou uloženy zde
            "../../res/assets/ghosts/blinky.png",
            "../../res/assets/ghosts/clyde.png",
            "../../res/assets/ghosts/inky.png",
            "../../res/assets/ghosts/pinky.png",
            "../../res/assets/ghosts/vulnerable.png"
        ];
        this.image.src = this.imagePaths[this.imageIndex];
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        this.currentDirection = "right";
        this.distance = 1.7;
        this.mode = "chase"; // defaultně bude pronásledovat pacmana, nebo se náhodně pohybovat na mapě
    }
}
