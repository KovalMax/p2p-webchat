import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {backends} from "../../environments/environment";
import {Observable} from "rxjs";

export class DataProviderService {
    private socket: WebSocketSubject<WebSocket>;
    private readonly url: string;

    constructor(clientId: string, clientName: string) {
        this.url = `${backends.websocket}?clientId=${clientId}&clientName=${clientName}`;
        this.socket = webSocket(this.url);
    }

    public getObservable(): Observable<WebSocket> {
        return this.connection().asObservable();
    }

    public send(value: any) {
        this.connection().next(value);
    }

    public close(): void {
        this.connection().complete();
    }

    private connection(): WebSocketSubject<WebSocket> {
        if (!this.socket || this.socket.closed) {
            this.socket = webSocket(this.url);
        }

        return this.socket;
    }
}
