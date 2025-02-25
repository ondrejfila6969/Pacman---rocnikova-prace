import { ctx, oneBlockHeight, oneBlockWidth, currentMap } from "../script.js";
import { pacman } from "../pacman/pacman.js";
import { GhostTemplate } from "./ghostTemplate/ghostTemplate.js";
class Ghost extends GhostTemplate {
    posX;
    posY;
    constructor(posX, posY, imageIndex) {
        super(posX, posY, imageIndex);
        this.posX = posX;
        this.posY = posY;
    }
    /**
     * METODA PRO VYKRESLENÍ DUCHA
     */
    drawGhost() {
        if (this.imageLoaded) {
            if (ctx !== null) {
                ctx.drawImage(this.image, this.posX, this.posY, this.size.width, this.size.height);
            }
        }
    }
    /**
     * METODY PRO POHYB DUCHŮ
     */
    ghostMovement() {
        // Kontrola, jestli je duch zarovnaný jak na ose X, tak na ose Y
        const isAlignedX = this.posX % oneBlockWidth < this.distance;
        const isAlignedY = this.posY % oneBlockHeight < this.distance;
        if (isAlignedX && isAlignedY) {
            // Pokud ano, tak se provede následující:
            if (this.isPacmanNear()) {
                this.moveTowards();
            }
            else {
                this.randomDirection();
            }
        }
        this.moveGhost();
    }
    moveGhost() {
        const previousPosX = this.posX;
        const previousPosY = this.posY;
        switch (this.currentDirection) {
            case "right":
                this.posX += this.distance;
                break;
            case "left":
                this.posX -= this.distance;
                break;
            case "up":
                this.posY -= this.distance;
                break;
            case "down":
                this.posY += this.distance;
                break;
        }
        /**
         * Pokud duch narazí do zdi, vrátí se zpět na své původní souřadnice a náhodně změní směr, což znamená zjednodušení kodu
         */
        if (this.wallCollision()) {
            this.posX = previousPosX;
            this.posY = previousPosY;
            this.randomDirection();
        }
    }
    moveTowards() {
        const path = this.findPathToPacman();
        if (path && path.length !== 0) {
            const nextStep = path[1]; // další krok je v poli až na druhém místě, protože první místo je pozice samotného ducha
            // výpočet cílové pozice, která se přepočítá na skutečné souřadnice, nikoliv v gridu + zohlednění rozměrů ducha (this.size.width / 2, this.size.height / 2)
            const targetX = nextStep.posX * oneBlockWidth + this.size.width / 2;
            const targetY = nextStep.posY * oneBlockHeight + this.size.height / 2;
            // Rozdíl mezi pozicí ducha a pacmana, na základě toho zvolí směr
            const dx = targetX - (this.posX + this.size.width / 2);
            const dy = targetY - (this.posY + this.size.height / 2);
            if (Math.abs(dx) > Math.abs(dy)) {
                this.currentDirection = dx > 0 ? "right" : "left";
            }
            else {
                this.currentDirection = dy > 0 ? "down" : "up";
            }
        }
        this.moveGhost();
    }
    /**
     * METODA PRO KONTROLU, ZDA JE PACMAN BLÍZKO, NEBO NE
     * VÝPOČET PRO VZDÁLENOST 2 BODŮ Z ANALYTICKÉ GEOMETRIE
     */
    isPacmanNear() {
        const pacmanX = pacman.getPacmanPositions().posX;
        const pacmanY = pacman.getPacmanPositions().posY;
        const distanceBetweenPacmanAndGhost = Math.floor(Math.sqrt(Math.pow(pacmanX - this.posX, 2) + Math.pow(pacmanY - this.posY, 2)));
        return (distanceBetweenPacmanAndGhost < 5 * oneBlockWidth ||
            distanceBetweenPacmanAndGhost < 5 * oneBlockHeight);
    }
    /**
     * METODA PRO ZÍSKÁNÍ DOSTUPNÝCH SMĚRŮ + METODA PRO NÁHODNÝ VÝBĚR
     */
    getAvailableDirections() {
        const { posX, posY } = this.ghostGetMiddlePoints();
        const ghostX = Math.floor(posX / oneBlockWidth);
        const ghostY = Math.floor(posY / oneBlockHeight);
        let ghostDirections = [];
        /**
         * Kontroluje, zda hodnota sousední buňky je různá od 1 (to znamená, že tam není zeď, ale normální cesta)
         * Pokud tam není zeď, naplní pole dostupným směrem + to také kontroluje, zda souřadnice není mimo mapu
         */
        if (ghostY > 0 && currentMap[ghostY - 1][ghostX] !== 1) {
            ghostDirections.push("up");
        }
        if (ghostY < currentMap.length - 1 &&
            currentMap[ghostY + 1][ghostX] !== 1) {
            ghostDirections.push("down");
        }
        if (ghostX > 0 && currentMap[ghostY][ghostX - 1] !== 1) {
            ghostDirections.push("left");
        }
        if (ghostX < currentMap[0].length - 1 &&
            currentMap[ghostY][ghostX + 1] !== 1) {
            ghostDirections.push("right");
        }
        return ghostDirections;
    }
    randomDirection() {
        const availableDirections = this.getAvailableDirections(); // získám dostupné směry z metody getAvailableDirections()
        /**
         * V tomto objektu jsou uložené opačné směry pro ten současný směr, je to kvůli tomu, aby si duch vybral jiný směr, má-li tu možnost
         */
        const oppositeDirections = {
            up: "down",
            down: "up",
            left: "right",
            right: "left",
        };
        /**
         * Pole availableDirections profiltruji, aby neobsahovalo opačný směr a uložím do nové proměnné
         */
        const filteredDirections = availableDirections.filter((dir) => dir !== oppositeDirections[this.currentDirection]);
        if (filteredDirections.length > 0) {
            // Pokud profiltrované pole není prázdné, vybereme náhodný směr z daného pole
            this.currentDirection =
                filteredDirections[Math.floor(Math.random() * filteredDirections.length)];
        }
        else if (availableDirections.length > 0) {
            // Jinak zvolíme směr ze všech dostupných směrů - i těch opačných k tomu současnému
            this.currentDirection =
                availableDirections[Math.floor(Math.random() * availableDirections.length)];
        }
    }
    /**
     * KONTROLA KOLIZE SE ZDÍ
     */
    wallCollision() {
        const topLeftPoint = {
            posX: Math.floor(this.ghostGetTopLeftPoint().posX / oneBlockWidth),
            posY: Math.floor(this.ghostGetTopLeftPoint().posY / oneBlockHeight),
        };
        const topRightPoint = {
            posX: Math.floor(this.ghostGetTopRightPoint().posX / oneBlockWidth),
            posY: Math.floor(this.ghostGetTopRightPoint().posY / oneBlockHeight),
        };
        const bottomLeftPoint = {
            posX: Math.floor(this.ghostGetBottomLeftPoint().posX / oneBlockWidth),
            posY: Math.floor(this.ghostGetBottomLeftPoint().posY / oneBlockHeight),
        };
        const bottomRightPoint = {
            posX: Math.floor(this.ghostGetBottomRightPoint().posX / oneBlockWidth),
            posY: Math.floor(this.ghostGetBottomRightPoint().posY / oneBlockHeight),
        };
        return (currentMap[topLeftPoint.posY][topLeftPoint.posX] == 1 ||
            currentMap[topRightPoint.posY][topRightPoint.posX] == 1 ||
            currentMap[bottomLeftPoint.posY][bottomLeftPoint.posX] == 1 ||
            currentMap[bottomRightPoint.posY][bottomRightPoint.posX] == 1 ||
            /**
             * Tyhle poslední 2 řádky platí zatím pouze pro první mapu, map bude nejspíš 5-10, je to kvůli těm východům na obou stranách, zatím nebudu dělat, aby duchové se tímto průchodem mohli dostat na 2. stranu
             */
            Math.floor(this.ghostGetTopLeftPoint().posX / oneBlockWidth) < 0 ||
            Math.floor(this.ghostGetTopRightPoint().posX / oneBlockWidth) >= 21);
    }
    /**
     * SESTAVENÍ GRAFU PRO A* ALGORITMUS NA VÝPOČET NEJIDEÁLNĚJŠÍ CESTY K CÍLI
     */
    buildGraph() {
        const graph = [];
        const rows = currentMap.length;
        const columns = currentMap[0].length;
        // Tyto cykly projdou celou mapu, která momentálně běží
        for (let y = 0; y < rows; y++) {
            const row = [];
            for (let x = 0; x < columns; x++) {
                if (currentMap[y][x] === 1) {
                    // Pokud se na daném políčku nachází číslo 1 - zeď, označí se toto pole za neprůchozí / nedostupné
                    row.push(Infinity);
                }
                else {
                    row.push(1); // Všechna ostatní čísla budou mít metriku 1 (vzdálenost 1)
                }
            }
            graph.push(row);
        }
        console.log(graph);
        return graph;
    }
    findPathToPacman() {
        const start = {
            // Pozice ducha
            posX: Math.floor(this.posX / oneBlockWidth),
            posY: Math.floor(this.posY / oneBlockHeight),
        };
        const target = {
            // Pozice pacmana na mapě
            posX: Math.floor(pacman.getPacmanPositions().posX / oneBlockWidth),
            posY: Math.floor(pacman.getPacmanPositions().posY / oneBlockHeight),
        };
        const graph = this.buildGraph();
        const rows = graph.length;
        const columns = graph[0].length;
        const openList = [{ posX: start.posX, posY: start.posY }]; // místa na mapě, která jsou ještě třeba prozkoumat
        const closedList = new Set(); // v této sadě jsou uloženy cesty, které duch již prozkoumal
        const cameFrom = new Map(); // uchovává pozice, odkud duch přišel
        const gScore = new Map(); // uchovává skutečnou vzdálenost
        const fScore = new Map(); // uchovává odhadovanou vzdálenost (cenu / výhodnost té cesty)
        gScore.set(`${start.posX}, ${start.posY}`, 0); // inicializuje startovní uzel, má hodnotu 0, protože je defaultním bodem
        fScore.set(`${start.posX}, ${start.posY}`, this.heuristic(start, target)); // fScore startovního uzlu je ta heuristická vzdálenost k pacmanovi
        while (openList.length > 0) {
            const current = openList.shift(); // odebere první uzel z openList a nastaví ho jako aktuální
            openList.sort((a, b) => {
                // seřadí openList podle výhodnosti cest
                const fScoreA = fScore.get(`${a.posX},${a.posY}`) ?? Infinity;
                const fScoreB = fScore.get(`${b.posX},${b.posY}`) ?? Infinity;
                if (fScoreA === fScoreB) {
                    // pokud obě cesty jsou stejně výhodné, upřednostní uzel v aktuálním směru ducha
                    const currentDir = this.currentDirection;
                    const dirA = this.getDirectionBetweenNodes(current, a);
                    const dirB = this.getDirectionBetweenNodes(current, b);
                    if (dirA === currentDir)
                        return -1;
                    if (dirB === currentDir)
                        return 1;
                }
                return fScoreA - fScoreB;
            });
            if (!current)
                continue;
            if (
            // Jestli duch není ve frightened modu a chytil zároveň pacmana
            this.mode !== "frightened" &&
                current.posX === target.posX &&
                current.posY === target.posY) {
                const path = []; // vytvoří prázdné pole obsahující jednotlivé kroky, kterými duch šel
                let step = current; // od cílové pozice zpětně rekonstruuje cestu do počáteční pozice
                while (step) {
                    path.unshift(step);
                    step = cameFrom.get(`${step.posX},${step.posY}`);
                }
                return path;
            }
            closedList.add(`${current.posX},${current.posY}`); // přidá aktuální uzel do closedList, protože už na něm byl
            for (const direction of [
                { posX: 0, posY: -1 },
                { posX: 0, posY: 1 },
                { posX: -1, posY: 0 },
                { posX: 1, posY: 0 },
            ]) {
                // pro každý směr vypočítá nový sousední uzel
                const nx = current.posX + direction.posX;
                const ny = current.posY + direction.posY;
                if (
                // Pokud uzel není mimo mapu
                nx >= 0 &&
                    ny >= 0 &&
                    nx < columns &&
                    ny < rows &&
                    graph[ny][nx] !== Infinity && // není neprůchozí
                    !closedList.has(`${nx},${ny}`) // nebyl prozkoumán
                ) {
                    // spočítá dočasnou hodnotu gScore (vzdálenost startu od nového uzlu) + 1, protože co krok, to vzdálenost 1
                    const tentativeGScore = (gScore.get(`${current.posX},${current.posY}`) ?? Infinity) + 1;
                    // Pokud nový uzel ještě nebyl v gScore, nebo je nová cesta kratší než dříve nalezená, dojde k aktualizaci
                    if (!gScore.has(`${nx},${ny}`) ||
                        tentativeGScore < (gScore.get(`${nx},${ny}`) ?? Infinity)) {
                        gScore.set(`${nx},${ny}`, tentativeGScore);
                        fScore.set(`${nx},${ny}`, tentativeGScore + this.heuristic({ posX: nx, posY: ny }, target));
                        cameFrom.set(`${nx},${ny}`, current);
                        // pokud nový uzel ještě není v openList, přidá ho
                        if (!openList.some((node) => node.posX === nx && node.posY === ny)) {
                            openList.push({ posX: nx, posY: ny });
                        }
                    }
                }
            }
        }
        /**
         * Předchystáno pro frightened mode, kdy bude duch utíkat od pacmana, bude hledat nejvzdálenější bod od pacmana a k němu se pohybovat
         */
        if (this.mode === "frightened") {
            let farthestPath = [];
            let maxDistance = -Infinity;
            for (const point of closedList) {
                const [px, py] = point.split(",").map(Number);
                const dist = this.heuristic({ posX: px, posY: py }, target);
                if (dist > maxDistance) {
                    maxDistance = dist;
                    farthestPath = [];
                    let step = {
                        posX: px,
                        posY: py,
                    };
                    while (step) {
                        farthestPath.unshift(step);
                        step = cameFrom.get(`${step.posX},${step.posY}`);
                    }
                }
            }
            return farthestPath.length > 0 ? farthestPath : null;
        }
        // pokud algoritmus nenašel cestu, vrátí null
        return null;
    }
    getDirectionBetweenNodes(from, to) {
        if (to.posX > from.posX)
            return "right";
        if (to.posX < from.posX)
            return "left";
        if (to.posY > from.posY)
            return "down";
        return "up";
    }
    // Heuristika, nebo také Manhattonovská vzdálenost počítá minimální počet kroků nutných k dosažení cíle, je vhodná pro mřížkové grafy
    heuristic(a, b) {
        return Math.abs(a.posX - b.posX) + Math.abs(a.posY - b.posY);
    }
    /**
     * METODY PRO ZÍSKÁNÍ SOUŘADNIC BODŮ (1 = offset)
     * Menší úprava u souřadnic, kde se posouvám o oneBlockWidth nebo oneBlockHeight, vynásobením 0.9 se duchové mohou plně pohybovat po mapě
     */
    ghostGetTopLeftPoint() {
        return {
            posX: this.posX + 1,
            posY: this.posY + 1,
        };
    }
    ghostGetTopRightPoint() {
        return {
            posX: this.posX + oneBlockWidth * 0.9,
            posY: this.posY + 1,
        };
    }
    ghostGetBottomLeftPoint() {
        return {
            posX: this.posX + 1,
            posY: this.posY + oneBlockHeight * 0.9,
        };
    }
    ghostGetBottomRightPoint() {
        return {
            posX: this.posX + oneBlockWidth * 0.9,
            posY: this.posY + oneBlockHeight * 0.9,
        };
    }
    ghostGetMiddlePoints() {
        return {
            posX: this.posX + oneBlockWidth / 2,
            posY: this.posY + oneBlockWidth / 2,
        };
    }
}
let pinky, clyde, blinky, inky;
const loadGhostPositions = async () => {
    const file = await fetch("../res/data/ghostPositions.json");
    const data = await file.json();
    blinky = new Ghost(Number(data[pacman.currentLevel - 1].blinky.posX * oneBlockWidth), Number(data[pacman.currentLevel - 1].blinky.posY * oneBlockHeight), 0);
    pinky = new Ghost(Number(data[pacman.currentLevel - 1].pinky.posX * oneBlockWidth), Number(data[pacman.currentLevel - 1].pinky.posY * oneBlockHeight), 3);
    inky = new Ghost(Number(data[pacman.currentLevel - 1].inky.posX * oneBlockWidth), Number(data[pacman.currentLevel - 1].inky.posY * oneBlockHeight), 2);
    clyde = new Ghost(Number(data[pacman.currentLevel - 1].clyde.posX * oneBlockWidth), Number(data[pacman.currentLevel - 1].clyde.posY * oneBlockHeight), 1);
};
export { loadGhostPositions, blinky, pinky, inky, clyde };
