import {PasswordResetTokenState} from '../state/app.states';
import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import {PasswordResetTokenNotValid} from '../actions/password-reset-token.actions';

export const initialPasswordResetTokenState: PasswordResetTokenState = {
  isTokenValid: true,
}

const _passwordResetTokenReducer = createReducer(
  initialPasswordResetTokenState,
  on(PasswordResetTokenNotValid, (state) => {
      return {...state, isTokenValid: false}
    }
  )
);

export function passwordResetTokenReducer(
  state: PasswordResetTokenState | undefined,
  action: Action
) {
  return _passwordResetTokenReducer(state, action)
}

export const getPasswordResetTokenState = createFeatureSelector<PasswordResetTokenState>('passwordResetTokenState');

export const getPasswordResetToken = createSelector(
  getPasswordResetTokenState,
  (state: PasswordResetTokenState) => state
)
