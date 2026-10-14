import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-minimized-call-banner',
    standalone: false,
    templateUrl: './minimized-call-banner.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinimizedCallBannerComponent {
    @Input() public title = 'Call in progress';
    @Input() public detail = '';
    @Input() public restoreLabel = 'Return to call';
    @Input() public endLabel = 'End ongoing call';
    @Input() public endText = 'End';
    @Input() public supportReference = '';
    @Input() public sharing = false;
    @Input() public variant: 'rail' | 'chat' | 'group' = 'group';
    @Output() public readonly restore = new EventEmitter<void>();
    @Output() public readonly end = new EventEmitter<void>();
}
