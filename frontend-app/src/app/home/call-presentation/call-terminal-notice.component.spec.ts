import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppModule} from '../../app.module';
import {HomeModule} from '../home.module';
import {CallTerminalNoticeComponent} from './call-terminal-notice.component';

describe('CallTerminalNoticeComponent', () => {
    let fixture: ComponentFixture<CallTerminalNoticeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({imports: [AppModule, HomeModule]}).compileComponents();
        fixture = TestBed.createComponent(CallTerminalNoticeComponent);
        fixture.componentRef.setInput('message', 'Call ended.');
    });

    it('offers copy for a server reference and gracefully omits it for a legacy notice', () => {
        fixture.componentRef.setInput('supportRef', 'server-ref-1');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('app-copy-support-reference button')?.textContent).toContain('Copy support reference');

        fixture.componentRef.setInput('supportRef', undefined);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('app-copy-support-reference button')).toBeNull();
    });
});
