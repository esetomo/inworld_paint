var express = require('express');
var sio = require('socket.io');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Path = mongoose.model('Path', new Schema({
    room: { type: String },
    points: {},
    updated_at: { type: Date, default: Date.now }
}));

var mongo_url = 'mongodb://localhost/paint';
if(process.env.MONGOHQ_URL){
    mongo_url = process.env.MONGOHQ_URL;
}
var db = mongoose.connect(mongo_url);
var app = express.createServer(express.logger());

app.set('views', __dirname + '/views');
app.set('view options', {layout:false});
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.render('index.jade', {rooms: io.store.rooms});
});

app.get(/\/c\/([^\/]+)\/clear/, function(req, res){
    var room = req.params[0];
    Path.remove({room:room}, function(){});
    io.sockets.in(room).emit('clear');
    res.send('clear ' + room);
});

app.get(/\/c\/([^\/]+)/, function(req, res){
    res.render('canvas.jade', {room: req.params[0]});
});

var port = process.env.PORT || 3000
app.listen(port, function(){
    console.log("Listening on " + port);
});

var io = sio.listen(app);

io.sockets.on('connection', function(socket){
    console.log("connect");

    socket.on('join', function(room){
        socket.join(room);
        socket.room = room;

        Path.find({room:room}, function(err, paths){
            paths.forEach(function(path){
                //console.log(path);
                socket.emit('path', path.points);
            });
        });
    });

    socket.on('path', function(points){
        var path = new Path();
        path.room = socket.room;
        path.points = points;
        path.save();
        socket.broadcast.to(socket.room).emit('path', points);
    });

    socket.on('disconnect', function(){
        console.log("disconnect");
    });
});
