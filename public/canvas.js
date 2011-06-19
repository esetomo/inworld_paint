$(document).ready(function(){
    var canvas = $('#canvas')[0];
    var ctx = canvas.getContext('2d');
    var socket = new io.Socket();

    socket.connect();

    socket.on('message', function(data){
        var img = new Image();
        img.onload = function(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        }
        img.src = data;
    });
   
    $('#canvas').mousecapture({
        down:function(e){
            ctx.beginPath();
            ctx.moveTo(e.clientX, e.clientY);
        },
        move:function(e){
            ctx.lineTo(e.clientX, e.clientY);
            ctx.stroke();
        },
        up:function(e){
            socket.send(canvas.toDataURL());
        }
    });
});
