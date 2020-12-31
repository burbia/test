import { Injectable } from '@angular/core';

import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorsHandler } from './errors-handler.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private errorService: ErrorsHandler) {}

    intercept(req: HttpRequest<any>,
              next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('access_token');

        if (token && req.method !== 'GET') {
            const cloned = req.clone({
                headers: req.headers.set('Authorization',
                    'Bearer ' + token)
            });
            return next.handle(cloned).pipe(catchError((error: HttpErrorResponse) => {
                this.errorService.handleError(error);
                return throwError(error);
            }));
        } else {
            return next.handle(req);
        }
    }
}