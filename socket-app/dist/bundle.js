'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var SocketIO = _interopDefault(require('socket.io'));

class SocketEvents {
    static get connection() {
        return 'connection';
    }

    static get disconnect() {
        return 'disconnect';
    }

    static get userConnected() {
        return 'user-connected';
    }

    static get userLeave() {
        return 'user-leave';
    }

    static get userJoined() {
        return 'user-joined';
    }

    static get message() {
        return 'message';
    }
}

class Socket {
    /**
     * @param io SocketIO
     */
    constructor(io) {
        this.io = io;
        this.userInitialized = false;
        this.totalUsers = 0;
        this.users = {};
    }

    handle() {
        this.io.on(SocketEvents.connection, (socket) => {
            console.log('Socket connection established');
            this.socketHandler(socket);
        });
    }

    socketHandler(socket) {
        socket.on(SocketEvents.message, (req) => {
            console.log('message received', req);
            socket.broadcast.emit(SocketEvents.message, req);
        });

        socket.on(SocketEvents.userConnected, (req) => {
            if (this.userInitialized) {
                return;
            }

            if (!this.users[req.id]) {
                console.log('User %s(%s) connected to chat', req.username, req.id);
                this.users[req.id] = req.username;
                socket.userId = req.id;
                ++this.totalUsers;
                this.userInitialized = true;
                this.io.emit(SocketEvents.userJoined);
            }
        });

        socket.on(SocketEvents.disconnect, () => {
            if (this.userInitialized) {
                this.userInitialized = false;
                --this.totalUsers;
                delete this.users[socket['userId']];

                this.io.emit(SocketEvents.userLeave, {total: this.totalUsers, left: socket['userId']});
            }
        });
    }
}

const io = new SocketIO(process.env.SOCKET_PORT);
let handler = new Socket(io);
handler.handle();
