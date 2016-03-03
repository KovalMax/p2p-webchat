/**
 * Created by KMax on 26.02.2016.
 */
var app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    port = process.env.PORT || 3000,
    moment = require('moment');

server.listen(port , function() {
    console.log('Server listening at port %d', port);
});

io.on('connection', function(socket) {
    console.log(
        moment().format('YY-MM-DD HH:mm:ss')
        + ' - New client connected'
    );

    socket.on('message', function(data) {
        console.log(
            data.time
            + ' - Message received '
            + data.name
            + ":"
            + data.message
        );

        socket.broadcast.emit('message',
            {
                name: data.name,
                message: data.message,
                time: data.time
            }
        );

        socket.emit('message',
            {
                name: data.name,
                message: data.message,
                time: data.time
            }
        );
    });
});
