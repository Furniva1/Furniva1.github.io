const words = document.querySelectorAll('.rotating-text .word');
let currentWordIndex = 0;

function rotateWords() {
    words[currentWordIndex].classList.remove('active');
    currentWordIndex = (currentWordIndex + 1) % words.length;
    words[currentWordIndex].classList.add('active');
}
setInterval(rotateWords, 2000);

const plane = document.getElementById("plane");
const building1 = document.getElementById("building1");
const building2 = document.getElementById("building2");
const gameContainer = document.getElementById("game-container");
const startButton = document.getElementById("startButton");
const congratsContainer = document.querySelector(".congrats-container");
const congratsMessage = document.getElementById("congratsMessage");

let planeX = 0;
let planeY = 30;
let resetX = 0;

const originalPlaneWidth = 546;
const originalPlaneHeight = 234;
const newPlaneWidth = 200;
const newPlaneHeight = (newPlaneWidth / originalPlaneWidth) * originalPlaneHeight;

plane.style.width = newPlaneWidth + "px";
plane.style.height = newPlaneHeight + "px";

let containerWidth;
let containerHeight;

let mouseX = 0;
let mouseY = 0;

const pixelsPerInch = 96;
const moveSpeedX = pixelsPerInch * 1.5;
const moveSpeedY = pixelsPerInch * 0.5;

let currentLevel = 1;
let gameStarted = false;

document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

function initializeGame() {
    containerWidth = gameContainer.offsetWidth;
    containerHeight = gameContainer.offsetHeight;

    planeX = 0;
    planeY = 30;

    plane.style.left = planeX + "px";
    plane.style.top = planeY + "px";

    plane.style.visibility = "visible";
    plane.style.backgroundImage = "url('widgets/plane.png')";

    building1.style.display = "none";
    building2.style.display = "none";

    if (currentLevel === 2) {
        building1.style.display = "block";
    } else if (currentLevel === 3) {
        building1.style.display = "block";
    } else if (currentLevel === 4) {
        building2.style.display = "block";
    } else if (currentLevel === 5) {
        building2.style.display = "block";
    }

    resetX = containerWidth;

    gameStarted = true;
    gameLoop();
}

function gameLoop() {
    if (!gameStarted) return;

    planeX += moveSpeedX / 60;

    const targetY = mouseY;
    const smoothFactor = 0.1;
    planeY = planeY + (targetY - planeY) * smoothFactor;

    planeY = Math.max(30, Math.min(planeY, containerHeight - newPlaneHeight - 10));

    plane.style.left = planeX + "px";
    plane.style.top = planeY + "px";

    let building = null;
    if (currentLevel === 2) {
        building = building1;
    } else if (currentLevel === 3) {
        building = building1;
    } else if (currentLevel === 4) {
        building = building2;
    } else if (currentLevel === 5) {
        building = building2;
    }

    if (building) {
        const buildingRect = building.getBoundingClientRect();
        const planeRect = plane.getBoundingClientRect();

        if (checkCollision(buildingRect, planeRect)) {
            handleCollision();
            return;
        }
    }

    if (planeX > containerWidth) {
        planeX = resetX;
        planeY = 30;
        currentLevel++;

        if (currentLevel <= 5) {
            initializeGame();
        } else {
            gameStarted = false;
            plane.style.visibility = "hidden";
            congratsContainer.style.display = "block";
            startButton.style.display = "block";
        }
    }

    requestAnimationFrame(gameLoop);
}

function checkCollision(rect1, rect2) {
    const planeHeight = newPlaneHeight + 10;
    const planeTop = planeY - planeHeight;
    const planeBottom = planeY + newPlaneHeight;

    const buildingTop = rect1.y;
    const buildingBottom = rect1.y + rect1.height;
    const buildingRight = rect1.x + rect1.width;
    const buildingLeft = rect1.x;

    return !(rect2.x + rect2.width < buildingLeft ||
             rect2.x > buildingRight ||
             rect2.y + rect2.height < buildingTop ||
             rect2.y > buildingBottom ||
             (rect2.y < buildingTop && rect2.y > planeTop - 10) ||
             (rect2.y > buildingBottom && rect2.y < planeBottom + 10));
}

function handleCollision() {
    planeX = 0;
    planeY = 30;
    plane.style.backgroundImage = "url('widgets/explosion.png')";
    plane.style.width = "200px";
    plane.style.height = "200px";
    gameStarted = false;
    startButton.style.display = "block";
}

startButton.addEventListener("click", () => {
    currentLevel = 1;
    congratsContainer.style.display = "none";
    startButton.style.display = "none";
    initializeGame();
});

document.addEventListener('DOMContentLoaded', () => {
    containerWidth = gameContainer.offsetWidth;
    containerHeight = gameContainer.offsetHeight;
});
