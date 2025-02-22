import { pacman } from "./pacman/pacman.js";
import { pinky, inky, blinky, clyde } from "./ghost/ghost.js";
const canvas: HTMLCanvasElement = document.createElement("canvas");
export const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
export const pacmanScore: HTMLElement | null =
  document.getElementById("pacmanScore");

/**
 * Přidá canvas do HTML
 */
document.body.appendChild(canvas);

const canvasWidth: number = 504;
const canvasHeight: number = 552;

const numberOfRows: number = 23;
const numberOfColumns: number = 21;

const FPS = 60;

/**
 * Nastavení rozměrů
 */
const resizeCanvas = (): void => {
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
};

export const oneBlockWidth: number = canvasWidth / numberOfColumns;
export const oneBlockHeight: number = canvasHeight / numberOfRows;

console.log(oneBlockWidth);
console.log(oneBlockHeight);

/**
 * Mapa je uložena v 2D poli, její obsah se nahrává přes JSON soubor
 * Do proměnné currentMap jsem musel uložit prázdná pole, aby to inicializovalo délku 1. a 2. dimenze - jinak to v konzoli vypisovalo chybu
 */
export var currentMap: number[][] = [
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
];

/**
 * Načte data z JSON souboru a uloží je do currentMapy
 */
const loadData = async (): Promise<void> => {
  const file: Response = await fetch("../res/data/data.json");
  const data = await file.json();
  currentMap = data[0].map; // Zatím pouze 1. mapu
};

window.addEventListener("load", () => {
  loadData();

  /**
   * Funkce pro vykreslení jednoho "bloku" mapy, poté funkce renderMap projede celým cyklem mapu a kde se nachází číslo 1 se provede tato funkce
   */
  const createMap = (
    posX: number,
    posY: number,
    oneBlockWidth: number,
    oneBlockHeight: number,
    oneBlockColor: string
  ): void => {
    // ctx is possibly null - k tomu slouží tahle podmínka nejen tady, ale i v createFood
    if (ctx !== null) {
      ctx.fillStyle = oneBlockColor;
      ctx.fillRect(posX, posY, oneBlockWidth, oneBlockHeight);
    }
  };

  /**
   * Funkce pro vykreslení jednoho "jídla" xd, poté funkce renderFood projede celým cyklem mapu a kde se nachází číslo 2 se provede tato funkce
   * Vzhledem k tomu, že mapa není dokonalý čtverec, tak ani jídlo nebude vykreslené jako dokonalý kruh, využiju elipsu
   * Argumenty v ctx.ellipse(): souřadniceX, souřadniceY, průijeme eliměrSouřadniceX, průměrSouřadniceY, rotace, počáteční úhel, koncový úhel
   * Rotace - o jaký úhel elipsu natočím, v tomto případě to nepotřebuji vůbec, takže 0
   * Úhly jsou zapsané v radiánech (2 * Math.PI = 360 stupňů) :) Meths
   */
  const createFood = (
    posX: number,
    posY: number,
    foodRadiusX: number,
    foodRadiusY: number,
    foodColor: string
  ) => {
    if (ctx !== null) {
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
        if (currentMap[i][j] === 1) {
          createMap(
            j * oneBlockWidth, // X pozice
            i * oneBlockHeight, // Y pozice
            oneBlockWidth, // Šířka bloku
            oneBlockHeight, // Výška bloku
            "#0000FF" // Barva bloku
          );
        }
      }
    }
  };

  const renderFood = (): void => {
    for (let i = 0; i < currentMap.length; i++) {
      for (let j = 0; j < currentMap[i].length; j++) {
        if (currentMap[i][j] === 2) {
          createFood(
            j * oneBlockWidth,
            i * oneBlockHeight,
            oneBlockWidth / 10,
            oneBlockHeight / 10,
            "#FFFFFF"
          );
        }
      }
    }
  };

  /* Všechny procesy, co se týkají pacmana */
  const pacmanTools = (): void => {
    pacman.drawPacman();
    // pacman.drawEdgePoints();
    pacman.movement();
    pacman.eatFood();
  };

const ghostTools = (): void => {
  [pinky, inky, blinky, clyde].forEach((ghost) => {
    ghost.drawGhost();
    // ghost.drawEdgePoints();
    ghost.ghostMovement();
  })
}

  const clearCanvas = (): void => {
    if (ctx !== null) return ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  };

  const render = (): void => {
    renderMap();
    renderFood();
  }

  /**
   * Herní smyčka
   * setInterval(() => {}, čas)
   * Jako čas tam mám 1000 / FPS nastavených na 60. Jinými slovy, ten interval se provádí každých 16,67 milisekund => 60 krát za sekundu :)
   */
  const gameLoop = () => {
    setInterval(() => {
      resizeCanvas();
      clearCanvas();
      pacmanTools();
      render();
      ghostTools();
    }, 1000 / FPS);
  };

  // window.requestAnimationFrame() = vyžádá první snímek animace => herní smyčku
  window.requestAnimationFrame(gameLoop);

  document.addEventListener("keydown", (e) => {
    let key: number = e.keyCode;

    // W nebo šipka nahorů
    if (key === 87 || key === 38) {
      pacman.setDesiredDirection("up");
    }

    // A nebo šipka doleva
    if (key === 65 || key === 37) {
      pacman.setDesiredDirection("left");
    }

    // S nebo šipka dolů
    if (key === 83 || key === 40) {
      pacman.setDesiredDirection("down");
    }

    // D nebo šipka doprava
    if (key === 68 || key === 39) {
      pacman.setDesiredDirection("right");
    }
  });
});
