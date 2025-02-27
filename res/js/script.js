import { pacman } from "./pacman/pacman.js";
import { blinky, pinky, inky, clyde, loadGhostPositions } from "./ghost/ghost.js";
const canvas = document.createElement("canvas");
export const ctx = canvas.getContext("2d");
export const pacmanScore = document.getElementById("pacmanScore");
export const pacmanCurrentLevel = document.getElementById("pacmanCurrentLevel");
export const pacmanLives = document.getElementById("pacmanLives");
/**
 * Přidá canvas do HTML
 */
document.body.appendChild(canvas);
const canvasWidth = 504;
const canvasHeight = 552;
const numberOfRows = 23;
const numberOfColumns = 21;
const FPS = 60;
/**
 * Nastavení rozměrů
 */
const resizeCanvas = () => {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
};
export const oneBlockWidth = canvasWidth / numberOfColumns;
export const oneBlockHeight = canvasHeight / numberOfRows;
console.log(oneBlockWidth);
console.log(oneBlockHeight);
/**
 * Mapa je uložena v 2D poli, její obsah se nahrává přes JSON soubor
 * Do proměnné currentMap jsem musel uložit prázdná pole, aby to inicializovalo délku 1. a 2. dimenze - jinak to v konzoli vypisovalo chybu
 */
export var currentMap = [
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
const loadData = async () => {
    const file = await fetch("../res/data/data.json");
    const data = await file.json();
    currentMap = data[pacman.currentLevel - 1].currentLevel; // Zatím pouze 1. mapu
};
window.addEventListener("load", () => {
    loadData();
    loadGhostPositions();
    /**
     * Funkce pro vykreslení jednoho "bloku" mapy, poté funkce renderMap projede celým cyklem mapu a kde se nachází číslo 1 se provede tato funkce
     */
    const createMap = (posX, posY, oneBlockWidth, oneBlockHeight, oneBlockColor) => {
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
    const createFood = (posX, posY, foodRadiusX, foodRadiusY, foodColor) => {
        if (ctx !== null) {
            ctx.beginPath();
            ctx.ellipse(posX + oneBlockWidth / 2, posY + oneBlockHeight / 2, foodRadiusX, foodRadiusY, 0, 0, 2 * Math.PI);
            ctx.fillStyle = foodColor;
            ctx.fill();
        }
    };
    const renderMap = () => {
        for (let i = 0; i < currentMap.length; i++) {
            for (let j = 0; j < currentMap[i].length; j++) {
                if (currentMap[i][j] === 1) {
                    createMap(j * oneBlockWidth, // X pozice
                    i * oneBlockHeight, // Y pozice
                    oneBlockWidth, // Šířka bloku
                    oneBlockHeight, // Výška bloku
                    "#0000FF" // Barva bloku
                    );
                }
            }
        }
    };
    let vulnerableGhostIcon = new Image();
    const renderFood = () => {
        let foods = 0;
        let specialAbility = 0;
        for (let i = 0; i < currentMap.length; i++) {
            for (let j = 0; j < currentMap[i].length; j++) {
                if (currentMap[i][j] === 2) {
                    foods++;
                    createFood(j * oneBlockWidth, i * oneBlockHeight, oneBlockWidth / 10, oneBlockHeight / 10, "#FFFFFF");
                }
                else if (currentMap[i][j] === 4) {
                    specialAbility++;
                    vulnerableGhostIcon.src = "../../../../res/assets/abilities/whitevulnerableghost.png";
                    if (ctx) {
                        ctx.drawImage(vulnerableGhostIcon, j * oneBlockWidth + 4.25, i * oneBlockHeight + 4.25, oneBlockWidth / 1.5, oneBlockHeight / 1.5);
                    }
                }
            }
        }
    };
    /* Všechny procesy, co se týkají pacmana */
    const pacmanTools = () => {
        if (pacman) {
            pacman.drawPacman();
            // pacman.drawEdgePoints();
            if (!pacman.startMovement) {
                setTimeout(() => {
                    pacman.startMovement = true;
                }, 2000);
            }
            if (pacman.startMovement) {
                pacman.movement();
                pacman.eatFood();
                pacman.switchGhostsIntoFrightenedMode();
            }
        }
    };
    const ghostTools = () => {
        [blinky, pinky, inky, clyde].forEach((ghost) => {
            if (ghost.mode === "chase") {
                ghost.setChaseMode();
            }
            else if (ghost.mode === "frightened") {
                ghost.setFrightenedMode();
            }
            ghost.drawGhost();
            ghost.ghostMovement();
            ghost.isPacmanCatched();
        });
    };
    const clearCanvas = () => {
        if (ctx !== null)
            return ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    };
    const render = () => {
        renderMap();
        renderFood();
    };
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
        let key = e.keyCode;
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
