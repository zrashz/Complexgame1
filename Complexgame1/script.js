let spaceship = document.getElementById('spaceship');
let game = document.getElementById('game');
let scoreDisplay = document.getElementById('score');
let healthDisplay = document.getElementById('health');

let score = 0;
let health = 100;
let meteors = [];
let speed = 2;
let spawnRate = 2000; // Initial meteor spawn rate

document.addEventListener('keydown', moveSpaceship);

function moveSpaceship(e) {
    const left = spaceship.offsetLeft;
    
    if (e.key === 'ArrowLeft' && left > 0) {
        spaceship.style.left = left - 10 + 'px';
    }
    if (e.key === 'ArrowRight' && left < window.innerWidth - spaceship.offsetWidth) {
        spaceship.style.left = left + 10 + 'px';
    }
}

// Create meteors periodically
function spawnMeteor() {
    let meteor = document.createElement('div');
    meteor.classList.add('meteor');
    meteor.style.left = Math.random() * (window.innerWidth - 60) + 'px'; // Random horizontal position
    game.appendChild(meteor);
    meteors.push(meteor);

    // Increase difficulty over time
    speed += 0.1;
    spawnRate -= 100;
    if (spawnRate < 500) spawnRate = 500;
}

// Move meteors and check for collisions
function moveMeteors() {
    meteors.forEach(meteor => {
        let top = parseFloat(window.getComputedStyle(meteor).top);
        meteor.style.top = top + speed + 'px';

        if (collisionDetected(spaceship, meteor)) {
            resetMeteor(meteor);
            decreaseHealth();
        }

        // Remove meteors that go off the screen
        if (top > window.innerHeight) {
            resetMeteor(meteor);
            score += 10;
            updateScore();
        }
    });
}

// Reset meteor to the top with random horizontal position
function resetMeteor(meteor) {
    meteor.style.top = '-60px';
    meteor.style.left = Math.random() * (window.innerWidth - 60) + 'px';
}

function decreaseHealth() {
    health -= 10;
    healthDisplay.textContent = 'Health: ' + health;
    if (health <= 0) {
        gameOver();
    }
}

function updateScore() {
    scoreDisplay.textContent = 'Score: ' + score;
}

function collisionDetected(spaceship, meteor) {
    const spaceshipRect = spaceship.getBoundingClientRect();
    const meteorRect = meteor.getBoundingClientRect();
    return !(
        spaceshipRect.bottom < meteorRect.top ||
        spaceshipRect.top > meteorRect.bottom ||
        spaceshipRect.right < meteorRect.left ||
        spaceshipRect.left > meteorRect.right
    );
}

function gameOver() {
    alert('Game Over! Your Score: ' + score);
    document.location.reload();
}

// Game loop
setInterval(spawnMeteor, spawnRate);
function gameLoop() {
    moveMeteors();
    requestAnimationFrame(gameLoop);
}
gameLoop();
