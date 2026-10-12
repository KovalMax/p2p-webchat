import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {SupportReferenceClipboardService} from './support-reference-clipboard.service';

@Component({
    standalone: false,
    selector: 'app-copy-support-reference',
    templateUrl: './copy-support-reference.component.html',
    styleUrls: ['./copy-support-reference.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopySupportReferenceComponent {
    @Input({required: true}) public reference = '';
    public feedback = '';
    public copyFailed = false;

    public constructor(private readonly clipboard: SupportReferenceClipboardService) {}

    public async copy(): Promise<void> {
        try {
            await this.clipboard.copy(this.reference);
            this.copyFailed = false;
            this.feedback = 'Support reference copied.';
        } catch {
            this.copyFailed = true;
            this.feedback = 'Could not copy support reference. Copy it manually if needed.';
        }
    }
}
