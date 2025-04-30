import { pacman } from "../pacman/pacman.js";
import {
  blinky,
  inky,
  pinky,
  clyde,
  loadGhostPositions,
} from "./ghostSettings/ghostSettings.js";
import { loadData } from "./map/map.js";
import { render } from "./render/render.js";
import {
  resizeCanvas,
  clearCanvas,
} from "./canvas/canvas.js";
import {
  pacmanCurrentLevel,
  pacmanLives,
  pacmanUtills,
} from "./pacmanSettings/pacmanSettings.js";
import {
  ghostUtills,
  initializeGhosts,
} from "./ghostSettings/ghostSettings.js";
import { loss, win, game, reachedScore1, reachedScore2 } from "../script.js";

const fps: number = 60;

const gameStarts = async (): Promise<void> => {
  await loadData();
  await loadGhostPositions();

  initializeGhosts();

  const gameLoop = (): void => {
    const interval = setInterval(() => {
      resizeCanvas();
      // clearCanvas();
      render();
      pacmanUtills();
      ghostUtills();

      if (pacman.currentLevel === 6) {
        if (pacman.levelUp() && pacman.lives > 0) {
          clearInterval(interval);
          pacman.currentLevel = 5;
          pacmanCurrentLevel!.innerText = `Current level: ${pacman.currentLevel}`;
          pacmanLives!.innerText = `Lives: ${pacman.lives}`;
          win!.style.display = "flex";
          win!.style.textAlign = "center";
          win!.style.justifyContent = "center";
          win!.style.alignItems = "center";
          reachedScore1!.innerText = `Highscore: ${pacman.score}`;
        }
      }
      if (pacman.lives <= 0) {
        pacman.lives = 0;
        clearInterval(interval);
        pacmanLives!.innerText = `Lives: ${pacman.lives}`;
        loss!.style.display = "flex";
        loss!.style.textAlign = "center";
        loss!.style.justifyContent = "center";
        loss!.style.alignItems = "center";
        reachedScore2!.innerText = `Highscore: ${pacman.score}`;
      }
    }, 1000 / fps);
  };

  gameLoop();

  let keyHeld = new Set<number>();

  document.addEventListener("keydown", (e) => {
    let key = e.keyCode;

    if (!keyHeld.has(key)) {
      keyHeld.add(key);

      if (key === 87 || key === 38) {
        pacman.setDesiredDirection("up");
      }

      if (key === 65 || key === 37) {
        pacman.setDesiredDirection("left");
      }

      if (key === 83 || key === 40) {
        pacman.setDesiredDirection("down");
      }

      if (key === 68 || key === 39) {
        pacman.setDesiredDirection("right");
      }
    }
  });

  document.addEventListener("keyup", (e) => {
    keyHeld.delete(e.keyCode);
  });
};

const resetPacmanAndGhosts = (): void => {
  pacman.resetPositions();
  pacman.drawPacman();
  [blinky, pinky, clyde, inky].forEach((ghost) => {
    ghost.resetPositionsAndInitialize();
    ghost.drawGhost();
  });
};

export { gameStarts, resetPacmanAndGhosts };
