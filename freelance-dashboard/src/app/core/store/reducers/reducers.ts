import {ActionReducerMap} from '@ngrx/store';
import {AppState} from '../state/app.states';
import {positionReducer} from './position.reducer';
import {eventReducer} from './event.reducer';

export const reducers: ActionReducerMap<AppState> = {
  positionState: positionReducer,
  eventState: eventReducer,
}

