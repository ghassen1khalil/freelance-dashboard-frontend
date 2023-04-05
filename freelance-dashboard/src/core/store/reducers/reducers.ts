import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {AppState} from '../state/app.states';
import {positionReducer} from './position.reducer';
import {eventReducer} from './event.reducer';
import {authReducer} from './auth.reducers';
import {hydrationMetaReducer} from './hydration.reducer';
import {loaderReducer} from './loader.reducers';

export const reducers: ActionReducerMap<AppState> = {
  positionState: positionReducer,
  eventState: eventReducer,
  authState: authReducer,
  loaderState: loaderReducer,
}

export const metaReducers: MetaReducer[] = [
  hydrationMetaReducer
]

