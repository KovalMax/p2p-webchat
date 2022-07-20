import {Token} from './token';
import {Injectable} from '@angular/core';

@Injectable()
export class TokenStorageService {
    private readonly tokenKey: string = 'app/auth';

    public setToken(token: Token): void {
        localStorage.setItem(this.tokenKey, JSON.stringify(token));
    }

    public hasToken(): boolean {
        return localStorage.getItem(this.tokenKey) !== null;
    }

    public getToken(): Token {
        if (!this.hasToken()) {
            throw new Error('Token not found inside storage');
        }

        return JSON.parse(localStorage.getItem(this.tokenKey) ?? '');
    }

    public removeToken(): void {
        localStorage.removeItem(this.tokenKey);
    }
}
