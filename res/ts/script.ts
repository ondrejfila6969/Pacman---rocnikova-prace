import { canvas } from "./gameSettings/canvas/canvas.js";
import {
  gameStarts,
  resetPacmanAndGhosts,
} from "./gameSettings/gameSettings.js";
import { resetPacmanStats } from "./gameSettings/pacmanSettings/pacmanSettings.js";
import { loadData, resetMap } from "./gameSettings/map/map.js";
import { loadGhostPositions } from  "./gameSettings/ghostSettings/ghostSettings.js";
import { renderMenu } from "./gameSettings/render/render.js";

const startButton: HTMLElement | null = document.getElementById("start-button");
const exitButton: HTMLElement | null = document.getElementById("exit-button");
const menu: HTMLElement | null = document.getElementById("menu");
const game: HTMLElement | null = document.getElementById("game");
const loss: HTMLElement | null = document.getElementById("loss");
const win: HTMLElement | null = document.getElementById("win");
const playAgainButton: HTMLElement | null =
  document.getElementById("play-again"); // výhra
const tryAgainButton: HTMLElement | null = document.getElementById("try-again"); // prohra
const winReturnToMenu: HTMLElement | null =
  document.getElementById("win-return-menu");
const lossReturnToMenu: HTMLElement | null =
  document.getElementById("loss-return-menu");

const instructionButton = document.getElementById("intructions");
const instructionDiv = document.getElementById("instructions-div");
const returnToMenuButton = document.getElementById("return-to-menu-button");
const reachedScore1 = document.getElementById("score1");
const reachedScore2 = document.getElementById("score2");

const restartGame = async (): Promise<void> => {
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

if (instructionButton && instructionDiv) {
  instructionButton.addEventListener("click", () => {
    instructionDiv.style.display = "block";
  });
}

if (returnToMenuButton && instructionDiv) {
  returnToMenuButton.addEventListener("click", () => {
    instructionDiv.style.display = "none";
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

export { loss, win, game, menu, reachedScore1, reachedScore2};
