import { ctx, oneBlockHeight, oneBlockWidth, currentMap } from "../script.js";
class Ghost {
    posX;
    posY;
    size;
    image;
    imagePaths;
    imageIndex;
    imageLoaded = null; // to tady bohužel musí být, protože se metoda pro vykreslování ghosta provádí dřív, než se obrázek načte
    distance; // vzdálenost, o kterou se duch pohybuje
    currentDirection;
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
        this.currentDirection = "right";
        this.distance = 1.7;
    }
    drawGhost() {
        if (this.imageLoaded) {
            if (ctx !== null) {
                ctx.drawImage(this.image, this.posX, this.posY, this.size.width, this.size.height);
            }
        }
    }
    ghostMovement() {
        this.moveGhost();
        if (this.wallCollision()) {
            this.stopGhost();
        }
    }
    moveGhost() {
        switch (this.currentDirection) {
            case "right":
                this.posX += this.distance;
                break;
            case "left":
                this.posX -= this.distance;
                break;
            case "up":
                this.posY -= this.distance;
                break;
            case "down":
                this.posY += this.distance;
                break;
        }
    }
    stopGhost() {
        switch (this.currentDirection) {
            case "right":
                this.posX -= this.distance;
                break;
            case "left":
                this.posX += this.distance;
                break;
            case "up":
                this.posY += this.distance;
                break;
            case "down":
                this.posY -= this.distance;
                break;
        }
    }
    wallCollision() {
        const topLeftPoint = {
            posX: Math.floor(this.ghostGetTopLeftPoint().posX / oneBlockWidth),
            posY: Math.floor(this.ghostGetTopLeftPoint().posY / oneBlockHeight),
        };
        const topRightPoint = {
            posX: Math.floor(this.ghostGetTopRightPoint().posX / oneBlockWidth),
            posY: Math.floor(this.ghostGetTopRightPoint().posY / oneBlockHeight),
        };
        const bottomLeftPoint = {
            posX: Math.floor(this.ghostGetBottomLeftPoint().posX / oneBlockWidth),
            posY: Math.floor(this.ghostGetBottomLeftPoint().posY / oneBlockHeight),
        };
        const bottomRightPoint = {
            posX: Math.floor(this.ghostGetBottomRightPoint().posX / oneBlockWidth),
            posY: Math.floor(this.ghostGetBottomRightPoint().posY / oneBlockHeight),
        };
        return (currentMap[topLeftPoint.posY][topLeftPoint.posX] == 1 ||
            currentMap[topRightPoint.posY][topRightPoint.posX] == 1 ||
            currentMap[bottomLeftPoint.posY][bottomLeftPoint.posX] == 1 ||
            currentMap[bottomRightPoint.posY][bottomRightPoint.posX] == 1 ||
            /**
             * Tyhle poslední 2 řádky platí zatím pouze pro první mapu, map bude nejspíš 5-10, je to kvůli těm východům na obou stranách, zatím nebudu dělat, aby duchové se tímto průchodem mohli dostat na 2. stranu
             */
            Math.floor(this.ghostGetTopLeftPoint().posX / oneBlockWidth) < 0 ||
            Math.floor(this.ghostGetTopRightPoint().posX / oneBlockWidth) >= 21);
    }
    /* Metody pro získání souřadnic rohů */
    /**
     * Číslo 1 představuje menší offset
     */
    ghostGetTopLeftPoint() {
        return {
            posX: this.posX + 1,
            posY: this.posY + 1,
        };
    }
    ghostGetTopRightPoint() {
        return {
            posX: this.posX + oneBlockWidth - 1,
            posY: this.posY + 1,
        };
    }
    ghostGetBottomLeftPoint() {
        return {
            posX: this.posX + 1,
            posY: this.posY + oneBlockHeight - 1,
        };
    }
    ghostGetBottomRightPoint() {
        return {
            posX: this.posX + oneBlockWidth - 1,
            posY: this.posY + oneBlockHeight - 1,
        };
    }
    drawEdgePoints() {
        if (ctx !== null) {
            // Bod vlevo nahoře
            ctx.beginPath();
            ctx.arc(this.posX + 1, this.posY + 1, 3, 0, 2 * Math.PI);
            ctx.fillStyle = "lime";
            ctx.fill();
            ctx.closePath();
            // Bod vpravo nahoře
            ctx.beginPath();
            ctx.arc(this.posX + oneBlockWidth - 1, this.posY + 1, 3, 0, 2 * Math.PI);
            ctx.fillStyle = "lime";
            ctx.fill();
            ctx.closePath();
            // Bod vlevo dole
            ctx.beginPath();
            ctx.arc(this.posX + 1, this.posY + oneBlockHeight - 1, 3, 0, 2 * Math.PI);
            ctx.fillStyle = "lime";
            ctx.fill();
            ctx.closePath();
            // Bod vpravo dole
            ctx.beginPath();
            ctx.arc(this.posX + oneBlockWidth - 1, this.posY + oneBlockHeight - 1, 3, 0, 2 * Math.PI);
            ctx.fillStyle = "lime";
            ctx.fill();
            ctx.closePath();
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
