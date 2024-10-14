const canvas: HTMLCanvasElement = document.createElement("canvas");
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

/**
 * Přidá canvas do HTML
 */
document.body.appendChild(canvas);

const canvasWidth: number = 500;
const canvasHeight: number = 500;

/**
 * Nastavení rozměrů
 */
const resizeCanvas = (): void => {
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
};

const numberOfRows: number = 23;
const numberOfColumns: number = 21;

resizeCanvas();
/*
console.log(canvas.width);
console.log(canvas.height); 
*/

/**
 * Výpočet rozměrů "jednoho bloku", protože mapa je uložená v poli, tak jedno číslo bude symbolizovat čtverec/obdélník
 * Rozměry nejsou stejné, protože máme více sloupců než řádků
 * Samozřejmě se výsledek musí zaokrouhlit pomocí fce Math.floor()
 */

const oneBlockWidth: number = Math.floor(canvas.width / numberOfColumns);
const oneBlockHeight: number = Math.floor(canvas.height / numberOfRows);

console.log("Výška: " + oneBlockHeight);
console.log("Šířka: " + oneBlockWidth);

let currentMap: number[][];

/**
 * Načte data z JSON souboru a uloží je do currentMapy
 */
const loadData = async (): Promise<void> => {
  const file: Response = await fetch("../res/data/data.json");
  const data = await file.json();
  currentMap = data[0].map; // Zatím pouze 1. mapu
};

loadData();

window.addEventListener("load", () => {
    console.log(currentMap);
  const createBorder = (
    posX: number,
    posY: number,
    oneBlockWidth: number,
    oneBlockHeight: number,
    oneBlockColor: string
  ) => {
    ctx.fillStyle = oneBlockColor;
    ctx.fillRect(posX, posY, oneBlockWidth, oneBlockHeight);
  };
  for (let i = 0; i < currentMap.length; i++) {
    for (let j = 0; j < currentMap[i].length; j++) {
      if (currentMap[i][j] == 1) {
        createBorder(
          j * oneBlockWidth, // X pozice
          i * oneBlockHeight, // Y pozice
          oneBlockWidth, // Šířka bloku
          oneBlockHeight, // Výška bloku
          "#0000FF" // Barva bloku
        );
      }
    }
  }
});
