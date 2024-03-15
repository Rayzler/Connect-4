const boardHtml = $("#board");
let boardSize = 5;
let board = createMatrix();
let turn = "player";
let colorPlayer = "red";
let colorCpu = "yellow";
let mode = "config";

function createBoard() {
    boardHtml.empty();

    for (let x = 0; x < boardSize; x++) {
        const rowHtml = $(`<div class='row'>`);
        for (let y = 0; y < boardSize; y++) {
            const btn = $("<div class='cell col'>");
            rowHtml.append(btn);
            btn.attr("id", `${x}-${y}`);
            btn.click(() => {
                if (mode !== "play") {
                    return;
                }

                if (turn !== "player") {
                    return;
                }

                let yTarget = boardSize - 1;
                while (board[yTarget][y] !== 0) {
                    yTarget--;
                }
                $(`#${yTarget}-${y}`).css("background-color", colorPlayer);
                board[yTarget][y] = 1;

                if (checkWinner() === 1) {
                    turn = "";
                    setTimeout(() => {
                        alert("Gano el jugador!");
                    }, 500);
                    return;
                }
                turn = "CPU";
                setTimeout(pickCell, 500);
            });
        }
        boardHtml.append(rowHtml);
    }
}

function createMatrix() {
    let matrix = [];

    for (let i = 0; i < boardSize; i++) {
        let row = new Array(boardSize).fill(0);
        matrix.push(row);
    }
    return matrix;
}

function pickCell() {
    let y = 0;
    do {
        y = Math.round(Math.random() * (boardSize - 1));
    } while (board[0][y] !== 0);
    let yTarget = boardSize - 1;
    while (board[yTarget][y] !== 0) {
        yTarget--;
    }
    $(`#${yTarget}-${y}`).css("background-color", colorCpu);
    board[yTarget][y] = 2;

    if (checkWinner() === 2) {
        setTimeout(() => {
            alert("Gano el CPU!");
        }, 500);
        return;
    }
    turn = "player";
}

function checkWinner() {
    // Checar una fila
    function checkLine(line) {
        for (let i = 0; i <= line.length - 4; i++) {
            if (line[i] !== 0 &&
                line[i] === line[i + 1] &&
                line[i] === line[i + 2] &&
                line[i] === line[i + 3]) {
                return line[i];
            }
        }
        return 0;
    }

    // Función para rotar la matriz y checar las columnas como filas
    function rotate() {
        return board[0].map((_, i) => board.map(row => row[i]));
    }

    // Función para verificar todas las líneas en la matriz
    function checkAllLines() {
        for (let i = 0; i < board.length; i++) {
            // Verificar filas
            let winner = checkLine(board[i]);
            if (winner !== 0) return winner;

            // Verificar columnas
            winner = checkLine(rotate()[i]);
            if (winner !== 0) return winner;
        }

        // Verificar diagonales
        for (let i = 0; i <= board.length - 4; i++) {
            for (let j = 0; j <= board[i].length - 4; j++) {
                const diagonal = [
                    board[i][j],
                    board[i + 1][j + 1],
                    board[i + 2][j + 2],
                    board[i + 3][j + 3]
                ];
                let winner = checkLine(diagonal);
                if (winner !== 0) return winner;

                const antiDiagonal = [
                    board[i][j + 3],
                    board[i + 1][j + 2],
                    board[i + 2][j + 1],
                    board[i + 3][j]
                ];
                winner = checkLine(antiDiagonal);
                if (winner !== 0) return winner;
            }
        }

        return 0;
    }

    const winner = checkAllLines();
    if (winner === 1) {
        return 1;
    } else if (winner === 2) {
        return 2;
    } else {
        return 0;
    }
}

createBoard();

$('input[name="color"]').change(function () {
    colorPlayer = $(this).val();
    colorCpu = colorPlayer === "red" ? "yellow" : "red";
});

$('input[name="turn"]').change(function () {
    turn = $(this).val();
});

$("#mode").click(() => {
    mode = mode === "config" ? "play" : "config";
    $("#mode").text(mode === "config" ? "Jugar" : "Reiniciar");
    if (mode === "play") {
        startGame();
    } else {
        restart();
    }
});

function startGame() {
    if (turn === "CPU") {
        setTimeout(pickCell, 500);
    }
    $(".config").hide();
}

function restart() {
    $(".cell").css("background-color", "transparent");
    board = createMatrix();
    mode = "config";
    turn = "player";
    colorPlayer = "red";
    colorCpu = "yellow";
    $(`#player`).prop("checked", "true");
    $(`#red`).prop("checked", "true");
    $(".config").show();
}

$("input[type='number']").change(function () {
    boardSize = parseInt($(this).val());
    if (boardSize < 4)
        boardSize = 4;
    if (boardSize > 12)
        boardSize = 12;
    createBoard();
    board = createMatrix();
});
