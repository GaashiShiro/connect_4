export class Board {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.tiles = Array(width * height).fill(0);
      this.elem = document.getElementById("board");
      this.turnIndicator = document.getElementById("turn-indicator");
      this.currentPlayer = 1;
      this.updateTurnIndicator();
    }
  
    draw() {
        this.elem.innerHTML = "";
        this.elem.style.setProperty("--width", this.width);
        this.elem.style.setProperty("--height", this.height);
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tileValue = this.tiles[y * this.width + x];
                const tileElem = document.createElement("div");
                tileElem.dataset.x = x;
                tileElem.dataset.y = y;
                tileElem.classList.add("tile");
    
                if (tileValue > 0) {
                    const checkerElem = document.createElement("div");
                    checkerElem.classList.add("checker");
                    checkerElem.classList.add(`player-${tileValue}`);
                    tileElem.appendChild(checkerElem);
                }
                this.elem.appendChild(tileElem);
    
                //listeners for hover effect
                tileElem.addEventListener("mouseenter", ()=>{ this.highlightColumn(x, true) });
                tileElem.addEventListener("mouseleave", ()=>{ this.highlightColumn(x, false) });
                tileElem.addEventListener("click", ()=>{ this.dropPiece(x) });
            }
        }
    }
  
    getTile(x, y){
        if (x<0 || y<0 || x>=this.width || y>=this.height) return;
        return this.tiles[y * this.width + x];
    }
  
    dropPiece(column){
        for (let y = this.height - 1; y >= 0; y--) {
            if (this.getTile(column, y) === 0) {
                this.tiles[y * this.width + column] = this.currentPlayer;
                this.draw();
            if (this.checkWin(column, y)) {
                this.tiles[y * this.width + column] = this.currentPlayer;
                this.draw();
                alert(`Player ${this.currentPlayer} wins!`);
                this.reset(); // resets the board/game
            }
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
            return this.updateTurnIndicator();
            }
        }
    }
  
    checkWin(column, row){
        const directions=[
            [0, 1],  // Vertical
            [1, 0],  // Horizontal
            [1, 1],  // Diagonal (top-left to bottom-right)
            [-1, 1] // Diagonal (top-right to bottom-left)
        ];
        const currentPlayer = this.tiles[row * this.width + column];
      
        for (const [dx, dy] of directions){
            let count = 1;
            // Check in both directions
            for (const dir of [-1, 1]){
                let cx = column + dir * dx;
                let cy = row + dir * dy;
                while ( cx >= 0 && cy >= 0 && cx < this.width && cy < this.height && this.tiles[cy * this.width + cx] === currentPlayer ){
                    count++;
                    cx += dir * dx;
                    cy += dir * dy;
                }
            }
                if (count >= 4) { return true } // Win condition
        }
        return false; 
    }
      
    reset() {
        this.tiles.fill(0);
        this.currentPlayer = 1;
        this.draw();
    }

    updateTurnIndicator() {
        this.turnIndicator.textContent = `Player ${this.currentPlayer}'s Turn`;
        this.turnIndicator.classList.remove("player-1", "player-2");
        this.turnIndicator.classList.add(`player-${this.currentPlayer}`);
    }

    highlightColumn(column, highlight) {
        const tiles = Array.from(this.elem.getElementsByClassName("tile"));
        tiles.forEach((tile) => {
            const tileX = parseInt(tile.dataset.x);
            if (tileX === column) {
                if (highlight) { tile.classList.add("highlight") }
                else { tile.classList.remove("highlight") }
            }
        });
    }
}