const height = 40;
const width = 50;
const snake = [5, 4, 3, 2, 1, 0];
let head = snake[0];
let isGameOver = false;
let direction = "left";
let interval;
let random;
let timerInterval;
let remainingTime = 60;
let score = 0;
let isSoundEnabled = true;
let lastOrangeEatenTime = 0;
const rightBoundaries = [];
const leftBoundaries = [];
let snakeSpeed = 500;

const timerDisplay = document.getElementById("timer");
const modal = document.getElementById("modal");
const modalButtons = modal.querySelectorAll("button");
const scoreDisplay = document.getElementById("score");
const soundToggle = document.getElementById("sound-toggle");
const bestScoreDisplay = document.getElementById("best-score");
const storedBestScore = localStorage.getItem("bestScore") || 0;
bestScoreDisplay.textContent = `Best Score: ${storedBestScore}`;

soundToggle.addEventListener("click", () => {
  isSoundEnabled = !isSoundEnabled;
  updateSoundToggleText();
});

modalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const difficulty = button.id.replace("-button", "");
    startGame(difficulty);
  });
});

window.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth <= 480) {
    alert(
      "Sorry the controls for this game is not suited for mobile yet... please switch to a bigger device "
    );
  }
});

function updateSoundToggleText() {
  soundToggle.textContent = isSoundEnabled ? "Sound: On" : "Sound: Off";
}

for (let i = 0; i < height; i++) {
  rightBoundaries.push(i * width - 1);
}

for (let i = 1; i <= height; i++) {
  leftBoundaries.push(i * width);
}

const board = document.querySelector(".board");
board.style.gridTemplateColumns = `repeat(${width}, 1fr)`;

function createBoard() {
  for (let i = 0; i < width * height; i++) {
    const div = document.createElement("div");
    board.appendChild(div);
  }
  updateSoundToggleText();
  color();

  setRandom();
}

function startClock() {
  if (!timerInterval) {
    timerInterval = setInterval(updateTimer, 1000);
  }
}

function updateTimer() {
  remainingTime--;

  if (remainingTime <= 0) {
    clearInterval(timerInterval);
    timerDisplay.textContent = "0:00";
    gameOver();
    return;
  }

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function color() {
  const divs = board.querySelectorAll("div");

  divs.forEach((el) =>
    el.classList.remove("snake", "head", "up", "right", "down", "left")
  );

  snake.forEach((num) => divs[num].classList.add("snake"));

  divs[head].classList.add("head", direction);
}

window.addEventListener("keydown", (ev) => {
  ev.preventDefault();
  startClock();

  switch (ev.key) {
    case "ArrowUp":
      move("up");

      break;
    case "ArrowRight":
      move("right");
      break;
    case "ArrowDown":
      move("down");
      break;
    case "ArrowLeft":
      move("left");
      break;
    case "Escape":
      break;
  }
  startClock();
});

function move(dir) {
  if (isGameOver) {
    return;
  }

  const divs = board.querySelectorAll("div");

  if (dir == "up") {
    if (direction == "down") {
      return;
    }

    head -= width;

    if (!divs[head]) {
      gameOver();
      return;
    }
  } else if (dir == "right") {
    if (direction == "left") {
      return;
    }

    head--;

    if (rightBoundaries.includes(head)) {
      gameOver();
      return;
    }
  } else if (dir == "down") {
    if (direction == "up") {
      return;
    }

    head += width;

    if (!divs[head]) {
      gameOver();
      return;
    }
  } else if (dir == "left") {
    if (direction == "right") {
      return;
    }

    head++;

    if (leftBoundaries.includes(head)) {
      gameOver();
      return;
    }
  }

  if (snake.includes(head)) {
    gameOver();
    return;
  }

  direction = dir;
  snake.unshift(head);

  if (random == head) {
    const isOrange = divs[random].classList.contains("orange"); //added

    if (isSoundEnabled) {
      const audio = document.createElement("audio");
      audio.src = "Pebble.ogg";
      audio.volume = 0.2;
      audio.play();
    }

    if (isOrange) {
      updateScore(20);
      lastOrangeEatenTime = new Date().getTime();
    } else {
      updateScore(10);
    }

    setRandom();
  } else {
    snake.pop();
  }

  color();
  startAuto();
}

function startAuto() {
  clearInterval(interval);
  interval = setInterval(() => move(direction), snakeSpeed);
}

function setRandom() {
  random = Math.floor(Math.random() * (width * height));

  if (snake.includes(random)) {
    setRandom();
  } else {
    const divs = board.querySelectorAll("div");

    divs.forEach((el) => el.classList.remove("blueberry", "orange"));
    const currentTime = new Date().getTime();
    const elapsedTimeSinceLastOrange =
      (currentTime - lastOrangeEatenTime) / 1000;

    if (elapsedTimeSinceLastOrange < 30 || Math.random() >= 0.1) {
      divs[random].classList.add("blueberry");
    } else {
      divs[random].classList.add("orange");
    }
  }
}

function gameOver() {
  isGameOver = true;
  clearInterval(interval);
  clearInterval(timerInterval);

  if (isSoundEnabled) {
    const audio = document.createElement("audio");
    audio.src = "Country_Blues.ogg";
    audio.volume = 0.1;
    audio.play();
  }

  setTimeout(() => {
    alert(`Game over\nFinal Score: ${score}`);
    location.reload();
  }, 200);
}

function updateScore(points) {
  score += points;
  scoreDisplay.textContent = `Score: ${score}`;

  remainingTime += 10;

  const storedBestScore = localStorage.getItem("bestScore") || 0;
  if (score > storedBestScore) {
    localStorage.setItem("bestScore", score);
    bestScoreDisplay.textContent = `Best Score: ${score}`;
  }
}

function startGame(difficulty) {
  let snakeSpeed, initialTime;

  if (difficulty === "easy") {
    snakeSpeed = 500;
    initialTime = 60;
    modal.style.display = "none";
  } else if (difficulty === "normal") {
    snakeSpeed = 100;
    initialTime = 40;
    modal.style.display = "none";
  } else if (difficulty === "hard") {
    snakeSpeed = 50;
    initialTime = 20;
    modal.style.display = "none";
  }

  snakeInterval = setInterval(() => move(direction), snakeSpeed);
  remainingTime = initialTime;
  timerDisplay.textContent = `${Math.floor(initialTime / 60)}:${
    initialTime % 60
  }`;

  // document.getElementById("difficulty-selection").style.display = "none";

  startAuto(snakeSpeed);
  startClock();
}
