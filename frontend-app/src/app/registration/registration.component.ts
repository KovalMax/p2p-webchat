import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AbstractControl, FormGroup} from "@angular/forms";
import {RegistrationModel} from "./registration.model";
import {RegistrationService} from "./registration.service";
import {InvalidParamMap, RegistrationErrorResponse} from "./registration.error.model";
import {finalize} from "rxjs/operators";

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
    public isLoading: boolean = false;
    public form: FormGroup;

    constructor(
        private service: RegistrationService,
        private router: Router,
        private snackBar: MatSnackBar,
    ) {
        this.form = service.buildForm();
    }

    public onSubmit(): void {
        if (this.form.invalid) {
            this.form.updateValueAndValidity();

            return;
        }

        this.toggleFormLoading();
        this.service.registration(RegistrationModel.createFrom(this.form.getRawValue()))
            .pipe(finalize(() => this.toggleFormLoading()))
            .subscribe(
                () => {
                    this.snackBar.dismiss();
                    this.router.navigate(['login']);
                },
                (error: RegistrationErrorResponse) => {
                    if (error.status === 400) {
                        let msg: string = '';
                        error.invalidParams.forEach(param => {
                            msg += msg.concat(param.reason, '\n');
                        });
                        this.snackBar.open(
                            msg,
                            'Close',
                            {
                                duration: 60 * 1000,
                                horizontalPosition: "center",
                                verticalPosition: "top",
                            }
                        );
                    }
                }
            );
    }

    public get email(): AbstractControl {
        return this.form.controls.email;
    }

    public get password(): AbstractControl {
        return this.form.controls.password;
    }

    public get firstName(): AbstractControl {
        return this.form.controls.firstName;
    }

    public get lastName(): AbstractControl {
        return this.form.controls.lastName;
    }

    public get nickName(): AbstractControl {
        return this.form.controls.nickName;
    }

    public get confirmPassword(): AbstractControl {
        return this.form.controls.confirmPassword;
    }

    private toggleFormLoading(): void {
        this.isLoading = !this.isLoading;
    }
}
