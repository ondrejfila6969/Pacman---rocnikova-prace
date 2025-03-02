import { pacman } from "../../pacman/pacman.js";
const pacmanScore = document.getElementById("pacmanScore");
const pacmanCurrentLevel = document.getElementById("pacmanCurrentLevel");
const pacmanLives = document.getElementById("pacmanLives");
const pacmanUtills = () => {
    if (pacman) {
        pacman.drawPacman();
        // pacman.drawEdgePoints();
        if (!pacman.startMovement) {
            setTimeout(() => {
                pacman.startMovement = true;
            }, 2000);
        }
        if (pacman.startMovement) {
            pacman.movement();
            pacman.eatFood();
            pacman.switchGhostsIntoFrightenedMode();
        }
    }
};
const resetPacmanStats = () => {
    pacman.currentLevel = 1;
    pacman.score = 0;
    pacman.lives = 10;
    pacman.startMovement = false;
    if (pacmanCurrentLevel && pacmanScore && pacmanLives) {
        pacmanCurrentLevel.innerText = `Current level: ${pacman.currentLevel}`;
        pacmanScore.innerText = `Score: ${pacman.score}`;
        pacmanLives.innerText = `Lives: ${pacman.lives}`;
    }
};
export { pacmanScore, pacmanCurrentLevel, pacmanLives, pacmanUtills, resetPacmanStats };
