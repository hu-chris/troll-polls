var express = require('express'),
app = express();

var port = process.env.PORT || 8080

app.use(express.static(__dirname + '/views'));
//Store all HTML files in view folder.
app.use(express.static(__dirname + '/scripts'));
//Store all JS and CSS in Scripts folder.

app.get('/', function(req, res) {
    res.sendFile('index.html');
})

app.listen(port, function(){
    console.log('app running on http://localhost:' + port);
})