import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {catchError, map, Observable, of, switchMap, take} from 'rxjs';
import {AuthService} from "../service/auth.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {jwtDecode} from "jwt-decode";
import {SessionExpiredComponent} from "../layout/popup/session-expired/session-expired.component";
import {NbDialogService} from "@nebular/theme";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private dialogService: NbDialogService,
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
      const tokenExpiration = decoded.exp * 1000;
      const now = Date.now();

      if (tokenExpiration < now) {
        this.openPopup(); // Show popup before refresh
        return this.refreshTokenAndRetry(state.url);
      }
    } catch (error) {
      console.error("Token decoding error:", error);
      this.openPopup(); // Show popup before refresh
      return this.refreshTokenAndRetry(state.url);
    }

    return this.http.get(`${baseUrl}/login/auth`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      take(1),
      map(() => true),
      catchError((error) => {
        console.error("Auth verification failed:", error);
        this.openPopup(); // Show popup before refresh
        return this.refreshTokenAndRetry(state.url);
      })
    );
  }

  private refreshTokenAndRetry(returnUrl: string): Observable<boolean | UrlTree> {
    return this.authService.refreshToken().pipe(
      take(1),
      switchMap((refreshResponse) => {
        console.log("refreshResponse", refreshResponse);

        if (refreshResponse && refreshResponse.accesstoken) {
          sessionStorage.setItem('travelT_token', refreshResponse.accesstoken);

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

  private openPopup(): void {
    let dialogRef = this.dialogService.open(SessionExpiredComponent);
    dialogRef.componentRef.instance.title = 'Session Expired'; // Set title dynamically
  }
}
