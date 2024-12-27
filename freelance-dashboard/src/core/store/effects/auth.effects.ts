import {Injectable} from '@angular/core';
import {FreelancerService} from '../../../../generated';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, finalize, map, mergeMap, Observable, of, switchMap, tap} from 'rxjs';
import {Action} from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';
import {
  LoginFailure,
  ResetPassword,
  SendResetPasswordRequest,
  SetFreelancer,
  SignupFailure
} from '../actions/auth.actions';
import * as PositionActions from '../actions/position.actions';
import {LaunchEvent} from '../actions/event.actions';
import { HttpErrorResponse } from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthService} from '@auth0/auth0-angular';
import {EventType} from '../models/models';
import {TranslateService} from '@ngx-translate/core';
import {EventService} from '../../services/event.service';

@Injectable()
export class AuthEffects {
  constructor(private freelancerService: FreelancerService,
              private authService: AuthService,
              private action$: Actions,
              private router: Router,
              private translate: TranslateService,
              private eventService: EventService,) {
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
        return this.translate.get(['error', 'verifyCredentials']).pipe(
          map((res) => LaunchEvent({event: this.eventService.createEventFromLocalizedMessage(
            res,
              'error',
              'verifyCredentials',
              EventType.ERROR
            )}))
        );
      }),
      //tap(() => this.router.navigate(['main']))
      tap(() => this.router.navigate(['positions']))
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

  Logout$: Observable<Action> = createEffect(() => this.action$.pipe(
    ofType(AuthActions.Logout),
    switchMap(() => {
      return new Observable<Action>((observer) => {
        this.authService.logout();
        observer.complete();
      })
    })
  ));

  SendPasswordResetRequest$: Observable<Action> = createEffect(() => this.action$.pipe(
    ofType(SendResetPasswordRequest),
    switchMap((action) => this.freelancerService.requestResetPassword(action.email).pipe(
      switchMap(() => this.translate.get(['success','passwordResetRequestSent']).pipe(
        map((res) => {
          return LaunchEvent({
            event: this.eventService.createEventFromLocalizedMessage(
              res,
              'success',
              'passwordResetRequestSent',
              EventType.SUCCESS
            )
          })
        })
      )),
      catchError((error) => {
        return this.translate.get(['error','passwordResetRequestSendingError']).pipe(
          map((res) => LaunchEvent({
            event: this.eventService.createEventFromLocalizedMessage(
              res,
              'error',
              'passwordResetRequestSendingError',
              EventType.ERROR)
          }))
        )
      })
    ))
  ));

  ResetPassword$: Observable<Action> = createEffect(() => this.action$.pipe(
    ofType(ResetPassword),
    switchMap((action) => this.freelancerService.resetPassword({
      token: action.token,
      newPassword: action.newPassword,
    }).pipe(
      switchMap(() => this.translate.get(['success','passwordResetSuccessfully']).pipe(
        map((res) => LaunchEvent({
          event: this.eventService.createEventFromLocalizedMessage(
            res,
            'success',
            'passwordResetSuccessfully',
            EventType.SUCCESS
          )
        }))
      )),
      catchError((error) => {
        return this.translate.get(['error','passwordResetError']).pipe(
          map((res) => LaunchEvent({
            event: this.eventService.createEventFromLocalizedMessage(
              res,
              'error',
              'passwordResetError',
              EventType.ERROR)
          }))
        )
        }
      ),
      finalize(() => {
        //TODO create an Enum for all routes
        this.router.navigate(['/login']);
      })
    ))
  ));
}
