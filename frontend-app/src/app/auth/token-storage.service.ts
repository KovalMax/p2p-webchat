import {TokenModel} from "./token.model";
import {Injectable} from "@angular/core";

@Injectable()
export class TokenStorageService {
    private readonly tokenKey: string = 'app/auth';

    public setToken(tokenModel: TokenModel): void {
        localStorage.setItem(this.tokenKey, JSON.stringify(tokenModel));
    }

    public hasToken(): boolean {
        return localStorage.getItem(this.tokenKey) !== null;
    }

    public getToken(): TokenModel | null {
        if (!this.hasToken()) {
            return null;
        }

        return JSON.parse(localStorage.getItem(this.tokenKey) ?? '');
    }

    public removeToken(): void {
        localStorage.removeItem(this.tokenKey);
    }
}
