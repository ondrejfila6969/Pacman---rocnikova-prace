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
 * Samozřejmě se výsledek musí zaokrouhlit pomocí fce Math.floor(), protože bez zaokrouhlení tam je asi 20 desetinných míst
 */

const oneBlockWidth: number = Math.floor(canvasWidth / numberOfColumns);
const oneBlockHeight: number = Math.floor(canvasHeight / numberOfRows);

/* 
console.log("Výška: " + oneBlockHeight);
console.log("Šířka: " + oneBlockWidth);
*/

var currentMap: number[][];

/**
 * Načte data z JSON souboru a uloží je do currentMapy
 */
const loadData = async (): Promise<void> => {
  const file: Response = await fetch("../res/data/data.json");
  const data = await file.json();
  currentMap = data[0].map; // Zatím pouze 1. mapu
};

/**
 * Funkce pro vykreslení jednoho "bloku" mapy, poté funkce renderMap projede celým cyklem mapu a kde se nachází číslo 1 se provede tato funkce
 */
const createMap = (
  posX: number,
  posY: number,
  oneBlockWidth: number,
  oneBlockHeight: number,
  oneBlockColor: string
) => {
  ctx.fillStyle = oneBlockColor;
  ctx.fillRect(posX, posY, oneBlockWidth, oneBlockHeight);
};

/**
 * Funkce pro vykreslení jednoho "jídla" xd, poté funkce renderFood projede celým cyklem mapu a kde se nachází číslo 2 se provede tato funkce
 * Vzhledem k tomu, že mapa není dokonalý čtverec, tak ani jídlo nebude vykreslené jako dokonalý kruh, využijeme elipsu
 * Argumenty v ctx.ellipse(): souřadniceX, souřadniceY, průměrSouřadniceX, průměrSouřadniceY, rotace, počáteční úhel, koncový úhel
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
          oneBlockWidth / 8,
          oneBlockHeight / 8,
          "#FFFFFF"
        );
      }
    }
  }
};
loadData();

window.onload = () => {
  renderMap();
  renderFood();
};
