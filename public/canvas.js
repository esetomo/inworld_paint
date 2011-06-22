$(document).ready(function(){
    var canvas = $('#canvas')[0];
    var ctx = canvas.getContext('2d');
    var socket = io.connect();

    socket.on('path', function(points){
        console.log(points);
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for(var i = 1; points[i]; i++){
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
    });

    socket.on('clear', function(){
        ctx.clearRect(0, 0, 512, 512);
    });
   
    var a;

    $('#canvas').mousecapture({
        down:function(e){
            ctx.beginPath();
            ctx.moveTo(e.clientX, e.clientY);
            a = [];
            a.push({x:e.clientX, y:e.clientY});
        },
        move:function(e){
            ctx.lineTo(e.clientX, e.clientY);
            ctx.stroke();
            a.push({x:e.clientX, y:e.clientY});
        },
        up:function(e){
            socket.emit('path', a);
        }
    });
});
