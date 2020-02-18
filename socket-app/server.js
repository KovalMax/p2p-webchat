"use strict";
import {socketApp} from "./socket";
import SocketHandler from "./socketHandler";
import SocketEvents from "./socketEvents";
import UserMap from "./userMap";

const socketHandler = new SocketHandler(new UserMap());
socketApp.on(SocketEvents.connection, (socket) => {
    socketHandler.handle(socketApp, socket);
});