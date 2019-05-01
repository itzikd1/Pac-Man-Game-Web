
var up_key;
var down_key;
var left_key;
var right_key;

var nBalls;

var points5color;
var points15color;
var points25color;

var time;

var ghost;

function ButtonsValue(code) {
    switch (code) {
        case 37:
            s = "Left Button";
            break;
        case 38:
            s = "Up Button";
            break;
        case 39:
            s = "Right Button";
            break;
        case 40:
            s = "Down Button";
            break;
    }
    return s;
}

function getKeyLeft(event) {
    var x = event.which || event.keyCode;
    if (left_key === null || (x !== 9 && x!==20 && x!==91 && x!==27 && x!==112 && x!==113 && x!==114 && x!==115
        && x!==116 && x!==117 && x!==118 && x!==119 && x!==120 && x!==121 && x!==122 && x!==123 && x!==124)) {
        left_key = x;
        if (x >= 37 && x <= 40){
            document.getElementById("keyLeft").value=ButtonsValue(x);
        }
        document.getElementById("v_left").style.display = "block";
    }
}
function getKeyUp(event) {
    var x = event.which || event.keyCode;
    if (up_key === null || (x !== 9 && x!==20 && x!==91 && x!==27 && x!==112 && x!==113 && x!==114 && x!==115
        && x!==116 && x!==117 && x!==118 && x!==119 && x!==120 && x!==121 && x!==122 && x!==123 && x!==124)) {
        up_key = x;
        if (x >= 37 && x <= 40){
            document.getElementById("keyUp").value=ButtonsValue(x);
        }
        document.getElementById("v_up").style.display = "block";
    }
}
function getKeyDown(event) {
    var x = event.which || event.keyCode;
    if (down_key === null || (x !== 9 && x!==20 && x!==91 && x!==27 && x!==112 && x!==113 && x!==114 && x!==115
        && x!==116 && x!==117 && x!==118 && x!==119 && x!==120 && x!==121 && x!==122 && x!==123 && x!==124)) {
        down_key = x;
        if (x >= 37 && x <= 40){
            document.getElementById("keyDown").value=ButtonsValue(x);
        }
        document.getElementById("v_down").style.display = "block";
    }
}
function getKeyRight(event) {
    var x = event.which || event.keyCode;
    if (right_key === null || (x !== 9 && x!==20 && x!==91 && x!==27 && x!==112 && x!==113 && x!==114 && x!==115
        && x!==116 && x!==117 && x!==118 && x!==119 && x!==120 && x!==121 && x!==122 && x!==123 && x!==124)) {
        right_key = x;
        if (x >= 37 && x <= 40){
            document.getElementById("keyRight").value=ButtonsValue(x);
        }
        document.getElementById("v_right").style.display = "block";
    }
}

function sendnBalls() {
    var x = document.getElementById("nBalls").value;
    x = parseInt(x);
    if (x >= 50 && x <= 90)
        nBalls = x;
    if (isNaN(x) || x > 90 || x < 50) {
        alert("Number of balls should be between 50 and 90 !");
        return false;
    }
    else return true;

}

function setColors() {
    var p5 = document.getElementById("5points").value;
    var p15 = document.getElementById("15points").value;
    var p25 = document.getElementById("25points").value;

    points5color = p5;
    points15color = p15;
    points25color = p25;

    return true;
}

function updateTime() {
    var t = document.getElementById("time").value;

    if ( parseInt(t) >= 60){
        time = t;
        return true;
    }
    else {
        alert("Set at least 60 seconds for your game !")
        return false;
    }
}

function updateGhost() {
    var g = document.getElementById("ghost").value;

    if ( parseInt(g) >= 1 && parseInt(g) <= 3){
        ghost = g;
        return true;
    }
    else if (parseInt(g) < 1) {
        alert("Set at least 1 ghost !");
        return false;
    }
    else {
        alert("Set maximum 3 ghosts !");
        return false;
    }
}

function putRandomValues() {
    document.getElementById("keyLeft").value = "Left Button"
    left_key = 37;
    document.getElementById("keyUp").value = "Up Button"
    up_key = 38;
    document.getElementById("keyRight").value = "Right Button"
    right_key = 39;
    document.getElementById("keyDown").value = "Down Button"
    down_key = 40;

    document.getElementById("v_left").style.display = "block";
    document.getElementById("v_up").style.display = "block";
    document.getElementById("v_down").style.display = "block";
    document.getElementById("v_right").style.display = "block";

    nBalls = Math.floor(Math.random() * (90-50+1) + 50);
    document.getElementById("nBalls").value = nBalls;
    points5color = getRandomColor();
    document.getElementById("5points").value = points5color;
    points15color = getRandomColor();
    document.getElementById("15points").value = points15color;
    points25color = getRandomColor();
    document.getElementById("25points").value = points25color;
    time = Math.floor(Math.random()*1000);
    if ( time < 60 )
        time = time + 60;
    document.getElementById("time").value = time;
    ghost = Math.floor(Math.random() * 3) + 1;
    document.getElementById("ghost").value = ghost;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function submitIt() {
    var bBalls = sendnBalls();
    var bColor = setColors();
    var bGhost = updateGhost();
    var bTime = updateTime();

    if (bBalls && bColor && bGhost && bTime){
        //todo: send data to game
        ShowDiv('Game')
        // Start(left_key,up_key,down_key,right_key,nBalls,points5color,points15color,points25color,time,ghost);
    }
}

