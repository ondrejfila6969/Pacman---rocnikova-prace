const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
/**
 * Přidá canvas do HTML
 */
document.body.appendChild(canvas);
const canvasWidth = 500;
const canvasHeight = 500;
/**
 * Nastavení rozměrů
 */
const resizeCanvas = () => {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
};
const numberOfRows = 23;
const numberOfColumns = 21;
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
const oneBlockWidth = Math.floor(canvas.width / numberOfColumns);
const oneBlockHeight = Math.floor(canvas.height / numberOfRows);
/*
console.log("Výška: " + oneBlockHeight);
console.log("Šířka: " + oneBlockWidth);
*/
var currentMap;
/**
 * Načte data z JSON souboru a uloží je do currentMapy
 */
const loadData = async () => {
    const file = await fetch("../res/data/data.json");
    const data = await file.json();
    currentMap = data[0].map; // Zatím pouze 1. mapu
};
/**
 * Funkce pro vykreslení jednoho "bloku" mapy
*/
const createBorder = (posX, posY, oneBlockWidth, oneBlockHeight, oneBlockColor) => {
    ctx.fillStyle = oneBlockColor;
    ctx.fillRect(posX, posY, oneBlockWidth, oneBlockHeight);
};
const renderMap = () => {
    for (let i = 0; i < currentMap.length; i++) {
        for (let j = 0; j < currentMap[i].length; j++) {
            if (currentMap[i][j] == 1) {
                createBorder(j * oneBlockWidth, // X pozice
                i * oneBlockHeight, // Y pozice
                oneBlockWidth, // Šířka bloku
                oneBlockHeight, // Výška bloku
                "#0000FF" // Barva bloku
                );
            }
        }
    }
};
loadData();
window.onload = () => {
    renderMap();
};
