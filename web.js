var express = require('express')
var io = require('socket.io')

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

var socket = io.listen(app)
socket.on('connection', function(client){
    console.log("connect")
    client.send("Hello")
    client.on('message', function(message){
        console.log("message " + message)
    })
    client.on('disconnect', function(){
        console.log("disconnect")
    })
})
