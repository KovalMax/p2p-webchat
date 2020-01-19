'use strict';

const port = process.env.SOCKET_PORT;
const events = require('./events');
const io = require('socket.io')(port);

let totalUsers = 0;
let users = {};

io.on(events.connection, (socket) => {
    let userInitialized = false;

    socket.on(events.message, (req) => {
        console.log('message received', req);
        socket.broadcast.emit(events.message, req);
    });

    socket.on(events.userConnected, (req) => {
        if (userInitialized) {
            return;
        }

        if (!users[req.id]) {
            console.log('User %s(%s) connected to chat', req.username, req.id);
            users[req.id] = req.username;
            socket.userId = req.id;
            ++totalUsers;
            userInitialized = true;
            io.emit(events.userJoined);
        }
    });

    socket.on(events.disconnect, () => {
        if (userInitialized) {
            userInitialized = false;
            --totalUsers;
            delete users[socket['userId']];

            io.emit(events.userLeave, {total: totalUsers, left: socket['userId']});
        }
    });
});