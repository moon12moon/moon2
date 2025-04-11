class Snake {
    constructor() {
        this.body = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        this.direction = 'right';
        this.nextDirection = 'right';
    }

    move() {
        this.direction = this.nextDirection;
        const head = { ...this.body[0] };

        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        this.body.unshift(head);
        return this.body.pop();
    }

    grow() {
        const tail = this.body[this.body.length - 1];
        this.body.push({ ...tail });
    }

    checkCollision(gridSize) {
        const head = this.body[0];
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
            return true;
        }
        return this.body.slice(1).some(segment => 
            segment.x === head.x && segment.y === head.y
        );
    }

    setDirection(newDirection) {
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };
        if (opposites[this.direction] !== newDirection) {
            this.nextDirection = newDirection;
        }
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.tileSize = this.canvas.width / this.gridSize;
        this.snake = new Snake();
        this.food = this.generateFood();
        this.score = 0;
        this.gameLoop = null;
        this.isGameOver = false;

        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        document.getElementById('startButton').addEventListener('click', () => {
            if (this.gameLoop) {
                this.reset();
            }
            this.start();
        });
    }

    generateFood() {
        const food = {
            x: Math.floor(Math.random() * this.gridSize),
            y: Math.floor(Math.random() * this.gridSize)
        };

        // 確保食物不會生成在蛇身上
        if (this.snake && this.snake.body.some(segment => 
            segment.x === food.x && segment.y === food.y
        )) {
            return this.generateFood();
        }
        return food;
    }

    update() {
        if (this.isGameOver) return;

        const removedTail = this.snake.move();

        // 檢查是否吃到食物
        if (this.snake.body[0].x === this.food.x && this.snake.body[0].y === this.food.y) {
            this.snake.grow();
            this.food = this.generateFood();
            this.score += 10;
            document.getElementById('score').textContent = `分數：${this.score}`;
        }

        // 檢查碰撞
        if (this.snake.checkCollision(this.gridSize)) {
            this.gameOver();
            return;
        }

        this.draw();
    }

    draw() {
        // 清空畫布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 繪製蛇
        this.snake.body.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#2ecc71' : '#27ae60';
            this.ctx.fillRect(
                segment.x * this.tileSize,
                segment.y * this.tileSize,
                this.tileSize - 1,
                this.tileSize - 1
            );
        });

        // 繪製食物
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(
            this.food.x * this.tileSize,
            this.food.y * this.tileSize,
            this.tileSize - 1,
            this.tileSize - 1
        );
    }

    handleKeyPress(event) {
        const keyActions = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'w': 'up',
            's': 'down',
            'a': 'left',
            'd': 'right'
        };

        const newDirection = keyActions[event.key];
        if (newDirection) {
            this.snake.setDirection(newDirection);
        }
    }

    start() {
        if (!this.gameLoop) {
            this.isGameOver = false;
            this.gameLoop = setInterval(() => this.update(), 150);
            document.getElementById('startButton').textContent = '重新開始';
        }
    }

    reset() {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        this.snake = new Snake();
        this.food = this.generateFood();
        this.score = 0;
        document.getElementById('score').textContent = `分數：${this.score}`;
        this.isGameOver = false;
    }

    gameOver() {
        this.isGameOver = true;
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('遊戲結束！', this.canvas.width / 2, this.canvas.height / 2);
    }
}

// 初始化遊戲
const game = new Game();