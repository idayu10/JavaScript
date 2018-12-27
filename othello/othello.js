BOARD_X = 8;
BOARD_Y = 8;
var EMPTY = 0;
var BLACK = 1;
var WHITE = 2;
var WALL = 5;
var boardG = [];
var player;
var enemy;

function init(){
    for(var i = 0; i < BOARD_Y+2; i++){
        boardG[i] = [];
    }
    drawBoard(BOARD_X, BOARD_Y);
    boardG[4][4] = WHITE;
    boardG[4][5] = BLACK;
    boardG[5][4] = BLACK;
    boardG[5][5] = WHITE;
    drawStones();
    player = BLACK;
    enemy = WHITE;
    var playerName = getById("current-player-name");
    playerName.innerHTML = "黒";
    showArea();
    countStones();
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
                boardG[i][j] = WALL;
            }else{
                //cellの追加
                var cell = row.insertCell(-1);
                //cellにid付与
                cell.setAttribute("id", getCellId(j, i))
                cell.setAttribute("onclick", "clicked(this)")
                //cellに0を追加
                boardG[i][j] = EMPTY;
            }
        }
    }

    var divBoard = getById("game-board");
    divBoard.appendChild(table);
}

function drawStones(){
    for(var i = 1; i < BOARD_Y+1; i++){
        for(var j = 1; j < BOARD_X+1; j++){
            var cell = getById(getCellId(j, i));
            cell.innerHTML = "";
            if(boardG[i][j] == BLACK){
                cell.innerHTML = "●";
                cell.style.color = "black";
            }
            if(boardG[i][j] == WHITE){
                cell.innerHTML = "●";
                cell.style.color = "white";
            }
        }
    }
}

function canPut(x,y,isPut,board){

    if(!board){
        board = boardG;
    }

    var canPut = false;
    if(board[y][x] == 0){
        for (var dx = -1; dx <= 1; dx++) {
            for (var dy = -1; dy <= 1; dy++) {
                if(enemy == board[y+dy][x+dx]){
                    if(canSandwitch(x,y,dx,dy,board)){
                        if(isPut){
                            turnStones(x,y,dx,dy,board);
                        }
                        canPut = true;
                    }
                }
            }
        }
    }
    return canPut;
}

