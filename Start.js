
function PageLoaded()
{
    ShowDiv('Welcome');
}
function ShowDiv(id)
{
    //hide all sections

    var section1 = document.getElementById('Game');
    section1.style.visibility="hidden";
    var section2 = document.getElementById('Settings');
    section2.style.visibility="hidden";
    var section3 = document.getElementById('My Account');
    section3.style.visibility="hidden";
    var section4 = document.getElementById('About');
    section4.style.visibility="hidden";
    var section5 = document.getElementById('Welcome');
    section5.style.visibility="hidden";

    //show only one section
    var selected = document.getElementById(id);
    selected .style.visibility="visible";
}

