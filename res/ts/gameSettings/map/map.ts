import { canvasHeight, canvasWidth } from "../canvas/canvas.js";
import { pacman } from "../../pacman/pacman.js";

let currentMap: number[][] = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],];
const numberOfRows: number = 23;
const numberOfColumns: number = 21;
const oneBlockWidth: number = Math.floor(canvasWidth / numberOfColumns);
const oneBlockHeight: number = Math.floor(canvasHeight / numberOfRows);

const loadData = async (): Promise<void> => {
  const file: Response = await fetch(`res/data/data.json`);
  const data = await file.json();
  currentMap = data[pacman.currentLevel - 1].currentLevel;
};

const resetMap = () => {
  for(let i = 0; i < currentMap.length; i++) {
    for(let j = 0; j < currentMap[i].length; j++) {
      if(currentMap[i][j] === 0) {
        currentMap[i][j] = 2; // Vrátí jídlo zpět do mapy
      }
      if(currentMap[i][j] === 5) {
        currentMap[i][j] = 4; // Vrátí abilitku zpět do mapy
      }
      if(currentMap[i][j] === 7) {
        currentMap[i][j] = 6; // Vrátí bonusový život zpět do mapy
      }
      if(currentMap[i][j] === 9) {
        currentMap[i][j] = 8; // Vrátí třešeň zpět do mapy
      }
    }
  }
}


export {currentMap, oneBlockHeight, oneBlockWidth, loadData, resetMap};