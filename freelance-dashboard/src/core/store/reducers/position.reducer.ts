import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import * as PositionActions from '../actions/position.actions';
import {PositionState} from '../state/app.states';

export const initialPositionState: PositionState =
  {
    positions: undefined,
    filter: undefined,
    filteredPositions: undefined,
    positionToEdit: undefined
  };

const _positionReducer = createReducer(
  initialPositionState,
  on(PositionActions.FetchPositionsSuccess, (state, {payload}) => {
    return {...state, positions: payload}
  }),
  /*on(PositionActions.SetPositions, (state, {payload}) => {
    return {...state, positions: payload}
  }),*/
  on(PositionActions.FilterPositions, (state, {keyword}) => {
    return {...state, filter: keyword}
  }),
  on(PositionActions.SetFilteredPositions, (state, {positions}) => {
    return {...state, filteredPositions: positions}
  }),
  on(PositionActions.ResetFilter, (state) => {
    return {...state, filter: undefined}
  }),
  on(PositionActions.EditPosition, (state, {positionToEdit}) => {
    return {...state, positionToEdit: positionToEdit}
  }),
  on(PositionActions.ResetPositionToEdit, (state) => {
    return {...state, positionToEdit: undefined}
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

export const getFilter = createSelector(
  getPositionState,
  (state: PositionState) => state.filter
);

export const getFilteredPositions = createSelector(
  getPositionState,
  (state: PositionState) => state.filteredPositions
);

export const getPositionToEdit = createSelector(
  getPositionState,
  (state: PositionState) => state.positionToEdit
);
