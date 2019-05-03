
var modal;
var span;
var about_button;

document.addEventListener('DOMContentLoaded', function (event) {
    // Get the modal
    modal = document.getElementById('About');

    // Get the <span> element that closes the modal
    span = document.getElementsByClassName("close")[0];

    span.addEventListener("click",closeD);
    window.addEventListener("click",click_window);
    addEventListener("keydown", click_escape);

});
function openD() {
    modal.style.display = "block";
}

function closeD() {
    modal.style.display = "none";
}

function click_window(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
function click_escape(e){
    if(e.which == 27){
        modal.style.display = "none";
    }

}





