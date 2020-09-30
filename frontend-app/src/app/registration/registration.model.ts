export interface Registration {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    timezone: string;
}

export interface RegistrationResponse {
    status: number;
}

export class RegistrationModel implements Registration {
    constructor(
        public email: string,
        public firstName: string,
        public lastName: string,
        public password: string,
        public timezone: string,
    ) {
    }

    static createFrom(values: Registration): Registration {
        if (!('email' in values)) {
            throw new Error('email key not found');
        }
        if (!('firstName' in values)) {
            throw new Error('firstName key not found');
        }
        if (!('lastName' in values)) {
            throw new Error('lastName key not found');
        }
        if (!('password' in values)) {
            throw new Error('password key not found');
        }

        return new RegistrationModel(
            values.email,
            values.firstName,
            values.lastName,
            values.password,
            values.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
        );
    }
}
