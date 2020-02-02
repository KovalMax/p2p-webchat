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

class SocketHandler {
    /**
     * @param userMap UserMap
     */
    constructor(userMap) {
        this.userMap = userMap;
    }

    handle(io, socket) {
        this._socketHandler(socket, io);
    }

    _socketHandler(socket, io) {
        socket.on(SocketEvents.message, (req) => {
            console.info('Message received', req);

            socket.broadcast.emit(SocketEvents.message, req);
        });

        socket.on(SocketEvents.userConnected, (req) => {
            if (req.id in this.userMap.users) {
                return;
            }

            this.userMap.add(req.id, req.username);
            socket.userId = req.id;
            io.emit(SocketEvents.userJoined, {total: this.userMap.totalCount, joined: socket.userId});

            console.info('User map on user-connect', this.userMap.users);
        });

        socket.on(SocketEvents.disconnect, () => {
            if (!socket.userId in this.userMap.users) {
                return;
            }

            this.userMap.remove(socket.userId);
            io.emit(SocketEvents.userLeave, {total: this.userMap.totalCount, left: socket.userId});
            delete socket.userId;

            console.info('User map on user-disconnect', this.userMap.users);
        });
    }
}

class UserMap {
    constructor() {
        this._totalCount = 0;
        this._users = {};
    }

    get totalCount() {
        return this._totalCount;
    }

    get users() {
        return this._users;
    }

    add(id, name) {
        if (id in this._users) {
            return;
        }

        ++this._totalCount;
        this._users[id] = name;
    }

    remove(id) {
        if (!id in this._users) {
            return;
        }

        --this._totalCount;
        delete this._users[id];
    }
}

const io = new SocketIO(process.env.SOCKET_PORT);
const socketHandler = new SocketHandler(new UserMap());

io.on(SocketEvents.connection, (socket) => {
    socketHandler.handle(io, socket);
});
