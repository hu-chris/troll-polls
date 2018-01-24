$(document).ready(function() {

    $('#share').on('click', function() {
        Copy();
        alert('Poll has been copied to the clipboard.  Link it to your friends!')
    })

    if (document.getElementById('add-new-option')) {
        document.getElementById('add-new-option').addEventListener('click', function() {
            document.getElementById('new-option').style.display = 'inline-block';
            document.getElementById('add-option').style.display = 'inline-block';
        })
    
    
    document.getElementById('add-option').addEventListener('click', function() {
        var existingOptions = document.getElementsByClassName('optionlabel');
        var optArr = [];
        for (i=0; i<existingOptions.length; i++) {
            optArr.push(existingOptions[i].innerText);
        }
        var count = document.getElementById('vote-options').childElementCount;
        var useroption = document.getElementById('new-option').value;

        if (useroption == '') {
            document.getElementById('new-option').style.border = 'solid #F00'
            document.getElementById('add-error').innerHTML = 'Options cannot be blank'
        } else if (optArr.indexOf(useroption) > -1 ) {
            document.getElementById('new-option').style.border = 'solid #F00'
            document.getElementById('add-error').innerHTML = 'That option already exists'
        } else if (useroption != '') {
            var query = location.search.slice(1);
            var httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === 200) {
                        location.reload();
                    }
                }
            }
            httpRequest.open('POST', '/updateoption&id=' + query + '?' + useroption, true);
            httpRequest.send();
        }
    })

        if (document.getElementById('vote-options').childElementCount === 8) {
            document.getElementById('add-new-option').style.display = 'none';
        }
    }

    var optionarr = Object.keys(local_data[0].votes);
    var chartData = []
    for (i=0; i<optionarr.length; i++) {
        var add = [];
        add.push(optionarr[i].replace(/%2E/g,'.'));
        add.push(local_data[0].votes[optionarr[i]]);
        chartData.push(add);
    }

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Option');
        data.addColumn('number', 'Votes');
        data.addRows(chartData);

        var options = {'title': '',
                        'width':500,
                        'height':480,
                        'backgroundColor':{ fill: 'rgb(238, 235, 235)' }};

        var chart = new google.visualization.PieChart(document.getElementById('right'));
            chart.draw(data, options);
    }
});



function Copy()  {
    var url = window.location.href;
    var field = document.getElementById('urlfield');
    field.style.display = 'inline-block';
    document.getElementById('urlcopied').style.display = 'inline-block';
    field.value = url;
    field.select();
    document.execCommand("copy");


}

