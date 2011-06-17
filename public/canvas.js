$(document).ready(function(){
    var socket = new io.Socket();
    socket.connect();
    socket.on('message', function(message){
        $('#content').append(message);
    });
    $('#message').change(function(){
        socket.send(this.value);
        this.value = '';
    });
});
