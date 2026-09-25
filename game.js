// =========================================================
// TRUE BLUE - game logic
// Tap the creatures that are true blue. Leave the others alone!
// =========================================================


// ---------- 1. SETTINGS (try changing these!) ----------

const GAME_LENGTH = 45;              // how many seconds a game lasts

const BLUE_THINGS = ["🐟", "🐳", "🐬", "🐋"];      // tap these: +1
const NOT_BLUE_THINGS = ["🦀", "🐙", "🐡", "🦞"];  // don't tap: -2
const DIAMOND = "💎";                              // rare bonus: +3

const DIAMOND_CHANCE = 0.08;         // 8% of creatures are diamonds
const NOT_BLUE_CHANCE = 0.3;         // 30% of creatures are NOT blue

const SLOWEST_SHOW_TIME = 1200;      // ms a creature stays up at the start
const FASTEST_SHOW_TIME = 550;       // ms a creature stays up at top speed
const SPEED_UP_PER_POINT = 25;       // ms faster for every point you score

const CONFETTI_COLORS = ["#4fc3f7", "#1e88e5", "#0d47a1", "#bbdefb", "#ffffff", "#ffd54f"];


// ---------- 2. GRABBING THINGS FROM THE PAGE ----------

const game = document.querySelector("#game");
const waves = document.querySelectorAll(".wave");
const scoreText = document.querySelector("#score");
const bestText = document.querySelector("#best");
const timeText = document.querySelector("#time");
const timeBar = document.querySelector("#timebar-fill");

const startScreen = document.querySelector("#start-screen");
const overScreen = document.querySelector("#over-screen");
const startButton = document.querySelector("#start-button");
const againButton = document.querySelector("#again-button");
const finalScoreText = document.querySelector("#final-score");
const newBestText = document.querySelector("#new-best");


// ---------- 3. GAME STATE (things that change while playing) ----------

let score = 0;
let timeLeft = GAME_LENGTH;
let isPlaying = false;
let bestScore = loadBestScore();

let countdownTimer = null;   // the timer that ticks every second
let creatureTimer = null;    // the timer that pops up the next creature

bestText.textContent = bestScore;


// ---------- 4. FUNCTIONS ----------

// Starts a brand new game
function startGame() {
  score = 0;
  timeLeft = GAME_LENGTH;
  isPlaying = true;

  scoreText.textContent = score;
  timeText.textContent = timeLeft;
  timeBar.style.width = "100%";
  timeBar.classList.remove("hurry");

  startScreen.classList.add("hidden");
  overScreen.classList.add("hidden");

  // Run tick() once every 1000 milliseconds (1 second)
  countdownTimer = setInterval(tick, 1000);
  showRandomCreature();
}

// Runs once every second to count down the clock
function tick() {
  timeLeft = timeLeft - 1;
  timeText.textContent = timeLeft;
  timeBar.style.width = (timeLeft / GAME_LENGTH) * 100 + "%";

  if (timeLeft <= 5) {
    timeBar.classList.add("hurry");
  }

  if (timeLeft <= 0) {
    endGame();
  }
}

