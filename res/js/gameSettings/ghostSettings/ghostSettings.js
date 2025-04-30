import { Ghost } from "../../ghost/ghost.js";
import { pacman } from "../../pacman/pacman.js";
import { oneBlockWidth, oneBlockHeight } from "../map/map.js";
let pinky, clyde, blinky, inky;
const loadGhostPositions = async () => {
    const file = await fetch("../res/data/ghostPositions.json");
    const data = await file.json();
    blinky = new Ghost(Number(data[pacman.currentLevel - 1].blinky.posX * oneBlockWidth), Number(data[pacman.currentLevel - 1].blinky.posY * oneBlockHeight), 0);
    pinky = new Ghost(Number(data[pacman.currentLevel - 1].pinky.posX * oneBlockWidth), Number(data[pacman.currentLevel - 1].pinky.posY * oneBlockHeight), 3);
    inky = new Ghost(Number(data[pacman.currentLevel - 1].inky.posX * oneBlockWidth), Number(data[pacman.currentLevel - 1].inky.posY * oneBlockHeight), 2);
    clyde = new Ghost(Number(data[pacman.currentLevel - 1].clyde.posX * oneBlockWidth), Number(data[pacman.currentLevel - 1].clyde.posY * oneBlockHeight), 1);
};
const ghostUtills = () => {
    [blinky, pinky, inky, clyde].forEach((ghost) => {
        if (ghost.mode === "chase") {
            ghost.setChaseMode();
        }
        else if (ghost.mode === "frightened") {
            ghost.setFrightenedMode();
        }
        ghost.drawGhost();
        ghost.ghostMovement();
        ghost.isPacmanCatched();
        ghost.switchImageByDirection();
    });
};
const initializeGhosts = () => {
    [blinky, pinky, inky, clyde].forEach((ghost) => {
        ghost.initializeMovement();
    });
};
export { ghostUtills, initializeGhosts, blinky, pinky, inky, clyde, loadGhostPositions };
