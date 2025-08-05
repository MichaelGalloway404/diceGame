let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]




let dir = 'd';
let currentPos = [4, 4];
let canDraWDie = false;

function ranInt(min,max){
    min = min;
    max = max;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Dice {
    constructor(startRow, startCol, map, spriteSheet, dieNum) {
        this.diceList = diceList;
        this.dieNum = dieNum;
        this.map = map;
        this.spriteSheet = spriteSheet;
        this.position = [startRow, startCol];
        this.direction = 'd';
        // initial list of dice sides
        this.dieSides = [1,2,3,4,5,6];
        // choose a random side as our random starting previous ficae
        this.prevFace = this.dieSides[ranInt(0,5)];
        // filter out face that was chosen
        this.dieSides = this.dieSides.filter(side => side != this.prevFace);
        // list of every die face's opposate side
        this.apposingSide = {
            1:6,
            2:5,
            3:4,
            4:3,
            5:2,
            6:1
        };
        // filter out our randomly chosen prevFace's opposate
        this.dieSides = this.dieSides.filter(side => side != this.apposingSide[this.prevFace]);
        // now current face can be choosen randomly from an appropriate set of current faces based off random prevFace
        this.currFace = this.dieSides[ranInt(0,3)];
        // update dice image
        this.dice_frame = this.currFace - 1;

        // roll 3 to 10 times
        this.numMoves = ranInt(3,10);
        // random first move
        this.moveList = ['u','d','l','r'];
        this.lastMove = this.moveList[ranInt(0,3)];
        this.currentMove;

        // determines the flow of movent a die can take based on it previous possition
        this.diceMoveFlow = {
            1: {
                5: [3,4],   // left and right of 5 coming from 1
                4: [5,2],   // left and right of 4 coming from 1
                3: [2,5],   // ect...
                2: [4,3],
                forward: 6  // going forward from 1
            },
            2: {
                6: [4,3],   //left and right of 6 coming from 2
                4: [1,6],   // ect...
                3: [6,1],
                1: [3,4],
                forward: 5
            },
            3: {
                6: [2,5],
                5: [6,1],
                2: [1,6],
                1: [5,2],
                forward: 4
            },
            4: {
                6: [5,2],
                5: [1,6],
                2: [6,1],
                1: [2,5],
                forward: 3
            },
            5: {
                6: [3,4],
                4: [6,1],
                3: [1,6],
                1: [4,3],
                forward: 2
            },
            6: {
                5: [4,3],
                4: [2,5],
                3: [5,2],
                2: [3,4],
                forward: 1
            }
        }

    }
    // preform a move
    prefMove(){
        let perfomTimeout;
        if (this.numMoves > 0) {
            // use last move to get random choice of (forward left or right)
            this.currentMove = this.randomMove(this.lastMove); // returns string direction and 0-2 indicating (forward=0,left=1,right=2)
            const moved = this.move(this.currentMove[0]); // returns true/false and moves dice
            this.lastMove = this.currentMove[0];

            // stops dice from moving if wall was hit
            if (!moved) {
                clearTimeout(perfomTimeout); // stop loop if wall hit
                // display still needs to be updated
                update_display();
                return;
            }
            

            // grap possible left and right moves based on previous move
            let possMov = this.diceMoveFlow[this.prevFace][this.currFace];
            // add forward move so we can now randomly chose a (forward left or right) move
            if (!possMov.includes(this.diceMoveFlow[this.prevFace].forward)) {
                possMov.push(this.diceMoveFlow[this.prevFace].forward);
            }
            // chose new face based off random dir chosen (forward,left,right)
            let newFace = possMov[this.currentMove[1]]; // randomMove(dir) => ex. ['d', 2] => (forward=0,left=1,right=2)
            // update dice image displayed
            this.dice_frame = newFace - 1;

            // update faces for next move
            this.prevFace = this.currFace;
            this.currFace = newFace;

            this.numMoves--;
            update_display();
            
            perfomTimeout = setTimeout(() => this.prefMove(), 100);
        }
    }
    // chooses a random move (forward left or right) from last move
    randomMove(lastMove){
        // only move forward or to the side, not backwards
        if(lastMove == 'u'){
            let moves = ['u','l','r'];
            let dir = ranInt(0,2);
            return [moves[dir],dir];
        }
        if(lastMove == 'd'){
            let moves = ['d','l','r'];
            let dir = ranInt(0,2);
            return [moves[dir],dir];
        }
        if(lastMove == 'r'){
            let moves = ['u','d','r'];
            let dir = ranInt(0,2);
            return [moves[dir],dir];
        }
        if(lastMove == 'l'){
            let moves = ['u','d','l'];
            let dir = ranInt(0,2);
            return [moves[dir],dir];
        }
    }
    // attempts to move in direction given, if wall is hit dice doesn't move and returns false
    move(dir) {
        if (dir == 'u' && this.position[0] - 1 >= 0 && this.map[this.position[0] - 1][this.position[1]] != 1) {
            for(let i=0; i < diceList.length; i++){
                if (
                    diceList[i].dieNum !== this.dieNum &&
                    this.position[0] - 1 === diceList[i].position[0] &&
                    this.position[1] === diceList[i].position[1]
                ){
                    return false;
                }
            }
            this.position[0]--;
            return true;
        } else if (dir == 'd' && this.position[0] + 1 < this.map.length && this.map[this.position[0] + 1][this.position[1]] != 1) {
            for(let i=0; i < diceList.length; i++){
                if (
                    diceList[i].dieNum !== this.dieNum &&
                    this.position[0] + 1 === diceList[i].position[0] &&
                    this.position[1] === diceList[i].position[1]
                ){
                    return false;
                }
            }
            this.position[0]++;
            return true;
        } else if (dir == 'r' && this.position[1] + 1 < this.map[0].length && this.map[this.position[0]][this.position[1] + 1] != 1) {
            for(let i=0; i < diceList.length; i++){
                if (
                    diceList[i].dieNum !== this.dieNum &&
                    this.position[0] === diceList[i].position[0] &&
                    this.position[1] + 1 === diceList[i].position[1]
                ){
                    return false;
                }
            }
            this.position[1]++;
            return true;
        } else if (dir == 'l' && this.position[1] - 1 >= 0 && this.map[this.position[0]][this.position[1] - 1] != 1) {
            for(let i=0; i < diceList.length; i++){
                if (
                    diceList[i].dieNum !== this.dieNum &&
                    this.position[0] === diceList[i].position[0] &&
                    this.position[1] -1  === diceList[i].position[1]
                ){
                    return false;
                }
            }
            this.position[1]--;
            return true;
        } else {
            return false;
        }
    }
    draw(ctx, cellSize) {
        const [row, col] = this.position;
        const sprite = this.spriteSheet;
        ctx.drawImage(
            sprite[this.dice_frame]['image'],
            sprite[this.dice_frame]['sx'], sprite[this.dice_frame]['sy'], // source x,y
            sprite[this.dice_frame]['sWidth'], sprite[this.dice_frame]['sHeight'], // source width,height
            col * cellSize, row * cellSize, cellSize, cellSize
        );
    }
}

// creates multiple images from single image
function sprite_sheet(img, numFrames, numFramesInRow, sourceX, sourceY, frameWidth, frameHeight, destX, destY) {
    let sSheet = [];
    for (let i = 0; i < numFrames; i++) {
        // The horizontal position in the spritesheet row
        let posInColmn = i % numFramesInRow; // ex. first row of sheet has 3 frames so we can rotate through 0, 1, 2
        // The vertical offset in the spritesheet
        let rowNumber = Math.floor(i / numFramesInRow); // ex. say i=5 & numFramesInRow=3, then rowNumber = 1 (5/3 = 1.66, floor(1.66) = 1) the second row
        sSheet[i] = {
            image: img,
            sx: sourceX + posInColmn * frameWidth,
            sy: sourceY + rowNumber * frameHeight,
            sWidth: frameWidth,
            sHeight: frameHeight,
            dx: destX,
            dy: destY,
            dWidth: frameWidth,
            dHeight: frameHeight
        };
    }
    return sSheet;
}

// create dice sprite sheet for player 1
const diceImg = new Image();
diceImg.src = "./images/dice-sheet.png";
let frameWidth = 50;  // width of a single frame
let frameHeight = 50; // height of a single frame
let numFrames = 6;    // total number of frames
let framesInRow = 6;
let dice_spritesheet = sprite_sheet(diceImg, numFrames, framesInRow, 0, 0, frameWidth, frameHeight, 50, 50);
let dice_frame = 1;
// create dice sprite sheet for player 2
const diceImg2 = new Image();
diceImg2.src = "./images/dice-sheet2.png";
let dice_spritesheet2 = sprite_sheet(diceImg2, numFrames, framesInRow, 0, 0, frameWidth, frameHeight, 50, 50);

let diceList = [];
let startPosses = {
    1: [6,5],
    2: [6,6],
};

// player 1
diceList.push(new Dice(6, 5,  map, dice_spritesheet, 1));
// player 2
diceList.push(new Dice(6, 6,  map, dice_spritesheet2, 2));

// draws game to the screen
function update_display() {
    // for display mini map
    const gameBoardCanvas = document.getElementById("gameBoardCanvas");

    // Set internal canvas size
    gameBoardCanvas.width = 400;
    gameBoardCanvas.height = 400;

    const gameBoard = gameBoardCanvas.getContext("2d");

    // Optional: Set the CSS size (display size)
    // gameBoardCanvas.style.width = "1400px";
    // gameBoardCanvas.style.height = "1400px";

    const cellSize = 25;

    // draws mini map
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === 1) {
                gameBoard.fillStyle = "black";
            } else {
                gameBoard.fillStyle = "brown";
            }
            gameBoard.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);

            if(canDraWDie){
                for(let x=0;x<diceList.length;x++){
                    diceList[x].draw(gameBoard,25);
                }
            }

            // // Draw grid lines
            // gameBoard.strokeStyle = "gray";
            // gameBoard.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
        }
    }
}

