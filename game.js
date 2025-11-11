const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game Constants
const GRAVITY = 0.5;
const FLAP_VELOCITY = -10;
const PIPE_WIDTH = 80;
const PIPE_SPEED = 3;
const READY_DELAY = 1000;

// Bird size - reduced for better gameplay
const BIRD_WIDTH = 150;
const BIRD_HEIGHT = 150;

// Collision margin to ignore transparent padding around the face (increased to make ellipse smaller)
const COLLISION_MARGIN = {
    top: 0.30,
    bottom: 0.20,
    left: 0.30,
    right: 0.30
};

// Much larger gap to accommodate the bigger bird - at least 3x bird height
const GAP_HEIGHT = Math.max(280, canvas.height * 0.35);

// Game Variables
let gameRunning = false;
let gameOver = false;
let score = 0;
let frame = 0;
let gameStartTime = 0;
let gravityEnabled = false;

// Player (Bird) - Much larger size
const player = {
    x: 150,
    y: canvas.height / 2,
    width: BIRD_WIDTH,
    height: BIRD_HEIGHT,
    velocityY: 0,
    rotation: 0,
    image: new Image(),
    loaded: false
};
// Add cache-busting timestamp to force reload new image
player.image.src = 'character.png?' + new Date().getTime();
player.image.onload = () => {
    player.loaded = true;
};

// Pipes
let pipes = [];
const pipeImage = new Image();
pipeImage.src = 'pillar.jpg';

// Background
const backgroundImage = new Image();
backgroundImage.src = 'shed.png';

// Sound effects
const backgroundMusic = new Audio('dbackground.mp3');
const collisionSound = new Audio('middle.mp3');
const victoryMusic = new Audio('victory_music.mp3');

// Preload audio files
backgroundMusic.preload = 'auto';
collisionSound.preload = 'auto';
victoryMusic.preload = 'auto';

// Loop background music during gameplay
backgroundMusic.loop = true;

// Load collision image with cache-busting
const collisionImage = new Image();
collisionImage.src = 'Collision Image.png?v=' + Date.now() + Math.random();

// Load victory image with cache-busting
const victoryImage = new Image();
victoryImage.src = 'victory.png?v=' + Date.now() + Math.random();

// Event Listeners
function flap() {
    if (!gameRunning && !gameOver) {
        startGame();
        return;
    }
    
    if (gameRunning && !gameOver && gravityEnabled) {
        player.velocityY = FLAP_VELOCITY;
    }
    
    if (gameOver) {
        restartGame();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        flap();
    }
});

canvas.addEventListener('click', flap);
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    flap();
});

function createPipe() {
    // Generous margins to ensure bird can always fit through
    const topMargin = 120;
    const bottomMargin = 120;
    const minGapCenter = topMargin + GAP_HEIGHT / 2;
    const maxGapCenter = canvas.height - bottomMargin - GAP_HEIGHT / 2;
    const gapCenter = Math.random() * (maxGapCenter - minGapCenter) + minGapCenter;
    const gapY = gapCenter - GAP_HEIGHT / 2;
    
    pipes.push({
        x: canvas.width,
        gapY,
        passed: false
    });
}

function update() {
    if (!gameRunning) return;
    
    const timeSinceStart = Date.now() - gameStartTime;
    
    // 1️⃣ Smooth start delay
    if (timeSinceStart < READY_DELAY) {
        gravityEnabled = false;
        player.velocityY = Math.sin((timeSinceStart / READY_DELAY) * Math.PI) * -1; // gentle hover
    } else {
        gravityEnabled = true;
    }
    
    // 2️⃣ Gravity after delay
    if (gravityEnabled) {
        player.velocityY += GRAVITY;
    }
    player.y += player.velocityY;
    
    // 3️⃣ Rotation
    player.rotation = Math.max(-0.5, Math.min(1.2, player.velocityY / 10));
    
    // Ground/cieling
    if (player.y + player.height >= canvas.height) {
        player.y = canvas.height - player.height;
        endGame();
        return;
    }
    if (player.y <= 0) {
        player.y = 0;
        player.velocityY = 0;
    }
    
    // 4️⃣ Pipe spawning - first pipe appears sooner, then regular spacing
    if (frame === 30) createPipe(); // First pipe appears much sooner
    else if (frame > 30 && (frame - 30) % 120 === 0) createPipe();
    
    // 5️⃣ Pipe updates
    for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];
        pipe.x -= PIPE_SPEED;
        
        if (!pipe.passed && pipe.x + PIPE_WIDTH < player.x) {
            pipe.passed = true;
            score++;
            
            // Check for win condition at 23 pipes
            if (score >= 23) {
                winGame();
                return;
            }
        }
        
        if (pipe.x < -PIPE_WIDTH - 50) {
            pipes.splice(i, 1);
            continue;
        }
        
        const topPipeHeight = pipe.gapY;
        const bottomPipeY = pipe.gapY + GAP_HEIGHT;
        const bottomPipeHeight = canvas.height - bottomPipeY;
        
        // Collision detection with margin-adjusted hitbox
        if (isColliding(player.x, player.y, player.width, player.height, pipe.x, 0, PIPE_WIDTH, topPipeHeight) ||
            isColliding(player.x, player.y, player.width, player.height, pipe.x, bottomPipeY, PIPE_WIDTH, bottomPipeHeight)) {
            endGame();
            return;
        }
    }
    
    frame++;
}

