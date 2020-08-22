import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    public loginForm: FormGroup;
    public loginError: string = null;
    public isLoading: boolean = false;

    constructor(private client: AuthService, private router: Router, private snackBar: MatSnackBar) {
    }

    public ngOnInit(): void {
        this.loginForm = new FormGroup({
            email: new FormControl('', {
                validators: [Validators.required, Validators.email]
            }),
            password: new FormControl('', {
                validators: [Validators.required]
            })
        });
    }

    public onSubmit(): void {
        if (this.loginForm.invalid) {
            return;
        }
        this.isLoading = true;
        this.client.login(this.loginForm.getRawValue())
        .subscribe(
            () => {
                this.isLoading = false;
                this.snackBar.dismiss();
                this.router.navigate(['home']);
            },
            error => {
                this.isLoading = false;
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
}
