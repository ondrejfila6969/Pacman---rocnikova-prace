import { oneBlockHeight, oneBlockWidth, ctx } from "../script.js"; // pokud nepřipíšu příponu souboru, ze kterého importuji, začne mi v konzoli vyskakovat chyba, že daný soubor nelze nalézt

class Pacman {
    private posX: number;
    private posY: number;
    private distance: number;
    private currentDirection: string;
    public desiredDirection: string | null;
    protected size: {width: number, height: number};

    constructor(posX: number, posY: number) {
        this.posX = posX;
        this.posY = posY;
        this.currentDirection = "right";
        this.desiredDirection = null;
        this.distance = 2;
        this.size = {
            width: oneBlockWidth,
            height: oneBlockHeight
        }
    }

    public drawPacman(): void {
        function createPacman(color: string, posX: number, posY: number, width: number, height: number, rotation: number, startAngle: number, endAngle: number, counterclockwise ?: boolean ) {
            /** 
             * posX, posY - souřadnice
             * width, height - šířka, výška
             * rotation - úhel rotace elipsy (v radiánech)
             * startAngle, endAngle - počáteční a koncový úhel (v radiánech)
             * counterclockwise - určuje směr kreslení proti směru hodinových ručiček, pokud je true (ve funkci je tento parametr volitelný - ?)
            */
            if(ctx !== null) {
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
                )
                ctx.lineTo(posX, posY); // spojí poslední bod cesty se středem elipsy
                ctx.fill(); // vyplní elipsu barvou
                ctx.closePath(); // ukončí současnou cestu
            }
        }
        // Tato část vykreslí tělo pacmana (0.6 je offset, Math.PI / 5 = 36 stupňů, 9 * Math.PI / 5 = 324 stupňů (360 - 36 :)) )
        createPacman("yellow", this.posX, this.posY, this.size.width / 2 - 0.6, this.size.height / 2 - 0.6, 0, Math.PI / 5, (9 * Math.PI) / 5);
        // Tahle vykreslí pusu
        createPacman("black", this.posX, this.posY, this.size.width / 2, this.size.height / 2, 0, Math.PI / 5, (9 * Math.PI) / 5, true);
    }

    public drawEdgePoints(): void {
        if(ctx !== null) {
            // ctx.arc(poziceX, poziceY, průměr, počáteční úhel, koncový úhel) - vykresluji kruhy, takže 0 až 360

            /* Prostřední bod */
            ctx.beginPath();
            ctx.arc(this.posX, this.posY, 2, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.closePath();

            /* Bod vlevo nahoře (opět jsem tomu dal menší offset) */
            ctx.beginPath();
            ctx.arc(this.posX - this.size.width / 2 + 0.6, this.posY - this.size.height / 2 + 0.6, 2, 0, 2 * Math.PI);
            ctx.fillStyle = "lime";
            ctx.fill();
            ctx.closePath();

            /* Bod vpravo nahoře */
            ctx.beginPath();
            ctx.arc(this.posX + this.size.width / 2 - 0.6, this.posY - this.size.height / 2 + 0.6, 2, 0, 2 * Math.PI);
            ctx.fillStyle = "lime";
            ctx.fill();
            ctx.closePath();

            /* Bod vlevo dole */
            ctx.beginPath();
            ctx.arc(this.posX - this.size.width / 2 + 0.6, this.posY + this.size.height / 2 - 0.6, 2, 0, 2 * Math.PI);
            ctx.fillStyle = "lime";
            ctx.fill();
            ctx.closePath();

            /* Bod vpravo dole */
            ctx.beginPath();
            ctx.arc(this.posX + this.size.width / 2 - 0.6, this.posY + this.size.height / 2 - 0.6, 2, 0, 2 * Math.PI);
            ctx.fillStyle = "lime";
            ctx.fill();
            ctx.closePath();
        }
    }

    public movementProcess() {
        this.movePacman();
    }

    private movePacman(): void {
        switch(this.currentDirection) {
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
        switch(this.currentDirection) {
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

    public setDirection(direction: string): void {
        this.currentDirection = direction;
    }

}

export let pacman: Pacman;
// Uncaught ReferenceError: Cannot access 'oneBlockWidth' before initialization (musí se stránka nejdříve načíst a potom mohu inicializovat pacmana, je to debilní řešení, ale stackoverflow poradilo ...)
window.addEventListener("load", () => {
    pacman = new Pacman(1.5 * oneBlockWidth, 1.5 * oneBlockHeight);
})