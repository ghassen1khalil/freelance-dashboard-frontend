import {ActionReducerMap} from '@ngrx/store';
import {AppState} from '../state/app.states';
import {positionReducer} from './position.reducer';
import {eventReducer} from './event.reducer';
import {authReducer} from './auth.reducers';

export const reducers: ActionReducerMap<AppState> = {
  positionState: positionReducer,
  eventState: eventReducer,
  authState: authReducer,
}

