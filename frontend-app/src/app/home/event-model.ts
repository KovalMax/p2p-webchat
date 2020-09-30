import {EventType} from "./event-type.enum";

export interface Event {
    kind: EventType;
    source: string;
    destination?: string;
    context?: string;
}

export class EventModel implements Event {
    constructor(
        public kind: EventType,
        public source: string,
        public destination?: string,
        public context?: string,
    ) {
    }
}
