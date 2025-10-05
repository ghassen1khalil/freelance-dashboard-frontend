import {createAction, props} from '@ngrx/store';

export const CheckPasswordResetToken = createAction(
  '[PASSWORD RESET TOKEN] - Check token validity',
  props<{ passwordResetToken: string }>()
);

export const PasswordResetTokenNotValid = createAction(
  '[PASSWORD RESET TOKEN] - Token is not valid'
);
