import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {catchError, map, Observable, of, switchMap, take} from 'rxjs';
import {AuthService} from "../service/auth.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
  ) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = sessionStorage.getItem('travelT_token');
    const baseUrl = environment.baseUrl;
    if (!token) {
      return of(this.router.createUrlTree(['/dashboard'], {queryParams: {returnUrl: state.url}}));
    }
    // **Decode JWT Token & Check Expiry**
    try {
      const decoded: any = jwtDecode(token);
      const tokenExpiration = decoded.exp * 1000; // Convert to milliseconds
      const now = Date.now();

      if (tokenExpiration < now) {
        return this.refreshTokenAndRetry(state.url);
      }
    } catch (error) {
      console.error("Token decoding error:", error);
      return this.refreshTokenAndRetry(state.url);
    }

    // **Verify Token with Backend**
    return this.http.get(`${baseUrl}/login/auth`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      take(1),
      map(() => true),
      catchError((error) => {
        console.error("Auth verification failed:", error);
        return this.refreshTokenAndRetry(state.url);
      })
    );
  }

  // **Handle Token Refresh**
  private refreshTokenAndRetry(returnUrl: string): Observable<boolean | UrlTree> {
    return this.authService.refreshToken().pipe(
      take(1),
      switchMap((refreshResponse) => {
        console.log("refreshResponse", refreshResponse);

        if (refreshResponse && refreshResponse.accesstoken) {
          sessionStorage.setItem('travelT_token', refreshResponse.accesstoken);

          // **Retry authentication with new token**
          return this.http.get(`${environment.baseUrl}/login/auth`, {
            headers: { Authorization: `Bearer ${refreshResponse.accesstoken}` }
          }).pipe(
            take(1),
            map(() => true),
            catchError(() => of(this.router.createUrlTree(['/dashboard'], { queryParams: { returnUrl } })))
          );
        }

        sessionStorage.clear();
        return of(this.router.createUrlTree(['/dashboard'], { queryParams: { returnUrl } }));
      }),
      catchError(() => {
        sessionStorage.clear();
        return of(this.router.createUrlTree(['/dashboard'], { queryParams: { returnUrl } }));
      })
    );
  }


}
