"use strict";
import Socket from "./socketHandler";
import SocketIO from "socket.io";
import SocketEvents from "./socketEvents";

const io = new SocketIO(process.env.SOCKET_PORT);

io.on(SocketEvents.connection, (socket) => {
    let handler = new Socket();
    handler.ioHandler(io, socket);
});