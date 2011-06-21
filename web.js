var express = require('express');
var io = require('socket.io');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Path = mongoose.model('Path', new Schema({
    data: {},
    updated_at: { type: Date, default: Date.now }
}));

var db = mongoose.connect('mongodb://localhost/paint');
var app = express.createServer(express.logger());

app.set('views', __dirname + '/views');
app.set('view options', {layout:false});
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response){
    response.render('index.jade');
});

var port = process.env.PORT || 3000
app.listen(port, function(){
    console.log("Listening on " + port);
});

var socket = io.listen(app);
socket.on('connection', function(client){
    console.log("connect");

    client.on('message', function(message){
        var path = new Path();
        path.data = message;
        path.save();
        socket.broadcast(message);
        console.log(path);
    });

    client.on('disconnect', function(){
        console.log("disconnect");
    });
});
