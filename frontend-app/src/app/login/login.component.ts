import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize} from 'rxjs/operators';
import {ControlsOf} from '../shared/model/controlOf';
import {Login} from './login';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent {
    public isLoading = false;
    public loginForm: FormGroup<ControlsOf<Login>>;

    constructor(
        private client: AuthService,
        private router: Router,
        private snackBar: MatSnackBar,
    ) {
        this.loginForm = new FormGroup<ControlsOf<Login>>({
            email: new FormControl(
                '',
                {
                    validators: [Validators.required, Validators.email],
                    nonNullable: true
                }
            ),
            password: new FormControl(
                '',
                {
                    validators: [Validators.required],
                    nonNullable: true
                }
            )
        });
    }

    public onSubmit(): void {
        if (this.loginForm.invalid) {
            return;
        }

        this.toggleFormLoading();
        this.client
            .login(this.loginForm.getRawValue())
            .pipe(finalize(() => this.toggleFormLoading()))
            .subscribe(
                () => {
                    this.snackBar.dismiss();
                    this.router.navigate(['home']);
                },
                error => {
                    this.snackBar.open(
                        error,
                        'Close',
                        {
                            duration: 60 * 1000,
                            horizontalPosition: 'center',
                            verticalPosition: 'top',
                        }
                    );
                }
            );
    }

    public get email() {
        return this.loginForm.controls.email;
    }

    public get password() {
        return this.loginForm.controls.password;
    }

    private toggleFormLoading(): void {
        this.isLoading = !this.isLoading;
    }
}
