import {ComponentFixture, TestBed} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatTooltip } from '@angular/material/tooltip';
import { GroupMember } from './conversation.model';
import { GroupMemberListComponent } from './group-member-list.component';
import { GroupMemberActionIntent } from './group-member-actions.model';
import { AppModule } from '../app.module';
import { HomeModule } from './home.module';

async function flushTooltipFrame(): Promise<void> {
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
}

async function flushScrollTooltipRecovery(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 275));
    await flushTooltipFrame();
}

describe('GroupMemberListComponent', () => {
    const member: GroupMember = { userId: 'member-1', displayName: 'Member', role: 'member', visibleFromSequence: 1, joinedAt: '2026-01-01T00:00:00Z' };
    let component: GroupMemberListComponent;
    let fixture: ComponentFixture<GroupMemberListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({imports: [AppModule, HomeModule]}).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GroupMemberListComponent);
        component = fixture.componentInstance;
    });

    it('emits typed member intents for available actions', () => {
        component.actionsForMember = () => [{ id: 'make-admin', label: 'Make admin', ariaLabel: 'Make Member an admin', icon: 'badge' }];
        const intents: GroupMemberActionIntent[] = [];
        const subscription = component.action.subscribe(intent => intents.push(intent));

        component.requestAction(member, 'make-admin');

        expect(intents).toEqual([{ memberUserID: member.userId, actionID: 'make-admin' }]);
        subscription.unsubscribe();
    });

    it('does not emit an action while loading or for an action not in the current projection', () => {
        component.actionsForMember = () => [{ id: 'make-admin', label: 'Make admin', ariaLabel: 'Make Member an admin', icon: 'badge' }];
        const intents: string[] = [];
        const subscription = component.action.subscribe(intent => intents.push(intent.actionID));
        component.loading = true;

        component.requestAction(member, 'make-admin');
        component.loading = false;
        component.requestAction(member, 'remove-member');

        expect(intents).toEqual([]);
        subscription.unsubscribe();
    });

    it('re-enables and retries keyboard tooltip display after focus', async () => {
        component.members = [member];
        component.actionsForMember = () => [{ id: 'make-admin', label: 'Make admin', ariaLabel: 'Make Member an admin', icon: 'badge' }];
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('.member-action-button') as HTMLButtonElement | null;
        const tooltip = fixture.debugElement.query(By.directive(MatTooltip)).injector.get(MatTooltip);
        const show = vi.spyOn(tooltip, 'show').mockReturnValue(undefined);
        tooltip.disabled = true;

        button?.focus();

        expect(tooltip.disabled).toBe(false);
        button?.blur();
        await flushTooltipFrame();
        expect(tooltip.disabled).toBe(false);

        button?.focus();
        await flushTooltipFrame();
        expect(tooltip.disabled).toBe(false);
        expect(show).toHaveBeenCalledWith(0);

        button?.blur();
        button?.focus();
        component.hideTooltips();
        await flushTooltipFrame();
        expect(tooltip.disabled).toBe(true);

        button?.blur();
        component.hideTooltips();
        expect(tooltip.disabled).toBe(true);
        button?.focus();
        expect(tooltip.disabled).toBe(true);
        await flushScrollTooltipRecovery();
        expect(tooltip.disabled).toBe(false);
    });

    it('does not gate focus after hideTooltips when no tooltip lifecycle needs settling', async () => {
        component.members = [member];
        component.actionsForMember = () => [{ id: 'make-admin', label: 'Make admin', ariaLabel: 'Make Member an admin', icon: 'badge' }];
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('.member-action-button') as HTMLButtonElement | null;
        const tooltip = fixture.debugElement.query(By.directive(MatTooltip)).injector.get(MatTooltip);
        const show = vi.spyOn(tooltip, 'show').mockReturnValue(undefined);
        component.hideTooltips();
        expect(tooltip.disabled).toBe(true);

        button?.focus();

        expect(tooltip.disabled).toBe(false);
        await flushTooltipFrame();
        expect(show).toHaveBeenCalledWith(0);
    });

    it('settles a scroll dismissal that overlaps a blur-owned tooltip hide', async () => {
        component.members = [member];
        component.actionsForMember = () => [{ id: 'make-admin', label: 'Make admin', ariaLabel: 'Make Member an admin', icon: 'badge' }];
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('.member-action-button') as HTMLButtonElement;
        const tooltip = fixture.debugElement.query(By.directive(MatTooltip)).injector.get(MatTooltip);
        const show = vi.spyOn(tooltip, 'show').mockReturnValue(undefined);

        component.showTooltipOnFocus(tooltip);
        await flushTooltipFrame();
        component.hideTooltipOnBlur(tooltip);
        component.hideTooltips();
        button.focus();

        expect(tooltip.disabled).toBe(true);
        await flushScrollTooltipRecovery();
        expect(tooltip.disabled).toBe(false);
        expect(show).toHaveBeenCalledWith(0);
    });

    it('leaves keyboard focus display to Material after an explicit tooltip hide', async () => {
        component.members = [member];
        component.actionsForMember = () => [{ id: 'make-admin', label: 'Make admin', ariaLabel: 'Make Member an admin', icon: 'badge' }];
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('.member-action-button') as HTMLButtonElement | null;
        const tooltip = fixture.debugElement.query(By.directive(MatTooltip)).injector.get(MatTooltip);
        component.hideTooltips();

        expect(tooltip.disabled).toBe(true);
        button?.focus();
        expect(tooltip.disabled).toBe(false);
    });

    it('dismisses on member scrolling and reopens only after keyboard focus returns', async () => {
        component.members = [member];
        component.actionsForMember = () => [{ id: 'remove-member', label: 'Remove', ariaLabel: 'Remove Member', icon: 'badge' }];
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('.member-action-button') as HTMLButtonElement;
        const list = fixture.nativeElement.querySelector('.group-members') as HTMLUListElement;
        const tooltip = fixture.debugElement.query(By.directive(MatTooltip)).injector.get(MatTooltip);
        const show = vi.spyOn(tooltip, 'show').mockReturnValue(undefined);
        const hide = vi.spyOn(tooltip, 'hide').mockReturnValue(undefined);

        button.focus();
        await flushTooltipFrame();
        list.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();
        expect(tooltip.disabled).toBe(true);
        expect(hide).toHaveBeenCalledTimes(1);
        await flushTooltipFrame();

        // A captured scroll in another container must not cancel the queued keyboard show.
        show.mockClear();
        hide.mockClear();
        button.blur();
        button.focus();
        const unrelatedScroller = document.createElement('div');
        document.body.appendChild(unrelatedScroller);
        unrelatedScroller.dispatchEvent(new Event('scroll'));
        unrelatedScroller.remove();
        await flushScrollTooltipRecovery();
        expect(tooltip.disabled).toBe(false);
        expect(show).toHaveBeenCalledWith(0);
    });

    it('ignores synthetic mouse entry after scroll until real pointer movement and does not revive outside', async () => {
        component.members = [member];
        component.actionsForMember = () => [{ id: 'remove-member', label: 'Remove', ariaLabel: 'Remove Member', icon: 'badge' }];
        fixture.detectChanges();
        const tooltip = fixture.debugElement.query(By.directive(MatTooltip)).injector.get(MatTooltip);
        const show = vi.spyOn(tooltip, 'show').mockReturnValue(undefined);

        component.hideTooltips();
        fixture.detectChanges();
        component.showTooltipOnHover(tooltip);
        expect(tooltip.disabled).toBe(true);
        await flushTooltipFrame();
        expect(show).not.toHaveBeenCalled();

        component.restoreHoverOnPointerMove(tooltip);
        expect(tooltip.disabled).toBe(false);
        await flushTooltipFrame();
        expect(show).toHaveBeenCalledWith(0);

        show.mockClear();
        component.hideTooltips();
        document.dispatchEvent(new PointerEvent('pointermove'));
        await flushTooltipFrame();
        expect(show).not.toHaveBeenCalled();
    });

    it('re-enables the tooltip before a real hover after pointer movement clears scroll suppression', async () => {
        component.members = [member];
        component.actionsForMember = () => [{ id: 'remove-member', label: 'Remove', ariaLabel: 'Remove Member', icon: 'badge' }];
        fixture.detectChanges();
        const tooltip = fixture.debugElement.query(By.directive(MatTooltip)).injector.get(MatTooltip);
        const show = vi.spyOn(tooltip, 'show').mockReturnValue(undefined);

        component.hideTooltips();
        fixture.detectChanges();
        expect(tooltip.disabled).toBe(true);

        document.dispatchEvent(new PointerEvent('pointermove'));
        expect(component.isTooltipDisabled(tooltip)).toBe(false);
        component.showTooltipOnHover(tooltip);

        expect(tooltip.disabled).toBe(false);
        await flushTooltipFrame();
        expect(show).toHaveBeenCalledTimes(1);
        expect(show).toHaveBeenCalledWith(0);
    });

    it('cancels a queued hover display when the component is destroyed', async () => {
        component.members = [member];
        component.actionsForMember = () => [{ id: 'remove-member', label: 'Remove', ariaLabel: 'Remove Member', icon: 'badge' }];
        fixture.detectChanges();
        const tooltip = fixture.debugElement.query(By.directive(MatTooltip)).injector.get(MatTooltip);
        const show = vi.spyOn(tooltip, 'show').mockReturnValue(undefined);

        component.showTooltipOnHover(tooltip);
        fixture.destroy();
        await flushTooltipFrame();

        expect(show).not.toHaveBeenCalled();
    });

    it('cancels a queued hover tooltip when the pointer leaves before the next frame', async () => {
        component.members = [member];
        component.actionsForMember = () => [{ id: 'remove-member', label: 'Remove', ariaLabel: 'Remove Member', icon: 'badge' }];
        fixture.detectChanges();
        const tooltip = fixture.debugElement.query(By.directive(MatTooltip)).injector.get(MatTooltip);
        const show = vi.spyOn(tooltip, 'show').mockReturnValue(undefined);

        component.showTooltipOnHover(tooltip);
        component.hideTooltipOnLeave(tooltip);
        await flushTooltipFrame();

        expect(show).not.toHaveBeenCalled();
    });

    it('restores the focused tooltip when hover intent ends before the next frame', async () => {
        component.members = [member];
        component.actionsForMember = () => [{ id: 'remove-member', label: 'Remove', ariaLabel: 'Remove Member', icon: 'badge' }];
        fixture.detectChanges();
        const tooltip = fixture.debugElement.query(By.directive(MatTooltip)).injector.get(MatTooltip);
        const show = vi.spyOn(tooltip, 'show').mockReturnValue(undefined);

        component.showTooltipOnFocus(tooltip);
        component.showTooltipOnHover(tooltip);
        component.hideTooltipOnLeave(tooltip);
        await flushTooltipFrame();

        expect(show).toHaveBeenCalledTimes(1);
        expect(show).toHaveBeenCalledWith(0);
    });

    it('keeps the tooltip visible on blur while the pointer remains over the action', async () => {
        component.members = [member];
        component.actionsForMember = () => [{ id: 'remove-member', label: 'Remove', ariaLabel: 'Remove Member', icon: 'badge' }];
        fixture.detectChanges();
        const tooltip = fixture.debugElement.query(By.directive(MatTooltip)).injector.get(MatTooltip);
        const show = vi.spyOn(tooltip, 'show').mockReturnValue(undefined);
        const hide = vi.spyOn(tooltip, 'hide').mockReturnValue(undefined);

        component.showTooltipOnFocus(tooltip);
        component.showTooltipOnHover(tooltip);
        component.hideTooltipOnBlur(tooltip);
        await flushTooltipFrame();

        expect(show).toHaveBeenCalledTimes(1);
        expect(show).toHaveBeenCalledWith(0);
        expect(hide).not.toHaveBeenCalled();
    });

    it('does not hide the focused tooltip when pointer leave ends only hover intent', async () => {
        component.members = [member];
        component.actionsForMember = () => [{ id: 'remove-member', label: 'Remove', ariaLabel: 'Remove Member', icon: 'badge' }];
        fixture.detectChanges();
        const tooltip = fixture.debugElement.query(By.directive(MatTooltip)).injector.get(MatTooltip);
        const show = vi.spyOn(tooltip, 'show').mockReturnValue(undefined);
        const hide = vi.spyOn(tooltip, 'hide').mockReturnValue(undefined);

        component.showTooltipOnFocus(tooltip);
        component.showTooltipOnHover(tooltip);
        component.hideTooltipOnLeave(tooltip);
        await flushTooltipFrame();

        expect(show).toHaveBeenCalledTimes(1);
        expect(show).toHaveBeenCalledWith(0);
        expect(hide).not.toHaveBeenCalled();
    });

    it('preserves a different focused tooltip when a hovered action is left', async () => {
        component.members = [member];
        component.actionsForMember = () => [
            { id: 'make-admin', label: 'Make admin', ariaLabel: 'Make Member an admin', icon: 'badge' },
            { id: 'remove-member', label: 'Remove', ariaLabel: 'Remove Member', icon: 'badge' },
        ];
        fixture.detectChanges();
        const tooltips = fixture.debugElement.queryAll(By.directive(MatTooltip)).map(element => element.injector.get(MatTooltip));
        const makeAdminShow = vi.spyOn(tooltips[0], 'show').mockReturnValue(undefined);
        const removeShow = vi.spyOn(tooltips[1], 'show').mockReturnValue(undefined);

        component.showTooltipOnHover(tooltips[0]);
        component.showTooltipOnFocus(tooltips[1]);
        component.hideTooltipOnLeave(tooltips[0]);
        await flushTooltipFrame();

        expect(makeAdminShow).not.toHaveBeenCalled();
        expect(removeShow).toHaveBeenCalledTimes(1);
        expect(removeShow).toHaveBeenCalledWith(0);
    });

    it('preserves a different hovered tooltip when focus leaves the active action', async () => {
        component.members = [member];
        component.actionsForMember = () => [
            { id: 'make-admin', label: 'Make admin', ariaLabel: 'Make Member an admin', icon: 'badge' },
            { id: 'remove-member', label: 'Remove', ariaLabel: 'Remove Member', icon: 'badge' },
        ];
        fixture.detectChanges();
        const tooltips = fixture.debugElement.queryAll(By.directive(MatTooltip)).map(element => element.injector.get(MatTooltip));
        const makeAdminShow = vi.spyOn(tooltips[0], 'show').mockReturnValue(undefined);
        const removeShow = vi.spyOn(tooltips[1], 'show').mockReturnValue(undefined);

        component.showTooltipOnHover(tooltips[0]);
        component.showTooltipOnFocus(tooltips[1]);
        component.hideTooltipOnBlur(tooltips[1]);
        await flushTooltipFrame();

        expect(makeAdminShow).toHaveBeenCalledTimes(1);
        expect(makeAdminShow).toHaveBeenCalledWith(0);
        expect(removeShow).not.toHaveBeenCalled();
    });

    it('restores focused ownership and queues display after a list-scroll dismissal', async () => {
        component.members = [member];
        component.actionsForMember = () => [
            { id: 'make-admin', label: 'Make admin', ariaLabel: 'Make Member an admin', icon: 'badge' },
            { id: 'remove-member', label: 'Remove', ariaLabel: 'Remove Member', icon: 'badge' },
        ];
        fixture.detectChanges();
        const tooltips = fixture.debugElement.queryAll(By.directive(MatTooltip)).map(element => element.injector.get(MatTooltip));
        const show = vi.spyOn(tooltips[0], 'show').mockReturnValue(undefined);
        component.showTooltipOnFocus(tooltips[0]);
        await flushTooltipFrame();
        show.mockClear();
        component.hideTooltips();
        expect(tooltips[0].disabled).toBe(true);
        expect(tooltips[1].disabled).toBe(true);

        component.showTooltipOnFocus(tooltips[0]);

        expect(tooltips[0].disabled).toBe(true);
        expect(tooltips[1].disabled).toBe(true);
        await flushScrollTooltipRecovery();
        expect(tooltips[0].disabled).toBe(false);
        expect(show).toHaveBeenCalledTimes(1);
        expect(show).toHaveBeenCalledWith(0);
    });

    it('keeps tooltip lifecycle ownership through leave, scroll dismissal, and immediate focus recovery', async () => {
        component.members = [member];
        component.actionsForMember = () => [{ id: 'remove-member', label: 'Remove', ariaLabel: 'Remove Member', icon: 'badge' }];
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('.member-action-button') as HTMLButtonElement;
        const list = fixture.nativeElement.querySelector('.group-members') as HTMLUListElement;
        const tooltip = fixture.debugElement.query(By.directive(MatTooltip)).injector.get(MatTooltip);

        component.showTooltipOnHover(tooltip);
        await new Promise(resolve => setTimeout(resolve, 250));
        expect(document.querySelector('.cdk-overlay-container .mat-mdc-tooltip')?.classList.contains('mat-mdc-tooltip-show')).toBe(true);

        // Leave schedules MatTooltip.hide() for the next frame and clears the
        // active owner. A scroll in that gap must still own the pending hide.
        component.hideTooltipOnLeave(tooltip);
        list.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();
        button.focus();
        expect(tooltip.disabled).toBe(true);
        // A second captured scroll can arrive before the first hide settles.
        // It must restart, not strand, the pending lifecycle gate.
        list.dispatchEvent(new Event('scroll'));
        button.blur();
        button.focus();
        expect(tooltip.disabled).toBe(true);
        component.showTooltipOnHover(tooltip);
        expect(tooltip.disabled).toBe(true);
        fixture.detectChanges();

        await new Promise(resolve => setTimeout(resolve, 25));
        expect(tooltip.disabled).toBe(true);
        expect(document.querySelector('.cdk-overlay-container .mat-mdc-tooltip-show')).toBeNull();
        await new Promise(resolve => setTimeout(resolve, 25));
        expect(document.querySelector('.cdk-overlay-container .mat-mdc-tooltip-show')).toBeNull();

        await new Promise(resolve => setTimeout(resolve, 250));
        await new Promise(resolve => setTimeout(resolve, 100));
        const panel = document.querySelector('.cdk-overlay-container .mat-mdc-tooltip') as HTMLElement | null;
        expect(panel?.classList.contains('mat-mdc-tooltip-show')).toBe(true);
        expect(panel ? Number.parseFloat(getComputedStyle(panel).opacity) : 0).toBeGreaterThanOrEqual(.95);
        expect(document.querySelectorAll('.cdk-overlay-container .mat-mdc-tooltip')).toHaveLength(1);
    });

    it('holds the native tooltip disabled through the latest scroll settle and shows only the latest intent', async () => {
        component.members = [member];
        component.actionsForMember = () => [
            { id: 'make-admin', label: 'Make admin', ariaLabel: 'Make Member an admin', icon: 'badge' },
            { id: 'remove-member', label: 'Remove', ariaLabel: 'Remove Member', icon: 'badge' },
        ];
        fixture.detectChanges();
        const tooltips = fixture.debugElement.queryAll(By.directive(MatTooltip)).map(element => element.injector.get(MatTooltip));
        const [firstTooltip, secondTooltip] = tooltips;
        if (!firstTooltip || !secondTooltip) throw new Error('Expected two member action tooltips');
        const firstShow = vi.spyOn(firstTooltip, 'show').mockReturnValue(undefined);
        const secondShow = vi.spyOn(secondTooltip, 'show').mockReturnValue(undefined);

        component.showTooltipOnFocus(secondTooltip);
        component.hideTooltips();
        component.showTooltipOnFocus(secondTooltip);
        fixture.detectChanges();

        expect(firstTooltip.disabled).toBe(true);
        expect(secondTooltip.disabled).toBe(true);
        await new Promise(resolve => setTimeout(resolve, 150));
        component.hideTooltips();
        component.showTooltipOnFocus(secondTooltip);
        expect(secondTooltip.disabled).toBe(true);
        await new Promise(resolve => setTimeout(resolve, 150));
        expect(secondTooltip.disabled).toBe(true);
        expect(firstShow).not.toHaveBeenCalled();
        expect(secondShow).not.toHaveBeenCalled();
        await flushScrollTooltipRecovery();
        expect(secondTooltip.disabled).toBe(false);
        await flushTooltipFrame();
        expect(firstShow).not.toHaveBeenCalled();
        expect(secondShow).toHaveBeenCalledTimes(1);
        expect(secondShow).toHaveBeenCalledWith(0);
    });

    it('recovers after scroll dismissal when Material animations are disabled', async () => {
        component.members = [member];
        component.actionsForMember = () => [{ id: 'remove-member', label: 'Remove', ariaLabel: 'Remove Member', icon: 'badge' }];
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('.member-action-button') as HTMLButtonElement;
        const list = fixture.nativeElement.querySelector('.group-members') as HTMLUListElement;
        const tooltip = fixture.debugElement.query(By.directive(MatTooltip)).injector.get(MatTooltip);

        component.showTooltipOnHover(tooltip);
        await new Promise(resolve => setTimeout(resolve, 250));
        const panel = document.querySelector('.cdk-overlay-container .mat-mdc-tooltip') as HTMLElement | null;
        expect(panel).not.toBeNull();
        if (!panel) return;
        const reducedMotionStyles = document.createElement('style');
        reducedMotionStyles.textContent = '.mat-mdc-tooltip { animation-duration: 0s !important; }';
        document.head.appendChild(reducedMotionStyles);

        component.hideTooltipOnLeave(tooltip);
        list.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();
        button.focus();
        expect(tooltip.disabled).toBe(true);

        await new Promise(resolve => setTimeout(resolve, 300));
        const recoveredPanel = document.querySelector('.cdk-overlay-container .mat-mdc-tooltip');
        expect(recoveredPanel?.classList.contains('mat-mdc-tooltip-show')).toBe(true);
        expect(recoveredPanel ? Number.parseFloat(getComputedStyle(recoveredPanel).opacity) : 0).toBeGreaterThanOrEqual(.95);
        expect(document.querySelectorAll('.cdk-overlay-container .mat-mdc-tooltip')).toHaveLength(1);
        reducedMotionStyles.remove();
    });

    it('preserves a newer hover when the previous action leaves afterward', async () => {
        component.members = [member];
        component.actionsForMember = () => [
            { id: 'make-admin', label: 'Make admin', ariaLabel: 'Make Member an admin', icon: 'badge' },
            { id: 'remove-member', label: 'Remove', ariaLabel: 'Remove Member', icon: 'badge' },
        ];
        fixture.detectChanges();
        const tooltips = fixture.debugElement.queryAll(By.directive(MatTooltip)).map(element => element.injector.get(MatTooltip));
        const makeAdminShow = vi.spyOn(tooltips[0], 'show').mockReturnValue(undefined);
        const removeShow = vi.spyOn(tooltips[1], 'show').mockReturnValue(undefined);

        component.showTooltipOnHover(tooltips[0]);
        component.showTooltipOnHover(tooltips[1]);
        component.hideTooltipOnLeave(tooltips[0]);
        await flushTooltipFrame();

        expect(makeAdminShow).not.toHaveBeenCalled();
        expect(removeShow).toHaveBeenCalledTimes(1);
        expect(removeShow).toHaveBeenCalledWith(0);
    });

    it('does not show or retain a pending tooltip after its action directive is removed during scroll settle', async () => {
        component.members = [member];
        component.actionsForMember = () => [
            { id: 'make-admin', label: 'Make admin', ariaLabel: 'Make Member an admin', icon: 'badge' },
            { id: 'remove-member', label: 'Remove', ariaLabel: 'Remove Member', icon: 'badge' },
        ];
        fixture.detectChanges();
        const removedTooltip = fixture.debugElement.queryAll(By.directive(MatTooltip))[0].injector.get(MatTooltip);
        const show = vi.spyOn(removedTooltip, 'show').mockReturnValue(undefined);

        component.showTooltipOnFocus(removedTooltip);
        component.hideTooltips();
        component.showTooltipOnFocus(removedTooltip);
        component.actionsForMember = () => [{ id: 'remove-member', label: 'Remove', ariaLabel: 'Remove Member', icon: 'badge' }];
        fixture.detectChanges();
        await flushScrollTooltipRecovery();

        expect(show).not.toHaveBeenCalled();
    });

    it('cancels a queued tooltip hide when the component is destroyed', async () => {
        component.members = [member];
        component.actionsForMember = () => [{ id: 'remove-member', label: 'Remove', ariaLabel: 'Remove Member', icon: 'badge' }];
        fixture.detectChanges();
        const tooltip = fixture.debugElement.query(By.directive(MatTooltip)).injector.get(MatTooltip);
        const hide = vi.spyOn(tooltip, 'hide').mockReturnValue(undefined);

        component.showTooltipOnHover(tooltip);
        component.hideTooltipOnLeave(tooltip);
        fixture.destroy();
        await flushTooltipFrame();

        expect(hide).not.toHaveBeenCalled();
    });

    it('cancels a queued hide frame on scroll so it cannot hide a recovered tooltip later', async () => {
        component.members = [member];
        component.actionsForMember = () => [{ id: 'remove-member', label: 'Remove', ariaLabel: 'Remove Member', icon: 'badge' }];
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('.member-action-button') as HTMLButtonElement;
        const tooltip = fixture.debugElement.query(By.directive(MatTooltip)).injector.get(MatTooltip);
        const hide = vi.spyOn(tooltip, 'hide').mockReturnValue(undefined);
        let delayedHide: FrameRequestCallback | undefined;
        const requestFrame = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
            delayedHide = callback;
            return 97;
        });

        component.showTooltipOnHover(tooltip);
        component.hideTooltipOnLeave(tooltip);
        requestFrame.mockRestore();
        expect(delayedHide).toBeDefined();

        component.hideTooltips();
        button.focus();
        await flushScrollTooltipRecovery();
        expect(tooltip.disabled).toBe(false);
        const hidesBeforeStaleCallback = hide.mock.calls.length;
        delayedHide?.(performance.now());

        expect(hide).toHaveBeenCalledTimes(hidesBeforeStaleCallback);
    });
});
