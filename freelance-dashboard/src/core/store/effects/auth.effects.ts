import {Injectable} from '@angular/core';
import {FreelancerService} from '../../../../generated';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap, Observable, of, switchMap, tap} from 'rxjs';
import {Action} from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';
import {LoginFailure, SetFreelancer, SignupFailure} from '../actions/auth.actions';
import * as PositionActions from '../actions/position.actions';
import * as EventActions from '../actions/event.actions';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthService} from '@auth0/auth0-angular';
import {EventType} from '../models/models';

@Injectable()
export class AuthEffects {
  constructor(private freelancerService: FreelancerService,
              private authService: AuthService,
              private action$: Actions,
              private router: Router) {
  }

  Login$: Observable<Action> = createEffect(() => this.action$.pipe(
    ofType(AuthActions.Login),
    mergeMap(action => this.freelancerService.login(action.email, action.password).pipe(
      mergeMap((freelancer) => {
        return [
          AuthActions.SetAuthStatus({isAuthenticated: true}),
          AuthActions.SetFreelancer({freelancer: freelancer}),
          PositionActions.FetchPositions()
        ]
      }),
      catchError((error: HttpErrorResponse) => {
        return of(AuthActions.LoginFailure({error: error}), EventActions.LaunchEvent({
          event: {
            type: EventType.ERROR,
            title: 'Login Error',
            //body: error.error.message
            body: 'Please verify your credentials' //TODO find a solution for the error (whether use the one from backend or create frontend custom ones to hide the error details)
          }
        }));
      }),
      tap(() => this.router.navigate(['main']))
    ))
  ));

  LoginViaSocial$: Observable<Action> = createEffect(() => this.action$.pipe(
      ofType(AuthActions.LoginViaSocial),
      switchMap(() => this.authService.loginWithRedirect().pipe(
        map(() => PositionActions.FetchPositions()),
        catchError(error => of(LoginFailure({error: error}))) //TODO : replace err with an implicit error message instead of returning technical items
      ))
    )
  );

  Signup$: Observable<Action> = createEffect(() => this.action$.pipe(
    ofType(AuthActions.Signup),
    mergeMap(action => this.freelancerService.signup(action.freelancer).pipe(
      map((freelancer) => SetFreelancer({freelancer: freelancer})),
      catchError(err => of(SignupFailure({error: err}))), //TODO : replace err with an implicit error message instead of returning technical items
      tap(() => this.router.navigate(['main']))
    )),
  ));


  /*Logout$: Observable<Action> = createEffect(() => this.action$.pipe(
    ofType(AuthActions.Logout),
    withLatestFrom(this.authService.isAuthenticated$),
    mergeMap(([action, isAuthenticated]) => {
      if (isAuthenticated) {
        this.authService.logout();
      }
      return [
        SetAuthStatus({isAuthenticated: false}),
        SetFreelancer({freelancer: undefined})
      ]
    })
  ));*/


  Logout$: Observable<Action> = createEffect(() => this.action$.pipe(
    ofType(AuthActions.Logout),
    switchMap(() => {
      return new Observable<Action>((observer) => {
        this.authService.logout();
        observer.complete();
      })
    })
  ));
}