// Picks a random item from a list
function pickRandom(list) {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

// Makes a random creature pop up out of a random empty wave
function showRandomCreature() {
  if (!isPlaying) {
    return;
  }

  // Only pick waves that don't already have a creature in them
  const emptyWaves = [];
  for (const wave of waves) {
    if (!wave.classList.contains("up")) {
      emptyWaves.push(wave);
    }
  }

  // The faster you score, the faster creatures hide again
  let showTime = SLOWEST_SHOW_TIME - score * SPEED_UP_PER_POINT;
  if (showTime < FASTEST_SHOW_TIME) {
    showTime = FASTEST_SHOW_TIME;
  }

  if (emptyWaves.length > 0) {
    const wave = pickRandom(emptyWaves);
    const creature = wave.querySelector(".creature");

    // Roll a random number from 0 to 1 to decide what pops up
    const roll = Math.random();
    if (roll < DIAMOND_CHANCE) {
      wave.dataset.kind = "diamond";
      creature.textContent = DIAMOND;
    } else if (roll < DIAMOND_CHANCE + NOT_BLUE_CHANCE) {
      wave.dataset.kind = "notBlue";
      creature.textContent = pickRandom(NOT_BLUE_THINGS);
    } else {
      wave.dataset.kind = "blue";
      creature.textContent = pickRandom(BLUE_THINGS);
    }

    // Adding the "up" class makes it slide up (see style.css)
    wave.classList.add("up");

    // After showTime, slide it back down
    wave.hideTimer = setTimeout(function () {
      wave.classList.remove("up");
    }, showTime);
  }

  // Schedule the next creature a little before this one hides
  creatureTimer = setTimeout(showRandomCreature, showTime * 0.6);
}

// Runs when the player taps a wave
function tapWave(wave) {
  // Ignore taps on empty water, or when the game isn't running
  if (!isPlaying || !wave.classList.contains("up")) {
    return;
  }

  // Hide the creature now, and cancel its old hide timer
  clearTimeout(wave.hideTimer);
  wave.classList.remove("up");

  const kind = wave.dataset.kind;

  if (kind === "blue") {
    score = score + 1;
    showFloatingText(wave, "+1", "good");
    flashWave(wave, "caught");
  } else if (kind === "diamond") {
    score = score + 3;
    showFloatingText(wave, "+3", "gold");
    flashWave(wave, "caught");
  } else {
    score = score - 2;
    if (score < 0) {
      score = 0;
    }
    showFloatingText(wave, "−2", "bad");
    flashWave(wave, "oops");
    flashWave(game, "shake");
  }

  scoreText.textContent = score;
}

// Adds a class for a moment (to play an animation), then removes it
function flashWave(element, className) {
  element.classList.add(className);
  setTimeout(function () {
    element.classList.remove(className);
  }, 400);
}

// Shows "+1" or "-2" floating up out of a wave
function showFloatingText(wave, text, colorClass) {
  const floater = document.createElement("div");
  floater.textContent = text;
  floater.classList.add("float-text", colorClass);
  wave.appendChild(floater);

  // Remove it once its animation is done
  setTimeout(function () {
    floater.remove();
  }, 800);
}

// Stops the game and shows the Game Over screen
function endGame() {
  isPlaying = false;
  clearInterval(countdownTimer);
  clearTimeout(creatureTimer);

  // Hide every creature
  for (const wave of waves) {
    clearTimeout(wave.hideTimer);
    wave.classList.remove("up");
  }

  finalScoreText.textContent = score;

  // Is it a new best score?
  if (score > bestScore) {
    bestScore = score;
    bestText.textContent = bestScore;
    saveBestScore(bestScore);
    newBestText.classList.remove("hidden");
    celebrate();
  } else {
    newBestText.classList.add("hidden");
  }

  overScreen.classList.remove("hidden");
}

// Blue confetti rains down the screen!
function celebrate() {
  for (let i = 0; i < 120; i++) {
    const piece = document.createElement("div");
    piece.classList.add("confetti");
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = pickRandom(CONFETTI_COLORS);
    piece.style.animationDuration = 2 + Math.random() * 2 + "s";
    piece.style.animationDelay = Math.random() * 0.8 + "s";
    document.body.appendChild(piece);

    // Clean up after it falls off the screen
    setTimeout(function () {
      piece.remove();
    }, 5000);
  }
}

// Loads the best score saved in the browser (0 if there isn't one)
function loadBestScore() {
  try {
    return Number(localStorage.getItem("trueBlueBest")) || 0;
  } catch (error) {
    return 0;   // some browsers block storage; that's OK
  }
}

// Saves the best score in the browser so it's still there next time
function saveBestScore(value) {
  try {
    localStorage.setItem("trueBlueBest", value);
  } catch (error) {
    // storage is blocked; the game still works, it just won't remember
  }
}


// ---------- 5. HOOKING EVERYTHING UP ----------

startButton.addEventListener("click", startGame);
againButton.addEventListener("click", startGame);

for (const wave of waves) {
  wave.addEventListener("click", function () {
    tapWave(wave);
  });
}
