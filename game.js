// Color Chain Battle - Game Logic
class ColorChainBattle {
    constructor() {
        this.canvas1 = document.getElementById('canvas1');
        this.canvas2 = document.getElementById('canvas2');
        this.ctx1 = this.canvas1.getContext('2d');
        this.ctx2 = this.canvas2.getContext('2d');
        
        // Game settings
        this.gridWidth = 10;
        this.gridHeight = 16;
        this.cellSize = 30;
        this.colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd', '#00d2d3'];
        
        // Game state
        this.gameRunning = false;
        this.gameTime = 180; // 3 minutes
        this.scores = [0, 0];
        this.specialAttackCooldown = [0, 0];
        
        // Game grids
        this.grids = [
            this.createEmptyGrid(),
            this.createEmptyGrid()
        ];
        
        // Animation state
        this.animationFrameId = null;
        
        this.setupEventListeners();
        this.render();
    }
    
    createEmptyGrid() {
        const grid = [];
        for (let y = 0; y < this.gridHeight; y++) {
            grid[y] = [];
            for (let x = 0; x < this.gridWidth; x++) {
                grid[y][x] = null;
            }
        }
        return grid;
    }
    
    setupEventListeners() {
        this.canvas1.addEventListener('click', (e) => this.handleClick(e, 0));
        this.canvas2.addEventListener('click', (e) => this.handleClick(e, 1));
        
        // Add visual feedback on hover
        this.canvas1.addEventListener('mousemove', (e) => this.handleMouseMove(e, 0));
        this.canvas2.addEventListener('mousemove', (e) => this.handleMouseMove(e, 1));
    }
    
    handleClick(event, player) {
        if (!this.gameRunning) return;
        
        const rect = event.target.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / this.cellSize);
        const y = Math.floor((event.clientY - rect.top) / this.cellSize);
        
