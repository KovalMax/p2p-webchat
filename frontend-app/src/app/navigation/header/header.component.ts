import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    @Output() sidenavToggle = new EventEmitter<void>();
    public isAuthenticated = false;
    private tokenSubscription!: Subscription;

    constructor(private authService: AuthService, private router: Router) {
    }

    public ngOnInit(): void {
        this.tokenSubscription = this.authService.token.subscribe(token => this.isAuthenticated = !!token);
    }

    public ngOnDestroy(): void {
        this.tokenSubscription.unsubscribe();
    }

    public onToggleSidenav(): void {
        this.sidenavToggle.emit();
    }

    public onLogout(): void {
        this.authService.logout();
        this.router.navigate(['login']);
    }
}
