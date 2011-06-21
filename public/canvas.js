$(document).ready(function(){
    var canvas = $('#canvas')[0];
    var ctx = canvas.getContext('2d');
    var socket = new io.Socket();

    socket.connect();

    socket.on('message', function(data){
        console.log(data);

        var points = data.points;
        if(points){
            ctx.beginPath();
            var p = points.shift();
            ctx.moveTo(p.x, p.y);
            
            for(var i = 0; i < points.length; i++){
                p = points[i];
                ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
        }

        if(data.command == 'clear'){
            ctx.clearRect(0, 0, 512, 512);
        }
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
            socket.send({points:a});
        }
    });
});
