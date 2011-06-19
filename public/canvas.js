$(document).ready(function(){
    var ctx = $('#canvas')[0].getContext('2d');
    var socket = new io.Socket();
    socket.connect();
    socket.on('message', function(message){
        console.log(message);
        // $('#canvas').drawLine(message);
    });
    var a;
    var i;
    $('#canvas').mousecapture({
        down:function(e){
            a = {
                strokeStyle:"#000",
                strokeWidth:3,
                strokeCap:"round",
                strokeJoin:"round",
                x1:e.clientX,
                y1:e.clientY,
            };
            i = 2;
            ctx.beginPath();
            ctx.moveTo(e.clientX, e.clientY);
        },
        move:function(e){
            a['x' + i] = e.clientX;
            a['y' + i] = e.clientY;
            i++;
            ctx.lineTo(e.clientX, e.clientY);
            ctx.stroke();
        },
        up:function(e){
            //socket.send(a);
        }
    });
});
