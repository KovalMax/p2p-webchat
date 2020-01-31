"use strict";
import Socket from "./socketHandler";
import SocketIO from "socket.io";

const io = new SocketIO(process.env.SOCKET_PORT);
let handler = new Socket(io);
handler.handle();