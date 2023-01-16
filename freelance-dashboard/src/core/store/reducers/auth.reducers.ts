import {AuthState} from '../state/app.states';
import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import {SetAuthStatus, SetFreelancer, SetToken} from '../actions/auth.actions';

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  freelancer: undefined,
  token: undefined
}

const _authReducer = createReducer(
  initialAuthState,
  on(SetAuthStatus, (state, {isAuthenticated}) => {
    return {...state, isAuthenticated: isAuthenticated}
  }),
  on(SetFreelancer, (state, {freelancer}) => {
    return {...state, freelancer: freelancer}
  }),
  on(SetToken, (state, {token}) => {
    return {...state, token: token}
  }),
);

export function authReducer(
  state: AuthState | undefined,
  action: Action
) {
  return _authReducer(state, action)
}

export const getAuthState = createFeatureSelector<AuthState>('authState');

export const getAuth = createSelector(
  getAuthState,
  (state: AuthState) => state)