function canSandwitch(x,y,dx,dy,board){
    isPlayer = false;
    var i = 1;
    while(true){
        if(board[y+dy*i][x+dx*i] == player){
            isPlayer = true;
            break;
        }
        if(board[y+dy*i][x+dx*i] == WALL || board[y+dy*i][x+dx*i] == EMPTY){
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
    if(canPut(Number(x),Number(y), true,null)){
        switchColor();
        drawStones();
        showArea();
        countStones();
    }else{
        alert("置けない");
        return;
    }

    if(isPass()){
        switchColor();
        showArea();
        countStones();
        return;
    }

    if(isFinish()){
        return;
    }

    var blackPlayer = document.forms.settigs.black.value;
    var whitePlayer = document.forms.settigs.white.value;

    if(blackPlayer == "human" && whitePlayer == "human"){
        return;
    }

    // isPass=trueの場合ループ
    while(true){

        if(blackPlayer == "human" && player == WHITE){
            switch (whitePlayer) {
                case "cpu1":
                    putCpu1();
                    break;
                case "cpu2":
                    putCpu2();
                    break;
                case "cpu3":
                    putCpu3();
                    break;
                case "cpu4":
                    putCpu4();
                    break;
                case "cpu5":
                    putCpu5();
                    break;
            
            }
        }
    
        if(whitePlayer == "human" && player == BLACK){
            switch (blackPlayer) {
                case "cpu1":
                    putCpu1();
                    break;
                case "cpu2":
                    putCpu2();
                    break;
                case "cpu3":
                    putCpu3();
                    break;
                case "cpu4":
                    putCpu4();
                    break;
                case "cpu5":
                    putCpu5();
                    break;
            
            }
        }

        if(isFinish()){
            return;
        }

        if(!isPass()){
            return;
        }

        alert("パス");
        switchColor();
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

function turnStones(x,y,dx,dy,board){
    board[y][x] = player;

    var i = 1;

    while(true){
        if(board[y+dy*i][x+dx*i] == player){
            break;
        }
        board[y+dy*i][x+dx*i] = player;

        i++;
    }
}

function showArea(){
    for(var i = 1; i < BOARD_Y+1; i++){
        for(var j = 1; j < BOARD_X+1; j++){
            var cell = getById(getCellId(j, i));
            cell.style.backgroundColor = "#090";
            if(canPut(j,i,false,null)){
                cell.style.backgroundColor = "red";
            }
        }
    }
}

function countStones(){
    var blackStone = 0;
    var whiteStone = 0;

    for(var i = 1; i < BOARD_Y+1; i++){
        for(var j = 1; j < BOARD_X+1; j++){
            if(boardG[i][j] == BLACK){
                blackStone++;
            }
            if(boardG[i][j] == WHITE){
                whiteStone++;
            }
        }
    }

    getById("blackStone").innerHTML = blackStone;
    getById("whiteStone").innerHTML = whiteStone;

    return blackStone + whiteStone;
}

function isPass(){

    var isPass = true;

    for(var i = 1; i < BOARD_Y+1; i++){
        for(var j = 1; j < BOARD_X+1; j++){
            if(canPut(j,i,false,null)){
                isPass = false;
            }
        }
    }

    return isPass;
}

function isFinish(){
    var count = 0;
    var me = false;
    var enemy = false;

    for(var i = 1; i < BOARD_Y+1; i++){
        for(var j = 1; j < BOARD_X+1; j++){
            if(boardG[i][j] != 0){
                count++;
            }

            if(canPut(i,j,false,null)){
                me = true;
            }
            switchColor();
            if(canPut(i,j,false,null)){
                enemy = true;
            }
            switchColor();
        }
    }

    if(!me && !enemy){
        return true;
    }

    return count == BOARD_X*BOARD_Y;
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
        case "cpu2":
            putCpu2();
            break;
        case "cpu3":
            putCpu3();
            break;
        case "cpu4":
            putCpu4();
            break;
        case "cpu5":
            putCpu5();
            break;
    
    }
}

function initFromButton(blackPlayer,whitePlayer){
    //board初期化
    for(var i = 0; i < BOARD_Y+2; i++){
        boardG[i] = [];
    }
    for(var i = 0; i < BOARD_Y+2; i++){
        for(var j = 0; j < BOARD_X+2; j++){
            if(i == 0 || i == BOARD_X + 1 || j == 0 || j == BOARD_Y + 1){
                //cellに5を追加
                boardG[j][i] = WALL;
            }else{
                //cellに0を追加
                boardG[j][i] = EMPTY;
            }
        }
    }
    boardG[4][4] = WHITE;
    boardG[4][5] = BLACK;
    boardG[5][4] = BLACK;
    boardG[5][5] = WHITE;
    drawStones();
    player = BLACK;
    enemy = WHITE;
    var playerName = getById("current-player-name");
    playerName.innerHTML = "黒";
    showArea(); 
    countStones();
}

function doCpuVsCpu(){

    var blackPlayer = document.forms.settigs.black.value;
    var whitePlayer = document.forms.settigs.white.value;
    var cpuColor;

    while(true){

        if(player == BLACK){
            cpuColor = blackPlayer;
        }else{
            cpuColor = whitePlayer;
        }

        switch (cpuColor) {
            case "cpu1":
                putCpu1();
                break;
            case "cpu2":
                putCpu2();
                break;
            case "cpu3":
                putCpu3();
                break;
            case "cpu4":
                putCpu4();
                break;
            case "cpu5":
                putCpu5();
                break;
        
        }

        if(isFinish()){
            break;
        }

        if(isPass()){
            switchColor();
            continue;
        }
    }
}

function putCpu1(){
    var coordinates =[];
    for(var i = 1; i < BOARD_X+1; i++){
        for(var j = 1; j < BOARD_Y+1; j++){
            if(canPut(i,j,false,null)){
                var coordinate = {x:i,y:j};
                coordinates.push(coordinate);
            }
        }
    }

    var coordinate = coordinates[Math.floor(Math.random() * coordinates.length)];
    canPut(coordinate.x,coordinate.y,true,null);

    switchColor();
    drawStones();
    showArea();
    countStones();
}

function putCpu2(){
    var weight = [];
    weight.push([-99,-99,-99,-99,-99,-99,-99,-99,-99,-99]);
    weight.push([-99,30,-12,0,-1,-1,0,-12,30,-99]);
    weight.push([-99,-12,-15,-3,-3,-3,-3,-15,-12,-99]);
    weight.push([-99,0,-3,0,-1,-1,-0,-3,0,-99]);
    weight.push([-99,-1,-3,-1,-1,-1,-1,-3,-1,-99]);
    weight.push([-99,-1,-3,-1,-1,-1,-1,-3,-1,-99]);
    weight.push([-99,0,-3,0,-1,-1,-0,-3,0,-99]);
    weight.push([-99,-12,-15,-3,-3,-3,-3,-15,-12,-99]);
    weight.push([-99,30,-12,0,-1,-1,0,-12,30,-99]);
    weight.push([-99,-99,-99,-99,-99,-99,-99,-99,-99,-99]);

    var coordinates =[];
    for(var i = 1; i < BOARD_X+1; i++){
        for(var j = 1; j < BOARD_Y+1; j++){
            if(canPut(i,j,false,null)){
                var coordinate = {x:i,y:j};
                coordinates.push(coordinate);
            }
        }
    }

    var max = -999;

    for(var tmp of coordinates){
        if(max < weight[tmp.y][tmp.x]){
            max = weight[tmp.y][tmp.x];
        }
    }

    var coordinatesMax = [];

    for(var tmp of coordinates){
        if(max == weight[tmp.y][tmp.x]){
            coordinatesMax.push(tmp);
        }
    }

    var coordinate = coordinatesMax[Math.floor(Math.random() * coordinatesMax.length)];
    canPut(coordinate.x,coordinate.y,true,null);

    switchColor();
    drawStones();
    showArea();
    countStones();
}