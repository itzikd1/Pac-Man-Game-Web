var canvas = document.getElementById("game_canvas");
var context = canvas.getContext("2d");

var stickercanvas = document.getElementById("sticker_canvas");
var stickercontext = stickercanvas.getContext("2d");

var pacmen = new Object();
var nikud_zaz = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var interval_ghosts;
var interval_nikud_zaz;
var pressed; //for the pressed button (1,2,3,4)
var restart = false;
var lives;

var points5, points15, points25;

var rows = 16;
var cols = 36;
//todo: write walls
var ghosts = new Array();


var drawing_helper=0;



/**
 * 7 = nikud zaz
 * 4 = wall
 * 3 = ghosts_remain
 * 2 = pacmen
 * 1 = food
 * 11 = 5 points
 * 12 = 15 points
 * 13 25 points
 * 0 = empty
 * @constructor
 */
function Start() {

    lives = 3;

    ///////colors//////
    points5 = Math.floor(nBalls * 60 / 100);
    points15 = Math.floor(nBalls * 30 / 100);
    points25 = Math.floor(nBalls * 10 / 100);
    //rest value
    points5 += (nBalls - points5 - points15 - points25);
    var points_remain = [points5,points15,points25];
    var points_indexes = [11,12,13];
    if (!restart)
        restart = true;
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
            if ((i === 4 && j === 3) ||
                (i === 5 && j === 3)||
                (i === 6 && j === 3)||
                (i === 7 && j === 3)||
                (i === 8 && j === 3)||
                (i === 9 && j === 3)||
                (i === 10 && j === 3)||
                (i === 3 && j === 4) ||
                (i === 3 && j === 5) ||
                (i === 3 && j === 6) ||
                (i === 4 && j === 7) ||
                (i === 5 && j === 7) ||
                (i === 6 && j === 6)||
                (i === 6 && j === 5)||
                (i === 6 && j === 4)||//////////////p

                (i === 10 && j === 9)||
                (i === 10 && j === 10)||
                (i === 9 && j === 8)||
               // (i === 9 && j === 8)||
                (i === 8 && j === 8)||
                (i === 7 && j === 9)||
                (i === 7 && j === 10)||
                (i === 7 && j === 8)||
                (i === 7 && j === 11)||
                (i === 10 && j === 8)||
                //(i === 7 && j === 11)||
                (i === 8 && j === 11)||
                (i === 9 && j === 11)||
                (i === 10 && j === 12)||
                (i === 7 && j === 14)||
                (i === 7 && j === 15)||
                (i === 7 && j === 16)||
                (i === 10 && j === 14)||
                (i === 10 && j === 15)||
                (i === 10 && j === 16)||
                (i === 8 && j === 14)||
                (i === 9 && j === 14)||
                (i === 10 && j === 18)||
                (i === 8 && j === 18)||
                (i === 9 && j === 18)||
                (i === 10 && j === 22)||
                (i === 8 && j === 22)||
                (i === 9 && j === 22)||
                (i === 8 && j === 20)||
                (i === 7 && j === 18) ||
                (i === 7 && j === 21)||
                (i === 7 && j === 22)||
                (i === 7 && j === 18) ||
                (i === 7 && j === 19) ||
                (i === 9 && j === 20) ||
                (i === 7 && j === 24) ||
                (i === 8 && j === 24) ||
                (i === 9 && j === 24) ||
                (i === 10 && j === 24)||
                (i === 7 && j === 27) ||
                (i === 8 && j === 27) ||
                (i === 9 && j === 27) ||
                (i === 10 && j === 28)||
                (i === 10 && j === 25)||
                (i === 10 && j === 26)||
                (i === 7 && j === 25)||
                (i === 7 && j === 26)     ||
                (i === 10 && j === 30)||
                (i === 9 && j === 30)||
                (i === 8 && j === 30)||
                (i === 7 && j === 30) ||
                (i === 9 && j === 33)||
                (i === 8 && j === 33)||
                (i === 7 && j === 33) ||
                (i === 10 && j === 33)||
                (i === 8 && j === 31)||
                (i === 9 && j === 32)
            )

             {
                board[i][j] = 4;
            } else {
                randomNum = Math.random();
                if (randomNum <= 1.0 * food_remain / cnt && is_not_locked_point(i,j)) {
                    var random = Math.floor(Math.random() * 3);
                    if (points_remain[random]>0) {
                        points_remain[random]--;
                        food_remain--;
                        board[i][j] = points_indexes[random];
                    }

                } else if ((randomNum < 1.0 * (pacman_remain + food_remain) / cnt) && is_not_locked_point(i,j)) {
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

    //put ghosts on pinot
    options_points = [];
    options_points.push([0,0]);
    options_points.push([0,cols-1]);
    options_points.push([rows-1,0]);
    options_points.push([rows-1,cols-1]);

    //plaster for restart a new game
    if (restart==true && ghosts.length !== 0) {
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

            ghosts.push(g)
        }


    }
    while (food_remain > 0) {
        var emptyCell = findRandomEmptyCell(board);
        var random = Math.floor(Math.random() * 3);
        if (points_remain[random]>0 && is_not_locked_point(emptyCell[0],emptyCell[1])) {
            points_remain[random]--;
            food_remain--;
            board[emptyCell[0]][emptyCell[1]] = points_indexes[random];
        }
    }
    while (typeof(nikud_zaz.i) === "undefined") {
        randomNum = Math.random();
        var point = options_points[Math.floor(randomNum * 4)];
        if (board[point[0]][point[1]]===0){
            board[point[0]][point[1]] = 7;
            nikud_zaz.i = point[0];
            nikud_zaz.j = point[1];
        }


    }
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.which] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.which] = false;
    }, false);
    UpdatePosition();
    UpdateGhostsPosition();
    UpdateNikudZazPosition();
    interval = setInterval(UpdatePosition, 200);
    interval_ghosts = setInterval(UpdateGhostsPosition, 350);
    interval_nikud_zaz = setInterval(UpdateNikudZazPosition,1000);
}

