var express = require('express');
var sio = require('socket.io');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Path = mongoose.model('Path', new Schema({
    data: {},
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

app.get(/\/c\/(.+)/, function(req, res){
    res.render('canvas.jade', {channel: req.params[0]});
});

app.get('/clear', function(req, res){
    Path.remove({}, function(){});
    io.sockets.in('test').emit('clear');
    res.send('clear');
});

var port = process.env.PORT || 3000
app.listen(port, function(){
    console.log("Listening on " + port);
});

var io = sio.listen(app);
io.sockets.on('connection', function(socket){
    console.log("connect");

    socket.join('test');

    Path.find({}, function(err, paths){
        paths.forEach(function(path){
            //console.log(path);
            socket.emit('path', path.data);
        });
    });

    socket.on('path', function(points){
        var path = new Path();
        path.data = points;
        path.save();
        socket.broadcast.to('test').emit('path', points);
    });

    socket.on('disconnect', function(){
        console.log("disconnect");
    });
});
