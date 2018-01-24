function searcher() {
    var input = document.getElementById('pollsearch');
    var filter = input.value.toUpperCase();
    var polls = document.getElementsByClassName('polltitle');

    for (i=0; i<polls.length; i++) {
        if (polls[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            polls[i].parentNode.style.display = '';
        } else {
            polls[i].parentNode.style.display = 'none';
        }
    }
}
