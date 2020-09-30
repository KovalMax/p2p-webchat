import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {DataProviderService} from "./data-provider.service";
import {EventType} from "./event-type.enum";
import {EventModel} from "./event-model";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
    public users?: string[];
    private dataProvider: DataProviderService;
    private readonly id: number;

    constructor() {
        let min = Math.ceil(100);
        let max = Math.floor(200);
        this.id = Math.floor(Math.random() * (max - min + 1)) + min;

        this.dataProvider = new DataProviderService(this.id.toString(10), `client-${this.id}`);
    }

    ngOnInit(): void {
        this.dataProvider.getObservable().subscribe(
            msg => console.log('Got msg: ', msg),
            err => console.log('Got error: ', err),
            () => console.log('Complete')
        );

        this.dataProvider.send(new EventModel(EventType.Clients, this.id.toString(10)));
    }

    ngOnDestroy(): void {
        this.dataProvider.close();
    }
}
