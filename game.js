// game.js
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let bird;
let pipes;
let score = 0;
let scoreText;
let gameOverText;
let isgameOver = false;
let highScore = 0;
let highScoreText;

function preload() {
    this.load.image('background', 'sky.png');
    this.load.spritesheet('bird', 'bird.png', { frameWidth: 480, frameHeight: 230 });
    this.load.image('pipe', 'pipe.png');
}

function create() {
    const self = this;

    this.background1 = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background').setDisplaySize(window.innerWidth, window.innerHeight);
    this.background2 = this.add.image(window.innerWidth / 2 + window.innerWidth, window.innerHeight / 2, 'background').setDisplaySize(window.innerWidth, window.innerHeight);

    bird = this.physics.add.sprite(100, window.innerHeight / 2, 'bird').setScale(2);
    bird.setGravityY(800);
    bird.setScale(0.3);

    score = 0;
    scoreText = this.add.text(16, 16, 'Score: ', { fontSize: '32px', fill: '#000000' });
     // Initialize score and display
        score = 0;
        scoreText = this.add.text(16, 16, 'Score: ', { fontSize: '32px', fill: '#000000' });
        scoreText.setShadow(2, 2, '#ffffff', 0); // White shadow

        // Initialize game over text (not visible initially)
        gameOverText = this.add.text(window.innerWidth / 2, window.innerHeight / 2, '  Game Over\nTap to Restart', { fontSize: '48px', fill: '#000000' });
        gameOverText.setOrigin(0.5);
        gameOverText.visible = false;
        gameOverText.setDepth(Number.MAX_SAFE_INTEGER);
        gameOverText.setShadow(2, 2, '#ffffff', 0); // White shadow

            // Initialize high score and display
            highScoreText = this.add.text(window.innerWidth / 2, window.innerHeight - 16, 'High Score: ' + highScore, { fontSize: '32px', fill: '#000000' });
              highScoreText.setOrigin(0.5, 1); // Center-bottom position
              highScoreText.setShadow(2, 2, '#ffffff', 0); // White shadow


    this.anims.create({
        key: 'flap',
        frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    pipes = this.physics.add.group();

    this.input.on('pointerdown', function () {
        flap();
        bird.anims.play('flap', true);
    });

    this.time.addEvent({
        delay: 2000,
        callback: createPipe,
        callbackScope: this,
        loop: true
    });

    this.background1.x = window.innerWidth / 2;
    this.background2.x = window.innerWidth / 2 + window.innerWidth;

    this.sceneReference = self;
}

function flap() {
    bird.setVelocityY(-300);
}

function createPipe() {
    const pipe = pipes.create(window.innerWidth, Phaser.Math.Between(100, window.innerHeight - 100), 'pipe');
    pipe.setVelocityX(-200);
    pipe.setImmovable(true);
    pipe.setSize(40,0);
}

function update() {
    this.background1.x -= 2;
    this.background2.x -= 2;
    init();
    if (this.background1.x <= -window.innerWidth / 2) {
        this.background1.x = this.background2.x + window.innerWidth;
    }

    if (this.background2.x <= -window.innerWidth / 2) {
        this.background2.x = this.background1.x + window.innerWidth;
    }

    if (bird.y > window.innerHeight || bird.y < 0) {
        gameOver(this.sceneReference);
    }

    this.physics.overlap(bird, pipes, function () {
        gameOver(this.sceneReference);
    }, null, this);

    pipes.getChildren().forEach(pipe => {
            if (bird.x > pipe.x && !pipe.passed) {
                pipe.passed = true;
                increaseScore();
            }
        });

}

function increaseScore() {
 if (isgameOver) {
        return; // Don't update the game if it's over
    }

    score += 1;
    scoreText.setText('Score: ' + score);
}

function init() {
    // Retrieve high score from localStorage or default to 0
    highScore = localStorage.getItem('highScore') || 0;
    highScoreText.setText('High Score: ' + highScore);
}

function gameOver(scene) {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreText.setText('High Score:' + highScore);
    }

    isgameOver = true;

    // Show game over text
    gameOverText.visible = true;

    // Set up a click event listener to restart the game
    scene.input.on('pointerdown', function () {
        isgameOver = false;
        score = 0;
        scoreText.setText('Score: ' + score);
        scene.scene.restart();
    });
}


