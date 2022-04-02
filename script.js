/* If you're feeling fancy you can add interactivity
    to your site with Javascript */
// global constants
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var cluePauseTime = 333; //how long to pause in between clues
var nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [[], [], [], [], [], [], [], [], []];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //must be between 0.0 and 1.0
var guessCounter = 0;
var buttons = 4;
var maxButtons = 8;
var failures = 0;
var timeLeft = 5;
var intId;
var maxTime = 11;
var flag = true;
var arrayLength = 8;
var maxScore = 0;
clearInterval(intId);
console.log("reset timer");


var successAudio = new Audio(
  "https://cdn.glitch.global/7230c3e6-6cf3-4e3f-860b-54d175c8d88e/Y2Mate.is%20-%20Victory%20sound%20effect-xP1b_uRx5x4-160k-1645867252848.mp3?v=1648775919212"
);
var failureAudio = new Audio(
  "https://cdn.glitch.global/7230c3e6-6cf3-4e3f-860b-54d175c8d88e/Y2Mate.is%20-%20Sad%20Trombone%20-%20Gaming%20Sound%20Effect%20(HD)-CQeezCdF4mk-128k-1647094294469.mp3?v=1648776065147"
);

function startGame() {
  //initialize game variables
  flag = true;
  // set the waiting times back to the default
  clueHoldTime = 1000; //how long to hold each clue's light/sound
  cluePauseTime = 333;

  // fill the played pattern with random numbers between 1 and # of buttons
  pattern[buttons] = [];
  for (let i = 0; i < arrayLength; i++) {
    pattern[buttons].push(Math.floor(Math.random() * buttons) + 1);
  }

  progress = 0;

  gamePlaying = true;
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");

  failures = 0;
  adjustTries();
}

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function totalLoss(btn) {
  // combines all functions related to losing in one drive function

  // stop the Countdown
  clearInterval(intId);

  // Dark Souls image & sound
  lostSound();
  lostImage(btn);

  setTimeout(loseGame, 100);

  // set values to default
  failures = 0;
  adjustTries();

  progress = 0;
  updateCurrent();
}

function countDown() {
  // together with setInterval, counts down the time
  timeLeft -= 1;
  document.getElementById("count").innerHTML = timeLeft;

  // if no time left, lose()
  if (timeLeft == 0 || gamePlaying == false) {
    clearInterval(intId);
    totalLoss(1);
  }
}


