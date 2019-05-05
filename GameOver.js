
var gameover;
var closebutton;

document.addEventListener('DOMContentLoaded', function (event) {
    // Get the modal
    gameover = document.getElementById('GameOver');

    // Get the <span> element that closes the modal
    closebutton = document.getElementsByClassName("play_again")[0];

    closebutton.addEventListener("click",Start);
});
function openG() {
    gameover.style.display = "block";
    window.clearInterval(interval);
    window.clearInterval(interval_ghosts);
    window.clearInterval(interval_nikud_zaz);
    // interval.clearInterval();
    // interval.clearInterval();
    // interval_ghosts.clearInterval();
    // interval_nikud_zaz.clearInterval();
    // interval_sticker.clearInterval();
}

function closeG() {
    gameover.style.display = "none";
    ShowDiv('Settings');
}




