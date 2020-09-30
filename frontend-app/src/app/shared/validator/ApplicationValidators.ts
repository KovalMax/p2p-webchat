import {AbstractControl, FormGroup} from "@angular/forms";

export class ApplicationValidators {
    static compare(compare: string, compareAgainst: string) {
        return (group: FormGroup) => {
            let compareControl: AbstractControl | null = group.get(compare);
            let compareAgainstControl: AbstractControl | null = group.get(compareAgainst);
            if (!compareControl || !compareAgainstControl) {
                return;
            }

            if (compareAgainstControl.errors && !compareAgainstControl.errors.mustMatch) {
                return;
            }

            if (compareControl.value !== compareAgainstControl.value) {
                compareAgainstControl.setErrors({ mustMatch: true });
            } else {
                compareAgainstControl.setErrors(null);
            }
        };
    }
}
