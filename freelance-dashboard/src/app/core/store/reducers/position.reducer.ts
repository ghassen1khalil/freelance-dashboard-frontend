import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import * as PositionActions from '../actions/position.action';
import {PositionState} from '../state/app.states';

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
  action: Action
) {
  return _positionReducer(state, action);
}

export const getPositionState = createFeatureSelector<PositionState>('positionState');

export const getPositions = createSelector(
  getPositionState,
  (state: PositionState) => state.positions
);
