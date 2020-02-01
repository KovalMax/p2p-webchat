"use strict";
import SocketEvents from "./socketEvents";

export default class Socket {
    constructor() {
        this.userInitialized = false;
        this.totalUsers = 0;
        this.users = {};
    }

    ioHandler(io, socket) {
        console.info('Socket connection established');
        this.socketHandler(socket, io);
    }

    socketHandler(socket, io) {
        socket.on(SocketEvents.message, (req) => {
            console.info('Message received', req);

            socket.broadcast.emit(SocketEvents.message, req);
        });

        socket.on(SocketEvents.userConnected, (req) => {
            if (this.userInitialized) {
                return;
            }

            if (!this.users[req.id]) {
                console.info('User %s(%s) connected to chat', req.username, req.id);

                this.users[req.id] = req.username;
                socket.userId = req.id;

                ++this.totalUsers;
                this.userInitialized = true;

                io.emit(SocketEvents.userJoined, {total: this.totalUsers, joined: socket.userId});
            }
        });

        socket.on(SocketEvents.disconnect, () => {
            if (this.userInitialized) {
                this.userInitialized = false;

                --this.totalUsers;
                delete this.users[socket.userId];

                io.emit(SocketEvents.userLeave, {total: this.totalUsers, left: socket.userId});
            }
        });
    }
}