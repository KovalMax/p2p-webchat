import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {RegistrationModel, RegistrationResponse} from "./registration.model";
import {backends} from "../../environments/environment";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApplicationValidators} from "../shared/validator/ApplicationValidators";

@Injectable()
export class RegistrationService {
    constructor(
        private client: HttpClient,
        private builder: FormBuilder,
    ) {
    }

    readonly formConfig = {
        controls: {
            email: [
                '',
                {
                    validators: [
                        Validators.required,
                        Validators.email,
                        Validators.maxLength(180)
                    ]
                }
            ],
            password: [
                '',
                {
                    validators: [
                        Validators.required,
                        Validators.minLength(8),
                        Validators.maxLength(64),
                    ]
                }
            ],
            confirmPassword: [
                '',
                {
                    validators: [
                        Validators.required,
                        Validators.minLength(8),
                        Validators.maxLength(64),
                    ]
                }
            ],
            firstName: [
                '',
                {
                    validators: [
                        Validators.required,
                        Validators.minLength(1),
                        Validators.maxLength(60)
                    ]
                }
            ],
            lastName: [
                '',
                {
                    validators: [
                        Validators.required,
                        Validators.minLength(1),
                        Validators.maxLength(60)
                    ]
                }
            ],
        },
        options: {
            validators: ApplicationValidators.compare('password', 'confirmPassword')
        }
    };

    public registration(model: RegistrationModel): Observable<RegistrationResponse> {
        return this.client.post<RegistrationResponse>(backends.registration, model)
            .pipe(
                catchError((err: HttpErrorResponse) => throwError(err.error))
            );
    }

    public buildForm(): FormGroup {
        return this.builder.group(this.formConfig.controls, this.formConfig.options);
    }
}