// load images before displaying
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}
Promise.all([
    loadImage("./images/dice-sheet.png"),
    loadImage("./images/dice-sheet2.png")
]).then(() => {
    // start displaying game when ready
    update_display();
});


document.getElementById("diceButton").onclick = function(){
    canDraWDie = true;
    // update_display right after click so we can see first die face
    update_display();

    // randomly change background colors
    ranBackground("body");
    ranBackground(".main");
    ranBackground("html");
    ranBackground("h1");
    ranBackground("h2.p1");
    ranBackground("h2.p2");

    for(let i=0;i<diceList.length;i++){
        diceList[i].position = [startPosses[diceList[i].dieNum][0],startPosses[diceList[i].dieNum][1]];
        diceList[i].numMoves = ranInt(3,10);
    }

    for(let i=0;i<diceList.length;i++){
        // small delay after click to show first fice of die
        setTimeout(diceList[i].prefMove(),100);
    }
    setInterval(game,200);
}

function game(){
    let player1Role = 0;
    let player2Role = 0;    
    if(diceList[0].numMoves <= 0){
        player1Role = diceList[0].dice_frame+1;
        document.querySelector('.p1').innerHTML = 'Player1 score = '+ player1Role;
    }
    if(diceList[1].numMoves <= 0){
        player2Role = diceList[1].dice_frame+1;
        document.querySelector('.p2').innerHTML = 'Player2 score = '+ player2Role;
    }
    if (player1Role > player2Role && player1Role !== 0 && player2Role !== 0){
        document.querySelector('h1').innerHTML = 'The Winner is Player1!';
    }
    if (player1Role < player2Role && player1Role !== 0 && player2Role !== 0){
        document.querySelector('h1').innerHTML = 'The Winner is Player2!';
    }
    if (player1Role === player2Role && player1Role !== 0 && player2Role !== 0){
        document.querySelector('h1').innerHTML = "It's a Tie!";
    }
}


// two fuctions for changing either an objects border or background color randomly
function ranBorderBack(query){
    let r = Math.floor((Math.random()*255)+1);
    let g = Math.floor((Math.random()*255)+1);
    let b = Math.floor((Math.random()*255)+1);
    document.querySelector(query).style.borderBlockColor = 'rgb(' + [r,g,b].join(',') + ')';
}
function ranBackground(query){
    let r = Math.floor((Math.random()*255)+1);
    let g = Math.floor((Math.random()*255)+1);
    let b = Math.floor((Math.random()*255)+1);
    document.querySelector(query).style.backgroundColor = 'rgb(' + [r,g,b].join(',') + ')';
}

// display board 
update_display();