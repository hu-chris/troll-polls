var express = require('express'),
app = express();

var port = process.env.PORT || 8080

app.use(express.static(__dirname + 'public'));

app.get('/', function(req, res) {
    res.end('jesus fucking christ this is stupid');
})

app.listen(port, function(){
    console.log('app running on http://localhost:' + port);
})