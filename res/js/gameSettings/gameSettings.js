import { pacman } from "../pacman/pacman.js";
import { blinky, inky, pinky, clyde, loadGhostPositions, ghostUtills, initializeGhosts } from "./ghostSettings/ghostSettings.js";
import { loadData } from "./map/map.js";
import { render } from "./render/render.js";
import { resizeCanvas, clearCanvas } from "./canvas/canvas.js";
import { pacmanCurrentLevel, pacmanLives, pacmanUtills, } from "./pacmanSettings/pacmanSettings.js";
import { loss, win, game } from "../script.js";
const fps = 60;
const gameStarts = async () => {
    await loadData();
    await loadGhostPositions();
    initializeGhosts();
    const gameLoop = () => {
        const interval = setInterval(() => {
            resizeCanvas();
            clearCanvas();
            render();
            pacmanUtills();
            ghostUtills();
            if (pacman.currentLevel === 6) {
                if (pacman.levelUp() && pacman.lives > 0) {
                    clearInterval(interval);
                    if (win && game && pacmanLives && pacmanCurrentLevel) {
                        pacman.currentLevel = 5;
                        pacmanCurrentLevel.innerText = `Current level: ${pacman.currentLevel}`;
                        pacmanLives.innerText = `Lives: ${pacman.lives}`;
                        win.style.display = "flex";
                        win.style.textAlign = "center";
                        win.style.justifyContent = "center";
                        win.style.alignItems = "center";
                    }
                }
            }
            if (pacman.lives <= 0) {
                pacman.lives = 0;
                clearInterval(interval);
                if (loss && game && pacmanLives) {
                    pacmanLives.innerText = `Lives: ${pacman.lives}`;
                    loss.style.display = "none";
                    loss.style.textAlign = "center";
                    loss.style.justifyContent = "center";
                    loss.style.alignItems = "center";
                }
            }
        }, 1000 / fps);
    };
    window.requestAnimationFrame(gameLoop);
    let keyHeld = new Set();
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
const resetPacmanAndGhosts = () => {
    pacman.resetPositions();
    pacman.drawPacman();
    [blinky, pinky, clyde, inky].forEach((ghost) => {
        ghost.resetPositionsAndInitialize();
        ghost.drawGhost();
    });
};
export { gameStarts, resetPacmanAndGhosts };
