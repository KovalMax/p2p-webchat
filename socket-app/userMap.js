"use strict";

export default class UserMap {
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
        if (!(id in this._users)) {
            return;
        }

        --this._totalCount;
        delete this._users[id];
    }
}