"use strict";

import {readFileSync} from "fs";
import {createServer} from "https";
import SocketIO from "socket.io";

const isProd = process.env.NODE_ENV === 'production';
export const socketApp = create(isProd);

/**
 * @param secured bool
 * @return SocketIO.Server
 */
function create(secured) {
    let socket = SocketIO(process.env.SOCKET_PORT);
    if (secured) {
        secured = createServer({
            key: readFileSync(process.env.SSL_KEY),
            cert: readFileSync(process.env.SSL_CERT)
        });
        socket = SocketIO(secured);
        secured.listen(process.env.SOCKET_PORT);
    }

    return socket;
}