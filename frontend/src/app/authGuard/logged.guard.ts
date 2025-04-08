import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {map, Observable, take} from 'rxjs';
import {AuthService} from "../service/auth.service";

@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.checkAuth().pipe(
      take(1),
      map((authenticated:any) => {
        if (authenticated) return this.router.createUrlTree(['/dashboard']);
        return true;
      })
    );
  }

}
