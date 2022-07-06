import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import * as PositionActions from './position.action';
import {PositionState} from './app.states';
import {state} from '@angular/animations';

export const initialPositionState: PositionState = {positions: []};

const _positionReducer = createReducer(
  initialPositionState,
  on(PositionActions.FetchPositions, state => state),
  on(PositionActions.FetchPositionsSuccess, (state, {payload}) => {
    return {...state, positions: payload}
  }),
  // on(PositionActions.SetPositions, (state, {positions}) => ({...state, positions: positions})),
);

export function positionReducer(
  state: PositionState | undefined,
  // state: any,
  action: Action
) {
  return _positionReducer(state, action);
}

export const getPositionState = createFeatureSelector<PositionState>('positionState');

export const getPositions = createSelector(
  getPositionState,
  (state: PositionState) => state.positions
);
