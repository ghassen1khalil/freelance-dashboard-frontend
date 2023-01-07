import {Injectable} from '@angular/core';
import {FreelancerService} from '../../../../generated';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap, Observable, of} from 'rxjs';
import {Action} from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(private freelancerService: FreelancerService,
              private action$: Actions,
              private router: Router) {
  }

  Login$: Observable<Action> = createEffect(() => this.action$.pipe(
    ofType(AuthActions.Login),
    mergeMap(action => this.freelancerService.login(action.email, action.password).pipe(
      map(() => {
        this.router.navigate(['main']);
        return AuthActions.LoginSuccess();
      }),
      catchError((error: HttpErrorResponse) => {
        return of(AuthActions.LoginFailure({error: error}));
      })
    ))
  ));
}
