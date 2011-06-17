var express = require('express')

var app = express.createServer(express.logger())

app.set('views', __dirname + '/views')
app.set('view options', {layout:false})
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response){
    response.render('index.jade');
});

var port = process.env.PORT || 3000
app.listen(port, function(){
    console.log("Listening on " + port)
});
