// document.querySelector("#diceButton").addEventListener("click", roleDie);
// function roleDie(){
//     document.querySelector("#dice").setAttribute('src','Dice2.png');
// }

let btn = document.getElementById("diceButton");
let btn2 = document.getElementById("diceButton2");
let player1Role = 0;
let player2Role = 0;

btn.onclick = function(){
    document.querySelector("#dice").setAttribute('src','Dice.gif');
    setTimeout(() => {
        player1Role = roleDice("#dice");
        document.querySelector('.p1').innerHTML = 'Player1 score = '+ player1Role;
    }, 500);
    ranBorderBack("#dice");
    ranBackground("html");
    ranBackground(".main");
}

btn2.onclick = function(){
    document.querySelector("#dice2").setAttribute('src','Dice.gif');
    setTimeout(() => {
        player2Role = roleDice("#dice2");
        document.querySelector('.p2').innerHTML = 'Player2 score = '+ player2Role;
    }, 500);
    ranBorderBack("#dice2");
    ranBackground("html");
    ranBackground(".main");
}
function roleDice(diceTag){
    let role = Math.floor((Math.random()*6)+1);
    if(role === 1){document.querySelector(diceTag).setAttribute('src','Dice1.png');}
    if(role === 2){document.querySelector(diceTag).setAttribute('src','Dice2.png');}
    if(role === 3){document.querySelector(diceTag).setAttribute('src','Dice3.png');}
    if(role === 4){document.querySelector(diceTag).setAttribute('src','Dice4.png');}
    if(role === 5){document.querySelector(diceTag).setAttribute('src','Dice5.png');}
    if(role === 6){document.querySelector(diceTag).setAttribute('src','Dice6.png');}
    return role;
}

// setInterval(ranBack,500);
function ranBorderBack(x){
    let r = Math.floor((Math.random()*255)+1);
    let g = Math.floor((Math.random()*255)+1);
    let b = Math.floor((Math.random()*255)+1);
    document.querySelector(x).style.borderBlockColor = 'rgb(' + [r,g,b].join(',') + ')';
}
function ranBackground(x){
    let r = Math.floor((Math.random()*255)+1);
    let g = Math.floor((Math.random()*255)+1);
    let b = Math.floor((Math.random()*255)+1);
    document.querySelector(x).style.backgroundColor = 'rgb(' + [r,g,b].join(',') + ')';
}

// game loop
function game(){
    if (player1Role > player2Role && player1Role !== 0 && player2Role !== 0){
        document.querySelector('h1').innerHTML = 'The Winner is Player1!';
    }
    if (player1Role < player2Role && player1Role !== 0 && player2Role !== 0){
        document.querySelector('h1').innerHTML = 'The Winner is Player2!';
    }
    if (player1Role === player2Role && player1Role !== 0 && player2Role !== 0){
        document.querySelector('h1').innerHTML = "It's a Tie!";
    }
    ranBackground("html");
    ranBackground(".main");
}
setInterval(game,1000);