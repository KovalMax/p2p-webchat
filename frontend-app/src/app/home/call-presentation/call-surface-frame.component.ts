import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {map, startWith} from 'rxjs';

@Component({
    selector: 'app-call-surface-frame',
    host: {'[class.call-frame-compact]': 'compact'},
    standalone: false,
    templateUrl: './call-surface-frame.component.html',
    styleUrls: ['./call-surface-frame.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallSurfaceFrameComponent {
    private readonly breakpointObserver = inject(BreakpointObserver);
    public readonly narrowViewport$ = this.breakpointObserver.observe('(max-width: 760px)').pipe(
        map(state => state.matches),
        startWith(this.breakpointObserver.isMatched('(max-width: 760px)')),
    );
    @Input() public collapsible = false;
    @Input() public collapseLabel = 'Minimize call';
    @Input() public compact = false;
    @Input() public incoming = false;
    @Input() public screenSharing = false;
    @Input() public label = 'Audio call';
    @Input() public frameClass = '';
    @Output() public readonly collapse = new EventEmitter<void>();
}
