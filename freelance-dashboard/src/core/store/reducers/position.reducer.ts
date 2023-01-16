import {Action, createFeatureSelector, createReducer, createSelector, on, select} from '@ngrx/store';
import * as PositionActions from '../actions/position.actions';
import {PositionState} from '../state/app.states';

export const initialPositionState: PositionState = {positions: []};

const _positionReducer = createReducer(
  initialPositionState,
  on(PositionActions.FetchPositionsSuccess, (state, {payload}) => {
    return {...state, positions: payload}
  })
);

export function positionReducer(
  state: PositionState | undefined,
  action: Action
) {
  return _positionReducer(state, action);
}

export const getPositionState = createFeatureSelector<PositionState>('positionState');

export const getPositions = createSelector(
  getPositionState,
  (state: PositionState) => state.positions
);
