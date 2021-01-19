import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

import { tap } from 'rxjs/internal/operators';
import { Observable } from 'rxjs/index';
import {AuthService} from '../services/auth.service';

@Injectable()
export class HttpOptionsInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      request = request.clone({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: 'Bearer ' + this.authService.getIdToken(),
        }),
      });

      return next.handle(request).pipe(
      tap(
        (event) => {},
        (error) => {
          if (error instanceof HttpErrorResponse) {
            switch (error.status) {
              case 0:
                console.error('connection', null, error);
                break;
              case 401:
                console.error('authorization', null, error);
                break;
              case 403:
                console.error('authorization', null, error);
                break;
              default:
                console.error('message', { message: error.message }, error);
            }
          }
        }
      )
    );
  }
}