function isColliding(x1, y1, w1, h1, x2, y2, w2, h2) {
    // Apply collision margins to player's hitbox (ignore transparent areas)
    const adjX1 = x1 + w1 * COLLISION_MARGIN.left;
    const adjY1 = y1 + h1 * COLLISION_MARGIN.top;
    const adjW1 = w1 - w1 * (COLLISION_MARGIN.left + COLLISION_MARGIN.right);
    const adjH1 = h1 - h1 * (COLLISION_MARGIN.top + COLLISION_MARGIN.bottom);

    return (
        adjX1 < x2 + w2 &&
        adjX1 + adjW1 > x2 &&
        adjY1 < y2 + h2 &&
        adjY1 + adjH1 > y2
    );
}

function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    gameRunning = true;
    gameOver = false;
    score = 0;
    frame = 0;
    pipes = [];
    gravityEnabled = false;
    gameStartTime = Date.now();
    
    player.y = (canvas.height / 2) - (player.height / 2);
    player.velocityY = 0;
    player.rotation = 0;
    
    // Start looping background music
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
    
    gameLoop();
}

function restartGame() {
    document.getElementById('endScreen').classList.remove('show');
    document.getElementById('winScreen').classList.remove('show');
    startGame();
}

function winGame() {
    if (gameOver) return;
    gameRunning = false;
    gameOver = true;
    
    // Stop background music
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    
    // Play victory_music.mp3 for victory
    setTimeout(() => {
        victoryMusic.currentTime = 0;
        victoryMusic.play().catch(err => console.log('Audio play failed:', err));
    }, 100);
    
    // Set the victory image
    const winImage = document.getElementById('winImage');
    winImage.src = victoryImage.src;
    
    document.getElementById('winScreen').classList.add('show');
}

function endGame() {
    if (gameOver) return;
    gameRunning = false;
    gameOver = true;
    
    // Stop background music first and wait a bit
    backgroundMusic.pause();
    
    // Update end screen with score
    const endScreen = document.getElementById('endScreen');
    const endImage = document.getElementById('endImage');
    
    // Set the collision image with cache-busting
    endImage.src = collisionImage.src;
    
    // Play middle.mp3 on collision - with better error handling
    const playCollisionSound = () => {
        collisionSound.currentTime = 0;
        const playPromise = collisionSound.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.log('Audio play failed, retrying...', err);
                setTimeout(() => {
                    collisionSound.play().catch(e => console.log('Retry failed:', e));
                }, 100);
            });
        }
    };
    
    // Small delay to ensure background music stops first
    setTimeout(playCollisionSound, 50);
    
    // Remove existing score display if any
    const existingScore = document.getElementById('endScore');
    if (existingScore) existingScore.remove();
    
    // Create and insert score display below the image
    const scoreDisplay = document.createElement('p');
    scoreDisplay.id = 'endScore';
    scoreDisplay.style.fontSize = '2rem';
    scoreDisplay.style.fontWeight = 'bold';
    scoreDisplay.style.marginBottom = '2rem';
    scoreDisplay.style.color = '#fff';
    scoreDisplay.textContent = 'Raand level - ' + score;
    
    endImage.insertAdjacentElement('afterend', scoreDisplay);
    endScreen.classList.add('show');
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (backgroundImage.complete) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = '#70c5ce';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Pipes
    for (const pipe of pipes) {
        ctx.drawImage(pipeImage, pipe.x, 0, PIPE_WIDTH, pipe.gapY);
        ctx.drawImage(pipeImage, pipe.x, pipe.gapY + GAP_HEIGHT, PIPE_WIDTH, canvas.height - (pipe.gapY + GAP_HEIGHT));
    }
    
    // Bird with rounded corners
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    ctx.rotate(player.rotation);
    if (player.loaded) {
        // Create rounded rectangle clipping path
        const cornerRadius = 30; // Adjust this value for more/less rounding
        const x = -player.width / 2;
        const y = -player.height / 2;
        
        ctx.beginPath();
        ctx.moveTo(x + cornerRadius, y);
        ctx.lineTo(x + player.width - cornerRadius, y);
        ctx.quadraticCurveTo(x + player.width, y, x + player.width, y + cornerRadius);
        ctx.lineTo(x + player.width, y + player.height - cornerRadius);
        ctx.quadraticCurveTo(x + player.width, y + player.height, x + player.width - cornerRadius, y + player.height);
        ctx.lineTo(x + cornerRadius, y + player.height);
        ctx.quadraticCurveTo(x, y + player.height, x, y + player.height - cornerRadius);
        ctx.lineTo(x, y + cornerRadius);
        ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
        ctx.closePath();
        ctx.clip();
        
        ctx.drawImage(player.image, x, y, player.width, player.height);
    }
    ctx.restore();
    
    // Debug: Show elliptical collision hitbox (transparent - no visible outline)
    
    // Raand level (displayed at top left during gameplay)
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 32px Arial';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.textAlign = 'left';
    ctx.strokeText('Raand level: ' + score, 20, 50);
    ctx.fillText('Raand level: ' + score, 20, 50);
}

function gameLoop() {
    if (gameRunning) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    } else if (!gameOver) {
        draw();
    }
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

draw();
