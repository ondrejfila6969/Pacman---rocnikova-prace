import { PacmanTemplate } from "./pacmanTemplate/pacmanTemplate.js";
import { oneBlockHeight, oneBlockWidth, currentMap, } from "../gameSettings/map/map.js";
import { ctx } from "../gameSettings/canvas/canvas.js";
import { pacmanScore, pacmanLives, pacmanCurrentLevel, } from "../gameSettings/pacmanSettings/pacmanSettings.js";
import { inky, blinky, pinky, clyde, } from "../gameSettings/ghostSettings/ghostSettings.js";
class Pacman extends PacmanTemplate {
    constructor(posX, posY) {
        super(posX, posY);
    }
    drawPacman() {
        function createPacman(color, posX, posY, width, height, rotation, startAngle, endAngle, counterclockwise) {
            /**
             * posX, posY - souřadnice
             * width, height - šířka, výška
             * rotation - úhel rotace elipsy (v radiánech)
             * startAngle, endAngle - počáteční a koncový úhel (v radiánech)
             * counterclockwise - určuje směr kreslení proti směru hodinových ručiček, pokud je true (ve funkci je tento parametr volitelný - ?)
             */
            if (ctx !== null) {
                ctx.fillStyle = color; // nastavení barvy
                ctx.beginPath(); // začne novou cestu
                ctx.ellipse(posX, posY, width, height, rotation, startAngle, endAngle, counterclockwise);
                ctx.lineTo(posX, posY); // spojí poslední bod cesty se středem elipsy
                ctx.fill(); // vyplní elipsu barvou
                ctx.closePath(); // ukončí současnou cestu
            }
        }
        if (this.currentDirection === "left" || this.currentDirection === "right") {
            /* Tělo */
            createPacman("yellow", this.posX, this.posY, this.size.width / 2 - 0.6, this.size.height / 2 - 0.6, this.currentDirection === "right" ? 0 : Math.PI, // Zkrácení zápisu, ternárním operátorem nemusím vytvářet 4 podmínky, ale stačí 2 a jestli se pacman dívá doleva nebo doprava, to řeší rotace
            Math.PI / 5, (9 * Math.PI) / 5);
            /* Pusa */
            createPacman("black", this.posX, this.posY, this.size.width / 2, this.size.height / 2, this.currentDirection === "right" ? 0 : Math.PI, Math.PI / 5, (9 * Math.PI) / 5, true);
        }
        if (this.currentDirection === "up" || this.currentDirection === "down") {
            /* Tělo */
            createPacman("yellow", this.posX, this.posY, this.size.width / 2 - 0.6, this.size.height / 2 - 0.6, this.currentDirection === "down" ? 0 : Math.PI, (3 * Math.PI) / 10, (7 * Math.PI) / 10, true);
            /* Pusa */
            createPacman("black", this.posX, this.posY, this.size.width / 2, this.size.height / 2, this.currentDirection === "down" ? 0 : Math.PI, (3 * Math.PI) / 10, (7 * Math.PI) / 10);
        }
    }
    movement() {
        this.tryNewDirection();
        this.movePacman();
        if (this.wallCollision()) {
            this.stopPacman();
            this.desiredDirection = null;
        }
    }
    movePacman() {
        switch (this.currentDirection) {
            case "up":
                this.posY -= this.distance;
                break;
            case "left":
                this.posX -= this.distance;
                break;
            case "down":
                this.posY += this.distance;
                break;
            case "right":
                this.posX += this.distance;
                break;
        }
    }
    stopPacman() {
        switch (this.currentDirection) {
            case "up":
                this.posY += this.distance;
                break;
            case "left":
                this.posX += this.distance;
                break;
            case "down":
                this.posY -= this.distance;
                break;
            case "right":
                this.posX -= this.distance;
                break;
        }
    }
    resetPositions() {
        this.currentDirection = "right";
        this.posX = 1.5 * oneBlockWidth;
        this.posY = 1.5 * oneBlockHeight;
    }
    setDesiredDirection(direction) {
        this.desiredDirection = direction;
    }
    levelUp() {
        this.startMovement = false;
        this.currentLevel++;
        if (pacmanCurrentLevel)
            pacmanCurrentLevel.innerText = `Current level: ${pacman.currentLevel}`;
        return true;
    }
    /**
     * SPRÁVA ŽIVOTŮ
     */
    loseLife() {
        this.lives--;
        // console.log(this.lives);
        if (pacmanLives)
            pacmanLives.innerText = `Lives: ${this.lives}`;
    }
    /**
     * Problém s pohybem Pacmana byl ten, že když stiknete klávesu, tak se v mnoha případech stane, že změní směr ihned
     * Což ovšem většinou vede ke kolizi se zdí, tuto problematiku řeší metoda tryNewDirection()
     */
    tryNewDirection() {
        if (this.desiredDirection) {
            const previousDirection = this.currentDirection;
            this.currentDirection = this.desiredDirection;
            this.movePacman();
            if (this.wallCollision()) {
                this.stopPacman();
                this.currentDirection = previousDirection;
            }
            else {
                this.desiredDirection = null;
            }
        }
    }
    wallCollision() {
        this.teleportPacman();
        return (currentMap[Math.floor(this.getTopLeftPoint().posY / oneBlockHeight)][Math.floor(this.getTopLeftPoint().posX / oneBlockWidth)] == 1 ||
            currentMap[Math.floor(this.getTopRightPoint().posY / oneBlockHeight)][Math.floor(this.getTopRightPoint().posX / oneBlockWidth)] == 1 ||
            currentMap[Math.floor(this.getBottomLeftPoint().posY / oneBlockHeight)][Math.floor(this.getBottomLeftPoint().posX / oneBlockWidth)] == 1 ||
            currentMap[Math.floor(this.getBottomRightPoint().posY / oneBlockHeight)][Math.floor(this.getBottomRightPoint().posX / oneBlockWidth)] == 1 ||
            Math.floor(this.getTopLeftPoint().posX / oneBlockWidth) < 0 ||
            Math.floor(this.getTopRightPoint().posX / oneBlockWidth) >= 21);
    }
    teleportPacman() {
        if (Math.floor(this.getTopLeftPoint().posX / oneBlockWidth) < 0 && this.currentDirection === "left") {
            this.posX = 20 * oneBlockWidth;
            this.drawPacman();
        }
        if (Math.floor(this.getTopRightPoint().posX / oneBlockWidth) >= 21 && this.currentDirection === "right") {
            this.posX = 1 * oneBlockWidth;
            this.drawPacman();
        }
    }
    eatFood() {
        let foodEaten = false;
        if (this.currentDirection === "right") {
            if (currentMap[Math.floor(this.eatRightDirection().posY / oneBlockHeight)][Math.floor(this.eatRightDirection().posX / oneBlockWidth)] === 2) {
                currentMap[Math.floor(this.eatRightDirection().posY / oneBlockHeight)][Math.floor(this.eatRightDirection().posX / oneBlockWidth)] = 0;
                foodEaten = true;
            }
        }
        if (this.currentDirection === "left") {
            if (currentMap[Math.floor(this.eatLeftDirection().posY / oneBlockHeight)][Math.floor(this.eatLeftDirection().posX / oneBlockWidth)] === 2) {
                currentMap[Math.floor(this.eatLeftDirection().posY / oneBlockHeight)][Math.floor(this.eatLeftDirection().posX / oneBlockWidth)] = 0;
                foodEaten = true;
            }
        }
        if (this.currentDirection === "up") {
            if (currentMap[Math.floor(this.eatTopDirection().posY / oneBlockHeight)][Math.floor(this.eatTopDirection().posX / oneBlockWidth)] === 2) {
                currentMap[Math.floor(this.eatTopDirection().posY / oneBlockHeight)][Math.floor(this.eatTopDirection().posX / oneBlockWidth)] = 0;
                foodEaten = true;
            }
        }
        if (this.currentDirection === "down") {
            if (currentMap[Math.floor(this.eatBottomDirection().posY / oneBlockHeight)][Math.floor(this.eatBottomDirection().posX / oneBlockWidth)] === 2) {
                currentMap[Math.floor(this.eatBottomDirection().posY / oneBlockHeight)][Math.floor(this.eatBottomDirection().posX / oneBlockWidth)] = 0;
                foodEaten = true;
            }
        }
        if (foodEaten) {
            this.score++;
            if (pacmanScore !== null)
                pacmanScore.innerText = `Score: ${this.score}`;
        }
    }
    switchGhostsIntoFrightenedMode() {
        const changeGhosts = () => {
            [blinky, pinky, inky, clyde].forEach((ghost) => {
                ghost.setFrightenedMode();
            });
        };
        let abilityEaten = false;
        if (this.currentDirection === "right" &&
            currentMap[Math.floor(this.eatRightDirection().posY / oneBlockHeight)][Math.floor(this.eatRightDirection().posX / oneBlockWidth)] === 4) {
            currentMap[Math.floor(this.eatRightDirection().posY / oneBlockHeight)][Math.floor(this.eatRightDirection().posX / oneBlockWidth)] = 5;
            abilityEaten = true;
            changeGhosts();
        }
        if (this.currentDirection === "left" &&
            currentMap[Math.floor(this.eatLeftDirection().posY / oneBlockHeight)][Math.floor(this.eatLeftDirection().posX / oneBlockWidth)] === 4) {
            currentMap[Math.floor(this.eatLeftDirection().posY / oneBlockHeight)][Math.floor(this.eatLeftDirection().posX / oneBlockWidth)] = 5;
            abilityEaten = true;
            changeGhosts();
        }
        if (this.currentDirection === "up" &&
            currentMap[Math.floor(this.eatTopDirection().posY / oneBlockHeight)][Math.floor(this.eatTopDirection().posX / oneBlockWidth)] === 4) {
            currentMap[Math.floor(this.eatTopDirection().posY / oneBlockHeight)][Math.floor(this.eatTopDirection().posX / oneBlockWidth)] = 5;
            abilityEaten = true;
            changeGhosts();
        }
        if (this.currentDirection === "down" &&
            currentMap[Math.floor(this.eatBottomDirection().posY / oneBlockHeight)][Math.floor(this.eatBottomDirection().posX / oneBlockWidth)] === 4) {
            currentMap[Math.floor(this.eatBottomDirection().posY / oneBlockHeight)][Math.floor(this.eatBottomDirection().posX / oneBlockWidth)] = 5;
            abilityEaten = true;
            changeGhosts();
        }
        if (abilityEaten) {
            this.score += 50; // Test
            if (pacmanScore)
                pacmanScore.innerText = `Score: ${this.score}`;
        }
    }
    /**
     * Tyto 4 metody slouží pro získání souřadnic jednotlivých rohů
     * Podle těchto rohů se budou kontrolovat kolize
     * Readonly modifier slouží k tomu, že tyto souřadnice jsou třeba pouze pro "čtení", nikoliv pro změnu
     * Číslo 1 slouží jako offset
     */
    getTopLeftPoint() {
        return {
            posX: this.posX - this.size.width / 2 + 1,
            posY: this.posY - this.size.height / 2 + 1,
        };
    }
    getTopRightPoint() {
        return {
            posX: this.posX + this.size.width / 2 - 1,
            posY: this.posY - this.size.height / 2 + 1,
        };
    }
    getBottomLeftPoint() {
        return {
            posX: this.posX - this.size.width / 2 + 1,
            posY: this.posY + this.size.height / 2 - 1,
        };
    }
    getBottomRightPoint() {
        return {
            posX: this.posX + this.size.width / 2 - 1,
            posY: this.posY + this.size.height / 2 - 1,
        };
    }
    /**
     * Tyto 4 metody slouží pro získání souřadnic bodů, pomocí kterých pacman sbírá skore
     * Číslo 15 je offset, readonly je tam ze stejného důvodu jako u rohů
     */
    eatRightDirection() {
        return {
            posX: this.posX + this.size.width / 2 - 15,
            posY: this.posY,
        };
    }
    eatLeftDirection() {
        return {
            posX: this.posX - this.size.width / 2 + 15,
            posY: this.posY,
        };
    }
    eatTopDirection() {
        return {
            posX: this.posX,
            posY: this.posY - this.size.height / 2 + 15,
        };
    }
    eatBottomDirection() {
        return {
            posX: this.posX,
            posY: this.posY + this.size.height / 2 - 15,
        };
    }
    getPacmanPositions() {
        return {
            posX: this.posX,
            posY: this.posY
        };
    }
}
export let pacman;
// Uncaught ReferenceError: Cannot access 'oneBlockWidth' before initialization (musí se stránka nejdříve načíst a potom mohu inicializovat pacmana, je to debilní řešení, ale stackoverflow poradilo ...)
window.addEventListener("load", () => {
    pacman = new Pacman(1.5 * oneBlockWidth, 1.5 * oneBlockHeight);
});
