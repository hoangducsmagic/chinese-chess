const winnerBox = document.querySelector('.winner-box');
const resetButton = document.querySelector('.reset-button');

var maxn = 10,
    maxm = 9;

var MouseIsDown = false;
var ChoosingPiece = new String();

var isDown = false;
var target, offsetX, offsetY, targetCol, targetRow;
var turn=1; //1 red ; -1 black
const redTurnText = document.querySelector('.red-turn');
const blackTurnText = document.querySelector('.black-turn');
const redDiedPanel = document.querySelector('.red-died');
const blackDiedPanel = document.querySelector('.black-died');

function MouseDownHandler(e) {
    isDown = true;
    target = e.target;
    target.classList.add("is-selected");

    offsetY = e.offsetY + target.offsetTop;
    offsetX = e.offsetX + target.offsetLeft;
}

function SetPlace(row, col) {
    if (a[row][col]) {
        var item = document.getElementById(a[row][col]);
        item.classList.add('died');
        
        item.parentNode.removeChild(item);
        item.removeEventListener('mousedown',MouseDownHandler);

        console.log(item);

        if (item.id.includes('red'))
            redDiedPanel.append(item);
        else
            blackDiedPanel.append(item);

        if (item.id.includes('king')) {
            document.querySelector('.mask').style.display = 'block';
            document.querySelector('.reset-box').style.display = 'block';

            if (turn == 1) winnerBox.textContent = 'RED WIN'; else winnerBox.textContent = 'BLACK WIN';

            resetButton.onclick=(() => {
                location.reload();
            });

        }

    }
    a[target.style.gridRowStart][target.style.gridColumnStart] = undefined;
    a[row][col] = target.id;
}

function RookMove(row, col) {
    if (row != targetRow && col != targetCol) return;
    if (row == targetRow) {
        for (
            let i = Math.min(col, targetCol) + 1;
            i <= Math.max(col, targetCol) - 1;
            i++
        )
            if (a[row][i]) return;
    } else {
        for (
            let i = Math.min(row, targetRow) + 1;
            i <= Math.max(row, targetRow) - 1;
            i++
        )
            if (a[i][col]) return;
    }

    SetPlace(row, col);
    return true;
}

function KnightMove(row, col) {
    var tx = [-2, -1, 1, 2, 2, 1, -1, -2];
    var ty = [1, 2, 2, 1, -1, -2, -2, -1];
    var nx = [-1, 0, 0, 1, 1, 0, 0, -1];
    var ny = [0, 1, 1, 0, 0, -1, -1, 0];

    for (let i = 0; i < 8; i++) {
        let newx = targetRow + tx[i];
        let newy = targetCol + ty[i];

        if (newx >= 1 && newx <= maxn && newy >= 1 && newy <= maxm) {
            if (
                row == newx &&
                col == newy &&
                a[targetRow + nx[i]][targetCol + ny[i]] == undefined
            ) {
                SetPlace(row, col);
                return true;
            }
        }
    }
}

function BishopMove(row, col) {
    if (target.id.includes("red") && row < 6) return;
    if (target.id.includes("black") && row > 5) return;
    if (Math.abs(targetCol - col) != Math.abs(targetRow - row)) return;
    if (Math.abs(targetCol - col) != 2) return;

    var lefttopx = Math.min(row, targetRow);
    var lefttopy= Math.min(col, targetCol);
    if (a[lefttopx + 1][lefttopy + 1]) return;

    SetPlace(row, col);
    return true;
}

function GuardMove(row, col) {
    if (target.id.includes("red")) {
        if (col < 4 || col > 6 || row < 8) return;
    } else {
        if (col < 4 || col > 6 || row > 3) return;
    }

    if (row == targetRow || col == targetCol) return;
    if (Math.abs(row - targetRow) > 1 || Math.abs(col - targetCol) > 1) return;
    SetPlace(row, col);
    return true;
}

function KingMove(row, col) {
    if (target.id.includes("red")) {
        if (col < 4 || col > 6 || row < 8) return;
    } else {
        if (col < 4 || col > 6 || row > 3) return;
    }

    if (row != targetRow && col != targetCol) return;
    if (Math.abs(row - targetRow) > 1 || Math.abs(col - targetCol) > 1) return;
    SetPlace(row, col);
    return true;
}

function PawnMove(row, col) {
    var newx, newy;
    if (target.id.includes("red")) {
        var tx = [-1, 0, 0];
        var ty = [0, 1, -1];

        newx = targetRow + tx[0];
        newy = targetCol + ty[0];
        if (newx >= 1 && row == newx && col == newy) {
            SetPlace(row, col);
            return true;
        }

        if (targetRow < 6) {
            for (let i = 1; i <= 2; i++) {
                newx = targetRow + tx[i];
                newy = targetCol + ty[i];
                if (
                    newx >= 1 &&
                    newy >= 1 &&
                    newy <= maxm &&
                    row == newx &&
                    col == newy
                ) {
                    SetPlace(row, col);
                    return true;
                }
            }
        }
    } else {
        var tx = [1, 0, 0];
        var ty = [0, 1, -1];

        newx = targetRow + tx[0];
        newy = targetCol + ty[0];
        if (newx <= maxn && row == newx && col == newy) {
            SetPlace(row, col);
            return true;
        }

        if (targetRow > 5) {
            for (let i = 1; i <= 2; i++) {
                newx = targetRow + tx[i];
                newy = targetCol + ty[i];
                if (
                    newx <= maxn &&
                    newy >= 1 &&
                    newy <= maxm &&
                    row == newx &&
                    col == newy
                ) {
                    SetPlace(row, col);
                    return true;
                }
            }
        }
    }
    
}

