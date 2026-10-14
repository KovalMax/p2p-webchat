import {DOCUMENT} from '@angular/common';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, ElementRef, EventEmitter, HostListener, Inject, Input, OnChanges, Output, QueryList, Renderer2, SimpleChanges, ViewChild, ViewChildren} from '@angular/core';
import {MatTooltip} from '@angular/material/tooltip';
import {Subscription} from 'rxjs';
import {GroupMember} from './conversation.model';
import {GroupMemberAction, GroupMemberActionID, GroupMemberActionIntent} from './group-member-actions.model';

// Material's hide transition is 75ms; keep recovery beyond that transition and
// bounded even when a background tab delays animation frames or disables motion.
const SCROLL_TOOLTIP_HIDE_SETTLE_MS = 250;

@Component({
    selector: 'app-group-member-list',
    standalone: false,
    templateUrl: './group-member-list.component.html',
    styleUrls: ['./group-member-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupMemberListComponent implements OnChanges {
    @ViewChild('memberScroller') private memberScroller?: ElementRef<HTMLUListElement>;
    @ViewChildren(MatTooltip) private set tooltips(query: QueryList<MatTooltip>) {
        this.tooltipList = query;
        this.tooltipChangesSubscription?.unsubscribe();
        this.tooltipChangesSubscription = query.changes.subscribe(() => this.pruneRemovedTooltipIntents());
    }
    private tooltipList?: QueryList<MatTooltip>;
    private tooltipChangesSubscription?: Subscription;
    private suppressHoverAfterScroll = false;
    private focusedTooltip?: MatTooltip;
    private hoveredTooltip?: MatTooltip;
    private activeTooltip?: MatTooltip;
    private queuedShowGeneration = 0;
    private queuedShowFrame?: number;
    private readonly queuedHideFrames = new Set<number>();
    private queuedHideGeneration = 0;
    private tooltipHideInProgressUntil?: number;
    private awaitingScrollHideSettle = false;
    private pendingTooltipShow?: {tooltip: MatTooltip; isCurrentIntent: () => boolean};
    private scrollHideSettleTimer?: ReturnType<typeof setTimeout>;

    public constructor(
        private readonly changeDetector: ChangeDetectorRef,
        renderer: Renderer2,
        @Inject(DOCUMENT) document: Document,
        destroyRef: DestroyRef,
    ) {
        destroyRef.onDestroy(renderer.listen(document, 'scroll', event => {
            const target = event.target;
            // Captured scrolls also include unrelated containers (including CDK overlays).
            // Only movement of the list or its settings panel can displace these targets.
            if (target === document || target === document.documentElement || target === document.body ||
                (target instanceof Element && (target === this.memberScroller?.nativeElement || target.closest('.group-settings-panel') === target))) {
                this.hideTooltips();
            }
        }, {capture: true, passive: true}));
        destroyRef.onDestroy(() => {
            this.cancelQueuedShow();
            this.cancelQueuedTooltipHides();
            if (this.scrollHideSettleTimer !== undefined) clearTimeout(this.scrollHideSettleTimer);
            this.tooltipChangesSubscription?.unsubscribe();
            this.pendingTooltipShow = undefined;
            this.focusedTooltip = undefined;
            this.hoveredTooltip = undefined;
            this.activeTooltip = undefined;
        });
    }

    @Input({required: true}) public members: readonly GroupMember[] = [];
    @Input({required: true}) public actionsForMember: (member: GroupMember) => readonly GroupMemberAction[] = () => [];
    @Input() public loading = false;
    @Output() public readonly action = new EventEmitter<GroupMemberActionIntent>();

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['members'] && this.memberScroller) this.memberScroller.nativeElement.style.maxHeight = '';
    }

    public trackMember(_index: number, member: GroupMember): string { return member.userId; }
    public trackAction(_index: number, action: GroupMemberAction): GroupMemberActionID { return action.id; }
    public isTooltipDisabled(tooltip: MatTooltip): boolean {
        return this.awaitingScrollHideSettle ||
            (this.suppressHoverAfterScroll && this.focusedTooltip !== tooltip);
    }
    public showTooltipOnFocus(tooltip: MatTooltip): void {
        this.suppressHoverAfterScroll = false;
        const previousFocusedTooltip = this.focusedTooltip;
        this.focusedTooltip = tooltip;
        if (this.activeTooltip && this.activeTooltip !== tooltip && this.activeTooltip !== previousFocusedTooltip) {
            this.scheduleTooltipHide(this.activeTooltip);
        }
        this.activeTooltip = tooltip;
        tooltip.disabled = this.awaitingScrollHideSettle;
        this.changeDetector.markForCheck();
        // Material may have observed focus while this tooltip was disabled and
        // discard its native focus show request. Retry after the focus event has
        // completed, while the ownership guard prevents stale focus reopening.
        this.scheduleTooltipShow(tooltip, () => this.activeTooltip === tooltip && this.focusedTooltip === tooltip);
    }
    public showTooltipOnHover(tooltip: MatTooltip): void {
        // Scrolling can move a different button underneath a stationary pointer
        // and dispatch mouseenter. Wait for real pointer movement before treating
        // that synthetic entry as renewed hover intent.
        if (this.suppressHoverAfterScroll) return;
        this.hoveredTooltip = tooltip;
        this.activateTooltip(tooltip);
        // Scroll dismissal disables every tooltip imperatively. A real pointer
        // re-entry must re-enable this instance before Material handles hover;
        // relying on the bound input's next change-detection pass can lose the
        // mouseenter that should reopen the overlay.
        tooltip.disabled = this.awaitingScrollHideSettle;
        this.changeDetector.markForCheck();
        this.scheduleTooltipShow(tooltip, () => this.activeTooltip === tooltip && this.hoveredTooltip === tooltip && !this.suppressHoverAfterScroll);
    }
    public hideTooltipOnBlur(tooltip: MatTooltip): void {
        if (this.focusedTooltip === tooltip) this.focusedTooltip = undefined;
        const remainingTooltip = this.focusedTooltip ?? (!this.suppressHoverAfterScroll ? this.hoveredTooltip : undefined);
        if (remainingTooltip) {
            this.activeTooltip = remainingTooltip;
            remainingTooltip.disabled = this.awaitingScrollHideSettle;
            this.changeDetector.markForCheck();
            this.scheduleTooltipShow(remainingTooltip, () => this.activeTooltip === remainingTooltip &&
                (this.focusedTooltip === remainingTooltip || this.hoveredTooltip === remainingTooltip) && !this.suppressHoverAfterScroll);
        } else {
            if (this.activeTooltip === tooltip) this.activeTooltip = undefined;
            this.cancelQueuedShow();
            this.tooltipHideInProgressUntil = Date.now() + SCROLL_TOOLTIP_HIDE_SETTLE_MS;
        }
        this.changeDetector.markForCheck();
    }
    public hideTooltipOnLeave(tooltip: MatTooltip): void {
        if (this.hoveredTooltip === tooltip) this.hoveredTooltip = undefined;
        const remainingTooltip = this.focusedTooltip ?? (!this.suppressHoverAfterScroll ? this.hoveredTooltip : undefined);
        if (remainingTooltip) {
            this.activeTooltip = remainingTooltip;
            remainingTooltip.disabled = this.awaitingScrollHideSettle;
            this.changeDetector.markForCheck();
            this.scheduleTooltipShow(remainingTooltip, () => this.activeTooltip === remainingTooltip &&
                (this.focusedTooltip === remainingTooltip || this.hoveredTooltip === remainingTooltip) && !this.suppressHoverAfterScroll);
            // Pointer leave ends hover intent, but must not hide a tooltip still
            // owned by keyboard focus. Calling hide() first can race Material's
            // hide animation against the queued focus-owned show.
            if (tooltip !== remainingTooltip) this.scheduleTooltipHide(tooltip);
            return;
        }
        if (this.activeTooltip === tooltip) this.activeTooltip = undefined;
        this.cancelQueuedShow();
        this.scheduleTooltipHide(tooltip);
    }
    public restoreHoverOnPointerMove(tooltip: MatTooltip): void {
        if (!this.suppressHoverAfterScroll) return;
        this.suppressHoverAfterScroll = false;
        this.hoveredTooltip = tooltip;
        this.activateTooltip(tooltip);
        tooltip.disabled = this.awaitingScrollHideSettle;
        this.changeDetector.markForCheck();
        this.scheduleTooltipShow(tooltip, () => this.activeTooltip === tooltip && this.hoveredTooltip === tooltip && !this.suppressHoverAfterScroll);
    }
    public hideTooltips(): void {
        const hasTooltipLifecycleToSettle = this.awaitingScrollHideSettle || this.activeTooltip !== undefined ||
            this.pendingTooltipShow !== undefined || this.queuedShowFrame !== undefined ||
            this.queuedHideFrames.size > 0 ||
            (this.tooltipHideInProgressUntil !== undefined && Date.now() < this.tooltipHideInProgressUntil);
        this.suppressHoverAfterScroll = true;
        this.focusedTooltip = undefined;
        this.hoveredTooltip = undefined;
        this.cancelQueuedShow();
        this.cancelQueuedTooltipHides();
        this.activeTooltip = undefined;
        this.pendingTooltipShow = undefined;
        if (hasTooltipLifecycleToSettle) {
            this.awaitingScrollHideSettle = true;
            if (this.scrollHideSettleTimer !== undefined) clearTimeout(this.scrollHideSettleTimer);
            this.scrollHideSettleTimer = setTimeout(() => this.finishScrollHideSettle(), SCROLL_TOOLTIP_HIDE_SETTLE_MS);
        }
        this.tooltipList?.forEach(tooltip => {
            tooltip.disabled = true;
        });
        this.changeDetector.markForCheck();
    }

    public onMemberListScroll(event: Event): void {
        this.hideTooltips();
        if (event.currentTarget instanceof HTMLElement) this.alignFirstVisibleMember(event.currentTarget);
    }

    private activateTooltip(tooltip: MatTooltip): void {
        if (this.activeTooltip && this.activeTooltip !== tooltip) this.scheduleTooltipHide(this.activeTooltip);
        this.activeTooltip = tooltip;
    }

    private scheduleTooltipShow(tooltip: MatTooltip, isCurrentIntent: () => boolean): void {
        if (this.awaitingScrollHideSettle) {
            this.pendingTooltipShow = {tooltip, isCurrentIntent};
            return;
        }
        if (this.queuedShowFrame !== undefined) cancelAnimationFrame(this.queuedShowFrame);
        const generation = ++this.queuedShowGeneration;
        this.queuedShowFrame = requestAnimationFrame(() => {
            this.queuedShowFrame = undefined;
            if (generation === this.queuedShowGeneration && isCurrentIntent() && this.tooltipList?.toArray().includes(tooltip)) {
                tooltip.show(0);
            }
        });
    }

    private finishScrollHideSettle(): void {
        if (!this.awaitingScrollHideSettle) return;
        this.awaitingScrollHideSettle = false;
        this.scrollHideSettleTimer = undefined;
        this.tooltipHideInProgressUntil = undefined;
        const pending = this.pendingTooltipShow;
        this.pendingTooltipShow = undefined;
        if (pending && pending.isCurrentIntent() && this.tooltipList?.toArray().includes(pending.tooltip)) {
            pending.tooltip.disabled = false;
            this.changeDetector.markForCheck();
            this.scheduleTooltipShow(pending.tooltip, pending.isCurrentIntent);
        }
    }

    private scheduleTooltipHide(tooltip: MatTooltip): void {
        const generation = this.queuedHideGeneration;
        let frame = 0;
        frame = requestAnimationFrame(() => {
            if (generation !== this.queuedHideGeneration || !this.queuedHideFrames.delete(frame)) return;
            if (this.activeTooltip !== tooltip && this.tooltipList?.toArray().includes(tooltip)) {
                this.tooltipHideInProgressUntil = Date.now() + SCROLL_TOOLTIP_HIDE_SETTLE_MS;
                tooltip.hide(0);
            }
        });
        this.queuedHideFrames.add(frame);
    }

    private cancelQueuedTooltipHides(): void {
        this.queuedHideGeneration++;
        this.queuedHideFrames.forEach(frame => cancelAnimationFrame(frame));
        this.queuedHideFrames.clear();
    }

    private pruneRemovedTooltipIntents(): void {
        const currentTooltips = this.tooltipList?.toArray() ?? [];
        const isCurrent = (tooltip: MatTooltip | undefined): tooltip is MatTooltip => tooltip !== undefined && currentTooltips.includes(tooltip);
        if (!isCurrent(this.focusedTooltip)) this.focusedTooltip = undefined;
        if (!isCurrent(this.hoveredTooltip)) this.hoveredTooltip = undefined;
        if (!isCurrent(this.activeTooltip)) this.activeTooltip = undefined;
        if (this.pendingTooltipShow && !isCurrent(this.pendingTooltipShow.tooltip)) this.pendingTooltipShow = undefined;
        if (!this.activeTooltip) this.cancelQueuedShow();
        this.changeDetector.markForCheck();
    }

    private cancelQueuedShow(): void {
        this.queuedShowGeneration++;
        this.pendingTooltipShow = undefined;
        if (this.queuedShowFrame === undefined) return;
        cancelAnimationFrame(this.queuedShowFrame);
        this.queuedShowFrame = undefined;
    }

    private alignFirstVisibleMember(scroller: HTMLElement): void {
        const paddingBottom = Number.parseFloat(getComputedStyle(scroller).paddingBottom) || 0;
        if (scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - paddingBottom - 1) return;
        const listRect = scroller.getBoundingClientRect();
        const firstClippedRow = Array.from(scroller.children).find((child): child is HTMLElement => {
            if (!(child instanceof HTMLElement)) return false;
            const rect = child.getBoundingClientRect();
            return rect.top < listRect.top - 1 && rect.bottom > listRect.top + 1;
        });
        if (!firstClippedRow) return;

        const rowOffset = scroller.scrollTop + firstClippedRow.getBoundingClientRect().top - listRect.top;
        const alignedHeight = Math.ceil(scroller.scrollHeight - rowOffset);
        const settingsPanel = scroller.closest<HTMLElement>('.group-settings-panel');
        const availableHeight = Math.floor(Math.min(window.innerHeight, settingsPanel?.getBoundingClientRect().bottom ?? window.innerHeight) - listRect.top);
        const nextHeight = Math.min(alignedHeight, availableHeight);
        if (nextHeight <= scroller.clientHeight + 1) return;

        scroller.style.maxHeight = `${nextHeight}px`;
        scroller.scrollTop = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
    }

    @HostListener('document:pointermove', ['$event'])
    public restoreHoverAfterPointerLeavesActions(event: PointerEvent): void {
        if (!this.suppressHoverAfterScroll || (event.target instanceof Element && event.target.closest('.member-action-button'))) return;
        this.suppressHoverAfterScroll = false;
        this.changeDetector.markForCheck();
    }

    @HostListener('window:resize')
    public hideTooltipsWhenTargetsMove(): void {
        this.hideTooltips();
        if (this.memberScroller) this.memberScroller.nativeElement.style.maxHeight = '';
    }

    public requestAction(member: GroupMember, actionID: GroupMemberActionID): void {
        if (this.loading || !this.actionsForMember(member).some(action => action.id === actionID)) return;
        this.action.emit({memberUserID: member.userId, actionID});
    }
}
