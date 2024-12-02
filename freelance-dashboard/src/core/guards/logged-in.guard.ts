import {Injectable} from '@angular/core';
import {CanActivate, CanLoad, Route, Router, UrlSegment, UrlTree} from '@angular/router';
import {Observable, of, switchMap} from 'rxjs';
import {AuthService} from '@auth0/auth0-angular';
import {select, Store} from '@ngrx/store';
import * as authReducer from '../store/reducers/auth.reducers';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanLoad {

  public constructor(private authService: AuthService,
                     private store: Store,
                     private router: Router) {
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.pipe(
      select(authReducer.getAuth)).pipe(
      switchMap((authState) => {
        if (authState.isAuthenticated) {
          return of(true);
        } else {
          this.router.navigate(['login']);
          return of(false)
        }
      })
    );

    /*return this.authService.isAuthenticated$.pipe(
      switchMap((isAuth) => {
        if (isAuth) {
          return of(true);
        } else {
          //this.authService.loginWithRedirect();
          return of(false);
        }
      })
    );*/
  }
}
