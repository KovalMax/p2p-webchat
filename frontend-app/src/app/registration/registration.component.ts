import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormGroup} from '@angular/forms';
import {RegistrationForm, RegistrationModel} from './registration.model';
import {RegistrationService} from './registration.service';
import {RegistrationErrorResponse} from './registration.error.model';
import {finalize} from 'rxjs/operators';
import {ControlsOf} from '../shared/model/controlOf';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
    public isLoading = false;
    public registrationForm: FormGroup<ControlsOf<RegistrationForm>>;

    constructor(
        private service: RegistrationService,
        private router: Router,
        private snackBar: MatSnackBar,
    ) {
        this.registrationForm = service.buildForm();
    }

    public onSubmit(): void {
        if (this.registrationForm.invalid) {
            this.registrationForm.updateValueAndValidity();

            return;
        }

        this.toggleFormLoading();
        this.service
            .registration(RegistrationModel.createFrom(this.registrationForm.getRawValue()))
            .pipe(finalize(() => this.toggleFormLoading()))
            .subscribe(
                () => {
                    this.snackBar.dismiss();
                    this.router.navigate(['login']);
                },
                (error: RegistrationErrorResponse) => {
                    if (error.status === 400) {
                        let msg = '';
                        error.invalidParams.forEach(param => {
                            msg += msg.concat(param.reason, '\n');
                        });
                        this.snackBar.open(
                            msg,
                            'Close',
                            {
                                duration: 60 * 1000,
                                horizontalPosition: 'center',
                                verticalPosition: 'top',
                            }
                        );
                    }
                }
            );
    }

    public get email() {
        return this.registrationForm.controls.email;
    }

    public get password() {
        return this.registrationForm.controls.password;
    }

    public get firstName() {
        return this.registrationForm.controls.firstName;
    }

    public get lastName() {
        return this.registrationForm.controls.lastName;
    }

    public get nickName() {
        return this.registrationForm.controls.nickName;
    }

    public get confirmPassword() {
        return this.registrationForm.controls.confirmPassword;
    }

    private toggleFormLoading(): void {
        this.isLoading = !this.isLoading;
    }
}
