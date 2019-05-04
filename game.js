var canvas = document.getElementById("game_canvas");
var context = canvas.getContext("2d");

var infocanvas = document.getElementById("info_canvas");
var infocontext = infocanvas.getContext("2d");

var lives = 3;
var pacmen = new Object();
var nikud_zaz = new Object();
var board;
var score = 0;
var pac_color;
var start_time;
var time_elapsed = 0;
var interval;
var interval_ghosts;
var interval_nikud_zaz;
var interval_sticker;
var pressed; //for the pressed button (1,2,3,4)
var restart = false;
var bonus_flag ;
var food_counter;
var lives_flag;

var points5, points15, points25;

var rows = 14;
var cols = 36;
var ghosts = new Array();


var drawing_helper=0;
DrawBaseOfInfoCanvas();




function DrawLives() {
    var life_image = new Image();
    life_image.src = 'images/life_s.png';

    for (var i=0; i<lives; i++) {
        infocontext.drawImage(life_image, 10 + i* 50, 50, 50, 50);
    }
}

function DrawLine(number, number2) {
    infocontext.fillStyle = "2px -6px #D1B358";
    infocontext.beginPath();
    infocontext.moveTo(number, number2);
    infocontext.lineTo(number, 100 + number2);
    infocontext.lineWidth="3";
    infocontext.stroke();

}

function DrawBaseOfInfoCanvas() {
    infocanvas.width = 600;
    infocanvas.height = 120;
    infocanvas.style.left = "700px";
    infocanvas.style.top = "5px";
    infocanvas.style.position = "absolute";


    infocontext.fillStyle = "#F2CF66";
    infocontext.lineWidth="5";
    infocontext.strokeStyle="#000000";
    infocontext.rect(0,0,infocanvas.width,infocanvas.height);
    infocontext.fill();
    infocontext.stroke();

    //username
    infocontext.fillStyle = "#f1f1f1";
    infocontext.font =  '30px Pacifico';
    infocontext.textShadow = "2px -6px #D1B358";
    infocontext.fillText(username,10,35);

    //lifes
    DrawLives();

    DrawLine(170,10);

    //Time
    infocontext.fillStyle = "#f1f1f1";
    infocontext.font =  '30px Pacifico';
    infocontext.textShadow = "2px -6px #D1B358";
    infocontext.fillText("Time:",180,35);

    //clock
    infocontext.fillStyle = "#f1f1f1";
    infocontext.font =  '30px Pacifico';
    infocontext.textShadow = "2px -6px #D1B358";
    infocontext.fillText(time_elapsed,190,90);

    DrawLine(260,10);

    //Time
    infocontext.fillStyle = "#f1f1f1";
    infocontext.font =  '30px Pacifico';
    infocontext.textShadow = "2px -6px #D1B358";
    infocontext.fillText("Score:",280,35);

    //clock
    infocontext.fillStyle = "#f1f1f1";
    infocontext.font =  '30px Pacifico';
    infocontext.textShadow = "2px -6px #D1B358";
    infocontext.fillText(score,290,90);

    DrawLine(370,10);











}


function noGhostOnThisPoint(pointElement, pointElement2) {
    for(k=0; k<ghosts.length; k++)
        if (pointElement == ghosts[k].i && pointElement2 == ghosts[k].j)
            return false;
    return true;
}

function locateGhosts() {
    //put ghosts on pinot
    options_points = [];
    options_points.push([0, 0]);
    options_points.push([0, cols - 1]);
    options_points.push([rows - 1, 0]);
    options_points.push([rows - 1, cols - 1]);

    //plaster for restart a new game
    if (restart == true && ghosts.length !== 0) {
        ghosts_remain = ghosts.length;
        for (var k=0; k<ghosts.length; k++) {
            board[ghosts[k].i][ghosts[k].j] = 0;
        }
        ghosts = new Array();
    }

    while (ghosts_remain > 0) {
        randomNum = Math.random();
        var point = options_points[Math.floor(randomNum * 4)];
        if (board[point[0]][point[1]] != 4) {
            while (!noGhostOnThisPoint(point[0],point[1])) {
                randomNum = Math.random();
                point = options_points[Math.floor(randomNum * 4)];
                console.log(point)
            }


            ghosts_remain--;
            var g = new Object();
            g.i = point[0];
            g.j = point[1];

            ghosts.push(g)
        }
    }
}

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
 * 20 = pill
 * @constructor
 */
