import {createAction, props} from '@ngrx/store';
import {Freelancer} from '../../../../generated';
import {HttpErrorResponse} from '@angular/common/http';

export const SetFreelancer = createAction(
  '[AUTH] - Set Freelancer',
  props<{ freelancer: Freelancer | undefined }>()
);

export const SetAuthStatus = createAction(
  '[AUTH] - Set Authentication Status',
  props<{ isAuthenticated: boolean }>()
);

export const SetToken = createAction(
  '[AUTH] - Set Token',
  props<{ token: string }>()
);

export const Login = createAction(
  '[AUTH] - Login',
  props<{ email: string, password: string }>()
);

export const LoginSuccess = createAction(
  '[AUTH] - Login success'
);


export const LoginViaSocial = createAction(
  '[AUTH] - Login via social'
);

export const LoginFailure = createAction(
  '[AUTH] - Login Failure',
  props<{ error: HttpErrorResponse }>()
);


export const Signup = createAction(
  '[AUTH] - Signup',
  props<{ freelancer: Freelancer }>()
);

export const SignupViaSocial = createAction(
  '[AUTH] - Signup'
);

export const SignupFailure = createAction(
  '[AUTH] - Signup Failure',
  props<{ error: HttpErrorResponse }>()
);

export const Logout = createAction(
  '[AUTH] - Logout',
);

export const SendResetPasswordRequest = createAction(
  '[AUTH] - Send Reset Password Request',
  props<{ email: string }>()
);

export const ResetPassword = createAction(
  '[AUTH] - Reset Password',
  props<{ token: string, newPassword: string }>()
);
