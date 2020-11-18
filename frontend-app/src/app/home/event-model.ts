import {EventType} from "./event-type.enum";

export interface Event {
    kind: EventType;
    source: string;
    destination?: string;
    context?: string | {};
}

export interface Client {
    id: string;
    name: string;
}

export class ClientModel implements Client{
    constructor(private _id: string, private _name: string) {
    }

    public get id(): string {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public static from(id: string, name: string): Client {
        return new ClientModel(id, name);
    }
}

export class EventModel implements Event {
    constructor(
        public kind: EventType,
        public source: string,
        public destination?: string,
        public context?: string,
    ) {
    }

    public static buildOnlineUsersEvent(clientId: string): Event {
        return new EventModel(
            EventType.Clients,
            clientId
        );
    }
}
