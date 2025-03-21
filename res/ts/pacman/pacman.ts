import { PacmanTemplate } from "./pacmanTemplate/pacmanTemplate.js";
import {
  oneBlockHeight,
  oneBlockWidth,
  currentMap,
} from "../gameSettings/map/map.js";
import { ctx } from "../gameSettings/canvas/canvas.js";
import {
  pacmanScore,
  pacmanLives,
  pacmanCurrentLevel,
} from "../gameSettings/pacmanSettings/pacmanSettings.js";
import {
  inky,
  blinky,
  pinky,
  clyde,
} from "../gameSettings/ghostSettings/ghostSettings.js";

class Pacman extends PacmanTemplate {

  constructor(posX: number, posY: number) {
    super(posX, posY);
  }

  public drawPacman(): void {
    function createPacman(
      color: string,
      posX: number,
      posY: number,
      width: number,
      height: number,
      rotation: number,
      startAngle: number,
      endAngle: number,
      counterclockwise?: boolean
    ) {
      /**
       * posX, posY - souřadnice
       * width, height - šířka, výška
       * rotation - úhel rotace elipsy (v radiánech)
       * startAngle, endAngle - počáteční a koncový úhel (v radiánech)
       * counterclockwise - určuje směr kreslení proti směru hodinových ručiček, pokud je true (ve funkci je tento parametr volitelný - ?)
       * 
       */
      if (ctx !== null) {
        ctx.fillStyle = color; // nastavení barvy
        ctx.beginPath(); // začne novou cestu
        ctx.ellipse(
          posX,
          posY,
          width,
          height,
          rotation,
          startAngle,
          endAngle,
          counterclockwise
        );
        ctx.lineTo(posX, posY); // spojí poslední bod cesty se středem elipsy
        ctx.fill(); // vyplní elipsu barvou
        ctx.closePath(); // ukončí současnou cestu
      }
    }
    const mouthSpeed = 0.003; // jak rychle se pusa pohybuje
    const mouthOpenness = Math.abs(Math.sin(Date.now() * mouthSpeed)); // sinusoida jako funkce dosahuje maximálních hodnot 1 a -1, protože potřebuji pouze kladná čísla, hodnota je pod absolutní hodnotou, a zda je pusa otevřená nebo ne se řeší na základě aktuálního času

    if (this.currentDirection === "left" || this.currentDirection === "right") {
      const maxAngle = Math.PI / 5;
      const currentAngle = maxAngle * (1 - mouthOpenness);

      createPacman(
        "yellow",
        this.posX,
        this.posY,
        this.size.width / 2 - 0.6,
        this.size.height / 2 - 0.6,
        this.currentDirection === "right" ? 0 : Math.PI,
        currentAngle,
        2 * Math.PI - currentAngle
      );

      createPacman(
        "black",
        this.posX,
        this.posY,
        this.size.width / 2,
        this.size.height / 2,
        this.currentDirection === "right" ? 0 : Math.PI,
        currentAngle,
        2 * Math.PI - currentAngle,
        true
      );
    } else if(this.currentDirection === "up" || this.currentDirection === "down") {
      const maxAngle = (3 * Math.PI) / 10;
      const currentAngle = maxAngle * (1 - mouthOpenness);

      createPacman(
        "black",
        this.posX,
        this.posY,
        this.size.width / 2,
        this.size.height / 2,
        this.currentDirection === "down" ? 0 : Math.PI, // jestli míří pacman dolů, rotace bude 0, jinak o 180 stupňů (na druhou stranu)
        Math.PI / 2 - currentAngle,   
        Math.PI / 2 + currentAngle,   
        false 
      );
      createPacman(
        "yellow",
        this.posX,
        this.posY,
        this.size.width / 2 - 0.6,
        this.size.height / 2 - 0.6,
        this.currentDirection === "down" ? 0 : Math.PI,
        Math.PI / 2 - currentAngle,
        Math.PI / 2 + currentAngle, 
        true
      );
    }
  }

  public movement(): void {
    this.tryNewDirection();
    this.movePacman();
    if (this.wallCollision()) {
      this.stopPacman();
      this.desiredDirection = null;
    }
  }

