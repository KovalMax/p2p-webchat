"use strict";
import SocketEvents from "./socketEvents";

export default class SocketHandler {
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

            console.info('User map on user-connect', this.userMap);
        });

        socket.on(SocketEvents.disconnect, () => {
            if (!(socket.userId in this.userMap.users)) {
                return;
            }

            this.userMap.remove(socket.userId);
            io.emit(SocketEvents.userLeave, {total: this.userMap.totalCount, left: socket.userId});
            delete socket.userId;

            console.info('User map on user-disconnect', this.userMap);
        });
    }
}