import {Injectable} from '@angular/core';
import {CanLoad, Route, UrlSegment, UrlTree} from '@angular/router';
import {Observable, of, switchMap} from 'rxjs';
import {AuthService} from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanLoad {

  public constructor(private authService: AuthService) {
  }

  /*canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isAuthenticated$.pipe(
      switchMap((isAuth) => {
        if (isAuth) {
          return of(true);
        } else {
          this.authService.loginWithRedirect();
          return of(false);
        }
      })
    );
  }*/

  /*canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }*/


  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isAuthenticated$.pipe(
      switchMap((isAuth) => {
        if (isAuth) {
          return of(true);
        } else {
          this.authService.loginWithRedirect();
          return of(false);
        }
      })
    );
  }
}
