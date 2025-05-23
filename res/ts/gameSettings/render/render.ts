import { ctx } from "../canvas/canvas.js";
import { resetPacmanAndGhosts } from "../gameSettings.js";
import {
  oneBlockHeight,
  oneBlockWidth,
  currentMap,
  loadData,
} from "../map/map.js";
import { pacman } from "../../pacman/pacman.js";
import { pacmanCurrentLevel } from "../pacmanSettings/pacmanSettings.js";
import { game, win, loss, menu, restartGame } from "../../script.js";
import { audio, playMusic } from "../audio/audio.js";
import { loadGhostPositions } from "../ghostSettings/ghostSettings.js";

const getRandomNumber = (min: number, max: number) =>
  Math.random() * (max - min) + min;

let red: number = getRandomNumber(0, 255);
let green: number = getRandomNumber(0, 255);
let blue: number = getRandomNumber(0, 255);

let r: number = getRandomNumber(0, 255);
let g: number = getRandomNumber(0, 255);
let b: number = getRandomNumber(0, 255);

const oneBlockColor = `rgb(${red}, ${green}, ${blue})`;
const foodColor = `rgb(${r}, ${g}, ${b})`;

const createBorder = (
  posX: number,
  posY: number,
  oneBlockWidth: number,
  oneBlockHeight: number,
  oneBlockColor: string
) => {
  if (ctx) {
    ctx.fillStyle = oneBlockColor;
    ctx.fillRect(posX, posY, oneBlockWidth, oneBlockHeight);
  }
};

const createFood = (
  posX: number,
  posY: number,
  foodRadiusX: number,
  foodRadiusY: number,
  foodColor: string
) => {
  if (ctx) {
    ctx.beginPath();
    ctx.ellipse(
      posX + oneBlockWidth / 2,
      posY + oneBlockHeight / 2,
      foodRadiusX,
      foodRadiusY,
      0,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = foodColor;
    ctx.fill();
  }
};

const renderMap = (): void => {
  for (let i = 0; i < currentMap.length; i++) {
    for (let j = 0; j < currentMap[i].length; j++) {
      if (currentMap[i][j] == 1) {
        createBorder(
          j * oneBlockWidth,
          i * oneBlockHeight,
          oneBlockWidth,
          oneBlockHeight,
          oneBlockColor
        );
      }
    }
  }
};
let levelDone = false;

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

const vulnerableGhostIcon = await loadImage("res/assets/abilities/whitevulnerableghost.png");
const heartIcon = await loadImage("res/assets/abilities/heart.png");
const cherryIcon = await loadImage("res/assets/abilities/cherry.png");

const renderFoodOrSpecialAbility = async () => {
  let foods = 0;
  let specialAbility = 0;
  for (let i = 0; i < currentMap.length; i++) {
    for (let j = 0; j < currentMap[i].length; j++) {
      if (currentMap[i][j] === 2) {
        foods++;
        createFood(
          j * oneBlockWidth,
          i * oneBlockHeight,
          oneBlockWidth / 8,
          oneBlockHeight / 8,
          foodColor
        );
      } else if (currentMap[i][j] === 4) {
        specialAbility++;
        ctx!.drawImage(
          vulnerableGhostIcon,
          j * oneBlockWidth + 4.25,
          i * oneBlockHeight + 4.25,
          oneBlockWidth / 1.5,
          oneBlockHeight / 1.5
        );
      } else if (currentMap[i][j] === 6) {
        specialAbility++;
        ctx!.drawImage(
          heartIcon,
          j * oneBlockWidth + 4.25,
          i * oneBlockHeight + 4.25,
          oneBlockWidth / 1.5,
          oneBlockHeight / 1.5
        );
      } else if (currentMap[i][j] === 8) {
        specialAbility++;
        ctx!.drawImage(
          cherryIcon,
          j * oneBlockWidth + 4.25,
          i * oneBlockHeight + 4.25,
          oneBlockWidth / 1.5,
          oneBlockHeight / 1.5
        );
      }
    }
  }

  const levelUpCheck = async () => {
    if (foods === 0 && specialAbility === 0 && !levelDone) {
      pacman.levelUp();
      levelDone = true;
      await loadData();
      await loadGhostPositions();
      resetPacmanAndGhosts();
      await playMusic();
      pacmanCurrentLevel!.innerText = `Current level: ${pacman.currentLevel}`;
      levelDone = false;
      return;
    }
  };
  await levelUpCheck();
};

const renderMenu = () => {
  game!.style.display = "none";
  win!.style.display = "none";
  loss!.style.display = "none";
  menu!.style.display = "flex";
  audio.pause();
};

const render = (): void => {
  renderMap();
  renderFoodOrSpecialAbility();
};

export { render, renderMenu };
