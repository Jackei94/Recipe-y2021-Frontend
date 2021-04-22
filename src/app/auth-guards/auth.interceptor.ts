import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if(request.url === 'https://us-central1-recipeapp-d80f3.cloudfunctions.net/uploadFile' || request.url === 'https://us-central1-recipeapp-d80f3.cloudfunctions.net/deleteFile'){
      return next.handle(request);
    }

    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (loggedUser && loggedUser.token) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${loggedUser.token}`,
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return next.handle(request).pipe( tap(() => {},
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if(err.status === 401 || err.status === 403){
            this.router.navigate(['/login']);
          }
        }
      }));
  }
}
