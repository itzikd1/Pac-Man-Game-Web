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

var points5, points15, points25;

var rows = 38;
var cols = 17;
var ghosts_remain = 3;
//todo: write walls
var ghosts = new Array();


var drawing_helper=0;

/**
 * 4 = wall
 * 3 = ghost
 * 2 = pacmen
 * 1 = food
 * 11 = 5 points
 * 12 = 15 points
 * 13 25 points
 * 0 =
 * @constructor
 */
function Start() {

    ///////colors//////
    points5 = Math.floor(nBalls * 60 / 100);
    points15 = Math.floor(nBalls * 30 / 100);
    points25 = Math.floor(nBalls * 10 / 100);
    //rest value
    points5 += (nBalls - points5 - points15 - points25);
    var points_remain = [points5,points15,points25];
    var points_indexes = [11,12,13];

    ///////////////////

    board = new Array();
    score = 0;
    pac_color = "yellow";
    var randomNum = Math.random();
    pressed = Math.floor(randomNum * 4) + 1;
    var cnt = rows * cols;
    var pacman_remain = 1;
    startSound();
    var food_remain = nBalls;
    var time_limit = time; //todo: use it !
    start_time = new Date();
    for (var i = 0; i < rows; i++) {
        board[i] = new Array();
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < cols; j++) {
            //todo: walls drawing
            if ((i === 3 && j === 3) || (i === 3 && j === 4) || (i === 3 && j === 5) || (i === 6 && j === 1) || (i === 6 && j === 2)) {
                board[i][j] = 4;
            } else {
                randomNum = Math.random();
                if (randomNum <= 1.0 * food_remain / cnt) {
                    var random = Math.floor(Math.random() * 3);
                    if (points_remain[random]>0) {
                        points_remain[random]--;
                        food_remain--;
                        board[i][j] = points_indexes[random];
                    }

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

    //plaster for restart a new game
    if (ghosts_remain === 0 && ghosts.length !== 0) {
        ghosts_remain=ghosts.length;
        ghosts = new Array();
    }

    while (ghosts_remain > 0) {
        randomNum = Math.random();
        var point = options_points[Math.floor(randomNum * 4)];
        if (board[point[0]][point[1]]===0){
            board[point[0]][point[1]] = 3;
            ghosts_remain--;
            var g = new Object();
            g.i = point[0];
            g.j = point[1];
            // g.old_j = 0;
            // g.old_i = 0;
            ghosts.push(g)
        }


    }
    while (food_remain > 0) {
        var emptyCell = findRandomEmptyCell(board);
        var random = Math.floor(Math.random() * 3);
        if (points_remain[random]>0) {
            points_remain[random]--;
            food_remain--;
            board[emptyCell[0]][emptyCell[1]] = points_indexes[random];
        }
    }
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.which] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.which] = false;
    }, false);
    interval = setInterval(UpdatePosition, 200);
    var interval2 = setInterval(    UpdateGhostsPosition, 500);
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
    if (keysDown[up_key]) { //up
        return 1;
    }
    if (keysDown[down_key]) { //down
        return 2;
    }
    if (keysDown[left_key]) { //left
        return 3;
    }
    if (keysDown[right_key]) { //right
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



            } else if (board[i][j] === 11) {
                context.beginPath();
                context.arc(center.x , center.y , points_radius, 0, 2 * Math.PI); // circle
                context.fillStyle = points5color; //color
                context.fill();
            } else if (board[i][j] === 12) {
                context.beginPath();
                context.arc(center.x , center.y , points_radius, 0, 2 * Math.PI); // circle
                context.fillStyle = points15color; //color
                context.fill();
            } else if (board[i][j] === 13) {
                context.beginPath();
                context.arc(center.x , center.y , points_radius, 0, 2 * Math.PI); // circle
                context.fillStyle = points25color; //color
                context.fill();
            }
            else if (board[i][j] === 4) {
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

// function pickcolor(){
//     while(true){
//         var r = Math.floor(Math.random() * 3) + 1;
//         if (r == 1 && points5 > 0){
//
//         }
//     }
// }

function DrawGhosts() {
    var icons_radius = 15;
    for (var k=0; k<ghosts.length; k++) {
        var center = new Object();
        center.x = ghosts[k].i * 2* icons_radius + icons_radius;
        center.y = ghosts[k].j * 2 * icons_radius + icons_radius;

        //draw background
        context.beginPath();
        context.clearRect(center.x - icons_radius, center.y - icons_radius, 2*icons_radius, 2*icons_radius);
        context.fillStyle = "black"; //color
        context.fill();
    }

}

function UpdateGhostsPosition() {
    for (var i = 0; i < ghosts.length; i++) {
        var new_i = 5;
        var new_j = 5;

        //todo:// ghostd algorightm ghosts_remain.

        board[new_i][new_j] = 3;

        ghosts[i].old_i = ghosts[i].i;
        ghosts[i].old_j = ghosts[i].j;
        board[ghosts[i].i][ghosts[i].j] = 1;
        ghosts[i].i = new_i;
        ghosts[i].j = new_j;
    }
    DrawGhosts();
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
    if (board[pacmen.i][pacmen.j] === 11) {
        score+=5;
    }
    else     if (board[pacmen.i][pacmen.j] === 12) {
        score+=15;
    }else     if (board[pacmen.i][pacmen.j] === 13) {
        score+=25;
    }
    board[pacmen.i][pacmen.j] = 2;
    var currentTime = new Date()
   // var time_time = new Date(time);
    time_elapsed = time - (currentTime - start_time) / 1000;

        Draw(x);
}