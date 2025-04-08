import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AuthRequest,AuthResponse} from "../shared/models/auth.request";
import {BehaviorSubject, catchError, map, Observable, of, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.baseUrl;
  private authStatus = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  login(loginObj:AuthRequest):Observable<AuthResponse>{
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/login`,
      loginObj,
      {withCredentials: true}
    ).pipe(
      map(response => { return response}),
      catchError(this.handleError)
    );
  }

  register(registerObj:AuthRequest):Observable<any>{
    return this.http.post<AuthRequest>(
      `${this.baseUrl}/signup`,
      registerObj,
      {observe: 'response'}
    ).pipe(
      map((response:any) => { return response}),
      catchError(this.handleError)
    )
  }

  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMsg = 'Unknown error';
    this.authStatus.next(false);
    if(error.error instanceof ErrorEvent) {
      errorMsg = `Error: ${error.error.message}`; // handle if the error occurred in browser like network failure
    }else{
      switch(error.status) {
        case 400:
          errorMsg = "Invalid email or password";
          break;
        case 401:
          errorMsg = "Authentication failed";
          break;
        case 403:
          errorMsg = "Forbidden";
          break;
        default:
          errorMsg = `Error: ${error.status}`;
      }
    }
    return throwError(() => new Error(errorMsg));
  }

  logout(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/logout`,
      {observe: 'response'}
    ).pipe(
      map(response => {
        this.authStatus.next(false);
        return response
      }),
      catchError(this.handleError)
    )
  }

  checkAuth(): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/login/auth`).pipe(
      map((response: any) => {
        this.authStatus.next(response.authenticated);
        return response.authenticated;
      }),
      catchError(() => {
        this.authStatus.next(false);
        return of(false);
      })
    );
  }
}
