function validateReg() {
    var username = document.getElementById('reg-username').value;
    var email = document.getElementById('reg-email').value;
    var password = document.getElementById('reg-password').value;
    var confirmpassword = document.getElementById('reg-confirm-password').value;
    if (username == '' || email == '' || password == '' || confirmpassword == '') {
        if (username == '') {
            document.getElementById('reg-username').style.border = 'solid #F00';
            document.getElementById('username-error').innerHTML = ('Please enter a username');
        } else {
            document.getElementById('reg-username').style.border = '1px solid #cbc9c9';
            document.getElementById('username-error').innerHTML = ('');
        }

        if (email == '') {
            document.getElementById('reg-email').style.border = 'solid #F00';
            document.getElementById('email-error').innerHTML = ('Please enter an email address');
        } else {
            document.getElementById('reg-email').style.border = '1px solid #cbc9c9';
            document.getElementById('email-error').innerHTML = ('');
        }
        
        if (password == '') {
            document.getElementById('reg-password').style.border = 'solid #F00';
            document.getElementById('password-error').innerHTML = ('Please enter a password');
        } else {
            document.getElementById('reg-password').style.border = '1px solid #cbc9c9';
            document.getElementById('password-error').innerHTML = ('');
        }

        if (confirmpassword == '') {
            document.getElementById('reg-confirm-password').style.border = 'solid #F00';
            document.getElementById('confirm-password-error').innerHTML = ('Please confirm your password');
        } else {
            document.getElementById('reg-confirm-password').style.border = '1px solid #cbc9c9';
            document.getElementById('confirm-password-error').innerHTML = ('');
        }
        return false;
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        clearErrors();
        document.getElementById('reg-email').style.border = 'solid #F00';
        document.getElementById('email-error').innerHTML = ('Email address invalid');
        return false;
    } else if (confirmpassword != password) {
        clearErrors();
        document.getElementById('reg-confirm-password').style.border = 'solid #F00';
        document.getElementById('confirm-password-error').innerHTML = ('Passwords do not match');
        return false;
    } else if (document.getElementById('username-error').innerHTML == ('Username is already taken') || document.getElementById('email-error').innerHTML == ('Email is already on file')) {
        return false;
    }
}

function clearErrors() {
    document.getElementById('reg-username').style.border = '1px solid #cbc9c9';
    document.getElementById('reg-email').style.border = '1px solid #cbc9c9';
    document.getElementById('reg-password').style.border = '1px solid #cbc9c9';
    document.getElementById('reg-confirm-password').style.border = '1px solid #cbc9c9';
    document.getElementById('username-error').innerHTML = ('');
    document.getElementById('email-error').innerHTML = ('');
    document.getElementById('password-error').innerHTML = ('');
    document.getElementById('confirm-password-error').innerHTML = ('');
}

function checkUsers() {
    var requestedName = document.getElementById('reg-username').value
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                if (httpRequest.responseText.length > 4) {
                    document.getElementById('reg-username').style.border = 'solid #F00';
                    document.getElementById('username-error').innerHTML = ('Username is already taken');
                } else if (httpRequest.responseText.length <= 4) {
                    document.getElementById('reg-username').style.border = '1px solid #cbc9c9';
                    document.getElementById('username-error').innerHTML = ('');
                }
            }
        }
    }
    httpRequest.open('GET', '/usercheck&username=' + requestedName, true);
    httpRequest.send();
}

function checkEmail() {
    var requestedEmail = document.getElementById('reg-email').value
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                if (httpRequest.responseText.length > 4) {
                    document.getElementById('reg-email').style.border = 'solid #F00';
                    document.getElementById('email-error').innerHTML = ('Email is already on file');
                } else if (httpRequest.responseText.length <= 4) {
                    document.getElementById('reg-email').style.border = '1px solid #cbc9c9';
                    document.getElementById('email-error').innerHTML = ('');
                }
            }
        }
    }
    httpRequest.open('GET', '/emailcheck&email=' + requestedEmail, true);
    httpRequest.send();
}

function clearPassError() {
    document.getElementById('reg-password').style.border = '1px solid #cbc9c9';
    document.getElementById('password-error').innerHTML = ('');
}

function clearConfirmPassError() {
    document.getElementById('reg-confirm-password').style.border = '1px solid #cbc9c9';
    document.getElementById('confirm-password-error').innerHTML = ('');
}
