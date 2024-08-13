//board
let tileSize = 20;
let rows = 30;
let columns = 16;

let board;
let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;
let context;

//Ship
let ShipWidth = tileSize * 2;
let ShipHeight = tileSize * 2;

let ShipX = (tileSize * columns) / 2 - tileSize;
let ShipY = tileSize * rows - tileSize * 2;

let Ship = {
  x: ShipX,
  y: ShipY,
  width: ShipWidth,
  height: ShipHeight,
};

let ShipImg;
let ShipVelocityX = tileSize;

//btn Control
let btnLeft = document.getElementById("leftbtn");
let btnRight = document.getElementById("rightbtn");

//Aliens

let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize * 2;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienCols = 3;
let alienCount = 0;
let alienVelocityX = 1;

//Bullets

let bulletArray = [];
let bulletVelocityY = -10;
let bulletImg;

//Score 
let Score = 0;
let gameOver = false;

window.onload = function () {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");

  //Draw Ship
  // context.fillStyle = 'green';
  // context.fillRect(Ship.x,Ship.y,Ship.width,Ship.height);

  //Ship Load Image
  ShipImg = new Image();
  ShipImg.src = "photo/battleship_.png";
  ShipImg.onload = function () {
    context.drawImage(ShipImg, Ship.x, Ship.y, Ship.width, Ship.height);
  };

  //Alien Image Load
  alienImg = new Image();
  alienImg.src = "photo/Alien_.png";
  CreateAliens();

  //bullet
  bulletImg = new Image();
  bulletImg.src = "photo/bullet.png";

  requestAnimationFrame(update);
  document.addEventListener("keydown", moveShip);
  //   document.addEventListener("click", moveShip);
  /*
  btnLeft.addEventListener('click',moveLeft);
  btnRight.addEventListener('click',moveright);
  */

  document.addEventListener("keyup", shoot);
};

function update() {
  requestAnimationFrame(update);

  if(gameOver){
    return;
  }
  context.clearRect(0, 0, board.width, board.height);
  //ship
  context.drawImage(ShipImg, Ship.x, Ship.y, Ship.width, Ship.height);

  //Alien
  for (let i = 0; i < alienArray.length; i++) {
    let alien = alienArray[i];
    if (alien.alive) {
      alien.x += alienVelocityX;

      //if alien touch the border
      if (alien.x + alien.width >= board.width || alien.x <= 0) {
        alienVelocityX *= -1;
        alien.x += alienVelocityX * 2;

        //move all alien by one
        for (let j = 0; j < alienArray.length; j++) {
          alienArray[j].y += alienHeight;
        }
      }

      context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
      
      if(alien.y >= Ship.y){
        gameOver = true;
      }
    }
  }

  //bullets
  for (let i = 0; i < bulletArray.length; i++) {
    let bullet = bulletArray[i];
    bullet.y += bulletVelocityY;
    context.drawImage(
      bulletImg,
      bullet.x,
      bullet.y,
      bullet.width,
      bullet.height
    );

    //bullet collision with Aliens
    for(let j = 0; j < alienArray.length; j++){
        let alien = alienArray[j];
        if(!bullet.used && alien.alive && detectCollision(bullet, alien)){
            bullet.used = true;
            alien.alive = false;
            alienCount--;
            Score += 100;
        }  
    }
  }

  //   clear the bullets
  while (bulletArray > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
    bulletArray.shift(); //this remove the first bullet element every time when it touch the top
  }

  //next level
  if(alienCount == 0){
    //Increase the number of aliens in columns and rows by 1
    alienCols = Math.min(alienCols+1, columns/2-2); //cap 16/2 - 2 = 6
    alienRows = Math.min(alienRows+1, rows-4); //cap at 16-4 = 12
    alienVelocityX += 0.2; //incerase the speed of aliens
    alienArray = [];
    bulletArray = [];
    CreateAliens();
  }

//score 
context.fillStyle = 'white';
context.font = "16px Monospace";
context.fillText(Score,5, 20);





}

function moveShip(e) {
    if(gameOver){
        return;
      }
  if (e.code == "ArrowLeft" && Ship.x - ShipVelocityX >= 0) {
    Ship.x -= ShipVelocityX; //move left
  } else if (
    e.code == "ArrowRight" &&
    Ship.x + ShipVelocityX + ShipWidth <= board.width
  ) {
    Ship.x += ShipVelocityX; //move Right
  }
}

/*
function moveLeft() {
    Ship.x -= ShipVelocityX; //move left
}
function moveright(e) {
    Ship.x += ShipVelocityX; //move Right 
}
*/

function CreateAliens() {
  for (let c = 0; c < alienCols; c++) {
    for (let r = 0; r < alienRows; r++) {
      let alien = {
        img: alienImg,
        x: alienX + c * alienWidth,
        y: alienY + r * alienHeight,
        width: alienWidth,
        height: alienHeight,
        alive: true,
      };

      alienArray.push(alien);
    }
  }
  alienCount = alienArray.length;
}

function shoot(e) {
    if(gameOver){
        return;
    }

  if (e.code == "Space" || e.code == "ArrowUp") {
    //shoot
    let bullet = {
      x: Ship.x + (ShipWidth * 12) / 32,
      y: Ship.y,
      width: tileSize / 2,
      height: tileSize / 2,
      used: false,
    };
    bulletArray.push(bullet);
  }
}


function detectCollision(a,b){
    return a.x < b.x + b.width &&  // a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&  // a's top right corner passes b's top left corner
           a.y < b.y + b.height && // a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;   // a's bottom left corner passes b's top left corner 
}