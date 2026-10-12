import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {SupportReferenceClipboardService} from './support-reference-clipboard.service';
import {CopySupportReferenceComponent} from './copy-support-reference.component';

describe('CopySupportReferenceComponent', () => {
    let fixture: ComponentFixture<CopySupportReferenceComponent>;
    let copy: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
        copy = vi.fn().mockResolvedValue(undefined);
        await TestBed.configureTestingModule({
            declarations: [CopySupportReferenceComponent],
            imports: [CommonModule],
            providers: [{provide: SupportReferenceClipboardService, useValue: {copy}}],
        }).compileComponents();
        fixture = TestBed.createComponent(CopySupportReferenceComponent);
        fixture.componentRef.setInput('reference', 'support-123');
        fixture.detectChanges();
    });

    it('copies only the server-provided reference and announces success accessibly', async () => {
        const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
        expect(button.textContent).toContain('Copy support reference');
        button.click();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(copy).toHaveBeenCalledWith('support-123');
        expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain('copied');
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
});
