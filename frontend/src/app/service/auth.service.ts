import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AuthRequest, AuthResponse, Registry} from "../shared/models/auth.request";
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

  register(registerObj:Registry):Observable<any>{
    return this.http.post<any>(
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

  checkAuth(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/login/auth`);
  }

  refreshToken(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/refresh`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(() => {
        return of(false);
      })
    )
  }

  userList(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/defaults/usernameList`);
  }
}
