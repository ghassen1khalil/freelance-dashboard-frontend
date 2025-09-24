import {Injectable} from '@angular/core';
import {FreelancerService} from '../../../../generated';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, filter, finalize, map, mergeMap, Observable, of, switchMap, tap} from 'rxjs';
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
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthService} from '@auth0/auth0-angular';
import {EventType} from '../models/models';
import {TranslateService} from '@ngx-translate/core';
import {EventService} from '../../services/event.service';
import {AppRoutes} from '../../utils/app-routes.util';

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
    mergeMap(action => this.freelancerService.login({email: action.email, password: action.password}).pipe(
      mergeMap((freelancer) => {
        return [
          AuthActions.SetAuthStatus({isAuthenticated: true}),
          AuthActions.SetFreelancer({freelancer: freelancer}),
          PositionActions.FetchPositions({tenantId: freelancer.email}),
        ]
      }),
      catchError((error: HttpErrorResponse) => {
        return this.translate.get(['error', 'verifyCredentials']).pipe(
          map((res) => LaunchEvent({
            event: this.eventService.createEventFromLocalizedMessage(
              res,
              'error',
              'verifyCredentials',
              EventType.ERROR
            )
          }))
        );
      }),
      //tap(() => this.router.navigate(['main']))
      tap(() => this.router.navigate([AppRoutes.MAIN]))
    ))
  ));


  LoginViaSocial$: Observable<Action> = createEffect(() => this.action$.pipe(
      ofType(AuthActions.LoginViaSocial),
    switchMap(() => {
      // Start the login process
      this.authService.loginWithRedirect();

      // Return an observable that emits when the user is authenticated
      return this.authService.isAuthenticated$.pipe(
        // Filter to only proceed when authentication is successful
        filter(isAuthenticated => isAuthenticated),
        // Then get the user information
        switchMap(() => this.authService.user$),
        // Then dispatch the FetchPositions action with the user's email
        map((user) => PositionActions.FetchPositions({tenantId: user?.email})),
        catchError(error => of(LoginFailure({error: error}))) //TODO : replace err with an implicit error message instead of returning technical items
      );
    })
    )
  );

  Signup$: Observable<Action> = createEffect(() => this.action$.pipe(
    ofType(AuthActions.Signup),
    mergeMap(action => this.freelancerService.signup(action.freelancer).pipe(
      map((freelancer) => SetFreelancer({freelancer: freelancer})),
      catchError(err => of(SignupFailure({error: err}))), //TODO : replace err with an implicit error message instead of returning technical items
      tap(() => this.router.navigate([AppRoutes.MAIN]))
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
        this.router.navigate([AppRoutes.LOGIN]);
      })
    ))
  ));

  SignupFailureEvent$: Observable<Action> = createEffect(() => this.action$.pipe(
    ofType(SignupFailure),
    switchMap(({ error }) => {
      const code = (error as any)?.error?.code ?? (error as any)?.code;
      const key = code === 'F003' ? 'emailAlreadyUsed' : 'signupError';
      return this.translate.get(['error', key]).pipe(
        map((res) => LaunchEvent({
          event: this.eventService.createEventFromLocalizedMessage(
            res,
            'error',
            key,
            EventType.ERROR
          )
        }))
      );
    })
  ));
}
