/**
 * Created by KMax on 26.02.2016.
 */
var app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    port = process.env.PORT || 3000,
    usersInRoom = 0,
    users = {};

server.listen(port , function() {
    console.log('Server listening at port %d', port);
});

io.on('connection', function(socket) {
    var addedUser = false;

    socket.on('userConnected', function(data) {
        if (addedUser) {
            return;
        }

        if (!users[data.id]) {
            console.log('User-%s connected.', data.user);
            users[data.id] = data.user;
            socket.userId = data.id;
            ++usersInRoom;
            addedUser = true;

            socket.broadcast.emit('userJoined',
                {usersCount: (usersInRoom - 1), users: users}
            );
            socket.emit('userJoined',
                {usersCount: (usersInRoom - 1), users: users}
            );
        } else {
            socket.emit('userJoined',
                {usersCount: (usersInRoom - 1), users: users}
            );
        }
    });

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

    socket.on('disconnect', function() {
        if (addedUser) {
            --usersInRoom;
            delete users[socket['userId']];
            console.log(users);

            socket.broadcast.emit('userLeft',
                {usersCount: (usersInRoom - 1), userLeft: socket.userId}
            );
        }
    });

    socket.on('typing', function(data) {
        socket.broadcast.emit('userTyping', {id: data.id});
    });
    
    socket.on('stopTyping', function(data) {
        socket.broadcast.emit('userStopTyping', {id: data.id});
    });
});
