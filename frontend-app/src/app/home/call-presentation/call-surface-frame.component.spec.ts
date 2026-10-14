import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppModule} from '../../app.module';
import {HomeModule} from '../home.module';
import {CallSurfaceFrameComponent} from './call-surface-frame.component';
import {of} from 'rxjs';
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

@Component({
    template: `<app-call-surface-frame [collapsible]="true" (collapse)="collapseCount = collapseCount + 1">
        <app-call-profile call-profile class="projection-profile">Profile slot</app-call-profile>
        <div call-body class="projection-body">Body slot</div>
        <div call-support class="projection-support">Support slot</div>
        <div call-actions class="projection-actions">Actions slot</div>
    </app-call-surface-frame>`,
    standalone: true,
    imports: [HomeModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class CallSurfaceFrameProjectionHostComponent {
    public collapseCount = 0;
}

describe('CallSurfaceFrameComponent', () => {
    let fixture: ComponentFixture<CallSurfaceFrameComponent>;
    let component: CallSurfaceFrameComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({imports: [AppModule, HomeModule]}).compileComponents();
        fixture = TestBed.createComponent(CallSurfaceFrameComponent);
        component = fixture.componentInstance;
    });

    it('provides the shared card hierarchy and an accessible optional collapse intent', async () => {
        component.collapsible = true;
        component.collapseLabel = 'Minimize group call';
        Object.defineProperty(component, 'narrowViewport$', {value: of(false)});
        fixture.detectChanges();
        await fixture.whenStable();
        let collapseCount = 0;
        component.collapse.subscribe(() => collapseCount++);
        fixture.detectChanges();

        const frame = fixture.nativeElement.querySelector('.zwei-call-frame') as HTMLElement;
        expect(frame.getAttribute('aria-label')).toBe('Audio call');
        expect(frame.querySelector('.zwei-call-frame-header')).not.toBeNull();
        expect(frame.querySelector('.zwei-call-frame-body')).not.toBeNull();
        expect(frame.querySelector('.zwei-call-frame-footer')).not.toBeNull();
        const button = frame.querySelector('.zwei-call-frame-collapse') as HTMLButtonElement;
        expect(button.getAttribute('aria-label')).toBe('Minimize group call');
        expect(button.getAttribute('title')).toBe('Minimize group call');
        button.click();
        expect(collapseCount).toBe(1);
    });

    it('suppresses the native title and Material tooltip at the mobile breakpoint', async () => {
        component.collapsible = true;
        component.collapseLabel = 'Minimize group call';
        Object.defineProperty(component, 'narrowViewport$', {value: of(true)});
        fixture.detectChanges();
        await fixture.whenStable();

        const button = fixture.nativeElement.querySelector('.zwei-call-frame-collapse') as HTMLButtonElement;
        expect(button.getAttribute('aria-label')).toBe('Minimize group call');
        expect(button.hasAttribute('title')).toBe(false);
    });

    it('keeps collapse absent for phases that cannot be minimized', () => {
        component.collapsible = false;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zwei-call-frame-collapse')).toBeNull();
    });

    it('projects screen-sharing emphasis onto the shared frame without changing collapse semantics', () => {
        fixture.componentRef.setInput('screenSharing', true);
        component.collapsible = true;
        component.collapseLabel = 'Minimize group call';
        fixture.detectChanges();

        const frame = fixture.nativeElement.querySelector('.zwei-call-frame') as HTMLElement;
        expect(frame.classList.contains('zwei-call-frame-sharing-active')).toBe(true);
        expect(frame.querySelector<HTMLButtonElement>('.zwei-call-frame-collapse')?.getAttribute('aria-label')).toBe('Minimize group call');

        fixture.componentRef.setInput('screenSharing', false);
        fixture.detectChanges();
        expect(frame.classList.contains('zwei-call-frame-sharing-active')).toBe(false);
    });

    it('projects each content marker into its named shared slot and preserves collapse intent', async () => {
        const hostFixture = TestBed.createComponent(CallSurfaceFrameProjectionHostComponent);
        hostFixture.detectChanges();

        const frame = hostFixture.nativeElement.querySelector('.zwei-call-frame') as HTMLElement;
        const slots: Array<[string, string]> = [
            ['.projection-profile', '.zwei-call-frame-header'],
            ['.projection-body', '.zwei-call-frame-body'],
            ['.projection-support', '.zwei-call-frame-footer'],
            ['.projection-actions', '.zwei-call-frame-footer'],
        ];
        for (const [projectedSelector, slotSelector] of slots) {
            const projected = frame.querySelector(projectedSelector);
            expect(projected).not.toBeNull();
            expect(projected?.parentElement?.closest(slotSelector)).not.toBeNull();
        }
        const profile = frame.querySelector('.projection-profile') as HTMLElement;
        const support = frame.querySelector('.projection-support') as HTMLElement;
        expect(getComputedStyle(profile).display).toBe('block');
        expect(getComputedStyle(profile).minWidth).toBe('0px');
        expect(getComputedStyle(support).alignSelf).toBe('stretch');

        (frame.querySelector('.zwei-call-frame-collapse') as HTMLButtonElement).click();
        expect(hostFixture.componentInstance.collapseCount).toBe(1);
        hostFixture.destroy();
    });
});
