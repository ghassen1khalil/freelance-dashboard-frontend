import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import {Observable, of, switchMap} from 'rxjs';
import {AuthService} from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root'
})
export class LoggedOutGuard  {

  constructor(private authService: AuthService) {
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAccessAllowed();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAccessAllowed();
  }

  private isAccessAllowed(): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      switchMap((isAuth) => {
        if (isAuth) {
          return of(false);
        } else {
          return of(true);
        }
      })
    );
  }
}
