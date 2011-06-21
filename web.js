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

function Channel(name){
    this.name = name;
    this.clients = [];
};

Channel.prototype.join = function (client){
    this.clients.push(client);
};

Channel.prototype.leave = function(client){
    var i = this.clients.indexOf(client);
    if(i >= 0){
        this.clients.splice(i, 1);
    }
}

Channel.prototype.send = function(from, data){
    for(var i=0; i<this.clients.length; i++){
        var client = this.clients[i];
        //if(client != from){
            client.send(data);
        //}
    }
}

var channels = {test:new Channel('test')};

var socket = io.listen(app);
socket.on('connection', function(client){
    console.log("connect");
    channels['test'].join(client);

    client.on('message', function(message){
        var path = new Path();
        path.data = message;
        path.save();
        channels['test'].send(client, message);
    });

    client.on('disconnect', function(){
        console.log("disconnect");
        channels['test'].leave(client);
    });
});
