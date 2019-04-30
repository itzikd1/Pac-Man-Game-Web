// var context = canvas.getContext("2d");

var up_key;
var down_key;
var left_key;
var right_key;

var nBalls;

var points5color;
var points15color;
var points25color;

var time;

function getKeyLeft(event) {
    var x = event.which || event.keyCode;
    if (left_key === null || (x !== 9 && x!==20 && x!==91 && x!==27 && x!==112 && x!==113 && x!==114 && x!==115
        && x!==116 && x!==117 && x!==118 && x!==119 && x!==120 && x!==121 && x!==122 && x!==123 && x!==124)) {
        left_key = x;
        document.getElementById("v_left").style.display = "block";
    }
}
function getKeyUp(event) {
    var x = event.which || event.keyCode;
    if (up_key === null || (x !== 9 && x!==20 && x!==91 && x!==27 && x!==112 && x!==113 && x!==114 && x!==115
        && x!==116 && x!==117 && x!==118 && x!==119 && x!==120 && x!==121 && x!==122 && x!==123 && x!==124)) {
        up_key = x;
        document.getElementById("v_up").style.display = "block";
    }
}
function getKeyDown(event) {
    var x = event.which || event.keyCode;
    if (down_key === null || (x !== 9 && x!==20 && x!==91 && x!==27 && x!==112 && x!==113 && x!==114 && x!==115
        && x!==116 && x!==117 && x!==118 && x!==119 && x!==120 && x!==121 && x!==122 && x!==123 && x!==124)) {
        down_key = x;
        document.getElementById("v_down").style.display = "block";
    }
}
function getKeyRight(event) {
    var x = event.which || event.keyCode;
    if (right_key === null || (x !== 9 && x!==20 && x!==91 && x!==27 && x!==112 && x!==113 && x!==114 && x!==115
        && x!==116 && x!==117 && x!==118 && x!==119 && x!==120 && x!==121 && x!==122 && x!==123 && x!==124)) {
        right_key = x;
        document.getElementById("v_right").style.display = "block";
    }
}

function sendnBalls() {
    var x = document.getElementById("nBalls").value;
    x = parseInt(x);
    if (isNaN(x))
        alert("Number of balls should be between 50 and 90 !")
    if (x >= 50 && x <= 90)
        nBalls = x;
}

function setColors() {
    var p5 = document.getElementById("5points").value;
    var p15 = document.getElementById("15points").value;
    var p25 = document.getElementById("25points").value;

    points5color = p5;
    points15color = p15;
    points25color = p25;
}

function updateTime() {
    var t = document.getElementById("time").value;

    if ( parseInt(t) >= 60){
        time = t;
    }
    else
        alert("Set at least 60 seconds for your game !")
}


