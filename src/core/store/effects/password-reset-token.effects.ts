import {FreelancerService} from '../../../../generated';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {catchError, Observable, of, switchMap} from 'rxjs';
import {Action} from '@ngrx/store';
import {CheckPasswordResetToken, PasswordResetTokenNotValid} from '../actions/password-reset-token.actions';

@Injectable()
export class PasswordResetTokenEffects {
  constructor(private freelancerService: FreelancerService,
              private action$: Actions) {
  }

  //TODO refactor
  CheckPasswordResetTokenValidity$: Observable<Action> = createEffect(() => this.action$.pipe(
    ofType(CheckPasswordResetToken),
    switchMap((action) => this.freelancerService.validatePasswordResetToken(action.passwordResetToken).pipe(
      switchMap(() => of({type: 'NO_ACTION'})),
      catchError((error) => of(PasswordResetTokenNotValid()))
    ))
  ));
}
