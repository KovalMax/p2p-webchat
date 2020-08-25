import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {LoginModel} from "../login/login.model";
import {Token, TokenModel} from "./token.model";
import {environment} from "../../environments/environment";
import {Injectable} from "@angular/core";
import {TokenStorageService} from "./token-storage.service";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class AuthService {
    constructor(private http: HttpClient, private storage: TokenStorageService) {
    }

    private _token: BehaviorSubject<Token | null> = new BehaviorSubject<Token | null>(null);

    get token(): BehaviorSubject<Token | null> {
        return this._token;
    }

    public login(login: LoginModel): Observable<TokenModel> {
        return this.http.post<TokenModel>(environment.backends.login, login)
            .pipe(
                catchError((res: HttpErrorResponse) => {
                    console.log(res);
                    return throwError(res.error && res.error.message ? res.error.message : 'Unexpected error.');
                }),
                tap(token => {
                    this.handleToken(token);
                    this.storage.setToken(token);
                })
            );
    }

    public autoLogin(): void {
        if (!this.storage.hasToken()) {
            return;
        }

        this.handleToken(this.storage.getToken());
    }

    public logout(): void {
        this.token.next(null);
        this.storage.removeToken();
    }

    private handleToken(token: TokenModel | null): void {
        if (!token) {
            return;
        }

        let expirationDate = new Date(new Date().getTime() + (+token.expires_in * 1000));
        let tokenModel = new Token(token.token_type, token.access_token, expirationDate);
        this._token.next(tokenModel);
    }
}
