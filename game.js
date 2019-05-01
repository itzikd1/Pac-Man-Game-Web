var canvas = document.getElementById("game_canvas");
var context = canvas.getContext("2d");
var pacmen = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var pressed; //for the pressed button (1,2,3,4)

var rows = 38;
var cols = 17;
var ghosts_remain = 3;
//todo: write walls
var ghosts = new Array();




/**
 * 4 = wall
 * 3 = ghost
 * 2 = pacmen
 * 1 = food
 * 0 =
 * @constructor
 */
function Start() {
    board = new Array();
    score = 0;
    pac_color = "yellow";
    var randomNum = Math.random();
    pressed = Math.floor(randomNum * 4) + 1;
    var cnt = rows * cols;
    var pacman_remain = 1;

    var food_remain = 90;
    var time_limit;
    start_time = new Date();
    for (var i = 0; i < rows; i++) {
        board[i] = new Array();
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < cols; j++) {
            if ((i === 3 && j === 3) || (i === 3 && j === 4) || (i === 3 && j === 5) || (i === 6 && j === 1) || (i === 6 && j === 2)) {
                board[i][j] = 4;
            } else {
                randomNum = Math.random();
                if (randomNum <= 1.0 * food_remain / cnt) {
                    food_remain--;
                    board[i][j] = 1;
                } else if (randomNum < 1.0 * (pacman_remain + food_remain) / cnt) {
                    pacmen.i = i;
                    pacmen.j = j;
                    pacman_remain--;
                    board[i][j] = 2;
                } else {
                    board[i][j] = 0;
                }
                cnt--;
            }
        }
    }

    //put ghosts
    options_points = [];
    options_points.push([0,0]);
    options_points.push([0,cols-1]);
    options_points.push([rows-1,0]);
    options_points.push([rows-1,cols-1]);

    //plaster
    if (ghosts_remain == 0 && ghosts.length != 0)
        ghosts_remain=ghosts.length;
    
    while (ghosts_remain > 0) {
        randomNum = Math.random();
        var point = options_points[Math.floor(randomNum * 4)];
        if (board[point[0]][point[1]]===0){
            board[point[0]][point[1]] = 3;
            ghosts_remain--;
            var g = new Object();
            g.i = point[0];
            g.j = point[1];
            ghosts.push(g)
        }


    }
    while (food_remain > 0) {
        var emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = 1;
        food_remain--;
    }
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.code] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.code] = false;
    }, false);
    interval = setInterval(UpdatePosition, 200);
}



function findRandomEmptyCell(board) {
    var i = Math.floor((Math.random() * (cols-1)) + 1);
    var j = Math.floor((Math.random() * (rows-1)) + 1);
    while (board[i][j] !== 0) {
        i = Math.floor((Math.random() * (cols-1)) + 1);
        j = Math.floor((Math.random() * (rows-1)) + 1);
    }
    return [i, j];
}

/**
 * @return {number}
 */
function GetKeyPressed() {
    if (keysDown['ArrowUp']) {
        return 1;
    }
    if (keysDown['ArrowDown']) {
        return 2;
    }
    if (keysDown['ArrowLeft']) {
        return 3;
    }
    if (keysDown['ArrowRight']) {
        return 4;
    }
}


function Draw() {

    var icons_radius = 15;
    var eye_radius = 2.5;
    var points_radius = 5;
    context.clearRect(0, 0, canvas.width, canvas.height); //clean board
    lblScore.value = score;
    lblTime.value = time_elapsed;
    var pac_eye_color = 'red'
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var center = new Object();
            center.x = i * 2* icons_radius + icons_radius;
            center.y = j * 2 * icons_radius + icons_radius;

            //draw background
            context.beginPath();
            context.rect(center.x - icons_radius, center.y - icons_radius, 2*icons_radius, 2*icons_radius);
            context.fillStyle = "black"; //color
            context.fill();

            if (board[i][j] === 2) { //draw pacmen
                if (pressed === 4) { //right
                    context.beginPath();
                    context.arc(center.x, center.y, icons_radius, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x + 2, center.y - 8, eye_radius, 0, 2 * Math.PI); // circle
                    context.fillStyle = pac_eye_color; //color
                    context.fill();
                }
                else if (pressed === 3) { //left
                    context.beginPath();
                    context.arc(center.x, center.y, icons_radius, 1.15 * Math.PI, 0.85 * Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x - 2, center.y - 8, eye_radius, 0, 2 * Math.PI); // circle
                    context.fillStyle = pac_eye_color; //color
                    context.fill();
                }
                else if (pressed === 1) { //up
                    context.beginPath();
                    context.arc(center.x, center.y, icons_radius, 1.65 * Math.PI, 1.35 * Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x + 8, center.y - 2, eye_radius, 0, 2 * Math.PI); // circle
                    context.fillStyle = pac_eye_color; //color
                    context.fill();
                }
                else if (pressed === 2) { //down
                    context.beginPath();
                    context.arc(center.x, center.y, icons_radius, 0.65 * Math.PI, 0.35 * Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x - 8, center.y + 2, eye_radius, 0, 2 * Math.PI); // circle
                    context.fillStyle = pac_eye_color; //color
                    context.fill();
                }



            } else if (board[i][j] === 1) {
                context.beginPath();
                context.arc(center.x , center.y , points_radius, 0, 2 * Math.PI); // circle
                context.fillStyle = "gold"; //color
                context.fill();
            } else if (board[i][j] === 4) {
                context.beginPath();
                context.rect(center.x - icons_radius, center.y - icons_radius, 2*icons_radius, 2*icons_radius);
                context.fillStyle = "white"; //color
                context.fill();
            }
                else if (board[i][j] === 3) { //draw ghosts
                    context.beginPath();
                    context.arc(center.x, center.y, icons_radius, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = "green"; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x + 2, center.y - 8, eye_radius, 0, 2 * Math.PI); // circle
                    context.fillStyle = "white"; //color
                    context.fill();
                }
            }
        }


}

function UpdatePosition() {
    board[pacmen.i][pacmen.j] = 0;
    var x = GetKeyPressed();
    if (x==1 || x==2 || x==3 || x==4)
        pressed=x;
    if (x === 1) {
        if (pacmen.j > 0 && board[pacmen.i][pacmen.j - 1] !== 4) {
            pacmen.j--;
        }
    }
    if (x === 2) {
        if (pacmen.j < cols-1 && board[pacmen.i][pacmen.j + 1] !== 4) {
            pacmen.j++;
        }
    }
    if (x === 3) {
        if (pacmen.i > 0 && board[pacmen.i - 1][pacmen.j] !== 4) {
            pacmen.i--;
        }
    }
    if (x === 4) {
        if (pacmen.i < rows-1 && board[pacmen.i + 1][pacmen.j] !== 4) {
            pacmen.i++;
        }
    }
    if (board[pacmen.i][pacmen.j] === 1) {
        score++;
    }
    board[pacmen.i][pacmen.j] = 2;
    var currentTime = new Date();
    time_elapsed = (currentTime - start_time) / 1000;
    if (score >= 20 && time_elapsed <= 10) {
        pac_color = "green";
    }
    if (score === 50) {
        window.clearInterval(interval);
        window.alert("Game completed");
    } else {

        Draw(x);
    }
}