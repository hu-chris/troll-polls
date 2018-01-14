var express = require('express'),
app = express();

var port = process.env.PORT || 8080

app.use(express.static(__dirname + 'public'));

app.get('/', function(req, res) {
    res.render('views/index.html');
})

app.listen(port, function(){
    console.log('app running on http://localhost:' + port);
})