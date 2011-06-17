var socket = new io.Socket('localhost');
socket.connect();
socket.on('message', function(message){
    $('#content').append(message)
});