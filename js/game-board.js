let playerPositionI, playerPositionJ, cols, rows, score = 0, remainingBalls, intervalId, forbiddenCells = [], isCurrentMoveThroughGap = false;


function createTable(colNum, rowNum) {
    cols = colNum;
    rows = rowNum;

    let row, cell;

    const table = document.querySelector("table");

    for (let i = 0; i < rows; i++) {
        row = document.createElement("tr");
        for (let j = 0; j < cols; j++) {
            cell = document.createElement("td");
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    for (let i = 0; i < rows; i++) {
        forbiddenCells.push([i, 0]);
        forbiddenCells.push([i, cols - 1]);
    }

    for (let j = 0; j < cols; j++) {
        forbiddenCells.push([0, j]);
        forbiddenCells.push([rows - 1, j]);
    }

    let gapCells = [[0, Math.floor(cols / 2)], [rows - 1, Math.floor(cols / 2)], [Math.floor(rows / 2), 0], [Math.floor(rows / 2), cols - 1]];

    gapCells.forEach(element => {
        let cell = (getCell(...element));
        cell.style.backgroundColor = "darkgray";
    });

    forbiddenCells = forbiddenCells.filter(item =>
        !gapCells.some(gap => gap[0] === item[0] && gap[1] === item[1])
    );

    let startIcn = document.querySelector('#start-icn');
    startIcn.addEventListener('click', startGame);
}


function getCell(i, j) {
    const table = document.querySelector('table');
    if (!table)
        console.log("not table");

    const row = table.rows[i];
    return row.cells[j];
}


function startGame() {
    remainingBalls = 0;
    score = 0;

    let startIcn = document.querySelector('#start-icn');
    startIcn.removeEventListener('click', startGame);

    playerPositionI = Math.round(Math.random() * (rows - 3) + 1);
    playerPositionJ = Math.round(Math.random() * (cols - 3) + 1);

    let player = document.createElement("img");
    player.src = 'assets/images/player.png';
    player.alt = "player";
    player.id = "player";

    let cell = getCell(playerPositionI, playerPositionJ);
    cell.style.padding = "0";
    cell.appendChild(player);
    addBall();
    addBall();

    intervalId = setInterval(() => addBall(cols, rows), 3000);
}


function restartGame() {
    score = 0;
    document.querySelector("#score").innerHTML = score;
    clearInterval(intervalId);
    cleanBoard();
    startGame();
}


function addBall() {
    let foundPosition = false, ballPositionI, ballPositionJ, cell;

    let ball = document.createElement("img");
    ball.src = "assets/images/ball.png";
    ball.alt = "ball";
    ball.className = "ball";

    while (!foundPosition) {
        ballPositionI = Math.round(Math.random() * (rows - 3) + 1);
        ballPositionJ = Math.round(Math.random() * (cols - 3) + 1);
        cell = getCell(ballPositionI, ballPositionJ);
        if (cell.querySelector("img") === null) {
            cell.style.padding = "0";
            cell.appendChild(ball);
            remainingBalls++;
            if (remainingBalls >= (cols - 2) * (rows - 2) - 1)
                setTimeout(gameOver(), 3000);
            foundPosition = true;
        }
    }
}


document.addEventListener("keydown",
    (event) => {
        switch (event.key) {

            case "ArrowUp":
                if (!forbiddenCells.some(cell => cell[0] === playerPositionI - 1 && cell[1] === playerPositionJ))
                    if (playerPositionI - 1 >= 0)
                        playerPositionI--;
                    else {
                        playerPositionI = rows - 1;
                        isCurrentMoveThroughGap = true;
                    }
                break;

            case "ArrowDown":
                if (!forbiddenCells.some(cell => cell[0] === playerPositionI + 1 && cell[1] === playerPositionJ))
                    if (playerPositionI + 1 <= rows - 1)
                        playerPositionI++;
                    else {
                        playerPositionI = 0;
                        isCurrentMoveThroughGap = true;
                    }
                break;

            case "ArrowLeft":
                if (!forbiddenCells.some(cell => cell[0] === playerPositionI && cell[1] === playerPositionJ - 1))
                    if (playerPositionJ - 1 >= 0)
                        playerPositionJ--;
                    else {
                        playerPositionJ = cols - 1;
                        isCurrentMoveThroughGap = true;
                    }
                break;

            case "ArrowRight":
                if (!forbiddenCells.some(cell => cell[0] === playerPositionI && cell[1] === playerPositionJ + 1))
                    if (playerPositionJ + 1 <= cols - 1)
                        playerPositionJ++;
                    else {
                        playerPositionJ = 0;
                        isCurrentMoveThroughGap = true;
                    }
                break;
        }

        let player = document.querySelector("#player");
        if (player)
            player.remove();

        let currCell = getCell(playerPositionI, playerPositionJ);
        if (!isCurrentMoveThroughGap)
            currCell.style.padding = "0";
        else
            isCurrentMoveThroughGap = false;
        currCell.appendChild(player);

        catchBall();
    }
)


function catchBall() {
    let currCell = getCell(playerPositionI, playerPositionJ);
    if (currCell.querySelector(".ball") != null) {
        currCell.querySelector(".ball").remove();
        document.querySelector("#score").innerHTML = ++score;
        remainingBalls--;
        if (remainingBalls <= 0)
            setTimeout(() => win(), 100);
    }
}


function cleanBoard() {
    let images = document.querySelectorAll("table img");
    images.forEach(image => {
        image.remove();
    });
    remainingBalls = 0;
}


function handlePauseAndContinue() {
    clearInterval(intervalId);
    let icn = document.querySelector("#pause-continue .iconify");
    if (icn.ariaLabel == "pause game") {
        document.querySelector("#pause-continue").title = "continue";
        clearInterval(intervalId);
        document.querySelector('#overlay').style.display = 'block';
        icn.setAttribute("data-icon", "fa:play");
        icn.setAttribute("aria-label", "continue game");
        icn.setAttribute("title", "continue");
    }

    else {
        document.querySelector("#pause-continue").title = "pause";
        intervalId = setInterval(() => addBall(cols, rows), 3000);
        document.querySelector('#overlay').style.display = 'none';
        icn.setAttribute("data-icon", "subway:pause");
        icn.setAttribute("aria-label", "pause game");
        icn.setAttribute("title", "pause");
    }
}


function gameOver() {
    clearInterval(intervalId);
    Swal.fire({
        title: "You Lose",
        text: "Don't worry, losers are people too 🫤",
        icon: "error",
        button: {
            text: "Try Again!",
            closeModal: true
        }
    }).then((willRetry) => {
        if (willRetry) {
            restartGame();
        }
    })
}


function win() {
    clearInterval(intervalId);
    cleanBoard();
    Swal.fire({
        title: "You Win",
        text: "You're officially a ball-catching champion! 🏆",
        icon: "success",
        button: {
            text: "Play Again!",
            closeModal: true
        }
    }).then((willRetry) => {
        if (willRetry) {
            restartGame();
        }
    })
}