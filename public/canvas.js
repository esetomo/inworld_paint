$(document).ready(function(){
    var socket = new io.Socket();
    socket.connect();
    socket.on('message', function(message){
        console.log(message);
    });
    $('#canvas').mousecapture({
        down:function(e){
            socket.send({t:'d', x:e.clientX, y:e.clientY});
        },
        move:function(e){
            socket.send({t:'m', x:e.clientX, y:e.clientY});
        },
        up:function(e){
            socket.send({t:'u', x:e.clientX, y:e.clientY});
        },
    });
});