function playClueSequence() {
  timeLeft = maxTime;
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log(
      "play single clue: " + pattern[buttons][i] + " in " + delay + "ms"
    );
    setTimeout(playSingleClue, delay, pattern[buttons][i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;

    cluePauseTime = cluePauseTime / 1.05; // decrease waiting time by 5% every iteration
    clueHoldTime = clueHoldTime / 1.05;
  }

  // having a flag ensures that we have only one setInterval running at once
  if (flag == true || gamePlaying == false) {
    window.intId = window.setInterval(countDown, 1000);
  }
  flag = false;
}


function loseGame() {
  window.clearInterval(intId);
  stopGame();
  alert("GAME OVER!!!");

  timeLeft = maxTime;
  document.getElementById("count").innerHTML = timeLeft;
}

function winGame() {
  window.clearInterval(intId);

  // update max score
  maxScore = pattern[buttons].length;

  stopGame();
  alert("YOU HAVE WON!!!");

  // reset variables
  progress = 0;
  updateCurrent();
  timeLeft = maxTime;
  document.getElementById("count").innerHTML = timeLeft;
  arrayLength++;
}

function guess(btn) {
  console.log("user guessed: " + btn);

  if (!gamePlaying) {
    return;
  }

  // if guessed right:
  if (btn == pattern[buttons][guessCounter]) {

    // reset the timer
    timeLeft = maxTime;

    // if if we ended the running sequence:
    if (guessCounter == progress) {

      // if we finished the pattern:
      if (guessCounter == pattern[buttons].length - 1) {

        progress++;
        if (progress > maxScore) {
          maxScore = progress;
          updateMax();
        }
        // GTA San Andreas image & sound effects
        winSound();
        winImage(btn);

        setTimeout(winGame, 100);

        // reset variables
        failures = 0;
        adjustTries();
      }
      else {
        progress++;
        updateCurrent();

        if (progress > maxScore) {
          maxScore = progress;
          updateMax();
        }

        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  } else {
    // adjust # of failures
    failures += 1;
    adjustTries();

    // if the user did 3 mistakes, terminate the game and reset the values
    if (failures == 3) {
      totalLoss(btn);
    }
  }
}


function adjustButtonDown() {
  // adjusts the number of playing buttons
  if (buttons > 3) {
    if (buttons == 8) {
      document.getElementById("incBut").classList.remove("maxed");
    }

    buttons--;
    document.getElementById("buttonCounter").innerHTML = buttons;
    console.log("Buttons: " + buttons);

    changeButtons();
  } else {
    document.getElementById("decBut").classList.add("maxed");
  }
}

function adjustButtonUp() {
  // adjusts the number of playing buttons
  if (buttons < 8) {
    if (buttons == 3) {
      document.getElementById("decBut").classList.remove("maxed");
    }

    buttons++;
    document.getElementById("buttonCounter").innerHTML = buttons;
    console.log("Buttons: " + buttons);

    changeButtons();
  } else {
    document.getElementById("incBut").classList.add("maxed");
  }
}

function changeButtons() {
  for (let i = 1; i <= buttons; i++) {
    document.getElementById("button" + i).classList.remove("hidden");
  }
  for (let i = buttons + 1; i <= maxButtons; i++) {
    document.getElementById("button" + i).classList.add("hidden");
  }
}

function adjustTries() {
  document.getElementById("tries").innerHTML = 3 - failures;
}

function lostImage(btn) {
  document.getElementById("button" + btn).style.backgroundImage =
    "url('https://cdn.glitch.global/7230c3e6-6cf3-4e3f-860b-54d175c8d88e/istockphoto-1182313635-612x612.png?v=1648776371131')";
  setTimeout(restoreImage, 1000, btn);
}

function lostSound() {
  failureAudio.play();
}

function winImage(btn) {
  document.getElementById("button" + btn).style.backgroundImage =
    "url('https://cdn.glitch.global/7230c3e6-6cf3-4e3f-860b-54d175c8d88e/360_F_312815843_CdVm05kiBenU3YmChP1KRIzcblRgTQFV.png?v=1648776446429')";
  setTimeout(restoreImage, 1000, btn);
}

function winSound() {
  successAudio.play();
}

function restoreImage(btn) {
  document.getElementById("button" + btn).style.backgroundImage = "none";
}

// Sound Synthesis Functions
const freqMap = {
  1: 250,
  2: 300,
  3: 350,
  4: 400,
  5: 450,
  6: 200,
  7: 175
}
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume()
  tonePlaying = true;
  setTimeout(function() {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

function adjustPatternDown() {
  if (arrayLength > 4) {
    if (arrayLength == 16) {
      document.getElementById("incPat").classList.remove("maxed");
    }

    arrayLength--;
    document.getElementById("patternCounter").innerHTML = arrayLength;
    console.log("arrayLength: " + arrayLength);
  } else {
    document.getElementById("decPat").classList.add("maxed");
  }
}

function adjustPatternUp() {
  if (arrayLength < 16) {
    if (arrayLength == 4) {
      document.getElementById("decPat").classList.remove("maxed");
    }

    arrayLength++;
    document.getElementById("patternCounter").innerHTML = arrayLength;
    console.log("arrayLength: " + arrayLength);
  } else {
    document.getElementById("incPat").classList.add("maxed");
  }
}

function updateMax() {
  document.getElementById("maxScore").innerHTML = maxScore;
}

function updateCurrent() {
  document.getElementById("currentScore").innerHTML = progress;
}