        if (x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight) {
            this.processChain(x, y, player);
        }
    }
    
    handleMouseMove(event, player) {
        if (!this.gameRunning) return;
        
        const rect = event.target.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / this.cellSize);
        const y = Math.floor((event.clientY - rect.top) / this.cellSize);
        
        // Clear previous hover effects and draw new one
        this.render();
        this.drawHoverEffect(x, y, player);
    }
    
    drawHoverEffect(x, y, player) {
        if (x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight) {
            const ctx = player === 0 ? this.ctx1 : this.ctx2;
            const grid = this.grids[player];
            
            if (grid[y][x]) {
                const connectedCells = this.getConnectedCells(x, y, player, grid[y][x]);
                if (connectedCells.length >= 3) {
                    ctx.strokeStyle = '#FFD700';
                    ctx.lineWidth = 3;
                    
                    connectedCells.forEach(cell => {
                        ctx.strokeRect(cell.x * this.cellSize, cell.y * this.cellSize, 
                                     this.cellSize, this.cellSize);
                    });
                }
            }
        }
    }
    
    processChain(x, y, player) {
        const grid = this.grids[player];
        const color = grid[y][x];
        
        if (!color) return;
        
        const connectedCells = this.getConnectedCells(x, y, player, color);
        
        if (connectedCells.length >= 3) {
            // Remove connected cells
            connectedCells.forEach(cell => {
                grid[cell.y][cell.x] = null;
            });
            
            // Calculate score
            const chainScore = connectedCells.length * 10 + (connectedCells.length - 3) * 5;
            this.scores[player] += chainScore;
            
            // Show chain effect
            this.showChainEffect(x, y, player, connectedCells.length);
            
            // Apply gravity
            this.applyGravity(player);
            
            // Fill empty spaces with new blocks
            this.fillEmptySpaces(player);
            
            // Update special attack cooldown
            this.specialAttackCooldown[player] = Math.max(0, this.specialAttackCooldown[player] - 1);
            
            this.updateUI();
        }
    }
    
    getConnectedCells(startX, startY, player, targetColor) {
        const grid = this.grids[player];
        const visited = new Set();
        const connected = [];
        const queue = [{x: startX, y: startY}];
        
        while (queue.length > 0) {
            const {x, y} = queue.shift();
            const key = `${x},${y}`;
            
            if (visited.has(key) || x < 0 || x >= this.gridWidth || 
                y < 0 || y >= this.gridHeight || grid[y][x] !== targetColor) {
                continue;
            }
            
            visited.add(key);
            connected.push({x, y});
            
            // Check adjacent cells
            queue.push({x: x + 1, y});
            queue.push({x: x - 1, y});
            queue.push({x, y: y + 1});
            queue.push({x, y: y - 1});
        }
        
        return connected;
    }
    
    showChainEffect(x, y, player, chainLength) {
        const canvas = player === 0 ? this.canvas1 : this.canvas2;
        const rect = canvas.getBoundingClientRect();
        
        const effect = document.createElement('div');
        effect.className = 'chain-effect';
        effect.textContent = `+${chainLength * 10}`;
        effect.style.left = `${rect.left + x * this.cellSize}px`;
        effect.style.top = `${rect.top + y * this.cellSize}px`;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            document.body.removeChild(effect);
        }, 1000);
    }
    
    applyGravity(player) {
        const grid = this.grids[player];
        
        for (let x = 0; x < this.gridWidth; x++) {
            let writePos = this.gridHeight - 1;
            
            for (let y = this.gridHeight - 1; y >= 0; y--) {
                if (grid[y][x]) {
                    grid[writePos][x] = grid[y][x];
                    if (writePos !== y) {
                        grid[y][x] = null;
                    }
                    writePos--;
                }
            }
        }
    }
    
    fillEmptySpaces(player) {
        const grid = this.grids[player];
        
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                if (!grid[y][x]) {
                    grid[y][x] = this.colors[Math.floor(Math.random() * this.colors.length)];
                }
            }
        }
    }
    
    launchSpecialAttack(player) {
        if (!this.gameRunning || this.specialAttackCooldown[player] > 0) return;
        
        const opponent = player === 0 ? 1 : 0;
        const opponentGrid = this.grids[opponent];
        
        // Add random gray blocks to opponent's grid
        let addedBlocks = 0;
        const maxBlocks = 8;
        
        for (let attempt = 0; attempt < 50 && addedBlocks < maxBlocks; attempt++) {
            const x = Math.floor(Math.random() * this.gridWidth);
            const y = Math.floor(Math.random() * this.gridHeight);
            
            if (opponentGrid[y][x]) {
                opponentGrid[y][x] = '#666666'; // Gray interference block
                addedBlocks++;
            }
        }
        
        // Set cooldown
        this.specialAttackCooldown[player] = 5;
        
        // Show attack effect
        this.showAttackEffect(opponent);
        
        this.updateUI();
    }
    
    showAttackEffect(opponent) {
        const canvas = opponent === 0 ? this.canvas1 : this.canvas2;
        const ctx = opponent === 0 ? this.ctx1 : this.ctx2;
        
        // Flash effect
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        
        setTimeout(() => {
            this.render();
        }, 200);
    }
    
    render() {
        this.renderGrid(0);
        this.renderGrid(1);
    }
    
    renderGrid(player) {
        const ctx = player === 0 ? this.ctx1 : this.ctx2;
        const grid = this.grids[player];
        
        // Clear canvas
        ctx.clearRect(0, 0, this.canvas1.width, this.canvas1.height);
        
        // Draw grid
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const color = grid[y][x];
                if (color) {
                    // Draw block
                    ctx.fillStyle = color;
                    ctx.fillRect(x * this.cellSize, y * this.cellSize, 
                               this.cellSize - 1, this.cellSize - 1);
                    
                    // Add shine effect
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.fillRect(x * this.cellSize, y * this.cellSize, 
                               this.cellSize - 1, this.cellSize / 3);
                }
            }
        }
        
        // Draw grid lines
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        
        for (let x = 0; x <= this.gridWidth; x++) {
            ctx.beginPath();
            ctx.moveTo(x * this.cellSize, 0);
            ctx.lineTo(x * this.cellSize, this.gridHeight * this.cellSize);
            ctx.stroke();
        }
        
        for (let y = 0; y <= this.gridHeight; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * this.cellSize);
            ctx.lineTo(this.gridWidth * this.cellSize, y * this.cellSize);
            ctx.stroke();
        }
    }
    
    updateUI() {
        document.getElementById('score1').textContent = this.scores[0];
        document.getElementById('score2').textContent = this.scores[1];
        
        // Update special attack buttons
        const attack1 = document.getElementById('attack1');
        const attack2 = document.getElementById('attack2');
        
        attack1.disabled = this.specialAttackCooldown[0] > 0;
        attack2.disabled = this.specialAttackCooldown[1] > 0;
        
        if (this.specialAttackCooldown[0] > 0) {
            attack1.textContent = `🌟 Cooldown (${this.specialAttackCooldown[0]})`;
        } else {
            attack1.textContent = '🌟 Special Attack';
        }
        
        if (this.specialAttackCooldown[1] > 0) {
            attack2.textContent = `🌟 Cooldown (${this.specialAttackCooldown[1]})`;
        } else {
            attack2.textContent = '🌟 Special Attack';
        }
    }
    
    updateTimer() {
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = this.gameTime % 60;
        document.getElementById('timer').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (this.gameTime <= 0) {
            this.endGame();
        }
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        this.gameTime--;
        this.updateTimer();
        
        // Reduce cooldowns
        this.specialAttackCooldown[0] = Math.max(0, this.specialAttackCooldown[0] - 1);
        this.specialAttackCooldown[1] = Math.max(0, this.specialAttackCooldown[1] - 1);
        
        this.updateUI();
        
        setTimeout(() => this.gameLoop(), 1000);
    }
    
    startGame() {
        this.gameRunning = true;
        this.gameTime = 180;
        this.scores = [0, 0];
        this.specialAttackCooldown = [0, 0];
        
        // Initialize grids with random colors
        for (let player = 0; player < 2; player++) {
            this.grids[player] = this.createEmptyGrid();
            this.fillEmptySpaces(player);
        }
        
        document.getElementById('startButton').style.display = 'none';
        document.getElementById('gameOver').style.display = 'none';
        
        this.updateUI();
        this.render();
        this.gameLoop();
    }
    
    endGame() {
        this.gameRunning = false;
        
        const gameOverDiv = document.getElementById('gameOver');
        const winnerText = document.getElementById('winnerText');
        
        if (this.scores[0] > this.scores[1]) {
            winnerText.textContent = `Player 1 Wins! (${this.scores[0]} - ${this.scores[1]})`;
        } else if (this.scores[1] > this.scores[0]) {
            winnerText.textContent = `Player 2 Wins! (${this.scores[1]} - ${this.scores[0]})`;
        } else {
            winnerText.textContent = `Draw! (${this.scores[0]} - ${this.scores[1]})`;
        }
        
        gameOverDiv.style.display = 'flex';
    }
    
    resetGame() {
        this.gameRunning = false;
        this.gameTime = 180;
        this.scores = [0, 0];
        this.specialAttackCooldown = [0, 0];
        
        document.getElementById('startButton').style.display = 'block';
        document.getElementById('gameOver').style.display = 'none';
        
        this.updateUI();
        this.updateTimer();
        this.render();
    }
}

// Initialize game
let game;

function startGame() {
    if (game) {
        game.startGame();
    }
}

function launchSpecialAttack(player) {
    if (game) {
        game.launchSpecialAttack(player - 1);
    }
}

function resetGame() {
    if (game) {
        game.resetGame();
    }
}

// Initialize when page loads
window.addEventListener('load', () => {
    game = new ColorChainBattle();
});