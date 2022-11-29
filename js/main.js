//** Variables */

const GAME_TIME = 5;
let score = 0;
let time = GAME_TIME;
let isPlaying = false;
let words = [];
let timeInterval;
let checkInterval;
let gameOnStatus = false;

const wordDisplay = document.querySelector(".word-display");
const wordInput = document.querySelector(".word-input");
const timeDisplay = document.querySelector(".time-display");
const scoreDisplay = document.querySelector(".score-display");
const buttonDisplay = document.querySelector(".button");

//** Game Initalization */
init();

function init() {
  getWords();
  // To get input data
  // dom.addEventListener("input", fn)  // fn should be function form
  wordInput.addEventListener("input", compareWords);
}

function getWords() {
  buttonChange("Preparing");
  // words = ["Test", "Great", "Wall", "Sun", "Moon", "Earth", "Jupiter"];
  axios
    .get(`https://random-word-api.herokuapp.com/word?number=200`)
    .then((res) => {
      res.data.forEach((word) => {
        if (word.length < 10) words.push(word);
      });
      buttonChange("Start Game");
      // console.log("words.length : ", words.length);
    })
    .catch((err) => {
      console.log(err);
    });
}

// button control
function buttonChange(text) {
  text === "Start Game"
    ? (buttonDisplay.classList.remove("loading"),
      buttonDisplay.removeAttribute("disabled"))
    : (buttonDisplay.classList.add("loading"),
      buttonDisplay.setAttribute("disabled", ""));

  if (text === "Game Over") {
    setTimeout(() => {
      buttonChange("Start Game");
    }, 1500);
  }
  buttonDisplay.innerText = text;
}

// To compare words
function compareWords() {
  if (!isPlaying) return;
  if (wordInput.value.toLowerCase() === wordDisplay.innerText.toLowerCase()) {
    setTimeout(() => {
      score++;
      time = GAME_TIME;
      scoreDisplay.innerText = score;
      timeDisplay.innerText = time;
      wordInput.value = "";
      wordDisplay.innerText = words[randomIndex()];
    }, 150);
  }
}

function randomIndex() {
  return Math.floor(Math.random() * words.length);
}

// To run this app with button (Start Game)
function run() {
  buttonChange("On Gaming");
  wordInput.focus();
  isPlaying = true;
  time = GAME_TIME;
  score = 0;
  scoreDisplay.innerText = score;
  // setInterval(fn, milliSec); // fn should be function form
  timeInterval = setInterval(countDown, 1000);
  checkInterval = setInterval(checkGameOnStatus, 500);
}

// To count down
function countDown() {
  time > 0 ? time-- : (isPlaying = false);
  if (!isPlaying) clearInterval(timeInterval);
  timeDisplay.innerText = time;
  // console.log("countDown");
}

// to check game status
function checkGameOnStatus() {
  time > 0 && isPlaying ? (gameOnStatus = true) : (gameOnStatus = false);
  // console.log("checkGameOnStatus");
  if (!gameOnStatus) {
    clearInterval(checkInterval);
    buttonChange("Game Over");
  }
}
