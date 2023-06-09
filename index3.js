// variables for the HTML element
const box = document.querySelectorAll('#cell')
const sttatus = document.querySelector('#status')
const restarts = document.querySelector('#restart')
const playy =  document.querySelector('#playy')
const darkmodebtn = document.body


const player1 = document.querySelector('#player1Status')
const player2 = document.querySelector('#player2Status')

playingWith = ''
whoWon = ''

// setting up the scores
scores = {
    x: 0,
    o: 0,
    draws: 0,
}

// declaring variables for when game is running, the player(current player) and winning conditions
let running = false;
let player = 'X'; //current start game player
let computer = 'O';

let textCollor 
let timer
let lastWon

let selected = ["","","","","","","","",""]; //an array to add the clicked cell
let winConditions = [
    ['0','1','2'],
    ['3','4','5'],
    ['6','7','8'],
    ['0','3','6'],
    ['1','4','7'],
    ['2','5','8'],
    ['0','4','8'],
    ['2','4','6']
]

let available = [];
restarts.addEventListener('click',restartBtn)
computerWon = false;
startGame()
clickable = true;

// dark mode selector
document.querySelector(".switch > input").addEventListener("click", function (event) {
    document.querySelector("body").classList.toggle("darkmode");
  });


function startGame() {
    playingWith = '1 V 1'
    if (playingWith == 'Computer') {
        
        playy.textContent = `Playing with ${playingWith}`
        box.forEach(pick => pick.addEventListener('click',boxClicked))
        running = true;
    }
    else
    {
        playy.textContent = `Playing ${playingWith}`
        box.forEach(pick => pick.addEventListener('click',boxClicked))
        running = true;
    }
}


function changePlay() {
    
    if (playingWith == 'Computer') {
        playingWith = '1 V 1'
        lastWon = 'X'
        playy.textContent = `Playing ${playingWith}`
    }
    else{
        playingWith = 'Computer'
        player = 'X'
        lastWon = 'X'
        playy.textContent = `Playing with ${playingWith}`
    }
    scores.x = 0
    scores.o = 0
    scores.draws = 0
    restartBtn()
}


function availablePicks(){
    available= []
    for (let x = 0; x < selected.length; x++) {
        const pick = selected[x];
        if (!pick) {
            available.push(x)
        }
    }
}


function compPick() {
    clickable = false;
    if (running) {
        if (player == 'X'){
            textCollor = 'red'
        }
        else{
            textCollor = 'blue'
        }
        timer = setTimeout(function()
        {
            // x = Math.floor((Math.random()*(available.length)))
            // iPick = available[x]
            iPick = available[Math.floor((Math.random()*(available.length)))]
            
            
            box[iPick] = computer
            
            selected[iPick] = computer

            box[iPick].style.color = textCollor
            box[iPick].textContent = computer
            checkWin()
            if (!roundWon && !draw) {
                sttatus.textContent = `${player} turn`
                textCollor = 'blue'
            }
            clickable = true
        }, 10)
    }
}


// when a cell is clicked
function boxClicked() {
    if (running) {
        // executed when playing with the computer 
        if (playingWith == 'Computer') {
            
            if (clickable) {
                const boxIndex = this.getAttribute('cellIndex')
                if (selected[boxIndex] == "") {
                    // console.log(this, 'now')
                    if (player == 'X'){
                        textCollor = 'blue'
                    }
                    else{
                        textCollor = 'red'
                    }
                    updateBox(this, boxIndex) //update value when a box is clicked
                    availablePicks()
                    if (!roundWon && !draw) {
                        sttatus.textContent = `${computer} turn`
                        // textCollor = 'red'
                    }
                    changePlayer()//change the player if no winner
                }
            }
            
        }

        //executed when playin with another person, 1 v 1
        else if(playingWith == '1 V 1'){
            const boxIndex = this.getAttribute('cellIndex')
            if (selected[boxIndex] == "") {
                if (player == 'X'){
                    textCollor = 'red'
                }
                else{
                    textCollor = 'blue'
                }
                updateBox(this, boxIndex) //update value when a box is clicked
                changePlayer()//change the player if no winner
                
            }
        }
    }
    
    
}

