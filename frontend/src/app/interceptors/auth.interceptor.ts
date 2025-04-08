import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse, HttpClient
} from '@angular/common/http';
import {catchError, Observable, switchMap, throwError} from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  static accessToken = '';
  baseUrl = environment.baseUrl;
  refresh: boolean = false;
  constructor(private http: HttpClient) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const req = request.clone({
      setHeaders: {
        Authorization: `Bearer ${AuthInterceptor.accessToken}`
      }
    });
    return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
      console.log("error",err);
      if((err.status === 401 || err.status === 403) && !this.refresh ) {
        this.refresh = true;
        console.log("Unauthorized");
        return this.http.get(
          `${this.baseUrl}/refresh`,
        )
          .pipe(
            switchMap((res:any) => {
              AuthInterceptor.accessToken = res?.accessToken;

              return next.handle(
                request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${AuthInterceptor.accessToken}`
                  }
                }))
            })
          )
      }
      this.refresh = false;
      return throwError(() => err);
    }))
  }
}