function is_not_locked_point(i,j) {
if (  (i==4 && j==5) || (i==5 && j==6) ||(i==5 && j==5) || (i==5 && j==4) || (i==4 && j==4) || (i==6 && j==5)|| (i==4 && j==6) || (i==8 && j==9)||
    (i==8 && j==10) || (i==9 && j==9) || (i==9 && j==10) ||(i==9 && j==26) || (i==9 && j==25) ||(i==8 && j==26) || (i==8 && j==25))
        return false;
    return true;
}



function findRandomEmptyCell(board) {
    var i = Math.floor((Math.random() * (rows-1)) + 1);
    var j = Math.floor((Math.random() * (cols-1)) + 1);
    while (board[i][j] !== 0) {
        i = Math.floor((Math.random() * (rows-1)) + 1);
        j = Math.floor((Math.random() * (cols-1)) + 1);
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
            center.x = j * 2* icons_radius + icons_radius;
            center.y = i * 2 * icons_radius + icons_radius;

            //draw background

                context.beginPath();
                context.rect(center.x - icons_radius, center.y - icons_radius, 2*icons_radius, 2*icons_radius);
                context.fillStyle = "black"; //color
                context.fill();
                DrawGhosts()
                DrawNikudZaz();



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
        }
    }
}

function DrawNikudZaz() {
    var icons_radius = 15;
    var eye_radius = 2.5;
        var center = new Object();
        center.x = nikud_zaz.j * 2* icons_radius + icons_radius;
        center.y = nikud_zaz.i* 2 * icons_radius + icons_radius;

        //draw background
        context.beginPath();
        context.fillStyle = "red"; //color
        context.arc(center.x, center.y, icons_radius, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
        context.lineTo(center.x, center.y);
        context.fill();
        context.fillStyle = "white"; //color
        context.fillText("50",center.x-3,center.y,40);


}

function DrawGhosts() {
    var icons_radius = 15;
    var eye_radius = 2.5;
    for (var k=0; k<ghosts.length; k++) {
        var center = new Object();
        center.x = ghosts[k].j * 2* icons_radius + icons_radius;
        center.y = ghosts[k].i* 2 * icons_radius + icons_radius;

        //draw background
        context.beginPath();
        context.fillStyle = "pink"; //color
        context.arc(center.x, center.y, icons_radius, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
        context.lineTo(center.x, center.y);
        context.fill();
        context.beginPath();
        context.arc(center.x + 2, center.y - 8, eye_radius, 0, 2 * Math.PI); // circle
        context.fillStyle = "yellow"; //color
        context.fill();
    }

}

function getMinIndex(steps) {
    var min = steps[0];
    var index = 0;
    for (var i=1; i<steps.length; i++) {
        if (min > steps[i]) {
            min = steps[i];
            index = i;
        }
    }
    return index;
}

function getMaxIndex(steps) {
    var max = steps[0];
    var index = 0;
    for (var i=1; i<steps.length; i++) {
        if (max <=  steps[i]) {
            max = steps[i];
            index = i;
        }
    }
    return index;
}

function UpdateGhostsPosition() {


    var chance_random = 0.2;
    var random_number;
    for (var i = 0; i < ghosts.length; i++) {
        var new_i, new_j;
        var distance_up = rows*cols;
        var distance_down = rows*cols;
        var distance_left = rows*cols;
        var distance_right = rows*cols;
        if (ghosts[i].i-1 >=0 && board[ghosts[i].i-1][ghosts[i].j]!=4) {
            distance_up = ((Math.abs((pacmen.i - (ghosts[i].i - 1)))) + (Math.abs((pacmen.j - ghosts[i].j))));
            // console.log("pacmen location: [" + pacmen.i +"," + + pacmen.j + "] ghost " + i + " move up: [" + (parseInt(ghosts[i].i)-1) + "," +ghosts[i].j +  "] destination: " + (Math.abs(pacmen.i-(ghosts[i].i-1)))+ "+" + (Math.abs(pacmen.j-ghosts[i].j)) + "=" + (Math.abs(pacmen.i-(ghosts[i].i-1)) + Math.abs(pacmen.j-ghosts[i].j)) );
        }
        if (ghosts[i].i+1 <rows && board[ghosts[i].i+1][ghosts[i].j]!=4) {
            distance_down = ((Math.abs(pacmen.i - (ghosts[i].i + 1))) + (Math.abs(pacmen.j - ghosts[i].j)));
            // console.log("pacmen location: [" + pacmen.i +"," + + pacmen.j + "] ghost " + i + " move down: [" + (parseInt(ghosts[i].i)+1) + "," +ghosts[i].j +  "] destination: " + (Math.abs(pacmen.i-(ghosts[i].i+1))+ "+" + (Math.abs(pacmen.j-ghosts[i].j) )+ "=" + (Math.abs(pacmen.i-(ghosts[i].i+1)) + Math.abs(pacmen.j-ghosts[i].j)))) ;

        }
        if (ghosts[i].j-1 >=0 && board[ghosts[i].i][ghosts[i].j-1]!=4) {
            distance_left = (((Math.abs(pacmen.i - ghosts[i].i))) + (Math.abs(pacmen.j - (ghosts[i].j - 1))));
            // console.log("pacmen location: [" + pacmen.i +"," + + pacmen.j + "] ghost " + i + " move left: [" + (parseInt(ghosts[i].i)) + "," +(ghosts[i].j-1) +  "] destination: " + (Math.abs(pacmen.i-(ghosts[i].i))+ "+" + (Math.abs(pacmen.j-ghosts[i].j-1)) + "=" + (Math.abs(pacmen.i-(ghosts[i].i)) + Math.abs(pacmen.j-ghosts[i].j-1)))) ;

        }
        if (ghosts[i].j+1 <cols && board[ghosts[i].i][ghosts[i].j+1]!=4) {
            distance_right = (((Math.abs(pacmen.i - ghosts[i].i))) + (Math.abs(pacmen.j - (ghosts[i].j + 1))));
            // console.log("pacmen location: [" + pacmen.i +"," + + pacmen.j + "] ghost " + i + " move right: [" + (parseInt(ghosts[i].i)) + "," +(ghosts[i].j+1) +  "] destination: " + (Math.abs(pacmen.i-(ghosts[i].i))+ "+" + (Math.abs(pacmen.j-ghosts[i].j+1)) + "=" + (Math.abs(pacmen.i-(ghosts[i].i)) + Math.abs(pacmen.j-ghosts[i].j+1))) );
        }

        var steps = [distance_up,distance_down,distance_left,distance_right];
        var locations = [[ghosts[i].i-1,ghosts[i].j],[ghosts[i].i+1,ghosts[i].j],[ghosts[i].i,ghosts[i].j-1],[ghosts[i].i,ghosts[i].j+1]];
        var minIndex;
        random_number = Math.floor(Math.random());
        if (Math.random() < chance_random) {
            minIndex = Math.floor(Math.random() * 4);
            if (locations[minIndex][0] < 0 || locations[minIndex][0] >= rows || locations[minIndex][1] < 0 || locations[minIndex][1] >= cols || board[locations[minIndex][0]][locations[minIndex][1]]== 4)
                return UpdateGhostsPosition();
        }
        else
            minIndex = getMinIndex(steps);
        new_i = locations[minIndex][0];
        new_j = locations[minIndex][1];

        ghosts[i].old_i = ghosts[i].i;
        ghosts[i].old_j = ghosts[i].j;
        ghosts[i].i = new_i;
        ghosts[i].j = new_j;
    }
    //DrawGhosts();
    if (ghosts.length === 0) {
        interval_ghosts.clearInterval(); //all of ghosts has been killed //to check if this possible
    }
}





function UpdatePosition() {
    board[pacmen.i][pacmen.j] = 0;
    var x = GetKeyPressed();
    if (x==1 || x==2 || x==3 || x==4)
        pressed=x;
    if (x === 3) {
        if (pacmen.j > 0 && board[pacmen.i][pacmen.j - 1] !== 4) {
            pacmen.j--;
        }
    }
    if (x === 4) {
        if (pacmen.j < cols-1 && board[pacmen.i][pacmen.j + 1] !== 4) {
            pacmen.j++;
        }
    }
    if (x === 1) {
        if (pacmen.i > 0 && board[pacmen.i - 1][pacmen.j] !== 4) {
            pacmen.i--;
        }
    }
    if (x === 2) {
        if (pacmen.i < rows-1 && board[pacmen.i + 1][pacmen.j] !== 4) {
            pacmen.i++;
        }
    }
    if (board[pacmen.i][pacmen.j] === 11) {
        score+=5;
    }
    else if (board[pacmen.i][pacmen.j] === 12) {
        score+=15;
    }else  if (board[pacmen.i][pacmen.j] === 13) {
        score+=25;
    } else if(   board[pacmen.i][pacmen.j] === 7) {
        board[pacmen.i][pacmen.j] = 0;
        score+=50;
        nikud_zaz = new Object();
    }
    else { //lose points
        for (var i = 0; i < ghosts.length; i++) {
            if (ghosts[i].i===pacmen.i && ghosts[i].j===pacmen.j) {
                score -= 10;
                lives--;
                stickercanvas.visibility="visible";
                let boom_image = new Image();
                boom_image.src = 'images/boom.png';
                console.log("ghost number " + i );
                stickercontext.drawImage(boom_image, 60, 10, 58 , 35);
                // stickercanvas.visibility="hidden";
                setTimeout(function(){
                    stickercanvas.visibility="hidden";
                    stickercontext.clearRect(0,0,stickercanvas.width,stickercanvas.height);
                },2000);
            }

        }
    }
    board[pacmen.i][pacmen.j] = 2;
    var currentTime = new Date();
   // var time_time = new Date(time);
    time_elapsed = Math.floor(time - (currentTime - start_time) / 1000);

        Draw(x);
}



function UpdateNikudZazPosition() {

    var chance_random = 0.2;
    var random_number;
    var new_i, new_j;
    var distance_up = -1;
    var distance_down = -1;
    var distance_left = -1;
    var distance_right = -1;
    if (nikud_zaz.i-1 >=0 && board[nikud_zaz.i-1][nikud_zaz.j]!=4) {
        distance_up = ((Math.abs((pacmen.i - (nikud_zaz.i - 1)))) + (Math.abs((pacmen.j - nikud_zaz.j))));
    }
    if (nikud_zaz.i+1 <rows && board[nikud_zaz.i+1][nikud_zaz.j]!=4) {
        distance_down = ((Math.abs(pacmen.i - (nikud_zaz.i + 1)) + (Math.abs(pacmen.j - nikud_zaz.j))));

    }
    if (nikud_zaz.j-1 >=0 && board[nikud_zaz.i][nikud_zaz.j-1]!=4) {
        distance_left = ((Math.abs(pacmen.i - nikud_zaz.i)) + (Math.abs(pacmen.j - (nikud_zaz.j - 1))));

    }
    if (nikud_zaz.j+1 <cols && board[nikud_zaz.i][nikud_zaz.j+1]!=4) {
        distance_right = ((Math.abs(pacmen.i - nikud_zaz.i)) + (Math.abs(pacmen.j - (nikud_zaz.j + 1))));
    }

    var steps = [distance_up,distance_down,distance_left,distance_right];
    var locations = [[nikud_zaz.i-1,nikud_zaz.j],[nikud_zaz.i+1,nikud_zaz.j],[nikud_zaz.i,nikud_zaz.j-1],[nikud_zaz.i,nikud_zaz.j+1]];
    var maxIndex;
    random_number = Math.random();
    if (random_number < chance_random) {
        maxIndex = Math.floor(Math.random() * 4);
        if (locations[maxIndex][0] < 0 || locations[maxIndex][0] >= rows || locations[maxIndex][1] < 0 || locations[maxIndex][1] >= cols || board[locations[maxIndex][0]][locations[maxIndex][1]]== 4)
            return UpdateNikudZazPosition();
    }
    else
        maxIndex = getMaxIndex(steps);
    new_i = locations[maxIndex][0];
    new_j = locations[maxIndex][1];

    nikud_zaz.old_i = nikud_zaz.i;
    nikud_zaz.old_j = nikud_zaz.j;
    board[nikud_zaz.old_i][nikud_zaz.old_j] = 0;
    nikud_zaz.i = new_i;
    nikud_zaz.j = new_j;
    board[nikud_zaz.i][nikud_zaz.j] = 7;


    if (typeof(nikud_zaz.i) === "undefined"){
        interval_nikud_zaz.clearInterval(); //nikud has ben eeaten
    }

}