
document.getElementById('add-an-option').addEventListener('click', function() {
    var count = document.getElementById('optioncontainer').childElementCount + 1

    if (count - 3 < 8) {
        var add = document.createElement('input');
        add.type = 'text';
        add.className = 'createfields'
        add.id = 'polloption' + count
        add.name = 'option' + count
        add.maxLength = 25;
        document.getElementById('optioncontainer').appendChild(add)
    }
});


document.getElementById('polltitle').addEventListener('keyup', function() {
    document.getElementById('title-error').innerHTML = '';
    document.getElementById('polltitle').style.border = '1px solid #cbc9c9';
});

function validatePoll() {
    if (document.getElementById('polltitle').value == '') {
        document.getElementById('polltitle').style.border = 'solid #F00';
        document.getElementById('title-error').innerHTML = ('Please enter a title');
        return false;
    } else if (document.getElementById('polloption1').value == '') {
        document.getElementById('polloption1').style.border = 'solid #F00';
        document.getElementById('option1-error').innerHTML = ('Polls must have at least 2 options');
        return false;
    } else if (document.getElementById('polloption2').value == '') {
        document.getElementById('polloption2').style.border = 'solid #F00';
        document.getElementById('option2-error').innerHTML = ('Polls must have at least 2 options');
        return false;
    }
}