import { oneBlockHeight, oneBlockWidth } from "../../gameSettings/map/map.js";
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
    imageIndexDirection;
    constructor(posX, posY, imageIndex) {
        this.posX = posX;
        this.posY = posY;
        this.imageIndex = imageIndex;
        this.size = {
            width: oneBlockWidth,
            height: oneBlockHeight,
        };
        this.image = new Image();
        this.imageIndexDirection = 0;
        this.imagePaths = [
            [
                "/res/assets/ghosts/blinky/blinkydown.png",
                "/res/assets/ghosts/blinky/blinkyleft.png",
                "/res/assets/ghosts/blinky/blinkyright.png",
                "/res/assets/ghosts/blinky/blinkyup.png",
            ],
            [
                "/res/assets/ghosts/clyde/clydedown.png",
                "/res/assets/ghosts/clyde/clydeleft.png",
                "/res/assets/ghosts/clyde/clyderight.png",
                "/res/assets/ghosts/clyde/clydeup.png",
            ],
            [
                "/res/assets/ghosts/inky/inkydown.png",
                "/res/assets/ghosts/inky/inkyleft.png",
                "/res/assets/ghosts/inky/inkyright.png",
                "/res/assets/ghosts/inky/inkyup.png",
            ],
            [
                "/res/assets/ghosts/pinky/pinkydown.png",
                "/res/assets/ghosts/pinky/pinkyleft.png",
                "/res/assets/ghosts/pinky/pinkyright.png",
                "/res/assets/ghosts/pinky/pinkyup.png",
            ],
            [
                "/res/assets/ghosts/vulnerable.png",
                "/res/assets/abilities/whitevulnerableghost.png"
            ]
        ];
        this.image.src = this.imagePaths[this.imageIndex][this.imageIndexDirection];
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        this.currentDirection = "right";
        this.distance = 1.7;
        this.mode = "chase"; // defaultně bude pronásledovat pacmana, nebo se náhodně pohybovat na mapě
    }
}
