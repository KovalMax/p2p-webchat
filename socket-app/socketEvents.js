"use strict";

export default class SocketEvents {
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