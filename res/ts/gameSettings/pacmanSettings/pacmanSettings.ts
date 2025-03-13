import { pacman } from "../../pacman/pacman.js";

const pacmanScore: HTMLElement | null = document.getElementById("pacmanScore");
const pacmanCurrentLevel: HTMLElement | null = document.getElementById("pacmanCurrentLevel");
const pacmanLives: HTMLElement | null = document.getElementById("pacmanLives");

const pacmanUtills = (): void => {
  if (pacman) {
    pacman.drawPacman();
    // pacman.drawEdgePoints();
    if(!pacman.startMovement) {
      setTimeout(() => {
        pacman.startMovement = true;
      }, 2000);
    }
    if (pacman.startMovement) {
      pacman.movement();
      pacman.eatFood();
      pacman.switchGhostsIntoFrightenedMode();
      pacman.receiveExtraLife();
      pacman.eatCherry();
    }
  }
};

const resetPacmanStats = () => {
  pacman.currentLevel = 1;
  pacman.score = 0;
  pacman.lives = 10;
  pacman.startMovement = false;
  if(pacmanCurrentLevel && pacmanScore && pacmanLives) {
    pacmanCurrentLevel.innerText = `Current level: ${pacman.currentLevel}`;
    pacmanScore.innerText = `Score: ${pacman.score}`;
    pacmanLives.innerText = `Lives: ${pacman.lives}`;
  }
}

export { pacmanScore, pacmanCurrentLevel, pacmanLives, pacmanUtills, resetPacmanStats};