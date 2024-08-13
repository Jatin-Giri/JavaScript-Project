// Define HTML element
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo'); 
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

//Define Game variables
const gridSize = 20;
let snake = [{x:10,y:10}];
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gamestarted = false;
let highScore = 0;

//Draw game map
function draw(){
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

//draw Snake
function drawSnake(){
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div','snake');
        setPostion(snakeElement, segment);
        board.appendChild(snakeElement); 
    });
}

//Create a snake or food cube/div
function createGameElement(tag, className){
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// set the position of the snake or food
function setPostion(element, position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

//Testing Draw Function
// draw();

//Draw  food function 
function drawFood(){
    if(gamestarted){
    const foodElement = createGameElement('div','food');
    setPostion(foodElement, food);
    board.appendChild(foodElement);
    }
}

//Generate Food
function generateFood(){
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x,y};
}

//Moving the Snake
function move(){
    const head = {...snake[0]};
    switch(direction){
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    snake.unshift(head);
    // snake.pop();
    if(head.x === food.x && head.y === food.y){
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); //clear path interval
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    }else{
        snake.pop();
    }
}

//Test Moving 
// setInterval(() => {
//     move(); //move first
//     draw(); // draw new position
// },200);

//Start game Function


function startGame(){
    gamestarted = true; //keep track of a running game.
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay)
}
 // keypress event Listener
 function handlekeyPress(event){
    if(
        (!gamestarted && event.code === 'Space') || 
        (!gamestarted && event.key === ' ')
        ){
        startGame();
    }
    else{
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
 } 

 document.addEventListener('keydown', handlekeyPress);

 function increaseSpeed(){
    // console.log(gameSpeedDelay);

    if(gameSpeedDelay > 150){
        gameSpeedDelay -= 5;
    }
    else if(gameSpeedDelay > 100){
        gameSpeedDelay -= 3;
    }
    else if(gameSpeedDelay > 50){
        gameSpeedDelay -= 2;
    }
    else if(gameSpeedDelay > 25){
        gameSpeedDelay -= 1;
    }
 }

 function checkCollision(){
    const  head = snake[0];

    if(
        (head.x < 1 || head.x > gridSize) || 
        (head.y < 1 || head.y > gridSize)
        ){
            resetGame();
        }
    for(let i = 1; i < snake.length; i++){
        if((head.x === snake[i].x) && (head.y === snake[i].y)){
            resetGame();
        }
    }
 }

 function resetGame(){
     updateHighScore();  //for early reset
     stopGame();
    snake = [{x:10, y:10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
 }

 function updateScore(){
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3,'0');
 }

 function stopGame(){
    clearInterval(gameInterval);
    gamestarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
 }

 function updateHighScore(){
    const currentScore = snake.length - 1;
    if(currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
 }