  private movePacman(): void {
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

  private stopPacman(): void {
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

  public resetPositions(): void { // nastaví pacmanovy souřadnice zpět do levého horního rohu a bude mít defaultní směr doprava
    this.currentDirection = "right";
    this.posX = 1.5 * oneBlockWidth;
    this.posY = 1.5 * oneBlockHeight;
  }

  public setDesiredDirection(direction: string): void {
    this.desiredDirection = direction;
  }

  public levelUp(): boolean {
    this.startMovement = false;
    this.currentLevel++;
    pacmanCurrentLevel!.innerText = `Current level: ${pacman.currentLevel}`;
    return true;
  }

  /**
   * SPRÁVA ŽIVOTŮ
   */
  public loseLife(): void {
    this.lives--;
    pacmanLives!.innerText = `Lives: ${this.lives}`;
  }
  /**
   * Problém s pohybem Pacmana byl ten, že když stiknete klávesu, tak se v mnoha případech stane, že změní směr ihned
   * Což ovšem většinou vede ke kolizi se zdí, tuto problematiku řeší metoda tryNewDirection()
   */
  protected tryNewDirection(): void {
    if (this.desiredDirection) {
      const previousDirection = this.currentDirection;
      this.currentDirection = this.desiredDirection;
      this.movePacman();
      if (this.wallCollision()) {
        this.stopPacman();
        this.currentDirection = previousDirection;
      } else {
        this.desiredDirection = null;
      }
    }
  }

  protected wallCollision(): boolean {
    this.teleportPacman();
    return (
      currentMap[Math.floor(this.getTopLeftPoint().posY / oneBlockHeight)][
        Math.floor(this.getTopLeftPoint().posX / oneBlockWidth)
      ] == 1 ||
      currentMap[Math.floor(this.getTopRightPoint().posY / oneBlockHeight)][
        Math.floor(this.getTopRightPoint().posX / oneBlockWidth)
      ] == 1 ||
      currentMap[Math.floor(this.getBottomLeftPoint().posY / oneBlockHeight)][
        Math.floor(this.getBottomLeftPoint().posX / oneBlockWidth)
      ] == 1 ||
      currentMap[Math.floor(this.getBottomRightPoint().posY / oneBlockHeight)][
        Math.floor(this.getBottomRightPoint().posX / oneBlockWidth)
      ] == 1 ||
      Math.floor(this.getTopLeftPoint().posX / oneBlockWidth) < 0 ||
      Math.floor(this.getTopRightPoint().posX / oneBlockWidth) >= 21
    );
    
  }

  private teleportPacman(): void {
    if(
      Math.floor(this.getTopLeftPoint().posX / oneBlockWidth) < 0 && this.currentDirection === "left"
    ) {
      this.posX = 20 * oneBlockWidth;
      this.drawPacman();
    }
    if(
      Math.floor(this.getTopRightPoint().posX / oneBlockWidth) >= 21 && this.currentDirection === "right"
    ) {
      this.posX = 1 * oneBlockWidth;
      this.drawPacman();
    }
  }

  /**
   * SPRÁVÁ JÍDLA + SPECIÁLNÍCH SCHOPNOSTÍ (BONUSOVÝ ŽIVOT, FRIGHTENED MODE DUCHŮ, CHERRY)
   */
  public eatFood(): void {
    let foodEaten: boolean = false;
    if (this.currentDirection === "right") {
      if (
        currentMap[Math.floor(this.eatRightDirection().posY / oneBlockHeight)][
          Math.floor(this.eatRightDirection().posX / oneBlockWidth)
        ] === 2
      ) {
        currentMap[Math.floor(this.eatRightDirection().posY / oneBlockHeight)][
          Math.floor(this.eatRightDirection().posX / oneBlockWidth)
        ] = 0;
        foodEaten = true;
      }
    }
    if (this.currentDirection === "left") {
      if (
        currentMap[Math.floor(this.eatLeftDirection().posY / oneBlockHeight)][
          Math.floor(this.eatLeftDirection().posX / oneBlockWidth)
        ] === 2
      ) {
        currentMap[Math.floor(this.eatLeftDirection().posY / oneBlockHeight)][
          Math.floor(this.eatLeftDirection().posX / oneBlockWidth)
        ] = 0;
        foodEaten = true;
      }
    }
    if (this.currentDirection === "up") {
      if (
        currentMap[Math.floor(this.eatTopDirection().posY / oneBlockHeight)][
          Math.floor(this.eatTopDirection().posX / oneBlockWidth)
        ] === 2
      ) {
        currentMap[Math.floor(this.eatTopDirection().posY / oneBlockHeight)][
          Math.floor(this.eatTopDirection().posX / oneBlockWidth)
        ] = 0;
        foodEaten = true;
      }
    }
    if (this.currentDirection === "down") {
      if (
        currentMap[Math.floor(this.eatBottomDirection().posY / oneBlockHeight)][
          Math.floor(this.eatBottomDirection().posX / oneBlockWidth)
        ] === 2
      ) {
        currentMap[Math.floor(this.eatBottomDirection().posY / oneBlockHeight)][
          Math.floor(this.eatBottomDirection().posX / oneBlockWidth)
        ] = 0;
        foodEaten = true;
      }
    }

    if (foodEaten) {
      this.score++;
      pacmanScore!.innerText = `Score: ${this.score}`;
    }
  }

  public switchGhostsIntoFrightenedMode(): void {
    const changeGhosts = () => {
      [blinky, pinky, inky, clyde].forEach((ghost) => {
        ghost.setFrightenedMode();
      });
    };

    let abilityEaten = false;
    if (
      this.currentDirection === "right" &&
      currentMap[Math.floor(this.eatRightDirection().posY / oneBlockHeight)][
        Math.floor(this.eatRightDirection().posX / oneBlockWidth)
      ] === 4
    ) {
      currentMap[Math.floor(this.eatRightDirection().posY / oneBlockHeight)][
        Math.floor(this.eatRightDirection().posX / oneBlockWidth)
      ] = 5;
      abilityEaten = true;
      changeGhosts();
    }
    if (
      this.currentDirection === "left" &&
      currentMap[Math.floor(this.eatLeftDirection().posY / oneBlockHeight)][
        Math.floor(this.eatLeftDirection().posX / oneBlockWidth)
      ] === 4
    ) {
      currentMap[Math.floor(this.eatLeftDirection().posY / oneBlockHeight)][
        Math.floor(this.eatLeftDirection().posX / oneBlockWidth)
      ] = 5;
      abilityEaten = true;
      changeGhosts();
    }
    if (
      this.currentDirection === "up" &&
      currentMap[Math.floor(this.eatTopDirection().posY / oneBlockHeight)][
        Math.floor(this.eatTopDirection().posX / oneBlockWidth)
      ] === 4
    ) {
      currentMap[Math.floor(this.eatTopDirection().posY / oneBlockHeight)][
        Math.floor(this.eatTopDirection().posX / oneBlockWidth)
      ] = 5;
      abilityEaten = true;
      changeGhosts();
    }
    if (
      this.currentDirection === "down" &&
      currentMap[Math.floor(this.eatBottomDirection().posY / oneBlockHeight)][
        Math.floor(this.eatBottomDirection().posX / oneBlockWidth)
      ] === 4
    ) {
      currentMap[Math.floor(this.eatBottomDirection().posY / oneBlockHeight)][
        Math.floor(this.eatBottomDirection().posX / oneBlockWidth)
      ] = 5;
      abilityEaten = true;
      changeGhosts();
    }
  }

  public receiveExtraLife(): void {
    let abilityEaten = false;
    if (
      this.currentDirection === "right" &&
      currentMap[Math.floor(this.eatRightDirection().posY / oneBlockHeight)][
        Math.floor(this.eatRightDirection().posX / oneBlockWidth)
      ] === 6
    ) {
      currentMap[Math.floor(this.eatRightDirection().posY / oneBlockHeight)][
        Math.floor(this.eatRightDirection().posX / oneBlockWidth)
      ] = 7;
      abilityEaten = true;
    }
    if (
      this.currentDirection === "left" &&
      currentMap[Math.floor(this.eatLeftDirection().posY / oneBlockHeight)][
        Math.floor(this.eatLeftDirection().posX / oneBlockWidth)
      ] === 6
    ) {
      currentMap[Math.floor(this.eatLeftDirection().posY / oneBlockHeight)][
        Math.floor(this.eatLeftDirection().posX / oneBlockWidth)
      ] = 7;
      abilityEaten = true;
    }
    if (
      this.currentDirection === "up" &&
      currentMap[Math.floor(this.eatTopDirection().posY / oneBlockHeight)][
        Math.floor(this.eatTopDirection().posX / oneBlockWidth)
      ] === 6
    ) {
      currentMap[Math.floor(this.eatTopDirection().posY / oneBlockHeight)][
        Math.floor(this.eatTopDirection().posX / oneBlockWidth)
      ] = 7;
      abilityEaten = true;
    }
    if (
      this.currentDirection === "down" &&
      currentMap[Math.floor(this.eatBottomDirection().posY / oneBlockHeight)][
        Math.floor(this.eatBottomDirection().posX / oneBlockWidth)
      ] === 6
    ) {
      currentMap[Math.floor(this.eatBottomDirection().posY / oneBlockHeight)][
        Math.floor(this.eatBottomDirection().posX / oneBlockWidth)
      ] = 7;
      abilityEaten = true;
    }

    if (abilityEaten) {
      pacman.lives++;
      if(pacmanLives) pacmanLives.innerText = `Lives: ${pacman.lives}`;
    }
  }

  public eatCherry(): void {
    let foodEaten: boolean = false;
    if (this.currentDirection === "right") {
      if (
        currentMap[Math.floor(this.eatRightDirection().posY / oneBlockHeight)][
          Math.floor(this.eatRightDirection().posX / oneBlockWidth)
        ] === 8
      ) {
        currentMap[Math.floor(this.eatRightDirection().posY / oneBlockHeight)][
          Math.floor(this.eatRightDirection().posX / oneBlockWidth)
        ] = 9;
        foodEaten = true;
      }
    }
    if (this.currentDirection === "left") {
      if (
        currentMap[Math.floor(this.eatLeftDirection().posY / oneBlockHeight)][
          Math.floor(this.eatLeftDirection().posX / oneBlockWidth)
        ] === 8
      ) {
        currentMap[Math.floor(this.eatLeftDirection().posY / oneBlockHeight)][
          Math.floor(this.eatLeftDirection().posX / oneBlockWidth)
        ] = 9;
        foodEaten = true;
      }
    }
    if (this.currentDirection === "up") {
      if (
        currentMap[Math.floor(this.eatTopDirection().posY / oneBlockHeight)][
          Math.floor(this.eatTopDirection().posX / oneBlockWidth)
        ] === 8
      ) {
        currentMap[Math.floor(this.eatTopDirection().posY / oneBlockHeight)][
          Math.floor(this.eatTopDirection().posX / oneBlockWidth)
        ] = 9;
        foodEaten = true;
      }
    }
    if (this.currentDirection === "down") {
      if (
        currentMap[Math.floor(this.eatBottomDirection().posY / oneBlockHeight)][
          Math.floor(this.eatBottomDirection().posX / oneBlockWidth)
        ] === 8
      ) {
        currentMap[Math.floor(this.eatBottomDirection().posY / oneBlockHeight)][
          Math.floor(this.eatBottomDirection().posX / oneBlockWidth)
        ] = 9;
        foodEaten = true;
      }
    }

    if (foodEaten) {
      this.score += 100;
      pacmanScore!.innerText = `Score: ${this.score}`;
    }
  }

  
  /**
   * SOUŘADNICE BODŮ PRO KOLIZE (1 = OFFSET)
   */
  public getTopLeftPoint(): { readonly posX: number; readonly posY: number } {
    return {
      posX: this.posX - this.size.width / 2 + 1,
      posY: this.posY - this.size.height / 2 + 1,
    };
  }

  public getTopRightPoint(): { readonly posX: number; readonly posY: number } {
    return {
      posX: this.posX + this.size.width / 2 - 1,
      posY: this.posY - this.size.height / 2 + 1,
    };
  }

  public getBottomLeftPoint(): {
    readonly posX: number;
    readonly posY: number;
  } {
    return {
      posX: this.posX - this.size.width / 2 + 1,
      posY: this.posY + this.size.height / 2 - 1,
    };
  }

  public getBottomRightPoint(): {
    readonly posX: number;
    readonly posY: number;
  } {
    return {
      posX: this.posX + this.size.width / 2 - 1,
      posY: this.posY + this.size.height / 2 - 1,
    };
  }

  /**
   * SOUŘADNICE BODŮ, POMOCÍ KTERÝCH PACMAN JÍ JÍDLO A SPECIÁLNÍ SCHOPNOSTI
   * (15 = OFFSET)
   */
  protected eatRightDirection(): {
    readonly posX: number;
    readonly posY: number;
  } {
    return {
      posX: this.posX + this.size.width / 2 - 15,
      posY: this.posY,
    };
  }

  protected eatLeftDirection(): { readonly posX: number; readonly posY: number } {
    return {
      posX: this.posX - this.size.width / 2 + 15,
      posY: this.posY,
    };
  }

  protected eatTopDirection(): { readonly posX: number; readonly posY: number } {
    return {
      posX: this.posX,
      posY: this.posY - this.size.height / 2 + 15,
    };
  }

  protected eatBottomDirection(): {
    readonly posX: number;
    readonly posY: number;
  } {
    return {
      posX: this.posX,
      posY: this.posY + this.size.height / 2 - 15,
    };
  }

  public getPacmanPositions(): {
    readonly posX: number;
    readonly posY: number;
  } {
    return {
      posX: this.posX,
      posY: this.posY
    }
  }
}

export let pacman: Pacman;
// Uncaught ReferenceError: Cannot access 'oneBlockWidth' before initialization (musí se stránka nejdříve načíst a potom mohu inicializovat pacmana, je to debilní řešení, ale stackoverflow poradilo ...)
window.addEventListener("load", () => {
  pacman = new Pacman(1.5 * oneBlockWidth, 1.5 * oneBlockHeight);
});
