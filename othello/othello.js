BOARD_X = 8;
BOARD_Y = 8;
var EMPTY = 0;
var BLACK = 1;
var WHITE = 2;
var WALL = 5;
var board = [];
var player;
var enemy;

function init(){
    for(var i = 0; i < BOARD_Y+2; i++){
        board[i] = [];
    }
    drawBoard(BOARD_X, BOARD_Y);
    board[4][4] = BLACK;
    board[4][5] = WHITE;
    board[5][4] = WHITE;
    board[5][5] = BLACK;
    drawStones();
    player = 1;
    enemy = 2;
    var playerName = getById("current-player-name");
    playerName.innerHTML = "黒";
    showArea();    
}

function getById(id){
    obj = document.getElementById(id);
    return obj;
}

function getCellId(x, y){
    return "cell_" + x + "_" + y;
}

function getX(str){
    return str.substr(5,1);
}

function getY(str){
    return str.substr(7,1);
}

function drawBoard(x, y){

    var table = document.createElement("table");

    for(var i = 0; i < y+2; i++){
        if(i != 0 && i != y+2){
            //行の追加
            var row = table.insertRow(-1);
        }
        for(var j = 0; j < x+2; j++){
            
            if(i == 0 || i == x + 1 || j == 0 || j == y + 1){
                //cellに5を追加
                board[i][j] = WALL;
            }else{
                //cellの追加
                var cell = row.insertCell(-1);
                //cellにid付与
                cell.setAttribute("id", getCellId(j, i))
                cell.setAttribute("onclick", "clicked(this)")
                //cellに0を追加
                board[j][i] = EMPTY;
            }
        }
    }

    var divBoard = getById("game-board");
    divBoard.appendChild(table);
}

function drawStones(){
    for(var i = 1; i < BOARD_X+1; i++){
        for(var j = 1; j < BOARD_Y+1; j++){
            var cell = getById(getCellId(i, j));
            cell.innerHTML = "";
                if(board[i][j] == BLACK){
                    cell.innerHTML = "●";
                    cell.style.color = "black";
                }
                if(board[i][j] == WHITE){
                    cell.innerHTML = "●";
                    cell.style.color = "white";
                }
        }
    }
}

function canPut(x,y,isPut){
    var canPut = false;
    if(board[x][y] == 0){
        for (var dx = -1; dx <= 1; dx++) {
            for (var dy = -1; dy <= 1; dy++) {
                if(enemy == board[x+dx][y+dy]){
                    if(canSandwitch(x,y,dx,dy)){
                        if(isPut){
                            turnStones(x,y,dx,dy);
                        }
                        canPut = true;
                    }
                }
            }
        }
    }
    return canPut;
}

function canSandwitch(x,y,dx,dy){
    isPlayer = false;
    var i = 1;
    while(true){
        if(board[x+dx*i][y+dy*i] == player){
            isPlayer = true;
            break;
        }
        if(board[x+dx*i][y+dy*i] == WALL || board[x+dx*i][y+dy*i] == EMPTY){
            break;
        }
        i++;
    }

    return isPlayer;
}

function clicked(element){
    var id = element.getAttribute("id");
    var x = getX(id);
    var y = getY(id);
    if(canPut(Number(x),Number(y), true)){
        switchColor();
        drawStones();
        showArea();
    }else{
        alert("置けない");
    }

    var blackPlayer = document.forms.settigs.black.value;
    var whitePlayer = document.forms.settigs.white.value;

    if(blackPlayer == "human" && whitePlayer == "human"){
        return;
    }

    if(blackPlayer == "human"){
        switch (whitePlayer) {
            case "cpu1":
                putCpu1();
                break;
        
        }
    }

    if(whitePlayer == "human"){
        switch (blackPlayer) {
            case "cpu1":
                putCpu1();
                break;
        
        }
    }
}

function switchColor(){
    var tmp = player;
    player = enemy;
    enemy = tmp;
    var playerName = getById("current-player-name");
    if(player == BLACK){
        playerName.innerHTML = "黒";
    }else{
        playerName.innerHTML = "白";
    }
}

function turnStones(x,y,dx,dy){
    board[x][y] = player;

    var i = 1;

    while(true){
        if(board[x+dx*i][y+dy*i] == player){
            break;
        }
        board[x+dx*i][y+dy*i] = player;

        i++;
    }
}

function showArea(){
    for(var i = 1; i < BOARD_X+1; i++){
        for(var j = 1; j < BOARD_Y+1; j++){
            var cell = getById(getCellId(i, j));
            cell.style.backgroundColor = "#090";
            if(canPut(i,j,false)){
                cell.style.backgroundColor = "red";
            }
        }
    }
}

function isFinish(){
    var count = 0;

    for(var i = 1; i < BOARD_X+1; i++){
        for(var j = 1; j < BOARD_Y+1; j++){
            if(board[i][j] != 0){
                count++;
            }
        }
    }

    if(count == 64){
        return true;
    }else{
        return false;
    }
}

function btnPushed(element){
    var blackPlayer = element.form.black.value;
    var whitePlayer = element.form.white.value;
    initFromButton(blackPlayer,whitePlayer);

    if(blackPlayer != "human" && whitePlayer != "human"){
        doCpuVsCpu();
        return;
    }

    switch (blackPlayer) {
        case "cpu1":
            putCpu1();
            break;
    
    }
}

function initFromButton(blackPlayer,whitePlayer){
    //board初期化
    for(var i = 0; i < BOARD_Y+2; i++){
        board[i] = [];
    }
    for(var i = 0; i < BOARD_Y+2; i++){
        for(var j = 0; j < BOARD_X+2; j++){
            if(i == 0 || i == BOARD_X + 1 || j == 0 || j == BOARD_Y + 1){
                //cellに5を追加
                board[i][j] = WALL;
            }else{
                //cellに0を追加
                board[j][i] = EMPTY;
            }
        }
    }
    board[4][4] = BLACK;
    board[4][5] = WHITE;
    board[5][4] = WHITE;
    board[5][5] = BLACK;
    drawStones();
    player = 1;
    enemy = 2;
    var playerName = getById("current-player-name");
    playerName.innerHTML = "黒";
    showArea(); 
}

function doCpuVsCpu(){

    while(true){
        putCpu1();
        if(isFinish()){
            break;
        }
    }
}

function putCpu1(){
    var coordinates =[];
    for(var i = 1; i < BOARD_X+1; i++){
        for(var j = 1; j < BOARD_Y+1; j++){
            if(canPut(i,j,false)){
                var coordinate = {x:i,y:j};
                coordinates.push(coordinate);
            }
        }
    }

    var coordinate = coordinates[Math.floor(Math.random() * coordinates.length)];
    canPut(coordinate.x,coordinate.y,true);

    switchColor();
    drawStones();
    showArea();
}