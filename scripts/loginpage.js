document.getElementById('login-username').addEventListener('blur', function() {
    checkUser();
});

document.getElementById('login-password').addEventListener('keyup', function() {
    document.getElementById('password-error').innerHTML = '';
});


function checkUser() {
    var requestedName = document.getElementById('login-username').value
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                if (httpRequest.responseText.length > 4 || requestedName == '') {
                    document.getElementById('login-username').style.border = '1px solid #cbc9c9';
                    document.getElementById('username-error').innerHTML = ('');
                } else if (httpRequest.responseText.length <= 4) {
                    document.getElementById('login-username').style.border = 'solid #F00';
                    document.getElementById('username-error').innerHTML = ('Username not on file');
                }
            }
        }
    }
    httpRequest.open('GET', '/usercheck&username=' + requestedName, true);
    httpRequest.send();
}

function validateLogin() {
    var username = document.getElementById('login-username').value
    var password = document.getElementById('login-password').value

    if (username == '' || password == '') {
        return false;
    } else if (document.getElementById('username-error').innerHTML == 'Username not on file') {
        return false;
    }
}