function Start() {

    lives_flag = false;
    lives = 3;
    bonus_flag = true;
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
    food_counter = nBalls;
    var time_limit = time; //todo: use it !
    start_time = new Date();
    var two_pills = 2;
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
                (i === 10 && j === 25
                )||
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
                } else if (randomNum < 0.2 && two_pills > 0 && (i === 2 || i === 4 || i === 10) && is_not_locked_point(i,j)){
                    board[i][j] = 20;
                    two_pills--;
                }
                else {
                    board[i][j] = 0;
                }
                cnt--;
            }
        }
    }

   locateGhosts();






    while (food_remain > 0) {
        var emptyCell = findRandomEmptyCell(board);
        var random = Math.floor(Math.random() * 3);
        if (points_remain[random]>0 && is_not_locked_point(emptyCell[0],emptyCell[1])) {
            points_remain[random]--;
            food_remain--;
            board[emptyCell[0]][emptyCell[1]] = points_indexes[random];
        }
    }
    nikud_zaz.i = null;
    while (nikud_zaz.i == null) {
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
    // UpdatePosition();
    // UpdateGhostsPosition();
    // UpdateNikudZazPosition();
    interval = setInterval(UpdatePosition, 200);
    interval_ghosts = setInterval(UpdateGhostsPosition, 350);
    interval_nikud_zaz = setInterval(UpdateNikudZazPosition,1000);
    interval_sticker = setInterval(CheckStickerOptions,100);
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

function locatePacmen() {

    point = findRandomEmptyCell(board);
    pacmen.i = point[0];
    pacmen.j = point[1];


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
    DrawBaseOfInfoCanvas();

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
            else if (board[i][j] === 20) {
                context.beginPath();
                let image = new Image();
                image.src = "images/pill.png";
                context.drawImage(image,center.x-5 , center.y-5 , 20,20)
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

        context.beginPath();
        var image = new Image();
        image.src = "images/ghosts" + (k+1).toString() + ".png";
        context.drawImage(image,center.x-icons_radius, center.y -icons_radius, 2* icons_radius ,2* icons_radius )

        // context.beginPath();
        // context.fillStyle = "pink"; //color
        // context.arc(center.x, center.y, icons_radius, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
        // context.lineTo(center.x, center.y);
        // context.fill();
        // context.beginPath();
        // context.arc(center.x + 2, center.y - 8, eye_radius, 0, 2 * Math.PI); // circle
        // context.fillStyle = "yellow"; //color
        // context.fill();
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
            while (locations[minIndex][0] < 0 || locations[minIndex][0] >= rows || locations[minIndex][1] < 0 || locations[minIndex][1] >= cols || board[locations[minIndex][0]][locations[minIndex][1]]== 4) {
                minIndex = Math.floor(Math.random() * 4);
            }
        }
        else
            minIndex = getMinIndex(steps);

        for (var n=0; n<ghosts.length; n++) {
            if (locations[minIndex][0] === ghosts[n].i && locations[minIndex][1] === ghosts[n].j ) {
                while (locations[minIndex][0] < 0 || locations[minIndex][0] >= rows || locations[minIndex][1] < 0 || locations[minIndex][1] >= cols || board[locations[minIndex][0]][locations[minIndex][1]]== 4) {
                    minIndex = Math.floor(Math.random() * 4);
                }
                break;
            }
        }
        new_i = locations[minIndex][0];
        new_j = locations[minIndex][1];

        ghosts[i].old_i = ghosts[i].i;
        ghosts[i].old_j = ghosts[i].j;
        ghosts[i].i = new_i;
        ghosts[i].j = new_j;
    }
    //DrawGhosts();

}


