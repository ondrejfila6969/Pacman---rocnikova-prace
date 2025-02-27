import { oneBlockHeight, oneBlockWidth} from "../../script.js";

export abstract class PacmanTemplate {
  protected posX: number;
  protected posY: number;

  currentLevel: number;
  currentDirection: string;
  desiredDirection: string | null;
  score: number;
  distance: number;
  size: { width: number; height: number };
  lives: number;
  startMovement: boolean;

  constructor(posX: number, posY: number) {
    this.posX = posX;
    this.posY = posY;
    this.size = {
      width: oneBlockWidth,
      height: oneBlockHeight,
    };
    this.distance = 2;
    this.currentDirection = "right";
    this.desiredDirection = null;
    this.score = 0;
    this.currentLevel = 1;
    this.lives = 10
    this.startMovement = false;
  }

  abstract drawPacman(): void;
  abstract movement(): void;
  abstract setDesiredDirection(direction: string): void;
  abstract eatFood(): void;

  protected abstract wallCollision(): void;
  protected abstract tryNewDirection(): void;

  abstract getTopLeftPoint(): { readonly posX: number; readonly posY: number };
  abstract getTopRightPoint(): { readonly posX: number; readonly posY: number };
  abstract getBottomLeftPoint(): {
    readonly posX: number;
    readonly posY: number;
  };
  abstract getBottomRightPoint(): {
    readonly posX: number;
    readonly posY: number;
  };

  protected abstract eatRightDirection(): {
    readonly posX: number;
    readonly posY: number;
  };
  protected abstract eatLeftDirection(): {
    readonly posX: number;
    readonly posY: number;
  };
  protected abstract eatTopDirection(): {
    readonly posX: number;
    readonly posY: number;
  };
  protected abstract eatBottomDirection(): {
    readonly posX: number;
    readonly posY: number;
  };
}
