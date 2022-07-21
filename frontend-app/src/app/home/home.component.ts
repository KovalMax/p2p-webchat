import {ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {DataProviderService} from './data-provider.service';
import {EventType} from './event-type.enum';
import {Client, ClientModel, Event, EventModel} from './event-model';
import {BehaviorSubject, Subscription} from 'rxjs';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
    public usersOnline: BehaviorSubject<Client[]>;
    private dataProvider: DataProviderService;
    private subscription: Subscription = new Subscription();
    private readonly client: Client;

    public constructor() {
        const id = (
            Math.floor(
                Math.random() * (
                    Math.floor(200) - Math.ceil(100) + 1)
            ) + Math.ceil(100)
        ).toString(10);
        this.client = ClientModel.from(id, `client-${id}`);

        this.dataProvider = new DataProviderService(this.client);
        this.usersOnline = new BehaviorSubject<Client[]>([]);
    }

    public ngOnInit(): void {
        this.subscription = this.dataProvider.getObservable().subscribe(
            msg => {
                this.handleIncomingEvent(msg as Event);
            },
            err => {
                console.log('Got error: ', err);
            },
            () => {
                console.log('Complete');
            }
        );

        this.sendEventGetUsersOnline();
    }

    @HostListener('window:beforeunload')
    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.dataProvider.close();
    }

    private handleIncomingEvent(event: Event): void {
        const clients = this.usersOnline.getValue();
        switch (event.kind) {
            case EventType.Clients:
                this.usersOnline.next(event.context as Client[]);
                break;
            case EventType.NewConnection:
                clients.push(ClientModel.from(event.source, event.context as string));
                this.usersOnline.next(clients);
                break;
            case EventType.RemoveConnection:
                clients.forEach((item, index) => {
                    if (item.id === event.source) {
                        clients.splice(index, 1);
                        return;
                    }
                });
                this.usersOnline.next(clients);
                break;
        }
    }

    private sendEventGetUsersOnline(): void {
        this.dataProvider.send(EventModel.buildOnlineUsersEvent(this.client.id));
    }
}