// updating the cell on the browser
function updateBox(pick , index) {
    selected[index] = player//update the 'selected' array with the player value(X OR O) to the 
    pick.style.color = textCollor
    pick.textContent = player //update a box with the player value
    checkWin()//check if there is a winner
    
}

// change player, chenge the player to X or O
function changePlayer(){
    // Executed if playing with comp
    if (playingWith == 'Computer') {
        compPick()
    }
    // executed on 1 v 1
    else{
        player = (player == 'X') ? 'O':'X' //the current player is X, Change to O otherwise X
        if (running) {
            sttatus.textContent = `${player} turn` //If game is not running, update the player turn
        }
    }
}

// checking if the game is won
function checkWin(){
    roundWon = false;
    draw = false;
    whoWon = ''
    for (let x = 0; x < winConditions.length; x++) { //iterate through the winCondition array
        const condition = winConditions[x]; // this will be the first condition in the iterating array
        
        const check1 = selected[condition[0]]//asign the first object in the condition array to this variable and so on below...
        const check2 = selected[condition[1]]
        const check3 = selected[condition[2]]
            
        if (check1 == "" || check2 == "" || check3 == "" ) { //check for empty spaces
            continue
        }
        if (check1 == check2 && check2 == check3  ) {//check if the values are same hence a winner
            if (check1 == 'X') {// check if winner is X
                scores.x +=1 
                roundWon = true;
            }
            else if (check1 == 'O') {//check if winner is O
                scores.o +=1
                roundWon = true;
            }
            whoWon = check1
            sttatus.textContent = `${check1} wins`
            running = false //close the game if there is a winner
            break;
        }
    }
                
    if(!selected.includes("")){ //check if there are empty spaces
        if (!roundWon) { //check if the round is won
            scores.draws += 1 //if no its a draw so add 1 to the draw
            draw = true
            sttatus.textContent = "draw"
            running = false;
        }
    }
    // update scores
    document.querySelector('#drawScores').textContent = scores.draws
    document.querySelector('#xScores').textContent = scores.x
    document.querySelector('#oScores').textContent = scores.o
    
    // set relevant conditions
    if (whoWon == computer ) {
        computerWon = true;
    }
    else{
        computerWon = false
    }
    if (roundWon) {
        sttatus.textContent = `${whoWon} WINS!!`
        running =false
    }
    else if(draw){
        sttatus.textContent = `its a DRAW!!`
    }
}

// function for restarting the game
function restartBtn() {
   
    // Conditions if the game is restarted when no one has won yet
    if (running) {
        if (!lastWon) {
            whoWon = 'X'
        }
        else{
            whoWon = lastWon
            if (playingWith == 'Computer') {
                if (whoWon == 'O') {
                    computerWon = true
                }
            }
        }
    }
    else{
        lastWon = whoWon
    }


    clearTimeout(timer)
    // player = `${player}`
    document.querySelector('#drawScores').textContent = scores.draws
    document.querySelector('#xScores').textContent = scores.x
    document.querySelector('#oScores').textContent = scores.o

    if (playingWith == 'Computer') {
        if (!whoWon) {
            lastWon = 'X'
            sttatus.textContent = `${'X'} turn`
        }
        else{
            sttatus.textContent = `${whoWon} turn`
        }

        selected = ["","","","","","","","",""] //resetting the selected boxes
        availablePicks()
        box.forEach(pick => pick.textContent = '') //resetting the boxes
        box.forEach(pick => pick.style.color = 'black')
        running = true;
        // computerWon = false;
        clickable = true
        if (computerWon == true) {
            clickable = false;
            compPick()
        }
        else{
            computerWon= false
        }
    }

    // conditions when playing 1v1
    else{
        player = `${player}`
        sttatus.textContent = `${player} turn`
        selected = ["","","","","","","","",""] //resetting the selected boxes
        box.forEach(pick => pick.textContent = '') //resetting the boxes
        box.forEach(pick => pick.style.color = 'black')
        running = true;
    }
}