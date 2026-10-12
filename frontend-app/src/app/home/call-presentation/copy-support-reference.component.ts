import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {SupportReferenceClipboardService} from './support-reference-clipboard.service';

@Component({
    standalone: false,
    selector: 'app-copy-support-reference',
    templateUrl: './copy-support-reference.component.html',
    styleUrls: ['./copy-support-reference.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopySupportReferenceComponent {
    private currentReference = '';
    private copyGeneration = 0;
    @Input({required: true})
    public set reference(value: string) {
        if (this.currentReference === value) return;
        this.currentReference = value;
        this.copyGeneration++;
        this.feedback = '';
        this.copyFailed = false;
    }
    public get reference(): string { return this.currentReference; }
    @Input() public compact = false;
    @Output() public readonly copyFailedChange = new EventEmitter<boolean>();
    public feedback = '';
    public copyFailed = false;

    public constructor(private readonly clipboard: SupportReferenceClipboardService) {}

    public async copy(): Promise<void> {
        const generation = ++this.copyGeneration;
        try {
            await this.clipboard.copy(this.reference);
            if (generation !== this.copyGeneration) return;
            this.copyFailed = false;
            this.feedback = 'Support reference copied.';
            this.copyFailedChange.emit(false);
        } catch {
            if (generation !== this.copyGeneration) return;
            this.copyFailed = true;
            this.feedback = 'Could not copy support reference. Copy it manually if needed.';
            this.copyFailedChange.emit(true);
        }
    }
}
