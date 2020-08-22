import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-side',
    templateUrl: './side.component.html',
    styleUrls: ['./side.component.css']
})
export class SideComponent implements OnInit, OnDestroy {
    @Output() closeSidenav = new EventEmitter<void>();
    public isAuthenticated: boolean = false;
    private tokenSubscription: Subscription;

    constructor(private authService: AuthService, private router: Router) {
    }

    public ngOnInit(): void {
        this.tokenSubscription = this.authService.token.subscribe(token => this.isAuthenticated = !!token);
    }

    public ngOnDestroy(): void {
        this.tokenSubscription.unsubscribe();
    }

    public onClose(): void {
        this.closeSidenav.emit();
    }

    public onLogout(): void {
        this.authService.logout();
        this.router.navigate(['login']);
        this.closeSidenav.emit();
    }
}
