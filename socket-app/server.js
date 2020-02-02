"use strict";
import SocketIO from "socket.io";
import SocketHandler from "./socketHandler";
import SocketEvents from "./socketEvents";
import UserMap from "./userMap";

const io = new SocketIO(process.env.SOCKET_PORT);
const socketHandler = new SocketHandler(new UserMap());

io.on(SocketEvents.connection, (socket) => {
    socketHandler.handle(io, socket);
});