function GameOver() {
    msg = "";
    if (lives == 0)
        msg = "You Lost";
    else if(time_elapsed <= 0)
        if (score < 150)
            msg = "You Can Do Better than " + score + " Points";
        else
            msg = "We Have a Winner! "+ score + " Points - WoW!";

    // clearInterval(interval_sticker);
    // clearInterval(interval);
    // clearInterval(interval_ghosts);
    // clearInterval(interval_nikud_zaz);



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
        food_counter--;
        // console.log("food_counter = " + food_counter);
    }
    else if (board[pacmen.i][pacmen.j] === 12) {
        score+=15;
        food_counter--;
        // console.log("food_counter = " + food_counter);
    } else  if (board[pacmen.i][pacmen.j] === 13) {
        score+=25;
        food_counter--;
        // console.log("food_counter = " + food_counter);
    }else if (board[pacmen.i][pacmen.j] === 20) {
        if(lives<3){
            lives++;
            lives_flag = true;
        }
    } else if(   board[pacmen.i][pacmen.j] === 7) {
        board[pacmen.i][pacmen.j] = 0;
        score+=50;
        clearInterval(interval_nikud_zaz);

        nikud_zaz = null;

    }
    else { //lose points
        for (var i = 0; i < ghosts.length; i++) {
            if (ghosts[i].i===pacmen.i && ghosts[i].j===pacmen.j) {
                score -= 10;
                lives--;
                if (lives <= 0)
                     GameOver();
                else {
                    locatePacmen();
                    locateGhosts();
            }
            }

        }
    }
    board[pacmen.i][pacmen.j] = 2;
    var currentTime = new Date();
   // var time_time = new Date(time);
    time_elapsed = Math.floor(time - (currentTime - start_time) / 1000);
    if (time_elapsed <= 0)
        GameOver();



        Draw();
}



function UpdateNikudZazPosition() {

    var chance_random = 0.2;
    var random_number;
    var new_i, new_j;
    var distance_up = -1;
    var distance_down = 8-1;
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
        while (locations[maxIndex][0] < 0 || locations[maxIndex][0] >= rows || locations[maxIndex][1] < 0 || locations[maxIndex][1] >= cols || board[locations[maxIndex][0]][locations[maxIndex][1]]== 4)
            maxIndex = Math.floor(Math.random() * 4);
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
}


function CheckStickerOptions() {
    if( bonus_flag &&  ((pacmen.i === nikud_zaz.i && pacmen.j === nikud_zaz.j) || typeof(nikud_zaz.i) === "undefined") ){
        bonus_flag = false;
        $('#bonus_image').fadeIn('slow',function(){
            $('#bonus_image').delay(2000).fadeOut();
        });
    }
    else if (lives === 0){
        $('#gameover_image').fadeIn('slow',function(){
            $('#gameover_image').delay(8000).fadeOut();
        });
    }
    else if (food_counter === 0){
        $('#win_image').fadeIn('slow',function(){
            $('#win_image').delay(8000).fadeOut();
        });
    }
    else if (lives_flag){
        var element = $('#bigPill_image');
        tmpAnimation = tmpAnimation + 90;

        $({degrees: tmpAnimation - 90}).animate({degrees: tmpAnimation}, {
            duration: 2000,
            step: function(now) {
                element.css({
                    transform: 'rotate(' + now + 'deg)'
                });
            }
        });

        // $('#bigPill_image').fadeIn('slow',function(){
        //     $('#bigPill_image').delay(3000).fadeOut();
        // });
        lives_flag = false;
    }
    else {
        for (var i = 0; i < ghosts.length; i++) {
            if (ghosts[i].i===pacmen.i && ghosts[i].j===pacmen.j) {
                $('#boom_image').fadeIn('slow',function(){
                    $('#boom_image').delay(2000).stop().fadeOut();
                });
            }

        }
    }
}