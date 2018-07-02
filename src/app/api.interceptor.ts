import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
  HttpHandler,
  HttpResponse,
  HttpErrorResponse

} from '@angular/common/http';
import { tap } from 'rxjs/internal/operators';
import { environment } from '../environments/environment';
import { APP_ACTIONS } from './_store/app-actions';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  UNAUTHORIZED_STATUS = 401;
  // TODO: should be removed once we remove the splash screen
  TEMP_REDIRECT_STATUS = 307;

  constructor(private store: Store<any>, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let headers = req.headers;
    if (!environment.production) {
      headers = headers
        .set('SM_USER', 'ion.testuser@nielsen.com');
    }
    const apiReq = req.clone({
      url: environment.apiUrlPrefix + req.url,
      headers,
    });
    return next.handle(apiReq).pipe(
      tap((event: any) => {
        if (event instanceof HttpResponse) {
          if (event.status === this.UNAUTHORIZED_STATUS) {
            this.unauthorized();
          } else if (event.status === this.TEMP_REDIRECT_STATUS) {
            // TODO: should be removed once we remove the splash screen
            this.store.dispatch({
              type: APP_ACTIONS.SHOW_SPLASH_SCREEN
            });
          }
        }
      }, (error: any) => {
        if (error instanceof HttpErrorResponse) {
          error = error as HttpErrorResponse;
          if (error.status === this.UNAUTHORIZED_STATUS) {
            this.unauthorized();
          } else if (error.status === this.TEMP_REDIRECT_STATUS) {
            // TODO: should be removed once we remove the splash screen
            this.store.dispatch({
              type: APP_ACTIONS.SHOW_SPLASH_SCREEN
            });
          }
        }
      })
    );
  }

  private unauthorized() {
    // navigating to unauthorized page
    this.router.navigate(['/unauthorized']);
  }
}
