export interface TokenModel {
    token_type: string
    access_token: string
    expires_in: number
}

export class Token implements TokenModel {
    constructor(
        private _token_type: string,
        private _access_token: string,
        private _expires_in: Date
    ) {
    }

    get token_type(): string {
        return this._token_type;
    }

    get access_token(): string | null {
        if (new Date() > this._expires_in) {
            return null;
        }

        return this._access_token;
    }

    // Time in milliseconds
    get expires_in(): number {
        return this._expires_in.getTime();
    }
}
