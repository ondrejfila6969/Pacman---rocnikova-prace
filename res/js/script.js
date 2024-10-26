const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
/**
 * Přidá canvas do HTML
 */
document.body.appendChild(canvas);
const canvasWidth = 500;
const canvasHeight = 500;
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
/**
 * Výpočet rozměrů "jednoho bloku", protože mapa je uložená v poli, tak jedno číslo bude symbolizovat čtverec/obdélník
 * Rozměry nejsou stejné, protože máme více sloupců než řádků
 * Samozřejmě se výsledek musí zaokrouhlit pomocí fce Math.floor(), protože bez zaokrouhlení tam je asi 20 desetinných míst
 */
const oneBlockWidth = Math.floor(canvasWidth / numberOfColumns);
const oneBlockHeight = Math.floor(canvasHeight / numberOfRows);
/**
 * Mapa je uložena v 2D poli, její obsah se nahrává přes JSON soubor
 * Do proměnné currentMap jsem musel uložit prázdná pole, aby to inicializovalo délku 1. a 2. dimenze - jinak to v konzoli vypisovalo chybu
 */
var currentMap = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
/**
 * Načte data z JSON souboru a uloží je do currentMapy
 */
const loadData = async () => {
    const file = await fetch("../res/data/data.json");
    const data = await file.json();
    currentMap = data[0].map; // Zatím pouze 1. mapu
};
/**
 * Funkce pro vykreslení jednoho "bloku" mapy, poté funkce renderMap projede celým cyklem mapu a kde se nachází číslo 1 se provede tato funkce
 */
const createMap = (posX, posY, oneBlockWidth, oneBlockHeight, oneBlockColor) => {
    ctx.fillStyle = oneBlockColor;
    ctx.fillRect(posX, posY, oneBlockWidth, oneBlockHeight);
};
/**
 * Funkce pro vykreslení jednoho "jídla" xd, poté funkce renderFood projede celým cyklem mapu a kde se nachází číslo 2 se provede tato funkce
 * Vzhledem k tomu, že mapa není dokonalý čtverec, tak ani jídlo nebude vykreslené jako dokonalý kruh, využpsu
 * Argumenty v ctx.ellipse(): souřadniceX, souřadniceY, průijeme eliměrSouřadniceX, průměrSouřadniceY, rotace, počáteční úhel, koncový úhel
 * Rotace - o jaký úhel elipsu natočím, v tomto případě to nepotřebuji vůbec, takže 0
 * Úhly jsou zapsané v radiánech (2 * Math.PI = 360 stupňů) :) Meths
 */
const createFood = (posX, posY, foodRadiusX, foodRadiusY, foodColor) => {
    ctx.beginPath();
    ctx.ellipse(posX + oneBlockWidth / 2, posY + oneBlockHeight / 2, foodRadiusX, foodRadiusY, 0, 0, 2 * Math.PI);
    ctx.fillStyle = foodColor;
    ctx.fill();
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
const renderFood = () => {
    for (let i = 0; i < currentMap.length; i++) {
        for (let j = 0; j < currentMap[i].length; j++) {
            if (currentMap[i][j] === 2) {
                createFood(j * oneBlockWidth, i * oneBlockHeight, oneBlockWidth / 8, oneBlockHeight / 8, "#FFFFFF");
            }
        }
    }
};
/**
 * Herní smyčka
 * setInterval(() => {}, čas)
 * Jako čas tam mám 1000 / FPS nastavených na 60. Jinými slovy, ten interval se provádí každých 16,67 milisekund => 60 krát za sekundu :)
 */
const gameLoop = () => {
    resizeCanvas();
    setInterval(() => {
        loadData();
        renderMap();
        renderFood();
    }, 1000 / FPS);
};
// window.requestAnimationFrame() = vyžádá první snímek animace => herní smyčku
window.requestAnimationFrame(gameLoop);
