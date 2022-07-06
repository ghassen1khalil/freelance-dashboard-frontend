import {ActionReducerMap, State} from '@ngrx/store';
import {AppState} from './app.states';
import {positionReducer} from './position.reducer';

export const reducers: ActionReducerMap<AppState> = {
  positionState: positionReducer,
}

/*
export const selectPositions = (state: State) => state.positions;

export interface State {
  positions: fromApis.State;
}
*/
