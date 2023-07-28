// Check that script is connected
// console.log('App is connected');



////////////////////////
// p5.js TYPING GAME
////////////////////////
// DAILY PROGRESS 
// COMMENTS AT BOTTOM OF CODE



///// GLOBAL GAME VARIABLES /////
let guessItem = ""; // '' is an anti-string

let interval = 75;
// TO ADJUST SPEED OF "ROUNDS", LIKE A DIFFICULTY SETTING (HIGHER IS SLOWER)

let results = []; // empty array
// RESULTS VARIABLE TO STORE SCORE

let solution = null;
// anti value, so that background only changes when the key is pressed
// SOLUTION VARIABLE STORES THE NUMBER PRESSED

let gameOver = false;
// BY DEFAULT, GAME ON



///// GLOBAL COLOR VARIABLES: From Wada Sanzo /////
// https://sanzo-wada.dmbk.io
// https://p5js.org/reference/#/p5/fill
const grenadinePink = [255, 97, 107]; // ARRAY
const deepIndigo = [0, 8, 49]; // ARRAY
const etruscanRed = [201, 48, 62]; // ARRAY

////// RANDOM COLOR //////
///// THIS IS AN OBJECT /////
const col = {
  r: 0,
  g: 0,
  b: 0,
};

///// THIS IS AN ARRAY /////
const randomColArray = [
  (col.r = Math.floor(Math.random() * 256)),
  (col.g = Math.floor(Math.random() * 256)),
  (col.b = Math.floor(Math.random() * 256)),
];

////// RANDOM COLOR /////
const randomCol = [col.r, col.g, col.b];
// console.log(randomCol);

function setup() {
  createCanvas(800, 400);
}

function draw() {
  // console.log(results) // counts number of 'hits' and 'misses'

  let finalScore = getScore(results); // store the total score in a variable
  //console.log(finalScore)

  if (finalScore.loss === 3 || finalScore.total === 10) {
    gameOver = true
    // Game is over after three bad matches or 10 key presses
    
    // Needs to be in the conditional that checks for 'Game Over'
    showGameOver(finalScore); // score will be shown on the 'Game Over' screen
    return;
    // Also needs to be called AFTER finalScore is calculated, so that the score can be shown
  }
  // A game ends if you 'miss' 3 matches, or if you guess 10 times.

  background(deepIndigo);

  ///// IF STATEMENT TO GENERATE A RANDOM NUMBER PER CHOSEN FRAME COUNT ////
  if (frameCount === 1 || frameCount % interval === 0) {
    // EVERY interval of FRAMES, GENERATE A NEW RANDOM NUMBER
    // frameCount === 1 || =>
    // WILL also generate a random number for the first 'interval' frames

    solution = null;
    // DISALLOWS a second key press, but needs a conditional so that
    // We still render a number, and guessItem isn't destroyed

    // INSTANTIATE GuessItem
    // CENTER with width/2, height/2
    // USING scl HERE IS EASIER THAN textSize() FUNCTION
    guessItem = new GuessItem(width / 2, height / 2, 1); // ARGS: x, y, scl
    //console.log(GuessItem)
  }

  ////// ONLY RENDER guessItem IF IT EXISTS
  if (guessItem) {
    guessItem.render();
  }

  // TEXT PROPERTIES
  textSize(48);
  // TEXT CONTENT
  // ONLY CALL guessItem, IF IT EXISTS
  if (guessItem) {
    guessItem.render();
  }

  // CHANGE BACKGROUND IF THE CORRECT NUMBER IS PRESSED, OR INCORRECT
  if (solution === true) {
    background(randomCol); // TRUE GENERATES A RANDOM COLOR
  } else if (solution === false) {
    background(etruscanRed); // FALSE GENERATES ETRUSCAN RED
  }
}

///// USER INTERACTION /////

