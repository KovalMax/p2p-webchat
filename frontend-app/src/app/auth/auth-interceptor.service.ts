import {Injectable} from '@angular/core';
import {HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {exhaustMap, take} from 'rxjs/operators';

import {AuthService} from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.authService.token.pipe(
            take(1),
            exhaustMap(token => {
                if (!token) {
                    return next.handle(req);
                }

                return next.handle(
                    req.clone({
                        headers: new HttpHeaders().set(
                            'Authorization',
                            token.token_type.concat(' ', token.access_token)
                        )
                    })
                );
            })
        );
    }
}
