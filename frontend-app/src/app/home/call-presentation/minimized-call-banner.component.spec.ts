import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {MatTooltip} from '@angular/material/tooltip';
import {AppModule} from '../../app.module';
import {HomeModule} from '../home.module';
import {MinimizedCallBannerComponent} from './minimized-call-banner.component';

describe('MinimizedCallBannerComponent', () => {
    let fixture: ComponentFixture<MinimizedCallBannerComponent>;
    let component: MinimizedCallBannerComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({imports: [AppModule, HomeModule]}).compileComponents();
        fixture = TestBed.createComponent(MinimizedCallBannerComponent);
        component = fixture.componentInstance;
    });

    it('uses the shared restore/end controls and preserves supplied group semantics', () => {
        component.title = 'Group call in progress';
        component.detail = '3 participants';
        component.restoreLabel = 'Return to group call';
        component.endLabel = 'End group call for everyone';
        component.endText = 'End group call';
        component.supportReference = 'support-123';
        component.sharing = true;
        let restores = 0;
        let ends = 0;
        component.restore.subscribe(() => restores++);
        component.end.subscribe(() => ends++);
        fixture.detectChanges();

        const banner = fixture.nativeElement.querySelector('.call-minimized-banner') as HTMLElement;
        expect(banner.classList.contains('call-minimized-sharing-active')).toBe(true);
        expect(banner.querySelector('.call-minimized-summary')?.getAttribute('aria-label')).toBe('Return to group call');
        expect(banner.textContent).toContain('Group call in progress');
        expect(banner.querySelector('app-copy-support-reference')).not.toBeNull();
        const end = banner.querySelector<HTMLButtonElement>('.call-minimized-end');
        expect(end?.getAttribute('aria-label')).toBe('End group call for everyone');
        expect(end?.textContent?.trim()).toBe('End group call');
        banner.querySelector<HTMLButtonElement>('.call-minimized-summary')?.click();
        end?.click();
        expect(restores).toBe(1);
        expect(ends).toBe(1);
    });

    it('preserves variant-specific minimized End tooltip behavior', () => {
        const endAttributes = (variant: 'rail' | 'chat' | 'group') => {
            fixture.componentRef.setInput('variant', variant);
            fixture.componentRef.setInput('endLabel', 'End ongoing call');
            fixture.detectChanges();
            const end = fixture.debugElement.query(By.css('.call-minimized-end'));
            return {
                ariaLabel: end.nativeElement.getAttribute('aria-label'),
                title: end.nativeElement.getAttribute('title'),
                tooltipDisabled: end.injector.get(MatTooltip).disabled,
            };
        };

        expect(endAttributes('rail')).toEqual({ariaLabel: 'End ongoing call', title: null, tooltipDisabled: true});
        expect(endAttributes('chat')).toEqual({ariaLabel: 'End ongoing call', title: null, tooltipDisabled: true});
        expect(endAttributes('group')).toEqual({ariaLabel: 'End ongoing call', title: 'End ongoing call', tooltipDisabled: false});
    });
});
