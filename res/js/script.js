import { canvas } from "./gameSettings/canvas/canvas.js";
import { gameStarts, resetPacmanAndGhosts, } from "./gameSettings/gameSettings.js";
import { resetPacmanStats } from "./gameSettings/pacmanSettings/pacmanSettings.js";
import { loadData, resetMap } from "./gameSettings/map/map.js";
import { loadGhostPositions } from "./gameSettings/ghostSettings/ghostSettings.js";
import { renderMenu } from "./gameSettings/render/render.js";
const startButton = document.getElementById("start-button");
const exitButton = document.getElementById("exit-button");
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const loss = document.getElementById("loss");
const win = document.getElementById("win");
const playAgainButton = document.getElementById("play-again"); // výhra
const tryAgainButton = document.getElementById("try-again"); // prohra
const winReturnToMenu = document.getElementById("win-return-menu");
const lossReturnToMenu = document.getElementById("loss-return-menu");
const restartGame = async () => {
    if (loss && win) {
        loss.style.display = "none";
        win.style.display = "none";
    }
    await loadData();
    await loadGhostPositions();
    resetMap();
    resetPacmanStats();
    resetPacmanAndGhosts();
    await gameStarts();
};
if (startButton && menu && game) {
    startButton.addEventListener("click", () => {
        menu.style.display = "none";
        game.style.display = "block";
        game.style.textAlign = "center";
        game.style.alignItems = "center";
        game.style.justifyContent = "center";
        document.body.appendChild(canvas);
        restartGame();
    });
}
if (exitButton) {
    exitButton.addEventListener("click", () => {
        window.close();
    });
}
if (tryAgainButton && playAgainButton) {
    tryAgainButton.addEventListener("click", restartGame);
    playAgainButton.addEventListener("click", restartGame);
}
if (winReturnToMenu && lossReturnToMenu) {
    winReturnToMenu.addEventListener("click", renderMenu);
    lossReturnToMenu.addEventListener("click", renderMenu);
}
export { loss, win, game, menu };
