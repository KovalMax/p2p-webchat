import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppModule} from '../../app.module';
import {HomeModule} from '../home.module';
import {SupportReferenceClipboardService} from './support-reference-clipboard.service';
import {CopySupportReferenceComponent} from './copy-support-reference.component';

describe('CopySupportReferenceComponent', () => {
    let fixture: ComponentFixture<CopySupportReferenceComponent>;
    let copy: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
        copy = vi.fn().mockResolvedValue(undefined);
        await TestBed.configureTestingModule({
            imports: [AppModule, HomeModule],
            providers: [{provide: SupportReferenceClipboardService, useValue: {copy}}],
        }).compileComponents();
        fixture = TestBed.createComponent(CopySupportReferenceComponent);
        fixture.componentRef.setInput('reference', 'support-123');
        fixture.detectChanges();
    });

    it('copies only the server-provided reference and announces success accessibly', async () => {
        const copyFailedChange = vi.fn();
        fixture.componentInstance.copyFailedChange.subscribe(copyFailedChange);
        const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
        expect(button.textContent).toContain('Copy support reference');
        button.click();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(copy).toHaveBeenCalledWith('support-123');
        expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain('copied');
        expect(copyFailedChange).toHaveBeenCalledWith(false);
    });

    it('announces clipboard API failure and exposes the full selectable reference accessibly', async () => {
        copy.mockRejectedValue(new Error('denied'));
        (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('button')).not.toBeNull();
        expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain('Could not copy');
        const fallback = fixture.nativeElement.querySelector('.support-reference-manual') as HTMLElement | null;
        expect(fallback?.textContent).toBe('support-123');
        expect(fallback?.getAttribute('aria-label')).toBe('Support reference, select and copy manually');
        expect(fallback?.getAttribute('tabindex')).toBe('0');
    });

    it('renders a compact accessible copy icon and retains the manual fallback', async () => {
        fixture.componentRef.setInput('compact', true);
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
        expect(button.getAttribute('aria-label')).toBe('Copy support reference');
        expect(button.querySelector('zwei-icon svg path')?.getAttribute('d')).toBeTruthy();
        expect(button.textContent?.trim()).toBe('');
        expect(fixture.nativeElement.querySelector('.support-reference-compact')).not.toBeNull();
        const copyFailedChange = vi.fn();
        fixture.componentInstance.copyFailedChange.subscribe(copyFailedChange);
        copy.mockRejectedValue(new Error('denied'));
        button.click();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain('Could not copy');
        expect(copyFailedChange).toHaveBeenCalledWith(true);
        expect(fixture.nativeElement.querySelector('.support-reference-manual')?.textContent).toBe('support-123');
        const details = fixture.nativeElement.querySelector('.support-reference-details') as HTMLElement | null;
        expect(details?.children[0]).toBe(fixture.nativeElement.querySelector('[role="status"]'));
        expect(details?.children[1]).toBe(fixture.nativeElement.querySelector('.support-reference-manual'));
    });

    it('clears old feedback when its reference changes', async () => {
        copy.mockRejectedValue(new Error('denied'));
        (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(fixture.componentInstance.copyFailed).toBe(true);

        fixture.componentRef.setInput('reference', 'support-456');
        fixture.detectChanges();

        expect(fixture.componentInstance.copyFailed).toBe(false);
        expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
        expect(fixture.nativeElement.querySelector('.support-reference-manual')).toBeNull();
        expect(fixture.nativeElement.querySelector('zwei-icon svg path')?.getAttribute('d')).not.toBe('M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z');
    });

    it('ignores a stale clipboard rejection after its reference changes', async () => {
        let rejectCopy: ((reason?: unknown) => void) | undefined;
        copy.mockReturnValue(new Promise<void>((_resolve, reject) => { rejectCopy = reject; }));
        (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
        fixture.componentRef.setInput('reference', 'support-456');
        fixture.detectChanges();
        rejectCopy?.(new Error('denied'));
        await fixture.whenStable();
        fixture.detectChanges();

        expect(fixture.componentInstance.copyFailed).toBe(false);
        expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
        expect(fixture.nativeElement.querySelector('.support-reference-manual')).toBeNull();
    });

    it('keeps newer feedback when an older copy attempt completes later', async () => {
        let rejectFirst: ((reason?: unknown) => void) | undefined;
        copy.mockReturnValueOnce(new Promise<void>((_resolve, reject) => { rejectFirst = reject; }));
        copy.mockResolvedValueOnce(undefined);
        const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
        button.click();
        button.click();
        await fixture.whenStable();
        fixture.detectChanges();
        rejectFirst?.(new Error('denied'));
        await fixture.whenStable();
        fixture.detectChanges();

        expect(fixture.componentInstance.copyFailed).toBe(false);
        expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain('Support reference copied.');
        expect(fixture.nativeElement.querySelector('.support-reference-manual')).toBeNull();
    });
});
