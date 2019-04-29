var context = canvas.getContext("2d");

var up_key;
var down_key;
var left_key;
var right_key;

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




