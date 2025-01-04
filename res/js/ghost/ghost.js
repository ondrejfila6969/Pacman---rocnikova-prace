import { ctx, oneBlockHeight, oneBlockWidth } from "../script.js";
class Ghost {
    posX;
    posY;
    size;
    image;
    imagePaths;
    imageIndex;
    imageLoaded = null; // to tady bohužel musí být, protože se metoda pro vykreslování ghosta provádí dřív, než se obrázek načte
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
        ];
        this.image.src = this.imagePaths[this.imageIndex];
        this.image.onload = () => {
            this.imageLoaded = true;
        };
    }
    drawGhost() {
        if (this.imageLoaded) {
            if (ctx !== null) {
                ctx.drawImage(this.image, this.posX, this.posY, this.size.width, this.size.height);
            }
        }
    }
}
export let blinky;
export let clyde;
export let inky;
export let pinky;
window.addEventListener("load", () => {
    pinky = new Ghost(9 * oneBlockWidth, 10 * oneBlockHeight, 3);
    clyde = new Ghost(9 * oneBlockWidth, 11 * oneBlockHeight, 1);
    inky = new Ghost(11 * oneBlockWidth, 10 * oneBlockHeight, 2);
    blinky = new Ghost(11 * oneBlockWidth, 11 * oneBlockHeight, 0);
});
