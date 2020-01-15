'use strict';

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.SOCKET_PORT;

http.listen(port, () => {
    console.log('Server listening at port %d', port);
});

io.on('connection', (connection) => {
    console.log('io connected');
});