///// HIT OR MISS FEEDBACK MESSAGES /////
// RECEIVES INPUT FROM 'HIT' OR 'MISS' CACHE
function scoreMsg (solution){
  // MESSAGE ARRAYS //
  let hitMsgs = [
    `NICE SHOT!`,
    `YOU'RE ON FIRE!`,
    `CHA-CHING!`,
    `BOOM!`,
    `GOAT TYPER!`,
    `GET IT!`,
  ]
  let missMsgs = [
    `ALMOST!`,
    `YOU GOT THIS!`,
    `BE THE NUM!`,
    `DANG!`,
    `NOPE...`,
    `GRRR!`,
  ]
  
  let msgs;
  
  push() // push() and pop() used around this block for translate() p5.js positioning
  textAlign(CENTER, CENTER)
  
  // CONDITIONAL FOR MESSAGE DISPLAY (FROM HIT/MISS ARRAYS)
  if (solution === true) {
    msgs = hitMsgs
  } else if (solution === false) {
    msgs = missMsgs
  }
  
  translate(width/2, height/2) // Centers text, along with push() & pop()
  text(msgs[parseInt(random(msgs.length), 10)], 0, 0)
  pop()
  // p5js random() function generates a random value using the length Array method
  // need to use parseInt, otherwise the value will contain decimals
  // msgs[] is what we need instead of dot notation to access this randomly.
  // and won't grab from the array
  
}
///// GAME OVER SCREEN /////
function showGameOver(score) {
  push(); // needed when positioning using translate()
  background(grenadinePink);
  // PROPERTIES
  textAlign(CENTER, CENTER);
  fill(deepIndigo);
  textSize(36);
  // OUTPUT
  // GAME OVER
  translate(width / 2, height / 2); // places this in the middle of the screen
  text(`GAME OVER!`, 0, 0); // 0 when positioning using translate

  // MATCHES
  textSize(18);
  translate(0, 35); // places this in the middle of the screen
  text(`You matched ${score.win} times!`, 0, 0); // Display stored true matches

  // RESTART TEXT
  // map() maps between a given min and max (0, 255)
  // here using it with sin function (range of -1 to 1)
  // to oscillate between 0-255 opacity
  // divide frameCount to control blinking rate > lower # is faster
  // need to study this
  let blinkingText = map(sin(frameCount / 20), -1, 1, 0, 255);

  textSize(18);
  fill(0, 8, 49, blinkingText); // Alpha Gets map(sin()) treatment
  translate(0, 70); // places this in the middle of the screen
  text(`PRESS ENTER`, 0, 0); // Display stored true matches
  pop(); // needed when positioning using translate()
}

///// LOG AND STORE RIGHT KEY PRESSES //////
function getScore(score) {
  //// START WITH SCORE OF 0 /////
  let wins = 0;
  let losses = 0;
  let total = score.length; // replace score.length in for loop

  // INCREMENT RIGHT PRESSES
  for (let i = 0; i < total; i++) {
    let item = score[i]; // gets current 'hit' or 'miss'
    if (item === true) {
      wins = wins + 1; // each 'hit' adds to the number of 'hits'
    } else {
      losses = losses + 1; // each 'miss' adds to the number of 'misses'
    }
  }
  ////// OBJECT THAT STORES SCORE & GAMES PLAYED /////
  return { win: wins, loss: losses, total: total };
}

///// RESTART THE GAME //////
function restartGame() {
  results = []; // resets the score counter (anti-array)
  solution = null; // clears the solution variable
  gameOver = false; // game is ON
}

///// RECEIVE KEY PRESSES //////
function keyPressed() {
  ///// RESTART GAME CONDITIONAL /////
  // Both items in nested conditional must be evaluate true in order to restart
  // gameOver needs to be displayed
  // ENTER needs to be pressed
  if (gameOver === true) {
    if (keyCode === ENTER) {
    console.log(`ENTER pressed: Restart the Game`)
    restartGame() // Call the restartGame function
    return // leave this function (no more guessing or counting)
    }
  }
  
  

  if (guessItem !== null) {
    console.log(`You pressed the key =>`, key);

    solution = guessItem.solve(key); // stores the key you press
    // disallows a second key input, but destroys guessItem,
    // so need to create a conditional to render guessItem if it exists

    if (solution) {
      results.push(true);
    } else {
      results.push(false);
    }
    // stores the times user got the right solution.

    guessItem = null;
  } else {
    console.log(`Nothing to match with`);
  }
}

///// CONTSTRUCTOR FUNCTION USED FOR GUESSING /////
// arguments for x position, y position, and scale
// Save arguments in the object with this
// IF PLAYER PRESSES A KEY, SOMETHING HAPPENS: e.g. CHECK SOLVE METHOD ON guessItem
// TRUE OR FALSE IF THERE IS A MATCH

