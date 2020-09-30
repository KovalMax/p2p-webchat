import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {finalize} from "rxjs/operators";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent {
    public isLoading: boolean = false;
    public form!: FormGroup;

    constructor(
        private client: AuthService,
        private router: Router,
        private snackBar: MatSnackBar,
        private builder: FormBuilder
    ) {
        this.form = builder.group({
            email: builder.control(
                '',
                {validators: [Validators.required, Validators.email]}
            ),
            password: builder.control(
                '',
                {validators: [Validators.required]}
            )
        });
    }

    public onSubmit(): void {
        if (this.form.invalid) {
            return;
        }

        this.toggleFormLoading();
        this.client.login(this.form.getRawValue())
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
                            horizontalPosition: "center",
                            verticalPosition: "top",
                        }
                    );
                }
            );
    }

    private toggleFormLoading(): void {
        this.isLoading = !this.isLoading;
    }
}