function CanonMove(row, col) {
    
    if (targetRow != row && targetCol != col) return;

    if (a[row][col]) {  //ăn
       
        var count = 0;
        if (row == targetRow) {
            for (let i = Math.min(targetCol, col) + 1; i <= Math.max(col, targetCol) - 1; i++)
                if (a[row][i]) count++;
        } else {
            for (let i = Math.min(targetRow, row) + 1; i <= Math.max(targetRow, row) - 1; i++)
               
                if (a[i][col]) count++;
        }
        
        if (count != 1) return;

    } else {    // di chuyển
        
        if (row == targetRow) {
            for (let i = Math.min(targetCol, col) + 1; i <= Math.max(col, targetCol) - 1; i++)
                if (a[row][i]) return;
        } else {
            for (let i = Math.min(targetRow, row) + 1; i <= Math.max(targetRow, row) - 1; i++)
                if (a[i][col]) return;
        }
    }

    SetPlace(row, col);
    return true;
}

function MakeMove(row, col) {
    if (turn == 1 && target.id.includes('black')) return;
    if (turn == -1 && target.id.includes('red')) return;

    var type;
    if (target.id.includes("red")) type = "red";
    else type = "black";
    if (a[row][col] && a[row][col].includes(type)) return;

    targetCol = Number.parseInt(target.style.gridColumnStart);
    targetRow = Number.parseInt(target.style.gridRowStart);

    var isMoveSuccess;

    if (target.id.includes("rook")) isMoveSuccess=RookMove(row, col);
    if (target.id.includes("knight")) isMoveSuccess=KnightMove(row, col);
    if (target.id.includes("bishop")) isMoveSuccess=BishopMove(row, col);
    if (target.id.includes("guard")) isMoveSuccess=GuardMove(row, col);
    if (target.id.includes("king")) isMoveSuccess=KingMove(row, col);
    if (target.id.includes("pawn")) isMoveSuccess=PawnMove(row, col);
    if (target.id.includes("canon")) isMoveSuccess=CanonMove(row, col);

    if (isMoveSuccess == true) {
        if (turn == 1) {
        
            redTurnText.style.display = 'none';
            blackTurnText.style.display = 'block';
           
        } else {
            redTurnText.style.display = 'block';
            blackTurnText.style.display = 'none';
        }
        turn *= -1;
    }
    
}

function MouseUpHandler(e) {
    if (target) {
        const col = Math.round((e.clientX - 47) / (650 / 9)) + 1;
        const row = Math.round((e.clientY - 25) / (623 / 10)) + 1;

        MakeMove(row, col);
        BoardRefresh();

        target.classList.remove("is-selected");
        isDown = false;

        target = undefined;
    }
}

function MouseMoveHandler(e) {
    if (isDown) {
        target.style.transform = `translateY(${
            e.clientY - offsetY + 7
        }px) translateX(${e.clientX - offsetX - 7}px)`;
    }
}

function BoardInit() {
    a[1][1] = "black-rook1";
    a[1][2] = "black-knight1";
    a[1][3] = "black-bishop1";
    a[1][4] = "black-guard1";
    a[1][5] = "black-king";
    a[1][6] = "black-guard2";
    a[1][7] = "black-bishop2";
    a[1][8] = "black-knight2";
    a[1][9] = "black-rook2";
    a[3][2] = "black-canon1";
    a[3][8] = "black-canon2";
    a[4][1] = "black-pawn1";
    a[4][3] = "black-pawn2";
    a[4][5] = "black-pawn3";
    a[4][7] = "black-pawn4";
    a[4][9] = "black-pawn5";

    a[10][1] = "red-rook1";
    a[10][2] = "red-knight1";
    a[10][3] = "red-bishop1";
    a[10][4] = "red-guard1";
    a[10][5] = "red-king";
    a[10][6] = "red-guard2";
    a[10][7] = "red-bishop2";
    a[10][8] = "red-knight2";
    a[10][9] = "red-rook2";
    a[8][2] = "red-canon1";
    a[8][8] = "red-canon2";
    a[7][1] = "red-pawn1";
    a[7][3] = "red-pawn2";
    a[7][5] = "red-pawn3";
    a[7][7] = "red-pawn4";
    a[7][9] = "red-pawn5";

    for (i = 1; i <= 10; i++) {
        for (j = 1; j <= 9; j++)
            if (a[i][j]) {
                document
                    .getElementById(a[i][j])
                    .addEventListener("mousedown", MouseDownHandler);
            }
    }

    BoardRefresh();
}

function BoardRefresh() {
    for (i = 1; i <= 10; i++) {
        for (j = 1; j <= 9; j++)
            if (a[i][j]) {
                let item = document.getElementById(a[i][j]);
                item.style.transform = "translateY(0px) translateX(0px)";

                item.style.gridRow = i;
                item.style.gridColumn = j;
            }
    }
}

var a = new Array(15);
for (i = 0; i < a.length; i++) a[i] = new Array(15);
BoardInit();
//document.addEventListener("mouseup", MouseUpHandler);
document
    .getElementById("grid-board")
    .addEventListener("mouseup", MouseUpHandler);
document.addEventListener("mousemove", MouseMoveHandler);



