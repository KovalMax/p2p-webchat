import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {backends} from "../../environments/environment";
import {Observable} from "rxjs";
import {Client, Event} from "./event-model";

export class DataProviderService {
    private socket: WebSocketSubject<WebSocket | Event>;
    private readonly url: string;

    public constructor(client: Client) {
        this.url = `${backends.websocket}?clientId=${client.id}&clientName=${client.name}`;
        this.socket = this.getSocket();
    }

    public getObservable(): Observable<WebSocket | Event> {
        return this.getSocket().asObservable();
    }

    public send(event: Event): void {
        this.getSocket().next(event);
    }

    public close(): void {
        this.socket.complete();
        this.socket.unsubscribe();
    }

    private getSocket(): WebSocketSubject<WebSocket | Event> {
        if (!this.socket || this.socket.closed) {
            this.socket = webSocket(this.url);
        }

        return this.socket;
    }
}
