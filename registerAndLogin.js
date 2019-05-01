var reg2 = new Array();
var attempt = 5; // Variable to count number of attempts.

//todo function for first user is this:
var person = {
    username: "a",
    firstname: "a",
    lastname: "a",
    password: "a",
    email: "a@a.com",
    date: "12/04/1991"
}
reg2.push(person)


function check_uname() {
    var pattern = /^[a-zA-Z]*$/;
    var uname = $("#form_uname").val();
    if (pattern.test(uname) && uname !== '') {
        $("#form_uname").css("border-bottom", "2px solid #34F458");
    } else {
        $("#form_uname").css("border-bottom", "2px solid #F90A0A");
        error_uname = true;
    }
}


function check_password() {
    var pattern = /^[a-zA-Z]*$/;
    var pattern2 = /^[0-9]*$/;
    var password_length = $("#form_password").val().length;
    var password = $("#form_password").val();
    if (password_length < 8 || pattern.test(password) || pattern2.test(password)) {
        $("#form_password").css("border-bottom", "2px solid #F90A0A");
        error_password = true;
    } else {
        $("#form_password").css("border-bottom", "2px solid #34F458");
    }
}


function check_fname() {
    var pattern = /^[a-zA-Z]*$/;
    var fname = $("#form_fname").val();
    if (pattern.test(fname) && fname !== '') {
        $("#form_fname").css("border-bottom", "2px solid #34F458");
    } else {
        $("#form_fname").css("border-bottom", "2px solid #F90A0A");
        error_fname = true;
    }
}


function check_sname() {
    var pattern = /^[a-zA-Z]*$/;
    var sname = $("#form_sname").val()
    if (pattern.test(sname) && sname !== '') {
        $("#form_sname").css("border-bottom", "2px solid #34F458");
    } else {
        $("#form_sname").css("border-bottom", "2px solid #F90A0A");
        error_sname = true;
    }
}


function check_email() {
    var pattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    var email = $("#form_email").val();
    if (pattern.test(email) && email !== '') {
        $("#form_email").css("border-bottom", "2px solid #34F458");
    } else {
        $("#form_email").css("border-bottom", "2px solid #F90A0A");
        error_email = true;
    }
}


function check_date() {
    if ($("#form_date").val() !== '') {
        $("#form_date").css("border-bottom", "2px solid #34F458");
    } else {
        $("#form_date").css("border-bottom", "2px solid #F90A0A");
        error_fdate = true;

    }
}


function register() {
    error_fname = false;
    error_sname = false;
    error_email = false;
    error_password = false;
    error_fdate = false;

    check_uname();
    check_password();
    check_fname();
    check_sname();
    check_email();
    check_date();

    if (error_fname === false && error_sname === false && error_email === false && error_password === false && error_fdate === false) {
        alert("Registration Successfull");
        var person = {
            username: $("#form_uname").val(),
            firstname: $("#form_fname").val(),
            lastname: $("#form_sname").val(),
            password: $("#form_password").val(),
            email: $("#form_email").val(),
            date: $("#form_date").val()
        }

        reg2.push(person);
        //go to log-in page here if retunred true - else alert if false
        ShowDiv('Login')
        return true;
    } else {
        alert("Please Fill the form Correctly");
        return false;
    }
}

function validate(){
    var username = document.getElementById("loginID").value;
    var password = document.getElementById("loginPASS").value;
    index = reg2.find(o => o.username==username)
    if (index==undefined)
        alert ("Not such a user exist");
    else if ( index.password == $("#loginPASS").val()){
        alert ("Login successfully");
        ShowDiv('Game');
        HideWelcome();
        ShowGame();
        return true;
    }
    else{
        attempt --;// Decrementing by one.
        alert("You have left "+attempt+" attempt;");
// Disabling fields after 5 attempts.
        if( attempt == 0){
            document.getElementById("loginID").disabled = true;
            document.getElementById("loginPASS").disabled = true;
            document.getElementById("loginButton").disabled = true;
            return false;
        }
    }
}