function GuessItem(x, y, scl) {
  this.x = x;
  this.y = y;
  this.scale = scl;
  // TO GROW UNTIL A NEW INTEGER IS RENDERED
  this.scaleIncrement = 0.35; // Controls scale rate
  // SAVE RANDOMLY GENERATED INTEGER TO OBJECT
  this.alpha = 255;
  this.alphaDecrement = 4; // Controls fade rate
  //
  this.solved;

  this.content = getContent();

  // FUNCTION TO GENERATE A RANDOM INTEGER
  function getContent() {
    return String(parseInt(random(10), 10));
    // need the number to be same as what is logged on keyPress, which is a string
  }

  // SOLVE METHOD TO CHECK IF KEY PRESSED MATCHES NUMBER GENERATED
  this.solve = function (input) {
    // CHECK TO SEE IF input
    console.log(typeof input);
    console.log(typeof this.content);
    if (input === this.content) {
      this.solved = true;
    } else {
      this.solved = false;
    }
    return this.solved; // every time you press a key, the number is saved to 'solution'
  };

  // METHOD TO DISPLAY THE RANDOM INTEGER
  this.render = function () {
    // IF KEY DOESN'T MATCH NUMBER, DON'T RENDER ANYTHING
    if (this.solved === false) {
      return;
    } else {
    }
    // translate() FUNCTION for positioning, width/2, height/2 in the new instance
    // translate requires push() and pop() to have translate state changes
    // not affect anything that comes after the object
    push();

    // TEXT PROPERTIES
    textAlign(CENTER, CENTER); // guessItem object needs to be centered
    fill(255, 97, 107, this.alpha); // need to fix fade
    translate(this.x, this.y);
    scale(this.scale); // needs to be applied AFTER translate
    text(this.content, 0, 0);
    // TEXT GROWS EVERY TIME IT GETS RENDERED BY scaleIncrement
    this.scale = this.scale + this.scaleIncrement;
    // TEXT FADES EVERY TIME IT GETS RENDERED BY alphaDecrement
    this.alpha = this.alpha - this.alphaDecrement;
    pop();
  };
  // console.log(this.render)
}





// 7/25 PM
// FIGMA WIREFRAME // 
// https://www.figma.com/file/SrXO2VK3EPpqCB1WxtARhf/p5.js-Game?type=whiteboard&node-id=129-420&t=mSykA24IbvEJqwEC-0



// 7/25 AM to lunch
// TUTORIAL PROGRESS, NOTES, & SKETCHES // 
// FROM: 
// https://www.linkedin.com/learning/coding-for-visual-learners-learning-javascript-from-scratch-16124466?u=116852650

// CHAPTERRS 1-2 - Setting up a sketch, color
// https://editor.p5js.org/andrewdoak/sketches/CF2TUko9u

// CHAPTER 3 - Operators and variables
// Created shapes and animated them using variables, REFACTORED code with variables
// https://editor.p5js.org/andrewdoak/sketches/T0-KJyPTa

// CHAPTER 4 - Conditional Statements and Comparison Operators
// Learned how to use conditionals and nested conditionals to limit and manipulate animation
// https://editor.p5js.org/andrewdoak/sketches/Cgd11uJpX


// 7/25 PM after lunch - ROADMAP
// Finish Tutorial "Class"
// Work on creating a basic Tic Tac Toe in p5 (my Backup)
// STRETCH: get some boilerplate HTML/CSS and 'publish' either Tic Tac Toe, or a sketch to GitHub pages (I have learned how to do this, as well as how to publish the sketch on a site)

// CHAPTER 5 - Mouse events
// Change background color when mouse is pressed
// Create a 'Drawing" program that follow the mouse x and y position and responds visually to speed change
// https://editor.p5js.org/andrewdoak/sketches/hefGm-1G9

// CHAPTER 6 - Loops
// Create a variable that controls circle diameter. Create a for loop that iterates over the horizontal axis with circles, then the vertical axis to result in the whole screen being filled with circles (spaced and distributed evenly across the canvas)
// https://editor.p5js.org/andrewdoak/sketches/wPNx5QPV4

// CHAPTER 6, SECTION C - Loops (random() function)
// Use the random() p5.js function to create variables that continuously genertate three different random numbers that get animated onto the screen. Create a variable to position the numbers vertically. Change the frame rate so that the numbers are not being displayed too quickly to see.
// https://editor.p5js.org/andrewdoak/sketches/eWVkl3NRw

// CHAPTER 6, SECTION D  -  Loops (noise() function)  Circles
// Learn about noise function creating random values with smoother transitions. First, animate circles with random() function, a frenetic look. Then observe the very different (breathing-, wave-like) effect when using the noise() function.
// https://editor.p5js.org/andrewdoak/sketches/wXY95NI3i

// 7/26 PM (Post-PD Class) - ROADMAP
// Finish Tutorial "Class" (MODULES 7-12)
// Work on creating a basic Tic Tac Toe in p5 (my Backup)
// STRETCH: get some boilerplate HTML/CSS and 'publish' either Tic Tac Toe, or a sketch to GitHub pages (I have learned how to do this, as well as how to publish the sketch on a site)

// 7/27 PM, Part 1
// WORKING KEYBOARD MATCHING GAME (in p5.js Editor)
// Worked on Tic Tac Toe (backup) early AM through first hour of class
// Pivoted to Number game for stretch learning and go for broke
// Working typing game minus a few UI features that I felt actually detracted, and were too advanced
// https://editor.p5js.org/andrewdoak/sketches/3BBWiGMjf

// 7/27 PM, Part 2
// DOWNLOAD p5.js project directory
// Integrate with existing project directory
// Transfer daily progress comments to typing-game.js
// Update HTML link to script after renaming sketch.js to typing-game.js